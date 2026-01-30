import { Games } from "./_games";
import { GameObjects } from "./alacrity/_gameobjects";
import { Composite } from "./render/composite";
import { GaniParser } from "./parsers/ganiParser";
import { Assets } from "./render/assets"
import { IniParser } from "./parsers/iniparser";
import { Tiled } from "./parsers/tiledParser";
export { Engine } from "./engine";

export { CollideLayers } from './physics/states';
export { CollideTypes } from './physics/states';
export { CaptureProperties } from './physics/capture' 

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
export class Rectangle extends Composite.Rectangle{}


export class API {

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