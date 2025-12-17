/**
 * Nuclear Trigram Hypothesis Test
 *
 * Question: Do nuclear trigrams explain cross-zero planetary variance?
 *
 * Nuclear trigrams are classical I Ching structure:
 * - Lower nuclear: lines 2-3-4
 * - Upper nuclear: lines 3-4-5
 * Together they form the "nuclear hexagram" - the hidden structure within
 *
 * Test: Do cross-zero gates with identical (position, line) but different
 * nuclear trigrams have different exalting planets?
 */

const tradGates = require('../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const emLines = require('../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: Build hexagram binary lookup from electromagnetic data
// ═══════════════════════════════════════════════════════════════════════════

// Trigram binaries (bottom to top: line 1, 2, 3)
const TRIGRAM_BINARY = {
  'Heaven': '111',    // ☰ all yang
  'Earth': '000',     // ☷ all yin
  'Thunder': '100',   // ☳ yang at bottom
  'Water': '010',     // ☵ yang in middle
  'Mountain': '001',  // ☶ yang at top
  'Lake': '011',      // ☱ yin at bottom
  'Fire': '101',      // ☲ yin in middle
  'Wind': '110'       // ☴ yin at top
};

// Reverse lookup: binary to trigram name
const BINARY_TO_TRIGRAM = {};
Object.entries(TRIGRAM_BINARY).forEach(([name, bin]) => {
  BINARY_TO_TRIGRAM[bin] = name;
});

// Build hexagram lookup from electromagnetic lines data (line 1 entries have gate info)
const hexagramLookup = {};
emLines.mappings.filter(m => m.line === 1).forEach(entry => {
  const innerTrigram = entry.electromagnetic?.innerTrigram?.name;
  const outerTrigram = entry.electromagnetic?.outerTrigram?.name;

  if (innerTrigram && outerTrigram) {
    const innerBin = TRIGRAM_BINARY[innerTrigram];
    const outerBin = TRIGRAM_BINARY[outerTrigram];
    if (innerBin && outerBin) {
      // Full hexagram binary: lines 1-6 from bottom to top
      const fullBinary = innerBin + outerBin;
      hexagramLookup[entry.gate] = {
        number: entry.gate,
        innerTrigram: innerTrigram,
        outerTrigram: outerTrigram,
        binary: fullBinary
      };
    }
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: Calculate nuclear trigrams
// ═══════════════════════════════════════════════════════════════════════════

function getNuclearTrigrams(hexBinary) {
  // hexBinary is 6 characters: lines 1,2,3,4,5,6 (bottom to top)
  // Lower nuclear: lines 2,3,4 → indices 1,2,3
  // Upper nuclear: lines 3,4,5 → indices 2,3,4

  const lowerNuclear = hexBinary[1] + hexBinary[2] + hexBinary[3];
  const upperNuclear = hexBinary[2] + hexBinary[3] + hexBinary[4];

  return {
    lowerNuclear: BINARY_TO_TRIGRAM[lowerNuclear] || lowerNuclear,
    upperNuclear: BINARY_TO_TRIGRAM[upperNuclear] || upperNuclear,
    lowerBinary: lowerNuclear,
    upperBinary: upperNuclear
  };
}

// Add nuclear trigrams to all hexagrams
Object.values(hexagramLookup).forEach(h => {
  const nuclear = getNuclearTrigrams(h.binary);
  h.lowerNuclear = nuclear.lowerNuclear;
  h.upperNuclear = nuclear.upperNuclear;
  h.nuclearKey = `${nuclear.lowerNuclear}/${nuclear.upperNuclear}`;
});

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('NUCLEAR TRIGRAM HYPOTHESIS TEST');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Show sample hexagrams with nuclear trigrams
console.log('Sample hexagrams with nuclear trigrams:');
console.log('─'.repeat(70));
[1, 2, 11, 25, 47, 54, 57, 58].forEach(num => {
  const h = hexagramLookup[num];
  if (h) {
    console.log(`Gate ${num}: ${h.innerTrigram}/${h.outerTrigram} → nuclear: ${h.nuclearKey}`);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: Build EM + planetary data with nuclear info
// ═══════════════════════════════════════════════════════════════════════════

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
    outerPos: em.outerTrigram?.position,
    gateType: em.gateType,
    lowerNuclear: hex.lowerNuclear,
    upperNuclear: hex.upperNuclear,
    nuclearKey: hex.nuclearKey,
    actualPlanet: exaltPlanets[0],
    allPlanets: exaltPlanets
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: Filter to cross-zero gates only
// ═══════════════════════════════════════════════════════════════════════════

const crossZeroData = data.filter(d =>
  d.gateType === 'cross-zero-manifesting' || d.gateType === 'cross-zero-dematerialising'
);

console.log(`\n\nTotal cross-zero lines: ${crossZeroData.length}`);

// ═══════════════════════════════════════════════════════════════════════════
// PART 5: THE KEY TEST - Same (position, line) but different nuclear
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('KEY TEST: Same (position, line, gateType) with different nuclear trigrams');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Group cross-zero data by (position, line, gateType)
const byPosLine = {};
crossZeroData.forEach(d => {
  const key = `${d.innerPos}_${d.line}_${d.gateType}`;
  if (!byPosLine[key]) byPosLine[key] = [];
  byPosLine[key].push(d);
});

// Find groups where nuclear structure varies
let groupsWithNuclearVariance = 0;
let groupsWhereNuclearExplains = 0;
let groupsWhereNuclearDoesNotExplain = 0;
const detailedResults = [];

Object.entries(byPosLine).forEach(([posLineKey, items]) => {
  // Get unique nuclear keys in this group
  const nuclearKeys = [...new Set(items.map(i => i.nuclearKey))];

  if (nuclearKeys.length > 1) {
    groupsWithNuclearVariance++;

    // Get unique planets in this group
    const planets = [...new Set(items.map(i => i.actualPlanet))];

    // Check if nuclear structure correlates with planet
    // Group items by nuclear key and see if planets differ
    const byNuclear = {};
    items.forEach(i => {
      if (!byNuclear[i.nuclearKey]) byNuclear[i.nuclearKey] = [];
      byNuclear[i.nuclearKey].push(i.actualPlanet);
    });

    // Calculate if nuclear explains planet variance
    const nuclearPlanetSets = Object.entries(byNuclear).map(([nk, ps]) => ({
      nuclear: nk,
      planets: [...new Set(ps)]
    }));

    // If each nuclear key maps to distinct planets, nuclear explains
    const allPlanetsDistinct = nuclearPlanetSets.every(nps => nps.planets.length === 1);
    const planetSetsOverlap = !allPlanetsDistinct;

    if (planets.length > 1) {
      // There IS planet variance to explain
      const nuclearGroupsHaveDistinctPlanets = nuclearPlanetSets.every((nps, i) => {
        const otherPlanets = nuclearPlanetSets.filter((_, j) => j !== i).flatMap(o => o.planets);
        return nps.planets.every(p => !otherPlanets.includes(p));
      });

      if (nuclearGroupsHaveDistinctPlanets && nuclearKeys.length >= planets.length) {
        groupsWhereNuclearExplains++;
      } else {
        groupsWhereNuclearDoesNotExplain++;
      }

      detailedResults.push({
        posLineKey,
        nuclearKeys,
        planets,
        byNuclear: nuclearPlanetSets,
        explains: nuclearGroupsHaveDistinctPlanets
      });
    }
  }
});

console.log(`Groups with nuclear variance: ${groupsWithNuclearVariance}`);
console.log(`Groups where nuclear EXPLAINS planet variance: ${groupsWhereNuclearExplains}`);
console.log(`Groups where nuclear does NOT explain: ${groupsWhereNuclearDoesNotExplain}`);

// ═══════════════════════════════════════════════════════════════════════════
// PART 6: Detailed examination of key cases
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('DETAILED EXAMINATION: Cases where nuclear might explain');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

detailedResults.filter(r => r.explains).slice(0, 10).forEach(r => {
  console.log(`\n${r.posLineKey}:`);
  console.log(`  Nuclear keys: ${r.nuclearKeys.join(', ')}`);
  console.log(`  Planets: ${r.planets.join(', ')}`);
  r.byNuclear.forEach(bn => {
    console.log(`    ${bn.nuclear} → ${bn.planets.join(', ')}`);
  });
});

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('DETAILED EXAMINATION: Cases where nuclear does NOT explain');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

detailedResults.filter(r => !r.explains).slice(0, 10).forEach(r => {
  console.log(`\n${r.posLineKey}:`);
  console.log(`  Nuclear keys: ${r.nuclearKeys.join(', ')}`);
  console.log(`  Planets: ${r.planets.join(', ')}`);
  r.byNuclear.forEach(bn => {
    console.log(`    ${bn.nuclear} → ${bn.planets.join(', ')}`);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 7: Build enhanced prediction model with nuclear trigrams
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PREDICTION MODEL: Adding nuclear trigrams to cross-zero prediction');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Model A: Without nuclear (baseline)
const modelA = {};
crossZeroData.forEach(d => {
  const key = `${d.innerPos}_${d.line}_${d.gateType}`;
  if (!modelA[key]) modelA[key] = {};
  modelA[key][d.actualPlanet] = (modelA[key][d.actualPlanet] || 0) + 1;
});

const rulesA = {};
Object.entries(modelA).forEach(([key, dist]) => {
  const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  rulesA[key] = sorted[0][0];
});

let correctA = 0;
crossZeroData.forEach(d => {
  const key = `${d.innerPos}_${d.line}_${d.gateType}`;
  if (d.allPlanets.includes(rulesA[key])) correctA++;
});

console.log(`Model A (without nuclear): ${correctA}/${crossZeroData.length} = ${(correctA/crossZeroData.length*100).toFixed(1)}%`);

// Model B: With nuclear trigrams
const modelB = {};
crossZeroData.forEach(d => {
  const key = `${d.innerPos}_${d.line}_${d.gateType}_${d.nuclearKey}`;
  if (!modelB[key]) modelB[key] = {};
  modelB[key][d.actualPlanet] = (modelB[key][d.actualPlanet] || 0) + 1;
});

const rulesB = {};
Object.entries(modelB).forEach(([key, dist]) => {
  const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  rulesB[key] = sorted[0][0];
});

let correctB = 0;
crossZeroData.forEach(d => {
  const key = `${d.innerPos}_${d.line}_${d.gateType}_${d.nuclearKey}`;
  if (d.allPlanets.includes(rulesB[key])) correctB++;
});

console.log(`Model B (with nuclear):    ${correctB}/${crossZeroData.length} = ${(correctB/crossZeroData.length*100).toFixed(1)}%`);
console.log(`Improvement:               ${((correctB - correctA)/crossZeroData.length*100).toFixed(1)} percentage points`);

// ═══════════════════════════════════════════════════════════════════════════
// PART 8: Test with BOTH nuclear trigrams separately
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n─'.repeat(70));
console.log('Testing lower vs upper nuclear separately:');

// Model C: With lower nuclear only
const modelC = {};
crossZeroData.forEach(d => {
  const key = `${d.innerPos}_${d.line}_${d.gateType}_${d.lowerNuclear}`;
  if (!modelC[key]) modelC[key] = {};
  modelC[key][d.actualPlanet] = (modelC[key][d.actualPlanet] || 0) + 1;
});

const rulesC = {};
Object.entries(modelC).forEach(([key, dist]) => {
  const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  rulesC[key] = sorted[0][0];
});

let correctC = 0;
crossZeroData.forEach(d => {
  const key = `${d.innerPos}_${d.line}_${d.gateType}_${d.lowerNuclear}`;
  if (d.allPlanets.includes(rulesC[key])) correctC++;
});

console.log(`Model C (lower nuclear):   ${correctC}/${crossZeroData.length} = ${(correctC/crossZeroData.length*100).toFixed(1)}%`);

// Model D: With upper nuclear only
const modelD = {};
crossZeroData.forEach(d => {
  const key = `${d.innerPos}_${d.line}_${d.gateType}_${d.upperNuclear}`;
  if (!modelD[key]) modelD[key] = {};
  modelD[key][d.actualPlanet] = (modelD[key][d.actualPlanet] || 0) + 1;
});

const rulesD = {};
Object.entries(modelD).forEach(([key, dist]) => {
  const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  rulesD[key] = sorted[0][0];
});

let correctD = 0;
crossZeroData.forEach(d => {
  const key = `${d.innerPos}_${d.line}_${d.gateType}_${d.upperNuclear}`;
  if (d.allPlanets.includes(rulesD[key])) correctD++;
});

console.log(`Model D (upper nuclear):   ${correctD}/${crossZeroData.length} = ${(correctD/crossZeroData.length*100).toFixed(1)}%`);

// ═══════════════════════════════════════════════════════════════════════════
// PART 9: Statistical significance test
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('STATISTICAL ANALYSIS');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Count unique combinations in each model
const uniqueA = Object.keys(rulesA).length;
const uniqueB = Object.keys(rulesB).length;

console.log(`Model A combinations: ${uniqueA}`);
console.log(`Model B combinations: ${uniqueB}`);
console.log(`Ratio: ${(uniqueB/uniqueA).toFixed(1)}x more granular`);

// Expected accuracy if nuclear is random noise
// If we have N items and split them into M groups, mode-based prediction
// accuracy increases just from having fewer items per group
const avgPerGroupA = crossZeroData.length / uniqueA;
const avgPerGroupB = crossZeroData.length / uniqueB;

console.log(`\nAvg items per group (Model A): ${avgPerGroupA.toFixed(1)}`);
console.log(`Avg items per group (Model B): ${avgPerGroupB.toFixed(1)}`);

// Improvement explained by granularity alone?
const baselineImprovement = (correctB - correctA) / crossZeroData.length * 100;
console.log(`\nRaw improvement: ${baselineImprovement.toFixed(1)} percentage points`);

// If nuclear is just noise, improvement should be roughly proportional to
// reduction in group size (more overfitting)
const expectedIfNoise = (1 - avgPerGroupB/avgPerGroupA) * (1 - correctA/crossZeroData.length) * 100;
console.log(`Expected if nuclear is noise: ~${expectedIfNoise.toFixed(1)} percentage points`);

if (baselineImprovement > expectedIfNoise * 1.5) {
  console.log('\n→ Nuclear trigrams appear to carry REAL information (improvement > noise expectation)');
} else if (baselineImprovement > expectedIfNoise) {
  console.log('\n→ Nuclear trigrams MAY carry information (improvement ~ noise expectation)');
} else {
  console.log('\n→ Nuclear trigrams appear to be NOISE (improvement ≤ noise expectation)');
}

// ═══════════════════════════════════════════════════════════════════════════
// PART 10: CONCLUSION
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('CONCLUSION');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const improvement = correctB - correctA;
const percentImprovement = (improvement / crossZeroData.length * 100).toFixed(1);

if (improvement > 10) {
  console.log('RESULT: Nuclear trigrams SIGNIFICANTLY improve prediction');
  console.log(`        ${percentImprovement} percentage point improvement`);
  console.log('        Cross-zero variance is partially explained by hexagram structure');
  console.log('        → The I Ching has more derivable layers');
} else if (improvement > 5) {
  console.log('RESULT: Nuclear trigrams MODESTLY improve prediction');
  console.log(`        ${percentImprovement} percentage point improvement`);
  console.log('        Some signal, but not the primary missing variable');
  console.log('        → Worth exploring other hexagram structures');
} else {
  console.log('RESULT: Nuclear trigrams do NOT significantly improve prediction');
  console.log(`        Only ${percentImprovement} percentage point improvement`);
  console.log('        Cross-zero variance is NOT explained by nuclear structure');
  console.log('        → Look elsewhere (Russell? Other I Ching layers? Empirical?)');
}

console.log('\n─'.repeat(70));
console.log('Cross-zero baseline: 43.7%');
console.log(`Cross-zero with nuclear: ${(correctB/crossZeroData.length*100).toFixed(1)}%`);
console.log('Target for "cracking" transformation layer: 70%+');
console.log('─'.repeat(70));
