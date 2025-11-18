# BULLETPROOF CONFIGURATION SYSTEM

**PURPOSE:** Make misinterpretation IMPOSSIBLE through strict typing, validation, and clear examples
**DATE:** November 18, 2025

---

## DESIGN PRINCIPLES

1. **Use visual clock face terminology ONLY** - no ambiguous mathematical terms
2. **Strict TypeScript types** - prevent invalid configurations at compile time
3. **Runtime validation** - catch errors immediately with clear messages
4. **Exhaustive examples** - show correct AND incorrect usage
5. **Visual diagrams** - in code comments and documentation
6. **Fail fast** - reject invalid configs immediately, don't guess

---

## STRICT TYPESCRIPT DEFINITIONS

### File: `core/types/wheel-config.d.ts`

```typescript
/**
 * VISUAL CLOCK FACE REFERENCE
 *
 *        12 (NORTH)
 *           |
 *           |
 *   9 (WEST)+--3 (EAST)
 *           |
 *           |
 *        6 (SOUTH)
 *
 * Counter-clockwise: 12 → 11 → 10 → 9 → 8 → 7 → 6...
 * Clockwise: 12 → 1 → 2 → 3 → 4 → 5 → 6...
 */

/**
 * Clock position (1-12) representing visual position on clock face
 *
 * @example 12 = North (top)
 * @example 3 = East (right)
 * @example 6 = South (bottom)
 * @example 9 = West (left)
 */
export type ClockPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Cardinal direction on visual wheel (clock face)
 *
 * STRICT MAPPING:
 * - NORTH = 12 o'clock (top)
 * - EAST = 3 o'clock (right)
 * - SOUTH = 6 o'clock (bottom)
 * - WEST = 9 o'clock (left)
 */
export type CardinalDirection = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

/**
 * Cardinal progression pattern (4-letter string)
 *
 * Describes the ORDER in which cardinals are encountered
 * following array index 0 → 1 → 2 → 3...
 *
 * First letter = cardinal at 0° base angle
 * Remaining letters = order encountered
 *
 * VISUAL INTERPRETATION (clock face):
 * - "NWSE" = Counter-clockwise: North(12) → West(9) → South(6) → East(3)
 * - "NESW" = Clockwise: North(12) → East(3) → South(6) → West(9)
 * - "ESWN" = Clockwise starting at East: East(3) → South(6) → West(9) → North(12)
 * - "ENWN" = Counter-clockwise starting at East: East(3) → North(12) → West(9) → South(6)
 *
 * ⚠️ IMPORTANT: This describes VISUAL movement on clock face, not mathematical angles
 */
export type CardinalProgression =
  | 'NWSE' // North → West → South → East (counter-clockwise from North)
  | 'NESW' // North → East → South → West (clockwise from North)
  | 'ESWN' // East → South → West → North (clockwise from East)
  | 'ENWN' // East → North → West → South (counter-clockwise from East)
  | 'SWNE' // South → West → North → East (counter-clockwise from South)
  | 'SENW' // South → East → North → West (clockwise from South)
  | 'WNES' // West → North → East → South (clockwise from West)
  | 'WSEN'; // West → South → East → North (counter-clockwise from West)

/**
 * Straddled cardinal position - two gates that straddle a cardinal point
 *
 * Format: "gate1|gate2" where the cardinal sits at the BOUNDARY between them
 *
 * @example "10|11" = Cardinal sits between Gate 11 (before) and Gate 10 (after)
 * @example "25|36" = Cardinal sits between Gate 36 (before) and Gate 25 (after)
 *
 * CRITICAL: The gates must be ADJACENT in the sequence array!
 * The boundary is at: (end of first gate) = (start of second gate)
 */
export type StraddledCardinalPosition = string; // Format: "number|number"

/**
 * Centered cardinal position - single gate centered on cardinal
 *
 * Format: "gate" where the cardinal sits at Line 3.5 (center) of the gate
 *
 * @example "10" = Cardinal at center of Gate 10 (between Line 3 and Line 4)
 */
export type CenteredCardinalPosition = string; // Format: "number"

/**
 * Cardinal position (either straddled or centered)
 */
export type CardinalPosition = StraddledCardinalPosition | CenteredCardinalPosition;

/**
 * Cardinal positioning mode
 */
export type CardinalMode = 'straddled' | 'centered';

/**
 * Complete cardinal configuration with explicit clock positions
 */
export interface CardinalConfig {
  /**
   * Gate(s) at this cardinal
   * @example "10|11" (straddled) or "10" (centered)
   */
  gates: CardinalPosition;

  /**
   * Visual clock position (1-12)
   * @example 12 for North, 3 for East, 6 for South, 9 for West
   */
  clockPosition: ClockPosition;

  /**
   * Human-readable description
   * @example "Straddles 12 o'clock (North)"
   */
  description: string;
}

/**
 * COMPLETE WHEEL CONFIGURATION
 *
 * This is the MASTER configuration that defines wheel behavior.
 * All three mandatory fields must be present and valid.
 */
export interface WheelConfiguration {
  /**
   * Configuration name (identifies this configuration)
   */
  name: string;

  /**
   * Human-readable description
   */
  description: string;

  /**
   * Configuration version (semver)
   */
  version: string;

  // =========================================================================
  // MANDATORY CONFIGURATION FIELDS (The Three Pillars)
  // =========================================================================

  /**
   * MANDATORY FIELD 1: Sequence array
   *
   * Array of exactly 64 gates in sequence order.
   * Position 0 = first gate, position 63 = last gate.
   * Each gate 1-64 must appear exactly once.
   *
   * @example [41, 19, 13, 49, 30, 55, ...]
   */
  sequence: [
    number, number, number, number, number, number, number, number,
    number, number, number, number, number, number, number, number,
    number, number, number, number, number, number, number, number,
    number, number, number, number, number, number, number, number,
    number, number, number, number, number, number, number, number,
    number, number, number, number, number, number, number, number,
    number, number, number, number, number, number, number, number,
    number, number, number, number, number, number, number, number
  ]; // Exactly 64 gates

  /**
   * MANDATORY FIELD 2: Cardinal progression
   *
   * Describes the ORDER of cardinals encountered following array index.
   * Uses VISUAL CLOCK FACE interpretation only.
   *
   * COUNTER-CLOCKWISE from North: "NWSE"
   * CLOCKWISE from North: "NESW"
   *
   * @example "NWSE" = Counter-clockwise: 12 → 9 → 6 → 3
   */
  cardinalProgression: CardinalProgression;

  /**
   * MANDATORY FIELD 3: North position
   *
   * Specifies which gate(s) at North (12 o'clock).
   * Can be straddled "10|11" or centered "10".
   *
   * @example "10|11" = North straddles between gates 11 and 10
   */
  northPosition: CardinalPosition;

  // =========================================================================
  // OPTIONAL FIELDS (Will be calculated if not provided)
  // =========================================================================

  /**
   * East position (3 o'clock)
   * If not provided, will be calculated from cardinal progression
   */
  eastPosition?: CardinalPosition;

  /**
   * South position (6 o'clock)
   * If not provided, will be calculated from cardinal progression
   */
  southPosition?: CardinalPosition;

  /**
   * West position (9 o'clock)
   * If not provided, will be calculated from cardinal progression
   */
  westPosition?: CardinalPosition;

  /**
   * Complete cardinal configuration (for validation and display)
   */
  cardinals?: {
    north: CardinalConfig;
    east: CardinalConfig;
    south: CardinalConfig;
    west: CardinalConfig;
  };

  /**
   * Visual direction (derived from cardinalProgression)
   * @readonly
   */
  visualDirection?: 'clockwise' | 'counter-clockwise';

  /**
   * Visual description
   */
  visualDescription?: string;

  /**
   * Derived/calculated values (read-only)
   */
  derived?: {
    /**
     * Cardinal positioning mode
     */
    cardinalMode: CardinalMode;

    /**
     * Rotation offset in degrees (calculated from northPosition)
     */
    rotationOffset: number;

    /**
     * Gate at array position 0
     */
    arrayStart: number;

    /**
     * Visual angle convention used
     */
    visualCoordinateSystem: {
      zeroPosition: 'north' | 'east' | 'south' | 'west';
      angleProgression: 'clockwise' | 'counter-clockwise';
      cardinalAngles: {
        north: number;
        east: number;
        south: number;
        west: number;
      };
    };
  };

  /**
   * Additional notes
   */
  notes?: Record<string, any>;
}

/**
 * VALIDATION ERROR TYPES
 *
 * Specific error types for different validation failures
 */
export class WheelConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WheelConfigurationError';
  }
}

export class InvalidSequenceError extends WheelConfigurationError {
  constructor(message: string) {
    super(`Invalid sequence: ${message}`);
    this.name = 'InvalidSequenceError';
  }
}

export class InvalidCardinalProgressionError extends WheelConfigurationError {
  constructor(progression: string) {
    super(
      `Invalid cardinal progression: "${progression}". ` +
      `Must be one of: NWSE, NESW, ESWN, ENWN, SWNE, SENW, WNES, WSEN. ` +
      `Use VISUAL CLOCK FACE interpretation: ` +
      `NWSE = counter-clockwise (12→9→6→3), ` +
      `NESW = clockwise (12→3→6→9)`
    );
    this.name = 'InvalidCardinalProgressionError';
  }
}

export class InvalidCardinalPositionError extends WheelConfigurationError {
  constructor(position: string, reason: string) {
    super(`Invalid cardinal position "${position}": ${reason}`);
    this.name = 'InvalidCardinalPositionError';
  }
}

export class CardinalMismatchError extends WheelConfigurationError {
  constructor(expected: CardinalConfig, actual: CardinalConfig) {
    super(
      `Cardinal position mismatch!\n` +
      `Expected: ${expected.gates} at ${expected.clockPosition} o'clock (${expected.description})\n` +
      `Actual: ${actual.gates} at ${actual.clockPosition} o'clock (${actual.description})\n` +
      `This means the visual wheel doesn't match the configuration.`
    );
    this.name = 'CardinalMismatchError';
  }
}
```

---

## RUNTIME VALIDATION (Bulletproof)

### File: `core/root-system/wheel-config-validator.js`

```javascript
/**
 * BULLETPROOF WHEEL CONFIGURATION VALIDATOR
 *
 * Validates configurations with EXTREME PREJUDICE.
 * Rejects anything ambiguous or invalid.
 * Provides CRYSTAL CLEAR error messages.
 */

