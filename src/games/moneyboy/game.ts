import {
  T,
  Window,
  Games,
  Render,
  Composite,
  Normal,
  Reverser,
} from "TEWOU"
import { Manager } from 'Console';


// import GameAnimations from './animations';
// import LevelMaster from './levelfactory';
import Level00 from './level00';
import LevelFactory from "./levelfactory";
// import Physics from "../../engine/systems/physics"


export default class Game extends Games.Action {
  public gamename   : string         = 'moneyboy';
  protected levels  : LevelFactory[] = [new Level00()];
  protected srcview : T.Box          = {w:4.5*16,h:10*16};

  constructor(target:HTMLCanvasElement = null){
    let mtarget = target;
    if(mtarget == null){
      mtarget = document.createElement("canvas");
      document.body.appendChild(mtarget);
    }
    super(new Render.GLContext(mtarget,(9*16)+"",(20*16)+""),[new Normal(), new Reverser()]);
    // target.addEventListener('mousedown',()=>Manager.currentGame = this.gameid)
    this.window = new Window(this.glContext);
  }

  public async load(): Promise<void>{
    await this.initialize();
    this.animationsobject = new GameAnimations(this);

    this.glContext.gl.clearColor(0, 0, 0, 1);
    
    this.currentLevel = await this.newTiledLevel(0); // new Level00() and not 0 refering to an array with new Level00
    await (this.currentLevel as LevelFactory).build(this);
    this.displayLevel(this.currentLevel);
    this.gameframe.camera.cameraman.actor = this.player;
    this.player.myCamera = this.gameframe.camera;

    this.window.frm = new Composite.Frame(this.glContext,this.shadercontext,
      [
        this.gameframe
      ]);

    this.window.frm.rprops.srcrect = {x:0,y:0, w:this.glContext.gl.canvas.width,h:this.glContext.gl.canvas.height};
    this.window.frm.rprops.shaderID = "reverser";

    return;
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
