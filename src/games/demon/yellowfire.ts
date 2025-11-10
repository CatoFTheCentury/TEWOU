import * as T from "../../engine/_type";
import {Incarnations} from "../../engine/alacrity/_incarnations";
import { Bodies } from "../../engine/alacrity/_bodies";
import { GameAnimations } from "./animations";
import { Composite } from "../../engine/render/composite";
import Physics from '../../engine/systems/physics';
import NPCCollision from '../../engine/physics/npcCollision';
import * as C from "../../engine/physics/states"
import Game from "./game"


enum Actions {
  wander = 0,
}

enum AniSt {
  idle, walk, dead
}

enum Dir {up, left, down, right}

export default class YellowFire extends Incarnations.Fauna {
  public static index     : number = 676;
  public    action        : Actions = Actions.wander;
  protected dir           : number = Dir.right;
  protected normalgravity : Bodies.Velocity = {strength:0,x:0,y:0};

  constructor(pos: T.Point) {
    new GameAnimations.Fireball();
    let anims = GameAnimations.Fireball.fullfireballs[
      GameAnimations.Fireball.fireballs.yellow
    ];
    super(new Composite.Frame([anims[AniSt.idle]]));
    this.anims = anims;
    this.switchanimation(AniSt.idle);

    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.speed = 0.05;
    this.hitbox = {x:0,y:0,w:16,h:16};

    Game.self.gamephysics.collisionpool.push(new NPCCollision(this, 
      C.CollideLayers.npc,
      C.CollideLayers.grid | C.CollideLayers.player | C.CollideLayers.npc,
      C.CollideTypes.block | C.CollideTypes.hurt));

  }

  public override update(){
    super.update();
    if(this.activeeffects[Dir.left] & C.CollideTypes.block){
      this.dir = Dir.right;
    } else if(this.activeeffects[Dir.right] & C.CollideTypes.block){
      this.dir = Dir.left;
    }
    this.movementvector.x = this.dir == Dir.left ? -1:1;
  }
}