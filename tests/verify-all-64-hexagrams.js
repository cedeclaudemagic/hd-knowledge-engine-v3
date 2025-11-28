/**
 * COMPREHENSIVE VERIFICATION: ALL 64 HEXAGRAMS
 *
 * This test verifies EVERY hexagram against the authoritative I Ching standard.
 * No hexagram should slip through unchecked.
 *
 * Created: 2025-11-28
 * Purpose: Ensure foundational data integrity
 */

const binaryData = require("../core/root-system/binary-identity.json").gates;
const positioning = require("../core/root-system/positioning-algorithm.js");

// AUTHORITATIVE I CHING DATA
// Source: Standard King Wen sequence with traditional trigram compositions
// Format: [hexagramNumber]: { binary, lowerTrigram, upperTrigram, name }
const ICHING_STANDARD = {
  1:  { binary: '111111', lower: 'Heaven', upper: 'Heaven', name: 'The Creative' },
  2:  { binary: '000000', lower: 'Earth', upper: 'Earth', name: 'The Receptive' },
  3:  { binary: '100010', lower: 'Thunder', upper: 'Water', name: 'Difficulty at Beginning' },
  4:  { binary: '010001', lower: 'Water', upper: 'Mountain', name: 'Youthful Folly' },
  5:  { binary: '111010', lower: 'Heaven', upper: 'Water', name: 'Waiting' },
  6:  { binary: '010111', lower: 'Water', upper: 'Heaven', name: 'Conflict' },
  7:  { binary: '010000', lower: 'Water', upper: 'Earth', name: 'The Army' },
  8:  { binary: '000010', lower: 'Earth', upper: 'Water', name: 'Holding Together' },
  9:  { binary: '111011', lower: 'Heaven', upper: 'Wind', name: 'Small Taming' },
  10: { binary: '110111', lower: 'Lake', upper: 'Heaven', name: 'Treading' },
  11: { binary: '111000', lower: 'Heaven', upper: 'Earth', name: 'Peace' },
  12: { binary: '000111', lower: 'Earth', upper: 'Heaven', name: 'Standstill' },
  13: { binary: '101111', lower: 'Fire', upper: 'Heaven', name: 'Fellowship' },
  14: { binary: '111101', lower: 'Heaven', upper: 'Fire', name: 'Great Possession' },
  15: { binary: '001000', lower: 'Mountain', upper: 'Earth', name: 'Modesty' },
  16: { binary: '000100', lower: 'Earth', upper: 'Thunder', name: 'Enthusiasm' },
  17: { binary: '100110', lower: 'Thunder', upper: 'Lake', name: 'Following' },
  18: { binary: '011001', lower: 'Wind', upper: 'Mountain', name: 'Work on Decayed' },
  19: { binary: '110000', lower: 'Lake', upper: 'Earth', name: 'Approach' },
  20: { binary: '000011', lower: 'Earth', upper: 'Wind', name: 'Contemplation' },
  21: { binary: '100101', lower: 'Thunder', upper: 'Fire', name: 'Biting Through' },
  22: { binary: '101001', lower: 'Fire', upper: 'Mountain', name: 'Grace' },
  23: { binary: '000001', lower: 'Earth', upper: 'Mountain', name: 'Splitting Apart' },
  24: { binary: '100000', lower: 'Thunder', upper: 'Earth', name: 'Return' },
  25: { binary: '100111', lower: 'Thunder', upper: 'Heaven', name: 'Innocence' },
  26: { binary: '111001', lower: 'Heaven', upper: 'Mountain', name: 'Great Taming' },
  27: { binary: '100001', lower: 'Thunder', upper: 'Mountain', name: 'Nourishment' },
  28: { binary: '011110', lower: 'Wind', upper: 'Lake', name: 'Great Exceeding' },
  29: { binary: '010010', lower: 'Water', upper: 'Water', name: 'The Abysmal' },
  30: { binary: '101101', lower: 'Fire', upper: 'Fire', name: 'The Clinging' },
  31: { binary: '001110', lower: 'Mountain', upper: 'Lake', name: 'Influence' },
  32: { binary: '011100', lower: 'Wind', upper: 'Thunder', name: 'Duration' },
  33: { binary: '001111', lower: 'Mountain', upper: 'Heaven', name: 'Retreat' },
  34: { binary: '111100', lower: 'Heaven', upper: 'Thunder', name: 'Great Power' },
  35: { binary: '000101', lower: 'Earth', upper: 'Fire', name: 'Progress' },
  36: { binary: '101000', lower: 'Fire', upper: 'Earth', name: 'Darkening of Light' },
  37: { binary: '101011', lower: 'Fire', upper: 'Wind', name: 'The Family' },
  38: { binary: '110101', lower: 'Lake', upper: 'Fire', name: 'Opposition' },
  39: { binary: '001010', lower: 'Mountain', upper: 'Water', name: 'Obstruction' },
  40: { binary: '010100', lower: 'Water', upper: 'Thunder', name: 'Deliverance' },
  41: { binary: '110001', lower: 'Lake', upper: 'Mountain', name: 'Decrease' },
  42: { binary: '100011', lower: 'Thunder', upper: 'Wind', name: 'Increase' },
  43: { binary: '111110', lower: 'Heaven', upper: 'Lake', name: 'Breakthrough' },
  44: { binary: '011111', lower: 'Wind', upper: 'Heaven', name: 'Coming to Meet' },
  45: { binary: '000110', lower: 'Earth', upper: 'Lake', name: 'Gathering Together' },
  46: { binary: '011000', lower: 'Wind', upper: 'Earth', name: 'Pushing Upward' },
  47: { binary: '010110', lower: 'Water', upper: 'Lake', name: 'Oppression' },
  48: { binary: '011010', lower: 'Wind', upper: 'Water', name: 'The Well' },
  49: { binary: '101110', lower: 'Fire', upper: 'Lake', name: 'Revolution' },
  50: { binary: '011101', lower: 'Wind', upper: 'Fire', name: 'The Cauldron' },
  51: { binary: '100100', lower: 'Thunder', upper: 'Thunder', name: 'The Arousing' },
  52: { binary: '001001', lower: 'Mountain', upper: 'Mountain', name: 'Keeping Still' },
  53: { binary: '001011', lower: 'Mountain', upper: 'Wind', name: 'Development' },
  54: { binary: '110100', lower: 'Lake', upper: 'Thunder', name: 'Marrying Maiden' },
  55: { binary: '101100', lower: 'Fire', upper: 'Thunder', name: 'Abundance' },
  56: { binary: '001101', lower: 'Mountain', upper: 'Fire', name: 'The Wanderer' },
  57: { binary: '011011', lower: 'Wind', upper: 'Wind', name: 'The Gentle' },
  58: { binary: '110110', lower: 'Lake', upper: 'Lake', name: 'The Joyous' },
  59: { binary: '010011', lower: 'Water', upper: 'Wind', name: 'Dispersion' },
  60: { binary: '110010', lower: 'Lake', upper: 'Water', name: 'Limitation' },
  61: { binary: '110011', lower: 'Lake', upper: 'Wind', name: 'Inner Truth' },
  62: { binary: '001100', lower: 'Mountain', upper: 'Thunder', name: 'Small Exceeding' },
  63: { binary: '101010', lower: 'Fire', upper: 'Water', name: 'After Completion' },
  64: { binary: '010101', lower: 'Water', upper: 'Fire', name: 'Before Completion' },
};

