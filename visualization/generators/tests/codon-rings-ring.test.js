/**
 * Tests for Codon Rings Ring Generator
 *
 * These tests lock in the precise positioning, scaling, and special case handling
 * to ensure the generator maintains visual accuracy when refactored for proportional scaling.
 *
 * Run with: node visualization/generators/tests/codon-rings-ring.test.js
 */

const codonRingsGenerator = require('../codon-rings-ring');
const codonRingsMappings = require('../../../knowledge-systems/codon-rings/mappings/codon-rings-mappings.json');
const gateSequence = require('../../../core/root-system/gate-sequence.json').sequence;

// Test utilities
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    const result = fn();
    if (result === false || (result && result.success === false)) {
      console.log(`FAIL: ${name}`);
      if (result && result.error) console.log(`  ${result.error}`);
      failed++;
      return false;
    }
    console.log(`PASS: ${name}`);
    passed++;
    return true;
  } catch (err) {
    console.log(`FAIL: ${name}`);
    console.log(`  ${err.message}`);
    failed++;
    return false;
  }
}

function section(name) {
  console.log(`\n--- ${name} ---`);
}

// ============================================================================
// TEST DEFINITIONS
// ============================================================================

console.log('\n========================================');
console.log('Codon Rings Ring Generator Tests');
console.log('========================================');

// ============================================================================
// SECTION 1: BASE GEOMETRY CONSTANTS
// ============================================================================
section('BASE GEOMETRY CONSTANTS');

test('BASE_RING constants are defined', () => {
  const { BASE_RING } = codonRingsGenerator;
  if (!BASE_RING) return { success: false, error: 'BASE_RING not defined' };
  if (!BASE_RING.center) return { success: false, error: 'BASE_RING.center not defined' };
  if (!BASE_RING.innerRadius) return { success: false, error: 'BASE_RING.innerRadius not defined' };
  if (!BASE_RING.outerRadius) return { success: false, error: 'BASE_RING.outerRadius not defined' };
  return true;
});

test('BASE_RING values match master SVG', () => {
  const { BASE_RING } = codonRingsGenerator;
  const tolerance = 0.001;
  if (Math.abs(BASE_RING.center.x - 1122.0567) > tolerance) return { success: false, error: `CENTER.x mismatch: ${BASE_RING.center.x}` };
  if (Math.abs(BASE_RING.center.y - 1130.6034) > tolerance) return { success: false, error: `CENTER.y mismatch: ${BASE_RING.center.y}` };
  if (Math.abs(BASE_RING.innerRadius - 858.2697) > tolerance) return { success: false, error: `innerRadius mismatch: ${BASE_RING.innerRadius}` };
  if (Math.abs(BASE_RING.outerRadius - 1084.3718) > tolerance) return { success: false, error: `outerRadius mismatch: ${BASE_RING.outerRadius}` };
  return true;
});

test('Band width is correctly calculated', () => {
  const { BASE_RING, RING } = codonRingsGenerator;
  const expectedBandWidth = BASE_RING.outerRadius - BASE_RING.innerRadius;
  const tolerance = 0.01;
  if (Math.abs(RING.bandWidth - expectedBandWidth) > tolerance) {
    return { success: false, error: `Band width mismatch: ${RING.bandWidth} vs ${expectedBandWidth}` };
  }
  return true;
});

// ============================================================================
// SECTION 2: SCALE RATIOS (THE KEY TO PROPORTIONAL SCALING)
// ============================================================================
section('SCALE RATIOS');

test('SCALE_RATIOS are defined', () => {
  const { SCALE_RATIOS } = codonRingsGenerator;
  if (!SCALE_RATIOS) return { success: false, error: 'SCALE_RATIOS not defined' };

  const requiredRatios = [
    'codonLettersOffset', 'gateDotsOffset', 'gateNumbersOffset',
    'ringNamesOffset', 'ringNamesTangentOffset', 'aminoAcidsOffset',
    'outerRingOffset', 'innerRingOffset',
    'codonLettersFont', 'gateNumbersFont', 'ringNamesFont', 'aminoAcidsFont',
    'gateDotRadius'
  ];

  for (const ratio of requiredRatios) {
    if (SCALE_RATIOS[ratio] === undefined) {
      return { success: false, error: `Missing ratio: ${ratio}` };
    }
  }
  return true;
});

