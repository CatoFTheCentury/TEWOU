import Game from './game';
import {Engine, Render} from 'TEWOU'
import {Manager} from 'Console';

let game = new Game(Manager.currentTarget);
new Engine(game);


Engine.start(game).then(()=>{
  Engine.games.push(game);
  if(Engine.games.length<=1)Engine.mainLoop();
})