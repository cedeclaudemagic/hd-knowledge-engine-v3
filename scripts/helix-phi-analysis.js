/**
 * Investigation 4: 88° Helix Spin
 * Investigation 5: Phi Spiral Dynamics
 */

const fs = require('fs');
const path = require('path');

// Load data
const hdGatesPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const ichingPath = path.join(__dirname, '../knowledge-systems/iching-names/mappings/iching-names-mappings.json');
const trigramsPath = path.join(__dirname, '../knowledge-systems/trigrams/mappings/trigrams-mappings.json');

const hdGates = JSON.parse(fs.readFileSync(hdGatesPath, 'utf8'));
const iching = JSON.parse(fs.readFileSync(ichingPath, 'utf8'));
const trigrams = JSON.parse(fs.readFileSync(trigramsPath, 'utf8'));

// Build trigram lookup
const trigramData = {};
trigrams.mappings.forEach(m => {
  const binary = m.binaryPattern;
  const yangCount = binary.split('').filter(b => b === '1').length;
  trigramData[m.groupName] = { binary, yangCount };
});

// Classify gate EM type
function classifyGate(upperTrigram, lowerTrigram) {
  if (upperTrigram === lowerTrigram) return 'STANDING_WAVE';
  const upper = trigramData[upperTrigram];
  const lower = trigramData[lowerTrigram];
  if (!upper || !lower) return 'UNKNOWN';
  const upperDomain = upper.yangCount >= 2 ? 'VOID' : 'MATERIAL';
  const lowerDomain = lower.yangCount >= 2 ? 'VOID' : 'MATERIAL';
  if (upperDomain !== lowerDomain) {
    return lowerDomain === 'VOID' ? 'CROSS_ZERO_MANIFESTING' : 'CROSS_ZERO_DEMATERIALISING';
  }
  return `SAME_PHASE_${upperDomain}`;
}

// Build gate data
const gateData = {};
iching.mappings.forEach(m => {
  const upper = m.knowledge.trigrams.upper;
  const lower = m.knowledge.trigrams.lower;
  gateData[m.gateNumber] = {
    upper, lower,
    emType: classifyGate(upper, lower)
  };
});

// Build line data
const lineData = [];
hdGates.mappings.forEach(m => {
  let exaltPlanet = 'None';
  if (m.knowledge.blackBook?.exaltation?.planets?.[0]) {
    exaltPlanet = m.knowledge.blackBook.exaltation.planets[0].planet;
  }
  const gate = gateData[m.gateNumber];
  lineData.push({
    gate: m.gateNumber,
    line: m.lineNumber,
    exaltPlanet,
    emType: gate?.emType || 'UNKNOWN'
  });
});

// Wheel sequence
const wheelSequence = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
  27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
  28, 44, 1, 9, 14, 43, 34, 26, 5, 11, 10, 58, 38, 54, 61, 60
];

// Constants
const PHI = (1 + Math.sqrt(5)) / 2; // 1.618...
const GOLDEN_ANGLE = 360 / (PHI * PHI); // ~137.508°

console.log('='.repeat(80));
console.log('INVESTIGATION 4: 88° HELIX SPIN');
console.log('='.repeat(80));

// ==========================================================================
// Investigation 4: 88° Offset Analysis
// ==========================================================================

console.log('\n--- THE 88° OFFSET MODEL ---\n');
console.log('Design crystal at phase 0°');
console.log('Personality crystal at phase 88°');
console.log('88° / 5.625° per gate = 15.64 gates offset');
console.log('');

// Calculate which gates align and oppose at 88°
const OFFSET_GATES = 88 / 5.625; // ~15.64 gates

console.log('For each gate position, the 88° offset creates:');
console.log('- Design at position N');
console.log('- Personality at position N + 15.64 (mod 64)');
console.log('');

// Classify planets as personal vs transpersonal
const personalPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
const transpersonalPlanets = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

// For each gate, calculate its "helix strand" based on position parity
// Strand A: positions 0-31 (first half)
// Strand B: positions 32-63 (second half)

