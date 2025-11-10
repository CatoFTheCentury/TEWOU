import { Incarnations } from "../../engine/alacrity/_incarnations"
import { Bodies } from '../../engine/alacrity/_bodies';
import {Time} from "../../engine/alacrity/time"
import {Composite} from "../../engine/render/composite"
import {Render} from "../../engine/render/_render"

import Character from "./character"
import Scorpion from './scorpion'
import Bat from './bat'
import YellowFire from './yellowfire';
import RedFire from './redfire'
import { GameAnimations } from './animations';
import * as Objects from './items'

import Keyboard from "../../engine/systems/keyboard"
import Touch from "../../engine/systems/touch"
import Window from "../../engine/systems/window"
import Camera from "../../engine/systems/camera"
import Cameraman from '../../engine/systems/cameraman'
import System from "../../engine/systems/_system"
import Assets from "../../engine/render/assets"
import Physics from '../../engine/systems/physics';
import Games from "../../engine/games"

import { Debug } from "../../engine/debug/dbggrid"
import CollisionGrid from "../../engine/physics/gridCollision"

import * as C from "../../engine/physics/states"
import * as T from '../../engine/_type'
import IniParser from '../../engine/parsers/iniparser'
import TiledParser from '../../engine/parsers/tiledParser'

import Globals from '../../engine/globals';

export default class Game extends Games {
  public gamename: string = 'demon';
  protected levels  : Incarnations.Level[] = [];
  protected srcview: T.Box = {w:9*16,h:20*16};

  public bodies    : Array<Bodies.Embodiment> = [];
  // public cellbuild : T.CellBuild;
  // public player    : Incarnations.Player;
  public ui        : Array<Bodies.Alacrity> = [];
  // public paused    : boolean = false;
  // public levelsize : T.Box = {w:0,h:0};
  private uielt    : HTMLElement;

  public async start(): Promise<Games>{
    await this.initialize();
    Render.Info.gl.clearColor(0, 0, 0, 1);
    
    new GameAnimations.CharacterAnimations();
    
    Time.Timeout.pauseAll();
    this.paused = true;
    // // INTRO
    // // let cam: Camera = new Camera({w:Render.Info.gl.canvas.width,h:Render.Info.gl.canvas.height}, {x:0,y:0,w:20*16,h:70*16});
    // cam.cameraman.actor = cam.cameraman.freemovement;
    // // let cameraman   = new Cameraman();
    // this.ui.push(cam.cameraman.actor);

    // this.uielt = document.getElementById('instructions');
    // this.uielt.innerHTML = "Attrapez la statuette"
    // this.uielt.style.top = '50px'
    // this.uielt.style.fontSize = '50px'
    // char.uielt  = this.uielt;
    // // Start at idol position
    // // cam.cameraman.zoomCamera({x:16*16+8,y:64*16},{x:16*16+8,y:64*16}, {x:1,y:1}, 200, ()=>{
    // //   Assets.playSound('_assets/demon/roar.wav')
    // //   cam.cameraman.zoomCamera({x:16*16+8,y:64*16},{x:16*16,y:64*16}, {x:.42,y:.42}, 2000, ()=>{
    // //     cam.cameraman.panCamera({x:16*16,y:64*16},{x:16*16,y:13*16}, 8000, ()=>{
    // //       cam.cameraman.zoomCamera({x:16*16+8,y:13*16},{x:2*16+8,y:3*16}, {x:1,y:1}, 1000, ()=>{
    //         this.uielt.innerHTML = '';
    //         cam.cameraman.actor = char;
    //         this.paused = false;
    // //       })
    // //     })
    // //   })
    // // })

    // GAME
    this.currentLevel = await this.newLevel(0);
    let per = .75;
    let gameframeheight = Render.Info.gl.canvas.height * per;
    this.gameframe.setCrop(this.srcview,{
      x:Render.Info.gl.canvas.width /2 - ((gameframeheight / 20) * 9)/2,
      y:Render.Info.gl.canvas.height/2 - gameframeheight/2,
      w: (gameframeheight / 20) * 9,
      h: gameframeheight
    });

    Window.frm = new Composite.Frame(
      [
        this.gameframe
      ]);
    // Window.frm.camera = cam;

    // cam.actor = char;
    // char.myCamera = Window.frm.camera;
    Window.frm.rprops.srcrect = {x:0,y:0, w:Render.Info.gl.canvas.width,h:Render.Info.gl.canvas.height};
    Window.frm.rprops.shaderID = "reverser";

    return new Game();
    // Games.pool.push(this)
  }
 
  public run(){
    super.run();
    Window.frm.camera.refresh();
  }

}

  // public putnpcsfromcsv(npcsarr: string, squaresize: number): Array<Bodies.Embodiment>{
  //   let bodies: Array<Bodies.Embodiment> = [];
  //   let lines : Array<string> = npcsarr.split('\n');
  //   let putpos: T.Point       = {x:0,y:0}
  //   for(let i = 0; i < lines.length; i++){
  //     putpos.y = i * squaresize
  //   }

  // }
// }
