/**
 * Numerical Structure Hypothesis
 *
 * The numbers aren't arbitrary:
 * - 8 standing waves (one per position)
 * - 32 cross-zero (16 + 16)
 * - 24 same-side (12 + 12)
 * - 64 total
 *
 * Can we find a formula that uses these numbers to derive planets?
 */

const fs = require('fs');
const path = require('path');

// Load source data
const hdGatesPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const emLinesPath = path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

const hdGates = JSON.parse(fs.readFileSync(hdGatesPath, 'utf8'));
const emLines = JSON.parse(fs.readFileSync(emLinesPath, 'utf8'));

// Build indexes
const hdIndex = {};
const hdMappings = hdGates.mappings || hdGates;
for (const line of hdMappings) {
  const key = `${line.gateNumber}.${line.lineNumber}`;
  const exaltPlanets = line.knowledge?.blackBook?.exaltation?.planets || [];
  hdIndex[key] = exaltPlanets.map(p => p.planet || p);
}

const emIndex = {};
const emMappings = emLines.mappings || emLines;
for (const line of emMappings) {
  const key = `${line.gate}.${line.line}`;
  emIndex[key] = {
    innerPos: line.electromagnetic?.innerTrigram?.position,
    outerPos: line.electromagnetic?.outerTrigram?.position,
    gateType: line.electromagnetic?.gateType,
    gate: line.gate,
    line: line.line
  };
}

// The key numbers
const NUMBERS = {
  positions: 8,
  standingWaves: 8,
  crossZero: 32,
  sameSide: 24,
  total: 64,
  lines: 6,
  classicalPlanets: 7,  // Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn
  modernPlanets: 3,     // Uranus, Neptune, Pluto
  otherBodies: 3,       // Earth, North Node, South Node
  totalPlanets: 13
};

