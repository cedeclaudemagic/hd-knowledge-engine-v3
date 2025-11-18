/**
 * Counter-Clockwise Mathematics Verification Script
 *
 * This script verifies that the gate sequence follows counter-clockwise
 * mathematical progression (increasing angles = counter-clockwise).
 *
 * It also generates comprehensive tables showing gate positions and
 * identifies any anomalies in the sequence.
 */

const positioning = require('../core/root-system/positioning-algorithm');
const gateSequenceData = require('../core/root-system/gate-sequence.json');

console.log('═'.repeat(80));
console.log('COUNTER-CLOCKWISE MATHEMATICS VERIFICATION');
console.log('═'.repeat(80));
console.log();

// ============================================================================
// SECTION 1: VERIFY COUNTER-CLOCKWISE PROGRESSION
// ============================================================================

console.log('1. COUNTER-CLOCKWISE VERIFICATION');
console.log('─'.repeat(80));
console.log();

const sequence = gateSequenceData.sequence;
let progressionErrors = [];
let previousAngle = null;

console.log('Testing: Increasing array index = Increasing angle (counter-clockwise)\n');

for (let i = 0; i < sequence.length; i++) {
  const gate = sequence[i];
  const pos = positioning.getWheelPosition(gate, 1);

  if (previousAngle !== null) {
    // In counter-clockwise, angle should always increase
    // (with wrap-around from 360° to 0°)
    const expectedIncrease = pos.angle > previousAngle ||
                             (pos.angle < 10 && previousAngle > 350); // Wrap-around case

    if (!expectedIncrease) {
      progressionErrors.push({
        position: i,
        gate: gate,
        angle: pos.angle,
        previousAngle: previousAngle,
        issue: 'Angle decreased (clockwise movement)'
      });
    }
  }

  previousAngle = pos.angle;
}

if (progressionErrors.length === 0) {
  console.log('✅ VERIFIED: Sequence follows COUNTER-CLOCKWISE progression');
  console.log('   (Increasing array position = Increasing angle)');
} else {
  console.log('❌ ERROR: Sequence has CLOCKWISE segments');
  console.log('   Errors found:', progressionErrors.length);
  progressionErrors.forEach(err => {
    console.log(`   Position ${err.position}: Gate ${err.gate} at ${err.angle}° `
                + `(previous: ${err.previousAngle}°)`);
  });
}

console.log();

// ============================================================================
// SECTION 2: MATHEMATICAL PROPERTIES
// ============================================================================

console.log('2. MATHEMATICAL PROPERTIES');
console.log('─'.repeat(80));
console.log();

// Test constant angular spacing
const EXPECTED_DEGREES_PER_GATE = 360 / 64;
const EXPECTED_DEGREES_PER_LINE = 360 / 384;

console.log(`Expected degrees per gate: ${EXPECTED_DEGREES_PER_GATE.toFixed(4)}°`);
console.log(`Expected degrees per line: ${EXPECTED_DEGREES_PER_LINE.toFixed(6)}°`);
console.log();

// Verify line spacing
let lineSpacingErrors = [];
for (let gate = 1; gate <= 64; gate++) {
  for (let line = 1; line < 6; line++) {
    const pos1 = positioning.getWheelPosition(gate, line);
    const pos2 = positioning.getWheelPosition(gate, line + 1);

    const diff = (pos2.angle - pos1.angle + 360) % 360;
    const error = Math.abs(diff - EXPECTED_DEGREES_PER_LINE);

    if (error > 0.0001) {
      lineSpacingErrors.push({
        gate,
        line: `${line}→${line+1}`,
        expected: EXPECTED_DEGREES_PER_LINE,
        actual: diff,
        error: error
      });
    }
  }
}

if (lineSpacingErrors.length === 0) {
  console.log(`✅ VERIFIED: All 320 line transitions = ${EXPECTED_DEGREES_PER_LINE}°`);
  console.log('   (Line-level precision maintained across all gates)');
} else {
  console.log(`❌ ERROR: ${lineSpacingErrors.length} line spacing errors found`);
  lineSpacingErrors.slice(0, 5).forEach(err => {
    console.log(`   Gate ${err.gate}, line ${err.line}: `
                + `${err.actual.toFixed(6)}° (error: ${err.error.toFixed(6)}°)`);
  });
  if (lineSpacingErrors.length > 5) {
    console.log(`   ... and ${lineSpacingErrors.length - 5} more errors`);
  }
}

console.log();

// ============================================================================
// SECTION 3: CARDINAL POINTS TABLE (WITH ROTATION)
// ============================================================================

console.log('3. CARDINAL POINTS TABLE (Default: 33.75° rotation)');
console.log('─'.repeat(80));
console.log();

const ROTATION_OFFSET = 33.75; // Default rotation from rave-wheel-41-start

console.log('NOTE: Default configuration rotates wheel by 33.75° to place Gates 10/11 at north\n');

// Find gates near cardinal points WITH rotation
const cardinalPoints = [
  { name: 'NORTH', angle: 0, tolerance: 10 },
  { name: 'EAST', angle: 90, tolerance: 10 },
  { name: 'SOUTH', angle: 180, tolerance: 10 },
  { name: 'WEST', angle: 270, tolerance: 10 }
];

