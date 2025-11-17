# [ARCHIVED] Session Prompts - Conflicts with Correct Understanding

**🚨 THIS DOCUMENT IS ARCHIVED - DO NOT USE FOR IMPLEMENTATION**

**Status:** Historical analysis document - contains conflicting information
**Superseded by:** `00-DEFINITIVE-REQUIREMENTS.md` (THE SINGLE SOURCE OF TRUTH)
**Date:** November 17, 2025

---

## Why This Is Archived

This document represented an intermediate stage of understanding and contains some correct insights but also contradictory information. It has been superseded by the definitive requirements document.

**For implementation, use:** `00-DEFINITIVE-REQUIREMENTS.md`

---

## Original Content Below (Historical Reference Only)

**Date:** November 17, 2025
**Correct Understanding:**
- **Sequence:** `[41, 19, 13, 49...]` - Gate 41 at array position 0 (ONLY ONE default sequence)
- **Direction:** `counter-clockwise`
- **Rotation Offset:** `33.75°` - Makes Gates 10/11 appear at north visually

**Key Insight:** These are THREE INDEPENDENT configuration values. The rotation offset DECOUPLES array order from visual presentation.

---

## CRITICAL CONFLICTS FOUND

### Conflict #1: My "Fixes" Were Wrong

**What I did wrong:**
- Created "v2-baseline" vs "hd-standard" as separate DEFAULT vs ALTERNATIVE sequences
- Made tests expect "Gate 41 at angle 0°" as default
- Implied there are TWO different sequence files needed as alternatives

**What's actually correct:**
- ONE sequence: `[41, 19, 13...]`
- DEFAULT rotation: `33.75°` (puts Gates 10/11 at north visually)
- ALTERNATIVE configurations change rotation/direction, not necessarily the sequence
- Multiple sequences CAN exist, but they're ALL alternatives, not default vs alternative

### Conflict #2: Backward Compatibility Tests

**Currently in SESSION-02 (from my "fixes"):**
```javascript
// V2 baseline has Gate 41 at position 0 (angle 0°)
const pos41 = positioning.getWheelPosition(41, 1);
assertTest(pos41.angle === 0, 'Gate 41 at 0° with default config (V2 compatible)');
```

**This is WRONG because:**
- With rotation offset of 33.75°, Gate 41 will be at angle 33.75°, NOT 0°
- V2 compatibility should test Gates 10/11 at north, not Gate 41 at 0°

**Should be:**
```javascript
// Default config should put Gates 10/11 at north
const pos10 = positioning.getWheelPosition(10, 1);
const pos11 = positioning.getWheelPosition(11, 1);
assertTest(Math.abs(pos10.angle - 0) < 1, 'Gate 10 at ~0° (north) with default config');
assertTest(Math.abs(pos11.angle - 354.375) < 1, 'Gate 11 near north with default config');
```

### Conflict #3: Default Configuration Specification

**Currently in SESSION-02:**
```javascript
let wheelConfig = new WheelConfiguration(); // Defaults to v2-baseline (V2 compatible)
```

**Should be:**
```javascript
let wheelConfig = new WheelConfiguration();
// Defaults to: sequence=[41,19,13...], direction='counter-clockwise', rotationOffset=33.75°
// This makes Gates 10/11 appear at north visually
```

### Conflict #4: Sequence File Descriptions

**Currently:**
- "v2-baseline.json (DEFAULT)" with description "Gate 41 at position 0 (north)"
- "hd-standard.json (ALTERNATIVE)" with description "Gates 10/11 at north"

**This is contradictory!** They can't both be correct.

**Should be:**
- Just ONE sequence file: `gate-sequence.json` with array `[41, 19, 13...]`
- Or MULTIPLE sequence files, but don't call one "baseline" and another "standard"
- The DEFAULT CONFIGURATION uses sequence + rotation to achieve "Gates 10/11 at north"

### Conflict #5: Direction Hypothesis Test

**Currently in SESSION-02:**
```javascript
const KNOWN_POSITIONS = {
  41: { expectedAngle: 0, description: 'Gate 41 at north (0°)' },
  10: { expectedAngle: 326.25, description: 'Gate 10 at ~326°' }
};
```

