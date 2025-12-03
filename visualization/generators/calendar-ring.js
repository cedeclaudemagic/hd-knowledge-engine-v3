/**
 * Calendar Ring Generator
 *
 * Generates the calendar wheel SVG showing:
 * - 384 yin/yang line markers ("chops")
 * - Month dividers and labels
 * - Zodiac sign dividers
 * - Inner and outer boundary rings
 *
 * Based on tropical zodiac with Gate 41.1 at 2° Aquarius (~Jan 20)
 */

const fs = require('fs');
const path = require('path');
const shared = require('./shared-constants');

// Load data sources
const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
const lineCalendar = require('../../knowledge-systems/calendar/mappings/line-calendar-mapping.json');
const linesData = require('../../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');

// ============================================================================
// RING GEOMETRY
// ============================================================================
// Based on original calendar-elements.svg (center at 826.326, 826.326)

const CENTER = { x: 826.326, y: 826.326 };

const RING = {
  outerRadius: 826.01,          // Outermost ring
  borderOuter: 801.88,          // Outer border of chops area
  borderInner: 779.98,          // Inner border of chops area
  innerRadius: 752.81,          // Innermost ring
  chopLength: 21.9              // Height of chop markers (borderOuter - borderInner)
};

// ============================================================================
// ANGLE CONVENTIONS
// ============================================================================
// The wheel starts at Gate 41.1 which is at 302° zodiac (2° Aquarius)
// In SVG coordinates: 0° is right (3 o'clock), angles increase clockwise
// Zodiac convention: 0° Aries at March equinox
//
// To convert zodiac degree to SVG angle:
// - 0° Aries should appear at the position where the spring equinox falls
// - On HD wheel, 0° Aries is where Gate 25 transitions to Gate 17

/**
 * Convert zodiac degree (0-360, 0°=Aries) to SVG angle
 *
 * Uses the V3 positioning system for consistency with all other rings:
 * - Gate 41.1 starts at 0° V3 angle = 302° zodiac (2° Aquarius)
 * - So V3 angle = (zodiacDegree - 302 + 360) % 360
 * - Then apply shared.calculateSVGAngle() for final SVG position
 *
 * This ensures calendar chops align perfectly with full-chops, lines, etc.
 */
// Angular constants for positioning
const GATE_ARC = 5.625;           // Degrees per gate
const LINE_ARC = GATE_ARC / 6;    // 0.9375° per line
const HALF_LINE_ARC = LINE_ARC / 2;  // 0.46875° - for centering chops

// POSITION_ADJUST: Offset to align with reference SVG and other rings.
// The V3 positioning gives line START positions, but visual elements need
// to be offset to align correctly on the wheel with other rings.
// Same offset as full-chops-ring.js: -GATE_ARC / 2 - LINE_ARC = -3.75°
const POSITION_ADJUST = -GATE_ARC / 2 - LINE_ARC;  // -3.75°

function zodiacToSvgAngle(zodiacDegree, forChop = false) {
  // Convert zodiac degree to V3 angle (gate 41.1 at V3 0° = zodiac 302°)
  const v3Angle = (zodiacDegree - 302 + 360) % 360;
  // Apply POSITION_ADJUST to align with other rings
  // For chops, also add half line arc to center within line boundary
  const adjustedAngle = v3Angle + POSITION_ADJUST + (forChop ? HALF_LINE_ARC : 0);
  // Use shared formula for consistency with all other ring generators
  return shared.calculateSVGAngle(adjustedAngle);
}

// ============================================================================
// MONTH AND ZODIAC DATA
// ============================================================================

