#!/usr/bin/env node

/**
 * Planetary Pattern Analysis
 *
 * Analyzes the distribution of planets in exaltation and detriment
 * across all 384 lines to find electromagnetic correlations
 */

const fs = require('fs');
const path = require('path');

// Load data files
const traditionalGates = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json'), 'utf8')
);

const electromagneticLines = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json'), 'utf8')
);

// Build lookup for electromagnetic data
const emLookup = {};
electromagneticLines.mappings.forEach(line => {
  emLookup[`${line.gate}-${line.line}`] = line;
});

// Planets in Human Design
const PLANETS = ['Sun', 'Earth', 'Moon', 'North Node', 'South Node', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

// Initialize counters
const stats = {
  byPlanet: {},
  byLine: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} },
  byGateType: {},
  byPosition: {},
  byAxis: {},
  exaltationDetrimentPairs: {},
  lineExaltations: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} },
  lineDetriments: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} }
};

// Initialize planet counters
PLANETS.forEach(planet => {
  stats.byPlanet[planet] = { exaltation: 0, detriment: 0, total: 0 };
});

// Initialize line counters for each planet
for (let line = 1; line <= 6; line++) {
  PLANETS.forEach(planet => {
    stats.lineExaltations[line][planet] = 0;
    stats.lineDetriments[line][planet] = 0;
  });
}

// Process each line
const lineDetails = [];

traditionalGates.mappings.forEach(entry => {
  const gate = entry.gateNumber;
  const line = entry.lineNumber;
  const key = `${gate}-${line}`;
  const emData = emLookup[key];

  // Get planets from blackBook (primary source)
  const exaltPlanets = entry.knowledge.blackBook?.exaltation?.planets || [];
  const detriPlanets = entry.knowledge.blackBook?.detriment?.planets || [];

  const exaltPlanet = exaltPlanets[0]?.planet || 'None';
  const detriPlanet = detriPlanets[0]?.planet || 'None';

  // Count by planet
  if (exaltPlanet !== 'None') {
    stats.byPlanet[exaltPlanet] = stats.byPlanet[exaltPlanet] || { exaltation: 0, detriment: 0, total: 0 };
    stats.byPlanet[exaltPlanet].exaltation++;
    stats.byPlanet[exaltPlanet].total++;
    stats.lineExaltations[line][exaltPlanet]++;
  }

  if (detriPlanet !== 'None') {
    stats.byPlanet[detriPlanet] = stats.byPlanet[detriPlanet] || { exaltation: 0, detriment: 0, total: 0 };
    stats.byPlanet[detriPlanet].detriment++;
    stats.byPlanet[detriPlanet].total++;
    stats.lineDetriments[line][detriPlanet]++;
  }

  // Track exaltation-detriment pairs
  const pair = `${exaltPlanet}/${detriPlanet}`;
  stats.exaltationDetrimentPairs[pair] = (stats.exaltationDetrimentPairs[pair] || 0) + 1;

  // If we have electromagnetic data, analyze by gate type and position
  if (emData) {
    const gateType = emData.electromagnetic.gateType;
    const innerPos = emData.electromagnetic.innerTrigram.position;
    const outerPos = emData.electromagnetic.outerTrigram.position;
    const innerAxis = emData.electromagnetic.innerTrigram.axis;
    const outerAxis = emData.electromagnetic.outerTrigram.axis;

    // By gate type
    stats.byGateType[gateType] = stats.byGateType[gateType] || { exaltations: {}, detriments: {} };
    stats.byGateType[gateType].exaltations[exaltPlanet] = (stats.byGateType[gateType].exaltations[exaltPlanet] || 0) + 1;
    stats.byGateType[gateType].detriments[detriPlanet] = (stats.byGateType[gateType].detriments[detriPlanet] || 0) + 1;

    // By inner position (which trigram the line is "in")
    const linePosition = line <= 3 ? innerPos : outerPos;
    const lineAxis = line <= 3 ? innerAxis : outerAxis;

    stats.byPosition[linePosition] = stats.byPosition[linePosition] || { exaltations: {}, detriments: {} };
    stats.byPosition[linePosition].exaltations[exaltPlanet] = (stats.byPosition[linePosition].exaltations[exaltPlanet] || 0) + 1;
    stats.byPosition[linePosition].detriments[detriPlanet] = (stats.byPosition[linePosition].detriments[detriPlanet] || 0) + 1;

    stats.byAxis[lineAxis] = stats.byAxis[lineAxis] || { exaltations: {}, detriments: {} };
    stats.byAxis[lineAxis].exaltations[exaltPlanet] = (stats.byAxis[lineAxis].exaltations[exaltPlanet] || 0) + 1;
    stats.byAxis[lineAxis].detriments[detriPlanet] = (stats.byAxis[lineAxis].detriments[detriPlanet] || 0) + 1;

    lineDetails.push({
      gate, line, key,
      exaltPlanet, detriPlanet,
      gateType,
      innerPos, outerPos,
      innerAxis, outerAxis,
      linePosition, lineAxis,
      polarity: entry.knowledge.polarity
    });
  }
});

// Output analysis
console.log('='.repeat(80));
console.log('PLANETARY PATTERN ANALYSIS');
console.log('='.repeat(80));

