/**
 * Exploratory Analysis: What ARE planets electromagnetically?
 *
 * Goal: Derive electromagnetic definitions for planets by analyzing
 * WHERE they succeed (exalt) vs fail (detri) in the system.
 */

const tradGates = require('../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const emLines = require('../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

console.log('=== PLANETARY ELECTROMAGNETIC SIGNATURE ANALYSIS ===\n');
console.log('Goal: Discover what electromagnetic properties each planet encodes\n');

// Build lookup for electromagnetic data
const emLookup = {};
emLines.mappings.forEach(l => {
  emLookup[l.gate + '.' + l.line] = l.electromagnetic;
});

// For each planet, collect WHERE it succeeds (exalts) and fails (detriments)
const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];

const planetData = {};
planets.forEach(p => {
  planetData[p] = {
    exalt: [], // Array of line data where planet exalts
    detri: []  // Array of line data where planet detriments
  };
});

// Collect comprehensive data for each planetary appearance
tradGates.mappings.filter(m => m.lineNumber).forEach(entry => {
  const key = entry.gateNumber + '.' + entry.lineNumber;
  const em = emLookup[key];
  if (!em) return;

  const lineData = {
    gate: entry.gateNumber,
    line: entry.lineNumber,
    polarity: entry.knowledge?.polarity,
    innerPos: em.innerTrigram?.position,
    outerPos: em.outerTrigram?.position,
    innerTrigram: em.innerTrigram?.name,
    outerTrigram: em.outerTrigram?.name,
    gateType: em.gateType,
    amplitude: Math.abs(em.outerTrigram?.position - em.innerTrigram?.position),
    direction: em.outerTrigram?.position > em.innerTrigram?.position ? 'ascending' :
               em.outerTrigram?.position < em.innerTrigram?.position ? 'descending' : 'static',
    crossesZero: (em.innerTrigram?.position < 0 && em.outerTrigram?.position > 0) ||
                 (em.innerTrigram?.position > 0 && em.outerTrigram?.position < 0),
    domain: em.innerTrigram?.position < 0 ? 'void' : 'material'
  };

  const exaltPlanets = entry.knowledge?.blackBook?.exaltation?.planets || [];
  const detriPlanets = entry.knowledge?.blackBook?.detriment?.planets || [];

  exaltPlanets.forEach(p => {
    if (planetData[p.planet]) {
      planetData[p.planet].exalt.push(lineData);
    }
  });

  detriPlanets.forEach(p => {
    if (planetData[p.planet]) {
      planetData[p.planet].detri.push(lineData);
    }
  });
});

// Helper function to count occurrences
function countBy(arr, key) {
  const counts = {};
  arr.forEach(item => {
    const val = item[key];
    counts[val] = (counts[val] || 0) + 1;
  });
  return counts;
}

// Helper to calculate success rate
function successRate(exaltCount, detriCount) {
  const total = exaltCount + detriCount;
  if (total === 0) return null;
  return exaltCount / total;
}

console.log('═══════════════════════════════════════════════════════════════════');
console.log('PART 1: POSITION ANALYSIS - Where does each planet thrive/fail?');
console.log('═══════════════════════════════════════════════════════════════════\n');

planets.forEach(planet => {
  const data = planetData[planet];
  const exaltPos = countBy(data.exalt, 'innerPos');
  const detriPos = countBy(data.detri, 'innerPos');

  console.log(`${planet.toUpperCase()} (${data.exalt.length} exalt, ${data.detri.length} detri)`);

  // Calculate success rate at each position
  const positions = [-4, -3, -2, -1, 1, 2, 3, 4];
  const posAnalysis = positions.map(pos => {
    const e = exaltPos[pos] || 0;
    const d = detriPos[pos] || 0;
    const rate = successRate(e, d);
    return { pos, exalt: e, detri: d, rate, total: e + d };
  }).filter(p => p.total >= 2); // Need at least 2 appearances

  // Best and worst positions
  const best = posAnalysis.filter(p => p.rate > 0.6).sort((a,b) => b.rate - a.rate);
  const worst = posAnalysis.filter(p => p.rate < 0.4).sort((a,b) => a.rate - b.rate);

  if (best.length > 0) {
    console.log(`  THRIVES at: ${best.map(p => `pos ${p.pos} (${(p.rate*100).toFixed(0)}% of ${p.total})`).join(', ')}`);
  }
  if (worst.length > 0) {
    console.log(`  FAILS at:   ${worst.map(p => `pos ${p.pos} (${((1-p.rate)*100).toFixed(0)}% fail of ${p.total})`).join(', ')}`);
  }
  console.log();
});

