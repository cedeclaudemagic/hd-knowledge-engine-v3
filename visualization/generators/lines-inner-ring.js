/**
 * 384 Inner Lines Ring Generator
 *
 * Generates the 384 lines ring SVG showing line numbers, keynotes,
 * yin/yang markers, and exalted/detriment planets for each line.
 *
 * KEY DIFFERENCE FROM lines-ring.js:
 * This ring displays the INNER gate's OWN lines at each wheel position.
 * Gate 41 position shows gate 41's lines (not its harmonic partner gate 30).
 * This is the "direct" or "self" view, compared to the "reversed/harmonic" view.
 *
 * Structure per gate (from center outward):
 * 1. Yin/Yang line markers (solid/broken rectangles)
 * 2. Detriment planet symbols
 * 3. Line numbers (1-6) - Herculanum font
 * 4. Exalted planet symbols
 * 5. Line keynotes - Copperplate font
 *
 * Line ordering within gate (5.625° arc):
 * - Line 6 at counter-clockwise edge
 * - Line 1 at clockwise edge
 * - Each line occupies ~0.9375° (5.625°/6)
 *
 * Text on left side of wheel flips 180° for readability.
 */

const fs = require('fs');
const path = require('path');
const positioning = require('../../core/root-system/positioning-algorithm');
const shared = require('./shared-constants');

// Load data sources
const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
const linesData = require('../../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');

// ============================================================================
// INNER GATE SEQUENCE (DIRECT - NO HARMONIC SWAP)
// ============================================================================
// Unlike lines-ring.js which shows OUTER gates (harmonics) at each position,
// this ring shows the INNER gate's own lines. Gate 41 shows gate 41's lines.
// No channel data or harmonic mapping needed.

const INNER_GATE_SEQUENCE = gateSequence;  // [41, 19, 13, 49, 30, 55, ...]

// ============================================================================
// RING GEOMETRY
// ============================================================================
// This ring sits OUTSIDE the channels ring, using the same center.
// Same geometry as the reversed lines ring.

// Center extracted from master SVG (OUTER-384-LINES-REVERSED.svg)
const CENTER = { x: 6536, y: 6536 };

// Ring boundaries from master SVG analysis
const RING = {
  innerRadius: 5160,     // Inner boundary (inside yin/yang markers) - moved out 25px
  outerRadius: 5658,     // Outer boundary (outside keynotes)
  dividerOuter: 6360,    // Extended divider length (3/4 of doubled)
  bandWidth: 523         // Total band width
};

// Band radii extracted from master SVG (from outside to inside):
// Positions calculated from gate 56 elements at top of wheel
const BAND_RADII = {
  keynote: 5487,         // Outermost - moved 56px inward (was 5543)
  detriment: 5432,       // Detriment planets - moved 48px inward (was 5480)
  lineNumber: 5357,      // Line numbers (1-6) - moved 43px inward (was 5400)
  exalted: 5287,         // Exalted planets - moved 33px inward (was 5320)
  yinYang: 5204          // Innermost - yin/yang markers - moved 19px inward (was 5223)
};

// ============================================================================
// FONT CONFIGURATION
// ============================================================================

const FONT = {
  lineNumber: {
    family: 'Herculanum',
    size: 71,          // 65 + 9%
    weight: 400
  },
  keynote: {
    family: 'Copperplate-Light, Copperplate',
    size: 60.2,        // 57.3 + 5%
    weight: 300
  }
};

// ============================================================================
// LINE GEOMETRY
// ============================================================================

const GATE_ARC = 5.625;  // Degrees per gate
const LINE_ARC = GATE_ARC / 6;  // ~0.9375° per line

// Line offsets from gate's LINE 1 position (in degrees)
// These match the reversed ring's positioning to ensure alignment with other rings.
// Line 6 is at -2.34375° (CCW edge), Line 1 is at +2.34375° (CW edge)
// The offsets are centered around the gate's midpoint (line 1 + 2.8125°)
const LINE_OFFSETS = {
  6: -2.34375,
  5: -1.40625,
  4: -0.46875,
  3: 0.46875,
  2: 1.40625,
  1: 2.34375
};

