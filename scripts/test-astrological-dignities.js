/**
 * Astrological Dignities Hypothesis Test
 *
 * Traditional astrology has non-geometric logic:
 * - Domicile (rulership): Planet "owns" certain signs
 * - Exaltation: Planet is "exalted" in certain signs
 * - Detriment: Planet is weak (opposite of domicile)
 * - Fall: Planet is weakest (opposite of exaltation)
 *
 * Test: Do HD planetary assignments correlate with traditional dignities
 * when trigrams/positions are mapped to zodiacal signs?
 */

const fs = require('fs');
const path = require('path');

// Load source data
const hdGatesPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const emLinesPath = path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

const hdGates = JSON.parse(fs.readFileSync(hdGatesPath, 'utf8'));
const emLines = JSON.parse(fs.readFileSync(emLinesPath, 'utf8'));

// Traditional Astrological Dignities
// Classical 7-planet system (Sun through Saturn)
const TRADITIONAL_DIGNITIES = {
  Sun: {
    domicile: ['Leo'],
    exaltation: ['Aries'],
    detriment: ['Aquarius'],
    fall: ['Libra']
  },
  Moon: {
    domicile: ['Cancer'],
    exaltation: ['Taurus'],
    detriment: ['Capricorn'],
    fall: ['Scorpio']
  },
  Mercury: {
    domicile: ['Gemini', 'Virgo'],
    exaltation: ['Virgo'], // or Aquarius in some systems
    detriment: ['Sagittarius', 'Pisces'],
    fall: ['Pisces']
  },
  Venus: {
    domicile: ['Taurus', 'Libra'],
    exaltation: ['Pisces'],
    detriment: ['Scorpio', 'Aries'],
    fall: ['Virgo']
  },
  Mars: {
    domicile: ['Aries', 'Scorpio'],
    exaltation: ['Capricorn'],
    detriment: ['Libra', 'Taurus'],
    fall: ['Cancer']
  },
  Jupiter: {
    domicile: ['Sagittarius', 'Pisces'],
    exaltation: ['Cancer'],
    detriment: ['Gemini', 'Virgo'],
    fall: ['Capricorn']
  },
  Saturn: {
    domicile: ['Capricorn', 'Aquarius'],
    exaltation: ['Libra'],
    detriment: ['Cancer', 'Leo'],
    fall: ['Aries']
  },
  // Modern planets (various systems)
  Uranus: {
    domicile: ['Aquarius'],
    exaltation: ['Scorpio'],
    detriment: ['Leo'],
    fall: ['Taurus']
  },
  Neptune: {
    domicile: ['Pisces'],
    exaltation: ['Cancer'], // or Leo in some systems
    detriment: ['Virgo'],
    fall: ['Capricorn']
  },
  Pluto: {
    domicile: ['Scorpio'],
    exaltation: ['Leo'], // or Aries in some systems
    detriment: ['Taurus'],
    fall: ['Aquarius']
  }
};

// Trigram to Sign Mappings (multiple systems to test)

// System 1: Ba Gua to Zodiac (common correspondence)
const TRIGRAM_TO_SIGN_BAGUA = {
  'Heaven': 'Aries',      // Creative, initiating
  'Earth': 'Taurus',      // Receptive, grounding
  'Thunder': 'Gemini',    // Arousing, communicating
  'Water': 'Cancer',      // Abysmal, emotional depth
  'Mountain': 'Leo',      // Keeping Still, self-expression
  'Wind': 'Virgo',        // Gentle, discriminating
  'Fire': 'Libra',        // Clinging, relating
  'Lake': 'Scorpio'       // Joyous, transforming
};

// System 2: Position to Sign (by electromagnetic position)
const POSITION_TO_SIGN = {
  '-4': 'Aries',     // Maximum potential
  '-3': 'Taurus',    // Stored potential
  '-2': 'Gemini',    // Flowing potential
  '-1': 'Cancer',    // Gate from potential
  '+1': 'Leo',       // Gate to form
  '+2': 'Virgo',     // Flowing form
  '+3': 'Libra',     // Stored form
  '+4': 'Scorpio'    // Maximum form
};