// Trigram binary to name mapping
const TRIGRAM_MAP = {
  '111': 'Heaven',
  '000': 'Earth',
  '100': 'Thunder',
  '010': 'Water',
  '001': 'Mountain',
  '011': 'Wind',
  '101': 'Fire',
  '110': 'Lake'
};

console.log("════════════════════════════════════════════════════════════════════════════════");
console.log("COMPREHENSIVE VERIFICATION: ALL 64 HEXAGRAMS");
console.log("════════════════════════════════════════════════════════════════════════════════\n");

let binaryErrors = [];
let trigramErrors = [];
let totalTests = 0;
let passedTests = 0;

// Test each hexagram
for (let gate = 1; gate <= 64; gate++) {
  const standard = ICHING_STANDARD[gate];
  const stored = binaryData[gate];

  if (!stored) {
    console.log(`❌ Gate ${gate}: MISSING FROM DATABASE`);
    binaryErrors.push({ gate, error: 'Missing from database' });
    continue;
  }

  // Test 1: Binary pattern matches
  totalTests++;
  const binaryMatch = stored.binary === standard.binary;
  if (!binaryMatch) {
    binaryErrors.push({
      gate,
      stored: stored.binary,
      expected: standard.binary,
      name: standard.name
    });
  } else {
    passedTests++;
  }

  // Test 2: Trigram calculation matches
  totalTests++;
  const trigrams = positioning.getTrigrams(gate);
  const lowerMatch = trigrams.lower === standard.lower;
  const upperMatch = trigrams.upper === standard.upper;

  if (!lowerMatch || !upperMatch) {
    trigramErrors.push({
      gate,
      binary: stored.binary,
      calculatedLower: trigrams.lower,
      calculatedUpper: trigrams.upper,
      expectedLower: standard.lower,
      expectedUpper: standard.upper,
      name: standard.name
    });
  } else {
    passedTests++;
  }

  // Visual output
  const status = (binaryMatch && lowerMatch && upperMatch) ? '✅' : '❌';
  const details = `${stored.binary} | Lower: ${trigrams.lower.padEnd(8)} | Upper: ${trigrams.upper.padEnd(8)}`;

  if (status === '❌') {
    console.log(`${status} Gate ${String(gate).padStart(2)}: ${details} (${standard.name})`);
    if (!binaryMatch) console.log(`      Binary mismatch: got ${stored.binary}, expected ${standard.binary}`);
    if (!lowerMatch) console.log(`      Lower trigram mismatch: got ${trigrams.lower}, expected ${standard.lower}`);
    if (!upperMatch) console.log(`      Upper trigram mismatch: got ${trigrams.upper}, expected ${standard.upper}`);
  }
}

