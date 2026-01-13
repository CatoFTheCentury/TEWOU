import { Incarnations } from "./_incarnations"
import { Bodies } from "./_bodies";
import { Composite } from "../render/composite";
import * as T from "../_type"
import { CollisionGrid } from "../physics/gridCollision"
import { IniParser } from "../parsers/iniparser"
import Camera from '../systems/camera';



export namespace GameObjects {
  export type Health = {
    max : number,
    current: number
  }

  export abstract class Level {
    // public cellbuild: T.CellBuild;
    public bodies : Bodies.Embodiment[] = [];
    public abstract ininame : string;
    public representation : Composite.Snap[];
    public levelsize  : T.Box;
    public grids : Array<CollisionGrid>;
    public cellbuild : T.CellBuild;
    
    // public physics    : Physics = new Physics();
    public async load(){
      this.cellbuild = await IniParser.loadIni("_assets/"+this.ininame);
      this.levelsize = {w: this.cellbuild.tiles[0].tileYX[0].length * this.cellbuild.square.w, h: this.cellbuild.tiles[0].tileYX.length * this.cellbuild.square.h};
    }
  }

  export class SharedObject {
    // public shared : T.SharedBlueprint;
      public presence   : Incarnations.Incarnated;
      public pos        : T.Point;
      public anisrc     : {[id:string]:string} = {};
      public currentani : string;
      public hitbox     : T.Bounds;
      public ownerid    : number;
      public ownername  : string;
      public dir        : number;
      // public haspopulated: Array<number> = []; //ids of populated games (where the object has been created already)

    constructor(shared:T.SharedBlueprint){
      // this.shared = shared;
      this.pos = shared.pos;
      this.anisrc = shared.anisrc;
      this.currentani = shared.currentani;
      this.hitbox = shared.hitbox;
      this.ownerid = shared.owner.id;
      this.ownername = shared.owner.name;
      this.dir       = shared.dir;
    }

    public update(){
      
    }

    // public invoke(){

    // }
  }

  export abstract class Player extends Incarnations.Fauna {
  // protected allstates = (1<<AniSt.count) - 1;
    public hp : Health = {max:3,current:3};
    public myCamera  : Camera;

  }
}