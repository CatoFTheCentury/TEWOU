import {Bodies} from '../alacrity/_bodies'
import System from './_system';
import * as T from '../_type';

export default class Camera extends System {
  public viewport : T.Bounds;
  private bounds  : T.Bounds;
  public actor   : Bodies.Embodiment;
  
  constructor(actor: Bodies.Embodiment, size: T.Box, bounds: T.Bounds){
    super();
    this.actor = actor;
    this.viewport = {x:0,y:0,w:size.w,h:size.h};
    this.bounds = bounds;
  }

  public refresh(){
    this.viewport.x = 
      this.actor.pos.x - this.viewport.w / 2 + this.actor.hitbox.w / 2  + this.actor.hitbox.x> this.bounds.x ? 
      (this.actor.pos.x + this.viewport.w / 2 + this.actor.hitbox.w / 2  + this.actor.hitbox.x> this.bounds.w ? 
      this.bounds.w - this.viewport.w : Math.floor(this.actor.pos.x - this.viewport.w / 2 + this.actor.hitbox.w / 2 + this.actor.hitbox.x)): this.bounds.x;
    this.viewport.y = 
      this.actor.pos.y - this.viewport.h / 2 + this.actor.hitbox.h / 2 + this.actor.hitbox.y> this.bounds.y ? 
      (this.actor.pos.y + this.viewport.h / 2 + this.actor.hitbox.h / 2 + this.actor.hitbox.y> this.bounds.h ? 
      this.bounds.h - this.viewport.h : Math.floor(this.actor.pos.y - this.viewport.h / 2 + this.actor.hitbox.h / 2+ this.actor.hitbox.y)): this.bounds.y;
  }

  public worldtoscreen(actor: Bodies.Embodiment): T.Point{
    return {x:actor.pos.x - this.viewport.x, y:actor.pos.y - this.viewport.y};
  }


}