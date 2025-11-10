import {Bodies} from '../../engine/alacrity/_bodies';
import {Games} from '../../engine/_games';
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
  constructor(game: Games.Action){
    game.cellbuild.tiles = [IniParser.loadCSV(Assets.getText("_assets/arbre/00/tree.csv"))];

    let image = Tiled.blit(game.cellbuild, "Tree");
    super(new Composite.Frame(image));
    this.pos.x = 16 * 27;
    this.pos.y = 16*31;
    this.hitbox = {x:0,y:7*16,w:8*16,h:2*16};
    // this.myFrame.frame[0].rprops.angle =  1.57;
    game.gamephysics.collisionpool.push(new NPCCollision(this,C.CollideLayers.npc, C.CollideLayers.player, C.CollideTypes.block));

    // this.myFrame.rprops.flip.flipy = true;
    // this.myFrame.compose();
    this.myFrame.rprops.rotcenter = {x:this.myFrame.rprops.dstrect.w/2,y:this.myFrame.rprops.dstrect.h/2};
    this.myFrame.rprops.angle = -1;

    // console.log(this.myFrame.rprops.rotcenter)

    
  }

  public override update(){
    super.update();
    // this.myFrame.rprops.angle -= 0.01;
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