/**
 * Quarters, Trigrams, Faces & Fifths Ring Generator
 *
 * Generates an integrated SVG showing the hierarchical structure:
 * - 4 Quarters (outermost conceptual layer)
 * - 8 Trigrams (I Ching building blocks)
 * - 16 Faces (mythological archetypes)
 * - 32 Fifths (pentagram patterns - 5-line hexagram fragments)
 *
 * All data derived from V3 Knowledge Engine:
 * - Quarters from binary bits 0-1
 * - Trigrams from binary bits 0-2 (lower) and 3-5 (upper)
 * - Faces from binary bits 0-3 (codon pattern)
 * - Fifths from binary bits 0-4
 *
 * METHODOLOGY (see docs/reference/SVG-GENERATION-METHODOLOGY.md):
 * - Use first-principles formulas, not per-quadrant adjustments
 * - Extract geometry from master SVG, generate transforms from principles
 * - Connect all content to V3 knowledge engine data sources
 */

const fs = require('fs');
const path = require('path');
const positioning = require('../../core/root-system/positioning-algorithm');
const shared = require('./shared-constants');

// Load knowledge engine data
const quartersData = require('../../knowledge-systems/quarters/mappings/quarters-mappings.json');
const trigramsData = require('../../knowledge-systems/trigrams/mappings/trigrams-mappings.json');
const facesData = require('../../knowledge-systems/faces/mappings/faces-mappings.json');
const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
const binaryIdentity = require('../../core/root-system/binary-identity.json').gates;

// ============================================================================
// GEOMETRY CONSTANTS (extracted from the-quarters.trigrams-faces-fifths.svg)
// ============================================================================
//
// COORDINATE SYSTEM:
// The master SVG uses two coordinate systems:
// 1. TEXT elements: Already in viewBox coordinates (no transform needed)
// 2. PATH elements: In Illustrator artboard coordinates with transform applied
//
// The artboard offset is: translate(-272.3629 -271.6611)
// This shifts Illustrator coordinates into the SVG viewBox space.

const GEOMETRY = {
  viewBox: { width: 896.1523, height: 896.6787 },
  center: { x: 447.6371, y: 448.3389 },

  // Illustrator artboard transform (used for path elements)
  artboardTransform: 'translate(-272.3629 -271.6611)',

  // Ring radii for the 32-fifths ring
  fifthsRing: {
    inner: 388.2825,
    outer: 418.936
  },

  // Stroke widths from master
  strokes: {
    quarterLine: 0.75,       // Quarter pyramid lines
    trigramLine: 0.6255,     // Trigram lines
    pyramidLine: 0.25,       // Pyramid connector lines
    divider: 0.4103,         // Face dividers
    ring: 0.42               // Ring circles
  }
};

// ============================================================================
// COLOR SCHEMES
// ============================================================================
// Two themes available:
// 1. 'light' - Original master SVG style (dark elements on light/transparent background)
// 2. 'dark' - Standard HD wheel style (light elements on dark background)

const COLOR_SCHEMES = {
  // Light theme - matches the original master SVG
  // Dark elements (#1d1d1b = near-black) on transparent/light background
  light: {
    background: 'none',           // Transparent background
    foreground: '#1d1d1b',        // Near-black for text, symbols, lines
    stroke: '#1d1d1b',            // Near-black strokes
    highlight: '#000000',         // Pure black for emphasis
    divider: '#000000'            // Black divider lines
  },

  // Dark theme - matches other HD wheel generators (shared-constants.js)
  // Light elements on dark blue-grey background
  dark: {
    background: '#151E25',        // Dark blue-grey canvas
    foreground: '#FFFFFF',        // White text and symbols
    stroke: '#FFFFFF',            // White strokes
    highlight: '#fab414',         // Gold accent color
    divider: '#FFFFFF'            // White divider lines
  }
};

// Default to light theme to match the master SVG
let activeColorScheme = COLOR_SCHEMES.light;

// Font configurations from master SVG
const FONTS = {
  quarterName: { family: 'Copperplate', size: 18.4909 },
  quarterKeyword: { family: 'Copperplate-Light, Copperplate', size: 13.448, weight: 300 },
  quarterPlanet: { family: 'Copperplate-Light, Copperplate', size: 11.767, weight: 300 },
  quarterCodon: { family: 'Copperplate', size: 8.4049 },
  trigramName: { family: 'Copperplate', size: 18.3718 },
  faceName: { family: 'Copperplate', size: 19.5787 },
  faceCodon: { family: 'Copperplate', size: 16.7414 }
};

// ============================================================================
// QUARTER DATA (from V3 knowledge engine)
// ============================================================================

/**
 * Get quarter information with positioning
 * Quarters are at 0°, 90°, 180°, 270° on the wheel
 *
 * POSITIONS EXTRACTED FROM MASTER SVG:
 * - Mutation (A): Top, matrix(1, -0.0067, -0.0074, 1, x, y) - nearly horizontal
 * - Duality (G): Right, matrix(0.0067, 1, -1, -0.0074, x, y) - nearly vertical
 * - Civilisation (U): Bottom, matrix(-1, 0.0067, 0.0074, -1, x, y) - inverted horizontal
 * - Initiation (C): Left, matrix(-0.0067, -1, 1, 0.0074, x, y) - inverted vertical
 */
function getQuarterData() {
  const quarters = [
    {
      name: 'Mutation',
      codonLetter: 'A',
      binaryPattern: '11',
      planet: 'Sirius',
      keyword: 'Transformation',
      svgAngle: 0,
      // Exact positions from master SVG
      positions: {
        codon: { x: 441.2279, y: 100.534, matrix: '1, 0, 0, 1' },
        keyword: { x: 392.1512, y: 128.3561, matrix: '1, -0.0067, -0.0074, 1' },
        name: { x: 403.9728, y: 149.7366, matrix: '1, -0.0067, -0.0074, 1' },
        planet: { x: 428.4497, y: 139.486, matrix: '1, -0.0067, -0.0074, 1' }
      }
    },
    {
      name: 'Duality',
      codonLetter: 'G',
      binaryPattern: '01',
      planet: 'Jupiter',
      keyword: 'Bonding',
      svgAngle: 90,
      positions: {
        codon: { x: 794.8148, y: 442.0525, matrix: '-0.0004, 1, -1, -0.0004' },
        keyword: { x: 767.914, y: 419.8765, matrix: '0.0067, 1, -1, -0.0074' },
        name: { x: 746.2725, y: 412.2439, matrix: '0.0067, 1, -1, -0.0074' },
        planet: { x: 756.6959, y: 425.9328, matrix: '0.0067, 1, -1, -0.0074' }
      }
    },
    {
      name: 'Civilisation',
      codonLetter: 'U',
      binaryPattern: '00',
      planet: 'Dubhe',
      keyword: 'Form',
      svgAngle: 180,
      positions: {
        codon: { x: 454.2226, y: 796.339, matrix: '-1, 0, 0, -1' },
        keyword: { x: 465.4014, y: 768.7719, matrix: '-1, 0.0067, 0.0074, -1' },
        name: { x: 504.276, y: 746.5507, matrix: '-1, 0.0067, 0.0074, -1' },
        planet: { x: 467.6162, y: 756.9552, matrix: '-1, 0.0067, 0.0074, -1' }
      }
    },
    {
      name: 'Initiation',
      codonLetter: 'C',
      binaryPattern: '10',
      planet: 'Alcyone',
      keyword: 'Mind',
      svgAngle: 270,
      positions: {
        codon: { x: 99.654, y: 455.2793, matrix: '0.0004, -1, 1, 0.0004' },
        keyword: { x: 127.2674, y: 465.9189, matrix: '-0.0067, -1, 1, 0.0074' },
        name: { x: 149.4245, y: 494.1287, matrix: '-0.0067, -1, 1, 0.0074' },
        planet: { x: 139.1325, y: 473.9305, matrix: '-0.0067, -1, 1, 0.0074' }
      }
    }
  ];

  return quarters;
}

// ============================================================================
// TRIGRAM DATA (from V3 knowledge engine)
// ============================================================================

/**
 * Get trigram information with positioning
 * 8 trigrams at 45° intervals
 *
 * CRITICAL: Positions extracted from master SVG transforms:
 * - Heaven: matrix(0.9239, 0.3827, ...) = ~22.5° from top
 * - Lake: matrix(0.9239, -0.3827, ...) = ~-22.5° (or 337.5°) - top-left
 * - Fire: matrix(0.3827, -0.9239, ...) = ~-67.5° (or 292.5°) - left-upper
 * - Thunder: matrix(-0.3827, -0.9239, ...) = ~-112.5° (or 247.5°) - left-lower
 * - Earth: matrix(-0.9239, -0.3827, ...) = ~-157.5° (or 202.5°) - bottom-left
 * - Mountain: matrix(-0.9239, 0.3827, ...) = ~157.5° - bottom-right
 * - Water: matrix(-0.3827, 0.9239, ...) = ~112.5° - right-lower
 * - Wind: matrix(0.3827, 0.9239, ...) = ~67.5° - right-upper
 */
