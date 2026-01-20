// import {Games} from "../../engine/_games";
// import IniParser from "../../engine/parsers/iniparser";

// import TiledParser from '../../engine/parsers/tiledParser'
// import CollisionGrid from "../../engine/physics/gridCollision"
// import * as C from "../../engine/physics/states"

import { Games, IniParser, Tiled, CollisionGrid, C, Assets} from "TEWOU"

import LevelFactory from "./levelfactory";
import Character from './character'

export default class Level00 extends LevelFactory{
  public ininame : string = 'demon01a.ini';

  public async build(game:Games.Action){
    this.cellbuild =  await IniParser.loadIni(game.rootFolder+this.ininame);
    this.cellbuild.texture = Assets.retrieveTex(this.cellbuild.tileset, game.glContext);
    this.levelsize = {w: this.cellbuild.tiles[0].tileYX[0].length * this.cellbuild.square.w, h: this.cellbuild.tiles[0].tileYX.length * this.cellbuild.square.h};
    
    let collisiongrid = new CollisionGrid(this.cellbuild.collisions[0], 16, C.CollideLayers.player | C.CollideLayers.npc, C.CollideTypes.block);
    game.gamephysics.collisionpool.push(collisiongrid);
    
    let watergrid = new CollisionGrid(this.cellbuild.collisions[1], 16, C.CollideLayers.player | C.CollideLayers.npc, C.CollideTypes.water);
    game.gamephysics.collisionpool.push(watergrid);
    
    let climbablegrid = new CollisionGrid(this.cellbuild.collisions[2], 16, C.CollideLayers.player | C.CollideLayers.npc, C.CollideTypes.climbable);
    game.gamephysics.collisionpool.push(climbablegrid);
    
    this.representation = Tiled.blit(game.glContext, game.shadercontext, this.cellbuild, "level-layer");
    this.putNPCs(game, this.cellbuild.npcs);
    
    game.player = new Character(game);
    this.bodies.push(game.player);
  }
}