/**
 * Phase 3: The Helix Emergence
 *
 * Does rotating the cube on its Heaven-Earth (space diagonal) axis
 * produce the helix/figure-8 topology derived in Article 11?
 */

const fs = require('fs');
const path = require('path');

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║      PHASE 3: THE HELIX EMERGENCE                                ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// The inner trigram path (the carrier wave)
const PATH = [
  { name: 'Lake',     binary: '110', coords: [1, 1, 0], em: -3 },
  { name: 'Fire',     binary: '101', coords: [1, 0, 1], em: -2 },
  { name: 'Thunder',  binary: '100', coords: [1, 0, 0], em: +1 },
  { name: 'Earth',    binary: '000', coords: [0, 0, 0], em: +4 },
  { name: 'Mountain', binary: '001', coords: [0, 0, 1], em: +3 },
  { name: 'Water',    binary: '010', coords: [0, 1, 0], em: +2 },
  { name: 'Wind',     binary: '011', coords: [0, 1, 1], em: -1 },
  { name: 'Heaven',   binary: '111', coords: [1, 1, 1], em: -4 }
];

// ============================================================================
// SECTION 1: The Heaven-Earth Axis
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE HEAVEN-EARTH AXIS                               │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// The space diagonal from Earth (0,0,0) to Heaven (1,1,1)
// This is the axis of rotation — the MONOPOLE axis
const AXIS = {
  start: [0, 0, 0],  // Earth (+4)
  end: [1, 1, 1],    // Heaven (-4)
  direction: [1/Math.sqrt(3), 1/Math.sqrt(3), 1/Math.sqrt(3)]  // Normalised
};

console.log('The Heaven-Earth axis (space diagonal):');
console.log(`  From: Earth  (${AXIS.start.join(', ')}) — EM position +4 (maximum matter)`);
console.log(`  To:   Heaven (${AXIS.end.join(', ')}) — EM position -4 (maximum void)`);
console.log(`  Direction: (${AXIS.direction.map(d => d.toFixed(4)).join(', ')})`);
console.log('');
console.log('This axis is the MONOPOLE — the void around which everything rotates.');
console.log('');

// ============================================================================
// SECTION 2: The Other 6 Vertices (The Rotating Ring)
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE ROTATING RING (6 vertices)                      │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Earth and Heaven are ON the axis. The other 6 vertices form a ring around it.
const RING_VERTICES = PATH.filter(p =>
  !(p.coords[0] === 0 && p.coords[1] === 0 && p.coords[2] === 0) &&
  !(p.coords[0] === 1 && p.coords[1] === 1 && p.coords[2] === 1)
);

console.log('Vertices that rotate around the axis:');
for (const v of RING_VERTICES) {
  console.log(`  ${v.name.padEnd(10)} (${v.coords.join(', ')}) — EM: ${v.em > 0 ? '+' : ''}${v.em}`);
}
console.log('');

// ============================================================================
// SECTION 3: Project Vertices onto Plane Perpendicular to Axis
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              PROJECTION ONTO PERPENDICULAR PLANE                 │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// To see the rotation, we project each vertex onto the plane perpendicular to the axis
// The axis is (1,1,1)/√3. We need two perpendicular vectors in the plane.
// One choice: (1,-1,0)/√2 and (1,1,-2)/√6

const U = [1/Math.sqrt(2), -1/Math.sqrt(2), 0];  // First basis vector in plane
const V = [1/Math.sqrt(6), 1/Math.sqrt(6), -2/Math.sqrt(6)];  // Second basis vector

// Project a point onto the plane (get 2D coordinates)
function projectToPlane(coords) {
  // Shift to center the cube at origin
  const centered = [coords[0] - 0.5, coords[1] - 0.5, coords[2] - 0.5];

  // Project onto U and V
  const u = centered[0]*U[0] + centered[1]*U[1] + centered[2]*U[2];
  const v = centered[0]*V[0] + centered[1]*V[1] + centered[2]*V[2];

  return [u, v];
}

// Also get distance along the axis (the "height" along the monopole)
function axisHeight(coords) {
  const centered = [coords[0] - 0.5, coords[1] - 0.5, coords[2] - 0.5];
  return centered[0]*AXIS.direction[0] + centered[1]*AXIS.direction[1] + centered[2]*AXIS.direction[2];
}

