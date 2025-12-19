const fs = require("fs");
const path = "/Volumes/CLAUDE/HD-Knowledge-Engine-V3/docs/electromagnetic-interpretations/";

// Load V3 truth
const data = JSON.parse(fs.readFileSync("/Volumes/CLAUDE/HD-Knowledge-Engine-V3/knowledge-systems/iching-names/mappings/iching-names-mappings.json", "utf8"));
const pos = {
  "Heaven": -4, "Lake": -3, "Fire": -2, "Wind": -1,
  "Thunder": 1, "Water": 2, "Mountain": 3, "Earth": 4
};

const v3 = {};
data.mappings.forEach(m => {
  if (m.knowledge.trigrams) {
    v3[m.gateNumber] = {
      inner: m.knowledge.trigrams.lower,
      outer: m.knowledge.trigrams.upper,
      innerPos: pos[m.knowledge.trigrams.lower],
      outerPos: pos[m.knowledge.trigrams.upper]
    };
  }
});

// Dynamically find all gate files
const gateFiles = fs.readdirSync(path)
  .filter(f => f.startsWith("gate-") && f.endsWith(".md"))
  .sort((a, b) => {
    const numA = parseInt(a.match(/gate-(\d+)/)[1]);
    const numB = parseInt(b.match(/gate-(\d+)/)[1]);
    return numA - numB;
  });

console.log("=== CHECKING COMPLETED GATE FILES ===\n");

const issues = [];

gateFiles.forEach(file => {
  const gateNum = parseInt(file.match(/gate-(\d+)/)[1]);
  const truth = v3[gateNum];

  try {
    const content = fs.readFileSync(path + file, "utf8");

    // Extract vector from file
    const vectorMatch = content.match(/\*\*Vector\*\* \| ([+-]?\d) → ([+-]?\d)/);
    const innerMatch = content.match(/\*\*Inner Trigram\*\* \| (\w+)/);
    const outerMatch = content.match(/\*\*Outer Trigram\*\* \| (\w+)/);

    if (vectorMatch) {
      const fileInner = parseInt(vectorMatch[1]);
      const fileOuter = parseInt(vectorMatch[2]);

      if (fileInner !== truth.innerPos || fileOuter !== truth.outerPos) {
        issues.push({
          gate: gateNum,
          file: file,
          type: "VECTOR",
          fileValue: fileInner + " → " + fileOuter,
          correct: truth.innerPos + " → " + truth.outerPos
        });
      }
    }

    if (innerMatch && innerMatch[1] !== truth.inner) {
      issues.push({
        gate: gateNum,
        file: file,
        type: "INNER TRIGRAM",
        fileValue: innerMatch[1],
        correct: truth.inner
      });
    }

    if (outerMatch && outerMatch[1] !== truth.outer) {
      issues.push({
        gate: gateNum,
        file: file,
        type: "OUTER TRIGRAM",
        fileValue: outerMatch[1],
        correct: truth.outer
      });
    }

    console.log("Gate " + gateNum + ": Checked");

  } catch (e) {
    console.log("Gate " + gateNum + ": FILE NOT FOUND - " + e.message);
  }
});

console.log("\n=== ISSUES FOUND ===");
if (issues.length === 0) {
  console.log("No issues found in gate files!");
} else {
  issues.forEach(i => {
    console.log("Gate " + i.gate + " (" + i.file + "):");
    console.log("  " + i.type + ": File has \"" + i.fileValue + "\", should be \"" + i.correct + "\"");
  });
}
console.log("\nTotal issues: " + issues.length);
