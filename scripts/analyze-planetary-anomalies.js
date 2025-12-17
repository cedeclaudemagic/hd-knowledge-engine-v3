#!/usr/bin/env node

/**
 * Planetary Anomaly Analysis
 *
 * Deep dive into the exceptions and outliers:
 * - Where do "always detriment" planets succeed?
 * - Where do "always exalted" planets fail?
 * - What makes specific gate/line combinations unique?
 */

const fs = require('fs');
const path = require('path');

// Load data
const traditionalGates = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json'), 'utf8')
);

const electromagneticLines = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json'), 'utf8')
);

// Build lookups
const emLookup = {};
electromagneticLines.mappings.forEach(line => {
  emLookup[`${line.gate}-${line.line}`] = line;
});

// Collect all line data with full context
const allLines = [];

traditionalGates.mappings.forEach(entry => {
  const gate = entry.gateNumber;
  const line = entry.lineNumber;
  const key = `${gate}-${line}`;
  const emData = emLookup[key];

  if (!emData) return;

  const exaltPlanets = entry.knowledge.blackBook?.exaltation?.planets || [];
  const detriPlanets = entry.knowledge.blackBook?.detriment?.planets || [];
  const exaltPlanet = exaltPlanets[0]?.planet || 'None';
  const detriPlanet = detriPlanets[0]?.planet || 'None';
  const exaltDesc = exaltPlanets[0]?.description?.whiteBook || '';
  const detriDesc = detriPlanets[0]?.description?.whiteBook || '';

  allLines.push({
    gate,
    line,
    key,
    gateName: emData.gateName,
    gateKeyword: emData.gateKeyword,
    keynote: entry.knowledge.lineKeynote,
    polarity: entry.knowledge.polarity,
    exaltPlanet,
    detriPlanet,
    exaltDesc,
    detriDesc,
    gateType: emData.electromagnetic.gateType,
    innerTrigram: emData.electromagnetic.innerTrigram.name,
    outerTrigram: emData.electromagnetic.outerTrigram.name,
    innerPos: emData.electromagnetic.innerTrigram.position,
    outerPos: emData.electromagnetic.outerTrigram.position,
    centre: emData.context.centre,
    circuits: emData.context.circuits,
    circuitArch: emData.context.circuitArchitecture,
    channels: emData.context.channels
  });
});

console.log('='.repeat(80));
console.log('PLANETARY ANOMALY ANALYSIS');
console.log('='.repeat(80));

// 1. Mars Exaltations (the rare cases where Mars works)
console.log('\n## 1. MARS EXALTATIONS (29 cases - where does force serve?)\n');

const marsExalt = allLines.filter(l => l.exaltPlanet === 'Mars');
console.log(`Total Mars exaltations: ${marsExalt.length}\n`);

// Group by various factors
const marsExaltByGateType = {};
const marsExaltByTrigram = {};
const marsExaltByCentre = {};
const marsExaltByCircuit = {};
const marsExaltByLine = {};

marsExalt.forEach(l => {
  // By gate type
  marsExaltByGateType[l.gateType] = marsExaltByGateType[l.gateType] || [];
  marsExaltByGateType[l.gateType].push(l);

  // By trigram (which one is the line in)
  const trigram = l.line <= 3 ? l.innerTrigram : l.outerTrigram;
  marsExaltByTrigram[trigram] = marsExaltByTrigram[trigram] || [];
  marsExaltByTrigram[trigram].push(l);

  // By centre
  marsExaltByCentre[l.centre] = marsExaltByCentre[l.centre] || [];
  marsExaltByCentre[l.centre].push(l);

  // By circuit
  l.circuits.forEach(c => {
    const circuit = c.replace(' Circuit', '');
    marsExaltByCircuit[circuit] = marsExaltByCircuit[circuit] || [];
    marsExaltByCircuit[circuit].push(l);
  });

  // By line
  marsExaltByLine[l.line] = marsExaltByLine[l.line] || [];
  marsExaltByLine[l.line].push(l);
});

console.log('By Gate Type:');
Object.entries(marsExaltByGateType).sort((a,b) => b[1].length - a[1].length).forEach(([gt, lines]) => {
  console.log(`  ${gt}: ${lines.length}`);
});

console.log('\nBy Trigram (line is IN):');
Object.entries(marsExaltByTrigram).sort((a,b) => b[1].length - a[1].length).forEach(([trig, lines]) => {
  console.log(`  ${trig}: ${lines.length}`);
});

