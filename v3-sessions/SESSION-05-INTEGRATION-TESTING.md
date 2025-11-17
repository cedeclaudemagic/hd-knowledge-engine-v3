# SESSION 05: INTEGRATION & TESTING

**Duration:** 3 hours
**Dependencies:** Session 04 complete
**Type:** Sequential (must complete before parallel sessions 06-09)
**Branch:** `session-05-integration`

---

## OBJECTIVES

Create comprehensive integration tests, regression tests, and performance benchmarks to verify the complete V3 system is working correctly.

---

## PREREQUISITES

### Before Starting:

- [ ] Session 04 complete and merged to main
- [ ] Extension layer functional and tested
- [ ] All previous tests passing
- [ ] Create branch: `git checkout -b session-05-integration`

---

## DELIVERABLES

1. Full system integration tests
2. Configuration system regression tests
3. TypeScript integration tests
4. Extension layer integration tests
5. Performance benchmark suite
6. V2 compatibility verification tests
7. All tests passing at 100%

---

## TASKS

### Task 5.1: Create Integration Test Suite

**File:** `tests/integration/test-full-system.js`

```javascript
/**
 * Full System Integration Tests
 *
 * These tests verify that all V3 components work together correctly.
 */

const engine = require('../../unified-query-engine');
const extensions = require('../../extensions');
const WheelConfiguration = require('../../core/root-system/wheel-config');

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

console.log('\n🔗 FULL SYSTEM INTEGRATION TESTS\n');

// Test 1: Configuration + Core Integration
console.log('⚙️ Configuration Integration:');

test('Default configuration matches V2 behavior', () => {
  const gate13 = engine.getGateKnowledge(13);
  assert(gate13.geneKeys.shadow === 'Discord', 'Gene Keys should match V2');
  assert(gate13.hdGates.center === 'G', 'Center should match V2');
});

test('Configuration changes affect positioning', () => {
  const gate13before = engine.getGateKnowledge(13);
  const angleBefore = gate13before.angle;

  // Change configuration
  engine.setWheelConfiguration({
    sequenceName: 'rave-wheel-41-start',
    rotationOffset: 33.75,  // Default rotation
    direction: 'clockwise'
  });

  const gate13after = engine.getGateKnowledge(13);
  const angleAfter = gate13after.angle;

  // Angle should be different with different sequence
  assert(angleBefore !== angleAfter, 'Angle should change with configuration');

  // Reset
  engine.resetConfiguration();
});

test('Configuration reset restores defaults', () => {
  engine.setWheelConfiguration({ rotationOffset: 90 });
  engine.resetConfiguration();

  const config = engine.getWheelConfiguration();
  assert(config.getRotationOffset() === 33.75, 'Rotation should reset to default 33.75°');
});

test('Preset configurations load correctly', () => {
  engine.setWheelConfiguration('rave-wheel-41-start');
  const config = engine.getWheelConfiguration();
  assert(config.getSequenceName() === 'rave-wheel-41-start', 'Default preset should load');
  assert(config.getDirection() === 'clockwise', 'Default direction is clockwise');
  assert(config.getRotationOffset() === 33.75, 'Default rotation is 33.75°');

  engine.resetConfiguration();
});

// Test 2: Core + Extensions Integration
console.log('\n🧩 Core-Extension Integration:');

test('Extensions use current configuration', () => {
  engine.resetConfiguration();
  const allGates = extensions.getAllGates();
  assert(allGates.total === 64, 'Extensions should work with default config');

  engine.setWheelConfiguration({ rotationOffset: 45 });
  const enrichedGate = extensions.getEnrichedGate(13);
  assert(enrichedGate.position, 'Enriched queries should use active config');

  engine.resetConfiguration();
});

test('Collection queries remain consistent', () => {
  const channels1 = extensions.getAllChannels();
  engine.setWheelConfiguration({ rotationOffset: 90 });
  const channels2 = extensions.getAllChannels();

  assert(channels1.total === channels2.total, 'Channel count should not change with config');

  engine.resetConfiguration();
});

test('Relationship queries work across configurations', () => {
  const partner1 = extensions.getGateProgrammingPartner(13);

  engine.setWheelConfiguration('gates-10-start');  // Alternative sequence
  const partner2 = extensions.getGateProgrammingPartner(13);

  assert(partner1.geneKeys.gate === partner2.geneKeys.gate, 'Programming partner should not change');

  engine.resetConfiguration();
});

// Test 3: All 11 Knowledge Systems Integration
console.log('\n📚 All Knowledge Systems:');

test('All 11 systems accessible through core', () => {
  const gate13 = engine.getGateKnowledge(13);

  assert(gate13.geneKeys, 'Gene Keys present');
  assert(gate13.iching, 'I Ching present');
  assert(gate13.hdGates, 'HD Gates present');
  assert(gate13.quarters, 'Quarters present');
  assert(gate13.trigrams, 'Trigrams present');
  assert(gate13.faces, 'Faces present');
  assert(gate13.codonRings, 'Codon Rings present');
  assert(gate13.channelsInvolved, 'Channels present');
  assert(gate13.centerKnowledge, 'Centers present');
  // Note: traditionalGates and incarnationCrosses are line-specific
});

test('All 11 systems accessible through extensions', () => {
  const enriched = extensions.getEnrichedGate(13);

  assert(enriched.geneKeys, 'Gene Keys in enriched');
  assert(enriched.iching, 'I Ching in enriched');
  assert(enriched.center, 'Center in enriched');
  assert(enriched.quarter, 'Quarter in enriched');
  assert(enriched.trigram, 'Trigram in enriched');
  assert(enriched.face, 'Face in enriched');
  assert(enriched.codonRing, 'Codon Ring in enriched');
  assert(enriched.channels, 'Channels in enriched');
});

test('Line-level knowledge includes all systems', () => {
  const line = engine.getLineKnowledge(13, 4);

  assert(line.lineNumber === 4, 'Line number correct');
  assert(line.geneKeys, 'Gene Keys at line level');
  assert(line.lineKnowledge, 'Line-specific knowledge present');
});

// Test 4: Performance Integration
console.log('\n⚡ Performance:');

test('Core queries remain fast (<5ms)', () => {
  const start = performance.now();

  for (let i = 1; i <= 64; i++) {
    engine.getGateKnowledge(i);
  }

  const end = performance.now();
  const avgTime = (end - start) / 64;

  assert(avgTime < 5, `Average query time ${avgTime.toFixed(3)}ms should be < 5ms`);
  console.log(`   ℹ️  Average: ${avgTime.toFixed(3)}ms per query`);
});

test('Extension queries complete reasonably (<50ms)', () => {
  const start = performance.now();

  extensions.getAllChannels();
  extensions.getAllCenters();
  extensions.getEnrichedGate(13);

  const end = performance.now();
  const totalTime = end - start;

  assert(totalTime < 50, `Extension queries ${totalTime.toFixed(2)}ms should be < 50ms`);
  console.log(`   ℹ️  Total: ${totalTime.toFixed(2)}ms`);
});

// Test 5: Cross-System Consistency
console.log('\n🔄 Cross-System Consistency:');

test('Gate numbers consistent across all systems', () => {
  const gate = engine.getGateKnowledge(13);

  assert(gate.geneKeys.gate === 13, 'Gene Keys gate number');
  assert(gate.iching.gate === 13, 'I Ching gate number');
  assert(gate.hdGates.gate === 13, 'HD Gates gate number');
});

test('Center assignments consistent', () => {
  const gate13 = engine.getGateKnowledge(13);
  const gate7 = engine.getGateKnowledge(7);

  assert(gate13.hdGates.center === 'G', 'Gate 13 in G Center');
  assert(gate7.hdGates.center === 'G', 'Gate 7 also in G Center');

  const gGates = extensions.getGatesByCenter('G Center');
  const gateNumbers = gGates.map(g => g.geneKeys.gate);

  assert(gateNumbers.includes(13), 'Gate 13 found in G Center query');
  assert(gateNumbers.includes(7), 'Gate 7 found in G Center query');
});

test('Channel definitions consistent', () => {
  const gate13 = engine.getGateKnowledge(13);
  const gate33 = engine.getGateKnowledge(33);

  const channel13_33 = gate13.channelsInvolved.find(ch =>
    ch.gates.includes(33)
  );

  assert(channel13_33, 'Channel 13-33 found from gate 13');

  const channel33_13 = gate33.channelsInvolved.find(ch =>
    ch.gates.includes(13)
  );

  assert(channel33_13, 'Channel 13-33 found from gate 33');
  assert(channel13_33.name === channel33_13.name, 'Channel names match');
});

// Test 6: Error Handling
console.log('\n🛡️ Error Handling:');

test('Invalid gate numbers handled gracefully', () => {
  try {
    engine.getGateKnowledge(0);
    assert(false, 'Should throw for gate 0');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw invalid error');
  }

  try {
    engine.getGateKnowledge(65);
    assert(false, 'Should throw for gate 65');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw invalid error');
  }
});

test('Invalid line numbers handled gracefully', () => {
  try {
    engine.getLineKnowledge(13, 0);
    assert(false, 'Should throw for line 0');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw invalid error');
  }

  try {
    engine.getLineKnowledge(13, 7);
    assert(false, 'Should throw for line 7');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw invalid error');
  }
});

test('Invalid configuration handled gracefully', () => {
  try {
    engine.setWheelConfiguration({ sequenceName: 'invalid-name' });
    assert(false, 'Should throw for invalid sequence');
  } catch (error) {
    assert(error.message.includes('Invalid') || error.message.includes('not found'), 'Should throw error');
  }

  engine.resetConfiguration();
});

// Summary
console.log('\n' + '='.repeat(60));
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📊 Total: ${passCount + failCount}`);
console.log('='.repeat(60) + '\n');

