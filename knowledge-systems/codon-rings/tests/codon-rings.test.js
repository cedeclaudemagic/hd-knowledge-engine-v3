#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Codon Rings Knowledge System
 * Validates all mappings, completeness, and cross-verification with root system
 */

const fs = require('fs');
const path = require('path');

// Load mappings
const mappingsPath = path.join(__dirname, '../mappings/codon-rings-mappings.json');
const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

// Test utilities
let testCount = 0;
let passCount = 0;
let failCount = 0;
const failures = [];

function test(name, testFn) {
  testCount++;
  try {
    const result = testFn();
    if (result === true || (result && result.success)) {
      passCount++;
      console.log(`✓ ${name}`);
      return true;
    } else {
      failCount++;
      const error = result && result.error ? result.error : 'Test returned false';
      console.log(`✗ ${name}: ${error}`);
      failures.push({ name, error });
      return false;
    }
  } catch (e) {
    failCount++;
    console.log(`✗ ${name}: ${e.message}`);
    failures.push({ name, error: e.message });
    return false;
  }
}

console.log('=== CODON RINGS KNOWLEDGE SYSTEM TEST SUITE ===\n');

// ============================================================================
// TEST 1: Structure and Metadata Tests
// ============================================================================
console.log('1. STRUCTURE AND METADATA TESTS');
console.log('='.repeat(70));

test('Mappings file exists and is valid JSON', () => {
  return mappings && typeof mappings === 'object';
});

test('System metadata is complete', () => {
  return mappings.systemName === 'Codon Rings' &&
    mappings.version === '1.0.0' &&
    mappings.description &&
    mappings.completeness === 'full';
});

test('Total rings metadata is correct (22 rings)', () => {
  return mappings.totalRings === 22;
});

test('Total gates metadata is correct (64 gates)', () => {
  return mappings.totalGates === 64;
});

test('Mappings array exists and is an array', () => {
  return Array.isArray(mappings.mappings);
});

test('Total mapping entries accounts for nested structures', () => {
  // Should be 64 gates + 1 extra for Gate 12 nested structure = 65 total
  const expectedMinEntries = 64; // At minimum all gates present
  if (mappings.mappings.length < expectedMinEntries) {
    return { success: false, error: `Only ${mappings.mappings.length} entries, expected at least ${expectedMinEntries}` };
  }
  return true;
});

// ============================================================================
// TEST 2: Completeness Tests
// ============================================================================
console.log('\n2. COMPLETENESS TESTS');
console.log('='.repeat(70));

test('All 64 gates are present in mappings', () => {
  const gateNumbers = new Set(mappings.mappings.map(m => m.gateNumber));
  if (gateNumbers.size !== 64) {
    return { success: false, error: `Only ${gateNumbers.size} gates found, expected 64` };
  }

  // Check all gates 1-64 are present
  for (let i = 1; i <= 64; i++) {
    if (!gateNumbers.has(i)) {
      return { success: false, error: `Gate ${i} is missing` };
    }
  }

  return true;
});

test('Gates in multiple rings are properly marked as nested', () => {
  const gateCounts = {};
  mappings.mappings.forEach(m => {
    gateCounts[m.gateNumber] = (gateCounts[m.gateNumber] || 0) + 1;
  });

  // Find gates that appear multiple times (nested structure)
  const nestedGates = Object.entries(gateCounts)
    .filter(([gate, count]) => count > 1)
    .map(([gate]) => parseInt(gate));

  // Verify each nested gate entry has the nestedStructure flag
  for (const gate of nestedGates) {
    const entries = mappings.mappings.filter(m => m.gateNumber === gate);
    for (const entry of entries) {
      if (!entry.knowledge.nestedStructure) {
        return {
          success: false,
          error: `Gate ${gate} appears ${entries.length} times but missing nestedStructure flag`
        };
      }
      if (!entry.knowledge.allRings || !Array.isArray(entry.knowledge.allRings)) {
        return {
          success: false,
          error: `Gate ${gate} missing allRings array in nested structure`
        };
      }
    }
  }

  return true;
});

test('All 22 rings are present', () => {
  const uniqueRings = new Set(mappings.mappings.map(m => m.knowledge.ring));
  if (uniqueRings.size !== 22) {
    return { success: false, error: `Only ${uniqueRings.size} rings found, expected 22` };
  }
  return true;
});

