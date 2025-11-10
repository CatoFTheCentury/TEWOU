import Keyboard from "../../engine/systems/keyboard"
import {Time} from "../../engine/alacrity/time"
import {Composite} from "../../engine/render/composite"
import * as T from "../../engine/_type"
import Physics from "../../engine/systems/physics"
import NPCCollision from "../../engine/physics/npcCollision"
import * as C from "../../engine/physics/states"
import Capture from '../../engine/physics/capture';
import Assets from "../../engine/render/assets"
import { Incarnations } from "../../engine/alacrity/_incarnations"
import { Animations } from "./animations/animations"
import Touch from "../../engine/systems/touch"
import { Bodies } from '../../engine/alacrity/_bodies';
import UI from "./ui"
import Game from './game'
// import { T}

//Starting north, counterclockwise
enum Dir {
  n,
  nnw,
  nw,
  nww,
  w,
  sww,
  sw,
  ssw,
  s,
  sse,
  se,
  see,
  e,
  nee,
  ne,
  nne
}

export default class Car extends Incarnations.Player {
  // private directionsnaps : Composite.Snap[] = [];
  public  static hitboxes    : T.Bounds[] = [];
  public         dir         : Dir        = Dir.see;
  private        usestouch   : boolean    = true;
  private static directions  : number     = 16;
  private static RADIANS     : number     = Math.PI*2;
  private static vectors     : T.Point[]  = [];
  // private        acceltime   : Time.Timeout = new Time.Timeout([Infinity],'accel');
  private        turnticks   : Time.Timeout = new Time.Timeout([Infinity],'turn');
  private        accel       : Time.Timeout = new Time.Timeout([Infinity],'accel');
  private        decel       : Time.Timeout = new Time.Timeout([Infinity],'decel');
  private accelincrement     : number = .005;
  private        acceltime   : number = 100;
  // private        throttle    : number     = 0;
  // private        vector      : Touch.Point    = {x:0,y:0};
  private        myvelocity  : Bodies.Velocity[] = [];
  private        dirtouch    : number        = 0;
  // private        impedance   : Set<Bodies.Impedance> = new Set();
  private padcenter : T.Point;
  private padbounds : T.Bounds;
  public static angle     : number;
  private static angleperdir: number = Car.RADIANS/Car.directions;


  // public refresh(){
  //   Touch.touches.forEach((t)=>{
  //     if(Touch.inBounds(touch.pos.x,touch.pos.y,this.padbounds)){
  //       UI.angle = Math.atan2(touch.pos.y - this.padcenter.y, touch.pos.x - this.padcenter.x) * 4;
  //     }
  //   })
  //   // console.log(this.angle);
  // }

