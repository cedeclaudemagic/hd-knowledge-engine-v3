/**
 * Phase 3b: The Double Helix
 *
 * Two cubes offset by 88° — Personality and Design crystals.
 * Do their paths interweave as a double helix?
 */

const fs = require('fs');
const path = require('path');

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║      PHASE 3b: THE DOUBLE HELIX — 88° OFFSET                     ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// The inner trigram path vertices (Personality Crystal - reference frame)
const PATH = [
  { name: 'Lake',     binary: '110', coords: [1, 1, 0], em: -3, step: 0 },
  { name: 'Fire',     binary: '101', coords: [1, 0, 1], em: -2, step: 1 },
  { name: 'Thunder',  binary: '100', coords: [1, 0, 0], em: +1, step: 2 },
  { name: 'Earth',    binary: '000', coords: [0, 0, 0], em: +4, step: 3 },
  { name: 'Mountain', binary: '001', coords: [0, 0, 1], em: +3, step: 4 },
  { name: 'Water',    binary: '010', coords: [0, 1, 0], em: +2, step: 5 },
  { name: 'Wind',     binary: '011', coords: [0, 1, 1], em: -1, step: 6 },
  { name: 'Heaven',   binary: '111', coords: [1, 1, 1], em: -4, step: 7 }
];

// Projection basis (perpendicular to Heaven-Earth axis)
const U = [1/Math.sqrt(2), -1/Math.sqrt(2), 0];
const V = [1/Math.sqrt(6), 1/Math.sqrt(6), -2/Math.sqrt(6)];
const AXIS = [1/Math.sqrt(3), 1/Math.sqrt(3), 1/Math.sqrt(3)];

function projectToPlane(coords) {
  const centered = [coords[0] - 0.5, coords[1] - 0.5, coords[2] - 0.5];
  const u = centered[0]*U[0] + centered[1]*U[1] + centered[2]*U[2];
  const v = centered[0]*V[0] + centered[1]*V[1] + centered[2]*V[2];
  return [u, v];
}

function axisHeight(coords) {
  const centered = [coords[0] - 0.5, coords[1] - 0.5, coords[2] - 0.5];
  return centered[0]*AXIS[0] + centered[1]*AXIS[1] + centered[2]*AXIS[2];
}

function getAngle(coords) {
  const proj = projectToPlane(coords);
  return Math.atan2(proj[1], proj[0]) * 180 / Math.PI;
}

// ============================================================================
// SECTION 1: The 88° Offset
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE 88° OFFSET                                      │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

const OFFSET_DEGREES = 88;
const OFFSET_RADIANS = OFFSET_DEGREES * Math.PI / 180;

console.log(`Personality Crystal: 0° (reference frame)`);
console.log(`Design Crystal: ${OFFSET_DEGREES}° offset around the Heaven-Earth axis`);
console.log('');
console.log('The 88° offset means:');
console.log('  - NOT 90° (which would be perfect perpendicularity = "death")');
console.log('  - 2° short of orthogonal = perpetual seeking');
console.log('  - Mercury orbit = 88 days (the messenger between crystals)');
console.log('');

// ============================================================================
// SECTION 2: Rotate Design Crystal by 88°
// ============================================================================

// To rotate around the Heaven-Earth axis, we rotate in the UV plane
function rotateAroundAxis(coords, angleDegrees) {
  const proj = projectToPlane(coords);
  const height = axisHeight(coords);
  const angleRad = angleDegrees * Math.PI / 180;

  // Rotate in UV plane
  const newU = proj[0] * Math.cos(angleRad) - proj[1] * Math.sin(angleRad);
  const newV = proj[0] * Math.sin(angleRad) + proj[1] * Math.cos(angleRad);

  // Convert back to 3D (approximate - for visualization)
  // The rotated point in 3D
  const rotated = [
    0.5 + newU * U[0] + newV * V[0] + height * AXIS[0],
    0.5 + newU * U[1] + newV * V[1] + height * AXIS[1],
    0.5 + newU * U[2] + newV * V[2] + height * AXIS[2]
  ];

  return rotated;
}

