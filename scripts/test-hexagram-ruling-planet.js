/**
 * Hexagram Ruling Planet Hypothesis
 *
 * 7 classical planets × 8 positions = 56 = non-standing-wave hexagrams
 *
 * What if each HEXAGRAM (not line) has a ruling planet based on:
 * - Which position it moves FROM
 * - Which position it moves TO
 * - The movement type (cross-zero vs same-side)
 *
 * Then the 6 lines modify that ruling planet somehow.
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

const gateIndex = {};
const emMappings = emLines.mappings || emLines;
for (const line of emMappings) {
  if (!gateIndex[line.gate]) {
    gateIndex[line.gate] = {
      innerPos: line.electromagnetic?.innerTrigram?.position,
      outerPos: line.electromagnetic?.outerTrigram?.position,
      gateType: line.electromagnetic?.gateType,
      innerTrigram: line.electromagnetic?.innerTrigram?.name,
      outerTrigram: line.electromagnetic?.outerTrigram?.name
    };
  }
}

console.log('═'.repeat(75));
console.log('HEXAGRAM RULING PLANET HYPOTHESIS');
console.log('═'.repeat(75));

console.log('\n7 × 8 = 56 = non-standing-wave hexagrams');
console.log('Each hexagram might have a "ruling planet" based on its movement.\n');

// ═══════════════════════════════════════════════════════════════════════════
// TEST 1: Most Common Planet per Hexagram
// ═══════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(75));
console.log('TEST 1: Dominant Planet per Hexagram');
console.log('═'.repeat(75));

const hexagramPlanets = {};

for (let gate = 1; gate <= 64; gate++) {
  hexagramPlanets[gate] = {};

  for (let line = 1; line <= 6; line++) {
    const key = `${gate}.${line}`;
    const planets = hdIndex[key];
    if (!planets) continue;

    for (const p of planets) {
      hexagramPlanets[gate][p] = (hexagramPlanets[gate][p] || 0) + 1;
    }
  }
}

// Find dominant planet for each hexagram
const hexDominant = {};
for (const [gate, counts] of Object.entries(hexagramPlanets)) {
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0) {
    hexDominant[gate] = {
      planet: sorted[0][0],
      count: sorted[0][1],
      total: Object.values(counts).reduce((s, c) => s + c, 0),
      dominance: sorted[0][1] / Object.values(counts).reduce((s, c) => s + c, 0)
    };
  }
}

// Show hexagrams with clear dominants (>= 3 out of 6)
console.log('\nHexagrams with dominant planet (3+ of 6 lines):');
console.log('Gate  Type                Inner→Outer  Dominant  Count');
console.log('─'.repeat(65));

const clearDominants = Object.entries(hexDominant)
  .filter(([_, d]) => d.count >= 3)
  .sort((a, b) => b[1].count - a[1].count);

for (const [gate, dom] of clearDominants) {
  const g = gateIndex[gate];
  const movement = `${g?.innerPos}→${g?.outerPos}`;
  console.log(`${gate.padStart(4)}  ${(g?.gateType || '').padEnd(20)} ${movement.padEnd(10)}  ${dom.planet.padEnd(9)} ${dom.count}/6`);
}

console.log(`\nHexagrams with clear dominant: ${clearDominants.length}/64`);

// ═══════════════════════════════════════════════════════════════════════════
// TEST 2: Movement Vector → Planet Mapping
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 2: Movement Vector → Planet');
console.log('═'.repeat(75));

console.log('\nDoes (innerPos, outerPos) predict dominant planet?');
console.log('─'.repeat(60));

const movementPlanets = {};

for (const [gate, dom] of Object.entries(hexDominant)) {
  const g = gateIndex[gate];
  if (!g) continue;

  const movement = `${g.innerPos}→${g.outerPos}`;
  if (!movementPlanets[movement]) movementPlanets[movement] = {};
  movementPlanets[movement][dom.planet] = (movementPlanets[movement][dom.planet] || 0) + 1;
}

console.log('\nMovement   Planets (dominant hexagrams)');
console.log('─'.repeat(60));

for (const [movement, planets] of Object.entries(movementPlanets).sort()) {
  const sorted = Object.entries(planets).sort((a, b) => b[1] - a[1]);
  const total = Object.values(planets).reduce((s, c) => s + c, 0);
  const str = sorted.map(([p, c]) => `${p}:${c}`).join(', ');
  console.log(`${movement.padEnd(10)} ${str}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 3: Inner Position → Planet
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 3: Inner Position → Dominant Planet');
console.log('═'.repeat(75));

const innerPosPlanets = {};

for (const [gate, dom] of Object.entries(hexDominant)) {
  const g = gateIndex[gate];
  if (!g) continue;

  if (!innerPosPlanets[g.innerPos]) innerPosPlanets[g.innerPos] = {};
  innerPosPlanets[g.innerPos][dom.planet] = (innerPosPlanets[g.innerPos][dom.planet] || 0) + 1;
}

console.log('\nInner Position   Top Planets');
console.log('─'.repeat(50));

for (let pos = -4; pos <= 4; pos++) {
  if (pos === 0) continue;
  const planets = innerPosPlanets[pos];
  if (!planets) continue;

  const sorted = Object.entries(planets).sort((a, b) => b[1] - a[1]);
  const str = sorted.slice(0, 4).map(([p, c]) => `${p}:${c}`).join(', ');
  console.log(`${pos.toString().padStart(4)}             ${str}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 4: Do Standing Waves Have Single Dominant?
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 4: Standing Wave Dominant Planets');
console.log('═'.repeat(75));

const standingWaveGates = [1, 2, 29, 30, 51, 52, 57, 58];

console.log('\nStanding wave hexagrams:');
console.log('Gate  Position  Dominant  Lines    All Planets');
console.log('─'.repeat(65));

for (const gate of standingWaveGates) {
  const g = gateIndex[gate];
  const dom = hexDominant[gate];
  const planets = hexagramPlanets[gate];

  const str = Object.entries(planets)
    .sort((a, b) => b[1] - a[1])
    .map(([p, c]) => `${p}:${c}`)
    .join(', ');

  console.log(`${gate.toString().padStart(4)}  ${(g?.innerPos?.toString() || '').padStart(8)}     ${(dom?.planet || '').padEnd(9)} ${dom?.count || 0}/6    ${str}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 5: The 56 Non-Standing-Wave Hexagrams
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 5: 56 Non-Standing-Wave Hexagrams');
console.log('═'.repeat(75));

console.log('\nIf 7 planets × 8 positions = 56, each planet should appear ~8 times');
console.log('as the dominant for non-standing-wave hexagrams.');
console.log('─'.repeat(60));

const nonSWDominants = {};

for (const [gate, dom] of Object.entries(hexDominant)) {
  if (standingWaveGates.includes(parseInt(gate))) continue;

  nonSWDominants[dom.planet] = (nonSWDominants[dom.planet] || 0) + 1;
}

console.log('\nPlanet dominance in 56 non-standing-wave hexagrams:');
const sorted = Object.entries(nonSWDominants).sort((a, b) => b[1] - a[1]);
for (const [planet, count] of sorted) {
  const expected = 56 / 7;
  const ratio = (count / expected).toFixed(2);
  console.log(`  ${planet.padEnd(10)} ${count.toString().padStart(2)} hexagrams (expected ~8, ratio: ${ratio})`);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 6: Classical Planet Assignment
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 6: Classical Planet × Position Matrix');
console.log('═'.repeat(75));

console.log('\nIf 7 classical planets map to 8 positions (one planet doubles),');
console.log('which planet is associated with which position?');
console.log('─'.repeat(60));

const CLASSICAL = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

const positionPlanetMatrix = {};

for (const [gate, dom] of Object.entries(hexDominant)) {
  const g = gateIndex[gate];
  if (!g || !CLASSICAL.includes(dom.planet)) continue;

  if (!positionPlanetMatrix[g.innerPos]) positionPlanetMatrix[g.innerPos] = {};
  positionPlanetMatrix[g.innerPos][dom.planet] = (positionPlanetMatrix[g.innerPos][dom.planet] || 0) + 1;
}

console.log('\nInner Position → Classical Planet Affinity:');
console.log('Pos    Sun  Moon Merc Venu Mars Jupi Satu  DOMINANT');
console.log('─'.repeat(65));

for (let pos = -4; pos <= 4; pos++) {
  if (pos === 0) continue;
  const row = [pos.toString().padStart(3)];
  const counts = positionPlanetMatrix[pos] || {};

  for (const p of CLASSICAL) {
    row.push((counts[p] || 0).toString().padStart(4));
  }

  // Find dominant
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  row.push('  ' + (sorted[0]?.[0] || '—'));

  console.log(row.join(' '));
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 7: Can We Derive a Planet-Position Mapping?
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 7: Derived Planet-Position Mapping');
console.log('═'.repeat(75));

// Assign each position to its most common classical planet
const positionAssignment = {};

for (let pos = -4; pos <= 4; pos++) {
  if (pos === 0) continue;
  const counts = positionPlanetMatrix[pos] || {};
  const classical = Object.entries(counts)
    .filter(([p]) => CLASSICAL.includes(p))
    .sort((a, b) => b[1] - a[1]);

  positionAssignment[pos] = classical[0]?.[0] || null;
}

console.log('\nDerived Position → Planet mapping:');
for (let pos = -4; pos <= 4; pos++) {
  if (pos === 0) continue;
  console.log(`  Position ${pos.toString().padStart(2)} → ${positionAssignment[pos] || 'none'}`);
}

// Check if this covers all 7 classical planets
const assignedPlanets = new Set(Object.values(positionAssignment).filter(p => p));
const missingPlanets = CLASSICAL.filter(p => !assignedPlanets.has(p));
const duplicatePlanets = CLASSICAL.filter(p =>
  Object.values(positionAssignment).filter(a => a === p).length > 1
);

console.log(`\nAssigned: ${[...assignedPlanets].join(', ')}`);
console.log(`Missing: ${missingPlanets.join(', ') || 'none'}`);
console.log(`Duplicate (appears twice): ${duplicatePlanets.join(', ') || 'none'}`);

// ═══════════════════════════════════════════════════════════════════════════
// SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SYNTHESIS');
console.log('═'.repeat(75));

console.log(`
FINDINGS:

1. HEXAGRAM DOMINANCE
   ${clearDominants.length}/64 hexagrams have a dominant planet (3+ lines)
   This suggests hexagram-level planetary affinity exists

2. POSITION-PLANET CORRELATION
   Each position has preferred planets
   But no single planet perfectly maps to one position

3. CLASSICAL PLANET DISTRIBUTION (in 56 non-SW hexagrams)
   ${sorted.slice(0, 3).map(([p, c]) => `${p}: ${c}`).join(', ')}
   Not perfectly uniform (expected 8 each)

4. DERIVED MAPPING
   ${Object.entries(positionAssignment).map(([p, pl]) => `${p}→${pl}`).join(', ')}
   ${missingPlanets.length > 0 ? `Missing: ${missingPlanets.join(', ')}` : 'All 7 covered'}

The 7×8=56 structure is PRESENT but not CLEAN.
The mapping is probabilistic, not deterministic.
`);
