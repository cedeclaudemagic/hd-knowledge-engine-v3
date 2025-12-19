#!/usr/bin/env node

/**
 * Deep Analysis of Gate 54 - The Marrying Maiden
 *
 * Gate 54 has TWO anomalous lines:
 * - 54.4: No exaltation, no detriment (the ONLY such line in the system)
 * - 54.5: Neptune exalted, no detriment
 *
 * This script investigates what makes Gate 54 electromagnetically special.
 */

const fs = require('fs');
const path = require('path');

// Load data sources
const tradGatesPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const tradGatesData = JSON.parse(fs.readFileSync(tradGatesPath, 'utf8'));

const emLinesPath = path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');
const emLinesData = JSON.parse(fs.readFileSync(emLinesPath, 'utf8'));

// Get Gate 54 data
const gate54Lines = tradGatesData.mappings.filter(m => m.gateNumber === 54 && m.lineNumber !== null);
const gate54EM = emLinesData.mappings.filter(l => l.gate === 54);
const gate54Info = tradGatesData.mappings.find(m => m.gateNumber === 54 && m.lineNumber === null);

console.log('='.repeat(80));
console.log('GATE 54 DEEP ANALYSIS - THE MARRYING MAIDEN');
console.log('='.repeat(80));

// Gate overview
console.log('\n## GATE OVERVIEW ##\n');
console.log(`Gate Name: ${gate54Info?.knowledge?.gateName}`);
console.log(`Keyword: ${gate54Info?.knowledge?.gateKeyword}`);
console.log(`Centre: ${gate54EM[0]?.context?.centre}`);
console.log(`Circuit: ${gate54EM[0]?.context?.circuits?.[0]}`);
console.log(`Channel: ${gate54Info?.knowledge?.channel} - ${gate54Info?.knowledge?.channelName}`);
console.log(`Harmonic Gate: ${gate54Info?.knowledge?.harmonicGate} (${gate54Info?.knowledge?.harmonicGateName})`);

// Electromagnetic structure
const em = gate54EM[0]?.electromagnetic;
console.log('\n## ELECTROMAGNETIC STRUCTURE ##\n');
console.log(`Gate Type: ${em?.gateType}`);
console.log(`Inner Trigram: ${em?.innerTrigram?.name} (${em?.innerTrigram?.position})`);
console.log(`Outer Trigram: ${em?.outerTrigram?.name} (${em?.outerTrigram?.position})`);
console.log(`Vector: ${em?.vector?.from} → ${em?.vector?.to}`);
console.log(`Amplitude: ${em?.vector?.amplitude}`);
console.log(`Direction: ${em?.vector?.direction}`);
console.log(`Crosses Zero: ${em?.vector?.crossesZero}`);
console.log(`Language Type: ${em?.languageType}`);

// All 6 lines
console.log('\n## ALL 6 LINES OF GATE 54 ##\n');

gate54Lines.forEach(line => {
  const emLine = gate54EM.find(l => l.line === line.lineNumber);
  const exaltPlanets = line.knowledge?.blackBook?.exaltation?.planets || [];
  const detriPlanets = line.knowledge?.blackBook?.detriment?.planets || [];

  console.log(`--- Line ${line.lineNumber}: ${line.knowledge?.lineKeynote} ---`);
  console.log(`  Polarity: ${line.knowledge?.polarity}`);
  console.log(`  Position: ${emLine?.interpretation?.linePosition}`);
  console.log(`  Exaltation: ${exaltPlanets.length > 0 ? exaltPlanets.map(p => p.planet).join(' + ') : 'NONE'}`);
  console.log(`  Detriment: ${detriPlanets.length > 0 ? detriPlanets.map(p => p.planet).join(' + ') : 'NONE'}`);

  if (exaltPlanets.length > 0) {
    exaltPlanets.forEach(p => {
      console.log(`    ${p.planet}: "${p.description?.blackBook}"`);
    });
  }
  if (detriPlanets.length > 0) {
    detriPlanets.forEach(p => {
      console.log(`    ${p.planet}: "${p.description?.blackBook}"`);
    });
  }
  console.log('');
});

