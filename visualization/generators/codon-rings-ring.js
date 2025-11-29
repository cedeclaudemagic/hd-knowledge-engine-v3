/**
 * Codon Rings Ring Generator
 *
 * Generates the 22 Codon Rings SVG with:
 * - Outer band: Amino Acid names
 * - Middle band: Ring names (e.g., "Ring of FIRE") + gate numbers
 * - Tracing lines: Connect gate numbers to gate positions
 * - Gate dots: Circles at each gate's midpoint on inner ring
 * - Inner: Codon letters (e.g., "AUG", "CGA") below each dot
 *
 * All data sourced from V3 knowledge engine:
 * - codon-rings-mappings.json for ring/amino acid data
 * - positioning-algorithm.js for gate angles and codons
 *
 * METHODOLOGY (see docs/reference/SVG-GENERATION-METHODOLOGY.md):
 * - Use first-principles formulas, not per-quadrant adjustments
 * - Single rotation formula works for ALL 64 gates: svgAngle + 90
 * - Extract geometry from master SVG, generate transforms from principles
 */

const positioning = require('../../core/root-system/positioning-algorithm');
const codonRingsMappings = require('../../knowledge-systems/codon-rings/mappings/codon-rings-mappings.json');
const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
const shared = require('./shared-constants');

// ============================================================================
// PROPORTIONAL SCALING SYSTEM
// ============================================================================
//
// All geometry is defined relative to the BASE ring. To scale the entire
// visualization, only BASE_RING needs to be modified - all other values
// are calculated proportionally using SCALE_RATIOS.
//
// The ratios were derived from the verified master SVG and locked in by tests.

// Base ring geometry (from verified master SVG)
const BASE_RING = {
  center: { x: 1122.0567, y: 1130.6034 },
  innerRadius: 858.2697,
  outerRadius: 1084.3718
};

// Scale factor (1.0 = original size, 0.5 = half size, 2.0 = double size)
const SCALE_FACTOR = 1.0;

// Proportional ratios (relative to band width)
// These values are locked in by tests to ensure visual consistency
const SCALE_RATIOS = {
  // Position offsets as ratio of band width
  codonLettersOffset: 0.0221,    // 2.21% of band below inner
  gateDotsOffset: 0.1106,        // 11.06% of band above inner
  gateNumbersOffset: -0.1327,    // Below mid-point
  ringNamesOffset: 0.0885,       // Above mid-point
  ringNamesTangentOffset: 0.1902, // Further above mid-point for tangent rings
  aminoAcidsOffset: 0.0531,      // 5.31% of band above outer
  outerRingOffset: 0.1062,       // 10.62% of band above outer
  innerRingOffset: 0.0885,       // 8.85% of band below inner

  // Font sizes as ratio of band width
  codonLettersFont: 0.1072,      // 10.72% of band
  gateNumbersFont: 0.0856,       // 8.56% of band
  ringNamesFont: 0.0619,         // 6.19% of band
  aminoAcidsFont: 0.0708,        // 7.08% of band

  // Gate dot radius as ratio of band width
  gateDotRadius: 0.0369          // 3.69% of band
};

/**
 * Calculate scaled geometry based on SCALE_FACTOR
 * This allows the entire ring to be uniformly scaled
 */
function calculateScaledGeometry() {
  const scaledInner = BASE_RING.innerRadius * SCALE_FACTOR;
  const scaledOuter = BASE_RING.outerRadius * SCALE_FACTOR;
  const bandWidth = scaledOuter - scaledInner;
  const midPoint = (scaledInner + scaledOuter) / 2;

  return {
    center: {
      x: BASE_RING.center.x,  // Center doesn't scale
      y: BASE_RING.center.y
    },
    innerRadius: scaledInner,
    outerRadius: scaledOuter,
    bandWidth: bandWidth,
    midPoint: midPoint,

    // Derived radii using proportional ratios
    radii: {
      codonLetters: scaledInner - (bandWidth * SCALE_RATIOS.codonLettersOffset),
      gateDots: scaledInner + (bandWidth * SCALE_RATIOS.gateDotsOffset),
      gateNumbers: midPoint + (bandWidth * SCALE_RATIOS.gateNumbersOffset),
      ringNames: midPoint + (bandWidth * SCALE_RATIOS.ringNamesOffset),
      ringNamesTangent: midPoint + (bandWidth * SCALE_RATIOS.ringNamesTangentOffset),
      aminoAcids: scaledOuter + (bandWidth * SCALE_RATIOS.aminoAcidsOffset),
      outerRing: scaledOuter + (bandWidth * SCALE_RATIOS.outerRingOffset),
      innerRing: scaledInner - (bandWidth * SCALE_RATIOS.innerRingOffset)
    },

    // Scaled font sizes
    fonts: {
      codonLetters: bandWidth * SCALE_RATIOS.codonLettersFont,
      gateNumbers: bandWidth * SCALE_RATIOS.gateNumbersFont,
      ringNames: bandWidth * SCALE_RATIOS.ringNamesFont,
      aminoAcids: bandWidth * SCALE_RATIOS.aminoAcidsFont
    },

    // Scaled gate dot radius
    gateDotRadius: bandWidth * SCALE_RATIOS.gateDotRadius
  };
}

// Calculate geometry (can be recalculated if SCALE_FACTOR changes)
const SCALED = calculateScaledGeometry();

// Legacy exports for backward compatibility with existing code
const CENTER = SCALED.center;
const RING = {
  innerRadius: SCALED.innerRadius,
  middleRadius: SCALED.midPoint,
  outerRadius: SCALED.outerRadius,
  get bandWidth() { return SCALED.bandWidth; }
};
const RADII = SCALED.radii;

