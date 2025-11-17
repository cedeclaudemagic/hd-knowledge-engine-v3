#!/usr/bin/env node
/**
 * Validate Incarnation Crosses Against Mathematical Wheel Pattern
 *
 * Mathematical Formula:
 * Gate N RAX has same Design Sun/Earth as Gate N-1 LAX and JX
 *
 * This validates that all crosses follow the mathematical pattern based
 * on the wheel sequence, which is a FORMULA, not arbitrary assignment.
 */

const fs = require('fs');
const path = require('path');

// Load source data
const sourceDataPath = path.join(__dirname, '../../../data/source/extracted/incarnation-crosses-extracted-data.json');
const sourceData = JSON.parse(fs.readFileSync(sourceDataPath, 'utf8'));

// Canonical wheel order (starting from Gate 41)
const WHEEL_ORDER = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
  27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
  28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
];

console.log('=== INCARNATION CROSSES MATHEMATICAL PATTERN VALIDATION ===\n');
console.log('Formula: Gate N RAX Design = Gate N-1 LAX/JX Design\n');

const results = {
  valid: [],
  errors: [],
  missing: []
};

// Validate each gate's RAX against previous gate's LAX/JX
for (let i = 0; i < WHEEL_ORDER.length; i++) {
  const currentGate = WHEEL_ORDER[i];
  const prevGate = WHEEL_ORDER[(i - 1 + WHEEL_ORDER.length) % WHEEL_ORDER.length];

  // Find crosses
  let currentRAX = null;
  let prevLAX = null;
  let prevJX = null;

  for (const crossName in sourceData.crosses) {
    const cross = sourceData.crosses[crossName];
    if (cross.personalitySun === currentGate && cross.type === 'RAX') {
      currentRAX = { name: crossName, ...cross };
    }
    if (cross.personalitySun === prevGate && cross.type === 'LAX') {
      prevLAX = { name: crossName, ...cross };
    }
    if (cross.personalitySun === prevGate && cross.type === 'JX') {
      prevJX = { name: crossName, ...cross };
    }
  }

  // Check if all crosses exist
  if (!currentRAX) {
    results.missing.push({
      type: 'Missing RAX',
      gate: currentGate,
      message: `Gate ${currentGate} missing RAX cross`
    });
    continue;
  }

  if (!prevLAX) {
    results.missing.push({
      type: 'Missing LAX',
      gate: prevGate,
      message: `Gate ${prevGate} missing LAX cross`
    });
    continue;
  }

  if (!prevJX) {
    results.missing.push({
      type: 'Missing JX',
      gate: prevGate,
      message: `Gate ${prevGate} missing JX cross`
    });
    continue;
  }

  // Validate pattern
  const raxDS = currentRAX.designSun;
  const raxDE = currentRAX.designEarth;
  const laxDS = prevLAX.designSun;
  const laxDE = prevLAX.designEarth;
  const jxDS = prevJX.designSun;
  const jxDE = prevJX.designEarth;

  const laxMatch = raxDS === laxDS && raxDE === laxDE;
  const jxMatch = raxDS === jxDS && raxDE === jxDE;
  const laxJxMatch = laxDS === jxDS && laxDE === jxDE;

  if (laxMatch && jxMatch) {
    results.valid.push({
      currentGate,
      prevGate,
      ds: raxDS,
      de: raxDE,
      crosses: {
        rax: currentRAX.name,
        lax: prevLAX.name,
        jx: prevJX.name
      }
    });
  } else {
    results.errors.push({
      currentGate,
      prevGate,
      expected: { ds: raxDS, de: raxDE },
      actualLAX: { ds: laxDS, de: laxDE },
      actualJX: { ds: jxDS, de: jxDE },
      laxMatch,
      jxMatch,
      laxJxMatch,
      crosses: {
        rax: currentRAX.name,
        lax: prevLAX.name,
        jx: prevJX.name
      }
    });
  }
}

// Display results
console.log('=== VALIDATION RESULTS ===\n');
console.log(`✓ Valid: ${results.valid.length}`);
console.log(`✗ Errors: ${results.errors.length}`);
console.log(`⚠ Missing: ${results.missing.length}`);

if (results.errors.length > 0) {
  console.log('\n=== ERRORS (Pattern Violations) ===\n');

  results.errors.forEach((error, index) => {
    console.log(`${index + 1}. Gate ${error.currentGate} RAX (${error.crosses.rax})`);
    console.log(`   vs Gate ${error.prevGate} LAX/JX (${error.crosses.lax} / ${error.crosses.jx})`);
    console.log(`   RAX has: DS=${error.expected.ds}, DE=${error.expected.de}`);
    console.log(`   LAX has: DS=${error.actualLAX.ds}, DE=${error.actualLAX.de} ${error.laxMatch ? '✓' : '✗'}`);
    console.log(`   JX has:  DS=${error.actualJX.ds}, DE=${error.actualJX.de} ${error.jxMatch ? '✓' : '✗'}`);

    if (!error.laxMatch && !error.jxMatch && error.laxJxMatch) {
      console.log(`   → FIX: Gate ${error.prevGate} LAX/JX should have DS=${error.expected.ds}, DE=${error.expected.de}`);
    } else if (error.laxMatch && !error.jxMatch) {
      console.log(`   → FIX: Gate ${error.prevGate} JX should have DS=${error.expected.ds}, DE=${error.expected.de}`);
    } else if (!error.laxMatch && error.jxMatch) {
      console.log(`   → FIX: Gate ${error.prevGate} LAX should have DS=${error.expected.ds}, DE=${error.expected.de}`);
    } else {
      console.log(`   → FIX NEEDED: Pattern broken, manual verification required`);
    }
    console.log('');
  });
}

if (results.missing.length > 0) {
  console.log('\n=== MISSING CROSSES ===\n');
  results.missing.forEach((missing, index) => {
    console.log(`${index + 1}. ${missing.message}`);
  });
}

console.log('\n=== SUMMARY ===');
const totalValidatable = results.valid.length + results.errors.length;
const percentValid = totalValidatable > 0 ? Math.round((results.valid.length / totalValidatable) * 100) : 0;
console.log(`Pattern adherence: ${percentValid}% (${results.valid.length}/${totalValidatable})`);
console.log(`Missing crosses prevent full validation: ${results.missing.length} gaps`);

if (results.errors.length === 0 && results.missing.length === 0) {
  console.log('\n✅ ALL CROSSES FOLLOW MATHEMATICAL PATTERN!');
  process.exit(0);
} else {
  console.log(`\n⚠️ ${results.errors.length} crosses violate the pattern`);
  process.exit(1);
}
