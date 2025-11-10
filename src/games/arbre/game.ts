import {Games} from "../../engine/_games"
import Window from "../../engine/systems/window"
import {Composite} from "../../engine/render/composite"
import {Render} from "../../engine/render/_render"
import * as T from '../../engine/_type'
import { Incarnations } from "../../engine/alacrity/_incarnations"
import Level00 from "./level00"
import Physics from "../../engine/systems/physics"


export default class Game extends Games.Action {
  public static self : Game;
  protected levels : Incarnations.Level[] = [new Level00()];
  public gamename   : string   = "arbre";
  protected srcview : T.Box = {w:500,h:500};

  public async load(): Promise<Games.Action>{
    // let game = ;
    this.gamephysics = new Physics();
    Game.self = this;

    await this.initialize();
    // console.log(Render.Info.gl)
    this.currentLevel = await this.newTiledLevel(0);

    let per = .75;
    let gameframewidth = Render.Info.gl.canvas.width > Render.Info.gl.canvas.height ? Render.Info.gl.canvas.height * per:Render.Info.gl.canvas.width * per;
    this.gameframe.setCrop(this.srcview,{
      x:Render.Info.gl.canvas.width/2 - (Render.Info.gl.canvas.height * per)/2,
      y:0,//(Render.Info.gl.canvas.width > Render.Info.gl.canvas.height ? 0:Render.Info.gl.canvas.height/2-(Render.Info.gl.canvas.width * per)/2),
      w: gameframewidth,
      h: gameframewidth
    });

    Window.frm = new Composite.Frame([this.gameframe]);
    Window.frm.rprops.srcrect = {x:0,y:0, w:Render.Info.gl.canvas.width,h:Render.Info.gl.canvas.height};
    Window.frm.rprops.shaderID = "reverser";

    return new Game();
  }

  public start(){}

  public run(){
    super.run();
    this.gameframe.camera.refresh();
  }

}