// Font specifications (families are constant, sizes scale)
const FONT = {
  codonLetters: {
    family: 'Copperplate',
    size: SCALED.fonts.codonLetters,
    weight: 400
  },
  gateNumbers: {
    family: 'Copperplate-Light, Copperplate',
    size: SCALED.fonts.gateNumbers,
    weight: 300
  },
  ringNames: {
    family: 'Copperplate-Bold, Copperplate',
    size: SCALED.fonts.ringNames,
    weight: 700
  },
  aminoAcids: {
    family: 'Copperplate-Bold, Copperplate',
    size: SCALED.fonts.aminoAcids,
    weight: 700
  },
  // Approximate character width as ratio of font size (for Copperplate)
  charWidthRatio: 0.65
};

// Gate dot radius (scaled proportionally)
const GATE_DOT_RADIUS = SCALED.gateDotRadius;

/**
 * Calculate adaptive layout parameters for a ring segment
 *
 * SIMPLIFIED APPROACH:
 * - Gate numbers: Always use base size (consistent across all rings)
 * - Ring names: Always use base size
 * - Related text (brackets): Smaller size for the bracket text only
 *
 * @param {Object} ring - Ring object with gates, name, relatedGates
 * @returns {Object} Layout parameters
 */
// Ring name font size multipliers
const RING_NAME_SIZE_MULTIPLIERS = {
  // Radial rings (non-tangent) - quite a bit bigger
  radial: 1.5,
  // Tangent rings - slightly bigger (except specific ones)
  tangent: 1.2,
  // Special cases - these two overlap so keep them smaller
  'Ring of The Whirlwind': 1.0,
  'Ring of Purification': 1.0
};

// Rings that need their gate numbers nudged outward
const GATE_NUMBERS_RADIUS_ADJUSTMENTS = {
  'Ring of Gaia': 5  // Move 19-60 and 61 outward by 5px
};

function calculateAdaptiveLayout(ring, useTangent) {
  const { name, relatedGates } = ring;

  // Use consistent base sizes for all rings
  const gateNumbersSize = FONT.gateNumbers.size;

  // Calculate ring names size based on rotation type
  let ringNamesSizeMultiplier;
  if (RING_NAME_SIZE_MULTIPLIERS[name] !== undefined) {
    // Specific ring override
    ringNamesSizeMultiplier = RING_NAME_SIZE_MULTIPLIERS[name];
  } else if (useTangent) {
    // Tangent rings - slightly bigger
    ringNamesSizeMultiplier = RING_NAME_SIZE_MULTIPLIERS.tangent;
  } else {
    // Radial rings - quite a bit bigger
    ringNamesSizeMultiplier = RING_NAME_SIZE_MULTIPLIERS.radial;
  }
  const ringNamesSize = FONT.ringNames.size * ringNamesSizeMultiplier;

  // Related text (brackets) is smaller - reduced further to avoid overlap
  // Extra small for the small Seeking/Humanity segments which have 4 numbers in brackets
  let relatedTextMultiplier = 0.55;
  if ((name === 'Ring of Seeking' || name === 'Ring of Humanity') && useTangent) {
    relatedTextMultiplier = 0.45;  // Even smaller for the small segments
  }
  const relatedTextSize = FONT.gateNumbers.size * relatedTextMultiplier;

  // Calculate radii positions
  let gateNumbersRadius = RADII.gateNumbers;
  let ringNamesRadius = RADII.ringNames;
  const aminoAcidsRadius = RADII.aminoAcids;

  // If there are related gates, move numbers outward for more space above dots/lines
  if (relatedGates && relatedGates.length > 0) {
    gateNumbersRadius += 7;  // Move outward for ~9% more space above dots
    ringNamesRadius += 9;
  }

  // Apply per-ring gate numbers radius adjustments
  if (GATE_NUMBERS_RADIUS_ADJUSTMENTS[name]) {
    gateNumbersRadius += GATE_NUMBERS_RADIUS_ADJUSTMENTS[name];
  }

  // Line heights for multi-line text
  const gateNumbersLineHeight = gateNumbersSize * 0.9;
  const ringNamesLineHeight = ringNamesSize * 1.1;

  return {
    gateNumbersSize,
    ringNamesSize,
    relatedTextSize,
    gateNumbersRadius,
    ringNamesRadius,
    aminoAcidsRadius,
    gateNumbersLineHeight,
    ringNamesLineHeight
  };
}

// Use shared color scheme
const COLORS = shared.COLORS;

/**
 * Build a lookup from gate number to codon ring data
 */
function buildGateToRingLookup() {
  const lookup = {};
  for (const mapping of codonRingsMappings.mappings) {
    const gate = mapping.gateNumber;
    // If gate already exists (Gate 12 appears twice), keep the first one
    // Ring of Trials is the primary ring, Ring of Secrets is nested
    if (!lookup[gate]) {
      lookup[gate] = mapping.knowledge;
    }
  }
  return lookup;
}

/**
 * Get unique rings with their gate lists
 * Groups gates by ring name, splitting non-contiguous rings (Humanity, Seeking)
 * into separate segments so each segment can be positioned and labeled correctly.
 *
 * For Humanity and Seeking, we have:
 * - A main segment (4 contiguous gates)
 * - An interlaced pair segment (2 gates that alternate with each other on the wheel)
 *
 * Each segment includes a 'relatedGates' field referencing the other segment(s).
 */
