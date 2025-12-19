#!/usr/bin/env node

/**
 * Phase 3: Standing Wave (Doubled Gates) Deep Analysis
 *
 * The 8 doubled gates where inner and outer trigram are identical:
 * - Gate 1: Heaven/Heaven (G)
 * - Gate 2: Earth/Earth (G)
 * - Gate 29: Water/Water (Sacral)
 * - Gate 30: Fire/Fire (Solar Plexus)
 * - Gate 51: Thunder/Thunder (Heart)
 * - Gate 52: Mountain/Mountain (Root)
 * - Gate 57: Wind/Wind (Spleen)
 * - Gate 58: Lake/Lake (Root)
 *
 * Standing waves have amplitude 0 - no movement between positions.
 * They represent pure states at their electromagnetic position.
 */

const fs = require('fs');
const path = require('path');

// Load data sources
const tradGatesPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const tradGatesData = JSON.parse(fs.readFileSync(tradGatesPath, 'utf8'));

const emLinesPath = path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');
const emLinesData = JSON.parse(fs.readFileSync(emLinesPath, 'utf8'));

// The 8 doubled gates
const doubledGates = [1, 2, 29, 30, 51, 52, 57, 58];

// Build complete analysis
const standingWaveAnalysis = {};

doubledGates.forEach(gateNum => {
  const gateLines = [];

  for (let lineNum = 1; lineNum <= 6; lineNum++) {
    const tradLine = tradGatesData.mappings.find(m => m.gateNumber === gateNum && m.lineNumber === lineNum);
    const emLine = emLinesData.mappings.find(l => l.gate === gateNum && l.line === lineNum);

    if (!tradLine || !emLine) continue;

    const exaltPlanets = tradLine.knowledge?.blackBook?.exaltation?.planets || [];
    const detriPlanets = tradLine.knowledge?.blackBook?.detriment?.planets || [];

    gateLines.push({
      line: lineNum,
      keynote: tradLine.knowledge?.lineKeynote,
      polarity: tradLine.knowledge?.polarity,
      linePosition: emLine.interpretation?.linePosition,
      exaltPlanets: exaltPlanets.map(p => p.planet),
      detriPlanets: detriPlanets.map(p => p.planet),
      exaltDescs: exaltPlanets.map(p => ({ planet: p.planet, desc: p.description?.blackBook })),
      detriDescs: detriPlanets.map(p => ({ planet: p.planet, desc: p.description?.blackBook })),
      hasExalt: exaltPlanets.length > 0,
      hasDetri: detriPlanets.length > 0,
      anomaly: (exaltPlanets.length === 0 || detriPlanets.length === 0 || exaltPlanets.length > 1 || detriPlanets.length > 1)
    });
  }

  // Get gate-level info
  const emGate = emLinesData.mappings.find(l => l.gate === gateNum && l.line === 1);
  const tradGate = tradGatesData.mappings.find(m => m.gateNumber === gateNum && m.lineNumber === null);

  standingWaveAnalysis[gateNum] = {
    gate: gateNum,
    name: emGate?.gateName,
    trigram: emGate?.electromagnetic?.innerTrigram?.name,
    position: emGate?.electromagnetic?.innerTrigram?.position,
    axis: emGate?.electromagnetic?.innerTrigram?.axis,
    centre: emGate?.context?.centre,
    circuit: emGate?.context?.circuits?.[0],
    channel: tradGate?.knowledge?.channel,
    channelName: tradGate?.knowledge?.channelName,
    harmonicGate: tradGate?.knowledge?.harmonicGate,
    lines: gateLines,
    stats: {
      totalExalt: gateLines.filter(l => l.hasExalt).length,
      totalDetri: gateLines.filter(l => l.hasDetri).length,
      anomalies: gateLines.filter(l => l.anomaly).length
    }
  };
});

// Output results
console.log('='.repeat(80));
console.log('PHASE 3: STANDING WAVE (DOUBLED GATES) DEEP ANALYSIS');
console.log('='.repeat(80));

console.log('\n## THE 8 STANDING WAVES ##\n');
console.log('Gate | Name              | Trigram       | Position | Centre       | Circuit');
console.log('-'.repeat(85));

Object.values(standingWaveAnalysis).forEach(g => {
  const gate = String(g.gate).padEnd(4);
  const name = (g.name || '').padEnd(17);
  const trigram = (g.trigram + '/' + g.trigram).padEnd(13);
  const pos = String(g.position).padStart(3).padEnd(8);
  const centre = (g.centre || '').padEnd(12);
  console.log(`${gate} | ${name} | ${trigram} | ${pos} | ${centre} | ${g.circuit}`);
});

