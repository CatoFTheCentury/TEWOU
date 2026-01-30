import { GameObjects, Games } from "TEWOU"

import Scorpion from './scorpion'
import Bat from './bat'
import YellowFire from './yellowfire';
import RedFire from './redfire'
import * as Objects from './items'

export default abstract class LevelFactory extends GameObjects.Level {
  public async build(game: Games.Action):Promise<void>{}

  protected putNPCs(game: Games.Action, file: string){
    let lines = file.split('\n');
    let list  = lines.map((l)=>{return l.split(',');});
    for(let y = 0; y < list.length; y++){
      for(let x = 0; x < list[y].length; x++){
        switch (Number(list[y][x])){
          case Objects.Death.index:
            this.bodies.push(new Objects.Death(game, {x:x*16,y:y*16}));
          break;
          case Objects.Door.index:
            this.bodies.push(new Objects.Door(game, {x:x*16,y:y*16}));
          break;
          case Objects.Key.index:
            this.bodies.push(new Objects.Key(game, {x:x*16,y:y*16}));
          break;
          case Objects.Idol.index:
            this.bodies.push(new Objects.Idol(game, {x:x*16,y:y*16}));
          break;
          case Objects.RedIdol.index:
            this.bodies.push(new Objects.RedIdol(game, {x:x*16,y:y*16}));
          break;
          case Objects.Banana.index:
            this.bodies.push(new Objects.Banana(game, {x:x*16,y:y*16}));
          break;
          case Scorpion.index:
            this.bodies.push(new Scorpion(game, {x:x*16,y:y*16}));
          break;
          case Bat.index:
            this.bodies.push(new Bat(game, {x:x*16,y:y*16}));
          break;
          case RedFire.index:
            this.bodies.push(new RedFire(game, {x:x*16,y:y*16}));
          break;
          case YellowFire.index:
            this.bodies.push(new YellowFire(game, {x:x*16,y:y*16}));
          break;
          case Objects.SmallBlueBall.index:
            this.bodies.push(new Objects.SmallBlueBall(game, {x:x*16,y:y*16}));
          break;
          case Objects.SkullKey.index:
            this.bodies.push(new Objects.SkullKey(game, {x:x*16,y:y*16}));
          break;
          case Objects.RustDoor.index:
            this.bodies.push(new Objects.RustDoor(game, {x:x*16,y:y*16}));
          break;
          case Objects.Apple.index:
            this.bodies.push(new Objects.Apple(game, {x:x*16,y:y*16}));
          break;
          case Objects.Chicken.index:
            this.bodies.push(new Objects.Chicken(game, {x:x*16,y:y*16}));
          break;
        }
      }
    }
  }

}