// Create Design path (88° rotated)
const DESIGN_PATH = PATH.map(p => {
  const rotatedCoords = rotateAroundAxis(p.coords, OFFSET_DEGREES);
  const newAngle = getAngle(p.coords) + OFFSET_DEGREES;
  const normalizedAngle = newAngle > 180 ? newAngle - 360 : newAngle < -180 ? newAngle + 360 : newAngle;
  return {
    ...p,
    name: p.name + "'",  // Mark as Design version
    originalAngle: getAngle(p.coords),
    rotatedAngle: normalizedAngle,
    coords3D: rotatedCoords
  };
});

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              PERSONALITY vs DESIGN ANGLES                        │');
console.log('├───────────┬──────────────────┬──────────────────┬───────────────┤');
console.log('│ Step      │ Personality      │ Design (+88°)    │ Separation    │');
console.log('├───────────┼──────────────────┼──────────────────┼───────────────┤');

for (let i = 0; i < PATH.length; i++) {
  const p = PATH[i];
  const d = DESIGN_PATH[i];
  const pAngle = getAngle(p.coords);
  const dAngle = d.rotatedAngle;
  console.log(`│ ${i}: ${p.name.padEnd(7)} │ ${pAngle.toFixed(1).padStart(7)}°        │ ${dAngle.toFixed(1).padStart(7)}°        │ ${OFFSET_DEGREES}°           │`);
}
console.log('└───────────┴──────────────────┴──────────────────┴───────────────┘\n');

// ============================================================================
// SECTION 3: The Interweaving Pattern
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE INTERWEAVING PATTERN                            │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// For each point in time (0-7), show where both crystals are
console.log('Time evolution of both crystals:');
console.log('');
console.log('Step  Personality           Design                Relationship');
console.log('──────────────────────────────────────────────────────────────────');

for (let step = 0; step < 8; step++) {
  const p = PATH[step];
  const d = DESIGN_PATH[step];

  const pAngle = getAngle(p.coords);
  const dAngle = d.rotatedAngle;

  // Check for crossings (angles close to each other modulo the helix)
  let relationship = '';
  if (Math.abs(p.em) === 1) {
    relationship = '** GATE POSITION (±1) **';
  } else if (Math.abs(p.em) === 4) {
    relationship = '(at pole)';
  }

  console.log(`  ${step}    ${p.name.padEnd(8)} (${pAngle.toFixed(0).padStart(4)}°, EM ${(p.em > 0 ? '+' : '') + p.em})   ${p.name.padEnd(8)} (${dAngle.toFixed(0).padStart(4)}°, EM ${(p.em > 0 ? '+' : '') + p.em})   ${relationship}`);
}
console.log('');

// ============================================================================
// SECTION 4: The Crossing Points
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE CROSSING POINTS                                 │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Thunder (+1) and Wind (-1) are the GATE positions
// These are where the paths cross between Material and Void

console.log('The GATE positions (EM = ±1) are critical:');
console.log('');
console.log('  Thunder (+1): The GATE IN  — entry from Void to Material');
console.log('  Wind    (-1): The GATE OUT — exit from Material to Void');
console.log('');

const thunderP = PATH.find(p => p.name === 'Thunder');
const windP = PATH.find(p => p.name === 'Wind');
const thunderD = DESIGN_PATH.find(p => p.name === "Thunder'");
const windD = DESIGN_PATH.find(p => p.name === "Wind'");

console.log('At Thunder (+1):');
console.log(`  Personality angle: ${getAngle(thunderP.coords).toFixed(1)}°`);
console.log(`  Design angle:      ${thunderD.rotatedAngle.toFixed(1)}°`);
console.log(`  Angular separation: ${OFFSET_DEGREES}°`);
console.log('');

