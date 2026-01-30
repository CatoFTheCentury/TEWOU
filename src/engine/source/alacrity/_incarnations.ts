import { Bodies } from './_bodies';
import { Composite } from '../render/composite';
import { Time } from './time';
import * as T from '../_type'

export namespace Incarnations {

export enum Dir {up, left, down, right}

export class Incarnated extends Bodies.Mobility{
  public state : string = "";
  public anims     : {[id:string]:Composite.Animation[]} = {};
  public dir  : number = 2;

  public switchanimation(state: string, direction : number = -1){
    let dir = direction == -1 ? this.dir : direction ;
    if(this.state == state ) {
      this.myFrame.frame = [this.anims[this.state][dir]];
      return;
    }
    this.state = state;
    this.myFrame.frame = [this.anims[this.state][dir]];
    this.anims[this.state][dir].restart();
  }
}

export type action = {
  disabled?: ()=>void,
  enabled ?: ()=>void,
  running ?: ()=>void,
  elapsed ?: ()=>void,
  timer   ?: Time.Timeout,
  state: T.RunSwitch,
}

export abstract class Fauna extends Incarnated {
  protected abstract actions : {[key:string]:action};
  protected abstract action : string;
  
  public override update(){
    super.update();
    for(let a in this.actions){
      if(this.actions[a].state==T.RunSwitch.off) continue;
      if(this.actions[a].state==T.RunSwitch.disabled){
        if(this.actions[a].disabled!=undefined)this.actions[a].disabled();
        this.actions[a].state = T.RunSwitch.off;
      }
      else if(this.actions[a].state==T.RunSwitch.enabled){
        if(this.actions[a].enabled!=undefined)this.actions[a].enabled();
        if(this.actions[a].running!=undefined)this.actions[a].running();
        this.actions[a].state = T.RunSwitch.running;
      }
      
      else if(this.actions[a].timer?.test().state=='triggered'){
        if(this.actions[a].elapsed!=undefined)this.actions[a].elapsed();
      }
      else if(this.actions[a].state==T.RunSwitch.running){
        if(this.actions[a].running!=undefined)this.actions[a].running();
      }
    }
  }
  
  protected switchaction(action: string) {
    this.actions[action].timer?.restart();
    this.actions[action].state = T.RunSwitch.enabled;
    if(action == this.action) return;
    this.actions[this.action].state = T.RunSwitch.disabled;
    this.action = action;
  }
}




// export abstract class Player extends Fauna {
//   // protected allstates = (1<<AniSt.count) - 1;
//     public hp : Health = {max:3,current:3};
//     public myCamera  : Camera;

//   }
}