console.log('═══════════════════════════════════════════════════════════════════');
console.log('PART 2: DOMAIN ANALYSIS - Void (-) vs Material (+) preference');
console.log('═══════════════════════════════════════════════════════════════════\n');

planets.forEach(planet => {
  const data = planetData[planet];
  const exaltDomain = countBy(data.exalt, 'domain');
  const detriDomain = countBy(data.detri, 'domain');

  const voidExalt = exaltDomain['void'] || 0;
  const voidDetri = detriDomain['void'] || 0;
  const matExalt = exaltDomain['material'] || 0;
  const matDetri = detriDomain['material'] || 0;

  const voidRate = successRate(voidExalt, voidDetri);
  const matRate = successRate(matExalt, matDetri);

  let preference = 'BALANCED';
  if (voidRate !== null && matRate !== null) {
    if (voidRate > matRate + 0.15) preference = 'VOID-PREFERRING';
    else if (matRate > voidRate + 0.15) preference = 'MATERIAL-PREFERRING';
  }

  console.log(`${planet.padEnd(10)} | Void: ${voidExalt}/${voidExalt+voidDetri} (${voidRate ? (voidRate*100).toFixed(0) : '-'}%) | Material: ${matExalt}/${matExalt+matDetri} (${matRate ? (matRate*100).toFixed(0) : '-'}%) | ${preference}`);
});

console.log('\n═══════════════════════════════════════════════════════════════════');
console.log('PART 3: GATE TYPE ANALYSIS - Static vs Dynamic preference');
console.log('═══════════════════════════════════════════════════════════════════\n');

planets.forEach(planet => {
  const data = planetData[planet];
  const exaltType = countBy(data.exalt, 'gateType');
  const detriType = countBy(data.detri, 'gateType');

  const types = ['doubled', 'same-phase-material', 'same-phase-void', 'cross-zero-manifesting', 'cross-zero-dematerialising'];

  const typeAnalysis = types.map(type => {
    const e = exaltType[type] || 0;
    const d = detriType[type] || 0;
    const rate = successRate(e, d);
    return { type: type.replace('cross-zero-', 'xz-').replace('same-phase-', 'sp-'), exalt: e, detri: d, rate, total: e + d };
  }).filter(t => t.total >= 3);

  const best = typeAnalysis.filter(t => t.rate > 0.55).sort((a,b) => b.rate - a.rate);
  const worst = typeAnalysis.filter(t => t.rate < 0.45).sort((a,b) => a.rate - b.rate);

  console.log(`${planet.toUpperCase()}`);
  if (best.length > 0) {
    console.log(`  Best:  ${best.map(t => `${t.type} (${(t.rate*100).toFixed(0)}%)`).join(', ')}`);
  }
  if (worst.length > 0) {
    console.log(`  Worst: ${worst.map(t => `${t.type} (${((1-t.rate)*100).toFixed(0)}% fail)`).join(', ')}`);
  }
  if (best.length === 0 && worst.length === 0) {
    console.log('  No strong gate type preference');
  }
  console.log();
});

console.log('═══════════════════════════════════════════════════════════════════');
console.log('PART 4: POLARITY ANALYSIS - YIN vs YANG line preference');
console.log('═══════════════════════════════════════════════════════════════════\n');

