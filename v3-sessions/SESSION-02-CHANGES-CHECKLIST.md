# SESSION-02: Complete Change List

**Goal:** Update SESSION-02 to use correct rave wheel configuration

---

## Changes Needed

### ✅ COMPLETED
- [x] Task 2.1: Sequence file definitions updated to rave-wheel-41-start + gates-10-start
- [x] Task 2.1: Added mandatory direction and rotationOffset fields
- [x] Task 2.1: README.md updated with correct understanding

### ⏳ REMAINING IN SESSION-02

#### Section: Task 2.2 - Wheel Configuration Class (line ~190-210)
**Current:** References to loading default
**Change:** Default should be `rave-wheel-41-start` with direction=clockwise, rotation=33.75

#### Section: Task 2.3 - Update Positioning Algorithm (line ~210-220)
**Line 217:** `let wheelConfig = new WheelConfiguration(); // Defaults to v2-baseline (V2 compatible)`
**Change to:** `let wheelConfig = new WheelConfiguration(); // Defaults to rave-wheel-41-start (clockwise, 33.75° rotation)`

#### Section: Task 2.4 - Configuration Tests (lines ~300-465)
**Multiple instances to change:**

**Line 331:** `assert(config.config.sequenceName === 'v2-baseline', 'Default is v2-baseline (V2 compatible)');`
**Change to:** `assert(config.config.sequenceName === 'rave-wheel-41-start', 'Default is rave-wheel-41-start');`
              `assert(config.direction === 'clockwise', 'Default direction is clockwise');`
              `assert(config.rotationOffset === 33.75, 'Default rotation is 33.75°');`

**Line 332:** `assert(config.sequence[0] === 41, 'Default starts with Gate 41 (V2 compatible)');`
**Keep this** - it's correct

**Lines 337-355:** All references to "v2Config" and "hdConfig" presets
**Change:** "v2Config" → "raveWheelConfig", "v2-baseline" → "rave-wheel-41-start"
           "hdConfig" → "gates10Config", "hd-standard" → "gates-10-start"

**Lines 394-438:** Test assertions expecting angles
**CRITICAL CHANGES:**

Current (WRONG):
```javascript
const angle41 = testConfig.getAngle(41, 1);
assert(angle41 === 0, 'Gate 41 line 1 is at 0 degrees (V2 baseline)');
```

**Change to (CORRECT):**
```javascript
// With default config (rotation=33.75°), Gate 41 is NOT at 0°
const angle41 = testConfig.getAngle(41, 1);
assert(Math.abs(angle41 - 33.75) < 0.01, 'Gate 41 at 33.75° with default rotation');

// Gates 10/11 should be at north (0°) with default config
const angle10 = testConfig.getAngle(10, 1);
assert(Math.abs(angle10 - 0) < 1, 'Gate 10 at ~0° (north) with default rotation');
```

**Lines 415-420:** Rotation offset test
**Change sequenceName** from `'v2-baseline'` to `'rave-wheel-41-start'`

**Lines 424-431:** Clockwise direction test
**Change sequenceName** from `'v2-baseline'` to `'rave-wheel-41-start'`

**Lines 433-438:** Reverse lookup test
**CRITICAL CHANGE:**

Current (WRONG):
```javascript
const gateAt0 = ccwConfig.getGateAtAngle(0);
assert(gateAt0.gateNumber === 41, 'Reverse lookup: angle 0 = gate 41 (V2 baseline)');
```

**Change to (CORRECT):**
```javascript
const gateAt0 = ccwConfig.getGateAtAngle(0);
assert(gateAt0.gateNumber === 10, 'Reverse lookup: angle 0 = gate 10 (with default rotation)');
// Gate 41 would be at angle 33.75° with default config
```

**Lines 442-458:** Sequence integrity tests
**Change:** "v2Seq" → "raveSeq", "v2-baseline" → "rave-wheel-41-start"
           "hdSeq" → "gates10Seq", "hd-standard" → "gates-10-start"

**Line 463:** `assert(exportedConfig.sequenceName === 'v2-baseline'...`
**Change to:** `assert(exportedConfig.sequenceName === 'rave-wheel-41-start'...`

**Line 465:** `assert(exportedConfig.direction === 'counter-clockwise'...`
**Change to:** `assert(exportedConfig.direction === 'clockwise'...`
              `assert(exportedConfig.rotationOffset === 33.75...`

#### Section: Task 2.5 - Direction Hypothesis Test (lines ~493-580)
**CRITICAL SECTION:**

