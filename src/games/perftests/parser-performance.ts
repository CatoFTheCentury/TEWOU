/**
 * Parser performance tests for TEWOU engine
 * Tests Tiled map parser, GANI animation parser, and INI parser
 */

import { PerformanceBenchmark, MemoryProfiler } from './benchmark';
import { GaniParser, IniParser } from '../../engine/source';

export class ParserPerformanceTests {
  private benchmark: PerformanceBenchmark;
  private memory: MemoryProfiler;

  constructor() {
    this.benchmark = new PerformanceBenchmark();
    this.memory = new MemoryProfiler();
  }

  /**
   * Generate sample GANI animation data
   */
  private generateGaniData(frameCount: number, partsPerFrame: number): string {
    let gani = `GANI0001\nanimation\n`;

    for (let f = 0; f < frameCount; f++) {
      gani += `SPRITE ${f}\n`;
      for (let p = 0; p < partsPerFrame; p++) {
        gani += `  texture${p}.png ${p * 16} ${p * 16} 16 16 0 0\n`;
      }
    }

    return gani;
  }

  /**
   * Generate sample INI data
   */
  private generateIniData(sectionCount: number, keysPerSection: number): string {
    let ini = '';

    for (let s = 0; s < sectionCount; s++) {
      ini += `[Section${s}]\n`;
      for (let k = 0; k < keysPerSection; k++) {
        ini += `key${k}=value${k}\n`;
      }
      ini += '\n';
    }

    return ini;
  }

  /**
   * Generate sample JSON tilemap data
   */
  private generateTiledData(width: number, height: number, layers: number): string {
    const tilemap: any = {
      width,
      height,
      tilewidth: 16,
      tileheight: 16,
      layers: []
    };

    for (let l = 0; l < layers; l++) {
      const data: number[] = [];
      for (let i = 0; i < width * height; i++) {
        data.push(Math.floor(Math.random() * 100));
      }

      tilemap.layers.push({
        name: `Layer${l}`,
        type: 'tilelayer',
        width,
        height,
        data,
        visible: true,
        opacity: 1
      });
    }

    return JSON.stringify(tilemap);
  }

  /**
   * Test GANI animation parser performance
   */
  public async testGaniParser(): Promise<void> {
    console.log('\n=== GANI Parser Performance ===\n');

    const testCases = [
      { frames: 10, parts: 5 },
      { frames: 20, parts: 10 },
      { frames: 50, parts: 10 },
      { frames: 100, parts: 15 }
    ];

    for (const test of testCases) {
      const ganiData = this.generateGaniData(test.frames, test.parts);

      this.memory.takeSnapshot(`before-gani-${test.frames}f-${test.parts}p`);

      await this.benchmark.benchmark(
        `Parse GANI (${test.frames} frames, ${test.parts} parts/frame)`,
        () => {
          GaniParser.parse(ganiData);
        },
        100
      );

      this.memory.takeSnapshot(`after-gani-${test.frames}f-${test.parts}p`);

      const memUsed = this.memory.compare(
        `before-gani-${test.frames}f-${test.parts}p`,
        `after-gani-${test.frames}f-${test.parts}p`
      );
      console.log(`  Memory used: ${(memUsed / 1024).toFixed(2)} KB`);
    }
  }

  /**
   * Test INI parser performance
   */
  public async testIniParser(): Promise<void> {
    console.log('\n=== INI Parser Performance ===\n');

    const testCases = [
      { sections: 5, keys: 10 },
      { sections: 10, keys: 20 },
      { sections: 20, keys: 30 },
      { sections: 50, keys: 50 }
    ];

    for (const test of testCases) {
      const iniData = this.generateIniData(test.sections, test.keys);

      await this.benchmark.benchmark(
        `Parse INI (${test.sections} sections, ${test.keys} keys/section)`,
        () => {
          IniParser.parse(iniData);
        },
        500
      );
    }
  }

  /**
   * Test JSON parsing performance (for Tiled maps)
   */
  public async testJsonParsing(): Promise<void> {
    console.log('\n=== JSON/Tiled Parser Performance ===\n');

    const testCases = [
      { width: 20, height: 20, layers: 1 },
      { width: 40, height: 40, layers: 3 },
      { width: 50, height: 50, layers: 5 },
      { width: 100, height: 100, layers: 3 }
    ];

    for (const test of testCases) {
      const tiledData = this.generateTiledData(test.width, test.height, test.layers);

      this.memory.takeSnapshot(`before-tiled-${test.width}x${test.height}x${test.layers}`);

      await this.benchmark.benchmark(
        `Parse Tiled JSON (${test.width}x${test.height}, ${test.layers} layers)`,
        () => {
          JSON.parse(tiledData);
        },
        200
      );

      this.memory.takeSnapshot(`after-tiled-${test.width}x${test.height}x${test.layers}`);

      const memUsed = this.memory.compare(
        `before-tiled-${test.width}x${test.height}x${test.layers}`,
        `after-tiled-${test.width}x${test.height}x${test.layers}`
      );
      console.log(`  Memory used: ${(memUsed / 1024).toFixed(2)} KB`);
    }
  }

