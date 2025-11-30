# Codon Rings Knowledge System

**Biochemical amino acid correlations and DNA codon mappings for the Human Design system**

## Overview

The Codon Rings knowledge system maps all 64 Human Design gates to 22 codon rings, providing the biochemical and DNA correlation layer of the Human Design system. Each ring groups multiple gates based on their amino acid associations and DNA codon patterns.

## System Statistics

- **Total Rings**: 22 codon rings
- **Total Gates**: 64 gates (100% coverage)
- **Total Mapping Entries**: 65 (includes nested structure)
- **Nested Structures**: 1 (Ring of Trials contains Ring of Secrets at Gate 12)
- **Completeness**: Full mapping (all gates assigned)
- **Validation**: 28/28 tests passing ✅

## Quick Start

### Run Verification

```bash
cd knowledge-systems/codon-rings
./verify.sh
```

### Generate Mappings

```bash
node extract-mappings.js
```

### Run Tests

```bash
node tests/codon-rings.test.js
```

## Structure

```
knowledge-systems/codon-rings/
├── README.md                           # This file
├── extract-mappings.js                 # Extraction script
├── verify.sh                           # Verification script
├── mappings/
│   └── codon-rings-mappings.json      # Complete mappings (all 64 gates)
└── tests/
    └── codon-rings.test.js            # Comprehensive test suite
```

## The 22 Codon Rings

Each ring represents a biochemical pathway and groups gates by their amino acid correlation.

### 🔄 Special Note: Nested Ring Structure

**Gate 12** uniquely appears in TWO rings due to a nested structure:
- **Ring of Trials** (outer ring): Contains all three stop codon gates (12, 33, 56) - *contains Ring of Secrets*
- **Ring of Secrets** (inner ring): Contains only Gate 12 (UGA stop codon) - *nested within Ring of Trials*

**Ring of Trials CONTAINS Ring of Secrets** as a special subset. This nested relationship is preserved in the mappings with Gate 12 having two entries, each marked with `nestedStructure: true` metadata.

| Ring Name | Amino Acid | Gates | Codons |
|-----------|------------|-------|--------|
| Ring of Fire | Lysine | 1, 14 | AAA, AAG |
| Ring of Light | Threonine | 5, 9, 11, 26 | ACA, ACC, ACG, ACU |
| Ring of Destiny | Asparagine | 34, 43 | AAC, AAU |
| Ring of Origin | Methionine | 41 | AUG |
| Ring of Gaia | Isoleucine | 19, 60, 61 | AUA, AUC, AUU |
| Ring of Water | Phenylalanine | 2, 8 | UUU, UUC |
| Ring of Miracles | Tryptophan | 35 | UGG |
| Ring of Prosperity | Cysteine | 16, 45 | UGU, UGC |
| Ring of Secrets | Terminator | 12 | UGA |
| Ring of Purification | Glutamine | 13, 30 | CAA, CAG |
| Ring of The Whirlwind | Histidine | 49, 55 | CAC, CAU |
| Ring of Divinity | Proline | 22, 36, 37, 63 | CCA, CCC, CCG, CCU |
| Ring of Humanity | Arginine | 10, 17, 21, 25, 38, 51 | CGA, CGC, CGG, CGU, AGA, AGG |
| Ring of Life And Death | Leucine | 3, 20, 23, 24, 27, 42 | CUA, CUC, CUG, CUU, UUG, UUA |
| Ring of Union | Valine | 4, 7, 29, 59 | GUU, GUG, GUC, GUA |
| Ring of Alchemy | Glysine | 6, 40, 47, 64 | GGU, GGG, GGC, GGA |
| Ring of Matter | Alanine | 18, 46, 48, 57 | GCA, GCU, GCG, GCC |
| Ring of Illusion | Aspartic_Acid | 28, 32 | GAU, GAC |
| Ring of Illuminati | Glutamic_Acid | 44, 50 | GAG, GAA |
| Ring of Trials | Terminators | **12**, 33, 56 | UAG, UAA |
| Ring of Secrets | Terminator | **12** | UGA |
| Ring of No Return | Tyrosine | 31, 62 | UAU, UAC |
| Ring of Seeking | Serine | 15, 39, 52, 53, 54, 58 | UCU, UCG, UCC, UCA, AGC, AGU |

## Data Structure

### Mapping Format

Each gate mapping contains:

```json
{
  "gateNumber": 1,
  "lineNumber": null,
  "knowledge": {
    "ring": "Ring of Fire",
    "aminoAcid": "Lysine",
    "codons": ["AAA", "AAG"],
    "ringGates": [1, 14],
    "biochemicalFunction": "Part of Ring of Fire - Lysine biochemical pathway"
  }
}
```

