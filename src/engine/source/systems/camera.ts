import {Bodies} from '../alacrity/_bodies'
import {System} from './_system';
import * as T from '../_type';
import { Render } from '../render/_render';
import Cameraman from './cameraman';

export default class Camera extends System {
  public viewport  : T.Bounds;
  private bounds   : T.Bounds;
  // public actor     : Bodies.Embodiment;
  public scale     : T.Point = {x:1,y:1}; 
  public cameraman : Cameraman;
  
  constructor(/* actor: Bodies.Embodiment,  */size: T.Box, bounds: T.Bounds){
    super();
    // this.actor = actor;
    this.viewport = {x:0,y:0,w:size.w,h:size.h};
    this.bounds = bounds;
    this.cameraman = new Cameraman(this);
  }

  public refresh(){
    // this.viewport.w  = Math.floor(this.viewport.w / this.scale.x);;
    // Render.Info.gl.canvas.height = Math.floor(this.viewport.h / this.scale.y);

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

  public setbounds(bounds:T.Bounds){
    this.bounds = bounds;
  }

  // old and may not work
  public worldtoscreen(actor: Bodies.Embodiment): T.Point{
    return {x:actor.pos.x - this.viewport.x, y:actor.pos.y - this.viewport.y};
  }


}