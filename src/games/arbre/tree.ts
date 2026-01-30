import {Player, ActionGame, CollideLayers, CollideTypes, CaptureProperties, API, Frame, Fauna} from 'TEWOU'


export default class Tree extends Fauna{
  public actions;
  public action;
  private health = 4;
  constructor(game: ActionGame){

    let image = API.imageFromCSV(game, "_assets/arbre/00/tree.csv");
    super(new Frame(game.glContext,game.shadercontext,[image],{w:8*16,h:6*16}));
    this.pos.x = 16 * 27;
    this.pos.y = 16*31;
    this.hitbox = {x:0,y:7*16,w:8*16,h:2*16};
    game.addAsCollision(this,CollideLayers.npc, CollideLayers.player,CollideTypes.block);

    this.myFrame.rprops.rotcenter = {x:4*16,y:3*16};
    this.myFrame.rprops.scale = {x:.5,y:.5};
    this.myFrame.rprops.scalecenter = {x:4*16,y:3*16}

    game.registerEntity(this); 

    
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
      let t = this.triggers.pop() || {name:"notrigger"};
      switch(t.name){
        case "attacked":
          this.health--;
          if(this.health <= 0) this.myFrame.rprops.hidden = true;
        break;
      }
    }
  }
}