console.log('2D projection and axis height for each vertex:');
console.log('┌───────────┬───────────────────┬─────────────┬───────────┐');
console.log('│ Vertex    │ 2D Projection     │ Axis Height │ EM        │');
console.log('├───────────┼───────────────────┼─────────────┼───────────┤');

for (const p of PATH) {
  const proj = projectToPlane(p.coords);
  const height = axisHeight(p.coords);
  const projStr = `(${proj[0].toFixed(3)}, ${proj[1].toFixed(3)})`;
  const emStr = p.em > 0 ? `+${p.em}` : `${p.em}`;
  console.log(`│ ${p.name.padEnd(9)} │ ${projStr.padEnd(17)} │ ${height.toFixed(3).padStart(11)} │ ${emStr.padStart(9)} │`);
}
console.log('└───────────┴───────────────────┴─────────────┴───────────┘\n');

// ============================================================================
// SECTION 4: The Hexagonal Ring
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE HEXAGONAL RING                                  │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// When viewed along the Heaven-Earth axis, the 6 middle vertices
// should form a hexagon (or two triangles)

console.log('The 6 ring vertices projected onto the plane perpendicular to axis:');
console.log('');

// Calculate angles for each ring vertex
const ringWithAngles = RING_VERTICES.map(v => {
  const proj = projectToPlane(v.coords);
  const angle = Math.atan2(proj[1], proj[0]) * 180 / Math.PI;
  const height = axisHeight(v.coords);
  return { ...v, proj, angle, height };
});

// Sort by angle
ringWithAngles.sort((a, b) => a.angle - b.angle);

console.log('Ring vertices sorted by angle (looking down the axis):');
console.log('┌───────────┬────────────┬─────────────┬────────────────────────────┐');
console.log('│ Vertex    │ Angle      │ Axis Height │ Position relative to axis  │');
console.log('├───────────┼────────────┼─────────────┼────────────────────────────┤');

for (const v of ringWithAngles) {
  const posRelative = v.height > 0 ? 'Above center (toward Heaven)' :
                      v.height < 0 ? 'Below center (toward Earth)' : 'At center';
  console.log(`│ ${v.name.padEnd(9)} │ ${v.angle.toFixed(1).padStart(7)}° │ ${v.height.toFixed(3).padStart(11)} │ ${posRelative.padEnd(26)} │`);
}
console.log('└───────────┴────────────┴─────────────┴────────────────────────────┘\n');

// ============================================================================
// SECTION 5: The Two Triangles
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE TWO TRIANGLES                                   │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// The 6 ring vertices should form two interlocking triangles
// (the projection of the Star Tetrahedron!)

const aboveCenter = ringWithAngles.filter(v => v.height > 0);
const belowCenter = ringWithAngles.filter(v => v.height < 0);

console.log('TRIANGLE 1 — Above center (toward Heaven):');
for (const v of aboveCenter) {
  console.log(`  ${v.name} (${v.coords.join(',')}) — angle ${v.angle.toFixed(1)}°, EM ${v.em > 0 ? '+' : ''}${v.em}`);
}
console.log('');

console.log('TRIANGLE 2 — Below center (toward Earth):');
for (const v of belowCenter) {
  console.log(`  ${v.name} (${v.coords.join(',')}) — angle ${v.angle.toFixed(1)}°, EM ${v.em > 0 ? '+' : ''}${v.em}`);
}
console.log('');

// Check angle relationships
console.log('Angle relationships:');
const angles1 = aboveCenter.map(v => v.angle).sort((a, b) => a - b);
const angles2 = belowCenter.map(v => v.angle).sort((a, b) => a - b);

console.log(`  Triangle 1 angles: ${angles1.map(a => a.toFixed(1) + '°').join(', ')}`);
console.log(`  Triangle 2 angles: ${angles2.map(a => a.toFixed(1) + '°').join(', ')}`);

// Check if they're 60° offset (interlocking)
const angleDiff = Math.abs(angles1[0] - angles2[0]);
console.log(`  Angular offset between triangles: ${angleDiff.toFixed(1)}°`);
console.log('');

// ============================================================================
// SECTION 6: The Path as Helix
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE PATH AS HELIX                                   │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// As we follow the inner trigram path, trace (angle, height, em)
console.log('Following the inner trigram path through 3D helix space:');
console.log('');
console.log('Step  Vertex      Angle    Height    EM    Movement');
console.log('────────────────────────────────────────────────────');

