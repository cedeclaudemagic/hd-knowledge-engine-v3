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
2. `core/root-system/sequences/hd-standard.json` - HD wheel (Gates 10/11 at north)
3. `core/root-system/sequences/iching-traditional.json` - I Ching wheel (Gate 41 at position 0)
4. `core/root-system/sequences/README.md` - Sequence documentation
5. Updated `core/root-system/positioning-algorithm.js` - Uses configuration
6. `tests/configuration/test-wheel-config.js` - Configuration tests
7. `tests/configuration/test-direction-hypothesis.js` - Direction testing
8. All existing tests still passing

---

## TASKS

### Task 2.1: Create Sequence Files

**IMPORTANT:** The V2 baseline uses Gate 41 at position 0. To maintain backward compatibility, this must remain the DEFAULT. Alternative sequences (like hd-standard) are opt-in.

**File:** `core/root-system/sequences/v2-baseline.json` **(DEFAULT - V2 Compatible)**

```json
{
  "name": "v2-baseline",
  "description": "V2 Baseline - Gate 41 at position 0 (maintains V2 compatibility)",
  "version": "2.0.0",
  "source": "HD Knowledge Engine V2.0 - Ra Uru Hu wheel order",
  "direction": "counter-clockwise",
  "notes": {
    "position0": "Gate 41 at wheel position 0 (NORTH - 0 degrees)",
    "position1": "Gate 19 at wheel position 1 (just past north)",
    "position58": "Gate 10 at wheel position 58",
    "compatibility": "This is the V2 baseline sequence - DO NOT CHANGE to maintain backward compatibility"
  },
  "sequence": [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
    27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
    31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
    28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
  ]
}
```

**File:** `core/root-system/sequences/hd-standard.json` **(ALTERNATIVE)**

```json
{
  "name": "hd-standard",
  "description": "Human Design Standard - Gates 10/11 straddle north at 0 degrees",
  "version": "1.0.0",
  "source": "Verified from Illustrator Master SVG",
  "direction": "counter-clockwise",
  "notes": {
    "position0": "Gate 10 at wheel position 0 (NORTH - 0 degrees)",
    "position1": "Gate 11 at wheel position 1 (just past north)",
    "verification": "Extracted from the-64-hexagrams-master.svg divider lines",
    "usage": "Use this for HD wheel visualizations where Gates 10/11 should be at north"
  },
  "sequence": [
    10, 11, 26, 5, 9, 34, 14, 43, 1, 44, 28, 50, 32, 57, 48, 18,
    46, 6, 47, 64, 40, 59, 29, 4, 7, 33, 31, 56, 62, 53, 39, 52,
    15, 12, 45, 35, 16, 20, 8, 23, 2, 24, 27, 3, 42, 51, 21, 17,
    25, 36, 22, 63, 37, 55, 30, 49, 13, 19, 41, 60, 61, 54, 38, 58
  ]
}
```

**File:** `core/root-system/sequences/README.md`

```markdown
# Gate Sequence Files

This directory contains swappable gate sequence arrays for different wheel traditions.

## What Is a Gate Sequence?

A gate sequence defines the order of gates around the 360° wheel. Position 0 is at "north" (top of wheel), and positions progress counter-clockwise by default.

## Available Sequences

### v2-baseline.json (DEFAULT - V2 Compatible)
- Gate 41 at position 0 (north)
- Gate 10 at position 58
- This is the V2.0 baseline sequence
- **Use this for:** Default behavior, backward compatibility, existing V2 code
- **DO NOT CHANGE:** This must remain the default for V2 compatibility

### hd-standard.json (ALTERNATIVE)
- Gates 10 and 11 straddle north (0°)
- Verified from Illustrator master SVG
- Alternative Human Design wheel arrangement
- **Use this for:** HD wheel visualizations where Gates 10/11 should be at north
- **Opt-in:** Users must explicitly request this sequence

## Creating Custom Sequences

You can create your own sequence file:

```json
{
  "name": "my-custom-sequence",
  "description": "Description of what makes this sequence unique",
  "version": "1.0.0",
  "source": "Where this sequence comes from",
  "direction": "counter-clockwise",
  "notes": {
    "position0": "Which gate starts at north"
  },
  "sequence": [
    /* All 64 gates in your desired order */
  ]
}
```

**Requirements:**
- Must contain exactly 64 gates
- Each gate 1-64 must appear exactly once
- No duplicates, no gaps

## Direction (Clockwise vs Counter-Clockwise)

The "direction" field is informational only. The actual direction is set in your wheel configuration:

```javascript
// Default uses v2-baseline (no call needed)
// To switch to alternative:
setWheelConfiguration({
  sequenceName: 'hd-standard',
  direction: 'counter-clockwise'  // or 'clockwise'
});
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

[PASTE THE COMPLETE wheel-config.js FROM THE IMPLEMENTATION PLAN HERE - the one with the WheelConfiguration class, all methods, presets, etc.]

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
let wheelConfig = new WheelConfiguration(); // Defaults to v2-baseline (V2 compatible)
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
  assert(config.config.sequenceName === 'v2-baseline', 'Default is v2-baseline (V2 compatible)');
  assert(config.sequence[0] === 41, 'Default starts with Gate 41 (V2 compatible)');
} catch (error) {
  assert(false, 'Default configuration loads - ERROR: ' + error.message);
}