// ============================================================================
// PLANET SYMBOL PATHS
// ============================================================================
// Clean, normalized planet symbols from /COMPARISONS/planets.svg
// ViewBox: 0 0 128.5999 135.0432 - symbols are centered in this space
// Each path includes its own transform to position within the viewBox

const PLANET_SYMBOLS = {
  Sun: {
    path: 'M113.6705,120.63l-4.4489,3.1928a62.757,62.757,0,0,1-34.0744,11.99,63.9716,63.9716,0,1,1,50.763-29.077q-1.1208,1.745-2.3511,3.4153a19.1111,19.1111,0,0,0-4.0805,5.1926ZM107.5686,37.075a49.5114,49.5114,0,1,0-1.1036,70.0107c.0266-.0267.054-.0531.0814-.0795A49.51,49.51,0,0,0,107.5686,37.075ZM82.6665,82.1424a14.6521,14.6521,0,1,0-.0939.092C82.6042,82.2039,82.6355,82.1735,82.6665,82.1424Z',
    transform: 'translate(-7.7001 -4.6264)'
  },
  Moon: {
    path: 'M43.6372,129.7224l-6.093-3.5274a62.495,62.495,0,0,1-15.7471-14.0266,56.7146,56.7146,0,0,0,40.8263-7.7341A53.8866,53.8866,0,0,0,87.155,71.3388,56.458,56.458,0,0,0,63.3359,8.2508l1.0689-.2849a61.9718,61.9718,0,0,1,23.66,1.75A63.2693,63.2693,0,0,1,127.91,40.77a62.3758,62.3758,0,0,1,6.4349,45.0111,64.3037,64.3037,0,0,1-54.829,49.7337,59.9232,59.9232,0,0,1-26.6092-2.3093l-1.0833-.4072Zm51.8164-101.29a64.304,64.304,0,0,1-36.0945,91.263,49.5141,49.5141,0,0,0,36.0945-91.263Z',
    transform: 'translate(-7.7001 -4.6264)'
  },
  Mercury: {
    path: 'M108.6278,74.472a57.9017,57.9017,0,0,1-3.0657,6.2221A32.4065,32.4065,0,0,1,76.4015,96.7412l-1.1155-.31-4.1021,14.7434,13.8768,3.861-3.93,14.124-13.8768-3.861L63.2556,139.67l-14.1249-3.93,3.9643-14.2481L39.0942,117.596l3.93-14.1241,14.0008,3.8956,4.1021-14.7434a33.1776,33.1776,0,0,1,3.2256-59.5715,32.7949,32.7949,0,0,1-4.38-27.9158L73.8489,8.9979a10.607,10.607,0,0,0-.4908,5.6032,18.2625,18.2625,0,0,0,14.5186,17.388,18.5194,18.5194,0,0,0,20.1952-9.732l.3446-1.2386c.1378-.4953.5172-1.8587,2.4993-1.3073l12.39,3.4474-.4481,1.6107a3.0989,3.0989,0,0,1-.2759.9913,31.2528,31.2528,0,0,1-12.2941,15.4c-1.8108,1.2315-3.89,1.9874-5.7906,3.06l-.2069.7434a31.3789,31.3789,0,0,1,5.21,20.1377,13.0151,13.0151,0,0,0-.6839,5.8167Zm-48.94-16.0194a18.3908,18.3908,0,1,0,22.91-12.31c-.08-.0248-.161-.0481-.2417-.0713a18.2619,18.2619,0,0,0-22.406,11.92Z',
    transform: 'translate(-7.7001 -4.6264)'
  },
  Venus: {
    path: 'M67.2243,93.409,63.03,108.4841,77.4618,112.5l-4.087,14.689-14.5609-4.0514-4.0511,14.56L40.073,133.61l4.0152-14.431-14.5608-4.0514L33.65,100.31l14.5609,4.0514,4.1944-15.0752A43.4681,43.4681,0,0,1,29.5,60.8393a42.7972,42.7972,0,0,1,2.3892-29.0438A44.0043,44.0043,0,1,1,67.1535,93.6663ZM99.6427,57.7279A28.7564,28.7564,0,1,0,63.7781,76.8993l.1165.035A28.7558,28.7558,0,0,0,99.6429,57.7272Z',
    transform: 'translate(-7.7001 -4.6264)'
  },
  Mars: {
    path: 'M84.0189,48.4505,104.52,22.91,90.8241,24.817,88.9,11l37.7854-5.2611,4.5288,37.886-13.6955,1.9069-1.89-13.5725-20.31,26.0122a47.5315,47.5315,0,0,1,12.03,39.833,45.9238,45.9238,0,0,1-15.9714,28.5243A47.5324,47.5324,0,1,1,36.5082,49.2076a46.4243,46.4243,0,0,1,24.0307-6.4621A48.28,48.28,0,0,1,84.0189,48.4505Zm10.1,37.6087a32.5607,32.5607,0,1,0,.0852.6112Z',
    transform: 'translate(-7.7001 -4.6264)'
  },
  Jupiter: {
    path: 'M34.3078,25.9975,23.7256,16.0457A33.0842,33.0842,0,0,1,36.5534,7.4313,33.83,33.83,0,0,1,82.4361,39.0147a32.962,32.962,0,0,1-9.012,23.3687L51.9689,84.997l-1.02,1.3051,27.5893,5.5846L84.048,64.66l14.5206,2.9392-5.51,27.2267,28.073,5.6825-2.963,14.6422-27.952-5.658-5.8525,28.921-14.5206-2.9393,5.828-28.8L22.868,94.9781l1.1655-1.4017c12.622-13.82,25.3644-27.6162,37.8654-41.4617a18.6419,18.6419,0,0,0,4.1629-20.5714,19.1358,19.1358,0,0,0-30.8559-6.2459Z',
    transform: 'translate(-7.7001 -4.6264)'
  },
  Saturn: {
    path: 'M93.4932,26.9686,89.0871,40.49,75.0919,35.929,69.72,52.4158l.949.3093a29.1912,29.1912,0,0,1,33.5563,33.11,28.6912,28.6912,0,0,1-9.2733,17.1835L79.0732,117.5244a3.9916,3.9916,0,0,0,.4784,6.5848,4.4906,4.4906,0,0,0,4.4938-.5034L93.6642,134.35a17.3381,17.3381,0,0,1-10.8967,4.452A18.089,18.089,0,0,1,64.96,112.9244a18.5794,18.5794,0,0,1,4.81-6.3048L85.4146,92.4312a14.97,14.97,0,0,0,2.3167-19.188,14.2208,14.2208,0,0,0-13.6142-6.5363,13.97,13.97,0,0,0-12.5227,9.0392,19.412,19.412,0,0,0-.85,2.6094L53.362,101.01l-.5025,1.542-13.4022-4.368,22.5182-65.48L47.98,28.1429a3.8536,3.8536,0,0,1,.3479-1.0674l3.8649-11.8609c.3092-.9487.3865-1.1862,1.5723-.8l11.86,3.8654,1.4232.4638L71.61,4.7484,85.0118,9.1163,80.4512,23.1121Z',
    transform: 'translate(-7.7001 -4.6264)'
  },
  Uranus: {
    path: 'M120.297,24.0418a3.97,3.97,0,0,1-.3446,1.2386c-4.8261,17.3454-9.6519,34.69-15.38,51.9181l-.3446,1.2387-14.1249-3.93,5.6189-20.1947L82.4644,50.6237,76.57,71.81A35.75,35.75,0,0,1,94.0741,94.3a35.2344,35.2344,0,0,1-2.0608,23.721A35.7526,35.7526,0,1,1,62.39,67.5982l5.86-21.0621L54.9932,42.8474,49.3743,63.0421,35.25,59.1121a3.5834,3.5834,0,0,1,.31-1.1154c4.86-17.4686,9.7555-35.0621,15.6073-52.2549a3.578,3.578,0,0,1,.31-1.1154L65.4782,8.522,59.8249,28.8407l13.3814,3.7232,5.6189-20.1947L92.826,16.2647,87.2071,36.4594l13.3815,3.7232,5.6188-20.1947Zm-66.28,99.5593a20.9953,20.9953,0,1,0-.0068-.0019Z',
    transform: 'translate(-7.7001 -4.6264)'
  },
  Neptune: {
    path: 'M69.3937,80.9484a26.821,26.821,0,0,0,22.592-14.7708,26.2073,26.2073,0,0,0,2.2864-6.6587c2.5565-12.21,5.2664-25.1527,8.6322-37.5761l.2556-1.2208,13.7967,2.8886a2.121,2.121,0,0,1-.179.8548c-2.8632,13.6753-5.7521,27.4728-9.4957,41.0913a38.3006,38.3006,0,0,1-15.98,22.1451,40.0416,40.0416,0,0,1-24.2893,7.66s-1.1044.4059-1.1556.65l-2.8632,13.6753,13.5523,2.8374-2.9145,13.92L60.08,123.6071l-2.9655,14.1634-14.0408-2.94,2.94-14.0419L32.2166,117.9l2.9145-13.92,13.7967,2.8886.23-1.0993,2.5565-12.21c.179-.8548.2556-1.2207-.67-1.67A40.6664,40.6664,0,0,1,27.134,52.09a45.4255,45.4255,0,0,1,1.4572-6.96L37.3257,7.0654l.2556-1.2207L51.5,8.7588l-.23,1.0993L42.4334,48.4105A26.8211,26.8211,0,0,0,54.78,76.4862l1.3429.2811L70.8733,11.7951l13.919,2.9141Z',
    transform: 'translate(-7.7001 -4.6264)'
  },
  Pluto: {
    path: 'M117.9612,54.08a31.57,31.57,0,0,1-3.328,6.8425A47.9024,47.9024,0,0,1,67.6264,85.1336l-1.3219-.3678-5.818,20.9107,13.34,3.7117-3.8119,13.7-13.46-3.7452-3.8454,13.8206-13.701-3.8121,3.8453-13.8206-13.5808-3.7787,3.8119-13.7,13.4605,3.7452,5.818-20.9107a47.9029,47.9029,0,0,1-26.01-31.7088,46.7723,46.7723,0,0,1,.558-25.7408l13.5808,3.7787A33.68,33.68,0,0,0,47.0832,58.442,32.8081,32.8081,0,0,0,65.2753,69.8481a34.18,34.18,0,0,0,40.3289-23.48l13.5808,3.7786ZM47.1693,29.7328a26.6955,26.6955,0,0,0,17.955,33.21l.1086.0327A26.82,26.82,0,1,0,47.2088,29.6023C47.1958,29.6461,47.1823,29.689,47.1693,29.7328Zm38.1374,10.47a12.4749,12.4749,0,1,1-8.6746-15.3616A12.474,12.474,0,0,1,85.3067,40.2025Z',
    transform: 'translate(-7.7001 -4.6264)'
  },
  Earth: {
    path: 'M25.9038,116.6393a64.3018,64.3018,0,1,1,90.9247,1.2663c-.0559.055-.1124.11-.1689.1641A64.2974,64.2974,0,0,1,25.9038,116.6393Zm16.0833-5.4017a48.9947,48.9947,0,0,0,58.5637.9586L71.7486,82.434Zm-9.341-69.1832a48.8726,48.8726,0,0,0-.9592,58.5669L61.4478,71.8171Zm78.43,59.9321a48.8727,48.8727,0,0,0,.868-58.6577L82.73,72.6773ZM101.6446,32.894a49.508,49.508,0,0,0-32.6677-10.02,48.8683,48.8683,0,0,0-26.1684,9.1534L71.7928,61.7894Z',
    transform: 'translate(-7.7001 -4.6264)'
  }
};

