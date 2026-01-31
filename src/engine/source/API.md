# Game Engine API Documentation

Public interface for the game engine providing core classes, game objects, rendering utilities, and helper functions.

---

## Game Object Classes

### Level

Abstract base class for game levels. Manages the game world, entities, and level-specific logic.

**Extends:** `GameObjects.Level`

#### Properties

- `bodies: Bodies.Embodiment[]` - Array of all entities in the level
- `ininame: string` - Name of the INI file for the level (abstract, must be defined)
- `representation: Composite.Snap[]` - Visual representation of the level
- `levelsize: T.Box` - Dimensions of the level
- `grids: Array<CollisionGrid>` - Collision grids for the level
- `cellbuild: T.CellBuild` - Tile data and configuration

#### Methods

**load(): Promise&lt;void&gt;**

Loads the level from an INI file. Automatically loads from `_assets/{ininame}`.

```typescript
await level.load();
```

**buildCell(file: string, glContext: Render.GLContext, shadercontext: ShaderLoader): Promise&lt;void&gt;**

Builds level from a specific file path with rendering context.

**Parameters:**
- `file`: Full path to INI file
- `glContext`: OpenGL context
- `shadercontext`: Shader loader

```typescript
await this.buildCell(game.rootFolder + this.ininame, game.glContext, game.shadercontext);
```

#### Usage Example

```typescript
export default class GameLevel extends LevelFactory {
  public ininame: string = "arbre00c.ini";

  public async build(game: ActionGame): Promise<void> {
    await this.buildCell(game.rootFolder + this.ininame, game.glContext, game.shadercontext);
    await API.preloadText("_assets/arbre/00/tree.csv");
    game.addGrid(this.cellbuild.collisions[0], 16, CollideLayers.player, CollideTypes.block);
    game.player = new Character(game);
  }
}
```

---

### Player

Abstract base class for player characters. Handles player-specific behavior, input, and state management.

**Extends:** `GameObjects.Player`

```typescript
export default class Character extends Player {
  constructor(game: ActionGame) {
    let animations = new GaniYan(game);
    super(new Frame(game.glContext, game.shadercontext, [animations.idle[2]]));

    this.hitbox = {x:0, y:14, w:48, h:34};
    game.addAsCollision(this, CollideLayers.player, CollideLayers.grid | CollideLayers.npc, CollideTypes.block);
    game.registerEntity(this, game.gameframe);
  }
}
```

---

### Fauna

Abstract base class for NPCs, enemies, and creatures. Provides functionality for AI-controlled entities.

**Extends:** `GameObjects.Fauna`

```typescript
export default class Tree extends Fauna {
  constructor(game: ActionGame) {
    let image = API.imageFromCSV(game, "_assets/arbre/00/tree.csv");
    super(new Frame(game.glContext, game.shadercontext, [image], {w:128, h:96}));

    this.pos = {x: 432, y: 496};
    this.hitbox = {x:0, y:112, w:128, h:32};
    game.addAsCollision(this, CollideLayers.npc, CollideLayers.player, CollideTypes.block);
    game.registerEntity(this);
  }
}
```

---

### ActionGame

Abstract base class for action-oriented games with animation parsing, rendering, and game loop management.

**Extends:** `Games.Action` → `Physical` → `Generic`

#### Properties

**Game Configuration:**
- `gameid: number` - Unique identifier for this game instance
- `gamename: string` - Name of the game (abstract, must be defined)
- `rootFolder: string` - Root folder for assets (default: `"_assets/"`)
- `paused: boolean` - Whether the game is paused

**Level & Entities:**
- `player: GameObjects.Player` - Reference to the player character
- `levels: GameObjects.Level[]` - Array of game levels (abstract, protected)
- `currentLevel: GameObjects.Level | undefined` - Currently active level
- `alacritypool: Array<Bodies.Alacrity>` - All active entities

**Rendering:**
- `glContext: Render.GLContext` - OpenGL rendering context
- `shadercontext: ShaderLoader` - Shader management
- `gameframe: Composite.Frame` - Main game frame containing all visuals
- `window: Window` - Window manager
- `srcview: T.Box` - Source viewport dimensions (abstract, protected)

