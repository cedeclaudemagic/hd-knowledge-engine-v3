const fs = require("fs");

// Load the authoritative I-Ching data
const ichingData = JSON.parse(fs.readFileSync("/Volumes/CLAUDE/HD-Knowledge-Engine-V3/knowledge-systems/iching-names/mappings/iching-names-mappings.json", "utf8"));

const trigramPositions = {
  "Heaven": -4, "Lake": -3, "Fire": -2, "Wind": -1,
  "Thunder": 1, "Water": 2, "Mountain": 3, "Earth": 4
};

// Build V3 truth
const v3Truth = {};
ichingData.mappings.forEach(m => {
  if (m.knowledge.trigrams) {
    const inner = m.knowledge.trigrams.lower;
    const outer = m.knowledge.trigrams.upper;
    v3Truth[m.gateNumber] = {
      name: m.knowledge.ichingName,
      innerTrigram: inner,
      outerTrigram: outer,
      innerPos: trigramPositions[inner],
      outerPos: trigramPositions[outer]
    };
  }
});

// Read INDEX and extract all gate vectors
const indexContent = fs.readFileSync("/Volumes/CLAUDE/HD-Knowledge-Engine-V3/docs/electromagnetic-interpretations/INDEX.md", "utf8");

// Parse for gate entries with vectors
const vectorPattern = /\| (\d+) \| [^|]+ \| ([+-]?\d) → ([+-]?\d)/g;
let match;
const indexVectors = {};
while ((match = vectorPattern.exec(indexContent)) !== null) {
  const gateNum = parseInt(match[1]);
  const fromPos = parseInt(match[2]);
  const toPos = parseInt(match[3]);
  if (!indexVectors[gateNum]) {
    indexVectors[gateNum] = { from: fromPos, to: toPos };
  }
}

console.log("=== VECTOR VERIFICATION: INDEX vs V3 ENGINE ===\n");

const vectorAnomalies = [];

Object.keys(indexVectors).sort((a,b) => parseInt(a) - parseInt(b)).forEach(g => {
  const idx = indexVectors[g];
  const truth = v3Truth[g];

  if (truth) {
    const correctFrom = truth.innerPos;
    const correctTo = truth.outerPos;

    if (idx.from !== correctFrom || idx.to !== correctTo) {
      console.log("Gate " + g + " (" + truth.name + "):");
      console.log("  INDEX vector: " + idx.from + " → " + idx.to);
      console.log("  V3 correct:   " + correctFrom + " → " + correctTo);
      console.log("  Trigrams: " + truth.innerTrigram + "(" + correctFrom + ") → " + truth.outerTrigram + "(" + correctTo + ")");
      console.log("");
      vectorAnomalies.push({
        gate: g,
        name: truth.name,
        indexVector: idx.from + " → " + idx.to,
        correctVector: correctFrom + " → " + correctTo,
        trigrams: truth.innerTrigram + " → " + truth.outerTrigram
      });
    }
  }
});

console.log("\n=== VECTOR ANOMALIES SUMMARY ===");
console.log("Total vector mismatches:", vectorAnomalies.length);
if (vectorAnomalies.length === 0) {
  console.log("All vectors in INDEX match V3 engine!");
}
