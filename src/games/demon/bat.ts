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
// import Games from "../../../build/src/game/games";
// import { Generic } from '../../../build/src/engine/_games';


// class BatActions extends  Incarnations.Fauna{

// }





enum AniSt {
  idle   = 0,
  fly   = 1,
  attack = 2,
  dead   = 3
}

enum Dir {
  left = 1,
  right = 3
}

export default class Bat extends Incarnations.Fauna {
  protected actions : {[key:string]:Incarnations.action} = {
    // stay0
    stay0 : {
    // enabled:()=>{
    //   this.actions['stay0'].timer = ;
    //   this.actions['stay0'].timer.pause();
    // },
    enabled:()=>{this.movetowards({x:this.ogpos.x,y:this.ogpos.y+32})},
    // running:()=>{this.movementvector.y = .5;},
    elapsed:()=>{this.switchaction('stay1')},
    timer: new Time.Timeout([250],"stay0"),
    state:T.RunSwitch.off},

    stay1 : {
    enabled:()=>{this.movetowards({x:this.ogpos.x,y:this.ogpos.y-32})},
    // running:()=>{this.movementvector.y = -.25;},
    elapsed:()=>{this.switchaction('stay0')},
    timer: new Time.Timeout([250],"stay1"),
    state:T.RunSwitch.off},

    swoosh : {
      state:T.RunSwitch.off
    }
  }
  protected action: string = "stay0"

  public static index     : number = 426;
  private   ogpos         : T.Point = {x:0,y:0};
  protected dir           : number;
  protected normalgravity : Bodies.Velocity = {strength:0,x:0,y:0};

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
    this.switchaction("stay1")
    // for(let i = 0; i < this.actiontimeouts.length; i++){
    //   this.timeouts.push(this.actiontimeouts[i])
    //   this.actiontimeouts[i].pause();
    // }

    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.ogpos.x = pos.x;
    this.ogpos.y = pos.y;
    this.speed = 0.075;
    this.hitbox = {x:0,y:0,w:16,h:16};

    Game.self.gamephysics.collisionpool.push(new NPCCollision(this, 
      C.CollideLayers.npc,
      C.CollideLayers.grid | C.CollideLayers.player | C.CollideLayers.npc,
      C.CollideTypes.block | C.CollideTypes.hurt));

    this.addCapture({
      from: C.CollideLayers.interactable,
      to: C.CollideLayers.player,
      type: C.CollideTypes.interact,
      hitbox: this.swooshbounds,
      call: this.swoosh
    })
    // Game.self.gamephysics.collisionpool.push(new Capture(
    //   C.CollideLayers.interactable,
    //   C.CollideLayers.player,
    //   C.CollideTypes.interact,
    //   this, this.swooshbounds, this.swoosh));
    // //Bounds:{BoundsTo,BoundsBox},actions,reuse?=true,

    Game.self.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this, this.awarenessbounds, this.lookatplayer));
  }

  public override update(){
    super.update();
    this.flip.flipx = this.dir == Dir.left;
    // this.handleTriggers();
  }

  private lookatplayer(owner : Bat, target : Incarnations.Player):boolean{
    let playerisleft = (target.pos.x + target.hitbox.w/2) < (owner.pos.x + owner.hitbox.w/2);
    if(playerisleft && owner.actions.swoosh.state < T.RunSwitch.enabled){
      owner.dir = Dir.left;
    } else {
      owner.dir = Dir.right;
    }
    return false;
  }

  private swoosh(owner : Bat, target : Incarnations.Fauna):boolean{
    if(owner.actions.swoosh.state < T.RunSwitch.enabled){
      // owner.switchanimation(AniSt.fly);
      owner.actions.swoosh.enabled = ()=>{

        owner.movetowards({x:owner.pos.x - 8, y:owner.pos.y - 8}, Infinity, ()=>{
        owner.movetowards({x:target.pos.x + (owner.dir == Dir.left ? -2*16 : 2*16), y:target.pos.y + 16}, Infinity, ()=>{
        owner.movetowards({x:owner.pos.x + (owner.dir == Dir.left ? 8 : -8), y:owner.ogpos.y-24}, Infinity, ()=>{
        owner.movetowards({x:owner.ogpos.x, y:owner.ogpos.y}, Infinity, ()=>{
          owner.switchaction('stay0')
        });});});});
      }
      owner.switchaction('swoosh')
    }
    return false;
  }



}