/**
 * Electromagnetic Trigrams Ring Generator
 *
 * A coupled ring showing both traditional I Ching trigram names and their
 * electromagnetic interpretations using the Four Axes Framework.
 *
 * FOUR AXES:
 * - POLES (Reference): Heaven/Earth — Source/Sink
 * - CONTAINERS (Storage): Lake/Mountain — Capacitance/Inductance
 * - FLOW (Exchange): Fire/Water — Voltage/Current
 * - GATES (Switch): Thunder/Wind — Close(ON)/Open(OFF)
 *
 * The ring displays:
 * - Inner: Traditional trigram names (Heaven, Earth, Fire, Water, etc.)
 * - Outer: EM circuit functions (Source, Sink, Storage, Flow, Gates)
 * - Visual indication of DC side (Line 1 = Yang) and AC side (Line 1 = Yin)
 * - Trigram symbols with yin/yang lines
 *
 * References:
 * - docs/research/russell-trigram-mapping-exploration.md
 * - knowledge-systems/trigrams/mappings/trigrams-mappings.json
 */

const fs = require('fs');
const path = require('path');
const shared = require('./shared-constants');

// Load trigram data from knowledge engine
const trigramsData = require('../../knowledge-systems/trigrams/mappings/trigrams-mappings.json');

// ============================================================================
// GEOMETRY CONSTANTS
// ============================================================================

const GEOMETRY = {
  viewBox: { width: 896.1523, height: 896.6787 },
  center: { x: 448.0762, y: 448.3394 },

  // Ring radii - sized to fit within the viewBox with room for flow arrows
  // Max radius from center to edge: ~448px, minus margin for flow band (~50px)
  ring: {
    innerRadius: 320,
    outerRadius: 380
  }
};

// ============================================================================
// COLOR SCHEMES
// ============================================================================

const COLOR_SCHEMES = {
  light: {
    background: 'none',
    foreground: '#1d1d1b',
    stroke: '#1d1d1b',
    accumulation: '#3a5a80',    // Blue-grey for accumulation arc
    expression: '#8a4a30',       // Warm brown for expression arc
    seed: '#c9a227',             // Gold for Heaven (peak/seed)
    manifestation: '#2a5a3a'     // Deep green for Earth (manifestation)
  },
  dark: {
    background: '#151E25',
    foreground: '#FFFFFF',
    stroke: '#FFFFFF',
    accumulation: '#4a7ab0',     // Lighter blue for dark mode
    expression: '#c07050',        // Lighter warm for dark mode
    seed: '#fab414',              // Gold accent
    manifestation: '#4a9a6a'      // Lighter green for dark mode
  }
};

let activeColorScheme = COLOR_SCHEMES.dark;

// ============================================================================
// ELECTROMAGNETIC DATA
// ============================================================================

/**
 * The electromagnetic interpretation of each trigram
 * Using the Four Axes Framework
 *
 * FOUR AXES:
 * - POLES (Reference): Heaven/Earth — Source/Sink
 * - CONTAINERS (Storage): Lake/Mountain — Capacitance/Inductance
 * - FLOW (Exchange): Fire/Water — Voltage/Current
 * - GATES (Switch): Thunder/Wind — Close(ON)/Open(OFF)
 *
 * DC Side (Line 1 = Yang): Heaven, Lake, Fire, Thunder
 * AC Side (Line 1 = Yin): Wind, Water, Mountain, Earth
 */
