import {
  T,
  Window,
  Time,
  Games,
  Render,
  Bodies,
  Composite,
  Incarnations,
  Physics,
  GameObjects,
  Normal,
  Reverser,
} from "TEWOU"
import { Manager } from 'Console';


import GameAnimations from './animations';
import LevelMaster from './levelfactory';
import Level00 from './level00';
import LevelFactory from "./levelfactory";
// import Physics from "../../engine/systems/physics"


export default class Game extends Games.Action {
  // public static self : Game;
  protected levels  : LevelFactory[] = [new Level00()];
  public gamename: string = 'demon';
  protected srcview: T.Box = {w:4.5*16,h:10*16};
  // public static glContext : Render.GLContext;
  // public static 

  // public bodies    : Array<Bodies.Embodiment> = [];
  // // public cellbuild : T.CellBuild;
  // public player    : Incarnations.Player;
  // public ui        : Array<Bodies.Alacrity> = [];
  // public paused    : boolean = false;
  // public levelsize : T.Box = {w:0,h:0};
  // private uielt    : HTMLElement;

  constructor(target:HTMLCanvasElement){
    super(new Render.GLContext(target,(9*16)+"",(20*16)+""),[new Normal(), new Reverser()]);
    target.addEventListener('mousedown',()=>Manager.currentGame = this.gameid)
    this.window = new Window(this.glContext);
  }

  public async load(): Promise<void>{
    this.animationsobject = new GameAnimations(this);
    this.gamephysics = new Physics();
    this.systempool.push(this.gamephysics);
    await this.shadercontext.init();

    await this.initialize();
    this.glContext.gl.clearColor(0, 0, 0, 1);
    
    //??
    // new GameAnimations.CharacterAnimations();
    //

    this.currentLevel = await this.newTiledLevel(0);
    await (this.currentLevel as LevelFactory).build(this);
    this.displayLevel(this.currentLevel);
    this.gameframe.camera.cameraman.actor = this.player;
    this.player.myCamera = this.gameframe.camera;
    
    // Time.Timeout.pauseAll();
    // this.paused = true;

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
    let per = 1;
    let gameframeheight = this.glContext.gl.canvas.height * per;
    this.gameframe.setCrop(this.srcview,{
      x:this.glContext.gl.canvas.width /2 - ((gameframeheight / 20) * 9)/2,
      y:this.glContext.gl.canvas.height/2 - gameframeheight/2,
      w: (gameframeheight / 20) * 9,
      h: gameframeheight
    });

    this.window.frm = new Composite.Frame(this.glContext,this.shadercontext,
      [
        this.gameframe
      ]);
    // Window.frm.camera = cam;

    // cam.actor = char;
    // char.myCamera = Window.frm.camera;
    this.window.frm.rprops.srcrect = {x:0,y:0, w:this.glContext.gl.canvas.width,h:this.glContext.gl.canvas.height};
    this.window.frm.rprops.shaderID = "reverser";

    return;
    // Games.pool.push(this)
  }

  public start(){
    // Time.Timeout.resumeAll();
    // this.paused = false;
  }
 
  public run(){
    super.run([]);
    // console.log("fdasf")
    this.gameframe.camera.refresh();
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
