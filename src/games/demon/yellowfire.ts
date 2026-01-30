import { T, Incarnations, Bodies, Composite, NPCCollision, C, Games} from "TEWOU"

enum AniSt {
  idle, walk, dead
}

enum Dir {up, left, down, right}

export default class YellowFire extends Incarnations.Fauna {
  public static index     : number = 676;
  public    action        : string = "wander";
  public actions: { [key: string]: Incarnations.action; } = {};
  protected normalgravity : Bodies.Velocity = {strength:0,x:0,y:0};

  constructor(game: Games.Action, pos: T.Point) {
    let anims = game.animationsobject.animations["fireballs"]["yellow"];
    super(new Composite.Frame(game.glContext, game.shadercontext, [anims["idle"][0]]));
    this.anims = anims;
    this.switchanimation("idle", 0);
    this.dir = Dir.right;

    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.speed = 0.05;
    this.hitbox = {x:0,y:0,w:16,h:16};

    game.gamephysics.collisionpool.push(new NPCCollision(this, 
      C.CollideLayers.npc,
      C.CollideLayers.grid | C.CollideLayers.player | C.CollideLayers.npc,
      C.CollideTypes.block | C.CollideTypes.hurt));

    game.alacritypool.push(this);
  }

  public override update(){
    super.update();
    if(this.activeeffects[Dir.left] & C.CollideTypes.block){
      this.dir = Dir.right;
    } else if(this.activeeffects[Dir.right] & C.CollideTypes.block){
      this.dir = Dir.left;
    }
    this.movementvector.x = this.dir == Dir.left ? -1:1;
  }
}