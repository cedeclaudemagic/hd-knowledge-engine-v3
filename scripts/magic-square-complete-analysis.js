/**
 * MAGIC SQUARE COMPLETE ANALYSIS
 *
 * Comprehensive test battery for Ra's Magic Square structure:
 * - Laterals (Rows): Mind, Body, Spirit
 * - Diamond vs Diagonal structures
 * - Moon-Brain connection
 * - Centre × Vertical interactions
 *
 * NOTE: Brief had Beta/Gamma swapped. Using VALIDATED verticals:
 * - Alpha: Moon, Venus, Saturn (E/D = 1.35)
 * - Beta: Mercury, Mars, Jupiter (E/D = 0.49)
 * - Gamma: Uranus, Neptune, Pluto (E/D = 1.44)
 */

const fs = require('fs');
const path = require('path');

const basePath = '/Volumes/CLAUDE/HD-Knowledge-Engine-V3';
const linesData = JSON.parse(fs.readFileSync(path.join(basePath, 'knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json')));
const gateSequence = JSON.parse(fs.readFileSync(path.join(basePath, 'core/root-system/gate-sequence.json')));

// ============================================================================
// MAGIC SQUARE DEFINITIONS
// ============================================================================

// VERTICALS (Columns) - VALIDATED
const VERTICALS = {
  alpha: ['Moon', 'Venus', 'Saturn'],      // E/D = 1.35
  beta: ['Mercury', 'Mars', 'Jupiter'],    // E/D = 0.49
  gamma: ['Uranus', 'Neptune', 'Pluto']    // E/D = 1.44
};

// LATERALS (Rows) - TO TEST
const LATERALS = {
  mind: ['Moon', 'Uranus', 'Mercury'],      // Row 1
  body: ['Venus', 'Mars', 'Neptune'],       // Row 2
  spirit: ['Saturn', 'Jupiter', 'Pluto']    // Row 3
};

// DIAMOND (Corners) - Non-Mars
const DIAMOND = ['Mercury', 'Neptune', 'Jupiter', 'Venus'];

// DIAGONALS
const MAIN_DIAGONAL = ['Moon', 'Mars', 'Pluto'];   // Top-left to bottom-right
const ANTI_DIAGONAL = ['Mercury', 'Mars', 'Saturn']; // Top-right to bottom-left
const ALL_DIAGONAL = ['Moon', 'Mars', 'Pluto', 'Mercury', 'Saturn']; // Union (Mars in both)

// CENTRES
const CENTRES = {
  head: [64, 61, 63],
  ajna: [47, 24, 4, 17, 43, 11],
  brain: [64, 61, 63, 47, 24, 4, 17, 43, 11], // Head + Ajna combined
  throat: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16],
  g: [7, 1, 13, 25, 46, 2, 15, 10],
  heart: [26, 51, 21, 40],
  spleen: [48, 57, 44, 50, 32, 28, 18],
  sacral: [5, 14, 29, 59, 9, 3, 42, 27, 34],
  root: [53, 60, 52, 19, 39, 41, 58, 38, 54],
  esp: [36, 22, 37, 6, 49, 55, 30] // Emotional Solar Plexus
};

// Gate → Wheel position → Color band
const gateToPosition = {};
gateSequence.sequence.forEach((gate, idx) => {
  gateToPosition[gate] = idx;
});

function gateToDegree(gate) {
  return gateToPosition[gate] * 5.625;
}

function gateToColorBand(gate) {
  const degree = gateToDegree(gate);
  return Math.floor(degree / 60) % 6 + 1;
}

// ============================================================================
// STATISTICAL FUNCTIONS
// ============================================================================

function calculateChiSquare2x2(observed) {
  const a = observed[0][0], b = observed[0][1];
  const c = observed[1][0], d = observed[1][1];
  const n = a + b + c + d;

  if (n === 0) return 0;

  const expected = [
    [(a+b)*(a+c)/n, (a+b)*(b+d)/n],
    [(c+d)*(a+c)/n, (c+d)*(b+d)/n]
  ];

  let chiSq = 0;
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      if (expected[i][j] > 0) {
        chiSq += Math.pow(observed[i][j] - expected[i][j], 2) / expected[i][j];
      }
    }
  }

  return chiSq;
}

