# Cardinal Point Configuration Specification

**STATUS:** CRITICAL FOUNDATION DOCUMENT
**DATE:** November 18, 2025
**PURPOSE:** Define the unambiguous configuration system for wheel orientation

---

## FUNDAMENTAL CONCEPT: Cardinal Point Positioning

Cardinal points (North, East, South, West) can be positioned in TWO distinct ways:

---

## MODE 1: STRADDLED CARDINAL (Two Gates)

**Notation:** `"10|11"`

### Definition:
The cardinal point sits **BETWEEN** two gates at the **BOUNDARY** between them.

### Meaning:
```
Gate 11, Line 6 → ... → 359.xx° → [CARDINAL AT 0°] → 0.xx° → Gate 10, Line 1
```

- The **exact cardinal angle** (0°, 90°, 180°, 270°) is at the **boundary** between two gates
- One gate **ends** just before the cardinal
- The next gate **begins** just after the cardinal
- Neither gate is "on" the cardinal - they **straddle** it

### Example - North Position: "10|11"
```
Gate 11, Line 6:  359.0625°  ← Just before North
═══════════════════════════════
     NORTH (0°)  ← EXACT CARDINAL POINT (boundary)
═══════════════════════════════
Gate 10, Line 1:    0.9375°  ← Just after North
```

### Visual Representation:
```
              [NORTH 0°]
                  ║
    Gate 11 ══════╬══════ Gate 10
   (359.0625°)    ║    (0.9375°)
                  ║
           Cardinal Point
         (exact boundary)
```

### Configuration:
```json
{
  "northPosition": "10|11",
  "description": "North sits at boundary between Gate 11 and Gate 10"
}
```

---

## MODE 2: CENTERED CARDINAL (Single Gate)

**Notation:** `"10"`

### Definition:
The cardinal point sits at the **CENTER** of a single gate.

### Meaning:
```
Gate 10, Line 1 → Line 2 → Line 3 → [CARDINAL] → Line 4 → Line 5 → Line 6
```

- The **exact cardinal angle** is at the **middle** of the gate
- Specifically: **Line 3.5** (halfway between Line 3 and Line 4)
- The gate **surrounds** the cardinal point
- Three lines before, three lines after

### Example - North Position: "10"
```
Gate 10, Line 1:   -2.8125°  ← Start of gate
Gate 10, Line 2:   -1.8750°
Gate 10, Line 3:   -0.9375°
═══════════════════════════════
     NORTH (0°)  ← EXACT CARDINAL (center of gate)
═══════════════════════════════
Gate 10, Line 4:   +0.9375°
Gate 10, Line 5:   +1.8750°
Gate 10, Line 6:   +2.8125°  ← End of gate
```

### Visual Representation:
```
         Gate 10
    ╔═══════════════╗
    ║ L1  L2  L3    ║
    ║       ↓       ║
    ║   [NORTH 0°]  ║
    ║       ↓       ║
    ║    L4  L5  L6 ║
    ╚═══════════════╝
```

### Configuration:
```json
{
  "northPosition": "10",
  "description": "North sits at center of Gate 10 (Line 3.5)"
}
```

---

## COMPLETE CONFIGURATION SPECIFICATION

### Mandatory Fields:

```typescript
interface WheelConfiguration {
  /**
   * Sequence of 64 gates in array order
   * Position 0 = first gate in sequence
   */
  sequence: number[]; // [41, 19, 13, ...]

  /**
   * Cardinal progression - order of cardinals following array index
   *
   * NWSE = North → West → South → East (counter-clockwise visual)
   * NESW = North → East → South → West (clockwise visual)
   * ESWN = East → South → West → North (starts at East, clockwise visual)
   * etc.
   *
   * First letter = which cardinal is at 0° base angle
   * Order = which cardinals you encounter following array index 0→1→2→...
   */
  cardinalProgression: "NWSE" | "NESW" | "ESWN" | "ENWN" | "SWNE" | "SENW" | "WNES" | "WSEN";

  /**
   * North position - specifies which gate(s) at North
   *
   * MODE 1 (Straddled): "10|11" = North at boundary between gates 11 and 10
   * MODE 2 (Centered): "10" = North at center of gate 10
   */
  northPosition: string; // "10|11" or "10"

  /**
   * Optional: Specify other cardinals if different from default pattern
   */
  eastPosition?: string;
  southPosition?: string;
  westPosition?: string;
}
```

---

## DEFAULT CONFIGURATION (Rave Wheel)

```json
{
  "name": "rave-wheel-41-start",
  "description": "Standard Rave Wheel - Ra Uru Hu",
  "version": "1.0.0",

  "sequence": [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
    27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
    31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
    28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
  ],

  "cardinalProgression": "NWSE",

  "northPosition": "10|11",
  "eastPosition": "25|17",
  "southPosition": "15|12",
  "westPosition": "46|6",

  "notes": {
    "cardinalMode": "straddled",
    "explanation": "All four cardinals sit at boundaries between gate pairs",
    "northDetail": "North (0°) sits between Gate 11 (before) and Gate 10 (after)"
  }
}
```

