/**
 * Channels Ring Generator
 *
 * Generates the 36 channels ring SVG with 72 channel entries (each channel
 * appears twice - once at each gate position).
 *
 * Each channel entry displays:
 * - Inner gate number (determines wheel position)
 * - Channel name and keynote
 * - Energy type and circuit
 * - Outer gate number and center names
 *
 * Text is oriented RADIALLY (reading outward from center), not tangentially.
 * Rotation formula: svgAngle + 180 (different from other rings which use svgAngle + 90)
 *
 * METHODOLOGY (see docs/reference/SVG-GENERATION-METHODOLOGY.md):
 * - Use first-principles formulas, not per-quadrant adjustments
 * - Inner gate number from channel determines wheel position via V3 engine
 * - Extract geometry from master SVG, generate transforms from principles
 */

const positioning = require('../../core/root-system/positioning-algorithm');
const shared = require('./shared-constants');
const engine = require('../../unified-query-engine');

// Load channel mappings
const channelsData = require('../../knowledge-systems/channels/mappings/channels-mappings.json');

// Ring geometry (extracted from verified master: the-36-channels-verified-master-mini-sizes.svg)
const CENTER = { x: 6482.5278, y: 6486.1582 };

// Ring radii from master (verified from the-36-channels-verified-master-mini-sizes.svg)
// Inner number band reduced by 36% (band width: 203px → 130px)
const RING_RADII = {
  inner: 4504.9828,       // Inner ring (structure)
  outer: 4635,            // Ring 2 - reduced 36% to shrink inner number band (was 4708)
  bottomOuter: 5809.3379, // Outer band inner edge - moved 350px inward (was 6159.3379)
  bottom: 6099.1808       // Outermost boundary - moved 32px inward (was 6131.1808)
};

// Extended structure radii (from STRUCTURE_CHANNELS_ORIGINAL in master)
// These define the full extent of radial divider lines
const STRUCTURE_RADII = {
  dividerInner: 4505,     // Inner end of radial dividers (inner ring)
  dividerOuter: 6101,     // Outer end of radial dividers - moved 32px inward (was 6133)
  outerRing1: 5809,       // First outer ring (bottomOuter) - moved 350px inward (was 6159)
  outerRing2: 6099        // Second outer ring (bottom) - moved 32px inward (was 6131)
};

// Text band radii - different for single vs multi-channel gates
// Single-channel gates have text elements closer to center
// Multi-channel gates spread elements out more to fit 2-3 channels

// Single-channel radii - centered within rings 2-3 (4827-6159)
// Shifted -152px inward to center content within the zone
const BAND_RADII_SINGLE = {
  innerCentre: 4671,      // Inner centre like "Throat" - 36px gap from inner number band
  circuit: 4724,          // Circuit - moved 24px inward (was 4748)
  keynote: 5215,          // Keynote - moved 24px inward (was 5239)
  channelName: 5215,      // Channel name - moved 24px inward (was 5239)
  energyType: 5541,       // Energy type - moved 74px outward (was 5467)
  outerCentre: 5755,      // Outer centre like "Ajna" - moved 74px outward (was 5681)
  outerGateNumber: 5955,  // Gate number - moved 17px outward (was 5938)
  outerHexagram: 5955     // Hexagram - moved 17px outward (was 5938)
};

// Multi-channel radii (measured from Recognition 41-30, Perfected Form 10-57)
const BAND_RADII_MULTI = {
  innerCentre: 4671,      // Match single-channel inner centre radius - 36px gap from inner number band (was 4768)
  channelName: 4724,      // Moved 116px inward (was 4840)
  keynote: 4724,          // Same radius as channelName, angularly separated
  energyType: 5730,       // Moved 300px inward (was 6030)
  circuit: 5730,          // Moved 300px inward (was 6030)
  outerCentre: 5780,      // Moved 316px inward (was 6096)
  outerHexagram: 5890,    // Hexagram - moved 350px inward (was 6240)
  outerGateNumber: 6014   // Gate number - moved 16px inward (was 6030)
};

// Default BAND_RADII for backwards compatibility (uses multi-channel values)
const BAND_RADII = BAND_RADII_MULTI;

// Angular offsets from gate center (measured from master SVG gate 41)
// Gate 41 center is at SVG angle -126.5625°
// These offsets are in V3 angle space (negated from SVG measurement)
// because V3 angles and SVG angles run in opposite directions
// Positive V3 offset = clockwise in SVG (more negative SVG angle)
const BASE_ANGLE_OFFSETS = {
  innerCentre: 1.64,      // SVG -128.21° = clockwise from center
  channelName: -0.36,     // SVG -126.20° = counter-clockwise from center
  keynote: -1.08,         // SVG -125.48° = more counter-clockwise
  energyType: 2.16,       // SVG -128.73° = clockwise
  circuit: 2.24,          // SVG -128.81° = most clockwise
  outerCentre: 0,         // Centered on gate (no offset)
  outerGateNumber: 1.0,   // Gate number offset (adjusted for hexagram)
  outerHexagram: -1.5     // Hexagram offset - counter-clockwise, opposite side from number
};

// Helper to get scaled offset based on channel count at this gate
function getScaledOffset(baseOffset, channelCount) {
  // Single channel gets full offset, more channels compress the offsets
  return baseOffset / channelCount;
}