// Symbol viewBox dimensions (all symbols fit in this space)
const SYMBOL_VIEWBOX = { width: 128.5999, height: 135.0432 };

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a position is on the left side of the wheel (needs text flip)
 */
function isFlipped(svgAngle) {
  const rotation = svgAngle + 180;
  const normalized = ((rotation % 360) + 360) % 360;
  return normalized > 90 && normalized < 270;
}

/**
 * Calculate radial text rotation (with flip for left side)
 */
function calculateRadialRotation(svgAngle) {
  let rotation = svgAngle + 180;
  if (isFlipped(svgAngle)) {
    rotation += 180;
  }
  while (rotation > 180) rotation -= 360;
  while (rotation < -180) rotation += 360;
  return rotation;
}

/**
 * Get line data from the traditional gates mappings
 */
function getLineData(gateNumber, lineNumber) {
  const entry = linesData.mappings.find(
    m => m.gateNumber === gateNumber && m.lineNumber === lineNumber
  );
  if (!entry) {
    console.warn(`No data found for gate ${gateNumber} line ${lineNumber}`);
    return null;
  }
  return entry.knowledge;
}

/**
 * Build index for fast line data lookup
 */
function buildLineDataIndex() {
  const index = {};
  linesData.mappings.forEach(m => {
    const key = `${m.gateNumber}.${m.lineNumber}`;
    index[key] = m.knowledge;
  });
  return index;
}

