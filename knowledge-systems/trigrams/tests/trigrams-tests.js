const fs = require('fs');
const path = require('path');

const mappingsPath = path.join(__dirname, '../mappings/trigrams-mappings.json');
const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

let passed = 0;
let failed = 0;

console.log('🧪 8 Trigrams - Test Suite');
console.log('=' .repeat(60));

// Test 1: All 8 trigrams present
if (mappings.mappings.length === 8) {
  console.log('✅ Test 1: All 8 trigrams present');
  passed++;
} else {
  console.log(`❌ Test 1: Expected 8 trigrams, found ${mappings.mappings.length}`);
  failed++;
}

// Test 2: All trigrams have Chinese names
const withChinese = mappings.mappings.filter(m => m.chineseName);
if (withChinese.length === 8) {
  console.log('✅ Test 2: All trigrams have Chinese names');
  passed++;
} else {
  console.log(`❌ Test 2: ${8 - withChinese.length} trigrams missing Chinese names`);
  failed++;
}

// Test 3: All trigrams have I Ching meanings
const withMeanings = mappings.mappings.filter(m => m.knowledge.iching);
if (withMeanings.length === 8) {
  console.log('✅ Test 3: All trigrams have I Ching meanings');
  passed++;
} else {
  console.log(`❌ Test 3: ${8 - withMeanings.length} trigrams missing I Ching meanings`);
  failed++;
}

// Test 4: Verify trigram names match expected
const expectedTrigrams = ['Heaven', 'Earth', 'Thunder', 'Water', 'Mountain', 'Wind', 'Fire', 'Lake'];
const trigramNames = mappings.mappings.map(m => m.groupName);
const allMatch = expectedTrigrams.every(t => trigramNames.includes(t));

if (allMatch) {
  console.log('✅ Test 4: All expected trigram names present');
  passed++;
} else {
  const missing = expectedTrigrams.filter(t => !trigramNames.includes(t));
  console.log(`❌ Test 4: Missing trigrams: ${missing.join(', ')}`);
  failed++;
}

// Test 5: Verify binary patterns are correct (3 bits)
const validPatterns = ['111', '000', '100', '010', '001', '011', '101', '110'];
const binaryPatterns = mappings.mappings.map(m => m.binaryPattern);
const allValidBinary = binaryPatterns.every(b => validPatterns.includes(b));

if (allValidBinary && binaryPatterns.length === 8) {
  console.log('✅ Test 5: All binary patterns are valid');
  passed++;
} else {
  console.log('❌ Test 5: Some binary patterns are invalid');
  failed++;
}

// Test 6: Verify no duplicate binary patterns
const uniquePatterns = new Set(binaryPatterns);
if (uniquePatterns.size === 8) {
  console.log('✅ Test 6: All binary patterns are unique');
  passed++;
} else {
  console.log('❌ Test 6: Duplicate binary patterns found');
  failed++;
}

// Test 7: Verify all trigrams have pinyin
const withPinyin = mappings.mappings.filter(m => m.pinyin);
if (withPinyin.length === 8) {
  console.log('✅ Test 7: All trigrams have pinyin');
  passed++;
} else {
  console.log(`❌ Test 7: ${8 - withPinyin.length} trigrams missing pinyin`);
  failed++;
}

// Test 8: Verify all trigrams have all required knowledge fields
const requiredFields = ['element', 'quality', 'nature', 'image', 'attribute', 'symbol', 'meaning', 'iching'];
let allHaveFields = true;
for (const trigram of mappings.mappings) {
  for (const field of requiredFields) {
    if (!trigram.knowledge[field]) {
      console.log(`❌ Trigram ${trigram.groupName} missing field: ${field}`);
      allHaveFields = false;
    }
  }
}

if (allHaveFields) {
  console.log('✅ Test 8: All trigrams have required knowledge fields');
  passed++;
} else {
  console.log('❌ Test 8: Some trigrams missing required knowledge fields');
  failed++;
}

