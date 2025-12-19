/**
 * Phase 1: The Cube Foundation
 *
 * Maps the 8 trigrams to cube vertices and classifies all 64 hexagrams
 * by their geometric properties.
 *
 * Core hypothesis: The 8 trigrams ARE the 8 cube vertices, addressed
 * by 3 binary coordinates (x, y, z).
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

// ============================================================================
// SECTION 1: Trigram-to-Cube Vertex Mapping
// ============================================================================

/**
 * The 8 trigrams mapped to cube vertices.
 * Binary convention: bit0 = z, bit1 = y, bit2 = x
 * So 011 = (x=0, y=1, z=1) = (0,1,1)
 */
const TRIGRAM_VERTICES = {
  '000': { name: 'Earth',    symbol: '☷', coords: [0, 0, 0], emPosition: +4, yangCount: 0 },
  '001': { name: 'Mountain', symbol: '☶', coords: [0, 0, 1], emPosition: +3, yangCount: 1 },
  '010': { name: 'Water',    symbol: '☵', coords: [0, 1, 0], emPosition: +2, yangCount: 1 },
  '011': { name: 'Wind',     symbol: '☴', coords: [0, 1, 1], emPosition: -1, yangCount: 2 },
  '100': { name: 'Thunder',  symbol: '☳', coords: [1, 0, 0], emPosition: +1, yangCount: 1 },
  '101': { name: 'Fire',     symbol: '☲', coords: [1, 0, 1], emPosition: -2, yangCount: 2 },
  '110': { name: 'Lake',     symbol: '☱', coords: [1, 1, 0], emPosition: -3, yangCount: 2 },
  '111': { name: 'Heaven',   symbol: '☰', coords: [1, 1, 1], emPosition: -4, yangCount: 3 }
};

// ============================================================================
// SECTION 2: Extract Trigrams from Hexagram Binary
// ============================================================================

/**
 * Extract inner (lower) and outer (upper) trigrams from 6-bit binary.
 * Convention: bits 0-2 = inner trigram (lines 1-3), bits 3-5 = outer trigram (lines 4-6)
 */
function extractTrigrams(binary6) {
  const inner = binary6.slice(0, 3);  // First 3 bits = lines 1-3 = inner trigram
  const outer = binary6.slice(3, 6);  // Last 3 bits = lines 4-6 = outer trigram
  return { inner, outer };
}

// ============================================================================
// SECTION 3: Geometric Classification
// ============================================================================

/**
 * Calculate Euclidean distance between two cube vertices.
 */
function euclideanDistance(coords1, coords2) {
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    sum += Math.pow(coords1[i] - coords2[i], 2);
  }
  return Math.sqrt(sum);
}

/**
 * Calculate Hamming distance (number of differing bits) between trigrams.
 */
function hammingDistance(trigram1, trigram2) {
  let dist = 0;
  for (let i = 0; i < 3; i++) {
    if (trigram1[i] !== trigram2[i]) dist++;
  }
  return dist;
}

/**
 * Classify a hexagram by its geometric properties.
 */
