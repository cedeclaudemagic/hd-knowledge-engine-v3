# Channels Test Suites

This directory contains three comprehensive test suites for the 36 Channels knowledge system.

## Test Suites

### 1. Basic Tests (`channels-tests.js`)
**10 tests** - Quick validation of core requirements

- System metadata and channel count
- Channel names, keynotes, and descriptions
- Circuit assignments
- Gate validation and normalization
- Center connections
- Circuit distribution

**Run:**
```bash
node tests/channels-tests.js
```

### 2. Comprehensive Tests (`channels-tests-comprehensive.js`)
**25 tests** - Detailed validation with quality checks

**Categories:**
- **Basic Structure** (3 tests): Metadata, count, duplicates
- **Gate Validation** (5 tests): Gate pairs, normalization, frequency, coverage
- **Knowledge Fields** (6 tests): Names, keynotes, descriptions, themes, whenDefined/Undefined
- **Circuit Tests** (3 tests): Assignments, distribution, completeness
- **Center Connections** (3 tests): Presence, validity, format
- **Cross-Reference** (1 test): Match against circuit assignments file
- **Data Quality** (4 tests): Placeholder text, content quality, uniqueness

**Run:**
```bash
node tests/channels-tests-comprehensive.js
```

### 3. Edge Cases Tests (`channels-tests-edge-cases.js`)
**12 tests** - Boundary conditions and special scenarios

**Categories:**
- **Multi-Connected Gates**: Identify hub gates (10, 20, 34, 57)
- **Same-Center Channels**: Detect unusual same-center connections
- **G Center Analysis**: Verify G Center as major hub
- **Circuit-Specific**: Money Line validation, Integration Circuit gates
- **Boundary Values**: Min/max gates, adjacent pairs
- **Name Patterns**: Naming convention analysis
- **Well-Known Channels**: Verify specific important channels
- **Cross-Circuit**: Single assignment validation
- **Center Distribution**: All 9 centers represented
- **String Encoding**: Character encoding validation

**Run:**
```bash
node tests/channels-tests-edge-cases.js
```

## Quick Test

For basic validation, run:
```bash
cd knowledge-systems/channels
./verify.sh
```

## Test Results Summary

### Basic Tests
```
Total: 10 | Passed: 10 ✅ | Failed: 0 ❌
```

### Comprehensive Tests
```
Total: 25 | Passed: 25 ✅ | Failed: 0 ❌ | Warnings: 1 ⚠️
Warning: 33 channels have template-only descriptions (acceptable)
```

### Edge Cases Tests
```
Total: 12 | Passed: 12 ✅ | Failed: 0 ❌
```

**Overall: 47 tests, 100% passing**

## Key Findings from Tests

### Hub Gates (appear in 3+ channels):
- **Gate 10**: 10-20, 10-34, 10-57
- **Gate 20**: 10-20, 20-34, 20-57
- **Gate 34**: 10-34, 20-34, 34-57
- **Gate 57**: 10-57, 20-57, 34-57

These form the **Integration Circuit** interconnection pattern.

### Center Distribution:
- **Throat**: 13 channels (most connected)
- **Sacral**: 11 channels
- **G Center**: 10 channels (major hub)
- **Root**: 9 channels
- **Solar Plexus**: 7 channels
- **Spleen**: 7 channels
- **Ajna**: 6 channels
- **Heart**: 4 channels
- **Head**: 3 channels (least connected)

### Special Channels:
- **Money Line (21-45)**: Only channel with standalone source file
- **35-36**: Only adjacent gate pair (Transitoriness)

## Running All Tests

```bash
# From channels directory
node tests/channels-tests.js && \
node tests/channels-tests-comprehensive.js && \
node tests/channels-tests-edge-cases.js
```

## Exit Codes

All test suites follow standard exit code conventions:
- **0**: All tests passed
- **1**: One or more tests failed

## Adding New Tests

When adding new tests:

1. **Categorize appropriately**: Basic, Comprehensive, or Edge Case
2. **Follow naming convention**: Descriptive test names starting with "Test N:"
3. **Provide context**: Use console.log to show what's being tested
4. **Count properly**: Update passed/failed counters
5. **Exit correctly**: Use `process.exit(failed === 0 ? 0 : 1)`

## Test Coverage

These suites validate:
- ✅ Data completeness (all 36 channels)
- ✅ Data accuracy (verified against source files)
- ✅ Data integrity (no duplicates, valid references)
- ✅ Data quality (meaningful content, proper formatting)
- ✅ Schema compliance (proper structure, required fields)
- ✅ Cross-references (consistency with circuit assignments)
- ✅ Edge cases (hub gates, boundary values, special channels)
- ✅ Encoding (no character issues)

## Continuous Validation

Run tests after:
- Adding new channels
- Updating circuit assignments
- Modifying channel metadata
- Extracting from new source files
- Changing data schema
