#!/usr/bin/env node

/**
 * Transform ORIGINAL gate files into Traditional HD Gates mappings
 *
 * CRITICAL: This reads from data/source/gates/gate-*.json (64 individual files)
 * NOT from the merged file, to preserve ALL original data including:
 * - Multiple planets per exaltation/detriment
 * - Lines with no planets (null cases)
 * - Full Black Book and White Book interpretations
 *
 * Architecture Decision: ALWAYS use arrays for planets, even single planets.
 * This provides consistent structure for querying.
 */

const fs = require('fs');
const path = require('path');

console.log('📖 Reading ORIGINAL gate files from: data/source/gates/');
console.log('   (Preserving multi-planet data and all edge cases)');
console.log('');

const gatesDir = path.join(__dirname, '../../data/source/gates');
const outputFile = path.join(__dirname, 'mappings/hd-gates-mappings.json');

// Also load merged file for White Book data
const mergedFile = path.join(__dirname, '../../data/source/lines/merged-lines-with-positioning.json');
const mergedData = JSON.parse(fs.readFileSync(mergedFile, 'utf8'));

// Create index for quick White Book lookup
const whiteBookIndex = {};
mergedData.gates.forEach(gateObj => {
  const gateNum = parseInt(Object.keys(gateObj)[0]);
  const gateData = gateObj[gateNum];

  if (gateData && gateData.lines) {
    gateData.lines.forEach(lineObj => {
      const lineNum = parseInt(Object.keys(lineObj)[0]);
      const lineData = lineObj[lineNum];
      const key = `${gateNum}.${lineNum}`;
      whiteBookIndex[key] = lineData;
    });
  }
});

const mappings = [];
let totalLines = 0;
let multiPlanetCount = 0;
let noPlanetCount = 0;