// Font specifications (from master analysis)
// Different sizes for single-channel gates vs multi-channel (integration) gates
const FONT = {
  family: 'Copperplate',
  // Single channel gates (1 channel) - larger fonts
  single: {
    channelName: { size: 100.8, weight: 400 },  // Increased 16px (was 84.8)
    keynote: { size: 53.9, weight: 400 },  // Reduced 13% (was 62)
    innerGate: { family: 'Herculanum', size: 128, weight: 400 },  // Reduced 36% (was 200)
    outerGate: { family: 'Herculanum', size: 179, weight: 400 },
    innerCentre: { size: 65, weight: 400 },  // Reduced 36% (was 102)
    outerCentre: { size: 71.3, weight: 400 },  // Reduced 32% total (was 102)
    energyType: { size: 69.7, weight: 400 },   // Reduced 18% (was 85)
    circuit: { size: 69.7, weight: 400 }       // Reduced 18% (was 85)
  },
  // Multi-channel gates (2-3 channels, e.g., Integration Circuit) - compressed fonts
  multi: {
    channelName: { size: 56.2, weight: 400 },  // Reduced 35% (was 86.4)
    keynote: { size: 38.4, weight: 400 },
    innerGate: { family: 'Herculanum', size: 128, weight: 400 },  // Reduced 36% (was 200)
    outerGate: { family: 'Herculanum', size: 100, weight: 400 },  // Smaller to fit in sub-segment
    innerCentre: { size: 65.5, weight: 400 },  // Reduced 36% (was 102.4)
    outerCentre: { size: 51.2, weight: 400 },
    energyType: { size: 48, weight: 400 },
    circuit: { size: 48, weight: 400 }
  },
  // Middle channel in multi-channel gates (23% larger text, 35% larger outer gate number)
  multiMiddle: {
    channelName: { size: 56.2 * 1.23, weight: 400 },  // Reduced 35% base, then +23% = ~69.1
    keynote: { size: 38.4 * 1.23 * 0.8, weight: 400 },    // 20% smaller = ~37.8
    innerGate: { family: 'Herculanum', size: 128, weight: 400 },  // Reduced 36% (was 200)
    outerGate: { family: 'Herculanum', size: 100 * 1.35, weight: 400 },  // 35% larger = 135
    innerCentre: { size: 65.5, weight: 400 },  // Reduced 36% (was 102.4)
    outerCentre: { size: 51.2, weight: 400 },  // Same size as other channels
    energyType: { size: 48 * 1.23 * 0.8, weight: 400 },   // 20% smaller = ~47.2
    circuit: { size: 48 * 1.23 * 0.8, weight: 400 }       // 20% smaller = ~47.2
  }
};

// Use shared color scheme
const COLORS = shared.COLORS;

// Hexagram symbol dimensions for outer band (scaled from hexagram-ring.js)
// Master SVG shows hexagrams ~154px wide, so we scale up from 80.76px
const HEXAGRAM_SYMBOL = {
  // Single-channel dimensions (full size)
  single: {
    lineWidth: 154,           // Width of a YANG line (scaled from 80.76)
    lineHeight: 19,           // Height/thickness of a line (scaled from 9.95)
    lineSpacing: 32.3,        // Vertical spacing between lines (scaled from 16.91)
    gapWidth: 14,             // Gap in YIN line (scaled from 7.34)
    get totalHeight() { return this.lineSpacing * 5 + this.lineHeight; }
  },
  // Multi-channel dimensions (scaled down to ~55% to fit in sub-segments)
  // Used for middle channel hexagram
  multi: {
    lineWidth: 85,            // Reduced width to fit in 1/3 segment
    lineHeight: 10,           // Reduced height
    lineSpacing: 18,          // Reduced spacing
    gapWidth: 8,              // Reduced gap
    get totalHeight() { return this.lineSpacing * 5 + this.lineHeight; }
  },
  // Side channel dimensions (15% smaller than multi, for CW/CCW positions)
  multiSide: {
    lineWidth: 85 * 0.85,     // 15% smaller = 72.25
    lineHeight: 10 * 0.85,    // 8.5
    lineSpacing: 18 * 0.85,   // 15.3
    gapWidth: 8 * 0.85,       // 6.8
    get totalHeight() { return this.lineSpacing * 5 + this.lineHeight; }
  },
  // Inner band dimensions (smaller to fit in narrower inner number band)
  // Band width is ~130px (4505 to 4635), so hexagram needs to be compact
  inner: {
    lineWidth: 70,            // Compact width for inner band
    lineHeight: 8,            // Reduced height
    lineSpacing: 14,          // Reduced spacing
    gapWidth: 6,              // Reduced gap
    get totalHeight() { return this.lineSpacing * 5 + this.lineHeight; }
  }
};

/**
 * Calculate SVG position angle from V3 angle
 */
function calculateSVGAngle(v3Angle) {
  return shared.calculateSVGAngle(v3Angle);
}

/**
 * Determine if text at this SVG angle needs to be flipped 180° for readability.
 * Text on the left side of the wheel (90° < normalized < 270°) would appear
 * upside-down without flipping.
 *
 * @param {number} svgAngle - The SVG angle
 * @returns {boolean} - True if text should be flipped
 */
function isFlipped(svgAngle) {
  // For radial text, check the rotation angle (svgAngle + 180)
  const rotation = svgAngle + 180;
  const normalized = ((rotation % 360) + 360) % 360;
  return normalized > 90 && normalized < 270;
}

/**
 * Calculate radial text rotation (reading outward from center)
 * Used for: channel name, keynote, energy type, circuit
 *
 * Text on right side of wheel reads outward normally.
 * Text on left side is flipped 180° to remain right-side up.
 */
function calculateRadialRotation(svgAngle) {
  let rotation = svgAngle + 180;
  // Flip on left side of wheel for readability
  if (isFlipped(svgAngle)) {
    rotation += 180;
  }
  // Normalize to -180 to 180
  while (rotation > 180) rotation -= 360;
  while (rotation < -180) rotation += 360;
  return rotation;
}

/**
 * Calculate tangential text rotation (reading along the arc)
 * Used for: inner centres, outer centres, gate numbers, hexagrams
 *
 * These elements read fine in either direction, so NO flip is applied.
 * Text follows the arc direction consistently around the wheel.
 */
function calculateTangentialRotation(svgAngle) {
  let rotation = svgAngle + 90;
  // NO flip - tangential text reads fine in either direction
  // Normalize to -180 to 180
  while (rotation > 180) rotation -= 360;
  while (rotation < -180) rotation += 360;
  return rotation;
}

/**
 * Calculate SVG position for an element at specified radius
 */
function calculatePosition(v3Angle, radius) {
  return shared.calculatePosition(v3Angle, radius, CENTER);
}

/**
 * Get channel data for a specific gate
 * Returns the channels where this gate is one of the connected gates
 */
function getChannelsForGate(gate) {
  return channelsData.mappings.filter(channel =>
    channel.gate1 === gate || channel.gate2 === gate
  ).map(channel => ({
    ...channel,
    innerGate: gate,
    outerGate: channel.gate1 === gate ? channel.gate2 : channel.gate1
  }));
}

/**
 * Abbreviate centre name to match master SVG conventions
 * Master uses: SP (Solar Plexus), G (G Centre), and full names for others
 */
function abbreviateCentre(centreName) {
  const abbreviations = {
    'Solar Plexus': 'SP',
    'G Centre': 'G',
    'G': 'G'
  };
  return abbreviations[centreName] || centreName;
}

/**
 * Format circuit name to match master SVG conventions
 * Master uses just the circuit name without "Circuit" suffix
 */
function formatCircuit(circuitName) {
  // Remove "Circuit" suffix if present
  return circuitName.replace(/\s+Circuit$/i, '');
}

