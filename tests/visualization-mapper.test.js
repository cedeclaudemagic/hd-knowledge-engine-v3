/**
 * Attribute Mapper Tests - Phase 1 Verification
 *
 * Tests for visualization/core/attribute-mapper.js
 * Verifies V3 knowledge mapping to SVG attributes works correctly
 */

const { AttributeMapper, SVGDocument, attributeSchema } = require('../visualization');

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

function assertDefined(value, message = '') {
  if (value === undefined || value === null) {
    throw new Error(`Expected value to be defined. ${message}`);
  }
}

function assertTrue(value, message = '') {
  if (value !== true) {
    throw new Error(`Expected true, got ${value}. ${message}`);
  }
}

// Test SVG for integration tests
const TEST_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
  <g id="GROUP_-_GATE-13">
    <circle id="GATE-13.1" cx="100" cy="100" r="5"/>
    <circle id="GATE-13.2" cx="110" cy="100" r="5"/>
    <circle id="GATE-13.3" cx="120" cy="100" r="5"/>
    <circle id="GATE-13.4" cx="130" cy="100" r="5"/>
    <circle id="GATE-13.5" cx="140" cy="100" r="5"/>
    <circle id="GATE-13.6" cx="150" cy="100" r="5"/>
  </g>
</svg>`;

console.log('\n=== Attribute Mapper Tests (V3 Integration) ===\n');

// Test 1: Basic instantiation
console.log('1. Basic Setup');

test('AttributeMapper instantiates correctly', () => {
  const mapper = new AttributeMapper();
  assertDefined(mapper);
  assertDefined(mapper.v3);
  assertDefined(mapper.geometry);
});

test('AttributeMapper accepts options', () => {
  const mapper = new AttributeMapper({
    includeKnowledge: true,
    includeSVGPositions: true
  });
  assertTrue(mapper.options.includeKnowledge);
  assertTrue(mapper.options.includeSVGPositions);
});

// Test 2: Gate attribute mapping
console.log('\n2. Gate Attribute Mapping');

test('mapGateAttributes returns required attributes', () => {
  const mapper = new AttributeMapper();
  const attrs = mapper.mapGateAttributes(13);

  assertEqual(attrs['data-gate'], 13);
  assertDefined(attrs['data-binary']);
  assertDefined(attrs['data-codon']);
  assertDefined(attrs['data-quarter']);
  assertDefined(attrs['data-face']);
  assertDefined(attrs['data-wheel-index']);
  assertDefined(attrs['data-angle']);
});

test('Gate 13 has correct binary and quarter', () => {
  const mapper = new AttributeMapper();
  const attrs = mapper.mapGateAttributes(13);

  assertEqual(attrs['data-binary'], '101111', 'Gate 13 binary should be 101111');
  assertEqual(attrs['data-quarter'], 'Initiation', 'Gate 13 should be in Initiation');
});

test('Gate 1 has correct trigrams', () => {
  const mapper = new AttributeMapper();
  const attrs = mapper.mapGateAttributes(1);

  assertEqual(attrs['data-trigram-upper'], 'Heaven');
  assertEqual(attrs['data-trigram-lower'], 'Heaven');
});

test('mapGateAttributes with knowledge option includes extras', () => {
  const mapper = new AttributeMapper({ includeKnowledge: true });
  const attrs = mapper.mapGateAttributes(13);

  assertDefined(attrs['data-gene-key-gift']);
  assertDefined(attrs['data-iching-name']);
  assertDefined(attrs['data-hd-keyword']);
});

test('mapGateAttributes with SVG positions includes coordinates', () => {
  const mapper = new AttributeMapper({ includeSVGPositions: true });
  const attrs = mapper.mapGateAttributes(13);

  assertDefined(attrs['data-svg-x']);
  assertDefined(attrs['data-svg-y']);
  assertDefined(attrs['data-radius']);
});

// Test 3: Line attribute mapping
console.log('\n3. Line Attribute Mapping');

test('mapLineAttributes includes gate attributes', () => {
  const mapper = new AttributeMapper();
  const attrs = mapper.mapLineAttributes(13, 4);

  // Gate attributes
  assertEqual(attrs['data-gate'], 13);
  assertDefined(attrs['data-binary']);

  // Line attributes
  assertEqual(attrs['data-line'], 4);
  assertDefined(attrs['data-line-index']);
  assertDefined(attrs['data-polarity']);
});

test('mapLineAttributes calculates correct polarity', () => {
  const mapper = new AttributeMapper();

  // Gate 13 binary is 101111
  // Line 1 (index 0) = 1 → YANG
  // Line 2 (index 1) = 0 → YIN
  // Line 3 (index 2) = 1 → YANG
  const line1 = mapper.mapLineAttributes(13, 1);
  const line2 = mapper.mapLineAttributes(13, 2);
  const line3 = mapper.mapLineAttributes(13, 3);

  assertEqual(line1['data-polarity'], 'YANG');
  assertEqual(line2['data-polarity'], 'YIN');
  assertEqual(line3['data-polarity'], 'YANG');
});

// Test 4: Polarity calculation
console.log('\n4. Polarity Calculation');

test('calculatePolarity correctly maps binary to polarity', () => {
  const mapper = new AttributeMapper();

  // Test with known binary patterns
  // Heaven: 111 = all YANG
  assertEqual(mapper.calculatePolarity('111111', 1), 'YANG');
  assertEqual(mapper.calculatePolarity('111111', 6), 'YANG');

  // Earth: 000 = all YIN
  assertEqual(mapper.calculatePolarity('000000', 1), 'YIN');
  assertEqual(mapper.calculatePolarity('000000', 6), 'YIN');

  // Mixed pattern
  assertEqual(mapper.calculatePolarity('101010', 1), 'YANG');
  assertEqual(mapper.calculatePolarity('101010', 2), 'YIN');
  assertEqual(mapper.calculatePolarity('101010', 3), 'YANG');
});

test('calculatePolarity throws on invalid binary', () => {
  const mapper = new AttributeMapper();

  try {
    mapper.calculatePolarity('111', 1);  // Too short
    throw new Error('Should have thrown');
  } catch (e) {
    assertTrue(e.message.includes('Invalid binary'));
  }
});

test('calculatePolarity throws on invalid line', () => {
  const mapper = new AttributeMapper();

  try {
    mapper.calculatePolarity('111111', 7);  // Invalid line
    throw new Error('Should have thrown');
  } catch (e) {
    assertTrue(e.message.includes('Invalid line number'));
  }
});

// Test 5: Docking data mapping
console.log('\n5. Docking Data Mapping');

test('mapDockingData returns minimal set', () => {
  const mapper = new AttributeMapper();
  const attrs = mapper.mapDockingData(13, 4);

  assertEqual(attrs['data-gate'], 13);
  assertEqual(attrs['data-line'], 4);
  assertDefined(attrs['data-binary']);
  assertDefined(attrs['data-polarity']);
  assertDefined(attrs['data-angle']);

  // Should NOT include knowledge
  assertEqual(attrs['data-gene-key-gift'], undefined);
});

// Test 6: Batch processing
console.log('\n6. Batch Processing');

test('mapAllGates returns 64 entries', () => {
  const mapper = new AttributeMapper();
  const allGates = mapper.mapAllGates();
  assertEqual(allGates.length, 64);
});

test('mapAllLines returns 384 entries', () => {
  const mapper = new AttributeMapper();
  const allLines = mapper.mapAllLines();
  assertEqual(allLines.length, 384);
});

// Test 7: Attribute validation
console.log('\n7. Attribute Validation');

test('validateAttributes passes for valid gate attributes', () => {
  const mapper = new AttributeMapper();
  const attrs = mapper.mapGateAttributes(13);
  const result = mapper.validateAttributes(attrs, 'gate');
  assertTrue(result.valid, `Errors: ${result.errors.join(', ')}`);
});

test('validateAttributes passes for valid line attributes', () => {
  const mapper = new AttributeMapper();
  const attrs = mapper.mapLineAttributes(13, 4);
  const result = mapper.validateAttributes(attrs, 'line');
  assertTrue(result.valid, `Errors: ${result.errors.join(', ')}`);
});

// Test 8: SVGDocument integration
console.log('\n8. SVGDocument Integration');

test('applyToElement adds attributes to element', () => {
  const mapper = new AttributeMapper();
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate = doc.findGateElement(13);

  mapper.applyToElement(gate, doc, 13, null);

  assertEqual(doc.getDataAttribute(gate, 'gate'), '13');
  assertDefined(doc.getDataAttribute(gate, 'binary'));
  assertDefined(doc.getDataAttribute(gate, 'quarter'));
});

test('applyToElement adds line attributes', () => {
  const mapper = new AttributeMapper();
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const line = doc.findLineElement(13, 4);

  mapper.applyToElement(line, doc, 13, 4);

  assertEqual(doc.getDataAttribute(line, 'gate'), '13');
  assertEqual(doc.getDataAttribute(line, 'line'), '4');
  assertDefined(doc.getDataAttribute(line, 'polarity'));
});

test('applyToGateGroup processes gate and all lines', () => {
  const mapper = new AttributeMapper();
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate = doc.findGateElement(13);

  const count = mapper.applyToGateGroup(gate, doc, 13);

  assertEqual(count, 7, 'Should process 1 gate + 6 lines');

  // Verify gate has attributes
  assertEqual(doc.getDataAttribute(gate, 'gate'), '13');

  // Verify lines have attributes
  const line4 = doc.findLineElement(13, 4);
  assertEqual(doc.getDataAttribute(line4, 'line'), '4');
});

// Test 9: Schema utilities
console.log('\n9. Schema Utilities');

test('getRequiredGateAttributes returns list', () => {
  const required = attributeSchema.getRequiredGateAttributes();
  assertTrue(required.includes('data-gate'));
  assertTrue(required.includes('data-binary'));
  assertTrue(required.includes('data-quarter'));
});

test('getRequiredLineAttributes returns list', () => {
  const required = attributeSchema.getRequiredLineAttributes();
  assertTrue(required.includes('data-line'));
  assertTrue(required.includes('data-polarity'));
});

test('getAttributeType returns correct types', () => {
  assertEqual(attributeSchema.getAttributeType('data-gate'), 'number');
  assertEqual(attributeSchema.getAttributeType('data-binary'), 'string');
  assertEqual(attributeSchema.getAttributeType('data-inherited'), 'boolean');
});

// Test 10: All 64 gates map correctly
console.log('\n10. Full Gate Coverage');

test('All 64 gates produce valid attribute sets', () => {
  const mapper = new AttributeMapper();

  for (let gate = 1; gate <= 64; gate++) {
    const attrs = mapper.mapGateAttributes(gate);
    const result = mapper.validateAttributes(attrs, 'gate');

    if (!result.valid) {
      throw new Error(`Gate ${gate} failed validation: ${result.errors.join(', ')}`);
    }
  }
});

test('All 384 lines produce valid attribute sets', () => {
  const mapper = new AttributeMapper();

  for (let gate = 1; gate <= 64; gate++) {
    for (let line = 1; line <= 6; line++) {
      const attrs = mapper.mapLineAttributes(gate, line);

      if (!attrs['data-polarity']) {
        throw new Error(`Gate ${gate} Line ${line} missing polarity`);
      }
      if (attrs['data-polarity'] !== 'YANG' && attrs['data-polarity'] !== 'YIN') {
        throw new Error(`Gate ${gate} Line ${line} invalid polarity: ${attrs['data-polarity']}`);
      }
    }
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
