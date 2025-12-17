#!/usr/bin/env node

/**
 * Deep Planetary Pattern Analysis
 *
 * Looking for electromagnetic correlations and hidden patterns
 */

const fs = require('fs');
const path = require('path');

// Load the analysis data
const analysisData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../docs/research/planetary-analysis-data.json'), 'utf8')
);

const { lineDetails, stats } = analysisData;

console.log('='.repeat(80));
console.log('DEEP PLANETARY PATTERN ANALYSIS');
console.log('='.repeat(80));

// 1. Look at polarity correlation
console.log('\n## 1. PLANETS BY POLARITY (YIN/YANG)\n');

const polarityStats = {
  YANG: { exaltations: {}, detriments: {} },
  YIN: { exaltations: {}, detriments: {} }
};

lineDetails.forEach(line => {
  const pol = line.polarity;
  if (!pol) return;

  polarityStats[pol].exaltations[line.exaltPlanet] = (polarityStats[pol].exaltations[line.exaltPlanet] || 0) + 1;
  polarityStats[pol].detriments[line.detriPlanet] = (polarityStats[pol].detriments[line.detriPlanet] || 0) + 1;
});

['YANG', 'YIN'].forEach(pol => {
  console.log(`\n### ${pol} Lines - Exaltations`);
  const sorted = Object.entries(polarityStats[pol].exaltations).sort((a, b) => b[1] - a[1]);
  sorted.slice(0, 7).forEach(([planet, count]) => console.log(`  ${planet}: ${count}`));

  console.log(`\n### ${pol} Lines - Detriments`);
  const sortedDet = Object.entries(polarityStats[pol].detriments).sort((a, b) => b[1] - a[1]);
  sortedDet.slice(0, 7).forEach(([planet, count]) => console.log(`  ${planet}: ${count}`));
});

// 2. Check inner vs outer trigram correlation
console.log('\n## 2. PLANETS BY INNER vs OUTER TRIGRAM (Lines 1-3 vs 4-6)\n');

const trigramStats = {
  inner: { exaltations: {}, detriments: {} },
  outer: { exaltations: {}, detriments: {} }
};

lineDetails.forEach(line => {
  const trigram = line.line <= 3 ? 'inner' : 'outer';
  trigramStats[trigram].exaltations[line.exaltPlanet] = (trigramStats[trigram].exaltations[line.exaltPlanet] || 0) + 1;
  trigramStats[trigram].detriments[line.detriPlanet] = (trigramStats[trigram].detriments[line.detriPlanet] || 0) + 1;
});

['inner', 'outer'].forEach(trig => {
  console.log(`\n### ${trig.toUpperCase()} Trigram (Lines ${trig === 'inner' ? '1-3' : '4-6'}) - Exaltations`);
  const sorted = Object.entries(trigramStats[trig].exaltations).sort((a, b) => b[1] - a[1]);
  sorted.slice(0, 7).forEach(([planet, count]) => console.log(`  ${planet}: ${count}`));
});

// 3. Look at specific line within trigram (1=entry, 2=development, 3=completion)
console.log('\n## 3. PLANETS BY TRIGRAM POSITION (entry/development/completion)\n');

const trigramPosMap = {
  1: 'entry', 2: 'development', 3: 'completion',
  4: 'entry', 5: 'development', 6: 'completion'
};

const trigramPosStats = {
  entry: { exaltations: {}, detriments: {} },
  development: { exaltations: {}, detriments: {} },
  completion: { exaltations: {}, detriments: {} }
};

lineDetails.forEach(line => {
  const pos = trigramPosMap[line.line];
  trigramPosStats[pos].exaltations[line.exaltPlanet] = (trigramPosStats[pos].exaltations[line.exaltPlanet] || 0) + 1;
  trigramPosStats[pos].detriments[line.detriPlanet] = (trigramPosStats[pos].detriments[line.detriPlanet] || 0) + 1;
});

['entry', 'development', 'completion'].forEach(pos => {
  console.log(`\n### ${pos.toUpperCase()} Position (Lines ${pos === 'entry' ? '1,4' : pos === 'development' ? '2,5' : '3,6'})`);
  console.log('Exaltations:');
  const sorted = Object.entries(trigramPosStats[pos].exaltations).sort((a, b) => b[1] - a[1]);
  sorted.slice(0, 5).forEach(([planet, count]) => console.log(`  ${planet}: ${count}`));
  console.log('Detriments:');
  const sortedDet = Object.entries(trigramPosStats[pos].detriments).sort((a, b) => b[1] - a[1]);
  sortedDet.slice(0, 5).forEach(([planet, count]) => console.log(`  ${planet}: ${count}`));
});

