/**
 * COMPREHENSIVE VERIFICATION: QUARTERS AND FACES
 *
 * Quarters are determined by the first bigram (Lines 1-2)
 * Faces are determined by the first two bigrams (Lines 1-4)
 *
 * Created: 2025-11-28
 */

const binaryData = require("../core/root-system/binary-identity.json").gates;
const positioning = require("../core/root-system/positioning-algorithm.js");

console.log("════════════════════════════════════════════════════════════════════════════════");
console.log("QUARTER AND FACE VERIFICATION");
console.log("════════════════════════════════════════════════════════════════════════════════\n");

// QUARTER MAPPING (based on first bigram - Lines 1-2)
// Binary is stored bottom-to-top, so first bigram = chars 0-1
const QUARTER_MAP = {
  '11': 'Mutation',      // Yang-Yang at foundation = Spirit/Mutation
  '10': 'Initiation',    // Yang-Yin = Mind/Initiation
  '01': 'Duality',       // Yin-Yang = Relationship/Duality
  '00': 'Civilisation'   // Yin-Yin = Form/Civilisation
};

// FACE MAPPING (based on first two bigrams - Lines 1-4)
// Codon-style mapping: bigram -> letter
const BIGRAM_TO_LETTER = {
  '11': 'A',  // Yang-Yang
  '00': 'U',  // Yin-Yin
  '10': 'C',  // Yang-Yin
  '01': 'G'   // Yin-Yang
};

const FACE_MAP = {
  'AA': 'Hades',
  'AC': 'Prometheus',
  'AG': 'Vishnu',
  'AU': 'Keepers of the Wheel',
  'CA': 'Kali',
  'CC': 'Mitra',
  'CG': 'Michael',
  'CU': 'Janus',
  'GA': 'Minerva',
  'GC': 'Christ',
  'GG': 'Harmonia',
  'GU': 'Thoth',
  'UA': 'Maat',
  'UC': 'Parvati',
  'UG': 'Lakshmi',
  'UU': 'Maia'
};

// Verify calculations
console.log("PART 1: QUARTER VERIFICATION");
console.log("─────────────────────────────────────────────────────────────────────────────────");
console.log("Quarter is determined by first bigram (Lines 1-2 = binary chars 0-1)\n");

let quarterErrors = [];
let quarterCounts = { 'Mutation': 0, 'Initiation': 0, 'Duality': 0, 'Civilisation': 0 };

for (let gate = 1; gate <= 64; gate++) {
  const binary = binaryData[gate].binary;
  const firstBigram = binary.substring(0, 2);
  const expectedQuarter = QUARTER_MAP[firstBigram];
  const calculatedQuarter = positioning.getQuarter(gate);

  quarterCounts[calculatedQuarter]++;

  if (calculatedQuarter !== expectedQuarter) {
    quarterErrors.push({
      gate,
      binary,
      firstBigram,
      calculated: calculatedQuarter,
      expected: expectedQuarter
    });
  }
}

if (quarterErrors.length === 0) {
  console.log("✅ All 64 gates have correct Quarter assignments\n");
  console.log("Quarter distribution:");
  for (const [quarter, count] of Object.entries(quarterCounts)) {
    console.log(`   ${quarter}: ${count} gates ${count === 16 ? '✅' : '❌ (should be 16)'}`);
  }
} else {
  console.log(`❌ ${quarterErrors.length} Quarter errors found:\n`);
  quarterErrors.forEach(e => {
    console.log(`   Gate ${e.gate}: binary=${e.binary}, bigram=${e.firstBigram}`);
    console.log(`      Calculated: ${e.calculated}, Expected: ${e.expected}`);
  });
}

console.log("\n\nPART 2: FACE VERIFICATION");
console.log("─────────────────────────────────────────────────────────────────────────────────");
console.log("Face is determined by first two bigrams (Lines 1-4 = binary chars 0-3)\n");

let faceErrors = [];
let faceCounts = {};
Object.values(FACE_MAP).forEach(f => faceCounts[f] = 0);

for (let gate = 1; gate <= 64; gate++) {
  const binary = binaryData[gate].binary;
  const firstBigram = binary.substring(0, 2);
  const secondBigram = binary.substring(2, 4);
  const letter1 = BIGRAM_TO_LETTER[firstBigram];
  const letter2 = BIGRAM_TO_LETTER[secondBigram];
  const codonPattern = letter1 + letter2;
  const expectedFace = FACE_MAP[codonPattern];
  const calculatedFace = positioning.getFace(gate);

  faceCounts[calculatedFace]++;

  if (calculatedFace !== expectedFace) {
    faceErrors.push({
      gate,
      binary,
      firstBigram,
      secondBigram,
      codonPattern,
      calculated: calculatedFace,
      expected: expectedFace
    });
  }
}

