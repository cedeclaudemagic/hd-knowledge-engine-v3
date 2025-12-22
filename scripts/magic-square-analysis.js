/**
 * MAGIC SQUARE PLANETARY DERIVATION ANALYSIS
 *
 * Testing Ra's 3×3 Magic Square architecture and Color Resonance mechanics
 * to explain planetary exaltation/detriment assignments.
 */

const fs = require('fs');
const path = require('path');

// Load data files
const basePath = '/Volumes/CLAUDE/HD-Knowledge-Engine-V3';
const linesData = JSON.parse(fs.readFileSync(path.join(basePath, 'knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json')));
const gatesData = JSON.parse(fs.readFileSync(path.join(basePath, 'knowledge-systems/hd-gates/mappings/hd-gates-mappings.json')));

// ============================================================================
// MAGIC SQUARE DEFINITIONS
// ============================================================================

const MAGIC_SQUARE = {
  // The three verticals
  alpha_vertical: ['Moon', 'Venus', 'Saturn'],      // Foundation/Yin
  beta_vertical: ['Mercury', 'Mars', 'Jupiter'],    // Outer Authority/Yang
  gamma_vertical: ['Uranus', 'Neptune', 'Pluto'],   // Learning/Transcendent

  // Diamond (corner positions) - external/mundane
  diamond: ['Mercury', 'Neptune', 'Jupiter', 'Venus'],

  // Diagonal (centre cross) - internal/mutational
  diagonal: ['Moon', 'Mars', 'Pluto'],

  // Planets NOT in Magic Square (crystals, not lunar/planetary)
  excluded: ['Sun', 'Earth', 'North Node', 'South Node']
};

// Get vertical for a planet
function getVertical(planet) {
  if (MAGIC_SQUARE.alpha_vertical.includes(planet)) return 'Alpha';
  if (MAGIC_SQUARE.beta_vertical.includes(planet)) return 'Beta';
  if (MAGIC_SQUARE.gamma_vertical.includes(planet)) return 'Gamma';
  return 'Excluded';
}

// Get diamond/diagonal status
function getDiamondDiagonal(planet) {
  const result = [];
  if (MAGIC_SQUARE.diamond.includes(planet)) result.push('Diamond');
  if (MAGIC_SQUARE.diagonal.includes(planet)) result.push('Diagonal');
  if (result.length === 0) {
    if (MAGIC_SQUARE.excluded.includes(planet)) return 'Excluded';
    return 'Neither'; // Saturn, Uranus
  }
  return result.join('/');
}

// Color harmonic pairs
const COLOR_HARMONICS = {
  1: 4, 4: 1,
  2: 5, 5: 2,
  3: 6, 6: 3
};

// ============================================================================
// DATA EXTRACTION
// ============================================================================

const allLines = linesData.mappings;
console.log('================================================================================');
console.log('MAGIC SQUARE PLANETARY DERIVATION ANALYSIS');
console.log('================================================================================\n');
console.log(`Total lines loaded: ${allLines.length}`);

// Extract planetary assignments with EM data
const assignments = allLines.map(line => {
  const gateType = line.electromagnetic?.gateType || 'unknown';
  const innerPos = line.electromagnetic?.innerTrigram?.position || 0;
  const outerPos = line.electromagnetic?.outerTrigram?.position || 0;

  return {
    gate: line.gate,
    line: line.line,
    gateType: gateType,
    innerPosition: innerPos,
    outerPosition: outerPos,
    exaltPlanet: line.source?.exaltation?.planet || 'None',
    detrimentPlanet: line.source?.detriment?.planet || 'None',
    exaltVertical: getVertical(line.source?.exaltation?.planet),
    detrimentVertical: getVertical(line.source?.detriment?.planet),
    exaltDiaDia: getDiamondDiagonal(line.source?.exaltation?.planet),
    detrimentDiaDia: getDiamondDiagonal(line.source?.detriment?.planet)
  };
});

// ============================================================================
// PHASE 1: DESCRIPTIVE ANALYSIS
// ============================================================================

console.log('\n================================================================================');
console.log('PHASE 1: DESCRIPTIVE ANALYSIS');
console.log('================================================================================\n');

