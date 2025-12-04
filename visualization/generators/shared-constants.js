/**
 * Shared Constants for HD Wheel Visualization Generators
 *
 * These constants are shared across all ring generators to ensure
 * visual consistency across the wheel.
 */

// Standard color scheme for HD wheel visualizations
const COLORS = {
  background: '#151E25',   // Canvas background (dark blue-grey)
  foreground: '#FFFFFF',   // Text, symbols, lines (white)
  highlight: '#fab414'     // Accent/highlight color (gold)
};

// Position offset: aligns V3 angles to SVG wheel positions
// The SVG wheel is MIRRORED (counter-clockwise) relative to V3 (clockwise)
// This offset is derived by matching divider positions and is consistent
// across ALL ring generators.
const POSITION_OFFSET = 323.4375;

/**
 * Calculate SVG position angle from V3 angle
 * Standard formula used by all ring generators
 */
function calculateSVGAngle(v3Angle) {
  return -v3Angle - 90 + POSITION_OFFSET;
}

/**
 * Calculate rotation for radial/tangent alignment
 * Adding 90° to svgAngle works for:
 * - Hexagrams: Line 1 points toward center
 * - Numbers: Text reads tangent to circle
 * - Trigrams: (same principle)
 */
function calculateRotation(svgAngle) {
  return svgAngle + 90;
}

/**
 * Calculate SVG position coordinates
 */
function calculatePosition(v3Angle, radius, center) {
  const svgAngle = calculateSVGAngle(v3Angle);
  const radians = svgAngle * Math.PI / 180;

  return {
    x: center.x + radius * Math.cos(radians),
    y: center.y + radius * Math.sin(radians),
    svgAngle: svgAngle
  };
}

/**
 * Generate a divider line between two adjacent gates
 * @param {Object} positioning - The positioning algorithm module
 * @param {number} gateA - First gate number
 * @param {number} gateB - Second gate number (adjacent)
 * @param {Object} ring - Ring geometry { center, innerRadius, outerRadius }
 * @param {string} stroke - Stroke color
 */
function generateDividerLine(positioning, gateA, gateB, ring, stroke) {
  const v3DataA = positioning.getDockingData(gateA, 1);
  const v3DataB = positioning.getDockingData(gateB, 1);

  const angleA = v3DataA.angle;
  const angleB = v3DataB.angle;

  // Handle wraparound (e.g., between gate at 354° and gate at 0°)
  let midAngle;
  if (Math.abs(angleB - angleA) > 180) {
    midAngle = ((angleA + angleB + 360) / 2) % 360;
  } else {
    midAngle = (angleA + angleB) / 2;
  }

  const svgAngle = calculateSVGAngle(midAngle);
  const radians = svgAngle * Math.PI / 180;

  // Dividers extend slightly inside the ring band
  const innerExtent = ring.innerRadius + 2;
  const outerExtent = ring.outerRadius - 2;

  const x1 = ring.center.x + outerExtent * Math.cos(radians);
  const y1 = ring.center.y + outerExtent * Math.sin(radians);
  const x2 = ring.center.x + innerExtent * Math.cos(radians);
  const y2 = ring.center.y + innerExtent * Math.sin(radians);

  return `      <line id="LINE_-_${gateA}_${gateB}" x1="${x1.toFixed(4)}" y1="${y1.toFixed(4)}" x2="${x2.toFixed(4)}" y2="${y2.toFixed(4)}" fill="none" stroke="${stroke}" stroke-miterlimit="10"/>`;
}

/**
 * Generate all 64 divider lines for a ring
 * @param {Object} positioning - The positioning algorithm module
 * @param {Object} ring - Ring geometry { center, innerRadius, outerRadius }
 * @param {string} stroke - Stroke color
 */
function generateDividers(positioning, ring, stroke) {
  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
  const lines = [];

  for (let i = 0; i < gateSequence.length; i++) {
    const gateA = gateSequence[i];
    const gateB = gateSequence[(i + 1) % gateSequence.length];
    lines.push(generateDividerLine(positioning, gateA, gateB, ring, stroke));
  }

  return lines.join('\n');
}

