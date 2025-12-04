/**
 * Branding Ring Generator
 *
 * Generates the logo and hexagram-based serial number system SVG.
 * Exact replica of the original mandala-with-logo-and-serial.svg branding.
 *
 * The serial number uses I-Ching hexagrams to encode:
 * - CENTURY: 2-digit century (e.g., 20 for 2000s)
 * - YEAR: 2-digit year within century (e.g., 25 for 2025)
 * - COLLECTION: Hexagram number representing the collection/theme
 * - STYLE: Hexagram number representing the style variant
 * - EDITION: Hexagram number for edition in series (highlighted in gold)
 *
 * Positioning: Bottom-right corner, NO rotation - hexagrams stack vertically
 * with line 1 at bottom, line 6 at top (standard I-Ching orientation)
 */

const fs = require('fs');
const path = require('path');
const positioning = require('../../core/root-system/positioning-algorithm');
const shared = require('./shared-constants');

// ============================================================================
// CONFIGURATION - Edit these values to customize the serial number
// ============================================================================
//
// Each value (1-64) becomes an I-Ching hexagram in the serial number stack.
// The hexagram patterns are generated from the HD gate binary data.
//
// Examples:
//   Hexagram 1 (The Creative)  = 111111 (all solid lines)
//   Hexagram 2 (The Receptive) = 000000 (all broken lines)
//   Hexagram 61 (Inner Truth)  = 110011
//   Hexagram 20 (Contemplation) = 000011
//   Hexagram 25 (Innocence)    = 100111
//
// ============================================================================

const CONFIG = {
  // ┌─────────────────────────────────────────────────────────────────────────┐
  // │  SERIAL NUMBER VALUES - Change these to customize your branding        │
  // └─────────────────────────────────────────────────────────────────────────┘

  century: 20,        // Century (1-64) → e.g., 20 for 2000s, 21 for 2100s
  year: 25,           // Year (1-64)    → e.g., 25 for year 25 of the century
  collection: 61,     // Collection (1-64) → Theme/series identifier
  style: 2,           // Style (1-64)   → Visual style variant (2 = DARK)
  edition: 1,         // Edition (1-64) → Number in series (shown in GOLD)

  // ┌─────────────────────────────────────────────────────────────────────────┐
  // │  Labels (for reference only - not displayed in SVG)                    │
  // └─────────────────────────────────────────────────────────────────────────┘
  labels: {
    century: 'CENTURY',
    year: 'YEAR',
    collection: 'COLLECTION - QUANTUM',
    style: 'STYLE - DARK',
    edition: 'Number in Series'
  }
};

// ============================================================================
// GEOMETRY CONSTANTS - Extracted from original mandala-with-logo-and-serial.svg
// Original viewBox: 14698 x 14698
// ============================================================================

// Geometry constants - UNIFORM SPACING VERSION
// All Y coordinates represent the TOP of lines (rect semantics)
const ORIGINAL = {
  viewBox: 14698,

  // Hexagram line dimensions
  lineWidth: 38.75,           // Full width of solid (yang) line
  lineHeight: 3.3214,         // Height of each line
  segmentWidth: 14.7619,      // Width of each broken line segment
  lineSpacing: 14.7619,       // Distance between line TOPs (uniform)
  dotRadius: 3.2292,          // Radius of separator dots
  dotGap: 12,                 // Gap between hexagram edge and dot center

  // Serial number X positions
  serial: {
    centerX: 13614.0056,       // Center X for dots
    rightX: 13633.06,          // Right edge of lines
    leftSegmentX: 13594.3105,  // Left segment X for broken lines
    rightSegmentX: 13618.2985, // Right segment X for broken lines
    // TOP of line 1 (bottommost line) of century hexagram
    line1TopY: 13628.9861
  },

  // Text position
  text: {
    x: 12598.4759,
    y: 13633.2907,
    fontSize: 160.5067,
    scaleX: 0.8
  },

  // Dandelion flower paths (exact from original)
  dandelion: {
    strokeWidth: 3
  }
};

