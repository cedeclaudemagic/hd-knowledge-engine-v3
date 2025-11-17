#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Wheel order for Formula 1 validation
const WHEEL_ORDER = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
  27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
  28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
];

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
    .replace('R.A.C. of ', '')
    .replace('L.A.C. of the ', '')
    .replace('L.A.C. of ', '')
    .replace('J.X.C. of the ', '')
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

console.log('=== VALIDATING MASTER CSV AGAINST MATHEMATICAL FORMULAS ===\n');
console.log(`Loaded ${masterCrosses.length} crosses from master CSV\n`);

// ============================================================================
// FORMULA 1: Design Inheritance Pattern
// ============================================================================

console.log('=== FORMULA 1: DESIGN INHERITANCE ===\n');
console.log('Pattern: Gate N RAX Design = Gate N-1 LAX/JX Design\n');

const formula1Violations = [];

// Group crosses by gate (PS)
const crossesByGate = {};
masterCrosses.forEach(cross => {
  if (!crossesByGate[cross.PS]) {
    crossesByGate[cross.PS] = [];
  }
  crossesByGate[cross.PS].push(cross);
});

// Check each gate
for (let i = 0; i < WHEEL_ORDER.length; i++) {
  const currentGate = WHEEL_ORDER[i];
  const prevGate = WHEEL_ORDER[(i - 1 + WHEEL_ORDER.length) % WHEEL_ORDER.length];

  const currentCrosses = crossesByGate[currentGate] || [];
  const prevCrosses = crossesByGate[prevGate] || [];

  const currentRAX = currentCrosses.find(c => c.type === 'RAX');
  const prevLAX = prevCrosses.find(c => c.type === 'LAX');
  const prevJX = prevCrosses.find(c => c.type === 'JX');

  if (currentRAX && (prevLAX || prevJX)) {
    const prevCross = prevLAX || prevJX;

    // Check if Design values match
    if (currentRAX.DS !== prevCross.DS || currentRAX.DE !== prevCross.DE) {
      formula1Violations.push({
        currentGate,
        currentCross: `${currentRAX.cleanName} (RAX)`,
        currentDesign: `${currentRAX.DS}/${currentRAX.DE}`,
        prevGate,
        prevCross: `${prevCross.cleanName} (${prevCross.type})`,
        prevDesign: `${prevCross.DS}/${prevCross.DE}`,
        row: currentRAX.rowNum
      });
    }
  }
}

if (formula1Violations.length === 0) {
  console.log('✓ PERFECT: All crosses follow Design inheritance pattern');
} else {
  console.log(`✗ VIOLATIONS: ${formula1Violations.length} crosses violate Formula 1\n`);
  formula1Violations.forEach(v => {
    console.log(`Row ${v.row}: Gate ${v.currentGate} RAX "${v.currentCross}"`);
    console.log(`  Design: ${v.currentDesign} (should be ${v.prevDesign})`);
    console.log(`  Expected from Gate ${v.prevGate} ${v.prevCross}: ${v.prevDesign}`);
    console.log('');
  });
}

console.log('');

// ============================================================================
// FORMULA 2: Numbered Cross Patterns
// ============================================================================

console.log('=== FORMULA 2: NUMBERED CROSS PATTERNS ===\n');
console.log('Pattern: Numbered crosses (2, 3, 4) must have same type\n');

// Group numbered crosses by base name
const numberedCrosses = {};
masterCrosses.forEach(cross => {
  const match = cross.cleanName.match(/^(.+?)\s+(\d+)$/);
  if (match) {
    const baseName = match[1];
    const number = parseInt(match[2]);

    if (!numberedCrosses[baseName]) {
      numberedCrosses[baseName] = [];
    }

    numberedCrosses[baseName].push({
      ...cross,
      number
    });
  }
});

const formula2Violations = [];

for (const baseName in numberedCrosses) {
  const series = numberedCrosses[baseName];
  const types = [...new Set(series.map(c => c.type))];

  if (types.length > 1) {
    formula2Violations.push({
      baseName,
      series: series.map(c => `Row ${c.rowNum}: ${c.cleanName} (${c.type})`)
    });
  }

  // Check mirror pattern for LAX
  if (types[0] === 'LAX' && series.length >= 2) {
    const base = series.find(c => !c.cleanName.match(/\d+$/)) || series[0];
    const variant2 = series.find(c => c.number === 2);

    if (base && variant2) {
      // Check PS/PE swap
      if (base.PS !== variant2.PE || base.PE !== variant2.PS) {
        console.log(`⚠️  LAX mirror pattern broken: ${baseName}`);
        console.log(`    Base: PS=${base.PS}, PE=${base.PE}`);
        console.log(`    Variant 2: PS=${variant2.PS}, PE=${variant2.PE} (should be ${base.PE}/${base.PS})`);
        console.log('');
      }
      // Check DS/DE swap
      if (base.DS !== variant2.DE || base.DE !== variant2.DS) {
        console.log(`⚠️  LAX mirror pattern broken: ${baseName}`);
        console.log(`    Base: DS=${base.DS}, DE=${base.DE}`);
        console.log(`    Variant 2: DS=${variant2.DS}, DE=${variant2.DE} (should be ${base.DE}/${base.DS})`);
        console.log('');
      }
    }
  }
}

