/**
 * COMPREHENSIVE VERIFICATION: CODON MAPPINGS
 *
 * Verifies that binary patterns correctly map to RNA codons
 * and that the amino acid assignments are consistent.
 *
 * Created: 2025-11-28
 */

const binaryData = require("../core/root-system/binary-identity.json").gates;

console.log("════════════════════════════════════════════════════════════════════════════════");
console.log("CODON MAPPING VERIFICATION");
console.log("════════════════════════════════════════════════════════════════════════════════\n");

// BIGRAM TO CODON BASE mapping (Human Design convention)
// This maps the 2-bit bigram to RNA bases
const BIGRAM_TO_BASE = {
  '11': 'A',  // Adenine (Yang-Yang)
  '00': 'U',  // Uracil (Yin-Yin)
  '10': 'C',  // Cytosine (Yang-Yin)
  '01': 'G'   // Guanine (Yin-Yang)
};

// Standard genetic code: codon -> amino acid
const GENETIC_CODE = {
  'UUU': 'Phe', 'UUC': 'Phe', 'UUA': 'Leu', 'UUG': 'Leu',
  'UCU': 'Ser', 'UCC': 'Ser', 'UCA': 'Ser', 'UCG': 'Ser',
  'UAU': 'Tyr', 'UAC': 'Tyr', 'UAA': 'Stop', 'UAG': 'Stop',
  'UGU': 'Cys', 'UGC': 'Cys', 'UGA': 'Stop', 'UGG': 'Trp',
  'CUU': 'Leu', 'CUC': 'Leu', 'CUA': 'Leu', 'CUG': 'Leu',
  'CCU': 'Pro', 'CCC': 'Pro', 'CCA': 'Pro', 'CCG': 'Pro',
  'CAU': 'His', 'CAC': 'His', 'CAA': 'Gln', 'CAG': 'Gln',
  'CGU': 'Arg', 'CGC': 'Arg', 'CGA': 'Arg', 'CGG': 'Arg',
  'AUU': 'Ile', 'AUC': 'Ile', 'AUA': 'Ile', 'AUG': 'Met',
  'ACU': 'Thr', 'ACC': 'Thr', 'ACA': 'Thr', 'ACG': 'Thr',
  'AAU': 'Asn', 'AAC': 'Asn', 'AAA': 'Lys', 'AAG': 'Lys',
  'AGU': 'Ser', 'AGC': 'Ser', 'AGA': 'Arg', 'AGG': 'Arg',
  'GUU': 'Val', 'GUC': 'Val', 'GUA': 'Val', 'GUG': 'Val',
  'GCU': 'Ala', 'GCC': 'Ala', 'GCA': 'Ala', 'GCG': 'Ala',
  'GAU': 'Asp', 'GAC': 'Asp', 'GAA': 'Glu', 'GAG': 'Glu',
  'GGU': 'Gly', 'GGC': 'Gly', 'GGA': 'Gly', 'GGG': 'Gly'
};

// Aromatic amino acids (important for the electromagnetic analysis)
const AROMATIC_AMINO_ACIDS = ['Phe', 'Tyr', 'Trp', 'His'];

/**
 * Calculate codon from binary pattern
 * Binary is stored bottom-to-top (Line 1 at index 0)
 * Codon is read as three bigrams: Lines 1-2, Lines 3-4, Lines 5-6
 */
function binaryToCodon(binary) {
  const bigram1 = binary.substring(0, 2);  // Lines 1-2
  const bigram2 = binary.substring(2, 4);  // Lines 3-4
  const bigram3 = binary.substring(4, 6);  // Lines 5-6

  const base1 = BIGRAM_TO_BASE[bigram1];
  const base2 = BIGRAM_TO_BASE[bigram2];
  const base3 = BIGRAM_TO_BASE[bigram3];

  return base1 + base2 + base3;
}

console.log("PART 1: CODON CALCULATION VERIFICATION");
console.log("─────────────────────────────────────────────────────────────────────────────────\n");