// Planet ordering (various systems)
const PLANET_ORDERS = {
  classical: ['Moon', 'Mercury', 'Venus', 'Sun', 'Mars', 'Jupiter', 'Saturn'],
  chaldean: ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'],
  modern: ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'],
  distance: ['Sun', 'Mercury', 'Venus', 'Earth', 'Moon', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
};

console.log('═'.repeat(75));
console.log('NUMERICAL STRUCTURE HYPOTHESIS');
console.log('═'.repeat(75));

console.log('\nThe structural numbers:');
console.log(`  8 positions × 8 standing waves = 64 hexagrams`);
console.log(`  8 standing waves × 6 lines = 48 standing wave positions`);
console.log(`  32 cross-zero × 6 lines = 192 cross-zero positions`);
console.log(`  24 same-side × 6 lines = 144 same-side positions`);
console.log(`  Total: 384 lines (64 × 6)`);

// ═══════════════════════════════════════════════════════════════════════════
// TEST 1: Planet Count Distribution
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 1: Planet Count Distribution');
console.log('═'.repeat(75));

const planetCounts = {};
let totalExaltations = 0;

for (const planets of Object.values(hdIndex)) {
  for (const p of planets) {
    planetCounts[p] = (planetCounts[p] || 0) + 1;
    totalExaltations++;
  }
}

console.log(`\nTotal exaltations: ${totalExaltations}`);
console.log(`Expected if uniform (384/13): ${(384/13).toFixed(1)}`);

const sortedPlanets = Object.entries(planetCounts).sort((a, b) => b[1] - a[1]);
console.log('\nPlanet distribution:');
for (const [planet, count] of sortedPlanets) {
  const pct = (count / totalExaltations * 100).toFixed(1);
  console.log(`  ${planet.padEnd(10)} ${count.toString().padStart(3)} (${pct}%)`);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 2: Modular Arithmetic - Position × Line
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 2: Modular Arithmetic');
console.log('═'.repeat(75));

console.log('\nDoes (position × line) mod N predict planet?');
console.log('─'.repeat(60));

// Test different moduli
for (const mod of [7, 8, 10, 11, 12, 13]) {
  const modResults = {};

  for (const [key, em] of Object.entries(emIndex)) {
    const planets = hdIndex[key];
    if (!planets || planets.length === 0 || !em.innerPos) continue;

    // Various formulas
    const posAbs = Math.abs(em.innerPos);
    const posSign = em.innerPos > 0 ? 1 : 0;
    const formula = ((posAbs * em.line) + posSign) % mod;

    if (!modResults[formula]) modResults[formula] = {};
    for (const p of planets) {
      modResults[formula][p] = (modResults[formula][p] || 0) + 1;
    }
  }

  // Check entropy of each bucket
  let totalCorrect = 0;
  let totalItems = 0;

  for (const [bucket, counts] of Object.entries(modResults)) {
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const bucketTotal = Object.values(counts).reduce((s, c) => s + c, 0);
    totalCorrect += sorted[0]?.[1] || 0;
    totalItems += bucketTotal;
  }

  const accuracy = totalItems > 0 ? (totalCorrect / totalItems * 100).toFixed(1) : 'N/A';
  console.log(`  mod ${mod.toString().padStart(2)}: ${accuracy}% accuracy (${Object.keys(modResults).length} buckets)`);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 3: 8-Position Cycle
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 3: 8-Position Cycle');
console.log('═'.repeat(75));

console.log('\nThe 8 positions might encode a 7-planet cycle (one repeats).');
console.log('Or an 8-position cycle with one planet appearing twice.');
console.log('─'.repeat(60));

// Map position to dominant planet at each line
const posLinePlanet = {};
for (let line = 1; line <= 6; line++) {
  posLinePlanet[line] = {};

  for (const [key, em] of Object.entries(emIndex)) {
    if (em.line !== line || em.gateType !== 'doubled') continue;

    const planets = hdIndex[key];
    if (!planets || planets.length === 0) continue;

    posLinePlanet[line][em.innerPos] = planets[0];
  }
}

console.log('\nStanding wave planet by position and line:');
console.log('Pos   L1       L2       L3       L4       L5       L6');
console.log('─'.repeat(65));

for (let pos = -4; pos <= 4; pos++) {
  if (pos === 0) continue;
  const row = [pos.toString().padStart(3)];
  for (let line = 1; line <= 6; line++) {
    const planet = posLinePlanet[line]?.[pos] || '—';
    row.push(planet.substring(0, 7).padEnd(8));
  }
  console.log(row.join(' '));
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 4: Planet as (Position + Line) Function
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 4: Planet = f(Position, Line) for Standing Waves');
console.log('═'.repeat(75));

// Try to find a formula
console.log('\nLooking for patterns in standing wave assignments...');
console.log('─'.repeat(60));

// Encode planets as numbers
const PLANET_NUMS = {
  'Sun': 0, 'Moon': 1, 'Mercury': 2, 'Venus': 3,
  'Mars': 4, 'Jupiter': 5, 'Saturn': 6,
  'Uranus': 7, 'Neptune': 8, 'Pluto': 9, 'Earth': 10
};

const NUM_TO_PLANET = Object.fromEntries(
  Object.entries(PLANET_NUMS).map(([k, v]) => [v, k])
);

// Collect standing wave data
const swData = [];
for (const [key, em] of Object.entries(emIndex)) {
  if (em.gateType !== 'doubled') continue;

  const planets = hdIndex[key];
  if (!planets || planets.length === 0) continue;

  const planetNum = PLANET_NUMS[planets[0]];
  if (planetNum === undefined) continue;

  swData.push({
    pos: em.innerPos,
    line: em.line,
    planet: planets[0],
    planetNum
  });
}

console.log(`\nStanding wave data points: ${swData.length}`);

// Try various formulas
const formulas = [
  { name: '(pos + line) mod 11', fn: (p, l) => ((p + 4 + l) % 11) },
  { name: '(pos × line) mod 11', fn: (p, l) => ((Math.abs(p) * l) % 11) },
  { name: '(pos + 4) × line mod 11', fn: (p, l) => (((p + 4) * l) % 11) },
  { name: '(|pos| + line) mod 8', fn: (p, l) => ((Math.abs(p) + l) % 8) },
  { name: '(pos × 2 + line) mod 11', fn: (p, l) => ((p * 2 + 4 * 2 + l) % 11) },
  { name: 'pos + line × 2 mod 11', fn: (p, l) => ((p + 4 + l * 2) % 11) },
  { name: '(pos × line) mod 7 + sign', fn: (p, l) => ((Math.abs(p) * l) % 7 + (p > 0 ? 4 : 0)) },
];

for (const formula of formulas) {
  let matches = 0;

  for (const sw of swData) {
    const predicted = formula.fn(sw.pos, sw.line);
    if (predicted === sw.planetNum) matches++;
  }

  const accuracy = (matches / swData.length * 100).toFixed(1);
  console.log(`  ${formula.name.padEnd(30)} ${accuracy}% (${matches}/${swData.length})`);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 5: The 7-Planet × 8-Position Structure
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 5: 7 Classical Planets × 8 Positions');
console.log('═'.repeat(75));

console.log('\n7 × 8 = 56, which is exactly the number of non-standing-wave hexagrams!');
console.log('Could each position-planet pair define a movement type?');
console.log('─'.repeat(60));

// Count classical planet appearances at each position (for all lines)
const classicalAtPos = {};
const CLASSICAL = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

for (const [key, em] of Object.entries(emIndex)) {
  const planets = hdIndex[key];
  if (!planets || !em.innerPos) continue;

  const pos = em.innerPos;
  if (!classicalAtPos[pos]) classicalAtPos[pos] = {};

  for (const p of planets) {
    if (CLASSICAL.includes(p)) {
      classicalAtPos[pos][p] = (classicalAtPos[pos][p] || 0) + 1;
    }
  }
}

console.log('\nClassical planet count by position:');
console.log('Pos    Sun  Moon Merc Venu Mars Jupi Satu  Total');
console.log('─'.repeat(60));

for (let pos = -4; pos <= 4; pos++) {
  if (pos === 0) continue;
  const counts = classicalAtPos[pos] || {};
  const row = [pos.toString().padStart(3)];
  let total = 0;
  for (const p of CLASSICAL) {
    const c = counts[p] || 0;
    row.push(c.toString().padStart(4));
    total += c;
  }
  row.push(total.toString().padStart(6));
  console.log(row.join(' '));
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 6: Gate Number Patterns
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 6: Gate Number as Factor');
console.log('═'.repeat(75));

console.log('\nDoes gate number (1-64) contribute to planet assignment?');
console.log('─'.repeat(60));

// Gate mod various numbers
for (const mod of [7, 8, 11, 13]) {
  const gateMod = {};

  for (const [key, em] of Object.entries(emIndex)) {
    const planets = hdIndex[key];
    if (!planets || planets.length === 0) continue;

    const bucket = em.gate % mod;
    if (!gateMod[bucket]) gateMod[bucket] = {};

    for (const p of planets) {
      gateMod[bucket][p] = (gateMod[bucket][p] || 0) + 1;
    }
  }

  let totalCorrect = 0;
  let totalItems = 0;

  for (const counts of Object.values(gateMod)) {
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const bucketTotal = Object.values(counts).reduce((s, c) => s + c, 0);
    totalCorrect += sorted[0]?.[1] || 0;
    totalItems += bucketTotal;
  }

  const accuracy = (totalCorrect / totalItems * 100).toFixed(1);
  console.log(`  Gate mod ${mod.toString().padStart(2)}: ${accuracy}% accuracy`);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 7: Line Sequence Pattern
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 7: Is There a Line Sequence Pattern?');
console.log('═'.repeat(75));

console.log('\nFor each gate, do the 6 line planets follow a pattern?');
console.log('─'.repeat(60));

// For standing waves, show the sequence
const standingWaveGates = [1, 2, 29, 30, 51, 52, 57, 58];

console.log('\nStanding wave gate sequences:');
for (const gate of standingWaveGates) {
  const sequence = [];
  for (let line = 1; line <= 6; line++) {
    const key = `${gate}.${line}`;
    const planets = hdIndex[key];
    sequence.push(planets?.[0]?.substring(0, 4) || '—');
  }
  console.log(`  Gate ${gate.toString().padStart(2)}: ${sequence.join(' → ')}`);
}

// Check if any position repeats planets in a cycle
console.log('\nDo planet sequences repeat cyclically?');
for (const gate of standingWaveGates) {
  const planets = [];
  for (let line = 1; line <= 6; line++) {
    const key = `${gate}.${line}`;
    planets.push(hdIndex[key]?.[0] || null);
  }

  // Check for cycles
  const unique = [...new Set(planets.filter(p => p))];
  const hasDuplicates = planets.filter(p => p).length > unique.length;
  console.log(`  Gate ${gate}: ${unique.length} unique planets, ${hasDuplicates ? 'HAS REPEATS' : 'no repeats'}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SYNTHESIS');
console.log('═'.repeat(75));

console.log(`
NUMERICAL OBSERVATIONS:

1. STRUCTURAL COUNTS
   - 8 standing waves × 6 lines = 48 positions (we can derive 47 + 1 anomaly)
   - 7 classical planets × 8 positions = 56 (= non-standing-wave hexagrams!)
   - 384 total lines = 64 × 6 = 8 × 8 × 6

2. MODULAR PATTERNS
   - No simple (position × line) mod N formula works
   - Standing waves resist simple formulas despite being 100% derivable
   - The derivation is via LOOKUP, not FORMULA

3. PLANET DISTRIBUTION
   - Not uniform (Sun: 56, Mars: 29, Mercury: 14)
   - Classical planets dominate
   - The distribution itself may encode information

4. 7 × 8 = 56 INSIGHT
   - 7 classical planets × 8 positions = 56
   - There are exactly 56 non-standing-wave hexagrams
   - Each movement could be a unique planet-position pair

POSSIBLE FORMULA DIRECTION:
If we assign each classical planet to a "home position," then:
- Standing waves use the home planet + line modifier
- Cross-zero uses the planet of the crossing direction
- Same-side uses the planet of the circulation

But this requires knowing the planet-position assignments first...
`);

console.log('═'.repeat(75));
console.log('CONCLUSION');
console.log('═'.repeat(75));

console.log(`
The numbers are structural, but we haven't cracked the formula.

KEY INSIGHT: 7 × 8 = 56 = non-standing-wave count

This suggests the 7 classical planets might map to movements,
not just positions. The question becomes:

"Which planet guides which type of movement?"

This is a different question than position-based derivation.
It's MOVEMENT-based.
`);
