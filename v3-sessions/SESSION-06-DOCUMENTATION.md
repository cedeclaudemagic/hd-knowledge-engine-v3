# SESSION 06: DOCUMENTATION

**Duration:** 2 hours
**Dependencies:** Session 05 complete
**Type:** Parallel (can run alongside sessions 07-09)
**Branch:** `session-06-documentation`

---

## OBJECTIVES

Create complete, user-friendly documentation for HD Knowledge Engine V3 including API reference, configuration guide, and architecture overview.

---

## PREREQUISITES

### Before Starting:

- [ ] Session 05 complete and merged to main
- [ ] All systems tested and working
- [ ] Create branch: `git checkout -b session-06-documentation`

---

## DELIVERABLES

1. Complete API reference documentation
2. Configuration guide with examples
3. Architecture overview document
4. Migration guide from V2 to V3
5. Contribution guidelines
6. Updated README.md

---

## TASKS

### Task 6.1: Create API Reference

**File:** `docs/api-reference.md`

```markdown
# API Reference

## Core API

### `getGateKnowledge(gateNumber)`

Get complete knowledge for a single gate.

**Parameters:**
- `gateNumber` (number, 1-64): The gate number to query

**Returns:** Object with all 11 knowledge systems

**Example:**
```javascript
const engine = require('hd-knowledge-engine-v3');

const gate13 = engine.getGateKnowledge(13);

console.log(gate13.geneKeys.shadow);     // "Discord"
console.log(gate13.iching.name);         // "Fellowship"
console.log(gate13.hdGates.center);      // "G"
console.log(gate13.angle);               // 202.5
```

**Response Structure:**
```javascript
{
  gateNumber: 13,
  wheelIndex: 56,
  angle: 202.5,
  geneKeys: {
    gate: 13,
    shadow: "Discord",
    gift: "Discernment",
    siddhi: "Empathy",
    programmingPartner: 7,
    codonRing: "Ring of Water",
    aminoAcid: "Histidine"
  },
  iching: {
    gate: 13,
    name: "Fellowship",
    chineseName: "同人",
    hexagramNumber: 13
  },
  hdGates: {
    gate: 13,
    name: "The Listener",
    center: "G",
    centerKnowledge: { ... },
    channelsInvolved: [ ... ]
  },
  quarters: { ... },
  trigrams: { ... },
  faces: { ... },
  codonRings: { ... }
}
```

---

### `getLineKnowledge(gateNumber, lineNumber)`

Get knowledge for a specific line within a gate.

**Parameters:**
- `gateNumber` (number, 1-64): The gate number
- `lineNumber` (number, 1-6): The line number

**Returns:** Object with gate + line-specific knowledge

**Example:**
```javascript
const line = engine.getLineKnowledge(13, 4);

console.log(line.lineNumber);           // 4
console.log(line.geneKeys.shadow);      // "Discord"
console.log(line.lineKnowledge);        // Traditional line data
```

---

### `getWheelPosition(gateNumber, lineNumber?)`

Get positional data for a gate (and optionally a line).

**Parameters:**
- `gateNumber` (number, 1-64): The gate number
- `lineNumber` (number, 1-6, optional): The line number

**Returns:** Position object with wheelIndex and angle

**Example:**
```javascript
const position = engine.getWheelPosition(13);

console.log(position.wheelIndex);  // 56
console.log(position.angle);       // 202.5
```

---

### `setWheelConfiguration(config)`

Change the wheel configuration.

**Parameters:**
- `config` (object or string): Configuration object or preset name

**Configuration Object:**
```javascript
{
  sequenceName: 'rave-wheel-41-start' | 'gates-10-start' | 'custom',
  customSequence: number[],           // Only if sequenceName === 'custom'
  cardinalProgression: 'NWSE' | 'NESW' | ...,  // Visual clock face progression
  northPosition: string               // Gate(s) at north: "10|11" (straddled) or "10" (centered)
}
```

**Visual Clock Face Reference:**
```
        12 (NORTH) - 10|11
  9 (WEST) - 25|36  +  3 (EAST) - 46|6
        6 (SOUTH) - 15|12
```

**Cardinal Progressions:**
- `NWSE`: North→West→South→East (counter-clockwise: 12→9→6→3)
- `NESW`: North→East→South→West (clockwise: 12→3→6→9)

**Example:**
```javascript
// Use preset (default: NWSE, 10|11 at north)
engine.setWheelConfiguration('rave-wheel-41-start');

