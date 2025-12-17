/**
 * Geometric Hypothesis Test
 *
 * The 8 trigrams naturally form a cube (2³ = 8 vertices).
 * Question: Do planetary assignments follow geometric patterns?
 *
 * Cube structure:
 * - Each trigram is a vertex (binary 000 to 111)
 * - Trigrams differing by 1 bit are connected (edges)
 * - Opposite corners differ by 3 bits (Heaven/Earth)
 *
 * Tests:
 * 1. Do adjacent vertices (edge-connected) share planets?
 * 2. Do opposite vertices have contrasting planets?
 * 3. Do face-sharing vertices have patterns?
 */

// ═══════════════════════════════════════════════════════════════════════════
// TRIGRAM CUBE GEOMETRY
// ═══════════════════════════════════════════════════════════════════════════

const TRIGRAMS = {
  'Heaven':  { binary: '111', position: -4, coords: [1, 1, 1] },
  'Lake':    { binary: '110', position: -3, coords: [1, 1, 0] },
  'Fire':    { binary: '101', position: -2, coords: [1, 0, 1] },
  'Wind':    { binary: '011', position: -1, coords: [0, 1, 1] },
  'Thunder': { binary: '100', position: +1, coords: [1, 0, 0] },
  'Water':   { binary: '010', position: +2, coords: [0, 1, 0] },
  'Mountain':{ binary: '001', position: +3, coords: [0, 0, 1] },
  'Earth':   { binary: '000', position: +4, coords: [0, 0, 0] }
};

// Calculate Hamming distance (bits that differ)
function hammingDistance(bin1, bin2) {
  let dist = 0;
  for (let i = 0; i < 3; i++) {
    if (bin1[i] !== bin2[i]) dist++;
  }
  return dist;
}

// Build adjacency (edges = 1 bit difference)
const EDGES = [];
const FACES = []; // 2 bit difference = share a face diagonal
const OPPOSITES = []; // 3 bit difference = opposite corners

const trigramNames = Object.keys(TRIGRAMS);
for (let i = 0; i < trigramNames.length; i++) {
  for (let j = i + 1; j < trigramNames.length; j++) {
    const t1 = trigramNames[i];
    const t2 = trigramNames[j];
    const dist = hammingDistance(TRIGRAMS[t1].binary, TRIGRAMS[t2].binary);

    if (dist === 1) EDGES.push([t1, t2]);
    else if (dist === 2) FACES.push([t1, t2]);
    else if (dist === 3) OPPOSITES.push([t1, t2]);
  }
}

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('GEOMETRIC HYPOTHESIS TEST: Trigram Cube');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('CUBE STRUCTURE:');
console.log('─'.repeat(50));
console.log(`Vertices (trigrams): 8`);
console.log(`Edges (1-bit diff):  ${EDGES.length} → ${EDGES.map(e => e.join('-')).join(', ')}`);
console.log(`Face diagonals (2-bit): ${FACES.length}`);
console.log(`Space diagonals (3-bit): ${OPPOSITES.length} → ${OPPOSITES.map(e => e.join('-')).join(', ')}`);

// ═══════════════════════════════════════════════════════════════════════════
// STANDING WAVE PLANETARY DATA
// ═══════════════════════════════════════════════════════════════════════════

const STANDING_WAVES = {
  'Heaven':  { '-4': ['Moon', 'Venus', 'Mars', 'Earth', 'Mars', 'Earth'] },
  'Lake':    { '-3': [null, 'Venus', null, 'Uranus', 'Pluto', 'Moon', 'Moon'] }, // L2 missing
  'Fire':    { '-2': ['Sun', 'Sun', 'Pluto', 'Pluto', 'Jupiter', 'Mars'] },
  'Wind':    { '-1': ['Venus', 'Venus', 'Mercury', 'Venus', 'Pluto', 'Uranus'] },
  'Thunder': { '+1': ['Pluto', 'Mars', 'Sun', 'Uranus', 'Sun', 'Sun'] },
  'Water':   { '+2': ['Mars', 'Sun', 'Mars', 'Saturn', 'Sun', 'Mars'] },
  'Mountain':{ '+3': ['Earth', 'Venus', 'Saturn', 'Saturn', 'Earth', 'Venus'] },
  'Earth':   { '+4': ['Venus', 'Saturn', 'Jupiter', 'Venus', 'Mercury', 'Mercury'] }
};

// Get all planets at each trigram
function getPlanetsAtTrigram(trigram) {
  const data = STANDING_WAVES[trigram];
  const pos = Object.keys(data)[0];
  return data[pos].filter(p => p !== null);
}

// Get planet counts at each trigram
function getPlanetCounts(trigram) {
  const planets = getPlanetsAtTrigram(trigram);
  const counts = {};
  planets.forEach(p => { counts[p] = (counts[p] || 0) + 1; });
  return counts;
}

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 1: Planets at Each Vertex');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