if (failCount === 0) {
  console.log('🎉 ALL INTEGRATION TESTS PASSED!\n');
  console.log('✅ Configuration system working');
  console.log('✅ Core-Extension integration working');
  console.log('✅ All 11 knowledge systems accessible');
  console.log('✅ Performance maintained');
  console.log('✅ Cross-system consistency verified');
  console.log('✅ Error handling functional\n');
}

process.exit(failCount > 0 ? 1 : 0);
```

### Task 5.2: Create Performance Benchmark Suite

**File:** `tests/performance/benchmark.js`

```javascript
/**
 * Performance Benchmark Suite
 */

const engine = require('../../unified-query-engine');
const extensions = require('../../extensions');

console.log('\n⚡ PERFORMANCE BENCHMARKS\n');

// Benchmark utility
function benchmark(name, fn, iterations = 1000) {
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = performance.now();
  const total = end - start;
  const avg = total / iterations;

  console.log(`${name}:`);
  console.log(`  Total: ${total.toFixed(2)}ms`);
  console.log(`  Average: ${avg.toFixed(4)}ms`);
  console.log(`  Per second: ${(1000 / avg).toFixed(0)}`);
  console.log();

  return avg;
}

// Core Query Benchmarks
console.log('🔍 Core Query Performance:');

benchmark('getGateKnowledge(13)', () => {
  engine.getGateKnowledge(13);
}, 10000);

