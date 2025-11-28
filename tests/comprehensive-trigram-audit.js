/**
 * COMPREHENSIVE TRIGRAM AUDIT
 *
 * This test verifies:
 * 1. Binary patterns are correct for all 64 gates
 * 2. Trigram binary mappings are correct
 * 3. Upper/lower trigram extraction is correct
 * 4. The resulting trigrams match I Ching standard
 */

const binaryData = require("../core/root-system/binary-identity.json").gates;

// AUTHORITATIVE: Standard I Ching trigram binary patterns (bottom-to-top)
const CORRECT_TRIGRAM_MAP = {
  '111': 'Heaven',    // ☰ All yang
  '000': 'Earth',     // ☷ All yin
  '100': 'Thunder',   // ☳ Yang at bottom only
  '010': 'Water',     // ☵ Yang in middle only
  '001': 'Mountain',  // ☶ Yang at top only
  '011': 'Wind',      // ☴ Yin at bottom only
  '101': 'Fire',      // ☲ Yin in middle only
  '110': 'Lake'       // ☱ Yin at top only
};

// AUTHORITATIVE: I Ching hexagram trigram compositions
// Format: Gate -> [Lower Trigram, Upper Trigram] (as they appear visually stacked)
const ICHING_STANDARD = {
  1:  ['Heaven', 'Heaven'],     // Creative
  2:  ['Earth', 'Earth'],       // Receptive
  3:  ['Thunder', 'Water'],     // Difficulty at Beginning - Water over Thunder
  4:  ['Water', 'Mountain'],    // Youthful Folly - Mountain over Water
  11: ['Heaven', 'Earth'],      // Peace - Earth over Heaven
  12: ['Earth', 'Heaven'],      // Standstill - Heaven over Earth
  29: ['Water', 'Water'],       // The Abysmal
  30: ['Fire', 'Fire'],         // The Clinging
  31: ['Mountain', 'Lake'],     // Influence - Lake over Mountain
  32: ['Wind', 'Thunder'],      // Duration - Thunder over Wind
  41: ['Lake', 'Mountain'],     // Decrease - Mountain over Lake
  42: ['Thunder', 'Wind'],      // Increase - Wind over Thunder
  51: ['Thunder', 'Thunder'],   // The Arousing
  52: ['Mountain', 'Mountain'], // Keeping Still
  57: ['Wind', 'Wind'],         // The Gentle
  58: ['Lake', 'Lake'],         // The Joyous
  63: ['Fire', 'Water'],        // After Completion - Water over Fire
  64: ['Water', 'Fire'],        // Before Completion - Fire over Water
};

console.log("═══════════════════════════════════════════════════════════════");
console.log("COMPREHENSIVE TRIGRAM AUDIT");
console.log("═══════════════════════════════════════════════════════════════\n");

// PART 1: Verify trigram extraction logic
console.log("PART 1: CORRECT TRIGRAM EXTRACTION LOGIC");
console.log("─────────────────────────────────────────────────────────────────");
console.log("Binary string: Index 0 = Line 1 (BOTTOM), Index 5 = Line 6 (TOP)");
console.log("");
console.log("CORRECT extraction:");
console.log("  Lower trigram = binary.substring(0, 3) = Lines 1-2-3 (bottom half)");
console.log("  Upper trigram = binary.substring(3, 6) = Lines 4-5-6 (top half)");
console.log("");

// Function to correctly extract trigrams
function getCorrectTrigrams(binary) {
  const lower = binary.substring(0, 3);  // First 3 chars = Lines 1-3 = Lower
  const upper = binary.substring(3, 6);  // Last 3 chars = Lines 4-6 = Upper
  return {
    lower: CORRECT_TRIGRAM_MAP[lower],
    upper: CORRECT_TRIGRAM_MAP[upper],
    lowerBinary: lower,
    upperBinary: upper
  };
}

// PART 2: Verify against I Ching standard
console.log("\nPART 2: VERIFICATION AGAINST I CHING STANDARD");
console.log("─────────────────────────────────────────────────────────────────\n");

let errors = [];
let successes = [];

for (const [gate, [expectedLower, expectedUpper]] of Object.entries(ICHING_STANDARD)) {
  const binary = binaryData[gate].binary;
  const trigrams = getCorrectTrigrams(binary);

  const lowerMatch = trigrams.lower === expectedLower;
  const upperMatch = trigrams.upper === expectedUpper;

  if (lowerMatch && upperMatch) {
    successes.push(gate);
    console.log(`✅ Gate ${gate.padStart(2)}: ${binary} -> Lower: ${trigrams.lower.padEnd(8)} Upper: ${trigrams.upper.padEnd(8)}`);
  } else {
    errors.push({ gate, binary, trigrams, expectedLower, expectedUpper });
    console.log(`❌ Gate ${gate.padStart(2)}: ${binary}`);
    console.log(`   Calculated: Lower=${trigrams.lower}, Upper=${trigrams.upper}`);
    console.log(`   Expected:   Lower=${expectedLower}, Upper=${expectedUpper}`);
  }
}

// PART 3: Check all 64 gates for trigram validity
console.log("\n\nPART 3: ALL 64 GATES - TRIGRAM CALCULATION");
console.log("─────────────────────────────────────────────────────────────────\n");

let invalidTrigrams = [];
for (let g = 1; g <= 64; g++) {
  const binary = binaryData[g].binary;
  const trigrams = getCorrectTrigrams(binary);

  if (!trigrams.lower || !trigrams.upper) {
    invalidTrigrams.push({ gate: g, binary, trigrams });
  }
}

if (invalidTrigrams.length > 0) {
  console.log("❌ Found gates with invalid trigram binaries:");
  invalidTrigrams.forEach(({ gate, binary, trigrams }) => {
    console.log(`   Gate ${gate}: ${binary} -> Lower=${trigrams.lowerBinary}, Upper=${trigrams.upperBinary}`);
  });
} else {
  console.log("✅ All 64 gates have valid trigram binary patterns");
}

// SUMMARY
console.log("\n═══════════════════════════════════════════════════════════════");
console.log("SUMMARY");
console.log("═══════════════════════════════════════════════════════════════");

if (errors.length === 0) {
  console.log(`\n✅ ALL ${successes.length} TESTED GATES MATCH I CHING STANDARD`);
  console.log("\nThe binary data is CORRECT.");
  console.log("The issue is in how upper/lower are extracted in positioning-algorithm.js");
} else {
  console.log(`\n❌ ${errors.length} GATES DO NOT MATCH I CHING STANDARD`);
  console.log("\nErrors found:");
  errors.forEach(e => {
    console.log(`   Gate ${e.gate}: Got ${e.trigrams.lower}/${e.trigrams.upper}, Expected ${e.expectedLower}/${e.expectedUpper}`);
  });
}

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("RECOMMENDED FIX FOR positioning-algorithm.js");
console.log("═══════════════════════════════════════════════════════════════");
console.log(`
In getTrigrams() function, change:

FROM (INCORRECT):
  const upper = binary.substring(0, 3);  // Lines 4-6 (top)
  const lower = binary.substring(3, 6);  // Lines 1-3 (bottom)

TO (CORRECT):
  const lower = binary.substring(0, 3);  // Lines 1-3 (bottom)
  const upper = binary.substring(3, 6);  // Lines 4-6 (top)
`);
