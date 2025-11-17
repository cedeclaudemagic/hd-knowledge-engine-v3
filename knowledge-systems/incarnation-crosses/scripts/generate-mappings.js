#!/usr/bin/env node
/**
 * Generate Incarnation Crosses Mappings
 *
 * This script inverts the cross-centric data structure into a gate-centric view.
 *
 * INPUT (Cross-centric):
 *   { "Education 2": { gates: [11, 12, 46, 25], gateRoles: {...} } }
 *
 * OUTPUT (Gate-centric):
 *   { "gateNumber": 11, "crossesAsSun": [...], "crossesAsEarth": [...] }
 *
 * This inversion enables the root docking system to attach cross knowledge to gates.
 */

const fs = require('fs');
const path = require('path');

// Load source data
const sourceDataPath = path.join(__dirname, '../../../data/source/extracted/incarnation-crosses-extracted-data.json');
const sourceData = JSON.parse(fs.readFileSync(sourceDataPath, 'utf8'));

console.log('=== INCARNATION CROSSES MAPPING GENERATOR ===\n');
console.log('Source data loaded:', Object.keys(sourceData.crosses).length, 'crosses\n');

/**
 * Initialize gate-centric structure
 * Each gate will track all crosses it participates in, organized by role
 */
function initializeGateMappings() {
  const mappings = {};

  for (let gateNumber = 1; gateNumber <= 64; gateNumber++) {
    mappings[gateNumber] = {
      gateNumber: gateNumber,
      crossesAsPersonalitySun: [],
      crossesAsPersonalityEarth: [],
      crossesAsDesignSun: [],
      crossesAsDesignEarth: []
    };
  }

  return mappings;
}

/**
 * Invert cross → gates into gates → crosses
 */
function invertCrossData() {
  console.log('Inverting cross-centric data to gate-centric view...\n');

  const gateMappings = initializeGateMappings();
  const crosses = sourceData.crosses;

  let crossCount = 0;

  // Process each cross
  for (const crossName in crosses) {
    const cross = crosses[crossName];
    crossCount++;

    // For each gate in this cross
    cross.gates.forEach(gateNumber => {
      const role = cross.gateRoles[gateNumber.toString()];

      // Create cross reference
      const crossReference = {
        name: crossName,
        type: cross.type,
        gates: cross.gates,
        personalitySun: cross.personalitySun,
        personalityEarth: cross.personalityEarth,
        designSun: cross.designSun,
        designEarth: cross.designEarth
      };

      // Add to appropriate role array
      if (role === 'Personality Sun') {
        gateMappings[gateNumber].crossesAsPersonalitySun.push(crossReference);
      } else if (role === 'Personality Earth') {
        gateMappings[gateNumber].crossesAsPersonalityEarth.push(crossReference);
      } else if (role === 'Design Sun') {
        gateMappings[gateNumber].crossesAsDesignSun.push(crossReference);
      } else if (role === 'Design Earth') {
        gateMappings[gateNumber].crossesAsDesignEarth.push(crossReference);
      } else {
        console.warn(`Unknown role "${role}" for gate ${gateNumber} in cross "${crossName}"`);
      }
    });
  }

  console.log('✓ Processed', crossCount, 'crosses');

  // Deduplicate crosses in each gate's role arrays (to handle data quality issues)
  console.log('Deduplicating crosses...');
  let deduplicationCount = 0;

  for (let gateNumber = 1; gateNumber <= 64; gateNumber++) {
    const gate = gateMappings[gateNumber];

    // Helper function to deduplicate by cross name
    const deduplicateByName = (crosses) => {
      const seen = new Set();
      const deduplicated = [];

      crosses.forEach(cross => {
        if (!seen.has(cross.name)) {
          seen.add(cross.name);
          deduplicated.push(cross);
        } else {
          deduplicationCount++;
        }
      });

      return deduplicated;
    };

    gate.crossesAsPersonalitySun = deduplicateByName(gate.crossesAsPersonalitySun);
    gate.crossesAsPersonalityEarth = deduplicateByName(gate.crossesAsPersonalityEarth);
    gate.crossesAsDesignSun = deduplicateByName(gate.crossesAsDesignSun);
    gate.crossesAsDesignEarth = deduplicateByName(gate.crossesAsDesignEarth);
  }

  if (deduplicationCount > 0) {
    console.log('✓ Removed', deduplicationCount, 'duplicate cross references');
  }

  return gateMappings;
}

/**
 * Calculate statistics for each gate
 */