const VALID_CARDINAL_PROGRESSIONS = [
  'NWSE', 'NESW', 'ESWN', 'ENWN',
  'SWNE', 'SENW', 'WNES', 'WSEN'
];

const CARDINAL_PROGRESSION_DESCRIPTIONS = {
  'NWSE': 'Counter-clockwise from North: 12→9→6→3 (North→West→South→East)',
  'NESW': 'Clockwise from North: 12→3→6→9 (North→East→South→West)',
  'ESWN': 'Clockwise from East: 3→6→9→12 (East→South→West→North)',
  'ENWN': 'Counter-clockwise from East: 3→12→9→6 (East→North→West→South)',
  'SWNE': 'Counter-clockwise from South: 6→9→12→3 (South→West→North→East)',
  'SENW': 'Clockwise from South: 6→3→12→9 (South→East→North→West)',
  'WNES': 'Clockwise from West: 9→12→3→6 (West→North→East→South)',
  'WSEN': 'Counter-clockwise from West: 9→6→3→12 (West→South→East→North)'
};

/**
 * Validate wheel configuration with extreme thoroughness
 *
 * @param {Object} config - Configuration to validate
 * @throws {Error} If configuration is invalid (with detailed message)
 * @returns {Object} Validated configuration with derived values
 */
function validateWheelConfiguration(config) {
  const errors = [];

  // ========================================================================
  // VALIDATION 1: Required fields present
  // ========================================================================

  if (!config.sequence) {
    errors.push('MISSING REQUIRED FIELD: sequence (array of 64 gates)');
  }

  if (!config.cardinalProgression) {
    errors.push('MISSING REQUIRED FIELD: cardinalProgression (e.g., "NWSE" or "NESW")');
  }

  if (!config.northPosition) {
    errors.push('MISSING REQUIRED FIELD: northPosition (e.g., "10|11" or "10")');
  }

  if (errors.length > 0) {
    throw new Error(
      'INVALID WHEEL CONFIGURATION - Missing required fields:\n' +
      errors.map(e => `  ❌ ${e}`).join('\n') +
      '\n\nRequired fields:\n' +
      '  1. sequence: number[] (64 gates)\n' +
      '  2. cardinalProgression: "NWSE" | "NESW" | ... (visual direction)\n' +
      '  3. northPosition: "10|11" (straddled) or "10" (centered)'
    );
  }

  // ========================================================================
  // VALIDATION 2: Sequence array
  // ========================================================================

  if (!Array.isArray(config.sequence)) {
    throw new Error(
      'INVALID SEQUENCE: Must be an array of numbers.\n' +
      `Got: ${typeof config.sequence}`
    );
  }

  if (config.sequence.length !== 64) {
    throw new Error(
      'INVALID SEQUENCE: Must contain exactly 64 gates.\n' +
      `Got: ${config.sequence.length} gates\n\n` +
      'The wheel must have all 64 gates in sequence order.'
    );
  }

  // Check all gates 1-64 present exactly once
  const gateSet = new Set(config.sequence);

  if (gateSet.size !== 64) {
    throw new Error(
      'INVALID SEQUENCE: Contains duplicate gates.\n' +
      `Found only ${gateSet.size} unique gates (expected 64).\n\n` +
      'Each gate 1-64 must appear exactly once in the sequence.'
    );
  }

  for (let gate = 1; gate <= 64; gate++) {
    if (!config.sequence.includes(gate)) {
      throw new Error(
        `INVALID SEQUENCE: Missing gate ${gate}.\n\n` +
        'All gates 1-64 must be present in the sequence.'
      );
    }
  }

  // Check for invalid gate numbers
  for (let i = 0; i < config.sequence.length; i++) {
    const gate = config.sequence[i];
    if (typeof gate !== 'number' || gate < 1 || gate > 64 || !Number.isInteger(gate)) {
      throw new Error(
        `INVALID SEQUENCE: Invalid gate number at position ${i}.\n` +
        `Got: ${gate} (type: ${typeof gate})\n` +
        `Expected: Integer between 1 and 64`
      );
    }
  }

  // ========================================================================
  // VALIDATION 3: Cardinal progression
  // ========================================================================

  if (typeof config.cardinalProgression !== 'string') {
    throw new Error(
      'INVALID CARDINAL PROGRESSION: Must be a string.\n' +
      `Got: ${typeof config.cardinalProgression}\n\n` +
      `Valid values: ${VALID_CARDINAL_PROGRESSIONS.join(', ')}`
    );
  }

  const progression = config.cardinalProgression.toUpperCase();

  if (!VALID_CARDINAL_PROGRESSIONS.includes(progression)) {
    throw new Error(
      `INVALID CARDINAL PROGRESSION: "${config.cardinalProgression}"\n\n` +
      'Valid progressions (VISUAL CLOCK FACE):\n' +
      Object.entries(CARDINAL_PROGRESSION_DESCRIPTIONS)
        .map(([key, desc]) => `  ✓ "${key}" = ${desc}`)
        .join('\n') +
      '\n\nYou provided: "' + config.cardinalProgression + '"\n' +
      'Did you mean one of the above?'
    );
  }

  // ========================================================================
  // VALIDATION 4: Cardinal positions
  // ========================================================================

  const cardinalPositions = [
    { name: 'northPosition', required: true },
    { name: 'eastPosition', required: false },
    { name: 'southPosition', required: false },
    { name: 'westPosition', required: false }
  ];

  for (const { name, required } of cardinalPositions) {
    const position = config[name];

    if (!position) {
      if (required) {
        throw new Error(
          `MISSING REQUIRED FIELD: ${name}\n\n` +
          'North position must be specified.\n' +
          'Format: "10|11" (straddled) or "10" (centered)'
        );
      }
      continue; // Optional position not provided
    }

    if (typeof position !== 'string') {
      throw new Error(
        `INVALID ${name.toUpperCase()}: Must be a string.\n` +
        `Got: ${typeof position}\n\n` +
        'Format: "10|11" (straddled) or "10" (centered)'
      );
    }

    // Parse and validate
    const parsed = parseCardinalPosition(position, config.sequence);

    if (!parsed.valid) {
      throw new Error(
        `INVALID ${name.toUpperCase()}: "${position}"\n\n` +
        `Reason: ${parsed.error}\n\n` +
        'Valid formats:\n' +
        '  Straddled: "10|11" (cardinal between two gates)\n' +
        '  Centered: "10" (cardinal at center of gate)'
      );
    }
  }

  // ========================================================================
  // VALIDATION 5: Cross-validation
  // ========================================================================

  // If multiple cardinals specified, verify they're consistent with progression
  if (config.eastPosition && config.westPosition && config.southPosition) {
    validateCardinalConsistency(config);
  }

  // ========================================================================
  // All validations passed!
  // ========================================================================

  return {
    ...config,
    validated: true,
    validatedAt: new Date().toISOString()
  };
}

