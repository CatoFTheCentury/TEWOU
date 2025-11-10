import Window from "../../engine/systems/window"
import * as T from '../../engine/_type'

import { Time           } from "../../engine/alacrity/time"
import { Games          } from "../../engine/_games"
import { Render         } from "../../engine/render/_render"
import { Bodies         } from '../../engine/alacrity/_bodies';
import { Composite      } from "../../engine/render/composite"
import { Incarnations   } from "../../engine/alacrity/_incarnations"
import { GameAnimations } from './animations';
import LevelMaster from './levelmaster';
import Level00 from './level00';
import Physics from "../../engine/systems/physics"


export default class Game extends Games.Action {
  public static self : Game;
  public gamename: string = 'demon';
  protected levels  : Incarnations.Level[] = [new Level00()];
  protected srcview: T.Box = {w:9*16,h:20*16};

  public bodies    : Array<Bodies.Embodiment> = [];
  // public cellbuild : T.CellBuild;
  // public player    : Incarnations.Player;
  public ui        : Array<Bodies.Alacrity> = [];
  // public paused    : boolean = false;
  // public levelsize : T.Box = {w:0,h:0};
  private uielt    : HTMLElement;

  public async load(): Promise<Games.Action>{
    this.gamephysics = new Physics();
    Game.self = this;
    await this.initialize();
    Render.Info.gl.clearColor(0, 0, 0, 1);
    new GameAnimations.CharacterAnimations();
    this.currentLevel = await this.newTiledLevel(0);

    
    Time.Timeout.pauseAll();
    this.paused = true;

    // // INTRO
    // // let cam: Camera = new Camera({w:Render.Info.gl.canvas.width,h:Render.Info.gl.canvas.height}, {x:0,y:0,w:20*16,h:70*16});
    // cam.cameraman.actor = cam.cameraman.freemovement;
    // // let cameraman   = new Cameraman();
    // this.ui.push(cam.cameraman.actor);

    this.uielt = document.getElementById('instructions');
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

  public start(){
    Time.Timeout.resumeAll();
    this.paused = false;
  }
 
  public run(){
    super.run();
    this.gameframe.camera.refresh();  }

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