// 4. Check if certain planets appear with certain gate types
console.log('\n## 4. PLANET RATIOS BY GATE TYPE\n');

const gateTypeRatios = {};

lineDetails.forEach(line => {
  const gt = line.gateType;
  gateTypeRatios[gt] = gateTypeRatios[gt] || {};

  if (line.exaltPlanet !== 'None') {
    gateTypeRatios[gt][line.exaltPlanet] = gateTypeRatios[gt][line.exaltPlanet] || { exalt: 0, detri: 0 };
    gateTypeRatios[gt][line.exaltPlanet].exalt++;
  }
  if (line.detriPlanet !== 'None') {
    gateTypeRatios[gt][line.detriPlanet] = gateTypeRatios[gt][line.detriPlanet] || { exalt: 0, detri: 0 };
    gateTypeRatios[gt][line.detriPlanet].detri++;
  }
});

Object.entries(gateTypeRatios).forEach(([gateType, planets]) => {
  console.log(`\n### ${gateType}`);

  // Find planets that are strongly exalted or strongly in detriment in this gate type
  Object.entries(planets).forEach(([planet, counts]) => {
    const total = counts.exalt + counts.detri;
    if (total >= 5) {
      const ratio = counts.detri > 0 ? (counts.exalt / counts.detri).toFixed(2) : 'INF';
      const bias = counts.exalt > counts.detri ? 'EXALT' : counts.detri > counts.exalt ? 'DETRI' : 'EVEN';
      if (bias !== 'EVEN') {
        console.log(`  ${planet}: ${counts.exalt}/${counts.detri} (${bias}, ratio=${ratio})`);
      }
    }
  });
});

// 5. Look for cross-zero vs same-phase patterns
console.log('\n## 5. TRANSFORMATION vs CIRCULATION (Cross-zero vs Same-phase)\n');

const transformationStats = {
  transformation: { exaltations: {}, detriments: {} },
  circulation: { exaltations: {}, detriments: {} },
  standing: { exaltations: {}, detriments: {} }
};

lineDetails.forEach(line => {
  let category;
  if (line.gateType === 'doubled') {
    category = 'standing';
  } else if (line.gateType.startsWith('cross-zero')) {
    category = 'transformation';
  } else {
    category = 'circulation';
  }

  transformationStats[category].exaltations[line.exaltPlanet] = (transformationStats[category].exaltations[line.exaltPlanet] || 0) + 1;
  transformationStats[category].detriments[line.detriPlanet] = (transformationStats[category].detriments[line.detriPlanet] || 0) + 1;
});

['transformation', 'circulation', 'standing'].forEach(cat => {
  console.log(`\n### ${cat.toUpperCase()} Gates`);
  console.log('Exaltations:');
  const sorted = Object.entries(transformationStats[cat].exaltations).sort((a, b) => b[1] - a[1]);
  sorted.slice(0, 6).forEach(([planet, count]) => console.log(`  ${planet}: ${count}`));
});

// 6. Looking for Sun-Moon-Earth patterns (the luminaries)
console.log('\n## 6. LUMINARY ANALYSIS (Sun, Moon, Earth)\n');

const luminaries = ['Sun', 'Moon', 'Earth'];
const luminaryByLine = {};

for (let line = 1; line <= 6; line++) {
  luminaryByLine[line] = { exalt: {}, detri: {} };
  luminaries.forEach(l => {
    luminaryByLine[line].exalt[l] = stats.lineExaltations[line][l] || 0;
    luminaryByLine[line].detri[l] = stats.lineDetriments[line][l] || 0;
  });
}

console.log('Line  | Sun Ex/Det | Moon Ex/Det | Earth Ex/Det');
console.log('-'.repeat(55));
for (let line = 1; line <= 6; line++) {
  const s = luminaryByLine[line];
  console.log(`  ${line}   |   ${s.exalt.Sun}/${s.detri.Sun}      |    ${s.exalt.Moon}/${s.detri.Moon}       |    ${s.exalt.Earth}/${s.detri.Earth}`);
}

// 7. Mars analysis - why so many detriments?
console.log('\n## 7. MARS DEEP ANALYSIS (Why 94 detriments?)\n');

const marsDetrimentsByGateType = {};
const marsDetrimentsByLine = {};
const marsDetrimentsByPosition = {};