function classifyGeometrically(gate, binary6) {
  const { inner, outer } = extractTrigrams(binary6);
  const innerVertex = TRIGRAM_VERTICES[inner];
  const outerVertex = TRIGRAM_VERTICES[outer];

  const innerEM = innerVertex.emPosition;
  const outerEM = outerVertex.emPosition;

  // Calculate distances
  const eucDist = euclideanDistance(innerVertex.coords, outerVertex.coords);
  const hamDist = hammingDistance(inner, outer);

  // Geometric classification
  let geometricType;
  if (inner === outer) {
    geometricType = 'STANDING_WAVE'; // Vertex to itself (diagonal of 8x8 matrix)
  } else {
    // Cross-zero means traversing between cube "hemispheres"
    // Positive EM positions (0,1,2,3) vs Negative EM positions (0,-1,-2,-3,-4)
    // Actually: +4,+3,+2,+1 vs -1,-2,-3,-4
    // The "zero" is between +1 and -1
    const innerPositive = innerEM > 0;
    const outerPositive = outerEM > 0;

    if (innerPositive !== outerPositive) {
      // One positive, one negative = crosses zero
      if (innerPositive && !outerPositive) {
        geometricType = 'CROSS_ZERO_DEMATERIALISING'; // Form → Void (positive → negative)
      } else {
        geometricType = 'CROSS_ZERO_MANIFESTING'; // Void → Form (negative → positive)
      }
    } else {
      // Both same side
      if (innerPositive) {
        geometricType = 'SAME_PHASE_MATERIAL'; // Both positive = material realm
      } else {
        geometricType = 'SAME_PHASE_VOID'; // Both negative = void realm
      }
    }
  }

  return {
    gate,
    binary: binary6,
    innerTrigram: inner,
    outerTrigram: outer,
    innerName: innerVertex.name,
    outerName: outerVertex.name,
    innerCoords: innerVertex.coords,
    outerCoords: outerVertex.coords,
    innerEM,
    outerEM,
    euclideanDistance: eucDist,
    hammingDistance: hamDist,
    geometricType
  };
}

// ============================================================================
// SECTION 4: Process All 64 Gates
// ============================================================================

const allGates = [];
const typeCount = {
  'STANDING_WAVE': 0,
  'CROSS_ZERO_MANIFESTING': 0,
  'CROSS_ZERO_DEMATERIALISING': 0,
  'SAME_PHASE_MATERIAL': 0,
  'SAME_PHASE_VOID': 0
};

for (let gate = 1; gate <= 64; gate++) {
  const binary = binaryData.gates[gate].binary;
  const classified = classifyGeometrically(gate, binary);
  allGates.push(classified);
  typeCount[classified.geometricType]++;
}

// ============================================================================
// SECTION 5: Output Results
// ============================================================================

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║          PHASE 1: CUBE FOUNDATION - GEOMETRIC MAPPING           ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// Print trigram-vertex mapping
console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                  TRIGRAM → CUBE VERTEX MAPPING                   │');
console.log('├─────────┬────────┬────────────┬─────────────┬───────────────────┤');
console.log('│ Trigram │ Binary │  Vertex    │ EM Position │ Yang Count        │');
console.log('├─────────┼────────┼────────────┼─────────────┼───────────────────┤');
for (const [binary, data] of Object.entries(TRIGRAM_VERTICES)) {
  const coords = `(${data.coords.join(',')})`;
  const emStr = data.emPosition > 0 ? `+${data.emPosition}` : `${data.emPosition}`;
  console.log(`│ ${data.name.padEnd(7)} │  ${binary}   │  ${coords.padEnd(8)} │     ${emStr.padEnd(6)}  │        ${data.yangCount}          │`);
}
console.log('└─────────┴────────┴────────────┴─────────────┴───────────────────┘\n');

// Print classification counts
console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                  GEOMETRIC CLASSIFICATION COUNTS                 │');
console.log('├─────────────────────────────────────────┬───────────────────────┤');
console.log('│ Type                                    │ Count                 │');
console.log('├─────────────────────────────────────────┼───────────────────────┤');
for (const [type, count] of Object.entries(typeCount)) {
  console.log(`│ ${type.padEnd(39)} │      ${String(count).padStart(2)}               │`);
}
console.log('├─────────────────────────────────────────┼───────────────────────┤');
console.log(`│ ${'TOTAL'.padEnd(39)} │      ${String(64).padStart(2)}               │`);
console.log('└─────────────────────────────────────────┴───────────────────────┘\n');

// Verify expected counts from brief
console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              VERIFICATION AGAINST EXPECTED COUNTS               │');
console.log('├─────────────────────────────────────────┬───────────┬───────────┤');
console.log('│ Type                                    │ Expected  │ Actual    │');
console.log('├─────────────────────────────────────────┼───────────┼───────────┤');

const expected = {
  'STANDING_WAVE': 8,
  'CROSS_ZERO_MANIFESTING': 16,
  'CROSS_ZERO_DEMATERIALISING': 16,
  'SAME_PHASE_MATERIAL': 12,
  'SAME_PHASE_VOID': 12
};

