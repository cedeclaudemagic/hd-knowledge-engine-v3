/**
 * Eight-Position Wave Diagram Generator
 *
 * THE foundational visualization for the Electromagnetic I Ching framework.
 * This shows the 8 trigram positions as points on a wave oscillating between
 * the Void domain (potential) and Form domain (manifestation).
 *
 * THE WAVE:
 *
 *   VOID DOMAIN                 0                  FORM DOMAIN
 *   (Potential)              (Zero)              (Manifestation)
 *
 *       Heaven ●────────────────────────────────────● Earth
 *         -4  \                                    /  +4
 *              \  Lake                  Mountain  /
 *               ●  -3                     +3  ●
 *                \                           /
 *                 \  Fire           Water   /
 *                  ●  -2             +2  ●
 *                   \                   /
 *                    \  Wind   Thunder /
 *                     ●  -1     +1  ●
 *                      \           /
 *                       \_________/
 *                            0
 *
 * POSITIONS:
 * -4 (Heaven/Source)       Pure potential, origin
 * -3 (Lake/Capacitance)    Stored potential
 * -2 (Fire/Voltage)        Creative pressure
 * -1 (Wind/Gate-OUT)       Release point
 * +1 (Thunder/Gate-IN)     Entry to form
 * +2 (Water/Current)       Committed flow
 * +3 (Mountain/Inductance) Held pattern
 * +4 (Earth/Sink)          Full manifestation
 *
 * This diagram is used in:
 * - Tome introduction (Layer 0)
 * - Book 1: The Wave
 * - All articles explaining the framework
 * - Oracle introduction (10-page intro)
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  width: 1200,
  height: 600,
  margin: { top: 80, right: 60, bottom: 100, left: 60 },

  // Wave geometry
  wave: {
    amplitude: 180,  // Height from center to peak
    wavelength: 1.0  // Full wave across the diagram
  },

  // Colors
  colors: {
    dark: {
      background: '#151E25',
      foreground: '#FFFFFF',
      wave: '#fab414',           // Gold wave line
      void: '#8B7EC8',           // Purple for void domain
      form: '#50A080',           // Teal for form domain
      zero: '#888888',           // Grey for zero crossing
      positions: '#FFFFFF'
    },
    light: {
      background: '#FFFFFF',
      foreground: '#1d1d1b',
      wave: '#c9a227',
      void: '#6a4c93',
      form: '#2a7a5a',
      zero: '#666666',
      positions: '#1d1d1b'
    }
  }
};

// ============================================================================
// POSITION DATA
// ============================================================================

const POSITIONS = [
  { position: -4, trigram: 'Heaven', symbol: '☰', emPhase: 'Source', emKeyword: 'Pure potential', binary: '111' },
  { position: -3, trigram: 'Lake', symbol: '☱', emPhase: 'Capacitance', emKeyword: 'Stored possibility', binary: '110' },
  { position: -2, trigram: 'Fire', symbol: '☲', emPhase: 'Voltage', emKeyword: 'Creative pressure', binary: '101' },
  { position: -1, trigram: 'Wind', symbol: '☴', emPhase: 'Gate-OUT', emKeyword: 'Release point', binary: '011' },
  { position: +1, trigram: 'Thunder', symbol: '☳', emPhase: 'Gate-IN', emKeyword: 'Entry to form', binary: '100' },
  { position: +2, trigram: 'Water', symbol: '☵', emPhase: 'Current', emKeyword: 'Committed flow', binary: '010' },
  { position: +3, trigram: 'Mountain', symbol: '☶', emPhase: 'Inductance', emKeyword: 'Held pattern', binary: '001' },
  { position: +4, trigram: 'Earth', symbol: '☷', emPhase: 'Sink', emKeyword: 'Full form', binary: '000' }
];

// ============================================================================
// TRIGRAM SYMBOL GENERATION
// ============================================================================

/**
 * Generate SVG for a trigram symbol (three yin/yang lines)
 */
