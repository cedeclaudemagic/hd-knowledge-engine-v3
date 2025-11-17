/**
 * Root System Integration Test Suite for Gene Keys
 *
 * Validates integration between Gene Keys and the root positioning system
 *
 * @version 1.0.0
 */

const geneKeysMappings = require('../mappings/gene-keys-mappings.json');
const positioningAlgorithm = require('../../../core/root-system/positioning-algorithm');
const binaryIdentity = require('../../../core/root-system/binary-identity.json');
const gateSequence = require('../../../core/root-system/gate-sequence.json');
const canonicalMappings = require('../../../scripts/utilities/canonical-mappings');

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
console.log('  ROOT SYSTEM INTEGRATION TEST SUITE');
console.log('════════════════════════════════════════════════════════\n');

// Test 1: All gates exist in root binary identity system
runTest('All Gene Keys gates exist in binary identity system', () => {
  const missingGates = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const gateStr = mapping.gateNumber.toString();
    if (!binaryIdentity.gates[gateStr]) {
      missingGates.push(mapping.gateNumber);
    }
  });

  if (missingGates.length > 0) {
    return `Missing in binary identity: ${missingGates.join(', ')}`;
  }
  return true;
});

// Test 2: All gates exist in gate sequence system
runTest('All Gene Keys gates exist in gate sequence system', () => {
  const missingGates = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const gateStr = mapping.gateNumber.toString();
    const wheelIndex = gateSequence.wheelIndex[gateStr];
    // Check for undefined/null, not falsy (because wheelIndex 0 is valid)
    if (wheelIndex === undefined || wheelIndex === null) {
      missingGates.push(mapping.gateNumber);
    }
  });

  if (missingGates.length > 0) {
    return `Missing in gate sequence: ${missingGates.join(', ')}`;
  }
  return true;
});

// Test 3: All gates can retrieve positioning data
runTest('All gates can retrieve positioning data', () => {
  const failures = [];

  geneKeysMappings.mappings.forEach(mapping => {
    try {
      const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
      if (!positioning) {
        failures.push(mapping.gateNumber);
      }
    } catch (error) {
      failures.push(mapping.gateNumber);
    }
  });

  if (failures.length > 0) {
    return `Failed to get positioning for: ${failures.join(', ')}`;
  }
  return true;
});

// Test 4: Binary patterns are valid
runTest('All gates have valid 6-digit binary patterns', () => {
  const invalidBinary = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const binary = positioning.binary;

    if (!binary || binary.length !== 6 || !/^[01]{6}$/.test(binary)) {
      invalidBinary.push(`Gate ${mapping.gateNumber}: "${binary}"`);
    }
  });

  if (invalidBinary.length > 0) {
    return `Invalid binary patterns: ${invalidBinary[0]}`;
  }
  return true;
});

// Test 5: Codon patterns are valid
runTest('All gates have valid 3-letter codon patterns', () => {
  const invalidCodons = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const codon = positioning.codon;

    if (!codon || codon.length !== 3 || !/^[AUCG]{3}$/.test(codon)) {
      invalidCodons.push(`Gate ${mapping.gateNumber}: "${codon}"`);
    }
  });

  if (invalidCodons.length > 0) {
    return `Invalid codons: ${invalidCodons[0]}`;
  }
  return true;
});

// Test 6: Trigrams exist and are valid
runTest('All gates have valid trigram data', () => {
  const invalidTrigrams = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const trigrams = positioning.trigrams;

    if (!trigrams || !trigrams.upper || !trigrams.lower) {
      invalidTrigrams.push(`Gate ${mapping.gateNumber}: Missing trigram data`);
    } else if (trigrams.upper.length !== 3 || trigrams.lower.length !== 3) {
      invalidTrigrams.push(`Gate ${mapping.gateNumber}: Invalid trigram length`);
    } else if (!trigrams.upperName || !trigrams.lowerName) {
      invalidTrigrams.push(`Gate ${mapping.gateNumber}: Missing trigram names`);
    }
  });

  if (invalidTrigrams.length > 0) {
    return `Invalid trigrams: ${invalidTrigrams[0]}`;
  }
  return true;
});

// Test 7: Wheel positions are valid
runTest('All gates have valid wheel positions (0-63)', () => {
  const invalidPositions = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const wheelIndex = positioning.positioning.wheelIndex;

    if (wheelIndex === null || wheelIndex === undefined || wheelIndex < 0 || wheelIndex > 63) {
      invalidPositions.push(`Gate ${mapping.gateNumber}: wheelIndex ${wheelIndex}`);
    }
  });

  if (invalidPositions.length > 0) {
    return `Invalid wheel positions: ${invalidPositions[0]}`;
  }
  return true;
});