function getUniqueRings() {
  const ringMap = new Map();

  for (const mapping of codonRingsMappings.mappings) {
    const ringName = mapping.knowledge.ring;
    const gate = mapping.gateNumber;

    // Ring of Secrets shares gate 12 with Ring of Trials
    // Both are displayed: Trials shows 12 in brackets, Secrets is its own ring at UGA

    if (!ringMap.has(ringName)) {
      ringMap.set(ringName, {
        name: ringName,
        aminoAcid: mapping.knowledge.aminoAcid,
        gates: new Set(),
        codons: mapping.knowledge.codons
      });
    }
    ringMap.get(ringName).gates.add(gate);
  }

  // Convert Sets to Arrays and sort gates by wheel position
  const rings = [];
  for (const [name, data] of ringMap) {
    let gates = Array.from(data.gates);

    // Sort gates by wheel position - higher position first (left to right when reading)
    // This matches the visual order when text baseline faces center
    gates.sort((a, b) => gateSequence.indexOf(b) - gateSequence.indexOf(a));

    // Ring of Gaia special case: gates wrap around 0°, need specific order [19, 60, 61]
    // for correct display as "19 - 60" / "61" with junction at gate 60
    if (name === 'Ring of Gaia') {
      gates = [19, 60, 61];
    }

    // For rings with isolated gates shown in brackets (not connected to dots)
    // Humanity/Seeking interleave, Trials has gate 12 separated
    // NOTE: Ring of Gaia is NOT split - it's a normal 3-gate ring with special gate order
    if (name === 'Ring of Humanity' || name === 'Ring of Seeking' || name === 'Ring of Trials') {
      const segments = splitInterlacedRing(gates, name);
      for (const segment of segments) {
        rings.push({
          name: data.name,
          aminoAcid: data.aminoAcid,
          gates: segment.gates,
          relatedGates: segment.relatedGates,
          codons: data.codons
        });
      }
    } else {
      rings.push({
        name: data.name,
        aminoAcid: data.aminoAcid,
        gates: gates,
        relatedGates: null,
        codons: data.codons
      });
    }
  }

  return rings;
}

/**
 * Split interlaced/non-contiguous ring gates into segments.
 *
 * Some rings have gates that are interrupted by other rings:
 *
 * Humanity (positions 58-60 interlaced with Seeking):
 *   Main segment [25, 17, 21, 51] + pair [10, 38]
 *
 * Seeking (positions 59-61 interlaced with Humanity):
 *   Main segment [15, 52, 39, 53] + pair [58, 54]
 *
 * Gaia (interrupted by Ring of Origin at gate 41):
 *   Main segment [19, 60] shown as "19 - 60" + isolated [61] in brackets
 *   Gates wrap around position 0: 60 (pos 63), 61 (pos 62), [41], 19 (pos 1)
 *   Meeting point at gate 60 (via LABEL_POSITION_OVERRIDES)
 *
 * Life And Death (interrupted by Ring of Water):
 *   Sequence: 42-3-27-24-[2]-23-[8]-20
 *   Gates 2 and 8 are Ring of Water
 *   Main segment [42, 3, 27, 24] + isolated [23] + isolated [20]
 */
function splitInterlacedRing(gates, ringName) {
  // Known interlaced patterns based on wheel analysis
  const interlacedConfig = {
    'Ring of Humanity': {
      mainGates: [25, 17, 21, 51],
      isolatedGates: [[10, 38]]  // pair shown together
    },
    'Ring of Seeking': {
      mainGates: [15, 52, 39, 53],
      isolatedGates: [[58, 54]]  // pair shown together
    },
    // NOTE: Ring of Gaia is NOT in split system - handled as normal 3-gate ring
    // with special gate order [19, 60, 61] set in getUniqueRings()
    'Ring of Life And Death': {
      mainGates: [42, 3, 27, 24],
      isolatedGates: [[23], [20]]  // each shown separately with reference to others
    },
    'Ring of Trials': {
      mainGates: [56, 33],        // UAG and UAA - shown with tracing lines (clockwise order)
      isolatedGates: [[12]],      // UGA - shown in brackets only, no tracing line
      showOnlyMain: true,         // Don't create separate segment for gate 12
      preserveOrder: true         // Keep explicit order
    }
  };

  const config = interlacedConfig[ringName];
  if (!config) {
    // Fallback to simple split
    return splitIntoContiguousSegments(gates).map(seg => ({
      gates: seg,
      relatedGates: null
    }));
  }

  // Filter to only gates that exist in the input
  const mainGates = config.mainGates.filter(g => gates.includes(g));
  const allIsolated = config.isolatedGates.flat().filter(g => gates.includes(g));

  // Sort main gates by wheel position in CLOCKWISE visual order (unless preserveOrder is set)
  if (!config.preserveOrder) {
    mainGates.sort((a, b) => gateSequence.indexOf(b) - gateSequence.indexOf(a));
  }

  const segments = [];

  // Main segment with reference to isolated gates
  if (mainGates.length > 0) {
    segments.push({
      gates: mainGates,
      relatedGates: allIsolated.length > 0 ? allIsolated : null
    });
  }

  // Each isolated group with reference to main segment
  // Unless showOnlyMain is true (isolated gates only shown in brackets, no separate segment)
  if (!config.showOnlyMain) {
    for (const isolatedGroup of config.isolatedGates) {
      const groupGates = isolatedGroup.filter(g => gates.includes(g));
      if (groupGates.length > 0) {
        // Sort by wheel position in CLOCKWISE visual order
        groupGates.sort((a, b) => gateSequence.indexOf(b) - gateSequence.indexOf(a));
        segments.push({
          gates: groupGates,
          relatedGates: mainGates.length > 0 ? mainGates : null
        });
      }
    }
  }

  return segments;
}

/**
 * Split a set of gates into contiguous segments based on wheel position.
 * Gates are contiguous if their wheel positions differ by 1.
 * Returns an array of gate arrays, each representing a contiguous segment.
 */
function splitIntoContiguousSegments(gates) {
  if (gates.length <= 1) return [gates];

  // Get wheel positions for each gate
  const gatePositions = gates.map(gate => ({
    gate,
    position: gateSequence.indexOf(gate)
  }));

  // Sort by wheel position
  gatePositions.sort((a, b) => a.position - b.position);

  const segments = [];
  let currentSegment = [gatePositions[0].gate];

  for (let i = 1; i < gatePositions.length; i++) {
    const prevPos = gatePositions[i - 1].position;
    const currPos = gatePositions[i].position;

    // Check if contiguous (positions differ by 1)
    // Also handle wraparound (position 63 to 0)
    const isContiguous = (currPos - prevPos === 1) ||
                         (prevPos === 63 && currPos === 0);

    if (isContiguous) {
      currentSegment.push(gatePositions[i].gate);
    } else {
      // Start new segment
      segments.push(currentSegment);
      currentSegment = [gatePositions[i].gate];
    }
  }

  // Add the last segment
  segments.push(currentSegment);

  return segments;
}

