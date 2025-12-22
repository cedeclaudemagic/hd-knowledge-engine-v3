# UNAMBIGUOUS DIRECTION TERMINOLOGY

**Problem:** "clockwise" and "counter-clockwise" are ambiguous - they depend on viewing perspective and mathematical vs visual interpretation.

**Solution:** Use **UNAMBIGUOUS** terminology based on **CARDINAL POINT PROGRESSION**.

---

## ✅ UNAMBIGUOUS TERMINOLOGY

### Option 1: Cardinal Point Sequence (RECOMMENDED)

Instead of "clockwise" or "counter-clockwise", specify:

```json
{
  "direction": "increasing-angles"
}
```

**Or more explicitly:**

```json
{
  "angleProgression": "ascending"  // or "descending"
}
```

**Definition:**
- **"ascending"** = Array index 0→1→2 corresponds to angle 0°→5.625°→11.25° (INCREASING)
- **"descending"** = Array index 0→1→2 corresponds to angle 0°→354.375°→348.75° (DECREASING)

---

### Option 2: Mathematical Convention (VERY CLEAR)

```json
{
  "angleDirection": "positive"  // or "negative"
}
```

**Definition:**
- **"positive"** = Angles increase with array index (standard mathematical convention)
- **"negative"** = Angles decrease with array index (reverse mathematical convention)

---

### Option 3: Array-to-Angle Relationship (MOST EXPLICIT)

```json
{
  "arrayIndexProgression": "increases-angle"  // or "decreases-angle"
}
```

**Definition:**
- **"increases-angle"** = Moving forward in array (index++) increases angle
- **"decreases-angle"** = Moving forward in array (index++) decreases angle

---

## ❌ AVOID THESE TERMS

### DO NOT USE:
- ❌ "clockwise" - ambiguous (depends on viewer position)
- ❌ "counter-clockwise" - ambiguous (mathematical vs visual)
- ❌ "anti-clockwise" - same ambiguity as counter-clockwise
- ❌ "left" or "right" - ambiguous (depends on perspective)
- ❌ "forward" or "backward" - meaningless in circular context

---

## 🎯 RECOMMENDED SOLUTION

### Use This Terminology:

```json
{
  "name": "rave-wheel-41-start",
  "sequence": [41, 19, 13, ...],
  "angleProgression": "ascending",
  "rotationOffset": 33.75,
  "notes": {
    "definition": "ascending = array index increases → angle increases (0° → 90° → 180° → 270°)"
  }
}
```

### Why This Works:

1. **"ascending"** is unambiguous:
   - ✅ Angles go UP: 0° → 90° → 180° → 270°
   - ✅ Array position increases with angle
   - ✅ No viewer perspective issues
   - ✅ No mathematical vs visual confusion

2. **"descending"** is equally unambiguous:
   - ✅ Angles go DOWN: 0° → 270° → 180° → 90°
   - ✅ Array position increases while angle decreases
   - ✅ Clear opposite of ascending

---

## IMPLEMENTATION IN CODE

### WheelConfiguration Validation:

```javascript
validateConfiguration() {
  // BEFORE (ambiguous):
  if (this.config.direction !== 'clockwise' && this.config.direction !== 'counter-clockwise') {
    throw new Error('Invalid direction');
  }

  // AFTER (unambiguous):
  if (this.config.angleProgression !== 'ascending' && this.config.angleProgression !== 'descending') {
    throw new Error(`Invalid angleProgression: ${this.config.angleProgression} (must be 'ascending' or 'descending')`);
  }
}
```

### Angle Calculation:

