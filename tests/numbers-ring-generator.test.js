/**
 * Numbers Ring Generator Tests
 *
 * Verifies the translation chain from V3 knowledge engine to SVG output:
 * - Position calculation (V3 angle → SVG coordinates)
 * - Rotation calculation (single formula for all 64 gates)
 * - Text properties (font family, size)
 *
 * Note: Position coordinates differ from master SVG because we use
 * text-anchor="middle" for centering, while master uses left-aligned text.
 * The rotation formula is what matters for correctness.
 */

const generator = require('../visualization/generators/numbers-ring.js');
const positioning = require('../core/root-system/positioning-algorithm');

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

console.log('\n=== Numbers Ring Generator Tests ===\n');

// ============================================================================
// Test 1: Ring Geometry Constants
// ============================================================================
console.log('1. Ring Geometry Constants');

test('Ring center matches master', () => {
  assertClose(generator.RING.center.x, 1657.7978, 0.01);
  assertClose(generator.RING.center.y, 1657.4867, 0.01);
});

test('Ring radii match master', () => {
  assertClose(generator.RING.innerRadius, 1538.587, 0.01);
  assertClose(generator.RING.outerRadius, 1648.5514, 0.01);
});

test('Mid radius is calculated correctly', () => {
  const expected = (generator.RING.innerRadius + generator.RING.outerRadius) / 2;
  assertClose(generator.RING.midRadius, expected, 0.01);
});

// ============================================================================
// Test 2: Font Specifications
// ============================================================================
console.log('\n2. Font Specifications');

test('Font family matches master', () => {
  assertEqual(generator.FONT.family, 'Herculanum');
});

test('Font size matches master', () => {
  assertClose(generator.FONT.size, 117.1932, 0.01);
});

// ============================================================================
// Test 3: Position Calculation
// ============================================================================
console.log('\n3. Position Calculation');

test('Position formula produces valid coordinates', () => {
  const v3Data = positioning.getDockingData(41, 1);
  const pos = generator.calculatePosition(v3Data.angle);

  // Position should be within the ring band
  const distFromCenter = Math.sqrt(
    Math.pow(pos.x - generator.RING.center.x, 2) +
    Math.pow(pos.y - generator.RING.center.y, 2)
  );

  // Should be at TEXT_RADIUS (midRadius by default)
  assertClose(distFromCenter, generator.TEXT_RADIUS, 1, 'Should be at text radius');
});

test('All 64 gates have unique positions', () => {
  const positions = [];

  for (let gate = 1; gate <= 64; gate++) {
    const v3Data = positioning.getDockingData(gate, 1);
    const pos = generator.calculatePosition(v3Data.angle);
    positions.push({ gate, x: pos.x, y: pos.y });
  }

  // Check no two gates have the same position
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dist = Math.sqrt(
        Math.pow(positions[i].x - positions[j].x, 2) +
        Math.pow(positions[i].y - positions[j].y, 2)
      );
      if (dist < 10) {
        throw new Error(`Gates ${positions[i].gate} and ${positions[j].gate} overlap`);
      }
    }
  }
});

// ============================================================================
// Test 4: Rotation Calculation
// ============================================================================
console.log('\n4. Rotation Calculation');

test('Rotation is always svgAngle + 90', () => {
  const testGates = [1, 2, 13, 25, 41, 64];

  for (const gate of testGates) {
    const v3Data = positioning.getDockingData(gate, 1);
    const svgAngle = generator.calculateSVGAngle(v3Data.angle);
    const rotation = generator.calculateRotation(svgAngle);

    assertClose(rotation, svgAngle + 90, 0.01, `Gate ${gate}`);
  }
});

test('Single formula works for all quadrants', () => {
  // Test gates from different wheel positions
  const quadrantGates = [10, 15, 25, 41];

  for (const gate of quadrantGates) {
    const v3Data = positioning.getDockingData(gate, 1);
    const svgAngle = generator.calculateSVGAngle(v3Data.angle);
    const rotation = generator.calculateRotation(svgAngle);

    if (isNaN(rotation)) {
      throw new Error(`Gate ${gate} produced invalid rotation`);
    }
  }
});

