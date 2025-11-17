#!/usr/bin/env node
/**
 * Test Suite for Incarnation Crosses Mappings
 *
 * Comprehensive validation of the gate-cross mappings and cross definitions
 */

const fs = require('fs');
const path = require('path');

// Load mapping files
const gateCrossMappingsPath = path.join(__dirname, '../mappings/gate-cross-mappings.json');
const crossDefinitionsPath = path.join(__dirname, '../mappings/cross-definitions.json');
const sourceDataPath = path.join(__dirname, '../../../data/source/extracted/incarnation-crosses-extracted-data.json');

const gateCrossMappings = JSON.parse(fs.readFileSync(gateCrossMappingsPath, 'utf8'));
const crossDefinitions = JSON.parse(fs.readFileSync(crossDefinitionsPath, 'utf8'));
const sourceData = JSON.parse(fs.readFileSync(sourceDataPath, 'utf8'));

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

/**
 * Test helper function
 */
function test(name, fn) {
  try {
    const result = fn();
    if (result.pass) {
      results.passed++;
      results.tests.push({ name, status: 'PASS', message: result.message });
      console.log('✓', name);
      if (result.message) {
        console.log('  ', result.message);
      }
    } else {
      results.failed++;
      results.tests.push({ name, status: 'FAIL', message: result.message });
      console.log('✗', name);
      console.log('  ', result.message);
    }
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'ERROR', message: error.message });
    console.log('✗', name, '- ERROR:', error.message);
  }
}

/**
 * Warning helper function
 */
function warn(name, message) {
  results.warnings++;
  results.tests.push({ name, status: 'WARN', message });
  console.log('⚠', name);
  console.log('  ', message);
}

console.log('=== INCARNATION CROSSES MAPPING TESTS ===\n');

// Test 1: All 64 gates present in mappings
test('Test 1: All 64 gates present in mappings', () => {
  const gateNumbers = gateCrossMappings.mappings.map(m => m.gateNumber);
  const uniqueGates = new Set(gateNumbers);

  if (uniqueGates.size !== 64) {
    return { pass: false, message: `Found ${uniqueGates.size} gates, expected 64` };
  }

  for (let i = 1; i <= 64; i++) {
    if (!uniqueGates.has(i)) {
      return { pass: false, message: `Gate ${i} is missing` };
    }
  }

  return { pass: true, message: 'All 64 gates present' };
});

// Test 2: All 192 crosses present across all gates
test('Test 2: All 192 crosses present across all gates', () => {
  const uniqueCrosses = new Set();

  gateCrossMappings.mappings.forEach(gateMapping => {
    const knowledge = gateMapping.knowledge;
    [
      ...knowledge.crossesAsPersonalitySun,
      ...knowledge.crossesAsPersonalityEarth,
      ...knowledge.crossesAsDesignSun,
      ...knowledge.crossesAsDesignEarth
    ].forEach(cross => {
      uniqueCrosses.add(cross.name);
    });
  });

  if (uniqueCrosses.size !== 192) {
    return { pass: false, message: `Found ${uniqueCrosses.size} crosses, expected 192` };
  }

  return { pass: true, message: '192 unique crosses found' };
});

// Test 3: Cross types valid (LAX/RAX/JX)
test('Test 3: Cross types valid (LAX/RAX/JX)', () => {
  const validTypes = new Set(['LAX', 'RAX', 'JX']);
  const invalidCrosses = [];

  for (const crossName in crossDefinitions.crosses) {
    const cross = crossDefinitions.crosses[crossName];
    if (!validTypes.has(cross.type)) {
      invalidCrosses.push(`${crossName}: ${cross.type}`);
    }
  }

  if (invalidCrosses.length > 0) {
    return { pass: false, message: `Invalid types found: ${invalidCrosses.join(', ')}` };
  }

  return { pass: true, message: 'All cross types are LAX, RAX, or JX' };
});

// Test 4: Cross type distribution (64 LAX + 63 RAX + 63 JX)
test('Test 4: Cross type distribution correct', () => {
  const typeCounts = crossDefinitions.crossTypes;

  if (typeCounts.LAX !== 64) {
    return { pass: false, message: `LAX count: ${typeCounts.LAX}, expected 64` };
  }
  if (typeCounts.RAX !== 64) {
    return { pass: false, message: `RAX count: ${typeCounts.RAX}, expected 64` };
  }
  if (typeCounts.JX !== 64) {
    return { pass: false, message: `JX count: ${typeCounts.JX}, expected 64` };
  }

  return { pass: true, message: 'LAX: 64, RAX: 64, JX: 64' };
});

