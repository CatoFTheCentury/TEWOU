import {Games,Incarnations,GameObjects} from "TEWOU";

export default abstract class LevelFactory extends GameObjects.Level{
  public async build(game: Games.Action,firstLevel:boolean):Promise<void>{}
}