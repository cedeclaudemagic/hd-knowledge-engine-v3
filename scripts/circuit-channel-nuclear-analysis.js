/**
 * CIRCUIT, CHANNEL & NUCLEAR HEXAGRAM ANALYSIS
 *
 * Final test battery for planetary derivation:
 * - CV1: Circuit × Vertical interaction
 * - CP1: Channel partnership correlation
 * - NH1: Nuclear hexagram structure
 *
 * NOTE: Using VALIDATED verticals:
 * - Alpha: Moon, Venus, Saturn
 * - Beta: Mercury, Mars, Jupiter
 * - Gamma: Uranus, Neptune, Pluto
 */

const fs = require('fs');
const path = require('path');

const basePath = '/Volumes/CLAUDE/HD-Knowledge-Engine-V3';
const linesData = JSON.parse(fs.readFileSync(path.join(basePath, 'knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json')));

// ============================================================================
// MAGIC SQUARE VERTICALS (VALIDATED)
// ============================================================================

const VERTICALS = {
  alpha: ['Moon', 'Venus', 'Saturn'],
  beta: ['Mercury', 'Mars', 'Jupiter'],
  gamma: ['Uranus', 'Neptune', 'Pluto']
};

function getVertical(planet) {
  if (VERTICALS.alpha.includes(planet)) return 'alpha';
  if (VERTICALS.beta.includes(planet)) return 'beta';
  if (VERTICALS.gamma.includes(planet)) return 'gamma';
  return null; // Sun, Earth, Nodes
}

// ============================================================================
// CIRCUIT DEFINITIONS
// ============================================================================

// Integration Circuit (Self - connects to all)
const INTEGRATION = [10, 20, 34, 57];

// Individual Circuits
const KNOWING = [61, 24, 43, 23, 8, 1, 2, 14, 3, 60];
const CENTERING = [51, 25, 46, 29]; // 10, 20, 34, 57 are Integration

// Collective Circuits
const UNDERSTANDING = [63, 4, 17, 62, 16, 48, 18, 58, 52, 9, 5, 15, 7, 31];
const SENSING = [64, 47, 11, 56, 33, 13, 30, 41, 35, 36, 22, 12];

// Tribal Circuits
const EGO = [45, 21, 26, 44, 32, 54, 19, 49, 37, 40];
const DEFENSE = [27, 50, 59, 6];

// Combined circuit assignments (primary)
const INDIVIDUAL_GATES = [...new Set([...KNOWING, ...CENTERING])];
const COLLECTIVE_GATES = [...new Set([...UNDERSTANDING, ...SENSING])];
const TRIBAL_GATES = [...new Set([...EGO, ...DEFENSE])];

// ============================================================================
// CHANNEL DEFINITIONS (36 Channels)
// ============================================================================

const CHANNELS = [
  [1, 8, 'Inspiration'],
  [2, 14, 'The Beat'],
  [3, 60, 'Mutation'],
  [4, 63, 'Logic'],
  [5, 15, 'Rhythm'],
  [6, 59, 'Intimacy'],
  [7, 31, 'Alpha'],
  [9, 52, 'Concentration'],
  [10, 20, 'Awakening'],
  [10, 34, 'Exploration'],
  [10, 57, 'Perfected Form'],
  [11, 56, 'Curiosity'],
  [12, 22, 'Openness'],
  [13, 33, 'Prodigal'],
  [16, 48, 'Wavelength'],
  [17, 62, 'Acceptance'],
  [18, 58, 'Judgment'],
  [19, 49, 'Synthesis'],
  [20, 34, 'Charisma'],
  [20, 57, 'Brainwave'],
  [21, 45, 'Money'],
  [23, 43, 'Structuring'],
  [24, 61, 'Awareness'],
  [25, 51, 'Initiation'],
  [26, 44, 'Surrender'],
  [27, 50, 'Preservation'],
  [28, 38, 'Struggle'],
  [29, 46, 'Discovery'],
  [30, 41, 'Recognition'],
  [32, 54, 'Transformation'],
  [34, 57, 'Power'],
  [35, 36, 'Transitoriness'],
  [37, 40, 'Community'],
  [39, 55, 'Emoting'],
  [42, 53, 'Maturation'],
  [47, 64, 'Abstraction']
];

