/**
 * Render performance tests for TEWOU engine
 * Tests rendering pipeline, compositing, and WebGL operations
 */

import { PerformanceBenchmark, MemoryProfiler } from './benchmark';
import { Render, Composite, ShaderLoader, Normal, Bodies, T, Incarnations } from '../../engine/source';

/**
 * Simple test Fauna entity for performance testing
 */
class TestFauna extends Incarnations.Fauna {
  protected actions: {[key:string]: Incarnations.Action} = {
    idle: {
      state: T.RunSwitch.running
    }
  };
  protected action: string = "idle";

  constructor(glContext: Render.GLContext, shaderContext: ShaderLoader, pos: T.Point) {
    // Create a simple colored rectangle as the visual
    const rect = new Composite.Rectangle(
      glContext,
      shaderContext,
      { x: 0, y: 0, w: 16, h: 16 },
      { r: Math.floor(Math.random()*255), g: Math.floor(Math.random()*255), b: Math.floor(Math.random()*255), a: 1 }
    );

    super(rect);

    this.pos = pos;
    this.hitbox = { x: 0, y: 0, w: 16, h: 16 };
    this.speed = 0.5;
    this.state = "idle";
  }
}

export class RenderPerformanceTests {
  private benchmark: PerformanceBenchmark;
  private memory: MemoryProfiler;
  private canvas: HTMLCanvasElement;
  private glContext: Render.GLContext;
  private shaderContext: ShaderLoader;

  constructor() {
    this.benchmark = new PerformanceBenchmark();
    this.memory = new MemoryProfiler();
    this.setupCanvas();
  }

