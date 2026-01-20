// import * as T from "../../engine/_type";
// import {Incarnations} from "../../engine/alacrity/_incarnations";
// import { Bodies } from "../../engine/alacrity/_bodies";
// import { Composite } from "../../engine/render/composite";
// import Physics from '../../engine/systems/physics';
// import NPCCollision from '../../engine/physics/npcCollision';
// import * as C from "../../engine/physics/states"
// import Capture from "../../engine/physics/capture"

import { T, Incarnations, Bodies, Composite, NPCCollision, C, Capture, Games} from "TEWOU"

import GameAnimations from "./animations";
import Game from "./game";


enum Actions {
  wander = 0,
}

enum AniSt {
  idle, walk, dead
}

enum Dir {up, left, down, right}

export default class RedFire extends Incarnations.Fauna {
  public static index     : number = 682;
  public actions: { [key: string]: Incarnations.action; } = {};
  public    action        : string = "wander";
  // protected dir           : number = Dir.right;
  protected normalgravity : Bodies.Velocity = {strength:0,x:0,y:0};
  private ogpos           : T.Point = {x:0,y:0};

  private awarenessbounds: T.Bounds =
    {x:-1.5*16,y:-1.5*16,w:4*16,h:4*16};


  constructor(game : Games.Action, pos: T.Point){
    // new GameAnimations.Fireball();
    let anims = game.animationsobject.animations["fireballs"]["red"];
    super(new Composite.Frame(game.glContext,game.shadercontext,[anims["idle"][0]]));
    this.anims = anims;
    this.switchanimation("idle", 0);

    this.pos.x = this.pos.x;
    this.pos.y = this.pos.y;
    this.ogpos.x = pos.x;
    this.ogpos.y = pos.y;
    this.speed = 0.025;
    this.hitbox = {x:0,y:0,w:16,h:16};

    game.gamephysics.collisionpool.push(new NPCCollision(this, 
      C.CollideLayers.npc,
      C.CollideLayers.grid | C.CollideLayers.player | C.CollideLayers.npc,
      C.CollideTypes.block | C.CollideTypes.hurt));

    game.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this, this.awarenessbounds, this.chaseplayer));

    game.alacritypool.push(this);
  }

  private chaseplayer(owner, target): boolean{
    owner.movetowards(target.pos,500)
    return false;
  }
}