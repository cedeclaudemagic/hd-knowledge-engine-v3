# I Ching Gate Names Knowledge System

Traditional I Ching hexagram names mapped to the 64 gates of Human Design.

## Overview

This knowledge system provides the traditional I Ching hexagram names for all 64 gates, including:
- English hexagram names (e.g., "The Creative", "The Receptive")
- Chinese names with pinyin (e.g., 乾 Qián, 坤 Kūn)
- Upper and lower trigram identification
- Hexagram numbers

## System Properties

- **System Name**: I Ching Gate Names
- **Version**: 1.0.0
- **Completeness**: Full (all 64 gates)
- **Data Architecture**: Gate-level (no line-level detail)

## Data Structure

Each mapping entry contains:

```json
{
  "gateNumber": 1,
  "lineNumber": null,
  "knowledge": {
    "ichingName": "The Creative",
    "chineseName": "乾 (Qián)",
    "hexagramNumber": 1,
    "trigrams": {
      "upper": "Heaven",
      "lower": "Heaven"
    }
  }
}
```

## Trigrams

The eight trigrams used in the system:

| Binary | Trigram  | Chinese | Pinyin |
|--------|----------|---------|--------|
| 111    | Heaven   | 乾      | Qián   |
| 000    | Earth    | 坤      | Kūn    |
| 100    | Thunder  | 震      | Zhèn   |
| 010    | Water    | 坎      | Kǎn    |
| 110    | Mountain | 艮      | Gèn    |
| 001    | Wind     | 巽      | Xùn    |
| 101    | Fire     | 離      | Lí     |
| 011    | Lake     | 兌      | Duì    |

## Files

- `mappings/iching-names-mappings.json` - Complete mappings for all 64 gates
- `tests/iching-names-tests.js` - Comprehensive test suite
- `verify.sh` - Verification script
- `extract-mappings.js` - Data extraction script (used during creation)

## Usage

### Verification

Run the verification script to ensure data integrity:

```bash
cd knowledge-systems/iching-names
./verify.sh
```

### Testing

Run the test suite:

```bash
cd knowledge-systems/iching-names
node tests/iching-names-tests.js
```

## Test Coverage

The test suite validates:

1. ✅ All 64 gates are present
2. ✅ All gates have I Ching names
3. ✅ All gates have upper/lower trigrams
4. ✅ All mappings are gate-level (lineNumber: null)
5. ✅ No duplicate gate numbers
6. ✅ All gate numbers are valid (1-64)
7. ✅ All gates have Chinese names
8. ✅ All gates have hexagram numbers
9. ✅ All trigram names are valid
10. ✅ System metadata is correct

## Integration with Root System

This knowledge system docks into the root docking system which provides:

- Binary patterns for each gate
- Wheel positioning calculations
- Trigram calculations from binary
- Verification protocols

The I Ching Names system only provides the **meaning layer** - the traditional hexagram interpretations. All mathematical calculations are handled by the root system.

## Example Queries

Once integrated, this system enables queries like:

- "What is the I Ching name for Gate 23?" → "Splitting Apart (剝 Bō)"
- "What are the trigrams for Gate 1?" → "Heaven over Heaven"
- "Show me all gates with Thunder as the upper trigram"

## Data Source

Extracted from: `data/source/gates/gate-*.json`

Each source file contains the traditional I Ching name in the `name` field and binary pattern for trigram calculation.

## Version History

- **1.0.0** (2025-11-10) - Initial release with complete 64-gate mappings

## Notes

- This is a **gate-level** system with no line-level detail
- Chinese names include pinyin romanization for pronunciation
- Trigrams are derived from the 6-bit binary patterns (upper 3 bits, lower 3 bits)
- This system provides the foundation for understanding the traditional I Ching wisdom within Human Design
