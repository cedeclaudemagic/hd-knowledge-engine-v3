/**
 * Incarnation Crosses Ring Generator Tests
 *
 * Verifies the translation chain from crosses display mapping to SVG output:
 * - Ring geometry (3 text bands: RAX, JX, LAX)
 * - Position calculation (personality sun gate → SVG coordinates)
 * - Rotation calculation (single formula for all 192 crosses)
 * - Cross data (type, name, gates)
 */

const generator = require('../visualization/generators/incarnation-crosses-ring.js');
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

console.log('\n=== Incarnation Crosses Ring Generator Tests ===\n');

// ============================================================================
// Test 1: Ring Geometry Constants
// ============================================================================
console.log('1. Ring Geometry Constants');

test('Center matches master', () => {
  assertClose(generator.CENTER.x, 2269.7216, 0.01);
  assertClose(generator.CENTER.y, 2269.9519, 0.01);
});

test('Ring radii match master', () => {
  assertClose(generator.RING_RADII.bottom, 2000.1011, 0.01);
  assertClose(generator.RING_RADII.lowerInner, 2086.5709, 0.01);
  assertClose(generator.RING_RADII.upperInner, 2177.8085, 0.01);
  assertClose(generator.RING_RADII.top, 2266.954, 0.01);
});

test('RAX band is innermost', () => {
  assertEqual(generator.BANDS.rax.innerRadius, generator.RING_RADII.bottom);
  assertEqual(generator.BANDS.rax.outerRadius, generator.RING_RADII.lowerInner);
});

test('JX band is in middle', () => {
  assertEqual(generator.BANDS.jx.innerRadius, generator.RING_RADII.lowerInner);
  assertEqual(generator.BANDS.jx.outerRadius, generator.RING_RADII.upperInner);
});

test('LAX band is outermost', () => {
  assertEqual(generator.BANDS.lax.innerRadius, generator.RING_RADII.upperInner);
  assertEqual(generator.BANDS.lax.outerRadius, generator.RING_RADII.top);
});

test('Bands are non-overlapping', () => {
  if (generator.BANDS.rax.outerRadius > generator.BANDS.jx.innerRadius) {
    throw new Error('RAX and JX bands overlap');
  }
  if (generator.BANDS.jx.outerRadius > generator.BANDS.lax.innerRadius) {
    throw new Error('JX and LAX bands overlap');
  }
});

// ============================================================================
// Test 2: Crosses Data
// ============================================================================
console.log('\n2. Crosses Data');

test('Total of 192 crosses', () => {
  assertEqual(generator.crossesData.statistics.totalCrosses, 192);
});

test('64 JX crosses', () => {
  assertEqual(generator.crossesData.statistics.juxtaposition, 64);
});

test('64 RAX crosses', () => {
  assertEqual(generator.crossesData.statistics.rightAngle, 64);
});

test('64 LAX crosses', () => {
  assertEqual(generator.crossesData.statistics.leftAngle, 64);
});

test('Each cross has required fields', () => {
  for (const cross of generator.crossesData.crosses) {
    if (!cross.type) throw new Error('Missing type');
    if (!cross.name) throw new Error('Missing name');
    if (!cross.personalitySun) throw new Error('Missing personalitySun');
    if (!cross.personalityEarth) throw new Error('Missing personalityEarth');
    if (!cross.designSun) throw new Error('Missing designSun');
    if (!cross.designEarth) throw new Error('Missing designEarth');
  }
});

// ============================================================================
// Test 3: Cross Lookup Functions
// ============================================================================
console.log('\n3. Cross Lookup Functions');

test('getCross finds JX by personality sun', () => {
  const cross = generator.getCross('JX', 1);
  assertEqual(cross.name, 'Self-Expression');
  assertEqual(cross.personalitySun, 1);
});

test('getCross finds RAX by personality sun', () => {
  const cross = generator.getCross('RAX', 1);
  if (!cross || cross.type !== 'RAX') {
    throw new Error('Could not find RAX cross for gate 1');
  }
});

test('getCross finds LAX by personality sun', () => {
  const cross = generator.getCross('LAX', 1);
  if (!cross || cross.type !== 'LAX') {
    throw new Error('Could not find LAX cross for gate 1');
  }
});