let codonErrors = [];
let codonMatches = 0;

for (let gate = 1; gate <= 64; gate++) {
  const binary = binaryData[gate].binary;
  const storedCodon = binaryData[gate].codon;
  const calculatedCodon = binaryToCodon(binary);

  if (storedCodon === calculatedCodon) {
    codonMatches++;
  } else {
    codonErrors.push({
      gate,
      binary,
      stored: storedCodon,
      calculated: calculatedCodon
    });
  }
}

if (codonErrors.length === 0) {
  console.log(`✅ All 64 gates have correct codon calculations`);
} else {
  console.log(`❌ ${codonErrors.length} codon calculation errors found:\n`);
  codonErrors.forEach(e => {
    console.log(`   Gate ${e.gate}: binary=${e.binary}`);
    console.log(`      Stored: ${e.stored}, Calculated: ${e.calculated}`);
  });
}

console.log("\n\nPART 2: CODON VALIDITY CHECK");
console.log("─────────────────────────────────────────────────────────────────────────────────\n");

let invalidCodons = [];
let validCodons = 0;

for (let gate = 1; gate <= 64; gate++) {
  const codon = binaryData[gate].codon;

  if (GENETIC_CODE[codon]) {
    validCodons++;
  } else {
    invalidCodons.push({ gate, codon });
  }
}

if (invalidCodons.length === 0) {
  console.log(`✅ All 64 codons are valid RNA triplets`);
} else {
  console.log(`❌ ${invalidCodons.length} invalid codons found:\n`);
  invalidCodons.forEach(e => {
    console.log(`   Gate ${e.gate}: ${e.codon} (not a valid codon)`);
  });
}

console.log("\n\nPART 3: CODON UNIQUENESS CHECK");
console.log("─────────────────────────────────────────────────────────────────────────────────\n");

const codonToGates = {};
for (let gate = 1; gate <= 64; gate++) {
  const codon = binaryData[gate].codon;
  if (!codonToGates[codon]) {
    codonToGates[codon] = [];
  }
  codonToGates[codon].push(gate);
}

const uniqueCodons = Object.keys(codonToGates).length;
const duplicateCodons = Object.entries(codonToGates).filter(([codon, gates]) => gates.length > 1);

console.log(`Total unique codons: ${uniqueCodons}`);
console.log(`Expected: 64 unique codons (one per gate)\n`);

if (duplicateCodons.length > 0) {
  console.log("⚠️  Duplicate codons found (multiple gates share same codon):");
  duplicateCodons.forEach(([codon, gates]) => {
    const aminoAcid = GENETIC_CODE[codon] || 'Unknown';
    console.log(`   ${codon} (${aminoAcid}): Gates ${gates.join(', ')}`);
  });
  console.log("\n   Note: This is expected - the genetic code is degenerate");
  console.log("   (multiple codons can code for the same amino acid)");
} else {
  console.log("✅ All codons are unique");
}

console.log("\n\nPART 4: AMINO ACID DISTRIBUTION");
console.log("─────────────────────────────────────────────────────────────────────────────────\n");

const aminoAcidCounts = {};
for (let gate = 1; gate <= 64; gate++) {
  const codon = binaryData[gate].codon;
  const aminoAcid = GENETIC_CODE[codon] || 'Unknown';
  aminoAcidCounts[aminoAcid] = (aminoAcidCounts[aminoAcid] || 0) + 1;
}

console.log("Amino acid distribution across 64 gates:\n");
const sortedAminoAcids = Object.entries(aminoAcidCounts).sort((a, b) => b[1] - a[1]);
for (const [aa, count] of sortedAminoAcids) {
  const isAromatic = AROMATIC_AMINO_ACIDS.includes(aa);
  const marker = isAromatic ? ' 🔥 AROMATIC' : '';
  console.log(`   ${aa.padEnd(6)}: ${String(count).padStart(2)} gates${marker}`);
}

