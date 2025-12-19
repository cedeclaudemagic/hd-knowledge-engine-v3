#!/usr/bin/env node

/**
 * Deep Analysis of Line 4 in Cross-Zero Gates
 *
 * Line 4 = entry-outer = mode shift position
 * Both multiple-exaltation lines are Line 4 in cross-zero gates
 * The zero point (54.4) is also Line 4 in a cross-zero gate
 *
 * This script investigates all Line 4 positions in cross-zero gates.
 */

const fs = require('fs');
const path = require('path');

// Load data sources
const tradGatesPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const tradGatesData = JSON.parse(fs.readFileSync(tradGatesPath, 'utf8'));

const emLinesPath = path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');
const emLinesData = JSON.parse(fs.readFileSync(emLinesPath, 'utf8'));

// Find all cross-zero gates
const crossZeroGates = [...new Set(emLinesData.mappings
  .filter(l => l.electromagnetic?.vector?.crossesZero)
  .map(l => l.gate))];

console.log('='.repeat(80));
console.log('LINE 4 IN CROSS-ZERO GATES - DEEP ANALYSIS');
console.log('='.repeat(80));

console.log(`\nTotal cross-zero gates: ${crossZeroGates.length}`);

// Analyze all Line 4s in cross-zero gates
const line4Analysis = [];

crossZeroGates.forEach(gateNum => {
  const tradLine = tradGatesData.mappings.find(m => m.gateNumber === gateNum && m.lineNumber === 4);
  const emLine = emLinesData.mappings.find(l => l.gate === gateNum && l.line === 4);

  if (tradLine && emLine) {
    const exalt = tradLine.knowledge?.blackBook?.exaltation?.planets || [];
    const detri = tradLine.knowledge?.blackBook?.detriment?.planets || [];

    line4Analysis.push({
      gate: gateNum,
      gateName: emLine.gateName,
      keynote: tradLine.knowledge?.lineKeynote,
      polarity: tradLine.knowledge?.polarity,
      gateType: emLine.electromagnetic?.gateType,
      innerTrigram: emLine.electromagnetic?.innerTrigram?.name,
      outerTrigram: emLine.electromagnetic?.outerTrigram?.name,
      innerPosition: emLine.electromagnetic?.innerTrigram?.position,
      outerPosition: emLine.electromagnetic?.outerTrigram?.position,
      amplitude: emLine.electromagnetic?.vector?.amplitude,
      direction: emLine.electromagnetic?.vector?.direction,
      centre: emLine.context?.centre,
      circuit: emLine.context?.circuits?.[0],
      exaltCount: exalt.length,
      detriCount: detri.length,
      exaltPlanets: exalt.map(p => p.planet),
      detriPlanets: detri.map(p => p.planet),
      exaltDescs: exalt.map(p => p.description?.blackBook),
      detriDescs: detri.map(p => p.description?.blackBook),
      anomalyType: (exalt.length === 0 && detri.length === 0) ? 'ZERO_POINT' :
                   (exalt.length === 0) ? 'NO_EXALT' :
                   (detri.length === 0) ? 'NO_DETRI' :
                   (exalt.length > 1) ? 'MULTI_EXALT' :
                   (detri.length > 1) ? 'MULTI_DETRI' : 'NORMAL'
    });
  }
});

// Sort by anomaly type first, then by gate number
const sortOrder = { 'ZERO_POINT': 0, 'MULTI_EXALT': 1, 'NO_DETRI': 2, 'NO_EXALT': 3, 'NORMAL': 4 };
line4Analysis.sort((a, b) => {
  if (sortOrder[a.anomalyType] !== sortOrder[b.anomalyType]) {
    return sortOrder[a.anomalyType] - sortOrder[b.anomalyType];
  }
  return a.gate - b.gate;
});

// Output all Line 4s
console.log('\n## ALL LINE 4 IN CROSS-ZERO GATES ##\n');

line4Analysis.forEach(l => {
  const flag = l.anomalyType !== 'NORMAL' ? ` <<< ${l.anomalyType}` : '';
  console.log(`Gate ${l.gate}.4 (${l.gateName}) - ${l.keynote}${flag}`);
  console.log(`  ${l.innerTrigram} (${l.innerPosition}) → ${l.outerTrigram} (${l.outerPosition}) | Amp: ${l.amplitude}`);
  console.log(`  Centre: ${l.centre} | Circuit: ${l.circuit}`);
  console.log(`  Exalt: ${l.exaltCount === 0 ? 'NONE' : l.exaltPlanets.join(' + ')}`);
  console.log(`  Detri: ${l.detriCount === 0 ? 'NONE' : l.detriPlanets.join(' + ')}`);
  console.log('');
});

// Anomaly summary
console.log('='.repeat(80));
console.log('ANOMALY SUMMARY');
console.log('='.repeat(80));

const anomalies = line4Analysis.filter(l => l.anomalyType !== 'NORMAL');
console.log(`\nAnomalous Line 4s: ${anomalies.length} / ${line4Analysis.length}\n`);

