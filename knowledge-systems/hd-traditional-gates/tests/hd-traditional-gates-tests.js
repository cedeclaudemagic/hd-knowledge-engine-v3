#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Traditional HD Gates Knowledge System
 * Tests all 384 line-level mappings with ARRAY-BASED planet structure
 *
 * Architecture: Planets are ALWAYS arrays, even for single planets
 * This supports lines with:
 * - No planets (empty array)
 * - Single planet (array with 1 element)
 * - Multiple planets (array with 2+ elements)
 */

const fs = require('fs');
const path = require('path');

// Load mapping data
const mappingFile = path.join(__dirname, '../mappings/hd-gates-mappings.json');
const data = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));

// Test counters
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Test results
const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Helper functions
function test(name, condition, failureMessage = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    results.passed.push(name);
    return true;
  } else {
    failedTests++;
    results.failed.push({ name, message: failureMessage });
    return false;
  }
}

function describe(suiteName) {
  console.log(`\n📋 ${suiteName}`);
  console.log('─'.repeat(60));
}

function it(testName, testFn) {
  try {
    const result = testFn();
    if (result) {
      console.log(`  ✅ ${testName}`);
    } else {
      console.log(`  ❌ ${testName}`);
    }
  } catch (error) {
    console.log(`  ❌ ${testName} - Error: ${error.message}`);
    test(testName, false, error.message);
  }
}

// Start tests
console.log('🧪 Traditional HD Gates Knowledge System - Test Suite v2.0');
console.log('   (Array-Based Planet Architecture)');
console.log('='.repeat(60));
console.log(`Testing: ${mappingFile}`);
console.log('');

// ============================================================================
// Test Suite 1: Data Structure & Completeness
// ============================================================================
describe('Test Suite 1: Data Structure & Completeness');

it('should have systemName defined', () => {
  return test(
    'System name defined',
    data.systemName === "Traditional Human Design Gates",
    `Expected "Traditional Human Design Gates", got "${data.systemName}"`
  );
});

it('should have version 2.0.0', () => {
  return test(
    'Version is 2.0.0',
    data.version === "2.0.0",
    `Expected "2.0.0", got "${data.version}"`
  );
});

it('should specify array-based architecture', () => {
  return test(
    'Architecture is array-based-planets',
    data.architecture === "array-based-planets",
    `Expected "array-based-planets", got "${data.architecture}"`
  );
});

it('should be marked as complete', () => {
  return test(
    'Completeness flag',
    data.completeness === "full",
    `Expected "full", got "${data.completeness}"`
  );
});

it('should have exactly 384 mappings', () => {
  return test(
    'Total mappings = 384',
    data.mappings.length === 384,
    `Expected 384, got ${data.mappings.length}`
  );
});

it('should have all 64 gates', () => {
  const gates = new Set(data.mappings.map(m => m.gateNumber));
  return test(
    'All 64 gates present',
    gates.size === 64,
    `Expected 64 unique gates, got ${gates.size}`
  );
});

// ============================================================================
// Test Suite 2: Gate Coverage (64 gates × 6 lines)
// ============================================================================
describe('Test Suite 2: Gate Coverage');

const gateLineCounts = {};
data.mappings.forEach(m => {
  gateLineCounts[m.gateNumber] = (gateLineCounts[m.gateNumber] || 0) + 1;
});

for (let gateNum = 1; gateNum <= 64; gateNum++) {
  it(`should have 6 lines for Gate ${gateNum}`, () => {
    const count = gateLineCounts[gateNum] || 0;
    return test(
      `Gate ${gateNum} has 6 lines`,
      count === 6,
      `Gate ${gateNum} has ${count} lines instead of 6`
    );
  });
}

// ============================================================================
// Test Suite 3: Line Numbers Validity
// ============================================================================
describe('Test Suite 3: Line Numbers Validity');

it('should have valid line numbers (1-6)', () => {
  const invalidLines = data.mappings.filter(m => m.lineNumber < 1 || m.lineNumber > 6);
  return test(
    'All line numbers are 1-6',
    invalidLines.length === 0,
    `Found ${invalidLines.length} invalid line numbers`
  );
});

it('should have lineNumber as integer', () => {
  const nonIntegers = data.mappings.filter(m => !Number.isInteger(m.lineNumber));
  return test(
    'All line numbers are integers',
    nonIntegers.length === 0,
    `Found ${nonIntegers.length} non-integer line numbers`
  );
});

// ============================================================================
// Test Suite 4: Required Knowledge Fields
// ============================================================================
describe('Test Suite 4: Required Knowledge Fields');

it('should have keynotes for all lines', () => {
  const missing = data.mappings.filter(m => !m.knowledge.lineKeynote);
  return test(
    'All lines have keynotes',
    missing.length === 0,
    `Missing keynotes: ${missing.length} lines`
  );
});

it('should have non-empty keynotes', () => {
  const empty = data.mappings.filter(m => !m.knowledge.lineKeynote || m.knowledge.lineKeynote.trim() === '');
  return test(
    'All keynotes are non-empty',
    empty.length === 0,
    `Empty keynotes: ${empty.length} lines`
  );
});

