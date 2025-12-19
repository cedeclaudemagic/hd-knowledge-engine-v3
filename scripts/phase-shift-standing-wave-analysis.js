#!/usr/bin/env node
/**
 * Phase-Shift Standing Wave Analysis
 *
 * Tests whether the 8 standing waves occupy structurally privileged positions
 * on the Rave Mandala wheel across different phase-shift groupings.
 */

const fs = require('fs');
const path = require('path');

// Load data
const zodiacMapping = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../knowledge-systems/calendar/mappings/gate-zodiac-mapping.json'), 'utf8'
));
const binaryIdentity = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../core/root-system/binary-identity.json'), 'utf8'
));

// The 8 standing waves (inner trigram = outer trigram)
const STANDING_WAVES = [1, 2, 29, 30, 51, 52, 57, 58];

// Gate sequence around the wheel (64 gates in order)
const WHEEL_SEQUENCE = zodiacMapping.gateSequence;

// Build the 384-line binary sequence
function buildWheelBinarySequence() {
  const sequence = [];
  for (const gate of WHEEL_SEQUENCE) {
    const binary = binaryIdentity.gates[gate].binary;
    for (const bit of binary) {
      sequence.push(parseInt(bit));
    }
  }
  return sequence;
}

// Check if a 6-bit pattern is a standing wave (lower 3 bits = upper 3 bits)
function isStandingWave(pattern) {
  return pattern[0] === pattern[3] &&
         pattern[1] === pattern[4] &&
         pattern[2] === pattern[5];
}

// Get standing wave wheel positions
function getStandingWavePositions() {
  const positions = [];
  for (let i = 0; i < WHEEL_SEQUENCE.length; i++) {
    if (STANDING_WAVES.includes(WHEEL_SEQUENCE[i])) {
      positions.push({
        gate: WHEEL_SEQUENCE[i],
        wheelPosition: i,
        angle: i * 5.625,
        lineStart: i * 6,
        lineEnd: i * 6 + 5
      });
    }
  }
  return positions;
}