/**
 * Generate the standard STRUCTURE group (rings and dividers)
 * @param {Object} positioning - The positioning algorithm module
 * @param {Object} ring - Ring geometry { center, innerRadius, outerRadius }
 * @param {string} stroke - Stroke color
 * @param {number} strokeWidth - Stroke width
 */
function generateStructure(positioning, ring, stroke, strokeWidth = 0.5) {
  return `  <g id="STRUCTURE">
    <g id="RINGS">
      <circle id="RING_-_INNER" cx="${ring.center.x}" cy="${ring.center.y}" r="${ring.innerRadius}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${strokeWidth}"/>
      <circle id="RING_-_OUTER" cx="${ring.center.x}" cy="${ring.center.y}" r="${ring.outerRadius}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${strokeWidth}"/>
    </g>
    <g id="DIVIDERS">
${generateDividers(positioning, ring, stroke)}
    </g>
  </g>`;
}

// ============================================================================
// TEXT SCALING SYSTEM
// ============================================================================
//
// These ratios are derived from the verified master SVG and allow text to
// scale proportionally when ring geometry changes. All measurements are
// relative to the ring's band width (outerRadius - innerRadius).
//
// Key insight: The master uses fixed pixel values, but we extract the
// underlying ratios so text can scale with the ring.

/**
 * Standard text configuration ratios (derived from master SVG analysis)
 * All ratios are relative to band width for proportional scaling
 */
const TEXT_RATIOS = {
  // Standard font size as ratio of band width
  // Master: 19px font in 75.66px band = 0.2511
  fontSizeToBandWidth: 0.2511,

  // Line height as ratio of band width
  // Master: 15.62px line height in 75.66px band = 0.2064
  lineHeightToBandWidth: 0.2064,

  // Vertical scale factor for stretched text
  verticalScale: 1.2,

  // Character width approximation for Copperplate Bold
  // Used for estimating how many characters fit per line
  charWidthToFontSize: 0.7,

  // Long word font size multipliers (ratio to standard font)
  // These compress long words to fit within the gate arc
  longWordMultipliers: {
    13: 0.792,  // 13+ char words: Preponderance, Contemplation
    12: 0.875,  // 12 char words: Taming Power
    11: 0.916   // 11 char words: Development, Nourishment, etc.
  }
};

/**
 * Calculate text configuration for a ring based on its geometry
 * @param {Object} ring - Ring geometry { innerRadius, outerRadius }
 * @returns {Object} Text configuration with scaled font sizes
 */
function calculateTextConfig(ring) {
  const bandWidth = ring.outerRadius - ring.innerRadius;
  const midRadius = (ring.innerRadius + ring.outerRadius) / 2;

  // Arc length at mid-radius per gate (360/64 = 5.625 degrees)
  const gateArcRadians = (360 / 64) * Math.PI / 180;
  const arcLength = midRadius * gateArcRadians;

  // Calculate scaled values from ratios
  const standardFontSize = bandWidth * TEXT_RATIOS.fontSizeToBandWidth;
  const lineHeight = bandWidth * TEXT_RATIOS.lineHeightToBandWidth;

  // Approximate characters that fit per line
  const charsPerLine = arcLength / (standardFontSize * TEXT_RATIOS.charWidthToFontSize);

  return {
    bandWidth,
    arcLength,
    standardFontSize,
    lineHeight,
    verticalScale: TEXT_RATIOS.verticalScale,
    charsPerLine: Math.floor(charsPerLine),

    // Calculate font size for a specific word based on character count
    getFontSize(word) {
      const len = word.length;
      if (len >= 13) {
        return standardFontSize * TEXT_RATIOS.longWordMultipliers[13];
      } else if (len >= 12) {
        return standardFontSize * TEXT_RATIOS.longWordMultipliers[12];
      } else if (len >= 11) {
        return standardFontSize * TEXT_RATIOS.longWordMultipliers[11];
      }
      return standardFontSize;
    },

    // How many lines of text fit in the band
    maxLines: Math.floor(bandWidth / (standardFontSize * TEXT_RATIOS.verticalScale))
  };
}

// ============================================================================
// DATA ATTRIBUTES SYSTEM
// ============================================================================
//
// Standardized data-* attributes for SVG elements.
// These enable querying/highlighting elements by gate, quarter, trigram, etc.
// All generators should use these functions for consistency.

