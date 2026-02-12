/**
 * Main entry point for TEWOU engine performance tests
 * Run all tests or specific test suites
 */

import { RenderPerformanceTests } from './render-performance';
import { PhysicsPerformanceTests } from './physics-performance';
import { ParserPerformanceTests } from './parser-performance';
import { AssetPerformanceTests } from './asset-performance';

export interface TestSuite {
  name: string;
  run: () => Promise<void>;
}

export class PerformanceTestRunner {
  private testSuites: TestSuite[] = [];

  constructor() {
    this.registerSuites();
  }

  private registerSuites(): void {
    this.testSuites.push({
      name: 'Render',
      run: async () => {
        const tests = new RenderPerformanceTests();
        await tests.runAll();
      }
    });

    this.testSuites.push({
      name: 'Physics',
      run: async () => {
        const tests = new PhysicsPerformanceTests();
        await tests.runAll();
      }
    });

    this.testSuites.push({
      name: 'Parser',
      run: async () => {
        const tests = new ParserPerformanceTests();
        await tests.runAll();
      }
    });

    this.testSuites.push({
      name: 'Asset',
      run: async () => {
        const tests = new AssetPerformanceTests();
        await tests.runAll();
      }
    });
  }

  /**
   * Run all test suites
   */
  public async runAll(): Promise<void> {
    console.log('='.repeat(60));
    console.log('TEWOU Engine Performance Test Suite');
    console.log('='.repeat(60));

    const startTime = performance.now();

    for (const suite of this.testSuites) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Running ${suite.name} Performance Tests`);
      console.log('='.repeat(60));

      const suiteStartTime = performance.now();
      await suite.run();
      const suiteEndTime = performance.now();

      console.log(`\n${suite.name} tests completed in ${(suiteEndTime - suiteStartTime).toFixed(2)}ms`);
    }

    const endTime = performance.now();

    console.log('\n' + '='.repeat(60));
    console.log(`All tests completed in ${((endTime - startTime) / 1000).toFixed(2)}s`);
    console.log('='.repeat(60));
  }

  /**
   * Run a specific test suite
   */
  public async runSuite(suiteName: string): Promise<void> {
    const suite = this.testSuites.find(s => s.name.toLowerCase() === suiteName.toLowerCase());

    if (!suite) {
      console.error(`Test suite "${suiteName}" not found`);
      console.log('Available suites:', this.testSuites.map(s => s.name).join(', '));
      return;
    }

    console.log('='.repeat(60));
    console.log(`Running ${suite.name} Performance Tests`);
    console.log('='.repeat(60));

    const startTime = performance.now();
    await suite.run();
    const endTime = performance.now();

    console.log(`\n${suite.name} tests completed in ${(endTime - startTime).toFixed(2)}ms`);
  }

  /**
   * List all available test suites
   */
  public listSuites(): void {
    console.log('Available test suites:');
    for (const suite of this.testSuites) {
      console.log(`  - ${suite.name}`);
    }
  }
}

export {
  RenderPerformanceTests,
  PhysicsPerformanceTests,
  ParserPerformanceTests,
  AssetPerformanceTests
};