// Count matrices
const verticalCounts = {
  exalt: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 },
  detriment: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 }
};

const diaDiaCounts = {
  exalt: { Diamond: 0, Diagonal: 0, Neither: 0, Excluded: 0, 'Diamond/Diagonal': 0 },
  detriment: { Diamond: 0, Diagonal: 0, Neither: 0, Excluded: 0, 'Diamond/Diagonal': 0 }
};

const planetCounts = {
  exalt: {},
  detriment: {}
};

const byGateType = {
  'doubled': { exalt: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 }, detriment: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 } },
  'same-phase-material': { exalt: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 }, detriment: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 } },
  'same-phase-void': { exalt: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 }, detriment: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 } },
  'cross-zero-manifesting': { exalt: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 }, detriment: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 } },
  'cross-zero-dematerialising': { exalt: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 }, detriment: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 } }
};

const byLine = {};
for (let l = 1; l <= 6; l++) {
  byLine[l] = { exalt: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 }, detriment: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 } };
}

const byPosition = {};
[-4, -3, -2, -1, 1, 2, 3, 4].forEach(pos => {
  byPosition[pos] = { exalt: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 }, detriment: { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 } };
});

// Populate counts
assignments.forEach(a => {
  // Vertical counts
  if (a.exaltVertical) verticalCounts.exalt[a.exaltVertical]++;
  if (a.detrimentVertical) verticalCounts.detriment[a.detrimentVertical]++;

  // Diamond/Diagonal counts
  if (a.exaltDiaDia) {
    if (diaDiaCounts.exalt[a.exaltDiaDia] !== undefined) diaDiaCounts.exalt[a.exaltDiaDia]++;
  }
  if (a.detrimentDiaDia) {
    if (diaDiaCounts.detriment[a.detrimentDiaDia] !== undefined) diaDiaCounts.detriment[a.detrimentDiaDia]++;
  }

  // Planet counts
  if (a.exaltPlanet !== 'None') {
    planetCounts.exalt[a.exaltPlanet] = (planetCounts.exalt[a.exaltPlanet] || 0) + 1;
  }
  if (a.detrimentPlanet !== 'None') {
    planetCounts.detriment[a.detrimentPlanet] = (planetCounts.detriment[a.detrimentPlanet] || 0) + 1;
  }

  // By gate type
  if (byGateType[a.gateType]) {
    if (a.exaltVertical) byGateType[a.gateType].exalt[a.exaltVertical]++;
    if (a.detrimentVertical) byGateType[a.gateType].detriment[a.detrimentVertical]++;
  }

  // By line
  if (byLine[a.line]) {
    if (a.exaltVertical) byLine[a.line].exalt[a.exaltVertical]++;
    if (a.detrimentVertical) byLine[a.line].detriment[a.detrimentVertical]++;
  }

  // By position (use inner position for standing waves, outer for cross-zero destination)
  const pos = a.gateType === 'doubled' ? a.innerPosition : a.outerPosition;
  if (byPosition[pos]) {
    if (a.exaltVertical) byPosition[pos].exalt[a.exaltVertical]++;
    if (a.detrimentVertical) byPosition[pos].detriment[a.detrimentVertical]++;
  }
});

// Display overall vertical distribution
console.log('--- OVERALL VERTICAL DISTRIBUTION ---\n');
console.log('| Type | Alpha | Beta | Gamma | Excluded |');
console.log('|------|-------|------|-------|----------|');
console.log(`| Exaltation | ${verticalCounts.exalt.Alpha} | ${verticalCounts.exalt.Beta} | ${verticalCounts.exalt.Gamma} | ${verticalCounts.exalt.Excluded} |`);
console.log(`| Detriment | ${verticalCounts.detriment.Alpha} | ${verticalCounts.detriment.Beta} | ${verticalCounts.detriment.Gamma} | ${verticalCounts.detriment.Excluded} |`);

// Calculate percentages (excluding Excluded)
const exaltTotal = verticalCounts.exalt.Alpha + verticalCounts.exalt.Beta + verticalCounts.exalt.Gamma;
const detTotal = verticalCounts.detriment.Alpha + verticalCounts.detriment.Beta + verticalCounts.detriment.Gamma;

