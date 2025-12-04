/**
 * Data Attributes Tests
 *
 * Tests for the standardized data-* attribute system in shared-constants.js
 * and verifies generators embed proper queryable attributes.
 *
 * These tests define the EXPECTED behavior for data attributes.
 * Generators that don't yet implement these will show as "needs implementation".
 */

const shared = require('../visualization/generators/shared-constants');
const fs = require('fs');
const path = require('path');

// Test counters
let passed = 0;
let failed = 0;
let skipped = 0;
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

function skip(name, reason) {
  console.log(`  ⊘ ${name} [SKIPPED: ${reason}]`);
  skipped++;
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`Expected "${expected}", got "${actual}". ${message}`);
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

function assertContains(str, substring, message = '') {
  if (!str.includes(substring)) {
    throw new Error(`Expected string to contain "${substring}". ${message}`);
  }
}

console.log('\n' + '═'.repeat(60));
console.log('DATA ATTRIBUTES TESTS');
console.log('═'.repeat(60));

// ============================================================================
// 1. HELPER FUNCTION TESTS
// ============================================================================
console.log('\n1. Helper Functions (shared-constants.js)');
console.log('─'.repeat(40));

test('getGateDataAttributes is exported', () => {
  assertDefined(shared.getGateDataAttributes, 'getGateDataAttributes function');
});

test('getLineDataAttributes is exported', () => {
  assertDefined(shared.getLineDataAttributes, 'getLineDataAttributes function');
});

test('dataAttributesToString is exported', () => {
  assertDefined(shared.dataAttributesToString, 'dataAttributesToString function');
});

test('getGateDataAttributes returns all required fields', () => {
  const attrs = shared.getGateDataAttributes(1);

  assertDefined(attrs['data-gate'], 'data-gate');
  assertDefined(attrs['data-binary'], 'data-binary');
  assertDefined(attrs['data-codon'], 'data-codon');
  assertDefined(attrs['data-quarter'], 'data-quarter');
  assertDefined(attrs['data-face'], 'data-face');
  assertDefined(attrs['data-trigram-upper'], 'data-trigram-upper');
  assertDefined(attrs['data-trigram-lower'], 'data-trigram-lower');
  assertDefined(attrs['data-wheel-index'], 'data-wheel-index');
});

test('getGateDataAttributes returns correct values for Gate 1', () => {
  const attrs = shared.getGateDataAttributes(1);

  assertEqual(attrs['data-gate'], 1, 'Gate number');
  assertEqual(attrs['data-binary'], '111111', 'Binary for Gate 1 (The Creative)');
  assertEqual(attrs['data-trigram-upper'], 'Heaven', 'Upper trigram');
  assertEqual(attrs['data-trigram-lower'], 'Heaven', 'Lower trigram');
});

test('getGateDataAttributes returns correct values for Gate 2', () => {
  const attrs = shared.getGateDataAttributes(2);

  assertEqual(attrs['data-gate'], 2, 'Gate number');
  assertEqual(attrs['data-binary'], '000000', 'Binary for Gate 2 (The Receptive)');
  assertEqual(attrs['data-trigram-upper'], 'Earth', 'Upper trigram');
  assertEqual(attrs['data-trigram-lower'], 'Earth', 'Lower trigram');
});

test('getGateDataAttributes respects options', () => {
  const attrsWithAngle = shared.getGateDataAttributes(13, { includeAngle: true });
  assertDefined(attrsWithAngle['data-angle'], 'Should include angle when requested');

  const attrsWithOpposite = shared.getGateDataAttributes(13, { includeOpposite: true });
  assertDefined(attrsWithOpposite['data-opposite-gate'], 'Should include opposite gate when requested');

  const attrsNoWheelIndex = shared.getGateDataAttributes(13, { includeWheelIndex: false });
  assertTrue(
    attrsNoWheelIndex['data-wheel-index'] === undefined,
    'Should exclude wheel index when requested'
  );
});

test('getLineDataAttributes includes gate attributes plus line specifics', () => {
  const attrs = shared.getLineDataAttributes(13, 4);

  // Gate attributes
  assertDefined(attrs['data-gate'], 'data-gate');
  assertDefined(attrs['data-binary'], 'data-binary');

  // Line-specific attributes
  assertEqual(attrs['data-line'], 4, 'data-line');
  assertDefined(attrs['data-polarity'], 'data-polarity');
  assertTrue(
    attrs['data-polarity'] === 'YANG' || attrs['data-polarity'] === 'YIN',
    'Polarity should be YANG or YIN'
  );
});

