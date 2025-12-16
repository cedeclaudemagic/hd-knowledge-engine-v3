/**
 * Electromagnetic Lines Generator
 *
 * This script generates and updates the electromagnetic line mappings
 * by combining:
 * - Source data (keynotes, polarity, planets) from hd-traditional-gates
 * - Gate metadata (name, keyword) from hd-gates
 * - Context data (centre, circuits, channels) from existing mappings
 * - Electromagnetic classification based on the Four Axes Framework
 *
 * Usage: node scripts/generate-electromagnetic-lines.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const KNOWLEDGE_SYSTEMS = path.join(__dirname, '..', 'knowledge-systems');
const TRADITIONAL_GATES = path.join(KNOWLEDGE_SYSTEMS, 'hd-traditional-gates/mappings/hd-gates-mappings.json');
const HD_GATES = path.join(KNOWLEDGE_SYSTEMS, 'hd-gates/mappings/hd-gates-mappings.json');
const TRIGRAMS = path.join(KNOWLEDGE_SYSTEMS, 'trigrams/mappings/trigrams-mappings.json');
const CHANNELS = path.join(KNOWLEDGE_SYSTEMS, 'channels/mappings/channels-mappings.json');
const CENTERS = path.join(KNOWLEDGE_SYSTEMS, 'centers/center-gate-assignments.json');
const OUTPUT = path.join(KNOWLEDGE_SYSTEMS, 'electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

// Trigram position mapping (Four Axes Framework)
const TRIGRAM_POSITIONS = {
  'Heaven': { position: -4, binary: '111', axis: 'poles' },
  'Earth': { position: 4, binary: '000', axis: 'poles' },
  'Thunder': { position: 1, binary: '100', axis: 'gates' },
  'Water': { position: 2, binary: '010', axis: 'flow' },
  'Mountain': { position: 3, binary: '001', axis: 'storage' },
  'Wind': { position: -1, binary: '011', axis: 'gates' },
  'Fire': { position: -2, binary: '101', axis: 'flow' },
  'Lake': { position: -3, binary: '110', axis: 'storage' }
};

// Binary to trigram name
const BINARY_TO_TRIGRAM = {
  '111': 'Heaven',
  '000': 'Earth',
  '100': 'Thunder',
  '010': 'Water',
  '001': 'Mountain',
  '011': 'Wind',
  '101': 'Fire',
  '110': 'Lake'
};

// Centre electromagnetic signatures
const CENTRE_SIGNATURES = {
  'G': 'polar-reference',
  'Spleen': 'gate-discrimination',
  'Throat': 'material-expression',
  'Solar Plexus': 'voltage-pressure',
  'Root': 'stored-energy',
  'Sacral': 'source-flow',
  'Heart': 'gate-initiation',
  'Ajna': 'storage-polar-output',
  'Head': 'mirror-transformation'
};

// Circuit architectures (with variations in naming)
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

// Line position descriptions
const LINE_POSITIONS = {
  1: 'entry-inner',
  2: 'development-inner',
  3: 'completion-inner',
  4: 'entry-outer',
  5: 'development-outer',
  6: 'completion-outer'
};

/**
 * Get inner and outer trigrams from hexagram binary
 * Hexagram is read as inner (lines 1-3) and outer (lines 4-6) trigrams
 */
function getTrigramsFromBinary(hexBinary) {
  // hexBinary is 6 bits, line 1 at index 0, line 6 at index 5
  const innerBinary = hexBinary.slice(0, 3); // lines 1-3
  const outerBinary = hexBinary.slice(3, 6); // lines 4-6

  return {
    inner: BINARY_TO_TRIGRAM[innerBinary],
    outer: BINARY_TO_TRIGRAM[outerBinary]
  };
}

/**
 * Classify gate type based on inner/outer trigram positions
 */
function classifyGateType(innerPos, outerPos) {
  if (innerPos === outerPos) {
    return 'doubled';
  }

  const crossesZero = (innerPos < 0 && outerPos > 0) || (innerPos > 0 && outerPos < 0);

  if (crossesZero) {
    return innerPos < 0 ? 'cross-zero-manifesting' : 'cross-zero-dematerialising';
  }

  return innerPos > 0 ? 'same-phase-material' : 'same-phase-void';
}

/**
 * Get language type based on gate type
 */
function getLanguageType(gateType) {
  if (gateType === 'doubled') return 'state';
  if (gateType.startsWith('same-phase')) return 'action';
  return 'transformation';
}

/**
 * Get transition type based on gate type
 */
function getTransitionType(gateType) {
  switch (gateType) {
    case 'doubled': return 'expression-shift';
    case 'same-phase-material': return 'polarity-flip';
    case 'same-phase-void': return 'relational-reorientation';
    default: return 'mode-shift';
  }
}

/**
 * Calculate vector properties
 */
