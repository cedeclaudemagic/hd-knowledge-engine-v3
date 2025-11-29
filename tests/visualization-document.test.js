/**
 * SVG Document Tests - Phase 1 Verification
 *
 * Tests for visualization/core/svg-document.js
 * Verifies JSDOM-based SVG manipulation works correctly
 */

const { SVGDocument } = require('../visualization');

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

function assertFalse(value, message = '') {
  if (value !== false) {
    throw new Error(`Expected false, got ${value}. ${message}`);
  }
}

// Test SVG content
const TEST_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <g id="wheel">
    <g id="GROUP_-_GATE-13">
      <circle id="GATE-13.1" cx="100" cy="100" r="5"/>
      <circle id="GATE-13.2" cx="110" cy="100" r="5"/>
      <circle id="GATE-13.3" cx="120" cy="100" r="5"/>
      <circle id="GATE-13.4" cx="130" cy="100" r="5"/>
      <circle id="GATE-13.5" cx="140" cy="100" r="5"/>
      <circle id="GATE-13.6" cx="150" cy="100" r="5"/>
    </g>
    <g id="GROUP_-_GATE-7">
      <circle id="GATE-7.1" cx="200" cy="100" r="5"/>
      <circle id="GATE-7.2" cx="210" cy="100" r="5"/>
    </g>
    <g id="gate-41">
      <circle id="gate-41-line-1" cx="300" cy="100" r="5"/>
    </g>
  </g>
</svg>`;

console.log('\n=== SVG Document Tests ===\n');

// Test 1: Basic loading
console.log('1. Document Loading');

test('loadFromString creates valid document', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  assertTrue(doc.isValidSVG());
});

test('constructor with content creates valid document', () => {
  const doc = new SVGDocument(TEST_SVG);
  assertTrue(doc.isValidSVG());
});

test('empty constructor creates empty document', () => {
  const doc = new SVGDocument();
  assertFalse(doc.isValidSVG());
});

test('invalid SVG throws error', () => {
  try {
    SVGDocument.loadFromString('<div>not svg</div>');
    throw new Error('Should have thrown');
  } catch (e) {
    assertTrue(e.message.includes('No <svg> element'));
  }
});

// Test 2: Query methods
console.log('\n2. Query Methods');

test('querySelector finds element', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const wheel = doc.querySelector('#wheel');
  assertDefined(wheel);
});

test('querySelectorAll returns array', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const circles = doc.querySelectorAll('circle');
  assertEqual(circles.length, 9);
});

test('getElementById finds element', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate = doc.getElementById('GROUP_-_GATE-13');
  assertDefined(gate);
});

test('getElementsByPattern finds matching elements', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gates = doc.getElementsByPattern('GROUP_-_GATE-');
  assertEqual(gates.length, 2);
});

// Test 3: Gate and line finding
console.log('\n3. Gate and Line Finding');

test('findGateGroups finds gate groups', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const groups = doc.findGateGroups();
  assertEqual(groups.length, 2, 'Should find 2 gate groups');
});

test('findGateElement finds by gate number', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate13 = doc.findGateElement(13);
  assertDefined(gate13);
  assertEqual(doc.getElementId(gate13), 'GROUP_-_GATE-13');
});

test('findGateElement finds alternate pattern', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate41 = doc.findGateElement(41);
  assertDefined(gate41);
  assertEqual(doc.getElementId(gate41), 'gate-41');
});

test('findLineElement finds by gate and line', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const line = doc.findLineElement(13, 4);
  assertDefined(line);
  assertEqual(doc.getElementId(line), 'GATE-13.4');
});

test('findLineElements finds lines in gate group', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate13 = doc.findGateElement(13);
  const lines = doc.findLineElements(gate13);
  assertEqual(lines.length, 6, 'Gate 13 should have 6 lines');
});

// Test 4: Data attributes
console.log('\n4. Data Attribute Handling');

test('setDataAttribute adds attribute', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate = doc.findGateElement(13);
  doc.setDataAttribute(gate, 'gate', 13);
  assertEqual(doc.getDataAttribute(gate, 'gate'), '13');
});

test('setDataAttribute handles data- prefix', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate = doc.findGateElement(13);
  doc.setDataAttribute(gate, 'data-test', 'value');
  assertEqual(doc.getDataAttribute(gate, 'test'), 'value');
});

test('setDataAttributes sets multiple', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate = doc.findGateElement(13);
  doc.setDataAttributes(gate, {
    gate: 13,
    binary: '101111',
    quarter: 'Initiation'
  });
  assertEqual(doc.getDataAttribute(gate, 'gate'), '13');
  assertEqual(doc.getDataAttribute(gate, 'binary'), '101111');
  assertEqual(doc.getDataAttribute(gate, 'quarter'), 'Initiation');
});

test('getDataAttributes returns all data-* attributes', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate = doc.findGateElement(13);
  doc.setDataAttributes(gate, { gate: 13, line: 1 });
  const attrs = doc.getDataAttributes(gate);
  assertEqual(attrs.gate, '13');
  assertEqual(attrs.line, '1');
});

test('removeDataAttribute removes attribute', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate = doc.findGateElement(13);
  doc.setDataAttribute(gate, 'test', 'value');
  doc.removeDataAttribute(gate, 'test');
  assertEqual(doc.getDataAttribute(gate, 'test'), null);
});

test('removeAllDataAttributes clears all', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate = doc.findGateElement(13);
  doc.setDataAttributes(gate, { a: 1, b: 2, c: 3 });
  doc.removeAllDataAttributes(gate);
  assertFalse(doc.hasDataAttributes(gate));
});

// Test 5: Element inspection
console.log('\n5. Element Inspection');

test('getElementId returns id', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate = doc.findGateElement(13);
  assertEqual(doc.getElementId(gate), 'GROUP_-_GATE-13');
});

test('getElementType returns tag name', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate = doc.findGateElement(13);
  assertEqual(doc.getElementType(gate), 'g');

  const line = doc.findLineElement(13, 1);
  assertEqual(doc.getElementType(line), 'circle');
});

test('hasDataAttributes detects presence', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate = doc.findGateElement(13);
  assertFalse(doc.hasDataAttributes(gate));
  doc.setDataAttribute(gate, 'test', 'value');
  assertTrue(doc.hasDataAttributes(gate));
});

test('countElements counts correctly', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  assertEqual(doc.countElements('circle'), 9);
  assertEqual(doc.countElements('g'), 4);
});

// Test 6: Validation
console.log('\n6. Validation');

test('hasGateStructure detects gate groups', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  assertTrue(doc.hasGateStructure());
});

test('getDocumentStatistics returns counts', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const stats = doc.getDocumentStatistics();
  assertEqual(stats.totalGateGroups, 2);
  assertTrue(stats.totalElements > 0);
});

// Test 7: Serialization
console.log('\n7. Serialization');

test('serialize returns valid SVG string', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const output = doc.serialize();
  assertTrue(output.includes('<svg'));
  assertTrue(output.includes('</svg>'));
});

test('serialize preserves added attributes', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const gate = doc.findGateElement(13);
  doc.setDataAttribute(gate, 'test', 'preserved');
  const output = doc.serialize();
  assertTrue(output.includes('data-test="preserved"'));
});

test('getRoot returns svg element', () => {
  const doc = SVGDocument.loadFromString(TEST_SVG);
  const root = doc.getRoot();
  assertEqual(root.tagName.toLowerCase(), 'svg');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
