import * as C       from './states'
import {Bodies}   from '../alacrity/_bodies'
import * as T       from '../_type'

import Collision from "./_collision"
// import Game from '../../game/games';
// import Games from '../../game/games';

export class CollisionGrid extends Collision{
  
  // public npc;
  public padding : T.Point = {x:2,y:2};

  public resolution : number = 16;

  private walls : Array<Array<number>> = []; // walls[y][x]
  // private game  : Games;
  // private square  : number;
  // private displaytileSize  : number;
  // prote padding : T.Box = {w:1,h:1};

  private static sizeBit : number = 5; //32 bit
  private static bitSize : number = 1 << this.sizeBit;
  private ylimit : number;
  private xlimit : number;

  
  constructor(boolArr : Array<Array<boolean>>, resolution: number, to : C.CollideLayers, type : C.CollideTypes){
    super(C.CollideLayers.grid, to, type);
    this.ylimit = boolArr.length;
    let gridwidth: number = boolArr[0].length;
    this.xlimit = Math.ceil(boolArr[0].length / CollisionGrid.bitSize);
    // console.log(boolArr)
    let flatArr = boolArr.flat(Infinity);
    let passes = 0;

    this.resolution = resolution;

    for(let idx = 0; idx < flatArr.length; idx+=gridwidth){
      // console.log("/")
      this.walls.push(Array<number>());

      // let bAidx : number;
      
      for(let i = 0; i < gridwidth; i+= CollisionGrid.bitSize){
        let stuff : number = 0;


        for(let bAidx = 0; bAidx < CollisionGrid.bitSize; bAidx++){
          if(i+bAidx >= gridwidth) break;
          if (flatArr[idx+i+bAidx] == true){
            stuff |= 1 << bAidx;
          }
        }
        // console.log(stuff);
        this.walls[passes].push(stuff);
      }

      passes += 1;
      // idx += game.levelWidth;
    }
    // console.log(this.walls);
  }

  //gXbd and gYbd are in grid coordinates
  private againstGrid(gXbd:number, gYbd:number, bdX : number) : boolean{
    let xIndex : number = gXbd;
    let yIndex : number = gYbd;
    if(yIndex >= this.ylimit || yIndex < 0) return false;

    const bitX : number = Math.floor(((bdX) / this.resolution)) % (CollisionGrid.bitSize);//CollisionGrid.sizeBit;
    let bShift : number = bitX;
    let checkX : number = 1 << bShift;

    if(xIndex >= this.xlimit || xIndex < 0) return false;
    return ((this.walls[yIndex][xIndex] & checkX) != 0);
  }

  public testWall(point: T.Point){
    return this.againstGrid
    (Math.floor(point.x/this.resolution) >>> CollisionGrid.sizeBit,
    Math.floor(point.y/this.resolution),
    point.x);
  }

  /**
   * 
   * @param arch 
   * @returns 0 up to 3 right boolean array of if a wall is nearby in each direction
   */
  public intersect(bd : Bodies.Embodiment) : void {
    // if(bd.dbgName=="scorpion"){
    //   console.log("TOUTE");
    // }
    
    const collidePoints : Array<Array<Array<number>>> = this.computeCollidePoints(
      {x: bd.pos.x + bd.hitbox.x, y: bd.pos.y + bd.hitbox.y, w: bd.hitbox.w, h: bd.hitbox.h}, this.padding, 
      {w:this.resolution, h: this.resolution}, CollisionGrid.sizeBit);

    // console.log("Collide Points:", collidePoints);

    //check top
    this.checkCollisionDirection(bd, 0, 
      collidePoints[0][0][0],collidePoints[0][1][0], bd.pos.x + bd.hitbox.x + 2 * this.padding.x,
      collidePoints[0][0][1],collidePoints[0][1][1], bd.pos.x + bd.hitbox.x + bd.hitbox.w - 2 * this.padding.x)

    //check left
    this.checkCollisionDirection(bd, 1, 
      // collidePoints[1][0][0],collidePoints[1][1][0], collidePoints[1][0][0],
      // collidePoints[1][0][1],collidePoints[1][1][1], collidePoints[1][0][1])
      collidePoints[1][0][0],collidePoints[1][1][0], bd.pos.x + bd.hitbox.x,
      collidePoints[1][0][1],collidePoints[1][1][1], bd.pos.x + bd.hitbox.x)

    //check below
    this.checkCollisionDirection(bd, 2, 
      collidePoints[2][0][0],collidePoints[2][1][0], bd.pos.x + bd.hitbox.x + 2 * this.padding.x,
      collidePoints[2][0][1],collidePoints[2][1][1], bd.pos.x + bd.hitbox.x + bd.hitbox.w - 2 * this.padding.x)

    //check right
    this.checkCollisionDirection(bd, 3, 
      collidePoints[3][0][0],collidePoints[3][1][0], bd.pos.x + bd.hitbox.x + bd.hitbox.w - this.padding.x,
      collidePoints[3][0][1],collidePoints[3][1][1], bd.pos.x + bd.hitbox.x + bd.hitbox.w - this.padding.x)

      // return result;
  }

  private checkCollisionDirection(
    bd: Bodies.Embodiment,
    direction: number,
    x1: number, y1: number, posX1: number,
    x2: number, y2: number, posX2: number
    ): void {
        const collision1 = this.againstGrid(x1, y1, posX1);
        const collision2 = this.againstGrid(x2, y2, posX2);
        // console.log(`Direction: ${direction}, Collision1: ${collision1}, Collision2: ${collision2}`);

        bd.activeeffects[direction] |=
            collision1 || collision2
                ? this.type
                : C.CollideTypes.none;
    }
}