// Month data:
// - startDegree: zodiac degree where month begins (~1st of month)
// - midDegree: zodiac degree for label position (~15th of month)
const MONTHS = [
  { name: 'January', abbrev: 'JAN', startDegree: 280, midDegree: 295 },    // Starts ~10° Cap, mid ~25° Cap
  { name: 'February', abbrev: 'FEB', startDegree: 311, midDegree: 326 },   // Starts ~11° Aqu, mid ~26° Aqu
  { name: 'March', abbrev: 'MAR', startDegree: 340, midDegree: 355 },      // Starts ~10° Pis, mid ~25° Pis
  { name: 'April', abbrev: 'APR', startDegree: 11, midDegree: 25 },        // Starts ~11° Ari, mid ~25° Ari
  { name: 'May', abbrev: 'MAY', startDegree: 41, midDegree: 55 },          // Starts ~11° Tau, mid ~25° Tau
  { name: 'June', abbrev: 'JUN', startDegree: 71, midDegree: 85 },         // Starts ~11° Gem, mid ~25° Gem
  { name: 'July', abbrev: 'JUL', startDegree: 100, midDegree: 115 },       // Starts ~10° Can, mid ~25° Can
  { name: 'August', abbrev: 'AUG', startDegree: 129, midDegree: 145 },     // Starts ~9° Leo, mid ~25° Leo
  { name: 'September', abbrev: 'SEP', startDegree: 159, midDegree: 175 },  // Starts ~9° Vir, mid ~25° Vir
  { name: 'October', abbrev: 'OCT', startDegree: 188, midDegree: 205 },    // Starts ~8° Lib, mid ~25° Lib
  { name: 'November', abbrev: 'NOV', startDegree: 219, midDegree: 235 },   // Starts ~9° Sco, mid ~25° Sco
  { name: 'December', abbrev: 'DEC', startDegree: 249, midDegree: 265 }    // Starts ~9° Sag, mid ~25° Sag
];

const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', startDegree: 0 },
  { name: 'Taurus', symbol: '♉', startDegree: 30 },
  { name: 'Gemini', symbol: '♊', startDegree: 60 },
  { name: 'Cancer', symbol: '♋', startDegree: 90 },
  { name: 'Leo', symbol: '♌', startDegree: 120 },
  { name: 'Virgo', symbol: '♍', startDegree: 150 },
  { name: 'Libra', symbol: '♎', startDegree: 180 },
  { name: 'Scorpio', symbol: '♏', startDegree: 210 },
  { name: 'Sagittarius', symbol: '♐', startDegree: 240 },
  { name: 'Capricorn', symbol: '♑', startDegree: 270 },
  { name: 'Aquarius', symbol: '♒', startDegree: 300 },
  { name: 'Pisces', symbol: '♓', startDegree: 330 }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get line polarity (yin/yang) from gate data
 */
function getLinePolarity(gateNumber, lineNumber) {
  // Find the line data
  const lineEntry = linesData.mappings.find(
    m => m.gateNumber === gateNumber && m.lineNumber === lineNumber
  );

  if (lineEntry && lineEntry.knowledge && lineEntry.knowledge.polarity) {
    return lineEntry.knowledge.polarity;
  }

  // Fallback: derive from binary pattern
  const binaryData = require('../../core/root-system/binary-identity.json');
  const binary = binaryData.gates[gateNumber]?.binary;
  if (binary) {
    // Line 1 is bit 0 (rightmost), Line 6 is bit 5 (leftmost)
    const bit = binary[lineNumber - 1];
    return bit === '1' ? 'YANG' : 'YIN';
  }

  return 'YANG';  // Default
}

/**
 * Generate a chop marker (yin or yang rectangle)
 */
function generateChop(degree, isYang, gateLineKey) {
  const svgAngle = zodiacToSvgAngle(degree, true);  // forChop = true for centering
  const radians = svgAngle * Math.PI / 180;

  // Chop dimensions
  const chopWidth = 4.3;      // Width of the chop
  const chopHeight = isYang ? RING.chopLength : RING.chopLength * 0.4;  // Yang is full height, yin is shorter

  // Position at the border area
  const innerR = RING.borderInner;
  const outerR = isYang ? RING.borderOuter : RING.borderInner + chopHeight;

  // Calculate corner points of the chop (trapezoid shape for radial alignment)
  const halfWidth = chopWidth / 2;
  const angleOffset = Math.atan2(halfWidth, innerR);

  const x1 = CENTER.x + innerR * Math.cos(radians - angleOffset);
  const y1 = CENTER.y + innerR * Math.sin(radians - angleOffset);
  const x2 = CENTER.x + innerR * Math.cos(radians + angleOffset);
  const y2 = CENTER.y + innerR * Math.sin(radians + angleOffset);
  const x3 = CENTER.x + outerR * Math.cos(radians + angleOffset);
  const y3 = CENTER.y + outerR * Math.sin(radians + angleOffset);
  const x4 = CENTER.x + outerR * Math.cos(radians - angleOffset);
  const y4 = CENTER.y + outerR * Math.sin(radians - angleOffset);

  const points = `${x1.toFixed(3)},${y1.toFixed(3)} ${x2.toFixed(3)},${y2.toFixed(3)} ${x3.toFixed(3)},${y3.toFixed(3)} ${x4.toFixed(3)},${y4.toFixed(3)}`;

  return `<polygon points="${points}" fill="${shared.COLORS.foreground}" id="${gateLineKey}"/>`;
}