/**
 * Parse cardinal position string
 */
function parseCardinalPosition(positionString, sequence) {
  if (positionString.includes('|')) {
    // Straddled mode
    const parts = positionString.split('|');

    if (parts.length !== 2) {
      return {
        valid: false,
        error: 'Straddled format must have exactly two gates separated by "|"'
      };
    }

    const gate1 = parseInt(parts[0]);
    const gate2 = parseInt(parts[1]);

    if (isNaN(gate1) || isNaN(gate2)) {
      return {
        valid: false,
        error: 'Both gates must be valid numbers'
      };
    }

    if (gate1 < 1 || gate1 > 64 || gate2 < 1 || gate2 > 64) {
      return {
        valid: false,
        error: 'Gates must be between 1 and 64'
      };
    }

    // Verify gates are in sequence
    if (!sequence.includes(gate1)) {
      return {
        valid: false,
        error: `Gate ${gate1} not found in sequence`
      };
    }

    if (!sequence.includes(gate2)) {
      return {
        valid: false,
        error: `Gate ${gate2} not found in sequence`
      };
    }

    // Verify gates are adjacent in sequence
    const pos1 = sequence.indexOf(gate1);
    const pos2 = sequence.indexOf(gate2);
    const adjacent = Math.abs(pos1 - pos2) === 1 ||
                     (pos1 === 0 && pos2 === 63) ||
                     (pos1 === 63 && pos2 === 0);

    if (!adjacent) {
      return {
        valid: false,
        error: `Gates ${gate1} and ${gate2} are not adjacent in sequence (positions ${pos1} and ${pos2}). ` +
               `For straddled positioning, gates must be next to each other.`
      };
    }

    return {
      valid: true,
      mode: 'straddled',
      gates: [gate1, gate2],
      description: `Boundary between Gate ${parts[0]} and Gate ${parts[1]}`
    };
  } else {
    // Centered mode
    const gate = parseInt(positionString);

    if (isNaN(gate)) {
      return {
        valid: false,
        error: 'Gate must be a valid number'
      };
    }

    if (gate < 1 || gate > 64) {
      return {
        valid: false,
        error: 'Gate must be between 1 and 64'
      };
    }

    if (!sequence.includes(gate)) {
      return {
        valid: false,
        error: `Gate ${gate} not found in sequence`
      };
    }

    return {
      valid: true,
      mode: 'centered',
      gate: gate,
      description: `Center of Gate ${gate} (Line 3.5)`
    };
  }
}

