# CLAUDE CODE BRIEF: Circuit Structure Derivation

## Mission

Investigate whether the three Circuit types (Individual, Tribal, Collective) and their sub-circuits are geometrically derivable from channel/gate structure, or whether they represent semantic classification.

---

# PART I: THE CIRCUIT DATA

## The Three Circuits

| Circuit | Theme | Sub-circuits | Channels |
|---------|-------|--------------|----------|
| **Individual** | Mutation, uniqueness | Knowing, Centering | 11 channels |
| **Tribal** | Support, resources | Ego, Defense | 9 channels |
| **Collective** | Sharing, patterns | Understanding (Logic), Sensing (Abstract) | 16 channels |

**Total: 36 channels across 3 circuits**

## The Sub-circuits

### Individual Circuit
| Sub-circuit | Theme | Channels |
|-------------|-------|----------|
| **Knowing** | Individual knowing/insight | 61-24, 43-23, 8-1, 14-2, 3-60 |
| **Centering** | Empowerment/identity | 51-25, 34-10, 57-10, 34-20, 57-20 |

### Tribal Circuit
| Sub-circuit | Theme | Channels |
|-------------|-------|----------|
| **Ego** | Material resources | 45-21, 26-44, 40-37, 32-54 |
| **Defense** | Protection/bonding | 59-6, 27-50, 19-49 |

### Collective Circuit
| Sub-circuit | Theme | Channels |
|-------------|-------|----------|
| **Understanding (Logic)** | Pattern recognition | 63-4, 17-62, 48-16, 18-58, 52-9, 5-15, 7-31 |
| **Sensing (Abstract)** | Experience sharing | 64-47, 11-56, 33-13, 36-35, 22-12, 30-41, 42-53, 39-55 |

---

# PART II: CHANNEL GEOMETRY

## The 36 Channels

Each channel connects two gates. Each gate has:
- A hexagram number (1-64)
- A trigram pair (inner/outer)
- A gate type (standing wave, cross-zero, same-phase)
- A centre location

## Channel Classification by Gate Type

```javascript
const CHANNELS = [
  // INDIVIDUAL - Knowing
  { channel: '61-24', gates: [61, 24], centres: ['Head', 'Ajna'] },
  { channel: '43-23', gates: [43, 23], centres: ['Ajna', 'Throat'] },
  { channel: '8-1', gates: [8, 1], centres: ['Throat', 'G'] },
  { channel: '14-2', gates: [14, 2], centres: ['Sacral', 'G'] },
  { channel: '3-60', gates: [3, 60], centres: ['Sacral', 'Root'] },
  
  // INDIVIDUAL - Centering
  { channel: '51-25', gates: [51, 25], centres: ['Heart', 'G'] },
  { channel: '34-10', gates: [34, 10], centres: ['Sacral', 'G'] },
  { channel: '57-10', gates: [57, 10], centres: ['Spleen', 'G'] },
  { channel: '34-20', gates: [34, 20], centres: ['Sacral', 'Throat'] },
  { channel: '57-20', gates: [57, 20], centres: ['Spleen', 'Throat'] },
  
  // TRIBAL - Ego
  { channel: '45-21', gates: [45, 21], centres: ['Throat', 'Heart'] },
  { channel: '26-44', gates: [26, 44], centres: ['Heart', 'Spleen'] },
  { channel: '40-37', gates: [40, 37], centres: ['Heart', 'Solar Plexus'] },
  { channel: '32-54', gates: [32, 54], centres: ['Spleen', 'Root'] },
  
  // TRIBAL - Defense
  { channel: '59-6', gates: [59, 6], centres: ['Sacral', 'Solar Plexus'] },
  { channel: '27-50', gates: [27, 50], centres: ['Sacral', 'Spleen'] },
  { channel: '19-49', gates: [19, 49], centres: ['Root', 'Solar Plexus'] },
  
  // + 2 more Tribal channels
  { channel: '44-26', gates: [44, 26], centres: ['Spleen', 'Heart'] }, // duplicate?
  { channel: '54-32', gates: [54, 32], centres: ['Root', 'Spleen'] }, // duplicate?
  
  // COLLECTIVE - Understanding (Logic)
  { channel: '63-4', gates: [63, 4], centres: ['Head', 'Ajna'] },
  { channel: '17-62', gates: [17, 62], centres: ['Ajna', 'Throat'] },
  { channel: '48-16', gates: [48, 16], centres: ['Spleen', 'Throat'] },
  { channel: '18-58', gates: [18, 58], centres: ['Spleen', 'Root'] },
  { channel: '52-9', gates: [52, 9], centres: ['Root', 'Sacral'] },
  { channel: '5-15', gates: [5, 15], centres: ['Sacral', 'G'] },
  { channel: '7-31', gates: [7, 31], centres: ['G', 'Throat'] },
  
  // COLLECTIVE - Sensing (Abstract)
  { channel: '64-47', gates: [64, 47], centres: ['Head', 'Ajna'] },
  { channel: '11-56', gates: [11, 56], centres: ['Ajna', 'Throat'] },
  { channel: '33-13', gates: [33, 13], centres: ['Throat', 'G'] },
  { channel: '36-35', gates: [36, 35], centres: ['Solar Plexus', 'Throat'] },
  { channel: '22-12', gates: [22, 12], centres: ['Solar Plexus', 'Throat'] },
  { channel: '30-41', gates: [30, 41], centres: ['Solar Plexus', 'Root'] },
  { channel: '42-53', gates: [42, 53], centres: ['Sacral', 'Root'] },
  { channel: '39-55', gates: [39, 55], centres: ['Root', 'Solar Plexus'] }
];
```

