# SESSION 04: EXTENSION LAYER

**Duration:** 4 hours
**Dependencies:** Session 03 complete
**Type:** Sequential (must complete before Session 05)
**Branch:** `session-04-extensions`

---

## OBJECTIVES

Build the extension layer that provides rich aggregation queries and collection methods, cleanly separated from the core primitive operations.

---

## PREREQUISITES

### Before Starting:

- [ ] Session 03 complete and merged to main
- [ ] TypeScript definitions in place and compiling
- [ ] All tests from Session 03 passing
- [ ] Create branch: `git checkout -b session-04-extensions`

---

## DELIVERABLES

1. `extensions/` directory with modular architecture
2. Collection query methods (getAllX)
3. Enriched query methods (getEnrichedX)
4. Filtered query methods (getXByY)
5. Relationship query methods
6. Extension tests passing
7. Documentation for extension layer

---

## ARCHITECTURE OVERVIEW

```
Core Layer (unified-query-engine.js)
├── Fast primitives
├── Single-gate queries
└── Minimal processing

Extension Layer (extensions/)
├── Collection queries (all gates, all channels, etc.)
├── Enriched queries (full knowledge aggregation)
├── Filtered queries (by center, circuit, etc.)
└── Relationship queries (programming partners, etc.)
```

**Key Principle:** Extensions build on top of core, never modify core.

---

## TASKS

### Task 4.1: Create Extension Directory Structure

```bash
mkdir -p extensions
mkdir -p extensions/types
mkdir -p tests/extensions
```

### Task 4.2: Build Collection Queries Module

**File:** `extensions/collection-queries.js`