/**
 * Format keynote for display, wrapping long text onto multiple lines
 * Returns SVG tspan elements for multi-line text, or plain text for short keynotes
 * @param {string} keynote - The keynote text
 * @param {number} fontSize - Font size for calculating line height
 * @param {number} maxChars - Maximum characters per line (default 28)
 */
function formatKeynote(keynote, fontSize, maxChars = 28) {
  // Special case overrides for specific keynotes that need custom wrapping
  // Note: Use &amp; for ampersand in SVG/XML
  // Format: { lines: [...], extraOffset: number } or just array of lines
  const specialCases = {
    'Energy which Fluctuates and Initiates Pulses': {
      lines: ['Energy Which Fluctuates', '&amp; Initiates Pulses'],
      extraOffset: 5  // Extra padding from channelName
    },
    "Leadership For 'Good' or 'Bad'": {
      lines: ['Leadership', "For 'Good' or 'Bad'"],
      extraOffset: 5
    },
    'Mental Activity Mixed With Clarity': {
      lines: ['Mental Activity', 'Mixed With Clarity'],
      extraOffset: 5
    },
    'Balanced Development – Cyclic': {
      lines: ['Balanced Development', '&amp; Cyclic'],
      extraOffset: 5
    },
    'Commitment To Higher Principles': 'single',  // Keep as single line (31 chars > 28 threshold)
    'Thoughts that must become Deeds': {
      lines: ['Thoughts that must', 'become Deeds'],
      extraOffset: 15,
      lineHeightMultiplier: 0.8  // Tighter line spacing
    }
  };

  let lines;
  let extraOffset = 0;
  let lineHeightMultiplier = 1.0;

  if (specialCases[keynote]) {
    const special = specialCases[keynote];
    if (special === 'single') {
      // Force single line - return plain text
      return keynote;
    } else if (Array.isArray(special)) {
      lines = special;
    } else {
      lines = special.lines;
      extraOffset = special.extraOffset || 0;
      lineHeightMultiplier = special.lineHeightMultiplier || 1.0;
    }
  } else if (keynote.length <= maxChars) {
    return keynote;
  } else {
    // Split into words and build lines
    const words = keynote.split(' ');
    lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      if (testLine.length <= maxChars) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
  }

  // Generate tspan elements with dy offset for each line after the first
  const lineHeight = fontSize * 0.85 * lineHeightMultiplier;  // Tighter line height, with optional multiplier
  // Center the text block vertically by offsetting the first line upward
  // Add extraOffset to push multi-line keynotes further from channelName
  const totalHeight = (lines.length - 1) * lineHeight;
  const startOffset = -totalHeight / 2 - extraOffset;

  return lines.map((line, i) => {
    const dy = i === 0 ? startOffset : lineHeight;
    return `<tspan x="0" dy="${dy.toFixed(1)}">${line}</tspan>`;
  }).join('');
}

/**
 * Generate SVG for a single YANG line (solid rectangle)
 * I Ching convention: Line 1 at bottom, Line 6 at top
 * So Line 1 gets largest y-offset, Line 6 gets smallest
 * @param {number} lineNumber - Line number (1-6)
 * @param {Object} dims - Symbol dimensions (lineWidth, lineHeight, lineSpacing, gapWidth)
 */
function generateYangLine(lineNumber, dims) {
  const yOffset = (6 - lineNumber) * dims.lineSpacing;
  return `<rect data-line="${lineNumber}" data-type="yang" x="0" y="${yOffset.toFixed(2)}" width="${dims.lineWidth}" height="${dims.lineHeight}"/>`;
}

/**
 * Generate SVG for a single YIN line (two rectangles with gap)
 * I Ching convention: Line 1 at bottom, Line 6 at top
 * So Line 1 gets largest y-offset, Line 6 gets smallest
 * @param {number} lineNumber - Line number (1-6)
 * @param {Object} dims - Symbol dimensions (lineWidth, lineHeight, lineSpacing, gapWidth)
 */
function generateYinLine(lineNumber, dims) {
  const yOffset = (6 - lineNumber) * dims.lineSpacing;
  const segmentWidth = (dims.lineWidth - dims.gapWidth) / 2;
  return `<g data-line="${lineNumber}" data-type="yin">
        <rect x="0" y="${yOffset.toFixed(2)}" width="${segmentWidth.toFixed(2)}" height="${dims.lineHeight}"/>
        <rect x="${(segmentWidth + dims.gapWidth).toFixed(2)}" y="${yOffset.toFixed(2)}" width="${segmentWidth.toFixed(2)}" height="${dims.lineHeight}"/>
      </g>`;
}

/**
 * Generate the hexagram symbol SVG for a gate
 * Uses binary data from the unified query engine
 * Binary string is stored BOTTOM to TOP: index 0 = Line 1 (bottom)
 * @param {number} gateNumber - Gate number
 * @param {Object} dims - Symbol dimensions (lineWidth, lineHeight, lineSpacing, gapWidth)
 */
function generateHexagramSymbol(gateNumber, dims) {
  const knowledge = engine.getGateKnowledge(gateNumber);
  const binary = knowledge.binary;

  const lines = [];
  for (let i = 0; i < 6; i++) {
    const lineNumber = i + 1;
    const isYang = binary[i] === '1';
    lines.push(isYang ? generateYangLine(lineNumber, dims) : generateYinLine(lineNumber, dims));
  }

  return lines.join('\n      ');
}

/**
 * Generate a positioned hexagram for the outer band
 * Hexagram is positioned next to the outer gate number
 * Uses tangential rotation (same as gate number)
 * @param {number} gateNumber - Gate number
 * @param {Object} position - {x, y} position
 * @param {number} rotation - Rotation angle in degrees
 * @param {boolean} isMultiChannel - Whether this is a multi-channel gate (uses smaller hexagram)
 * @param {number} channelIndex - Index within multi-channel gate (0=CW, 1=middle, 2=CCW)
 */
function generateOuterHexagram(gateNumber, position, rotation, isMultiChannel = false, channelIndex = 0) {
  // Select dimensions based on channel count and position
  // Single channel: full size
  // Multi-channel middle (index 1): standard multi size
  // Multi-channel sides (index 0, 2): 15% smaller
  let dims;
  if (!isMultiChannel) {
    dims = HEXAGRAM_SYMBOL.single;
  } else if (channelIndex === 1) {
    dims = HEXAGRAM_SYMBOL.multi;  // Middle channel
  } else {
    dims = HEXAGRAM_SYMBOL.multiSide;  // Side channels (15% smaller)
  }

  // Center the symbol on the position
  const offsetX = -dims.lineWidth / 2;
  const offsetY = -dims.totalHeight / 2;

  const symbol = generateHexagramSymbol(gateNumber, dims);

  return `<!-- Outer Hexagram for gate ${gateNumber} -->
      <g id="OUTER-HEXAGRAM_-_${gateNumber}"
         transform="translate(${position.x.toFixed(4)} ${position.y.toFixed(4)}) rotate(${rotation.toFixed(4)}) translate(${offsetX.toFixed(2)} ${offsetY.toFixed(2)})"
         fill="${COLORS.foreground}">
      ${symbol}
      </g>`;
}