// ============================================================================
// HEXAGRAM BINARY MAPPINGS (Gate → Binary)
// ============================================================================

// Standard I Ching binary mapping (lines from bottom to top)
const GATE_TO_BINARY = {
  1: '111111', 2: '000000', 3: '010001', 4: '100010', 5: '010111', 6: '111010',
  7: '000010', 8: '010000', 9: '110111', 10: '110111', 11: '000111', 12: '111000',
  13: '111101', 14: '101111', 15: '000100', 16: '100000', 17: '011001', 18: '100110',
  19: '000011', 20: '110000', 21: '101001', 22: '101100', 23: '100000', 24: '000001',
  25: '111001', 26: '100111', 27: '100001', 28: '011110', 29: '010010', 30: '101101',
  31: '011100', 32: '001110', 33: '111100', 34: '001111', 35: '101000', 36: '000101',
  37: '110101', 38: '101011', 39: '010100', 40: '001010', 41: '100011', 42: '110001',
  43: '011111', 44: '111110', 45: '011000', 46: '000110', 47: '011010', 48: '010110',
  49: '011101', 50: '101110', 51: '100100', 52: '001001', 53: '110100', 54: '001011',
  55: '001101', 56: '110010', 57: '011011', 58: '110110', 59: '110010', 60: '010011',
  61: '110011', 62: '001100', 63: '010101', 64: '101010'
};

// Calculate nuclear hexagram from binary
function calculateNuclear(binary) {
  // Lines 2,3,4 form lower nuclear trigram
  // Lines 3,4,5 form upper nuclear trigram
  const lowerNuclear = binary[1] + binary[2] + binary[3]; // indices 1,2,3
  const upperNuclear = binary[2] + binary[3] + binary[4]; // indices 2,3,4
  return lowerNuclear + upperNuclear;
}

// Binary to gate number (reverse lookup)
const BINARY_TO_GATE = {};
for (const [gate, binary] of Object.entries(GATE_TO_BINARY)) {
  BINARY_TO_GATE[binary] = parseInt(gate);
}

// Build gate → nuclear mapping
const GATE_TO_NUCLEAR = {};
for (let gate = 1; gate <= 64; gate++) {
  const binary = GATE_TO_BINARY[gate];
  if (binary) {
    const nuclearBinary = calculateNuclear(binary);
    GATE_TO_NUCLEAR[gate] = BINARY_TO_GATE[nuclearBinary] || nuclearBinary;
  }
}

// ============================================================================
// DATA PREPARATION
// ============================================================================

const allLines = linesData.mappings.map(line => ({
  gate: line.gate,
  line: line.line,
  exalt: line.source?.exaltation?.planet || 'None',
  detriment: line.source?.detriment?.planet || 'None'
}));

// ============================================================================
// TEST CV1: CIRCUIT × VERTICAL
// ============================================================================

console.log('================================================================================');
console.log('TEST CV1: CIRCUIT × VERTICAL');
console.log('================================================================================\n');

const circuitResults = {
  individual: { alpha: {E:0, D:0}, beta: {E:0, D:0}, gamma: {E:0, D:0}, lines: 0 },
  tribal: { alpha: {E:0, D:0}, beta: {E:0, D:0}, gamma: {E:0, D:0}, lines: 0 },
  collective: { alpha: {E:0, D:0}, beta: {E:0, D:0}, gamma: {E:0, D:0}, lines: 0 }
};

for (const line of allLines) {
  let circuit = null;
  if (INDIVIDUAL_GATES.includes(line.gate)) circuit = 'individual';
  else if (TRIBAL_GATES.includes(line.gate)) circuit = 'tribal';
  else if (COLLECTIVE_GATES.includes(line.gate)) circuit = 'collective';

  if (circuit) {
    circuitResults[circuit].lines++;
    const exaltVert = getVertical(line.exalt);
    const detVert = getVertical(line.detriment);

    if (exaltVert) circuitResults[circuit][exaltVert].E++;
    if (detVert) circuitResults[circuit][detVert].D++;
  }
}

// Calculate ratios
for (const circuit of Object.values(circuitResults)) {
  circuit.alpha.ratio = circuit.alpha.E / (circuit.alpha.D || 1);
  circuit.beta.ratio = circuit.beta.E / (circuit.beta.D || 1);
  circuit.gamma.ratio = circuit.gamma.E / (circuit.gamma.D || 1);
}

