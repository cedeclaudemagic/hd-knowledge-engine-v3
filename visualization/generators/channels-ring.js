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

// Load channel mappings
const channelsData = require('../../knowledge-systems/channels/mappings/channels-mappings.json');

// Ring geometry (extracted from verified master: the-36-channels-verified-master-mini-sizes.svg)
const CENTER = { x: 6482.5278, y: 6486.1582 };

// Ring radii from master (verified from the-36-channels-verified-master-mini-sizes.svg)
const RING_RADII = {
  inner: 4504.9828,       // Inner ring (structure)
  outer: 4826.9585,       // Outer ring (structure)
  bottomOuter: 6159.3379, // Outer band inner edge
  bottom: 6481.1808       // Outermost boundary
};

// Text band radii (measured from master SVG GROUP_-_THE_CHANNEL_OF_RECOGNITION_-_41_30)
// These are the distances from CENTER to each text element
const BAND_RADII = {
  innerCentre: 4908,      // Root at radius 4908px
  channelName: 5881,      // Recognition at radius 5881px
  keynote: 5775,          // Focused Energy at radius 5775px
  energyType: 5990,       // Projected at radius 5990px
  circuit: 5309,          // Sensing at radius 5309px
  outerCentre: 6056,      // SP at radius 6056px
  outerGateNumber: 6330   // 30 at radius 6330px
};

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
  outerCentre: 0.69,      // SVG -127.26° = slightly clockwise
  outerGateNumber: 2.06   // SVG -128.62° = clockwise
};

// Helper to get scaled offset based on channel count at this gate
function getScaledOffset(baseOffset, channelCount) {
  // Single channel gets full offset, more channels compress the offsets
  return baseOffset / channelCount;
}

// Font specifications (from master analysis)
const FONT = {
  family: 'Copperplate',
  channelName: {
    size: 86.4,
    weight: 400
  },
  keynote: {
    size: 38.4,
    weight: 400
  },
  innerGate: {
    family: 'Herculanum',
    size: 144,
    weight: 400
  },
  outerGate: {
    family: 'Herculanum',
    size: 144,
    weight: 400
  },
  center: {
    size: 51.2,
    weight: 400
  },
  energyType: {
    size: 48,
    weight: 400
  }
};

// Use shared color scheme
const COLORS = shared.COLORS;

/**
 * Calculate SVG position angle from V3 angle
 */
function calculateSVGAngle(v3Angle) {
  return shared.calculateSVGAngle(v3Angle);
}

/**
 * Calculate radial text rotation (reading outward from center)
 * Used for: channel name, keynote, energy type, circuit
 * Formula: svgAngle + 180 (verified against master)
 *
 * At gate 10: svgAngle = -92.8125, radial = 87.1875 (matches master 87.7551)
 */
function calculateRadialRotation(svgAngle) {
  let rotation = svgAngle + 180;
  // Normalize to -180 to 180
  while (rotation > 180) rotation -= 360;
  while (rotation < -180) rotation += 360;
  return rotation;
}

/**
 * Calculate tangential text rotation (reading along the arc)
 * Used for: centre names, gate numbers
 * Formula: svgAngle + 90 (verified against master)
 *
 * At gate 10: svgAngle = -92.8125, tangential = -2.8125 (matches master -2.8)
 */