// ============================================================================
// TEST 1: Phase-Shift Standing Wave Persistence
// ============================================================================
function runTest1(wheelSequence) {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 1: Phase-Shift Standing Wave Persistence');
  console.log('='.repeat(70));

  // Count how often each line position falls inside a standing wave structure
  const lineStandingWaveCounts = new Array(384).fill(0);

  // For each phase shift
  for (let shift = 0; shift < 384; shift++) {
    // Create 64 pseudo-hexagrams
    for (let hex = 0; hex < 64; hex++) {
      const pattern = [];
      for (let line = 0; line < 6; line++) {
        const pos = (shift + hex * 6 + line) % 384;
        pattern.push(wheelSequence[pos]);
      }

      // Check if this pseudo-hexagram is a standing wave
      if (isStandingWave(pattern)) {
        // Mark all 6 positions as being in a standing wave
        for (let line = 0; line < 6; line++) {
          const pos = (shift + hex * 6 + line) % 384;
          lineStandingWaveCounts[pos]++;
        }
      }
    }
  }

  // Identify which lines belong to original standing waves
  const standingWaveLinePositions = new Set();
  const swPositions = getStandingWavePositions();
  for (const sw of swPositions) {
    for (let line = 0; line < 6; line++) {
      standingWaveLinePositions.add(sw.lineStart + line);
    }
  }

  // Calculate statistics
  const swCounts = [];
  const nonSwCounts = [];

  for (let i = 0; i < 384; i++) {
    if (standingWaveLinePositions.has(i)) {
      swCounts.push(lineStandingWaveCounts[i]);
    } else {
      nonSwCounts.push(lineStandingWaveCounts[i]);
    }
  }

  const swMean = swCounts.reduce((a, b) => a + b, 0) / swCounts.length;
  const nonSwMean = nonSwCounts.reduce((a, b) => a + b, 0) / nonSwCounts.length;

  const swStd = Math.sqrt(swCounts.reduce((acc, x) => acc + Math.pow(x - swMean, 2), 0) / swCounts.length);
  const nonSwStd = Math.sqrt(nonSwCounts.reduce((acc, x) => acc + Math.pow(x - nonSwMean, 2), 0) / nonSwCounts.length);

  // Pooled standard error for Z-score
  const pooledSE = Math.sqrt((swStd * swStd / swCounts.length) + (nonSwStd * nonSwStd / nonSwCounts.length));
  const zScore = (swMean - nonSwMean) / pooledSE;

  console.log('\nStanding Wave Line Positions (48 lines from 8 gates):');
  console.log(`  Mean count: ${swMean.toFixed(2)}`);
  console.log(`  Std dev: ${swStd.toFixed(2)}`);
  console.log(`  Min: ${Math.min(...swCounts)}, Max: ${Math.max(...swCounts)}`);

  console.log('\nNon-Standing Wave Line Positions (336 lines):');
  console.log(`  Mean count: ${nonSwMean.toFixed(2)}`);
  console.log(`  Std dev: ${nonSwStd.toFixed(2)}`);
  console.log(`  Min: ${Math.min(...nonSwCounts)}, Max: ${Math.max(...nonSwCounts)}`);

  console.log('\nStatistical Comparison:');
  console.log(`  Difference: ${(swMean - nonSwMean).toFixed(2)}`);
  console.log(`  Z-score: ${zScore.toFixed(3)}`);
  console.log(`  Significant (|Z| >= 2.0): ${Math.abs(zScore) >= 2.0 ? 'YES' : 'no'}`);

  // Distribution histogram
  const allCounts = [...swCounts, ...nonSwCounts];
  const minCount = Math.min(...allCounts);
  const maxCount = Math.max(...allCounts);
  console.log(`\nCount range: ${minCount} - ${maxCount}`);

  return {
    swMean, nonSwMean, swStd, nonSwStd, zScore,
    swCounts, nonSwCounts, lineStandingWaveCounts
  };
}

// ============================================================================
// TEST 2: Wheel Position Geometry
// ============================================================================
function runTest2() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 2: Wheel Position Geometry');
  console.log('='.repeat(70));

  const swPositions = getStandingWavePositions();

  // EM positions for reference
  const emPositions = {
    1: -4, 2: +4, 29: +2, 30: -2, 51: +1, 52: +3, 57: -1, 58: -3
  };

  console.log('\nStanding Wave Positions on Wheel:');
  console.log('Gate | Wheel Pos | Angle (°) | EM Pos | Binary');
  console.log('-'.repeat(55));

  for (const sw of swPositions.sort((a, b) => a.wheelPosition - b.wheelPosition)) {
    const binary = binaryIdentity.gates[sw.gate].binary;
    console.log(`  ${String(sw.gate).padStart(2)} |    ${String(sw.wheelPosition).padStart(2)}     | ${sw.angle.toFixed(3).padStart(8)} | ${String(emPositions[sw.gate]).padStart(3)}    | ${binary}`);
  }

  // Calculate gaps between consecutive standing waves
  const sortedPositions = swPositions.map(s => s.wheelPosition).sort((a, b) => a - b);
  const gaps = [];
  for (let i = 0; i < sortedPositions.length; i++) {
    const next = (i + 1) % sortedPositions.length;
    let gap = sortedPositions[next] - sortedPositions[i];
    if (gap <= 0) gap += 64; // Wrap around
    gaps.push(gap);
  }

  console.log('\nGaps Between Consecutive Standing Waves:');
  console.log(`  Gaps: ${gaps.join(', ')}`);
  console.log(`  Mean gap: ${(gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(2)} (ideal for uniform: 8.0)`);
  console.log(`  Gap std dev: ${Math.sqrt(gaps.reduce((acc, g) => acc + Math.pow(g - 8, 2), 0) / gaps.length).toFixed(2)}`);

  // Check quarter alignments
  const quarters = [0, 16, 32, 48];
  console.log('\nQuarter Alignment Check (positions 0, 16, 32, 48):');
  for (const q of quarters) {
    const nearest = swPositions.reduce((best, sw) => {
      const dist = Math.min(Math.abs(sw.wheelPosition - q), 64 - Math.abs(sw.wheelPosition - q));
      return dist < best.dist ? { gate: sw.gate, pos: sw.wheelPosition, dist } : best;
    }, { dist: 64 });
    console.log(`  Quarter ${q}: nearest standing wave = Gate ${nearest.gate} at position ${nearest.pos} (distance: ${nearest.dist})`);
  }

  // Wheel position vs EM position correlation
  const wheelPositions = swPositions.map(s => s.wheelPosition);
  const emPosArray = swPositions.map(s => emPositions[s.gate]);

  const wheelMean = wheelPositions.reduce((a, b) => a + b, 0) / wheelPositions.length;
  const emMean = emPosArray.reduce((a, b) => a + b, 0) / emPosArray.length;

  let cov = 0, varWheel = 0, varEM = 0;
  for (let i = 0; i < wheelPositions.length; i++) {
    cov += (wheelPositions[i] - wheelMean) * (emPosArray[i] - emMean);
    varWheel += Math.pow(wheelPositions[i] - wheelMean, 2);
    varEM += Math.pow(emPosArray[i] - emMean, 2);
  }
  const correlation = cov / Math.sqrt(varWheel * varEM);

  console.log('\nWheel Position vs EM Position:');
  console.log(`  Correlation coefficient: ${correlation.toFixed(4)}`);
  console.log(`  Interpretation: ${Math.abs(correlation) < 0.3 ? 'weak' : Math.abs(correlation) < 0.7 ? 'moderate' : 'strong'} ${correlation > 0 ? 'positive' : 'negative'} correlation`);

  return { swPositions, gaps, correlation };
}

