# SESSION 07: EXAMPLES & DEMOS

**Duration:** 2 hours
**Dependencies:** Session 05 complete
**Type:** Parallel (can run alongside sessions 06, 08, 09)
**Branch:** `session-07-examples`

---

## OBJECTIVES

Create comprehensive usage examples and demonstration scripts showing all major features of V3.

---

## PREREQUISITES

### Before Starting:

- [ ] Session 05 complete and merged to main
- [ ] All systems tested and working
- [ ] Create branch: `git checkout -b session-07-examples`

---

## DELIVERABLES

1. Basic usage examples
2. Configuration examples
3. Extension layer examples
4. TypeScript usage examples
5. Real-world scenario demonstrations
6. Interactive demo script

---

## TASKS

### Task 7.1: Create Examples Directory

```bash
mkdir -p examples
mkdir -p examples/basic
mkdir -p examples/configuration
mkdir -p examples/extensions
mkdir -p examples/typescript
mkdir -p examples/scenarios
```

### Task 7.2: Basic Usage Examples

**File:** `examples/basic/01-simple-gate-query.js`

```javascript
/**
 * Example 01: Simple Gate Query
 *
 * The most basic usage - querying a single gate.
 */

const engine = require('../../unified-query-engine');

// Get knowledge for Gate 13
const gate13 = engine.getGateKnowledge(13);

console.log('=== GATE 13: THE LISTENER ===\n');

console.log('Gene Keys:');
console.log(`  Shadow: ${gate13.geneKeys.shadow}`);
console.log(`  Gift: ${gate13.geneKeys.gift}`);
console.log(`  Siddhi: ${gate13.geneKeys.siddhi}`);

console.log('\nI Ching:');
console.log(`  Name: ${gate13.iching.name}`);
console.log(`  Hexagram: #${gate13.iching.hexagramNumber}`);

console.log('\nHuman Design:');
console.log(`  Name: ${gate13.hdGates.name}`);
console.log(`  Center: ${gate13.hdGates.center}`);

console.log('\nPosition:');
console.log(`  Angle: ${gate13.angle}°`);
console.log(`  Wheel Index: ${gate13.wheelIndex}`);
```

**File:** `examples/basic/02-line-query.js`

```javascript
/**
 * Example 02: Line Query
 *
 * Querying a specific line within a gate.
 */

const engine = require('../../unified-query-engine');

// Get knowledge for Gate 13, Line 4
const line = engine.getLineKnowledge(13, 4);

console.log('=== GATE 13, LINE 4 ===\n');

console.log(`Line: ${line.lineNumber}`);
console.log(`Shadow: ${line.geneKeys.shadow}`);
console.log(`Gift: ${line.geneKeys.gift}`);

// Line-specific traditional knowledge
if (line.lineKnowledge) {
  console.log('\nTraditional Line Knowledge:');
  if (line.lineKnowledge.exaltation) {
    console.log(`  Exaltation: ${line.lineKnowledge.exaltation.planet}`);
  }
  if (line.lineKnowledge.detriment) {
    console.log(`  Detriment: ${line.lineKnowledge.detriment.planet}`);
  }
}
```

**File:** `examples/basic/03-iterating-all-gates.js`

```javascript
/**
 * Example 03: Iterating All Gates
 *
 * Loop through all 64 gates.
 */

const engine = require('../../unified-query-engine');

console.log('=== ALL 64 GATES ===\n');

for (let i = 1; i <= 64; i++) {
  const gate = engine.getGateKnowledge(i);

  console.log(
    `Gate ${i.toString().padStart(2)}: ` +
    `${gate.geneKeys.gift.padEnd(20)} ` +
    `(${gate.hdGates.center})`
  );
}
```

### Task 7.3: Configuration Examples

**File:** `examples/configuration/01-using-presets.js`

```javascript
/**
 * Configuration Example 01: Using Presets
 *
 * Switch between different wheel configurations.
 */

const engine = require('../../unified-query-engine');

console.log('=== CONFIGURATION PRESETS ===\n');

// Default configuration
console.log('1. HD Standard (default):');
const gate41default = engine.getGateKnowledge(41);
console.log(`   Gate 41 at: ${gate41default.angle}°\n`);

// Switch to I Ching traditional
console.log('2. I Ching Traditional:');
engine.setWheelConfiguration('iching-traditional');
const gate41iching = engine.getGateKnowledge(41);
console.log(`   Gate 41 at: ${gate41iching.angle}°`);
console.log('   (Gate 41 now at north position)\n');

