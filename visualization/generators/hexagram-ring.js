/**
 * Hexagram Ring Generator
 *
 * Generates the 64 hexagrams ring SVG from V3 knowledge engine data.
 * Extracted geometry from verified master SVG.
 *
 * CRITICAL CONVENTIONS (see docs/reference/CRITICAL-ORIENTATION.md):
 * - Binary strings stored BOTTOM to TOP: index 0 = Line 1 (bottom), index 5 = Line 6 (top)
 * - On wheel: Line 1 innermost (toward center), Line 6 outermost (toward edge)
 * - In local symbol coords: Line 1 at largest y-offset (bottom), Line 6 at y=0 (top)
 *
 * METHODOLOGY (see docs/reference/SVG-GENERATION-METHODOLOGY.md):
 * - Use first-principles formulas, not per-quadrant adjustments
 * - Single rotation formula works for ALL 64 gates
 * - Extract geometry from master SVG, generate transforms from principles
 */

const positioning = require('../../core/root-system/positioning-algorithm');
const engine = require('../../unified-query-engine');
const shared = require('./shared-constants');

// Ring geometry (extracted from verified master)
const RING = {
  center: { x: 1451.344, y: 1451.344 },
  innerRadius: 1334.4257,
  outerRadius: 1451.094,
  get midRadius() { return (this.innerRadius + this.outerRadius) / 2; },
  get bandWidth() { return this.outerRadius - this.innerRadius; }
};

// Hexagram symbol dimensions (extracted from verified master)
const SYMBOL = {
  lineWidth: 80.7558,      // Width of a YANG line
  lineHeight: 9.9549,      // Height/thickness of a line
  lineSpacing: 16.91,      // Vertical spacing between lines
  gapWidth: 7.34,          // Gap in YIN line (approx)
};

// Use shared color scheme
const COLORS = shared.COLORS;

/**
 * Calculate SVG rotation for a gate based on its SVG position angle
 *
 * First principles:
 * - The hexagram symbol has Line 6 at top (y=0) and Line 1 at bottom (largest y)
 * - Line 1 must be closest to wheel center, Line 6 closest to edge
 * - Therefore the "bottom" of the symbol (Line 1) must point TOWARD the center
 *
 * The position angle (svgAngle) points FROM center TO the gate position.
 * We need the symbol's "bottom" (Line 1) to point toward center.
 * Adding 90° rotates the symbol so its bottom points inward.
 *
 * This single formula works for ALL 64 gates - no quadrant adjustments needed.
 */
function calculateRotation(svgAngle) {
  return svgAngle + 90;
}

// Position offset: aligns V3 angles to SVG wheel positions
// The SVG wheel is MIRRORED (counter-clockwise) relative to V3 (clockwise)
// Formula derived by matching divider positions:
// - 10|11 divider at SVG -90° (top) = V3 323.4375°
// - 25|36 divider at SVG 180° (left) = V3 53.4375°
// - 15|12 divider at SVG 90° (bottom) = V3 143.4375°
const POSITION_OFFSET = 323.4375;

/**
 * Calculate SVG angle from V3 angle
 */
function calculateSVGAngle(v3Angle) {
  return -v3Angle - 90 + POSITION_OFFSET;
}

/**
 * Generate a divider line between two adjacent gates
 */
