import Collision from './_collision';
import { Bodies } from "../alacrity/_bodies"
import * as C from "./states"
import * as T from "../_type"


export default class Capture extends Collision {
  private hitbox : T.Bounds;
  private owner  : Bodies.Embodiment;
  private call   : (owner: Bodies.Embodiment,target: Bodies.Embodiment)=>boolean;
  
  constructor(from : C.CollideLayers, to : C.CollideLayers, type : C.CollideTypes, owner: Bodies.Embodiment, hitbox: T.Bounds, call: (owner: Bodies.Embodiment,target: Bodies.Alacrity)=>boolean){
    super(from,to,type);
    this.owner  = owner ;
    this.hitbox = hitbox;
    this.call   = call  ;

  }


  protected intersect(bd : Bodies.Embodiment){ // bd == to
    let rectA = {x:this.owner.pos.x + this.hitbox.x, y: this.owner.pos.y + this.hitbox.y, w: this.hitbox.w, h:this.hitbox.h};
    let rectB = {x:bd.pos.x+bd.hitbox.x,y:bd.pos.y+bd.hitbox.y,w:bd.hitbox.w,h:bd.hitbox.h};
    // overlap
    if((rectA.x < rectB.x + rectB.w && rectA.x + rectA.w > rectB.x && rectA.y < rectB.y + rectB.h && rectA.y + rectA.h > rectB.y)){
      this.deleteMe = this.call(this.owner,bd);
    }

       

        
    // this.deleteMe = true;
  }
}

// overlap
    // if(((Math.max(bd1.x,bd2.x)>=Math.min(bd1.x,bd2.x) && Math.max(bd1.x,bd2.x) <= Math.max(bd1.x+bd1.w,bd2.x+bd2.w)) ||
    //      Math.min(bd1.x+bd1.w,bd2.x+bx2.w) >= Math.min(bd1.x,bd2.x) && Math.min(bd1.x+bd1.w,bd2.x+bd2.w) <= Math.max(bd1.x+bd1.w,bd2.x+bd2.w)) &&
    //    ((Math.max(bd1.y,bd2.y)>=Math.min(bd1.y,bd2.y) && Math.max(bd1.y,bd2.y) <= Math.max(bd1.y+bd1.h,bd2.y+bd2.h)) ||
    //      Math.min(bd1.y+bd1.h,bd2.y+bx2.h) >= Math.min(bd1.y,bd2.y) && Math.min(bd1.y+bd1.h,bd2.y+bd2.h) <= Math.max(bd1.y+bd1.h,bd2.y+bd2.h)))