function generateTrigramSymbol(binary, x, y, scale = 1, fill = '#FFFFFF') {
  const lineWidth = 24 * scale;
  const lineHeight = 4 * scale;
  const lineSpacing = 8 * scale;
  const yinGapWidth = 5 * scale;

  const lines = [];

  for (let i = 0; i < 3; i++) {
    const bit = binary[i];
    const lineY = y + (1 - i) * lineSpacing;  // Top line first (index 0 is top)

    if (bit === '1') {
      // Yang - solid line
      lines.push(`<rect x="${x - lineWidth/2}" y="${lineY - lineHeight/2}" width="${lineWidth}" height="${lineHeight}" fill="${fill}"/>`);
    } else {
      // Yin - broken line
      const segmentWidth = (lineWidth - yinGapWidth) / 2;
      lines.push(`<rect x="${x - lineWidth/2}" y="${lineY - lineHeight/2}" width="${segmentWidth}" height="${lineHeight}" fill="${fill}"/>`);
      lines.push(`<rect x="${x + yinGapWidth/2}" y="${lineY - lineHeight/2}" width="${segmentWidth}" height="${lineHeight}" fill="${fill}"/>`);
    }
  }

  return lines.join('\n');
}

// ============================================================================
// WAVE PATH GENERATION
// ============================================================================

/**
 * Generate SVG path for the wave curve
 * Uses a smooth curve from position -4 through 0 to +4
 *
 * CONCEPTUAL MODEL:
 * - Heaven (-4/Source) is at the TOP: maximum potential, peak of the wave
 * - Earth (+4/Sink) is at the BOTTOM: manifestation, ground
 * - The wave descends from potential to form
 * - Zero crossing happens between -1 (Gate-OUT) and +1 (Gate-IN)
 */
function generateWavePath(plotArea, amplitude, colors) {
  const { x, y, width, height } = plotArea;
  const centerY = y + height / 2;

  // Calculate x positions for each position (-4 to +4)
  const positionWidth = width / 8;  // 8 positions

  // Generate path points
  const points = [];

  // Wave descends from Heaven (top-left) to Earth (bottom-right)
  // Using linear interpolation for position with cosine easing for visual smoothness

  POSITIONS.forEach((pos, index) => {
    const xPos = x + positionWidth * index + positionWidth / 2;

    // Position maps linearly from -4 (top) to +4 (bottom)
    // Normalize position to 0-1 range: (-4 to +4) -> (0 to 1)
    const normalized = (pos.position + 4) / 8;  // -4 -> 0, +4 -> 1

    // Apply slight S-curve easing for visual appeal
    const eased = normalized;  // Linear mapping: top at -4, bottom at +4

    // Y position: top = y - amplitude, bottom = y + amplitude
    const yPos = centerY - amplitude + (eased * amplitude * 2);

    points.push({ x: xPos, y: yPos, position: pos.position });
  });

  // Create smooth curve through all points using cubic bezier
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    // Control points for smooth curve
    const cp1x = prev.x + (curr.x - prev.x) * 0.4;
    const cp1y = prev.y;
    const cp2x = curr.x - (curr.x - prev.x) * 0.4;
    const cp2y = curr.y;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }

  return { path, points };
}

// ============================================================================
// SVG GENERATION
// ============================================================================

/**
 * Generate the complete eight-position wave diagram
 */