// Process each gate file
for (let gateNum = 1; gateNum <= 64; gateNum++) {
  const filePath = path.join(gatesDir, `gate-${gateNum}.json`);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Gate ${gateNum} file not found, skipping`);
    continue;
  }

  const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const gateData = fileData[gateNum.toString()];

  if (!gateData) {
    console.warn(`⚠️  Gate ${gateNum} data invalid, skipping`);
    continue;
  }

  // Process each line (6 per gate)
  if (!gateData.lines || gateData.lines.length !== 6) {
    console.warn(`⚠️  Gate ${gateNum} has ${gateData.lines?.length || 0} lines instead of 6`);
  }

  (gateData.lines || []).forEach(line => {
    const lineNum = line.number;
    const whiteBookKey = `${gateNum}.${lineNum}`;
    const whiteBookData = whiteBookIndex[whiteBookKey];

    // Process exaltation - handle multiple planets, single planet, or no planet
    let exaltation = { planets: [] };

    if (line.exaltation) {
      if (Array.isArray(line.exaltation.planets)) {
        // Multiple planets case
        exaltation.planets = line.exaltation.planets.map(p => ({
          planet: p.planet,
          description: {
            blackBook: p.description || null,
            whiteBook: whiteBookData?.exaltation?.description?.whiteBook || null
          }
        }));
        multiPlanetCount++;
      } else if (line.exaltation.planet && line.exaltation.planet !== 'None') {
        // Single planet case
        exaltation.planets = [{
          planet: line.exaltation.planet,
          description: {
            blackBook: line.exaltation.description || null,
            whiteBook: whiteBookData?.exaltation?.description?.whiteBook || null
          }
        }];
      } else {
        // No planet case (explicitly marked as None or missing)
        exaltation.planets = [];
        noPlanetCount++;
      }
    } else {
      // Exaltation section missing entirely
      exaltation.planets = [];
      noPlanetCount++;
    }

    // Process detriment - handle multiple planets, single planet, or no planet
    let detriment = { planets: [] };

    if (line.detriment) {
      if (Array.isArray(line.detriment.planets)) {
        // Multiple planets case
        detriment.planets = line.detriment.planets.map(p => ({
          planet: p.planet,
          description: {
            blackBook: p.description || null,
            whiteBook: whiteBookData?.detriment?.description?.whiteBook || null
          }
        }));
        multiPlanetCount++;
      } else if (line.detriment.planet && line.detriment.planet !== 'None') {
        // Single planet case
        detriment.planets = [{
          planet: line.detriment.planet,
          description: {
            blackBook: line.detriment.description || null,
            whiteBook: whiteBookData?.detriment?.description?.whiteBook || null
          }
        }];
      } else {
        // No planet case (explicitly marked as None or missing)
        detriment.planets = [];
        noPlanetCount++;
      }
    } else {
      // Detriment section missing entirely
      detriment.planets = [];
      noPlanetCount++;
    }

    // Create mapping entry with COMPLETE data
    const mapping = {
      gateNumber: gateNum,
      lineNumber: lineNum,
      knowledge: {
        gateName: gateData.name,
        gateKeyword: gateData.keyword || null,
        lineKeynote: line.keynote,
        polarity: whiteBookData?.polarity || null,
        blackBook: {
          exaltation: exaltation,
          detriment: detriment
        },
        whiteBook: {
          // White Book has same planets, different descriptions (already integrated above)
          exaltation: exaltation,
          detriment: detriment
        }
      }
    };

    mappings.push(mapping);
    totalLines++;
  });
}

// Sort by gate number, then line number
mappings.sort((a, b) => {
  if (a.gateNumber !== b.gateNumber) {
    return a.gateNumber - b.gateNumber;
  }
  return a.lineNumber - b.lineNumber;
});

// Create output structure
const output = {
  systemName: "Traditional Human Design Gates",
  version: "2.0.0",
  description: "Complete Black Book and White Book gate and line interpretations with full planetary assignments. Supports multiple planets per exaltation/detriment.",
  completeness: "full",
  architecture: "array-based-planets",
  totalGates: 64,
  totalLines: totalLines,
  linesPerGate: 6,
  expectedTotal: 384,
  dataIntegrity: {
    multiPlanetLines: multiPlanetCount,
    noPlanetCases: noPlanetCount,
    sourceFiles: "data/source/gates/gate-*.json (64 original files)"
  },
  generatedAt: new Date().toISOString(),
  mappings: mappings
};

// Validate completeness
if (totalLines !== 384) {
  console.error(`❌ ERROR: Expected 384 lines, but got ${totalLines}`);
  process.exit(1);
}

// Write output
console.log(`\n📝 Writing ${totalLines} line mappings to:`, outputFile);
fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');

console.log('\n✅ Mapping file created successfully!');
console.log(`   Total Gates: ${output.totalGates}`);
console.log(`   Total Lines: ${output.totalLines}`);
console.log(`   Expected: ${output.expectedTotal}`);
console.log(`   Status: ${totalLines === 384 ? '✅ COMPLETE' : '❌ INCOMPLETE'}`);

// Data integrity report
console.log(`\n📊 Data Integrity:`);
console.log(`   Lines with multiple planets: ${multiPlanetCount}`);
console.log(`   Lines with no planets: ${noPlanetCount}`);
console.log(`   Architecture: Array-based (consistent structure)`);

// Quick validation
const gateCount = new Set(mappings.map(m => m.gateNumber)).size;
const linesPerGateCheck = mappings.reduce((acc, m) => {
  acc[m.gateNumber] = (acc[m.gateNumber] || 0) + 1;
  return acc;
}, {});

console.log(`\n📋 Validation:`);
console.log(`   Unique Gates: ${gateCount}/64`);

const incompleteGates = Object.entries(linesPerGateCheck)
  .filter(([_, count]) => count !== 6)
  .map(([gate, count]) => `Gate ${gate} has ${count} lines`);

if (incompleteGates.length > 0) {
  console.warn(`\n⚠️  Incomplete gates found:`);
  incompleteGates.forEach(msg => console.warn(`   ${msg}`));
} else {
  console.log(`   All gates have 6 lines: ✅`);
}

// Verify multi-planet capture
console.log(`\n🎯 Critical Data Verification:`);
const gate11_4 = mappings.find(m => m.gateNumber === 11 && m.lineNumber === 4);
const gate25_4 = mappings.find(m => m.gateNumber === 25 && m.lineNumber === 4);

if (gate11_4) {
  const planetCount = gate11_4.knowledge.blackBook.exaltation.planets.length;
  const planets = gate11_4.knowledge.blackBook.exaltation.planets.map(p => p.planet).join(', ');
  console.log(`   Gate 11.4 exalted planets: ${planets} (${planetCount} planets)`);
  if (planetCount < 2) {
    console.error(`   ❌ ERROR: Gate 11.4 should have Moon AND Venus!`);
  } else {
    console.log(`   ✅ Correctly captured multiple planets`);
  }
}

if (gate25_4) {
  const planetCount = gate25_4.knowledge.blackBook.exaltation.planets.length;
  const planets = gate25_4.knowledge.blackBook.exaltation.planets.map(p => p.planet).join(', ');
  console.log(`   Gate 25.4 exalted planets: ${planets} (${planetCount} planets)`);
  if (planetCount < 2) {
    console.error(`   ❌ ERROR: Gate 25.4 should have Venus AND Jupiter!`);
  } else {
    console.log(`   ✅ Correctly captured multiple planets`);
  }
}

console.log('');
process.exit(0);
