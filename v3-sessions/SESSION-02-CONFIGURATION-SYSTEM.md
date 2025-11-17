# SESSION 02: CONFIGURATION SYSTEM

**Duration:** 4 hours
**Dependencies:** Session 01 complete
**Type:** Sequential (must complete before Session 03)
**Branch:** `session-02-configuration`

---

## OBJECTIVES

Build the modular wheel configuration system that allows swappable gate sequences, configurable direction (clockwise/counter-clockwise), and rotation offsets. This solves the fundamental gate positioning issue.

---

## PREREQUISITES

### Before Starting:

- [ ] Session 01 complete and merged to main
- [ ] All 89 V2 tests passing
- [ ] Read implementation plan section on "Configuration Design"
- [ ] Understand the gate sequence problem
- [ ] Create branch: `git checkout -b session-02-configuration`

---

## THE PROBLEM WE'RE SOLVING

**Current V2 Issue:**
- The gate sequence array IS the rotation - no separate rotation logic
- Can't change wheel orientation without editing source code
- Direction (clockwise vs counter-clockwise) may be wrong
- No way to swap between HD vs I Ching wheel arrangements

**V3 Solution:**
- Modular `WheelConfiguration` class
- Swappable sequence files
- Configurable direction and rotation
- Multiple presets for different traditions

---

## DELIVERABLES

1. `core/root-system/wheel-config.js` - Configuration system
2. `core/root-system/sequences/rave-wheel-41-start.json` - DEFAULT (counter-clockwise, 33.75° rotation)
3. `core/root-system/sequences/gates-10-start.json` - ALTERNATIVE (Gates 10/11 at array start)
4. `core/root-system/sequences/README.md` - Sequence documentation (explains 3 mandatory fields)
5. Updated `core/root-system/positioning-algorithm.js` - Uses configuration with rotation
6. `tests/configuration/test-wheel-config.js` - Configuration tests
7. `tests/configuration/test-direction-hypothesis.js` - Direction testing (with default rotation)
8. All existing tests updated for new default (Gates 10/11 at north via rotation)

---

## TASKS

### Task 2.1: Create Sequence Files

**CRITICAL:** Every sequence file MUST have three mandatory fields: `sequence`, `direction`, and `rotationOffset`. These three values work together to define both array order AND visual presentation.

**File:** `core/root-system/sequences/rave-wheel-41-start.json` **(DEFAULT)**

```json
{
  "name": "rave-wheel-41-start",
  "description": "Rave Wheel - Gate 41 at array start, rotated so Gates 10/11 appear at north",
  "version": "1.0.0",
  "source": "Ra Uru Hu - Human Design System",
  "sequence": [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
    27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
    31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
    28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
  ],
  "direction": "counter-clockwise",
  "rotationOffset": 33.75,
  "notes": {
    "arrayPosition0": "Gate 41 (position 0 in array)",
    "arrayPosition58": "Gate 10 (position 58 in array)",
    "visualNorth": "Gates 10/11 appear at north (0°) via 33.75° rotation offset",
    "decoupling": "Array order ≠ Visual presentation - rotation offset bridges the gap",
    "mandatory": "direction and rotationOffset are MANDATORY fields",
    "directionNote": "Counter-clockwise matches solar system planets/sun movement"
  }
}
```

**File:** `core/root-system/sequences/gates-10-start.json` **(ALTERNATIVE)**

