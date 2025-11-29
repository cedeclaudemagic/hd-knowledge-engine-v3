/**
 * Gene Keys Ring Generator Tests
 *
 * Verifies the translation chain from V3 knowledge engine to SVG output:
 * - Ring geometry (3 concentric bands: shadows, gifts, siddhis)
 * - Position calculation (V3 angle → SVG coordinates)
 * - Rotation calculation (single formula for all 64 gates)
 * - Font properties (family, size, weight)
 * - Gene Keys data from knowledge engine
 */

const generator = require('../visualization/generators/gene-keys-ring.js');
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

console.log('\n=== Gene Keys Ring Generator Tests ===\n');

// ============================================================================
// Test 1: Ring Geometry Constants
// ============================================================================
console.log('1. Ring Geometry Constants');

test('Center matches master', () => {
  assertClose(generator.CENTER.x, 1985.3602, 0.01);
  assertClose(generator.CENTER.y, 1985.3602, 0.01);
});

test('Shadows ring radii match master', () => {
  assertClose(generator.RINGS.shadows.innerRadius, 1730.5472, 0.01);
  assertClose(generator.RINGS.shadows.outerRadius, 1782.4786, 0.01);
});

test('Gifts ring radii match master', () => {
  assertClose(generator.RINGS.gifts.innerRadius, 1784.2557, 0.01);
  assertClose(generator.RINGS.gifts.outerRadius, 1835.9456, 0.01);
});

test('Siddhis ring radii match master', () => {
  assertClose(generator.RINGS.siddhis.innerRadius, 1837.7815, 0.01);
  assertClose(generator.RINGS.siddhis.outerRadius, 1889.9038, 0.01);
});

test('Rings are concentric (no overlaps)', () => {
  // Shadows outer < Gifts inner
  if (generator.RINGS.shadows.outerRadius >= generator.RINGS.gifts.innerRadius) {
    throw new Error('Shadows and Gifts rings overlap');
  }
  // Gifts outer < Siddhis inner
  if (generator.RINGS.gifts.outerRadius >= generator.RINGS.siddhis.innerRadius) {
    throw new Error('Gifts and Siddhis rings overlap');
  }
});

