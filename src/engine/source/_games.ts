import { Incarnations } from "./alacrity/_incarnations";
import { Time } from "./alacrity/time"
import {System} from './systems/_system'
import { Bodies } from './alacrity/_bodies';
import {Keyboard} from "./systems/keyboard"
import {Touch} from "./systems/touch";
import {Physics} from "./systems/physics";
import {Assets} from "./render/assets";
import { Composite } from "./render/composite";
import * as T from './_type'
import Camera from "./systems/camera"
import { ShaderLoader } from "./render/shaderloader";
import ShaderTemplate from "./render/shaders/template"
import { Render } from "./render/_render";
import { Window } from "./systems/window";
import { IniParser } from "./parsers/iniparser";
import { Tiled } from "./parsers/tiledParser";
import { GameObjects } from "./alacrity/_gameobjects";
import { GaniParser } from "./parsers/ganiParser";
import { Capture, CaptureProperties } from "./physics/capture";
import * as C from "./physics/states"
import {NPCCollision} from './physics/npcCollision';
import { Normal } from "./render/shaders/normal";
import { Reverser } from "./render/shaders/reverser";
import { WhiteTransparent } from "./render/shaders/whitetransparent";
import { CollisionGrid } from "./physics/gridCollision";


export namespace Games{

  export abstract class Generic {
    // public static self : Generic;
    // public abstract static bob : string;
    // public static pool : Array<Generic> = [];
    public gameid : number;
    public alacritypool: Array<Bodies.Alacrity> = [];
    public systempool  : Array<System> = [];
    // public uiphysics : Physics;
    public abstract start(): void;
    public paused : boolean = false;
    public rootFolder : string = "_assets/";
    public cellbuild : T.CellBuild;
    public abstract gamename   : string;
    protected abstract levels : GameObjects.Level[];
    protected fileextensions : string[] = ["png","gani","wav","csv"];
    public gameframe: Composite.Frame;
    public currentLevel : GameObjects.Level | undefined = undefined;
    protected abstract srcview : T.Box;
    public window : Window;

    public glContext    : Render.GLContext;
    public shadercontext: ShaderLoader;
    // private static nextid:number = 0;
    public static gamespool : Array<Generic> = [];
    // public sharedobjects : Array<T.SharedBlueprint> = [];
    public remoteobjects : {[owner:string]:GameObjects.SharedObject} = {};
    private loadedobjquant : number = 0;
    public animationsobject : GameObjects.GameAnimations;



    constructor(target: HTMLCanvasElement, width: number, height: number, shaders: Array<ShaderTemplate> = [new Normal(), new Reverser(), new WhiteTransparent()]){
      
      this.glContext = new Render.GLContext(target,width+"",height+"");
      this.shadercontext = new ShaderLoader(this.glContext.gl,shaders);
      Generic.gamespool.push(this);
      this.gameid = Generic.gamespool.length-1;
      this.window = new Window(this.glContext)
      this.window.frm = new Composite.Frame(this.glContext, this.shadercontext, []);
      this.window.frm.rprops.srcrect = {x:0,y:0, w:this.glContext.gl.canvas.width,h:this.glContext.gl.canvas.height};
      this.window.frm.rprops.shaderID = "reverser";

      // Generic.nextid++;
      // Generic.pool.push(this);
    }

    public async load() : Promise<void>  {await this.initialize();}


    protected async initialize(keyboard:boolean=true,touch:boolean=true){
      // Time.Delta.refresh();
      if(keyboard) new Keyboard();
      // if(touch) new Touch();
      if(this.gamename == undefined || this.gamename == "") await Promise.all(await Assets.loadAllExtInFolder(this.rootFolder, this.fileextensions));
      else await Promise.all(await Assets.loadAllExtInFolder(this.rootFolder+this.gamename+'/', this.fileextensions));
      await Promise.all(await Assets.loadAllExtInFolder(this.rootFolder+'_debug/', this.fileextensions));
      await this.shadercontext.init();

      // console.log("FDASFDASFAS");
      // this.window.frm = new Composite.Frame(this.glContext, this.shadercontext, []);
      // this.window.frm.rprops.srcrect = {x:0,y:0, w:this.glContext.gl.canvas.width,h:this.glContext.gl.canvas.height};
      // this.window.frm.rprops.shaderID = "reverser";
      // console.log(this.window.frm)
    }

    // public static connectFauna(gameid:number,player:GameObjects.Player){
    //   Generic.gamespool[gameid].
    // }

