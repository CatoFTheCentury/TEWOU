// import LevelMaster from '../../../build/src/games/demon/levelmaster';
import { Incarnations } from '../../engine/alacrity/_incarnations';
import {Games} from "../../engine/_games";
import IniParser from "../../engine/parsers/iniparser";
import TiledParser from '../../engine/parsers/tiledParser'
import CollisionGrid from "../../engine/physics/gridCollision"
import * as C from "../../engine/physics/states"
import Character from './character'
import { Strudeler, Zones } from "./strudeler"

export default class Level00 extends Incarnations.Level {
  protected ininame : string = "sfx00.ini";

  public async build(game:Games.Action){
    game.cellbuild =  await IniParser.loadIni(game.rootFolder+this.ininame);
    this.levelsize = {w: game.cellbuild.tiles[0].tileYX[0].length * game.cellbuild.square.w, h: game.cellbuild.tiles[0].tileYX.length * game.cellbuild.square.h};
    this.representation = TiledParser.blit(game.cellbuild, "level-layer");

    this.grids=[
      new CollisionGrid(game.cellbuild.collisions[Zones.fences],16,
        C.CollideLayers.player,C.CollideTypes.custom0),
      new CollisionGrid(game.cellbuild.collisions[Zones.flowers],16,
        C.CollideLayers.player,C.CollideTypes.custom1),
      new CollisionGrid(game.cellbuild.collisions[Zones.home],16,
        C.CollideLayers.player,C.CollideTypes.custom2),
      new CollisionGrid(game.cellbuild.collisions[Zones.market],16,
        C.CollideLayers.player,C.CollideTypes.custom3),
      new CollisionGrid(game.cellbuild.collisions[Zones.paved],16,
        C.CollideLayers.player,C.CollideTypes.custom4),
      new CollisionGrid(game.cellbuild.collisions[Zones.shadows],16,
        C.CollideLayers.player,C.CollideTypes.custom5),
      new CollisionGrid(game.cellbuild.collisions[Zones.smalltrees],16,
        C.CollideLayers.player,C.CollideTypes.custom6),
      new CollisionGrid(game.cellbuild.collisions[Zones.water],16,
        C.CollideLayers.player,C.CollideTypes.custom7)
    ];

    game.gamephysics.collisionpool.push(...this.grids);

    game.player = new Character();
    this.bodies.push(game.player);

    new Strudeler.Entries();
    // this.bodies.push(new Strudeler.Entries())
  }
}