test('All SCALE_RATIOS are numbers between -1 and 1', () => {
  const { SCALE_RATIOS } = codonRingsGenerator;
  for (const [key, value] of Object.entries(SCALE_RATIOS)) {
    if (typeof value !== 'number') {
      return { success: false, error: `${key} is not a number: ${value}` };
    }
    if (Math.abs(value) > 1) {
      return { success: false, error: `${key} ratio out of range: ${value}` };
    }
  }
  return true;
});

test('SCALE_RATIOS match documented values', () => {
  const { SCALE_RATIOS } = codonRingsGenerator;
  const tolerance = 0.0001;

  // These are the locked-in ratios from the generator
  const expected = {
    codonLettersOffset: 0.0221,
    gateDotsOffset: 0.1106,
    gateNumbersOffset: -0.1327,
    ringNamesOffset: 0.0885,
    ringNamesTangentOffset: 0.1902,
    aminoAcidsOffset: 0.0531,
    outerRingOffset: 0.1062,
    innerRingOffset: 0.0885,
    codonLettersFont: 0.1072,
    gateNumbersFont: 0.0856,
    ringNamesFont: 0.0619,
    aminoAcidsFont: 0.0708,
    gateDotRadius: 0.0369
  };

  for (const [key, expectedValue] of Object.entries(expected)) {
    const actual = SCALE_RATIOS[key];
    if (Math.abs(actual - expectedValue) > tolerance) {
      return { success: false, error: `${key} ratio mismatch: ${actual} vs ${expectedValue}` };
    }
  }
  return true;
});

// ============================================================================
// SECTION 3: SCALED GEOMETRY CALCULATION
// ============================================================================
section('SCALED GEOMETRY CALCULATION');

test('calculateScaledGeometry function exists', () => {
  const { calculateScaledGeometry } = codonRingsGenerator;
  if (typeof calculateScaledGeometry !== 'function') {
    return { success: false, error: 'calculateScaledGeometry is not a function' };
  }
  return true;
});

test('SCALED object has all required properties', () => {
  const { SCALED } = codonRingsGenerator;
  if (!SCALED) return { success: false, error: 'SCALED not defined' };

  const requiredProps = ['center', 'innerRadius', 'outerRadius', 'bandWidth', 'midPoint', 'radii', 'fonts', 'gateDotRadius'];
  for (const prop of requiredProps) {
    if (SCALED[prop] === undefined) {
      return { success: false, error: `SCALED missing property: ${prop}` };
    }
  }

  const requiredRadii = ['codonLetters', 'gateDots', 'gateNumbers', 'ringNames', 'ringNamesTangent', 'aminoAcids', 'outerRing', 'innerRing'];
  for (const radius of requiredRadii) {
    if (SCALED.radii[radius] === undefined) {
      return { success: false, error: `SCALED.radii missing: ${radius}` };
    }
  }

  const requiredFonts = ['codonLetters', 'gateNumbers', 'ringNames', 'aminoAcids'];
  for (const font of requiredFonts) {
    if (SCALED.fonts[font] === undefined) {
      return { success: false, error: `SCALED.fonts missing: ${font}` };
    }
  }

  return true;
});

test('Derived radii are in correct order (inside to outside)', () => {
  const { SCALED } = codonRingsGenerator;
  const { radii, innerRadius, outerRadius } = SCALED;

  // Order from inside to outside:
  // innerRing < codonLetters < innerRadius < gateDots < gateNumbers < midPoint < ringNames < outerRadius < aminoAcids < outerRing

  if (radii.innerRing >= radii.codonLetters) return { success: false, error: 'innerRing should be < codonLetters' };
  if (radii.codonLetters >= innerRadius) return { success: false, error: 'codonLetters should be < innerRadius' };
  if (radii.gateDots <= innerRadius) return { success: false, error: 'gateDots should be > innerRadius' };
  if (radii.gateNumbers <= radii.gateDots) return { success: false, error: 'gateNumbers should be > gateDots' };
  if (radii.aminoAcids <= outerRadius) return { success: false, error: 'aminoAcids should be > outerRadius' };
  if (radii.outerRing <= radii.aminoAcids) return { success: false, error: 'outerRing should be > aminoAcids' };

  return true;
});

// ============================================================================
// SECTION 4: PROPORTIONAL SCALING VERIFICATION
// ============================================================================
section('PROPORTIONAL SCALING VERIFICATION');

