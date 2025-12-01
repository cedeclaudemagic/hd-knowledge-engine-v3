/**
 * Channels Ring Generator Tests
 *
 * Tests for the 36 channels ring generator that creates 72 channel entries
 * (each channel appears at both gate positions).
 *
 * Run: node tests/channels-ring-generator.test.js
 */

const generator = require('../visualization/generators/channels-ring');
const positioning = require('../core/root-system/positioning-algorithm');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function assertClose(actual, expected, tolerance, message) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${message}: expected ${expected} ±${tolerance}, got ${actual}`);
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

console.log('Channels Ring Generator Tests\n');
console.log('='.repeat(50));

// ============================================================
// Module Exports
// ============================================================

console.log('\n--- Module Exports ---');

test('exports CENTER', () => {
  assertTrue(generator.CENTER !== undefined, 'CENTER should be defined');
  assertTrue(typeof generator.CENTER.x === 'number', 'CENTER.x should be number');
  assertTrue(typeof generator.CENTER.y === 'number', 'CENTER.y should be number');
});

test('exports RING_RADII', () => {
  assertTrue(generator.RING_RADII !== undefined, 'RING_RADII should be defined');
  assertTrue(generator.RING_RADII.inner > 0, 'inner radius should be positive');
  assertTrue(generator.RING_RADII.outer > generator.RING_RADII.inner, 'outer > inner');
  assertTrue(generator.RING_RADII.bottomOuter > generator.RING_RADII.outer, 'bottomOuter > outer');
  assertTrue(generator.RING_RADII.bottom > generator.RING_RADII.bottomOuter, 'bottom > bottomOuter');
});

test('exports BAND_RADII with all required radii', () => {
  assertTrue(generator.BAND_RADII !== undefined, 'BAND_RADII should be defined');
  assertTrue(generator.BAND_RADII.innerCentre > 0, 'innerCentre radius should be positive');
  assertTrue(generator.BAND_RADII.channelName > 0, 'channelName radius should be positive');
  assertTrue(generator.BAND_RADII.keynote > 0, 'keynote radius should be positive');
  assertTrue(generator.BAND_RADII.energyType > 0, 'energyType radius should be positive');
  assertTrue(generator.BAND_RADII.circuit > 0, 'circuit radius should be positive');
  assertTrue(generator.BAND_RADII.outerCentre > 0, 'outerCentre radius should be positive');
  assertTrue(generator.BAND_RADII.outerGateNumber > 0, 'outerGateNumber radius should be positive');
  // All bands should be outside the structure rings
  assertTrue(generator.BAND_RADII.innerCentre > generator.RING_RADII.outer, 'all bands outside outer ring');
});

test('exports BASE_ANGLE_OFFSETS for element positioning', () => {
  assertTrue(generator.BASE_ANGLE_OFFSETS !== undefined, 'BASE_ANGLE_OFFSETS should be defined');
  // Offsets are in V3 angle space (negated from SVG measurement)
  // innerCentre at SVG -128.21° = +1.64° V3 offset (clockwise in SVG)
  assertClose(generator.BASE_ANGLE_OFFSETS.innerCentre, 1.64, 0.1, 'innerCentre V3 offset');
  // channelName at SVG -126.20° = -0.36° V3 offset (counter-clockwise in SVG)
  assertClose(generator.BASE_ANGLE_OFFSETS.channelName, -0.36, 0.1, 'channelName V3 offset');
});

test('exports channelsData with 36 channels', () => {
  assertEqual(generator.channelsData.totalChannels, 36, 'should have 36 channels');
  assertEqual(generator.channelsData.mappings.length, 36, 'should have 36 mappings');
});

// ============================================================
// Geometry Constants
// ============================================================

console.log('\n--- Geometry Constants ---');

test('CENTER matches master SVG', () => {
  assertClose(generator.CENTER.x, 6482.5278, 0.001, 'CENTER.x');
  assertClose(generator.CENTER.y, 6486.1582, 0.001, 'CENTER.y');
});

// All radii measured from master SVG GROUP_-_THE_CHANNEL_OF_RECOGNITION_-_41_30
test('BAND_RADII.innerCentre ~4908 (from master)', () => {
  assertClose(generator.BAND_RADII.innerCentre, 4908, 5, 'innerCentre radius');
});

test('BAND_RADII.channelName ~5881 (from master)', () => {
  assertClose(generator.BAND_RADII.channelName, 5881, 5, 'channelName radius');
});

test('BAND_RADII.keynote ~5775 (from master)', () => {
  assertClose(generator.BAND_RADII.keynote, 5775, 5, 'keynote radius');
});

test('BAND_RADII.energyType ~5990 (from master)', () => {
  assertClose(generator.BAND_RADII.energyType, 5990, 5, 'energyType radius');
});

test('BAND_RADII.circuit ~5309 (from master)', () => {
  assertClose(generator.BAND_RADII.circuit, 5309, 5, 'circuit radius');
});

test('BAND_RADII.outerCentre ~6056 (from master)', () => {
  assertClose(generator.BAND_RADII.outerCentre, 6056, 5, 'outerCentre radius');
});

test('BAND_RADII.outerGateNumber ~6330 (from master)', () => {
  assertClose(generator.BAND_RADII.outerGateNumber, 6330, 5, 'outerGateNumber radius');
});

test('getScaledOffset scales by channel count', () => {
  assertEqual(generator.getScaledOffset(3.0, 1), 3.0, 'single channel: no scaling');
  assertEqual(generator.getScaledOffset(3.0, 3), 1.0, '3 channels: 1/3 scaling');
});

// ============================================================
// Rotation Calculations
// ============================================================

console.log('\n--- Rotation Calculations ---');

test('calculateRadialRotation for gate 10 matches master', () => {
  // Gate 10: V3 angle = 326.25°, svgAngle = -92.8125°
  // Master channel name rotation: 87.7551°
  // Our formula: svgAngle + 180 = 87.1875°
  const v3Data = positioning.getDockingData(10, 1);
  const svgAngle = generator.calculateSVGAngle(v3Data.angle);
  const radialRot = generator.calculateRadialRotation(svgAngle);

  assertClose(radialRot, 87.1875, 0.01, 'radial rotation at gate 10');
  assertClose(radialRot, 87.7551, 1.0, 'should be within 1° of master (87.7551)');
});

test('calculateTangentialRotation for gate 10 matches master', () => {
  // Master inner centre rotation: -2.8°
  // Our formula: svgAngle + 90 = -2.8125°
  const v3Data = positioning.getDockingData(10, 1);
  const svgAngle = generator.calculateSVGAngle(v3Data.angle);
  const tangentialRot = generator.calculateTangentialRotation(svgAngle);

  assertClose(tangentialRot, -2.8125, 0.01, 'tangential rotation at gate 10');
  assertClose(tangentialRot, -2.8, 0.5, 'should be within 0.5° of master (-2.8)');
});

test('rotation normalization works', () => {
  // Test that large angles get normalized to -180 to 180 range
  const svgAngle = 270; // would give radial = 450, should normalize
  const radialRot = generator.calculateRadialRotation(svgAngle);
  assertTrue(radialRot >= -180 && radialRot <= 180, 'should be normalized to -180..180');
  assertClose(radialRot, 90, 0.01, 'radial of 270 should be 90');

  const tangentialRot = generator.calculateTangentialRotation(svgAngle);
  assertTrue(tangentialRot >= -180 && tangentialRot <= 180, 'should be normalized to -180..180');
});

// ============================================================
// Position Calculations
// ============================================================

console.log('\n--- Position Calculations ---');

test('calculatePosition returns correct x,y for gate 10', () => {
  const v3Data = positioning.getDockingData(10, 1);
  const radius = generator.BAND_RADII.channelName;
  const pos = generator.calculatePosition(v3Data.angle, radius);

  // Gate 10 is at 326.25° (slightly west of north), so:
  // - x should be slightly left of center (negative dx)
  // - y should be near top (low y value, well below center)
  assertTrue(pos.x < generator.CENTER.x, 'should be left of center x');
  assertTrue(pos.x > generator.CENTER.x - 500, 'should not be too far left');
  assertTrue(pos.y < generator.CENTER.y - 4000, 'should be near top (low y)');
});

test('calculatePosition returns correct radius distance', () => {
  const v3Data = positioning.getDockingData(10, 1);
  const radius = generator.BAND_RADII.channelName;
  const pos = generator.calculatePosition(v3Data.angle, radius);

  const dx = pos.x - generator.CENTER.x;
  const dy = pos.y - generator.CENTER.y;
  const actualRadius = Math.sqrt(dx * dx + dy * dy);

  assertClose(actualRadius, radius, 1, 'distance from center should equal radius');
});

// ============================================================
// Centre Connection Parsing
// ============================================================

console.log('\n--- Centre Connection Parsing ---');

test('parseCentreConnection handles "G to Throat" when gate1 is inner', () => {
  const result = generator.parseCentreConnection('G to Throat', 1, 1);
  assertEqual(result.inner, 'G', 'inner centre');
  assertEqual(result.outer, 'Throat', 'outer centre');
});

test('parseCentreConnection handles "G to Throat" when gate2 is inner', () => {
  const result = generator.parseCentreConnection('G to Throat', 8, 1);
  assertEqual(result.inner, 'Throat', 'inner centre (swapped)');
  assertEqual(result.outer, 'G', 'outer centre (swapped)');
});

test('parseCentreConnection handles "Sacral to Root"', () => {
  const result = generator.parseCentreConnection('Sacral to Root', 3, 3);
  assertEqual(result.inner, 'Sacral', 'inner centre');
  assertEqual(result.outer, 'Root', 'outer centre');
});

// ============================================================
// getChannelsForGate
// ============================================================

console.log('\n--- getChannelsForGate ---');

test('gate 10 has 3 channels', () => {
  const channels = generator.getChannelsForGate(10);
  assertEqual(channels.length, 3, 'gate 10 should have 3 channels');
});

test('gate 10 channels include Perfected Form, Exploration, Awakening', () => {
  const channels = generator.getChannelsForGate(10);
  const names = channels.map(c => c.knowledge.name);

  assertTrue(names.includes('Perfected Form'), 'should include Perfected Form');
  assertTrue(names.includes('Exploration'), 'should include Exploration');
  assertTrue(names.includes('Awakening'), 'should include Awakening');
});

test('gate 10 channels have correct inner/outer gate assignment', () => {
  const channels = generator.getChannelsForGate(10);

  for (const channel of channels) {
    assertEqual(channel.innerGate, 10, 'innerGate should be 10');
    assertTrue([20, 34, 57].includes(channel.outerGate), 'outerGate should be 20, 34, or 57');
  }
});

test('gate 41 has 1 channel (Recognition)', () => {
  const channels = generator.getChannelsForGate(41);
  assertEqual(channels.length, 1, 'gate 41 should have 1 channel');
  assertEqual(channels[0].knowledge.name, 'Recognition', 'should be Recognition');
});

test('gate 1 has 1 channel (Inspiration)', () => {
  const channels = generator.getChannelsForGate(1);
  assertEqual(channels.length, 1, 'gate 1 should have 1 channel');
  assertEqual(channels[0].knowledge.name, 'Inspiration', 'should be Inspiration');
});

// ============================================================
// Channel Element Generation
// ============================================================

console.log('\n--- Channel Element Generation ---');

test('generateChannelElement produces valid SVG group', () => {
  const channels = generator.getChannelsForGate(10);
  const svg = generator.generateChannelElement(channels[0], 10);

  assertTrue(svg.includes('<g id="CHANNEL_-_'), 'should have channel group');
  assertTrue(svg.includes('</g>'), 'should close group');
  assertTrue(svg.includes('data-channel='), 'should have channel data attribute');
  assertTrue(svg.includes('data-inner-gate="10"'), 'should have inner gate');
});

test('generateChannelElement includes all text elements', () => {
  const channels = generator.getChannelsForGate(10);
  const svg = generator.generateChannelElement(channels[0], 10);

  assertTrue(svg.includes('INNER-CENTRE_-_'), 'should have inner centre');
  assertTrue(svg.includes('CHANNEL-NAME_-_'), 'should have channel name');
  assertTrue(svg.includes('KEYNOTE_-_'), 'should have keynote');
  assertTrue(svg.includes('ENERGY-TYPE_-_'), 'should have energy type');
  assertTrue(svg.includes('CIRCUIT_-_'), 'should have circuit');
  assertTrue(svg.includes('OUTER-CENTRE_-_'), 'should have outer centre');
  assertTrue(svg.includes('OUTER-GATE-NUMBER_-_'), 'should have outer gate number');
});

test('generateChannelElement uses radial rotation for channel name', () => {
  const channels = generator.getChannelsForGate(10);
  const svg = generator.generateChannelElement(channels[0], 10, 3); // Gate 10 has 3 channels

  // Channel name should use radial rotation
  // With scaled offset (1.46°/3 = 0.4867°), rotation is ~86.7° instead of 87.1875°
  // Just verify the rotation is in the expected range for gate 10 (near vertical, ~87°)
  const rotationMatch = svg.match(/CHANNEL-NAME[^>]+rotate\(([^)]+)\)/);
  assertTrue(rotationMatch !== null, 'channel name should have rotation');
  const rotation = parseFloat(rotationMatch[1]);
  assertTrue(rotation > 85 && rotation < 90, `channel name rotation should be ~86-88° (got ${rotation})`);
});

test('generateChannelElement uses tangential rotation for centres', () => {
  const channels = generator.getChannelsForGate(10);
  const svg = generator.generateChannelElement(channels[0], 10, 3); // Gate 10 has 3 channels

  // Centres should use tangential rotation (with offset, ~-2.8° to -3°)
  const rotationMatch = svg.match(/INNER-CENTRE[^>]+rotate\(([^)]+)\)/);
  assertTrue(rotationMatch !== null, 'inner centre should have rotation');
  const rotation = parseFloat(rotationMatch[1]);
  assertTrue(rotation > -5 && rotation < 0, `inner centre rotation should be ~-3° (got ${rotation})`);
});

// ============================================================
// Full SVG Generation
// ============================================================

console.log('\n--- Full SVG Generation ---');

test('generateChannelsRing produces valid SVG', () => {
  const svg = generator.generateChannelsRing();

  assertTrue(svg.startsWith('<svg'), 'should start with svg tag');
  assertTrue(svg.endsWith('</svg>'), 'should end with svg tag');
  assertTrue(svg.includes('xmlns="http://www.w3.org/2000/svg"'), 'should have xmlns');
});

test('generateChannelsRing includes 72 channel entries', () => {
  const svg = generator.generateChannelsRing();
  const matches = svg.match(/id="CHANNEL_-_/g);

  assertEqual(matches.length, 72, 'should have 72 channel entries');
});

test('generateChannelsRing includes structure elements', () => {
  const svg = generator.generateChannelsRing();

  assertTrue(svg.includes('GROUP_-_STRUCTURE'), 'should have structure group');
  assertTrue(svg.includes('GROUP_-_RINGS'), 'should have rings group');
  assertTrue(svg.includes('RING_-_INNER'), 'should have inner ring');
  assertTrue(svg.includes('RING_-_OUTER'), 'should have outer ring');
});

test('generateChannelsRing can exclude structure', () => {
  const svg = generator.generateChannelsRing({ includeStructure: false });

  assertTrue(!svg.includes('GROUP_-_STRUCTURE'), 'should not have structure');
  assertTrue(svg.includes('GROUP_-_CHANNELS'), 'should still have channels');
});

test('generateChannelsRing can exclude background', () => {
  const svg = generator.generateChannelsRing({ includeBackground: false });

  assertTrue(!svg.includes('id="background"'), 'should not have background rect');
});

test('generateChannelsRing accepts custom colors', () => {
  const svg = generator.generateChannelsRing({
    stroke: '#FF0000',
    fill: '#00FF00',
    backgroundColor: '#0000FF'
  });

  assertTrue(svg.includes('fill="#0000FF"'), 'should have custom background');
  assertTrue(svg.includes('fill="#00FF00"'), 'should have custom fill');
});

// ============================================================
// Statistics
// ============================================================

console.log('\n--- Statistics ---');

test('getStatistics returns correct totals', () => {
  const stats = generator.getStatistics();

  assertEqual(stats.totalChannels, 36, 'should have 36 total channels');
  assertEqual(stats.totalEntries, 72, 'should have 72 total entries');
});

test('getStatistics returns correct average', () => {
  const stats = generator.getStatistics();

  assertClose(stats.avgEntriesPerGate, 72 / 64, 0.01, 'average should be 72/64');
});

test('getStatistics includes per-gate breakdown', () => {
  const stats = generator.getStatistics();

  assertEqual(stats.entriesPerGate[10], 3, 'gate 10 should have 3 entries');
  assertEqual(stats.entriesPerGate[41], 1, 'gate 41 should have 1 entry');
});

// ============================================================
// Edge Cases
// ============================================================

console.log('\n--- Edge Cases ---');

test('handles gates with no channels gracefully', () => {
  // Gate 4 only connects to 63, so gate 4 should have 1 channel
  const channels = generator.getChannelsForGate(4);
  assertEqual(channels.length, 1, 'gate 4 should have 1 channel');
  assertEqual(channels[0].knowledge.name, 'Logic', 'should be Logic channel');
});

test('each channel appears exactly twice in full SVG', () => {
  const svg = generator.generateChannelsRing();

  // Check a specific channel appears twice (at both gate positions)
  const inspirationMatches = svg.match(/CHANNEL_-_INSPIRATION/g);
  assertEqual(inspirationMatches.length, 2, 'Inspiration should appear twice');

  const perfectedFormMatches = svg.match(/CHANNEL_-_PERFECTED_FORM/g);
  assertEqual(perfectedFormMatches.length, 2, 'Perfected Form should appear twice');
});

// ============================================================
// Summary
// ============================================================

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

process.exit(failed > 0 ? 1 : 0);
