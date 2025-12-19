/**
 * Russell-Electromagnetic Trigrams Ring Generator
 *
 * A unified ring mapping Walter Russell's wave cycle terminology onto
 * the I Ching trigram structure using the Four Axes Framework:
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
 * This ring synthesizes three systems:
 * 1. Traditional I Ching trigrams (Heaven, Earth, Fire, Water, etc.)
 * 2. Electromagnetic circuit functions (Source, Sink, Storage, Flow, Gates)
 * 3. Walter Russell's octave wave positions (-4 to +4, zero at center)
 *
 * VOID side (-): Heaven → Lake → Fire → Wind (dematerialising)
 * MATTER side (+): Thunder → Water → Mountain → Earth (materialising)
 *
 * Wind/Thunder at ±1 = GATES - the zero crossing point
 *
 * References:
 * - Walter Russell, "The Secret of Light" (1947)
 * - Walter Russell, "The Universal One" (1926)
 * - docs/research/russell-trigram-mapping-exploration.md
 * - docs/research/complete-hexagram-circuit-classification.md
 */

const fs = require('fs');
const path = require('path');

// Load trigram data from knowledge engine
const trigramsData = require('../../knowledge-systems/trigrams/mappings/trigrams-mappings.json');

// ============================================================================
// GEOMETRY CONSTANTS
// ============================================================================

const GEOMETRY = {
  viewBox: { width: 1000, height: 1000 },
  center: { x: 500, y: 500 },

  // Ring radii - sized to fit all three layers plus flow band
  ring: {
    innerRadius: 280,
    outerRadius: 420
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
    charging: '#2a5a8a',      // Blue for charging/genero-active
    discharging: '#8a4a2a',   // Warm brown for discharging/radio-active
    amplitude: '#c9a227',     // Gold for amplitude/Heaven
    zero: '#2a6a4a',          // Green for zero point/Earth
    russell: '#6a4a8a'        // Purple for Russell terms
  },
  dark: {
    background: '#151E25',
    foreground: '#FFFFFF',
    stroke: '#FFFFFF',
    charging: '#4a8ac0',      // Lighter blue for dark mode
    discharging: '#c07050',   // Lighter warm for dark mode
    amplitude: '#fab414',     // Gold accent
    zero: '#4a9a6a',          // Lighter green
    russell: '#a080c0'        // Lighter purple for Russell terms
  }
};

let activeColorScheme = COLOR_SCHEMES.dark;

// ============================================================================
// UNIFIED DATA: I Ching + EM + Russell
// ============================================================================

/**
 * Complete mapping of the eight trigram positions across three systems
 *
 * CORRECTED Russell wave positions: -4 to +4 with zero at center
 * - VOID side (-): Heaven(-4) → Lake(-3) → Fire(-2) → Wind(-1)
 * - MATTER side (+): Thunder(+1) → Water(+2) → Mountain(+3) → Earth(+4)
 * - Zero (0) at CENTER = Monopole = Motion-in-Inertia (not on rim)
 */
