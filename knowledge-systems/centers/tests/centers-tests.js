const fs = require('fs');
const path = require('path');

const mappingsPath = path.join(__dirname, '../mappings/centers-mappings.json');
const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

let passed = 0;
let failed = 0;

console.log('🧪 9 Centers - Test Suite');
console.log('=' .repeat(60));

// Test 1: All 9 centers present
if (mappings.mappings.length === 9) {
  console.log('✅ Test 1: All 9 centers present');
  passed++;
} else {
  console.log(`❌ Test 1: Expected 9 centers, found ${mappings.mappings.length}`);
  failed++;
}

// Test 2: All centers have names
const expectedCenters = ['Head', 'Ajna', 'Throat', 'G', 'Heart', 'Sacral', 'Solar Plexus', 'Spleen', 'Root'];
const centerNames = mappings.mappings.map(m => m.centerName);
const allMatch = expectedCenters.every(c => centerNames.includes(c));

if (allMatch) {
  console.log('✅ Test 2: All expected center names present');
  passed++;
} else {
  const missing = expectedCenters.filter(c => !centerNames.includes(c));
  console.log(`❌ Test 2: Missing centers: ${missing.join(', ')}`);
  failed++;
}

// Test 3: All 64 gates are assigned to centers
const allGates = mappings.mappings.flatMap(m => m.gates);
const uniqueGates = [...new Set(allGates)];

if (uniqueGates.length === 64) {
  console.log('✅ Test 3: All 64 gates assigned to centers');
  passed++;
} else {
  console.log(`❌ Test 3: Only ${uniqueGates.length}/64 gates assigned`);
  failed++;
}

// Test 4: No duplicate gate assignments
if (allGates.length === 64) {
  console.log('✅ Test 4: No duplicate gate assignments');
  passed++;
} else {
  const duplicates = allGates.length - uniqueGates.length;
  console.log(`❌ Test 4: ${duplicates} gates assigned to multiple centers`);
  failed++;
}

// Test 5: All gates are valid (1-64)
const invalidGates = uniqueGates.filter(g => g < 1 || g > 64);
if (invalidGates.length === 0) {
  console.log('✅ Test 5: All gate numbers are valid (1-64)');
  passed++;
} else {
  console.log(`❌ Test 5: ${invalidGates.length} invalid gate numbers`);
  failed++;
}

// Test 6: All centers have types
const validTypes = ['Pressure', 'Motor', 'Awareness', 'Motor/Awareness', 'Pressure/Motor', 'Motor/Expression', 'Identity'];
const withTypes = mappings.mappings.filter(m =>
  m.type && validTypes.includes(m.type)
);

if (withTypes.length === 9) {
  console.log('✅ Test 6: All centers have valid types');
  passed++;
} else {
  console.log(`❌ Test 6: ${9 - withTypes.length} centers missing/invalid types`);
  failed++;
}

// Test 7: All centers have functions
const withFunctions = mappings.mappings.filter(m => m.knowledge.function);
if (withFunctions.length === 9) {
  console.log('✅ Test 7: All centers have function descriptions');
  passed++;
} else {
  console.log(`❌ Test 7: ${9 - withFunctions.length} centers missing functions`);
  failed++;
}

// Test 8: Verify gate counts match declarations
let countMismatch = false;
mappings.mappings.forEach(m => {
  if (m.gates.length !== m.totalGates) {
    console.log(`❌ ${m.centerName}: declared ${m.totalGates} gates but has ${m.gates.length}`);
    countMismatch = true;
  }
});

if (!countMismatch) {
  console.log('✅ Test 8: All gate counts match declarations');
  passed++;
} else {
  failed++;
}

// Test 9: Verify system metadata
if (mappings.systemName === "The 9 Centers" &&
    mappings.version === "1.0.0" &&
    mappings.dataArchitecture === "structure" &&
    mappings.totalCenters === 9) {
  console.log('✅ Test 9: System metadata is correct');
  passed++;
} else {
  console.log('❌ Test 9: System metadata is incorrect');
  failed++;
}

// Test 10: All centers have required knowledge fields
const requiredFields = ['function', 'theme', 'question', 'whenDefined', 'whenUndefined', 'biology', 'color', 'description'];
let missingFields = false;

mappings.mappings.forEach(center => {
  const missing = requiredFields.filter(field => !center.knowledge[field]);
  if (missing.length > 0) {
    console.log(`❌ ${center.centerName}: missing fields: ${missing.join(', ')}`);
    missingFields = true;
  }
});

if (!missingFields) {
  console.log('✅ Test 10: All centers have required knowledge fields');
  passed++;
} else {
  failed++;
}

// Test 11: Verify specific center gate counts
const expectedGateCounts = {
  'Head': 3,
  'Ajna': 6,
  'Throat': 11,
  'G': 8,
  'Heart': 4,
  'Sacral': 9,
  'Solar Plexus': 7,
  'Spleen': 7,
  'Root': 9
};

let gateCountsCorrect = true;
mappings.mappings.forEach(center => {
  const expected = expectedGateCounts[center.centerName];
  if (center.totalGates !== expected) {
    console.log(`❌ ${center.centerName}: expected ${expected} gates, found ${center.totalGates}`);
    gateCountsCorrect = false;
  }
});

if (gateCountsCorrect) {
  console.log('✅ Test 11: All center gate counts are correct');
  passed++;
} else {
  failed++;
}

// Test 12: Gates are sorted within each center
let gatesSorted = true;
mappings.mappings.forEach(center => {
  const sorted = [...center.gates].sort((a, b) => a - b);
  if (JSON.stringify(center.gates) !== JSON.stringify(sorted)) {
    console.log(`❌ ${center.centerName}: gates are not sorted`);
    gatesSorted = false;
  }
});

if (gatesSorted) {
  console.log('✅ Test 12: Gates are sorted within each center');
  passed++;
} else {
  failed++;
}

console.log('=' .repeat(60));
console.log(`Total: ${passed + failed} | Passed: ${passed} ✅ | Failed: ${failed} ❌`);

process.exit(failed === 0 ? 0 : 1);