test('getCrossesAtPosition returns all three types', () => {
  const crosses = generator.getCrossesAtPosition(41);
  if (!crosses.jx) throw new Error('Missing JX');
  if (!crosses.rax) throw new Error('Missing RAX');
  if (!crosses.lax) throw new Error('Missing LAX');
});

// ============================================================================
// Test 4: Display Functions
// ============================================================================
console.log('\n4. Display Functions');

test('getDisplayPrefix formats JX correctly', () => {
  assertEqual(generator.getDisplayPrefix('JX'), 'Jx');
});

test('getDisplayPrefix formats RAX correctly', () => {
  assertEqual(generator.getDisplayPrefix('RAX'), 'Rax');
});

test('getDisplayPrefix formats LAX correctly', () => {
  assertEqual(generator.getDisplayPrefix('LAX'), 'Lax');
});

test('formatGates produces correct format', () => {
  const cross = { personalitySun: 10, personalityEarth: 15, designSun: 18, designEarth: 17 };
  assertEqual(generator.formatGates(cross), '10/15 - 18/17');
});

// ============================================================================
// Test 5: Position Calculation
// ============================================================================
console.log('\n5. Position Calculation');

test('Position formula produces valid coordinates', () => {
  const v3Data = positioning.getDockingData(41, 1);
  const pos = generator.calculatePosition(v3Data.angle, generator.BANDS.jx.midRadius);

  // Position should be at midRadius distance from center
  const distFromCenter = Math.sqrt(
    Math.pow(pos.x - generator.CENTER.x, 2) +
    Math.pow(pos.y - generator.CENTER.y, 2)
  );

  assertClose(distFromCenter, generator.BANDS.jx.midRadius, 1, 'Should be at JX mid radius');
});

test('Text positions match master SVG (at ~72% not 50%)', () => {
  // Master SVG positions text at ~72% from inner edge, not band center
  // These values extracted from the-192-crosses-verified-master.svg
  assertClose(generator.BANDS.rax.midRadius, 2062.27, 0.5, 'RAX text radius');
  assertClose(generator.BANDS.jx.midRadius, 2152.06, 0.5, 'JX text radius');
  assertClose(generator.BANDS.lax.midRadius, 2239.45, 0.5, 'LAX text radius');
});