anomalies.forEach(l => {
  console.log(`${l.gate}.4 (${l.keynote}) - ${l.anomalyType}`);
  console.log(`  Transition: ${l.innerTrigram} → ${l.outerTrigram}`);
  console.log(`  Amplitude: ${l.amplitude}`);
  if (l.exaltCount > 0) {
    console.log(`  Exalt: ${l.exaltPlanets.join(' + ')}`);
  }
  if (l.detriCount > 0) {
    console.log(`  Detri: ${l.detriPlanets.join(' + ')}`);
  }
  console.log('');
});

// Pattern analysis for anomalies
console.log('='.repeat(80));
console.log('ANOMALY PATTERN ANALYSIS');
console.log('='.repeat(80));

// By amplitude
console.log('\n## Anomalies by Amplitude ##\n');
const anomalyByAmp = {};
anomalies.forEach(l => {
  anomalyByAmp[l.amplitude] = anomalyByAmp[l.amplitude] || [];
  anomalyByAmp[l.amplitude].push(`${l.gate}.4 (${l.anomalyType})`);
});
Object.entries(anomalyByAmp).sort((a, b) => b[0] - a[0]).forEach(([amp, lines]) => {
  console.log(`Amplitude ${amp}: ${lines.join(', ')}`);
});

// Compare: What do anomalous vs normal Line 4s have in common?
console.log('\n## Normal vs Anomalous Line 4 Comparison ##\n');

const normal = line4Analysis.filter(l => l.anomalyType === 'NORMAL');

// Amplitude distribution
const normalAmps = normal.map(l => l.amplitude);
const anomalyAmps = anomalies.map(l => l.amplitude);
console.log(`Normal Line 4 average amplitude: ${(normalAmps.reduce((a,b)=>a+b,0)/normalAmps.length).toFixed(2)}`);
console.log(`Anomaly Line 4 average amplitude: ${(anomalyAmps.reduce((a,b)=>a+b,0)/anomalyAmps.length).toFixed(2)}`);

// Gate type distribution
console.log('\n## By Gate Type ##\n');
const typeDistNormal = {};
const typeDistAnomaly = {};
normal.forEach(l => { typeDistNormal[l.gateType] = (typeDistNormal[l.gateType] || 0) + 1; });
anomalies.forEach(l => { typeDistAnomaly[l.gateType] = (typeDistAnomaly[l.gateType] || 0) + 1; });

console.log('Normal Line 4s:');
Object.entries(typeDistNormal).forEach(([t, c]) => console.log(`  ${t}: ${c}`));
console.log('Anomaly Line 4s:');
Object.entries(typeDistAnomaly).forEach(([t, c]) => console.log(`  ${t}: ${c}`));

// Most common exaltation planets at normal Line 4
console.log('\n## Exaltation Planets at Normal Line 4 ##\n');
const exaltPlanetCount = {};
normal.forEach(l => {
  l.exaltPlanets.forEach(p => {
    exaltPlanetCount[p] = (exaltPlanetCount[p] || 0) + 1;
  });
});
Object.entries(exaltPlanetCount).sort((a,b) => b[1] - a[1]).forEach(([p, c]) => {
  console.log(`  ${p}: ${c}`);
});

// Most common detriment planets at normal Line 4
console.log('\n## Detriment Planets at Normal Line 4 ##\n');
const detriPlanetCount = {};
normal.forEach(l => {
  l.detriPlanets.forEach(p => {
    detriPlanetCount[p] = (detriPlanetCount[p] || 0) + 1;
  });
});
Object.entries(detriPlanetCount).sort((a,b) => b[1] - a[1]).forEach(([p, c]) => {
  console.log(`  ${p}: ${c}`);
});

// Venus analysis (appears in both multi-exalt lines)
console.log('\n## VENUS AT LINE 4 ##\n');
const venusLine4 = line4Analysis.filter(l =>
  l.exaltPlanets.includes('Venus') || l.detriPlanets.includes('Venus')
);
console.log(`Venus appears at ${venusLine4.length} Line 4 positions:\n`);
venusLine4.forEach(l => {
  const role = l.exaltPlanets.includes('Venus') ? 'EXALT' : 'DETRI';
  console.log(`  ${l.gate}.4 (${l.keynote}) - Venus ${role}`);
});

// Trigram transition analysis
console.log('\n## TRIGRAM TRANSITIONS AT ANOMALY LINE 4 ##\n');
anomalies.forEach(l => {
  console.log(`${l.gate}.4: ${l.innerTrigram} (${l.innerPosition}) → ${l.outerTrigram} (${l.outerPosition})`);
  console.log(`  Type: ${l.gateType}`);
  console.log(`  Anomaly: ${l.anomalyType}`);
});

// Save analysis
const outputPath = path.join(__dirname, '../docs/research/line4-crosszero-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify({
  summary: {
    totalCrossZeroGates: crossZeroGates.length,
    anomalyCount: anomalies.length,
    normalCount: normal.length
  },
  anomalies: anomalies,
  allLine4: line4Analysis
}, null, 2));

console.log(`\nData saved to: ${outputPath}`);