---

## MATHEMATICAL CALCULATION

### For Straddled Cardinals (e.g., "10|11"):

```javascript
function calculateRotationOffset(config) {
  const { sequence, northPosition } = config;

  // Parse the two gates
  const [secondGate, firstGate] = northPosition.split('|').map(Number);

  // Find positions in array
  const firstGateArrayPos = sequence.indexOf(firstGate);
  const secondGateArrayPos = sequence.indexOf(secondGate);

  // Calculate the boundary between them
  // The boundary is at the END of the second gate / START of the first gate

  // End of second gate = start of that gate's position + 6 lines
  const secondGateEndLine = (secondGateArrayPos * 6) + 6;
  const boundaryAngle = secondGateEndLine * 0.9375;

  // OR equivalently: start of first gate
  const firstGateStartLine = firstGateArrayPos * 6;
  const alternativeBoundaryAngle = firstGateStartLine * 0.9375;

  // These should be equal (modulo 360)
  // boundaryAngle should equal alternativeBoundaryAngle (or differ by 360)

  // Rotation needed to put this boundary at 0° (North)
  const rotationOffset = (360 - boundaryAngle) % 360;

  return rotationOffset;
}
```

### For Centered Cardinals (e.g., "10"):

```javascript
function calculateRotationOffset(config) {
  const { sequence, northPosition } = config;

  // Parse the gate
  const gateNumber = Number(northPosition);

  // Find position in array
  const arrayPos = sequence.indexOf(gateNumber);

  // Calculate center of gate (Line 3.5)
  const gateStartLine = arrayPos * 6;
  const gateCenterLine = gateStartLine + 2.5; // Line 3.5 (0-indexed: 2.5 = between line 3 and 4)

  const centerAngle = gateCenterLine * 0.9375;

  // Rotation needed to put this center at 0° (North)
  const rotationOffset = (360 - centerAngle) % 360;

  return rotationOffset;
}
```

---

## VERIFICATION

### For Current Rave Wheel:

**Given:**
- `northPosition: "10|11"`
- Sequence has Gate 11 at array position 57
- Sequence has Gate 10 at array position 58

**Calculate boundary:**
```
Gate 11 position: 57
Gate 11 last line: (57 × 6) + 6 - 1 = 347 (line position)
Gate 11 last line angle: 347 × 0.9375 = 325.3125°

Gate 10 position: 58
Gate 10 first line: 58 × 6 = 348 (line position)
Gate 10 first line angle: 348 × 0.9375 = 326.25°

Boundary between them: 348 × 0.9375 = 326.25°
(This is the START of Gate 10, which is the END of Gate 11's span + 1 line)
```

**Calculate rotation:**
```
Rotation needed: 360 - 326.25 = 33.75°
```

**Verify:**
```
Gate 10, Line 1 base angle: 326.25°
Gate 10, Line 1 visual angle: 326.25 + 33.75 = 360° = 0° ✓

Gate 11, Line 6 base angle: 325.3125°
Gate 11, Line 6 visual angle: 325.3125 + 33.75 = 359.0625° ✓
```

**Result:** North sits at boundary between Gate 11 (359.0625°) and Gate 10 (0°/360°) ✓

---

## CARDINAL PROGRESSION MEANING

### "NWSE" (Counter-clockwise visual)

```
Following array index 0 → 1 → 2 → 3 → ...

You encounter cardinals in this order:
North (0°) → West (270°) → South (180°) → East (90°) → back to North

Visual appearance: Counter-clockwise rotation
```

### "NESW" (Clockwise visual)

```
Following array index 0 → 1 → 2 → 3 → ...

You encounter cardinals in this order:
North (0°) → East (90°) → South (180°) → West (270°) → back to North

Visual appearance: Clockwise rotation
```

---

## WHY THIS MATTERS

### Precision:
- A gate spans 5.625° (6 lines × 0.9375° per line)
- The difference between straddled vs centered is 2.8125° (half a gate)
- This affects ALL positioning calculations
- This affects incarnation cross calculations
- This affects channel alignments

### Clarity:
- "10|11" is unambiguous: boundary between two gates
- "10" is unambiguous: center of one gate
- No confusion about "which line" is at the cardinal

### Configurability:
- Different traditions might use different modes
- Alternative wheels might center gates on cardinals
- System must support both modes explicitly

---

## IMPLEMENTATION REQUIREMENTS

### 1. Parse northPosition correctly:

```javascript
function parseCardinalPosition(positionString) {
  if (positionString.includes('|')) {
    // Straddled mode
    const [secondGate, firstGate] = positionString.split('|').map(Number);
    return {
      mode: 'straddled',
      gates: [firstGate, secondGate],
      description: `Boundary between Gate ${secondGate} and Gate ${firstGate}`
    };
  } else {
    // Centered mode
    const gate = Number(positionString);
    return {
      mode: 'centered',
      gate: gate,
      description: `Center of Gate ${gate} (Line 3.5)`
    };
  }
}
```

