import {Games, Window, Composite, Render, T, Incarnations, Physics, WhiteTransparent,
Normal,
Reverser,
Engine,
GameObjects} from 'TEWOU'
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


export class Game extends Games.Action {
  // public static self : Game;
  protected levels : LevelFactory[] = [new Level00()];

  // protected sharedobjects : Array<GameObjects.SharedObject> = [];
  // public currentLevel : LevelFactory | undefined = undefined;

  
  public gamename   : string   = "arbre";
  protected srcview : T.Box = {w:300,h:300};

  constructor(target:HTMLCanvasElement){
    // let bob = document.createElement('canvas');
    super(new Render.GLContext(target,"300","300"),[new Normal(), new Reverser(), new WhiteTransparent()]);
    target.addEventListener('mousedown',()=>Manager.currentGame = this.gameid);
    this.window = new Window(this.glContext)
    // Game.self = this;
  }

  public async load():  Promise<void> {
    // let game = ;
    // Game.self = this;
    this.gamephysics = new Physics();
    this.systempool.push(this.gamephysics);
    await this.shadercontext.init();

    await this.initialize();
    // console.log(this.glContext.gl)
    this.currentLevel = await this.newTiledLevel(0);
    await (this.currentLevel as LevelFactory).build(this,true);
    this.displayLevel(this.currentLevel);
    this.gameframe.camera.cameraman.actor = this.player;
    this.player.myCamera = this.gameframe.camera;


    let per = 1;
    let gameframewidth = this.glContext.gl.canvas.width > this.glContext.gl.canvas.height ? this.glContext.gl.canvas.height * per:this.glContext.gl.canvas.width * per;
    this.gameframe.setCrop(this.srcview,{
      x:this.glContext.gl.canvas.width/2 - (this.glContext.gl.canvas.height * per)/2,
      y:0,//(this.glContext.gl.canvas.width > this.glContext.gl.canvas.height ? 0:this.glContext.gl.canvas.height/2-(this.glContext.gl.canvas.width * per)/2),
      w: gameframewidth,
      h: gameframewidth
    });

    this.window.frm = new Composite.Frame(this.glContext, this.shadercontext, [this.gameframe]);
    this.window.frm.rprops.srcrect = {x:0,y:0, w:this.glContext.gl.canvas.width,h:this.glContext.gl.canvas.height};
    this.window.frm.rprops.shaderID = "reverser";

    return;
  }

  public start(){}

  public run(sharedobjects:Array<T.SharedBlueprint>){
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
