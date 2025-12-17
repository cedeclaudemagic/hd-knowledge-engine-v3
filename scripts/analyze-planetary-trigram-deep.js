#!/usr/bin/env node

/**
 * Deep Trigram-Planet-Centre Analysis
 *
 * Looking for connections between:
 * - Trigrams and planetary assignments
 * - Yin/Yang polarity and planets
 * - Centre electromagnetic signatures and planets
 * - Binary patterns and planets
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

const centres = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../knowledge-systems/centers/mappings/centers-mappings.json'), 'utf8')
);

// Build lookups
const emLookup = {};
electromagneticLines.mappings.forEach(line => {
  emLookup[`${line.gate}-${line.line}`] = line;
});

// Trigram data
const TRIGRAMS = {
  'Heaven': { position: -4, binary: '111', family: 'Father', axis: 'poles', element: 'Creative' },
  'Earth': { position: 4, binary: '000', family: 'Mother', axis: 'poles', element: 'Receptive' },
  'Thunder': { position: 1, binary: '100', family: 'Eldest Son', axis: 'gates', element: 'Arousing' },
  'Water': { position: 2, binary: '010', family: 'Middle Son', axis: 'flow', element: 'Abysmal' },
  'Mountain': { position: 3, binary: '001', family: 'Youngest Son', axis: 'storage', element: 'Keeping Still' },
  'Wind': { position: -1, binary: '011', family: 'Eldest Daughter', axis: 'gates', element: 'Gentle' },
  'Fire': { position: -2, binary: '101', family: 'Middle Daughter', axis: 'flow', element: 'Clinging' },
  'Lake': { position: -3, binary: '110', family: 'Youngest Daughter', axis: 'storage', element: 'Joyous' }
};

// Centre to gates mapping
const centreGates = {};
centres.mappings.forEach(c => {
  centreGates[c.centerName] = c.gates;
});

// Initialize analysis structures
const analysis = {
  // Planets by trigram (which trigram the line is IN)
  byTrigram: {},
  // Planets by trigram axis
  byAxis: {},
  // Planets by trigram family (Father/Mother/Sons/Daughters)
  byFamily: {},
  // Planets by yin/yang polarity
  byPolarity: { YANG: { exalt: {}, detri: {} }, YIN: { exalt: {}, detri: {} } },
  // Planets by centre
  byCentre: {},
  // Planets by binary bit patterns
  byBinaryBit: { bit0: {}, bit1: {}, bit2: {} },
  // Planets by whether line is yang (solid) or yin (broken) within the hexagram
  byLineBit: {},
  // Cross-analysis: trigram + line position
  byTrigramLine: {},
  // Trigram pairs (inner-outer combination)
  byTrigramPair: {}
};

// Initialize trigram counters
Object.keys(TRIGRAMS).forEach(trig => {
  analysis.byTrigram[trig] = { exalt: {}, detri: {} };
});

// Process each line
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
  const polarity = entry.knowledge.polarity;

  // Determine which trigram this line is IN (inner for 1-3, outer for 4-6)
  const trigram = line <= 3 ? emData.electromagnetic.innerTrigram : emData.electromagnetic.outerTrigram;
  const trigramName = trigram.name;
  const trigramData = TRIGRAMS[trigramName];

  // Also get the other trigram for pair analysis
  const otherTrigram = line <= 3 ? emData.electromagnetic.outerTrigram : emData.electromagnetic.innerTrigram;

  // By Trigram
  if (exaltPlanet !== 'None') {
    analysis.byTrigram[trigramName].exalt[exaltPlanet] = (analysis.byTrigram[trigramName].exalt[exaltPlanet] || 0) + 1;
  }
  if (detriPlanet !== 'None') {
    analysis.byTrigram[trigramName].detri[detriPlanet] = (analysis.byTrigram[trigramName].detri[detriPlanet] || 0) + 1;
  }

  // By Axis
  const axis = trigramData.axis;
  analysis.byAxis[axis] = analysis.byAxis[axis] || { exalt: {}, detri: {} };
  if (exaltPlanet !== 'None') {
    analysis.byAxis[axis].exalt[exaltPlanet] = (analysis.byAxis[axis].exalt[exaltPlanet] || 0) + 1;
  }
  if (detriPlanet !== 'None') {
    analysis.byAxis[axis].detri[detriPlanet] = (analysis.byAxis[axis].detri[detriPlanet] || 0) + 1;
  }

  // By Family
  const family = trigramData.family;
  analysis.byFamily[family] = analysis.byFamily[family] || { exalt: {}, detri: {} };
  if (exaltPlanet !== 'None') {
    analysis.byFamily[family].exalt[exaltPlanet] = (analysis.byFamily[family].exalt[exaltPlanet] || 0) + 1;
  }
  if (detriPlanet !== 'None') {
    analysis.byFamily[family].detri[detriPlanet] = (analysis.byFamily[family].detri[detriPlanet] || 0) + 1;
  }

  // By Polarity
  if (polarity && exaltPlanet !== 'None') {
    analysis.byPolarity[polarity].exalt[exaltPlanet] = (analysis.byPolarity[polarity].exalt[exaltPlanet] || 0) + 1;
  }
  if (polarity && detriPlanet !== 'None') {
    analysis.byPolarity[polarity].detri[detriPlanet] = (analysis.byPolarity[polarity].detri[detriPlanet] || 0) + 1;
  }

  // By Centre
  const centre = emData.context.centre;
  analysis.byCentre[centre] = analysis.byCentre[centre] || { exalt: {}, detri: {} };
  if (exaltPlanet !== 'None') {
    analysis.byCentre[centre].exalt[exaltPlanet] = (analysis.byCentre[centre].exalt[exaltPlanet] || 0) + 1;
  }
  if (detriPlanet !== 'None') {
    analysis.byCentre[centre].detri[detriPlanet] = (analysis.byCentre[centre].detri[detriPlanet] || 0) + 1;
  }

  // By Binary bits of the trigram
  const binary = trigram.binary;
  for (let bit = 0; bit < 3; bit++) {
    const bitValue = binary[2 - bit]; // Reverse because binary is written left-to-right but bits are numbered right-to-left
    const bitKey = `bit${bit}_${bitValue}`;
    analysis.byBinaryBit[`bit${bit}`][bitKey] = analysis.byBinaryBit[`bit${bit}`][bitKey] || { exalt: {}, detri: {} };
    if (exaltPlanet !== 'None') {
      analysis.byBinaryBit[`bit${bit}`][bitKey].exalt[exaltPlanet] = (analysis.byBinaryBit[`bit${bit}`][bitKey].exalt[exaltPlanet] || 0) + 1;
    }
    if (detriPlanet !== 'None') {
      analysis.byBinaryBit[`bit${bit}`][bitKey].detri[detriPlanet] = (analysis.byBinaryBit[`bit${bit}`][bitKey].detri[detriPlanet] || 0) + 1;
    }
  }

  // By the specific line's yin/yang bit within the hexagram
  // In I Ching, each line has its own yin (0) or yang (1) value
  // The hexagram binary can tell us this
  const hexBinary = emData.electromagnetic.innerTrigram.binary + emData.electromagnetic.outerTrigram.binary;
  const lineBit = hexBinary[line - 1]; // 0-indexed
  const lineBitKey = lineBit === '1' ? 'yang_line' : 'yin_line';
  analysis.byLineBit[lineBitKey] = analysis.byLineBit[lineBitKey] || { exalt: {}, detri: {} };
  if (exaltPlanet !== 'None') {
    analysis.byLineBit[lineBitKey].exalt[exaltPlanet] = (analysis.byLineBit[lineBitKey].exalt[exaltPlanet] || 0) + 1;
  }
  if (detriPlanet !== 'None') {
    analysis.byLineBit[lineBitKey].detri[detriPlanet] = (analysis.byLineBit[lineBitKey].detri[detriPlanet] || 0) + 1;
  }

  // Trigram + Line position (e.g., "Heaven-L1" means line 1 or 4 in a Heaven trigram)
  const lineInTrigram = ((line - 1) % 3) + 1; // 1, 2, or 3
  const trigramLineKey = `${trigramName}-L${lineInTrigram}`;
  analysis.byTrigramLine[trigramLineKey] = analysis.byTrigramLine[trigramLineKey] || { exalt: {}, detri: {} };
  if (exaltPlanet !== 'None') {
    analysis.byTrigramLine[trigramLineKey].exalt[exaltPlanet] = (analysis.byTrigramLine[trigramLineKey].exalt[exaltPlanet] || 0) + 1;
  }
  if (detriPlanet !== 'None') {
    analysis.byTrigramLine[trigramLineKey].detri[detriPlanet] = (analysis.byTrigramLine[trigramLineKey].detri[detriPlanet] || 0) + 1;
  }

  // Trigram pairs
  const innerName = emData.electromagnetic.innerTrigram.name;
  const outerName = emData.electromagnetic.outerTrigram.name;
  const pairKey = `${innerName}→${outerName}`;
  analysis.byTrigramPair[pairKey] = analysis.byTrigramPair[pairKey] || { exalt: {}, detri: {} };
  if (exaltPlanet !== 'None') {
    analysis.byTrigramPair[pairKey].exalt[exaltPlanet] = (analysis.byTrigramPair[pairKey].exalt[exaltPlanet] || 0) + 1;
  }
  if (detriPlanet !== 'None') {
    analysis.byTrigramPair[pairKey].detri[detriPlanet] = (analysis.byTrigramPair[pairKey].detri[detriPlanet] || 0) + 1;
  }
});

// Output
console.log('='.repeat(80));
console.log('DEEP TRIGRAM-PLANET-CENTRE ANALYSIS');
console.log('='.repeat(80));

// 1. Planets by Trigram
console.log('\n## 1. PLANETS BY TRIGRAM (which trigram the line is IN)\n');
Object.entries(analysis.byTrigram).forEach(([trig, data]) => {
  const trigData = TRIGRAMS[trig];
  console.log(`\n### ${trig} (${trigData.position}, ${trigData.axis}, ${trigData.family})`);

  const sortedExalt = Object.entries(data.exalt).sort((a, b) => b[1] - a[1]);
  const sortedDetri = Object.entries(data.detri).sort((a, b) => b[1] - a[1]);

  console.log('  Exaltations:', sortedExalt.slice(0, 4).map(([p, c]) => `${p}(${c})`).join(', '));
  console.log('  Detriments:', sortedDetri.slice(0, 4).map(([p, c]) => `${p}(${c})`).join(', '));
});

// 2. Planets by Family
console.log('\n## 2. PLANETS BY TRIGRAM FAMILY\n');
const familyOrder = ['Father', 'Mother', 'Eldest Son', 'Middle Son', 'Youngest Son', 'Eldest Daughter', 'Middle Daughter', 'Youngest Daughter'];
familyOrder.forEach(family => {
  if (!analysis.byFamily[family]) return;
  const data = analysis.byFamily[family];
  console.log(`\n### ${family}`);

  const sortedExalt = Object.entries(data.exalt).sort((a, b) => b[1] - a[1]);
  const sortedDetri = Object.entries(data.detri).sort((a, b) => b[1] - a[1]);

  console.log('  Exaltations:', sortedExalt.slice(0, 5).map(([p, c]) => `${p}(${c})`).join(', '));
  console.log('  Detriments:', sortedDetri.slice(0, 5).map(([p, c]) => `${p}(${c})`).join(', '));
});

// 3. Planets by Axis
console.log('\n## 3. PLANETS BY AXIS\n');
['poles', 'storage', 'flow', 'gates'].forEach(axis => {
  const data = analysis.byAxis[axis];
  if (!data) return;

  console.log(`\n### ${axis.toUpperCase()} Axis`);
  const sortedExalt = Object.entries(data.exalt).sort((a, b) => b[1] - a[1]);
  const sortedDetri = Object.entries(data.detri).sort((a, b) => b[1] - a[1]);

  console.log('  Exaltations:', sortedExalt.slice(0, 5).map(([p, c]) => `${p}(${c})`).join(', '));
  console.log('  Detriments:', sortedDetri.slice(0, 5).map(([p, c]) => `${p}(${c})`).join(', '));
});

// 4. Planets by Centre
console.log('\n## 4. PLANETS BY CENTRE\n');
Object.entries(analysis.byCentre).forEach(([centre, data]) => {
  console.log(`\n### ${centre}`);

  const sortedExalt = Object.entries(data.exalt).sort((a, b) => b[1] - a[1]);
  const sortedDetri = Object.entries(data.detri).sort((a, b) => b[1] - a[1]);

  // Calculate ratios for interesting planets
  const ratios = {};
  [...Object.keys(data.exalt), ...Object.keys(data.detri)].forEach(planet => {
    const ex = data.exalt[planet] || 0;
    const det = data.detri[planet] || 0;
    if (ex + det >= 3) {
      ratios[planet] = { ex, det, ratio: det > 0 ? (ex / det).toFixed(2) : 'INF' };
    }
  });

  console.log('  Exaltations:', sortedExalt.slice(0, 4).map(([p, c]) => `${p}(${c})`).join(', '));
  console.log('  Detriments:', sortedDetri.slice(0, 4).map(([p, c]) => `${p}(${c})`).join(', '));

  // Show strongly biased planets for this centre
  const biased = Object.entries(ratios)
    .filter(([p, r]) => parseFloat(r.ratio) >= 2 || parseFloat(r.ratio) <= 0.5)
    .map(([p, r]) => `${p}(${r.ex}/${r.det}=${r.ratio})`);
  if (biased.length > 0) {
    console.log('  Strong bias:', biased.join(', '));
  }
});

// 5. Planets by Line Bit (yin vs yang LINE)
console.log('\n## 5. PLANETS BY LINE TYPE (Yin vs Yang LINE in hexagram)\n');
Object.entries(analysis.byLineBit).forEach(([lineType, data]) => {
  console.log(`\n### ${lineType}`);

  const sortedExalt = Object.entries(data.exalt).sort((a, b) => b[1] - a[1]);
  const sortedDetri = Object.entries(data.detri).sort((a, b) => b[1] - a[1]);

  console.log('  Exaltations:', sortedExalt.slice(0, 6).map(([p, c]) => `${p}(${c})`).join(', '));
  console.log('  Detriments:', sortedDetri.slice(0, 6).map(([p, c]) => `${p}(${c})`).join(', '));
});

// 6. Binary bit patterns
console.log('\n## 6. PLANETS BY BINARY BIT PATTERNS\n');
console.log('(Bit 0 = bottom line of trigram, Bit 2 = top line)');

Object.entries(analysis.byBinaryBit).forEach(([bit, values]) => {
  console.log(`\n### ${bit}`);
  Object.entries(values).forEach(([bitKey, data]) => {
    const bitValue = bitKey.split('_')[1];
    const sortedExalt = Object.entries(data.exalt).sort((a, b) => b[1] - a[1]);
    console.log(`  ${bitValue === '1' ? 'YANG' : 'YIN'}: ${sortedExalt.slice(0, 4).map(([p, c]) => `${p}(${c})`).join(', ')}`);
  });
});

// 7. Trigram + Line combinations (look for strongest patterns)
console.log('\n## 7. STRONGEST TRIGRAM + LINE PATTERNS\n');

const strongPatterns = [];
Object.entries(analysis.byTrigramLine).forEach(([key, data]) => {
  const sortedExalt = Object.entries(data.exalt).sort((a, b) => b[1] - a[1]);
  const sortedDetri = Object.entries(data.detri).sort((a, b) => b[1] - a[1]);

  if (sortedExalt[0] && sortedExalt[0][1] >= 4) {
    strongPatterns.push({ key, type: 'exalt', planet: sortedExalt[0][0], count: sortedExalt[0][1] });
  }
  if (sortedDetri[0] && sortedDetri[0][1] >= 5) {
    strongPatterns.push({ key, type: 'detri', planet: sortedDetri[0][0], count: sortedDetri[0][1] });
  }
});

strongPatterns.sort((a, b) => b.count - a.count);
strongPatterns.forEach(p => {
  console.log(`  ${p.key}: ${p.planet} ${p.type === 'exalt' ? 'EXALTED' : 'DETRIMENT'} ${p.count}x`);
});

// 8. Trigram pairs with strong biases
console.log('\n## 8. TRIGRAM PAIRS WITH STRONG PLANETARY BIAS\n');

Object.entries(analysis.byTrigramPair).forEach(([pair, data]) => {
  const totalEx = Object.values(data.exalt).reduce((a, b) => a + b, 0);
  const totalDet = Object.values(data.detri).reduce((a, b) => a + b, 0);

  // Only show pairs with enough data
  if (totalEx < 4) return;

  // Find strongly biased planets
  const allPlanets = new Set([...Object.keys(data.exalt), ...Object.keys(data.detri)]);
  const biased = [];

  allPlanets.forEach(planet => {
    const ex = data.exalt[planet] || 0;
    const det = data.detri[planet] || 0;
    if (ex + det >= 2) {
      if (ex >= 3 && det === 0) biased.push(`${planet} ALWAYS exalted (${ex})`);
      else if (det >= 3 && ex === 0) biased.push(`${planet} ALWAYS detriment (${det})`);
      else if (ex >= 2 && det >= 2 && ex / det >= 3) biased.push(`${planet} strongly exalted (${ex}/${det})`);
      else if (ex >= 2 && det >= 2 && det / ex >= 3) biased.push(`${planet} strongly detriment (${ex}/${det})`);
    }
  });

  if (biased.length > 0) {
    console.log(`\n### ${pair}`);
    biased.forEach(b => console.log(`  ${b}`));
  }
});

// 9. Save detailed data
fs.writeFileSync(
  path.join(__dirname, '../docs/research/planetary-trigram-analysis-data.json'),
  JSON.stringify(analysis, null, 2)
);

console.log('\n\nDetailed data saved to docs/research/planetary-trigram-analysis-data.json');
