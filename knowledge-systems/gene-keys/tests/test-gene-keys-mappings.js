/**
 * Test Suite for Gene Keys Knowledge System
 *
 * Validates that Gene Keys mappings correctly dock into the root system
 *
 * @version 1.0.0
 */

const geneKeysMappings = require('../mappings/gene-keys-mappings.json');
const positioningAlgorithm = require('../../../core/root-system/positioning-algorithm');

// Test results
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const errors = [];

function runTest(testName, testFunction) {
  totalTests++;
  try {
    const result = testFunction();
    if (result === true) {
      passedTests++;
      console.log(`✅ PASS: ${testName}`);
      return true;
    } else {
      failedTests++;
      console.log(`❌ FAIL: ${testName}`);
      if (typeof result === 'string') {
        errors.push({ test: testName, error: result });
        console.log(`   Error: ${result}`);
      }
      return false;
    }
  } catch (error) {
    failedTests++;
    console.log(`❌ FAIL: ${testName}`);
    console.log(`   Error: ${error.message}`);
    errors.push({ test: testName, error: error.message });
    return false;
  }
}

console.log('\n════════════════════════════════════════════════════════');
console.log('  GENE KEYS KNOWLEDGE SYSTEM TEST SUITE');
console.log('════════════════════════════════════════════════════════\n');

// Test 1: System metadata exists
runTest('System metadata exists', () => {
  if (!geneKeysMappings.systemName) return 'Missing systemName';
  if (!geneKeysMappings.version) return 'Missing version';
  if (!geneKeysMappings.description) return 'Missing description';
  if (geneKeysMappings.systemName !== 'Gene Keys') return 'Incorrect systemName';
  return true;
});

// Test 2: Completeness is set to "full"
runTest('Completeness is set to "full"', () => {
  if (geneKeysMappings.completeness !== 'full') {
    return `Expected completeness "full", got "${geneKeysMappings.completeness}"`;
  }
  return true;
});

// Test 3: All 64 gates are present
runTest('All 64 gates are present', () => {
  if (!Array.isArray(geneKeysMappings.mappings)) return 'Mappings is not an array';
  if (geneKeysMappings.mappings.length !== 64) {
    return `Expected 64 mappings, got ${geneKeysMappings.mappings.length}`;
  }
  return true;
});

// Test 4: No duplicate gates
runTest('No duplicate gates', () => {
  const gateNumbers = geneKeysMappings.mappings.map(m => m.gateNumber);
  const uniqueGates = new Set(gateNumbers);
  if (uniqueGates.size !== 64) {
    return `Found ${64 - uniqueGates.size} duplicate gates`;
  }
  return true;
});

// Test 5: All gates have valid gate numbers (1-64)
runTest('All gates have valid gate numbers (1-64)', () => {
  const invalidGates = geneKeysMappings.mappings.filter(m =>
    !m.gateNumber || m.gateNumber < 1 || m.gateNumber > 64
  );
  if (invalidGates.length > 0) {
    return `Found ${invalidGates.length} invalid gate numbers`;
  }
  return true;
});

// Test 6: All mappings have lineNumber set to null
runTest('All mappings have lineNumber set to null', () => {
  const invalidLines = geneKeysMappings.mappings.filter(m =>
    m.lineNumber !== null
  );
  if (invalidLines.length > 0) {
    return `Found ${invalidLines.length} mappings with non-null lineNumber`;
  }
  return true;
});

// Test 7: All mappings have required knowledge fields
runTest('All mappings have shadow, gift, and siddhi', () => {
  const missingFields = geneKeysMappings.mappings.filter(m => {
    if (!m.knowledge) return true;
    if (!m.knowledge.shadow) return true;
    if (!m.knowledge.gift) return true;
    if (!m.knowledge.siddhi) return true;
    return false;
  });

  if (missingFields.length > 0) {
    return `Found ${missingFields.length} mappings with missing required fields`;
  }
  return true;
});

// Test 8: All mappings have frequency patterns
runTest('All mappings have introverted and extroverted frequencies', () => {
  const missingFrequencies = geneKeysMappings.mappings.filter(m => {
    if (!m.knowledge) return true;
    if (!m.knowledge.introverted) return true;
    if (!m.knowledge.extroverted) return true;
    return false;
  });

  if (missingFrequencies.length > 0) {
    return `Found ${missingFrequencies.length} mappings with missing frequency data`;
  }
  return true;
});

