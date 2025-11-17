# [PARTIALLY SUPERSEDED] FINAL CORRECT UNDERSTANDING - Rave Wheel Configuration

**⚠️ PARTIALLY SUPERSEDED - USE 00-DEFINITIVE-REQUIREMENTS.md INSTEAD**

**Status:** This document has correct insights but wrong direction (says clockwise, should be counter-clockwise)
**Superseded by:** `00-DEFINITIVE-REQUIREMENTS.md` (THE SINGLE SOURCE OF TRUTH)
**Date:** November 17, 2025

---

## Why This Is Partially Superseded

This document correctly explains the three mandatory fields and decoupling concept, BUT it incorrectly states the default direction as "clockwise" when it should be "counter-clockwise" (matching solar system movement).

**For implementation, use:** `00-DEFINITIVE-REQUIREMENTS.md`

---

## Original Content Below (Read with caution - direction is WRONG)

**Status:** CRYSTAL CLEAR (except direction - ignore clockwise references)

---

## The Three Mandatory Configuration Values

Every sequence file MUST contain:

```json
{
  "name": "rave-wheel-41-start",
  "sequence": [41, 19, 13, 49, ...],    // Array order
  "direction": "clockwise",              // MANDATORY - actual wheel movement
  "rotationOffset": 33.75                // MANDATORY - visual alignment in degrees
}
```

---

## Default Configuration

**Name:** `rave-wheel-41-start.json`

**Values:**
- **Sequence:** `[41, 19, 13, 49, 30, 55, ...]` - Gate 41 at array position 0
- **Direction:** `clockwise` - The ACTUAL direction the rave wheel moves
- **Rotation Offset:** `33.75°` - Makes Gates 10/11 appear at north (0°) visually

**Result:**
- Array position 0 = Gate 41
- Visual angle 0° = Gates 10/11 (at north)
- DECOUPLED: Array order ≠ Visual presentation

---

## Why Tests Pass Despite Position Issues

```javascript
// These use GATE NUMBER as key (not position):
geneKeys[13]    → { shadow: "Discord", ... }  ✅ Always correct
binary[13]      → "101111"                     ✅ Based on gate number
centers[13]     → "G"                          ✅ Based on gate number
quarters[13]    → "Duality"                    ✅ Based on binary pattern

// Only these depend on POSITION:
wheelPosition[13]        → { wheelIndex: 2, angle: 11.25 }  ← Position matters
incarnationCrosses       → Relative gate positions          ← Position matters
```

**Why they pass:**
- V2 data lookups use gate NUMBER, not wheel POSITION
- Binary patterns are based on gate number (immutable)
- Only position-dependent features (crosses, wheel rendering) care about sequence order
- Tests check DATA correctness, not visual positioning

---

## The Key Architectural Insight

**Separation of Concerns:**

1. **Mathematical/Data Layer** (gate number → properties)
   - Binary patterns
   - Gene Keys
   - Centers
   - Trigrams, Quarters, Faces
   - **Independent of wheel position**

2. **Positional/Visual Layer** (gate number → wheel position → angle)
   - Wheel rendering
   - Incarnation crosses (relative positions)
   - Bodygraph visualization
   - **Depends on sequence + rotation + direction**

**V1/V2 confusion:** Mixed these layers, made position seem important when it wasn't for most data.

**V3 solution:** Separate them completely via configuration.

---

## What Each Config Value Does

### 1. Sequence Array
**What:** The order gates appear in around the wheel
**Example:** `[41, 19, 13, ...]` vs `[10, 11, 26, ...]`
**Effect:** Changes which gate is at which array position
**Use case:** Different mandala traditions, different gate ordering systems

### 2. Direction
**What:** Clockwise or counter-clockwise progression
**Example:** `clockwise` (actual rave wheel) vs `counter-clockwise`
**Effect:** Reverses the wheel traversal direction
**Use case:** Some traditions use opposite directions

### 3. Rotation Offset
**What:** How many degrees to rotate the entire wheel
**Example:** `33.75°` (puts Gates 10/11 at north) vs `0°` (no rotation)
**Effect:** Shifts all visual angles by the offset amount
**Use case:** Aligning different sequences to same visual north point

---

## Example Configurations

