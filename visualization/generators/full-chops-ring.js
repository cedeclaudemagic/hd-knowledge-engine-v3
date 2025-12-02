/**
 * 192 Full Chops Ring Generator
 *
 * Generates the 384 yin/yang "chops" ring SVG showing polarity markers
 * for each of the 384 lines in the Human Design wheel.
 *
 * Structure:
 * - 192 YANG chops (solid parallelogram polygons)
 * - 192 YIN chops (split parallelogram paths with gap)
 * - 384 radial divider lines between each line position
 * - 4 concentric ring circles
 *
 * Each chop is labeled with: Gate.Line - LineName - Polarity - Planet1 - Planet2
 *
 * Uses V3 positioning algorithm for precise alignment with other rings
 * (hexagrams, lines, channels, etc.)
 *
 * METHODOLOGY (see docs/reference/SVG-GENERATION-METHODOLOGY.md):
 * - Use first-principles formulas, not per-quadrant adjustments
 * - Extract geometry from master SVG, generate transforms from principles
 * - Single formula works for ALL 384 lines
 */

const fs = require('fs');
const path = require('path');
const positioning = require('../../core/root-system/positioning-algorithm');
const shared = require('./shared-constants');

// Load data sources
const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
const linesData = require('../../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');

// ============================================================================
// RING GEOMETRY (extracted from the-192-full-chops-verified-master.svg)
// ============================================================================

const CENTER = { x: 1986.0379, y: 1986.0379 };

// Ring radii from master SVG circles
const RING = {
  inner: 1896.0809,        // Innermost ring
  innerCentre: 1905.2769,  // Inner-centre ring
  outerCentre: 1975.0843,  // Outer-centre ring
  outer: 1984.6635         // Outermost ring
};

// Chop radii (measured from polygon points in master)
// Chops span from ~1918 to ~1959 (within the innerCentre to outerCentre band)
const CHOP = {
  innerRadius: 1916.8,     // Inner edge of chops (extended 2px inward)
  outerRadius: 1961.0,     // Outer edge of chops (extended 2px outward)
  get height() { return this.outerRadius - this.innerRadius; },  // ~40.2px
  angularWidth: 0.25       // Half-width in degrees (reduced from 0.31 for more breathing room)
};

// Divider lines extend from inner ring to outer ring
const DIVIDER = {
  innerRadius: RING.inner - 2,
  outerRadius: RING.outer + 2
};

// ViewBox size
const VIEWBOX_SIZE = 3972.0757;

// ============================================================================
// LINE GEOMETRY
// ============================================================================

const GATE_ARC = 5.625;  // Degrees per gate
const LINE_ARC = GATE_ARC / 6;  // 0.9375° per line

// NOTE: We use getDockingData(gate, line) directly for correct V3 positioning
// Line 1 is at the start of the gate arc, Line 6 at the end
// This matches the true wheel order from the V3 knowledge engine

// ============================================================================
// DATA LOOKUP
// ============================================================================

/**
 * Build index for fast line data lookup
 */
function buildLineDataIndex() {
  const index = {};
  linesData.mappings.forEach(m => {
    const key = `${m.gateNumber}.${m.lineNumber}`;
    index[key] = m;
  });
  return index;
}

const lineDataIndex = buildLineDataIndex();

/**
 * Get line data for a gate.line
 */
function getLineData(gateNumber, lineNumber) {
  return lineDataIndex[`${gateNumber}.${lineNumber}`];
}

/**
 * Get polarity (YANG/YIN) for a line
 */
function getPolarity(gateNumber, lineNumber) {
  const data = getLineData(gateNumber, lineNumber);
  return data?.knowledge?.polarity || 'YANG';
}

/**
 * Get line keynote (name)
 */
function getLineKeynote(gateNumber, lineNumber) {
  const data = getLineData(gateNumber, lineNumber);
  return data?.knowledge?.lineKeynote || '';
}

/**
 * Get exalted and detriment planets
 */
function getPlanets(gateNumber, lineNumber) {
  const data = getLineData(gateNumber, lineNumber);
  const exalted = data?.knowledge?.blackBook?.exaltation?.planets || [];
  const detriment = data?.knowledge?.blackBook?.detriment?.planets || [];

  const exaltedPlanet = exalted[0]?.planet || '';
  const detrimentPlanet = detriment[0]?.planet || '';

  return { exalted: exaltedPlanet, detriment: detrimentPlanet };
}

// ============================================================================
// SVG GENERATION
// ============================================================================

/**
 * Generate a YANG chop (solid parallelogram polygon)
 *
 * @param {number} svgAngle - The SVG angle for this line position
 * @param {string} id - Element ID
 * @param {string} dataName - data-name attribute value
 */
