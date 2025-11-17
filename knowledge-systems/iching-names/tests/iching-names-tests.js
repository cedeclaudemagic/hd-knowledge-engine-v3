const fs = require('fs');
const path = require('path');

const mappingsPath = path.join(__dirname, '../mappings/iching-names-mappings.json');
const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

let passed = 0;
let failed = 0;

console.log('🧪 I Ching Gate Names - Test Suite');
console.log('='.repeat(60));

// Test 1: All 64 gates present
const gates = mappings.mappings.map(m => m.gateNumber);
const uniqueGates = [...new Set(gates)];
if (uniqueGates.length === 64) {
  console.log('✅ Test 1: All 64 gates present');
  passed++;
} else {
  console.log(`❌ Test 1: Expected 64 gates, found ${uniqueGates.length}`);
  failed++;
}

// Test 2: All gates have I Ching names
const withNames = mappings.mappings.filter(m => m.knowledge.ichingName);
if (withNames.length === 64) {
  console.log('✅ Test 2: All gates have I Ching names');
  passed++;
} else {
  console.log(`❌ Test 2: ${64 - withNames.length} gates missing I Ching names`);
  failed++;
}

// Test 3: All gates have trigrams
const withTrigrams = mappings.mappings.filter(m =>
  m.knowledge.trigrams && m.knowledge.trigrams.upper && m.knowledge.trigrams.lower
);
if (withTrigrams.length === 64) {
  console.log('✅ Test 3: All gates have upper/lower trigrams');
  passed++;
} else {
  console.log(`❌ Test 3: ${64 - withTrigrams.length} gates missing trigrams`);
  failed++;
}

// Test 4: lineNumber is null for all (gate-level system)
const allNull = mappings.mappings.every(m => m.lineNumber === null);
if (allNull) {
  console.log('✅ Test 4: All mappings are gate-level (lineNumber: null)');
  passed++;
} else {
  console.log('❌ Test 4: Some mappings have lineNumber set');
  failed++;
}

// Test 5: No duplicate gate numbers
const duplicates = gates.filter((item, index) => gates.indexOf(item) !== index);
if (duplicates.length === 0) {
  console.log('✅ Test 5: No duplicate gate numbers');
  passed++;
} else {
  console.log(`❌ Test 5: Found duplicate gate numbers: ${duplicates.join(', ')}`);
  failed++;
}

// Test 6: All gate numbers are valid (1-64)
const invalidGates = gates.filter(g => g < 1 || g > 64);
if (invalidGates.length === 0) {
  console.log('✅ Test 6: All gate numbers are valid (1-64)');
  passed++;
} else {
  console.log(`❌ Test 6: Found invalid gate numbers: ${invalidGates.join(', ')}`);
  failed++;
}

// Test 7: All gates have Chinese names
const withChineseNames = mappings.mappings.filter(m => m.knowledge.chineseName);
if (withChineseNames.length === 64) {
  console.log('✅ Test 7: All gates have Chinese names');
  passed++;
} else {
  console.log(`❌ Test 7: ${64 - withChineseNames.length} gates missing Chinese names`);
  failed++;
}

// Test 8: All gates have hexagram numbers
const withHexagramNumbers = mappings.mappings.filter(m => m.knowledge.hexagramNumber);
if (withHexagramNumbers.length === 64) {
  console.log('✅ Test 8: All gates have hexagram numbers');
  passed++;
} else {
  console.log(`❌ Test 8: ${64 - withHexagramNumbers.length} gates missing hexagram numbers`);
  failed++;
}

// Test 9: Valid trigram names
const validTrigrams = ['Heaven', 'Earth', 'Thunder', 'Water', 'Mountain', 'Wind', 'Fire', 'Lake'];
const invalidTrigrams = mappings.mappings.filter(m =>
  !validTrigrams.includes(m.knowledge.trigrams.upper) ||
  !validTrigrams.includes(m.knowledge.trigrams.lower)
);
if (invalidTrigrams.length === 0) {
  console.log('✅ Test 9: All trigram names are valid');
  passed++;
} else {
  console.log(`❌ Test 9: ${invalidTrigrams.length} gates have invalid trigram names`);
  failed++;
}

// Test 10: Metadata structure
const hasValidMetadata =
  mappings.systemName === "I Ching Gate Names" &&
  mappings.version === "1.0.0" &&
  mappings.completeness === "full" &&
  mappings.dataArchitecture === "gate-level";

if (hasValidMetadata) {
  console.log('✅ Test 10: Valid system metadata');
  passed++;
} else {
  console.log('❌ Test 10: Invalid system metadata');
  failed++;
}

console.log('='.repeat(60));
console.log(`Total: ${passed + failed} | Passed: ${passed} ✅ | Failed: ${failed} ❌`);

process.exit(failed === 0 ? 0 : 1);
