/**
 * Phase 1: Descriptive Analysis - Nuclear Hierarchy Research
 *
 * Goal: Characterise planetary distributions across the nuclear hierarchy
 * without predictive claims.
 *
 * Tasks:
 * 1. Load and cross-reference data sources
 * 2. Sanity check: output example gates with merged data
 * 3. Calculate frequency tables (Planet × Pillar, Mystery, Level)
 * 4. Generate ASCII heatmap tables
 * 5. Calculate chi-square statistics
 * 6. Write markdown report
 */

const fs = require('fs');
const path = require('path');

// === Data Loading ===
const hierarchyPath = path.join(__dirname, '../knowledge-systems/nuclear-hierarchy/mappings/nuclear-hierarchy-mappings.json');
const planetaryPath = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const reportsDir = path.join(__dirname, '../docs/research/planetary/reports');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const hierarchy = JSON.parse(fs.readFileSync(hierarchyPath, 'utf8'));
const planetaryRaw = JSON.parse(fs.readFileSync(planetaryPath, 'utf8'));

// Transform planetary data from nested structure to gate-keyed format
// The hd-gates-mappings.json has: mappings[].knowledge.blackBook.exaltation.planets[].planet
const planetary = {};
planetaryRaw.mappings.forEach(entry => {
  const gateNum = entry.gateNumber;
  if (!planetary[gateNum]) {
    planetary[gateNum] = {
      gate: gateNum,
      name: entry.knowledge.gateName,
      lines: []
    };
  }

  const exaltPlanets = [];
  const detriPlanets = [];

  // Extract exaltation planets
  if (entry.knowledge.blackBook?.exaltation?.planets) {
    entry.knowledge.blackBook.exaltation.planets.forEach(p => {
      if (p.planet) exaltPlanets.push(p.planet);
    });
  }

  // Extract detriment planets
  if (entry.knowledge.blackBook?.detriment?.planets) {
    entry.knowledge.blackBook.detriment.planets.forEach(p => {
      if (p.planet) detriPlanets.push(p.planet);
    });
  }

  planetary[gateNum].lines.push({
    line: entry.lineNumber,
    exaltPlanets,
    detriPlanets,
    hasExalt: exaltPlanets.length > 0,
    hasDetri: detriPlanets.length > 0
  });
});

// Sort lines within each gate
Object.values(planetary).forEach(g => {
  g.lines.sort((a, b) => a.line - b.line);
});

// === Build Combined Dataset ===
const PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth', 'North Node', 'South Node'];
const PILLAR_NAMES = { 1: 'Fire', 2: 'Water', 63: 'Truth', 64: 'Light' };

// Create lookup from gateMappings
const hierarchyLookup = {};
hierarchy.gateMappings.forEach(g => {
  hierarchyLookup[g.gate] = g;
});

// Build combined dataset: each entry is one line (384 total)
const combinedData = [];
for (let gate = 1; gate <= 64; gate++) {
  const hierData = hierarchyLookup[gate];
  const planetData = planetary[String(gate)];

  if (!hierData || !planetData) {
    console.error(`Missing data for gate ${gate}`);
    continue;
  }

  planetData.lines.forEach(lineData => {
    combinedData.push({
      gate,
      line: lineData.line,
      // Hierarchy data
      level: hierData.level,
      pillar: hierData.pillar,
      mystery: hierData.mystery,
      element: hierData.element,
      siddhi: hierData.siddhi,
      gateType: hierData.gateType,
      // Planetary data
      exaltPlanets: lineData.exaltPlanets || [],
      detriPlanets: lineData.detriPlanets || [],
      hasExalt: lineData.hasExalt,
      hasDetri: lineData.hasDetri,
      anomaly: lineData.anomaly
    });
  });
}

console.log(`Loaded ${combinedData.length} line records`);

