/**
 * Electromagnetic Gate Types Ring Generator
 *
 * Visualizes all 64 gates on the Human Design wheel, colored by their
 * electromagnetic gate type:
 *
 * GATE TYPES (5 categories):
 * - Standing Wave (Doubled): Inner = Outer trigram (8 gates)
 * - Cross-Zero Manifesting: Negative → Positive (16 gates)
 * - Cross-Zero Dematerialising: Positive → Negative (16 gates)
 * - Same-Phase Material: Both positive (12 gates)
 * - Same-Phase Void: Both negative (12 gates)
 *
 * Each gate shows:
 * - Arc background colored by type
 * - Vector indicator (e.g., "-4 → +3")
 * - Gate number
 *
 * References:
 * - docs/articles/EM-Series/05-three-types-of-movement.md
 * - knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json
 */

const fs = require('fs');
const path = require('path');

// Load dependencies
const positioning = require('../../core/root-system/positioning-algorithm.js');
const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
const emData = require('../../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');
const { COLORS, POSITION_OFFSET, calculateSVGAngle, calculateRotation, generateStructure } = require('./shared-constants.js');

// ============================================================================
// GEOMETRY CONSTANTS
// ============================================================================

const GEOMETRY = {
  viewBox: { width: 1000, height: 1000 },
  center: { x: 500, y: 500 },
  ring: {
    innerRadius: 320,
    outerRadius: 460
  }
};

// ============================================================================
// COLOR SCHEME
// ============================================================================

const TYPE_COLORS = {
  'doubled': '#FFD700',                    // Bright Gold - Standing Wave (reference points)
  'cross-zero-manifesting': '#4A90D9',     // Bright Blue - Manifesting (void → matter)
  'cross-zero-dematerialising': '#E07050', // Bright Coral - Dematerialising (matter → void)
  'same-phase-material': '#20B090',        // Bright Teal - Material circulation
  'same-phase-void': '#C080E0'             // Bright Purple/Violet - Void circulation
};

const TYPE_LABELS = {
  'doubled': 'Standing Wave',
  'cross-zero-manifesting': 'Cross-Zero Manifesting',
  'cross-zero-dematerialising': 'Cross-Zero Dematerialising',
  'same-phase-material': 'Same-Phase Material',
  'same-phase-void': 'Same-Phase Void'
};

const COLOR_SCHEME = {
  background: '#0a0a0a',  // Near-black for cleaner color perception
  foreground: '#FFFFFF',
  stroke: '#FFFFFF'
};

// Trigram binary codes (line 1 at bottom, line 3 at top)
const TRIGRAM_BINARY = {
  'Heaven': '111',
  'Lake': '110',
  'Fire': '101',
  'Thunder': '100',
  'Wind': '011',
  'Water': '010',
  'Mountain': '001',
  'Earth': '000'
};

// Symbol configuration for trigrams
const SYMBOL_CONFIG = {
  lineWidth: 10,
  lineHeight: 2,
  lineSpacing: 4,
  yinGapWidth: 2
};

// ============================================================================
// TRIGRAM SYMBOL GENERATION
// ============================================================================

/**
 * Generate SVG trigram symbol from binary code
 * @param {string} binary - 3-character binary string ('111' for Heaven, etc.)
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} rotation - Rotation in degrees
 * @param {number} scale - Scale factor
 * @param {string} fill - Fill color
 * @returns {string} SVG group element with the trigram
 */
