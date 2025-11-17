#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Path to source gate files
const gatesDir = path.join(__dirname, '../../data/source/gates');
const outputFile = path.join(__dirname, 'mappings/hd-gates-mappings.json');

console.log('🔍 Extracting Human Design Gate Data');
console.log('=====================================\n');

const mappings = [];
const errors = [];

// Extract data from each gate file
for (let gateNum = 1; gateNum <= 64; gateNum++) {
  const gateFile = path.join(gatesDir, `gate-${gateNum}.json`);

  try {
    if (!fs.existsSync(gateFile)) {
      errors.push(`Gate ${gateNum}: File not found`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(gateFile, 'utf8'));
    const gateData = data[gateNum.toString()];

    if (!gateData) {
      errors.push(`Gate ${gateNum}: No gate data found in file`);
      continue;
    }

    // Transform to mapping format
    const mapping = {
      gateNumber: gateNum,
      lineNumber: null, // Gate-level system
      knowledge: {
        name: gateData.name || null,
        keyword: gateData.keyword || null,
        center: gateData.center || null,
        description: gateData.description || null,
        channel: gateData.channel || null,
        channelName: gateData.channelName || null,
        channelKeynote: gateData.channelKeynote || null,
        harmonicGate: gateData.harmonicGate || null,
        harmonicGateName: gateData.harmonicGateName || null
      }
    };

    mappings.push(mapping);
    console.log(`✅ Gate ${gateNum}: ${gateData.keyword} (${gateData.center})`);

  } catch (error) {
    errors.push(`Gate ${gateNum}: ${error.message}`);
    console.log(`❌ Gate ${gateNum}: ${error.message}`);
  }
}

console.log(`\n📊 Summary`);
console.log(`==========`);
console.log(`Total gates extracted: ${mappings.length}`);
console.log(`Errors: ${errors.length}`);

if (errors.length > 0) {
  console.log(`\n⚠️  Errors:`);
  errors.forEach(err => console.log(`   - ${err}`));
}

// Sort mappings by gate number
mappings.sort((a, b) => a.gateNumber - b.gateNumber);

// Create the final mapping structure
const outputData = {
  systemName: "Human Design Gate Names & Keywords",
  version: "1.0.0",
  description: "Ra Uru Hu's Human Design gate keywords, centers, and channel associations",
  completeness: "full",
  dataArchitecture: "gate-level",
  mappings: mappings
};

// Write to output file
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2), 'utf8');

console.log(`\n✅ Mapping file created: ${outputFile}`);
console.log(`\n✨ Extraction complete!`);

process.exit(errors.length > 0 ? 1 : 0);