test('All ring names follow "Ring of X" pattern', () => {
  for (const mapping of mappings.mappings) {
    if (!mapping.knowledge.ring.startsWith('Ring of ')) {
      return { success: false, error: `Invalid ring name: ${mapping.knowledge.ring}` };
    }
  }
  return true;
});

// ============================================================================
// TEST 3: Data Integrity Tests
// ============================================================================
console.log('\n3. DATA INTEGRITY TESTS');
console.log('='.repeat(70));

test('Each gate has at least ONE ring assignment', () => {
  // Build gate-to-rings lookup
  const gateToRings = {};

  mappings.mappings.forEach(m => {
    if (!gateToRings[m.gateNumber]) {
      gateToRings[m.gateNumber] = [];
    }
    gateToRings[m.gateNumber].push(m.knowledge.ring);
  });

  // Check each gate has at least one ring
  for (let i = 1; i <= 64; i++) {
    if (!gateToRings[i] || gateToRings[i].length < 1) {
      return {
        success: false,
        error: `Gate ${i} has no ring assignments`
      };
    }
  }

  return true;
});

test('All mappings have required knowledge fields', () => {
  for (const mapping of mappings.mappings) {
    const k = mapping.knowledge;
    if (!k.ring || !k.aminoAcid || !k.codons || !k.ringGates || !k.biochemicalFunction) {
      return {
        success: false,
        error: `Gate ${mapping.gateNumber} missing required knowledge fields`
      };
    }
  }
  return true;
});

test('All amino acids are valid strings', () => {
  const validAminoAcids = new Set([
    'Lysine', 'Arginine', 'Proline', 'Histidine', 'Leucine',
    'Serine', 'Threonine', 'Asparagine', 'Glutamine', 'Glutamic_Acid',
    'Asparaginic_Acid', 'Alanine', 'Glysine', 'Valine', 'Terminators',
    'Tyrosine', 'Terminator', 'Cysteine', 'Tryptophan', 'Phenylalanine',
    'Methionine', 'Isoleucine'
  ]);

  for (const mapping of mappings.mappings) {
    if (!validAminoAcids.has(mapping.knowledge.aminoAcid)) {
      return {
        success: false,
        error: `Invalid amino acid: ${mapping.knowledge.aminoAcid} for gate ${mapping.gateNumber}`
      };
    }
  }
  return true;
});

test('All codon arrays are valid', () => {
  for (const mapping of mappings.mappings) {
    if (!Array.isArray(mapping.knowledge.codons) || mapping.knowledge.codons.length === 0) {
      return {
        success: false,
        error: `Gate ${mapping.gateNumber} has invalid codons array`
      };
    }

    // Check codon format (3 letters, valid nucleotides)
    for (const codon of mapping.knowledge.codons) {
      if (!/^[AUGC]{3}$/.test(codon)) {
        return {
          success: false,
          error: `Invalid codon format: ${codon} for gate ${mapping.gateNumber}`
        };
      }
    }
  }
  return true;
});

test('All ringGates arrays are valid', () => {
  for (const mapping of mappings.mappings) {
    const ringGates = mapping.knowledge.ringGates;

    if (!Array.isArray(ringGates) || ringGates.length === 0) {
      return {
        success: false,
        error: `Gate ${mapping.gateNumber} has invalid ringGates array`
      };
    }

    // Check gate is in its own ring
    if (!ringGates.includes(mapping.gateNumber)) {
      return {
        success: false,
        error: `Gate ${mapping.gateNumber} not in its own ringGates array`
      };
    }
  }
  return true;
});

test('lineNumber is null (gate-level mapping)', () => {
  for (const mapping of mappings.mappings) {
    if (mapping.lineNumber !== null) {
      return {
        success: false,
        error: `Gate ${mapping.gateNumber} has non-null lineNumber (should be gate-level)`
      };
    }
  }
  return true;
});

// ============================================================================
// TEST 4: Ring Grouping Tests
// ============================================================================
console.log('\n4. RING GROUPING TESTS');
console.log('='.repeat(70));

