#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the source data
const dataPath = path.join(__dirname, '..', '..', '..', 'data', 'source', 'extracted', 'incarnation-crosses-extracted-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('=== ADDING 2 MISSING CROSSES ===\n');
console.log(`Current total: ${Object.keys(data.crosses).length} crosses\n`);

let added = 0;

// Gate 16: Add JX Experimentation 2
console.log('Gate 16 - Adding JX Experimentation 2:');
console.log('  Values: 16/9 - 63/64');
console.log('  Note: "Experimentation" already exists at Gate 9');

data.crosses['Experimentation 2'] = {
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
console.log('  ✓ Added as "Experimentation 2"');
added++;

// Gate 42: Add LAX Limitation 3
console.log('\nGate 42 - Adding LAX Limitation 3:');
console.log('  Values: 42/32 - 60/56');
console.log('  Note: "Limitation" exists at Gate 60, "Limitation 2" at Gate 32');

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
console.log('  ✓ Added as "Limitation 3"');
added++;

console.log(`\n=== SUMMARY ===`);
console.log(`Crosses added: ${added}`);
console.log(`New total: ${Object.keys(data.crosses).length} crosses`);
console.log(`Expected: 192 crosses`);

// Save the corrected data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('\n✓ Data saved to:', dataPath);
