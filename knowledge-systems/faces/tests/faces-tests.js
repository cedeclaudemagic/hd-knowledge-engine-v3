/**
 * Test Suite for 16 Mythological Faces Knowledge System
 *
 * Validates the faces mappings against the canonical root system
 * and ensures complete mythological coverage for all 16 faces.
 */

const fs = require('fs');
const path = require('path');

// Load the faces mappings
const mappingsPath = path.join(__dirname, '../mappings/faces-mappings.json');
const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

// Load canonical mappings to validate against root system
const canonicalMappingsPath = path.join(__dirname, '../../../scripts/utilities/canonical-mappings.js');
const CanonicalMappings = require(canonicalMappingsPath);

// Test counters
let passed = 0;
let failed = 0;
const errors = [];

console.log('🧪 16 Mythological Faces - Comprehensive Test Suite');
console.log('='.repeat(70));
console.log('');

// =====================================================================
// TEST 1: System Metadata Validation
// =====================================================================

console.log('📋 Test Group 1: System Metadata');
console.log('-'.repeat(70));

if (mappings.systemName === "The 16 Mythological Faces") {
  console.log('✅ Test 1.1: System name is correct');
  passed++;
} else {
  console.log(`❌ Test 1.1: System name incorrect: "${mappings.systemName}"`);
  errors.push('System name must be "The 16 Mythological Faces"');
  failed++;
}

if (mappings.dataArchitecture === "grouping") {
  console.log('✅ Test 1.2: Data architecture is "grouping"');
  passed++;
} else {
  console.log(`❌ Test 1.2: Data architecture must be "grouping", found: "${mappings.dataArchitecture}"`);
  errors.push('Data architecture must be "grouping" for face system');
  failed++;
}

if (mappings.totalGroups === 16) {
  console.log('✅ Test 1.3: Total groups is 16');
  passed++;
} else {
  console.log(`❌ Test 1.3: Expected 16 total groups, found: ${mappings.totalGroups}`);
  errors.push('Total groups must be exactly 16');
  failed++;
}

console.log('');

// =====================================================================
// TEST 2: Completeness Validation
// =====================================================================

console.log('📊 Test Group 2: Completeness');
console.log('-'.repeat(70));

if (mappings.mappings.length === 16) {
  console.log('✅ Test 2.1: All 16 faces present in mappings array');
  passed++;
} else {
  console.log(`❌ Test 2.1: Expected 16 faces, found ${mappings.mappings.length}`);
  errors.push(`Missing faces: expected 16, got ${mappings.mappings.length}`);
  failed++;
}

const requiredFaces = [
  'Hades', 'Prometheus', 'Vishnu', 'Keepers of the Wheel',
  'Kali', 'Mitra', 'Michael', 'Janus',
  'Minerva', 'Christ', 'Harmonia', 'Thoth',
  'Maat', 'Parvati', 'Lakshmi', 'Maia'
];

const presentFaces = mappings.mappings.map(m => m.groupName);
const missingFaces = requiredFaces.filter(face => !presentFaces.includes(face));
const extraFaces = presentFaces.filter(face => !requiredFaces.includes(face));

if (missingFaces.length === 0 && extraFaces.length === 0) {
  console.log('✅ Test 2.2: All expected face names are present and correct');
  passed++;
} else {
  console.log(`❌ Test 2.2: Face name mismatch`);
  if (missingFaces.length > 0) {
    console.log(`   Missing: ${missingFaces.join(', ')}`);
    errors.push(`Missing faces: ${missingFaces.join(', ')}`);
  }
  if (extraFaces.length > 0) {
    console.log(`   Extra/incorrect: ${extraFaces.join(', ')}`);
    errors.push(`Unexpected faces: ${extraFaces.join(', ')}`);
  }
  failed++;
}

console.log('');

// =====================================================================
// TEST 3: Codon Pattern Validation
// =====================================================================

console.log('🧬 Test Group 3: Codon Pattern Validation');
console.log('-'.repeat(70));

const validCodonPatterns = [
  'AA', 'AC', 'AG', 'AU',
  'CA', 'CC', 'CG', 'CU',
  'GA', 'GC', 'GG', 'GU',
  'UA', 'UC', 'UG', 'UU'
];

const codonPatterns = mappings.mappings.map(m => m.codonPattern);
const invalidCodons = codonPatterns.filter(c => !validCodonPatterns.includes(c));
const duplicateCodons = codonPatterns.filter((c, i) => codonPatterns.indexOf(c) !== i);

if (invalidCodons.length === 0) {
  console.log('✅ Test 3.1: All codon patterns are valid (AA-UU range)');
  passed++;
} else {
  console.log(`❌ Test 3.1: Found invalid codon patterns: ${invalidCodons.join(', ')}`);
  errors.push(`Invalid codon patterns: ${invalidCodons.join(', ')}`);
  failed++;
}

