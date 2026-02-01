import {Level, ActionGame} from "TEWOU";

export default abstract class LevelFactory extends Level{
  public async build(game: ActionGame,firstLevel:boolean):Promise<void>{}
}