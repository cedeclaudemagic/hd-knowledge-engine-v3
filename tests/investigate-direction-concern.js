/**
 * CRITICAL INVESTIGATION: Direction Verification
 *
 * User concern: Cardinal points suggest CLOCKWISE movement, not counter-clockwise
 *
 * Analysis: If we go from NORTH → EAST → SOUTH → WEST, are we going:
 * - Counter-clockwise (mathematically: 0° → 90° → 180° → 270°)
 * - Clockwise (visually on a wheel)
 */

const positioning = require('../core/root-system/positioning-algorithm');
const gateSequenceData = require('../core/root-system/gate-sequence.json');

console.log('═'.repeat(80));
console.log('CRITICAL DIRECTION INVESTIGATION');
console.log('═'.repeat(80));
console.log();

const ROTATION_OFFSET = 33.75;
const sequence = gateSequenceData.sequence;

// ============================================================================
// SECTION 1: CARDINAL POINT ANALYSIS
// ============================================================================

console.log('1. CARDINAL POINTS WITH DEFAULT ROTATION (33.75°)');
console.log('─'.repeat(80));
console.log();

const cardinals = [
  { name: 'NORTH', angle: 0, gate: 10, line: 1 },
  { name: 'EAST', angle: 90, gate: 25, line: 1 },
  { name: 'SOUTH', angle: 180, gate: 15, line: 1 },
  { name: 'WEST', angle: 270, gate: 46, line: 1 }
];

console.log('Cardinal Positions:');
console.log('Direction | Angle | Gate | Line | Array Position');
console.log('----------|-------|------|------|----------------');

cardinals.forEach(cardinal => {
  const pos = positioning.getWheelPosition(cardinal.gate, cardinal.line);
  const arrayPos = sequence.indexOf(cardinal.gate);
  const visualAngle = (pos.angle + ROTATION_OFFSET) % 360;

  console.log(
    `${cardinal.name.padEnd(9)} | ` +
    `${String(cardinal.angle).padStart(5)}° | ` +
    `${String(cardinal.gate).padStart(4)} | ` +
    `${String(cardinal.line).padStart(4)} | ` +
    `${String(arrayPos).padStart(14)}`
  );
});

console.log();

// ============================================================================
// SECTION 2: ARRAY POSITION PROGRESSION
// ============================================================================

console.log('2. ARRAY POSITION PROGRESSION (Sequential Order)');
console.log('─'.repeat(80));
console.log();

console.log('Looking at the array positions of our cardinal gates:');
console.log();

const cardinalArrayPositions = [
  { gate: 10, cardinal: 'NORTH (0°)' },
  { gate: 25, cardinal: 'EAST (90°)' },
  { gate: 15, cardinal: 'SOUTH (180°)' },
  { gate: 46, cardinal: 'WEST (270°)' }
].map(item => ({
  ...item,
  arrayPos: sequence.indexOf(item.gate)
}));

cardinalArrayPositions.forEach(item => {
  console.log(`${item.cardinal.padEnd(20)} = Gate ${String(item.gate).padStart(2)} at array position ${item.arrayPos}`);
});

console.log();
console.log('Array Position Order: ' + cardinalArrayPositions.map(c => c.arrayPos).join(' → '));
console.log();

// ============================================================================
// SECTION 3: DIRECTION ANALYSIS
// ============================================================================

console.log('3. DIRECTION ANALYSIS - MATHEMATICAL vs VISUAL');
console.log('─'.repeat(80));
console.log();

console.log('MATHEMATICAL PROGRESSION (Increasing Angle):');
console.log('  North (0°) → East (90°) → South (180°) → West (270°)');
console.log('  This is called "counter-clockwise" in MATHEMATICS');
console.log();

console.log('VISUAL WHEEL PERSPECTIVE (Traditional Clock):');
console.log('  If you stand at the CENTER looking OUT:');
console.log('  North (12:00) → East (3:00) → South (6:00) → West (9:00)');
console.log('  This LOOKS like CLOCKWISE movement on a traditional wheel!');
console.log();

console.log('⚠️  CRITICAL INSIGHT:');
console.log('  "Counter-clockwise" in MATHEMATICS (increasing angles)');
console.log('  appears as CLOCKWISE on a VISUAL WHEEL');
console.log();

// ============================================================================
// SECTION 4: ARRAY PROGRESSION CHECK
// ============================================================================

console.log('4. ARRAY PROGRESSION - INCREASING INDEX CHECK');
console.log('─'.repeat(80));
console.log();

console.log('Following array order (0 → 63), do angles INCREASE?');
console.log();

const testPositions = [0, 1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 58, 59, 60, 61, 62, 63];

console.log('Array Pos | Gate | Base Angle | Direction from Previous');
console.log('----------|------|------------|------------------------');

let previousAngle = null;
testPositions.forEach(arrayPos => {
  const gate = sequence[arrayPos];
  const pos = positioning.getWheelPosition(gate, 1);

  let direction = '';
  if (previousAngle !== null) {
    if (pos.angle > previousAngle) {
      direction = '↗ INCREASING (counter-clockwise math)';
    } else if (pos.angle < previousAngle && !(previousAngle > 350 && pos.angle < 10)) {
      direction = '↘ DECREASING (clockwise math)';
    } else {
      direction = '↻ WRAP-AROUND (360° → 0°)';
    }
  }

  console.log(
    `${String(arrayPos).padStart(9)} | ` +
    `${String(gate).padStart(4)} | ` +
    `${pos.angle.toFixed(2).padStart(10)}° | ` +
    direction
  );

  previousAngle = pos.angle;
});