  constructor(){
    new Animations.Car();
    let anims = new Composite.Animation(Animations.Car.all);
    super(new Composite.Frame([anims]));
    this.anims = [anims];
    this.anims[0].currentFrame = this.dir;
    this.anims[0].pause();

    // let arrows = document.getElementById('arrows');
    // // console.log(arrows);
    // this.padbounds = {w:arrows!.clientWidth,h:arrows!.clientHeight,x:arrows!.offsetLeft,y:arrows!.offsetTop};
    // this.padcenter = {x:this.padbounds.w/2,y:this.padbounds.h/2};


    if(Car.hitboxes.length <= 0){
      Car.hitboxes[Dir.n  ] = {x: 5,y: 0,w:16,h:25};
      Car.hitboxes[Dir.nne] = {x: 7,y: 3,w:13,h:20};
      Car.hitboxes[Dir.ne ] = {x:12,y: 1,w:12,h:12}; // needs 2
      Car.hitboxes[Dir.nee] = {x: 3,y: 7,w:20,h:13};
      Car.hitboxes[Dir.e  ] = {x: 0,y: 5,w:25,h:16};
      Car.hitboxes[Dir.see] = {x: 3,y: 3,w:24,h:13};
      Car.hitboxes[Dir.se ] = {x:12,y: 3,w:12,h:12}; // needs 2
      Car.hitboxes[Dir.sse] = {x: 7,y: 3,w:13,h:20};
      Car.hitboxes[Dir.s  ] = {x: 5,y: 0,w:16,h:25};
      Car.hitboxes[Dir.ssw] = {x: 8,y: 3,w:23,h:20};
      Car.hitboxes[Dir.sw ] = {x: 1,y: 3,w:12,h:12}; // needs 2
      Car.hitboxes[Dir.sww] = {x: 3,y: 3,w:24,h:13};
      Car.hitboxes[Dir.w  ] = {x: 0,y: 5,w:25,h:16};
      Car.hitboxes[Dir.nww] = {x: 3,y: 7,w:20,h:13};
      Car.hitboxes[Dir.nw ] = {x: 1,y: 3,w:12,h:12}; // needs 2
      Car.hitboxes[Dir.nnw] = {x: 8,y: 3,w:13,h:20};
    }

    if(Car.vectors.length <= 0){
      for(let i = 0; i < Car.directions; i++){
        let point : T.Point = {
          x: Math.cos(i*Car.angleperdir+Math.PI/2),
          y: Math.sin(i*Car.angleperdir+Math.PI/2)
        }
        if(point.x+point.y > 1){
          point.x = point.x*Math.min(1,(1/(point.x+point.y)));
          point.y = point.y*Math.min(1,(1/(point.x+point.y)));
          // this.myvelocity.push()
        }
        Car.vectors.push({x:-point.x,y:point.y})
        this.myvelocity.push({strength:0,x:-point.x,y:point.y})
      }
    }

    for(let m of this.myvelocity) this.velocity.add(m);
    Game.gamephysics.collisionpool.push(new NPCCollision(this, 
      C.CollideLayers.player,
      C.CollideLayers.grid | C.CollideLayers.npc | C.CollideLayers.interactable,
      C.CollideTypes.block));

    this.pos.x = 160;
    this.pos.y = 360;
    this.speed = 0.075;
    
  }
  // }


  public override update(){
    super.update();
    this.anims[0].currentFrame = this.dir;
    this.hitbox = Car.hitboxes[this.dir];
    this.handletouch();
    if(this.decel.getTimeoutTicks() > this.acceltime){
      this.decel.reset();
      for(let m = 0; m < this.myvelocity.length; m++){
        if(m==this.dir) continue;
        if(this.myvelocity[m].strength < this.accelincrement) this.myvelocity[m].strength = 0;
        if(this.myvelocity[m].strength > 0) this.myvelocity[m].strength -= this.accelincrement;
      }
    }
    this.hitbox = Car.hitboxes[this.dir];
    // if(this.gimpedence.strength > 0){
      // if(this.dir > 8){
      //   this.gimpedence.x = Math.sin(Car.vectors[this.dir].x);
      //   this.gimpedence.y = Math.cos(Car.vectors[this.dir].y);
      // } else {
        // this.gimpedence.x = Car.vectors[this.dir].x;
        // this.gimpedence.y = Car.vectors[this.dir].y;
      // }
    // } else {
      // this.gimpedence.x = Car.vectors[(this.dir+8)%16].x;
      // this.gimpedence.y = Car.vectors[(this.dir+8)%16].y;
    // }

  }

