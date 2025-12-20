/**
 * Penta Gates as Cube Edges Test
 *
 * Tests whether the 12 Penta gates correspond to the 12 cube edges
 * (Hamming distance 1 between inner and outer trigrams)
 *
 * The hypothesis: Penta extraction operates at the binary/phi interface,
 * touching the cube skeleton at edge midpoints.
 */

const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════');
console.log('  PENTA GATES AS CUBE EDGES TEST');
console.log('═══════════════════════════════════════════════════════════════');
console.log();

// =============================================================================
// SECTION 1: Data Setup
// =============================================================================

// Trigram binary patterns (bottom to top: line 1, 2, 3)
const TRIGRAMS = {
  'Earth':    [0, 0, 0],  // ☷ kun
  'Mountain': [0, 0, 1],  // ☶ gen
  'Water':    [0, 1, 0],  // ☵ kan
  'Wind':     [0, 1, 1],  // ☴ xun
  'Thunder':  [1, 0, 0],  // ☳ zhen
  'Fire':     [1, 0, 1],  // ☲ li
  'Lake':     [1, 1, 0],  // ☱ dui
  'Heaven':   [1, 1, 1],  // ☰ qian
};

// Reverse lookup
const BINARY_TO_TRIGRAM = {};
Object.entries(TRIGRAMS).forEach(([name, bits]) => {
  BINARY_TO_TRIGRAM[bits.join('')] = name;
});

// King Wen sequence gate to trigram mapping
// Format: gate number -> [inner trigram, outer trigram]
const GATE_TRIGRAMS = {
  1:  ['Heaven', 'Heaven'],
  2:  ['Earth', 'Earth'],
  3:  ['Water', 'Thunder'],
  4:  ['Mountain', 'Water'],
  5:  ['Water', 'Heaven'],
  6:  ['Heaven', 'Water'],
  7:  ['Earth', 'Water'],
  8:  ['Water', 'Earth'],
  9:  ['Wind', 'Heaven'],
  10: ['Heaven', 'Lake'],
  11: ['Earth', 'Heaven'],
  12: ['Heaven', 'Earth'],
  13: ['Heaven', 'Fire'],
  14: ['Fire', 'Heaven'],
  15: ['Earth', 'Mountain'],
  16: ['Thunder', 'Earth'],
  17: ['Lake', 'Thunder'],
  18: ['Mountain', 'Wind'],
  19: ['Earth', 'Lake'],
  20: ['Wind', 'Earth'],
  21: ['Fire', 'Thunder'],
  22: ['Mountain', 'Fire'],
  23: ['Mountain', 'Earth'],
  24: ['Earth', 'Thunder'],
  25: ['Heaven', 'Thunder'],
  26: ['Mountain', 'Heaven'],
  27: ['Mountain', 'Thunder'],
  28: ['Lake', 'Wind'],
  29: ['Water', 'Water'],
  30: ['Fire', 'Fire'],
  31: ['Lake', 'Mountain'],
  32: ['Thunder', 'Wind'],
  33: ['Heaven', 'Mountain'],
  34: ['Thunder', 'Heaven'],
  35: ['Fire', 'Earth'],
  36: ['Earth', 'Fire'],
  37: ['Wind', 'Fire'],
  38: ['Fire', 'Lake'],
  39: ['Water', 'Mountain'],
  40: ['Thunder', 'Water'],
  41: ['Mountain', 'Lake'],
  42: ['Wind', 'Thunder'],
  43: ['Lake', 'Heaven'],
  44: ['Heaven', 'Wind'],
  45: ['Lake', 'Earth'],
  46: ['Earth', 'Wind'],
  47: ['Lake', 'Water'],
  48: ['Water', 'Wind'],
  49: ['Lake', 'Fire'],
  50: ['Fire', 'Wind'],
  51: ['Thunder', 'Thunder'],
  52: ['Mountain', 'Mountain'],
  53: ['Wind', 'Mountain'],
  54: ['Thunder', 'Lake'],
  55: ['Thunder', 'Fire'],
  56: ['Fire', 'Mountain'],
  57: ['Wind', 'Wind'],
  58: ['Lake', 'Lake'],
  59: ['Wind', 'Water'],
  60: ['Water', 'Lake'],
  61: ['Wind', 'Lake'],
  62: ['Thunder', 'Mountain'],
  63: ['Water', 'Fire'],
  64: ['Fire', 'Water']
};