// ============================================================================
// TEST 3: Binary Autocorrelation
// ============================================================================
function runTest3(wheelSequence) {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 3: Binary Autocorrelation');
  console.log('='.repeat(70));

  // Local autocorrelation at lag 3 (trigram repeat)
  const localCorr = [];
  for (let i = 0; i < 384; i++) {
    let matches = 0;
    for (let j = 0; j < 3; j++) {
      if (wheelSequence[(i + j) % 384] === wheelSequence[(i + j + 3) % 384]) {
        matches++;
      }
    }
    localCorr.push(matches / 3);
  }

  // Find positions with perfect autocorrelation (standing waves)
  const perfectPositions = [];
  for (let i = 0; i < 384; i++) {
    if (localCorr[i] === 1.0) {
      perfectPositions.push(i);
    }
  }

  console.log('\nLocal Autocorrelation (lag 3 = trigram repeat):');
  console.log(`  Positions with perfect correlation (1.0): ${perfectPositions.length}`);

  // Map perfect positions back to gates
  const perfectGates = new Set();
  for (const pos of perfectPositions) {
    const gateIndex = Math.floor(pos / 6);
    perfectGates.add(WHEEL_SEQUENCE[gateIndex]);
  }
  console.log(`  Gates containing perfect positions: ${[...perfectGates].sort((a, b) => a - b).join(', ')}`);
  console.log(`  Expected standing waves: ${STANDING_WAVES.sort((a, b) => a - b).join(', ')}`);

  // Global autocorrelation at key lags
  console.log('\nGlobal Autocorrelation at Key Lags:');
  const keyLags = [3, 6, 32, 64, 192, 96];
  for (const lag of keyLags) {
    let matches = 0;
    for (let i = 0; i < 384; i++) {
      if (wheelSequence[i] === wheelSequence[(i + lag) % 384]) {
        matches++;
      }
    }
    const corr = matches / 384;
    const label = lag === 3 ? '(trigram)' :
                  lag === 6 ? '(hexagram)' :
                  lag === 64 ? '(~10.67 gates)' :
                  lag === 192 ? '(half wheel)' :
                  lag === 96 ? '(quarter wheel)' :
                  lag === 32 ? '(~5.33 gates)' : '';
    console.log(`  Lag ${String(lag).padStart(3)}: ${(corr * 100).toFixed(1)}% ${label}`);
  }

  // Distribution of local correlations
  const corrBins = [0, 0.33, 0.67, 1.0];
  const corrHist = [0, 0, 0, 0];
  for (const c of localCorr) {
    if (c === 0) corrHist[0]++;
    else if (c <= 0.34) corrHist[1]++;
    else if (c <= 0.67) corrHist[2]++;
    else corrHist[3]++;
  }

  console.log('\nLocal Correlation Distribution:');
  console.log(`  0.0 (no match):     ${corrHist[0]} positions`);
  console.log(`  0.33 (1/3 match):   ${corrHist[1]} positions`);
  console.log(`  0.67 (2/3 match):   ${corrHist[2]} positions`);
  console.log(`  1.0 (full match):   ${corrHist[3]} positions`);

  return { localCorr, perfectPositions, perfectGates: [...perfectGates] };
}

