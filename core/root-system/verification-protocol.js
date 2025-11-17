/**
 * Verification Protocol for Knowledge System Docking
 *
 * All knowledge systems must pass these tests before merging
 *
 * @version 1.0.0
 */

const rootSystem = require('./positioning-algorithm.js');

/**
 * Verify a complete knowledge system mapping file
 */
function verifyKnowledgeSystem(mappingFile) {
  console.log(`\n🔍 VERIFICATION: ${mappingFile.systemName}`);
  console.log('='.repeat(60));

  const results = {
    systemName: mappingFile.systemName,
    version: mappingFile.version,
    totalTests: 0,
    passed: 0,
    failed: 0,
    errors: [],
    warnings: []
  };

  // Test 1: Structural validation
  console.log('\n1. STRUCTURAL VALIDATION');
  const structuralTests = [
    testHasSystemName(mappingFile, results),
    testHasVersion(mappingFile, results),
    testHasMappings(mappingFile, results),
    testMappingsIsArray(mappingFile, results)
  ];

  // Test 2: Gate/Line validation
  console.log('\n2. GATE/LINE VALIDATION');
  const gateLineTests = mappingFile.mappings.map((mapping, index) => {
    return testMappingValidity(mapping, index, results);
  });

  // Test 3: Docking validation
  console.log('\n3. DOCKING VALIDATION');
  const dockingTests = mappingFile.mappings.map((mapping, index) => {
    return testCanDock(mapping, index, results);
  });

  // Test 4: Completeness (if system claims to be complete)
  if (mappingFile.completeness === 'full') {
    console.log('\n4. COMPLETENESS VALIDATION');
    testAllGatesCovered(mappingFile, results);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total tests: ${results.totalTests}`);
  console.log(`Passed: ${results.passed} ✅`);
  console.log(`Failed: ${results.failed} ❌`);

  if (results.warnings.length > 0) {
    console.log(`\nWarnings: ${results.warnings.length} ⚠️`);
    results.warnings.forEach(w => console.log(`  - ${w}`));
  }

  if (results.errors.length > 0) {
    console.log(`\nErrors:`);
    results.errors.forEach(e => console.log(`  ❌ ${e}`));
  }

  const passed = results.failed === 0;
  console.log(`\n${passed ? '✅ VERIFICATION PASSED' : '❌ VERIFICATION FAILED'}`);

  return { passed, results };
}

// Individual test functions

function testHasSystemName(mappingFile, results) {
  results.totalTests++;
  if (mappingFile.systemName && typeof mappingFile.systemName === 'string') {
    results.passed++;
    console.log('  ✅ Has system name');
    return true;
  } else {
    results.failed++;
    results.errors.push('Missing or invalid systemName');
    console.log('  ❌ Missing or invalid systemName');
    return false;
  }
}

function testHasVersion(mappingFile, results) {
  results.totalTests++;
  if (mappingFile.version) {
    results.passed++;
    console.log('  ✅ Has version');
    return true;
  } else {
    results.failed++;
    results.warnings.push('Missing version number');
    console.log('  ⚠️  Missing version number');
    return false;
  }
}

function testHasMappings(mappingFile, results) {
  results.totalTests++;
  if (mappingFile.mappings) {
    results.passed++;
    console.log('  ✅ Has mappings array');
    return true;
  } else {
    results.failed++;
    results.errors.push('Missing mappings array');
    console.log('  ❌ Missing mappings array');
    return false;
  }
}

function testMappingsIsArray(mappingFile, results) {
  results.totalTests++;
  if (Array.isArray(mappingFile.mappings)) {
    results.passed++;
    console.log(`  ✅ Mappings is array (${mappingFile.mappings.length} entries)`);
    return true;
  } else {
    results.failed++;
    results.errors.push('Mappings is not an array');
    console.log('  ❌ Mappings is not an array');
    return false;
  }
}

function testMappingValidity(mapping, index, results) {
  results.totalTests++;
  const gate = mapping.gateNumber;
  const line = mapping.lineNumber;

  if (!gate || gate < 1 || gate > 64) {
    results.failed++;
    results.errors.push(`Mapping ${index}: Invalid gate number ${gate}`);
    console.log(`  ❌ Mapping ${index}: Invalid gate ${gate}`);
    return false;
  }

  if (line && (line < 1 || line > 6)) {
    results.failed++;
    results.errors.push(`Mapping ${index}: Invalid line number ${line}`);
    console.log(`  ❌ Mapping ${index}: Invalid line ${line}`);
    return false;
  }

  results.passed++;
  return true;
}

function testCanDock(mapping, index, results) {
  results.totalTests++;
  try {
    const docking = rootSystem.verifyDocking(mapping);
    if (docking.valid) {
      results.passed++;
      if (index === 0) console.log(`  ✅ All mappings can dock into root system`);
      return true;
    } else {
      results.failed++;
      results.errors.push(`Mapping ${index}: Cannot dock - ${docking.error}`);
      console.log(`  ❌ Mapping ${index}: Cannot dock`);
      return false;
    }
  } catch (error) {
    results.failed++;
    results.errors.push(`Mapping ${index}: Docking error - ${error.message}`);
    console.log(`  ❌ Mapping ${index}: Docking error`);
    return false;
  }
}

function testAllGatesCovered(mappingFile, results) {
  results.totalTests++;
  const coveredGates = new Set(mappingFile.mappings.map(m => m.gateNumber));
  const missing = [];

  for (let g = 1; g <= 64; g++) {
    if (!coveredGates.has(g)) {
      missing.push(g);
    }
  }

  if (missing.length === 0) {
    results.passed++;
    console.log('  ✅ All 64 gates covered');
    return true;
  } else {
    results.failed++;
    results.errors.push(`Missing gates: ${missing.join(', ')}`);
    console.log(`  ❌ Missing ${missing.length} gates: ${missing.slice(0, 5).join(', ')}...`);
    return false;
  }
}

module.exports = {
  verifyKnowledgeSystem
};
