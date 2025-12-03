/**
 * Gene Keys Ring Generator
 *
 * Generates the 64 Gene Keys ring SVG with three concentric bands:
 * - Inner: Shadows (shadow frequency)
 * - Middle: Gifts (gift frequency)
 * - Outer: Siddhis (siddhi frequency)
 *
 * All data sourced from V3 knowledge engine (gene-keys-mappings.json).
 *
 * METHODOLOGY (see docs/reference/SVG-GENERATION-METHODOLOGY.md):
 * - Use first-principles formulas, not per-quadrant adjustments
 * - Single rotation formula works for ALL 64 gates: svgAngle + 90
 * - Extract geometry from master SVG, generate transforms from principles
 */

const positioning = require('../../core/root-system/positioning-algorithm');
const engine = require('../../unified-query-engine');
const shared = require('./shared-constants');

// Ring geometry (extracted from verified master: 64-gene-keys-verified-master.svg)
// Center point is the same for all three bands
const CENTER = { x: 1985.3602, y: 1985.3602 };

// Three concentric rings for Shadow, Gift, Siddhi
// Expanded by ~3.5px each side for more breathing room around text
const RINGS = {
  shadows: {
    innerRadius: 1727,      // was 1730.5472, -3.5px
    outerRadius: 1786,      // was 1782.4786, +3.5px
    get midRadius() { return (this.innerRadius + this.outerRadius) / 2; },
    get bandWidth() { return this.outerRadius - this.innerRadius; }
  },
  gifts: {
    innerRadius: 1788,      // was 1784.2557, +3.5px (keeps 2px gap from shadows)
    outerRadius: 1847,      // was 1835.9456, +11px
    get midRadius() { return (this.innerRadius + this.outerRadius) / 2; },
    get bandWidth() { return this.outerRadius - this.innerRadius; }
  },
  siddhis: {
    innerRadius: 1849,      // was 1837.7815, +11px (keeps 2px gap from gifts)
    outerRadius: 1908,      // was 1889.9038, +18px
    get midRadius() { return (this.innerRadius + this.outerRadius) / 2; },
    get bandWidth() { return this.outerRadius - this.innerRadius; }
  }
};

// Outer radius of the complete ring (for SVG viewBox)
const OUTER_RADIUS = RINGS.siddhis.outerRadius;

// Font specifications (from master analysis)
// Font sizes scaled up by 8% for better visibility
const FONT = {
  family: 'Copperplate, Copperplate-Light',
  weight: 400,
  shadows: {
    standard: 22.98,  // 21.276 * 1.08
  },
  gifts: {
    standard: 22.93,  // 21.2335 * 1.08
  },
  siddhis: {
    standard: 22.95,  // 21.2493 * 1.08
  },
  verticalScale: 1.2,
  lineHeight: 16.31  // 15.1 * 1.08
};

// Use shared color scheme
const COLORS = shared.COLORS;

/**
 * Calculate SVG position angle from V3 angle
 */
function calculateSVGAngle(v3Angle) {
  return shared.calculateSVGAngle(v3Angle);
}

/**
 * Calculate text rotation for readability
 */
function calculateRotation(svgAngle) {
  return shared.calculateRotation(svgAngle);
}

/**
 * Calculate SVG position for a gate at specified radius
 */
function calculatePosition(v3Angle, radius) {
  return shared.calculatePosition(v3Angle, radius, CENTER);
}

/**
 * Split long words for display
 * Some Gene Keys names need to be split to fit in the ring band.
 * Splits match the verified master SVG exactly.
 *
 * NOTE: V3 data uses hyphens (e.g., "Half-Heartedness") while master
 * displays as two lines. This function handles both formats.
 */