// === Sanity Check: Output Example Gates ===
function sanityCheck() {
  const examples = [1, 30, 63, 55]; // Pillar, Letter standing wave, Pillar cross-zero, Letter cross-zero
  let output = '## Sanity Check: Example Gates\n\n';

  examples.forEach(gate => {
    const hierData = hierarchyLookup[gate];
    const lines = combinedData.filter(d => d.gate === gate);

    output += `### Gate ${gate} - ${hierData.siddhi}\n`;
    output += `- **Level**: ${hierData.level}\n`;
    output += `- **Pillar**: ${hierData.pillar} (${PILLAR_NAMES[hierData.pillar]})\n`;
    output += `- **Mystery**: ${hierData.mystery || 'N/A (is Pillar/Mystery)'}\n`;
    output += `- **Element**: ${hierData.element}\n`;
    output += `- **Gate Type**: ${hierData.gateType}\n\n`;

    output += '| Line | Exaltation | Detriment |\n';
    output += '|------|------------|----------|\n';
    lines.forEach(l => {
      output += `| ${l.line} | ${l.exaltPlanets.join(', ') || '(none)'} | ${l.detriPlanets.join(', ') || '(none)'} |\n`;
    });
    output += '\n';
  });

  return output;
}

// === Frequency Calculations ===
function calculateFrequencies() {
  const results = {
    byPillar: { exalt: {}, detri: {} },
    byMystery: { exalt: {}, detri: {} },
    byLevel: { exalt: {}, detri: {} },
    totals: { exalt: {}, detri: {} }
  };

  // Initialize structures
  [1, 2, 63, 64].forEach(p => {
    results.byPillar.exalt[p] = {};
    results.byPillar.detri[p] = {};
    PLANETS.forEach(pl => {
      results.byPillar.exalt[p][pl] = 0;
      results.byPillar.detri[p][pl] = 0;
    });
  });

  // Get all mysteries
  const allMysteries = [...new Set(hierarchy.gateMappings.filter(g => g.mystery).map(g => g.mystery))].sort((a,b) => a-b);
  allMysteries.forEach(m => {
    results.byMystery.exalt[m] = {};
    results.byMystery.detri[m] = {};
    PLANETS.forEach(pl => {
      results.byMystery.exalt[m][pl] = 0;
      results.byMystery.detri[m][pl] = 0;
    });
  });

  ['pillar', 'mystery', 'letter'].forEach(lvl => {
    results.byLevel.exalt[lvl] = {};
    results.byLevel.detri[lvl] = {};
    PLANETS.forEach(pl => {
      results.byLevel.exalt[lvl][pl] = 0;
      results.byLevel.detri[lvl][pl] = 0;
    });
  });

  PLANETS.forEach(pl => {
    results.totals.exalt[pl] = 0;
    results.totals.detri[pl] = 0;
  });

  // Count frequencies
  combinedData.forEach(d => {
    // Exaltations
    d.exaltPlanets.forEach(pl => {
      results.byPillar.exalt[d.pillar][pl]++;
      results.byLevel.exalt[d.level][pl]++;
      results.totals.exalt[pl]++;
      if (d.mystery) {
        results.byMystery.exalt[d.mystery][pl]++;
      }
    });

    // Detriments
    d.detriPlanets.forEach(pl => {
      results.byPillar.detri[d.pillar][pl]++;
      results.byLevel.detri[d.level][pl]++;
      results.totals.detri[pl]++;
      if (d.mystery) {
        results.byMystery.detri[d.mystery][pl]++;
      }
    });
  });

  return results;
}