// Colors
const COLORS = {
  white: '#fff',
  silver: '#D4D8DC',    // Tinted Silver - for text label only
  gold: '#fab300',
  background: '#151E25'
};

// ============================================================================
// HEXAGRAM DATA
// ============================================================================

/**
 * Get binary pattern for a gate number
 * Binary is stored bottom-to-top: index 0 = Line 1, index 5 = Line 6
 */
function getHexagramBinary(gateNumber) {
  const data = positioning.getDockingData(gateNumber, 1);
  return data.binary; // e.g., "111111" for hexagram 1
}

// ============================================================================
// SVG GENERATION - Exact replica of original structure
// ============================================================================

/**
 * Calculate uniform Y positions for the serial number
 * Layout (bottom to top): Century -> dot -> Year -> dot -> Collection -> dot -> Style -> dot -> Edition
 */
function calculateSerialPositions() {
  const centuryLine1TopY = ORIGINAL.serial.line1TopY;
  const centuryLine6TopY = centuryLine1TopY - (5 * ORIGINAL.lineSpacing);
  const dotBelowYearY = centuryLine6TopY - ORIGINAL.dotGap - ORIGINAL.dotRadius;
  const yearLine1TopY = dotBelowYearY - ORIGINAL.dotRadius - ORIGINAL.dotGap;
  const yearLine6TopY = yearLine1TopY - (5 * ORIGINAL.lineSpacing);
  const dotBelowCollectionY = yearLine6TopY - ORIGINAL.dotGap - ORIGINAL.dotRadius;
  const collectionLine1TopY = dotBelowCollectionY - ORIGINAL.dotRadius - ORIGINAL.dotGap;
  const collectionLine6TopY = collectionLine1TopY - (5 * ORIGINAL.lineSpacing);
  const dotBelowStyleY = collectionLine6TopY - ORIGINAL.dotGap - ORIGINAL.dotRadius;
  const styleLine1TopY = dotBelowStyleY - ORIGINAL.dotRadius - ORIGINAL.dotGap;
  const styleLine6TopY = styleLine1TopY - (5 * ORIGINAL.lineSpacing);
  const dotBelowEditionY = styleLine6TopY - ORIGINAL.dotGap - ORIGINAL.dotRadius;
  const editionLine1TopY = dotBelowEditionY - ORIGINAL.dotRadius - ORIGINAL.dotGap;

  return {
    centuryLine1TopY, dotBelowYearY,
    yearLine1TopY, dotBelowCollectionY,
    collectionLine1TopY, dotBelowStyleY,
    styleLine1TopY, dotBelowEditionY,
    editionLine1TopY
  };
}

/**
 * Generate a single hexagram line
 * IMPORTANT: topY is always the TOP of the line for consistent spacing
 * Both yang (solid) and yin (broken) use rect elements with identical positioning
 */
function generateHexLine(topY, isYang, fill = COLORS.white) {
  const leftX = ORIGINAL.serial.leftSegmentX;
  const rightSegX = ORIGINAL.serial.rightSegmentX;
  const segW = ORIGINAL.segmentWidth;
  const h = ORIGINAL.lineHeight;

  if (isYang) {
    // Solid line: single rectangle spanning full width
    const fullWidth = ORIGINAL.lineWidth;
    const fullLeftX = ORIGINAL.serial.rightX - fullWidth;
    return `        <rect x="${fullLeftX}" y="${topY}" width="${fullWidth}" height="${h}" fill="${fill}"/>`;
  } else {
    // Broken line: two rectangles with gap in middle
    return `        <rect x="${leftX}" y="${topY}" width="${segW}" height="${h}" fill="${fill}"/>
        <rect x="${rightSegX}" y="${topY}" width="${segW}" height="${h}" fill="${fill}"/>`;
  }
}

/**
 * Generate a complete hexagram (6 lines from bottom to top)
 * @param {number} gateNumber - Gate/hexagram number (1-64)
 * @param {number} line1TopY - TOP Y position for line 1 (bottom line)
 * @param {string} id - Element ID
 * @param {string} dataName - data-name attribute
 * @param {string} fill - Fill color
 */
