/**
 * Phase 4: Standing Wave Inheritance - Nuclear Hierarchy Research
 *
 * Tests whether cross-zero siblings inherit line-specific planet patterns
 * from their standing wave family member.
 *
 * Hypothesis: The 56% line accuracy for universal planets comes from
 * standing wave patterns propagating through nuclear families.
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

const PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];
const UNIVERSAL_PLANETS = ['Mars', 'Sun', 'Mercury'];
const DISCRIMINATING_PLANETS = ['Pluto', 'Venus', 'Saturn', 'Neptune', 'Uranus', 'Moon', 'Jupiter', 'Earth'];

// Families with standing waves and their CROSS-ZERO siblings only
const STANDING_WAVE_FAMILIES = [
  { mystery: 28, standingWave: 30, crossZeroSiblings: [55, 56], pillar: 1, element: 'Fire' },
  { mystery: 27, standingWave: 29, crossZeroSiblings: [59, 60], pillar: 2, element: 'Water' },
  { mystery: 40, standingWave: 52, crossZeroSiblings: [22, 36], pillar: 63, element: 'Truth' },
  { mystery: 54, standingWave: 57, crossZeroSiblings: [18, 26, 46], pillar: 63, element: 'Truth' },
  { mystery: 37, standingWave: 58, crossZeroSiblings: [6, 47], pillar: 64, element: 'Light' },
  { mystery: 39, standingWave: 51, crossZeroSiblings: [21, 35], pillar: 64, element: 'Light' }
];

console.log('Phase 4: Standing Wave Inheritance Analysis\n');
console.log(`Analyzing ${STANDING_WAVE_FAMILIES.length} families with standing waves\n`);

// === Inheritance Calculations ===

// Get planet profile for a gate
function getGateProfile(gate) {
  const data = planetary[gate];
  if (!data) return null;
  return data.lines.map(l => ({
    line: l.line,
    exalt: l.exaltPlanets,
    detri: l.detriPlanets
  }));
}

// Calculate line-by-line inheritance score
// For each line, count matches between standing wave and sibling
function calculateLineInheritance(swProfile, siblingProfile, planetFilter = null) {
  let matches = 0;
  let total = 0;

  for (let i = 0; i < 6; i++) {
    const swExalt = planetFilter
      ? swProfile[i].exalt.filter(p => planetFilter.includes(p))
      : swProfile[i].exalt;
    const sibExalt = planetFilter
      ? siblingProfile[i].exalt.filter(p => planetFilter.includes(p))
      : siblingProfile[i].exalt;

    // Count if any standing wave exalt planet appears in sibling exalt for same line
    swExalt.forEach(planet => {
      total++;
      if (sibExalt.includes(planet)) matches++;
    });
  }

  return { matches, total, rate: total > 0 ? matches / total : 0 };
}

// Calculate inheritance for a whole family
function calculateFamilyInheritance(family, planetFilter = null) {
  const swProfile = getGateProfile(family.standingWave);
  if (!swProfile) return null;

  let totalMatches = 0;
  let totalPossible = 0;
  const siblingResults = [];

  family.crossZeroSiblings.forEach(sibling => {
    const sibProfile = getGateProfile(sibling);
    if (!sibProfile) return;

    const result = calculateLineInheritance(swProfile, sibProfile, planetFilter);
    totalMatches += result.matches;
    totalPossible += result.total;
    siblingResults.push({
      sibling,
      ...result
    });
  });

  return {
    standingWave: family.standingWave,
    mystery: family.mystery,
    element: family.element,
    totalMatches,
    totalPossible,
    inheritanceRate: totalPossible > 0 ? totalMatches / totalPossible : 0,
    siblingResults
  };
}

// Calculate random baseline (unrelated gates)
function calculateRandomBaseline(planetFilter = null) {
  // Compare random pairs of gates
  const allGates = Object.keys(planetary).map(Number);
  let totalMatches = 0;
  let totalPossible = 0;

  for (let i = 0; i < 100; i++) {
    const gate1 = allGates[Math.floor(Math.random() * allGates.length)];
    const gate2 = allGates[Math.floor(Math.random() * allGates.length)];
    if (gate1 === gate2) continue;

    const profile1 = getGateProfile(gate1);
    const profile2 = getGateProfile(gate2);
    if (!profile1 || !profile2) continue;

    const result = calculateLineInheritance(profile1, profile2, planetFilter);
    totalMatches += result.matches;
    totalPossible += result.total;
  }

  return totalPossible > 0 ? totalMatches / totalPossible : 0;
}

// === Run Analysis ===

// Overall inheritance
console.log('=== Overall Inheritance (All Planets) ===\n');

const familyResults = STANDING_WAVE_FAMILIES.map(f => calculateFamilyInheritance(f));

let totalInheritanceMatches = 0;
let totalInheritancePossible = 0;

familyResults.forEach(r => {
  if (!r) return;
  console.log(`Mystery ${r.mystery} (${r.element}): Gate ${r.standingWave} → siblings`);
  r.siblingResults.forEach(s => {
    console.log(`  → Gate ${s.sibling}: ${s.matches}/${s.total} matches (${(s.rate * 100).toFixed(1)}%)`);
  });
  console.log(`  Family total: ${r.totalMatches}/${r.totalPossible} (${(r.inheritanceRate * 100).toFixed(1)}%)\n`);
  totalInheritanceMatches += r.totalMatches;
  totalInheritancePossible += r.totalPossible;
});

const overallInheritanceRate = totalInheritancePossible > 0
  ? totalInheritanceMatches / totalInheritancePossible
  : 0;

const randomBaseline = calculateRandomBaseline();

console.log(`Overall inheritance rate: ${(overallInheritanceRate * 100).toFixed(1)}%`);
console.log(`Random baseline: ${(randomBaseline * 100).toFixed(1)}%`);
console.log(`Lift: ${(overallInheritanceRate / randomBaseline).toFixed(2)}x\n`);

// Universal planets inheritance
console.log('=== Universal Planets Inheritance (Mars, Sun, Mercury) ===\n');

const universalResults = STANDING_WAVE_FAMILIES.map(f => calculateFamilyInheritance(f, UNIVERSAL_PLANETS));

let universalMatches = 0;
let universalPossible = 0;

universalResults.forEach(r => {
  if (!r) return;
  console.log(`Mystery ${r.mystery}: ${r.totalMatches}/${r.totalPossible} (${(r.inheritanceRate * 100).toFixed(1)}%)`);
  universalMatches += r.totalMatches;
  universalPossible += r.totalPossible;
});

const universalInheritanceRate = universalPossible > 0 ? universalMatches / universalPossible : 0;
const universalBaseline = calculateRandomBaseline(UNIVERSAL_PLANETS);

console.log(`\nUniversal planets inheritance: ${(universalInheritanceRate * 100).toFixed(1)}%`);
console.log(`Random baseline: ${(universalBaseline * 100).toFixed(1)}%`);
console.log(`Lift: ${universalBaseline > 0 ? (universalInheritanceRate / universalBaseline).toFixed(2) : 'N/A'}x\n`);

// Discriminating planets inheritance
console.log('=== Discriminating Planets Inheritance ===\n');

const discriminatingResults = STANDING_WAVE_FAMILIES.map(f => calculateFamilyInheritance(f, DISCRIMINATING_PLANETS));

let discriminatingMatches = 0;
let discriminatingPossible = 0;

discriminatingResults.forEach(r => {
  if (!r) return;
  console.log(`Mystery ${r.mystery}: ${r.totalMatches}/${r.totalPossible} (${(r.inheritanceRate * 100).toFixed(1)}%)`);
  discriminatingMatches += r.totalMatches;
  discriminatingPossible += r.totalPossible;
});

const discriminatingInheritanceRate = discriminatingPossible > 0 ? discriminatingMatches / discriminatingPossible : 0;
const discriminatingBaseline = calculateRandomBaseline(DISCRIMINATING_PLANETS);

console.log(`\nDiscriminating planets inheritance: ${(discriminatingInheritanceRate * 100).toFixed(1)}%`);
console.log(`Random baseline: ${(discriminatingBaseline * 100).toFixed(1)}%`);
console.log(`Lift: ${discriminatingBaseline > 0 ? (discriminatingInheritanceRate / discriminatingBaseline).toFixed(2) : 'N/A'}x\n`);

// === Permutation Test ===
console.log('=== Permutation Test ===\n');

const NUM_PERMUTATIONS = 1000;

function calculateTotalInheritance(families, planetFilter = null) {
  let matches = 0;
  let possible = 0;
  families.forEach(f => {
    const result = calculateFamilyInheritance(f, planetFilter);
    if (result) {
      matches += result.totalMatches;
      possible += result.totalPossible;
    }
  });
  return possible > 0 ? matches / possible : 0;
}

// Observed
const observedInheritance = calculateTotalInheritance(STANDING_WAVE_FAMILIES);

// Permuted: shuffle which gates are "siblings" of each standing wave
const permutedInheritances = [];
const allCrossZeroGates = [];
hierarchy.gateMappings.forEach(g => {
  if (g.gateType === 'cross-zero-manifesting' || g.gateType === 'cross-zero-dematerialising') {
    allCrossZeroGates.push(g.gate);
  }
});

for (let i = 0; i < NUM_PERMUTATIONS; i++) {
  // Create random "families" with shuffled siblings
  const shuffledFamilies = STANDING_WAVE_FAMILIES.map(f => ({
    ...f,
    crossZeroSiblings: [
      allCrossZeroGates[Math.floor(Math.random() * allCrossZeroGates.length)],
      allCrossZeroGates[Math.floor(Math.random() * allCrossZeroGates.length)]
    ]
  }));
  permutedInheritances.push(calculateTotalInheritance(shuffledFamilies));
}

const permMean = permutedInheritances.reduce((a, b) => a + b, 0) / permutedInheritances.length;
const permVariance = permutedInheritances.reduce((sum, v) => sum + Math.pow(v - permMean, 2), 0) / permutedInheritances.length;
const permStd = Math.sqrt(permVariance);
const zScore = permStd > 0 ? (observedInheritance - permMean) / permStd : 0;

console.log(`Observed inheritance: ${(observedInheritance * 100).toFixed(1)}%`);
console.log(`Permuted mean: ${(permMean * 100).toFixed(1)}%`);
console.log(`Z-score: ${zScore.toFixed(2)}`);
console.log(`Significant (Z ≥ 2.0): ${Math.abs(zScore) >= 2.0 ? 'YES' : 'NO'}\n`);

// === Line-by-Line Analysis ===
console.log('=== Line-by-Line Inheritance Patterns ===\n');

const lineInheritance = [0, 0, 0, 0, 0, 0];
const linePossible = [0, 0, 0, 0, 0, 0];

STANDING_WAVE_FAMILIES.forEach(family => {
  const swProfile = getGateProfile(family.standingWave);
  if (!swProfile) return;

  family.crossZeroSiblings.forEach(sibling => {
    const sibProfile = getGateProfile(sibling);
    if (!sibProfile) return;

    for (let i = 0; i < 6; i++) {
      swProfile[i].exalt.forEach(planet => {
        linePossible[i]++;
        if (sibProfile[i].exalt.includes(planet)) {
          lineInheritance[i]++;
        }
      });
    }
  });
});

console.log('Line | Matches | Possible | Rate');
console.log('-----|---------|----------|-----');
for (let i = 0; i < 6; i++) {
  const rate = linePossible[i] > 0 ? (lineInheritance[i] / linePossible[i] * 100).toFixed(1) : 'N/A';
  console.log(`  ${i + 1}  |   ${lineInheritance[i].toString().padStart(2)}    |    ${linePossible[i].toString().padStart(2)}    | ${rate}%`);
}

// === Generate Report ===
function generateReport() {
  const significant = Math.abs(zScore) >= 2.0;
  const lift = randomBaseline > 0 ? overallInheritanceRate / randomBaseline : 0;

  let report = `# Phase 4: Standing Wave Inheritance - Nuclear Hierarchy Research

**Generated**: ${new Date().toISOString().split('T')[0]}

## Overview

This report tests whether cross-zero siblings inherit line-specific planet patterns from their standing wave family member.

**Hypothesis**: The 56% line accuracy for universal planets (from Phase 3) comes from standing wave patterns propagating through nuclear families.

**Families Analyzed**: ${STANDING_WAVE_FAMILIES.length} Mystery families containing both a standing wave and cross-zero gates

---

## Families with Standing Waves

| Mystery | Element | Standing Wave | Cross-Zero Siblings |
|---------|---------|---------------|---------------------|
${STANDING_WAVE_FAMILIES.map(f =>
  `| ${f.mystery} | ${f.element} | Gate ${f.standingWave} | Gates ${f.crossZeroSiblings.join(', ')} |`
).join('\n')}

---

## Overall Inheritance Results

### All Planets

| Metric | Value |
|--------|-------|
| Observed inheritance rate | **${(overallInheritanceRate * 100).toFixed(1)}%** |
| Random baseline | ${(randomBaseline * 100).toFixed(1)}% |
| Lift (observed / random) | **${lift.toFixed(2)}x** |

### By Family

| Mystery | Element | Standing Wave | Matches | Rate |
|---------|---------|---------------|---------|------|
${familyResults.filter(r => r).map(r =>
  `| ${r.mystery} | ${r.element} | Gate ${r.standingWave} | ${r.totalMatches}/${r.totalPossible} | ${(r.inheritanceRate * 100).toFixed(1)}% |`
).join('\n')}

---

## Stratified by Planet Type

### Universal Planets (Mars, Sun, Mercury)

| Metric | Value |
|--------|-------|
| Inheritance rate | **${(universalInheritanceRate * 100).toFixed(1)}%** |
| Random baseline | ${(universalBaseline * 100).toFixed(1)}% |
| Lift | ${universalBaseline > 0 ? (universalInheritanceRate / universalBaseline).toFixed(2) : 'N/A'}x |

### Discriminating Planets (Pluto, Venus, etc.)

| Metric | Value |
|--------|-------|
| Inheritance rate | **${(discriminatingInheritanceRate * 100).toFixed(1)}%** |
| Random baseline | ${(discriminatingBaseline * 100).toFixed(1)}% |
| Lift | ${discriminatingBaseline > 0 ? (discriminatingInheritanceRate / discriminatingBaseline).toFixed(2) : 'N/A'}x |

---

## Statistical Significance

### Permutation Test (${NUM_PERMUTATIONS} permutations)

| Metric | Value |
|--------|-------|
| Observed inheritance | ${(observedInheritance * 100).toFixed(1)}% |
| Permuted mean | ${(permMean * 100).toFixed(1)}% |
| **Z-score** | **${zScore.toFixed(2)}** |
| Significant (Z ≥ 2.0) | ${significant ? '**YES**' : 'no'} |

---

## Line-by-Line Inheritance Patterns

| Line | Matches | Possible | Inheritance Rate |
|------|---------|----------|------------------|
${[1, 2, 3, 4, 5, 6].map(i =>
  `| ${i} | ${lineInheritance[i-1]} | ${linePossible[i-1]} | ${linePossible[i-1] > 0 ? (lineInheritance[i-1] / linePossible[i-1] * 100).toFixed(1) : 'N/A'}% |`
).join('\n')}

---

## Interpretation

${significant ? `
### Significant Inheritance Found

Cross-zero siblings show **${zScore.toFixed(2)} standard deviations** above random baseline for line-specific planet inheritance from their standing wave family member.

This confirms the hypothesis: **standing wave patterns propagate through nuclear families**.

The 56% line accuracy for universal planets (Phase 3) can be explained by inheritance from standing waves, which are 100% derivable from electromagnetic position.
` : `
### Inheritance Not Statistically Significant

While the observed inheritance rate (${(overallInheritanceRate * 100).toFixed(1)}%) exceeds random baseline (${(randomBaseline * 100).toFixed(1)}%), this does not reach statistical significance (Z = ${zScore.toFixed(2)}).

${lift > 1.0 ? `
The ${lift.toFixed(2)}x lift suggests a trend toward inheritance, but the sample size (${STANDING_WAVE_FAMILIES.length} families) may be insufficient to detect it reliably.
` : ''}
`}

### Key Observations

1. **Overall lift**: ${lift.toFixed(2)}x above random baseline
2. **Universal planets**: ${universalBaseline > 0 ? (universalInheritanceRate / universalBaseline).toFixed(2) : 'N/A'}x lift
3. **Discriminating planets**: ${discriminatingBaseline > 0 ? (discriminatingInheritanceRate / discriminatingBaseline).toFixed(2) : 'N/A'}x lift

---

## Connection to Phase 3 Finding

Phase 3 found 56% accuracy predicting universal planets from line position alone.

${significant ?
  'This Phase 4 result **confirms** that line patterns originate in standing waves and propagate to cross-zero siblings through nuclear family relationships.' :
  'This Phase 4 result suggests the 56% line accuracy may come from broader line patterns across the I Ching, not specifically from nuclear family inheritance.'}

---

## Decision Point

${significant ?
  '**→ Proceed to Phase 5** - synthesize all findings into a coherent model' :
  '**→ Proceed to Phase 5** - document partial findings and conclusions'}

---

*Report generated by: nuclear-hierarchy-phase4-inheritance.js*
`;

  return report;
}

const report = generateReport();
const outputPath = path.join(reportsDir, 'PHASE-4-STANDING-WAVE-INHERITANCE.md');
fs.writeFileSync(outputPath, report);
console.log(`Report written to: ${outputPath}`);