/**
 * Calculate SVG position angle from V3 angle
 */
function calculateSVGAngle(v3Angle) {
  return shared.calculateSVGAngle(v3Angle);
}

/**
 * Calculate text rotation so baseline always faces center
 * This means text on top half reads normally, text on bottom half is upside-down
 * but the "bottom" of all letters points toward the wheel center
 */
function calculateRadialRotation(svgAngle) {
  // svgAngle + 90 makes text tangent to the circle
  // We want baseline (bottom of text) pointing to center
  // So text radiates outward from center
  return svgAngle + 90;
}

/**
 * Calculate text rotation for readability (text always right-side up)
 * Used for ring names which need to be readable
 */
function calculateReadableRotation(svgAngle) {
  let rotation = svgAngle + 90;

  // Normalize to 0-360
  const normalized = ((rotation % 360) + 360) % 360;
  // If text would be upside down (pointing down), flip it
  if (normalized > 90 && normalized < 270) {
    rotation += 180;
  }

  return rotation;
}

/**
 * Calculate tangent rotation (text parallel to the ring arc)
 * Used for small rings where text should follow the curve
 * Text is always readable (right-side up)
 */
function calculateTangentRotation(svgAngle) {
  // Text is tangent to the circle (parallel to arc)
  let rotation = svgAngle;

  // Normalize to 0-360
  const normalized = ((rotation % 360) + 360) % 360;
  // If text would be upside down, flip it
  if (normalized > 90 && normalized < 270) {
    rotation += 180;
  }

  return rotation;
}

/**
 * Rings that should use tangent text orientation (parallel to dividers)
 * These are small rings with 1-3 gates, plus the "small pair" sections
 * of Seeking and Humanity
 */
const SMALL_RINGS = [
  'Ring of Origin',        // 1 gate
  'Ring of Miracles',      // 1 gate
  'Ring of Secrets',       // 1 gate (nested)
  'Ring of Gaia',          // 3 gates but split
  'Ring of Purification',  // 2 gates but split
  'Ring of The Whirlwind', // 2 gates but split
  'Ring of Water',         // 2 gates but split
  'Ring of Prosperity',    // 2 gates but split
  'Ring of No Return',     // 2 gates but split
  'Ring of Trials',        // 3 gates but split
  'Ring of Illusion',      // 2 gates but split
  'Ring of Illuminati',    // 2 gates but split
  'Ring of Fire',          // 2 gates
  'Ring of Destiny',       // 2 gates but split
];

/**
 * Check if a ring segment should use tangent orientation
 * This includes small rings and the "small pair" portions of Seeking/Humanity
 */
function shouldUseTangentOrientation(ringName, gates) {
  // All listed small rings use tangent
  if (SMALL_RINGS.includes(ringName)) {
    return true;
  }

  // Seeking and Humanity have split sections - small pairs use tangent
  if (ringName === 'Ring of Seeking' || ringName === 'Ring of Humanity') {
    // Small pairs have 2 gates, larger groups have 4+
    return gates.length <= 2;
  }

  return false;
}

/**
 * Calculate SVG position for a gate at specified radius
 */
function calculatePosition(v3Angle, radius) {
  return shared.calculatePosition(v3Angle, radius, CENTER);
}

/**
 * Configuration for rings where the label should be positioned
 * on a specific subset of gates (not the geometric center of all gates).
 *
 * Ring of Life And Death: gates are interrupted by Ring of Water,
 * so the label should be centered between CUG (gate 27) and CUU (gate 24),
 * not at the geometric center of all 6 gates.
 */
// Gate positions to use for label placement (can be gates from ANY ring)
const LABEL_POSITION_OVERRIDES = {
  'Ring of Life And Death': [27, 24],  // Center between CUG and CUU
  'Ring of Water': [8],                 // At UUC position (gate 8)
  'Ring of Trials': [31],               // At UAC position (gate 31 at 180°)
  'Ring of No Return': [56],            // At UAG position (gate 56 at 174.38°)
  'Ring of Prosperity': [45],           // At UGC position (gate 45 at 135°)
  'Ring of Gaia': [60]                  // Junction at AUC position (gate 60 at 354.375°)
};

/**
 * Get the center angle and span for a group of gates
 * Used for positioning ring labels
 *
 * - For 1 gate: uses that gate's position
 * - For 2 gates: uses the midpoint between them
 * - For 3 gates: uses the middle gate's position (for proper tangent alignment)
 * - For 4+ gates: calculates geometric center
 *
 * @param {number[]} gates - Array of gate numbers
 * @param {string} [ringName] - Optional ring name to check for label position overrides
 */