let allMatch = true;
for (const [type, exp] of Object.entries(expected)) {
  const actual = typeCount[type];
  const match = actual === exp ? '✓' : '✗';
  if (actual !== exp) allMatch = false;
  console.log(`│ ${type.padEnd(39)} │    ${String(exp).padStart(2)}     │    ${String(actual).padStart(2)} ${match}   │`);
}
console.log('└─────────────────────────────────────────┴───────────┴───────────┘\n');

if (allMatch) {
  console.log('✅ PERFECT MATCH: Geometric classification reproduces electromagnetic classification!\n');
} else {
  console.log('❌ MISMATCH: Geometric classification differs from expected.\n');
}

// ============================================================================
// SECTION 6: List Standing Wave Gates
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                      STANDING WAVE GATES                         │');
console.log('│              (Inner Trigram = Outer Trigram)                     │');
console.log('├───────┬────────┬─────────────┬────────────┬─────────────────────┤');
console.log('│ Gate  │ Binary │   Trigram   │  Vertex    │   EM Position       │');
console.log('├───────┼────────┼─────────────┼────────────┼─────────────────────┤');

const standingWaves = allGates.filter(g => g.geometricType === 'STANDING_WAVE');
standingWaves.sort((a, b) => a.innerEM - b.innerEM); // Sort by EM position

for (const sw of standingWaves) {
  const coords = `(${sw.innerCoords.join(',')})`;
  const emStr = sw.innerEM > 0 ? `+${sw.innerEM}` : `${sw.innerEM}`;
  console.log(`│  ${String(sw.gate).padStart(2)}   │ ${sw.binary} │  ${sw.innerName.padEnd(9)} │  ${coords.padEnd(8)} │       ${emStr.padEnd(12)}  │`);
}
console.log('└───────┴────────┴─────────────┴────────────┴─────────────────────┘\n');

// ============================================================================
// SECTION 7: Euclidean Distance Analysis
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                   EUCLIDEAN DISTANCE ANALYSIS                    │');
console.log('├─────────────────────────────────────────────────────────────────┤');

// Group by distance
const byDistance = {};
for (const g of allGates) {
  const dist = g.euclideanDistance.toFixed(3);
  if (!byDistance[dist]) byDistance[dist] = [];
  byDistance[dist].push(g);
}

console.log('│ Distance │ Count │ Types                                        │');
console.log('├──────────┼───────┼──────────────────────────────────────────────┤');
for (const [dist, gates] of Object.entries(byDistance).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))) {
  const typeSummary = {};
  for (const g of gates) {
    typeSummary[g.geometricType] = (typeSummary[g.geometricType] || 0) + 1;
  }
  const typeStr = Object.entries(typeSummary).map(([t, c]) => `${t.slice(0, 10)}:${c}`).join(', ');
  console.log(`│  ${dist.padStart(6)}  │   ${String(gates.length).padStart(2)}  │ ${typeStr.padEnd(44)} │`);
}
console.log('└──────────┴───────┴──────────────────────────────────────────────┘\n');

// ============================================================================
// SECTION 8: Hamming Distance Analysis
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                   HAMMING DISTANCE ANALYSIS                      │');
console.log('├─────────────────────────────────────────────────────────────────┤');

const byHamming = { 0: [], 1: [], 2: [], 3: [] };
for (const g of allGates) {
  byHamming[g.hammingDistance].push(g);
}

console.log('│ Hamming  │ Count │ Meaning                                      │');
console.log('├──────────┼───────┼──────────────────────────────────────────────┤');
console.log(`│     0    │   ${String(byHamming[0].length).padStart(2)}  │ Same vertex (Standing Wave)                  │`);
console.log(`│     1    │   ${String(byHamming[1].length).padStart(2)}  │ Edge traversal (1 bit flip)                  │`);
console.log(`│     2    │   ${String(byHamming[2].length).padStart(2)}  │ Face diagonal (2 bit flips)                  │`);
console.log(`│     3    │   ${String(byHamming[3].length).padStart(2)}  │ Space diagonal (3 bit flips = complement)   │`);
console.log('└──────────┴───────┴──────────────────────────────────────────────┘\n');

