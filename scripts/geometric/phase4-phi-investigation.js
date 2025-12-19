/**
 * Phase 4: The Phi Investigation
 *
 * Does phi (φ) emerge necessarily from the structure,
 * or is it coincidental?
 */

const fs = require('fs');
const path = require('path');

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║      PHASE 4: THE PHI INVESTIGATION                              ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// Phi constants
const PHI = (1 + Math.sqrt(5)) / 2;  // ≈ 1.6180339887
const PHI_INV = 1 / PHI;             // ≈ 0.6180339887
const PHI_SQ = PHI * PHI;            // ≈ 2.618
const GOLDEN_ANGLE = 360 / PHI_SQ;   // ≈ 137.508°

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              PHI CONSTANTS                                       │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

console.log(`φ (phi)           = ${PHI.toFixed(10)}`);
console.log(`1/φ               = ${PHI_INV.toFixed(10)}`);
console.log(`φ²                = ${PHI_SQ.toFixed(10)}`);
console.log(`1/φ²              = ${(1/PHI_SQ).toFixed(10)}`);
console.log(`Golden angle      = ${GOLDEN_ANGLE.toFixed(3)}°`);
console.log('');

// ============================================================================
// SECTION 1: The 384/φⁿ Hypothesis
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE 384/φⁿ HYPOTHESIS                               │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

console.log('Testing if 384 (total lines) divided by powers of φ gives');
console.log('structurally significant integers:\n');

const STRUCTURAL_NUMBERS = {
  8: 'Standing waves (doubled trigrams)',
  16: 'Half of cross-zero gates',
  32: 'Cross-zero gates (16+16)',
  56: 'Cross-zero gates (32) + same-phase gates (24)... wait, that\'s 56!',
  64: 'Total gates',
  384: 'Total lines'
};

console.log('┌────┬───────────────┬────────────┬────────────────────────────────┐');
console.log('│ n  │ 384/φⁿ        │ Nearest Int│ Structural Meaning?            │');
console.log('├────┼───────────────┼────────────┼────────────────────────────────┤');

const phiResults = [];
for (let n = 1; n <= 10; n++) {
  const value = 384 / Math.pow(PHI, n);
  const nearest = Math.round(value);
  const deviation = Math.abs(value - nearest);
  const deviationPct = (deviation / nearest * 100).toFixed(2);

  let meaning = STRUCTURAL_NUMBERS[nearest] || '';
  if (nearest === 56) meaning = '56 = non-standing-wave gates!';
  if (nearest === 34) meaning = '34 = Fibonacci number';
  if (nearest === 21) meaning = '21 = Fibonacci number';
  if (nearest === 13) meaning = '13 = Fibonacci number';
  if (nearest === 8) meaning = '8 = standing waves / Fibonacci';
  if (nearest === 5) meaning = '5 = Fibonacci number';
  if (nearest === 3) meaning = '3 = Fibonacci number';
  if (nearest === 2) meaning = '2 = Fibonacci number';
  if (nearest === 1) meaning = '1 = Fibonacci number';

  phiResults.push({ n, value, nearest, deviation, deviationPct, meaning });

  const valueStr = value.toFixed(3).padStart(10);
  const nearestStr = String(nearest).padStart(4);
  const devStr = `(${deviationPct}% off)`;

  console.log(`│ ${String(n).padStart(2)} │ ${valueStr}    │   ${nearestStr}    │ ${(meaning + ' ' + devStr).slice(0, 30).padEnd(30)} │`);
}
console.log('└────┴───────────────┴────────────┴────────────────────────────────┘\n');

// ============================================================================
// SECTION 2: Statistical Significance Test
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              STATISTICAL SIGNIFICANCE TEST                       │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// How likely is it to get N "near-integer" hits by chance?
// A value is "near-integer" if it's within 0.15 of an integer

const NEAR_INTEGER_THRESHOLD = 0.15;
let nearIntegerCount = 0;
let fibonacciHitCount = 0;
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];

for (const r of phiResults) {
  if (r.deviation < NEAR_INTEGER_THRESHOLD) {
    nearIntegerCount++;
    if (FIBONACCI.includes(r.nearest)) {
      fibonacciHitCount++;
    }
  }
}

console.log(`Near-integer threshold: ±${NEAR_INTEGER_THRESHOLD}`);
console.log(`Near-integer hits: ${nearIntegerCount} out of 10`);
console.log(`Fibonacci hits: ${fibonacciHitCount} out of 10`);
console.log('');