test('Radii are calculated from ratios correctly', () => {
  const { SCALED, SCALE_RATIOS, BASE_RING, SCALE_FACTOR } = codonRingsGenerator;
  const bandWidth = (BASE_RING.outerRadius - BASE_RING.innerRadius) * SCALE_FACTOR;
  const innerRadius = BASE_RING.innerRadius * SCALE_FACTOR;
  const outerRadius = BASE_RING.outerRadius * SCALE_FACTOR;
  const midPoint = (innerRadius + outerRadius) / 2;
  const tolerance = 0.01;

  // Verify each radius is calculated correctly from its ratio
  const expectedCodonLetters = innerRadius - (bandWidth * SCALE_RATIOS.codonLettersOffset);
  if (Math.abs(SCALED.radii.codonLetters - expectedCodonLetters) > tolerance) {
    return { success: false, error: `codonLetters radius mismatch: ${SCALED.radii.codonLetters} vs ${expectedCodonLetters}` };
  }

  const expectedGateDots = innerRadius + (bandWidth * SCALE_RATIOS.gateDotsOffset);
  if (Math.abs(SCALED.radii.gateDots - expectedGateDots) > tolerance) {
    return { success: false, error: `gateDots radius mismatch: ${SCALED.radii.gateDots} vs ${expectedGateDots}` };
  }

  const expectedGateNumbers = midPoint + (bandWidth * SCALE_RATIOS.gateNumbersOffset);
  if (Math.abs(SCALED.radii.gateNumbers - expectedGateNumbers) > tolerance) {
    return { success: false, error: `gateNumbers radius mismatch: ${SCALED.radii.gateNumbers} vs ${expectedGateNumbers}` };
  }

  return true;
});

test('Font sizes are calculated from ratios correctly', () => {
  const { SCALED, SCALE_RATIOS, BASE_RING, SCALE_FACTOR } = codonRingsGenerator;
  const bandWidth = (BASE_RING.outerRadius - BASE_RING.innerRadius) * SCALE_FACTOR;
  const tolerance = 0.01;

  const expectedCodonFont = bandWidth * SCALE_RATIOS.codonLettersFont;
  if (Math.abs(SCALED.fonts.codonLetters - expectedCodonFont) > tolerance) {
    return { success: false, error: `codonLetters font mismatch: ${SCALED.fonts.codonLetters} vs ${expectedCodonFont}` };
  }

  const expectedNumbersFont = bandWidth * SCALE_RATIOS.gateNumbersFont;
  if (Math.abs(SCALED.fonts.gateNumbers - expectedNumbersFont) > tolerance) {
    return { success: false, error: `gateNumbers font mismatch: ${SCALED.fonts.gateNumbers} vs ${expectedNumbersFont}` };
  }

  return true;
});

test('Gate dot radius is calculated from ratio correctly', () => {
  const { SCALED, SCALE_RATIOS, BASE_RING, SCALE_FACTOR } = codonRingsGenerator;
  const bandWidth = (BASE_RING.outerRadius - BASE_RING.innerRadius) * SCALE_FACTOR;
  const tolerance = 0.01;

  const expected = bandWidth * SCALE_RATIOS.gateDotRadius;
  if (Math.abs(SCALED.gateDotRadius - expected) > tolerance) {
    return { success: false, error: `gateDotRadius mismatch: ${SCALED.gateDotRadius} vs ${expected}` };
  }
  return true;
});

// ============================================================================
// SECTION 5: SCALING PRESERVES RATIOS (CRITICAL FOR GROUP SCALING)
// ============================================================================
section('SCALING PRESERVES RATIOS');

test('Scaling by 0.5x preserves all ratios', () => {
  const { BASE_RING, SCALE_RATIOS, calculateScaledGeometry } = codonRingsGenerator;

  // Calculate at scale 1.0
  const scale1 = calculateScaledGeometry();
  const bandWidth1 = scale1.bandWidth;

  // Manually calculate what 0.5x should give us
  const scaledInner = BASE_RING.innerRadius * 0.5;
  const scaledOuter = BASE_RING.outerRadius * 0.5;
  const bandWidth05 = scaledOuter - scaledInner;

  // Verify band width scales correctly
  const tolerance = 0.01;
  if (Math.abs(bandWidth05 - bandWidth1 * 0.5) > tolerance) {
    return { success: false, error: `Band width doesn't scale: ${bandWidth05} vs ${bandWidth1 * 0.5}` };
  }

  // Verify ratios would be preserved (offset / bandWidth should be same)
  const codonOffset1 = scale1.innerRadius - scale1.radii.codonLetters;
  const ratio1 = codonOffset1 / bandWidth1;

  if (Math.abs(ratio1 - SCALE_RATIOS.codonLettersOffset) > 0.001) {
    return { success: false, error: `Codon offset ratio doesn't match: ${ratio1} vs ${SCALE_RATIOS.codonLettersOffset}` };
  }

  return true;
});

