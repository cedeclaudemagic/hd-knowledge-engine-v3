/**
 * Numbers Ring Generator
 *
 * Generates the 64 gate numbers ring SVG from V3 knowledge engine data.
 * Extracted geometry and font specs from verified master SVG.
 *
 * CRITICAL CONVENTIONS (see docs/reference/CRITICAL-ORIENTATION.md):
 * - Gate numbers positioned around wheel per V3 positioning algorithm
 * - Text rotated for readability (tangent to circle)
 *
 * METHODOLOGY (see docs/reference/SVG-GENERATION-METHODOLOGY.md):
 * - Use first-principles formulas, not per-quadrant adjustments
 * - Single rotation formula works for ALL 64 gates: svgAngle + 90
 * - Extract geometry from master SVG, generate transforms from principles
 */

const positioning = require('../../core/root-system/positioning-algorithm');
const shared = require('./shared-constants');

// Ring geometry (extracted from verified master)
const RING = {
  center: { x: 1657.7978, y: 1657.4867 },
  innerRadius: 1538.587,
  outerRadius: 1648.5514,
  get midRadius() { return (this.innerRadius + this.outerRadius) / 2; },
  get bandWidth() { return this.outerRadius - this.innerRadius; }
};

// Font specifications (extracted from verified master)
const FONT = {
  family: 'Herculanum',
  size: 117.1932
};

// Use shared color scheme
const COLORS = shared.COLORS;

// Text positioning radius from center
// The master SVG has text anchors at ~1562.55 from center (left-aligned text).
// With our centered text (text-anchor="middle"), we position at mid-radius
// which places the text visually centered in the band.
const TEXT_RADIUS = RING.midRadius;

// Position offset: aligns V3 angles to SVG wheel positions
// Same as hexagram ring - the wheel alignment is consistent
const POSITION_OFFSET = 323.4375;

// Line position correction: V3 positioning uses 1-indexed lines, but line 1
// should START at the gate boundary. This offset corrects for that.
const LINE_START_OFFSET = 0.9375;  // +1 line arc

/**
 * Calculate SVG position angle from V3 angle
 * Same formula as hexagram ring - maintains wheel consistency
 * Includes LINE_START_OFFSET to correct for 1-indexed line positions
 */
function calculateSVGAngle(v3Angle) {
  return -v3Angle - 90 + POSITION_OFFSET + LINE_START_OFFSET;
}

/**
 * Calculate text rotation for readability
 *
 * First principles:
 * - Text should be readable (tangent to the circle)
 * - svgAngle + 90 makes text perpendicular to the radial direction
 * - This is the same formula as hexagram rotation (by coincidence of geometry)
 *
 * This single formula works for ALL 64 gates - no quadrant adjustments needed.
 */
function calculateRotation(svgAngle) {
  return svgAngle + 90;
}

/**
 * Calculate SVG position for a gate number
 * @param {number} v3Angle - Angle from V3 positioning (0° = top, clockwise)
 * @param {number} radius - Distance from center (default: TEXT_RADIUS)
 */
function calculatePosition(v3Angle, radius = TEXT_RADIUS) {
  const svgAngle = calculateSVGAngle(v3Angle);
  const radians = svgAngle * Math.PI / 180;

  return {
    x: RING.center.x + radius * Math.cos(radians),
    y: RING.center.y + radius * Math.sin(radians),
    svgAngle: svgAngle
  };
}

/**
 * Generate a divider line between two adjacent gates
 * Dividers extend from just inside the inner ring to just outside the outer ring
 */
function generateDividerLine(gateA, gateB, stroke) {
  const v3DataA = positioning.getDockingData(gateA, 1);
  const v3DataB = positioning.getDockingData(gateB, 1);

  // Divider is at the midpoint angle between the two gates
  const angleA = v3DataA.angle;
  const angleB = v3DataB.angle;

  // Handle wraparound (e.g., between gate at 354° and gate at 0°)
  let midAngle;
  if (Math.abs(angleB - angleA) > 180) {
    // Wraparound case
    midAngle = ((angleA + angleB + 360) / 2) % 360;
  } else {
    midAngle = (angleA + angleB) / 2;
  }

  const svgAngle = calculateSVGAngle(midAngle);
  const radians = svgAngle * Math.PI / 180;

  // Dividers extend slightly beyond the ring band
  const innerExtent = RING.innerRadius + 2;  // Just inside inner ring
  const outerExtent = RING.outerRadius - 2;  // Just inside outer ring

  const x1 = RING.center.x + outerExtent * Math.cos(radians);
  const y1 = RING.center.y + outerExtent * Math.sin(radians);
  const x2 = RING.center.x + innerExtent * Math.cos(radians);
  const y2 = RING.center.y + innerExtent * Math.sin(radians);

  return `      <line id="LINE_-_${gateA}_${gateB}" x1="${x1.toFixed(4)}" y1="${y1.toFixed(4)}" x2="${x2.toFixed(4)}" y2="${y2.toFixed(4)}" fill="none" stroke="${stroke}" stroke-miterlimit="10"/>`;
}

/**
 * Generate all 64 divider lines
 */
function generateDividers(stroke) {
  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
  const lines = [];

  for (let i = 0; i < gateSequence.length; i++) {
    const gateA = gateSequence[i];
    const gateB = gateSequence[(i + 1) % gateSequence.length];
    lines.push(generateDividerLine(gateA, gateB, stroke));
  }

  return lines.join('\n');
}

/**
 * Generate SVG for a single gate number
 *
 * Note: We use text-anchor="middle" and dominant-baseline="central"
 * to center text on the calculated position. The master SVG from
 * Illustrator uses left-aligned text with manual position adjustments,
 * so positions won't match exactly, but the visual result is equivalent.
 */
