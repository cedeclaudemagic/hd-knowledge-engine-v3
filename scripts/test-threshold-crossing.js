/**
 * Threshold Crossing Hypothesis Test
 *
 * Instead of treating cross-zero as one movement (origin → destination),
 * treat it as two half-movements meeting at zero:
 *
 *   Origin → ZERO → Destination
 *   [approach]  [departure]
 *
 * Test whether approach-type, departure-type, or combined crossing-type
 * predicts exalting planet better than origin→destination alone.
 */

const fs = require('fs');
const path = require('path');

// Load source data
const hdGatesPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const emLinesPath = path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

const hdGates = JSON.parse(fs.readFileSync(hdGatesPath, 'utf8'));
const emLines = JSON.parse(fs.readFileSync(emLinesPath, 'utf8'));

// Build indexes
const hdIndex = {};
const hdMappings = hdGates.mappings || hdGates;
for (const line of hdMappings) {
  const key = `${line.gateNumber}.${line.lineNumber}`;
  const exaltPlanets = line.knowledge?.blackBook?.exaltation?.planets || [];
  hdIndex[key] = exaltPlanets.map(p => p.planet || p);
}

// Approach and Departure Type Classification
function classifyApproach(innerPos) {
  const absPos = Math.abs(innerPos);
  if (absPos === 4) return 'pole';     // From pole toward threshold
  if (absPos === 3) return 'storage';  // From storage toward threshold
  if (absPos === 2) return 'flow';     // From flow toward threshold
  if (absPos === 1) return 'gate';     // From gate toward threshold
  return 'unknown';
}

function classifyDeparture(outerPos) {
  const absPos = Math.abs(outerPos);
  if (absPos === 1) return 'gate';     // From threshold toward gate
  if (absPos === 2) return 'flow';     // From threshold toward flow
  if (absPos === 3) return 'storage';  // From threshold toward storage
  if (absPos === 4) return 'pole';     // From threshold toward pole
  return 'unknown';
}

// Compression/Expansion classification
function classifyApproachEnergy(innerPos) {
  // Negative positions approaching zero = compression (potential → actuality)
  // Positive positions approaching zero = expansion (actuality → potential)
  return innerPos < 0 ? 'compression' : 'expansion';
}

function classifyDepartureEnergy(outerPos) {
  // Leaving zero toward positive = materializing
  // Leaving zero toward negative = dematerializing
  return outerPos > 0 ? 'materializing' : 'dematerializing';
}

console.log('═'.repeat(75));
console.log('THRESHOLD CROSSING HYPOTHESIS TEST');
console.log('═'.repeat(75));

console.log('\nHypothesis: Cross-zero planetary assignments are determined by');
console.log('HOW you approach zero + HOW you depart from zero,');
console.log('not just origin→destination.');
console.log('─'.repeat(75));

// Collect all cross-zero lines
const crossZeroLines = [];
const emMappings = emLines.mappings || emLines;

for (const line of emMappings) {
  const gateType = line.electromagnetic?.gateType;
  if (!gateType || !gateType.startsWith('cross-zero')) continue;

  const key = `${line.gate}.${line.line}`;
  const planets = hdIndex[key];
  if (!planets || planets.length === 0) continue;

  const innerPos = line.electromagnetic?.innerTrigram?.position;
  const outerPos = line.electromagnetic?.outerTrigram?.position;

  if (innerPos === undefined || outerPos === undefined) continue;

  crossZeroLines.push({
    gate: line.gate,
    line: line.line,
    innerPos,
    outerPos,
    gateType,
    approach: classifyApproach(innerPos),
    departure: classifyDeparture(outerPos),
    approachEnergy: classifyApproachEnergy(innerPos),
    departureEnergy: classifyDepartureEnergy(outerPos),
    crossingType: `${classifyApproach(innerPos)}→${classifyDeparture(outerPos)}`,
    planet: planets[0]
  });
}

console.log(`\nCross-zero lines with exaltation data: ${crossZeroLines.length}`);

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1: Approach Type Analysis
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 1: Approach Type → Planet');
console.log('═'.repeat(75));

console.log('\nHow does the WAY you approach zero affect which planet guides?');
console.log('─'.repeat(75));

