/**
 * FUNDAMENTAL CONFIGURATION TESTS
 *
 * These tests are CRITICAL and must pass for ANY configuration system.
 * They verify the core principles of wheel configuration.
 *
 * VISUAL CLOCK FACE REFERENCE:
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

// These tests run BEFORE implementation (TDD)
// Uncomment when implementing SESSION-02

/*
const { WheelConfiguration } = require('../../core/root-system/wheel-config.js');
const positioning = require('../../core/root-system/positioning-algorithm.js');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ ${description}`);
    passCount++;
  } catch (error) {
    console.error(`❌ ${description}`);
    console.error(`   ${error.message}`);
    failCount++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('═'.repeat(80));
console.log('FUNDAMENTAL CONFIGURATION TESTS');
console.log('═'.repeat(80));
console.log();

// ============================================================================
// TEST GROUP 1: Configuration Structure
// ============================================================================

console.log('TEST GROUP 1: Configuration Structure');
console.log('─'.repeat(80));
console.log();

test('Default configuration has three mandatory fields', () => {
  const config = new WheelConfiguration();

  assert(config.sequence, 'Must have sequence');
  assert(config.config.cardinalProgression, 'Must have cardinalProgression');
  assert(config.config.northPosition, 'Must have northPosition');
});

test('Sequence has exactly 64 gates', () => {
  const config = new WheelConfiguration();
  assert(config.sequence.length === 64, `Expected 64 gates, got ${config.sequence.length}`);
});

test('All gates 1-64 present exactly once', () => {
  const config = new WheelConfiguration();
  const gates = new Set(config.sequence);

  assert(gates.size === 64, 'Must have 64 unique gates');

  for (let i = 1; i <= 64; i++) {
    assert(config.sequence.includes(i), `Gate ${i} missing from sequence`);
  }
});

test('Cardinal progression is valid', () => {
  const config = new WheelConfiguration();
  const valid = ['NWSE', 'NESW', 'ESWN', 'ENWN', 'SWNE', 'SENW', 'WNES', 'WSEN'];

  assert(
    valid.includes(config.config.cardinalProgression),
    `Invalid cardinal progression: ${config.config.cardinalProgression}`
  );
});

test('North position is specified', () => {
  const config = new WheelConfiguration();
  assert(config.config.northPosition, 'North position must be specified');
});

// ============================================================================
// TEST GROUP 2: Default Configuration (NWSE - Rave Wheel)
// ============================================================================

console.log('\nTEST GROUP 2: Default Configuration (NWSE)');
console.log('─'.repeat(80));
console.log();

test('Default cardinal progression is NWSE', () => {
  const config = new WheelConfiguration();
  assert(
    config.config.cardinalProgression === 'NWSE',
    `Expected NWSE, got ${config.config.cardinalProgression}`
  );
});

test('Default north position is 10|11 (straddled)', () => {
  const config = new WheelConfiguration();
  assert(
    config.config.northPosition === '10|11',
    `Expected "10|11", got "${config.config.northPosition}"`
  );
});

test('Default sequence starts with Gate 41', () => {
  const config = new WheelConfiguration();
  assert(
    config.sequence[0] === 41,
    `Expected Gate 41 at position 0, got ${config.sequence[0]}`
  );
});

// ============================================================================
// TEST GROUP 3: Visual Clock Positions (CRITICAL)
// ============================================================================

console.log('\nTEST GROUP 3: Visual Clock Positions');
console.log('─'.repeat(80));
console.log();

test('North (12 o\'clock) has gates 10|11', () => {
  positioning.resetConfiguration(); // Use default
  const pos10 = positioning.getWheelPosition(10, 1);
  const pos11 = positioning.getWheelPosition(11, 1);

  // With NWSE and 33.75° rotation, Gate 10 should be at ~0°
  assert(
    Math.abs(pos10.angle - 0) < 1,
    `Gate 10 should be at ~0° (North), got ${pos10.angle.toFixed(2)}°`
  );

  // Gate 11 should be just before 0° (like 359.x°)
  assert(
    pos11.angle > 354 || pos11.angle < 5,
    `Gate 11 should be near 0° (North), got ${pos11.angle.toFixed(2)}°`
  );
});

test('West (9 o\'clock) has gates 25|36', () => {
  positioning.resetConfiguration();
  const pos25 = positioning.getWheelPosition(25, 1);
  const pos36 = positioning.getWheelPosition(36, 1);

  // With NWSE, Gate 25 should be at ~90° (which is West in counter-clockwise system)
  assert(
    Math.abs(pos25.angle - 90) < 1,
    `Gate 25 should be at ~90° (West in NWSE), got ${pos25.angle.toFixed(2)}°`
  );

  // Gate 36 should be just before 90°
  assert(
    Math.abs(pos36.angle - 84.375) < 1,
    `Gate 36 should be near 90° (West), got ${pos36.angle.toFixed(2)}°`
  );
});

test('South (6 o\'clock) has gates 15|12', () => {
  positioning.resetConfiguration();
  const pos15 = positioning.getWheelPosition(15, 1);
  const pos12 = positioning.getWheelPosition(12, 1);

  // Gate 15 should be at ~180°
  assert(
    Math.abs(pos15.angle - 180) < 1,
    `Gate 15 should be at ~180° (South), got ${pos15.angle.toFixed(2)}°`
  );

  // Gate 12 should be just before 180°
  assert(
    Math.abs(pos12.angle - 174.375) < 1,
    `Gate 12 should be near 180° (South), got ${pos12.angle.toFixed(2)}°`
  );
});

test('East (3 o\'clock) has gates 46|6', () => {
  positioning.resetConfiguration();
  const pos46 = positioning.getWheelPosition(46, 1);
  const pos6 = positioning.getWheelPosition(6, 1);

  // With NWSE, Gate 46 should be at ~270° (which is East in counter-clockwise system)
  assert(
    Math.abs(pos46.angle - 270) < 1,
    `Gate 46 should be at ~270° (East in NWSE), got ${pos46.angle.toFixed(2)}°`
  );

  // Gate 6 should be just before 270°
  assert(
    Math.abs(pos6.angle - 264.375) < 1,
    `Gate 6 should be near 270° (East), got ${pos6.angle.toFixed(2)}°`
  );
});

// ============================================================================
// TEST GROUP 4: Visual Direction (Counter-Clockwise)
// ============================================================================

console.log('\nTEST GROUP 4: Visual Direction');
console.log('─'.repeat(80));
console.log();

test('NWSE means counter-clockwise visual movement', () => {
  positioning.resetConfiguration();

  // Following array order, we should encounter: West(90°) → South(180°) → East(270°) → North(360°/0°)
  // Which on a clock face is: 9 → 6 → 3 → 12 (counter-clockwise)

  const cardinalAngles = [
    { gate: 25, expectedAngle: 90, cardinal: 'West' },
    { gate: 15, expectedAngle: 180, cardinal: 'South' },
    { gate: 46, expectedAngle: 270, cardinal: 'East' },
    { gate: 10, expectedAngle: 0, cardinal: 'North' }
  ];

  // Verify they appear in increasing angle order (counter-clockwise mathematically)
  let previousAngle = -1;
  for (const { gate, expectedAngle, cardinal } of cardinalAngles) {
    const pos = positioning.getWheelPosition(gate, 1);
    assert(
      Math.abs(pos.angle - expectedAngle) < 1,
      `${cardinal} (Gate ${gate}) should be at ${expectedAngle}°, got ${pos.angle.toFixed(2)}°`
    );

    if (previousAngle >= 0 && expectedAngle > previousAngle) {
      assert(
        pos.angle > previousAngle,
        `Angles should increase in counter-clockwise order`
      );
    }
    previousAngle = pos.angle;
  }
});

test('Following array sequence moves counter-clockwise on clock face', () => {
  positioning.resetConfiguration();
  const config = new WheelConfiguration();

  // Get first few gates in sequence
  const firstGates = config.sequence.slice(0, 10);

  // Their angles should increase (counter-clockwise on clock face means increasing angles)
  let previousAngle = -1;
  for (const gate of firstGates) {
    const pos = positioning.getWheelPosition(gate, 1);

    if (previousAngle >= 0) {
      // Allow for wrap-around at 360°
      const increased = pos.angle > previousAngle || (previousAngle > 350 && pos.angle < 10);
      assert(
        increased,
        `Array progression should increase angles (counter-clockwise). ` +
        `Gate ${gate}: ${pos.angle.toFixed(2)}° should be > ${previousAngle.toFixed(2)}°`
      );
    }

    previousAngle = pos.angle;
  }
});

// ============================================================================
// TEST GROUP 5: Line-Level Precision
// ============================================================================

console.log('\nTEST GROUP 5: Line-Level Precision');
console.log('─'.repeat(80));
console.log();

test('Each line is exactly 0.9375° apart', () => {
  positioning.resetConfiguration();

  // Test several gates
  const testGates = [41, 10, 25, 15, 46];

  for (const gate of testGates) {
    for (let line = 1; line < 6; line++) {
      const pos1 = positioning.getWheelPosition(gate, line);
      const pos2 = positioning.getWheelPosition(gate, line + 1);

      const diff = Math.abs((pos2.angle - pos1.angle + 360) % 360 - 0.9375);

      assert(
        diff < 0.0001,
        `Gate ${gate} lines ${line}→${line+1} should be 0.9375° apart, ` +
        `got ${Math.abs(pos2.angle - pos1.angle).toFixed(6)}° (error: ${diff.toFixed(6)}°)`
      );
    }
  }
});

test('Total wheel spans 360° exactly', () => {
  const expectedTotal = 64 * 6 * 0.9375;
  assert(
    Math.abs(expectedTotal - 360) < 0.0001,
    `64 gates × 6 lines × 0.9375° should equal 360°, got ${expectedTotal}°`
  );
});

// ============================================================================
// TEST GROUP 6: Configuration Variants
// ============================================================================

console.log('\nTEST GROUP 6: Configuration Variants');
console.log('─'.repeat(80));
console.log();

test('Can load NESW configuration (clockwise)', () => {
  // This would test a clockwise configuration if it exists
  // For now, just verify we can create one programmatically

  const clockwiseConfig = new WheelConfiguration({
    cardinalProgression: 'NESW',
    northPosition: '10|11'
  });

  assert(
    clockwiseConfig.config.cardinalProgression === 'NESW',
    'Should accept NESW configuration'
  );
});

test('Can create centered cardinal position (not straddled)', () => {
  const centeredConfig = new WheelConfiguration({
    cardinalProgression: 'NWSE',
    northPosition: '10' // Centered, not straddled
  });

  assert(
    centeredConfig.config.northPosition === '10',
    'Should accept centered positioning'
  );
});

// ============================================================================
// TEST GROUP 7: Validation (Reject Invalid Configs)
// ============================================================================

console.log('\nTEST GROUP 7: Validation');
console.log('─'.repeat(80));
console.log();

test('Rejects invalid cardinal progression', () => {
  try {
    new WheelConfiguration({
      cardinalProgression: 'INVALID'
    });
    assert(false, 'Should have thrown error for invalid cardinal progression');
  } catch (error) {
    assert(true, 'Correctly rejected invalid cardinal progression');
  }
});

test('Rejects non-adjacent gates in straddled position', () => {
  try {
    new WheelConfiguration({
      cardinalProgression: 'NWSE',
      northPosition: '10|25' // Not adjacent in sequence
    });
    assert(false, 'Should have thrown error for non-adjacent gates');
  } catch (error) {
    assert(true, 'Correctly rejected non-adjacent gates in straddle');
  }
});

test('Rejects sequence with duplicate gates', () => {
  const invalidSequence = [41, 41, 13, ...]; // Duplicate 41

  try {
    new WheelConfiguration({
      cardinalProgression: 'NWSE',
      northPosition: '10|11',
      customSequence: invalidSequence
    });
    assert(false, 'Should have thrown error for duplicate gates');
  } catch (error) {
    assert(true, 'Correctly rejected duplicate gates');
  }
});

test('Rejects sequence with missing gates', () => {
  // Create sequence missing gate 42
  const invalidSequence = Array.from({length: 64}, (_, i) =>
    i < 41 ? i + 1 : i + 2
  );

  try {
    new WheelConfiguration({
      cardinalProgression: 'NWSE',
      northPosition: '10|11',
      customSequence: invalidSequence
    });
    assert(false, 'Should have thrown error for missing gates');
  } catch (error) {
    assert(true, 'Correctly rejected missing gates');
  }
});

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '═'.repeat(80));
console.log('TEST SUMMARY');
console.log('═'.repeat(80));
console.log(`Total Tests: ${passCount + failCount}`);
console.log(`Passed: ${passCount} ✅`);
console.log(`Failed: ${failCount} ❌`);
console.log(`Success Rate: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);
console.log();

if (failCount === 0) {
  console.log('🎉 ALL FUNDAMENTAL CONFIGURATION TESTS PASSED');
  console.log();
  console.log('These tests verify:');
  console.log('  ✅ Configuration structure is correct');
  console.log('  ✅ Default NWSE (counter-clockwise) configuration works');
  console.log('  ✅ Visual clock positions match configuration');
  console.log('  ✅ Line-level precision is maintained');
  console.log('  ✅ Invalid configurations are rejected');
  console.log();
  console.log('The configuration system is BULLETPROOF.');
  process.exit(0);
} else {
  console.log(`❌ ${failCount} FUNDAMENTAL TESTS FAILED`);
  console.log();
  console.log('CRITICAL: These tests MUST pass for the system to be reliable.');
  console.log('Fix the failures before proceeding with implementation.');
  process.exit(1);
}
*/

// Placeholder while awaiting SESSION-02 implementation
console.log('═'.repeat(80));
console.log('FUNDAMENTAL CONFIGURATION TESTS');
console.log('═'.repeat(80));
console.log();
console.log('⏳ Awaiting SESSION-02 implementation...');
console.log();
console.log('These tests will verify:');
console.log('  1. Configuration structure (3 mandatory fields)');
console.log('  2. Default NWSE configuration');
console.log('  3. Visual clock positions (N=12, W=9, S=6, E=3)');
console.log('  4. Counter-clockwise visual movement');
console.log('  5. Line-level precision (0.9375° per line)');
console.log('  6. Configuration variants (all 8 progressions)');
console.log('  7. Validation (reject invalid configs)');
console.log();
console.log('Uncomment test code after implementing WheelConfiguration class.');
console.log('═'.repeat(80));