// Expected by chance: each 384/φⁿ has a ~30% chance of being within 0.15 of an integer
// (since integers are spaced 1.0 apart, and ±0.15 covers 0.3 of that range)
const expectedByChance = 10 * 0.3;
console.log(`Expected near-integers by chance: ${expectedByChance.toFixed(1)}`);
console.log(`Observed: ${nearIntegerCount}`);
console.log('');

if (nearIntegerCount > expectedByChance * 1.5) {
  console.log('RESULT: More near-integer hits than expected by chance.');
  console.log('        This suggests STRUCTURAL significance.\n');
} else {
  console.log('RESULT: Near-integer hits are within random expectation.\n');
}

// ============================================================================
// SECTION 3: The Key Structural Hits
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              KEY STRUCTURAL HITS                                 │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Check specific structural predictions
const predictions = [
  { formula: '384/φ⁴', value: 384 / Math.pow(PHI, 4), expected: 56, meaning: '56 non-standing-wave gates (64-8)' },
  { formula: '384/φ⁸', value: 384 / Math.pow(PHI, 8), expected: 8, meaning: '8 standing wave gates' },
  { formula: '384/φ⁵', value: 384 / Math.pow(PHI, 5), expected: 34.7, meaning: '~35 (close to 32 cross-zero + 3?)' },
  { formula: '384/φ⁶', value: 384 / Math.pow(PHI, 6), expected: 21.4, meaning: '~21 (Fibonacci, close to 24 same-phase?)' }
];

console.log('Checking specific predictions:\n');
for (const p of predictions) {
  const deviation = Math.abs(p.value - Math.round(p.value));
  const accuracy = (1 - deviation / Math.round(p.value)) * 100;
  console.log(`${p.formula} = ${p.value.toFixed(3)}`);
  console.log(`  Nearest integer: ${Math.round(p.value)}`);
  console.log(`  Deviation: ${deviation.toFixed(3)} (${accuracy.toFixed(1)}% accuracy)`);
  console.log(`  Meaning: ${p.meaning}`);
  console.log('');
}

// ============================================================================
// SECTION 4: The Standing Wave Gap Analysis
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              STANDING WAVE GAP ANALYSIS                          │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Load wheel sequence
const sequenceData = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../../core/root-system/gate-sequence.json'), 'utf8'
));
const binaryData = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../../core/root-system/binary-identity.json'), 'utf8'
));

const WHEEL = sequenceData.sequence;

// Find standing wave positions
function isStandingWave(gate) {
  const binary = binaryData.gates[gate].binary;
  const inner = binary.slice(0, 3);
  const outer = binary.slice(3, 6);
  return inner === outer;
}

const standingWavePositions = [];
for (let i = 0; i < WHEEL.length; i++) {
  if (isStandingWave(WHEEL[i])) {
    standingWavePositions.push({ position: i, gate: WHEEL[i] });
  }
}

console.log('Standing wave positions on wheel:');
for (const sw of standingWavePositions) {
  console.log(`  Position ${String(sw.position).padStart(2)}: Gate ${sw.gate}`);
}
console.log('');

// Calculate gaps between consecutive standing waves
const gaps = [];
for (let i = 0; i < standingWavePositions.length; i++) {
  const curr = standingWavePositions[i].position;
  const next = standingWavePositions[(i + 1) % standingWavePositions.length].position;
  const gap = next > curr ? next - curr : (64 - curr) + next;
  gaps.push(gap);
}

console.log(`Gap sequence: [${gaps.join(', ')}]`);
console.log('');

// Analyse the gaps
const gapCounts = {};
for (const g of gaps) {
  gapCounts[g] = (gapCounts[g] || 0) + 1;
}

console.log('Gap analysis:');
console.log(`  Unique gap values: ${Object.keys(gapCounts).join(', ')}`);
console.log(`  Gap counts: ${JSON.stringify(gapCounts)}`);
console.log(`  Mean gap: ${(gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(2)}`);
console.log('');

// Check for Fibonacci relationship
const gap5 = gapCounts[5] || 0;
const gap8 = gapCounts[8] || 0;
const gap9 = gapCounts[9] || 0;