// Reset to default
console.log('3. Reset to default:');
engine.resetConfiguration();
const gate41reset = engine.getGateKnowledge(41);
console.log(`   Gate 41 at: ${gate41reset.angle}°\n`);
```

**File:** `examples/configuration/02-custom-rotation.js`

```javascript
/**
 * Configuration Example 02: Custom Rotation
 *
 * Apply rotation offset to the wheel.
 */

const engine = require('../../unified-query-engine');

console.log('=== CUSTOM ROTATION ===\n');

// Original position
const gate13original = engine.getGateKnowledge(13);
console.log(`Gate 13 original: ${gate13original.angle}°`);

// Rotate 45 degrees
engine.setWheelConfiguration({
  rotationOffset: 45
});
const gate13rotated = engine.getGateKnowledge(13);
console.log(`Gate 13 rotated 45°: ${gate13rotated.angle}°`);

// Rotate 90 degrees
engine.setWheelConfiguration({
  rotationOffset: 90
});
const gate13rotated90 = engine.getGateKnowledge(13);
console.log(`Gate 13 rotated 90°: ${gate13rotated90.angle}°`);

// Reset
engine.resetConfiguration();
```

**File:** `examples/configuration/03-direction-change.js`

```javascript
/**
 * Configuration Example 03: Direction Change
 *
 * Change wheel direction (clockwise vs counter-clockwise).
 */

const engine = require('../../unified-query-engine');

console.log('=== DIRECTION CHANGE ===\n');

// Counter-clockwise (default)
const gate10ccw = engine.getGateKnowledge(10);
const gate11ccw = engine.getGateKnowledge(11);
console.log('Counter-clockwise:');
console.log(`  Gate 10: ${gate10ccw.angle}°`);
console.log(`  Gate 11: ${gate11ccw.angle}°\n`);

// Clockwise
engine.setWheelConfiguration({
  direction: 'clockwise'
});
const gate10cw = engine.getGateKnowledge(10);
const gate11cw = engine.getGateKnowledge(11);
console.log('Clockwise:');
console.log(`  Gate 10: ${gate10cw.angle}°`);
console.log(`  Gate 11: ${gate11cw.angle}°\n`);

engine.resetConfiguration();
```

### Task 7.4: Extension Examples

**File:** `examples/extensions/01-collection-queries.js`

```javascript
/**
 * Extension Example 01: Collection Queries
 *
 * Get complete collections of knowledge elements.
 */

const extensions = require('../../extensions');

console.log('=== COLLECTION QUERIES ===\n');

// All channels
const channels = extensions.getAllChannels();
console.log(`Total Channels: ${channels.total}`);
console.log(`Circuits: ${Object.keys(channels.byCircuit).join(', ')}\n`);

// All centers
const centers = extensions.getAllCenters();
console.log(`Total Centers: ${centers.total}`);
console.log('Centers:');
centers.centers.forEach(center => {
  console.log(`  ${center.name} (${center.type}): ${center.gates.length} gates`);
});

// All codon rings
const rings = extensions.getAllCodonRings();
console.log(`\nTotal Codon Rings: ${rings.total}`);
```

**File:** `examples/extensions/02-enriched-queries.js`

```javascript
/**
 * Extension Example 02: Enriched Queries
 *
 * Get gates and channels with full context.
 */

const extensions = require('../../extensions');

console.log('=== ENRICHED QUERIES ===\n');

// Enriched gate
const enrichedGate = extensions.getEnrichedGate(13);
console.log('Enriched Gate 13:');
console.log(`  Gene Keys Gift: ${enrichedGate.geneKeys.gift}`);
console.log(`  Quarter: ${enrichedGate.quarter.name}`);
console.log(`  Trigram: ${enrichedGate.trigram.trigram}`);
console.log(`  Face: ${enrichedGate.face.name}`);
console.log(`  Position: ${enrichedGate.position.angle}°\n`);

// Enriched channel
const channel = extensions.getEnrichedChannel(13, 33);
console.log(`Channel: ${channel.name}`);
console.log(`  Gate ${channel.gates[0]}: ${channel.gate1Knowledge.geneKeys.gift}`);
console.log(`  Gate ${channel.gates[1]}: ${channel.gate2Knowledge.geneKeys.gift}`);
console.log(`  Circuit: ${channel.circuit}`);
```

**File:** `examples/extensions/03-filtered-queries.js`

```javascript
/**
 * Extension Example 03: Filtered Queries
 *
 * Get subsets based on specific criteria.
 */