console.log('\n--- VERTICAL PERCENTAGES (Magic Square planets only) ---\n');
console.log('| Type | Alpha | Beta | Gamma |');
console.log('|------|-------|------|-------|');
console.log(`| Exaltation | ${(verticalCounts.exalt.Alpha/exaltTotal*100).toFixed(1)}% | ${(verticalCounts.exalt.Beta/exaltTotal*100).toFixed(1)}% | ${(verticalCounts.exalt.Gamma/exaltTotal*100).toFixed(1)}% |`);
console.log(`| Detriment | ${(verticalCounts.detriment.Alpha/detTotal*100).toFixed(1)}% | ${(verticalCounts.detriment.Beta/detTotal*100).toFixed(1)}% | ${(verticalCounts.detriment.Gamma/detTotal*100).toFixed(1)}% |`);
console.log(`\nExpected if uniform: 33.3% each`);

// Diamond/Diagonal distribution
console.log('\n--- DIAMOND vs DIAGONAL DISTRIBUTION ---\n');
console.log('| Type | Diamond | Diagonal | Neither | Excluded |');
console.log('|------|---------|----------|---------|----------|');
console.log(`| Exaltation | ${diaDiaCounts.exalt.Diamond} | ${diaDiaCounts.exalt.Diagonal} | ${diaDiaCounts.exalt.Neither} | ${diaDiaCounts.exalt.Excluded} |`);
console.log(`| Detriment | ${diaDiaCounts.detriment.Diamond} | ${diaDiaCounts.detriment.Diagonal} | ${diaDiaCounts.detriment.Neither} | ${diaDiaCounts.detriment.Excluded} |`);

// By gate type
console.log('\n--- VERTICAL DISTRIBUTION BY GATE TYPE (Exaltations) ---\n');
console.log('| Gate Type | Alpha | Beta | Gamma | Excl | Total |');
console.log('|-----------|-------|------|-------|------|-------|');
Object.keys(byGateType).forEach(gt => {
  const e = byGateType[gt].exalt;
  const total = e.Alpha + e.Beta + e.Gamma + e.Excluded;
  console.log(`| ${gt.padEnd(27)} | ${e.Alpha.toString().padStart(5)} | ${e.Beta.toString().padStart(4)} | ${e.Gamma.toString().padStart(5)} | ${e.Excluded.toString().padStart(4)} | ${total.toString().padStart(5)} |`);
});

// By line
console.log('\n--- VERTICAL DISTRIBUTION BY LINE (Exaltations) ---\n');
console.log('| Line | Alpha | Beta | Gamma | Excl | Total |');
console.log('|------|-------|------|-------|------|-------|');
for (let l = 1; l <= 6; l++) {
  const e = byLine[l].exalt;
  const total = e.Alpha + e.Beta + e.Gamma + e.Excluded;
  console.log(`| ${l}    | ${e.Alpha.toString().padStart(5)} | ${e.Beta.toString().padStart(4)} | ${e.Gamma.toString().padStart(5)} | ${e.Excluded.toString().padStart(4)} | ${total.toString().padStart(5)} |`);
}

// By position
console.log('\n--- VERTICAL DISTRIBUTION BY EM POSITION (Exaltations) ---\n');
console.log('| Position | Alpha | Beta | Gamma | Excl | Total |');
console.log('|----------|-------|------|-------|------|-------|');
[-4, -3, -2, -1, 1, 2, 3, 4].forEach(pos => {
  const e = byPosition[pos].exalt;
  const total = e.Alpha + e.Beta + e.Gamma + e.Excluded;
  console.log(`| ${pos.toString().padStart(8)} | ${e.Alpha.toString().padStart(5)} | ${e.Beta.toString().padStart(4)} | ${e.Gamma.toString().padStart(5)} | ${e.Excluded.toString().padStart(4)} | ${total.toString().padStart(5)} |`);
});

// ============================================================================
// PHASE 2: HYPOTHESIS TESTING
// ============================================================================

console.log('\n================================================================================');
console.log('PHASE 2: HYPOTHESIS TESTING');
console.log('================================================================================\n');

