/**
 * 384 Lines Ring Generator
 *
 * Generates the 384 lines ring SVG showing line numbers, keynotes,
 * yin/yang markers, and exalted/detriment planets for each line.
 *
 * KEY INSIGHT: This ring displays the OUTER (harmonic) gates at positions
 * determined by INNER gates. When you look at gate 41's position on the wheel,
 * you see lines for gate 30 (its harmonic partner). This creates the "reversed"
 * appearance that aligns with the channels ring outer gate numbers.
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
const channelsData = require('../../knowledge-systems/channels/mappings/channels-mappings.json');

// ============================================================================
// OUTER GATE SEQUENCE
// ============================================================================
// The 384-lines ring displays OUTER gates (harmonics) at positions determined
// by INNER gates. For integration circuit gates (10, 20, 34, 57), we show the
// MIDDLE channel's outer gate to align with the channels ring display.

// Build gate→harmonic mapping
const gateToHarmonic = {};
channelsData.mappings.forEach(channel => {
  if (!gateToHarmonic[channel.gate1]) gateToHarmonic[channel.gate1] = channel.gate2;
  if (!gateToHarmonic[channel.gate2]) gateToHarmonic[channel.gate2] = channel.gate1;
});

// Override integration gates with their MIDDLE channel outer gates
// Based on MULTI_CHANNEL_PRESETS.optimal from channels-ring.js
const INTEGRATION_MIDDLE_GATES = {
  10: 34,  // Gate 10 position shows gate 34 lines
  20: 57,  // Gate 20 position shows gate 57 lines
  34: 20,  // Gate 34 position shows gate 20 lines
  57: 10   // Gate 57 position shows gate 10 lines
};
Object.assign(gateToHarmonic, INTEGRATION_MIDDLE_GATES);

// Build the outer gate sequence (what we display at each wheel position)
const OUTER_GATE_SEQUENCE = gateSequence.map(innerGate => gateToHarmonic[innerGate]);

// ============================================================================
// RING GEOMETRY
// ============================================================================
// Extracted from OUTER-384-LINES-REVERSED.svg master

const CENTER = { x: 6536, y: 6534.53 };

// Ring boundaries
const RING = {
  innerRadius: 5135.73,
  outerRadius: 6537,
  bandWidth: 1401.27
};

// Band radii (from center outward)
const BAND_RADII = {
  yinYang: 5379,        // Yin/Yang line markers
  detriment: 5478,      // Detriment planet symbols
  lineNumber: 5502,     // Line numbers (1-6)
  exalted: 5618,        // Exalted planet symbols
  keynote: 5658         // Line keynotes
};

// ============================================================================
// FONT CONFIGURATION
// ============================================================================

const FONT = {
  lineNumber: {
    family: 'Herculanum',
    size: 88,
    weight: 400
  },
  keynote: {
    family: 'Copperplate-Light, Copperplate',
    size: 60,
    weight: 300
  }
};

// ============================================================================
// LINE GEOMETRY
// ============================================================================

const GATE_ARC = 5.625;  // Degrees per gate
const LINE_ARC = GATE_ARC / 6;  // ~0.9375° per line

// Line offsets from gate center (in degrees)
// Line 6 is at -2.34375° (CCW edge), Line 1 is at +2.34375° (CW edge)
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
// These paths are extracted from the master SVG and normalized.
// Each path is drawn relative to origin and will be transformed for each position.

const PLANET_PATHS = {
  Sun: `M-28,-28a28,28,0,1,1,0,56a28,28,0,1,1,0,-56Zm0,6.5a21.5,21.5,0,1,0,0,43a21.5,21.5,0,1,0,0,-43Zm0,15.2a6.3,6.3,0,1,0,0,12.6a6.3,6.3,0,1,0,0,-12.6Z`,

  Moon: `M-5,-28c-15,0,-27,12,-27,27s12,27,27,27c4,0,8,-1,11,-3c-10,-5,-17,-16,-17,-28s7,-23,17,-28c-3,-2,-7,-3,-11,-3Zm8,5c-8,8,-8,22,0,30c8,8,22,8,30,0c-8,-8,-8,-22,0,-30c-8,-8,-22,-8,-30,0Z`,

  Mercury: `M0,-35l0,10l-6,0l0,-10l6,0Zm-13,-2c-8,0,-14,6,-14,14s6,14,14,14c5,0,9,-2,12,-6l0,12l-6,3l0,6l6,-3l6,3l0,-6l-6,-3l0,-12c3,4,7,6,12,6c8,0,14,-6,14,-14s-6,-14,-14,-14c-5,0,-9,2,-12,6c-3,-4,-7,-6,-12,-6Zm0,6c4,0,8,4,8,8s-4,8,-8,8s-8,-4,-8,-8s4,-8,8,-8Z`,

  Venus: `M0,-30c-10,0,-18,8,-18,18s8,18,18,18s18,-8,18,-18s-8,-18,-18,-18Zm0,6c7,0,12,5,12,12s-5,12,-12,12s-12,-5,-12,-12s5,-12,12,-12Zm-3,30l0,12l-6,0l0,6l6,0l0,6l6,0l0,-6l6,0l0,-6l-6,0l0,-12l-6,0Z`,

  Mars: `M8,-30l0,12l8,0l-12,12c-8,-6,-20,-4,-26,4s-4,20,4,26s20,4,26,-4l12,-12l0,8l12,0l0,-22l-10,0l0,-12l-14,0Zm-8,24c6,0,10,4,10,10s-4,10,-10,10s-10,-4,-10,-10s4,-10,10,-10Z`,

  Jupiter: `M-20,-20l8,0l0,8l-8,0l0,-8Zm12,0l20,0l0,8l-12,0l0,24l12,0l0,8l-32,0l0,-8l12,0l0,-24l-8,0l0,24l-8,0l0,-32l16,0Z`,

  Saturn: `M-8,-35l0,10l-10,0l0,6l10,0l0,8c-6,2,-10,8,-10,14c0,8,6,15,14,15c6,0,11,-4,13,-9l5,0l0,-6l-5,0c-2,-5,-7,-9,-13,-9l0,-8l10,0l0,-6l-10,0l0,-10l-4,0Zm2,30c4,0,8,4,8,8s-4,8,-8,8s-8,-4,-8,-8s4,-8,8,-8Z`,

  Uranus: `M0,-35c-5,0,-9,4,-9,9l0,14l-12,0l0,6l12,0l0,6l-8,0l0,6l8,0l0,6l6,0l0,-6l8,0l0,-6l-8,0l0,-6l12,0l0,-6l-12,0l0,-14c0,-5,4,-9,9,-9Zm0,6c2,0,3,1,3,3l0,14l-6,0l0,-14c0,-2,1,-3,3,-3Z`,

  Neptune: `M0,-35l-3,0l0,10l-15,0l0,6l15,0l0,6c-8,2,-14,10,-14,18c0,10,8,18,18,18s18,-8,18,-18c0,-8,-6,-16,-14,-18l0,-6l15,0l0,-6l-15,0l0,-10l-5,0Zm3,28c6,0,12,6,12,12s-6,12,-12,12s-12,-6,-12,-12s6,-12,12,-12Z`,

  Pluto: `M0,-30c-12,0,-22,10,-22,22c0,8,4,15,10,19l0,10l-8,0l0,6l8,0l0,6l6,0l0,-6l8,0l0,-6l-8,0l0,-10c6,-4,10,-11,10,-19c0,-12,-10,-22,-22,-22Zm0,8c8,0,14,6,14,14s-6,14,-14,14s-14,-6,-14,-14s6,-14,14,-14Zm0,6c-4,0,-8,4,-8,8s4,8,8,8s8,-4,8,-8s-4,-8,-8,-8Z`,

  Earth: `M0,-28a28,28,0,1,1,0,56a28,28,0,1,1,0,-56Zm0,6a22,22,0,0,0,-16,38l16,-16l16,16a22,22,0,0,0,-16,-38Zm-16,42a22,22,0,0,0,32,0l-16,-16l-16,16Z`
};

// Planet symbol size (approximate bounding box)
const PLANET_SIZE = 56;

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
function generateYinYangMarker(x, y, rotation, isYang, scale = 1) {
  const width = 28 * scale;
  const height = 8 * scale;
  const gap = 4 * scale;

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
 */