// Use custom config
engine.setWheelConfiguration({
  sequenceName: 'rave-wheel-41-start',
  cardinalProgression: 'NWSE',  // Counter-clockwise on clock face
  northPosition: '10|11'        // Straddled between gates 10 and 11
});
```

---

### `getWheelConfiguration()`

Get current wheel configuration.

**Returns:** WheelConfiguration instance

**Example:**
```javascript
const config = engine.getWheelConfiguration();

console.log(config.getSequenceName());    // 'rave-wheel-41-start'
console.log(config.getDirection());       // 'clockwise'
console.log(config.getRotationOffset());  // 33.75
```

---

### `resetConfiguration()`

Reset to default configuration (matches V2.0.0 behavior).

**Example:**
```javascript
engine.resetConfiguration();
```

---

### `isValidGate(gateNumber)`

Check if a gate number is valid.

**Parameters:**
- `gateNumber` (number): Number to validate

**Returns:** boolean

**Example:**
```javascript
engine.isValidGate(13);   // true
engine.isValidGate(0);    // false
engine.isValidGate(65);   // false
```

---

### `isValidLine(lineNumber)`

Check if a line number is valid.

**Parameters:**
- `lineNumber` (number): Number to validate

**Returns:** boolean

**Example:**
```javascript
engine.isValidLine(4);    // true
engine.isValidLine(0);    // false
engine.isValidLine(7);    // false
```

---

## Extension API

### Collection Queries

#### `getAllGates()`

Get all 64 gates with full knowledge.

**Returns:** `{ gates: Array, total: number }`

**Example:**
```javascript
const extensions = require('hd-knowledge-engine-v3/extensions');

const result = extensions.getAllGates();
console.log(result.total);  // 64

result.gates.forEach(gate => {
  console.log(`${gate.geneKeys.gate}: ${gate.geneKeys.gift}`);
});
```

---

#### `getAllChannels()`

Get all 36 channels.

**Returns:** `{ channels: Array, total: number, byCircuit: Object }`

**Example:**
```javascript
const result = extensions.getAllChannels();

console.log(result.total);  // 36
console.log(result.byCircuit.Individual);  // Individual circuit channels
```

---

#### `getAllCenters()`

Get all 9 centers.

**Returns:** `{ centers: Array, total: number, byType: Object }`

---

#### `getAllCodonRings()`

Get all 22 codon rings.

**Returns:** `{ rings: Array, total: number }`

---

#### `getAllQuarters()`

Get all 4 quarters.

**Returns:** `{ quarters: Array, total: number }`

---

#### `getAllTrigrams()`

Get all 8 trigrams.

**Returns:** `{ trigrams: Array, total: number }`

---

#### `getAllFaces()`

Get all 16 mythological faces.

**Returns:** `{ faces: Array, total: number }`

---

### Enriched Queries

#### `getEnrichedGate(gateNumber)`

Get gate with full context from all systems.

**Returns:** Enriched gate object

**Example:**
```javascript
const enriched = extensions.getEnrichedGate(13);

console.log(enriched.geneKeys.gift);
console.log(enriched.position.angle);
console.log(enriched.quarter.name);
```

---

#### `getEnrichedChannel(gate1, gate2)`

Get channel with both gate contexts.

**Returns:** Enriched channel object or null

**Example:**
```javascript
const channel = extensions.getEnrichedChannel(13, 33);

console.log(channel.name);
console.log(channel.gate1Knowledge.geneKeys.gift);
console.log(channel.gate2Knowledge.geneKeys.gift);
```

---

### Filtered Queries

#### `getGatesByCenter(centerName)`

Get all gates in a specific center.

**Parameters:**
- `centerName` (string): Center name (e.g., "G Center")

**Returns:** Array of gate objects

---

#### `getGatesByCircuit(circuitName)`

Get all gates involved in a circuit.

**Parameters:**
- `circuitName` (string): Circuit name (e.g., "Individual")

**Returns:** Array of gate objects

---

#### `getChannelsByCircuit(circuitName)`

Get all channels in a circuit.

**Parameters:**
- `circuitName` (string): Circuit name

**Returns:** Array of channel objects

---

### Relationship Queries

#### `getGateProgrammingPartner(gateNumber)`

Get the programming partner of a gate.

**Parameters:**
- `gateNumber` (number): Gate number

**Returns:** Gate object or null

---

#### `getChannelForGates(gate1, gate2)`

Find channel connecting two gates.

**Parameters:**
- `gate1` (number): First gate
- `gate2` (number): Second gate

**Returns:** Channel object or null

---

#### `getCodonRingPartners(gateNumber)`

Get all gates in the same codon ring.

**Parameters:**
- `gateNumber` (number): Gate number

**Returns:** Array of gate objects

---

#### `getHarmonicGates(gateNumber)`

Get gates in same position in other quarters.

**Parameters:**
- `gateNumber` (number): Gate number

**Returns:** Array of gate objects

---

## Configuration Presets

### Available Presets

- **`rave-wheel-41-start`** (DEFAULT): Rave wheel - Gate 41 at array start, counter-clockwise, 33.75° rotation (Gates 10/11 at north visually)
- **`gates-10-start`**: Alternative - Gates 10/11 at array start, counter-clockwise, 0° rotation
- **`custom`**: User-defined sequence

**Example:**
```javascript
// List all presets
const presets = WheelConfiguration.listPresets();

