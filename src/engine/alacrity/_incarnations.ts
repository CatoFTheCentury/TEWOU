import { Bodies } from './_bodies';
import { Composite } from '../render/composite';
import { Time } from './time';
import Camera from '../systems/camera';
import * as T from '../_type'
import IniParser from '../parsers/iniparser';
import {Games} from '../_games';
import Physics from '../systems/physics';

export namespace Incarnations {

  export enum Dir {up, left, down, right}

  export abstract class Level {
      // public cellbuild: T.CellBuild;
      public bodies : Bodies.Embodiment[] = [];
      protected abstract ininame : string;
      public representation : Composite.Snap[];
      public levelsize  : T.Box;
      // public physics    : Physics = new Physics();

      public abstract build(game: Games.Generic);
        // this.cellbuild = await IniParser.loadIni(game.rootFolder+this.ininame);
        // return;
      // }
  }


export abstract class Incarnated extends Bodies.Mobility{
  public state : number = 0;
  protected anims     : Composite.Animation[] = [];

  protected switchanimation(state: number){
    if(this.state == state) return;
    this.state = state;
    this.myFrame.frame = [this.anims[this.state]];
    this.anims[this.state].restart();
  }
}

export enum actionStates {
  off,disabled,enabled,running,elapsed
}

export type action = {
  disabled?: ()=>void,
  enabled ?: ()=>void,
  running ?: ()=>void,
  elapsed ?: ()=>void,
  timer   ?: Time.Timeout,
  state: actionStates,
}

export abstract class Fauna extends Incarnated {
  protected abstract actions : {[key:string]:action};
  protected abstract action : string;
  
  public override update(){
    super.update();
    for(let a in this.actions){
      if(this.actions[a].state==actionStates.off) continue;
      if(this.actions[a].state==actionStates.disabled){
        if(this.actions[a].disabled!=undefined)this.actions[a].disabled();
        this.actions[a].state = actionStates.off;
      }
      else if(this.actions[a].state==actionStates.enabled){
        if(this.actions[a].enabled!=undefined)this.actions[a].enabled();
        if(this.actions[a].running!=undefined)this.actions[a].running();
        this.actions[a].state = actionStates.running;
      }
      
      else if(this.actions[a].timer?.test().state=='triggered'){
        if(this.actions[a].elapsed!=undefined)this.actions[a].elapsed();
      }
      else if(this.actions[a].state==actionStates.running){
        if(this.actions[a].running!=undefined)this.actions[a].running();
      }
    }
  }
  
  protected switchaction(action: string) {
    this.actions[action].timer?.restart();
    this.actions[action].state = actionStates.enabled;
    if(action == this.action) return;
    // if(this.action!=''){
    // this.actions[this.action].timer?.pause();
    this.actions[this.action].state = actionStates.disabled;
    // }
    this.action = action;
  }
}

export type Health = {
  max : number,
  current: number
}


export abstract class Player extends Fauna {
  // protected allstates = (1<<AniSt.count) - 1;
    public hp : Health = {max:3,current:3};
    public myCamera  : Camera;

  }
}