// The 12 Penta gates
const PENTA_GATES = [1, 2, 5, 7, 8, 13, 14, 15, 29, 31, 33, 46];

// =============================================================================
// SECTION 2: Hamming Distance Calculation
// =============================================================================

function hammingDistance(trigram1, trigram2) {
  const bits1 = TRIGRAMS[trigram1];
  const bits2 = TRIGRAMS[trigram2];

  let distance = 0;
  for (let i = 0; i < 3; i++) {
    if (bits1[i] !== bits2[i]) distance++;
  }
  return distance;
}

function classifyGate(gate) {
  const [inner, outer] = GATE_TRIGRAMS[gate];
  const distance = hammingDistance(inner, outer);

  let type;
  switch(distance) {
    case 0: type = 'STANDING WAVE (vertex)'; break;
    case 1: type = 'EDGE'; break;
    case 2: type = 'FACE DIAGONAL'; break;
    case 3: type = 'SPACE DIAGONAL'; break;
  }

  return {
    gate,
    inner,
    outer,
    innerBits: TRIGRAMS[inner].join(''),
    outerBits: TRIGRAMS[outer].join(''),
    hammingDistance: distance,
    type
  };
}

// =============================================================================
// SECTION 3: Analyze Penta Gates
// =============================================================================

console.log('SECTION 1: PENTA GATE ANALYSIS');
console.log('───────────────────────────────────────────────────────────────');
console.log();

console.log('The 12 Penta Gates and their geometric classification:');
console.log();
console.log('┌──────┬──────────┬──────────┬───────┬───────┬──────┬────────────────────────┐');
console.log('│ Gate │ Inner    │ Outer    │ Inner │ Outer │ Dist │ Classification         │');
console.log('│      │ Trigram  │ Trigram  │ Bits  │ Bits  │      │                        │');
console.log('├──────┼──────────┼──────────┼───────┼───────┼──────┼────────────────────────┤');

const pentaResults = PENTA_GATES.map(gate => classifyGate(gate));

pentaResults.forEach(r => {
  console.log(`│ ${r.gate.toString().padStart(4)} │ ${r.inner.padEnd(8)} │ ${r.outer.padEnd(8)} │ ${r.innerBits}   │ ${r.outerBits}   │  ${r.hammingDistance}   │ ${r.type.padEnd(22)} │`);
});
console.log('└──────┴──────────┴──────────┴───────┴───────┴──────┴────────────────────────┘');
console.log();

// =============================================================================
// SECTION 4: Summary Statistics
// =============================================================================

console.log('SECTION 2: SUMMARY');
console.log('───────────────────────────────────────────────────────────────');
console.log();

const standingWaves = pentaResults.filter(r => r.hammingDistance === 0);
const edges = pentaResults.filter(r => r.hammingDistance === 1);
const faceDiagonals = pentaResults.filter(r => r.hammingDistance === 2);
const spaceDiagonals = pentaResults.filter(r => r.hammingDistance === 3);

console.log('Classification breakdown:');
console.log(`  Standing Waves (vertex, dist=0):  ${standingWaves.length} gates: ${standingWaves.map(r => r.gate).join(', ') || 'none'}`);
console.log(`  Edges (dist=1):                   ${edges.length} gates: ${edges.map(r => r.gate).join(', ') || 'none'}`);
console.log(`  Face Diagonals (dist=2):          ${faceDiagonals.length} gates: ${faceDiagonals.map(r => r.gate).join(', ') || 'none'}`);
console.log(`  Space Diagonals (dist=3):         ${spaceDiagonals.length} gates: ${spaceDiagonals.map(r => r.gate).join(', ') || 'none'}`);
console.log();

console.log(`Total: ${standingWaves.length} + ${edges.length} + ${faceDiagonals.length} + ${spaceDiagonals.length} = ${pentaResults.length}`);
console.log();

// =============================================================================
// SECTION 5: The 12 Cube Edges
// =============================================================================

console.log('SECTION 3: THE 12 CUBE EDGES');
console.log('───────────────────────────────────────────────────────────────');
console.log();

// Generate all 12 cube edges (trigram pairs with Hamming distance 1)
const cubeEdges = [];
const trigrams = Object.keys(TRIGRAMS);