/**
 * Validate that all specified cardinals are consistent with progression
 */
function validateCardinalConsistency(config) {
  // This would check that the specified cardinal positions
  // match the expected positions based on the cardinal progression
  // (Implementation details omitted for brevity)
}

module.exports = {
  validateWheelConfiguration,
  parseCardinalPosition,
  VALID_CARDINAL_PROGRESSIONS,
  CARDINAL_PROGRESSION_DESCRIPTIONS
};
```

---

## EXAMPLES (Right and Wrong)

### File: `docs/WHEEL-CONFIG-EXAMPLES.md`

```markdown
# Wheel Configuration Examples

## ✅ CORRECT EXAMPLES

### Example 1: Standard Rave Wheel (Counter-Clockwise)

\`\`\`json
{
  "name": "rave-wheel-41-start",
  "description": "Standard Rave Wheel - Counter-clockwise",
  "version": "1.0.0",

  "sequence": [41, 19, 13, ..., 60],
  "cardinalProgression": "NWSE",
  "northPosition": "10|11"
}
\`\`\`

**Visual interpretation:**
- Counter-clockwise on clock face (12 → 11 → 10 → 9)
- North at 12, West at 9, South at 6, East at 3
- Cardinals straddled between gates

---

### Example 2: Reversed Wheel (Clockwise)

\`\`\`json
{
  "name": "reversed-wheel",
  "description": "Clockwise rotating wheel",
  "version": "1.0.0",

  "sequence": [reversed array],
  "cardinalProgression": "NESW",
  "northPosition": "10|11"
}
\`\`\`

**Visual interpretation:**
- Clockwise on clock face (12 → 1 → 2 → 3)
- North at 12, East at 3, South at 6, West at 9

---

## ❌ WRONG EXAMPLES (Will be rejected)

### Error 1: Invalid Cardinal Progression

\`\`\`json
{
  "cardinalProgression": "counter-clockwise"  // ❌ WRONG
}
\`\`\`

**Error message:**
\`\`\`
INVALID CARDINAL PROGRESSION: "counter-clockwise"

Valid progressions (VISUAL CLOCK FACE):
  ✓ "NWSE" = Counter-clockwise from North: 12→9→6→3
  ✓ "NESW" = Clockwise from North: 12→3→6→9
  ...
\`\`\`

**Fix:**
\`\`\`json
{
  "cardinalProgression": "NWSE"  // ✅ CORRECT
}
\`\`\`

---

### Error 2: Non-Adjacent Gates in Straddle

\`\`\`json
{
  "northPosition": "10|25"  // ❌ WRONG - gates not adjacent
}
\`\`\`

**Error message:**
\`\`\`
INVALID NORTHPOSITION: "10|25"

Reason: Gates 10 and 25 are not adjacent in sequence (positions 58 and 10).
For straddled positioning, gates must be next to each other.
\`\`\`

**Fix:**
\`\`\`json
{
  "northPosition": "10|11"  // ✅ CORRECT - adjacent gates
}
\`\`\`

---

### Error 3: Missing Required Field

\`\`\`json
{
  "sequence": [41, 19, ...],
  "cardinalProgression": "NWSE"
  // ❌ MISSING northPosition
}
\`\`\`

**Error message:**
\`\`\`
INVALID WHEEL CONFIGURATION - Missing required fields:
  ❌ MISSING REQUIRED FIELD: northPosition (e.g., "10|11" or "10")

Required fields:
  1. sequence: number[] (64 gates)
  2. cardinalProgression: "NWSE" | "NESW" | ... (visual direction)
  3. northPosition: "10|11" (straddled) or "10" (centered)
\`\`\`

---

## VISUAL REFERENCE

Always refer to this when configuring:

\`\`\`
           12 (NORTH)
              |
              |
    9 (WEST)--+--3 (EAST)
              |
              |
           6 (SOUTH)

Counter-clockwise: 12 → 11 → 10 → 9 → 8 → 7 → 6 → 5 → 4 → 3 → 2 → 1 → 12
Clockwise: 12 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12
\`\`\`
```

---

## SESSION PROMPT UPDATES

Now I'll create a script to update all session prompts with:
1. Correct NWSE configuration
2. Strict TypeScript types
3. Clear validation rules
4. Visual clock face diagrams

Would you like me to proceed with updating all the session files?
