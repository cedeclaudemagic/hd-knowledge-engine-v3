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

// Extended structure radii (from STRUCTURE_CHANNELS_ORIGINAL in master)
// These define the full extent of radial divider lines
const STRUCTURE_RADII = {
  dividerInner: 4505,     // Inner end of radial dividers (inner ring)
  dividerOuter: 6483,     // Outer end of radial dividers (outermost boundary)
  outerRing1: 6159,       // First outer ring (bottomOuter) - inner edge of outer band
  outerRing2: 6481        // Second outer ring (bottom) - outermost boundary
};

// Text band radii - different for single vs multi-channel gates
// Single-channel gates have text elements closer to center
// Multi-channel gates spread elements out more to fit 2-3 channels

// Single-channel radii - centered within rings 2-3 (4827-6159)
// Shifted -152px inward to center content within the zone
const BAND_RADII_SINGLE = {
  innerCentre: 4768,      // Inner centre like "Throat"
  circuit: 4917,          // Circuit - right-aligned, 90px inside ring 2 (4827)
  keynote: 5465,          // Keynote - same radius as channelName for radial centering
  channelName: 5465,      // Channel name - centered between circuit and energyType
  energyType: 5831,       // Energy type like "Projected" - moved 16px inward
  outerCentre: 6095,      // Outer centre like "Ajna" - moved 180px outward total
  outerGateNumber: 6320   // In outer numbers band (6159-6481)
};