console.log('\n## 1. OVERALL PLANET DISTRIBUTION\n');
console.log('Planet'.padEnd(15), 'Exalt'.padStart(8), 'Detri'.padStart(8), 'Total'.padStart(8), 'Ex/Det Ratio'.padStart(12));
console.log('-'.repeat(55));

const planetsByTotal = Object.entries(stats.byPlanet)
  .filter(([p, s]) => s.total > 0)
  .sort((a, b) => b[1].total - a[1].total);

planetsByTotal.forEach(([planet, s]) => {
  const ratio = s.detriment > 0 ? (s.exaltation / s.detriment).toFixed(2) : 'N/A';
  console.log(planet.padEnd(15), String(s.exaltation).padStart(8), String(s.detriment).padStart(8), String(s.total).padStart(8), ratio.padStart(12));
});

console.log('\n## 2. PLANETS BY LINE POSITION (Exaltations)\n');
console.log('Planet'.padEnd(15), 'L1'.padStart(6), 'L2'.padStart(6), 'L3'.padStart(6), 'L4'.padStart(6), 'L5'.padStart(6), 'L6'.padStart(6));
console.log('-'.repeat(55));

planetsByTotal.forEach(([planet]) => {
  const counts = [];
  for (let line = 1; line <= 6; line++) {
    counts.push(String(stats.lineExaltations[line][planet] || 0).padStart(6));
  }
  console.log(planet.padEnd(15), ...counts);
});

console.log('\n## 3. PLANETS BY LINE POSITION (Detriments)\n');
console.log('Planet'.padEnd(15), 'L1'.padStart(6), 'L2'.padStart(6), 'L3'.padStart(6), 'L4'.padStart(6), 'L5'.padStart(6), 'L6'.padStart(6));
console.log('-'.repeat(55));

planetsByTotal.forEach(([planet]) => {
  const counts = [];
  for (let line = 1; line <= 6; line++) {
    counts.push(String(stats.lineDetriments[line][planet] || 0).padStart(6));
  }
  console.log(planet.padEnd(15), ...counts);
});

console.log('\n## 4. COMMON EXALTATION/DETRIMENT PAIRS\n');
const pairsSorted = Object.entries(stats.exaltationDetrimentPairs)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);

pairsSorted.forEach(([pair, count]) => {
  console.log(`${pair.padEnd(25)} ${count}`);
});

console.log('\n## 5. PLANETS BY GATE TYPE (Exaltations)\n');
Object.entries(stats.byGateType).forEach(([gateType, data]) => {
  console.log(`\n### ${gateType}`);
  const sorted = Object.entries(data.exaltations).sort((a, b) => b[1] - a[1]);
  sorted.slice(0, 5).forEach(([planet, count]) => {
    console.log(`  ${planet}: ${count}`);
  });
});

console.log('\n## 6. PLANETS BY ELECTROMAGNETIC POSITION (Exaltations)\n');
const positions = [-4, -3, -2, -1, 1, 2, 3, 4];
positions.forEach(pos => {
  if (stats.byPosition[pos]) {
    console.log(`\n### Position ${pos}`);
    const sorted = Object.entries(stats.byPosition[pos].exaltations).sort((a, b) => b[1] - a[1]);
    sorted.slice(0, 5).forEach(([planet, count]) => {
      console.log(`  ${planet}: ${count}`);
    });
  }
});

console.log('\n## 7. PLANETS BY AXIS (Exaltations)\n');
Object.entries(stats.byAxis).forEach(([axis, data]) => {
  console.log(`\n### ${axis} axis`);
  const sorted = Object.entries(data.exaltations).sort((a, b) => b[1] - a[1]);
  sorted.slice(0, 5).forEach(([planet, count]) => {
    console.log(`  ${planet}: ${count}`);
  });
});

// Look for specific patterns
console.log('\n## 8. PATTERN ANALYSIS\n');

// Check if certain planets prefer certain lines
console.log('### Line Preference Analysis (Chi-square style)\n');
const totalLines = 384;
const expectedPerLine = totalLines / 6;

PLANETS.forEach(planet => {
  const planetTotal = stats.byPlanet[planet]?.exaltation || 0;
  if (planetTotal < 10) return;

  const expected = planetTotal / 6;
  let deviation = 0;
  let maxLine = 1;
  let maxCount = 0;

  for (let line = 1; line <= 6; line++) {
    const observed = stats.lineExaltations[line][planet] || 0;
    deviation += Math.pow(observed - expected, 2) / expected;
    if (observed > maxCount) {
      maxCount = observed;
      maxLine = line;
    }
  }

  if (deviation > 10) { // Significant deviation
    console.log(`${planet}: Strong line preference (deviation=${deviation.toFixed(1)}), peaks at Line ${maxLine} (${maxCount})`);
  }
});

// Output raw data for further analysis
const outputData = {
  stats,
  lineDetails
};

fs.writeFileSync(
  path.join(__dirname, '../docs/research/planetary-analysis-data.json'),
  JSON.stringify(outputData, null, 2)
);

console.log('\n\nDetailed data saved to docs/research/planetary-analysis-data.json');