function getGateGroupGeometry(gates, ringName = null) {
  // Check for label position override
  if (ringName && LABEL_POSITION_OVERRIDES[ringName]) {
    // Use the override gates directly for positioning (can be gates from ANY ring)
    gates = LABEL_POSITION_OVERRIDES[ringName];
  }
  // Get angles with gate info
  const gateAngles = gates.map(gate => {
    const v3Data = positioning.getDockingData(gate, 1);
    return { gate, angle: v3Data.angle };
  });

  // Sort by angle to find the visual order
  gateAngles.sort((a, b) => a.angle - b.angle);

  // Check if gates wrap around 0° (e.g., 348°, 354°, 5°)
  const minAngle = gateAngles[0].angle;
  const maxAngle = gateAngles[gateAngles.length - 1].angle;
  const wrapsAround = (maxAngle - minAngle) > 180;

  if (wrapsAround) {
    // Reorder gates to be contiguous across 0°
    // Find gates above 180° and gates below 180°
    const highAngles = gateAngles.filter(g => g.angle > 180);
    const lowAngles = gateAngles.filter(g => g.angle <= 180);
    // Correct order: high angles first (e.g., 348, 354), then low angles (e.g., 5)
    gateAngles.length = 0;
    gateAngles.push(...highAngles.sort((a, b) => a.angle - b.angle));
    gateAngles.push(...lowAngles.sort((a, b) => a.angle - b.angle));
  }

  const span = gates.length * 5.625;

  // Single gate - use its position
  if (gates.length === 1) {
    return { centerAngle: gateAngles[0].angle, span };
  }

  // Two gates - use midpoint between them
  if (gates.length === 2) {
    const angle1 = gateAngles[0].angle;
    const angle2 = gateAngles[1].angle;
    let centerAngle;
    if (wrapsAround) {
      // Handle wraparound: e.g., 354° and 5° -> center at 359.5° or -0.5°
      centerAngle = (angle1 + angle2 + 360) / 2;
      if (centerAngle >= 360) centerAngle -= 360;
    } else {
      centerAngle = (angle1 + angle2) / 2;
    }
    return { centerAngle, span };
  }

  // Three gates - use the middle gate's exact position (for tangent alignment)
  if (gates.length === 3) {
    const middleGate = gateAngles[1]; // Index 1 is the middle of 0,1,2
    return { centerAngle: middleGate.angle, span };
  }

  // For 4+ gates, calculate geometric center
  if (wrapsAround) {
    // Find the largest gap between consecutive gates
    let maxGap = 0;
    let gapStart = 0;
    const sortedAngles = gateAngles.map(g => g.angle);
    for (let i = 0; i < sortedAngles.length; i++) {
      const next = sortedAngles[(i + 1) % sortedAngles.length];
      const gap = (next - sortedAngles[i] + 360) % 360;
      if (gap > maxGap) {
        maxGap = gap;
        gapStart = sortedAngles[i];
      }
    }
    const centerAngle = (gapStart + maxGap / 2 + 180) % 360;
    return { centerAngle, span: 360 - maxGap };
  }

  const centerAngle = (minAngle + maxAngle) / 2;
  return { centerAngle, span: maxAngle - minAngle };
}

/**
 * Generate SVG for a codon letter at a gate position
 * Codon letters always use radial rotation (baseline toward center)
 * @param {number} gateNumber - Gate number
 */
function generateCodonLetter(gateNumber) {
  const v3Data = positioning.getDockingData(gateNumber, 1);
  const codon = v3Data.codon;

  const position = calculatePosition(v3Data.angle, RADII.codonLetters);
  const rotation = calculateRadialRotation(position.svgAngle);

  return `    <text id="TEXT_-_CODON-LETTERS_-_${codon}"
      data-gate="${gateNumber}"
      data-codon="${codon}"
      transform="translate(${position.x.toFixed(4)} ${position.y.toFixed(4)}) rotate(${rotation.toFixed(4)})"
      font-size="${FONT.codonLetters.size}"
      font-family="${FONT.codonLetters.family}"
      font-weight="${FONT.codonLetters.weight}"
      text-anchor="middle"
      dominant-baseline="central"
      fill="${COLORS.foreground}"
      style="isolation: isolate">${codon}</text>`;
}

/**
 * Generate SVG for a gate dot
 */
function generateGateDot(gateNumber) {
  const v3Data = positioning.getDockingData(gateNumber, 1);
  const position = calculatePosition(v3Data.angle, RADII.gateDots);

  return `    <circle id="SYMBOL_-_GATE-DOT_-_${gateNumber}"
      data-gate="${gateNumber}"
      cx="${position.x.toFixed(4)}"
      cy="${position.y.toFixed(4)}"
      r="${GATE_DOT_RADIUS}"
      fill="${COLORS.foreground}"/>`;
}

/**
 * Generate tracing lines connecting gate numbers to gate dots
 * Creates a fan-out pattern from a central junction point to each gate dot
 */
function generateTracingLines(ring) {
  const { gates, name } = ring;
  const ringId = name.replace(/\s+/g, '_').toUpperCase();

  if (gates.length === 1) {
    // Single gate - just a straight line from below numbers to dot
    const gate = gates[0];
    const v3Data = positioning.getDockingData(gate, 1);
    const dotPos = calculatePosition(v3Data.angle, RADII.gateDots);
    // Start line below the gate numbers text
    const lineStartPos = calculatePosition(v3Data.angle, RADII.gateNumbers - 15);

    return `    <line id="PATHS_-_JOIN-DOTS_-_${ringId}"
      x1="${lineStartPos.x.toFixed(4)}" y1="${lineStartPos.y.toFixed(4)}"
      x2="${dotPos.x.toFixed(4)}" y2="${dotPos.y.toFixed(4)}"
      fill="none" stroke="${COLORS.foreground}" stroke-miterlimit="10"/>`;
  }

  // Multiple gates - create fan-out from junction point
  // Pass ring name to allow position override for non-contiguous rings
  const { centerAngle } = getGateGroupGeometry(gates, name);

  // Junction point is between the gate numbers and the gate dots
  const junctionRadius = (RADII.gateNumbers + RADII.gateDots) / 2;
  const junctionPos = calculatePosition(centerAngle, junctionRadius);

  // Line start position - just below the gate numbers (not overlapping them)
  const lineStartPos = calculatePosition(centerAngle, RADII.gateNumbers - 15);

  // Get dot positions for all gates, sorted by angle for cleaner lines
  const gateData = gates.map(gate => {
    const v3Data = positioning.getDockingData(gate, 1);
    return {
      gate,
      angle: v3Data.angle,
      pos: calculatePosition(v3Data.angle, RADII.gateDots)
    };
  }).sort((a, b) => a.angle - b.angle);

  // Build path: line from below numbers to junction, then individual lines to each dot
  let lines = [];

  // Main line from below gate numbers to junction
  lines.push(`    <line id="PATHS_-_JOIN-DOTS_-_${ringId}_MAIN"
      x1="${lineStartPos.x.toFixed(4)}" y1="${lineStartPos.y.toFixed(4)}"
      x2="${junctionPos.x.toFixed(4)}" y2="${junctionPos.y.toFixed(4)}"
      fill="none" stroke="${COLORS.foreground}" stroke-miterlimit="10"/>`);

  // Individual lines from junction to each gate dot
  for (const { gate, pos } of gateData) {
    lines.push(`    <line id="PATHS_-_JOIN-DOTS_-_${ringId}_${gate}"
      x1="${junctionPos.x.toFixed(4)}" y1="${junctionPos.y.toFixed(4)}"
      x2="${pos.x.toFixed(4)}" y2="${pos.y.toFixed(4)}"
      fill="none" stroke="${COLORS.foreground}" stroke-miterlimit="10"/>`);
  }

  return lines.join('\n');
}

