/**
 * Russell Locked Potentials Ring Generator
 *
 * A visualization mapping Walter Russell's "Formula of Locked Potentials"
 * onto the I Ching trigram wheel, using the Four Axes Framework:
 *
 * FOUR AXES:
 * - POLES (Reference): Heaven/Earth — Void(-4)/Carbon(+4)
 * - CONTAINERS (Storage): Lake/Mountain — Capacitance/Inductance
 * - FLOW (Exchange): Fire/Water — Voltage/Current
 * - GATES (Switch): Wind/Thunder — Gate OUT(-1)/Gate IN(+1)
 *
 * CORRECTED RUSSELL MAPPING:
 * - Heaven (111) = CUBE = Maximum Expansion = Void = -4
 * - Earth (000) = SPHERE = Maximum Compression = Carbon = +4
 *
 * Key features:
 * - Zero (0̄) at CENTER (the Magnetic Monopole / Motion-in-Inertia)
 * - Heaven (111) at -4 = VOID / CUBE (absolute ground)
 * - Earth (000) at +4 = CARBON / SPHERE (local ground, observer position)
 * - VOID side (-): Heaven → Lake → Fire → Wind (dematerialising)
 * - MATTER side (+): Thunder → Water → Mountain → Earth (materialising)
 * - Wind/Thunder at ±1 = GATES - the zero crossing point
 *
 * Observer-relative: We observe from +4 (Carbon), looking toward -4 (Void)
 *
 * The key insight: The wheel IS the wave seen from above.
 * The rim traces amplitude. The center is stillness.
 * The wheel can turn both ways - each axis is a true EM duality.
 *
 * References:
 * - Walter Russell, "The Universal One" (1926)
 * - docs/research/russell-trigram-mapping-exploration.md
 * - docs/research/complete-hexagram-circuit-classification.md
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// GEOMETRY CONSTANTS
// ============================================================================

const GEOMETRY = {
  viewBox: { width: 1200, height: 1200 },
  center: { x: 600, y: 600 },

  // Ring radii
  ring: {
    innerRadius: 200,
    outerRadius: 380
  }
};

// ============================================================================
// COLOR SCHEMES
// ============================================================================

const COLOR_SCHEMES = {
  dark: {
    background: '#151E25',
    foreground: '#FFFFFF',
    stroke: '#FFFFFF',
    charging: '#4a8ac0',      // Blue for Electric/Charging
    discharging: '#c07050',   // Warm brown for Magnetic/Discharging
    sphere: '#fab414',        // Gold for Heaven/Sphere
    cube: '#4a9a6a',          // Green for Earth/Cube
    zero: '#888888',          // Grey for center/stillness
    gridLight: 'rgba(255,255,255,0.1)',
    gridMedium: 'rgba(255,255,255,0.2)'
  }
};

let colors = COLOR_SCHEMES.dark;

// ============================================================================
// THE UNIFIED DATA
// ============================================================================

/**
 * The complete mapping: I Ching + EM + Russell
 *
 * FOUR AXES FRAMEWORK:
 * - POLES (Reference): Heaven/Earth — Source(Void)/Sink(Carbon)
 * - CONTAINERS (Storage): Lake/Mountain — Capacitance/Inductance
 * - FLOW (Exchange): Fire/Water — Voltage/Current
 * - GATES (Switch): Thunder/Wind — Close(ON)/Open(OFF)
 *
 * CORRECTED RUSSELL MAPPING:
 * - Heaven (111) = CUBE = Maximum Expansion = Void = -4
 * - Earth (000) = SPHERE = Maximum Compression = Carbon = +4
 *
 * Observer-relative: We observe from +4 (Carbon/Earth), looking toward -4 (Void/Heaven)
 *
 * Organized by wave position from -4 to +4
 */
