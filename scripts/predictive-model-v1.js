/**
 * Predictive Model v1: Can we derive exaltation planets from electromagnetic coordinates?
 *
 * Goal: 70%+ accuracy with simple, interpretable rules
 *
 * Input features:
 *   - innerPos: Inner trigram position (-4 to +4)
 *   - outerPos: Outer trigram position (-4 to +4)
 *   - gateType: doubled, same-phase-material, same-phase-void, cross-zero-manifesting, cross-zero-dematerialising
 *   - line: 1-6
 *   - amplitude: |outerPos - innerPos|
 *   - polarity: YIN/YANG
 *
 * Output: Predicted exaltation planet
 */

const tradGates = require('../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const emLines = require('../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

// Build lookups
const emLookup = {};
emLines.mappings.forEach(l => {
  emLookup[l.gate + '.' + l.line] = l.electromagnetic;
});

// Collect all training data
const data = [];
tradGates.mappings.filter(m => m.lineNumber).forEach(entry => {
  const key = entry.gateNumber + '.' + entry.lineNumber;
  const em = emLookup[key];
  if (!em) return;

  const exaltPlanets = (entry.knowledge?.blackBook?.exaltation?.planets || []).map(p => p.planet);
  if (exaltPlanets.length === 0) return; // Skip no-exaltation lines

  data.push({
    key,
    gate: entry.gateNumber,
    line: entry.lineNumber,
    polarity: entry.knowledge?.polarity,
    innerPos: em.innerTrigram?.position,
    outerPos: em.outerTrigram?.position,
    innerTrigram: em.innerTrigram?.name,
    outerTrigram: em.outerTrigram?.name,
    gateType: em.gateType,
    amplitude: Math.abs(em.outerTrigram?.position - em.innerTrigram?.position),
    domain: em.innerTrigram?.position < 0 ? 'void' : 'material',
    actualPlanet: exaltPlanets[0], // Primary exaltation
    allPlanets: exaltPlanets
  });
});

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('PREDICTIVE MODEL v1: Deriving Exaltation Planets from EM Coordinates');
console.log('═══════════════════════════════════════════════════════════════════════════\n');
console.log('Training data:', data.length, 'lines with exaltation planets\n');

// ═══════════════════════════════════════════════════════════════════════════
// RULE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Model based on derived electromagnetic properties:
 *
 * CORE RULES:
 * 1. Domain affinity: Some planets prefer void (-), some prefer material (+)
 * 2. Position affinity: Specific planets thrive at specific trigram positions
 * 3. Amplitude: Some planets prefer high amplitude (dynamic), some low (stable)
 * 4. Line position: Different lines favor different planets
 */

// Planet domain preferences (derived from Phase 1 analysis)
const DOMAIN_PREFERENCE = {
  'Sun': 'material',      // 90% success in material
  'Venus': 'material',    // 62% success in material
  'Neptune': 'void',      // 70% success in void
  'Pluto': 'void',        // 70% success in void
  'Earth': 'void',        // 57% success in void (surprising!)
  // Balanced planets
  'Moon': 'balanced',
  'Mercury': 'balanced',
  'Mars': 'balanced',
  'Jupiter': 'balanced',
  'Saturn': 'balanced',
  'Uranus': 'balanced'
};

// Planet position affinities (where they thrive most)
const POSITION_AFFINITY = {
  'Sun': [1, 2, 3],       // Thrives in material positions
  'Moon': [3, 1],         // Mountain, Thunder
  'Venus': [4, 2],        // Earth, Water
  'Mars': [2],            // Only Water (standing wave)
  'Jupiter': [4, -2],     // Earth, Fire
  'Saturn': [-3, 2, -1],  // Lake, Water, Wind
  'Neptune': [-2, -4, -3], // Fire, Heaven, Lake (void)
  'Pluto': [-1, -3],      // Wind, Lake (void)
  'Uranus': [3, -3],      // Mountain, Lake
  'Mercury': [],          // No strong affinity (corrupts everywhere)
  'Earth': [-2]           // Fire (void)
};

// Planet amplitude preferences
const AMPLITUDE_PREFERENCE = {
  'Saturn': 'high',    // 3.44 avg when exalt
  'Uranus': 'high',    // 3.33 avg
  'Neptune': 'high',   // 4.17 avg
  'Earth': 'high',     // 2.90 avg but prefers dynamic
  'Moon': 'low',       // 2.96 avg
  'Mercury': 'low',    // 2.64 avg
  'Mars': 'low',       // 2.69 avg
  'Jupiter': 'low',    // 3.13 avg
  'Sun': 'any',
  'Venus': 'any',
  'Pluto': 'any'
};

// Line position affinities (derived from Phase 7)
const LINE_AFFINITY = {
  1: ['Venus', 'Sun', 'Neptune'],      // 12, 12, 9 exaltations
  2: ['Sun', 'Venus', 'Jupiter'],      // 13, 10, 8
  3: ['Saturn', 'Moon', 'Pluto'],      // 9, 8, 8
  4: ['Jupiter', 'Moon', 'Pluto'],     // 12, 11, 10
  5: ['Jupiter', 'Moon', 'Sun'],       // 10, 8, 8
  6: ['Sun', 'Venus', 'Moon']          // 11, 7, 7
};

// Gate type affinities
const GATE_TYPE_AFFINITY = {
  'doubled': ['Sun', 'Saturn', 'Venus'],
  'same-phase-material': ['Sun', 'Venus', 'Jupiter'],
  'same-phase-void': ['Pluto', 'Saturn', 'Neptune'],
  'cross-zero-manifesting': ['Neptune', 'Saturn', 'Sun'],
  'cross-zero-dematerialising': ['Sun', 'Saturn', 'Uranus']
};

// ═══════════════════════════════════════════════════════════════════════════
// PREDICTION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

function predictExaltation(lineData) {
  const scores = {};
  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];

  planets.forEach(planet => {
    scores[planet] = 0;

    // Rule 1: Domain affinity (weight: 2)
    const domainPref = DOMAIN_PREFERENCE[planet];
    if (domainPref === lineData.domain) {
      scores[planet] += 2;
    } else if (domainPref === 'balanced') {
      scores[planet] += 1;
    }

    // Rule 2: Position affinity (weight: 3)
    const posAffinity = POSITION_AFFINITY[planet] || [];
    if (posAffinity.includes(lineData.innerPos)) {
      scores[planet] += 3;
    }

    // Rule 3: Amplitude preference (weight: 1.5)
    const ampPref = AMPLITUDE_PREFERENCE[planet];
    const isHighAmp = lineData.amplitude >= 4;
    if (ampPref === 'high' && isHighAmp) {
      scores[planet] += 1.5;
    } else if (ampPref === 'low' && !isHighAmp) {
      scores[planet] += 1.5;
    } else if (ampPref === 'any') {
      scores[planet] += 0.75;
    }

    // Rule 4: Line affinity (weight: 2)
    const lineAff = LINE_AFFINITY[lineData.line] || [];
    const lineRank = lineAff.indexOf(planet);
    if (lineRank === 0) scores[planet] += 2;
    else if (lineRank === 1) scores[planet] += 1.5;
    else if (lineRank === 2) scores[planet] += 1;

    // Rule 5: Gate type affinity (weight: 2)
    const gateAff = GATE_TYPE_AFFINITY[lineData.gateType] || [];
    const gateRank = gateAff.indexOf(planet);
    if (gateRank === 0) scores[planet] += 2;
    else if (gateRank === 1) scores[planet] += 1.5;
    else if (gateRank === 2) scores[planet] += 1;
  });

  // Return planet with highest score
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return {
    prediction: sorted[0][0],
    confidence: sorted[0][1],
    topThree: sorted.slice(0, 3).map(([p, s]) => ({ planet: p, score: s.toFixed(1) })),
    allScores: scores
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST THE MODEL
// ═══════════════════════════════════════════════════════════════════════════

let correct = 0;
let correctTop3 = 0;
let total = 0;

const failures = [];
const planetAccuracy = {};
const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];
planets.forEach(p => {
  planetAccuracy[p] = { correct: 0, total: 0 };
});

data.forEach(lineData => {
  const result = predictExaltation(lineData);
  const actual = lineData.actualPlanet;

  total++;
  planetAccuracy[actual].total++;

  // Check if prediction matches any of the actual planets (for multi-exalt lines)
  const isCorrect = lineData.allPlanets.includes(result.prediction);
  const isTop3 = result.topThree.some(t => lineData.allPlanets.includes(t.planet));

  if (isCorrect) {
    correct++;
    planetAccuracy[actual].correct++;
  } else {
    failures.push({
      key: lineData.key,
      actual,
      predicted: result.prediction,
      topThree: result.topThree,
      features: {
        innerPos: lineData.innerPos,
        gateType: lineData.gateType,
        line: lineData.line,
        amplitude: lineData.amplitude,
        domain: lineData.domain
      }
    });
  }

  if (isTop3) correctTop3++;
});

const accuracy = (correct / total * 100).toFixed(1);
const top3Accuracy = (correctTop3 / total * 100).toFixed(1);

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('RESULTS');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('OVERALL ACCURACY');
console.log('─'.repeat(60));
console.log(`Exact match:     ${correct}/${total} = ${accuracy}%`);
console.log(`Top-3 match:     ${correctTop3}/${total} = ${top3Accuracy}%`);
console.log();

console.log('ACCURACY BY PLANET');
console.log('─'.repeat(60));
planets.forEach(planet => {
  const pa = planetAccuracy[planet];
  if (pa.total > 0) {
    const acc = (pa.correct / pa.total * 100).toFixed(0);
    const bar = '█'.repeat(Math.round(pa.correct / pa.total * 20));
    console.log(`${planet.padEnd(10)} ${String(pa.correct).padStart(2)}/${String(pa.total).padStart(2)} (${acc.padStart(3)}%) ${bar}`);
  }
});

console.log();
console.log('FAILURE ANALYSIS');
console.log('─'.repeat(60));
console.log(`Total failures: ${failures.length}`);

// Analyze failure patterns
const failureByPlanet = {};
const failureByGateType = {};
const failureByPosition = {};

failures.forEach(f => {
  failureByPlanet[f.actual] = (failureByPlanet[f.actual] || 0) + 1;
  failureByGateType[f.features.gateType] = (failureByGateType[f.features.gateType] || 0) + 1;
  failureByPosition[f.features.innerPos] = (failureByPosition[f.features.innerPos] || 0) + 1;
});

console.log('\nFailures by actual planet:');
Object.entries(failureByPlanet).sort((a,b) => b[1] - a[1]).forEach(([p, c]) => {
  console.log(`  ${p}: ${c}`);
});

console.log('\nFailures by gate type:');
Object.entries(failureByGateType).sort((a,b) => b[1] - a[1]).forEach(([gt, c]) => {
  console.log(`  ${gt}: ${c}`);
});

console.log('\nFailures by inner position:');
Object.entries(failureByPosition).sort((a,b) => b[1] - a[1]).forEach(([pos, c]) => {
  console.log(`  pos ${pos}: ${c}`);
});

// Show sample failures
console.log('\nSAMPLE FAILURES (first 10):');
console.log('─'.repeat(60));
failures.slice(0, 10).forEach(f => {
  console.log(`${f.key}: actual=${f.actual}, predicted=${f.predicted}`);
  console.log(`  Features: pos=${f.features.innerPos}, type=${f.features.gateType}, line=${f.features.line}, amp=${f.features.amplitude}`);
  console.log(`  Top 3: ${f.topThree.map(t => t.planet + '(' + t.score + ')').join(', ')}`);
});

console.log();
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('RULE CONTRIBUTION ANALYSIS');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Test each rule's contribution by removing it
console.log('Testing rule importance by ablation...');

function predictWithoutRule(lineData, excludeRule) {
  const scores = {};
  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];

  planets.forEach(planet => {
    scores[planet] = 0;

    if (excludeRule !== 'domain') {
      const domainPref = DOMAIN_PREFERENCE[planet];
      if (domainPref === lineData.domain) scores[planet] += 2;
      else if (domainPref === 'balanced') scores[planet] += 1;
    }

    if (excludeRule !== 'position') {
      const posAffinity = POSITION_AFFINITY[planet] || [];
      if (posAffinity.includes(lineData.innerPos)) scores[planet] += 3;
    }

    if (excludeRule !== 'amplitude') {
      const ampPref = AMPLITUDE_PREFERENCE[planet];
      const isHighAmp = lineData.amplitude >= 4;
      if (ampPref === 'high' && isHighAmp) scores[planet] += 1.5;
      else if (ampPref === 'low' && !isHighAmp) scores[planet] += 1.5;
      else if (ampPref === 'any') scores[planet] += 0.75;
    }

    if (excludeRule !== 'line') {
      const lineAff = LINE_AFFINITY[lineData.line] || [];
      const lineRank = lineAff.indexOf(planet);
      if (lineRank === 0) scores[planet] += 2;
      else if (lineRank === 1) scores[planet] += 1.5;
      else if (lineRank === 2) scores[planet] += 1;
    }

    if (excludeRule !== 'gateType') {
      const gateAff = GATE_TYPE_AFFINITY[lineData.gateType] || [];
      const gateRank = gateAff.indexOf(planet);
      if (gateRank === 0) scores[planet] += 2;
      else if (gateRank === 1) scores[planet] += 1.5;
      else if (gateRank === 2) scores[planet] += 1;
    }
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
}

const rules = ['domain', 'position', 'amplitude', 'line', 'gateType'];
rules.forEach(rule => {
  let correctWithout = 0;
  data.forEach(lineData => {
    const pred = predictWithoutRule(lineData, rule);
    if (lineData.allPlanets.includes(pred)) correctWithout++;
  });
  const accWithout = (correctWithout / total * 100).toFixed(1);
  const drop = (accuracy - accWithout).toFixed(1);
  console.log(`Without ${rule.padEnd(10)}: ${accWithout}% (drop: ${drop}%)`);
});