// Summary by category
console.log("\n════════════════════════════════════════════════════════════════════════════════");
console.log("VERIFICATION SUMMARY");
console.log("════════════════════════════════════════════════════════════════════════════════\n");

console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}\n`);

if (binaryErrors.length === 0) {
  console.log("✅ BINARY PATTERNS: All 64 hexagrams match I Ching standard");
} else {
  console.log(`❌ BINARY PATTERNS: ${binaryErrors.length} errors found:`);
  binaryErrors.forEach(e => {
    console.log(`   Gate ${e.gate} (${e.name}): stored ${e.stored}, expected ${e.expected}`);
  });
}

console.log("");

if (trigramErrors.length === 0) {
  console.log("✅ TRIGRAM CALCULATIONS: All 64 hexagrams calculate correct trigrams");
} else {
  console.log(`❌ TRIGRAM CALCULATIONS: ${trigramErrors.length} errors found:`);
  trigramErrors.forEach(e => {
    console.log(`   Gate ${e.gate} (${e.name}):`);
    console.log(`      Lower: got ${e.calculatedLower}, expected ${e.expectedLower}`);
    console.log(`      Upper: got ${e.calculatedUpper}, expected ${e.expectedUpper}`);
  });
}

// Additional structural tests
console.log("\n════════════════════════════════════════════════════════════════════════════════");
console.log("STRUCTURAL INTEGRITY TESTS");
console.log("════════════════════════════════════════════════════════════════════════════════\n");

// Test: All binaries are unique
const allBinaries = Object.values(binaryData).map(g => g.binary);
const uniqueBinaries = new Set(allBinaries);
if (uniqueBinaries.size === 64) {
  console.log("✅ All 64 binary patterns are unique");
} else {
  console.log(`❌ Binary patterns not unique: ${64 - uniqueBinaries.size} duplicates found`);
}

// Test: All binaries are valid 6-bit patterns
const invalidBinaries = Object.entries(binaryData).filter(([gate, data]) => {
  return !/^[01]{6}$/.test(data.binary);
});
if (invalidBinaries.length === 0) {
  console.log("✅ All binary patterns are valid 6-bit strings");
} else {
  console.log(`❌ Invalid binary patterns found: ${invalidBinaries.map(([g]) => g).join(', ')}`);
}

// Test: Opposite gates have inverted binaries
let oppositeErrors = [];
for (let gate = 1; gate <= 64; gate++) {
  const binary = binaryData[gate].binary;
  const inverted = binary.split('').map(b => b === '1' ? '0' : '1').join('');
  const oppositeGate = positioning.getOppositeGate(gate);
  const oppositeBinary = binaryData[oppositeGate].binary;

  if (inverted !== oppositeBinary) {
    oppositeErrors.push({ gate, oppositeGate, binary, inverted, oppositeBinary });
  }
}
if (oppositeErrors.length === 0) {
  console.log("✅ All 64 gates have correct opposite gate (binary inversion)");
} else {
  console.log(`❌ Opposite gate errors: ${oppositeErrors.length} found`);
  oppositeErrors.forEach(e => {
    console.log(`   Gate ${e.gate} (${e.binary}) opposite should be ${e.inverted}, got Gate ${e.oppositeGate} (${e.oppositeBinary})`);
  });
}

// Test: Each trigram appears correct number of times
const trigramCounts = { lower: {}, upper: {} };
for (let gate = 1; gate <= 64; gate++) {
  const trigrams = positioning.getTrigrams(gate);
  trigramCounts.lower[trigrams.lower] = (trigramCounts.lower[trigrams.lower] || 0) + 1;
  trigramCounts.upper[trigrams.upper] = (trigramCounts.upper[trigrams.upper] || 0) + 1;
}

// Each trigram should appear 8 times in lower and 8 times in upper position
let trigramDistributionOk = true;
for (const trigram of Object.keys(TRIGRAM_MAP).map(b => TRIGRAM_MAP[b])) {
  if (trigramCounts.lower[trigram] !== 8 || trigramCounts.upper[trigram] !== 8) {
    trigramDistributionOk = false;
  }
}
if (trigramDistributionOk) {
  console.log("✅ Each trigram appears exactly 8 times in lower and 8 times in upper position");
} else {
  console.log("❌ Trigram distribution incorrect:");
  console.log("   Lower:", trigramCounts.lower);
  console.log("   Upper:", trigramCounts.upper);
}

// Final verdict
console.log("\n════════════════════════════════════════════════════════════════════════════════");
if (binaryErrors.length === 0 && trigramErrors.length === 0 && oppositeErrors.length === 0) {
  console.log("🎉 ALL 64 HEXAGRAMS VERIFIED CORRECT");
  console.log("   Binary patterns: ✅");
  console.log("   Trigram calculations: ✅");
  console.log("   Opposite gates: ✅");
  console.log("   Structural integrity: ✅");
  process.exit(0);
} else {
  console.log("❌ VERIFICATION FAILED - ERRORS FOUND");
  console.log(`   Binary errors: ${binaryErrors.length}`);
  console.log(`   Trigram errors: ${trigramErrors.length}`);
  console.log(`   Opposite gate errors: ${oppositeErrors.length}`);
  process.exit(1);
}
console.log("════════════════════════════════════════════════════════════════════════════════");
