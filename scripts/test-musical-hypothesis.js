/**
 * Musical Scale Hypothesis Test
 *
 * Standing waves are how music works - vibrating strings produce harmonics.
 * The 8 positions could map to an octave.
 *
 * Historical "Music of the Spheres" mappings:
 * - Pythagoras, Kepler, and medieval traditions all assigned planets to notes
 * - Different systems exist, but all assume planetary-musical correspondence
 *
 * Test: Do standing wave planetary assignments follow musical/harmonic patterns?
 */

// ═══════════════════════════════════════════════════════════════════════════
// MUSICAL MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

// Position to scale degree (8 positions = octave)
// Two possible mappings: ascending or descending

const SCALE_ASCENDING = {
  '-4': { degree: 1, note: 'C', name: 'Root/Tonic' },
  '-3': { degree: 2, note: 'D', name: 'Supertonic' },
  '-2': { degree: 3, note: 'E', name: 'Mediant' },
  '-1': { degree: 4, note: 'F', name: 'Subdominant' },
  '+1': { degree: 5, note: 'G', name: 'Dominant' },
  '+2': { degree: 6, note: 'A', name: 'Submediant' },
  '+3': { degree: 7, note: 'B', name: 'Leading Tone' },
  '+4': { degree: 8, note: "C'", name: 'Octave' }
};

// Traditional "Music of the Spheres" planet-note mappings
// Multiple historical systems exist

const KEPLER_MAPPING = {
  // From Harmonices Mundi (1619)
  Saturn: { note: 'G', interval: 'major/minor third' },
  Jupiter: { note: 'G', interval: 'minor third' },
  Mars: { note: 'F', interval: 'fifth' },
  Earth: { note: 'F-G', interval: 'semitone (mi-fa)' },
  Venus: { note: 'E', interval: 'very small' },
  Mercury: { note: 'A-C', interval: 'octave+' }
};

const MEDIEVAL_MAPPING = {
  // Traditional Ptolemaic order (closest to farthest)
  Moon: { note: 'B', sphere: 1 },
  Mercury: { note: 'C', sphere: 2 },
  Venus: { note: 'D', sphere: 3 },
  Sun: { note: 'E', sphere: 4 },
  Mars: { note: 'F', sphere: 5 },
  Jupiter: { note: 'G', sphere: 6 },
  Saturn: { note: 'A', sphere: 7 }
  // Fixed stars = B (octave)
};

const PYTHAGOREAN_MAPPING = {
  // Based on orbital ratios (simplified)
  Moon: { ratio: '1:1', function: 'reflection' },
  Mercury: { ratio: '9:8', function: 'communication' },
  Venus: { ratio: '5:4', function: 'harmony' },
  Sun: { ratio: '4:3', function: 'center' },
  Mars: { ratio: '3:2', function: 'force' },
  Jupiter: { ratio: '5:3', function: 'expansion' },
  Saturn: { ratio: '2:1', function: 'boundary' }
};

// Harmonic series positions (overtones)
const HARMONIC_SERIES = {
  1: { name: 'Fundamental', interval: 'unison' },
  2: { name: '1st overtone', interval: 'octave' },
  3: { name: '2nd overtone', interval: 'perfect fifth' },
  4: { name: '3rd overtone', interval: 'octave' },
  5: { name: '4th overtone', interval: 'major third' },
  6: { name: '5th overtone', interval: 'perfect fifth' },
  7: { name: '6th overtone', interval: 'minor seventh' },
  8: { name: '7th overtone', interval: 'octave' }
};

// ═══════════════════════════════════════════════════════════════════════════
// STANDING WAVE DATA
// ═══════════════════════════════════════════════════════════════════════════

const STANDING_WAVES = {
  '-4': { trigram: 'Heaven', gate: 1, planets: ['Moon', 'Venus', 'Mars', 'Earth', 'Mars', 'Earth'] },
  '-3': { trigram: 'Lake', gate: 58, planets: [null, 'Venus', 'Uranus', 'Pluto', 'Moon', 'Moon'] },
  '-2': { trigram: 'Fire', gate: 30, planets: ['Sun', 'Sun', 'Pluto', 'Pluto', 'Jupiter', 'Mars'] },
  '-1': { trigram: 'Wind', gate: 57, planets: ['Venus', 'Venus', 'Mercury', 'Venus', 'Pluto', 'Uranus'] },
  '+1': { trigram: 'Thunder', gate: 51, planets: ['Pluto', 'Mars', 'Sun', 'Uranus', 'Sun', 'Sun'] },
  '+2': { trigram: 'Water', gate: 29, planets: ['Mars', 'Sun', 'Mars', 'Saturn', 'Sun', 'Mars'] },
  '+3': { trigram: 'Mountain', gate: 52, planets: ['Earth', 'Venus', 'Saturn', 'Saturn', 'Earth', 'Venus'] },
  '+4': { trigram: 'Earth', gate: 2, planets: ['Venus', 'Saturn', 'Jupiter', 'Venus', 'Mercury', 'Mercury'] }
};

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('MUSICAL SCALE HYPOTHESIS TEST');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: Map positions to octave
// ═══════════════════════════════════════════════════════════════════════════

