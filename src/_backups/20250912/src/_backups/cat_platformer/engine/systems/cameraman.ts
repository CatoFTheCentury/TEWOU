import * as T from '../_type'
import System from './_system'
import { Bodies } from '../alacrity/_bodies'
import { Composite } from '../render/composite';
import { Time } from '../alacrity/time';


enum Actions {
  idle = 0,
  pan  = 1,
  zoom = 2
}

export default class Cameraman extends System {
  public action : Actions = Actions.idle;
  public actor  : Bodies.Embodiment;
  private callback : ()=>void = ()=>{};

  private pan    : Array<T.Point> = []; //from, distance

  constructor(){
    super(true);
    this.actor = new Bodies.Embodiment(
      new Composite.Frame([new Composite.Snap([
      new Composite.Image("_assets/blocking.png", {x:0,y:0,w:1,h:1}, {x:0,y:0,w:1,h:1})])]));
    this.actor.myFrame.rprops.hidden = true;

  }

  public refresh(){
    if(this.action == Actions.idle) return;
    if(this.action == Actions.pan){
      while(this.actor.triggers.length > 0){
        let trig: Bodies.Trigger = this.actor.triggers.pop() || {name:''};
        if(trig.name == 'pan'){
          if(trig.state == 'active'){
            this.actor.pos.x = this.pan[0].x + ((this.actor.timeouts[0].getTimeoutTicks() / this.actor.timeouts[0].ms[0]) * this.pan[1].x)
            this.actor.pos.y = this.pan[0].y + ((this.actor.timeouts[0].getTimeoutTicks() / this.actor.timeouts[0].ms[0]) * this.pan[1].y)

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
    this.actor.pos.x = from.x;
    this.actor.pos.y = from.y;
    this.actor.timeouts = [new Time.Timeout([duration],'pan')];
    this.pan[0] = from;
    this.pan[1] = {x:to.x-from.x,y:to.y-from.y};
    this.action = Actions.pan;
    this.callback = callback;

    // this.done = false;
  }
}