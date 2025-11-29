/**
 * I Ching Names Ring Generator
 *
 * Generates the 64 I Ching hexagram names ring SVG from V3 knowledge engine data.
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
  center: { x: 1335.2162, y: 1335.2162 },
  innerRadius: 1259.3041,
  outerRadius: 1334.9662,
  get midRadius() { return (this.innerRadius + this.outerRadius) / 2; },
  get bandWidth() { return this.outerRadius - this.innerRadius; }
};

// Calculate text configuration from ring geometry using shared scaling system
const textConfig = shared.calculateTextConfig(RING);

// Scale factor for proportional sizing when ring geometry changes
// At master dimensions (bandWidth = 75.66px), this equals 1.0
const MASTER_BAND_WIDTH = 75.6621;
const scaleFactor = RING.bandWidth / MASTER_BAND_WIDTH;

// Font specifications - derived from ring geometry for proportional scaling
// Master-matched values are scaled proportionally when ring dimensions change
const FONT = {
  family: 'Copperplate-Bold, Copperplate',
  weight: 700,
  // Standard size (19px at master scale, scales proportionally)
  standard: 19.0 * scaleFactor,
  // Specific sizes for long words - these are master-matched ratios
  // that scale proportionally with the ring dimensions
  sizes: {
    'Contemplation': 15.84 * scaleFactor,  // 13 chars, ratio 0.8337
    'Preponderance': 15.05 * scaleFactor,  // 13 chars, ratio 0.7921 (wider chars)
    'Taming Power': 16.63 * scaleFactor,   // 12 chars, ratio 0.8753
    'Development': 17.42 * scaleFactor,    // 11 chars, ratio 0.9168
    'Nourishment': 17.42 * scaleFactor,    // 11 chars, ratio 0.9168
    'Obstruction': 18.22 * scaleFactor,    // 11 chars, ratio 0.9589
    'Deliverance': 18.22 * scaleFactor,    // 11 chars, ratio 0.9589
    'Been Spoilt': 18.22 * scaleFactor     // 11 chars, ratio 0.9589
  },
  lineHeight: 15.62 * scaleFactor,         // Vertical spacing between lines
  verticalScale: 1.2                        // Constant vertical stretch ratio
};

/**
 * Get font size for a specific text string
 * Uses scalable sizing based on character count, with lookup for known words
 */