// Analyze the anomalous lines specifically
console.log('\n## ANOMALY ANALYSIS ##\n');

// Line 4 - The zero point
const line4 = gate54Lines.find(l => l.lineNumber === 4);
const line4EM = gate54EM.find(l => l.line === 4);
console.log('### 54.4 - ENLIGHTENMENT/ENDARKENMENT (THE ZERO POINT) ###\n');
console.log(`Position: ${line4EM?.interpretation?.linePosition}`);
console.log(`Position Meaning: ${line4EM?.interpretation?.positionMeaning}`);
console.log(`Line Function: ${line4EM?.interpretation?.lineFunction}`);
console.log(`Shadow: ${line4EM?.interpretation?.shadow}`);
console.log(`\nBlack Book Description:`);
const l4exalt = line4?.knowledge?.blackBook?.exaltation;
const l4detri = line4?.knowledge?.blackBook?.detriment;
console.log(`  Exaltation planets: ${l4exalt?.planets?.length || 0}`);
console.log(`  Detriment planets: ${l4detri?.planets?.length || 0}`);

// Line 5 - Neptune, no detriment
const line5 = gate54Lines.find(l => l.lineNumber === 5);
const line5EM = gate54EM.find(l => l.line === 5);
console.log('\n### 54.5 - MAGNANIMITY (NO DETRIMENT) ###\n');
console.log(`Position: ${line5EM?.interpretation?.linePosition}`);
console.log(`Position Meaning: ${line5EM?.interpretation?.positionMeaning}`);
console.log(`Line Function: ${line5EM?.interpretation?.lineFunction}`);
console.log(`Shadow: ${line5EM?.interpretation?.shadow}`);
const l5exalt = line5?.knowledge?.blackBook?.exaltation?.planets;
const l5detri = line5?.knowledge?.blackBook?.detriment?.planets;
console.log(`\nExaltation: ${l5exalt?.map(p => p.planet).join(', ') || 'NONE'}`);
if (l5exalt?.length > 0) {
  console.log(`  "${l5exalt[0].description?.blackBook}"`);
}
console.log(`Detriment: ${l5detri?.length > 0 ? l5detri.map(p => p.planet).join(', ') : 'NONE'}`);

// Compare to other gates in the same position
console.log('\n## COMPARATIVE ANALYSIS ##\n');

// Find all cross-zero-manifesting gates
const crossZeroManifesting = emLinesData.mappings.filter(l =>
  l.electromagnetic?.gateType === 'cross-zero-manifesting' && l.line === 1
).map(l => l.gate);

console.log('All cross-zero-manifesting gates:', [...new Set(crossZeroManifesting)].sort((a,b) => a-b).join(', '));

// Find all gates with Lake → Thunder transition
const lakethunder = emLinesData.mappings.filter(l =>
  l.electromagnetic?.innerTrigram?.name === 'Lake' &&
  l.electromagnetic?.outerTrigram?.name === 'Thunder' &&
  l.line === 1
);
console.log(`\nGates with Lake (-3) → Thunder (+1): ${lakethunder.map(l => l.gate).join(', ')}`);

// Compare Line 4 across all cross-zero gates
console.log('\n## LINE 4 COMPARISON (Cross-Zero Gates) ##\n');

const crossZeroGates = [...new Set(emLinesData.mappings
  .filter(l => l.electromagnetic?.vector?.crossesZero)
  .map(l => l.gate))];

console.log(`Total cross-zero gates: ${crossZeroGates.length}`);

