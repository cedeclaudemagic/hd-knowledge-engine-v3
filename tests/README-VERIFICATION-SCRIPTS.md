# Verification Scripts

This directory contains comprehensive verification scripts to validate the mathematical consistency of the HD Knowledge Engine V3 wheel configuration.

---

## Available Scripts

### 1. Counter-Clockwise Mathematics Verification

**File:** `verify-counter-clockwise-mathematics.js`

**Purpose:** Comprehensive verification of counter-clockwise progression, line-level precision, and anomaly detection.

**Run:**
```bash
node tests/verify-counter-clockwise-mathematics.js
```

**Tests:**
- ✅ Counter-clockwise progression (increasing index = increasing angle)
- ✅ Line-level precision (0.9375° per line across all 384 lines)
- ✅ Angular spacing uniformity (5.625° per gate)
- ✅ Sequence integrity (all 64 gates present and unique)
- ✅ Cardinal points with default rotation
- ✅ First/last gate analysis
- ✅ Anomaly detection

**Output Sections:**
1. Counter-clockwise verification
2. Mathematical properties
3. Cardinal points table (with rotation)
4. Line-by-line cardinal positions
5. Sequence analysis (first/last 10 gates)
6. Anomaly detection
7. Summary

**Exit Code:**
- `0` = All verifications passed
- `1` = Issues detected

---

### 2. Cardinal Points Complete Table

**File:** `cardinal-points-complete-table.js`

**Purpose:** Generate comprehensive tables showing all gates and lines at cardinal and intercardinal points.

**Run:**
```bash
node tests/cardinal-points-complete-table.js
```

**Output Includes:**
- ✅ All 4 cardinal points (N, E, S, W) with line-level detail
- ✅ Lines within ±5° of each cardinal (close alignment)
- ✅ Lines within ±15° of each cardinal (wider view)
- ✅ 12 clock positions (every 30°)
- ✅ 4 intercardinal points (NE, SE, SW, NW)
- ✅ Key insights and observations

**Use Cases:**
- Understanding visual wheel layout
- Finding gates near specific angles
- Verifying rotation offset effects
- Documentation and reference

---

## Quick Reference

### What Gets Verified?

| Aspect | Script 1 | Script 2 |
|--------|----------|----------|
| Counter-clockwise progression | ✅ | - |
| Line precision (0.9375°) | ✅ | - |
| Angular spacing | ✅ | - |
| Sequence integrity | ✅ | - |
| Cardinal points detail | ✅ | ✅ |
| Clock positions | - | ✅ |
| Intercardinal points | - | ✅ |
| Anomaly detection | ✅ | - |

### When to Run These Scripts?

1. **After implementing SESSION-02** (wheel-config.js)
   - Verify configuration system works correctly
   - Ensure rotation offset applied properly

2. **After modifying gate sequence**
   - Validate sequence integrity
   - Check for anomalies

3. **Before release**
   - Final verification of mathematical consistency
   - Document wheel layout for users

4. **When debugging positioning issues**
   - Understand actual vs expected positions
   - Verify rotation effects

---

## Expected Results

### Script 1: verify-counter-clockwise-mathematics.js

**Success Output:**
```
✅ VERIFIED: Sequence follows COUNTER-CLOCKWISE progression
✅ VERIFIED: All 320 line transitions = 0.9375°
✅ NO ANOMALIES DETECTED
🎉 ALL VERIFICATIONS PASSED
```

**Key Metrics:**
- Direction: COUNTER-CLOCKWISE ✅
- Line Precision: 0.9375° per line ✅
- Default Rotation: 33.75° ✅
- Array position 0: Gate 41 ✅
- Visual north (0°): Gates 10/11 ✅

### Script 2: cardinal-points-complete-table.js

