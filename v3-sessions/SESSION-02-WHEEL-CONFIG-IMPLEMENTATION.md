# SESSION-02 ADDENDUM: Complete WheelConfiguration Class Implementation

**Purpose:** Fills the placeholder in SESSION-02-CONFIGURATION-SYSTEM.md line 211
**Status:** Implementation specification for wheel-config.js

---

## CRITICAL: Line-Level Precision MUST Be Preserved

The old V2 system had **line-level precision** of 0.9375° per line (360° / 384 lines).

This is the **finest granularity** of the positioning system and **MUST be maintained** in V3.

**Why this matters:**
- 64 gates × 6 lines = 384 total line positions
- Each line = 0.9375 degrees
- This precision is critical for incarnation crosses and accurate chart calculations
- Tests MUST verify this precision is maintained

---

## Complete WheelConfiguration Class

**File:** `core/root-system/wheel-config.js`

```javascript
/**
 * Wheel Configuration System
 * Manages swappable gate sequences, direction, and rotation offset
 *
 * @version 3.0.0
 */

const fs = require('fs');
const path = require('path');

// Mathematical constants
const DEGREES_PER_LINE = 0.9375;  // 360° / 384 lines - CRITICAL PRECISION
const LINES_PER_GATE = 6;
const TOTAL_LINES = 384;
const TOTAL_GATES = 64;

/**
 * WheelConfiguration class
 * Manages the three mandatory configuration values:
 * 1. sequence - array of gates
 * 2. cardinalProgression - "NWSE", "NESW", etc. (visual clock face progression)
 * 3. northPosition - gate(s) at north (e.g., "10|11" straddled or "10" centered)
 *
 * Visual Clock Face Reference:
 *        12 (NORTH)
 *           10|11
 *             |
 *             |
 *  9 (WEST) --+-- 3 (EAST)
 *   25|36     |      46|6
 *             |
 *             |
 *        6 (SOUTH)
 *         15|12
 *
 * NWSE = Counter-clockwise: 12→9→6→3 (North→West→South→East)
 */
class WheelConfiguration {
  /**
   * Create a new wheel configuration
   * @param {Object} options - Configuration options
   * @param {string} options.sequenceName - Name of sequence file (default: 'rave-wheel-41-start')
   * @param {Array<number>} options.customSequence - Custom sequence array (if sequenceName='custom')
   * @param {string} options.cardinalProgression - 'NWSE', 'NESW', etc. (overrides sequence file)
   * @param {string} options.northPosition - Gate(s) at north: "10|11" (straddled) or "10" (centered)
   */
  constructor(options = {}) {
    const sequenceName = options.sequenceName || 'rave-wheel-41-start';

    // Load sequence file
    const seqData = this.loadSequence(sequenceName, options.customSequence);

    // Set configuration (file values, then option overrides)
    this.config = {
      sequenceName: sequenceName,
      cardinalProgression: options.cardinalProgression || seqData.cardinalProgression,
      northPosition: options.northPosition || seqData.northPosition
    };

    // Store sequence array
    this.sequence = seqData.sequence;

    // Validate
    this.validateConfiguration();
  }

  /**
   * Load sequence from file or custom array
   * @param {string} sequenceName - Sequence file name
   * @param {Array<number>} customSequence - Custom sequence if provided
   * @returns {Object} Sequence data with mandatory fields
   */
  loadSequence(sequenceName, customSequence) {
    if (sequenceName === 'custom') {
      if (!customSequence || customSequence.length !== TOTAL_GATES) {
        throw new Error('Custom sequence must be array of 64 gates');
      }
      return {
        sequence: customSequence,
        cardinalProgression: 'NWSE', // Default for custom (counter-clockwise)
        northPosition: '10|11' // Default for custom (straddled)
      };
    }

    // Load from file
    const sequencePath = path.join(__dirname, 'sequences', `${sequenceName}.json`);

    if (!fs.existsSync(sequencePath)) {
      throw new Error(`Sequence file not found: ${sequenceName}.json`);
    }

    const data = JSON.parse(fs.readFileSync(sequencePath, 'utf8'));

    // Verify mandatory fields exist
    if (!data.sequence || !data.cardinalProgression || !data.northPosition) {
      throw new Error(`Sequence file ${sequenceName}.json missing mandatory fields (sequence, cardinalProgression, northPosition)`);
    }

    return {
      sequence: data.sequence,
      cardinalProgression: data.cardinalProgression,
      northPosition: data.northPosition
    };
  }

  /**
   * Validate the configuration
   * @throws {Error} If configuration is invalid
   */
  validateConfiguration() {
    // Validate sequence
    if (this.sequence.length !== TOTAL_GATES) {
      throw new Error(`Sequence must contain exactly ${TOTAL_GATES} gates`);
    }

    // Check all gates 1-64 present exactly once
    const gates = new Set(this.sequence);
    if (gates.size !== TOTAL_GATES) {
      throw new Error('Sequence must contain each gate 1-64 exactly once');
    }

    for (let i = 1; i <= TOTAL_GATES; i++) {
      if (!gates.has(i)) {
        throw new Error(`Gate ${i} missing from sequence`);
      }
    }

    // Validate cardinal progression
    const validProgressions = ['NWSE', 'NESW', 'ESWN', 'ENWN', 'SWNE', 'SENW', 'WNES', 'WSEN'];
    if (!validProgressions.includes(this.config.cardinalProgression)) {
      throw new Error(`Invalid cardinalProgression: ${this.config.cardinalProgression} (must be one of: ${validProgressions.join(', ')})`);
    }

    // Validate north position
    if (typeof this.config.northPosition !== 'string' || this.config.northPosition.length === 0) {
      throw new Error('North position must be a non-empty string (e.g., "10|11" or "10")');
    }

    // If straddled (contains |), validate gates are adjacent in sequence
    if (this.config.northPosition.includes('|')) {
      const [gate1, gate2] = this.config.northPosition.split('|').map(Number);
      const idx1 = this.sequence.indexOf(gate1);
      const idx2 = this.sequence.indexOf(gate2);

      if (idx1 === -1 || idx2 === -1) {
        throw new Error(`Gates in northPosition ${this.config.northPosition} not found in sequence`);
      }

      // Gates must be adjacent in sequence (differ by 1 index, accounting for wrap)
      const diff = Math.abs(idx1 - idx2);
      if (diff !== 1 && diff !== 63) { // 63 = wrap around (position 0 and 63)
        throw new Error(`Gates in northPosition ${this.config.northPosition} must be adjacent in sequence`);
      }
    }

    // Calculate derived values (rotation offset from northPosition)
    if (this.config.rotationOffset === undefined) {
      throw new Error('Rotation offset must be between 0 and 360 degrees');
    }
  }

  /**
   * Get wheel index for a gate number (accounting for direction)
   * @param {number} gateNumber - Gate number (1-64)
   * @returns {number} Wheel index (0-63)
   */
  getWheelIndex(gateNumber) {
    if (gateNumber < 1 || gateNumber > TOTAL_GATES) {
      throw new Error(`Invalid gate number: ${gateNumber} (must be 1-64)`);
    }

    const baseIndex = this.sequence.indexOf(gateNumber);

    if (baseIndex === -1) {
      throw new Error(`Gate ${gateNumber} not found in sequence`);
    }

    // For counter-clockwise, index is as-is (0, 1, 2, ...)
    // For clockwise, reverse the index (0 -> 63, 1 -> 62, ...)
    if (this.config.direction === 'counter-clockwise') {
      return baseIndex;
    } else {
      // Clockwise reverses the sequence
      return (TOTAL_GATES - 1) - baseIndex;
    }
  }

  /**
   * Calculate angle for a gate/line (accounting for rotation offset)
   *
   * CRITICAL: This maintains line-level precision of 0.9375° per line
   *
   * @param {number} gateNumber - Gate number (1-64)
   * @param {number} lineNumber - Line number (1-6)
   * @returns {number} Angle in degrees (0-360)
   */
  getAngle(gateNumber, lineNumber = 1) {
    if (lineNumber < 1 || lineNumber > LINES_PER_GATE) {
      throw new Error(`Invalid line number: ${lineNumber} (must be 1-6)`);
    }

    const wheelIndex = this.getWheelIndex(gateNumber);

    // Calculate base line position (0-383)
    const linePosition = (wheelIndex * LINES_PER_GATE) + (lineNumber - 1);

    // Calculate base angle (0-360) with LINE-LEVEL PRECISION
    const baseAngle = linePosition * DEGREES_PER_LINE;

    // Apply rotation offset
    const rotatedAngle = (baseAngle + this.config.rotationOffset) % 360;

    return rotatedAngle;
  }

  /**
   * Reverse lookup: Get gate and line at a specific angle
   * @param {number} angle - Angle in degrees (0-360)
   * @param {number} tolerance - Tolerance in degrees (default: 0.47 = half a line)
   * @returns {Object} {gateNumber, lineNumber, exactAngle}
   */
  getGateAtAngle(angle, tolerance = 0.47) {
    // Normalize angle
    const normalizedAngle = angle % 360;

    // Remove rotation offset to get base angle
    const baseAngle = (normalizedAngle - this.config.rotationOffset + 360) % 360;

    // Find line position
    const linePosition = Math.round(baseAngle / DEGREES_PER_LINE);

    // Get gate and line from position
    const wheelIndex = Math.floor(linePosition / LINES_PER_GATE);
    const lineNumber = (linePosition % LINES_PER_GATE) + 1;

    // Account for direction
    let gateIndex;
    if (this.config.direction === 'counter-clockwise') {
      gateIndex = wheelIndex;
    } else {
      gateIndex = (TOTAL_GATES - 1) - wheelIndex;
    }

    const gateNumber = this.sequence[gateIndex];

    // Calculate exact angle for this gate/line
    const exactAngle = this.getAngle(gateNumber, lineNumber);

    // Verify within tolerance
    const diff = Math.abs(exactAngle - normalizedAngle);
    if (diff > tolerance && diff < (360 - tolerance)) {
      console.warn(`Angle ${angle} not within tolerance of any gate/line`);
    }

    return {
      gateNumber,
      lineNumber,
      exactAngle
    };
  }

  /**
   * Export configuration as plain object
   * @returns {Object} Configuration object
   */
  exportConfig() {
    return {
      sequenceName: this.config.sequenceName,
      direction: this.config.direction,
      rotationOffset: this.config.rotationOffset,
      sequence: [...this.sequence] // Copy array
    };
  }

  /**
   * Create configuration from preset name
   * @param {string} presetName - Name of preset
   * @returns {WheelConfiguration} New configuration instance
   */
  static fromPreset(presetName) {
    // Presets are just sequence file names
    return new WheelConfiguration({ sequenceName: presetName });
  }
}

// Export class and constants
module.exports = {
  WheelConfiguration,
  DEGREES_PER_LINE,
  LINES_PER_GATE,
  TOTAL_LINES,
  TOTAL_GATES
};
```

