/**
 * I Ching Names Ring Generator Tests
 *
 * Verifies the translation chain from V3 knowledge engine to SVG output:
 * - Position calculation (V3 angle → SVG coordinates)
 * - Rotation calculation (single formula for all 64 gates)
 * - Font properties (family, size, weight)
 * - I Ching names from knowledge engine
 */

const generator = require('../visualization/generators/iching-names-ring.js');
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

console.log('\n=== I Ching Names Ring Generator Tests ===\n');

// ============================================================================
// Test 1: Ring Geometry Constants
// ============================================================================
console.log('1. Ring Geometry Constants');

test('Ring center matches master', () => {
  assertClose(generator.RING.center.x, 1335.2162, 0.01);
  assertClose(generator.RING.center.y, 1335.2162, 0.01);
});

test('Ring radii match master', () => {
  assertClose(generator.RING.innerRadius, 1259.3041, 0.01);
  assertClose(generator.RING.outerRadius, 1334.9662, 0.01);
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
  assertEqual(generator.FONT.family, 'Copperplate-Bold, Copperplate');
});

test('Font weight matches master', () => {
  assertEqual(generator.FONT.weight, 700);
});

test('Standard font size matches master', () => {
  assertClose(generator.FONT.standard, 19.0, 0.01);
});

test('Vertical scale matches master', () => {
  assertClose(generator.FONT.verticalScale, 1.2, 0.01);
});

// ============================================================================
// Test 3: Master-matched Font Sizing
// ============================================================================
console.log('\n3. Master-matched Font Sizing');

test('Short names use standard font size', () => {
  const fontSize = generator.getFontSize('Peace');
  assertClose(fontSize, generator.FONT.standard, 0.01);
});

test('Preponderance uses smaller font (15.05px)', () => {
  const fontSize = generator.getFontSize('Preponderance');
  assertClose(fontSize, 15.05, 0.01);
});

test('Taming Power uses specific font (16.63px)', () => {
  const fontSize = generator.getFontSize('Taming Power');
  assertClose(fontSize, 16.63, 0.01);
});

test('Contemplation uses specific font (15.84px)', () => {
  const fontSize = generator.getFontSize('Contemplation');
  assertClose(fontSize, 15.84, 0.01);
});

// ============================================================================
// Test 4: Multi-line Name Splitting
// ============================================================================
console.log('\n4. Multi-line Name Splitting');

test('Short names are single line', () => {
  const lines = generator.splitNameIntoLines('Peace');
  assertEqual(lines.length, 1);
  assertEqual(lines[0].text, 'Peace');
});

test('Two-word names split into two lines', () => {
  const lines = generator.splitNameIntoLines('Keeping Still');
  assertEqual(lines.length, 2);
  assertEqual(lines[0].text, 'Keeping');
  assertEqual(lines[1].text, 'Still');
});

test('Preponderance of the Great splits into three lines', () => {
  const lines = generator.splitNameIntoLines('Preponderance of the Great');
  assertEqual(lines.length, 3);
  assertEqual(lines[0].text, 'Preponderance');
  assertEqual(lines[1].text, 'of');
  assertEqual(lines[2].text, 'the Great');
});

test('Preponderance of the Small splits into three lines', () => {
  const lines = generator.splitNameIntoLines('Preponderance of the Small');
  assertEqual(lines.length, 3);
  assertEqual(lines[0].text, 'Preponderance');
  assertEqual(lines[1].text, 'of');
  assertEqual(lines[2].text, 'the Small');
});

test('"The X" names split correctly', () => {
  // "The Receptive" is 13 chars, so it should split
  const lines = generator.splitNameIntoLines('The Receptive');
  assertEqual(lines.length, 2);
  assertEqual(lines[0].text, 'The');
  assertEqual(lines[1].text, 'Receptive');
});

// ============================================================================
// Test 5: Position Calculation
// ============================================================================
console.log('\n5. Position Calculation');

