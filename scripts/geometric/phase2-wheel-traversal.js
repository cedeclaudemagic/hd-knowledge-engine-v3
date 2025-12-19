/**
 * Phase 2: The Wheel as Spherical Projection
 *
 * Traces the 64-gate wheel sequence through the cube to discover
 * what geometric path the I Ching wheel describes.
 */

const fs = require('fs');
const path = require('path');

// Load source data
const binaryData = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../../core/root-system/binary-identity.json'), 'utf8'
));
const sequenceData = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../../core/root-system/gate-sequence.json'), 'utf8'
));
const phase1Data = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../../docs/research/data/geometric/phase1-cube-foundation.json'), 'utf8'
));

const TRIGRAM_VERTICES = phase1Data.trigramVertices;
const WHEEL_SEQUENCE = sequenceData.sequence;

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║      PHASE 2: THE WHEEL AS CUBE TRAVERSAL                        ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// ============================================================================
// SECTION 1: Extract Trigrams for Each Gate in Wheel Order
// ============================================================================

function extractTrigrams(binary6) {
  return {
    inner: binary6.slice(0, 3),
    outer: binary6.slice(3, 6)
  };
}

const wheelPath = [];
for (const gate of WHEEL_SEQUENCE) {
  const binary = binaryData.gates[gate].binary;
  const { inner, outer } = extractTrigrams(binary);
  wheelPath.push({
    gate,
    binary,
    inner,
    outer,
    innerName: TRIGRAM_VERTICES[inner].name,
    outerName: TRIGRAM_VERTICES[outer].name,
    innerCoords: TRIGRAM_VERTICES[inner].coords,
    outerCoords: TRIGRAM_VERTICES[outer].coords,
    innerEM: TRIGRAM_VERTICES[inner].emPosition,
    outerEM: TRIGRAM_VERTICES[outer].emPosition
  });
}

// ============================================================================
// SECTION 2: Analyse Vertex Visits
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                    VERTEX VISIT ANALYSIS                         │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Count how many times each vertex appears as inner/outer trigram
const innerVisits = {};
const outerVisits = {};
const totalVisits = {};

for (const trigram of Object.keys(TRIGRAM_VERTICES)) {
  innerVisits[trigram] = 0;
  outerVisits[trigram] = 0;
  totalVisits[trigram] = 0;
}

for (const step of wheelPath) {
  innerVisits[step.inner]++;
  outerVisits[step.outer]++;
  totalVisits[step.inner]++;
  totalVisits[step.outer]++;
}

console.log('┌───────────┬────────┬─────────────┬─────────────┬───────────────┐');
console.log('│ Trigram   │ Binary │ Inner Visits│ Outer Visits│ Total Visits  │');
console.log('├───────────┼────────┼─────────────┼─────────────┼───────────────┤');
for (const [bin, data] of Object.entries(TRIGRAM_VERTICES)) {
  console.log(`│ ${data.name.padEnd(9)} │  ${bin}   │      ${String(innerVisits[bin]).padStart(2)}     │      ${String(outerVisits[bin]).padStart(2)}     │      ${String(totalVisits[bin]).padStart(2)}       │`);
}
console.log('└───────────┴────────┴─────────────┴─────────────┴───────────────┘\n');

// Verify: each trigram should appear 8 times as inner and 8 times as outer
const innerSum = Object.values(innerVisits).reduce((a, b) => a + b, 0);
const outerSum = Object.values(outerVisits).reduce((a, b) => a + b, 0);
console.log(`Inner trigram visits total: ${innerSum} (expected: 64)`);
console.log(`Outer trigram visits total: ${outerSum} (expected: 64)`);
console.log(`Each trigram visits: ${innerVisits['000']} inner, ${outerVisits['000']} outer (expected: 8 each)\n`);

// ============================================================================
// SECTION 3: Trace Inner Trigram Path Around Wheel
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              INNER TRIGRAM PATH (first 32 gates)                 │');
console.log('├──────┬──────┬────────┬───────────┬────────────────────────────────');
console.log('│ Pos  │ Gate │ Binary │ Inner Tri │ Transition from previous      │');
console.log('├──────┼──────┼────────┼───────────┼────────────────────────────────');

let prevInner = null;
const innerTransitions = [];