test('Ring groupings are consistent', () => {
  // Build ring-to-gates lookup
  const ringToGates = {};

  mappings.mappings.forEach(m => {
    const ring = m.knowledge.ring;
    if (!ringToGates[ring]) {
      ringToGates[ring] = new Set();
    }
    ringToGates[ring].add(m.gateNumber);
  });

  // Check each gate's ringGates matches its ring's gates
  for (const mapping of mappings.mappings) {
    const ring = mapping.knowledge.ring;
    const expectedGates = Array.from(ringToGates[ring]).sort((a, b) => a - b);
    const actualGates = [...mapping.knowledge.ringGates].sort((a, b) => a - b);

    if (JSON.stringify(expectedGates) !== JSON.stringify(actualGates)) {
      return {
        success: false,
        error: `Gate ${mapping.gateNumber} ringGates mismatch for ${ring}`
      };
    }
  }

  return true;
});

test('All rings have between 1 and 6 gates', () => {
  const ringToGates = {};

  mappings.mappings.forEach(m => {
    const ring = m.knowledge.ring;
    if (!ringToGates[ring]) {
      ringToGates[ring] = new Set();
    }
    ringToGates[ring].add(m.gateNumber);
  });

  for (const [ring, gates] of Object.entries(ringToGates)) {
    if (gates.size < 1 || gates.size > 6) {
      return {
        success: false,
        error: `${ring} has ${gates.size} gates (expected 1-6)`
      };
    }
  }

  return true;
});

test('Each ring has consistent amino acid', () => {
  const ringToAminoAcid = {};

  for (const mapping of mappings.mappings) {
    const ring = mapping.knowledge.ring;
    const aminoAcid = mapping.knowledge.aminoAcid;

    if (!ringToAminoAcid[ring]) {
      ringToAminoAcid[ring] = aminoAcid;
    } else if (ringToAminoAcid[ring] !== aminoAcid) {
      return {
        success: false,
        error: `${ring} has inconsistent amino acids`
      };
    }
  }

  return true;
});

// ============================================================================
// TEST 5: Codon Pattern Tests
// ============================================================================
console.log('\n5. CODON PATTERN TESTS');
console.log('='.repeat(70));

test('Total unique codons across all rings', () => {
  const allCodons = new Set();

  mappings.mappings.forEach(m => {
    m.knowledge.codons.forEach(codon => {
      allCodons.add(codon);
    });
  });

  // Should have 64 unique codons (61 amino acids + 3 stop codons)
  if (allCodons.size !== 64) {
    return {
      success: false,
      error: `Found ${allCodons.size} unique codons, expected 64`
    };
  }

  return true;
});

test('Each ring has consistent codon pattern', () => {
  const ringToCodons = {};

  for (const mapping of mappings.mappings) {
    const ring = mapping.knowledge.ring;
    const codons = mapping.knowledge.codons;

    if (!ringToCodons[ring]) {
      ringToCodons[ring] = codons;
    } else if (JSON.stringify(ringToCodons[ring].sort()) !== JSON.stringify(codons.sort())) {
      return {
        success: false,
        error: `${ring} has inconsistent codons`
      };
    }
  }

  return true;
});

// ============================================================================
// TEST 6: Specific Ring Tests
// ============================================================================
console.log('\n6. SPECIFIC RING TESTS');
console.log('='.repeat(70));

test('Ring of Fire (Lysine) contains gates 14 and 1', () => {
  const ringOfFireGates = mappings.mappings
    .filter(m => m.knowledge.ring === 'Ring of Fire')
    .map(m => m.gateNumber)
    .sort((a, b) => a - b);

  if (!ringOfFireGates.includes(1) || !ringOfFireGates.includes(14)) {
    return {
      success: false,
      error: `Ring of Fire gates: [${ringOfFireGates}], expected to include 1 and 14`
    };
  }

  return true;
});

test('Ring of Light (Threonine) contains gate 11', () => {
  const ringOfLightGates = mappings.mappings
    .filter(m => m.knowledge.ring === 'Ring of Light')
    .map(m => m.gateNumber);

  if (!ringOfLightGates.includes(11)) {
    return {
      success: false,
      error: `Ring of Light doesn't contain gate 11`
    };
  }

  return true;
});

