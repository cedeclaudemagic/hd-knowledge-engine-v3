#!/usr/bin/env node

/**
 * Deep Analysis of No-Detriment Lines
 *
 * 7 lines have exaltation but no detriment:
 * - 5.6, 25.4, 37.1, 47.5, 54.4, 54.5, 57.3
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

// Find all no-detriment lines
const noDetriLines = [];

tradGatesData.mappings.forEach(entry => {
  if (entry.lineNumber === null) return;

  const detriPlanets = entry.knowledge?.blackBook?.detriment?.planets || [];
  if (detriPlanets.length === 0) {
    const emLine = emLinesData.mappings.find(l => l.gate === entry.gateNumber && l.line === entry.lineNumber);
    const exaltPlanets = entry.knowledge?.blackBook?.exaltation?.planets || [];

    noDetriLines.push({
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
      exaltPlanets: exaltPlanets.map(p => p.planet),
      exaltDescriptions: exaltPlanets.map(p => ({ planet: p.planet, desc: p.description?.blackBook }))
    });
  }
});

console.log('='.repeat(80));
console.log('NO-DETRIMENT LINES DEEP ANALYSIS');
console.log('='.repeat(80));

console.log(`\nTotal no-detriment lines: ${noDetriLines.length}\n`);

// Detailed output for each line
noDetriLines.forEach(l => {
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
  console.log(`\nExaltation: ${l.exaltPlanets.length > 0 ? l.exaltPlanets.join(' + ') : 'NONE'}`);
  l.exaltDescriptions.forEach(e => {
    console.log(`  ${e.planet}: "${e.desc}"`);
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
noDetriLines.forEach(l => {
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
noDetriLines.forEach(l => {
  byCentre[l.centre] = byCentre[l.centre] || [];
  byCentre[l.centre].push(`${l.gate}.${l.line}`);
});
Object.entries(byCentre).sort((a, b) => b[1].length - a[1].length).forEach(([centre, lines]) => {
  console.log(`${centre}: ${lines.length}`);
  console.log(`  Lines: ${lines.join(', ')}`);
});

// By Circuit
console.log('\n## By Circuit ##\n');
const byCircuit = {};
noDetriLines.forEach(l => {
  byCircuit[l.circuit] = byCircuit[l.circuit] || [];
  byCircuit[l.circuit].push(`${l.gate}.${l.line}`);
});
Object.entries(byCircuit).sort((a, b) => b[1].length - a[1].length).forEach(([circuit, lines]) => {
  console.log(`${circuit}: ${lines.length}`);
  console.log(`  Lines: ${lines.join(', ')}`);
});

// By Line Position
console.log('\n## By Line Number ##\n');
const byLine = {};
noDetriLines.forEach(l => {
  byLine[l.line] = byLine[l.line] || [];
  byLine[l.line].push(`${l.gate}.${l.line}`);
});
Object.entries(byLine).sort((a, b) => a[0] - b[0]).forEach(([line, lines]) => {
  console.log(`Line ${line}: ${lines.length}`);
  console.log(`  Lines: ${lines.join(', ')}`);
});

// By Line Position Type
console.log('\n## By Line Position Type ##\n');
const byLinePos = {};
noDetriLines.forEach(l => {
  byLinePos[l.linePosition] = byLinePos[l.linePosition] || [];
  byLinePos[l.linePosition].push(`${l.gate}.${l.line}`);
});
Object.entries(byLinePos).sort((a, b) => b[1].length - a[1].length).forEach(([pos, lines]) => {
  console.log(`${pos}: ${lines.length}`);
  console.log(`  Lines: ${lines.join(', ')}`);
});

// By Crosses Zero
console.log('\n## By Crosses Zero ##\n');
const byCrossZero = { true: [], false: [] };
noDetriLines.forEach(l => {
  byCrossZero[l.crossesZero].push(`${l.gate}.${l.line}`);
});
console.log(`Cross-zero gates: ${byCrossZero.true.length}`);
console.log(`  Lines: ${byCrossZero.true.join(', ')}`);
console.log(`Same-phase gates: ${byCrossZero.false.length}`);
console.log(`  Lines: ${byCrossZero.false.join(', ')}`);

// By Polarity
console.log('\n## By Polarity ##\n');
const byPolarity = {};
noDetriLines.forEach(l => {
  byPolarity[l.polarity] = byPolarity[l.polarity] || [];
  byPolarity[l.polarity].push(`${l.gate}.${l.line}`);
});
Object.entries(byPolarity).forEach(([pol, lines]) => {
  console.log(`${pol}: ${lines.length}`);
  console.log(`  Lines: ${lines.join(', ')}`);
});

// By Exalting Planet
console.log('\n## By Exalting Planet ##\n');
const byPlanet = {};
noDetriLines.forEach(l => {
  l.exaltPlanets.forEach(p => {
    byPlanet[p] = byPlanet[p] || [];
    byPlanet[p].push(`${l.gate}.${l.line}`);
  });
  if (l.exaltPlanets.length === 0) {
    byPlanet['NONE'] = byPlanet['NONE'] || [];
    byPlanet['NONE'].push(`${l.gate}.${l.line}`);
  }
});
Object.entries(byPlanet).sort((a, b) => b[1].length - a[1].length).forEach(([planet, lines]) => {
  console.log(`${planet}: ${lines.length}`);
  console.log(`  Lines: ${lines.join(', ')}`);
});

// Keynote analysis
console.log('\n## Keynote Themes ##\n');
noDetriLines.forEach(l => {
  console.log(`${l.gate}.${l.line}: "${l.keynote}"`);
});

// Save analysis
const outputPath = path.join(__dirname, '../docs/research/no-detriment-lines-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify({
  summary: {
    totalLines: noDetriLines.length,
    byGateType,
    byCentre,
    byCircuit,
    byLine,
    byLinePosition: byLinePos,
    byCrossZero,
    byPolarity,
    byPlanet
  },
  lines: noDetriLines
}, null, 2));

console.log(`\nData saved to: ${outputPath}`);
