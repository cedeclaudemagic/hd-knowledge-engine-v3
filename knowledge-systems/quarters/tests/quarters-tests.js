#!/usr/bin/env node
/**
 * 4 Quarters Knowledge System - Test Suite
 *
 * Comprehensive validation that the quarters mappings are mathematically
 * consistent with the binary-first architecture of the HD Knowledge Engine.
 *
 * @version 1.0.0
 * @author HD Knowledge Engine
 */

const fs = require('fs');
const path = require('path');

// Load the quarters mappings
const mappingsPath = path.join(__dirname, '../mappings/quarters-mappings.json');
const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

// Load the unified database
const databasePath = path.join(__dirname, '../../../data/database/unified-hd-database.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

// Load canonical mappings for validation
const CanonicalMappings = require('../../../scripts/utilities/canonical-mappings.js');

// Test counters
let passed = 0;
let failed = 0;
let testNumber = 0;

// Helper function to run tests
function test(description, testFn) {
  testNumber++;
  try {
    const result = testFn();
    if (result === true || (result && result.success !== false)) {
      console.log(`✅ Test ${testNumber}: ${description}`);
      passed++;
    } else {
      const error = result && result.error ? result.error : 'Test returned false';
      console.log(`❌ Test ${testNumber}: ${description}`);
      console.log(`   Error: ${error}`);
      failed++;
    }
  } catch (e) {
    console.log(`❌ Test ${testNumber}: ${description}`);
    console.log(`   Exception: ${e.message}`);
    failed++;
  }
}

console.log('🧪 4 Quarters Knowledge System - Test Suite');
console.log('=' .repeat(60));
console.log('');

// =====================================================================
// STRUCTURE VALIDATION TESTS
// =====================================================================

console.log('📋 Structure Validation Tests');
console.log('-' .repeat(60));

test('Mappings file has correct system name', function() {
  return mappings.systemName === "The 4 Quarters";
});

test('Data architecture is correctly set to "grouping"', function() {
  return mappings.dataArchitecture === "grouping";
});

test('Total groups is exactly 4', function() {
  if (mappings.totalGroups !== 4) {
    return { success: false, error: `Expected 4 groups, found ${mappings.totalGroups}` };
  }
  return true;
});

test('Mappings array contains exactly 4 quarters', function() {
  if (!mappings.mappings || mappings.mappings.length !== 4) {
    return { success: false, error: `Expected 4 mappings, found ${mappings.mappings ? mappings.mappings.length : 0}` };
  }
  return true;
});

test('Each quarter specifies 16 gates', function() {
  for (const quarter of mappings.mappings) {
    if (quarter.gatesPerQuarter !== 16) {
      return { success: false, error: `Quarter ${quarter.groupName} has ${quarter.gatesPerQuarter} gates (expected 16)` };
    }
  }
  return true;
});

// =====================================================================
// QUARTER NAME VALIDATION TESTS
// =====================================================================

console.log('');
console.log('🏷️  Quarter Name Validation Tests');
console.log('-' .repeat(60));

test('All expected quarter names are present', function() {
  const expectedQuarters = ['Mutation', 'Initiation', 'Duality', 'Civilisation'];
  const quarterNames = mappings.mappings.map(m => m.groupName);

  for (const expected of expectedQuarters) {
    if (!quarterNames.includes(expected)) {
      return { success: false, error: `Missing expected quarter: ${expected}` };
    }
  }
  return true;
});

test('No duplicate quarter names', function() {
  const quarterNames = mappings.mappings.map(m => m.groupName);
  const uniqueNames = new Set(quarterNames);

  if (uniqueNames.size !== quarterNames.length) {
    return { success: false, error: 'Duplicate quarter names found' };
  }
  return true;
});

test('Quarter names match canonical mappings', function() {
  const canonicalQuarters = CanonicalMappings.QUARTER_PATTERNS;

  for (const quarter of mappings.mappings) {
    const expectedName = canonicalQuarters[quarter.codonLetter];
    if (quarter.groupName !== expectedName) {
      return {
        success: false,
        error: `Quarter ${quarter.groupName} has codon letter ${quarter.codonLetter}, should be ${expectedName}`
      };
    }
  }
  return true;
});

// =====================================================================
// BINARY PATTERN VALIDATION TESTS
// =====================================================================

console.log('');
console.log('🔢 Binary Pattern Validation Tests');
console.log('-' .repeat(60));

test('All quarters have valid 2-bit binary patterns', function() {
  const validPatterns = ['00', '01', '10', '11'];

  for (const quarter of mappings.mappings) {
    if (!validPatterns.includes(quarter.binaryPattern)) {
      return {
        success: false,
        error: `Quarter ${quarter.groupName} has invalid binary pattern: ${quarter.binaryPattern}`
      };
    }
  }
  return true;
});

test('All four binary patterns are present (no duplicates)', function() {
  const patterns = mappings.mappings.map(m => m.binaryPattern);
  const uniquePatterns = new Set(patterns);

  if (uniquePatterns.size !== 4) {
    return { success: false, error: `Expected 4 unique patterns, found ${uniquePatterns.size}` };
  }

  const expectedPatterns = ['00', '01', '10', '11'];
  for (const expected of expectedPatterns) {
    if (!uniquePatterns.has(expected)) {
      return { success: false, error: `Missing expected pattern: ${expected}` };
    }
  }
  return true;
});

test('Binary patterns match canonical mappings', function() {
  const expectedPatterns = {
    'Mutation': '11',
    'Initiation': '10',
    'Duality': '01',
    'Civilisation': '00'
  };

  for (const quarter of mappings.mappings) {
    const expectedPattern = expectedPatterns[quarter.groupName];
    if (quarter.binaryPattern !== expectedPattern) {
      return {
        success: false,
        error: `${quarter.groupName} has binary pattern ${quarter.binaryPattern}, expected ${expectedPattern}`
      };
    }
  }
  return true;
});

test('Codon letters match binary patterns', function() {
  const binaryToCodon = { '11': 'A', '10': 'C', '01': 'G', '00': 'U' };

  for (const quarter of mappings.mappings) {
    const expectedCodon = binaryToCodon[quarter.binaryPattern];
    if (quarter.codonLetter !== expectedCodon) {
      return {
        success: false,
        error: `${quarter.groupName} binary ${quarter.binaryPattern} should have codon ${expectedCodon}, has ${quarter.codonLetter}`
      };
    }
  }
  return true;
});

// =====================================================================
// KNOWLEDGE CONTENT VALIDATION TESTS
// =====================================================================

console.log('');
console.log('📚 Knowledge Content Validation Tests');
console.log('-' .repeat(60));

test('All quarters have purpose defined', function() {
  for (const quarter of mappings.mappings) {
    if (!quarter.knowledge || !quarter.knowledge.purpose) {
      return { success: false, error: `Quarter ${quarter.groupName} missing purpose` };
    }
    if (quarter.knowledge.purpose.length < 10) {
      return { success: false, error: `Quarter ${quarter.groupName} purpose too short` };
    }
  }
  return true;
});

test('All quarters have theme defined', function() {
  for (const quarter of mappings.mappings) {
    if (!quarter.knowledge || !quarter.knowledge.theme) {
      return { success: false, error: `Quarter ${quarter.groupName} missing theme` };
    }
    if (quarter.knowledge.theme.length < 10) {
      return { success: false, error: `Quarter ${quarter.groupName} theme too short` };
    }
  }
  return true;
});

test('All quarters have quality defined', function() {
  for (const quarter of mappings.mappings) {
    if (!quarter.knowledge || !quarter.knowledge.quality) {
      return { success: false, error: `Quarter ${quarter.groupName} missing quality` };
    }
  }
  return true;
});

test('All quarters have description defined', function() {
  for (const quarter of mappings.mappings) {
    if (!quarter.knowledge || !quarter.knowledge.description) {
      return { success: false, error: `Quarter ${quarter.groupName} missing description` };
    }
    if (quarter.knowledge.description.length < 50) {
      return { success: false, error: `Quarter ${quarter.groupName} description too short (should be comprehensive)` };
    }
  }
  return true;
});

test('All quarters have evolutionary role defined', function() {
  for (const quarter of mappings.mappings) {
    if (!quarter.knowledge || !quarter.knowledge.evolutionaryRole) {
      return { success: false, error: `Quarter ${quarter.groupName} missing evolutionary role` };
    }
  }
  return true;
});

test('All quarters have consciousness perspective defined', function() {
  for (const quarter of mappings.mappings) {
    if (!quarter.knowledge || !quarter.knowledge.consciousness) {
      return { success: false, error: `Quarter ${quarter.groupName} missing consciousness perspective` };
    }
  }
  return true;
});

// =====================================================================
// DATABASE CONSISTENCY VALIDATION TESTS
// =====================================================================

console.log('');
console.log('🗄️  Database Consistency Validation Tests');
console.log('-' .repeat(60));

test('Database contains 64 gates total', function() {
  const gateCount = Object.keys(database.gates).length;
  if (gateCount !== 64) {
    return { success: false, error: `Expected 64 gates, found ${gateCount}` };
  }
  return true;
});

test('All gates in database have binary patterns', function() {
  for (let i = 1; i <= 64; i++) {
    const gate = database.gates[i.toString()];
    if (!gate || !gate.binary || gate.binary.length !== 6) {
      return { success: false, error: `Gate ${i} missing or has invalid binary pattern` };
    }
  }
  return true;
});

test('Gates distribute evenly across quarters (16 per quarter)', function() {
  const quarterDistribution = { '11': 0, '10': 0, '01': 0, '00': 0 };

  for (let i = 1; i <= 64; i++) {
    const gate = database.gates[i.toString()];
    const quarterPattern = gate.binary.substring(0, 2);
    quarterDistribution[quarterPattern]++;
  }

  for (const pattern in quarterDistribution) {
    if (quarterDistribution[pattern] !== 16) {
      return {
        success: false,
        error: `Quarter ${pattern} has ${quarterDistribution[pattern]} gates (expected 16)`
      };
    }
  }
  return true;
});

test('Sample gates match correct quarters', function() {
  // Test specific gates known to be in each quarter
  const testCases = [
    { gate: 1, expectedBinary: '11', expectedQuarter: 'Mutation' },     // Gate 1 (Heaven): 111111
    { gate: 2, expectedBinary: '00', expectedQuarter: 'Civilisation' }, // Gate 2 (Earth): 000000
    { gate: 13, expectedBinary: '10', expectedQuarter: 'Initiation' },  // Gate 13: 101xxx
    { gate: 7, expectedBinary: '01', expectedQuarter: 'Duality' }       // Gate 7: 010xxx
  ];

  for (const testCase of testCases) {
    const gate = database.gates[testCase.gate.toString()];
    const quarterPattern = gate.binary.substring(0, 2);

    if (quarterPattern !== testCase.expectedBinary) {
      return {
        success: false,
        error: `Gate ${testCase.gate} has binary ${gate.binary} (quarter pattern ${quarterPattern}), expected ${testCase.expectedBinary}`
      };
    }

    // Find the quarter mapping for this pattern
    const quarter = mappings.mappings.find(q => q.binaryPattern === quarterPattern);
    if (quarter.groupName !== testCase.expectedQuarter) {
      return {
        success: false,
        error: `Gate ${testCase.gate} pattern ${quarterPattern} maps to ${quarter.groupName}, expected ${testCase.expectedQuarter}`
      };
    }
  }
  return true;
});

test('All quarters have exactly 16 gates in database', function() {
  for (const quarter of mappings.mappings) {
    let count = 0;

    for (let i = 1; i <= 64; i++) {
      const gate = database.gates[i.toString()];
      const quarterPattern = gate.binary.substring(0, 2);

      if (quarterPattern === quarter.binaryPattern) {
        count++;
      }
    }

    if (count !== 16) {
      return {
        success: false,
        error: `Quarter ${quarter.groupName} (${quarter.binaryPattern}) has ${count} gates in database (expected 16)`
      };
    }
  }
  return true;
});

// =====================================================================
// MATHEMATICAL PRECISION TESTS
// =====================================================================

console.log('');
console.log('🔬 Mathematical Precision Tests');
console.log('-' .repeat(60));

test('Quarter opposites maintain perfect binary inversion', function() {
  const opposites = [
    ['Mutation', 'Civilisation', '11', '00'],
    ['Initiation', 'Duality', '10', '01']
  ];

  for (const [q1Name, q2Name, bin1, bin2] of opposites) {
    const q1 = mappings.mappings.find(q => q.groupName === q1Name);
    const q2 = mappings.mappings.find(q => q.groupName === q2Name);

    if (!q1 || !q2) {
      return { success: false, error: `Could not find quarters ${q1Name} and ${q2Name}` };
    }

    if (q1.binaryPattern !== bin1 || q2.binaryPattern !== bin2) {
      return {
        success: false,
        error: `Opposite pair ${q1Name}-${q2Name} has incorrect binary patterns`
      };
    }

    // Verify binary inversion
    const inverted = q1.binaryPattern.split('').map(b => b === '0' ? '1' : '0').join('');
    if (inverted !== q2.binaryPattern) {
      return {
        success: false,
        error: `${q1Name} (${q1.binaryPattern}) and ${q2Name} (${q2.binaryPattern}) are not perfect binary inverses`
      };
    }
  }
  return true;
});

test('Mathematical distribution is perfect: 4 × 16 = 64', function() {
  const totalQuarters = mappings.mappings.length;
  const gatesPerQuarter = mappings.gatesPerGroup || 16;
  const calculatedTotal = totalQuarters * gatesPerQuarter;

  if (calculatedTotal !== 64) {
    return {
      success: false,
      error: `Mathematical distribution error: ${totalQuarters} quarters × ${gatesPerQuarter} gates = ${calculatedTotal} (expected 64)`
    };
  }
  return true;
});

test('Quarter system completeness: all 64 gates accounted for', function() {
  const gatesCounted = new Set();

  for (const quarter of mappings.mappings) {
    for (let i = 1; i <= 64; i++) {
      const gate = database.gates[i.toString()];
      const quarterPattern = gate.binary.substring(0, 2);

      if (quarterPattern === quarter.binaryPattern) {
        gatesCounted.add(i);
      }
    }
  }

  if (gatesCounted.size !== 64) {
    return {
      success: false,
      error: `Only ${gatesCounted.size} gates accounted for in quarter system (expected 64)`
    };
  }
  return true;
});

// =====================================================================
// SUMMARY
// =====================================================================

console.log('');
console.log('=' .repeat(60));
console.log(`Total Tests: ${passed + failed}`);
console.log(`Passed: ${passed} ✅`);
console.log(`Failed: ${failed} ❌`);
console.log('=' .repeat(60));

if (failed === 0) {
  console.log('');
  console.log('🎉 All tests passed! The 4 Quarters knowledge system is valid.');
  console.log('');
  process.exit(0);
} else {
  console.log('');
  console.log('⚠️  Some tests failed. Please review the errors above.');
  console.log('');
  process.exit(1);
}
