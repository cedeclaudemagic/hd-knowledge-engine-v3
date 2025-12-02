/**
 * Bodygraph Generator
 *
 * Generates the Human Design bodygraph SVG from first principles,
 * using extracted geometry and V3 knowledge engine data.
 *
 * Components:
 * - 9 Centers (geometric shapes)
 * - 64 Gates (circles on center perimeters)
 * - 36 Channels (paths connecting gate pairs)
 * - 128 Connector Lines (64 direct + 64 curved)
 * - 64 Gate Dots (outer wheel markers)
 *
 * Following the pattern established in quarters-trigrams-faces-ring.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// GEOMETRY & DATA
// ============================================================================

const GEOMETRY = require('./bodygraph-geometry.json');

// Knowledge engine connections - Full V3 integration
const centersData = require('../../knowledge-systems/centers/mappings/centers-mappings.json');
const channelsData = require('../../knowledge-systems/channels/mappings/channels-mappings.json');
const hdGatesData = require('../../knowledge-systems/hd-gates/mappings/hd-gates-mappings.json');
const geneKeysData = require('../../knowledge-systems/gene-keys/mappings/gene-keys-mappings.json');
const ichingNamesData = require('../../knowledge-systems/iching-names/mappings/iching-names-mappings.json');
const codonRingsData = require('../../knowledge-systems/codon-rings/mappings/codon-rings-mappings.json');
const quartersData = require('../../knowledge-systems/quarters/mappings/quarters-mappings.json');

// Build gate knowledge lookup for efficient access
const GATE_KNOWLEDGE = buildGateKnowledgeLookup();

// ============================================================================
// COLORS (Dark theme only)
// ============================================================================

const COLORS = {
  background: '#151E25',    // Dark blue-grey canvas
  foreground: '#FFFFFF',    // White for all elements
  highlight: '#fab414',     // Gold accent
  stroke: '#FFFFFF',        // White strokes
  gateStroke: '#FFFFFF',    // Gate circle stroke
  gateFill: '#FFFFFF',      // Gate circles filled white
  centerStroke: '#FFFFFF',  // Center outline stroke
  centerFill: 'none',       // Large center shapes unfilled
  channelStroke: '#FFFFFF', // Channel path stroke
  connectorStroke: '#FFFFFF' // Connector line stroke
};

// ============================================================================
// STROKE WIDTHS (from master SVG)
// ============================================================================

const STROKES = {
  connector: 0.5,
  channel: 2,
  centerOutline: 1.3356,
  centerDefinition: 0.81,
  gate: 1,
  gateDot: 1
};

// ============================================================================
// CIRCUIT DEFINITIONS
// ============================================================================

const CIRCUITS = {
  'Individual - Knowing': {
    channels: ['24-61', '23-43', '1-8', '2-14', '3-60', '28-38', '39-55', '20-57', '12-22']
  },
  'Collective Logic - Understanding': {
    channels: ['16-48', '18-58', '9-52', '5-15', '7-31', '17-62', '4-63', '47-64']
  },
  'Collective Abstract - Sensing': {
    channels: ['35-36', '30-41', '42-53', '29-46', '13-33', '11-56']
  },
  'Defence': {
    channels: ['6-59', '27-50']
  },
  'Tribal - Ego': {
    channels: ['32-54', '26-44', '19-49', '37-40', '21-45']
  },
  'Individual - Centering': {
    channels: ['10-34', '25-51']
  }
};

// ============================================================================
// KNOWLEDGE LOOKUP BUILDER
// ============================================================================

/**
 * Build comprehensive gate knowledge lookup from all V3 systems
 * Combines HD gates, Gene Keys, I Ching names, codon rings, and quarters
 */