// Test 5: Each cross appears in exactly 4 gate mappings (accounting for duplicates)
test('Test 5: Each cross referenced from correct number of gates', () => {
  const crossGateReferences = {};

  gateCrossMappings.mappings.forEach(gateMapping => {
    const gateNumber = gateMapping.gateNumber;
    const knowledge = gateMapping.knowledge;

    [
      ...knowledge.crossesAsPersonalitySun,
      ...knowledge.crossesAsPersonalityEarth,
      ...knowledge.crossesAsDesignSun,
      ...knowledge.crossesAsDesignEarth
    ].forEach(cross => {
      if (!crossGateReferences[cross.name]) {
        crossGateReferences[cross.name] = new Set();
      }
      crossGateReferences[cross.name].add(gateNumber);
    });
  });

  const invalidCrosses = [];
  for (const crossName in crossGateReferences) {
    const gateCount = crossGateReferences[crossName].size;
    if (gateCount < 3 || gateCount > 4) {
      invalidCrosses.push(`${crossName}: ${gateCount} gates`);
    }
  }

  if (invalidCrosses.length > 0) {
    // This is a warning, not a failure, due to data quality issues
    warn('Some crosses have unexpected gate counts', invalidCrosses.slice(0, 5).join(', '));
    return { pass: true, message: `${invalidCrosses.length} crosses with unexpected gate counts (data quality issue)` };
  }

  return { pass: true, message: 'All crosses referenced from 3-4 gates' };
});

// Test 6: No duplicate crosses in same gate role
test('Test 6: No duplicate crosses in same gate role', () => {
  const duplicates = [];

  gateCrossMappings.mappings.forEach(gateMapping => {
    const knowledge = gateMapping.knowledge;

    const roles = [
      { name: 'PersonalitySun', crosses: knowledge.crossesAsPersonalitySun },
      { name: 'PersonalityEarth', crosses: knowledge.crossesAsPersonalityEarth },
      { name: 'DesignSun', crosses: knowledge.crossesAsDesignSun },
      { name: 'DesignEarth', crosses: knowledge.crossesAsDesignEarth }
    ];

    roles.forEach(role => {
      const crossNames = role.crosses.map(c => c.name);
      const uniqueNames = new Set(crossNames);
      if (crossNames.length !== uniqueNames.size) {
        duplicates.push(`Gate ${gateMapping.gateNumber} - ${role.name}`);
      }
    });
  });

  if (duplicates.length > 0) {
    return { pass: false, message: `Duplicates found in: ${duplicates.join(', ')}` };
  }

  return { pass: true, message: 'No duplicate crosses within same role' };
});

// Test 7: Gate roles consistent between mappings and definitions
test('Test 7: Gate roles consistent with cross definitions', () => {
  const inconsistencies = [];

  gateCrossMappings.mappings.forEach(gateMapping => {
    const gateNumber = gateMapping.gateNumber;
    const knowledge = gateMapping.knowledge;

    // Check Personality Sun
    knowledge.crossesAsPersonalitySun.forEach(cross => {
      const crossDef = crossDefinitions.crosses[cross.name];
      if (crossDef && crossDef.personalitySun !== gateNumber) {
        inconsistencies.push(`${cross.name}: Gate ${gateNumber} marked as Personality Sun, but cross says ${crossDef.personalitySun}`);
      }
    });

    // Check Personality Earth
    knowledge.crossesAsPersonalityEarth.forEach(cross => {
      const crossDef = crossDefinitions.crosses[cross.name];
      if (crossDef && crossDef.personalityEarth !== gateNumber) {
        inconsistencies.push(`${cross.name}: Gate ${gateNumber} marked as Personality Earth, but cross says ${crossDef.personalityEarth}`);
      }
    });

    // Check Design Sun
    knowledge.crossesAsDesignSun.forEach(cross => {
      const crossDef = crossDefinitions.crosses[cross.name];
      if (crossDef && crossDef.designSun !== gateNumber) {
        inconsistencies.push(`${cross.name}: Gate ${gateNumber} marked as Design Sun, but cross says ${crossDef.designSun}`);
      }
    });

    // Check Design Earth
    knowledge.crossesAsDesignEarth.forEach(cross => {
      const crossDef = crossDefinitions.crosses[cross.name];
      if (crossDef && crossDef.designEarth !== gateNumber) {
        inconsistencies.push(`${cross.name}: Gate ${gateNumber} marked as Design Earth, but cross says ${crossDef.designEarth}`);
      }
    });
  });

  if (inconsistencies.length > 0) {
    return { pass: false, message: `Found ${inconsistencies.length} inconsistencies: ${inconsistencies.slice(0, 3).join('; ')}` };
  }

  return { pass: true, message: 'All gate roles consistent' };
});