function getFontSize(text) {
  // First check specific word lookup (for backward compatibility with exact master values)
  if (FONT.sizes[text]) {
    return FONT.sizes[text];
  }
  // Otherwise use the scalable character-count-based sizing
  return textConfig.getFontSize(text);
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
 * Split I Ching name into multiple lines for display
 * Returns array of { text, fontSize } objects
 *
 * IMPORTANT: This function handles DISPLAY FORMATTING only.
 * The source data comes from the V3 engine unchanged.
 * Some patterns here (e.g., dropping "The" from "The Taming Power...")
 * follow the master SVG's layout choices for space constraints.
 *
 * Patterns extracted from master SVG analysis:
 * - Most text uses standard 19px
 * - Long single words get specific smaller sizes (see FONT.sizes)
 * - Multi-line names: first line may be smaller if it's a long word
 */
function splitNameIntoLines(name) {
  // Helper to create line with master-matched font size
  const line = (text) => ({ text, fontSize: getFontSize(text) });

  // "Breakthrough" - special case: split single word into two lines
  if (name === 'Breakthrough') {
    return [
      line('Break'),          // 19px
      line('through')         // 19px
    ];
  }

  // Single word names - use master-matched size
  if (!name.includes(' ')) {
    return [line(name)];
  }

  // === SPECIFIC PATTERNS FROM MASTER ===

  // "Preponderance of the Great/Small" - 3 lines (Gates 28 and 62)
  if (name.includes('Preponderance of')) {
    const parts = name.split(' ');
    const lastTwo = parts.slice(-2).join(' '); // "the Great" or "the Small"
    return [
      line('Preponderance'),  // 15.05px
      line('of'),             // 19px
      line(lastTwo)           // 19px
    ];
  }

  // "The Taming Power of the Small/Great" - 3 lines
  // NOTE: Master SVG drops leading "The" for space - this is a DISPLAY choice,
  // not a data modification. The V3 source retains "The Taming Power of..."
  if (name.includes('Taming Power of')) {
    const parts = name.split(' ');
    const lastTwo = parts.slice(-2).join(' '); // "the Small" or "the Great"
    return [
      line('Taming Power'),   // 16.63px (master drops "The" for space)
      line('of'),             // 19px
      line(lastTwo)           // 19px
    ];
  }

  // "Work on What has Been Spoilt" - 3 lines
  if (name.includes('Work on What')) {
    return [
      line('Work on'),        // 19px
      line('What has'),       // 19px
      line('Been Spoilt')     // 18.22px
    ];
  }

  // "Difficulty At the Beginning" - 3 lines
  if (name.includes('Difficulty')) {
    return [
      line('Difficulty'),     // 19px
      line('At the'),         // 19px
      line('Beginning')       // 19px
    ];
  }

  // "Possession In Great Measure" - 3 lines
  if (name.includes('Possession')) {
    return [
      line('Possession'),     // 19px
      line('In Great'),       // 19px
      line('Measure')         // 19px
    ];
  }

  // "The Power The Great" - 3 lines
  if (name === 'The Power The Great') {
    return [
      line('The'),            // 19px
      line('Power'),          // 19px
      line('The Great')       // 19px
    ];
  }

  // "Darkening of The Light" - 3 lines
  if (name.includes('Darkening')) {
    return [
      line('Darkening'),      // 19px
      line('of'),             // 19px
      line('The Light')       // 19px
    ];
  }

  // "The Fellowship of Man" - 3 lines
  if (name.includes('Fellowship')) {
    return [
      line('The'),            // 19px
      line('Fellowship'),     // 19px
      line('of Man')          // 19px
    ];
  }

  // "The Marrying Maiden" - 3 lines
  if (name.includes('Marrying Maiden')) {
    return [
      line('The'),            // 19px
      line('Marrying'),       // 19px
      line('Maiden')          // 19px
    ];
  }

  // "After/Before Completion" - 2 lines
  if (name.includes('Completion')) {
    const parts = name.split(' ');
    return [
      line(parts[0]),         // 19px (After/Before)
      line('Completion')      // 19px
    ];
  }

  // "Youthful Folly" - 2 lines
  if (name === 'Youthful Folly') {
    return [
      line('Youthful'),       // 19px
      line('Folly')           // 19px
    ];
  }

  // "Biting Through" - 2 lines
  if (name === 'Biting Through') {
    return [
      line('Biting'),         // 19px
      line('Through')         // 19px
    ];
  }

  // "Coming to Meet" - 2 lines
  if (name === 'Coming to Meet') {
    return [
      line('Coming'),         // 19px
      line('to Meet')         // 19px
    ];
  }

  // "Pushing Upward" - 2 lines
  if (name === 'Pushing Upward') {
    return [
      line('Pushing'),        // 19px
      line('Upward')          // 19px
    ];
  }

  // "Splitting Apart" - 2 lines
  if (name === 'Splitting Apart') {
    return [
      line('Splitting'),      // 19px
      line('Apart')           // 19px
    ];
  }

  // "Holding Together" - 2 lines
  if (name === 'Holding Together') {
    return [
      line('Holding'),        // 19px
      line('Together')        // 19px
    ];
  }

  // "Gathering Together" - 2 lines
  if (name === 'Gathering Together') {
    return [
      line('Gathering'),      // 19px
      line('Together')        // 19px
    ];
  }

  // "Keeping Still" - 2 lines
  if (name === 'Keeping Still') {
    return [
      line('Keeping'),        // 19px
      line('Still')           // 19px
    ];
  }

  // "Inner Truth" - 2 lines
  if (name === 'Inner Truth') {
    return [
      line('Inner'),          // 19px
      line('Truth')           // 19px
    ];
  }

  // === GENERAL PATTERNS ===

  // Short names (<=10 chars) - single line
  if (name.length <= 10) {
    return [line(name)];
  }

  // Names starting with "The" - split into 2 lines
  if (name.startsWith('The ')) {
    const rest = name.substring(4);
    return [
      line('The'),
      line(rest)
    ];
  }

  // Two-word names - split into 2 lines
  const words = name.split(' ');
  if (words.length === 2) {
    return [
      line(words[0]),
      line(words[1])
    ];
  }

  // Three+ word names - split sensibly
  if (words.length >= 3) {
    const mid = Math.ceil(words.length / 2);
    return [
      line(words.slice(0, mid).join(' ')),
      line(words.slice(mid).join(' '))
    ];
  }

  // Fallback: single line
  return [line(name)];
}

/**
 * Generate SVG for a single gate I Ching name
 * Handles multi-line names using tspan elements
 */
function generateNameElement(gateNumber) {
  const knowledge = engine.getGateKnowledge(gateNumber);
  const ichingName = knowledge.ichingName?.ichingName || `Hexagram ${gateNumber}`;

  const v3Data = positioning.getDockingData(gateNumber, 1);
  const position = calculatePosition(v3Data.angle);
  const rotation = calculateRotation(position.svgAngle);

  const lines = splitNameIntoLines(ichingName);

  // Single line - simple text element
  if (lines.length === 1) {
    return `  <text
     data-gate="${gateNumber}"
     data-iching-name="${ichingName}"
     transform="translate(${position.x.toFixed(4)} ${position.y.toFixed(4)}) rotate(${rotation.toFixed(4)}) scale(1 ${FONT.verticalScale})"
     font-size="${lines[0].fontSize.toFixed(2)}"
     font-family="${FONT.family}"
     font-weight="${FONT.weight}"
     text-anchor="middle"
     dominant-baseline="central"
     stroke="none"
     style="isolation: isolate">${lines[0].text}</text>`;
  }

  // Multi-line - use tspan elements
  // Calculate vertical offset to center the text block
  const totalHeight = (lines.length - 1) * FONT.lineHeight;
  const startY = -totalHeight / 2;

  let tspans = '';
  for (let i = 0; i < lines.length; i++) {
    const dy = i === 0 ? startY : FONT.lineHeight;
    // Only include font-size if different from standard
    const fontSizeAttr = lines[i].fontSize !== FONT.standard
      ? ` font-size="${lines[i].fontSize.toFixed(2)}"`
      : '';
    tspans += `<tspan x="0" dy="${dy.toFixed(2)}"${fontSizeAttr}>${lines[i].text}</tspan>`;
  }

  return `  <text
     data-gate="${gateNumber}"
     data-iching-name="${ichingName}"
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
 * Generate the complete I Ching names ring SVG
 */
function generateIChingNamesRing(options = {}) {
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

  // Add I Ching names
  svg += `  <g id="ICHING_NAMES" fill="${fill}">\n`;

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
  generateIChingNamesRing
};

// CLI: node iching-names-ring.js [output.svg]
if (require.main === module) {
  const fs = require('fs');
  const output = process.argv[2] || 'generated-iching-names-ring.svg';

  console.log('Generating I Ching names ring...');
  const svg = generateIChingNamesRing();

  fs.writeFileSync(output, svg);
  console.log('Written to:', output);
}
