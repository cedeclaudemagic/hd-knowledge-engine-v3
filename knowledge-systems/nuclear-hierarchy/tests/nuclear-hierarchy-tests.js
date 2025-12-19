/**
 * Nuclear Hierarchy Knowledge System Tests
 * 
 * Verifies data integrity and completeness of the nuclear hierarchy mappings.
 */

const fs = require('fs');
const path = require('path');

const mappingsPath = path.join(__dirname, '../mappings/nuclear-hierarchy-mappings.json');
const hierarchy = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

let passed = 0;
let failed = 0;

function test(name, condition) {
  if (condition) {
    console.log(`✓ ${name}`);
    passed++;
  } else {
    console.log(`✗ ${name}`);
    failed++;
  }
}

console.log('\n=== Nuclear Hierarchy Tests ===\n');

// Test 1: All 64 gates present
test('All 64 gates present in gateMappings', 
  hierarchy.gateMappings.length === 64);

// Test 2: Gate numbers 1-64
const gateNumbers = hierarchy.gateMappings.map(g => g.gate).sort((a, b) => a - b);
const expected = Array.from({length: 64}, (_, i) => i + 1);
test('Gate numbers are 1-64',
  JSON.stringify(gateNumbers) === JSON.stringify(expected));

// Test 3: Exactly 4 Pillars
test('Exactly 4 Pillars',
  hierarchy.hierarchy.pillars.length === 4);

// Test 4: Exactly 12 Mysteries
test('Exactly 12 Mysteries',
  hierarchy.hierarchy.mysteries.length === 12);

// Test 5: Pillar gates are 1, 2, 63, 64
const pillarGates = hierarchy.hierarchy.pillars.map(p => p.gate).sort((a, b) => a - b);
test('Pillar gates are [1, 2, 63, 64]',
  JSON.stringify(pillarGates) === JSON.stringify([1, 2, 63, 64]));

// Test 6: Each Mystery has exactly 4 Letters
const allMysteriesHave4Letters = hierarchy.hierarchy.mysteries.every(m => m.letters.length === 4);
test('Each Mystery has exactly 4 Letters',
  allMysteriesHave4Letters);

// Test 7: Total Letters = 48
const totalLetters = hierarchy.hierarchy.mysteries.reduce((sum, m) => sum + m.letters.length, 0);
test('Total Letters = 48',
  totalLetters === 48);

// Test 8: 4 Pillars + 12 Mysteries + 48 Letters = 64
const levelCounts = {
  pillar: hierarchy.gateMappings.filter(g => g.level === 'pillar').length,
  mystery: hierarchy.gateMappings.filter(g => g.level === 'mystery').length,
  letter: hierarchy.gateMappings.filter(g => g.level === 'letter').length
};
test('Level distribution: 4 Pillars + 12 Mysteries + 48 Letters = 64',
  levelCounts.pillar === 4 && levelCounts.mystery === 12 && levelCounts.letter === 48);

// Test 9: Standing waves count = 8
const standingWaves = hierarchy.gateMappings.filter(g => g.gateType === 'standing-wave');
test('Exactly 8 standing wave gates',
  standingWaves.length === 8);

// Test 10: Each Pillar has exactly 2 standing waves
const standingWavesByPillar = {
  1: standingWaves.filter(g => g.pillar === 1).length,
  2: standingWaves.filter(g => g.pillar === 2).length,
  63: standingWaves.filter(g => g.pillar === 63).length,
  64: standingWaves.filter(g => g.pillar === 64).length
};
test('Each Pillar has exactly 2 standing waves',
  standingWavesByPillar[1] === 2 && 
  standingWavesByPillar[2] === 2 && 
  standingWavesByPillar[63] === 2 && 
  standingWavesByPillar[64] === 2);

// Test 11: Standing waves have matching inner/outer positions
const standingWavesMatch = standingWaves.every(g => g.innerPosition === g.outerPosition);
test('Standing wave gates have matching inner/outer positions',
  standingWavesMatch);

// Test 12: All gates have valid gateType
const validGateTypes = ['standing-wave', 'cross-zero-manifesting', 'cross-zero-dematerialising', 'same-side-void', 'same-side-material'];
const allValidTypes = hierarchy.gateMappings.every(g => validGateTypes.includes(g.gateType));
test('All gates have valid gateType',
  allValidTypes);

// Test 13: Cross-zero gates have opposite-sign inner/outer positions
const crossZeroGates = hierarchy.gateMappings.filter(g => g.gateType.startsWith('cross-zero'));
const crossZeroCorrect = crossZeroGates.every(g => 
  (g.innerPosition > 0 && g.outerPosition < 0) || 
  (g.innerPosition < 0 && g.outerPosition > 0)
);
test('Cross-zero gates have opposite-sign positions',
  crossZeroCorrect);

// Test 14: Same-side void gates have both negative positions
const sameSideVoid = hierarchy.gateMappings.filter(g => g.gateType === 'same-side-void');
const voidCorrect = sameSideVoid.every(g => g.innerPosition < 0 && g.outerPosition < 0);
test('Same-side void gates have both negative positions',
  voidCorrect);

// Test 15: Same-side material gates have both positive positions
const sameSideMaterial = hierarchy.gateMappings.filter(g => g.gateType === 'same-side-material');
const materialCorrect = sameSideMaterial.every(g => g.innerPosition > 0 && g.outerPosition > 0);
test('Same-side material gates have both positive positions',
  materialCorrect);

// Test 16: All Letters have a Mystery parent
const letters = hierarchy.gateMappings.filter(g => g.level === 'letter');
const allLettersHaveMystery = letters.every(g => g.mystery !== null);
test('All Letters have a Mystery parent',
  allLettersHaveMystery);

// Test 17: No duplicate gates in any Mystery's letters
const lettersByMystery = {};
hierarchy.hierarchy.mysteries.forEach(m => {
  lettersByMystery[m.gate] = m.letters;
});
const allLetters = Object.values(lettersByMystery).flat();
const uniqueLetters = [...new Set(allLetters)];
test('No duplicate gates across Mystery letters',
  allLetters.length === uniqueLetters.length);

// Test 18: All Elements assigned
const allHaveElement = hierarchy.gateMappings.every(g => ['Fire', 'Water', 'Truth', 'Light'].includes(g.element));
test('All gates have valid element',
  allHaveElement);

// Summary
console.log('\n=== Summary ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total:  ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