    public run(sharedobjects:Array<T.SharedBlueprint>){
      for(let i = this.loadedobjquant; i < sharedobjects.length; i++){
        let newobj : T.SharedBlueprint = sharedobjects[i];
        // this.sharedobjects.pop();
        if(newobj.owner.id == this.gameid) continue;
        let invocation : GameObjects.SharedObject = new GameObjects.SharedObject(newobj);
        invocation.presence = new Incarnations.Incarnated(new Composite.Frame(this.glContext,this.shadercontext,[]))
        invocation.presence.pos = invocation.pos;
        invocation.presence.dir = invocation.dir;
        invocation.presence.anims = this.loadAnims(invocation.anisrc);
        invocation.presence.switchanimation(invocation.currentani)
        this.remoteobjects[sharedobjects[i].id] = invocation;
        this.gameframe.frame.push(invocation.presence.myFrame);
      }
      this.loadedobjquant = sharedobjects.length;
      // Time.Delta.refresh();
      for(let s of this.systempool){
        s.refresh();
      }
      for(let o of sharedobjects){
        let tomod = this.remoteobjects[o.id];
        if(tomod){
          tomod.presence.switchanimation(o.currentani);
          tomod.presence.dir = o.dir;
          tomod.presence.myFrame.rprops.pos = o.pos;
        }
      }
      // if(!this.paused) Bodies.Alacrity.refresh(this.alacritypool);
      if(!this.paused) this.refreshalacrities();
      // else Bodies.Alacrity.refreshsome(this.ui);
      // this.gameframe.camera.refresh();
      Bodies.Alacrity.resetallmovements(this.alacritypool);
    }

    private refreshalacrities(){
      this.alacritypool = this.alacritypool.filter((a)=>!a.delete)
      for(let i = 0; i < this.alacritypool.length; i++){
        this.alacritypool[i].update();
      }
      for(let i = 0; i < this.alacritypool.length; i++){
        this.alacritypool[i].finalize();
      }
    }

    public loadAnims(src:{[id:string]:string}):{[id:string]:Array<Composite.Animation>}{
      let animations : {[id:string]:Array<Composite.Animation>} = {};
      for(let s in src){
        let file = src[s];
        let ani  = GaniParser.parse(Assets.getText(file)).animations;
        let aniarr : Array<Composite.Animation> = [];
        for(let a of ani){
          aniarr.push(this.buildAni(a));
        }
        animations[s] = aniarr;
      }

      return animations;
    }

    public async newTiledLevel(leveln:number):Promise<GameObjects.Level>{
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
      await level.load();

      // if(this.currentLevel === undefined){
      //   this.gameframe = new Composite.Frame(this.glContext, this.shadercontext,
      //     [
      //       ...level.representation,
      //       ...level.bodies.map((a)=>a.myFrame),
      //       // Debug.Grid.see(collisiongrid, {x:0,y:0,w:40*16,h:40*16})
      //     ]
      //   );
      //   this.gameframe.camera = new Camera(this.srcview, {x:0,y:0,...level.levelsize});
      // } else {
      //   this.gameframe.camera.setbounds({x:0,y:0,...level.levelsize});
      //   this.gameframe.addtocomposition(
      //     [
      //       ...level.representation,
      //       ...level.bodies.map((a)=>a.myFrame),
      //     ]
      //   );
      // }



      return level;
    }

    protected displayLevel(level:GameObjects.Level){
      if(this.gameframe == undefined){
        this.gameframe = new Composite.Frame(this.glContext, this.shadercontext,
          [
            ...level.representation,
            ...level.bodies.map((a)=>a.myFrame),
            // Debug.Grid.see(collisiongrid, {x:0,y:0,w:40*16,h:40*16})
          ]
        );
        this.gameframe.camera = new Camera(this.srcview, {x:0,y:0,...level.levelsize});
        // this.systempool.push(this.gameframe.camera);
      } else {
        this.gameframe.camera.setbounds({x:0,y:0,...level.levelsize});
        this.gameframe.addtocomposition(
          [
            ...level.representation,
            ...level.bodies.map((a)=>a.myFrame),
          ]
        );
      }
    }

