/**
 * Asset loading performance tests for TEWOU engine
 * Tests image loading, texture creation, audio loading, and text file loading
 */

import { PerformanceBenchmark, MemoryProfiler } from './benchmark';
import { Assets, Render } from '../../engine/source';
import Textures from '../../engine/source/render/textures';

export class AssetPerformanceTests {
  private benchmark: PerformanceBenchmark;
  private memory: MemoryProfiler;
  private canvas: HTMLCanvasElement;
  private glContext: Render.GLContext;

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
  }

  /**
   * Create test image data
   */
  private createTestImageData(width: number, height: number): HTMLImageElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const imageData = ctx.createImageData(width, height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = Math.random() * 255;
      imageData.data[i + 1] = Math.random() * 255;
      imageData.data[i + 2] = Math.random() * 255;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  /**
   * Test texture creation performance with different sizes
   */
  public async testTextureCreation(): Promise<void> {
    console.log('\n=== Texture Creation Performance ===\n');

    const textureSizes = [
      { w: 64, h: 64 },
      { w: 128, h: 128 },
      { w: 256, h: 256 },
      { w: 512, h: 512 },
      { w: 1024, h: 1024 }
    ];

    for (const size of textureSizes) {
      const img = this.createTestImageData(size.w, size.h);

      await new Promise(resolve => {
        img.onload = resolve;
      });

      this.memory.takeSnapshot(`before-tex-${size.w}x${size.h}`);

      await this.benchmark.benchmark(
        `Create ${size.w}x${size.h} texture`,
        () => {
          const tex = Textures.createTexture(this.glContext, img);
          this.glContext.gl.deleteTexture(tex);
        },
        100
      );

      this.memory.takeSnapshot(`after-tex-${size.w}x${size.h}`);

      const memUsed = this.memory.compare(
        `before-tex-${size.w}x${size.h}`,
        `after-tex-${size.w}x${size.h}`
      );
      console.log(`  Memory used: ${(memUsed / 1024 / 1024).toFixed(2)} MB`);
    }
  }

  /**
   * Test batch texture creation
   */
  public async testBatchTextureCreation(): Promise<void> {
    console.log('\n=== Batch Texture Creation Performance ===\n');

    const batchSizes = [10, 50, 100];
    const textureSize = { w: 128, h: 128 };

    for (const count of batchSizes) {
      const images: HTMLImageElement[] = [];

      for (let i = 0; i < count; i++) {
        const img = this.createTestImageData(textureSize.w, textureSize.h);
        images.push(img);
      }

      await Promise.all(
        images.map(
          img =>
            new Promise(resolve => {
              img.onload = resolve;
            })
        )
      );

      this.memory.takeSnapshot(`before-batch-${count}`);

      await this.benchmark.benchmark(
        `Create ${count} textures (${textureSize.w}x${textureSize.h})`,
        () => {
          const textures: WebGLTexture[] = [];
          for (const img of images) {
            textures.push(Textures.createTexture(this.glContext, img));
          }

          for (const tex of textures) {
            this.glContext.gl.deleteTexture(tex);
          }
        },
        10
      );

      this.memory.takeSnapshot(`after-batch-${count}`);

      const memUsed = this.memory.compare(`before-batch-${count}`, `after-batch-${count}`);
      console.log(`  Memory used: ${(memUsed / 1024 / 1024).toFixed(2)} MB`);
    }
  }

  /**
   * Test texture upload to GPU
   */
  public async testTextureUpload(): Promise<void> {
    console.log('\n=== Texture Upload Performance ===\n');

    const textureSizes = [
      { w: 128, h: 128 },
      { w: 256, h: 256 },
      { w: 512, h: 512 }
    ];

    for (const size of textureSizes) {
      const img = this.createTestImageData(size.w, size.h);

      await new Promise(resolve => {
        img.onload = resolve;
      });

      await this.benchmark.benchmark(
        `Upload ${size.w}x${size.h} to GPU`,
        () => {
          const tex = this.glContext.gl.createTexture();
          this.glContext.gl.bindTexture(this.glContext.gl.TEXTURE_2D, tex);
          this.glContext.gl.texImage2D(
            this.glContext.gl.TEXTURE_2D,
            0,
            this.glContext.gl.RGBA,
            this.glContext.gl.RGBA,
            this.glContext.gl.UNSIGNED_BYTE,
            img
          );
          this.glContext.gl.deleteTexture(tex);
        },
        100
      );
    }
  }

  /**
   * Test different texture filtering modes
   */
  public async testTextureFiltering(): Promise<void> {
    console.log('\n=== Texture Filtering Performance ===\n');

    const img = this.createTestImageData(256, 256);

    await new Promise(resolve => {
      img.onload = resolve;
    });

    const filterModes = [
      { name: 'NEAREST', min: 'NEAREST', mag: 'NEAREST' },
      { name: 'LINEAR', min: 'LINEAR', mag: 'LINEAR' },
      { name: 'MIPMAP_NEAREST', min: 'NEAREST_MIPMAP_NEAREST', mag: 'NEAREST' },
      { name: 'MIPMAP_LINEAR', min: 'LINEAR_MIPMAP_LINEAR', mag: 'LINEAR' }
    ];

    for (const mode of filterModes) {
      await this.benchmark.benchmark(
        `Create texture with ${mode.name} filtering`,
        () => {
          const tex = this.glContext.gl.createTexture();
          this.glContext.gl.bindTexture(this.glContext.gl.TEXTURE_2D, tex);
          this.glContext.gl.texImage2D(
            this.glContext.gl.TEXTURE_2D,
            0,
            this.glContext.gl.RGBA,
            this.glContext.gl.RGBA,
            this.glContext.gl.UNSIGNED_BYTE,
            img
          );

          this.glContext.gl.texParameteri(
            this.glContext.gl.TEXTURE_2D,
            this.glContext.gl.TEXTURE_MIN_FILTER,
            this.glContext.gl[mode.min as keyof WebGLRenderingContext] as number
          );
          this.glContext.gl.texParameteri(
            this.glContext.gl.TEXTURE_2D,
            this.glContext.gl.TEXTURE_MAG_FILTER,
            this.glContext.gl[mode.mag as keyof WebGLRenderingContext] as number
          );

          if (mode.name.includes('MIPMAP')) {
            this.glContext.gl.generateMipmap(this.glContext.gl.TEXTURE_2D);
          }

          this.glContext.gl.deleteTexture(tex);
        },
        50
      );
    }
  }

  /**
   * Test data URL image creation
   */
  public async testDataUrlImages(): Promise<void> {
    console.log('\n=== Data URL Image Performance ===\n');

    const sizes = [
      { w: 64, h: 64 },
      { w: 128, h: 128 },
      { w: 256, h: 256 }
    ];

    for (const size of sizes) {
      const canvas = document.createElement('canvas');
      canvas.width = size.w;
      canvas.height = size.h;
      const ctx = canvas.getContext('2d')!;

      const imageData = ctx.createImageData(size.w, size.h);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 255;
        imageData.data[i + 1] = 0;
        imageData.data[i + 2] = 0;
        imageData.data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);

      await this.benchmark.benchmark(
        `Create ${size.w}x${size.h} data URL`,
        () => {
          canvas.toDataURL();
        },
        100
      );

      const dataUrl = canvas.toDataURL();

      await this.benchmark.benchmarkAsync(
        `Load ${size.w}x${size.h} from data URL`,
        async () => {
          const img = new Image();
          img.src = dataUrl;
          await img.decode();
        },
        50
      );
    }
  }

  /**
   * Test canvas-to-texture pipeline
   */
  public async testCanvasToTexture(): Promise<void> {
    console.log('\n=== Canvas to Texture Pipeline ===\n');

    const sizes = [
      { w: 128, h: 128 },
      { w: 256, h: 256 },
      { w: 512, h: 512 }
    ];

    for (const size of sizes) {
      const canvas = document.createElement('canvas');
      canvas.width = size.w;
      canvas.height = size.h;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, size.w, size.h);

      await this.benchmark.benchmark(
        `Canvas (${size.w}x${size.h}) to texture`,
        () => {
          const tex = this.glContext.gl.createTexture();
          this.glContext.gl.bindTexture(this.glContext.gl.TEXTURE_2D, tex);
          this.glContext.gl.texImage2D(
            this.glContext.gl.TEXTURE_2D,
            0,
            this.glContext.gl.RGBA,
            this.glContext.gl.RGBA,
            this.glContext.gl.UNSIGNED_BYTE,
            canvas
          );
          this.glContext.gl.deleteTexture(tex);
        },
        100
      );
    }
  }

  /**
   * Test texture cache performance
   */
  public async testTextureCaching(): Promise<void> {
    console.log('\n=== Texture Caching Performance ===\n');

    const img = this.createTestImageData(256, 256);
    await new Promise(resolve => {
      img.onload = resolve;
    });

    const textureCache: Map<string, WebGLTexture> = new Map();

    await this.benchmark.benchmark(
      'Create texture without cache',
      () => {
        const tex = Textures.createTexture(this.glContext, img);
        this.glContext.gl.deleteTexture(tex);
      },
      200
    );

    const cachedTex = Textures.createTexture(this.glContext, img);
    textureCache.set('test-texture', cachedTex);

    await this.benchmark.benchmark(
      'Retrieve texture from cache',
      () => {
        const tex = textureCache.get('test-texture');
      },
      1000
    );

    this.glContext.gl.deleteTexture(cachedTex);
  }

  /**
   * Test memory usage during asset loading
   */
  public async testAssetLoadingMemory(): Promise<void> {
    console.log('\n=== Asset Loading Memory Usage ===\n');

    this.memory.takeSnapshot('before-assets');

    const textures: WebGLTexture[] = [];
    for (let i = 0; i < 50; i++) {
      const img = this.createTestImageData(128, 128);
      await new Promise(resolve => {
        img.onload = resolve;
      });

      textures.push(Textures.createTexture(this.glContext, img));
    }

    this.memory.takeSnapshot('after-50-textures');

    for (const tex of textures) {
      this.glContext.gl.deleteTexture(tex);
    }

    this.memory.takeSnapshot('after-cleanup');

    this.memory.printSnapshot('before-assets');
    this.memory.printSnapshot('after-50-textures');
    this.memory.printSnapshot('after-cleanup');

    const memUsed = this.memory.compare('before-assets', 'after-50-textures');
    console.log(`Total memory for 50 textures: ${(memUsed / 1024 / 1024).toFixed(2)} MB`);
  }

  /**
   * Run all asset loading performance tests
   */
  public async runAll(): Promise<void> {
    console.log('Starting Asset Loading Performance Tests...');

    await this.testTextureCreation();
    await this.testTextureUpload();
    await this.testTextureFiltering();
    await this.testBatchTextureCreation();
    await this.testDataUrlImages();
    await this.testCanvasToTexture();
    await this.testTextureCaching();
    await this.testAssetLoadingMemory();

    this.benchmark.printResults();

    console.log('\nExporting results to JSON...');
    const json = this.benchmark.exportJSON();
    console.log(json);
  }
}
