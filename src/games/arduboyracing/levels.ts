import Level00 from "./level00";
import { Incarnations } from "../../engine/alacrity/_incarnations";

export default class LevelFactory {
  public static levels   : Incarnations.Level[] = [new Level00()];
}