test('All 64 positions are unique', () => {
  const positions = [];

  for (let gate = 1; gate <= 64; gate++) {
    const v3Data = positioning.getDockingData(gate, 1);
    const pos = generator.calculatePosition(v3Data.angle, generator.BANDS.jx.midRadius);
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

// ============================================================================
// Test 7: SVG Generation
// ============================================================================
console.log('\n7. SVG Generation');

test('generateIncarnationCrossesRing produces valid SVG', () => {
  const svg = generator.generateIncarnationCrossesRing();

  if (!svg.startsWith('<svg')) {
    throw new Error('Output should start with <svg');
  }
  if (!svg.endsWith('</svg>')) {
    throw new Error('Output should end with </svg>');
  }
});

test('Generated SVG contains 192 crosses', () => {
  const svg = generator.generateIncarnationCrossesRing();

  const crossMatches = svg.match(/data-cross-type=/g);
  if (!crossMatches || crossMatches.length !== 192) {
    throw new Error(`Expected 192 crosses, found ${crossMatches ? crossMatches.length : 0}`);
  }
});

test('Generated SVG includes all three groups', () => {
  const svg = generator.generateIncarnationCrossesRing();

  if (!svg.includes('id="GROUP_64_JX"')) {
    throw new Error('Missing JX group');
  }
  if (!svg.includes('id="GROUP_64_RAX"')) {
    throw new Error('Missing RAX group');
  }
  if (!svg.includes('id="GROUP_64_LAX"')) {
    throw new Error('Missing LAX group');
  }
});

test('Generated SVG includes font specifications', () => {
  const svg = generator.generateIncarnationCrossesRing();

  if (!svg.includes('font-family="Copperplate-Bold, Copperplate"')) {
    throw new Error('Missing font-family');
  }
  if (!svg.includes('font-weight="700"')) {
    throw new Error('Missing font-weight');
  }
});

test('Generated SVG includes cross names', () => {
  const svg = generator.generateIncarnationCrossesRing();

  // Check for known cross names
  if (!svg.includes('data-cross-name="Self-Expression"')) {
    throw new Error('Missing Self-Expression cross');
  }
  if (!svg.includes('data-cross-name="The Driver"')) {
    throw new Error('Missing The Driver cross');
  }
});

test('Generated SVG includes gate numbers', () => {
  const svg = generator.generateIncarnationCrossesRing();

  // Check for gate number format
  if (!svg.includes('data-personality-sun=')) {
    throw new Error('Missing personality sun attribute');
  }
  if (!svg.includes('data-design-earth=')) {
    throw new Error('Missing design earth attribute');
  }
});

// ============================================================================
// Test 8: Tick Mark Dividers
// ============================================================================
console.log('\n8. Tick Mark Dividers');

test('Generated SVG has 64 divider groups', () => {
  const svg = generator.generateIncarnationCrossesRing();
  const dividerGroups = svg.match(/id="_\d+"/g);
  if (!dividerGroups || dividerGroups.length !== 64) {
    throw new Error(`Expected 64 divider groups, found ${dividerGroups ? dividerGroups.length : 0}`);
  }
});

test('Each divider has 4 tick marks (256 total)', () => {
  const svg = generator.generateIncarnationCrossesRing();
  // Count total tick lines (BOTTOM, LOWER_INNER, UPPER_INNER, TOP)
  // 64 gates * 4 ticks each = 256 tick lines
  const allLines = svg.match(/<line id="(BOTTOM|LOWER_INNER|UPPER_INNER|TOP)"/g);
  if (!allLines || allLines.length !== 256) {
    throw new Error(`Expected 256 tick lines, found ${allLines ? allLines.length : 0}`);
  }
});

test('Tick marks are approximately 30px long', () => {
  const svg = generator.generateIncarnationCrossesRing();

  // Extract first BOTTOM tick line coordinates
  const bottomMatch = svg.match(/<line id="BOTTOM" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/);
  if (!bottomMatch) throw new Error('Could not find BOTTOM tick');

  const x1 = parseFloat(bottomMatch[1]);
  const y1 = parseFloat(bottomMatch[2]);
  const x2 = parseFloat(bottomMatch[3]);
  const y2 = parseFloat(bottomMatch[4]);

  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  assertClose(length, 30, 0.5, 'Tick should be ~30px');
});

test('Tick marks match master positions within 1px', () => {
  // Master divider for gate 41 boundary (from the-192-crosses-verified-master.svg)
  const masterTicks = {
    bottom: { x1: 1143.3135, y1: 583.8081 },
    lowerInner: { x1: 1098.4897, y1: 516.7247 },
    upperInner: { x1: 1053.6663, y1: 449.6414 },
    top: { x1: 1008.8426, y1: 382.5581 }
  };

  const svg = generator.generateIncarnationCrossesRing();

  // Find gate 41 divider group
  const gate41Match = svg.match(/<g id="_41"[^>]*>([\s\S]*?)<\/g>/);
  if (!gate41Match) throw new Error('Could not find gate 41 divider');

  const gate41Content = gate41Match[1];

  // Extract BOTTOM tick
  const bottomMatch = gate41Content.match(/<line id="BOTTOM" x1="([\d.]+)" y1="([\d.]+)"/);
  if (!bottomMatch) throw new Error('Could not find BOTTOM tick in gate 41');

  const genX1 = parseFloat(bottomMatch[1]);
  const genY1 = parseFloat(bottomMatch[2]);

  // Check position matches master within 1px
  const xDiff = Math.abs(genX1 - masterTicks.bottom.x1);
  const yDiff = Math.abs(genY1 - masterTicks.bottom.y1);

  if (xDiff > 1 || yDiff > 1) {
    throw new Error(`Gate 41 BOTTOM tick position differs by (${xDiff.toFixed(2)}, ${yDiff.toFixed(2)}) from master`);
  }
});

// ============================================================================
// Test 9: Consistency with Other Ring Generators
// ============================================================================
console.log('\n9. Consistency with Other Ring Generators');

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
// Summary
// ============================================================================
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\n⚠️  Some tests failed.');
  process.exit(1);
} else {
  console.log('\n✓ All incarnation crosses ring generator tests passed.');
  console.log('  The generator is correctly docked to crosses display mapping.');
}