function calculateVector(innerPos, outerPos) {
  const amplitude = Math.abs(outerPos - innerPos);
  const crossesZero = (innerPos < 0 && outerPos > 0) || (innerPos > 0 && outerPos < 0);

  let direction = 'static';
  if (innerPos !== outerPos) {
    // Inward = moving toward zero, outward = moving away from zero
    const innerDist = Math.abs(innerPos);
    const outerDist = Math.abs(outerPos);
    direction = outerDist < innerDist ? 'inward' : 'outward';
  }

  return { from: innerPos, to: outerPos, amplitude, direction, crossesZero };
}

/**
 * Build gate-to-centre mapping
 */
function buildGateToCentreMap(centerAssignments) {
  const map = {};
  for (const [centre, gates] of Object.entries(centerAssignments)) {
    for (const gate of gates) {
      map[gate] = centre;
    }
  }
  return map;
}

/**
 * Get channel pairing type based on two gate types
 */
function getChannelPairingType(gateType1, gateType2) {
  const isTransformer = (t) => t.startsWith('cross-zero');
  const isCirculator = (t) => t.startsWith('same-phase');
  const isStandingWave = (t) => t === 'doubled';

  const t1 = isTransformer(gateType1);
  const c1 = isCirculator(gateType1);
  const s1 = isStandingWave(gateType1);

  const t2 = isTransformer(gateType2);
  const c2 = isCirculator(gateType2);
  const s2 = isStandingWave(gateType2);

  if (t1 && t2) return 'double-transformer';
  if (c1 && c2) return 'double-circulator';
  if (s1 && s2) return 'double-standing-wave'; // Rare case
  if ((t1 && c2) || (c1 && t2)) return 'transformer-circulator';
  if ((t1 && s2) || (s1 && t2)) return 'transformer-standing-wave';
  if ((c1 && s2) || (s1 && c2)) return 'circulator-standing-wave';

  return 'unknown';
}

/**
 * Build gate-to-channels mapping
 */
function buildGateToChannelsMap(channelsMappings, hexagramBinaries) {
  const map = {};

  // First, classify all gates
  const gateClassifications = {};
  for (let gateNum = 1; gateNum <= 64; gateNum++) {
    const hexBinary = hexagramBinaries[gateNum];
    if (hexBinary) {
      const trigrams = getTrigramsFromBinary(hexBinary);
      const innerTrigram = TRIGRAM_POSITIONS[trigrams.inner];
      const outerTrigram = TRIGRAM_POSITIONS[trigrams.outer];
      if (innerTrigram && outerTrigram) {
        gateClassifications[gateNum] = classifyGateType(innerTrigram.position, outerTrigram.position);
      }
    }
  }

  for (const channel of channelsMappings) {
    const { gate1, gate2, channelNumber, knowledge } = channel;

    // Calculate pairing type from gate classifications
    const pairingType = getChannelPairingType(
      gateClassifications[gate1] || 'unknown',
      gateClassifications[gate2] || 'unknown'
    );

    const channelInfo = {
      number: channelNumber,
      name: knowledge.name,
      circuit: knowledge.circuit,
      pairingType
    };

    if (!map[gate1]) map[gate1] = [];
    if (!map[gate2]) map[gate2] = [];

    map[gate1].push({ ...channelInfo, harmonicGate: gate2 });
    map[gate2].push({ ...channelInfo, harmonicGate: gate1 });
  }
  return map;
}

/**
 * Main generation function
 */