---

# PART III: GEOMETRIC HYPOTHESES

## Hypothesis C1: Gate Type Distribution

Different circuits might have distinct distributions of gate types.

| Gate Type | Individual | Tribal | Collective |
|-----------|------------|--------|------------|
| Standing Wave | ? | ? | ? |
| Cross-Zero | ? | ? | ? |
| Same-Phase | ? | ? | ? |

**Test:** Count gate types per circuit. Is the distribution significantly different?

## Hypothesis C2: Centre Involvement

Different circuits might involve different centres.

**Prediction:**
- Individual might favour G Centre (identity/uniqueness)
- Tribal might favour Heart + Sacral (resources/support)
- Collective might favour Head/Ajna + Solar Plexus (patterns/experience)

**Test:** Count centre appearances per circuit. Chi-square for significance.

## Hypothesis C3: Trigram Patterns

Different circuits might show distinct trigram patterns in their gates.

**Prediction:**
- Individual might favour Thunder/Wind (mutation/penetration)
- Tribal might favour Lake/Mountain (exchange/stillness)
- Collective might favour Heaven/Earth (pattern/receptivity)

**Test:** Count trigram appearances per circuit.

## Hypothesis C4: Position Distribution

Different circuits might occupy different electromagnetic positions.

| Position | Individual | Tribal | Collective |
|----------|------------|--------|------------|
| -4 (source) | ? | ? | ? |
| -2 (voltage) | ? | ? | ? |
| -1 (gate out) | ? | ? | ? |
| +1 (gate in) | ? | ? | ? |
| +2 (current) | ? | ? | ? |
| +4 (sink) | ? | ? | ? |

**Test:** Count positions per circuit.

## Hypothesis C5: Flow Direction

Circuits might have characteristic "flow directions" through the bodygraph.

**Prediction:**
- Individual: Flows through G Centre (unique expression)
- Tribal: Flows through Heart/Sacral (resource circulation)
- Collective: Flows through Head→Throat (pattern to expression)

**Test:** Map channel flow directions per circuit.

## Hypothesis C6: Sub-circuit Geometry

The sub-circuits within each circuit might have geometric distinctions.

**Test:** Compare Knowing vs Centering, Ego vs Defense, Understanding vs Sensing geometrically.

---

# PART IV: TEST SPECIFICATIONS

## Test C1: Gate Type Distribution

**Question:** Do circuits have distinct gate type signatures?

```javascript
function testGateTypeDistribution() {
  const circuits = {
    individual: {
      gates: [61, 24, 43, 23, 8, 1, 14, 2, 3, 60, 51, 25, 34, 10, 57, 20],
      standingWave: 0,
      crossZero: 0,
      samePhase: 0
    },
    tribal: {
      gates: [45, 21, 26, 44, 40, 37, 32, 54, 59, 6, 27, 50, 19, 49],
      standingWave: 0,
      crossZero: 0,
      samePhase: 0
    },
    collective: {
      gates: [63, 4, 17, 62, 48, 16, 18, 58, 52, 9, 5, 15, 7, 31,
              64, 47, 11, 56, 33, 13, 36, 35, 22, 12, 30, 41, 42, 53, 39, 55],
      standingWave: 0,
      crossZero: 0,
      samePhase: 0
    }
  };
  
  // For each gate, determine type and count
  // Run chi-square: Circuit × Gate Type
  
  // Standing waves: 1, 2, 29, 30, 51, 52, 57, 58
  // Cross-zero: inner trigram sign ≠ outer trigram sign
  // Same-phase: inner trigram sign = outer trigram sign
}
```

**Success Criterion:** Chi-square significant (p < 0.05) for Circuit × Gate Type.

## Test C2: Centre Distribution

**Question:** Do circuits involve different centres?

