import {Time} from "./time"
import {Composite} from "../render/composite"
import * as T from "../_type"
import Collision from '../physics/_collision'
import * as C from "../physics/states";

export namespace Bodies {



  export abstract class Alacrity {
    protected lifetime    : Time.Timeout = new Time.Timeout([Infinity], 'lifetime');

    public delete : boolean = false;

    public triggers : Array<Time.Trigger> = [];
    public timeouts : Array<Time.Timeout>  = [];
    public gameid : number;

    constructor(){
    }
 
    public finalize(){}
    public resetMovementVector(){}

    public static resetAllMovements(pool: Array<Alacrity>){
      for(let a of pool){
        a.resetMovementVector();
      }
    }

    public update(){
      this.timeouts = this.timeouts.filter((t)=>{
        if(t.deletion) return false;
        this.triggers.push(t.test());
        return true;
      })
    }

    public addTimeout(durations:Array<number>, actions:Time.TimerActions, repeat : boolean = true, continuous:boolean=true):Time.Timeout{
      let timeout = new Time.Timeout(durations, "noname", {continuous:continuous,repeat:repeat},actions);
      this.timeouts.push(timeout);
      return timeout;
    }

    public destroy(){
      this.delete = true;
    }

    public react(owner: Alacrity, name: string, params: Array<any>):boolean{return false;}
  }

  export class UIElement extends Alacrity {
    public myAnim : Composite.Animation;
    public hitbox : T.Bounds = {x:0,y:0,w:0,h:0};
    public pos    : T.Point  = {x:0,y:0};
    public hidden : boolean  = false;

    constructor(animation: Composite.Animation){
      super();
      this.myAnim = animation;
      for(let m of this.myAnim.frames){
        m.rprops.pos = this.pos;
      }
      // this.myAnim.rprops.pos = this.pos;
      this.myAnim.rprops.hidden = this.hidden;
    }
  }

  export class Existence extends Alacrity {
    public pos : T.Point = {x:0,y:0};
    public hitbox     : T.Bounds = {x:0,y:0,w:0,h:0};

  }


  export class Embodiment extends Existence {
    public myFrame: Composite.Frame;
    public collisions : Array<Collision> = [];
    public activeeffects : Array<number> = [1,1,1,1];
    public flip : T.Flip = {flipx:false,flipy:false}

    constructor(frame: Composite.Frame | Array<Composite.Renderable> | Composite.Renderable){
      super();
      let fr : Composite.Frame;
      if(!(frame instanceof Composite.Frame)){
        if(Array.isArray(frame)){
          fr = new Composite.Frame(frame[0].glContext, frame[0].shadercontext, frame)
        } else {
          fr = new Composite.Frame(frame.glContext, frame.shadercontext, [frame])
        } 
      } else {
        fr = frame as Composite.Frame;
      }
      this.myFrame = fr;
      this.myFrame.rprops.pos = this.pos;
      this.myFrame.rprops.layer = .5;
      this.myFrame.rprops.flip = this.flip;
    }
    
    public destroy(){
      this.delete = true;
      this.myFrame.rprops.delete = true;
      for(let c of this.collisions) {
        c.deleteMe = true;
      }
      
    }
  }

  export type Velocity = T.Point & {
    strength: number;
  }

  export abstract class Mobility extends Embodiment {
    public movementvector : T.Point = {x:0,y:0};
    public speed          : number = .2;
    public velocity: Set<Velocity> = new Set();
    protected normalgravity : Velocity = {strength:.075,x:0,y:1};
    protected destination   : T.Point | null = null;
    private movetimer       : Time.Timeout = new Time.Timeout([Infinity], "move");
    private movecallback    = ()=>{};
    
    public finalize(){
      if(this.destination != null){
        // console.log(this.movetimer.test().state)
        // console.log(this.movetimer.end)
        if((Math.abs(this.pos.x - this.destination.x)<1 &&
          Math.abs(this.pos.y - this.destination.y)<1) ||
          this.movetimer.test().state == "triggered"){
            this.destination = null;
            this.movecallback();
        } else {
          let distance : T.Point = {
            x : this.destination.x - this.pos.x,
            y : this.destination.y - this.pos.y}
          if(distance.x != 0 || distance.y != 0){
            let length = Math.sqrt(
              distance.x * distance.x +
              distance.y * distance.y
            );
            if(length > 0){
              this.movementvector.x += distance.x / length;
              this.movementvector.y += distance.y / length;
            }
          }
        }
      }

      let movement: T.Point = {
        x: this.movementvector.x * this.speed * Time.Delta.delta,
        y: this.movementvector.y * this.speed * Time.Delta.delta,
      }

      for(let g of this.velocity){
        movement.x += g.x * g.strength * Time.Delta.delta;
        movement.y += g.y * g.strength * Time.Delta.delta;
      }

      if((movement.x < 0 && !(this.activeeffects[1] & C.CollideTypes.block))  || 
          (movement.x > 0 && !(this.activeeffects[3] & C.CollideTypes.block))){
          this.pos.x += movement.x;
        }
      if((movement.y < 0 && !(this.activeeffects[0] & C.CollideTypes.block))  || 
          (movement.y > 0 && !(this.activeeffects[2] & C.CollideTypes.block))){
          this.pos.y += movement.y;
        }
      
    }
    public resetMovementVector(){
      this.movementvector = {x:0,y:0};
    }

    public movetowards(destination: T.Point, during:number = Infinity, callback = ()=>{}){
      this.destination = destination;
      this.movetimer.ms = [during];
      // console.log(during);
      this.movetimer.restart();
      this.movecallback = callback;
    }
  }

}

