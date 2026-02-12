/**
 * Physics performance tests for TEWOU engine
 * Tests collision detection, entity updates, and physics simulation
 */

import { PerformanceBenchmark, MemoryProfiler } from './benchmark';
import { Bodies, Physics, Composite, Render, ShaderLoader, Normal, CollisionGrid, NPCCollision, C, T } from '../../engine/source';

export class PhysicsPerformanceTests {
  private benchmark: PerformanceBenchmark;
  private memory: MemoryProfiler;
  private canvas: HTMLCanvasElement;
  private glContext: Render.GLContext;
  private shaderContext: ShaderLoader;
  private physics: Physics;

  constructor() {
    this.benchmark = new PerformanceBenchmark();
    this.memory = new MemoryProfiler();
    this.setupCanvas();
    this.physics = new Physics();
  }

  private setupCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.glContext = new Render.GLContext(this.canvas, '800', '600');
    this.shaderContext = new ShaderLoader(this.glContext.gl, [new Normal()]);
  }

  /**
   * Create a test entity
   */
  private createTestEntity(x: number, y: number): Bodies.Embodiment {
    const rect = new Composite.Rectangle(
      this.glContext,
      this.shaderContext,
      { x: 0, y: 0, w: 32, h: 32 },
      { r: 1, g: 0, b: 0, a: 1 }
    );

    const entity = new Bodies.Embodiment(rect);
    entity.pos = { x, y };
    entity.hitbox = { x: 0, y: 0, w: 32, h: 32 };

    return entity;
  }


  /**
   * Test entity update performance with varying numbers of entities
   */
  public async testEntityUpdates(): Promise<void> {
    console.log('\n=== Entity Update Performance ===\n');

    const entityCounts = [10, 50, 100, 500, 1000];

    for (const count of entityCounts) {
      const entities: Bodies.Alacrity[] = [];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        entities.push(this.createTestEntity(x, y));
      }

      await this.benchmark.benchmark(
        `Update ${count} entities`,
        () => {
          for (let i = 0; i < entities.length; i++) {
            entities[i].update();
          }
        },
        500
      );

      await this.benchmark.benchmark(
        `Finalize ${count} entities`,
        () => {
          for (let i = 0; i < entities.length; i++) {
            entities[i].finalize();
          }
        },
        500
      );
    }
  }


  /**
   * Test collision grid performance
   */
  public async testCollisionGrid(): Promise<void> {
    console.log('\n=== Collision Grid Performance ===\n');

    const gridSizes = [
      { w: 1000, h: 1000, resolution: 32 },
      { w: 2000, h: 2000, resolution: 32 },
      // { w: 4000, h: 4000, resolution: 32 },
      { w: 5000, h: 5000, resolution: 32 }
    ];

    for (const size of gridSizes) {
      const grid: boolean[][] = [];
      for (let y = 0; y < size.h; y++) {
        grid[y] = [];
        for (let x = 0; x < size.w; x++) {
          grid[y][x] = Math.random() > 0.7;
        }
      }

      // Benchmark grid creation
      await this.benchmark.benchmark(
        `Create collision grid ${size.w}x${size.h}`,
        () => {
          new CollisionGrid(
            grid,
            size.resolution,
            C.CollideLayers.npc | C.CollideLayers.player,
            C.CollideTypes.block
          );
        },
        100
      );

      // Set up physics system with collision grid for other tests
      const physics = new Physics();
      const collisionGrid = new CollisionGrid(
        grid,
        size.resolution,
        C.CollideLayers.npc | C.CollideLayers.player,
        C.CollideTypes.block
      );
      physics.collisionpool.push(collisionGrid);

      // Create test entity and register it with collision system
      const testEntity = this.createTestEntity(100, 100);

      // Register entity as NPC so it's on the npc layer
      const entityCollision = new NPCCollision(
        testEntity,
        C.CollideLayers.npc,           // Entity is on npc layer
        C.CollideLayers.grid,          // Collides with grid
        C.CollideTypes.block
      );
      physics.collisionpool.push(entityCollision);

      await this.benchmark.benchmark(
        `Check collision in ${size.w}x${size.h} grid`,
        () => {
          collisionGrid.intersect(testEntity);
        },
        1000
      );

      await this.benchmark.benchmark(
        `Test wall collision in ${size.w}x${size.h} grid`,
        () => {
          collisionGrid.testWall({ x: 100, y: 100 });
        },
        1000
      );
    }
  }

  /**
   * Test physics system refresh with multiple entities
   */
  public async testPhysicsRefresh(): Promise<void> {
    console.log('\n=== Physics System Refresh Performance ===\n');

    const entityCounts = [10, 50, 100, 200, 500];

    for (const count of entityCounts) {
      const physics = new Physics();
      const entities: Bodies.Embodiment[] = [];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        entities.push(this.createTestEntity(x, y));
      }

      await this.benchmark.benchmark(
        `Physics refresh with ${count} entities`,
        () => {
          physics.refresh();
        },
        500
      );
    }
  }

  /**
   * Test entity movement vector reset
   */
  public async testMovementReset(): Promise<void> {
    console.log('\n=== Movement Vector Reset Performance ===\n');

    const entityCounts = [100, 500, 1000, 2000];

    for (const count of entityCounts) {
      const entities: Bodies.Alacrity[] = [];

      for (let i = 0; i < count; i++) {
        entities.push(this.createTestEntity(i, i));
      }

      await this.benchmark.benchmark(
        `Reset movement for ${count} entities`,
        () => {
          Bodies.Alacrity.resetAllMovements(entities);
        },
        500
      );
    }
  }

  /**
   * Test timeout/trigger system performance
   */
  public async testTimeoutSystem(): Promise<void> {
    console.log('\n=== Timeout/Trigger System Performance ===\n');

    const timeoutCounts = [10, 50, 100, 200];

    for (const count of timeoutCounts) {
      const entity = this.createTestEntity(0, 0);

      for (let i = 0; i < count; i++) {
        entity.addTimeout(
          [100, 200, 300],
          {
            triggered: () => {},
            active: () => {},
            // onLoop: () => {}
          },
          true,
          true
        );
      }

      await this.benchmark.benchmark(
        `Update entity with ${count} timeouts`,
        () => {
          entity.update();
        },
        500
      );
    }
  }

  /**
   * Test hitbox collision detection
   */
  public async testHitboxCollision(): Promise<void> {
    console.log('\n=== Hitbox Collision Detection ===\n');

    const checkCounts = [10, 50, 100];

    for (const count of checkCounts) {
      const physics = new Physics();
      const entities: Bodies.Embodiment[] = [];

      // Create and register entities with collision
      for (let i = 0; i < count; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        const entity = this.createTestEntity(x, y);
        entities.push(entity);

        // Register each entity with collision system
        const collision = new NPCCollision(
          entity,
          C.CollideLayers.npc,
          C.CollideLayers.npc,
          C.CollideTypes.block
        );
        physics.collisionpool.push(collision);
      }

      // Create test entity and register it
      const testEntity = this.createTestEntity(400, 300);
      const testCollision = new NPCCollision(
        testEntity,
        C.CollideLayers.npc,
        C.CollideLayers.npc,
        C.CollideTypes.block
      );
      physics.collisionpool.push(testCollision);

      await this.benchmark.benchmark(
        `Physics collision check ${count} entities`,
        () => {
          physics.refresh();
        },
        100
      );

      await this.benchmark.benchmark(
        `Manual AABB collision ${count} entities`,
        () => {
          for (let i = 0; i < entities.length; i++) {
            const e = entities[i];
            const overlap =
              testEntity.pos.x < e.pos.x + e.hitbox.w &&
              testEntity.pos.x + testEntity.hitbox.w > e.pos.x &&
              testEntity.pos.y < e.pos.y + e.hitbox.h &&
              testEntity.pos.y + testEntity.hitbox.h > e.pos.y;
          }
        },
        100
      );
    }
  }

  /**
   * Test spatial partitioning efficiency
   */
  public async testSpatialPartitioning(): Promise<void> {
    console.log('\n=== Spatial Partitioning Performance ===\n');

    const gridSize = 64;
    const worldSize = 1024;
    const entityCount = 1000;

    const cells: Map<string, Bodies.Embodiment[]> = new Map();

    const entities = [];
    for (let i = 0; i < entityCount; i++) {
      const x = Math.random() * worldSize;
      const y = Math.random() * worldSize;
      entities.push(this.createTestEntity(x, y));
    }

    await this.benchmark.benchmark(
      `Partition ${entityCount} entities into grid`,
      () => {
        cells.clear();

        for (const entity of entities) {
          const cellX = Math.floor(entity.pos.x / gridSize);
          const cellY = Math.floor(entity.pos.y / gridSize);
          const key = `${cellX},${cellY}`;

          if (!cells.has(key)) {
            cells.set(key, []);
          }
          cells.get(key)!.push(entity);
        }
      },
      200
    );

    await this.benchmark.benchmark(
      `Query nearby entities in partitioned grid`,
      () => {
        const queryX = 512;
        const queryY = 512;
        const cellX = Math.floor(queryX / gridSize);
        const cellY = Math.floor(queryY / gridSize);

        const nearby: Bodies.Embodiment[] = [];
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const key = `${cellX + dx},${cellY + dy}`;
            const cellEntities = cells.get(key);
            if (cellEntities) {
              nearby.push(...cellEntities);
            }
          }
        }
      },
      1000
    );
  }

  /**
   * Test entity lifecycle performance
   */
  public async testEntityLifecycle(): Promise<void> {
    console.log('\n=== Entity Lifecycle Performance ===\n');

    this.memory.takeSnapshot('before-entities');

    const createCounts = [100, 500, 1000];

    for (const count of createCounts) {
      await this.benchmark.benchmark(
        `Create ${count} entities`,
        () => {
          const entities: Bodies.Embodiment[] = [];
          for (let i = 0; i < count; i++) {
            entities.push(this.createTestEntity(i, i));
          }
        },
        100
      );

      this.memory.takeSnapshot(`after-${count}-entities`);

      const entities: Bodies.Alacrity[] = [];
      for (let i = 0; i < count; i++) {
        entities.push(this.createTestEntity(i, i));
      }

      await this.benchmark.benchmark(
        `Destroy ${count} entities`,
        () => {
          for (const entity of entities) {
            entity.destroy();
          }
        },
        100
      );

      await this.benchmark.benchmark(
        `Filter ${count} deleted entities`,
        () => {
          const filtered = entities.filter((e) => !e.delete);
        },
        100
      );
    }

    this.memory.printSnapshot('before-entities');
    for (const count of createCounts) {
      this.memory.printSnapshot(`after-${count}-entities`);
    }
  }

  /**
   * Run all physics performance tests
   */
  public async runAll(): Promise<void> {
    console.log('Starting Physics Performance Tests...');

    await this.testEntityUpdates();
    await this.testMovementReset();
    await this.testTimeoutSystem();
    await this.testHitboxCollision();
    // await this.testCollisionGrid();
    await this.testSpatialPartitioning();
    await this.testPhysicsRefresh();
    await this.testEntityLifecycle();

    this.benchmark.printResults();

    console.log('\nExporting results to JSON...');
    const json = this.benchmark.exportJSON();
    console.log(json);
  }
}
