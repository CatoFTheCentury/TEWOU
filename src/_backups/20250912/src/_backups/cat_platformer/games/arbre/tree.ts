import {Bodies} from '../../engine/alacrity/_bodies';
import Game from './game';
import Tiled from '../../engine/parsers/tiledParser';
import IniParser from '../../engine/parsers/iniparser';
import Assets from "../../engine/render/assets"
import { Composite } from '../../engine/render/composite';

import Physics from "../../engine/systems/physics"
import NPCCollision from "../../engine/physics/npcCollision"
import * as C from "../../engine/physics/states"


export default class Tree extends Bodies.Embodiment{
  private health = 4;
  constructor(game: Game){
    game.cellbuild.tiles = [IniParser.loadCSV(Assets.getText("_assets/levels/grawl01/tree.csv"))];

    let image = Tiled.blit(game.cellbuild, "Tree");
    super(new Composite.Frame(image));
    this.pos.x = 16 * 27;
    this.pos.y = 16*31;
    this.hitbox = {x:0,y:7*16,w:8*16,h:2*16}
    Physics.collisionpool.push(new NPCCollision(this,C.CollideLayers.npc, C.CollideLayers.player, C.CollideTypes.block));

    // Physics.collisionpool.push(new NPCCollision(this,C.CollideLayers.npc, C.CollideLayers.player, C.CollideTypes.block));
    
  }

  public override update(){
    super.update();
    this.handleTriggers();
  }

  private handleTriggers(){
    while(this.triggers.length > 0){
      let t : Bodies.Trigger = this.triggers.pop() || {name:"notrigger"};
      switch(t.name){
        case "attacked":
          this.health--;
          if(this.health <= 0) this.myFrame.rprops.hidden = true;
        break;
      }
    }
  }
}