console.log('\nBy Centre:');
Object.entries(marsExaltByCentre).sort((a,b) => b[1].length - a[1].length).forEach(([centre, lines]) => {
  console.log(`  ${centre}: ${lines.length}`);
});

console.log('\nBy Circuit:');
Object.entries(marsExaltByCircuit).sort((a,b) => b[1].length - a[1].length).forEach(([circuit, lines]) => {
  console.log(`  ${circuit}: ${lines.length}`);
});

console.log('\nBy Line:');
for (let i = 1; i <= 6; i++) {
  console.log(`  Line ${i}: ${(marsExaltByLine[i] || []).length}`);
}

console.log('\nSpecific Mars Exaltations:');
marsExalt.forEach(l => {
  console.log(`  Gate ${l.gate}.${l.line} (${l.gateName}) - ${l.centre} - ${l.gateType}`);
  console.log(`    Trigram: ${l.line <= 3 ? l.innerTrigram : l.outerTrigram}, Keynote: "${l.keynote}"`);
  console.log(`    Exalt desc: "${l.exaltDesc.substring(0, 60)}..."`);
});

// 2. Sun Detriments (the rare cases where light fails)
console.log('\n\n## 2. SUN DETRIMENTS (13 cases - where does light fail?)\n');

const sunDetri = allLines.filter(l => l.detriPlanet === 'Sun');
console.log(`Total Sun detriments: ${sunDetri.length}\n`);

const sunDetriByGateType = {};
const sunDetriByCentre = {};

sunDetri.forEach(l => {
  sunDetriByGateType[l.gateType] = sunDetriByGateType[l.gateType] || [];
  sunDetriByGateType[l.gateType].push(l);

  sunDetriByCentre[l.centre] = sunDetriByCentre[l.centre] || [];
  sunDetriByCentre[l.centre].push(l);
});

console.log('By Gate Type:');
Object.entries(sunDetriByGateType).forEach(([gt, lines]) => {
  console.log(`  ${gt}: ${lines.length}`);
});

console.log('\nBy Centre:');
Object.entries(sunDetriByCentre).forEach(([centre, lines]) => {
  console.log(`  ${centre}: ${lines.length}`);
});

console.log('\nSpecific Sun Detriments:');
sunDetri.forEach(l => {
  console.log(`  Gate ${l.gate}.${l.line} (${l.gateName}) - ${l.centre} - ${l.gateType}`);
  console.log(`    Keynote: "${l.keynote}"`);
  console.log(`    Detri desc: "${l.detriDesc.substring(0, 80)}..."`);
});

// 3. Moon in Integration Circuit (always detriment)
console.log('\n\n## 3. MOON IN INTEGRATION (0/8 - never works)\n');

const integrationLines = allLines.filter(l => l.circuits.some(c => c.includes('Integration')));
const moonIntegration = integrationLines.filter(l => l.exaltPlanet === 'Moon' || l.detriPlanet === 'Moon');

console.log(`Integration Circuit lines with Moon: ${moonIntegration.length}`);
console.log(`  Moon exalted: ${moonIntegration.filter(l => l.exaltPlanet === 'Moon').length}`);
console.log(`  Moon detriment: ${moonIntegration.filter(l => l.detriPlanet === 'Moon').length}`);

console.log('\nAll Moon detriments in Integration:');
moonIntegration.filter(l => l.detriPlanet === 'Moon').forEach(l => {
  console.log(`  Gate ${l.gate}.${l.line} (${l.gateName}) - ${l.centre}`);
  console.log(`    Keynote: "${l.keynote}"`);
  console.log(`    Detri desc: "${l.detriDesc}"`);
  console.log(`    Exalt planet: ${l.exaltPlanet}`);
});

// 4. Venus in Sensing (unusually detriment)
console.log('\n\n## 4. VENUS IN SENSING (7/15 ratio - beauty disrupts)\n');

const sensingLines = allLines.filter(l => l.circuits.some(c => c.includes('Sensing')));
const venusSensing = sensingLines.filter(l => l.exaltPlanet === 'Venus' || l.detriPlanet === 'Venus');

console.log(`Sensing Circuit lines with Venus: ${venusSensing.length}`);
console.log(`  Venus exalted: ${venusSensing.filter(l => l.exaltPlanet === 'Venus').length}`);
console.log(`  Venus detriment: ${venusSensing.filter(l => l.detriPlanet === 'Venus').length}`);

