/**
 * Physical Properties Hypothesis Test
 *
 * Question: Do the physical properties of planets correlate with their
 * electromagnetic positions in the standing wave assignments?
 *
 * We have 100% derivable standing wave data — now ask WHY those assignments exist.
 */

// ═══════════════════════════════════════════════════════════════════════════
// PLANETARY PHYSICAL DATA
// ═══════════════════════════════════════════════════════════════════════════

const PLANET_PROPERTIES = {
  Sun: {
    type: 'star',
    distanceAU: 0,
    orbitalPeriodDays: null,
    density: 1.41,
    magneticField: 'massive',
    composition: 'plasma',
    mass: 333000,  // Earth masses
    category: 'luminary'
  },
  Moon: {
    type: 'satellite',
    distanceAU: 0.00257,
    orbitalPeriodDays: 27.3,
    density: 3.34,
    magneticField: 'none',
    composition: 'rocky',
    mass: 0.0123,
    category: 'luminary'
  },
  Mercury: {
    type: 'terrestrial',
    distanceAU: 0.39,
    orbitalPeriodDays: 88,
    density: 5.43,
    magneticField: 'weak',
    composition: 'rocky-iron',
    mass: 0.055,
    category: 'personal'
  },
  Venus: {
    type: 'terrestrial',
    distanceAU: 0.72,
    orbitalPeriodDays: 225,
    density: 5.24,
    magneticField: 'none',
    composition: 'rocky',
    mass: 0.815,
    category: 'personal'
  },
  Earth: {
    type: 'terrestrial',
    distanceAU: 1.0,
    orbitalPeriodDays: 365,
    density: 5.51,
    magneticField: 'moderate',
    composition: 'rocky',
    mass: 1.0,
    category: 'earth'
  },
  Mars: {
    type: 'terrestrial',
    distanceAU: 1.52,
    orbitalPeriodDays: 687,
    density: 3.93,
    magneticField: 'trace',
    composition: 'rocky',
    mass: 0.107,
    category: 'personal'
  },
  Jupiter: {
    type: 'gas-giant',
    distanceAU: 5.2,
    orbitalPeriodDays: 4333,
    density: 1.33,
    magneticField: 'enormous',
    composition: 'gas',
    mass: 317.8,
    category: 'social'
  },
  Saturn: {
    type: 'gas-giant',
    distanceAU: 9.5,
    orbitalPeriodDays: 10759,
    density: 0.69,
    magneticField: 'strong',
    composition: 'gas',
    mass: 95.2,
    category: 'social'
  },
  Uranus: {
    type: 'ice-giant',
    distanceAU: 19.2,
    orbitalPeriodDays: 30687,
    density: 1.27,
    magneticField: 'tilted',
    composition: 'ice',
    mass: 14.5,
    category: 'transpersonal'
  },
  Neptune: {
    type: 'ice-giant',
    distanceAU: 30.1,
    orbitalPeriodDays: 60190,
    density: 1.64,
    magneticField: 'strong',
    composition: 'ice',
    mass: 17.1,
    category: 'transpersonal'
  },
  Pluto: {
    type: 'dwarf',
    distanceAU: 39.5,
    orbitalPeriodDays: 90560,
    density: 1.85,
    magneticField: 'unknown',
    composition: 'ice-rock',
    mass: 0.0022,
    category: 'transpersonal'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// STANDING WAVE ASSIGNMENTS (100% derivable, from predictive-model-final.js)
// ═══════════════════════════════════════════════════════════════════════════

const STANDING_WAVE_ASSIGNMENTS = {
  '-4': { L1: 'Moon', L2: 'Venus', L3: 'Mars', L4: 'Earth', L5: 'Mars', L6: 'Earth' },
  '-3': { L1: 'Venus', L3: 'Uranus', L4: 'Pluto', L5: 'Moon', L6: 'Moon' },
  '-2': { L1: 'Sun', L2: 'Sun', L3: 'Pluto', L4: 'Pluto', L5: 'Jupiter', L6: 'Mars' },
  '-1': { L1: 'Venus', L2: 'Venus', L3: 'Mercury', L4: 'Venus', L5: 'Pluto', L6: 'Uranus' },
  '+1': { L1: 'Pluto', L2: 'Mars', L3: 'Sun', L4: 'Uranus', L5: 'Sun', L6: 'Sun' },
  '+2': { L1: 'Mars', L2: 'Sun', L3: 'Mars', L4: 'Saturn', L5: 'Sun', L6: 'Mars' },
  '+3': { L1: 'Earth', L2: 'Venus', L3: 'Saturn', L4: 'Saturn', L5: 'Earth', L6: 'Venus' },
  '+4': { L1: 'Venus', L2: 'Saturn', L3: 'Jupiter', L4: 'Venus', L5: 'Mercury', L6: 'Mercury' }
};

// Position metadata
const POSITION_META = {
  '-4': { domain: 'void', axis: 'POLES', zone: 'Absolute Ground', trigram: 'Heaven' },
  '-3': { domain: 'void', axis: 'CONTAINERS', zone: 'Radiating', trigram: 'Lake' },
  '-2': { domain: 'void', axis: 'FLOW', zone: 'Radiating', trigram: 'Fire' },
  '-1': { domain: 'void', axis: 'GATES', zone: 'Zero Crossing', trigram: 'Wind' },
  '+1': { domain: 'matter', axis: 'GATES', zone: 'Zero Crossing', trigram: 'Thunder' },
  '+2': { domain: 'matter', axis: 'FLOW', zone: 'Generating', trigram: 'Water' },
  '+3': { domain: 'matter', axis: 'CONTAINERS', zone: 'Generating', trigram: 'Mountain' },
  '+4': { domain: 'matter', axis: 'POLES', zone: 'Local Ground', trigram: 'Earth' }
};

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('PHYSICAL PROPERTIES HYPOTHESIS TEST');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: Aggregate planets by position
// ═══════════════════════════════════════════════════════════════════════════

console.log('PART 1: Planet Distribution Across Positions');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Count planets at each position
const planetsByPosition = {};
Object.entries(STANDING_WAVE_ASSIGNMENTS).forEach(([pos, lines]) => {
  planetsByPosition[pos] = {};
  Object.values(lines).forEach(planet => {
    planetsByPosition[pos][planet] = (planetsByPosition[pos][planet] || 0) + 1;
  });
});

console.log('Planets at each position (standing waves only):');
console.log('─'.repeat(70));
Object.entries(planetsByPosition).forEach(([pos, planets]) => {
  const meta = POSITION_META[pos];
  const planetList = Object.entries(planets)
    .sort((a, b) => b[1] - a[1])
    .map(([p, c]) => `${p}:${c}`)
    .join(', ');
  console.log(`${pos.padStart(3)} (${meta.domain.padEnd(6)} ${meta.axis.padEnd(10)}): ${planetList}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: Aggregate physical properties by domain
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 2: Physical Properties by Domain');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Collect all planet occurrences by domain
const voidPlanets = [];
const matterPlanets = [];

Object.entries(STANDING_WAVE_ASSIGNMENTS).forEach(([pos, lines]) => {
  const domain = POSITION_META[pos].domain;
  Object.values(lines).forEach(planet => {
    if (domain === 'void') voidPlanets.push(planet);
    else matterPlanets.push(planet);
  });
});

function analyzeProperties(planetList, label) {
  const counts = {};
  const properties = {
    totalDensity: 0,
    totalDistance: 0,
    types: {},
    compositions: {},
    categories: {},
    magneticFields: {}
  };

  planetList.forEach(planet => {
    counts[planet] = (counts[planet] || 0) + 1;
    const props = PLANET_PROPERTIES[planet];
    if (props) {
      properties.totalDensity += props.density;
      properties.totalDistance += props.distanceAU || 0;
      properties.types[props.type] = (properties.types[props.type] || 0) + 1;
      properties.compositions[props.composition] = (properties.compositions[props.composition] || 0) + 1;
      properties.categories[props.category] = (properties.categories[props.category] || 0) + 1;
      properties.magneticFields[props.magneticField] = (properties.magneticFields[props.magneticField] || 0) + 1;
    }
  });

  console.log(`${label} (n=${planetList.length}):`);
  console.log('─'.repeat(50));
  console.log(`  Avg density: ${(properties.totalDensity / planetList.length).toFixed(2)} g/cm³`);
  console.log(`  Avg distance: ${(properties.totalDistance / planetList.length).toFixed(2)} AU`);
  console.log(`  Types: ${JSON.stringify(properties.types)}`);
  console.log(`  Compositions: ${JSON.stringify(properties.compositions)}`);
  console.log(`  Categories: ${JSON.stringify(properties.categories)}`);
  console.log(`  Magnetic fields: ${JSON.stringify(properties.magneticFields)}`);
  console.log(`  Planet counts: ${Object.entries(counts).sort((a,b) => b[1] - a[1]).map(([p,c]) => `${p}:${c}`).join(', ')}`);
  console.log();

  return properties;
}

const voidProps = analyzeProperties(voidPlanets, 'VOID DOMAIN (-4 to -1)');
const matterProps = analyzeProperties(matterPlanets, 'MATTER DOMAIN (+1 to +4)');

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: Compare domains
// ═══════════════════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('PART 3: Domain Comparison');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

console.log('Property differences between VOID and MATTER domains:');
console.log('─'.repeat(60));

const voidDensity = voidProps.totalDensity / voidPlanets.length;
const matterDensity = matterProps.totalDensity / matterPlanets.length;
console.log(`Avg density: VOID=${voidDensity.toFixed(2)}, MATTER=${matterDensity.toFixed(2)} → ${voidDensity > matterDensity ? 'VOID denser' : 'MATTER denser'}`);

const voidDistance = voidProps.totalDistance / voidPlanets.length;
const matterDistance = matterProps.totalDistance / matterPlanets.length;
console.log(`Avg distance: VOID=${voidDistance.toFixed(2)} AU, MATTER=${matterDistance.toFixed(2)} AU → ${voidDistance > matterDistance ? 'VOID farther' : 'MATTER farther'}`);

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: Analyze by axis
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 4: Physical Properties by Axis');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const axisPlanets = { POLES: [], CONTAINERS: [], FLOW: [], GATES: [] };

Object.entries(STANDING_WAVE_ASSIGNMENTS).forEach(([pos, lines]) => {
  const axis = POSITION_META[pos].axis;
  Object.values(lines).forEach(planet => {
    axisPlanets[axis].push(planet);
  });
});

Object.entries(axisPlanets).forEach(([axis, planets]) => {
  analyzeProperties(planets, `${axis} axis`);
});

// ═══════════════════════════════════════════════════════════════════════════
// PART 5: Individual planet analysis
// ═══════════════════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('PART 5: Where Each Planet Appears (Position Affinity)');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const planetPositions = {};
Object.entries(STANDING_WAVE_ASSIGNMENTS).forEach(([pos, lines]) => {
  Object.entries(lines).forEach(([line, planet]) => {
    if (!planetPositions[planet]) planetPositions[planet] = [];
    planetPositions[planet].push({ pos: parseInt(pos), line: parseInt(line.replace('L', '')) });
  });
});

// Calculate average position for each planet
console.log('Planet position affinities (standing waves only):');
console.log('─'.repeat(70));
console.log('Planet'.padEnd(10), 'Count', 'Avg Pos', 'Domain Bias', 'Positions');
console.log('─'.repeat(70));

Object.entries(planetPositions)
  .map(([planet, positions]) => {
    const avgPos = positions.reduce((sum, p) => sum + p.pos, 0) / positions.length;
    const voidCount = positions.filter(p => p.pos < 0).length;
    const matterCount = positions.filter(p => p.pos > 0).length;
    const bias = voidCount > matterCount ? 'VOID' : voidCount < matterCount ? 'MATTER' : 'balanced';
    return { planet, positions, avgPos, voidCount, matterCount, bias };
  })
  .sort((a, b) => a.avgPos - b.avgPos)
  .forEach(p => {
    const props = PLANET_PROPERTIES[p.planet];
    const posStr = p.positions.map(pos => `${pos.pos > 0 ? '+' : ''}${pos.pos}L${pos.line}`).join(', ');
    console.log(
      p.planet.padEnd(10),
      String(p.positions.length).padStart(5),
      p.avgPos.toFixed(1).padStart(7),
      p.bias.padEnd(11),
      posStr
    );
  });

// ═══════════════════════════════════════════════════════════════════════════
// PART 6: Correlations
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 6: Physical Property Correlations');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// For each planet with position data, check if physical properties correlate
const correlationData = Object.entries(planetPositions)
  .filter(([planet]) => PLANET_PROPERTIES[planet])
  .map(([planet, positions]) => {
    const props = PLANET_PROPERTIES[planet];
    const avgPos = positions.reduce((sum, p) => sum + p.pos, 0) / positions.length;
    return {
      planet,
      avgPos,
      density: props.density,
      distance: props.distanceAU,
      type: props.type,
      category: props.category
    };
  });

console.log('Planet physical properties vs average position:');
console.log('─'.repeat(70));
console.log('Planet'.padEnd(10), 'Avg Pos', 'Density', 'Distance', 'Type'.padEnd(12), 'Category');
console.log('─'.repeat(70));

correlationData
  .sort((a, b) => a.avgPos - b.avgPos)
  .forEach(d => {
    console.log(
      d.planet.padEnd(10),
      d.avgPos.toFixed(1).padStart(7),
      d.density.toFixed(2).padStart(7),
      (d.distance || 0).toFixed(2).padStart(8),
      d.type.padEnd(12),
      d.category
    );
  });

// Simple correlation calculation
function pearsonCorrelation(x, y) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const num = n * sumXY - sumX * sumY;
  const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return den === 0 ? 0 : num / den;
}

const positions = correlationData.map(d => d.avgPos);
const densities = correlationData.map(d => d.density);
const distances = correlationData.map(d => d.distance || 0);

const densityCorr = pearsonCorrelation(positions, densities);
const distanceCorr = pearsonCorrelation(positions, distances);

console.log('\nCorrelations:');
console.log(`  Position vs Density:  r = ${densityCorr.toFixed(3)}`);
console.log(`  Position vs Distance: r = ${distanceCorr.toFixed(3)}`);

// ═══════════════════════════════════════════════════════════════════════════
// PART 7: Key patterns
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('PART 7: Key Patterns Observed');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// Check: Do rocky planets cluster?
const rockyPlanets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Moon'];
const rockyPositions = correlationData.filter(d => rockyPlanets.includes(d.planet));
const rockyAvg = rockyPositions.reduce((sum, p) => sum + p.avgPos, 0) / rockyPositions.length;

// Gas/ice giants
const giantPlanets = ['Jupiter', 'Saturn', 'Uranus', 'Neptune'];
const giantPositions = correlationData.filter(d => giantPlanets.includes(d.planet));
const giantAvg = giantPositions.length > 0 ?
  giantPositions.reduce((sum, p) => sum + p.avgPos, 0) / giantPositions.length : 0;

console.log('Type clustering:');
console.log(`  Rocky planets (${rockyPlanets.join(', ')}): avg pos = ${rockyAvg.toFixed(2)}`);
console.log(`  Giant planets (${giantPlanets.join(', ')}): avg pos = ${giantAvg.toFixed(2)}`);

// Luminaries
const luminaryPositions = correlationData.filter(d => d.category === 'luminary');
const luminaryAvg = luminaryPositions.reduce((sum, p) => sum + p.avgPos, 0) / luminaryPositions.length;
console.log(`  Luminaries (Sun, Moon): avg pos = ${luminaryAvg.toFixed(2)}`);

// Transpersonal
const transpersonalPositions = correlationData.filter(d => d.category === 'transpersonal');
const transpersonalAvg = transpersonalPositions.reduce((sum, p) => sum + p.avgPos, 0) / transpersonalPositions.length;
console.log(`  Transpersonal (Uranus, Neptune, Pluto): avg pos = ${transpersonalAvg.toFixed(2)}`);

// ═══════════════════════════════════════════════════════════════════════════
// CONCLUSION
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('CONCLUSION');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const significantPatterns = [];

if (Math.abs(densityCorr) > 0.3) {
  significantPatterns.push(`Density correlates with position (r=${densityCorr.toFixed(2)})`);
}
if (Math.abs(distanceCorr) > 0.3) {
  significantPatterns.push(`Distance correlates with position (r=${distanceCorr.toFixed(2)})`);
}
if (Math.abs(rockyAvg - giantAvg) > 1) {
  significantPatterns.push(`Rocky vs giant planets cluster differently (${rockyAvg.toFixed(1)} vs ${giantAvg.toFixed(1)})`);
}

if (significantPatterns.length > 0) {
  console.log('PATTERNS FOUND:');
  significantPatterns.forEach(p => console.log(`  ✓ ${p}`));
  console.log('\n  Physical properties MAY explain standing wave assignments.');
  console.log('  Further analysis needed to test against cross-zero gates.');
} else {
  console.log('NO STRONG PATTERNS FOUND:');
  console.log('  Physical properties do not strongly correlate with positions.');
  console.log('  The standing wave assignments may be based on non-physical criteria,');
  console.log('  or the physical relationships are more complex than simple correlations.');
}

console.log('\n─'.repeat(70));
console.log('Note: This analysis uses standing wave data only (n=47 assignments)');
console.log('Sample sizes per planet are small — interpret with caution');
console.log('─'.repeat(70));