// Test 8: Angles are valid (0-360)
runTest('All gates have valid angles (0-360 degrees)', () => {
  const invalidAngles = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const angle = positioning.positioning.angle;

    if (angle === null || angle === undefined || angle < 0 || angle >= 360) {
      invalidAngles.push(`Gate ${mapping.gateNumber}: angle ${angle}`);
    }
  });

  if (invalidAngles.length > 0) {
    return `Invalid angles: ${invalidAngles[0]}`;
  }
  return true;
});

// Test 9: Compass directions are valid
runTest('All gates have valid compass directions', () => {
  const validDirections = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
  const invalidDirections = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const direction = positioning.positioning.compassDirection;

    if (!validDirections.includes(direction)) {
      invalidDirections.push(`Gate ${mapping.gateNumber}: "${direction}"`);
    }
  });

  if (invalidDirections.length > 0) {
    return `Invalid compass directions: ${invalidDirections[0]}`;
  }
  return true;
});

// Test 10: Opposite gates are valid
runTest('All gates have valid opposite gates (1-64)', () => {
  const invalidOpposites = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const opposite = positioning.relationships.oppositeGate;

    if (!opposite || opposite < 1 || opposite > 64) {
      invalidOpposites.push(`Gate ${mapping.gateNumber}: opposite ${opposite}`);
    }
  });

  if (invalidOpposites.length > 0) {
    return `Invalid opposite gates: ${invalidOpposites[0]}`;
  }
  return true;
});

// Test 11: Opposite gate relationship is bidirectional
runTest('Opposite gate relationships are bidirectional', () => {
  const asymmetric = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const opposite = positioning.relationships.oppositeGate;

    // Get opposite's opposite
    const oppositePositioning = positioningAlgorithm.getGatePositioning(opposite);
    const oppositeOpposite = oppositePositioning.relationships.oppositeGate;

    if (oppositeOpposite !== mapping.gateNumber) {
      asymmetric.push(`Gate ${mapping.gateNumber} <-> ${opposite} (reverse: ${oppositeOpposite})`);
    }
  });

  if (asymmetric.length > 0) {
    return `Asymmetric relationships: ${asymmetric[0]}`;
  }
  return true;
});

// Test 12: Faces are valid
runTest('All gates have valid Face assignments', () => {
  const validFaces = [
    'Hades', 'Prometheus', 'Vishnu', 'Keepers of the Wheel',
    'Kali', 'Mitra', 'Michael', 'Janus',
    'Minerva', 'Christ', 'Harmonia', 'Thoth',
    'Maat', 'Parvati', 'Lakshmi', 'Maia'
  ];

  const invalidFaces = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const face = positioning.relationships.face;

    if (!validFaces.includes(face)) {
      invalidFaces.push(`Gate ${mapping.gateNumber}: "${face}"`);
    }
  });

  if (invalidFaces.length > 0) {
    return `Invalid faces: ${invalidFaces[0]}`;
  }
  return true;
});

// Test 13: Quarters are valid
runTest('All gates have valid Quarter assignments', () => {
  const validQuarters = ['Mutation', 'Initiation', 'Duality', 'Civilisation'];
  const invalidQuarters = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const quarter = positioning.relationships.quarter;

    if (!validQuarters.includes(quarter)) {
      invalidQuarters.push(`Gate ${mapping.gateNumber}: "${quarter}"`);
    }
  });

  if (invalidQuarters.length > 0) {
    return `Invalid quarters: ${invalidQuarters[0]}`;
  }
  return true;
});

// Test 14: Quarter distribution is balanced
runTest('Gates are reasonably distributed across quarters', () => {
  const quarterCounts = {
    'Mutation': 0,
    'Initiation': 0,
    'Duality': 0,
    'Civilisation': 0
  };

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const quarter = positioning.relationships.quarter;
    if (quarterCounts[quarter] !== undefined) {
      quarterCounts[quarter]++;
    }
  });

  // Each quarter should have exactly 16 gates
  const expected = 16;
  const imbalanced = [];

  Object.entries(quarterCounts).forEach(([quarter, count]) => {
    if (count !== expected) {
      imbalanced.push(`${quarter}: ${count} (expected ${expected})`);
    }
  });

  if (imbalanced.length > 0) {
    return `Imbalanced quarters: ${imbalanced.join(', ')}`;
  }
  return true;
});