### Default (Rave Wheel - Gates 10/11 at North)
```javascript
{
  sequenceName: 'rave-wheel-41-start',
  sequence: [41, 19, 13, ...],
  direction: 'clockwise',
  rotationOffset: 33.75
}
// Result: Gate 41 at array[0], Gates 10/11 appear at visual north
```

### No Rotation (Raw Array Positions)
```javascript
{
  sequenceName: 'rave-wheel-41-start',
  sequence: [41, 19, 13, ...],
  direction: 'clockwise',
  rotationOffset: 0
}
// Result: Gate 41 at array[0] AND at visual north (angle 0°)
```

### Alternative Sequence (Gates 10/11 at Array Start)
```javascript
{
  sequenceName: 'gates-10-start',
  sequence: [10, 11, 26, ...],
  direction: 'clockwise',
  rotationOffset: 0
}
// Result: Gate 10 at array[0] AND at visual north (no rotation needed)
```

---

## Terminology

**CORRECT terms:**
- **Sequence:** The array `[41, 19, 13, ...]` - just the order
- **Configuration:** Sequence + Direction + Rotation together
- **Preset:** Named configuration (e.g., "default", "no-rotation")
- **Rave Wheel:** The specific tradition using Gate 41 start + 33.75° rotation

**AVOID confusing terms:**
- "V2 baseline" - unclear if it means data or positions
- "HD standard" - ambiguous what "standard" means
- "Traditional" - which tradition?

---

## Implementation Requirements

### Sequence File Format (MANDATORY)
```json
{
  "name": "rave-wheel-41-start",
  "description": "Rave wheel starting at Gate 41, rotated to show Gates 10/11 at north",
  "version": "1.0.0",
  "sequence": [41, 19, 13, ...],     // MANDATORY: All 64 gates
  "direction": "clockwise",           // MANDATORY: "clockwise" or "counter-clockwise"
  "rotationOffset": 33.75,           // MANDATORY: Degrees (0-360)
  "notes": {
    "arrayPosition0": "Gate 41",
    "visualNorth": "Gates 10/11 (via rotation)",
    "purpose": "Default rave wheel configuration"
  }
}
```

### Default WheelConfiguration
```javascript
class WheelConfiguration {
  constructor(options = {}) {
    // Load from sequence file
    const seqData = loadSequence(options.sequenceName || 'rave-wheel-41-start');

    this.sequence = seqData.sequence;          // From file
    this.direction = seqData.direction;         // From file (MANDATORY)
    this.rotationOffset = seqData.rotationOffset; // From file (MANDATORY)

    // Allow overrides
    if (options.direction) this.direction = options.direction;
    if (options.rotationOffset !== undefined) this.rotationOffset = options.rotationOffset;
  }
}
```

### Test Expectations
```javascript
// Default config (rave wheel)
const config = new WheelConfiguration();
assert(config.sequence[0] === 41, 'Array starts with Gate 41');
assert(config.direction === 'clockwise', 'Direction is clockwise');
assert(config.rotationOffset === 33.75, 'Rotation is 33.75°');

// Visual positioning with default config
const pos10 = getWheelPosition(10);
assert(pos10.wheelIndex === 58, 'Gate 10 at array position 58');
assert(Math.abs(pos10.angle - 0) < 1, 'Gate 10 appears at ~0° (north) visually');

const pos41 = getWheelPosition(41);
assert(pos41.wheelIndex === 0, 'Gate 41 at array position 0');
assert(Math.abs(pos41.angle - 33.75) < 0.01, 'Gate 41 appears at 33.75° visually');
```

---

## What Was Wrong in V1/V2

1. **Mixed data with positions** - Made it seem like position mattered for all data
2. **No rotation offset** - Couldn't decouple array order from visual presentation
3. **Direction unclear** - Was it actually clockwise or counter-clockwise?
4. **Hardcoded sequence** - Couldn't swap between different gate orderings
5. **Tests didn't verify positions** - Checked data (which always worked) but not angles

---

## What V3 Fixes

1. **Three independent config values** - Sequence, Direction, Rotation
2. **Mandatory fields in sequence files** - Can't forget direction or rotation
3. **Clear default** - `rave-wheel-41-start` with clockwise + 33.75° rotation
4. **Tests verify visual positions** - Gates 10/11 at north, not just data
5. **Alternative configs easy** - Just swap sequence file or change rotation

---

**This is the CRYSTAL CLEAR understanding. No more confusion.**
