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
  protected normalgravity : Bodies.Gravity = {strength:.05,x:0,y:1};
  protected jumpgravity   : Bodies.Gravity = {strength:.1,x:0,y:-1};
  private lifetime        : Time.Timeout = new Time.Timeout([Infinity], 'lifetime');
  private isghost         : boolean = false;
  private stoptimer       : number  = 0;
  public timer            : Time.Timeout;
  public uielt            : HTMLElement;
  // public collisiongrid    : CollisionGrid;
  private usestouch : boolean = false;

  public inventory = {
    keys: 0
  }
  
  constructor(){
    let anims = GameAnimations.CharacterAnimations.fullCharacters[GameAnimations.FullChar.skull];
    super(new Composite.Frame([anims[AniSt.idle].frames[0]]));
    // this.myFrame.dynamic = true;
    this.anims = anims;
    this.currentAnim = anims[AniSt.idle];
    
    this.changeframe = new Time.Timeout([150],'changeframe');
    this.changeframe.paused = true;
    this.timeouts.push(this.changeframe);
    
    this.jumpend = new Time.Timeout([700],'jumpend');
    this.jumpend.paused = true;
    this.timeouts.push(this.jumpend);

    Physics.collisionpool.push(new NPCCollision(this, 
      C.CollideLayers.player,
      C.CollideLayers.grid | C.CollideLayers.npc | C.CollideLayers.interactable,
      C.CollideTypes.block));
    
    this.gravity.add(this.normalgravity);
    this.speed = .075;
    this.hitbox = {x:1,y:2,w:14,h:14}
    this.flip.flipx = false;
    this.pos.x=168;
    this.pos.y=200;
  }

  public override update(){
    super.update();
    if(!this.timer){
      this.uielt.style.textAlign = "left";
      this.uielt.style.background = "red";
      // this.uielt
      this.timer = new Time.Timeout([Infinity],'timer');
    }
    if(this.stoptimer == 0){
      let potate = Math.round(this.timer.getTimeoutTicks() / 100) / 10;
      this.uielt.innerHTML = "" + potate + (potate % 1 == 0 ? '.0':'');
    } 
    if(this.lifetime.getTimeoutTicks() > 500 && this.state == AniSt.walk && !this.isghost){
      Assets.playSound("_assets/demon/footstep.wav");
      this.lifetime.reset();
    } else if(this.lifetime.getTimeoutTicks() > 1000 && this.state == AniSt.walk){
      Assets.playSound("_assets/demon/hoverghost.wav");
      this.lifetime.reset();
    }
    if(this.state == AniSt.jump && this.activeeffects[0] & C.CollideTypes.block){
      this.stopjump();
    }
    this.handleKeys();
    this.handleTriggers();
    this.handleTouch();
  }

  public react(name,params):boolean{
    switch (name){
      case 'healthup':
      //  console.log("health up by " + params[0])
      break;
      case 'becomeghost':
        this.anims = GameAnimations.CharacterAnimations.fullCharacters[GameAnimations.FullChar.ghost];
        this.isghost = true;
      break;
      case 'getkey':
        this.inventory.keys += params[0];
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

  private handleTouch(){
    let touchCount = 0;
    for(let t of Touch.touches) if(t!==undefined && t.state !== undefined && t.state > 0) touchCount++;
    if(touchCount > 0) this.usestouch = true;
    if(this.usestouch){
      for(let i = 0; i < Touch.touches.length; i++){
        let touch = Touch.touches[i];
        if(touch === undefined) continue;
        switch(touch.state){
          case -1:
            if(touch.timer.getTimeoutTicks() < 500
              && touch.start.y - touch.pos.y > 20){
              if(this.activeeffects[2] & C.CollideTypes.block && this.state != AniSt.jump){
                if(Math.random() * 100 > 50) Assets.playSound('_assets/demon/boing1.wav')
                else Assets.playSound('_assets/demon/boing2.wav')

                this.gravity.add(this.jumpgravity);
                this.jumpend.reset();
                this.jumpend.paused = false;
                this.state = AniSt.jump;
                this.myFrame.frame = [this.anims[this.state]];
              }
          }
          break;
          case 0:
            if(touchCount == 0 && this.state != AniSt.jump){
              // if(touch.timer.getTimeoutTicks() < 300){
              //   let playerpos = this.myCamera.worldtoscreen(this);
              //   this.movementvector = {x:Math.min(3,2/(Touch.view.w/touch.pos.x) - 8/((Touch.view.w)/(playerpos.x))), y:0};
              // } else {
                this.state = AniSt.idle;
                this.myFrame.frame = [this.anims[this.state]];
                this.changeframe.paused = true;
              // }
            }
            
          break;
          case 1:
            this.changeframe.paused = false;
          break;
          case 2:
            if(i===0 || touchCount == 1){

              let playerpos = this.myCamera.worldtoscreen(this);
              this.movementvector = {x:Math.min(3,2/(Touch.view.w/touch.pos.x) - 8/((Touch.view.w)/(playerpos.x))), y:0};
              this.flip.flipx = this.movementvector.x > 0
              ? false
              : true;
              this.state = AniSt.walk;
              this.myFrame.frame = [this.anims[this.state]];
            }
            this.currentAnim = this.anims[this.state];

          break;

        }
    
      }
    }
    
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
          // break;
          case  1:
          break;
        }
      break;
      case "ArrowLeft":
        switch(Keyboard.keys['ArrowLeft']){
          case -1:
            if(this.state!=AniSt.jump) this.state = AniSt.idle;

            this.state = AniSt.idle;
            this.currentAnim.currentFrame = 0;
            this.myFrame.frame = [this.anims[this.state]]
            this.changeframe.paused = true;
          case  0:
          break;
          case  1:
            if(this.state!=AniSt.jump) this.state = AniSt.walk;
            
            this.flip.flipx = true;
            this.myFrame.frame = [this.anims[this.state]];
            this.currentAnim = this.anims[this.state];
            this.changeframe.paused = false;
          case  2:
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
          // break;
          case  1:
          break;
        }
      break;
      case "ArrowRight":
        switch(Keyboard.keys['ArrowRight']){
          case -1:
            if(this.state!=AniSt.jump) this.state = AniSt.idle;
            this.currentAnim.currentFrame = 0;
            this.myFrame.frame = [this.anims[this.state]]
            this.changeframe.paused = true;
          case  0:
          break;
          case  2:
          // break;
          case  1:
            // console.log("FDS")
            if(this.state!=AniSt.jump) this.state = AniSt.walk;
            this.flip.flipx = false;
            this.myFrame.frame = [this.anims[this.state]];
            this.currentAnim = this.anims[this.state];
            this.changeframe.paused = false;
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
            if(this.activeeffects[2] & C.CollideTypes.block && this.state != AniSt.jump){
              if(Math.random() * 100 > 50) Assets.playSound('_assets/demon/boing1.wav')
              else Assets.playSound('_assets/demon/boing2.wav')

              this.gravity.add(this.jumpgravity);
              this.jumpend.reset();
              this.jumpend.paused = false;
              this.state = AniSt.jump;
              this.myFrame.frame = [this.anims[this.state]];
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
      let t : Bodies.Trigger = this.triggers.pop() || {name:"notrigger"};
      switch(t.name){
        case "changeframe":
          switch(t.state){
            case "triggered":
              this.currentAnim.currentFrame = 
              (this.currentAnim.currentFrame + 1) % this.currentAnim.frames.length;
            break;
            case "active":
            break;
            case "paused":
            break;
          }
        break;
        case "jumpend":
          switch(t.state){
            case "triggered":
              this.stopjump();
            break;
            case "active":
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
    this.gravity.delete(this.jumpgravity);
    this.jumpend.paused = true;
    this.state = AniSt.idle;
    this.myFrame.frame = [this.anims[this.state]];
  }
}