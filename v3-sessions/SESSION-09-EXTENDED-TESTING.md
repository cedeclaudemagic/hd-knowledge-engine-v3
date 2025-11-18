# SESSION 09: EXTENDED TESTING

**Duration:** 3 hours
**Dependencies:** Session 05 complete
**Type:** Parallel (can run alongside sessions 06, 07, 08)
**Branch:** `session-09-extended-testing`

---

## OBJECTIVES

Create extended test suites covering edge cases, stress tests, and real-world scenarios not covered in basic testing.

---

## PREREQUISITES

### Before Starting:

- [ ] Session 05 complete and merged to main
- [ ] All basic tests passing
- [ ] Create branch: `git checkout -b session-09-extended-testing`

---

## DELIVERABLES

1. Edge case tests
2. Stress tests and load tests
3. Configuration edge case tests
4. Real-world scenario tests
5. TypeScript compilation tests
6. Data integrity verification tests

---

## TASKS

### Task 9.1: Create Extended Test Directory

```bash
mkdir -p tests/extended
mkdir -p tests/extended/edge-cases
mkdir -p tests/extended/stress
mkdir -p tests/extended/scenarios
mkdir -p tests/extended/data-integrity
```

### Task 9.2: Edge Case Tests

**File:** `tests/extended/edge-cases/test-edge-cases.js`