async function generateElectromagneticLines() {
  console.log('Loading source data...');

  // Load all source files
  const traditionalGates = JSON.parse(fs.readFileSync(TRADITIONAL_GATES, 'utf8'));
  const hdGates = JSON.parse(fs.readFileSync(HD_GATES, 'utf8'));
  const channels = JSON.parse(fs.readFileSync(CHANNELS, 'utf8'));
  const centers = JSON.parse(fs.readFileSync(CENTERS, 'utf8'));

  // Hexagram binary patterns
  const hexagramBinaries = getHexagramBinaries();

  // Build lookup maps
  const gateToCentre = buildGateToCentreMap(centers);
  const gateToChannels = buildGateToChannelsMap(channels.mappings, hexagramBinaries);

  // Build gate metadata map
  const gateMetadata = {};
  for (const gate of hdGates.mappings) {
    gateMetadata[gate.gateNumber] = {
      name: gate.knowledge.name,
      keyword: gate.knowledge.keyword
    };
  }

  // Hexagram binary patterns already loaded above

  console.log('Generating electromagnetic mappings...');

  const mappings = [];

  for (const lineData of traditionalGates.mappings) {
    const { gateNumber, lineNumber, knowledge } = lineData;

    // Get trigrams for this gate
    const hexBinary = hexagramBinaries[gateNumber];
    if (!hexBinary) {
      console.warn(`Missing binary for gate ${gateNumber}`);
      continue;
    }

    const trigrams = getTrigramsFromBinary(hexBinary);
    const innerTrigram = TRIGRAM_POSITIONS[trigrams.inner];
    const outerTrigram = TRIGRAM_POSITIONS[trigrams.outer];

    if (!innerTrigram || !outerTrigram) {
      console.warn(`Missing trigram data for gate ${gateNumber}`);
      continue;
    }

    // Classify gate
    const gateType = classifyGateType(innerTrigram.position, outerTrigram.position);
    const languageType = getLanguageType(gateType);
    const transitionType = getTransitionType(gateType);
    const vector = calculateVector(innerTrigram.position, outerTrigram.position);

    // Get context
    const centre = gateToCentre[gateNumber];
    const channelInfo = gateToChannels[gateNumber] || [];
    const circuits = [...new Set(channelInfo.map(c => c.circuit).filter(Boolean))];
    const primaryCircuit = circuits[0] || 'Unknown';

    // Build entry
    const entry = {
      gate: gateNumber,
      line: lineNumber,
      gateName: gateMetadata[gateNumber]?.name || knowledge.gateName,
      gateKeyword: gateMetadata[gateNumber]?.keyword || knowledge.gateKeyword,

      electromagnetic: {
        gateType,
        innerTrigram: {
          name: trigrams.inner,
          position: innerTrigram.position,
          binary: innerTrigram.binary,
          axis: innerTrigram.axis
        },
        outerTrigram: {
          name: trigrams.outer,
          position: outerTrigram.position,
          binary: outerTrigram.binary,
          axis: outerTrigram.axis
        },
        vector,
        languageType,
        transitionType
      },

      context: {
        centre: centre || 'Unknown',
        centreSignature: CENTRE_SIGNATURES[centre] || 'unknown',
        circuits,
        circuitArchitecture: CIRCUIT_ARCHITECTURES[primaryCircuit] || 'unknown',
        channels: channelInfo.map(c => ({
          number: c.number,
          name: c.name,
          pairingType: c.pairingType
        }))
      },

      interpretation: {
        linePosition: LINE_POSITIONS[lineNumber],
        positionMeaning: '', // To be filled in manually or via AI
        lineFunction: '', // To be filled in manually or via AI
        shadow: '' // To be filled in manually or via AI
      },

      source: {
        keynote: knowledge.lineKeynote,
        polarity: knowledge.polarity || 'YANG', // Default if missing
        exaltation: knowledge.blackBook?.exaltation?.planets?.[0] ? {
          planet: knowledge.blackBook.exaltation.planets[0].planet,
          description: knowledge.blackBook.exaltation.planets[0].description?.whiteBook || ''
        } : undefined,
        detriment: knowledge.blackBook?.detriment?.planets?.[0] ? {
          planet: knowledge.blackBook.detriment.planets[0].planet,
          description: knowledge.blackBook.detriment.planets[0].description?.whiteBook || ''
        } : undefined
      }
    };

    mappings.push(entry);
  }

  // Build output structure
  const output = {
    systemName: 'Electromagnetic Line Mappings',
    version: '1.1.0',
    description: 'The 384-line electromagnetic interpretation layer. Each line interpreted through the Four Axes Framework validated at centre, circuit, channel, gate, and line levels.',
    completeness: 'partial',
    validatedLines: 42,
    totalLines: mappings.length,
    generatedAt: new Date().toISOString().split('T')[0],

    framework: {
      fourAxes: {
        poles: { positions: [-4, 4], trigrams: ['Heaven', 'Earth'], function: 'Source ↔ Sink' },
        storage: { positions: [-3, 3], trigrams: ['Lake', 'Mountain'], function: 'Capacitance ↔ Inductance' },
        flow: { positions: [-2, 2], trigrams: ['Fire', 'Water'], function: 'Voltage ↔ Current' },
        gates: { positions: [-1, 1], trigrams: ['Wind', 'Thunder'], function: 'Open ↔ Close' }
      },
      gateTypes: {
        doubled: { definition: 'Inner and outer trigram identical', count: 8, language: 'state' },
        'same-phase-material': { definition: 'Both trigrams positive (matter side)', count: 12, language: 'action' },
        'same-phase-void': { definition: 'Both trigrams negative (void side)', count: 12, language: 'action' },
        'cross-zero-manifesting': { definition: 'Negative inner → Positive outer', count: 16, language: 'transformation' },
        'cross-zero-dematerialising': { definition: 'Positive inner → Negative outer', count: 16, language: 'transformation' }
      },
      languageTypes: {
        state: { character: 'Being at a position', verbs: 'Descriptive, quality-focused', examples: ['clarity', 'receptivity', 'creativity'] },
        action: { character: 'Doing within a domain', verbs: 'Movement and process', examples: ['defending', 'structuring', 'progressing'] },
        transformation: { character: 'Becoming something else', verbs: 'Crossing, releasing, building', examples: ['withdrawal', 'metamorphosis', 'assimilation'] }
      },
      transitionTypes: {
        'expression-shift': { gateType: 'doubled', character: 'Internal → External expression of same state' },
        'polarity-flip': { gateType: 'same-phase-material', character: 'Reversal within matter domain' },
        'relational-reorientation': { gateType: 'same-phase-void', character: 'Relationship to potential changes' },
        'mode-shift': { gateType: 'cross-zero', character: 'Zero crossing, domain change' }
      },
      centreSignatures: CENTRE_SIGNATURES,
      circuitArchitectures: CIRCUIT_ARCHITECTURES,
      linePositions: {
        1: { trigram: 'inner', position: 'entry', description: 'Entry into inner trigram' },
        2: { trigram: 'inner', position: 'development', description: 'Development within inner trigram' },
        3: { trigram: 'inner', position: 'completion', description: 'Completion of inner trigram' },
        4: { trigram: 'outer', position: 'entry', description: 'Entry into outer trigram (threshold)' },
        5: { trigram: 'outer', position: 'development', description: 'Development within outer trigram' },
        6: { trigram: 'outer', position: 'completion', description: 'Completion of outer trigram' }
      }
    },

    mappings
  };

  console.log(`Generated ${mappings.length} line entries`);
  console.log('Writing output...');

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(`Output written to ${OUTPUT}`);
}

