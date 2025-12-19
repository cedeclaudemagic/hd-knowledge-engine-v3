#!/usr/bin/env node

/**
 * Phase 4: Planet Pair Analysis
 *
 * Analyzes exaltation/detriment pairs to understand:
 * - Which planets commonly appear together
 * - The electromagnetic logic of each pairing
 * - Anomalous pairs that reveal deeper patterns
 */

const fs = require('fs');
const path = require('path');

// Load data sources
const tradGatesPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const tradGatesData = JSON.parse(fs.readFileSync(tradGatesPath, 'utf8'));

const emLinesPath = path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');
const emLinesData = JSON.parse(fs.readFileSync(emLinesPath, 'utf8'));

// Build EM lookup
const emLookup = {};
emLinesData.mappings.forEach(l => {
  emLookup[`${l.gate}.${l.line}`] = l;
});

// Collect all pairs
const pairs = [];
const pairCounts = {};
const pairDetails = {};

tradGatesData.mappings.forEach(entry => {
  if (entry.lineNumber === null) return;

  const exaltPlanets = entry.knowledge?.blackBook?.exaltation?.planets || [];
  const detriPlanets = entry.knowledge?.blackBook?.detriment?.planets || [];
  const emLine = emLookup[`${entry.gateNumber}.${entry.lineNumber}`];

  // For each exaltation-detriment combination
  exaltPlanets.forEach(exalt => {
    detriPlanets.forEach(detri => {
      const pairKey = `${exalt.planet}/${detri.planet}`;

      pairs.push({
        gate: entry.gateNumber,
        line: entry.lineNumber,
        exalt: exalt.planet,
        detri: detri.planet,
        keynote: entry.knowledge?.lineKeynote,
        gateType: emLine?.electromagnetic?.gateType,
        centre: emLine?.context?.centre,
        circuit: emLine?.context?.circuits?.[0],
        innerTrigram: emLine?.electromagnetic?.innerTrigram?.name,
        outerTrigram: emLine?.electromagnetic?.outerTrigram?.name,
        linePosition: emLine?.interpretation?.linePosition
      });

      pairCounts[pairKey] = (pairCounts[pairKey] || 0) + 1;

      if (!pairDetails[pairKey]) {
        pairDetails[pairKey] = {
          exalt: exalt.planet,
          detri: detri.planet,
          count: 0,
          lines: [],
          byGateType: {},
          byCentre: {},
          byCircuit: {},
          byLine: {}
        };
      }

      pairDetails[pairKey].count++;
      pairDetails[pairKey].lines.push(`${entry.gateNumber}.${entry.lineNumber}`);
      pairDetails[pairKey].byGateType[emLine?.electromagnetic?.gateType] =
        (pairDetails[pairKey].byGateType[emLine?.electromagnetic?.gateType] || 0) + 1;
      pairDetails[pairKey].byCentre[emLine?.context?.centre] =
        (pairDetails[pairKey].byCentre[emLine?.context?.centre] || 0) + 1;
      pairDetails[pairKey].byCircuit[emLine?.context?.circuits?.[0]] =
        (pairDetails[pairKey].byCircuit[emLine?.context?.circuits?.[0]] || 0) + 1;
      pairDetails[pairKey].byLine[entry.lineNumber] =
        (pairDetails[pairKey].byLine[entry.lineNumber] || 0) + 1;
    });
  });
});

// Sort pairs by frequency
const sortedPairs = Object.entries(pairCounts)
  .sort((a, b) => b[1] - a[1]);

console.log('='.repeat(80));
console.log('PHASE 4: PLANET PAIR ANALYSIS');
console.log('='.repeat(80));

console.log('\n## ALL PAIRS BY FREQUENCY ##\n');
console.log('Pair (Exalt/Detri)     | Count | %');
console.log('-'.repeat(45));

const totalPairs = pairs.length;
sortedPairs.forEach(([pair, count]) => {
  const pct = ((count / totalPairs) * 100).toFixed(1);
  console.log(`${pair.padEnd(22)} | ${String(count).padStart(5)} | ${pct}%`);
});

// Top 10 detailed analysis
console.log('\n' + '='.repeat(80));
console.log('TOP 15 PAIRS - DETAILED ANALYSIS');
console.log('='.repeat(80));

sortedPairs.slice(0, 15).forEach(([pairKey, count]) => {
  const details = pairDetails[pairKey];

  console.log(`\n### ${pairKey} (${count} occurrences) ###\n`);

  // By gate type
  console.log('By Gate Type:');
  Object.entries(details.byGateType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, c]) => console.log(`  ${type}: ${c}`));

  // By centre
  console.log('\nBy Centre:');
  Object.entries(details.byCentre)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([centre, c]) => console.log(`  ${centre}: ${c}`));

  // By circuit
  console.log('\nBy Circuit:');
  Object.entries(details.byCircuit)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .forEach(([circuit, c]) => console.log(`  ${circuit}: ${c}`));

  // By line
  console.log('\nBy Line:');
  Object.entries(details.byLine)
    .sort((a, b) => a[0] - b[0])
    .forEach(([line, c]) => console.log(`  Line ${line}: ${c}`));
});

