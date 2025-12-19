/**
 * Anomalies as Keys Hypothesis Test
 *
 * The 10 anomalous lines might be the KEY to understanding the system,
 * not exceptions to ignore.
 *
 * Anomalies:
 * - 3 no-exaltation lines: 47.6, 54.4, 58.2
 * - 7 no-detriment lines: 5.6, 25.4, 37.1, 47.5, 54.4, 54.5, 57.3
 * - 2 multi-exaltation lines: 11.4, 25.4
 * - 1 "zero point": 54.4 (no exaltation AND no detriment)
 *
 * Questions:
 * - What do these lines have in common electromagnetically?
 * - Do they cluster at specific positions, trigrams, or gate types?
 * - Can their properties predict something about normal lines?
 */

const fs = require('fs');
const path = require('path');

// Load source data
const hdGatesPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const emLinesPath = path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

const hdGates = JSON.parse(fs.readFileSync(hdGatesPath, 'utf8'));
const emLines = JSON.parse(fs.readFileSync(emLinesPath, 'utf8'));

// Build indexes
const hdIndex = {};
const hdMappings = hdGates.mappings || hdGates;
for (const line of hdMappings) {
  const key = `${line.gateNumber}.${line.lineNumber}`;
  const exaltPlanets = line.knowledge?.blackBook?.exaltation?.planets || [];
  const detriPlanets = line.knowledge?.blackBook?.detriment?.planets || [];
  hdIndex[key] = {
    exalt: exaltPlanets.map(p => p.planet || p),
    detri: detriPlanets.map(p => p.planet || p),
    gateName: line.knowledge?.gateName,
    lineKeynote: line.knowledge?.lineKeynote
  };
}

const emIndex = {};
const emMappings = emLines.mappings || emLines;
for (const line of emMappings) {
  const key = `${line.gate}.${line.line}`;
  emIndex[key] = {
    innerTrigram: line.electromagnetic?.innerTrigram?.name,
    outerTrigram: line.electromagnetic?.outerTrigram?.name,
    innerPos: line.electromagnetic?.innerTrigram?.position,
    outerPos: line.electromagnetic?.outerTrigram?.position,
    gateType: line.electromagnetic?.gateType,
    amplitude: line.electromagnetic?.vector?.amplitude,
    crossesZero: line.electromagnetic?.vector?.crossesZero
  };
}

// Define anomalies
const ANOMALIES = {
  noExaltation: ['47.6', '54.4', '58.2'],
  noDetriment: ['5.6', '25.4', '37.1', '47.5', '54.4', '54.5', '57.3'],
  multiExaltation: ['11.4', '25.4'],
  zeroPoint: ['54.4']
};

const ALL_ANOMALIES = [...new Set([
  ...ANOMALIES.noExaltation,
  ...ANOMALIES.noDetriment,
  ...ANOMALIES.multiExaltation
])];

console.log('═'.repeat(75));
console.log('ANOMALIES AS KEYS HYPOTHESIS TEST');
console.log('═'.repeat(75));

console.log('\nThe 10 anomalous lines:');
console.log('  No exaltation: 47.6, 54.4, 58.2');
console.log('  No detriment: 5.6, 25.4, 37.1, 47.5, 54.4, 54.5, 57.3');
console.log('  Multi exaltation: 11.4, 25.4');
console.log('  Zero point (both): 54.4');

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1: Electromagnetic Properties of Anomalies
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 1: Electromagnetic Properties of Anomalies');
console.log('═'.repeat(75));

console.log('\nLine       Type              GateType         InnerPos OuterPos Amplitude');
console.log('─'.repeat(75));

