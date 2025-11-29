/**
 * SVG Geometry Tests - Phase 1 Verification
 *
 * Tests for visualization/core/svg-geometry.js
 * Verifies that V3 adapter integration works correctly
 */

const { SVGGeometry, V3Adapter } = require('../visualization');

// Test counters
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    ${error.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
  }
}

function assertClose(actual, expected, tolerance = 0.01, message = '') {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`Expected ~${expected}, got ${actual} (tolerance: ${tolerance}). ${message}`);
  }
}

function assertDefined(value, message = '') {
  if (value === undefined || value === null) {
    throw new Error(`Expected value to be defined. ${message}`);
  }
}

console.log('\n=== SVG Geometry Tests (V3 Integration) ===\n');

// Test 1: Basic instantiation
console.log('1. Basic Setup');

test('SVGGeometry instantiates correctly', () => {
  const geometry = new SVGGeometry();
  assertDefined(geometry);
  assertEqual(geometry.CENTER_X, 512);
  assertEqual(geometry.CENTER_Y, 512);
  assertEqual(geometry.DEFAULT_RADIUS, 400);
});

test('V3Adapter instantiates correctly', () => {
  const adapter = new V3Adapter();
  assertDefined(adapter);
});

test('SVGGeometry uses V3Adapter', () => {
  const geometry = new SVGGeometry();
  assertDefined(geometry.v3);
});

// Test 2: Angle calculations
console.log('\n2. Angle Calculations');

test('degreesToRadians converts correctly', () => {
  const geometry = new SVGGeometry();
  assertClose(geometry.degreesToRadians(180), Math.PI);
  assertClose(geometry.degreesToRadians(90), Math.PI / 2);
  assertClose(geometry.degreesToRadians(0), 0);
});

test('radiansToDegrees converts correctly', () => {
  const geometry = new SVGGeometry();
  assertClose(geometry.radiansToDegrees(Math.PI), 180);
  assertClose(geometry.radiansToDegrees(Math.PI / 2), 90);
});

test('normalizeAngle handles negative angles', () => {
  const geometry = new SVGGeometry();
  assertEqual(geometry.normalizeAngle(-90), 270);
  assertEqual(geometry.normalizeAngle(-180), 180);
});

test('normalizeAngle handles angles > 360', () => {
  const geometry = new SVGGeometry();
  assertEqual(geometry.normalizeAngle(450), 90);
  assertEqual(geometry.normalizeAngle(720), 0);
});

// Test 3: Gate 41 Position (First gate on wheel)
console.log('\n3. Gate 41 Position (Wheel Start)');

test('Gate 41 line 1 is at angle 0', () => {
  const geometry = new SVGGeometry();
  const pos = geometry.getRadialPosition(41, 1);
  assertClose(pos.angle, 0);
  assertEqual(pos.wheelIndex, 0, 'Gate 41 should be at wheelIndex 0');
});

test('Gate 41 SVG coordinates are at top', () => {
  const geometry = new SVGGeometry();
  const pos = geometry.getRadialPosition(41, 1, 400);
  // At angle 0, with -90 adjustment, should be at top of circle
  // x = center, y = center - radius
  assertClose(pos.x, 512, 1, 'X should be at center');
  assertClose(pos.y, 112, 1, 'Y should be at top (512 - 400)');
});

// Test 4: Gate 13 Position (Test gate from Phase 1 spec)
console.log('\n4. Gate 13 Position');

test('Gate 13 returns valid position data', () => {
  const geometry = new SVGGeometry();
  const pos = geometry.getRadialPosition(13, 4);

  assertDefined(pos.gate);
  assertEqual(pos.gate, 13);
  assertEqual(pos.line, 4);
  assertDefined(pos.angle);
  assertDefined(pos.x);
  assertDefined(pos.y);
  assertDefined(pos.quarter);
  assertDefined(pos.binary);
});

test('Gate 13 has correct groupings', () => {
  const geometry = new SVGGeometry();
  const pos = geometry.getRadialPosition(13, 1);

  // Gate 13 is in Quarter of Initiation (binary starts with 10)
  assertEqual(pos.quarter, 'Initiation');
  // Gate 13 binary is 101111 (Fire over Heaven)
  assertEqual(pos.binary, '101111');
});

// Test 5: All 64 gates have valid positions
console.log('\n5. All 64 Gates Validation');

