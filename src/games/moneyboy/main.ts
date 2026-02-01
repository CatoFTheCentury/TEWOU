import Game from './game';
import {Engine} from 'TEWOU'
import {Manager} from 'Console';

let game = new Game();

new Engine(game);
Engine.start(game).then(()=>{
  Engine.games.push(game);
  if(Engine.games.length<=1)Engine.mainLoop();
  // else {
  //   for(let i = 0; i < Engine.games.length-2;i++){
  //     game.shareAlacrities(i);
  //   }
  // }
})