if (faceErrors.length === 0) {
  console.log("✅ All 64 gates have correct Face assignments\n");
  console.log("Face distribution:");
  for (const [face, count] of Object.entries(faceCounts)) {
    console.log(`   ${face.padEnd(20)}: ${count} gates ${count === 4 ? '✅' : '❌ (should be 4)'}`);
  }
} else {
  console.log(`❌ ${faceErrors.length} Face errors found:\n`);
  faceErrors.forEach(e => {
    console.log(`   Gate ${e.gate}: binary=${e.binary}`);
    console.log(`      Bigrams: ${e.firstBigram}, ${e.secondBigram} -> ${e.codonPattern}`);
    console.log(`      Calculated: ${e.calculated}, Expected: ${e.expected}`);
  });
}

// PART 3: Verify Quarter groupings match wheel structure
console.log("\n\nPART 3: QUARTER-WHEEL CORRELATION");
console.log("─────────────────────────────────────────────────────────────────────────────────");
console.log("Checking if quarters form contiguous regions on wheel...\n");

const gateSequence = positioning.GATE_SEQUENCE;
let lastQuarter = null;
let quarterChanges = [];

for (let i = 0; i < 64; i++) {
  const gate = gateSequence[i];
  const quarter = positioning.getQuarter(gate);

  if (quarter !== lastQuarter) {
    quarterChanges.push({ position: i, gate, quarter });
    lastQuarter = quarter;
  }
}

console.log(`Quarter changes around wheel: ${quarterChanges.length}`);
console.log("(Should be exactly 4 for contiguous quarters, or 8 for two hemispheres each)\n");

quarterChanges.forEach(change => {
  console.log(`   Position ${String(change.position).padStart(2)}: Gate ${String(change.gate).padStart(2)} -> ${change.quarter}`);
});

// Check if it's the expected pattern
if (quarterChanges.length === 4) {
  console.log("\n✅ Quarters form 4 contiguous regions (one region per quarter)");
} else if (quarterChanges.length === 8) {
  console.log("\n⚠️  Quarters form 8 regions (each quarter appears in two hemispheres)");
  console.log("   This is expected due to the nested binary frequency pattern");
} else {
  console.log(`\n⚠️  Unexpected pattern: ${quarterChanges.length} quarter boundaries`);
}

// PART 4: Sample verification with known gates
console.log("\n\nPART 4: SAMPLE VERIFICATION");
console.log("─────────────────────────────────────────────────────────────────────────────────\n");

const sampleGates = [
  { gate: 1, expectedQuarter: 'Mutation', expectedFace: 'Hades' },
  { gate: 2, expectedQuarter: 'Civilisation', expectedFace: 'Maia' },
  { gate: 41, expectedQuarter: 'Mutation', expectedFace: 'Janus' },  // 110001 -> 11 = Mutation, 11+00 = AC = Prometheus? Let's check
];

for (const sample of sampleGates) {
  const binary = binaryData[sample.gate].binary;
  const quarter = positioning.getQuarter(sample.gate);
  const face = positioning.getFace(sample.gate);

  console.log(`Gate ${sample.gate} (${binary}):`);
  console.log(`   Quarter: ${quarter} ${quarter === sample.expectedQuarter ? '✅' : '❌ expected ' + sample.expectedQuarter}`);
  console.log(`   Face: ${face}`);
  console.log("");
}

// Final summary
console.log("════════════════════════════════════════════════════════════════════════════════");
console.log("SUMMARY");
console.log("════════════════════════════════════════════════════════════════════════════════\n");

const allPassed = quarterErrors.length === 0 && faceErrors.length === 0;

if (allPassed) {
  console.log("🎉 ALL QUARTER AND FACE CALCULATIONS VERIFIED CORRECT");
} else {
  console.log("❌ ERRORS FOUND:");
  if (quarterErrors.length > 0) console.log(`   Quarter errors: ${quarterErrors.length}`);
  if (faceErrors.length > 0) console.log(`   Face errors: ${faceErrors.length}`);
}

process.exit(allPassed ? 0 : 1);