const EM_CYCLE = {
  // POLES AXIS
  'Heaven': {
    binary: '111',
    axis: 'POLES',
    emPhase: 'SOURCE',
    emKeyword: 'Emanation',
    emDescription: 'Origin of potential, +V rail, creative source',
    side: 'dc',
    circuitAnalogy: 'Positive voltage rail, power source'
  },
  'Earth': {
    binary: '000',
    axis: 'POLES',
    emPhase: 'SINK',
    emKeyword: 'Manifestation',
    emDescription: 'Ground reference, where potential becomes actual',
    side: 'ac',
    circuitAnalogy: 'Ground, return path, zero reference'
  },

  // CONTAINERS AXIS
  'Lake': {
    binary: '110',
    axis: 'CONTAINERS',
    emPhase: 'CAPACITANCE',
    emKeyword: 'Electric Storage',
    emDescription: 'Energy stored in electric field, holds voltage',
    side: 'dc',
    circuitAnalogy: 'Capacitor, charge reservoir'
  },
  'Mountain': {
    binary: '001',
    axis: 'CONTAINERS',
    emPhase: 'INDUCTANCE',
    emKeyword: 'Magnetic Storage',
    emDescription: 'Energy stored in magnetic field, maintains current',
    side: 'ac',
    circuitAnalogy: 'Inductor, the coil'
  },

  // FLOW AXIS
  'Fire': {
    binary: '101',
    axis: 'FLOW',
    emPhase: 'VOLTAGE',
    emKeyword: 'Potential Difference',
    emDescription: 'The pressure that causes flow, the push',
    side: 'dc',
    circuitAnalogy: 'Voltage, EMF, potential difference'
  },
  'Water': {
    binary: '010',
    axis: 'FLOW',
    emPhase: 'CURRENT',
    emKeyword: 'Charge Movement',
    emDescription: 'Actual flow of charge, the stream',
    side: 'ac',
    circuitAnalogy: 'Current, amperage, electron flow'
  },

  // GATES AXIS
  'Thunder': {
    binary: '100',
    axis: 'GATES',
    emPhase: 'CLOSE / ON',
    emKeyword: 'Circuit Completing',
    emDescription: 'Gate closes, discharge event, wave collapses',
    side: 'dc',
    circuitAnalogy: 'Switch closing, rising edge (0→1)'
  },
  'Wind': {
    binary: '011',
    axis: 'GATES',
    emPhase: 'OPEN / OFF',
    emKeyword: 'Field Sustained',
    emDescription: 'Gate open, potential sustained, superposition',
    side: 'ac',
    circuitAnalogy: 'Switch opening, falling edge (1→0)'
  }
};

/**
 * Trigram positions on the wheel (SVG angles)
 * These match the quarters-trigrams-faces-ring positioning
 */
const TRIGRAM_POSITIONS = {
  'Heaven':   { svgAngle: 22.5 },
  'Lake':     { svgAngle: -22.5 },
  'Fire':     { svgAngle: -67.5 },
  'Thunder':  { svgAngle: -112.5 },
  'Earth':    { svgAngle: -157.5 },
  'Mountain': { svgAngle: 157.5 },
  'Water':    { svgAngle: 112.5 },
  'Wind':     { svgAngle: 67.5 }
};

// ============================================================================
// FONT CONFIGURATION
// ============================================================================