const UNIFIED_CYCLE = {
  'Heaven': {
    binary: '111',
    // I Ching
    iching: {
      name: 'Heaven',
      chinese: '乾',
      pinyin: 'Qián',
      attribute: 'Creative',
      image: 'The creative heavens'
    },
    // Electromagnetic (Four Axes Framework)
    em: {
      axis: 'POLES',
      phase: 'SOURCE / VOID',
      keyword: 'Emanation',
      description: 'Origin of potential, absolute ground, creative source'
    },
    // Walter Russell (CORRECTED)
    russell: {
      position: '-4',
      tone: 'VOID',
      state: 'Maximum Expansion',
      geometry: 'CUBE',
      quality: 'Absolute Ground',
      motion: 'Centrifugal limit',
      description: 'The void - cold space - maximum expansion'
    },
    // Cycle position
    arc: 'void',
    cyclePosition: 0
  },

  'Lake': {
    binary: '110',
    iching: {
      name: 'Lake',
      chinese: '兌',
      pinyin: 'Duì',
      attribute: 'Joy',
      image: 'The joyous lake'
    },
    em: {
      axis: 'CONTAINERS',
      phase: 'CAPACITANCE',
      keyword: 'Electric Storage',
      description: 'Energy stored in electric field, holds voltage'
    },
    russell: {
      position: '-3',
      tone: 'DEMATERIALISING',
      state: 'Third Void',
      geometry: 'Near-Cube',
      quality: 'Radiating',
      motion: 'Centrifugal dominant',
      description: 'Charge dispersing into field'
    },
    arc: 'void',
    cyclePosition: 1
  },

  'Fire': {
    binary: '101',
    iching: {
      name: 'Fire',
      chinese: '離',
      pinyin: 'Lí',
      attribute: 'Light',
      image: 'The clinging fire'
    },
    em: {
      axis: 'FLOW',
      phase: 'VOLTAGE',
      keyword: 'Potential Difference',
      description: 'The pressure that causes flow, the push'
    },
    russell: {
      position: '-2',
      tone: 'DEMATERIALISING',
      state: 'Second Void',
      geometry: 'Prolate Spheroid',
      quality: 'Radiating',
      motion: 'Radiation dominant',
      description: 'Light radiates outward'
    },
    arc: 'void',
    cyclePosition: 2
  },

  'Wind': {
    binary: '011',
    iching: {
      name: 'Wind',
      chinese: '巽',
      pinyin: 'Xùn',
      attribute: 'Penetration',
      image: 'The gentle wind'
    },
    em: {
      axis: 'GATES',
      phase: 'GATE OUT',
      keyword: 'Field Sustained',
      description: 'Circuit open, potential sustained, superposition'
    },
    russell: {
      position: '-1',
      tone: 'CROSSING',
      state: 'Gate Out',
      geometry: 'Transition',
      quality: 'Zero Crossing',
      motion: 'Switching point',
      description: 'The open gate - field sustained'
    },
    arc: 'gate',
    cyclePosition: 3
  },

  // ZERO at center (not on rim) - the Monopole

  'Thunder': {
    binary: '100',
    iching: {
      name: 'Thunder',
      chinese: '震',
      pinyin: 'Zhèn',
      attribute: 'Movement',
      image: 'The arousing thunder'
    },
    em: {
      axis: 'GATES',
      phase: 'GATE IN',
      keyword: 'Circuit Completing',
      description: 'Gate closes, current flows, wave collapses to particle'
    },
    russell: {
      position: '+1',
      tone: 'CROSSING',
      state: 'Gate In',
      geometry: 'Transition',
      quality: 'Zero Crossing',
      motion: 'Switching point',
      description: 'The closed gate - discharge event'
    },
    arc: 'gate',
    cyclePosition: 4
  },

  'Water': {
    binary: '010',
    iching: {
      name: 'Water',
      chinese: '坎',
      pinyin: 'Kǎn',
      attribute: 'Danger',
      image: 'The flowing abyss'
    },
    em: {
      axis: 'FLOW',
      phase: 'CURRENT',
      keyword: 'Charge Movement',
      description: 'Actual flow of charge, the stream'
    },
    russell: {
      position: '+2',
      tone: 'MATERIALISING',
      state: 'Second Matter',
      geometry: 'Prolate Spheroid',
      quality: 'Generating',
      motion: 'Centripetal dominant',
      description: 'Current flows toward form'
    },
    arc: 'matter',
    cyclePosition: 5
  },

  'Mountain': {
    binary: '001',
    iching: {
      name: 'Mountain',
      chinese: '艮',
      pinyin: 'Gèn',
      attribute: 'Stillness',
      image: 'The resting mountain'
    },
    em: {
      axis: 'CONTAINERS',
      phase: 'INDUCTANCE',
      keyword: 'Magnetic Storage',
      description: 'Energy stored in magnetic field, maintains current'
    },
    russell: {
      position: '+3',
      tone: 'MATERIALISING',
      state: 'Third Matter',
      geometry: 'Near-Sphere',
      quality: 'Generating',
      motion: 'Gravitation dominant',
      description: 'Magnetic field building'
    },
    arc: 'matter',
    cyclePosition: 6
  },

  'Earth': {
    binary: '000',
    iching: {
      name: 'Earth',
      chinese: '坤',
      pinyin: 'Kūn',
      attribute: 'Receptive',
      image: 'The yielding earth'
    },
    em: {
      axis: 'POLES',
      phase: 'SINK / CARBON',
      keyword: 'Manifestation',
      description: 'Local ground, where potential becomes actual'
    },
    russell: {
      position: '+4',
      tone: 'MATTER',
      state: 'Maximum Compression',
      geometry: 'SPHERE',
      quality: 'Local Ground',
      motion: 'Centripetal limit',
      description: 'Carbon amplitude - the sun state - maximum compression'
    },
    arc: 'matter',
    cyclePosition: 7
  }
};

