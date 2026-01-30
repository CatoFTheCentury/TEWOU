import {Animation, ActionGame} from 'TEWOU'

export default class GaniYan {
  public idle: Array<Animation> = new Array(4);
  public sword: Array<Animation> = new Array(4);
  public walk: Array<Animation> = new Array(4);

  constructor(game : ActionGame){
    this.idle  = game.parseGani("_assets/arbre/idle.gani");
    this.walk  = game.parseGani("_assets/arbre/walk.gani");
    this.sword = game.parseGani("_assets/arbre/sword.gani");
  }
}