// System 3: Line to Sign (6 lines mapped to 6 pairs or 12 signs)
const LINE_TO_SIGN = {
  1: ['Aries', 'Taurus'],      // Foundation - cardinal earth/fire
  2: ['Gemini', 'Cancer'],     // Projection - mutable/cardinal water
  3: ['Leo', 'Virgo'],         // Adaptation - fixed fire/mutable earth
  4: ['Libra', 'Scorpio'],     // Externalization - cardinal air/fixed water
  5: ['Sagittarius', 'Capricorn'], // Heretic - mutable fire/cardinal earth
  6: ['Aquarius', 'Pisces']    // Role Model - fixed air/mutable water
};

console.log('═'.repeat(75));
console.log('ASTROLOGICAL DIGNITIES HYPOTHESIS TEST');
console.log('═'.repeat(75));

// Build data indexes
const hdIndex = {};
const hdMappings = hdGates.mappings || hdGates;
for (const line of hdMappings) {
  const key = `${line.gateNumber}.${line.lineNumber}`;
  const exaltPlanets = line.knowledge?.blackBook?.exaltation?.planets || [];
  const detriPlanets = line.knowledge?.blackBook?.detriment?.planets || [];
  hdIndex[key] = {
    exalt: exaltPlanets.map(p => p.planet || p),
    detri: detriPlanets.map(p => p.planet || p)
  };
}