function buildGateKnowledgeLookup() {
  const lookup = {};

  // Initialize all 64 gates
  for (let i = 1; i <= 64; i++) {
    lookup[i] = { gateNumber: i };
  }

  // HD Gates data (keyword, harmonicGate, channel, center)
  for (const mapping of hdGatesData.mappings) {
    const gateNum = mapping.gateNumber;
    if (gateNum && lookup[gateNum]) {
      lookup[gateNum].hdGate = mapping.knowledge;
    }
  }

  // Gene Keys data (shadow, gift, siddhi)
  for (const mapping of geneKeysData.mappings) {
    const gateNum = mapping.gateNumber;
    if (gateNum && lookup[gateNum]) {
      lookup[gateNum].geneKey = mapping.knowledge;
    }
  }

  // I Ching names data (ichingName, chineseName, trigrams)
  for (const mapping of ichingNamesData.mappings) {
    const gateNum = mapping.gateNumber;
    if (gateNum && lookup[gateNum]) {
      lookup[gateNum].iching = mapping.knowledge;
    }
  }

  // Codon rings data (ring, aminoAcid, codons)
  for (const mapping of codonRingsData.mappings) {
    const gateNum = mapping.gateNumber;
    if (gateNum && lookup[gateNum]) {
      lookup[gateNum].codonRing = mapping.knowledge;
    }
  }

  // Quarters data - need to derive from binary pattern
  // Binary patterns: 11=Mutation, 10=Initiation, 01=Duality, 00=Civilisation
  const quarterByBinary = {};
  for (const mapping of quartersData.mappings) {
    quarterByBinary[mapping.binaryPattern] = mapping.groupName;
  }

  return lookup;
}

/**
 * Get comprehensive gate knowledge
 */
