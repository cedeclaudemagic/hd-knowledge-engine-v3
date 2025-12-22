/**
 * LINE COLOR → PLANETARY EXALTATION ANALYSIS
 *
 * Testing whether Color bands (60° wheel segments) correlate with planetary assignments
 */

const fs = require('fs');
const path = require('path');

const basePath = '/Volumes/CLAUDE/HD-Knowledge-Engine-V3';
const linesData = JSON.parse(fs.readFileSync(path.join(basePath, 'knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json')));
const gateSequence = JSON.parse(fs.readFileSync(path.join(basePath, 'core/root-system/gate-sequence.json')));

// Build gate → wheel position mapping
const gateToPosition = {};
gateSequence.sequence.forEach((gate, idx) => {
  gateToPosition[gate] = idx;
});

// Calculate gate → degree
function gateToDegree(gate) {
  const position = gateToPosition[gate];
  return position * 5.625; // 360° / 64 gates = 5.625° per gate
}

// Calculate gate → Color band (1-6)
function gateToColorBand(gate) {
  const degree = gateToDegree(gate);
  // 360° / 6 Colors = 60° per Color band
  // Add small offset to handle edge cases
  return Math.floor(degree / 60) % 6 + 1;
}

// Magic Square verticals
const VERTICALS = {
  alpha: ['Moon', 'Venus', 'Saturn'],
  beta: ['Mercury', 'Mars', 'Jupiter'],
  gamma: ['Uranus', 'Neptune', 'Pluto']
};

function getVertical(planet) {
  if (VERTICALS.alpha.includes(planet)) return 'alpha';
  if (VERTICALS.beta.includes(planet)) return 'beta';
  if (VERTICALS.gamma.includes(planet)) return 'gamma';
  return 'excluded';
}

// Standing wave gates
const STANDING_WAVES = [1, 2, 29, 30, 51, 52, 57, 58];

console.log('================================================================================');
console.log('LINE COLOR → PLANETARY EXALTATION ANALYSIS');
console.log('================================================================================\n');

// Extract all assignments with Color band
const allLines = linesData.mappings;
const assignments = allLines.map(line => ({
  gate: line.gate,
  line: line.line,
  colorBand: gateToColorBand(line.gate),
  degree: gateToDegree(line.gate),
  exalt: line.source?.exaltation?.planet || 'None',
  detriment: line.source?.detriment?.planet || 'None',
  isStandingWave: STANDING_WAVES.includes(line.gate)
}));

// ============================================================================
// TEST 1: GATE-LEVEL COLOR BAND CORRELATION
// ============================================================================

console.log('================================================================================');
console.log('TEST 1: COLOR BAND → PLANET CORRELATION');
console.log('================================================================================\n');

// Build Color band × Planet matrix
const colorPlanetMatrix = {
  exalt: {},
  detriment: {}
};

for (let c = 1; c <= 6; c++) {
  colorPlanetMatrix.exalt[c] = {};
  colorPlanetMatrix.detriment[c] = {};
}

assignments.forEach(a => {
  if (a.exalt !== 'None') {
    colorPlanetMatrix.exalt[a.colorBand][a.exalt] = (colorPlanetMatrix.exalt[a.colorBand][a.exalt] || 0) + 1;
  }
  if (a.detriment !== 'None') {
    colorPlanetMatrix.detriment[a.colorBand][a.detriment] = (colorPlanetMatrix.detriment[a.colorBand][a.detriment] || 0) + 1;
  }
});

// Display matrix
console.log('--- EXALTATION BY COLOR BAND ---\n');

const planets = ['Moon', 'Venus', 'Saturn', 'Mercury', 'Mars', 'Jupiter', 'Uranus', 'Neptune', 'Pluto', 'Sun', 'Earth'];

console.log('| Color | ' + planets.map(p => p.substring(0, 4).padEnd(5)).join(' | ') + ' | Total |');
console.log('|-------|' + planets.map(() => '------').join('|') + '|-------|');

for (let c = 1; c <= 6; c++) {
  const row = colorPlanetMatrix.exalt[c];
  const counts = planets.map(p => (row[p] || 0).toString().padStart(5));
  const total = planets.reduce((sum, p) => sum + (row[p] || 0), 0);
  console.log(`| ${c}     | ${counts.join(' | ')} | ${total.toString().padStart(5)} |`);
}

// Chi-square test for independence
console.log('\n--- CHI-SQUARE TEST: COLOR BAND × PLANET INDEPENDENCE ---\n');

// Calculate expected values and chi-square
let totalExalt = 0;
const colorTotals = {};
const planetTotals = {};

for (let c = 1; c <= 6; c++) {
  colorTotals[c] = 0;
  planets.forEach(p => {
    const count = colorPlanetMatrix.exalt[c][p] || 0;
    colorTotals[c] += count;
    planetTotals[p] = (planetTotals[p] || 0) + count;
    totalExalt += count;
  });
}