```javascript
/**
 * Collection Query Methods
 *
 * These methods return ALL items of a specific type.
 * Used when you need complete lists for iteration or UI rendering.
 */

const engine = require('../unified-query-engine');

/**
 * Get all 64 gates with their full knowledge
 */
function getAllGates() {
  const gates = [];

  for (let i = 1; i <= 64; i++) {
    gates.push(engine.getGateKnowledge(i));
  }

  return {
    gates,
    total: gates.length
  };
}

/**
 * Get all 36 channels
 */
function getAllChannels() {
  // Get channels from gate 1 as reference (all gates have same channel list)
  const referenceGate = engine.getGateKnowledge(1);
  const channelsMap = new Map();

  // Collect unique channels from all gates
  for (let gateNum = 1; gateNum <= 64; gateNum++) {
    const gateData = engine.getGateKnowledge(gateNum);

    if (gateData.channelsInvolved && gateData.channelsInvolved.length > 0) {
      gateData.channelsInvolved.forEach(channel => {
        const key = `${channel.gates[0]}-${channel.gates[1]}`;
        if (!channelsMap.has(key)) {
          channelsMap.set(key, channel);
        }
      });
    }
  }

  const channels = Array.from(channelsMap.values());

  // Group by circuit
  const byCircuit = {};
  channels.forEach(channel => {
    if (channel.circuit) {
      if (!byCircuit[channel.circuit]) {
        byCircuit[channel.circuit] = [];
      }
      byCircuit[channel.circuit].push(channel);
    }
  });

  return {
    channels,
    total: channels.length,
    byCircuit
  };
}

/**
 * Get all 9 centers
 */
function getAllCenters() {
  const centersMap = new Map();

  // Collect unique centers from all gates
  for (let gateNum = 1; gateNum <= 64; gateNum++) {
    const gateData = engine.getGateKnowledge(gateNum);

    if (gateData.centerKnowledge) {
      const centerName = gateData.centerKnowledge.name;
      if (!centersMap.has(centerName)) {
        centersMap.set(centerName, {
          ...gateData.centerKnowledge,
          gates: []
        });
      }
      centersMap.get(centerName).gates.push(gateNum);
    }
  }

  const centers = Array.from(centersMap.values());

  // Group by type
  const byType = {};
  centers.forEach(center => {
    if (!byType[center.type]) {
      byType[center.type] = [];
    }
    byType[center.type].push(center);
  });

  return {
    centers,
    total: centers.length,
    byType
  };
}

/**
 * Get all 22 codon rings
 */
function getAllCodonRings() {
  const ringsMap = new Map();

  // Collect unique rings from all gates
  for (let gateNum = 1; gateNum <= 64; gateNum++) {
    const gateData = engine.getGateKnowledge(gateNum);

    if (gateData.codonRings && gateData.codonRings.ring) {
      const ringName = gateData.codonRings.ring;
      if (!ringsMap.has(ringName)) {
        ringsMap.set(ringName, {
          ring: ringName,
          aminoAcid: gateData.codonRings.aminoAcid,
          gates: []
        });
      }
      ringsMap.get(ringName).gates.push(gateNum);
    }
  }

  const rings = Array.from(ringsMap.values());

  return {
    rings,
    total: rings.length
  };
}

/**
 * Get all 4 quarters
 */
function getAllQuarters() {
  const quartersMap = new Map();

  // Collect unique quarters from all gates
  for (let gateNum = 1; gateNum <= 64; gateNum++) {
    const gateData = engine.getGateKnowledge(gateNum);

    if (gateData.quarters) {
      const quarterNum = gateData.quarters.quarter;
      if (!quartersMap.has(quarterNum)) {
        quartersMap.set(quarterNum, {
          ...gateData.quarters,
          gates: []
        });
      }
      quartersMap.get(quarterNum).gates.push(gateNum);
    }
  }

  const quarters = Array.from(quartersMap.values());

  return {
    quarters,
    total: quarters.length
  };
}

/**
 * Get all 8 trigrams
 */
function getAllTrigrams() {
  const trigramsMap = new Map();

  // Collect unique trigrams from all gates
  for (let gateNum = 1; gateNum <= 64; gateNum++) {
    const gateData = engine.getGateKnowledge(gateNum);

    if (gateData.trigrams) {
      const trigramName = gateData.trigrams.trigram;
      if (!trigramsMap.has(trigramName)) {
        trigramsMap.set(trigramName, {
          ...gateData.trigrams,
          gates: []
        });
      }
      trigramsMap.get(trigramName).gates.push(gateNum);
    }
  }

  const trigrams = Array.from(trigramsMap.values());

  return {
    trigrams,
    total: trigrams.length
  };
}

/**
 * Get all 16 faces
 */
function getAllFaces() {
  const facesMap = new Map();

  // Collect unique faces from all gates
  for (let gateNum = 1; gateNum <= 64; gateNum++) {
    const gateData = engine.getGateKnowledge(gateNum);

    if (gateData.faces) {
      const faceNum = gateData.faces.face;
      if (!facesMap.has(faceNum)) {
        facesMap.set(faceNum, {
          ...gateData.faces,
          gates: []
        });
      }
      facesMap.get(faceNum).gates.push(gateNum);
    }
  }

  const faces = Array.from(facesMap.values());

  return {
    faces,
    total: faces.length
  };
}

module.exports = {
  getAllGates,
  getAllChannels,
  getAllCenters,
  getAllCodonRings,
  getAllQuarters,
  getAllTrigrams,
  getAllFaces
};
```

### Task 4.3: Build Enriched Queries Module

**File:** `extensions/enriched-queries.js`

```javascript
/**
 * Enriched Query Methods
 *
 * These methods return single items with additional context and relationships.
 */

const engine = require('../unified-query-engine');
const { getAllChannels } = require('./collection-queries');

/**
 * Get enriched gate knowledge with full context
 */
function getEnrichedGate(gateNumber) {
  const baseKnowledge = engine.getGateKnowledge(gateNumber);

  return {
    ...baseKnowledge.hdGates,
    gateNumber,
    geneKeys: baseKnowledge.geneKeys,
    iching: baseKnowledge.iching,
    position: {
      wheelIndex: baseKnowledge.wheelIndex,
      angle: baseKnowledge.angle
    },
    quarter: baseKnowledge.quarters,
    trigram: baseKnowledge.trigrams,
    face: baseKnowledge.faces,
    codonRing: baseKnowledge.codonRings,
    center: baseKnowledge.hdGates.center,
    centerKnowledge: baseKnowledge.centerKnowledge,
    channels: baseKnowledge.channelsInvolved || []
  };
}

/**
 * Get enriched channel with both gate contexts
 */
function getEnrichedChannel(gate1, gate2) {
  const allChannels = getAllChannels();
  const channel = allChannels.channels.find(ch =>
    (ch.gates[0] === gate1 && ch.gates[1] === gate2) ||
    (ch.gates[0] === gate2 && ch.gates[1] === gate1)
  );

  if (!channel) {
    return null;
  }

  return {
    ...channel,
    gate1Knowledge: getEnrichedGate(channel.gates[0]),
    gate2Knowledge: getEnrichedGate(channel.gates[1])
  };
}

/**
 * Get enriched line knowledge (gate + specific line)
 */
function getEnrichedLine(gateNumber, lineNumber) {
  const lineKnowledge = engine.getLineKnowledge(gateNumber, lineNumber);
  const gateKnowledge = getEnrichedGate(gateNumber);

  return {
    ...lineKnowledge,
    gateContext: gateKnowledge,
    line: lineNumber
  };
}

module.exports = {
  getEnrichedGate,
  getEnrichedChannel,
  getEnrichedLine
};
```

