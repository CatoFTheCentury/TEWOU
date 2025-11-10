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
  public static index : number = 538; //540
  protected dir : number;
  protected jumpgravity   : Bodies.Velocity = {strength:.1,x:0,y:-1};

  protected actions : {[key:string]:Incarnations.action} = {
    stay : {
      elapsed:()=>{
        if(Math.random() * 100 < 10) this.dir = this.dir == Dir.left ? Dir.right : Dir.left;
        if(Math.random() * 100 < 30) this.switchaction('wander')
        },
      enabled:()=>{this.switchanimation(AniSt.idle)},
      timer: new Time.Timeout([200],'stay'),
      state:Incarnations.actionStates.off
    },
    wander : {
      elapsed:()=>{if(Math.random()*100 < 90) this.switchaction('stay')},
      running:()=>{this.movementvector.x = this.dir == Dir.left? -1 : 1},
      enabled:()=>{this.switchanimation(AniSt.walk)},
      timer: new Time.Timeout([1000],'wander'),
      state:Incarnations.actionStates.off
    },
    panic : {
      enabled:()=>{
        // this.actions.panic.timer?.restart();
        this.velocity.add(this.jumpgravity);
        this.switchanimation(AniSt.jump);
      },
      running:()=>{
        this.movementvector.x = this.dir == Dir.left? 1 : -1;
        let ticks = this.actions.panic.timer.getTimeoutTicks();
        if(ticks>=200) this.velocity.delete(this.jumpgravity);
        if(ticks>=500) this.switchaction('stay');
      },
      timer: new Time.Timeout([Infinity],'panic'),
      state:Incarnations.actionStates.off
    }
  }

  public awarenessbounds : T.Bounds =
    //looking right
    {x:-30,y:-20,w:90,h:75};
    //looking right
    // {x:-50,y:-50,w:150,h:75}

  protected action: string = 'stay';


  constructor(pos: T.Point){
    new GameAnimations.Scorpion();
    let anims = GameAnimations.Scorpion.fullscorpions[
      GameAnimations.Scorpion.scorpions.green
    ]
    super(new Composite.Frame([anims[AniSt.idle]]));

    this.switchaction(this.action);

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

  private panic(owner:Scorpion,target):boolean{
    if(owner.actions.panic.timer?.getTimeoutTicks() > 3000){
      if(owner.pos.x > target.pos.y) owner.dir = Dir.left;
      else owner.dir = Dir.right;
      owner.switchaction('panic');
    }
    return false;
  }

  public override update(){
    super.update();
    this.flip.flipx = this.dir === Dir.left;
  }
}