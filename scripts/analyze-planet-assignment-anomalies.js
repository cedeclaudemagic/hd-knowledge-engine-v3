#!/usr/bin/env node

/**
 * Analyze Planet Assignment Anomalies
 *
 * Uses hd-traditional-gates-mappings.json which has the correct planet arrays
 *
 * Investigates:
 * 1. Lines with no exaltation planet
 * 2. Lines with no detriment planet
 * 3. Lines with multiple exaltations
 * 4. Lines with multiple detriments
 * 5. Patterns in these anomalies
 */

const fs = require('fs');
const path = require('path');

// Load traditional gates data (has correct planet arrays)
const gatesPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const gatesData = JSON.parse(fs.readFileSync(gatesPath, 'utf8'));

// Load electromagnetic lines for gate context
const emLinesPath = path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');
const emLinesData = JSON.parse(fs.readFileSync(emLinesPath, 'utf8'));

// Build EM lookup
const emLookup = {};
emLinesData.mappings.forEach(l => {
  emLookup[`${l.gate}.${l.line}`] = l;
});

// Analysis containers
const anomalies = {
  noExaltation: [],
  noDetriment: [],
  multipleExaltations: [],
  multipleDetriments: []
};

// Filter to only line-level entries (lineNumber !== null)
const lineEntries = gatesData.mappings.filter(m => m.lineNumber !== null);

// Analyze each line
lineEntries.forEach(entry => {
  const emLine = emLookup[`${entry.gateNumber}.${entry.lineNumber}`];

  const lineInfo = {
    gate: entry.gateNumber,
    line: entry.lineNumber,
    gateName: entry.knowledge?.gateName,
    keynote: entry.knowledge?.lineKeynote,
    polarity: entry.knowledge?.polarity,
    gateType: emLine?.electromagnetic?.gateType,
    centre: emLine?.context?.centre,
    circuit: emLine?.context?.circuits?.[0],
    innerTrigram: emLine?.electromagnetic?.innerTrigram?.name,
    outerTrigram: emLine?.electromagnetic?.outerTrigram?.name,
    innerPosition: emLine?.electromagnetic?.innerTrigram?.position,
    outerPosition: emLine?.electromagnetic?.outerTrigram?.position
  };

  // Get planets from blackBook (primary source)
  const exaltPlanets = entry.knowledge?.blackBook?.exaltation?.planets || [];
  const detriPlanets = entry.knowledge?.blackBook?.detriment?.planets || [];

  // Check exaltation
  if (exaltPlanets.length === 0) {
    anomalies.noExaltation.push(lineInfo);
  } else if (exaltPlanets.length > 1) {
    anomalies.multipleExaltations.push({
      ...lineInfo,
      planets: exaltPlanets.map(p => p.planet),
      descriptions: exaltPlanets.map(p => ({ planet: p.planet, description: p.description?.blackBook }))
    });
  }

  // Check detriment
  if (detriPlanets.length === 0) {
    anomalies.noDetriment.push(lineInfo);
  } else if (detriPlanets.length > 1) {
    anomalies.multipleDetriments.push({
      ...lineInfo,
      planets: detriPlanets.map(p => p.planet),
      descriptions: detriPlanets.map(p => ({ planet: p.planet, description: p.description?.blackBook }))
    });
  }
});

// Output results
console.log('='.repeat(80));
console.log('PLANET ASSIGNMENT ANOMALY ANALYSIS');
console.log('='.repeat(80));

console.log('\n## SUMMARY ##\n');
console.log(`Total lines analyzed: ${lineEntries.length}`);
console.log(`Lines with no exaltation: ${anomalies.noExaltation.length}`);
console.log(`Lines with multiple exaltations: ${anomalies.multipleExaltations.length}`);
console.log(`Lines with no detriment: ${anomalies.noDetriment.length}`);
console.log(`Lines with multiple detriments: ${anomalies.multipleDetriments.length}`);