const FONTS = {
  traditional: {
    family: 'Copperplate',
    size: 14,
    weight: 'normal'
  },
  emPhase: {
    family: 'Copperplate',
    size: 11,
    weight: 'normal'
  },
  emKeyword: {
    family: 'Copperplate-Light, Copperplate',
    size: 9,
    weight: 300
  },
  symbol: {
    lineWidth: 16,
    lineHeight: 3.5,
    lineSpacing: 5.5,
    yinGapWidth: 3
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate a trigram symbol (3 yin/yang lines)
 */
function generateTrigramSymbol(binary, x, y, rotation = 0, scale = 1) {
  const cfg = FONTS.symbol;
  const lineWidth = cfg.lineWidth * scale;
  const lineHeight = cfg.lineHeight * scale;
  const lineSpacing = cfg.lineSpacing * scale;
  const yinGapWidth = cfg.yinGapWidth * scale;

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
 * Calculate position on circle
 */
function calculatePosition(svgAngle, radius) {
  const radians = (svgAngle - 90) * Math.PI / 180;  // -90 to start from top
  return {
    x: GEOMETRY.center.x + radius * Math.cos(radians),
    y: GEOMETRY.center.y + radius * Math.sin(radians)
  };
}

/**
 * Get arc color based on trigram's position in the cycle
 */
function getArcColor(trigramName) {
  const em = EM_CYCLE[trigramName];
  if (em.arc === 'peak') return activeColorScheme.seed;
  if (trigramName === 'Earth') return activeColorScheme.manifestation;
  if (em.arc === 'accumulation') return activeColorScheme.accumulation;
  return activeColorScheme.expression;
}

// ============================================================================
// SVG GENERATION
// ============================================================================

/**
 * Generate a curved arrow along an arc path
 * @param {number} startAngle - Starting SVG angle
 * @param {number} endAngle - Ending SVG angle
 * @param {number} radius - Radius for the arrow path
 * @param {string} color - Arrow color
 * @param {string} id - Arrow ID
 * @param {boolean} clockwise - Direction of arrow
 */
function generateCurvedArrow(startAngle, endAngle, radius, color, id, clockwise = true) {
  const startRad = (startAngle - 90) * Math.PI / 180;
  const endRad = (endAngle - 90) * Math.PI / 180;

  const x1 = GEOMETRY.center.x + radius * Math.cos(startRad);
  const y1 = GEOMETRY.center.y + radius * Math.sin(startRad);
  const x2 = GEOMETRY.center.x + radius * Math.cos(endRad);
  const y2 = GEOMETRY.center.y + radius * Math.sin(endRad);

  // Determine arc direction
  const sweepFlag = clockwise ? 1 : 0;
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

  // Calculate arrowhead position and angle
  const arrowRad = endRad;
  const arrowAngle = (endAngle) + (clockwise ? 90 : -90);

  // Arrowhead points
  const arrowSize = 6;
  const arrowX = x2;
  const arrowY = y2;

  const d = `M ${x1.toFixed(4)} ${y1.toFixed(4)} A ${radius} ${radius} 0 ${largeArc} ${sweepFlag} ${x2.toFixed(4)} ${y2.toFixed(4)}`;

  return `<g id="${id}">
      <path d="${d}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
      <polygon points="0,-${arrowSize} ${arrowSize*0.6},${arrowSize*0.4} -${arrowSize*0.6},${arrowSize*0.4}"
               transform="translate(${arrowX.toFixed(4)}, ${arrowY.toFixed(4)}) rotate(${arrowAngle})"
               fill="${color}"/>
    </g>`;
}

/**
 * Generate the flow band showing the bidirectional cycle
 *
 * The cycle can be read BOTH ways around the wheel:
 *   CLOCKWISE (Accumulation): Earth → Mountain → Water → Wind → Heaven → Lake → Fire → Thunder → Earth
 *   COUNTER-CLOCKWISE (Expression): Earth → Thunder → Fire → Lake → Heaven → Wind → Water → Mountain → Earth
 *
 * This creates a continuous loop with two arrows showing both directions.
 */
function generateFlowBand() {
  const parts = [];
  const flowRadius = GEOMETRY.ring.outerRadius + 25;  // Just outside the main ring

  parts.push('  <g id="FLOW-BAND">');

  // Full circle band (subtle background)
  parts.push(`    <circle cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${flowRadius}"
              fill="none" stroke="${activeColorScheme.foreground}" stroke-width="8" opacity="0.08"/>`);

  // CLOCKWISE arrow (Accumulation direction)
  // Arrow on the right side, pointing upward (toward Heaven/Seed)
  const cwAngle = 90;  // Right side
  const cwRad = (cwAngle - 90) * Math.PI / 180;
  const cwX = GEOMETRY.center.x + flowRadius * Math.cos(cwRad);
  const cwY = GEOMETRY.center.y + flowRadius * Math.sin(cwRad);

  parts.push(`    <g id="ACCUMULATION-DIRECTION">`);
  // Arrowhead pointing clockwise (upward on right side)
  parts.push(`      <polygon points="0,-8 5,4 -5,4"
               transform="translate(${cwX.toFixed(4)}, ${cwY.toFixed(4)}) rotate(-45)"
               fill="${activeColorScheme.accumulation}"/>`);
  // Label
  parts.push(`      <text transform="translate(${(cwX + 20).toFixed(4)}, ${cwY.toFixed(4)}) rotate(0)"
            font-family="Copperplate-Light, Copperplate" font-size="10" font-weight="300"
            fill="${activeColorScheme.accumulation}" text-anchor="start" dominant-baseline="middle">ACCUMULATION</text>`);
  parts.push('    </g>');

  // COUNTER-CLOCKWISE arrow (Expression direction)
  // Arrow on the left side, pointing downward (toward Earth/Ground)
  const ccwAngle = -90;  // Left side
  const ccwRad = (ccwAngle - 90) * Math.PI / 180;
  const ccwX = GEOMETRY.center.x + flowRadius * Math.cos(ccwRad);
  const ccwY = GEOMETRY.center.y + flowRadius * Math.sin(ccwRad);

  parts.push(`    <g id="EXPRESSION-DIRECTION">`);
  // Arrowhead pointing counter-clockwise (downward on left side)
  parts.push(`      <polygon points="0,-8 5,4 -5,4"
               transform="translate(${ccwX.toFixed(4)}, ${ccwY.toFixed(4)}) rotate(135)"
               fill="${activeColorScheme.expression}"/>`);
  // Label
  parts.push(`      <text transform="translate(${(ccwX - 20).toFixed(4)}, ${ccwY.toFixed(4)}) rotate(0)"
            font-family="Copperplate-Light, Copperplate" font-size="10" font-weight="300"
            fill="${activeColorScheme.expression}" text-anchor="end" dominant-baseline="middle">EXPRESSION</text>`);
  parts.push('    </g>');

  // Peak indicator at Heaven (top-right) - where the arcs meet
  const peakAngle = 22.5;
  const peakRad = (peakAngle - 90) * Math.PI / 180;
  const peakX = GEOMETRY.center.x + flowRadius * Math.cos(peakRad);
  const peakY = GEOMETRY.center.y + flowRadius * Math.sin(peakRad);

  parts.push(`    <circle cx="${peakX.toFixed(4)}" cy="${peakY.toFixed(4)}" r="4"
              fill="${activeColorScheme.seed}"/>`);

  // Ground indicator at Earth (bottom-left) - where the arcs meet
  const groundAngle = -157.5;
  const groundRad = (groundAngle - 90) * Math.PI / 180;
  const groundX = GEOMETRY.center.x + flowRadius * Math.cos(groundRad);
  const groundY = GEOMETRY.center.y + flowRadius * Math.sin(groundRad);

  parts.push(`    <circle cx="${groundX.toFixed(4)}" cy="${groundY.toFixed(4)}" r="4"
              fill="${activeColorScheme.manifestation}"/>`);

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate an arc segment for background coloring
 */
function generateArcSegment(startAngle, endAngle, innerRadius, outerRadius, fill, opacity = 0.15) {
  const startRad = (startAngle - 90) * Math.PI / 180;
  const endRad = (endAngle - 90) * Math.PI / 180;

  const x1Outer = GEOMETRY.center.x + outerRadius * Math.cos(startRad);
  const y1Outer = GEOMETRY.center.y + outerRadius * Math.sin(startRad);
  const x2Outer = GEOMETRY.center.x + outerRadius * Math.cos(endRad);
  const y2Outer = GEOMETRY.center.y + outerRadius * Math.sin(endRad);

  const x1Inner = GEOMETRY.center.x + innerRadius * Math.cos(endRad);
  const y1Inner = GEOMETRY.center.y + innerRadius * Math.sin(endRad);
  const x2Inner = GEOMETRY.center.x + innerRadius * Math.cos(startRad);
  const y2Inner = GEOMETRY.center.y + innerRadius * Math.sin(startRad);

  // Determine if arc is > 180 degrees
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

  const d = `M ${x1Outer.toFixed(4)} ${y1Outer.toFixed(4)}
             A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2Outer.toFixed(4)} ${y2Outer.toFixed(4)}
             L ${x1Inner.toFixed(4)} ${y1Inner.toFixed(4)}
             A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x2Inner.toFixed(4)} ${y2Inner.toFixed(4)}
             Z`;

  return `<path d="${d}" fill="${fill}" opacity="${opacity}"/>`;
}

/**
 * Generate the arc indicators showing accumulation and expression arcs
 */
function generateArcIndicators() {
  const parts = [];
  const innerR = GEOMETRY.ring.innerRadius;
  const outerR = GEOMETRY.ring.outerRadius;

  parts.push('  <g id="ARC-INDICATORS">');

  // Each trigram occupies 45 degrees (360/8)
  // Generate a subtle background arc for each trigram based on its phase
  Object.entries(TRIGRAM_POSITIONS).forEach(([name, pos]) => {
    const startAngle = pos.svgAngle - 22.5;
    const endAngle = pos.svgAngle + 22.5;
    const color = getArcColor(name);

    parts.push(`    ${generateArcSegment(startAngle, endAngle, innerR, outerR, color, 0.12)}`);
  });

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate the structure (rings)
 */
function generateStructure() {
  const innerR = GEOMETRY.ring.innerRadius;
  const outerR = GEOMETRY.ring.outerRadius;
  const midR = (innerR + outerR) / 2;

  return `  <g id="STRUCTURE">
    <circle id="RING-OUTER" cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${outerR}" fill="none" stroke="${activeColorScheme.stroke}" stroke-width="0.5"/>
    <circle id="RING-INNER" cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${innerR}" fill="none" stroke="${activeColorScheme.stroke}" stroke-width="0.5"/>
    <circle id="RING-MID" cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${midR}" fill="none" stroke="${activeColorScheme.stroke}" stroke-width="0.25" stroke-dasharray="2,2"/>
  </g>`;
}

/**
 * Generate divider lines between trigrams
 */
function generateDividers() {
  const parts = [];
  const innerR = GEOMETRY.ring.innerRadius;
  const outerR = GEOMETRY.ring.outerRadius;

  parts.push('  <g id="DIVIDERS">');

  // 8 dividers at 45° intervals, offset by 22.5° from trigram centers
  for (let i = 0; i < 8; i++) {
    const angle = i * 45;  // 0, 45, 90, 135, 180, 225, 270, 315
    const radians = (angle - 90) * Math.PI / 180;

    const x1 = GEOMETRY.center.x + innerR * Math.cos(radians);
    const y1 = GEOMETRY.center.y + innerR * Math.sin(radians);
    const x2 = GEOMETRY.center.x + outerR * Math.cos(radians);
    const y2 = GEOMETRY.center.y + outerR * Math.sin(radians);

    parts.push(`    <line x1="${x1.toFixed(4)}" y1="${y1.toFixed(4)}" x2="${x2.toFixed(4)}" y2="${y2.toFixed(4)}" stroke="${activeColorScheme.stroke}" stroke-width="0.4"/>`);
  }

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate a single trigram group with all elements
 */
function generateTrigramGroup(name) {
  const parts = [];
  const pos = TRIGRAM_POSITIONS[name];
  const em = EM_CYCLE[name];
  const mapping = trigramsData.mappings.find(m => m.groupName === name);

  const svgAngle = pos.svgAngle;
  const angleRad = svgAngle * Math.PI / 180;
  const cos = Math.cos(angleRad).toFixed(4);
  const sin = Math.sin(angleRad).toFixed(4);

  // Radii for different text elements
  const innerR = GEOMETRY.ring.innerRadius;
  const outerR = GEOMETRY.ring.outerRadius;
  const midR = (innerR + outerR) / 2;

  const symbolRadius = innerR + 15;           // Symbol near inner edge
  const traditionalRadius = midR - 5;          // Traditional name in inner half
  const emPhaseRadius = midR + 12;             // EM phase in outer half
  const emKeywordRadius = outerR - 10;         // EM keyword near outer edge

  // Calculate positions
  const symbolPos = calculatePosition(svgAngle, symbolRadius);
  const traditionalPos = calculatePosition(svgAngle, traditionalRadius);
  const emPhasePos = calculatePosition(svgAngle, emPhaseRadius);
  const emKeywordPos = calculatePosition(svgAngle, emKeywordRadius);

  parts.push(`  <g id="TRIGRAM-${name.toUpperCase()}" data-trigram="${name}" data-binary="${em.binary}" data-arc="${em.arc}" data-cycle-position="${em.cyclePosition}">`);

  // Trigram symbol
  parts.push(`    <g id="SYMBOL-${name.toUpperCase()}">`);
  parts.push(`      ${generateTrigramSymbol(em.binary, symbolPos.x, symbolPos.y, svgAngle, 0.9)}`);
  parts.push('    </g>');

  // Traditional name (inner)
  parts.push(`    <text id="TRADITIONAL-${name.toUpperCase()}"
      transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${traditionalPos.x.toFixed(4)}, ${traditionalPos.y.toFixed(4)})"
      font-family="${FONTS.traditional.family}"
      font-size="${FONTS.traditional.size}"
      fill="${activeColorScheme.foreground}"
      text-anchor="middle"
      dominant-baseline="middle">${name}</text>`);

  // EM Phase (outer, emphasized)
  const phaseColor = getArcColor(name);
  parts.push(`    <text id="EM-PHASE-${name.toUpperCase()}"
      transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${emPhasePos.x.toFixed(4)}, ${emPhasePos.y.toFixed(4)})"
      font-family="${FONTS.emPhase.family}"
      font-size="${FONTS.emPhase.size}"
      fill="${phaseColor}"
      text-anchor="middle"
      dominant-baseline="middle">${em.emPhase}</text>`);

  // EM Keyword (outermost)
  parts.push(`    <text id="EM-KEYWORD-${name.toUpperCase()}"
      transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${emKeywordPos.x.toFixed(4)}, ${emKeywordPos.y.toFixed(4)})"
      font-family="${FONTS.emKeyword.family}"
      font-size="${FONTS.emKeyword.size}"
      font-weight="${FONTS.emKeyword.weight}"
      fill="${activeColorScheme.foreground}"
      opacity="0.7"
      text-anchor="middle"
      dominant-baseline="middle">${em.emKeyword}</text>`);

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate the complete electromagnetic trigrams ring
 */
function generateElectromagneticTrigramsRing(options = {}) {
  const {
    colorScheme = 'dark',
    includeArcIndicators = true,
    includeFlowBand = true,
    includeBackground = undefined
  } = options;

  // Set active color scheme
  activeColorScheme = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.dark;

  // Include background by default for dark theme
  const showBackground = includeBackground !== undefined
    ? includeBackground
    : (colorScheme === 'dark');

  const parts = [];

  // SVG header
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${GEOMETRY.viewBox.width}" height="${GEOMETRY.viewBox.height}" viewBox="0 0 ${GEOMETRY.viewBox.width} ${GEOMETRY.viewBox.height}">`);

  // Background
  if (showBackground && activeColorScheme.background !== 'none') {
    parts.push(`  <rect id="background" width="100%" height="100%" fill="${activeColorScheme.background}"/>`);
  }

  // Flow band (curved arrows showing cycle direction)
  if (includeFlowBand) {
    parts.push(generateFlowBand());
  }

  // Arc indicators (subtle background coloring)
  if (includeArcIndicators) {
    parts.push(generateArcIndicators());
  }

  // Structure (rings)
  parts.push(generateStructure());

  // Dividers
  parts.push(generateDividers());

  // Trigram groups
  parts.push('  <g id="TRIGRAMS">');
  Object.keys(TRIGRAM_POSITIONS).forEach(name => {
    parts.push(generateTrigramGroup(name));
  });
  parts.push('  </g>');

  // Close SVG
  parts.push('</svg>');

  return parts.join('\n');
}

/**
 * Get statistics about the electromagnetic framework
 */
function getStatistics() {
  return {
    trigrams: Object.keys(EM_CYCLE).length,
    accumulationArc: ['Earth', 'Mountain', 'Water', 'Wind', 'Heaven'],
    expressionArc: ['Heaven', 'Lake', 'Fire', 'Thunder', 'Earth'],
    phases: Object.entries(EM_CYCLE).map(([name, em]) => ({
      name,
      binary: em.binary,
      phase: em.emPhase,
      keyword: em.emKeyword,
      arc: em.arc
    }))
  };
}

// ============================================================================
// EXPORTS AND CLI
// ============================================================================

module.exports = {
  generateElectromagneticTrigramsRing,
  getStatistics,
  EM_CYCLE,
  TRIGRAM_POSITIONS,
  GEOMETRY,
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

  console.log('Generating Electromagnetic Trigrams Ring...');
  console.log('');
  console.log('Electromagnetic Cycle (from the articles):');
  console.log('');
  console.log('  ACCUMULATION: Ground → Storage → Current → Inductance → Plasma');
  console.log('                Earth  → Mountain → Water → Wind → Heaven');
  console.log('');
  console.log('  EXPRESSION:   Plasma → Capacitance → Radiation → Discharge → Ground');
  console.log('                Heaven → Lake → Fire → Thunder → Earth');
  console.log('');
  console.log('Phase Mappings:');
  stats.phases.forEach(p => {
    console.log(`  ${p.name.padEnd(10)} (${p.binary}): ${p.phase.padEnd(12)} - ${p.keyword}`);
  });
  console.log('');

  // Generate dark version
  const svg = generateElectromagneticTrigramsRing({ colorScheme: 'dark' });
  const outputPath = path.join(outputDir, 'generated-electromagnetic-trigrams.svg');
  fs.writeFileSync(outputPath, svg);
  console.log(`Output: ${outputPath} (${(svg.length / 1024).toFixed(1)} KB)`);

  console.log('\nDone!');
}
