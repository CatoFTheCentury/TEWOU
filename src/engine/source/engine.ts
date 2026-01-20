import {Render} from "./render/_render"

import {Games} from "./_games";
// import GameArbre from "./games/arbre/game"
import {ShaderLoader} from "./render/shaderloader"
import {Assets} from "./render/assets";
import {Touch} from './systems/touch'
import {Window} from "./systems/window"
import {Keyboard} from "./systems/keyboard"
import { Time } from "./alacrity/time"

import * as T from "./_type"
import { GameObjects } from "./alacrity/_gameobjects";

// import RaceGame from './games/arduboyracing/game'
// import ArbreGame from './games/arbre/game'
// import sfx from './games/sfx/game'

export class Engine {
  public static paused = true;
  public static games : Array<Games.Generic> = [];
  public static sharedobjects : Array<T.SharedBlueprint> = [];

  constructor(game: Games.Generic){
    // new Render.GL(document.body.clientWidth+'',document.body.clientHeight+'');
    // Engine.games.push(game);
  }

  public static async start(game: Games.Generic):Promise<void>{
    // await ShaderLoader.init();
    Assets.initAudio();
    await game.load();
    // Time.Timeout.pauseAll();
    return;
  }

  public static mainLoop = () => {
    Time.Delta.refresh();
    Engine.games.forEach((g)=>{
      // g.sharedobjects = ;
      g.run(Engine.sharedobjects);
      g.window.update();
      // g.sharedobjects = [];
    }) // drop static, or run multiple games
    Keyboard.refresh(); // shouldn't it be before engine.game.run?
    // Touch.refresh(); // drop functionality
    // Window.refresh(); // move into game
    // add something that knows which window is active keyboard should only act on active window
    // if(!Engine.paused)
    // Engine.sharedobjects = [];
      requestAnimationFrame(Engine.mainLoop);
    // else requestAnimationFrame(Engine.pauseLoop);
  }

  /**
   * 
  public static pauseLoop(){
    for(let k in Keyboard.keys){
      switch (k){
        default:
          switch(Keyboard.keys[k]){
            case 1:
              Time.Timeout.resumeAll();
              Assets.audioContext.resume();
              // document.getElementById('gobutton').style.display = 'none';
              Engine.game.start();
              Engine.paused = false;
            }
            break;
      }
    }
    Keyboard.refresh();
    Touch.refresh();
    Window.refresh();
    if(!Engine.paused)requestAnimationFrame(Engine.mainLoop);
    else requestAnimationFrame(Engine.pauseLoop);
  }
  */
}


// let paused = true;

// const mainLoop = () => {

// }



// let game: Games.Generic;
/*

new Render.GL(document.body.clientWidth+'',document.body.clientHeight+'');
console.log(document.body.clientWidth);
// console.log(Render.Info.gl)
// game = new sfx();
// game = new ArbreGame();
// game = new RaceGame();
// game = new GameDemon();


start().then(()=>{
  document.getElementById('gobutton').style.visibility = 'visible';
  mainLoop();
});

let gobutton = document.getElementById('gobutton').getBoundingClientRect();

Touch.addButton('gobutton',{x:gobutton.x,y:gobutton.y,w:gobutton.width,h:500}, ()=>{
  // Time.Delta.firstTick = Date.now();
  Time.Timeout.resumeAll();
  Assets.audioContext.resume();
  document.getElementById('gobutton').style.display = 'none';
  game.start();
  paused = false;
})
}
*/