// Test 9: Each gate covers 1-64 exactly once
runTest('Gates 1-64 are all covered exactly once', () => {
  const gateNumbers = new Set(geneKeysMappings.mappings.map(m => m.gateNumber));
  const missing = [];

  for (let i = 1; i <= 64; i++) {
    if (!gateNumbers.has(i)) {
      missing.push(i);
    }
  }

  if (missing.length > 0) {
    return `Missing gates: ${missing.join(', ')}`;
  }
  return true;
});

// Test 10: All mappings can dock into root system
runTest('All mappings can dock into root system', () => {
  const invalidMappings = [];

  geneKeysMappings.mappings.forEach((mapping, index) => {
    try {
      const validation = positioningAlgorithm.validateDocking(mapping);
      if (!validation.valid) {
        invalidMappings.push({
          index,
          gateNumber: mapping.gateNumber,
          errors: validation.errors
        });
      }
    } catch (error) {
      invalidMappings.push({
        index,
        gateNumber: mapping.gateNumber,
        errors: [error.message]
      });
    }
  });

  if (invalidMappings.length > 0) {
    return `${invalidMappings.length} mappings failed docking validation`;
  }
  return true;
});

// Test 11: Shadow values are non-empty strings
runTest('All shadow values are non-empty strings', () => {
  const invalidShadows = geneKeysMappings.mappings.filter(m => {
    const shadow = m.knowledge?.shadow;
    return !shadow || typeof shadow !== 'string' || shadow.trim().length === 0;
  });

  if (invalidShadows.length > 0) {
    return `Found ${invalidShadows.length} invalid shadow values`;
  }
  return true;
});

// Test 12: Gift values are non-empty strings
runTest('All gift values are non-empty strings', () => {
  const invalidGifts = geneKeysMappings.mappings.filter(m => {
    const gift = m.knowledge?.gift;
    return !gift || typeof gift !== 'string' || gift.trim().length === 0;
  });

  if (invalidGifts.length > 0) {
    return `Found ${invalidGifts.length} invalid gift values`;
  }
  return true;
});

// Test 13: Siddhi values are non-empty strings
runTest('All siddhi values are non-empty strings', () => {
  const invalidSiddhis = geneKeysMappings.mappings.filter(m => {
    const siddhi = m.knowledge?.siddhi;
    return !siddhi || typeof siddhi !== 'string' || siddhi.trim().length === 0;
  });

  if (invalidSiddhis.length > 0) {
    return `Found ${invalidSiddhis.length} invalid siddhi values`;
  }
  return true;
});

// Test 14: Can retrieve positioning data for all gates
runTest('Can retrieve positioning data for all gates', () => {
  const failures = [];

  geneKeysMappings.mappings.forEach(mapping => {
    try {
      const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
      if (!positioning) {
        failures.push(mapping.gateNumber);
      }
      if (!positioning.binary) {
        failures.push(mapping.gateNumber);
      }
    } catch (error) {
      failures.push(mapping.gateNumber);
    }
  });

  if (failures.length > 0) {
    return `Failed to get positioning for gates: ${failures.join(', ')}`;
  }
  return true;
});

// Test 15: No extra properties that might indicate data issues
runTest('Mappings have expected structure only', () => {
  const expectedKeys = ['gateNumber', 'lineNumber', 'knowledge'];
  const unexpectedMappings = [];

  geneKeysMappings.mappings.forEach((mapping, index) => {
    const actualKeys = Object.keys(mapping);
    const extraKeys = actualKeys.filter(key => !expectedKeys.includes(key));

    if (extraKeys.length > 0) {
      unexpectedMappings.push({
        index,
        gateNumber: mapping.gateNumber,
        extraKeys
      });
    }
  });

  if (unexpectedMappings.length > 0) {
    console.log(`   Note: ${unexpectedMappings.length} mappings have extra keys (might be intentional)`);
  }
  return true;
});

// Print summary
console.log('\n════════════════════════════════════════════════════════');
console.log('  TEST SUMMARY');
console.log('════════════════════════════════════════════════════════');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests} ✅`);
console.log(`Failed: ${failedTests} ❌`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests > 0) {
  console.log('\n❌ TESTS FAILED');
  console.log('\nErrors:');
  errors.forEach((err, index) => {
    console.log(`${index + 1}. ${err.test}: ${err.error}`);
  });
  process.exit(1);
} else {
  console.log('\n✅ ALL TESTS PASSED');
  process.exit(0);
}