// Get Line 4 planetary data for all cross-zero gates
const line4Comparison = [];
crossZeroGates.forEach(gateNum => {
  const tradLine = tradGatesData.mappings.find(m => m.gateNumber === gateNum && m.lineNumber === 4);
  const emLine = emLinesData.mappings.find(l => l.gate === gateNum && l.line === 4);

  if (tradLine && emLine) {
    const exalt = tradLine.knowledge?.blackBook?.exaltation?.planets || [];
    const detri = tradLine.knowledge?.blackBook?.detriment?.planets || [];

    line4Comparison.push({
      gate: gateNum,
      keynote: tradLine.knowledge?.lineKeynote,
      gateType: emLine.electromagnetic?.gateType,
      inner: emLine.electromagnetic?.innerTrigram?.name,
      outer: emLine.electromagnetic?.outerTrigram?.name,
      exaltCount: exalt.length,
      detriCount: detri.length,
      exaltPlanets: exalt.map(p => p.planet),
      detriPlanets: detri.map(p => p.planet),
      anomaly: (exalt.length === 0 || detri.length === 0 || exalt.length > 1) ? 'YES' : ''
    });
  }
});

// Sort by anomaly status
line4Comparison.sort((a, b) => {
  if (a.anomaly && !b.anomaly) return -1;
  if (!a.anomaly && b.anomaly) return 1;
  return a.gate - b.gate;
});

console.log('\nLine 4 in Cross-Zero Gates:\n');
line4Comparison.forEach(l => {
  const exStr = l.exaltCount === 0 ? 'NONE' : l.exaltPlanets.join('+');
  const detStr = l.detriCount === 0 ? 'NONE' : l.detriPlanets.join('+');
  const flag = l.anomaly ? ' <<<' : '';
  console.log(`Gate ${l.gate}.4 (${l.keynote}): ${l.inner}→${l.outer} | E: ${exStr} | D: ${detStr}${flag}`);
});

// Count anomalies at Line 4
const l4Anomalies = line4Comparison.filter(l => l.anomaly);
console.log(`\nAnomalies at Line 4 in cross-zero gates: ${l4Anomalies.length} / ${line4Comparison.length}`);

// Channel 32-54 analysis
console.log('\n## CHANNEL 32-54 ANALYSIS ##\n');

// Get Gate 32 data
const gate32Lines = tradGatesData.mappings.filter(m => m.gateNumber === 32 && m.lineNumber !== null);
const gate32EM = emLinesData.mappings.filter(l => l.gate === 32);

console.log('Gate 32 - Duration (Harmonic to Gate 54):\n');
gate32Lines.forEach(line => {
  const exalt = line.knowledge?.blackBook?.exaltation?.planets || [];
  const detri = line.knowledge?.blackBook?.detriment?.planets || [];
  const exStr = exalt.length === 0 ? 'NONE' : exalt.map(p => p.planet).join('+');
  const detStr = detri.length === 0 ? 'NONE' : detri.map(p => p.planet).join('+');
  console.log(`  32.${line.lineNumber} (${line.knowledge?.lineKeynote}): E: ${exStr} | D: ${detStr}`);
});

// Save analysis
const outputPath = path.join(__dirname, '../docs/research/gate54-anomaly-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify({
  gate: 54,
  name: 'The Marrying Maiden',
  keyword: gate54Info?.knowledge?.gateKeyword,
  electromagnetic: {
    gateType: em?.gateType,
    innerTrigram: em?.innerTrigram,
    outerTrigram: em?.outerTrigram,
    vector: em?.vector
  },
  lines: gate54Lines.map(l => ({
    line: l.lineNumber,
    keynote: l.knowledge?.lineKeynote,
    polarity: l.knowledge?.polarity,
    exaltation: l.knowledge?.blackBook?.exaltation?.planets || [],
    detriment: l.knowledge?.blackBook?.detriment?.planets || []
  })),
  anomalies: {
    line4: {
      keynote: 'Enlightenment/Endarkenment',
      status: 'No exaltation, no detriment - UNIQUE in system',
      position: line4EM?.interpretation
    },
    line5: {
      keynote: 'Magnanimity',
      status: 'Neptune exalted, no detriment',
      position: line5EM?.interpretation
    }
  },
  line4Comparison: line4Comparison
}, null, 2));

console.log(`\nData saved to: ${outputPath}`);