**This tests the WRONG thing!** It tests with rotation=0°, not the default rotation=33.75°.

**Should test:**
```javascript
const KNOWN_POSITIONS = {
  10: { expectedAngle: 0, description: 'Gate 10 at north (0°) - with default rotation' },
  11: { expectedAngle: 354.375, description: 'Gate 11 just before north - with default rotation' },
  41: { expectedAngle: 33.75, description: 'Gate 41 at 33.75° - with default rotation' }
};
```

### Conflict #6: Configuration Preset Definitions

**The prompts don't clearly define:**
- What are the available PRESETS?
- What exact values (sequence + rotation + direction) does each preset use?
- How do presets relate to each other?

**Should define clearly:**
```javascript
PRESETS = {
  'default': {
    sequenceName: 'ra-uru-hu',  // [41, 19, 13...]
    direction: 'counter-clockwise',
    rotationOffset: 33.75  // Puts Gates 10/11 at north
  },
  'no-rotation': {
    sequenceName: 'ra-uru-hu',  // [41, 19, 13...]
    direction: 'counter-clockwise',
    rotationOffset: 0  // Raw array positions
  },
  'gates-10-11-start': {
    sequenceName: 'gates-10-start',  // [10, 11, 26...]
    direction: 'counter-clockwise',
    rotationOffset: 0  // Gates 10/11 at north via sequence
  }
}
```

### Conflict #7: Terminology Confusion

**Terms used inconsistently:**
- "V2 baseline" - unclear if this means array order or visual presentation
- "V2 compatible" - does this mean data compatibility or position compatibility?
- "HD standard" - is this a sequence or a configuration?

**Should clarify:**
- **Sequence**: The array order of gates `[41, 19, 13...]`
- **Configuration**: Sequence + Rotation + Direction combined
- **Preset**: Named configuration (e.g., "default", "no-rotation")
- **V2 Compatible**: Produces same DATA results (Gene Keys, Centers, etc.) - positions may differ

---

## SESSIONS AFFECTED

### SESSION-02: Major conflicts
- Default configuration specification
- Test assertions
- Sequence file definitions
- Direction hypothesis test
- All need revision

### SESSION-03: Minor conflicts
- TypeScript type `SequenceName` should not imply one is "baseline"
- Should define `WheelPreset` type clearly

### SESSION-05: Test conflicts
- Integration tests expecting specific positions need review
- V2 compatibility tests need correct expectations

### SESSIONS 06-10: Likely minor
- Documentation may have inherited wrong assumptions
- Need to verify once 02-05 are corrected

---

## RECOMMENDED FIX APPROACH

1. **Revert my "v2-baseline" changes** - they made it worse
2. **Define ONE default sequence**: `[41, 19, 13...]`
3. **Define DEFAULT configuration clearly**:
   - Sequence: ra-uru-hu (the [41...] array)
   - Direction: counter-clockwise
   - Rotation: 33.75° (makes 10/11 at north)
4. **Make alternative sequences/configs TRULY optional**
5. **Fix all tests to expect Gates 10/11 at north, not Gate 41 at 0°**
6. **Clarify the three config values are INDEPENDENT**

---

## QUESTIONS FOR USER

1. What should the sequence file be NAMED? (Not "v2-baseline" or "hd-standard")
   - Suggestion: `ra-uru-hu-sequence.json` or just `gate-sequence.json`

2. Should there be alternative SEQUENCES at all, or just alternative CONFIGURATIONS?
   - i.e., One sequence `[41...]` with different rotations?
   - Or multiple sequences `[41...]`, `[10...]`, `[1, 2, 3...]` etc.?

3. What exactly does "V2 compatibility" mean?
   - Same data (Gene Keys, etc.) - YES, clearly
   - Same positions (angles) - unclear, probably NO if rotation is added

---

**Status:** Major conflicts found. My previous "fixes" made the confusion WORSE, not better. Need to completely rethink the approach based on correct understanding.
