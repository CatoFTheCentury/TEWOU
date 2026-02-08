![GitHub](https://img.shields.io/github/languages/top/CatoFTheCentury/TEWOU)

# TEWOU Game Engine
TEWOU is a 49kb WebGL-powered 2D game engine meant to be usable for all types of game projects. Built entirely in Typescript, it is meant to be extended with a game, sideloaded on a webpage. API exposed to the window object, accessible through the `TEWOU` namespace.

TEWOU features animated sprites, hitbox collision detection and layered tile-based levels. Rendering that has a shader-ready pipeline, rotation, scaling and custom GLSL effects out of the box. 


## Features

Game engine:
  - entities
    - animated
    - hitboxes
  - tiling
    - layered
  - render
    - rotation
    - scale
    - shaders

and more..!

Console:
  - Some commands
  - Crude window managements

## 📚 [Documentation](docs/API.md)

## 🚀 [Quick Example](releases/v0.0.1_GrawlEdition/game/example.js)

## Performance Overview
Some performance tests have been written with the help of Claude.ai and reviewed in surface. The benchmark reports here takes into account that most ill-formed or incomplete objects are skipped and should reflect the engine's performance. Benchmark tests reporting extremely fast speeds were turned down as skipping the whole thing.

**What is FAST**
  - Rendering itself is blazing fast cool, benchmarks have shown very high efficiency creating rectangles, doing transformations and composing image.
  
  - Entities
    - Updating an Entity that has no override on update or finalize is virtually free since these are mostly empty out of the box.
    - Timeouts are virtually free but more than 100 on an entity could start slowing it down a bit.

**What is SLOW**
  - Render + Entities
    - Only 2000 entities can coexist with no framedrop. That is, before collisions are added. See below.
  - Physics are slow, spatial partitioning is required.
    - Once physics have 100 objects, it will take an whopping average of 2ms to loop through them all. This is due to every object verifying collision on every object. Some filters are present but quadtree collision would be necessary.
    - An empty physics system apparently takes 2ms to refresh???


## 😺
A release version is coming but for now the usable version of the engine is found [here](releases/v0.0.1_GrawlEdition/engine/engine.js).