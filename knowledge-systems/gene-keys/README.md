# Gene Keys Knowledge System

**Gene Keys Spectrum of Consciousness**

A complete mapping of the 64 Gene Keys with their Shadow → Gift → Siddhi progression, successfully docked into the root binary identity system.

## Overview

The Gene Keys system, developed by Richard Rudd, provides a transformational framework based on the I Ching and Human Design. Each of the 64 gates corresponds to a Gene Key with three levels of consciousness:

- **Shadow**: The lower frequency expression (unconscious/reactive)
- **Gift**: The middle frequency expression (conscious/creative)
- **Siddhi**: The highest frequency expression (transcendent/divine)

This knowledge system is a **gate-level** system (no line-level detail) that provides complete coverage of all 64 gates.

## System Architecture

### Docking Structure

This knowledge system follows the **root docking system** architecture:

```
HD-Knowledge-Engine/
├── core/
│   └── root-system/              # Mathematical foundation
│       ├── binary-identity.json  # 64 gates with binary patterns
│       ├── gate-sequence.json    # Canonical wheel order
│       ├── positioning-algorithm.js
│       └── verification-protocol.js
│
└── knowledge-systems/
    └── gene-keys/                # Gene Keys system
        ├── mappings/
        │   └── gene-keys-mappings.json  # 64 gates with Shadow/Gift/Siddhi
        ├── tests/
        │   └── test-gene-keys-mappings.js
        ├── verify.sh             # Verification script
        └── README.md             # This file
```

### Root System Provides

When mappings dock into the root system, they automatically receive:

- ✅ Binary patterns (6-digit binary for each gate)
- ✅ Codon sequences (3-letter DNA codons)
- ✅ Trigram analysis (upper/lower trigrams)
- ✅ Wheel positioning (index, angle, compass direction)
- ✅ Relationships (opposite gate, face, quarter)

### Gene Keys Provides

The Gene Keys mappings contribute:

- ✅ Shadow frequency (lower consciousness)
- ✅ Gift frequency (creative consciousness)
- ✅ Siddhi frequency (transcendent consciousness)
- ✅ Introverted expression
- ✅ Extroverted expression

## Data Structure

### Mapping Format

Each Gene Key mapping follows this structure:

```json
{
  "gateNumber": 1,
  "lineNumber": null,
  "knowledge": {
    "shadow": "Entropy",
    "gift": "Freshness",
    "siddhi": "Beauty",
    "introverted": "Depressive",
    "extroverted": "Frenetic"
  }
}
```

### Example: Gate 21

```json
{
  "gateNumber": 21,
  "lineNumber": null,
  "knowledge": {
    "shadow": "Control",
    "gift": "Authority",
    "siddhi": "Valour",
    "introverted": "Submissive",
    "extroverted": "Controlling"
  }
}
```

When docked, this enriches to include root system data:

```javascript
{
  gateNumber: 21,
  lineNumber: null,
  knowledge: {
    shadow: "Control",
    gift: "Authority",
    siddhi: "Valour",
    introverted: "Submissive",
    extroverted: "Controlling"
  },
  rootSystemData: {
    binary: "100111",
    codon: "CGA",
    trigrams: {
      upper: "100",
      upperName: "Thunder",
      lower: "111",
      lowerName: "Heaven"
    },
    positioning: {
      wheelIndex: 12,
      angle: 67.5,
      compassDirection: "WEST"
    },
    relationships: {
      oppositeGate: 48,
      face: "Kali",
      quarter: "Initiation"
    }
  }
}
```

## Usage

### Running Verification

```bash
cd knowledge-systems/gene-keys
./verify.sh
```

This will:
1. Verify root system integrity
2. Validate Gene Keys mappings file
3. Run comprehensive test suite (15 tests)
4. Verify docking into root system

Expected output:
```
✅ ALL VERIFICATION CHECKS PASSED

The Gene Keys knowledge system successfully docks into the
root binary identity system with 100% validation.
```

### Using in Code

