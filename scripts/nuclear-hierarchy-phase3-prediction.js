/**
 * Phase 3: Predictive Modelling - Nuclear Hierarchy Research
 *
 * Tests whether hierarchy features improve prediction of cross-zero planetary assignments.
 *
 * Models:
 * - Baseline: (em_position, line, gate_type)
 * - Model A: + pillar
 * - Model B: + mystery
 * - Model C: + pillar, mystery, level (full hierarchy)
 * - Model D: Hierarchy-only (pillar, mystery, level, line)
 *
 * Stratified Analysis:
 * - Universal planets (same polarity in all pillars): Mars, Sun, Mercury
 * - Discriminating planets (pillar-specific polarity): Pluto, Venus, etc.
 */

const fs = require('fs');
const path = require('path');

// === Data Loading ===
const hierarchyPath = path.join(__dirname, '../knowledge-systems/nuclear-hierarchy/mappings/nuclear-hierarchy-mappings.json');
const planetaryPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const reportsDir = path.join(__dirname, '../docs/research/planetary/reports');

const hierarchy = JSON.parse(fs.readFileSync(hierarchyPath, 'utf8'));
const planetaryRaw = JSON.parse(fs.readFileSync(planetaryPath, 'utf8'));

// Transform planetary data
const planetary = {};
planetaryRaw.mappings.forEach(entry => {
  const gateNum = entry.gateNumber;
  if (!planetary[gateNum]) {
    planetary[gateNum] = { gate: gateNum, lines: [] };
  }
  const exaltPlanets = [];
  const detriPlanets = [];
  if (entry.knowledge.blackBook?.exaltation?.planets) {
    entry.knowledge.blackBook.exaltation.planets.forEach(p => {
      if (p.planet) exaltPlanets.push(p.planet);
    });
  }
  if (entry.knowledge.blackBook?.detriment?.planets) {
    entry.knowledge.blackBook.detriment.planets.forEach(p => {
      if (p.planet) detriPlanets.push(p.planet);
    });
  }
  planetary[gateNum].lines.push({ line: entry.lineNumber, exaltPlanets, detriPlanets });
});
Object.values(planetary).forEach(g => g.lines.sort((a, b) => a.line - b.line));

// Build hierarchy lookup
const hierarchyLookup = {};
hierarchy.gateMappings.forEach(g => { hierarchyLookup[g.gate] = g; });

// Build combined dataset
const combinedData = [];
for (let gate = 1; gate <= 64; gate++) {
  const hierData = hierarchyLookup[gate];
  const planetData = planetary[gate];
  if (!hierData || !planetData) continue;
  planetData.lines.forEach(lineData => {
    combinedData.push({
      gate, line: lineData.line,
      level: hierData.level, pillar: hierData.pillar,
      mystery: hierData.mystery, element: hierData.element,
      gateType: hierData.gateType,
      innerPosition: hierData.innerPosition,
      outerPosition: hierData.outerPosition,
      exaltPlanets: lineData.exaltPlanets || [],
      detriPlanets: lineData.detriPlanets || []
    });
  });
}

const PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];
const PILLAR_NAMES = { 1: 'Fire', 2: 'Water', 63: 'Truth', 64: 'Light' };

// Define planet categories based on Phase 2 polarity findings
const UNIVERSAL_PLANETS = ['Mars', 'Sun', 'Mercury']; // All same-sign polarity
const DISCRIMINATING_PLANETS = ['Pluto', 'Venus', 'Saturn', 'Neptune', 'Uranus', 'Moon', 'Jupiter', 'Earth'];

// Filter to cross-zero gates only
const crossZeroData = combinedData.filter(d =>
  d.gateType === 'cross-zero-manifesting' || d.gateType === 'cross-zero-dematerialising'
);

console.log(`Total lines: ${combinedData.length}`);
console.log(`Cross-zero lines: ${crossZeroData.length}`);

// === Prediction Framework ===

// Build frequency table for a given feature combination
function buildFrequencyTable(data, getKey) {
  const table = {};
  data.forEach(d => {
    d.exaltPlanets.forEach(planet => {
      const key = getKey(d);
      if (!table[key]) table[key] = {};
      table[key][planet] = (table[key][planet] || 0) + 1;
    });
  });
  return table;
}

// Get most frequent planet for a key
function getMostFrequentPlanet(table, key) {
  if (!table[key]) return null;
  const counts = table[key];
  let maxCount = 0;
  let maxPlanet = null;
  Object.entries(counts).forEach(([planet, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxPlanet = planet;
    }
  });
  return maxPlanet;
}

