import { Bodies } from '../../engine/alacrity/_bodies';
import { Time } from '../../engine/alacrity/time';
import { Composite } from "../../engine/render/composite";
import Keyboard from "../../engine/systems/keyboard"
import * as C from "../../engine/physics/states"
import CollisionGrid from '../../engine/physics/gridCollision';
import { GameAnimations } from './animations';
import * as T from "../../engine/_type"
import Touch from "../../engine/systems/touch"
import Camera from '../../engine/systems/camera';
import { Incarnations } from '../../engine/alacrity/_incarnations'
import Physics from '../../engine/systems/physics';
import NPCCollision from '../../engine/physics/npcCollision';
import Assets from '../../engine/render/assets';
import Globals from '../../engine/globals';
import Game from './game'


enum AniSt {
  idle   = 0,
  walk   = 1,
  climb  = 2,
  attack = 3,
  jump   = 4,
  dead   = 5
}

export default class Character extends Incarnations.Player {
  private jumpend     : Time.Timeout;
  // protected normalgravity : Bodies.Gravity = {strength:.05,x:0,y:1};
  protected jumpstrength  : number         = .2;
  protected jumpgravity   : Bodies.Velocity = {strength:.125,x:0,y:-1};
  protected watergravity  : Bodies.Velocity = {strength:.025,x:0,y:1};
  // private lifetime        : Time.Timeout = new Time.Timeout([Infinity], 'lifetime');
  private isghost         : boolean = false;
  private stoptimer       : number  = 0;
  public timer            : Time.Timeout;
  public uielt            : HTMLElement;


  private footstep : Time.Timeout = new Time.Timeout([Infinity], 'footstep');
  private collidingwater : number = 0;
  private collidingclimb : number = 0;
  // public collisiongrid    : CollisionGrid;
  private usestouch : boolean = false;

  public inventory = {
    keys: 0,
    bananas: 0,
    skullkeys: 0
  }
  
  constructor(){
    let anims = GameAnimations.CharacterAnimations.fullCharacters[GameAnimations.FullChar.skull];
    super(new Composite.Frame([anims[AniSt.idle]]));
    this.anims = anims;    
    
    this.jumpend = new Time.Timeout([700],'jumpend');
    this.jumpend.paused = true;
    this.timeouts.push(this.jumpend);

    Game.gamephysics.collisionpool.push(new NPCCollision(this, 
      C.CollideLayers.player,
      C.CollideLayers.grid | C.CollideLayers.npc | C.CollideLayers.interactable,
      C.CollideTypes.block));
    
    this.velocity.add(this.normalgravity);
    this.speed = .075;
    this.hitbox = {x:1,y:2,w:14,h:14}
    this.flip.flipx = false;
    this.pos.x=2*16;
    this.pos.y=3*16;
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
      this.switchanimation(AniSt.jump);
    } else if(this.state == AniSt.jump && !this.collidingclimb){
      this.switchanimation(AniSt.idle);
    } else if(this.collidingclimb && (this.activeeffects[2] & C.CollideTypes.block) && this.state != AniSt.walk){
      this.switchanimation(AniSt.idle);
    }

