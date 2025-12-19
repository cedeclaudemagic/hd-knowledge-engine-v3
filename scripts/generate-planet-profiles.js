#!/usr/bin/env node

/**
 * Generate Complete Planet Profiles
 *
 * For each planet, maps:
 * - All exaltation positions with electromagnetic context
 * - All detriment positions with electromagnetic context
 * - Distribution by gate type, trigram, centre, circuit, line position
 * - "Home" positions and "shadow" positions
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

// All planets
const planets = ['Sun', 'Earth', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'North Node', 'South Node'];

// Collect all planet data
const planetProfiles = {};

planets.forEach(planet => {
  planetProfiles[planet] = {
    exaltations: [],
    detriments: [],
    stats: {
      byGateType: { exalt: {}, detri: {} },
      byCentre: { exalt: {}, detri: {} },
      byCircuit: { exalt: {}, detri: {} },
      byLine: { exalt: {}, detri: {} },
      byInnerTrigram: { exalt: {}, detri: {} },
      byOuterTrigram: { exalt: {}, detri: {} },
      byInnerPosition: { exalt: {}, detri: {} },
      byOuterPosition: { exalt: {}, detri: {} },
      byPolarity: { exalt: {}, detri: {} },
      byCrossZero: { exalt: { true: 0, false: 0 }, detri: { true: 0, false: 0 } }
    }
  };
});

// Process all lines
tradGatesData.mappings.forEach(entry => {
  if (entry.lineNumber === null) return;

  const emLine = emLookup[`${entry.gateNumber}.${entry.lineNumber}`];
  if (!emLine) return;

  const lineData = {
    gate: entry.gateNumber,
    line: entry.lineNumber,
    gateName: emLine.gateName,
    keynote: entry.knowledge?.lineKeynote,
    polarity: entry.knowledge?.polarity,
    gateType: emLine.electromagnetic?.gateType,
    centre: emLine.context?.centre,
    circuit: emLine.context?.circuits?.[0],
    innerTrigram: emLine.electromagnetic?.innerTrigram?.name,
    outerTrigram: emLine.electromagnetic?.outerTrigram?.name,
    innerPosition: emLine.electromagnetic?.innerTrigram?.position,
    outerPosition: emLine.electromagnetic?.outerTrigram?.position,
    linePosition: emLine.interpretation?.linePosition,
    crossesZero: emLine.electromagnetic?.vector?.crossesZero,
    amplitude: emLine.electromagnetic?.vector?.amplitude
  };

  // Process exaltations
  const exaltPlanets = entry.knowledge?.blackBook?.exaltation?.planets || [];
  exaltPlanets.forEach(p => {
    const planet = p.planet;
    if (!planetProfiles[planet]) return;

    planetProfiles[planet].exaltations.push({
      ...lineData,
      description: p.description?.blackBook
    });

    // Update stats
    const stats = planetProfiles[planet].stats;
    stats.byGateType.exalt[lineData.gateType] = (stats.byGateType.exalt[lineData.gateType] || 0) + 1;
    stats.byCentre.exalt[lineData.centre] = (stats.byCentre.exalt[lineData.centre] || 0) + 1;
    stats.byCircuit.exalt[lineData.circuit] = (stats.byCircuit.exalt[lineData.circuit] || 0) + 1;
    stats.byLine.exalt[lineData.line] = (stats.byLine.exalt[lineData.line] || 0) + 1;
    stats.byInnerTrigram.exalt[lineData.innerTrigram] = (stats.byInnerTrigram.exalt[lineData.innerTrigram] || 0) + 1;
    stats.byOuterTrigram.exalt[lineData.outerTrigram] = (stats.byOuterTrigram.exalt[lineData.outerTrigram] || 0) + 1;
    stats.byInnerPosition.exalt[lineData.innerPosition] = (stats.byInnerPosition.exalt[lineData.innerPosition] || 0) + 1;
    stats.byOuterPosition.exalt[lineData.outerPosition] = (stats.byOuterPosition.exalt[lineData.outerPosition] || 0) + 1;
    stats.byPolarity.exalt[lineData.polarity] = (stats.byPolarity.exalt[lineData.polarity] || 0) + 1;
    stats.byCrossZero.exalt[lineData.crossesZero] = (stats.byCrossZero.exalt[lineData.crossesZero] || 0) + 1;
  });

  // Process detriments
  const detriPlanets = entry.knowledge?.blackBook?.detriment?.planets || [];
  detriPlanets.forEach(p => {
    const planet = p.planet;
    if (!planetProfiles[planet]) return;

    planetProfiles[planet].detriments.push({
      ...lineData,
      description: p.description?.blackBook
    });

    // Update stats
    const stats = planetProfiles[planet].stats;
    stats.byGateType.detri[lineData.gateType] = (stats.byGateType.detri[lineData.gateType] || 0) + 1;
    stats.byCentre.detri[lineData.centre] = (stats.byCentre.detri[lineData.centre] || 0) + 1;
    stats.byCircuit.detri[lineData.circuit] = (stats.byCircuit.detri[lineData.circuit] || 0) + 1;
    stats.byLine.detri[lineData.line] = (stats.byLine.detri[lineData.line] || 0) + 1;
    stats.byInnerTrigram.detri[lineData.innerTrigram] = (stats.byInnerTrigram.detri[lineData.innerTrigram] || 0) + 1;
    stats.byOuterTrigram.detri[lineData.outerTrigram] = (stats.byOuterTrigram.detri[lineData.outerTrigram] || 0) + 1;
    stats.byInnerPosition.detri[lineData.innerPosition] = (stats.byInnerPosition.detri[lineData.innerPosition] || 0) + 1;
    stats.byOuterPosition.detri[lineData.outerPosition] = (stats.byOuterPosition.detri[lineData.outerPosition] || 0) + 1;
    stats.byPolarity.detri[lineData.polarity] = (stats.byPolarity.detri[lineData.polarity] || 0) + 1;
    stats.byCrossZero.detri[lineData.crossesZero] = (stats.byCrossZero.detri[lineData.crossesZero] || 0) + 1;
  });
});

// Calculate ratios and identify home/shadow positions
planets.forEach(planet => {
  const profile = planetProfiles[planet];
  const exaltCount = profile.exaltations.length;
  const detriCount = profile.detriments.length;

  profile.summary = {
    exaltations: exaltCount,
    detriments: detriCount,
    ratio: detriCount > 0 ? (exaltCount / detriCount).toFixed(2) : 'INF',
    tendency: exaltCount > detriCount ? 'EXALTING' : exaltCount < detriCount ? 'DETRIMENT' : 'BALANCED'
  };

  // Find home positions (where planet exalts most)
  profile.homePositions = {
    centres: Object.entries(profile.stats.byCentre.exalt)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({ centre: k, count: v })),
    trigrams: Object.entries(profile.stats.byInnerTrigram.exalt)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({ trigram: k, count: v })),
    circuits: Object.entries(profile.stats.byCircuit.exalt)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({ circuit: k, count: v })),
    lines: Object.entries(profile.stats.byLine.exalt)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({ line: k, count: v }))
  };

  // Find shadow positions (where planet detriments most)
  profile.shadowPositions = {
    centres: Object.entries(profile.stats.byCentre.detri)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({ centre: k, count: v })),
    trigrams: Object.entries(profile.stats.byInnerTrigram.detri)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({ trigram: k, count: v })),
    circuits: Object.entries(profile.stats.byCircuit.detri)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({ circuit: k, count: v })),
    lines: Object.entries(profile.stats.byLine.detri)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({ line: k, count: v }))
  };
});

// Output summary
console.log('='.repeat(80));
console.log('PLANET PROFILES - PHASE 2 ANALYSIS');
console.log('='.repeat(80));

console.log('\n## OVERVIEW ##\n');
console.log('Planet          | Exalt | Detri | Ratio  | Tendency');
console.log('-'.repeat(55));

planets.forEach(planet => {
  const p = planetProfiles[planet];
  const name = planet.padEnd(15);
  const exalt = String(p.summary.exaltations).padStart(5);
  const detri = String(p.summary.detriments).padStart(5);
  const ratio = String(p.summary.ratio).padStart(6);
  console.log(`${name} | ${exalt} | ${detri} | ${ratio} | ${p.summary.tendency}`);
});

// Detailed output for key planets
const keyPlanets = ['Mars', 'Sun', 'Moon', 'Venus', 'Mercury', 'Pluto', 'Saturn'];

keyPlanets.forEach(planet => {
  const p = planetProfiles[planet];

  console.log('\n' + '='.repeat(80));
  console.log(`${planet.toUpperCase()} PROFILE`);
  console.log('='.repeat(80));

  console.log(`\nExaltations: ${p.summary.exaltations} | Detriments: ${p.summary.detriments} | Ratio: ${p.summary.ratio}`);

  console.log('\n## HOME POSITIONS (Where it exalts) ##\n');
  console.log('Top Centres:', p.homePositions.centres.map(c => `${c.centre}(${c.count})`).join(', '));
  console.log('Top Trigrams:', p.homePositions.trigrams.map(t => `${t.trigram}(${t.count})`).join(', '));
  console.log('Top Circuits:', p.homePositions.circuits.map(c => `${c.circuit}(${c.count})`).join(', '));
  console.log('Top Lines:', p.homePositions.lines.map(l => `L${l.line}(${l.count})`).join(', '));

  console.log('\n## SHADOW POSITIONS (Where it detriments) ##\n');
  console.log('Top Centres:', p.shadowPositions.centres.map(c => `${c.centre}(${c.count})`).join(', '));
  console.log('Top Trigrams:', p.shadowPositions.trigrams.map(t => `${t.trigram}(${t.count})`).join(', '));
  console.log('Top Circuits:', p.shadowPositions.circuits.map(c => `${c.circuit}(${c.count})`).join(', '));
  console.log('Top Lines:', p.shadowPositions.lines.map(l => `L${l.line}(${l.count})`).join(', '));

  // Gate type analysis
  console.log('\n## BY GATE TYPE ##\n');
  const allTypes = [...new Set([...Object.keys(p.stats.byGateType.exalt), ...Object.keys(p.stats.byGateType.detri)])];
  allTypes.forEach(type => {
    const e = p.stats.byGateType.exalt[type] || 0;
    const d = p.stats.byGateType.detri[type] || 0;
    const r = d > 0 ? (e / d).toFixed(2) : (e > 0 ? 'INF' : '-');
    console.log(`  ${type}: E=${e}, D=${d}, ratio=${r}`);
  });

  // Cross-zero analysis
  console.log('\n## CROSS-ZERO ANALYSIS ##\n');
  const czExalt = p.stats.byCrossZero.exalt;
  const czDetri = p.stats.byCrossZero.detri;
  console.log(`  Cross-zero gates: E=${czExalt.true || 0}, D=${czDetri.true || 0}`);
  console.log(`  Same-phase gates: E=${czExalt.false || 0}, D=${czDetri.false || 0}`);
});

// Save all data
const outputPath = path.join(__dirname, '../docs/research/planet-profiles-data.json');
fs.writeFileSync(outputPath, JSON.stringify(planetProfiles, null, 2));
console.log(`\nData saved to: ${outputPath}`);

// Generate individual planet profile markdown files
const profilesDir = path.join(__dirname, '../docs/research/planet-profiles');
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

planets.forEach(planet => {
  const p = planetProfiles[planet];
  const filename = planet.toLowerCase().replace(' ', '-') + '-profile.md';
  const filepath = path.join(profilesDir, filename);

  let md = `# ${planet} Profile\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Value |\n|--------|-------|\n`;
  md += `| Exaltations | ${p.summary.exaltations} |\n`;
  md += `| Detriments | ${p.summary.detriments} |\n`;
  md += `| Ratio (E/D) | ${p.summary.ratio} |\n`;
  md += `| Tendency | ${p.summary.tendency} |\n\n`;

  md += `## Home Positions (Exaltations)\n\n`;
  md += `### By Centre\n`;
  p.homePositions.centres.forEach(c => { md += `- ${c.centre}: ${c.count}\n`; });
  md += `\n### By Trigram (Inner)\n`;
  p.homePositions.trigrams.forEach(t => { md += `- ${t.trigram}: ${t.count}\n`; });
  md += `\n### By Circuit\n`;
  p.homePositions.circuits.forEach(c => { md += `- ${c.circuit}: ${c.count}\n`; });
  md += `\n### By Line\n`;
  p.homePositions.lines.forEach(l => { md += `- Line ${l.line}: ${l.count}\n`; });

  md += `\n## Shadow Positions (Detriments)\n\n`;
  md += `### By Centre\n`;
  p.shadowPositions.centres.forEach(c => { md += `- ${c.centre}: ${c.count}\n`; });
  md += `\n### By Trigram (Inner)\n`;
  p.shadowPositions.trigrams.forEach(t => { md += `- ${t.trigram}: ${t.count}\n`; });
  md += `\n### By Circuit\n`;
  p.shadowPositions.circuits.forEach(c => { md += `- ${c.circuit}: ${c.count}\n`; });
  md += `\n### By Line\n`;
  p.shadowPositions.lines.forEach(l => { md += `- Line ${l.line}: ${l.count}\n`; });

  md += `\n## All Exaltation Positions\n\n`;
  md += `| Gate.Line | Keynote | Centre | Circuit | Gate Type |\n`;
  md += `|-----------|---------|--------|---------|----------|\n`;
  p.exaltations.forEach(e => {
    md += `| ${e.gate}.${e.line} | ${e.keynote} | ${e.centre} | ${e.circuit} | ${e.gateType} |\n`;
  });

  md += `\n## All Detriment Positions\n\n`;
  md += `| Gate.Line | Keynote | Centre | Circuit | Gate Type |\n`;
  md += `|-----------|---------|--------|---------|----------|\n`;
  p.detriments.forEach(d => {
    md += `| ${d.gate}.${d.line} | ${d.keynote} | ${d.centre} | ${d.circuit} | ${d.gateType} |\n`;
  });

  fs.writeFileSync(filepath, md);
});

console.log(`\nIndividual profiles saved to: ${profilesDir}/`);