// Test 9: Verify CORRECT binary-to-trigram mappings
// CRITICAL: Binary is read BOTTOM-TO-TOP (index 0 = Line 1 = bottom)
// 
// Heaven (111): all yang
// Earth (000): all yin
// Thunder (100): yang at BOTTOM (first movement)
// Water (010): yang in MIDDLE (flowing between)
// Mountain (001): yang at TOP (capping stillness below)
// Wind (011): yin at BOTTOM, yang building above
// Fire (101): yang at top and bottom, yin in middle (sustained oscillation)
// Lake (110): yang foundation, yin opening at top
//
const expectedMappings = {
  '111': 'Heaven',
  '000': 'Earth',
  '100': 'Thunder',
  '010': 'Water',
  '001': 'Mountain',  // CORRECTED: yang at TOP caps stillness
  '011': 'Wind',      // CORRECTED: yin at bottom, yang building above
  '101': 'Fire',
  '110': 'Lake'       // CORRECTED: yang foundation, yin opening at top
};

let mappingsCorrect = true;
for (const trigram of mappings.mappings) {
  if (expectedMappings[trigram.binaryPattern] !== trigram.groupName) {
    console.log(`❌ Binary ${trigram.binaryPattern} should map to ${expectedMappings[trigram.binaryPattern]}, not ${trigram.groupName}`);
    mappingsCorrect = false;
  }
}

if (mappingsCorrect) {
  console.log('✅ Test 9: Binary patterns correctly map to trigram names');
  passed++;
} else {
  console.log('❌ Test 9: Some binary-to-trigram mappings incorrect');
  failed++;
}

// Test 10: Verify metadata
if (mappings.systemName === 'The 8 Trigrams' &&
    mappings.dataArchitecture === 'grouping' &&
    mappings.totalGroups === 8) {
  console.log('✅ Test 10: Metadata is correct');
  passed++;
} else {
  console.log('❌ Test 10: Metadata is incorrect');
  failed++;
}

// Test 11: Verify electromagnetic phase assignments
const emPhaseTests = {
  'Heaven': 'SEED',
  'Lake': 'SEED',
  'Fire': 'ACTIVATION',
  'Thunder': 'ACTIVATION',
  'Wind': 'ACCUMULATION',
  'Water': 'ACCUMULATION',
  'Mountain': 'MANIFESTATION',
  'Earth': 'MANIFESTATION'
};

let emPhasesCorrect = true;
for (const trigram of mappings.mappings) {
  const expectedPhase = emPhaseTests[trigram.groupName];
  if (!trigram.knowledge.emPhase || !trigram.knowledge.emPhase.startsWith(expectedPhase)) {
    console.log(`❌ ${trigram.groupName} should be ${expectedPhase} phase`);
    emPhasesCorrect = false;
  }
}

if (emPhasesCorrect) {
  console.log('✅ Test 11: Electromagnetic phases correctly assigned');
  passed++;
} else {
  console.log('❌ Test 11: Some electromagnetic phase assignments incorrect');
  failed++;
}

// Test 12: Verify trigram opposites (all bits flipped)
const opposites = {
  '111': '000', // Heaven ↔ Earth
  '110': '001', // Lake ↔ Mountain
  '101': '010', // Fire ↔ Water
  '100': '011'  // Thunder ↔ Wind
};

let oppositesValid = true;
for (const [binary1, binary2] of Object.entries(opposites)) {
  const trigram1 = mappings.mappings.find(m => m.binaryPattern === binary1);
  const trigram2 = mappings.mappings.find(m => m.binaryPattern === binary2);
  if (!trigram1 || !trigram2) {
    console.log(`❌ Missing trigram for opposite pair ${binary1} ↔ ${binary2}`);
    oppositesValid = false;
  }
}

if (oppositesValid) {
  console.log('✅ Test 12: All opposite pairs present (Heaven↔Earth, Lake↔Mountain, Fire↔Water, Thunder↔Wind)');
  passed++;
} else {
  console.log('❌ Test 12: Some opposite pairs missing');
  failed++;
}

console.log('=' .repeat(60));
console.log(`Total: ${passed + failed} | Passed: ${passed} ✅ | Failed: ${failed} ❌`);

process.exit(failed === 0 ? 0 : 1);
