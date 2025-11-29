/**
 * Incarnation Crosses Ring Generator
 *
 * Generates the 192 incarnation crosses ring SVG with three concentric text bands:
 * - Inner: RAX (Right Angle Crosses) - 64 crosses
 * - Middle: JX (Juxtaposition Crosses) - 64 crosses
 * - Outer: LAX (Left Angle Crosses) - 64 crosses
 *
 * Each cross displays:
 * - Line 1: Type prefix (Jx, Rax, Lax)
 * - Line 2: Cross name
 * - Line 3: Gate numbers (PS/PE - DS/DE)
 *
 * All data sourced from crosses-display-mappings.json (extracted from master SVG).
 *
 * METHODOLOGY (see docs/reference/SVG-GENERATION-METHODOLOGY.md):
 * - Use first-principles formulas, not per-quadrant adjustments
 * - Single rotation formula works for ALL 192 crosses: svgAngle + 90
 * - Extract geometry from master SVG, generate transforms from principles
 */

const positioning = require('../../core/root-system/positioning-algorithm');
const shared = require('./shared-constants');

// Load crosses display mapping
const crossesData = require('../../knowledge-systems/incarnation-crosses/mappings/crosses-display-mappings.json');

// Ring geometry (extracted from verified master: the-192-crosses-verified-master.svg)
const CENTER = { x: 2269.7216, y: 2269.9519 };

// Four concentric ring boundaries
const RING_RADII = {
  bottom: 2000.1011,      // Innermost boundary
  lowerInner: 2086.5709,  // Between RAX and JX
  upperInner: 2177.8085,  // Between JX and LAX
  top: 2266.954           // Outermost boundary
};

// Three text bands (from center outward)
const BANDS = {
  rax: {
    innerRadius: RING_RADII.bottom,
    outerRadius: RING_RADII.lowerInner,
    get midRadius() { return (this.innerRadius + this.outerRadius) / 2; },
    get bandWidth() { return this.outerRadius - this.innerRadius; }
  },
  jx: {
    innerRadius: RING_RADII.lowerInner,
    outerRadius: RING_RADII.upperInner,
    get midRadius() { return (this.innerRadius + this.outerRadius) / 2; },
    get bandWidth() { return this.outerRadius - this.innerRadius; }
  },
  lax: {
    innerRadius: RING_RADII.upperInner,
    outerRadius: RING_RADII.top,
    get midRadius() { return (this.innerRadius + this.outerRadius) / 2; },
    get bandWidth() { return this.outerRadius - this.innerRadius; }
  }
};

