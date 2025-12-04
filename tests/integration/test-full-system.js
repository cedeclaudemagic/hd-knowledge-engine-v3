/**
 * Full System Integration Tests
 *
 * Tests the complete integration between:
 * - V3 Knowledge Engine (unified-query-engine.js)
 * - Visualization System (generators, assembler)
 * - Data Attributes (shared-constants.js helpers)
 *
 * These tests verify end-to-end functionality.
 */

console.log('═'.repeat(60));
console.log('FULL SYSTEM INTEGRATION TESTS');
console.log('═'.repeat(60));

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

// ============================================================================
// 1. KNOWLEDGE ENGINE → VISUALIZATION INTEGRATION
// ============================================================================
console.log('\n1. Knowledge Engine → Visualization Integration');
console.log('─'.repeat(40));

test('V3 Engine loads correctly', () => {
  const engine = require('../../unified-query-engine');
  assertDefined(engine.getGateKnowledge, 'getGateKnowledge function');
});

test('Visualization core loads correctly', () => {
  const viz = require('../../visualization');
  assertDefined(viz.SVGDocument, 'SVGDocument class');
  assertDefined(viz.AttributeMapper, 'AttributeMapper class');
});

test('Shared constants loads correctly', () => {
  const shared = require('../../visualization/generators/shared-constants');
  assertDefined(shared.getGateDataAttributes, 'getGateDataAttributes');
  assertDefined(shared.COLORS, 'COLORS');
});

test('Data from V3 matches shared-constants helper', () => {
  const engine = require('../../unified-query-engine');
  const shared = require('../../visualization/generators/shared-constants');

  // Get data from both sources for Gate 13
  const v3Data = engine.getGateKnowledge(13);
  const sharedAttrs = shared.getGateDataAttributes(13);

  // Verify consistency
  assertEqual(v3Data.binary, sharedAttrs['data-binary'], 'Binary should match');
  assertEqual(v3Data.codon, sharedAttrs['data-codon'], 'Codon should match');
  assertEqual(v3Data.quarter, sharedAttrs['data-quarter'], 'Quarter should match');
});

// ============================================================================
// 2. GENERATOR INTEGRATION
// ============================================================================
console.log('\n2. Generator Integration');
console.log('─'.repeat(40));

test('Hexagram generator produces valid SVG', () => {
  const generator = require('../../visualization/generators/hexagram-ring');
  const svg = generator.generateHexagramRing();

  assertTrue(svg.includes('<svg'), 'Should produce SVG');
  assertTrue(svg.includes('data-gate='), 'Should include data attributes');
});

test('Numbers generator produces valid SVG', () => {
  const generator = require('../../visualization/generators/numbers-ring');
  const svg = generator.generateNumbersRing();

  assertTrue(svg.includes('<svg'), 'Should produce SVG');
  assertTrue(svg.includes('</svg>'), 'Should close SVG tag');
});

test('Ring assembler can compose multiple rings', () => {
  const assembler = require('../../visualization/generators/ring-assembler');

  const svg = assembler.assembleRings({
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding: 0,
    rings: ['numbers'],
    includeBackground: false
  });

  assertTrue(svg.includes('<svg'), 'Should produce SVG');
  assertTrue(svg.includes('numbers-ring'), 'Should include numbers ring');
});

// ============================================================================
// 3. FULL PIPELINE TEST
// ============================================================================
console.log('\n3. Full Pipeline Test');
console.log('─'.repeat(40));

test('Complete query → attributes → SVG pipeline', () => {
  const engine = require('../../unified-query-engine');
  const shared = require('../../visualization/generators/shared-constants');

  // Query knowledge for all gates in a quarter
  const mutationGates = engine.getGatesInQuarter('Mutation');
  assertTrue(mutationGates.length === 16, 'Should have 16 gates in Mutation');

  // Generate attributes for each
  for (const gate of mutationGates) {
    const attrs = shared.getGateDataAttributes(gate);
    assertEqual(attrs['data-quarter'], 'Mutation', `Gate ${gate} should be in Mutation`);
  }
});

test('Line-level data consistency', () => {
  const engine = require('../../unified-query-engine');
  const shared = require('../../visualization/generators/shared-constants');

  // Check Gate 1, all lines
  for (let line = 1; line <= 6; line++) {
    const v3Data = engine.getGateKnowledge(1, line);
    const attrs = shared.getLineDataAttributes(1, line);

    assertEqual(attrs['data-line'], line, `Line ${line} number`);
    assertEqual(attrs['data-polarity'], 'YANG', `Gate 1 Line ${line} should be YANG`);
  }
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