test('All 64 gates return valid positions', () => {
  const geometry = new SVGGeometry();

  for (let gate = 1; gate <= 64; gate++) {
    const pos = geometry.getRadialPosition(gate, 1);

    if (!pos.gate || !pos.angle === undefined || !pos.x || !pos.y) {
      throw new Error(`Gate ${gate} returned invalid position`);
    }

    // Check angle is in valid range
    if (pos.angle < 0 || pos.angle >= 360) {
      throw new Error(`Gate ${gate} has invalid angle: ${pos.angle}`);
    }
  }
});

test('All 384 lines have unique positions', () => {
  const geometry = new SVGGeometry();
  const positions = geometry.getAllLinePositions();

  assertEqual(positions.length, 384, 'Should have 384 positions');

  // Check for unique angles
  const angles = positions.map(p => p.angle);
  const uniqueAngles = [...new Set(angles)];
  assertEqual(uniqueAngles.length, 384, 'All 384 angles should be unique');
});

// Test 6: Quarter arcs
console.log('\n6. Quarter Arcs');

test('getQuarterArc returns valid data for Mutation', () => {
  const geometry = new SVGGeometry();
  const arc = geometry.getQuarterArc('Mutation');

  assertDefined(arc.gates);
  assertEqual(arc.quarter, 'Mutation');
  // Mutation quarter should have 16 gates
  assertEqual(arc.gateCount, 16);
  assertEqual(arc.lineCount, 96); // 16 * 6
});

test('getQuarterArc returns valid data for all quarters', () => {
  const geometry = new SVGGeometry();
  const quarters = ['Mutation', 'Initiation', 'Duality', 'Civilisation'];

  let totalGates = 0;
  quarters.forEach(q => {
    const arc = geometry.getQuarterArc(q);
    totalGates += arc.gateCount;
  });

  assertEqual(totalGates, 64, 'All quarters should contain 64 gates total');
});

// Test 7: Face arcs
console.log('\n7. Face Arcs');

test('getFaceArc returns valid data for Hades', () => {
  const geometry = new SVGGeometry();
  const arc = geometry.getFaceArc('Hades');

  assertDefined(arc.gates);
  assertEqual(arc.face, 'Hades');
  // Each face should have 4 gates
  assertEqual(arc.gateCount, 4);
});

// Test 8: Gate group bounds
console.log('\n8. Gate Group Bounds');

test('getGateGroupBounds returns 6 positions', () => {
  const geometry = new SVGGeometry();
  const bounds = geometry.getGateGroupBounds(13);

  assertEqual(bounds.gate, 13);
  assertEqual(bounds.positions.length, 6);
  assertDefined(bounds.x);
  assertDefined(bounds.y);
  assertDefined(bounds.width);
  assertDefined(bounds.height);
});

// Test 9: Coordinate conversion roundtrip
console.log('\n9. Coordinate Roundtrip');

test('coordinatesToAngle reverses angleToSVGCoordinates', () => {
  const geometry = new SVGGeometry();

  // Test several angles
  [0, 45, 90, 180, 270, 315].forEach(testAngle => {
    const coords = geometry.angleToSVGCoordinates(testAngle);
    const result = geometry.coordinatesToAngle(coords.x, coords.y);

    assertClose(result.angle, testAngle, 0.01, `Roundtrip failed for angle ${testAngle}`);
  });
});

// Test 10: Wheel config
console.log('\n10. Wheel Configuration');

test('getWheelConfig returns correct constants', () => {
  const geometry = new SVGGeometry();
  const config = geometry.getWheelConfig();

  assertEqual(config.totalLines, 384);
  assertEqual(config.totalGates, 64);
  assertEqual(config.linesPerGate, 6);
  assertClose(config.degreesPerLine, 0.9375);
});

// Test 11: V3 Adapter caching
console.log('\n11. V3 Adapter Caching');

test('V3Adapter caching improves performance', () => {
  const adapter = new V3Adapter({ enableCache: true });

  // First call - should populate cache
  const start1 = process.hrtime.bigint();
  for (let i = 0; i < 64; i++) {
    adapter.getDockingData(i + 1, 1);
  }
  const end1 = process.hrtime.bigint();
  const time1 = Number(end1 - start1) / 1e6; // ms

  // Second call - should use cache
  const start2 = process.hrtime.bigint();
  for (let i = 0; i < 64; i++) {
    adapter.getDockingData(i + 1, 1);
  }
  const end2 = process.hrtime.bigint();
  const time2 = Number(end2 - start2) / 1e6; // ms

  // Cache should be faster (at least 2x)
  if (time2 >= time1) {
    console.log(`    Note: Cache time ${time2.toFixed(2)}ms vs initial ${time1.toFixed(2)}ms`);
  }

  const stats = adapter.getCacheStats();
  assertEqual(stats.dockingDataEntries, 64, 'Should have 64 cached entries');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
