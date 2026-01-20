import { Bodies } from './_bodies';
import { Composite } from '../render/composite';
import { Time } from './time';
import Camera from '../systems/camera';
import * as T from '../_type'
import {IniParser} from '../parsers/iniparser';
// import {Games} from '../_games';
import {Physics} from '../systems/physics';
import { CaptureProperties } from '../physics/capture';
import {Capture} from '../physics/capture';
import {CollisionGrid} from '../physics/gridCollision';

export namespace Incarnations {

  export enum Dir {up, left, down, right}

  // export abstract class Level {
  //     // public cellbuild: T.CellBuild;
  //     public bodies : Bodies.Embodiment[] = [];
  //     public abstract ininame : string;
  //     public representation : Composite.Snap[];
  //     public levelsize  : T.Box;
  //     public grids : Array<CollisionGrid>;
  //     public cellbuild : T.CellBuild;

  //     // public physics    : Physics = new Physics();
  //   public async load(){
  //   this.cellbuild = await IniParser.loadIni("_assets/"+this.ininame);
  //   this.levelsize = {w: this.cellbuild.tiles[0].tileYX[0].length * this.cellbuild.square.w, h: this.cellbuild.tiles[0].tileYX.length * this.cellbuild.square.h};
  //   }
  // }


export class Incarnated extends Bodies.Mobility{
  public state : string = "";
  public anims     : {[id:string]:Composite.Animation[]} = {};
  public dir  : number = 2;
  // protected game : Games;

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

  // public switchstate(state: number){
  //   if(this.state == state ) {
  //     this.myFrame.frame = [this.anims[this.state][this.dir]];
  //     return;
  //   }
  //   this.state = state;
  //   this.myFrame.frame = [this.anims[this.state][this.dir]];
  //   this.anims[this.state][this.dir].restart();
  // }

  // ça va pas là - ça va dans game, pi un paramètre pour l'incarnation; pas pour gameID
  // protected addCapture(captureProperties : CaptureProperties, gameID: number = 0){
  //   (Games.Generic.pool[gameID] as Games.Action).gamephysics.collisionpool.push(
  //     new Capture(
  //       captureProperties.from,
  //       captureProperties.to,
  //       captureProperties.type,
  //       this,
  //       captureProperties.hitbox,
  //       captureProperties.call)
  //   )
  // }
}

// export enum actionStates {
//   off,disabled,enabled,running,elapsed
// }

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
    // if(this.action!=''){
    // this.actions[this.action].timer?.pause();
    this.actions[this.action].state = T.RunSwitch.disabled;
    // }
    this.action = action;
  }
}




// export abstract class Player extends Fauna {
//   // protected allstates = (1<<AniSt.count) - 1;
//     public hp : Health = {max:3,current:3};
//     public myCamera  : Camera;

//   }
}