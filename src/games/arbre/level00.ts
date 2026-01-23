// import {T,C,Games,Incarnations,IniParser,Assets,CollisionGrid,Tiled,GameObjects} from "TEWOU";
import {ActionGame, API, CollideLayers, CollideTypes} from "TEWOU"

// import * as T from "../../engine/_type"
// import IniParser from '../../engine/parsers/iniparser';
// import {Games} from "../../engine/_games";
// import { Incarnations } from '../../engine/alacrity/_incarnations';
// import Assets from "../../engine/render/assets";
// import CollisionGrid from "../../engine/physics/gridCollision";
// import * as C from '../../engine/physics/states'
// import TiledParser from '../../engine/parsers/tiledParser'
import Tree from "./tree"
import Character from "./character";
import LevelFactory from "./levelfactory";
// import divUI from './divui';



export default class GameLevel extends LevelFactory{
  public ininame : string = "arbre00c.ini";
  // public levelsize  : T.Box;
  // public representation : Composite.Snap[];

  constructor(){
    super();
  }

  // can'T build from game here because incarnations would import game
  public async build(game: ActionGame, firstLevel:boolean = false):Promise<void>{
    // super.build();
    // console.log(Render.Info.gl)
    await this.buildCell(game.rootFolder+this.ininame,game.glContext,game.shadercontext)
    game.cellbuild = this.cellbuild;
    // this.cellbuild = await IniParser.loadIni(game.rootFolder+this.ininame);
    // this.cellbuild.texture = Assets.retrieveTex(this.cellbuild.tileset, game.glContext);
    // this.levelsize = {w: this.cellbuild.tiles[0].tileYX[0].length * this.cellbuild.square.w, h: this.cellbuild.tiles[0].tileYX.length * this.cellbuild.square.h};
    // this.representation = Tiled.blit(game.glContext, game.shadercontext, this.cellbuild, "level-layer")
    
    await API.preloadText("_assets/arbre/00/tree.csv");
    game.addGrid(this.cellbuild.collisions[0], 16, CollideLayers.player, CollideTypes.block);

    game.player = new Character(game);
    // new divUI(game.player)
    

    this.bodies.push(game.player);
    this.bodies.push(new Tree(game));
  }
}