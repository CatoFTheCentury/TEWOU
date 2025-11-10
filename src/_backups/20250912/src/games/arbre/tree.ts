import {Bodies} from '../../engine/alacrity/_bodies';
import Games from '../../engine/games';
import Tiled from '../../engine/parsers/tiledParser';
import IniParser from '../../engine/parsers/iniparser';
import Assets from "../../engine/render/assets"
import { Composite } from '../../engine/render/composite';
import { Time } from '../../engine/alacrity/time';

import Physics from "../../engine/systems/physics"
import NPCCollision from "../../engine/physics/npcCollision"
import * as C from "../../engine/physics/states"


export default class Tree extends Bodies.Embodiment{
  private health = 4;
  constructor(game: Games){
    game.cellbuild.tiles = [IniParser.loadCSV(Assets.getText("_assets/arbre/00/tree.csv"))];

    let image = Tiled.blit(game.cellbuild, "Tree");
    super(new Composite.Frame(image));
    this.pos.x = 16 * 27;
    this.pos.y = 16*31;
    this.hitbox = {x:0,y:7*16,w:8*16,h:2*16};
    // this.myFrame.frame[0].rprops.angle =  1.57;
    game.currentLevel.physics.collisionpool.push(new NPCCollision(this,C.CollideLayers.npc, C.CollideLayers.player, C.CollideTypes.block));

    // this.myFrame.compose();
    // this.myFrame.frame[0].rprops.flip.flipy = true;
    // this.myFrame.frame[0].rprops.rotcenter = {x:this.myFrame.rprops.dstrect.w/2,y:this.myFrame.rprops.dstrect.h/2};

    
  }

  public override update(){
    super.update();
    // this.myFrame.frame[0].rprops.angle -= 0.03;
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