/**
 * Generate a positioned hexagram for the inner band
 * Hexagram is positioned next to the inner gate number
 * Uses tangential rotation (same as gate number)
 * @param {number} gateNumber - Gate number
 * @param {Object} position - {x, y} position
 * @param {number} rotation - Rotation angle in degrees
 */
function generateInnerHexagram(gateNumber, position, rotation) {
  const dims = HEXAGRAM_SYMBOL.inner;

  // Center the symbol on the position
  const offsetX = -dims.lineWidth / 2;
  const offsetY = -dims.totalHeight / 2;

  const symbol = generateHexagramSymbol(gateNumber, dims);

  return `<g id="INNER-HEXAGRAM_-_${gateNumber}"
         transform="translate(${position.x.toFixed(4)} ${position.y.toFixed(4)}) rotate(${rotation.toFixed(4)}) translate(${offsetX.toFixed(2)} ${offsetY.toFixed(2)})"
         fill="${COLORS.foreground}">
      ${symbol}
      </g>`;
}

/**
 * Parse centre connection to get inner and outer centre names
 * Format: "G to Throat" → { inner: "G", outer: "Throat" }
 */
function parseCentreConnection(centerConnection, innerGate, gate1) {
  const parts = centerConnection.split(' to ');
  if (parts.length !== 2) return { inner: '', outer: '' };

  // If innerGate is gate1, first centre is inner; otherwise swap
  if (innerGate === gate1) {
    return { inner: abbreviateCentre(parts[0]), outer: abbreviateCentre(parts[1]) };
  } else {
    return { inner: abbreviateCentre(parts[1]), outer: abbreviateCentre(parts[0]) };
  }
}

/**
 * Generate SVG for a single channel entry at a gate position
 *
 * Each channel entry includes (from innermost to outermost):
 * 1. Inner centre name - at innerCentre radius
 * 2. Channel name + keynote - at channelName radius
 * 3. Energy type + circuit - at energyType radius
 * 4. Outer centre name - at outerCentre radius
 * 5. Outer gate number - at outerGateNumber radius
 *
 * Note: Inner gate number uses path elements in the master (ornate fonts),
 * so we skip that for now and just place the text elements.
 *
 * @param {Object} channel - Channel data
 * @param {number} gatePosition - The inner gate number (determines wheel position)
 * @param {number} channelCount - Total number of channels at this gate (1 or 3)
 * @param {number} channelIndex - Index of this channel within the gate (0, 1, or 2 for multi)
 */