// Helper function to analyze patterns
function analyzePatterns(items, label) {
  if (items.length === 0) return;

  console.log(`\n--- PATTERN ANALYSIS: ${label} ---\n`);

  const byGateType = {};
  const byCentre = {};
  const byCircuit = {};
  const byLine = {};
  const byPolarity = {};

  items.forEach(a => {
    if (a.gateType) byGateType[a.gateType] = (byGateType[a.gateType] || 0) + 1;
    if (a.centre) byCentre[a.centre] = (byCentre[a.centre] || 0) + 1;
    if (a.circuit) byCircuit[a.circuit] = (byCircuit[a.circuit] || 0) + 1;
    if (a.line) byLine[a.line] = (byLine[a.line] || 0) + 1;
    if (a.polarity) byPolarity[a.polarity] = (byPolarity[a.polarity] || 0) + 1;
  });

  console.log('By Gate Type:');
  Object.entries(byGateType).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    console.log(`  ${k}: ${v}`);
  });

  console.log('\nBy Centre:');
  Object.entries(byCentre).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    console.log(`  ${k}: ${v}`);
  });

  console.log('\nBy Circuit:');
  Object.entries(byCircuit).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    console.log(`  ${k}: ${v}`);
  });

  console.log('\nBy Line Number:');
  Object.entries(byLine).sort((a, b) => a[0] - b[0]).forEach(([k, v]) => {
    console.log(`  Line ${k}: ${v}`);
  });

  console.log('\nBy Polarity:');
  Object.entries(byPolarity).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    console.log(`  ${k}: ${v}`);
  });
}

// Output lines with no exaltation
if (anomalies.noExaltation.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('LINES WITH NO EXALTATION');
  console.log('='.repeat(80));

  console.log(`\nTotal: ${anomalies.noExaltation.length} lines\n`);

  anomalies.noExaltation.forEach(a => {
    console.log(`Gate ${a.gate}.${a.line} (${a.gateName})`);
    console.log(`  Keynote: ${a.keynote}`);
    console.log(`  Centre: ${a.centre}, Circuit: ${a.circuit}`);
    console.log(`  Gate Type: ${a.gateType}`);
    console.log(`  Trigrams: ${a.innerTrigram} (${a.innerPosition}) → ${a.outerTrigram} (${a.outerPosition})`);
    console.log(`  Polarity: ${a.polarity}`);
    console.log('');
  });

  analyzePatterns(anomalies.noExaltation, 'No Exaltation');
}

// Output lines with no detriment
if (anomalies.noDetriment.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('LINES WITH NO DETRIMENT');
  console.log('='.repeat(80));

  console.log(`\nTotal: ${anomalies.noDetriment.length} lines\n`);

  anomalies.noDetriment.forEach(a => {
    console.log(`Gate ${a.gate}.${a.line} (${a.gateName})`);
    console.log(`  Keynote: ${a.keynote}`);
    console.log(`  Centre: ${a.centre}, Circuit: ${a.circuit}`);
    console.log(`  Gate Type: ${a.gateType}`);
    console.log(`  Trigrams: ${a.innerTrigram} (${a.innerPosition}) → ${a.outerTrigram} (${a.outerPosition})`);
    console.log(`  Polarity: ${a.polarity}`);
    console.log('');
  });

  analyzePatterns(anomalies.noDetriment, 'No Detriment');
}