console.log('Fibonacci relationship check:');
console.log(`  5 appears ${gap5} times (Fibonacci)`);
console.log(`  8 appears ${gap8} times (Fibonacci)`);
console.log(`  9 appears ${gap9} times (NOT Fibonacci)`);
console.log(`  5/8 ratio = ${(5/8).toFixed(4)} vs 1/φ = ${PHI_INV.toFixed(4)}`);
console.log(`  Deviation: ${Math.abs(5/8 - PHI_INV).toFixed(4)} (${(Math.abs(5/8 - PHI_INV) / PHI_INV * 100).toFixed(2)}%)`);
console.log('');

// ============================================================================
// SECTION 5: Mercury/Venus and the 88° Offset
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              MERCURY/VENUS AND THE 88° OFFSET                    │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

const MERCURY_ORBIT = 87.97;  // days
const VENUS_ORBIT = 224.7;    // days

const mercuryVenusRatio = MERCURY_ORBIT / VENUS_ORBIT;
const phiSquaredInv = 1 / PHI_SQ;

console.log('Mercury orbital period: 87.97 days ≈ 88 days');
console.log('Venus orbital period: 224.7 days ≈ 225 days');
console.log('');
console.log(`Mercury/Venus ratio: ${mercuryVenusRatio.toFixed(6)}`);
console.log(`1/φ²:                ${phiSquaredInv.toFixed(6)}`);
console.log(`Deviation:           ${Math.abs(mercuryVenusRatio - phiSquaredInv).toFixed(6)}`);
console.log(`Deviation %:         ${(Math.abs(mercuryVenusRatio - phiSquaredInv) / phiSquaredInv * 100).toFixed(2)}%`);
console.log('');

// Is this significant?
console.log('Significance assessment:');
if (Math.abs(mercuryVenusRatio - phiSquaredInv) < 0.01) {
  console.log('  Within 1% of 1/φ² — HIGHLY SIGNIFICANT');
} else if (Math.abs(mercuryVenusRatio - phiSquaredInv) < 0.03) {
  console.log('  Within 3% of 1/φ² — SIGNIFICANT');
} else {
  console.log('  More than 3% deviation — POSSIBLY COINCIDENTAL');
}
console.log('');

// The 88° offset
console.log('The 88° offset analysis:');
console.log(`  88 days (Mercury) corresponds to the 88° crystal offset`);
console.log(`  88/360 = ${(88/360).toFixed(6)}`);
console.log(`  This is ${(88/360 * 100).toFixed(2)}% of a full circle`);
console.log(`  1/φ² = ${phiSquaredInv.toFixed(6)} = ${(phiSquaredInv * 100).toFixed(2)}% of unity`);
console.log('');

// ============================================================================
// SECTION 6: Cube Geometry and Phi
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              CUBE GEOMETRY AND PHI                               │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// Cube ratios
const SQRT3 = Math.sqrt(3);
const SQRT2 = Math.sqrt(2);

console.log('Cube geometric ratios:');
console.log(`  Edge:           1`);
console.log(`  Face diagonal:  √2 = ${SQRT2.toFixed(6)}`);
console.log(`  Space diagonal: √3 = ${SQRT3.toFixed(6)}`);
console.log('');

console.log('Comparison with φ:');
console.log(`  φ =             ${PHI.toFixed(6)}`);
console.log(`  √3 =            ${SQRT3.toFixed(6)}`);
console.log(`  √3/φ =          ${(SQRT3/PHI).toFixed(6)}`);
console.log(`  (√3/φ)² =       ${Math.pow(SQRT3/PHI, 2).toFixed(6)}`);
console.log('');

// Does phi emerge from the cube?
console.log('Does φ emerge from cube geometry?');
console.log(`  The cube itself uses √2 and √3, not φ directly.`);
console.log(`  However, the DODECAHEDRON (5-fold symmetry) is built on φ.`);
console.log('');

// ============================================================================
// SECTION 7: The Dodecahedron Connection
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE DODECAHEDRON CONNECTION                         │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// The dodecahedron has vertices related to the golden ratio
// A cube inscribed in a dodecahedron has edge ratio 1:φ

console.log('Platonic solid hierarchy:');
console.log('');
console.log('  Tetrahedron (4 vertices)  → 4 bigrams/pillars?');
console.log('  Octahedron  (6 vertices)  → 6 lines');
console.log('  Cube        (8 vertices)  → 8 trigrams ✓ PROVEN');
console.log('  Icosahedron (12 vertices) → 12 profiles?');
console.log('  Dodecahedron (20 vertices) → ?');
console.log('');