function calculateChiSquare3x2(observed) {
  const rowTotals = observed.map(row => row[0] + row[1]);
  const colTotals = [
    observed.reduce((sum, row) => sum + row[0], 0),
    observed.reduce((sum, row) => sum + row[1], 0)
  ];
  const n = colTotals[0] + colTotals[1];

  if (n === 0) return 0;

  let chiSq = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      const expected = rowTotals[i] * colTotals[j] / n;
      if (expected > 0) {
        chiSq += Math.pow(observed[i][j] - expected, 2) / expected;
      }
    }
  }

  return chiSq;
}

// ============================================================================
// DATA PREPARATION
// ============================================================================

const allLines = linesData.mappings.map(line => ({
  gate: line.gate,
  line: line.line,
  colorBand: gateToColorBand(line.gate),
  exalt: line.source?.exaltation?.planet || 'None',
  detriment: line.source?.detriment?.planet || 'None'
}));

// ============================================================================
// TEST L1: LATERAL E/D CHARACTER
// ============================================================================

console.log('================================================================================');
console.log('TEST L1: LATERAL E/D CHARACTER');
console.log('================================================================================\n');

const lateralResults = {};
for (const [name, planets] of Object.entries(LATERALS)) {
  lateralResults[name] = { E: 0, D: 0 };
  for (const line of allLines) {
    if (planets.includes(line.exalt)) lateralResults[name].E++;
    if (planets.includes(line.detriment)) lateralResults[name].D++;
  }
  lateralResults[name].ratio = lateralResults[name].E / (lateralResults[name].D || 1);
}

console.log('| Lateral | Planets | Exalt | Detriment | E/D Ratio |');
console.log('|---------|---------|-------|-----------|-----------|');
for (const [name, result] of Object.entries(lateralResults)) {
  const planets = LATERALS[name].join(', ');
  console.log(`| ${name.padEnd(7)} | ${planets.padEnd(7).substring(0, 20)} | ${result.E.toString().padStart(5)} | ${result.D.toString().padStart(9)} | ${result.ratio.toFixed(2).padStart(9)} |`);
}

const lateralObserved = [
  [lateralResults.mind.E, lateralResults.mind.D],
  [lateralResults.body.E, lateralResults.body.D],
  [lateralResults.spirit.E, lateralResults.spirit.D]
];
const lateralChi2 = calculateChiSquare3x2(lateralObserved);
console.log(`\nChi-square (3×2): ${lateralChi2.toFixed(2)}`);
console.log(`Critical value (df=2, α=0.05): 5.99`);
console.log(`Result: ${lateralChi2 > 5.99 ? 'SIGNIFICANT ✓' : 'NOT SIGNIFICANT'}`);

// ============================================================================
// TEST D1: DIAMOND VS DIAGONAL
// ============================================================================

console.log('\n================================================================================');
console.log('TEST D1: DIAMOND VS DIAGONAL');
console.log('================================================================================\n');

const diamondResult = { E: 0, D: 0 };
const diagonalResult = { E: 0, D: 0 };

for (const line of allLines) {
  if (DIAMOND.includes(line.exalt)) diamondResult.E++;
  if (DIAMOND.includes(line.detriment)) diamondResult.D++;
  if (ALL_DIAGONAL.includes(line.exalt)) diagonalResult.E++;
  if (ALL_DIAGONAL.includes(line.detriment)) diagonalResult.D++;
}

diamondResult.ratio = diamondResult.E / (diamondResult.D || 1);
diagonalResult.ratio = diagonalResult.E / (diagonalResult.D || 1);

console.log('| Group | Planets | Exalt | Detriment | E/D Ratio |');
console.log('|-------|---------|-------|-----------|-----------|');
console.log(`| Diamond | ${DIAMOND.join(', ').substring(0, 30)} | ${diamondResult.E.toString().padStart(5)} | ${diamondResult.D.toString().padStart(9)} | ${diamondResult.ratio.toFixed(2).padStart(9)} |`);
console.log(`| Diagonal | ${ALL_DIAGONAL.join(', ').substring(0, 29)} | ${diagonalResult.E.toString().padStart(5)} | ${diagonalResult.D.toString().padStart(9)} | ${diagonalResult.ratio.toFixed(2).padStart(9)} |`);