// === ASCII Table Generation ===
function generatePillarTable(frequencies, type) {
  const pillars = [1, 2, 63, 64];
  const data = type === 'exalt' ? frequencies.byPillar.exalt : frequencies.byPillar.detri;
  const totals = type === 'exalt' ? frequencies.totals.exalt : frequencies.totals.detri;

  // Calculate lines per pillar (96 lines each)
  const linesPerPillar = 96;

  let output = `### Planet × Pillar (${type === 'exalt' ? 'Exaltation' : 'Detriment'})\n\n`;
  output += '```\n';
  output += '              │ Fire(1) │ Water(2) │ Truth(63) │ Light(64) │ Total\n';
  output += '──────────────┼─────────┼──────────┼───────────┼───────────┼──────\n';

  // Only show planets that appear at least once
  const activePlanets = PLANETS.filter(pl => totals[pl] > 0);

  activePlanets.forEach(planet => {
    const counts = pillars.map(p => data[p][planet]);
    const total = counts.reduce((a, b) => a + b, 0);
    const name = planet.padEnd(13);
    output += `${name} │ ${counts[0].toString().padStart(7)} │ ${counts[1].toString().padStart(8)} │ ${counts[2].toString().padStart(9)} │ ${counts[3].toString().padStart(9)} │ ${total.toString().padStart(5)}\n`;
  });

  // Totals row
  output += '──────────────┼─────────┼──────────┼───────────┼───────────┼──────\n';
  const pillarTotals = pillars.map(p => {
    return activePlanets.reduce((sum, pl) => sum + data[p][pl], 0);
  });
  const grandTotal = pillarTotals.reduce((a, b) => a + b, 0);
  output += `TOTAL         │ ${pillarTotals[0].toString().padStart(7)} │ ${pillarTotals[1].toString().padStart(8)} │ ${pillarTotals[2].toString().padStart(9)} │ ${pillarTotals[3].toString().padStart(9)} │ ${grandTotal.toString().padStart(5)}\n`;
  output += '```\n\n';

  return output;
}

function generateMysteryTable(frequencies, type) {
  const data = type === 'exalt' ? frequencies.byMystery.exalt : frequencies.byMystery.detri;
  const totals = type === 'exalt' ? frequencies.totals.exalt : frequencies.totals.detri;
  const mysteries = Object.keys(data).map(Number).sort((a, b) => a - b);

  let output = `### Planet × Mystery (${type === 'exalt' ? 'Exaltation' : 'Detriment'})\n\n`;
  output += 'Mystery families (4 Letter gates each = 24 lines per Mystery):\n\n';
  output += '```\n';

  // Header
  let header = '              │';
  mysteries.forEach(m => {
    header += ` ${m.toString().padStart(3)} │`;
  });
  header += ' Total';
  output += header + '\n';
  output += '──────────────┼' + mysteries.map(() => '─────┼').join('') + '──────\n';

  const activePlanets = PLANETS.filter(pl => totals[pl] > 0);

  activePlanets.forEach(planet => {
    let row = planet.padEnd(13) + ' │';
    let total = 0;
    mysteries.forEach(m => {
      const count = data[m][planet] || 0;
      total += count;
      row += ` ${count.toString().padStart(3)} │`;
    });
    row += ` ${total.toString().padStart(5)}`;
    output += row + '\n';
  });

  output += '```\n\n';
  return output;
}

function generateLevelTable(frequencies, type) {
  const levels = ['pillar', 'mystery', 'letter'];
  const data = type === 'exalt' ? frequencies.byLevel.exalt : frequencies.byLevel.detri;
  const totals = type === 'exalt' ? frequencies.totals.exalt : frequencies.totals.detri;

  // Lines per level: pillar=24, mystery=72, letter=288
  const linesPerLevel = { pillar: 24, mystery: 72, letter: 288 };

  let output = `### Planet × Hierarchy Level (${type === 'exalt' ? 'Exaltation' : 'Detriment'})\n\n`;
  output += 'Lines per level: Pillars (4 gates × 6 lines = 24), Mysteries (12 gates × 6 = 72), Letters (48 gates × 6 = 288)\n\n';
  output += '```\n';
  output += '              │ Pillar │ Mystery │ Letter │ Total\n';
  output += '──────────────┼────────┼─────────┼────────┼──────\n';

  const activePlanets = PLANETS.filter(pl => totals[pl] > 0);

  activePlanets.forEach(planet => {
    const counts = levels.map(l => data[l][planet]);
    const total = counts.reduce((a, b) => a + b, 0);
    const name = planet.padEnd(13);
    output += `${name} │ ${counts[0].toString().padStart(6)} │ ${counts[1].toString().padStart(7)} │ ${counts[2].toString().padStart(6)} │ ${total.toString().padStart(5)}\n`;
  });

  output += '──────────────┼────────┼─────────┼────────┼──────\n';
  const levelTotals = levels.map(l => activePlanets.reduce((sum, pl) => sum + data[l][pl], 0));
  const grandTotal = levelTotals.reduce((a, b) => a + b, 0);
  output += `TOTAL         │ ${levelTotals[0].toString().padStart(6)} │ ${levelTotals[1].toString().padStart(7)} │ ${levelTotals[2].toString().padStart(6)} │ ${grandTotal.toString().padStart(5)}\n`;
  output += '```\n\n';

  return output;
}

