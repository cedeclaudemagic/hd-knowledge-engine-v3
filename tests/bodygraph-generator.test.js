/**
 * Bodygraph Generator Tests
 *
 * Validates that the bodygraph generator produces correct SVG output
 * with all expected elements and proper structure.
 */

const {
  generateBodygraph,
  GEOMETRY,
  COLORS,
  CIRCUITS
} = require('../visualization/generators/bodygraph-generator');

// ============================================================================
// TEST HELPERS
// ============================================================================

function countOccurrences(str, pattern) {
  const regex = new RegExp(pattern, 'g');
  return (str.match(regex) || []).length;
}

function extractIds(svg, pattern) {
  const regex = new RegExp(`id="${pattern}([^"]*)"`, 'g');
  const ids = [];
  let match;
  while ((match = regex.exec(svg)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

// ============================================================================
// GEOMETRY DATA TESTS
// ============================================================================

describe('Bodygraph Geometry Data', () => {
  test('should have exactly 64 gates', () => {
    const gateCount = Object.keys(GEOMETRY.gates).length;
    expect(gateCount).toBe(64);
  });

  test('should have all gates numbered 1-64', () => {
    const gates = Object.keys(GEOMETRY.gates).map(Number).sort((a, b) => a - b);
    const expected = Array.from({ length: 64 }, (_, i) => i + 1);
    expect(gates).toEqual(expected);
  });

  test('should have exactly 64 gate dots', () => {
    const dotCount = Object.keys(GEOMETRY.gateDots).length;
    expect(dotCount).toBe(64);
  });

  test('should have exactly 64 direct connectors', () => {
    const directCount = Object.keys(GEOMETRY.connectors.direct).length;
    expect(directCount).toBe(64);
  });

  test('should have exactly 64 curved connectors', () => {
    const curvedCount = Object.keys(GEOMETRY.connectors.curved).length;
    expect(curvedCount).toBe(64);
  });

  test('should have 9 center shapes', () => {
    const centerCount = Object.keys(GEOMETRY.centers.shapes).length;
    expect(centerCount).toBe(9);
  });

  test('should have 9 center definitions', () => {
    const defCount = Object.keys(GEOMETRY.centers.definitions).length;
    expect(defCount).toBe(9);
  });

  test('should have expected center names', () => {
    const centers = Object.keys(GEOMETRY.centers.shapes).sort();
    const expected = ['AJNA', 'EGO', 'G', 'HEAD', 'ROOT', 'SACRAL', 'SP', 'SPLEEN', 'THROAT'].sort();
    expect(centers).toEqual(expected);
  });

  test('should have at least 32 channels', () => {
    const channelCount = Object.keys(GEOMETRY.channels).length;
    expect(channelCount).toBeGreaterThanOrEqual(32);
  });

  test('all gates should have valid coordinates', () => {
    for (const [gateNum, gate] of Object.entries(GEOMETRY.gates)) {
      expect(gate.cx).toBeGreaterThan(0);
      expect(gate.cy).toBeGreaterThan(0);
      expect(gate.r).toBeGreaterThan(0);
      expect(gate.cx).toBeLessThan(GEOMETRY.viewBox.width);
      expect(gate.cy).toBeLessThan(GEOMETRY.viewBox.height);
    }
  });

  test('all gate dots should have valid coordinates', () => {
    for (const [gateNum, dot] of Object.entries(GEOMETRY.gateDots)) {
      expect(dot.cx).toBeGreaterThanOrEqual(0);
      expect(dot.cy).toBeGreaterThanOrEqual(0);
      expect(dot.r).toBeGreaterThan(0);
      expect(dot.cx).toBeLessThanOrEqual(GEOMETRY.viewBox.width);
      expect(dot.cy).toBeLessThanOrEqual(GEOMETRY.viewBox.height);
    }
  });

  test('all gates should have center assignments', () => {
    const validCenters = ['HEAD', 'AJNA', 'THROAT', 'G', 'EGO', 'SACRAL', 'SPLEEN', 'SP', 'ROOT'];
    for (const [gateNum, gate] of Object.entries(GEOMETRY.gates)) {
      expect(validCenters).toContain(gate.center);
    }
  });
});

// ============================================================================
// SVG GENERATION TESTS
// ============================================================================

describe('Bodygraph SVG Generation', () => {
  let svg;

  beforeAll(() => {
    svg = generateBodygraph();
  });

  test('should generate valid SVG', () => {
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  test('should have correct viewBox dimensions', () => {
    expect(svg).toContain(`viewBox="0 0 ${GEOMETRY.viewBox.width} ${GEOMETRY.viewBox.height}"`);
  });

  test('should have dark background', () => {
    expect(svg).toContain(`fill="${COLORS.background}"`);
  });

  test('should generate all 64 gate elements', () => {
    const gateCount = countOccurrences(svg, 'id="SYMBOL_-_GATE_-_\\d+"');
    expect(gateCount).toBe(64);
  });

  test('should generate all 64 gate dot elements', () => {
    const dotCount = countOccurrences(svg, 'id="SYMBOL_-_GATE-DOT_-_\\d+"');
    expect(dotCount).toBe(64);
  });

  test('should generate all 64 direct connector lines', () => {
    const directCount = countOccurrences(svg, 'id="LINE_-_DIRECT-CONNECTION_-_GATE_\\d+"');
    expect(directCount).toBe(64);
  });

  test('should generate all 64 curved connector elements', () => {
    const curvedCount = countOccurrences(svg, 'id="LINE_-_CURVED-CONNECTION_-_GATE_\\d+"');
    expect(curvedCount).toBe(64);
  });

  test('should generate all 9 center shapes', () => {
    const centerCount = countOccurrences(svg, 'id="SYMBOL_-_CENTRE_-_\\w+"');
    expect(centerCount).toBe(9);
  });

  test('should generate all 9 center definitions', () => {
    const defCount = countOccurrences(svg, 'id="SYMBOL_-_DEFINITION_-_\\w+"');
    expect(defCount).toBe(9);
  });

  test('should generate 32 channel groups', () => {
    const channelCount = countOccurrences(svg, 'id="GROUP_-_THE_CHANNEL_OF_');
    expect(channelCount).toBe(32);
  });

  test('should have circuit groupings', () => {
    expect(svg).toContain('GROUP_-_CIRCUIT_-_');
    const circuitCount = countOccurrences(svg, 'id="GROUP_-_CIRCUIT_-_');
    expect(circuitCount).toBeGreaterThanOrEqual(5); // At least 5 circuits with channels
  });

  test('should use white stroke color', () => {
    expect(svg).toContain(`stroke="${COLORS.stroke}"`);
  });
});

// ============================================================================
// GATE DATA ATTRIBUTE TESTS
// ============================================================================

describe('Gate Data Attributes', () => {
  let svg;

  beforeAll(() => {
    svg = generateBodygraph();
  });

  test('all gates should have data-gate attribute', () => {
    for (let i = 1; i <= 64; i++) {
      expect(svg).toContain(`data-gate="${i}"`);
    }
  });

  test('gates should have data-center attributes', () => {
    const centerAttrs = countOccurrences(svg, 'data-center="\\w+"');
    expect(centerAttrs).toBeGreaterThan(0);
  });
});

// ============================================================================
// V3 KNOWLEDGE ENGINE INTEGRATION TESTS
// ============================================================================

describe('V3 Knowledge Engine Integration', () => {
  let svg;

  beforeAll(() => {
    svg = generateBodygraph();
  });

  test('gates should have HD keyword attributes', () => {
    const keywordAttrs = countOccurrences(svg, 'data-keyword="[^"]*"');
    expect(keywordAttrs).toBe(64);
  });

  test('gates should have Gene Keys shadow/gift/siddhi attributes', () => {
    const shadowAttrs = countOccurrences(svg, 'data-shadow="[^"]*"');
    const giftAttrs = countOccurrences(svg, 'data-gift="[^"]*"');
    const siddhiAttrs = countOccurrences(svg, 'data-siddhi="[^"]*"');
    expect(shadowAttrs).toBe(64);
    expect(giftAttrs).toBe(64);
    expect(siddhiAttrs).toBe(64);
  });

  test('gates should have I Ching name attributes', () => {
    const ichingAttrs = countOccurrences(svg, 'data-iching="[^"]*"');
    expect(ichingAttrs).toBe(64);
  });

  test('gates should have codon ring attributes', () => {
    const ringAttrs = countOccurrences(svg, 'data-codon-ring="[^"]*"');
    expect(ringAttrs).toBe(64);
  });

  test('gates should have harmonic gate attributes', () => {
    const harmonicAttrs = countOccurrences(svg, 'data-harmonic-gate="[^"]*"');
    expect(harmonicAttrs).toBe(64);
  });

  test('centers should have theme attributes', () => {
    const themeAttrs = countOccurrences(svg, 'data-theme="[^"]*"');
    expect(themeAttrs).toBeGreaterThanOrEqual(9);
  });

  test('channels should have channel-name attributes', () => {
    const nameAttrs = countOccurrences(svg, 'data-channel-name="[^"]*"');
    expect(nameAttrs).toBe(32);
  });
});

// ============================================================================
// CHANNEL DATA TESTS
// ============================================================================

describe('Channel Structure', () => {
  let svg;

  beforeAll(() => {
    svg = generateBodygraph();
  });

  test('channels should have data-channel attribute', () => {
    // Count channel groups specifically (not gate data-channel attributes)
    const channelGroups = countOccurrences(svg, 'id="GROUP_-_THE_CHANNEL_OF_[^"]*"[^>]*data-channel="\\d+-\\d+"');
    expect(channelGroups).toBe(32);
  });

  test('channels should have data-circuit attribute', () => {
    const circuitAttrs = countOccurrences(svg, 'data-circuit="[^"]*"');
    expect(circuitAttrs).toBe(32);
  });

  test('each channel should have path elements', () => {
    // Each channel should have at least one PATH element
    const pathCount = countOccurrences(svg, '<polyline[^>]*id="PATH_-_\\d+"');
    expect(pathCount).toBeGreaterThan(0);
  });
});

// ============================================================================
// OPTIONS TESTS
// ============================================================================

describe('Generation Options', () => {
  test('should exclude connectors when option is false', () => {
    const svg = generateBodygraph({ includeConnectors: false });
    expect(svg).not.toContain('THE_BODYGRAPH_-_CONNECTORS');
    expect(svg).not.toContain('LINE_-_DIRECT-CONNECTION');
  });

  test('should exclude gate dots when option is false', () => {
    const svg = generateBodygraph({ includeGateDots: false });
    expect(svg).not.toContain('SYMBOL_-_GATE-DOT');
  });

  test('should include all elements by default', () => {
    const svg = generateBodygraph();
    expect(svg).toContain('THE_BODYGRAPH_-_CONNECTORS');
    expect(svg).toContain('SYMBOL_-_GATE-DOT');
    expect(svg).toContain('SYMBOL_-_GATE_-_');
    expect(svg).toContain('SYMBOL_-_CENTRE_-_');
  });
});

// ============================================================================
// CIRCUIT MAPPING TESTS
// ============================================================================

describe('Circuit Definitions', () => {
  test('should have 6 circuit definitions', () => {
    const circuitCount = Object.keys(CIRCUITS).length;
    expect(circuitCount).toBe(6);
  });

  test('Individual - Knowing circuit should have expected channels', () => {
    const channels = CIRCUITS['Individual - Knowing'].channels;
    expect(channels).toContain('1-8');
    expect(channels).toContain('24-61');
    expect(channels).toContain('20-57');
  });

  test('Tribal - Ego circuit should have expected channels', () => {
    const channels = CIRCUITS['Tribal - Ego'].channels;
    expect(channels).toContain('21-45');
    expect(channels).toContain('37-40');
  });

  test('all channel keys should follow format gate1-gate2', () => {
    for (const [circuitName, circuit] of Object.entries(CIRCUITS)) {
      for (const channelKey of circuit.channels) {
        expect(channelKey).toMatch(/^\d+-\d+$/);
      }
    }
  });
});

// ============================================================================
// COORDINATE VALIDATION TESTS
// ============================================================================

describe('Coordinate Validation', () => {
  test('all coordinates should be within viewBox', () => {
    const { viewBox } = GEOMETRY;

    // Check gates
    for (const [gateNum, gate] of Object.entries(GEOMETRY.gates)) {
      expect(gate.cx).toBeGreaterThanOrEqual(0);
      expect(gate.cx).toBeLessThanOrEqual(viewBox.width);
      expect(gate.cy).toBeGreaterThanOrEqual(0);
      expect(gate.cy).toBeLessThanOrEqual(viewBox.height);
    }

    // Check gate dots
    for (const [gateNum, dot] of Object.entries(GEOMETRY.gateDots)) {
      expect(dot.cx).toBeGreaterThanOrEqual(0);
      expect(dot.cx).toBeLessThanOrEqual(viewBox.width);
      expect(dot.cy).toBeGreaterThanOrEqual(0);
      expect(dot.cy).toBeLessThanOrEqual(viewBox.height);
    }
  });

  test('gate radii should be consistent', () => {
    const radii = Object.values(GEOMETRY.gates).map(g => g.r);
    const uniqueRadii = [...new Set(radii)];
    // All gates should have the same radius (or at most 2 different sizes)
    expect(uniqueRadii.length).toBeLessThanOrEqual(2);
  });

  test('gate dot radii should be consistent', () => {
    const radii = Object.values(GEOMETRY.gateDots).map(d => d.r);
    const uniqueRadii = [...new Set(radii)];
    expect(uniqueRadii.length).toBeLessThanOrEqual(2);
  });
});

// ============================================================================
// SVG STRUCTURE TESTS
// ============================================================================

describe('SVG Structure', () => {
  let svg;

  beforeAll(() => {
    svg = generateBodygraph();
  });

  test('should have proper group hierarchy', () => {
    // Root groups
    expect(svg).toContain('id="THE_BODYGRAPH_-_CONNECTORS"');
    expect(svg).toContain('id="THE_BODYGRAPH"');

    // Sub-groups
    expect(svg).toContain('id="GROUP_-_CHANNELS"');
    expect(svg).toContain('id="GROUP_-_CENTRES"');
    expect(svg).toContain('id="GROUP_-_GATES"');
    expect(svg).toContain('id="GROUP_-_OUTLINES"');
  });

  test('connectors should be in a separate group', () => {
    expect(svg).toContain('id="GROUP_-_CONNECTORS_-_DIRECT"');
    expect(svg).toContain('id="GROUP_-_CONNECTORS_-_CURVED"');
  });

  test('gates should be grouped by center', () => {
    expect(svg).toContain('id="GROUP_-_HEAD"');
    expect(svg).toContain('id="GROUP_-_AJNA"');
    expect(svg).toContain('id="GROUP_-_THROAT"');
    expect(svg).toContain('id="GROUP_-_G"');
    expect(svg).toContain('id="GROUP_-_SACRAL"');
    expect(svg).toContain('id="GROUP_-_ROOT"');
  });
});

// ============================================================================
// SUMMARY REPORT
// ============================================================================

describe('Generation Summary', () => {
  test('summary of generated elements', () => {
    const svg = generateBodygraph();

    const summary = {
      gates: countOccurrences(svg, 'id="SYMBOL_-_GATE_-_\\d+"'),
      gateDots: countOccurrences(svg, 'id="SYMBOL_-_GATE-DOT_-_\\d+"'),
      directConnectors: countOccurrences(svg, 'id="LINE_-_DIRECT-CONNECTION_-_GATE_\\d+"'),
      curvedConnectors: countOccurrences(svg, 'id="LINE_-_CURVED-CONNECTION_-_GATE_\\d+"'),
      centers: countOccurrences(svg, 'id="SYMBOL_-_CENTRE_-_\\w+"'),
      definitions: countOccurrences(svg, 'id="SYMBOL_-_DEFINITION_-_\\w+"'),
      channels: countOccurrences(svg, 'id="GROUP_-_THE_CHANNEL_OF_'),
      circuits: countOccurrences(svg, 'id="GROUP_-_CIRCUIT_-_'),
      svgLines: svg.split('\n').length
    };

    console.log('\n=== Bodygraph Generation Summary ===');
    console.log(`Gates:             ${summary.gates}/64`);
    console.log(`Gate Dots:         ${summary.gateDots}/64`);
    console.log(`Direct Connectors: ${summary.directConnectors}/64`);
    console.log(`Curved Connectors: ${summary.curvedConnectors}/64`);
    console.log(`Centers:           ${summary.centers}/9`);
    console.log(`Definitions:       ${summary.definitions}/9`);
    console.log(`Channels:          ${summary.channels}/32`);
    console.log(`Circuits:          ${summary.circuits}/6`);
    console.log(`SVG Lines:         ${summary.svgLines}`);
    console.log('=====================================\n');

    // All counts should be correct
    expect(summary.gates).toBe(64);
    expect(summary.gateDots).toBe(64);
    expect(summary.directConnectors).toBe(64);
    expect(summary.curvedConnectors).toBe(64);
    expect(summary.centers).toBe(9);
    expect(summary.definitions).toBe(9);
    expect(summary.channels).toBe(32);
  });
});