console.log(`Individual gates: ${INDIVIDUAL_GATES.length}, Lines: ${circuitResults.individual.lines}`);
console.log(`Tribal gates: ${TRIBAL_GATES.length}, Lines: ${circuitResults.tribal.lines}`);
console.log(`Collective gates: ${COLLECTIVE_GATES.length}, Lines: ${circuitResults.collective.lines}\n`);

console.log('| Circuit | Alpha E/D | Beta E/D | Gamma E/D | Alpha% | Beta% | Gamma% |');
console.log('|---------|-----------|----------|-----------|--------|-------|--------|');

for (const [name, circuit] of Object.entries(circuitResults)) {
  const totalE = circuit.alpha.E + circuit.beta.E + circuit.gamma.E;
  const alphaP = totalE > 0 ? (circuit.alpha.E / totalE * 100).toFixed(0) : '0';
  const betaP = totalE > 0 ? (circuit.beta.E / totalE * 100).toFixed(0) : '0';
  const gammaP = totalE > 0 ? (circuit.gamma.E / totalE * 100).toFixed(0) : '0';

  console.log(`| ${name.padEnd(7)} | ${circuit.alpha.ratio.toFixed(2).padStart(9)} | ${circuit.beta.ratio.toFixed(2).padStart(8)} | ${circuit.gamma.ratio.toFixed(2).padStart(9)} | ${alphaP.padStart(6)}% | ${betaP.padStart(5)}% | ${gammaP.padStart(6)}% |`);
}

// Chi-square for Circuit × Vertical
const cv1Observed = [];
for (const circuit of Object.values(circuitResults)) {
  cv1Observed.push([circuit.alpha.E, circuit.beta.E, circuit.gamma.E]);
}

function chiSquare3x3(observed) {
  const rowTotals = observed.map(row => row.reduce((a, b) => a + b, 0));
  const colTotals = [0, 0, 0];
  for (const row of observed) {
    colTotals[0] += row[0];
    colTotals[1] += row[1];
    colTotals[2] += row[2];
  }
  const n = rowTotals.reduce((a, b) => a + b, 0);

  let chi2 = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const expected = (rowTotals[i] * colTotals[j]) / n;
      if (expected > 0) {
        chi2 += Math.pow(observed[i][j] - expected, 2) / expected;
      }
    }
  }
  return chi2;
}

const cv1Chi2 = chiSquare3x3(cv1Observed);
console.log(`\nChi-square (3×3): ${cv1Chi2.toFixed(2)}`);
console.log(`Critical value (df=4, α=0.05): 9.49`);
console.log(`Result: ${cv1Chi2 > 9.49 ? 'SIGNIFICANT ✓' : 'NOT SIGNIFICANT'}`);

// ============================================================================
// TEST CP1: CHANNEL PARTNERSHIP ANALYSIS
// ============================================================================

console.log('\n================================================================================');
console.log('TEST CP1: CHANNEL PARTNERSHIP ANALYSIS');
console.log('================================================================================\n');

const channelResults = [];
let sameVertExalt = 0;
let sameVertDetriment = 0;
let totalPairs = 0;

for (const [gate1, gate2, name] of CHANNELS) {
  for (let lineNum = 1; lineNum <= 6; lineNum++) {
    const line1 = allLines.find(l => l.gate === gate1 && l.line === lineNum);
    const line2 = allLines.find(l => l.gate === gate2 && l.line === lineNum);

    if (line1 && line2) {
      const vert1Exalt = getVertical(line1.exalt);
      const vert2Exalt = getVertical(line2.exalt);
      const vert1Det = getVertical(line1.detriment);
      const vert2Det = getVertical(line2.detriment);

      const sameExalt = vert1Exalt && vert2Exalt && vert1Exalt === vert2Exalt;
      const sameDet = vert1Det && vert2Det && vert1Det === vert2Det;

      if (vert1Exalt && vert2Exalt) {
        totalPairs++;
        if (sameExalt) sameVertExalt++;
      }
      if (vert1Det && vert2Det) {
        if (sameDet) sameVertDetriment++;
      }

      channelResults.push({
        channel: name,
        line: lineNum,
        gate1, gate2,
        exalt1: line1.exalt, exalt2: line2.exalt,
        det1: line1.detriment, det2: line2.detriment,
        sameVertExalt: sameExalt,
        sameVertDet: sameDet
      });
    }
  }
}