const lineDataIndex = buildLineDataIndex();

function getLineDataFast(gateNumber, lineNumber) {
  return lineDataIndex[`${gateNumber}.${lineNumber}`];
}

// ============================================================================
// SVG GENERATION
// ============================================================================

/**
 * Generate a yin/yang line marker (solid or broken rectangle)
 */
function generateYinYangMarker(x, y, rotation, isYang, scale = 1.875) {
  const width = 32 * scale;
  const height = 10 * scale;
  const gap = 6 * scale;

  if (isYang) {
    // Solid line (yang)
    return `<rect x="${-width/2}" y="${-height/2}" width="${width}" height="${height}" transform="translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(${rotation.toFixed(2)})" fill="${shared.COLORS.foreground}"/>`;
  } else {
    // Broken line (yin) - two rectangles with gap
    const segmentWidth = (width - gap) / 2;
    return `<g transform="translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(${rotation.toFixed(2)})">
      <rect x="${-width/2}" y="${-height/2}" width="${segmentWidth}" height="${height}" fill="${shared.COLORS.foreground}"/>
      <rect x="${gap/2}" y="${-height/2}" width="${segmentWidth}" height="${height}" fill="${shared.COLORS.foreground}"/>
    </g>`;
  }
}

/**
 * Generate a planet symbol at the given position
 * Uses clean normalized paths from /COMPARISONS/planets.svg
 *
 * The paths are normalized to a ~56×59 viewBox with built-in transform.
 * To place centered at (x, y): translate to position, rotate, scale, then
 * offset by half the viewBox to center the symbol.
 */