function generatePlanetSymbol(planet, x, y, rotation, scale = 0.5) {
  if (!planet || !PLANET_PATHS[planet]) {
    return '';
  }

  return `<g transform="translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(${rotation.toFixed(2)}) scale(${scale})">
    <path d="${PLANET_PATHS[planet]}" fill="${shared.COLORS.foreground}"/>
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

  const anchor = flipped ? 'end' : 'start';

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
 */
function generateLineElements(gateNumber, lineNumber, wheelPosition) {
  const elements = [];

  // Get V3 positioning data for the wheel position (inner gate)
  const innerGate = gateSequence[wheelPosition];
  const v3Data = positioning.getDockingData(innerGate, 1);

  // Calculate angle offset for this line within the gate
  const lineOffset = LINE_OFFSETS[lineNumber];
  const lineAngle = v3Data.angle + lineOffset;

  // Convert to SVG angle
  const svgAngle = shared.calculateSVGAngle(lineAngle);
  const radians = svgAngle * Math.PI / 180;

  // Check if this line is on the left side (needs flip)
  const flipped = isFlipped(svgAngle);
  const rotation = calculateRadialRotation(svgAngle);

  // Get line data
  const lineData = getLineDataFast(gateNumber, lineNumber);
  if (!lineData) return elements;

  // 1. Yin/Yang marker
  const yinYangX = CENTER.x + BAND_RADII.yinYang * Math.cos(radians);
  const yinYangY = CENTER.y + BAND_RADII.yinYang * Math.sin(radians);
  const isYang = lineData.polarity === 'YANG';
  elements.push(generateYinYangMarker(yinYangX, yinYangY, rotation, isYang));

  // 2. Detriment planet
  const detrimentX = CENTER.x + BAND_RADII.detriment * Math.cos(radians);
  const detrimentY = CENTER.y + BAND_RADII.detriment * Math.sin(radians);
  const detrimentPlanets = lineData.blackBook?.detriment?.planets || [];
  if (detrimentPlanets.length > 0) {
    elements.push(generatePlanetSymbol(detrimentPlanets[0].planet, detrimentX, detrimentY, rotation, 0.4));
  }

  // 3. Line number
  const lineNumX = CENTER.x + BAND_RADII.lineNumber * Math.cos(radians);
  const lineNumY = CENTER.y + BAND_RADII.lineNumber * Math.sin(radians);
  elements.push(generateLineNumber(lineNumber, lineNumX, lineNumY, rotation, flipped));

  // 4. Exalted planet
  const exaltedX = CENTER.x + BAND_RADII.exalted * Math.cos(radians);
  const exaltedY = CENTER.y + BAND_RADII.exalted * Math.sin(radians);
  const exaltedPlanets = lineData.blackBook?.exaltation?.planets || [];
  if (exaltedPlanets.length > 0) {
    // For lines with multiple exalted planets, show the first one
    // (11.4 has Moon, Venus; 25.4 has Venus, Jupiter)
    elements.push(generatePlanetSymbol(exaltedPlanets[0].planet, exaltedX, exaltedY, rotation, 0.4));
  }

  // 5. Keynote
  const keynoteX = CENTER.x + BAND_RADII.keynote * Math.cos(radians);
  const keynoteY = CENTER.y + BAND_RADII.keynote * Math.sin(radians);
  elements.push(generateKeynote(lineData.lineKeynote, keynoteX, keynoteY, rotation, flipped));

  return elements;
}

/**
 * Generate all elements for a single gate (6 lines)
 */
function generateGateElements(wheelPosition) {
  const outerGate = OUTER_GATE_SEQUENCE[wheelPosition];
  const innerGate = gateSequence[wheelPosition];
  const elements = [];

  // Add gate group
  elements.push(`  <g id="GATE-${outerGate}" data-wheel-position="${wheelPosition}" data-inner-gate="${innerGate}" data-outer-gate="${outerGate}">`);

  // Generate all 6 lines (from 6 to 1 as they appear CCW to CW)
  for (let line = 6; line >= 1; line--) {
    const lineElements = generateLineElements(outerGate, line, wheelPosition);
    elements.push(`    <g id="LINE-${outerGate}.${line}" class="line">`);
    lineElements.forEach(el => elements.push('      ' + el));
    elements.push('    </g>');
  }

  elements.push('  </g>');

  return elements.join('\n');
}

/**
 * Generate divider lines between gates
 */
function generateDividers() {
  const lines = [];

  for (let i = 0; i < 64; i++) {
    const gateA = gateSequence[i];
    const gateB = gateSequence[(i + 1) % 64];

    const v3DataA = positioning.getDockingData(gateA, 1);
    const v3DataB = positioning.getDockingData(gateB, 1);

    // Calculate midpoint angle
    let midAngle;
    if (Math.abs(v3DataB.angle - v3DataA.angle) > 180) {
      midAngle = ((v3DataA.angle + v3DataB.angle + 360) / 2) % 360;
    } else {
      midAngle = (v3DataA.angle + v3DataB.angle) / 2;
    }

    const svgAngle = shared.calculateSVGAngle(midAngle);
    const radians = svgAngle * Math.PI / 180;

    const x1 = CENTER.x + RING.innerRadius * Math.cos(radians);
    const y1 = CENTER.y + RING.innerRadius * Math.sin(radians);
    const x2 = CENTER.x + RING.outerRadius * Math.cos(radians);
    const y2 = CENTER.y + RING.outerRadius * Math.sin(radians);

    lines.push(`    <line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${shared.COLORS.foreground}" stroke-width="0.5"/>`);
  }

  return lines.join('\n');
}