  private setupCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.glContext = new Render.GLContext(this.canvas, '800', '600');
    this.shaderContext = new ShaderLoader(this.glContext.gl);
  }

  /**
   * Test frame composition performance with varying number of layers
   */
  public async testFrameComposition(): Promise<void> {
    await this.shaderContext.init();

    console.log('\n=== Frame Composition Performance ===\n');

    const layerCounts = [100, 500, 1000];

    for (const count of layerCounts) {
      const frames: Composite.Renderable[] = [];

      for (let i = 0; i < count; i++) {
        const rect = new Composite.Rectangle(
          this.glContext,
          this.shaderContext,
          { x: i * 2, y: i * 2, w: 32, h: 32 },
          { r: 1, g: 0, b: 0, a: 1 }
        );
        frames.push(rect);
      }

      const frame = new Composite.Frame(this.glContext, this.shaderContext, frames);

      await this.benchmark.benchmark(
        `Compose ${count} layers`,
        () => {
          frame.compose();
        },
        500
      );

      // Cleanup
      for(let f of frames) f.rprops.delete = true;
      frame.rprops.delete = true;

      // Allow GPU to clean up resources
      await this.gcPause(100);
    }
  }

  /**
   * Test rendering performance at different resolutions
   */
  public async testResolutionScaling(): Promise<void> {
    console.log('\n=== Resolution Scaling Performance ===\n');

    const resolutions = [
      { w: 640, h: 480, name: 'VGA' },
      { w: 1280, h: 720, name: 'HD' },
      { w: 1920, h: 1080, name: 'Full HD' }
    ];

    for (const res of resolutions) {
      const testCanvas = document.createElement('canvas');
      testCanvas.width = res.w;
      testCanvas.height = res.h;

      const glCtx = new Render.GLContext(testCanvas, res.w.toString(), res.h.toString());
      const shaderCtx = new ShaderLoader(glCtx.gl, [new Normal()]);

      const rect = new Composite.Rectangle(
        glCtx,
        shaderCtx,
        { x: 0, y: 0, w: res.w, h: res.h },
        { r: 0.5, g: 0.5, b: 0.5, a: 1 }
      );

      const frame = new Composite.Frame(glCtx, shaderCtx, [rect]);

      await this.benchmark.benchmark(
        `Render ${res.name} (${res.w}x${res.h})`,
        () => {
          glCtx.gl.clear(glCtx.gl.COLOR_BUFFER_BIT);
          frame.compose();
        },
        200
      );

      // Cleanup WebGL resources
      frame.rprops.delete = true;
      rect.rprops.delete = true;

      // Lose the WebGL context to free resources
      const loseContext = glCtx.gl.getExtension('WEBGL_lose_context');
      if (loseContext) {
        loseContext.loseContext();
      }

      // Remove canvas from memory
      testCanvas.remove();
    }
  }

  /**
   * Test rectangle rendering performance
   */
  public async testRectangleRendering(): Promise<void> {
    console.log('\n=== Rectangle Rendering Performance ===\n');
    await this.shaderContext.init();


    const rectangleCounts = [100, 500, 1000, 2000, 5000];

    for (const count of rectangleCounts) {
      const rectangles: Composite.Rectangle[] = [];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        const w = 16 + Math.random() * 32;
        const h = 16 + Math.random() * 32;

        rectangles.push(
          new Composite.Rectangle(
            this.glContext,
            this.shaderContext,
            { x, y, w, h },
            {
              r: Math.random(),
              g: Math.random(),
              b: Math.random(),
              a: 1
            }
          )
        );
      }

      const frame = new Composite.Frame(this.glContext, this.shaderContext, rectangles);

      await this.benchmark.benchmark(
        `Render ${count} rectangles`,
        () => {
          this.glContext.gl.clear(this.glContext.gl.COLOR_BUFFER_BIT);
          frame.compose();
        },
        100
      );

      for(let r of rectangles) r.rprops.delete = true;
      frame.rprops.delete = true;

      // Allow GPU cleanup between iterations
      await this.gcPause(100);
    }
  }

  /**
   * Test text rendering performance
   */
  public async testTextRendering(): Promise<void> {
    console.log('\n=== Text Rendering Performance ===\n');
    await this.shaderContext.init();

    const textCounts = [10, 50, 100, 200];

    for (const count of textCounts) {
      const texts: Composite.Text[] = [];

      for (let i = 0; i < count; i++) {
        texts.push(
          new Composite.Text(
            this.glContext,
            this.shaderContext,
            `Test Text ${i}`,
            {
              size: 16
            }
          )
        );
      }

      const frame = new Composite.Frame(this.glContext, this.shaderContext, texts);

      await this.benchmark.benchmark(
        `Render ${count} text objects`,
        () => {
          this.glContext.gl.clear(this.glContext.gl.COLOR_BUFFER_BIT);
          frame.compose();
        },
        100
      );

      for(let t of texts) t.rprops.delete = true;
      frame.rprops.delete = true;

      // Allow GPU cleanup between iterations
      await this.gcPause(100);
    }
  }

  /**
   * Test shader switching overhead
   */
  public async testShaderSwitching(): Promise<void> {
    console.log('\n=== Shader Switching Performance ===\n');

    await this.shaderContext.init();

    const switchCounts = [10, 50, 100];

    for (const count of switchCounts) {
      // Create images with different shaders to trigger switching
      const images: Composite.Renderable[] = [];

      for (let i = 0; i < count; i++) {
        const img = new Composite.Rectangle(
          this.glContext,
          this.shaderContext,
          { x: 0, y: 0, w: 16, h: 16 },
          { r: 1, g: 0, b: 0, a: 1 }
        );
        img.rprops.shaderID = i % 2 === 0 ? 'normal' : 'reverser';
        images.push(img);
      }

      await this.benchmark.benchmark(
        `Render ${count} objects with shader switching`,
        () => {
          for (const img of images) {
            this.shaderContext.passShader(
              img as any,
              { x: 0, y: 0, w: 16, h: 16 },
              {}
            );
          }
        },
        100
      );
    }
  }

  /**
   * Test GL clear operations
   */
  public async testClearOperations(): Promise<void> {
    console.log('\n=== Clear Operations Performance ===\n');

    await this.benchmark.benchmark(
      'GL clear operations',
      () => {
        this.glContext.gl.clear(this.glContext.gl.COLOR_BUFFER_BIT);
      },
      1000
    );

    await this.benchmark.benchmark(
      'GL clear with depth',
      () => {
        this.glContext.gl.clear(
          this.glContext.gl.COLOR_BUFFER_BIT | this.glContext.gl.DEPTH_BUFFER_BIT
        );
      },
      1000
    );
  }

  /**
   * Test snap (sprite frame) composition
   */
  public async testSnapComposition(): Promise<void> {
    console.log('\n=== Snap Composition Performance ===\n');

    const partCounts = [5, 10, 20, 50, 500];

    for (const count of partCounts) {
      const parts: Composite.Renderable[] = [];

      for (let i = 0; i < count; i++) {
        parts.push(
          new Composite.Rectangle(
            this.glContext,
            this.shaderContext,
            { x: i * 5, y: i * 5, w: 16, h: 16 },
            { r: 1, g: 1, b: 1, a: 1 }
          )
        );
      }

      const snap = new Composite.Snap(this.glContext, this.shaderContext, parts);

      await this.benchmark.benchmark(
        `Compose snap with ${count} parts`,
        () => {
          snap.compose();
        },
        500
      );

      // Cleanup
      snap.rprops.delete = true;
      for (const part of parts) {
        part.rprops.delete = true;
      }

      await this.gcPause(100);
    }
  }

  /**
   * Measure memory usage during rendering
   */
  public async testRenderingMemory(): Promise<void> {
    console.log('\n=== Rendering Memory Usage ===\n');

    this.memory.takeSnapshot('before-render-objects');

    const rectangles: Composite.Rectangle[] = [];
    for (let i = 0; i < 1000; i++) {
      rectangles.push(
        new Composite.Rectangle(
          this.glContext,
          this.shaderContext,
          { x: i, y: i, w: 32, h: 32 },
          { r: 1, g: 0, b: 0, a: 1 }
        )
      );
    }

    this.memory.takeSnapshot('after-1000-rectangles');

    const frame = new Composite.Frame(this.glContext, this.shaderContext, rectangles);

    this.memory.takeSnapshot('after-frame-creation');

    for (let i = 0; i < 100; i++) {
      frame.compose();
    }

    this.memory.takeSnapshot('after-100-compositions');

    this.memory.printSnapshot('before-render-objects');
    this.memory.printSnapshot('after-1000-rectangles');
    this.memory.printSnapshot('after-frame-creation');
    this.memory.printSnapshot('after-100-compositions');

    const memUsed = this.memory.compare('before-render-objects', 'after-100-compositions');
    console.log(`Total memory used: ${(memUsed / 1024 / 1024).toFixed(2)} MB`);
  }

  /**
   * Create a rotating entity that updates its rotation each frame
   */
  private createRotatingEntity(x: number, y: number): Bodies.Embodiment {
    const rect = new Composite.Rectangle(
      this.glContext,
      this.shaderContext,
      { x: 0, y: 0, w: 32, h: 32 },
      { r: 1, g: 0, b: 0, a: 1 }
    );

    const entity = new Bodies.Embodiment(rect);
    entity.pos = { x, y };
    entity.hitbox = { x: 0, y: 0, w: 32, h: 32 };

    // Store rotation state
    let rotation = 0;

    // Override update to add rotation
    const originalUpdate = entity.update.bind(entity);
    entity.update = function() {
      originalUpdate();
      // Rotate entity
      rotation += 0.05;
      if (rotation > Math.PI * 2) rotation -= Math.PI * 2;

      // Apply rotation to frame
      this.myFrame.rprops.rotation = rotation;
    };

    return entity;
  }

  /**
   * Test rendering performance with rotating entities
   */
  public async testRotatingEntities(): Promise<void> {
    console.log('\n=== Rotating Entity Rendering Performance ===\n');

    await this.shaderContext.init();

    const entityCounts = [10, 50, 100, 200];

    for (const count of entityCounts) {
      const entities: Bodies.Embodiment[] = [];

      for (let i = 0; i < count; i++) {
        const x = (i % 20) * 40;
        const y = Math.floor(i / 20) * 40;
        entities.push(this.createRotatingEntity(x, y));
      }

      // Create frame with all entities
      const frame = new Composite.Frame(
        this.glContext,
        this.shaderContext,
        entities.map(e => e.myFrame)
      );

      await this.benchmark.benchmark(
        `Render ${count} rotating entities`,
        () => {
          // Update all entities (applies rotation)
          for (let i = 0; i < entities.length; i++) {
            entities[i].update();
          }
          // Compose frame (renders with rotations)
          this.glContext.gl.clear(this.glContext.gl.COLOR_BUFFER_BIT);
          frame.compose();
        },
        200
      );

      // Clean up
      frame.rprops.delete = true;
    }

    console.log('\nComparing static vs rotating entities...\n');

    // Comparison test
    const staticRects: Composite.Rectangle[] = [];
    const rotatingEntities: Bodies.Embodiment[] = [];

    for (let i = 0; i < 100; i++) {
      const x = (i % 10) * 40;
      const y = Math.floor(i / 10) * 40;

      staticRects.push(
        new Composite.Rectangle(
          this.glContext,
          this.shaderContext,
          { x, y, w: 32, h: 32 },
          { r: 1, g: 0, b: 0, a: 1 }
        )
      );

      rotatingEntities.push(this.createRotatingEntity(x, y));
    }

    const staticFrame = new Composite.Frame(
      this.glContext,
      this.shaderContext,
      staticRects
    );

    const rotatingFrame = new Composite.Frame(
      this.glContext,
      this.shaderContext,
      rotatingEntities.map(e => e.myFrame)
    );

    await this.benchmark.benchmark(
      'Render 100 static rectangles',
      () => {
        this.glContext.gl.clear(this.glContext.gl.COLOR_BUFFER_BIT);
        staticFrame.compose();
      },
      200
    );

    await this.benchmark.benchmark(
      'Render 100 rotating entities',
      () => {
        for (const entity of rotatingEntities) {
          entity.update();
        }
        this.glContext.gl.clear(this.glContext.gl.COLOR_BUFFER_BIT);
        rotatingFrame.compose();
      },
      200
    );

    // Clean up
    staticFrame.rprops.delete = true;
    rotatingFrame.rprops.delete = true;
  }

  /**
   * Test rectangle rendering capacity with FPS measurement
   * Measures pure rendering performance without entity logic
   */
  public async testRectangleCapacity(): Promise<void> {
    console.log('\n=== Rectangle Rendering Capacity (60 FPS Target) ===\n');

    await this.shaderContext.init();

    const rectangleCounts = [100, 500, 1000, 2000, 5000, 10000, 15000, 20000];
    const targetFPS = 60;
    const testDuration = 2000; // Test each count for 2 seconds

    for (const count of rectangleCounts) {
      // Create rectangles
      const rectangles: Composite.Rectangle[] = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        const w = 16 + Math.random() * 16;
        const h = 16 + Math.random() * 16;

        rectangles.push(
          new Composite.Rectangle(
            this.glContext,
            this.shaderContext,
            { x, y, w, h },
            {
              r: Math.random(),
              g: Math.random(),
              b: Math.random(),
              a: 1
            }
          )
        );
      }

      const frame = new Composite.Frame(this.glContext, this.shaderContext, rectangles);

      // Measure FPS over time
      const fps = await this.measureRectangleFPS(frame, testDuration);
      const avgFrameTime = 1000 / fps;

      const status = Math.round(fps) >= targetFPS ? '✓ PASS' : '✗ FAIL';
      const color = Math.round(fps) >= targetFPS ? '\x1b[32m' : '\x1b[31m';
      const reset = '\x1b[0m';

      console.log(
        `${color}${status}${reset} ${count} rectangles: ${fps.toFixed(2)} FPS (${avgFrameTime.toFixed(2)}ms per frame)`
      );

      // Clean up
      for (const rect of rectangles) {
        rect.rprops.delete = true;
      }
      frame.rprops.delete = true;

      await this.gcPause(100);

      // Stop testing if we're significantly below target
      if (fps < targetFPS * 0.5) {
        console.log(`\nStopping test - FPS dropped below ${(targetFPS * 0.5).toFixed(0)} FPS`);
        break;
      }
    }
  }

  /**
   * Measure actual rendering FPS for rectangles using requestAnimationFrame
   */
  private measureRectangleFPS(frame: Composite.Frame, durationMs: number): Promise<number> {
    return new Promise((resolve) => {
      let frameCount = 0;
      const startTime = performance.now();

      const renderLoop = (currentTime: number) => {
        // Clear and render
        this.glContext.gl.clear(this.glContext.gl.COLOR_BUFFER_BIT);
        frame.compose();

        frameCount++;

        const elapsed = currentTime - startTime;

        if (elapsed >= durationMs) {
          // Calculate average FPS
          const fps = (frameCount / elapsed) * 1000;
          resolve(fps);
        } else {
          requestAnimationFrame(renderLoop);
        }
      };

      requestAnimationFrame(renderLoop);
    });
  }

  /**
   * Test entity rendering with FPS measurement to find frame drop threshold
   * Uses actual Fauna entities to simulate real game performance
   */
  public async testEntityCapacity(): Promise<void> {
    console.log('\n=== Fauna Entity Rendering Capacity (60 FPS Target) ===\n');

    await this.shaderContext.init();

    const entityCounts = [100, 500, 1000, 2000, 3000, 5000, 7500, 10000];
    const targetFPS = 60;
    const testDuration = 2000; // Test each count for 2 seconds

    for (const count of entityCounts) {
      // Create Fauna entities
      const entities: TestFauna[] = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 600;

        entities.push(new TestFauna(this.glContext, this.shaderContext, { x, y }));
      }

      // Measure FPS over time with entity updates
      const fps = await this.measureEntityFPS(entities, testDuration);
      const avgFrameTime = 1000 / fps;

      const status = Math.round(fps) >= targetFPS ? '✓ PASS' : '✗ FAIL';
      const color = Math.round(fps) >= targetFPS ? '\x1b[32m' : '\x1b[31m';
      const reset = '\x1b[0m';

      console.log(
        `${color}${status}${reset} ${count} entities: ${fps.toFixed(2)} FPS (${avgFrameTime.toFixed(2)}ms per frame)`
      );

      // Clean up
      for (const entity of entities) {
        entity.destroy();
      }

      // Stop testing if we're significantly below target
      if (fps < targetFPS * 0.5) {
        console.log(`\nStopping test - FPS dropped below ${(targetFPS * 0.5).toFixed(0)} FPS`);
        break;
      }
    }
  }

  /**
   * Measure actual rendering FPS with entity updates using requestAnimationFrame
   */
  private measureEntityFPS(entities: TestFauna[], durationMs: number): Promise<number> {
    return new Promise((resolve) => {
      let frameCount = 0;
      const startTime = performance.now();

      const renderLoop = (currentTime: number) => {
        // Update all entities (calls their update logic)
        for (const entity of entities) {
          entity.update();
        }

        // Finalize entity states (movement, callbacks, etc.)
        for (const entity of entities) {
          entity.finalize();
        }

        // Clear and render all entity frames
        this.glContext.gl.clear(this.glContext.gl.COLOR_BUFFER_BIT);
        for (const entity of entities) {
          entity.myFrame.compose();
        }

        frameCount++;

        const elapsed = currentTime - startTime;

        if (elapsed >= durationMs) {
          // Calculate average FPS
          const fps = (frameCount / elapsed) * 1000;
          resolve(fps);
        } else {
          requestAnimationFrame(renderLoop);
        }
      };

      requestAnimationFrame(renderLoop);
    });
  }

  /**
   * Helper to allow garbage collection between heavy tests
   */
  private async gcPause(ms: number = 100): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Run all render performance tests
   */
  public async runAll(): Promise<void> {
    console.log('Starting Render Performance Tests...');

    await this.testClearOperations();
    await this.gcPause();

    await this.testRectangleRendering();
    await this.gcPause();

    await this.testTextRendering();
    await this.gcPause();

    await this.testFrameComposition();
    await this.gcPause();

    await this.testSnapComposition();
    await this.gcPause();

    await this.testRotatingEntities();
    await this.gcPause();

    await this.testRectangleCapacity();
    await this.gcPause(500); // Longer pause after heavy test

    await this.testEntityCapacity();
    await this.gcPause(500); // Longer pause after heavy test

    await this.testResolutionScaling();
    await this.gcPause();

    await this.testShaderSwitching();
    await this.gcPause();

    await this.testRenderingMemory();

    this.benchmark.printResults();

    console.log('\nExporting results to JSON...');
    const json = this.benchmark.exportJSON();
    console.log(json);
  }
}
