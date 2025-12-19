/**
 * Phase 2: Hypothesis Testing - Nuclear Hierarchy Research
 *
 * Tests:
 * 2.1 Family Coherence - Do gates in same Mystery share planets?
 * 2.2 Elemental Correspondence - Do predicted planets cluster in predicted pillars?
 * 2.3 Hierarchy Depth Effect - Does planetary diversity increase with depth?
 * 2.4 Inverse Patterns - Do exaltation/detriment show complementary distributions?
 *
 * All tests use 1000 permutations with Z ≥ 2.0 threshold.
 */

const fs = require('fs');
const path = require('path');

// === Data Loading (same as Phase 1) ===
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
      exaltPlanets: lineData.exaltPlanets || [],
      detriPlanets: lineData.detriPlanets || []
    });
  });
}

const PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];
const PILLAR_NAMES = { 1: 'Fire', 2: 'Water', 63: 'Truth', 64: 'Light' };
const PILLARS = [1, 2, 63, 64];
const NUM_PERMUTATIONS = 1000;

console.log(`Loaded ${combinedData.length} line records`);
console.log(`Running ${NUM_PERMUTATIONS} permutations per test...\n`);

// === Utility Functions ===
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function calculateZScore(observed, permutedValues) {
  const mean = permutedValues.reduce((a, b) => a + b, 0) / permutedValues.length;
  const variance = permutedValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / permutedValues.length;
  const std = Math.sqrt(variance);
  if (std === 0) return 0;
  return (observed - mean) / std;
}

function entropy(counts) {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  return -counts.filter(c => c > 0).reduce((sum, c) => {
    const p = c / total;
    return sum + p * Math.log2(p);
  }, 0);
}

// === Test 2.1: Family Coherence ===
function testFamilyCoherence() {
  console.log('Running Test 2.1: Family Coherence...');

  // Get all mysteries and their letter gates
  const mysteries = hierarchy.hierarchy.mysteries;

  // Calculate coherence score: for each mystery, what fraction of planet types appear ≥3 times?
  function calculateCoherenceScore(data, mysteryAssignments) {
    let totalScore = 0;
    mysteries.forEach(m => {
      const letterGates = mysteryAssignments[m.gate] || m.letters;
      const planetCounts = {};
      PLANETS.forEach(p => planetCounts[p] = 0);

      // Count planets across all lines of all letter gates in this mystery
      data.forEach(d => {
        if (letterGates.includes(d.gate)) {
          d.exaltPlanets.forEach(p => { if (planetCounts[p] !== undefined) planetCounts[p]++; });
        }
      });

      // Coherence = planets appearing ≥3 times / planets appearing ≥1 time
      const appearing = Object.values(planetCounts).filter(c => c >= 1).length;
      const frequent = Object.values(planetCounts).filter(c => c >= 3).length;
      if (appearing > 0) {
        totalScore += frequent / appearing;
      }
    });
    return totalScore / mysteries.length;
  }

  // Observed coherence
  const observedCoherence = calculateCoherenceScore(combinedData, {});

  // Permutation test: shuffle gate-to-mystery assignments
  const allLetterGates = [];
  mysteries.forEach(m => allLetterGates.push(...m.letters));

  const permutedScores = [];
  for (let i = 0; i < NUM_PERMUTATIONS; i++) {
    // Create random mystery assignments
    const shuffledGates = shuffle(allLetterGates);
    const randomAssignments = {};
    let idx = 0;
    mysteries.forEach(m => {
      randomAssignments[m.gate] = shuffledGates.slice(idx, idx + 4);
      idx += 4;
    });
    permutedScores.push(calculateCoherenceScore(combinedData, randomAssignments));
  }

  const zScore = calculateZScore(observedCoherence, permutedScores);
  const mean = permutedScores.reduce((a, b) => a + b, 0) / permutedScores.length;
  const significant = Math.abs(zScore) >= 2.0;

  return {
    test: '2.1 Family Coherence',
    hypothesis: 'Gates in same Mystery share planets more than random',
    observed: observedCoherence.toFixed(4),
    permutedMean: mean.toFixed(4),
    zScore: zScore.toFixed(2),
    significant,
    interpretation: significant
      ? 'SIGNIFICANT: Mystery families show planetary coherence beyond chance'
      : 'NOT SIGNIFICANT: Mystery families do not show unusual planetary coherence'
  };
}

