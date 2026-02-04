import * as T    from "../_type"

import {Bodies} from "../alacrity/_bodies";
import {CollideLayers, CollideTypes} from "./states"


export default abstract class Collision {
  protected abstract intersect(target : Bodies.Embodiment) : void;

  public deleteMe : boolean = false;

  
  public from : CollideLayers;
  public cwith : CollideLayers;
  public type   : CollideTypes ;
  public self   : Bodies.Embodiment;

  // public offY   : number;
  // public offX   : number;
  // public width  : number;
  // public height : number;

  // public ogBounds : T.Bounds = {x:0, y:0, w:0,h:0};


  protected padding : T.Point = {x:1,y:1};


  constructor(from: CollideLayers, cwith : CollideLayers, type : CollideTypes){
    this.from    = from;
    this.cwith   = cwith;
    this.type    = type;
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



  protected computeCollidePoints(bd : T.Bounds, padding : T.Point = {x:1,y:1}, res : T.Box = {w:1,h:1}, bitcount : number = 0) :
  Array<Array<Array<number>>>{
    let cornerindices = [[
 /* [0][0] */   Math.max(0,Math.floor(           (bd.x + padding.x * 2)        / res.w)) >>> bitcount,
 /* [0][1] */   Math.max(0,Math.floor(           (bd.x)                        / res.w)) >>> bitcount,
 /* [0][2] */   Math.max(0,Math.floor(           (bd.x + bd.w - padding.x * 2) / res.w)) >>> bitcount,
 /* [0][3] */   Math.max(0,Math.floor(           (bd.x + bd.w)                 / res.w)) >>> bitcount
    ],[
 /* [1][0] */   Math.max(0,Math.floor(           (bd.y + padding.y * 2)        / res.h)),
 /* [1][1] */   Math.max(0,Math.floor(           (bd.y)                        / res.h)),
 /* [1][2] */   Math.max(0,Math.floor(           (bd.y + bd.h - padding.y * 2) / res.h)),
 /* [1][3] */   Math.max(0,Math.floor(           (bd.y + bd.h)                 / res.h))
    ]]
    // [dir][xy][pt#]
    return [
        [[cornerindices[0][0],cornerindices[0][2]],[cornerindices[1][1],cornerindices[1][1]]],
        [[cornerindices[0][1],cornerindices[0][1]],[cornerindices[1][0],cornerindices[1][2]]],
        [[cornerindices[0][0],cornerindices[0][2]],[cornerindices[1][3],cornerindices[1][3]]],
        [[cornerindices[0][3],cornerindices[0][3]],[cornerindices[1][0],cornerindices[1][2]]]
      ]
  }
}