// ============================================================================
// TEST 4: Standing Wave as Phase Anchors
// ============================================================================
function runTest4(wheelSequence) {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 4: Standing Waves as Phase Anchors');
  console.log('='.repeat(70));

  // For each gate, count how many phase shifts result in it being a standing wave
  const gatePreservationCounts = {};

  for (let gate = 1; gate <= 64; gate++) {
    gatePreservationCounts[gate] = 0;
  }

  // For each phase shift
  for (let shift = 0; shift < 384; shift++) {
    // Create 64 pseudo-hexagrams
    for (let hex = 0; hex < 64; hex++) {
      const pattern = [];
      for (let line = 0; line < 6; line++) {
        const pos = (shift + hex * 6 + line) % 384;
        pattern.push(wheelSequence[pos]);
      }

      // Check if this pseudo-hexagram is a standing wave
      if (isStandingWave(pattern)) {
        // Which original gate does hex position 0 belong to?
        const startPos = (shift + hex * 6) % 384;
        const originalGateIndex = Math.floor(startPos / 6);
        const originalGate = WHEEL_SEQUENCE[originalGateIndex];
        gatePreservationCounts[originalGate]++;
      }
    }
  }

  // Compare standing wave gates vs non-standing wave gates
  const swCounts = STANDING_WAVES.map(g => gatePreservationCounts[g]);
  const nonSwCounts = [];
  for (let gate = 1; gate <= 64; gate++) {
    if (!STANDING_WAVES.includes(gate)) {
      nonSwCounts.push(gatePreservationCounts[gate]);
    }
  }

  const swMean = swCounts.reduce((a, b) => a + b, 0) / swCounts.length;
  const nonSwMean = nonSwCounts.reduce((a, b) => a + b, 0) / nonSwCounts.length;

  const swStd = Math.sqrt(swCounts.reduce((acc, x) => acc + Math.pow(x - swMean, 2), 0) / swCounts.length);
  const nonSwStd = Math.sqrt(nonSwCounts.reduce((acc, x) => acc + Math.pow(x - nonSwMean, 2), 0) / nonSwCounts.length);

  const pooledSE = Math.sqrt((swStd * swStd / swCounts.length) + (nonSwStd * nonSwStd / nonSwCounts.length));
  const zScore = pooledSE > 0 ? (swMean - nonSwMean) / pooledSE : 0;

  console.log('\nPhase Preservation Counts by Gate:');
  console.log('\nStanding Wave Gates:');
  for (const gate of STANDING_WAVES.sort((a, b) => a - b)) {
    console.log(`  Gate ${String(gate).padStart(2)}: ${gatePreservationCounts[gate]} phase shifts`);
  }
  console.log(`  Mean: ${swMean.toFixed(2)}, Std: ${swStd.toFixed(2)}`);

  console.log('\nNon-Standing Wave Gates Summary:');
  console.log(`  Mean: ${nonSwMean.toFixed(2)}, Std: ${nonSwStd.toFixed(2)}`);
  console.log(`  Min: ${Math.min(...nonSwCounts)}, Max: ${Math.max(...nonSwCounts)}`);

  console.log('\nStatistical Comparison:');
  console.log(`  Difference: ${(swMean - nonSwMean).toFixed(2)}`);
  console.log(`  Z-score: ${zScore.toFixed(3)}`);
  console.log(`  Significant (|Z| >= 2.0): ${Math.abs(zScore) >= 2.0 ? 'YES' : 'no'}`);

  return { gatePreservationCounts, swMean, nonSwMean, zScore };
}

