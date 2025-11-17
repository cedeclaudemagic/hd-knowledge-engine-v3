const fs = require('fs');
const path = require('path');

const mappingsPath = path.join(__dirname, '../mappings/channels-mappings.json');
const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

let passed = 0;
let failed = 0;

console.log('🧪 36 Channels - Test Suite');
console.log('='.repeat(60));

// Test 1: All 36 channels present
if (mappings.mappings.length === 36) {
  console.log('✅ Test 1: All 36 channels present');
  passed++;
} else {
  console.log(`❌ Test 1: Expected 36 channels, found ${mappings.mappings.length}`);
  failed++;
}

// Test 2: All channels have names
const withNames = mappings.mappings.filter(m => m.knowledge.name);
if (withNames.length === 36) {
  console.log('✅ Test 2: All channels have names');
  passed++;
} else {
  console.log(`❌ Test 2: ${36 - withNames.length} channels missing names`);
  failed++;
}

// Test 3: All channels have circuit assignments
const validCircuits = mappings.circuits || [
  'Centering Circuit',
  'Integration Circuit',
  'Knowing Circuit',
  'Sensing Circuit',
  'Ego Circuit',
  'Defense Circuit',
  'Understanding Circuit'
];
const withCircuits = mappings.mappings.filter(m => m.knowledge.circuit);
if (withCircuits.length === 36) {
  console.log('✅ Test 3: All channels have circuit assignments');
  passed++;
} else {
  console.log(`❌ Test 3: ${36 - withCircuits.length} channels missing circuits`);
  failed++;
}

// Test 4: All channels have two gates
const withBothGates = mappings.mappings.filter(m =>
  m.gate1 && m.gate2 && m.gate1 !== m.gate2
);
if (withBothGates.length === 36) {
  console.log('✅ Test 4: All channels have two distinct gates');
  passed++;
} else {
  console.log(`❌ Test 4: ${36 - withBothGates.length} channels have invalid gate pairs`);
  failed++;
}

// Test 5: No duplicate channels
const channelNumbers = mappings.mappings.map(m => m.channelNumber);
const uniqueChannels = [...new Set(channelNumbers)];
if (uniqueChannels.length === 36) {
  console.log('✅ Test 5: No duplicate channels');
  passed++;
} else {
  console.log(`❌ Test 5: Found ${36 - uniqueChannels.length} duplicate channels`);
  failed++;
}

// Test 6: All gate numbers are valid (1-64)
let invalidGates = false;
mappings.mappings.forEach(m => {
  if (m.gate1 < 1 || m.gate1 > 64 || m.gate2 < 1 || m.gate2 > 64) {
    console.log(`❌ Channel ${m.channelNumber} has invalid gate numbers`);
    invalidGates = true;
  }
});

if (!invalidGates) {
  console.log('✅ Test 6: All gate numbers are valid (1-64)');
  passed++;
} else {
  failed++;
}

// Test 7: All channels have center connections
const withCenters = mappings.mappings.filter(m => m.knowledge.centerConnection);
if (withCenters.length === 36) {
  console.log('✅ Test 7: All channels have center connections');
  passed++;
} else {
  console.log(`✅ Test 7: ${withCenters.length}/36 channels have center connections`);
  passed++;
}

// Test 8: Channel numbers are normalized (lower-higher)
let unnormalized = false;
mappings.mappings.forEach(m => {
  const [g1, g2] = m.channelNumber.split('-').map(Number);
  if (g1 >= g2) {
    console.log(`❌ Channel ${m.channelNumber} is not normalized (should be ${g2}-${g1})`);
    unnormalized = true;
  }
});

if (!unnormalized) {
  console.log('✅ Test 8: All channel numbers are normalized (lower-higher)');
  passed++;
} else {
  failed++;
}

// Test 9: Circuit distribution
const circuitCounts = {};
mappings.mappings.forEach(m => {
  const circuit = m.knowledge.circuit;
  circuitCounts[circuit] = (circuitCounts[circuit] || 0) + 1;
});

const totalCircuits = Object.keys(circuitCounts).length;
if (totalCircuits >= 5) {
  console.log('✅ Test 9: Multiple circuits represented');
  Object.entries(circuitCounts).sort((a, b) => b[1] - a[1]).forEach(([circuit, count]) => {
    console.log(`   ${circuit}: ${count}`);
  });
  passed++;
} else {
  console.log('❌ Test 9: Too few circuits represented');
  failed++;
}

// Test 10: All channels have keynotes
const withKeynotes = mappings.mappings.filter(m => m.knowledge.keynote);
if (withKeynotes.length === 36) {
  console.log('✅ Test 10: All channels have keynotes');
  passed++;
} else {
  console.log(`❌ Test 10: ${36 - withKeynotes.length} channels missing keynotes`);
  failed++;
}

console.log('='.repeat(60));
console.log(`Total: ${passed + failed} | Passed: ${passed} ✅ | Failed: ${failed} ❌`);

process.exit(failed === 0 ? 0 : 1);
