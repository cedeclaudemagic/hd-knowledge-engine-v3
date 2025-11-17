#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Extract center assignments from all gate files
const gatesDir = path.join(__dirname, '../../data/source/gates');
const centerAssignments = {};

console.log('🔍 Extracting center assignments from gate files...\n');

for (let gateNum = 1; gateNum <= 64; gateNum++) {
  const gateFile = path.join(gatesDir, `gate-${gateNum}.json`);

  try {
    const gateData = JSON.parse(fs.readFileSync(gateFile, 'utf8'));
    const gate = gateData[gateNum.toString()];

    if (gate && gate.center) {
      const center = gate.center;

      if (!centerAssignments[center]) {
        centerAssignments[center] = [];
      }

      centerAssignments[center].push(gateNum);
      console.log(`✓ Gate ${gateNum}: ${gate.name} → ${center}`);
    } else {
      console.log(`✗ Gate ${gateNum}: No center found`);
    }
  } catch (err) {
    console.log(`✗ Gate ${gateNum}: Error reading file - ${err.message}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('📊 CENTER ASSIGNMENTS SUMMARY\n');

const sortedCenters = Object.keys(centerAssignments).sort();
let totalGates = 0;

sortedCenters.forEach(center => {
  const gates = centerAssignments[center].sort((a, b) => a - b);
  totalGates += gates.length;
  console.log(`${center.padEnd(15)} (${gates.length.toString().padStart(2)} gates): ${gates.join(', ')}`);
});

console.log('\n' + '='.repeat(60));
console.log(`Total Centers: ${sortedCenters.length}`);
console.log(`Total Gates: ${totalGates}`);
console.log('='.repeat(60));

// Write to JSON file for reference
const outputFile = path.join(__dirname, 'center-gate-assignments.json');
fs.writeFileSync(outputFile, JSON.stringify(centerAssignments, null, 2));
console.log(`\n✅ Saved to: ${outputFile}`);