/**
 * Trigram positions on the wheel (SVG angles)
 * Matching the existing quarters-trigrams-faces-ring positioning
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
  iching: {
    family: 'Copperplate',
    size: 13,
    weight: 'normal'
  },
  emPhase: {
    family: 'Copperplate',
    size: 11,
    weight: 'normal'
  },
  russell: {
    family: 'Copperplate-Light, Copperplate',
    size: 10,
    weight: 300
  },
  russellPosition: {
    family: 'Copperplate',
    size: 14,
    weight: 'bold'
  },
  chinese: {
    family: 'Arial Unicode MS, sans-serif',
    size: 16
  },
  symbol: {
    lineWidth: 14,
    lineHeight: 3,
    lineSpacing: 5,
    yinGapWidth: 2.5
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
    const lineY = -lineSpacing + (2 - i) * lineSpacing;

    if (bit === '1') {
      lines.push(`<rect x="${-lineWidth/2}" y="${lineY - lineHeight/2}" width="${lineWidth}" height="${lineHeight}"/>`);
    } else {
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
  const radians = (svgAngle - 90) * Math.PI / 180;
  return {
    x: GEOMETRY.center.x + radius * Math.cos(radians),
    y: GEOMETRY.center.y + radius * Math.sin(radians)
  };
}

/**
 * Get color based on position in cycle
 */
function getArcColor(trigramName) {
  const data = UNIFIED_CYCLE[trigramName];
  if (data.arc === 'void') return activeColorScheme.discharging;  // Void side
  if (data.arc === 'matter') return activeColorScheme.charging;    // Matter side
  if (data.arc === 'gate') return activeColorScheme.russell;       // Gates (crossing)
  return activeColorScheme.foreground;
}

/**
 * Get Russell position color
 */
function getRussellColor(trigramName) {
  const data = UNIFIED_CYCLE[trigramName];
  if (data.russell.position === '-4') return activeColorScheme.amplitude;  // Heaven/Cube
  if (data.russell.position === '+4') return activeColorScheme.zero;       // Earth/Sphere
  if (data.arc === 'gate') return activeColorScheme.russell;               // Gates
  return activeColorScheme.russell;
}

// ============================================================================
// SVG GENERATION
// ============================================================================

/**
 * Generate the structure (rings and dividers)
 */