const approachTypes = ['pole', 'storage', 'flow', 'gate'];
const approachPlanetCounts = {};

for (const approach of approachTypes) {
  approachPlanetCounts[approach] = {};
  const lines = crossZeroLines.filter(l => l.approach === approach);

  for (const line of lines) {
    approachPlanetCounts[approach][line.planet] =
      (approachPlanetCounts[approach][line.planet] || 0) + 1;
  }

  const sorted = Object.entries(approachPlanetCounts[approach])
    .sort((a, b) => b[1] - a[1]);
  const total = lines.length;
  const dominant = sorted[0];

  console.log(`\nApproach from ${approach.toUpperCase()} (n=${total}):`);
  console.log(`  ${sorted.slice(0, 5).map(([p, c]) => `${p}:${c}`).join(', ')}`);
  if (dominant) {
    console.log(`  → Dominant: ${dominant[0]} (${(dominant[1]/total*100).toFixed(0)}%)`);
  }
}

// Calculate approach-only prediction accuracy
let approachCorrect = 0;
for (const line of crossZeroLines) {
  const counts = approachPlanetCounts[line.approach];
  const predicted = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (predicted === line.planet) approachCorrect++;
}
const approachAccuracy = (approachCorrect / crossZeroLines.length * 100).toFixed(1);
console.log(`\nApproach-only prediction: ${approachCorrect}/${crossZeroLines.length} = ${approachAccuracy}%`);

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2: Departure Type Analysis
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 2: Departure Type → Planet');
console.log('═'.repeat(75));

console.log('\nHow does the WAY you depart from zero affect which planet guides?');
console.log('─'.repeat(75));

const departureTypes = ['gate', 'flow', 'storage', 'pole'];
const departurePlanetCounts = {};

for (const departure of departureTypes) {
  departurePlanetCounts[departure] = {};
  const lines = crossZeroLines.filter(l => l.departure === departure);

  for (const line of lines) {
    departurePlanetCounts[departure][line.planet] =
      (departurePlanetCounts[departure][line.planet] || 0) + 1;
  }

  const sorted = Object.entries(departurePlanetCounts[departure])
    .sort((a, b) => b[1] - a[1]);
  const total = lines.length;
  const dominant = sorted[0];

  console.log(`\nDeparture to ${departure.toUpperCase()} (n=${total}):`);
  console.log(`  ${sorted.slice(0, 5).map(([p, c]) => `${p}:${c}`).join(', ')}`);
  if (dominant) {
    console.log(`  → Dominant: ${dominant[0]} (${(dominant[1]/total*100).toFixed(0)}%)`);
  }
}

// Calculate departure-only prediction accuracy
let departureCorrect = 0;
for (const line of crossZeroLines) {
  const counts = departurePlanetCounts[line.departure];
  const predicted = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (predicted === line.planet) departureCorrect++;
}
const departureAccuracy = (departureCorrect / crossZeroLines.length * 100).toFixed(1);
console.log(`\nDeparture-only prediction: ${departureCorrect}/${crossZeroLines.length} = ${departureAccuracy}%`);

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3: Combined Crossing Type (16 possibilities)
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 3: Combined Crossing Type → Planet');
console.log('═'.repeat(75));

console.log('\n16 possible crossing types (approach→departure):');
console.log('─'.repeat(75));

const crossingPlanetCounts = {};

for (const line of crossZeroLines) {
  if (!crossingPlanetCounts[line.crossingType]) {
    crossingPlanetCounts[line.crossingType] = {};
  }
  crossingPlanetCounts[line.crossingType][line.planet] =
    (crossingPlanetCounts[line.crossingType][line.planet] || 0) + 1;
}

// Sort by frequency and show each crossing type
const crossingTypes = Object.keys(crossingPlanetCounts).sort((a, b) => {
  const countA = Object.values(crossingPlanetCounts[a]).reduce((s, c) => s + c, 0);
  const countB = Object.values(crossingPlanetCounts[b]).reduce((s, c) => s + c, 0);
  return countB - countA;
});