function generateEightPositionWave(options = {}) {
  const {
    colorScheme = 'dark',
    includeBackground = true,
    includeTrigramSymbols = true,
    includeKeywords = true,
    width = CONFIG.width,
    height = CONFIG.height
  } = options;

  const colors = CONFIG.colors[colorScheme] || CONFIG.colors.dark;
  const margin = CONFIG.margin;

  // Calculate plot area
  const plotArea = {
    x: margin.left,
    y: margin.top,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  const centerY = plotArea.y + plotArea.height / 2;
  const amplitude = CONFIG.wave.amplitude;

  // Generate wave path
  const { path: wavePath, points } = generateWavePath(plotArea, amplitude, colors);

  const parts = [];

  // SVG header
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`);

  // Defs for gradients
  parts.push(`  <defs>
    <linearGradient id="voidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${colors.void};stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:${colors.void};stop-opacity:0"/>
    </linearGradient>
    <linearGradient id="formGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${colors.form};stop-opacity:0"/>
      <stop offset="100%" style="stop-color:${colors.form};stop-opacity:0.3"/>
    </linearGradient>
  </defs>`);

  // Background
  if (includeBackground) {
    parts.push(`  <rect width="100%" height="100%" fill="${colors.background}"/>`);
  }

  // Domain backgrounds
  const midX = plotArea.x + plotArea.width / 2;
  parts.push(`  <rect x="${plotArea.x}" y="${plotArea.y}" width="${plotArea.width/2}" height="${plotArea.height}" fill="url(#voidGradient)"/>`);
  parts.push(`  <rect x="${midX}" y="${plotArea.y}" width="${plotArea.width/2}" height="${plotArea.height}" fill="url(#formGradient)"/>`);

  // Zero line (vertical center)
  parts.push(`  <line x1="${midX}" y1="${plotArea.y}" x2="${midX}" y2="${plotArea.y + plotArea.height}"
        stroke="${colors.zero}" stroke-width="1" stroke-dasharray="4,4" opacity="0.5"/>`);

  // Center horizontal line
  parts.push(`  <line x1="${plotArea.x}" y1="${centerY}" x2="${plotArea.x + plotArea.width}" y2="${centerY}"
        stroke="${colors.foreground}" stroke-width="0.5" opacity="0.3"/>`);

  // The Wave Path
  parts.push(`  <path d="${wavePath}" fill="none" stroke="${colors.wave}" stroke-width="3" stroke-linecap="round"/>`);

  // Position markers and labels
  parts.push(`  <g id="positions">`);

  points.forEach((point, index) => {
    const pos = POSITIONS[index];
    const isVoid = pos.position < 0;
    const domainColor = isVoid ? colors.void : colors.form;

    // Position marker (dot on wave)
    parts.push(`    <circle cx="${point.x}" cy="${point.y}" r="8" fill="${colors.wave}" stroke="${colors.background}" stroke-width="2"/>`);

    // Position number - labels above wave for void (top), below for form (bottom)
    const posLabel = pos.position > 0 ? `+${pos.position}` : `${pos.position}`;
    const labelAbove = pos.position <= 0;  // Void positions (at top) get labels above
    const labelY = labelAbove ? point.y - 55 : point.y + 55;

    parts.push(`    <text x="${point.x}" y="${labelY}"
          font-family="Copperplate, Georgia, serif" font-size="16" font-weight="bold"
          fill="${colors.wave}" text-anchor="middle">${posLabel}</text>`);

    // Trigram name
    const trigramY = labelAbove ? point.y - 35 : point.y + 35;
    parts.push(`    <text x="${point.x}" y="${trigramY}"
          font-family="Copperplate, Georgia, serif" font-size="14"
          fill="${colors.foreground}" text-anchor="middle">${pos.trigram}</text>`);

    // EM Phase
    const phaseY = labelAbove ? point.y - 18 : point.y + 55;
    parts.push(`    <text x="${point.x}" y="${phaseY}"
          font-family="Copperplate, Georgia, serif" font-size="11"
          fill="${domainColor}" text-anchor="middle">${pos.emPhase}</text>`);

    // Trigram symbol
    if (includeTrigramSymbols) {
      const symbolY = labelAbove ? point.y - 85 : point.y + 85;
      parts.push(generateTrigramSymbol(pos.binary, point.x, symbolY, 0.7, colors.foreground));
    }
  });

  parts.push(`  </g>`);

  // Domain labels
  const domainY = plotArea.y - 25;
  parts.push(`  <text x="${plotArea.x + plotArea.width * 0.25}" y="${domainY}"
        font-family="Copperplate, Georgia, serif" font-size="18" font-weight="bold"
        fill="${colors.void}" text-anchor="middle">VOID</text>`);
  parts.push(`  <text x="${plotArea.x + plotArea.width * 0.25}" y="${domainY + 18}"
        font-family="Copperplate, Georgia, serif" font-size="11"
        fill="${colors.void}" text-anchor="middle" opacity="0.7">(Potential)</text>`);

  parts.push(`  <text x="${plotArea.x + plotArea.width * 0.75}" y="${domainY}"
        font-family="Copperplate, Georgia, serif" font-size="18" font-weight="bold"
        fill="${colors.form}" text-anchor="middle">FORM</text>`);
  parts.push(`  <text x="${plotArea.x + plotArea.width * 0.75}" y="${domainY + 18}"
        font-family="Copperplate, Georgia, serif" font-size="11"
        fill="${colors.form}" text-anchor="middle" opacity="0.7">(Manifestation)</text>`);

  // Zero crossing label
  parts.push(`  <text x="${midX}" y="${height - 30}"
        font-family="Copperplate, Georgia, serif" font-size="12"
        fill="${colors.zero}" text-anchor="middle">Zero Crossing</text>`);

  // Title
  parts.push(`  <text x="${width/2}" y="35"
        font-family="Copperplate, Georgia, serif" font-size="22" font-weight="bold"
        fill="${colors.foreground}" text-anchor="middle">The Eight Positions</text>`);
  parts.push(`  <text x="${width/2}" y="55"
        font-family="Copperplate, Georgia, serif" font-size="12"
        fill="${colors.foreground}" text-anchor="middle" opacity="0.7">The Electromagnetic Wave</text>`);

  parts.push('</svg>');

  return parts.join('\n');
}

/**
 * Generate a compact version for inline use
 */
function generateCompactWave(options = {}) {
  return generateEightPositionWave({
    ...options,
    width: 800,
    height: 400,
    includeKeywords: false
  });
}

/**
 * Get position data for a specific position number
 */
function getPositionData(positionNumber) {
  return POSITIONS.find(p => p.position === positionNumber);
}

/**
 * Get all positions
 */
function getAllPositions() {
  return POSITIONS;
}

// ============================================================================
// EXPORTS AND CLI
// ============================================================================

module.exports = {
  generateEightPositionWave,
  generateCompactWave,
  getPositionData,
  getAllPositions,
  POSITIONS,
  CONFIG
};

// CLI execution
if (require.main === module) {
  const outputDir = path.join(__dirname, '../output');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generating Eight-Position Wave Diagram...');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  THE EIGHT POSITIONS');
  console.log('  The Electromagnetic Wave');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('  VOID DOMAIN (Potential)           FORM DOMAIN (Manifestation)');
  console.log('  ─────────────────────────────────────────────────────────────');

  POSITIONS.forEach(pos => {
    const sign = pos.position > 0 ? '+' : '';
    const domain = pos.position < 0 ? 'Void' : 'Form';
    console.log(`  ${sign}${pos.position}  ${pos.trigram.padEnd(8)} ${pos.emPhase.padEnd(12)} ${pos.emKeyword}`);
  });

  console.log('');

  // Generate dark version (primary)
  const svgDark = generateEightPositionWave({ colorScheme: 'dark' });
  const darkPath = path.join(outputDir, 'eight-position-wave-dark.svg');
  fs.writeFileSync(darkPath, svgDark);
  console.log(`Output: ${darkPath} (${(svgDark.length / 1024).toFixed(1)} KB)`);

  // Generate light version
  const svgLight = generateEightPositionWave({ colorScheme: 'light' });
  const lightPath = path.join(outputDir, 'eight-position-wave-light.svg');
  fs.writeFileSync(lightPath, svgLight);
  console.log(`Output: ${lightPath} (${(svgLight.length / 1024).toFixed(1)} KB)`);

  // Generate compact version
  const svgCompact = generateCompactWave({ colorScheme: 'dark' });
  const compactPath = path.join(outputDir, 'eight-position-wave-compact.svg');
  fs.writeFileSync(compactPath, svgCompact);
  console.log(`Output: ${compactPath} (${(svgCompact.length / 1024).toFixed(1)} KB)`);

  console.log('\nDone!');
}