/**
 * Generate gate numbers text for a ring
 * Gate numbers always use radial rotation (baseline toward center)
 * If the ring has relatedGates, show them in brackets below
 * For 3-gate rings, splits the numbers over two lines for better fit
 * Uses adaptive layout to size text based on available space
 * @param {Object} ring - Ring object with gates array, name, and optional relatedGates
 * @param {Object} layout - Adaptive layout parameters from calculateAdaptiveLayout
 */
function generateGateNumbersText(ring, layout) {
  const { gates, name, relatedGates } = ring;
  const { centerAngle } = getGateGroupGeometry(gates, name);

  const position = calculatePosition(centerAngle, layout.gateNumbersRadius);
  const rotation = calculateRadialRotation(position.svgAngle);
  const lineHeight = layout.gateNumbersLineHeight;

  let content;

  // For 3-gate rings, split over two lines
  if (gates.length === 3) {
    let line1, line2;
    if (name === 'Ring of Gaia') {
      // Gaia: "19" on top, "60 - 61" on bottom (junction at AUC)
      line1 = `${gates[0]}`;
      line2 = `${gates[1]} - ${gates[2]}`;
    } else {
      // Default: first two gates on top, third on bottom
      line1 = `${gates[0]} - ${gates[1]}`;
      line2 = `${gates[2]}`;
    }
    content = `<tspan x="0" dy="${(-lineHeight / 2).toFixed(1)}">${line1}</tspan><tspan x="0" dy="${lineHeight.toFixed(1)}">${line2}</tspan>`;
  } else if (relatedGates && relatedGates.length > 0) {
    // If there are related gates, show them in brackets on a second line
    const gateText = gates.join(' - ');
    const relatedText = `[${relatedGates.join(' - ')}]`;
    content = `<tspan x="0" dy="${(-lineHeight / 2).toFixed(1)}">${gateText}</tspan><tspan x="0" dy="${lineHeight.toFixed(1)}" font-size="${layout.relatedTextSize.toFixed(2)}">${relatedText}</tspan>`;
  } else {
    // Simple single line
    content = gates.join(' - ');
  }

  return `    <text id="TEXT_-_GROUPED-KEYS_-_${gates.join('_')}"
      data-ring="${name}"
      data-gates="${gates.join(',')}"
      transform="translate(${position.x.toFixed(4)} ${position.y.toFixed(4)}) rotate(${rotation.toFixed(4)})"
      font-size="${layout.gateNumbersSize.toFixed(2)}"
      font-family="${FONT.gateNumbers.family}"
      font-weight="${FONT.gateNumbers.weight}"
      text-anchor="middle"
      dominant-baseline="central"
      fill="${COLORS.foreground}"
      style="isolation: isolate">${content}</text>`;
}

/**
 * Generate ring name text (e.g., "Ring of FIRE")
 * Uses adaptive layout for sizing and positioning
 * @param {Object} ring - Ring object with gates array and name
 * @param {boolean} useTangent - Whether to use tangent orientation (for small rings)
 * @param {Object} layout - Adaptive layout parameters from calculateAdaptiveLayout
 */
// Rings where the name text should use radial rotation (same as amino acid)
// These are larger rings where readable rotation looks inconsistent
const RADIAL_NAME_RINGS = [
  'Ring of Alchemy',
  'Ring of Union',
  'Ring of Life And Death'
];

// For split rings, only the larger segment uses radial rotation
function shouldUseRadialNameRotation(ring) {
  const { name, gates } = ring;

  // Always radial for these rings
  if (RADIAL_NAME_RINGS.includes(name)) return true;

  // For Humanity and Seeking, only the larger segment (4 gates) uses radial
  if (name === 'Ring of Humanity' || name === 'Ring of Seeking') {
    return gates.length >= 4;
  }

  return false;
}

