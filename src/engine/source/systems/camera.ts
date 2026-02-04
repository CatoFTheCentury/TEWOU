import {Bodies} from '../alacrity/_bodies'
import {System} from './_system';
import * as T from '../_type';
import Cameraman from './cameraman';

export default class Camera extends System {
  public viewport  : T.Bounds;
  private bounds   : T.Bounds;
  public scale     : T.Point = {x:1,y:1}; 
  public cameraman : Cameraman;
  
  constructor(size: T.Box, bounds: T.Bounds){
    super();
    this.viewport = {x:0,y:0,w:size.w,h:size.h};
    this.bounds = bounds;
    this.cameraman = new Cameraman(this);
  }

  public refresh(){

    this.viewport.x = 
      this.cameraman.actor.pos.x - this.viewport.w / 2 + this.cameraman.actor.hitbox.w / 2  + this.cameraman.actor.hitbox.x   > this.bounds.x
      ? (this.cameraman.actor.pos.x + this.viewport.w / 2 + this.cameraman.actor.hitbox.w / 2  + this.cameraman.actor.hitbox.x> this.bounds.w 
      ? this.bounds.w - this.viewport.w 
      : Math.floor(this.cameraman.actor.pos.x - this.viewport.w / 2 + this.cameraman.actor.hitbox.w / 2 + this.cameraman.actor.hitbox.x))
      : this.bounds.x;
      
    this.viewport.y = 
      this.cameraman.actor.pos.y - this.viewport.h / 2 + this.cameraman.actor.hitbox.h / 2 + this.cameraman.actor.hitbox.y    > this.bounds.y 
      ? (this.cameraman.actor.pos.y + this.viewport.h / 2 + this.cameraman.actor.hitbox.h / 2 + this.cameraman.actor.hitbox.y > this.bounds.h
      ? this.bounds.h - this.viewport.h 
      : Math.floor(this.cameraman.actor.pos.y - this.viewport.h / 2 + this.cameraman.actor.hitbox.h / 2 + this.cameraman.actor.hitbox.y))
      : this.bounds.y;

  }

  public setBounds(bounds:T.Bounds){
    this.bounds = bounds;
  }

  // old and may not work
  public worldToScreen(actor: Bodies.Embodiment): T.Point{
    return {x:actor.pos.x - this.viewport.x, y:actor.pos.y - this.viewport.y};
  }


}