// ============================================================================
// TEST 5: Minimum Phase Shifts Between Standing Waves
// ============================================================================
function runTest5(wheelSequence) {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 5: Standing Wave Count Distribution Across Phases');
  console.log('='.repeat(70));

  // Count standing waves at each phase shift
  const swCountsByPhase = [];
  const phasesWithExactly8 = [];

  for (let shift = 0; shift < 384; shift++) {
    let swCount = 0;

    for (let hex = 0; hex < 64; hex++) {
      const pattern = [];
      for (let line = 0; line < 6; line++) {
        const pos = (shift + hex * 6 + line) % 384;
        pattern.push(wheelSequence[pos]);
      }

      if (isStandingWave(pattern)) {
        swCount++;
      }
    }

    swCountsByPhase.push(swCount);
    if (swCount === 8) {
      phasesWithExactly8.push(shift);
    }
  }

  // Distribution of standing wave counts
  const countDist = {};
  for (const count of swCountsByPhase) {
    countDist[count] = (countDist[count] || 0) + 1;
  }

  console.log('\nDistribution of Standing Wave Counts Across 384 Phases:');
  const sortedCounts = Object.keys(countDist).map(Number).sort((a, b) => a - b);
  for (const count of sortedCounts) {
    const bar = '#'.repeat(Math.round(countDist[count] / 5));
    console.log(`  ${String(count).padStart(2)} standing waves: ${String(countDist[count]).padStart(3)} phases ${bar}`);
  }

  const mean = swCountsByPhase.reduce((a, b) => a + b, 0) / swCountsByPhase.length;
  const std = Math.sqrt(swCountsByPhase.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / swCountsByPhase.length);

  console.log(`\nMean: ${mean.toFixed(2)}, Std: ${std.toFixed(2)}`);
  console.log(`Min: ${Math.min(...swCountsByPhase)}, Max: ${Math.max(...swCountsByPhase)}`);

  console.log(`\nPhases with exactly 8 standing waves: ${phasesWithExactly8.length}`);
  if (phasesWithExactly8.length <= 20) {
    console.log(`  Phases: ${phasesWithExactly8.join(', ')}`);
  } else {
    console.log(`  First 10: ${phasesWithExactly8.slice(0, 10).join(', ')}`);
    console.log(`  Last 10: ${phasesWithExactly8.slice(-10).join(', ')}`);
  }

  // Analyze what phases with 8 SWs have in common
  if (phasesWithExactly8.length > 1) {
    const gaps = [];
    for (let i = 1; i < phasesWithExactly8.length; i++) {
      gaps.push(phasesWithExactly8[i] - phasesWithExactly8[i - 1]);
    }
    console.log(`\nGaps between phases with 8 SWs: ${gaps.slice(0, 10).join(', ')}${gaps.length > 10 ? '...' : ''}`);

    // Check if they're multiples of 6
    const multipleOf6 = phasesWithExactly8.filter(p => p % 6 === 0);
    console.log(`  Phases divisible by 6: ${multipleOf6.length} of ${phasesWithExactly8.length}`);
  }

  // Special analysis: Phase 0 significance
  console.log('\nPhase 0 Analysis:');
  console.log(`  Standing wave count at phase 0: ${swCountsByPhase[0]}`);
  const rank = swCountsByPhase.filter(c => c >= swCountsByPhase[0]).length;
  console.log(`  Rank among all phases: ${rank} of 384 (${(rank/384*100).toFixed(1)}% have >= this many)`);

  return { swCountsByPhase, phasesWithExactly8, countDist };
}

