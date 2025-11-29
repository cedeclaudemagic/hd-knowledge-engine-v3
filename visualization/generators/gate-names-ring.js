/**
 * Gate Names Ring Generator
 *
 * Generates the 64 HD mandala gate names ring SVG from V3 knowledge engine data.
 * Extracted geometry and font specs from verified master SVG.
 *
 * CRITICAL CONVENTIONS (see docs/reference/CRITICAL-ORIENTATION.md):
 * - Gate names positioned around wheel per V3 positioning algorithm
 * - Text rotated for readability (tangent to circle)
 *
 * METHODOLOGY (see docs/reference/SVG-GENERATION-METHODOLOGY.md):
 * - Use first-principles formulas, not per-quadrant adjustments
 * - Single rotation formula works for ALL 64 gates: svgAngle + 90
 * - Extract geometry from master SVG, generate transforms from principles
 *
 * SCALING SYSTEM:
 * - Font sizes and line heights are derived from ring band width using ratios
 * - Ratios extracted from master SVG ensure proportional scaling
 * - When ring geometry changes, text scales proportionally
 * - See shared-constants.js TEXT_RATIOS for the underlying ratios
 */

const positioning = require('../../core/root-system/positioning-algorithm');
const engine = require('../../unified-query-engine');
const shared = require('./shared-constants');

// Ring geometry (extracted from verified master)
const RING = {
  center: { x: 1538.3667, y: 1538.3667 },
  innerRadius: 1457.367,
  outerRadius: 1538.0506,
  get midRadius() { return (this.innerRadius + this.outerRadius) / 2; },
  get bandWidth() { return this.outerRadius - this.innerRadius; }
};

// Scale factor for proportional sizing when ring geometry changes
// At master dimensions (bandWidth = 80.6836px), this equals 1.0
const MASTER_BAND_WIDTH = 80.6836;
const scaleFactor = RING.bandWidth / MASTER_BAND_WIDTH;

// Font specifications - derived from ring geometry for proportional scaling
// Master uses ~20.8px as standard, with specific smaller sizes for long words
const FONT = {
  family: 'Copperplate-Bold, Copperplate',
  weight: 700,
  // Standard size (20.8px at master scale, scales proportionally)
  standard: 20.8073 * scaleFactor,
  // Specific sizes for long words (from master analysis)
  sizes: {
    'Determination': 18.3781 * scaleFactor,   // 13 chars
    'Formalization': 18.3782 * scaleFactor,   // 13 chars
    'Rationalising': 19.1771 * scaleFactor,   // 13 chars
    'Contribution': 19.9763 * scaleFactor,    // 12 chars
    'Game-Player': 19.9762 * scaleFactor,     // 11 chars
    'Provocateur': 19.9763 * scaleFactor      // 11 chars
  },
  lineHeight: 13.675 * scaleFactor,          // Vertical spacing between lines
  verticalScale: 1.2                          // Constant vertical stretch ratio
};

/**
 * Get font size for a specific text string
 * Uses master-matched sizes for known long words, standard size otherwise
 */
function getFontSize(text) {
  if (FONT.sizes[text]) {
    return FONT.sizes[text];
  }
  // For unknown long words, scale down based on character count
  const len = text.length;
  if (len >= 13) {
    return FONT.standard * 0.88;  // ~18.3px at master scale
  } else if (len >= 12) {
    return FONT.standard * 0.96;  // ~19.9px at master scale
  }
  return FONT.standard;
}

// Use shared color scheme
const COLORS = shared.COLORS;

// Text positioning radius - place text at mid-radius of the band
const TEXT_RADIUS = RING.midRadius;

/**
 * Calculate SVG position angle from V3 angle
 * Same formula as other ring generators
 */
function calculateSVGAngle(v3Angle) {
  return shared.calculateSVGAngle(v3Angle);
}

/**
 * Calculate text rotation for readability
 * svgAngle + 90 makes text tangent to circle (readable)
 */
function calculateRotation(svgAngle) {
  return shared.calculateRotation(svgAngle);
}

/**
 * Calculate SVG position for a gate name
 * @param {number} v3Angle - Angle from V3 positioning (0° = top, clockwise)
 * @param {number} radius - Distance from center (default: TEXT_RADIUS)
 */
function calculatePosition(v3Angle, radius = TEXT_RADIUS) {
  return shared.calculatePosition(v3Angle, radius, RING.center);
}

/**
 * Split gate name into multiple lines for display
 * Returns array of { text, fontSize } objects
 *
 * IMPORTANT: This function handles DISPLAY FORMATTING only.
 * The source data comes from the V3 engine unchanged.
 */