// Chi-square calculation
function chiSquare(observed, expected) {
  let chi2 = 0;
  for (let i = 0; i < observed.length; i++) {
    if (expected[i] > 0) {
      chi2 += Math.pow(observed[i] - expected[i], 2) / expected[i];
    }
  }
  return chi2;
}

// Z-score calculation
function zScore(observed, expected, n) {
  const p = expected / n;
  const se = Math.sqrt(expected * (1 - p));
  return (observed - expected) / se;
}

// -----------------------------------------------------------------------------
// H1: Alpha Vertical Correlation with Standing Waves
// -----------------------------------------------------------------------------
console.log('--- H1: ALPHA VERTICAL PREDOMINANCE IN STANDING WAVES ---\n');

const swExalt = byGateType['doubled']?.exalt || { Alpha: 0, Beta: 0, Gamma: 0, Excluded: 0 };
const swTotal = swExalt.Alpha + swExalt.Beta + swExalt.Gamma;
const swExpected = swTotal / 3;

console.log(`Standing wave exaltations (Magic Square planets only): ${swTotal}`);
console.log(`Alpha: ${swExalt.Alpha} (${(swExalt.Alpha/swTotal*100).toFixed(1)}%)`);
console.log(`Beta: ${swExalt.Beta} (${(swExalt.Beta/swTotal*100).toFixed(1)}%)`);
console.log(`Gamma: ${swExalt.Gamma} (${(swExalt.Gamma/swTotal*100).toFixed(1)}%)`);
console.log(`Expected if uniform: ${swExpected.toFixed(1)} each (33.3%)`);

const chi2_h1 = chiSquare([swExalt.Alpha, swExalt.Beta, swExalt.Gamma], [swExpected, swExpected, swExpected]);
console.log(`\nChi-square: ${chi2_h1.toFixed(2)}`);
console.log(`Critical value (df=2, α=0.05): 5.99`);
console.log(`Result: ${chi2_h1 > 5.99 ? 'SIGNIFICANT' : 'NOT SIGNIFICANT'}`);

const z_alpha = zScore(swExalt.Alpha, swExpected, swTotal);
console.log(`\nAlpha Z-score: ${z_alpha.toFixed(2)}`);
console.log(`H1 Status: ${z_alpha >= 2.0 ? 'SUPPORTED' : 'NOT SUPPORTED'} (threshold Z≥2.0)`);

// -----------------------------------------------------------------------------
// H2: EM Position Maps to Magic Square Vertical
// -----------------------------------------------------------------------------
console.log('\n--- H2: EM POSITION → VERTICAL CORRELATION ---\n');

// Predictions from the framework
const positionPredictions = {
  '-4': 'Alpha', '-3': 'Alpha',  // Potential → Foundation
  '-2': 'Beta', '+2': 'Beta',    // Flow → Authority/Action
  '-1': 'Beta', '+1': 'Beta',    // Gate → Action
  '+3': 'Alpha', '+4': 'Alpha'   // Form → Constraint
};

console.log('| Position | Predicted | Alpha% | Beta% | Gamma% | Dominant | Match? |');
console.log('|----------|-----------|--------|-------|--------|----------|--------|');

let h2Matches = 0;
[-4, -3, -2, -1, 1, 2, 3, 4].forEach(pos => {
  const e = byPosition[pos].exalt;
  const total = e.Alpha + e.Beta + e.Gamma;
  if (total === 0) return;

  const alphaP = (e.Alpha / total * 100).toFixed(1);
  const betaP = (e.Beta / total * 100).toFixed(1);
  const gammaP = (e.Gamma / total * 100).toFixed(1);

  let dominant = 'None';
  if (e.Alpha >= e.Beta && e.Alpha >= e.Gamma) dominant = 'Alpha';
  else if (e.Beta >= e.Alpha && e.Beta >= e.Gamma) dominant = 'Beta';
  else dominant = 'Gamma';

  const predicted = positionPredictions[pos.toString()] || 'Unknown';
  const match = dominant === predicted ? 'YES' : 'NO';
  if (match === 'YES') h2Matches++;

  console.log(`| ${pos.toString().padStart(8)} | ${predicted.padEnd(9)} | ${alphaP.padStart(6)}% | ${betaP.padStart(5)}% | ${gammaP.padStart(6)}% | ${dominant.padEnd(8)} | ${match.padEnd(6)} |`);
});

