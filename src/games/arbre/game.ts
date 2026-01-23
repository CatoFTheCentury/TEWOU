// import {Games, Window, Composite, Render, T, Incarnations, Physics, WhiteTransparent,
// Normal,
// Reverser,
// Engine,
// GameObjects} from 'TEWOU'
import {Player, ActionGame, CollideLayers, CollideTypes, CaptureProperties, API, Frame,} from 'TEWOU'

import { Manager } from 'Console';

// import {Games} from "../../engine/_games"
// import Window from "../../engine/systems/window"
// import {Composite} from "../../engine/render/composite"
// import {Render} from "../../engine/render/_render"
// import * as T from '../../engine/_type'
// import { Incarnations } from "../../engine/alacrity/_incarnations"
import Level00 from "./level00"
import LevelFactory from './levelfactory';
// import Physics from "../../engine/systems/physics"
// import { SharedBlueprint } from '../../engine/source/_type';


export class Game extends ActionGame {
  // public static self : Game;
  protected levels : LevelFactory[] = [new Level00()];

  // protected sharedobjects : Array<GameObjects.SharedObject> = [];
  // public currentLevel : LevelFactory | undefined = undefined;

  
  public gamename   : string   = "arbre";
  protected srcview = {w:300,h:300};

  constructor(target:HTMLCanvasElement){
    // let bob = document.createElement('canvas');
    super(target, 300, 300);
    target.addEventListener('mousedown',()=>Manager.currentGame = this.gameid);
    // this.window = new Window(this.glContext)
    // Game.self = this;
  }

  public async load():  Promise<void> {
    super.load();

    this.currentLevel = await this.newTiledLevel(0);
    await (this.currentLevel as LevelFactory).build(this,true);
    this.displayLevel(this.currentLevel);
    this.gameframe.camera.cameraman.actor = this.player;

    
    this.frameGame([this.gameframe]);
    return;
  }

  public start(){}

  public run(sharedobjects){
    super.run(sharedobjects);
    // if(Engine.sharedobjects.length > 0){
    //   for(let i of games)
    // }
    // Engine.sharedobjects.forEach((obj)=>{
    //   if(obj.owner.id == this.gameid) return;
    //   if(obj.haspopulated.includes(this.gameid)) return;
    //   for(let s in obj.anisrc){
    //     let src = obj.anisrc[s];
    //     let spl = src.split('.');
    //     if(spl[spl.length-1] == "gani"){

    //     }

    //   }
    // })
    // if(Engine.sharedobjects)
    this.gameframe.camera.refresh();
  }

}