/**
 * Generate all 384 chop markers
 */
function generateChops() {
  const chops = [];

  lineCalendar.lines.forEach(line => {
    const isYang = getLinePolarity(line.gate, line.line) === 'YANG';
    const chop = generateChop(line.degree, isYang, line.gateLineKey);
    chops.push(chop);
  });

  return chops.join('\n      ');
}

/**
 * Generate month divider lines (in outer band only)
 */
function generateMonthDividers() {
  const dividers = [];

  MONTHS.forEach((month, index) => {
    // Divider is at the boundary between months
    const dividerDegree = month.startDegree;
    const svgAngle = zodiacToSvgAngle(dividerDegree);
    const radians = svgAngle * Math.PI / 180;

    // Month dividers in outer band: borderOuter to outerRadius
    const x1 = CENTER.x + RING.borderOuter * Math.cos(radians);
    const y1 = CENTER.y + RING.borderOuter * Math.sin(radians);
    const x2 = CENTER.x + RING.outerRadius * Math.cos(radians);
    const y2 = CENTER.y + RING.outerRadius * Math.sin(radians);

    const id = `${month.abbrev}-${MONTHS[(index + 11) % 12].abbrev}`;
    dividers.push(`<line id="${id}" x1="${x1.toFixed(4)}" y1="${y1.toFixed(4)}" x2="${x2.toFixed(4)}" y2="${y2.toFixed(4)}" stroke="${shared.COLORS.foreground}" stroke-width="0.8"/>`);
  });

  return dividers.join('\n      ');
}

/**
 * Generate zodiac sign divider lines (in inner band only)
 */
function generateZodiacDividers() {
  const dividers = [];

  ZODIAC_SIGNS.forEach((sign, index) => {
    const svgAngle = zodiacToSvgAngle(sign.startDegree);
    const radians = svgAngle * Math.PI / 180;

    // Zodiac dividers in inner band: innerRadius to borderInner
    const x1 = CENTER.x + RING.innerRadius * Math.cos(radians);
    const y1 = CENTER.y + RING.innerRadius * Math.sin(radians);
    const x2 = CENTER.x + RING.borderInner * Math.cos(radians);
    const y2 = CENTER.y + RING.borderInner * Math.sin(radians);

    const prevSign = ZODIAC_SIGNS[(index + 11) % 12];
    const id = `${sign.name.substring(0, 2).toUpperCase()}-${prevSign.name.substring(0, 2).toUpperCase()}`;
    dividers.push(`<line id="${id}" x1="${x1.toFixed(4)}" y1="${y1.toFixed(4)}" x2="${x2.toFixed(4)}" y2="${y2.toFixed(4)}" stroke="${shared.COLORS.foreground}" stroke-width="0.63"/>`);
  });

  return dividers.join('\n      ');
}

/**
 * Generate boundary rings
 */
function generateRings() {
  return `
      <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${RING.outerRadius}" fill="none" stroke="${shared.COLORS.foreground}" stroke-width="0.63"/>
      <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${RING.borderOuter}" fill="none" stroke="${shared.COLORS.foreground}" stroke-width="1.1"/>
      <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${RING.borderInner}" fill="none" stroke="${shared.COLORS.foreground}" stroke-width="1.1"/>
      <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${RING.innerRadius}" fill="none" stroke="${shared.COLORS.foreground}" stroke-width="0.63"/>`;
}

/**
 * Generate month labels (in outer band, between outerRadius and borderOuter)
 */
function generateMonthLabels() {
  const labels = [];
  // Position in the outer band area
  const labelRadius = (RING.outerRadius + RING.borderOuter) / 2;

  MONTHS.forEach(month => {
    // midDegree is the zodiac degree where the Sun is on ~15th of the month
    const svgAngle = zodiacToSvgAngle(month.midDegree);
    const radians = svgAngle * Math.PI / 180;

    const x = CENTER.x + labelRadius * Math.cos(radians);
    const y = CENTER.y + labelRadius * Math.sin(radians);

    // Rotate text to follow the curve (tangent to circle)
    let textRotation = svgAngle + 90;

    labels.push(`<text x="${x.toFixed(2)}" y="${y.toFixed(2)}"
        font-family="Copperplate" font-size="16.74"
        fill="${shared.COLORS.foreground}"
        text-anchor="middle" dominant-baseline="middle"
        transform="rotate(${textRotation.toFixed(2)}, ${x.toFixed(2)}, ${y.toFixed(2)})">${month.name}</text>`);
  });

  return labels.join('\n      ');
}