// Multi-channel radii (measured from Recognition 41-30, Perfected Form 10-57)
const BAND_RADII_MULTI = {
  innerCentre: 4908,      // Root at radius 4908px
  channelName: 5775,      // Recognition at radius 5775px
  keynote: 5775,          // Keynote same radius (combined in multi)
  energyType: 5990,       // Projected at radius 5990px
  circuit: 5309,          // Sensing at radius 5309px
  outerCentre: 6056,      // SP at radius 6056px
  outerGateNumber: 6330   // 30 at radius 6330px
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
  outerGateNumber: 2.06   // SVG -128.62° = clockwise
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
    channelName: { size: 116.4, weight: 400 },
    keynote: { size: 62, weight: 400 },
    innerGate: { family: 'Herculanum', size: 200, weight: 400 },
    outerGate: { family: 'Herculanum', size: 179, weight: 400 },
    innerCentre: { size: 102, weight: 400 },
    outerCentre: { size: 114, weight: 400 },
    energyType: { size: 85, weight: 400 },   // +18% (was 72)
    circuit: { size: 85, weight: 400 }       // +18% (was 72)
  },
  // Multi-channel gates (2-3 channels, e.g., Integration Circuit) - compressed fonts
  multi: {
    channelName: { size: 86.4, weight: 400 },
    keynote: { size: 38.4, weight: 400 },
    innerGate: { family: 'Herculanum', size: 200, weight: 400 },
    outerGate: { family: 'Herculanum', size: 144, weight: 400 },
    innerCentre: { size: 102.4, weight: 400 },
    outerCentre: { size: 51.2, weight: 400 },
    energyType: { size: 48, weight: 400 },
    circuit: { size: 48, weight: 400 }
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
      extraOffset: 40  // Extra padding from channelName
    }
  };

  let lines;
  let extraOffset = 0;

  if (specialCases[keynote]) {
    const special = specialCases[keynote];
    if (Array.isArray(special)) {
      lines = special;
    } else {
      lines = special.lines;
      extraOffset = special.extraOffset || 0;
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
  const lineHeight = fontSize * 0.85;  // Tighter line height
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

  // Select font sizes and radii based on channel count
  // Single-channel gates get full-size fonts and tighter radii (closer to center)
  // Multi-channel gates get compressed fonts and spread-out radii
  const fonts = channelCount === 1 ? FONT.single : FONT.multi;
  const radii = channelCount === 1 ? BAND_RADII_SINGLE : BAND_RADII_MULTI;

  // Calculate scaled angular offsets based on how many channels share this gate
  // Single-channel gates get full offsets, multi-channel gates compress them
  // Note: Inner centre is generated separately (once per gate, at gate center)
  const offsets = {
    channelName: getScaledOffset(BASE_ANGLE_OFFSETS.channelName, channelCount),
    keynote: getScaledOffset(BASE_ANGLE_OFFSETS.keynote, channelCount),
    energyType: getScaledOffset(BASE_ANGLE_OFFSETS.energyType, channelCount),
    circuit: getScaledOffset(BASE_ANGLE_OFFSETS.circuit, channelCount),
    outerCentre: getScaledOffset(BASE_ANGLE_OFFSETS.outerCentre, channelCount),
    outerGateNumber: getScaledOffset(BASE_ANGLE_OFFSETS.outerGateNumber, channelCount)
  };

  // Calculate positions for each text element
  // Each element has its own radius AND scaled angular offset within the gate segment
  // Note: Inner centre is generated separately (once per gate) in generateInnerCentres()
  const channelNamePos = calculatePosition(baseAngle + offsets.channelName, radii.channelName);
  const keynotePos = calculatePosition(baseAngle + offsets.keynote, radii.keynote);
  const energyTypePos = calculatePosition(baseAngle + offsets.energyType, radii.energyType);
  const circuitPos = calculatePosition(baseAngle + offsets.circuit, radii.circuit);
  const outerCentrePos = calculatePosition(baseAngle + offsets.outerCentre, radii.outerCentre);
  const outerGatePos = calculatePosition(baseAngle + offsets.outerGateNumber, radii.outerGateNumber);

  // Calculate rotations for each element (based on their offset angle)
  const channelNameRot = calculateRadialRotation(calculateSVGAngle(baseAngle + offsets.channelName));
  const keynoteRot = calculateRadialRotation(calculateSVGAngle(baseAngle + offsets.keynote));
  const energyTypeRot = calculateRadialRotation(calculateSVGAngle(baseAngle + offsets.energyType));
  const circuitRot = calculateRadialRotation(calculateSVGAngle(baseAngle + offsets.circuit));
  const outerCentreRot = calculateTangentialRotation(calculateSVGAngle(baseAngle + offsets.outerCentre));
  const outerGateRot = calculateTangentialRotation(calculateSVGAngle(baseAngle + offsets.outerGateNumber));

  // Build the complete channel group with all text elements
  // Each element uses its own calculated position and rotation
  // Note: Inner centre is generated separately (once per gate) in generateInnerCentres()
  return `    <g id="CHANNEL_-_${name.replace(/\s+/g, '_').toUpperCase()}_-_${innerGate}_${outerGate}"
       data-channel="${channel.channelNumber}"
       data-inner-gate="${innerGate}"
       data-outer-gate="${outerGate}"
       data-channel-type="${energyType}"
       data-channel-count="${channelCount}">
      <!-- Channel Name (radial) -->
      <text id="CHANNEL-NAME_-_${name.replace(/\s+/g, '_')}_-_${innerGate}_${outerGate}"
         transform="translate(${channelNamePos.x.toFixed(4)} ${channelNamePos.y.toFixed(4)}) rotate(${channelNameRot.toFixed(4)})"
         font-size="${fonts.channelName.size}"
         font-family="${FONT.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${name}</text>
      <!-- Keynote (radial, separate element, may wrap to multiple lines) -->
      <text id="KEYNOTE_-_${keynote.replace(/\s+/g, '_')}_-_${innerGate}_${outerGate}"
         transform="translate(${keynotePos.x.toFixed(4)} ${keynotePos.y.toFixed(4)}) rotate(${keynoteRot.toFixed(4)})"
         font-size="${fonts.keynote.size}"
         font-family="${FONT.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${formatKeynote(keynote, fonts.keynote.size)}</text>
      <!-- Energy Type (radial) -->
      <text id="ENERGY-TYPE_-_${energyType}_-_${innerGate}_${outerGate}"
         transform="translate(${energyTypePos.x.toFixed(4)} ${energyTypePos.y.toFixed(4)}) rotate(${energyTypeRot.toFixed(4)})"
         font-size="${fonts.energyType.size}"
         font-family="${FONT.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${energyType}</text>
      <!-- Circuit (radial, right-aligned to sit in corner near ring 2) -->
      <text id="CIRCUIT_-_${formatCircuit(circuit).replace(/\s+/g, '_')}_-_${innerGate}_${outerGate}"
         transform="translate(${circuitPos.x.toFixed(4)} ${circuitPos.y.toFixed(4)}) rotate(${circuitRot.toFixed(4)})"
         font-size="${fonts.circuit.size}"
         font-family="${FONT.family}"
         text-anchor="end"
         dominant-baseline="central"
         fill="${COLORS.foreground}">${formatCircuit(circuit)}</text>
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
 * Generate inner gate numbers (64 numbers around the inner ring)
 * These appear inside the ring, using Herculanum font
 * Font size varies based on channel count (single vs multi-channel gates)
 */
function generateInnerGateNumbers(fill) {
  const gateSequence = require('../../core/root-system/gate-sequence.json').sequence;
  const INNER_GATE_RADIUS = 4612; // Between inner ring (4505) and ring 2 (4827)
  let numbers = '';

  for (const gate of gateSequence) {
    const channels = getChannelsForGate(gate);
    const channelCount = channels.length;
    const fonts = channelCount === 1 ? FONT.single : FONT.multi;

    const v3Data = positioning.getDockingData(gate, 1);
    const svgAngle = calculateSVGAngle(v3Data.angle);
    const radians = svgAngle * Math.PI / 180;

    // Position at gate center
    const x = CENTER.x + INNER_GATE_RADIUS * Math.cos(radians);
    const y = CENTER.y + INNER_GATE_RADIUS * Math.sin(radians);

    // Text rotation - radial orientation (pointing outward)
    const textRotation = svgAngle + 90;

    numbers += `    <text id="INNER-GATE-NUMBER_-_${gate}"
         transform="translate(${x.toFixed(4)} ${y.toFixed(4)}) rotate(${textRotation.toFixed(4)})"
         font-size="${fonts.innerGate.size}"
         font-family="${fonts.innerGate.family}"
         text-anchor="middle"
         dominant-baseline="central"
         fill="${fill}">${gate}</text>\n`;
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
  STRUCTURE_RADII,
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