function generatePlanetSymbol(planet, x, y, rotation, scale = 0.44) {
  if (!planet || !PLANET_SYMBOLS[planet]) {
    return '';
  }

  const symbol = PLANET_SYMBOLS[planet];

  // Center offset: move symbol so its center (not corner) is at origin
  const halfWidth = SYMBOL_VIEWBOX.width / 2;
  const halfHeight = SYMBOL_VIEWBOX.height / 2;

  // Transform order: translate to target -> rotate -> scale -> center the symbol
  return `<g transform="translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(${rotation.toFixed(2)}) scale(${scale}) translate(${-halfWidth.toFixed(2)}, ${-halfHeight.toFixed(2)})">
    <path d="${symbol.path}" transform="${symbol.transform}" fill="${shared.COLORS.foreground}"/>
  </g>`;
}

/**
 * Generate a line number text element
 */
function generateLineNumber(lineNum, x, y, rotation, flipped) {
  const anchor = flipped ? 'end' : 'start';

  return `<text
    x="${x.toFixed(2)}" y="${y.toFixed(2)}"
    font-family="${FONT.lineNumber.family}"
    font-size="${FONT.lineNumber.size}"
    fill="${shared.COLORS.foreground}"
    text-anchor="middle"
    dominant-baseline="middle"
    transform="rotate(${rotation.toFixed(2)}, ${x.toFixed(2)}, ${y.toFixed(2)})"
  >${lineNum}</text>`;
}

/**
 * Generate a keynote text element
 */