for (const crossing of crossingTypes) {
  const counts = crossingPlanetCounts[crossing];
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = Object.values(counts).reduce((s, c) => s + c, 0);
  const dominant = sorted[0];
  const entropy = sorted.length > 1 && sorted[0][1] === sorted[1][1] ? 'HIGH' : 'low';

  console.log(`\n${crossing.padEnd(15)} (n=${total.toString().padStart(2)}):`);
  console.log(`  ${sorted.map(([p, c]) => `${p}:${c}`).join(', ')}`);
  if (dominant && total >= 3) {
    const dominance = (dominant[1] / total * 100).toFixed(0);
    console.log(`  → ${dominant[0]} dominates at ${dominance}%${dominance >= 50 ? ' ✓' : ''}`);
  }
}

// Calculate crossing-type prediction accuracy
let crossingCorrect = 0;
for (const line of crossZeroLines) {
  const counts = crossingPlanetCounts[line.crossingType];
  const predicted = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (predicted === line.planet) crossingCorrect++;
}
const crossingAccuracy = (crossingCorrect / crossZeroLines.length * 100).toFixed(1);
console.log(`\nCrossing-type prediction: ${crossingCorrect}/${crossZeroLines.length} = ${crossingAccuracy}%`);

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4: Energy Type Analysis (Compression/Expansion)
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 4: Energy Type Analysis');
console.log('═'.repeat(75));

console.log('\nApproach: compression (void→zero) vs expansion (material→zero)');
console.log('Departure: materializing (zero→material) vs dematerializing (zero→void)');
console.log('─'.repeat(75));

const energyTypes = {};
for (const line of crossZeroLines) {
  const key = `${line.approachEnergy}→${line.departureEnergy}`;
  if (!energyTypes[key]) energyTypes[key] = {};
  energyTypes[key][line.planet] = (energyTypes[key][line.planet] || 0) + 1;
}