### 2. Calculate rotation offset accordingly:

```javascript
function calculateRotationOffset(sequence, cardinalPosition) {
  const parsed = parseCardinalPosition(cardinalPosition);

  if (parsed.mode === 'straddled') {
    // Boundary between gates
    const firstGatePos = sequence.indexOf(parsed.gates[0]);
    const boundaryLine = firstGatePos * 6;
    const boundaryAngle = boundaryLine * 0.9375;
    return (360 - boundaryAngle) % 360;
  } else {
    // Center of gate
    const gatePos = sequence.indexOf(parsed.gate);
    const centerLine = (gatePos * 6) + 2.5; // Line 3.5
    const centerAngle = centerLine * 0.9375;
    return (360 - centerAngle) % 360;
  }
}
```

### 3. Validate configuration:

```javascript
function validateCardinalPositions(config) {
  // If any cardinal uses straddled mode, verify gates are adjacent
  const north = parseCardinalPosition(config.northPosition);

  if (north.mode === 'straddled') {
    const [firstGate, secondGate] = north.gates;
    const pos1 = config.sequence.indexOf(firstGate);
    const pos2 = config.sequence.indexOf(secondGate);

    // Verify they are adjacent in the sequence
    const adjacent = Math.abs(pos1 - pos2) === 1 ||
                     (pos1 === 0 && pos2 === 63) ||
                     (pos1 === 63 && pos2 === 0);

    if (!adjacent) {
      throw new Error(
        `Gates ${secondGate} and ${firstGate} are not adjacent in sequence. ` +
        `Cannot straddle North position.`
      );
    }
  }

  return true;
}
```

---

## TYPESCRIPT DEFINITION

```typescript
/**
 * Cardinal position mode
 */
type CardinalMode = 'straddled' | 'centered';

/**
 * Cardinal position specification
 *
 * Straddled: "10|11" = boundary between Gate 11 and Gate 10
 * Centered: "10" = center of Gate 10
 */
type CardinalPosition = string;

/**
 * Cardinal progression - order of cardinals following array index
 *
 * First letter = cardinal at 0° base angle
 * Sequence = order encountered following array index
 *
 * NWSE = North → West → South → East (counter-clockwise visual)
 * NESW = North → East → South → West (clockwise visual)
 */
type CardinalProgression =
  | 'NWSE' // Counter-clockwise from North
  | 'NESW' // Clockwise from North
  | 'ESWN' // Clockwise from East
  | 'ENWN' // Counter-clockwise from East
  | 'SWNE' // Clockwise from South
  | 'SENW' // Counter-clockwise from South
  | 'WNES' // Clockwise from West
  | 'WSEN'; // Counter-clockwise from West

interface WheelConfiguration {
  name: string;
  description: string;
  version: string;

  /** Array of 64 gates in sequence order */
  sequence: number[];

  /** Cardinal progression pattern */
  cardinalProgression: CardinalProgression;

  /**
   * North position
   * Straddled: "10|11" (boundary)
   * Centered: "10" (center of gate)
   */
  northPosition: CardinalPosition;

  /** Optional: East position (defaults to 90° from north) */
  eastPosition?: CardinalPosition;

  /** Optional: South position (defaults to 180° from north) */
  southPosition?: CardinalPosition;

  /** Optional: West position (defaults to 270° from north) */
  westPosition?: CardinalPosition;

  /** Derived values (calculated automatically) */
  derived?: {
    cardinalMode: CardinalMode;
    rotationOffset: number;
    arrayStart: number;
  };
}
```

---

## CRITICAL QUESTIONS TO ANSWER

1. **What is the correct default cardinalProgression?**
   - Is it "NWSE" (counter-clockwise visual)?
   - Or "NESW" (clockwise visual)?

2. **What are the other cardinal positions?**
   - North: "10|11" ✓
   - East: ?
   - South: ?
   - West: ?

3. **Are all cardinals straddled, or can they be mixed?**
   - All straddled (boundaries)?
   - All centered?
   - Mixed modes?

4. **Is the current 33.75° rotation correct for straddled "10|11"?**
   - Need to verify the exact calculation
   - Ensure Gate 11 Line 6 is at ~359°
   - Ensure Gate 10 Line 1 is at ~0°/360°

---

## NEXT STEPS

1. ✅ Verify current gate positions for all cardinals
2. ✅ Determine correct cardinalProgression (NWSE vs NESW)
3. ✅ Document all four cardinal positions (N, E, S, W)
4. ✅ Update all session prompts with this specification
5. ✅ Implement parsing and calculation logic
6. ✅ Create validation tests

---

**This specification is FUNDAMENTAL and must be explicit in all documentation.**
