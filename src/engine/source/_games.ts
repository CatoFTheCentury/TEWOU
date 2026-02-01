import { Incarnations } from "./alacrity/_incarnations";
import {System} from './systems/_system'
import { Bodies } from './alacrity/_bodies';
import {Keyboard} from "./systems/keyboard"
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
    public gameid : number;
    public alacritypool: Array<Bodies.Alacrity> = [];
    public systempool  : Array<System> = [];
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
    public static gamespool : Array<Generic> = [];
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

    }

    public async load() : Promise<void>  {await this.initialize();}


    protected async initialize(keyboard:boolean=true,touch:boolean=true){
      if(keyboard) new Keyboard();
      if(this.gamename == undefined || this.gamename == "") await Promise.all(await Assets.loadAllExtInFolder(this.rootFolder, this.fileextensions));
      else await Promise.all(await Assets.loadAllExtInFolder(this.rootFolder+this.gamename+'/', this.fileextensions));
      await Promise.all(await Assets.loadAllExtInFolder(this.rootFolder+'_debug/', this.fileextensions));
      await this.shadercontext.init();
    }

    public run(sharedobjects:Array<T.SharedBlueprint>){
      for(let i = this.loadedobjquant; i < sharedobjects.length; i++){
        let newobj : T.SharedBlueprint = sharedobjects[i];
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
      if(!this.paused) this.refreshalacrities();
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
      }
      let level = this.levels[leveln];
      await level.load();

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


    public buildAni(anibuild:T.AniBuild):Composite.Animation{
      let anim : Composite.Animation = new Composite.Animation(this.glContext, this.shadercontext,[])
      for(let f of anibuild.frames){
        anim.frames.push(this.buildSnap(f));
      }
      return anim;
    }

    public buildSnap(snapbuild:Array<T.SnapBuild>):Composite.Snap{
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

    public newSnap(contents:Array<Composite.Renderable>){
      return new Composite.Snap(this.glContext, this.shadercontext, contents)
    }

    public newText(text:string,properties:T.TextProperties={}){
      return new Composite.Text(this.glContext,this.shadercontext,text,properties);
    }

    public registerEntity(entity:Bodies.Embodiment, frame: Composite.Frame = this.window.frm){
      this.alacritypool.push(entity);
      frame.frame.push(entity.myFrame)
    }

  }

  abstract class Physical extends Generic {
    public gamephysics : Physics;
    
    protected async initialize(keyboard:boolean=true,touch:boolean=true){
      await super.initialize(keyboard,touch);
      this.gamephysics = new Physics();
      this.systempool.push(this.gamephysics);
    }

    public async newTiledLevel(leveln: number): Promise<GameObjects.Level> {
      let level = await super.newTiledLevel(leveln);
      return level;
    }

    public addCapture(captureProperties : CaptureProperties){
      this.gamephysics.collisionpool.push(
        new Capture(
          captureProperties.cwith,
          captureProperties.type,
          captureProperties.owner,
          captureProperties.hitbox,
          captureProperties.call)
      )
    }

    public addAsCollision(incarnation:Bodies.Embodiment, from: C.CollideLayers, cwith: C.CollideLayers, type: C.CollideTypes){
      this.gamephysics.collisionpool.push(
        new NPCCollision(incarnation, from, cwith, type)
      )
    }

    public addGrid(boolArr : Array<Array<boolean>>, resolution: number, cwith : C.CollideLayers, type : C.CollideTypes){
      this.gamephysics.collisionpool.push(
        new CollisionGrid(boolArr,resolution,cwith,type)
      )
    }
  }

  export abstract class Action extends Physical{
    public player : GameObjects.Player;

    public async newTiledLevel(leveln: number): Promise<GameObjects.Level> {
      let level = await super.newTiledLevel(leveln);
      return level;
    }
  }

}