// Leave-One-Out Cross-Validation
function runLOOCV(data, getKey, planetFilter = null) {
  let correct = 0;
  let total = 0;

  data.forEach((testItem, idx) => {
    // Filter exalt planets if needed
    const targetPlanets = planetFilter
      ? testItem.exaltPlanets.filter(p => planetFilter.includes(p))
      : testItem.exaltPlanets;

    if (targetPlanets.length === 0) return;

    // Build training set (exclude test item)
    const trainData = data.filter((_, i) => i !== idx);

    // Build frequency table from training data
    const table = buildFrequencyTable(
      trainData.map(d => ({
        ...d,
        exaltPlanets: planetFilter ? d.exaltPlanets.filter(p => planetFilter.includes(p)) : d.exaltPlanets
      })),
      getKey
    );

    // Predict
    const key = getKey(testItem);
    const predicted = getMostFrequentPlanet(table, key);

    // Check if prediction matches any actual planet
    if (predicted && targetPlanets.includes(predicted)) {
      correct++;
    }
    total++;
  });

  return { correct, total, accuracy: total > 0 ? (correct / total * 100).toFixed(1) : 'N/A' };
}

// === Model Definitions ===

// Models designed to avoid overfitting (coarser feature combinations)
const models = {
  baseline: {
    name: 'Baseline (GateType + Line)',
    getKey: d => `${d.gateType}|${d.line}`
  },
  pillarLine: {
    name: 'Pillar + Line',
    getKey: d => `${d.pillar}|${d.line}`
  },
  pillarGateType: {
    name: 'Pillar + GateType',
    getKey: d => `${d.pillar}|${d.gateType}`
  },
  pillarGateTypeLine: {
    name: 'Pillar + GateType + Line',
    getKey: d => `${d.pillar}|${d.gateType}|${d.line}`
  },
  elementLine: {
    name: 'Element + Line',
    getKey: d => `${d.element}|${d.line}`
  },
  pillarOnly: {
    name: 'Pillar Only',
    getKey: d => `${d.pillar}`
  },
  lineOnly: {
    name: 'Line Only',
    getKey: d => `${d.line}`
  }
};

// === Run All Models ===
console.log('\nRunning Leave-One-Out Cross-Validation...\n');

const results = {
  overall: {},
  universal: {},
  discriminating: {}
};

// Overall (all planets)
console.log('Testing: All Planets');
Object.entries(models).forEach(([key, model]) => {
  const result = runLOOCV(crossZeroData, model.getKey);
  results.overall[key] = { ...result, name: model.name };
  console.log(`  ${model.name}: ${result.accuracy}% (${result.correct}/${result.total})`);
});

// Universal planets only
console.log('\nTesting: Universal Planets (Mars, Sun, Mercury)');
Object.entries(models).forEach(([key, model]) => {
  const result = runLOOCV(crossZeroData, model.getKey, UNIVERSAL_PLANETS);
  results.universal[key] = { ...result, name: model.name };
  console.log(`  ${model.name}: ${result.accuracy}% (${result.correct}/${result.total})`);
});

// Discriminating planets only
console.log('\nTesting: Discriminating Planets (Pluto, Venus, Saturn, etc.)');
Object.entries(models).forEach(([key, model]) => {
  const result = runLOOCV(crossZeroData, model.getKey, DISCRIMINATING_PLANETS);
  results.discriminating[key] = { ...result, name: model.name };
  console.log(`  ${model.name}: ${result.accuracy}% (${result.correct}/${result.total})`);
});

// === Per-Planet Analysis ===
console.log('\nPer-Planet Accuracy (Pillar+Line vs Baseline):');
const perPlanetResults = {};
PLANETS.forEach(planet => {
  const baseline = runLOOCV(crossZeroData, models.baseline.getKey, [planet]);
  const pillarLine = runLOOCV(crossZeroData, models.pillarLine.getKey, [planet]);
  const pillarOnly = runLOOCV(crossZeroData, models.pillarOnly.getKey, [planet]);

  if (baseline.total >= 5) {
    const improvement = parseFloat(pillarLine.accuracy) - parseFloat(baseline.accuracy);
    perPlanetResults[planet] = {
      baseline: baseline.accuracy,
      pillarLine: pillarLine.accuracy,
      pillarOnly: pillarOnly.accuracy,
      improvement: improvement.toFixed(1),
      category: UNIVERSAL_PLANETS.includes(planet) ? 'universal' : 'discriminating',
      total: baseline.total
    };
    console.log(`  ${planet}: Baseline ${baseline.accuracy}% → Pillar+Line ${pillarLine.accuracy}% (${improvement >= 0 ? '+' : ''}${improvement.toFixed(1)}%)`);
  }
});

// === Statistical Significance via Permutation ===
console.log('\nRunning permutation test for Pillar+Line vs Baseline...');

