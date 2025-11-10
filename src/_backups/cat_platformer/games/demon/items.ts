import Items from "./_items"
import Capture from "../../engine/physics/capture";
import * as C from "../../engine/physics/states"
import Physics from '../../engine/systems/physics';
import * as T from '../../engine/_type';
import NPCCollision from "../../engine/physics/npcCollision";
import Assets from "../../engine/render/assets";


export class Death extends Items {
  public static index = 2680;
  constructor(pos: T.Point){
    super(Items.relics.skull.skull, pos);
    this.hitbox = {x:0,y:0,w:16,h:16};
    Physics.collisionpool.push(new NPCCollision(
      this, C.CollideLayers.npc, C.CollideLayers.player, C.CollideTypes.block
    ))
    Physics.collisionpool.push(new Capture(
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
    Physics.collisionpool.push(this.myCollision);
    Physics.collisionpool.push(new Capture(
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

export class Key extends Items {
  public static index = 2276;
  constructor(pos: T.Point){
    super(Items.locks.key.gold, pos);
    Physics.collisionpool.push(new Capture(
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

export class Idol extends Items {
  public static index = 2635;
  constructor(pos: T.Point){
    super(Items.relics.idol.silver, pos);
    Physics.collisionpool.push(new Capture(
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
    Physics.collisionpool.push(new Capture(
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

  // public destroy(){
  //   super.destroy()
  //   // this.myFrame.rprops.hidden = true;
  // }
}