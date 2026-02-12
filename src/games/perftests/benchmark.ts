/**
 * Performance benchmarking utilities for TEWOU engine
 */

export interface BenchmarkResult {
  name: string;
  avgTime: number;
  minTime: number;
  maxTime: number;
  iterations: number;
  opsPerSecond: number;
  samples: number[];
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  drawCalls: number;
  entities: number;
  memoryUsed?: number;
}

export class PerformanceBenchmark {
  private results: Map<string, BenchmarkResult> = new Map();

  /**
   * Benchmark a synchronous function
   */
  public async benchmark(
    name: string,
    fn: () => void,
    iterations: number = 1000
  ): Promise<BenchmarkResult> {
    const samples: number[] = [];

    // Warmup
    for (let i = 0; i < 10; i++) {
      fn();
    }

    // Actual benchmark
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      fn();
      const end = performance.now();
      samples.push(end - start);
    }

    const avgTime = samples.reduce((a, b) => a + b, 0) / samples.length;
    const minTime = Math.min(...samples);
    const maxTime = Math.max(...samples);
    const opsPerSecond = 1000 / avgTime;

    const result: BenchmarkResult = {
      name,
      avgTime,
      minTime,
      maxTime,
      iterations,
      opsPerSecond,
      samples
    };

    this.results.set(name, result);
    return result;
  }

  /**
   * Benchmark an asynchronous function
   */
  public async benchmarkAsync(
    name: string,
    fn: () => Promise<void>,
    iterations: number = 100
  ): Promise<BenchmarkResult> {
    const samples: number[] = [];

    // Warmup
    for (let i = 0; i < 5; i++) {
      await fn();
    }

    // Actual benchmark
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      samples.push(end - start);
    }

    const avgTime = samples.reduce((a, b) => a + b, 0) / samples.length;
    const minTime = Math.min(...samples);
    const maxTime = Math.max(...samples);
    const opsPerSecond = 1000 / avgTime;

    const result: BenchmarkResult = {
      name,
      avgTime,
      minTime,
      maxTime,
      iterations,
      opsPerSecond,
      samples
    };

    this.results.set(name, result);
    return result;
  }

  /**
   * Measure frame rate over a period of time
   */
  public async measureFPS(
    renderFn: () => void,
    durationMs: number = 1000
  ): Promise<PerformanceMetrics> {
    const frames: number[] = [];
    const startTime = performance.now();
    let frameCount = 0;
    let lastFrameTime = startTime;

    return new Promise((resolve) => {
      const measureFrame = () => {
        const now = performance.now();
        const deltaTime = now - lastFrameTime;
        frames.push(deltaTime);
        lastFrameTime = now;
        frameCount++;

        renderFn();

        if (now - startTime < durationMs) {
          requestAnimationFrame(measureFrame);
        } else {
          const avgFrameTime = frames.reduce((a, b) => a + b, 0) / frames.length;
          const fps = 1000 / avgFrameTime;

          resolve({
            fps,
            frameTime: avgFrameTime,
            drawCalls: 0,
            entities: 0
          });
        }
      };

      requestAnimationFrame(measureFrame);
    });
  }

  /**
   * Get all benchmark results
   */
  public getResults(): Map<string, BenchmarkResult> {
    return this.results;
  }

  /**
   * Print results to console
   */
  public printResults(): void {
    console.log('\n=== Performance Benchmark Results ===\n');

    for (const [name, result] of this.results) {
      console.log(`${name}:`);
      console.log(`  Avg: ${result.avgTime.toFixed(3)}ms`);
      console.log(`  Min: ${result.minTime.toFixed(3)}ms`);
      console.log(`  Max: ${result.maxTime.toFixed(3)}ms`);
      console.log(`  Ops/sec: ${result.opsPerSecond.toFixed(0)}`);
      console.log('');
    }
  }

  /**
   * Export results as JSON
   */
  public exportJSON(): string {
    const resultsArray = Array.from(this.results.entries()).map(([name, result]) => ({
      name,
      avgTime: result.avgTime,
      minTime: result.minTime,
      maxTime: result.maxTime,
      iterations: result.iterations,
      opsPerSecond: result.opsPerSecond
      // samples array excluded from export
    }));

    return JSON.stringify(resultsArray, null, 2);
  }

  /**
   * Compare two benchmark results
   */
  public compare(baseline: string, current: string): void {
    const baselineResult = this.results.get(baseline);
    const currentResult = this.results.get(current);

    if (!baselineResult || !currentResult) {
      console.error('Cannot compare: one or both results not found');
      return;
    }

    const diff = ((currentResult.avgTime - baselineResult.avgTime) / baselineResult.avgTime) * 100;
    const improvement = diff < 0;

    console.log(`\nComparison: ${baseline} vs ${current}`);
    console.log(`Difference: ${Math.abs(diff).toFixed(2)}% ${improvement ? 'faster' : 'slower'}`);
  }
}

/**
 * Memory profiler utility
 */
export class MemoryProfiler {
  private snapshots: Map<string, number> = new Map();

  public takeSnapshot(label: string): void {
    if (performance.memory) {
      this.snapshots.set(label, performance.memory.usedJSHeapSize);
    }
  }

  public compare(before: string, after: string): number {
    const beforeMem = this.snapshots.get(before);
    const afterMem = this.snapshots.get(after);

    if (beforeMem === undefined || afterMem === undefined) {
      console.error('Cannot compare: one or both snapshots not found');
      return 0;
    }

    return afterMem - beforeMem;
  }

  public printSnapshot(label: string): void {
    const mem = this.snapshots.get(label);
    if (mem !== undefined) {
      console.log(`${label}: ${(mem / 1024 / 1024).toFixed(2)} MB`);
    }
  }

  public getAllSnapshots(): Map<string, number> {
    return this.snapshots;
  }
}
