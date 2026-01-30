import {Games} from "./_games";
import {Assets} from "./render/assets";
import {Keyboard} from "./systems/keyboard"
import { Time } from "./alacrity/time"

import * as T from "./_type"


export class Engine {
  public static paused = true;
  public static games : Array<Games.Generic> = [];
  public static sharedobjects : Array<T.SharedBlueprint> = [];

  constructor(game: Games.Generic){
  }

  public static async start(game: Games.Generic):Promise<void>{
    Assets.initAudio();
    await game.load();
    return;
  }

  public static mainLoop = () => {
    Time.Delta.refresh();
    Engine.games.forEach((g)=>{
      g.run(Engine.sharedobjects);
      g.window.update();
    })
    Keyboard.refresh(); // this is after engine.game.run because the keys are asynchronously updated to keydown and keyup, so keyheld is the only thing to update
    requestAnimationFrame(Engine.mainLoop);
  }

}