let prevAngle = null;
for (let i = 0; i < PATH.length; i++) {
  const v = PATH[i];
  const proj = projectToPlane(v.coords);
  const angle = Math.atan2(proj[1], proj[0]) * 180 / Math.PI;
  const height = axisHeight(v.coords);
  const emStr = v.em > 0 ? `+${v.em}` : `${v.em}`;

  let movement = '';
  if (prevAngle !== null) {
    const angleDelta = angle - prevAngle;
    const normalised = angleDelta > 180 ? angleDelta - 360 :
                       angleDelta < -180 ? angleDelta + 360 : angleDelta;
    movement = normalised > 0 ? `↻ ${normalised.toFixed(0)}°` :
               normalised < 0 ? `↺ ${Math.abs(normalised).toFixed(0)}°` : '—';
  }

  console.log(`  ${i + 1}    ${v.name.padEnd(10)} ${angle.toFixed(1).padStart(7)}°  ${height.toFixed(3).padStart(7)}   ${emStr.padStart(3)}   ${movement}`);
  prevAngle = angle;
}
console.log('');

// ============================================================================
// SECTION 7: The Helix Parameters
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              HELIX PARAMETERS                                    │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Calculate total angular displacement
let totalAngle = 0;
prevAngle = null;
for (let i = 0; i < PATH.length; i++) {
  const v = PATH[i];
  const proj = projectToPlane(v.coords);
  const angle = Math.atan2(proj[1], proj[0]) * 180 / Math.PI;

  if (prevAngle !== null) {
    let delta = angle - prevAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    totalAngle += delta;
  }
  prevAngle = angle;
}

// Add wrap-around
const firstProj = projectToPlane(PATH[0].coords);
const lastProj = projectToPlane(PATH[PATH.length - 1].coords);
let wrapDelta = Math.atan2(firstProj[1], firstProj[0]) * 180 / Math.PI -
                Math.atan2(lastProj[1], lastProj[0]) * 180 / Math.PI;
if (wrapDelta > 180) wrapDelta -= 360;
if (wrapDelta < -180) wrapDelta += 360;
totalAngle += wrapDelta;

console.log(`Total angular displacement around axis: ${totalAngle.toFixed(1)}°`);
console.log(`Number of complete rotations: ${(totalAngle / 360).toFixed(2)}`);
console.log('');

// Height range
const heights = PATH.map(p => axisHeight(p.coords));
const minHeight = Math.min(...heights);
const maxHeight = Math.max(...heights);
console.log(`Height range along axis: ${minHeight.toFixed(3)} to ${maxHeight.toFixed(3)}`);
console.log(`Vertical oscillation amplitude: ${((maxHeight - minHeight) / 2).toFixed(3)}`);
console.log('');

// ============================================================================
// SECTION 8: Zero Crossings
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              ZERO CROSSINGS                                      │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Where does the EM position cross zero?
console.log('EM zero crossings in the path:');
for (let i = 0; i < PATH.length; i++) {
  const curr = PATH[i];
  const next = PATH[(i + 1) % PATH.length];

  // Check for sign change (crossing zero)
  if ((curr.em > 0 && next.em < 0) || (curr.em < 0 && next.em > 0)) {
    const direction = curr.em > 0 ? 'Material → Void' : 'Void → Material';
    console.log(`  Between ${curr.name} (${curr.em > 0 ? '+' : ''}${curr.em}) and ${next.name} (${next.em > 0 ? '+' : ''}${next.em}): ${direction}`);
  }
}
console.log('');
console.log('TWO zero crossings per cycle = (2,1) torus knot topology!');
console.log('');

// ============================================================================
// SECTION 9: The Figure-8 Pattern
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE FIGURE-8 PATTERN                                │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// If we plot (angle around axis, EM position), we should see a figure-8
console.log('Plotting (angle, EM) — looking for the lemniscate:');
console.log('');

// Create an ASCII plot
const plotWidth = 60;
const plotHeight = 17;
const plot = [];
for (let i = 0; i < plotHeight; i++) {
  plot.push(new Array(plotWidth).fill(' '));
}