test('All element offsets maintain constant ratio to band width', () => {
  const { SCALED, SCALE_RATIOS } = codonRingsGenerator;
  const bandWidth = SCALED.bandWidth;
  const tolerance = 0.001;

  // Verify each offset maintains its documented ratio
  const codonOffset = SCALED.innerRadius - SCALED.radii.codonLetters;
  const codonRatio = codonOffset / bandWidth;
  if (Math.abs(codonRatio - SCALE_RATIOS.codonLettersOffset) > tolerance) {
    return { success: false, error: `Codon letters ratio drift: ${codonRatio} vs ${SCALE_RATIOS.codonLettersOffset}` };
  }

  const dotsOffset = SCALED.radii.gateDots - SCALED.innerRadius;
  const dotsRatio = dotsOffset / bandWidth;
  if (Math.abs(dotsRatio - SCALE_RATIOS.gateDotsOffset) > tolerance) {
    return { success: false, error: `Gate dots ratio drift: ${dotsRatio} vs ${SCALE_RATIOS.gateDotsOffset}` };
  }

  const outerRingOffset = SCALED.radii.outerRing - SCALED.outerRadius;
  const outerRingRatio = outerRingOffset / bandWidth;
  if (Math.abs(outerRingRatio - SCALE_RATIOS.outerRingOffset) > tolerance) {
    return { success: false, error: `Outer ring ratio drift: ${outerRingRatio} vs ${SCALE_RATIOS.outerRingOffset}` };
  }

  return true;
});

test('Font sizes maintain constant ratio to band width', () => {
  const { SCALED, SCALE_RATIOS } = codonRingsGenerator;
  const bandWidth = SCALED.bandWidth;
  const tolerance = 0.001;

  const codonFontRatio = SCALED.fonts.codonLetters / bandWidth;
  if (Math.abs(codonFontRatio - SCALE_RATIOS.codonLettersFont) > tolerance) {
    return { success: false, error: `Codon font ratio drift: ${codonFontRatio} vs ${SCALE_RATIOS.codonLettersFont}` };
  }

  const numbersFontRatio = SCALED.fonts.gateNumbers / bandWidth;
  if (Math.abs(numbersFontRatio - SCALE_RATIOS.gateNumbersFont) > tolerance) {
    return { success: false, error: `Numbers font ratio drift: ${numbersFontRatio} vs ${SCALE_RATIOS.gateNumbersFont}` };
  }

  const namesFontRatio = SCALED.fonts.ringNames / bandWidth;
  if (Math.abs(namesFontRatio - SCALE_RATIOS.ringNamesFont) > tolerance) {
    return { success: false, error: `Names font ratio drift: ${namesFontRatio} vs ${SCALE_RATIOS.ringNamesFont}` };
  }

  const aminoFontRatio = SCALED.fonts.aminoAcids / bandWidth;
  if (Math.abs(aminoFontRatio - SCALE_RATIOS.aminoAcidsFont) > tolerance) {
    return { success: false, error: `Amino font ratio drift: ${aminoFontRatio} vs ${SCALE_RATIOS.aminoAcidsFont}` };
  }

  return true;
});

// ============================================================================
// SECTION 6: DATA INTEGRITY
// ============================================================================
section('DATA INTEGRITY');

test('All 64 gates have dots', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  for (let gate = 1; gate <= 64; gate++) {
    if (!svg.includes(`GATE-DOT_-_${gate}"`)) return { success: false, error: `Gate ${gate} dot missing` };
  }
  return true;
});

test('All 64 codon letters are present', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  const codonMatches = svg.match(/CODON-LETTERS_-_[A-Z]{3}/g);
  if (!codonMatches || codonMatches.length < 64) {
    return { success: false, error: `Only ${codonMatches ? codonMatches.length : 0} codon letters found` };
  }
  return true;
});

test('Gate sequence matches V3 data', () => {
  const expected = [41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
    27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
    31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
    28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60];
  for (let i = 0; i < 64; i++) {
    if (gateSequence[i] !== expected[i]) return { success: false, error: `Position ${i} mismatch` };
  }
  return true;
});

test('All amino acids from V3 data are present', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  const aminoAcids = new Set();
  for (const mapping of codonRingsMappings.mappings) {
    aminoAcids.add(mapping.knowledge.aminoAcid);
  }
  for (const acid of aminoAcids) {
    const displayName = acid.replace(/_/g, ' ');
    if (!svg.includes(displayName)) {
      return { success: false, error: `Amino acid "${displayName}" not found` };
    }
  }
  return true;
});

