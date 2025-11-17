# Session Prompt: I Ching Gate Names

## Context

You are working on the **HD Knowledge Engine** repository. A **root docking system** has been established that provides the mathematical foundation (binary patterns, wheel positioning, trigrams) for all knowledge systems.

Your task is to create the **I Ching Gate Names** knowledge system mapping that docks into this root.

## Repository State

Branch: `feature/calculation-first-architecture`

The root docking system exists at:
- `core/root-system/binary-identity.json` - 64 gates with binary patterns
- `core/root-system/gate-sequence.json` - Canonical wheel order [41,19,13...]
- `core/root-system/positioning-algorithm.js` - Calculation functions
- `core/root-system/verification-protocol.js` - Automated testing

## Your Mission

1. **Create a new branch** for I Ching Gate Names:
   ```bash
   git checkout feature/calculation-first-architecture
   git pull origin feature/calculation-first-architecture
   git checkout -b feature/knowledge-system-iching-names
   mkdir -p knowledge-systems/iching-names/{mappings,tests}
   ```

2. **Extract I Ching gate names** from existing sources:
   - Look in `data/source/gates/complete-mappings.json` or individual gate files in `data/source/gates/gate-*.json`
   - Each gate has a `name` field (e.g., "The Creative", "The Receptive")
   - Contains the traditional I Ching hexagram name for all 64 gates

3. **Create mapping file**: `knowledge-systems/iching-names/mappings/iching-names-mappings.json`
   ```json
   {
     "systemName": "I Ching Gate Names",
     "version": "1.0.0",
     "description": "Traditional I Ching hexagram names for the 64 gates",
     "completeness": "full",
     "dataArchitecture": "gate-level",
     "mappings": [
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
       },
       {
         "gateNumber": 2,
         "lineNumber": null,
         "knowledge": {
           "ichingName": "The Receptive",
           "chineseName": "坤 (Kūn)",
           "hexagramNumber": 2,
           "trigrams": {
             "upper": "Earth",
             "lower": "Earth"
           }
         }
       }
     ]
   }
   ```

4. **Verify your mapping**:
   Create `knowledge-systems/iching-names/verify.sh`:
   ```bash
   #!/bin/bash
   echo "🔍 I Ching Gate Names - Verification"
   echo "===================================="

   MAPPING_FILE="mappings/iching-names-mappings.json"

   if [ ! -f "$MAPPING_FILE" ]; then
     echo "❌ Mapping file not found"
     exit 1
   fi

   TOTAL=$(node -p "require('./$MAPPING_FILE').mappings.length")
   echo "✅ Total mappings: $TOTAL"

   if [ "$TOTAL" -ne 64 ]; then
     echo "❌ Expected 64 mappings, found $TOTAL"
     exit 1
   fi

   echo "✅ All verification checks passed!"
   exit 0
   ```

5. **Create tests** in `knowledge-systems/iching-names/tests/iching-names-tests.js`:
   ```javascript
   const fs = require('fs');
   const path = require('path');

   const mappingsPath = path.join(__dirname, '../mappings/iching-names-mappings.json');
   const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

   let passed = 0;
   let failed = 0;

   console.log('🧪 I Ching Gate Names - Test Suite');
   console.log('=' .repeat(60));

   // Test 1: All 64 gates present
   const gates = mappings.mappings.map(m => m.gateNumber);
   const uniqueGates = [...new Set(gates)];
   if (uniqueGates.length === 64) {
     console.log('✅ Test 1: All 64 gates present');
     passed++;
   } else {
     console.log(`❌ Test 1: Expected 64 gates, found ${uniqueGates.length}`);
     failed++;
   }

   // Test 2: All gates have I Ching names
   const withNames = mappings.mappings.filter(m => m.knowledge.ichingName);
   if (withNames.length === 64) {
     console.log('✅ Test 2: All gates have I Ching names');
     passed++;
   } else {
     console.log(`❌ Test 2: ${64 - withNames.length} gates missing I Ching names`);
     failed++;
   }

   // Test 3: All gates have trigrams
   const withTrigrams = mappings.mappings.filter(m =>
     m.knowledge.trigrams && m.knowledge.trigrams.upper && m.knowledge.trigrams.lower
   );
   if (withTrigrams.length === 64) {
     console.log('✅ Test 3: All gates have upper/lower trigrams');
     passed++;
   } else {
     console.log(`❌ Test 3: ${64 - withTrigrams.length} gates missing trigrams`);
     failed++;
   }

   // Test 4: lineNumber is null for all (gate-level system)
   const allNull = mappings.mappings.every(m => m.lineNumber === null);
   if (allNull) {
     console.log('✅ Test 4: All mappings are gate-level (lineNumber: null)');
     passed++;
   } else {
     console.log('❌ Test 4: Some mappings have lineNumber set');
     failed++;
   }

   console.log('=' .repeat(60));
   console.log(`Total: ${passed + failed} | Passed: ${passed} ✅ | Failed: ${failed} ❌`);

   process.exit(failed === 0 ? 0 : 1);
   ```

