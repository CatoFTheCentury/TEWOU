import {Time} from "./time"
import {Composite} from "../render/composite"
import * as T from "../_type"
import Collision from '../physics/_collision'
import * as C from "../physics/states";
// import Gravity from "../systems/gravity";

export namespace Bodies {

  export type Trigger = {
    name  : string,
    state?: string,
    from? : Embodiment
  }

  export abstract class Alacrity {
    public static pool : Array<Alacrity> = [];

    public triggers : Array<Trigger> = [];
    public timeouts : Array<Time.Timeout>  = [];
    // public abstract update();

    constructor(){
      Alacrity.pool.push(this);
    }

    public finalize(){}
    public resetmovementvector(){}

    public static refresh(){
      for(let i = 0; i < this.pool.length; i++){
        Alacrity.pool[i].update();
      }
      for(let i = 0; i < this.pool.length; i++){
        Alacrity.pool[i].finalize();
      }
    }

    public static refreshsome(some: Array<Alacrity>){
      for(let i = 0; i < some.length; i++){
        some[i].update();
      }
      for(let i = 0; i < some.length; i++){
        some[i].finalize();
      }
    }

    public static resetallmovements(){
      for(let a of Alacrity.pool){
        a.resetmovementvector();
      }
    }

    public update(){
      this.timeouts = this.timeouts.filter((t)=>{
        if(t.deletion) return false;
        this.triggers.push(t.test());
        return true;
      })
    }

    public destroy(){
      Alacrity.pool.filter((i)=>i!=this);
    }

    public react(name: string, params: Array<any>):boolean{return false;}
  }




  export class Embodiment extends Alacrity {
    public myFrame: Composite.Frame;
    public collisions : Array<Collision> = [];
    public hitbox     : T.Bounds = {x:0,y:0,w:0,h:0};
    public activeeffects : Array<number> = [0,0,0,0];
    public pos : T.Point = {x:0,y:0};
    public flip : T.Flip = {flipx:false,flipy:false}

    constructor(frame: Composite.Frame){
      super();
      this.myFrame = frame;
      this.myFrame.rprops.pos = this.pos;
      this.myFrame.rprops.layer = .5;
      this.myFrame.rprops.flip = this.flip;
    }
    
    public destroy(){
      super.destroy();
      this.myFrame.rprops.delete = true;
      
    }
  }

  export type Gravity = T.Point & {
    strength: number;
  }


  export abstract class Mobility extends Embodiment {
    // public abstract pos   : T.Point;
    public movementvector : T.Point = {x:0,y:0};
    // public gravityvector  : T.Point = {x:0,y:0};
    public speed          : number = .2;
    public gravity: Set<Gravity> = new Set();

    public finalize(){
      let movement: T.Point = {
        x: this.movementvector.x * this.speed * Time.Delta.delta,
        y: this.movementvector.y * this.speed * Time.Delta.delta,
      }

      for(let g of this.gravity){
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
      // console.log(movement)
      // this.movementvector = {x:0,y:0};
      
    }
    public resetmovementvector(){
      this.movementvector = {x:0,y:0};
    }
  }
}
