/**
 * Phase 1b: Cube Negative Spaces
 *
 * Investigates the correspondence between:
 * - 12 cube edges → 12 profiles?
 * - 6 cube faces → 6 lines?
 * - Octahedron duality with cube
 */

const fs = require('fs');
const path = require('path');

// Load Phase 1 data
const phase1Data = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../../docs/research/data/geometric/phase1-cube-foundation.json'), 'utf8'
));

const TRIGRAM_VERTICES = phase1Data.trigramVertices;

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║         PHASE 1b: CUBE NEGATIVE SPACES ANALYSIS                  ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// ============================================================================
// SECTION 1: The 6 Cube Faces
// ============================================================================

/**
 * A cube has 6 faces. Each face is defined by fixing one coordinate:
 * - x=0: back face (Earth, Mountain, Water, Wind)
 * - x=1: front face (Thunder, Fire, Lake, Heaven)
 * - y=0: bottom face (Earth, Mountain, Thunder, Fire)
 * - y=1: top face (Water, Wind, Lake, Heaven)
 * - z=0: left face (Earth, Water, Thunder, Lake)
 * - z=1: right face (Mountain, Wind, Fire, Heaven)
 */

const CUBE_FACES = [
  { name: 'x=0 (back)',   fixed: 'x', value: 0, vertices: ['000', '001', '010', '011'] },
  { name: 'x=1 (front)',  fixed: 'x', value: 1, vertices: ['100', '101', '110', '111'] },
  { name: 'y=0 (bottom)', fixed: 'y', value: 0, vertices: ['000', '001', '100', '101'] },
  { name: 'y=1 (top)',    fixed: 'y', value: 1, vertices: ['010', '011', '110', '111'] },
  { name: 'z=0 (left)',   fixed: 'z', value: 0, vertices: ['000', '010', '100', '110'] },
  { name: 'z=1 (right)',  fixed: 'z', value: 1, vertices: ['001', '011', '101', '111'] }
];

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                     THE 6 CUBE FACES                             │');
console.log('├───────────────┬──────────────────────────────────────────────────┤');
console.log('│ Face          │ Vertices (trigrams)                              │');
console.log('├───────────────┼──────────────────────────────────────────────────┤');

for (const face of CUBE_FACES) {
  const trigramNames = face.vertices.map(v => TRIGRAM_VERTICES[v].name).join(', ');
  console.log(`│ ${face.name.padEnd(13)} │ ${trigramNames.padEnd(48)} │`);
}
console.log('└───────────────┴──────────────────────────────────────────────────┘\n');

// ============================================================================
// SECTION 2: Octahedron as Cube Dual
// ============================================================================

