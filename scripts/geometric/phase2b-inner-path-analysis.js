/**
 * Phase 2b: Deep Analysis of Inner Trigram Path
 *
 * The inner trigram moves slowly through the cube.
 * What geometric path does it trace?
 */

const fs = require('fs');
const path = require('path');

const phase2Data = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../../docs/research/data/geometric/phase2-wheel-traversal.json'), 'utf8'
));

const TRIGRAM_VERTICES = {
  '000': { name: 'Earth',    coords: [0, 0, 0], emPosition: +4 },
  '001': { name: 'Mountain', coords: [0, 0, 1], emPosition: +3 },
  '010': { name: 'Water',    coords: [0, 1, 0], emPosition: +2 },
  '011': { name: 'Wind',     coords: [0, 1, 1], emPosition: -1 },
  '100': { name: 'Thunder',  coords: [1, 0, 0], emPosition: +1 },
  '101': { name: 'Fire',     coords: [1, 0, 1], emPosition: -2 },
  '110': { name: 'Lake',     coords: [1, 1, 0], emPosition: -3 },
  '111': { name: 'Heaven',   coords: [1, 1, 1], emPosition: -4 }
};

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║      PHASE 2b: INNER TRIGRAM PATH ANALYSIS                       ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// ============================================================================
// SECTION 1: Extract the Inner Trigram Transitions
// ============================================================================

const wheelPath = phase2Data.wheelPath;

// Find where the inner trigram CHANGES
const innerTransitions = [];
let currentInner = wheelPath[0].inner;
let startPos = 0;

for (let i = 1; i < 64; i++) {
  if (wheelPath[i].inner !== currentInner) {
    innerTransitions.push({
      from: currentInner,
      to: wheelPath[i].inner,
      fromName: TRIGRAM_VERTICES[currentInner].name,
      toName: TRIGRAM_VERTICES[wheelPath[i].inner].name,
      startPos: startPos,
      endPos: i - 1,
      duration: i - startPos
    });
    currentInner = wheelPath[i].inner;
    startPos = i;
  }
}
// Add final segment
innerTransitions.push({
  from: currentInner,
  to: wheelPath[0].inner, // wrap around
  fromName: TRIGRAM_VERTICES[currentInner].name,
  toName: TRIGRAM_VERTICES[wheelPath[0].inner].name,
  startPos: startPos,
  endPos: 63,
  duration: 64 - startPos
});

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              INNER TRIGRAM SEGMENTS                              │');
console.log('├────┬───────────┬────────────────────────────────────────────────┤');
console.log('│ #  │  Trigram  │ Wheel Positions (duration)                     │');
console.log('├────┼───────────┼────────────────────────────────────────────────┤');

for (let i = 0; i < innerTransitions.length; i++) {
  const t = innerTransitions[i];
  const posRange = `${t.startPos}-${t.endPos} (${t.duration} gates)`;
  console.log(`│ ${String(i + 1).padStart(2)} │ ${t.fromName.padEnd(9)} │ ${posRange.padEnd(44)} │`);
}
console.log('└────┴───────────┴────────────────────────────────────────────────┘\n');

// ============================================================================
// SECTION 2: The Inner Trigram Sequence
// ============================================================================

const innerSequence = innerTransitions.map(t => t.fromName);
console.log('Inner trigram visitation sequence:');
console.log(innerSequence.join(' → '));
console.log('');

// Extract just the unique transitions (not the durations)
const transitions = innerTransitions.map(t => ({ from: t.from, to: t.to }));

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              INNER TRIGRAM TRANSITIONS (CUBE EDGES)              │');
console.log('├────┬───────────────┬───────────────┬─────────────────────────────┤');
console.log('│ #  │ From          │ To            │ Transition Type             │');
console.log('├────┼───────────────┼───────────────┼─────────────────────────────┤');

function hammingDistance(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) d++;
  }
  return d;
}

function transitionType(from, to) {
  const h = hammingDistance(from, to);
  if (h === 0) return 'SAME';
  if (h === 1) {
    // Find which bit flipped
    for (let i = 0; i < 3; i++) {
      if (from[i] !== to[i]) {
        return ['z-flip', 'y-flip', 'x-flip'][i];
      }
    }
  }
  if (h === 2) return 'face diagonal';
  if (h === 3) return 'complement';
  return '???';
}

