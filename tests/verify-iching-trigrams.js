/**
 * VERIFICATION: I Ching Trigram Mappings
 *
 * Verifies that the stored I Ching trigrams match calculated values.
 *
 * Created: 2025-11-28
 */

const iching = require("../knowledge-systems/iching-names/mappings/iching-names-mappings.json");
const positioning = require("../core/root-system/positioning-algorithm.js");

console.log("════════════════════════════════════════════════════════════════════════════════");
console.log("I CHING TRIGRAM VERIFICATION");
console.log("════════════════════════════════════════════════════════════════════════════════");
console.log("Checking if I Ching mapping trigrams match calculated trigrams\n");

let errors = [];
let matches = 0;

for (const mapping of iching.mappings) {
  const gate = mapping.gateNumber;
  const storedTrigrams = mapping.knowledge.trigrams;
  const calculatedTrigrams = positioning.getTrigrams(gate);

  if (storedTrigrams.upper !== calculatedTrigrams.upper ||
      storedTrigrams.lower !== calculatedTrigrams.lower) {
    errors.push({
      gate,
      stored: storedTrigrams,
      calculated: calculatedTrigrams
    });
  } else {
    matches++;
  }
}

console.log("Matches: " + matches + "/64");

if (errors.length > 0) {
  console.log("\n❌ DISCREPANCIES FOUND: " + errors.length);
  errors.forEach(e => {
    console.log("  Gate " + e.gate + ":");
    console.log("    Stored:     Upper=" + e.stored.upper + ", Lower=" + e.stored.lower);
    console.log("    Calculated: Upper=" + e.calculated.upper + ", Lower=" + e.calculated.lower);
  });
} else {
  console.log("\n✅ All I Ching trigram mappings match calculated values");
}

process.exit(errors.length === 0 ? 0 : 1);