function generateNumberElement(gateNumber) {
  const v3Data = positioning.getDockingData(gateNumber, 1);
  const position = calculatePosition(v3Data.angle);
  const rotation = calculateRotation(position.svgAngle);

  // Use translate + rotate transform with centered text anchor
  // stroke="none" ensures no outline on text, isolation:isolate matches master
  return `  <text
     data-gate="${gateNumber}"
     transform="translate(${position.x.toFixed(4)} ${position.y.toFixed(4)}) rotate(${rotation.toFixed(4)})"
     font-size="${FONT.size}"
     font-family="${FONT.family}"
     text-anchor="middle"
     dominant-baseline="central"
     stroke="none"
     style="isolation: isolate">${gateNumber}</text>`;
}

/**
 * Generate the complete numbers ring SVG
 */
function generateNumbersRing(options = {}) {
  const {
    includeStructure = true,
    includeBackground = true,
    stroke = COLORS.foreground,
    fill = COLORS.foreground,
    backgroundColor = COLORS.background,
    strokeWidth = 0.5
  } = options;

  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;

  const viewBoxWidth = RING.center.x * 2;
  const viewBoxHeight = RING.center.y * 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg"
     width="${viewBoxWidth.toFixed(4)}"
     height="${viewBoxHeight.toFixed(4)}"
     viewBox="0 0 ${viewBoxWidth.toFixed(4)} ${viewBoxHeight.toFixed(4)}">
`;

  // Add background rectangle if requested
  if (includeBackground) {
    svg += `  <rect id="background" width="100%" height="100%" fill="${backgroundColor}"/>\n`;
  }

  // Add structure (rings and dividers) if requested
  if (includeStructure) {
    svg += `  <g id="STRUCTURE">
    <g id="RINGS">
      <circle id="RING_-_INNER" cx="${RING.center.x}" cy="${RING.center.y}" r="${RING.innerRadius}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${strokeWidth}"/>
      <circle id="RING_-_OUTER" cx="${RING.center.x}" cy="${RING.center.y}" r="${RING.outerRadius}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${strokeWidth}"/>
    </g>
    <g id="DIVIDERS">
${generateDividers(stroke)}
    </g>
  </g>
`;
  }

  // Add gate numbers
  svg += `  <g id="GATE_NUMBERS" fill="${fill}">\n`;

  for (const gateNumber of gateSequence) {
    svg += generateNumberElement(gateNumber) + '\n';
  }

  svg += `  </g>\n</svg>`;

  return svg;
}

/**
 * Group gates by trigram for organized output (matches master SVG structure)
 */
function generateNumbersRingByTrigram(options = {}) {
  const {
    includeStructure = true,
    stroke = '#000',
    fill = '#000',
    strokeWidth = 0.5
  } = options;

  // Trigram groups from master SVG (gates grouped by lower trigram)
  const trigramGroups = {
    HEAVEN: [1, 43, 14, 34, 9, 5, 26, 11],
    LAKE: [10, 58, 38, 54, 61, 60, 41, 19],
    FIRE: [13, 49, 30, 55, 37, 63, 22, 36],
    THUNDER: [25, 17, 21, 51, 42, 3, 27, 24],
    WIND: [46, 18, 48, 57, 32, 50, 28, 44],
    WATER: [7, 4, 29, 59, 40, 64, 47, 6],
    MOUNTAIN: [15, 52, 39, 53, 62, 56, 31, 33],
    EARTH: [12, 45, 35, 16, 20, 8, 23, 2]
  };

  const viewBoxWidth = RING.center.x * 2;
  const viewBoxHeight = RING.center.y * 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg"
     width="${viewBoxWidth.toFixed(4)}"
     height="${viewBoxHeight.toFixed(4)}"
     viewBox="0 0 ${viewBoxWidth.toFixed(4)} ${viewBoxHeight.toFixed(4)}">
`;

  // Add structure
  if (includeStructure) {
    svg += `  <g id="STRUCTURE">
    <g id="RINGS">
      <circle id="RING_-_INNER" cx="${RING.center.x}" cy="${RING.center.y}" r="${RING.innerRadius}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${strokeWidth}"/>
      <circle id="RING_-_OUTER" cx="${RING.center.x}" cy="${RING.center.y}" r="${RING.outerRadius}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${strokeWidth}"/>
    </g>
  </g>
`;
  }

  // Add numbers grouped by trigram
  svg += `  <g id="GATE_NUMBERS" fill="${fill}">\n`;

  for (const [trigram, gates] of Object.entries(trigramGroups)) {
    svg += `    <g id="${trigram}">\n`;
    for (const gateNumber of gates) {
      svg += '  ' + generateNumberElement(gateNumber) + '\n';
    }
    svg += `    </g>\n`;
  }

  svg += `  </g>\n</svg>`;

  return svg;
}

// Export
module.exports = {
  RING,
  FONT,
  COLORS,
  TEXT_RADIUS,
  calculateSVGAngle,
  calculateRotation,
  calculatePosition,
  generateDividerLine,
  generateDividers,
  generateNumberElement,
  generateNumbersRing,
  generateNumbersRingByTrigram
};

// CLI: node numbers-ring.js [output.svg]
if (require.main === module) {
  const fs = require('fs');
  const output = process.argv[2] || 'generated-numbers-ring.svg';

  console.log('Generating numbers ring...');
  const svg = generateNumbersRing();

  fs.writeFileSync(output, svg);
  console.log('Written to:', output);
}
