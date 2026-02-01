import { Games } from '../../engine/_games';
import { Incarnations } from '../../engine/alacrity/_incarnations';
import { Time } from '../../engine/alacrity/time';
import Level00 from './level00'
import * as T from '../../engine/_type'
import Physics from "../../engine/systems/physics"
import { Render         } from "../../engine/render/_render"
import Window from "../../engine/systems/window"
import { Composite      } from "../../engine/render/composite"
import { Debug } from "../../engine/debug/dbggrid"




export default class Game extends Games.Action{
  public static self: Game;
  public gamename: string = 'gfx';
  protected levels : Incarnations.Level[] = [new Level00()]
  protected srcview: T.Box = {w:9*16,h:20*16};

  public async load(): Promise<Games.Action>{
    this.gamephysics = new Physics();
    Game.self = this;
    await this.initialize();
    Render.Info.gl.clearColor(0, 0, 0, 1);
    this.currentLevel = await this.newTiledLevel(0);

    
    Time.Timeout.pauseAll();
    this.paused = true;
    let per = .75;
    let gameframeheight = Render.Info.gl.canvas.height * per;
    this.gameframe.setCrop(this.srcview,{
      x:Render.Info.gl.canvas.width /2 - ((gameframeheight / 20) * 9)/2,
      y:Render.Info.gl.canvas.height/2 - gameframeheight/2,
      w: (gameframeheight / 20) * 9,
      h: gameframeheight
    });

    this.gameframe.frame.push(Debug.Grid.see(this.currentLevel.grids[0],{x:0,y:0,w:1024,h:1024}))

    Window.frm = new Composite.Frame(
      [
        this.gameframe,
        
      ]);
    // Window.frm.camera = cam;

    // cam.actor = char;
    // char.myCamera = Window.frm.camera;
    Window.frm.rprops.srcrect = {x:0,y:0, w:Render.Info.gl.canvas.width,h:Render.Info.gl.canvas.height};
    Window.frm.rprops.shaderID = "reverser";


    return new Game();

  }

  public start(){
    Time.Timeout.resumeAll();
    this.paused = false;
  }
  public run(){
    super.run();
    this.gameframe.camera.refresh();  }

}