```json
{
  "name": "gates-10-start",
  "description": "Alternative - Gates 10/11 at array start (no rotation needed)",
  "version": "1.0.0",
  "source": "Alternative wheel arrangement",
  "sequence": [
    10, 11, 26, 5, 9, 34, 14, 43, 1, 44, 28, 50, 32, 57, 48, 18,
    46, 6, 47, 64, 40, 59, 29, 4, 7, 33, 31, 56, 62, 53, 39, 52,
    15, 12, 45, 35, 16, 20, 8, 23, 2, 24, 27, 3, 42, 51, 21, 17,
    25, 36, 22, 63, 37, 55, 30, 49, 13, 19, 41, 60, 61, 54, 38, 58
  ],
  "direction": "counter-clockwise",
  "rotationOffset": 0,
  "notes": {
    "arrayPosition0": "Gate 10 (position 0 in array)",
    "visualNorth": "Gate 10 at north (0°) with no rotation",
    "useCase": "When you want Gates 10/11 at array start instead of using rotation",
    "mandatory": "direction and rotationOffset are MANDATORY fields (even if 0)",
    "directionNote": "Counter-clockwise matches solar system planets/sun movement"
  }
}
```

**File:** `core/root-system/sequences/README.md`

```markdown
# Gate Sequence Files

This directory contains swappable gate sequence configurations for different wheel traditions.

## CRITICAL: Three Mandatory Fields

Every sequence file MUST contain three fields:
1. **sequence** - Array of 64 gates in wheel order
2. **direction** - "clockwise" or "counter-clockwise"
3. **rotationOffset** - Degrees (0-360) to rotate the visual wheel

These three values work together to decouple array order from visual presentation.

## Available Sequences

### rave-wheel-41-start.json (DEFAULT)
- **Sequence:** Gate 41 at array position 0
- **Direction:** Counter-clockwise (matches solar system planets/sun)
- **Rotation:** 33.75° (makes Gates 10/11 appear at visual north)
- **Result:** Array starts with Gate 41, but visually Gates 10/11 are at north
- **Use this for:** Default rave wheel, standard HD charts

### gates-10-start.json (ALTERNATIVE)
- **Sequence:** Gates 10/11 at array position 0
- **Direction:** Counter-clockwise (matches solar system planets/sun)
- **Rotation:** 0° (no rotation needed)
- **Result:** Array AND visual both start with Gates 10/11 at north
- **Use this for:** When you want Gates 10/11 at array start

## Creating Custom Sequences

MANDATORY format:

```json
{
  "name": "my-custom-sequence",
  "description": "Description of what makes this unique",
  "version": "1.0.0",
  "source": "Where this comes from",
  "sequence": [41, 19, 13, ...],             // MANDATORY: All 64 gates
  "direction": "counter-clockwise",       // MANDATORY: Direction (counter-clockwise = solar system)
  "rotationOffset": 33.75,                // MANDATORY: Rotation in degrees
  "notes": {
    "arrayPosition0": "Which gate at array position 0",
    "visualNorth": "What appears at visual north after rotation"
  }
}
```

**Requirements:**
- Must contain exactly 64 gates in sequence array
- Each gate 1-64 must appear exactly once
- No duplicates, no gaps
- MUST include direction field
- MUST include rotationOffset field (even if 0)

## Understanding The Three Values

**Sequence** = Array order (for calculations)
**Direction** = Clockwise or counter-clockwise traversal
**RotationOffset** = Visual alignment (decouples array from display)

Example:
```javascript
// rave-wheel-41-start with 33.75° rotation:
sequence[0] = 41        // Array position 0 = Gate 41
visualAngle(10) = 0°    // Gate 10 appears at north visually
// DECOUPLED! Array order ≠ Visual presentation
```

## Testing Your Sequence

```javascript
const { WheelConfiguration } = require('../wheel-config.js');

// Load your custom sequence
const config = new WheelConfiguration({
  sequenceName: 'my-custom-sequence'
});

// Verify it loads
console.log(config.sequence.length); // Should be 64

// Test a gate position
console.log(config.getWheelIndex(41)); // Returns position of gate 41
```
```

### Task 2.2: Create Wheel Configuration Class

**File:** `core/root-system/wheel-config.js`

**SEE:** `SESSION-02-WHEEL-CONFIG-IMPLEMENTATION.md` for the COMPLETE implementation

This file contains the full WheelConfiguration class with all methods, including:

**Key Methods to Implement:**
- `constructor(config)` - Initialize with configuration
- `loadSequence()` - Load sequence from JSON file
- `validateConfiguration()` - Ensure config is valid
- `getWheelIndex(gateNumber)` - Get position (accounting for direction)
- `getAngle(gateNumber, lineNumber)` - Calculate angle (accounting for offset)
- `getGateAtAngle(angle)` - Reverse lookup
- `exportConfig()` - Export current settings
- `static fromPreset(presetName)` - Create from preset

**CRITICAL:** Include all the preset configurations from the implementation plan.

### Task 2.3: Update Positioning Algorithm

**File:** `core/root-system/positioning-algorithm.js`

**Changes needed:**

1. **Add at top:**
```javascript
const { WheelConfiguration } = require('./wheel-config.js');

// Global configuration (can be overridden)
let wheelConfig = new WheelConfiguration(); // Defaults to rave-wheel-41-start (counter-clockwise, 33.75° rotation)
```

2. **Add new exports:**
```javascript
/**
 * Set wheel configuration
 * @param {Object|string} config - Configuration object or preset name
 */
function setWheelConfiguration(config) {
  if (typeof config === 'string') {
    wheelConfig = WheelConfiguration.fromPreset(config);
  } else {
    wheelConfig = new WheelConfiguration(config);
  }
}

/**
 * Get current wheel configuration
 */
function getWheelConfiguration() {
  return wheelConfig.exportConfig();
}
```

3. **Update getWheelPosition():**
```javascript
function getWheelPosition(gateNumber, lineNumber = 1) {
  if (gateNumber < 1 || gateNumber > 64) {
    throw new Error(`Invalid gate number: ${gateNumber} (must be 1-64)`);
  }
  if (lineNumber < 1 || lineNumber > 6) {
    throw new Error(`Invalid line number: ${lineNumber} (must be 1-6)`);
  }

  const wheelIndex = wheelConfig.getWheelIndex(gateNumber);
  const angle = wheelConfig.getAngle(gateNumber, lineNumber);
  const linePosition = (wheelIndex * LINES_PER_GATE) + (lineNumber - 1);

  return {
    gateNumber,
    lineNumber,
    wheelIndex,        // 0-63 (position considering direction)
    linePosition,      // 0-383 (absolute line position)
    angle,             // 0-360 degrees (with rotation offset applied)
    angleNormalized: angle % 360,
    configName: wheelConfig.config.sequenceName  // For debugging
  };
}
```

4. **Update module.exports:**
```javascript
module.exports = {
  // Configuration (NEW)
  setWheelConfiguration,
  getWheelConfiguration,

  // Existing exports
  getWheelPosition,
  getBinaryPattern,
  getQuarter,
  getFace,
  getTrigrams,
  getOppositeGate,
  getDockingData,
  verifyDocking,

  // Constants
  GATE_SEQUENCE: wheelConfig.sequence,  // Note: Now dynamic
  DEGREES_PER_LINE,
  TOTAL_LINES,
  TOTAL_GATES
};
```

5. **Remove old GATE_SEQUENCE constant** - it's now part of wheelConfig

### Task 2.4: Create Configuration Tests

**File:** `tests/configuration/test-wheel-config.js`