const sameExaltRate = totalPairs > 0 ? (sameVertExalt / totalPairs * 100) : 0;
const expectedRate = 33.3;

console.log(`Total line pairs in channels: ${channelResults.length}`);
console.log(`Pairs with both exalt planets having Vertical: ${totalPairs}\n`);

console.log('| Metric | Observed | Expected | Difference |');
console.log('|--------|----------|----------|------------|');
console.log(`| Same Vertical (Exalt) | ${sameExaltRate.toFixed(1)}% | ${expectedRate}% | ${(sameExaltRate - expectedRate).toFixed(1)}pp |`);

// Chi-square for same-vertical vs different
const observedSame = sameVertExalt;
const observedDiff = totalPairs - sameVertExalt;
const expectedSame = totalPairs / 3;
const expectedDiff = totalPairs * 2 / 3;

const cp1Chi2 = Math.pow(observedSame - expectedSame, 2) / expectedSame +
                Math.pow(observedDiff - expectedDiff, 2) / expectedDiff;

console.log(`\nChi-square (same vs different): ${cp1Chi2.toFixed(2)}`);
console.log(`Critical value (df=1, α=0.05): 3.84`);
console.log(`Result: ${cp1Chi2 > 3.84 ? 'SIGNIFICANT ✓' : 'NOT SIGNIFICANT'}`);

// Show some example channels
console.log('\n--- SAMPLE CHANNEL PAIRS ---\n');
const sampleChannels = channelResults.filter(r => r.line === 1).slice(0, 10);
console.log('| Channel | Gate1 Exalt | Gate2 Exalt | Same Vert |');
console.log('|---------|-------------|-------------|-----------|');
for (const r of sampleChannels) {
  const vert1 = getVertical(r.exalt1) || '-';
  const vert2 = getVertical(r.exalt2) || '-';
  console.log(`| ${r.channel.padEnd(7).substring(0, 12)} | ${(r.exalt1 + ' (' + vert1[0] + ')').padEnd(11)} | ${(r.exalt2 + ' (' + vert2[0] + ')').padEnd(11)} | ${r.sameVertExalt ? 'YES' : 'NO'.padStart(9)} |`);
}

// ============================================================================
// TEST NH1: NUCLEAR HEXAGRAM STRUCTURE
// ============================================================================

console.log('\n================================================================================');
console.log('TEST NH1: NUCLEAR HEXAGRAM STRUCTURE');
console.log('================================================================================\n');

// Group gates by nuclear hexagram
const nuclearGroups = {};
for (let gate = 1; gate <= 64; gate++) {
  const nuclear = GATE_TO_NUCLEAR[gate];
  if (!nuclearGroups[nuclear]) {
    nuclearGroups[nuclear] = {
      gates: [],
      alpha: {E: 0, D: 0},
      beta: {E: 0, D: 0},
      gamma: {E: 0, D: 0},
      total: {E: 0, D: 0}
    };
  }
  nuclearGroups[nuclear].gates.push(gate);
}

// Count E/D by nuclear group
for (const line of allLines) {
  const nuclear = GATE_TO_NUCLEAR[line.gate];
  if (nuclear && nuclearGroups[nuclear]) {
    const group = nuclearGroups[nuclear];
    const exaltVert = getVertical(line.exalt);
    const detVert = getVertical(line.detriment);

    if (exaltVert) {
      group[exaltVert].E++;
      group.total.E++;
    }
    if (detVert) {
      group[detVert].D++;
      group.total.D++;
    }
  }
}

// Calculate ratios
for (const group of Object.values(nuclearGroups)) {
  group.alpha.ratio = group.alpha.E / (group.alpha.D || 1);
  group.beta.ratio = group.beta.E / (group.beta.D || 1);
  group.gamma.ratio = group.gamma.E / (group.gamma.D || 1);
  group.total.ratio = group.total.E / (group.total.D || 1);
}

// Sort by total E/D ratio
const sortedNuclears = Object.entries(nuclearGroups)
  .sort((a, b) => b[1].total.ratio - a[1].total.ratio);

