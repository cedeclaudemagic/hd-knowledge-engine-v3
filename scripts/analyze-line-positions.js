#!/usr/bin/env node

/**
 * Phase 5: Line Position Analysis
 *
 * Analyzes Lines 1-6 across all gates to understand:
 * - Which planets favor which line positions
 * - The electromagnetic function of each line
 * - Patterns in planetary distribution by line
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

// Line position meanings
const linePositions = {
  1: { name: 'entry-inner', function: 'Foundation/Entry', theme: 'Introspection' },
  2: { name: 'development-inner', function: 'Development', theme: 'Projection' },
  3: { name: 'completion-inner', function: 'Inner Completion', theme: 'Adaptation' },
  4: { name: 'entry-outer', function: 'Mode Shift/Externalization', theme: 'Opportunity' },
  5: { name: 'development-outer', function: 'Outer Development', theme: 'Universalization' },
  6: { name: 'completion-outer', function: 'Outer Completion', theme: 'Transition' }
};

// Collect data by line
const lineAnalysis = {};

for (let lineNum = 1; lineNum <= 6; lineNum++) {
  lineAnalysis[lineNum] = {
    line: lineNum,
    position: linePositions[lineNum],
    exaltPlanets: {},
    detriPlanets: {},
    byGateType: { exalt: {}, detri: {} },
    byCentre: { exalt: {}, detri: {} },
    byCircuit: { exalt: {}, detri: {} },
    byPolarity: { exalt: {}, detri: {} },
    anomalies: [],
    totalExalt: 0,
    totalDetri: 0
  };
}

// Process all lines
tradGatesData.mappings.forEach(entry => {
  if (entry.lineNumber === null) return;

  const lineNum = entry.lineNumber;
  const emLine = emLookup[`${entry.gateNumber}.${entry.lineNumber}`];
  const analysis = lineAnalysis[lineNum];

  const exaltPlanets = entry.knowledge?.blackBook?.exaltation?.planets || [];
  const detriPlanets = entry.knowledge?.blackBook?.detriment?.planets || [];

  // Track anomalies
  if (exaltPlanets.length === 0 || detriPlanets.length === 0 || exaltPlanets.length > 1 || detriPlanets.length > 1) {
    analysis.anomalies.push({
      gate: entry.gateNumber,
      keynote: entry.knowledge?.lineKeynote,
      exaltCount: exaltPlanets.length,
      detriCount: detriPlanets.length
    });
  }

  // Count exaltations
  exaltPlanets.forEach(p => {
    analysis.exaltPlanets[p.planet] = (analysis.exaltPlanets[p.planet] || 0) + 1;
    analysis.totalExalt++;

    if (emLine?.electromagnetic?.gateType) {
      analysis.byGateType.exalt[emLine.electromagnetic.gateType] =
        (analysis.byGateType.exalt[emLine.electromagnetic.gateType] || 0) + 1;
    }
    if (emLine?.context?.centre) {
      analysis.byCentre.exalt[emLine.context.centre] =
        (analysis.byCentre.exalt[emLine.context.centre] || 0) + 1;
    }
    if (emLine?.context?.circuits?.[0]) {
      analysis.byCircuit.exalt[emLine.context.circuits[0]] =
        (analysis.byCircuit.exalt[emLine.context.circuits[0]] || 0) + 1;
    }
    if (entry.knowledge?.polarity) {
      analysis.byPolarity.exalt[entry.knowledge.polarity] =
        (analysis.byPolarity.exalt[entry.knowledge.polarity] || 0) + 1;
    }
  });

  // Count detriments
  detriPlanets.forEach(p => {
    analysis.detriPlanets[p.planet] = (analysis.detriPlanets[p.planet] || 0) + 1;
    analysis.totalDetri++;

    if (emLine?.electromagnetic?.gateType) {
      analysis.byGateType.detri[emLine.electromagnetic.gateType] =
        (analysis.byGateType.detri[emLine.electromagnetic.gateType] || 0) + 1;
    }
    if (emLine?.context?.centre) {
      analysis.byCentre.detri[emLine.context.centre] =
        (analysis.byCentre.detri[emLine.context.centre] || 0) + 1;
    }
    if (emLine?.context?.circuits?.[0]) {
      analysis.byCircuit.detri[emLine.context.circuits[0]] =
        (analysis.byCircuit.detri[emLine.context.circuits[0]] || 0) + 1;
    }
    if (entry.knowledge?.polarity) {
      analysis.byPolarity.detri[entry.knowledge.polarity] =
        (analysis.byPolarity.detri[entry.knowledge.polarity] || 0) + 1;
    }
  });
});

// Output results
console.log('='.repeat(80));
console.log('PHASE 5: LINE POSITION ANALYSIS');
console.log('='.repeat(80));

console.log('\n## LINE POSITION OVERVIEW ##\n');
console.log('Line | Position           | Function                    | Exalt | Detri | Anomalies');
console.log('-'.repeat(90));

Object.values(lineAnalysis).forEach(l => {
  console.log(`L${l.line}   | ${l.position.name.padEnd(18)} | ${l.position.function.padEnd(27)} | ${String(l.totalExalt).padStart(5)} | ${String(l.totalDetri).padStart(5)} | ${l.anomalies.length}`);
});

// Detailed analysis for each line
for (let lineNum = 1; lineNum <= 6; lineNum++) {
  const analysis = lineAnalysis[lineNum];

  console.log('\n' + '='.repeat(80));
  console.log(`LINE ${lineNum} - ${analysis.position.name.toUpperCase()}`);
  console.log(`Function: ${analysis.position.function} | Theme: ${analysis.position.theme}`);
  console.log('='.repeat(80));

  // Top exaltation planets
  const topExalt = Object.entries(analysis.exaltPlanets)
    .sort((a, b) => b[1] - a[1]);

  console.log('\n## Exaltation Planets ##\n');
  topExalt.forEach(([planet, count]) => {
    const pct = ((count / analysis.totalExalt) * 100).toFixed(1);
    console.log(`  ${planet.padEnd(10)}: ${count} (${pct}%)`);
  });

  // Top detriment planets
  const topDetri = Object.entries(analysis.detriPlanets)
    .sort((a, b) => b[1] - a[1]);

  console.log('\n## Detriment Planets ##\n');
  topDetri.forEach(([planet, count]) => {
    const pct = ((count / analysis.totalDetri) * 100).toFixed(1);
    console.log(`  ${planet.padEnd(10)}: ${count} (${pct}%)`);
  });

  // Calculate dominant exalt and dominant detri
  const dominantExalt = topExalt[0];
  const dominantDetri = topDetri[0];

  console.log(`\nDominant Exalt: ${dominantExalt ? dominantExalt[0] : 'None'} (${dominantExalt ? dominantExalt[1] : 0})`);
  console.log(`Dominant Detri: ${dominantDetri ? dominantDetri[0] : 'None'} (${dominantDetri ? dominantDetri[1] : 0})`);

  // Anomalies at this line
  if (analysis.anomalies.length > 0) {
    console.log(`\n## Anomalies (${analysis.anomalies.length}) ##\n`);
    analysis.anomalies.forEach(a => {
      const issue = a.exaltCount === 0 ? 'No exalt' :
                    a.detriCount === 0 ? 'No detri' :
                    a.exaltCount > 1 ? 'Multi-exalt' : 'Multi-detri';
      console.log(`  Gate ${a.gate} (${a.keynote}): ${issue}`);
    });
  }
}

// Cross-line planet analysis
console.log('\n' + '='.repeat(80));
console.log('PLANET AFFINITY BY LINE POSITION');
console.log('='.repeat(80));

const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];

console.log('\n## EXALTATION DISTRIBUTION ##\n');
console.log('Planet     | L1  | L2  | L3  | L4  | L5  | L6  | Total | Best Line');
console.log('-'.repeat(75));

planets.forEach(planet => {
  const counts = [];
  for (let l = 1; l <= 6; l++) {
    counts.push(lineAnalysis[l].exaltPlanets[planet] || 0);
  }
  const total = counts.reduce((a, b) => a + b, 0);
  const maxIdx = counts.indexOf(Math.max(...counts));
  const bestLine = total > 0 ? `L${maxIdx + 1}` : '-';

  console.log(`${planet.padEnd(10)} | ${counts.map(c => String(c).padStart(3)).join(' | ')} | ${String(total).padStart(5)} | ${bestLine}`);
});

console.log('\n## DETRIMENT DISTRIBUTION ##\n');
console.log('Planet     | L1  | L2  | L3  | L4  | L5  | L6  | Total | Worst Line');
console.log('-'.repeat(75));

planets.forEach(planet => {
  const counts = [];
  for (let l = 1; l <= 6; l++) {
    counts.push(lineAnalysis[l].detriPlanets[planet] || 0);
  }
  const total = counts.reduce((a, b) => a + b, 0);
  const maxIdx = counts.indexOf(Math.max(...counts));
  const worstLine = total > 0 ? `L${maxIdx + 1}` : '-';

  console.log(`${planet.padEnd(10)} | ${counts.map(c => String(c).padStart(3)).join(' | ')} | ${String(total).padStart(5)} | ${worstLine}`);
});

// Line-specific insights
console.log('\n' + '='.repeat(80));
console.log('LINE-SPECIFIC INSIGHTS');
console.log('='.repeat(80));

const insights = {
  1: { exalt: [], detri: [] },
  2: { exalt: [], detri: [] },
  3: { exalt: [], detri: [] },
  4: { exalt: [], detri: [] },
  5: { exalt: [], detri: [] },
  6: { exalt: [], detri: [] }
};

planets.forEach(planet => {
  for (let l = 1; l <= 6; l++) {
    const exaltCount = lineAnalysis[l].exaltPlanets[planet] || 0;
    const detriCount = lineAnalysis[l].detriPlanets[planet] || 0;

    // Find where each planet is strongest/weakest
    const allExaltCounts = [];
    const allDetriCounts = [];
    for (let i = 1; i <= 6; i++) {
      allExaltCounts.push(lineAnalysis[i].exaltPlanets[planet] || 0);
      allDetriCounts.push(lineAnalysis[i].detriPlanets[planet] || 0);
    }

    const maxExalt = Math.max(...allExaltCounts);
    const maxDetri = Math.max(...allDetriCounts);

    if (exaltCount === maxExalt && maxExalt > 5) {
      insights[l].exalt.push(`${planet}(${exaltCount})`);
    }
    if (detriCount === maxDetri && maxDetri > 5) {
      insights[l].detri.push(`${planet}(${detriCount})`);
    }
  }
});

console.log('\n');
for (let l = 1; l <= 6; l++) {
  console.log(`Line ${l} (${lineAnalysis[l].position.function}):`);
  if (insights[l].exalt.length > 0) {
    console.log(`  Strongest Exalt: ${insights[l].exalt.join(', ')}`);
  }
  if (insights[l].detri.length > 0) {
    console.log(`  Strongest Detri: ${insights[l].detri.join(', ')}`);
  }
  console.log('');
}

// Save analysis
const outputPath = path.join(__dirname, '../docs/research/line-positions-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify(lineAnalysis, null, 2));
console.log(`Data saved to: ${outputPath}`);
