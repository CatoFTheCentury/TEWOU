import * as T from '../_type'
import {System} from './_system'
import { Bodies } from '../alacrity/_bodies'
import { Time } from '../alacrity/time';
import Camera from './camera';


enum Actions {
  idle = 0,
  pan  = 1,
  zoom = 2
}

export default class Cameraman extends System {
  public action : Actions = Actions.idle;
  public actor  : Bodies.Existence;
  public freemovement : Bodies.Existence;
  private callback : ()=>void = ()=>{};
  private camera   : Camera;

  private pan    : Array<T.Point> = []; //from, distance
  private zoom   : Array<T.Point> = []; //from, distance

  constructor(camera: Camera){
    super(true);
    this.freemovement = new Bodies.Existence();
    this.camera = camera;
  }

  public refresh(){
    if(this.action == Actions.idle) return;
    if(this.action == Actions.pan){
      while(this.actor.triggers.length > 0){
        let trig: Time.Trigger = this.actor.triggers.pop() || {name:''};
        if(trig.name == 'pan'){
          if(trig.state == 'active'){
            this.actor.pos.x = this.pan[0].x + ((this.actor.timeouts[0].getTimeoutTicks() / this.actor.timeouts[0].ms[0]) * this.pan[1].x)
            this.actor.pos.y = this.pan[0].y + ((this.actor.timeouts[0].getTimeoutTicks() / this.actor.timeouts[0].ms[0]) * this.pan[1].y)
            console.log(this.actor.pos);
          }
          if(trig.state == 'triggered'){
            this.actor.timeouts = [];
            this.action = Actions.idle;
            this.callback();
          }
        
        }   
      }
    }
    if(this.action == Actions.zoom){
      while(this.actor.triggers.length > 0){
        let trig: Time.Trigger = this.actor.triggers.pop() || {name:''};
        if(trig.name == 'zoom'){
          if(trig.state == 'active'){
            this.actor.pos.x = this.pan[0].x + ((this.actor.timeouts[0].getTimeoutTicks() / this.actor.timeouts[0].ms[0]) * this.pan[1].x)
            this.actor.pos.y = this.pan[0].y + ((this.actor.timeouts[0].getTimeoutTicks() / this.actor.timeouts[0].ms[0]) * this.pan[1].y)
            this.camera.scale.x = this.zoom[0].x + ((this.actor.timeouts[0].getTimeoutTicks() / this.actor.timeouts[0].ms[0]) * this.zoom[1].x);
            this.camera.scale.y = this.zoom[0].y + ((this.actor.timeouts[0].getTimeoutTicks() / this.actor.timeouts[0].ms[0]) * this.zoom[1].y);
          }
          if(trig.state == 'triggered'){
            this.actor.timeouts = [];
            this.action = Actions.idle;
            this.callback();
          }
        }  
      }
    }
  }

  public panCamera(from: T.Point, to: T.Point, duration: number, callback: ()=>void = ()=>{}){
    this.actor = this.freemovement;
    this.actor.pos.x = from.x;
    this.actor.pos.y = from.y;
    this.actor.timeouts = [new Time.Timeout([duration],'pan')];
    this.pan[0] = from;
    this.pan[1] = {x:to.x-from.x,y:to.y-from.y};
    this.action = Actions.pan;
    this.callback = callback;
  }

  public zoomCamera(from: T.Point, to: T.Point, zoom: T.Point, duration: number, callback: ()=>void = ()=>{}){
    this.actor = this.freemovement;
    this.actor.pos.x = from.x;
    this.actor.pos.y = from.y;
    this.actor.timeouts = [new Time.Timeout([duration],'zoom')];
    this.pan[0] = from;
    this.pan[1] = {x:to.x-from.x,y:to.y-from.y};
    this.zoom[0] = {x:this.camera.scale.x, y:this.camera.scale.y};
    this.zoom[1] = {x:zoom.x-this.camera.scale.x, y:zoom.y-this.camera.scale.y};
    this.action = Actions.zoom;
    this.callback = callback;
  }
}