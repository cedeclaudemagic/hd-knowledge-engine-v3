# Nuclear Hexagram Hierarchy

The fractal hierarchy of the 64 hexagrams derived from nuclear transformation.

## Source

Based on Richard Rudd's "Dare to be Divine" (2020), which reveals how the 64 hexagrams/Gene Keys can be organised through nuclear hexagram relationships into a hierarchical structure.

## Structure

The hierarchy has three levels:

```
4 Pillars (Tetragrammaton)
    │
    ├── Pillar 1 (Fire) - Beauty
    │   ├── Mystery 28 (Immortality) → Letters: 30, 55, 56, 62
    │   ├── Mystery 43 (Epiphany) → Letters: 14, 32, 34, 50
    │   └── Mystery 44 (Synarchy) → Letters: 13, 31, 33, 49
    │
    ├── Pillar 2 (Water) - Unity
    │   ├── Mystery 23 (Quintessence) → Letters: 3, 8, 20, 42
    │   ├── Mystery 24 (Silence) → Letters: 4, 7, 19, 41
    │   └── Mystery 27 (Selflessness) → Letters: 29, 59, 60, 61
    │
    ├── Pillar 63 (Truth) - Truth
    │   ├── Mystery 38 (Honour) → Letters: 5, 9, 11, 48
    │   ├── Mystery 40 (Divine Will) → Letters: 15, 22, 36, 52
    │   └── Mystery 54 (Ascension) → Letters: 18, 26, 46, 57
    │
    └── Pillar 64 (Light) - Illumination
        ├── Mystery 37 (Tenderness) → Letters: 6, 10, 47, 58
        ├── Mystery 39 (Liberation) → Letters: 16, 21, 35, 51
        └── Mystery 53 (Superabundance) → Letters: 12, 17, 25, 45
```

## Nuclear Transformation

A nuclear hexagram is formed by:
1. Taking lines 2-3-4 to form the lower nuclear trigram
2. Taking lines 3-4-5 to form the upper nuclear trigram
3. Combining these to create a new hexagram

When applied recursively to all 64 hexagrams:
- 64 hexagrams reduce to 16 nuclear parents (4 Pillars + 12 Mysteries)
- 16 nuclear hexagrams reduce to 4 Pillars
- The 4 Pillars (1, 2, 63, 64) are their own nuclear hexagrams

## Key Observations

### Standing Wave Distribution

Each Pillar contains exactly 2 standing wave gates:

| Pillar | Element | Standing Waves | EM Positions | Function |
|--------|---------|----------------|--------------|----------|
| 1 | Fire | 1, 30 | -4, -2 | Void-side source |
| 2 | Water | 2, 29 | +4, +2 | Material-side sink |
| 63 | Truth | 52, 57 | +3, -1 | Restraint (storage, discrimination) |
| 64 | Light | 51, 58 | +1, -3 | Threshold (gate-in, capacitance) |

This distribution suggests the nuclear hierarchy encodes information complementary to electromagnetic position.

### Cross-Zero Pillars

Gates 63 and 64 are unique—they are both Pillars AND cross-zero gates:
- Gate 63 (Water/Fire): +2 → -2, dematerialising
- Gate 64 (Fire/Water): -2 → +2, manifesting

They are exact inverses, just as Gates 1 and 2 are standing waves at opposite poles.

## Data Files

### mappings/nuclear-hierarchy-mappings.json

Contains:
- `hierarchy`: The complete tree structure (Pillars → Mysteries)
- `gateMappings`: Flat array of all 64 gates with their hierarchy position and EM data
- `standingWaveDistribution`: Analysis of standing wave placement across Pillars
- `gateTypeByPillar`: Count of gate types per Pillar

## Usage

```javascript
const hierarchy = require('./mappings/nuclear-hierarchy-mappings.json');

// Get a gate's hierarchy position
const gate36 = hierarchy.gateMappings.find(g => g.gate === 36);
console.log(gate36.pillar);  // 63
console.log(gate36.mystery); // 40
console.log(gate36.element); // "Truth"

// Get all gates in a family
const mystery40Gates = hierarchy.gateMappings
  .filter(g => g.mystery === 40)
  .map(g => g.gate);
// [15, 22, 36, 52]

// Get all standing waves
const standingWaves = hierarchy.gateMappings
  .filter(g => g.gateType === 'standing-wave')
  .map(g => g.gate);
// [1, 2, 29, 30, 51, 52, 57, 58]
```

## Research Context

This knowledge system was created to support research into whether the nuclear hierarchy provides predictive power for planetary exaltation/detriment assignments in Human Design, particularly for cross-zero gates where electromagnetic position alone achieves only 18% prediction accuracy.

See: `/docs/research/planetary/RESEARCH-PROPOSAL-nuclear-hierarchy.md`

## Version History

- 1.0.0 (2024-12-18): Initial release with complete hierarchy mapping