benchmark('getLineKnowledge(13, 4)', () => {
  engine.getLineKnowledge(13, 4);
}, 10000);

benchmark('getWheelPosition(13)', () => {
  engine.getWheelPosition(13);
}, 10000);

// Extension Query Benchmarks
console.log('✨ Extension Query Performance:');

benchmark('getAllGates()', () => {
  extensions.getAllGates();
}, 100);

benchmark('getAllChannels()', () => {
  extensions.getAllChannels();
}, 100);

benchmark('getEnrichedGate(13)', () => {
  extensions.getEnrichedGate(13);
}, 1000);

benchmark('getGatesByCenter("G Center")', () => {
  extensions.getGatesByCenter('G Center');
}, 1000);

benchmark('getGateProgrammingPartner(13)', () => {
  extensions.getGateProgrammingPartner(13);
}, 1000);

// Configuration Benchmarks
console.log('⚙️ Configuration Performance:');

benchmark('setWheelConfiguration(preset)', () => {
  engine.setWheelConfiguration('gates-10-start');
}, 1000);

benchmark('resetConfiguration()', () => {
  engine.resetConfiguration();
}, 1000);

// Full System Benchmark
console.log('🌐 Full System Performance:');

const fullSystemAvg = benchmark('Complete gate query cycle', () => {
  for (let i = 1; i <= 64; i++) {
    engine.getGateKnowledge(i);
  }
}, 10);