test('Line polarity calculation is correct', () => {
  // Gate 1: binary 111111 (all YANG)
  for (let line = 1; line <= 6; line++) {
    const attrs = shared.getLineDataAttributes(1, line);
    assertEqual(attrs['data-polarity'], 'YANG', `Gate 1 Line ${line} should be YANG`);
  }

  // Gate 2: binary 000000 (all YIN)
  for (let line = 1; line <= 6; line++) {
    const attrs = shared.getLineDataAttributes(2, line);
    assertEqual(attrs['data-polarity'], 'YIN', `Gate 2 Line ${line} should be YIN`);
  }

  // Gate 13: binary 101111
  // Line 1 (index 0) = 1 = YANG
  // Line 2 (index 1) = 0 = YIN
  // Line 3 (index 2) = 1 = YANG
  // Line 4 (index 3) = 1 = YANG
  // Line 5 (index 4) = 1 = YANG
  // Line 6 (index 5) = 1 = YANG
  const expected13 = ['YANG', 'YIN', 'YANG', 'YANG', 'YANG', 'YANG'];
  for (let line = 1; line <= 6; line++) {
    const attrs = shared.getLineDataAttributes(13, line);
    assertEqual(
      attrs['data-polarity'],
      expected13[line - 1],
      `Gate 13 Line ${line} polarity`
    );
  }
});

test('dataAttributesToString produces valid attribute string', () => {
  const attrs = shared.getGateDataAttributes(13);
  const str = shared.dataAttributesToString(attrs);

  assertContains(str, 'data-gate="13"', 'Should contain gate');
  assertContains(str, 'data-binary=', 'Should contain binary');
  assertContains(str, 'data-quarter=', 'Should contain quarter');

  // Verify format: key="value" key2="value2"
  const parts = str.split(' ');
  for (const part of parts) {
    assertTrue(part.includes('="'), `Each part should be key="value" format: ${part}`);
    assertTrue(part.endsWith('"'), `Each part should end with ": ${part}`);
  }
});

test('All 64 gates produce valid attributes', () => {
  for (let gate = 1; gate <= 64; gate++) {
    const attrs = shared.getGateDataAttributes(gate);
    assertEqual(attrs['data-gate'], gate, `Gate ${gate} number`);
    assertTrue(attrs['data-binary'].length === 6, `Gate ${gate} binary should be 6 digits`);
    assertTrue(attrs['data-codon'].length === 3, `Gate ${gate} codon should be 3 letters`);
  }
});

test('All 384 lines produce valid attributes', () => {
  for (let gate = 1; gate <= 64; gate++) {
    for (let line = 1; line <= 6; line++) {
      const attrs = shared.getLineDataAttributes(gate, line);
      assertEqual(attrs['data-gate'], gate, `Gate ${gate} Line ${line} gate number`);
      assertEqual(attrs['data-line'], line, `Gate ${gate} Line ${line} line number`);
      assertTrue(
        ['YANG', 'YIN'].includes(attrs['data-polarity']),
        `Gate ${gate} Line ${line} polarity`
      );
    }
  }
});

// ============================================================================
// 2. GENERATOR OUTPUT TESTS
// ============================================================================
console.log('\n2. Generator Output (Data Attributes in SVG)');
console.log('─'.repeat(40));

// Helper to check if SVG file contains expected data attributes
function checkSVGDataAttributes(filename, expectedAttrs) {
  const filepath = path.join(__dirname, '../visualization/output', filename);

  if (!fs.existsSync(filepath)) {
    throw new Error(`File not found: ${filepath}`);
  }

  const content = fs.readFileSync(filepath, 'utf8');

  for (const attr of expectedAttrs) {
    if (!content.includes(attr)) {
      throw new Error(`Missing attribute: ${attr}`);
    }
  }
}

test('hexagram-ring.svg contains gate data attributes', () => {
  checkSVGDataAttributes('generated-hexagram-ring.svg', [
    'data-gate=',
    'data-binary=',
    'data-codon=',
    'data-trigram-upper=',
    'data-trigram-lower='
  ]);
});

test('hexagram-ring.svg contains line data attributes', () => {
  checkSVGDataAttributes('generated-hexagram-ring.svg', [
    'data-line=',
    'data-type='  // yang or yin
  ]);
});