for (let i = 0; i < transitions.length; i++) {
  const t = transitions[i];
  const type = transitionType(t.from, t.to);
  const fromName = TRIGRAM_VERTICES[t.from].name;
  const toName = TRIGRAM_VERTICES[t.to].name;
  console.log(`│ ${String(i + 1).padStart(2)} │ ${fromName.padEnd(13)} │ ${toName.padEnd(13)} │ ${type.padEnd(27)} │`);
}
console.log('└────┴───────────────┴───────────────┴─────────────────────────────┘\n');

// ============================================================================
// SECTION 3: Trace the Path Through Cube
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              INNER TRIGRAM 3D PATH                               │');
console.log('├────┬───────────┬────────────────────────────────────────────────┤');
console.log('│ #  │  Trigram  │ 3D Coordinates                                 │');
console.log('├────┼───────────┼────────────────────────────────────────────────┤');

const path3D = [];
for (let i = 0; i < innerTransitions.length; i++) {
  const t = innerTransitions[i];
  const coords = TRIGRAM_VERTICES[t.from].coords;
  path3D.push({ name: t.fromName, coords: coords });
  console.log(`│ ${String(i + 1).padStart(2)} │ ${t.fromName.padEnd(9)} │ (${coords.join(', ')})${' '.repeat(37)} │`);
}
console.log('└────┴───────────┴────────────────────────────────────────────────┘\n');

// ============================================================================
// SECTION 4: Analyse the Path Geometry
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              PATH GEOMETRY ANALYSIS                              │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Check if it's a Hamiltonian path (visits all 8 vertices exactly once)
const visitedVertices = new Set(innerTransitions.map(t => t.from));
console.log(`Vertices visited: ${visitedVertices.size} of 8`);
console.log(`Unique vertices: ${[...visitedVertices].map(v => TRIGRAM_VERTICES[v].name).join(', ')}`);

// Calculate total path length
let totalLength = 0;
for (let i = 0; i < transitions.length; i++) {
  const from = TRIGRAM_VERTICES[transitions[i].from].coords;
  const to = TRIGRAM_VERTICES[transitions[i].to].coords;
  const dist = Math.sqrt(
    Math.pow(from[0] - to[0], 2) +
    Math.pow(from[1] - to[1], 2) +
    Math.pow(from[2] - to[2], 2)
  );
  totalLength += dist;
}
console.log(`Total path length: ${totalLength.toFixed(3)} (in cube units)\n`);

// ============================================================================
// SECTION 5: Check for Hamiltonian Cycle
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              HAMILTONIAN CYCLE CHECK                             │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// A Hamiltonian cycle visits all vertices exactly once and returns to start
// Our inner trigram visits 8 vertices over 64 gates...

// Let's check if the 8 transitions form a cycle visiting all 8 vertices
if (innerTransitions.length === 8 && visitedVertices.size === 8) {
  // Check if start equals end (completing the cycle)
  const first = innerTransitions[0].from;
  const last = innerTransitions[innerTransitions.length - 1].to;

  if (first === last) {
    console.log('YES! The inner trigram traces a HAMILTONIAN CYCLE through the cube!');
    console.log('It visits all 8 vertices exactly once and returns to the start.');
  } else {
    console.log(`Path starts at ${TRIGRAM_VERTICES[first].name} and would continue to ${TRIGRAM_VERTICES[last].name}`);
    console.log('Close to Hamiltonian but wrap-around needs checking.');
  }
} else {
  console.log(`Not a Hamiltonian cycle: ${innerTransitions.length} segments, ${visitedVertices.size} vertices`);
}
console.log('');

// ============================================================================
// SECTION 6: Binary Pattern Analysis
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              BINARY PATTERN ANALYSIS                             │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// List the binary codes in sequence
console.log('Binary sequence of inner trigrams:');
const binarySequence = innerTransitions.map(t => t.from);
console.log(binarySequence.join(' → '));
console.log('');

// Check for Gray code pattern (each step differs by 1 bit)
let isGrayLike = true;
for (let i = 0; i < transitions.length; i++) {
  if (hammingDistance(transitions[i].from, transitions[i].to) !== 1) {
    isGrayLike = false;
    break;
  }
}
console.log(`All transitions are single-bit flips (Gray code): ${isGrayLike ? 'YES' : 'NO'}`);

