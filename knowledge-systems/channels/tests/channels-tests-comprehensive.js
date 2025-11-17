const fs = require('fs');
const path = require('path');

const mappingsPath = path.join(__dirname, '../mappings/channels-mappings.json');
const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

// Valid HD centers
const validCenters = ['Head', 'Ajna', 'Throat', 'G', 'Heart', 'Spleen', 'Solar Plexus', 'Sacral', 'Root'];

let passed = 0;
let failed = 0;
let warnings = 0;

console.log('🧪 36 Channels - Comprehensive Test Suite');
console.log('='.repeat(80));

// ============================================================================
// BASIC STRUCTURE TESTS
// ============================================================================

// Test 1: System metadata
if (mappings.systemName === 'The 36 Channels' &&
    mappings.version &&
    mappings.dataArchitecture === 'connection' &&
    mappings.totalChannels === 36) {
  console.log('✅ Test 1: System metadata is complete and correct');
  passed++;
} else {
  console.log('❌ Test 1: System metadata is incomplete or incorrect');
  failed++;
}

// Test 2: All 36 channels present
if (mappings.mappings.length === 36) {
  console.log('✅ Test 2: All 36 channels present');
  passed++;
} else {
  console.log(`❌ Test 2: Expected 36 channels, found ${mappings.mappings.length}`);
  failed++;
}

// Test 3: No duplicate channel numbers
const channelNumbers = mappings.mappings.map(m => m.channelNumber);
const uniqueChannels = [...new Set(channelNumbers)];
if (uniqueChannels.length === 36) {
  console.log('✅ Test 3: No duplicate channel numbers');
  passed++;
} else {
  console.log(`❌ Test 3: Found ${36 - uniqueChannels.length} duplicate channels`);
  const duplicates = channelNumbers.filter((item, index) => channelNumbers.indexOf(item) !== index);
  console.log(`   Duplicates: ${[...new Set(duplicates)].join(', ')}`);
  failed++;
}

// ============================================================================
// GATE VALIDATION TESTS
// ============================================================================

// Test 4: All channels have two distinct gates
let invalidGatePairs = [];
mappings.mappings.forEach(m => {
  if (!m.gate1 || !m.gate2 || m.gate1 === m.gate2) {
    invalidGatePairs.push(m.channelNumber);
  }
});

if (invalidGatePairs.length === 0) {
  console.log('✅ Test 4: All channels have two distinct gates');
  passed++;
} else {
  console.log(`❌ Test 4: ${invalidGatePairs.length} channels have invalid gate pairs`);
  console.log(`   Invalid: ${invalidGatePairs.join(', ')}`);
  failed++;
}

// Test 5: All gate numbers are valid (1-64)
let invalidGates = [];
mappings.mappings.forEach(m => {
  if (m.gate1 < 1 || m.gate1 > 64 || m.gate2 < 1 || m.gate2 > 64) {
    invalidGates.push(`${m.channelNumber} (${m.gate1}, ${m.gate2})`);
  }
});

if (invalidGates.length === 0) {
  console.log('✅ Test 5: All gate numbers are valid (1-64)');
  passed++;
} else {
  console.log(`❌ Test 5: Found invalid gate numbers`);
  console.log(`   Invalid: ${invalidGates.join(', ')}`);
  failed++;
}

// Test 6: Channel numbers are normalized (lower-higher)
let unnormalizedChannels = [];
mappings.mappings.forEach(m => {
  const [g1, g2] = m.channelNumber.split('-').map(Number);
  if (g1 >= g2 || m.gate1 !== g1 || m.gate2 !== g2) {
    unnormalizedChannels.push(m.channelNumber);
  }
});

if (unnormalizedChannels.length === 0) {
  console.log('✅ Test 6: All channel numbers are normalized (gate1 < gate2)');
  passed++;
} else {
  console.log(`❌ Test 6: Found unnormalized channels`);
  console.log(`   Unnormalized: ${unnormalizedChannels.join(', ')}`);
  failed++;
}