console.log('PART 1: Positions as Musical Scale');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('Position → Scale Degree → Dominant Planet:');
console.log('─'.repeat(70));

Object.entries(STANDING_WAVES).forEach(([pos, data]) => {
  const scale = SCALE_ASCENDING[pos];
  const planetCounts = {};
  data.planets.filter(p => p).forEach(p => { planetCounts[p] = (planetCounts[p] || 0) + 1; });
  const sorted = Object.entries(planetCounts).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0] ? sorted[0][0] : 'none';

  console.log(`${pos.padStart(3)} (${data.trigram.padEnd(8)}) = ${scale.note.padEnd(3)} ${scale.name.padEnd(14)} → ${dominant}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: Check medieval planet-note correspondence
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 2: Medieval Planet-Note Mapping');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('Medieval system (Ptolemaic spheres):');
console.log('─'.repeat(50));
Object.entries(MEDIEVAL_MAPPING).forEach(([planet, data]) => {
  console.log(`  ${planet.padEnd(10)} → Note ${data.note} (Sphere ${data.sphere})`);
});

console.log('\nDo position notes match dominant planet notes?');
console.log('─'.repeat(70));

let matches = 0;
let total = 0;

Object.entries(STANDING_WAVES).forEach(([pos, data]) => {
  const scale = SCALE_ASCENDING[pos];
  const planetCounts = {};
  data.planets.filter(p => p).forEach(p => { planetCounts[p] = (planetCounts[p] || 0) + 1; });
  const sorted = Object.entries(planetCounts).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0] ? sorted[0][0] : null;

  if (dominant && MEDIEVAL_MAPPING[dominant]) {
    total++;
    const planetNote = MEDIEVAL_MAPPING[dominant].note;
    const posNote = scale.note.replace("'", "");
    const match = planetNote === posNote ? '✓ MATCH' : `✗ (${planetNote} ≠ ${posNote})`;
    if (planetNote === posNote) matches++;
    console.log(`${pos}: ${dominant.padEnd(8)} note=${planetNote}, position note=${posNote} ${match}`);
  }
});

console.log(`\nMatches: ${matches}/${total}`);

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: Harmonic relationships
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 3: Harmonic Series Analysis');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('Positions as harmonics (overtone series):');
console.log('─'.repeat(70));

// Map absolute position (1-8) to harmonic number
const positionOrder = ['-4', '-3', '-2', '-1', '+1', '+2', '+3', '+4'];

positionOrder.forEach((pos, i) => {
  const harmonic = HARMONIC_SERIES[i + 1];
  const data = STANDING_WAVES[pos];
  const planetCounts = {};
  data.planets.filter(p => p).forEach(p => { planetCounts[p] = (planetCounts[p] || 0) + 1; });
  const sorted = Object.entries(planetCounts).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0] ? sorted[0][0] : 'none';

  console.log(`Harmonic ${i + 1}: ${harmonic.name.padEnd(15)} (${harmonic.interval.padEnd(14)}) → ${pos} → ${dominant}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: Interval relationships between adjacent positions
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 4: Adjacent Position Relationships');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('Do adjacent positions (musical intervals) share planets?');
console.log('─'.repeat(70));

// Musical intervals between scale degrees
const INTERVALS = [
  { from: '-4', to: '-3', interval: 'Major 2nd (whole step)' },
  { from: '-3', to: '-2', interval: 'Major 2nd (whole step)' },
  { from: '-2', to: '-1', interval: 'Minor 2nd (half step)' },  // E→F
  { from: '-1', to: '+1', interval: 'Major 2nd (whole step)' },  // F→G (crossing zero)
  { from: '+1', to: '+2', interval: 'Major 2nd (whole step)' },
  { from: '+2', to: '+3', interval: 'Major 2nd (whole step)' },
  { from: '+3', to: '+4', interval: 'Minor 2nd (half step)' }   // B→C
];

INTERVALS.forEach(({ from, to, interval }) => {
  const p1 = new Set(STANDING_WAVES[from].planets.filter(p => p));
  const p2 = new Set(STANDING_WAVES[to].planets.filter(p => p));
  const shared = [...p1].filter(p => p2.has(p));

  console.log(`${from} → ${to} (${interval}):`);
  console.log(`  Shared: ${shared.length > 0 ? shared.join(', ') : 'none'}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 5: Perfect intervals (octave, fifth, fourth)
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 5: Perfect Interval Analysis');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('Perfect intervals are the most consonant in music.');
console.log('Do they show special planetary relationships?');
console.log('─'.repeat(70));

const PERFECT_INTERVALS = [
  { pos1: '-4', pos2: '+4', interval: 'Octave (8ve)', ratio: '2:1' },
  { pos1: '-4', pos2: '+1', interval: 'Perfect 5th', ratio: '3:2' },
  { pos1: '-4', pos2: '-1', interval: 'Perfect 4th', ratio: '4:3' },
  { pos1: '-3', pos2: '+2', interval: 'Perfect 5th', ratio: '3:2' },
  { pos1: '-2', pos2: '+3', interval: 'Perfect 5th', ratio: '3:2' },
  { pos1: '-1', pos2: '+4', interval: 'Perfect 5th', ratio: '3:2' }
];

PERFECT_INTERVALS.forEach(({ pos1, pos2, interval, ratio }) => {
  const p1 = new Set(STANDING_WAVES[pos1].planets.filter(p => p));
  const p2 = new Set(STANDING_WAVES[pos2].planets.filter(p => p));
  const shared = [...p1].filter(p => p2.has(p));

  const t1 = STANDING_WAVES[pos1].trigram;
  const t2 = STANDING_WAVES[pos2].trigram;

  console.log(`${interval} (${ratio}): ${pos1} (${t1}) ↔ ${pos2} (${t2})`);
  console.log(`  Shared planets: ${shared.length > 0 ? shared.join(', ') : 'NONE'}`);

  if (shared.length === 0) {
    console.log(`  Complete contrast - complementary?`);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 6: Line numbers as rhythm/meter
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 6: Lines as Beats/Rhythm');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('If 6 lines = 6 beats in a measure, do planets follow rhythmic patterns?');
console.log('─'.repeat(70));

// Check if same planet appears at same line positions across different gates
const planetByLine = {};
for (let line = 1; line <= 6; line++) {
  planetByLine[line] = {};
  Object.entries(STANDING_WAVES).forEach(([pos, data]) => {
    const planet = data.planets[line - 1];
    if (planet) {
      planetByLine[line][planet] = (planetByLine[line][planet] || 0) + 1;
    }
  });
}

console.log('Planets at each line position (across all 8 standing waves):');
Object.entries(planetByLine).forEach(([line, counts]) => {
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  console.log(`  Line ${line}: ${sorted.map(([p, c]) => `${p}:${c}`).join(', ')}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 7: Pattern detection
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 7: Pattern Summary');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Check octave relationship (pos -4 and +4)
const octaveP1 = new Set(STANDING_WAVES['-4'].planets.filter(p => p));
const octaveP2 = new Set(STANDING_WAVES['+4'].planets.filter(p => p));
const octaveShared = [...octaveP1].filter(p => octaveP2.has(p));

console.log('OCTAVE RELATIONSHIP (-4 ↔ +4):');
console.log(`  Heaven: ${[...octaveP1].join(', ')}`);
console.log(`  Earth:  ${[...octaveP2].join(', ')}`);
console.log(`  Shared: ${octaveShared.length > 0 ? octaveShared.join(', ') : 'NONE'}`);
if (octaveShared.length > 0) {
  console.log(`  → ${octaveShared.join(', ')} spans the full octave!`);
}

// Check fifth relationship (-4 to +1, etc.)
console.log('\nFIFTH RELATIONSHIPS (most consonant after octave):');
const fifths = [
  ['-4', '+1'], ['-3', '+2'], ['-2', '+3'], ['-1', '+4']
];

fifths.forEach(([p1, p2]) => {
  const s1 = new Set(STANDING_WAVES[p1].planets.filter(p => p));
  const s2 = new Set(STANDING_WAVES[p2].planets.filter(p => p));
  const shared = [...s1].filter(p => s2.has(p));
  console.log(`  ${p1} → ${p2}: ${shared.length > 0 ? shared.join(', ') : 'none'}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// CONCLUSION
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('CONCLUSION');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Gather findings
const findings = [];

if (octaveShared.length > 0) {
  findings.push(`Octave positions share planets: ${octaveShared.join(', ')}`);
}

// Check if any planet dominates a specific line
Object.entries(planetByLine).forEach(([line, counts]) => {
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (sorted[0] && sorted[0][1] >= 4) {
    findings.push(`Line ${line} favors ${sorted[0][0]} (${sorted[0][1]}/8 gates)`);
  }
});

if (findings.length > 0) {
  console.log('MUSICAL PATTERNS FOUND:');
  findings.forEach(f => console.log(`  ✓ ${f}`));
} else {
  console.log('NO CLEAR MUSICAL PATTERNS:');
  console.log('  Medieval planet-note mappings do not align with positions.');
  console.log('  Harmonic intervals do not predict shared planets.');
}

console.log('\n─'.repeat(70));