**Physics:**
- `gamephysics: Physics` - Physics system
- `cellbuild: T.CellBuild` - Current cell/tile build data

**Systems:**
- `systempool: Array<System>` - All active game systems
- `fileextensions: string[]` - File extensions to load (default: `["png","gani","wav","csv"]`)

#### Methods

**Game Lifecycle:**

**constructor(target: HTMLCanvasElement, width: number, height: number, shaders?: Array&lt;ShaderTemplate&gt;)**

Creates a new game instance.

**Parameters:**
- `target`: Canvas element to render to
- `width`: Canvas width
- `height`: Canvas height
- `shaders`: Optional custom shaders (defaults to Normal, Reverser, WhiteTransparent)

```typescript
constructor(target: HTMLCanvasElement) {
  super(target, 300, 300);
}
```

**load(): Promise&lt;void&gt;**

Loads game assets and initializes the game.

```typescript
public async load(): Promise<void> {
  await super.load();
  this.currentLevel = await this.newTiledLevel(0);
}
```

**start(): void** (abstract)

Game start logic. Must be implemented by subclass.

**run(sharedobjects: Array&lt;T.SharedBlueprint&gt;): void**

Main game loop. Updates all systems and entities.

```typescript
super.run(sharedobjects);
```

**Level Management:**

**newTiledLevel(leveln: number): Promise&lt;GameObjects.Level&gt;**

Creates and loads a new level by index.

**Parameters:**
- `leveln`: Index of the level to load

**Returns:** The loaded level

```typescript
this.currentLevel = await this.newTiledLevel(0);
```

**displayLevel(level: GameObjects.Level): void**

Displays a level on screen.

```typescript
this.displayLevel(this.currentLevel);
```

**Entity Management:**

**registerEntity(entity: Bodies.Embodiment, frame?: Composite.Frame): void**

Registers an entity to be updated and rendered.

**Parameters:**
- `entity`: Entity to register
- `frame`: Frame to add entity to (defaults to `window.frm`)

```typescript
game.registerEntity(this, game.gameframe);
```

**Physics:**

**addAsCollision(incarnation: Bodies.Embodiment, from: CollideLayers, cwith: CollideLayers, type: CollideTypes): void**

Adds collision detection for an entity.

**Parameters:**
- `incarnation`: Entity to add collision for
- `from`: Layer this entity is on
- `cwith`: Layers this entity collides with
- `type`: Type of collision

```typescript
game.addAsCollision(this, CollideLayers.player, CollideLayers.grid | CollideLayers.npc, CollideTypes.block);
```

**addGrid(boolArr: Array&lt;Array&lt;boolean&gt;&gt;, resolution: number, cwith: CollideLayers, type: CollideTypes): void**

Adds a collision grid (for tile-based collision).

**Parameters:**
- `boolArr`: 2D array of collision data
- `resolution`: Size of each tile
- `cwith`: Layers that collide with this grid
- `type`: Type of collision

```typescript
game.addGrid(this.cellbuild.collisions[0], 16, CollideLayers.player, CollideTypes.block);
```

**addCapture(captureProperties: CaptureProperties): void**

Adds a capture zone (for attacks, interactions, etc.).

```typescript
game.addCapture(props);
```

**Animation & Rendering:**

**parseGani(file: string): Array&lt;Animation&gt;**

Parses GANI animation files and converts them to Animation objects.

**Parameters:**
- `file`: Path to the GANI animation file

**Returns:** Array of Animation objects

```typescript
this.idle = game.parseGani("_assets/arbre/idle.gani");
```

**buildAni(anibuild: T.AniBuild): Composite.Animation**

Builds an animation from animation data.

**buildSnap(snapbuild: Array&lt;T.SnapBuild&gt;): Composite.Snap**

Builds a snap/sprite from snap data.

**newFrame(contents: Array&lt;Composite.Renderable&gt;): Composite.Frame**

Creates a new frame.

**newRectangle(bounds: T.Bounds, color: T.Color): Composite.Rectangle**

Creates a new rectangle.

**newSnap(contents: Array&lt;Composite.Renderable&gt;): Composite.Snap**