function generateYangChop(svgAngle, id, dataName) {
  const radians = svgAngle * Math.PI / 180;
  const halfAngle = CHOP.angularWidth * Math.PI / 180;

  // Calculate 8 corner points of the parallelogram
  // Inner edge: 4 points at innerRadius
  // Outer edge: 4 points at outerRadius
  const points = [];

  // Outer edge, CCW corner
  points.push({
    x: CENTER.x + CHOP.outerRadius * Math.cos(radians - halfAngle),
    y: CENTER.y + CHOP.outerRadius * Math.sin(radians - halfAngle)
  });

  // Inner edge, CCW corner
  points.push({
    x: CENTER.x + CHOP.innerRadius * Math.cos(radians - halfAngle),
    y: CENTER.y + CHOP.innerRadius * Math.sin(radians - halfAngle)
  });

  // Inner edge, midpoint CCW
  points.push({
    x: CENTER.x + CHOP.innerRadius * Math.cos(radians - halfAngle/2),
    y: CENTER.y + CHOP.innerRadius * Math.sin(radians - halfAngle/2)
  });

  // Inner edge, midpoint CW
  points.push({
    x: CENTER.x + CHOP.innerRadius * Math.cos(radians + halfAngle/2),
    y: CENTER.y + CHOP.innerRadius * Math.sin(radians + halfAngle/2)
  });

  // Inner edge, CW corner
  points.push({
    x: CENTER.x + CHOP.innerRadius * Math.cos(radians + halfAngle),
    y: CENTER.y + CHOP.innerRadius * Math.sin(radians + halfAngle)
  });

  // Outer edge, CW corner
  points.push({
    x: CENTER.x + CHOP.outerRadius * Math.cos(radians + halfAngle),
    y: CENTER.y + CHOP.outerRadius * Math.sin(radians + halfAngle)
  });

  // Outer edge, midpoint CW
  points.push({
    x: CENTER.x + CHOP.outerRadius * Math.cos(radians + halfAngle/2),
    y: CENTER.y + CHOP.outerRadius * Math.sin(radians + halfAngle/2)
  });

  // Outer edge, midpoint CCW
  points.push({
    x: CENTER.x + CHOP.outerRadius * Math.cos(radians - halfAngle/2),
    y: CENTER.y + CHOP.outerRadius * Math.sin(radians - halfAngle/2)
  });

  const pointsStr = points.map(p => `${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join(' ');

  return `    <polygon id="${id}" data-name="${dataName}" points="${pointsStr}" fill="${shared.COLORS.foreground}"/>`;
}

/**
 * Generate a YIN chop (split parallelogram with gap in middle)
 *
 * @param {number} svgAngle - The SVG angle for this line position
 * @param {string} id - Element ID
 * @param {string} dataName - data-name attribute value
 */
function generateYinChop(svgAngle, id, dataName) {
  const radians = svgAngle * Math.PI / 180;
  const halfAngle = CHOP.angularWidth * Math.PI / 180;

  // YIN chops have a gap in the middle (radially)
  const gapSize = CHOP.height * 0.25;  // Gap is ~25% of height
  const midRadius = (CHOP.innerRadius + CHOP.outerRadius) / 2;
  const innerSegmentOuter = midRadius - gapSize / 2;
  const outerSegmentInner = midRadius + gapSize / 2;

  // Generate two separate parallelograms with a gap between them
  // Inner segment (innerRadius to innerSegmentOuter)
  const innerPath = generateParallelogramPath(radians, halfAngle, CHOP.innerRadius, innerSegmentOuter);

  // Outer segment (outerSegmentInner to outerRadius)
  const outerPath = generateParallelogramPath(radians, halfAngle, outerSegmentInner, CHOP.outerRadius);

  return `    <path id="${id}" data-name="${dataName}" d="${innerPath} ${outerPath}" fill="${shared.COLORS.foreground}"/>`;
}

/**
 * Generate SVG path for a parallelogram segment
 */
function generateParallelogramPath(radians, halfAngle, innerR, outerR) {
  // 4 corners: inner-CCW, inner-CW, outer-CW, outer-CCW
  const p1 = {
    x: CENTER.x + innerR * Math.cos(radians - halfAngle),
    y: CENTER.y + innerR * Math.sin(radians - halfAngle)
  };
  const p2 = {
    x: CENTER.x + innerR * Math.cos(radians + halfAngle),
    y: CENTER.y + innerR * Math.sin(radians + halfAngle)
  };
  const p3 = {
    x: CENTER.x + outerR * Math.cos(radians + halfAngle),
    y: CENTER.y + outerR * Math.sin(radians + halfAngle)
  };
  const p4 = {
    x: CENTER.x + outerR * Math.cos(radians - halfAngle),
    y: CENTER.y + outerR * Math.sin(radians - halfAngle)
  };

  return `M${p1.x.toFixed(3)},${p1.y.toFixed(3)} L${p2.x.toFixed(3)},${p2.y.toFixed(3)} L${p3.x.toFixed(3)},${p3.y.toFixed(3)} L${p4.x.toFixed(3)},${p4.y.toFixed(3)} Z`;
}

/**
 * Generate a divider line between line positions
 */
function generateDividerLine(svgAngle) {
  const radians = svgAngle * Math.PI / 180;

  const x1 = CENTER.x + DIVIDER.innerRadius * Math.cos(radians);
  const y1 = CENTER.y + DIVIDER.innerRadius * Math.sin(radians);
  const x2 = CENTER.x + DIVIDER.outerRadius * Math.cos(radians);
  const y2 = CENTER.y + DIVIDER.outerRadius * Math.sin(radians);

  return `      <line x1="${x1.toFixed(4)}" y1="${y1.toFixed(4)}" x2="${x2.toFixed(4)}" y2="${y2.toFixed(4)}" fill="none" stroke="${shared.COLORS.foreground}" stroke-miterlimit="10" stroke-width="0.6367"/>`;
}

/**
 * Generate all 384 divider lines
 * Dividers are placed at the END of each line (after it in the wheel sequence)
 */
function generateDividers() {
  const dividers = [];

  // Iterate through all 64 gates and 6 lines
  for (let gateIndex = 0; gateIndex < 64; gateIndex++) {
    const gate = gateSequence[gateIndex];

    for (let line = 1; line <= 6; line++) {
      // Get V3 position for this line
      const v3Data = positioning.getDockingData(gate, line);
      // Divider is at the END of this line (half a line arc after the line center)
      const dividerAngle = v3Data.angle + LINE_ARC / 2;

      const svgAngle = shared.calculateSVGAngle(dividerAngle);
      dividers.push(generateDividerLine(svgAngle));
    }
  }

  return dividers.join('\n');
}

/**
 * Generate the 4 ring circles
 */
function generateRingCircles() {
  return `    <circle id="INNER" cx="${CENTER.x}" cy="${CENTER.y}" r="${RING.inner}" fill="none" stroke="${shared.COLORS.foreground}" stroke-miterlimit="10" stroke-width="2.7488"/>
    <circle id="INNER-CENTRE" cx="${CENTER.x}" cy="${CENTER.y}" r="${RING.innerCentre}" fill="none" stroke="${shared.COLORS.foreground}" stroke-miterlimit="10" stroke-width="1.3744"/>
    <circle id="OUTER-CENTRE" cx="${CENTER.x}" cy="${CENTER.y}" r="${RING.outerCentre}" fill="none" stroke="${shared.COLORS.foreground}" stroke-miterlimit="10" stroke-width="1.3744"/>
    <circle id="OUTER" cx="${CENTER.x}" cy="${CENTER.y}" r="${RING.outer}" fill="none" stroke="${shared.COLORS.foreground}" stroke-miterlimit="10" stroke-width="2.7488"/>`;
}

/**
 * Generate all 384 chops (192 YANG + 192 YIN)
 */
function generateChops() {
  const yangChops = [];
  const yinChops = [];

  // Iterate through all 64 gates and 6 lines
  for (let gateIndex = 0; gateIndex < 64; gateIndex++) {
    const gate = gateSequence[gateIndex];

    for (let line = 1; line <= 6; line++) {
      // Get V3 positioning directly for this gate.line
      const v3Data = positioning.getDockingData(gate, line);
      const svgAngle = shared.calculateSVGAngle(v3Data.angle);

      // Get line metadata
      const polarity = getPolarity(gate, line);
      const lineKeynote = getLineKeynote(gate, line);
      const planets = getPlanets(gate, line);

      // Create ID and data-name (following master SVG format: Gate.Line - Keynote - Polarity - Detriment - Exalted)
      const gateLineKey = `${gate}.${line}`;
      const keynoteForId = lineKeynote.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
      const id = `_${gateLineKey}_-_${keynoteForId}_-_${polarity}_-_${planets.detriment}_-_${planets.exalted}`;
      const dataName = `${gateLineKey} - ${lineKeynote} - ${polarity} - ${planets.detriment} - ${planets.exalted}`;

      // Generate chop based on polarity
      if (polarity === 'YANG') {
        yangChops.push(generateYangChop(svgAngle, id, dataName));
      } else {
        yinChops.push(generateYinChop(svgAngle, id, dataName));
      }
    }
  }

  return { yangChops, yinChops };
}

/**
 * Generate the complete 192 Full Chops Ring SVG
 * @param {Object} options
 * @param {boolean} options.includeStructure - Include rings and dividers
 * @param {boolean} options.includeBackground - Include background rect
 * @param {string} options.backgroundColor - Background color
 * @param {string} options.polarityFilter - 'all', 'yang', or 'yin' - filter which chops to include
 */
function generateFullChopsRing(options = {}) {
  const {
    includeStructure = true,
    includeBackground = true,
    backgroundColor = shared.COLORS.background,
    polarityFilter = 'all'  // 'all', 'yang', or 'yin'
  } = options;

  const svgParts = [];

  // SVG header
  svgParts.push(`<svg id="GROUP_-_384_YIN_YANG_LINES" data-name="GROUP - 384 YIN/YANG LINES" xmlns="http://www.w3.org/2000/svg" width="${VIEWBOX_SIZE}" height="${VIEWBOX_SIZE}" viewBox="0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}">`);

  // Background
  if (includeBackground) {
    svgParts.push(`  <rect width="100%" height="100%" fill="${backgroundColor}"/>`);
  }

  // Structure (rings and dividers)
  if (includeStructure) {
    svgParts.push('  <g id="STRUCTURE">');
    svgParts.push('    <g id="RINGS">');
    svgParts.push(generateRingCircles());
    svgParts.push('    </g>');
    svgParts.push('    <g id="_384_DIVIDERS" data-name="384 DIVIDERS">');
    svgParts.push(generateDividers());
    svgParts.push('    </g>');
    svgParts.push('  </g>');
  }

  // Generate chops
  const { yangChops, yinChops } = generateChops();

  // YANG chops group (if not filtering to yin-only)
  if (polarityFilter === 'all' || polarityFilter === 'yang') {
    svgParts.push('  <g id="GROUP_-_YANG" data-name="GROUP - YANG">');
    yangChops.forEach(chop => svgParts.push(chop));
    svgParts.push('  </g>');
  }

  // YIN chops group (if not filtering to yang-only)
  if (polarityFilter === 'all' || polarityFilter === 'yin') {
    svgParts.push('  <g id="GROUP_-_YIN" data-name="GROUP - YIN">');
    yinChops.forEach(chop => svgParts.push(chop));
    svgParts.push('  </g>');
  }

  // Close SVG
  svgParts.push('</svg>');

  return svgParts.join('\n');
}

/**
 * Get statistics about chop distribution
 */
function getStatistics() {
  let yangCount = 0;
  let yinCount = 0;

  for (let gateIndex = 0; gateIndex < 64; gateIndex++) {
    const gate = gateSequence[gateIndex];
    for (let line = 1; line <= 6; line++) {
      const polarity = getPolarity(gate, line);
      if (polarity === 'YANG') yangCount++;
      else yinCount++;
    }
  }

  return {
    totalLines: 384,
    yangCount,
    yinCount,
    totalGates: 64
  };
}

// ============================================================================
// EXPORTS AND CLI
// ============================================================================

module.exports = {
  generateFullChopsRing,
  getStatistics,
  CENTER,
  RING,
  CHOP,
  GATE_ARC,
  LINE_ARC
};

// CLI execution
if (require.main === module) {
  const outputDir = path.join(__dirname, '../output');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const stats = getStatistics();

  // Generate all three versions
  const versions = [
    { filter: 'all', filename: 'generated-full-chops-ring.svg', label: 'Full (all 384)' },
    { filter: 'yang', filename: 'generated-yang-chops-ring.svg', label: 'YANG only (192)' },
    { filter: 'yin', filename: 'generated-yin-chops-ring.svg', label: 'YIN only (192)' }
  ];

  console.log('Generating Chops Rings...');
  console.log(`  - ${stats.totalLines} total lines (${stats.totalGates} gates × 6 lines)`);
  console.log(`  - ${stats.yangCount} YANG chops (solid parallelograms)`);
  console.log(`  - ${stats.yinCount} YIN chops (split parallelograms)`);
  console.log('  - Using V3 positioning for alignment with other rings');
  console.log('');

  versions.forEach(({ filter, filename, label }) => {
    const svg = generateFullChopsRing({ polarityFilter: filter });
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, svg);
    console.log(`${label}: ${outputPath} (${(svg.length / 1024).toFixed(1)} KB)`);
  });

  console.log('\nDone!');
}