    if(this.footstep.getTimeoutTicks() > 500 && this.state == AniSt.walk && !this.isghost){
      Assets.playSound("_assets/demon/footstep.wav");
      this.footstep.reset();
    } else if(this.footstep.getTimeoutTicks() > 1000 && this.state == AniSt.walk){
      Assets.playSound("_assets/demon/hoverghost.wav");
      this.footstep.reset();
    }
    if(this.state == AniSt.jump && this.activeeffects[0] & C.CollideTypes.block){
      this.stopjump();
    }

    
    this.wraphorizontal();
    this.handletimer()
    this.handleKeys();
    this.handleTriggers();
    // this.handleTouch();
  }

  private wraphorizontal(){
    if(this.pos.x < 0) {
      this.myCamera.cameraman.panCamera({x:this.pos.x,y:this.pos.y},{x:Globals.levelsize.w,y:this.pos.y},500,
        ()=>{
          this.myCamera.cameraman.actor = this;
        })
      this.pos.x = Globals.levelsize.w - 20;
    } else if(this.pos.x > Globals.levelsize.w - 16) {
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
      //  console.log("health up by " + params[0])
      break;
      case 'becomeghost':
        this.anims = GameAnimations.CharacterAnimations.fullCharacters[GameAnimations.FullChar.ghost];
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
      // break;
    }
    // console.log('woops')
    return false;
  }

  // private handleTouch(){
  //   let touchCount = 0;
  //   for(let t of Touch.touches) if(t!==undefined && t.state !== undefined && t.state > 0) touchCount++;
  //   if(touchCount > 0) this.usestouch = true;
  //   if(this.usestouch){
  //     for(let i = 0; i < Touch.touches.length; i++){
  //       let touch = Touch.touches[i];
  //       if(touch === undefined) continue;
  //       switch(touch.state){
  //         case -1:
  //           if(touch.timer.getTimeoutTicks() < 500
  //             && touch.start.y - touch.pos.y > 20){
  //             if(this.activeeffects[2] & C.CollideTypes.block && this.state != AniSt.jump){
  //               if(Math.random() * 100 > 50) Assets.playSound('_assets/demon/boing1.wav')
  //               else Assets.playSound('_assets/demon/boing2.wav')

  //               this.velocity.add(this.jumpgravity);
  //               this.jumpend.reset();
  //               this.jumpend.paused = false;
  //               this.state = AniSt.jump;
  //               this.myFrame.frame = [this.anims[this.state]];
  //             }
  //         }
  //         break;
  //         case 0:
  //           if(touchCount == 0 && this.state != AniSt.jump){
  //             // if(touch.timer.getTimeoutTicks() < 300){
  //             //   let playerpos = this.myCamera.worldtoscreen(this);
  //             //   this.movementvector = {x:Math.min(3,2/(Touch.view.w/touch.pos.x) - 8/((Touch.view.w)/(playerpos.x))), y:0};
  //             // } else {
  //               this.state = AniSt.idle;
  //               this.myFrame.frame = [this.anims[this.state]];
  //               this.changeframe.pause();
  //             // }
  //           }
            
  //         break;
  //         case 1:
  //           this.changeframe.resume();
  //         break;
  //         case 2:
  //           if(i===0 || touchCount == 1){

  //             let playerpos = this.myCamera.worldtoscreen(this);
  //             this.movementvector = {x:Math.min(3,2/(Touch.view.w/touch.pos.x) - 8/((Touch.view.w)/(playerpos.x))), y:0};
  //             this.flip.flipx = this.movementvector.x > 0
  //             ? false
  //             : true;
  //             this.state = AniSt.walk;
  //             this.myFrame.frame = [this.anims[this.state]];
  //           }
  //           this.currentAnim = this.anims[this.state];

  //         break;

  //       }
    
  //     }
  //   }
    
  // }

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
            this.switchanimation(AniSt.climb);}
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
            if(this.state!=AniSt.jump) this.switchanimation(AniSt.idle);
          break;
          case  0:
          break;
          case  1:
          case  2:
            if(this.state!=AniSt.jump) this.switchanimation(AniSt.walk);
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
            this.switchanimation(AniSt.climb);}
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
            if(this.state!=AniSt.jump) this.switchanimation(AniSt.idle);
          break;
          case  0:
          break;
          case  1:
          case  2:
            if(this.state!=AniSt.jump) this.switchanimation(AniSt.walk);
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
            // console.log("Player x: " + this.pos.x +", Player y: " + this.pos.y);
            if((this.activeeffects[2] & C.CollideTypes.block && this.state != AniSt.jump) || this.collidingwater){
              if(Math.random() * 100 > 50) Assets.playSound('_assets/demon/boing1.wav')
              else Assets.playSound('_assets/demon/boing2.wav')

              this.velocity.add(this.jumpgravity);
              this.jumpgravity.strength = this.collidingwater ? this.jumpstrength / 2 : this.jumpstrength;
              // this.jumpend.ms[0] = this.collidingwater ? 350 : 700;
              this.jumpend.restart();
              this.switchanimation(AniSt.jump);
            }
            // console.log("SPACE")
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

  private handletimer(){
    if(!this.timer){
      this.uielt.style.textAlign = "left";
      this.uielt.style.background = "red";
      this.uielt.style.visibility = 'hidden';
      // this.uielt
      this.timer = new Time.Timeout([Infinity],'timer');
    }
    if(this.stoptimer == 0){
      let potate = Math.round(this.timer.getTimeoutTicks() / 100) / 10;
      this.uielt.innerHTML = "" + potate + (potate % 1 == 0 ? '.0':'');
    } 

  }

}