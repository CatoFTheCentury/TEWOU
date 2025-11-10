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


export namespace Games{

  export abstract class Generic {
    // public static self : Generic;
    public static pool : Array<Generic> = [];
    // public uiphysics : Physics;
    public async load(): Promise<Generic> {return}
    public abstract start(): void;
    public paused : boolean = false;
    public rootFolder : string = "_assets/";
    public cellbuild : T.CellBuild;
    public abstract gamename   : string;
    protected abstract levels : Incarnations.Level[];
    protected fileextensions : string[] = ["png","gani","wav","csv"];
    protected gameframe: Composite.Frame;
    public currentLevel : Incarnations.Level | undefined = undefined;
    protected abstract srcview : T.Box;


    constructor(){
      Generic.pool.push(this);
    }

    protected async initialize(keyboard:boolean=true,touch:boolean=true){
      Time.Delta.refresh();
      if(keyboard) new Keyboard();
      if(touch) new Touch();
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

    public async newTiledLevel(leveln:number):Promise<Incarnations.Level>{
      if(this.currentLevel !== undefined){
        for(let r of this.currentLevel.representation){
          r.rprops.delete = true;
        }
        for(let b of this.currentLevel.bodies){
          b.myFrame.rprops.delete = true;
        }
        // this.gamephysics.collisionpool = [];
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



      return level;
    }

  }

  abstract class Physical extends Generic {
    // public static self : Physical;
    public gamephysics : Physics;
    
    protected async initialize(keyboard:boolean=true,touch:boolean=true){
      super.initialize(keyboard,touch);
      this.gamephysics = new Physics();

    }

    public async newTiledLevel(leveln: number): Promise<Incarnations.Level> {
      // Physical.self.gamephysics.collisionpool = [];  
      let level = await super.newTiledLevel(leveln);
      return level;
    }

  }

  export abstract class Action extends Physical{
    public player : Incarnations.Player;

    public async newTiledLevel(leveln: number): Promise<Incarnations.Level> {
      let level = await super.newTiledLevel(leveln);
      this.gameframe.camera.cameraman.actor = this.player;
      this.player.myCamera = this.gameframe.camera;
      return level;
    }
  }

  export abstract class Puzzle extends Generic{}

  export abstract class Strategy extends Physical {
    public async newTiledLevel(leveln: number): Promise<Incarnations.Level> {
      let level = await super.newTiledLevel(leveln);
      this.gameframe.camera.cameraman.actor = this.gameframe.camera.cameraman.freemovement;
      return level;
    }
  }
}