/**
 * Hexagram binary patterns
 * Each hexagram's 6-line binary pattern (line 1 = bit 0, line 6 = bit 5)
 * This maps gate number to its binary representation
 */
function getHexagramBinaries() {
  // Binary patterns for the 64 hexagrams
  // Format: gate number -> 6-bit binary string (line 1 first)
  // These are the actual I Ching hexagram structures
  return {
    1: '111111',  // Heaven/Heaven (Creative)
    2: '000000',  // Earth/Earth (Receptive)
    3: '100010',  // Thunder/Water
    4: '010001',  // Water/Mountain
    5: '111010',  // Heaven/Water
    6: '010111',  // Water/Heaven
    7: '010000',  // Water/Earth
    8: '000010',  // Earth/Water
    9: '111011',  // Heaven/Wind
    10: '110111', // Lake/Heaven
    11: '111000', // Heaven/Earth
    12: '000111', // Earth/Heaven
    13: '101111', // Fire/Heaven
    14: '111101', // Heaven/Fire
    15: '001000', // Mountain/Earth
    16: '000100', // Earth/Thunder
    17: '100110', // Thunder/Lake
    18: '011001', // Wind/Mountain
    19: '110000', // Lake/Earth
    20: '000011', // Earth/Wind
    21: '100101', // Thunder/Fire
    22: '101001', // Fire/Mountain
    23: '000001', // Earth/Mountain
    24: '100000', // Thunder/Earth
    25: '100111', // Thunder/Heaven
    26: '111001', // Heaven/Mountain
    27: '100001', // Thunder/Mountain
    28: '011110', // Wind/Lake
    29: '010010', // Water/Water (Abysmal)
    30: '101101', // Fire/Fire (Clinging)
    31: '001110', // Mountain/Lake
    32: '011100', // Wind/Thunder
    33: '001111', // Mountain/Heaven
    34: '111100', // Heaven/Thunder
    35: '000101', // Earth/Fire
    36: '101000', // Fire/Earth
    37: '101011', // Fire/Wind
    38: '110101', // Lake/Fire
    39: '001010', // Mountain/Water
    40: '010100', // Water/Thunder
    41: '110001', // Lake/Mountain
    42: '100011', // Thunder/Wind
    43: '111110', // Heaven/Lake
    44: '011111', // Wind/Heaven
    45: '000110', // Earth/Lake
    46: '011000', // Wind/Earth
    47: '010110', // Water/Lake
    48: '011010', // Wind/Water
    49: '101110', // Fire/Lake
    50: '011101', // Wind/Fire
    51: '100100', // Thunder/Thunder (Arousing)
    52: '001001', // Mountain/Mountain (Keeping Still)
    53: '001011', // Mountain/Wind
    54: '110100', // Lake/Thunder
    55: '101100', // Fire/Thunder
    56: '001101', // Mountain/Fire
    57: '011011', // Wind/Wind (Gentle)
    58: '110110', // Lake/Lake (Joyous)
    59: '010011', // Water/Wind
    60: '110010', // Lake/Water
    61: '110011', // Lake/Wind
    62: '001100', // Mountain/Thunder
    63: '101010', // Fire/Water
    64: '010101'  // Water/Fire
  };
}

// Run generator
generateElectromagneticLines().catch(console.error);