// ============================================================================
// Generate Report
// ============================================================================
function generateReport(results) {
  const { test1, test2, test3, test4, test5 } = results;

  const report = `# Phase-Shift Standing Wave Analysis

**Generated**: ${new Date().toISOString().split('T')[0]}

## Executive Summary

This analysis tests whether the 8 standing waves (Gates 1, 2, 29, 30, 51, 52, 57, 58) occupy structurally privileged positions on the Rave Mandala wheel.

---

## Test 1: Phase-Shift Persistence

**Question**: Do standing wave line positions appear inside standing wave structures more often across all 384 phase shifts?

| Metric | Standing Wave Positions | Non-Standing Wave Positions |
|--------|-------------------------|----------------------------|
| Count | 48 lines | 336 lines |
| Mean | ${test1.swMean.toFixed(2)} | ${test1.nonSwMean.toFixed(2)} |
| Std Dev | ${test1.swStd.toFixed(2)} | ${test1.nonSwStd.toFixed(2)} |

**Z-score**: ${test1.zScore.toFixed(3)}
**Significant**: ${Math.abs(test1.zScore) >= 2.0 ? 'YES' : 'No'}

---

## Test 2: Wheel Position Geometry

**Standing Wave Positions**:

| Gate | Wheel Position | Angle (°) | EM Position |
|------|----------------|-----------|-------------|
${test2.swPositions.sort((a, b) => a.wheelPosition - b.wheelPosition).map(sw => {
  const emPos = { 1: -4, 2: +4, 29: +2, 30: -2, 51: +1, 52: +3, 57: -1, 58: -3 }[sw.gate];
  return `| ${sw.gate} | ${sw.wheelPosition} | ${sw.angle.toFixed(2)} | ${emPos > 0 ? '+' : ''}${emPos} |`;
}).join('\n')}

**Gap Analysis**:
- Gaps between consecutive standing waves: ${test2.gaps.join(', ')}
- Mean gap: ${(test2.gaps.reduce((a, b) => a + b, 0) / test2.gaps.length).toFixed(2)} (ideal uniform: 8.0)

**Wheel vs EM Correlation**: ${test2.correlation.toFixed(4)}

---

## Test 3: Binary Autocorrelation

**Local Autocorrelation (lag 3)**:
- Positions with perfect correlation (1.0): ${test3.perfectPositions.length}
- Gates with perfect positions: ${test3.perfectGates.sort((a, b) => a - b).join(', ')}
- Expected standing waves: ${STANDING_WAVES.sort((a, b) => a - b).join(', ')}

**Interpretation**: ${test3.perfectGates.length === 8 && test3.perfectGates.every(g => STANDING_WAVES.includes(g)) ?
  'Perfect match - only standing wave gates show perfect local autocorrelation' :
  'Mismatch detected - investigate further'}

---

## Test 4: Standing Waves as Phase Anchors

**Question**: Are original standing waves preserved as standing waves across more phase shifts than other gates?

| Category | Mean Preservation | Std Dev |
|----------|-------------------|---------|
| Standing Wave Gates (8) | ${test4.swMean.toFixed(2)} | N/A |
| Non-Standing Wave Gates (56) | ${test4.nonSwMean.toFixed(2)} | N/A |

**Z-score**: ${test4.zScore.toFixed(3)}
**Significant**: ${Math.abs(test4.zScore) >= 2.0 ? 'YES' : 'No'}

---

## Test 5: Standing Wave Count Distribution

**Distribution across 384 phases**:

| SW Count | Phases |
|----------|--------|
${Object.keys(test5.countDist).sort((a, b) => Number(a) - Number(b)).map(count =>
  `| ${count} | ${test5.countDist[count]} |`
).join('\n')}

**Phases with exactly 8 standing waves**: ${test5.phasesWithExactly8.length}
${test5.phasesWithExactly8.length <= 20 ?
  `\nPhase values: ${test5.phasesWithExactly8.join(', ')}` :
  `\nFirst 10: ${test5.phasesWithExactly8.slice(0, 10).join(', ')}`}

**Phase 0 significance**: ${test5.swCountsByPhase[0]} standing waves (rank ${
  test5.swCountsByPhase.filter(c => c >= test5.swCountsByPhase[0]).length
} of 384)

---

## Overall Conclusion

${generateConclusion(results)}

---

*Analysis completed: ${new Date().toISOString()}*
`;

  return report;
}

