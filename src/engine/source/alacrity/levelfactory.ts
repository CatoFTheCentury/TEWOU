import { GameObjects } from "./_gameobjects";
import { Games } from "../_games"

export default abstract class LevelFactory extends GameObjects.Level{
  public async build(game: Games.Action):Promise<void>{}
}