const extensions = require('../../extensions');

console.log('=== FILTERED QUERIES ===\n');

// Gates by center
const gGates = extensions.getGatesByCenter('G Center');
console.log(`G Center Gates (${gGates.length}):`);
gGates.forEach(gate => {
  console.log(`  Gate ${gate.geneKeys.gate}: ${gate.geneKeys.gift}`);
});

// Gates by circuit
console.log('\nIndividual Circuit Gates:');
const individualGates = extensions.getGatesByCircuit('Individual');
console.log(`  Total: ${individualGates.length} gates`);

// Channels by circuit
console.log('\nTribal Circuit Channels:');
const tribalChannels = extensions.getChannelsByCircuit('Tribal');
tribalChannels.forEach(ch => {
  console.log(`  ${ch.name} (${ch.gates[0]}-${ch.gates[1]})`);
});
```

**File:** `examples/extensions/04-relationship-queries.js`

```javascript
/**
 * Extension Example 04: Relationship Queries
 *
 * Explore connections between elements.
 */

const extensions = require('../../extensions');

console.log('=== RELATIONSHIP QUERIES ===\n');

// Programming partner
const gate13 = extensions.getGateProgrammingPartner(13);
console.log('Programming Partner for Gate 13:');
console.log(`  Gate ${gate13.geneKeys.gate}: ${gate13.geneKeys.gift}\n`);

// Channel between gates
const channel = extensions.getChannelForGates(13, 33);
console.log(`Channel between 13-33: ${channel.name}\n`);

// Codon ring partners
const partners = extensions.getCodonRingPartners(13);
console.log(`Codon Ring Partners for Gate 13:`);
partners.forEach(p => {
  console.log(`  Gate ${p.geneKeys.gate}: ${p.geneKeys.gift}`);
});

// Harmonic gates
const harmonics = extensions.getHarmonicGates(13);
console.log(`\nHarmonic Gates for Gate 13:`);
harmonics.forEach(h => {
  console.log(`  Gate ${h.geneKeys.gate}: ${h.geneKeys.gift}`);
});
```

### Task 7.5: Real-World Scenarios

**File:** `examples/scenarios/01-bodygraph-analysis.js`

```javascript
/**
 * Scenario 01: Bodygraph Analysis
 *
 * Analyze defined channels and centers from birth data.
 */

const engine = require('../../unified-query-engine');
const extensions = require('../../extensions');

// Example: Someone with gates 13 and 33 defined
const definedGates = [13, 33, 7, 31];

console.log('=== BODYGRAPH ANALYSIS ===\n');

// Find defined channels
console.log('Defined Channels:');
const allChannels = extensions.getAllChannels();
const definedChannels = allChannels.channels.filter(channel => {
  return definedGates.includes(channel.gates[0]) &&
         definedGates.includes(channel.gates[1]);
});

definedChannels.forEach(ch => {
  console.log(`  ${ch.name} (${ch.gates[0]}-${ch.gates[1]})`);
  console.log(`    Circuit: ${ch.circuit}`);
});

// Find defined centers
console.log('\nDefined Centers:');
const centers = new Set();
definedGates.forEach(gateNum => {
  const gate = engine.getGateKnowledge(gateNum);
  centers.add(gate.hdGates.center);
});

centers.forEach(center => {
  console.log(`  ${center}`);
});
```

**File:** `examples/scenarios/02-transit-analysis.js`

```javascript
/**
 * Scenario 02: Transit Analysis
 *
 * Analyze current planetary transits.
 */

const engine = require('../../unified-query-engine');
const extensions = require('../../extensions');

// Example: Current transits
const transits = {
  sun: { gate: 13, line: 4 },
  earth: { gate: 7, line: 4 },
  moon: { gate: 33, line: 2 }
};

console.log('=== TRANSIT ANALYSIS ===\n');

Object.entries(transits).forEach(([planet, position]) => {
  const knowledge = engine.getLineKnowledge(position.gate, position.line);

  console.log(`${planet.toUpperCase()}:`);
  console.log(`  Gate ${position.gate}.${position.line}: ${knowledge.hdGates.name}`);
  console.log(`  Gift: ${knowledge.geneKeys.gift}`);
  console.log(`  Center: ${knowledge.hdGates.center}`);
  console.log();
});

// Check if transits form channels
console.log('Transit Channels:');
const transitGates = Object.values(transits).map(t => t.gate);
const allChannels = extensions.getAllChannels();