let chi2 = 0;
for (let c = 1; c <= 6; c++) {
  planets.forEach(p => {
    const observed = colorPlanetMatrix.exalt[c][p] || 0;
    const expected = (colorTotals[c] * planetTotals[p]) / totalExalt;
    if (expected > 0) {
      chi2 += Math.pow(observed - expected, 2) / expected;
    }
  });
}

const df = (6 - 1) * (planets.length - 1);
console.log(`Chi-square statistic: ${chi2.toFixed(2)}`);
console.log(`Degrees of freedom: ${df}`);
console.log(`Critical value (α=0.05): ~${(df + Math.sqrt(2 * df)).toFixed(0)} (approximate)`);
console.log(`Result: ${chi2 > (df + Math.sqrt(2 * df)) ? 'SIGNIFICANT' : 'NOT SIGNIFICANT'}`);

// ============================================================================
// TEST 2: VERTICAL × COLOR INTERACTION
// ============================================================================

console.log('\n================================================================================');
console.log('TEST 2: VERTICAL × COLOR BAND INTERACTION');
console.log('================================================================================\n');

const verticalColorMatrix = {};
for (let c = 1; c <= 6; c++) {
  verticalColorMatrix[c] = {
    alpha: { exalt: 0, det: 0 },
    beta: { exalt: 0, det: 0 },
    gamma: { exalt: 0, det: 0 }
  };
}

assignments.forEach(a => {
  const exVert = getVertical(a.exalt);
  const detVert = getVertical(a.detriment);

  if (exVert !== 'excluded') {
    verticalColorMatrix[a.colorBand][exVert].exalt++;
  }
  if (detVert !== 'excluded') {
    verticalColorMatrix[a.colorBand][detVert].det++;
  }
});

console.log('--- E/D RATIO BY VERTICAL AND COLOR BAND ---\n');
console.log('| Color | Alpha E/D | Beta E/D | Gamma E/D | Alpha% | Beta% | Gamma% |');
console.log('|-------|-----------|----------|-----------|--------|-------|--------|');

for (let c = 1; c <= 6; c++) {
  const v = verticalColorMatrix[c];
  const alphaRatio = v.alpha.det > 0 ? (v.alpha.exalt / v.alpha.det).toFixed(2) : 'Inf';
  const betaRatio = v.beta.det > 0 ? (v.beta.exalt / v.beta.det).toFixed(2) : 'Inf';
  const gammaRatio = v.gamma.det > 0 ? (v.gamma.exalt / v.gamma.det).toFixed(2) : 'Inf';

  const totalExalt = v.alpha.exalt + v.beta.exalt + v.gamma.exalt;
  const alphaP = totalExalt > 0 ? (v.alpha.exalt / totalExalt * 100).toFixed(0) : '0';
  const betaP = totalExalt > 0 ? (v.beta.exalt / totalExalt * 100).toFixed(0) : '0';
  const gammaP = totalExalt > 0 ? (v.gamma.exalt / totalExalt * 100).toFixed(0) : '0';

  console.log(`| ${c}     | ${alphaRatio.padStart(9)} | ${betaRatio.padStart(8)} | ${gammaRatio.padStart(9)} | ${alphaP.padStart(6)}% | ${betaP.padStart(5)}% | ${gammaP.padStart(6)}% |`);
}

// ============================================================================
// TEST 3: HARMONIC PAIR CLUSTERING
// ============================================================================

console.log('\n================================================================================');
console.log('TEST 3: HARMONIC PAIR CLUSTERING');
console.log('================================================================================\n');

// Harmonic pairs: 1↔4, 2↔5, 3↔6
const harmonicPairs = [[1, 4], [2, 5], [3, 6]];

console.log('Testing if planets appearing in Color N also appear in Color N±3 (harmonic)...\n');

// For each planet, count appearances in each Color band
const planetColorCounts = {};
planets.forEach(p => {
  planetColorCounts[p] = [0, 0, 0, 0, 0, 0]; // Colors 1-6
});

assignments.forEach(a => {
  if (a.exalt !== 'None') {
    planetColorCounts[a.exalt][a.colorBand - 1]++;
  }
});

// Calculate harmonic correlation
console.log('| Planet | C1 | C2 | C3 | C4 | C5 | C6 | Harm1-4 | Harm2-5 | Harm3-6 |');
console.log('|--------|----|----|----|----|----|----|---------|---------|---------|');

planets.forEach(p => {
  const counts = planetColorCounts[p];
  const harm14 = Math.min(counts[0], counts[3]) > 0 ? 'YES' : 'NO';
  const harm25 = Math.min(counts[1], counts[4]) > 0 ? 'YES' : 'NO';
  const harm36 = Math.min(counts[2], counts[5]) > 0 ? 'YES' : 'NO';

  console.log(`| ${p.padEnd(6)} | ${counts[0].toString().padStart(2)} | ${counts[1].toString().padStart(2)} | ${counts[2].toString().padStart(2)} | ${counts[3].toString().padStart(2)} | ${counts[4].toString().padStart(2)} | ${counts[5].toString().padStart(2)} | ${harm14.padStart(7)} | ${harm25.padStart(7)} | ${harm36.padStart(7)} |`);
});

