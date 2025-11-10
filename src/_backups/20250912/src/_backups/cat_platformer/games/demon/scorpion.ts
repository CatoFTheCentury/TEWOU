import {Bodies} from '../../engine/alacrity/_bodies'
import { Composite } from '../../engine/render/composite';
import { GameAnimations } from './animations'
import * as T from '../../engine/_type'
import Games from '../../engine/games'
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

enum Dir {
  left = 1,
  right = 3
}

export default class Scorpion extends Incarnations.Fauna{
  protected allstates: number = ((1<<Incarnations.AniSt.count) - 1) ^ (1<<Incarnations.AniSt.climb);
  public static index : number = 540;
  protected dir : number;
  protected jumpgravity   : Bodies.Gravity = {strength:.1,x:0,y:-1};

  // public anims : Array<Composite.Animation> = [];
  // protected normalgravity : Bodies.Gravity = {strength:.05,x:0,y:1};
  // public action : Actions;
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
  // ]
  // private haspanicked = false;


  constructor(pos: T.Point){
    new GameAnimations.ScorpionAnimations();
    let anims = GameAnimations.ScorpionAnimations.fullscorpions[
      GameAnimations.ScorpionAnimations.scorpions.green
    ]
    super(new Composite.Frame([anims[Incarnations.AniSt.idle]]));

    for(let i = 0; i < this.actiontimeouts.length; i++){
      this.timeouts.push(this.actiontimeouts[i]);
      this.actiontimeouts[i].pause();
    }
    this.actiontimeouts[Actions.stay].restart();

    this.anims = anims;
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.gravity.add(this.normalgravity);
    this.speed = 0.075;
    
    this.hitbox = {x:0,y:0,w:16,h:16}
    Physics.collisionpool.push(new NPCCollision(this, 
      C.CollideLayers.npc,
      C.CollideLayers.grid | C.CollideLayers.player,
      C.CollideTypes.block));
    
    Physics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this,this.awarenessbounds, this.panic));
    
  }

  private panic(owner,target):boolean{
    // if(this.actiontimeouts[Actions.panic].paused)
    if(owner.actiontimeouts[Actions.panic].getTimeoutTicks() > 3000){
      if(owner.pos.x > target.pos.y) owner.dir = Dir.left;
      else owner.dir = Dir.right;
      owner.actiontimeouts[Actions.panic].restart();
      owner.gravity.add(owner.jumpgravity);
    }
    return false;
  }

  public override update(){
    super.update();
    this.handleTriggers();
  }

  private handleTriggers(){
    while(this.triggers.length > 0){
      let t : Bodies.Trigger = this.triggers.pop() || {name:"notrigger"};
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
                this.gravity.delete(this.jumpgravity);
              }
              if(this.actiontimeouts[Actions.panic].getTimeoutTicks() >= 500){
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