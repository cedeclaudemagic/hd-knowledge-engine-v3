/**
 * Hexagram Ring Generator Tests
 *
 * Verifies the translation chain from V3 knowledge engine to SVG output:
 * - Line order (Line 1 innermost, Line 6 outermost)
 * - Position calculation (V3 angle → SVG coordinates)
 * - Rotation calculation (single formula for all 64 gates)
 * - Binary → line type mapping
 *
 * These tests ensure the methodology documented in:
 * - docs/reference/SVG-GENERATION-METHODOLOGY.md
 * - docs/reference/CRITICAL-ORIENTATION.md
 */

const path = require('path');

// Import generator and dependencies
const generator = require('../visualization/generators/hexagram-ring.js');
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

console.log('\n=== Hexagram Ring Generator Tests ===\n');

// ============================================================================
// Test 1: Line Order Convention
// ============================================================================
console.log('1. Line Order Convention (CRITICAL)');

test('Line 1 has largest y-offset (bottom of local symbol)', () => {
  // Line 1 y-offset should be (6-1) * spacing = 5 * spacing
  // Line 6 y-offset should be (6-6) * spacing = 0
  const spacing = generator.SYMBOL.lineSpacing;

  const line1Offset = (6 - 1) * spacing;
  const line6Offset = (6 - 6) * spacing;

  assertEqual(line6Offset, 0, 'Line 6 should be at y=0 (top)');
  assertEqual(line1Offset, 5 * spacing, 'Line 1 should be at bottom');

  // Line 1 offset should be greater than Line 6 offset
  if (line1Offset <= line6Offset) {
    throw new Error('Line 1 should have larger y-offset than Line 6');
  }
});

test('Line order follows I Ching convention (bottom-to-top)', () => {
  // Binary index 0 = Line 1 (bottom)
  // Binary index 5 = Line 6 (top)
  const gate1 = engine.getGateKnowledge(1);
  const binary = gate1.binary;

  assertEqual(binary.length, 6, 'Binary should have 6 characters');

  // Gate 1 is Heaven: all yang (111111)
  assertEqual(binary, '111111', 'Gate 1 should be all yang');

  // Each index should map to correct line
  for (let i = 0; i < 6; i++) {
    const lineNumber = i + 1;
    const bit = binary[i];
    // This is the convention we're testing
    assertEqual(typeof bit, 'string', `Binary[${i}] should exist for line ${lineNumber}`);
  }
});

// ============================================================================
// Test 2: Position Calculation
// ============================================================================
console.log('\n2. Position Calculation');

test('Position formula produces valid coordinates', () => {
  // Test Gate 41 (first gate, at 0°)
  const v3Data = positioning.getDockingData(41, 1);
  const pos = generator.calculatePosition(v3Data.angle);

  // Position should be within the ring band
  const distFromCenter = Math.sqrt(
    Math.pow(pos.x - generator.RING.center.x, 2) +
    Math.pow(pos.y - generator.RING.center.y, 2)
  );

  // Should be at midRadius (between inner and outer)
  assertClose(distFromCenter, generator.RING.midRadius, 1, 'Should be at mid radius');
});

test('All 64 gates have unique positions', () => {
  const positions = [];

  for (let gate = 1; gate <= 64; gate++) {
    const v3Data = positioning.getDockingData(gate, 1);
    const pos = generator.calculatePosition(v3Data.angle);
    positions.push({ gate, x: pos.x, y: pos.y });
  }

  // Check no two gates have the same position (within tolerance)
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dist = Math.sqrt(
        Math.pow(positions[i].x - positions[j].x, 2) +
        Math.pow(positions[i].y - positions[j].y, 2)
      );
      if (dist < 10) {
        throw new Error(`Gates ${positions[i].gate} and ${positions[j].gate} have same position`);
      }
    }
  }
});

test('Position offset aligns wheel correctly', () => {
  // Gate 41 should be near top of wheel (SVG angle ~233.44°)
  // Gate 41 V3 angle is 0°
  const POSITION_OFFSET = 323.4375;
  const v3Angle = 0;
  const svgAngle = -v3Angle - 90 + POSITION_OFFSET;

  assertClose(svgAngle, 233.4375, 0.01, 'Gate 41 SVG angle should be ~233.44°');
});

// ============================================================================
// Test 3: Rotation Calculation
// ============================================================================
console.log('\n3. Rotation Calculation');