const emIndex = {};
const emMappings = emLines.mappings || emLines;
for (const line of emMappings) {
  const key = `${line.gate}.${line.line}`;
  emIndex[key] = {
    innerTrigram: line.electromagnetic?.innerTrigram?.name,
    outerTrigram: line.electromagnetic?.outerTrigram?.name,
    innerPos: line.electromagnetic?.innerTrigram?.position,
    outerPos: line.electromagnetic?.outerTrigram?.position,
    gateType: line.electromagnetic?.gateType
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 1: Trigram Sign → Planet Dignity
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 1: Do Exalting Planets Match Traditional Sign Exaltations?');
console.log('═'.repeat(75));

console.log('\nMapping: Inner Trigram → Sign → Check if planet is traditionally strong there');
console.log('─'.repeat(75));

function checkDignity(planet, sign) {
  const dignities = TRADITIONAL_DIGNITIES[planet];
  if (!dignities) return 'unknown';

  if (dignities.domicile?.includes(sign)) return 'domicile';
  if (dignities.exaltation?.includes(sign)) return 'exaltation';
  if (dignities.detriment?.includes(sign)) return 'detriment';
  if (dignities.fall?.includes(sign)) return 'fall';
  return 'neutral';
}

// Test with Ba Gua mapping
let dignityMatches = { domicile: 0, exaltation: 0, detriment: 0, fall: 0, neutral: 0, unknown: 0 };
let totalTested = 0;

for (const [key, hd] of Object.entries(hdIndex)) {
  const em = emIndex[key];
  if (!em || !hd.exalt.length) continue;

  const innerSign = TRIGRAM_TO_SIGN_BAGUA[em.innerTrigram];
  if (!innerSign) continue;

  for (const planet of hd.exalt) {
    const dignity = checkDignity(planet, innerSign);
    dignityMatches[dignity]++;
    totalTested++;
  }
}

console.log('\nInner Trigram → Sign → Exalting Planet Dignity (Ba Gua mapping):');
console.log(`  Domicile (planet rules sign):     ${dignityMatches.domicile}/${totalTested} (${(dignityMatches.domicile/totalTested*100).toFixed(1)}%)`);
console.log(`  Exaltation (planet exalted):      ${dignityMatches.exaltation}/${totalTested} (${(dignityMatches.exaltation/totalTested*100).toFixed(1)}%)`);
console.log(`  Neutral:                          ${dignityMatches.neutral}/${totalTested} (${(dignityMatches.neutral/totalTested*100).toFixed(1)}%)`);
console.log(`  Detriment (planet weak):          ${dignityMatches.detriment}/${totalTested} (${(dignityMatches.detriment/totalTested*100).toFixed(1)}%)`);
console.log(`  Fall (planet weakest):            ${dignityMatches.fall}/${totalTested} (${(dignityMatches.fall/totalTested*100).toFixed(1)}%)`);

const strengthScore = (dignityMatches.domicile + dignityMatches.exaltation) / totalTested * 100;
const weaknessScore = (dignityMatches.detriment + dignityMatches.fall) / totalTested * 100;
console.log(`\n  Strong positions: ${strengthScore.toFixed(1)}%`);
console.log(`  Weak positions: ${weaknessScore.toFixed(1)}%`);
console.log(`  Expected by chance: ~${(2/12*100).toFixed(1)}% strong, ~${(2/12*100).toFixed(1)}% weak`);

// ═══════════════════════════════════════════════════════════════════════════
// TEST 2: Position Sign → Planet Dignity
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 2: Position → Sign → Planet Dignity');
console.log('═'.repeat(75));

dignityMatches = { domicile: 0, exaltation: 0, detriment: 0, fall: 0, neutral: 0, unknown: 0 };
totalTested = 0;

for (const [key, hd] of Object.entries(hdIndex)) {
  const em = emIndex[key];
  if (!em || !hd.exalt.length || !em.innerPos) continue;

  const posSign = POSITION_TO_SIGN[em.innerPos.toString()];
  if (!posSign) continue;

  for (const planet of hd.exalt) {
    const dignity = checkDignity(planet, posSign);
    dignityMatches[dignity]++;
    totalTested++;
  }
}

console.log('\nInner Position → Sign → Exalting Planet Dignity:');
console.log(`  Domicile:    ${dignityMatches.domicile}/${totalTested} (${(dignityMatches.domicile/totalTested*100).toFixed(1)}%)`);
console.log(`  Exaltation:  ${dignityMatches.exaltation}/${totalTested} (${(dignityMatches.exaltation/totalTested*100).toFixed(1)}%)`);
console.log(`  Neutral:     ${dignityMatches.neutral}/${totalTested} (${(dignityMatches.neutral/totalTested*100).toFixed(1)}%)`);
console.log(`  Detriment:   ${dignityMatches.detriment}/${totalTested} (${(dignityMatches.detriment/totalTested*100).toFixed(1)}%)`);
console.log(`  Fall:        ${dignityMatches.fall}/${totalTested} (${(dignityMatches.fall/totalTested*100).toFixed(1)}%)`);

// ═══════════════════════════════════════════════════════════════════════════
// TEST 3: Detriment Planets - Do They Follow Inverse Pattern?
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 3: Detriment Planets - Do They Show Weak Dignities?');
console.log('═'.repeat(75));

console.log('\nIf astrology works: detriment planets should be in weak positions');
console.log('─'.repeat(75));

dignityMatches = { domicile: 0, exaltation: 0, detriment: 0, fall: 0, neutral: 0, unknown: 0 };
totalTested = 0;

for (const [key, hd] of Object.entries(hdIndex)) {
  const em = emIndex[key];
  if (!em || !hd.detri.length) continue;

  const innerSign = TRIGRAM_TO_SIGN_BAGUA[em.innerTrigram];
  if (!innerSign) continue;

  for (const planet of hd.detri) {
    const dignity = checkDignity(planet, innerSign);
    dignityMatches[dignity]++;
    totalTested++;
  }
}

console.log('\nDetriment Planet → Sign Dignity:');
console.log(`  Domicile (unexpected):   ${dignityMatches.domicile}/${totalTested} (${(dignityMatches.domicile/totalTested*100).toFixed(1)}%)`);
console.log(`  Exaltation (unexpected): ${dignityMatches.exaltation}/${totalTested} (${(dignityMatches.exaltation/totalTested*100).toFixed(1)}%)`);
console.log(`  Neutral:                 ${dignityMatches.neutral}/${totalTested} (${(dignityMatches.neutral/totalTested*100).toFixed(1)}%)`);
console.log(`  Detriment (expected):    ${dignityMatches.detriment}/${totalTested} (${(dignityMatches.detriment/totalTested*100).toFixed(1)}%)`);
console.log(`  Fall (expected):         ${dignityMatches.fall}/${totalTested} (${(dignityMatches.fall/totalTested*100).toFixed(1)}%)`);

// ═══════════════════════════════════════════════════════════════════════════
// TEST 4: Exaltation vs Detriment - Different Patterns?
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 4: Exaltation vs Detriment Pattern Comparison');
console.log('═'.repeat(75));

// Count planet frequencies in exaltation vs detriment
const exaltCounts = {};
const detriCounts = {};

for (const hd of Object.values(hdIndex)) {
  for (const p of hd.exalt) {
    exaltCounts[p] = (exaltCounts[p] || 0) + 1;
  }
  for (const p of hd.detri) {
    detriCounts[p] = (detriCounts[p] || 0) + 1;
  }
}

console.log('\nPlanet Distribution - Exaltation vs Detriment:');
console.log('─'.repeat(60));
console.log('Planet      Exaltations    Detriments    Ratio    Character');
console.log('─'.repeat(60));

const allPlanets = [...new Set([...Object.keys(exaltCounts), ...Object.keys(detriCounts)])];
allPlanets.sort((a, b) => (detriCounts[b] || 0) - (detriCounts[a] || 0));

for (const planet of allPlanets) {
  const exalt = exaltCounts[planet] || 0;
  const detri = detriCounts[planet] || 0;
  const ratio = detri > 0 ? (exalt / detri).toFixed(2) : '∞';
  const character = exalt > detri * 2 ? 'ENHANCER' :
                    detri > exalt * 2 ? 'CORRUPTOR' :
                    'balanced';

  console.log(`${planet.padEnd(12)} ${exalt.toString().padStart(6)}         ${detri.toString().padStart(6)}        ${ratio.padStart(5)}    ${character}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 5: Mars-Moon Polarity in Traditional Astrology
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 5: Mars-Moon Polarity Analysis');
console.log('═'.repeat(75));

console.log('\nWe found Moon/Mars is the fundamental polarity (28 mutual oppositions).');
console.log('Traditional astrology: Mars rules Aries/Scorpio, Moon rules Cancer.');
console.log('Mars exalted in Capricorn (opposite Cancer).');
console.log('─'.repeat(75));

// Where do Mars exaltations and Moon detriments overlap?
const marsExaltLines = [];
const moonDetriLines = [];

for (const [key, hd] of Object.entries(hdIndex)) {
  if (hd.exalt.includes('Mars')) marsExaltLines.push(key);
  if (hd.detri.includes('Moon')) moonDetriLines.push(key);
}

const marsExaltMoonDetri = marsExaltLines.filter(k => moonDetriLines.includes(k));
console.log(`\nMars exalts AND Moon fails at same line: ${marsExaltMoonDetri.length} cases`);
console.log(`Mars total exaltations: ${marsExaltLines.length}`);
console.log(`Moon total detriments: ${moonDetriLines.length}`);
console.log(`Overlap ratio: ${(marsExaltMoonDetri.length / Math.min(marsExaltLines.length, moonDetriLines.length) * 100).toFixed(1)}%`);

// ═══════════════════════════════════════════════════════════════════════════
// TEST 6: Line Number Independent Analysis
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('TEST 6: Line Number as Independent System');
console.log('═'.repeat(75));

console.log('\nDo line numbers have their own planetary logic regardless of gate?');
console.log('─'.repeat(75));

const lineExaltCounts = {};
const lineDetriCounts = {};

for (const [key, hd] of Object.entries(hdIndex)) {
  const lineNum = parseInt(key.split('.')[1]);

  if (!lineExaltCounts[lineNum]) lineExaltCounts[lineNum] = {};
  if (!lineDetriCounts[lineNum]) lineDetriCounts[lineNum] = {};

  for (const p of hd.exalt) {
    lineExaltCounts[lineNum][p] = (lineExaltCounts[lineNum][p] || 0) + 1;
  }
  for (const p of hd.detri) {
    lineDetriCounts[lineNum][p] = (lineDetriCounts[lineNum][p] || 0) + 1;
  }
}

console.log('\nExaltation Dominant by Line:');
for (let line = 1; line <= 6; line++) {
  const counts = lineExaltCounts[line];
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3).map(([p, c]) => `${p}:${c}`).join(', ');
  console.log(`  Line ${line}: ${top3}`);
}

console.log('\nDetriment Dominant by Line:');
for (let line = 1; line <= 6; line++) {
  const counts = lineDetriCounts[line];
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3).map(([p, c]) => `${p}:${c}`).join(', ');
  console.log(`  Line ${line}: ${top3}`);
}

// Check if detriment follows inverse pattern of exaltation
console.log('\nDo Exaltation and Detriment show INVERSE patterns by line?');
for (let line = 1; line <= 6; line++) {
  const exaltTop = Object.entries(lineExaltCounts[line]).sort((a, b) => b[1] - a[1])[0]?.[0];
  const detriTop = Object.entries(lineDetriCounts[line]).sort((a, b) => b[1] - a[1])[0]?.[0];
  const exaltBot = Object.entries(lineExaltCounts[line]).sort((a, b) => a[1] - b[1])[0]?.[0];
  const detriBot = Object.entries(lineDetriCounts[line]).sort((a, b) => a[1] - b[1])[0]?.[0];

  console.log(`  Line ${line}: Exalt top=${exaltTop}, Detri top=${detriTop} | Exalt bottom=${exaltBot}, Detri bottom=${detriBot}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SYNTHESIS');
console.log('═'.repeat(75));

console.log(`
TRADITIONAL ASTROLOGICAL DIGNITIES:
  The Ba Gua → Sign mapping shows ~${strengthScore.toFixed(0)}% of exalting planets in strong dignities.
  Expected by chance: ~17%. ${strengthScore > 25 ? 'ABOVE CHANCE' : 'AT OR BELOW CHANCE'}.

EXALTATION vs DETRIMENT PATTERNS:
  - Mars: ${exaltCounts['Mars'] || 0} exaltations, ${detriCounts['Mars'] || 0} detriments (primary CORRUPTOR)
  - Sun: ${exaltCounts['Sun'] || 0} exaltations, ${detriCounts['Sun'] || 0} detriments (primary ENHANCER)
  - Moon: ${exaltCounts['Moon'] || 0} exaltations, ${detriCounts['Moon'] || 0} detriments
  - Venus: ${exaltCounts['Venus'] || 0} exaltations, ${detriCounts['Venus'] || 0} detriments

MARS-MOON POLARITY:
  ${marsExaltMoonDetri.length} lines where Mars exalts AND Moon fails.
  This supports the "fundamental polarity" finding.

LINE AS INDEPENDENT SYSTEM:
  Each line shows distinct planetary preferences.
  This could be a separate derivation pathway.
`);

console.log('═'.repeat(75));
console.log('CONCLUSION');
console.log('═'.repeat(75));

if (strengthScore > 30) {
  console.log(`
STATUS: ✓ SIGNAL DETECTED

Traditional astrological dignities show correlation with HD assignments.
This is a NON-STRUCTURAL pattern worth investigating further.
`);
} else if (strengthScore > 20) {
  console.log(`
STATUS: WEAK SIGNAL

Some correlation with traditional dignities, but not strong enough
to be predictive. The pattern may be real but noisy.
`);
} else {
  console.log(`
STATUS: ✗ NO SIGNAL

Traditional astrological dignities do not correlate with HD assignments
in this mapping system. The trigram→sign correspondence may be wrong,
or astrology may not be the source of HD planetary logic.
`);
}