const d1Observed = [
  [diamondResult.E, diamondResult.D],
  [diagonalResult.E, diagonalResult.D]
];
const d1Chi2 = calculateChiSquare2x2(d1Observed);
console.log(`\nChi-square (2×2): ${d1Chi2.toFixed(2)}`);
console.log(`Critical value (df=1, α=0.05): 3.84`);
console.log(`Result: ${d1Chi2 > 3.84 ? 'SIGNIFICANT ✓' : 'NOT SIGNIFICANT'}`);

// ============================================================================
// TEST D2: MAIN DIAGONAL VS ANTI-DIAGONAL
// ============================================================================

console.log('\n================================================================================');
console.log('TEST D2: MAIN DIAGONAL VS ANTI-DIAGONAL');
console.log('================================================================================\n');

const mainDiagResult = { E: 0, D: 0 };
const antiDiagResult = { E: 0, D: 0 };

for (const line of allLines) {
  if (MAIN_DIAGONAL.includes(line.exalt)) mainDiagResult.E++;
  if (MAIN_DIAGONAL.includes(line.detriment)) mainDiagResult.D++;
  if (ANTI_DIAGONAL.includes(line.exalt)) antiDiagResult.E++;
  if (ANTI_DIAGONAL.includes(line.detriment)) antiDiagResult.D++;
}

mainDiagResult.ratio = mainDiagResult.E / (mainDiagResult.D || 1);
antiDiagResult.ratio = antiDiagResult.E / (antiDiagResult.D || 1);

console.log('Note: Mars appears in BOTH diagonals\n');
console.log('| Diagonal | Planets | Exalt | Detriment | E/D Ratio |');
console.log('|----------|---------|-------|-----------|-----------|');
console.log(`| Main (↘) | ${MAIN_DIAGONAL.join(', ').padEnd(20)} | ${mainDiagResult.E.toString().padStart(5)} | ${mainDiagResult.D.toString().padStart(9)} | ${mainDiagResult.ratio.toFixed(2).padStart(9)} |`);
console.log(`| Anti (↙) | ${ANTI_DIAGONAL.join(', ').padEnd(20)} | ${antiDiagResult.E.toString().padStart(5)} | ${antiDiagResult.D.toString().padStart(9)} | ${antiDiagResult.ratio.toFixed(2).padStart(9)} |`);

const d2Observed = [
  [mainDiagResult.E, mainDiagResult.D],
  [antiDiagResult.E, antiDiagResult.D]
];
const d2Chi2 = calculateChiSquare2x2(d2Observed);
console.log(`\nChi-square (2×2): ${d2Chi2.toFixed(2)}`);
console.log(`Critical value (df=1, α=0.05): 3.84`);
console.log(`Result: ${d2Chi2 > 3.84 ? 'SIGNIFICANT ✓' : 'NOT SIGNIFICANT'}`);

console.log('\n--- INDIVIDUAL PLANET E/D ON DIAGONALS ---');
for (const planet of ALL_DIAGONAL) {
  const E = allLines.filter(l => l.exalt === planet).length;
  const D = allLines.filter(l => l.detriment === planet).length;
  const ratio = E / (D || 1);
  const diagonal = MAIN_DIAGONAL.includes(planet) && ANTI_DIAGONAL.includes(planet) ? 'BOTH' :
                   MAIN_DIAGONAL.includes(planet) ? 'Main' : 'Anti';
  console.log(`${planet.padEnd(8)}: E=${E.toString().padStart(2)}, D=${D.toString().padStart(2)}, E/D=${ratio.toFixed(2)} [${diagonal}]`);
}

// ============================================================================
// TEST BS1: MOON-BRAIN CONNECTION
// ============================================================================

console.log('\n================================================================================');
console.log('TEST BS1: MOON-BRAIN CONNECTION');
console.log('================================================================================\n');

const brainGates = CENTRES.brain;
const brainLines = allLines.filter(l => brainGates.includes(l.gate));
const nonBrainLines = allLines.filter(l => !brainGates.includes(l.gate));

const moonBrain = {
  E: brainLines.filter(l => l.exalt === 'Moon').length,
  D: brainLines.filter(l => l.detriment === 'Moon').length
};
moonBrain.ratio = moonBrain.E / (moonBrain.D || 1);

const moonNonBrain = {
  E: nonBrainLines.filter(l => l.exalt === 'Moon').length,
  D: nonBrainLines.filter(l => l.detriment === 'Moon').length
};
moonNonBrain.ratio = moonNonBrain.E / (moonNonBrain.D || 1);

