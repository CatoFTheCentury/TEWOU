import {Bodies} from "../../engine/alacrity/_bodies"
import Keyboard from "../../engine/systems/keyboard"
import {Time} from "../../engine/alacrity/time"
import {Composite} from "../../engine/render/composite"

import FunSiYan from "./animations/funsiyan"
import GaniYan from './animations/ganiyan'
import * as T from "../../engine/_type"

import Physics from "../../engine/systems/physics"
import NPCCollision from "../../engine/physics/npcCollision"
import * as C from "../../engine/physics/states"
import Capture from '../../engine/physics/capture';

import Touch from '../../engine/systems/touch';
import Camera from "../../engine/systems/camera"
import Assets from "../../engine/render/assets"
import { Incarnations } from "../../engine/alacrity/_incarnations"
import Game from './game'
// import { Health } from '../../../build/src/components/components';

export type Health = {
  max : number,
  current: number 
}

export default class Character extends Incarnations.Player {
  public action: string;
  public actions: { [key: string]: Incarnations.action; };
  // private changeframe : Time.Timeout;
  private character : GaniYan;
  // public walk : Array<Composite.Animation>;
  private dir : number = 2;
  // private currentAnim: Composite.Animation;
  private backtoidle : Time.Timeout;
  // public myCamera   : Camera;

  public hp : Health = {max:3,current:3};

  constructor(){
    let ganiYan = new GaniYan();
    super(new Composite.Frame([ganiYan.idle[2]]));
    this.timeouts.push(new Time.Timeout([300],"move",false));
    // this.changeframe = new Time.Timeout([100,100],"changeframe",false)
    // this.changeframe.paused = true;
    // this.timeouts.push(this.changeframe);
    this.character = ganiYan;
    this.hitbox  = {x:0,y:14,w:48,h:34};
    // this.myCamera = camera;
    
    this.backtoidle = new Time.Timeout([
      (/* this.changeframe.ms[0] */200*(this.character.sword[0].frames.length-1)),
      (/* this.changeframe.ms[0] */200*(this.character.sword[1].frames.length-1)),
      (/* this.changeframe.ms[0] */200*(this.character.sword[2].frames.length-1)),
      (/* this.changeframe.ms[0] */200*(this.character.sword[3].frames.length-1))],"backtoidle",false)
    this.backtoidle.paused = true;
    this.timeouts.push(this.backtoidle);

    Game.self.gamephysics.collisionpool.push(new NPCCollision(this,C.CollideLayers.player, C.CollideLayers.grid | C.CollideLayers.npc, C.CollideTypes.block));
    
    // this.myFrame = new Composite.Frame([this.character.idle[this.dir]], {w:200,h:800});
    // this.myFrame.rprops.pos = this.pos;
    // this.myFrame.worldpos = {x:0,y:0};

  }

  public override update(){
    super.update();
    // this.handleTouch();
    this.handleKeys();
    this.handleTriggers();
  }

  // private handleTouch(){
  //   if(Touch.clicked.length == 0 && this.backtoidle.paused){
  //   switch(Touch.touchstate){
  //     case -1:
  //     break;
  //     case 0:
  //       if(Touch.time.getTimeoutTicks() < 300){
  //         let playerpos = this.myCamera.worldtoscreen(this);

  //         this.movementvector = {x:2/(Touch.view.w/Touch.touchPos.x) - 4/((Touch.view.w)/(playerpos.x)), y:2/(Touch.view.h/Touch.touchPos.y) - 4/((Touch.view.h)/(playerpos.y))};
  //       // this.dir = Math.abs(this.movementvector.x) > Math.abs(this.movementvector.y)
  //                 // ? (this.movementvector.x < 0 ? 1 : 3)
  //                 // : (this.movementvector.y < 0 ? 0 : 2);
  //       // this.changeframe.ms = [Math.min(100 / Math.abs(this.movementvector.x + this.movementvector.y),400)]
  //       } else {
  //         this.myFrame.frame = [this.character.idle[this.dir]];
  //         this.changeframe.paused = true;
  //       }
  //     break;
  //     case 1:
  //         document.getElementById('sword')!.style.backgroundImage = 'conic-gradient( #ffffff 0% 0%, #2196f3 0% 100%)';
  //         this.changeframe.step = 1;
  //         this.changeframe.paused = false;
  //       case 2:
  //         let playerpos = this.myCamera.worldtoscreen(this);
  //         console.log(playerpos.x);
  //         let posx = 2*(playerpos.x/Touch.touchPos.x) + 1;
  //         let posy = 2*(playerpos.y/Touch.touchPos.y) + 1;
  //         this.movementvector = {x:2/(Touch.view.w/Touch.touchPos.x) - 4/((Touch.view.w)/(playerpos.x)), y:2/(Touch.view.h/Touch.touchPos.y) - 4/((Touch.view.h)/(playerpos.y))};
  //         this.dir = Math.abs(this.movementvector.x) > Math.abs(this.movementvector.y)
  //           ? (this.movementvector.x < 0 ? 1 : 3)
  //           : (this.movementvector.y < 0 ? 0 : 2);
  //         this.myFrame.frame = [this.character.walk[this.dir]];
  //         this.currentAnim = this.character.walk[this.dir];

  //         this.changeframe.ms[1] = Math.min(100 / Math.abs(this.movementvector.x + this.movementvector.y),400);
  //       // console.log(Math.abs(this.movementvector.x + this.movementvector.y))
  //     break;
  //   }} else {
  //     while(Touch.clicked.length > 0){
  //       let clicked = Touch.clicked.pop();
  //       if(clicked == "sword"){
  //         this.slash();
  //       }
  //     }
  //   }
  // }

