import { Incarnations } from "./alacrity/_incarnations";

export default abstract class Games {
  public abstract player : Incarnations.Player;
  public abstract run() : void;
  public async start(): Promise<Games> {return}
  public static pool : Array<Games> = [];

  constructor(){
    Games.pool.push(this);
  }
}