```javascript
function testCentreDistribution() {
  // Count how many times each centre appears in each circuit
  
  const centresByCircuit = {
    individual: { head: 0, ajna: 0, throat: 0, g: 0, heart: 0, 
                  solarPlexus: 0, sacral: 0, spleen: 0, root: 0 },
    tribal: { /* same */ },
    collective: { /* same */ }
  };
  
  // For each channel in each circuit, increment both centres
  
  // Normalize by circuit size
  // Compare distributions
  // Chi-square for significance
}
```

**Success Criterion:** Chi-square significant for Circuit × Centre.

## Test C3: Trigram Distribution

**Question:** Do circuits have trigram signatures?

```javascript
function testTrigramDistribution() {
  // For each gate in each circuit:
  // - Get inner trigram
  // - Get outer trigram
  // - Count occurrences
  
  const trigramsByCircuit = {
    individual: { heaven: 0, earth: 0, thunder: 0, wind: 0, 
                  water: 0, fire: 0, mountain: 0, lake: 0 },
    tribal: { /* same */ },
    collective: { /* same */ }
  };
  
  // Chi-square for Circuit × Trigram
}
```

**Success Criterion:** Chi-square significant for Circuit × Trigram.

## Test C4: Position Distribution

**Question:** Do circuits occupy different electromagnetic positions?

```javascript
function testPositionDistribution() {
  // For each gate in each circuit:
  // - Determine electromagnetic position(s)
  // - Count occurrences
  
  // Use the position mapping from our research:
  // Each gate has positions based on its trigrams
  
  const positionsByCircuit = {
    individual: { minus4: 0, minus2: 0, minus1: 0, plus1: 0, plus2: 0, plus4: 0 },
    tribal: { /* same */ },
    collective: { /* same */ }
  };
}
```

**Success Criterion:** Chi-square significant for Circuit × Position.

## Test C5: Flow Direction Analysis

**Question:** Do circuits have characteristic flow patterns?

```javascript
function testFlowDirection() {
  // Map each circuit as a graph
  // Identify source nodes (pressure centres: Head, Root)
  // Identify sink nodes (Throat)
  // Map flow paths
  
  // Individual: Head → Ajna → Throat, Sacral → G → Throat
  // Tribal: Root → Spleen → Heart → Throat
  // Collective: Head → Ajna → Throat, Solar Plexus → Throat
  
  // Is there a geometric principle for why these paths?
}
```

**Success Criterion:** Distinct flow signatures per circuit.

## Test C6: Sub-circuit Comparison

**Question:** What distinguishes sub-circuits geometrically?

```javascript
function testSubCircuits() {
  // INDIVIDUAL
  // Knowing: 61-24, 43-23, 8-1, 14-2, 3-60
  // Centering: 51-25, 34-10, 57-10, 34-20, 57-20
  
  // Compare gate types, centres, trigrams between Knowing and Centering
  
  // TRIBAL
  // Ego: 45-21, 26-44, 40-37, 32-54
  // Defense: 59-6, 27-50, 19-49
  
  // Compare Ego vs Defense
  
  // COLLECTIVE
  // Understanding: 63-4, 17-62, 48-16, 18-58, 52-9, 5-15, 7-31
  // Sensing: 64-47, 11-56, 33-13, 36-35, 22-12, 30-41, 42-53, 39-55
  
  // Compare Understanding vs Sensing
}
```

**Success Criterion:** Sub-circuits have distinct geometric signatures.

---

# PART V: THE DERIVATION QUESTION

## What Would "Derivable" Mean?

If Circuits are geometrically derivable, we should prove:

1. **WHY three circuits** — Not 2, not 4, not 5
2. **WHY these groupings** — What geometric property unites each circuit's channels?
3. **WHY these sub-circuits** — What further distinguishes Knowing from Centering, etc.?
4. **The circuit assignment rule** — Can we predict a gate's circuit from its geometry alone?

## What Would "Classification" Mean?

If Circuits are semantic classification:

1. The groupings might be THEMATIC (about meaning) rather than GEOMETRIC
2. "Individual/Tribal/Collective" might be useful labels without geometric basis
3. Alternative circuit groupings might be equally valid

---

# PART VI: ADDITIONAL ANALYSIS

## The Integration Channels

Some channels don't belong to any circuit — the "Integration" channels:

- 34-57 (Power)
- 20-57 (Brainwave)
- 10-34 (Exploration)
- 20-10 (Awakening)

**Question:** What makes these geometrically distinct?

```javascript
const INTEGRATION_CHANNELS = [
  { channel: '34-57', gates: [34, 57], centres: ['Sacral', 'Spleen'] },
  { channel: '20-57', gates: [20, 57], centres: ['Throat', 'Spleen'] },
  { channel: '10-34', gates: [10, 34], centres: ['G', 'Sacral'] },
  { channel: '20-10', gates: [20, 10], centres: ['Throat', 'G'] }
];

// These all involve gates 10, 20, 34, 57
// Is there a geometric commonality?
```

## The G Centre Connection