test('Band widths are calculated correctly', () => {
  const shadowsBand = generator.RINGS.shadows.outerRadius - generator.RINGS.shadows.innerRadius;
  assertClose(generator.RINGS.shadows.bandWidth, shadowsBand, 0.01);

  const giftsBand = generator.RINGS.gifts.outerRadius - generator.RINGS.gifts.innerRadius;
  assertClose(generator.RINGS.gifts.bandWidth, giftsBand, 0.01);

  const siddhisBand = generator.RINGS.siddhis.outerRadius - generator.RINGS.siddhis.innerRadius;
  assertClose(generator.RINGS.siddhis.bandWidth, siddhisBand, 0.01);
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

test('Shadows font size is ~21.27px', () => {
  assertClose(generator.FONT.shadows.standard, 21.276, 0.01);
});

test('Gifts font size is ~21.23px', () => {
  assertClose(generator.FONT.gifts.standard, 21.2335, 0.01);
});

test('Siddhis font size is ~21.25px', () => {
  assertClose(generator.FONT.siddhis.standard, 21.2493, 0.01);
});

test('Vertical scale matches master', () => {
  assertClose(generator.FONT.verticalScale, 1.2, 0.01);
});

// ============================================================================
// Test 3: Gene Keys Data from Knowledge Engine
// ============================================================================
console.log('\n3. Gene Keys Data from Knowledge Engine');

test('All 64 gates have Gene Keys data', () => {
  for (let gate = 1; gate <= 64; gate++) {
    const knowledge = engine.getGateKnowledge(gate);
    if (!knowledge.geneKeys) {
      throw new Error(`Gate ${gate} missing Gene Keys data`);
    }
  }
});

test('All 64 gates have shadow values', () => {
  for (let gate = 1; gate <= 64; gate++) {
    const knowledge = engine.getGateKnowledge(gate);
    if (!knowledge.geneKeys.shadow) {
      throw new Error(`Gate ${gate} missing shadow`);
    }
  }
});

test('All 64 gates have gift values', () => {
  for (let gate = 1; gate <= 64; gate++) {
    const knowledge = engine.getGateKnowledge(gate);
    if (!knowledge.geneKeys.gift) {
      throw new Error(`Gate ${gate} missing gift`);
    }
  }
});

test('All 64 gates have siddhi values', () => {
  for (let gate = 1; gate <= 64; gate++) {
    const knowledge = engine.getGateKnowledge(gate);
    if (!knowledge.geneKeys.siddhi) {
      throw new Error(`Gate ${gate} missing siddhi`);
    }
  }
});

test('Known Gene Keys values are correct', () => {
  const expectedValues = {
    1: { shadow: 'Entropy', gift: 'Freshness', siddhi: 'Beauty' },
    2: { shadow: 'Dislocation', gift: 'Orientation', siddhi: 'Unity' },
    41: { shadow: 'Fantasy', gift: 'Anticipation', siddhi: 'Emanation' },
    64: { shadow: 'Confusion', gift: 'Imagination', siddhi: 'Illumination' }
  };

  for (const [gateStr, expected] of Object.entries(expectedValues)) {
    const gate = parseInt(gateStr);
    const knowledge = engine.getGateKnowledge(gate);
    assertEqual(knowledge.geneKeys.shadow, expected.shadow, `Gate ${gate} shadow`);
    assertEqual(knowledge.geneKeys.gift, expected.gift, `Gate ${gate} gift`);
    assertEqual(knowledge.geneKeys.siddhi, expected.siddhi, `Gate ${gate} siddhi`);
  }
});

// ============================================================================
// Test 4: Position Calculation
// ============================================================================
console.log('\n4. Position Calculation');

test('Position formula produces valid coordinates for shadows', () => {
  const v3Data = positioning.getDockingData(41, 1);
  const pos = generator.calculatePosition(v3Data.angle, generator.RINGS.shadows.midRadius);

  // Position should be at midRadius distance from center
  const distFromCenter = Math.sqrt(
    Math.pow(pos.x - generator.CENTER.x, 2) +
    Math.pow(pos.y - generator.CENTER.y, 2)
  );

  assertClose(distFromCenter, generator.RINGS.shadows.midRadius, 1, 'Should be at shadows mid radius');
});

test('Position formula produces valid coordinates for gifts', () => {
  const v3Data = positioning.getDockingData(1, 1);
  const pos = generator.calculatePosition(v3Data.angle, generator.RINGS.gifts.midRadius);

  const distFromCenter = Math.sqrt(
    Math.pow(pos.x - generator.CENTER.x, 2) +
    Math.pow(pos.y - generator.CENTER.y, 2)
  );

  assertClose(distFromCenter, generator.RINGS.gifts.midRadius, 1, 'Should be at gifts mid radius');
});

test('Position formula produces valid coordinates for siddhis', () => {
  const v3Data = positioning.getDockingData(64, 1);
  const pos = generator.calculatePosition(v3Data.angle, generator.RINGS.siddhis.midRadius);

  const distFromCenter = Math.sqrt(
    Math.pow(pos.x - generator.CENTER.x, 2) +
    Math.pow(pos.y - generator.CENTER.y, 2)
  );

  assertClose(distFromCenter, generator.RINGS.siddhis.midRadius, 1, 'Should be at siddhis mid radius');
});

test('All 64 gates have unique positions', () => {
  const positions = [];

  for (let gate = 1; gate <= 64; gate++) {
    const v3Data = positioning.getDockingData(gate, 1);
    const pos = generator.calculatePosition(v3Data.angle, generator.RINGS.shadows.midRadius);
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
// Test 6: SVG Generation
// ============================================================================
console.log('\n6. SVG Generation');

test('generateGeneKeysRing produces valid SVG', () => {
  const svg = generator.generateGeneKeysRing();

  if (!svg.startsWith('<svg')) {
    throw new Error('Output should start with <svg');
  }
  if (!svg.endsWith('</svg>')) {
    throw new Error('Output should end with </svg>');
  }
});

test('Generated SVG contains all 64 gates in each ring', () => {
  const svg = generator.generateGeneKeysRing();

  for (let gate = 1; gate <= 64; gate++) {
    // Each gate should appear 3 times (shadow, gift, siddhi)
    const gateMatches = svg.match(new RegExp(`data-gate="${gate}"`, 'g'));
    if (!gateMatches || gateMatches.length !== 3) {
      throw new Error(`Gate ${gate} should appear exactly 3 times (once per ring)`);
    }
  }
});

test('Generated SVG includes shadow group', () => {
  const svg = generator.generateGeneKeysRing();

  if (!svg.includes('id="GROUP_64_SHADOWS"')) {
    throw new Error('Missing shadow group');
  }
});

test('Generated SVG includes gift group', () => {
  const svg = generator.generateGeneKeysRing();

  if (!svg.includes('id="GROUP_64_GIFTS"')) {
    throw new Error('Missing gift group');
  }
});

test('Generated SVG includes siddhi group', () => {
  const svg = generator.generateGeneKeysRing();

  if (!svg.includes('id="GROUP_64_SIDDHIS"')) {
    throw new Error('Missing siddhi group');
  }
});

test('Generated SVG includes font specifications', () => {
  const svg = generator.generateGeneKeysRing();

  if (!svg.includes('font-family="Copperplate-Bold, Copperplate"')) {
    throw new Error('Missing font-family');
  }
  if (!svg.includes('font-weight="700"')) {
    throw new Error('Missing font-weight');
  }
});

test('Generated SVG includes specific Gene Keys values', () => {
  const svg = generator.generateGeneKeysRing();

  // Check for known shadow values
  if (!svg.includes('data-shadow="Entropy"')) {
    throw new Error('Missing Entropy (Gate 1 shadow)');
  }
  if (!svg.includes('data-shadow="Fantasy"')) {
    throw new Error('Missing Fantasy (Gate 41 shadow)');
  }

  // Check for known gift values
  if (!svg.includes('data-gift="Freshness"')) {
    throw new Error('Missing Freshness (Gate 1 gift)');
  }

  // Check for known siddhi values
  if (!svg.includes('data-siddhi="Beauty"')) {
    throw new Error('Missing Beauty (Gate 1 siddhi)');
  }
});

// ============================================================================
// Test 7: Consistency with Other Ring Generators
// ============================================================================
console.log('\n7. Consistency with Other Ring Generators');

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
// Test 8: Text Splitting
// ============================================================================
console.log('\n8. Text Splitting');

test('Single words are not split', () => {
  const lines = generator.splitForDisplay('Entropy');
  assertEqual(lines.length, 1);
  assertEqual(lines[0], 'Entropy');
});

test('Self-Obsession splits correctly', () => {
  const lines = generator.splitForDisplay('Self-Obsession');
  assertEqual(lines.length, 2);
  assertEqual(lines[0], 'Self');
  assertEqual(lines[1], 'Obsession');
});

test('Dissatisfaction splits correctly', () => {
  const lines = generator.splitForDisplay('Dissatisfaction');
  assertEqual(lines.length, 2);
  assertEqual(lines[0], 'Dis-');
  assertEqual(lines[1], 'satisfaction');
});

test('Half-Heartedness splits correctly', () => {
  const lines = generator.splitForDisplay('Half-Heartedness');
  assertEqual(lines.length, 2);
  assertEqual(lines[0], 'Half');
  assertEqual(lines[1], 'Heartedness');
});

test('Far-Sightedness splits correctly', () => {
  const lines = generator.splitForDisplay('Far-Sightedness');
  assertEqual(lines.length, 2);
  assertEqual(lines[0], 'Far');
  assertEqual(lines[1], 'Sightedness');
});

test('Superficiality splits correctly', () => {
  const lines = generator.splitForDisplay('Superficiality');
  assertEqual(lines.length, 2);
  assertEqual(lines[0], 'Super-');
  assertEqual(lines[1], 'ficiality');
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
  console.log('\n✓ All Gene Keys ring generator tests passed.');
  console.log('  The generator is correctly docked to V3.');
}