function generateChannelElement(channel, gatePosition, channelCount = 1, channelIndex = 0) {
  const v3Data = positioning.getDockingData(gatePosition, 1);
  const baseAngle = v3Data.angle;

  // Check if this gate is on the left side (needs text flip)
  const baseSvgAngle = calculateSVGAngle(baseAngle);
  const gateIsFlipped = isFlipped(baseSvgAngle);

  const name = channel.knowledge.name;
  const keynote = channel.knowledge.keynote;
  const energyType = channel.channelType;
  const circuit = channel.knowledge.circuit;
  const innerGate = channel.innerGate;
  const outerGate = channel.outerGate;

  // Parse centre connection
  const centres = parseCentreConnection(
    channel.knowledge.centerConnection,
    innerGate,
    channel.gate1
  );

  // Select font sizes and radii based on channel count and position
  // Single-channel gates get full-size fonts and tighter radii (closer to center)
  // Multi-channel gates get compressed fonts and spread-out radii
  // Middle channel (index 1) in multi-channel gates gets 15% larger fonts
  let fonts;
  if (channelCount === 1) {
    fonts = FONT.single;
  } else if (channelIndex === 1) {
    fonts = FONT.multiMiddle;  // Middle channel is 15% larger
  } else {
    fonts = FONT.multi;
  }
  const radii = channelCount === 1 ? BAND_RADII_SINGLE : BAND_RADII_MULTI;

  // Calculate the channel's sub-angle within the gate segment
  // For single-channel gates: no sub-offset needed
  // For multi-channel gates: each channel gets 1/3 of the 5.625° segment
  // channelIndex 0 = most clockwise (positive offset)
  // channelIndex 1 = center
  // channelIndex 2 = most counter-clockwise (negative offset)
  let channelSubAngle = 0;
  if (channelCount > 1) {
    const subSegmentAngle = 5.625 / 3;  // 1.875° per channel
    // Map index to angular offset: 0 -> +1.875°, 1 -> 0°, 2 -> -1.875°
    channelSubAngle = (1 - channelIndex) * subSegmentAngle;
  }
  const channelAngle = baseAngle + channelSubAngle;

  // Calculate scaled angular offsets based on how many channels share this gate
  // Single-channel gates get full offsets, multi-channel gates compress them
  // Note: Inner centre is generated separately (once per gate, at gate center)
  // For multi-channel: outer gate number and hexagram are centered (0 offset)
  //
  // IMPORTANT: When text is flipped (left side of wheel), angular offsets
  // must be NEGATED to maintain the same visual positioning
  const flipMultiplier = gateIsFlipped ? -1 : 1;
  const offsets = {
    channelName: (channelCount > 1 ? 0.24 : BASE_ANGLE_OFFSETS.channelName) * flipMultiplier,
    keynote: (channelCount > 1 ? -0.18 : BASE_ANGLE_OFFSETS.keynote) * flipMultiplier,
    energyType: getScaledOffset(BASE_ANGLE_OFFSETS.energyType, channelCount) * flipMultiplier,
    circuit: getScaledOffset(BASE_ANGLE_OFFSETS.circuit, channelCount) * flipMultiplier,
    outerCentre: getScaledOffset(BASE_ANGLE_OFFSETS.outerCentre, channelCount) * flipMultiplier,
    // For multi-channel gates, center the number and hexagram in each sub-segment
    outerGateNumber: (channelCount > 1 ? 0 : BASE_ANGLE_OFFSETS.outerGateNumber) * flipMultiplier,
    outerHexagram: (channelCount > 1 ? 0 : BASE_ANGLE_OFFSETS.outerHexagram) * flipMultiplier
  };

  // Calculate positions for each text element
  // Each element uses the channel's sub-angle plus its own offset
  // Note: Inner centre is generated separately (once per gate) in generateInnerCentres()
  const channelNamePos = calculatePosition(channelAngle + offsets.channelName, radii.channelName);
  const keynotePos = calculatePosition(channelAngle + offsets.keynote, radii.keynote);
  const energyTypePos = calculatePosition(channelAngle + offsets.energyType, radii.energyType);
  const circuitPos = calculatePosition(channelAngle + offsets.circuit, radii.circuit);
  const outerCentrePos = calculatePosition(channelAngle + offsets.outerCentre, radii.outerCentre);
  const outerGatePos = calculatePosition(channelAngle + offsets.outerGateNumber, radii.outerGateNumber);
  const outerHexagramPos = calculatePosition(channelAngle + offsets.outerHexagram, radii.outerHexagram);

  // Calculate rotations for each element (based on their angle)
  // Radial elements (channel name, keynote, energy type, circuit) - FLIP on left side
  const channelNameRot = calculateRadialRotation(calculateSVGAngle(channelAngle + offsets.channelName));
  const keynoteRot = calculateRadialRotation(calculateSVGAngle(channelAngle + offsets.keynote));
  const energyTypeRot = calculateRadialRotation(calculateSVGAngle(channelAngle + offsets.energyType));
  const circuitRot = calculateRadialRotation(calculateSVGAngle(channelAngle + offsets.circuit));
  // Tangential elements (centres, gate numbers, hexagrams) - NO flip needed, they read fine either way
  const outerCentreRot = calculateTangentialRotation(calculateSVGAngle(channelAngle + offsets.outerCentre));
  const outerGateRot = calculateTangentialRotation(calculateSVGAngle(channelAngle + offsets.outerGateNumber));
  const outerHexagramRot = calculateTangentialRotation(calculateSVGAngle(channelAngle + offsets.outerHexagram));

  // Helper to flip text anchors when on left side of wheel
  // When text is rotated 180°, "end" visually becomes "start" and vice versa
  const flipAnchor = (anchor) => {
    if (!gateIsFlipped) return anchor;
    if (anchor === 'start') return 'end';
    if (anchor === 'end') return 'start';
    return anchor;  // 'middle' stays 'middle'
  };

  // For multi-channel gates, generate stacked energy type + circuit
  let energyCircuitSVG;
  if (channelCount > 1) {
    // Stacked vertically like in the master SVG
    const stackPos = calculatePosition(channelAngle, radii.energyType);
    const stackRot = calculateRadialRotation(calculateSVGAngle(channelAngle));
    const lineSpacing = fonts.energyType.size * 1.2;  // Line spacing
    // Anchor flips when text is flipped
    const stackAnchor = flipAnchor('start');

    energyCircuitSVG = `<!-- Energy Type + Circuit (stacked, radial) -->
      <g id="ENERGY-CIRCUIT_-_${innerGate}_${outerGate}"
         transform="translate(${stackPos.x.toFixed(4)} ${stackPos.y.toFixed(4)}) rotate(${stackRot.toFixed(4)})">
        <text font-size="${fonts.energyType.size}"
           font-family="${FONT.family}"
           text-anchor="${stackAnchor}"
           dominant-baseline="central"
           fill="${COLORS.foreground}"
           y="${(-lineSpacing / 2).toFixed(1)}">${energyType}</text>
        <text font-size="${fonts.circuit.size}"
           font-family="${FONT.family}"
           text-anchor="${stackAnchor}"
           dominant-baseline="central"
           fill="${COLORS.foreground}"
           y="${(lineSpacing / 2).toFixed(1)}">${formatCircuit(circuit)}</text>
      </g>`;
  } else {
    // Single channel: separate energy type and circuit
    // Circuit uses "end" anchor which flips to "start" on left side
    const circuitAnchor = flipAnchor('end');
    energyCircuitSVG = `<!-- Energy Type (radial) -->
      <text id="ENERGY-TYPE_-_${energyType}_-_${innerGate}_${outerGate}"
         transform="translate(${energyTypePos.x.toFixed(4)} ${energyTypePos.y.toFixed(4)}) rotate(${energyTypeRot.toFixed(4)})"
         font-size="${fonts.energyType.size}"
         font-family="${FONT.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${energyType}</text>
      <!-- Circuit (radial) -->
      <text id="CIRCUIT_-_${formatCircuit(circuit).replace(/\s+/g, '_')}_-_${innerGate}_${outerGate}"
         transform="translate(${circuitPos.x.toFixed(4)} ${circuitPos.y.toFixed(4)}) rotate(${circuitRot.toFixed(4)})"
         font-size="${fonts.circuit.size}"
         font-family="${FONT.family}"
         text-anchor="${circuitAnchor}"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${formatCircuit(circuit)}</text>`;
  }

  // For multi-channel gates, use right-aligned text (text-anchor="end")
  // These flip to "start" on the left side of the wheel
  const channelNameAnchor = flipAnchor(channelCount > 1 ? 'end' : 'middle');
  const keynoteAnchor = flipAnchor(channelCount > 1 ? 'end' : 'middle');

  // Build the complete channel group with all text elements
  // Each element uses its own calculated position and rotation
  // Note: Inner centre is generated separately (once per gate) in generateInnerCentres()
  return `    <g id="CHANNEL_-_${name.replace(/\s+/g, '_').toUpperCase()}_-_${innerGate}_${outerGate}"
       data-channel="${channel.channelNumber}"
       data-inner-gate="${innerGate}"
       data-outer-gate="${outerGate}"
       data-channel-type="${energyType}"
       data-channel-count="${channelCount}"
       data-channel-index="${channelIndex}">
      <!-- Channel Name (radial) -->
      <text id="CHANNEL-NAME_-_${name.replace(/\s+/g, '_')}_-_${innerGate}_${outerGate}"
         transform="translate(${channelNamePos.x.toFixed(4)} ${channelNamePos.y.toFixed(4)}) rotate(${channelNameRot.toFixed(4)})"
         font-size="${fonts.channelName.size}"
         font-family="${FONT.family}"
         text-anchor="${channelNameAnchor}"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${name}</text>
      <!-- Keynote (radial, separate element, may wrap to multiple lines) -->
      <text id="KEYNOTE_-_${keynote.replace(/\s+/g, '_')}_-_${innerGate}_${outerGate}"
         transform="translate(${keynotePos.x.toFixed(4)} ${keynotePos.y.toFixed(4)}) rotate(${keynoteRot.toFixed(4)})"
         font-size="${fonts.keynote.size}"
         font-family="${FONT.family}"
         text-anchor="${keynoteAnchor}"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${formatKeynote(keynote, fonts.keynote.size)}</text>
      ${energyCircuitSVG}
      <!-- Outer Centre (tangential) -->
      <text id="OUTER-CENTRE_-_${centres.outer.toUpperCase()}_-_${outerGate}"
         transform="translate(${outerCentrePos.x.toFixed(4)} ${outerCentrePos.y.toFixed(4)}) rotate(${outerCentreRot.toFixed(4)})"
         font-size="${fonts.outerCentre.size}"
         font-family="${FONT.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${centres.outer}</text>
      <!-- Outer Gate Number (tangential) -->
      <text id="OUTER-GATE-NUMBER_-_${outerGate}"
         transform="translate(${outerGatePos.x.toFixed(4)} ${outerGatePos.y.toFixed(4)}) rotate(${outerGateRot.toFixed(4)})"
         font-size="${fonts.outerGate.size}"
         font-family="${fonts.outerGate.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${outerGate}</text>
      ${generateOuterHexagram(outerGate, outerHexagramPos, outerHexagramRot, channelCount > 1, channelIndex)}
    </g>`;
}