/**
 * Generate zodiac sign names (in inner band, between borderInner and innerRadius)
 */
function generateZodiacLabels() {
  const labels = [];
  // Position in the inner band area
  const labelRadius = (RING.borderInner + RING.innerRadius) / 2;

  ZODIAC_SIGNS.forEach(sign => {
    // Position label in the middle of the sign's arc
    const midDegree = sign.startDegree + 15;
    const svgAngle = zodiacToSvgAngle(midDegree);
    const radians = svgAngle * Math.PI / 180;

    const x = CENTER.x + labelRadius * Math.cos(radians);
    const y = CENTER.y + labelRadius * Math.sin(radians);

    // Rotate text to follow the curve
    let textRotation = svgAngle + 90;

    labels.push(`<text x="${x.toFixed(2)}" y="${y.toFixed(2)}"
        font-family="Copperplate" font-size="17.75"
        fill="${shared.COLORS.foreground}"
        text-anchor="middle" dominant-baseline="middle"
        transform="rotate(${textRotation.toFixed(2)}, ${x.toFixed(2)}, ${y.toFixed(2)})">${sign.name}</text>`);
  });

  return labels.join('\n      ');
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

function generateCalendarRing(options = {}) {
  const {
    includeStructure = true,
    includeChops = true,
    includeLabels = true,
    stroke = shared.COLORS.foreground,
    backgroundColor = shared.COLORS.background
  } = options;

  const viewBoxSize = CENTER.x * 2 + 50;
  const svgParts = [];

  // SVG header
  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${viewBoxSize}" height="${viewBoxSize}">`);

  // Background (id="background" allows ring-composer to filter it out)
  if (backgroundColor) {
    svgParts.push(`  <rect id="background" width="100%" height="100%" fill="${backgroundColor}"/>`);
  }

  // Structure (rings)
  if (includeStructure) {
    svgParts.push('  <g id="STRUCTURE">');
    svgParts.push('    <g id="RINGS">');
    svgParts.push(generateRings());
    svgParts.push('    </g>');
    svgParts.push('    <g id="MONTH-DIVIDERS">');
    svgParts.push('      ' + generateMonthDividers());
    svgParts.push('    </g>');
    svgParts.push('    <g id="ZODIAC-DIVIDERS">');
    svgParts.push('      ' + generateZodiacDividers());
    svgParts.push('    </g>');
    svgParts.push('  </g>');
  }

  // Chops (384 line markers)
  if (includeChops) {
    svgParts.push('  <g id="CHOPS">');
    svgParts.push('    ' + generateChops());
    svgParts.push('  </g>');
  }

  // Labels
  if (includeLabels) {
    svgParts.push('  <g id="LABELS">');
    svgParts.push('    <g id="MONTH-LABELS">');
    svgParts.push('      ' + generateMonthLabels());
    svgParts.push('    </g>');
    svgParts.push('    <g id="ZODIAC-LABELS">');
    svgParts.push('      ' + generateZodiacLabels());
    svgParts.push('    </g>');
    svgParts.push('  </g>');
  }

  // Close SVG
  svgParts.push('</svg>');

  return svgParts.join('\n');
}

// ============================================================================
// CLI EXECUTION
// ============================================================================

if (require.main === module) {
  console.log('Generating calendar ring...');
  console.log('  - 384 line chops (yin/yang markers)');
  console.log('  - 12 month dividers');
  console.log('  - 12 zodiac sign dividers');
  console.log('  - Month and zodiac labels\n');

  const svg = generateCalendarRing();

  const outputPath = path.join(__dirname, '../output/generated-calendar-ring.svg');
  fs.writeFileSync(outputPath, svg);

  const stats = fs.statSync(outputPath);
  console.log(`Saved to: ${outputPath}`);
  console.log(`File size: ${(stats.size / 1024).toFixed(1)} KB`);
}

module.exports = {
  generateCalendarRing,
  generateChops,
  generateMonthDividers,
  generateZodiacDividers,
  CENTER,
  RING,
  MONTHS,
  ZODIAC_SIGNS
};