planets.forEach(planet => {
  const data = planetData[planet];
  const exaltPol = countBy(data.exalt, 'polarity');
  const detriPol = countBy(data.detri, 'polarity');

  const yinExalt = exaltPol['YIN'] || 0;
  const yinDetri = detriPol['YIN'] || 0;
  const yangExalt = exaltPol['YANG'] || 0;
  const yangDetri = detriPol['YANG'] || 0;

  const yinRate = successRate(yinExalt, yinDetri);
  const yangRate = successRate(yangExalt, yangDetri);

  let preference = 'BALANCED';
  if (yinRate !== null && yangRate !== null) {
    if (yinRate > yangRate + 0.15) preference = 'YIN-PREFERRING';
    else if (yangRate > yinRate + 0.15) preference = 'YANG-PREFERRING';
  }

  console.log(`${planet.padEnd(10)} | YIN: ${yinExalt}/${yinExalt+yinDetri} (${yinRate ? (yinRate*100).toFixed(0) : '-'}%) | YANG: ${yangExalt}/${yangExalt+yangDetri} (${yangRate ? (yangRate*100).toFixed(0) : '-'}%) | ${preference}`);
});

console.log('\n═══════════════════════════════════════════════════════════════════');
console.log('PART 5: AMPLITUDE ANALYSIS - Wave amplitude preference');
console.log('═══════════════════════════════════════════════════════════════════\n');

planets.forEach(planet => {
  const data = planetData[planet];

  // Calculate average amplitude where planet exalts vs detriments
  const exaltAmps = data.exalt.map(d => d.amplitude);
  const detriAmps = data.detri.map(d => d.amplitude);

  const avgExaltAmp = exaltAmps.length > 0 ? exaltAmps.reduce((a,b) => a+b, 0) / exaltAmps.length : null;
  const avgDetriAmp = detriAmps.length > 0 ? detriAmps.reduce((a,b) => a+b, 0) / detriAmps.length : null;

  let preference = '';
  if (avgExaltAmp !== null && avgDetriAmp !== null) {
    if (avgExaltAmp < avgDetriAmp - 0.3) preference = '→ prefers LOW amplitude (stable)';
    else if (avgExaltAmp > avgDetriAmp + 0.3) preference = '→ prefers HIGH amplitude (dynamic)';
    else preference = '→ no amplitude preference';
  }

  console.log(`${planet.padEnd(10)} | Avg amp when exalt: ${avgExaltAmp?.toFixed(2) || '-'} | Avg amp when detri: ${avgDetriAmp?.toFixed(2) || '-'} ${preference}`);
});

console.log('\n═══════════════════════════════════════════════════════════════════');
console.log('PART 6: DIRECTION ANALYSIS - Ascending vs Descending preference');
console.log('═══════════════════════════════════════════════════════════════════\n');

planets.forEach(planet => {
  const data = planetData[planet];
  const exaltDir = countBy(data.exalt, 'direction');
  const detriDir = countBy(data.detri, 'direction');

  const ascExalt = exaltDir['ascending'] || 0;
  const ascDetri = detriDir['ascending'] || 0;
  const descExalt = exaltDir['descending'] || 0;
  const descDetri = detriDir['descending'] || 0;
  const staticExalt = exaltDir['static'] || 0;
  const staticDetri = detriDir['static'] || 0;

  const ascRate = successRate(ascExalt, ascDetri);
  const descRate = successRate(descExalt, descDetri);
  const staticRate = successRate(staticExalt, staticDetri);

  let preference = 'BALANCED';
  if (ascRate !== null && descRate !== null) {
    if (ascRate > descRate + 0.15) preference = 'ASCENDING (manifesting)';
    else if (descRate > ascRate + 0.15) preference = 'DESCENDING (dematerialising)';
  }

  console.log(`${planet.padEnd(10)} | Asc: ${ascRate ? (ascRate*100).toFixed(0) : '-'}% | Desc: ${descRate ? (descRate*100).toFixed(0) : '-'}% | Static: ${staticRate ? (staticRate*100).toFixed(0) : '-'}% | ${preference}`);
});

console.log('\n═══════════════════════════════════════════════════════════════════');
console.log('PART 7: TRIGRAM ANALYSIS - Inner trigram affinity');
console.log('═══════════════════════════════════════════════════════════════════\n');

const trigrams = ['Heaven', 'Earth', 'Thunder', 'Water', 'Mountain', 'Lake', 'Fire', 'Wind'];

