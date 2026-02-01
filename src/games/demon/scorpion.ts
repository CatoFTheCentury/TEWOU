import { Bodies, Composite, T, Incarnations, C, NPCCollision, Time, Capture, Games, GameObjects } from "TEWOU"

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
  protected jumpgravity   : Bodies.Velocity = {strength:.1,x:0,y:-1};

  protected actions : {[key:string]:Incarnations.action} = {
    stay : {
      elapsed:()=>{
        if(Math.random() * 100 < 10) this.dir = this.dir == Dir.left ? Dir.right : Dir.left;
        if(Math.random() * 100 < 30) this.switchaction('wander')
        },
      enabled:()=>{this.switchanimation("idle", 0)},
      timer: new Time.Timeout([200],'stay'),
      state:T.RunSwitch.off
    },
    wander : {
      elapsed:()=>{if(Math.random()*100 < 90) this.switchaction('stay')},
      running:()=>{this.movementvector.x = this.dir == Dir.left? -1 : 1},
      enabled:()=>{this.switchanimation("walk", 0)},
      timer: new Time.Timeout([1000],'wander'),
      state:T.RunSwitch.off
    },
    panic : {
      enabled:()=>{
        // this.actions.panic.timer?.restart();
        this.velocity.add(this.jumpgravity);
        this.switchanimation("jump", 0);
      },
      running:()=>{
        this.movementvector.x = this.dir == Dir.left? 1 : -1;
        let ticks = this.actions.panic.timer.getTimeoutTicks();
        if(ticks>=200) this.velocity.delete(this.jumpgravity);
        if(ticks>=500) this.switchaction('stay');
      },
      timer: new Time.Timeout([Infinity],'panic'),
      state:T.RunSwitch.off
    }
  }

  public awarenessbounds : T.Bounds =
    //looking right
    {x:-30,y:-20,w:90,h:75};
    //looking right
    // {x:-50,y:-50,w:150,h:75}

  protected action: string = 'stay';


  constructor(game:Games.Action, pos: T.Point){
    let anims = game.animationsobject.animations["scorpions"]["green"];
    super(new Composite.Frame(game.glContext, game.shadercontext, [anims["idle"][0]]));

    this.switchaction(this.action);

    this.anims = anims;
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.velocity.add(this.normalgravity);
    this.speed = 0.075;
    
    this.hitbox = {x:0,y:0,w:16,h:16}
    game.gamephysics.collisionpool.push(new NPCCollision(this, 
      C.CollideLayers.npc,
      C.CollideLayers.grid | C.CollideLayers.player | C.CollideLayers.npc,
      C.CollideTypes.block));
    
    game.gamephysics.collisionpool.push(new Capture(
      C.CollideLayers.interactable,
      C.CollideLayers.player,
      C.CollideTypes.interact,
      this,this.awarenessbounds, this.panic));
    
      game.alacritypool.push(this);
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