for (const [energy, counts] of Object.entries(energyTypes)) {
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = Object.values(counts).reduce((s, c) => s + c, 0);

  console.log(`\n${energy} (n=${total}):`);
  console.log(`  ${sorted.slice(0, 5).map(([p, c]) => `${p}:${c}`).join(', ')}`);
  if (sorted[0]) {
    console.log(`  → Dominant: ${sorted[0][0]} (${(sorted[0][1]/total*100).toFixed(0)}%)`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5: Line + Crossing Type Combined
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 5: Line + Crossing Type Combined');
console.log('═'.repeat(75));

console.log('\nDoes adding line number to crossing type improve prediction?');
console.log('─'.repeat(75));

const lineCrossingCounts = {};
for (const line of crossZeroLines) {
  const key = `L${line.line}_${line.crossingType}`;
  if (!lineCrossingCounts[key]) lineCrossingCounts[key] = {};
  lineCrossingCounts[key][line.planet] = (lineCrossingCounts[key][line.planet] || 0) + 1;
}

let lineCrossingCorrect = 0;
for (const line of crossZeroLines) {
  const key = `L${line.line}_${line.crossingType}`;
  const counts = lineCrossingCounts[key];
  const predicted = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (predicted === line.planet) lineCrossingCorrect++;
}
const lineCrossingAccuracy = (lineCrossingCorrect / crossZeroLines.length * 100).toFixed(1);
console.log(`\nLine + Crossing-type prediction: ${lineCrossingCorrect}/${crossZeroLines.length} = ${lineCrossingAccuracy}%`);

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 6: Cross-Validation Test
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 6: Leave-One-Out Cross-Validation');
console.log('═'.repeat(75));

console.log('\nTrue test: Predict each line without using it in training');
console.log('─'.repeat(75));

function leaveOneOutCV(lines, keyFn) {
  let correct = 0;

  for (let i = 0; i < lines.length; i++) {
    const testLine = lines[i];
    const trainLines = lines.filter((_, j) => j !== i);

    // Build model from training data
    const counts = {};
    const key = keyFn(testLine);
    for (const line of trainLines) {
      if (keyFn(line) === key) {
        counts[line.planet] = (counts[line.planet] || 0) + 1;
      }
    }

    // Predict
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const predicted = sorted[0]?.[0];

    if (predicted === testLine.planet) correct++;
  }

  return correct / lines.length * 100;
}

const cvApproach = leaveOneOutCV(crossZeroLines, l => l.approach);
const cvDeparture = leaveOneOutCV(crossZeroLines, l => l.departure);
const cvCrossing = leaveOneOutCV(crossZeroLines, l => l.crossingType);
const cvLineCrossing = leaveOneOutCV(crossZeroLines, l => `L${l.line}_${l.crossingType}`);
const cvLineOnly = leaveOneOutCV(crossZeroLines, l => l.line);
const cvPosLine = leaveOneOutCV(crossZeroLines, l => `${l.innerPos}_${l.outerPos}_${l.line}`);

console.log(`\nLeave-One-Out Cross-Validation Results:`);
console.log(`─`.repeat(50));
console.log(`  Approach-only:           ${cvApproach.toFixed(1)}%`);
console.log(`  Departure-only:          ${cvDeparture.toFixed(1)}%`);
console.log(`  Crossing-type:           ${cvCrossing.toFixed(1)}%`);
console.log(`  Line-only:               ${cvLineOnly.toFixed(1)}%`);
console.log(`  Line + Crossing:         ${cvLineCrossing.toFixed(1)}%`);
console.log(`  Position + Line (prev):  ${cvPosLine.toFixed(1)}%`);

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 7: Planetary Families by Crossing Type
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SECTION 7: Do Crossing Types Cluster into Planetary Families?');
console.log('═'.repeat(75));

console.log('\nGrouping crossing types by their dominant planet:');
console.log('─'.repeat(75));

const planetFamilies = {};
for (const [crossing, counts] of Object.entries(crossingPlanetCounts)) {
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0]?.[0];
  if (dominant) {
    if (!planetFamilies[dominant]) planetFamilies[dominant] = [];
    const total = Object.values(counts).reduce((s, c) => s + c, 0);
    planetFamilies[dominant].push({
      crossing,
      count: sorted[0][1],
      total,
      dominance: (sorted[0][1] / total * 100).toFixed(0)
    });
  }
}

for (const [planet, crossings] of Object.entries(planetFamilies).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n${planet} family (${crossings.length} crossing types):`);
  for (const c of crossings.sort((a, b) => b.count - a.count)) {
    console.log(`  ${c.crossing.padEnd(15)} (${c.dominance}% of ${c.total})`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(75));
console.log('SYNTHESIS: Threshold Crossing Results');
console.log('═'.repeat(75));

console.log('\nPrediction Accuracy Comparison:');
console.log('─'.repeat(50));
console.log(`  Previous baseline (pos+line+gateType):  ~44%`);
console.log(`  Approach-only (CV):                     ${cvApproach.toFixed(1)}%`);
console.log(`  Departure-only (CV):                    ${cvDeparture.toFixed(1)}%`);
console.log(`  Crossing-type (CV):                     ${cvCrossing.toFixed(1)}%`);
console.log(`  Line + Crossing (CV):                   ${cvLineCrossing.toFixed(1)}%`);

const bestCV = Math.max(cvApproach, cvDeparture, cvCrossing, cvLineCrossing);
const improvement = bestCV - 44;

console.log(`\nBest threshold model: ${bestCV.toFixed(1)}%`);
console.log(`Improvement over baseline: ${improvement > 0 ? '+' : ''}${improvement.toFixed(1)} percentage points`);

console.log('\n' + '═'.repeat(75));
console.log('CONCLUSION');
console.log('═'.repeat(75));

if (bestCV > 50) {
  console.log(`
STATUS: ✓ SIGNIFICANT IMPROVEMENT

The threshold crossing hypothesis improves prediction by ${improvement.toFixed(1)} pp.
This suggests the WAY you cross zero matters, not just origin→destination.

Key insight: The planet is influenced by approach/departure dynamics,
not just the vector endpoints.
`);
} else if (bestCV > 44) {
  console.log(`
STATUS: MARGINAL IMPROVEMENT

The threshold crossing hypothesis shows slight improvement (+${improvement.toFixed(1)} pp).
The crossing dynamics contribute some signal, but don't fully explain the variance.

The transformation layer may have additional factors beyond crossing type.
`);
} else {
  console.log(`
STATUS: ✗ NO IMPROVEMENT

The threshold crossing hypothesis does not improve prediction over baseline.
Approach type, departure type, and combined crossing type do not determine
which planet guides the transformation.

The transformation layer remains empirical.
`);
}