### Task 4.4: Build Filtered Queries Module

**File:** `extensions/filtered-queries.js`

```javascript
/**
 * Filtered Query Methods
 *
 * These methods return subsets based on specific criteria.
 */

const engine = require('../unified-query-engine');
const { getAllChannels } = require('./collection-queries');

/**
 * Get all gates belonging to a specific center
 */
function getGatesByCenter(centerName) {
  const gates = [];

  for (let i = 1; i <= 64; i++) {
    const gateData = engine.getGateKnowledge(i);
    if (gateData.centerKnowledge && gateData.centerKnowledge.name === centerName) {
      gates.push(gateData);
    }
  }

  return gates;
}

/**
 * Get all gates involved in a specific circuit
 */
function getGatesByCircuit(circuitName) {
  const gatesSet = new Set();

  for (let i = 1; i <= 64; i++) {
    const gateData = engine.getGateKnowledge(i);
    if (gateData.channelsInvolved) {
      gateData.channelsInvolved.forEach(channel => {
        if (channel.circuit === circuitName) {
          gatesSet.add(i);
        }
      });
    }
  }

  return Array.from(gatesSet).map(gateNum => engine.getGateKnowledge(gateNum));
}

/**
 * Get all channels for a specific circuit
 */
function getChannelsByCircuit(circuitName) {
  const allChannels = getAllChannels();
  return allChannels.channels.filter(ch => ch.circuit === circuitName);
}

/**
 * Get all gates in a specific quarter
 */
function getGatesByQuarter(quarterNumber) {
  const gates = [];

  for (let i = 1; i <= 64; i++) {
    const gateData = engine.getGateKnowledge(i);
    if (gateData.quarters && gateData.quarters.quarter === quarterNumber) {
      gates.push(gateData);
    }
  }

  return gates;
}

/**
 * Get all gates for a specific codon ring
 */
function getGatesByCodonRing(ringName) {
  const gates = [];

  for (let i = 1; i <= 64; i++) {
    const gateData = engine.getGateKnowledge(i);
    if (gateData.codonRings && gateData.codonRings.ring === ringName) {
      gates.push(gateData);
    }
  }

  return gates;
}

module.exports = {
  getGatesByCenter,
  getGatesByCircuit,
  getChannelsByCircuit,
  getGatesByQuarter,
  getGatesByCodonRing
};
```

### Task 4.5: Build Relationship Queries Module

**File:** `extensions/relationship-queries.js`