presets.forEach(preset => {
  console.log(`${preset.name}: ${preset.description}`);
});

// Load preset
engine.setWheelConfiguration('rave-wheel-41-start');
```
```

### Task 6.2: Create Configuration Guide

**File:** `docs/configuration-guide.md`

```markdown
# Configuration Guide

## Overview

V3 introduces a modular configuration system allowing you to customize:
- Gate sequence around the wheel
- Rotation offset
- Wheel direction (clockwise/counter-clockwise)

## Default Configuration

By default, V3 matches V2.0.0 behavior exactly:

```javascript
{
  sequenceName: 'rave-wheel-41-start',
  rotationOffset: 33.75,
  direction: 'counter-clockwise'
}
```

## Changing Configuration

### Using Presets

```javascript
const engine = require('hd-knowledge-engine-v3');

// Switch to alternative sequence
engine.setWheelConfiguration('gates-10-start');

// Reset to default
engine.resetConfiguration();
```

### Custom Configuration

```javascript
engine.setWheelConfiguration({
  sequenceName: 'rave-wheel-41-start',
  rotationOffset: 45,           // Rotate 45 degrees
  direction: 'counter-clockwise'        // Counter-clockwise direction
});
```

### Custom Sequence

```javascript
const mySequence = [
  41, 19, 13, 49, 30, 55, 37, 63,
  // ... all 64 gates in your custom order
];

engine.setWheelConfiguration({
  sequenceName: 'custom',
  customSequence: mySequence,
  rotationOffset: 0,
  direction: 'counter-clockwise'
});
```

## Understanding Sequences

### rave-wheel-41-start (DEFAULT)

**Array order:** Gate 41 at position 0
**Visual north:** Gates 10/11 at 0° (via 33.75° rotation)
**Direction:** Counter-clockwise
**DECOUPLED:** Array order ≠ Visual presentation

```
Array Position 0:  Gate 41  (appears at 33.75° visually)
Array Position 1:  Gate 19  (appears at 39.375° visually)
Array Position 58: Gate 10  (appears at 0° north visually via rotation)
...
```

### gates-10-start (ALTERNATIVE)

**Array order:** Gates 10/11 at position 0
**Visual north:** Gates 10/11 at 0° (no rotation needed)
**Direction:** Counter-clockwise

```
Array Position 0:  Gate 10  (appears at 0° north)
Array Position 1:  Gate 11  (appears at ~5.6°)
...
```

## Configuration Effects

### What Changes:
- `angle` - Gate position in degrees
- `wheelIndex` - Gate position in sequence

### What Stays Same:
- All knowledge content (Gene Keys, I Ching, etc.)
- Gate numbers
- Relationships between gates
- Channel definitions
- Center assignments

## Use Cases

### 1. Default Rave Wheel

```javascript
engine.setWheelConfiguration('rave-wheel-41-start');
const gate10 = engine.getGateKnowledge(10);
console.log(gate10.angle);  // ~0 (at north via 33.75° rotation)
console.log(gate10.wheelIndex);  // 58 (array position 58)
```

### 2. Custom Wheel Overlay

```javascript
// Align with tropical astrology
engine.setWheelConfiguration({
  sequenceName: 'rave-wheel-41-start',
  rotationOffset: 58.5,  // Aries 0° point
  direction: 'counter-clockwise'
});
```

### 3. Research Projects

```javascript
// Test different configurations
const configs = ['rave-wheel-41-start', 'gates-10-start'];

