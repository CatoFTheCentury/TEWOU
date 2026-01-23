// import {Composite} from "../../../engine/render/composite"
import {Animation, ActionGame} from 'TEWOU'

// import {Assets} from "../../../engine/source/render/assets";
// import {Composite} from "../../../engine/source/render/composite"
// import {GaniParser} from "../../../engine/source/parsers/ganiParser";

// export namespace Anims {
export default class GaniYan {
  public idle: Array<Animation> = new Array(4);
  public sword: Array<Animation> = new Array(4);
  public walk: Array<Animation> = new Array(4);

  constructor(game : ActionGame){
    this.idle  = game.parseGani("_assets/arbre/idle.gani");
    this.walk  = game.parseGani("_assets/arbre/walk.gani");
    this.sword = game.parseGani("_assets/arbre/sword.gani");
    // console.log(this.idle)
  }
}