// Detailed analysis of each standing wave
Object.values(standingWaveAnalysis).forEach(g => {
  console.log('\n' + '='.repeat(80));
  console.log(`GATE ${g.gate} - ${g.name} (${g.trigram}/${g.trigram}) @ Position ${g.position}`);
  console.log('='.repeat(80));

  console.log(`Centre: ${g.centre}`);
  console.log(`Circuit: ${g.circuit}`);
  console.log(`Channel: ${g.channel} (${g.channelName})`);
  console.log(`Harmonic Gate: ${g.harmonicGate}`);
  console.log(`Axis: ${g.axis}`);
  console.log(`Anomalies: ${g.stats.anomalies} / 6 lines`);

  console.log('\n--- All 6 Lines ---\n');

  g.lines.forEach(l => {
    const exStr = l.exaltPlanets.length > 0 ? l.exaltPlanets.join('+') : 'NONE';
    const detStr = l.detriPlanets.length > 0 ? l.detriPlanets.join('+') : 'NONE';
    const flag = l.anomaly ? ' <<<' : '';

    console.log(`Line ${l.line}: ${l.keynote} (${l.polarity})`);
    console.log(`  Position: ${l.linePosition}`);
    console.log(`  Exalt: ${exStr} | Detri: ${detStr}${flag}`);
  });

  // Planet distribution for this gate
  console.log('\n--- Planet Distribution ---\n');

  const exaltCounts = {};
  const detriCounts = {};

  g.lines.forEach(l => {
    l.exaltPlanets.forEach(p => { exaltCounts[p] = (exaltCounts[p] || 0) + 1; });
    l.detriPlanets.forEach(p => { detriCounts[p] = (detriCounts[p] || 0) + 1; });
  });

  console.log('Exaltations:', Object.entries(exaltCounts).map(([p, c]) => `${p}(${c})`).join(', ') || 'None');
  console.log('Detriments:', Object.entries(detriCounts).map(([p, c]) => `${p}(${c})`).join(', ') || 'None');
});

// Cross-gate analysis
console.log('\n' + '='.repeat(80));
console.log('CROSS-GATE ANALYSIS');
console.log('='.repeat(80));

// Collect all planets across standing waves
const allExaltByGate = {};
const allDetriByGate = {};

Object.values(standingWaveAnalysis).forEach(g => {
  allExaltByGate[g.gate] = {};
  allDetriByGate[g.gate] = {};

  g.lines.forEach(l => {
    l.exaltPlanets.forEach(p => { allExaltByGate[g.gate][p] = (allExaltByGate[g.gate][p] || 0) + 1; });
    l.detriPlanets.forEach(p => { allDetriByGate[g.gate][p] = (allDetriByGate[g.gate][p] || 0) + 1; });
  });
});

// Planet affinity with each standing wave
console.log('\n## Planet Affinity by Standing Wave ##\n');

const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];

planets.forEach(planet => {
  const exaltGates = [];
  const detriGates = [];

  Object.entries(allExaltByGate).forEach(([gate, counts]) => {
    if (counts[planet]) exaltGates.push(`G${gate}(${counts[planet]})`);
  });

  Object.entries(allDetriByGate).forEach(([gate, counts]) => {
    if (counts[planet]) detriGates.push(`G${gate}(${counts[planet]})`);
  });

  if (exaltGates.length > 0 || detriGates.length > 0) {
    console.log(`${planet}:`);
    if (exaltGates.length > 0) console.log(`  Exalt: ${exaltGates.join(', ')}`);
    if (detriGates.length > 0) console.log(`  Detri: ${detriGates.join(', ')}`);
  }
});

// Anomaly analysis
console.log('\n## Standing Wave Anomalies ##\n');

Object.values(standingWaveAnalysis).forEach(g => {
  const anomalies = g.lines.filter(l => l.anomaly);
  if (anomalies.length > 0) {
    console.log(`Gate ${g.gate} (${g.trigram}/${g.trigram}):`);
    anomalies.forEach(l => {
      const reason = !l.hasExalt ? 'No exaltation' : !l.hasDetri ? 'No detriment' : 'Multiple planets';
      console.log(`  Line ${l.line} (${l.keynote}): ${reason}`);
    });
  }
});

// Position-based analysis (void vs material standing waves)
console.log('\n## Void vs Material Standing Waves ##\n');

const voidWaves = Object.values(standingWaveAnalysis).filter(g => g.position < 0);
const materialWaves = Object.values(standingWaveAnalysis).filter(g => g.position > 0);

console.log('VOID STANDING WAVES (negative position):');
voidWaves.forEach(g => {
  console.log(`  Gate ${g.gate} (${g.trigram}) @ ${g.position}: ${g.stats.anomalies} anomalies`);
});

console.log('\nMATERIAL STANDING WAVES (positive position):');
materialWaves.forEach(g => {
  console.log(`  Gate ${g.gate} (${g.trigram}) @ ${g.position}: ${g.stats.anomalies} anomalies`);
});

// Axis-based analysis
console.log('\n## Standing Waves by Axis ##\n');

const byAxis = {};
Object.values(standingWaveAnalysis).forEach(g => {
  byAxis[g.axis] = byAxis[g.axis] || [];
  byAxis[g.axis].push(g);
});

Object.entries(byAxis).forEach(([axis, gates]) => {
  console.log(`${axis.toUpperCase()} AXIS:`);
  gates.forEach(g => {
    console.log(`  Gate ${g.gate} (${g.trigram}): ${g.centre}, ${g.circuit}`);
  });
});

// Save analysis
const outputPath = path.join(__dirname, '../docs/research/standing-waves-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify(standingWaveAnalysis, null, 2));
console.log(`\nData saved to: ${outputPath}`);