console.log('='.repeat(50));
console.log('📊 Performance Summary:');
console.log(`  All 64 gates: ${(fullSystemAvg).toFixed(2)}ms`);
console.log(`  Target: < 100ms`);
console.log(`  Status: ${fullSystemAvg < 100 ? '✅ PASS' : '❌ FAIL'}`);
console.log('='.repeat(50) + '\n');

process.exit(fullSystemAvg >= 100 ? 1 : 0);
```

### Task 5.3: Create V2 Compatibility Test

**File:** `tests/integration/test-v2-compatibility.js`

```javascript
/**
 * V2 Compatibility Tests
 *
 * Verify that V3 with default configuration produces identical
 * results to V2.0.0 for all queries.
 */

const engine = require('../../unified-query-engine');

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

console.log('\n🔄 V2 COMPATIBILITY TESTS\n');

// Ensure default configuration
engine.resetConfiguration();

console.log('📋 Testing V2 Default Behavior:\n');

// Sample V2 expected values
const v2ExpectedValues = {
  gate13: {
    geneKeysShadow: 'Discord',
    geneKeysGift: 'Discernment',
    geneKeysSiddhi: 'Empathy',
    ichingName: 'Fellowship',
    hdGateName: 'The Listener',
    center: 'G'
  },
  gate7: {
    geneKeysShadow: 'Division',
    geneKeysGift: 'Guidance',
    geneKeysSiddhi: 'Virtue',
    ichingName: 'The Army',
    hdGateName: 'The Role of the Self',
    center: 'G'
  },
  gate41: {
    geneKeysShadow: 'Fantasy',
    geneKeysGift: 'Anticipation',
    geneKeysSiddhi: 'Emanation',
    ichingName: 'Decrease',
    hdGateName: 'Contraction',
    center: 'Root'
  }
};

// Test each sample gate
Object.keys(v2ExpectedValues).forEach(gateKey => {
  const gateNum = parseInt(gateKey.replace('gate', ''));
  const expected = v2ExpectedValues[gateKey];

  test(`Gate ${gateNum}: Gene Keys match V2`, () => {
    const gate = engine.getGateKnowledge(gateNum);
    assert(gate.geneKeys.shadow === expected.geneKeysShadow, `Shadow: ${gate.geneKeys.shadow} vs ${expected.geneKeysShadow}`);
    assert(gate.geneKeys.gift === expected.geneKeysGift, `Gift: ${gate.geneKeys.gift} vs ${expected.geneKeysGift}`);
    assert(gate.geneKeys.siddhi === expected.geneKeysSiddhi, `Siddhi: ${gate.geneKeys.siddhi} vs ${expected.geneKeysSiddhi}`);
  });

  test(`Gate ${gateNum}: I Ching matches V2`, () => {
    const gate = engine.getGateKnowledge(gateNum);
    assert(gate.iching.name === expected.ichingName, `Name: ${gate.iching.name} vs ${expected.ichingName}`);
  });

  test(`Gate ${gateNum}: HD Gates match V2`, () => {
    const gate = engine.getGateKnowledge(gateNum);
    assert(gate.hdGates.name === expected.hdGateName, `Name: ${gate.hdGates.name} vs ${expected.hdGateName}`);
    assert(gate.hdGates.center === expected.center, `Center: ${gate.hdGates.center} vs ${expected.center}`);
  });
});