function splitForDisplay(text) {
  // Known splits from master SVG (keyed by V3 data format)
  const splits = {
    // Shadow splits
    'Self-Obsession': ['Self', 'Obsession'],
    'Dissatisfaction': ['Dis', 'satisfaction'],
    'Co-Dependence': ['Co', 'Dependence'],
    'Half-Heartedness': ['Half', 'Heartedness'],
    'Purposelessness': ['Purposeless', 'ness'],
    'Superficiality': ['Super', 'ficiality'],

    // Gift splits
    'Far-Sightedness': ['Far', 'Sightedness'],
    'Transmutation': ['Trans', 'mutation'],
    'Resourcefulness': ['Resource', 'fulness'],
    'Self Assurance': ['Self', 'assurance'],
    'Graciousness': ['Gracious', 'ness'],
    'Mindfulness': ['Mindful', 'ness'],

    // Siddhi splits
    'Transfiguration': ['Trans', 'figuration'],
    'Superabundance': ['Super', 'abundance'],
    'Universal Love': ['Universal', 'Love'],
    'Forgiveness': ['Forgive', 'ness'],
    'Exquisiteness': ['Exquisite', 'ness'],
    'Bounteousness': ['Bounteous', 'ness'],
    'Boundlessness': ['Boundless', 'ness'],
    'Selflessness': ['Selfless', 'ness'],

    // Two-word phrases that stay on one line
    'Divine Will': ['Divine Will']
  };

  if (splits[text]) {
    return splits[text];
  }

  // If text is a single word longer than 13 chars, might need splitting
  // But most Gene Keys are single words that fit
  return [text];
}

/**
 * Generate SVG for a single Gene Key text element
 * @param {number} gateNumber - Gate number (1-64)
 * @param {string} ringType - 'shadows', 'gifts', or 'siddhis'
 */
function generateTextElement(gateNumber, ringType) {
  const knowledge = engine.getGateKnowledge(gateNumber);
  const geneKeys = knowledge.geneKeys;

  if (!geneKeys) {
    console.warn(`No Gene Keys data for gate ${gateNumber}`);
    return '';
  }

  // Get the appropriate text based on ring type
  let text;
  switch (ringType) {
    case 'shadows':
      text = geneKeys.shadow;
      break;
    case 'gifts':
      text = geneKeys.gift;
      break;
    case 'siddhis':
      text = geneKeys.siddhi;
      break;
    default:
      throw new Error(`Unknown ring type: ${ringType}`);
  }

  if (!text) {
    console.warn(`No ${ringType} data for gate ${gateNumber}`);
    return '';
  }

  const ring = RINGS[ringType];
  const fontSize = FONT[ringType].standard;

  const v3Data = positioning.getDockingData(gateNumber, 1);
  const position = calculatePosition(v3Data.angle, ring.midRadius);
  const rotation = calculateRotation(position.svgAngle);

  const lines = splitForDisplay(text);

  // Generate tspan elements for multi-line text
  let content;
  if (lines.length === 1) {
    content = lines[0];
  } else {
    // Calculate vertical offset to center text block
    const totalHeight = (lines.length - 1) * FONT.lineHeight;
    const startY = -totalHeight / 2;

    content = lines.map((line, i) => {
      const dy = i === 0 ? startY : FONT.lineHeight;
      // For second line, calculate x offset to center it
      // This is approximate - master uses specific x values
      const xOffset = i > 0 ? 0 : 0;
      return `<tspan x="${xOffset}" dy="${dy.toFixed(2)}">${line}</tspan>`;
    }).join('');
  }

  return `    <text
       data-gate="${gateNumber}"
       data-${ringType.slice(0, -1)}="${text}"
       transform="translate(${position.x.toFixed(4)} ${position.y.toFixed(4)}) rotate(${rotation.toFixed(4)}) scale(1 ${FONT.verticalScale})"
       font-size="${fontSize.toFixed(4)}"
       font-family="${FONT.family}"
       font-weight="${FONT.weight}"
       text-anchor="middle"
       dominant-baseline="central"
       stroke="none"
       style="isolation: isolate">${content}</text>`;
}

/**
 * Generate ring circles (inner and outer boundaries)
 */