/**
 * The octahedron is the dual of the cube:
 * - Octahedron vertices = cube face centers
 * - Octahedron faces = cube vertices
 *
 * The octahedron has 6 vertices, one at the center of each cube face.
 */

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                 OCTAHEDRON (CUBE DUAL)                           │');
console.log('├─────────────────────────────────────────────────────────────────┤');
console.log('│ The octahedron has 6 vertices - one at each cube face center.   │');
console.log('│ If 6 lines correspond to octahedron vertices, then each line    │');
console.log('│ represents a "face direction" of the trigram cube.              │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Face centers in coordinate space (assuming unit cube from 0,0,0 to 1,1,1)
const OCTAHEDRON_VERTICES = [
  { name: 'Line 1?', coords: [0.5, 0.5, 0],   direction: '-z', face: 'z=0 (left)' },
  { name: 'Line 2?', coords: [0.5, 0.5, 1],   direction: '+z', face: 'z=1 (right)' },
  { name: 'Line 3?', coords: [0.5, 0, 0.5],   direction: '-y', face: 'y=0 (bottom)' },
  { name: 'Line 4?', coords: [0.5, 1, 0.5],   direction: '+y', face: 'y=1 (top)' },
  { name: 'Line 5?', coords: [0, 0.5, 0.5],   direction: '-x', face: 'x=0 (back)' },
  { name: 'Line 6?', coords: [1, 0.5, 0.5],   direction: '+x', face: 'x=1 (front)' }
];

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              OCTAHEDRON VERTICES (CUBE FACE CENTERS)             │');
console.log('├─────────────┬─────────────────┬─────────────────────────────────┤');
console.log('│ Vertex      │ Coordinates     │ Corresponding Cube Face         │');
console.log('├─────────────┼─────────────────┼─────────────────────────────────┤');
for (const v of OCTAHEDRON_VERTICES) {
  console.log(`│ ${v.name.padEnd(11)} │ (${v.coords.join(', ')})     │ ${v.face.padEnd(31)} │`);
}
console.log('└─────────────┴─────────────────┴─────────────────────────────────┘\n');

// ============================================================================
// SECTION 3: Analysis of Face Content - EM Positions
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│               CUBE FACE EM POSITION ANALYSIS                     │');
console.log('├───────────────┬────────────────────────────────────────┬────────┤');
console.log('│ Face          │ EM Positions of Vertices               │ Sum    │');
console.log('├───────────────┼────────────────────────────────────────┼────────┤');

for (const face of CUBE_FACES) {
  const positions = face.vertices.map(v => TRIGRAM_VERTICES[v].emPosition);
  const sum = positions.reduce((a, b) => a + b, 0);
  const posStr = positions.map(p => p > 0 ? `+${p}` : `${p}`).join(', ');
  console.log(`│ ${face.name.padEnd(13)} │ ${posStr.padEnd(38)} │ ${String(sum).padStart(5)}  │`);
}
console.log('└───────────────┴────────────────────────────────────────┴────────┘\n');

// ============================================================================
// SECTION 4: The 12 Cube Edges as Transitions
// ============================================================================

const CUBE_EDGES = [];
const trigrams = Object.keys(TRIGRAM_VERTICES);

for (let i = 0; i < trigrams.length; i++) {
  for (let j = i + 1; j < trigrams.length; j++) {
    const t1 = trigrams[i];
    const t2 = trigrams[j];
    // Calculate Hamming distance
    let hamming = 0;
    let bitChanged = -1;
    for (let b = 0; b < 3; b++) {
      if (t1[b] !== t2[b]) {
        hamming++;
        bitChanged = b;
      }
    }
    if (hamming === 1) {
      CUBE_EDGES.push({
        from: t1,
        to: t2,
        fromName: TRIGRAM_VERTICES[t1].name,
        toName: TRIGRAM_VERTICES[t2].name,
        bitChanged: bitChanged,
        fromEM: TRIGRAM_VERTICES[t1].emPosition,
        toEM: TRIGRAM_VERTICES[t2].emPosition
      });
    }
  }
}

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│             CUBE EDGES AS TRIGRAM TRANSITIONS (12)               │');
console.log('├─────────────────┬─────────────────┬──────────┬──────────────────┤');
console.log('│ From            │ To              │ Bit      │ EM Transition    │');
console.log('├─────────────────┼─────────────────┼──────────┼──────────────────┤');

for (const edge of CUBE_EDGES) {
  const bitName = ['z', 'y', 'x'][edge.bitChanged];
  const emFrom = edge.fromEM > 0 ? `+${edge.fromEM}` : `${edge.fromEM}`;
  const emTo = edge.toEM > 0 ? `+${edge.toEM}` : `${edge.toEM}`;
  const emTrans = `${emFrom} → ${emTo}`;
  console.log(`│ ${edge.fromName.padEnd(15)} │ ${edge.toName.padEnd(15)} │    ${bitName}     │ ${emTrans.padEnd(16)} │`);
}
console.log('└─────────────────┴─────────────────┴──────────┴──────────────────┘\n');

// ============================================================================
// SECTION 5: Profiles as Edge Movements?
// ============================================================================

/**
 * Human Design has 12 profiles: 1/3, 1/4, 2/4, 2/5, 3/5, 3/6, 4/6, 4/1, 5/1, 5/2, 6/2, 6/3
 *
 * The cube has 12 edges.
 *
 * Can we find a mapping between profiles and cube edges?
 */

const PROFILES = [
  '1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3'
];

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                    PROFILES (12) VS EDGES (12)                   │');
console.log('├─────────────────────────────────────────────────────────────────┤');
console.log('│ Human Design Profiles:                                          │');
console.log('│ ' + PROFILES.join(', ').padEnd(63) + ' │');
console.log('├─────────────────────────────────────────────────────────────────┤');
console.log('│ Profile structure: Personality Line / Design Line               │');
console.log('│ Each profile = transition between two lines (sequential)        │');
console.log('│                                                                 │');
console.log('│ Cube edges: Each edge = transition between two trigrams         │');
console.log('│ (differing by 1 bit = 1 line changing)                          │');
console.log('│                                                                 │');
console.log('│ HYPOTHESIS: Profiles may map to edges if lines map to axes.     │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// ============================================================================
// SECTION 6: Line-to-Axis Hypothesis
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                   LINE-TO-AXIS HYPOTHESIS                        │');
console.log('├─────────────────────────────────────────────────────────────────┤');
console.log('│                                                                 │');
console.log('│ In the binary representation:                                   │');
console.log('│   - Lines 1-3 = Inner trigram (bits 0, 1, 2)                    │');
console.log('│   - Lines 4-6 = Outer trigram (bits 3, 4, 5)                    │');
console.log('│                                                                 │');
console.log('│ If we map:                                                      │');
console.log('│   - Bit 0 (lines 1,4) → z-axis                                  │');
console.log('│   - Bit 1 (lines 2,5) → y-axis                                  │');
console.log('│   - Bit 2 (lines 3,6) → x-axis                                  │');
console.log('│                                                                 │');
console.log('│ Then lines 1-3 determine INNER trigram position (which vertex) │');
console.log('│ And lines 4-6 determine OUTER trigram position (which vertex)  │');
console.log('│                                                                 │');
console.log('│ The 6 lines in HD may correspond to:                            │');
console.log('│   - Line 1: z-axis, inner (introspective, foundational)         │');
console.log('│   - Line 2: y-axis, inner (hermetic, natural)                   │');
console.log('│   - Line 3: x-axis, inner (experimental, adaptive)              │');
console.log('│   - Line 4: z-axis, outer (networking, influential)             │');
console.log('│   - Line 5: y-axis, outer (projecting, heretical)               │');
console.log('│   - Line 6: x-axis, outer (role model, transitional)            │');
console.log('│                                                                 │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// ============================================================================
// SECTION 7: The Interior as Hexagram Space
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                THE CUBE INTERIOR AS HEXAGRAM SPACE               │');
console.log('├─────────────────────────────────────────────────────────────────┤');
console.log('│                                                                 │');
console.log('│ The 8 trigrams are the VERTICES (the boundary conditions).      │');
console.log('│ The 64 hexagrams are PATHS through the interior.                │');
console.log('│                                                                 │');
console.log('│ Each hexagram = (inner vertex, outer vertex)                    │');
console.log('│                = vector from one boundary to another            │');
console.log('│                                                                 │');
console.log('│ The "interior" is not a single thing but the SPACE OF PATHS.    │');
console.log('│                                                                 │');
console.log('│ Hexagram types by path geometry:                                │');
console.log('│   - Standing Wave (8): vertex → same vertex (null path)         │');
console.log('│   - Edge path (24): adjacent vertices (Hamming = 1)             │');
console.log('│   - Face diagonal (24): 2 vertices apart (Hamming = 2)          │');
console.log('│   - Space diagonal (8): opposite vertices (Hamming = 3)         │');
console.log('│                                                                 │');
console.log('│ The neutrino stream "fills" this space by selecting             │');
console.log('│ which paths are activated for THIS life.                        │');
console.log('│                                                                 │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// ============================================================================
// SECTION 8: Cross-Zero Geometry
// ============================================================================

/**
 * Cross-zero gates traverse between "positive" hemisphere (+4,+3,+2,+1)
 * and "negative" hemisphere (-1,-2,-3,-4).
 *
 * In cube terms, this is crossing between yang-count 0-1 (positive)
 * and yang-count 2-3 (negative).
 */

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                    CROSS-ZERO GEOMETRY                           │');
console.log('├─────────────────────────────────────────────────────────────────┤');
console.log('│                                                                 │');
console.log('│ The "zero" boundary divides the cube into two tetrahedra:       │');
console.log('│                                                                 │');
console.log('│ POSITIVE hemisphere (EM > 0, yang count 0-1):                   │');
console.log('│   Earth (000, +4), Mountain (001, +3), Water (010, +2),         │');
console.log('│   Thunder (100, +1)                                             │');
console.log('│                                                                 │');
console.log('│ NEGATIVE hemisphere (EM < 0, yang count 2-3):                   │');
console.log('│   Wind (011, -1), Fire (101, -2), Lake (110, -3),               │');
console.log('│   Heaven (111, -4)                                              │');
console.log('│                                                                 │');
console.log('│ Cross-zero gates traverse between these tetrahedra.             │');
console.log('│ Same-phase gates stay within one tetrahedron.                   │');
console.log('│ Standing waves occupy single vertices.                          │');
console.log('│                                                                 │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Visualise the two tetrahedra
const positiveTetra = Object.entries(TRIGRAM_VERTICES)
  .filter(([_, v]) => v.emPosition > 0)
  .map(([bin, v]) => ({ binary: bin, ...v }));

const negativeTetra = Object.entries(TRIGRAM_VERTICES)
  .filter(([_, v]) => v.emPosition < 0)
  .map(([bin, v]) => ({ binary: bin, ...v }));

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│                  THE TWO TETRAHEDRA                              │');
console.log('├────────────────────────────┬────────────────────────────────────┤');
console.log('│ POSITIVE (Material)        │ NEGATIVE (Void)                    │');
console.log('├────────────────────────────┼────────────────────────────────────┤');
for (let i = 0; i < 4; i++) {
  const pos = positiveTetra[i];
  const neg = negativeTetra[i];
  console.log(`│ ${pos.name.padEnd(10)} (${pos.binary}) +${pos.emPosition} │ ${neg.name.padEnd(10)} (${neg.binary}) ${neg.emPosition}              │`);
}
console.log('└────────────────────────────┴────────────────────────────────────┘\n');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                    PHASE 1b COMPLETE');
console.log('═══════════════════════════════════════════════════════════════════\n');

console.log('KEY FINDINGS:');
console.log('');
console.log('1. The cube geometry naturally partitions into two tetrahedra');
console.log('   (positive/material and negative/void), with cross-zero gates');
console.log('   traversing between them.');
console.log('');
console.log('2. The octahedron (cube dual) has 6 vertices at cube face centers.');
console.log('   This MAY correspond to the 6 lines, but needs further testing.');
console.log('');
console.log('3. The 12 cube edges map to single-bit trigram transitions.');
console.log('   This MAY correspond to the 12 profiles, but needs further testing.');
console.log('');
console.log('4. The 64 hexagrams are PATHS through cube space:');
console.log('   - 8 null paths (Standing Waves)');
console.log('   - 24 edge paths (Hamming 1)');
console.log('   - 24 face diagonal paths (Hamming 2)');
console.log('   - 8 space diagonal paths (Hamming 3, complements)');
console.log('');
