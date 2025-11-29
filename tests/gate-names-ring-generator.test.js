/**
 * Gate Names Ring Generator Tests
 *
 * Verifies the translation chain from V3 knowledge engine to SVG output:
 * - Position calculation (V3 angle → SVG coordinates)
 * - Rotation calculation (single formula for all 64 gates)
 * - Font properties (family, size, weight)
 * - Gate names from knowledge engine (hd-mandala-gate-names)
 */

const generator = require('../visualization/generators/gate-names-ring.js');
const positioning = require('../core/root-system/positioning-algorithm');
const engine = require('../unified-query-engine');

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

console.log('\n=== Gate Names Ring Generator Tests ===\n');

// ============================================================================
// Test 1: Ring Geometry Constants
// ============================================================================
console.log('1. Ring Geometry Constants');

test('Ring center matches master', () => {
  assertClose(generator.RING.center.x, 1538.3667, 0.01);
  assertClose(generator.RING.center.y, 1538.3667, 0.01);
});

test('Ring radii match master', () => {
  assertClose(generator.RING.innerRadius, 1457.367, 0.01);
  assertClose(generator.RING.outerRadius, 1538.0506, 0.01);
});

test('Band width is calculated correctly', () => {
  const expected = generator.RING.outerRadius - generator.RING.innerRadius;
  assertClose(generator.RING.bandWidth, expected, 0.01);
});

// ============================================================================
// Test 2: Font Specifications
// ============================================================================
console.log('\n2. Font Specifications');

test('Font family matches master', () => {
  assertEqual(generator.FONT.family, 'Copperplate-Bold, Copperplate');
});

test('Font weight matches master', () => {
  assertEqual(generator.FONT.weight, 700);
});

test('Standard font size matches master (~20.8px)', () => {
  assertClose(generator.FONT.standard, 20.8073, 0.01);
});

test('Vertical scale matches master', () => {
  assertClose(generator.FONT.verticalScale, 1.2, 0.01);
});

// ============================================================================
// Test 3: Name Splitting
// ============================================================================
console.log('\n3. Name Splitting');

test('Simple "The Gate of X" splits to 3 lines', () => {
  const lines = generator.splitNameIntoLines('The Gate of Power');
  assertEqual(lines.length, 3);
  assertEqual(lines[0].text, 'The Gate');
  assertEqual(lines[1].text, 'of');
  assertEqual(lines[2].text, 'Power');
});

test('"The Gate of The X" splits to 4 lines', () => {
  const lines = generator.splitNameIntoLines('The Gate of The Listener');
  assertEqual(lines.length, 4);
  assertEqual(lines[0].text, 'The Gate');
  assertEqual(lines[1].text, 'of');
  assertEqual(lines[2].text, 'The');
  assertEqual(lines[3].text, 'Listener');
});

test('"The X of The Self" pattern splits correctly', () => {
  const lines = generator.splitNameIntoLines('The Direction of The Self');
  assertEqual(lines.length, 4);
  assertEqual(lines[0].text, 'The');
  assertEqual(lines[1].text, 'Direction');
  assertEqual(lines[2].text, 'of');
  assertEqual(lines[3].text, 'The Self');
});

test('Two-word ending splits to 4 lines', () => {
  const lines = generator.splitNameIntoLines('The Gate of Fixed Rhythms');
  assertEqual(lines.length, 4);
  assertEqual(lines[0].text, 'The Gate');
  assertEqual(lines[1].text, 'of');
  assertEqual(lines[2].text, 'Fixed');
  assertEqual(lines[3].text, 'Rhythms');
});

test('Intuitive Insight splits to 4 lines', () => {
  const lines = generator.splitNameIntoLines('The Gate of Intuitive Insight');
  assertEqual(lines.length, 4);
  assertEqual(lines[0].text, 'The Gate');
  assertEqual(lines[1].text, 'of');
  assertEqual(lines[2].text, 'Intuitive');
  assertEqual(lines[3].text, 'Insight');
});

test('Recognition of Feelings displays shortened', () => {
  const lines = generator.splitNameIntoLines('The Gate of the Recognition of Feelings');
  assertEqual(lines.length, 3);
  assertEqual(lines[0].text, 'Recognition');
  assertEqual(lines[1].text, 'of');
  assertEqual(lines[2].text, 'Feelings');
});

test('Hunter/Huntress displays as Hunter/ess', () => {
  const lines = generator.splitNameIntoLines('The Gate of The Hunter/Huntress');
  assertEqual(lines.length, 4);
  assertEqual(lines[3].text, 'Hunter/ess');
});

// ============================================================================
// Test 4: Position Calculation
// ============================================================================
console.log('\n4. Position Calculation');

