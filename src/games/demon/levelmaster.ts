import {Incarnations} from '../../engine/alacrity/_incarnations'
import Scorpion from './scorpion'
import Bat from './bat'
import YellowFire from './yellowfire';
import RedFire from './redfire'

import * as Objects from './items'
import { Games } from '../../engine/_games';

export default abstract class LevelMaster extends Incarnations.Level {
  // public static Game : Games.Action;

  protected putNPCs(file: string){
    let lines = file.split('\n');
    // let countperline = lines[0].split(',').length;
    let list  = lines.map((l)=>{return l.split(',');});
    for(let y = 0; y < list.length; y++){
      for(let x = 0; x < list[y].length; x++){
        switch (Number(list[y][x])){
          case Objects.Death.index:
            this.bodies.push(new Objects.Death({x:x*16,y:y*16}));
          break;
          case Objects.Door.index:
            this.bodies.push(new Objects.Door({x:x*16,y:y*16}));
          break;
          case Objects.Key.index:
            this.bodies.push(new Objects.Key({x:x*16,y:y*16}));
          break;
          case Objects.Idol.index:
            this.bodies.push(new Objects.Idol({x:x*16,y:y*16}));
          break;
          case Objects.RedIdol.index:
            this.bodies.push(new Objects.RedIdol({x:x*16,y:y*16}));
          break;
          case Objects.Banana.index:
            this.bodies.push(new Objects.Banana({x:x*16,y:y*16}));
          break;
          case Scorpion.index:
            this.bodies.push(new Scorpion({x:x*16,y:y*16}));
          break;
          case Bat.index:
            this.bodies.push(new Bat({x:x*16,y:y*16}));
          break;
          case RedFire.index:
            this.bodies.push(new RedFire({x:x*16,y:y*16}));
          break;
          case YellowFire.index:
            this.bodies.push(new YellowFire({x:x*16,y:y*16}));
          break;
          case Objects.SmallBlueBall.index:
            this.bodies.push(new Objects.SmallBlueBall({x:x*16,y:y*16}));
          break;
          case Objects.SkullKey.index:
            this.bodies.push(new Objects.SkullKey({x:x*16,y:y*16}));
          break;
          case Objects.RustDoor.index:
            this.bodies.push(new Objects.RustDoor({x:x*16,y:y*16}));
          break;
          case Objects.Apple.index:
            this.bodies.push(new Objects.Apple({x:x*16,y:y*16}));
          break;
          case Objects.Chicken.index:
            this.bodies.push(new Objects.Chicken({x:x*16,y:y*16}));
          break;
        }
      }
    }
  }

}