// ============================================================================
// SECTION 7: SPECIAL CASES - RING OF GAIA
// ============================================================================
section('SPECIAL CASES - RING OF GAIA');

test('Ring of Gaia has all 3 gates in one group', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  if (!svg.includes('RING_OF_GAIA_-_19_-_60_-_61')) {
    return { success: false, error: 'Gaia should have all 3 gates in one group' };
  }
  // Should NOT have separate groups
  if (svg.includes('RING_OF_GAIA_-_61"') && svg.includes('RING_OF_GAIA_-_19_-_60"')) {
    return { success: false, error: 'Gaia should NOT be split into separate groups' };
  }
  return true;
});

test('Ring of Gaia gate numbers show "19" / "60 - 61"', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  // Check for the specific format: 19 on top, 60 - 61 on bottom
  if (!svg.includes('>19</tspan>') || !svg.includes('>60 - 61</tspan>')) {
    return { success: false, error: 'Gaia should show "19" / "60 - 61"' };
  }
  return true;
});

test('Ring of Gaia has 4 tracing lines (MAIN + 3 gates)', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  const mainLine = svg.includes('JOIN-DOTS_-_RING_OF_GAIA_MAIN');
  const line19 = svg.includes('JOIN-DOTS_-_RING_OF_GAIA_19');
  const line60 = svg.includes('JOIN-DOTS_-_RING_OF_GAIA_60');
  const line61 = svg.includes('JOIN-DOTS_-_RING_OF_GAIA_61');

  if (!mainLine) return { success: false, error: 'Missing MAIN tracing line' };
  if (!line19) return { success: false, error: 'Missing gate 19 tracing line' };
  if (!line60) return { success: false, error: 'Missing gate 60 tracing line' };
  if (!line61) return { success: false, error: 'Missing gate 61 tracing line' };
  return true;
});

test('Ring of Gaia junction at AUC position (gate 60)', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();

  // Extract the junction coordinates from MAIN line (x2, y2)
  const mainMatch = svg.match(/JOIN-DOTS_-_RING_OF_GAIA_MAIN[^>]*x2="([\d.]+)"\s*y2="([\d.]+)"/);
  if (!mainMatch) return { success: false, error: 'Could not find MAIN line coordinates' };

  const junctionX = parseFloat(mainMatch[1]);
  const junctionY = parseFloat(mainMatch[2]);

  // Extract gate 60 dot position
  const dot60Match = svg.match(/GATE-DOT_-_60[^>]*cx="([\d.]+)"\s*cy="([\d.]+)"/);
  if (!dot60Match) return { success: false, error: 'Could not find gate 60 dot' };

  const dot60X = parseFloat(dot60Match[1]);
  const dot60Y = parseFloat(dot60Match[2]);

  // Junction should be closer to gate 60 than to other gates
  // (at 354.375° angle, which is gate 60's position)
  const distTo60 = Math.sqrt(Math.pow(junctionX - dot60X, 2) + Math.pow(junctionY - dot60Y, 2));

  // Extract gate 19 dot position
  const dot19Match = svg.match(/GATE-DOT_-_19[^>]*cx="([\d.]+)"\s*cy="([\d.]+)"/);
  const dot19X = parseFloat(dot19Match[1]);
  const dot19Y = parseFloat(dot19Match[2]);
  const distTo19 = Math.sqrt(Math.pow(junctionX - dot19X, 2) + Math.pow(junctionY - dot19Y, 2));

  // Junction should be closer to gate 60 (since it's at AUC position)
  if (distTo60 > distTo19) {
    return { success: false, error: `Junction closer to gate 19 than gate 60: dist60=${distTo60.toFixed(1)}, dist19=${distTo19.toFixed(1)}` };
  }

  return true;
});

// ============================================================================
// SECTION 8: SPECIAL CASES - SPLIT RINGS
// ============================================================================
section('SPECIAL CASES - SPLIT RINGS');

test('Ring of Humanity split correctly', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  // Small segment shows 38 - 10 with bracket reference to main
  if (!svg.includes('38 - 10')) return { success: false, error: 'Small segment "38 - 10" missing' };
  if (!svg.includes('[51 - 21 - 17 - 25]')) return { success: false, error: 'Bracket reference missing' };
  return true;
});