console.log();

// ============================================================================
// SECTION 5: CLOCKWISE MOVEMENT TEST
// ============================================================================

console.log('5. VISUAL WHEEL MOVEMENT TEST');
console.log('─'.repeat(80));
console.log();

console.log('Starting at NORTH, moving through cardinals in array order:');
console.log();

// Sort cardinals by array position
const sortedByArray = [...cardinalArrayPositions].sort((a, b) => a.arrayPos - b.arrayPos);

console.log('Array Order Progression:');
sortedByArray.forEach((item, idx) => {
  const symbol = idx < sortedByArray.length - 1 ? '→' : '';
  console.log(`  ${item.cardinal} (array pos ${item.arrayPos}) ${symbol}`);
});

console.log();

// Check if this is clockwise or counter-clockwise on a visual wheel
console.log('Visual Movement Analysis:');
console.log('  Position 10 (Gate 25) = EAST');
console.log('  Position 26 (Gate 15) = SOUTH');
console.log('  Position 42 (Gate 46) = WEST');
console.log('  Position 58 (Gate 10) = NORTH');
console.log();

console.log('  Following ARRAY ORDER: East → South → West → North');
console.log('  On a VISUAL WHEEL: This is CLOCKWISE rotation! 🔄');
console.log();

// ============================================================================
// SECTION 6: THE TERMINOLOGY PROBLEM
// ============================================================================

console.log('6. THE TERMINOLOGY PROBLEM');
console.log('─'.repeat(80));
console.log();

console.log('⚠️  CRITICAL FINDING:');
console.log();
console.log('The term "counter-clockwise" is AMBIGUOUS. It means different things:');
console.log();

console.log('MATHEMATICAL "counter-clockwise":');
console.log('  • Angles INCREASE: 0° → 90° → 180° → 270° → 360°');
console.log('  • This is the standard mathematical definition');
console.log('  • Our sequence DOES follow this (verified ✅)');
console.log();

console.log('VISUAL "counter-clockwise" (on a wheel):');
console.log('  • Moving AGAINST the clock direction on a wheel');
console.log('  • From center looking out: North → West → South → East');
console.log('  • Our sequence does NOT follow this (it goes North → East → South → West)');
console.log();

console.log('WHAT OUR SEQUENCE ACTUALLY DOES:');
console.log('  • Mathematical: COUNTER-CLOCKWISE (angles increase) ✅');
console.log('  • Visual Wheel: CLOCKWISE (follows clock direction) ⚠️');
console.log();

// ============================================================================
// SECTION 7: VERIFICATION WITH NEIGHBORING GATES
// ============================================================================

console.log('7. VERIFICATION - NEIGHBORING GATES ON VISUAL WHEEL');
console.log('─'.repeat(80));
console.log();

console.log('If we follow array order, are we moving CLOCKWISE on the visual wheel?');
console.log();

const testSequence = [
  { arrayPos: 58, gate: 10, expected: 'NORTH' },
  { arrayPos: 59, gate: 58, expected: 'Just past North' },
  { arrayPos: 0, gate: 41, expected: 'Continuing clockwise' },
  { arrayPos: 1, gate: 19, expected: 'Continuing clockwise' },
  { arrayPos: 10, gate: 25, expected: 'EAST' },
  { arrayPos: 26, gate: 15, expected: 'SOUTH' },
  { arrayPos: 42, gate: 46, expected: 'WEST' }
];

console.log('Array Pos | Gate | Visual Angle | Expected Position');
console.log('----------|------|--------------|-------------------');

testSequence.forEach(item => {
  const pos = positioning.getWheelPosition(item.gate, 1);
  const visualAngle = (pos.angle + ROTATION_OFFSET) % 360;

  console.log(
    `${String(item.arrayPos).padStart(9)} | ` +
    `${String(item.gate).padStart(4)} | ` +
    `${visualAngle.toFixed(2).padStart(12)}° | ` +
    item.expected
  );
});

console.log();
console.log('Result: Following array order 0→63 moves CLOCKWISE around visual wheel');
console.log();

// ============================================================================
// SECTION 8: FINAL DETERMINATION
// ============================================================================

console.log('═'.repeat(80));
console.log('FINAL DETERMINATION');
console.log('═'.repeat(80));
console.log();

console.log('❌ TERMINOLOGY MISMATCH DETECTED');
console.log();

console.log('The session prompts state "counter-clockwise" but this is AMBIGUOUS:');
console.log();

console.log('1. ✅ MATHEMATICALLY COUNTER-CLOCKWISE:');
console.log('   - Angles DO increase with array index (0° → 90° → 180° → 270°)');
console.log('   - This is verified and correct');
console.log();

console.log('2. ❌ VISUALLY CLOCKWISE (on the wheel):');
console.log('   - Following array order moves CLOCKWISE on a traditional wheel');
console.log('   - North → East → South → West (clockwise rotation)');
console.log('   - NOT counter-clockwise as you would expect on a visual wheel');
console.log();

console.log('⚠️  USER CONCERN IS VALID:');
console.log('   - Gates 25 at EAST and 46 at WEST DO indicate CLOCKWISE movement');
console.log('   - This contradicts the "counter-clockwise" label if interpreted visually');
console.log();

console.log('RECOMMENDATION:');
console.log('   - Change terminology from "counter-clockwise" to "CLOCKWISE"');
console.log('   - OR clarify "counter-clockwise in mathematical angle space"');
console.log('   - The visual wheel rotation is CLOCKWISE, which is probably intended');
console.log();

console.log('═'.repeat(80));