function generateKeynote(keynote, x, y, rotation, flipped) {
  if (!keynote) return '';

  // Text aligned to inner ring (even edge inside, ragged edge outside):
  // Right side (not flipped): text-anchor="end" - text ends at inner edge, ragged extends outward
  // Left side (flipped 180°): text-anchor="start" - after flip, even edge aligns to inner
  const anchor = flipped ? 'start' : 'end';

  return `<text
    x="${x.toFixed(2)}" y="${y.toFixed(2)}"
    font-family="${FONT.keynote.family}"
    font-size="${FONT.keynote.size}"
    font-weight="${FONT.keynote.weight}"
    fill="${shared.COLORS.foreground}"
    text-anchor="${anchor}"
    dominant-baseline="middle"
    transform="rotate(${rotation.toFixed(2)}, ${x.toFixed(2)}, ${y.toFixed(2)})"
  >${keynote}</text>`;
}

/**
 * Generate all elements for a single line
 * Uses V3 positioning with offset to align with midpoint dividers
 */
function generateLineElements(gateNumber, lineNumber, wheelPosition) {
  const elements = [];

  // Get EXACT position for this specific line from the positioning algorithm
  const lineData_pos = positioning.getDockingData(gateNumber, lineNumber);

  // Center content within the line arc (add half a line arc)
  // Subtract half a gate arc (2.8125°) to align with midpoint dividers
  const HALF_GATE_ARC = GATE_ARC / 2;  // 2.8125°
  const lineAngle = lineData_pos.angle + (LINE_ARC / 2) - HALF_GATE_ARC;

  // Convert to SVG angle
  const svgAngle = shared.calculateSVGAngle(lineAngle);
  const radians = svgAngle * Math.PI / 180;

  // Check if this line is on the left side (needs text flip for readability)
  const flipped = isFlipped(svgAngle);
  const rotation = calculateRadialRotation(svgAngle);

  // Get line data
  const lineData = getLineDataFast(gateNumber, lineNumber);
  if (!lineData) return elements;

  // Get planet data
  const exaltedPlanets = lineData.blackBook?.exaltation?.planets || [];
  const detrimentPlanets = lineData.blackBook?.detriment?.planets || [];

  // 1. Keynote (outermost) - text aligned to inner edge
  const keynoteX = CENTER.x + BAND_RADII.keynote * Math.cos(radians);
  const keynoteY = CENTER.y + BAND_RADII.keynote * Math.sin(radians);
  elements.push(generateKeynote(lineData.lineKeynote, keynoteX, keynoteY, rotation, flipped));

  // 2. Exalted planet (right side) / Detriment planet (left side)
  // These swap positions based on wheel side
  // Some lines have 2 exalted or 2 detriment planets - show both side by side
  const exaltedX = CENTER.x + BAND_RADII.exalted * Math.cos(radians);
  const exaltedY = CENTER.y + BAND_RADII.exalted * Math.sin(radians);
  const dualPlanetOffset = 20; // Offset for dual planets (along radial direction)
  const dualPlanetScale = 0.29; // Dual planets (a third bigger than half size)

  if (flipped) {
    // Left side: detriment in exalted band position
    if (detrimentPlanets.length === 1) {
      elements.push(generatePlanetSymbol(detrimentPlanets[0].planet, exaltedX, exaltedY, rotation));
    } else if (detrimentPlanets.length >= 2) {
      // Two planets - side by side along radial direction (half size)
      const offset1X = exaltedX - dualPlanetOffset * Math.cos(radians);
      const offset1Y = exaltedY - dualPlanetOffset * Math.sin(radians);
      const offset2X = exaltedX + dualPlanetOffset * Math.cos(radians);
      const offset2Y = exaltedY + dualPlanetOffset * Math.sin(radians);
      elements.push(generatePlanetSymbol(detrimentPlanets[0].planet, offset1X, offset1Y, rotation, dualPlanetScale));
      elements.push(generatePlanetSymbol(detrimentPlanets[1].planet, offset2X, offset2Y, rotation, dualPlanetScale));
    }
  } else {
    // Right side: exalted in exalted band position
    if (exaltedPlanets.length === 1) {
      elements.push(generatePlanetSymbol(exaltedPlanets[0].planet, exaltedX, exaltedY, rotation));
    } else if (exaltedPlanets.length >= 2) {
      // Two planets - side by side along radial direction (half size)
      const offset1X = exaltedX - dualPlanetOffset * Math.cos(radians);
      const offset1Y = exaltedY - dualPlanetOffset * Math.sin(radians);
      const offset2X = exaltedX + dualPlanetOffset * Math.cos(radians);
      const offset2Y = exaltedY + dualPlanetOffset * Math.sin(radians);
      elements.push(generatePlanetSymbol(exaltedPlanets[0].planet, offset1X, offset1Y, rotation, dualPlanetScale));
      elements.push(generatePlanetSymbol(exaltedPlanets[1].planet, offset2X, offset2Y, rotation, dualPlanetScale));
    }
  }

  // 3. Line number (middle band)
  const lineNumX = CENTER.x + BAND_RADII.lineNumber * Math.cos(radians);
  const lineNumY = CENTER.y + BAND_RADII.lineNumber * Math.sin(radians);
  elements.push(generateLineNumber(lineNumber, lineNumX, lineNumY, rotation, flipped));

  // 4. Detriment planet (right side) / Exalted planet (left side)
  // These swap positions based on wheel side
  const detrimentX = CENTER.x + BAND_RADII.detriment * Math.cos(radians);
  const detrimentY = CENTER.y + BAND_RADII.detriment * Math.sin(radians);
  if (flipped) {
    // Left side: exalted in detriment band position
    if (exaltedPlanets.length === 1) {
      elements.push(generatePlanetSymbol(exaltedPlanets[0].planet, detrimentX, detrimentY, rotation));
    } else if (exaltedPlanets.length >= 2) {
      // Two planets - side by side along radial direction (half size)
      const offset1X = detrimentX - dualPlanetOffset * Math.cos(radians);
      const offset1Y = detrimentY - dualPlanetOffset * Math.sin(radians);
      const offset2X = detrimentX + dualPlanetOffset * Math.cos(radians);
      const offset2Y = detrimentY + dualPlanetOffset * Math.sin(radians);
      elements.push(generatePlanetSymbol(exaltedPlanets[0].planet, offset1X, offset1Y, rotation, dualPlanetScale));
      elements.push(generatePlanetSymbol(exaltedPlanets[1].planet, offset2X, offset2Y, rotation, dualPlanetScale));
    }
  } else {
    // Right side: detriment in detriment band position
    if (detrimentPlanets.length === 1) {
      elements.push(generatePlanetSymbol(detrimentPlanets[0].planet, detrimentX, detrimentY, rotation));
    } else if (detrimentPlanets.length >= 2) {
      // Two planets - side by side along radial direction (half size)
      const offset1X = detrimentX - dualPlanetOffset * Math.cos(radians);
      const offset1Y = detrimentY - dualPlanetOffset * Math.sin(radians);
      const offset2X = detrimentX + dualPlanetOffset * Math.cos(radians);
      const offset2Y = detrimentY + dualPlanetOffset * Math.sin(radians);
      elements.push(generatePlanetSymbol(detrimentPlanets[0].planet, offset1X, offset1Y, rotation, dualPlanetScale));
      elements.push(generatePlanetSymbol(detrimentPlanets[1].planet, offset2X, offset2Y, rotation, dualPlanetScale));
    }
  }

  // 5. Yin/Yang marker (innermost)
  const yinYangX = CENTER.x + BAND_RADII.yinYang * Math.cos(radians);
  const yinYangY = CENTER.y + BAND_RADII.yinYang * Math.sin(radians);
  const isYang = lineData.polarity === 'YANG';
  elements.push(generateYinYangMarker(yinYangX, yinYangY, rotation, isYang));

  return elements;
}