```javascript
/**
 * Test Suite: Wheel Configuration System
 */

const { WheelConfiguration, DEFAULT_CONFIG, PRESETS } = require('../../core/root-system/wheel-config.js');

let passedTests = 0;
let failedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`❌ FAIL: ${testName}`);
  }
}

console.log('='.repeat(60));
console.log('WHEEL CONFIGURATION TESTS');
console.log('='.repeat(60) + '\n');

// Test 1: Default configuration loads
console.log('Test Group 1: Initialization\n');
try {
  const config = new WheelConfiguration();
  assert(config !== null, 'Default configuration loads');
  assert(config.sequence.length === 64, 'Default sequence has 64 gates');
  assert(config.config.sequenceName === 'rave-wheel-41-start', 'Default is rave-wheel-41-start');
  assert(config.config.direction === 'counter-clockwise', 'Default direction is counter-clockwise');
  assert(config.config.rotationOffset === 33.75, 'Default rotation is 33.75°');
  assert(config.sequence[0] === 41, 'Default starts with Gate 41');
} catch (error) {
  assert(false, 'Default configuration loads - ERROR: ' + error.message);
}

// Test 2: Rave wheel preset (default)
console.log('\nTest Group 2: Presets\n');
try {
  const raveWheelConfig = WheelConfiguration.fromPreset('rave-wheel-41-start');
  assert(raveWheelConfig.sequence[0] === 41, 'rave-wheel-41-start starts with gate 41');
  assert(raveWheelConfig.sequence[1] === 19, 'rave-wheel-41-start position 1 is gate 19');
  assert(raveWheelConfig.sequence[58] === 10, 'rave-wheel-41-start position 58 is gate 10');
  assert(raveWheelConfig.config.direction === 'counter-clockwise', 'rave-wheel-41-start is counter-clockwise');
  assert(raveWheelConfig.config.rotationOffset === 33.75, 'rave-wheel-41-start has 33.75° rotation');
} catch (error) {
  assert(false, 'rave-wheel-41-start preset - ERROR: ' + error.message);
}

// Test 3: Gates 10 start preset (alternative)
try {
  const gates10Config = WheelConfiguration.fromPreset('gates-10-start');
  assert(gates10Config.sequence[0] === 10, 'gates-10-start starts with gate 10');
  assert(gates10Config.sequence[1] === 11, 'gates-10-start position 1 is gate 11');
  assert(gates10Config.config.direction === 'counter-clockwise', 'gates-10-start is counter-clockwise');
  assert(gates10Config.config.rotationOffset === 0, 'gates-10-start has 0° rotation');
} catch (error) {
  assert(false, 'gates-10-start preset - ERROR: ' + error.message);
}

// Test 4: Custom sequence validation
console.log('\nTest Group 3: Validation\n');
try {
  // Valid custom sequence
  const customConfig = new WheelConfiguration({
    sequenceName: 'custom',
    customSequence: Array.from({length: 64}, (_, i) => i + 1) // 1-64 sequential
  });
  assert(true, 'Valid custom sequence accepted');
} catch (error) {
  assert(false, 'Valid custom sequence accepted - ERROR: ' + error.message);
}

// Test 5: Invalid rotation offset
try {
  new WheelConfiguration({ rotationOffset: 400 }); // Invalid: > 360
  assert(false, 'Invalid rotation offset rejected');
} catch (error) {
  assert(true, 'Invalid rotation offset rejected');
}

// Test 6: Invalid direction
try {
  new WheelConfiguration({ direction: 'sideways' }); // Invalid
  assert(false, 'Invalid direction rejected');
} catch (error) {
  assert(true, 'Invalid direction rejected');
}

// Test 7: Duplicate gates in sequence
try {
  new WheelConfiguration({
    sequenceName: 'custom',
    customSequence: [1, 1, 3, 4, /* ... */] // Duplicate 1
  });
  assert(false, 'Duplicate gates rejected');
} catch (error) {
  assert(true, 'Duplicate gates rejected');
}

// Test 8: getWheelIndex() works correctly (with rave-wheel-41-start default)
console.log('\nTest Group 4: Methods\n');
const testConfig = new WheelConfiguration();
const index41 = testConfig.getWheelIndex(41);
assert(index41 === 0, 'Gate 41 is at wheel index 0 in rave-wheel-41-start (default)');

const index10 = testConfig.getWheelIndex(10);
assert(index10 === 58, 'Gate 10 is at wheel index 58 in rave-wheel-41-start (default)');

const index19 = testConfig.getWheelIndex(19);
assert(index19 === 1, 'Gate 19 is at wheel index 1 in rave-wheel-41-start');

// Test 9: getAngle() calculation (with rave-wheel-41-start default - 33.75° rotation)
// With 33.75° rotation, Gate 41 at position 0 appears at 33.75°, Gates 10/11 at north (0°)
const angle41 = testConfig.getAngle(41, 1);
assert(Math.abs(angle41 - 33.75) < 0.01, 'Gate 41 line 1 is at 33.75° with default rotation');

const angle10 = testConfig.getAngle(10, 1);
assert(Math.abs(angle10 - 0) < 1, 'Gate 10 line 1 is at ~0° (north) with default rotation');

const angle41line2 = testConfig.getAngle(41, 2);
assert(Math.abs(angle41line2 - 34.6875) < 0.01, 'Gate 41 line 2 is at ~34.69° (33.75 + 0.9375)');

// Test 10: Rotation offset works
console.log('\nTest Group 5: Rotation Offset\n');
const rotatedConfig = new WheelConfiguration({
  sequenceName: 'rave-wheel-41-start',
  rotationOffset: 45
});
const angleRotated = rotatedConfig.getAngle(41, 1);
assert(angleRotated === 45, 'Custom rotation offset overrides default (Gate 41 at 45° with custom rotation)');

// Test 11: Direction affects traversal
console.log('\nTest Group 6: Direction\n');
const counterClockwiseConfig = new WheelConfiguration({
  sequenceName: 'rave-wheel-41-start',
  direction: 'counter-clockwise',
  rotationOffset: 0
});
// Test that direction actually changes the traversal
const ccwIndex = counterClockwiseConfig.getWheelIndex(41);
// Default is clockwise, this should be different with counter-clockwise
assert(ccwIndex === 0, 'Gate 41 still at position 0, but direction affects angle calculation');

// Test 12: getGateAtAngle() reverse lookup (with default rotation)
console.log('\nTest Group 7: Reverse Lookup\n');
const defaultConfig = new WheelConfiguration();
const gateAt0 = defaultConfig.getGateAtAngle(0);
assert(gateAt0.gateNumber === 10, 'Reverse lookup: angle 0 = gate 10 (with default 33.75° rotation)');
assert(gateAt0.lineNumber === 1, 'Reverse lookup: angle 0 = line 1');

// Gate 41 would be at angle 33.75° with default config
const gateAt33 = defaultConfig.getGateAtAngle(33.75);
assert(gateAt33.gateNumber === 41, 'Reverse lookup: angle 33.75 = gate 41 (array position 0 + rotation)');

// Test 13: All 64 gates are unique in sequence
console.log('\nTest Group 8: Sequence Integrity\n');
const raveSeq = WheelConfiguration.fromPreset('rave-wheel-41-start');
const uniqueGatesRave = new Set(raveSeq.sequence);
assert(uniqueGatesRave.size === 64, 'rave-wheel-41-start sequence has 64 unique gates');

const gates10Seq = WheelConfiguration.fromPreset('gates-10-start');
const uniqueGates10 = new Set(gates10Seq.sequence);
assert(uniqueGates10.size === 64, 'gates-10-start sequence has 64 unique gates');

// Test 14: All gates 1-64 are present
let allGatesPresent = true;
for (let i = 1; i <= 64; i++) {
  if (!raveSeq.sequence.includes(i)) {
    allGatesPresent = false;
    break;
  }
}
assert(allGatesPresent, 'rave-wheel-41-start sequence contains all gates 1-64');

// Test 15: Export config works
console.log('\nTest Group 9: Export\n');
const exportedConfig = testConfig.exportConfig();
assert(exportedConfig.sequenceName === 'rave-wheel-41-start', 'Export includes sequence name (rave-wheel-41-start default)');
assert(Array.isArray(exportedConfig.sequence), 'Export includes sequence array');
assert(exportedConfig.direction === 'counter-clockwise', 'Export includes direction (counter-clockwise default)');
assert(exportedConfig.rotationOffset === 33.75, 'Export includes rotation offset (33.75° default)');

// Summary
console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests} ✅`);
console.log(`Failed: ${failedTests} ❌`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests === 0) {
  console.log('\n✅ ALL CONFIGURATION TESTS PASSED');
  process.exit(0);
} else {
  console.log(`\n❌ ${failedTests} TESTS FAILED`);
  process.exit(1);
}
```

### Task 2.5: Create Direction Hypothesis Test

**File:** `tests/configuration/test-direction-hypothesis.js`

```javascript
/**
 * Direction Hypothesis Test
 *
 * Tests whether clockwise or counter-clockwise direction
 * matches the known SVG master coordinates
 */