// === Test 2.2: Elemental Correspondence ===
function testElementalCorrespondence() {
  console.log('Running Test 2.2: Elemental Correspondence...');

  const elementalPlanets = {
    1: ['Sun', 'Mars'],       // Fire
    2: ['Moon', 'Venus'],     // Water
    63: ['Saturn', 'Pluto'],  // Truth
    64: ['Uranus', 'Mercury', 'Jupiter']  // Light
  };

  // Calculate ratio of predicted planets in each pillar
  function calculateRatios(data) {
    const ratios = {};
    PILLARS.forEach(p => {
      const pillarData = data.filter(d => d.pillar === p);
      const predicted = elementalPlanets[p];
      let predictedCount = 0;
      let totalCount = 0;

      pillarData.forEach(d => {
        d.exaltPlanets.forEach(pl => {
          totalCount++;
          if (predicted.includes(pl)) predictedCount++;
        });
      });

      // Expected proportion if uniform
      const expectedProportion = predicted.length / PLANETS.length;
      const actualProportion = totalCount > 0 ? predictedCount / totalCount : 0;
      ratios[p] = actualProportion / expectedProportion;
    });
    return ratios;
  }

  // Combined score: product of ratios (geometric mean proxy)
  function calculateCombinedScore(data) {
    const ratios = calculateRatios(data);
    return Object.values(ratios).reduce((prod, r) => prod * r, 1);
  }

  const observedRatios = calculateRatios(combinedData);
  const observedScore = calculateCombinedScore(combinedData);

  // Permutation test: shuffle pillar assignments
  const permutedScores = [];
  for (let i = 0; i < NUM_PERMUTATIONS; i++) {
    // Create shuffled data with randomized pillar assignments
    const pillarAssignments = shuffle(PILLARS);
    const pillarMap = {};
    PILLARS.forEach((p, idx) => pillarMap[p] = pillarAssignments[idx]);

    const shuffledData = combinedData.map(d => ({
      ...d,
      pillar: pillarMap[d.pillar]
    }));
    permutedScores.push(calculateCombinedScore(shuffledData));
  }

  const zScore = calculateZScore(observedScore, permutedScores);
  const mean = permutedScores.reduce((a, b) => a + b, 0) / permutedScores.length;
  const significant = zScore >= 2.0;

  return {
    test: '2.2 Elemental Correspondence',
    hypothesis: 'Predicted planets cluster in their elemental Pillars',
    pillarRatios: observedRatios,
    observedScore: observedScore.toFixed(4),
    permutedMean: mean.toFixed(4),
    zScore: zScore.toFixed(2),
    significant,
    interpretation: significant
      ? 'SIGNIFICANT: Elemental planet predictions hold across Pillars'
      : 'NOT SIGNIFICANT: Elemental correspondences are not stronger than chance'
  };
}