// Test 15: Compass distribution is balanced
runTest('Gates are reasonably distributed across compass directions', () => {
  const directionCounts = {
    'NORTH': 0,
    'EAST': 0,
    'SOUTH': 0,
    'WEST': 0
  };

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const direction = positioning.positioning.compassDirection;
    if (directionCounts[direction] !== undefined) {
      directionCounts[direction]++;
    }
  });

  // Each direction should have exactly 16 gates
  const expected = 16;
  const imbalanced = [];

  Object.entries(directionCounts).forEach(([direction, count]) => {
    if (count !== expected) {
      imbalanced.push(`${direction}: ${count} (expected ${expected})`);
    }
  });

  if (imbalanced.length > 0) {
    return `Imbalanced compass: ${imbalanced.join(', ')}`;
  }
  return true;
});

// Test 16: Binary to codon conversion is consistent
runTest('Binary patterns correctly convert to codons', () => {
  const conversionErrors = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const binary = positioning.binary;
    const codon = positioning.codon;

    // Manually convert binary to codon
    const expectedCodon = canonicalMappings.binaryToCodon(binary);

    if (expectedCodon !== codon) {
      conversionErrors.push(`Gate ${mapping.gateNumber}: binary "${binary}" -> codon "${codon}" (expected "${expectedCodon}")`);
    }
  });

  if (conversionErrors.length > 0) {
    return `Conversion errors: ${conversionErrors[0]}`;
  }
  return true;
});

// Test 17: Enriched mappings contain all expected data
runTest('Enriched mappings contain all root system data', () => {
  const missingData = [];

  const requiredRootFields = [
    'binary', 'codon', 'trigrams', 'positioning', 'relationships'
  ];

  geneKeysMappings.mappings.forEach(mapping => {
    const enriched = positioningAlgorithm.enrichMapping(mapping);

    if (!enriched.rootSystemData) {
      missingData.push(`Gate ${mapping.gateNumber}: No rootSystemData`);
      return;
    }

    requiredRootFields.forEach(field => {
      if (!enriched.rootSystemData[field]) {
        missingData.push(`Gate ${mapping.gateNumber}: Missing ${field} in rootSystemData`);
      }
    });
  });

  if (missingData.length > 0) {
    return `Missing data: ${missingData[0]}`;
  }
  return true;
});

// Test 18: Enrichment preserves original mapping data
runTest('Enrichment preserves original Gene Keys data', () => {
  const dataLoss = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const enriched = positioningAlgorithm.enrichMapping(mapping);

    if (enriched.gateNumber !== mapping.gateNumber) {
      dataLoss.push(`Gate ${mapping.gateNumber}: gateNumber changed`);
    }

    if (JSON.stringify(enriched.knowledge) !== JSON.stringify(mapping.knowledge)) {
      dataLoss.push(`Gate ${mapping.gateNumber}: knowledge data changed`);
    }
  });

  if (dataLoss.length > 0) {
    return `Data loss: ${dataLoss[0]}`;
  }
  return true;
});

// Test 19: Trigram names match binary patterns
runTest('Trigram names correctly match binary patterns', () => {
  const trigramErrors = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const trigrams = positioning.trigrams;

    // Check upper trigram
    const expectedUpperName = canonicalMappings.binaryToTrigram(trigrams.upper);
    if (expectedUpperName !== trigrams.upperName) {
      trigramErrors.push(`Gate ${mapping.gateNumber}: upper trigram "${trigrams.upper}" -> "${trigrams.upperName}" (expected "${expectedUpperName}")`);
    }

    // Check lower trigram
    const expectedLowerName = canonicalMappings.binaryToTrigram(trigrams.lower);
    if (expectedLowerName !== trigrams.lowerName) {
      trigramErrors.push(`Gate ${mapping.gateNumber}: lower trigram "${trigrams.lower}" -> "${trigrams.lowerName}" (expected "${expectedLowerName}")`);
    }
  });

  if (trigramErrors.length > 0) {
    return `Trigram errors: ${trigramErrors[0]}`;
  }
  return true;
});

// Test 20: All 64 gates have unique positioning
runTest('All gates have unique wheel positions', () => {
  const positions = new Set();
  const duplicates = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const positioning = positioningAlgorithm.getGatePositioning(mapping.gateNumber);
    const wheelIndex = positioning.positioning.wheelIndex;

    if (positions.has(wheelIndex)) {
      duplicates.push(`Wheel position ${wheelIndex} is duplicated`);
    } else {
      positions.add(wheelIndex);
    }
  });

  if (duplicates.length > 0) {
    return `Duplicate positions: ${duplicates[0]}`;
  }

  if (positions.size !== 64) {
    return `Expected 64 unique positions, got ${positions.size}`;
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
  console.log('\n❌ ROOT INTEGRATION TESTS FAILED');
  console.log('\nErrors:');
  errors.forEach((err, index) => {
    console.log(`${index + 1}. ${err.test}: ${err.error}`);
  });
  process.exit(1);
} else {
  console.log('\n✅ ALL ROOT INTEGRATION TESTS PASSED');
  process.exit(0);
}