console.log(`Brain gates: ${brainGates.join(', ')}`);
console.log(`Total Brain lines: ${brainLines.length}`);
console.log(`Total non-Brain lines: ${nonBrainLines.length}\n`);

console.log('| Location | Moon Exalt | Moon Detriment | E/D Ratio |');
console.log('|----------|------------|----------------|-----------|');
console.log(`| Brain | ${moonBrain.E.toString().padStart(10)} | ${moonBrain.D.toString().padStart(14)} | ${moonBrain.ratio.toFixed(2).padStart(9)} |`);
console.log(`| Non-Brain | ${moonNonBrain.E.toString().padStart(10)} | ${moonNonBrain.D.toString().padStart(14)} | ${moonNonBrain.ratio.toFixed(2).padStart(9)} |`);

const bs1Observed = [
  [moonBrain.E, moonBrain.D],
  [moonNonBrain.E, moonNonBrain.D]
];
const bs1Chi2 = calculateChiSquare2x2(bs1Observed);
const bs1EffectSize = moonBrain.ratio / (moonNonBrain.ratio || 1);

console.log(`\nEffect size (Brain/NonBrain ratio): ${bs1EffectSize.toFixed(2)}`);
console.log(`Chi-square (2×2): ${bs1Chi2.toFixed(2)}`);
console.log(`Critical value (df=1, α=0.05): 3.84`);
console.log(`Result: ${bs1Chi2 > 3.84 && bs1EffectSize > 1.3 ? 'SIGNIFICANT ✓' : 'NOT SIGNIFICANT'}`);

// ============================================================================
// TEST BS1a: MOON-BRAIN AT ALPHA COLORS
// ============================================================================

console.log('\n================================================================================');
console.log('TEST BS1a: MOON-BRAIN AT ALPHA COLORS (3-4)');
console.log('================================================================================\n');

const alphaColors = [3, 4];
const brainAlphaLines = brainLines.filter(l => alphaColors.includes(l.colorBand));
const brainOtherLines = brainLines.filter(l => !alphaColors.includes(l.colorBand));

const moonBrainAlpha = {
  E: brainAlphaLines.filter(l => l.exalt === 'Moon').length,
  D: brainAlphaLines.filter(l => l.detriment === 'Moon').length
};
moonBrainAlpha.ratio = moonBrainAlpha.E / (moonBrainAlpha.D || 1);

const moonBrainOther = {
  E: brainOtherLines.filter(l => l.exalt === 'Moon').length,
  D: brainOtherLines.filter(l => l.detriment === 'Moon').length
};
moonBrainOther.ratio = moonBrainOther.E / (moonBrainOther.D || 1);

console.log(`Brain lines at Colors 3-4: ${brainAlphaLines.length}`);
console.log(`Brain lines at other Colors: ${brainOtherLines.length}\n`);

console.log('| Brain + Color | Moon Exalt | Moon Detriment | E/D Ratio |');
console.log('|---------------|------------|----------------|-----------|');
console.log(`| Alpha (C3-4) | ${moonBrainAlpha.E.toString().padStart(10)} | ${moonBrainAlpha.D.toString().padStart(14)} | ${moonBrainAlpha.ratio.toFixed(2).padStart(9)} |`);
console.log(`| Other Colors | ${moonBrainOther.E.toString().padStart(10)} | ${moonBrainOther.D.toString().padStart(14)} | ${moonBrainOther.ratio.toFixed(2).padStart(9)} |`);

const bs1aEffectSize = moonBrainAlpha.ratio / (moonBrainOther.ratio || 1);
console.log(`\nEffect size (Alpha/Other ratio): ${bs1aEffectSize.toFixed(2)}`);
console.log(`Result: ${bs1aEffectSize > 1.3 ? 'ENHANCED ✓' : 'NO ENHANCEMENT'}`);

// ============================================================================
// TEST L2: LATERAL × CENTRE INTERACTION
// ============================================================================

console.log('\n================================================================================');
console.log('TEST L2: LATERAL × CENTRE INTERACTION');
console.log('================================================================================\n');