function generateStructure() {
  const innerR = GEOMETRY.ring.innerRadius;
  const outerR = GEOMETRY.ring.outerRadius;
  const midR1 = innerR + (outerR - innerR) * 0.33;
  const midR2 = innerR + (outerR - innerR) * 0.66;

  const parts = [];

  parts.push('  <g id="STRUCTURE">');

  // Main rings
  parts.push(`    <circle cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${outerR}" fill="none" stroke="${activeColorScheme.stroke}" stroke-width="0.5"/>`);
  parts.push(`    <circle cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${midR2}" fill="none" stroke="${activeColorScheme.stroke}" stroke-width="0.3" stroke-dasharray="3,2"/>`);
  parts.push(`    <circle cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${midR1}" fill="none" stroke="${activeColorScheme.stroke}" stroke-width="0.3" stroke-dasharray="3,2"/>`);
  parts.push(`    <circle cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${innerR}" fill="none" stroke="${activeColorScheme.stroke}" stroke-width="0.5"/>`);

  // Dividers between trigrams
  for (let i = 0; i < 8; i++) {
    const angle = i * 45;
    const radians = (angle - 90) * Math.PI / 180;

    const x1 = GEOMETRY.center.x + innerR * Math.cos(radians);
    const y1 = GEOMETRY.center.y + innerR * Math.sin(radians);
    const x2 = GEOMETRY.center.x + outerR * Math.cos(radians);
    const y2 = GEOMETRY.center.y + outerR * Math.sin(radians);

    parts.push(`    <line x1="${x1.toFixed(4)}" y1="${y1.toFixed(4)}" x2="${x2.toFixed(4)}" y2="${y2.toFixed(4)}" stroke="${activeColorScheme.stroke}" stroke-width="0.3"/>`);
  }

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate arc segment backgrounds
 */
function generateArcBackgrounds() {
  const parts = [];
  const innerR = GEOMETRY.ring.innerRadius;
  const outerR = GEOMETRY.ring.outerRadius;

  parts.push('  <g id="ARC-BACKGROUNDS">');

  Object.entries(TRIGRAM_POSITIONS).forEach(([name, pos]) => {
    const startAngle = pos.svgAngle - 22.5;
    const endAngle = pos.svgAngle + 22.5;
    const color = getArcColor(name);

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

    const d = `M ${x1Outer.toFixed(4)} ${y1Outer.toFixed(4)}
               A ${outerR} ${outerR} 0 0 1 ${x2Outer.toFixed(4)} ${y2Outer.toFixed(4)}
               L ${x1Inner.toFixed(4)} ${y1Inner.toFixed(4)}
               A ${innerR} ${innerR} 0 0 0 ${x2Inner.toFixed(4)} ${y2Inner.toFixed(4)}
               Z`;

    parts.push(`    <path d="${d}" fill="${color}" opacity="0.1"/>`);
  });

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate the flow indicators
 */
function generateFlowIndicators() {
  const parts = [];
  const flowRadius = GEOMETRY.ring.outerRadius + 30;

  parts.push('  <g id="FLOW-INDICATORS">');

  // Subtle circular band
  parts.push(`    <circle cx="${GEOMETRY.center.x}" cy="${GEOMETRY.center.y}" r="${flowRadius}"
              fill="none" stroke="${activeColorScheme.foreground}" stroke-width="6" opacity="0.06"/>`);

  // CHARGING arrow (right side, pointing up toward Heaven)
  const chargingAngle = 90;
  const chargingRad = (chargingAngle - 90) * Math.PI / 180;
  const chargingX = GEOMETRY.center.x + flowRadius * Math.cos(chargingRad);
  const chargingY = GEOMETRY.center.y + flowRadius * Math.sin(chargingRad);

  parts.push(`    <g id="CHARGING-INDICATOR">`);
  parts.push(`      <polygon points="0,-10 6,5 -6,5"
               transform="translate(${chargingX.toFixed(4)}, ${chargingY.toFixed(4)}) rotate(-45)"
               fill="${activeColorScheme.charging}"/>`);
  parts.push(`      <text transform="translate(${(chargingX + 25).toFixed(4)}, ${(chargingY - 5).toFixed(4)})"
            font-family="${FONTS.russell.family}" font-size="11" font-weight="300"
            fill="${activeColorScheme.charging}" text-anchor="start" dominant-baseline="middle">GENERO-ACTIVE</text>`);
  parts.push(`      <text transform="translate(${(chargingX + 25).toFixed(4)}, ${(chargingY + 8).toFixed(4)})"
            font-family="${FONTS.russell.family}" font-size="9" font-weight="300"
            fill="${activeColorScheme.charging}" text-anchor="start" dominant-baseline="middle" opacity="0.7">Winding / Charging</text>`);
  parts.push('    </g>');

  // DISCHARGING arrow (left side, pointing down toward Earth)
  const dischargingAngle = -90;
  const dischargingRad = (dischargingAngle - 90) * Math.PI / 180;
  const dischargingX = GEOMETRY.center.x + flowRadius * Math.cos(dischargingRad);
  const dischargingY = GEOMETRY.center.y + flowRadius * Math.sin(dischargingRad);

  parts.push(`    <g id="DISCHARGING-INDICATOR">`);
  parts.push(`      <polygon points="0,-10 6,5 -6,5"
               transform="translate(${dischargingX.toFixed(4)}, ${dischargingY.toFixed(4)}) rotate(135)"
               fill="${activeColorScheme.discharging}"/>`);
  parts.push(`      <text transform="translate(${(dischargingX - 25).toFixed(4)}, ${(dischargingY - 5).toFixed(4)})"
            font-family="${FONTS.russell.family}" font-size="11" font-weight="300"
            fill="${activeColorScheme.discharging}" text-anchor="end" dominant-baseline="middle">RADIO-ACTIVE</text>`);
  parts.push(`      <text transform="translate(${(dischargingX - 25).toFixed(4)}, ${(dischargingY + 8).toFixed(4)})"
            font-family="${FONTS.russell.family}" font-size="9" font-weight="300"
            fill="${activeColorScheme.discharging}" text-anchor="end" dominant-baseline="middle" opacity="0.7">Unwinding / Discharging</text>`);
  parts.push('    </g>');

  // CUBE indicator at Heaven (-4 = Maximum Expansion)
  const cubePos = calculatePosition(22.5, flowRadius);
  parts.push(`    <g id="CUBE-INDICATOR">`);
  parts.push(`      <rect x="${(cubePos.x - 5).toFixed(4)}" y="${(cubePos.y - 5).toFixed(4)}" width="10" height="10"
              fill="${activeColorScheme.amplitude}"/>`);
  parts.push(`      <text transform="translate(${(cubePos.x + 12).toFixed(4)}, ${cubePos.y.toFixed(4)})"
            font-family="${FONTS.russell.family}" font-size="10" font-weight="300"
            fill="${activeColorScheme.amplitude}" text-anchor="start" dominant-baseline="middle">CUBE</text>`);
  parts.push('    </g>');

  // SPHERE indicator at Earth (+4 = Maximum Compression)
  const spherePos = calculatePosition(-157.5, flowRadius);
  parts.push(`    <g id="SPHERE-INDICATOR">`);
  parts.push(`      <circle cx="${spherePos.x.toFixed(4)}" cy="${spherePos.y.toFixed(4)}" r="6"
              fill="${activeColorScheme.zero}"/>`);
  parts.push(`      <text transform="translate(${(spherePos.x - 12).toFixed(4)}, ${spherePos.y.toFixed(4)})"
            font-family="${FONTS.russell.family}" font-size="10" font-weight="300"
            fill="${activeColorScheme.zero}" text-anchor="end" dominant-baseline="middle">SPHERE</text>`);
  parts.push('    </g>');

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate a single trigram group with all three layers
 */
function generateTrigramGroup(name) {
  const parts = [];
  const pos = TRIGRAM_POSITIONS[name];
  const data = UNIFIED_CYCLE[name];

  const svgAngle = pos.svgAngle;
  const angleRad = svgAngle * Math.PI / 180;
  const cos = Math.cos(angleRad).toFixed(4);
  const sin = Math.sin(angleRad).toFixed(4);

  // Radii for different elements
  const innerR = GEOMETRY.ring.innerRadius;
  const outerR = GEOMETRY.ring.outerRadius;
  const bandWidth = outerR - innerR;

  const symbolRadius = innerR + 15;
  const ichingRadius = innerR + bandWidth * 0.22;
  const emRadius = innerR + bandWidth * 0.45;
  const russellPosRadius = innerR + bandWidth * 0.65;
  const russellQualityRadius = innerR + bandWidth * 0.85;

  // Calculate positions
  const symbolPos = calculatePosition(svgAngle, symbolRadius);
  const ichingPos = calculatePosition(svgAngle, ichingRadius);
  const emPos = calculatePosition(svgAngle, emRadius);
  const russellPosPos = calculatePosition(svgAngle, russellPosRadius);
  const russellQualityPos = calculatePosition(svgAngle, russellQualityRadius);

  const arcColor = getArcColor(name);
  const russellColor = getRussellColor(name);

  parts.push(`  <g id="TRIGRAM-${name.toUpperCase()}" data-trigram="${name}" data-binary="${data.binary}" data-russell-position="${data.russell.position}" data-arc="${data.arc}">`);

  // Trigram symbol (innermost)
  parts.push(`    <g id="SYMBOL-${name.toUpperCase()}">`);
  parts.push(`      ${generateTrigramSymbol(data.binary, symbolPos.x, symbolPos.y, svgAngle, 0.85)}`);
  parts.push('    </g>');

  // I Ching name
  parts.push(`    <text id="ICHING-${name.toUpperCase()}"
      transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${ichingPos.x.toFixed(4)}, ${ichingPos.y.toFixed(4)})"
      font-family="${FONTS.iching.family}" font-size="${FONTS.iching.size}"
      fill="${activeColorScheme.foreground}" text-anchor="middle" dominant-baseline="middle">${name}</text>`);

  // EM Phase
  parts.push(`    <text id="EM-${name.toUpperCase()}"
      transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${emPos.x.toFixed(4)}, ${emPos.y.toFixed(4)})"
      font-family="${FONTS.emPhase.family}" font-size="${FONTS.emPhase.size}"
      fill="${arcColor}" text-anchor="middle" dominant-baseline="middle">${data.em.phase}</text>`);

  // Russell Position (e.g., "4++", "1+", "0")
  parts.push(`    <text id="RUSSELL-POS-${name.toUpperCase()}"
      transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${russellPosPos.x.toFixed(4)}, ${russellPosPos.y.toFixed(4)})"
      font-family="${FONTS.russellPosition.family}" font-size="${FONTS.russellPosition.size}"
      fill="${russellColor}" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${data.russell.position}</text>`);

  // Russell Quality
  parts.push(`    <text id="RUSSELL-QUALITY-${name.toUpperCase()}"
      transform="matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${russellQualityPos.x.toFixed(4)}, ${russellQualityPos.y.toFixed(4)})"
      font-family="${FONTS.russell.family}" font-size="${FONTS.russell.size}" font-weight="${FONTS.russell.weight}"
      fill="${activeColorScheme.foreground}" text-anchor="middle" dominant-baseline="middle" opacity="0.8">${data.russell.quality}</text>`);

  parts.push('  </g>');

  return parts.join('\n');
}

/**
 * Generate center label
 */
function generateCenterLabel() {
  const cx = GEOMETRY.center.x;
  const cy = GEOMETRY.center.y;

  return `  <g id="CENTER-LABEL">
    <text transform="translate(${cx}, ${cy - 25})"
          font-family="${FONTS.iching.family}" font-size="14"
          fill="${activeColorScheme.foreground}" text-anchor="middle" dominant-baseline="middle">THE WAVE CYCLE</text>
    <text transform="translate(${cx}, ${cy - 8})"
          font-family="${FONTS.russell.family}" font-size="10" font-weight="300"
          fill="${activeColorScheme.foreground}" text-anchor="middle" dominant-baseline="middle" opacity="0.7">0 → 1 → 2 → 3 → 4 → 4 → 3 → 2 → 1 → 0</text>
    <text transform="translate(${cx}, ${cy + 10})"
          font-family="${FONTS.russell.family}" font-size="9" font-weight="300"
          fill="${activeColorScheme.foreground}" text-anchor="middle" dominant-baseline="middle" opacity="0.5">"The heartbeat of the universe"</text>
    <text transform="translate(${cx}, ${cy + 28})"
          font-family="${FONTS.russell.family}" font-size="8" font-weight="300"
          fill="${activeColorScheme.foreground}" text-anchor="middle" dominant-baseline="middle" opacity="0.4">— Walter Russell</text>
  </g>`;
}

/**
 * Generate the complete Russell-EM ring
 */
function generateRussellElectromagneticRing(options = {}) {
  const {
    colorScheme = 'dark',
    includeFlowIndicators = true,
    includeCenterLabel = true,
    includeBackground = undefined
  } = options;

  // Set active color scheme
  activeColorScheme = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.dark;

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

  // Flow indicators
  if (includeFlowIndicators) {
    parts.push(generateFlowIndicators());
  }

  // Arc backgrounds
  parts.push(generateArcBackgrounds());

  // Structure
  parts.push(generateStructure());

  // Trigram groups
  parts.push('  <g id="TRIGRAMS">');
  Object.keys(TRIGRAM_POSITIONS).forEach(name => {
    parts.push(generateTrigramGroup(name));
  });
  parts.push('  </g>');

  // Center label
  if (includeCenterLabel) {
    parts.push(generateCenterLabel());
  }

  // Close SVG
  parts.push('</svg>');

  return parts.join('\n');
}

/**
 * Get statistics
 */
function getStatistics() {
  return {
    trigrams: Object.keys(UNIFIED_CYCLE).length,
    voidPhases: Object.values(UNIFIED_CYCLE).filter(d => d.arc === 'void').map(d => d.iching.name),
    matterPhases: Object.values(UNIFIED_CYCLE).filter(d => d.arc === 'matter').map(d => d.iching.name),
    gatePhases: Object.values(UNIFIED_CYCLE).filter(d => d.arc === 'gate').map(d => d.iching.name),
    phases: Object.entries(UNIFIED_CYCLE)
      .sort((a, b) => a[1].cyclePosition - b[1].cyclePosition)
      .map(([name, data]) => ({
        name,
        binary: data.binary,
        emPhase: data.em.phase,
        russellPosition: data.russell.position,
        russellQuality: data.russell.quality
      }))
  };
}

// ============================================================================
// EXPORTS AND CLI
// ============================================================================

module.exports = {
  generateRussellElectromagneticRing,
  getStatistics,
  UNIFIED_CYCLE,
  TRIGRAM_POSITIONS,
  GEOMETRY,
  COLOR_SCHEMES
};

// CLI execution
if (require.main === module) {
  const outputDir = path.join(__dirname, '../output');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const stats = getStatistics();

  console.log('Generating Russell-Electromagnetic Ring...');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  FOUR AXES FRAMEWORK + CORRECTED RUSSELL MAPPING');
  console.log('  "The heartbeat of the universe" — Walter Russell');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('  CORRECTED RUSSELL:');
  console.log('  ─────────────────────────────────────────────────────────────');
  console.log('  Heaven (111) = CUBE = Maximum Expansion = Void = -4');
  console.log('  Earth (000) = SPHERE = Maximum Compression = Carbon = +4');
  console.log('  Zero (0̄) at CENTER — Monopole — Motion-in-Inertia');
  console.log('');
  console.log('  VOID SIDE (-) — Dematerialising:');
  console.log('  ─────────────────────────────────────────────────────────────');
  console.log('  Heaven(-4) → Lake(-3) → Fire(-2) → Wind(-1)');
  console.log('  Void → Capacitance → Voltage → Gate OUT');
  console.log('');
  console.log('  MATTER SIDE (+) — Materialising:');
  console.log('  ─────────────────────────────────────────────────────────────');
  console.log('  Thunder(+1) → Water(+2) → Mountain(+3) → Earth(+4)');
  console.log('  Gate IN → Current → Inductance → Carbon');
  console.log('');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('Unified Mapping:');
  console.log('───────────────────────────────────────────────────────────────');
  stats.phases.forEach(p => {
    console.log(`  ${p.name.padEnd(10)} (${p.binary}) │ ${p.russellPosition.padEnd(4)} │ ${p.emPhase.padEnd(14)} │ ${p.russellQuality}`);
  });
  console.log('───────────────────────────────────────────────────────────────');
  console.log('');

  // Generate
  const svg = generateRussellElectromagneticRing({ colorScheme: 'dark' });
  const outputPath = path.join(outputDir, 'generated-russell-electromagnetic.svg');
  fs.writeFileSync(outputPath, svg);
  console.log(`Output: ${outputPath} (${(svg.length / 1024).toFixed(1)} KB)`);

  console.log('\nDone!');
}