function calculateStatistics(gateMappings) {
  console.log('\nCalculating statistics...\n');

  const stats = {
    gatesWithCrosses: 0,
    totalCrossParticipations: 0,
    minParticipations: Infinity,
    maxParticipations: 0,
    avgParticipations: 0,
    gateStats: {}
  };

  for (let gateNumber = 1; gateNumber <= 64; gateNumber++) {
    const gate = gateMappings[gateNumber];
    const totalCrosses =
      gate.crossesAsPersonalitySun.length +
      gate.crossesAsPersonalityEarth.length +
      gate.crossesAsDesignSun.length +
      gate.crossesAsDesignEarth.length;

    if (totalCrosses > 0) {
      stats.gatesWithCrosses++;
    }

    stats.totalCrossParticipations += totalCrosses;
    stats.minParticipations = Math.min(stats.minParticipations, totalCrosses);
    stats.maxParticipations = Math.max(stats.maxParticipations, totalCrosses);

    stats.gateStats[gateNumber] = {
      total: totalCrosses,
      asPersonalitySun: gate.crossesAsPersonalitySun.length,
      asPersonalityEarth: gate.crossesAsPersonalityEarth.length,
      asDesignSun: gate.crossesAsDesignSun.length,
      asDesignEarth: gate.crossesAsDesignEarth.length
    };
  }

  stats.avgParticipations = Math.round(stats.totalCrossParticipations / 64 * 10) / 10;

  console.log('Statistics:');
  console.log('  Gates with crosses:', stats.gatesWithCrosses + '/64');
  console.log('  Total cross participations:', stats.totalCrossParticipations);
  console.log('  Min participations per gate:', stats.minParticipations);
  console.log('  Max participations per gate:', stats.maxParticipations);
  console.log('  Avg participations per gate:', stats.avgParticipations);

  return stats;
}

/**
 * Validate the mapping
 */
function validateMapping(gateMappings) {
  console.log('\n=== VALIDATION ===\n');

  const errors = [];
  const warnings = [];

  // Check all 64 gates present
  for (let gateNumber = 1; gateNumber <= 64; gateNumber++) {
    if (!gateMappings[gateNumber]) {
      errors.push(`Gate ${gateNumber} missing from mappings`);
    }
  }

  // Count total unique crosses
  const uniqueCrosses = new Set();
  for (let gateNumber = 1; gateNumber <= 64; gateNumber++) {
    const gate = gateMappings[gateNumber];
    if (gate) {
      gate.crossesAsPersonalitySun.forEach(c => uniqueCrosses.add(c.name));
      gate.crossesAsPersonalityEarth.forEach(c => uniqueCrosses.add(c.name));
      gate.crossesAsDesignSun.forEach(c => uniqueCrosses.add(c.name));
      gate.crossesAsDesignEarth.forEach(c => uniqueCrosses.add(c.name));
    }
  }

  console.log('Validation checks:');
  console.log('  ✓ All 64 gates present:', errors.length === 0 ? 'PASS' : 'FAIL');
  console.log('  ✓ Total unique crosses:', uniqueCrosses.size, '(expected: 192)');

  if (uniqueCrosses.size !== 192) {
    errors.push(`Expected 190 crosses, found ${uniqueCrosses.size}`);
  }

  // Verify each cross has exactly 4 gates
  const crossGateCounts = {};
  for (let gateNumber = 1; gateNumber <= 64; gateNumber++) {
    const gate = gateMappings[gateNumber];
    if (gate) {
      [
        ...gate.crossesAsPersonalitySun,
        ...gate.crossesAsPersonalityEarth,
        ...gate.crossesAsDesignSun,
        ...gate.crossesAsDesignEarth
      ].forEach(cross => {
        if (!crossGateCounts[cross.name]) {
          crossGateCounts[cross.name] = new Set();
        }
        crossGateCounts[cross.name].add(gateNumber);
      });
    }
  }

  let crossesWithWrongGateCount = 0;
  for (const crossName in crossGateCounts) {
    if (crossGateCounts[crossName].size !== 4) {
      crossesWithWrongGateCount++;
      warnings.push(`Cross "${crossName}" has ${crossGateCounts[crossName].size} gates (expected 4)`);
    }
  }

  console.log('  ✓ All crosses have 4 gates:', crossesWithWrongGateCount === 0 ? 'PASS' : 'FAIL');

  if (errors.length > 0) {
    console.log('\nERRORS:');
    errors.forEach(e => console.log('  ✗', e));
  }

  if (warnings.length > 0 && warnings.length <= 10) {
    console.log('\nWARNINGS:');
    warnings.forEach(w => console.log('  ⚠', w));
  } else if (warnings.length > 10) {
    console.log('\nWARNINGS:', warnings.length, 'warnings (not displayed)');
  }

  const isValid = errors.length === 0;
  console.log('\nOverall validation:', isValid ? '✅ PASSED' : '❌ FAILED');

  return { isValid, errors, warnings };
}