/**
 * Generate the complete 384-lines ring SVG
 */
function generateLinesRing(options = {}) {
  const {
    includeStructure = true,
    includeBackground = true,
    stroke = shared.COLORS.foreground,
    fill = shared.COLORS.foreground,
    backgroundColor = shared.COLORS.background
  } = options;

  const viewBoxSize = CENTER.x * 2 + 100;
  const svgParts = [];

  // SVG header
  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${viewBoxSize}" height="${viewBoxSize}">`);

  // Background
  if (includeBackground) {
    svgParts.push(`  <rect width="100%" height="100%" fill="${backgroundColor}"/>`);
  }

  // Structure (rings and dividers)
  if (includeStructure) {
    svgParts.push('  <g id="STRUCTURE">');
    svgParts.push('    <g id="RINGS">');
    svgParts.push(`      <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${RING.innerRadius}" fill="none" stroke="${stroke}" stroke-width="0.5"/>`);
    svgParts.push(`      <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${RING.outerRadius}" fill="none" stroke="${stroke}" stroke-width="0.5"/>`);
    svgParts.push('    </g>');
    svgParts.push('    <g id="DIVIDERS">');
    svgParts.push(generateDividers());
    svgParts.push('    </g>');
    svgParts.push('  </g>');
  }

  // Lines content
  svgParts.push('  <g id="LINES">');

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
  generateLinesRing,
  OUTER_GATE_SEQUENCE,
  CENTER,
  RING,
  BAND_RADII,
  PLANET_PATHS
};

// CLI execution
if (require.main === module) {
  const outputPath = process.argv[2] || path.join(__dirname, '../output/generated-lines-ring.svg');

  console.log('Generating 384-lines ring...');
  console.log('  - 64 gates × 6 lines = 384 lines');
  console.log('  - Each line: yin/yang, detriment, number, exalted, keynote');
  console.log('  - Using outer gate sequence (harmonics)');
  console.log('  - Text flip for left side readability');

  const svg = generateLinesRing();

  fs.writeFileSync(outputPath, svg);
  console.log(`\nSaved to: ${outputPath}`);
  console.log(`File size: ${(svg.length / 1024).toFixed(1)} KB`);
}