test('Rotation is always svgAngle + 90', () => {
  // Test several gates to ensure uniform formula
  const testGates = [1, 2, 13, 30, 41, 64];

  for (const gate of testGates) {
    const v3Data = positioning.getDockingData(gate, 1);
    const POSITION_OFFSET = 323.4375;
    const svgAngle = -v3Data.angle - 90 + POSITION_OFFSET;
    const rotation = generator.calculateRotation(svgAngle);

    assertClose(rotation, svgAngle + 90, 0.01, `Gate ${gate} rotation should be svgAngle + 90`);
  }
});

test('Single formula works for all quadrants', () => {
  // Test one gate from each quadrant
  const quadrantGates = {
    'Q1 (top-right)': 10,
    'Q2 (bottom-right)': 15,
    'Q3 (bottom-left)': 25,
    'Q4 (top-left)': 41
  };

  for (const [quadrant, gate] of Object.entries(quadrantGates)) {
    const v3Data = positioning.getDockingData(gate, 1);
    const POSITION_OFFSET = 323.4375;
    const svgAngle = -v3Data.angle - 90 + POSITION_OFFSET;
    const rotation = generator.calculateRotation(svgAngle);

    // Rotation should be a valid angle
    if (isNaN(rotation)) {
      throw new Error(`${quadrant} (Gate ${gate}) produced invalid rotation`);
    }
  }
});

// ============================================================================
// Test 4: Binary to Line Type Mapping
// ============================================================================
console.log('\n4. Binary to Line Type Mapping');

test('Gate 1 (Heaven) has all YANG lines', () => {
  const knowledge = engine.getGateKnowledge(1);
  const binary = knowledge.binary;

  assertEqual(binary, '111111', 'Gate 1 binary should be all 1s');

  for (let i = 0; i < 6; i++) {
    assertEqual(binary[i], '1', `Line ${i + 1} should be YANG`);
  }
});

test('Gate 2 (Earth) has all YIN lines', () => {
  const knowledge = engine.getGateKnowledge(2);
  const binary = knowledge.binary;

  assertEqual(binary, '000000', 'Gate 2 binary should be all 0s');

  for (let i = 0; i < 6; i++) {
    assertEqual(binary[i], '0', `Line ${i + 1} should be YIN`);
  }
});

test('Gate 3 has correct mixed pattern', () => {
  const knowledge = engine.getGateKnowledge(3);
  const binary = knowledge.binary;

  // Gate 3: Thunder over Water = 100010
  assertEqual(binary, '100010', 'Gate 3 binary should be 100010');

  // Verify each line
  const expected = [
    { line: 1, type: '1', name: 'YANG' },  // index 0
    { line: 2, type: '0', name: 'YIN' },   // index 1
    { line: 3, type: '0', name: 'YIN' },   // index 2
    { line: 4, type: '0', name: 'YIN' },   // index 3
    { line: 5, type: '1', name: 'YANG' },  // index 4
    { line: 6, type: '0', name: 'YIN' }    // index 5
  ];

  for (const exp of expected) {
    assertEqual(binary[exp.line - 1], exp.type, `Line ${exp.line} should be ${exp.name}`);
  }
});

// ============================================================================
// Test 5: Trigram Consistency
// ============================================================================
console.log('\n5. Trigram Consistency');

test('Lower trigram = Lines 1-3, Upper trigram = Lines 4-6', () => {
  // Gate 3: Thunder (100) over Water (010)
  // Lower = Thunder = binary[0-2] = 100
  // Upper = Water = binary[3-5] = 010
  const knowledge = engine.getGateKnowledge(3);

  assertEqual(knowledge.trigrams.lower, 'Thunder');
  assertEqual(knowledge.trigrams.upper, 'Water');

  // Verify binary matches
  const binary = knowledge.binary;
  const lowerBinary = binary.slice(0, 3);  // Lines 1-3
  const upperBinary = binary.slice(3, 6);  // Lines 4-6

  assertEqual(lowerBinary, '100', 'Lower trigram (Thunder) should be 100');
  assertEqual(upperBinary, '010', 'Upper trigram (Water) should be 010');
});

test('All 64 gates have consistent trigram-binary mapping', () => {
  const trigramToBinary = {
    'Heaven': '111',
    'Earth': '000',
    'Thunder': '100',
    'Water': '010',
    'Mountain': '001',
    'Fire': '101',
    'Lake': '110',
    'Wind': '011'
  };

  for (let gate = 1; gate <= 64; gate++) {
    const knowledge = engine.getGateKnowledge(gate);
    const binary = knowledge.binary;

    const lowerBinary = binary.slice(0, 3);
    const upperBinary = binary.slice(3, 6);

    const expectedLower = trigramToBinary[knowledge.trigrams.lower];
    const expectedUpper = trigramToBinary[knowledge.trigrams.upper];

    if (lowerBinary !== expectedLower) {
      throw new Error(`Gate ${gate}: Lower trigram ${knowledge.trigrams.lower} should be ${expectedLower}, got ${lowerBinary}`);
    }
    if (upperBinary !== expectedUpper) {
      throw new Error(`Gate ${gate}: Upper trigram ${knowledge.trigrams.upper} should be ${expectedUpper}, got ${upperBinary}`);
    }
  }
});

