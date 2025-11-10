import Assets from "../../../engine/render/assets";
import {Composite} from "../../../engine/render/composite"
import GaniParser from "../../../engine/parsers/ganiParser";

// export namespace Anims {
export default class GaniYan {
  public idle: Array<Composite.Animation>;
  public sword: Array<Composite.Animation>;
  public walk: Array<Composite.Animation>;

  constructor(){
    this.idle = GaniParser.parse(Assets.getText("_assets/arbre/idle.gani")).animations;
    this.walk = GaniParser.parse(Assets.getText("_assets/arbre/walk.gani")).animations;
    this.sword = GaniParser.parse(Assets.getText("_assets/arbre/sword.gani")).animations;

    // console.log(this.idle)
  }
}