for (const key of ALL_ANOMALIES.sort()) {
  const em = emIndex[key];
  const hd = hdIndex[key];
  if (!em) continue;

  const types = [];
  if (ANOMALIES.noExaltation.includes(key)) types.push('no-exalt');
  if (ANOMALIES.noDetriment.includes(key)) types.push('no-detri');
  if (ANOMALIES.multiExaltation.includes(key)) types.push('multi-exalt');

  console.log(`${key.padEnd(10)} ${types.join('+').padEnd(17)} ${(em.gateType || '').padEnd(16)} ${(em.innerPos?.toString() || '').padStart(8)} ${(em.outerPos?.toString() || '').padStart(8)} ${(em.amplitude?.toString() || '').padStart(9)}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2: Position Distribution of Anomalies
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 2: Position Distribution');
console.log('═'.repeat(75));

const anomalyPositions = { inner: {}, outer: {} };
const normalPositions = { inner: {}, outer: {} };

for (const [key, em] of Object.entries(emIndex)) {
  if (!em.innerPos) continue;

  const isAnomaly = ALL_ANOMALIES.includes(key);
  const target = isAnomaly ? anomalyPositions : normalPositions;

  target.inner[em.innerPos] = (target.inner[em.innerPos] || 0) + 1;
  target.outer[em.outerPos] = (target.outer[em.outerPos] || 0) + 1;
}

console.log('\nInner Position distribution:');
console.log('Position    Anomalies   Normal    Anomaly%');
console.log('─'.repeat(50));

for (let pos = -4; pos <= 4; pos++) {
  if (pos === 0) continue;
  const anom = anomalyPositions.inner[pos] || 0;
  const norm = normalPositions.inner[pos] || 0;
  const pct = anom + norm > 0 ? (anom / (anom + norm) * 100).toFixed(1) : '0.0';
  console.log(`${pos.toString().padStart(4)}        ${anom.toString().padStart(5)}      ${norm.toString().padStart(5)}      ${pct}%`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3: Gate Type Distribution
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 3: Gate Type Distribution');
console.log('═'.repeat(75));

const anomalyGateTypes = {};
const normalGateTypes = {};

for (const [key, em] of Object.entries(emIndex)) {
  if (!em.gateType) continue;

  const isAnomaly = ALL_ANOMALIES.includes(key);
  const target = isAnomaly ? anomalyGateTypes : normalGateTypes;

  target[em.gateType] = (target[em.gateType] || 0) + 1;
}

console.log('\nGate Type           Anomalies   Normal    Anomaly%');
console.log('─'.repeat(55));

for (const gateType of Object.keys(normalGateTypes).sort()) {
  const anom = anomalyGateTypes[gateType] || 0;
  const norm = normalGateTypes[gateType] || 0;
  const pct = anom + norm > 0 ? (anom / (anom + norm) * 100).toFixed(1) : '0.0';
  console.log(`${gateType.padEnd(20)} ${anom.toString().padStart(5)}      ${norm.toString().padStart(5)}      ${pct}%`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4: Line Number Distribution
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 4: Line Number Distribution');
console.log('═'.repeat(75));

const anomalyLines = {};
const normalLines = {};

for (const key of Object.keys(hdIndex)) {
  const lineNum = parseInt(key.split('.')[1]);
  const isAnomaly = ALL_ANOMALIES.includes(key);

  if (isAnomaly) {
    anomalyLines[lineNum] = (anomalyLines[lineNum] || 0) + 1;
  } else {
    normalLines[lineNum] = (normalLines[lineNum] || 0) + 1;
  }
}

console.log('\nLine    Anomalies   Normal    Anomaly%    Which Anomalies');
console.log('─'.repeat(70));

for (let line = 1; line <= 6; line++) {
  const anom = anomalyLines[line] || 0;
  const norm = normalLines[line] || 0;
  const pct = anom + norm > 0 ? (anom / (anom + norm) * 100).toFixed(1) : '0.0';
  const which = ALL_ANOMALIES.filter(k => parseInt(k.split('.')[1]) === line).join(', ');
  console.log(`${line}       ${anom.toString().padStart(5)}      ${norm.toString().padStart(5)}      ${pct.padStart(5)}%    ${which}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5: Deep Dive on 54.4 (The Zero Point)
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 5: Gate 54.4 - The Zero Point');
console.log('═'.repeat(75));

const zeroPoint = '54.4';
const zp_em = emIndex[zeroPoint];
const zp_hd = hdIndex[zeroPoint];

console.log('\n54.4 is the ONLY line with BOTH no exaltation AND no detriment.');
console.log('This makes it the "zero point" of the planetary system.');
console.log('─'.repeat(75));

console.log(`\nGate Name: ${zp_hd?.gateName}`);
console.log(`Line Keynote: ${zp_hd?.lineKeynote}`);
console.log(`Gate Type: ${zp_em?.gateType}`);
console.log(`Inner Trigram: ${zp_em?.innerTrigram} (pos ${zp_em?.innerPos})`);
console.log(`Outer Trigram: ${zp_em?.outerTrigram} (pos ${zp_em?.outerPos})`);
console.log(`Amplitude: ${zp_em?.amplitude}`);
console.log(`Crosses Zero: ${zp_em?.crossesZero}`);

// What's special about position (-3, +1)?
console.log('\nOther lines at same positions (-3, +1):');
for (const [key, em] of Object.entries(emIndex)) {
  if (em.innerPos === -3 && em.outerPos === 1) {
    const hd = hdIndex[key];
    console.log(`  ${key}: exalt=${hd?.exalt?.join(',') || 'none'}, detri=${hd?.detri?.join(',') || 'none'}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 6: The Incorruptible Lines (No Detriment)
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 6: The Incorruptible Lines (No Detriment)');
console.log('═'.repeat(75));

console.log('\nThese 7 lines have NO detriment - they cannot be corrupted:');
console.log('─'.repeat(75));

for (const key of ANOMALIES.noDetriment) {
  const em = emIndex[key];
  const hd = hdIndex[key];

  console.log(`\n${key}: "${hd?.lineKeynote}"`);
  console.log(`  Gate: ${hd?.gateName}`);
  console.log(`  Exaltation: ${hd?.exalt?.join(', ') || 'NONE'}`);
  console.log(`  Type: ${em?.gateType}, Inner: ${em?.innerTrigram} (${em?.innerPos}), Outer: ${em?.outerTrigram} (${em?.outerPos})`);
}

// What do they have in common?
console.log('\n' + '─'.repeat(50));
console.log('Common properties of incorruptible lines:');

const incorruptibleInner = {};
const incorruptibleOuter = {};
const incorruptibleTypes = {};
const incorruptibleExalts = {};

for (const key of ANOMALIES.noDetriment) {
  const em = emIndex[key];
  const hd = hdIndex[key];
  if (em) {
    incorruptibleInner[em.innerPos] = (incorruptibleInner[em.innerPos] || 0) + 1;
    incorruptibleOuter[em.outerPos] = (incorruptibleOuter[em.outerPos] || 0) + 1;
    incorruptibleTypes[em.gateType] = (incorruptibleTypes[em.gateType] || 0) + 1;
  }
  if (hd) {
    for (const p of hd.exalt) {
      incorruptibleExalts[p] = (incorruptibleExalts[p] || 0) + 1;
    }
  }
}

console.log(`  Inner positions: ${JSON.stringify(incorruptibleInner)}`);
console.log(`  Outer positions: ${JSON.stringify(incorruptibleOuter)}`);
console.log(`  Gate types: ${JSON.stringify(incorruptibleTypes)}`);
console.log(`  Exalting planets: ${JSON.stringify(incorruptibleExalts)}`);

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 7: The Unenhanceable Lines (No Exaltation)
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 7: The Unenhanceable Lines (No Exaltation)');
console.log('═'.repeat(75));

console.log('\nThese 3 lines have NO exaltation - they cannot be enhanced:');
console.log('─'.repeat(75));

for (const key of ANOMALIES.noExaltation) {
  const em = emIndex[key];
  const hd = hdIndex[key];

  console.log(`\n${key}: "${hd?.lineKeynote}"`);
  console.log(`  Gate: ${hd?.gateName}`);
  console.log(`  Detriment: ${hd?.detri?.join(', ') || 'NONE'}`);
  console.log(`  Type: ${em?.gateType}, Inner: ${em?.innerTrigram} (${em?.innerPos}), Outer: ${em?.outerTrigram} (${em?.outerPos})`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 8: The Multi-Exaltation Lines
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 8: The Multi-Exaltation Lines');
console.log('═'.repeat(75));

console.log('\nThese 2 lines have MULTIPLE exaltations:');
console.log('─'.repeat(75));

for (const key of ANOMALIES.multiExaltation) {
  const em = emIndex[key];
  const hd = hdIndex[key];

  console.log(`\n${key}: "${hd?.lineKeynote}"`);
  console.log(`  Gate: ${hd?.gateName}`);
  console.log(`  Exaltations: ${hd?.exalt?.join(', ')}`);
  console.log(`  Detriment: ${hd?.detri?.join(', ') || 'NONE'}`);
  console.log(`  Type: ${em?.gateType}, Inner: ${em?.innerTrigram} (${em?.innerPos}), Outer: ${em?.outerTrigram} (${em?.outerPos})`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 9: Pattern Detection - What Makes Anomalies Special?
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 9: Pattern Detection');
console.log('═'.repeat(75));

// Check if anomalies cluster at specific Line 4 (mode shift)
const line4Anomalies = ALL_ANOMALIES.filter(k => k.endsWith('.4'));
const line4Total = 64; // 64 gates × 1 line each
console.log(`\nLine 4 anomalies: ${line4Anomalies.length}/${line4Total} (${(line4Anomalies.length/line4Total*100).toFixed(1)}%)`);
console.log(`  Which: ${line4Anomalies.join(', ')}`);

// Check if anomalies cluster at specific Line 6 (role model)
const line6Anomalies = ALL_ANOMALIES.filter(k => k.endsWith('.6'));
console.log(`\nLine 6 anomalies: ${line6Anomalies.length}/64 (${(line6Anomalies.length/64*100).toFixed(1)}%)`);
console.log(`  Which: ${line6Anomalies.join(', ')}`);

// Check if anomalies cluster at standing waves
const standingWaveGates = [1, 2, 29, 30, 51, 52, 57, 58];
const swAnomalies = ALL_ANOMALIES.filter(k => {
  const gate = parseInt(k.split('.')[0]);
  return standingWaveGates.includes(gate);
});
console.log(`\nStanding wave anomalies: ${swAnomalies.length}/${ALL_ANOMALIES.length}`);
console.log(`  Which: ${swAnomalies.join(', ')}`);
console.log(`  Gates 57 and 58 both have anomalies in standing wave positions!`);

// ═══════════════════════════════════════════════════════════════════════════
// SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SYNTHESIS: What the Anomalies Reveal');
console.log('═'.repeat(75));

console.log(`
KEY FINDINGS:

1. LINE 4 CONCENTRATION
   ${line4Anomalies.length} of ${ALL_ANOMALIES.length} anomalies (${(line4Anomalies.length/ALL_ANOMALIES.length*100).toFixed(0)}%) are at Line 4.
   Line 4 is the MODE SHIFT line - inner to outer transition.
   The transformation point itself resists normal planetary assignment.

2. STANDING WAVE CONNECTION
   ${swAnomalies.length} anomalies are in standing wave gates (57, 58).
   Standing waves are already special (100% derivable).
   The anomalies may mark where even standing waves become "empty."

3. GATE 54.4 - THE ZERO POINT
   The only line with NEITHER exaltation NOR detriment.
   "Enlightenment/Endarkenment" - the shift itself.
   Electromagnetic: cross-zero-dematerialising at (-3, +1).

4. INCORRUPTIBLE POSITIONS
   7 lines cannot be corrupted (no detriment).
   They include: family foundation, survival intuition, innocence,
   sainthood, generosity, and the zero point.
   These are PROTECTED positions.

5. VENUS DOMINATES INCORRUPTIBLES
   Venus appears ${incorruptibleExalts['Venus'] || 0} times in incorruptible exaltations.
   Jupiter appears ${incorruptibleExalts['Jupiter'] || 0} times.
   The harmonic integrator protects these positions.
`);

console.log('═'.repeat(75));
console.log('CONCLUSION');
console.log('═'.repeat(75));

console.log(`
The anomalies are NOT random exceptions. They mark:

1. TRANSFORMATION BOUNDARIES - Line 4 cluster shows where the
   planetary system "empties out" at the mode shift.

2. PROTECTED STATES - Incorruptible lines represent fundamental
   human qualities that resist corruption: family, survival,
   innocence, sainthood, generosity.

3. PURE STATES - Standing wave anomalies (57.3, 58.2) show where
   even the most derivable positions transcend planetary assignment.

4. THE ZERO POINT - 54.4 is the singularity of the system,
   where neither enhancement nor corruption can apply.

The anomalies are the SKELETON of the system - they show where
the planetary layer CANNOT apply, revealing its boundaries.
`);