/**
 * Generate all elements for a single gate (6 lines)
 * KEY DIFFERENCE: Uses inner gate directly (no harmonic swap)
 */
function generateGateElements(wheelPosition) {
  const innerGate = gateSequence[wheelPosition];
  const displayGate = innerGate;  // Direct - no harmonic swap
  const elements = [];

  // Add gate group - note data-display-gate shows what lines are displayed (same as inner)
  elements.push(`  <g id="GATE-${displayGate}" data-wheel-position="${wheelPosition}" data-inner-gate="${innerGate}" data-display-gate="${displayGate}">`);

  // Generate all 6 lines (from 6 to 1 as they appear CCW to CW)
  for (let line = 6; line >= 1; line--) {
    const lineElements = generateLineElements(displayGate, line, wheelPosition);
    elements.push(`    <g id="LINE-${displayGate}.${line}" class="line" data-gate="${displayGate}" data-line="${line}">`);
    lineElements.forEach(el => elements.push('      ' + el));
    elements.push('    </g>');
  }

  elements.push('  </g>');

  return elements.join('\n');
}

/**
 * Generate divider lines between gates
 * Dividers are placed at the MIDPOINT between adjacent gates' line 1 positions
 */
function generateDividers() {
  const lines = [];

  for (let i = 0; i < 64; i++) {
    const gateA = gateSequence[i];
    const gateB = gateSequence[(i + 1) % 64];

    const v3DataA = positioning.getDockingData(gateA, 1);
    const v3DataB = positioning.getDockingData(gateB, 1);

    const angleA = v3DataA.angle;
    const angleB = v3DataB.angle;

    // Calculate midpoint angle
    let midAngle;
    if (Math.abs(angleB - angleA) > 180) {
      midAngle = ((angleA + angleB + 360) / 2) % 360;
    } else {
      midAngle = (angleA + angleB) / 2;
    }

    const svgAngle = shared.calculateSVGAngle(midAngle);
    const radians = svgAngle * Math.PI / 180;

    const x1 = CENTER.x + RING.innerRadius * Math.cos(radians);
    const y1 = CENTER.y + RING.innerRadius * Math.sin(radians);
    const x2 = CENTER.x + RING.dividerOuter * Math.cos(radians);
    const y2 = CENTER.y + RING.dividerOuter * Math.sin(radians);

    lines.push(`    <line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${shared.COLORS.foreground}" stroke-width="0.5"/>`);
  }

  return lines.join('\n');
}

