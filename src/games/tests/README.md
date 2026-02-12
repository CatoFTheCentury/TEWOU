# TEWOU Engine Test Suite

Comprehensive test suite for the TEWOU game engine, covering all major API features and functionality.

## Getting Started

Open `index.html` in your browser to access the test hub. The hub provides a sidebar navigation to all available tests.

## Test Categories

### 1. Rendering Tests (`rendering/`)
Tests for visual output and rendering primitives:
- **rectangles.html** - Rectangle creation with various colors, sizes, and positions
- **text.html** - Text rendering with different fonts, sizes, and colors
- **transparency.html** - Transparent rectangles with various alpha values and blending
- **frames.html** - Frame composition and grouping
- **snaps.html** - Snap composition for creating composite images
- **layers.html** - Layer ordering and depth sorting
- **transforms.html** - Transformations (rotation, scaling, flipping, translation)

### 2. Entity Tests (`entities/`)
Tests for game objects and entity management:
- **fauna.html** - Fauna (NPC) entity creation and action states
- **player.html** - Player entity with keyboard input
- **lifecycle.html** - Entity creation, update cycle, and destruction
- **registration.html** - Entity registration to game pools

### 3. Animation Tests (`animation/`)
Tests for sprite animations (stubs - require assets):
- **basic.html** - Basic animation playback
- **switching.html** - Animation state switching
- **directions.html** - Directional animations

### 4. Physics Tests (`physics/`)
Tests for movement and collision:
- **movement.html** - Various movement patterns (horizontal, vertical, diagonal, circular)
- **velocity.html** - Velocity and force system (stub)
- **collision-basic.html** - Basic collision detection with blocking
- **collision-layers.html** - Collision layer interactions (stub)
- **collision-types.html** - Different collision types (stub)
- **grid-collision.html** - Grid-based collision (stub)

### 5. Input Tests (`input/`)
Tests for user input handling:
- **keyboard.html** - Keyboard input with key states (keydown, keyheld, keyup)
- **key-registration.html** - Key registration examples (stub)
- **key-states.html** - Key state detection (stub)

### 6. Time Tests (`time/`)
Tests for timing and scheduling:
- **timeout.html** - Timeout system with one-shot and repeating timers
- **triggers.html** - Event triggers (stub)
- **delta.html** - Delta time for frame-rate independence (stub)

### 7. Composition Tests (`composition/`)
Tests for rendering hierarchies:
- **frame-nesting.html** - Nested frame structures (stub)
- **snap-composition.html** - Snap composition (stub)
- **complex-hierarchy.html** - Deep hierarchies (stub)

### 8. Integration Tests (`integration/`)
Complete game scenarios:
- **full-game-loop.html** - Mini shooter game demonstrating all systems working together
- **multi-entity.html** - Many entities test (stub)
- **stress-test.html** - Performance stress test (stub)

## API Coverage

The test suite covers these TEWOU API features:

### Core Classes
- `TEWOU.ActionGame` - Main game class
- `TEWOU.Fauna` - NPC/entity base class
- `TEWOU.Player` - Player entity with input
- `TEWOU.Engine` - Game engine management

### Rendering
- `game.newRectangle()` - Create colored rectangles
- `game.newText()` - Create text elements
- `game.newFrame()` - Group renderables
- `game.newSnap()` - Create composite snapshots
- Renderable properties (`rprops.layer`, `rprops.pos`, etc.)
- Transform methods (`setAngle()`, `setScale()`, `setFlip()`, `translate()`)

### Entity Management
- `game.registerEntity()` - Add entities to game
- `entity.destroy()` - Remove entities
- `entity.update()` - Update lifecycle
- `entity.finalize()` - Finalization phase
- Action state system

### Physics
- `movementvector` - Movement direction
- `speed` - Movement speed
- `velocity` - Force and gravity
- `hitbox` - Collision bounds
- `game.addAsCollision()` - Register collision
- `TEWOU.CollideLayers` - Collision layers
- `TEWOU.CollideTypes` - Collision types

### Input
- `player.registerKey()` - Register keyboard input
- Key states: keydown, keyheld, keyup, keypressed

### Timing
- `entity.addTimeout()` - Create timers
- One-shot and repeating timeouts
- Timer actions and triggers

## Test Utilities

All tests use common utilities from `test-utils.js`:
- `TestLogger` - Logging with timestamps
- `TestStatus` - Test result tracking
- Helper functions for testing

## Adding New Tests

To add a new test:

1. Create HTML file in appropriate category folder
2. Include common CSS: `<link rel="stylesheet" href="../test-common.css">`
3. Include utilities: `<script src="../test-utils.js"></script>`
4. Include engine: `<script src="../../../engine/dist/engine.js"></script>`
5. Add link to `index.html` sidebar
6. Follow the existing test structure

## Notes

- Some tests are stubs (marked in description) that require additional assets or implementation
- All complete tests are fully functional and demonstrate working engine features
- Tests run independently - no shared state between tests
- Use browser console for additional debugging information

## Test Structure

Each test follows this structure:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Name</title>
  <link rel="stylesheet" href="../test-common.css">
</head>
<body>
  <div class="test-container">
    <div class="test-header">
      <h1>Test Name</h1>
      <p>Description and API methods tested</p>
    </div>

    <div class="canvas-wrapper">
      <canvas id="canvas"></canvas>
    </div>

    <div class="test-info">
      <h2>Test Status</h2>
      <ul id="test-status"></ul>
    </div>

    <div class="expected-result">
      <h3>Expected Result</h3>
      <p>What you should see</p>
    </div>

    <div class="log" id="log"></div>
  </div>

  <script src="../test-utils.js"></script>
  <script src="../../../engine/dist/engine.js"></script>
  <script>
    // Test implementation
  </script>
</body>
</html>
```

## Browser Compatibility

Tests are designed to work in modern browsers with WebGL support. Recommended browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