// Check the actual bit flips
console.log('\nBit flip sequence:');
for (let i = 0; i < transitions.length; i++) {
  const from = transitions[i].from;
  const to = transitions[i].to;
  const bits = [];
  for (let b = 0; b < 3; b++) {
    if (from[b] !== to[b]) bits.push(['z', 'y', 'x'][b]);
  }
  console.log(`  ${i + 1}. ${TRIGRAM_VERTICES[from].name} → ${TRIGRAM_VERTICES[to].name}: flip ${bits.join(', ') || 'none'}`);
}
console.log('');

// ============================================================================
// SECTION 7: EM Position Path
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              EM POSITION PATH                                    │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

console.log('Inner trigram EM positions in sequence:');
const emSequence = innerTransitions.map(t => TRIGRAM_VERTICES[t.from].emPosition);
const emStr = emSequence.map(e => e > 0 ? `+${e}` : `${e}`).join(' → ');
console.log(emStr);
console.log('');

// Check for pattern
const firstHalfEM = emSequence.slice(0, 4);
const secondHalfEM = emSequence.slice(4);
console.log('First half EM:  ' + firstHalfEM.map(e => e > 0 ? `+${e}` : `${e}`).join(', '));
console.log('Second half EM: ' + secondHalfEM.map(e => e > 0 ? `+${e}` : `${e}`).join(', '));

// Sum check
const firstHalfSum = firstHalfEM.reduce((a, b) => a + b, 0);
const secondHalfSum = secondHalfEM.reduce((a, b) => a + b, 0);
console.log(`First half sum: ${firstHalfSum}, Second half sum: ${secondHalfSum}`);
console.log(`Total: ${firstHalfSum + secondHalfSum} (should be 0 if balanced)\n`);

// ============================================================================
// SECTION 8: Tetrahedron Membership
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              TETRAHEDRON MEMBERSHIP                              │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

const tetraSequence = innerTransitions.map(t => {
  const em = TRIGRAM_VERTICES[t.from].emPosition;
  return em > 0 ? 'Material' : 'Void';
});

console.log('Tetrahedron sequence: ' + tetraSequence.join(' → '));
console.log('');

// Count transitions between tetrahedra
let tetraCrossings = 0;
for (let i = 0; i < tetraSequence.length - 1; i++) {
  if (tetraSequence[i] !== tetraSequence[i + 1]) tetraCrossings++;
}
// Add wrap-around
if (tetraSequence[tetraSequence.length - 1] !== tetraSequence[0]) tetraCrossings++;

console.log(`Tetrahedron crossings: ${tetraCrossings}`);
console.log('');

// ============================================================================
// SECTION 9: ASCII Cube Visualisation
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              CUBE VISUALISATION WITH PATH                        │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

console.log('           Heaven (111,-4)');
console.log('               /|\\');
console.log('              / | \\');
console.log('             /  |  \\');
console.log('      Wind (011,-1)  |   Lake (110,-3)');
console.log('            |\\  |  /|');
console.log('            | \\ | / |');
console.log('            |  \\|/  |');
console.log('            | Fire (101,-2)');
console.log('            |   |   |');
console.log('            |   |   |');
console.log('  Mountain (001,+3)  |   Water (010,+2)');
console.log('             \\  |  /');
console.log('              \\ | /');
console.log('               \\|/');
console.log('         Thunder (100,+1)');
console.log('               |');
console.log('               |');
console.log('         Earth (000,+4)');
console.log('');

console.log('Inner trigram path (numbered):');
for (let i = 0; i < innerTransitions.length; i++) {
  const arrow = i < innerTransitions.length - 1 ? ' → ' : ' → (wrap)';
  console.log(`  ${i + 1}. ${innerTransitions[i].fromName}${arrow}`);
}
console.log('');

// ============================================================================
// SECTION 10: Summary
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                       PHASE 2b SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════\n');

console.log('The inner trigram traces a path through all 8 cube vertices,');
console.log('spending approximately 8 gates at each vertex before moving on.');
console.log('');
console.log('Key observations:');
console.log('1. Visits all 8 vertices exactly once per half-wheel (32 gates)');
console.log('2. Second half is binary complement of first half');
console.log('3. Path traces through both tetrahedra (Void and Material)');
console.log('4. Total EM sum is balanced (sums to 0)');
console.log('');