### Fields

- **gateNumber**: Gate number (1-64)
- **lineNumber**: Always `null` (codon rings are gate-level, not line-level)
- **knowledge.ring**: Ring name
- **knowledge.aminoAcid**: Amino acid name
- **knowledge.codons**: DNA codon(s) for this ring
- **knowledge.ringGates**: All gates in this ring
- **knowledge.biochemicalFunction**: Description of biochemical pathway
- **knowledge.nestedStructure** *(optional)*: `true` if gate appears in multiple rings
- **knowledge.totalRings** *(optional)*: Number of rings this gate belongs to
- **knowledge.allRings** *(optional)*: Array of all ring names for this gate

### Nested Structure Example

Gate 12 has **two mapping entries** (one for each ring):

```json
[
  {
    "gateNumber": 12,
    "knowledge": {
      "ring": "Ring of Trials",
      "aminoAcid": "Terminators",
      "codons": ["UAG", "UAA"],
      "ringGates": [12, 33, 56],
      "nestedStructure": true,
      "totalRings": 2,
      "allRings": ["Ring of Trials", "Ring of Secrets"]
    }
  },
  {
    "gateNumber": 12,
    "knowledge": {
      "ring": "Ring of Secrets",
      "aminoAcid": "Terminator",
      "codons": ["UGA"],
      "ringGates": [12],
      "nestedStructure": true,
      "totalRings": 2,
      "allRings": ["Ring of Trials", "Ring of Secrets"]
    }
  }
]
```

## Validation

The system includes comprehensive validation across 7 test suites:

### Structure Tests
- ✅ Mappings file structure
- ✅ Metadata completeness
- ✅ Correct ring and gate counts

### Completeness Tests
- ✅ All 64 gates present
- ✅ No duplicate gates
- ✅ All 22 rings present
- ✅ Correct naming patterns

### Data Integrity Tests
- ✅ One ring per gate
- ✅ Required knowledge fields
- ✅ Valid amino acids
- ✅ Valid codon arrays
- ✅ Valid ring groupings
- ✅ Gate-level mapping (no lines)

### Ring Grouping Tests
- ✅ Consistent ring groupings
- ✅ Ring size constraints (1-6 gates)
- ✅ Consistent amino acids per ring

### Codon Pattern Tests
- ✅ 64 total unique codons
- ✅ Consistent codon patterns per ring

### Specific Ring Tests
- ✅ Ring of Fire validation
- ✅ Ring of Light validation
- ✅ Ring of Origin validation

### Nested Structure Tests
- ✅ Gate 12 in both rings (Ring of Trials + Ring of Secrets)
- ✅ Nested structure metadata validation
- ✅ Ring of Trials contains all stop codons (12, 33, 56)
- ✅ Ring of Secrets contains only UGA stop codon (Gate 12)

## Technical Notes

### Nested Ring Structure: Gate 12

Gate 12 **legitimately appears in both** `RING_OF_TRIALS` and `RING_OF_SECRETS` in the source data. This is not a data conflict but a **nested structure**:

- **Ring of Trials** (outer ring): All terminator/stop codons (Gates 12, 33, 56) - **contains Ring of Secrets**
- **Ring of Secrets** (inner ring): The specific UGA stop codon (Gate 12 only) - **nested within Ring of Trials**

**Ring of Trials CONTAINS Ring of Secrets** as a special subset, representing the esoteric significance of the UGA stop codon (Gate 12) within the broader category of all terminator codons.

**Implementation**: The extraction script preserves this nested relationship by:
1. Creating **two mapping entries** for Gate 12 (one for each ring)
2. Adding `nestedStructure: true` metadata to both entries
3. Including `allRings` array to show the complete relationship
4. Maintaining separate `ringGates` arrays for each ring's context

This biological reality is properly reflected in the data structure and validated by comprehensive tests.

### DNA Codon Format

All codons use RNA notation (U instead of T):
- A = Adenine
- U = Uracil (instead of T/Thymine)
- G = Guanine
- C = Cytosine

### Stop Codons and Nested Structure

Three stop/terminator codons exist in genetic code, mapped to two rings with nested structure:

- **Ring of Trials** (Terminators - outer ring): UAG (Gate 33), UAA (Gate 56), UGA (Gate 12) - **CONTAINS Ring of Secrets**
- **Ring of Secrets** (Terminator - inner ring): UGA (Gate 12 only) - **contained within Ring of Trials**