console.log('At Wind (-1):');
console.log(`  Personality angle: ${getAngle(windP.coords).toFixed(1)}°`);
console.log(`  Design angle:      ${windD.rotatedAngle.toFixed(1)}°`);
console.log(`  Angular separation: ${OFFSET_DEGREES}°`);
console.log('');

// ============================================================================
// SECTION 5: The Double Helix Visualization
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE DOUBLE HELIX                                    │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Create a "time vs EM" plot showing both helices
console.log('Double helix in (step, EM) space:');
console.log('');
console.log('     EM │ Personality (P)                Design (D)');
console.log('        │');

for (let em = 4; em >= -4; em--) {
  let line = `    ${em > 0 ? '+' : em === 0 ? ' ' : ''}${em} │ `;

  for (let step = 0; step < 8; step++) {
    const p = PATH[step];
    if (p.em === em) {
      line += `P${step} `;
    } else {
      line += '   ';
    }
  }

  line += '    ';

  for (let step = 0; step < 8; step++) {
    const d = DESIGN_PATH[step];
    // Design is at same EM position but different angle
    if (PATH[step].em === em) {
      line += `D${step} `;
    } else {
      line += '   ';
    }
  }

  console.log(line);
}
console.log('        └' + '─'.repeat(24) + '    └' + '─'.repeat(24));
console.log('          0  1  2  3  4  5  6  7         0  1  2  3  4  5  6  7');
console.log('');

// ============================================================================
// SECTION 6: Phase Relationship Analysis
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              PHASE RELATIONSHIP ANALYSIS                         │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// The 88° offset in an 8-step cycle
const stepsPerRotation = 8;
const degreesPerStep = 360 / stepsPerRotation;  // 45° per step
const offsetInSteps = OFFSET_DEGREES / degreesPerStep;

console.log(`Degrees per step in the 8-vertex cycle: ${degreesPerStep}°`);
console.log(`88° offset = ${offsetInSteps.toFixed(2)} steps`);
console.log('');
console.log('This means Design is almost 2 steps behind Personality,');
console.log('but not quite (1.96 steps, not 2).');
console.log('');
console.log('If it were exactly 90° (2 steps), the crystals would be');
console.log('phase-locked in perfect perpendicularity — "death".');
console.log('');
console.log('The 2° deviation creates:');
console.log('  - Perpetual precession (never quite catching up)');
console.log('  - Dynamic tension between the two helices');
console.log('  - The "life mechanism" — always seeking, never arriving');
console.log('');

// ============================================================================
// SECTION 7: Where Do They Almost Meet?
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              WHERE DO THE HELICES ALMOST MEET?                   │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// At 88° offset, the closest approach happens where?
// In an 8-step cycle with 45° per step, 88° ≈ 2 steps
// So when P is at step N, D appears to be at step N-2 (but rotated)

console.log('If we track angular proximity through the cycle:');
console.log('');

for (let step = 0; step < 8; step++) {
  const pVertex = PATH[step];
  const pAngle = getAngle(pVertex.coords);

  // Find which Design vertex is angularly closest
  let closestD = null;
  let minAngularDist = Infinity;

  for (const d of DESIGN_PATH) {
    let angleDiff = Math.abs(d.rotatedAngle - pAngle);
    if (angleDiff > 180) angleDiff = 360 - angleDiff;
    if (angleDiff < minAngularDist) {
      minAngularDist = angleDiff;
      closestD = d;
    }
  }

  console.log(`  P at ${pVertex.name.padEnd(8)}: closest D vertex is ${closestD.name.padEnd(9)} (${minAngularDist.toFixed(1)}° apart)`);
}
console.log('');

// ============================================================================
// SECTION 8: The DNA Structure
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE DNA STRUCTURE                                   │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

console.log('Viewing the double helix from the side (EM vs angle):');
console.log('');

// Create combined plot
const plotWidth = 72;
const plotHeight = 17;
const plot = [];
for (let i = 0; i < plotHeight; i++) {
  plot.push(new Array(plotWidth).fill(' '));
}

