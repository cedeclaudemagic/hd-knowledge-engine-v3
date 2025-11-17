/**
 * Data Integrity Test Suite for Gene Keys
 *
 * Validates data quality, consistency, and semantic correctness
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
console.log('  DATA INTEGRITY TEST SUITE');
console.log('════════════════════════════════════════════════════════\n');

// Test 1: All shadow values are unique (no duplicates)
runTest('All shadow values are unique', () => {
  const shadows = geneKeysMappings.mappings.map(m => m.knowledge.shadow);
  const uniqueShadows = new Set(shadows);
  if (shadows.length !== uniqueShadows.size) {
    const duplicates = shadows.filter((shadow, index) =>
      shadows.indexOf(shadow) !== index
    );
    return `Found duplicate shadows: ${[...new Set(duplicates)].join(', ')}`;
  }
  return true;
});

// Test 2: All gift values are unique (no duplicates)
runTest('All gift values are unique', () => {
  const gifts = geneKeysMappings.mappings.map(m => m.knowledge.gift);
  const uniqueGifts = new Set(gifts);
  if (gifts.length !== uniqueGifts.size) {
    const duplicates = gifts.filter((gift, index) =>
      gifts.indexOf(gift) !== index
    );
    return `Found duplicate gifts: ${[...new Set(duplicates)].join(', ')}`;
  }
  return true;
});

// Test 3: All siddhi values are unique (no duplicates except known cases)
runTest('All siddhi values are unique (except Freedom 55)', () => {
  const siddhis = geneKeysMappings.mappings.map(m => m.knowledge.siddhi);
  const uniqueSiddhis = new Set(siddhis);

  // Gate 55 is known to have "Freedom" for both gift and siddhi
  const expectedDuplicates = ['Freedom'];
  const actualDuplicates = siddhis.filter((siddhi, index) =>
    siddhis.indexOf(siddhi) !== index && !expectedDuplicates.includes(siddhi)
  );

  if (actualDuplicates.length > 0) {
    return `Found unexpected duplicate siddhis: ${[...new Set(actualDuplicates)].join(', ')}`;
  }
  return true;
});

// Test 4: Shadow/Gift/Siddhi are different for each gate
runTest('Shadow/Gift/Siddhi are distinct for each gate', () => {
  const conflicts = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const { shadow, gift, siddhi } = mapping.knowledge;

    if (shadow === gift) {
      conflicts.push(`Gate ${mapping.gateNumber}: Shadow "${shadow}" equals Gift`);
    }
    if (shadow === siddhi) {
      conflicts.push(`Gate ${mapping.gateNumber}: Shadow "${shadow}" equals Siddhi`);
    }
    if (gift === siddhi && mapping.gateNumber !== 55) {
      // Gate 55 is allowed to have Gift = Siddhi = "Freedom"
      conflicts.push(`Gate ${mapping.gateNumber}: Gift "${gift}" equals Siddhi`);
    }
  });

  if (conflicts.length > 0) {
    return `Found ${conflicts.length} conflicts: ${conflicts[0]}`;
  }
  return true;
});

// Test 5: Introverted/Extroverted are different for each gate
runTest('Introverted and extroverted frequencies are distinct', () => {
  const conflicts = geneKeysMappings.mappings.filter(m =>
    m.knowledge.introverted === m.knowledge.extroverted
  );

  if (conflicts.length > 0) {
    return `Found ${conflicts.length} gates with identical frequencies: Gate ${conflicts[0].gateNumber}`;
  }
  return true;
});

// Test 6: No empty or whitespace-only values
runTest('No empty or whitespace-only values in knowledge', () => {
  const invalidEntries = [];

  geneKeysMappings.mappings.forEach(mapping => {
    Object.entries(mapping.knowledge).forEach(([key, value]) => {
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        invalidEntries.push(`Gate ${mapping.gateNumber}: ${key} is empty`);
      }
    });
  });

  if (invalidEntries.length > 0) {
    return `Found ${invalidEntries.length} empty values: ${invalidEntries[0]}`;
  }
  return true;
});

// Test 7: Proper capitalization (first letter capitalized)
runTest('All shadow values are properly capitalized', () => {
  const improperCaps = geneKeysMappings.mappings.filter(m => {
    const shadow = m.knowledge.shadow;
    return shadow && shadow[0] !== shadow[0].toUpperCase();
  });

  if (improperCaps.length > 0) {
    return `Found ${improperCaps.length} improperly capitalized shadows`;
  }
  return true;
});

// Test 8: No special characters in core fields (except hyphens and spaces)
runTest('No invalid special characters in knowledge fields', () => {
  const invalidChars = [];
  const validPattern = /^[A-Za-z0-9\s\-']+$/;

  geneKeysMappings.mappings.forEach(mapping => {
    ['shadow', 'gift', 'siddhi'].forEach(field => {
      const value = mapping.knowledge[field];
      if (value && !validPattern.test(value)) {
        invalidChars.push(`Gate ${mapping.gateNumber}: ${field} "${value}" contains invalid characters`);
      }
    });
  });

  if (invalidChars.length > 0) {
    return `Found invalid characters: ${invalidChars[0]}`;
  }
  return true;
});

// Test 9: Reasonable string lengths (shadows/gifts/siddhis)
runTest('All knowledge values have reasonable lengths', () => {
  const tooLong = [];
  const maxLength = 50;

  geneKeysMappings.mappings.forEach(mapping => {
    ['shadow', 'gift', 'siddhi', 'introverted', 'extroverted'].forEach(field => {
      const value = mapping.knowledge[field];
      if (value && value.length > maxLength) {
        tooLong.push(`Gate ${mapping.gateNumber}: ${field} is ${value.length} chars`);
      }
    });
  });

  if (tooLong.length > 0) {
    return `Found ${tooLong.length} values that are too long: ${tooLong[0]}`;
  }
  return true;
});

// Test 10: No leading/trailing whitespace
runTest('No leading or trailing whitespace in values', () => {
  const whitespaceIssues = [];

  geneKeysMappings.mappings.forEach(mapping => {
    Object.entries(mapping.knowledge).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        if (value !== value.trim()) {
          whitespaceIssues.push(`Gate ${mapping.gateNumber}: ${key} has whitespace`);
        }
      }
    });
  });

  if (whitespaceIssues.length > 0) {
    return `Found ${whitespaceIssues.length} whitespace issues: ${whitespaceIssues[0]}`;
  }
  return true;
});

// Test 11: Consistent casing within values
runTest('No all-caps or all-lowercase values (except abbreviations)', () => {
  const casingIssues = [];

  geneKeysMappings.mappings.forEach(mapping => {
    ['shadow', 'gift', 'siddhi'].forEach(field => {
      const value = mapping.knowledge[field];
      if (value && value.length > 3) {
        if (value === value.toUpperCase() || value === value.toLowerCase()) {
          casingIssues.push(`Gate ${mapping.gateNumber}: ${field} "${value}" has unusual casing`);
        }
      }
    });
  });

  if (casingIssues.length > 0) {
    return `Found casing issues: ${casingIssues[0]}`;
  }
  return true;
});

// Test 12: Valid frequency patterns (known patterns only)
runTest('Frequency patterns use valid descriptors', () => {
  const knownPatterns = new Set();

  // Collect all frequency patterns
  geneKeysMappings.mappings.forEach(m => {
    knownPatterns.add(m.knowledge.introverted);
    knownPatterns.add(m.knowledge.extroverted);
  });

  // Should have reasonable variety (not all the same)
  if (knownPatterns.size < 20) {
    return `Only ${knownPatterns.size} unique frequency patterns found (expected more variety)`;
  }

  return true;
});

// Test 13: Each mapping JSON is properly structured
runTest('Each mapping has exactly required fields', () => {
  const requiredFields = ['gateNumber', 'lineNumber', 'knowledge'];
  const knowledgeFields = ['shadow', 'gift', 'siddhi', 'introverted', 'extroverted'];
  const structureIssues = [];

  geneKeysMappings.mappings.forEach((mapping, index) => {
    // Check top-level fields
    const topFields = Object.keys(mapping);
    requiredFields.forEach(field => {
      if (!topFields.includes(field)) {
        structureIssues.push(`Mapping ${index}: Missing field "${field}"`);
      }
    });

    // Check knowledge fields
    if (mapping.knowledge) {
      const kFields = Object.keys(mapping.knowledge);
      knowledgeFields.forEach(field => {
        if (!kFields.includes(field)) {
          structureIssues.push(`Gate ${mapping.gateNumber}: Missing knowledge field "${field}"`);
        }
      });
    }
  });

  if (structureIssues.length > 0) {
    return `Found ${structureIssues.length} structure issues: ${structureIssues[0]}`;
  }
  return true;
});

// Test 14: No null or undefined in knowledge values
runTest('No null or undefined values in knowledge fields', () => {
  const nullValues = [];

  geneKeysMappings.mappings.forEach(mapping => {
    Object.entries(mapping.knowledge).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        nullValues.push(`Gate ${mapping.gateNumber}: ${key} is null/undefined`);
      }
    });
  });

  if (nullValues.length > 0) {
    return `Found ${nullValues.length} null values: ${nullValues[0]}`;
  }
  return true;
});

// Test 15: Mappings are in sequential gate number order
runTest('Mappings are in sequential gate number order', () => {
  for (let i = 0; i < geneKeysMappings.mappings.length; i++) {
    if (geneKeysMappings.mappings[i].gateNumber !== i + 1) {
      return `Gate at index ${i} has number ${geneKeysMappings.mappings[i].gateNumber} (expected ${i + 1})`;
    }
  }
  return true;
});

// Test 16: No duplicate knowledge values across different fields
runTest('No shadow appears as gift or siddhi in another gate', () => {
  const shadows = new Set(geneKeysMappings.mappings.map(m => m.knowledge.shadow));
  const gifts = geneKeysMappings.mappings.map(m => m.knowledge.gift);
  const siddhis = geneKeysMappings.mappings.map(m => m.knowledge.siddhi);

  const shadowAsGift = gifts.filter(g => shadows.has(g));
  const shadowAsSiddhi = siddhis.filter(s => shadows.has(s));

  if (shadowAsGift.length > 0) {
    return `Found shadows appearing as gifts: ${shadowAsGift[0]}`;
  }

  if (shadowAsSiddhi.length > 0) {
    return `Found shadows appearing as siddhis: ${shadowAsSiddhi[0]}`;
  }

  return true;
});

// Test 17: Semantic validation - shadows are typically negative
runTest('Shadow keywords suggest lower frequency', () => {
  const positiveKeywords = [
    'love', 'joy', 'peace', 'harmony', 'light', 'beauty',
    'wisdom', 'grace', 'truth', 'freedom', 'unity'
  ];

  const suspiciousShadows = [];

  geneKeysMappings.mappings.forEach(mapping => {
    const shadow = mapping.knowledge.shadow.toLowerCase();
    positiveKeywords.forEach(keyword => {
      if (shadow.includes(keyword)) {
        suspiciousShadows.push(`Gate ${mapping.gateNumber}: Shadow "${mapping.knowledge.shadow}" contains positive keyword`);
      }
    });
  });

  if (suspiciousShadows.length > 2) {
    // Allow a few edge cases
    return `Found ${suspiciousShadows.length} suspiciously positive shadows`;
  }

  return true;
});

// Test 18: Semantic validation - siddhis are typically transcendent
runTest('Siddhi keywords suggest high frequency', () => {
  const transcendentKeywords = [
    'light', 'love', 'truth', 'beauty', 'peace', 'unity', 'wisdom',
    'grace', 'perfection', 'compassion', 'freedom', 'clarity', 'harmony',
    'illumination', 'sanctity', 'bliss', 'awakening', 'stillness', 'transparency',
    'justice', 'innocence', 'majesty', 'honour', 'humility', 'empathy', 'tenderness'
  ];

  let transcendentCount = 0;

  geneKeysMappings.mappings.forEach(mapping => {
    const siddhi = mapping.knowledge.siddhi.toLowerCase();
    transcendentKeywords.forEach(keyword => {
      if (siddhi.includes(keyword)) {
        transcendentCount++;
      }
    });
  });

  // At least 10% of siddhis should have transcendent keywords (lenient check)
  if (transcendentCount < 6) {
    return `Only ${transcendentCount}/64 siddhis have recognizable transcendent keywords`;
  }

  return true;
});

// Test 19: Verify specific known Gene Keys values
runTest('Specific known Gene Keys are correct', () => {
  const knownGates = [
    { gate: 1, shadow: 'Entropy', gift: 'Freshness', siddhi: 'Beauty' },
    { gate: 2, shadow: 'Dislocation', gift: 'Orientation', siddhi: 'Unity' },
    { gate: 21, shadow: 'Control', gift: 'Authority', siddhi: 'Valour' },
    { gate: 64, shadow: 'Confusion', gift: 'Imagination', siddhi: 'Illumination' }
  ];

  const mismatches = [];

  knownGates.forEach(known => {
    const mapping = geneKeysMappings.mappings.find(m => m.gateNumber === known.gate);
    if (!mapping) {
      mismatches.push(`Gate ${known.gate} not found`);
      return;
    }

    if (mapping.knowledge.shadow !== known.shadow) {
      mismatches.push(`Gate ${known.gate}: Shadow should be "${known.shadow}", got "${mapping.knowledge.shadow}"`);
    }
    if (mapping.knowledge.gift !== known.gift) {
      mismatches.push(`Gate ${known.gate}: Gift should be "${known.gift}", got "${mapping.knowledge.gift}"`);
    }
    if (mapping.knowledge.siddhi !== known.siddhi) {
      mismatches.push(`Gate ${known.gate}: Siddhi should be "${known.siddhi}", got "${mapping.knowledge.siddhi}"`);
    }
  });

  if (mismatches.length > 0) {
    return `Found mismatches: ${mismatches[0]}`;
  }

  return true;
});

// Test 20: All gates can be enriched with root system data
runTest('All gates successfully enrich with root system data', () => {
  const enrichmentFailures = [];

  geneKeysMappings.mappings.forEach(mapping => {
    try {
      const enriched = positioningAlgorithm.enrichMapping(mapping);

      if (!enriched.rootSystemData) {
        enrichmentFailures.push(`Gate ${mapping.gateNumber}: Missing rootSystemData`);
      }
      if (!enriched.rootSystemData.binary) {
        enrichmentFailures.push(`Gate ${mapping.gateNumber}: Missing binary in rootSystemData`);
      }
      if (!enriched.rootSystemData.positioning) {
        enrichmentFailures.push(`Gate ${mapping.gateNumber}: Missing positioning in rootSystemData`);
      }
    } catch (error) {
      enrichmentFailures.push(`Gate ${mapping.gateNumber}: ${error.message}`);
    }
  });

  if (enrichmentFailures.length > 0) {
    return `${enrichmentFailures.length} enrichment failures: ${enrichmentFailures[0]}`;
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
  console.log('\n❌ DATA INTEGRITY TESTS FAILED');
  console.log('\nErrors:');
  errors.forEach((err, index) => {
    console.log(`${index + 1}. ${err.test}: ${err.error}`);
  });
  process.exit(1);
} else {
  console.log('\n✅ ALL DATA INTEGRITY TESTS PASSED');
  process.exit(0);
}
