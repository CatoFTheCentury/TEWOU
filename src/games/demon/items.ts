import Items from "./_items"
import Capture from "../../engine/physics/capture";
import * as C from "../../engine/physics/states"
import Physics from '../../engine/systems/physics';
import * as T from '../../engine/_type';
import NPCCollision from "../../engine/physics/npcCollision";
import Assets from "../../engine/render/assets";
import { Time } from "../../engine/alacrity/time";
import Game from './game'


export class Death extends Items {
  public static index = 2686;
  constructor(pos: T.Point){
    super(Items.relics.skull.skull, pos);
    this.hitbox = {x:0,y:0,w:16,h:16};
    Game.self.gamephysics.collisionpool.push(new NPCCollision(
      this, C.CollideLayers.npc, C.CollideLayers.player, C.CollideTypes.block
    ))
    Game.self.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this,{x:0,y:0,w:16,h:16}, this.hurt));
  }

  private hurt(owner,target):boolean{
    target.react('becomeghost', []);
    return false;
  }
}

export class Door extends Items {
  public static index = 2326;
  public myCollision: NPCCollision;

  constructor(pos: T.Point){
    super(Items.locks.keyhole.gold, pos);
    this.hitbox = {x:0,y:0,w:16,h:16};
    this.myCollision = new NPCCollision(
      this, C.CollideLayers.npc, C.CollideLayers.player, C.CollideTypes.block
    )
    Game.self.gamephysics.collisionpool.push(this.myCollision);
    Game.self.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this,{x:0,y:0,w:16,h:16}, this.usekey));
  }

  private usekey(owner,target){
    return target.react('usekey', [owner])
    // return false;
  }
  
}

export class RustDoor extends Items {
  public static index = 2328;
  public myCollision: NPCCollision;

  constructor(pos: T.Point){
    super(Items.locks.keyhole.rust, pos);
    this.hitbox = {x:0,y:0,w:16,h:16};
    this.myCollision = new NPCCollision(
      this, C.CollideLayers.npc, C.CollideLayers.player, C.CollideTypes.block
    )
    Game.self.gamephysics.collisionpool.push(this.myCollision);
    Game.self.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this,{x:0,y:0,w:16,h:16}, this.usekey));
  }

  private usekey(owner,target){
    return target.react('useskullkey', [owner])
    // return false;
  }
  
}

export class Key extends Items {
  public static index = 2276;
  constructor(pos: T.Point){
    super(Items.locks.key.gold, pos);
    Game.self.gamephysics.collisionpool.push(new Capture(
    C.CollideLayers.interactable,
    C.CollideLayers.player,
    C.CollideTypes.interact,
    this,{x:0,y:0,w:16,h:16}, this.get));

  }

  private get(owner,target){
    Assets.playSound('_assets/demon/key.wav')
    target.react('getkey', [1]);
    owner.destroy();
    return true;
  }
}

export class SkullKey extends Items {
  public static index = 2278;
  constructor(pos: T.Point){
    super(Items.locks.key.rust, pos);
    Game.self.gamephysics.collisionpool.push(new Capture(
    C.CollideLayers.interactable,
    C.CollideLayers.player,
    C.CollideTypes.interact,
    this,{x:0,y:0,w:16,h:16}, this.get));

  }

  private get(owner,target){
    Assets.playSound('_assets/demon/key.wav')
    target.react('getskullkey', [1]);
    owner.destroy();
    return true;
  }
}

export class Idol extends Items {
  public static index = 2635;
  constructor(pos: T.Point){
    super(Items.relics.idol.silver, pos);
    Game.self.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this,{x:0,y:0,w:16,h:16}, this.grab));
  }

  private grab(owner, target): boolean{
    Assets.playSound('_assets/demon/finish.mp3')
    target.react('stoptimer', [1])
    owner.destroy();
    return true;
  }
}

export class RedIdol extends Items {
  public static index = 2634;
  constructor(pos: T.Point){
    super(Items.relics.idol.ruby, pos);
    Game.self.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this,{x:0,y:0,w:16,h:16}, this.grab));
  }

  private grab(owner, target): boolean{
    Assets.playSound('_assets/demon/finish.mp3')
    target.react('stoptimer', [1])
    owner.destroy();
    return true;
  }
}


export class Banana extends Items {
  public static index = 791;
  constructor(position: T.Point){
    super(Items.foods.fruit.banana, position);
    Game.self.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this,{x:0,y:0,w:16,h:16}, this.grab));
  }

  private grab(owner, target): boolean{
    Assets.playSound('_assets/demon/grab.wav')
    target.react('bananaup', [1])
    owner.destroy();
    return true;
  }
}

export class Apple extends Items {
  public static index = 826;
  constructor(position: T.Point){
    super(Items.foods.fruit.apple.red, position);
    Game.self.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this,{x:0,y:0,w:16,h:16}, this.grab));
  }

  private grab(owner, target): boolean{
    Assets.playSound('_assets/demon/grab.wav')
    target.react('healthup', [1])
    owner.destroy();
    return true;
  }
}

export class Chicken extends Items {
  public static index = 979;
  constructor(position: T.Point){
    super(Items.foods.meat.chicken, position);
    Game.self.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this,{x:0,y:0,w:16,h:16}, this.grab));
  }

  private grab(owner, target): boolean{
    Assets.playSound('_assets/demon/grab.wav')
    target.react('healthup', [3])
    owner.destroy();
    return true;
  }
}

export class SmallBlueBall extends Items {
  public static index = 1939;
  private ogpos: T.Point = {x:0,y:0};
  private up : boolean = false;
  private delay : Time.Timeout;
  private move  : boolean = false;

  constructor(pos: T.Point){
    super(Items.heals.blue.orbs.small, pos);
    this.ogpos = pos;
    Game.self.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this,{x:0,y:0,w:16,h:16}, this.grab));
    this.delay = new Time.Timeout([(250*pos.x) % 1750], "start");
  }

  public override update(){
    super.update();
    if(this.delay.test().state == "triggered") this.move = true;
    if(!this.move) return;
    if(this.pos.y < this.ogpos.y - 3 || this.pos.y > this.ogpos.y + 3) this.up = !this.up;
    this.pos.y += this.up ? -.075 : .075;
  }

  private grab(owner, target): boolean{
    Assets.playSound('_assets/demon/grab.wav')
    target.react('ballsup', [1])
    owner.destroy();
    return true;
  }
}