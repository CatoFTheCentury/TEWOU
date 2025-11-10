import { Render } from '../../engine/render/_render'
import { Incarnations } from '../../engine/alacrity/_incarnations'
import { Composite } from '../../engine/render/composite';

import Games from '../../engine/games'
import Assets from '../../engine/render/assets';
import Window from '../../engine/systems/window';
import * as T from '../../engine/_type';

import UI from './ui'
import Timer from './timer'
import Level00 from "./level00"


export default class Game extends Games {
  public gamename : string = 'arduboy';
  protected levels   : Incarnations.Level[] = [new Level00()];
  protected srcview  : T.Box = {w:200,h:200};
  private   timer    : Timer;

  public async load(): Promise<Games>{
    await this.initialize();
    Render.Info.gl.clearColor(.25,.4,.25,1);
    this.timer = new Timer();
    await Promise.all(await Assets.loadAllExtInFolder('_assets/_debug/', ['png']));
    this.currentLevel = await this.newLevel(0);
    this.gameframe.camera.cameraman.freemovement.pos.y = 35*16;

    let per = .75;
    let gameframewidth = Render.Info.gl.canvas.width > Render.Info.gl.canvas.height ? Render.Info.gl.canvas.height * per:Render.Info.gl.canvas.width * per;
    this.gameframe.setCrop(this.srcview,{
      x:Render.Info.gl.canvas.width/2 - (Render.Info.gl.canvas.height * per)/2,
      y:0,//(Render.Info.gl.canvas.width > Render.Info.gl.canvas.height ? 0:Render.Info.gl.canvas.height/2-(Render.Info.gl.canvas.width * per)/2),
      w: gameframewidth,
      h: gameframewidth
    });


    new UI(gameframewidth);
    let dpad = UI.dpad;

    Window.frm = new Composite.Frame([
      this.gameframe,
      dpad,

    ]);
    // car.myCamera = Window.frm.camera;
    // Window.frm.rprops.srcrect = {x:0,y:0, w:Render.Info.gl.canvas.width,h:Render.Info.gl.canvas.height};
    Window.frm.rprops.shaderID = "reverser";
    // Window.frm.compose();
    // this.gameframe.camera.refresh();

    // console.log(this.gameframe.test())
    // console.log(this.player.myFrame.getclientleft());
    // console.log(ui[3].mySnap.getclientleft());
    
    return new Game();

  }

  public start(){
    this.timer.elapsed.restart();
  }

  public run(){
    super.run();
    this.gameframe.camera.refresh();
  }

}