allChannels.channels.forEach(channel => {
  if (transitGates.includes(channel.gates[0]) &&
      transitGates.includes(channel.gates[1])) {
    console.log(`  ${channel.name} activated!`);
  }
});
```

**File:** `examples/scenarios/03-composite-analysis.js`

```javascript
/**
 * Scenario 03: Composite Analysis
 *
 * Analyze relationship composite (two charts combined).
 */

const engine = require('../../unified-query-engine');
const extensions = require('../../extensions');

// Person A gates
const personA = [13, 7, 1, 2];

// Person B gates
const personB = [33, 31, 8, 14];

console.log('=== COMPOSITE ANALYSIS ===\n');

// Combined gates
const combined = [...new Set([...personA, ...personB])];

// Find composite channels
console.log('Composite Channels:');
const allChannels = extensions.getAllChannels();
const compositeChannels = allChannels.channels.filter(channel => {
  return combined.includes(channel.gates[0]) &&
         combined.includes(channel.gates[1]);
});

compositeChannels.forEach(ch => {
  const fromA = personA.includes(ch.gates[0]) || personA.includes(ch.gates[1]);
  const fromB = personB.includes(ch.gates[0]) || personB.includes(ch.gates[1]);

  console.log(`  ${ch.name}`);
  if (fromA && fromB) {
    console.log(`    (Electromagnetic connection)`);
  }
});

// Find composite defined centers
console.log('\nComposite Defined Centers:');
const centers = new Set();
combined.forEach(gateNum => {
  const gate = engine.getGateKnowledge(gateNum);
  centers.add(gate.hdGates.center);
});

centers.forEach(center => {
  console.log(`  ${center}`);
});
```

### Task 7.6: Interactive Demo

**File:** `examples/interactive-demo.js`

```javascript
#!/usr/bin/env node

/**
 * Interactive Demo
 *
 * Run with: node examples/interactive-demo.js
 */

const readline = require('readline');
const engine = require('../unified-query-engine');
const extensions = require('../extensions');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('╔═══════════════════════════════════════╗');
console.log('║  HD KNOWLEDGE ENGINE V3 - DEMO        ║');
console.log('╚═══════════════════════════════════════╝\n');

function showMenu() {
  console.log('\nWhat would you like to do?\n');
  console.log('1. Query a gate');
  console.log('2. Query a line');
  console.log('3. Show all channels');
  console.log('4. Show all centers');
  console.log('5. Change configuration');
  console.log('6. Exit\n');
}

function queryGate() {
  rl.question('Enter gate number (1-64): ', (answer) => {
    const gateNum = parseInt(answer);

    if (gateNum < 1 || gateNum > 64) {
      console.log('❌ Invalid gate number');
      showMenu();
      handleInput();
      return;
    }

    const gate = engine.getGateKnowledge(gateNum);

    console.log(`\n=== GATE ${gateNum}: ${gate.hdGates.name} ===`);
    console.log(`Shadow: ${gate.geneKeys.shadow}`);
    console.log(`Gift: ${gate.geneKeys.gift}`);
    console.log(`Siddhi: ${gate.geneKeys.siddhi}`);
    console.log(`I Ching: ${gate.iching.name}`);
    console.log(`Center: ${gate.hdGates.center}`);
    console.log(`Position: ${gate.angle}°`);

    showMenu();
    handleInput();
  });
}

function queryLine() {
  rl.question('Enter gate number (1-64): ', (gateAnswer) => {
    const gateNum = parseInt(gateAnswer);

    rl.question('Enter line number (1-6): ', (lineAnswer) => {
      const lineNum = parseInt(lineAnswer);

      if (gateNum < 1 || gateNum > 64 || lineNum < 1 || lineNum > 6) {
        console.log('❌ Invalid input');
        showMenu();
        handleInput();
        return;
      }

      const line = engine.getLineKnowledge(gateNum, lineNum);

      console.log(`\n=== GATE ${gateNum}, LINE ${lineNum} ===`);
      console.log(`Shadow: ${line.geneKeys.shadow}`);
      console.log(`Gift: ${line.geneKeys.gift}`);

      showMenu();
      handleInput();
    });
  });
}

function showChannels() {
  const result = extensions.getAllChannels();

  console.log(`\n=== ALL ${result.total} CHANNELS ===\n`);

  result.channels.forEach(ch => {
    console.log(`${ch.name} (${ch.gates[0]}-${ch.gates[1]}) - ${ch.circuit}`);
  });

  showMenu();
  handleInput();
}