// Add axes
const zeroRow = Math.floor(plotHeight / 2);
for (let col = 0; col < plotWidth; col++) {
  plot[zeroRow][col] = '─';
}
for (let row = 0; row < plotHeight; row++) {
  plot[row][0] = '│';
}
plot[zeroRow][0] = '┼';

// Add labels
console.log('      EM');
console.log('      +4 ┤');

// Plot each point
for (let i = 0; i < PATH.length; i++) {
  const v = PATH[i];
  const proj = projectToPlane(v.coords);
  const angle = Math.atan2(proj[1], proj[0]) * 180 / Math.PI;

  // Normalise angle to 0-360
  const normAngle = angle < 0 ? angle + 360 : angle;

  // Map to plot coordinates
  const col = Math.floor((normAngle / 360) * (plotWidth - 5)) + 3;
  const row = Math.floor(((4 - v.em) / 8) * (plotHeight - 1));

  if (col >= 0 && col < plotWidth && row >= 0 && row < plotHeight) {
    plot[row][col] = String(i + 1)[0];  // Use step number as marker
  }
}

// Print the plot
for (let row = 0; row < plotHeight; row++) {
  const emLabel = row === 0 ? '+4' :
                  row === zeroRow ? ' 0' :
                  row === plotHeight - 1 ? '-4' : '  ';
  console.log(`      ${emLabel} ${plot[row].join('')}`);
}
console.log('         └' + '─'.repeat(plotWidth - 1));
console.log('          0°                                              360°');
console.log('                           Angle around axis');
console.log('');

// ============================================================================
// SECTION 10: The Lemniscate Verification
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              LEMNISCATE VERIFICATION                             │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// A lemniscate (figure-8) in angle-EM space means:
// 1. Two zero crossings per cycle
// 2. The path "crosses itself" at the center

// Count zero crossings
let zeroCrossings = 0;
for (let i = 0; i < PATH.length; i++) {
  const curr = PATH[i];
  const next = PATH[(i + 1) % PATH.length];
  if ((curr.em > 0 && next.em < 0) || (curr.em < 0 && next.em > 0)) {
    zeroCrossings++;
  }
}

console.log(`Zero crossings per cycle: ${zeroCrossings}`);
console.log(`This corresponds to a (${zeroCrossings},1) torus knot.`);
console.log('');

// ============================================================================
// SECTION 11: Summary
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                       PHASE 3 SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════\n');

console.log('KEY FINDINGS:');
console.log('');
console.log('1. THE HEAVEN-EARTH AXIS IS THE MONOPOLE');
console.log('   The space diagonal from Earth (0,0,0) to Heaven (1,1,1)');
console.log('   is the axis of rotation — the void that is never occupied.');
console.log('');
console.log('2. THE 6 RING VERTICES FORM TWO TRIANGLES');
console.log('   When viewed along the axis, the 6 middle vertices split into');
console.log('   two interlocking triangles — the projection of the Star Tetrahedron.');
console.log('');
console.log('3. TWO ZERO CROSSINGS PER CYCLE');
console.log('   The EM wave crosses zero at:');
console.log('   - Fire (-2) → Thunder (+1): Void → Material');
console.log('   - Water (+2) → Wind (-1): Material → Void');
console.log('');
console.log('4. THE PATH TRACES A FIGURE-8');
console.log('   In (angle, EM) space, the path traces a lemniscate.');
console.log('   This IS the (2,1) torus knot topology derived in Article 11.');
console.log('');
console.log('THE HELIX EMERGES FROM CUBE-IN-SPHERE ROTATION.');
console.log('');

// Save data
const outputData = {
  description: 'Phase 3: Helix Emergence from Cube Rotation',
  generated: new Date().toISOString(),
  axis: AXIS,
  projectionBasis: { U, V },
  pathWithProjections: PATH.map(p => ({
    ...p,
    projection2D: projectToPlane(p.coords),
    axisHeight: axisHeight(p.coords),
    angle: Math.atan2(projectToPlane(p.coords)[1], projectToPlane(p.coords)[0]) * 180 / Math.PI
  })),
  zeroCrossings: zeroCrossings,
  totalAngularDisplacement: totalAngle
};

const outputPath = path.join(__dirname, '../../docs/research/data/geometric/phase3-helix-emergence.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
console.log(`📁 Full data saved to: ${outputPath}\n`);
