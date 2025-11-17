#!/usr/bin/env node
/**
 * Validate Unique Cross Names Within Each Gate
 *
 * Rule: Each gate must have 3 different cross names (LAX, RAX, JX)
 * No gate can have the same cross name for multiple types.
 */

const fs = require('fs');
const path = require('path');

const sourceDataPath = path.join(__dirname, '../../../data/source/extracted/incarnation-crosses-extracted-data.json');
const sourceData = JSON.parse(fs.readFileSync(sourceDataPath, 'utf8'));

console.log('=== VALIDATING UNIQUE CROSS NAMES PER GATE ===\n');

// Group crosses by gate number
const gateGroups = {};
for (let i = 1; i <= 64; i++) {
  gateGroups[i] = { LAX: null, RAX: null, JX: null };
}

for (const name in sourceData.crosses) {
  const cross = sourceData.crosses[name];
  const gate = cross.personalitySun;
  const type = cross.type;
  gateGroups[gate][type] = name;
}

// Check for duplicates
const errors = [];
const warnings = [];

for (let gate = 1; gate <= 64; gate++) {
  const crosses = gateGroups[gate];
  const names = [];
  const types = [];

  if (crosses.LAX) { names.push(crosses.LAX); types.push('LAX'); }
  if (crosses.RAX) { names.push(crosses.RAX); types.push('RAX'); }
  if (crosses.JX) { names.push(crosses.JX); types.push('JX'); }

  // Check for duplicate names
  const uniqueNames = new Set(names);

  if (names.length !== uniqueNames.size) {
    // Find which names are duplicated
    const nameCounts = {};
    names.forEach(n => nameCounts[n] = (nameCounts[n] || 0) + 1);
    const duplicated = Object.keys(nameCounts).filter(n => nameCounts[n] > 1);

    errors.push({
      gate,
      duplicatedName: duplicated[0],
      lax: crosses.LAX,
      rax: crosses.RAX,
      jx: crosses.JX
    });
  }

  // Check for missing crosses
  if (names.length < 3) {
    const missing = [];
    if (!crosses.LAX) missing.push('LAX');
    if (!crosses.RAX) missing.push('RAX');
    if (!crosses.JX) missing.push('JX');

    warnings.push({
      gate,
      missing: missing.join(', '),
      present: types.join(', ')
    });
  }
}

console.log('=== RESULTS ===\n');

if (errors.length === 0) {
  console.log('✅ No duplicate cross names within same gate');
} else {
  console.log(`❌ FOUND ${errors.length} GATE(S) WITH DUPLICATE NAMES:\n`);
  errors.forEach(e => {
    console.log(`Gate ${e.gate}: "${e.duplicatedName}" appears multiple times`);
    console.log(`  LAX: ${e.lax || 'MISSING'}`);
    console.log(`  RAX: ${e.rax || 'MISSING'}`);
    console.log(`  JX:  ${e.jx || 'MISSING'}`);
    console.log('');
  });
}

if (warnings.length > 0) {
  console.log(`\n⚠️  ${warnings.length} GATE(S) WITH MISSING CROSSES:\n`);
  warnings.forEach(w => {
    console.log(`Gate ${w.gate}: Missing ${w.missing} (has ${w.present})`);
  });
}

console.log('\n=== SUMMARY ===');
console.log(`Gates with unique names: ${64 - errors.length}/64`);
console.log(`Gates with all 3 crosses: ${64 - warnings.length}/64`);

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ ALL VALIDATIONS PASSED');
  process.exit(0);
} else {
  console.log('\n⚠️ VALIDATION ISSUES FOUND');
  process.exit(1);
}