const positioning = require('../../core/root-system/positioning-algorithm.js');

console.log('='.repeat(60));
console.log('DIRECTION HYPOTHESIS TEST');
console.log('Testing clockwise vs counter-clockwise against known coordinates');
console.log('='.repeat(60) + '\n');

// Known coordinates with DEFAULT rotation (33.75°)
// These are EXPECTED positions with rave-wheel-41-start sequence + 33.75° rotation
const KNOWN_POSITIONS = {
  10: {
    expectedAngle: 0,
    position: 'NORTH',
    description: 'Gate 10 at north (0°) with default 33.75° rotation'
  },
  11: {
    expectedAngle: 354.375,
    position: 'Just before north (counter-clockwise)',
    description: 'Gate 11 near north with default rotation'
  },
  41: {
    expectedAngle: 33.75,
    position: 'Just past north (clockwise)',
    description: 'Gate 41 at 33.75° (array position 0 + rotation)'
  },
  19: {
    expectedAngle: 39.375,
    position: 'Slightly past Gate 41',
    description: 'Gate 19 at 39.375° (position 1 + rotation)'
  }
  // These test with DEFAULT 33.75° rotation that makes Gates 10/11 at north
};

function testDirection(direction) {
  console.log(`\nTesting with direction: ${direction.toUpperCase()}`);
  console.log('-'.repeat(60));

  // Set configuration with DEFAULT rotation (33.75°)
  positioning.setWheelConfiguration({
    sequenceName: 'rave-wheel-41-start',
    direction: direction,
    rotationOffset: 33.75  // Test with default rotation
  });

  let matches = 0;
  let total = 0;

  for (const [gate, expected] of Object.entries(KNOWN_POSITIONS)) {
    const gateNum = parseInt(gate);
    const pos = positioning.getWheelPosition(gateNum, 1);

    total++;

    // Allow small tolerance for floating point
    const angleMatch = Math.abs(pos.angle - expected.expectedAngle) < 0.01;

    if (angleMatch) {
      matches++;
      console.log(`✅ Gate ${gate}: ${pos.angle}° (expected ${expected.expectedAngle}°) - MATCH`);
    } else {
      console.log(`❌ Gate ${gate}: ${pos.angle}° (expected ${expected.expectedAngle}°) - MISMATCH`);
    }
    console.log(`   ${expected.description}`);
  }

  const percentage = (matches / total * 100).toFixed(1);
  console.log(`\nResult: ${matches}/${total} positions match (${percentage}%)`);

  return { direction, matches, total, percentage };
}

