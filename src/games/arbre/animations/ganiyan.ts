// import {Composite} from "../../../engine/render/composite"
import {Assets, Composite, GaniParser, Games} from 'TEWOU'

// import {Assets} from "../../../engine/source/render/assets";
// import {Composite} from "../../../engine/source/render/composite"
// import {GaniParser} from "../../../engine/source/parsers/ganiParser";

// export namespace Anims {
export default class GaniYan {
  public idle: Array<Composite.Animation> = new Array(4);
  public sword: Array<Composite.Animation> = new Array(4);
  public walk: Array<Composite.Animation> = new Array(4);

  constructor(game : Games.Generic){
    let idle = GaniParser.parse(Assets.getText("_assets/arbre/idle.gani")).animations;
    let walk = GaniParser.parse(Assets.getText("_assets/arbre/walk.gani")).animations;
    let sword= GaniParser.parse(Assets.getText("_assets/arbre/sword.gani")).animations;

    for(let i = 0; i < 4; i++){
      this.idle[i]  = game.buildAni( idle[i]);
      this.walk[i]  = game.buildAni( walk[i]);
      this.sword[i] = game.buildAni(sword[i]);
    }

    // console.log(this.idle)
  }
}