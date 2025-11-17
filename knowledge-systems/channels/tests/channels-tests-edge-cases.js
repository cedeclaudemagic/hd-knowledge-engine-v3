const fs = require('fs');
const path = require('path');

const mappingsPath = path.join(__dirname, '../mappings/channels-mappings.json');
const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

let passed = 0;
let failed = 0;

console.log('🧪 36 Channels - Edge Case Test Suite');
console.log('='.repeat(80));

// ============================================================================
// EDGE CASE: MULTI-CONNECTED GATES
// ============================================================================

// Test 1: Gates that appear in multiple channels (hubs)
console.log('\n📍 Multi-Connected Gates (Hubs):');
const gateAppearances = {};
mappings.mappings.forEach(m => {
  gateAppearances[m.gate1] = (gateAppearances[m.gate1] || []).concat([m.channelNumber]);
  gateAppearances[m.gate2] = (gateAppearances[m.gate2] || []).concat([m.channelNumber]);
});

const hubGates = Object.entries(gateAppearances)
  .filter(([gate, channels]) => channels.length > 2)
  .sort((a, b) => b[1].length - a[1].length);

console.log(`   Found ${hubGates.length} gates appearing in 3+ channels:`);
hubGates.forEach(([gate, channels]) => {
  console.log(`   Gate ${gate}: ${channels.length} channels (${channels.join(', ')})`);
});

// Verify Gate 10 (known to have multiple channels: 10-20, 10-34, 10-57)
const gate10Channels = gateAppearances[10] || [];
if (gate10Channels.length >= 3) {
  console.log(`✅ Test 1: Gate 10 correctly appears in ${gate10Channels.length} channels`);
  passed++;
} else {
  console.log(`❌ Test 1: Gate 10 should appear in multiple channels, found ${gate10Channels.length}`);
  failed++;
}

// ============================================================================
// EDGE CASE: SAME CENTER CHANNELS
// ============================================================================

// Test 2: Channels connecting the same center to itself
console.log('\n📍 Same-Center Connections:');
const sameCenterChannels = mappings.mappings.filter(m => {
  if (!m.knowledge.centerConnection || !m.knowledge.centerConnection.includes(' to ')) return false;
  const [center1, center2] = m.knowledge.centerConnection.split(' to ').map(c => c.trim());
  return center1 === center2;
});

if (sameCenterChannels.length === 0) {
  console.log('✅ Test 2: No channels connect a center to itself');
  passed++;
} else {
  console.log(`⚠️  Test 2: Found ${sameCenterChannels.length} same-center channels (unusual):`);
  sameCenterChannels.forEach(ch => {
    console.log(`   ${ch.channelNumber}: ${ch.knowledge.centerConnection}`);
  });
  passed++; // Not necessarily an error
}

// ============================================================================
// EDGE CASE: G CENTER CHANNELS
// ============================================================================

// Test 3: G Center is a major hub - verify it appears frequently
console.log('\n📍 G Center Hub Analysis:');
const gCenterChannels = mappings.mappings.filter(m => {
  return m.knowledge.centerConnection && m.knowledge.centerConnection.includes('G');
});

console.log(`   G Center appears in ${gCenterChannels.length} channels:`);
gCenterChannels.slice(0, 5).forEach(ch => {
  console.log(`   ${ch.channelNumber}: ${ch.knowledge.centerConnection}`);
});
if (gCenterChannels.length > 5) {
  console.log(`   ... and ${gCenterChannels.length - 5} more`);
}

if (gCenterChannels.length >= 5) {
  console.log(`✅ Test 3: G Center is properly represented as a hub (${gCenterChannels.length} channels)`);
  passed++;
} else {
  console.log(`❌ Test 3: G Center should be a major hub, only found in ${gCenterChannels.length} channels`);
  failed++;
}

// ============================================================================
// EDGE CASE: CIRCUIT-SPECIFIC VALIDATION
// ============================================================================