// Test that all 64 gates still return data
test('All 64 gates return valid data', () => {
  for (let i = 1; i <= 64; i++) {
    const gate = engine.getGateKnowledge(i);
    assert(gate.geneKeys, `Gate ${i} should have Gene Keys`);
    assert(gate.iching, `Gate ${i} should have I Ching`);
    assert(gate.hdGates, `Gate ${i} should have HD Gates`);
  }
});

// Test that all 384 lines return data
test('All 384 lines return valid data', () => {
  for (let i = 1; i <= 64; i++) {
    for (let line = 1; line <= 6; line++) {
      const lineData = engine.getLineKnowledge(i, line);
      assert(lineData.lineNumber === line, `Gate ${i} line ${line} should have correct line number`);
    }
  }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📊 Total: ${passCount + failCount}`);
console.log('='.repeat(60) + '\n');

if (failCount === 0) {
  console.log('🎉 V3 IS FULLY COMPATIBLE WITH V2!\n');
}

process.exit(failCount > 0 ? 1 : 0);
```

### Task 5.4: Create Master Test Runner

**File:** `tests/run-all-tests.sh`

```bash
#!/bin/bash

echo "=========================================="
echo "  HD KNOWLEDGE ENGINE V3 - ALL TESTS"
echo "=========================================="
echo ""

FAILED=0

# Run V2 baseline tests
echo "📦 Running V2 Baseline Tests..."
node tests/comprehensive-unified-query-tests.js
if [ $? -ne 0 ]; then FAILED=1; fi
echo ""

node tests/adapted-old-tests.js
if [ $? -ne 0 ]; then FAILED=1; fi
echo ""

# Run configuration tests
echo "⚙️ Running Configuration Tests..."
node tests/configuration/test-wheel-config.js
if [ $? -ne 0 ]; then FAILED=1; fi
echo ""

# Run extension tests
echo "🧩 Running Extension Tests..."
node tests/extensions/test-extensions.js
if [ $? -ne 0 ]; then FAILED=1; fi
echo ""

# Run integration tests
echo "🔗 Running Integration Tests..."
node tests/integration/test-full-system.js
if [ $? -ne 0 ]; then FAILED=1; fi
echo ""

# Run V2 compatibility tests
echo "🔄 Running V2 Compatibility Tests..."
node tests/integration/test-v2-compatibility.js
if [ $? -ne 0 ]; then FAILED=1; fi
echo ""

# Run performance benchmarks
echo "⚡ Running Performance Benchmarks..."
node tests/performance/benchmark.js
if [ $? -ne 0 ]; then FAILED=1; fi
echo ""

# Run TypeScript type checking
echo "📘 Running TypeScript Type Checks..."
npm run test:types
if [ $? -ne 0 ]; then FAILED=1; fi
echo ""

# Summary
echo "=========================================="
if [ $FAILED -eq 0 ]; then
  echo "✅ ALL TESTS PASSED!"
else
  echo "❌ SOME TESTS FAILED"
fi
echo "=========================================="

exit $FAILED
```

Make executable:
```bash
chmod +x tests/run-all-tests.sh
```

### Task 5.5: Update Package.json Scripts

**Update:** `package.json`

```json
{
  "scripts": {
    "test": "node tests/comprehensive-unified-query-tests.js",
    "test:config": "node tests/configuration/test-wheel-config.js",
    "test:types": "tsc --noEmit",
    "test:extensions": "node tests/extensions/test-extensions.js",
    "test:integration": "node tests/integration/test-full-system.js",
    "test:performance": "node tests/performance/benchmark.js",
    "test:v2-compat": "node tests/integration/test-v2-compatibility.js",
    "test:all": "./tests/run-all-tests.sh"
  }
}
```

### Task 5.6: Run All Tests

```bash
# Run complete test suite
npm run test:all
```

**Expected Results:**
- All V2 baseline tests pass (89/89)
- All configuration tests pass
- All extension tests pass
- All integration tests pass
- All V2 compatibility tests pass
- All performance benchmarks pass
- TypeScript compilation passes

### Task 5.7: Create Test Documentation

**File:** `docs/testing.md`

```markdown
# Testing Guide

## Test Suites

### V2 Baseline Tests
Original test suites from V2.0.0:
```bash
npm test
```

### Configuration Tests
Test wheel configuration system:
```bash
npm run test:config
```

### Extension Tests
Test extension layer:
```bash
npm run test:extensions
```

### Integration Tests
Test full system integration:
```bash
npm run test:integration
```

### V2 Compatibility Tests
Verify V3 matches V2 behavior:
```bash
npm run test:v2-compat
```

### Performance Benchmarks
Measure query performance:
```bash
npm run test:performance
```

### TypeScript Type Checking
Verify type definitions:
```bash
npm run test:types
```

### Run All Tests
Complete test suite:
```bash
npm run test:all
```

## Expected Results

| Test Suite | Tests | Expected |
|------------|-------|----------|
| V2 Baseline | 89 | All pass |
| Configuration | ~15 | All pass |
| Extensions | ~20 | All pass |
| Integration | ~25 | All pass |
| V2 Compatibility | ~15 | All pass |
| Performance | ~10 | < 100ms total |
| TypeScript | Compilation | No errors |

## Continuous Testing

During development:
```bash
# Watch mode for TypeScript
npm run test:types:watch

# Run tests after changes
npm run test:all
```
```

### Task 5.8: Git Commit

```bash
# Stage all test files
git add tests/integration/
git add tests/performance/
git add tests/run-all-tests.sh
git add docs/testing.md
git add package.json

# Commit
git commit -m "Session 05: Add comprehensive integration testing

- Create full system integration tests
- Add performance benchmark suite
- Add V2 compatibility verification tests
- Create master test runner script
- Update package.json with all test scripts
- Add testing documentation

All test suites passing:
- V2 baseline: 89/89
- Configuration: All pass
- Extensions: All pass
- Integration: All pass
- V2 compatibility: All pass
- Performance: < 100ms
- TypeScript: Compiling

Session: 05/10 (Integration Testing)
Next: Sessions 06-09 (Can run in parallel)"

# Tag
git tag -a v3.0.0-alpha.1-session-05 -m "Session 05 complete: Integration testing"
```

---

## VERIFICATION CHECKLIST

Before marking this session complete, verify:

### Test Coverage:
- [ ] Integration tests created
- [ ] Performance benchmarks created
- [ ] V2 compatibility tests created
- [ ] Master test runner created
- [ ] All test types represented

### Test Execution:
- [ ] All V2 baseline tests pass (89/89)
- [ ] All configuration tests pass
- [ ] All extension tests pass
- [ ] All integration tests pass
- [ ] All V2 compatibility tests pass
- [ ] Performance benchmarks pass (< 100ms)
- [ ] TypeScript compiles without errors

### Documentation:
- [ ] Testing guide complete
- [ ] All test suites documented
- [ ] Expected results documented

---

## COMPLETION CRITERIA

✅ **This session is complete when:**

1. All integration tests created
2. All test suites passing at 100%
3. Performance benchmarks pass
4. V2 compatibility verified
5. Documentation complete
6. Git committed and tagged

✅ **Ready to proceed to Sessions 06-09:** Can run in parallel

---

## CHECKPOINT 1: FOUNDATION COMPLETE

✅ **All sequential sessions (01-05) complete!**

**What Works:**
- Configuration system allows switching wheel sequences
- TypeScript definitions compile without errors
- All 11 knowledge systems query successfully
- Core + Extensions separated cleanly
- All tests passing (100%)
- Performance maintained (< 5ms per query)

**What Does NOT Exist:**
- No monolithic database files
- No "rebuild" scripts
- No pre-computed lookup tables
- No references to v1.x architecture

**Next Phase:**
- Sessions 06-09 can now run in parallel
- Each parallel session works on independent code paths
- All must complete before Session 10

---

*Session 05 of 10 - Integration Testing*