console.log(`\nPrediction matches: ${h2Matches}/8`);
console.log(`H2 Status: ${h2Matches >= 5 ? 'SUPPORTED' : 'NOT SUPPORTED'} (threshold ≥5 matches)`);

// -----------------------------------------------------------------------------
// H3: Diamond vs Diagonal (Venus vs Mars)
// -----------------------------------------------------------------------------
console.log('\n--- H3: DIAMOND vs DIAGONAL (Venus/Mars Patterns) ---\n');

// Count Venus exaltations and Mars detriments
let venusExaltDiamond = 0, venusExaltDiagonal = 0, venusExaltOther = 0;
let marsDetDiamond = 0, marsDetDiagonal = 0, marsDetOther = 0;
let marsExaltDiamond = 0, marsExaltDiagonal = 0;

assignments.forEach(a => {
  // We need to classify the LINE context, not the planet
  // For now, use the co-planet's classification as a proxy

  // Venus exaltation analysis
  if (a.exaltPlanet === 'Venus') {
    // Check what type of context this is based on detriment planet
    const detClass = getDiamondDiagonal(a.detrimentPlanet);
    if (detClass.includes('Diamond')) venusExaltDiamond++;
    else if (detClass.includes('Diagonal')) venusExaltDiagonal++;
    else venusExaltOther++;
  }

  // Mars detriment analysis
  if (a.detrimentPlanet === 'Mars') {
    // Check what type of context based on exaltation planet
    const exClass = getDiamondDiagonal(a.exaltPlanet);
    if (exClass.includes('Diamond')) marsDetDiamond++;
    else if (exClass.includes('Diagonal')) marsDetDiagonal++;
    else marsDetOther++;
  }

  // Mars exaltation (when it works)
  if (a.exaltPlanet === 'Mars') {
    const detClass = getDiamondDiagonal(a.detrimentPlanet);
    if (detClass.includes('Diamond')) marsExaltDiamond++;
    else if (detClass.includes('Diagonal')) marsExaltDiagonal++;
  }
});

console.log('Venus Exaltation contexts (by co-planet classification):');
console.log(`  Diamond contexts: ${venusExaltDiamond}`);
console.log(`  Diagonal contexts: ${venusExaltDiagonal}`);
console.log(`  Other contexts: ${venusExaltOther}`);

console.log('\nMars Detriment contexts (by co-planet classification):');
console.log(`  Diamond contexts: ${marsDetDiamond}`);
console.log(`  Diagonal contexts: ${marsDetDiagonal}`);
console.log(`  Other contexts: ${marsDetOther}`);

console.log('\nMars Exaltation contexts (when Mars works):');
console.log(`  Diamond contexts: ${marsExaltDiamond}`);
console.log(`  Diagonal contexts: ${marsExaltDiagonal}`);

// Alternative: Direct planet Diamond/Diagonal distribution
console.log('\n--- Direct Planet Classification ---\n');

const diamondPlanets = MAGIC_SQUARE.diamond;
const diagonalPlanets = MAGIC_SQUARE.diagonal;

let diamondExaltCount = 0, diagonalExaltCount = 0;
let diamondDetCount = 0, diagonalDetCount = 0;

assignments.forEach(a => {
  if (diamondPlanets.includes(a.exaltPlanet)) diamondExaltCount++;
  if (diagonalPlanets.includes(a.exaltPlanet)) diagonalExaltCount++;
  if (diamondPlanets.includes(a.detrimentPlanet)) diamondDetCount++;
  if (diagonalPlanets.includes(a.detrimentPlanet)) diagonalDetCount++;
});

console.log('| Group | Exaltations | Detriments | Exalt/Det Ratio |');
console.log('|-------|-------------|------------|-----------------|');
console.log(`| Diamond (Mercury,Neptune,Jupiter,Venus) | ${diamondExaltCount} | ${diamondDetCount} | ${(diamondExaltCount/diamondDetCount).toFixed(2)} |`);
console.log(`| Diagonal (Moon,Mars,Pluto) | ${diagonalExaltCount} | ${diagonalDetCount} | ${(diagonalExaltCount/diagonalDetCount).toFixed(2)} |`);