function generateHexagram(gateNumber, line1TopY, id, dataName, fill = COLORS.white) {
  const binary = getHexagramBinary(gateNumber);
  const lines = [];

  // Lines 1-6: line 1 at bottom, line 6 at top
  // Each line's TOP is spaced by lineSpacing going upward
  for (let i = 0; i < 6; i++) {
    const lineTopY = line1TopY - (i * ORIGINAL.lineSpacing);
    const isYang = binary[i] === '1';
    lines.push(generateHexLine(lineTopY, isYang, fill));
  }

  return `      <g id="${id}" data-name="${dataName}">
${lines.join('\n')}
      </g>`;
}

/**
 * Generate separator dot
 */
function generateDot(id, dataName, y) {
  return `      <circle id="${id}" data-name="${dataName}" cx="${ORIGINAL.serial.centerX}" cy="${y}" r="${ORIGINAL.dotRadius}" fill="${COLORS.white}"/>`;
}

/**
 * Generate the complete serial number with uniform spacing
 */
function generateSerialNumber(config) {
  const pos = calculateSerialPositions();
  const parts = [];

  // 1. CENTURY hexagram (bottom)
  parts.push(generateHexagram(
    config.century,
    pos.centuryLine1TopY,
    `CENTURY_-_${config.century}`,
    `CENTURY - ${config.century}`
  ));

  // Dot between Century and Year
  parts.push(generateDot('Dot_Above_CENTURY', 'Dot Above CENTURY', pos.dotBelowYearY));

  // 2. YEAR hexagram
  parts.push(generateHexagram(
    config.year,
    pos.yearLine1TopY,
    `YEAR_-_${config.year}`,
    `YEAR - ${config.year}`
  ));

  // Dot between Year and Collection
  parts.push(generateDot('Dot_Above_YEAR', 'Dot Above YEAR', pos.dotBelowCollectionY));

  // 3. COLLECTION hexagram
  parts.push(generateHexagram(
    config.collection,
    pos.collectionLine1TopY,
    `COLLECTION_-_${config.collection}`,
    `COLLECTION - ${config.collection}`
  ));

  // Dot between Collection and Style
  parts.push(generateDot('Dot_Above_COLLECTION', 'Dot Above COLLECTION', pos.dotBelowStyleY));

  // 4. STYLE hexagram
  parts.push(generateHexagram(
    config.style,
    pos.styleLine1TopY,
    `STYLE_-_${config.style}`,
    `STYLE - ${config.style}`
  ));

  // Dot between Style and Edition
  parts.push(generateDot('Dot_Above_STYLE', 'Dot Above STYLE', pos.dotBelowEditionY));

  // 5. EDITION hexagram (highlighted in gold, top)
  parts.push(generateHexagram(
    config.edition,
    pos.editionLine1TopY,
    `EDITION_-_${config.edition}`,
    `Number in the Series - ${config.edition}`,
    COLORS.gold
  ));

  return `    <g id="SERIAL_NUMBER" data-name="SERIAL NUMBER">
${parts.join('\n')}
    </g>`;
}

/**
 * Generate the dandelion flower logo (exact paths from original)
 */