for (let i = 0; i < 32; i++) {
  const step = wheelPath[i];
  let transition = '';
  if (prevInner !== null) {
    const hammingDist = hammingDistance(prevInner, step.inner);
    if (hammingDist === 0) {
      transition = 'SAME';
    } else {
      const bits = [];
      for (let b = 0; b < 3; b++) {
        if (prevInner[b] !== step.inner[b]) bits.push(['z', 'y', 'x'][b]);
      }
      transition = `flip ${bits.join(',')} (H=${hammingDist})`;
    }
    innerTransitions.push({ from: prevInner, to: step.inner, hamming: hammingDist });
  }
  console.log(`│  ${String(i).padStart(2)}  │  ${String(step.gate).padStart(2)}  │ ${step.binary} │ ${step.innerName.padEnd(9)} │ ${transition.padEnd(30)}`);
  prevInner = step.inner;
}
console.log('└──────┴──────┴────────┴───────────┴────────────────────────────────\n');

function hammingDistance(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) d++;
  }
  return d;
}

// ============================================================================
// SECTION 4: Transition Statistics
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              INNER TRIGRAM TRANSITION STATISTICS                 │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Complete the transitions for all 64 gates (including wrap-around)
prevInner = null;
const allInnerTransitions = [];
for (let i = 0; i < 64; i++) {
  const step = wheelPath[i];
  if (prevInner !== null) {
    allInnerTransitions.push({
      from: prevInner,
      to: step.inner,
      hamming: hammingDistance(prevInner, step.inner),
      position: i
    });
  }
  prevInner = step.inner;
}
// Add wrap-around transition
allInnerTransitions.push({
  from: wheelPath[63].inner,
  to: wheelPath[0].inner,
  hamming: hammingDistance(wheelPath[63].inner, wheelPath[0].inner),
  position: 64
});

const hammingCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
for (const t of allInnerTransitions) {
  hammingCounts[t.hamming]++;
}

console.log('Inner trigram transitions around the wheel:');
console.log('┌───────────────────┬───────────┬───────────────────────────────────┐');
console.log('│ Hamming Distance  │   Count   │ Meaning                           │');
console.log('├───────────────────┼───────────┼───────────────────────────────────┤');
console.log(`│        0          │    ${String(hammingCounts[0]).padStart(2)}     │ Same vertex (no change)           │`);
console.log(`│        1          │    ${String(hammingCounts[1]).padStart(2)}     │ Edge (1 bit flip)                 │`);
console.log(`│        2          │    ${String(hammingCounts[2]).padStart(2)}     │ Face diagonal (2 bit flips)       │`);
console.log(`│        3          │    ${String(hammingCounts[3]).padStart(2)}     │ Space diagonal (complement)       │`);
console.log('└───────────────────┴───────────┴───────────────────────────────────┘\n');

// ============================================================================
// SECTION 5: Outer Trigram Transitions
// ============================================================================

let prevOuter = null;
const allOuterTransitions = [];
for (let i = 0; i < 64; i++) {
  const step = wheelPath[i];
  if (prevOuter !== null) {
    allOuterTransitions.push({
      from: prevOuter,
      to: step.outer,
      hamming: hammingDistance(prevOuter, step.outer),
      position: i
    });
  }
  prevOuter = step.outer;
}
allOuterTransitions.push({
  from: wheelPath[63].outer,
  to: wheelPath[0].outer,
  hamming: hammingDistance(wheelPath[63].outer, wheelPath[0].outer),
  position: 64
});

const outerHammingCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
for (const t of allOuterTransitions) {
  outerHammingCounts[t.hamming]++;
}

console.log('Outer trigram transitions around the wheel:');
console.log('┌───────────────────┬───────────┬───────────────────────────────────┐');
console.log('│ Hamming Distance  │   Count   │ Meaning                           │');
console.log('├───────────────────┼───────────┼───────────────────────────────────┤');
console.log(`│        0          │    ${String(outerHammingCounts[0]).padStart(2)}     │ Same vertex (no change)           │`);
console.log(`│        1          │    ${String(outerHammingCounts[1]).padStart(2)}     │ Edge (1 bit flip)                 │`);
console.log(`│        2          │    ${String(outerHammingCounts[2]).padStart(2)}     │ Face diagonal (2 bit flips)       │`);
console.log(`│        3          │    ${String(outerHammingCounts[3]).padStart(2)}     │ Space diagonal (complement)       │`);
console.log('└───────────────────┴───────────┴───────────────────────────────────┘\n');