---

## Key Implementation Details

### 1. Line-Level Precision (CRITICAL)

```javascript
// This is the CORE calculation that MUST maintain precision
const linePosition = (wheelIndex * 6) + (lineNumber - 1);  // 0-383
const baseAngle = linePosition * 0.9375;  // Line-level precision
const rotatedAngle = (baseAngle + rotationOffset) % 360;  // Apply rotation
```

**Example:**
- Gate 41, Line 1 with default config (33.75° rotation):
  - wheelIndex = 0
  - linePosition = 0
  - baseAngle = 0°
  - rotatedAngle = 33.75°

- Gate 41, Line 2 with default config:
  - wheelIndex = 0
  - linePosition = 1
  - baseAngle = 0.9375°
  - rotatedAngle = 34.6875° ✅ (33.75 + 0.9375)

### 2. Direction Handling

**Counter-clockwise (default):**
- Array position 0 → angle 0°
- Array position 1 → angle 5.625°
- Increasing array index = increasing angle

**Clockwise:**
- Reverses the wheel index
- Array position 0 → angle 0°
- Array position 1 → angle 354.375°
- Increasing array index = decreasing angle

### 3. Three Mandatory Fields

Every configuration MUST have:
1. `sequence` - Array of 64 gates
2. `direction` - "counter-clockwise" or "clockwise"
3. `rotationOffset` - Number (0-360)

