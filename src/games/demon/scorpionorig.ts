import {Bodies} from '../../engine/alacrity/_bodies'
import { Composite } from '../../engine/render/composite';
import { GameAnimations } from './animations'
import * as T from '../../engine/_type'
import Game from './game'
import { Incarnations } from '../../engine/alacrity/_incarnations';
import Physics from '../../engine/systems/physics';
import * as C from "../../engine/physics/states"
import NPCCollision from '../../engine/physics/npcCollision';
import { Time } from '../../engine/alacrity/time';
import Capture from '../../engine/physics/capture';


enum Actions {
  stay = 0,
  wander = 1,
  panic = 2,
  rush  = 3

}

enum AniSt {
  idle   = 0,
  walk   = 1,
  // climb  = 2,
  attack = 2,
  jump   = 3,
  dead   = 4
}

enum Dir {
  left = 1,
  right = 3
}

export default class Scorpion extends Incarnations.Fauna{
  protected actions : {[key:string]:Incarnations.action} = {
    swoosh : {state:Incarnations.actionStates.off}
  }
  // protected allstates: number = ((1<<Incarnations.AniSt.count) - 1) ^ (1<<Incarnations.AniSt.climb);
  public static index : number = 538; //540
  protected dir : number;
  protected jumpgravity   : Bodies.Velocity = {strength:.1,x:0,y:-1};
  // private anims : Array<Composite.Animation>;

  public actiontimeouts: Array<Time.Timeout> = [
    new Time.Timeout([200], "stay"),
    new Time.Timeout([300], "wander"),
    new Time.Timeout([Infinity], "panic"),
    new Time.Timeout([400], "rush"),
  ]
  public awarenessbounds : T.Bounds =
    //looking right
    {x:-30,y:-20,w:90,h:75};
    //looking right
    // {x:-50,y:-50,w:150,h:75}


  constructor(pos: T.Point){
    new GameAnimations.Scorpion();
    let anims = GameAnimations.Scorpion.fullscorpions[
      GameAnimations.Scorpion.scorpions.green
    ]
    super(new Composite.Frame([anims[AniSt.idle]]));

    for(let i = 0; i < this.actiontimeouts.length; i++){
      this.timeouts.push(this.actiontimeouts[i]);
      this.actiontimeouts[i].pause();
    }
    this.actiontimeouts[Actions.stay].restart();

    this.anims = anims;
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.velocity.add(this.normalgravity);
    this.speed = 0.075;
    
    this.hitbox = {x:0,y:0,w:16,h:16}
    Game.self.gamephysics.collisionpool.push(new NPCCollision(this, 
      C.CollideLayers.npc,
      C.CollideLayers.grid | C.CollideLayers.player | C.CollideLayers.npc,
      C.CollideTypes.block));
    
    Game.self.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this,this.awarenessbounds, this.panic));
    
  }

  private panic(owner,target):boolean{
    if(owner.actiontimeouts[Actions.panic].getTimeoutTicks() > 3000){
      if(owner.pos.x > target.pos.y) owner.dir = Dir.left;
      else owner.dir = Dir.right;
      owner.actiontimeouts[Actions.panic].restart();
      owner.velocity.add(owner.jumpgravity);
      owner.switchanimation(AniSt.jump);
    }
    return false;
  }

  public override update(){
    super.update();
    this.handleTriggers();
  }

  private handleTriggers(){
    while(this.triggers.length > 0){
      let t : Time.Trigger = this.triggers.pop() || {name:"notrigger"};
      switch(t.name){
        case "stay":
          switch(t.state){
            case "triggered":
              if(Math.random() * 100 < 30){
                this.actiontimeouts[Actions.stay].pause();
                this.actiontimeouts[Actions.wander].restart();
                if(Math.random() * 100 < 50) {
                  this.flip.flipx = true;
                  this.dir = Dir.left;
                } else {
                  this.flip.flipx = false;
                  this.dir = Dir.right;
                }
              }
            break;
            case "active":
              this.switchanimation(AniSt.idle);
            break;
            case "paused":
            break;
          }
        break;
        case "wander":
          switch(t.state){
            case "triggered":
              if(Math.random() * 100 < 90){
                this.actiontimeouts[Actions.wander].pause();
                this.actiontimeouts[Actions.stay].restart();
              }
            break;
            case "active":
              if(this.actiontimeouts[Actions.panic].paused){
                this.movementvector.x = this.dir == Dir.left? -1 : 1;
                this.switchanimation(AniSt.walk);
              }
            break;
            case "paused":
            break;
          }
        break;
        case "panic":
          switch(t.state){
            case "triggered":
            break;
            case "active":
              if(this.dir == Dir.left) this.movementvector.x = 1;
              else this.movementvector.x = -1;
              if(this.actiontimeouts[Actions.panic].getTimeoutTicks() >= 200){
                this.velocity.delete(this.jumpgravity);
              }
              if(this.actiontimeouts[Actions.panic].getTimeoutTicks() >= 500){
                this.switchanimation(AniSt.walk);
                this.actiontimeouts[Actions.panic].pause();
                this.actiontimeouts[Actions.stay].restart();
              }
            break;
            case "paused":
            break;
          }
        break;
      }
    }
  }

}