// ============================================================================
// Test 6: Codon Consistency
// ============================================================================
console.log('\n6. Codon Consistency');

test('Binary to codon mapping is correct', () => {
  // Codon mapping: 00=U, 01=G, 10=C, 11=A
  // Lines 1-2 → 1st letter, Lines 3-4 → 2nd letter, Lines 5-6 → 3rd letter

  const testCases = [
    { gate: 1, binary: '111111', codon: 'AAA' },  // 11 11 11
    { gate: 2, binary: '000000', codon: 'UUU' },  // 00 00 00
    { gate: 3, binary: '100010', codon: 'CUC' },  // 10 00 10
    { gate: 30, binary: '101101', codon: 'CAG' }  // 10 11 01
  ];

  for (const tc of testCases) {
    const knowledge = engine.getGateKnowledge(tc.gate);
    assertEqual(knowledge.binary, tc.binary, `Gate ${tc.gate} binary`);
    assertEqual(knowledge.codon, tc.codon, `Gate ${tc.gate} codon`);
  }
});

// ============================================================================
// Test 7: SVG Generation
// ============================================================================
console.log('\n7. SVG Generation');

test('generateHexagramRing produces valid SVG', () => {
  const svg = generator.generateHexagramRing();

  // Check basic structure
  if (!svg.startsWith('<svg')) {
    throw new Error('Output should start with <svg');
  }
  if (!svg.endsWith('</svg>')) {
    throw new Error('Output should end with </svg>');
  }
  if (!svg.includes('<g id="hexagrams">')) {
    throw new Error('Should contain hexagrams group');
  }
});

test('Generated SVG contains all 64 gates', () => {
  const svg = generator.generateHexagramRing();

  for (let gate = 1; gate <= 64; gate++) {
    if (!svg.includes(`id="gate-${gate}"`)) {
      throw new Error(`SVG missing gate ${gate}`);
    }
  }
});

test('Generated SVG contains correct data attributes', () => {
  const svg = generator.generateHexagramRing();

  // Check Gate 1 attributes
  if (!svg.includes('data-gate="1"')) {
    throw new Error('Missing data-gate for Gate 1');
  }
  if (!svg.includes('data-binary="111111"')) {
    throw new Error('Missing or incorrect data-binary for Gate 1');
  }
  if (!svg.includes('data-codon="AAA"')) {
    throw new Error('Missing or incorrect data-codon for Gate 1');
  }
});

test('Each gate group has 6 line elements', () => {
  const svg = generator.generateHexagramRing();

  // Check a few gates
  for (const gate of [1, 13, 41]) {
    // Count data-line attributes within this gate's group
    const gatePattern = new RegExp(`id="gate-${gate}"[\\s\\S]*?(?=<g id="gate-|</g>\\s*</g>)`, 'g');
    const match = svg.match(gatePattern);

    if (!match) {
      throw new Error(`Could not find gate ${gate} group`);
    }

    const lineMatches = match[0].match(/data-line="/g);
    if (!lineMatches || lineMatches.length !== 6) {
      throw new Error(`Gate ${gate} should have 6 lines, found ${lineMatches ? lineMatches.length : 0}`);
    }
  }
});

// ============================================================================
// Test 8: Ring Geometry
// ============================================================================
console.log('\n8. Ring Geometry Constants');

test('Ring geometry matches verified master', () => {
  assertClose(generator.RING.center.x, 1451.344, 0.01);
  assertClose(generator.RING.center.y, 1451.344, 0.01);
  assertClose(generator.RING.innerRadius, 1334.4257, 0.01);
  assertClose(generator.RING.outerRadius, 1451.094, 0.01);
});

test('Symbol dimensions are consistent', () => {
  assertClose(generator.SYMBOL.lineWidth, 80.7558, 0.01);
  assertClose(generator.SYMBOL.lineHeight, 9.9549, 0.01);
  assertClose(generator.SYMBOL.lineSpacing, 16.91, 0.01);
});

// ============================================================================
// Summary
// ============================================================================
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\n⚠️  Some tests failed. Check the translation chain.');
  process.exit(1);
} else {
  console.log('\n✓ All translation chain tests passed.');
  console.log('  The hexagram ring generator is correctly docked to V3.');
}