for (let i = 0; i < trigrams.length; i++) {
  for (let j = i + 1; j < trigrams.length; j++) {
    if (hammingDistance(trigrams[i], trigrams[j]) === 1) {
      cubeEdges.push([trigrams[i], trigrams[j]]);
    }
  }
}

console.log('The 12 Cube Edges (Hamming distance 1):');
cubeEdges.forEach(([t1, t2], idx) => {
  console.log(`  Edge ${(idx+1).toString().padStart(2)}: ${t1.padEnd(8)} ↔ ${t2.padEnd(8)} (${TRIGRAMS[t1].join('')} ↔ ${TRIGRAMS[t2].join('')})`);
});
console.log();

// =============================================================================
// SECTION 6: Which Edges Are Represented by Penta Gates?
// =============================================================================

console.log('SECTION 4: EDGE COVERAGE ANALYSIS');
console.log('───────────────────────────────────────────────────────────────');
console.log();

// For each edge, find if any Penta gate represents it
console.log('Which cube edges are represented by Penta gates?');
console.log();

const edgeCoverage = cubeEdges.map(([t1, t2]) => {
  const matchingGates = edges.filter(r =>
    (r.inner === t1 && r.outer === t2) ||
    (r.inner === t2 && r.outer === t1)
  );
  return {
    edge: `${t1} ↔ ${t2}`,
    bits: `${TRIGRAMS[t1].join('')} ↔ ${TRIGRAMS[t2].join('')}`,
    pentaGates: matchingGates.map(r => r.gate),
    covered: matchingGates.length > 0
  };
});

console.log('┌────────────────────────────────┬─────────────────┬──────────────┐');
console.log('│ Cube Edge                      │ Bits            │ Penta Gates  │');
console.log('├────────────────────────────────┼─────────────────┼──────────────┤');
edgeCoverage.forEach(ec => {
  const gatesStr = ec.pentaGates.length > 0 ? ec.pentaGates.join(', ') : '—';
  console.log(`│ ${ec.edge.padEnd(30)} │ ${ec.bits.padEnd(15)} │ ${gatesStr.padEnd(12)} │`);
});
console.log('└────────────────────────────────┴─────────────────┴──────────────┘');
console.log();

const coveredEdges = edgeCoverage.filter(ec => ec.covered).length;
const uncoveredEdges = edgeCoverage.filter(ec => !ec.covered);

console.log(`Edges covered by Penta: ${coveredEdges} / 12`);
console.log(`Edges NOT covered: ${12 - coveredEdges}`);
if (uncoveredEdges.length > 0) {
  console.log(`  Missing edges: ${uncoveredEdges.map(ec => ec.edge).join('; ')}`);
}
console.log();

// =============================================================================
// SECTION 7: Analysis of Non-Edge Penta Gates
// =============================================================================

console.log('SECTION 5: ANALYSIS OF NON-EDGE PENTA GATES');
console.log('───────────────────────────────────────────────────────────────');
console.log();

if (standingWaves.length > 0) {
  console.log('Standing Wave Gates (vertices — the anchors):');
  standingWaves.forEach(r => {
    console.log(`  Gate ${r.gate}: ${r.inner} (${r.innerBits}) — pure trigram state`);
  });
  console.log();
}

if (faceDiagonals.length > 0) {
  console.log('Face Diagonal Gates (Hamming distance 2):');
  faceDiagonals.forEach(r => {
    // Find which two bits differ
    const inner = TRIGRAMS[r.inner];
    const outer = TRIGRAMS[r.outer];
    const diffBits = [];
    for (let i = 0; i < 3; i++) {
      if (inner[i] !== outer[i]) diffBits.push(i + 1);
    }
    console.log(`  Gate ${r.gate}: ${r.inner} → ${r.outer} — bits ${diffBits.join(' and ')} flip`);
  });
  console.log();
}

if (spaceDiagonals.length > 0) {
  console.log('Space Diagonal Gates (Hamming distance 3 — complements):');
  spaceDiagonals.forEach(r => {
    console.log(`  Gate ${r.gate}: ${r.inner} → ${r.outer} — complete inversion`);
  });
  console.log();
}

// =============================================================================
// SECTION 8: The Pattern
// =============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('  HYPOTHESIS ASSESSMENT');
console.log('═══════════════════════════════════════════════════════════════');
console.log();

