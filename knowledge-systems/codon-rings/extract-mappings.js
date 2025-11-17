#!/usr/bin/env node

/**
 * Extract Codon Rings mappings from source data
 * Creates mappings.json for the knowledge system
 */

const codonRingsSource = require('../../data/source/extracted/codon-rings-manual-data.js');

const CODON_RINGS_DATA = codonRingsSource.CODON_RINGS_DATA;

// Create mapping structure
const mappings = {
  systemName: "Codon Rings",
  version: "1.0.0",
  description: "Biochemical amino acid correlations and DNA codon mappings across 22 codon rings",
  completeness: "full",
  totalRings: 22,
  totalGates: 64,
  mappings: []
};

// Build gate-to-rings lookup (supporting multiple rings per gate)
// NOTE: Gate 12 appears in BOTH RING_OF_TRIALS and RING_OF_SECRETS
// This is correct - Ring of Trials (all stop codons) CONTAINS Ring of Secrets (UGA stop codon) as a special subset
const gateToRings = {};
const ringDetails = {};

for (const ringKey in CODON_RINGS_DATA) {
  const ring = CODON_RINGS_DATA[ringKey];
  const ringName = ringKey
    .replace(/^RING_OF_/, '')
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');

  const fullRingName = `Ring of ${ringName}`;

  // Store ring details
  ringDetails[fullRingName] = {
    ringKey: ringKey,
    aminoAcid: ring.aminoAcid,
    codons: ring.codons,
    gates: ring.gates
  };

  // Map each gate to this ring (supporting multiple rings per gate)
  ring.gates.forEach(gateNumber => {
    if (!gateToRings[gateNumber]) {
      gateToRings[gateNumber] = [];
    }
    gateToRings[gateNumber].push({
      ring: fullRingName,
      ringKey: ringKey,
      aminoAcid: ring.aminoAcid,
      codons: ring.codons,
      ringGates: ring.gates
    });
  });
}

// Create mappings for all 64 gates
for (let gateNumber = 1; gateNumber <= 64; gateNumber++) {
  const ringDataArray = gateToRings[gateNumber];

  if (!ringDataArray || ringDataArray.length === 0) {
    console.error(`WARNING: Gate ${gateNumber} not found in any ring!`);
    continue;
  }

  // Most gates belong to one ring, but some (like Gate 12) belong to multiple rings
  if (ringDataArray.length === 1) {
    // Single ring - standard case
    const ringData = ringDataArray[0];
    mappings.mappings.push({
      gateNumber: gateNumber,
      lineNumber: null,
      knowledge: {
        ring: ringData.ring,
        aminoAcid: ringData.aminoAcid,
        codons: ringData.codons,
        ringGates: ringData.ringGates,
        biochemicalFunction: `Part of ${ringData.ring} - ${ringData.aminoAcid} biochemical pathway`
      }
    });
  } else {
    // Multiple rings - nested structure (e.g., Gate 12)
    ringDataArray.forEach(ringData => {
      mappings.mappings.push({
        gateNumber: gateNumber,
        lineNumber: null,
        knowledge: {
          ring: ringData.ring,
          aminoAcid: ringData.aminoAcid,
          codons: ringData.codons,
          ringGates: ringData.ringGates,
          biochemicalFunction: `Part of ${ringData.ring} - ${ringData.aminoAcid} biochemical pathway`,
          nestedStructure: ringDataArray.length > 1,
          totalRings: ringDataArray.length,
          allRings: ringDataArray.map(r => r.ring)
        }
      });
    });
  }
}

// Sort by gate number
mappings.mappings.sort((a, b) => a.gateNumber - b.gateNumber);

// Validation
console.log('=== CODON RINGS MAPPING EXTRACTION ===\n');
console.log(`Total Rings: ${mappings.totalRings}`);
console.log(`Total Mapping Entries: ${mappings.mappings.length}`);
console.log(`Expected: 64 gates + nested entries`);

// Check all gates are present
const mappedGates = new Set(mappings.mappings.map(m => m.gateNumber));
const missingGates = [];
for (let i = 1; i <= 64; i++) {
  if (!mappedGates.has(i)) {
    missingGates.push(i);
  }
}

if (missingGates.length > 0) {
  console.error(`\nERROR: Missing gates: ${missingGates.join(', ')}`);
} else {
  console.log('\n✅ All 64 gates mapped successfully');
}

// Check for nested structures (gates in multiple rings)
const gateCounts = {};
mappings.mappings.forEach(m => {
  gateCounts[m.gateNumber] = (gateCounts[m.gateNumber] || 0) + 1;
});

const nestedGates = Object.entries(gateCounts)
  .filter(([gate, count]) => count > 1)
  .map(([gate, count]) => ({ gate: parseInt(gate), count }));

if (nestedGates.length > 0) {
  console.log('\n🔄 Gates in multiple rings (nested structure):');
  nestedGates.forEach(({ gate, count }) => {
    const rings = mappings.mappings
      .filter(m => m.gateNumber === gate)
      .map(m => m.knowledge.ring);
    console.log(`  Gate ${gate}: ${rings.join(' → ')}`);
  });
} else {
  console.log('\n✅ No nested ring structures (all gates in single rings)');
}

// Check all rings are represented
const uniqueRings = new Set(mappings.mappings.map(m => m.knowledge.ring));
console.log(`\nUnique Rings: ${uniqueRings.size}`);
console.log('Rings:');
uniqueRings.forEach(ring => console.log(`  - ${ring}`));

// Write to file
const fs = require('fs');
const outputPath = __dirname + '/mappings/codon-rings-mappings.json';
fs.writeFileSync(outputPath, JSON.stringify(mappings, null, 2));

console.log(`\n✅ Mappings written to: ${outputPath}`);
console.log('\nSample mapping:');
console.log(JSON.stringify(mappings.mappings[0], null, 2));

module.exports = mappings;
