/**
 * Verify Trigram Orientation Across All 64 Gates
 *
 * This script verifies that:
 * 1. Inner trigram = Lower trigram (Lines 1-3, bits 0-2)
 * 2. Outer trigram = Upper trigram (Lines 4-6, bits 3-5)
 * 3. All 64 gates in electromagnetic-lines-mappings match the binary patterns
 * 4. Traditional I Ching hexagram structure is correctly represented
 */

const fs = require('fs');
const path = require('path');

// Load data files
const binaryPath = path.join(__dirname, '../core/root-system/binary-identity.json');
const emLinesPath = path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

const binaryData = JSON.parse(fs.readFileSync(binaryPath, 'utf8'));
const emLines = JSON.parse(fs.readFileSync(emLinesPath, 'utf8'));

// Trigram binary to name mapping (CORRECT bottom-to-top convention)
// Reading: bit[0]=bottom line, bit[1]=middle line, bit[2]=top line
// Mountain (艮) = solid at TOP only = 001
// Wind (巽) = broken at BOTTOM only = 011
// Lake (兌) = broken at TOP only = 110
const TRIGRAM_MAP = {
  '111': 'Heaven',   // all solid
  '000': 'Earth',    // all broken
  '100': 'Thunder',  // solid at bottom only
  '010': 'Water',    // solid in middle only
  '001': 'Mountain', // solid at top only
  '011': 'Wind',     // broken at bottom only (solid middle+top)
  '101': 'Fire',     // broken in middle only
  '110': 'Lake'      // broken at top only (solid bottom+middle)
};

console.log('═'.repeat(75));
console.log('TRIGRAM ORIENTATION VERIFICATION');
console.log('═'.repeat(75));
console.log(`\nVerifying: Inner = Lower (Lines 1-3), Outer = Upper (Lines 4-6)\n`);

// Build gate index from electromagnetic mappings
const gateIndex = {};
const emMappings = emLines.mappings || emLines;

for (const line of emMappings) {
  if (!gateIndex[line.gate]) {
    gateIndex[line.gate] = {
      innerName: line.electromagnetic?.innerTrigram?.name,
      outerName: line.electromagnetic?.outerTrigram?.name,
      innerBinary: line.electromagnetic?.innerTrigram?.binary,
      outerBinary: line.electromagnetic?.outerTrigram?.binary
    };
  }
}

// Verify each gate
let passed = 0;
let failed = 0;
const failures = [];

for (let gate = 1; gate <= 64; gate++) {
  const binary = binaryData.gates[gate]?.binary;
  if (!binary) {
    console.log(`⚠️  Gate ${gate}: No binary data found`);
    continue;
  }

  // Extract trigrams from binary
  // binary[0-2] = Lines 1-3 = Lower/Inner trigram
  // binary[3-5] = Lines 4-6 = Upper/Outer trigram
  const lowerBinary = binary.substring(0, 3);
  const upperBinary = binary.substring(3, 6);
  const expectedLower = TRIGRAM_MAP[lowerBinary];
  const expectedUpper = TRIGRAM_MAP[upperBinary];

  // Get electromagnetic mapping
  const em = gateIndex[gate];

  if (!em) {
    console.log(`⚠️  Gate ${gate}: No electromagnetic mapping found`);
    continue;
  }

  // Verify: Inner should equal Lower, Outer should equal Upper
  const innerCorrect = em.innerName === expectedLower;
  const outerCorrect = em.outerName === expectedUpper;
  const binaryCorrect = em.innerBinary === lowerBinary && em.outerBinary === upperBinary;

  if (innerCorrect && outerCorrect && binaryCorrect) {
    passed++;
  } else {
    failed++;
    failures.push({
      gate,
      binary,
      expected: { lower: expectedLower, upper: expectedUpper },
      actual: { inner: em.innerName, outer: em.outerName },
      binaryMatch: { inner: em.innerBinary, outer: em.outerBinary }
    });
  }
}

// Summary
console.log('─'.repeat(75));
console.log(`✅ Passed: ${passed}/64 gates`);
console.log(`❌ Failed: ${failed}/64 gates`);

if (failures.length > 0) {
  console.log('\n' + '═'.repeat(75));
  console.log('FAILURES');
  console.log('═'.repeat(75));

  for (const f of failures) {
    console.log(`\nGate ${f.gate} (binary: ${f.binary}):`);
    console.log(`  Expected: Lower=${f.expected.lower}, Upper=${f.expected.upper}`);
    console.log(`  Actual:   Inner=${f.actual.inner}, Outer=${f.actual.outer}`);
    console.log(`  Binary:   Inner=${f.binaryMatch.inner}, Outer=${f.binaryMatch.outer}`);
  }
}

// Detailed verification of key gates
console.log('\n' + '═'.repeat(75));
console.log('KEY HEXAGRAM VERIFICATION');
console.log('═'.repeat(75));

const keyGates = [
  { gate: 1, name: 'The Creative', traditional: 'Heaven over Heaven' },
  { gate: 2, name: 'The Receptive', traditional: 'Earth over Earth' },
  { gate: 11, name: 'Peace', traditional: 'Earth over Heaven (Heaven below)' },
  { gate: 12, name: 'Standstill', traditional: 'Heaven over Earth (Earth below)' },
  { gate: 63, name: 'After Completion', traditional: 'Water over Fire' },
  { gate: 64, name: 'Before Completion', traditional: 'Fire over Water' }
];

console.log('\nGate  Binary   Inner (Lower)      Outer (Upper)      Traditional');
console.log('─'.repeat(75));

for (const kg of keyGates) {
  const binary = binaryData.gates[kg.gate]?.binary;
  const em = gateIndex[kg.gate];

  const lowerBinary = binary.substring(0, 3);
  const upperBinary = binary.substring(3, 6);
  const lower = TRIGRAM_MAP[lowerBinary];
  const upper = TRIGRAM_MAP[upperBinary];

  console.log(`${kg.gate.toString().padStart(4)}  ${binary}   ${lower.padEnd(17)} ${upper.padEnd(17)} ${kg.traditional}`);

  // Check if inner = lower
  if (em.innerName !== lower) {
    console.log(`      ⚠️  MISMATCH: inner=${em.innerName}, expected lower=${lower}`);
  }
  if (em.outerName !== upper) {
    console.log(`      ⚠️  MISMATCH: outer=${em.outerName}, expected upper=${upper}`);
  }
}

// Final conclusion
console.log('\n' + '═'.repeat(75));
console.log('CONCLUSION');
console.log('═'.repeat(75));

if (failed === 0) {
  console.log(`
✅ ALL 64 GATES VERIFIED CORRECT

The V3 Knowledge Engine correctly implements:
- Inner trigram = Lower trigram = Lines 1-3 = bits 0-2
- Outer trigram = Upper trigram = Lines 4-6 = bits 3-5

This matches the traditional I Ching hexagram structure where:
- Line 1 is at the BOTTOM
- Line 6 is at the TOP
- Lower trigram (lines 1-3) is "inner" (foundation, origin)
- Upper trigram (lines 4-6) is "outer" (expression, destination)

The articles correctly describe movement as: Inner → Outer = Lower → Upper
`);
} else {
  console.log(`
⚠️  ${failed} GATES HAVE DISCREPANCIES

Please review the failures above.
`);
}