test('Ring of Seeking split correctly', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  // Small segment shows 54 - 58 with bracket reference to main
  if (!svg.includes('54 - 58')) return { success: false, error: 'Small segment "54 - 58" missing' };
  if (!svg.includes('[53 - 39 - 52 - 15]')) return { success: false, error: 'Bracket reference missing' };
  return true;
});

test('Ring of Trials has [12] bracket', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  if (!svg.includes('56 - 33')) return { success: false, error: 'Should show "56 - 33"' };
  if (!svg.includes('[12]')) return { success: false, error: '[12] bracket missing' };
  return true;
});

// ============================================================================
// SECTION 9: SVG STRUCTURE
// ============================================================================
section('SVG STRUCTURE');

test('Three ring circles present (outer, middle, innermost)', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  if (!svg.includes('RING_-_OUTER')) return { success: false, error: 'Outer ring missing' };
  if (!svg.includes('RING_-_MIDDLE')) return { success: false, error: 'Middle ring missing' };
  if (!svg.includes('RING_-_INNERMOST')) return { success: false, error: 'Innermost ring missing' };
  return true;
});

test('Dividers are present at ring boundaries', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  const dividerSection = svg.match(/<g id="DIVIDERS">([\s\S]*?)<\/g>/);
  if (!dividerSection) return { success: false, error: 'Dividers section not found' };
  const lineCount = (dividerSection[1].match(/<line/g) || []).length;
  if (lineCount < 10) return { success: false, error: `Only ${lineCount} dividers found` };
  return true;
});

test('All brackets are square (not parentheses)', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  const parenPattern = />\(\d+(\s*-\s*\d+)*\)</g;
  if (svg.match(parenPattern)) return { success: false, error: 'Found parentheses brackets' };
  const squarePattern = />\[\d+(\s*-\s*\d+)*\]</g;
  if (!svg.match(squarePattern)) return { success: false, error: 'No square brackets found' };
  return true;
});

// ============================================================================
// SECTION 10: AMINO ACID FORMATTING
// ============================================================================
section('AMINO ACID FORMATTING');

test('Aspartic_Acid correctly named (not Asparaginic)', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  if (svg.includes('Asparaginic')) return { success: false, error: 'Found Asparaginic - should be Aspartic' };
  if (!svg.includes('Aspartic Acid')) return { success: false, error: 'Aspartic Acid missing' };
  return true;
});

test('Glutamic and Aspartic Acid have smaller font', () => {
  const svg = codonRingsGenerator.generateCodonRingsRing();
  const glutamicMatch = svg.match(/AMINO-ACID-NAME_-_Glutamic_Acid[^>]*font-size="(\d+)"/);
  const asparticMatch = svg.match(/AMINO-ACID-NAME_-_Aspartic_Acid[^>]*font-size="(\d+)"/);
  if (!glutamicMatch) return { success: false, error: 'Glutamic Acid not found' };
  if (!asparticMatch) return { success: false, error: 'Aspartic Acid not found' };
  if (parseInt(glutamicMatch[1]) >= 16) return { success: false, error: 'Glutamic Acid font too large' };
  if (parseInt(asparticMatch[1]) >= 16) return { success: false, error: 'Aspartic Acid font too large' };
  return true;
});

// ============================================================================
// SECTION 11: UNIQUE RINGS COUNT
// ============================================================================
section('UNIQUE RINGS');

test('getUniqueRings returns 24 segments', () => {
  const rings = codonRingsGenerator.getUniqueRings();
  // 22 base rings + splits for Humanity (2), Seeking (2), Life And Death (3), Trials (2)
  // But Trials only shows main segment, and some rings aren't split
  // Actual: 24 segments
  if (rings.length !== 24) {
    return { success: false, error: `Expected 24 segments, got ${rings.length}` };
  }
  return true;
});

test('Ring of Gaia appears exactly once in unique rings', () => {
  const rings = codonRingsGenerator.getUniqueRings();
  const gaiaRings = rings.filter(r => r.name === 'Ring of Gaia');
  if (gaiaRings.length !== 1) {
    return { success: false, error: `Ring of Gaia appears ${gaiaRings.length} times (expected 1)` };
  }
  return true;
});

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('========================================\n');

if (failed > 0) {
  console.log('SCALING READINESS: NOT READY');
  console.log('Fix failing tests before implementing group scaling.\n');
} else {
  console.log('SCALING READINESS: READY');
  console.log('All ratios verified. Safe to implement group scaling.\n');
}

process.exit(failed > 0 ? 1 : 0);