/**
 * Generate gate-cross mappings JSON
 */
function generateGateCrossMappings(gateMappings, stats) {
  console.log('\n=== GENERATING GATE-CROSS MAPPINGS ===\n');

  const mappings = {
    systemName: 'Incarnation Crosses',
    version: '1.0.0',
    description: 'Gate-centric view of incarnation crosses showing each gate\'s role in various crosses',
    completeness: 'full',
    statistics: {
      totalGates: 64,
      gatesWithCrosses: stats.gatesWithCrosses,
      totalCrossParticipations: stats.totalCrossParticipations,
      avgParticipationsPerGate: stats.avgParticipations,
      minParticipations: stats.minParticipations,
      maxParticipations: stats.maxParticipations
    },
    mappings: []
  };

  // Convert object to array
  for (let gateNumber = 1; gateNumber <= 64; gateNumber++) {
    const gate = gateMappings[gateNumber];

    mappings.mappings.push({
      gateNumber: gateNumber,
      knowledge: {
        crossesAsPersonalitySun: gate.crossesAsPersonalitySun,
        crossesAsPersonalityEarth: gate.crossesAsPersonalityEarth,
        crossesAsDesignSun: gate.crossesAsDesignSun,
        crossesAsDesignEarth: gate.crossesAsDesignEarth
      },
      statistics: stats.gateStats[gateNumber]
    });
  }

  return mappings;
}

/**
 * Generate cross definitions (cross-centric reference)
 */
function generateCrossDefinitions() {
  console.log('=== GENERATING CROSS DEFINITIONS ===\n');

  const definitions = {
    systemName: 'Incarnation Crosses',
    version: '1.0.0',
    description: 'Cross-centric reference of all 190 incarnation crosses',
    totalCrosses: Object.keys(sourceData.crosses).length,
    crossTypes: {
      LAX: 0,
      RAX: 0,
      JX: 0
    },
    crosses: {}
  };

  // Copy crosses and count types
  for (const crossName in sourceData.crosses) {
    const cross = sourceData.crosses[crossName];
    definitions.crosses[crossName] = cross;
    definitions.crossTypes[cross.type]++;
  }

  console.log('Cross definitions:');
  console.log('  Total crosses:', definitions.totalCrosses);
  console.log('  LAX (Left Angle):', definitions.crossTypes.LAX);
  console.log('  RAX (Right Angle):', definitions.crossTypes.RAX);
  console.log('  JX (Juxtaposition):', definitions.crossTypes.JX);

  return definitions;
}

/**
 * Save JSON files
 */
function saveFiles(gateCrossMappings, crossDefinitions) {
  console.log('\n=== SAVING FILES ===\n');

  const mappingsPath = path.join(__dirname, '../mappings/gate-cross-mappings.json');
  const definitionsPath = path.join(__dirname, '../mappings/cross-definitions.json');

  fs.writeFileSync(mappingsPath, JSON.stringify(gateCrossMappings, null, 2), 'utf8');
  console.log('✓ Saved gate-cross mappings:', path.relative(process.cwd(), mappingsPath));

  fs.writeFileSync(definitionsPath, JSON.stringify(crossDefinitions, null, 2), 'utf8');
  console.log('✓ Saved cross definitions:', path.relative(process.cwd(), definitionsPath));

  // Show file sizes
  const mappingsSize = (fs.statSync(mappingsPath).size / 1024).toFixed(2);
  const definitionsSize = (fs.statSync(definitionsPath).size / 1024).toFixed(2);

  console.log('\nFile sizes:');
  console.log('  Gate-cross mappings:', mappingsSize, 'KB');
  console.log('  Cross definitions:', definitionsSize, 'KB');
}

/**
 * Main execution
 */
function main() {
  try {
    // Invert data structure
    const gateMappings = invertCrossData();

    // Calculate statistics
    const stats = calculateStatistics(gateMappings);

    // Validate
    const validation = validateMapping(gateMappings);

    if (!validation.isValid) {
      console.error('\n❌ Validation failed - aborting');
      process.exit(1);
    }

    // Generate output files
    const gateCrossMappings = generateGateCrossMappings(gateMappings, stats);
    const crossDefinitions = generateCrossDefinitions();

    // Save files
    saveFiles(gateCrossMappings, crossDefinitions);

    console.log('\n✅ Mapping generation complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  initializeGateMappings,
  invertCrossData,
  validateMapping,
  generateGateCrossMappings,
  generateCrossDefinitions
};
