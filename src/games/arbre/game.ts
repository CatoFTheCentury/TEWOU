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

  
  public gamefolder   : string   = "arbre";
  protected srcview = {w:300,h:300};

  constructor(target:HTMLCanvasElement){
    super(target, 300, 300);
    target.addEventListener('mousedown',()=>Manager.currentGame = this.gameid);
  }

  public async load():  Promise<void> {
    super.load();

    this.currentLevel = await this.newTiledLevel(0);
    await (this.currentLevel as LevelFactory).build(this,true);
    this.displayLevel(this.currentLevel);
    this.gameframe.camera.cameraman.actor = this.player;

    this.window.frame.frame.push(this.gameframe);

    
    return;
  }

  public start(){}

  public run(sharedobjects){
    super.run(sharedobjects);
    this.gameframe.camera.refresh();
  }

}