function calculateImprovement(data, baselineKey, testKey) {
  const baseline = runLOOCV(data, baselineKey);
  const test = runLOOCV(data, testKey);
  return parseFloat(test.accuracy) - parseFloat(baseline.accuracy);
}

const observedImprovement = calculateImprovement(crossZeroData, models.baseline.getKey, models.pillarLine.getKey);

// Permutation test: shuffle pillar assignments
const permutedImprovements = [];
const NUM_PERMUTATIONS = 500; // Reduced for speed

for (let i = 0; i < NUM_PERMUTATIONS; i++) {
  // Shuffle pillar assignments
  const shuffledData = crossZeroData.map(d => ({
    ...d,
    pillar: [1, 2, 63, 64][Math.floor(Math.random() * 4)],
    mystery: d.mystery ? [23, 24, 27, 28, 37, 38, 39, 40, 43, 44, 53, 54][Math.floor(Math.random() * 12)] : null
  }));
  permutedImprovements.push(calculateImprovement(shuffledData, models.baseline.getKey, models.pillarLine.getKey));
}

const mean = permutedImprovements.reduce((a, b) => a + b, 0) / permutedImprovements.length;
const variance = permutedImprovements.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / permutedImprovements.length;
const std = Math.sqrt(variance);
const zScore = std > 0 ? (observedImprovement - mean) / std : 0;

console.log(`\nPermutation test results (${NUM_PERMUTATIONS} permutations):`);
console.log(`  Observed improvement: ${observedImprovement.toFixed(2)}%`);
console.log(`  Permuted mean: ${mean.toFixed(2)}%`);
console.log(`  Z-score: ${zScore.toFixed(2)}`);
console.log(`  Significant: ${Math.abs(zScore) >= 2.0 ? 'YES' : 'NO'}`);