Notice: Individual Circuit heavily involves G Centre (identity).
- 8-1 (Throat-G)
- 14-2 (Sacral-G)
- 51-25 (Heart-G)
- 34-10 (Sacral-G)
- 57-10 (Spleen-G)

**Question:** Does G Centre involvement predict Individual Circuit?

## The Solar Plexus Connection

Notice: Collective Sensing heavily involves Solar Plexus (emotion).
- 36-35 (Solar Plexus-Throat)
- 22-12 (Solar Plexus-Throat)
- 30-41 (Solar Plexus-Root)
- 39-55 (Root-Solar Plexus)

**Question:** Does Solar Plexus involvement predict Collective Sensing?

---

# PART VII: OUTPUT REQUIREMENTS

## Reports to Generate

```
/docs/research/circuit/
├── GATE-TYPE-DISTRIBUTION.md
│   ├── Standing wave / cross-zero / same-phase by circuit
│   ├── Chi-square analysis
│   └── Interpretation
│
├── CENTRE-DISTRIBUTION.md
│   ├── Centre involvement by circuit
│   ├── Chi-square analysis
│   └── Interpretation
│
├── TRIGRAM-DISTRIBUTION.md
│   ├── Trigram frequency by circuit
│   ├── Chi-square analysis
│   └── Interpretation
│
├── POSITION-DISTRIBUTION.md
│   ├── Electromagnetic position by circuit
│   ├── Chi-square analysis
│   └── Interpretation
│
├── FLOW-DIRECTION-ANALYSIS.md
│   ├── Graph analysis per circuit
│   ├── Source/sink patterns
│   └── Interpretation
│
├── INTEGRATION-CHANNEL-ANALYSIS.md
│   ├── Why these 4 channels are distinct
│   ├── Geometric commonality
│   └── Interpretation
│
└── CIRCUIT-DERIVATION-SYNTHESIS.md
    ├── All test results
    ├── What is DERIVABLE
    ├── What is SEMANTIC
    ├── Updated derivation boundary
    └── Implications
```

## Update DERIVATION-STATUS-MAP

After tests, add:

```markdown
### Circuit Structure Analysis (v3.9)

| Test | Hypothesis | Result | Status |
|------|------------|--------|--------|
| C1 | Gate type distribution | [RESULT] | [DERIVABLE/SEMANTIC] |
| C2 | Centre distribution | [RESULT] | [DERIVABLE/SEMANTIC] |
| C3 | Trigram distribution | [RESULT] | [DERIVABLE/SEMANTIC] |
| C4 | Position distribution | [RESULT] | [DERIVABLE/SEMANTIC] |
| C5 | Flow direction | [RESULT] | [DERIVABLE/SEMANTIC] |
| C6 | Sub-circuit geometry | [RESULT] | [DERIVABLE/SEMANTIC] |

**Circuit Structure Status:** [SUMMARY]
```

---

# PART VIII: INTERPRETATION GUIDELINES

## If Circuits Are Geometrically Derivable

This would mean:
1. Individual/Tribal/Collective are NECESSARY groupings
2. Circuit membership is predictable from gate geometry
3. Sub-circuits have geometric basis
4. Circuit joins Profile, Type, Authority in the derivable layer

## If Circuits Are Semantic Classification

This would mean:
1. The groupings are MEANINGFUL but not NECESSARY
2. The themes (mutation/support/sharing) are interpretive
3. Circuits are excellent teaching tools without being geometric facts
4. Circuit remains at the semantic/transmission level

## The Key Question

**Can we predict a gate's circuit from its geometry alone, or must we receive the assignment from transmission?**

---

# PART IX: SUCCESS CRITERIA SUMMARY

| Test | Hypothesis | Success Criterion |
|------|------------|-------------------|
| C1 | Gate type distribution | Chi-square p < 0.05 |
| C2 | Centre distribution | Chi-square p < 0.05 |
| C3 | Trigram distribution | Chi-square p < 0.05 |
| C4 | Position distribution | Chi-square p < 0.05 |
| C5 | Flow direction | Distinct flow signatures |
| C6 | Sub-circuit geometry | Sub-circuits geometrically distinct |

**Overall Success:** At least 3 tests show significant geometric pattern.

---

# PART X: THE DEEPER QUESTION

If Circuits ARE derivable, it would mean:

**The three modes of human energy flow (mutation/support/sharing) are structurally constrained by channel geometry.**

Individual channels would carry mutative energy BECAUSE of their geometric properties.
Tribal channels would carry supportive energy BECAUSE of their geometric properties.
Collective channels would carry sharing energy BECAUSE of their geometric properties.

The semantic content (what "mutation" means, what "support" feels like) might still be transmission, but the GROUPINGS would be geometric.

---

**END OF BRIEF**

*This investigation determines whether Circuit is part of the geometric architecture or a semantic classification system.*