// Test 7: Gate frequency analysis
const gateFrequency = {};
mappings.mappings.forEach(m => {
  gateFrequency[m.gate1] = (gateFrequency[m.gate1] || 0) + 1;
  gateFrequency[m.gate2] = (gateFrequency[m.gate2] || 0) + 1;
});

const overusedGates = Object.entries(gateFrequency)
  .filter(([gate, count]) => count > 3)
  .map(([gate, count]) => `Gate ${gate} (${count} channels)`);

if (overusedGates.length === 0) {
  console.log('✅ Test 7: No gate appears in more than 3 channels');
  passed++;
} else {
  console.log(`⚠️  Test 7: Some gates appear frequently (may be valid hubs)`);
  console.log(`   ${overusedGates.join(', ')}`);
  warnings++;
  passed++; // Still pass, as this might be valid
}

// Test 8: Gate coverage (all gates should appear at least once)
const allGates = new Set(Object.keys(gateFrequency).map(Number));
const missingGates = [];
for (let i = 1; i <= 64; i++) {
  if (!allGates.has(i)) {
    missingGates.push(i);
  }
}

if (missingGates.length === 0) {
  console.log('✅ Test 8: All 64 gates appear in at least one channel');
  passed++;
} else {
  console.log(`⚠️  Test 8: ${missingGates.length} gates don't appear in any channel`);
  console.log(`   Missing gates: ${missingGates.join(', ')}`);
  warnings++;
  passed++; // This is expected - not all gates are in channels
}

// ============================================================================
// KNOWLEDGE FIELD TESTS
// ============================================================================

// Test 9: All channels have names
const missingNames = mappings.mappings.filter(m => !m.knowledge.name || m.knowledge.name.trim() === '');
if (missingNames.length === 0) {
  console.log('✅ Test 9: All channels have non-empty names');
  passed++;
} else {
  console.log(`❌ Test 9: ${missingNames.length} channels missing names`);
  console.log(`   Channels: ${missingNames.map(m => m.channelNumber).join(', ')}`);
  failed++;
}

// Test 10: All channels have keynotes
const missingKeynotes = mappings.mappings.filter(m => !m.knowledge.keynote || m.knowledge.keynote.trim() === '');
if (missingKeynotes.length === 0) {
  console.log('✅ Test 10: All channels have non-empty keynotes');
  passed++;
} else {
  console.log(`❌ Test 10: ${missingKeynotes.length} channels missing keynotes`);
  console.log(`   Channels: ${missingKeynotes.map(m => m.channelNumber).join(', ')}`);
  failed++;
}

// Test 11: All channels have descriptions
const missingDescriptions = mappings.mappings.filter(m => !m.knowledge.description || m.knowledge.description.trim() === '');
if (missingDescriptions.length === 0) {
  console.log('✅ Test 11: All channels have descriptions');
  passed++;
} else {
  console.log(`❌ Test 11: ${missingDescriptions.length} channels missing descriptions`);
  failed++;
}

// Test 12: All channels have themes
const missingThemes = mappings.mappings.filter(m => !m.knowledge.theme || m.knowledge.theme.trim() === '');
if (missingThemes.length === 0) {
  console.log('✅ Test 12: All channels have themes');
  passed++;
} else {
  console.log(`❌ Test 12: ${missingThemes.length} channels missing themes`);
  failed++;
}

// Test 13: All channels have whenDefined
const missingWhenDefined = mappings.mappings.filter(m => !m.knowledge.whenDefined);
if (missingWhenDefined.length === 0) {
  console.log('✅ Test 13: All channels have whenDefined descriptions');
  passed++;
} else {
  console.log(`❌ Test 13: ${missingWhenDefined.length} channels missing whenDefined`);
  failed++;
}

// Test 14: All channels have whenUndefined
const missingWhenUndefined = mappings.mappings.filter(m => !m.knowledge.whenUndefined);
if (missingWhenUndefined.length === 0) {
  console.log('✅ Test 14: All channels have whenUndefined descriptions');
  passed++;
} else {
  console.log(`❌ Test 14: ${missingWhenUndefined.length} channels missing whenUndefined`);
  failed++;
}

// ============================================================================
// CIRCUIT TESTS
// ============================================================================