const strandAnalysis = { A: {}, B: {} };
personalPlanets.concat(transpersonalPlanets).forEach(p => {
  strandAnalysis.A[p] = 0;
  strandAnalysis.B[p] = 0;
});

lineData.forEach(l => {
  const pos = wheelSequence.indexOf(l.gate);
  if (pos === -1) return;
  const strand = pos < 32 ? 'A' : 'B';
  if (strandAnalysis[strand][l.exaltPlanet] !== undefined) {
    strandAnalysis[strand][l.exaltPlanet]++;
  }
});

console.log('--- HELIX STRAND DISTRIBUTION (Position-based) ---\n');
console.log('| Planet     | Strand A (0-31) | Strand B (32-63) | Ratio A/B |');
console.log('|------------|-----------------|------------------|-----------|');

const allPlanets = personalPlanets.concat(transpersonalPlanets);
allPlanets.forEach(p => {
  const a = strandAnalysis.A[p];
  const b = strandAnalysis.B[p];
  const ratio = b > 0 ? (a / b).toFixed(2) : 'N/A';
  console.log(`| ${p.padEnd(10)} | ${a.toString().padStart(15)} | ${b.toString().padStart(16)} | ${ratio.toString().padStart(9)} |`);
});

// Test personal vs transpersonal clustering
console.log('\n--- PERSONAL vs TRANSPERSONAL STRAND CLUSTERING ---\n');

let personalA = 0, personalB = 0;
let transpersonalA = 0, transpersonalB = 0;

personalPlanets.forEach(p => {
  personalA += strandAnalysis.A[p];
  personalB += strandAnalysis.B[p];
});
transpersonalPlanets.forEach(p => {
  transpersonalA += strandAnalysis.A[p];
  transpersonalB += strandAnalysis.B[p];
});

console.log('| Category       | Strand A | Strand B | % in A |');
console.log('|----------------|----------|----------|--------|');
console.log(`| Personal       | ${personalA.toString().padStart(8)} | ${personalB.toString().padStart(8)} | ${((personalA / (personalA + personalB)) * 100).toFixed(1).padStart(6)}% |`);
console.log(`| Transpersonal  | ${transpersonalA.toString().padStart(8)} | ${transpersonalB.toString().padStart(8)} | ${((transpersonalA / (transpersonalA + transpersonalB)) * 100).toFixed(1).padStart(6)}% |`);

// Chi-square test
const totalPersonal = personalA + personalB;
const totalTranspersonal = transpersonalA + transpersonalB;
const totalA = personalA + transpersonalA;
const totalB = personalB + transpersonalB;
const grandTotal = totalA + totalB;

const expectedPersonalA = totalPersonal * totalA / grandTotal;
const expectedPersonalB = totalPersonal * totalB / grandTotal;
const expectedTranspersonalA = totalTranspersonal * totalA / grandTotal;
const expectedTranspersonalB = totalTranspersonal * totalB / grandTotal;

let chiSquare88 = 0;
chiSquare88 += Math.pow(personalA - expectedPersonalA, 2) / expectedPersonalA;
chiSquare88 += Math.pow(personalB - expectedPersonalB, 2) / expectedPersonalB;
chiSquare88 += Math.pow(transpersonalA - expectedTranspersonalA, 2) / expectedTranspersonalA;
chiSquare88 += Math.pow(transpersonalB - expectedTranspersonalB, 2) / expectedTranspersonalB;

console.log(`\nChi-square statistic: ${chiSquare88.toFixed(2)}`);
console.log('Degrees of freedom: 1');
console.log('Critical value (p=0.05): 3.84');
console.log(`Result: ${chiSquare88 > 3.84 ? 'SIGNIFICANT' : 'NOT SIGNIFICANT'}`);

// ==========================================================================
// Investigation 5: Phi Spiral Dynamics
// ==========================================================================

console.log('\n' + '='.repeat(80));
console.log('INVESTIGATION 5: PHI SPIRAL DYNAMICS');
console.log('='.repeat(80));

console.log('\n--- PHI CONSTANTS ---\n');
console.log(`φ (phi) = ${PHI.toFixed(6)}`);
console.log(`Golden angle = ${GOLDEN_ANGLE.toFixed(3)}°`);
console.log(`Golden angle in gates = ${(GOLDEN_ANGLE / 5.625).toFixed(2)} gates`);
console.log('');

