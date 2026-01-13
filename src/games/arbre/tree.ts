import {Bodies, Games, Tiled, IniParser, Assets, Composite, Time, NPCCollision, C} from 'TEWOU';


export default class Tree extends Bodies.Embodiment{
  private health = 4;
  constructor(game: Games.Action){
    game.currentLevel.cellbuild.tiles = [IniParser.loadCSV(Assets.getText("_assets/arbre/00/tree.csv"))];

    let image = Tiled.blit(game.glContext,game.shadercontext,game.currentLevel.cellbuild, "Tree");
    super(new Composite.Frame(game.glContext,game.shadercontext,image,{w:8*16,h:6*16}));
    this.pos.x = 16 * 27;
    this.pos.y = 16*31;
    this.hitbox = {x:0,y:7*16,w:8*16,h:2*16};
    // this.myFrame.frame[0].rprops.angle =  1.57;
    game.gamephysics.collisionpool.push(new NPCCollision(this,C.CollideLayers.npc, C.CollideLayers.player, C.CollideTypes.block));

    // this.myFrame.rprops.flip.flipy = true;
    // this.myFrame.compose();
    this.myFrame.rprops.rotcenter = {x:4*16,y:3*16};
    // this.myFrame.rprops.angle = -1;
    this.myFrame.rprops.scale = {x:.5,y:.5};
    this.myFrame.rprops.scalecenter = {x:4*16,y:3*16}

    // console.log(this.myFrame.rprops.rotcenter)
    game.alacritypool.push(this);

    
  }

  public override update(){
    super.update();
    this.myFrame.rprops.scale.x = Math.max(.5,(this.myFrame.rprops.scale.x + .01) % 1.5);
    this.myFrame.rprops.scale.y = Math.max(.5,(this.myFrame.rprops.scale.y + .01) % 1.5);
    this.myFrame.rprops.angle -= 0.01;
    this.handleTriggers();
  }

  private handleTriggers(){
    while(this.triggers.length > 0){
      let t : Time.Trigger = this.triggers.pop() || {name:"notrigger"};
      switch(t.name){
        case "attacked":
          this.health--;
          if(this.health <= 0) this.myFrame.rprops.hidden = true;
        break;
      }
    }
  }
}