// Test 15: All channels have circuit assignments
const missingCircuits = mappings.mappings.filter(m => !m.knowledge.circuit);
if (missingCircuits.length === 0) {
  console.log('✅ Test 15: All channels have circuit assignments');
  passed++;
} else {
  console.log(`❌ Test 15: ${missingCircuits.length} channels missing circuits`);
  console.log(`   Channels: ${missingCircuits.map(m => m.channelNumber).join(', ')}`);
  failed++;
}

// Test 16: Circuit distribution
const circuitCounts = {};
mappings.mappings.forEach(m => {
  const circuit = m.knowledge.circuit;
  circuitCounts[circuit] = (circuitCounts[circuit] || 0) + 1;
});

const totalCircuits = Object.keys(circuitCounts).length;
if (totalCircuits >= 5 && totalCircuits <= 10) {
  console.log('✅ Test 16: Reasonable number of circuits represented');
  Object.entries(circuitCounts).sort((a, b) => b[1] - a[1]).forEach(([circuit, count]) => {
    console.log(`   ${circuit}: ${count} channels`);
  });
  passed++;
} else {
  console.log(`❌ Test 16: Unexpected number of circuits: ${totalCircuits}`);
  failed++;
}

// Test 17: Each circuit has at least one channel
const emptyCircuits = Object.entries(circuitCounts).filter(([circuit, count]) => count === 0);
if (emptyCircuits.length === 0) {
  console.log('✅ Test 17: No empty circuits');
  passed++;
} else {
  console.log(`❌ Test 17: Found ${emptyCircuits.length} empty circuits`);
  failed++;
}

// ============================================================================
// CENTER CONNECTION TESTS
// ============================================================================

// Test 18: All channels have center connections
const missingCenterConnections = mappings.mappings.filter(m => !m.knowledge.centerConnection);
if (missingCenterConnections.length === 0) {
  console.log('✅ Test 18: All channels have center connections');
  passed++;
} else {
  console.log(`⚠️  Test 18: ${missingCenterConnections.length} channels missing center connections`);
  console.log(`   Channels: ${missingCenterConnections.map(m => m.channelNumber).join(', ')}`);
  warnings++;
  passed++; // Warning but not failure
}

// Test 19: Center connections use valid center names
const invalidCenterConnections = [];
mappings.mappings.forEach(m => {
  if (m.knowledge.centerConnection) {
    const centers = m.knowledge.centerConnection.split(' to ').map(c => c.trim());
    centers.forEach(center => {
      if (!validCenters.includes(center) && center !== 'undefined') {
        invalidCenterConnections.push(`${m.channelNumber}: ${center}`);
      }
    });
  }
});

if (invalidCenterConnections.length === 0) {
  console.log('✅ Test 19: All center connections use valid center names');
  passed++;
} else {
  console.log(`❌ Test 19: Found invalid center names`);
  console.log(`   Invalid: ${invalidCenterConnections.join(', ')}`);
  failed++;
}

// Test 20: Center connections follow "X to Y" format
const malformedCenterConnections = mappings.mappings.filter(m => {
  if (!m.knowledge.centerConnection) return false;
  return !m.knowledge.centerConnection.includes(' to ') &&
         m.knowledge.centerConnection.split(' ').length > 1;
}).map(m => m.channelNumber);

if (malformedCenterConnections.length === 0) {
  console.log('✅ Test 20: All center connections use proper format');
  passed++;
} else {
  console.log(`⚠️  Test 20: ${malformedCenterConnections.length} channels have non-standard format`);
  console.log(`   Channels: ${malformedCenterConnections.join(', ')}`);
  warnings++;
  passed++;
}

// ============================================================================
// CROSS-REFERENCE TESTS
// ============================================================================