console.log('\nVenus detriments in Sensing:');
venusSensing.filter(l => l.detriPlanet === 'Venus').forEach(l => {
  console.log(`  Gate ${l.gate}.${l.line} (${l.gateName}) - ${l.centre} - Line ${l.line}`);
  console.log(`    Keynote: "${l.keynote}"`);
  console.log(`    Detri desc: "${l.detriDesc}"`);
});

// 5. Where Saturn fails (rare)
console.log('\n\n## 5. SATURN DETRIMENTS (14 cases - where structure fails)\n');

const saturnDetri = allLines.filter(l => l.detriPlanet === 'Saturn');
console.log(`Total Saturn detriments: ${saturnDetri.length}\n`);

const saturnDetriByCircuit = {};
saturnDetri.forEach(l => {
  l.circuits.forEach(c => {
    const circuit = c.replace(' Circuit', '');
    saturnDetriByCircuit[circuit] = saturnDetriByCircuit[circuit] || [];
    saturnDetriByCircuit[circuit].push(l);
  });
});

console.log('By Circuit:');
Object.entries(saturnDetriByCircuit).forEach(([circuit, lines]) => {
  console.log(`  ${circuit}: ${lines.length}`);
});

console.log('\nSpecific Saturn Detriments:');
saturnDetri.forEach(l => {
  console.log(`  Gate ${l.gate}.${l.line} (${l.gateName}) - ${l.circuits.join(', ')}`);
  console.log(`    Detri desc: "${l.detriDesc}"`);
});

// 6. Pluto patterns (depth - where does it work/fail?)
console.log('\n\n## 6. PLUTO PATTERNS (42 exalt, 32 detri)\n');

const plutoExalt = allLines.filter(l => l.exaltPlanet === 'Pluto');
const plutoDetri = allLines.filter(l => l.detriPlanet === 'Pluto');

const plutoExaltByPos = {};
const plutoDetriByPos = {};

plutoExalt.forEach(l => {
  const pos = l.line <= 3 ? l.innerPos : l.outerPos;
  plutoExaltByPos[pos] = (plutoExaltByPos[pos] || 0) + 1;
});

plutoDetri.forEach(l => {
  const pos = l.line <= 3 ? l.innerPos : l.outerPos;
  plutoDetriByPos[pos] = (plutoDetriByPos[pos] || 0) + 1;
});

console.log('Pluto by EM Position:');
console.log('Position  Exalt  Detri  Ratio');
[-4, -3, -2, -1, 1, 2, 3, 4].forEach(pos => {
  const ex = plutoExaltByPos[pos] || 0;
  const det = plutoDetriByPos[pos] || 0;
  const ratio = det > 0 ? (ex/det).toFixed(2) : (ex > 0 ? 'INF' : '0');
  console.log(`  ${pos}       ${ex}      ${det}      ${ratio}`);
});

// 7. Perfect pairs - where does the same planet appear as both exalt and detri in same gate?
console.log('\n\n## 7. SAME PLANET EXALT AND DETRI IN SAME GATE\n');

const gateAnalysis = {};
allLines.forEach(l => {
  gateAnalysis[l.gate] = gateAnalysis[l.gate] || { exalt: {}, detri: {} };
  if (l.exaltPlanet !== 'None') {
    gateAnalysis[l.gate].exalt[l.exaltPlanet] = (gateAnalysis[l.gate].exalt[l.exaltPlanet] || 0) + 1;
  }
  if (l.detriPlanet !== 'None') {
    gateAnalysis[l.gate].detri[l.detriPlanet] = (gateAnalysis[l.gate].detri[l.detriPlanet] || 0) + 1;
  }
});

const samePlanetBothRoles = [];
Object.entries(gateAnalysis).forEach(([gate, data]) => {
  const exaltPlanets = Object.keys(data.exalt);
  const detriPlanets = Object.keys(data.detri);
  const overlap = exaltPlanets.filter(p => detriPlanets.includes(p));
  if (overlap.length > 0) {
    overlap.forEach(planet => {
      samePlanetBothRoles.push({
        gate: parseInt(gate),
        planet,
        exaltCount: data.exalt[planet],
        detriCount: data.detri[planet]
      });
    });
  }
});