test('Ring of Origin (Methionine) contains only gate 41', () => {
  const ringOfOriginGates = mappings.mappings
    .filter(m => m.knowledge.ring === 'Ring of Origin')
    .map(m => m.gateNumber);

  if (ringOfOriginGates.length !== 1 || ringOfOriginGates[0] !== 41) {
    return {
      success: false,
      error: `Ring of Origin gates: [${ringOfOriginGates}], expected [41]`
    };
  }

  return true;
});

// ============================================================================
// TEST 7: Nested Structure Tests
// ============================================================================
console.log('\n7. NESTED STRUCTURE TESTS');
console.log('='.repeat(70));

test('Gate 12 appears in both Ring of Trials and Ring of Secrets', () => {
  const gate12Entries = mappings.mappings.filter(m => m.gateNumber === 12);

  if (gate12Entries.length !== 2) {
    return {
      success: false,
      error: `Gate 12 has ${gate12Entries.length} entries, expected 2`
    };
  }

  const rings = gate12Entries.map(e => e.knowledge.ring).sort();
  const expectedRings = ['Ring of Secrets', 'Ring of Trials'];

  if (JSON.stringify(rings) !== JSON.stringify(expectedRings)) {
    return {
      success: false,
      error: `Gate 12 rings: [${rings}], expected [${expectedRings}]`
    };
  }

  return true;
});

test('Gate 12 entries have nestedStructure metadata', () => {
  const gate12Entries = mappings.mappings.filter(m => m.gateNumber === 12);

  for (const entry of gate12Entries) {
    if (!entry.knowledge.nestedStructure) {
      return {
        success: false,
        error: `Gate 12 (${entry.knowledge.ring}) missing nestedStructure flag`
      };
    }
    if (entry.knowledge.totalRings !== 2) {
      return {
        success: false,
        error: `Gate 12 totalRings is ${entry.knowledge.totalRings}, expected 2`
      };
    }
    if (!entry.knowledge.allRings || entry.knowledge.allRings.length !== 2) {
      return {
        success: false,
        error: `Gate 12 allRings array invalid`
      };
    }
  }

  return true;
});

test('Ring of Trials contains all three stop codon gates', () => {
  const trialsEntry = mappings.mappings.find(
    m => m.knowledge.ring === 'Ring of Trials' && m.gateNumber === 12
  );

  if (!trialsEntry) {
    return {
      success: false,
      error: 'Ring of Trials entry for Gate 12 not found'
    };
  }

  const expectedGates = [12, 33, 56].sort();
  const actualGates = [...trialsEntry.knowledge.ringGates].sort();

  if (JSON.stringify(expectedGates) !== JSON.stringify(actualGates)) {
    return {
      success: false,
      error: `Ring of Trials gates: [${actualGates}], expected [${expectedGates}]`
    };
  }

  return true;
});

test('Ring of Secrets contains only gate 12 (UGA stop codon)', () => {
  const secretsEntry = mappings.mappings.find(
    m => m.knowledge.ring === 'Ring of Secrets' && m.gateNumber === 12
  );

  if (!secretsEntry) {
    return {
      success: false,
      error: 'Ring of Secrets entry for Gate 12 not found'
    };
  }

  if (secretsEntry.knowledge.ringGates.length !== 1 || secretsEntry.knowledge.ringGates[0] !== 12) {
    return {
      success: false,
      error: `Ring of Secrets gates: [${secretsEntry.knowledge.ringGates}], expected [12]`
    };
  }

  if (secretsEntry.knowledge.codons.length !== 1 || secretsEntry.knowledge.codons[0] !== 'UGA') {
    return {
      success: false,
      error: `Ring of Secrets codon: ${secretsEntry.knowledge.codons}, expected ['UGA']`
    };
  }

  return true;
});

// ============================================================================
// Summary
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('TEST SUMMARY');
console.log('='.repeat(70));
console.log(`Total Tests: ${testCount}`);
console.log(`Passed: ${passCount} ✓`);
console.log(`Failed: ${failCount} ✗`);

if (failCount > 0) {
  console.log('\nFailed Tests:');
  failures.forEach(f => {
    console.log(`  ✗ ${f.name}`);
    console.log(`    ${f.error}`);
  });
}

console.log('\n' + '='.repeat(70));

if (failCount === 0) {
  console.log('✅ ALL TESTS PASSED - Codon Rings Knowledge System is valid!');
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED - Please review and fix');
  process.exit(1);
}
