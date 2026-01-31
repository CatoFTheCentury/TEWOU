# TEWOU Game Engine API Reference

Complete reference for the TEWOU game engine public API.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Engine](#engine)
3. [Game Classes](#game-classes)
4. [Entity Classes](#entity-classes)
5. [Level System](#level-system)
6. [Rendering System](#rendering-system)
7. [Physics & Collision](#physics--collision)
8. [Utility API](#utility-api)
9. [Type Definitions](#type-definitions)
10. [Enumerations](#enumerations)

---

## Quick Start

### Minimal Game Setup

```javascript
// Define your game
class Game extends window.TEWOU.ActionGame {
  constructor(canvas) {
    super(canvas, 200, 600);
  }
}

// Create and start
game = new Game(document.getElementById('canvas'));
await window.TEWOU.Engine.start(game);

// Add entities
let player = new Player();
game.registerEntity(player);

// Start game loop
window.TEWOU.Engine.games.push(game);
window.TEWOU.Engine.mainLoop();
```

---

## Engine

Main engine class for bootstrapping and running games.

### Static Methods

#### `Engine.start(game: ActionGame): Promise<void>`

Initializes and starts a game instance. Must be called before the game loop.

**Parameters:**
- `game: ActionGame` - Game instance to start

**Returns:** `Promise<void>` - Resolves when initialization is complete

**Usage:**
```typescript
let game = new ActionGame(HTMLCanvasElement);
await Engine.start(game);
```

#### `Engine.mainLoop(): void`

Starts the main game loop. Call after all setup is complete.

**Usage:**
```typescript
Engine.games.push(game);
Engine.mainLoop();
```

### Static Fields

- `Engine.games: Array<Generic>` - Array of all active game instances

### Complete Bootstrap Example

```javascript
// 1. Create game instance
game = new Game(document.getElementById('canvas'));

// 2. Initialize engine
await Engine.start(game);

// 3. Setup entities
let player = new Player();
game.registerEntity(player);
game.registerEntity(new Mothership());

// 4. Start game loop
Engine.games.push(game);
Engine.mainLoop();
```

---

## Game Classes

### ActionGame

Your game class should extend this. Provides animation parsing, rendering, and game loop management.

**Extends:** `Games.Action` → `Physical` → `Generic`

#### Constructor

```typescript
constructor(target: HTMLCanvasElement, canvaswidth: number, canvasheight: number)
```

**Parameters:**
- `target: HTMLCanvasElement` - Canvas element to render to
- `canvaswidth: number` - Canvas width in pixels
- `canvasheight: number` - Canvas height in pixels

**Example:**
```typescript
class Game extends ActionGame {
  constructor(target: HTMLCanvasElement) {
    super(target, 300, 300);
  }
}
```

#### Fields

**Game Configuration:**
- `gameid: number` - Unique identifier for this game instance (auto-assigned)
- `gamename: string` - Name of the game (abstract, must be defined for asset loading)
- `rootFolder: string` - Root folder for assets (default: `"_assets/"`)
- `paused: boolean` - Whether the game is paused

**Level & Entities:**
- `player: GameObjects.Player` - Reference to the player character
- `levels: GameObjects.Level[]` - Populate with an array of Level instances. Level data is preserved.
- `currentLevel: GameObjects.Level | undefined` - Currently active level
- `alacritypool: Array<Bodies.Alacrity>` - All active entities (managed automatically)

**Rendering:**
- `glContext: Render.GLContext` - OpenGL rendering context
- `shadercontext: ShaderLoader` - Shader management
- `gameframe: Composite.Frame` - The level representation with everything in it. Created by `displayLevel()`. As a Frame, its `rprops` can be modified.
- `window: Window` - Window manager
  - `window.frm: Composite.Frame` - Window's Frame. Uses a special shader to display everything upright, so changing its shader is not advised unless you want everything upside down.
- `srcview: T.Box` - Source viewport dimensions (abstract, protected)

**Physics:**
- `gamephysics: Physics` - Physics system
- `cellbuild: T.CellBuild` - Current cell/tile build data

**Systems:**
- `systempool: Array<System>` - All active game systems
- `fileextensions: string[]` - File extensions to load (default: `["png","gani","wav","csv"]`)

#### Methods

##### Animation & Parsing

**`parseGani(file: string): Array<Animation>`**

Loads a GANI file and returns an array of `Animation` objects representing each direction of the animation.

**Parameters:**
- `file: string` - Path to GANI file

**Returns:** `Array<Animation>` - One animation per direction (typically 4)

**Example:**
```typescript
this.idle = game.parseGani("_assets/arbre/idle.gani");
this.walk = game.parseGani("_assets/arbre/walk.gani");
```

**`buildAni(anibuild: T.AniBuild): Composite.Animation`**

Builds an Animation from animation data. Used internally by `parseGani()`.

**`buildSnap(snapbuild: Array<T.SnapBuild>): Composite.Snap`**

Builds a Snap/sprite from snap data. Used internally by `parseGani()`.

##### Level Management

**`newTiledLevel(leveln: number): Promise<GameObjects.Level>`** (async)

Returns a `Level` object from the `levels` field.

**Parameters:**
- `leveln: number` - The index of the level object in the `levels` field

**Returns:** `Promise<Level>` - The loaded level

**Example:**
```typescript
game.currentLevel = await game.newTiledLevel(0);
```

**`displayLevel(level: Level): void`** (protected)

Creates the `Frame` (`game.gameframe`) object on which your level and its objects are displayed. Creates a Camera at `game.gameframe.camera` for which you have to set the actor.

**Parameters:**
- `level: Level` - A level object on which `newTiledLevel` has been run

**Example:**
```typescript
this.displayLevel(this.currentLevel);
this.gameframe.camera.cameraman.actor = this.player;
```

##### Entity Management

**`registerEntity(entity: Bodies.Embodiment, frame?: Composite.Frame): void`**

Register `Entity` to the game; displaying and updating it.

**Parameters:**
- `entity: Bodies.Embodiment` - Entity to register
- `frame?: Composite.Frame` - Frame to add to (defaults to `window.frm`)

**Example:**
```typescript
game.registerEntity(this);
game.registerEntity(player, game.gameframe);
```

##### Physics

**`addAsCollision(incarnation: Bodies.Embodiment, from: CollideLayers, cwith: CollideLayers, type: CollideTypes): void`**

Adds `Entity` to the physics layer. The Entity's hitbox must be initialized.

**Parameters:**
- `incarnation: Bodies.Embodiment` - Entity to add collision for
- `from: CollideLayers` - Layer this entity is on
- `cwith: CollideLayers` - Layers this entity collides with (can use `|` to combine)
- `type: CollideTypes` - Type of collision

**Example:**
```typescript
game.addAsCollision(this,
  CollideLayers.player,
  CollideLayers.grid | CollideLayers.npc,
  CollideTypes.block
);
```

**`addGrid(boolArr: Array<Array<boolean>>, resolution: number, cwith: CollideLayers, type: CollideTypes): void`**

Adds a collision grid for tile-based collision.

**Parameters:**
- `boolArr: Array<Array<boolean>>` - 2D array of collision data (true = solid)
- `resolution: number` - Size of each tile in pixels
- `cwith: CollideLayers` - Layers that collide with this grid
- `type: CollideTypes` - Type of collision

**Example:**
```typescript
game.addGrid(this.cellbuild.collisions[0], 16, CollideLayers.player, CollideTypes.block);
```

**`addCapture(captureProperties: CaptureProperties): void`**

Add a `Capture` collision object. Will do a callback on collision.

**Parameters:**
- `captureProperties: CaptureProperties` - Capture configuration

**Example:**
```typescript
game.addCapture({
  cwith: CollideLayers.npc,
  type: CollideTypes.none,
  hitbox: {x:0, y:0, w:4, h:10},
  owner: this,
  call: (owner, target) => {
    target.react(owner, "hurt", []);
  }
});
```

##### Rendering Helpers

**`newFrame(contents: Array<Composite.Renderable>): Composite.Frame`**

Creates a new Frame containing multiple renderables.

**Parameters:**
- `contents: Array<Composite.Renderable>` - Array of renderables

**Returns:** `Composite.Frame`

**Example:**
```typescript
super(game.newFrame([laser, shiner, shiner2]));
```

**`newRectangle(bounds: T.Bounds, color: T.Color): Composite.Rectangle`**

Creates a rectangle `Composite` with one solid color. You can add it to `Snap` or `Frame` or use it as you initialize an `Entity`.

**Parameters:**
- `bounds: T.Bounds` - `{x, y, w, h}` - Rectangle bounds
- `color: T.Color` - `{r, g, b, a}` - Color (0-255 per channel)

**Returns:** `Composite.Rectangle`

**Example:**
```typescript
game.newRectangle({x:0, y:0, w:32, h:32}, {r:255, g:255, b:255, a:255})

// Invisible rectangle (for invisible entities)
game.newRectangle({x:0, y:0, w:1, h:1}, {r:0, g:0, b:0, a:0})
```

**`newSnap(contents: Array<Composite.Renderable>): Composite.Snap`**

Creates a Snap (sprite/composite) containing multiple renderables.

**Parameters:**
- `contents: Array<Composite.Renderable>` - Array of renderables

**Returns:** `Composite.Snap` with `rprops` for transformations

**Example:**
```typescript
let laser = game.newRectangle({x:0, y:0, w:4, h:20}, {r:100, g:100, b:255, a:255});
let snap = game.newSnap([laser]);

snap.rprops.rotcenter = {x:1, y:10};
snap.rprops.angle = -0.7;
snap.rprops.scale = {x:1, y:1};
```

**`newText(text: string, properties?: T.TextProperties): Composite.Text`**

Creates renderable text.

**Parameters:**
- `text: string` - Text string to display
- `properties?: T.TextProperties` - Optional properties (e.g., `{font: "syne mono"}`)

**Returns:** `Composite.Text` with `setText()` method and `size` property

**Example:**
```typescript
let text = game.newText("0", {font: "syne mono"});
text.setText("100");

// Center text
this.pos.x = 150 - text.size.w / 2;
```

##### Lifecycle Methods

**`load(): Promise<void>`** (async)

Overload this function in your custom Game class. `super()` call required.

**Example:**
```typescript
public async load(): Promise<void> {
  await super.load();
  this.currentLevel = await this.newTiledLevel(0);
  await this.currentLevel.build(this, true);
  this.displayLevel(this.currentLevel);
}
```

**`start(): void`** (abstract)

Game start logic. Must be implemented by subclass.

**`run(sharedobjects: Array<T.SharedBlueprint>): void`**

Overload this function in your custom Game class. `super([])` call required. Main game loop update.

**Example:**
```typescript
public run(sharedobjects) {
  super.run(sharedobjects);
  this.gameframe.camera.refresh();
}
```

---

## Entity Classes

Each `Entity` is also an `Alacrity`. Entities are game objects that update and render every frame.

### Common to all Entities

#### Constructor

```typescript
constructor(composite: Composite)
```

The composite entered in super will be the image displayed. You can change the image by modifying `myFrame.frame`, which is an `Array<Composite>`.

#### Fields

- `myFrame: Composite.Frame` - The entity's Frame composite
- `movementvector: Point` - `{x:number, y:number}` - Modifying this variable will tell the Entity to move that direction for that frame. Will take blocking terrain into account.
  - Example: `this.movementvector.x = -1` makes the entity go left for the current frame at normal speed
- `pos: Point` - `{x:number, y:number}` - Entity position
- `hitbox: Bounds` - `{x, y, w, h}` - Collision hitbox (must be initialized before adding collision)
- `triggers: Array<T.Trigger>` - Triggers can be injected in this field to act upon it

#### Methods

**`update(): void`**

Update method called every frame. Override to add custom logic. Always call `super.update()` first.

**`destroy(): void`**

Destroy the Alacrity, removes from screen and update loop.

**Example:**
```typescript
if (this.pos.y > 600) this.destroy();
```

**`react(owner: any, name: string, params: Array<any>): boolean`**

Meant to be overloaded in an `Entity` so it can answer to `Capture` callbacks. The return value is whether the `Capture` calling the reaction should be deleted. It's like a more powerful version of `triggers`.

**Parameters:**
- `owner: any` - Entity that triggered the event
- `name: string` - Event name
- `params: Array<any>` - Event parameters

**Returns:** `boolean` - Whether the Capture should be deleted

**Use example:**
```typescript
call: (owner, target) => {
  target.react(owner, "collect", ["bananas", 5])
}
```

**Overload example:**
```typescript
react(owner, name, params) {
  switch(name) {
    case "collect":
      switch(params[0]) {
        case "bananas":
          this.bananas += params[1];
          owner.destroy();
          return true;
        default:
          this.coins += 1;
          owner.destroy();
          return true;
      }
    case "hurt":
      this.hp -= params[0];
      if (this.hp <= 0) this.destroy();
      break;
  }
  return false;
}
```

**`addTimeout(durations: Array<number>, actions: TimerActions, repeat?: boolean, continuous?: boolean): Timeout`**

Add timed events that trigger after specified delays.

**Parameters:**
- `durations: Array<number>` - Array of delay times in milliseconds
- `actions: TimerActions` - Object with `triggered` and/or `active` callbacks
- `repeat?: boolean` - Whether to repeat (default: true)
- `continuous?: boolean` - Whether to continue (default: true)

**Returns:** `Timeout` object

**Example:**
```typescript
this.addTimeout([500, 300, 600], {
  triggered: (timeout) => {
    game.registerEntity(new Enemy(Math.random() * 180));
  }
});
```

### Player

A special gameobject class to which you can bind key actions. Handles player-specific behavior, input, and state management.

**Extends:** `GameObjects.Player` → `Incarnations.Incarnated`

#### Additional Fields

- `hp: Health` - `{max: number, current: number}` - Player health (default: `{max:3, current:3}`)
- `myCamera: Camera` - Camera reference

#### Additional Methods

**`registerkey(key: string, actions: T.KeyboardAction): void`**

Registers a key and its actions.

**Parameters:**
- `key: string` - The key (`' '` for space, `'ArrowUp'` for up arrow, `'s'` for S, etc.)
- `actions: T.KeyboardAction` - Object with optional callbacks:
  - `keydown?: () => void` - Called once when key is first pressed
  - `keyup?: () => void` - Called once when key is released
  - `keypressed?: () => void` - Called every frame while key is down
  - `keyheld?: () => void` - Called every frame after initial press

**Example:**
```typescript
this.registerkey('ArrowUp', {
  keyup: () => {
    this.myFrame.frame = [this.character.idle[this.dir]];
  },
  keypressed: () => {
    this.dir = 0;
    this.myFrame.frame = [this.character.walk[this.dir]];
    this.movementvector.y = -1;
  }
});

this.registerkey(' ', {
  keydown: () => {
    new Bullet(this.pos.x + 8, this.pos.y - 20);
  }
});
```

#### Complete Player Example

```typescript
class Player extends window.TEWOU.Player {
  constructor() {
    super(game.newRectangle(
      {x:0, y:0, w:20, h:10},
      {r:128, g:200, b:128, a:255}
    ));

    this.pos.x = 90;
    this.pos.y = 580;

    this.registerkey('a', {
      keypressed: () => { this.movementvector.x = -1; }
    });

    this.registerkey('d', {
      keypressed: () => { this.movementvector.x = 1; }
    });

    this.registerkey(' ', {
      keydown: () => {
        new Bullet(this.pos.x + 8, this.pos.y - 20);
      }
    });
  }
}
```

### Fauna

A gameobject class for NPCs, enemies, and creatures. Provides functionality for AI-controlled entities.

**Extends:** `GameObjects.Fauna` → `Incarnations.Fauna`

#### Additional Methods

**`switchaction(action: string): void`**

Fauna objects have a special characteristic called "actions" which you can use to put life into them.

#### Usage Examples

**Static entity with triggers:**
```typescript
class Tree extends Fauna {
  private health = 4;

  constructor(game: ActionGame) {
    let image = API.imageFromCSV(game, "_assets/arbre/00/tree.csv");
    super(new Frame(game.glContext, game.shadercontext, [image], {w:128, h:96}));

    this.pos = {x: 432, y: 496};
    this.hitbox = {x:0, y:112, w:128, h:32};
    game.addAsCollision(this, CollideLayers.npc, CollideLayers.player, CollideTypes.block);
    game.registerEntity(this);
  }

  public override update() {
    super.update();
    this.handleTriggers();
  }

  private handleTriggers() {
    while(this.triggers.length > 0) {
      let t = this.triggers.pop() || {name:"notrigger"};
      switch(t.name) {
        case "attacked":
          this.health--;
          if(this.health <= 0) this.myFrame.rprops.hidden = true;
          break;
      }
    }
  }
}
```

**Moving enemy with react:**
```typescript
class Enemy extends Fauna {
  constructor(posx) {
    super(game.newRectangle(
      {x:0, y:0, w:20, h:10},
      {r:255, g:255, b:255, a:255}
    ));

    this.pos.x = posx;
    this.pos.y = -20;
    this.hitbox = {x:0, y:0, w:20, h:10};

    game.addAsCollision(this, CollideLayers.npc, CollideLayers.npc, CollideTypes.none);
  }

  update() {
    super.update();
    this.movementvector.y = 1;
    if (this.pos.y > 600) this.destroy();
  }

  react(owner, name, params) {
    if (name == "hurt") {
      score.increment();
      owner.destroy();
      this.destroy();
      return true;
    }
    return false;
  }
}
```

**Entity with timeout (spawner):**
```typescript
class Mothership extends Fauna {
  constructor() {
    super(game.newRectangle(
      {x:0, y:0, w:1, h:1},
      {r:0, g:0, b:0, a:0}
    ));

    this.addTimeout([500, 300, 600], {
      triggered: (timeout) => {
        game.registerEntity(new Enemy(Math.random() * 180));
      }
    });
  }
}
```

---

## Level System

### Level

A level class to extend for each level. Manages the game world, entities, and level-specific logic.

**Extends:** `GameObjects.Level`

#### Fields

- `bodies: Bodies.Embodiment[]` - Array of all entities in the level
- `ininame: string` - Name of the INI file for the level (abstract, must be defined)
- `representation: Composite.Snap[]` - Visual representation of the level
- `levelsize: T.Box` - Dimensions of the level `{w, h}`
- `grids: Array<CollisionGrid>` - Collision grids for the level
- `cellbuild: T.CellBuild` - Tile data and configuration

#### Methods

**`load(): Promise<void>`** (async)

Loads the level from an INI file. Automatically loads from `_assets/{ininame}`.

**`buildCell(file: string, glContext: Render.GLContext, shadercontext: ShaderLoader): Promise<void>`** (async)

Loads level's INI file. Then loads a graphical representation of the level.

**Parameters:**
- `file: string` - The INI file with its relative path
- `glContext` - The glContext field from the game object
- `shadercontext` - The shadercontext field from the game object

**Example:**
```typescript
await this.buildCell("_assets/myinifile.ini", game.glContext, game.shadercontext)
```

#### Complete Level Example

```typescript
export default class GameLevel extends LevelFactory {
  public ininame: string = "arbre00c.ini";

  public async build(game: ActionGame, firstLevel: boolean = false): Promise<void> {
    await this.buildCell(game.rootFolder + this.ininame, game.glContext, game.shadercontext);
    game.cellbuild = this.cellbuild;

    await API.preloadText("_assets/arbre/00/tree.csv");
    game.addGrid(this.cellbuild.collisions[0], 16, CollideLayers.player, CollideTypes.block);

    game.player = new Character(game);
    new Tree(game);
  }
}
```

---

## Rendering System

### Composite (Base Class)

Common to each `Composite` object.

#### Fields

- `rprops: T.RenderProperties` - Rendering properties (see below)

#### Methods

**`getclientbounds(): Bounds`**

Returns "client bounds" - the composite position in screen coordinates relative to the canvas origin + its width and height, with scaling taken into account.

**Returns:** `Bounds = {x:number, y:number, w:number, h:number}`

Also available: `getclientleft()`, `getclienttop()`, `getclientwidth()`, `getclientheight()`

### Frame

Container for composites and animations.

**Constructor:**
```typescript
new Frame(game.glContext, game.shadercontext, Array<Composite>)
```

**Fields:**
- `frame: Array<Composite>` - Array of composites to render
- `rprops: T.RenderProperties` - Rendering properties

**Example:**
```typescript
let frame = new Frame(game.glContext, game.shadercontext, [sprite1, sprite2]);
```

### Animation

Container for Snaps which can contain multiple frames.

Build with `ActionGame.buildAni()` or load via `ActionGame.parseGani()`.

**Example:**
```typescript
this.animations = game.parseGani("_assets/character.gani");
```

### Snap

Can contain multiple renderables that will be represented as one image.

Build with `ActionGame.buildSnap()` or `ActionGame.newSnap()`.

**Fields:**
- `parts: Array<Composite>` - Parts of this snap
- `rprops: T.RenderProperties` - Rendering properties

**Example:**
```typescript
let snap = game.newSnap([rect1, rect2]);
snap.rprops.angle = 0.5;
```

### Rectangle

Rectangular region for collision detection, sprite rendering, or UI layout.

**Extends:** `Composite.Rectangle`

Create with `ActionGame.newRectangle()`.

### Text

Renderable text object.

**Extends:** `Composite.Text`

**Fields:**
- `size: {w: number, h: number}` - Text dimensions

**Methods:**
- `setText(text: string): void` - Updates the text content

**Example:**
```typescript
let text = game.newText("Score: 0", {font: "syne mono"});
text.setText("Score: 100");

// Center text
this.pos.x = 150 - text.size.w / 2;
```

### Rendering Properties (rprops)

All renderable objects (Frame, Snap, Rectangle, etc.) have a `rprops` property.

**Type:** `T.RenderProperties`

**Available Properties:**
- `shader?: string` - Shader to use (advanced, don't modify unless you compile custom shaders)
- `pos: Point` - Position on screen `{x: number, y: number}`
- `flip: Flip` - Flip settings `{flipx: boolean, flipy: boolean}`
- `rotcenter?: Point` - Rotation center point
- `angle: number` - Rotation angle in radians
- `scalecenter?: Point` - Scale center point
- `scale: Point` - Scale factor `{x: number, y: number}`
- `layer: number` - Render layer (higher = in front)
- `hidden: boolean` - Whether to hide the renderable
- `delete: boolean` - Mark for deletion
- `colorize?: Array<number>` - Color modification (not implemented)

**Examples:**
```typescript
// Rotation
snap.rprops.rotcenter = {x: 1, y: 10};
snap.rprops.angle = -0.7;

// Scale
snap.rprops.scale = {x: 0.5, y: 0.5};
snap.rprops.scalecenter = {x: 64, y: 48};

// Hide/show
entity.myFrame.rprops.hidden = true;

// Flip
entity.myFrame.rprops.flip = {flipx: true, flipy: false};
```

---

## Physics & Collision

### Collision System

The physics system handles collision detection between entities and grids.

#### Adding Entity Collision

```typescript
game.addAsCollision(
  entity,                          // Entity to add
  CollideLayers.player,            // Layer this entity is on
  CollideLayers.grid | CollideLayers.npc,  // Layers it collides with
  CollideTypes.block               // Collision type
);
```

#### Adding Grid Collision

```typescript
game.addGrid(
  this.cellbuild.collisions[0],    // 2D boolean array
  16,                              // Tile size
  CollideLayers.player,            // Layers that collide with grid
  CollideTypes.block               // Collision type
);
```

#### Capture Zones

Captures are dynamic hitboxes for attacks, interactions, etc.

```typescript
game.addCapture({
  cwith: CollideLayers.npc,        // What the capture will collide with
  type: CollideTypes.none,         // Collision type (use none for callback-only)
  hitbox: {x:0, y:0, w:4, h:10},  // Hitbox relative to owner
  owner: this,                     // Owner entity
  call: (owner, target) => {       // Callback on collision
    target.react(owner, "hurt", [10]);
  }
});
```

### Complete Bullet Example

```typescript
class Bullet extends Fauna {
  constructor(posx, posy) {
    let laser = game.newRectangle({x:0, y:0, w:4, h:20}, {r:100, g:100, b:255, a:255});
    let shine = game.newRectangle({x:1, y:-10, w:2, h:20}, {r:128, g:128, b:255, a:255});
    let shiner = game.newSnap([shine]);
    let shiner2 = game.newSnap([shine]);

    shiner.rprops.rotcenter = {x:1, y:10};
    shiner.rprops.angle = -0.7;

    shiner2.rprops.rotcenter = {x:1, y:10};
    shiner2.rprops.angle = 0.7;

    super(game.newFrame([laser, shiner, shiner2]));

    this.pos.x = posx;
    this.pos.y = posy;

    game.addCapture({
      cwith: CollideLayers.npc,
      type: CollideTypes.none,
      hitbox: {x:0, y:0, w:4, h:10},
      owner: this,
      call: (owner, target) => {
        target.react(owner, "hurt", []);
      }
    });

    game.registerEntity(this);
  }

  update() {
    super.update();
    this.movementvector.y = -1;
    if (this.pos.y < -20) this.destroy();
  }
}
```

---

## Utility API

Static helper methods for common operations.

### API.playSound(file: string): void

Plays an audio file asynchronously without blocking game execution.

**Parameters:**
- `file: string` - Path to the sound file

**Example:**
```typescript
API.playSound('_assets/arbre/swoosh_1.wav');
```

### API.imageFromCSV(game: ActionGame, file: string): Composite.Snap

Loads a CSV file containing tile data and creates a renderable sprite.

**Parameters:**
- `game: ActionGame` - Game instance for rendering context
- `file: string` - Path to CSV file

**Returns:** `Composite.Snap` - Renderable sprite

**Example:**
```typescript
let image = API.imageFromCSV(game, "_assets/arbre/00/tree.csv");
super(new Frame(game.glContext, game.shadercontext, [image], {w:128, h:96}));
```

### API.preloadText(file: string): Promise&lt;void&gt;

Preloads text files (JSON, CSV, plain text) into memory for faster access during gameplay.

**Parameters:**
- `file: string` - Path to the text file to preload

**Returns:** `Promise<void>` - Resolves when file is loaded

**Example:**
```typescript
await API.preloadText("_assets/arbre/00/tree.csv");
```

---

## Type Definitions

### T.Point

```typescript
= {
  x: number,
  y: number
}
```

### T.Bounds

```typescript
= {
  x: number,
  y: number,
  w: number,
  h: number
}
```

### T.Box

```typescript
= {
  w: number,
  h: number
}
```

### T.Color

```typescript
= {
  r: number,  // 0-255
  g: number,  // 0-255
  b: number,  // 0-255
  a: number   // 0-255
}
```

### T.Flip

```typescript
= {
  flipx: boolean,
  flipy: boolean
}
```

### T.SnapBuild

```typescript
= {
  file: string,
  srcrect: Bounds,
  dstrect: Bounds
}
```

### T.AniBuild

```typescript
= {
  frames: Array<Array<SnapBuild>>
}
```

### T.KeyboardAction

```typescript
= {
  keydown?: () => void,
  keyheld?: () => void,
  keypressed?: () => void,  // keydown and keyheld
  keyup?: () => void
}
```

### T.Trigger

```typescript
= {
  name: string,
  state?: string
}
```

### T.RenderProperties

```typescript
= {
  shader?: string,     // Don't use unless you compile custom shaders

  pos: Point,
  flip: Flip,

  rotcenter?: Point,
  angle: number,

  scalecenter?: Point,
  scale: Point,

  layer: number,
  hidden: boolean,
  delete: boolean,

  colorize?: Array<number>  // Not implemented
}
```

### CaptureProperties

```typescript
= {
  cwith: CollideLayers,     // What the capture will collide with
  type: CollideTypes,       // Collision type (use none for callback-only)
  hitbox: Bounds,           // Hitbox relative to owner
  owner: Alacrity,          // Owner entity
  call: (owner, target) => void  // Callback on collision
}
```

**Example:**
```typescript
{
  cwith: CollideLayers.npc,
  type: CollideTypes.none,
  hitbox: {x:0, y:0, w:32, h:32},
  owner: this,
  call: (owner, target) => {
    target.react(owner, "hurt", [10]);
  }
}
```

### TimerActions

```typescript
= {
  active?: (timeout: Timeout) => void,
  triggered?: (timeout: Timeout) => void
}
```

### Health

```typescript
= {
  max: number,
  current: number
}
```

---

## Enumerations

### CollideLayers

Defines which layers objects can collide with. Can be combined with `|` operator.

```typescript
enum CollideLayers {
  none         = 0,
  player       = 1 << 0,
  npc          = 1 << 1,
  grid         = 1 << 2,
  interactable = 1 << 3,
  all          = 0xFFFFFFFF
}
```

**Usage:**
```typescript
// Single layer
CollideLayers.player

// Multiple layers
CollideLayers.grid | CollideLayers.npc

// All layers
CollideLayers.all
```

### CollideTypes

Defines the type of collision detection to use.

```typescript
enum CollideTypes {
  none      = 0,
  block     = 1,
  hurt      = 2,
  interact  = 3,
  climbable = 4,
  water     = 5,
  instakill = 6,
  get       = 7,
  custom0   = 8,
  custom1   = 9,
  custom2   = 10,
  custom3   = 11,
  custom4   = 12,
  custom5   = 13,
  custom6   = 14,
  custom7   = 15,
  custom8   = 16,
  custom9   = 17,
  all       = 0xFFFFFFFF
}
```

**Common Types:**
- `none` - No collision behavior (use with callbacks)
- `block` - Solid collision, prevents movement
- `hurt` - Damage collision
- `interact` - Interaction zone
- `climbable` - Climbable surface (e.g., ladders)
- `water` - Water physics
- `instakill` - Instant death
- `get` - Collectible
- `custom0-9` - Custom collision types for your game

---

## Browser Usage

When using the compiled engine.js in a browser, all exports are available on the global `window.TEWOU` object:

```javascript
// Accessing classes
class Player extends window.TEWOU.Player { }
class Enemy extends window.TEWOU.Fauna { }
class Game extends window.TEWOU.ActionGame { }

// Accessing enums
window.TEWOU.CollideLayers.player
window.TEWOU.CollideTypes.block

// Accessing Engine
window.TEWOU.Engine.start(game)
window.TEWOU.Engine.mainLoop()

// Accessing API
window.TEWOU.API.playSound('sound.wav')
```

---

## Module Exports (TypeScript/ES6)

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
**Engine Version:** 0.0.1 (Grawl Edition)