// Count harmonic vs non-harmonic co-occurrences
let harmonicCount = 0;
let nonHarmonicCount = 0;

planets.forEach(p => {
  const counts = planetColorCounts[p];
  // Harmonic pairs
  if (counts[0] > 0 && counts[3] > 0) harmonicCount++;
  if (counts[1] > 0 && counts[4] > 0) harmonicCount++;
  if (counts[2] > 0 && counts[5] > 0) harmonicCount++;

  // Non-harmonic pairs
  for (let i = 0; i < 6; i++) {
    for (let j = i + 1; j < 6; j++) {
      if (Math.abs(i - j) !== 3 && counts[i] > 0 && counts[j] > 0) {
        nonHarmonicCount++;
      }
    }
  }
});

console.log(`\nHarmonic co-occurrences: ${harmonicCount}`);
console.log(`Non-harmonic co-occurrences: ${nonHarmonicCount}`);
console.log(`Harmonic ratio: ${(harmonicCount / (harmonicCount + nonHarmonicCount) * 100).toFixed(1)}%`);
console.log(`Expected if random: ~20% (3 harmonic pairs out of 15 possible pairs)`);

// ============================================================================
// TEST 4: STANDING WAVE COLOR BANDS
// ============================================================================

console.log('\n================================================================================');
console.log('TEST 4: STANDING WAVE COLOR BANDS');
console.log('================================================================================\n');

console.log('--- STANDING WAVE POSITIONS AND COLOR BANDS ---\n');
console.log('| Gate | Wheel Pos | Degree | Color Band |');
console.log('|------|-----------|--------|------------|');

STANDING_WAVES.forEach(gate => {
  const pos = gateToPosition[gate];
  const deg = gateToDegree(gate);
  const color = gateToColorBand(gate);
  console.log(`| ${gate.toString().padStart(4)} | ${pos.toString().padStart(9)} | ${deg.toFixed(1).padStart(6)}° | ${color.toString().padStart(10)} |`);
});

// Count standing waves per Color band
const swByColor = [0, 0, 0, 0, 0, 0];
STANDING_WAVES.forEach(gate => {
  swByColor[gateToColorBand(gate) - 1]++;
});

console.log('\n--- STANDING WAVE DISTRIBUTION BY COLOR BAND ---\n');
for (let c = 1; c <= 6; c++) {
  console.log(`Color ${c}: ${swByColor[c - 1]} standing waves`);
}

// ============================================================================
// ADDITIONAL ANALYSIS: SPECIFIC PLANET-COLOR AFFINITIES
// ============================================================================

console.log('\n================================================================================');
console.log('ADDITIONAL: PLANET-SPECIFIC COLOR AFFINITIES');
console.log('================================================================================\n');

// For each planet, find its strongest and weakest Color bands
planets.forEach(planet => {
  const counts = planetColorCounts[planet];
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) return;

  const maxIdx = counts.indexOf(Math.max(...counts));
  const minIdx = counts.indexOf(Math.min(...counts));

  console.log(`${planet}:`);
  console.log(`  Distribution: C1=${counts[0]}, C2=${counts[1]}, C3=${counts[2]}, C4=${counts[3]}, C5=${counts[4]}, C6=${counts[5]}`);
  console.log(`  Best: Color ${maxIdx + 1} (${counts[maxIdx]} exaltations)`);
  console.log(`  Worst: Color ${minIdx + 1} (${counts[minIdx]} exaltations)`);
});

// ============================================================================
// SYNTHESIS
// ============================================================================

console.log('\n================================================================================');
console.log('SYNTHESIS: COLOR BAND FINDINGS');
console.log('================================================================================\n');

// Check if any Color band shows significant deviation
console.log('| Color | Total Exalt | Expected | Deviation |');
console.log('|-------|-------------|----------|-----------|');

const expectedPerColor = totalExalt / 6;
for (let c = 1; c <= 6; c++) {
  const deviation = ((colorTotals[c] - expectedPerColor) / expectedPerColor * 100).toFixed(1);
  console.log(`| ${c}     | ${colorTotals[c].toString().padStart(11)} | ${expectedPerColor.toFixed(0).padStart(8)} | ${deviation.padStart(9)}% |`);
}

console.log('\n=== CONCLUSION ===\n');

// Determine if significant
const maxDeviation = Math.max(...Object.values(colorTotals).map(v => Math.abs(v - expectedPerColor)));
const significantDeviation = maxDeviation > expectedPerColor * 0.2; // 20% threshold

if (significantDeviation) {
  console.log('Color bands show SIGNIFICANT variation in exaltation counts.');
  console.log('Color resonance may be a factor in planetary assignments.');
} else {
  console.log('Color bands show EVEN distribution of exaltations.');
  console.log('Color resonance does NOT appear to be a major factor.');
}

console.log('\n=== END OF ANALYSIS ===\n');
