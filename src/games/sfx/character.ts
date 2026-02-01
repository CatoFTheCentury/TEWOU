import { Incarnations } from '../../engine/alacrity/_incarnations';
import { GameAnimations } from './animations';
import { Composite } from '../../engine/render/composite';
import Keyboard from '../../engine/systems/keyboard';
import Game from './game';
import NPCCollision from '../../engine/physics/npcCollision';
import * as C from "../../engine/physics/states"
import { Zones } from "./strudeler"
import { Strudeler } from "./strudeler"

export default class Character extends Incarnations.Player {
  public action: string;
  public actions: { [key: string]: Incarnations.action;};

  private dir : number = 2;

  constructor(){
    new GameAnimations.PlayerGuy();
    super(new Composite.Frame([GameAnimations.PlayerGuy.fullPlayerGuy.idle[2]]))

    this.hitbox = {x:0,y:0,w:32,h:23};

    Game.self.gamephysics.collisionpool.push(new NPCCollision(this,
      C.CollideLayers.player,
      C.CollideLayers.grid,
      C.CollideTypes.block
    ))
    // this.anims = GameAnimations.PlayerGuy.fullPlayerGuy[0]
  }


  public override update(){
    super.update();
    // console.log(((this.activeeffects[0] | this.activeeffects[1] | this.activeeffects[2] | this.activeeffects[3]) & C.CollideTypes.custom0);
    Strudeler.Entries.zones[Zones.fences]    .running = ((this.activeeffects[0] | this.activeeffects[1] | this.activeeffects[2] | this.activeeffects[3]) & C.CollideTypes.custom0) !=0;
    Strudeler.Entries.zones[Zones.flowers]   .running = ((this.activeeffects[0] | this.activeeffects[1] | this.activeeffects[2] | this.activeeffects[3]) & C.CollideTypes.custom1) !=0;
    Strudeler.Entries.zones[Zones.home]      .running = ((this.activeeffects[0] | this.activeeffects[1] | this.activeeffects[2] | this.activeeffects[3]) & C.CollideTypes.custom2) !=0;
    Strudeler.Entries.zones[Zones.market]    .running = ((this.activeeffects[0] | this.activeeffects[1] | this.activeeffects[2] | this.activeeffects[3]) & C.CollideTypes.custom3) !=0;
    Strudeler.Entries.zones[Zones.paved]     .running = ((this.activeeffects[0] | this.activeeffects[1] | this.activeeffects[2] | this.activeeffects[3]) & C.CollideTypes.custom4) !=0;
    Strudeler.Entries.zones[Zones.shadows]   .running = ((this.activeeffects[0] | this.activeeffects[1] | this.activeeffects[2] | this.activeeffects[3]) & C.CollideTypes.custom5) !=0;
    Strudeler.Entries.zones[Zones.smalltrees].running = ((this.activeeffects[0] | this.activeeffects[1] | this.activeeffects[2] | this.activeeffects[3]) & C.CollideTypes.custom6) !=0;
    Strudeler.Entries.zones[Zones.water]     .running = ((this.activeeffects[0] | this.activeeffects[1] | this.activeeffects[2] | this.activeeffects[3]) & C.CollideTypes.custom7) !=0;
    // this.state = this.dir;
    this.handleKeys();
  }

  private handleKeys(){
    for(let k in Keyboard.keys){
      switch(k){
        case "ArrowUp":
          switch(Keyboard.keys[k]){
            case -1:
              GameAnimations.PlayerGuy.fullPlayerGuy.walk[this.dir].currentFrame = 0;
              this.myFrame.frame = [GameAnimations.PlayerGuy.fullPlayerGuy.idle[this.dir]];
              break;
            case 0:
              break;
            case 2:
            case 1:
              this.dir = 0;
              this.myFrame.frame = [GameAnimations.PlayerGuy.fullPlayerGuy.walk[this.dir]]
              this.movementvector.y = -1;
            break;
              
          }
        break;
        case "ArrowLeft":
          switch(Keyboard.keys[k]){
            case -1:
              GameAnimations.PlayerGuy.fullPlayerGuy.walk[this.dir].currentFrame = 0;
              this.myFrame.frame = [GameAnimations.PlayerGuy.fullPlayerGuy.idle[this.dir]];
              break;
            case 0:
              break;
            case 2:
            case 1:
              this.dir = 1;
              this.myFrame.frame = [GameAnimations.PlayerGuy.fullPlayerGuy.walk[this.dir]]
              this.movementvector.x = -1;
            break;
              
          }
        break;
        case "ArrowDown":
          switch(Keyboard.keys[k]){
            case -1:
              GameAnimations.PlayerGuy.fullPlayerGuy.walk[this.dir].currentFrame = 0;
              this.myFrame.frame = [GameAnimations.PlayerGuy.fullPlayerGuy.idle[this.dir]];
              break;
            case 0:
              break;
            case 2:
            case 1:
              this.dir = 2;
              this.myFrame.frame = [GameAnimations.PlayerGuy.fullPlayerGuy.walk[this.dir]]
              this.movementvector.y = 1;
            break;
              
          }
        break;
        case "ArrowRight":
          switch(Keyboard.keys[k]){
            case -1:
              GameAnimations.PlayerGuy.fullPlayerGuy.walk[this.dir].currentFrame = 0;
              this.myFrame.frame = [GameAnimations.PlayerGuy.fullPlayerGuy.idle[this.dir]];
              break;
            case 0:
              break;
            case 2:
            case 1:
              this.dir = 3;
              this.myFrame.frame = [GameAnimations.PlayerGuy.fullPlayerGuy.walk[this.dir]]
              this.movementvector.x = 1;
            break;
              
          }
        break;
      }
    }
  }
}