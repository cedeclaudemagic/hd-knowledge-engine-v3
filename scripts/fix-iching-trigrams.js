#!/usr/bin/env node

/**
 * Fix I Ching Trigram Mappings
 *
 * Corrects the upper/lower trigram assignments in the I Ching names mapping file.
 *
 * Created: 2025-11-28
 */

const fs = require("fs");
const path = require("path");

// Load I Ching mappings
const mappingsPath = path.join(__dirname, "../knowledge-systems/iching-names/mappings/iching-names-mappings.json");
const mappings = JSON.parse(fs.readFileSync(mappingsPath, "utf8"));

// Load binary data for recalculation
const binaryData = require("../core/root-system/binary-identity.json").gates;

// Trigram map (binary patterns read bottom-to-top)
const trigramMap = {
  "111": "Heaven",
  "000": "Earth",
  "100": "Thunder",
  "010": "Water",
  "001": "Mountain",
  "011": "Wind",
  "101": "Fire",
  "110": "Lake"
};

console.log("═══════════════════════════════════════════════════════════════");
console.log("FIXING I CHING TRIGRAM MAPPINGS");
console.log("═══════════════════════════════════════════════════════════════\n");

let fixed = 0;
for (const mapping of mappings.mappings) {
  const gate = mapping.gateNumber;
  const binary = binaryData[gate].binary;

  // Calculate correct trigrams (binary stored bottom-to-top)
  const lower = binary.substring(0, 3);  // Lines 1-3 = LOWER trigram
  const upper = binary.substring(3, 6);  // Lines 4-6 = UPPER trigram

  const correctLower = trigramMap[lower];
  const correctUpper = trigramMap[upper];

  if (mapping.knowledge.trigrams.upper !== correctUpper ||
      mapping.knowledge.trigrams.lower !== correctLower) {
    console.log("Gate " + gate + ": " +
      mapping.knowledge.trigrams.upper + "/" + mapping.knowledge.trigrams.lower + " -> " +
      correctUpper + "/" + correctLower);

    mapping.knowledge.trigrams = {
      upper: correctUpper,
      lower: correctLower
    };
    fixed++;
  }
}

// Update version
mappings.version = "1.1.0";
mappings.lastCorrected = "2025-11-28";
mappings.description = "Traditional I Ching hexagram names for the 64 gates. Trigrams calculated from binary (bottom-to-top).";

// Write back
fs.writeFileSync(mappingsPath, JSON.stringify(mappings, null, 2));

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("✅ Fixed " + fixed + " trigram mappings");
console.log("Updated version to 1.1.0");
console.log("═══════════════════════════════════════════════════════════════");
