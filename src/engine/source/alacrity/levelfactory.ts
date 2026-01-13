import { Incarnations } from "./_incarnations";
import { Games } from "../_games"

export default abstract class LevelFactory extends Incarnations.Level{
  public async build(game: Games.Action):Promise<void>{}
}