// Test both directions
const ccwResults = testDirection('counter-clockwise');
const cwResults = testDirection('clockwise');

// Report findings
console.log('\n' + '='.repeat(60));
console.log('DIRECTION HYPOTHESIS RESULTS');
console.log('='.repeat(60));
console.log(`Counter-clockwise: ${ccwResults.percentage}% match`);
console.log(`Clockwise: ${cwResults.percentage}% match`);

if (ccwResults.matches > cwResults.matches) {
  console.log('\n✅ RECOMMENDATION: Use counter-clockwise direction');
  console.log('   Counter-clockwise matches known SVG coordinates better.');
} else if (cwResults.matches > ccwResults.matches) {
  console.log('\n⚠️  RECOMMENDATION: Use clockwise direction');
  console.log('   Clockwise matches known SVG coordinates better.');
  console.log('   This suggests the default should be changed.');
} else {
  console.log('\n⚠️  INCONCLUSIVE: Both directions match equally');
  console.log('   More verified coordinates needed for definitive answer.');
}

console.log('\n' + '='.repeat(60));
console.log('NOTE: Add more known coordinates from SVG master file');
console.log('to increase confidence in direction choice.');
console.log('='.repeat(60));
```

### Task 2.6: Update Existing Tests

**Run all existing tests to ensure they still pass:**

```bash
node tests/comprehensive-unified-query-tests.js
node tests/adapted-old-tests.js
```

**If any tests fail:**
- The default configuration should have Gates 10/11 at north (not Gate 41)
- Check that `rave-wheel-41-start` sequence is correct (counter-clockwise, 33.75° rotation)
- Verify angle calculations include rotation offset

**Add test to verify default configuration:**

Add to `tests/comprehensive-unified-query-tests.js`:

```javascript
// NEW TEST: Default configuration (rave wheel with Gates 10/11 at north)
console.log('\n16. DEFAULT CONFIGURATION - GATES 10/11 AT NORTH');
console.log('='.repeat(60) + '\n');

