import {Games} from "../../engine/_games";
import IniParser from "../../engine/parsers/iniparser";

import LevelMaster from "./levelmaster";
import TiledParser from '../../engine/parsers/tiledParser'
import CollisionGrid from "../../engine/physics/gridCollision"
import * as C from "../../engine/physics/states"

import Character from './character'

export default class Level00 extends LevelMaster{
  protected ininame : string = 'demon01a.ini';

  public async build(game:Games.Action){
    game.cellbuild =  await IniParser.loadIni(game.rootFolder+this.ininame);
    this.levelsize = {w: game.cellbuild.tiles[0].tileYX[0].length * game.cellbuild.square.w, h: game.cellbuild.tiles[0].tileYX.length * game.cellbuild.square.h};
    this.representation = TiledParser.blit(game.cellbuild, "level-layer");

    let collisiongrid = new CollisionGrid(game.cellbuild.collisions[0], 16, C.CollideLayers.player | C.CollideLayers.npc, C.CollideTypes.block);
    game.gamephysics.collisionpool.push(collisiongrid);

    let watergrid = new CollisionGrid(game.cellbuild.collisions[1], 16, C.CollideLayers.player | C.CollideLayers.npc, C.CollideTypes.water);
    game.gamephysics.collisionpool.push(watergrid);

    let climbablegrid = new CollisionGrid(game.cellbuild.collisions[2], 16, C.CollideLayers.player | C.CollideLayers.npc, C.CollideTypes.climbable);
    game.gamephysics.collisionpool.push(climbablegrid);

    this.putNPCs(game.cellbuild.npcs);

    game.player = new Character();
    this.bodies.push(game.player);
  }
}