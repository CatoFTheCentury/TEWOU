import * as T from "../../engine/_type"
import IniParser from '../../engine/parsers/iniparser';
import {Games} from "../../engine/_games";
import { Incarnations } from '../../engine/alacrity/_incarnations';
import Assets from "../../engine/render/assets";
import CollisionGrid from "../../engine/physics/gridCollision";
import * as C from '../../engine/physics/states'
import Character from "./character";
import Tree from "./tree"
import { Composite } from "../../engine/render/composite";
import TiledParser from '../../engine/parsers/tiledParser'
import divUI from './divui';
// import Render from "../../../build/src/render/_render";
import {Render} from '../../engine/render/_render';



export default class GameLevel extends Incarnations.Level{
  protected ininame : string = "arbre00c.ini";
  // public levelsize  : T.Box;
  // public representation : Composite.Snap[];

  constructor(){
    super();
  }

  public async build(game: Games.Action):Promise<void>{
    // console.log(Render.Info.gl)
    game.cellbuild = await IniParser.loadIni(game.rootFolder+this.ininame);
    this.levelsize = {w: game.cellbuild.tiles[0].tileYX[0].length * game.cellbuild.square.w, h: game.cellbuild.tiles[0].tileYX.length * game.cellbuild.square.h};
    
    await Assets.addText(game.rootFolder+game.gamename+"/00/tree.csv")
    game.gamephysics.collisionpool.push(new CollisionGrid(game.cellbuild.collisions[0], 16, C.CollideLayers.player, C.CollideTypes.block));

    game.player = new Character();
    new divUI(game.player)
    

    this.bodies.push(game.player);
    this.representation = TiledParser.blit(game.cellbuild, "level-layer")
    this.bodies.push(new Tree(game));
    // return new GameLevel(this);
  }
}