function getTrigramData() {
  // Order and exact angles from master SVG analysis
  // Angles are SVG angles (0° = right, 90° = down, measured counter-clockwise for rotation)
  const trigramPositions = [
    { name: 'Heaven', angle: 22.5, textPos: { x: 550.3776, y: 113.3947 }, symbolPos: { x: 856, y: 378 } },
    { name: 'Lake', angle: -22.5, textPos: { x: 291.8863, y: 134.7727 }, symbolPos: { x: 567, y: 380 } },
    { name: 'Fire', angle: -67.5, textPos: { x: 116.73, y: 331.1638 }, symbolPos: { x: 377, y: 581 } },
    { name: 'Thunder', angle: -112.5, textPos: { x: 139.7408, y: 621.4145 }, symbolPos: { x: 372, y: 872 } },
    { name: 'Earth', angle: -157.5, textPos: { x: 337.1827, y: 781.763 }, symbolPos: { x: 564, y: 1048 } },
    { name: 'Mountain', angle: 157.5, textPos: { x: 623.0301, y: 753.98 }, symbolPos: { x: 871, y: 1053 } },
    { name: 'Water', angle: 112.5, textPos: { x: 780.2083, y: 556.5676 }, symbolPos: { x: 1055, y: 864 } },
    { name: 'Wind', angle: 67.5, textPos: { x: 760.725, y: 293.6725 }, symbolPos: { x: 1060, y: 571 } }
  ];

  return trigramPositions.map(pos => {
    const mapping = trigramsData.mappings.find(m => m.groupName === pos.name);

    // Calculate rotation matrix components (cos, sin for the angle)
    const angleRad = pos.angle * Math.PI / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    return {
      name: mapping.groupName,
      chineseName: mapping.chineseName,
      pinyin: mapping.pinyin,
      binaryPattern: mapping.binaryPattern,
      element: mapping.knowledge.element,
      quality: mapping.knowledge.quality,
      svgAngle: pos.angle,
      textPos: pos.textPos,
      symbolPos: pos.symbolPos,
      rotMatrix: { cos: cos.toFixed(4), sin: sin.toFixed(4) }
    };
  });
}

// ============================================================================
// FACE DATA (from V3 knowledge engine)
// ============================================================================

/**
 * Get face information with positioning
 * 16 faces at 22.5° intervals
 */
function getFaceData() {
  // Face order on the wheel (derived from binary sequence)
  const faceOrder = [
    'Hades', 'Prometheus', 'Vishnu', 'Keepers of the Wheel',
    'Kali', 'Mitra', 'Michael', 'Janus',
    'Minerva', 'Christ', 'Harmonia', 'Thoth',
    'Maat', 'Parvati', 'Lakshmi', 'Maia'
  ];

  return faceOrder.map((name, index) => {
    const mapping = facesData.mappings.find(m => m.groupName === name);
    const svgAngle = index * 22.5 + 11.25;  // Offset by half to center between dividers

    return {
      name: mapping.groupName,
      codonPattern: mapping.codonPattern.toLowerCase(),
      binaryPattern: mapping.binaryPattern,
      mythology: mapping.knowledge.mythology,
      archetype: mapping.knowledge.archetype,
      svgAngle: svgAngle,
      textRotation: calculateTextRotation(svgAngle)
    };
  });
}

// ============================================================================
// FIFTHS DATA (derived from binary patterns)
// ============================================================================

/**
 * Get fifths information with positioning
 * 32 fifths at 11.25° intervals (2 per face)
 * Each fifth shows a 5-line pattern (first 5 bits of binary)
 */
function getFifthsData() {
  const fifths = [];

  // Group gates by their first 5 binary bits
  const fifthGroups = {};

  for (let gate = 1; gate <= 64; gate++) {
    const binary = binaryIdentity[gate].binary;
    const first5Bits = binary.substring(0, 5);

    if (!fifthGroups[first5Bits]) {
      fifthGroups[first5Bits] = [];
    }
    fifthGroups[first5Bits].push(gate);
  }

  // There should be 32 unique 5-bit patterns
  // Each pattern has 2 gates (differing only in the 6th bit)
  const patterns = Object.keys(fifthGroups).sort();

  patterns.forEach((pattern, index) => {
    const svgAngle = index * 11.25 + 5.625;  // Centered in each fifth

    fifths.push({
      binaryPattern: pattern,
      gates: fifthGroups[pattern],
      svgAngle: svgAngle,
      // Determine face this fifth belongs to
      face: getFaceFromBinary(pattern.substring(0, 4)),
      trigram: getTrigramFromBinary(pattern.substring(0, 3))
    });
  });

  return fifths;
}

/**
 * Get face name from 4-bit binary pattern
 */
function getFaceFromBinary(fourBits) {
  const bigramMap = { '11': 'A', '00': 'U', '10': 'C', '01': 'G' };
  const letter1 = bigramMap[fourBits.substring(0, 2)];
  const letter2 = bigramMap[fourBits.substring(2, 4)];
  const codonPattern = letter1 + letter2;

  const faceMap = {
    'AA': 'Hades', 'AC': 'Prometheus', 'AG': 'Vishnu', 'AU': 'Keepers of the Wheel',
    'CA': 'Kali', 'CC': 'Mitra', 'CG': 'Michael', 'CU': 'Janus',
    'GA': 'Minerva', 'GC': 'Christ', 'GG': 'Harmonia', 'GU': 'Thoth',
    'UA': 'Maat', 'UC': 'Parvati', 'UG': 'Lakshmi', 'UU': 'Maia'
  };

  return faceMap[codonPattern];
}

/**
 * Get trigram name from 3-bit binary pattern
 */