```javascript
/**
 * Edge Case Tests
 *
 * Test boundary conditions and unusual inputs.
 */

const engine = require('../../../unified-query-engine');
const extensions = require('../../../extensions');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ ${description}`);
    passCount++;
  } catch (error) {
    console.error(`❌ ${description}`);
    console.error(`   ${error.message}`);
    failCount++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('\n🔬 EDGE CASE TESTS\n');

// Boundary values
console.log('📏 Boundary Values:');

test('Gate 1 (minimum) returns valid data', () => {
  const gate = engine.getGateKnowledge(1);
  assert(gate.geneKeys.gate === 1, 'Gate number should be 1');
  assert(gate.geneKeys.shadow, 'Should have shadow');
});

test('Gate 64 (maximum) returns valid data', () => {
  const gate = engine.getGateKnowledge(64);
  assert(gate.geneKeys.gate === 64, 'Gate number should be 64');
  assert(gate.geneKeys.shadow, 'Should have shadow');
});

test('Line 1 (minimum) returns valid data', () => {
  const line = engine.getLineKnowledge(13, 1);
  assert(line.lineNumber === 1, 'Line number should be 1');
});

test('Line 6 (maximum) returns valid data', () => {
  const line = engine.getLineKnowledge(13, 6);
  assert(line.lineNumber === 6, 'Line number should be 6');
});

// Invalid inputs
console.log('\n🚫 Invalid Inputs:');

test('Gate 0 throws error', () => {
  try {
    engine.getGateKnowledge(0);
    assert(false, 'Should have thrown error');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw Invalid error');
  }
});

test('Gate 65 throws error', () => {
  try {
    engine.getGateKnowledge(65);
    assert(false, 'Should have thrown error');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw Invalid error');
  }
});

test('Negative gate number throws error', () => {
  try {
    engine.getGateKnowledge(-1);
    assert(false, 'Should have thrown error');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw Invalid error');
  }
});

test('Line 0 throws error', () => {
  try {
    engine.getLineKnowledge(13, 0);
    assert(false, 'Should have thrown error');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw Invalid error');
  }
});

test('Line 7 throws error', () => {
  try {
    engine.getLineKnowledge(13, 7);
    assert(false, 'Should have thrown error');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw Invalid error');
  }
});

test('Non-integer gate number throws error', () => {
  try {
    engine.getGateKnowledge(13.5);
    assert(false, 'Should have thrown error');
  } catch (error) {
    assert(true, 'Should throw error for non-integer');
  }
});

// Configuration edge cases
console.log('\n⚙️ Configuration Edge Cases:');

test('All 8 cardinal progressions work', () => {
  const progressions = ['NWSE', 'NESW', 'ESWN', 'ENWN', 'SWNE', 'SENW', 'WNES', 'WSEN'];

  for (const progression of progressions) {
    engine.setWheelConfiguration({ cardinalProgression: progression });
    const gate = engine.getGateKnowledge(1);
    assert(!isNaN(gate.angle), `Cardinal progression ${progression} should work`);
  }

  engine.resetConfiguration();
});

test('Straddled north position works', () => {
  engine.setWheelConfiguration({ northPosition: '10|11' });
  const gate = engine.getGateKnowledge(10);
  assert(!isNaN(gate.angle), 'Straddled position should work');
  engine.resetConfiguration();
});

test('Centered north position works', () => {
  engine.setWheelConfiguration({ northPosition: '10' });
  const gate = engine.getGateKnowledge(10);
  assert(!isNaN(gate.angle), 'Centered position should work');
  engine.resetConfiguration();
});

test('Invalid cardinal progression throws error', () => {
  try {
    engine.setWheelConfiguration({ cardinalProgression: 'INVALID' });
    assert(false, 'Should throw for invalid cardinal progression');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw clear error');
  }
  engine.resetConfiguration();
});

test('Invalid sequence name throws error', () => {
  try {
    engine.setWheelConfiguration({ sequenceName: 'nonexistent' });
    assert(false, 'Should have thrown error');
  } catch (error) {
    assert(error.message.includes('Invalid') || error.message.includes('not found'), 'Should throw error');
  }
  engine.resetConfiguration();
});

// Line-Level Precision Tests (CRITICAL)
console.log('\n🎯 Line-Level Precision Tests:');

test('Line precision is exactly 0.9375° (360° / 384 lines)', () => {
  engine.resetConfiguration();
  const positioning = require('../../../core/root-system/positioning-algorithm');

  // Test Gate 41 (position 0 in default sequence)
  const line1 = positioning.getWheelPosition(41, 1);
  const line2 = positioning.getWheelPosition(41, 2);
  const precisionDiff = Math.abs((line2.angle - line1.angle + 360) % 360 - 0.9375);

  assert(
    precisionDiff < 0.0001,
    `Line precision should be 0.9375°, got difference of ${precisionDiff.toFixed(6)}°`
  );
});

test('Line precision maintained across all 64 gates', () => {
  engine.resetConfiguration();
  const positioning = require('../../../core/root-system/positioning-algorithm');

  let errors = [];
  for (let gate = 1; gate <= 64; gate++) {
    const l1 = positioning.getWheelPosition(gate, 1);
    const l2 = positioning.getWheelPosition(gate, 2);
    const l3 = positioning.getWheelPosition(gate, 3);
    const l4 = positioning.getWheelPosition(gate, 4);
    const l5 = positioning.getWheelPosition(gate, 5);
    const l6 = positioning.getWheelPosition(gate, 6);

    // Check each line increment
    const diffs = [
      Math.abs((l2.angle - l1.angle + 360) % 360 - 0.9375),
      Math.abs((l3.angle - l2.angle + 360) % 360 - 0.9375),
      Math.abs((l4.angle - l3.angle + 360) % 360 - 0.9375),
      Math.abs((l5.angle - l4.angle + 360) % 360 - 0.9375),
      Math.abs((l6.angle - l5.angle + 360) % 360 - 0.9375)
    ];

    for (let i = 0; i < diffs.length; i++) {
      if (diffs[i] > 0.0001) {
        errors.push(`Gate ${gate}, line ${i+1}→${i+2}: diff ${diffs[i].toFixed(6)}°`);
      }
    }
  }

  assert(errors.length === 0, `Line precision errors: ${errors.join(', ')}`);
});

test('Total wheel span is exactly 360° (64 gates × 6 lines × 0.9375°)', () => {
  const expectedTotal = 64 * 6 * 0.9375;
  assert(
    Math.abs(expectedTotal - 360) < 0.0001,
    `Total should be 360°, got ${expectedTotal}°`
  );
});

test('Line precision maintained with rotation offset', () => {
  engine.setWheelConfiguration({ rotationOffset: 33.75 });
  const positioning = require('../../../core/root-system/positioning-algorithm');

  // Even with rotation, line differences should still be 0.9375°
  const line1 = positioning.getWheelPosition(10, 1);
  const line2 = positioning.getWheelPosition(10, 2);
  const diff = Math.abs((line2.angle - line1.angle + 360) % 360 - 0.9375);

  assert(
    diff < 0.0001,
    `Line precision with rotation should be 0.9375°, got ${diff.toFixed(6)}°`
  );

  engine.resetConfiguration();
});

test('384 total line positions span 360° exactly', () => {
  engine.resetConfiguration();
  const positioning = require('../../../core/root-system/positioning-algorithm');

  // First line of first gate in sequence (Gate 41)
  const firstLine = positioning.getWheelPosition(41, 1);

  // Last line of last gate in sequence (Gate 60)
  const lastLine = positioning.getWheelPosition(60, 6);

  // The span should be just under 360° (359.0625°)
  // because line 384 would wrap to 0°
  const expectedSpan = 383 * 0.9375; // 359.0625°
  const actualSpan = (lastLine.angle - firstLine.angle + 360) % 360;

  assert(
    Math.abs(actualSpan - expectedSpan) < 0.01,
    `383 line span should be ${expectedSpan}°, got ${actualSpan.toFixed(4)}°`
  );
});

// Extension edge cases
console.log('\n🧩 Extension Edge Cases:');

test('getEnrichedChannel with non-existent channel returns null', () => {
  const result = extensions.getEnrichedChannel(1, 64);
  assert(result === null, 'Non-existent channel should return null');
});

test('getChannelForGates with reversed order finds channel', () => {
  const ch1 = extensions.getChannelForGates(13, 33);
  const ch2 = extensions.getChannelForGates(33, 13);

  if (ch1 && ch2) {
    assert(ch1.name === ch2.name, 'Should find same channel regardless of order');
  }
});

test('getGatesByCenter with empty center returns empty array', () => {
  const gates = extensions.getGatesByCenter('Nonexistent Center');
  assert(Array.isArray(gates), 'Should return array');
  assert(gates.length === 0, 'Should be empty for nonexistent center');
});

test('getCodonRingPartners for gate without ring returns empty', () => {
  // Assuming all gates have rings, but test the logic
  const partners = extensions.getCodonRingPartners(1);
  assert(Array.isArray(partners), 'Should return array');
});

// Summary
console.log('\n' + '='.repeat(60));
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📊 Total: ${passCount + failCount}`);
console.log('='.repeat(60) + '\n');

process.exit(failCount > 0 ? 1 : 0);
```

### Task 9.3: Stress Tests

**File:** `tests/extended/stress/test-load-stress.js`

```javascript
/**
 * Stress Tests
 *
 * Test system under heavy load and repeated operations.
 */

const engine = require('../../../unified-query-engine');
const extensions = require('../../../extensions');

console.log('\n💪 STRESS TESTS\n');

// Test 1: Rapid repeated queries
console.log('1. Rapid Repeated Queries (10,000 iterations):');
const start1 = performance.now();

for (let i = 0; i < 10000; i++) {
  engine.getGateKnowledge((i % 64) + 1);
}

const end1 = performance.now();
const time1 = end1 - start1;
const avg1 = time1 / 10000;

console.log(`   Total: ${time1.toFixed(2)}ms`);
console.log(`   Average: ${avg1.toFixed(4)}ms per query`);
console.log(`   Status: ${time1 < 1000 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 2: All 384 lines repeatedly
console.log('2. All 384 Lines (100 times):');
const start2 = performance.now();

for (let iteration = 0; iteration < 100; iteration++) {
  for (let gate = 1; gate <= 64; gate++) {
    for (let line = 1; line <= 6; line++) {
      engine.getLineKnowledge(gate, line);
    }
  }
}

const end2 = performance.now();
const time2 = end2 - start2;

console.log(`   Total: ${time2.toFixed(2)}ms`);
console.log(`   Per line: ${(time2 / 38400).toFixed(4)}ms`);
console.log(`   Status: ${time2 < 5000 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 3: Configuration switching stress
console.log('3. Configuration Switching (1,000 times):');
const start3 = performance.now();

for (let i = 0; i < 1000; i++) {
  engine.setWheelConfiguration('rave-wheel-41-start');
  engine.getGateKnowledge(13);
  engine.setWheelConfiguration('gates-10-start');
  engine.getGateKnowledge(13);
  engine.resetConfiguration();
}

const end3 = performance.now();
const time3 = end3 - start3;

console.log(`   Total: ${time3.toFixed(2)}ms`);
console.log(`   Per switch: ${(time3 / 3000).toFixed(4)}ms`);
console.log(`   Status: ${time3 < 1000 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 4: Extension collection queries
console.log('4. Extension Collections (1,000 times):');
const start4 = performance.now();

for (let i = 0; i < 1000; i++) {
  extensions.getAllChannels();
  extensions.getAllCenters();
  extensions.getAllCodonRings();
}

const end4 = performance.now();
const time4 = end4 - start4;

console.log(`   Total: ${time4.toFixed(2)}ms`);
console.log(`   Per collection: ${(time4 / 3000).toFixed(4)}ms`);
console.log(`   Status: ${time4 < 5000 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 5: Memory stability
console.log('5. Memory Stability (100,000 queries):');
const startMem = process.memoryUsage().heapUsed / 1024 / 1024;

for (let i = 0; i < 100000; i++) {
  engine.getGateKnowledge((i % 64) + 1);
}

const endMem = process.memoryUsage().heapUsed / 1024 / 1024;
const memDiff = endMem - startMem;

console.log(`   Start memory: ${startMem.toFixed(2)} MB`);
console.log(`   End memory: ${endMem.toFixed(2)} MB`);
console.log(`   Difference: ${memDiff.toFixed(2)} MB`);
console.log(`   Status: ${memDiff < 50 ? '✅ PASS' : '❌ FAIL'}\n`);

// Summary
const allPassed = time1 < 1000 && time2 < 5000 && time3 < 1000 && time4 < 5000 && memDiff < 50;

console.log('='.repeat(60));
console.log(allPassed ? '✅ ALL STRESS TESTS PASSED' : '❌ SOME STRESS TESTS FAILED');
console.log('='.repeat(60) + '\n');

process.exit(allPassed ? 0 : 1);
```

### Task 9.4: Data Integrity Tests

**File:** `tests/extended/data-integrity/test-data-integrity.js`

```javascript
/**
 * Data Integrity Tests
 *
 * Verify all knowledge system data is complete and consistent.
 */

const engine = require('../../../unified-query-engine');
const extensions = require('../../../extensions');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ ${description}`);
    passCount++;
  } catch (error) {
    console.error(`❌ ${description}`);
    console.error(`   ${error.message}`);
    failCount++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('\n🔍 DATA INTEGRITY TESTS\n');

// Test 1: All gates have complete data
console.log('📊 Complete Data Coverage:');

test('All 64 gates have Gene Keys data', () => {
  for (let i = 1; i <= 64; i++) {
    const gate = engine.getGateKnowledge(i);
    assert(gate.geneKeys, `Gate ${i} missing Gene Keys`);
    assert(gate.geneKeys.shadow, `Gate ${i} missing shadow`);
    assert(gate.geneKeys.gift, `Gate ${i} missing gift`);
    assert(gate.geneKeys.siddhi, `Gate ${i} missing siddhi`);
  }
});

test('All 64 gates have I Ching data', () => {
  for (let i = 1; i <= 64; i++) {
    const gate = engine.getGateKnowledge(i);
    assert(gate.iching, `Gate ${i} missing I Ching`);
    assert(gate.iching.name, `Gate ${i} missing I Ching name`);
  }
});

test('All 64 gates have HD Gates data', () => {
  for (let i = 1; i <= 64; i++) {
    const gate = engine.getGateKnowledge(i);
    assert(gate.hdGates, `Gate ${i} missing HD Gates`);
    assert(gate.hdGates.name, `Gate ${i} missing HD gate name`);
    assert(gate.hdGates.center, `Gate ${i} missing center`);
  }
});

test('All 64 gates have Quarter data', () => {
  for (let i = 1; i <= 64; i++) {
    const gate = engine.getGateKnowledge(i);
    assert(gate.quarters, `Gate ${i} missing quarters`);
    assert(gate.quarters.quarter >= 1 && gate.quarters.quarter <= 4, `Gate ${i} invalid quarter`);
  }
});

test('All 384 lines have data', () => {
  for (let gate = 1; gate <= 64; gate++) {
    for (let line = 1; line <= 6; line++) {
      const lineData = engine.getLineKnowledge(gate, line);
      assert(lineData.lineNumber === line, `Gate ${gate} line ${line} wrong number`);
    }
  }
});

// Test 2: Data consistency
console.log('\n🔗 Data Consistency:');

test('Gate numbers consistent across systems', () => {
  for (let i = 1; i <= 64; i++) {
    const gate = engine.getGateKnowledge(i);
    assert(gate.gateNumber === i, `Gate ${i} wrong gateNumber`);
    assert(gate.geneKeys.gate === i, `Gate ${i} wrong Gene Keys gate`);
    assert(gate.iching.gate === i, `Gate ${i} wrong I Ching gate`);
    assert(gate.hdGates.gate === i, `Gate ${i} wrong HD gate`);
  }
});

test('All centers have gates assigned', () => {
  const centers = extensions.getAllCenters();

  centers.centers.forEach(center => {
    assert(center.gates.length > 0, `${center.name} has no gates`);
    assert(center.gates.length <= 64, `${center.name} has too many gates`);
  });
});

test('All channels reference valid gates', () => {
  const channels = extensions.getAllChannels();

  channels.channels.forEach(channel => {
    assert(channel.gates.length === 2, `${channel.name} should have 2 gates`);
    assert(channel.gates[0] >= 1 && channel.gates[0] <= 64, `${channel.name} gate 1 invalid`);
    assert(channel.gates[1] >= 1 && channel.gates[1] <= 64, `${channel.name} gate 2 invalid`);
  });
});

test('Channel count is exactly 36', () => {
  const channels = extensions.getAllChannels();
  assert(channels.total === 36, `Expected 36 channels, got ${channels.total}`);
});

test('Center count is exactly 9', () => {
  const centers = extensions.getAllCenters();
  assert(centers.total === 9, `Expected 9 centers, got ${centers.total}`);
});

test('Codon ring count is exactly 22', () => {
  const rings = extensions.getAllCodonRings();
  assert(rings.total === 22, `Expected 22 codon rings, got ${rings.total}`);
});

test('Quarter count is exactly 4', () => {
  const quarters = extensions.getAllQuarters();
  assert(quarters.total === 4, `Expected 4 quarters, got ${quarters.total}`);
});

test('Each quarter has 16 gates', () => {
  const quarters = extensions.getAllQuarters();

  quarters.quarters.forEach(quarter => {
    assert(quarter.gates.length === 16, `Quarter ${quarter.quarter} should have 16 gates, has ${quarter.gates.length}`);
  });
});

test('All 64 gates distributed across quarters', () => {
  const quarters = extensions.getAllQuarters();
  const allGates = new Set();

  quarters.quarters.forEach(quarter => {
    quarter.gates.forEach(gate => allGates.add(gate));
  });

  assert(allGates.size === 64, `Should have all 64 gates across quarters, has ${allGates.size}`);
});

// Test 3: No duplicates
console.log('\n🚫 No Duplicates:');

test('No duplicate gates in channels', () => {
  const channels = extensions.getAllChannels();
  const seen = new Set();

  channels.channels.forEach(channel => {
    const key = `${channel.gates[0]}-${channel.gates[1]}`;
    const keyReverse = `${channel.gates[1]}-${channel.gates[0]}`;

    assert(!seen.has(key) && !seen.has(keyReverse), `Duplicate channel: ${key}`);
    seen.add(key);
  });
});

test('No duplicate gates in centers', () => {
  const centers = extensions.getAllCenters();
  const allGates = [];

  centers.centers.forEach(center => {
    allGates.push(...center.gates);
  });

  const uniqueGates = new Set(allGates);
  assert(uniqueGates.size === 64, `Expected 64 unique gates, found ${uniqueGates.size}`);
});

// Summary
console.log('\n' + '='.repeat(60));
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📊 Total: ${passCount + failCount}`);
console.log('='.repeat(60) + '\n');

if (failCount === 0) {
  console.log('🎉 ALL DATA INTEGRITY TESTS PASSED!\n');
}

process.exit(failCount > 0 ? 1 : 0);
```

### Task 9.5: Real-World Scenario Tests

**File:** `tests/extended/scenarios/test-real-world.js`

```javascript
/**
 * Real-World Scenario Tests
 *
 * Test actual use cases that users might encounter.
 */

const engine = require('../../../unified-query-engine');
const extensions = require('../../../extensions');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ ${description}`);
    passCount++;
  } catch (error) {
    console.error(`❌ ${description}`);
    console.error(`   ${error.message}`);
    failCount++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('\n🌍 REAL-WORLD SCENARIO TESTS\n');

// Scenario 1: Building a bodygraph
console.log('📊 Scenario: Building a Bodygraph');

test('Calculate defined channels from gate list', () => {
  const definedGates = [1, 8, 13, 33];
  const channels = extensions.getAllChannels();

  const definedChannels = channels.channels.filter(ch =>
    definedGates.includes(ch.gates[0]) && definedGates.includes(ch.gates[1])
  );

  assert(definedChannels.length === 1, 'Should find channel 13-33');
  assert(definedChannels[0].gates.includes(13), 'Channel should include gate 13');
  assert(definedChannels[0].gates.includes(33), 'Channel should include gate 33');
});

test('Calculate defined centers from gate list', () => {
  const definedGates = [1, 8, 13, 33];
  const centers = new Set();

  definedGates.forEach(gateNum => {
    const gate = engine.getGateKnowledge(gateNum);
    centers.add(gate.hdGates.center);
  });

  assert(centers.size > 0, 'Should have at least one defined center');
  assert(centers.has('G'), 'Should have G center defined');
});

// Scenario 2: Transit analysis
console.log('\n🌙 Scenario: Transit Analysis');

test('Analyze current planetary positions', () => {
  const transits = {
    sun: 13,
    earth: 7,
    moon: 33
  };

  Object.values(transits).forEach(gate => {
    const knowledge = engine.getGateKnowledge(gate);
    assert(knowledge, `Gate ${gate} should return knowledge`);
    assert(knowledge.geneKeys.gift, `Gate ${gate} should have gift`);
  });
});

// Scenario 3: Composite analysis
console.log('\n💑 Scenario: Composite Analysis');

test('Find electromagnetic connections in composite', () => {
  const personA = [13, 7];
  const personB = [33, 31];

  const allChannels = extensions.getAllChannels();
  const electromagnetic = [];

  allChannels.channels.forEach(channel => {
    const hasFromA = personA.includes(channel.gates[0]) || personA.includes(channel.gates[1]);
    const hasFromB = personB.includes(channel.gates[0]) || personB.includes(channel.gates[1]);

    if (hasFromA && hasFromB) {
      electromagnetic.push(channel);
    }
  });

  assert(electromagnetic.length === 1, 'Should find 13-33 electromagnetic');
});

// Scenario 4: Gene Keys contemplation
console.log('\n🧘 Scenario: Gene Keys Contemplation');

test('Get shadow-gift-siddhi spectrum for contemplation', () => {
  const gate = engine.getGateKnowledge(13);

  assert(gate.geneKeys.shadow === 'Discord', 'Shadow should be Discord');
  assert(gate.geneKeys.gift === 'Discernment', 'Gift should be Discernment');
  assert(gate.geneKeys.siddhi === 'Empathy', 'Siddhi should be Empathy');
});

test('Find programming partner for hologenetic profile', () => {
  const partner = extensions.getGateProgrammingPartner(13);

  assert(partner !== null, 'Gate 13 should have programming partner');
  assert(partner.geneKeys.gate === 7, 'Programming partner should be gate 7');
});

// Scenario 5: Alternative configuration study
console.log('\n☯️  Scenario: Alternative Configuration');

test('Switch to gates-10-start configuration', () => {
  engine.setWheelConfiguration('gates-10-start');
  const gate10 = engine.getGateKnowledge(10);

  assert(gate10.angle === 0, 'Gate 10 should be at 0° in gates-10-start');
  assert(gate10.iching.name === 'Treading (Conduct)', 'Should have I Ching name');

  engine.resetConfiguration();
});

// Scenario 6: Circuit analysis
console.log('\n🔄 Scenario: Circuit Analysis');

test('Get all gates in Individual circuit', () => {
  const individualGates = extensions.getGatesByCircuit('Individual');

  assert(individualGates.length > 0, 'Should have Individual circuit gates');

  individualGates.forEach(gate => {
    assert(gate.channelsInvolved, 'Gate should have channels');
    const hasIndividual = gate.channelsInvolved.some(ch => ch.circuit === 'Individual');
    assert(hasIndividual, `Gate ${gate.geneKeys.gate} should be in Individual circuit`);
  });
});

// Summary
console.log('\n' + '='.repeat(60));
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📊 Total: ${passCount + failCount}`);
console.log('='.repeat(60) + '\n');

process.exit(failCount > 0 ? 1 : 0);
```

### Task 9.6: Create Extended Test Runner

**File:** `tests/run-extended-tests.sh`

```bash
#!/bin/bash

echo "=========================================="
echo "  EXTENDED TEST SUITE"
echo "=========================================="
echo ""

FAILED=0

echo "🔬 Running Edge Case Tests..."
node tests/extended/edge-cases/test-edge-cases.js
if [ $? -ne 0 ]; then FAILED=1; fi
echo ""

echo "💪 Running Stress Tests..."
node tests/extended/stress/test-load-stress.js
if [ $? -ne 0 ]; then FAILED=1; fi
echo ""

echo "🔍 Running Data Integrity Tests..."
node tests/extended/data-integrity/test-data-integrity.js
if [ $? -ne 0 ]; then FAILED=1; fi
echo ""

echo "🌍 Running Real-World Scenario Tests..."
node tests/extended/scenarios/test-real-world.js
if [ $? -ne 0 ]; then FAILED=1; fi
echo ""

echo "=========================================="
if [ $FAILED -eq 0 ]; then
  echo "✅ ALL EXTENDED TESTS PASSED!"
else
  echo "❌ SOME EXTENDED TESTS FAILED"
fi
echo "=========================================="

exit $FAILED
```

Make executable:
```bash
chmod +x tests/run-extended-tests.sh
```

### Task 9.7: Update Package.json Scripts

**Update:** `package.json`

```json
{
  "scripts": {
    "test:extended": "./tests/run-extended-tests.sh",
    "test:edge": "node tests/extended/edge-cases/test-edge-cases.js",
    "test:stress": "node tests/extended/stress/test-load-stress.js",
    "test:integrity": "node tests/extended/data-integrity/test-data-integrity.js",
    "test:scenarios": "node tests/extended/scenarios/test-real-world.js"
  }
}
```

### Task 9.8: Run Extended Tests

```bash
# Run all extended tests
npm run test:extended

# Or run individually
npm run test:edge
npm run test:stress
npm run test:integrity
npm run test:scenarios
```

### Task 9.9: Git Commit

```bash
# Stage extended tests
git add tests/extended/
git add tests/run-extended-tests.sh
git add package.json

# Commit
git commit -m "Session 09: Add extended test suite

- Create edge case tests (boundary values, invalid inputs)
- Add stress tests (load, memory, repeated operations)
- Add data integrity tests (completeness, consistency)
- Create real-world scenario tests
- Add extended test runner script

All extended tests passing.
System handles edge cases gracefully.
Performance under stress within limits.
Data integrity verified.

Session: 09/10 (Extended Testing)
Parallel: Can merge alongside 06, 07, 08"

# Tag
git tag -a v3.0.0-alpha.1-session-09 -m "Session 09 complete: Extended testing"
```

---

## VERIFICATION CHECKLIST

- [ ] Edge case tests created and passing
- [ ] Stress tests created and passing
- [ ] Data integrity tests created and passing
- [ ] Real-world scenario tests created and passing
- [ ] Extended test runner functional
- [ ] All tests documented

---

## COMPLETION CRITERIA

✅ **This session is complete when:**

1. All extended test suites created
2. All extended tests passing
3. Edge cases handled gracefully
4. Performance under stress acceptable
5. Data integrity verified
6. Git committed and tagged

---

*Session 09 of 10 - Extended Testing (Parallel)*
