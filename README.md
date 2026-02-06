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

## Performance Review
Some performance tests have been written with the help of Claude.ai and half-assedly reviewed. The benchmark reports here takes into account that most ill-formed or incomplete objects are skipped and should reflect the engine's performance.
**What is FAST**
  - Rendering is cool, fast enough for a project. Animations need to be tested (how many rotating sprites can i have before i have a framedrop?).
    - Renders 2000 rectangles in 5ms, 100 rectangles in .335ms
    - Renders 100 Text objects in .9ms
    - Composing a composite of 500 already composed parts in 1.3ms (a regular amount of parts should be 10, which takes 0.03ms).
    - Renders 100 objects with shader switching in between each in .43ms (fast, but shader switching should be scarce anyway)
  
  - Entities
    - Updating an Entity that has no override on update or finalize is virtually free since these are mostly empty out of the box.
    - Timeouts are virtually free but more than 100 on an entity could start slowing it down a bit.
    - Destroying entities is basically free
    - Creating entities is close to free at 1000 entities in 0.8ms

**What is SLOW**
  - Render + Entities
    - 200 rotating entities at 2.7ms per refresh is quite slow. 10 takes .26ms per refresh. Way too slow. Must find ways to cut some processing here and there.
  - Physics are slow, spatial partitioning is required.
    - Once physics have 100 objects, it will take an whopping average of 2ms to loop through them all. This is due to every object verifying collision on every object. Some filters are present but quadtree collision would be necessary.
    - An empty physics system apparently takes 2ms to refresh???


## 😺
A release version is coming but for now the usable version of the engine is found [here](releases/v0.0.1_GrawlEdition/engine/engine.js).