function generateDandelionLogo() {
  const sw = ORIGINAL.dandelion.strokeWidth;
  const stroke = COLORS.gold;

  return `    <g id="LOGO" data-name="LOGO">
      <g id="FLOWER" data-name="FLOWER">
        <g id="Dandelion">
          <path id="Stem" d="M13295.6257,13591.2822c-155.8768-22.551-156.8047-197.4485-15.1752-227.0327" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13158.7039,13314.5929c.3756-.2346,78.4656,39.0238,121.6523,46.4656" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13201.1308,13295.7236a113.2114,113.2114,0,0,0,17,20.6918c7.3055,6.9978,13.4223,10.9537,35.8012,24.9,13.9074,7.4241,25.2375,14.5533,27.288,16.9456" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13286.8756,13188.1775c0-1.6495-6.84-1.3122-10.5155.8247-18.5239,10.7711-25.7947,49.7854-27.6289,60.2064-9.8959,56.2234,22.6022,98.41,34.2269,106.679" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13299.914,13224.8676c-24.4643,23.4508-27.9188,68.2284-15.2842,129.338" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13352.7314,13207.0117c-.9026,6.5645-.5186,17.7993-7.5427,27.6872-14.8565,20.9138-27.1816,32.627-35.5136,48.0879-7.8206,14.512-20.1482,35.7108-22.5382,71.0587" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13364.3763,13272.6168c-35.8063,30.3435-66.2719,56.01-74.6746,81.1135" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13420.8851,13282.7529c-4.0563-2.1414-14.4656-1.55-24.2172,2.8631-10.7022,4.844-31.3313,25.7215-48.9379,36.9245-21.1074,11.3783-36.5416,16.4857-56.0221,31.4985" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13404.9516,13349.4323c-15.75,3.4569-44.7825-5.2719-79.1755-3.7114-12.2959.558-23.0795,7.53-32.3712,10.5155" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13420.5745,13383.2855c-18.5772-3.3119-48.1689-22.3978-89.2786-25.9795-13.9986-1.22-26.7051,2.1659-37.5259.8248" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13377.0872,13403.3048c-21.9218-17.7-50.0141-31.6134-83.2406-42.3754" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13369.9192,13435.4274c-3.6209-10.98-30.2612-35.491-77.0319-71.8353" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13325.6207,13448.3742c-8.0126-37.8565-18.8462-67.4484-34.6463-82.49" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13300.5789,13472.4335c-2.5861-14.0909-6.2883-29.7124-4.52-46.3863,2.2417-21.1359-2.8405-40.5955-7.55-59.192" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13272.3081,13437.38c2.7849-17.3236,12.5145-43.9356,13.0955-70.1221" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
          <path d="M13227.2838,13447.8948c8.9719-14.7014,19.0267-41.5624,42.1085-67.6881,6.1366-6.9458,11.64-9.6926,13.2432-13.8432" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${sw}"/>
        </g>
      </g>
    </g>`;
}

/**
 * Generate the text label (exact from original)
 */
function generateTextLabel() {
  return `    <g id="LOGO_TEXT" data-name="LOGO TEXT">
      <text transform="translate(${ORIGINAL.text.x} ${ORIGINAL.text.y}) scale(${ORIGINAL.text.scaleX} 1)" font-size="${ORIGINAL.text.fontSize}" fill="${COLORS.silver}" font-family="Kanit-Thin, Kanit" font-weight="200" letter-spacing="-0.006em">uni<tspan x="215.5566" y="0" letter-spacing="-0.071em">q</tspan><tspan x="299.6619" y="0">uenes</tspan><tspan x="707.1814" y="0" letter-spacing="0.11em">s.</tspan><tspan x="837.1911" y="0" letter-spacing="-0.051em">l</tspan><tspan x="865.7605" y="0" letter-spacing="-0.006em">and</tspan></text>
    </g>`;
}

// ============================================================================
// MAIN GENERATION
// ============================================================================

/**
 * Generate the complete branding SVG
 *
 * Options:
 *   viewBox: number - Target viewBox size (default: 14698 to match original)
 *                     The branding will scale proportionally to maintain
 *                     its position relative to the bottom-right corner.
 *   includeBackground: boolean - Include background rect (default: true)
 *   standalone: boolean - Generate complete SVG or just the group (default: true)
 */
