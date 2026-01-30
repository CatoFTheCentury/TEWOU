import { Incarnations } from "./_incarnations"
import { Bodies } from "./_bodies";
import { Composite } from "../render/composite";
import * as T from "../_type"
import { CollisionGrid } from "../physics/gridCollision"
import { IniParser } from "../parsers/iniparser"
import Camera from '../systems/camera';
import { Keyboard } from "../systems/keyboard";
import { Render } from "../render/_render";
import { ShaderLoader } from "../render/shaderloader";
import { Assets } from "../render/assets";
import { Tiled } from "../parsers/tiledParser";



export namespace GameObjects {
  export type Health = {
    max : number,
    current: number
  }

  export abstract class Level {
    public bodies : Bodies.Embodiment[] = [];
    public abstract ininame : string;
    public representation : Composite.Snap[];
    public levelsize  : T.Box;
    public grids : Array<CollisionGrid>;
    public cellbuild : T.CellBuild;
    
    public async load(){
      this.cellbuild = await IniParser.loadIni("_assets/"+this.ininame);
      this.levelsize = {w: this.cellbuild.tiles[0].tileYX[0].length * this.cellbuild.square.w, h: this.cellbuild.tiles[0].tileYX.length * this.cellbuild.square.h};
    }

    public async buildCell(file:string, glContext:Render.GLContext, shadercontext: ShaderLoader){
      this.cellbuild = await IniParser.loadIni(file);
      this.cellbuild.texture = Assets.retrieveTex(this.cellbuild.tileset, glContext);
      this.levelsize = {w: this.cellbuild.tiles[0].tileYX[0].length * this.cellbuild.square.w, h: this.cellbuild.tiles[0].tileYX.length * this.cellbuild.square.h};
      this.representation = Tiled.blit(glContext, shadercontext, this.cellbuild, "level-layer")

    }
  }

  export class SharedObject {
      public presence   : Incarnations.Incarnated;
      public pos        : T.Point;
      public anisrc     : {[id:string]:string} = {};
      public currentani : string;
      public hitbox     : T.Bounds;
      public ownerid    : number;
      public ownername  : string;
      public dir        : number;

    constructor(shared:T.SharedBlueprint){
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

  }

  export abstract class Fauna extends Incarnations.Fauna{}

  export abstract class Player extends Incarnations.Incarnated {
    public hp : Health = {max:3,current:3};
    public myCamera  : Camera;

    private keyboardactions : {[id:string]:T.KeyboardAction} = {};

    public registerkey(key:string, actions:T.KeyboardAction){
      this.keyboardactions[key] = actions;
    }

    public updatekeys(){
      for(let k in this.keyboardactions){
        let keyactions = this.keyboardactions[k];
        if(Keyboard.keys[k]!=undefined){
          switch(Keyboard.keys[k]) {
            case -1:
              if(keyactions.keyup!=undefined)keyactions.keyup();
            break;
            case 0:
            break;
            case 1:
              if(keyactions.keydown!=undefined)keyactions.keydown();
              if(keyactions.keypressed!=undefined)keyactions.keypressed();
            break;
            case 2:
              if(keyactions.keyheld!=undefined)keyactions.keyheld();
              if(keyactions.keypressed!=undefined)keyactions.keypressed();
            break;
          }
        }
      }
    }
    public update(){
      super.update();
      this.updatekeys();
    }
  }

  export abstract class GameAnimations {
    public abstract animations:{[id:string]:{[id:string]:{[id:string]:Array<Composite.Animation>}}};
  }
}