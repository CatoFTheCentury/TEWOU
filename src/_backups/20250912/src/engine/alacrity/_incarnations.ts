import { Bodies } from './_bodies';
import { Composite } from '../render/composite';
import { Time } from './time';
import Camera from '../systems/camera';
import * as T from '../_type'
import IniParser from '../parsers/iniparser';
import Games from '../games';
import Physics from '../systems/physics';

export namespace Incarnations {

  export enum Dir {up, left, down, right}

  export abstract class Level {
      // public cellbuild: T.CellBuild;
      public bodies : Bodies.Embodiment[] = [];
      protected abstract ininame : string;
      public representation : Composite.Snap[];
      public levelsize  : T.Box;
      public physics    : Physics = new Physics();

      public abstract build(game: Games);
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

  export abstract class Fauna extends Incarnated {
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