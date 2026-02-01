import {ActionGame, API, CollideLayers, CollideTypes} from "TEWOU"
import Tree from "./tree"
import Character from "./character";
import LevelFactory from "./levelfactory";



export default class GameLevel extends LevelFactory{
  public ininame : string = "arbre00c.ini";

  constructor(){
    super();
  }

  // can'T build from game here because incarnations would import game
  public async build(game: ActionGame, firstLevel:boolean = false):Promise<void>{
    await this.buildCell(game.rootFolder+this.ininame,game.glContext,game.shadercontext)
    game.cellbuild = this.cellbuild;

    await API.preloadText("_assets/arbre/00/tree.csv");
    game.addGrid(this.cellbuild.collisions[0], 16, CollideLayers.player, CollideTypes.block);

    game.player = new Character(game);
    new Tree(game);
  }
}