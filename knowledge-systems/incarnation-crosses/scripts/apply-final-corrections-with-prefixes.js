#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the source data
const dataPath = path.join(__dirname, '..', '..', '..', 'data', 'source', 'extracted', 'incarnation-crosses-extracted-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('=== APPLYING CORRECTIONS WITH TYPE PREFIXES ===\n');
console.log(`Current total: ${Object.keys(data.crosses).length} crosses\n`);

let changes = 0;

// 1. Rename Gate 9 JX: "Experimentation" → "JX Focus"
console.log('1. Gate 9 JX: Renaming "Experimentation" → "JX Focus"');
if (data.crosses['Experimentation']) {
  console.log(`   Current: ${data.crosses['Experimentation'].personalitySun}/${data.crosses['Experimentation'].personalityEarth} - ${data.crosses['Experimentation'].designSun}/${data.crosses['Experimentation'].designEarth}`);

  data.crosses['JX Focus'] = data.crosses['Experimentation'];
  delete data.crosses['Experimentation'];

  console.log('   ✓ Renamed to "JX Focus"');
  changes++;
}

// 2. Add Gate 16 JX: "JX Experimentation"
console.log('\n2. Gate 16 JX: Adding "JX Experimentation"');
console.log('   Values: 16/9 - 63/64');

data.crosses['JX Experimentation'] = {
  "type": "JX",
  "personalitySun": 16,
  "personalityEarth": 9,
  "designSun": 63,
  "designEarth": 64,
  "gates": [16, 9, 63, 64],
  "gateRoles": {
    "16": "Personality Sun",
    "9": "Personality Earth",
    "63": "Design Sun",
    "64": "Design Earth"
  }
};
console.log('   ✓ Added as "JX Experimentation"');
changes++;

// 3. Add Gate 42 LAX: "LAX Limitation"
console.log('\n3. Gate 42 LAX: Adding "LAX Limitation"');
console.log('   Values: 42/32 - 60/56');

data.crosses['LAX Limitation'] = {
  "type": "LAX",
  "personalitySun": 42,
  "personalityEarth": 32,
  "designSun": 60,
  "designEarth": 56,
  "gates": [42, 32, 60, 56],
  "gateRoles": {
    "42": "Personality Sun",
    "32": "Personality Earth",
    "60": "Design Sun",
    "56": "Design Earth"
  }
};
console.log('   ✓ Added as "LAX Limitation"');
changes++;

console.log(`\n=== SUMMARY ===`);
console.log(`Changes made: ${changes}`);
console.log(`New total: ${Object.keys(data.crosses).length} crosses`);
console.log(`Expected: 192 crosses`);

console.log('\nNote: Existing crosses with potential naming conflicts:');
console.log('  - "Limitation" (Gate 60 JX) - could be renamed to "JX Limitation"');
console.log('  - "Limitation 2" (Gate 32 LAX) - could be renamed to "LAX Limitation 2"');
console.log('  (Not renamed in this script to maintain existing data)');

if (Object.keys(data.crosses).length === 192) {
  console.log('\n✅ PERFECT! 192 crosses achieved!');
} else {
  console.log(`\n⚠️  Total is ${Object.keys(data.crosses).length}, expected 192`);
}

// Save the corrected data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('\n✓ Data saved to:', dataPath);