function getTrigramFromBinary(threeBits) {
  const trigramMap = {
    '111': 'Heaven', '000': 'Earth', '001': 'Mountain', '100': 'Thunder',
    '110': 'Lake', '011': 'Wind', '101': 'Fire', '010': 'Water'
  };
  return trigramMap[threeBits];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate text rotation so text is always readable from outside the circle
 */
function calculateTextRotation(svgAngle) {
  // Normalize to 0-360
  const normalized = ((svgAngle % 360) + 360) % 360;

  // Text on right side (315-45°) and left side (135-225°) needs different treatment
  if (normalized > 90 && normalized < 270) {
    // Bottom half - rotate text 180° so it reads from outside
    return svgAngle + 180;
  }
  return svgAngle;
}

/**
 * Calculate position on circle given angle and radius
 */
function calculatePosition(svgAngle, radius) {
  const radians = (svgAngle - 90) * Math.PI / 180;  // -90 to start from top
  return {
    x: GEOMETRY.center.x + radius * Math.cos(radians),
    y: GEOMETRY.center.y + radius * Math.sin(radians)
  };
}

/**
 * Generate a bigram symbol (2 yin/yang lines)
 * Used for quarter symbols
 */
function generateBigramSymbol(binary, x, y, rotation = 0) {
  const lineWidth = 20.82;
  const lineHeight = 4.957;
  const lineSpacing = 7.93;
  const yinGapWidth = 7.93;

  const lines = [];

  for (let i = 0; i < 2; i++) {
    const bit = binary[i];
    const lineY = -lineSpacing / 2 + (1 - i) * lineSpacing;  // Bottom to top

    if (bit === '1') {
      // YANG - solid line
      lines.push(`<rect x="${-lineWidth/2}" y="${lineY - lineHeight/2}" width="${lineWidth}" height="${lineHeight}"/>`);
    } else {
      // YIN - broken line (two segments with gap)
      const segmentWidth = (lineWidth - yinGapWidth) / 2;
      lines.push(`<rect x="${-lineWidth/2}" y="${lineY - lineHeight/2}" width="${segmentWidth}" height="${lineHeight}"/>`);
      lines.push(`<rect x="${yinGapWidth/2}" y="${lineY - lineHeight/2}" width="${segmentWidth}" height="${lineHeight}"/>`);
    }
  }

  return `<g transform="translate(${x.toFixed(4)}, ${y.toFixed(4)}) rotate(${rotation})" fill="${activeColorScheme.foreground}">
    ${lines.join('\n    ')}
  </g>`;
}

/**
 * Generate a trigram symbol (3 yin/yang lines)
 */
function generateTrigramSymbol(binary, x, y, rotation = 0) {
  const lineWidth = 20.1444;
  const lineHeight = 4.7962;
  const lineSpacing = 7.674;
  const yinGapWidth = 7.674;

  const lines = [];

  for (let i = 0; i < 3; i++) {
    const bit = binary[i];
    const lineY = -lineSpacing + (2 - i) * lineSpacing;  // Bottom to top

    if (bit === '1') {
      // YANG - solid line
      lines.push(`<rect x="${-lineWidth/2}" y="${lineY - lineHeight/2}" width="${lineWidth}" height="${lineHeight}"/>`);
    } else {
      // YIN - broken line
      const segmentWidth = (lineWidth - yinGapWidth) / 2;
      lines.push(`<rect x="${-lineWidth/2}" y="${lineY - lineHeight/2}" width="${segmentWidth}" height="${lineHeight}"/>`);
      lines.push(`<rect x="${yinGapWidth/2}" y="${lineY - lineHeight/2}" width="${segmentWidth}" height="${lineHeight}"/>`);
    }
  }

  return `<g transform="translate(${x.toFixed(4)}, ${y.toFixed(4)}) rotate(${rotation})" fill="${activeColorScheme.foreground}">
    ${lines.join('\n    ')}
  </g>`;
}

/**
 * Generate a tetragram symbol (4 yin/yang lines) for faces
 */
function generateTetragramSymbol(binary, x, y, rotation = 0) {
  const lineWidth = 17.0243;
  const lineHeight = 4.0534;
  const lineSpacing = 6.4854;
  const yinGapWidth = 6.4854;

  const lines = [];

  for (let i = 0; i < 4; i++) {
    const bit = binary[i];
    const lineY = -lineSpacing * 1.5 + (3 - i) * lineSpacing;  // Bottom to top

    if (bit === '1') {
      // YANG - solid line
      lines.push(`<rect x="${-lineWidth/2}" y="${lineY - lineHeight/2}" width="${lineWidth}" height="${lineHeight}"/>`);
    } else {
      // YIN - broken line
      const segmentWidth = (lineWidth - yinGapWidth) / 2;
      lines.push(`<rect x="${-lineWidth/2}" y="${lineY - lineHeight/2}" width="${segmentWidth}" height="${lineHeight}"/>`);
      lines.push(`<rect x="${yinGapWidth/2}" y="${lineY - lineHeight/2}" width="${segmentWidth}" height="${lineHeight}"/>`);
    }
  }

  return `<g transform="translate(${x.toFixed(4)}, ${y.toFixed(4)}) rotate(${rotation})" fill="${activeColorScheme.foreground}">
    ${lines.join('\n    ')}
  </g>`;
}

/**
 * Generate a pentagram symbol (5 yin/yang lines) for fifths
 */
function generatePentagramSymbol(binary, x, y, rotation = 0) {
  const lineWidth = 10.928;
  const lineHeight = 2.8572;
  const lineSpacing = 4.034;
  const yinGapWidth = 4.034;

  const lines = [];

  for (let i = 0; i < 5; i++) {
    const bit = binary[i];
    const lineY = -lineSpacing * 2 + (4 - i) * lineSpacing;  // Bottom to top

    if (bit === '1') {
      // YANG - solid line
      lines.push(`<rect x="${-lineWidth/2}" y="${lineY - lineHeight/2}" width="${lineWidth}" height="${lineHeight}"/>`);
    } else {
      // YIN - broken line
      const segmentWidth = (lineWidth - yinGapWidth) / 2;
      lines.push(`<rect x="${-lineWidth/2}" y="${lineY - lineHeight/2}" width="${segmentWidth}" height="${lineHeight}"/>`);
      lines.push(`<rect x="${yinGapWidth/2}" y="${lineY - lineHeight/2}" width="${segmentWidth}" height="${lineHeight}"/>`);
    }
  }

  return `<g transform="translate(${x.toFixed(4)}, ${y.toFixed(4)}) rotate(${rotation})" fill="${activeColorScheme.foreground}">
    ${lines.join('\n    ')}
  </g>`;
}

// ============================================================================
// SVG GENERATION
// ============================================================================

/**
 * Generate the Quarter Structure group (division lines, pyramids, connectors)
 * These paths use Illustrator artboard coordinates with transform applied
 */
function generateQuarterStructure() {
  const transform = GEOMETRY.artboardTransform;
  const stroke = activeColorScheme.stroke;

  return `    <g id="Structure">
      <path id="CIVILISATION_Line" data-name="CIVILISATION Line" d="M732.8857,1009.0908c-8.4287-.0664-17.3408-.0664-25.7714,0l-.002-.25c8.4316-.0664,17.3438-.0664,25.7754,0Zm72.6309,2.1426c-23.168-1.24-47.6045-1.9609-72.6309-2.1426l.002-.25c25.03.1817,49.4707.9024,72.6426,2.1426Zm-98.4023-2.1426-.002-.25c-25.03.1817-49.4707.9024-72.6426,2.1426l.0137.25C657.6514,1009.9932,682.0879,1009.2725,707.1143,1009.0908Z" transform="${transform}" fill="${stroke}"/>
      <path id="DUALITY_Line" data-name="DUALITY Line" d="M1010.9863,805.584c-1.2422-23.1865-1.9638-47.6455-2.1455-72.6963-.0664-8.4316-.0664-17.3438,0-25.7754.167-23.0283.791-45.57,1.8565-67.0864q.1245-2.5137.2568-5.0093l.25.0137c-1.2227,23.0127-1.9336,47.2651-2.1133,72.084h0c-.0664,8.43-.0664,17.3421,0,25.7714.1817,25.0469.9033,49.502,2.1455,72.6846Z" transform="${transform}" fill="${stroke}"/>
      <path id="MUTATION_Line" data-name="MUTATION Line" d="M720,431.3335c-4.3364,0-8.6724-.0161-12.8877-.0493-23.3979-.17-46.2832-.8111-68.0933-1.9068q-2.0361-.1025-4.0595-.21l.0263-.499c23.0152,1.2236,47.2832,1.935,72.13,2.1157h0c7.6377.06,15.6729.0654,23.3848.0166q1.1967-.0073,2.3828-.0166c24.8467-.1807,49.1152-.8921,72.13-2.1157l.0273.499c-23.0234,1.2241-47.2988,1.936-72.1533,2.1167C728.6719,431.3174,724.3359,431.3335,720,431.3335Z" transform="${transform}" fill="${stroke}"/>
      <path id="INITIATION_Line" data-name="INITIATION Line" d="M431.2842,732.8877l-.5-.0039c.0659-8.4287.0659-17.3394,0-25.7676l.5-.0039C431.35,715.5435,431.35,724.4561,431.2842,732.8877Zm0,0-.5-.0039c-.1817,25.0459-.9033,49.499-2.145,72.68l.499.0273C430.38,782.4023,431.1021,757.9414,431.2842,732.8877Zm0-25.7754c-.1807-24.8462-.8916-49.1045-2.1138-72.102l-.499.0263c1.2212,22.99,1.9321,47.2407,2.1128,72.08Z" transform="${transform}" fill="${stroke}"/>
      <path id="Initiation-pyramid" d="M447.0151,606.926c-21.0094,17.8617-40.8339,33.4231-59.4735,46.9389M272.5013,720c31.3239-12.4318,69.6787-33.2426,115.04-66.135m59.4742,179.21c-21.01-17.862-40.8344-33.4237-59.4741-46.94m0,0C342.18,753.2426,303.8253,732.4318,272.5013,720" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.75"/>
      <path id="Initiation-line" d="M447.0158,833.0746c-2.226,27.4894-5.2418,52.5112-8.8653,75.2508m8.8646-301.3994c-2.226-27.4886-5.2407-52.5127-8.8642-75.2516m12.25,241.9533c1.2046-33.7306,1.2044-73.5239,0-107.2546m-3.3843,166.7015c1.5716-19.2847,2.7075-39.5211,3.3847-59.4469m-46.83,262.8016c13.3582-30.9386,25.7628-72.7736,34.58-128.1039m0-376.651c-8.817-55.3308-21.2221-97.165-34.58-128.1038M450.4,666.3731c-.6749-19.9021-1.8152-40.1966-3.385-59.4471" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10"/>
      <path id="Duality-line" d="M1001.8492,531.674c8.8171-55.3306,21.222-97.1647,34.58-128.1034m-34.58,504.7553c8.8171,55.33,21.2217,97.1649,34.58,128.1034m-34.58-504.7553c-3.6236,22.7393-6.6384,47.7637-8.8643,75.2528m-.0008,226.147c2.226,27.49,5.2418,52.5121,8.8654,75.2521m-12.25-134.6991c.677,19.9217,1.8133,40.1665,3.3847,59.447m.0008-226.147c-1.57,19.2547-2.71,39.5413-3.385,59.4473m0,0c-1.2048,33.73-1.2051,73.5226-.0005,107.2527" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10"/>
      <path id="Civilisation-Line" d="M908.3258,1001.85c55.33,8.817,97.165,21.2217,128.1035,34.58m-429.503-43.4452c-27.49,2.226-52.5123,5.2418-75.2522,8.8654m376.6517,0c-22.74-3.6236-47.7622-6.6393-75.252-8.8653m-301.4,8.8653c-55.33,8.817-97.1649,21.2217-128.1035,34.58M773.6267,989.6c-33.73-1.2045-73.523-1.2045-107.2532,0m0,0c-19.92.6769-40.1692,1.8135-59.4472,3.3847m226.1475,0c-19.2821-1.5715-39.523-2.7077-59.4471-3.3847" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10"/>
      <path id="MUTATION-Line" d="M531.6743,438.1508c-55.3307-8.817-97.1649-21.222-128.1037-34.58m504.755,34.58c55.3306-8.817,97.1649-21.222,128.1037-34.58m-504.755,34.58c22.739,3.6236,47.763,6.6384,75.2516,8.8643m226.1482,0c27.4886-2.2259,52.5125-5.2408,75.2515-8.8643M666.3732,450.4c33.73,1.2049,73.5232,1.2049,107.2536,0m-166.7009-3.3849c19.2572,1.57,39.54,2.71,59.4473,3.3849m107.2536,0c19.9038-.675,40.1941-1.8149,59.4473-3.3849" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10"/>
      <path id="Duality-pyramid" d="M1052.4584,653.8644c-18.64-13.516-38.4636-29.0754-59.4735-46.9376m59.4735,179.2087c-18.64,13.5162-38.4642,29.0759-59.4743,46.9383m59.4743-46.9383c45.3614-32.8922,83.7164-53.7038,115.04-66.1356-31.3239-12.4317-69.6789-33.2432-115.04-66.1355" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.75"/>
      <path id="Mutation-pyramid" d="M653.8649,387.5416c-13.5158,18.64-29.0772,38.4641-46.939,59.4735M786.135,387.5416c13.5158,18.64,29.0775,38.4642,46.9391,59.4735M653.8649,387.5416C686.7573,342.18,707.5682,303.8252,720,272.5013m0,0c12.4318,31.3239,33.2426,69.6786,66.135,115.04" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.75"/>
      <path id="Civilisation-pyramid" d="M606.9263,992.9841c17.8625,21.01,33.4219,40.8341,46.9382,59.4743m179.2093-59.4742c-17.8624,21.01-33.4221,40.8339-46.9382,59.4741m0,0c-32.8923,45.3615-53.7038,83.7165-66.1357,115.04m0,0c-12.4317-31.3239-33.2432-69.6789-66.1354-115.04" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.75"/>
    </g>`;
}

/**
 * Generate the 4 Quarters layer
 */
function generateQuartersLayer() {
  const parts = [];
  const quarters = getQuarterData();

  parts.push('  <g id="_4-Quarters" data-name="4-Quarters">');

  // Add Structure group first (pyramid lines, connectors)
  parts.push(generateQuarterStructure());

  // Add each quarter group
  quarters.forEach(quarter => {
    parts.push(generateQuarterGroup(quarter));
  });

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate a single quarter group with all its elements
 *
 * Uses exact positions extracted from master SVG for precision
 */
function generateQuarterGroup(quarter) {
  const parts = [];
  const pos = quarter.positions;

  parts.push(`    <g id="GROUP_-_${quarter.codonLetter}_-_${quarter.name.toUpperCase()}_-_${quarter.planet.toUpperCase()}_-_${quarter.keyword.toUpperCase()}" data-name="GROUP - ${quarter.codonLetter} - ${quarter.name.toUpperCase()} - ${quarter.planet.toUpperCase()} - ${quarter.keyword.toUpperCase()}">`);

  // Codon letter text - using exact position from master
  parts.push(`      <g id="TEXT_-_CODON-LETTER_-_${quarter.codonLetter}_" data-name="TEXT - CODON-LETTER - (${quarter.codonLetter})">`);
  parts.push(`        <text transform="matrix(${pos.codon.matrix}, ${pos.codon.x.toFixed(4)}, ${pos.codon.y.toFixed(4)})" font-size="${FONTS.quarterCodon.size}" fill="${activeColorScheme.foreground}" font-family="${FONTS.quarterCodon.family}">(${quarter.codonLetter})</text>`);
  parts.push('      </g>');

  // Keyword text - using exact position from master
  parts.push(`      <g id="TEXT_-_KEYWORD_-_${quarter.keyword}" data-name="TEXT - KEYWORD - ${quarter.keyword}">`);
  parts.push(`        <text transform="matrix(${pos.keyword.matrix}, ${pos.keyword.x.toFixed(4)}, ${pos.keyword.y.toFixed(4)})" font-size="${FONTS.quarterKeyword.size}" fill="${activeColorScheme.foreground}" font-family="${FONTS.quarterKeyword.family}" font-weight="${FONTS.quarterKeyword.weight}">${quarter.keyword}</text>`);
  parts.push('      </g>');

  // Quarter name text - using exact position from master
  parts.push(`      <g id="TEXT_-_NAME_-_${quarter.name}" data-name="TEXT - NAME - ${quarter.name}">`);
  parts.push(`        <text transform="matrix(${pos.name.matrix}, ${pos.name.x.toFixed(4)}, ${pos.name.y.toFixed(4)})" font-size="${FONTS.quarterName.size}" fill="${activeColorScheme.foreground}" font-family="${FONTS.quarterName.family}">${quarter.name}</text>`);
  parts.push('      </g>');

  // Planet text - using exact position from master
  parts.push(`      <g id="TEXT_-_PLANET_-_${quarter.planet}" data-name="TEXT - PLANET - ${quarter.planet}">`);
  parts.push(`        <text transform="matrix(${pos.planet.matrix}, ${pos.planet.x.toFixed(4)}, ${pos.planet.y.toFixed(4)})" font-size="${FONTS.quarterPlanet.size}" fill="${activeColorScheme.foreground}" font-family="${FONTS.quarterPlanet.family}" font-weight="${FONTS.quarterPlanet.weight}">${quarter.planet}</text>`);
  parts.push('      </g>');

  // Bigram symbol - use exact path data from master SVG
  // These use Illustrator artboard coordinates with transform applied
  const bigramPath = getBigramPath(quarter.codonLetter);
  parts.push(`      <path id="SYMBOL_-_BIGRAM_-_${quarter.codonLetter}_-_${getBigramDescription(quarter.binaryPattern)}" data-name="SYMBOL - BIGRAM - ${quarter.codonLetter} - ${getBigramDescription(quarter.binaryPattern)}" d="${bigramPath}" transform="${GEOMETRY.artboardTransform}" fill="${activeColorScheme.foreground}"/>`);

  parts.push('    </g>');

  return parts.join('\n');
}

/**
 * Get description of bigram (for symbol naming)
 */
function getBigramDescription(binary) {
  const line1 = binary[0] === '1' ? 'YANG' : 'YIN';
  const line2 = binary[1] === '1' ? 'YANG' : 'YIN';
  return `${line1} (BOTTOM) - ${line2} (TOP)`;
}

/**
 * Get the exact path data for a bigram symbol (in Illustrator artboard coordinates)
 * These paths are extracted from the master SVG and use the artboard transform
 */
function getBigramPath(codonLetter) {
  const paths = {
    // A (Mutation) - YANG BOTTOM, YANG TOP - two solid horizontal lines
    'A': 'M730.3983,388.3812h-20.82v-4.9571h20.82Zm0-12.8884h-20.82V380.45h20.82Z',
    // G (Duality) - YIN BOTTOM, YANG TOP - broken line bottom, solid top
    'G': 'M1050.6283,723.08h4.9571v7.9313h-4.9571Zm0-4.9571h4.9571V710.192h-4.9571Zm7.9314-7.9313v20.82h4.957v-20.82Z',
    // U (Civilisation) - YIN BOTTOM, YIN TOP - two broken horizontal lines
    'U': 'M717.51,1058.8916v4.957h-7.9313v-4.957Zm4.9571,0v4.957h7.9313v-4.957Zm-12.8884-7.9314v4.9571H717.51V1050.96Zm12.8884,0v4.9571h7.9313V1050.96Z',
    // C (Initiation) - YANG BOTTOM, YIN TOP - solid bottom, broken top
    'C': 'M389.2875,710.192v20.82H384.33v-20.82Zm-12.8884,20.82h4.9571V723.08h-4.9571Zm0-12.8884h4.9571V710.192h-4.9571Z'
  };
  return paths[codonLetter] || '';
}

/**
 * Generate the 8 Trigrams layer
 */
function generateTrigramsLayer() {
  const parts = [];
  const trigrams = getTrigramData();

  parts.push('  <g id="_8-Trigrams" data-name="8-Trigrams">');

  // Structure sublayer (trigram lines and pyramids)
  parts.push(generateTrigramStructure());

  // Content sublayer (names and symbols)
  trigrams.forEach(trigram => {
    parts.push(generateTrigramGroup(trigram));
  });

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate the Trigram Structure group (lines and pyramids)
 * These paths use Illustrator artboard coordinates with transform applied
 */
function generateTrigramStructure() {
  const transform = GEOMETRY.artboardTransform;
  const stroke = activeColorScheme.stroke;

  return `    <g id="Structure-2" data-name="Structure">
      <path id="MOUNTAIN-LINE" d="M860.0158,1027.7519c-7.0239,2.8448-14.4265,5.911-21.4063,8.8667l-.0876-.2069c6.9806-2.9562,14.3831-6.0223,21.4094-8.8681Zm61.0655-23.2092c-19.67,6.9408-40.2155,14.75-61.0655,23.2092l-.0844-.2085c20.853-8.4608,41.4016-16.2713,61.0753-23.2132ZM838.61,1036.6183l-.0877-.2069c-20.728,8.7626-40.7806,17.77-59.6009,26.7725l.0974.2029c18.8169-9,38.8664-18.0069,59.5911-26.7682Z" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.6255"/>
      <path id="WIND-LINE" d="M1063.3309,660.97c-9.0091-18.8317-18.0237-38.8994-26.7934-59.6445-2.956-6.9805-6.0222-14.3831-8.8679-21.4094-7.7844-19.1852-15.0215-38.1231-21.5394-56.3617q-.7612-2.1309-1.51-4.2492l.2124-.075c6.902,19.5353,14.6557,39.9245,23.0454,60.6011h0c2.8451,7.0247,5.9115,14.4276,8.8667,21.4063,8.7683,20.7415,17.7817,40.8064,26.7894,59.6348Z" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.6255"/>
      <path id="LAKE-LINE" d="M590.7079,407.8481c-3.602,1.4919-7.209,2.97-10.7217,4.3931-19.4932,7.909-38.7226,15.25-57.2154,21.8439q-1.7263.6153-3.4444,1.2223l-.15-.4236c19.5377-6.902,39.94-14.6606,60.64-23.0593h0c6.3646-2.5779,13.0406-5.3376,19.4295-8.0314q.9915-.4179,1.9735-.8336c20.5759-8.6986,40.4889-17.6391,59.1842-26.5738l.1944.405c-18.7024,8.9381-38.6211,17.881-59.2034,26.5827C597.9053,404.8511,594.3093,406.3563,590.7079,407.8481Z" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.6255"/>
      <path id="THUNDER-LINE" d="M412.367,859.8617l-.417.1686c-2.8452-7.0236-5.9109-14.4249-8.8654-21.4029l.414-.1752C406.4545,845.4325,409.5208,852.8355,412.367,859.8617Zm0,0-.417.1686c8.4662,20.8661,16.28,41.4256,23.2239,61.1072l.4239-.1489C428.6519,901.3,420.8355,880.7344,412.367,859.8617Zm-8.8681-21.41c-8.6986-20.5755-17.6351-40.48-26.5629-59.1618l-.4054.1935c8.9238,18.6755,17.8581,38.5742,26.554,59.1435Z" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.6255"/>
      <path id="WATER-LINE" d="M1036.7,838.5894c-2.9551,6.9782-6.0214,14.3808-8.8667,21.4062l-.2085-.0844c2.8458-7.0263,5.912-14.4288,8.868-21.4094Zm26.7686-59.5911c-9.0013,18.8169-18.0073,38.8663-26.7686,59.5911l-.2069-.0876c8.7626-20.728,17.77-40.7807,26.7725-59.601Zm-35.6353,80.9973-.2085-.0844c-8.4609,20.8531-16.2714,41.4016-23.2132,61.0752l.2124.0746C1011.5649,901.3907,1019.3738,880.8454,1027.8333,859.9956Z" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.6255"/>
      <path id="HEAVEN-LINE" d="M921.1084,435.4716c-19.6864-6.9456-40.2507-14.7613-61.1208-23.2293-7.0263-2.8457-14.4288-5.9119-21.41-8.8681-19.07-8.0616-37.5787-16.3353-55.0842-24.6231q-2.0451-.9684-4.0724-1.9368l.0973-.203c18.6941,8.9331,38.5939,17.8677,59.1473,26.5559h0c6.9788,2.9555,14.3818,6.0215,21.4061,8.8668,20.8667,8.4666,41.428,16.2809,61.1112,23.2252Z" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.6255"/>
      <path id="FIRE-LINE" d="M407.93,590.6877c-1.492,3.6019-2.9972,7.1975-4.475,10.6879-8.1913,19.3762-16.5975,38.1645-25.0117,55.903q-.7857,1.6559-1.5712,3.3l-.4054-.1936c8.9348-18.6958,17.8752-38.6085,26.574-59.1848h0c2.6777-6.3233,5.4466-12.9956,8.0594-19.418q.4056-.9968.806-1.9849c8.3984-20.7,16.1572-41.1029,23.0591-60.64l.4239.149c-6.9044,19.5448-14.6651,39.9533-23.0663,60.66C410.9,583.4792,409.4212,587.0863,407.93,590.6877Z" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.6255"/>
      <path id="EARTH-LINE" d="M601.4519,1036.4129l-.1752.4139c-6.9783-2.9546-14.38-6.02-21.4029-8.8654l.1688-.417C587.0681,1030.3908,594.4711,1033.4571,601.4519,1036.4129Zm0,0-.1752.4139c20.7411,8.768,40.8039,17.7809,59.631,26.7874l.1944-.4051C642.2686,1054.1991,622.1992,1045.1838,601.4519,1036.4129Zm-21.4094-8.8681c-20.7-8.3983-41.0938-16.1538-60.6164-23.0511l-.15.4236c19.5156,6.8953,39.9036,14.6484,60.5973,23.0442Z" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.6255"/>
      <path id="Wind-pyramid" d="M1133.4348,548.75c-33.6954.5017-77.093-4.0475-131.5856-17.0756M1133.4348,548.75c-24.1831,23.4738-51.6536,57.3635-80.9764,105.1148" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.25"/>
      <path id="Earth-pyramid" d="M531.6741,1001.85c13.028,54.4925,17.5772,97.89,17.0755,131.5853m105.1149-80.9764c-47.7513,29.3228-81.6411,56.7932-105.1149,80.9764" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.25"/>
      <path id="Mountain-pyramid" d="M786.1356,1052.4583c47.7513,29.3228,81.641,56.7933,105.1147,80.9765M908.3258,1001.85c-13.0281,54.4925-17.5771,97.89-17.0755,131.5853" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.25"/>
      <path id="Water-pyramid" d="M1001.85,908.3259c54.4925-13.0281,97.89-17.5772,131.5853-17.0756m-80.9764-105.1148c29.3228,47.7513,56.7932,81.6411,80.9764,105.1148" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.25"/>
      <path id="Lake-pyramid" d="M548.75,306.5651c.5017,33.6956-4.047,77.0926-17.0753,131.5857M548.75,306.5651c23.4738,24.1831,57.364,51.6535,105.1153,80.9765" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.25"/>
      <path id="Heaven-pyramid" d="M891.25,306.5651c-23.4737,24.1832-57.364,51.6537-105.1153,80.9765M891.25,306.5651c-.5016,33.6956,4.047,77.0926,17.0753,131.5857" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.25"/>
      <path id="Thunder-pyramid" d="M387.5417,786.1349c-29.3229,47.7514-56.7933,81.6416-80.9766,105.1154,33.6956-.5016,77.0925,4.0469,131.5854,17.0751" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.25"/>
      <path id="Fire-pyramid" d="M438.1509,531.6744c-54.4931,13.0282-97.89,17.5769-131.5858,17.0752,24.1833,23.4738,51.6537,57.364,80.9765,105.1153" transform="${transform}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.25"/>
    </g>`;
}

/**
 * Get the exact path data for a trigram symbol (in Illustrator artboard coordinates)
 * These paths are extracted from the master SVG and use the artboard transform
 */
function getTrigramSymbolPath(trigramName) {
  const paths = {
    // Heaven - 3 solid lines (111)
    'Heaven': 'M850.11,378.3114l20.1444,8.3441-1.9867,4.7963-20.1444-8.3441Zm1.192-2.8773,20.1444,8.344,1.9867-4.7963-20.1447-8.3445Zm5.1654-12.47-1.9867,4.7963,20.1443,8.3441,1.9868-4.7963Z',
    // Lake - 2 solid, 1 broken top (110)
    'Lake': 'M566.736,387.9456l20.1444-8.3441,1.9867,4.7962-20.1444,8.3434Zm-1.1921-2.8778,20.1445-8.3441-1.9867-4.7963-20.1446,8.3437Zm7.305-17.6357,1.9867,4.7962,7.674-3.1787-1.9866-4.7962Zm-4.7963,1.9867-7.674,3.1787,1.9867,4.7962,7.6741-3.1787Z',
    // Fire - solid, broken, solid (101)
    'Fire': 'M377.2988,587.878l8.344-20.1443,4.7964,1.9866-8.3438,20.1444Zm2.2876-13.6624,3.1787-7.674-4.7963-1.9866-3.1787,7.674Zm-6.783,2.81-3.1786,7.674,4.7962,1.9868,3.1787-7.674Zm-10.8527,4.4953,4.7963,1.9866,8.3441-20.1444-4.7964-1.9867Z',
    // Thunder - solid bottom, 2 broken (100)
    'Thunder': 'M385.9985,872.4969l-8.3441-20.1443,4.7962-1.9868,8.3441,20.1444Zm-10.8527-4.4953,3.1787,7.674,4.7962-1.9866-3.1787-7.674Zm2.81-6.783-3.1788-7.674-4.7962,1.9866,3.1787,7.674ZM367.472,871.18l3.1787,7.674,4.7962-1.9866-3.1787-7.674Zm-1.9867-4.7963,4.7962-1.9867-3.1787-7.674-4.7962,1.9867Z',
    // Wind - broken bottom, 2 solid (011)
    'Wind': 'M1059.5224,584.422l3.1787,7.674-4.7963,1.9866-3.1787-7.674Zm-9.9617-10.4834,3.1787,7.674,4.7963-1.9867-3.1787-7.674Zm7.6741-3.1787,8.3441,20.1443,4.7963-1.9866-8.3441-20.1444Zm12.47-5.1654-4.7963,1.9867,8.344,20.1444,4.7964-1.9868Z',
    // Water - broken, solid, broken (010)
    'Water': 'M1055.5106,863.3813l-3.1787,7.674-4.7962-1.9867,3.1787-7.674Zm-2.81-6.7831,4.7963,1.9868,3.1788-7.674-4.7964-1.9868Zm7.3051,17.6358,8.344-20.1444-4.7963-1.9867-8.344,20.1445Zm7.674,3.1787,3.1788-7.674-4.7964-1.9868-3.1787,7.6741Zm5.1654-12.47,3.1787-7.674-4.7963-1.9867-3.1786,7.6741Z',
    // Mountain - 2 broken, solid top (001)
    'Mountain': 'M871.2447,1052.7331l-7.674,3.1787-1.9866-4.7962,7.674-3.1787Zm-14.4569.3691-7.674,3.1787,1.9866,4.7962,7.6741-3.1787Zm15.649,2.5087-7.674,3.1787,1.9866,4.7963,7.6741-3.1788Zm-12.47,5.1654-7.674,3.1787,1.9866,4.7962,7.6741-3.1787Zm17.6357,7.3049-1.9867-4.7962-20.1444,8.3441,1.9867,4.7962Z',
    // Earth - 3 broken lines (000)
    'Earth': 'M569.7121,1048.5479l7.674,3.1787-1.9867,4.7962-7.674-3.1787Zm12.47,5.1654-1.9867,4.7963,7.674,3.1786,1.9867-4.7962Zm-17.6357,7.3049,7.674,3.1787,1.9867-4.7962-7.6741-3.1787Zm12.47,5.1655,7.674,3.1786,1.9868-4.7962-7.6741-3.1788Zm-15.649,2.5087,7.674,3.1786,1.9867-4.7962-7.6741-3.1787Zm12.47,5.1653,7.674,3.1786,1.9867-4.7962-7.6741-3.1787Z'
  };
  return paths[trigramName] || '';
}

/**
 * Get trigram symbol description for ID naming
 */
function getTrigramSymbolDescription(trigramName) {
  const descriptions = {
    'Heaven': 'YANG BOTTOM - YANG - YANG TOP',
    'Lake': 'YANG BOTTOM - YANG - YIN TOP',
    'Fire': 'YANG BOTTOM - YIN - YANG TOP',
    'Thunder': 'YANG BOTTOM - YIN - YIN TOP',
    'Wind': 'YIN BOTTOM - YANG - YANG TOP',
    'Water': 'YIN BOTTOM - YANG - YIN TOP',
    'Mountain': 'YIN BOTTOM - YIN - YANG TOP',
    'Earth': 'YIN BOTTOM - YIN - YIN TOP'
  };
  return descriptions[trigramName] || '';
}

/**
 * Generate a single trigram group
 *
 * Uses exact positions and paths from master SVG for precise alignment
 */
function generateTrigramGroup(trigram) {
  const parts = [];

  // Use extracted positions from master SVG
  const textPos = trigram.textPos;
  const cos = trigram.rotMatrix.cos;
  const sin = trigram.rotMatrix.sin;

  parts.push(`    <g id="GROUP_-_${trigram.name.toUpperCase()}" data-name="GROUP - ${trigram.name.toUpperCase()}">`);

  // Trigram name text - using exact position from master
  parts.push(`      <g id="TEXT_-_${trigram.name}" data-name="TEXT - ${trigram.name}">`);
  parts.push(`        <text transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${textPos.x.toFixed(4)}, ${textPos.y.toFixed(4)})" font-size="${FONTS.trigramName.size}" font-family="${FONTS.trigramName.family}" style="isolation: isolate" fill="${activeColorScheme.foreground}">${trigram.name}</text>`);
  parts.push('      </g>');

  // Trigram symbol - using exact path from master
  const symbolPath = getTrigramSymbolPath(trigram.name);
  const symbolDesc = getTrigramSymbolDescription(trigram.name);
  parts.push(`      <path id="SYMBOL_-_TRIGRAM_-_${trigram.name.toUpperCase()}_-_${symbolDesc.replace(/ /g, '_')}" data-name="SYMBOL - TRIGRAM - ${trigram.name.toUpperCase()} - ${symbolDesc}" d="${symbolPath}" transform="${GEOMETRY.artboardTransform}" fill="${activeColorScheme.foreground}"/>`);

  parts.push('    </g>');

  return parts.join('\n');
}

/**
 * Exact Face positions extracted from master SVG
 * Each face has: codon text position, name text position, rotation angle, and symbol path
 */
const FACE_POSITIONS = {
  'aa': { // Hades
    codon: { x: 639.5731, y: 134.2832, rot: 33.75 },
    name: { x: 662.6361, y: 74.3831, rot: 33.75 },
    symbolPath: 'M932.5577,387.9318l14.4326,9.6436-2.2961,3.4362-14.4325-9.6434Zm1.3777-2.0617,14.4325,9.6434,2.2961-3.4363-14.4325-9.6434Zm3.6737-5.4978,14.4325,9.6434,2.2961-3.4363-14.4325-9.6434Zm5.97-8.9345-2.296,3.4363,14.4325,9.6435,2.296-3.4363Z'
  },
  'ac': { // Prometheus
    codon: { x: 504.1029, y: 84.8831, rot: 11.2504 },
    name: { x: 473.1375, y: 14.882, rot: 11.2504 },
    symbolPath: 'M787.7284,335.9943l.8063-4.0534,17.0242,3.3864-.8062,4.0534Zm19.1206-7.1525-17.0243-3.3864-.8063,4.0534,17.0243,3.3864Zm1.29-6.4855L791.1148,318.97l-.8063,4.0534,17.0242,3.3863Zm1.29-6.4854-6.4854-1.29-.8063,4.0534,6.4855,1.29Zm-11.3454,1.9571-6.4854-1.29.8063-4.0534,6.4854,1.29Z'
  },
  'ag': { // Vishnu
    codon: { x: 359.4615, y: 91.1636, rot: -11.2504 },
    name: { x: 329.066, y: 33.3529, rot: -11.2504 },
    symbolPath: 'M634.0479,335.3273l17.0243-3.3864.8063,4.0534-17.0243,3.3864Zm-.4837-2.4321,17.0243-3.3864-.8063-4.0534-17.0243,3.3864Zm4.389-11.8289-6.4854,1.29.8062,4.0534,6.4855-1.29Zm4.86,3.2472,6.4854-1.29-.8062-4.0534-6.4855,1.29Zm-12.6352-8.4425.8063,4.0534,17.0243-3.3863-.8063-4.0534Z'
  },
  'au': { // Keepers of the Wheel
    codon: { x: 228.2305, y: 152.3831, rot: -33.75 },
    name: { x: 174.3974, y: 112.1901, rot: -33.75, hasSubtext: true, subtext: 'of the Wheel', subtextX: 186.1518, subtextY: 113.5361 },
    symbolPath: 'M494.9128,401.0116l-2.2961-3.4362,14.4325-9.6436,2.296,3.4364Zm8.4627-18.5778-14.4322,9.6434,2.2961,3.4363,14.4325-9.6434Zm-3.6737-5.4978L494.204,380.61l2.2961,3.4362,5.4978-3.6736Zm-8.9344,5.97-5.4978,3.6737,2.2961,3.4363,5.4978-3.6737Zm5.2606-11.4679-5.4978,3.6737,2.2961,3.4364,5.4978-3.6738Zm-8.9343,5.97-5.4982,3.6737,2.2961,3.4364,5.4978-3.6737Z'
  },
  'ca': { // Kali
    codon: { x: 131.4293, y: 258.1711, rot: -56.25 },
    name: { x: 76.6625, y: 227.4169, rot: -56.25 },
    symbolPath: 'M389.2089,511.5046l-3.4364-2.2961,9.6435-14.4325,3.4363,2.2961Zm.4716-12.6082,3.6738-5.4978-3.4364-2.296L386.2442,496.6Zm-5.7324,1.14-3.6736,5.4977,3.4362,2.2961,3.6738-5.4981Zm.4717-12.6081-9.6433,14.4325,3.4363,2.296,9.6435-14.4325Zm-5.4978-3.6738-9.6435,14.4325,3.4364,2.2961,9.6434-14.4325Z'
  },
  'cc': { // Mitra
    codon: { x: 82.0389, y: 393.8067, rot: -78.7496 },
    name: { x: 18.2865, y: 393.2213, rot: -78.7496 },
    symbolPath: 'M333.835,654.0378l-4.0534-.8062,3.3863-17.0243,4.0534.8063Zm-4.389-11.8289,1.29-6.4854-4.0534-.8063-1.29,6.4855Zm-4.86,3.2472-1.29,6.4855,4.0534.8063,1.29-6.4855Zm-4.389-11.8288-3.3863,17.0243,4.0534.8062,3.3863-17.0243Zm-6.4854-1.29-1.29,6.4855,4.0534.8063,1.29-6.4855Zm-2.0963,10.5389-1.29,6.4854,4.0534.8063,1.29-6.4854Z'
  },
  'cg': { // Michael
    codon: { x: 88.2852, y: 538.4474, rot: -101.2504 },
    name: { x: 31.4492, y: 573.5852, rot: -101.2504 },
    symbolPath: 'M337.2213,806.912l-4.0534.8063-3.3863-17.0242,4.0534-.8063Zm-11.8288-4.389,1.29,6.4855,4.0534-.8063-1.29-6.4854Zm3.2472-4.86-1.29-6.4855-4.0535.8063,1.29,6.4854Zm-6.4855,1.29-1.29-6.4855-4.0534.8063,1.29,6.4855Zm-3.2472,4.86,1.29,6.4854,4.0534-.8063-1.29-6.4854Zm-8.5817-9.2489,3.3863,17.0242,4.0534-.8062-3.3863-17.0243Z'
  },
  'cu': { // Janus
    codon: { x: 149.5176, y: 669.5128, rot: -123.75 },
    name: { x: 104.1961, y: 714.3888, rot: -123.75 },
    symbolPath: 'M395.416,949.15l-9.6435-14.4325,3.4364-2.2961,9.6434,14.4324Zm-8.0315-7.557-3.6738-5.4978-3.4363,2.296,3.6737,5.4981Zm-1.14,5.7324,3.6737,5.4978,3.4363-2.296-3.6737-5.4981Zm-5.4978,3.6737,3.6737,5.498,3.4363-2.296-3.6737-5.4978Zm1.14-5.7324-3.6737-5.4978-3.4363,2.2961,3.6737,5.4977Zm-6.6383,9.406,3.6737,5.4981,3.4363-2.296-3.6737-5.4978Zm-2.296-3.4363,3.4362-2.2961-3.6736-5.4977-3.4364,2.296Z'
  },
  'ga': { // Minerva
    codon: { x: 745.6203, y: 231.4857, rot: 56.25 },
    name: { x: 784.3683, y: 176.7611, rot: 56.25 },
    symbolPath: 'M1044.191,494.776l3.6736,5.4978-3.4363,2.2961-3.6737-5.4978Zm2.5334,11.23,3.6737,5.4978,3.4363-2.296-3.6736-5.4978Zm-.4717-12.608,9.6435,14.4325,3.4363-2.2961-9.6434-14.4325Zm5.4978-3.6738,9.6438,14.4325,3.4363-2.296-9.6435-14.4325Zm8.9344-5.97-3.4363,2.296,9.6435,14.4325,3.4363-2.296Z'
  },
  'gc': { // Christ
    codon: { x: 806.7472, y: 362.337, rot: 78.7496 },
    name: { x: 864.8149, y: 333.5388, rot: 78.7496 },
    symbolPath: 'M1106.4393,636.2073l1.29,6.4854-4.0534.8063-1.29-6.4855Zm-1.9571,11.3454,1.29,6.4854,4.0534-.8063-1.29-6.4855Zm4.389-11.829,3.3864,17.0243,4.0533-.8062-3.3863-17.0243Zm6.4854-1.29,3.3864,17.0243,4.0534-.8063-3.3864-17.0243Zm11.8289,4.389-1.29-6.4854-4.0534.8063,1.29,6.4854Zm.8062,4.0534-4.0534.8063,1.29,6.4854,4.0533-.8062Z'
  },
  'gg': { // Harmonia
    codon: { x: 813.2047, y: 506.0432, rot: 101.2504 },
    name: { x: 880.525, y: 488.2771, rot: 101.2504 },
    symbolPath: 'M1109.8251,790.6941l-1.29,6.4854-4.0534-.8063,1.29-6.4854Zm-6.15,9.7325-1.29,6.4854,4.0539.8063,1.29-6.4854Zm8.5818-9.2489-3.3864,17.0243,4.0534.8063,3.3863-17.0242Zm9.2488,8.5818,1.29-6.4854-4.0534-.8063-1.29,6.4854Zm-4.86,3.2472-1.29,6.4854,4.0534.8063,1.29-6.4854Zm12.635-8.4425-4.0533-.8063-3.3864,17.0243,4.0534.8062Z'
  },
  'gu': { // Thoth
    codon: { x: 764.2326, y: 641.2736, rot: 123.75 },
    name: { x: 823.359, y: 665.5068, rot: 123.75 },
    symbolPath: 'M1050.3981,932.421l3.4363,2.2961-3.6736,5.4981-3.4363-2.2961Zm-5.97,8.9344-3.6738,5.4978,3.4364,2.2961,3.6736-5.4978Zm5.2607,11.4678,9.6434-14.4325-3.4363-2.2959-9.6435,14.4325Zm5.4977,3.6738,3.6738-5.4981-3.4363-2.2961-3.6737,5.4978Zm5.97-8.9344,3.6737-5.4978-3.4363-2.2961-3.6737,5.4978Zm5.4978,3.6736,3.6737-5.4977-3.4363-2.2961-3.6737,5.4978Zm-5.97,8.9345,3.6736-5.4981-3.4363-2.296-3.6736,5.4978Z'
  },
  'ua': { // Maat
    codon: { x: 666.6466, y: 748.2259, rot: 146.25 },
    name: { x: 707.4171, y: 796.3, rot: 146.25 },
    symbolPath: 'M946.99,1046.35l-5.4978,3.6737-2.2961-3.4364,5.4978-3.6736Zm-11.23,2.5334-5.4981,3.6737,2.296,3.4364,5.4978-3.6737Zm12.608-.4716-5.4981,3.6736,2.2961,3.4363,5.4978-3.6736Zm-8.9344,5.97-5.4977,3.6737,2.296,3.4363,5.4978-3.6737Zm12.6081-.4717-14.4325,9.6434,2.2961,3.4364,14.4325-9.6436Zm5.97,8.9344-2.296-3.4363-14.4325,9.6435,2.296,3.4363Z'
  },
  'uc': { // Parvati
    codon: { x: 536.0303, y: 809.5324, rot: 168.7496 },
    name: { x: 568.0561, y: 866.9342, rot: 168.7496 },
    symbolPath: 'M795.02,1110.6946l-6.4854,1.29-.8063-4.0534,6.4855-1.29Zm9.7326-6.15-6.4855,1.29.8063,4.0533,6.4854-1.29Zm1.29,6.4855-6.4854,1.29.8062,4.0534,6.4855-1.29Zm-10.5388,2.0963-6.4855,1.29.8063,4.0534,6.4855-1.29Zm11.8288,4.389-17.0242,3.3864.8063,4.0534,17.0242-3.3864Zm-8.4425,12.6351-.8062-4.0534-6.4855,1.29.8063,4.0534Zm4.0534-.8062,6.4854-1.29-.8062-4.0533-6.4855,1.29Z'
  },
  'ug': { // Lakshmi
    codon: { x: 392.3241, y: 816.1405, rot: -168.7496 },
    name: { x: 401.5744, y: 881.7967, rot: -168.7496 },
    symbolPath: 'M640.5334,1109.8883l-6.4855-1.29.8063-4.0534,6.4855,1.29Zm4.86-3.2472-.8063,4.0534,6.4855,1.29.8062-4.0534ZM640.05,1112.32l-6.4854-1.29-.8063,4.0534,6.4854,1.29Zm3.2472,4.86,6.4855,1.29.8063-4.0533-6.4855-1.29Zm-1.29,6.4854,6.4855,1.29.8063-4.0534-6.4855-1.29Zm-3.2471-4.86-6.4855-1.29-.8063,4.0534,6.4855,1.29Zm-8.5818,9.2488,17.0243,3.3864.8062-4.0534-17.0242-3.3863Z'
  },
  'uu': { // Maia
    codon: { x: 256.8612, y: 767.3487, rot: -146.25 },
    name: { x: 225.9082, y: 821.9873, rot: -146.25 },
    symbolPath: 'M494.9128,1042.9139l5.4977,3.6737-2.296,3.4363-5.4978-3.6737Zm8.9344,5.97-2.2961,3.4363,5.4978,3.6737,2.2961-3.4363Zm-14.9039,2.9648,5.4978,3.6736,2.2961-3.4363-5.4978-3.6736Zm8.9344,5.97,5.4981,3.6737,2.2961-3.4363-5.4978-3.6737Zm-12.6081-.4717,5.4978,3.6737,2.2961-3.4364-5.4978-3.6736Zm8.9344,5.97,5.4978,3.6738,2.296-3.4364L496.5,1059.88Zm-12.6081-.4716,5.4981,3.6737,2.2961-3.4364-5.4978-3.6737Zm8.9344,5.97,5.4978,3.6737,2.296-3.4363-5.4978-3.6737Z'
  }
};

/**
 * Face Structure: divider lines extracted from master
 */
const FACE_DIVIDERS = [
  { x1: 447.7106, y1: 32.5945, x2: 447.7106, y2: 59.5789 },
  { x1: 288.5408, y1: 64.2552, x2: 298.8672, y2: 89.1855 },
  { x1: 153.603, y1: 154.4175, x2: 172.6839, y2: 173.4983 },
  { x1: 63.4404, y1: 289.355, x2: 88.3707, y2: 299.6815 },
  { x1: 31.7794, y1: 448.5248, x2: 58.7638, y2: 448.5248 },
  { x1: 63.4401, y1: 607.6946, x2: 88.3704, y2: 597.3682 },
  { x1: 153.6024, y1: 742.6324, x2: 172.6832, y2: 723.5516 },
  { x1: 288.5399, y1: 832.795, x2: 298.8664, y2: 807.8647 },
  { x1: 447.7097, y1: 864.456, x2: 447.7097, y2: 837.4716 },
  { x1: 606.8795, y1: 832.7954, x2: 596.5531, y2: 807.865 },
  { x1: 741.8173, y1: 742.6331, x2: 722.7365, y2: 723.5522 },
  { x1: 831.9799, y1: 607.6955, x2: 807.0496, y2: 597.369 },
  { x1: 863.6409, y1: 448.5257, x2: 836.6565, y2: 448.5257 },
  { x1: 831.9803, y1: 289.3559, x2: 807.0499, y2: 299.6823 },
  { x1: 741.818, y1: 154.4181, x2: 722.7371, y2: 173.499 },
  { x1: 606.8804, y1: 64.2555, x2: 596.5539, y2: 89.1858 }
];

/**
 * Generate the 16 Faces layer
 */
function generateFacesLayer() {
  const parts = [];
  const faces = getFaceData();

  parts.push('  <g id="_16-Faces" data-name="16-Faces">');

  faces.forEach(face => {
    parts.push(generateFaceGroup(face));
  });

  // Face dividers - using exact positions from master
  parts.push('    <g id="Structure-3" data-name="Structure">');
  parts.push('      <g id="DIVIDERS">');
  FACE_DIVIDERS.forEach(div => {
    parts.push(`        <line x1="${div.x1}" y1="${div.y1}" x2="${div.x2}" y2="${div.y2}" fill="none" stroke="${activeColorScheme.divider}" stroke-miterlimit="10" stroke-width="${GEOMETRY.strokes.divider}"/>`);
  });
  parts.push('      </g>');
  parts.push('    </g>');

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate a single face group using exact positions from master
 */
function generateFaceGroup(face) {
  const parts = [];
  const facePos = FACE_POSITIONS[face.codonPattern];

  if (!facePos) {
    console.warn(`No position data for face: ${face.codonPattern}`);
    return '';
  }

  // Handle face names with spaces
  const faceId = face.name.replace(/\s+/g, '_').toUpperCase();

  parts.push(`    <g id="GROUP_-_${face.codonPattern.toUpperCase()}_-_${faceId}" data-name="GROUP - ${face.codonPattern.toUpperCase()} - ${face.name.toUpperCase()}">`);

  // Codon pattern text (e.g., "(aa)") - using exact position and rotation from master
  parts.push(`      <text id="TEXT_-_${face.codonPattern}_" data-name="TEXT - ${face.codonPattern} " transform="translate(${facePos.codon.x} ${facePos.codon.y}) rotate(${facePos.codon.rot})" font-size="${FONTS.faceCodon.size}" font-family="${FONTS.faceCodon.family}" fill="${activeColorScheme.foreground}" style="isolation: isolate">(${face.codonPattern})</text>`);

  // Face name text - handle special case for "Keepers of the Wheel" with subtext
  if (facePos.name.hasSubtext) {
    parts.push(`      <g id="TEXT_-_${face.name.replace(/\s+/g, '_')}" data-name="TEXT - ${face.name}" style="isolation: isolate">`);
    parts.push(`        <text transform="translate(${facePos.name.x} ${facePos.name.y}) rotate(${facePos.name.rot})" font-size="${FONTS.faceName.size}" font-family="${FONTS.faceName.family}" fill="${activeColorScheme.foreground}" style="isolation: isolate">Keepers</text>`);
    parts.push(`        <text transform="translate(${facePos.name.subtextX} ${facePos.name.subtextY}) rotate(${facePos.name.rot})" font-size="9.0727" font-family="${FONTS.faceName.family}" fill="${activeColorScheme.foreground}" style="isolation: isolate">${facePos.name.subtext}</text>`);
    parts.push('      </g>');
  } else {
    parts.push(`      <text id="TEXT_-_${face.name.replace(/\s+/g, '_')}" data-name="TEXT - ${face.name}" transform="translate(${facePos.name.x} ${facePos.name.y}) rotate(${facePos.name.rot})" font-size="${FONTS.faceName.size}" font-family="${FONTS.faceName.family}" fill="${activeColorScheme.foreground}" style="isolation: isolate">${face.name}</text>`);
  }

  // Tetragram symbol - using exact path from master
  parts.push(`      <path id="SYMBOL_-_FACE_-_${faceId}_-_${face.codonPattern.toUpperCase()}" data-name="SYMBOL - FACE - ${face.name.toUpperCase()} - ${face.codonPattern.toUpperCase()}" d="${facePos.symbolPath}" transform="${GEOMETRY.artboardTransform}" fill="${activeColorScheme.foreground}"/>`);

  parts.push('    </g>');

  return parts.join('\n');
}

/**
 * Generate the 32 Fifths layer
 */
function generateFifthsLayer() {
  const parts = [];
  const fifths = getFifthsData();

  parts.push('  <g id="_32-Fifths" data-name="32-Fifths">');

  // Structure (ring circles)
  parts.push('    <g id="Structure-4" data-name="Structure">');
  parts.push('      <g id="RINGS">');
  parts.push(`        <circle id="BOTTOM_RING" data-name="BOTTOM RING" cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${GEOMETRY.fifthsRing.inner}" fill="none" stroke="${activeColorScheme.stroke}" stroke-miterlimit="10" stroke-width="${GEOMETRY.strokes.ring}"/>`);
  parts.push(`        <circle id="TOP_RING" data-name="TOP RING" cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${GEOMETRY.fifthsRing.outer}" fill="none" stroke="${activeColorScheme.stroke}" stroke-miterlimit="10" stroke-width="${GEOMETRY.strokes.ring}"/>`);
  parts.push('      </g>');
  parts.push('    </g>');

  // Group fifths by trigram for organization
  const trigramGroups = {};
  fifths.forEach(fifth => {
    if (!trigramGroups[fifth.trigram]) {
      trigramGroups[fifth.trigram] = [];
    }
    trigramGroups[fifth.trigram].push(fifth);
  });

  // Generate fifths grouped by trigram
  Object.entries(trigramGroups).forEach(([trigram, trigramFifths]) => {
    parts.push(`    <g id="${trigram.toUpperCase()}">`);

    trigramFifths.forEach(fifth => {
      parts.push(generateFifthGroup(fifth));
    });

    parts.push('    </g>');
  });

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate a single fifth group (pentagram symbol)
 */
function generateFifthGroup(fifth) {
  const parts = [];
  const symbolRadius = (GEOMETRY.fifthsRing.inner + GEOMETRY.fifthsRing.outer) / 2;

  const symbolPos = calculatePosition(fifth.svgAngle, symbolRadius);
  const textRot = calculateTextRotation(fifth.svgAngle);

  // Use face name for ID
  const faceId = fifth.face.replace(/\s+/g, '-').toUpperCase();

  parts.push(`      <g id="${faceId}-${fifth.binaryPattern}" data-name="${fifth.face} - ${fifth.binaryPattern}">`);
  parts.push(`        ${generatePentagramSymbol(fifth.binaryPattern, symbolPos.x, symbolPos.y, textRot)}`);
  parts.push('      </g>');

  return parts.join('\n');
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

/**
 * Generate the complete Quarters-Trigrams-Faces-Fifths SVG
 *
 * @param {Object} options - Generation options
 * @param {boolean} options.includeQuarters - Include 4 quarters layer (default: true)
 * @param {boolean} options.includeTrigrams - Include 8 trigrams layer (default: true)
 * @param {boolean} options.includeFaces - Include 16 faces layer (default: true)
 * @param {boolean} options.includeFifths - Include 32 fifths layer (default: true)
 * @param {boolean} options.includeBackground - Include background rectangle (default: false for light, true for dark)
 * @param {string} options.colorScheme - 'light' or 'dark' theme (default: 'light')
 */
function generateQuartersTrigramsFacesRing(options = {}) {
  const {
    includeQuarters = true,
    includeTrigrams = true,
    includeFaces = true,
    includeFifths = true,
    colorScheme = 'light'
  } = options;

  // Set the active color scheme
  activeColorScheme = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.light;

  // Include background by default for dark theme, not for light
  const includeBackground = options.includeBackground !== undefined
    ? options.includeBackground
    : (colorScheme === 'dark');

  const parts = [];

  // SVG header
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${GEOMETRY.viewBox.width}" height="${GEOMETRY.viewBox.height}" viewBox="0 0 ${GEOMETRY.viewBox.width} ${GEOMETRY.viewBox.height}">`);

  // Optional background (uses active color scheme)
  if (includeBackground && activeColorScheme.background !== 'none') {
    parts.push(`  <rect width="100%" height="100%" fill="${activeColorScheme.background}"/>`);
  }

  // Generate layers from outside in
  if (includeQuarters) {
    parts.push(generateQuartersLayer());
  }

  if (includeTrigrams) {
    parts.push(generateTrigramsLayer());
  }

  if (includeFaces) {
    parts.push(generateFacesLayer());
  }

  if (includeFifths) {
    parts.push(generateFifthsLayer());
  }

  // Close SVG
  parts.push('</svg>');

  return parts.join('\n');
}

/**
 * Get statistics about the generated content
 */
function getStatistics() {
  const quarters = getQuarterData();
  const trigrams = getTrigramData();
  const faces = getFaceData();
  const fifths = getFifthsData();

  return {
    quarters: {
      count: quarters.length,
      names: quarters.map(q => q.name)
    },
    trigrams: {
      count: trigrams.length,
      names: trigrams.map(t => t.name)
    },
    faces: {
      count: faces.length,
      names: faces.map(f => f.name)
    },
    fifths: {
      count: fifths.length,
      uniquePatterns: fifths.length
    },
    dataSources: {
      quarters: 'knowledge-systems/quarters/mappings/quarters-mappings.json',
      trigrams: 'knowledge-systems/trigrams/mappings/trigrams-mappings.json',
      faces: 'knowledge-systems/faces/mappings/faces-mappings.json',
      binary: 'core/root-system/binary-identity.json'
    }
  };
}

// ============================================================================
// EXPORTS AND CLI
// ============================================================================

module.exports = {
  generateQuartersTrigramsFacesRing,
  getStatistics,
  getQuarterData,
  getTrigramData,
  getFaceData,
  getFifthsData,
  GEOMETRY,
  FONTS,
  COLOR_SCHEMES
};

// CLI execution
if (require.main === module) {
  const outputDir = path.join(__dirname, '../output');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const stats = getStatistics();

  console.log('Generating Quarters-Trigrams-Faces-Fifths Ring...');
  console.log('');
  console.log('Data sources (V3 Knowledge Engine):');
  console.log(`  - Quarters: ${stats.dataSources.quarters}`);
  console.log(`  - Trigrams: ${stats.dataSources.trigrams}`);
  console.log(`  - Faces: ${stats.dataSources.faces}`);
  console.log(`  - Binary: ${stats.dataSources.binary}`);
  console.log('');
  console.log('Content:');
  console.log(`  - ${stats.quarters.count} Quarters: ${stats.quarters.names.join(', ')}`);
  console.log(`  - ${stats.trigrams.count} Trigrams: ${stats.trigrams.names.join(', ')}`);
  console.log(`  - ${stats.faces.count} Faces: ${stats.faces.names.join(', ')}`);
  console.log(`  - ${stats.fifths.count} Fifths (5-bit patterns)`);
  console.log('');

  console.log('Color Schemes:');
  console.log('  - Light: Dark elements (#1d1d1b) on transparent background');
  console.log('  - Dark:  Light elements (#FFFFFF) on dark background (#151E25) with gold highlights (#fab414)');
  console.log('');

  // Generate both light and dark versions
  const versions = [
    { colorScheme: 'light', filename: 'generated-quarters-trigrams-faces-fifths-light.svg', label: 'Light theme' },
    { colorScheme: 'dark', filename: 'generated-quarters-trigrams-faces-fifths-dark.svg', label: 'Dark theme' }
  ];

  versions.forEach(({ colorScheme, filename, label }) => {
    const svg = generateQuartersTrigramsFacesRing({ colorScheme });
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, svg);
    console.log(`${label}: ${outputPath} (${(svg.length / 1024).toFixed(1)} KB)`);
  });

  console.log('\nDone!');
}