6. **Create README**:
   Create `knowledge-systems/iching-names/README.md` documenting the system

7. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add I Ching gate names knowledge system (64 gates)

   - Traditional hexagram names for all 64 gates
   - Upper and lower trigram identification
   - Chinese character names included
   - All tests passing
   - Gate-level system (lineNumber: null)"

   git push -u origin feature/knowledge-system-iching-names
   ```

## Understanding the Root System

The root system provides:
- **Binary patterns**: Each gate has a 6-bit binary (e.g., "111111" for Gate 1)
- **Trigrams**: Upper 3 bits and lower 3 bits form trigrams
- **Wheel position**: True sequence [41, 19, 13...] NOT sequential 1-64
- **Docking interface**: Every system provides `gateNumber` + `knowledge`

You only need to provide the **meaning** layer (I Ching names). The root handles all math.

## Trigram Reference

Use the root system's trigram calculations, but here are the 8 trigrams for reference:

| Binary | Trigram | Chinese | Element |
|--------|---------|---------|---------|
| 111    | Heaven  | 乾 Qián | Strong  |
| 000    | Earth   | 坤 Kūn  | Receptive |
| 100    | Thunder | 震 Zhèn | Arousing |
| 010    | Water   | 坎 Kǎn  | Abysmal |
| 110    | Mountain| 艮 Gèn  | Keeping Still |
| 001    | Wind    | 巽 Xùn  | Gentle |
| 101    | Fire    | 離 Lí   | Clinging |
| 011    | Lake    | 兌 Duì  | Joyous |

## Data Source

Extract from: `data/source/gates/complete-mappings.json` or individual `data/source/gates/gate-*.json` files

Each gate file has:
```json
{
  "1": {
    "name": "The Creative",
    "binary": "111111",
    "codon": "AAA"
  }
}
```

The `name` field is the I Ching hexagram name.

## Required Mapping Format

Every mapping entry MUST have:
- `gateNumber`: 1-64 (required)
- `lineNumber`: null (this is a gate-level system)
- `knowledge.ichingName`: The hexagram name (required)
- `knowledge.trigrams.upper`: Upper trigram name (required)
- `knowledge.trigrams.lower`: Lower trigram name (required)
- `knowledge.chineseName`: Chinese characters (optional but recommended)
- `knowledge.hexagramNumber`: 1-64 (optional, usually same as gateNumber)

## Verification Criteria

Your system MUST pass:
- ✅ All 64 gates covered
- ✅ Valid gate numbers (1-64)
- ✅ All gates have I Ching names
- ✅ All gates have upper/lower trigrams
- ✅ lineNumber is null for all (gate-level)
- ✅ No duplicates
- ✅ Tests pass

## Success Criteria

When complete, you should have:
1. Branch: `feature/knowledge-system-iching-names`
2. File: `knowledge-systems/iching-names/mappings/iching-names-mappings.json` (all 64 gates)
3. Tests: `knowledge-systems/iching-names/tests/iching-names-tests.js` (all passing)
4. Verification: `./verify.sh` returns exit code 0
5. Documentation: `knowledge-systems/iching-names/README.md`

## Notes

- I Ching Names is a **gate-level** system (no line-level detail)
- Set `lineNumber: null` for all mappings
- Set `completeness: "full"` (should cover all 64 gates)
- The root system handles ALL positioning math and trigram calculations
- You only provide the traditional I Ching interpretations
- This is one of the SIMPLEST systems - great starting point!

## Deliverables

1. Complete mappings file (64 gates with I Ching names)
2. Test suite (all tests passing)
3. Verification script (passing)
4. README documentation
5. Committed and pushed to branch
6. Ready for PR/merge

Start by creating the branch and extracting the gate names from the source data.