  private slash(){
    // let backtoidle = new Time.Timeout([this.changeframe.ms[0]*this.character.sword[0].frames.length],"backtoidle",false);
    // this.timeouts.push(backtoidle);
    // console.log(backtoidle)
    Assets.playSound('_assets/arbre/swoosh_1.wav');

    this.backtoidle.paused = false;
    this.backtoidle.step = this.dir;
    console.log(this.backtoidle.ms[this.backtoidle.step])
    this.backtoidle.reset();

    this.myFrame.frame = [this.character.sword[this.dir]];
    // this.currentAnim = this.character.sword[this.dir];
    // this.changeframe.step   = 0;
    // this.changeframe.paused = false;

    let box : T.Box = {w:32,h:32}
    let hurtpos = [
      //up
      {x:0,y:0-32,w:32,h:32},
      //left
      {x:0-32,y:0,w:32,h:32},
      //down
      {x:0,y:0+32,w:32,h:32},
      //right
      {x:0+32,y:0,w:32,h:32}
    ]
    Game.self.gamephysics.collisionpool.push(new Capture(C.CollideLayers.player,C.CollideLayers.npc,C.CollideTypes.hurt,this,hurtpos[this.dir],
      (owner,target) => {
        target.triggers.push({name:"attacked"})
        return true;
      }
    ))
  }

  private handleKeys(){
    for(let k in Keyboard.keys){
      switch (k){
        case "ArrowUp":
          switch(Keyboard.keys['ArrowUp']){
            case -1:
              this.character.walk[this.dir].currentFrame = 0;
              this.myFrame.frame = [this.character.idle[this.dir]];
              // this.changeframe.paused = true;
            case  0:
            break;
            case  2:
            // break;
            case  1:
              this.dir = 0;
              this.myFrame.frame = [this.character.walk[this.dir]];
              // this.currentAnim = this.character.walk[this.dir];
              // this.changeframe.paused = false;
              this.movementvector.y = -1
              // do something
            break;
          }
        break;
        case "ArrowLeft":
          switch(Keyboard.keys['ArrowLeft']){
            case -1:
              this.character.walk[this.dir].currentFrame = 0;
              this.myFrame.frame = [this.character.idle[this.dir]];
              // this.changeframe.paused = true;
            case  0:
            break;
            case  2:
            // break;
            case  1:
              this.dir = 1;
              this.myFrame.frame = [this.character.walk[this.dir]];
              // this.currentAnim = this.character.walk[this.dir];
              // this.changeframe.paused = false;
              this.movementvector.x = -1;
              // do something
            break;
          }

        break;
        case "ArrowDown":
          switch(Keyboard.keys['ArrowDown']){
            case -1:
              this.character.walk[this.dir].currentFrame = 0;
              this.myFrame.frame = [this.character.idle[this.dir]];
              // this.changeframe.paused = true;
            case  0:
            break;
            case  2:
            // break;
            case  1:
              this.dir = 2;
              this.myFrame.frame = [this.character.walk[this.dir]];
              // this.currentAnim = this.character.walk[this.dir];
              // this.changeframe.paused = false;
              this.movementvector.y = 1;
              // do something
            break;
          }
        break;
        case "ArrowRight":
          switch(Keyboard.keys['ArrowRight']){
            case -1:
              this.character.walk[this.dir].currentFrame = 0;
              this.myFrame.frame = [this.character.idle[this.dir]];
              // this.changeframe.paused = true;
            case  0:
            break;
            case  2:
            // break;
            case  1:
              this.dir = 3;
              this.myFrame.frame = [this.character.walk[this.dir]];
              // this.currentAnim = this.character.walk[this.dir];
              // this.changeframe.paused = false;
              this.movementvector.x = 1;
              // do something
            break;
          }
        break;
        case "s":
          switch(Keyboard.keys['s']){
            case -1:
            case  0:
            break;
            case  2:
            break;
            case  1:
              this.slash();
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
        // case "changeframe":
        //   switch(t.state){
        //     case "triggered":
        //       this.currentAnim.currentFrame = 
        //       (this.currentAnim.currentFrame + 1) % this.currentAnim.frames.length;
        //     break;
        //     case "active":
        //     break;
        //     case "paused":
        //     break;
        //   }
        // break;
        case "backtoidle":
          switch(t.state){
            case "triggered":
              this.character.sword[this.dir].currentFrame = 0;
              this.myFrame.frame = [this.character.idle[this.dir]];
              // this.changeframe.paused = true;
              this.backtoidle.paused = true;
              document.getElementById('sword')!.style.backgroundImage = 'conic-gradient( #ffffff 0% 100%, #2196f3 100% 100%)';
              break;
            case "active":
              let percentdone = Math.round((this.backtoidle.getTimeoutTicks()/this.backtoidle.ms[0])*100)
              document.getElementById('sword')!.style.backgroundImage = 'conic-gradient( #ffffff 0% '+ percentdone +'%, #2196f3 '+ percentdone+'% 100%)';

            break;
            case "paused":
            break;
          }
        break;
        case "move":
          switch(t.state){
            case "triggered":
              // this.myFrame.rprops.movementvector.x = 200-32;
            break;
            case "active":
            break;
            case "paused":
            break;
          }
        break;
      }
    }
  }
}