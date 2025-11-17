#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the source data
const dataPath = path.join(__dirname, '..', '..', '..', 'data', 'source', 'extracted', 'incarnation-crosses-extracted-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('=== RENAMING INFORMING 2 TO INFORMING ===\n');

if (data.crosses['Informing 2']) {
  console.log('Found "Informing 2" - renaming to "Informing"');
  console.log(`  Values: ${data.crosses['Informing 2'].personalitySun}/${data.crosses['Informing 2'].personalityEarth} - ${data.crosses['Informing 2'].designSun}/${data.crosses['Informing 2'].designEarth}`);

  // Copy to new key
  data.crosses['Informing'] = data.crosses['Informing 2'];

  // Delete old key
  delete data.crosses['Informing 2'];

  console.log('✓ Renamed successfully');
} else {
  console.log('❌ "Informing 2" not found in data');
}

// Save the corrected data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('\n✓ Data saved to:', dataPath);
