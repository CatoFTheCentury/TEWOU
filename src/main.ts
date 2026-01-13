import {Render} from "./engine/render/_render"

import {Games} from "./engine/_games";
// import GameArbre from "./games/arbre/game"
import GameDemon from "./games/demon/game"
import ShaderLoader from "./engine/render/shaderloader"
import Assets from "./engine/render/assets";
import Touch from './engine/systems/touch'
import Window from "./engine/systems/window"
import Keyboard from "./engine/systems/keyboard"
import { Time } from "./engine/alacrity/time";

import RaceGame from './games/arduboyracing/game'
import ArbreGame from './games/arbre/game'
import sfx from './games/sfx/game'


let paused = true;

const mainLoop = () => {
  game.run();
  Keyboard.refresh();
  Touch.refresh();
  Window.refresh();
  if(!paused)requestAnimationFrame(mainLoop);
  else requestAnimationFrame(pauseLoop);

}

function pauseLoop(){
  for(let k in Keyboard.keys){
    switch (k){
      default:
        switch(Keyboard.keys[k]){
          case 1:
            Time.Timeout.resumeAll();
            Assets.audioContext.resume();
            document.getElementById('gobutton').style.display = 'none';
            game.start();
            paused = false;
        }
      break;
    }
  }
  Keyboard.refresh();
  Touch.refresh();
  Window.refresh();
  if(!paused)requestAnimationFrame(mainLoop);
  else requestAnimationFrame(pauseLoop);
}

const start = async () => {
  await ShaderLoader.init();
  Assets.initAudio();
  await game.load();
  Time.Timeout.pauseAll();
}

let game: Games.Generic;


new Render.GL(document.body.clientWidth+'',document.body.clientHeight+'');
console.log(document.body.clientWidth);
// console.log(Render.Info.gl)
// game = new sfx();
game = new ArbreGame();
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