it('should have gate names for all lines', () => {
  const missing = data.mappings.filter(m => !m.knowledge.gateName);
  return test(
    'All lines have gate names',
    missing.length === 0,
    `Missing gate names: ${missing.length} lines`
  );
});

it('should have polarity for all lines', () => {
  const missing = data.mappings.filter(m => !m.knowledge.polarity);
  return test(
    'All lines have polarity',
    missing.length === 0,
    `Missing polarity: ${missing.length} lines`
  );
});

it('should have valid polarity values (YANG or YIN)', () => {
  const invalid = data.mappings.filter(m =>
    m.knowledge.polarity !== 'YANG' && m.knowledge.polarity !== 'YIN'
  );
  return test(
    'All polarities are YANG or YIN',
    invalid.length === 0,
    `Invalid polarities: ${invalid.length} lines`
  );
});

// ============================================================================
// Test Suite 5: Array-Based Planet Structure
// ============================================================================
describe('Test Suite 5: Array-Based Planet Structure');

it('should have exaltation.planets as array for all lines', () => {
  const notArray = data.mappings.filter(m =>
    !Array.isArray(m.knowledge.blackBook?.exaltation?.planets)
  );
  return test(
    'All exaltations use array structure',
    notArray.length === 0,
    `Found ${notArray.length} non-array exaltations`
  );
});

it('should have detriment.planets as array for all lines', () => {
  const notArray = data.mappings.filter(m =>
    !Array.isArray(m.knowledge.blackBook?.detriment?.planets)
  );
  return test(
    'All detriments use array structure',
    notArray.length === 0,
    `Found ${notArray.length} non-array detriments`
  );
});

it('should have consistent array structure in White Book', () => {
  const notArray = data.mappings.filter(m =>
    !Array.isArray(m.knowledge.whiteBook?.exaltation?.planets) ||
    !Array.isArray(m.knowledge.whiteBook?.detriment?.planets)
  );
  return test(
    'White Book uses array structure',
    notArray.length === 0,
    `Found ${notArray.length} non-array structures in White Book`
  );
});

// ============================================================================
// Test Suite 6: Planetary Assignments Validation
// ============================================================================
describe('Test Suite 6: Planetary Assignments Validation');

const validPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];

it('should have valid exaltation planets', () => {
  const invalid = [];
  data.mappings.forEach(m => {
    m.knowledge.blackBook.exaltation.planets.forEach(p => {
      if (!validPlanets.includes(p.planet)) {
        invalid.push(`Gate ${m.gateNumber}.${m.lineNumber}: ${p.planet}`);
      }
    });
  });
  return test(
    'All exaltation planets are valid',
    invalid.length === 0,
    `Invalid planets: ${invalid.join(', ')}`
  );
});

it('should have valid detriment planets', () => {
  const invalid = [];
  data.mappings.forEach(m => {
    m.knowledge.blackBook.detriment.planets.forEach(p => {
      if (!validPlanets.includes(p.planet)) {
        invalid.push(`Gate ${m.gateNumber}.${m.lineNumber}: ${p.planet}`);
      }
    });
  });
  return test(
    'All detriment planets are valid',
    invalid.length === 0,
    `Invalid planets: ${invalid.join(', ')}`
  );
});

it('should have planet descriptions', () => {
  const missingDesc = [];
  data.mappings.forEach(m => {
    m.knowledge.blackBook.exaltation.planets.forEach(p => {
      if (!p.description || !p.description.blackBook) {
        missingDesc.push(`Gate ${m.gateNumber}.${m.lineNumber} exaltation ${p.planet}`);
      }
    });
    m.knowledge.blackBook.detriment.planets.forEach(p => {
      if (!p.description || !p.description.blackBook) {
        missingDesc.push(`Gate ${m.gateNumber}.${m.lineNumber} detriment ${p.planet}`);
      }
    });
  });
  return test(
    'All planets have Black Book descriptions',
    missingDesc.length === 0,
    `Missing descriptions: ${missingDesc.slice(0, 5).join(', ')}${missingDesc.length > 5 ? '...' : ''}`
  );
});

// ============================================================================
// Test Suite 7: Multi-Planet Lines (Critical Test)
// ============================================================================
describe('Test Suite 7: Multi-Planet Lines (Critical)');

it('should correctly capture Gate 11.4 (Moon AND Venus exalted)', () => {
  const line = data.mappings.find(m => m.gateNumber === 11 && m.lineNumber === 4);
  const planets = line?.knowledge.blackBook.exaltation.planets.map(p => p.planet) || [];
  return test(
    'Gate 11.4 has Moon AND Venus',
    planets.includes('Moon') && planets.includes('Venus') && planets.length === 2,
    `Gate 11.4 planets: ${planets.join(', ')} (expected Moon, Venus)`
  );
});