const edgePercentage = (edges.length / 12 * 100).toFixed(1);
const totalStructure = standingWaves.length + edges.length;

console.log('Original Hypothesis: 12 Penta gates = 12 cube edges');
console.log();
console.log('Actual Finding:');
console.log(`  Standing Waves (vertices): ${standingWaves.length}`);
console.log(`  Edge gates:                ${edges.length}`);
console.log(`  Face diagonals:            ${faceDiagonals.length}`);
console.log(`  Space diagonals:           ${spaceDiagonals.length}`);
console.log();

if (standingWaves.length > 0 && edges.length > 0) {
  console.log(`PATTERN: ${standingWaves.length} vertices + ${edges.length} edges = ${totalStructure} structural positions`);
  console.log();
  console.log('Interpretation:');
  console.log('  The Penta gates form a SUBSET of the cube skeleton:');
  console.log('  • Standing waves = vertex anchors (where extraction originates)');
  console.log('  • Edge gates = contact points (where spiral touches skeleton)');
  if (faceDiagonals.length > 0 || spaceDiagonals.length > 0) {
    console.log('  • Diagonal gates = cross-cube paths (deeper extraction channels)');
  }
}

console.log();

// =============================================================================
// SECTION 9: Geometric Visualization
// =============================================================================

console.log('SECTION 6: GEOMETRIC STRUCTURE');
console.log('───────────────────────────────────────────────────────────────');
console.log();

console.log(`
                    Heaven (111)
                       /|\\
                      / | \\
                     /  |  \\
                    /   |   \\
               Wind/    |    \\Lake
              (011)     |     (110)
                  \\     |     /
                   \\    |    /
                    \\   |   /
                     \\  |  /
                      \\ | /
          Fire ________\\|/________ Water
         (101)         /|\\         (010)
                      / | \\
                     /  |  \\
                    /   |   \\
                   /    |    \\
              Thunder   |   Mountain
               (100)    |    (001)
                   \\    |    /
                    \\   |   /
                     \\  |  /
                      \\ | /
                       \\|/
                    Earth (000)
`);

console.log('Penta Gate Positions on Cube:');
standingWaves.forEach(r => {
  console.log(`  ● Gate ${r.gate}: ${r.inner} vertex (standing wave anchor)`);
});
edges.forEach(r => {
  console.log(`  ─ Gate ${r.gate}: ${r.inner}—${r.outer} edge`);
});
faceDiagonals.forEach(r => {
  console.log(`  ╱ Gate ${r.gate}: ${r.inner}—${r.outer} face diagonal`);
});
spaceDiagonals.forEach(r => {
  console.log(`  ╲ Gate ${r.gate}: ${r.inner}—${r.outer} space diagonal`);
});
console.log();

// =============================================================================
// Save Results
// =============================================================================

const outputDir = path.join(__dirname, '../../docs/research/data/geometric');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const results = {
  metadata: {
    analysis: 'Penta Gates as Cube Edges',
    date: new Date().toISOString()
  },
  pentaGates: PENTA_GATES,
  classification: {
    standingWaves: standingWaves.map(r => ({ gate: r.gate, trigram: r.inner })),
    edges: edges.map(r => ({ gate: r.gate, inner: r.inner, outer: r.outer })),
    faceDiagonals: faceDiagonals.map(r => ({ gate: r.gate, inner: r.inner, outer: r.outer })),
    spaceDiagonals: spaceDiagonals.map(r => ({ gate: r.gate, inner: r.inner, outer: r.outer }))
  },
  edgeCoverage: {
    totalEdges: 12,
    coveredByPenta: coveredEdges,
    uncoveredEdges: uncoveredEdges.map(ec => ec.edge)
  },
  hypothesis: {
    original: '12 Penta gates = 12 cube edges',
    result: edges.length === 12 ? 'CONFIRMED' : 'PARTIAL',
    pattern: `${standingWaves.length} vertices + ${edges.length} edges + ${faceDiagonals.length} face diags + ${spaceDiagonals.length} space diags`
  }
};

fs.writeFileSync(
  path.join(outputDir, 'penta-gates-cube-edges.json'),
  JSON.stringify(results, null, 2)
);

console.log('═══════════════════════════════════════════════════════════════');
console.log(`Results saved to: docs/research/data/geometric/penta-gates-cube-edges.json`);
console.log('═══════════════════════════════════════════════════════════════');