const lateralCentreMappings = {
  mind: {
    planets: LATERALS.mind,
    gates: [...CENTRES.head, ...CENTRES.ajna]
  },
  body: {
    planets: LATERALS.body,
    gates: [...CENTRES.root, ...CENTRES.sacral, ...CENTRES.spleen]
  },
  spirit: {
    planets: LATERALS.spirit,
    gates: [...CENTRES.g, ...CENTRES.heart, ...CENTRES.throat]
  }
};

console.log('| Lateral | Domain Centres | In-Domain E/D | Out-Domain E/D | Interaction |');
console.log('|---------|----------------|---------------|----------------|-------------|');

for (const [lateral, config] of Object.entries(lateralCentreMappings)) {
  const domainLines = allLines.filter(l => config.gates.includes(l.gate));
  const otherLines = allLines.filter(l => !config.gates.includes(l.gate));

  const inDomain = {
    E: domainLines.filter(l => config.planets.includes(l.exalt)).length,
    D: domainLines.filter(l => config.planets.includes(l.detriment)).length
  };
  inDomain.ratio = inDomain.E / (inDomain.D || 1);

  const outDomain = {
    E: otherLines.filter(l => config.planets.includes(l.exalt)).length,
    D: otherLines.filter(l => config.planets.includes(l.detriment)).length
  };
  outDomain.ratio = outDomain.E / (outDomain.D || 1);

  const interaction = inDomain.ratio / (outDomain.ratio || 1);
  const domainName = lateral === 'mind' ? 'Head+Ajna' : lateral === 'body' ? 'Root+Sac+Spl' : 'G+Heart+Thr';

  console.log(`| ${lateral.padEnd(7)} | ${domainName.padEnd(14)} | ${inDomain.ratio.toFixed(2).padStart(13)} | ${outDomain.ratio.toFixed(2).padStart(14)} | ${interaction.toFixed(2).padStart(11)} |`);
}

// ============================================================================
// TEST LN1: LINE 1/6 NODAL AXIS
// ============================================================================

console.log('\n================================================================================');
console.log('TEST LN1: LINE 1/6 NODAL AXIS (MOON PATTERN)');
console.log('================================================================================\n');

const line1 = allLines.filter(l => l.line === 1);
const line6 = allLines.filter(l => l.line === 6);
const otherLines = allLines.filter(l => l.line !== 1 && l.line !== 6);

const moonLine1 = {
  E: line1.filter(l => l.exalt === 'Moon').length,
  D: line1.filter(l => l.detriment === 'Moon').length
};
moonLine1.ratio = moonLine1.E / (moonLine1.D || 1);

const moonLine6 = {
  E: line6.filter(l => l.exalt === 'Moon').length,
  D: line6.filter(l => l.detriment === 'Moon').length
};
moonLine6.ratio = moonLine6.E / (moonLine6.D || 1);

const moonOtherLines = {
  E: otherLines.filter(l => l.exalt === 'Moon').length,
  D: otherLines.filter(l => l.detriment === 'Moon').length
};
moonOtherLines.ratio = moonOtherLines.E / (moonOtherLines.D || 1);

const moonNodalAxis = {
  E: moonLine1.E + moonLine6.E,
  D: moonLine1.D + moonLine6.D
};
moonNodalAxis.ratio = moonNodalAxis.E / (moonNodalAxis.D || 1);

console.log('| Line | Moon Exalt | Moon Detriment | E/D Ratio |');
console.log('|------|------------|----------------|-----------|');
console.log(`| 1 | ${moonLine1.E.toString().padStart(10)} | ${moonLine1.D.toString().padStart(14)} | ${moonLine1.ratio.toFixed(2).padStart(9)} |`);
console.log(`| 6 | ${moonLine6.E.toString().padStart(10)} | ${moonLine6.D.toString().padStart(14)} | ${moonLine6.ratio.toFixed(2).padStart(9)} |`);
console.log(`| 1+6 (Nodal) | ${moonNodalAxis.E.toString().padStart(10)} | ${moonNodalAxis.D.toString().padStart(14)} | ${moonNodalAxis.ratio.toFixed(2).padStart(9)} |`);
console.log(`| 2-5 (Other) | ${moonOtherLines.E.toString().padStart(10)} | ${moonOtherLines.D.toString().padStart(14)} | ${moonOtherLines.ratio.toFixed(2).padStart(9)} |`);

const ln1Observed = [
  [moonNodalAxis.E, moonNodalAxis.D],
  [moonOtherLines.E, moonOtherLines.D]
];
const ln1Chi2 = calculateChiSquare2x2(ln1Observed);
const ln1EffectSize = moonNodalAxis.ratio / (moonOtherLines.ratio || 1);

