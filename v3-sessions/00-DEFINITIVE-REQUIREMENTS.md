# DEFINITIVE REQUIREMENTS - Wheel Configuration System

**Date:** November 17, 2025
**Status:** ✅ FINAL - THIS IS THE SINGLE SOURCE OF TRUTH
**Supersedes:** All other analysis documents (PROMPT-CONFLICTS, V2-COMPATIBILITY, etc.)

---

## THE CONFUSION ENDS HERE

This document defines the FINAL, CORRECT requirements for the V3 wheel configuration system.

All conflicting analysis documents are archived for historical reference but **THIS** is what we implement.

---

## DEFAULT CONFIGURATION: `rave-wheel-41-start`

The default configuration has THREE mandatory values that work together:

### 1. Sequence Array
```json
[41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60]
```

- **Array position 0:** Gate 41
- **Array position 1:** Gate 19
- **Array position 58:** Gate 10
- **Array position 59:** Gate 58
- **Array position 63:** Gate 60 (last position)

### 2. Direction
```json
"direction": "counter-clockwise"
```

**Why counter-clockwise?**
- Matches the solar system planets and sun movement
- Mathematically: array position 0 → angle 0°, position 1 → angle 5.625° (increasing angles)
- This is how V2 worked (even though it wasn't explicitly stated)

### 3. Rotation Offset
```json
"rotationOffset": 33.75
```

**What this does:**
- Rotates the entire wheel by 33.75 degrees
- Makes Gates 10/11 straddle the north line (0°)
- Gate 41 (at array position 0) appears at visual angle 33.75°

---

## THE KEY INSIGHT: DECOUPLING

**Array Order ≠ Visual Presentation**

The three values decouple these concerns:
- **Sequence** = Array order (for calculations)
- **Direction** = How the wheel traverses (counter-clockwise vs clockwise)
- **Rotation Offset** = Visual alignment (makes 10/11 at north)

**Example with default config:**
```javascript
// Array position (for code):
array[0] = 41      // Gate 41 is first in array

// Visual position (for display):
visualAngle(10) = 0°     // Gate 10 appears at north visually
visualAngle(41) = 33.75° // Gate 41 appears at 33.75° visually
```

---

## ALTERNATIVE CONFIGURATION: `gates-10-start`

An alternative where Gates 10/11 are at the START of the array (no rotation needed):

### Sequence Array
```json
[10, 11, 26, 5, 9, 34, 14, 43, 1, 44, 28, 50, 32, 57, 48, 18,
 46, 6, 47, 64, 40, 59, 29, 4, 7, 33, 31, 56, 62, 53, 39, 52,
 15, 12, 45, 35, 16, 20, 8, 23, 2, 24, 27, 3, 42, 51, 21, 17,
 25, 36, 22, 63, 37, 55, 30, 49, 13, 19, 41, 60, 61, 54, 38, 58]
```

### Direction
```json
"direction": "counter-clockwise"
```

### Rotation Offset
```json
"rotationOffset": 0
```

**Result:**
- Array position 0 = Gate 10
- Visual angle 0° = Gate 10
- No rotation needed since 10/11 already at array start

---

## FORGET V2 COMPATIBILITY

**Important:** We are NOT trying to maintain V2 angle compatibility.

V2 will continue to work because:
- ✅ Data (Gene Keys, Centers, Binary) is based on gate NUMBER, not position
- ✅ Most V2 code doesn't care about angles at all
- ❌ Angles WILL change (Gates 10/11 at north vs Gate 41 at north)

**This is intentional and correct.** V3 fixes the positioning to match actual rave wheel conventions.

---

## THE "OLD WAY" (Clockwise - Archived)

There may have been an older arrangement that used:
- Sequence: `[41, 19, 13, ...]` (same array)
- Direction: `clockwise`
- Rotation offset: Some value

**Status:** Needs investigation. If found, can be added as `old-way-clockwise` preset for historical compatibility.

**Current decision:** Not implementing this unless specifically needed. Focus on the correct counter-clockwise default.

---

## MANDATORY SEQUENCE FILE FORMAT

Every sequence file MUST have all three fields:

```json
{
  "name": "rave-wheel-41-start",
  "description": "Default rave wheel - 41 at array start, 10/11 at visual north",
  "version": "1.0.0",
  "source": "Ra Uru Hu - Human Design System",
  "sequence": [41, 19, 13, ...],        // MANDATORY - all 64 gates
  "direction": "counter-clockwise",     // MANDATORY - traversal direction
  "rotationOffset": 33.75,              // MANDATORY - visual rotation in degrees
  "notes": {
    "arrayPosition0": "Gate 41",
    "visualNorth": "Gates 10/11 via rotation"
  }
}
```

**All three fields are MANDATORY** - even if rotation is 0, it must be specified.

---

## IMPLEMENTATION CHECKLIST

### Session 02 (Configuration System)
- [x] Create `rave-wheel-41-start.json` with counter-clockwise + 33.75° rotation
- [x] Create `gates-10-start.json` with counter-clockwise + 0° rotation
- [x] WheelConfiguration class loads all three mandatory fields
- [x] Default tests expect Gates 10/11 at north (not Gate 41 at 0°)
- [x] Direction tests use counter-clockwise as default
- [x] All angle assertions match: Gate 10 at ~0°, Gate 41 at 33.75°

### All Other Sessions (03-10)
- [ ] Replace any `clockwise` references with `counter-clockwise` as default
- [ ] Use `rave-wheel-41-start` and `gates-10-start` consistently (no other names)
- [ ] No references to V2 compatibility for angles
- [ ] All examples use the three mandatory fields

---

## WHAT CHANGED FROM EARLIER ANALYSIS

**Previous confusion documents said:**
- Some said `clockwise`, some said `counter-clockwise` ❌
- Some used `v2-baseline`, `hd-standard`, `iching-traditional` names ❌
- Some focused on V2 angle compatibility ❌

**The truth (what we implement):**
- Direction: `counter-clockwise` (matches solar system) ✅
- Names: `rave-wheel-41-start` (default), `gates-10-start` (alternative) ✅
- Forget V2 angle compatibility - focus on clearing confusion ✅

---

## TERMS & DEFINITIONS

**Sequence** = Array of 64 gates in wheel order
**Direction** = `counter-clockwise` or `clockwise` traversal
**Rotation Offset** = Degrees (0-360) to rotate visual display
**Configuration** = Sequence + Direction + Rotation together
**Preset** = Named configuration (e.g., `rave-wheel-41-start`)

**DO NOT USE:**
- ❌ "V2 baseline" - confusing, forget V2
- ❌ "HD standard" - ambiguous
- ❌ "iching-traditional" - not defined
- ❌ "ra-uru-hu" - use `rave-wheel-41-start` instead

---

## LINE-LEVEL PRECISION (CRITICAL)

**The system MUST maintain line-level precision of 0.9375° per line**

- 64 gates × 6 lines = 384 total line positions
- Each line = 0.9375 degrees (360° / 384)
- This is the **finest granularity** of the positioning system
- Critical for incarnation crosses and accurate chart calculations

**Example:**
```javascript
// Gate 41, Line 1 with default rotation (33.75°)
getAngle(41, 1) = 33.75°

// Gate 41, Line 2 with default rotation
getAngle(41, 2) = 34.6875°  // 33.75 + 0.9375 ✅

// Line increment MUST be exactly 0.9375°
```

---

## VERIFICATION TESTS

Default configuration must pass:

```javascript
const config = new WheelConfiguration(); // Defaults to rave-wheel-41-start

// Array positions
assert(config.sequence[0] === 41);
assert(config.sequence[58] === 10);
assert(config.sequence[63] === 60);

// Configuration values
assert(config.direction === 'counter-clockwise');
assert(config.rotationOffset === 33.75);

// Visual angles (with rotation applied)
const pos10 = config.getAngle(10, 1);
assert(Math.abs(pos10 - 0) < 1); // Gate 10 at ~0° (north)

const pos41 = config.getAngle(41, 1);
assert(Math.abs(pos41 - 33.75) < 0.01); // Gate 41 at 33.75°

// LINE-LEVEL PRECISION (CRITICAL TEST)
const line1 = config.getAngle(41, 1);
const line2 = config.getAngle(41, 2);
assert(Math.abs(line2 - line1 - 0.9375) < 0.0001); // Precision maintained
```

---

## CONCLUSION

**This is THE definitive spec. No more confusion. No more analysis documents.**

Implement exactly this:
1. Default: `rave-wheel-41-start` with counter-clockwise + 33.75° rotation
2. Alternative: `gates-10-start` with counter-clockwise + 0° rotation
3. Three mandatory fields in every sequence file
4. Forget V2 angle compatibility
5. Focus on clearing up all confusion

**Any questions? Resolve them NOW before implementation.**

---

**Status:** Ready for implementation ✅
