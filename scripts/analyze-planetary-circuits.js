#!/usr/bin/env node

/**
 * Planetary Circuit Analysis
 *
 * Investigating:
 * - Inner vs outer planets across circuits
 * - Planetary affinities by circuit architecture
 * - Channel pairing type correlations
 * - Orbital/astronomical correlations
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

const channels = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../knowledge-systems/channels/mappings/channels-mappings.json'), 'utf8')
);

// Build lookups
const emLookup = {};
electromagneticLines.mappings.forEach(line => {
  emLookup[`${line.gate}-${line.line}`] = line;
});

// Planet classifications
const PLANET_CLASSES = {
  // Luminaries (lights)
  luminaries: ['Sun', 'Moon'],
  // Personal/Inner planets (fast moving, personal)
  personal: ['Mercury', 'Venus', 'Mars'],
  // Social planets (bridge between personal and transpersonal)
  social: ['Jupiter', 'Saturn'],
  // Transpersonal/Outer planets (slow moving, collective)
  transpersonal: ['Uranus', 'Neptune', 'Pluto'],
  // Earth as special case
  earth: ['Earth']
};

// Orbital periods (in Earth years) - for resonance analysis
const ORBITAL_PERIODS = {
  'Moon': 0.0748, // ~27 days
  'Mercury': 0.24,
  'Venus': 0.62,
  'Sun': 1, // Earth's orbit
  'Earth': 1,
  'Mars': 1.88,
  'Jupiter': 11.86,
  'Saturn': 29.46,
  'Uranus': 84.01,
  'Neptune': 164.8,
  'Pluto': 248.09
};

// Circuit architectures
const CIRCUIT_ARCHITECTURES = {
  'Knowing': 'double-circulator',
  'Knowing Circuit': 'double-circulator',
  'Understanding': 'dual-reservoir',
  'Understanding Circuit': 'dual-reservoir',
  'Sensing': 'oscillator',
  'Sensing Circuit': 'oscillator',
  'Integration': 'commutator',
  'Integration Circuit': 'commutator',
  'Centering': 'regulated',
  'Centering Circuit': 'regulated',
  'Defense': 'zero-anchor',
  'Defense Circuit': 'zero-anchor',
  'Ego': 'zero-anchor',
  'Ego Circuit': 'zero-anchor'
};

// Analysis structures
const analysis = {
  byCircuit: {},
  byCircuitArchitecture: {},
  byChannelPairingType: {},
  byPlanetClass: {
    luminaries: { exalt: 0, detri: 0, byCircuit: {} },
    personal: { exalt: 0, detri: 0, byCircuit: {} },
    social: { exalt: 0, detri: 0, byCircuit: {} },
    transpersonal: { exalt: 0, detri: 0, byCircuit: {} },
    earth: { exalt: 0, detri: 0, byCircuit: {} }
  },
  // Individual vs Collective vs Tribal
  byCircuitType: {
    individual: { exalt: {}, detri: {} },
    collective: { exalt: {}, detri: {} },
    tribal: { exalt: {}, detri: {} }
  },
  // Transformation percentage correlation
  byTransformationLevel: {
    low: { exalt: {}, detri: {} },    // < 40%
    medium: { exalt: {}, detri: {} }, // 40-60%
    high: { exalt: {}, detri: {} }    // > 60%
  },
  // Anchor count correlation
  byAnchorCount: {},
  // Specific planet-circuit patterns
  planetCircuitMatrix: {}
};

// Circuit groupings
const CIRCUIT_TYPES = {
  'Knowing': 'individual',
  'Knowing Circuit': 'individual',
  'Integration': 'individual',
  'Integration Circuit': 'individual',
  'Centering': 'individual',
  'Centering Circuit': 'individual',
  'Understanding': 'collective',
  'Understanding Circuit': 'collective',
  'Sensing': 'collective',
  'Sensing Circuit': 'collective',
  'Defense': 'tribal',
  'Defense Circuit': 'tribal',
  'Ego': 'tribal',
  'Ego Circuit': 'tribal'
};

// Circuit transformation percentages
const CIRCUIT_TRANSFORMATION = {
  'Knowing': 28,
  'Knowing Circuit': 28,
  'Understanding': 43,
  'Understanding Circuit': 43,
  'Integration': 50,
  'Integration Circuit': 50,
  'Centering': 50,
  'Centering Circuit': 50,
  'Defense': 50,
  'Defense Circuit': 50,
  'Ego': 60,
  'Ego Circuit': 60,
  'Sensing': 79,
  'Sensing Circuit': 79
};

// Circuit anchor counts
const CIRCUIT_ANCHORS = {
  'Knowing': 3,
  'Knowing Circuit': 3,
  'Understanding': 2,
  'Understanding Circuit': 2,
  'Sensing': 2,
  'Sensing Circuit': 2,
  'Integration': 1,
  'Integration Circuit': 1,
  'Centering': 1,
  'Centering Circuit': 1,
  'Defense': 0,
  'Defense Circuit': 0,
  'Ego': 0,
  'Ego Circuit': 0
};

// Helper to get planet class
function getPlanetClass(planet) {
  for (const [cls, planets] of Object.entries(PLANET_CLASSES)) {
    if (planets.includes(planet)) return cls;
  }
  return 'unknown';
}

// Helper to get transformation level
function getTransformationLevel(percent) {
  if (percent < 40) return 'low';
  if (percent <= 60) return 'medium';
  return 'high';
}

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

  // Get circuit info
  const circuits = emData.context.circuits || [];
  const circuitArch = emData.context.circuitArchitecture;

  circuits.forEach(circuit => {
    const circuitName = circuit.replace(' Circuit', '');
    const circuitType = CIRCUIT_TYPES[circuit] || 'unknown';
    const architecture = CIRCUIT_ARCHITECTURES[circuit] || circuitArch;
    const transPercent = CIRCUIT_TRANSFORMATION[circuit] || 50;
    const transLevel = getTransformationLevel(transPercent);
    const anchorCount = CIRCUIT_ANCHORS[circuit];

    // By Circuit
    analysis.byCircuit[circuitName] = analysis.byCircuit[circuitName] || { exalt: {}, detri: {} };
    if (exaltPlanet !== 'None') {
      analysis.byCircuit[circuitName].exalt[exaltPlanet] = (analysis.byCircuit[circuitName].exalt[exaltPlanet] || 0) + 1;
    }
    if (detriPlanet !== 'None') {
      analysis.byCircuit[circuitName].detri[detriPlanet] = (analysis.byCircuit[circuitName].detri[detriPlanet] || 0) + 1;
    }

    // By Circuit Architecture
    if (architecture) {
      analysis.byCircuitArchitecture[architecture] = analysis.byCircuitArchitecture[architecture] || { exalt: {}, detri: {} };
      if (exaltPlanet !== 'None') {
        analysis.byCircuitArchitecture[architecture].exalt[exaltPlanet] = (analysis.byCircuitArchitecture[architecture].exalt[exaltPlanet] || 0) + 1;
      }
      if (detriPlanet !== 'None') {
        analysis.byCircuitArchitecture[architecture].detri[detriPlanet] = (analysis.byCircuitArchitecture[architecture].detri[detriPlanet] || 0) + 1;
      }
    }

    // By Planet Class
    if (exaltPlanet !== 'None') {
      const exaltClass = getPlanetClass(exaltPlanet);
      analysis.byPlanetClass[exaltClass].exalt++;
      analysis.byPlanetClass[exaltClass].byCircuit[circuitName] = analysis.byPlanetClass[exaltClass].byCircuit[circuitName] || { exalt: 0, detri: 0 };
      analysis.byPlanetClass[exaltClass].byCircuit[circuitName].exalt++;
    }
    if (detriPlanet !== 'None') {
      const detriClass = getPlanetClass(detriPlanet);
      analysis.byPlanetClass[detriClass].detri++;
      analysis.byPlanetClass[detriClass].byCircuit[circuitName] = analysis.byPlanetClass[detriClass].byCircuit[circuitName] || { exalt: 0, detri: 0 };
      analysis.byPlanetClass[detriClass].byCircuit[circuitName].detri++;
    }

    // By Circuit Type
    if (circuitType !== 'unknown') {
      if (exaltPlanet !== 'None') {
        analysis.byCircuitType[circuitType].exalt[exaltPlanet] = (analysis.byCircuitType[circuitType].exalt[exaltPlanet] || 0) + 1;
      }
      if (detriPlanet !== 'None') {
        analysis.byCircuitType[circuitType].detri[detriPlanet] = (analysis.byCircuitType[circuitType].detri[detriPlanet] || 0) + 1;
      }
    }

    // By Transformation Level
    if (exaltPlanet !== 'None') {
      analysis.byTransformationLevel[transLevel].exalt[exaltPlanet] = (analysis.byTransformationLevel[transLevel].exalt[exaltPlanet] || 0) + 1;
    }
    if (detriPlanet !== 'None') {
      analysis.byTransformationLevel[transLevel].detri[detriPlanet] = (analysis.byTransformationLevel[transLevel].detri[detriPlanet] || 0) + 1;
    }

    // By Anchor Count
    if (anchorCount !== undefined) {
      analysis.byAnchorCount[anchorCount] = analysis.byAnchorCount[anchorCount] || { exalt: {}, detri: {} };
      if (exaltPlanet !== 'None') {
        analysis.byAnchorCount[anchorCount].exalt[exaltPlanet] = (analysis.byAnchorCount[anchorCount].exalt[exaltPlanet] || 0) + 1;
      }
      if (detriPlanet !== 'None') {
        analysis.byAnchorCount[anchorCount].detri[detriPlanet] = (analysis.byAnchorCount[anchorCount].detri[detriPlanet] || 0) + 1;
      }
    }

    // Planet-Circuit Matrix
    if (exaltPlanet !== 'None') {
      analysis.planetCircuitMatrix[exaltPlanet] = analysis.planetCircuitMatrix[exaltPlanet] || {};
      analysis.planetCircuitMatrix[exaltPlanet][circuitName] = analysis.planetCircuitMatrix[exaltPlanet][circuitName] || { exalt: 0, detri: 0 };
      analysis.planetCircuitMatrix[exaltPlanet][circuitName].exalt++;
    }
    if (detriPlanet !== 'None') {
      analysis.planetCircuitMatrix[detriPlanet] = analysis.planetCircuitMatrix[detriPlanet] || {};
      analysis.planetCircuitMatrix[detriPlanet][circuitName] = analysis.planetCircuitMatrix[detriPlanet][circuitName] || { exalt: 0, detri: 0 };
      analysis.planetCircuitMatrix[detriPlanet][circuitName].detri++;
    }
  });

  // By Channel Pairing Type
  const channelsList = emData.context.channels || [];
  channelsList.forEach(ch => {
    const pairingType = ch.pairingType;
    if (!pairingType) return;

    analysis.byChannelPairingType[pairingType] = analysis.byChannelPairingType[pairingType] || { exalt: {}, detri: {} };
    if (exaltPlanet !== 'None') {
      analysis.byChannelPairingType[pairingType].exalt[exaltPlanet] = (analysis.byChannelPairingType[pairingType].exalt[exaltPlanet] || 0) + 1;
    }
    if (detriPlanet !== 'None') {
      analysis.byChannelPairingType[pairingType].detri[detriPlanet] = (analysis.byChannelPairingType[pairingType].detri[detriPlanet] || 0) + 1;
    }
  });
});

// Output
console.log('='.repeat(80));
console.log('PLANETARY CIRCUIT ANALYSIS');
console.log('='.repeat(80));

// 1. By Circuit
console.log('\n## 1. PLANETS BY CIRCUIT\n');
Object.entries(analysis.byCircuit).forEach(([circuit, data]) => {
  const transPercent = CIRCUIT_TRANSFORMATION[circuit] || CIRCUIT_TRANSFORMATION[circuit + ' Circuit'] || '?';
  const anchors = CIRCUIT_ANCHORS[circuit] !== undefined ? CIRCUIT_ANCHORS[circuit] : CIRCUIT_ANCHORS[circuit + ' Circuit'];
  const circType = CIRCUIT_TYPES[circuit] || CIRCUIT_TYPES[circuit + ' Circuit'] || '?';

  console.log(`\n### ${circuit} (${circType}, ${transPercent}% trans, ${anchors} anchors)`);

  const sortedExalt = Object.entries(data.exalt).sort((a, b) => b[1] - a[1]);
  const sortedDetri = Object.entries(data.detri).sort((a, b) => b[1] - a[1]);

  console.log('  Exaltations:', sortedExalt.slice(0, 5).map(([p, c]) => `${p}(${c})`).join(', '));
  console.log('  Detriments:', sortedDetri.slice(0, 5).map(([p, c]) => `${p}(${c})`).join(', '));

  // Calculate and show significant biases
  const allPlanets = new Set([...Object.keys(data.exalt), ...Object.keys(data.detri)]);
  const biases = [];
  allPlanets.forEach(planet => {
    const ex = data.exalt[planet] || 0;
    const det = data.detri[planet] || 0;
    if (ex + det >= 5) {
      const ratio = det > 0 ? (ex / det).toFixed(2) : (ex > 0 ? 'INF' : '0');
      if (parseFloat(ratio) >= 2 || parseFloat(ratio) <= 0.5 || ratio === 'INF') {
        biases.push(`${planet}(${ex}/${det}=${ratio})`);
      }
    }
  });
  if (biases.length > 0) {
    console.log('  Strong bias:', biases.join(', '));
  }
});

// 2. By Circuit Architecture
console.log('\n## 2. PLANETS BY CIRCUIT ARCHITECTURE\n');
Object.entries(analysis.byCircuitArchitecture).forEach(([arch, data]) => {
  console.log(`\n### ${arch}`);

  const sortedExalt = Object.entries(data.exalt).sort((a, b) => b[1] - a[1]);
  const sortedDetri = Object.entries(data.detri).sort((a, b) => b[1] - a[1]);

  console.log('  Exaltations:', sortedExalt.slice(0, 5).map(([p, c]) => `${p}(${c})`).join(', '));
  console.log('  Detriments:', sortedDetri.slice(0, 5).map(([p, c]) => `${p}(${c})`).join(', '));
});

// 3. By Planet Class
console.log('\n## 3. PLANET CLASSES ACROSS CIRCUITS\n');
Object.entries(analysis.byPlanetClass).forEach(([cls, data]) => {
  const ratio = data.detri > 0 ? (data.exalt / data.detri).toFixed(2) : 'N/A';
  console.log(`\n### ${cls.toUpperCase()} (Total: ${data.exalt} exalt, ${data.detri} detri, ratio=${ratio})`);

  const sortedCircuits = Object.entries(data.byCircuit)
    .map(([circ, counts]) => ({
      circuit: circ,
      exalt: counts.exalt,
      detri: counts.detri,
      ratio: counts.detri > 0 ? (counts.exalt / counts.detri).toFixed(2) : (counts.exalt > 0 ? 'INF' : '0')
    }))
    .sort((a, b) => parseFloat(b.ratio) - parseFloat(a.ratio));

  sortedCircuits.forEach(c => {
    console.log(`  ${c.circuit}: ${c.exalt}/${c.detri} (ratio=${c.ratio})`);
  });
});

// 4. By Circuit Type (Individual/Collective/Tribal)
console.log('\n## 4. PLANETS BY CIRCUIT TYPE\n');
['individual', 'collective', 'tribal'].forEach(type => {
  const data = analysis.byCircuitType[type];
  console.log(`\n### ${type.toUpperCase()}`);

  const sortedExalt = Object.entries(data.exalt).sort((a, b) => b[1] - a[1]);
  const sortedDetri = Object.entries(data.detri).sort((a, b) => b[1] - a[1]);

  console.log('  Exaltations:', sortedExalt.slice(0, 6).map(([p, c]) => `${p}(${c})`).join(', '));
  console.log('  Detriments:', sortedDetri.slice(0, 6).map(([p, c]) => `${p}(${c})`).join(', '));
});

// 5. By Transformation Level
console.log('\n## 5. PLANETS BY TRANSFORMATION LEVEL\n');
['low', 'medium', 'high'].forEach(level => {
  const data = analysis.byTransformationLevel[level];
  const desc = level === 'low' ? '(<40%, high anchoring)' : level === 'medium' ? '(40-60%)' : '(>60%, high transformation)';
  console.log(`\n### ${level.toUpperCase()} ${desc}`);

  const sortedExalt = Object.entries(data.exalt).sort((a, b) => b[1] - a[1]);
  const sortedDetri = Object.entries(data.detri).sort((a, b) => b[1] - a[1]);

  console.log('  Exaltations:', sortedExalt.slice(0, 6).map(([p, c]) => `${p}(${c})`).join(', '));
  console.log('  Detriments:', sortedDetri.slice(0, 6).map(([p, c]) => `${p}(${c})`).join(', '));
});

// 6. By Anchor Count
console.log('\n## 6. PLANETS BY ANCHOR COUNT\n');
[3, 2, 1, 0].forEach(count => {
  const data = analysis.byAnchorCount[count];
  if (!data) return;

  const desc = count === 3 ? '(Knowing - max stability)' :
               count === 2 ? '(Understanding/Sensing)' :
               count === 1 ? '(Integration/Centering)' :
               '(Defense/Ego - zero anchor)';
  console.log(`\n### ${count} Anchors ${desc}`);

  const sortedExalt = Object.entries(data.exalt).sort((a, b) => b[1] - a[1]);
  const sortedDetri = Object.entries(data.detri).sort((a, b) => b[1] - a[1]);

  console.log('  Exaltations:', sortedExalt.slice(0, 6).map(([p, c]) => `${p}(${c})`).join(', '));
  console.log('  Detriments:', sortedDetri.slice(0, 6).map(([p, c]) => `${p}(${c})`).join(', '));
});

// 7. By Channel Pairing Type
console.log('\n## 7. PLANETS BY CHANNEL PAIRING TYPE\n');
Object.entries(analysis.byChannelPairingType).forEach(([pairingType, data]) => {
  console.log(`\n### ${pairingType}`);

  const sortedExalt = Object.entries(data.exalt).sort((a, b) => b[1] - a[1]);
  const sortedDetri = Object.entries(data.detri).sort((a, b) => b[1] - a[1]);

  console.log('  Exaltations:', sortedExalt.slice(0, 5).map(([p, c]) => `${p}(${c})`).join(', '));
  console.log('  Detriments:', sortedDetri.slice(0, 5).map(([p, c]) => `${p}(${c})`).join(', '));
});

// 8. Planet-Circuit Matrix (find strongest affinities)
console.log('\n## 8. STRONGEST PLANET-CIRCUIT AFFINITIES\n');

const affinities = [];
Object.entries(analysis.planetCircuitMatrix).forEach(([planet, circuits]) => {
  Object.entries(circuits).forEach(([circuit, counts]) => {
    if (counts.exalt + counts.detri >= 5) {
      const ratio = counts.detri > 0 ? counts.exalt / counts.detri : (counts.exalt > 0 ? 999 : 0);
      if (ratio >= 2) {
        affinities.push({ planet, circuit, exalt: counts.exalt, detri: counts.detri, ratio: ratio.toFixed(2), type: 'EXALT' });
      } else if (ratio <= 0.5) {
        affinities.push({ planet, circuit, exalt: counts.exalt, detri: counts.detri, ratio: ratio.toFixed(2), type: 'DETRI' });
      }
    }
  });
});

affinities.sort((a, b) => {
  if (a.type !== b.type) return a.type === 'EXALT' ? -1 : 1;
  return parseFloat(b.ratio) - parseFloat(a.ratio);
});

console.log('### Strong Exaltation Affinities:');
affinities.filter(a => a.type === 'EXALT').forEach(a => {
  console.log(`  ${a.planet} + ${a.circuit}: ${a.exalt}/${a.detri} (ratio=${a.ratio})`);
});

console.log('\n### Strong Detriment Affinities:');
affinities.filter(a => a.type === 'DETRI').forEach(a => {
  console.log(`  ${a.planet} + ${a.circuit}: ${a.exalt}/${a.detri} (ratio=${a.ratio})`);
});

// 9. Orbital period analysis
console.log('\n## 9. ORBITAL PERIOD PATTERNS\n');

// Group planets by orbital period ranges
const orbitalGroups = {
  'fast (<1 year)': ['Moon', 'Mercury', 'Venus'],
  'medium (1-2 years)': ['Sun', 'Earth', 'Mars'],
  'slow (10-30 years)': ['Jupiter', 'Saturn'],
  'very slow (>80 years)': ['Uranus', 'Neptune', 'Pluto']
};

Object.entries(orbitalGroups).forEach(([group, planets]) => {
  let totalExalt = 0, totalDetri = 0;
  planets.forEach(p => {
    // Get from overall stats
    traditionalGates.mappings.forEach(entry => {
      const exaltP = entry.knowledge.blackBook?.exaltation?.planets?.[0]?.planet;
      const detriP = entry.knowledge.blackBook?.detriment?.planets?.[0]?.planet;
      if (exaltP === p) totalExalt++;
      if (detriP === p) totalDetri++;
    });
  });

  const ratio = totalDetri > 0 ? (totalExalt / totalDetri).toFixed(2) : 'N/A';
  console.log(`${group}: ${totalExalt} exalt, ${totalDetri} detri (ratio=${ratio})`);
});

// Save detailed data
fs.writeFileSync(
  path.join(__dirname, '../docs/research/planetary-circuit-analysis-data.json'),
  JSON.stringify(analysis, null, 2)
);

console.log('\n\nDetailed data saved to docs/research/planetary-circuit-analysis-data.json');