function generateDividerLine(gateA, gateB, stroke) {
  const v3DataA = positioning.getDockingData(gateA, 1);
  const v3DataB = positioning.getDockingData(gateB, 1);

  const angleA = v3DataA.angle;
  const angleB = v3DataB.angle;

  // Handle wraparound
  let midAngle;
  if (Math.abs(angleB - angleA) > 180) {
    midAngle = ((angleA + angleB + 360) / 2) % 360;
  } else {
    midAngle = (angleA + angleB) / 2;
  }

  const svgAngle = calculateSVGAngle(midAngle);
  const radians = svgAngle * Math.PI / 180;

  const innerExtent = RING.innerRadius + 2;
  const outerExtent = RING.outerRadius - 2;

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
 * Calculate SVG position for a gate
 * @param {number} v3Angle - Angle from V3 positioning (0° = top, clockwise)
 * @param {number} radius - Distance from center (default: midRadius)
 */
function calculatePosition(v3Angle, radius = RING.midRadius) {
  // Convert V3 angle to SVG coordinate system
  // V3: 0° at top, clockwise
  // SVG: 0° at right (3 o'clock), y-down coordinate system
  // The wheel is MIRRORED, so we negate the V3 angle
  const svgAngle = -v3Angle - 90 + POSITION_OFFSET;
  const radians = svgAngle * Math.PI / 180;

  return {
    x: RING.center.x + radius * Math.cos(radians),
    y: RING.center.y + radius * Math.sin(radians)
  };
}

/**
 * Generate SVG for a single YANG line (solid rectangle)
 * I Ching convention: Line 1 at bottom, Line 6 at top
 * So Line 1 gets largest y-offset, Line 6 gets smallest
 */
function generateYangLine(lineNumber) {
  const yOffset = (6 - lineNumber) * SYMBOL.lineSpacing;
  return `<rect
    data-line="${lineNumber}"
    data-type="yang"
    x="0"
    y="${yOffset}"
    width="${SYMBOL.lineWidth}"
    height="${SYMBOL.lineHeight}"
  />`;
}

/**
 * Generate SVG for a single YIN line (two rectangles with gap)
 * I Ching convention: Line 1 at bottom, Line 6 at top
 * So Line 1 gets largest y-offset, Line 6 gets smallest
 */
function generateYinLine(lineNumber) {
  const yOffset = (6 - lineNumber) * SYMBOL.lineSpacing;
  const segmentWidth = (SYMBOL.lineWidth - SYMBOL.gapWidth) / 2;

  return `<g data-line="${lineNumber}" data-type="yin">
    <rect x="0" y="${yOffset}" width="${segmentWidth}" height="${SYMBOL.lineHeight}"/>
    <rect x="${segmentWidth + SYMBOL.gapWidth}" y="${yOffset}" width="${segmentWidth}" height="${SYMBOL.lineHeight}"/>
  </g>`;
}

/**
 * Generate the hexagram symbol for a gate
 */
function generateHexagramSymbol(gateNumber) {
  const knowledge = engine.getGateKnowledge(gateNumber);
  const binary = knowledge.binary;

  const lines = [];
  for (let i = 0; i < 6; i++) {
    const lineNumber = i + 1;
    const isYang = binary[i] === '1';

    if (isYang) {
      lines.push(generateYangLine(lineNumber));
    } else {
      lines.push(generateYinLine(lineNumber));
    }
  }

  return lines.join('\n    ');
}

/**
 * Generate a complete gate group with positioned and rotated hexagram
 */
function generateGateGroup(gateNumber) {
  const knowledge = engine.getGateKnowledge(gateNumber);
  const v3Data = positioning.getDockingData(gateNumber, 1);

  // Calculate SVG angle for position and rotation
  const svgAngle = -v3Data.angle - 90 + POSITION_OFFSET;
  const position = calculatePosition(v3Data.angle);
  const rotation = calculateRotation(svgAngle);

  // Center the symbol on the position
  const offsetX = -SYMBOL.lineWidth / 2;
  const offsetY = -(SYMBOL.lineSpacing * 5 + SYMBOL.lineHeight) / 2;

  const symbol = generateHexagramSymbol(gateNumber);

  return `  <g id="gate-${gateNumber}"
     data-gate="${gateNumber}"
     data-codon="${knowledge.codon}"
     data-binary="${knowledge.binary}"
     data-trigram-upper="${knowledge.trigrams.upper}"
     data-trigram-lower="${knowledge.trigrams.lower}"
     transform="translate(${position.x.toFixed(2)}, ${position.y.toFixed(2)}) rotate(${rotation.toFixed(2)}) translate(${offsetX.toFixed(2)}, ${offsetY.toFixed(2)})">
    ${symbol}
  </g>`;
}

/**
 * Generate the complete hexagram ring SVG
 */
function generateHexagramRing(options = {}) {
  const {
    includeStructure = true,
    includeBackground = true,
    stroke = COLORS.foreground,
    fill = COLORS.foreground,
    backgroundColor = COLORS.background,
    strokeWidth = 0.5
  } = options;

  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg"
     width="${RING.outerRadius * 2 + 10}"
     height="${RING.outerRadius * 2 + 10}"
     viewBox="0 0 ${RING.center.x * 2} ${RING.center.y * 2}">
  <style>
    #hexagrams rect { fill: ${fill}; stroke: none; }
  </style>
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

  // Add hexagram groups
  svg += `  <g id="hexagrams">\n`;

  for (const gateNumber of gateSequence) {
    svg += generateGateGroup(gateNumber) + '\n';
  }

  svg += `  </g>\n</svg>`;

  return svg;
}

// Export
module.exports = {
  RING,
  SYMBOL,
  COLORS,
  calculateSVGAngle,
  calculateRotation,
  calculatePosition,
  generateDividerLine,
  generateDividers,
  generateHexagramSymbol,
  generateGateGroup,
  generateHexagramRing
};

// CLI: node hexagram-ring.js [output.svg]
if (require.main === module) {
  const fs = require('fs');
  const output = process.argv[2] || 'generated-hexagram-ring.svg';

  console.log('Generating hexagram ring...');
  const svg = generateHexagramRing();

  fs.writeFileSync(output, svg);
  console.log('Written to:', output);
}