if (duplicateCodons.length === 0) {
  console.log('✅ Test 3.2: No duplicate codon patterns');
  passed++;
} else {
  console.log(`❌ Test 3.2: Found duplicate codon patterns: ${duplicateCodons.join(', ')}`);
  errors.push(`Duplicate codon patterns: ${duplicateCodons.join(', ')}`);
  failed++;
}

if (codonPatterns.length === 16) {
  console.log('✅ Test 3.3: All 16 codon patterns are covered');
  passed++;
} else {
  console.log(`❌ Test 3.3: Expected 16 unique codon patterns, found ${codonPatterns.length}`);
  errors.push(`Incomplete codon coverage: ${codonPatterns.length}/16`);
  failed++;
}

console.log('');

// =====================================================================
// TEST 4: Canonical System Alignment
// =====================================================================

console.log('🔗 Test Group 4: Canonical System Alignment');
console.log('-'.repeat(70));

let canonicalMatches = 0;
const canonicalMismatches = [];

mappings.mappings.forEach(face => {
  const canonicalFaceName = CanonicalMappings.FACE_PATTERNS[face.codonPattern];
  if (canonicalFaceName === face.groupName) {
    canonicalMatches++;
  } else {
    canonicalMismatches.push({
      codon: face.codonPattern,
      mappingName: face.groupName,
      canonicalName: canonicalFaceName
    });
  }
});

if (canonicalMatches === 16) {
  console.log('✅ Test 4.1: All face names match canonical system (16/16)');
  passed++;
} else {
  console.log(`❌ Test 4.1: Face name mismatches with canonical system (${canonicalMatches}/16)`);
  canonicalMismatches.forEach(mm => {
    console.log(`   ${mm.codon}: mapping="${mm.mappingName}" vs canonical="${mm.canonicalName}"`);
    errors.push(`Canonical mismatch: ${mm.codon} should be "${mm.canonicalName}" not "${mm.mappingName}"`);
  });
  failed++;
}

console.log('');

// =====================================================================
// TEST 5: Mythology Content Validation
// =====================================================================

console.log('📖 Test Group 5: Mythology Content Validation');
console.log('-'.repeat(70));

const withMythology = mappings.mappings.filter(m => m.knowledge && m.knowledge.mythology);
if (withMythology.length === 16) {
  console.log('✅ Test 5.1: All 16 faces have mythology descriptions');
  passed++;
} else {
  console.log(`❌ Test 5.1: ${16 - withMythology.length} faces missing mythology`);
  const missingMythology = mappings.mappings.filter(m => !m.knowledge || !m.knowledge.mythology);
  missingMythology.forEach(m => {
    errors.push(`Face "${m.groupName}" missing mythology description`);
  });
  failed++;
}

const withArchetype = mappings.mappings.filter(m => m.knowledge && m.knowledge.archetype);
if (withArchetype.length === 16) {
  console.log('✅ Test 5.2: All 16 faces have archetype definitions');
  passed++;
} else {
  console.log(`❌ Test 5.2: ${16 - withArchetype.length} faces missing archetypes`);
  failed++;
}

const withTheme = mappings.mappings.filter(m => m.knowledge && m.knowledge.theme);
if (withTheme.length === 16) {
  console.log('✅ Test 5.3: All 16 faces have theme descriptions');
  passed++;
} else {
  console.log(`❌ Test 5.3: ${16 - withTheme.length} faces missing themes`);
  failed++;
}

const withRealm = mappings.mappings.filter(m => m.knowledge && m.knowledge.realm);
if (withRealm.length === 16) {
  console.log('✅ Test 5.4: All 16 faces have realm descriptions');
  passed++;
} else {
  console.log(`❌ Test 5.4: ${16 - withRealm.length} faces missing realms`);
  failed++;
}

const withQuality = mappings.mappings.filter(m => m.knowledge && m.knowledge.quality);
if (withQuality.length === 16) {
  console.log('✅ Test 5.5: All 16 faces have quality descriptions');
  passed++;
} else {
  console.log(`❌ Test 5.5: ${16 - withQuality.length} faces missing qualities`);
  failed++;
}

const withEssence = mappings.mappings.filter(m => m.knowledge && m.knowledge.essence);
if (withEssence.length === 16) {
  console.log('✅ Test 5.6: All 16 faces have essence descriptions');
  passed++;
} else {
  console.log(`❌ Test 5.6: ${16 - withEssence.length} faces missing essence`);
  failed++;
}

console.log('');

// =====================================================================
// TEST 6: Content Quality Validation
// =====================================================================

console.log('✍️  Test Group 6: Content Quality');
console.log('-'.repeat(70));