function calculateTangentialRotation(svgAngle) {
  let rotation = svgAngle + 90;
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
 * Parse centre connection to get inner and outer centre names
 * Format: "G to Throat" → { inner: "G", outer: "Throat" }
 */
function parseCentreConnection(centerConnection, innerGate, gate1) {
  const parts = centerConnection.split(' to ');
  if (parts.length !== 2) return { inner: '', outer: '' };

  // If innerGate is gate1, first centre is inner; otherwise swap
  if (innerGate === gate1) {
    return { inner: parts[0], outer: parts[1] };
  } else {
    return { inner: parts[1], outer: parts[0] };
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
 */
function generateChannelElement(channel, gatePosition, channelCount = 1) {
  const v3Data = positioning.getDockingData(gatePosition, 1);
  const baseAngle = v3Data.angle;

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

  // Calculate scaled angular offsets based on how many channels share this gate
  // Single-channel gates get full offsets, multi-channel gates compress them
  const offsets = {
    innerCentre: getScaledOffset(BASE_ANGLE_OFFSETS.innerCentre, channelCount),
    channelName: getScaledOffset(BASE_ANGLE_OFFSETS.channelName, channelCount),
    keynote: getScaledOffset(BASE_ANGLE_OFFSETS.keynote, channelCount),
    energyType: getScaledOffset(BASE_ANGLE_OFFSETS.energyType, channelCount),
    circuit: getScaledOffset(BASE_ANGLE_OFFSETS.circuit, channelCount),
    outerCentre: getScaledOffset(BASE_ANGLE_OFFSETS.outerCentre, channelCount),
    outerGateNumber: getScaledOffset(BASE_ANGLE_OFFSETS.outerGateNumber, channelCount)
  };

  // Calculate positions for each text element
  // Each element has its own radius AND scaled angular offset within the gate segment
  const innerCentrePos = calculatePosition(baseAngle + offsets.innerCentre, BAND_RADII.innerCentre);
  const channelNamePos = calculatePosition(baseAngle + offsets.channelName, BAND_RADII.channelName);
  const keynotePos = calculatePosition(baseAngle + offsets.keynote, BAND_RADII.keynote);
  const energyTypePos = calculatePosition(baseAngle + offsets.energyType, BAND_RADII.energyType);
  const circuitPos = calculatePosition(baseAngle + offsets.circuit, BAND_RADII.circuit);
  const outerCentrePos = calculatePosition(baseAngle + offsets.outerCentre, BAND_RADII.outerCentre);
  const outerGatePos = calculatePosition(baseAngle + offsets.outerGateNumber, BAND_RADII.outerGateNumber);

  // Calculate rotations for each element (based on their offset angle)
  const innerCentreRot = calculateTangentialRotation(calculateSVGAngle(baseAngle + offsets.innerCentre));
  const channelNameRot = calculateRadialRotation(calculateSVGAngle(baseAngle + offsets.channelName));
  const keynoteRot = calculateRadialRotation(calculateSVGAngle(baseAngle + offsets.keynote));
  const energyTypeRot = calculateRadialRotation(calculateSVGAngle(baseAngle + offsets.energyType));
  const circuitRot = calculateRadialRotation(calculateSVGAngle(baseAngle + offsets.circuit));
  const outerCentreRot = calculateTangentialRotation(calculateSVGAngle(baseAngle + offsets.outerCentre));
  const outerGateRot = calculateTangentialRotation(calculateSVGAngle(baseAngle + offsets.outerGateNumber));

  // Build the complete channel group with all text elements
  // Each element uses its own calculated position and rotation
  return `    <g id="CHANNEL_-_${name.replace(/\s+/g, '_').toUpperCase()}_-_${innerGate}_${outerGate}"
       data-channel="${channel.channelNumber}"
       data-inner-gate="${innerGate}"
       data-outer-gate="${outerGate}"
       data-channel-type="${energyType}">
      <!-- Inner Centre (tangential) -->
      <text id="INNER-CENTRE_-_${centres.inner.toUpperCase()}_-_${innerGate}"
         transform="translate(${innerCentrePos.x.toFixed(4)} ${innerCentrePos.y.toFixed(4)}) rotate(${innerCentreRot.toFixed(4)})"
         font-size="${FONT.center.size * 2}"
         font-family="${FONT.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${centres.inner}</text>
      <!-- Channel Name (radial) -->
      <text id="CHANNEL-NAME_-_${name.replace(/\s+/g, '_')}_-_${innerGate}_${outerGate}"
         transform="translate(${channelNamePos.x.toFixed(4)} ${channelNamePos.y.toFixed(4)}) rotate(${channelNameRot.toFixed(4)})"
         font-size="${FONT.channelName.size}"
         font-family="${FONT.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${name}</text>
      <!-- Keynote (radial, separate element) -->
      <text id="KEYNOTE_-_${keynote.replace(/\s+/g, '_')}_-_${innerGate}_${outerGate}"
         transform="translate(${keynotePos.x.toFixed(4)} ${keynotePos.y.toFixed(4)}) rotate(${keynoteRot.toFixed(4)})"
         font-size="${FONT.keynote.size}"
         font-family="${FONT.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${keynote}</text>
      <!-- Energy Type (radial) -->
      <text id="ENERGY-TYPE_-_${energyType}_-_${innerGate}_${outerGate}"
         transform="translate(${energyTypePos.x.toFixed(4)} ${energyTypePos.y.toFixed(4)}) rotate(${energyTypeRot.toFixed(4)})"
         font-size="${FONT.energyType.size}"
         font-family="${FONT.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${energyType}</text>
      <!-- Circuit (radial, separate element) -->
      <text id="CIRCUIT_-_${circuit.replace(/\s+/g, '_')}_-_${innerGate}_${outerGate}"
         transform="translate(${circuitPos.x.toFixed(4)} ${circuitPos.y.toFixed(4)}) rotate(${circuitRot.toFixed(4)})"
         font-size="${FONT.energyType.size}"
         font-family="${FONT.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${circuit}</text>
      <!-- Outer Centre (tangential) -->
      <text id="OUTER-CENTRE_-_${centres.outer.toUpperCase()}_-_${outerGate}"
         transform="translate(${outerCentrePos.x.toFixed(4)} ${outerCentrePos.y.toFixed(4)}) rotate(${outerCentreRot.toFixed(4)})"
         font-size="${FONT.center.size}"
         font-family="${FONT.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${centres.outer}</text>
      <!-- Outer Gate Number (tangential) -->
      <text id="OUTER-GATE-NUMBER_-_${outerGate}"
         transform="translate(${outerGatePos.x.toFixed(4)} ${outerGatePos.y.toFixed(4)}) rotate(${outerGateRot.toFixed(4)})"
         font-size="${FONT.outerGate.size}"
         font-family="${FONT.outerGate.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${outerGate}</text>
    </g>`;
}

/**
 * Generate ring circles
 */
function generateRingCircles(stroke, strokeWidth) {
  return `    <circle id="RING_-_INNER" cx="${CENTER.x}" cy="${CENTER.y}" r="${RING_RADII.inner}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    <circle id="RING_-_OUTER" cx="${CENTER.x}" cy="${CENTER.y}" r="${RING_RADII.outer}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

/**
 * Generate divider lines for 64 gate segments
 */
function generateDividers(stroke, strokeWidth) {
  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
  let dividers = '';

  for (let i = 0; i < gateSequence.length; i++) {
    const gate = gateSequence[i];
    const v3Data = positioning.getDockingData(gate, 1);
    const angle = v3Data.angle;

    // Divider at start of gate segment (offset by half segment width)
    const dividerAngle = angle - 2.8125; // Half of 5.625 degree segment
    const svgAngle = calculateSVGAngle(dividerAngle);
    const radians = svgAngle * Math.PI / 180;

    // Divider extends from inner to outer ring
    const x1 = CENTER.x + RING_RADII.inner * Math.cos(radians);
    const y1 = CENTER.y + RING_RADII.inner * Math.sin(radians);
    const x2 = CENTER.x + RING_RADII.outer * Math.cos(radians);
    const y2 = CENTER.y + RING_RADII.outer * Math.sin(radians);

    dividers += `    <line id="DIVIDER_-_${gate}" x1="${x1.toFixed(4)}" y1="${y1.toFixed(4)}" x2="${x2.toFixed(4)}" y2="${y2.toFixed(4)}" stroke="${stroke}" stroke-width="${strokeWidth}"/>\n`;
  }

  return dividers;
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

  // Structure (ring circles and dividers)
  if (includeStructure) {
    svg += `  <g id="GROUP_-_STRUCTURE">\n`;
    svg += `    <g id="GROUP_-_RINGS">\n`;
    svg += generateRingCircles(stroke, strokeWidth) + '\n';
    svg += `    </g>\n`;
    svg += `    <g id="GROUP_-_DIVIDERS">\n`;
    svg += generateDividers(stroke, 1);
    svg += `    </g>\n`;
    svg += `  </g>\n`;
  }

  // Generate channel entries for each gate position
  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;

  svg += `  <g id="GROUP_-_CHANNELS" fill="${fill}">\n`;

  for (const gate of gateSequence) {
    const channels = getChannelsForGate(gate);
    const channelCount = channels.length;

    for (const channel of channels) {
      svg += generateChannelElement(channel, gate, channelCount) + '\n';
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
  BAND_RADII,
  BASE_ANGLE_OFFSETS,
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
  generateChannelsRing,
  getStatistics
};

// CLI: node channels-ring.js [output.svg]
if (require.main === module) {
  const fs = require('fs');
  const output = process.argv[2] || 'generated-channels-ring.svg';

  console.log('Generating channels ring...');
  const svg = generateChannelsRing();

  fs.writeFileSync(output, svg);
  console.log('Written to:', output);

  const stats = getStatistics();
  console.log('Total channels:', stats.totalChannels);
  console.log('Total entries:', stats.totalEntries);
  console.log('Avg entries per gate:', stats.avgEntriesPerGate.toFixed(2));
}