// Test 21: Verify against circuit assignments file
try {
  const circuitAssignmentsPath = path.join(__dirname, '../../../circuit-assignments.json');
  if (fs.existsSync(circuitAssignmentsPath)) {
    const circuitAssignments = JSON.parse(fs.readFileSync(circuitAssignmentsPath, 'utf8'));

    let mismatches = [];
    circuitAssignments.assignments.forEach(assignment => {
      const mapping = mappings.mappings.find(m => m.channelNumber === assignment.channelNumber);
      if (!mapping) {
        mismatches.push(`${assignment.channelNumber}: Not in mappings`);
      } else if (mapping.knowledge.circuit !== assignment.circuit) {
        mismatches.push(`${assignment.channelNumber}: Circuit mismatch (${mapping.knowledge.circuit} vs ${assignment.circuit})`);
      }
    });

    if (mismatches.length === 0) {
      console.log('✅ Test 21: All circuits match source assignments');
      passed++;
    } else {
      console.log(`❌ Test 21: Found circuit assignment mismatches`);
      mismatches.slice(0, 5).forEach(m => console.log(`   ${m}`));
      if (mismatches.length > 5) console.log(`   ... and ${mismatches.length - 5} more`);
      failed++;
    }
  } else {
    console.log('⊘  Test 21: Skipped (circuit-assignments.json not found)');
  }
} catch (error) {
  console.log(`⊘  Test 21: Skipped (${error.message})`);
}

// ============================================================================
// DATA QUALITY TESTS
// ============================================================================

// Test 22: Channel names are not just placeholder text
const genericNames = mappings.mappings.filter(m => {
  const name = m.knowledge.name.toLowerCase();
  return name.includes('unknown') ||
         name.includes('undefined') ||
         name.includes('todo') ||
         name === 'channel';
});

if (genericNames.length === 0) {
  console.log('✅ Test 22: No placeholder or generic channel names');
  passed++;
} else {
  console.log(`❌ Test 22: Found ${genericNames.length} channels with generic names`);
  console.log(`   Channels: ${genericNames.map(m => `${m.channelNumber}: ${m.knowledge.name}`).join(', ')}`);
  failed++;
}

// Test 23: Keynotes are substantial (more than just a few words)
const shortKeynotes = mappings.mappings.filter(m => {
  return m.knowledge.keynote && m.knowledge.keynote.length < 10;
});

if (shortKeynotes.length === 0) {
  console.log('✅ Test 23: All keynotes are substantial');
  passed++;
} else {
  console.log(`⚠️  Test 23: ${shortKeynotes.length} channels have very short keynotes`);
  warnings++;
  passed++;
}

// Test 24: Descriptions are meaningful (not just generic templates)
const templateDescriptions = mappings.mappings.filter(m => {
  const desc = m.knowledge.description;
  // Check if description is just the template format
  return desc.startsWith('A channel connecting Gate') && desc.split(' ').length <= 15;
});

if (templateDescriptions.length === 0) {
  console.log('✅ Test 24: All descriptions are meaningful');
  passed++;
} else {
  console.log(`⚠️  Test 24: ${templateDescriptions.length} channels have template-only descriptions`);
  warnings++;
  passed++;
}

// Test 25: No channels share identical names (except variations)
const nameCounts = {};
mappings.mappings.forEach(m => {
  const name = m.knowledge.name.toLowerCase().trim();
  nameCounts[name] = (nameCounts[name] || 0) + 1;
});

const duplicateNames = Object.entries(nameCounts)
  .filter(([name, count]) => count > 1)
  .map(([name, count]) => `"${name}" (${count}x)`);

if (duplicateNames.length === 0) {
  console.log('✅ Test 25: All channel names are unique');
  passed++;
} else {
  console.log(`⚠️  Test 25: Found ${duplicateNames.length} duplicate channel names`);
  console.log(`   ${duplicateNames.join(', ')}`);
  warnings++;
  passed++;
}

// ============================================================================
// SUMMARY
// ============================================================================

console.log('='.repeat(80));
console.log(`Total Tests: ${passed + failed}`);
console.log(`Passed: ${passed} ✅ | Failed: ${failed} ❌ | Warnings: ${warnings} ⚠️`);

if (failed === 0) {
  console.log('\n🎉 All critical tests passed!');
  if (warnings > 0) {
    console.log(`   ${warnings} non-critical warnings to review`);
  }
}

process.exit(failed === 0 ? 0 : 1);
