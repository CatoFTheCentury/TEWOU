import Collision from './_collision';
import { Bodies } from "../alacrity/_bodies"
import * as C from "./states"
import * as T from "../_type"

export type CaptureProperties = {
  collideswith: C.CollideLayers,
  type: C.CollideTypes,
  hitbox: T.Bounds,
  owner : Bodies.Embodiment,
  oncollision: (owner: Bodies.Embodiment, target: Bodies.Alacrity) => boolean
}

export class Capture extends Collision {
  private hitbox : T.Bounds;
  private owner  : Bodies.Embodiment;
  private oncollision   : (owner: Bodies.Embodiment,target: Bodies.Embodiment)=>boolean;
  
  constructor(collideswith : C.CollideLayers, type : C.CollideTypes, owner: Bodies.Embodiment, hitbox: T.Bounds, oncollision: (owner: Bodies.Embodiment,target: Bodies.Alacrity)=>boolean){
    super(C.CollideLayers.none,collideswith,type);
    this.owner        = owner ;
    this.hitbox       = hitbox;
    this.oncollision  = oncollision  ;
    owner.collisions.push(this);
  }


  protected intersect(bd : Bodies.Embodiment){ // bd == to
    let rectA = {x:this.owner.pos.x + this.hitbox.x, y: this.owner.pos.y + this.hitbox.y, w: this.hitbox.w, h:this.hitbox.h};
    let rectB = {x:bd.pos.x+bd.hitbox.x,y:bd.pos.y+bd.hitbox.y,w:bd.hitbox.w,h:bd.hitbox.h};
    // overlap
    if((rectA.x < rectB.x + rectB.w && rectA.x + rectA.w > rectB.x && rectA.y < rectB.y + rectB.h && rectA.y + rectA.h > rectB.y)){
      if(this.deleteMe == false) this.deleteMe = this.oncollision(this.owner,bd);
      // el
    }
  }
}