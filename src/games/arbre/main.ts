import {Game} from './game';
import {Engine} from 'TEWOU'
import {Alice} from './test2';
import {Manager} from 'Console';

// new Render.GL(600+'',600+'');
// console.log("ALLO")
let game = new Game(Manager.currentTarget);
new Engine(game);

new Alice().showResult();

Engine.start(game).then(()=>{
  Engine.games.push(game);
  if(Engine.games.length<=1)Engine.mainLoop();
  // else {
  //   for(let i = 0; i < Engine.games.length-2;i++){
  //     game.shareAlacrities(i);
  //   }
  // }
})