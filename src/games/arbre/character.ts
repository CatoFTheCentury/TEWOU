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
  private character : GaniYan;
  private game      : ActionGame;

  constructor(game:ActionGame){
    let ganiYan = new GaniYan(game);
    super(new Frame(game.glContext,game.shadercontext,[ganiYan.idle[2]]));
    this.registercommands();

    this.character = ganiYan;
    this.hitbox  = {x:0,y:14,w:48,h:34};

    game.addAsCollision(this, CollideLayers.player, CollideLayers.grid | CollideLayers.npc, CollideTypes.block);

    game.registerEntity(this,game.gameframe);
    this.gameid = game.gameid;

    this.game = game;

  }

  public override update(){
    super.update();

  }

  private slash(){
    API.playSound('_assets/arbre/swoosh_1.wav');

    this.addTimeout([800],{
      triggered: (t)=>{
        this.character.sword[this.dir].currentFrame = 0;
        this.myFrame.frame = [this.character.idle[this.dir]];
      }
    },false)

    this.myFrame.frame = [this.character.sword[this.dir]];

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
      owner: this,
      type: CollideTypes.hurt,
      hitbox: hurtpos[this.dir],
      call: (owner,target) => {
        target.triggers.push({name:"attacked"})
        return true;
      }
    }

    this.game.addCapture(props);
  }

  private registercommands(){
    this.registerkey('ArrowUp', {
      keyup: ()=>{
        this.character.walk[this.dir].currentFrame = 0;
        this.myFrame.frame = [this.character.idle[this.dir]];
      },
      keypressed: ()=>{
        this.dir = 0;
        this.myFrame.frame = [this.character.walk[this.dir]];
        this.movementvector.y = -1
      }
    });

    this.registerkey('ArrowLeft', {
      keyup: ()=>{
        this.character.walk[this.dir].currentFrame = 0;
        this.myFrame.frame = [this.character.idle[this.dir]];
      },
      keypressed: ()=>{
        this.dir = 1;
        this.myFrame.frame = [this.character.walk[this.dir]];
        this.movementvector.x = -1;
      }
    });

    this.registerkey('ArrowDown', {
      keyup: ()=>{
        this.character.walk[this.dir].currentFrame = 0;
        this.myFrame.frame = [this.character.idle[this.dir]];
      },
      keypressed: ()=>{
        this.dir = 2;
        this.myFrame.frame = [this.character.walk[this.dir]];
        this.movementvector.y = 1;
      }
    });

    this.registerkey('ArrowRight', {
      keyup: ()=>{
        this.character.walk[this.dir].currentFrame = 0;
        this.myFrame.frame = [this.character.idle[this.dir]];
      },
      keypressed: ()=>{
        this.dir = 3;
        this.myFrame.frame = [this.character.walk[this.dir]];
        this.movementvector.x = 1;
      }
    });

    this.registerkey('s', {
      keydown: ()=>{
        this.slash();
      }
    });
  }
}