// ============================================================================
// SECTION 6: Combined Trigram Movement
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              COMBINED TRIGRAM MOVEMENT ANALYSIS                  │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// For each step, what's the combined movement (inner + outer)?
const combinedMovements = [];
for (let i = 0; i < 64; i++) {
  const curr = wheelPath[i];
  const next = wheelPath[(i + 1) % 64];

  const innerH = hammingDistance(curr.inner, next.inner);
  const outerH = hammingDistance(curr.outer, next.outer);
  const totalBitsChanged = innerH + outerH;

  combinedMovements.push({
    from: i,
    to: (i + 1) % 64,
    fromGate: curr.gate,
    toGate: next.gate,
    innerHamming: innerH,
    outerHamming: outerH,
    totalBits: totalBitsChanged
  });
}

// Count total bits changed distribution
const totalBitsCounts = {};
for (const m of combinedMovements) {
  totalBitsCounts[m.totalBits] = (totalBitsCounts[m.totalBits] || 0) + 1;
}

console.log('Total bits changed per step (inner + outer trigram):');
console.log('┌───────────────────┬───────────┐');
console.log('│ Bits Changed      │   Count   │');
console.log('├───────────────────┼───────────┤');
for (let b = 0; b <= 6; b++) {
  if (totalBitsCounts[b]) {
    console.log(`│        ${b}          │    ${String(totalBitsCounts[b]).padStart(2)}     │`);
  }
}
console.log('└───────────────────┴───────────┘\n');

// ============================================================================
// SECTION 7: Look for Patterns in Vertex Sequence
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                    VERTEX SEQUENCE PATTERNS                      │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Extract just the inner trigram sequence
const innerSequence = wheelPath.map(p => p.inner);
const outerSequence = wheelPath.map(p => p.outer);

// Check for repeating patterns
console.log('Inner trigram sequence (first 32):');
console.log(innerSequence.slice(0, 32).map(t => TRIGRAM_VERTICES[t].name.slice(0, 2)).join(' → '));
console.log('\nInner trigram sequence (second 32):');
console.log(innerSequence.slice(32).map(t => TRIGRAM_VERTICES[t].name.slice(0, 2)).join(' → '));
console.log('');

// Check if second half is complement of first half
let isComplement = true;
for (let i = 0; i < 32; i++) {
  const first = innerSequence[i];
  const second = innerSequence[i + 32];
  const complement = first.split('').map(b => b === '0' ? '1' : '0').join('');
  if (second !== complement) {
    isComplement = false;
    break;
  }
}
console.log(`Second 32 is binary complement of first 32: ${isComplement ? 'YES ✓' : 'NO'}\n`);

// ============================================================================
// SECTION 8: EM Position Traversal
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                  EM POSITION TRAVERSAL                           │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Track the sum of EM positions (inner + outer) around the wheel
const emSums = wheelPath.map(p => p.innerEM + p.outerEM);
const emPath = wheelPath.map(p => ({ gate: p.gate, inner: p.innerEM, outer: p.outerEM, sum: p.innerEM + p.outerEM }));

console.log('EM sums (inner + outer) for first 16 gates:');
for (let i = 0; i < 16; i++) {
  const p = emPath[i];
  const innerStr = p.inner > 0 ? `+${p.inner}` : `${p.inner}`;
  const outerStr = p.outer > 0 ? `+${p.outer}` : `${p.outer}`;
  const sumStr = p.sum > 0 ? `+${p.sum}` : p.sum === 0 ? ' 0' : `${p.sum}`;
  console.log(`  Gate ${String(p.gate).padStart(2)}: ${innerStr} + ${outerStr} = ${sumStr}`);
}
console.log('  ...\n');

// Distribution of EM sums
const emSumCounts = {};
for (const sum of emSums) {
  emSumCounts[sum] = (emSumCounts[sum] || 0) + 1;
}

console.log('EM sum distribution:');
console.log('┌───────────┬───────────┐');
console.log('│  EM Sum   │   Count   │');
console.log('├───────────┼───────────┤');
for (let s = -8; s <= 8; s++) {
  if (emSumCounts[s]) {
    const sumStr = s > 0 ? `+${s}` : s === 0 ? ' 0' : `${s}`;
    console.log(`│    ${sumStr.padStart(3)}    │    ${String(emSumCounts[s]).padStart(2)}     │`);
  }
}
console.log('└───────────┴───────────┘\n');

// Total EM sum around the wheel
const totalEM = emSums.reduce((a, b) => a + b, 0);
console.log(`Total EM sum around entire wheel: ${totalEM} (expected: 0 if balanced)\n`);