Creates a new snap.

**newText(text: string, properties?: T.TextProperties): Composite.Text**

Creates new text.

#### Usage Example

```typescript
export class Game extends ActionGame {
  protected levels: LevelFactory[] = [new Level00()];
  public gamename: string = "arbre";
  protected srcview = {w: 300, h: 300};

  constructor(target: HTMLCanvasElement) {
    super(target, 300, 300);
  }

  public async load(): Promise<void> {
    super.load();
    this.currentLevel = await this.newTiledLevel(0);
    await this.currentLevel.build(this, true);
    this.displayLevel(this.currentLevel);
    this.gameframe.camera.cameraman.actor = this.player;
    this.window.frm.frame.push(this.gameframe);
  }

  public start() {}

  public run(sharedobjects) {
    super.run(sharedobjects);
    this.gameframe.camera.refresh();
  }
}
```

---

## Rendering Classes

### Animation

Sprite animation composed of multiple frames.

**Extends:** `Composite.Animation`

```typescript
// Loaded via parseGani
this.animations = game.parseGani("_assets/character.gani");
```

---

### Frame

Single frame in an animation sequence with sprite data and timing information.

**Extends:** `Composite.Frame`

```typescript
// With animations
super(new Frame(game.glContext, game.shadercontext, [animations.idle[2]]));

// With static image
super(new Frame(game.glContext, game.shadercontext, [image], {w:128, h:96}));
```

---

### Rectangle

Rectangular region for collision detection, sprite rendering, or UI layout.

**Extends:** `Composite.Rectangle`

---

## Utility API

### API.playSound(file: string): void

Plays an audio file asynchronously without blocking game execution.

```typescript
API.playSound('_assets/arbre/swoosh_1.wav');
```

---

### API.imageFromCSV(game: ActionGame, file: string): Composite.Snap

Loads a CSV file containing tile data and creates a renderable sprite.

**Parameters:**
- `game`: Game instance for rendering context
- `file`: Path to CSV file

**Returns:** Renderable sprite

```typescript
let image = API.imageFromCSV(game, "_assets/arbre/00/tree.csv");
super(new Frame(game.glContext, game.shadercontext, [image], {w:128, h:96}));
```

---

### API.preloadText(file: string): Promise&lt;void&gt;

Preloads text files (JSON, CSV, plain text) into memory for faster access during gameplay. Call during initialization or loading screens.

```typescript
await API.preloadText("_assets/arbre/00/tree.csv");
```

---

## Physics Enums

### CollideLayers

Defines which layers objects can collide with.

```typescript
// Player setup
game.addAsCollision(this, CollideLayers.player, CollideLayers.grid | CollideLayers.npc, CollideTypes.block);

// NPC setup
game.addAsCollision(this, CollideLayers.npc, CollideLayers.player, CollideTypes.block);
```

---

### CollideTypes

Defines the type of collision detection to use.

```typescript
game.addAsCollision(entity, CollideLayers.player, CollideLayers.grid, CollideTypes.block);
```

---

### CaptureProperties

Properties for physics capture configuration used for attack hitboxes and interaction zones.

```typescript
let props: CaptureProperties = {
  cwith: CollideLayers.npc,
  owner: this,
  type: CollideTypes.hurt,
  hitbox: {x:32, y:0, w:32, h:32},
  call: (owner, target) => {
    target.triggers.push({name:"attacked"})
    return true;
  }
}

this.game.addCapture(props);
```

---

## Exports

```typescript
// Core
export { Engine } from "./engine";

// Physics
export { CollideLayers } from './physics/states';
export { CollideTypes } from './physics/states';
export { CaptureProperties } from './physics/capture'

// Game Objects
export abstract class Level extends GameObjects.Level{}
export abstract class Player extends GameObjects.Player{}
export abstract class Fauna extends GameObjects.Fauna{}
export abstract class ActionGame extends Games.Action{}

// Rendering
export class Animation extends Composite.Animation{}
export class Frame extends Composite.Frame{}
export class Rectangle extends Composite.Rectangle{}

// Utilities
export class API {}
```

---

**Last Updated:** 2026-01-31