configs.forEach(config => {
  engine.setWheelConfiguration(config);
  const results = analyzeConfiguration();
  console.log(`${config}: ${results}`);
});
```

## Advanced: Creating Sequences

A valid sequence must:
1. Contain all 64 gates (numbers 1-64)
2. Each gate appears exactly once
3. Array has 64 elements

```javascript
function validateSequence(sequence) {
  const set = new Set(sequence);
  return (
    sequence.length === 64 &&
    set.size === 64 &&
    sequence.every(n => n >= 1 && n <= 64)
  );
}
```

## Performance

Configuration changes are fast (~0.01ms) and do not require rebuilding any data.

## Thread Safety

Note: Configuration is global. In multi-threaded environments, create separate engine instances.
```

### Task 6.3: Create Architecture Overview

**File:** `docs/architecture.md`

```markdown
# Architecture Overview

## Core Principles

### 1. Calculation-First Design

All data is computed on-demand from immutable foundations:

```
Immutable Data (JSON mappings)
         ↓
  Positioning Algorithm
         ↓
    Query Engine
         ↓
   Live Results
```

**NO monolithic database. NO pre-computed lookups.**

### 2. Modular Knowledge Systems

11 independent systems, each in its own directory:

```
knowledge-systems/
├── gene-keys/
├── iching-names/
├── hd-gates/
├── hd-traditional-gates/
├── quarters/
├── trigrams/
├── faces/
├── codon-rings/
├── channels/
├── incarnation-crosses/
└── centers/
```

### 3. Layered Architecture

```
┌─────────────────────────────────────┐
│     Extension Layer                  │  Rich aggregations
│  (getAllX, enriched queries)         │
├─────────────────────────────────────┤
│     Core Query Engine                │  Fast primitives
│  (getGateKnowledge, positioning)     │
├─────────────────────────────────────┤
│     Configuration System             │  Swappable sequences
│  (WheelConfiguration)                │
├─────────────────────────────────────┤
│     Knowledge Mappings               │  Immutable data
│  (JSON files in knowledge-systems/)  │
└─────────────────────────────────────┘
```

## Project Structure

```
HD-Knowledge-Engine-V3/
├── core/
│   ├── root-system/
│   │   ├── positioning-algorithm.js   # Mathematical foundation
│   │   ├── wheel-config.js            # Configuration system
│   │   ├── binary-identity.json       # Binary patterns
│   │   └── sequences/                 # Gate sequence arrays
│   └── types/                         # TypeScript definitions
├── extensions/
│   ├── collection-queries.js
│   ├── enriched-queries.js
│   ├── filtered-queries.js
│   └── relationship-queries.js
├── knowledge-systems/                 # 11 independent systems
├── tests/                             # Comprehensive test suites
├── docs/                              # Documentation
└── unified-query-engine.js            # Main entry point
```

## Data Flow

### Gate Query Flow

```
User calls getGateKnowledge(13)
         ↓
Configuration determines position
         ↓
Positioning algorithm calculates angle
         ↓
Each knowledge system looks up gate 13
         ↓
Results aggregated and returned
```

### Configuration Flow

```
User calls setWheelConfiguration()
         ↓
WheelConfiguration validates config
         ↓
New sequence/offset/direction stored
         ↓
All subsequent queries use new config
         ↓