console.log(`\nEffect size (Nodal/Other): ${ln1EffectSize.toFixed(2)}`);
console.log(`Chi-square (2×2): ${ln1Chi2.toFixed(2)}`);
console.log(`Critical value (df=1, α=0.05): 3.84`);
console.log(`Result: ${ln1Chi2 > 3.84 && ln1EffectSize > 1.3 ? 'SIGNIFICANT ✓' : 'NOT SIGNIFICANT'}`);

// ============================================================================
// TEST C1: CENTRE × VERTICAL MATRIX
// ============================================================================

console.log('\n================================================================================');
console.log('TEST C1: CENTRE × VERTICAL MATRIX');
console.log('================================================================================\n');

const centreVerticalMatrix = {};

for (const [centreName, gates] of Object.entries(CENTRES)) {
  if (centreName === 'brain') continue; // Skip combined, show head/ajna separately

  const centreLines = allLines.filter(l => gates.includes(l.gate));
  centreVerticalMatrix[centreName] = {};

  for (const [vertName, planets] of Object.entries(VERTICALS)) {
    const E = centreLines.filter(l => planets.includes(l.exalt)).length;
    const D = centreLines.filter(l => planets.includes(l.detriment)).length;
    centreVerticalMatrix[centreName][vertName] = { E, D, ratio: E / (D || 1) };
  }
}

console.log('--- E/D RATIO BY CENTRE × VERTICAL ---\n');
console.log('| Centre | Gates | Alpha E/D | Beta E/D | Gamma E/D | Dominant |');
console.log('|--------|-------|-----------|----------|-----------|----------|');

for (const [centreName, verticals] of Object.entries(centreVerticalMatrix)) {
  const gateCount = CENTRES[centreName].length;
  const alphaR = verticals.alpha.ratio.toFixed(2);
  const betaR = verticals.beta.ratio.toFixed(2);
  const gammaR = verticals.gamma.ratio.toFixed(2);

  // Find dominant
  const maxRatio = Math.max(verticals.alpha.ratio, verticals.beta.ratio, verticals.gamma.ratio);
  let dominant = 'None';
  if (maxRatio > 1.3) {
    if (verticals.alpha.ratio === maxRatio) dominant = 'Alpha';
    else if (verticals.beta.ratio === maxRatio) dominant = 'Beta';
    else if (verticals.gamma.ratio === maxRatio) dominant = 'Gamma';
  }

  console.log(`| ${centreName.padEnd(6)} | ${gateCount.toString().padStart(5)} | ${alphaR.padStart(9)} | ${betaR.padStart(8)} | ${gammaR.padStart(9)} | ${dominant.padEnd(8)} |`);
}

// Brain special analysis
console.log('\n--- BRAIN CENTRE SPECIAL ANALYSIS ---\n');
const brainVerticals = {};
for (const [vertName, planets] of Object.entries(VERTICALS)) {
  const E = brainLines.filter(l => planets.includes(l.exalt)).length;
  const D = brainLines.filter(l => planets.includes(l.detriment)).length;
  brainVerticals[vertName] = { E, D, ratio: E / (D || 1) };
}

console.log('| Vertical | Brain Exalt | Brain Detriment | E/D Ratio |');
console.log('|----------|-------------|-----------------|-----------|');
for (const [vertName, result] of Object.entries(brainVerticals)) {
  console.log(`| ${vertName.padEnd(8)} | ${result.E.toString().padStart(11)} | ${result.D.toString().padStart(15)} | ${result.ratio.toFixed(2).padStart(9)} |`);
}

// Check if Alpha dominates Brain
const alphaVsBetaBrain = brainVerticals.alpha.ratio / (brainVerticals.beta.ratio || 1);
console.log(`\nAlpha vs Beta in Brain: ${alphaVsBetaBrain.toFixed(2)}x`);
console.log(`Result: ${alphaVsBetaBrain > 1.5 ? 'ALPHA DOMINATES BRAIN ✓' : 'NO ALPHA DOMINANCE'}`);

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n================================================================================');
console.log('COMPLETE MAGIC SQUARE ANALYSIS SUMMARY');
console.log('================================================================================\n');