// Ra's prediction: Venus dominates Diamond exaltations, Mars is Diamond detriment
const venusCount = planetCounts.exalt['Venus'] || 0;
const marsDetCount = planetCounts.detriment['Mars'] || 0;

console.log(`\nVenus total exaltations: ${venusCount}`);
console.log(`Mars total detriments: ${marsDetCount}`);
console.log(`\nRa's claim: "Venus & Mars Dominate the Rave I'Ching Exaltations & Detriments"`);
console.log(`Venus exalt rate: ${(venusCount/384*100).toFixed(1)}%`);
console.log(`Mars detriment rate: ${(marsDetCount/384*100).toFixed(1)}%`);

// -----------------------------------------------------------------------------
// H4: Color Resonance (Limited - we may not have Color data)
// -----------------------------------------------------------------------------
console.log('\n--- H4: COLOR RESONANCE ---\n');
console.log('Note: Full Color data extraction required for complete test.');
console.log('Preliminary analysis based on available data...');

// We don't have direct Color data, so skip this for now
console.log('Status: REQUIRES ADDITIONAL DATA');

// -----------------------------------------------------------------------------
// H5: Line Position → Vertical Correlation
// -----------------------------------------------------------------------------
console.log('\n--- H5: LINE POSITION → VERTICAL CORRELATION ---\n');

const linePredictions = {
  1: 'Alpha',  // Entry-Inner → Foundation
  2: 'Alpha',  // Development-Inner → Foundation/Action
  3: 'Beta',   // Completion-Inner → Action
  4: 'Gamma',  // Entry-Outer → Learning
  5: 'Beta',   // Development-Outer → Authority
  6: 'Gamma'   // Completion-Outer → Truth
};

console.log('| Line | Predicted | Alpha% | Beta% | Gamma% | Dominant | Match? |');
console.log('|------|-----------|--------|-------|--------|----------|--------|');

let h5Matches = 0;
let h5Significant = 0;

for (let l = 1; l <= 6; l++) {
  const e = byLine[l].exalt;
  const total = e.Alpha + e.Beta + e.Gamma;
  if (total === 0) continue;

  const alphaP = (e.Alpha / total * 100).toFixed(1);
  const betaP = (e.Beta / total * 100).toFixed(1);
  const gammaP = (e.Gamma / total * 100).toFixed(1);

  let dominant = 'None';
  if (e.Alpha >= e.Beta && e.Alpha >= e.Gamma) dominant = 'Alpha';
  else if (e.Beta >= e.Alpha && e.Beta >= e.Gamma) dominant = 'Beta';
  else dominant = 'Gamma';

  const predicted = linePredictions[l];
  const match = dominant === predicted ? 'YES' : 'NO';
  if (match === 'YES') h5Matches++;

  // Chi-square for this line
  const expected = total / 3;
  const chi2_line = chiSquare([e.Alpha, e.Beta, e.Gamma], [expected, expected, expected]);
  if (chi2_line > 5.99) h5Significant++;

  console.log(`| ${l}    | ${predicted.padEnd(9)} | ${alphaP.padStart(6)}% | ${betaP.padStart(5)}% | ${gammaP.padStart(6)}% | ${dominant.padEnd(8)} | ${match.padEnd(6)} |`);
}

console.log(`\nPrediction matches: ${h5Matches}/6`);
console.log(`Lines with significant χ²: ${h5Significant}/6`);
console.log(`H5 Status: ${h5Matches >= 4 ? 'SUPPORTED' : 'NOT SUPPORTED'} (threshold ≥4 matches)`);

// ============================================================================
// ADDITIONAL ANALYSIS: Venus and Mars Deep Dive
// ============================================================================

console.log('\n================================================================================');
console.log('ADDITIONAL ANALYSIS: VENUS AND MARS PATTERNS');
console.log('================================================================================\n');