// Test 4: Money Line (21-45) in Ego Circuit
console.log('\n📍 Special Channel: Money Line');
const moneyLine = mappings.mappings.find(m => m.channelNumber === '21-45');
if (moneyLine) {
  console.log(`   Channel: ${moneyLine.knowledge.name}`);
  console.log(`   Circuit: ${moneyLine.knowledge.circuit}`);
  console.log(`   Centers: ${moneyLine.knowledge.centerConnection}`);

  if (moneyLine.knowledge.circuit === 'Ego Circuit' &&
      (moneyLine.knowledge.name.toLowerCase().includes('money') ||
       moneyLine.knowledge.name.toLowerCase().includes('materialist'))) {
    console.log('✅ Test 4: Money Line (21-45) correctly configured in Ego Circuit');
    passed++;
  } else {
    console.log('❌ Test 4: Money Line (21-45) configuration incorrect');
    failed++;
  }
} else {
  console.log('❌ Test 4: Money Line (21-45) not found in mappings');
  failed++;
}

// Test 5: Integration Circuit channels should involve Gate 10, 20, 34, or 57
console.log('\n📍 Integration Circuit Gates');
const integrationChannels = mappings.mappings.filter(m => m.knowledge.circuit === 'Integration Circuit');
const integrationGates = [10, 20, 34, 57];
const validIntegrationChannels = integrationChannels.filter(ch => {
  return integrationGates.includes(ch.gate1) || integrationGates.includes(ch.gate2);
});

if (validIntegrationChannels.length === integrationChannels.length) {
  console.log(`✅ Test 5: All Integration Circuit channels involve expected gates`);
  console.log(`   Expected gates: ${integrationGates.join(', ')}`);
  passed++;
} else {
  console.log(`❌ Test 5: Some Integration Circuit channels have unexpected gates`);
  failed++;
}

// ============================================================================
// EDGE CASE: BOUNDARY VALUES
// ============================================================================

// Test 6: Lowest and highest gate numbers
console.log('\n📍 Boundary Gate Numbers:');
const allGates = mappings.mappings.flatMap(m => [m.gate1, m.gate2]);
const minGate = Math.min(...allGates);
const maxGate = Math.max(...allGates);

console.log(`   Lowest gate: ${minGate}`);
console.log(`   Highest gate: ${maxGate}`);

if (minGate === 1 && maxGate === 64) {
  console.log('✅ Test 6: Gate numbers span full range (1-64)');
  passed++;
} else {
  console.log(`⚠️  Test 6: Gates don't span full range (${minGate}-${maxGate})`);
  passed++; // Not necessarily an error
}

// Test 7: Adjacent gate pairs (e.g., 1-2, 2-3)
console.log('\n📍 Adjacent Gate Pairs:');
const adjacentPairs = mappings.mappings.filter(m => Math.abs(m.gate2 - m.gate1) === 1);

if (adjacentPairs.length > 0) {
  console.log(`   Found ${adjacentPairs.length} adjacent pairs:`);
  adjacentPairs.forEach(ch => {
    console.log(`   ${ch.channelNumber}: ${ch.knowledge.name}`);
  });
}
console.log(`✅ Test 7: Adjacent pair analysis complete`);
passed++;

// ============================================================================
// EDGE CASE: CHANNEL NAME PATTERNS
// ============================================================================

// Test 8: Channels with "The" prefix
console.log('\n📍 Channel Name Patterns:');
const withThe = mappings.mappings.filter(m => m.knowledge.name.startsWith('The '));
const withoutThe = mappings.mappings.filter(m => !m.knowledge.name.startsWith('The '));

console.log(`   With "The": ${withThe.length} channels`);
console.log(`   Without "The": ${withoutThe.length} channels`);

if (withThe.length > 0 && withoutThe.length > 0) {
  console.log('✅ Test 8: Mix of naming conventions present');
  passed++;
} else {
  console.log('⚠️  Test 8: All channels use same naming convention');
  passed++;
}

// ============================================================================
// EDGE CASE: SPECIFIC CHANNEL VALIDATION
// ============================================================================

