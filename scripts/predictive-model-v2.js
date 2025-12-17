/**
 * Predictive Model v2: Position-Specific Learning
 *
 * Insight: Generic rules failed. Let's see if specific (position + line)
 * combinations have deterministic planet assignments.
 *
 * Approach: For each (innerPos, line) pair, find the most common exalting planet.
 * If positions are electromagnetically deterministic, this should reveal it.
 */

const tradGates = require('../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const emLines = require('../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

// Build lookups
const emLookup = {};
emLines.mappings.forEach(l => {
  emLookup[l.gate + '.' + l.line] = l.electromagnetic;
});

// Collect all data
const data = [];
tradGates.mappings.filter(m => m.lineNumber).forEach(entry => {
  const key = entry.gateNumber + '.' + entry.lineNumber;
  const em = emLookup[key];
  if (!em) return;

  const exaltPlanets = (entry.knowledge?.blackBook?.exaltation?.planets || []).map(p => p.planet);
  if (exaltPlanets.length === 0) return;

  data.push({
    key,
    innerPos: em.innerTrigram?.position,
    line: entry.lineNumber,
    gateType: em.gateType,
    amplitude: Math.abs(em.outerTrigram?.position - em.innerTrigram?.position),
    actualPlanet: exaltPlanets[0],
    allPlanets: exaltPlanets
  });
});

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('PREDICTIVE MODEL v2: Position-Specific Analysis');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: Analyze (position, line) distributions
// ═══════════════════════════════════════════════════════════════════════════

console.log('PART 1: Planet Distribution by (Position, Line)');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const posLineDist = {};
data.forEach(d => {
  const key = `pos${d.innerPos}_line${d.line}`;
  if (!posLineDist[key]) posLineDist[key] = {};
  posLineDist[key][d.actualPlanet] = (posLineDist[key][d.actualPlanet] || 0) + 1;
});

// For each (pos, line), find the mode and its frequency
const posLineMode = {};
console.log('(Position, Line) → Most Common Planet → Frequency');
console.log('─'.repeat(70));

const positions = [-4, -3, -2, -1, 1, 2, 3, 4];
const lines = [1, 2, 3, 4, 5, 6];

positions.forEach(pos => {
  lines.forEach(line => {
    const key = `pos${pos}_line${line}`;
    const dist = posLineDist[key];
    if (!dist) return;

    const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((sum, [_, c]) => sum + c, 0);
    const mode = sorted[0][0];
    const modeCount = sorted[0][1];
    const modeFreq = (modeCount / total * 100).toFixed(0);

    posLineMode[key] = { mode, modeCount, total, freq: modeFreq };

    // Show high-frequency patterns
    if (parseInt(modeFreq) >= 30) {
      const distStr = sorted.slice(0, 3).map(([p, c]) => `${p}:${c}`).join(', ');
      console.log(`pos ${pos.toString().padStart(2)}, line ${line} → ${mode.padEnd(8)} (${modeFreq}% of ${total}) [${distStr}]`);
    }
  });
});

console.log('\n(Showing only positions where mode ≥ 30%)');

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: Test prediction using mode
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 2: Prediction Using Position-Line Mode');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

let correct = 0;
let total = 0;

data.forEach(d => {
  const key = `pos${d.innerPos}_line${d.line}`;
  const modeData = posLineMode[key];
  if (!modeData) return;

  total++;
  if (d.allPlanets.includes(modeData.mode)) {
    correct++;
  }
});

console.log(`Mode-based prediction: ${correct}/${total} = ${(correct/total*100).toFixed(1)}%`);
console.log('\nThis tells us: how often does the most common planet at a position actually occur?');
console.log('If this is high, positions are deterministic. If low, they are noisy.\n');

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: Deeper analysis - what makes a position deterministic?
// ═══════════════════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('PART 3: Determinism Analysis');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Calculate entropy for each (pos, line) - low entropy = more deterministic
function entropy(dist) {
  const total = Object.values(dist).reduce((a, b) => a + b, 0);
  let ent = 0;
  Object.values(dist).forEach(count => {
    const p = count / total;
    if (p > 0) ent -= p * Math.log2(p);
  });
  return ent;
}

const entropyByPosLine = [];
Object.entries(posLineDist).forEach(([key, dist]) => {
  const ent = entropy(dist);
  const total = Object.values(dist).reduce((a, b) => a + b, 0);
  const mode = Object.entries(dist).sort((a, b) => b[1] - a[1])[0];
  entropyByPosLine.push({
    key,
    entropy: ent,
    total,
    mode: mode[0],
    modeFreq: (mode[1] / total * 100).toFixed(0)
  });
});

// Sort by entropy (low = deterministic)
entropyByPosLine.sort((a, b) => a.entropy - b.entropy);

console.log('Most Deterministic (position, line) pairs (lowest entropy):');
console.log('─'.repeat(70));
entropyByPosLine.slice(0, 15).forEach(e => {
  console.log(`${e.key.padEnd(15)} entropy=${e.entropy.toFixed(2)} mode=${e.mode.padEnd(8)} (${e.modeFreq}% of ${e.total})`);
});

console.log('\nLeast Deterministic (highest entropy):');
console.log('─'.repeat(70));
entropyByPosLine.slice(-10).forEach(e => {
  console.log(`${e.key.padEnd(15)} entropy=${e.entropy.toFixed(2)} mode=${e.mode.padEnd(8)} (${e.modeFreq}% of ${e.total})`);
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: Try adding gate type to the prediction
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 4: Adding Gate Type to Prediction');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Build (pos, line, gateType) distribution
const fullDist = {};
data.forEach(d => {
  const key = `${d.innerPos}_${d.line}_${d.gateType}`;
  if (!fullDist[key]) fullDist[key] = {};
  fullDist[key][d.actualPlanet] = (fullDist[key][d.actualPlanet] || 0) + 1;
});

// Find mode for each combination
const fullMode = {};
Object.entries(fullDist).forEach(([key, dist]) => {
  const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((sum, [_, c]) => sum + c, 0);
  fullMode[key] = {
    mode: sorted[0][0],
    freq: sorted[0][1] / total
  };
});

// Test accuracy
let correctFull = 0;
let totalFull = 0;

data.forEach(d => {
  const key = `${d.innerPos}_${d.line}_${d.gateType}`;
  const modeData = fullMode[key];
  if (!modeData) return;

  totalFull++;
  if (d.allPlanets.includes(modeData.mode)) {
    correctFull++;
  }
});

console.log(`(pos, line, gateType) mode prediction: ${correctFull}/${totalFull} = ${(correctFull/totalFull*100).toFixed(1)}%`);

// ═══════════════════════════════════════════════════════════════════════════
// PART 5: What if we simplify to planet CLASSES?
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 5: Planet Class Prediction (Simplified Target)');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const PLANET_CLASS = {
  'Sun': 'luminary',
  'Moon': 'luminary',
  'Mercury': 'personal',
  'Venus': 'personal',
  'Mars': 'personal',
  'Jupiter': 'social',
  'Saturn': 'social',
  'Uranus': 'transpersonal',
  'Neptune': 'transpersonal',
  'Pluto': 'transpersonal',
  'Earth': 'earth'
};

// Build class distribution by (pos, line)
const classDist = {};
data.forEach(d => {
  const key = `pos${d.innerPos}_line${d.line}`;
  const cls = PLANET_CLASS[d.actualPlanet];
  if (!classDist[key]) classDist[key] = {};
  classDist[key][cls] = (classDist[key][cls] || 0) + 1;
});

// Find mode class for each (pos, line)
const classMode = {};
Object.entries(classDist).forEach(([key, dist]) => {
  const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((sum, [_, c]) => sum + c, 0);
  classMode[key] = {
    mode: sorted[0][0],
    freq: (sorted[0][1] / total * 100).toFixed(0)
  };
});

// Test class prediction
let correctClass = 0;
let totalClass = 0;

data.forEach(d => {
  const key = `pos${d.innerPos}_line${d.line}`;
  const modeData = classMode[key];
  if (!modeData) return;

  totalClass++;
  const actualClass = PLANET_CLASS[d.actualPlanet];
  if (actualClass === modeData.mode) {
    correctClass++;
  }
});

console.log(`Planet CLASS prediction: ${correctClass}/${totalClass} = ${(correctClass/totalClass*100).toFixed(1)}%`);
console.log('(Classes: luminary, personal, social, transpersonal, earth)');

// ═══════════════════════════════════════════════════════════════════════════
// PART 6: Summary
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('SUMMARY: What We Learned');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('Prediction Accuracy:');
console.log(`  (pos, line) mode:           ${(correct/total*100).toFixed(1)}%`);
console.log(`  (pos, line, gateType) mode: ${(correctFull/totalFull*100).toFixed(1)}%`);
console.log(`  Planet CLASS mode:          ${(correctClass/totalClass*100).toFixed(1)}%`);
console.log();
console.log('Interpretation:');
console.log('  If accuracy is ~1/11 (9%): positions are random');
console.log('  If accuracy is ~30-40%:   weak position-planet correlation');
console.log('  If accuracy is ~70%+:     strong electromagnetic determinism');