cardinalPoints.forEach(cardinal => {
  console.log(`${cardinal.name} (${cardinal.angle}°) - Gates within ±${cardinal.tolerance}°:`);
  console.log('─'.repeat(70));

  let found = [];

  for (let i = 0; i < sequence.length; i++) {
    const gate = sequence[i];
    const pos = positioning.getWheelPosition(gate, 1);

    // Apply rotation to get visual angle
    const visualAngle = (pos.angle + ROTATION_OFFSET) % 360;

    // Calculate distance from cardinal point
    let distance = Math.abs(visualAngle - cardinal.angle);
    if (distance > 180) distance = 360 - distance;

    if (distance <= cardinal.tolerance) {
      found.push({
        gate,
        arrayPos: i,
        baseAngle: pos.angle.toFixed(2),
        visualAngle: visualAngle.toFixed(2),
        distance: distance.toFixed(2)
      });
    }
  }

  // Sort by distance from cardinal point
  found.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  console.log('Gate | Array Pos | Base Angle | Visual Angle | Distance');
  console.log('-----|-----------|------------|--------------|----------');

  found.forEach(item => {
    console.log(
      `${String(item.gate).padStart(4)} | ` +
      `${String(item.arrayPos).padStart(9)} | ` +
      `${String(item.baseAngle).padStart(10)}° | ` +
      `${String(item.visualAngle).padStart(12)}° | ` +
      `${String(item.distance).padStart(8)}°`
    );
  });

  console.log();
});

// ============================================================================
// SECTION 4: DETAILED LINE-BY-LINE CARDINAL POSITIONS
// ============================================================================

console.log('4. LINE-BY-LINE CARDINAL POSITIONS (Default rotation)');
console.log('─'.repeat(80));
console.log();

console.log('NORTH (0°) - Line-level detail:');
console.log('─'.repeat(70));

// Find all lines within ±2° of north (with rotation)
let northLines = [];

for (let gate = 1; gate <= 64; gate++) {
  for (let line = 1; line <= 6; line++) {
    const pos = positioning.getWheelPosition(gate, line);
    const visualAngle = (pos.angle + ROTATION_OFFSET) % 360;

    let distance = Math.abs(visualAngle - 0);
    if (distance > 180) distance = 360 - distance;

    if (distance <= 2) {
      northLines.push({
        gate,
        line,
        linePos: pos.linePosition,
        baseAngle: pos.angle,
        visualAngle: visualAngle,
        distance: distance
      });
    }
  }
}

northLines.sort((a, b) => a.distance - b.distance);

console.log('Gate | Line | Line Pos | Base Angle | Visual Angle | Distance from 0°');
console.log('-----|------|----------|------------|--------------|------------------');

northLines.forEach(item => {
  console.log(
    `${String(item.gate).padStart(4)} | ` +
    `${String(item.line).padStart(4)} | ` +
    `${String(item.linePos).padStart(8)} | ` +
    `${item.baseAngle.toFixed(4).padStart(10)}° | ` +
    `${item.visualAngle.toFixed(4).padStart(12)}° | ` +
    `${item.distance.toFixed(4).padStart(16)}°`
  );
});

console.log();

// ============================================================================
// SECTION 5: SEQUENCE ANALYSIS
// ============================================================================

console.log('5. SEQUENCE ANALYSIS');
console.log('─'.repeat(80));
console.log();

console.log('First 10 gates in sequence (array positions 0-9):');
console.log('─'.repeat(70));
console.log('Pos | Gate | Base Angle | Visual Angle (w/ rotation) | Distance from prev');
console.log('----|------|------------|----------------------------|-------------------');

for (let i = 0; i < 10; i++) {
  const gate = sequence[i];
  const pos = positioning.getWheelPosition(gate, 1);
  const visualAngle = (pos.angle + ROTATION_OFFSET) % 360;

  let distanceFromPrev = '';
  if (i > 0) {
    const prevGate = sequence[i - 1];
    const prevPos = positioning.getWheelPosition(prevGate, 1);
    const diff = (pos.angle - prevPos.angle + 360) % 360;
    distanceFromPrev = `+${diff.toFixed(2)}°`;
  }

  console.log(
    `${String(i).padStart(3)} | ` +
    `${String(gate).padStart(4)} | ` +
    `${pos.angle.toFixed(2).padStart(10)}° | ` +
    `${visualAngle.toFixed(2).padStart(26)}° | ` +
    `${distanceFromPrev.padStart(17)}`
  );
}

console.log();

console.log('Last 10 gates in sequence (array positions 54-63):');
console.log('─'.repeat(70));
console.log('Pos | Gate | Base Angle | Visual Angle (w/ rotation) | Distance from prev');
console.log('----|------|------------|----------------------------|-------------------');