/**
 * Generate the complete 384 inner lines ring SVG
 */
function generateInnerLinesRing(options = {}) {
  const {
    includeStructure = true,
    includeBackground = true,
    stroke = shared.COLORS.foreground,
    fill = shared.COLORS.foreground,
    backgroundColor = shared.COLORS.background
  } = options;

  // ViewBox must accommodate center + dividerOuter + margin
  const viewBoxSize = Math.max(CENTER.x, CENTER.y) + RING.dividerOuter + 200;
  const svgParts = [];

  // SVG header
  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${viewBoxSize}" height="${viewBoxSize}">`);

  // Background
  if (includeBackground) {
    svgParts.push(`  <rect id="background" width="100%" height="100%" fill="${backgroundColor}"/>`);
  }

  // Structure (dividers only - inner/outer rings removed for cleaner composition)
  if (includeStructure) {
    svgParts.push('  <g id="STRUCTURE">');
    svgParts.push('    <g id="DIVIDERS">');
    svgParts.push(generateDividers());
    svgParts.push('    </g>');
    svgParts.push('  </g>');
  }

  // Lines content - note the different group ID
  svgParts.push('  <g id="LINES-INNER">');

  for (let pos = 0; pos < 64; pos++) {
    svgParts.push(generateGateElements(pos));
  }

  svgParts.push('  </g>');

  // Close SVG
  svgParts.push('</svg>');

  return svgParts.join('\n');
}

// ============================================================================
// EXPORTS AND CLI
// ============================================================================

module.exports = {
  generateInnerLinesRing,
  INNER_GATE_SEQUENCE,
  CENTER,
  RING,
  BAND_RADII,
  PLANET_SYMBOLS
};

// CLI execution
if (require.main === module) {
  const outputPath = process.argv[2] || path.join(__dirname, '../output/generated-lines-inner-ring.svg');

  console.log('Generating 384 INNER lines ring...');
  console.log('  - 64 gates x 6 lines = 384 lines');
  console.log('  - Each line: yin/yang, detriment, number, exalted, keynote');
  console.log('  - Using INNER gate sequence (direct - no harmonic swap)');
  console.log('  - Gate 41 position shows gate 41 lines (not gate 30)');
  console.log('  - Text flip for left side readability');

  const svg = generateInnerLinesRing();

  fs.writeFileSync(outputPath, svg);
  console.log(`\nSaved to: ${outputPath}`);
  console.log(`File size: ${(svg.length / 1024).toFixed(1)} KB`);
}
