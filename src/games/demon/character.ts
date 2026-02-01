// import { Bodies } from '../../engine/alacrity/_bodies';
// import { Time } from '../../engine/alacrity/time';
// import { Composite } from "../../engine/render/composite";
// import Keyboard from "../../engine/systems/keyboard"
// import * as C from "../../engine/physics/states"
// import CollisionGrid from '../../engine/physics/gridCollision';
// import { GameAnimations } from './animations';
// import * as T from "../../engine/_type"
// import Touch from "../../engine/systems/touch"
// import Camera from '../../engine/systems/camera';
// import { Incarnations } from '../../engine/alacrity/_incarnations'
// import Physics from '../../engine/systems/physics';
// import NPCCollision from '../../engine/physics/npcCollision';
// import Assets from '../../engine/render/assets';
// import Globals from '../../engine/globals';
import Game from './game'

import { Bodies, Time, Composite, Keyboard, C, Incarnations, NPCCollision, Assets, GameObjects, Games} from "TEWOU"


enum AniSt {
  idle   = 0,
  walk   = 1,
  climb  = 2,
  attack = 3,
  jump   = 4,
  dead   = 5
}

export default class Character extends GameObjects.Player {
  private jumpend     : Time.Timeout;
  protected jumpstrength  : number         = .2;
  protected jumpgravity   : Bodies.Velocity = {strength:.125,x:0,y:-1};
  protected watergravity  : Bodies.Velocity = {strength:.025,x:0,y:1};
  private isghost         : boolean = false;
  private stoptimer       : number  = 0;
  public timer            : Time.Timeout;
  public uielt            : HTMLElement;
  private game            : Games.Action;


  private footstep : Time.Timeout = new Time.Timeout([Infinity], 'footstep');
  private collidingwater : number = 0;
  private collidingclimb : number = 0;
  private usestouch : boolean = false;

  public inventory = {
    keys: 0,
    bananas: 0,
    skullkeys: 0
  }
  
  constructor(game: Games.Action){
    let anims = game.animationsobject.animations["characters"]["skull"];
    super(new Composite.Frame(game.glContext, game.shadercontext, [anims["idle"][0]]));
    this.anims = anims;
    this.game = game;
    
    this.jumpend = new Time.Timeout([700],'jumpend');
    this.jumpend.paused = true;
    this.timeouts.push(this.jumpend);

    game.gamephysics.collisionpool.push(new NPCCollision(this, 
      C.CollideLayers.player,
      C.CollideLayers.grid | C.CollideLayers.npc | C.CollideLayers.interactable,
      C.CollideTypes.block));
    
    this.velocity.add(this.normalgravity);
    this.speed = .075;
    this.hitbox = {x:1,y:2,w:14,h:14}
    this.flip.flipx = false;
    this.pos.x=2*16;
    this.pos.y=3*16;

    game.alacritypool.push(this)
  }

  public override update(){
    super.update();
    this.collidingwater = (this.activeeffects[0] | this.activeeffects[1] | this.activeeffects[2] | this.activeeffects[3]) & C.CollideTypes.water;
    this.collidingclimb = (this.activeeffects[0] | this.activeeffects[1] | this.activeeffects[2] | this.activeeffects[3]) & C.CollideTypes.climbable;

    if(this.collidingwater){
      this.velocity.delete(this.normalgravity);
      this.velocity.add(this.watergravity);
      this.speed = .05;
    } else {
      this.velocity.delete(this.watergravity);
      if(!this.collidingclimb) this.velocity.add(this.normalgravity);
      this.speed = .075;
    }

    if(!(this.activeeffects[2] & C.CollideTypes.block) && !this.collidingclimb){
      this.switchanimation("jump",0);
    } else if(this.state == "jump" && !this.collidingclimb){
      this.switchanimation("idle", 0);
    } else if(this.collidingclimb && (this.activeeffects[2] & C.CollideTypes.block) && this.state != "walk"){
      this.switchanimation("idle", 0);
    }

    if(this.footstep.getTimeoutTicks() > 500 && this.state == "walk" && !this.isghost){
      Assets.playSound("_assets/demon/footstep.wav");
      this.footstep.reset();
    } else if(this.footstep.getTimeoutTicks() > 1000 && this.state == "walk"){
      Assets.playSound("_assets/demon/hoverghost.wav");
      this.footstep.reset();
    }
    if(this.state == "jump" && this.activeeffects[0] & C.CollideTypes.block){
      this.stopjump();
    }

    
    this.wraphorizontal();
    // this.handletimer()
    this.handleKeys();
    this.handleTriggers();
  }