/**
 * Generate ring circles
 * Creates 4 concentric rings:
 * - Inner ring (4505) - inner boundary for gate numbers
 * - Outer ring (4827) - outer boundary for gate numbers
 * - Outer ring 1 (6159) - inner edge of outer number band
 * - Outer ring 2 (6481) - outermost boundary
 */
function generateRingCircles(stroke, strokeWidth) {
  return `    <circle id="RING_-_INNER" cx="${CENTER.x}" cy="${CENTER.y}" r="${RING_RADII.inner}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    <circle id="RING_-_OUTER" cx="${CENTER.x}" cy="${CENTER.y}" r="${RING_RADII.outer}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    <circle id="RING_-_OUTER_1" cx="${CENTER.x}" cy="${CENTER.y}" r="${STRUCTURE_RADII.outerRing1}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    <circle id="RING_-_OUTER_2" cx="${CENTER.x}" cy="${CENTER.y}" r="${STRUCTURE_RADII.outerRing2}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

/**
 * Gates with multiple channels (Integration Circuit)
 * These gates display 3 channels each and need sub-dividers
 */
const MULTI_CHANNEL_GATES = [10, 20, 34, 57];

/**
 * Multi-channel order configurations
 *
 * Each configuration defines how outer gates are arranged at each inner gate position.
 * Order is [CW, Middle, CCW] - clockwise to counter-clockwise within the gate segment.
 *
 * IMPORTANT: Gates 34 and 57 are on the LEFT side of the wheel, so their text is
 * flipped 180°. This causes their visual CW/CCW positions to swap! The data order
 * below accounts for this, so the VISUAL result maintains the Latin square property.
 *
 * Available presets:
 * - 'optimal': Latin square arrangement where each outer gate appears exactly once
 *              in each VISUAL position across all 4 inner gates. Maximum diversity.
 * - 'master': Original arrangement from master SVG analysis.
 */
const MULTI_CHANNEL_PRESETS = {
  // Optimal Latin square accounting for text flipping on gates 34 & 57
  // Gates 10, 20 = NOT flipped (data order = visual order)
  // Gates 34, 57 = FLIPPED (data order is reversed visually)
  //
  // DATA order below:
  //   10: [20, 34, 57]  → visual [20, 34, 57] (no flip)
  //   20: [10, 57, 34]  → visual [10, 57, 34] (no flip)
  //   34: [10, 20, 57]  → visual [57, 20, 10] (flipped!)
  //   57: [20, 10, 34]  → visual [34, 10, 20] (flipped!)
  //
  // VISUAL position analysis (what user sees):
  //   CW:     20, 10, 57, 34 (all unique)
  //   Middle: 34, 57, 20, 10 (all unique)
  //   CCW:    57, 34, 10, 20 (all unique)
  optimal: {
    10: [20, 34, 57],  // No flip - Channels: 10-20, 10-34, 10-57
    20: [10, 57, 34],  // No flip - Channels: 20-10, 20-57, 20-34
    34: [10, 20, 57],  // FLIPPED - Channels: 34-10, 34-20, 34-57 → visual [57, 20, 10]
    57: [20, 10, 34]   // FLIPPED - Channels: 57-20, 57-10, 57-34 → visual [34, 10, 20]
  },

  // Original master SVG arrangement (before text flipping was implemented)
  master: {
    10: [57, 34, 20],  // Channels: 10-57, 10-34, 10-20
    20: [34, 57, 10],  // Channels: 20-34, 20-57, 20-10
    34: [57, 10, 20],  // Channels: 34-57, 34-10, 34-20
    57: [34, 20, 10]   // Channels: 57-34, 57-20, 57-10
  }
};

/**
 * Current multi-channel order configuration
 * Change this to switch between presets, or define a custom arrangement
 */
const MULTI_CHANNEL_ORDER = MULTI_CHANNEL_PRESETS.optimal;

/**
 * Generate sub-divider lines within multi-channel gates
 * Each multi-channel gate (10, 20, 34, 57) is divided into 3 sub-segments
 * These lines extend from ring 2 (outer) to ring 3 (bottomOuter)
 * Named by the channel pair they separate (e.g., "_20-34" separates 20-34 from 20-57)
 */
function generateChannelSubDividers(stroke, strokeWidth) {
  let dividers = '';

  for (const gate of MULTI_CHANNEL_GATES) {
    const v3Data = positioning.getDockingData(gate, 1);
    const baseAngle = v3Data.angle;

    // Gate segment is 5.625°, divided into 3 sub-segments of 1.875° each
    // Sub-dividers are at +/- 1.875° from gate center (1/3 and 2/3 of the way)
    const subSegmentAngle = 5.625 / 3;  // 1.875°

    // Get the channel order for this gate
    const channelOrder = MULTI_CHANNEL_ORDER[gate];

    // Generate 2 sub-dividers per gate (between channels 1-2 and 2-3)
    // First divider: between channel 1 (most CW) and channel 2 (middle)
    const divider1Angle = baseAngle + subSegmentAngle / 2;  // +0.9375° from center
    // Second divider: between channel 2 (middle) and channel 3 (most CCW)
    const divider2Angle = baseAngle - subSegmentAngle / 2;  // -0.9375° from center

    for (let i = 0; i < 2; i++) {
      const dividerAngle = i === 0 ? divider1Angle : divider2Angle;
      const svgAngle = calculateSVGAngle(dividerAngle);
      const radians = svgAngle * Math.PI / 180;

      // Sub-dividers extend from after inner centre (with 60px padding) to outer boundary
      // Inner centre is at 4768, so start at 4768 + 60 = 4828
      const subDividerInnerRadius = BAND_RADII_MULTI.innerCentre + 60;
      const x1 = CENTER.x + subDividerInnerRadius * Math.cos(radians);
      const y1 = CENTER.y + subDividerInnerRadius * Math.sin(radians);
      const x2 = CENTER.x + STRUCTURE_RADII.dividerOuter * Math.cos(radians);
      const y2 = CENTER.y + STRUCTURE_RADII.dividerOuter * Math.sin(radians);

      // Name based on channel pair: outer gates of channels being separated
      const ch1OuterGate = channelOrder[i];
      const ch2OuterGate = channelOrder[i + 1];

      dividers += `    <line id="LINE_-_${gate}-${ch1OuterGate}_${gate}-${ch2OuterGate}"
           data-gate="${gate}"
           data-separates="${gate}-${ch1OuterGate} and ${gate}-${ch2OuterGate}"
           x1="${x1.toFixed(4)}" y1="${y1.toFixed(4)}" x2="${x2.toFixed(4)}" y2="${y2.toFixed(4)}"
           stroke="${stroke}" stroke-width="${strokeWidth}"/>\n`;
    }
  }

  return dividers;
}

/**
 * Generate divider lines between adjacent gates (64 lines)
 * Named LINE_-_GATE1_GATE2 following master SVG convention
 * Each line is at the boundary between two adjacent gates
 *
 * Lines extend from STRUCTURE_RADII.dividerInner (~4897px) to
 * STRUCTURE_RADII.dividerOuter (~6483px), spanning all text content bands.
 */
function generateDividers(stroke, strokeWidth) {
  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
  let dividers = '';

  for (let i = 0; i < gateSequence.length; i++) {
    const currentGate = gateSequence[i];
    const nextGate = gateSequence[(i + 1) % 64];

    const currentV3 = positioning.getDockingData(currentGate, 1);

    // Boundary angle is midway between current gate center and next gate center
    // Since gates are 5.625° apart, boundary is at current + 2.8125°
    const boundaryAngle = currentV3.angle + 2.8125;
    const svgAngle = calculateSVGAngle(boundaryAngle);
    const radians = svgAngle * Math.PI / 180;

    // Line extends from inner text area to outer boundary
    // Using STRUCTURE_RADII for full-span dividers (matching master)
    const x1 = CENTER.x + STRUCTURE_RADII.dividerOuter * Math.cos(radians);
    const y1 = CENTER.y + STRUCTURE_RADII.dividerOuter * Math.sin(radians);
    const x2 = CENTER.x + STRUCTURE_RADII.dividerInner * Math.cos(radians);
    const y2 = CENTER.y + STRUCTURE_RADII.dividerInner * Math.sin(radians);

    dividers += `    <line id="LINE_-_${currentGate}_${nextGate}" x1="${x1.toFixed(4)}" y1="${y1.toFixed(4)}" x2="${x2.toFixed(4)}" y2="${y2.toFixed(4)}" stroke="${stroke}" stroke-width="${strokeWidth}"/>\n`;
  }

  return dividers;
}

/**
 * Generate inner gate numbers and hexagrams (64 of each around the inner ring)
 * These appear inside the ring, using Herculanum font for numbers
 * Font size varies based on channel count (single vs multi-channel gates)
 * Hexagrams are positioned on the opposite side of the number from center
 */
function generateInnerGateNumbers(fill) {
  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
  const INNER_NUMBER_RADIUS = 4574;   // Numbers - slightly outward
  const INNER_HEXAGRAM_RADIUS = 4570; // Hexagrams - original position

  // Angular offset for hexagram (opposite side from number within gate segment)
  // Positive offset = clockwise, negative = counter-clockwise
  const INNER_HEXAGRAM_OFFSET = -1.5;  // Counter-clockwise from gate center
  const INNER_NUMBER_OFFSET = 1.0;      // Clockwise from gate center

  let numbers = '';

  for (const gate of gateSequence) {
    const channels = getChannelsForGate(gate);
    const channelCount = channels.length;
    const fonts = channelCount === 1 ? FONT.single : FONT.multi;

    const v3Data = positioning.getDockingData(gate, 1);
    const baseAngle = v3Data.angle;

    // Check if gate is on left side (text flipped)
    const baseSvgAngle = calculateSVGAngle(baseAngle);
    const gateIsFlipped = isFlipped(baseSvgAngle);
    const flipMultiplier = gateIsFlipped ? -1 : 1;

    // Calculate number position (offset clockwise from center)
    const numberAngle = baseAngle + (INNER_NUMBER_OFFSET * flipMultiplier);
    const numberSvgAngle = calculateSVGAngle(numberAngle);
    const numberRadians = numberSvgAngle * Math.PI / 180;
    const numberX = CENTER.x + INNER_NUMBER_RADIUS * Math.cos(numberRadians);
    const numberY = CENTER.y + INNER_NUMBER_RADIUS * Math.sin(numberRadians);
    const numberRotation = numberSvgAngle + 90;

    numbers += `    <text id="INNER-GATE-NUMBER_-_${gate}"
         transform="translate(${numberX.toFixed(4)} ${numberY.toFixed(4)}) rotate(${numberRotation.toFixed(4)})"
         font-size="${fonts.innerGate.size}"
         font-family="${fonts.innerGate.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${fill}">${gate}</text>\n`;

    // Calculate hexagram position (offset counter-clockwise from center)
    const hexAngle = baseAngle + (INNER_HEXAGRAM_OFFSET * flipMultiplier);
    const hexSvgAngle = calculateSVGAngle(hexAngle);
    const hexRadians = hexSvgAngle * Math.PI / 180;
    const hexX = CENTER.x + INNER_HEXAGRAM_RADIUS * Math.cos(hexRadians);
    const hexY = CENTER.y + INNER_HEXAGRAM_RADIUS * Math.sin(hexRadians);
    // Tangential rotation for hexagram (same as outer hexagrams)
    const hexRotation = calculateTangentialRotation(hexSvgAngle);

    const hexPos = { x: hexX, y: hexY };
    numbers += `    ${generateInnerHexagram(gate, hexPos, hexRotation)}\n`;
  }

  return numbers;
}

/**
 * Generate inner centre names (one per gate, at gate center)
 * This ensures multi-channel gates only have one inner centre text
 * positioned at the gate center, not multiple overlapping ones.
 */
function generateInnerCentres(fill) {
  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
  let centres = '';

  for (const gate of gateSequence) {
    const channels = getChannelsForGate(gate);
    if (channels.length === 0) continue;

    // Get the first channel to determine the centre name
    const channel = channels[0];
    const innerGate = gate;

    // Parse centre connection to get inner centre name
    const centreConnection = channel.knowledge.centerConnection;
    const parts = centreConnection.split(' to ');
    if (parts.length !== 2) continue;

    // If innerGate is gate1, first centre is inner; otherwise second centre
    const innerCentre = (innerGate === channel.gate1)
      ? abbreviateCentre(parts[0])
      : abbreviateCentre(parts[1]);

    // Select font size and radius based on channel count
    const channelCount = channels.length;
    const fonts = channelCount === 1 ? FONT.single : FONT.multi;
    const radii = channelCount === 1 ? BAND_RADII_SINGLE : BAND_RADII_MULTI;

    // Position at gate center (no angular offset for inner centres)
    const v3Data = positioning.getDockingData(gate, 1);
    const baseAngle = v3Data.angle;
    const pos = calculatePosition(baseAngle, radii.innerCentre);
    const rotation = calculateTangentialRotation(calculateSVGAngle(baseAngle));

    centres += `    <text id="INNER-CENTRE_-_${innerCentre.toUpperCase()}_-_${gate}"
         transform="translate(${pos.x.toFixed(4)} ${pos.y.toFixed(4)}) rotate(${rotation.toFixed(4)})"
         font-size="${fonts.innerCentre.size}"
         font-family="${FONT.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${fill}">${innerCentre}</text>\n`;
  }

  return centres;
}

/**
 * Generate the complete channels ring SVG
 */
function generateChannelsRing(options = {}) {
  const {
    includeStructure = true,
    includeBackground = true,
    stroke = COLORS.foreground,
    fill = COLORS.foreground,
    backgroundColor = COLORS.background,
    strokeWidth = 3
  } = options;

  const viewBoxSize = CENTER.x * 2;

  let svg = `<svg id="36_CHANNELS_RING" xmlns="http://www.w3.org/2000/svg"
     width="${viewBoxSize.toFixed(4)}"
     height="${viewBoxSize.toFixed(4)}"
     viewBox="0 0 ${viewBoxSize.toFixed(4)} ${viewBoxSize.toFixed(4)}">
`;

  // Background
  if (includeBackground) {
    svg += `  <rect id="background" width="100%" height="100%" fill="${backgroundColor}"/>\n`;
  }

  // Structure (ring circles, dividers, and inner gate numbers)
  if (includeStructure) {
    svg += `  <g id="GROUP_-_STRUCTURE">\n`;
    svg += `    <g id="GROUP_-_RINGS">\n`;
    svg += generateRingCircles(stroke, strokeWidth) + '\n';
    svg += `    </g>\n`;
    svg += `    <g id="GROUP_-_DIVIDERS">\n`;
    svg += generateDividers(stroke, 1);
    svg += `    </g>\n`;
    svg += `    <g id="GROUP_-_CHANNEL-SUB-DIVIDERS">\n`;
    svg += generateChannelSubDividers(stroke, 1);
    svg += `    </g>\n`;
    svg += `    <g id="GROUP_-_INNER-GATE-NUMBERS">\n`;
    svg += generateInnerGateNumbers(fill);
    svg += `    </g>\n`;
    svg += `    <g id="GROUP_-_INNER-CENTRES">\n`;
    svg += generateInnerCentres(fill);
    svg += `    </g>\n`;
    svg += `  </g>\n`;
  }

  // Generate channel entries for each gate position
  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;

  svg += `  <g id="GROUP_-_CHANNELS" fill="${fill}">\n`;

  for (const gate of gateSequence) {
    const channels = getChannelsForGate(gate);
    const channelCount = channels.length;

    // For multi-channel gates, order channels according to MULTI_CHANNEL_ORDER
    // For single-channel gates, just use the channel as-is
    if (channelCount > 1 && MULTI_CHANNEL_ORDER[gate]) {
      const order = MULTI_CHANNEL_ORDER[gate];
      // Sort channels by their position in the order array
      const orderedChannels = [...channels].sort((a, b) => {
        const aIndex = order.indexOf(a.outerGate);
        const bIndex = order.indexOf(b.outerGate);
        return aIndex - bIndex;
      });
      for (let i = 0; i < orderedChannels.length; i++) {
        svg += generateChannelElement(orderedChannels[i], gate, channelCount, i) + '\n';
      }
    } else {
      for (const channel of channels) {
        svg += generateChannelElement(channel, gate, channelCount, 0) + '\n';
      }
    }
  }

  svg += `  </g>\n`;

  svg += `</svg>`;

  return svg;
}

/**
 * Get statistics about channel distribution
 */
function getStatistics() {
  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
  let totalEntries = 0;
  const entriesPerGate = {};

  for (const gate of gateSequence) {
    const channels = getChannelsForGate(gate);
    entriesPerGate[gate] = channels.length;
    totalEntries += channels.length;
  }

  return {
    totalChannels: channelsData.totalChannels,
    totalEntries,
    entriesPerGate,
    avgEntriesPerGate: totalEntries / 64
  };
}

// Export
module.exports = {
  CENTER,
  RING_RADII,
  STRUCTURE_RADII,
  BAND_RADII,
  BAND_RADII_SINGLE,
  BAND_RADII_MULTI,
  BASE_ANGLE_OFFSETS,
  MULTI_CHANNEL_GATES,
  MULTI_CHANNEL_PRESETS,
  MULTI_CHANNEL_ORDER,
  FONT,
  COLORS,
  channelsData,
  calculateSVGAngle,
  calculateRadialRotation,
  calculateTangentialRotation,
  calculatePosition,
  getScaledOffset,
  parseCentreConnection,
  getChannelsForGate,
  generateChannelElement,
  generateChannelSubDividers,
  generateChannelsRing,
  getStatistics
};

// CLI: node channels-ring.js [output.svg]
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const output = process.argv[2] || path.join(__dirname, '../output/generated-channels-ring.svg');

  console.log('Generating channels ring...');
  const svg = generateChannelsRing();

  fs.writeFileSync(output, svg);
  console.log('Written to:', output);

  const stats = getStatistics();
  console.log('Total channels:', stats.totalChannels);
  console.log('Total entries:', stats.totalEntries);
  console.log('Avg entries per gate:', stats.avgEntriesPerGate.toFixed(2));
}
