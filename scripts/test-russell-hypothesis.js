/**
 * Russell Wave Mechanics Hypothesis Test
 *
 * Question: Do Russell's wave properties explain cross-zero planetary variance?
 *
 * Properties from existing Russell-trigram mapping:
 * - AXIS: POLES, CONTAINERS, FLOW, GATES
 * - RUSSELL ZONE: Absolute Ground, Radiating, Zero Crossing, Generating, Local Ground
 * - DOMINATION: CUBE, SPHERE, Dematerialising, Materialising, Crossing
 * - SIDE: void vs matter
 *
 * Test: For cross-zero gates, does the combination of inner/outer Russell properties
 * predict planetary assignments better than position alone?
 */

const tradGates = require('../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const emLines = require('../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

// ═══════════════════════════════════════════════════════════════════════════
// RUSSELL PROPERTIES (from russell-locked-potentials-ring.js)
// ═══════════════════════════════════════════════════════════════════════════

const RUSSELL_PROPERTIES = {
  'Heaven': { position: -4, axis: 'POLES', zone: 'Absolute Ground', domination: 'CUBE', side: 'void' },
  'Lake':   { position: -3, axis: 'CONTAINERS', zone: 'Radiating', domination: 'Dematerialising', side: 'void' },
  'Fire':   { position: -2, axis: 'FLOW', zone: 'Radiating', domination: 'Dematerialising', side: 'void' },
  'Wind':   { position: -1, axis: 'GATES', zone: 'Zero Crossing', domination: 'Crossing', side: 'void' },
  'Thunder':{ position: 1,  axis: 'GATES', zone: 'Zero Crossing', domination: 'Crossing', side: 'matter' },
  'Water':  { position: 2,  axis: 'FLOW', zone: 'Generating', domination: 'Materialising', side: 'matter' },
  'Mountain':{ position: 3, axis: 'CONTAINERS', zone: 'Generating', domination: 'Materialising', side: 'matter' },
  'Earth':  { position: 4,  axis: 'POLES', zone: 'Local Ground', domination: 'SPHERE', side: 'matter' }
};

// Derived properties for cross-zero transitions
function getTransitionType(innerTrigram, outerTrigram) {
  const inner = RUSSELL_PROPERTIES[innerTrigram];
  const outer = RUSSELL_PROPERTIES[outerTrigram];
  if (!inner || !outer) return null;

  // Axis transition
  const axisTransition = `${inner.axis}→${outer.axis}`;

  // Zone transition
  const zoneTransition = `${inner.zone}→${outer.zone}`;

  // Domination transition
  const domTransition = `${inner.domination}→${outer.domination}`;

  // Direction: which way across zero?
  const direction = inner.position < 0 && outer.position > 0 ? 'void→matter' :
                    inner.position > 0 && outer.position < 0 ? 'matter→void' : 'same-side';

  // Amplitude (gap size)
  const amplitude = Math.abs(outer.position - inner.position);

  // Crossing type: which gates involved?
  const involvesGate = inner.axis === 'GATES' || outer.axis === 'GATES';
  const gatePosition = inner.axis === 'GATES' ? 'inner' :
                       outer.axis === 'GATES' ? 'outer' : 'none';

  return {
    axisTransition,
    zoneTransition,
    domTransition,
    direction,
    amplitude,
    involvesGate,
    gatePosition
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD DATA
// ═══════════════════════════════════════════════════════════════════════════

const emLookup = {};
emLines.mappings.forEach(l => {
  emLookup[l.gate + '.' + l.line] = l.electromagnetic;
});

const data = [];
tradGates.mappings.filter(m => m.lineNumber).forEach(entry => {
  const key = entry.gateNumber + '.' + entry.lineNumber;
  const em = emLookup[key];
  if (!em) return;

  const exaltPlanets = (entry.knowledge?.blackBook?.exaltation?.planets || []).map(p => p.planet);
  if (exaltPlanets.length === 0) return;

  const innerTrigram = em.innerTrigram?.name;
  const outerTrigram = em.outerTrigram?.name;
  const transition = getTransitionType(innerTrigram, outerTrigram);

  data.push({
    key,
    gate: entry.gateNumber,
    line: entry.lineNumber,
    innerPos: em.innerTrigram?.position,
    outerPos: em.outerTrigram?.position,
    innerTrigram,
    outerTrigram,
    gateType: em.gateType,
    transition,
    actualPlanet: exaltPlanets[0],
    allPlanets: exaltPlanets
  });
});

const crossZeroData = data.filter(d =>
  d.gateType === 'cross-zero-manifesting' || d.gateType === 'cross-zero-dematerialising'
);

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('RUSSELL WAVE MECHANICS HYPOTHESIS TEST');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log(`Cross-zero data points: ${crossZeroData.length}\n`);

// ═══════════════════════════════════════════════════════════════════════════
// ANALYZE RUSSELL PROPERTIES IN CROSS-ZERO DATA
// ═══════════════════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('PART 1: Russell Property Distributions in Cross-Zero Gates');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Count axis transitions
const axisCounts = {};
const zoneCounts = {};
const domCounts = {};
const gatePosCounts = {};

crossZeroData.forEach(d => {
  if (d.transition) {
    axisCounts[d.transition.axisTransition] = (axisCounts[d.transition.axisTransition] || 0) + 1;
    zoneCounts[d.transition.zoneTransition] = (zoneCounts[d.transition.zoneTransition] || 0) + 1;
    domCounts[d.transition.domTransition] = (domCounts[d.transition.domTransition] || 0) + 1;
    gatePosCounts[d.transition.gatePosition] = (gatePosCounts[d.transition.gatePosition] || 0) + 1;
  }
});

console.log('Axis Transitions:');
Object.entries(axisCounts).sort((a, b) => b[1] - a[1]).forEach(([t, c]) => {
  console.log(`  ${t}: ${c}`);
});

console.log('\nZone Transitions:');
Object.entries(zoneCounts).sort((a, b) => b[1] - a[1]).forEach(([t, c]) => {
  console.log(`  ${t}: ${c}`);
});

console.log('\nGate Position (is Thunder/Wind inner or outer?):');
Object.entries(gatePosCounts).sort((a, b) => b[1] - a[1]).forEach(([t, c]) => {
  console.log(`  ${t}: ${c}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// TEST: Do Russell properties correlate with planets?
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 2: Planet Distribution by Russell Properties');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// For each axis transition, what planets appear?
const planetsByAxis = {};
crossZeroData.forEach(d => {
  if (d.transition) {
    const key = d.transition.axisTransition;
    if (!planetsByAxis[key]) planetsByAxis[key] = {};
    planetsByAxis[key][d.actualPlanet] = (planetsByAxis[key][d.actualPlanet] || 0) + 1;
  }
});

console.log('Planets by Axis Transition:');
Object.entries(planetsByAxis).forEach(([axis, planets]) => {
  const sorted = Object.entries(planets).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((sum, [_, c]) => sum + c, 0);
  const topFreq = (sorted[0][1] / total * 100).toFixed(0);
  console.log(`  ${axis}: ${sorted.slice(0, 3).map(([p, c]) => `${p}:${c}`).join(', ')} (top=${topFreq}%)`);
});

// By gate position (inner vs outer Thunder/Wind)
const planetsByGatePos = {};
crossZeroData.forEach(d => {
  if (d.transition) {
    const key = d.transition.gatePosition;
    if (!planetsByGatePos[key]) planetsByGatePos[key] = {};
    planetsByGatePos[key][d.actualPlanet] = (planetsByGatePos[key][d.actualPlanet] || 0) + 1;
  }
});

console.log('\nPlanets by Gate Position:');
Object.entries(planetsByGatePos).forEach(([pos, planets]) => {
  const sorted = Object.entries(planets).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((sum, [_, c]) => sum + c, 0);
  console.log(`  ${pos}: ${sorted.slice(0, 4).map(([p, c]) => `${p}:${c}`).join(', ')}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// PREDICTION MODELS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 3: Prediction Models with Leave-One-Out Cross-Validation');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

function leaveOneOutAccuracy(items, getKey) {
  let correct = 0;
  let tested = 0;

  for (let i = 0; i < items.length; i++) {
    const testItem = items[i];
    const trainItems = items.filter((_, j) => j !== i);

    const model = {};
    trainItems.forEach(d => {
      const k = getKey(d);
      if (k) {
        if (!model[k]) model[k] = {};
        model[k][d.actualPlanet] = (model[k][d.actualPlanet] || 0) + 1;
      }
    });

    const testKey = getKey(testItem);
    if (testKey) {
      tested++;
      const dist = model[testKey];
      if (dist) {
        const prediction = Object.entries(dist).sort((a, b) => b[1] - a[1])[0][0];
        if (testItem.allPlanets.includes(prediction)) {
          correct++;
        }
      }
    }
  }

  return tested > 0 ? correct / tested : 0;
}

// Baseline: position + line + gateType
const keyBaseline = d => `${d.innerPos}_${d.line}_${d.gateType}`;
const accBaseline = leaveOneOutAccuracy(crossZeroData, keyBaseline);
console.log(`Baseline (pos, line, gateType): ${(accBaseline * 100).toFixed(1)}%`);

// Model A: Add axis transition
const keyAxisTrans = d => d.transition ?
  `${d.innerPos}_${d.line}_${d.gateType}_${d.transition.axisTransition}` : null;
const accAxisTrans = leaveOneOutAccuracy(crossZeroData, keyAxisTrans);
console.log(`+ Axis transition:              ${(accAxisTrans * 100).toFixed(1)}%`);

// Model B: Add zone transition
const keyZoneTrans = d => d.transition ?
  `${d.innerPos}_${d.line}_${d.gateType}_${d.transition.zoneTransition}` : null;
const accZoneTrans = leaveOneOutAccuracy(crossZeroData, keyZoneTrans);
console.log(`+ Zone transition:              ${(accZoneTrans * 100).toFixed(1)}%`);

// Model C: Add gate position
const keyGatePos = d => d.transition ?
  `${d.innerPos}_${d.line}_${d.gateType}_${d.transition.gatePosition}` : null;
const accGatePos = leaveOneOutAccuracy(crossZeroData, keyGatePos);
console.log(`+ Gate position:                ${(accGatePos * 100).toFixed(1)}%`);

// Model D: Add domination transition
const keyDomTrans = d => d.transition ?
  `${d.innerPos}_${d.line}_${d.gateType}_${d.transition.domTransition}` : null;
const accDomTrans = leaveOneOutAccuracy(crossZeroData, keyDomTrans);
console.log(`+ Domination transition:        ${(accDomTrans * 100).toFixed(1)}%`);

// Model E: Add amplitude
const keyAmplitude = d => d.transition ?
  `${d.innerPos}_${d.line}_${d.gateType}_amp${d.transition.amplitude}` : null;
const accAmplitude = leaveOneOutAccuracy(crossZeroData, keyAmplitude);
console.log(`+ Amplitude:                    ${(accAmplitude * 100).toFixed(1)}%`);

// Model F: Full Russell (axis + zone + gate + amplitude)
const keyFullRussell = d => d.transition ?
  `${d.innerPos}_${d.line}_${d.transition.axisTransition}_${d.transition.zoneTransition}_${d.transition.gatePosition}` : null;
const accFullRussell = leaveOneOutAccuracy(crossZeroData, keyFullRussell);
console.log(`Full Russell (no gateType):     ${(accFullRussell * 100).toFixed(1)}%`);

// Model G: Inner/Outer trigram names directly
const keyTrigrams = d => `${d.innerTrigram}_${d.outerTrigram}_${d.line}`;
const accTrigrams = leaveOneOutAccuracy(crossZeroData, keyTrigrams);
console.log(`Inner+Outer trigrams + line:    ${(accTrigrams * 100).toFixed(1)}%`);

// ═══════════════════════════════════════════════════════════════════════════
// PERMUTATION TEST
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 4: Permutation Test (Statistical Significance)');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Test the most promising model
const bestKey = keyTrigrams;
const bestAcc = accTrigrams;

const shuffledAccuracies = [];
const trigramPairs = crossZeroData.map(d => `${d.innerTrigram}_${d.outerTrigram}`);

for (let trial = 0; trial < 100; trial++) {
  const shuffledPairs = shuffleArray(trigramPairs);
  const shuffledData = crossZeroData.map((d, i) => {
    const [inner, outer] = shuffledPairs[i].split('_');
    return { ...d, innerTrigram: inner, outerTrigram: outer };
  });
  const acc = leaveOneOutAccuracy(shuffledData, keyTrigrams);
  shuffledAccuracies.push(acc);
}

const meanShuffled = shuffledAccuracies.reduce((a, b) => a + b, 0) / shuffledAccuracies.length;
const stdShuffled = Math.sqrt(
  shuffledAccuracies.reduce((sum, acc) => sum + Math.pow(acc - meanShuffled, 2), 0) / shuffledAccuracies.length
);
const zScore = (bestAcc - meanShuffled) / stdShuffled;

console.log('Testing: Inner+Outer trigrams + line');
console.log(`Actual accuracy:        ${(bestAcc * 100).toFixed(1)}%`);
console.log(`Mean shuffled accuracy: ${(meanShuffled * 100).toFixed(1)}%`);
console.log(`Std dev shuffled:       ${(stdShuffled * 100).toFixed(1)}%`);
console.log(`Z-score:                ${zScore.toFixed(2)}`);

// ═══════════════════════════════════════════════════════════════════════════
// DEEP DIVE: Which trigram combinations favor which planets?
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 5: Trigram Combination → Planet Patterns');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const trigramPlanetDist = {};
crossZeroData.forEach(d => {
  const key = `${d.innerTrigram}→${d.outerTrigram}`;
  if (!trigramPlanetDist[key]) trigramPlanetDist[key] = {};
  trigramPlanetDist[key][d.actualPlanet] = (trigramPlanetDist[key][d.actualPlanet] || 0) + 1;
});

console.log('Cross-zero trigram combinations and their planets:');
console.log('(Only showing combinations with >1 occurrence)');
console.log('─'.repeat(70));

Object.entries(trigramPlanetDist)
  .map(([combo, dist]) => {
    const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((sum, [_, c]) => sum + c, 0);
    const topFreq = sorted[0][1] / total;
    return { combo, sorted, total, topFreq };
  })
  .filter(c => c.total > 1)
  .sort((a, b) => b.topFreq - a.topFreq)
  .forEach(c => {
    const planetsStr = c.sorted.slice(0, 3).map(([p, n]) => `${p}:${n}`).join(', ');
    const marker = c.topFreq >= 0.6 ? '★' : c.topFreq >= 0.4 ? '○' : ' ';
    console.log(`${marker} ${c.combo.padEnd(20)} n=${c.total.toString().padStart(2)} top=${(c.topFreq*100).toFixed(0).padStart(3)}%  [${planetsStr}]`);
  });

// ═══════════════════════════════════════════════════════════════════════════
// CONCLUSION
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('CONCLUSION');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const improvement = bestAcc - accBaseline;
const isSignificant = zScore > 2;

if (isSignificant && improvement > 0.05) {
  console.log('✓ RUSSELL PROPERTIES CARRY SIGNAL');
  console.log(`  - Best model improvement: ${(improvement * 100).toFixed(1)} pp over baseline`);
  console.log(`  - Z-score vs shuffled: ${zScore.toFixed(2)} (>2 is significant)`);
  console.log('  - Trigram identity matters beyond just position');
  console.log('  → Russell wave mechanics may explain transformation variance');
} else if (improvement > 0.02) {
  console.log('? RUSSELL PROPERTIES MAY CARRY WEAK SIGNAL');
  console.log(`  - Best model improvement: ${(improvement * 100).toFixed(1)} pp`);
  console.log(`  - Z-score vs shuffled: ${zScore.toFixed(2)}`);
  console.log('  - Some correlation but not strongly significant');
} else {
  console.log('✗ RUSSELL PROPERTIES DO NOT IMPROVE PREDICTION');
  console.log(`  - Best model improvement: ${(improvement * 100).toFixed(1)} pp`);
  console.log(`  - Z-score vs shuffled: ${zScore.toFixed(2)}`);
  console.log('  - Russell wave mechanics do not explain cross-zero variance');
  console.log('  → Accept Option 3: Transformation assignments are empirical data');
}

console.log('\n─'.repeat(70));
console.log('SUMMARY:');
console.log(`  Baseline (pos, line, gateType): ${(accBaseline * 100).toFixed(1)}%`);
console.log(`  Best Russell model:             ${(bestAcc * 100).toFixed(1)}%`);
console.log(`  Target for derivation:          70%+`);
console.log('─'.repeat(70));
