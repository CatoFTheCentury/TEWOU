import { Bodies } from './_bodies';
import { Composite } from '../render/composite';
import { Time } from './time';
import Camera from '../systems/camera';

export namespace Incarnations {

  export enum AniSt{
  idle   = 0,
  walk   = 1,
  climb  = 2,
  attack = 3,
  jump   = 4,
  dead   = 5,
  count  = 6
  }

  export abstract class Incarnated extends Bodies.Mobility{
    public state : AniSt = AniSt.idle;
    public myCamera  : Camera;

    protected abstract allstates: number;
    protected anims : Array<Composite.Animation>;
    protected changeframe : Time.Timeout = new Time.Timeout([200],'changeframe');
    protected currentAnim : Composite.Animation;
    protected normalgravity : Bodies.Gravity = {strength:.05,x:0,y:1};


    constructor(frame:Composite.Frame){
      super(frame);
      this.changeframe.paused = true;
      this.timeouts.push(this.changeframe);
      // if(gravity) this.gravity.add(this.normalgravity);

    }
  }

  export abstract class Fauna extends Incarnated {
    
  }
  // export abstract class Flying extends Fauna {
  //   protected normalgravity : Bodies.Gravity = {strength:.0,x:0,y:0};
  // }

  export class Player extends Fauna {
    protected allstates = (1<<AniSt.count) - 1;
  }
}