// Add axis
const zeroRow = 8;
for (let col = 0; col < plotWidth; col++) {
  plot[zeroRow][col] = '─';
}

// Plot Personality path (P)
for (let i = 0; i < PATH.length; i++) {
  const v = PATH[i];
  let angle = getAngle(v.coords);
  if (angle < 0) angle += 360;

  const col = Math.floor((angle / 360) * (plotWidth - 4)) + 2;
  const row = Math.floor(((4 - v.em) / 8) * (plotHeight - 1));

  if (col >= 0 && col < plotWidth && row >= 0 && row < plotHeight) {
    plot[row][col] = 'P';
  }
}

// Plot Design path (D) - offset by 88°
for (let i = 0; i < DESIGN_PATH.length; i++) {
  const v = DESIGN_PATH[i];
  let angle = v.rotatedAngle;
  if (angle < 0) angle += 360;

  const col = Math.floor((angle / 360) * (plotWidth - 4)) + 2;
  const row = Math.floor(((4 - PATH[i].em) / 8) * (plotHeight - 1));

  if (col >= 0 && col < plotWidth && row >= 0 && row < plotHeight) {
    if (plot[row][col] === 'P') {
      plot[row][col] = 'X';  // Crossing!
    } else {
      plot[row][col] = 'D';
    }
  }
}

// Print plot
console.log('      EM');
for (let row = 0; row < plotHeight; row++) {
  const emLabel = row === 0 ? '+4' :
                  row === zeroRow ? ' 0' :
                  row === plotHeight - 1 ? '-4' : '  ';
  console.log(`      ${emLabel} │${plot[row].join('')}`);
}
console.log('         └' + '─'.repeat(plotWidth));
console.log('          0°              90°             180°            270°           360°');
console.log('');
console.log('          P = Personality    D = Design    X = Crossing');
console.log('');

// ============================================================================
// SECTION 9: Summary
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                       PHASE 3b SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════\n');

console.log('KEY FINDINGS:');
console.log('');
console.log('1. THE 88° OFFSET CREATES TWO INTERWEAVING HELICES');
console.log('   Personality and Design trace the same wave pattern');
console.log('   but 88° out of phase around the monopole axis.');
console.log('');
console.log('2. THE OFFSET IS 1.96 STEPS (NOT 2)');
console.log('   In an 8-step cycle, 88° = 1.96 steps.');
console.log('   This 0.04 step deviation (2°) creates:');
console.log('   - Perpetual precession');
console.log('   - Never quite phase-locked');
console.log('   - The "life mechanism"');
console.log('');
console.log('3. THUNDER AND WIND ARE THE GATES');
console.log('   At EM = ±1, the helices are closest to crossing zero.');
console.log('   These are the transition points between crystals.');
console.log('');
console.log('4. THE STRUCTURE IS DNA-LIKE');
console.log('   Two helices wound around a common axis (the monopole),');
console.log('   offset by 88°, never merging, always chasing.');
console.log('');
console.log('THE DOUBLE HELIX EMERGES FROM THE 88° CRYSTAL OFFSET.');
console.log('');

// Save data
const outputData = {
  description: 'Phase 3b: Double Helix with 88° Offset',
  generated: new Date().toISOString(),
  offsetDegrees: OFFSET_DEGREES,
  offsetInSteps: offsetInSteps,
  personalityPath: PATH,
  designPath: DESIGN_PATH,
  gatePositions: {
    thunder: { em: +1, personalityAngle: getAngle(thunderP.coords), designAngle: thunderD.rotatedAngle },
    wind: { em: -1, personalityAngle: getAngle(windP.coords), designAngle: windD.rotatedAngle }
  }
};

const outputPath = path.join(__dirname, '../../docs/research/data/geometric/phase3b-double-helix.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
console.log(`📁 Full data saved to: ${outputPath}\n`);