  private handletouch(){
    let touchCount = 0;
    for(let t of Touch.touches) if(t!==undefined && t.state !== undefined && t.state > 0) touchCount++;
    if(touchCount > 0) this.usestouch = true;
    if(this.usestouch){
      for(let c in Touch.clickables){
        switch (c){
          case "dpadup":
            switch (Touch.clickables[c]){
              case -1:
                UI.arrowbuttons[0].myAnim.currentFrame = 0;
              break;
              case 0:
              break;
              case 1:
                UI.arrowbuttons[0].myAnim.currentFrame = 1;
              // break;
              case 2:
                this.movementvector.x = Car.vectors[(this.dir+8)%16].x;
                this.movementvector.y = Car.vectors[(this.dir+8)%16].y;
                // if(this.accel.getTimeoutTicks()>this.acceltime){
                //   this.accel.reset();
                //   this.myvelocity[(this.dir+8)%16].strength = Math.max(0.075,this.myvelocity[(this.dir+8)%16].strength+this.accelincrement);
                // }
                // this.gimpedence.strength = Math.max(this.gimpedence.strength-this.acceltime.getTimeoutTicks() / 1200000,.1);
                // this.gimpedence.x = Math.sin(-Car.vectors[this.dir].x);
                // this.gimpedence.y = Math.cos(-Car.vectors[this.dir].y);
              break;
            }
          break;
          case "dpadleft":
            switch (Touch.clickables[c]){
              case -1:
                UI.arrowbuttons[1].myAnim.currentFrame = 0;
              break;
              case 0:
              break;
              case 1:
                UI.arrowbuttons[1].myAnim.currentFrame = 1;
              // break;
              case 2:
                if(this.turnticks.getTimeoutTicks() > 300){
                  this.turnticks.reset();
                  this.dir = this.dir+1 > Dir.nne ? Dir.n :this.dir+1;

                }
              break;
            }
          break;
          case "dpaddown":
            switch (Touch.clickables[c]){
              case -1:
                UI.arrowbuttons[2].myAnim.currentFrame = 0;
                console.log(this.pos.x,this.pos.y)
              break;
              case 0:
              break;
              case 1:
                UI.arrowbuttons[2].myAnim.currentFrame = 1;
              // break;
              case 2:
                this.movementvector.x = Car.vectors[this.dir].x;
                this.movementvector.y = Car.vectors[this.dir].y;

                // this.gimpedence.strength = Math.min(this.gimpedence.strength+this.acceltime.getTimeoutTicks() / 1200000,-0.05);
                // this.gimpedence.x = Math.sin(-Car.vectors[this.dir].x);
                // this.gimpedence.y = Math.cos(-Car.vectors[this.dir].y);
              break;
            }
          break;
          case "dpadright":
            switch (Touch.clickables[c]){
              case -1:
                UI.arrowbuttons[3].myAnim.currentFrame = 0;
              break;
              case 0:
              break;
              case 1:
                UI.arrowbuttons[3].myAnim.currentFrame = 1;
              // break;
              case 2:
                if(this.turnticks.getTimeoutTicks() > 300){
                  this.turnticks.reset();
                  this.dir = this.dir-1 < 0 ? Dir.nne:this.dir-1;

                  // this.dir = this.dir+1 > Dir.nne ? Dir.n :this.dir+1;
                }
              break;
            }

          break;
        }

      }
      // Touch.clickables
      // for(let i = 0; i < Touch.touches.length; i++){
      //   let touch = Touch.touches[i];
      //   if(touch === undefined) continue;
      //   switch(touch.state){
      //     case -1:
      //     break;
      //     case 0:
      //       // if(this.dirtouch==i) this.gimpedence.strength = Math.max(this.gimpedence.strength - 0.0001,0);
      //     break;
      //     case 1:
      //       if(touch.pos.x > document.body.clientWidth / 2) this.dir = this.dir-1 < 0 ? 15:this.dir-1;
      //       else this.dir = (this.dir+1) % 16;

            
      //       if(Touch.inBounds(touch.pos.x,touch.pos.y,this.padbounds)){
      //         this.dirtouch = i;
      //         this.acceltime.reset();
      //       }
      //     break;
      //     case 2:
      //       if(Touch.inBounds(touch.pos.x,touch.pos.y,this.padbounds)){
      //         // UI.angle = Math.atan2((this.padcenter.y - touch.pos.y), this.padcenter.x - touch.pos.x) * -4 - Math.PI/2;
      //       }
      //       this.gimpedence.strength = Math.min(this.gimpedence.strength+this.acceltime.getTimeoutTicks() / 1200000,0.075);

      //       // if(this.dir * Car.angleperdir > UI.angle){

      //       // }

      //       // this.gimpedence.x = Math.sin(UI.angle);
      //       // this.gimpedence.y = Math.cos(UI.angle);
      //       // this.movementvector.x = Car.vectors[this.dir].x;
      //       // this.movementvector.y = Car.vectors[this.dir].y;
      //     break;

      //   }
    
      // }
    }
  }
}