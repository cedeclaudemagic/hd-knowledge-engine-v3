/**
 * Nuclear Trigram Hypothesis Test - With Cross-Validation
 *
 * The initial test showed 76.3% accuracy with nuclear trigrams, but that
 * could be overfitting (142 groups for 190 items = ~1.3 items per group).
 *
 * This test uses leave-one-out cross-validation to distinguish:
 * - REAL signal: nuclear structure carries planetary information
 * - NOISE: improvement is just memorization from smaller groups
 */

const tradGates = require('../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const emLines = require('../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

// Trigram binaries
const TRIGRAM_BINARY = {
  'Heaven': '111', 'Earth': '000', 'Thunder': '100', 'Water': '010',
  'Mountain': '001', 'Lake': '011', 'Fire': '101', 'Wind': '110'
};

const BINARY_TO_TRIGRAM = {};
Object.entries(TRIGRAM_BINARY).forEach(([name, bin]) => {
  BINARY_TO_TRIGRAM[bin] = name;
});

// Build hexagram lookup
const hexagramLookup = {};
emLines.mappings.filter(m => m.line === 1).forEach(entry => {
  const innerTrigram = entry.electromagnetic?.innerTrigram?.name;
  const outerTrigram = entry.electromagnetic?.outerTrigram?.name;
  if (innerTrigram && outerTrigram) {
    const innerBin = TRIGRAM_BINARY[innerTrigram];
    const outerBin = TRIGRAM_BINARY[outerTrigram];
    if (innerBin && outerBin) {
      hexagramLookup[entry.gate] = {
        innerTrigram, outerTrigram,
        binary: innerBin + outerBin
      };
    }
  }
});

// Calculate nuclear trigrams
function getNuclearTrigrams(hexBinary) {
  const lowerNuclear = hexBinary[1] + hexBinary[2] + hexBinary[3];
  const upperNuclear = hexBinary[2] + hexBinary[3] + hexBinary[4];
  return {
    lowerNuclear: BINARY_TO_TRIGRAM[lowerNuclear],
    upperNuclear: BINARY_TO_TRIGRAM[upperNuclear]
  };
}

Object.values(hexagramLookup).forEach(h => {
  const nuclear = getNuclearTrigrams(h.binary);
  h.lowerNuclear = nuclear.lowerNuclear;
  h.upperNuclear = nuclear.upperNuclear;
  h.nuclearKey = `${nuclear.lowerNuclear}/${nuclear.upperNuclear}`;
});

// Build EM + planetary data
const emLookup = {};
emLines.mappings.forEach(l => {
  emLookup[l.gate + '.' + l.line] = l.electromagnetic;
});

const data = [];
tradGates.mappings.filter(m => m.lineNumber).forEach(entry => {
  const key = entry.gateNumber + '.' + entry.lineNumber;
  const em = emLookup[key];
  const hex = hexagramLookup[entry.gateNumber];
  if (!em || !hex) return;

  const exaltPlanets = (entry.knowledge?.blackBook?.exaltation?.planets || []).map(p => p.planet);
  if (exaltPlanets.length === 0) return;

  data.push({
    key,
    gate: entry.gateNumber,
    line: entry.lineNumber,
    innerPos: em.innerTrigram?.position,
    gateType: em.gateType,
    nuclearKey: hex.nuclearKey,
    actualPlanet: exaltPlanets[0],
    allPlanets: exaltPlanets
  });
});

const crossZeroData = data.filter(d =>
  d.gateType === 'cross-zero-manifesting' || d.gateType === 'cross-zero-dematerialising'
);

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('NUCLEAR TRIGRAM HYPOTHESIS: CROSS-VALIDATION TEST');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log(`Cross-zero data points: ${crossZeroData.length}`);

// ═══════════════════════════════════════════════════════════════════════════
// LEAVE-ONE-OUT CROSS-VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n─'.repeat(70));
console.log('LEAVE-ONE-OUT CROSS-VALIDATION');
console.log('For each item, train on all OTHER items, predict that one item');
console.log('This prevents overfitting - we only predict what we haven\'t seen');
console.log('─'.repeat(70) + '\n');

function leaveOneOutAccuracy(items, getKey) {
  let correct = 0;

  for (let i = 0; i < items.length; i++) {
    const testItem = items[i];
    const trainItems = items.filter((_, j) => j !== i);

    // Build model from training data only
    const model = {};
    trainItems.forEach(d => {
      const k = getKey(d);
      if (!model[k]) model[k] = {};
      model[k][d.actualPlanet] = (model[k][d.actualPlanet] || 0) + 1;
    });

    // Get prediction for test item
    const testKey = getKey(testItem);
    const dist = model[testKey];

    if (dist) {
      const prediction = Object.entries(dist).sort((a, b) => b[1] - a[1])[0][0];
      if (testItem.allPlanets.includes(prediction)) {
        correct++;
      }
    }
    // If no training data for this key, count as wrong
  }

  return correct / items.length;
}

// Model A: Without nuclear
const keyA = d => `${d.innerPos}_${d.line}_${d.gateType}`;
const accA = leaveOneOutAccuracy(crossZeroData, keyA);

// Model B: With nuclear
const keyB = d => `${d.innerPos}_${d.line}_${d.gateType}_${d.nuclearKey}`;
const accB = leaveOneOutAccuracy(crossZeroData, keyB);

console.log('LEAVE-ONE-OUT RESULTS:');
console.log('─'.repeat(50));
console.log(`Model A (without nuclear): ${(accA * 100).toFixed(1)}%`);
console.log(`Model B (with nuclear):    ${(accB * 100).toFixed(1)}%`);
console.log(`Improvement:               ${((accB - accA) * 100).toFixed(1)} percentage points`);

// ═══════════════════════════════════════════════════════════════════════════
// RANDOM SHUFFLE TEST (Permutation Test)
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n─'.repeat(70));
console.log('PERMUTATION TEST');
console.log('Shuffle nuclear labels randomly 100 times, measure accuracy each time');
console.log('If nuclear is noise, shuffled accuracy ≈ unshuffled accuracy');
console.log('─'.repeat(70) + '\n');

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const shuffledAccuracies = [];
const nuclearKeys = crossZeroData.map(d => d.nuclearKey);

for (let trial = 0; trial < 100; trial++) {
  const shuffledKeys = shuffleArray(nuclearKeys);
  const shuffledData = crossZeroData.map((d, i) => ({
    ...d,
    nuclearKey: shuffledKeys[i]
  }));

  const acc = leaveOneOutAccuracy(shuffledData, keyB);
  shuffledAccuracies.push(acc);
}

const meanShuffled = shuffledAccuracies.reduce((a, b) => a + b, 0) / shuffledAccuracies.length;
const stdShuffled = Math.sqrt(
  shuffledAccuracies.reduce((sum, acc) => sum + Math.pow(acc - meanShuffled, 2), 0) / shuffledAccuracies.length
);

console.log(`Actual accuracy with nuclear:  ${(accB * 100).toFixed(1)}%`);
console.log(`Mean shuffled accuracy:        ${(meanShuffled * 100).toFixed(1)}%`);
console.log(`Std dev of shuffled:           ${(stdShuffled * 100).toFixed(1)}%`);

const zScore = (accB - meanShuffled) / stdShuffled;
console.log(`Z-score:                       ${zScore.toFixed(2)}`);

// ═══════════════════════════════════════════════════════════════════════════
// CONCLUSION
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('CONCLUSION');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const improvement = accB - accA;
const isSignificant = zScore > 2;
const improvementPct = (improvement * 100).toFixed(1);

if (isSignificant && improvement > 0.05) {
  console.log('✓ NUCLEAR TRIGRAMS CARRY REAL SIGNAL');
  console.log(`  - Leave-one-out improvement: ${improvementPct} percentage points`);
  console.log(`  - Z-score vs shuffled: ${zScore.toFixed(2)} (>2 is significant)`);
  console.log('  - Cross-zero variance IS partially explained by hexagram structure');
  console.log('  → The I Ching has more derivable layers than position alone');
} else if (improvement > 0.02) {
  console.log('? NUCLEAR TRIGRAMS MAY CARRY WEAK SIGNAL');
  console.log(`  - Leave-one-out improvement: ${improvementPct} percentage points`);
  console.log(`  - Z-score vs shuffled: ${zScore.toFixed(2)}`);
  console.log('  - Some correlation but not strongly significant');
  console.log('  → Worth investigating further, but not a slam dunk');
} else {
  console.log('✗ NUCLEAR TRIGRAMS DO NOT CARRY SIGNAL');
  console.log(`  - Leave-one-out improvement: ${improvementPct} percentage points`);
  console.log(`  - Z-score vs shuffled: ${zScore.toFixed(2)}`);
  console.log('  - Improvement is within noise range');
  console.log('  → Classical I Ching structure doesn\'t explain cross-zero variance');
  console.log('  → Look elsewhere (Russell? Other structures? Empirical?)');
}

console.log('\n─'.repeat(70));
console.log('SUMMARY:');
console.log(`  Baseline (without nuclear): ${(accA * 100).toFixed(1)}%`);
console.log(`  With nuclear (cross-validated): ${(accB * 100).toFixed(1)}%`);
console.log(`  Target for derivation: 70%+`);
console.log('─'.repeat(70));

// ═══════════════════════════════════════════════════════════════════════════
// DETAILED BREAKDOWN BY GATE TYPE
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('BREAKDOWN BY GATE TYPE');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const byGateType = {
  'cross-zero-manifesting': crossZeroData.filter(d => d.gateType === 'cross-zero-manifesting'),
  'cross-zero-dematerialising': crossZeroData.filter(d => d.gateType === 'cross-zero-dematerialising')
};

Object.entries(byGateType).forEach(([gateType, items]) => {
  const accNoNuc = leaveOneOutAccuracy(items, keyA);
  const accWithNuc = leaveOneOutAccuracy(items, keyB);
  console.log(`${gateType}:`);
  console.log(`  Without nuclear: ${(accNoNuc * 100).toFixed(1)}%`);
  console.log(`  With nuclear:    ${(accWithNuc * 100).toFixed(1)}%`);
  console.log(`  Improvement:     ${((accWithNuc - accNoNuc) * 100).toFixed(1)} pp\n`);
});