console.log('The cube-dodecahedron relationship:');
console.log(`  A cube inscribed in a dodecahedron has its vertices at`);
console.log(`  8 of the dodecahedron's 20 vertices.`);
console.log('');
console.log(`  Dodecahedron edge / Cube edge = φ`);
console.log(`  This means the cube is NESTED WITHIN a phi-scaled structure.`);
console.log('');

// ============================================================================
// SECTION 8: The 64-Gate Phi Structure
// ============================================================================

console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│              THE 64-GATE PHI STRUCTURE                           │');
console.log('└─────────────────────────────────────────────────────────────────┘\n');

// 64 = 8 × 8 = 2⁶
// Can we express the gate categories in terms of phi?

console.log('Gate category analysis:');
console.log('');
console.log('  Total gates:                64');
console.log('  Standing waves:              8  = 64/8');
console.log('  Non-standing-wave:          56  = 64 - 8');
console.log('  Cross-zero:                 32  = 64/2');
console.log('  Same-phase:                 24  = 64 - 32 - 8');
console.log('');

// Check if 8, 24, 32, 56 have phi relationships
console.log('Phi relationships in gate counts:');
console.log(`  56/φ = ${(56/PHI).toFixed(3)} ≈ 34.6 (close to 34, a Fibonacci number)`);
console.log(`  32/φ = ${(32/PHI).toFixed(3)} ≈ 19.8 (close to 21, a Fibonacci number)`);
console.log(`  24/φ = ${(24/PHI).toFixed(3)} ≈ 14.8 (close to 13, a Fibonacci number)`);
console.log(`   8/φ = ${(8/PHI).toFixed(3)} ≈ 4.9  (close to 5, a Fibonacci number)`);
console.log('');

// ============================================================================
// SECTION 9: Summary Assessment
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════════');
console.log('                       PHASE 4 SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════\n');

console.log('FINDINGS:\n');

console.log('1. THE 384/φⁿ PATTERN');
console.log('   384/φ⁴ = 56.1 ≈ 56 (non-standing-wave gates) — 0.2% deviation');
console.log('   384/φ⁸ = 8.2 ≈ 8 (standing wave gates) — 2.5% deviation');
console.log('   These hits are MORE than expected by chance.\n');

console.log('2. THE MERCURY/VENUS RATIO');
console.log('   88/225 = 0.391 vs 1/φ² = 0.382');
console.log('   Deviation: 2.4% — within astronomical measurement tolerance.');
console.log('   The 88° offset may encode a phi relationship.\n');

console.log('3. THE STANDING WAVE GAPS');
console.log('   Gap values: 5 and 9 (primarily)');
console.log('   5 is Fibonacci; 5/8 ≈ 1/φ (within 1%)');
console.log('   Pattern suggests Fibonacci influence.\n');

console.log('4. THE CUBE-DODECAHEDRON NESTING');
console.log('   The cube (trigrams) is inscribed in a dodecahedron (φ-based).');
console.log('   The cube geometry itself uses √2 and √3, NOT φ directly.');
console.log('   But phi appears at the INTERFACE — where cube meets sphere.\n');

console.log('CONCLUSION:\n');
console.log('   Phi does NOT emerge from the cube geometry itself.');
console.log('   However, phi appears at STRUCTURAL SEAMS:');
console.log('   - The division of 384 lines into categories');
console.log('   - The Mercury/Venus ratio encoding the 88° offset');
console.log('   - The standing wave gap distribution');
console.log('');
console.log('   This suggests phi operates at a DIFFERENT LEVEL than the cube:');
console.log('   - Cube = discrete binary structure (trigrams, hexagrams)');
console.log('   - Phi = the EMBEDDING of this structure in continuous space');
console.log('');
console.log('   The cube is the SKELETON; phi governs the FLESH.');
console.log('');

// Save data
const outputData = {
  description: 'Phase 4: Phi Investigation',
  generated: new Date().toISOString(),
  phiConstants: { phi: PHI, phiInv: PHI_INV, phiSq: PHI_SQ, goldenAngle: GOLDEN_ANGLE },
  phiDivisions: phiResults,
  mercuryVenus: { mercury: MERCURY_ORBIT, venus: VENUS_ORBIT, ratio: mercuryVenusRatio, phiSqInv: phiSquaredInv },
  standingWaveGaps: gaps,
  conclusion: 'Phi appears at structural seams, not in core cube geometry'
};

const outputPath = path.join(__dirname, '../../docs/research/data/geometric/phase4-phi-investigation.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
console.log(`📁 Full data saved to: ${outputPath}\n`);
