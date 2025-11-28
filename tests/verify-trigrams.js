/**
 * Verify trigram calculations against I Ching standard
 */

const positioning = require("../core/root-system/positioning-algorithm.js");
const binaryData = require("../core/root-system/binary-identity.json").gates;

console.log("═══════════════════════════════════════════════════════════════");
console.log("TRIGRAM CALCULATION VERIFICATION");
console.log("Binary convention: index 0-2 = upper trigram, index 3-5 = lower trigram");
console.log("═══════════════════════════════════════════════════════════════\n");

// Test cases with known trigrams from I Ching
const testCases = [
  { gate: 1, expectedLower: "Heaven", expectedUpper: "Heaven" },
  { gate: 2, expectedLower: "Earth", expectedUpper: "Earth" },
  { gate: 11, expectedLower: "Heaven", expectedUpper: "Earth" },
  { gate: 12, expectedLower: "Earth", expectedUpper: "Heaven" },
  { gate: 29, expectedLower: "Water", expectedUpper: "Water" },
  { gate: 30, expectedLower: "Fire", expectedUpper: "Fire" },
  { gate: 51, expectedLower: "Thunder", expectedUpper: "Thunder" },
  { gate: 52, expectedLower: "Mountain", expectedUpper: "Mountain" },
  { gate: 63, expectedLower: "Fire", expectedUpper: "Water" },
  { gate: 64, expectedLower: "Water", expectedUpper: "Fire" },
];

let errors = [];

for (const test of testCases) {
  const binary = binaryData[test.gate].binary;
  const trigrams = positioning.getTrigrams(test.gate);

  const lowerMatch = trigrams.lower === test.expectedLower;
  const upperMatch = trigrams.upper === test.expectedUpper;

  console.log("Gate " + test.gate + " (binary: " + binary + "):");
  console.log("  Lower (lines 1-3): " + binary.substring(3,6) + " -> " + trigrams.lower + (lowerMatch ? " ✅" : " ❌ expected " + test.expectedLower));
  console.log("  Upper (lines 4-6): " + binary.substring(0,3) + " -> " + trigrams.upper + (upperMatch ? " ✅" : " ❌ expected " + test.expectedUpper));

  if (!lowerMatch || !upperMatch) {
    errors.push(test.gate);
  }
  console.log();
}

console.log("═══════════════════════════════════════════════════════════════");
if (errors.length === 0) {
  console.log("✅ ALL TRIGRAM CALCULATIONS CORRECT");
} else {
  console.log("❌ " + errors.length + " TRIGRAM ERRORS in gates: " + errors.join(", "));
}
console.log("═══════════════════════════════════════════════════════════════");