function showCenters() {
  const result = extensions.getAllCenters();

  console.log(`\n=== ALL ${result.total} CENTERS ===\n`);

  result.centers.forEach(center => {
    console.log(`${center.name} (${center.type})`);
    console.log(`  Gates: ${center.gates.join(', ')}`);
    console.log();
  });

  showMenu();
  handleInput();
}

function changeConfig() {
  console.log('\nConfiguration Presets:');
  console.log('1. HD Standard (default)');
  console.log('2. I Ching Traditional');
  console.log('3. Custom rotation\n');

  rl.question('Choose preset (1-3): ', (answer) => {
    const choice = parseInt(answer);

    switch(choice) {
      case 1:
        engine.setWheelConfiguration('hd-standard');
        console.log('✅ Set to HD Standard');
        break;
      case 2:
        engine.setWheelConfiguration('iching-traditional');
        console.log('✅ Set to I Ching Traditional');
        break;
      case 3:
        rl.question('Enter rotation offset (degrees): ', (degrees) => {
          engine.setWheelConfiguration({
            rotationOffset: parseFloat(degrees)
          });
          console.log(`✅ Set rotation to ${degrees}°`);
          showMenu();
          handleInput();
        });
        return;
    }

    showMenu();
    handleInput();
  });
}

function handleInput() {
  rl.question('Choice: ', (answer) => {
    const choice = parseInt(answer);

    switch(choice) {
      case 1:
        queryGate();
        break;
      case 2:
        queryLine();
        break;
      case 3:
        showChannels();
        break;
      case 4:
        showCenters();
        break;
      case 5:
        changeConfig();
        break;
      case 6:
        console.log('\nGoodbye!\n');
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('❌ Invalid choice');
        showMenu();
        handleInput();
    }
  });
}

// Start
showMenu();
handleInput();
```

Make executable:
```bash
chmod +x examples/interactive-demo.js
```

### Task 7.7: Create Examples README

**File:** `examples/README.md`

```markdown
# Examples

## Running Examples

All examples can be run with Node.js:

```bash
node examples/basic/01-simple-gate-query.js
```

## Categories

### Basic Usage (`examples/basic/`)
- `01-simple-gate-query.js` - Query a single gate
- `02-line-query.js` - Query a specific line
- `03-iterating-all-gates.js` - Loop through all 64 gates

### Configuration (`examples/configuration/`)
- `01-using-presets.js` - Switch between presets
- `02-custom-rotation.js` - Apply rotation offset
- `03-direction-change.js` - Change wheel direction

### Extensions (`examples/extensions/`)
- `01-collection-queries.js` - Get all channels, centers, etc.
- `02-enriched-queries.js` - Get gates with full context
- `03-filtered-queries.js` - Filter by center, circuit, etc.
- `04-relationship-queries.js` - Programming partners, harmonics

### Real-World Scenarios (`examples/scenarios/`)
- `01-bodygraph-analysis.js` - Analyze defined channels/centers
- `02-transit-analysis.js` - Analyze planetary transits
- `03-composite-analysis.js` - Relationship composite

### Interactive
- `interactive-demo.js` - Interactive command-line demo

## Interactive Demo

Run the interactive demo to explore features:

```bash
node examples/interactive-demo.js
```

Or make it executable:

```bash
chmod +x examples/interactive-demo.js
./examples/interactive-demo.js
```
```

### Task 7.8: Git Commit

```bash
# Stage examples
git add examples/

# Commit
git commit -m "Session 07: Add comprehensive examples and demos

- Create basic usage examples
- Add configuration examples
- Add extension layer examples
- Create real-world scenario demonstrations
- Add interactive command-line demo
- Include examples README

All examples tested and working.
Interactive demo provides hands-on exploration.

Session: 07/10 (Examples & Demos)
Parallel: Can merge alongside 06, 08, 09"

# Tag
git tag -a v3.0.0-alpha.1-session-07 -m "Session 07 complete: Examples"
```

---

## VERIFICATION CHECKLIST

- [ ] All example files created
- [ ] Basic examples working
- [ ] Configuration examples working
- [ ] Extension examples working
- [ ] Scenario examples working
- [ ] Interactive demo functional
- [ ] Examples README complete

---

## COMPLETION CRITERIA

✅ **This session is complete when:**

1. All example categories created
2. All examples tested and working
3. Interactive demo functional
4. Git committed and tagged

---

*Session 07 of 10 - Examples & Demos (Parallel)*