// Test that default config makes Gates 10/11 appear at north
const positioning = require('../core/root-system/positioning-algorithm.js');

// Default config: rave-wheel-41-start with 33.75° rotation
// This makes Gates 10/11 appear at north (0°)
const pos10 = positioning.getWheelPosition(10, 1);
assertTest(Math.abs(pos10.angle - 0) < 1, 'Gate 10 at ~0° (north) with default config');
assertTest(pos10.wheelIndex === 58, 'Gate 10 at array position 58');

const pos11 = positioning.getWheelPosition(11, 1);
assertTest(Math.abs(pos11.angle - 354.375) < 1, 'Gate 11 near north (~354°) with default config');

// Gate 41 is at array position 0, but angle is 33.75° (not 0°) due to rotation
const pos41 = positioning.getWheelPosition(41, 1);
assertTest(pos41.wheelIndex === 0, 'Gate 41 at array position 0');
assertTest(Math.abs(pos41.angle - 33.75) < 0.01, 'Gate 41 at 33.75° with default rotation');

// Gate 19 at array position 1
const pos19 = positioning.getWheelPosition(19, 1);
assertTest(pos19.wheelIndex === 1, 'Gate 19 at array position 1');
assertTest(Math.abs(pos19.angle - 39.375) < 0.01, 'Gate 19 at 39.375° (position 1 + 33.75° rotation)');
```

### Task 2.7: Update Package.json Scripts

Add new test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "node tests/comprehensive-unified-query-tests.js",
    "test:config": "node tests/configuration/test-wheel-config.js",
    "test:direction": "node tests/configuration/test-direction-hypothesis.js",
    "test:all": "npm run test && npm run test:config"
  }
}
```

### Task 2.8: Run All Tests

```bash
# Run configuration tests
npm run test:config

# Run direction hypothesis test
npm run test:direction

# Run original tests
npm test

# Run everything
npm run test:all
```

**All tests must pass before proceeding.**

### Task 2.9: Git Commit

```bash
git add .
git commit -m "Session 02: Configuration system implementation

- Create WheelConfiguration class with full configuration support
- Add rave-wheel-41-start.json sequence (DEFAULT - counter-clockwise, 33.75° rotation)
- Add gates-10-start.json sequence (ALTERNATIVE - Gates 10/11 at array start)
- THREE MANDATORY fields per sequence: sequence, direction, rotationOffset
- Update positioning-algorithm.js to use configurable wheel
- Implement setWheelConfiguration() and getWheelConfiguration()
- Support rotation offset, direction, and swappable sequences
- Test counter-clockwise vs clockwise direction hypothesis
- All configuration tests passing
- Default: Gates 10/11 appear at north (0°) via 33.75° rotation

New capabilities:
- Decouple array order from visual presentation
- Rotate wheel by any angle (0-360°)
- Flip direction counter-clockwise/clockwise
- Custom sequences supported
- Array position 0 = Gate 41, Visual north = Gates 10/11

Architecture: Modular, configurable, maintains calculation-first model
Direction: Counter-clockwise (solar system alignment)
Rotation: 33.75° default (Gates 10/11 at north)
NO monolithic database

Session: 02/10 (Configuration System)
Next: Session 03 (TypeScript Definitions)"

git tag -a v3.0.0-alpha.2-session-02 -m "Session 02 complete: Configuration System"
```

