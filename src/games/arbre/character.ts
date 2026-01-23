import {Player, ActionGame, CollideLayers, CollideTypes, CaptureProperties, API, Frame} from 'TEWOU'

import GaniYan from './animations/ganiyan'
import {Game} from './game'
import { Manager } from 'Console'
// import { Engine } from 'TEWOU'

export type Health = {
  max : number,
  current: number 
}

export default class Character extends Player {
  // public action: string;
  // public actions: { [key: string]: Incarnations.action; };
  // private changeframe : Time.Timeout;
  private character : GaniYan;
  private game      : ActionGame;
  // public walk : Array<Composite.Animation>;
  // private dir : number = 2;
  // private currentAnim: Composite.Animation;
  // private backtoidle : Time.Timeout;

  // public shared : T.SharedBlueprint;
  // public myCamera   : Camera;

  // public hp : Health = {max:3,current:3};

  constructor(game:ActionGame){
    let ganiYan = new GaniYan(game);
    super(new Frame(game.glContext,game.shadercontext,[ganiYan.idle[2]]));
    this.registercommands();

    this.character = ganiYan;
    this.hitbox  = {x:0,y:14,w:48,h:34};

    game.addAsCollision(this, CollideLayers.grid | CollideLayers.npc, CollideTypes.block);

    game.alacritypool.push(this);
    this.gameid = game.gameid;

    this.game = game;

  }

  public override update(){
    super.update();

    // if(Manager.currentGame == this.gameid) this.updatekeys();

    // this.shared.pos = this.pos;
    // this.shared.dir = this.dir;
  }

  private slash(){
    // let backtoidle = new Time.Timeout([this.changeframe.ms[0]*this.character.sword[0].frames.length],"backtoidle",false);
    // this.timeouts.push(backtoidle);
    // console.log(backtoidle)
    API.playSound('_assets/arbre/swoosh_1.wav');
    // Assets.playSound('_assets/arbre/swoosh_1.wav');

    this.addtimeout([800],{
      triggered: (t)=>{
        this.character.sword[this.dir].currentFrame = 0;
        this.myFrame.frame = [this.character.idle[this.dir]];
        // this.shared.currentani = "idle";
        // this.backtoidle.paused = true;
      }
    },false)

    this.myFrame.frame = [this.character.sword[this.dir]];
    // this.shared.currentani = "sword";
    // this.currentAnim = this.character.sword[this.dir];
    // this.changeframe.step   = 0;
    // this.changeframe.paused = false;

    // let box = {w:32,h:32}
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

    let props : CaptureProperties = {
      cwith: CollideLayers.npc,
      type: CollideTypes.hurt,
      hitbox: hurtpos[this.dir],
      call: (owner,target) => {
        target.triggers.push({name:"attacked"})
        return true;
      }
    }

    this.game.addCapture(props,this);
    // this.game.gamephysics.collisionpool.push(new Capture(C.CollideLayers.player,C.CollideLayers.npc,C.CollideTypes.hurt,this,hurtpos[this.dir],

    // ))
  }

  private registercommands(){
    this.registerkey('ArrowUp', {
      keyup: ()=>{
        this.character.walk[this.dir].currentFrame = 0;
        this.myFrame.frame = [this.character.idle[this.dir]];
        // this.shared.currentani = "idle";
      },
      keypressed: ()=>{
        this.dir = 0;
        this.myFrame.frame = [this.character.walk[this.dir]];
        // this.shared.currentani = "walk";
        this.movementvector.y = -1
      }
    });

    this.registerkey('ArrowLeft', {
      keyup: ()=>{
        this.character.walk[this.dir].currentFrame = 0;
        this.myFrame.frame = [this.character.idle[this.dir]];
        // this.shared.currentani = "idle";
      },
      keypressed: ()=>{
        this.dir = 1;
        this.myFrame.frame = [this.character.walk[this.dir]];
        // this.shared.currentani = "walk";
        this.movementvector.x = -1;
      }
    });

    this.registerkey('ArrowDown', {
      keyup: ()=>{
        this.character.walk[this.dir].currentFrame = 0;
        this.myFrame.frame = [this.character.idle[this.dir]];
        // this.shared.currentani = "idle";
      },
      keypressed: ()=>{
        this.dir = 2;
        this.myFrame.frame = [this.character.walk[this.dir]];
        // this.shared.currentani = "walk";
        this.movementvector.y = 1;
      }
    });

    this.registerkey('ArrowRight', {
      keyup: ()=>{
        this.character.walk[this.dir].currentFrame = 0;
        this.myFrame.frame = [this.character.idle[this.dir]];
        // this.shared.currentani = "idle";
      },
      keypressed: ()=>{
        this.dir = 3;
        this.myFrame.frame = [this.character.walk[this.dir]];
        // this.shared.currentani = "walk";
        this.movementvector.x = 1;
      }
    });

    this.registerkey('s', {
      keydown: ()=>{
        this.slash();
      }
    });
  }
    // for(let k in Keyboard.keys){
    //   switch (k){
    //     case "ArrowUp":
    //       switch(Keyboard.keys['ArrowUp']){
    //         case -1:
    //           this.character.walk[this.dir].currentFrame = 0;
    //           this.myFrame.frame = [this.character.idle[this.dir]];
    //           this.shared.currentani = "idle";
    //         case  0:
    //         break;
    //         case  2:
    //         case  1:
    //           this.dir = 0;
    //           this.myFrame.frame = [this.character.walk[this.dir]];
    //           this.shared.currentani = "walk";
    //           this.movementvector.y = -1
    //         break;
    //       }
    //     break;
    //     case "ArrowLeft":
    //       switch(Keyboard.keys['ArrowLeft']){
    //         case -1:
    //           this.character.walk[this.dir].currentFrame = 0;
    //           this.myFrame.frame = [this.character.idle[this.dir]];
    //           this.shared.currentani = "idle";
    //         case  0:
    //         break;
    //         case  2:
    //         case  1:
    //           this.dir = 1;
    //           this.myFrame.frame = [this.character.walk[this.dir]];
    //           this.shared.currentani = "walk";
    //           this.movementvector.x = -1;
    //         break;
    //       }