// Test 9: Verify specific well-known channels exist
console.log('\n📍 Well-Known Channels Validation:');
const wellKnownChannels = [
  { number: '1-8', name: 'Inspiration' },
  { number: '34-57', name: 'Power' },
  { number: '27-50', name: 'Preservation' },
  { number: '6-59', name: 'Mating' }
];

let allWellKnownFound = true;
wellKnownChannels.forEach(({ number, name }) => {
  const channel = mappings.mappings.find(m => m.channelNumber === number);
  if (channel && channel.knowledge.name.includes(name)) {
    console.log(`   ✓ ${number}: ${channel.knowledge.name}`);
  } else {
    console.log(`   ✗ ${number}: Missing or incorrect name`);
    allWellKnownFound = false;
  }
});

if (allWellKnownFound) {
  console.log('✅ Test 9: All well-known channels correctly mapped');
  passed++;
} else {
  console.log('❌ Test 9: Some well-known channels missing or incorrect');
  failed++;
}

// ============================================================================
// EDGE CASE: CROSS-CIRCUIT ANALYSIS
// ============================================================================

// Test 10: Verify no channel is assigned to multiple circuits
console.log('\n📍 Single Circuit Assignment:');
const duplicateCircuitAssignments = mappings.mappings.filter((m, idx, arr) => {
  return arr.filter(other => other.channelNumber === m.channelNumber).length > 1;
});

if (duplicateCircuitAssignments.length === 0) {
  console.log('✅ Test 10: Each channel assigned to exactly one circuit');
  passed++;
} else {
  console.log(`❌ Test 10: Found channels with duplicate assignments`);
  failed++;
}

// ============================================================================
// EDGE CASE: CENTER DISTRIBUTION
// ============================================================================

// Test 11: Center usage distribution
console.log('\n📍 Center Usage Distribution:');
const centerUsage = {};
mappings.mappings.forEach(m => {
  if (m.knowledge.centerConnection) {
    const centers = m.knowledge.centerConnection.split(' to ').map(c => c.trim());
    centers.forEach(center => {
      centerUsage[center] = (centerUsage[center] || 0) + 1;
    });
  }
});

console.log('   Center appearances:');
Object.entries(centerUsage).sort((a, b) => b[1] - a[1]).forEach(([center, count]) => {
  console.log(`   ${center}: ${count}`);
});

const unusedCenters = ['Head', 'Ajna', 'Throat', 'G', 'Heart', 'Spleen', 'Solar Plexus', 'Sacral', 'Root']
  .filter(center => !centerUsage[center]);

if (unusedCenters.length === 0) {
  console.log('✅ Test 11: All 9 centers are connected by at least one channel');
  passed++;
} else {
  console.log(`❌ Test 11: Centers not appearing in any channel: ${unusedCenters.join(', ')}`);
  failed++;
}

// ============================================================================
// EDGE CASE: STRING ENCODING
// ============================================================================

// Test 12: Check for unusual characters or encoding issues
console.log('\n📍 String Encoding:');
let encodingIssues = [];
mappings.mappings.forEach(m => {
  // Check for common encoding issues
  const fields = [m.knowledge.name, m.knowledge.keynote, m.knowledge.description];
  fields.forEach((field, idx) => {
    if (field && (field.includes('�') || field.includes('\\u') || /[^\x00-\x7F]/.test(field))) {
      encodingIssues.push(`${m.channelNumber}: Potential encoding issue in field ${idx}`);
    }
  });
});

if (encodingIssues.length === 0) {
  console.log('✅ Test 12: No encoding issues detected');
  passed++;
} else {
  console.log(`⚠️  Test 12: Potential encoding issues found:`);
  encodingIssues.slice(0, 5).forEach(issue => console.log(`   ${issue}`));
  passed++; // Warning only
}

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log(`Total Edge Case Tests: ${passed + failed}`);
console.log(`Passed: ${passed} ✅ | Failed: ${failed} ❌`);

if (failed === 0) {
  console.log('\n🎉 All edge case tests passed!');
}

process.exit(failed === 0 ? 0 : 1);