const minMythologyLength = 50; // Minimum meaningful description
const shortMythology = mappings.mappings.filter(m =>
  !m.knowledge.mythology || m.knowledge.mythology.length < minMythologyLength
);

if (shortMythology.length === 0) {
  console.log(`✅ Test 6.1: All mythology descriptions are substantial (>${minMythologyLength} chars)`);
  passed++;
} else {
  console.log(`❌ Test 6.1: ${shortMythology.length} faces have insufficient mythology descriptions`);
  shortMythology.forEach(m => {
    console.log(`   "${m.groupName}": ${m.knowledge.mythology?.length || 0} chars`);
  });
  failed++;
}

const minArchetypeLength = 10;
const shortArchetype = mappings.mappings.filter(m =>
  !m.knowledge.archetype || m.knowledge.archetype.length < minArchetypeLength
);

if (shortArchetype.length === 0) {
  console.log(`✅ Test 6.2: All archetype descriptions are meaningful (>${minArchetypeLength} chars)`);
  passed++;
} else {
  console.log(`❌ Test 6.2: ${shortArchetype.length} faces have insufficient archetype descriptions`);
  failed++;
}

console.log('');

// =====================================================================
// TEST 7: Binary Pattern Validation
// =====================================================================

console.log('🔢 Test Group 7: Binary Pattern Validation');
console.log('-'.repeat(70));

const validBinaryPatterns = mappings.mappings.filter(m => {
  const pattern = m.binaryPattern;
  // Should be 4 characters, first 2-4 are 0 or 1, rest can be #
  return /^[01]{4}$/.test(pattern);
});

if (validBinaryPatterns.length === 16) {
  console.log('✅ Test 7.1: All binary patterns are valid 4-digit patterns');
  passed++;
} else {
  console.log(`❌ Test 7.1: ${16 - validBinaryPatterns.length} faces have invalid binary patterns`);
  const invalidBinary = mappings.mappings.filter(m => !/^[01]{4}$/.test(m.binaryPattern));
  invalidBinary.forEach(m => {
    console.log(`   "${m.groupName}": "${m.binaryPattern}"`);
    errors.push(`Invalid binary pattern for ${m.groupName}: ${m.binaryPattern}`);
  });
  failed++;
}

// Verify binary-to-codon conversion
let binaryCodonMatches = 0;
mappings.mappings.forEach(face => {
  const binary = face.binaryPattern;
  const expectedCodon = CanonicalMappings.binaryToBigram(binary.substring(0, 2)) +
                        CanonicalMappings.binaryToBigram(binary.substring(2, 4));
  if (expectedCodon === face.codonPattern) {
    binaryCodonMatches++;
  } else {
    console.log(`   Mismatch in ${face.groupName}: binary ${binary} -> expected ${expectedCodon}, got ${face.codonPattern}`);
  }
});

if (binaryCodonMatches === 16) {
  console.log('✅ Test 7.2: All binary patterns correctly convert to codon patterns');
  passed++;
} else {
  console.log(`❌ Test 7.2: ${16 - binaryCodonMatches} faces have binary-codon mismatches`);
  failed++;
}

console.log('');

// =====================================================================
// TEST 8: Structure Validation
// =====================================================================

console.log('🏗️  Test Group 8: Data Structure Validation');
console.log('-'.repeat(70));

const requiredFields = ['groupName', 'codonPattern', 'binaryPattern', 'knowledge'];
let structureValid = true;

mappings.mappings.forEach((face, index) => {
  requiredFields.forEach(field => {
    if (!face.hasOwnProperty(field)) {
      console.log(`❌ Face at index ${index} ("${face.groupName || 'unknown'}") missing field: ${field}`);
      errors.push(`Missing field "${field}" in face ${index}`);
      structureValid = false;
    }
  });
});

if (structureValid) {
  console.log('✅ Test 8.1: All faces have required fields');
  passed++;
} else {
  failed++;
}

console.log('');

// =====================================================================
// SUMMARY AND RESULTS
// =====================================================================

console.log('='.repeat(70));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(70));
console.log(`Total Tests: ${passed + failed}`);
console.log(`Passed: ${passed} ✅`);
console.log(`Failed: ${failed} ❌`);
console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
console.log('');

if (failed === 0) {
  console.log('🎉 ALL TESTS PASSED! The 16 Mythological Faces system is complete and valid.');
  console.log('');
  console.log('✅ System validated against canonical mappings');
  console.log('✅ All 16 faces have complete mythology');
  console.log('✅ All codon patterns are correct and unique');
  console.log('✅ Data structure is consistent');
  console.log('');
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED - Please review the errors above.');
  console.log('');
  if (errors.length > 0) {
    console.log('🔍 Error Details:');
    errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }
  console.log('');
  process.exit(1);
}
