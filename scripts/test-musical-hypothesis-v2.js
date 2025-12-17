/**
 * Musical Hypothesis Test v2 - Harmonic Ratios and Multiple Traditions
 *
 * Tests whether standing wave planetary assignments correlate with
 * traditional planetary-musical mappings using harmonic ratios.
 */

// Standing wave assignments (100% verified)
const STANDING_WAVE_ASSIGNMENTS = {
  '-4': { gate: 1,  trigram: 'Heaven',   planets: ['Moon', 'Venus', 'Mars', 'Earth', 'Mars', 'Earth'] },
  '-3': { gate: 58, trigram: 'Lake',     planets: ['Venus', null, 'Uranus', 'Pluto', 'Moon', 'Moon'] },
  '-2': { gate: 30, trigram: 'Fire',     planets: ['Sun', 'Sun', 'Pluto', 'Pluto', 'Jupiter', 'Mars'] },
  '-1': { gate: 57, trigram: 'Wind',     planets: ['Venus', 'Venus', 'Mercury', 'Venus', 'Pluto', 'Uranus'] },
  '+1': { gate: 51, trigram: 'Thunder',  planets: ['Pluto', 'Mars', 'Sun', 'Uranus', 'Sun', 'Sun'] },
  '+2': { gate: 29, trigram: 'Water',    planets: ['Mars', 'Sun', 'Mars', 'Saturn', 'Sun', 'Mars'] },
  '+3': { gate: 52, trigram: 'Mountain', planets: ['Earth', 'Venus', 'Saturn', 'Saturn', 'Earth', 'Venus'] },
  '+4': { gate: 2,  trigram: 'Earth',    planets: ['Venus', 'Saturn', 'Jupiter', 'Venus', 'Mercury', 'Mercury'] }
};

// Position to Harmonic Ratio mapping (symmetric around zero)
const POSITION_HARMONICS = {
  '-4': { ratio: '2:1', interval: 'Octave', cents: 1200, description: 'Void pole' },
  '-3': { ratio: '3:2', interval: 'Perfect Fifth', cents: 702, description: 'Void storage' },
  '-2': { ratio: '4:3', interval: 'Perfect Fourth', cents: 498, description: 'Void flow' },
  '-1': { ratio: '5:4', interval: 'Major Third', cents: 386, description: 'Void gate' },
  '+1': { ratio: '5:4', interval: 'Major Third', cents: 386, description: 'Material gate' },
  '+2': { ratio: '4:3', interval: 'Perfect Fourth', cents: 498, description: 'Material flow' },
  '+3': { ratio: '3:2', interval: 'Perfect Fifth', cents: 702, description: 'Material storage' },
  '+4': { ratio: '2:1', interval: 'Octave', cents: 1200, description: 'Material pole' }
};

// Multiple Traditional Systems
const TRADITIONS = {
  // Medieval 7-planet system (Ptolemaic spheres)
  medieval: {
    name: 'Medieval (Ptolemaic Spheres)',
    mapping: {
      'Moon':    { note: 'B', sphere: 1, interval: 'Leading tone' },
      'Mercury': { note: 'C', sphere: 2, interval: 'Unison/Octave' },
      'Venus':   { note: 'D', sphere: 3, interval: 'Major Second' },
      'Sun':     { note: 'E', sphere: 4, interval: 'Major Third' },
      'Mars':    { note: 'F', sphere: 5, interval: 'Perfect Fourth' },
      'Jupiter': { note: 'G', sphere: 6, interval: 'Perfect Fifth' },
      'Saturn':  { note: 'A', sphere: 7, interval: 'Major Sixth' }
    }
  },

  // Kepler's Harmonices Mundi (orbital velocity ratios)
  kepler: {
    name: 'Kepler (Orbital Velocities)',
    mapping: {
      'Saturn':  { interval: 'Major Third', ratio: '5:4', range: 'G-B' },
      'Jupiter': { interval: 'Minor Third', ratio: '6:5', range: 'G-Bb' },
      'Mars':    { interval: 'Octave', ratio: '2:1', range: 'F-f' },
      'Earth':   { interval: 'Semitone', ratio: '16:15', range: 'G-Ab' },
      'Venus':   { interval: 'Minor Second', ratio: '25:24', range: 'E-E' },
      'Mercury': { interval: 'Minor Tenth', ratio: '12:5', range: 'A-C' }
    }
  },

  // Chinese 5-element pentatonic
  chinese: {
    name: 'Chinese (Five Elements)',
    mapping: {
      'Jupiter': { note: 'Jue (E)', element: 'Wood', interval: 'Major Third' },
      'Mars':    { note: 'Zhi (G)', element: 'Fire', interval: 'Perfect Fifth' },
      'Saturn':  { note: 'Gong (C)', element: 'Earth', interval: 'Unison' },
      'Venus':   { note: 'Shang (D)', element: 'Metal', interval: 'Major Second' },
      'Mercury': { note: 'Yu (A)', element: 'Water', interval: 'Major Sixth' }
    }
  },

  // Russell's 9 octaves (reconstructed)
  russell: {
    name: 'Russell (Wave Octaves)',
    mapping: {
      // Russell placed elements in octave positions based on wave mechanics
      // Extrapolating to planets based on his principles:
      'Sun':     { position: 'Amplitude maximum', wave: 'Compression peak' },
      'Moon':    { position: 'Amplitude maximum (reflected)', wave: 'Expansion peak' },
      'Mercury': { position: 'Between states', wave: 'Transition' },
      'Venus':   { position: 'Harmonic node', wave: 'Standing wave point' },
      'Mars':    { position: 'Force application', wave: 'Compression' },
      'Jupiter': { position: 'Expansion', wave: 'Radiation' },
      'Saturn':  { position: 'Crystallization', wave: 'Maximum form' }
    }
  }
};