// ============================================================================
// SECTION 9: Save Full Data for Further Analysis
// ============================================================================

const outputData = {
  description: 'Phase 1: Cube Foundation - Geometric Classification of 64 Gates',
  generated: new Date().toISOString(),
  trigramVertices: TRIGRAM_VERTICES,
  gateClassifications: allGates,
  typeCounts: typeCount,
  distanceAnalysis: {
    byEuclidean: Object.fromEntries(
      Object.entries(byDistance).map(([d, gates]) => [d, gates.map(g => g.gate)])
    ),
    byHamming: Object.fromEntries(
      Object.entries(byHamming).map(([d, gates]) => [d, gates.map(g => g.gate)])
    )
  }
};

const outputPath = path.join(__dirname, '../../docs/research/data/geometric/phase1-cube-foundation.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
console.log(`📁 Full data saved to: ${outputPath}\n`);

// ============================================================================
// SECTION 10: Cube Edges (Single-bit transitions between trigrams)
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                    CUBE EDGES (12 edges)                         │');
console.log('│              Single-bit transitions between trigrams             │');
console.log('├───────────────────┬───────────────────┬─────────────────────────┤');
console.log('│ From Vertex       │ To Vertex         │ Bit Changed             │');
console.log('├───────────────────┼───────────────────┼─────────────────────────┤');

const edges = [];
const trigrams = Object.keys(TRIGRAM_VERTICES);
for (let i = 0; i < trigrams.length; i++) {
  for (let j = i + 1; j < trigrams.length; j++) {
    const t1 = trigrams[i];
    const t2 = trigrams[j];
    if (hammingDistance(t1, t2) === 1) {
      // Find which bit changed
      let bitPos = -1;
      for (let b = 0; b < 3; b++) {
        if (t1[b] !== t2[b]) bitPos = b;
      }
      edges.push({ from: t1, to: t2, bitChanged: bitPos });
      const fromName = TRIGRAM_VERTICES[t1].name;
      const toName = TRIGRAM_VERTICES[t2].name;
      const bitName = ['z (line 1)', 'y (line 2)', 'x (line 3)'][bitPos];
      console.log(`│ ${fromName.padEnd(17)} │ ${toName.padEnd(17)} │ ${bitName.padEnd(23)} │`);
    }
  }
}
console.log('└───────────────────┴───────────────────┴─────────────────────────┘');
console.log(`Total edges: ${edges.length} (expected: 12)\n`);

// ============================================================================
// SECTION 11: Complementary Pairs (Space Diagonal)
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                  SPACE DIAGONALS (4 pairs)                       │');
console.log('│              Opposite vertices = binary complements              │');
console.log('├───────────────────┬───────────────────┬─────────────────────────┤');
console.log('│ Vertex 1          │ Vertex 2          │ EM Sum                  │');
console.log('├───────────────────┼───────────────────┼─────────────────────────┤');

for (let i = 0; i < 4; i++) {
  const t1 = trigrams[i];
  const t2 = trigrams[7 - i]; // Complement is at 7-i
  const v1 = TRIGRAM_VERTICES[t1];
  const v2 = TRIGRAM_VERTICES[t2];
  const emSum = v1.emPosition + v2.emPosition;
  console.log(`│ ${(v1.name + ' (' + t1 + ')').padEnd(17)} │ ${(v2.name + ' (' + t2 + ')').padEnd(17)} │ ${String(v1.emPosition).padStart(2)} + ${String(v2.emPosition).padStart(2)} = ${String(emSum).padStart(2).padEnd(14)} │`);
}
console.log('└───────────────────┴───────────────────┴─────────────────────────┘\n');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                       PHASE 1 COMPLETE');
console.log('═══════════════════════════════════════════════════════════════════\n');