```javascript
const positioningAlgorithm = require('../../core/root-system/positioning-algorithm');
const geneKeysMappings = require('./mappings/gene-keys-mappings.json');

// Get enriched data for a gate
const mapping = geneKeysMappings.mappings.find(m => m.gateNumber === 21);
const enriched = positioningAlgorithm.enrichMapping(mapping);

console.log('Shadow:', enriched.knowledge.shadow);      // "Control"
console.log('Gift:', enriched.knowledge.gift);          // "Authority"
console.log('Siddhi:', enriched.knowledge.siddhi);      // "Valour"
console.log('Binary:', enriched.rootSystemData.binary); // "100111"
console.log('Codon:', enriched.rootSystemData.codon);   // "CGA"
console.log('Angle:', enriched.rootSystemData.positioning.angle); // 67.5
```

### Query Examples

```javascript
// Get all gates with "Control" as shadow
const controlGates = geneKeysMappings.mappings.filter(m =>
  m.knowledge.shadow === 'Control'
);

// Get all gates with "Love" in siddhi
const loveGates = geneKeysMappings.mappings.filter(m =>
  m.knowledge.siddhi.includes('Love')
);

// Get positioning for all gates with specific shadow
const enrichedGates = controlGates.map(mapping =>
  positioningAlgorithm.enrichMapping(mapping)
);
```

## Comprehensive Testing

The Gene Keys knowledge system includes **55 comprehensive tests** across three test suites:

### Test Suite 1: Basic Mappings (15 tests)
- System metadata validation
- Complete coverage (64/64 gates)
- No duplicates or gaps
- Valid gate numbers (1-64)
- Proper structure (lineNumber: null)
- Required fields present (shadow/gift/siddhi)
- Frequency patterns included
- Docking validation

### Test Suite 2: Data Integrity (20 tests)
- Unique shadow/gift/siddhi values
- Shadow/Gift/Siddhi are distinct per gate
- Introverted/extroverted frequencies are distinct
- No empty or whitespace values
- Proper capitalization
- No invalid special characters
- Reasonable value lengths
- No leading/trailing whitespace
- Consistent casing
- Valid frequency patterns
- Proper JSON structure
- No null/undefined values
- Sequential gate order
- Cross-field validation (shadows don't appear as gifts)
- Semantic validation (shadows negative, siddhis transcendent)
- Specific known Gene Keys verification
- Enrichment validation

### Test Suite 3: Root Integration (20 tests)
- Binary identity system integration
- Gate sequence system integration
- Positioning data retrieval
- Valid 6-digit binary patterns
- Valid 3-letter codon patterns
- Valid trigram data
- Valid wheel positions (0-63)
- Valid angles (0-360°)
- Valid compass directions
- Valid opposite gates (1-64)
- Bidirectional opposite relationships
- Valid Face assignments (16 faces)
- Valid Quarter assignments (4 quarters)
- Balanced quarter distribution (16 gates each)
- Balanced compass distribution (16 gates each direction)
- Binary-to-codon conversion accuracy
- Complete root system data in enriched mappings
- Enrichment preserves original data
- Trigram names match binary patterns
- Unique wheel positions

## System Status

- **Version**: 1.0.0
- **Completeness**: Full (64/64 gates)
- **Line Detail**: Gate-level only (lineNumber: null)
- **Test Coverage**: 55 comprehensive tests
- **Verification Status**: ✅ 100% passing (55/55 tests)
- **Docking Status**: ✅ Successfully docked to root system

## Data Source

Extracted from: `data/source/extracted/gene-keys-extracted-data.js`

Original source: Gene Keys Golden Path program by Richard Rudd

## Example Gene Keys

| Gate | Shadow | Gift | Siddhi |
|------|--------|------|--------|
| 1 | Entropy | Freshness | Beauty |
| 2 | Dislocation | Orientation | Unity |
| 21 | Control | Authority | Valour |
| 64 | Confusion | Imagination | Illumination |

## Contributing

When updating Gene Keys data:

1. Edit `mappings/gene-keys-mappings.json`
2. Run `./verify.sh` to ensure all tests pass
3. Commit only if verification succeeds

## References

- Gene Keys official website: https://genekeys.com
- Gene Keys book: "The Gene Keys" by Richard Rudd
- HD Knowledge Engine: Root docking system documentation

---

**Built with the HD Knowledge Engine docking system**

This knowledge system demonstrates the power of the root docking architecture, where mathematical positioning is calculated once and knowledge system meanings dock cleanly into the foundation.