---

## VERIFICATION CHECKLIST

### Code Verification:
- [ ] `wheel-config.js` created with WheelConfiguration class
- [ ] Sequence files created (rave-wheel-41-start with all mandatory fields)
- [ ] Sequences README explains three mandatory fields clearly
- [ ] `positioning-algorithm.js` updated to use config
- [ ] New methods exported: setWheelConfiguration, getWheelConfiguration
- [ ] Default: rave-wheel-41-start, counter-clockwise, 33.75° rotation (Gates 10/11 at north)

### Test Verification:
- [ ] Configuration tests pass (15+ tests)
- [ ] Direction hypothesis test runs with default 33.75° rotation
- [ ] All 89 existing tests still pass
- [ ] Default config makes Gates 10/11 at north (0°)

### Functionality Verification:
- [ ] Can switch between rave-wheel-41-start and gates-10-start sequences
- [ ] Can set rotation offset (0-360°)
- [ ] Can change direction (counter-clockwise/clockwise)
- [ ] getWheelPosition() uses configuration with rotation
- [ ] Default: Array position 0 = Gate 41, Visual north = Gates 10/11 (DECOUPLED)

### Documentation Verification:
- [ ] Sequences have clear documentation
- [ ] Configuration options explained
- [ ] Examples of usage provided

---

## COMPLETION CRITERIA

✅ **This session is complete when:**

1. Configuration system fully implemented
2. Both sequence files working
3. All configuration tests pass
4. Direction hypothesis tested
5. All existing tests pass
6. Backward compatible with V2
7. Git committed and tagged

✅ **Ready to proceed to Session 03:** TypeScript Definitions

---

## TROUBLESHOOTING

### Issue: Tests fail with new positioning

**Solution:**
- Verify default config is 'rave-wheel-41-start' with 33.75° rotation
- Check that rave-wheel-41-start sequence matches gate-sequence.json exactly
- Ensure Gates 10/11 at 0° with default 33.75° rotation
- Gate 41 should be at 33.75° (not 0°) with default rotation
- Remember: Array order ≠ Visual presentation (rotation decouples them)

### Issue: Direction test is inconclusive

**Solution:**
- Add more known coordinates from SVG master file
- Test against actual visualization output
- Document findings even if inconclusive

### Issue: Custom sequence validation errors

**Solution:**
- Check sequence has exactly 64 gates
- Verify all gates 1-64 present
- Ensure no duplicates

---

## SESSION SUMMARY TEMPLATE

```
✅ SESSION 02 COMPLETE: Configuration System

Deliverables:
- [x] WheelConfiguration class implemented
- [x] rave-wheel-41-start (default) with mandatory direction + rotation fields
- [x] gates-10-start (alternative) sequence file
- [x] Updated positioning algorithm with config support
- [x] Configuration tests passing
- [x] Direction hypothesis tested with default 33.75° rotation
- [x] All 89 existing tests updated for new default

Tests: 104+ passing (89 existing + 15 config tests)
Duration: [X hours]
Branch: session-02-configuration
Tag: v3.0.0-alpha.2-session-02

Key Achievement: Array order decoupled from visual presentation
Default Config: rave-wheel-41-start, counter-clockwise, 33.75° rotation
Visual Result: Gates 10/11 at north (0°), Gate 41 at 33.75°
Direction: Counter-clockwise (solar system alignment)

Next Session: 03 (TypeScript Definitions)
Status: ✅ READY TO PROCEED
```

---

*Session 02 of 10 - Configuration System*
*Solves the fundamental gate positioning issue*