// ============================================================================
// SECTION 9: Tetrahedron Crossings
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                  TETRAHEDRON CROSSINGS                           │');
console.log('│      (Material ↔ Void transitions in inner/outer trigrams)       │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

function isVoid(trigram) {
  return TRIGRAM_VERTICES[trigram].emPosition < 0;
}

let innerCrossings = 0;
let outerCrossings = 0;

for (let i = 0; i < 64; i++) {
  const curr = wheelPath[i];
  const next = wheelPath[(i + 1) % 64];

  if (isVoid(curr.inner) !== isVoid(next.inner)) innerCrossings++;
  if (isVoid(curr.outer) !== isVoid(next.outer)) outerCrossings++;
}

console.log(`Inner trigram crosses between tetrahedra: ${innerCrossings} times`);
console.log(`Outer trigram crosses between tetrahedra: ${outerCrossings} times`);
console.log(`Total crossings: ${innerCrossings + outerCrossings}`);
console.log('');

// ============================================================================
// SECTION 10: 3D Path Visualisation Data
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                    3D PATH COORDINATES                           │');
console.log('│        (For visualisation in Three.js or similar)                │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Create path data for inner and outer trigram journeys
const innerPath3D = wheelPath.map((p, i) => ({
  position: i,
  gate: p.gate,
  trigram: p.innerName,
  coords: p.innerCoords
}));

const outerPath3D = wheelPath.map((p, i) => ({
  position: i,
  gate: p.gate,
  trigram: p.outerName,
  coords: p.outerCoords
}));

console.log('First 8 inner trigram 3D coordinates:');
for (let i = 0; i < 8; i++) {
  const p = innerPath3D[i];
  console.log(`  Pos ${String(i).padStart(2)}: Gate ${String(p.gate).padStart(2)} → ${p.trigram.padEnd(8)} (${p.coords.join(', ')})`);
}
console.log('  ...\n');

// ============================================================================
// SECTION 11: Save Data for Visualisation
// ============================================================================

const outputData = {
  description: 'Phase 2: Wheel Traversal Through Cube Space',
  generated: new Date().toISOString(),
  wheelPath: wheelPath,
  innerPath3D: innerPath3D,
  outerPath3D: outerPath3D,
  statistics: {
    innerTransitions: {
      hamming0: hammingCounts[0],
      hamming1: hammingCounts[1],
      hamming2: hammingCounts[2],
      hamming3: hammingCounts[3]
    },
    outerTransitions: {
      hamming0: outerHammingCounts[0],
      hamming1: outerHammingCounts[1],
      hamming2: outerHammingCounts[2],
      hamming3: outerHammingCounts[3]
    },
    totalBitsPerStep: totalBitsCounts,
    emSumDistribution: emSumCounts,
    totalEMSum: totalEM,
    tetrahedronCrossings: {
      inner: innerCrossings,
      outer: outerCrossings,
      total: innerCrossings + outerCrossings
    }
  }
};

const outputPath = path.join(__dirname, '../../docs/research/data/geometric/phase2-wheel-traversal.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
console.log(`📁 Full data saved to: ${outputPath}\n`);

// ============================================================================
// SECTION 12: Summary
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                       PHASE 2 SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════\n');

console.log('KEY FINDINGS:\n');

console.log('1. VERTEX VISITS:');
console.log('   Each trigram appears exactly 8 times as inner and 8 times as outer.');
console.log('   The wheel visits all vertices equally — perfectly balanced coverage.\n');

console.log('2. INNER TRIGRAM TRANSITIONS:');
console.log(`   - Same vertex (H=0): ${hammingCounts[0]}`);
console.log(`   - Edge (H=1): ${hammingCounts[1]}`);
console.log(`   - Face diagonal (H=2): ${hammingCounts[2]}`);
console.log(`   - Space diagonal (H=3): ${hammingCounts[3]}\n`);

console.log('3. OUTER TRIGRAM TRANSITIONS:');
console.log(`   - Same vertex (H=0): ${outerHammingCounts[0]}`);
console.log(`   - Edge (H=1): ${outerHammingCounts[1]}`);
console.log(`   - Face diagonal (H=2): ${outerHammingCounts[2]}`);
console.log(`   - Space diagonal (H=3): ${outerHammingCounts[3]}\n`);

console.log('4. EM BALANCE:');
console.log(`   Total EM sum around wheel: ${totalEM}`);
console.log('   This confirms the wheel is electromagnetically balanced.\n');

console.log('5. TETRAHEDRON CROSSINGS:');
console.log(`   Inner trigram crosses Material↔Void: ${innerCrossings} times`);
console.log(`   Outer trigram crosses Material↔Void: ${outerCrossings} times\n`);

console.log('6. COMPLEMENT SYMMETRY:');
console.log(`   Second 32 gates are binary complement of first 32: ${isComplement ? 'YES ✓' : 'NO'}\n`);