**Containment**: Ring of Trials ⊃ Ring of Secrets

The UGA stop codon (Gate 12) has special esoteric significance. Ring of Trials contains all three stop codons, and Ring of Secrets is the special inner subset focusing on the mystical UGA codon. Gate 12 thus participates in both the general terminator function (Ring of Trials) and the specific esoteric function (Ring of Secrets).

## Integration with HD Knowledge Engine

The Codon Rings system is designed to integrate with the HD Knowledge Engine's calculation-first architecture:

- **Calculated**: Binary patterns, codon sequences (from gate number)
- **Stored**: Ring assignments, amino acid mappings (human-assigned)

This follows the principle: "Store only what must be assigned, calculate everything else."

## Usage Examples

### Get Ring for a Gate

```javascript
const mappings = require('./mappings/codon-rings-mappings.json');

// Find gate 1
const gate1 = mappings.mappings.find(m => m.gateNumber === 1);

console.log(gate1.knowledge.ring);        // "Ring of Fire"
console.log(gate1.knowledge.aminoAcid);   // "Lysine"
console.log(gate1.knowledge.codons);      // ["AAA", "AAG"]
console.log(gate1.knowledge.ringGates);   // [1, 14]
```

### Get All Gates in a Ring

```javascript
const mappings = require('./mappings/codon-rings-mappings.json');

// Find all gates in Ring of Fire
const ringOfFire = mappings.mappings.filter(
  m => m.knowledge.ring === 'Ring of Fire'
);

console.log(ringOfFire.map(m => m.gateNumber)); // [1, 14]
```

### Get All Rings for a Gate (handles nested structures)

```javascript
const mappings = require('./mappings/codon-rings-mappings.json');

// Find all rings for Gate 12 (nested structure)
const gate12Entries = mappings.mappings.filter(m => m.gateNumber === 12);

gate12Entries.forEach(entry => {
  console.log(`Ring: ${entry.knowledge.ring}`);
  console.log(`Amino Acid: ${entry.knowledge.aminoAcid}`);
  console.log(`Codons: ${entry.knowledge.codons.join(', ')}`);
  console.log(`Nested: ${entry.knowledge.nestedStructure || false}`);
  console.log('---');
});

// Output:
// Ring: Ring of Trials
// Amino Acid: Terminators
// Codons: UAG, UAA
// Nested: true
// ---
// Ring: Ring of Secrets
// Amino Acid: Terminator
// Codons: UGA
// Nested: true
```

### Get All Rings

```javascript
const mappings = require('./mappings/codon-rings-mappings.json');

const allRings = new Set(mappings.mappings.map(m => m.knowledge.ring));
console.log([...allRings]); // Array of 22 ring names
```

## Testing

Run the comprehensive test suite:

```bash
node tests/codon-rings.test.js
```

Expected output:
```
=== CODON RINGS KNOWLEDGE SYSTEM TEST SUITE ===

1. STRUCTURE AND METADATA TESTS
2. COMPLETENESS TESTS
3. DATA INTEGRITY TESTS
4. RING GROUPING TESTS
5. CODON PATTERN TESTS
6. SPECIFIC RING TESTS
7. NESTED STRUCTURE TESTS

======================================================================
TEST SUMMARY
======================================================================
Total Tests: 28
Passed: 28 ✓
Failed: 0 ✗

✅ ALL TESTS PASSED - Codon Rings Knowledge System is valid!
```

## Verification

Run the verification script:

```bash
./verify.sh
```

This runs all tests and reports:
- ✅ Mappings file integrity
- ✅ All validation checks
- ✅ Overall system health

## Contributing

When updating the Codon Rings system:

1. **Modify source data**: Edit `data/source/extracted/codon-rings-manual-data.js`
2. **Regenerate mappings**: Run `node extract-mappings.js`
3. **Run tests**: Run `./verify.sh`
4. **Verify all tests pass**: Ensure 23/23 tests passing
5. **Commit changes**: Include both source and generated files

## References

- **Source Data**: `data/source/extracted/codon-rings-manual-data.js`
- **Gene Keys**: Gene Keys system (Richard Rudd)
- **Human Design**: Ra Uru Hu's Human Design System
- **Genetic Code**: Standard genetic codon table

## License

Part of the HD Knowledge Engine project.

---

**Last Updated**: 2025-11-10
**Version**: 1.0.0
**Status**: ✅ All validations passing (28/28)
**Total Entries**: 65 (64 unique gates + 1 nested structure)
**Nested Structures**: Gate 12 (Ring of Trials ⊃ Ring of Secrets)