function generateTrigramSymbol(binary, x, y, rotation = 0, scale = 1, fill = COLOR_SCHEME.foreground) {
  const cfg = SYMBOL_CONFIG;
  const lineWidth = cfg.lineWidth * scale;
  const lineHeight = cfg.lineHeight * scale;
  const lineSpacing = cfg.lineSpacing * scale;
  const yinGapWidth = cfg.yinGapWidth * scale;

  const lines = [];

  // Generate three lines: i=0 is top line (first char of binary), i=2 is bottom line
  for (let i = 0; i < 3; i++) {
    const bit = binary[i];
    // Position lines vertically centered
    const lineY = -lineSpacing + (2 - i) * lineSpacing;

    if (bit === '1') {
      // Yang line (solid)
      lines.push(`<rect x="${(-lineWidth/2).toFixed(4)}" y="${(lineY - lineHeight/2).toFixed(4)}" width="${lineWidth.toFixed(4)}" height="${lineHeight.toFixed(4)}"/>`);
    } else {
      // Yin line (broken)
      const segmentWidth = (lineWidth - yinGapWidth) / 2;
      lines.push(`<rect x="${(-lineWidth/2).toFixed(4)}" y="${(lineY - lineHeight/2).toFixed(4)}" width="${segmentWidth.toFixed(4)}" height="${lineHeight.toFixed(4)}"/>`);
      lines.push(`<rect x="${(yinGapWidth/2).toFixed(4)}" y="${(lineY - lineHeight/2).toFixed(4)}" width="${segmentWidth.toFixed(4)}" height="${lineHeight.toFixed(4)}"/>`);
    }
  }

  return `<g transform="translate(${x.toFixed(4)}, ${y.toFixed(4)}) rotate(${rotation.toFixed(4)})" fill="${fill}" opacity="0.85">
    ${lines.join('\n    ')}
  </g>`;
}

// ============================================================================
// BUILD GATE TYPE MAP
// ============================================================================

function buildGateTypeMap() {
  const gateTypes = {};

  emData.mappings.forEach(m => {
    if (m.line === 1 && m.electromagnetic) {
      gateTypes[m.gate] = {
        type: m.electromagnetic.gateType,
        inner: m.electromagnetic.innerTrigram.name,
        innerPos: m.electromagnetic.innerTrigram.position,
        outer: m.electromagnetic.outerTrigram.name,
        outerPos: m.electromagnetic.outerTrigram.position
      };
    }
  });

  return gateTypes;
}

const GATE_TYPES = buildGateTypeMap();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format position as string with sign
 */
function formatPosition(pos) {
  if (pos > 0) return '+' + pos;
  return String(pos);
}

/**
 * Get vector string for a gate
 */
function getVectorString(gateNumber) {
  const data = GATE_TYPES[gateNumber];
  if (!data) return '';
  return formatPosition(data.innerPos) + '→' + formatPosition(data.outerPos);
}

/**
 * Calculate arc path for a gate segment
 */
function createArcPath(startAngle, endAngle, innerR, outerR, cx, cy) {
  // Note: svgAngle already has the correct transformation, just convert to radians
  const startRad = startAngle * Math.PI / 180;
  const endRad = endAngle * Math.PI / 180;

  const x1Outer = cx + outerR * Math.cos(startRad);
  const y1Outer = cy + outerR * Math.sin(startRad);
  const x2Outer = cx + outerR * Math.cos(endRad);
  const y2Outer = cy + outerR * Math.sin(endRad);

  const x1Inner = cx + innerR * Math.cos(endRad);
  const y1Inner = cy + innerR * Math.sin(endRad);
  const x2Inner = cx + innerR * Math.cos(startRad);
  const y2Inner = cy + innerR * Math.sin(startRad);

  return `M ${x1Outer.toFixed(4)} ${y1Outer.toFixed(4)}
          A ${outerR} ${outerR} 0 0 1 ${x2Outer.toFixed(4)} ${y2Outer.toFixed(4)}
          L ${x1Inner.toFixed(4)} ${y1Inner.toFixed(4)}
          A ${innerR} ${innerR} 0 0 0 ${x2Inner.toFixed(4)} ${y2Inner.toFixed(4)}
          Z`;
}

// ============================================================================
// SVG GENERATION
// ============================================================================

/**
 * Generate arc backgrounds for all 64 gates
 */