```javascript
/**
 * Relationship Query Methods
 *
 * These methods explore connections between different knowledge elements.
 */

const engine = require('../unified-query-engine');
const { getAllChannels } = require('./collection-queries');

/**
 * Get programming partner for a gate
 */
function getGateProgrammingPartner(gateNumber) {
  const gateData = engine.getGateKnowledge(gateNumber);

  if (gateData.geneKeys && gateData.geneKeys.programmingPartner) {
    return engine.getGateKnowledge(gateData.geneKeys.programmingPartner);
  }

  return null;
}

/**
 * Get channel connecting two gates (if exists)
 */
function getChannelForGates(gate1, gate2) {
  const allChannels = getAllChannels();

  return allChannels.channels.find(ch =>
    (ch.gates[0] === gate1 && ch.gates[1] === gate2) ||
    (ch.gates[0] === gate2 && ch.gates[1] === gate1)
  ) || null;
}

/**
 * Get all channels involving a specific gate
 */
function getChannelsForGate(gateNumber) {
  const gateData = engine.getGateKnowledge(gateNumber);
  return gateData.channelsInvolved || [];
}

/**
 * Get codon ring for a gate
 */
function getCodonRingForGate(gateNumber) {
  const gateData = engine.getGateKnowledge(gateNumber);
  return gateData.codonRings || null;
}

/**
 * Get all gates in same codon ring as specified gate
 */
function getCodonRingPartners(gateNumber) {
  const gateData = engine.getGateKnowledge(gateNumber);

  if (!gateData.codonRings || !gateData.codonRings.ring) {
    return [];
  }

  const ringName = gateData.codonRings.ring;
  const partners = [];

  for (let i = 1; i <= 64; i++) {
    if (i === gateNumber) continue; // Skip the gate itself

    const otherGate = engine.getGateKnowledge(i);
    if (otherGate.codonRings && otherGate.codonRings.ring === ringName) {
      partners.push(otherGate);
    }
  }

  return partners;
}

/**
 * Get harmonic gates (same position in other quarters)
 */
function getHarmonicGates(gateNumber) {
  const gateData = engine.getGateKnowledge(gateNumber);
  const position = gateData.wheelIndex % 16; // Position within quarter

  const harmonics = [];

  for (let i = 1; i <= 64; i++) {
    if (i === gateNumber) continue;

    const otherGate = engine.getGateKnowledge(i);
    if (otherGate.wheelIndex % 16 === position) {
      harmonics.push(otherGate);
    }
  }

  return harmonics;
}

module.exports = {
  getGateProgrammingPartner,
  getChannelForGates,
  getChannelsForGate,
  getCodonRingForGate,
  getCodonRingPartners,
  getHarmonicGates
};
```

### Task 4.6: Create Extension Layer Index

**File:** `extensions/index.js`

```javascript
/**
 * HD Knowledge Engine V3 - Extension Layer
 *
 * Rich aggregation queries and collection methods built on top of core.
 */

const collectionQueries = require('./collection-queries');
const enrichedQueries = require('./enriched-queries');
const filteredQueries = require('./filtered-queries');
const relationshipQueries = require('./relationship-queries');

module.exports = {
  // Collection Queries
  ...collectionQueries,

  // Enriched Queries
  ...enrichedQueries,

  // Filtered Queries
  ...filteredQueries,

  // Relationship Queries
  ...relationshipQueries
};
```

### Task 4.7: Create Extension Tests

**File:** `tests/extensions/test-extensions.js`