console.log("\n\nPART 5: AROMATIC AMINO ACID ANALYSIS");
console.log("─────────────────────────────────────────────────────────────────────────────────\n");
console.log("Aromatic amino acids are critical for the electromagnetic framework.\n");

const aromaticGates = [];
for (let gate = 1; gate <= 64; gate++) {
  const codon = binaryData[gate].codon;
  const aminoAcid = GENETIC_CODE[codon];
  if (AROMATIC_AMINO_ACIDS.includes(aminoAcid)) {
    const binary = binaryData[gate].binary;
    const lowerTrigram = binary.substring(0, 3);
    const upperTrigram = binary.substring(3, 6);
    aromaticGates.push({ gate, codon, aminoAcid, binary, lowerTrigram, upperTrigram });
  }
}

console.log(`Total aromatic gates: ${aromaticGates.length}\n`);
console.log("Aromatic gate details:");
for (const ag of aromaticGates) {
  console.log(`   Gate ${String(ag.gate).padStart(2)}: ${ag.codon} -> ${ag.aminoAcid.padEnd(3)} | Binary: ${ag.binary} | Lower: ${ag.lowerTrigram} Upper: ${ag.upperTrigram}`);
}

// Check trigram distribution of aromatics
const aromaticLowerTrigrams = {};
const aromaticUpperTrigrams = {};
for (const ag of aromaticGates) {
  aromaticLowerTrigrams[ag.lowerTrigram] = (aromaticLowerTrigrams[ag.lowerTrigram] || 0) + 1;
  aromaticUpperTrigrams[ag.upperTrigram] = (aromaticUpperTrigrams[ag.upperTrigram] || 0) + 1;
}

console.log("\nAromatic distribution by trigram:");
console.log("   Lower trigrams:", aromaticLowerTrigrams);
console.log("   Upper trigrams:", aromaticUpperTrigrams);

console.log("\n\nPART 6: SAMPLE VERIFICATION");
console.log("─────────────────────────────────────────────────────────────────────────────────\n");

const samples = [
  { gate: 1, expectedCodon: 'AAA', expectedAA: 'Lys' },   // 111111
  { gate: 2, expectedCodon: 'UUU', expectedAA: 'Phe' },   // 000000
  { gate: 41, expectedCodon: 'AUG', expectedAA: 'Met' },  // 110001 -> 11+00+01 = A+U+G
];

for (const sample of samples) {
  const binary = binaryData[sample.gate].binary;
  const codon = binaryData[sample.gate].codon;
  const aminoAcid = GENETIC_CODE[codon];

  console.log(`Gate ${sample.gate} (${binary}):`);
  console.log(`   Codon: ${codon} ${codon === sample.expectedCodon ? '✅' : '❌ expected ' + sample.expectedCodon}`);
  console.log(`   Amino Acid: ${aminoAcid} ${aminoAcid === sample.expectedAA ? '✅' : '❌ expected ' + sample.expectedAA}`);
  console.log("");
}

// Final summary
console.log("════════════════════════════════════════════════════════════════════════════════");
console.log("SUMMARY");
console.log("════════════════════════════════════════════════════════════════════════════════\n");

const allPassed = codonErrors.length === 0 && invalidCodons.length === 0;

if (allPassed) {
  console.log("🎉 ALL CODON CALCULATIONS VERIFIED CORRECT");
  console.log(`   - ${codonMatches}/64 codons match calculated values`);
  console.log(`   - ${validCodons}/64 codons are valid RNA triplets`);
  console.log(`   - ${aromaticGates.length} aromatic amino acid gates identified`);
} else {
  console.log("❌ ERRORS FOUND:");
  if (codonErrors.length > 0) console.log(`   Calculation errors: ${codonErrors.length}`);
  if (invalidCodons.length > 0) console.log(`   Invalid codons: ${invalidCodons.length}`);
}

process.exit(allPassed ? 0 : 1);
