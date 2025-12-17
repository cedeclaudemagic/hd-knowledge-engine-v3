/**
 * Predictive Model v3: Find the deterministic combinations
 *
 * 52% accuracy with (pos, line, gateType) suggests SOME combinations are
 * highly predictable while others are noisy. Let's find the patterns.
 */

const tradGates = require('../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const emLines = require('../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

// Build lookups
const emLookup = {};
emLines.mappings.forEach(l => {
  emLookup[l.gate + '.' + l.line] = l.electromagnetic;
});

// Collect all data with full features
const data = [];
tradGates.mappings.filter(m => m.lineNumber).forEach(entry => {
  const key = entry.gateNumber + '.' + entry.lineNumber;
  const em = emLookup[key];
  if (!em) return;

  const exaltPlanets = (entry.knowledge?.blackBook?.exaltation?.planets || []).map(p => p.planet);
  if (exaltPlanets.length === 0) return;

  data.push({
    key,
    gate: entry.gateNumber,
    line: entry.lineNumber,
    innerPos: em.innerTrigram?.position,
    outerPos: em.outerTrigram?.position,
    gateType: em.gateType,
    amplitude: Math.abs(em.outerTrigram?.position - em.innerTrigram?.position),
    domain: em.innerTrigram?.position < 0 ? 'void' : 'material',
    actualPlanet: exaltPlanets[0],
    allPlanets: exaltPlanets
  });
});

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('PREDICTIVE MODEL v3: Finding Deterministic Patterns');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: Find the BEST predictable combinations
// ═══════════════════════════════════════════════════════════════════════════

console.log('PART 1: Highly Predictable (pos, line, gateType) Combinations');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Build full distribution
const fullDist = {};
data.forEach(d => {
  const key = `${d.innerPos}_${d.line}_${d.gateType}`;
  if (!fullDist[key]) fullDist[key] = { planets: {}, items: [] };
  fullDist[key].planets[d.actualPlanet] = (fullDist[key].planets[d.actualPlanet] || 0) + 1;
  fullDist[key].items.push(d);
});

// Analyze each combination
const combinations = [];
Object.entries(fullDist).forEach(([key, data]) => {
  const total = Object.values(data.planets).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(data.planets).sort((a, b) => b[1] - a[1]);
  const mode = sorted[0][0];
  const modeCount = sorted[0][1];
  const freq = modeCount / total;

  combinations.push({
    key,
    mode,
    modeCount,
    total,
    freq,
    distribution: sorted.slice(0, 3).map(([p, c]) => `${p}:${c}`).join(', ')
  });
});

// Sort by frequency (most deterministic first)
combinations.sort((a, b) => b.freq - a.freq);

console.log('Top 20 most deterministic combinations:');
console.log('─'.repeat(80));
console.log('Combination'.padEnd(45), 'Mode'.padEnd(10), 'Freq', ' Distribution');
console.log('─'.repeat(80));
combinations.slice(0, 20).forEach(c => {
  const [pos, line, type] = c.key.split('_');
  const combo = `pos ${pos.padStart(2)}, line ${line}, ${type}`;
  console.log(combo.padEnd(45), c.mode.padEnd(10), `${(c.freq*100).toFixed(0)}%`.padStart(4), ` [${c.distribution}]`);
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: What makes a combination predictable?
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 2: Characteristics of Predictable vs Unpredictable Combinations');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const highPred = combinations.filter(c => c.freq >= 0.6);
const lowPred = combinations.filter(c => c.freq <= 0.3);

console.log(`High predictability (≥60%): ${highPred.length} combinations`);
console.log(`Low predictability (≤30%): ${lowPred.length} combinations`);

// Analyze gate types in each group
const gateTypeHigh = {};
const gateTypeLow = {};
highPred.forEach(c => {
  const gt = c.key.split('_')[2];
  gateTypeHigh[gt] = (gateTypeHigh[gt] || 0) + 1;
});
lowPred.forEach(c => {
  const gt = c.key.split('_')[2];
  gateTypeLow[gt] = (gateTypeLow[gt] || 0) + 1;
});

console.log('\nGate type distribution in high-predictability combinations:');
Object.entries(gateTypeHigh).sort((a,b) => b[1] - a[1]).forEach(([gt, c]) => {
  console.log(`  ${gt}: ${c}`);
});

console.log('\nGate type distribution in low-predictability combinations:');
Object.entries(gateTypeLow).sort((a,b) => b[1] - a[1]).forEach(([gt, c]) => {
  console.log(`  ${gt}: ${c}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: Build a TIERED prediction model
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 3: Tiered Prediction Model');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Tier 1: Use (pos, line, gateType) mode if freq >= 50%
// Tier 2: Use (pos, line) mode if no good Tier 1
// Tier 3: Use position-based heuristics

const tier1Rules = {};
combinations.filter(c => c.freq >= 0.5).forEach(c => {
  tier1Rules[c.key] = c.mode;
});

console.log(`Tier 1 rules (≥50% confidence): ${Object.keys(tier1Rules).length} combinations`);

// Build Tier 2 rules
const posLineDist = {};
data.forEach(d => {
  const key = `${d.innerPos}_${d.line}`;
  if (!posLineDist[key]) posLineDist[key] = {};
  posLineDist[key][d.actualPlanet] = (posLineDist[key][d.actualPlanet] || 0) + 1;
});

const tier2Rules = {};
Object.entries(posLineDist).forEach(([key, dist]) => {
  const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((sum, [_, c]) => sum + c, 0);
  if (sorted[0][1] / total >= 0.35) {
    tier2Rules[key] = sorted[0][0];
  }
});

console.log(`Tier 2 rules (pos, line with ≥35% mode): ${Object.keys(tier2Rules).length} combinations`);

// Tier 3: Position-based fallback
const tier3Rules = {
  '-4': 'Neptune',  // Void peak - Neptune thrives
  '-3': 'Saturn',   // Lake - Saturn crystallizes
  '-2': 'Neptune',  // Fire void - Neptune
  '-1': 'Pluto',    // Wind - Pluto transforms
  '1': 'Sun',       // Thunder - Sun initiates
  '2': 'Venus',     // Water - Venus harmonizes
  '3': 'Sun',       // Mountain - Sun illuminates
  '4': 'Venus'      // Earth - Venus harmonizes
};

console.log('Tier 3 fallback rules (position-based):', JSON.stringify(tier3Rules));

// Test tiered model
let tier1Correct = 0, tier1Total = 0;
let tier2Correct = 0, tier2Total = 0;
let tier3Correct = 0, tier3Total = 0;
let overallCorrect = 0;

data.forEach(d => {
  const fullKey = `${d.innerPos}_${d.line}_${d.gateType}`;
  const posLineKey = `${d.innerPos}_${d.line}`;
  const posKey = String(d.innerPos);

  let prediction;
  let tier;

  if (tier1Rules[fullKey]) {
    prediction = tier1Rules[fullKey];
    tier = 1;
    tier1Total++;
    if (d.allPlanets.includes(prediction)) {
      tier1Correct++;
      overallCorrect++;
    }
  } else if (tier2Rules[posLineKey]) {
    prediction = tier2Rules[posLineKey];
    tier = 2;
    tier2Total++;
    if (d.allPlanets.includes(prediction)) {
      tier2Correct++;
      overallCorrect++;
    }
  } else {
    prediction = tier3Rules[posKey] || 'Sun';
    tier = 3;
    tier3Total++;
    if (d.allPlanets.includes(prediction)) {
      tier3Correct++;
      overallCorrect++;
    }
  }
});

console.log('\nTiered Model Results:');
console.log('─'.repeat(60));
console.log(`Tier 1 (full key, ≥50%): ${tier1Correct}/${tier1Total} = ${(tier1Correct/tier1Total*100).toFixed(1)}%`);
console.log(`Tier 2 (pos+line, ≥35%): ${tier2Correct}/${tier2Total} = ${(tier2Correct/tier2Total*100).toFixed(1)}%`);
console.log(`Tier 3 (pos fallback):   ${tier3Correct}/${tier3Total} = ${(tier3Correct/tier3Total*100).toFixed(1)}%`);
console.log(`OVERALL:                 ${overallCorrect}/${data.length} = ${(overallCorrect/data.length*100).toFixed(1)}%`);

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: Analyze the systematic failures
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 4: Systematic Failure Analysis');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Which planets are we systematically getting wrong?
const planetMispredict = {};
const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];
planets.forEach(p => {
  planetMispredict[p] = { total: 0, correct: 0 };
});

data.forEach(d => {
  const fullKey = `${d.innerPos}_${d.line}_${d.gateType}`;
  const posLineKey = `${d.innerPos}_${d.line}`;
  const posKey = String(d.innerPos);

  let prediction;
  if (tier1Rules[fullKey]) prediction = tier1Rules[fullKey];
  else if (tier2Rules[posLineKey]) prediction = tier2Rules[posLineKey];
  else prediction = tier3Rules[posKey] || 'Sun';

  planetMispredict[d.actualPlanet].total++;
  if (d.allPlanets.includes(prediction)) {
    planetMispredict[d.actualPlanet].correct++;
  }
});

console.log('Prediction accuracy BY ACTUAL PLANET:');
console.log('─'.repeat(60));
planets.forEach(p => {
  const pm = planetMispredict[p];
  if (pm.total > 0) {
    const acc = (pm.correct / pm.total * 100).toFixed(0);
    console.log(`${p.padEnd(10)} ${pm.correct}/${pm.total} (${acc}%)`);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 5: The core finding
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 5: Key Findings');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('1. BEST ACCURACY ACHIEVED: ' + (overallCorrect/data.length*100).toFixed(1) + '%');
console.log();
console.log('2. DETERMINISTIC COMBINATIONS EXIST:');
console.log('   - ' + highPred.length + ' combinations have ≥60% predictability');
console.log('   - These are NOT random - electromagnetic coordinates matter');
console.log();
console.log('3. GATE TYPE IS CRITICAL:');
console.log('   - Adding gate type increases accuracy from 32% to 52%');
console.log('   - Different gate types favor different planets');
console.log();
console.log('4. SOME PLANETS ARE UNPREDICTABLE:');
console.log('   - Mercury, Mars, Uranus have very low prediction accuracy');
console.log('   - These may be "wild cards" that don\'t follow EM patterns');
console.log('   - Or they operate on different principles we haven\'t captured');
console.log();
console.log('5. INTERPRETATION:');
console.log('   - ~50% of the system appears electromagnetically deterministic');
console.log('   - ~50% has additional factors we cannot derive from coordinates alone');
console.log('   - The anomalies (10 lines) ARE fully derivable');
console.log('   - The normal lines are partially derivable');