// === Test 2.3: Hierarchy Depth Effect ===
function testHierarchyDepthEffect() {
  console.log('Running Test 2.3: Hierarchy Depth Effect...');

  // Calculate entropy at each level
  function calculateLevelEntropies(data) {
    const levels = ['pillar', 'mystery', 'letter'];
    const entropies = {};

    levels.forEach(level => {
      const planetCounts = {};
      PLANETS.forEach(p => planetCounts[p] = 0);

      data.filter(d => d.level === level).forEach(d => {
        d.exaltPlanets.forEach(p => {
          if (planetCounts[p] !== undefined) planetCounts[p]++;
        });
      });

      entropies[level] = entropy(Object.values(planetCounts));
    });

    return entropies;
  }

  // Score: is entropy monotonically increasing? (pillar < mystery < letter)
  function calculateMonotonicScore(data) {
    const e = calculateLevelEntropies(data);
    let score = 0;
    if (e.mystery > e.pillar) score++;
    if (e.letter > e.mystery) score++;
    // Add magnitude bonus
    score += (e.letter - e.pillar) / 4; // normalized bonus
    return score;
  }

  const observedEntropies = calculateLevelEntropies(combinedData);
  const observedScore = calculateMonotonicScore(combinedData);

  // Permutation test: shuffle level assignments
  const permutedScores = [];
  for (let i = 0; i < NUM_PERMUTATIONS; i++) {
    const shuffledData = combinedData.map(d => ({
      ...d,
      level: ['pillar', 'mystery', 'letter'][Math.floor(Math.random() * 3)]
    }));
    permutedScores.push(calculateMonotonicScore(shuffledData));
  }

  const zScore = calculateZScore(observedScore, permutedScores);
  const mean = permutedScores.reduce((a, b) => a + b, 0) / permutedScores.length;
  const significant = zScore >= 2.0;

  return {
    test: '2.3 Hierarchy Depth Effect',
    hypothesis: 'Planetary diversity increases with hierarchy depth',
    observedEntropies,
    observedScore: observedScore.toFixed(4),
    permutedMean: mean.toFixed(4),
    zScore: zScore.toFixed(2),
    significant,
    interpretation: significant
      ? 'SIGNIFICANT: Entropy increases with depth (Pillars most constrained)'
      : 'NOT SIGNIFICANT: No evidence of depth-related diversity pattern'
  };
}

// === Test 2.4: Inverse Patterns (Exaltation/Detriment Complementarity) ===
function testInversePatterns() {
  console.log('Running Test 2.4: Inverse Patterns (Exalt/Detri Complementarity)...');

  // For each planet, calculate correlation between exalt and detri across pillars
  // Negative correlation = inverse pattern (high exalt → low detri)
  function calculateInverseScore(data) {
    let totalInverseScore = 0;
    let validPlanets = 0;

    PLANETS.forEach(planet => {
      const exaltByPillar = {};
      const detriByPillar = {};
      PILLARS.forEach(p => {
        exaltByPillar[p] = 0;
        detriByPillar[p] = 0;
      });

      data.forEach(d => {
        if (d.exaltPlanets.includes(planet)) exaltByPillar[d.pillar]++;
        if (d.detriPlanets.includes(planet)) detriByPillar[d.pillar]++;
      });

      // Calculate Spearman-like rank correlation
      const exaltRanks = PILLARS.map(p => exaltByPillar[p]);
      const detriRanks = PILLARS.map(p => detriByPillar[p]);

      const exaltTotal = exaltRanks.reduce((a, b) => a + b, 0);
      const detriTotal = detriRanks.reduce((a, b) => a + b, 0);

      if (exaltTotal >= 4 && detriTotal >= 4) {
        // Calculate negative correlation score
        let correlation = 0;
        for (let i = 0; i < PILLARS.length; i++) {
          // High exalt + low detri = positive contribution to inverse score
          const exaltNorm = exaltRanks[i] / exaltTotal;
          const detriNorm = detriRanks[i] / detriTotal;
          correlation += (exaltNorm - 0.25) * (detriNorm - 0.25);
        }
        totalInverseScore -= correlation; // Negative correlation = positive inverse score
        validPlanets++;
      }
    });

    return validPlanets > 0 ? totalInverseScore / validPlanets : 0;
  }

  const observedScore = calculateInverseScore(combinedData);

  // Permutation test: shuffle exalt/detri labels
  const permutedScores = [];
  for (let i = 0; i < NUM_PERMUTATIONS; i++) {
    const shuffledData = combinedData.map(d => {
      if (Math.random() < 0.5) {
        return { ...d, exaltPlanets: d.detriPlanets, detriPlanets: d.exaltPlanets };
      }
      return d;
    });
    permutedScores.push(calculateInverseScore(shuffledData));
  }

  const zScore = calculateZScore(observedScore, permutedScores);
  const mean = permutedScores.reduce((a, b) => a + b, 0) / permutedScores.length;
  const significant = zScore >= 2.0;

  // Calculate specific planet inverse scores for reporting
  const planetInverseDetails = {};
  PLANETS.forEach(planet => {
    const exaltByPillar = {};
    const detriByPillar = {};
    PILLARS.forEach(p => {
      exaltByPillar[p] = 0;
      detriByPillar[p] = 0;
    });
    combinedData.forEach(d => {
      if (d.exaltPlanets.includes(planet)) exaltByPillar[d.pillar]++;
      if (d.detriPlanets.includes(planet)) detriByPillar[d.pillar]++;
    });

    const exaltTotal = Object.values(exaltByPillar).reduce((a, b) => a + b, 0);
    const detriTotal = Object.values(detriByPillar).reduce((a, b) => a + b, 0);

    if (exaltTotal >= 4 && detriTotal >= 4) {
      // Find pillar with max exalt and check if it has min detri (or close)
      const maxExaltPillar = PILLARS.reduce((max, p) => exaltByPillar[p] > exaltByPillar[max] ? p : max, 1);
      const minDetriPillar = PILLARS.reduce((min, p) => detriByPillar[p] < detriByPillar[min] ? p : min, 1);
      planetInverseDetails[planet] = {
        exalt: exaltByPillar,
        detri: detriByPillar,
        maxExaltPillar: PILLAR_NAMES[maxExaltPillar],
        minDetriPillar: PILLAR_NAMES[minDetriPillar],
        inverseMatch: maxExaltPillar === minDetriPillar
      };
    }
  });

  return {
    test: '2.4 Inverse Patterns',
    hypothesis: 'Exaltation and detriment show complementary pillar distributions',
    observedScore: observedScore.toFixed(4),
    permutedMean: mean.toFixed(4),
    zScore: zScore.toFixed(2),
    significant,
    planetDetails: planetInverseDetails,
    interpretation: significant
      ? 'SIGNIFICANT: Exalt/detri show inverse patterns (planets "belong" in some pillars)'
      : 'NOT SIGNIFICANT: No systematic inverse relationship between exalt and detri'
  };
}