// Lazy-loaded positioning module (avoids circular dependencies)
let _positioning = null;
function getPositioning() {
  if (!_positioning) {
    _positioning = require('../../core/root-system/positioning-algorithm.js');
  }
  return _positioning;
}

/**
 * Get standardized data attributes for a gate
 * Use this in all generators for consistent queryable SVG output.
 *
 * @param {number} gateNumber - Gate number (1-64)
 * @param {Object} options - Optional configuration
 * @param {boolean} options.includeWheelIndex - Include data-wheel-index (default: true)
 * @param {boolean} options.includeAngle - Include data-angle (default: false)
 * @param {boolean} options.includeOpposite - Include data-opposite-gate (default: false)
 * @returns {Object} Object with data-* attribute keys and values
 *
 * @example
 * const attrs = getGateDataAttributes(13);
 * // Returns:
 * // {
 * //   'data-gate': 13,
 * //   'data-binary': '101111',
 * //   'data-codon': 'CAA',
 * //   'data-quarter': 'Initiation',
 * //   'data-face': 'Christ',
 * //   'data-trigram-upper': 'Heaven',
 * //   'data-trigram-lower': 'Fire',
 * //   'data-wheel-index': 2
 * // }
 */
function getGateDataAttributes(gateNumber, options = {}) {
  const {
    includeWheelIndex = true,
    includeAngle = false,
    includeOpposite = false
  } = options;

  const positioning = getPositioning();
  const docking = positioning.getDockingData(gateNumber, 1);

  const attrs = {
    'data-gate': gateNumber,
    'data-binary': docking.binary,
    'data-codon': docking.codon,
    'data-quarter': docking.quarter,
    'data-face': docking.face,
    'data-trigram-upper': docking.trigrams.upper,
    'data-trigram-lower': docking.trigrams.lower
  };

  if (includeWheelIndex) {
    attrs['data-wheel-index'] = docking.wheelIndex;
  }

  if (includeAngle) {
    attrs['data-angle'] = docking.angle;
  }

  if (includeOpposite) {
    attrs['data-opposite-gate'] = docking.oppositeGate;
  }

  return attrs;
}

/**
 * Get standardized data attributes for a specific line
 * Includes all gate attributes plus line-specific data.
 *
 * @param {number} gateNumber - Gate number (1-64)
 * @param {number} lineNumber - Line number (1-6)
 * @param {Object} options - Optional configuration (same as getGateDataAttributes)
 * @returns {Object} Object with data-* attribute keys and values
 */
function getLineDataAttributes(gateNumber, lineNumber, options = {}) {
  const positioning = getPositioning();
  const docking = positioning.getDockingData(gateNumber, lineNumber);

  // Get gate attributes
  const attrs = getGateDataAttributes(gateNumber, options);

  // Add line-specific attributes
  attrs['data-line'] = lineNumber;

  // Calculate polarity from binary (Line N uses binary[N-1])
  const bitIndex = lineNumber - 1;
  const isYang = docking.binary[bitIndex] === '1';
  attrs['data-polarity'] = isYang ? 'YANG' : 'YIN';

  return attrs;
}

/**
 * Convert data attributes object to SVG attribute string
 * Useful for template string SVG generation.
 *
 * @param {Object} attrs - Attributes object from getGateDataAttributes or getLineDataAttributes
 * @returns {string} Space-separated attribute string for SVG elements
 *
 * @example
 * const attrs = getGateDataAttributes(13);
 * const attrString = dataAttributesToString(attrs);
 * // Returns: 'data-gate="13" data-binary="101111" data-codon="CAA" ...'
 *
 * // Usage in SVG generation:
 * `<g id="gate-13" ${attrString}>...</g>`
 */
function dataAttributesToString(attrs) {
  return Object.entries(attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
}

module.exports = {
  COLORS,
  POSITION_OFFSET,
  calculateSVGAngle,
  calculateRotation,
  calculatePosition,
  generateDividerLine,
  generateDividers,
  generateStructure,
  TEXT_RATIOS,
  calculateTextConfig,
  // Data attributes
  getGateDataAttributes,
  getLineDataAttributes,
  dataAttributesToString
};
