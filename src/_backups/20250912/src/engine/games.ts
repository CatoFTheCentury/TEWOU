import { Incarnations } from "./alacrity/_incarnations";
import { Time } from "./alacrity/time"
import System from './systems/_system'
import { Bodies } from "./alacrity/_bodies";
import Keyboard from "./systems/keyboard"
import Touch from "./systems/touch";
import Physics from "./systems/physics";
import Assets from "./render/assets";
import { Composite } from "./render/composite";
import * as T from './_type'
import Camera from "./systems/camera"



export default abstract class Games {
  public static pool : Array<Games> = [];
  public static gamephysics : Physics;
  public static uiphysics : Physics;
  public async load(): Promise<Games> {return}
  public abstract start(): void;
  // public abstract run() : void;
  public player : Incarnations.Player;
  public paused : boolean = false;
  public rootFolder : string = "_assets/";
  public cellbuild : T.CellBuild;
  // public cellb
  // protected abstract levelnames : string[];
  public abstract gamename   : string;
  protected abstract levels : Incarnations.Level[];
  protected fileextensions : string[] = ["png","gani","wav","csv"];
  protected gameframe: Composite.Frame;
  public currentLevel : Incarnations.Level | undefined = undefined;
  protected abstract srcview : T.Box;



  constructor(){
    Games.pool.push(this);
  }

  protected async initialize(keyboard:boolean=true,touch:boolean=true){
    Time.Delta.refresh();
    if(keyboard) new Keyboard();
    if(touch) new Touch();
    Games.gamephysics = new Physics();
    await Promise.all(await Assets.loadAllExtInFolder(this.rootFolder+this.gamename+'/', this.fileextensions));
    
  }

  public run(){
    Time.Delta.refresh();
    System.refresh();
    if(!this.paused) Bodies.Alacrity.refresh();
    // else Bodies.Alacrity.refreshsome(this.ui);

    // this.gameframe.camera.refresh();
    Bodies.Alacrity.resetallmovements();
  }

  public async newLevel(leveln:number):Promise<Incarnations.Level>{
    if(this.currentLevel !== undefined){
      for(let r of this.currentLevel.representation){
        r.rprops.delete = true;
      }
      for(let b of this.currentLevel.bodies){
        b.myFrame.rprops.delete = true;
      }
      Games.gamephysics.collisionpool = [];
    }
    let level = this.levels[leveln];
    await level.build(this);

    if(this.currentLevel === undefined){
      this.gameframe = new Composite.Frame(
        [
          ...level.representation,
          ...level.bodies.map((a)=>a.myFrame),
          // Debug.Grid.see(collisiongrid, {x:0,y:0,w:40*16,h:40*16})
        ]
      );
      this.gameframe.camera = new Camera(this.srcview, {x:0,y:0,...level.levelsize});
    } else {
      this.gameframe.camera.setbounds({x:0,y:0,...level.levelsize});
      this.gameframe.addtocomposition(
        [
          ...level.representation,
          ...level.bodies.map((a)=>a.myFrame),
        ]
      );
    }

    this.gameframe.camera.cameraman.actor = this.player;
    this.player.myCamera = this.gameframe.camera;

    return level;
  }

}