```javascript
getAngle(gateNumber, lineNumber = 1) {
  const wheelIndex = this.getWheelIndex(gateNumber);
  const linePosition = (wheelIndex * LINES_PER_GATE) + (lineNumber - 1);

  let baseAngle;

  if (this.config.angleProgression === 'ascending') {
    // Array position 0 → angle 0°, position 1 → angle 5.625°, etc.
    baseAngle = linePosition * DEGREES_PER_LINE;
  } else {
    // Array position 0 → angle 0°, position 1 → angle 354.375°, etc.
    baseAngle = (360 - (linePosition * DEGREES_PER_LINE)) % 360;
  }

  const rotatedAngle = (baseAngle + this.config.rotationOffset) % 360;
  return rotatedAngle;
}
```

---

## WHAT IS THE CURRENT SEQUENCE?

Let's verify with our actual data:

```javascript
Array Position 0 (Gate 41) → Base Angle 0°
Array Position 1 (Gate 19) → Base Angle 5.625°
Array Position 2 (Gate 13) → Base Angle 11.25°
```

**Result:** Angles are INCREASING

**Therefore, current sequence is:**
```json
{
  "angleProgression": "ascending"
}
```

---

## VISUAL WHEEL INTERPRETATION

With `"angleProgression": "ascending"` and `"rotationOffset": 33.75`:

| Array Position | Gate | Base Angle | Visual Angle | Visual Position |
|----------------|------|------------|--------------|-----------------|
| 58 | 10 | 326.25° | 0° | NORTH (12:00) |
| 10 | 25 | 56.25° | 90° | EAST (3:00) |
| 26 | 15 | 146.25° | 180° | SOUTH (6:00) |
| 42 | 46 | 236.25° | 270° | WEST (9:00) |

Following array order (10 → 26 → 42 → 58):
```
EAST → SOUTH → WEST → NORTH
```

This appears as **clockwise rotation** on a visual wheel, but we don't call it that - we say:
```
"angleProgression": "ascending" (with 33.75° rotation)
```

---

## TYPESCRIPT DEFINITION

```typescript
/**
 * Angle progression determines how array index relates to angle
 */
type AngleProgression = 'ascending' | 'descending';

/**
 * ASCENDING: Array index increases → Angle increases (0° → 90° → 180° → 270°)
 * DESCENDING: Array index increases → Angle decreases (0° → 270° → 180° → 90°)
 */
interface WheelConfiguration {
  sequenceName: string;
  sequence: number[];
  angleProgression: AngleProgression;
  rotationOffset: number;
}
```

---

## DOCUMENTATION STANDARD

### In All Session Prompts:

Replace this:
```json
{
  "direction": "counter-clockwise",
  "notes": "Matches solar system planets/sun movement"
}
```

With this:
```json
{
  "angleProgression": "ascending",
  "notes": {
    "definition": "ascending = array index increases as angle increases (0° → 360°)",
    "mathematical": "Standard mathematical convention (positive angle direction)",
    "visual": "Appears as clockwise rotation on wheel when viewed from center"
  }
}
```

---

## SUMMARY

### ✅ USE THIS:

| Term | Meaning | Ambiguous? |
|------|---------|------------|
| **"ascending"** | Angles increase with array index | ❌ NO |
| **"descending"** | Angles decrease with array index | ❌ NO |

### ❌ DON'T USE THIS:

| Term | Problem |
|------|---------|
| "clockwise" | Depends on viewer position |
| "counter-clockwise" | Mathematical vs visual confusion |
| "anti-clockwise" | Same as counter-clockwise |
| "left/right" | Perspective-dependent |

---

## ACTION REQUIRED

1. ✅ Replace `"direction"` field with `"angleProgression"`
2. ✅ Use `"ascending"` or `"descending"` values only
3. ✅ Update all session prompts (SESSION-02 through SESSION-10)
4. ✅ Update TypeScript definitions (SESSION-03)
5. ✅ Update all tests to use new terminology
6. ✅ Update documentation to explain clearly

---

**Current Sequence Status:**
```json
{
  "angleProgression": "ascending"
}
```

This is **UNAMBIGUOUS** and **MATHEMATICALLY PRECISE**.