// === Test 2.5: Polarity Score (Exalt - Detri per Pillar) ===
function testPolarityScore() {
  console.log('Running Test 2.5: Polarity Score (Exalt - Detri per Pillar)...');

  // For each planet, calculate polarity = (exalt - detri) per pillar
  // Then measure "polarity strength" = sum of absolute polarity values
  // High polarity strength = planet concentrates +/- in specific pillars
  function calculatePolarityData(data) {
    const polarityByPlanet = {};

    PLANETS.forEach(planet => {
      const exaltByPillar = {};
      const detriByPillar = {};
      PILLARS.forEach(p => {
        exaltByPillar[p] = 0;
        detriByPillar[p] = 0;
      });

      data.forEach(d => {
        if (d.exaltPlanets.includes(planet)) exaltByPillar[d.pillar]++;
        if (d.detriPlanets.includes(planet)) detriByPillar[d.pillar]++;
      });

      const polarity = {};
      let polarityStrength = 0;
      PILLARS.forEach(p => {
        polarity[p] = exaltByPillar[p] - detriByPillar[p];
        polarityStrength += Math.abs(polarity[p]);
      });

      polarityByPlanet[planet] = {
        polarity,
        strength: polarityStrength,
        exalt: exaltByPillar,
        detri: detriByPillar
      };
    });

    return polarityByPlanet;
  }

  // Total polarity strength across all planets (measure of systematic patterning)
  function calculateTotalPolarityStrength(data) {
    const polarityData = calculatePolarityData(data);
    return Object.values(polarityData).reduce((sum, p) => sum + p.strength, 0);
  }

  const observedPolarity = calculatePolarityData(combinedData);
  const observedStrength = calculateTotalPolarityStrength(combinedData);

  // Permutation test: shuffle exalt/detri labels randomly
  const permutedStrengths = [];
  for (let i = 0; i < NUM_PERMUTATIONS; i++) {
    // Randomly swap exalt/detri for each line
    const shuffledData = combinedData.map(d => {
      if (Math.random() < 0.5) {
        return { ...d, exaltPlanets: d.detriPlanets, detriPlanets: d.exaltPlanets };
      }
      return d;
    });
    permutedStrengths.push(calculateTotalPolarityStrength(shuffledData));
  }

  const zScore = calculateZScore(observedStrength, permutedStrengths);
  const mean = permutedStrengths.reduce((a, b) => a + b, 0) / permutedStrengths.length;
  const significant = zScore >= 2.0;

  // Find planets with highest polarity strength
  const rankedPlanets = Object.entries(observedPolarity)
    .sort((a, b) => b[1].strength - a[1].strength)
    .slice(0, 5);

  return {
    test: '2.5 Polarity Score',
    hypothesis: 'Planets show systematic exalt/detri polarity across Pillars',
    observedStrength: observedStrength.toFixed(1),
    permutedMean: mean.toFixed(1),
    zScore: zScore.toFixed(2),
    significant,
    topPolarizedPlanets: rankedPlanets.map(([planet, data]) => ({
      planet,
      strength: data.strength,
      polarity: data.polarity
    })),
    fullPolarityData: observedPolarity,
    interpretation: significant
      ? 'SIGNIFICANT: Planets show systematic affinity/aversion to specific Pillars'
      : 'NOT SIGNIFICANT: Polarity patterns do not exceed random expectation'
  };
}

