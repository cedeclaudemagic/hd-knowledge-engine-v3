#!/usr/bin/env node
/**
 * Validate Numbered Cross Pattern
 *
 * Mathematical Formula: Numbered crosses (2, 3, 4) appear at 16-position
 * intervals on the wheel, representing the same archetypal energy at
 * 90-degree intervals (quarters of the wheel).
 *
 * Pattern:
 * - Number 2, 3, 4 are separated by exactly 16 wheel positions
 * - All numbered crosses are RAX type
 * - 16 positions = 64 ÷ 4 = quarter wheel = 90 degrees
 */

const fs = require('fs');
const path = require('path');

const sourceDataPath = path.join(__dirname, '../../../data/source/extracted/incarnation-crosses-extracted-data.json');
const sourceData = JSON.parse(fs.readFileSync(sourceDataPath, 'utf8'));

// Canonical wheel order
const WHEEL_ORDER = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
  27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
  28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
];

console.log('=== VALIDATING NUMBERED CROSS PATTERN ===\n');
console.log('Formula: Numbered crosses appear at 16-position intervals\n');

// Extract crosses with numbers
const numberedCrosses = [];
for (const name in sourceData.crosses) {
  const cross = sourceData.crosses[name];
  const match = name.match(/^(.+?)\s*(\d+)$/);
  if (match) {
    const baseName = match[1].trim();
    const number = parseInt(match[2]);
    const wheelPos = WHEEL_ORDER.indexOf(cross.personalitySun);

    numberedCrosses.push({
      fullName: name,
      baseName,
      number,
      gate: cross.personalitySun,
      type: cross.type,
      wheelPos
    });
  }
}

// Group by base name
const grouped = {};
numberedCrosses.forEach(c => {
  if (!grouped[c.baseName]) {
    grouped[c.baseName] = [];
  }
  grouped[c.baseName].push(c);
});

// Validate patterns
const results = {
  valid: [],
  errors: []
};

for (const baseName in grouped) {
  const instances = grouped[baseName].sort((a, b) => a.number - b.number);

  // Check 1: Type consistency - all instances should have same type
  const types = [...new Set(instances.map(c => c.type))];
  if (types.length > 1) {
    results.errors.push({
      baseName,
      error: 'Inconsistent types in numbered series',
      details: instances.map(c => `${c.fullName} is ${c.type}`)
    });
  }

  // Check 2: Wheel positions should be 16 apart
  if (instances.length > 1) {
    const gaps = [];
    for (let i = 1; i < instances.length; i++) {
      let gap = instances[i].wheelPos - instances[i - 1].wheelPos;

      // Handle wrap-around (if gap is negative, add 64)
      if (gap < 0) gap += 64;

      gaps.push(gap);
    }

    const invalidGaps = gaps.filter(g => g !== 16);
    if (invalidGaps.length > 0) {
      results.errors.push({
        baseName,
        error: 'Invalid wheel position gaps',
        expected: '16 positions between each',
        actual: gaps.join(', '),
        crosses: instances.map(c => `${c.number}: Gate ${c.gate} (pos ${c.wheelPos})`).join(', ')
      });
    } else {
      results.valid.push({
        baseName,
        instances: instances.length,
        gaps
      });
    }
  }
}

// Display results
console.log('=== VALIDATION RESULTS ===\n');

if (results.valid.length > 0) {
  console.log(`✓ Valid numbered cross patterns: ${results.valid.length}\n`);

  console.log('Sample valid patterns:');
  results.valid.slice(0, 5).forEach(v => {
    console.log(`  ${v.baseName}: ${v.instances} instances, gaps ${v.gaps.join(', ')}`);
  });
}

if (results.errors.length > 0) {
  console.log(`\n✗ Pattern violations: ${results.errors.length}\n`);

  results.errors.forEach(e => {
    console.log(`${e.baseName}:`);
    console.log(`  Error: ${e.error}`);
    if (e.details) {
      e.details.forEach(d => console.log(`    - ${d}`));
    }
    if (e.expected) {
      console.log(`  Expected: ${e.expected}`);
      console.log(`  Actual: ${e.actual}`);
      console.log(`  Crosses: ${e.crosses}`);
    }
    console.log('');
  });
}

// Mathematical insight
console.log('\n=== MATHEMATICAL PATTERNS ===\n');
console.log('Wheel Position Pattern:');
console.log('  • Numbered crosses appear at 16-position intervals');
console.log('  • 90-degree intervals (16 ÷ 64 = 1/4 = 90°)');
console.log('  • Quarters of the wheel');
console.log('');
console.log('Gate Value Patterns:');
console.log('  • LAX numbered series: Base and "_2" have mirrored values');
console.log('    - PS ↔ PE swapped');
console.log('    - DS ↔ DE swapped');
console.log('    Example: Clarion (51/57-61/62) vs Clarion 2 (57/51-62/61)');
console.log('');
console.log('  • RAX numbered series: Gates rotate through positions 2, 3, 4');
console.log('    - Four gates cycle through all four positions (PS/PE/DS/DE)');
console.log('    Example: Eden (36/6-11/12) → Eden 2 (12/11-36/6) → etc.');

console.log('\n=== SUMMARY ===');
console.log(`Total numbered cross families: ${Object.keys(grouped).length}`);
console.log(`Valid patterns: ${results.valid.length}`);
console.log(`Invalid patterns: ${results.errors.length}`);

if (results.errors.length === 0) {
  console.log('\n✅ ALL NUMBERED CROSSES FOLLOW MATHEMATICAL PATTERN');
  process.exit(0);
} else {
  console.log('\n⚠️ PATTERN VIOLATIONS FOUND');
  process.exit(1);
}