test('Rotation matches master SVG within tolerance', () => {
  // Master rotation values (extracted from verified master)
  const masterRotations = {
    1: 42.175,
    10: -2.8253,
    25: -92.8253,
    41: -36.5747
  };

  for (const [gateStr, masterRot] of Object.entries(masterRotations)) {
    const gate = parseInt(gateStr);
    const v3Data = positioning.getDockingData(gate, 1);
    const svgAngle = generator.calculateSVGAngle(v3Data.angle);
    const rotation = generator.calculateRotation(svgAngle);

    // Normalize both to -180 to 180 for comparison
    let normRotation = rotation;
    while (normRotation > 180) normRotation -= 360;
    while (normRotation < -180) normRotation += 360;

    let normMaster = masterRot;
    while (normMaster > 180) normMaster -= 360;
    while (normMaster < -180) normMaster += 360;

    assertClose(normRotation, normMaster, 0.1, `Gate ${gate} rotation`);
  }
});

// ============================================================================
// Test 5: SVG Generation
// ============================================================================
console.log('\n5. SVG Generation');

test('generateNumbersRing produces valid SVG', () => {
  const svg = generator.generateNumbersRing();

  if (!svg.startsWith('<svg')) {
    throw new Error('Output should start with <svg');
  }
  if (!svg.endsWith('</svg>')) {
    throw new Error('Output should end with </svg>');
  }
});

test('Generated SVG contains all 64 gates', () => {
  const svg = generator.generateNumbersRing();

  for (let gate = 1; gate <= 64; gate++) {
    if (!svg.includes(`data-gate="${gate}"`)) {
      throw new Error(`Missing gate ${gate}`);
    }
    if (!svg.includes(`>${gate}</text>`)) {
      throw new Error(`Missing number ${gate} in text content`);
    }
  }
});

test('Generated SVG includes font specifications', () => {
  const svg = generator.generateNumbersRing();

  if (!svg.includes('font-family="Herculanum"')) {
    throw new Error('Missing font-family');
  }
  if (!svg.includes('font-size="117.1932"')) {
    throw new Error('Missing font-size');
  }
});

test('Generated SVG includes text centering attributes', () => {
  const svg = generator.generateNumbersRing();

  if (!svg.includes('text-anchor="middle"')) {
    throw new Error('Missing text-anchor');
  }
  if (!svg.includes('dominant-baseline="central"')) {
    throw new Error('Missing dominant-baseline');
  }
});

test('Generated SVG includes ring structure when requested', () => {
  const svg = generator.generateNumbersRing({ includeStructure: true });

  if (!svg.includes('RING_-_INNER')) {
    throw new Error('Missing inner ring');
  }
  if (!svg.includes('RING_-_OUTER')) {
    throw new Error('Missing outer ring');
  }
});

test('Generated SVG includes 64 divider lines', () => {
  const svg = generator.generateNumbersRing({ includeStructure: true });

  if (!svg.includes('<g id="DIVIDERS">')) {
    throw new Error('Missing DIVIDERS group');
  }

  // Count divider lines
  const lineMatches = svg.match(/<line id="LINE_-_/g);
  if (!lineMatches || lineMatches.length !== 64) {
    throw new Error(`Expected 64 divider lines, found ${lineMatches ? lineMatches.length : 0}`);
  }
});

// ============================================================================
// Test 6: Consistency with Hexagram Ring
// ============================================================================
console.log('\n6. Consistency with Hexagram Ring');

test('Uses same position offset as hexagram ring (323.4375)', () => {
  // The position offset should be the same across all ring generators
  // to maintain wheel alignment
  const EXPECTED_OFFSET = 323.4375;

  // Test by checking a known gate position
  const gate41V3Angle = 0; // Gate 41 is at V3 angle 0
  const svgAngle = generator.calculateSVGAngle(gate41V3Angle);

  // svgAngle = -v3Angle - 90 + OFFSET = 0 - 90 + 323.4375 = 233.4375
  assertClose(svgAngle, 233.4375, 0.01, 'Position offset should be 323.4375');
});

test('Rotation formula matches hexagram ring (svgAngle + 90)', () => {
  // Both rings use the same rotation formula
  const svgAngle = 45;
  const rotation = generator.calculateRotation(svgAngle);
  assertEqual(rotation, svgAngle + 90);
});

// ============================================================================
// Summary
// ============================================================================
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\n⚠️  Some tests failed.');
  process.exit(1);
} else {
  console.log('\n✓ All numbers ring generator tests passed.');
  console.log('  The generator is correctly docked to V3.');
}