// === Run All Tests ===
const results = {
  test21: testFamilyCoherence(),
  test22: testElementalCorrespondence(),
  test23: testHierarchyDepthEffect(),
  test24: testInversePatterns(),
  test25: testPolarityScore()
};

// === Generate Report ===
function generateReport() {
  const anySignificant = Object.values(results).some(r => r.significant);

  let report = `# Phase 2: Hypothesis Testing - Nuclear Hierarchy Research

**Generated**: ${new Date().toISOString().split('T')[0]}

## Overview

This report tests four hypotheses using permutation testing (${NUM_PERMUTATIONS} permutations each).

**Significance threshold**: Z ≥ 2.0 (p < 0.05)
**Bonferroni-corrected threshold**: Z ≥ 2.64 (for 12 Mystery families at α = 0.05)

---

## Test Results Summary

| Test | Hypothesis | Z-Score | Significant? |
|------|------------|---------|--------------|
| 2.1 | Family Coherence | ${results.test21.zScore} | ${results.test21.significant ? '**YES**' : 'no'} |
| 2.2 | Elemental Correspondence | ${results.test22.zScore} | ${results.test22.significant ? '**YES**' : 'no'} |
| 2.3 | Hierarchy Depth Effect | ${results.test23.zScore} | ${results.test23.significant ? '**YES**' : 'no'} |
| 2.4 | Inverse Patterns | ${results.test24.zScore} | ${results.test24.significant ? '**YES**' : 'no'} |
| 2.5 | Polarity Score | ${results.test25.zScore} | ${results.test25.significant ? '**YES**' : 'no'} |

---

## Test 2.1: Family Coherence

**Hypothesis**: Gates in the same Mystery family share exaltation planets more than random expectation.

**Method**:
- For each Mystery, count how many planet types appear ≥3 times across its 4 Letter gates (24 lines)
- Calculate coherence score = (planets appearing ≥3 times) / (planets appearing ≥1 time)
- Compare to 1000 permutations where gate-to-Mystery assignments are randomized

**Results**:
- Observed coherence: ${results.test21.observed}
- Permuted mean: ${results.test21.permutedMean}
- **Z-score: ${results.test21.zScore}**

**Interpretation**: ${results.test21.interpretation}

---

## Test 2.2: Elemental Correspondence

**Hypothesis**: Predicted elemental planets cluster in their assigned Pillars.

**Predictions**:
| Pillar | Element | Predicted Planets |
|--------|---------|-------------------|
| 1 | Fire | Sun, Mars |
| 2 | Water | Moon, Venus |
| 63 | Truth | Saturn, Pluto |
| 64 | Light | Uranus, Mercury, Jupiter |

**Method**:
- Calculate ratio of (actual predicted planet proportion) / (expected if uniform)
- Ratio >1.0 means predicted planets appear more than chance
- Combined score = product of all four ratios
- Compare to 1000 permutations where Pillar labels are shuffled

**Results**:

| Pillar | Ratio | Interpretation |
|--------|-------|----------------|
| Fire (1) | ${results.test22.pillarRatios[1].toFixed(2)}x | ${results.test22.pillarRatios[1] > 1.2 ? '**Above chance**' : results.test22.pillarRatios[1] > 0.8 ? 'Near chance' : 'Below chance'} |
| Water (2) | ${results.test22.pillarRatios[2].toFixed(2)}x | ${results.test22.pillarRatios[2] > 1.2 ? '**Above chance**' : results.test22.pillarRatios[2] > 0.8 ? 'Near chance' : 'Below chance'} |
| Truth (63) | ${results.test22.pillarRatios[63].toFixed(2)}x | ${results.test22.pillarRatios[63] > 1.2 ? '**Above chance**' : results.test22.pillarRatios[63] > 0.8 ? 'Near chance' : 'Below chance'} |
| Light (64) | ${results.test22.pillarRatios[64].toFixed(2)}x | ${results.test22.pillarRatios[64] > 1.2 ? '**Above chance**' : results.test22.pillarRatios[64] > 0.8 ? 'Near chance' : 'Below chance'} |

- Combined score: ${results.test22.observedScore}
- Permuted mean: ${results.test22.permutedMean}
- **Z-score: ${results.test22.zScore}**

**Interpretation**: ${results.test22.interpretation}

---

## Test 2.3: Hierarchy Depth Effect

**Hypothesis**: Planetary diversity (entropy) increases with hierarchy depth.

**Expected pattern**: Pillars (most constrained) < Mysteries < Letters (most diverse)

**Method**:
- Calculate Shannon entropy of planet distribution at each level
- Score based on monotonic increase + magnitude of difference
- Compare to 1000 permutations where level labels are randomized

**Results**:
- Pillar entropy: ${results.test23.observedEntropies.pillar.toFixed(3)}
- Mystery entropy: ${results.test23.observedEntropies.mystery.toFixed(3)}
- Letter entropy: ${results.test23.observedEntropies.letter.toFixed(3)}
- Monotonic? ${results.test23.observedEntropies.pillar < results.test23.observedEntropies.mystery && results.test23.observedEntropies.mystery < results.test23.observedEntropies.letter ? '**YES**' : 'no'}
- **Z-score: ${results.test23.zScore}**

**Interpretation**: ${results.test23.interpretation}

---

## Test 2.4: Inverse Patterns (Exaltation/Detriment Complementarity)

**Hypothesis**: Exaltation and detriment distributions show inverse patterns—planets that exalt strongly in a Pillar show fewer detriments there.

**Method**:
- For each planet, correlate exaltation counts with detriment counts across Pillars
- Negative correlation = inverse pattern (planet "belongs" in high-exalt Pillars)
- Compare to 1000 permutations where exalt/detri labels are randomly swapped

**Results**:
- Observed inverse score: ${results.test24.observedScore}
- Permuted mean: ${results.test24.permutedMean}
- **Z-score: ${results.test24.zScore}**

**Planet-by-Planet Analysis** (planets with ≥4 exaltations and ≥4 detriments):

| Planet | Max Exalt Pillar | Min Detri Pillar | Inverse Match? |
|--------|------------------|------------------|----------------|
${Object.entries(results.test24.planetDetails).map(([planet, data]) =>
  `| ${planet} | ${data.maxExaltPillar} | ${data.minDetriPillar} | ${data.inverseMatch ? '**YES**' : 'no'} |`
).join('\n')}

**Interpretation**: ${results.test24.interpretation}

---

## Test 2.5: Polarity Score (Exalt - Detri per Pillar)

**Hypothesis**: Planets show systematic affinity (high exalt, low detri) or aversion (low exalt, high detri) to specific Pillars.

**Method**:
- For each planet, calculate polarity = (exaltation count - detriment count) per Pillar
- Polarity strength = sum of |polarity| across all 4 Pillars
- High polarity strength = planet concentrates +/- in specific Pillars
- Compare total polarity strength to 1000 permutations where exalt/detri labels are randomly swapped

**Results**:
- Total observed polarity strength: ${results.test25.observedStrength}
- Permuted mean: ${results.test25.permutedMean}
- **Z-score: ${results.test25.zScore}**

**Top 5 Most Polarized Planets**:

| Planet | Strength | Fire (1) | Water (2) | Truth (63) | Light (64) |
|--------|----------|----------|-----------|------------|------------|
${results.test25.topPolarizedPlanets.map(p =>
  `| ${p.planet} | ${p.strength} | ${p.polarity[1] >= 0 ? '+' : ''}${p.polarity[1]} | ${p.polarity[2] >= 0 ? '+' : ''}${p.polarity[2]} | ${p.polarity[63] >= 0 ? '+' : ''}${p.polarity[63]} | ${p.polarity[64] >= 0 ? '+' : ''}${p.polarity[64]} |`
).join('\n')}

**Complete Polarity Table**:

| Planet | Fire | Water | Truth | Light | Strength |
|--------|------|-------|-------|-------|----------|
${Object.entries(results.test25.fullPolarityData)
  .sort((a, b) => b[1].strength - a[1].strength)
  .map(([planet, data]) =>
    `| ${planet} | ${data.polarity[1] >= 0 ? '+' : ''}${data.polarity[1]} | ${data.polarity[2] >= 0 ? '+' : ''}${data.polarity[2]} | ${data.polarity[63] >= 0 ? '+' : ''}${data.polarity[63]} | ${data.polarity[64] >= 0 ? '+' : ''}${data.polarity[64]} | ${data.strength} |`
  ).join('\n')}

**Interpretation**: ${results.test25.interpretation}

---

## Overall Assessment

${anySignificant ? `
### Signal Detected

At least one test shows significant results (Z ≥ 2.0). This suggests the nuclear hierarchy may encode information relevant to planetary assignments.

**Recommendation**: Proceed to Phase 3 (Predictive Modelling) to determine if hierarchy features improve prediction accuracy.
` : `
### No Signal Detected

None of the tests reached significance (Z ≥ 2.0). The patterns observed in Phase 1 do not survive permutation testing.

**Recommendation**: Consider documenting null result or exploring alternative hypotheses.
`}

### Decision Point

- Tests with Z ≥ 2.0: ${Object.values(results).filter(r => r.significant).length}/5
- Tests with Z ≥ 1.5 (trend): ${Object.values(results).filter(r => parseFloat(r.zScore) >= 1.5).length}/5

${Object.values(results).filter(r => r.significant).length > 0 ? '**→ Proceed to Phase 3**' : '**→ Review findings before proceeding**'}

---

*Report generated by: nuclear-hierarchy-phase2-hypothesis.js*
`;

  return report;
}

const report = generateReport();
const outputPath = path.join(reportsDir, 'PHASE-2-HYPOTHESIS-TESTING.md');
fs.writeFileSync(outputPath, report);
console.log(`\nReport written to: ${outputPath}`);

// Summary to console
console.log('\n' + '='.repeat(60));
console.log('PHASE 2 SUMMARY');
console.log('='.repeat(60));
Object.values(results).forEach(r => {
  console.log(`${r.test}: Z = ${r.zScore} ${r.significant ? '✓ SIGNIFICANT' : '✗'}`);
});