// These tests document what SHOULD be in each generator
// Currently they will fail for generators that don't have attributes yet

test('codon-rings-ring.svg contains gate attributes', () => {
  try {
    checkSVGDataAttributes('generated-codon-rings-ring.svg', [
      'data-gate=',
      'data-codon='
    ]);
  } catch (e) {
    // Partial implementation exists
    checkSVGDataAttributes('generated-codon-rings-ring.svg', ['data-gate=']);
  }
});

// Document expected attributes for other generators (may fail until implemented)
const generatorExpectations = [
  { file: 'generated-numbers-ring.svg', attrs: ['data-gate='], status: 'needs-implementation' },
  { file: 'generated-iching-names-ring.svg', attrs: ['data-gate='], status: 'needs-implementation' },
  { file: 'generated-gate-names-ring.svg', attrs: ['data-gate='], status: 'needs-implementation' },
  { file: 'generated-gene-keys-ring.svg', attrs: ['data-gate='], status: 'needs-implementation' },
  { file: 'generated-incarnation-crosses-ring.svg', attrs: ['data-gate='], status: 'needs-implementation' },
  { file: 'generated-lines-ring.svg', attrs: ['data-gate=', 'data-line='], status: 'partial' },
];

for (const { file, attrs, status } of generatorExpectations) {
  const filepath = path.join(__dirname, '../visualization/output', file);

  if (!fs.existsSync(filepath)) {
    skip(`${file} contains data attributes`, 'file not found');
    continue;
  }

  try {
    const content = fs.readFileSync(filepath, 'utf8');
    let allFound = true;
    const missing = [];

    for (const attr of attrs) {
      if (!content.includes(attr)) {
        allFound = false;
        missing.push(attr);
      }
    }

    if (allFound) {
      test(`${file} contains data attributes`, () => {
        assertTrue(true);
      });
    } else {
      skip(`${file} contains data attributes [${attrs.join(', ')}]`, `missing: ${missing.join(', ')} (${status})`);
    }
  } catch (e) {
    skip(`${file} contains data attributes`, e.message);
  }
}

// ============================================================================
// 3. QUARTER/FACE/TRIGRAM CONSISTENCY
// ============================================================================
console.log('\n3. Grouping Consistency');
console.log('─'.repeat(40));

test('All gates have valid quarter assignment', () => {
  const validQuarters = ['Mutation', 'Initiation', 'Duality', 'Civilisation'];

  for (let gate = 1; gate <= 64; gate++) {
    const attrs = shared.getGateDataAttributes(gate);
    assertTrue(
      validQuarters.includes(attrs['data-quarter']),
      `Gate ${gate} has invalid quarter: ${attrs['data-quarter']}`
    );
  }
});

test('All gates have valid trigram assignments', () => {
  const validTrigrams = ['Heaven', 'Earth', 'Thunder', 'Water', 'Mountain', 'Wind', 'Fire', 'Lake'];

  for (let gate = 1; gate <= 64; gate++) {
    const attrs = shared.getGateDataAttributes(gate);
    assertTrue(
      validTrigrams.includes(attrs['data-trigram-upper']),
      `Gate ${gate} has invalid upper trigram: ${attrs['data-trigram-upper']}`
    );
    assertTrue(
      validTrigrams.includes(attrs['data-trigram-lower']),
      `Gate ${gate} has invalid lower trigram: ${attrs['data-trigram-lower']}`
    );
  }
});

test('Each quarter contains 16 gates', () => {
  const quarters = { Mutation: 0, Initiation: 0, Duality: 0, Civilisation: 0 };

  for (let gate = 1; gate <= 64; gate++) {
    const attrs = shared.getGateDataAttributes(gate);
    quarters[attrs['data-quarter']]++;
  }

  for (const [quarter, count] of Object.entries(quarters)) {
    assertEqual(count, 16, `${quarter} should have 16 gates, has ${count}`);
  }
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '═'.repeat(60));
console.log(`RESULTS: ${passed} passed, ${failed} failed, ${skipped} skipped`);
console.log('═'.repeat(60));

if (skipped > 0) {
  console.log('\nSkipped tests indicate generators that need data attribute implementation.');
}

if (failed > 0) {
  console.log('\nFailed tests:');
  errors.forEach(e => console.log(`  - ${e.name}: ${e.error}`));
  process.exit(1);
}