console.log('| Test | Hypothesis | χ² | Threshold | Effect Size | Result |');
console.log('|------|------------|-----|-----------|-------------|--------|');

console.log(`| L1 | Lateral Character | ${lateralChi2.toFixed(2)} | 5.99 | N/A | ${lateralChi2 > 5.99 ? 'SIGNIFICANT' : 'NULL'} |`);
console.log(`| D1 | Diamond vs Diagonal | ${d1Chi2.toFixed(2)} | 3.84 | ${(diamondResult.ratio / diagonalResult.ratio).toFixed(2)} | ${d1Chi2 > 3.84 ? 'SIGNIFICANT' : 'NULL'} |`);
console.log(`| D2 | Main vs Anti Diag | ${d2Chi2.toFixed(2)} | 3.84 | ${(antiDiagResult.ratio / mainDiagResult.ratio).toFixed(2)} | ${d2Chi2 > 3.84 ? 'SIGNIFICANT' : 'NULL'} |`);
console.log(`| BS1 | Moon-Brain | ${bs1Chi2.toFixed(2)} | 3.84 | ${bs1EffectSize.toFixed(2)} | ${bs1Chi2 > 3.84 && bs1EffectSize > 1.3 ? 'SIGNIFICANT' : 'NULL'} |`);
console.log(`| BS1a | Moon-Brain-Alpha | N/A | N/A | ${bs1aEffectSize.toFixed(2)} | ${bs1aEffectSize > 1.3 ? 'ENHANCED' : 'NULL'} |`);
console.log(`| LN1 | Line 1/6 Nodal | ${ln1Chi2.toFixed(2)} | 3.84 | ${ln1EffectSize.toFixed(2)} | ${ln1Chi2 > 3.84 && ln1EffectSize > 1.3 ? 'SIGNIFICANT' : 'NULL'} |`);
console.log(`| C1 | Centre × Vertical | See matrix | Various | Brain α/β=${alphaVsBetaBrain.toFixed(2)} | ${alphaVsBetaBrain > 1.5 ? 'PATTERNS' : 'NULL'} |`);

// Count significant results
const significantTests = [
  lateralChi2 > 5.99,
  d1Chi2 > 3.84,
  d2Chi2 > 3.84,
  bs1Chi2 > 3.84 && bs1EffectSize > 1.3,
  bs1aEffectSize > 1.3,
  ln1Chi2 > 3.84 && ln1EffectSize > 1.3,
  alphaVsBetaBrain > 1.5
].filter(Boolean).length;

console.log(`\n=== SIGNIFICANT TESTS: ${significantTests}/7 ===\n`);

console.log('=== KEY FINDINGS ===\n');

if (lateralChi2 > 5.99) {
  console.log('✓ LATERALS show distinct character (Mind/Body/Spirit rows differ)');
} else {
  console.log('✗ Laterals do NOT show distinct character');
}

if (d1Chi2 > 3.84) {
  console.log('✓ DIAMOND vs DIAGONAL show different patterns');
  console.log(`  Diamond E/D = ${diamondResult.ratio.toFixed(2)}, Diagonal E/D = ${diagonalResult.ratio.toFixed(2)}`);
} else {
  console.log('✗ Diamond vs Diagonal do NOT differ');
}

if (d2Chi2 > 3.84) {
  console.log('✓ Main and Anti diagonals differ');
} else {
  console.log('✗ Main and Anti diagonals do NOT differ');
  console.log(`  Main (Moon/Mars/Pluto) E/D = ${mainDiagResult.ratio.toFixed(2)}`);
  console.log(`  Anti (Mercury/Mars/Saturn) E/D = ${antiDiagResult.ratio.toFixed(2)}`);
}

if (bs1Chi2 > 3.84 && bs1EffectSize > 1.3) {
  console.log('✓ MOON-BRAIN connection validated (Ra\'s teaching confirmed)');
} else {
  console.log('✗ Moon-Brain connection NOT significant');
  console.log(`  Moon in Brain E/D = ${moonBrain.ratio.toFixed(2)}, Non-Brain E/D = ${moonNonBrain.ratio.toFixed(2)}`);
}

if (alphaVsBetaBrain > 1.5) {
  console.log('✓ Alpha DOMINATES Brain centres');
} else {
  console.log('✗ Alpha does NOT dominate Brain');
}

console.log('\n=== END OF ANALYSIS ===\n');