test('Position formula produces valid coordinates', () => {
  const v3Data = positioning.getDockingData(41, 1);
  const pos = generator.calculatePosition(v3Data.angle);

  // Position should be within the ring band
  const distFromCenter = Math.sqrt(
    Math.pow(pos.x - generator.RING.center.x, 2) +
    Math.pow(pos.y - generator.RING.center.y, 2)
  );

  // Should be at TEXT_RADIUS (midRadius)
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
// Test 6: Rotation Calculation
// ============================================================================
console.log('\n6. Rotation Calculation');

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

// ============================================================================
// Test 7: I Ching Names from Knowledge Engine
// ============================================================================
console.log('\n7. I Ching Names from Knowledge Engine');

test('All 64 gates have I Ching names', () => {
  for (let gate = 1; gate <= 64; gate++) {
    const knowledge = engine.getGateKnowledge(gate);
    if (!knowledge.ichingName || !knowledge.ichingName.ichingName) {
      throw new Error(`Gate ${gate} missing I Ching name`);
    }
  }
});

test('Known gate names are correct', () => {
  const expectedNames = {
    1: 'The Creative',
    2: 'The Receptive',
    29: 'The Abysmal',
    30: 'Clinging Fire',  // Note: Our data uses "Clinging Fire" not "The Clinging Fire"
    64: 'Before Completion'
  };

  for (const [gateStr, expectedName] of Object.entries(expectedNames)) {
    const gate = parseInt(gateStr);
    const knowledge = engine.getGateKnowledge(gate);
    assertEqual(knowledge.ichingName.ichingName, expectedName, `Gate ${gate}`);
  }
});

// ============================================================================
// Test 8: SVG Generation
// ============================================================================
console.log('\n8. SVG Generation');

test('generateIChingNamesRing produces valid SVG', () => {
  const svg = generator.generateIChingNamesRing();

  if (!svg.startsWith('<svg')) {
    throw new Error('Output should start with <svg');
  }
  if (!svg.endsWith('</svg>')) {
    throw new Error('Output should end with </svg>');
  }
});

test('Generated SVG contains all 64 gates', () => {
  const svg = generator.generateIChingNamesRing();

  for (let gate = 1; gate <= 64; gate++) {
    if (!svg.includes(`data-gate="${gate}"`)) {
      throw new Error(`Missing gate ${gate}`);
    }
  }
});

test('Generated SVG includes I Ching names', () => {
  const svg = generator.generateIChingNamesRing();

  if (!svg.includes('The Creative')) {
    throw new Error('Missing "The Creative" (Gate 1)');
  }
  if (!svg.includes('The Receptive')) {
    throw new Error('Missing "The Receptive" (Gate 2)');
  }
});

test('Generated SVG includes font specifications', () => {
  const svg = generator.generateIChingNamesRing();

  if (!svg.includes('font-family="Copperplate-Bold, Copperplate"')) {
    throw new Error('Missing font-family');
  }
  if (!svg.includes('font-weight="700"')) {
    throw new Error('Missing font-weight');
  }
});

test('Generated SVG includes vertical scale transform', () => {
  const svg = generator.generateIChingNamesRing();

  if (!svg.includes('scale(1 1.2)')) {
    throw new Error('Missing vertical scale transform');
  }
});

test('Generated SVG includes tspan for multi-line names', () => {
  const svg = generator.generateIChingNamesRing();

  if (!svg.includes('<tspan')) {
    throw new Error('Missing tspan elements for multi-line names');
  }
});

test('Generated SVG includes ring structure when requested', () => {
  const svg = generator.generateIChingNamesRing({ includeStructure: true });

  if (!svg.includes('RING_-_INNER')) {
    throw new Error('Missing inner ring');
  }
  if (!svg.includes('RING_-_OUTER')) {
    throw new Error('Missing outer ring');
  }
});

test('Generated SVG includes 64 divider lines', () => {
  const svg = generator.generateIChingNamesRing({ includeStructure: true });

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
// Test 9: Text Fitting and Edge Cases
// ============================================================================
console.log('\n9. Text Fitting and Edge Cases');

test('All 64 names are split into lines', () => {
  for (let gate = 1; gate <= 64; gate++) {
    const knowledge = engine.getGateKnowledge(gate);
    const name = knowledge.ichingName?.ichingName;
    const lines = generator.splitNameIntoLines(name);

    if (!lines || lines.length === 0) {
      throw new Error(`Gate ${gate} (${name}) produced no lines`);
    }

    // Each line should have text and fontSize
    for (const line of lines) {
      if (!line.text || !line.fontSize) {
        throw new Error(`Gate ${gate} has invalid line: ${JSON.stringify(line)}`);
      }
    }
  }
});

test('No single line exceeds reasonable character count', () => {
  const MAX_CHARS_PER_LINE = 14; // Reasonable max for the ring width

  for (let gate = 1; gate <= 64; gate++) {
    const knowledge = engine.getGateKnowledge(gate);
    const name = knowledge.ichingName?.ichingName;
    const lines = generator.splitNameIntoLines(name);

    for (const line of lines) {
      if (line.text.length > MAX_CHARS_PER_LINE) {
        throw new Error(`Gate ${gate}: line "${line.text}" (${line.text.length} chars) exceeds max`);
      }
    }
  }
});

test('Long words get smaller font sizes', () => {
  const longWords = ['Preponderance', 'Contemplation', 'Taming Power'];

  for (const word of longWords) {
    const fontSize = generator.getFontSize(word);
    if (fontSize >= generator.FONT.standard) {
      throw new Error(`"${word}" should have smaller font than standard`);
    }
  }
});

test('Breakthrough splits into two lines', () => {
  const lines = generator.splitNameIntoLines('Breakthrough');
  assertEqual(lines.length, 2);
  assertEqual(lines[0].text, 'Break');
  assertEqual(lines[1].text, 'through');
});

test('The Marrying Maiden splits into three lines', () => {
  const lines = generator.splitNameIntoLines('The Marrying Maiden');
  assertEqual(lines.length, 3);
  assertEqual(lines[0].text, 'The');
  assertEqual(lines[1].text, 'Marrying');
  assertEqual(lines[2].text, 'Maiden');
});

test('Ring geometry supports scaling', () => {
  // TEXT_RADIUS should be derived from ring geometry
  const expectedMidRadius = (generator.RING.innerRadius + generator.RING.outerRadius) / 2;
  assertClose(generator.TEXT_RADIUS, expectedMidRadius, 0.01);
});

// ============================================================================
// Test 10: Consistency with Other Ring Generators
// ============================================================================
console.log('\n10. Consistency with Other Ring Generators');

test('Uses same position offset as other rings (323.4375)', () => {
  // Test by checking a known gate position
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
// Test 11: Proportional Scaling System
// ============================================================================
console.log('\n11. Proportional Scaling System');

test('Shared TEXT_RATIOS exist for extensibility', () => {
  const shared = require('../visualization/generators/shared-constants');
  if (!shared.TEXT_RATIOS) {
    throw new Error('TEXT_RATIOS not exported from shared-constants');
  }
  if (!shared.TEXT_RATIOS.fontSizeToBandWidth) {
    throw new Error('fontSizeToBandWidth ratio missing');
  }
});

test('calculateTextConfig produces scaled values', () => {
  const shared = require('../visualization/generators/shared-constants');

  // Test with a hypothetical ring at 50% scale
  const halfScaleRing = {
    innerRadius: generator.RING.innerRadius / 2,
    outerRadius: generator.RING.outerRadius / 2
  };

  const config = shared.calculateTextConfig(halfScaleRing);
  const masterConfig = shared.calculateTextConfig(generator.RING);

  // Font size should scale proportionally
  const expectedRatio = halfScaleRing.outerRadius / generator.RING.outerRadius;
  assertClose(config.standardFontSize / masterConfig.standardFontSize, expectedRatio, 0.01,
    'Font size should scale with ring size');
});

test('Font sizes scale with ring band width', () => {
  // Current font sizes are derived from band width
  const bandWidth = generator.RING.bandWidth;
  const masterBandWidth = 75.6621;

  // At master dimensions, scale factor should be ~1.0
  const scaleFactor = bandWidth / masterBandWidth;
  assertClose(scaleFactor, 1.0, 0.001, 'Scale factor should be 1.0 at master dimensions');

  // Verify standard font scales correctly
  assertClose(generator.FONT.standard, 19.0 * scaleFactor, 0.01);
});

test('Line height scales with ring band width', () => {
  const bandWidth = generator.RING.bandWidth;
  const masterBandWidth = 75.6621;
  const scaleFactor = bandWidth / masterBandWidth;

  // Line height should be 15.62 * scaleFactor
  assertClose(generator.FONT.lineHeight, 15.62 * scaleFactor, 0.01);
});

test('getFontSize works for unknown long words', () => {
  // Test a word not in the lookup table but > 10 chars
  const unknownWord = 'Hypothetical'; // 12 chars
  const fontSize = generator.getFontSize(unknownWord);

  // Should use the shared scaling system for unknown words
  // and return a smaller size than standard
  if (fontSize >= generator.FONT.standard) {
    throw new Error(`Unknown long word "${unknownWord}" should get smaller font than standard`);
  }
});

test('Maximum lines fit within band', () => {
  const shared = require('../visualization/generators/shared-constants');
  const config = shared.calculateTextConfig(generator.RING);

  // With 1.2 vertical scale and ~19px font, we should fit 3 lines in ~75px band
  assertEqual(config.maxLines, 3, 'Should fit 3 lines in the ring band');
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
  console.log('\n✓ All I Ching names ring generator tests passed.');
  console.log('  The generator is correctly docked to V3.');
}
