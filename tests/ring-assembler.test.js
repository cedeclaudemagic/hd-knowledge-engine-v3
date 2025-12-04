/**
 * Ring Assembler Tests
 *
 * Tests for visualization/generators/ring-assembler.js
 * Verifies:
 * 1. Gap calculations between rings
 * 2. Center alignment after transforms
 * 3. ViewBox precision
 * 4. Scale factor consistency
 * 5. Visual bounds calculations
 */

const assembler = require('../visualization/generators/ring-assembler');

// Test counters
let passed = 0;
let failed = 0;
const errors = [];

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    ${error.message}`);
    errors.push({ name, error: error.message });
    failed++;
  }
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
  }
}

function assertAlmostEqual(actual, expected, tolerance = 0.0001, message = '') {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`Expected ${expected} (±${tolerance}), got ${actual}. Diff: ${Math.abs(actual - expected)}. ${message}`);
  }
}

function assertTrue(value, message = '') {
  if (value !== true) {
    throw new Error(`Expected true, got ${value}. ${message}`);
  }
}

function assertDefined(value, message = '') {
  if (value === undefined || value === null) {
    throw new Error(`Expected value to be defined. ${message}`);
  }
}

console.log('\n' + '═'.repeat(60));
console.log('RING ASSEMBLER TESTS');
console.log('═'.repeat(60));

// ============================================================================
// 1. RING GEOMETRIES TESTS
// ============================================================================
console.log('\n1. Ring Geometries');
console.log('─'.repeat(40));

test('RING_GEOMETRIES contains all expected rings', () => {
  const geoms = assembler.RING_GEOMETRIES;
  assertDefined(geoms.numbers, 'numbers geometry');
  assertDefined(geoms.hexagrams, 'hexagrams geometry');
  assertDefined(geoms.codons, 'codons geometry');
});

test('Each geometry has required properties', () => {
  const required = ['center', 'innerRadius', 'outerRadius', 'visualInner', 'visualOuter', 'bandWidth'];

  for (const [name, geom] of Object.entries(assembler.RING_GEOMETRIES)) {
    for (const prop of required) {
      assertDefined(geom[prop], `${name}.${prop}`);
    }
  }
});

test('Visual bounds extend beyond geometric bounds (or equal)', () => {
  for (const [name, geom] of Object.entries(assembler.RING_GEOMETRIES)) {
    assertTrue(
      geom.visualInner <= geom.innerRadius,
      `${name}: visualInner (${geom.visualInner}) should be <= innerRadius (${geom.innerRadius})`
    );
    assertTrue(
      geom.visualOuter >= geom.outerRadius,
      `${name}: visualOuter (${geom.visualOuter}) should be >= outerRadius (${geom.outerRadius})`
    );
  }
});

test('Band width calculation is correct', () => {
  for (const [name, geom] of Object.entries(assembler.RING_GEOMETRIES)) {
    const expected = geom.outerRadius - geom.innerRadius;
    assertAlmostEqual(geom.bandWidth, expected, 0.001, `${name} band width`);
  }
});

// ============================================================================
// 2. SNAP PLACEMENT TESTS
// ============================================================================
console.log('\n2. Snap Placements');
console.log('─'.repeat(40));

test('calculateSnapPlacements returns correct number of placements', () => {
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding: 0,
    rings: ['numbers', 'hexagrams', 'codons']
  };

  const placements = assembler.calculateSnapPlacements(config);
  assertEqual(placements.length, 3, 'Should have 3 placements');
});

test('First ring visual inner matches startRadius', () => {
  const startRadius = 400;
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius,
    padding: 0,
    rings: ['numbers']
  };

  const placements = assembler.calculateSnapPlacements(config);
  assertAlmostEqual(
    placements[0].visualInner,
    startRadius,
    0.01,
    'First ring visual inner should match startRadius'
  );
});

test('Rings snap together with specified padding', () => {
  const padding = 10;
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding,
    rings: ['numbers', 'hexagrams', 'codons']
  };

  const placements = assembler.calculateSnapPlacements(config);

  for (let i = 1; i < placements.length; i++) {
    const gap = placements[i].visualInner - placements[i - 1].visualOuter;
    assertAlmostEqual(
      gap,
      padding,
      0.01,
      `Gap between ring ${i-1} and ${i} should be ${padding}`
    );
  }
});

test('Zero padding means rings touch exactly', () => {
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding: 0,
    rings: ['numbers', 'hexagrams']
  };

  const placements = assembler.calculateSnapPlacements(config);
  const gap = placements[1].visualInner - placements[0].visualOuter;

  assertAlmostEqual(gap, 0, 0.01, 'Gap with padding=0 should be ~0');
});

test('Negative padding creates overlap', () => {
  const padding = -5;
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding,
    rings: ['numbers', 'hexagrams']
  };

  const placements = assembler.calculateSnapPlacements(config);
  const gap = placements[1].visualInner - placements[0].visualOuter;

  assertAlmostEqual(gap, padding, 0.01, 'Negative padding should create overlap');
});

// ============================================================================
// 3. SCALE FACTOR TESTS
// ============================================================================
console.log('\n3. Scale Factors');
console.log('─'.repeat(40));

test('Scale factors are positive', () => {
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding: 0,
    rings: ['numbers', 'hexagrams', 'codons']
  };

  const placements = assembler.calculateSnapPlacements(config);

  for (const p of placements) {
    assertTrue(p.scale > 0, `${p.type} scale should be positive`);
  }
});

test('Uniform scale produces same scale for all rings', () => {
  const uniformScale = 0.5;
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding: 10,
    rings: ['numbers', 'hexagrams', 'codons'],
    uniformScale
  };

  const placements = assembler.calculateSnapPlacements(config);

  for (const p of placements) {
    assertAlmostEqual(p.scale, uniformScale, 0.0001, `${p.type} should have uniform scale`);
  }
});

test('Scaled dimensions maintain band width ratios', () => {
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding: 0,
    rings: ['numbers']
  };

  const placements = assembler.calculateSnapPlacements(config);
  const p = placements[0];
  const sourceGeom = assembler.RING_GEOMETRIES.numbers;

  // Band width should scale proportionally
  const expectedBandWidth = sourceGeom.bandWidth * p.scale;
  assertAlmostEqual(p.bandWidth, expectedBandWidth, 0.01, 'Band width should scale');
});

// ============================================================================
// 4. CENTER ALIGNMENT TESTS
// ============================================================================
console.log('\n4. Center Alignment');
console.log('─'.repeat(40));

test('All placements share the same center', () => {
  const center = { x: 1234.5678, y: 987.6543 };
  const config = {
    center,
    startRadius: 400,
    padding: 0,
    rings: ['numbers', 'hexagrams', 'codons']
  };

  const placements = assembler.calculateSnapPlacements(config);

  for (const p of placements) {
    assertAlmostEqual(p.center.x, center.x, 0.0001, `${p.type} center.x`);
    assertAlmostEqual(p.center.y, center.y, 0.0001, `${p.type} center.y`);
  }
});

test('Transform calculation preserves center alignment', () => {
  const targetCenter = { x: 1000, y: 1000 };
  const sourceGeom = assembler.RING_GEOMETRIES.numbers;
  const scale = 0.5;

  const transform = assembler.calculateTransform(sourceGeom, {
    center: targetCenter,
    scale
  });

  // After transform: sourceCenter * scale + translate = targetCenter
  const resultX = sourceGeom.center.x * scale + transform.translateX;
  const resultY = sourceGeom.center.y * scale + transform.translateY;

  assertAlmostEqual(resultX, targetCenter.x, 0.0001, 'X center after transform');
  assertAlmostEqual(resultY, targetCenter.y, 0.0001, 'Y center after transform');
});

// ============================================================================
// 5. PRECISION TESTS (for Illustrator compatibility)
// ============================================================================
console.log('\n5. Precision (Illustrator Compatibility)');
console.log('─'.repeat(40));

test('Transform values have reasonable precision', () => {
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding: 0,
    rings: ['numbers', 'hexagrams', 'codons']
  };

  const placements = assembler.calculateSnapPlacements(config);

  for (const p of placements) {
    const transform = assembler.calculateTransform(p.sourceGeom, {
      center: p.center,
      scale: p.scale
    });

    // Check that values don't have excessive decimal places in practical terms
    // (floating point will have many decimals, but they should be small variations)
    assertTrue(
      Math.abs(transform.translateX) < 10000,
      `${p.type} translateX (${transform.translateX}) should be reasonable`
    );
    assertTrue(
      Math.abs(transform.translateY) < 10000,
      `${p.type} translateY (${transform.translateY}) should be reasonable`
    );
  }
});

test('Cumulative gap error stays within tolerance', () => {
  // When composing many rings, small errors can accumulate
  // This test ensures the cumulative error stays bounded

  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding: 5,
    rings: ['numbers', 'hexagrams', 'codons']
  };

  const placements = assembler.calculateSnapPlacements(config);

  let cumulativeError = 0;
  for (let i = 1; i < placements.length; i++) {
    const actualGap = placements[i].visualInner - placements[i - 1].visualOuter;
    const error = Math.abs(actualGap - config.padding);
    cumulativeError += error;
  }

  // Allow up to 0.1 pixel cumulative error
  assertTrue(
    cumulativeError < 0.1,
    `Cumulative gap error (${cumulativeError}) should be < 0.1`
  );
});

// ============================================================================
// 6. SVG OUTPUT TESTS
// ============================================================================
console.log('\n6. SVG Output');
console.log('─'.repeat(40));

test('assembleRings generates valid SVG', () => {
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding: 0,
    rings: ['numbers'],
    includeBackground: false
  };

  const svg = assembler.assembleRings(config);

  assertTrue(svg.startsWith('<?xml') || svg.startsWith('<svg'), 'Should start with XML/SVG declaration');
  assertTrue(svg.includes('</svg>'), 'Should have closing SVG tag');
  assertTrue(svg.includes('numbers-ring'), 'Should include numbers ring group');
});

test('assembleRings includes background when requested', () => {
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding: 0,
    rings: ['numbers'],
    includeBackground: true
  };

  const svg = assembler.assembleRings(config);
  assertTrue(svg.includes('id="background"'), 'Should include background rect');
});

test('ViewBox encompasses all rings with padding', () => {
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding: 0,
    rings: ['numbers', 'hexagrams']
  };

  const placements = assembler.calculateSnapPlacements(config);
  const maxRadius = placements[placements.length - 1].visualOuter;

  const svg = assembler.assembleRings(config);

  // Extract viewBox
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  assertTrue(!!viewBoxMatch, 'SVG should have viewBox');

  const viewBoxParts = viewBoxMatch[1].split(' ').map(Number);
  const viewBoxWidth = viewBoxParts[2];
  const viewBoxHeight = viewBoxParts[3];

  // ViewBox should be at least 2 * maxRadius (plus some padding)
  assertTrue(
    viewBoxWidth >= maxRadius * 2,
    `ViewBox width (${viewBoxWidth}) should fit all rings (need ${maxRadius * 2})`
  );
  assertTrue(
    viewBoxHeight >= maxRadius * 2,
    `ViewBox height (${viewBoxHeight}) should fit all rings (need ${maxRadius * 2})`
  );
});

// ============================================================================
// 7. EDGE CASES
// ============================================================================
console.log('\n7. Edge Cases');
console.log('─'.repeat(40));

test('Single ring assembly works', () => {
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding: 0,
    rings: ['numbers']
  };

  const placements = assembler.calculateSnapPlacements(config);
  assertEqual(placements.length, 1, 'Should have 1 placement');

  const svg = assembler.assembleRings(config);
  assertTrue(svg.includes('</svg>'), 'Should generate valid SVG');
});

test('Very small startRadius works', () => {
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 10,  // Very small
    padding: 0,
    rings: ['numbers']
  };

  const placements = assembler.calculateSnapPlacements(config);
  assertTrue(placements[0].scale > 0, 'Should have positive scale even with small radius');
});

test('Large padding works correctly', () => {
  const padding = 100;  // Large gap
  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding,
    rings: ['numbers', 'hexagrams']
  };

  const placements = assembler.calculateSnapPlacements(config);
  const gap = placements[1].visualInner - placements[0].visualOuter;

  assertAlmostEqual(gap, padding, 0.01, 'Large padding should work');
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '═'.repeat(60));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(60));

if (failed > 0) {
  console.log('\nFailed tests:');
  errors.forEach(e => console.log(`  - ${e.name}: ${e.error}`));
  process.exit(1);
}
