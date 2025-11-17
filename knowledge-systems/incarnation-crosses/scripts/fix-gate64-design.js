#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the source data
const dataPath = path.join(__dirname, '..', '..', '..', 'data', 'source', 'extracted', 'incarnation-crosses-extracted-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('=== FIXING GATE 64 LAX/JX DESIGN VALUES ===\n');

let fixed = 0;

// Fix Gate 64 LAX "Dominion 2"
if (data.crosses['Dominion 2']) {
  console.log('Gate 64 LAX "Dominion 2":');
  console.log(`  Before: ${data.crosses['Dominion 2'].personalitySun}/${data.crosses['Dominion 2'].personalityEarth} - ${data.crosses['Dominion 2'].designSun}/${data.crosses['Dominion 2'].designEarth}`);

  data.crosses['Dominion 2'].designSun = 45;
  data.crosses['Dominion 2'].gates = [64, 63, 45, 26];
  data.crosses['Dominion 2'].gateRoles = {
    "64": "Personality Sun",
    "63": "Personality Earth",
    "45": "Design Sun",
    "26": "Design Earth"
  };

  console.log(`  After:  ${data.crosses['Dominion 2'].personalitySun}/${data.crosses['Dominion 2'].personalityEarth} - ${data.crosses['Dominion 2'].designSun}/${data.crosses['Dominion 2'].designEarth}`);
  console.log('  ✓ Fixed: DS 46 → 45');
  fixed++;
}

// Fix Gate 64 JX "Confusion"
if (data.crosses['Confusion']) {
  console.log('\nGate 64 JX "Confusion":');
  console.log(`  Before: ${data.crosses['Confusion'].personalitySun}/${data.crosses['Confusion'].personalityEarth} - ${data.crosses['Confusion'].designSun}/${data.crosses['Confusion'].designEarth}`);

  data.crosses['Confusion'].designSun = 45;
  data.crosses['Confusion'].gates = [64, 63, 45, 26];
  data.crosses['Confusion'].gateRoles = {
    "64": "Personality Sun",
    "63": "Personality Earth",
    "45": "Design Sun",
    "26": "Design Earth"
  };

  console.log(`  After:  ${data.crosses['Confusion'].personalitySun}/${data.crosses['Confusion'].personalityEarth} - ${data.crosses['Confusion'].designSun}/${data.crosses['Confusion'].designEarth}`);
  console.log('  ✓ Fixed: DS 46 → 45');
  fixed++;
}

console.log(`\n=== SUMMARY ===`);
console.log(`Fixes applied: ${fixed}`);
console.log('Both Gate 64 LAX/JX now have Design 45/26 (matching Gate 47 RAX per Formula 1)');

// Save the corrected data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('\n✓ Data saved to:', dataPath);