function generateGateArcs() {
  const parts = [];
  const cx = GEOMETRY.center.x;
  const cy = GEOMETRY.center.y;
  const innerR = GEOMETRY.ring.innerRadius;
  const outerR = GEOMETRY.ring.outerRadius;

  parts.push('  <g id="GATE-ARCS">');

  gateSequence.forEach((gateNumber, index) => {
    const gateData = GATE_TYPES[gateNumber];
    if (!gateData) return;

    const color = TYPE_COLORS[gateData.type];

    // Get angle for this gate position
    const docking = positioning.getDockingData(gateNumber, 1);
    const v3Angle = docking.angle;
    const svgAngle = calculateSVGAngle(v3Angle);

    // Each gate spans 5.625 degrees
    const halfSpan = 5.625 / 2;
    const startAngle = svgAngle - halfSpan;
    const endAngle = svgAngle + halfSpan;

    const arcPath = createArcPath(startAngle, endAngle, innerR, outerR, cx, cy);

    parts.push(`    <path id="ARC-${gateNumber}" d="${arcPath}"
          fill="${color}" opacity="0.7"
          data-gate="${gateNumber}" data-type="${gateData.type}"/>`);
  });

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate gate labels (number, vector, and trigram symbols)
 */
function generateGateLabels() {
  const parts = [];
  const cx = GEOMETRY.center.x;
  const cy = GEOMETRY.center.y;
  const bandWidth = GEOMETRY.ring.outerRadius - GEOMETRY.ring.innerRadius;

  // Radii for different elements (from inner to outer)
  const innerTrigramRadius = GEOMETRY.ring.innerRadius + bandWidth * 0.18;  // Inner/Lower trigram
  const numberRadius = GEOMETRY.ring.innerRadius + bandWidth * 0.42;         // Gate number
  const outerTrigramRadius = GEOMETRY.ring.innerRadius + bandWidth * 0.62;   // Outer/Upper trigram
  const vectorRadius = GEOMETRY.ring.innerRadius + bandWidth * 0.85;         // Vector

  parts.push('  <g id="GATE-LABELS">');

  gateSequence.forEach((gateNumber, index) => {
    const gateData = GATE_TYPES[gateNumber];
    if (!gateData) return;

    const color = TYPE_COLORS[gateData.type];

    // Get position
    const docking = positioning.getDockingData(gateNumber, 1);
    const v3Angle = docking.angle;
    const svgAngle = calculateSVGAngle(v3Angle);
    const radians = svgAngle * Math.PI / 180;
    const rotation = svgAngle + 90;

    // Calculate positions for all elements
    const innerTriX = cx + innerTrigramRadius * Math.cos(radians);
    const innerTriY = cy + innerTrigramRadius * Math.sin(radians);

    const numX = cx + numberRadius * Math.cos(radians);
    const numY = cy + numberRadius * Math.sin(radians);

    const outerTriX = cx + outerTrigramRadius * Math.cos(radians);
    const outerTriY = cy + outerTrigramRadius * Math.sin(radians);

    const vecX = cx + vectorRadius * Math.cos(radians);
    const vecY = cy + vectorRadius * Math.sin(radians);

    // Calculate transform matrix for rotation (for text only)
    const cos = Math.cos(rotation * Math.PI / 180).toFixed(6);
    const sin = Math.sin(rotation * Math.PI / 180).toFixed(6);

    // Get trigram binary codes
    const innerBinary = TRIGRAM_BINARY[gateData.inner];
    const outerBinary = TRIGRAM_BINARY[gateData.outer];

    parts.push(`    <g id="LABEL-${gateNumber}" data-gate="${gateNumber}">`);

    // Inner/Lower trigram symbol (lines 1-3)
    parts.push('      ' + generateTrigramSymbol(innerBinary, innerTriX, innerTriY, rotation, 0.9));

    // Gate number
    parts.push(`      <text transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${numX.toFixed(4)}, ${numY.toFixed(4)})"
            font-family="Copperplate" font-size="12" font-weight="bold"
            fill="${COLOR_SCHEME.foreground}" text-anchor="middle" dominant-baseline="middle">${gateNumber}</text>`);

    // Outer/Upper trigram symbol (lines 4-6)
    parts.push('      ' + generateTrigramSymbol(outerBinary, outerTriX, outerTriY, rotation, 0.9));

    // Vector
    const vector = getVectorString(gateNumber);
    parts.push(`      <text transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${vecX.toFixed(4)}, ${vecY.toFixed(4)})"
            font-family="Copperplate" font-size="8"
            fill="${color}" text-anchor="middle" dominant-baseline="middle">${vector}</text>`);

    parts.push('    </g>');
  });

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate structure (rings and dividers)
 */
function generateRingStructure() {
  const ring = {
    center: GEOMETRY.center,
    innerRadius: GEOMETRY.ring.innerRadius,
    outerRadius: GEOMETRY.ring.outerRadius
  };
  return generateStructure(positioning, ring, COLOR_SCHEME.stroke, 0.5);
}

/**
 * Generate legend
 */
function generateLegend() {
  const parts = [];
  const cx = GEOMETRY.center.x;
  const cy = GEOMETRY.center.y;
  const startY = cy - 60;
  const lineHeight = 22;

  parts.push('  <g id="LEGEND">');

  // Title
  parts.push(`    <text x="${cx}" y="${startY - 25}"
        font-family="Copperplate" font-size="14"
        fill="${COLOR_SCHEME.foreground}" text-anchor="middle">ELECTROMAGNETIC GATE TYPES</text>`);

  // Type entries
  const types = [
    { key: 'doubled', count: 8 },
    { key: 'cross-zero-manifesting', count: 16 },
    { key: 'cross-zero-dematerialising', count: 16 },
    { key: 'same-phase-material', count: 12 },
    { key: 'same-phase-void', count: 12 }
  ];

  types.forEach((t, i) => {
    const y = startY + i * lineHeight;
    const color = TYPE_COLORS[t.key];
    const label = TYPE_LABELS[t.key];

    // Color swatch
    parts.push(`    <rect x="${cx - 120}" y="${y - 6}" width="12" height="12" fill="${color}" opacity="0.7"/>`);

    // Label
    parts.push(`    <text x="${cx - 100}" y="${y + 1}"
          font-family="Copperplate-Light, Copperplate" font-size="10" font-weight="300"
          fill="${COLOR_SCHEME.foreground}" dominant-baseline="middle">${label}</text>`);

    // Count
    parts.push(`    <text x="${cx + 115}" y="${y + 1}"
          font-family="Copperplate" font-size="10"
          fill="${color}" text-anchor="end" dominant-baseline="middle">(${t.count})</text>`);
  });

  // Subtitle
  parts.push(`    <text x="${cx}" y="${startY + 5 * lineHeight + 10}"
        font-family="Copperplate-Light, Copperplate" font-size="9" font-weight="300"
        fill="${COLOR_SCHEME.foreground}" text-anchor="middle" opacity="0.6">Inner Trigram → Outer Trigram</text>`);

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate flow indicators showing matter/void sides
 */
function generateFlowIndicators() {
  const parts = [];
  const flowRadius = GEOMETRY.ring.outerRadius + 35;
  const cx = GEOMETRY.center.x;
  const cy = GEOMETRY.center.y;

  parts.push('  <g id="FLOW-INDICATORS">');

  // Right side: MATTER (positive positions)
  const matterAngle = -90; // Right side
  const matterRad = (matterAngle - 90) * Math.PI / 180;
  const matterX = cx + flowRadius * Math.cos(matterRad);
  const matterY = cy + flowRadius * Math.sin(matterRad);

  parts.push(`    <text x="${matterX.toFixed(4)}" y="${(matterY - 8).toFixed(4)}"
        font-family="Copperplate" font-size="11"
        fill="${TYPE_COLORS['same-phase-material']}" text-anchor="start">MATTER</text>`);
  parts.push(`    <text x="${matterX.toFixed(4)}" y="${(matterY + 5).toFixed(4)}"
        font-family="Copperplate-Light, Copperplate" font-size="9" font-weight="300"
        fill="${TYPE_COLORS['same-phase-material']}" text-anchor="start" opacity="0.7">+1 +2 +3 +4</text>`);

  // Left side: VOID (negative positions)
  const voidAngle = 90; // Left side
  const voidRad = (voidAngle - 90) * Math.PI / 180;
  const voidX = cx + flowRadius * Math.cos(voidRad);
  const voidY = cy + flowRadius * Math.sin(voidRad);

  parts.push(`    <text x="${voidX.toFixed(4)}" y="${(voidY - 8).toFixed(4)}"
        font-family="Copperplate" font-size="11"
        fill="${TYPE_COLORS['same-phase-void']}" text-anchor="end">VOID</text>`);
  parts.push(`    <text x="${voidX.toFixed(4)}" y="${(voidY + 5).toFixed(4)}"
        font-family="Copperplate-Light, Copperplate" font-size="9" font-weight="300"
        fill="${TYPE_COLORS['same-phase-void']}" text-anchor="end" opacity="0.7">-4 -3 -2 -1</text>`);

  // Top: Manifesting arrow
  const topY = cy - flowRadius - 5;
  parts.push(`    <text x="${cx}" y="${topY}"
        font-family="Copperplate-Light, Copperplate" font-size="9" font-weight="300"
        fill="${TYPE_COLORS['cross-zero-manifesting']}" text-anchor="middle">MANIFESTING →</text>`);

  // Bottom: Dematerialising arrow
  const bottomY = cy + flowRadius + 12;
  parts.push(`    <text x="${cx}" y="${bottomY}"
        font-family="Copperplate-Light, Copperplate" font-size="9" font-weight="300"
        fill="${TYPE_COLORS['cross-zero-dematerialising']}" text-anchor="middle">← DEMATERIALISING</text>`);

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate the complete electromagnetic gate types ring
 */
function generateElectromagneticGateTypesRing(options = {}) {
  const {
    includeBackground = true,
    includeLegend = true,
    includeFlowIndicators = true
  } = options;

  const parts = [];

  // SVG header
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${GEOMETRY.viewBox.width}" height="${GEOMETRY.viewBox.height}" viewBox="0 0 ${GEOMETRY.viewBox.width} ${GEOMETRY.viewBox.height}">`);

  // Background
  if (includeBackground) {
    parts.push(`  <rect id="background" width="100%" height="100%" fill="${COLOR_SCHEME.background}"/>`);
  }

  // Flow indicators (outside ring)
  if (includeFlowIndicators) {
    parts.push(generateFlowIndicators());
  }

  // Gate arcs (colored backgrounds)
  parts.push(generateGateArcs());

  // Structure (rings and dividers)
  parts.push(generateRingStructure());

  // Gate labels (numbers and vectors)
  parts.push(generateGateLabels());

  // Legend (center)
  if (includeLegend) {
    parts.push(generateLegend());
  }

  // Close SVG
  parts.push('</svg>');

  return parts.join('\n');
}

/**
 * Get statistics about gate types
 */
function getStatistics() {
  const stats = {
    total: 64,
    byType: {},
    byTypeList: {}
  };

  Object.entries(GATE_TYPES).forEach(([gate, data]) => {
    if (!stats.byType[data.type]) {
      stats.byType[data.type] = 0;
      stats.byTypeList[data.type] = [];
    }
    stats.byType[data.type]++;
    stats.byTypeList[data.type].push(parseInt(gate));
  });

  return stats;
}

// ============================================================================
// EXPORTS AND CLI
// ============================================================================

module.exports = {
  generateElectromagneticGateTypesRing,
  getStatistics,
  GATE_TYPES,
  TYPE_COLORS,
  TYPE_LABELS,
  GEOMETRY
};

// CLI execution
if (require.main === module) {
  const outputDir = path.join(__dirname, '../output');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const stats = getStatistics();

  console.log('Generating Electromagnetic Gate Types Ring...');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  ELECTROMAGNETIC GATE TYPES VISUALIZATION');
  console.log('  64 Gates Colored by Movement Type');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('  GATE TYPE DISTRIBUTION:');
  console.log('  ─────────────────────────────────────────────────────────────');

  Object.entries(stats.byType).forEach(([type, count]) => {
    const label = TYPE_LABELS[type] || type;
    const gates = stats.byTypeList[type].sort((a, b) => a - b).join(', ');
    console.log(`  ${label.padEnd(28)} (${count.toString().padStart(2)}): ${gates}`);
  });

  console.log('  ─────────────────────────────────────────────────────────────');
  console.log(`  TOTAL: ${stats.total} gates`);
  console.log('');

  // Generate
  const svg = generateElectromagneticGateTypesRing();
  const outputPath = path.join(outputDir, 'generated-em-gate-types.svg');
  fs.writeFileSync(outputPath, svg);
  console.log(`Output: ${outputPath} (${(svg.length / 1024).toFixed(1)} KB)`);

  console.log('\nDone!');
}