// Interval to position mapping (for testing)
const INTERVAL_TO_POSITIONS = {
  'Octave':         ['-4', '+4'],
  'Perfect Fifth':  ['-3', '+3'],
  'Perfect Fourth': ['-2', '+2'],
  'Major Third':    ['-1', '+1'],
  'Major Second':   [],  // Not in our position system
  'Major Sixth':    [],  // Not in our position system
  'Minor Third':    [],  // Not in our position system
  'Unison':         []   // Position 0 doesn't exist
};

console.log('═'.repeat(75));
console.log('MUSICAL HYPOTHESIS TEST v2 - Harmonic Ratios');
console.log('═'.repeat(75));

// ═══════════════════════════════════════════════════════════════════════════
// TEST 1: Position-Harmonic Mapping Display
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 1: Position as Harmonic Interval');
console.log('═'.repeat(75));
console.log('\nSymmetric mapping around zero point:\n');
console.log('Position  Ratio   Interval          Description       Dominant Planet');
console.log('─'.repeat(75));

for (const pos of ['-4', '-3', '-2', '-1', '+1', '+2', '+3', '+4']) {
  const h = POSITION_HARMONICS[pos];
  const planets = STANDING_WAVE_ASSIGNMENTS[pos].planets.filter(p => p);
  const counts = {};
  planets.forEach(p => counts[p] = (counts[p] || 0) + 1);
  const dominant = Object.entries(counts).sort((a,b) => b[1] - a[1])[0];

  console.log(`  ${pos.padStart(2)}      ${h.ratio.padEnd(5)}   ${h.interval.padEnd(16)}  ${h.description.padEnd(16)}  ${dominant ? dominant[0] : 'none'}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 2: Medieval Interval Matching
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 2: Medieval System - Do planets appear at their traditional intervals?');
console.log('═'.repeat(75));

const medieval = TRADITIONS.medieval.mapping;

console.log('\nPlanet → Traditional Interval → Expected Positions → Actual Appearances');
console.log('─'.repeat(75));

let medievalMatches = 0;
let medievalTests = 0;

for (const [planet, data] of Object.entries(medieval)) {
  const expectedPositions = INTERVAL_TO_POSITIONS[data.interval] || [];

  // Find where this planet actually appears
  const actualPositions = [];
  for (const [pos, info] of Object.entries(STANDING_WAVE_ASSIGNMENTS)) {
    if (info.planets.includes(planet)) {
      actualPositions.push(pos);
    }
  }

  // Check overlap
  const overlap = expectedPositions.filter(p => actualPositions.includes(p));
  const match = overlap.length > 0 ? '✓' : '✗';
  if (expectedPositions.length > 0) {
    medievalTests++;
    if (overlap.length > 0) medievalMatches++;
  }

  console.log(`${planet.padEnd(10)} ${data.interval.padEnd(16)} ${expectedPositions.join(',').padEnd(8) || '(none)'} → ${actualPositions.join(',').padEnd(20)} ${match}`);
}

console.log(`\nMedieval matches: ${medievalMatches}/${medievalTests}`);

// ═══════════════════════════════════════════════════════════════════════════
// TEST 3: Kepler's System - Orbital Velocity Intervals
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 3: Kepler System - Orbital velocity intervals');
console.log('═'.repeat(75));

const kepler = TRADITIONS.kepler.mapping;

console.log('\nPlanet → Kepler Interval → Expected Positions → Actual Appearances');
console.log('─'.repeat(75));

let keplerMatches = 0;
let keplerTests = 0;

for (const [planet, data] of Object.entries(kepler)) {
  const expectedPositions = INTERVAL_TO_POSITIONS[data.interval] || [];

  const actualPositions = [];
  for (const [pos, info] of Object.entries(STANDING_WAVE_ASSIGNMENTS)) {
    if (info.planets.includes(planet)) {
      actualPositions.push(pos);
    }
  }

  const overlap = expectedPositions.filter(p => actualPositions.includes(p));
  const match = overlap.length > 0 ? '✓' : '✗';
  if (expectedPositions.length > 0) {
    keplerTests++;
    if (overlap.length > 0) keplerMatches++;
  }

  console.log(`${planet.padEnd(10)} ${data.interval.padEnd(16)} ${expectedPositions.join(',').padEnd(8) || '(none)'} → ${actualPositions.join(',').padEnd(20)} ${match}`);
}

console.log(`\nKepler matches: ${keplerMatches}/${keplerTests}`);

// ═══════════════════════════════════════════════════════════════════════════
// TEST 4: Symmetric Position Pairs
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 4: Symmetric Position Pairs (Same Interval, Opposite Domain)');
console.log('═'.repeat(75));

console.log('\nIf positions are harmonic intervals, symmetric pairs should relate:');
console.log('─'.repeat(75));

const symmetricPairs = [['-4', '+4'], ['-3', '+3'], ['-2', '+2'], ['-1', '+1']];

for (const [neg, pos] of symmetricPairs) {
  const negPlanets = new Set(STANDING_WAVE_ASSIGNMENTS[neg].planets.filter(p => p));
  const posPlanets = new Set(STANDING_WAVE_ASSIGNMENTS[pos].planets.filter(p => p));

  const shared = [...negPlanets].filter(p => posPlanets.has(p));
  const negOnly = [...negPlanets].filter(p => !posPlanets.has(p));
  const posOnly = [...posPlanets].filter(p => !negPlanets.has(p));

  const interval = POSITION_HARMONICS[neg].interval;

  console.log(`\n${interval} pair: ${neg} ↔ ${pos}`);
  console.log(`  Shared (bridges domains): ${shared.join(', ') || 'NONE'}`);
  console.log(`  Void only (${neg}):        ${negOnly.join(', ') || 'NONE'}`);
  console.log(`  Material only (${pos}):    ${posOnly.join(', ') || 'NONE'}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 5: Line as Octave Number
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 5: Line as Octave/Register');
console.log('═'.repeat(75));

console.log('\nIf Line = which octave of the harmonic, same lines should share planets:');
console.log('─'.repeat(75));

for (let line = 1; line <= 6; line++) {
  const planetsAtLine = [];
  for (const [pos, info] of Object.entries(STANDING_WAVE_ASSIGNMENTS)) {
    const planet = info.planets[line - 1];
    if (planet) {
      planetsAtLine.push({ pos, planet });
    }
  }

  // Count frequencies
  const counts = {};
  planetsAtLine.forEach(p => counts[p.planet] = (counts[p.planet] || 0) + 1);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  console.log(`\nLine ${line} (Octave ${line}):`);
  console.log(`  Planets: ${sorted.map(([p, c]) => `${p}:${c}`).join(', ')}`);

  // Is there a dominant?
  if (sorted.length > 0 && sorted[0][1] >= 3) {
    console.log(`  → ${sorted[0][0]} dominates (${sorted[0][1]}/8 positions)`);
  } else if (sorted.length > 0 && sorted[0][1] >= 2) {
    console.log(`  → ${sorted[0][0]} is most common (${sorted[0][1]}/8)`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 6: Harmonic Series Correspondence
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 6: Does Position Distance Correlate with Planetary Similarity?');
console.log('═'.repeat(75));

console.log('\nIf harmonics matter, closer positions should share more planets:');
console.log('─'.repeat(75));

// Calculate shared planets for each position pair
const positionList = ['-4', '-3', '-2', '-1', '+1', '+2', '+3', '+4'];
const distances = [];

for (let i = 0; i < positionList.length; i++) {
  for (let j = i + 1; j < positionList.length; j++) {
    const pos1 = positionList[i];
    const pos2 = positionList[j];

    const planets1 = new Set(STANDING_WAVE_ASSIGNMENTS[pos1].planets.filter(p => p));
    const planets2 = new Set(STANDING_WAVE_ASSIGNMENTS[pos2].planets.filter(p => p));

    const shared = [...planets1].filter(p => planets2.has(p)).length;
    const total = new Set([...planets1, ...planets2]).size;
    const jaccard = total > 0 ? shared / total : 0;

    // Position distance (accounting for no zero)
    const num1 = parseInt(pos1);
    const num2 = parseInt(pos2);
    const distance = Math.abs(num2 - num1) - (num1 < 0 && num2 > 0 ? 1 : 0);

    distances.push({ pos1, pos2, distance, shared, jaccard });
  }
}

// Group by distance
const byDistance = {};
distances.forEach(d => {
  if (!byDistance[d.distance]) byDistance[d.distance] = [];
  byDistance[d.distance].push(d);
});

console.log('\nDistance  Pairs                  Avg Shared  Avg Jaccard');
console.log('─'.repeat(60));

for (const dist of Object.keys(byDistance).sort((a, b) => a - b)) {
  const pairs = byDistance[dist];
  const avgShared = pairs.reduce((s, p) => s + p.shared, 0) / pairs.length;
  const avgJaccard = pairs.reduce((s, p) => s + p.jaccard, 0) / pairs.length;
  const pairStr = pairs.map(p => `${p.pos1}↔${p.pos2}`).slice(0, 3).join(', ');

  console.log(`   ${dist}       ${pairStr.padEnd(22)} ${avgShared.toFixed(2).padEnd(10)}  ${avgJaccard.toFixed(3)}`);
}

// Calculate correlation
const xVals = distances.map(d => d.distance);
const yVals = distances.map(d => d.shared);
const n = xVals.length;
const sumX = xVals.reduce((a, b) => a + b, 0);
const sumY = yVals.reduce((a, b) => a + b, 0);
const sumXY = xVals.reduce((sum, x, i) => sum + x * yVals[i], 0);
const sumX2 = xVals.reduce((sum, x) => sum + x * x, 0);
const sumY2 = yVals.reduce((sum, y) => sum + y * y, 0);

const r = (n * sumXY - sumX * sumY) /
          Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

console.log(`\nCorrelation (distance vs shared planets): r = ${r.toFixed(3)}`);
console.log(r < -0.3 ? '→ Negative correlation: closer positions DO share more planets!' :
            r > 0.3 ? '→ Positive correlation: farther positions share more (unexpected)' :
            '→ No significant correlation');

// ═══════════════════════════════════════════════════════════════════════════
// TEST 7: Perfect Consonance Analysis
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 7: Perfect Consonances (Octave, Fifth, Fourth)');
console.log('═'.repeat(75));

console.log('\nPerfect consonances are the most fundamental harmonic relationships.');
console.log('Do they show special planetary patterns?\n');

// Octave pairs: -4↔+4
// Fifth pairs: -4↔-3, -3↔+3, +3↔+4 (and across: -4↔+1 is tritone actually)
// Fourth pairs: adjacent after accounting for gap

const consonances = {
  'Octave (2:1)': [['-4', '+4']],
  'Fifth (3:2)': [['-4', '-3'], ['+3', '+4'], ['-3', '+3']],  // Symmetric fifths
  'Fourth (4:3)': [['-3', '-2'], ['+2', '+3'], ['-2', '+2']]  // Symmetric fourths
};

for (const [name, pairs] of Object.entries(consonances)) {
  console.log(`${name}:`);
  for (const [p1, p2] of pairs) {
    const planets1 = new Set(STANDING_WAVE_ASSIGNMENTS[p1].planets.filter(p => p));
    const planets2 = new Set(STANDING_WAVE_ASSIGNMENTS[p2].planets.filter(p => p));
    const shared = [...planets1].filter(p => planets2.has(p));

    console.log(`  ${p1} ↔ ${p2}: ${shared.length > 0 ? shared.join(', ') : 'NONE'}`);
  }
  console.log();
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 8: Dominant Planet per Interval
// ═══════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(75));
console.log('TEST 8: Which Planet Dominates Each Harmonic Interval?');
console.log('═'.repeat(75));

console.log('\nCombining symmetric positions (same interval):');
console.log('─'.repeat(75));

const intervalPlanets = {};

for (const [neg, pos] of symmetricPairs) {
  const interval = POSITION_HARMONICS[neg].interval;
  const allPlanets = [
    ...STANDING_WAVE_ASSIGNMENTS[neg].planets,
    ...STANDING_WAVE_ASSIGNMENTS[pos].planets
  ].filter(p => p);

  const counts = {};
  allPlanets.forEach(p => counts[p] = (counts[p] || 0) + 1);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  intervalPlanets[interval] = { counts, sorted, total: allPlanets.length };

  console.log(`\n${interval} (${neg}, ${pos}):`);
  console.log(`  ${sorted.map(([p, c]) => `${p}:${c}`).join(', ')}`);
  if (sorted[0]) {
    const dominance = (sorted[0][1] / allPlanets.length * 100).toFixed(0);
    console.log(`  → ${sorted[0][0]} is dominant (${dominance}%)`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SYNTHESIS: Musical Patterns in Standing Waves');
console.log('═'.repeat(75));

console.log('\n1. INTERVAL-PLANET ASSIGNMENTS:');
console.log('─'.repeat(50));
for (const [interval, data] of Object.entries(intervalPlanets)) {
  const dominant = data.sorted[0];
  const second = data.sorted[1];
  console.log(`   ${interval.padEnd(18)} → ${dominant[0]} (${dominant[1]}), ${second ? second[0] + ' (' + second[1] + ')' : ''}`);
}

console.log('\n2. TRADITIONAL SYSTEM MATCHES:');
console.log('─'.repeat(50));
console.log(`   Medieval: ${medievalMatches}/${medievalTests} planets at expected intervals`);
console.log(`   Kepler:   ${keplerMatches}/${keplerTests} planets at expected intervals`);

console.log('\n3. DISTANCE-SIMILARITY CORRELATION:');
console.log('─'.repeat(50));
console.log(`   r = ${r.toFixed(3)} (${Math.abs(r) > 0.3 ? 'significant' : 'not significant'})`);

console.log('\n4. KEY FINDINGS:');
console.log('─'.repeat(50));

// Check for Venus bridging
const venusBridges = symmetricPairs.filter(([neg, pos]) => {
  const negHas = STANDING_WAVE_ASSIGNMENTS[neg].planets.includes('Venus');
  const posHas = STANDING_WAVE_ASSIGNMENTS[pos].planets.includes('Venus');
  return negHas && posHas;
});
console.log(`   Venus bridges ${venusBridges.length}/4 symmetric pairs (${venusBridges.map(p => p.join('↔')).join(', ')})`);

// Check for Mars at fourths
const marsAtFourth = ['-2', '+2'].filter(p =>
  STANDING_WAVE_ASSIGNMENTS[p].planets.includes('Mars')
);
console.log(`   Mars at Perfect Fourth positions: ${marsAtFourth.length}/2`);

// Check for Sun at thirds
const sunAtThird = ['-1', '+1'].filter(p =>
  STANDING_WAVE_ASSIGNMENTS[p].planets.includes('Sun')
);
console.log(`   Sun at Major Third positions: ${sunAtThird.length}/2`);

console.log('\n' + '═'.repeat(75));
console.log('CONCLUSION');
console.log('═'.repeat(75));

const traditionalMatch = medievalMatches + keplerMatches;
const traditionalTotal = medievalTests + keplerTests;
const traditionalPercent = (traditionalMatch / traditionalTotal * 100).toFixed(0);

console.log(`
Traditional systems match: ${traditionalMatch}/${traditionalTotal} (${traditionalPercent}%)
Distance-similarity correlation: r = ${r.toFixed(3)}

${traditionalPercent > 50 ?
  '→ Traditional musical mappings show PARTIAL correspondence' :
  '→ Traditional musical mappings do NOT explain standing wave assignments'}

${Math.abs(r) > 0.3 ?
  '→ Position distance DOES correlate with planetary similarity - harmonic principle confirmed' :
  '→ Position distance does NOT correlate with planetary similarity'}

Venus as universal harmonic bridge: ${venusBridges.length === 4 ? 'YES - bridges ALL symmetric pairs' :
  venusBridges.length >= 2 ? 'PARTIAL - bridges ' + venusBridges.length + '/4 pairs' : 'NO'}
`);