planets.forEach(planet => {
  const data = planetData[planet];
  const exaltTri = countBy(data.exalt, 'innerTrigram');
  const detriTri = countBy(data.detri, 'innerTrigram');

  const triAnalysis = trigrams.map(tri => {
    const e = exaltTri[tri] || 0;
    const d = detriTri[tri] || 0;
    const rate = successRate(e, d);
    return { tri, exalt: e, detri: d, rate, total: e + d };
  }).filter(t => t.total >= 3);

  const best = triAnalysis.filter(t => t.rate > 0.6).sort((a,b) => b.rate - a.rate);
  const worst = triAnalysis.filter(t => t.rate < 0.4).sort((a,b) => a.rate - b.rate);

  if (best.length > 0 || worst.length > 0) {
    console.log(`${planet.toUpperCase()}`);
    if (best.length > 0) {
      console.log(`  Affinity:  ${best.map(t => `${t.tri} (${(t.rate*100).toFixed(0)}%)`).join(', ')}`);
    }
    if (worst.length > 0) {
      console.log(`  Aversion:  ${worst.map(t => `${t.tri} (${((1-t.rate)*100).toFixed(0)}% fail)`).join(', ')}`);
    }
    console.log();
  }
});

console.log('\n═══════════════════════════════════════════════════════════════════');
console.log('SYNTHESIS: Proposed Electromagnetic Definitions');
console.log('═══════════════════════════════════════════════════════════════════\n');

// Compile synthesis based on all analyses
planets.forEach(planet => {
  const data = planetData[planet];
  const ratio = data.exalt.length / (data.exalt.length + data.detri.length);

  // Gather characteristics
  const chars = [];

  // Domain preference
  const exaltDomain = countBy(data.exalt, 'domain');
  const detriDomain = countBy(data.detri, 'domain');
  const voidRate = successRate(exaltDomain['void'] || 0, detriDomain['void'] || 0);
  const matRate = successRate(exaltDomain['material'] || 0, detriDomain['material'] || 0);
  if (voidRate && matRate && Math.abs(voidRate - matRate) > 0.15) {
    chars.push(voidRate > matRate ? 'void-resonant' : 'material-resonant');
  }

  // Direction preference
  const exaltDir = countBy(data.exalt, 'direction');
  const detriDir = countBy(data.detri, 'direction');
  const ascRate = successRate(exaltDir['ascending'] || 0, detriDir['ascending'] || 0);
  const descRate = successRate(exaltDir['descending'] || 0, detriDir['descending'] || 0);
  if (ascRate && descRate && Math.abs(ascRate - descRate) > 0.15) {
    chars.push(ascRate > descRate ? 'manifesting' : 'dematerialising');
  }

  // Polarity preference
  const exaltPol = countBy(data.exalt, 'polarity');
  const detriPol = countBy(data.detri, 'polarity');
  const yinRate = successRate(exaltPol['YIN'] || 0, detriPol['YIN'] || 0);
  const yangRate = successRate(exaltPol['YANG'] || 0, detriPol['YANG'] || 0);
  if (yinRate && yangRate && Math.abs(yinRate - yangRate) > 0.15) {
    chars.push(yinRate > yangRate ? 'yin-aligned' : 'yang-aligned');
  }

  // Amplitude preference
  const exaltAmps = data.exalt.map(d => d.amplitude);
  const detriAmps = data.detri.map(d => d.amplitude);
  const avgExaltAmp = exaltAmps.length > 0 ? exaltAmps.reduce((a,b) => a+b, 0) / exaltAmps.length : null;
  const avgDetriAmp = detriAmps.length > 0 ? detriAmps.reduce((a,b) => a+b, 0) / detriAmps.length : null;
  if (avgExaltAmp !== null && avgDetriAmp !== null && Math.abs(avgExaltAmp - avgDetriAmp) > 0.3) {
    chars.push(avgExaltAmp < avgDetriAmp ? 'low-amplitude' : 'high-amplitude');
  }

  // Overall tendency
  const tendency = ratio > 0.55 ? 'enhancing' : ratio < 0.45 ? 'corrupting' : 'neutral';

  console.log(`${planet.toUpperCase()}: ${tendency} | ${chars.join(', ') || 'no strong electromagnetic signature detected'}`);
});