// === Chi-Square Analysis ===
function chiSquareAnalysis(frequencies) {
  let output = '## Statistical Analysis\n\n';
  output += '### Chi-Square Test for Uniformity\n\n';
  output += 'Testing whether planetary distributions across Pillars differ from uniform expectation.\n\n';

  const pillars = [1, 2, 63, 64];
  const activePlanets = PLANETS.filter(pl => frequencies.totals.exalt[pl] > 0);

  // For exaltations
  output += '#### Exaltation Distribution by Pillar\n\n';

  // Calculate pillar totals and expected values
  const pillarTotals = pillars.map(p =>
    activePlanets.reduce((sum, pl) => sum + frequencies.byPillar.exalt[p][pl], 0)
  );
  const grandTotal = pillarTotals.reduce((a, b) => a + b, 0);
  const expectedPerPillar = grandTotal / 4;

  // Chi-square for pillar distribution
  let chiSq = 0;
  pillars.forEach((p, i) => {
    const observed = pillarTotals[i];
    const contribution = Math.pow(observed - expectedPerPillar, 2) / expectedPerPillar;
    chiSq += contribution;
  });

  output += '| Pillar | Observed | Expected | (O-E)²/E |\n';
  output += '|--------|----------|----------|----------|\n';
  pillars.forEach((p, i) => {
    const observed = pillarTotals[i];
    const contribution = Math.pow(observed - expectedPerPillar, 2) / expectedPerPillar;
    output += `| ${PILLAR_NAMES[p]} (${p}) | ${observed} | ${expectedPerPillar.toFixed(1)} | ${contribution.toFixed(3)} |\n`;
  });
  output += `| **Total** | ${grandTotal} | ${grandTotal} | **χ² = ${chiSq.toFixed(3)}** |\n\n`;

  // df = 3, critical value at p=0.05 is 7.815
  const df = 3;
  const criticalValue = 7.815;
  output += `**Degrees of freedom**: ${df}\n`;
  output += `**Critical value (p=0.05)**: ${criticalValue}\n`;
  output += `**Result**: ${chiSq > criticalValue ? 'SIGNIFICANT - Pillars differ from uniform distribution' : 'NOT SIGNIFICANT - No evidence pillars differ from uniform'}\n\n`;

  // Per-planet chi-square
  output += '#### Per-Planet Chi-Square (across Pillars)\n\n';
  output += '| Planet | χ² | df | Significant? |\n';
  output += '|--------|-----|----|--------------|\n';

  activePlanets.forEach(planet => {
    const total = frequencies.totals.exalt[planet];
    if (total < 8) {
      output += `| ${planet} | - | - | (too few observations: ${total}) |\n`;
      return;
    }

    const expected = total / 4;
    let chi = 0;
    pillars.forEach(p => {
      const obs = frequencies.byPillar.exalt[p][planet];
      chi += Math.pow(obs - expected, 2) / expected;
    });

    const sig = chi > criticalValue ? '**YES**' : 'no';
    output += `| ${planet} | ${chi.toFixed(2)} | 3 | ${sig} |\n`;
  });

  output += '\n';
  return output;
}