// Venus analysis by gate type
console.log('--- VENUS EXALTATION BY GATE TYPE ---\n');
let venusbyGateType = {};
assignments.forEach(a => {
  if (a.exaltPlanet === 'Venus') {
    venusbyGateType[a.gateType] = (venusbyGateType[a.gateType] || 0) + 1;
  }
});
Object.keys(venusbyGateType).forEach(gt => {
  console.log(`${gt}: ${venusbyGateType[gt]}`);
});

// Mars detriment by gate type
console.log('\n--- MARS DETRIMENT BY GATE TYPE ---\n');
let marsbyGateType = {};
assignments.forEach(a => {
  if (a.detrimentPlanet === 'Mars') {
    marsbyGateType[a.gateType] = (marsbyGateType[a.gateType] || 0) + 1;
  }
});
Object.keys(marsbyGateType).forEach(gt => {
  console.log(`${gt}: ${marsbyGateType[gt]}`);
});

// Venus by position
console.log('\n--- VENUS EXALTATION BY EM POSITION ---\n');
let venusbyPos = {};
assignments.forEach(a => {
  if (a.exaltPlanet === 'Venus') {
    const pos = a.gateType === 'doubled' ? a.innerPosition : a.outerPosition;
    venusbyPos[pos] = (venusbyPos[pos] || 0) + 1;
  }
});
[-4, -3, -2, -1, 1, 2, 3, 4].forEach(pos => {
  console.log(`Position ${pos}: ${venusbyPos[pos] || 0}`);
});

// Mars by position
console.log('\n--- MARS DETRIMENT BY EM POSITION ---\n');
let marsbyPos = {};
assignments.forEach(a => {
  if (a.detrimentPlanet === 'Mars') {
    const pos = a.gateType === 'doubled' ? a.innerPosition : a.outerPosition;
    marsbyPos[pos] = (marsbyPos[pos] || 0) + 1;
  }
});
[-4, -3, -2, -1, 1, 2, 3, 4].forEach(pos => {
  console.log(`Position ${pos}: ${marsbyPos[pos] || 0}`);
});

// ============================================================================
// SYNTHESIS
// ============================================================================

console.log('\n================================================================================');
console.log('SYNTHESIS: MAGIC SQUARE FINDINGS');
console.log('================================================================================\n');

console.log('| Hypothesis | Test | Result | Z/χ² | Status |');
console.log('|------------|------|--------|------|--------|');
console.log(`| H1: Alpha in Standing Waves | χ² distribution | ${chi2_h1.toFixed(2)} | Z=${z_alpha.toFixed(2)} | ${z_alpha >= 2.0 ? 'SUPPORTED' : 'NOT SUPPORTED'} |`);
console.log(`| H2: EM Position → Vertical | Prediction match | ${h2Matches}/8 | n/a | ${h2Matches >= 5 ? 'SUPPORTED' : 'NOT SUPPORTED'} |`);
console.log(`| H3: Diamond/Diagonal | Venus/Mars ratio | see above | n/a | PARTIAL |`);
console.log(`| H4: Color Resonance | n/a | n/a | n/a | NEEDS DATA |`);
console.log(`| H5: Line → Vertical | Prediction match | ${h5Matches}/6 | χ²=${h5Significant} sig | ${h5Matches >= 4 ? 'SUPPORTED' : 'NOT SUPPORTED'} |`);

console.log('\n=== OVERALL ASSESSMENT ===\n');

const supportedCount = [z_alpha >= 2.0, h2Matches >= 5, h5Matches >= 4].filter(Boolean).length;
console.log(`Hypotheses supported: ${supportedCount}/5 testable`);

if (supportedCount >= 3) {
  console.log('\nConclusion: MAGIC SQUARE SHOWS SIGNIFICANT SIGNAL');
  console.log('The 3×3 planetary architecture correlates with planetary assignments.');
} else if (supportedCount >= 2) {
  console.log('\nConclusion: MAGIC SQUARE SHOWS PARTIAL SIGNAL');
  console.log('Some correlations exist but not a complete derivation key.');
} else {
  console.log('\nConclusion: MAGIC SQUARE SHOWS WEAK/NO SIGNAL');
  console.log('The vertical/diamond-diagonal structure does not predict assignments.');
}

console.log('\n=== END OF ANALYSIS ===\n');
