import {Render} from "./engine/render/_render"

import Games from "./engine/games";
// import GameArbre from "./games/arbre/game"
import GameDemon from "./games/demon/game"
import ShaderLoader from "./engine/render/shaderloader"
import Assets from "./engine/render/assets";
import Touch from './engine/systems/touch'
import Window from "./engine/systems/window"
import Keyboard from "./engine/systems/keyboard"
import { Time } from "./engine/alacrity/time";


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
            Assets.audioContext.resume();
            document.getElementById('gobutton').style.display = 'none';
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
  await game.start();
}

let game: Games;

// let param = document.getElementById('gametoload').innerHTML.toLowerCase();
// switch (param) {
//   case "arbre":
//     new Render.GL("266","500");
//     game = new GameArbre();
//   break;
//   case "plat":
    new Render.GL("133","250");
    game = new GameDemon();
//   break;
//   default:
//     new Render.GL("266","500");
//     game = new GameArbre();
//   break;
// }



start().then(()=>{
  // game.run();
  document.getElementById('gobutton').style.visibility = 'visible';
  mainLoop();
});

// document.getElementById('gobutton').onclick = ()=>{
//   console.log('///')
//   Assets.initAudio();
//   document.getElementById('gobutton').style.display = 'none';
//   mainLoop();
// };
let gobutton = document.getElementById('gobutton').getBoundingClientRect();

Touch.addButton('gobutton',{x:gobutton.x,y:gobutton.y,w:gobutton.width,h:500}, ()=>{
  // Time.Delta.firstTick = Date.now();
  Assets.audioContext.resume();
  document.getElementById('gobutton').style.display = 'none';
  paused = false;
})

// document.getElementById('gobutton').onclick = ()=>{
//   // Time.Delta.firstTick = Date.now();
//   Assets.initAudio();
//   document.getElementById('gobutton').style.display = 'none';
//   paused = false;
// }

