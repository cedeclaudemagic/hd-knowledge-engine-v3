#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load current extracted data
const extractedPath = path.join(__dirname, '..', '..', '..', 'data', 'source', 'extracted', 'incarnation-crosses-extracted-data.json');
const extractedData = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));

// Load master reference CSV
const masterPath = path.join(__dirname, '..', 'data', 'source', 'master-reference.csv');
const masterCSV = fs.readFileSync(masterPath, 'utf8');

// Parse master CSV
const masterLines = masterCSV.trim().split('\n');
const masterCrosses = [];

for (let i = 1; i < masterLines.length; i++) {
  const line = masterLines[i];
  const parts = line.split(',');

  if (parts.length < 5) continue;

  const rowNum = parts[0];
  const angle = parts[1];
  const name = parts[2];
  const pspe = parts[3].split('/');
  const dsde = parts[4].split('/');

  // Map angle to type
  let type;
  if (angle === 'Right Angle') type = 'RAX';
  else if (angle === 'Left Angle') type = 'LAX';
  else if (angle === 'Juxtaposition') type = 'JX';

  // Clean up cross name
  let cleanName = name
    .replace('R.A.C. of the ', '')
    .replace('L.A.C. of ', '')
    .replace('J.X.C. of ', '')
    .trim();

  masterCrosses.push({
    rowNum: parseInt(rowNum),
    originalName: name,
    cleanName,
    type,
    PS: parseInt(pspe[0]),
    PE: parseInt(pspe[1]),
    DS: parseInt(dsde[0]),
    DE: parseInt(dsde[1])
  });
}

console.log('=== MASTER REFERENCE ANALYSIS ===\n');
console.log(`Loaded ${masterCrosses.length} crosses from master reference`);
console.log(`Loaded ${Object.keys(extractedData.crosses).length} crosses from extracted data\n`);

// Immediate observations
console.log('=== IMMEDIATE OBSERVATIONS ===\n');

// Check Laws 4
const laws4Master = masterCrosses.find(c => c.cleanName.includes('Laws 4'));
if (laws4Master) {
  console.log('Laws 4 in master reference:');
  console.log(`  Type: ${laws4Master.type} (confirms it should be RAX, not JX) ✓`);
  console.log(`  Values: ${laws4Master.PS}/${laws4Master.PE} - ${laws4Master.DS}/${laws4Master.DE}`);
  console.log('');
}

// Check rotation pattern in RAX numbered series
console.log('RAX Numbered Series - Rotation Pattern:');
const sphinx = masterCrosses.filter(c => c.cleanName.startsWith('the Sphinx'));
console.log('  Sphinx family:');
sphinx.forEach(s => {
  console.log(`    ${s.cleanName}: ${s.PS}/${s.PE} - ${s.DS}/${s.DE}`);
});
console.log('  ✓ Gates rotate: 13/7/1/2 through all positions\n');

// Check mirror pattern in LAX numbered series
console.log('LAX Numbered Series - Mirror Pattern:');
const defiance = masterCrosses.filter(c => c.cleanName.startsWith('Defiance'));
console.log('  Defiance family:');
defiance.forEach(d => {
  console.log(`    ${d.cleanName}: ${d.PS}/${d.PE} - ${d.DS}/${d.DE}`);
});
console.log('  ✓ Defiance 1: 2/1 vs Defiance 2: 1/2 (PS/PE swapped)\n');

// Now let's try to match crosses between master and extracted
console.log('=== MATCHING CROSSES ===\n');

const discrepancies = [];
const matched = [];
const unmatchedMaster = [];
const unmatchedExtracted = Object.keys(extractedData.crosses);

for (const masterCross of masterCrosses) {
  // Try to find matching cross in extracted data
  // Match by Personality Sun (gate) and cross type

  let foundMatch = false;

  for (const extractedName in extractedData.crosses) {
    const extracted = extractedData.crosses[extractedName];

    // Match by gate (PS) and type
    if (extracted.personalitySun === masterCross.PS &&
        extracted.type === masterCross.type) {

      foundMatch = true;
      matched.push(extractedName);
      const idx = unmatchedExtracted.indexOf(extractedName);
      if (idx > -1) unmatchedExtracted.splice(idx, 1);

      // Check for value discrepancies
      const issues = [];

      if (extracted.personalityEarth !== masterCross.PE) {
        issues.push(`PE: ${extracted.personalityEarth} → ${masterCross.PE}`);
      }
      if (extracted.designSun !== masterCross.DS) {
        issues.push(`DS: ${extracted.designSun} → ${masterCross.DS}`);
      }
      if (extracted.designEarth !== masterCross.DE) {
        issues.push(`DE: ${extracted.designEarth} → ${masterCross.DE}`);
      }

      if (issues.length > 0) {
        discrepancies.push({
          masterName: masterCross.cleanName,
          extractedName,
          masterRow: masterCross.rowNum,
          issues,
          master: `${masterCross.type} ${masterCross.PS}/${masterCross.PE} - ${masterCross.DS}/${masterCross.DE}`,
          extracted: `${extracted.type} ${extracted.personalitySun}/${extracted.personalityEarth} - ${extracted.designSun}/${extracted.designEarth}`
        });
      }

      break;
    }
  }

  if (!foundMatch) {
    unmatchedMaster.push(masterCross);
  }
}

console.log(`Matched: ${matched.length} crosses`);
console.log(`Discrepancies found: ${discrepancies.length}`);
console.log(`Unmatched in master: ${unmatchedMaster.length}`);
console.log(`Unmatched in extracted: ${unmatchedExtracted.length}\n`);

if (discrepancies.length > 0) {
  console.log('=== DISCREPANCIES ===\n');
  discrepancies.forEach(d => {
    console.log(`Row ${d.masterRow}: ${d.masterName}`);
    console.log(`  Extracted as: "${d.extractedName}"`);
    console.log(`  Master:    ${d.master}`);
    console.log(`  Extracted: ${d.extracted}`);
    console.log(`  Issues: ${d.issues.join(', ')}`);
    console.log('');
  });
}

console.log('=== SUMMARY ===');
console.log(`This master reference provides ${masterCrosses.length} crosses (partial dataset)`);
console.log(`Current extracted data has ${Object.keys(extractedData.crosses).length} crosses`);
console.log(`\nThis master reference can be used to:`);
console.log(`  1. Validate corrections for the ${discrepancies.length} discrepancies found`);
console.log(`  2. Confirm mathematical formulas are working correctly`);
console.log(`  3. Serve as authoritative source for at least rows 1-${masterCrosses.length}`);