    //     break;
    //     case "ArrowDown":
    //       switch(Keyboard.keys['ArrowDown']){
    //         case -1:
    //           this.character.walk[this.dir].currentFrame = 0;
    //           this.myFrame.frame = [this.character.idle[this.dir]];
    //           this.shared.currentani = "idle";
    //         case  0:
    //         break;
    //         case  2:
    //         case  1:
    //           this.dir = 2;
    //           this.myFrame.frame = [this.character.walk[this.dir]];
    //           this.shared.currentani = "walk";
    //           this.movementvector.y = 1;
    //         break;
    //       }
    //     break;
    //     case "ArrowRight":
    //       switch(Keyboard.keys['ArrowRight']){
    //         case -1:
    //           this.character.walk[this.dir].currentFrame = 0;
    //           this.myFrame.frame = [this.character.idle[this.dir]];
    //           this.shared.currentani = "idle";
    //         case  0:
    //         break;
    //         case  2:
    //         case  1:
    //           this.dir = 3;
    //           this.myFrame.frame = [this.character.walk[this.dir]];
    //           this.shared.currentani = "walk";
    //           this.movementvector.x = 1;
    //         break;
    //       }
    //     break;
    //     case "s":
    //       switch(Keyboard.keys['s']){
    //         case -1:
    //         case  0:
    //         break;
    //         case  2:
    //         break;
    //         case  1:
    //           this.slash();
    //         break;
    //       }
    //     break;
    //   }
    // }
  // }

  // private handleTriggers(){
  //   while(this.triggers.length > 0){
  //     let t : Time.Trigger = this.triggers.pop() || {name:"notrigger"};
  //     switch(t.name){
  //       // case "changeframe":
  //       //   switch(t.state){
  //       //     case "triggered":
  //       //       this.currentAnim.currentFrame = 
  //       //       (this.currentAnim.currentFrame + 1) % this.currentAnim.frames.length;
  //       //     break;
  //       //     case "active":
  //       //     break;
  //       //     case "paused":
  //       //     break;
  //       //   }
  //       // break;
  //       case "backtoidle":
  //         switch(t.state){
  //           case "triggered":
  //             this.character.sword[this.dir].currentFrame = 0;
  //             this.myFrame.frame = [this.character.idle[this.dir]];
  //             this.shared.currentani = "idle";
  //             // this.changeframe.paused = true;
  //             this.backtoidle.paused = true;
  //             // document.getElementById('sword')!.style.backgroundImage = 'conic-gradient( #ffffff 0% 100%, #2196f3 100% 100%)';
  //             break;
  //           case "active":
  //             let percentdone = Math.round((this.backtoidle.getTimeoutTicks()/this.backtoidle.ms[0])*100)
  //             // document.getElementById('sword')!.style.backgroundImage = 'conic-gradient( #ffffff 0% '+ percentdone +'%, #2196f3 '+ percentdone+'% 100%)';

  //           break;
  //           case "paused":
  //           break;
  //         }
  //       break;
  //       case "move":
  //         switch(t.state){
  //           case "triggered":
  //             // this.myFrame.rprops.movementvector.x = 200-32;
  //           break;
  //           case "active":
  //           break;
  //           case "paused":
  //           break;
  //         }
  //       break;
  //     }
  //   }
  // }
}