  /**
   * Test string parsing operations
   */
  public async testStringOperations(): Promise<void> {
    console.log('\n=== String Parsing Operations ===\n');

    const testString = this.generateGaniData(50, 10);

    await this.benchmark.benchmark(
      'String split by newline',
      () => {
        testString.split('\n');
      },
      1000
    );

    await this.benchmark.benchmark(
      'String split and trim',
      () => {
        testString.split('\n').map(line => line.trim());
      },
      1000
    );

    await this.benchmark.benchmark(
      'String match with regex',
      () => {
        const regex = /SPRITE\s+(\d+)/g;
        let match;
        while ((match = regex.exec(testString)) !== null) {
          const frameNum = match[1];
        }
      },
      1000
    );

    await this.benchmark.benchmark(
      'String indexOf operations',
      () => {
        const lines = testString.split('\n');
        for (const line of lines) {
          if (line.indexOf('SPRITE') !== -1) {
            const parts = line.split(' ');
          }
        }
      },
      500
    );
  }

  /**
   * Test number parsing performance
   */
  public async testNumberParsing(): Promise<void> {
    console.log('\n=== Number Parsing Performance ===\n');

    const numberStrings = Array.from({ length: 1000 }, (_, i) => `${Math.random() * 1000}`);

    await this.benchmark.benchmark(
      'parseInt on 1000 numbers',
      () => {
        for (const str of numberStrings) {
          parseInt(str);
        }
      },
      500
    );

    await this.benchmark.benchmark(
      'parseFloat on 1000 numbers',
      () => {
        for (const str of numberStrings) {
          parseFloat(str);
        }
      },
      500
    );

    await this.benchmark.benchmark(
      'Number() on 1000 numbers',
      () => {
        for (const str of numberStrings) {
          Number(str);
        }
      },
      500
    );

    await this.benchmark.benchmark(
      'Unary + on 1000 numbers',
      () => {
        for (const str of numberStrings) {
          +str;
        }
      },
      500
    );
  }

  /**
   * Test CSV parsing performance
   */
  public async testCsvParsing(): Promise<void> {
    console.log('\n=== CSV Parsing Performance ===\n');

    const csvSizes = [
      { rows: 10, cols: 10 },
      { rows: 50, cols: 50 },
      { rows: 100, cols: 100 },
      { rows: 200, cols: 200 }
    ];

    for (const size of csvSizes) {
      let csv = '';
      for (let r = 0; r < size.rows; r++) {
        const row = Array.from({ length: size.cols }, () => Math.floor(Math.random() * 100));
        csv += row.join(',') + '\n';
      }

      await this.benchmark.benchmark(
        `Parse CSV (${size.rows}x${size.cols})`,
        () => {
          const rows = csv.split('\n');
          const data: number[][] = [];
          for (const row of rows) {
            if (row.trim()) {
              data.push(row.split(',').map(v => parseInt(v)));
            }
          }
        },
        100
      );
    }
  }

  /**
   * Test array building performance (common in parsers)
   */
  public async testArrayBuilding(): Promise<void> {
    console.log('\n=== Array Building Performance ===\n');

    const sizes = [100, 500, 1000, 5000];

    for (const size of sizes) {
      await this.benchmark.benchmark(
        `Build array with push (${size} items)`,
        () => {
          const arr: number[] = [];
          for (let i = 0; i < size; i++) {
            arr.push(i);
          }
        },
        500
      );

      await this.benchmark.benchmark(
        `Build array with index (${size} items)`,
        () => {
          const arr: number[] = [];
          for (let i = 0; i < size; i++) {
            arr[i] = i;
          }
        },
        500
      );

      await this.benchmark.benchmark(
        `Build array with map (${size} items)`,
        () => {
          Array.from({ length: size }, (_, i) => i);
        },
        500
      );
    }
  }

  /**
   * Run all parser performance tests
   */
  public async runAll(): Promise<void> {
    console.log('Starting Parser Performance Tests...');

    await this.testStringOperations();
    await this.testNumberParsing();
    await this.testArrayBuilding();
    await this.testCsvParsing();
    await this.testGaniParser();
    await this.testIniParser();
    await this.testJsonParsing();

    this.benchmark.printResults();

    console.log('\nExporting results to JSON...');
    const json = this.benchmark.exportJSON();
    console.log(json);
  }
}