test('Position formula produces valid coordinates', () => {
  const v3Data = positioning.getDockingData(41, 1);
  const pos = generator.calculatePosition(v3Data.angle);

  // Position should be at TEXT_RADIUS distance from center
  const distFromCenter = Math.sqrt(
    Math.pow(pos.x - generator.RING.center.x, 2) +
    Math.pow(pos.y - generator.RING.center.y, 2)
  );

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
// Test 5: Rotation Calculation
// ============================================================================
console.log('\n5. Rotation Calculation');

test('Rotation is always svgAngle + 90', () => {
  const testGates = [1, 2, 13, 25, 41, 64];

  for (const gate of testGates) {
    const v3Data = positioning.getDockingData(gate, 1);
    const svgAngle = generator.calculateSVGAngle(v3Data.angle);
    const rotation = generator.calculateRotation(svgAngle);

    assertClose(rotation, svgAngle + 90, 0.01, `Gate ${gate}`);
  }
});

// ============================================================================
// Test 6: Gate Names from Knowledge Engine
// ============================================================================
console.log('\n6. Gate Names from Knowledge Engine');

test('All 64 gates have mandala gate names', () => {
  for (let gate = 1; gate <= 64; gate++) {
    const knowledge = engine.getGateKnowledge(gate);
    if (!knowledge.mandalaGateName || !knowledge.mandalaGateName.mandalaGateName) {
      throw new Error(`Gate ${gate} missing mandala gate name`);
    }
  }
});

test('Known gate names are correct', () => {
  const expectedNames = {
    1: 'The Gate of Self Expression',
    29: 'The Gate of Saying Yes',
    46: 'The Determination of the Self',
    49: 'The Gate of Principles'
  };

  for (const [gateStr, expectedName] of Object.entries(expectedNames)) {
    const gate = parseInt(gateStr);
    const knowledge = engine.getGateKnowledge(gate);
    assertEqual(knowledge.mandalaGateName.mandalaGateName, expectedName, `Gate ${gate}`);
  }
});

// ============================================================================
// Test 7: SVG Generation
// ============================================================================
console.log('\n7. SVG Generation');

test('generateGateNamesRing produces valid SVG', () => {
  const svg = generator.generateGateNamesRing();

  if (!svg.startsWith('<svg')) {
    throw new Error('Output should start with <svg');
  }
  if (!svg.endsWith('</svg>')) {
    throw new Error('Output should end with </svg>');
  }
});

test('Generated SVG contains all 64 gates', () => {
  const svg = generator.generateGateNamesRing();

  for (let gate = 1; gate <= 64; gate++) {
    if (!svg.includes(`data-gate="${gate}"`)) {
      throw new Error(`Missing gate ${gate}`);
    }
  }
});

test('Generated SVG includes gate names', () => {
  const svg = generator.generateGateNamesRing();

  if (!svg.includes('The Gate of Self Expression')) {
    throw new Error('Missing "The Gate of Self Expression" (Gate 1)');
  }
  if (!svg.includes('The Gate of Saying Yes')) {
    throw new Error('Missing "The Gate of Saying Yes" (Gate 29)');
  }
});

test('Generated SVG includes font specifications', () => {
  const svg = generator.generateGateNamesRing();

  if (!svg.includes('font-family="Copperplate-Bold, Copperplate"')) {
    throw new Error('Missing font-family');
  }
  if (!svg.includes('font-weight="700"')) {
    throw new Error('Missing font-weight');
  }
});

test('Generated SVG includes tspan for multi-line names', () => {
  const svg = generator.generateGateNamesRing();

  if (!svg.includes('<tspan')) {
    throw new Error('Missing tspan elements for multi-line names');
  }
});

// ============================================================================
// Test 8: Consistency with Other Ring Generators
// ============================================================================
console.log('\n8. Consistency with Other Ring Generators');

test('Uses same position offset as other rings (323.4375)', () => {
  const gate41V3Angle = 0; // Gate 41 is at V3 angle 0
  const svgAngle = generator.calculateSVGAngle(gate41V3Angle);

  // svgAngle = -v3Angle - 90 + OFFSET = 0 - 90 + 323.4375 = 233.4375
  assertClose(svgAngle, 233.4375, 0.01, 'Position offset should be 323.4375');
});

test('Rotation formula matches other rings (svgAngle + 90)', () => {
  const svgAngle = 45;
  const rotation = generator.calculateRotation(svgAngle);
  assertEqual(rotation, svgAngle + 90);
});

// ============================================================================
// Test 9: Proportional Scaling
// ============================================================================
console.log('\n9. Proportional Scaling');

test('Font sizes scale with ring band width', () => {
  const bandWidth = generator.RING.bandWidth;
  const masterBandWidth = 80.6836;

  // At master dimensions, scale factor should be ~1.0
  const scaleFactor = bandWidth / masterBandWidth;
  assertClose(scaleFactor, 1.0, 0.001, 'Scale factor should be 1.0 at master dimensions');
});

test('Long words get smaller font sizes', () => {
  const longWord = 'Determination'; // 13 chars
  const fontSize = generator.getFontSize(longWord);

  if (fontSize >= generator.FONT.standard) {
    throw new Error(`Long word "${longWord}" should have smaller font than standard`);
  }
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
  console.log('\n✓ All gate names ring generator tests passed.');
  console.log('  The generator is correctly docked to V3.');
}