// Font specifications (from master analysis)
const FONT = {
  family: 'Copperplate-Bold, Copperplate',
  weight: 700,
  jx: {
    size: 25.48,     // Jx uses slightly larger font
    lineHeight: 24.5
  },
  rax: {
    size: 23.44,     // Rax/Lax use smaller font
    lineHeight: 22.5
  },
  lax: {
    size: 23.44,
    lineHeight: 22.5
  },
  verticalScale: 1.0  // No vertical scaling on crosses
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
 * Calculate SVG position for a cross at specified radius
 */
function calculatePosition(v3Angle, radius) {
  return shared.calculatePosition(v3Angle, radius, CENTER);
}

/**
 * Get display prefix for cross type
 */
function getDisplayPrefix(type) {
  switch (type) {
    case 'JX': return 'Jx';
    case 'RAX': return 'Rax';
    case 'LAX': return 'Lax';
    default: return type;
  }
}

/**
 * Format gate numbers for display
 */
function formatGates(cross) {
  return `${cross.personalitySun}/${cross.personalityEarth} - ${cross.designSun}/${cross.designEarth}`;
}

/**
 * Generate SVG for a single cross text element
 * @param {Object} cross - Cross data object
 * @param {string} bandType - 'jx', 'rax', or 'lax'
 */
function generateCrossElement(cross, bandType) {
  const band = BANDS[bandType];
  const fontConfig = FONT[bandType];

  // Get the wheel position from the personality sun gate
  const v3Data = positioning.getDockingData(cross.personalitySun, 1);
  const position = calculatePosition(v3Data.angle, band.midRadius);
  const rotation = calculateRotation(position.svgAngle);

  const prefix = getDisplayPrefix(cross.type);
  const gates = formatGates(cross);

  // Three-line layout: prefix, name, gates
  // Use tspan elements for each line
  const lineHeight = fontConfig.lineHeight;

  return `    <text
       data-cross-type="${cross.type}"
       data-cross-name="${cross.name}"
       data-personality-sun="${cross.personalitySun}"
       data-personality-earth="${cross.personalityEarth}"
       data-design-sun="${cross.designSun}"
       data-design-earth="${cross.designEarth}"
       transform="translate(${position.x.toFixed(4)} ${position.y.toFixed(4)}) rotate(${rotation.toFixed(4)})"
       font-size="${fontConfig.size.toFixed(4)}"
       font-family="${FONT.family}"
       font-weight="${FONT.weight}"
       text-anchor="middle"
       dominant-baseline="central"
       stroke="none"
       style="isolation: isolate">${prefix}<tspan x="0" dy="${lineHeight}">${cross.name}</tspan><tspan x="0" dy="${lineHeight}">${gates}</tspan></text>`;
}

/**
 * Generate ring circles (boundaries between bands)
 */
function generateRingCircles(stroke, strokeWidth) {
  return `    <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${RING_RADII.bottom}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${RING_RADII.lowerInner}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${RING_RADII.upperInner}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${RING_RADII.top}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

/**
 * Generate divider lines for 64 segments
 * Note: Dividers span all three bands
 */
function generateDividers(stroke, strokeWidth) {
  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
  let dividers = '';

  for (const gate of gateSequence) {
    const v3Data = positioning.getDockingData(gate, 1);
    const angle = v3Data.angle;

    // Divider at start of gate segment (offset by half segment width)
    const dividerAngle = angle - 2.8125; // Half of 5.625 degree segment

    // Inner point (at innermost ring)
    const innerPos = calculatePosition(dividerAngle, RING_RADII.bottom);
    // Outer point (at outermost ring)
    const outerPos = calculatePosition(dividerAngle, RING_RADII.top);

    dividers += `    <line x1="${innerPos.x.toFixed(4)}" y1="${innerPos.y.toFixed(4)}" x2="${outerPos.x.toFixed(4)}" y2="${outerPos.y.toFixed(4)}" stroke="${stroke}" stroke-width="${strokeWidth}"/>\n`;
  }

  return dividers;
}

/**
 * Generate the complete incarnation crosses ring SVG
 */
function generateIncarnationCrossesRing(options = {}) {
  const {
    includeStructure = true,
    includeBackground = true,
    stroke = COLORS.foreground,
    fill = COLORS.foreground,
    backgroundColor = COLORS.background,
    strokeWidth = 1
  } = options;

  const viewBoxSize = CENTER.x * 2;

  let svg = `<svg id="192_INCARNATION_CROSSES" xmlns="http://www.w3.org/2000/svg"
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
    svg += generateRingCircles(stroke, strokeWidth) + '\n';
    svg += `    </g>\n`;
    svg += `    <g id="DIVIDERS">\n`;
    svg += generateDividers(stroke, strokeWidth);
    svg += `    </g>\n`;
    svg += `  </g>\n`;
  }

  // Group crosses by type
  const jxCrosses = crossesData.crosses.filter(c => c.type === 'JX');
  const raxCrosses = crossesData.crosses.filter(c => c.type === 'RAX');
  const laxCrosses = crossesData.crosses.filter(c => c.type === 'LAX');

  // RAX ring (innermost text band)
  svg += `  <g id="GROUP_64_RAX" fill="${fill}">\n`;
  for (const cross of raxCrosses) {
    svg += generateCrossElement(cross, 'rax') + '\n';
  }
  svg += `  </g>\n`;

  // JX ring (middle text band)
  svg += `  <g id="GROUP_64_JX" fill="${fill}">\n`;
  for (const cross of jxCrosses) {
    svg += generateCrossElement(cross, 'jx') + '\n';
  }
  svg += `  </g>\n`;

  // LAX ring (outermost text band)
  svg += `  <g id="GROUP_64_LAX" fill="${fill}">\n`;
  for (const cross of laxCrosses) {
    svg += generateCrossElement(cross, 'lax') + '\n';
  }
  svg += `  </g>\n`;

  svg += `</svg>`;

  return svg;
}

/**
 * Get a cross by type and personality sun gate
 */
function getCross(type, personalitySun) {
  return crossesData.crosses.find(c =>
    c.type === type && c.personalitySun === personalitySun
  );
}

/**
 * Get all crosses for a personality sun gate position
 */
function getCrossesAtPosition(personalitySun) {
  return {
    jx: getCross('JX', personalitySun),
    rax: getCross('RAX', personalitySun),
    lax: getCross('LAX', personalitySun)
  };
}

// Export
module.exports = {
  CENTER,
  RING_RADII,
  BANDS,
  FONT,
  COLORS,
  crossesData,
  calculateSVGAngle,
  calculateRotation,
  calculatePosition,
  getDisplayPrefix,
  formatGates,
  generateCrossElement,
  generateIncarnationCrossesRing,
  getCross,
  getCrossesAtPosition
};

// CLI: node incarnation-crosses-ring.js [output.svg]
if (require.main === module) {
  const fs = require('fs');
  const output = process.argv[2] || 'generated-incarnation-crosses-ring.svg';

  console.log('Generating incarnation crosses ring...');
  const svg = generateIncarnationCrossesRing();

  fs.writeFileSync(output, svg);
  console.log('Written to:', output);
  console.log('Total crosses:', crossesData.statistics.totalCrosses);
}