```javascript
/**
 * Extension Layer Tests
 */

const extensions = require('../../extensions');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ ${description}`);
    passCount++;
  } catch (error) {
    console.error(`❌ ${description}`);
    console.error(`   ${error.message}`);
    failCount++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('\n🧪 EXTENSION LAYER TESTS\n');

// Collection Query Tests
console.log('📦 Collection Queries:');

test('getAllGates returns 64 gates', () => {
  const result = extensions.getAllGates();
  assert(result.total === 64, `Expected 64 gates, got ${result.total}`);
  assert(result.gates.length === 64, 'Gates array should have 64 items');
});

test('getAllChannels returns 36 channels', () => {
  const result = extensions.getAllChannels();
  assert(result.total === 36, `Expected 36 channels, got ${result.total}`);
  assert(result.byCircuit, 'Should have byCircuit grouping');
});

test('getAllCenters returns 9 centers', () => {
  const result = extensions.getAllCenters();
  assert(result.total === 9, `Expected 9 centers, got ${result.total}`);
  assert(result.byType, 'Should have byType grouping');
});

test('getAllCodonRings returns 22 rings', () => {
  const result = extensions.getAllCodonRings();
  assert(result.total === 22, `Expected 22 codon rings, got ${result.total}`);
});

test('getAllQuarters returns 4 quarters', () => {
  const result = extensions.getAllQuarters();
  assert(result.total === 4, `Expected 4 quarters, got ${result.total}`);
});

test('getAllTrigrams returns 8 trigrams', () => {
  const result = extensions.getAllTrigrams();
  assert(result.total === 8, `Expected 8 trigrams, got ${result.total}`);
});

test('getAllFaces returns 16 faces', () => {
  const result = extensions.getAllFaces();
  assert(result.total === 16, `Expected 16 faces, got ${result.total}`);
});

// Enriched Query Tests
console.log('\n✨ Enriched Queries:');

test('getEnrichedGate includes all systems', () => {
  const gate = extensions.getEnrichedGate(13);
  assert(gate.gateNumber === 13, 'Should have gate number');
  assert(gate.geneKeys, 'Should have Gene Keys');
  assert(gate.iching, 'Should have I Ching');
  assert(gate.position, 'Should have position');
  assert(gate.quarter, 'Should have quarter');
  assert(gate.trigram, 'Should have trigram');
});

test('getEnrichedChannel includes both gate contexts', () => {
  const channel = extensions.getEnrichedChannel(13, 33);
  assert(channel !== null, 'Channel 13-33 should exist');
  assert(channel.gate1Knowledge, 'Should have gate1 context');
  assert(channel.gate2Knowledge, 'Should have gate2 context');
});

// Filtered Query Tests
console.log('\n🔍 Filtered Queries:');

test('getGatesByCenter filters correctly', () => {
  const gGates = extensions.getGatesByCenter('G Center');
  assert(gGates.length === 8, `Expected 8 G Center gates, got ${gGates.length}`);
});

test('getGatesByCircuit returns gates', () => {
  const gates = extensions.getGatesByCircuit('Individual');
  assert(gates.length > 0, 'Should return gates for Individual circuit');
});

test('getChannelsByCircuit returns channels', () => {
  const channels = extensions.getChannelsByCircuit('Individual');
  assert(channels.length > 0, 'Should return channels for Individual circuit');
});

// Relationship Query Tests
console.log('\n🔗 Relationship Queries:');

test('getGateProgrammingPartner returns partner', () => {
  const partner = extensions.getGateProgrammingPartner(13);
  assert(partner !== null, 'Gate 13 should have programming partner');
});

test('getChannelForGates finds channel', () => {
  const channel = extensions.getChannelForGates(13, 33);
  assert(channel !== null, 'Should find channel 13-33');
  assert(channel.gates.includes(13), 'Channel should include gate 13');
  assert(channel.gates.includes(33), 'Channel should include gate 33');
});

test('getChannelsForGate returns channels', () => {
  const channels = extensions.getChannelsForGate(13);
  assert(channels.length > 0, 'Gate 13 should have channels');
});

test('getCodonRingForGate returns ring', () => {
  const ring = extensions.getCodonRingForGate(13);
  assert(ring !== null, 'Gate 13 should have codon ring');
  assert(ring.ring, 'Ring should have name');
});

test('getCodonRingPartners returns partners', () => {
  const partners = extensions.getCodonRingPartners(13);
  assert(partners.length > 0, 'Gate 13 should have codon ring partners');
  assert(partners.length === 2, 'Each codon ring should have 3 gates total (2 partners)');
});

test('getHarmonicGates returns harmonics', () => {
  const harmonics = extensions.getHarmonicGates(13);
  assert(harmonics.length === 3, 'Should have 3 harmonic gates (4 quarters - 1 self)');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📊 Total: ${passCount + failCount}`);
console.log('='.repeat(50) + '\n');

process.exit(failCount > 0 ? 1 : 0);
```

### Task 4.8: Update Package.json Scripts

**Update:** `package.json`

```json
{
  "scripts": {
    "test:extensions": "node tests/extensions/test-extensions.js"
  }
}
```

### Task 4.9: Create Extension Documentation

**File:** `docs/extension-layer.md`

```markdown
# Extension Layer Guide

## Overview

The extension layer provides rich queries and aggregations built on top of the core primitives.

## Architecture

```
Core: Fast, primitive, single-item queries
  ↓
Extensions: Rich, aggregated, relationship queries
```

## Collection Queries

Get all items of a specific type:

```javascript
const extensions = require('hd-knowledge-engine-v3/extensions');

// Get all 64 gates
const allGates = extensions.getAllGates();
console.log(allGates.total); // 64

// Get all 36 channels
const allChannels = extensions.getAllChannels();
console.log(allChannels.byCircuit); // Grouped by circuit

// Get all 9 centers
const allCenters = extensions.getAllCenters();
console.log(allCenters.byType); // Grouped by type
```

## Enriched Queries

Get single items with full context:

```javascript
// Get gate with all knowledge systems
const enrichedGate = extensions.getEnrichedGate(13);
console.log(enrichedGate.geneKeys.gift); // "Discernment"
console.log(enrichedGate.position.angle); // 202.5

// Get channel with both gate contexts
const channel = extensions.getEnrichedChannel(13, 33);
console.log(channel.gate1Knowledge.name);
console.log(channel.gate2Knowledge.name);
```

## Filtered Queries

Get subsets based on criteria:

```javascript
// Gates by center
const gGates = extensions.getGatesByCenter('G Center');

// Gates by circuit
const individualGates = extensions.getGatesByCircuit('Individual');

// Channels by circuit
const tribalChannels = extensions.getChannelsByCircuit('Tribal');

// Gates by quarter
const q1Gates = extensions.getGatesByQuarter(1);
```

## Relationship Queries

Explore connections:

```javascript
// Programming partner
const partner = extensions.getGateProgrammingPartner(13);

// Channel between gates
const channel = extensions.getChannelForGates(13, 33);

// All channels for a gate
const channels = extensions.getChannelsForGate(13);

// Codon ring partners
const partners = extensions.getCodonRingPartners(13);

// Harmonic gates (same position in other quarters)
const harmonics = extensions.getHarmonicGates(13);
```

## Performance

Extension queries are optimized but may iterate over all 64 gates.
For single-gate queries, use core methods instead.

| Method | Time | Use Case |
|--------|------|----------|
| Core query | ~0.016ms | Single gate |
| Extension collection | ~1-2ms | All gates/channels |
| Extension enriched | ~0.05ms | Single enriched gate |
```

### Task 4.10: Run Extension Tests

```bash
# Run extension tests
npm run test:extensions

# Run all tests
npm test && npm run test:extensions
```

**Expected Results:**
- All extension tests pass
- Collection queries return correct counts
- Enriched queries include all systems
- Filtered queries work correctly
- Relationship queries find connections

### Task 4.11: Git Commit

```bash
# Stage all extension files
git add extensions/
git add tests/extensions/
git add docs/extension-layer.md
git add package.json

# Commit
git commit -m "Session 04: Build extension layer architecture

- Create modular extension system (collection, enriched, filtered, relationship)
- Add getAllX methods for complete collections
- Add getEnrichedX methods with full context
- Add getXByY filtered query methods
- Add relationship queries (partners, harmonics, connections)
- Clean separation from core layer
- All extension tests passing

Extensions provide rich aggregations without modifying core.
Architecture allows other systems to dock at appropriate level.

Session: 04/10 (Extension Layer)
Next: Session 05 (Integration Testing)"

# Tag
git tag -a v3.0.0-alpha.1-session-04 -m "Session 04 complete: Extension layer"
```

---

## VERIFICATION CHECKLIST

Before marking this session complete, verify:

### Architecture Verification:
- [ ] Extensions directory structure created
- [ ] Clean separation from core maintained
- [ ] No modifications to core files
- [ ] Modular organization (collection, enriched, filtered, relationship)

### Functionality Verification:
- [ ] Collection queries return correct counts
- [ ] Enriched queries include all systems
- [ ] Filtered queries work correctly
- [ ] Relationship queries find connections
- [ ] All 20+ extension methods functional

### Test Verification:
- [ ] All extension tests passing
- [ ] All original V2 tests still passing
- [ ] No regressions introduced

### Documentation Verification:
- [ ] Extension layer guide complete
- [ ] Usage examples clear
- [ ] API documented

---

## COMPLETION CRITERIA

✅ **This session is complete when:**

1. Extension layer built and modular
2. All extension methods functional
3. All tests passing (V2 + extensions)
4. Documentation complete
5. Git committed and tagged

✅ **Ready to proceed to Session 05:** Integration Testing

---

*Session 04 of 10 - Extension Layer*