function generateRingNameText(ring, useTangent, layout) {
  const { name, gates } = ring;
  const { centerAngle } = getGateGroupGeometry(gates, name);

  // Extract the ring name part (e.g., "FIRE" from "Ring of Fire")
  const ringLabel = name.replace('Ring of ', '').toUpperCase();

  // Use tangent radius for tangent-oriented small rings (closer to outer edge)
  let radius = useTangent ? RADII.ringNamesTangent : layout.ringNamesRadius;

  // Small Humanity and Seeking segments need to be nudged outward
  if (useTangent && (name === 'Ring of Humanity' || name === 'Ring of Seeking')) {
    radius += 6;
  }

  const position = calculatePosition(centerAngle, radius);

  // Determine rotation style:
  // 1. Radial (same as amino acid) for specific larger rings
  // 2. Tangent for small rings
  // 3. Readable (right-side up) for others
  let rotation;
  if (shouldUseRadialNameRotation(ring)) {
    rotation = calculateRadialRotation(position.svgAngle);
  } else if (useTangent) {
    rotation = calculateTangentRotation(position.svgAngle);
  } else {
    rotation = calculateReadableRotation(position.svgAngle);
  }

  const lineHeight = layout.ringNamesLineHeight;

  return `    <text id="TEXT_-_RING-NAME_-_${ringLabel}"
      data-ring="${name}"
      transform="translate(${position.x.toFixed(4)} ${position.y.toFixed(4)}) rotate(${rotation.toFixed(4)})"
      font-size="${layout.ringNamesSize.toFixed(2)}"
      font-family="${FONT.ringNames.family}"
      font-weight="${FONT.ringNames.weight}"
      text-anchor="middle"
      dominant-baseline="central"
      fill="${COLORS.foreground}"
      style="isolation: isolate">
      <tspan x="0" dy="${(-lineHeight / 2).toFixed(1)}">Ring of</tspan>
      <tspan x="0" dy="${lineHeight.toFixed(1)}">${ringLabel}</tspan>
    </text>`;
}

/**
 * Generate amino acid name text
 * Amino acid names always use radial rotation (baseline toward center)
 * @param {Object} ring - Ring object with gates array, name, and aminoAcid
 */
// Amino acids that need smaller font due to overlap
const SMALL_AMINO_ACIDS = ['Glutamic_Acid', 'Aspartic_Acid'];
const SMALL_AMINO_ACID_FONT_SIZE = 12;  // Smaller than standard 16

function generateAminoAcidText(ring) {
  const { name, aminoAcid, gates } = ring;
  const { centerAngle } = getGateGroupGeometry(gates, name);

  // Clean up amino acid name for display
  const displayName = aminoAcid.replace(/_/g, ' ');

  // Use smaller font for overlapping amino acids
  const fontSize = SMALL_AMINO_ACIDS.includes(aminoAcid)
    ? SMALL_AMINO_ACID_FONT_SIZE
    : FONT.aminoAcids.size;

  const position = calculatePosition(centerAngle, RADII.aminoAcids);
  const rotation = calculateRadialRotation(position.svgAngle);

  return `    <text id="TEXT_-_AMINO-ACID-NAME_-_${aminoAcid}"
      data-ring="${name}"
      data-amino-acid="${aminoAcid}"
      transform="translate(${position.x.toFixed(4)} ${position.y.toFixed(4)}) rotate(${rotation.toFixed(4)})"
      font-size="${fontSize}"
      font-family="${FONT.aminoAcids.family}"
      font-weight="${FONT.aminoAcids.weight}"
      text-anchor="middle"
      dominant-baseline="central"
      fill="${COLORS.foreground}"
      style="isolation: isolate">${displayName}</text>`;
}

/**
 * Get codon ring boundaries - where dividers should be placed
 * Returns array of { angle, gateA, gateB, ringA, ringB }
 *
 * Note: Some adjacent ring pairs don't have visual dividers in the master SVG.
 * These are typically where related rings share amino acid families or
 * where the visual grouping is intentionally merged.
 */
function getCodonRingBoundaries() {
  // Build gate to ring lookup
  const gateToRing = {};
  for (const m of codonRingsMappings.mappings) {
    if (!gateToRing[m.gateNumber]) {
      gateToRing[m.gateNumber] = m.knowledge.ring;
    }
  }

  // Gate pairs where we should NOT place a divider (based on master SVG analysis)
  // These are visually merged in the original design
  const skipDividers = [
    [19, 13],  // Gaia -> Purification (no divider between AUA and CAA area)
    [24, 2],   // Life And Death -> Water
    [2, 23],   // Water -> Life And Death
    [20, 16],  // Life And Death -> Prosperity
    [44, 1],   // Illuminati -> Fire (no divider between GAA and AAA)
    [54, 61],  // Seeking -> Gaia (no divider between AGU and AUA area)
  ];

  // Additional dividers WITHIN the same ring for visual grouping
  // These create borders around tangent-oriented ring labels
  const extraDividers = [
    [61, 60],  // Within Gaia: between AUA and AUC to frame the ring label
  ];

  const boundaries = [];

  for (let i = 0; i < gateSequence.length; i++) {
    const gateA = gateSequence[i];
    const gateB = gateSequence[(i + 1) % gateSequence.length];
    const ringA = gateToRing[gateA];
    const ringB = gateToRing[gateB];

    // Check if this is an extra divider (within same ring for visual framing)
    const isExtraDivider = extraDividers.some(
      ([a, b]) => (gateA === a && gateB === b) || (gateA === b && gateB === a)
    );

    // Add divider if rings are different OR if it's an extra divider
    if (ringA !== ringB || isExtraDivider) {
      // Check if this boundary should be skipped
      const shouldSkip = skipDividers.some(
        ([a, b]) => (gateA === a && gateB === b) || (gateA === b && gateB === a)
      );

      if (shouldSkip) {
        continue;
      }

      const v3DataA = positioning.getDockingData(gateA, 1);
      const v3DataB = positioning.getDockingData(gateB, 1);

      // Calculate midpoint angle between gates
      let midAngle = (v3DataA.angle + v3DataB.angle) / 2;
      if (Math.abs(v3DataB.angle - v3DataA.angle) > 180) {
        midAngle = ((v3DataA.angle + v3DataB.angle + 360) / 2) % 360;
      }

      boundaries.push({
        angle: midAngle,
        gateA,
        gateB,
        ringA,
        ringB
      });
    }
  }

  return boundaries;
}

/**
 * Generate structure (ring circles and dividers)
 * Dividers are only placed at codon ring boundaries, not between every gate
 */