function generateConclusion(results) {
  const { test1, test2, test4, test5 } = results;

  const findings = [];

  if (Math.abs(test1.zScore) >= 2.0) {
    findings.push(`**Test 1**: Standing wave positions ARE structurally privileged (Z = ${test1.zScore.toFixed(2)})`);
  } else {
    findings.push(`**Test 1**: Standing wave positions show no significant privilege (Z = ${test1.zScore.toFixed(2)})`);
  }

  const gapVariance = test2.gaps.reduce((acc, g) => acc + Math.pow(g - 8, 2), 0) / test2.gaps.length;
  if (gapVariance < 4) {
    findings.push(`**Test 2**: Standing waves are relatively evenly distributed (gap variance = ${gapVariance.toFixed(2)})`);
  } else {
    findings.push(`**Test 2**: Standing waves are unevenly distributed (gap variance = ${gapVariance.toFixed(2)})`);
  }

  if (Math.abs(test4.zScore) >= 2.0) {
    findings.push(`**Test 4**: Standing waves ARE preserved as anchors (Z = ${test4.zScore.toFixed(2)})`);
  } else {
    findings.push(`**Test 4**: Standing waves show no anchor privilege (Z = ${test4.zScore.toFixed(2)})`);
  }

  if (test5.phasesWithExactly8.length < 64) {
    findings.push(`**Test 5**: Phase 0 is one of only ${test5.phasesWithExactly8.length} phases with exactly 8 standing waves`);
  } else {
    findings.push(`**Test 5**: Many phases (${test5.phasesWithExactly8.length}) produce exactly 8 standing waves`);
  }

  return findings.join('\n\n');
}

// ============================================================================
// Main Execution
// ============================================================================
function main() {
  console.log('Phase-Shift Standing Wave Analysis');
  console.log('===================================\n');

  // Build the wheel sequence
  const wheelSequence = buildWheelBinarySequence();
  console.log(`Built 384-line binary sequence from ${WHEEL_SEQUENCE.length} gates`);
  console.log(`First 24 bits: ${wheelSequence.slice(0, 24).join('')}`);
  console.log(`Standing waves: ${STANDING_WAVES.join(', ')}`);

  // Verify standing waves
  console.log('\nVerifying standing wave binary patterns:');
  for (const gate of STANDING_WAVES) {
    const binary = binaryIdentity.gates[gate].binary;
    const lower = binary.slice(0, 3);
    const upper = binary.slice(3, 6);
    const isValid = lower === upper;
    console.log(`  Gate ${String(gate).padStart(2)}: ${binary} (${lower}|${upper}) - ${isValid ? 'Valid' : 'INVALID'}`);
  }

  // Run all tests
  const test1 = runTest1(wheelSequence);
  const test2 = runTest2();
  const test3 = runTest3(wheelSequence);
  const test4 = runTest4(wheelSequence);
  const test5 = runTest5(wheelSequence);

  // Generate report
  const results = { test1, test2, test3, test4, test5 };
  const report = generateReport(results);

  // Save report
  const reportDir = path.join(__dirname, '../docs/research/planetary/reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  const reportPath = path.join(reportDir, 'PHASE-SHIFT-ANALYSIS.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\n${'='.repeat(70)}`);
  console.log(`Report saved to: ${reportPath}`);
}

main();
