#!/usr/bin/env node

/**
 * Deep Analysis of No-Exaltation Lines
 *
 * 3 lines have detriment but no exaltation:
 * - 47.6, 54.4, 58.2
 *
 * This script investigates their electromagnetic commonality.
 */

const fs = require('fs');
const path = require('path');

// Load data sources
const tradGatesPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const tradGatesData = JSON.parse(fs.readFileSync(tradGatesPath, 'utf8'));

const emLinesPath = path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');
const emLinesData = JSON.parse(fs.readFileSync(emLinesPath, 'utf8'));

// Find all no-exaltation lines
const noExaltLines = [];

tradGatesData.mappings.forEach(entry => {
  if (entry.lineNumber === null) return;

  const exaltPlanets = entry.knowledge?.blackBook?.exaltation?.planets || [];
  if (exaltPlanets.length === 0) {
    const emLine = emLinesData.mappings.find(l => l.gate === entry.gateNumber && l.line === entry.lineNumber);
    const detriPlanets = entry.knowledge?.blackBook?.detriment?.planets || [];

    noExaltLines.push({
      gate: entry.gateNumber,
      line: entry.lineNumber,
      gateName: emLine?.gateName,
      keynote: entry.knowledge?.lineKeynote,
      polarity: entry.knowledge?.polarity,
      gateType: emLine?.electromagnetic?.gateType,
      centre: emLine?.context?.centre,
      circuit: emLine?.context?.circuits?.[0],
      innerTrigram: emLine?.electromagnetic?.innerTrigram?.name,
      outerTrigram: emLine?.electromagnetic?.outerTrigram?.name,
      innerPosition: emLine?.electromagnetic?.innerTrigram?.position,
      outerPosition: emLine?.electromagnetic?.outerTrigram?.position,
      linePosition: emLine?.interpretation?.linePosition,
      positionMeaning: emLine?.interpretation?.positionMeaning,
      lineFunction: emLine?.interpretation?.lineFunction,
      crossesZero: emLine?.electromagnetic?.vector?.crossesZero,
      amplitude: emLine?.electromagnetic?.vector?.amplitude,
      detriPlanets: detriPlanets.map(p => p.planet),
      detriDescriptions: detriPlanets.map(p => ({ planet: p.planet, desc: p.description?.blackBook }))
    });
  }
});

console.log('='.repeat(80));
console.log('NO-EXALTATION LINES DEEP ANALYSIS');
console.log('='.repeat(80));

console.log(`\nTotal no-exaltation lines: ${noExaltLines.length}\n`);

// Detailed output for each line
noExaltLines.forEach(l => {
  console.log('='.repeat(60));
  console.log(`GATE ${l.gate}.${l.line} - ${l.gateName}: ${l.keynote}`);
  console.log('='.repeat(60));
  console.log(`Centre: ${l.centre}`);
  console.log(`Circuit: ${l.circuit}`);
  console.log(`Gate Type: ${l.gateType}`);
  console.log(`Trigrams: ${l.innerTrigram} (${l.innerPosition}) → ${l.outerTrigram} (${l.outerPosition})`);
  console.log(`Crosses Zero: ${l.crossesZero}`);
  console.log(`Amplitude: ${l.amplitude}`);
  console.log(`Line Position: ${l.linePosition}`);
  console.log(`Position Meaning: ${l.positionMeaning}`);
  console.log(`Polarity: ${l.polarity}`);
  console.log(`\nDetriment: ${l.detriPlanets.length > 0 ? l.detriPlanets.join(' + ') : 'NONE'}`);
  l.detriDescriptions.forEach(d => {
    console.log(`  ${d.planet}: "${d.desc}"`);
  });
  console.log('');
});

// Pattern analysis
console.log('='.repeat(80));
console.log('PATTERN ANALYSIS');
console.log('='.repeat(80));

// By Gate Type
console.log('\n## By Gate Type ##\n');
const byGateType = {};
noExaltLines.forEach(l => {
  byGateType[l.gateType] = byGateType[l.gateType] || [];
  byGateType[l.gateType].push(`${l.gate}.${l.line}`);
});
Object.entries(byGateType).forEach(([type, lines]) => {
  console.log(`${type}: ${lines.length}`);
  console.log(`  Lines: ${lines.join(', ')}`);
});

// By Centre
console.log('\n## By Centre ##\n');
const byCentre = {};
noExaltLines.forEach(l => {
  byCentre[l.centre] = byCentre[l.centre] || [];
  byCentre[l.centre].push(`${l.gate}.${l.line}`);
});
Object.entries(byCentre).forEach(([centre, lines]) => {
  console.log(`${centre}: ${lines.length}`);
  console.log(`  Lines: ${lines.join(', ')}`);
});

// By Circuit
console.log('\n## By Circuit ##\n');
const byCircuit = {};
noExaltLines.forEach(l => {
  byCircuit[l.circuit] = byCircuit[l.circuit] || [];
  byCircuit[l.circuit].push(`${l.gate}.${l.line}`);
});
Object.entries(byCircuit).forEach(([circuit, lines]) => {
  console.log(`${circuit}: ${lines.length}`);
  console.log(`  Lines: ${lines.join(', ')}`);
});

// By Line Position
console.log('\n## By Line Number ##\n');
const byLine = {};
noExaltLines.forEach(l => {
  byLine[l.line] = byLine[l.line] || [];
  byLine[l.line].push(`${l.gate}.${l.line}`);
});
Object.entries(byLine).sort((a, b) => a[0] - b[0]).forEach(([line, lines]) => {
  console.log(`Line ${line}: ${lines.length}`);
  console.log(`  Lines: ${lines.join(', ')}`);
});

// By Detriment Planet
console.log('\n## By Detriment Planet ##\n');
const byPlanet = {};
noExaltLines.forEach(l => {
  l.detriPlanets.forEach(p => {
    byPlanet[p] = byPlanet[p] || [];
    byPlanet[p].push(`${l.gate}.${l.line}`);
  });
  if (l.detriPlanets.length === 0) {
    byPlanet['NONE'] = byPlanet['NONE'] || [];
    byPlanet['NONE'].push(`${l.gate}.${l.line}`);
  }
});
Object.entries(byPlanet).forEach(([planet, lines]) => {
  console.log(`${planet}: ${lines.length}`);
  console.log(`  Lines: ${lines.join(', ')}`);
});

// Keynote analysis - looking for dark themes
console.log('\n## Keynote Themes ##\n');
noExaltLines.forEach(l => {
  console.log(`${l.gate}.${l.line}: "${l.keynote}"`);
});

// Compare to all Line 6 and Line 2 positions
console.log('\n## COMPARISON: All Lines at Same Positions ##\n');

const positions = [...new Set(noExaltLines.map(l => l.line))];
positions.forEach(lineNum => {
  const allAtPosition = tradGatesData.mappings.filter(m => m.lineNumber === lineNum);
  const noExaltAtPosition = allAtPosition.filter(m => {
    const exalt = m.knowledge?.blackBook?.exaltation?.planets || [];
    return exalt.length === 0;
  });
  console.log(`Line ${lineNum}: ${noExaltAtPosition.length} / ${allAtPosition.length} have no exaltation (${(noExaltAtPosition.length/allAtPosition.length*100).toFixed(1)}%)`);
});

// Save analysis
const outputPath = path.join(__dirname, '../docs/research/no-exaltation-lines-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify({
  summary: {
    totalLines: noExaltLines.length,
    byGateType,
    byCentre,
    byCircuit,
    byLine,
    byPlanet
  },
  lines: noExaltLines
}, null, 2));

console.log(`\nData saved to: ${outputPath}`);
