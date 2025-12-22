// Nuclear Hierarchy to Planetary Mapping Analysis
// This script maps all 64 hexagrams to their nuclear hierarchy position
// and analyses planetary exaltation patterns by family groupings

const NUCLEAR_HIERARCHY = {
  // PILLAR 1: FIRE (Gate 1 - The Creative)
  pillar1_fire: {
    pillar: 1,
    element: 'Fire',
    siddhi: 'Beauty',
    mysteries: {
      28: { siddhi: 'Immortality', letters: [30, 55, 56, 62] },
      43: { siddhi: 'Epiphany', letters: [14, 32, 34, 50] },
      44: { siddhi: 'Synarchy', letters: [13, 31, 33, 49] }
    }
  },
  
  // PILLAR 2: WATER (Gate 2 - The Receptive)
  pillar2_water: {
    pillar: 2,
    element: 'Water',
    siddhi: 'Unity',
    mysteries: {
      23: { siddhi: 'Quintessence', letters: [3, 8, 20, 42] },
      24: { siddhi: 'Silence', letters: [4, 7, 19, 41] },
      27: { siddhi: 'Selflessness', letters: [29, 59, 60, 61] }
    }
  },
  
  // PILLAR 63: TRUTH (Gate 63 - After Completion)
  pillar63_truth: {
    pillar: 63,
    element: 'Truth',
    siddhi: 'Truth',
    mysteries: {
      38: { siddhi: 'Honour', letters: [5, 9, 11, 48] },
      40: { siddhi: 'Divine Will', letters: [15, 22, 36, 52] },
      54: { siddhi: 'Ascension', letters: [18, 26, 46, 57] }
    }
  },
  
  // PILLAR 64: LIGHT (Gate 64 - Before Completion)
  pillar64_light: {
    pillar: 64,
    element: 'Light',
    siddhi: 'Illumination',
    mysteries: {
      37: { siddhi: 'Tenderness', letters: [6, 10, 47, 58] },
      39: { siddhi: 'Liberation', letters: [16, 21, 35, 51] },
      53: { siddhi: 'Superabundance', letters: [12, 17, 25, 45] }
    }
  }
};

// Build reverse lookup: gate number -> hierarchy info
function buildGateToHierarchy() {
  const lookup = {};
  
  // Add the 4 Pillars themselves
  lookup[1] = { level: 'Pillar', pillar: 1, element: 'Fire', siddhi: 'Beauty' };
  lookup[2] = { level: 'Pillar', pillar: 2, element: 'Water', siddhi: 'Unity' };
  lookup[63] = { level: 'Pillar', pillar: 63, element: 'Truth', siddhi: 'Truth' };
  lookup[64] = { level: 'Pillar', pillar: 64, element: 'Light', siddhi: 'Illumination' };
  
  // Add all Mysteries and Letters
  for (const pillarKey of Object.keys(NUCLEAR_HIERARCHY)) {
    const pillar = NUCLEAR_HIERARCHY[pillarKey];
    const pillarNum = pillar.pillar;
    const element = pillar.element;
    
    for (const mysteryNum of Object.keys(pillar.mysteries)) {
      const mystery = pillar.mysteries[mysteryNum];
      
      // Add the Mystery
      lookup[mysteryNum] = {
        level: 'Mystery',
        pillar: pillarNum,
        element: element,
        mystery: parseInt(mysteryNum),
        siddhi: mystery.siddhi
      };
      
      // Add all Letters under this Mystery
      for (const letterNum of mystery.letters) {
        lookup[letterNum] = {
          level: 'Letter',
          pillar: pillarNum,
          element: element,
          mystery: parseInt(mysteryNum),
          mysterySiddhi: mystery.siddhi
        };
      }
    }
  }
  
  return lookup;
}

const GATE_HIERARCHY = buildGateToHierarchy();

// Output the complete mapping
console.log("=== COMPLETE GATE TO NUCLEAR HIERARCHY MAPPING ===\n");

const gatesByPillar = {
  'Fire (1)': [],
  'Water (2)': [],
  'Truth (63)': [],
  'Light (64)': []
};

for (let gate = 1; gate <= 64; gate++) {
  const info = GATE_HIERARCHY[gate];
  if (info) {
    const pillarKey = `${info.element} (${info.pillar})`;
    gatesByPillar[pillarKey].push({
      gate,
      level: info.level,
      mystery: info.mystery || null,
      siddhi: info.siddhi || info.mysterySiddhi
    });
  }
}

for (const pillar of Object.keys(gatesByPillar)) {
  console.log(`\n${pillar}:`);
  console.log('-'.repeat(40));
  for (const g of gatesByPillar[pillar]) {
    if (g.level === 'Pillar') {
      console.log(`  Gate ${g.gate} [PILLAR] - ${g.siddhi}`);
    } else if (g.level === 'Mystery') {
      console.log(`  Gate ${g.gate} [MYSTERY] - ${g.siddhi}`);
    } else {
      console.log(`  Gate ${g.gate} (under Mystery ${g.mystery}) - ${g.siddhi}`);
    }
  }
}

// Export for use in analysis
module.exports = { NUCLEAR_HIERARCHY, GATE_HIERARCHY };