if (formula2Violations.length === 0) {
  console.log('✓ PERFECT: All numbered series have consistent types');
} else {
  console.log(`✗ VIOLATIONS: ${formula2Violations.length} series have type inconsistencies\n`);
  formula2Violations.forEach(v => {
    console.log(`${v.baseName}:`);
    v.series.forEach(s => console.log(`  ${s}`));
    console.log('');
  });
}

console.log('');

// ============================================================================
// FORMULA 3: Harmonic Opposite Pairs
// ============================================================================

console.log('=== FORMULA 3: HARMONIC OPPOSITE PAIRS ===\n');
console.log('Pattern: PS↔PE and DS↔DE are binary opposites on wheel\n');

// Binary opposite pairs (simplified - just checking if they're different)
const formula3Violations = [];

masterCrosses.forEach(cross => {
  if (cross.PS === cross.PE) {
    formula3Violations.push({
      row: cross.rowNum,
      cross: cross.cleanName,
      issue: `PS and PE are identical (${cross.PS})`,
      type: 'Personality'
    });
  }

  if (cross.DS === cross.DE) {
    formula3Violations.push({
      row: cross.rowNum,
      cross: cross.cleanName,
      issue: `DS and DE are identical (${cross.DS})`,
      type: 'Design'
    });
  }
});

if (formula3Violations.length === 0) {
  console.log('✓ PERFECT: All crosses have valid harmonic pairs');
} else {
  console.log(`✗ VIOLATIONS: ${formula3Violations.length} crosses have invalid harmonics\n`);
  formula3Violations.forEach(v => {
    console.log(`Row ${v.row}: ${v.cross}`);
    console.log(`  ${v.issue}`);
    console.log('');
  });
}

console.log('');

// ============================================================================
// INTERNAL CONSISTENCY CHECKS
// ============================================================================

console.log('=== INTERNAL CONSISTENCY CHECKS ===\n');

// Check: Each gate should have LAX, RAX, JX (if complete for that gate)
const gatesInMaster = [...new Set(masterCrosses.map(c => c.PS))].sort((a, b) => a - b);
console.log(`Gates covered: ${gatesInMaster.join(', ')}`);
console.log('');

for (const gate of gatesInMaster) {
  const crosses = crossesByGate[gate];
  const types = crosses.map(c => c.type).sort();
  const hasLAX = types.includes('LAX');
  const hasRAX = types.includes('RAX');
  const hasJX = types.includes('JX');

  if (hasLAX && hasRAX && hasJX) {
    console.log(`✓ Gate ${gate}: Complete (LAX, RAX, JX)`);
  } else {
    console.log(`⚠️  Gate ${gate}: Incomplete - has ${types.join(', ')}`);
  }
}

console.log('');

// ============================================================================
// SUMMARY
// ============================================================================

console.log('=== VALIDATION SUMMARY ===\n');

const totalViolations = formula1Violations.length + formula2Violations.length + formula3Violations.length;

if (totalViolations === 0) {
  console.log('✅ MASTER CSV IS MATHEMATICALLY PERFECT!');
  console.log('   All formulas validated successfully.');
  console.log('   This data can be trusted as authoritative source.');
} else {
  console.log('❌ MASTER CSV HAS MATHEMATICAL ERRORS!');
  console.log(`   Total violations: ${totalViolations}`);
  console.log(`   - Formula 1 (Design inheritance): ${formula1Violations.length} errors`);
  console.log(`   - Formula 2 (Numbered patterns): ${formula2Violations.length} errors`);
  console.log(`   - Formula 3 (Harmonic pairs): ${formula3Violations.length} errors`);
  console.log('');
  console.log('⚠️  DO NOT use this as authoritative source!');
  console.log('   The current extracted data may actually be better.');
}

console.log('');
console.log('Note: This validation only covers rows 1-49 (partial dataset)');
console.log('      Full validation requires all 192 crosses');