console.log('Gates where same planet appears exalted AND detriment:');
samePlanetBothRoles.sort((a,b) => (b.exaltCount + b.detriCount) - (a.exaltCount + a.detriCount)).slice(0, 20).forEach(item => {
  const gateData = allLines.find(l => l.gate === item.gate);
  console.log(`  Gate ${item.gate} (${gateData?.gateName}): ${item.planet} - ${item.exaltCount} exalt, ${item.detriCount} detri`);
});

// 8. Gates with unusual planet concentration
console.log('\n\n## 8. GATES WITH UNUSUAL PLANETARY CONCENTRATION\n');

Object.entries(gateAnalysis).forEach(([gate, data]) => {
  const exaltCounts = Object.entries(data.exalt).sort((a,b) => b[1] - a[1]);
  const detriCounts = Object.entries(data.detri).sort((a,b) => b[1] - a[1]);

  // If one planet appears 3+ times in exalt or detri
  if (exaltCounts[0] && exaltCounts[0][1] >= 3) {
    const gateData = allLines.find(l => l.gate === parseInt(gate));
    console.log(`Gate ${gate} (${gateData?.gateName}): ${exaltCounts[0][0]} exalted ${exaltCounts[0][1]}x`);
  }
  if (detriCounts[0] && detriCounts[0][1] >= 4) {
    const gateData = allLines.find(l => l.gate === parseInt(gate));
    console.log(`Gate ${gate} (${gateData?.gateName}): ${detriCounts[0][0]} detriment ${detriCounts[0][1]}x`);
  }
});

// 9. The Water/Water (Gate 29) anomaly - Mars always exalted
console.log('\n\n## 9. GATE 29 (WATER/WATER) - MARS EXALTED\n');

const gate29 = allLines.filter(l => l.gate === 29);
console.log('Gate 29 - The Abysmal (Water/Water) - Sacral - Saying Yes');
console.log('Gate Type: doubled (standing wave at +2, Current)');
console.log('\nAll 6 lines:');
gate29.forEach(l => {
  console.log(`  Line ${l.line}: Exalt=${l.exaltPlanet}, Detri=${l.detriPlanet}`);
  console.log(`    Keynote: "${l.keynote}"`);
});

// 10. The Wind/Wind (Gate 57) anomaly - Moon always detriment
console.log('\n\n## 10. GATE 57 (WIND/WIND) - MOON DETRIMENT\n');

const gate57 = allLines.filter(l => l.gate === 57);
console.log('Gate 57 - The Gentle (Wind/Wind) - Spleen - Intuitive Clarity');
console.log('Gate Type: doubled (standing wave at -1, Gate OUT)');
console.log('\nAll 6 lines:');
gate57.forEach(l => {
  console.log(`  Line ${l.line}: Exalt=${l.exaltPlanet}, Detri=${l.detriPlanet}`);
  console.log(`    Keynote: "${l.keynote}"`);
});

// 11. Earth patterns - grounding
console.log('\n\n## 11. EARTH PATTERNS (20 exalt, 27 detri)\n');

const earthExalt = allLines.filter(l => l.exaltPlanet === 'Earth');
const earthDetri = allLines.filter(l => l.detriPlanet === 'Earth');

console.log('Earth Exaltations by Centre:');
const earthExaltByCentre = {};
earthExalt.forEach(l => {
  earthExaltByCentre[l.centre] = (earthExaltByCentre[l.centre] || 0) + 1;
});
Object.entries(earthExaltByCentre).sort((a,b) => b[1] - a[1]).forEach(([c, n]) => {
  console.log(`  ${c}: ${n}`);
});

console.log('\nEarth Detriments by Centre:');
const earthDetriByCentre = {};
earthDetri.forEach(l => {
  earthDetriByCentre[l.centre] = (earthDetriByCentre[l.centre] || 0) + 1;
});
Object.entries(earthDetriByCentre).sort((a,b) => b[1] - a[1]).forEach(([c, n]) => {
  console.log(`  ${c}: ${n}`);
});

// 12. Mercury - mental processing (mostly detriment)
console.log('\n\n## 12. MERCURY EXALTATIONS (14 rare cases)\n');

const mercuryExalt = allLines.filter(l => l.exaltPlanet === 'Mercury');
console.log('Mercury exaltations - where does mind serve?');
mercuryExalt.forEach(l => {
  console.log(`  Gate ${l.gate}.${l.line} (${l.gateName}) - ${l.centre} - ${l.circuits.join(', ')}`);
  console.log(`    Keynote: "${l.keynote}"`);
});

console.log('\n' + '='.repeat(80));