const WAVE_POSITIONS = [
  {
    position: '-4',
    trigram: 'Heaven',
    binary: '111',
    chinese: '乾',
    axis: 'POLES',
    em: 'SOURCE / VOID',
    quality: 'Maximum Expansion',
    domination: 'CUBE',
    side: 'void',
    russellZone: 'Absolute Ground',
    wheelAngle: 22.5  // Top-right
  },
  {
    position: '-3',
    trigram: 'Lake',
    binary: '110',
    chinese: '兌',
    axis: 'CONTAINERS',
    em: 'CAPACITANCE',
    quality: 'Electric Field Storage',
    domination: 'Dematerialising',
    side: 'void',
    russellZone: 'Radiating',
    wheelAngle: -22.5  // Top-left
  },
  {
    position: '-2',
    trigram: 'Fire',
    binary: '101',
    chinese: '離',
    axis: 'FLOW',
    em: 'VOLTAGE',
    quality: 'Potential Difference',
    domination: 'Dematerialising',
    side: 'void',
    russellZone: 'Radiating',
    wheelAngle: -67.5  // Left-upper
  },
  {
    position: '-1',
    trigram: 'Wind',
    binary: '011',
    chinese: '巽',
    axis: 'GATES',
    em: 'GATE OUT',
    quality: 'Field Sustained / Open',
    domination: 'Crossing',
    side: 'void',
    russellZone: 'Zero Crossing',
    wheelAngle: 67.5  // Right-upper
  },
  // ZERO is at center - the Monopole - not on the rim
  {
    position: '+1',
    trigram: 'Thunder',
    binary: '100',
    chinese: '震',
    axis: 'GATES',
    em: 'GATE IN',
    quality: 'Circuit Completing / Close',
    domination: 'Crossing',
    side: 'matter',
    russellZone: 'Zero Crossing',
    wheelAngle: -112.5  // Left-lower
  },
  {
    position: '+2',
    trigram: 'Water',
    binary: '010',
    chinese: '坎',
    axis: 'FLOW',
    em: 'CURRENT',
    quality: 'Charge Movement',
    domination: 'Materialising',
    side: 'matter',
    russellZone: 'Generating',
    wheelAngle: 112.5  // Right-lower
  },
  {
    position: '+3',
    trigram: 'Mountain',
    binary: '001',
    chinese: '艮',
    axis: 'CONTAINERS',
    em: 'INDUCTANCE',
    quality: 'Magnetic Field Storage',
    domination: 'Materialising',
    side: 'matter',
    russellZone: 'Generating',
    wheelAngle: 157.5  // Bottom-right
  },
  {
    position: '+4',
    trigram: 'Earth',
    binary: '000',
    chinese: '坤',
    axis: 'POLES',
    em: 'SINK / CARBON',
    quality: 'Maximum Compression',
    domination: 'SPHERE',
    side: 'matter',
    russellZone: 'Local Ground',
    wheelAngle: -157.5  // Bottom-left
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculatePosition(angle, radius) {
  const radians = (angle - 90) * Math.PI / 180;
  return {
    x: GEOMETRY.center.x + radius * Math.cos(radians),
    y: GEOMETRY.center.y + radius * Math.sin(radians)
  };
}

function generateTrigramSymbol(binary, x, y, rotation = 0, scale = 1) {
  const lineWidth = 14 * scale;
  const lineHeight = 3 * scale;
  const lineSpacing = 5 * scale;
  const yinGapWidth = 2.5 * scale;

  const lines = [];

  for (let i = 0; i < 3; i++) {
    const bit = binary[i];
    const lineY = -lineSpacing + (2 - i) * lineSpacing;

    if (bit === '1') {
      lines.push(`<rect x="${-lineWidth/2}" y="${lineY - lineHeight/2}" width="${lineWidth}" height="${lineHeight}"/>`);
    } else {
      const segmentWidth = (lineWidth - yinGapWidth) / 2;
      lines.push(`<rect x="${-lineWidth/2}" y="${lineY - lineHeight/2}" width="${segmentWidth}" height="${lineHeight}"/>`);
      lines.push(`<rect x="${yinGapWidth/2}" y="${lineY - lineHeight/2}" width="${segmentWidth}" height="${lineHeight}"/>`);
    }
  }

  return `<g transform="translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(${rotation})" fill="${colors.foreground}">
    ${lines.join('\n    ')}
  </g>`;
}

function getSideColor(data) {
  if (data.domination === 'SPHERE') return colors.sphere;
  if (data.domination === 'CUBE') return colors.cube;
  if (data.side === 'charging') return colors.charging;
  return colors.discharging;
}

// ============================================================================
// SVG GENERATION
// ============================================================================

function generateBackground() {
  return `  <rect id="background" width="100%" height="100%" fill="${colors.background}"/>`;
}

function generateAxes() {
  const cx = GEOMETRY.center.x;
  const cy = GEOMETRY.center.y;
  const innerR = GEOMETRY.ring.innerRadius - 20;
  const outerR = GEOMETRY.ring.outerRadius + 60;

  // Heaven position
  const heavenPos = calculatePosition(22.5, outerR);
  const earthPos = calculatePosition(-157.5, outerR);

  return `  <g id="AXES">
    <!-- Vertical axis: Heaven-Earth (amplitude poles) -->
    <line x1="${heavenPos.x}" y1="${heavenPos.y}" x2="${earthPos.x}" y2="${earthPos.y}"
          stroke="${colors.gridMedium}" stroke-width="1" stroke-dasharray="8,4"/>

    <!-- Horizontal axis: Fire-Water (zero crossing) -->
    <line x1="${cx - outerR}" y1="${cy}" x2="${cx + outerR}" y2="${cy}"
          stroke="${colors.gridLight}" stroke-width="1" stroke-dasharray="4,4"/>

    <!-- Labels for hemispheres -->
    <text x="${cx - outerR - 10}" y="${cy - 20}"
          font-family="Copperplate-Light, Copperplate" font-size="11"
          fill="${colors.charging}" text-anchor="end">CHARGING</text>
    <text x="${cx - outerR - 10}" y="${cy}"
          font-family="Copperplate-Light, Copperplate" font-size="9"
          fill="${colors.charging}" text-anchor="end" opacity="0.7">Electric Domination</text>
    <text x="${cx - outerR - 10}" y="${cy + 15}"
          font-family="Copperplate-Light, Copperplate" font-size="8"
          fill="${colors.charging}" text-anchor="end" opacity="0.5">Centripetal</text>

    <text x="${cx + outerR + 10}" y="${cy - 20}"
          font-family="Copperplate-Light, Copperplate" font-size="11"
          fill="${colors.discharging}" text-anchor="start">DISCHARGING</text>
    <text x="${cx + outerR + 10}" y="${cy}"
          font-family="Copperplate-Light, Copperplate" font-size="9"
          fill="${colors.discharging}" text-anchor="start" opacity="0.7">Magnetic Domination</text>
    <text x="${cx + outerR + 10}" y="${cy + 15}"
          font-family="Copperplate-Light, Copperplate" font-size="8"
          fill="${colors.discharging}" text-anchor="start" opacity="0.5">Centrifugal</text>
  </g>`;
}

function generateZeroCenter() {
  const cx = GEOMETRY.center.x;
  const cy = GEOMETRY.center.y;

  return `  <g id="ZERO-CENTER">
    <!-- Zero point circle -->
    <circle cx="${cx}" cy="${cy}" r="60" fill="none" stroke="${colors.zero}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="8" fill="${colors.zero}"/>

    <!-- Zero label -->
    <text x="${cx}" y="${cy - 30}"
          font-family="Copperplate" font-size="24" font-weight="bold"
          fill="${colors.foreground}" text-anchor="middle">0̄</text>
    <text x="${cx}" y="${cy + 45}"
          font-family="Copperplate-Light, Copperplate" font-size="10"
          fill="${colors.foreground}" text-anchor="middle" opacity="0.7">Motion-in-Inertia</text>
    <text x="${cx}" y="${cy + 58}"
          font-family="Copperplate-Light, Copperplate" font-size="8"
          fill="${colors.foreground}" text-anchor="middle" opacity="0.5">Stillness</text>
  </g>`;
}

function generateStructure() {
  const innerR = GEOMETRY.ring.innerRadius;
  const outerR = GEOMETRY.ring.outerRadius;
  const midR = (innerR + outerR) / 2;

  const parts = [];

  parts.push('  <g id="STRUCTURE">');

  // Concentric rings
  parts.push(`    <circle cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${outerR}" fill="none" stroke="${colors.stroke}" stroke-width="0.5"/>`);
  parts.push(`    <circle cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${midR}" fill="none" stroke="${colors.stroke}" stroke-width="0.3" stroke-dasharray="3,2"/>`);
  parts.push(`    <circle cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${innerR}" fill="none" stroke="${colors.stroke}" stroke-width="0.5"/>`);

  // Dividers between trigrams (at 45° intervals, offset by 22.5°)
  for (let i = 0; i < 8; i++) {
    const angle = i * 45;
    const radians = (angle - 90) * Math.PI / 180;

    const x1 = GEOMETRY.center.x + innerR * Math.cos(radians);
    const y1 = GEOMETRY.center.y + innerR * Math.sin(radians);
    const x2 = GEOMETRY.center.x + outerR * Math.cos(radians);
    const y2 = GEOMETRY.center.y + outerR * Math.sin(radians);

    parts.push(`    <line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${colors.stroke}" stroke-width="0.3"/>`);
  }

  parts.push('  </g>');

  return parts.join('\n');
}

function generateArcBackgrounds() {
  const parts = [];
  const innerR = GEOMETRY.ring.innerRadius;
  const outerR = GEOMETRY.ring.outerRadius;

  parts.push('  <g id="ARC-BACKGROUNDS">');

  WAVE_POSITIONS.forEach(data => {
    const startAngle = data.wheelAngle - 22.5;
    const endAngle = data.wheelAngle + 22.5;
    const color = getSideColor(data);

    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;

    const x1Outer = GEOMETRY.center.x + outerR * Math.cos(startRad);
    const y1Outer = GEOMETRY.center.y + outerR * Math.sin(startRad);
    const x2Outer = GEOMETRY.center.x + outerR * Math.cos(endRad);
    const y2Outer = GEOMETRY.center.y + outerR * Math.sin(endRad);

    const x1Inner = GEOMETRY.center.x + innerR * Math.cos(endRad);
    const y1Inner = GEOMETRY.center.y + innerR * Math.sin(endRad);
    const x2Inner = GEOMETRY.center.x + innerR * Math.cos(startRad);
    const y2Inner = GEOMETRY.center.y + innerR * Math.sin(startRad);

    const d = `M ${x1Outer.toFixed(2)} ${y1Outer.toFixed(2)}
               A ${outerR} ${outerR} 0 0 1 ${x2Outer.toFixed(2)} ${y2Outer.toFixed(2)}
               L ${x1Inner.toFixed(2)} ${y1Inner.toFixed(2)}
               A ${innerR} ${innerR} 0 0 0 ${x2Inner.toFixed(2)} ${y2Inner.toFixed(2)}
               Z`;

    parts.push(`    <path d="${d}" fill="${color}" opacity="0.12"/>`);
  });

  parts.push('  </g>');

  return parts.join('\n');
}

function generateTrigramGroup(data) {
  const parts = [];
  const angle = data.wheelAngle;
  const angleRad = angle * Math.PI / 180;
  const cos = Math.cos(angleRad).toFixed(4);
  const sin = Math.sin(angleRad).toFixed(4);

  const innerR = GEOMETRY.ring.innerRadius;
  const outerR = GEOMETRY.ring.outerRadius;
  const bandWidth = outerR - innerR;

  // Radii for elements
  const symbolRadius = innerR + 18;
  const trigramNameRadius = innerR + bandWidth * 0.25;
  const russellPosRadius = innerR + bandWidth * 0.48;
  const emPhaseRadius = innerR + bandWidth * 0.68;
  const qualityRadius = innerR + bandWidth * 0.88;

  // Positions
  const symbolPos = calculatePosition(angle, symbolRadius);
  const namePos = calculatePosition(angle, trigramNameRadius);
  const russellPos = calculatePosition(angle, russellPosRadius);
  const emPos = calculatePosition(angle, emPhaseRadius);
  const qualityPos = calculatePosition(angle, qualityRadius);

  const sideColor = getSideColor(data);

  parts.push(`  <g id="TRIGRAM-${data.trigram.toUpperCase()}" data-trigram="${data.trigram}" data-binary="${data.binary}" data-russell="${data.position}" data-side="${data.side}">`);

  // Trigram symbol
  parts.push(`    ${generateTrigramSymbol(data.binary, symbolPos.x, symbolPos.y, angle, 0.8)}`);

  // Trigram name
  parts.push(`    <text transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${namePos.x.toFixed(2)}, ${namePos.y.toFixed(2)})"
        font-family="Copperplate" font-size="13"
        fill="${colors.foreground}" text-anchor="middle" dominant-baseline="middle">${data.trigram}</text>`);

  // Russell position (bold, colored)
  parts.push(`    <text transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${russellPos.x.toFixed(2)}, ${russellPos.y.toFixed(2)})"
        font-family="Copperplate" font-size="16" font-weight="bold"
        fill="${sideColor}" text-anchor="middle" dominant-baseline="middle">${data.position}</text>`);

  // EM Phase
  parts.push(`    <text transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${emPos.x.toFixed(2)}, ${emPos.y.toFixed(2)})"
        font-family="Copperplate" font-size="10"
        fill="${sideColor}" text-anchor="middle" dominant-baseline="middle" opacity="0.9">${data.em}</text>`);

  // Quality
  parts.push(`    <text transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${qualityPos.x.toFixed(2)}, ${qualityPos.y.toFixed(2)})"
        font-family="Copperplate-Light, Copperplate" font-size="9"
        fill="${colors.foreground}" text-anchor="middle" dominant-baseline="middle" opacity="0.7">${data.quality}</text>`);

  parts.push('  </g>');

  return parts.join('\n');
}

function generatePoleIndicators() {
  const outerR = GEOMETRY.ring.outerRadius + 30;

  // Heaven/Sphere position
  const heavenPos = calculatePosition(22.5, outerR);
  // Earth/Cube position
  const earthPos = calculatePosition(-157.5, outerR);

  return `  <g id="POLE-INDICATORS">
    <!-- SPHERE indicator at Heaven -->
    <g id="SPHERE-INDICATOR">
      <circle cx="${heavenPos.x.toFixed(2)}" cy="${heavenPos.y.toFixed(2)}" r="12" fill="${colors.sphere}"/>
      <text x="${heavenPos.x.toFixed(2)}" y="${(heavenPos.y - 22).toFixed(2)}"
            font-family="Copperplate" font-size="12"
            fill="${colors.sphere}" text-anchor="middle">SPHERE</text>
    </g>

    <!-- CUBE indicator at Earth -->
    <g id="CUBE-INDICATOR">
      <rect x="${(earthPos.x - 10).toFixed(2)}" y="${(earthPos.y - 10).toFixed(2)}" width="20" height="20" fill="${colors.cube}"/>
      <text x="${earthPos.x.toFixed(2)}" y="${(earthPos.y + 30).toFixed(2)}"
            font-family="Copperplate" font-size="12"
            fill="${colors.cube}" text-anchor="middle">CUBE</text>
    </g>
  </g>`;
}

function generateTitle() {
  return `  <g id="TITLE">
    <text x="${GEOMETRY.center.x}" y="80"
          font-family="Copperplate" font-size="18"
          fill="${colors.foreground}" text-anchor="middle">THE FORMULA OF LOCKED POTENTIALS</text>
    <text x="${GEOMETRY.center.x}" y="105"
          font-family="Copperplate-Light, Copperplate" font-size="12"
          fill="${colors.foreground}" text-anchor="middle" opacity="0.7">Walter Russell + I Ching Trigrams + Electromagnetic Phases</text>
  </g>`;
}

function generateFooter() {
  return `  <g id="FOOTER">
    <text x="${GEOMETRY.center.x}" y="1120"
          font-family="Copperplate-Light, Copperplate" font-size="10"
          fill="${colors.foreground}" text-anchor="middle" opacity="0.5">"All energy is caused by a disturbance in inertia"</text>
    <text x="${GEOMETRY.center.x}" y="1140"
          font-family="Copperplate-Light, Copperplate" font-size="9"
          fill="${colors.foreground}" text-anchor="middle" opacity="0.4">— Walter Russell, The Universal One</text>
  </g>`;
}

/**
 * Generate the complete ring
 */
function generateRussellLockedPotentialsRing(options = {}) {
  const {
    colorScheme = 'dark',
    includeTitle = true,
    includeFooter = true
  } = options;

  colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.dark;

  const parts = [];

  // SVG header
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${GEOMETRY.viewBox.width}" height="${GEOMETRY.viewBox.height}" viewBox="0 0 ${GEOMETRY.viewBox.width} ${GEOMETRY.viewBox.height}">`);

  // Background
  parts.push(generateBackground());

  // Title
  if (includeTitle) {
    parts.push(generateTitle());
  }

  // Axes and labels
  parts.push(generateAxes());

  // Arc backgrounds
  parts.push(generateArcBackgrounds());

  // Structure
  parts.push(generateStructure());

  // Zero at center
  parts.push(generateZeroCenter());

  // Pole indicators
  parts.push(generatePoleIndicators());

  // Trigram groups
  parts.push('  <g id="TRIGRAMS">');
  WAVE_POSITIONS.forEach(data => {
    parts.push(generateTrigramGroup(data));
  });
  parts.push('  </g>');

  // Footer
  if (includeFooter) {
    parts.push(generateFooter());
  }

  // Close SVG
  parts.push('</svg>');

  return parts.join('\n');
}

// ============================================================================
// EXPORTS AND CLI
// ============================================================================

module.exports = {
  generateRussellLockedPotentialsRing,
  WAVE_POSITIONS,
  GEOMETRY,
  COLOR_SCHEMES
};

// CLI execution
if (require.main === module) {
  const outputDir = path.join(__dirname, '../output');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  THE FORMULA OF LOCKED POTENTIALS');
  console.log('  Four Axes Framework + Corrected Russell Mapping');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('  CORRECTED RUSSELL:');
  console.log('  ─────────────────────────────────────────────────────────────');
  console.log('  Heaven (111) = CUBE = Maximum Expansion = Void = -4');
  console.log('  Earth (000) = SPHERE = Maximum Compression = Carbon = +4');
  console.log('');
  console.log('  FOUR AXES:');
  console.log('  ─────────────────────────────────────────────────────────────');
  console.log('  POLES:      Heaven(-4)/Earth(+4)   — Void / Carbon');
  console.log('  CONTAINERS: Lake(-3)/Mountain(+3)  — Capacitance / Inductance');
  console.log('  FLOW:       Fire(-2)/Water(+2)     — Voltage / Current');
  console.log('  GATES:      Wind(-1)/Thunder(+1)   — Gate OUT / Gate IN');
  console.log('');
  console.log('  Zero (0̄) at CENTER — Monopole — Motion-in-Inertia');
  console.log('');
  console.log('  VOID SIDE (-) — Dematerialising:');
  console.log('  ─────────────────────────────────────────────────────────────');
  WAVE_POSITIONS.filter(d => d.side === 'void').forEach(d => {
    console.log(`    ${d.position.padEnd(3)} │ ${d.trigram.padEnd(8)} │ ${d.binary} │ ${d.axis.padEnd(10)} │ ${d.em.padEnd(14)} │ ${d.quality}`);
  });
  console.log('');
  console.log('  MATTER SIDE (+) — Materialising:');
  console.log('  ─────────────────────────────────────────────────────────────');
  WAVE_POSITIONS.filter(d => d.side === 'matter').forEach(d => {
    console.log(`    ${d.position.padEnd(3)} │ ${d.trigram.padEnd(8)} │ ${d.binary} │ ${d.axis.padEnd(10)} │ ${d.em.padEnd(14)} │ ${d.quality}`);
  });
  console.log('');

  // Generate
  const svg = generateRussellLockedPotentialsRing();
  const outputPath = path.join(outputDir, 'generated-russell-locked-potentials.svg');
  fs.writeFileSync(outputPath, svg);
  console.log(`Output: ${outputPath} (${(svg.length / 1024).toFixed(1)} KB)`);

  console.log('\nDone!');
}