Current KNOWN_POSITIONS (WRONG - tests with rotation=0):
```javascript
const KNOWN_POSITIONS = {
  41: { expectedAngle: 0, description: 'Gate 41 at north (0°) - V2 baseline position 0' },
  10: { expectedAngle: 326.25, description: 'Gate 10 at ~326° - V2 baseline position 58' }
};
```

**Change to (CORRECT - tests with default rotation=33.75°):**
```javascript
const KNOWN_POSITIONS = {
  10: { expectedAngle: 0, description: 'Gate 10 at north (0°) with default 33.75° rotation' },
  11: { expectedAngle: 354.375, description: 'Gate 11 near north with default rotation' },
  41: { expectedAngle: 33.75, description: 'Gate 41 at 33.75° (array position 0 + rotation)' },
  19: { expectedAngle: 39.375, description: 'Gate 19 at 39.375° (position 1 + rotation)' }
};
```

**Line 529-532:** Configuration in testDirection function
**Change:**
```javascript
positioning.setWheelConfiguration({
  sequenceName: 'rave-wheel-41-start',  // Changed from v2-baseline
  direction: direction,
  rotationOffset: 33.75  // Changed from 0 - test with DEFAULT rotation
});
```

#### Section: Task 2.6 - Backward Compatibility Tests (lines ~606-628)
**CRITICAL SECTION:**

Current (WRONG):
```javascript
// V2 baseline has Gate 41 at position 0 (angle 0°)
const pos41 = positioning.getWheelPosition(41, 1);
assertTest(pos41.angle === 0, 'Gate 41 at 0° with default config (V2 compatible)');
```

**Change to (CORRECT):**
```javascript
// Default config: rave-wheel-41-start with 33.75° rotation
// This makes Gates 10/11 appear at north (0°)
const pos10 = positioning.getWheelPosition(10, 1);
assertTest(Math.abs(pos10.angle - 0) < 1, 'Gate 10 at ~0° (north) with default config');
assertTest(pos10.wheelIndex === 58, 'Gate 10 at array position 58');

const pos11 = positioning.getWheelPosition(11, 1);
assertTest(Math.abs(pos11.angle - 354.375) < 1, 'Gate 11 near north with default config');

// Gate 41 is at array position 0, but angle is 33.75° (not 0°) due to rotation
const pos41 = positioning.getWheelPosition(41, 1);
assertTest(pos41.wheelIndex === 0, 'Gate 41 at array position 0');
assertTest(Math.abs(pos41.angle - 33.75) < 0.01, 'Gate 41 at 33.75° with default rotation');
```

#### Section: Task 2.9 - Git Commit Message (line ~660-670)
**Changes:**
- Line 662: `- Add v2-baseline.json sequence...` → `- Add rave-wheel-41-start.json sequence...`
- Line 663: `- Add hd-standard.json sequence...` → `- Add gates-10-start.json sequence...`
- Add: `- Direction: clockwise (actual rave wheel)`
- Add: `- Default rotation: 33.75° (Gates 10/11 at north)`

#### Section: Verification Checklist (line ~692-696)
**Line 692:** `- [ ] Sequence files created (v2-baseline as default, hd-standard as alternative)`
**Change to:** `- [ ] Sequence files created (rave-wheel-41-start with mandatory fields)`

**Line 696:** `- [ ] Default configuration is v2-baseline (Gate 41 at position 0)`
**Change to:** `- [ ] Default: rave-wheel-41-start, clockwise, 33.75° rotation`

#### Section: Troubleshooting (line ~738-741)
**Line 738:** `- Verify default config is 'v2-baseline' (NOT 'hd-standard')`
**Change to:** `- Verify default config is 'rave-wheel-41-start'`

**Line 740:** `- Ensure angle calculations identical to V2 (Gate 41 at 0°, Gate 10 at 326.25°)`
**Change to:** `- Ensure Gates 10/11 at 0° with default 33.75° rotation`

#### Section: Summary Template (line ~765-769)
**Line 765:** `- [x] V2 baseline (default) and HD standard (alternative) sequences`
**Change to:** `- [x] rave-wheel-41-start (default) with mandatory direction + rotation fields`

---

## Summary Statistics
- **Total line references to fix:** ~40+
- **Critical angle expectation changes:** ~10
- **Sequence name changes:** ~15
- **Direction changes (counter-clockwise → clockwise):** ~5
- **New rotation offset assertions:** ~8

---

## Key Principle

**ALL tests must expect:**
- Array position 0 = Gate 41
- Visual angle 0° = Gates 10/11 (via 33.75° rotation)
- Direction = clockwise
- DECOUPLED array order from visual presentation