function generateBrandingRing(config = CONFIG, options = {}) {
  const {
    viewBox = ORIGINAL.viewBox,
    includeBackground = true,  // Always include background by default
    standalone = true
  } = options;

  // Calculate scale factor if using different viewBox
  const scale = viewBox / ORIGINAL.viewBox;

  const svgParts = [];

  if (standalone) {
    svgParts.push(`<svg id="BRANDING" xmlns="http://www.w3.org/2000/svg" width="${viewBox}" height="${viewBox}" viewBox="0 0 ${viewBox} ${viewBox}">`);

    if (includeBackground) {
      svgParts.push(`  <rect id="background" width="100%" height="100%" fill="${COLORS.background}"/>`);
    }
  }

  // If scaling, wrap in a transform group
  if (scale !== 1) {
    svgParts.push(`  <g id="LOGO_and_Serial_Number" data-name="LOGO and Serial Number" transform="scale(${scale})">`);
  } else {
    svgParts.push(`  <g id="LOGO_and_Serial_Number" data-name="LOGO and Serial Number">`);
  }

  // Serial number
  svgParts.push(generateSerialNumber(config));

  // Logo (dandelion)
  svgParts.push(generateDandelionLogo());

  // Text label
  svgParts.push(generateTextLabel());

  svgParts.push('  </g>');

  if (standalone) {
    svgParts.push('</svg>');
  }

  return svgParts.join('\n');
}

/**
 * Get just the branding group (for embedding in other SVGs)
 *
 * @param {Object} config - Serial number configuration
 * @param {number} targetViewBox - The viewBox size of your target SVG
 *                                 (branding will scale to match corner position)
 */
function getBrandingGroup(config = CONFIG, targetViewBox = ORIGINAL.viewBox) {
  return generateBrandingRing(config, {
    viewBox: targetViewBox,
    standalone: false,
    includeBackground: false
  });
}

// ============================================================================
// EXPORTS AND CLI
// ============================================================================

module.exports = {
  generateBrandingRing,
  getBrandingGroup,
  generateSerialNumber,
  generateHexagram,
  getHexagramBinary,
  CONFIG,
  ORIGINAL,
  COLORS
};

// CLI execution
if (require.main === module) {
  const outputDir = path.join(__dirname, '../output');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Parse command line arguments for config overrides
  const args = process.argv.slice(2);
  const config = { ...CONFIG };
  let targetViewBox = ORIGINAL.viewBox;

  args.forEach(arg => {
    const [key, value] = arg.split('=');
    if (key === 'viewBox') {
      targetViewBox = parseInt(value, 10);
    } else if (key && value && config.hasOwnProperty(key)) {
      config[key] = parseInt(value, 10);
    }
  });

  console.log('Generating Branding Ring...');
  console.log('');
  console.log('  ┌─────────────────────────────────────┐');
  console.log('  │  SERIAL NUMBER CONFIGURATION        │');
  console.log('  ├─────────────────────────────────────┤');
  console.log(`  │  Century:    Hexagram ${String(config.century).padStart(2)}           │`);
  console.log(`  │  Year:       Hexagram ${String(config.year).padStart(2)}           │`);
  console.log(`  │  Collection: Hexagram ${String(config.collection).padStart(2)}           │`);
  console.log(`  │  Style:      Hexagram ${String(config.style).padStart(2)}           │`);
  console.log(`  │  Edition:    Hexagram ${String(config.edition).padStart(2)} (gold)    │`);
  console.log('  └─────────────────────────────────────┘');
  console.log('');
  console.log(`  ViewBox: ${targetViewBox} x ${targetViewBox}`);
  console.log('');

  const svg = generateBrandingRing(config, { viewBox: targetViewBox });
  const outputPath = path.join(outputDir, 'generated-branding-ring.svg');
  fs.writeFileSync(outputPath, svg);

  console.log(`Saved to: ${outputPath}`);
  console.log(`File size: ${(svg.length / 1024).toFixed(1)} KB`);
  console.log('');
  console.log('Usage:');
  console.log('  node branding-ring.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  century=N     Century hexagram (1-64, default: 20)');
  console.log('  year=N        Year hexagram (1-64, default: 25)');
  console.log('  collection=N  Collection hexagram (1-64, default: 61)');
  console.log('  style=N       Style hexagram (1-64, default: 2)');
  console.log('  edition=N     Edition hexagram (1-64, default: 1, shown in gold)');
  console.log('  viewBox=N     ViewBox size (default: 14698)');
  console.log('');
  console.log('Examples:');
  console.log('  node branding-ring.js');
  console.log('  node branding-ring.js edition=42 year=26');
  console.log('  node branding-ring.js viewBox=3972 century=21');
}