// === Pattern Observations ===
function observePatterns(frequencies) {
  let output = '## Observed Patterns\n\n';

  const pillars = [1, 2, 63, 64];
  const activePlanets = PLANETS.filter(pl => frequencies.totals.exalt[pl] > 0);

  // Find dominant planets per pillar
  output += '### Dominant Planets by Pillar (Exaltation)\n\n';
  output += 'Top 3 planets by frequency in each Pillar:\n\n';

  pillars.forEach(p => {
    const counts = activePlanets.map(pl => ({
      planet: pl,
      count: frequencies.byPillar.exalt[p][pl]
    })).sort((a, b) => b.count - a.count);

    const top3 = counts.slice(0, 3);
    const pillarTotal = counts.reduce((sum, c) => sum + c.count, 0);
    output += `**${PILLAR_NAMES[p]} (Pillar ${p})**:\n`;
    top3.forEach((c, i) => {
      const pct = ((c.count / pillarTotal) * 100).toFixed(1);
      output += `${i + 1}. ${c.planet}: ${c.count} (${pct}%)\n`;
    });
    output += '\n';
  });

  // Elemental correspondence check
  output += '### Elemental Correspondence Check\n\n';
  output += 'Testing proposed elemental → planet correspondences:\n\n';

  const elementalPlanets = {
    'Fire': ['Sun', 'Mars'],
    'Water': ['Moon', 'Venus'],
    'Truth': ['Saturn', 'Pluto'],
    'Light': ['Uranus', 'Mercury', 'Jupiter']
  };

  output += '| Pillar | Predicted Planets | Predicted Count | Actual Count | Match? |\n';
  output += '|--------|-------------------|-----------------|--------------|--------|\n';

  pillars.forEach(p => {
    const element = PILLAR_NAMES[p];
    const predicted = elementalPlanets[element];
    const predictedCount = predicted.reduce((sum, pl) => sum + (frequencies.byPillar.exalt[p][pl] || 0), 0);
    const pillarTotal = activePlanets.reduce((sum, pl) => sum + frequencies.byPillar.exalt[p][pl], 0);
    const expectedIfUniform = (pillarTotal / activePlanets.length) * predicted.length;
    const ratio = predictedCount / expectedIfUniform;
    const match = ratio > 1.2 ? '**YES**' : ratio > 0.8 ? 'partial' : 'no';
    output += `| ${element} (${p}) | ${predicted.join(', ')} | ${expectedIfUniform.toFixed(1)} | ${predictedCount} | ${match} (${ratio.toFixed(2)}x) |\n`;
  });

  output += '\n**Interpretation**: Values >1.0 indicate predicted planets appear more than expected by chance.\n\n';

  return output;
}

// === Generate Full Report ===
function generateReport() {
  const frequencies = calculateFrequencies();

  let report = `# Phase 1: Descriptive Analysis - Nuclear Hierarchy Research

**Generated**: ${new Date().toISOString().split('T')[0]}

## Overview

This report characterises planetary distributions across the nuclear hierarchy without making predictive claims.

**Data Sources**:
- Nuclear hierarchy: \`knowledge-systems/nuclear-hierarchy/mappings/nuclear-hierarchy-mappings.json\`
- Planetary assignments: \`knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json\`

**Dataset**: ${combinedData.length} line records (64 gates × 6 lines)

---

`;

  report += sanityCheck();
  report += '---\n\n';
  report += '## Frequency Tables\n\n';
  report += generatePillarTable(frequencies, 'exalt');
  report += generatePillarTable(frequencies, 'detri');
  report += generateLevelTable(frequencies, 'exalt');
  report += generateLevelTable(frequencies, 'detri');
  report += generateMysteryTable(frequencies, 'exalt');
  report += '---\n\n';
  report += chiSquareAnalysis(frequencies);
  report += '---\n\n';
  report += observePatterns(frequencies);

  report += `---

## Summary

### Key Findings

1. **Data Merge**: Successfully merged ${combinedData.length} line records with hierarchy positions
2. **Distribution**: See tables above for complete frequency counts
3. **Chi-Square**: See statistical analysis for uniformity tests
4. **Elemental Correspondence**: See pattern observations for preliminary check

### Recommendation for Phase 2

Based on the descriptive statistics above, Phase 2 hypothesis testing should proceed to determine statistical significance using permutation tests.

---

*Report generated by: nuclear-hierarchy-phase1-descriptive.js*
`;

  return report;
}

// === Main ===
const report = generateReport();
const outputPath = path.join(reportsDir, 'PHASE-1-DESCRIPTIVE-ANALYSIS.md');
fs.writeFileSync(outputPath, report);
console.log(`Report written to: ${outputPath}`);

// Also output to console
console.log('\n' + '='.repeat(80));
console.log(report);