console.log('| Nuclear | Gates | Total E | Total D | E/D Ratio | Alpha E/D | Beta E/D | Gamma E/D |');
console.log('|---------|-------|---------|---------|-----------|-----------|----------|-----------|');

for (const [nuclear, group] of sortedNuclears) {
  const nuclearName = typeof nuclear === 'number' ? `Gate ${nuclear}` : nuclear;
  console.log(`| ${String(nuclear).padEnd(7)} | ${group.gates.length.toString().padStart(5)} | ${group.total.E.toString().padStart(7)} | ${group.total.D.toString().padStart(7)} | ${group.total.ratio.toFixed(2).padStart(9)} | ${group.alpha.ratio.toFixed(2).padStart(9)} | ${group.beta.ratio.toFixed(2).padStart(8)} | ${group.gamma.ratio.toFixed(2).padStart(9)} |`);
}

// Calculate variance in E/D ratios
const ratios = sortedNuclears.map(([_, g]) => g.total.ratio);
const meanRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
const variance = ratios.reduce((sum, r) => sum + Math.pow(r - meanRatio, 2), 0) / ratios.length;
const stdDev = Math.sqrt(variance);

console.log(`\nMean E/D ratio: ${meanRatio.toFixed(2)}`);
console.log(`Std deviation: ${stdDev.toFixed(2)}`);
console.log(`Coefficient of variation: ${(stdDev / meanRatio * 100).toFixed(1)}%`);

// Count outliers (>1.5 or <0.67)
const highOutliers = sortedNuclears.filter(([_, g]) => g.total.ratio > 1.5);
const lowOutliers = sortedNuclears.filter(([_, g]) => g.total.ratio < 0.67);

console.log(`\nHigh outliers (E/D > 1.5): ${highOutliers.length}`);
console.log(`Low outliers (E/D < 0.67): ${lowOutliers.length}`);

// Simple variance test - compare to expected if uniform
const expectedRatio = 1.0; // If random, E ≈ D
const deviations = sortedNuclears.map(([_, g]) => Math.abs(g.total.ratio - expectedRatio));
const avgDeviation = deviations.reduce((a, b) => a + b, 0) / deviations.length;

console.log(`\nAverage deviation from 1.0: ${avgDeviation.toFixed(2)}`);
console.log(`Result: ${avgDeviation > 0.3 ? 'VARIATION DETECTED' : 'NO SIGNIFICANT VARIATION'}`);

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n================================================================================');
console.log('FINAL SUMMARY: CIRCUIT, CHANNEL, NUCLEAR ANALYSIS');
console.log('================================================================================\n');

console.log('| Test | Hypothesis | Statistic | Threshold | Result |');
console.log('|------|------------|-----------|-----------|--------|');
console.log(`| CV1 | Circuit × Vertical | χ²=${cv1Chi2.toFixed(2)} | 9.49 | ${cv1Chi2 > 9.49 ? 'SIGNIFICANT' : 'NULL'} |`);
console.log(`| CP1 | Channel Partnerships | ${sameExaltRate.toFixed(1)}% same | 33%±10pp | ${Math.abs(sameExaltRate - 33.3) > 10 ? 'SIGNIFICANT' : 'NULL'} |`);
console.log(`| NH1 | Nuclear Structure | CV=${(stdDev/meanRatio*100).toFixed(1)}% | >30% | ${(stdDev/meanRatio*100) > 30 ? 'VARIATION' : 'NULL'} |`);

const significantTests = [
  cv1Chi2 > 9.49,
  Math.abs(sameExaltRate - 33.3) > 10,
  (stdDev/meanRatio*100) > 30
].filter(Boolean).length;

console.log(`\n=== SIGNIFICANT TESTS: ${significantTests}/3 ===\n`);

if (significantTests === 0) {
  console.log('=== CONCLUSION: ALL TESTS NULL ===\n');
  console.log('The ~40% derivation boundary is CONFIRMED as the true limit.');
  console.log('Circuit, Channel, and Nuclear structure do NOT explain additional variance.');
  console.log('Planetary assignment beyond standing waves is TRANSMISSION content.');
} else {
  console.log('=== CONCLUSION: SIGNAL DETECTED ===\n');
  console.log('Further investigation warranted for significant tests.');
}

console.log('\n=== END OF ANALYSIS ===\n');