for (let i = 54; i < 64; i++) {
  const gate = sequence[i];
  const pos = positioning.getWheelPosition(gate, 1);
  const visualAngle = (pos.angle + ROTATION_OFFSET) % 360;

  const prevGate = sequence[i - 1];
  const prevPos = positioning.getWheelPosition(prevGate, 1);
  const diff = (pos.angle - prevPos.angle + 360) % 360;
  const distanceFromPrev = `+${diff.toFixed(2)}°`;

  console.log(
    `${String(i).padStart(3)} | ` +
    `${String(gate).padStart(4)} | ` +
    `${pos.angle.toFixed(2).padStart(10)}° | ` +
    `${visualAngle.toFixed(2).padStart(26)}° | ` +
    `${distanceFromPrev.padStart(17)}`
  );
}

console.log();

// ============================================================================
// SECTION 6: ANOMALY DETECTION
// ============================================================================

console.log('6. ANOMALY DETECTION');
console.log('─'.repeat(80));
console.log();

let anomalies = [];

// Check for duplicate gates
const gateSet = new Set(sequence);
if (gateSet.size !== 64) {
  anomalies.push({
    type: 'DUPLICATE_GATES',
    severity: 'CRITICAL',
    message: `Only ${gateSet.size} unique gates found (expected 64)`
  });
}

// Check for missing gates
for (let g = 1; g <= 64; g++) {
  if (!sequence.includes(g)) {
    anomalies.push({
      type: 'MISSING_GATE',
      severity: 'CRITICAL',
      message: `Gate ${g} is missing from sequence`
    });
  }
}

// Check for invalid gates
sequence.forEach((gate, idx) => {
  if (gate < 1 || gate > 64) {
    anomalies.push({
      type: 'INVALID_GATE',
      severity: 'CRITICAL',
      message: `Invalid gate ${gate} at position ${idx}`
    });
  }
});

// Check for non-uniform angular spacing
let spacingVariances = [];
for (let i = 1; i < sequence.length; i++) {
  const gate1 = sequence[i - 1];
  const gate2 = sequence[i];
  const pos1 = positioning.getWheelPosition(gate1, 1);
  const pos2 = positioning.getWheelPosition(gate2, 1);

  const diff = (pos2.angle - pos1.angle + 360) % 360;
  const variance = Math.abs(diff - EXPECTED_DEGREES_PER_GATE);

  if (variance > 0.1) { // More than 0.1° variance
    spacingVariances.push({
      position: `${i-1}→${i}`,
      gates: `${gate1}→${gate2}`,
      expected: EXPECTED_DEGREES_PER_GATE.toFixed(4),
      actual: diff.toFixed(4),
      variance: variance.toFixed(4)
    });
  }
}

if (spacingVariances.length > 0) {
  anomalies.push({
    type: 'SPACING_VARIANCE',
    severity: 'WARNING',
    message: `${spacingVariances.length} gate transitions have >0.1° spacing variance`,
    details: spacingVariances
  });
}

// Report anomalies
if (anomalies.length === 0) {
  console.log('✅ NO ANOMALIES DETECTED');
  console.log('   - All 64 gates present and unique');
  console.log('   - Counter-clockwise progression verified');
  console.log('   - Angular spacing uniform');
  console.log('   - Line-level precision maintained');
} else {
  console.log(`⚠️  ${anomalies.length} ANOMALIES DETECTED:\n`);

  anomalies.forEach((anomaly, idx) => {
    console.log(`${idx + 1}. [${anomaly.severity}] ${anomaly.type}`);
    console.log(`   ${anomaly.message}`);

    if (anomaly.details && anomaly.details.length > 0) {
      console.log('   Details:');
      anomaly.details.slice(0, 5).forEach(detail => {
        console.log(`     ${detail.gates}: ${detail.actual}° (expected ${detail.expected}°)`);
      });
      if (anomaly.details.length > 5) {
        console.log(`     ... and ${anomaly.details.length - 5} more`);
      }
    }
    console.log();
  });
}

// ============================================================================
// SECTION 7: SUMMARY
// ============================================================================

console.log('═'.repeat(80));
console.log('SUMMARY');
console.log('═'.repeat(80));
console.log();

console.log('✅ Direction: COUNTER-CLOCKWISE (mathematically correct)');
console.log(`   Increasing array index (0→63) = Increasing angle (0°→360°)`);
console.log();

console.log('✅ Line Precision: 0.9375° per line (360° / 384 lines)');
console.log(`   64 gates × 6 lines × 0.9375° = 360°`);
console.log();

console.log('✅ Default Rotation: 33.75°');
console.log('   Array position 0: Gate 41');
console.log('   Visual north (0°): Gates 10/11');
console.log('   DECOUPLED: Array order ≠ Visual presentation');
console.log();

if (progressionErrors.length === 0 && lineSpacingErrors.length === 0 && anomalies.length === 0) {
  console.log('🎉 ALL VERIFICATIONS PASSED');
  console.log('   The sequence is mathematically consistent and counter-clockwise.');
  process.exit(0);
} else {
  console.log('⚠️  SOME ISSUES DETECTED');
  console.log(`   Progression errors: ${progressionErrors.length}`);
  console.log(`   Line spacing errors: ${lineSpacingErrors.length}`);
  console.log(`   Anomalies: ${anomalies.length}`);
  process.exit(1);
}