No rebuild needed - instant switch
```

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| Core gate query | ~0.016ms | Single gate |
| All 64 gates | ~1ms | Full iteration |
| Extension getAllX | ~1-2ms | Collection |
| Configuration change | ~0.01ms | No rebuild |

## Why This Architecture?

### ✅ Advantages

1. **No Database Complexity**
   - No rebuild scripts
   - No sync issues
   - No corruption risk

2. **Modular & Maintainable**
   - Each system independent
   - Easy to add new systems
   - Clear separation of concerns

3. **Configurable & Flexible**
   - Swap sequences instantly
   - Multiple traditions supported
   - Research-friendly

4. **Type-Safe**
   - Full TypeScript support
   - IntelliSense in editors
   - Prevents API mistakes

5. **Fast**
   - Sub-millisecond queries
   - No I/O overhead
   - Efficient algorithms

### ❌ Not Suitable For

1. **Write-Heavy Applications**
   - This is read-only
   - No chart storage built-in
   - Use external DB for user data

2. **Pre-Computed Reports**
   - No caching layer included
   - Add caching if needed
   - Consider Redis for scale

## Extension Points

### Adding New Knowledge Systems

1. Create directory in `knowledge-systems/`
2. Add JSON mapping files
3. Create lookup function
4. Integrate in query engine
5. Add tests

### Adding New Query Methods

1. Add to appropriate extension module
2. Use core queries as primitives
3. Add TypeScript definitions
4. Add tests
5. Document in API reference

### Adding New Configurations

1. Create sequence JSON in `core/root-system/sequences/`
2. Add preset to WheelConfiguration
3. Add tests
4. Document usage

## Design Decisions

### Why JSON Mappings?

- Human-readable
- Easy to edit
- Version control friendly
- No database overhead

### Why Calculation-First?

- Single source of truth
- No sync issues
- Instant configuration changes
- Research flexibility

### Why Separate Layers?

- Core stays fast and minimal
- Extensions don't slow down core
- Other systems can dock at appropriate level
- Clear boundaries

### Why TypeScript Definitions?

- Developer experience
- Catch errors at dev time
- Self-documenting API
- IDE support

## Future Expansion

The architecture supports:

- Additional knowledge systems
- New query patterns
- Caching layers
- Database adapters
- WebAssembly port
- Worker thread distribution

All without changing core architecture.
```

### Task 6.4: Update Main README

**File:** `README.md` (update existing)

Add section about documentation:

```markdown
## Documentation

- **[API Reference](docs/api-reference.md)** - Complete API documentation
- **[Configuration Guide](docs/configuration-guide.md)** - How to configure the wheel
- **[Architecture Overview](docs/architecture.md)** - System design and principles
- **[TypeScript Usage](docs/typescript-usage.md)** - Using with TypeScript
- **[Extension Layer](docs/extension-layer.md)** - Rich query methods
- **[Testing Guide](docs/testing.md)** - Running tests
- **[Migration Guide](MIGRATION.md)** - Migrating from V2 to V3
```

### Task 6.5: Create Contribution Guide

**File:** `CONTRIBUTING.md`

```markdown
# Contributing to HD Knowledge Engine

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make changes
5. Run tests
6. Submit pull request

## Development Setup

```bash
git clone https://github.com/your-org/hd-knowledge-engine-v3.git
cd hd-knowledge-engine-v3
npm install
npm run test:all
```

## Making Changes

### Adding Knowledge Data

1. Locate the appropriate knowledge system in `knowledge-systems/`
2. Edit the JSON mapping files
3. Run tests to verify
4. Document sources

### Adding New Features

1. Update TypeScript definitions first
2. Implement feature
3. Add tests
4. Update documentation
5. Submit PR

### Fixing Bugs

1. Add failing test demonstrating bug
2. Fix bug
3. Verify test now passes
4. Submit PR

## Code Style

- Use 2-space indentation
- Follow existing patterns
- Add comments for complex logic
- Keep functions focused and small

## Testing Requirements

All PRs must:
- Pass all existing tests
- Include tests for new features
- Maintain 100% test pass rate
- Pass TypeScript compilation

## Documentation Requirements

All PRs that add features must:
- Update API reference
- Add usage examples
- Update TypeScript definitions

## Forbidden Changes

❌ **Never:**
- Add monolithic database files
- Add rebuild scripts
- Add pre-computation patterns
- Break V2 compatibility (without major version bump)

## Questions?

Open an issue for discussion before major changes.
```

### Task 6.6: Git Commit

```bash
# Stage documentation files
git add docs/
git add README.md
git add CONTRIBUTING.md

# Commit
git commit -m "Session 06: Add complete documentation

- Create comprehensive API reference
- Add configuration guide with examples
- Add architecture overview document
- Update main README
- Add contribution guidelines

All APIs documented with examples.
Configuration system fully explained.
Architecture principles clearly outlined.

Session: 06/10 (Documentation)
Parallel: Can merge alongside 07-09"

# Tag
git tag -a v3.0.0-alpha.1-session-06 -m "Session 06 complete: Documentation"
```

---

## VERIFICATION CHECKLIST

- [ ] API reference complete
- [ ] Configuration guide with examples
- [ ] Architecture overview finished
- [ ] README updated
- [ ] Contribution guide created
- [ ] All documentation accurate
- [ ] Examples tested

---

## COMPLETION CRITERIA

✅ **This session is complete when:**

1. All documentation files created
2. API fully documented
3. Configuration explained
4. Architecture documented
5. Git committed and tagged

---

*Session 06 of 10 - Documentation (Parallel)*
