import { Games } from "./_games";
import { GameObjects } from "./alacrity/_gameobjects";
import { Composite } from "./render/composite";
import { GaniParser } from "./parsers/ganiParser";
import { Assets } from "./render/assets"
import * as T from "./_type"
import { CollideLayers } from './physics/states';
import { CollideTypes } from './physics/states';
import { Bodies } from "./alacrity/_bodies";
import { IniParser } from "./parsers/iniparser";
import { Tiled } from "./parsers/tiledParser";
export { Engine } from "./engine";
// import Assets from './render/assets';

// export Engine
export { CollideLayers } from './physics/states';
export { CollideTypes } from './physics/states';

export abstract class Level extends GameObjects.Level{}
export abstract class Player extends GameObjects.Player{}
export abstract class Fauna extends GameObjects.Fauna{}

export abstract class ActionGame extends Games.Action{
  public parseGani(file:string):Array<Animation>{
    return GaniParser.parse(Assets.getText(file)).animations.map((a)=>this.buildAni(a));
  }
}

export class Animation extends Composite.Animation{}
export class Frame extends Composite.Frame{}

export type CaptureProperties = {
  cwith: CollideLayers,
  type: CollideTypes,
  hitbox: T.Bounds,
  call: (owner: Bodies.Embodiment, target: Bodies.Alacrity) => boolean
}

export class API {
  // public static createFrame(game:ActionGame,composite:Array<Composite.Composite>){
    
  // }
  public static playSound(file:string){
    Assets.playSound(file);
  }

  public static imageFromCSV(game: ActionGame, file:string) : Composite.Snap{
    game.cellbuild.tiles = [IniParser.loadCSV(Assets.getText(file))]
    return Tiled.blit(game.glContext,game.shadercontext,game.cellbuild, "Tree")[0];
     
  }

  public static async preloadText(file:string){
    await Assets.addText(file);
  }

}