lineDetails.filter(l => l.detriPlanet === 'Mars').forEach(line => {
  marsDetrimentsByGateType[line.gateType] = (marsDetrimentsByGateType[line.gateType] || 0) + 1;
  marsDetrimentsByLine[line.line] = (marsDetrimentsByLine[line.line] || 0) + 1;
  marsDetrimentsByPosition[line.linePosition] = (marsDetrimentsByPosition[line.linePosition] || 0) + 1;
});

console.log('Mars Detriments by Gate Type:');
Object.entries(marsDetrimentsByGateType).sort((a,b) => b[1] - a[1]).forEach(([gt, count]) => {
  console.log(`  ${gt}: ${count}`);
});

console.log('\nMars Detriments by Line:');
for (let line = 1; line <= 6; line++) {
  console.log(`  Line ${line}: ${marsDetrimentsByLine[line] || 0}`);
}

console.log('\nMars Detriments by EM Position:');
Object.entries(marsDetrimentsByPosition).sort((a,b) => b[1] - a[1]).forEach(([pos, count]) => {
  console.log(`  Position ${pos}: ${count}`);
});

// 8. Check for node patterns (North Node, South Node)
console.log('\n## 8. NODAL PATTERNS (North Node / South Node)\n');

const nodalStats = {
  'North Node': { exalt: 0, detri: 0, byLine: {} },
  'South Node': { exalt: 0, detri: 0, byLine: {} }
};

lineDetails.forEach(line => {
  ['North Node', 'South Node'].forEach(node => {
    if (line.exaltPlanet === node) {
      nodalStats[node].exalt++;
      nodalStats[node].byLine[line.line] = (nodalStats[node].byLine[line.line] || { exalt: 0, detri: 0 });
      nodalStats[node].byLine[line.line].exalt++;
    }
    if (line.detriPlanet === node) {
      nodalStats[node].detri++;
      nodalStats[node].byLine[line.line] = (nodalStats[node].byLine[line.line] || { exalt: 0, detri: 0 });
      nodalStats[node].byLine[line.line].detri++;
    }
  });
});

console.log('North Node:', nodalStats['North Node']);
console.log('South Node:', nodalStats['South Node']);

// 9. Personal vs Transpersonal planets
console.log('\n## 9. PERSONAL vs TRANSPERSONAL PLANETS\n');

const personal = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
const social = ['Jupiter', 'Saturn'];
const transpersonal = ['Uranus', 'Neptune', 'Pluto'];

const categoryCounts = {
  personal: { exalt: 0, detri: 0 },
  social: { exalt: 0, detri: 0 },
  transpersonal: { exalt: 0, detri: 0 }
};

lineDetails.forEach(line => {
  if (personal.includes(line.exaltPlanet)) categoryCounts.personal.exalt++;
  if (social.includes(line.exaltPlanet)) categoryCounts.social.exalt++;
  if (transpersonal.includes(line.exaltPlanet)) categoryCounts.transpersonal.exalt++;

  if (personal.includes(line.detriPlanet)) categoryCounts.personal.detri++;
  if (social.includes(line.detriPlanet)) categoryCounts.social.detri++;
  if (transpersonal.includes(line.detriPlanet)) categoryCounts.transpersonal.detri++;
});

console.log('Category       Exalt   Detri   Ratio');
console.log('-'.repeat(45));
Object.entries(categoryCounts).forEach(([cat, counts]) => {
  const ratio = counts.detri > 0 ? (counts.exalt / counts.detri).toFixed(2) : 'N/A';
  console.log(`${cat.padEnd(15)} ${counts.exalt}      ${counts.detri}      ${ratio}`);
});

// 10. Specific gate type + line combinations
console.log('\n## 10. GATE TYPE + LINE COMBINATIONS\n');

const gateLineCombo = {};

lineDetails.forEach(line => {
  const key = `${line.gateType}-L${line.line}`;
  gateLineCombo[key] = gateLineCombo[key] || { exaltations: {}, detriments: {} };
  gateLineCombo[key].exaltations[line.exaltPlanet] = (gateLineCombo[key].exaltations[line.exaltPlanet] || 0) + 1;
  gateLineCombo[key].detriments[line.detriPlanet] = (gateLineCombo[key].detriments[line.detriPlanet] || 0) + 1;
});

// Show most concentrated patterns
console.log('Most concentrated exaltation patterns:');
Object.entries(gateLineCombo).forEach(([key, data]) => {
  const sorted = Object.entries(data.exaltations).sort((a, b) => b[1] - a[1]);
  if (sorted[0] && sorted[0][1] >= 4) {
    console.log(`  ${key}: ${sorted[0][0]} appears ${sorted[0][1]} times`);
  }
});

console.log('\n='.repeat(80));