function getGateKnowledge(gateNum) {
  return GATE_KNOWLEDGE[gateNum] || null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Escape special characters for SVG ID attributes
 */
function escapeId(str) {
  return str.replace(/[^a-zA-Z0-9_-]/g, '_');
}

/**
 * Escape special characters for SVG data attribute values
 */
function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/**
 * Format a channel key consistently (smaller gate first)
 */
function formatChannelKey(gate1, gate2) {
  const [a, b] = [gate1, gate2].sort((x, y) => x - y);
  return `${a}-${b}`;
}

/**
 * Get channel data from knowledge system
 */
function getChannelKnowledge(channelKey) {
  const channel = channelsData.mappings.find(c => c.channelNumber === channelKey);
  return channel ? channel.knowledge : null;
}

/**
 * Get center data from knowledge system
 */
function getCenterKnowledge(centerName) {
  // Map SVG center names to knowledge system names
  const nameMap = {
    'HEAD': 'Head',
    'AJNA': 'Ajna',
    'THROAT': 'Throat',
    'G': 'G',
    'EGO': 'Heart',
    'SACRAL': 'Sacral',
    'SPLEEN': 'Spleen',
    'SP': 'Solar Plexus',
    'ROOT': 'Root'
  };
  const mappedName = nameMap[centerName] || centerName;
  const center = centersData.mappings.find(c => c.centerName === mappedName);
  return center ? center.knowledge : null;
}

// ============================================================================
// SVG GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate the SVG header
 */
function generateHeader() {
  const { viewBox } = GEOMETRY;
  return `<svg id="BODYGRAPH_-_GENERATED"
     data-name="BODYGRAPH - GENERATED"
     xmlns="http://www.w3.org/2000/svg"
     width="${viewBox.width}"
     height="${viewBox.height}"
     viewBox="0 0 ${viewBox.width} ${viewBox.height}">
  <rect id="background" width="${viewBox.width}" height="${viewBox.height}" fill="${COLORS.background}"/>`;
}

/**
 * Generate direct connector lines (outer layer)
 */
function generateDirectConnectors() {
  const lines = [];

  for (const [gateNum, coords] of Object.entries(GEOMETRY.connectors.direct)) {
    const { x1, y1, x2, y2 } = coords;
    lines.push(`    <line
       id="LINE_-_DIRECT-CONNECTION_-_GATE_${gateNum}"
       data-name="LINE - DIRECT-CONNECTION - GATE ${gateNum}"
       data-gate="${gateNum}"
       x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
       fill="none"
       stroke="${COLORS.connectorStroke}"
       stroke-miterlimit="10"
       stroke-width="${STROKES.connector}"/>`);
  }

  return `  <g id="GROUP_-_CONNECTORS_-_DIRECT" data-name="GROUP - CONNECTORS - DIRECT">
${lines.join('\n')}
  </g>`;
}

/**
 * Generate curved connector lines/paths
 */
function generateCurvedConnectors() {
  const elements = [];
  const transform = `translate(${GEOMETRY.transform.x} ${GEOMETRY.transform.y})`;

  for (const [gateNum, data] of Object.entries(GEOMETRY.connectors.curved)) {
    if (data.type === 'line') {
      elements.push(`    <line
       id="LINE_-_CURVED-CONNECTION_-_GATE_${gateNum}"
       data-name="LINE - CURVED-CONNECTION - GATE ${gateNum}"
       data-gate="${gateNum}"
       x1="${data.x1}" y1="${data.y1}" x2="${data.x2}" y2="${data.y2}"
       fill="none"
       stroke="${COLORS.connectorStroke}"
       stroke-miterlimit="10"
       stroke-width="${STROKES.connector}"/>`);
    } else {
      elements.push(`    <path
       id="LINE_-_CURVED-CONNECTION_-_GATE_${gateNum}"
       data-name="LINE - CURVED-CONNECTION - GATE ${gateNum}"
       data-gate="${gateNum}"
       d="${data.d}"
       transform="${data.transform || transform}"
       fill="none"
       stroke="${COLORS.connectorStroke}"
       stroke-miterlimit="10"
       stroke-width="${STROKES.connector}"/>`);
    }
  }

  return `  <g id="GROUP_-_CONNECTORS_-_CURVED" data-name="GROUP - CONNECTORS - CURVED">
${elements.join('\n')}
  </g>`;
}

/**
 * Generate gate dots (outer wheel markers) - solid white filled circles
 */
function generateGateDots() {
  const dots = [];

  for (const [gateNum, coords] of Object.entries(GEOMETRY.gateDots)) {
    const { cx, cy, r } = coords;
    dots.push(`    <circle
       id="SYMBOL_-_GATE-DOT_-_${gateNum}"
       data-name="SYMBOL - GATE-DOT - ${gateNum}"
       data-gate="${gateNum}"
       cx="${cx}" cy="${cy}" r="${r}"
       fill="${COLORS.foreground}"
       stroke="none"/>`);
  }

  return `  <g id="GROUP_-_GATE-DOTS" data-name="GROUP - GATE-DOTS">
${dots.join('\n')}
  </g>`;
}

/**
 * Generate a single channel's paths
 */
function generateChannelPaths(channelKey, channelData) {
  const elements = [];
  const knowledge = getChannelKnowledge(channelKey);
  const channelName = knowledge ? knowledge.name : channelKey;

  for (const pathData of channelData.paths) {
    if (pathData.type === 'polyline') {
      elements.push(`      <polyline
         id="PATH_-_${pathData.gate}"
         data-name="PATH - ${pathData.gate}"
         data-gate="${pathData.gate}"
         points="${pathData.points}"
         fill="none"
         stroke="${COLORS.channelStroke}"
         stroke-linecap="round"
         stroke-miterlimit="10"
         stroke-width="${STROKES.channel}"/>`);
    } else if (pathData.type === 'path') {
      const transform = pathData.transform || `translate(${GEOMETRY.transform.x} ${GEOMETRY.transform.y})`;
      elements.push(`      <path
         id="PATH_-_${pathData.gate}"
         data-name="PATH - ${pathData.gate}"
         data-gate="${pathData.gate}"
         d="${pathData.d}"
         transform="${transform}"
         fill="none"
         stroke="${COLORS.channelStroke}"
         stroke-linecap="round"
         stroke-miterlimit="10"
         stroke-width="${STROKES.channel}"/>`);
    }
  }

  return elements.join('\n');
}

/**
 * Generate all channels organized by circuit with full V3 knowledge attributes
 */
function generateChannels() {
  const circuitGroups = [];

  for (const [circuitName, circuitData] of Object.entries(CIRCUITS)) {
    const channelElements = [];

    for (const channelKey of circuitData.channels) {
      const channelData = GEOMETRY.channels[channelKey];
      if (!channelData) continue; // Skip channels not in SVG template

      const knowledge = getChannelKnowledge(channelKey);
      const channelName = knowledge ? knowledge.name.toUpperCase().replace(/\s+/g, '_') : channelKey;
      const [gate1, gate2] = channelKey.split('-');

      // Build rich channel attributes
      const attrs = [];
      attrs.push(`id="GROUP_-_THE_CHANNEL_OF_${channelName}_-_${gate1}_${gate2}"`);
      attrs.push(`data-name="GROUP - THE CHANNEL OF ${channelName} - ${gate1}|${gate2}"`);
      attrs.push(`data-channel="${channelKey}"`);
      attrs.push(`data-circuit="${escapeId(circuitName)}"`);
      attrs.push(`data-gate1="${gate1}"`);
      attrs.push(`data-gate2="${gate2}"`);

      if (knowledge) {
        attrs.push(`data-channel-name="${escapeAttr(knowledge.name)}"`);
        if (knowledge.keynote) {
          attrs.push(`data-keynote="${escapeAttr(knowledge.keynote)}"`);
        }
        if (knowledge.type) {
          attrs.push(`data-type="${escapeAttr(knowledge.type)}"`);
        }
        // Get connected centers from gate knowledge
        const gate1Knowledge = getGateKnowledge(parseInt(gate1));
        const gate2Knowledge = getGateKnowledge(parseInt(gate2));
        if (gate1Knowledge?.hdGate?.center && gate2Knowledge?.hdGate?.center) {
          attrs.push(`data-centers="${escapeAttr(gate1Knowledge.hdGate.center)}-${escapeAttr(gate2Knowledge.hdGate.center)}"`);
        }
      }

      const channelGroup = `    <g ${attrs.join('\n       ')}>
${generateChannelPaths(channelKey, channelData)}
    </g>`;

      channelElements.push(channelGroup);
    }

    if (channelElements.length > 0) {
      circuitGroups.push(`  <g id="GROUP_-_CIRCUIT_-_${escapeId(circuitName)}"
     data-name="GROUP - CIRCUIT - ${circuitName}"
     data-circuit-type="${escapeId(circuitName)}">
${channelElements.join('\n')}
  </g>`);
    }
  }

  return `  <g id="GROUP_-_CHANNELS" data-name="GROUP - CHANNELS">
${circuitGroups.join('\n')}
  </g>`;
}

/**
 * Generate gates for a specific center with full V3 knowledge attributes
 */
function generateCenterGates(centerName, gateNumbers) {
  const gates = [];

  for (const gateNum of gateNumbers) {
    const gateData = GEOMETRY.gates[gateNum];
    if (!gateData) continue;

    const { cx, cy, r } = gateData;
    const knowledge = getGateKnowledge(gateNum);

    // Build rich data attributes from V3 knowledge engine
    const attrs = [];
    attrs.push(`id="SYMBOL_-_GATE_-_${gateNum}"`);
    attrs.push(`data-name="SYMBOL - GATE - ${gateNum}"`);
    attrs.push(`data-gate="${gateNum}"`);
    attrs.push(`data-center="${centerName}"`);

    if (knowledge) {
      // HD Gate attributes
      if (knowledge.hdGate) {
        attrs.push(`data-keyword="${escapeAttr(knowledge.hdGate.keyword)}"`);
        attrs.push(`data-harmonic-gate="${knowledge.hdGate.harmonicGate || ''}"`);
        attrs.push(`data-channel="${escapeAttr(knowledge.hdGate.channel || '')}"`);
      }

      // Gene Keys attributes
      if (knowledge.geneKey) {
        attrs.push(`data-shadow="${escapeAttr(knowledge.geneKey.shadow)}"`);
        attrs.push(`data-gift="${escapeAttr(knowledge.geneKey.gift)}"`);
        attrs.push(`data-siddhi="${escapeAttr(knowledge.geneKey.siddhi)}"`);
      }

      // I Ching attributes
      if (knowledge.iching) {
        attrs.push(`data-iching="${escapeAttr(knowledge.iching.ichingName)}"`);
        attrs.push(`data-chinese="${escapeAttr(knowledge.iching.chineseName)}"`);
      }

      // Codon Ring attributes
      if (knowledge.codonRing) {
        attrs.push(`data-codon-ring="${escapeAttr(knowledge.codonRing.ring)}"`);
        attrs.push(`data-amino-acid="${escapeAttr(knowledge.codonRing.aminoAcid)}"`);
      }
    }

    // Geometry attributes
    attrs.push(`cx="${cx}"`);
    attrs.push(`cy="${cy}"`);
    attrs.push(`r="${r}"`);
    attrs.push(`fill="${COLORS.gateFill}"`);
    attrs.push(`stroke="${COLORS.gateStroke}"`);
    attrs.push(`stroke-width="${STROKES.gate}"`);

    gates.push(`      <circle\n         ${attrs.join('\n         ')}/>`);
  }

  return gates.join('\n');
}

/**
 * Generate center outlines and definitions with full V3 knowledge attributes
 */
function generateCenterShapes() {
  const elements = [];

  // Generate outline for each center
  for (const [centerName, shapeData] of Object.entries(GEOMETRY.centers.shapes)) {
    const knowledge = getCenterKnowledge(centerName);

    // Build rich center attributes
    const attrs = [];
    attrs.push(`id="SYMBOL_-_CENTRE_-_${centerName}"`);
    attrs.push(`data-name="SYMBOL - CENTRE - ${centerName}"`);
    attrs.push(`data-center="${centerName}"`);

    if (knowledge) {
      attrs.push(`data-theme="${escapeAttr(knowledge.theme || '')}"`);
      attrs.push(`data-biological="${escapeAttr(knowledge.biologicalCorrelation || '')}"`);
      attrs.push(`data-function="${escapeAttr(knowledge.function || '')}"`);
      if (knowledge.definedMeaning) {
        attrs.push(`data-defined="${escapeAttr(knowledge.definedMeaning)}"`);
      }
      if (knowledge.undefinedMeaning) {
        attrs.push(`data-undefined="${escapeAttr(knowledge.undefinedMeaning)}"`);
      }
    }

    // Get gate count for this center
    const gateCount = (GEOMETRY.centers.gateAssignments[centerName] || []).length;
    attrs.push(`data-gate-count="${gateCount}"`);

    attrs.push(`d="${shapeData.d}"`);
    if (shapeData.transform) {
      attrs.push(`transform="${shapeData.transform}"`);
    }
    attrs.push(`fill="${COLORS.centerFill}"`);
    attrs.push(`stroke="${COLORS.centerStroke}"`);
    attrs.push(`stroke-miterlimit="10"`);
    attrs.push(`stroke-width="${STROKES.centerOutline}"`);

    elements.push(`    <path\n       ${attrs.join('\n       ')}/>`);
  }

  return elements.join('\n');
}

/**
 * Generate center definitions (inner markers) - solid white filled
 */
function generateCenterDefinitions() {
  const elements = [];

  for (const [centerName, defData] of Object.entries(GEOMETRY.centers.definitions)) {
    elements.push(`    <path
       id="SYMBOL_-_DEFINITION_-_${centerName}"
       data-name="SYMBOL - DEFINITION - ${centerName}"
       data-center="${centerName}"
       d="${defData.d}"
       ${defData.transform ? `transform="${defData.transform}"` : ''}
       fill="${COLORS.foreground}"
       stroke="none"/>`);
  }

  return elements.join('\n');
}

/**
 * Generate all centers with their gates
 */
function generateCenters() {
  const centerGroups = [];
  const gateAssignments = GEOMETRY.centers.gateAssignments;

  for (const [centerName, gateNumbers] of Object.entries(gateAssignments)) {
    if (gateNumbers.length === 0) continue;

    centerGroups.push(`    <g id="GROUP_-_${centerName}" data-name="GROUP - ${centerName}">
${generateCenterGates(centerName, gateNumbers)}
    </g>`);
  }

  return `  <g id="GROUP_-_CENTRES" data-name="GROUP - CENTRES">
    <g id="GROUP_-_OUTLINES" data-name="GROUP - OUTLINES">
${generateCenterShapes()}
    </g>
    <g id="GROUP_-_DEFINITIONS" data-name="GROUP - DEFINITIONS">
${generateCenterDefinitions()}
    </g>
    <g id="GROUP_-_GATES" data-name="GROUP - GATES">
${centerGroups.join('\n')}
    </g>
  </g>`;
}

/**
 * Generate the SVG footer
 */
function generateFooter() {
  return `</svg>`;
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

/**
 * Generate complete bodygraph SVG
 *
 * @param {Object} options - Generation options
 * @param {boolean} options.includeConnectors - Include outer connector lines (default: true)
 * @param {boolean} options.includeGateDots - Include gate dots (default: true)
 * @returns {string} Complete SVG markup
 */
function generateBodygraph(options = {}) {
  const {
    includeConnectors = true,
    includeGateDots = true
  } = options;

  const sections = [generateHeader()];

  // Outer connectors layer (behind everything)
  if (includeConnectors) {
    sections.push(`  <g id="THE_BODYGRAPH_-_CONNECTORS" data-name="THE BODYGRAPH - CONNECTORS">`);
    sections.push(generateDirectConnectors());
    sections.push(generateCurvedConnectors());
    if (includeGateDots) {
      sections.push(generateGateDots());
    }
    sections.push(`  </g>`);
  }

  // Main bodygraph layer
  // Order: Channels first (behind), then centers on top (in front)
  sections.push(`  <g id="THE_BODYGRAPH" data-name="THE BODYGRAPH">`);
  sections.push(generateChannels());
  sections.push(generateCenters());
  sections.push(`  </g>`);

  sections.push(generateFooter());

  return sections.join('\n');
}

/**
 * Generate and save bodygraph SVG to file
 *
 * @param {string} outputPath - Path to output file
 * @param {Object} options - Generation options
 */
function generateAndSave(outputPath, options = {}) {
  const svg = generateBodygraph(options);
  fs.writeFileSync(outputPath, svg);
  console.log(`Generated bodygraph SVG: ${outputPath}`);
  return svg;
}

// ============================================================================
// CLI EXECUTION
// ============================================================================

if (require.main === module) {
  const outputPath = path.join(__dirname, '../output/generated-bodygraph.svg');
  generateAndSave(outputPath);

  // Validation
  const gates = Object.keys(GEOMETRY.gates).length;
  const channels = Object.keys(GEOMETRY.channels).length;
  const centers = Object.keys(GEOMETRY.centers.shapes).length;

  console.log(`\nValidation:`);
  console.log(`  Gates: ${gates}`);
  console.log(`  Channels: ${channels}`);
  console.log(`  Centers: ${centers}`);
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  generateBodygraph,
  generateAndSave,
  getGateKnowledge,
  GEOMETRY,
  COLORS,
  STROKES,
  CIRCUITS,
  GATE_KNOWLEDGE
};
