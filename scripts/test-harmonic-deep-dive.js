/**
 * Harmonic Deep Dive - Following the Venus Bridge Pattern
 *
 * This test explores the musical harmonic hypothesis in depth:
 * 1. Venus bridge pattern across ALL symmetric pairs
 * 2. Consonance vs Dissonance mapping
 * 3. Line as Overtone Series
 * 4. Cross-zero prediction using harmonic principles
 */

const fs = require('fs');
const path = require('path');

// Load source data
const hdGatesPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const emLinesPath = path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

const hdGates = JSON.parse(fs.readFileSync(hdGatesPath, 'utf8'));
const emLines = JSON.parse(fs.readFileSync(emLinesPath, 'utf8'));

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

// Harmonic interval definitions
const INTERVALS = {
  'Octave':        { ratio: '2:1', cents: 1200, consonance: 'perfect', positions: ['-4', '+4'] },
  'Perfect Fifth': { ratio: '3:2', cents: 702,  consonance: 'perfect', positions: ['-3', '+3'] },
  'Perfect Fourth':{ ratio: '4:3', cents: 498,  consonance: 'perfect', positions: ['-2', '+2'] },
  'Major Third':   { ratio: '5:4', cents: 386,  consonance: 'imperfect', positions: ['-1', '+1'] }
};

// Musical consonance/dissonance classification
const CONSONANCE_TYPE = {
  'perfect': ['Octave', 'Perfect Fifth', 'Perfect Fourth'],
  'imperfect': ['Major Third', 'Minor Third', 'Major Sixth', 'Minor Sixth'],
  'dissonant': ['Major Second', 'Minor Second', 'Major Seventh', 'Minor Seventh', 'Tritone']
};

console.log('═'.repeat(75));
console.log('HARMONIC DEEP DIVE - Venus Bridge Pattern Analysis');
console.log('═'.repeat(75));

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1: VENUS BRIDGE PATTERN - ALL SYMMETRIC PAIRS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 1: Venus Bridge Pattern - All Symmetric Pairs');
console.log('═'.repeat(75));

console.log('\nQuestion: Does Venus bridge ALL symmetric pairs, or only specific ones?');
console.log('─'.repeat(75));

const symmetricPairs = [
  { neg: '-4', pos: '+4', interval: 'Octave', ratio: '2:1' },
  { neg: '-3', pos: '+3', interval: 'Perfect Fifth', ratio: '3:2' },
  { neg: '-2', pos: '+2', interval: 'Perfect Fourth', ratio: '4:3' },
  { neg: '-1', pos: '+1', interval: 'Major Third', ratio: '5:4' }
];

const bridgeAnalysis = {};

for (const pair of symmetricPairs) {
  const negPlanets = new Set(STANDING_WAVE_ASSIGNMENTS[pair.neg].planets.filter(p => p));
  const posPlanets = new Set(STANDING_WAVE_ASSIGNMENTS[pair.pos].planets.filter(p => p));

  const shared = [...negPlanets].filter(p => posPlanets.has(p));
  const negOnly = [...negPlanets].filter(p => !posPlanets.has(p));
  const posOnly = [...posPlanets].filter(p => !negPlanets.has(p));

  bridgeAnalysis[pair.interval] = {
    ratio: pair.ratio,
    shared,
    negOnly,
    posOnly,
    venusBridges: shared.includes('Venus'),
    bridgePlanets: shared
  };

  console.log(`\n${pair.interval} (${pair.ratio}): ${pair.neg} ↔ ${pair.pos}`);
  console.log(`  BRIDGE planets: ${shared.length > 0 ? shared.join(', ') : 'NONE'}`);
  console.log(`  Venus bridges: ${shared.includes('Venus') ? '✓ YES' : '✗ NO'}`);
  console.log(`  Void-only: ${negOnly.join(', ') || 'none'}`);
  console.log(`  Material-only: ${posOnly.join(', ') || 'none'}`);
}

// Summary
console.log('\n' + '─'.repeat(75));
console.log('VENUS BRIDGE SUMMARY:');
const venusBridges = Object.entries(bridgeAnalysis)
  .filter(([_, data]) => data.venusBridges)
  .map(([interval]) => interval);
console.log(`  Venus bridges: ${venusBridges.join(', ')}`);
console.log(`  Venus does NOT bridge: ${Object.keys(bridgeAnalysis).filter(i => !venusBridges.includes(i)).join(', ')}`);