    private async buildLevel(level:GameObjects.Level){
    level.cellbuild = await IniParser.loadIni(this.rootFolder+level.ininame);
    level.levelsize = {w: this.cellbuild.tiles[0].tileYX[0].length * this.cellbuild.square.w, h: this.cellbuild.tiles[0].tileYX.length * this.cellbuild.square.h};
    
    // await Assets.addText(this.rootFolder+this.gamename+"/00/tree.csv")
    // this.gamephysics.collisionpool.push(new CollisionGrid(this.cellbuild.collisions[0], 16, C.CollideLayers.player, C.CollideTypes.block));

    // this.player = new Character(game);
    // new divUI(this.player)
    

    // this.bodies.push(this.player);
    level.representation = Tiled.blit(this.glContext, this.shadercontext, this.cellbuild, "level-layer")
    // this.bodies.push(new Tree(game));

    }

    public buildAni(anibuild:T.AniBuild):Composite.Animation{
      let anim : Composite.Animation = new Composite.Animation(this.glContext, this.shadercontext,[])
      // let snaps : Array<Composite.Snap>;
      for(let f of anibuild.frames){
        anim.frames.push(this.buildSnap(f));
      }
      return anim;
    }

    public buildSnap(snapbuild:Array<T.SnapBuild>):Composite.Snap{
      // let snap : Composite.Snap
      let snap: Composite.Snap = new Composite.Snap(this.glContext,this.shadercontext,[]);
      for(let p of snapbuild){
        snap.parts.push(
          new Composite.Image(this.glContext,this.shadercontext,
            p.file, p.srcrect, p.dstrect));
        
      }

      return snap;
    }

    public newFrame(contents:Array<Composite.Renderable>){
      return new Composite.Frame(this.glContext,this.shadercontext,contents);
    }

    public newRectangle(bounds: T.Bounds, color: T.Color){
      return new Composite.Rectangle(this.glContext, this.shadercontext,
        bounds, color
      )
    }

    public registerEntity(entity:Bodies.Embodiment){
      this.alacritypool.push(entity);
      this.window.frm.frame.push(entity.myFrame)
    }

    // public frameGame(contents:Array<Composite.Renderable>){
    //   this.window.frm = new Composite.Frame(this.glContext, this.shadercontext, []);
    //   this.window.frm.rprops.srcrect = {x:0,y:0, w:this.glContext.gl.canvas.width,h:this.glContext.gl.canvas.height};
    //   this.window.frm.rprops.shaderID = "reverser";
    // }
  }

  abstract class Physical extends Generic {
    // public static self : Physical;
    public gamephysics : Physics;
    
    protected async initialize(keyboard:boolean=true,touch:boolean=true){
      await super.initialize(keyboard,touch);
      this.gamephysics = new Physics();
      this.systempool.push(this.gamephysics);
      // await this.shadercontext.init();
    }

    public async newTiledLevel(leveln: number): Promise<GameObjects.Level> {
      // Physical.self.gamephysics.collisionpool = [];  
      let level = await super.newTiledLevel(leveln);
      return level;
    }

    public addCapture(captureProperties : CaptureProperties, incarnation: Bodies.Embodiment){
      this.gamephysics.collisionpool.push(
        new Capture(
          captureProperties.cwith,
          captureProperties.type,
          incarnation,
          captureProperties.hitbox,
          captureProperties.call)
      )
    }

    public addAsCollision(incarnation:Bodies.Embodiment, cwith: C.CollideLayers, type: C.CollideTypes){
      this.gamephysics.collisionpool.push(
        new NPCCollision(incarnation, cwith, type)
      )
      console.log(this.gamephysics.collisionpool)
    }

    public addGrid(boolArr : Array<Array<boolean>>, resolution: number, cwith : C.CollideLayers, type : C.CollideTypes){
      this.gamephysics.collisionpool.push(
        new CollisionGrid(boolArr,resolution,cwith,type)
      )
    }
    // public addCollision
  }

  export abstract class Action extends Physical{
    public player : GameObjects.Player;

    public async newTiledLevel(leveln: number): Promise<GameObjects.Level> {
      let level = await super.newTiledLevel(leveln);
      // this.gameframe.camera.cameraman.actor = this.player;
      // this.player.myCamera = this.gameframe.camera;
      return level;
    }
  }

  // export abstract class Puzzle extends Generic{}

  // export abstract class Strategy extends Physical {
  //   public async newTiledLevel(leveln: number): Promise<GameObjects.Level> {
  //     let level = await super.newTiledLevel(leveln);
  //     this.gameframe.camera.cameraman.actor = this.gameframe.camera.cameraman.freemovement;
  //     return level;
  //   }
  // }
}
