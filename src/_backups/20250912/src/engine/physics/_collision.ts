import * as T    from "../_type"

import {Bodies} from "../alacrity/_bodies";
import {CollideLayers, CollideTypes} from "./states"


export default abstract class Collision {
  protected abstract intersect(bd : Bodies.Embodiment) : void;

  public deleteMe : boolean = false;

  // public cpool : Array<Collision> = [];

  // public dbgName : string = "not defined collision";
  
  public from : CollideLayers;
  public to : CollideLayers;
  public type   : CollideTypes ;
  public self   : Bodies.Embodiment;

  public offY   : number;
  public offX   : number;
  public width  : number;
  public height : number;

  public ogBounds : T.Bounds = {x:0, y:0, w:0,h:0};


  protected padding : T.Point = {x:1,y:1};


  constructor(from : CollideLayers, to : CollideLayers, type : CollideTypes){
    this.from    = from;
    this.to      = to  ;
    this.type    = type;
    // this.padding = padding * Globals.zoom;
    // this.npc = null;
    // this.cpool.push(this);


  }

  public update(to: Set<Bodies.Embodiment>): void {
    for(let e of to){
      this.intersect(e);
    }
  }


  protected static inBounds(x:number, y:number, bounds : T.Bounds){
    return  x > bounds.x &&
            x < bounds.x + bounds.w &&
            y > bounds.y &&
            y < bounds.y + bounds.h;
  }



  protected computeCollidePoints(bd : T.Bounds, padding : T.Point = {x:1,y:1}, res : T.Box = {w:1,h:1}, sizeBit : number = 0) :
  Array<Array<Array<number>>>{
    let mercy = [[
 /* [0][0] */   Math.max(0,Math.floor(           (bd.x + padding.x * 2)        / res.w)) >>> sizeBit,
 /* [0][1] */   Math.max(0,Math.floor(           (bd.x)                        / res.w)) >>> sizeBit,
 /* [0][2] */   Math.max(0,Math.floor(           (bd.x + bd.w - padding.x * 2) / res.w)) >>> sizeBit,
 /* [0][3] */   Math.max(0,Math.floor(           (bd.x + bd.w)                 / res.w)) >>> sizeBit
    ],[
 /* [1][0] */   Math.max(0,Math.floor(           (bd.y + padding.y * 2)        / res.h)),
 /* [1][1] */   Math.max(0,Math.floor(           (bd.y)                        / res.h)),
 /* [1][2] */   Math.max(0,Math.floor(           (bd.y + bd.h - padding.y * 2) / res.h)),
 /* [1][3] */   Math.max(0,Math.floor(           (bd.y + bd.h)                 / res.h))
    ]]
    // [dir][xy][pt#]
    return [
        [[mercy[0][0],mercy[0][2]],[mercy[1][1],mercy[1][1]]],
        [[mercy[0][1],mercy[0][1]],[mercy[1][0],mercy[1][2]]],
        [[mercy[0][0],mercy[0][2]],[mercy[1][3],mercy[1][3]]],
        [[mercy[0][3],mercy[0][3]],[mercy[1][0],mercy[1][2]]]
      ]
  }
}