// What bridges the non-Venus intervals?
const nonVenusIntervals = Object.entries(bridgeAnalysis)
  .filter(([_, data]) => !data.venusBridges);
console.log('\n  Non-Venus bridge planets:');
for (const [interval, data] of nonVenusIntervals) {
  console.log(`    ${interval}: ${data.bridgePlanets.join(', ') || 'NONE'}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2: CONSONANCE vs DISSONANCE MAPPING
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 2: Consonance vs Dissonance Planet Clustering');
console.log('═'.repeat(75));

console.log('\nQuestion: Do "difficult" planets (Mars, Saturn, Pluto) cluster at tension points?');
console.log('─'.repeat(75));

// Classify planets as "harmonious" vs "challenging"
const PLANET_CHARACTER = {
  harmonious: ['Venus', 'Jupiter', 'Sun', 'Moon'],
  challenging: ['Mars', 'Saturn', 'Pluto'],
  neutral: ['Mercury', 'Uranus', 'Neptune', 'Earth']
};

// Count planet appearances by interval type
const planetsByInterval = {};
for (const [interval, data] of Object.entries(bridgeAnalysis)) {
  const [neg, pos] = [symmetricPairs.find(p => p.interval === interval).neg,
                      symmetricPairs.find(p => p.interval === interval).pos];

  const allPlanets = [
    ...STANDING_WAVE_ASSIGNMENTS[neg].planets,
    ...STANDING_WAVE_ASSIGNMENTS[pos].planets
  ].filter(p => p);

  planetsByInterval[interval] = {};
  allPlanets.forEach(p => {
    planetsByInterval[interval][p] = (planetsByInterval[interval][p] || 0) + 1;
  });
}

// Analyze character distribution by interval
console.log('\nPlanet Character Distribution by Interval:');
console.log('─'.repeat(75));

for (const [interval, planets] of Object.entries(planetsByInterval)) {
  const harmoniousCount = Object.entries(planets)
    .filter(([p]) => PLANET_CHARACTER.harmonious.includes(p))
    .reduce((sum, [_, c]) => sum + c, 0);

  const challengingCount = Object.entries(planets)
    .filter(([p]) => PLANET_CHARACTER.challenging.includes(p))
    .reduce((sum, [_, c]) => sum + c, 0);

  const total = Object.values(planets).reduce((s, c) => s + c, 0);
  const ratio = challengingCount > 0 ? (harmoniousCount / challengingCount).toFixed(2) : '∞';

  console.log(`\n${interval}:`);
  console.log(`  Harmonious (Venus/Jupiter/Sun/Moon): ${harmoniousCount}/${total} (${(harmoniousCount/total*100).toFixed(0)}%)`);
  console.log(`  Challenging (Mars/Saturn/Pluto): ${challengingCount}/${total} (${(challengingCount/total*100).toFixed(0)}%)`);
  console.log(`  Harmonious:Challenging ratio: ${ratio}`);
}

// Perfect consonances vs imperfect
console.log('\n' + '─'.repeat(75));
console.log('Perfect Consonances (Octave, Fifth, Fourth) vs Imperfect (Third):');

const perfectIntervals = ['Octave', 'Perfect Fifth', 'Perfect Fourth'];
const imperfectIntervals = ['Major Third'];

let perfectHarmonious = 0, perfectChallenging = 0, perfectTotal = 0;
let imperfectHarmonious = 0, imperfectChallenging = 0, imperfectTotal = 0;

for (const interval of perfectIntervals) {
  const planets = planetsByInterval[interval];
  for (const [p, count] of Object.entries(planets)) {
    perfectTotal += count;
    if (PLANET_CHARACTER.harmonious.includes(p)) perfectHarmonious += count;
    if (PLANET_CHARACTER.challenging.includes(p)) perfectChallenging += count;
  }
}

for (const interval of imperfectIntervals) {
  const planets = planetsByInterval[interval];
  for (const [p, count] of Object.entries(planets)) {
    imperfectTotal += count;
    if (PLANET_CHARACTER.harmonious.includes(p)) imperfectHarmonious += count;
    if (PLANET_CHARACTER.challenging.includes(p)) imperfectChallenging += count;
  }
}

console.log(`\n  PERFECT consonances:`);
console.log(`    Harmonious: ${perfectHarmonious}/${perfectTotal} (${(perfectHarmonious/perfectTotal*100).toFixed(0)}%)`);
console.log(`    Challenging: ${perfectChallenging}/${perfectTotal} (${(perfectChallenging/perfectTotal*100).toFixed(0)}%)`);

console.log(`\n  IMPERFECT consonances (Major Third):`);
console.log(`    Harmonious: ${imperfectHarmonious}/${imperfectTotal} (${(imperfectHarmonious/imperfectTotal*100).toFixed(0)}%)`);
console.log(`    Challenging: ${imperfectChallenging}/${imperfectTotal} (${(imperfectChallenging/imperfectTotal*100).toFixed(0)}%)`);

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3: LINE AS OVERTONE SERIES
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 3: Line as Overtone Series / Register');
console.log('═'.repeat(75));

console.log('\nHarmonic Series mapping to lines:');
console.log('  Line 1 = 1st harmonic (fundamental)');
console.log('  Line 2 = 2nd harmonic (octave)');
console.log('  Line 3 = 3rd harmonic (perfect fifth + octave)');
console.log('  Line 4 = 4th harmonic (two octaves) - MODE SHIFT');
console.log('  Line 5 = 5th harmonic (major third + two octaves)');
console.log('  Line 6 = 6th harmonic (perfect fifth + two octaves)');
console.log('─'.repeat(75));

// Collect all planets at each line
const lineAnalysis = {};
for (let line = 1; line <= 6; line++) {
  lineAnalysis[line] = { planets: [], byPosition: {} };

  for (const [pos, info] of Object.entries(STANDING_WAVE_ASSIGNMENTS)) {
    const planet = info.planets[line - 1];
    if (planet) {
      lineAnalysis[line].planets.push(planet);
      lineAnalysis[line].byPosition[pos] = planet;
    }
  }
}

// Analyze each line
for (let line = 1; line <= 6; line++) {
  const data = lineAnalysis[line];
  const counts = {};
  data.planets.forEach(p => counts[p] = (counts[p] || 0) + 1);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  const harmonic = ['Fundamental', 'Octave', 'Fifth+Oct', 'Two Octaves', 'Third+2Oct', 'Fifth+2Oct'][line - 1];
  const special = line === 4 ? ' ** MODE SHIFT **' : (line === 1 ? ' ** FOUNDATION **' : '');

  console.log(`\nLine ${line} (${harmonic})${special}:`);
  console.log(`  Planets: ${sorted.map(([p, c]) => `${p}:${c}`).join(', ')}`);

  // Character analysis
  const harmonious = data.planets.filter(p => PLANET_CHARACTER.harmonious.includes(p)).length;
  const challenging = data.planets.filter(p => PLANET_CHARACTER.challenging.includes(p)).length;
  console.log(`  Character: ${harmonious} harmonious, ${challenging} challenging`);

  // Dominant planet
  if (sorted[0] && sorted[0][1] >= 3) {
    console.log(`  → DOMINANT: ${sorted[0][0]} (${sorted[0][1]}/8 = ${(sorted[0][1]/8*100).toFixed(0)}%)`);
  }
}

// Special analysis: Line 1 vs Line 4
console.log('\n' + '─'.repeat(75));
console.log('Line 1 (Foundation) vs Line 4 (Mode Shift) comparison:');

const line1Counts = {};
const line4Counts = {};
lineAnalysis[1].planets.forEach(p => line1Counts[p] = (line1Counts[p] || 0) + 1);
lineAnalysis[4].planets.forEach(p => line4Counts[p] = (line4Counts[p] || 0) + 1);

console.log(`  Line 1 dominant: ${Object.entries(line1Counts).sort((a,b) => b[1]-a[1])[0][0]}`);
console.log(`  Line 4 dominant: ${Object.entries(line4Counts).sort((a,b) => b[1]-a[1])[0][0]}`);

// Check if Venus/Pluto pattern (Venus foundation, Pluto transformation)
const venusLine1 = line1Counts['Venus'] || 0;
const plutoLine4 = line4Counts['Pluto'] || 0;
console.log(`\n  Venus at Line 1: ${venusLine1}/8`);
console.log(`  Pluto at Line 4: ${plutoLine4}/8`);
console.log(`  → ${venusLine1 >= 2 && plutoLine4 >= 2 ? 'Pattern present: Venus grounds, Pluto transforms' : 'Pattern weak'}`);

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4: CROSS-ZERO PREDICTION USING HARMONIC PRINCIPLES
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 4: Cross-Zero Prediction Using Harmonic Principles');
console.log('═'.repeat(75));

console.log('\nCan harmonic patterns improve cross-zero prediction beyond 44%?');
console.log('─'.repeat(75));

// Build index of EM lines
const emLinesIndex = {};
const emLinesList = emLines.mappings || emLines;
for (const line of emLinesList) {
  const key = `${line.gateNumber}.${line.lineNumber}`;
  emLinesIndex[key] = line;
}

// Build index of HD gates
const hdGatesIndex = {};
const hdLinesList = hdGates.mappings || hdGates;
for (const line of hdLinesList) {
  const key = `${line.gateNumber}.${line.lineNumber}`;
  const exaltPlanets = line.knowledge?.blackBook?.exaltation?.planets || [];
  const detriPlanets = line.knowledge?.blackBook?.detriment?.planets || [];
  hdGatesIndex[key] = {
    gate: line.gateNumber,
    line: line.lineNumber,
    exaltPlanets: exaltPlanets.map(p => p.planet || p),
    detriPlanets: detriPlanets.map(p => p.planet || p)
  };
}

// Get cross-zero gates
const crossZeroGates = [];
const emLinesMappings = emLines.mappings || emLines;
for (const line of emLinesMappings) {
  if (line.gateType === 'cross-zero-manifesting' || line.gateType === 'cross-zero-dematerialising') {
    const key = `${line.gateNumber}.${line.lineNumber}`;
    const hdData = hdGatesIndex[key];
    if (hdData && hdData.exaltPlanets.length > 0) {
      crossZeroGates.push({
        gate: line.gateNumber,
        line: line.lineNumber,
        gateType: line.gateType,
        innerPos: line.innerTrigram?.position,
        outerPos: line.outerTrigram?.position,
        actualPlanet: hdData.exaltPlanets[0]
      });
    }
  }
}

console.log(`\nCross-zero gates with exaltation data: ${crossZeroGates.length}`);

// Harmonic prediction strategy:
// 1. Use line number to determine which planets are likely (from standing wave line analysis)
// 2. Use position to determine domain (void vs material)
// 3. Combine for prediction

// Build line-planet probability from standing waves
const linePlanetProb = {};
for (let line = 1; line <= 6; line++) {
  const counts = {};
  lineAnalysis[line].planets.forEach(p => counts[p] = (counts[p] || 0) + 1);
  const total = lineAnalysis[line].planets.length;
  linePlanetProb[line] = {};
  for (const [p, c] of Object.entries(counts)) {
    linePlanetProb[line][p] = c / total;
  }
}

// Build interval-planet probability
const intervalPlanetProb = {};
for (const [interval, planets] of Object.entries(planetsByInterval)) {
  const total = Object.values(planets).reduce((s, c) => s + c, 0);
  intervalPlanetProb[interval] = {};
  for (const [p, c] of Object.entries(planets)) {
    intervalPlanetProb[interval][p] = c / total;
  }
}

// Position to nearest interval mapping
function positionToInterval(pos) {
  const absPos = Math.abs(pos);
  if (absPos === 4) return 'Octave';
  if (absPos === 3) return 'Perfect Fifth';
  if (absPos === 2) return 'Perfect Fourth';
  if (absPos === 1) return 'Major Third';
  return null;
}

// Test different prediction strategies
const strategies = {
  baseline: { correct: 0, total: 0 },
  lineOnly: { correct: 0, total: 0 },
  intervalOnly: { correct: 0, total: 0 },
  linePlusInterval: { correct: 0, total: 0 },
  venusBridge: { correct: 0, total: 0 }
};

for (const cz of crossZeroGates) {
  const line = cz.line;

  // Determine which interval this gate spans
  // Cross-zero gates have inner and outer trigrams in different domains
  const innerInterval = positionToInterval(cz.innerPos);
  const outerInterval = positionToInterval(cz.outerPos);

  // Strategy: Line only
  const linePlanets = Object.entries(linePlanetProb[line] || {})
    .sort((a, b) => b[1] - a[1]);
  const linePrediction = linePlanets[0]?.[0];

  if (linePrediction) {
    strategies.lineOnly.total++;
    if (linePrediction === cz.actualPlanet) strategies.lineOnly.correct++;
  }

  // Strategy: Interval only (use outer position interval)
  const outerPlanets = Object.entries(intervalPlanetProb[outerInterval] || {})
    .sort((a, b) => b[1] - a[1]);
  const intervalPrediction = outerPlanets[0]?.[0];

  if (intervalPrediction) {
    strategies.intervalOnly.total++;
    if (intervalPrediction === cz.actualPlanet) strategies.intervalOnly.correct++;
  }

  // Strategy: Combined (multiply probabilities)
  if (linePlanetProb[line] && intervalPlanetProb[outerInterval]) {
    const allPlanets = new Set([
      ...Object.keys(linePlanetProb[line]),
      ...Object.keys(intervalPlanetProb[outerInterval])
    ]);

    let bestPlanet = null;
    let bestScore = 0;
    for (const planet of allPlanets) {
      const lineProb = linePlanetProb[line][planet] || 0;
      const intervalProb = intervalPlanetProb[outerInterval]?.[planet] || 0;
      const score = lineProb * 0.5 + intervalProb * 0.5;
      if (score > bestScore) {
        bestScore = score;
        bestPlanet = planet;
      }
    }

    if (bestPlanet) {
      strategies.linePlusInterval.total++;
      if (bestPlanet === cz.actualPlanet) strategies.linePlusInterval.correct++;
    }
  }

  // Strategy: Venus bridge (predict Venus for all cross-domain transitions)
  strategies.venusBridge.total++;
  if (cz.actualPlanet === 'Venus') strategies.venusBridge.correct++;

  // Baseline: most common planet overall (Mars for detriment, let's use Sun for exalt)
  strategies.baseline.total++;
  if (cz.actualPlanet === 'Sun') strategies.baseline.correct++;
}

console.log('\nPrediction Accuracy Comparison:');
console.log('─'.repeat(50));

for (const [name, data] of Object.entries(strategies)) {
  const accuracy = data.total > 0 ? (data.correct / data.total * 100).toFixed(1) : 'N/A';
  console.log(`  ${name.padEnd(20)}: ${data.correct}/${data.total} = ${accuracy}%`);
}

console.log('\n  Previous best (position+line+gateType): ~44%');

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5: HARMONIC BRIDGE HYPOTHESIS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 5: The Harmonic Bridge Hypothesis');
console.log('═'.repeat(75));

console.log('\nIf Venus is the "harmonic integrator", it should:');
console.log('  1. Bridge domain transitions (void ↔ material)');
console.log('  2. Appear at consonant intervals');
console.log('  3. Be rare at dissonant/tension points');
console.log('─'.repeat(75));

// Count Venus across all positions and lines
let venusTotal = 0;
let venusAtConsonant = 0;
let venusAtBridge = 0;

const venusPositions = [];
for (const [pos, info] of Object.entries(STANDING_WAVE_ASSIGNMENTS)) {
  info.planets.forEach((planet, idx) => {
    if (planet === 'Venus') {
      venusTotal++;
      venusPositions.push({ pos, line: idx + 1 });

      // Is this a consonant interval?
      const interval = positionToInterval(parseInt(pos));
      if (['Octave', 'Perfect Fifth', 'Perfect Fourth'].includes(interval)) {
        venusAtConsonant++;
      }
    }
  });
}

// Check Venus bridge status
for (const pair of symmetricPairs) {
  if (bridgeAnalysis[pair.interval].venusBridges) {
    venusAtBridge++;
  }
}

console.log(`\nVenus appearances in standing waves: ${venusTotal}`);
console.log(`Venus at PERFECT consonant intervals: ${venusAtConsonant}/${venusTotal} (${(venusAtConsonant/venusTotal*100).toFixed(0)}%)`);
console.log(`Venus bridges symmetric pairs: ${venusAtBridge}/4`);

console.log('\nVenus positions:');
for (const vp of venusPositions) {
  const interval = positionToInterval(parseInt(vp.pos));
  console.log(`  Position ${vp.pos}, Line ${vp.line} (${interval})`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SYNTHESIS: Harmonic Deep Dive Results');
console.log('═'.repeat(75));

console.log('\n1. VENUS BRIDGE PATTERN:');
console.log('─'.repeat(50));
console.log(`   Bridges Octave (-4↔+4): ${bridgeAnalysis['Octave'].venusBridges ? '✓' : '✗'}`);
console.log(`   Bridges Perfect Fifth (-3↔+3): ${bridgeAnalysis['Perfect Fifth'].venusBridges ? '✓' : '✗'}`);
console.log(`   Bridges Perfect Fourth (-2↔+2): ${bridgeAnalysis['Perfect Fourth'].venusBridges ? '✓' : '✗'}`);
console.log(`   Bridges Major Third (-1↔+1): ${bridgeAnalysis['Major Third'].venusBridges ? '✓' : '✗'}`);

const bridgePatternFound = venusBridges.length >= 2 &&
  venusBridges.includes('Octave') &&
  venusBridges.includes('Perfect Fifth');

console.log(`\n   → Venus bridges the MOST consonant intervals (Octave, Fifth): ${bridgePatternFound ? '✓ CONFIRMED' : '✗ NOT CONFIRMED'}`);

// What bridges the others?
console.log(`   → Perfect Fourth bridged by: ${bridgeAnalysis['Perfect Fourth'].bridgePlanets.join(', ')}`);
console.log(`   → Major Third bridged by: ${bridgeAnalysis['Major Third'].bridgePlanets.join(', ')}`);

console.log('\n2. CONSONANCE-CHARACTER CORRELATION:');
console.log('─'.repeat(50));
const perfectRatio = perfectChallenging > 0 ? (perfectHarmonious / perfectChallenging).toFixed(2) : '∞';
const imperfectRatio = imperfectChallenging > 0 ? (imperfectHarmonious / imperfectChallenging).toFixed(2) : '∞';
console.log(`   Perfect consonances: ${perfectRatio} harmonious:challenging`);
console.log(`   Imperfect consonances: ${imperfectRatio} harmonious:challenging`);
console.log(`   → ${parseFloat(perfectRatio) > parseFloat(imperfectRatio) ? 'Perfect consonances favor harmonious planets' : 'No clear pattern'}`);

console.log('\n3. LINE-AS-REGISTER FINDINGS:');
console.log('─'.repeat(50));
const lineDominants = [];
for (let l = 1; l <= 6; l++) {
  const counts = {};
  lineAnalysis[l].planets.forEach(p => counts[p] = (counts[p] || 0) + 1);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  lineDominants.push({ line: l, dominant: sorted[0]?.[0], count: sorted[0]?.[1] });
}
lineDominants.forEach(ld => {
  const marker = ld.line === 1 ? ' (FOUNDATION)' : (ld.line === 4 ? ' (MODE SHIFT)' : '');
  console.log(`   Line ${ld.line}: ${ld.dominant} (${ld.count}/8)${marker}`);
});

console.log('\n4. CROSS-ZERO PREDICTION:');
console.log('─'.repeat(50));
const bestStrategy = Object.entries(strategies)
  .map(([name, data]) => ({ name, accuracy: data.total > 0 ? data.correct / data.total * 100 : 0 }))
  .sort((a, b) => b.accuracy - a.accuracy)[0];
console.log(`   Best strategy: ${bestStrategy.name} (${bestStrategy.accuracy.toFixed(1)}%)`);
console.log(`   Baseline comparison: 44%`);
console.log(`   → ${bestStrategy.accuracy > 44 ? 'IMPROVEMENT over baseline' : 'No improvement over baseline'}`);

console.log('\n' + '═'.repeat(75));
console.log('CONCLUSION');
console.log('═'.repeat(75));

const harmonicSignalStrength = (venusBridges.length / 4 + (bridgePatternFound ? 0.5 : 0)) / 1.5;
console.log(`
HARMONIC SIGNAL STRENGTH: ${(harmonicSignalStrength * 100).toFixed(0)}%

KEY FINDINGS:
${bridgePatternFound ? '✓' : '✗'} Venus bridges the most consonant intervals (Octave, Fifth)
${bridgeAnalysis['Perfect Fourth'].bridgePlanets.includes('Sun') ? '✓' : '✗'} Sun/Mars bridge the "action" interval (Perfect Fourth)
${lineDominants[0].dominant === 'Venus' ? '✓' : '✗'} Venus dominates Line 1 (foundation/fundamental)
${lineDominants[3].dominant === 'Pluto' || lineDominants[3].dominant === 'Venus' ? '✓' : '✗'} Transformation planets at Line 4 (mode shift)

INTERPRETATION:
${harmonicSignalStrength > 0.5 ?
`The harmonic hypothesis shows STRUCTURAL COHERENCE:
- Venus functions as the harmonic integrator across domains
- Sun/Mars represent the dynamic tension at action points
- Lines correspond to harmonic register (overtone series)
- This is not derivation, but it IS meaningful structure` :
`The harmonic hypothesis shows PARTIAL coherence but not enough for derivation.`}
`);