// Output lines with multiple exaltations
if (anomalies.multipleExaltations.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('LINES WITH MULTIPLE EXALTATIONS');
  console.log('='.repeat(80));

  console.log(`\nTotal: ${anomalies.multipleExaltations.length} lines\n`);

  anomalies.multipleExaltations.forEach(a => {
    console.log(`Gate ${a.gate}.${a.line} (${a.gateName})`);
    console.log(`  Keynote: ${a.keynote}`);
    console.log(`  Centre: ${a.centre}, Circuit: ${a.circuit}`);
    console.log(`  Gate Type: ${a.gateType}`);
    console.log(`  Trigrams: ${a.innerTrigram} (${a.innerPosition}) → ${a.outerTrigram} (${a.outerPosition})`);
    console.log(`  Polarity: ${a.polarity}`);
    console.log(`  EXALTED PLANETS: ${a.planets.join(' + ')}`);
    a.descriptions.forEach(d => {
      console.log(`    ${d.planet}: "${d.description}"`);
    });
    console.log('');
  });

  // Analyze planet combinations
  console.log('--- PLANET COMBINATION ANALYSIS ---\n');
  const combos = {};
  anomalies.multipleExaltations.forEach(a => {
    const key = [...a.planets].sort().join(' + ');
    combos[key] = (combos[key] || 0) + 1;
  });

  console.log('Exaltation Planet Combinations:');
  Object.entries(combos).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    console.log(`  ${k}: ${v}`);
  });

  analyzePatterns(anomalies.multipleExaltations, 'Multiple Exaltations');
}

// Output lines with multiple detriments
if (anomalies.multipleDetriments.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('LINES WITH MULTIPLE DETRIMENTS');
  console.log('='.repeat(80));

  console.log(`\nTotal: ${anomalies.multipleDetriments.length} lines\n`);

  anomalies.multipleDetriments.forEach(a => {
    console.log(`Gate ${a.gate}.${a.line} (${a.gateName})`);
    console.log(`  Keynote: ${a.keynote}`);
    console.log(`  Centre: ${a.centre}, Circuit: ${a.circuit}`);
    console.log(`  Gate Type: ${a.gateType}`);
    console.log(`  Trigrams: ${a.innerTrigram} (${a.innerPosition}) → ${a.outerTrigram} (${a.outerPosition})`);
    console.log(`  Polarity: ${a.polarity}`);
    console.log(`  DETRIMENT PLANETS: ${a.planets.join(' + ')}`);
    a.descriptions.forEach(d => {
      console.log(`    ${d.planet}: "${d.description}"`);
    });
    console.log('');
  });

  // Analyze planet combinations
  console.log('--- PLANET COMBINATION ANALYSIS ---\n');
  const combos = {};
  anomalies.multipleDetriments.forEach(a => {
    const key = [...a.planets].sort().join(' + ');
    combos[key] = (combos[key] || 0) + 1;
  });

  console.log('Detriment Planet Combinations:');
  Object.entries(combos).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    console.log(`  ${k}: ${v}`);
  });

  analyzePatterns(anomalies.multipleDetriments, 'Multiple Detriments');
}

// Cross-reference: Lines missing BOTH
const missingBoth = anomalies.noExaltation.filter(e =>
  anomalies.noDetriment.some(d => d.gate === e.gate && d.line === e.line)
);

if (missingBoth.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('LINES MISSING BOTH EXALTATION AND DETRIMENT');
  console.log('='.repeat(80));
  console.log(`\nTotal: ${missingBoth.length} lines\n`);

  missingBoth.forEach(a => {
    console.log(`Gate ${a.gate}.${a.line} (${a.gateName})`);
    console.log(`  Keynote: ${a.keynote}`);
    console.log(`  Centre: ${a.centre}, Circuit: ${a.circuit}`);
    console.log(`  Gate Type: ${a.gateType}`);
    console.log(`  Polarity: ${a.polarity}`);
    console.log('');
  });
}

// Save analysis data
const outputPath = path.join(__dirname, '../docs/research/planet-assignment-anomalies-data.json');
fs.writeFileSync(outputPath, JSON.stringify({
  summary: {
    totalLines: lineEntries.length,
    noExaltation: anomalies.noExaltation.length,
    multipleExaltations: anomalies.multipleExaltations.length,
    noDetriment: anomalies.noDetriment.length,
    multipleDetriments: anomalies.multipleDetriments.length,
    missingBoth: missingBoth.length
  },
  anomalies: {
    noExaltation: anomalies.noExaltation,
    noDetriment: anomalies.noDetriment,
    multipleExaltations: anomalies.multipleExaltations,
    multipleDetriments: anomalies.multipleDetriments,
    missingBoth
  }
}, null, 2));

console.log(`\nData saved to: ${outputPath}`);
