import {Incarnations} from "../../engine/alacrity/_incarnations";
import { Bodies } from "../../engine/alacrity/_bodies";
import { Time } from "../../engine/alacrity/time";
import { GameAnimations } from './animations'
import { Composite } from '../../engine/render/composite';
import Physics from '../../engine/systems/physics';
import NPCCollision from '../../engine/physics/npcCollision';
import Capture from '../../engine/physics/capture';
import * as C from "../../engine/physics/states"
import * as T from '../../engine/_type';
import Game from './game'


enum Actions {
  stay0    = 0,
  stay1    = 1,
  swoosh   = 2,
  altitude = 3,
  goback   = 4
}

enum AniSt {
  idle   = 0,
  fly   = 1,
  // climb  = 2,
  attack = 2,
  // jump   = 3,
  dead   = 3
}

enum Dir {
  left = 1,
  right = 3
}

export default class Bat extends Incarnations.Fauna {
  public static index     : number = 426;
  public    action        : Actions = Actions.stay0;
  private   from          : T.Point = {x:0,y:0};
  // private   destination   : T.Point = {x:0,y:0};
  private   distance      : T.Point = {x:0,y:0};
  private   ogpos         : T.Point = {x:0,y:0};
  // protected allstates     : number = ((1<<Incarnations.AniSt.count) - 1) ^ (1<<Incarnations.AniSt.climb);
  protected dir           : number;
  protected normalgravity : Bodies.Velocity = {strength:0,x:0,y:0};
  // private anims         : Array<Composite.Animation>;

  public actiontimeouts: Array<Time.Timeout> = [
    new Time.Timeout([250], "stay0"),
    new Time.Timeout([500], "stay1"),
    new Time.Timeout([250], "swoosh"),
    // new Time.Timeout([1250], "swoosh1"),
    new Time.Timeout([1500], "altitude"),
    new Time.Timeout([1000], "goback"),
  ]

  public swooshbounds: T.Bounds =
    {x:-4*16,y:0,w:9*16,h:4*16};
  public awarenessbounds: T.Bounds =
    {x:-4*16,y:-4*16,w:9*16,h:9*16};

  constructor(pos: T.Point) {
    new GameAnimations.Bat();
    let anims = GameAnimations.Bat.fullbats[
      GameAnimations.Bat.bats.white
    ]
    // console.log(GameAnimations.Bat.fullbats);
    super(new Composite.Frame([anims[AniSt.fly]]));
    this.anims = anims;
    this.switchanimation(AniSt.fly);
    for(let i = 0; i < this.actiontimeouts.length; i++){
      this.timeouts.push(this.actiontimeouts[i])
      this.actiontimeouts[i].pause();
    }

    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.ogpos.x = pos.x;
    this.ogpos.y = pos.y;
    this.speed = 0.075;
    this.hitbox = {x:0,y:0,w:16,h:16};

    Game.gamephysics.collisionpool.push(new NPCCollision(this, 
      C.CollideLayers.npc,
      C.CollideLayers.grid | C.CollideLayers.player | C.CollideLayers.npc,
      C.CollideTypes.block | C.CollideTypes.hurt));

    Game.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this,this.swooshbounds, this.swoosh));

    Game.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this, this.awarenessbounds, this.lookatplayer));
  }

  public override update(){
    super.update();
    // console.log('state', this.action);
    // console.log("Bat constructor", this.pos);

    this.flip.flipx = this.dir == Dir.left;
    this.handleTriggers();
  }

  private lookatplayer(owner, target):boolean{
    let playerisleft = (target.pos.x + target.hitbox.w/2) < (owner.pos.x + owner.hitbox.w/2);
    if(playerisleft && owner.action != Actions.swoosh){
      owner.dir = Dir.left;
    } else {
      owner.dir = Dir.right;
    }
    return false;
  }

  private swoosh(owner, target):boolean{
    if(owner.action == Actions.stay0 || owner.action == Actions.stay1){
      owner.switchaction(Actions.swoosh);
      owner.movetowards({x:owner.pos.x - 8, y:owner.pos.y - 8}, Infinity, ()=>{
        owner.movetowards({x:target.pos.x + (owner.dir == Dir.left ? -4*16 : 4*16), y:target.pos.y + 16}, Infinity, ()=>{
          console.log("swoosh callback", owner.pos, target.pos);
          owner.switchaction(Actions.altitude);
          owner.movetowards({x:owner.pos.x + (owner.dir == Dir.left ? 8 : -8), y:owner.ogpos.y-24}, Infinity, ()=>{
            owner.switchaction(Actions.goback);
            owner.movetowards({x:owner.ogpos.x, y:owner.ogpos.y}, Infinity, ()=>{
              console.log("done swoosh");
              owner.switchaction(Actions.stay0);
            });
          });
        });
      });
    }
    return false;
  }

  private switchaction(action: Actions) {
    for (let i = 0; i < this.actiontimeouts.length; i++) {
      this.actiontimeouts[i].pause();
    }
    this.actiontimeouts[action].restart();
    this.action = action;
  }

  private handleTriggers(){
    while(this.triggers.length > 0){
      let t : Time.Trigger = this.triggers.pop() || {name:"notrigger"};
      switch(t.name){
        case "stay0":
          switch(t.state){
            case "triggered":
              this.switchaction(Actions.stay1);
            break;
            case "active":
              this.movementvector.y = .5;
            break;
            case "paused":
            break;
          }
        break;
        case "stay1":
          switch(t.state){
            case "triggered":
              this.switchaction(Actions.stay0);
            break;
            case "active":
              this.movementvector.y = -.25;
            break;
            case "paused":
            break;
          }
        break;
      }
    }
  }

}