function generateStructure(stroke, strokeWidth) {
  let svg = `  <g id="GROUP_-_STRUCTURE" data-name="GROUP - STRUCTURE">
    <g id="RINGS">
      <circle id="RING_-_OUTER" data-name="RING - OUTER" cx="${CENTER.x}" cy="${CENTER.y}" r="${RADII.outerRing}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${strokeWidth}"/>
      <circle id="RING_-_MIDDLE" data-name="RING - MIDDLE" cx="${CENTER.x}" cy="${CENTER.y}" r="${RING.outerRadius}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${strokeWidth}"/>
      <circle id="RING_-_INNERMOST" data-name="RING - INNERMOST" cx="${CENTER.x}" cy="${CENTER.y}" r="${RADII.innerRing}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="${strokeWidth}"/>
    </g>
    <g id="DIVIDERS">\n`;

  // Generate divider lines only at codon ring boundaries
  const boundaries = getCodonRingBoundaries();

  for (const boundary of boundaries) {
    // Extend dividers from innermost ring (below letters) to outer boundary
    const innerPos = calculatePosition(boundary.angle, RADII.innerRing);
    const outerPos = calculatePosition(boundary.angle, RING.outerRadius);

    svg += `      <line x1="${innerPos.x.toFixed(4)}" y1="${innerPos.y.toFixed(4)}" x2="${outerPos.x.toFixed(4)}" y2="${outerPos.y.toFixed(4)}" fill="none" stroke="${stroke}" stroke-miterlimit="10" stroke-width="0.5"/>\n`;
  }

  svg += `    </g>
  </g>`;

  return svg;
}

/**
 * Generate the complete Codon Rings ring SVG
 */
function generateCodonRingsRing(options = {}) {
  const {
    includeStructure = true,
    includeBackground = true,
    stroke = COLORS.foreground,  // White stroke
    backgroundColor = COLORS.background,
    strokeWidth = 0.8
  } = options;

  const uniqueRings = getUniqueRings();
  const viewBoxSize = Math.max(CENTER.x, CENTER.y) * 2 + 100;

  let svg = `<svg id="THE_24_CODON_RINGS" xmlns="http://www.w3.org/2000/svg"
     width="${viewBoxSize.toFixed(4)}"
     height="${viewBoxSize.toFixed(4)}"
     viewBox="0 0 ${viewBoxSize.toFixed(4)} ${viewBoxSize.toFixed(4)}">
`;

  // Background
  if (includeBackground) {
    svg += `  <rect id="background" width="100%" height="100%" fill="${backgroundColor}"/>\n`;
  }

  // Structure (ring circles and dividers)
  if (includeStructure) {
    svg += generateStructure(stroke, strokeWidth) + '\n';
  }

  // Main content group
  svg += `  <g id="ROOT_-_THE_CODON_RINGS" data-name="ROOT - THE CODON RINGS">
    <g id="GROUP_-_THE_CODON_RINGS" data-name="GROUP - THE CODON RINGS">\n`;

  // Generate content for each ring
  for (const ring of uniqueRings) {
    const ringId = ring.name.replace(/\s+/g, '_').toUpperCase();
    const gatesStr = ring.gates.join('_-_');

    // Determine if this ring's name should use tangent orientation (for small rings)
    const useTangentForName = shouldUseTangentOrientation(ring.name, ring.gates);

    // Calculate adaptive layout for this ring segment (needs useTangent for font sizing)
    const layout = calculateAdaptiveLayout(ring, useTangentForName);

    svg += `      <g id="${ringId}_-_${gatesStr}" data-name="${ring.name} - ${ring.gates.join(' - ')}">\n`;

    // Codon letters for each gate in this ring (always radial)
    for (const gate of ring.gates) {
      svg += generateCodonLetter(gate) + '\n';
    }

    // Gate dots for each gate
    for (const gate of ring.gates) {
      svg += generateGateDot(gate) + '\n';
    }

    // Tracing lines
    svg += generateTracingLines(ring) + '\n';

    // Gate numbers (always radial, with adaptive sizing)
    svg += generateGateNumbersText(ring, layout) + '\n';

    // Ring name (tangent for small rings, readable for large, with adaptive sizing)
    svg += generateRingNameText(ring, useTangentForName, layout) + '\n';

    // Amino acid name (always radial)
    svg += generateAminoAcidText(ring) + '\n';

    svg += `      </g>\n`;
  }

  svg += `    </g>
  </g>
</svg>`;

  return svg;
}

// Export
module.exports = {
  // Scaling system
  BASE_RING,
  SCALE_FACTOR,
  SCALE_RATIOS,
  SCALED,
  calculateScaledGeometry,

  // Legacy geometry (for backward compatibility)
  CENTER,
  RING,
  RADII,
  FONT,
  COLORS,
  GATE_DOT_RADIUS,

  // Ring configuration
  SMALL_RINGS,

  // Data functions
  buildGateToRingLookup,
  getUniqueRings,
  splitInterlacedRing,
  splitIntoContiguousSegments,
  getCodonRingBoundaries,

  // Layout calculation
  calculateAdaptiveLayout,

  // Position/rotation calculations
  calculateSVGAngle,
  calculateRadialRotation,
  calculateReadableRotation,
  calculateTangentRotation,
  shouldUseTangentOrientation,
  calculatePosition,
  getGateGroupGeometry,

  // Element generators
  generateCodonLetter,
  generateGateDot,
  generateTracingLines,
  generateGateNumbersText,
  generateRingNameText,
  generateAminoAcidText,

  // Main generator
  generateCodonRingsRing
};

// CLI: node codon-rings-ring.js [output.svg]
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const output = process.argv[2] || path.join(__dirname, '../output/generated-codon-rings-ring.svg');

  console.log('Generating Codon Rings ring...');
  const svg = generateCodonRingsRing();

  fs.writeFileSync(output, svg);
  console.log('Written to:', output);
  console.log('Unique rings:', getUniqueRings().length);
}
