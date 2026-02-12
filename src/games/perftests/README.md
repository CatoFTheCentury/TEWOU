# TEWOU Engine Performance Tests

Comprehensive performance testing suite for the TEWOU game engine. These tests measure and benchmark critical engine components to identify bottlenecks and track performance over time.

## Test Suites

### 1. Render Performance Tests (`render-performance.ts`)

Tests the rendering pipeline and WebGL operations:

- **Frame Composition**: Measure performance with varying numbers of layers (10-500)
- **Resolution Scaling**: Test rendering at VGA, HD, and Full HD resolutions
- **Rectangle Rendering**: Benchmark drawing 100-2000 rectangles
- **Text Rendering**: Test text object rendering performance
- **Shader Switching**: Measure shader program switching overhead
- **GL Clear Operations**: Benchmark clear operations with and without depth
- **Snap Composition**: Test sprite frame composition with multiple parts
- **Memory Usage**: Track memory consumption during rendering

### 2. Physics Performance Tests (`physics-performance.ts`)

Tests physics simulation and collision detection:

- **Entity Updates**: Benchmark updating 10-1000 entities
- **Movement Reset**: Test movement vector reset operations
- **Timeout System**: Measure performance of the timeout/trigger system
- **Hitbox Collision**: Test collision detection against multiple entities
- **Collision Grid**: Benchmark grid-based collision detection
- **Spatial Partitioning**: Test entity partitioning and queries
- **Physics Refresh**: Measure physics system refresh with multiple entities
- **Entity Lifecycle**: Track creation, destruction, and filtering performance

### 3. Parser Performance Tests (`parser-performance.ts`)

Tests file parsing and data processing:

- **GANI Parser**: Benchmark animation file parsing with varying complexity
- **INI Parser**: Test configuration file parsing
- **JSON/Tiled Parser**: Measure tilemap JSON parsing performance
- **String Operations**: Test string splitting, trimming, and regex matching
- **Number Parsing**: Compare parseInt, parseFloat, Number(), and unary +
- **CSV Parsing**: Benchmark CSV data parsing at different sizes
- **Array Building**: Compare different array construction methods

### 4. Asset Performance Tests (`asset-performance.ts`)

Tests asset loading and texture management:

- **Texture Creation**: Benchmark texture creation at sizes from 64x64 to 1024x1024
- **Batch Texture Creation**: Test loading multiple textures
- **Texture Upload**: Measure GPU upload performance
- **Texture Filtering**: Compare NEAREST, LINEAR, and MIPMAP filtering
- **Data URL Images**: Test data URL image creation and loading
- **Canvas to Texture**: Benchmark canvas-to-texture pipeline
- **Texture Caching**: Compare cached vs uncached texture retrieval
- **Memory Usage**: Track memory consumption during asset loading

## Usage

### Compiling the Tests

First, compile the TypeScript tests using webpack:

```bash
cd src/games/perftests
npx webpack
```

This will generate `index.js` containing all the bundled tests.

### Running Tests in Browser

Open [test-runner.html](test-runner.html) in your browser. The HTML page provides a beautiful interface with buttons to:
- Run all tests
- Run individual test suites (Render, Physics, Parser, Asset)
- Export results to a text file

### Running Tests Programmatically

```typescript
import { PerformanceTestRunner } from './games/perftests';

const runner = new PerformanceTestRunner();
await runner.runAll();
```

### Running Specific Test Suites

```typescript
import { PerformanceTestRunner } from './games/perftests';

const runner = new PerformanceTestRunner();

// Run only render tests
await runner.runSuite('Render');

// Run only physics tests
await runner.runSuite('Physics');

// Run only parser tests
await runner.runSuite('Parser');

// Run only asset tests
await runner.runSuite('Asset');
```

### Running Individual Tests

```typescript
import { RenderPerformanceTests } from './games/perftests/render-performance';

const tests = new RenderPerformanceTests();
await tests.testFrameComposition();
await tests.testRectangleRendering();
```

## Understanding Results

### Benchmark Metrics

Each benchmark reports:

- **Avg**: Average execution time in milliseconds
- **Min**: Fastest execution time
- **Max**: Slowest execution time
- **Ops/sec**: Operations per second (higher is better)

### Performance Targets

General performance targets for the engine:

- **Frame Composition**: < 5ms for 100 layers
- **Entity Updates**: < 10ms for 500 entities
- **Collision Detection**: < 5ms for 1000 collision checks
- **Texture Creation**: < 10ms for 512x512 texture
- **Parser Operations**: < 20ms for typical game files

### Memory Profiling

Memory snapshots track heap usage. Look for:

- Memory leaks (memory not freed after operations)
- Excessive allocations (more than expected for operation)
- Gradual memory growth over repeated operations

## Best Practices

1. **Run in Production Mode**: Compile with optimizations enabled
2. **Close Other Apps**: Minimize background processes
3. **Multiple Runs**: Run tests multiple times for consistency
4. **Baseline Comparison**: Save results to compare against future changes
5. **Browser Testing**: Test in target browsers (Chrome, Firefox, Safari)

## Interpreting Results

### Good Performance
- Consistent frame times (< 16.67ms for 60 FPS)
- Linear scaling with entity count
- Minimal garbage collection pauses
- Stable memory usage

### Performance Issues
- Irregular frame times or stuttering
- Non-linear performance degradation
- Frequent GC pauses
- Growing memory usage over time

## Continuous Performance Testing

Export results to JSON for tracking over time:

```typescript
const runner = new PerformanceTestRunner();
await runner.runAll();

// Results are automatically exported as JSON
// Save to file for historical comparison
```

## Contributing

When adding new engine features:

1. Add corresponding performance tests
2. Run full test suite before and after changes
3. Document any performance impacts
4. Update performance targets if needed

## License

Same as TEWOU engine (GPL-3.0-only)