Object.entries(TRIGRAMS).forEach(([name, data]) => {
  const counts = getPlanetCounts(name);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  console.log(`${name.padEnd(10)} (${data.binary}) pos ${String(data.position).padStart(2)}: ${sorted.map(([p, c]) => `${p}:${c}`).join(', ')}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: Edge Analysis (Adjacent Vertices)
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 2: Edge Analysis (Adjacent Trigrams - 1 bit difference)');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('Do adjacent trigrams share planets?');
console.log('─'.repeat(70));

EDGES.forEach(([t1, t2]) => {
  const p1 = new Set(getPlanetsAtTrigram(t1));
  const p2 = new Set(getPlanetsAtTrigram(t2));
  const shared = [...p1].filter(p => p2.has(p));
  const only1 = [...p1].filter(p => !p2.has(p));
  const only2 = [...p2].filter(p => !p1.has(p));

  console.log(`${t1} ↔ ${t2}:`);
  console.log(`  Shared: ${shared.length > 0 ? shared.join(', ') : 'none'}`);
  if (shared.length === 0) {
    console.log(`  ${t1} only: ${only1.join(', ')}`);
    console.log(`  ${t2} only: ${only2.join(', ')}`);
  }
});

// Count shared planets across all edges
let totalShared = 0;
let totalPossible = 0;
EDGES.forEach(([t1, t2]) => {
  const p1 = new Set(getPlanetsAtTrigram(t1));
  const p2 = new Set(getPlanetsAtTrigram(t2));
  const shared = [...p1].filter(p => p2.has(p));
  totalShared += shared.length;
  totalPossible += Math.min(p1.size, p2.size);
});

console.log(`\nEdge summary: ${totalShared} shared planets across ${EDGES.length} edges`);

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: Opposite Analysis (Space Diagonals)
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 3: Opposite Analysis (3 bit difference - Space Diagonals)');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('Do opposite trigrams have contrasting planets?');
console.log('─'.repeat(70));

OPPOSITES.forEach(([t1, t2]) => {
  const counts1 = getPlanetCounts(t1);
  const counts2 = getPlanetCounts(t2);
  const p1 = new Set(getPlanetsAtTrigram(t1));
  const p2 = new Set(getPlanetsAtTrigram(t2));
  const shared = [...p1].filter(p => p2.has(p));

  console.log(`${t1} (${TRIGRAMS[t1].binary}) ↔ ${t2} (${TRIGRAMS[t2].binary}):`);
  console.log(`  ${t1}: ${Object.entries(counts1).map(([p,c]) => `${p}:${c}`).join(', ')}`);
  console.log(`  ${t2}: ${Object.entries(counts2).map(([p,c]) => `${p}:${c}`).join(', ')}`);
  console.log(`  Shared: ${shared.length > 0 ? shared.join(', ') : 'NONE (complete contrast)'}`);
  console.log();
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: Face Analysis
// ═══════════════════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('PART 4: Face Analysis (2 bit difference - Face Diagonals)');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// The 6 faces of the cube
const CUBE_FACES = [
  ['Heaven', 'Lake', 'Thunder', 'Fire'],      // z=1 face (line 3 = yang)
  ['Wind', 'Water', 'Earth', 'Mountain'],     // z=0 face (line 3 = yin)
  ['Heaven', 'Lake', 'Wind', 'Water'],        // y=1 face (line 2 = yang)
  ['Fire', 'Thunder', 'Mountain', 'Earth'],   // y=0 face (line 2 = yin)
  ['Heaven', 'Fire', 'Wind', 'Mountain'],     // x=1 face (line 1 = yang)
  ['Lake', 'Thunder', 'Water', 'Earth']       // x=0 face (line 1 = yin)
];

console.log('Planets on each cube face:');
console.log('─'.repeat(70));

CUBE_FACES.forEach((face, i) => {
  const allPlanets = [];
  face.forEach(t => allPlanets.push(...getPlanetsAtTrigram(t)));

  const counts = {};
  allPlanets.forEach(p => { counts[p] = (counts[p] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  const faceDesc = face.join(', ');
  console.log(`Face ${i + 1} (${faceDesc}):`);
  console.log(`  ${sorted.map(([p, c]) => `${p}:${c}`).join(', ')}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 5: Axis Analysis (Line 1, 2, 3 = x, y, z)
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 5: Axis Analysis (Binary bits = Cube axes)');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Line 1 (rightmost bit) = x-axis
// Line 2 (middle bit) = y-axis
// Line 3 (leftmost bit) = z-axis

console.log('Planets grouped by binary bit value:');
console.log('─'.repeat(70));

['Line 1 (x)', 'Line 2 (y)', 'Line 3 (z)'].forEach((axis, bitIndex) => {
  const yangPlanets = [];
  const yinPlanets = [];

  Object.entries(TRIGRAMS).forEach(([name, data]) => {
    const bit = data.binary[2 - bitIndex]; // binary is stored as '123' where 1=line3, 2=line2, 3=line1
    const planets = getPlanetsAtTrigram(name);
    if (bit === '1') yangPlanets.push(...planets);
    else yinPlanets.push(...planets);
  });

  const yangCounts = {};
  yangPlanets.forEach(p => { yangCounts[p] = (yangCounts[p] || 0) + 1; });
  const yinCounts = {};
  yinPlanets.forEach(p => { yinCounts[p] = (yinCounts[p] || 0) + 1; });

  console.log(`${axis}:`);
  console.log(`  Yang (1): ${Object.entries(yangCounts).sort((a,b) => b[1]-a[1]).map(([p,c]) => `${p}:${c}`).join(', ')}`);
  console.log(`  Yin (0):  ${Object.entries(yinCounts).sort((a,b) => b[1]-a[1]).map(([p,c]) => `${p}:${c}`).join(', ')}`);

  // Find planets that strongly prefer one side
  const allPlanets = new Set([...Object.keys(yangCounts), ...Object.keys(yinCounts)]);
  const biased = [];
  allPlanets.forEach(p => {
    const yang = yangCounts[p] || 0;
    const yin = yinCounts[p] || 0;
    if (yang > 0 && yin === 0) biased.push(`${p}→Yang`);
    else if (yin > 0 && yang === 0) biased.push(`${p}→Yin`);
    else if (yang >= yin * 2) biased.push(`${p}≈Yang`);
    else if (yin >= yang * 2) biased.push(`${p}≈Yin`);
  });
  if (biased.length > 0) {
    console.log(`  Biased: ${biased.join(', ')}`);
  }
  console.log();
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 6: Platonic Solid Mapping
// ═══════════════════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('PART 6: Platonic Solid Correspondences');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('Classical element correspondences:');
console.log('─'.repeat(50));
console.log('Tetrahedron (4 faces)  → Fire');
console.log('Cube (6 faces)         → Earth');
console.log('Octahedron (8 faces)   → Air');
console.log('Icosahedron (20 faces) → Water');
console.log('Dodecahedron (12 faces)→ Aether/Spirit');

console.log('\nOctahedron has 8 faces — dual to cube\'s 8 vertices!');
console.log('Each trigram vertex corresponds to an octahedron face.');

console.log('\nIf we map octahedron faces to trigrams:');
const ELEMENT_MAP = {
  'Heaven': 'Spirit/Aether (pure yang)',
  'Earth': 'Earth (pure yin)',
  'Fire': 'Fire (illumination)',
  'Water': 'Water (depth)',
  'Thunder': 'Fire-initiating',
  'Wind': 'Air (penetrating)',
  'Mountain': 'Earth-stabilizing',
  'Lake': 'Water-reflecting'
};

Object.entries(ELEMENT_MAP).forEach(([trigram, element]) => {
  const counts = getPlanetCounts(trigram);
  const top = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];
  console.log(`  ${trigram.padEnd(10)} → ${element.padEnd(20)} → Top planet: ${top ? top[0] : 'n/a'}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// CONCLUSION
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('CONCLUSION');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Check for strong patterns
const patterns = [];

// Check opposite contrast
let oppositeContrast = 0;
OPPOSITES.forEach(([t1, t2]) => {
  const p1 = new Set(getPlanetsAtTrigram(t1));
  const p2 = new Set(getPlanetsAtTrigram(t2));
  const shared = [...p1].filter(p => p2.has(p));
  if (shared.length === 0) oppositeContrast++;
});

if (oppositeContrast >= 3) {
  patterns.push(`${oppositeContrast}/4 opposite pairs have NO shared planets (geometric contrast)`);
}

// Check edge similarity
let edgeSimilarity = 0;
EDGES.forEach(([t1, t2]) => {
  const p1 = new Set(getPlanetsAtTrigram(t1));
  const p2 = new Set(getPlanetsAtTrigram(t2));
  const shared = [...p1].filter(p => p2.has(p));
  if (shared.length >= 2) edgeSimilarity++;
});

if (edgeSimilarity >= 6) {
  patterns.push(`${edgeSimilarity}/12 edges share 2+ planets (geometric continuity)`);
}

if (patterns.length > 0) {
  console.log('GEOMETRIC PATTERNS FOUND:');
  patterns.forEach(p => console.log(`  ✓ ${p}`));
  console.log('\n  The cube geometry MAY structure planetary assignments.');
} else {
  console.log('NO STRONG GEOMETRIC PATTERNS:');
  console.log('  Planetary assignments do not clearly follow cube geometry.');
}

console.log('\n─'.repeat(70));
console.log('The trigrams form a natural cube, but planetary assignments');
console.log('do not obviously follow edges, faces, or diagonals.');
console.log('─'.repeat(70));
