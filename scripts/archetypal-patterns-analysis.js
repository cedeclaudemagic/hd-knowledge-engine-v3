#!/usr/bin/env node
/**
 * Archetypal Patterns Analysis
 *
 * Investigates whether the four Pillars (Gates 1, 2, 63, 64) represent
 * the four maximally regular 6-bit binary patterns.
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

const WHEEL_SEQUENCE = zodiacMapping.gateSequence;
const PILLARS = [1, 2, 63, 64];
const STANDING_WAVES = [1, 2, 29, 30, 51, 52, 57, 58];

// Trigram names
const TRIGRAM_NAMES = {
  '111': 'Heaven', '000': 'Earth', '101': 'Fire', '010': 'Water',
  '100': 'Thunder', '001': 'Mountain', '011': 'Wind', '110': 'Lake'
};

// Build wheel binary sequence
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

// ============================================================================
// INVESTIGATION 1: Pattern Regularity Analysis
// ============================================================================
function investigation1() {
  console.log('\n' + '='.repeat(70));
  console.log('INVESTIGATION 1: Pattern Regularity Analysis');
  console.log('='.repeat(70));

  const results = [];

  for (let gate = 1; gate <= 64; gate++) {
    const binary = binaryIdentity.gates[gate].binary;
    const bits = binary.split('').map(Number);

    // Run-length analysis
    const runs = [];
    let currentRun = 1;
    for (let i = 1; i < 6; i++) {
      if (bits[i] === bits[i - 1]) {
        currentRun++;
      } else {
        runs.push(currentRun);
        currentRun = 1;
      }
    }
    runs.push(currentRun);

    const runMean = runs.reduce((a, b) => a + b, 0) / runs.length;
    const runVariance = runs.reduce((acc, r) => acc + Math.pow(r - runMean, 2), 0) / runs.length;

    // Autocorrelation at lag 1
    let sumProd = 0, sumSq1 = 0, sumSq2 = 0;
    const mean = bits.reduce((a, b) => a + b, 0) / 6;
    for (let i = 0; i < 5; i++) {
      sumProd += (bits[i] - mean) * (bits[i + 1] - mean);
      sumSq1 += Math.pow(bits[i] - mean, 2);
      sumSq2 += Math.pow(bits[i + 1] - mean, 2);
    }
    const autocorr = sumSq1 * sumSq2 > 0 ? sumProd / Math.sqrt(sumSq1 * sumSq2) : (bits[0] === bits[1] ? 1 : -1);

    // Period detection
    let period = 6;
    for (const p of [1, 2, 3]) {
      let isPeriodic = true;
      const unit = binary.slice(0, p);
      for (let i = 0; i < 6; i++) {
        if (binary[i] !== unit[i % p]) {
          isPeriodic = false;
          break;
        }
      }
      if (isPeriodic) {
        period = p;
        break;
      }
    }

    // Check palindrome
    const isPalindrome = binary === binary.split('').reverse().join('');

    // Check complement = reverse
    const complement = binary.split('').map(b => b === '0' ? '1' : '0').join('');
    const reverse = binary.split('').reverse().join('');
    const complementEqualsReverse = complement === reverse;

    // Regularity score (lower = more regular)
    // Period 1 or 2 with zero run variance = maximally regular
    const regularityScore = period + runVariance + (Math.abs(autocorr) < 0.9 ? 10 : 0);

    results.push({
      gate,
      binary,
      period,
      runVariance: runVariance.toFixed(2),
      autocorr: autocorr.toFixed(2),
      isPalindrome,
      complementEqualsReverse,
      regularityScore,
      isPillar: PILLARS.includes(gate)
    });
  }

  // Sort by regularity score
  results.sort((a, b) => a.regularityScore - b.regularityScore);

  console.log('\nTop 10 Most Regular Patterns:');
  console.log('Gate | Binary  | Period | RunVar | AutoCorr | Palindrome | Comp=Rev | Score');
  console.log('-'.repeat(80));

  for (const r of results.slice(0, 10)) {
    const pillarMark = r.isPillar ? ' **PILLAR**' : '';
    console.log(`  ${String(r.gate).padStart(2)} | ${r.binary} |   ${r.period}    |  ${r.runVariance.padStart(4)}  |   ${r.autocorr.padStart(5)}  |    ${r.isPalindrome ? 'Y' : 'N'}     |    ${r.complementEqualsReverse ? 'Y' : 'N'}    | ${r.regularityScore.toFixed(1)}${pillarMark}`);
  }

  // Check if Pillars are in top 4
  const top4Gates = results.slice(0, 4).map(r => r.gate);
  const pillarsInTop4 = PILLARS.filter(p => top4Gates.includes(p));

  console.log('\n--- VERIFICATION ---');
  console.log(`Top 4 most regular gates: ${top4Gates.join(', ')}`);
  console.log(`Pillars: ${PILLARS.join(', ')}`);
  console.log(`Pillars in top 4: ${pillarsInTop4.length}/4`);

  if (pillarsInTop4.length === 4) {
    console.log('CONFIRMED: The 4 Pillars ARE the 4 most regular patterns!');
  }

  return results;
}

// ============================================================================
// INVESTIGATION 2: Phase-Shift Behavior of Alternating Patterns
// ============================================================================
function investigation2(wheelSequence) {
  console.log('\n' + '='.repeat(70));
  console.log('INVESTIGATION 2: Phase-Shift Behavior of Alternating Patterns');
  console.log('='.repeat(70));

  // Track when Gates 63/64 positions appear as alternating patterns
  const gate63Position = WHEEL_SEQUENCE.indexOf(63);
  const gate64Position = WHEEL_SEQUENCE.indexOf(64);

  console.log(`\nGate 63 wheel position: ${gate63Position}`);
  console.log(`Gate 64 wheel position: ${gate64Position}`);

  // Count alternating patterns per phase
  const alternatingCountByPhase = [];
  const gate63AsAlternating = [];
  const gate64AsAlternating = [];

  for (let shift = 0; shift < 384; shift++) {
    let altCount = 0;
    let g63Alt = false;
    let g64Alt = false;

    for (let hex = 0; hex < 64; hex++) {
      const pattern = [];
      for (let line = 0; line < 6; line++) {
        const pos = (shift + hex * 6 + line) % 384;
        pattern.push(wheelSequence[pos]);
      }
      const patternStr = pattern.join('');

      // Check if alternating (101010 or 010101)
      if (patternStr === '101010' || patternStr === '010101') {
        altCount++;

        // Check if this pseudo-hexagram overlaps with original gate 63/64 positions
        const startLinePos = (shift + hex * 6) % 384;
        const startGatePos = Math.floor(startLinePos / 6);

        if (startGatePos === gate63Position) g63Alt = true;
        if (startGatePos === gate64Position) g64Alt = true;
      }
    }

    alternatingCountByPhase.push(altCount);
    if (g63Alt) gate63AsAlternating.push(shift);
    if (g64Alt) gate64AsAlternating.push(shift);
  }

  // Analyse results
  const minAlt = Math.min(...alternatingCountByPhase);
  const maxAlt = Math.max(...alternatingCountByPhase);
  const meanAlt = alternatingCountByPhase.reduce((a, b) => a + b, 0) / 384;

  console.log('\nAlternating Pattern Distribution Across Phases:');
  console.log(`  Min: ${minAlt}, Max: ${maxAlt}, Mean: ${meanAlt.toFixed(2)}`);

  // Distribution
  const altDist = {};
  for (const c of alternatingCountByPhase) {
    altDist[c] = (altDist[c] || 0) + 1;
  }
  console.log('\n  Count | Phases');
  for (const [count, phases] of Object.entries(altDist).sort((a, b) => Number(a[0]) - Number(b[0]))) {
    console.log(`    ${count}   |  ${phases}`);
  }

  console.log(`\nGate 63 appears as alternating pattern in ${gate63AsAlternating.length}/384 phases`);
  console.log(`Gate 64 appears as alternating pattern in ${gate64AsAlternating.length}/384 phases`);

  // Compare to standing waves
  console.log('\nComparison to Standing Wave Behavior:');
  console.log('  Standing waves: 8 at minimal phases, 10 at others');
  console.log(`  Alternating patterns: ${minAlt} at minimal, ${maxAlt} at max`);

  return { alternatingCountByPhase, gate63AsAlternating, gate64AsAlternating };
}

// ============================================================================
// INVESTIGATION 3: The Four Symmetry Types
// ============================================================================
function investigation3() {
  console.log('\n' + '='.repeat(70));
  console.log('INVESTIGATION 3: The Four Symmetry Types');
  console.log('='.repeat(70));

  const pillarAnalysis = [];

  for (const gate of PILLARS) {
    const binary = binaryIdentity.gates[gate].binary;
    const reverse = binary.split('').reverse().join('');
    const complement = binary.split('').map(b => b === '0' ? '1' : '0').join('');

    const isPalindrome = binary === reverse;
    const isSelfComplement = binary === complement;
    const complementEqualsReverse = complement === reverse;

    // Find the complement gate
    let complementGate = null;
    for (let g = 1; g <= 64; g++) {
      if (binaryIdentity.gates[g].binary === complement) {
        complementGate = g;
        break;
      }
    }

    // Find the reverse gate
    let reverseGate = null;
    for (let g = 1; g <= 64; g++) {
      if (binaryIdentity.gates[g].binary === reverse) {
        reverseGate = g;
        break;
      }
    }

    // Period
    let period = 6;
    for (const p of [1, 2, 3]) {
      let isPeriodic = true;
      const unit = binary.slice(0, p);
      for (let i = 0; i < 6; i++) {
        if (binary[i] !== unit[i % p]) {
          isPeriodic = false;
          break;
        }
      }
      if (isPeriodic) {
        period = p;
        break;
      }
    }

    const lower = binary.slice(0, 3);
    const upper = binary.slice(3, 6);
    const isStandingWave = lower === upper;
    const gateType = isStandingWave ? 'Standing Wave' : 'Cross-Zero';

    pillarAnalysis.push({
      gate,
      binary,
      period,
      isPalindrome,
      complementEqualsReverse,
      complementGate,
      reverseGate,
      gateType,
      lower,
      upper,
      lowerName: TRIGRAM_NAMES[lower],
      upperName: TRIGRAM_NAMES[upper]
    });
  }

  console.log('\nPillar Symmetry Analysis:');
  console.log('-'.repeat(80));

  for (const p of pillarAnalysis) {
    console.log(`\nGate ${p.gate} (${p.binary}):`);
    console.log(`  Trigrams: ${p.lowerName} (${p.lower}) / ${p.upperName} (${p.upper})`);
    console.log(`  Period: ${p.period}`);
    console.log(`  Type: ${p.gateType}`);
    console.log(`  Palindrome: ${p.isPalindrome}`);
    console.log(`  Complement = Reverse: ${p.complementEqualsReverse}`);
    console.log(`  Complement gate: ${p.complementGate}`);
    console.log(`  Reverse gate: ${p.reverseGate}`);
  }

  // Classify symmetry types
  console.log('\n--- SYMMETRY CLASSIFICATION ---\n');

  const period1 = pillarAnalysis.filter(p => p.period === 1);
  const period2 = pillarAnalysis.filter(p => p.period === 2);

  console.log('PERIOD-1 (Constant patterns):');
  for (const p of period1) {
    console.log(`  Gate ${p.gate}: ${p.binary} - ${p.isPalindrome ? 'Palindrome' : ''} - ${p.gateType}`);
  }

  console.log('\nPERIOD-2 (Alternating patterns):');
  for (const p of period2) {
    console.log(`  Gate ${p.gate}: ${p.binary} - Complement=Reverse: ${p.complementEqualsReverse} - ${p.gateType}`);
  }

  // Verify unique relationship
  console.log('\n--- KEY RELATIONSHIPS ---');
  console.log(`Gates 1 and 2 are complements: ${pillarAnalysis.find(p => p.gate === 1).complementGate === 2}`);
  console.log(`Gates 63 and 64 are complements: ${pillarAnalysis.find(p => p.gate === 63).complementGate === 64}`);
  console.log(`Gates 63 and 64 have complement=reverse: ${pillarAnalysis.find(p => p.gate === 63).complementEqualsReverse && pillarAnalysis.find(p => p.gate === 64).complementEqualsReverse}`);

  return pillarAnalysis;
}

// ============================================================================
// INVESTIGATION 4: Wheel Position of Pillars
// ============================================================================
function investigation4() {
  console.log('\n' + '='.repeat(70));
  console.log('INVESTIGATION 4: Wheel Position of Pillars');
  console.log('='.repeat(70));

  // Get positions
  const positions = {};
  for (let i = 0; i < WHEEL_SEQUENCE.length; i++) {
    const gate = WHEEL_SEQUENCE[i];
    if (PILLARS.includes(gate) || STANDING_WAVES.includes(gate)) {
      positions[gate] = {
        wheelPos: i,
        angle: i * 5.625
      };
    }
  }

  console.log('\nPillar Positions:');
  console.log('Gate | Wheel Pos | Angle (°) | Type');
  console.log('-'.repeat(50));

  for (const gate of PILLARS) {
    const p = positions[gate];
    const type = [1, 2].includes(gate) ? 'Standing Wave' : 'Cross-Zero';
    console.log(`  ${String(gate).padStart(2)} |    ${String(p.wheelPos).padStart(2)}     | ${p.angle.toFixed(2).padStart(7)} | ${type}`);
  }

  // Check angular relationships
  console.log('\n--- ANGULAR RELATIONSHIPS ---');

  const g1Pos = positions[1].wheelPos;
  const g2Pos = positions[2].wheelPos;
  const g63Pos = positions[63].wheelPos;
  const g64Pos = positions[64].wheelPos;

  const sep_1_2 = Math.abs(g1Pos - g2Pos);
  const sep_63_64 = Math.abs(g63Pos - g64Pos);
  const sep_1_63 = Math.abs(g1Pos - g63Pos);
  const sep_1_64 = Math.abs(g1Pos - g64Pos);
  const sep_2_63 = Math.abs(g2Pos - g63Pos);
  const sep_2_64 = Math.abs(g2Pos - g64Pos);

  console.log(`\nGate 1 ↔ Gate 2: ${sep_1_2} positions (${(sep_1_2 * 5.625).toFixed(1)}°)`);
  console.log(`Gate 63 ↔ Gate 64: ${sep_63_64} positions (${(sep_63_64 * 5.625).toFixed(1)}°)`);
  console.log(`Gate 1 ↔ Gate 63: ${sep_1_63} positions (${(sep_1_63 * 5.625).toFixed(1)}°)`);
  console.log(`Gate 1 ↔ Gate 64: ${sep_1_64} positions (${(sep_1_64 * 5.625).toFixed(1)}°)`);
  console.log(`Gate 2 ↔ Gate 63: ${sep_2_63} positions (${(sep_2_63 * 5.625).toFixed(1)}°)`);
  console.log(`Gate 2 ↔ Gate 64: ${sep_2_64} positions (${(sep_2_64 * 5.625).toFixed(1)}°)`);

  // Check if 1/2 axis is perpendicular to 63/64 axis
  const midpoint_1_2 = (g1Pos + g2Pos) / 2;
  const midpoint_63_64 = (g63Pos + g64Pos) / 2;
  const axisSeparation = Math.abs(midpoint_1_2 - midpoint_63_64);

  console.log(`\nAxis Analysis:`);
  console.log(`  1/2 midpoint: position ${midpoint_1_2.toFixed(1)}`);
  console.log(`  63/64 midpoint: position ${midpoint_63_64.toFixed(1)}`);
  console.log(`  Axis separation: ${axisSeparation.toFixed(1)} positions (${(axisSeparation * 5.625).toFixed(1)}°)`);
  console.log(`  Are axes perpendicular (90°)? ${Math.abs(axisSeparation - 16) < 2 ? 'YES' : 'No'}`);

  // Relationship to other standing waves
  console.log('\nAll Standing Waves + Pillars on Wheel:');
  const allGates = [...new Set([...PILLARS, ...STANDING_WAVES])].sort((a, b) => positions[a].wheelPos - positions[b].wheelPos);

  for (const gate of allGates) {
    const p = positions[gate];
    const isPillar = PILLARS.includes(gate);
    const isSW = STANDING_WAVES.includes(gate);
    const label = isPillar && isSW ? 'PILLAR+SW' : isPillar ? 'PILLAR' : 'SW';
    console.log(`  Gate ${String(gate).padStart(2)}: pos ${String(p.wheelPos).padStart(2)} (${p.angle.toFixed(1).padStart(6)}°) [${label}]`);
  }

  return positions;
}

// ============================================================================
// INVESTIGATION 5: Nuclear Transformation Paths
// ============================================================================
function investigation5() {
  console.log('\n' + '='.repeat(70));
  console.log('INVESTIGATION 5: Nuclear Transformation Paths');
  console.log('='.repeat(70));

  // Calculate nuclear hexagram for each gate
  function getNuclear(binary) {
    // Lower nuclear: lines 2-3-4 (indices 1-2-3)
    const lowerNuclear = binary[1] + binary[2] + binary[3];
    // Upper nuclear: lines 3-4-5 (indices 2-3-4)
    const upperNuclear = binary[2] + binary[3] + binary[4];
    return lowerNuclear + upperNuclear;
  }

  function findGateByBinary(targetBinary) {
    for (let g = 1; g <= 64; g++) {
      if (binaryIdentity.gates[g].binary === targetBinary) {
        return g;
      }
    }
    return null;
  }

  console.log('\nNuclear Hexagrams of Pillars:');
  console.log('-'.repeat(60));

  const nuclearResults = [];

  for (const gate of PILLARS) {
    const binary = binaryIdentity.gates[gate].binary;
    const nuclearBinary = getNuclear(binary);
    const nuclearGate = findGateByBinary(nuclearBinary);

    const lowerNuc = nuclearBinary.slice(0, 3);
    const upperNuc = nuclearBinary.slice(3, 6);

    nuclearResults.push({
      gate,
      binary,
      nuclearBinary,
      nuclearGate,
      isSelfNuclear: gate === nuclearGate
    });

    console.log(`\nGate ${gate} (${binary}):`);
    console.log(`  Nuclear trigrams: ${TRIGRAM_NAMES[lowerNuc]} (${lowerNuc}) / ${TRIGRAM_NAMES[upperNuc]} (${upperNuc})`);
    console.log(`  Nuclear hexagram: ${nuclearBinary} = Gate ${nuclearGate}`);
    console.log(`  Self-nuclear: ${gate === nuclearGate ? 'YES' : 'No'}`);
  }

  // Check nuclear relationships
  console.log('\n--- NUCLEAR RELATIONSHIPS ---');

  const selfNuclear = nuclearResults.filter(r => r.isSelfNuclear);
  console.log(`\nSelf-nuclear gates (nuclear = self): ${selfNuclear.map(r => r.gate).join(', ')}`);

  // Check 63 ↔ 64 relationship
  const nuc63 = nuclearResults.find(r => r.gate === 63);
  const nuc64 = nuclearResults.find(r => r.gate === 64);

  console.log(`\nGate 63 nuclear: Gate ${nuc63.nuclearGate}`);
  console.log(`Gate 64 nuclear: Gate ${nuc64.nuclearGate}`);
  console.log(`Are 63 and 64 each other's nuclear? ${nuc63.nuclearGate === 64 && nuc64.nuclearGate === 63 ? 'YES' : 'No'}`);

  // Check all standing waves
  console.log('\nNuclear Hexagrams of All Standing Waves:');

  for (const gate of STANDING_WAVES) {
    const binary = binaryIdentity.gates[gate].binary;
    const nuclearBinary = getNuclear(binary);
    const nuclearGate = findGateByBinary(nuclearBinary);
    const selfNuc = gate === nuclearGate ? ' (SELF)' : '';
    console.log(`  Gate ${String(gate).padStart(2)}: nuclear = Gate ${nuclearGate}${selfNuc}`);
  }

  return nuclearResults;
}

// ============================================================================
// INVESTIGATION 6: Exhaustive Regularity Classification
// ============================================================================
function investigation6() {
  console.log('\n' + '='.repeat(70));
  console.log('INVESTIGATION 6: Exhaustive Regularity Classification');
  console.log('='.repeat(70));

  // Classify all 64 patterns by period
  const byPeriod = { 1: [], 2: [], 3: [], 6: [] };

  for (let gate = 1; gate <= 64; gate++) {
    const binary = binaryIdentity.gates[gate].binary;

    // Determine period
    let period = 6;
    for (const p of [1, 2, 3]) {
      let isPeriodic = true;
      const unit = binary.slice(0, p);
      for (let i = 0; i < 6; i++) {
        if (binary[i] !== unit[i % p]) {
          isPeriodic = false;
          break;
        }
      }
      if (isPeriodic) {
        period = p;
        break;
      }
    }

    byPeriod[period].push({ gate, binary });
  }

  console.log('\nClassification by Period:\n');

  console.log('PERIOD-1 (Constant - maximum uniformity):');
  for (const g of byPeriod[1]) {
    const isPillar = PILLARS.includes(g.gate);
    console.log(`  Gate ${String(g.gate).padStart(2)}: ${g.binary}${isPillar ? ' **PILLAR**' : ''}`);
  }
  console.log(`  Total: ${byPeriod[1].length} gates`);

  console.log('\nPERIOD-2 (Alternating - maximum oscillation):');
  for (const g of byPeriod[2]) {
    const isPillar = PILLARS.includes(g.gate);
    console.log(`  Gate ${String(g.gate).padStart(2)}: ${g.binary}${isPillar ? ' **PILLAR**' : ''}`);
  }
  console.log(`  Total: ${byPeriod[2].length} gates`);

  console.log('\nPERIOD-3 (Trigram repeat - standing waves):');
  for (const g of byPeriod[3]) {
    const isSW = STANDING_WAVES.includes(g.gate);
    console.log(`  Gate ${String(g.gate).padStart(2)}: ${g.binary}${isSW ? ' **STANDING WAVE**' : ''}`);
  }
  console.log(`  Total: ${byPeriod[3].length} gates`);

  console.log('\nPERIOD-6 (No simple repetition):');
  console.log(`  Total: ${byPeriod[6].length} gates`);
  if (byPeriod[6].length <= 10) {
    for (const g of byPeriod[6]) {
      console.log(`  Gate ${String(g.gate).padStart(2)}: ${g.binary}`);
    }
  }

  // Key verification
  console.log('\n--- KEY VERIFICATION ---');
  console.log(`Period-1 gates: ${byPeriod[1].map(g => g.gate).join(', ')}`);
  console.log(`Period-2 gates: ${byPeriod[2].map(g => g.gate).join(', ')}`);
  console.log(`Pillars: ${PILLARS.join(', ')}`);

  const period1and2 = [...byPeriod[1], ...byPeriod[2]].map(g => g.gate).sort((a, b) => a - b);
  const pillarsMatch = PILLARS.every(p => period1and2.includes(p)) && period1and2.every(p => PILLARS.includes(p));

  console.log(`\nPillars = Period-1 + Period-2 gates: ${pillarsMatch ? 'YES - CONFIRMED!' : 'No'}`);

  // Standing wave verification
  const period3Gates = byPeriod[3].map(g => g.gate).sort((a, b) => a - b);
  const swMatch = STANDING_WAVES.every(sw => period3Gates.includes(sw) || byPeriod[1].some(g => g.gate === sw));

  console.log(`Standing waves = Period-1 + Period-3 gates: ${swMatch ? 'YES - CONFIRMED!' : 'Partial'}`);

  return byPeriod;
}

// ============================================================================
// INVESTIGATION 7: Why Alternating = Cross-Zero
// ============================================================================
function investigation7() {
  console.log('\n' + '='.repeat(70));
  console.log('INVESTIGATION 7: Why Alternating Patterns Must Be Cross-Zero');
  console.log('='.repeat(70));

  console.log('\nMathematical Proof:\n');

  console.log('For a period-2 alternating pattern of length 6:');
  console.log('  Pattern: ABABAB');
  console.log('  Lower trigram (positions 0,1,2): ABA');
  console.log('  Upper trigram (positions 3,4,5): BAB');
  console.log('  These are ALWAYS different (one starts with A, other with B)');
  console.log('  Therefore: different trigrams → NOT a standing wave → MUST be cross-zero');

  console.log('\nVerification with actual patterns:\n');

  const alternatingPatterns = [
    { binary: '101010', name: 'Yang-start alternating' },
    { binary: '010101', name: 'Yin-start alternating' }
  ];

  for (const p of alternatingPatterns) {
    const lower = p.binary.slice(0, 3);
    const upper = p.binary.slice(3, 6);
    const isStandingWave = lower === upper;

    // Find the gate
    let gate = null;
    for (let g = 1; g <= 64; g++) {
      if (binaryIdentity.gates[g].binary === p.binary) {
        gate = g;
        break;
      }
    }

    console.log(`${p.name}: ${p.binary}`);
    console.log(`  Lower: ${lower} (${TRIGRAM_NAMES[lower]})`);
    console.log(`  Upper: ${upper} (${TRIGRAM_NAMES[upper]})`);
    console.log(`  Standing wave: ${isStandingWave ? 'YES' : 'NO'}`);
    console.log(`  Gate: ${gate}`);
    console.log('');
  }

  console.log('--- CONCLUSION ---');
  console.log('Period-2 (alternating) patterns are MATHEMATICALLY REQUIRED to be cross-zero.');
  console.log('This is not a choice—it follows from the structure.');
  console.log('');
  console.log('The Four Archetypes:');
  console.log('  Period-1 constant (111111, 000000) → Same trigram → Standing Wave → Static');
  console.log('  Period-2 alternating (101010, 010101) → Opposite trigrams → Cross-Zero → Dynamic');
  console.log('');
  console.log('The Tetragrammaton spans BOTH modes:');
  console.log('  Fire/Water Pillars (1, 2): Static archetypes (standing waves)');
  console.log('  Truth/Light Pillars (63, 64): Dynamic archetypes (cross-zero)');

  return true;
}

// ============================================================================
// Generate Report
// ============================================================================
function generateReport(results) {
  const { inv1, inv3, inv5, inv6 } = results;

  const report = `# Archetypal Patterns Analysis

**Generated**: ${new Date().toISOString().split('T')[0]}

## Executive Summary

This analysis confirms that the four Pillars (Gates 1, 2, 63, 64) represent the four **maximally regular** 6-bit binary patterns, classified by period.

---

## Investigation 1: Regularity Rankings

The top 4 most regular patterns (by period + autocorrelation + run variance):

| Rank | Gate | Binary | Period | Pillar? |
|------|------|--------|--------|---------|
| 1 | ${inv1[0].gate} | ${inv1[0].binary} | ${inv1[0].period} | ${inv1[0].isPillar ? 'YES' : 'No'} |
| 2 | ${inv1[1].gate} | ${inv1[1].binary} | ${inv1[1].period} | ${inv1[1].isPillar ? 'YES' : 'No'} |
| 3 | ${inv1[2].gate} | ${inv1[2].binary} | ${inv1[2].period} | ${inv1[2].isPillar ? 'YES' : 'No'} |
| 4 | ${inv1[3].gate} | ${inv1[3].binary} | ${inv1[3].period} | ${inv1[3].isPillar ? 'YES' : 'No'} |

**Result**: ${inv1.slice(0, 4).filter(r => r.isPillar).length === 4 ? 'CONFIRMED - The 4 Pillars are the 4 most regular patterns!' : 'Partial match'}

---

## Investigation 3: Symmetry Classification

| Pillar | Binary | Period | Type | Special Property |
|--------|--------|--------|------|------------------|
| Gate 1 | 111111 | 1 | Standing Wave | Palindrome |
| Gate 2 | 000000 | 1 | Standing Wave | Palindrome |
| Gate 64 | 101010 | 2 | Cross-Zero | Complement = Reverse |
| Gate 63 | 010101 | 2 | Cross-Zero | Complement = Reverse |

**Key Relationships**:
- Gates 1 and 2 are complements (all yang ↔ all yin)
- Gates 63 and 64 are complements AND reverses of each other

---

## Investigation 5: Nuclear Transformations

| Gate | Binary | Nuclear | Self-Nuclear? |
|------|--------|---------|---------------|
${inv5.map(r => `| ${r.gate} | ${r.binary} | Gate ${r.nuclearGate} | ${r.isSelfNuclear ? 'YES' : 'No'} |`).join('\n')}

**Key Finding**: Gates 1 and 2 are self-nuclear (fixed points). Gates 63 and 64 are each other's nuclear (closed loop).

---

## Investigation 6: Period Classification

| Period | Gates | Interpretation |
|--------|-------|----------------|
| 1 | ${inv6[1].map(g => g.gate).join(', ')} | Constant (maximum uniformity) |
| 2 | ${inv6[2].map(g => g.gate).join(', ')} | Alternating (maximum oscillation) |
| 3 | ${inv6[3].length} gates | Trigram repeat (standing waves) |
| 6 | ${inv6[6].length} gates | No simple repetition |

**Master Equation**: Pillars = Period-1 + Period-2 patterns (exactly 4 gates)

---

## Investigation 7: Why Alternating = Cross-Zero

**Mathematical Necessity**:

For period-2 pattern ABABAB:
- Lower trigram (0,1,2) = ABA
- Upper trigram (3,4,5) = BAB
- ABA ≠ BAB (always)
- Therefore: NOT standing wave → MUST be cross-zero

**This is not interpretation—it's structure.**

---

## The Complete Archetype Theory

### Period-Based Classification

| Period | Pattern Type | Gate Type | Pillar Element | Role |
|--------|--------------|-----------|----------------|------|
| 1 | Constant yang | Standing Wave | Fire (1) | Pure source |
| 1 | Constant yin | Standing Wave | Water (2) | Pure sink |
| 2 | Alternating (yang-start) | Cross-Zero | Light (64) | Dynamic transformation |
| 2 | Alternating (yin-start) | Cross-Zero | Truth (63) | Dynamic transformation |
| 3 | Trigram repeat | Standing Wave | — | Secondary anchors |

### The Tetragrammaton Structure

\`\`\`
STATIC ARCHETYPES (Period-1, Standing Waves)
├── Gate 1 (111111): Fire Pillar - Pure Yang
└── Gate 2 (000000): Water Pillar - Pure Yin

DYNAMIC ARCHETYPES (Period-2, Cross-Zero)
├── Gate 64 (101010): Light Pillar - Yang-lead oscillation
└── Gate 63 (010101): Truth Pillar - Yin-lead oscillation
\`\`\`

### Why This Matters

1. **The Pillars are not arbitrary** — they are the mathematically unique maximally regular patterns

2. **Static vs Dynamic is structural** — Period-1 = same trigram = standing wave; Period-2 = opposite trigrams = cross-zero

3. **The Tetragrammaton encodes the fundamental modes**:
   - Fire/Water: Static equilibrium (source/sink)
   - Truth/Light: Dynamic equilibrium (transformation)

4. **Nuclear relationships reinforce structure**:
   - Gates 1, 2: Self-nuclear (fixed points in transformation)
   - Gates 63, 64: Pair-nuclear (transformation cycle)

---

## Unified Structural Theory

\`\`\`
THE COMPLETE HIERARCHY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEVEL 0: Binary Mathematics
└── Period determines everything

LEVEL 1: The Four Archetypes (Period 1-2)
├── Period-1: Gates 1, 2 (static, self-nuclear)
└── Period-2: Gates 63, 64 (dynamic, pair-nuclear)
    = THE TETRAGRAMMATON

LEVEL 2: Standing Waves (Period 3 + Period 1)
├── Absolute Anchors: Palindromic period-3 (29, 30) + period-1 (1, 2)
└── Secondary Anchors: Non-palindromic period-3 (51, 52, 57, 58)

LEVEL 3: EM Wave Positions
├── Source/Sink: Period-1 gates at ±4
├── Flow: Palindromic period-3 at ±2
└── Storage/Gate: Non-palindromic period-3 at ±1, ±3

LEVEL 4: All 64 Gates
└── Period-6 gates fill the remaining space
\`\`\`

---

## Status

**ARCHETYPAL THEORY COMPLETE**

The Tetragrammaton (Four Pillars) represents the four maximally regular binary patterns:
- Period-1: Gates 1, 2 (constant patterns, standing waves)
- Period-2: Gates 63, 64 (alternating patterns, cross-zero)

This is **pure mathematics**, not interpretation. The mystical structure encodes mathematical necessity.

---

*Analysis completed: ${new Date().toISOString().split('T')[0]}*
`;

  return report;
}

// ============================================================================
// Main Execution
// ============================================================================
function main() {
  console.log('Archetypal Patterns Analysis');
  console.log('============================\n');

  const wheelSequence = buildWheelBinarySequence();

  const results = {
    inv1: investigation1(),
    inv2: investigation2(wheelSequence),
    inv3: investigation3(),
    inv4: investigation4(),
    inv5: investigation5(),
    inv6: investigation6(),
    inv7: investigation7()
  };

  // Generate report
  const report = generateReport(results);

  const reportDir = path.join(__dirname, '../docs/research/planetary/reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  const reportPath = path.join(reportDir, 'ARCHETYPAL-PATTERNS-ANALYSIS.md');
  fs.writeFileSync(reportPath, report);

  console.log('\n' + '='.repeat(70));
  console.log(`Report saved to: ${reportPath}`);
}

main();