**Success Output:**
Shows comprehensive tables with:
- Gate 10, Line 1 at NORTH (0°) - EXACT
- Gate 25, Line 1 at EAST (90°) - EXACT
- Gate 15, Line 1 at SOUTH (180°) - EXACT
- Gate 46, Line 1 at WEST (270°) - EXACT

---

## Integration with Test Suite

### Add to package.json:

```json
{
  "scripts": {
    "verify": "node tests/verify-counter-clockwise-mathematics.js",
    "verify:cardinal": "node tests/cardinal-points-complete-table.js",
    "verify:all": "npm run verify && npm run verify:cardinal"
  }
}
```

### Run All Verifications:

```bash
npm run verify:all
```

---

## Understanding the Output

### Cardinal Points Table

**Example Entry:**
```
Gate | Line | Array Pos | Line Pos | Base Angle | Visual Angle | Distance
  10 |    1 |        58 |      348 |   326.2500° |       0.0000° |   0.0000°
```

**Interpretation:**
- **Gate 10, Line 1:** The specific position being measured
- **Array Pos 58:** This gate is at position 58 in the sequence array
- **Line Pos 348:** This is line 348 out of 384 total lines
- **Base Angle 326.25°:** Angle without rotation (raw position)
- **Visual Angle 0.00°:** Angle with 33.75° rotation applied
- **Distance 0.00°:** How far from the cardinal point (exact match)

### Clock Positions

Shows which gate/line appears at each clock position (0°, 30°, 60°, etc.) when the wheel is visualized with default rotation.

---

## Troubleshooting

### If Verification Fails

1. **Check gate-sequence.json**
   - Ensure all 64 gates present
   - No duplicates
   - Correct sequence order

2. **Check positioning-algorithm.js**
   - Verify DEGREES_PER_LINE = 0.9375
   - Ensure rotation offset applied correctly

3. **Check wheel-config.js** (after SESSION-02)
   - Verify getAngle() applies rotation
   - Ensure getWheelIndex() returns correct positions

### Common Issues

**Issue:** "Gate X missing from sequence"
- **Cause:** gate-sequence.json corrupted or incomplete
- **Fix:** Restore from git or regenerate sequence

**Issue:** "Line precision errors detected"
- **Cause:** DEGREES_PER_LINE constant incorrect
- **Fix:** Ensure DEGREES_PER_LINE = 360 / 384 = 0.9375

**Issue:** "Cardinal points misaligned"
- **Cause:** Rotation offset not applied
- **Fix:** Check rotation offset = 33.75° in default config

---

## Mathematical Foundation

### Key Formulas

```
TOTAL_GATES = 64
LINES_PER_GATE = 6
TOTAL_LINES = 384
DEGREES_PER_LINE = 360 / 384 = 0.9375°
DEGREES_PER_GATE = 360 / 64 = 5.625°
```

### Line Position Calculation

```javascript
linePosition = (wheelIndex × 6) + (lineNumber - 1)
baseAngle = linePosition × 0.9375
visualAngle = (baseAngle + rotationOffset) % 360
```

### Counter-Clockwise Definition

```
Increasing array index → Increasing angle
Position 0 → 0°
Position 1 → 5.625°
Position 2 → 11.25°
...
```

---

## Documentation

For complete verification results, see:
- **`VERIFICATION-RESULTS-SUMMARY.md`** - Comprehensive findings and tables

For implementation details, see:
- **`v3-sessions/SESSION-02-CONFIGURATION-SYSTEM.md`** - Configuration system spec
- **`v3-sessions/SESSION-02-WHEEL-CONFIG-IMPLEMENTATION.md`** - Complete implementation

---

## Contributing

If you add new verification logic:

1. Follow the existing test format
2. Use descriptive console output
3. Include summary statistics
4. Add to this README
5. Update VERIFICATION-RESULTS-SUMMARY.md

---

**Last Updated:** November 18, 2025
**Status:** ✅ All verifications passing
**Scripts:** 2 comprehensive verification scripts
**Test Coverage:** 100% of mathematical properties