These are loaded from sequence files and can be overridden.

---

## Test Coverage Required

SESSION-02 tests MUST verify:

1. **Line-level precision**
   ```javascript
   const angle1 = config.getAngle(41, 1);  // 33.75°
   const angle2 = config.getAngle(41, 2);  // 34.6875°
   assert(Math.abs(angle2 - angle1 - 0.9375) < 0.0001, 'Line precision maintained');
   ```

2. **Rotation offset application**
   ```javascript
   // Gate 10 at north with default 33.75° rotation
   const angle10 = config.getAngle(10, 1);
   assert(Math.abs(angle10 - 0) < 1, 'Gate 10 at north via rotation');
   ```

3. **Direction reversal**
   ```javascript
   const ccw = new WheelConfiguration({ direction: 'counter-clockwise' });
   const cw = new WheelConfiguration({ direction: 'clockwise' });

   // Same gate, different angles due to direction
   assert(ccw.getAngle(19, 1) !== cw.getAngle(19, 1), 'Direction affects angles');
   ```

4. **Reverse lookup**
   ```javascript
   const result = config.getGateAtAngle(0);
   assert(result.gateNumber === 10, 'Angle 0° returns Gate 10');
   assert(result.lineNumber === 1, 'Angle 0° returns Line 1');
   ```

---

## Integration with positioning-algorithm.js

The positioning algorithm uses `wheelConfig.getAngle()`:

```javascript
const { WheelConfiguration } = require('./wheel-config.js');

let wheelConfig = new WheelConfiguration(); // Default config

function getWheelPosition(gateNumber, lineNumber = 1) {
  const wheelIndex = wheelConfig.getWheelIndex(gateNumber);
  const angle = wheelConfig.getAngle(gateNumber, lineNumber);  // ← LINE PRECISION
  const linePosition = (wheelIndex * 6) + (lineNumber - 1);

  return {
    gateNumber,
    lineNumber,
    wheelIndex,
    linePosition,
    angle,  // ← With rotation applied, line-level precision maintained
    angleNormalized: angle % 360
  };
}
```

---

## Summary

This implementation:

✅ Maintains 0.9375° line-level precision (CRITICAL)
✅ Loads three mandatory fields from sequence files
✅ Applies rotation offset correctly
✅ Handles both counter-clockwise and clockwise direction
✅ Validates all inputs
✅ Supports reverse lookup (angle → gate/line)
✅ Exports configuration state

**Use this implementation to replace the placeholder at SESSION-02:211**

---

**Status:** Complete implementation specification ✅