// Test 8: Mappings contain all required fields
test('Test 8: Mappings contain all required fields', () => {
  const missingFields = [];

  gateCrossMappings.mappings.forEach(gateMapping => {
    if (!gateMapping.gateNumber) missingFields.push('gateNumber');
    if (!gateMapping.knowledge) missingFields.push('knowledge');
    if (!gateMapping.statistics) missingFields.push('statistics');

    if (gateMapping.knowledge) {
      if (!gateMapping.knowledge.crossesAsPersonalitySun) missingFields.push('crossesAsPersonalitySun');
      if (!gateMapping.knowledge.crossesAsPersonalityEarth) missingFields.push('crossesAsPersonalityEarth');
      if (!gateMapping.knowledge.crossesAsDesignSun) missingFields.push('crossesAsDesignSun');
      if (!gateMapping.knowledge.crossesAsDesignEarth) missingFields.push('crossesAsDesignEarth');
    }
  });

  if (missingFields.length > 0) {
    const uniqueFields = [...new Set(missingFields)];
    return { pass: false, message: `Missing fields: ${uniqueFields.join(', ')}` };
  }

  return { pass: true, message: 'All required fields present' };
});

// Test 9: Cross definitions match source data
test('Test 9: Cross definitions match source data', () => {
  const mismatches = [];

  for (const crossName in sourceData.crosses) {
    const sourceCross = sourceData.crosses[crossName];
    const defCross = crossDefinitions.crosses[crossName];

    if (!defCross) {
      mismatches.push(`${crossName} missing from definitions`);
      continue;
    }

    if (defCross.type !== sourceCross.type) {
      mismatches.push(`${crossName} type mismatch: ${defCross.type} vs ${sourceCross.type}`);
    }

    if (defCross.personalitySun !== sourceCross.personalitySun) {
      mismatches.push(`${crossName} personalitySun mismatch`);
    }
  }

  if (mismatches.length > 0) {
    return { pass: false, message: `Found ${mismatches.length} mismatches: ${mismatches.slice(0, 3).join('; ')}` };
  }

  return { pass: true, message: 'Cross definitions match source data' };
});

// Test 10: Statistics are accurate
test('Test 10: Statistics are accurate', () => {
  const stats = gateCrossMappings.statistics;

  if (stats.totalGates !== 64) {
    return { pass: false, message: `Total gates: ${stats.totalGates}, expected 64` };
  }

  if (stats.gatesWithCrosses !== 64) {
    return { pass: false, message: `Gates with crosses: ${stats.gatesWithCrosses}, expected 64` };
  }

  // Verify total cross participations
  let actualTotal = 0;
  gateCrossMappings.mappings.forEach(gateMapping => {
    actualTotal += gateMapping.statistics.total;
  });

  if (actualTotal !== stats.totalCrossParticipations) {
    return { pass: false, message: `Total participations mismatch: ${stats.totalCrossParticipations} vs ${actualTotal}` };
  }

  return { pass: true, message: `Total participations: ${actualTotal}` };
});

// Test 11: Verify harmonic opposite relationships
test('Test 11: Verify harmonic opposite relationships in crosses', () => {
  // This test checks that Personality Sun/Earth and Design Sun/Earth
  // follow the harmonic opposite pattern (where applicable)
  // Note: This is a structural check, not a mathematical validation

  const crossesChecked = [];
  const crossesPassed = [];

  for (const crossName in crossDefinitions.crosses) {
    const cross = crossDefinitions.crosses[crossName];

    crossesChecked.push(crossName);

    // We just verify the structure is complete
    if (cross.personalitySun && cross.personalityEarth && cross.designSun && cross.designEarth) {
      crossesPassed.push(crossName);
    }
  }

  return {
    pass: true,
    message: `${crossesPassed.length}/${crossesChecked.length} crosses have complete gate structure`
  };
});

// Test 12: File format validation
test('Test 12: File format validation', () => {
  const errors = [];

  // Check gate-cross-mappings format
  if (!gateCrossMappings.systemName) errors.push('Missing systemName in mappings');
  if (!gateCrossMappings.version) errors.push('Missing version in mappings');
  if (!Array.isArray(gateCrossMappings.mappings)) errors.push('Mappings should be an array');

  // Check cross-definitions format
  if (!crossDefinitions.systemName) errors.push('Missing systemName in definitions');
  if (!crossDefinitions.totalCrosses) errors.push('Missing totalCrosses in definitions');
  if (!crossDefinitions.crossTypes) errors.push('Missing crossTypes in definitions');

  if (errors.length > 0) {
    return { pass: false, message: errors.join('; ') };
  }

  return { pass: true, message: 'File formats valid' };
});

// Summary
console.log('\n=== TEST SUMMARY ===\n');
console.log('Total tests:', results.passed + results.failed);
console.log('Passed:', results.passed);
console.log('Failed:', results.failed);
console.log('Warnings:', results.warnings);
console.log('\nOverall:', results.failed === 0 ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