function generateRingCircles(ringType, stroke, strokeWidth) {
  const ring = RINGS[ringType];
  return `    <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${ring.innerRadius}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${ring.outerRadius}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

/**
 * Generate divider lines for 64 segments
 */
function generateDividers(stroke, strokeWidth) {
  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
  let dividers = '';

  for (const gate of gateSequence) {
    const v3Data = positioning.getDockingData(gate, 1);
    const angle = v3Data.angle;

    // Divider at start of gate segment (offset by half segment width)
    const dividerAngle = angle - 2.8125; // Half of 5.625 degree segment

    // Inner point (at shadows inner radius)
    const innerPos = calculatePosition(dividerAngle, RINGS.shadows.innerRadius);
    // Outer point (at siddhis outer radius)
    const outerPos = calculatePosition(dividerAngle, RINGS.siddhis.outerRadius);

    dividers += `    <line x1="${innerPos.x.toFixed(4)}" y1="${innerPos.y.toFixed(4)}" x2="${outerPos.x.toFixed(4)}" y2="${outerPos.y.toFixed(4)}" stroke="${stroke}" stroke-width="${strokeWidth}"/>\n`;
  }

  return dividers;
}

/**
 * Generate the complete Gene Keys ring SVG
 */
function generateGeneKeysRing(options = {}) {
  const {
    includeStructure = true,
    includeBackground = true,
    stroke = COLORS.foreground,
    fill = COLORS.foreground,
    backgroundColor = COLORS.background,
    strokeWidth = 1
  } = options;

  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;

  const viewBoxSize = CENTER.x * 2;

  let svg = `<svg id="64_GENE_KEYS" xmlns="http://www.w3.org/2000/svg"
     width="${viewBoxSize.toFixed(4)}"
     height="${viewBoxSize.toFixed(4)}"
     viewBox="0 0 ${viewBoxSize.toFixed(4)} ${viewBoxSize.toFixed(4)}">
`;

  // Background
  if (includeBackground) {
    svg += `  <rect id="background" width="100%" height="100%" fill="${backgroundColor}"/>\n`;
  }

  // Structure (ring circles and dividers)
  if (includeStructure) {
    svg += `  <g id="STRUCTURE">\n`;
    svg += `    <g id="RINGS">\n`;
    svg += `      <g id="RINGS_SHADOWS">\n`;
    svg += generateRingCircles('shadows', stroke, strokeWidth) + '\n';
    svg += `      </g>\n`;
    svg += `      <g id="RINGS_GIFTS">\n`;
    svg += generateRingCircles('gifts', stroke, strokeWidth) + '\n';
    svg += `      </g>\n`;
    svg += `      <g id="RINGS_SIDDHIS">\n`;
    svg += generateRingCircles('siddhis', stroke, strokeWidth) + '\n';
    svg += `      </g>\n`;
    svg += `    </g>\n`;
    svg += `    <g id="DIVIDERS">\n`;
    svg += generateDividers(stroke, strokeWidth);
    svg += `    </g>\n`;
    svg += `  </g>\n`;
  }

  // Shadow ring (innermost)
  svg += `  <g id="GROUP_64_SHADOWS" fill="${fill}">\n`;
  for (const gateNumber of gateSequence) {
    svg += generateTextElement(gateNumber, 'shadows') + '\n';
  }
  svg += `  </g>\n`;

  // Gift ring (middle)
  svg += `  <g id="GROUP_64_GIFTS" fill="${fill}">\n`;
  for (const gateNumber of gateSequence) {
    svg += generateTextElement(gateNumber, 'gifts') + '\n';
  }
  svg += `  </g>\n`;

  // Siddhi ring (outermost)
  svg += `  <g id="GROUP_64_SIDDHIS" fill="${fill}">\n`;
  for (const gateNumber of gateSequence) {
    svg += generateTextElement(gateNumber, 'siddhis') + '\n';
  }
  svg += `  </g>\n`;

  svg += `</svg>`;

  return svg;
}

// Export
module.exports = {
  CENTER,
  RINGS,
  FONT,
  COLORS,
  calculateSVGAngle,
  calculateRotation,
  calculatePosition,
  splitForDisplay,
  generateTextElement,
  generateGeneKeysRing
};

// CLI: node gene-keys-ring.js [output.svg]
if (require.main === module) {
  const fs = require('fs');
  const output = process.argv[2] || 'generated-gene-keys-ring.svg';

  console.log('Generating Gene Keys ring...');
  const svg = generateGeneKeysRing();

  fs.writeFileSync(output, svg);
  console.log('Written to:', output);
}