// Analyze planet relationships
console.log('\n' + '='.repeat(80));
console.log('PLANET RELATIONSHIP MATRIX');
console.log('='.repeat(80));

const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];

// Build relationship matrix
const asExalt = {};
const asDetri = {};

planets.forEach(p => {
  asExalt[p] = {};
  asDetri[p] = {};
  planets.forEach(q => {
    asExalt[p][q] = 0;
    asDetri[p][q] = 0;
  });
});

pairs.forEach(pair => {
  if (asExalt[pair.exalt] && asDetri[pair.detri]) {
    asExalt[pair.exalt][pair.detri]++;
    asDetri[pair.detri][pair.exalt]++;
  }
});

// For each planet, show who they pair with most as exalt and as detri
console.log('\n## PLANET PAIRING PROFILES ##\n');

planets.forEach(planet => {
  const topAsExalt = Object.entries(asExalt[planet])
    .filter(([_, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const topAsDetri = Object.entries(asDetri[planet])
    .filter(([_, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  console.log(`${planet}:`);
  console.log(`  When EXALTED, opposed by: ${topAsExalt.map(([p, c]) => `${p}(${c})`).join(', ') || 'None'}`);
  console.log(`  When DETRIMENT, opposed by: ${topAsDetri.map(([p, c]) => `${p}(${c})`).join(', ') || 'None'}`);
});

// Reciprocal pairs (A exalts when B detriments AND B exalts when A detriments)
console.log('\n' + '='.repeat(80));
console.log('RECIPROCAL PAIRS');
console.log('='.repeat(80));

console.log('\nPairs that oppose each other in both directions:\n');

const reciprocals = [];
for (let i = 0; i < planets.length; i++) {
  for (let j = i + 1; j < planets.length; j++) {
    const p1 = planets[i];
    const p2 = planets[j];
    const p1ExaltP2Detri = asExalt[p1][p2] || 0;
    const p2ExaltP1Detri = asExalt[p2][p1] || 0;

    if (p1ExaltP2Detri > 0 && p2ExaltP1Detri > 0) {
      reciprocals.push({
        pair: `${p1} <-> ${p2}`,
        p1ExaltP2Detri,
        p2ExaltP1Detri,
        total: p1ExaltP2Detri + p2ExaltP1Detri
      });
    }
  }
}

reciprocals.sort((a, b) => b.total - a.total).forEach(r => {
  console.log(`${r.pair}: ${r.p1ExaltP2Detri} + ${r.p2ExaltP1Detri} = ${r.total} total`);
});

// Rare pairs (count = 1)
console.log('\n' + '='.repeat(80));
console.log('RARE PAIRS (Single Occurrence)');
console.log('='.repeat(80));

const rarePairs = sortedPairs.filter(([_, count]) => count === 1);
console.log(`\nTotal rare pairs: ${rarePairs.length}\n`);

rarePairs.forEach(([pairKey, _]) => {
  const detail = pairDetails[pairKey];
  const line = detail.lines[0];
  const lineData = pairs.find(p => `${p.gate}.${p.line}` === line && `${p.exalt}/${p.detri}` === pairKey);

  console.log(`${pairKey}: Gate ${line} (${lineData?.keynote})`);
  console.log(`  ${lineData?.centre}, ${lineData?.circuit}, ${lineData?.gateType}`);
});

// Same-planet analysis (where exalt = detri planet)
console.log('\n' + '='.repeat(80));
console.log('SAME-PLANET PAIRS (Exalt = Detri)');
console.log('='.repeat(80));

const samePlanet = sortedPairs.filter(([pair, _]) => {
  const [e, d] = pair.split('/');
  return e === d;
});

if (samePlanet.length > 0) {
  console.log('\nLines where the same planet both exalts and detriments:\n');
  samePlanet.forEach(([pair, count]) => {
    console.log(`${pair}: ${count} occurrences`);
  });
} else {
  console.log('\nNo same-planet pairs found (expected - different aspects of same line)');
}

// Save analysis
const outputPath = path.join(__dirname, '../docs/research/planet-pairs-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify({
  summary: {
    totalPairs: totalPairs,
    uniquePairs: sortedPairs.length,
    rarePairs: rarePairs.length
  },
  pairCounts: Object.fromEntries(sortedPairs),
  pairDetails,
  reciprocalPairs: reciprocals,
  rarePairsList: rarePairs.map(([p, _]) => p)
}, null, 2));

console.log(`\nData saved to: ${outputPath}`);