  // buggy
  private wraphorizontal(){
    if(this.pos.x < 0) {
      this.myCamera.cameraman.panCamera({x:this.pos.x,y:this.pos.y},{x:this.game.currentLevel.levelsize.w,y:this.pos.y},500,
        ()=>{
          this.myCamera.cameraman.actor = this;
        })
      this.pos.x = this.game.currentLevel.levelsize.w - 20;
    } else if(this.pos.x > this.game.currentLevel.levelsize.w - 16) {
      this.myCamera.cameraman.panCamera({x:this.pos.x,y:this.pos.y},{x:0,y:this.pos.y},500,
        ()=>{
          this.myCamera.cameraman.actor = this;
        })
      this.pos.x = 0;
    }
  }

  public react(name,params):boolean{
    switch (name){
      case 'bananaup':
        this.inventory.bananas += params[0];
      break;
      case 'becomeghost':
        this.anims = this.game.animationsobject.animations["characters"]["ghost"];
        this.isghost = true;
      break;
      case 'getkey':
        this.inventory.keys += params[0];
      break;
      case 'getskullkey':
        this.inventory.skullkeys += params[0];
      break;
      case 'useskullkey':
        if(this.inventory.skullkeys > 0) {
          Assets.playSound('_assets/demon/unlock.wav')
          this.inventory.skullkeys--;
          params[0].myCollision.deleteMe = true;
          params[0].destroy();
          return true;
        }
      break;
      case 'usekey':
        if(this.inventory.keys > 0) {
          Assets.playSound('_assets/demon/unlock.wav')
          this.inventory.keys--;
          params[0].myCollision.deleteMe = true;
          params[0].destroy();
          return true;
        }
      break;
      case 'stoptimer':
        this.stoptimer = Math.round(this.timer.getTimeoutTicks() / 100) / 10;
        this.uielt.innerHTML = "" + this.stoptimer + (this.stoptimer % 1 == 0 ? '.0':'');
        this.uielt.style.background = "green";
      break;
    }
    return false;
  }

private handleKeys(){
  for(let k in Keyboard.keys){
    switch (k){
      case "ArrowUp":
        switch(Keyboard.keys['ArrowUp']){
          case -1:
          case  0:
          break;
          case  2:
          if(this.collidingclimb) {
            this.movementvector.y = -.75;
            this.switchanimation("climb",0);}
          case  1:
          if(this.collidingclimb) {
            this.velocity.delete(this.normalgravity);
            this.velocity.delete(this.jumpgravity);}
          break;
        }
      break;
      case "ArrowLeft":
        switch(Keyboard.keys['ArrowLeft']){
          case -1:
            if(this.state!="jump") this.switchanimation("idle",0);
          break;
          case  0:
          break;
          case  1:
          case  2:
            if(this.state!="jump") this.switchanimation("walk",0);
            this.flip.flipx = true;
            this.movementvector.x = -1;
          break;
        }

      break;
      case "ArrowDown":
        switch(Keyboard.keys['ArrowDown']){
          case -1:
          case  0:
          break;
          case  2:
          if(this.collidingclimb){
            this.movementvector.y = .75;
            this.switchanimation("climb",0);}
          case  1:
          if(this.collidingclimb) {
            this.velocity.delete(this.normalgravity);
            this.velocity.delete(this.jumpgravity);}
          break;
        }
      break;
      case "ArrowRight":
        switch(Keyboard.keys['ArrowRight']){
          case -1:
            if(this.state!="jump") this.switchanimation("idle",0);
          break;
          case  0:
          break;
          case  1:
          case  2:
            if(this.state!="jump") this.switchanimation("walk",0);
            this.flip.flipx = false;
            this.movementvector.x = 1;
          break;
        }
      break;
      case " ":
        switch(Keyboard.keys[' ']){
          case -1:
          case  0:
          break;
          case  2:
          break;
          case  1:
            if((this.activeeffects[2] & C.CollideTypes.block && this.state != "jump") || this.collidingwater){
              if(Math.random() * 100 > 50) Assets.playSound('_assets/demon/boing1.wav')
              else Assets.playSound('_assets/demon/boing2.wav')

              this.velocity.add(this.jumpgravity);
              this.jumpgravity.strength = this.collidingwater ? this.jumpstrength / 2 : this.jumpstrength;
              this.jumpend.restart();
              this.switchanimation("jump",0);
            }
          break;
        }
      break;
      }
    }
  }
  private handleTriggers(){
    while(this.triggers.length > 0){
      let t : Time.Trigger = this.triggers.pop() || {name:"notrigger"};
      switch(t.name){
        case "jumpend":
          switch(t.state){
            case "triggered":
              this.stopjump();
            break;
            case "active":
              this.jumpgravity.strength = 
              this.jumpstrength * (1 - (this.jumpend.getTimeoutTicks() / this.jumpend.ms[0]))
              / (this.collidingwater ? 2 : 1);
            break;
            case "paused":
            break;
          }
        break;
        case "healthup":
          console.log("Health up by" + t.state)
        break;
      }
    }
  }

  private stopjump(){
    this.velocity.delete(this.jumpgravity);
    this.jumpend.pause();
  }



}