// Test 2: V2 baseline preset (default)
console.log('\nTest Group 2: Presets\n');
try {
  const v2Config = WheelConfiguration.fromPreset('v2-baseline');
  assert(v2Config.sequence[0] === 41, 'V2 baseline starts with gate 41');
  assert(v2Config.sequence[1] === 19, 'V2 baseline position 1 is gate 19');
  assert(v2Config.sequence[58] === 10, 'V2 baseline position 58 is gate 10');
} catch (error) {
  assert(false, 'V2 baseline preset - ERROR: ' + error.message);
}

// Test 3: HD standard preset (alternative)
try {
  const hdConfig = WheelConfiguration.fromPreset('hd-standard');
  assert(hdConfig.sequence[0] === 10, 'HD standard starts with gate 10');
  assert(hdConfig.sequence[1] === 11, 'HD standard position 1 is gate 11');
} catch (error) {
  assert(false, 'HD standard preset - ERROR: ' + error.message);
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

// Test 8: getWheelIndex() works correctly (with V2 baseline default)
console.log('\nTest Group 4: Methods\n');
const testConfig = new WheelConfiguration();
const index41 = testConfig.getWheelIndex(41);
assert(index41 === 0, 'Gate 41 is at wheel index 0 in V2 baseline (default)');

const index10 = testConfig.getWheelIndex(10);
assert(index10 === 58, 'Gate 10 is at wheel index 58 in V2 baseline (default)');

const index19 = testConfig.getWheelIndex(19);
assert(index19 === 1, 'Gate 19 is at wheel index 1 in V2 baseline');

// Test 9: getAngle() calculation (with V2 baseline)
const angle41 = testConfig.getAngle(41, 1);
assert(angle41 === 0, 'Gate 41 line 1 is at 0 degrees (V2 baseline)');

const angle41line2 = testConfig.getAngle(41, 2);
assert(angle41line2 === 0.9375, 'Gate 41 line 2 is at 0.9375 degrees');

// Test 10: Rotation offset works
console.log('\nTest Group 5: Rotation Offset\n');
const rotatedConfig = new WheelConfiguration({
  sequenceName: 'v2-baseline',
  rotationOffset: 45
});
const angleRotated = rotatedConfig.getAngle(41, 1);
assert(angleRotated === 45, 'Rotation offset adds to angle (Gate 41 now at 45° instead of 0°)');

// Test 11: Clockwise direction reverses index
console.log('\nTest Group 6: Direction\n');
const clockwiseConfig = new WheelConfiguration({
  sequenceName: 'v2-baseline',
  direction: 'clockwise'
});
// In clockwise, indices are reversed
const cwIndex = clockwiseConfig.getWheelIndex(41);
// Should be different from counter-clockwise
assert(cwIndex !== index41, 'Clockwise direction changes wheel index');

// Test 12: getGateAtAngle() reverse lookup (V2 baseline)
console.log('\nTest Group 7: Reverse Lookup\n');
const ccwConfig = new WheelConfiguration();
const gateAt0 = ccwConfig.getGateAtAngle(0);
assert(gateAt0.gateNumber === 41, 'Reverse lookup: angle 0 = gate 41 (V2 baseline)');
assert(gateAt0.lineNumber === 1, 'Reverse lookup: angle 0 = line 1');

// Test 13: All 64 gates are unique in sequence
console.log('\nTest Group 8: Sequence Integrity\n');
const v2Seq = WheelConfiguration.fromPreset('v2-baseline');
const uniqueGatesV2 = new Set(v2Seq.sequence);
assert(uniqueGatesV2.size === 64, 'V2 baseline sequence has 64 unique gates');

const hdSeq = WheelConfiguration.fromPreset('hd-standard');
const uniqueGatesHD = new Set(hdSeq.sequence);
assert(uniqueGatesHD.size === 64, 'HD standard sequence has 64 unique gates');

// Test 14: All gates 1-64 are present
let allGatesPresent = true;
for (let i = 1; i <= 64; i++) {
  if (!v2Seq.sequence.includes(i)) {
    allGatesPresent = false;
    break;
  }
}
assert(allGatesPresent, 'V2 baseline sequence contains all gates 1-64');

// Test 15: Export config works
console.log('\nTest Group 9: Export\n');
const exportedConfig = testConfig.exportConfig();
assert(exportedConfig.sequenceName === 'v2-baseline', 'Export includes sequence name (v2-baseline default)');
assert(Array.isArray(exportedConfig.sequence), 'Export includes sequence array');
assert(exportedConfig.direction === 'counter-clockwise', 'Export includes direction');

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

// Known coordinates from V2 baseline (ACTUAL current behavior)
// These are VERIFIED positions from core/root-system/gate-sequence.json
const KNOWN_POSITIONS = {
  41: {
    expectedAngle: 0,
    position: 'NORTH',
    description: 'Gate 41 at north (0°) - V2 baseline position 0'
  },
  19: {
    expectedAngle: 5.625,
    position: 'Just past north',
    description: 'Gate 19 at 5.625° - V2 baseline position 1'
  },
  10: {
    expectedAngle: 326.25,
    position: 'Near north (counter-clockwise from north)',
    description: 'Gate 10 at ~326° - V2 baseline position 58'
  }
  // These are the ACTUAL V2 positions - do not change!
  // If testing HD standard sequence, use different test
};

function testDirection(direction) {
  console.log(`\nTesting with direction: ${direction.toUpperCase()}`);
  console.log('-'.repeat(60));

  // Set configuration (using V2 baseline for testing)
  positioning.setWheelConfiguration({
    sequenceName: 'v2-baseline',
    direction: direction,
    rotationOffset: 0
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
- The default configuration should match old behavior
- Check that `hd-standard` sequence is correct
- Verify angle calculations match old positioning-algorithm.js

**Add test to verify backward compatibility:**

Add to `tests/comprehensive-unified-query-tests.js`:

```javascript
// NEW TEST: Configuration backward compatibility
console.log('\n16. CONFIGURATION BACKWARD COMPATIBILITY');
console.log('='.repeat(60) + '\n');

// Test that default config matches V2 behavior
const positioning = require('../core/root-system/positioning-algorithm.js');

// V2 baseline has Gate 41 at position 0 (angle 0°)
const pos41 = positioning.getWheelPosition(41, 1);
assertTest(pos41.angle === 0, 'Gate 41 at 0° with default config (V2 compatible)');
assertTest(pos41.wheelIndex === 0, 'Gate 41 at position 0 (V2 compatible)');

// V2 baseline has Gate 10 at position 58 (angle ~326.25°)
const pos10 = positioning.getWheelPosition(10, 1);
assertTest(pos10.wheelIndex === 58, 'Gate 10 at position 58 (V2 compatible)');
assertTest(Math.abs(pos10.angle - 326.25) < 0.01, 'Gate 10 at ~326.25° (V2 compatible)');

// V2 baseline has Gate 19 at position 1
const pos19 = positioning.getWheelPosition(19, 1);
assertTest(pos19.wheelIndex === 1, 'Gate 19 at position 1 (V2 compatible)');
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
- Add v2-baseline.json sequence (Gate 41 at position 0 - DEFAULT)
- Add hd-standard.json sequence (Gates 10/11 at north - ALTERNATIVE)
- Update positioning-algorithm.js to use configurable wheel
- Implement setWheelConfiguration() and getWheelConfiguration()
- Support rotation offset, direction, and swappable sequences
- Test clockwise vs counter-clockwise direction hypothesis
- All configuration tests passing
- All existing V2 tests still passing (backward compatible)

New capabilities:
- Swap between HD and I Ching wheel arrangements
- Rotate wheel by any angle
- Flip direction clockwise/counter-clockwise
- Custom sequences supported

Architecture: Modular, configurable, maintains calculation-first model
NO monolithic database

Session: 02/10 (Configuration System)
Next: Session 03 (TypeScript Definitions)"

git tag -a v3.0.0-alpha.2-session-02 -m "Session 02 complete: Configuration System"
```

---

## VERIFICATION CHECKLIST

### Code Verification:
- [ ] `wheel-config.js` created with WheelConfiguration class
- [ ] Sequence files created (v2-baseline as default, hd-standard as alternative)
- [ ] Sequences README explains usage and makes default clear
- [ ] `positioning-algorithm.js` updated to use config
- [ ] New methods exported: setWheelConfiguration, getWheelConfiguration
- [ ] Default configuration is v2-baseline (Gate 41 at position 0)

### Test Verification:
- [ ] Configuration tests pass (15+ tests)
- [ ] Direction hypothesis test runs (shows results)
- [ ] All 89 existing tests still pass
- [ ] Backward compatibility verified

### Functionality Verification:
- [ ] Can switch between HD and I Ching sequences
- [ ] Can set rotation offset
- [ ] Can change direction
- [ ] getWheelPosition() uses configuration
- [ ] Default behavior matches V2

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
- Verify default config is 'v2-baseline' (NOT 'hd-standard')
- Check that v2-baseline sequence matches old gate-sequence.json exactly
- Ensure angle calculations identical to V2 (Gate 41 at 0°, Gate 10 at 326.25°)
- Remember: hd-standard is an ALTERNATIVE, not the default

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
- [x] V2 baseline (default) and HD standard (alternative) sequences
- [x] Updated positioning algorithm with config support
- [x] Configuration tests passing
- [x] Direction hypothesis tested
- [x] All 89 V2 tests still passing (backward compatible)

Tests: 104+ passing (89 existing + 15 config tests)
Duration: [X hours]
Branch: session-02-configuration
Tag: v3.0.0-alpha.2-session-02

Key Achievement: Gate sequence now fully modular and configurable
Direction Test Result: [Counter-clockwise/Clockwise] recommended

Next Session: 03 (TypeScript Definitions)
Status: ✅ READY TO PROCEED
```

---

*Session 02 of 10 - Configuration System*
*Solves the fundamental gate positioning issue*