// === Generate Report ===
function generateReport() {
  const baselineAcc = parseFloat(results.overall.baseline.accuracy);
  const pillarLineAcc = parseFloat(results.overall.pillarLine.accuracy);
  const improvement = pillarLineAcc - baselineAcc;

  let report = `# Phase 3: Predictive Modelling - Nuclear Hierarchy Research

**Generated**: ${new Date().toISOString().split('T')[0]}

## Overview

This report tests whether adding nuclear hierarchy features improves prediction of cross-zero exaltation planets.

**Dataset**: ${crossZeroData.length} cross-zero lines (out of ${combinedData.length} total)
**Method**: Leave-One-Out Cross-Validation (LOOCV)
**Note**: Models use coarse feature combinations to avoid sparsity/overfitting

---

## Model Comparison (All Planets)

| Model | Features | Accuracy | vs Baseline |
|-------|----------|----------|-------------|
| Baseline | GateType + Line | ${results.overall.baseline.accuracy}% | - |
| **Pillar + Line** | Pillar + Line | **${results.overall.pillarLine.accuracy}%** | **${improvement >= 0 ? '+' : ''}${improvement.toFixed(1)}%** |
| Pillar + GateType | Pillar + GateType | ${results.overall.pillarGateType.accuracy}% | ${(parseFloat(results.overall.pillarGateType.accuracy) - baselineAcc).toFixed(1)}% |
| Pillar + GateType + Line | All three | ${results.overall.pillarGateTypeLine.accuracy}% | ${(parseFloat(results.overall.pillarGateTypeLine.accuracy) - baselineAcc).toFixed(1)}% |
| Element + Line | Element + Line | ${results.overall.elementLine.accuracy}% | ${(parseFloat(results.overall.elementLine.accuracy) - baselineAcc).toFixed(1)}% |
| Pillar Only | Pillar | ${results.overall.pillarOnly.accuracy}% | ${(parseFloat(results.overall.pillarOnly.accuracy) - baselineAcc).toFixed(1)}% |
| Line Only | Line | ${results.overall.lineOnly.accuracy}% | ${(parseFloat(results.overall.lineOnly.accuracy) - baselineAcc).toFixed(1)}% |

---

## Stratified Analysis: Universal vs Discriminating Planets

Based on Phase 2 findings:
- **Universal planets** (same polarity in all pillars): Mars, Sun, Mercury
- **Discriminating planets** (pillar-specific polarity): Pluto, Venus, Saturn, Neptune, Uranus, Moon, Jupiter, Earth

### Universal Planets (N = ${results.universal.baseline.total})

| Model | Accuracy | vs Baseline |
|-------|----------|-------------|
| Baseline | ${results.universal.baseline.accuracy}% | - |
| **Pillar + Line** | **${results.universal.pillarLine.accuracy}%** | **${(parseFloat(results.universal.pillarLine.accuracy) - parseFloat(results.universal.baseline.accuracy)).toFixed(1)}%** |
| Pillar Only | ${results.universal.pillarOnly.accuracy}% | ${(parseFloat(results.universal.pillarOnly.accuracy) - parseFloat(results.universal.baseline.accuracy)).toFixed(1)}% |

### Discriminating Planets (N = ${results.discriminating.baseline.total})

| Model | Accuracy | vs Baseline |
|-------|----------|-------------|
| Baseline | ${results.discriminating.baseline.accuracy}% | - |
| **Pillar + Line** | **${results.discriminating.pillarLine.accuracy}%** | **${(parseFloat(results.discriminating.pillarLine.accuracy) - parseFloat(results.discriminating.baseline.accuracy)).toFixed(1)}%** |
| Pillar Only | ${results.discriminating.pillarOnly.accuracy}% | ${(parseFloat(results.discriminating.pillarOnly.accuracy) - parseFloat(results.discriminating.baseline.accuracy)).toFixed(1)}% |

---

## Per-Planet Breakdown

| Planet | Category | Baseline | Pillar+Line | Pillar Only | Change | N |
|--------|----------|----------|-------------|-------------|--------|---|
${Object.entries(perPlanetResults)
  .sort((a, b) => parseFloat(b[1].improvement) - parseFloat(a[1].improvement))
  .map(([planet, data]) =>
    `| ${planet} | ${data.category} | ${data.baseline}% | ${data.pillarLine}% | ${data.pillarOnly}% | ${parseFloat(data.improvement) >= 0 ? '+' : ''}${data.improvement}% | ${data.total} |`
  ).join('\n')}

---

## Statistical Significance

### Permutation Test (Pillar+Line vs Baseline)

- **Observed improvement**: ${observedImprovement.toFixed(2)}%
- **Permuted mean**: ${mean.toFixed(2)}%
- **Z-score**: ${zScore.toFixed(2)}
- **Significant (Z ≥ 2.0)**: ${Math.abs(zScore) >= 2.0 ? '**YES**' : 'no'}

---

## Interpretation

${improvement > 0 ? `
### Positive Finding

Pillar + Line model shows **${improvement.toFixed(1)}% improvement** over baseline (${baselineAcc.toFixed(1)}% → ${pillarLineAcc.toFixed(1)}%).

${Math.abs(zScore) >= 2.0 ? `This improvement is **statistically significant** (Z = ${zScore.toFixed(2)}).` : `This does not reach statistical significance (Z = ${zScore.toFixed(2)}), but shows a trend.`}
` : `
### Null Finding

Hierarchy features do not improve prediction accuracy.
`}

### Key Observations

1. **Universal Planets** (Mars, Sun, Mercury):
   - Baseline: ${results.universal.baseline.accuracy}%
   - Pillar+Line: ${results.universal.pillarLine.accuracy}%
   - Change: ${(parseFloat(results.universal.pillarLine.accuracy) - parseFloat(results.universal.baseline.accuracy)).toFixed(1)}%
   ${parseFloat(results.universal.pillarLine.accuracy) > parseFloat(results.universal.baseline.accuracy) ?
   '- **Unexpected**: Universal planets show pillar sensitivity (may indicate our "universal" classification needs refinement)' :
   '- As expected, pillar adds no value for planets with uniform polarity'}

2. **Discriminating Planets** (Pluto, Venus, etc.):
   - Baseline: ${results.discriminating.baseline.accuracy}%
   - Pillar+Line: ${results.discriminating.pillarLine.accuracy}%
   - Change: ${(parseFloat(results.discriminating.pillarLine.accuracy) - parseFloat(results.discriminating.baseline.accuracy)).toFixed(1)}%
   ${parseFloat(results.discriminating.pillarLine.accuracy) > parseFloat(results.discriminating.baseline.accuracy) ?
   '- **As expected**: Pillar information helps predict discriminating planets' :
   '- Pillar information does not improve prediction'}

---

## Decision Point

${Math.abs(zScore) >= 2.0 || improvement >= 5 ?
  '**→ Proceed to Phase 4** (Standing Wave Inheritance analysis)' :
  `${improvement > 0 ? '**→ Marginal signal detected** - consider Phase 4 for additional insight' : '**→ Consider concluding research** - hierarchy provides polarity signal (Phase 2) but limited predictive value'}`}

---

*Report generated by: nuclear-hierarchy-phase3-prediction.js*
`;

  return report;
}

const report = generateReport();
const outputPath = path.join(reportsDir, 'PHASE-3-PREDICTIVE-MODELLING.md');
fs.writeFileSync(outputPath, report);
console.log(`\nReport written to: ${outputPath}`);