// Standing waves
const standingWaves = [1, 2, 29, 30, 51, 52, 57, 58];

// Calculate gaps between standing waves
console.log('--- STANDING WAVE GAPS ---\n');

const swPositions = standingWaves.map(g => wheelSequence.indexOf(g)).sort((a, b) => a - b);
const gaps = [];
for (let i = 0; i < swPositions.length; i++) {
  const next = (i + 1) % swPositions.length;
  let gap = swPositions[next] - swPositions[i];
  if (gap <= 0) gap += 64;
  gaps.push(gap);
}

console.log('Gaps between standing waves (in gate positions):');
console.log(gaps.join(', '));
console.log('');

// Check for Fibonacci pattern
const fibonacci = [1, 2, 3, 5, 8, 13, 21, 34, 55];
const gapFibMatch = gaps.map(g => fibonacci.includes(g) ? 'FIB' : 'non');
console.log('Fibonacci match: ' + gapFibMatch.join(', '));
console.log(`Fibonacci matches: ${gapFibMatch.filter(x => x === 'FIB').length} of ${gaps.length}`);

// Golden angle positions from Gate 41 (start)
console.log('\n--- GOLDEN ANGLE POSITIONS FROM GATE 41 ---\n');

const goldenPositions = [];
const startPos = wheelSequence.indexOf(41);
for (let i = 0; i < 8; i++) {
  const angle = i * GOLDEN_ANGLE;
  const gateOffset = Math.round(angle / 5.625) % 64;
  const pos = (startPos + gateOffset) % 64;
  const gate = wheelSequence[pos];
  goldenPositions.push({ i, angle: angle.toFixed(1), pos, gate });
}

console.log('| Step | Angle    | Position | Gate |');
console.log('|------|----------|----------|------|');
goldenPositions.forEach(g => {
  const isSW = standingWaves.includes(g.gate) ? ' (SW)' : '';
  console.log(`| ${g.i.toString().padStart(4)} | ${g.angle.padStart(8)}° | ${g.pos.toString().padStart(8)} | ${g.gate.toString().padStart(4)}${isSW} |`);
});

// Test: Do golden angle positions have different planetary distribution?
console.log('\n--- GOLDEN ANGLE vs NON-GOLDEN PLANETARY DISTRIBUTION ---\n');

const goldenGates = new Set(goldenPositions.map(g => g.gate));
const goldenPlanets = {};
const nonGoldenPlanets = {};

allPlanets.forEach(p => {
  goldenPlanets[p] = 0;
  nonGoldenPlanets[p] = 0;
});

lineData.forEach(l => {
  if (goldenGates.has(l.gate)) {
    if (goldenPlanets[l.exaltPlanet] !== undefined) goldenPlanets[l.exaltPlanet]++;
  } else {
    if (nonGoldenPlanets[l.exaltPlanet] !== undefined) nonGoldenPlanets[l.exaltPlanet]++;
  }
});

console.log('| Planet     | Golden | Non-Golden | Ratio |');
console.log('|------------|--------|------------|-------|');

allPlanets.forEach(p => {
  const g = goldenPlanets[p];
  const ng = nonGoldenPlanets[p];
  const ratio = ng > 0 ? (g / ng * (64 - 8) / 8).toFixed(2) : 'N/A'; // Normalized
  console.log(`| ${p.padEnd(10)} | ${g.toString().padStart(6)} | ${ng.toString().padStart(10)} | ${ratio.toString().padStart(5)} |`);
});

// Count same-planet exaltation gaps
console.log('\n--- FIBONACCI TEST: GAPS BETWEEN SAME-PLANET EXALTATIONS ---\n');

// For each planet, find all exaltation positions and calculate gaps
const planetGaps = {};

