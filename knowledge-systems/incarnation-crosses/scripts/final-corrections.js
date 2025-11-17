#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the source data
const dataPath = path.join(__dirname, '..', '..', '..', 'data', 'source', 'extracted', 'incarnation-crosses-extracted-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('=== FINAL CORRECTIONS FOR 192 CROSSES ===\n');
console.log(`Current total: ${Object.keys(data.crosses).length} crosses\n`);

let changes = 0;

// 1. Rename Gate 9 JX: "Experimentation" → "Focus"
console.log('1. Gate 9 JX: Renaming "Experimentation" → "Focus"');
if (data.crosses['Experimentation']) {
  console.log(`   Current values: ${data.crosses['Experimentation'].personalitySun}/${data.crosses['Experimentation'].personalityEarth} - ${data.crosses['Experimentation'].designSun}/${data.crosses['Experimentation'].designEarth}`);

  data.crosses['Focus'] = data.crosses['Experimentation'];
  delete data.crosses['Experimentation'];

  console.log('   ✓ Renamed to "Focus"');
  changes++;
} else {
  console.log('   ✗ "Experimentation" not found');
}

// 2. Add Gate 16 JX: "Experimentation"
console.log('\n2. Gate 16 JX: Adding "Experimentation"');
console.log('   Values: 16/9 - 63/64');

data.crosses['Experimentation'] = {
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
console.log('   ✓ Added');
changes++;

// 3. Add Gate 42 LAX: "Limitation 3"
console.log('\n3. Gate 42 LAX: Adding "Limitation 3"');
console.log('   Values: 42/32 - 60/56');
console.log('   Note: "Limitation" (JX) at Gate 60, "Limitation 2" (LAX) at Gate 32 already exist');

data.crosses['Limitation 3'] = {
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
console.log('   ✓ Added');
changes++;

console.log(`\n=== SUMMARY ===`);
console.log(`Changes made: ${changes}`);
console.log(`New total: ${Object.keys(data.crosses).length} crosses`);
console.log(`Expected: 192 crosses`);

if (Object.keys(data.crosses).length === 192) {
  console.log('\n✅ PERFECT! 192 crosses achieved!');
} else {
  console.log(`\n⚠️  Total is ${Object.keys(data.crosses).length}, expected 192`);
}

// Save the corrected data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('\n✓ Data saved to:', dataPath);
