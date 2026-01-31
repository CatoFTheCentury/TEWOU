/**
 * @fileoverview Public API for the game engine, providing access to core classes,
 * game objects, rendering utilities, and helper functions.
 *
 * This module serves as the main entry point for game development, exposing
 * essential classes and utilities while hiding internal implementation details.
 *
 * @module api
 */

import { Games } from "./_games";
import { GameObjects } from "./alacrity/_gameobjects";
import { Composite } from "./render/composite";
import { GaniParser } from "./parsers/ganiParser";
import { Assets } from "./render/assets"
import { IniParser } from "./parsers/iniparser";
import { Tiled } from "./parsers/tiledParser";

/**
 * The main game engine. Use this to initialize and run your game.
 * @see Engine
 */
export { Engine } from "./engine";

/**
 * Collision layer enumeration for physics system.
 * Defines which layers objects can collide with.
 */
export { CollideLayers } from './physics/states';

/**
 * Collision type enumeration for physics system.
 * Defines the type of collision detection to use.
 */
export { CollideTypes } from './physics/states';

/**
 * Properties for physics capture configuration.
 */
export { CaptureProperties } from './physics/capture'

/**
 * Abstract base class for game levels.
 *
 * Extend this class to create custom level implementations for your game.
 * Levels manage the game world, entities, and level-specific logic.
 *
 * @abstract
 * @extends GameObjects.Level
 *
 * @example
 * ```typescript
 * class MyLevel extends Level {
 *   constructor() {
 *     super();
 *     // Initialize level
 *   }
 * }
 * ```
 */
export abstract class Level extends GameObjects.Level{}

/**
 * Abstract base class for player characters.
 *
 * Extend this class to create the player character for your game.
 * Handles player-specific behavior, input, and state management.
 *
 * @abstract
 * @extends GameObjects.Player
 *
 * @example
 * ```typescript
 * class Hero extends Player {
 *   constructor() {
 *     super();
 *     // Initialize player properties
 *   }
 * }
 * ```
 */
export abstract class Player extends GameObjects.Player{}

/**
 * Abstract base class for non-player characters and creatures.
 *
 * Extend this class to create NPCs, enemies, and other fauna in your game.
 * Provides base functionality for AI-controlled entities.
 *
 * @abstract
 * @extends GameObjects.Fauna
 *
 * @example
 * ```typescript
 * class Enemy extends Fauna {
 *   constructor() {
 *     super();
 *     // Initialize enemy behavior
 *   }
 * }
 * ```
 */
export abstract class Fauna extends GameObjects.Fauna{}

/**
 * Abstract base class for action-oriented games.
 *
 * Extend this class to create action games with built-in support for
 * animation parsing, rendering, and game loop management.
 *
 * @abstract
 * @extends Games.Action
 *
 * @example
 * ```typescript
 * class MyActionGame extends ActionGame {
 *   constructor() {
 *     super();
 *     // Initialize game
 *   }
 * }
 * ```
 */
export abstract class ActionGame extends Games.Action{
  /**
   * Parses a GANI animation file and converts it to Animation objects.
   *
   * GANI files are custom animation format files that define sprite animations.
   * This method loads and parses the file, then builds Animation objects from the data.
   *
   * @param {string} file - Path to the GANI file to parse
   * @returns {Array<Animation>} Array of Animation objects created from the GANI file
   *
   * @example
   * ```typescript
   * const animations = this.parseGani('assets/player_walk.gani');
   * ```
   */
  public parseGani(file:string):Array<Animation>{
    return GaniParser.parse(Assets.getText(file)).animations.map((a)=>this.buildAni(a));
  }
}

/**
 * Represents a sprite animation composed of multiple frames.
 *
 * Use this class to create and manage sprite-based animations for game objects.
 *
 * @extends Composite.Animation
 *
 * @example
 * ```typescript
 * const walkAnimation = new Animation();
 * ```
 */
export class Animation extends Composite.Animation{}

/**
 * Represents a single frame in an animation sequence.
 *
 * Each frame contains sprite data and timing information for animation playback.
 *
 * @extends Composite.Frame
 *
 * @example
 * ```typescript
 * const frame = new Frame();
 * ```
 */
export class Frame extends Composite.Frame{}

/**
 * Represents a rectangular region, typically used for collision detection,
 * sprite rendering, or UI layout.
 *
 * @extends Composite.Rectangle
 *
 * @example
 * ```typescript
 * const hitbox = new Rectangle();
 * ```
 */
export class Rectangle extends Composite.Rectangle{}

/**
 * Utility class providing static helper methods for common game operations.
 *
 * This class provides convenient access to asset loading, sound playback,
 * and image processing utilities.
 */
export class API {

  /**
   * Plays a sound file.
   *
   * Loads and plays an audio file from the assets directory. The sound will
   * play asynchronously without blocking game execution.
   *
   * @static
   * @param {string} file - Path to the sound file to play
   *
   * @example
   * ```typescript
   * API.playSound('assets/sounds/jump.wav');
   * ```
   */
  public static playSound(file:string){
    Assets.playSound(file);
  }

  /**
   * Loads an image from a CSV file and converts it to a renderable sprite.
   *
   * Parses a CSV file containing tile data and creates a sprite image that
   * can be rendered in the game. Useful for loading procedurally generated
   * or tile-based images.
   *
   * @static
   * @param {ActionGame} game - The game instance to use for rendering context
   * @param {string} file - Path to the CSV file containing image data
   * @returns {Composite.Snap} A renderable sprite created from the CSV data
   *
   * @example
   * ```typescript
   * const sprite = API.imageFromCSV(this, 'assets/map.csv');
   * ```
   */
  public static imageFromCSV(game: ActionGame, file:string) : Composite.Snap{
    game.cellbuild.tiles = [IniParser.loadCSV(Assets.getText(file))]
    return Tiled.blit(game.glContext,game.shadercontext,game.cellbuild, "Tree")[0];

  }

  /**
   * Preloads a text file into the asset cache.
   *
   * Asynchronously loads a text file (such as JSON, CSV, or plain text) into
   * memory for faster access during gameplay. Should be called during game
   * initialization or loading screens.
   *
   * @static
   * @async
   * @param {string} file - Path to the text file to preload
   * @returns {Promise<void>} Promise that resolves when the file is loaded
   *
   * @example
   * ```typescript
   * await API.preloadText('assets/level1.json');
   * ```
   */
  public static async preloadText(file:string){
    await Assets.addText(file);
  }

}