allPlanets.forEach(planet => {
  // Get all gates where this planet exalts (any line)
  const gates = new Set();
  lineData.forEach(l => {
    if (l.exaltPlanet === planet) gates.add(l.gate);
  });

  if (gates.size < 2) return;

  // Get wheel positions
  const positions = [...gates].map(g => wheelSequence.indexOf(g)).filter(p => p !== -1).sort((a, b) => a - b);

  // Calculate gaps
  const gapList = [];
  for (let i = 0; i < positions.length; i++) {
    const next = (i + 1) % positions.length;
    let gap = positions[next] - positions[i];
    if (gap <= 0) gap += 64;
    gapList.push(gap);
  }

  // Check Fibonacci matches
  const fibMatches = gapList.filter(g => fibonacci.includes(g)).length;

  planetGaps[planet] = {
    positions: positions.length,
    gaps: gapList,
    fibMatches,
    fibRatio: (fibMatches / gapList.length * 100).toFixed(1)
  };
});

console.log('| Planet     | Positions | Fib Matches | % Fibonacci |');
console.log('|------------|-----------|-------------|-------------|');

Object.entries(planetGaps)
  .sort((a, b) => parseFloat(b[1].fibRatio) - parseFloat(a[1].fibRatio))
  .forEach(([planet, data]) => {
    console.log(`| ${planet.padEnd(10)} | ${data.positions.toString().padStart(9)} | ${data.fibMatches.toString().padStart(11)} | ${data.fibRatio.padStart(11)}% |`);
  });

// Expected Fibonacci matches by chance
const avgGap = 64 / 10; // Average ~6.4 gates
const fibInRange = fibonacci.filter(f => f <= 20).length; // Fibonacci numbers in typical range
const expectedFibRatio = fibInRange / 20 * 100; // Rough estimate
console.log(`\nExpected Fibonacci match by chance: ~${expectedFibRatio.toFixed(0)}%`);

// Test phi ratio in planetary position distributions
console.log('\n--- PHI RATIO TEST: PLANET POSITION RATIOS ---\n');

allPlanets.forEach(planet => {
  const data = planetGaps[planet];
  if (!data || data.positions < 3) return;

  // Calculate ratio of largest gap to second largest
  const sortedGaps = [...data.gaps].sort((a, b) => b - a);
  if (sortedGaps.length >= 2) {
    const ratio = sortedGaps[0] / sortedGaps[1];
    const phiMatch = Math.abs(ratio - PHI) < 0.2 || Math.abs(ratio - 1/PHI) < 0.2;
    console.log(`${planet}: largest/second = ${ratio.toFixed(3)} ${phiMatch ? '≈ φ' : ''}`);
  }
});

console.log('\n=== SUMMARY ===\n');

console.log('Investigation 4 (88° Helix):');
console.log(`  Chi-square: ${chiSquare88.toFixed(2)} (${chiSquare88 > 3.84 ? 'SIGNIFICANT' : 'NOT SIGNIFICANT'})`);
console.log(`  Personal vs Transpersonal strand clustering: ${chiSquare88 > 3.84 ? 'YES' : 'NO'}`);
console.log('');

const totalFibMatches = Object.values(planetGaps).reduce((a, b) => a + b.fibMatches, 0);
const totalGapsChecked = Object.values(planetGaps).reduce((a, b) => a + b.gaps.length, 0);
const overallFibRatio = (totalFibMatches / totalGapsChecked * 100).toFixed(1);

console.log('Investigation 5 (Phi Spiral):');
console.log(`  Standing wave gaps: ${gaps.filter(g => fibonacci.includes(g)).length}/8 Fibonacci`);
console.log(`  Overall planet gap Fibonacci ratio: ${overallFibRatio}%`);
console.log(`  Expected by chance: ~${expectedFibRatio.toFixed(0)}%`);
console.log('');

if (chiSquare88 > 3.84) {
  console.log('CONCLUSION: 88° helix shows significant strand clustering.');
} else {
  console.log('CONCLUSION: 88° helix shows NO significant strand clustering.');
}

if (parseFloat(overallFibRatio) > expectedFibRatio * 1.5) {
  console.log('CONCLUSION: Phi spiral shows elevated Fibonacci pattern.');
} else {
  console.log('CONCLUSION: Phi spiral shows NO elevated Fibonacci pattern.');
}

console.log('\n=== END OF ANALYSIS ===');