it('should correctly capture Gate 25.4 (Venus AND Jupiter exalted)', () => {
  const line = data.mappings.find(m => m.gateNumber === 25 && m.lineNumber === 4);
  const planets = line?.knowledge.blackBook.exaltation.planets.map(p => p.planet) || [];
  return test(
    'Gate 25.4 has Venus AND Jupiter',
    planets.includes('Venus') && planets.includes('Jupiter') && planets.length === 2,
    `Gate 25.4 planets: ${planets.join(', ')} (expected Venus, Jupiter)`
  );
});

it('should have exactly 2 lines with multiple exalted planets', () => {
  const multiPlanetLines = data.mappings.filter(m =>
    m.knowledge.blackBook.exaltation.planets.length > 1
  );
  return test(
    'Exactly 2 lines with multiple exalted planets',
    multiPlanetLines.length === 2,
    `Found ${multiPlanetLines.length} lines (expected 2: Gate 11.4, Gate 25.4)`
  );
});

// ============================================================================
// Test Suite 8: No-Planet Lines (Edge Cases)
// ============================================================================
describe('Test Suite 8: No-Planet Lines (Edge Cases)');

it('should handle lines with no exaltation planets', () => {
  const noPlanets = data.mappings.filter(m =>
    m.knowledge.blackBook.exaltation.planets.length === 0
  );
  // Lines with explicitly "None" or missing exaltations
  return test(
    'Lines with no exaltation handled correctly',
    noPlanets.length >= 3 && noPlanets.length <= 8,
    `Found ${noPlanets.length} lines with no exaltation (expected 3-8)`
  );
});

it('should handle lines with no detriment planets', () => {
  const noPlanets = data.mappings.filter(m =>
    m.knowledge.blackBook.detriment.planets.length === 0
  );
  return test(
    'Lines with no detriment handled correctly',
    noPlanets.length >= 6 && noPlanets.length <= 8,
    `Found ${noPlanets.length} lines with no detriment (expected ~7)`
  );
});

// ============================================================================
// Test Suite 9: Data Consistency
// ============================================================================
describe('Test Suite 9: Data Consistency');

it('should have matching planet counts between Black and White Books', () => {
  const mismatches = data.mappings.filter(m => {
    const bbExCount = m.knowledge.blackBook.exaltation.planets.length;
    const wbExCount = m.knowledge.whiteBook.exaltation.planets.length;
    const bbDeCount = m.knowledge.blackBook.detriment.planets.length;
    const wbDeCount = m.knowledge.whiteBook.detriment.planets.length;

    return bbExCount !== wbExCount || bbDeCount !== wbDeCount;
  });

  return test(
    'Planet counts match between interpretations',
    mismatches.length === 0,
    `Found ${mismatches.length} mismatches`
  );
});

it('should have consistent gate names within same gate', () => {
  const gateNames = {};
  data.mappings.forEach(m => {
    if (!gateNames[m.gateNumber]) {
      gateNames[m.gateNumber] = m.knowledge.gateName;
    }
  });

  const inconsistent = data.mappings.filter(m =>
    m.knowledge.gateName !== gateNames[m.gateNumber]
  );

  return test(
    'Gate names are consistent',
    inconsistent.length === 0,
    `Found ${inconsistent.length} inconsistent gate names`
  );
});

it('should have gate keywords for all gates', () => {
  const missingKeywords = data.mappings.filter(m => !m.knowledge.gateKeyword);
  return test(
    'Gate keywords present',
    missingKeywords.length === 0,
    `Missing keywords: ${missingKeywords.length} lines`
  );
});

// ============================================================================
// Summary
// ============================================================================
console.log('\n');
console.log('='.repeat(60));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(60));
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests} ✅`);
console.log(`Failed: ${failedTests} ❌`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log('');

// Data integrity summary
console.log('📈 DATA INTEGRITY VERIFICATION:');
const multiPlanetLines = data.mappings.filter(m =>
  m.knowledge.blackBook.exaltation.planets.length > 1 ||
  m.knowledge.blackBook.detriment.planets.length > 1
);
const noPlanetLines = data.mappings.filter(m =>
  m.knowledge.blackBook.exaltation.planets.length === 0 ||
  m.knowledge.blackBook.detriment.planets.length === 0
);
console.log(`   Multi-planet lines: ${multiPlanetLines.length}`);
console.log(`   No-planet lines: ${noPlanetLines.length}`);
console.log(`   Standard lines: ${384 - multiPlanetLines.length - noPlanetLines.length}`);
console.log('');

if (results.failed.length > 0) {
  console.log('❌ FAILED TESTS:');
  results.failed.forEach(({ name, message }) => {
    console.log(`   - ${name}`);
    if (message) console.log(`     ${message}`);
  });
  console.log('');
}

if (failedTests === 0) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('');
  console.log('✅ Traditional HD Gates knowledge system is fully validated');
  console.log('   - All 384 lines present');
  console.log('   - All gates have 6 lines');
  console.log('   - Array-based architecture verified');
  console.log('   - Multi-planet lines correctly captured');
  console.log('   - No-planet edge cases handled');
  console.log('   - Both Black Book and White Book present');
  console.log('   - All planetary assignments validated');
  process.exit(0);
} else {
  console.log('❌ TESTS FAILED');
  console.log(`   ${failedTests} test(s) failed`);
  process.exit(1);
}