function splitNameIntoLines(name) {
  // Helper to create line with master-matched font size
  const line = (text) => ({ text, fontSize: getFontSize(text) });

  // Single word names - use standard size
  if (!name.includes(' ')) {
    return [line(name)];
  }

  // === SPECIFIC PATTERNS FROM MASTER ===

  // === SPECIAL DISPLAY CASES (master uses shortened/modified text) ===

  // Gate 30: "The Gate of the Recognition of Feelings" → displays as "Recognition / of / Feelings"
  // NOTE: Master drops "The Gate of the" for space - this is a DISPLAY choice
  if (name.includes('Recognition of Feelings')) {
    return [
      line('Recognition'),
      line('of'),
      line('Feelings')
    ];
  }

  // Gate 21: "The Gate of The Hunter/Huntress" → displays as "The Gate / of / The / Hunter/ess"
  // NOTE: Master shortens "Hunter/Huntress" to "Hunter/ess" for space
  if (name.includes('Hunter/Huntress') || name.includes('Hunter Huntress')) {
    return [
      line('The Gate'),
      line('of'),
      line('The'),
      line('Hunter/ess')
    ];
  }

  // Gate 57: "The Gate of Intuitive Insight" → 4 lines
  if (name.includes('Intuitive Insight')) {
    return [
      line('The Gate'),
      line('of'),
      line('Intuitive'),
      line('Insight')
    ];
  }

  // Gate 5: "The Gate of Fixed Rhythms" → 4 lines
  if (name.includes('Fixed Rhythms')) {
    return [
      line('The Gate'),
      line('of'),
      line('Fixed'),
      line('Rhythms')
    ];
  }

  // "The Gate of X" pattern (most common)
  if (name.startsWith('The Gate of ')) {
    const rest = name.substring(12); // Remove "The Gate of "

    // Check for "The Gate of The X" pattern
    if (rest.startsWith('The ')) {
      const finalPart = rest.substring(4); // Remove "The "
      return [
        line('The Gate'),
        line('of'),
        line('The'),
        line(finalPart)
      ];
    }

    // Check for multi-word endings that should be 4 lines
    const words = rest.split(' ');
    if (words.length === 1) {
      // "The Gate of X" - 3 lines
      return [
        line('The Gate'),
        line('of'),
        line(rest)
      ];
    } else if (words.length === 2) {
      // "The Gate of X Y" - check if it should be 4 lines (two separate words)
      // Master uses 4 lines for two-word endings to fit better
      return [
        line('The Gate'),
        line('of'),
        line(words[0]),
        line(words[1])
      ];
    } else {
      // "The Gate of X Y Z" - 4 lines
      return [
        line('The Gate'),
        line('of'),
        line(words.slice(0, -1).join(' ')),
        line(words[words.length - 1])
      ];
    }
  }

  // "The X of The Self" pattern (Gates 2, 7, 10, 25, 46)
  // Master shows these as 4 lines: "The" / "X" / "of" / "The Self"
  if (name.includes('of The Self') || name.includes('of the Self')) {
    const parts = name.split(' ');
    // Find index of "of"
    const ofIndex = parts.findIndex(p => p.toLowerCase() === 'of');
    if (ofIndex > 0) {
      const lastPart = parts.slice(ofIndex + 1).join(' ');

      // Handle "The" at start - split into 4 lines
      if (parts[0] === 'The' && ofIndex === 2) {
        return [
          line('The'),
          line(parts[1]),  // e.g., "Direction", "Role", "Behaviour", etc.
          line('of'),
          line(lastPart)   // "The Self"
        ];
      }

      // Other patterns
      const firstPart = parts.slice(0, ofIndex).join(' ');
      return [
        line(firstPart),
        line('of'),
        line(lastPart)
      ];
    }
  }

  // Generic multi-word: split sensibly
  const words = name.split(' ');
  if (words.length === 2) {
    return [line(words[0]), line(words[1])];
  } else if (words.length === 3) {
    return [line(words[0]), line(words[1]), line(words[2])];
  } else {
    // 4+ words: split in half
    const mid = Math.ceil(words.length / 2);
    return [
      line(words.slice(0, mid).join(' ')),
      line(words.slice(mid).join(' '))
    ];
  }
}

/**
 * Generate SVG for a single gate name
 * Handles multi-line names using tspan elements
 */
function generateNameElement(gateNumber) {
  const knowledge = engine.getGateKnowledge(gateNumber);
  const gateName = knowledge.mandalaGateName?.mandalaGateName || `Gate ${gateNumber}`;

  const v3Data = positioning.getDockingData(gateNumber, 1);
  const position = calculatePosition(v3Data.angle);
  const rotation = calculateRotation(position.svgAngle);

  const lines = splitNameIntoLines(gateName);

  // Calculate vertical offset to center the text block
  const totalHeight = (lines.length - 1) * FONT.lineHeight;
  const startY = -totalHeight / 2;

  let tspans = '';
  for (let i = 0; i < lines.length; i++) {
    const dy = i === 0 ? startY : FONT.lineHeight;
    // Only include font-size if different from standard
    const fontSizeAttr = lines[i].fontSize !== FONT.standard
      ? ` font-size="${lines[i].fontSize.toFixed(4)}"`
      : '';
    tspans += `<tspan x="0" dy="${dy.toFixed(2)}"${fontSizeAttr}>${lines[i].text}</tspan>`;
  }

  return `  <text
     data-gate="${gateNumber}"
     data-gate-name="${gateName}"
     transform="translate(${position.x.toFixed(4)} ${position.y.toFixed(4)}) rotate(${rotation.toFixed(4)}) scale(1 ${FONT.verticalScale})"
     font-size="${FONT.standard.toFixed(2)}"
     font-family="${FONT.family}"
     font-weight="${FONT.weight}"
     text-anchor="middle"
     dominant-baseline="central"
     stroke="none"
     style="isolation: isolate">${tspans}</text>`;
}

/**
 * Generate the complete gate names ring SVG
 */
function generateGateNamesRing(options = {}) {
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
    svg += shared.generateStructure(positioning, RING, stroke, strokeWidth) + '\n';
  }

  // Add gate names
  svg += `  <g id="GATE_NAMES" fill="${fill}">\n`;

  for (const gateNumber of gateSequence) {
    svg += generateNameElement(gateNumber) + '\n';
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
  getFontSize,
  splitNameIntoLines,
  generateNameElement,
  generateGateNamesRing
};

// CLI: node gate-names-ring.js [output.svg]
if (require.main === module) {
  const fs = require('fs');
  const output = process.argv[2] || 'generated-gate-names-ring.svg';

  console.log('Generating gate names ring...');
  const svg = generateGateNamesRing();

  fs.writeFileSync(output, svg);
  console.log('Written to:', output);
}
