# Session Prompt: Human Design Gate Names & Keywords

## Context

You are working on the **HD Knowledge Engine** repository. A **root docking system** has been established that provides the mathematical foundation (binary patterns, wheel positioning) for all knowledge systems.

Your task is to create the **Human Design Gate Names & Keywords** knowledge system mapping that docks into this root.

## Repository State

Branch: `feature/calculation-first-architecture`

The root docking system exists at:
- `core/root-system/binary-identity.json` - 64 gates with binary patterns
- `core/root-system/gate-sequence.json` - Canonical wheel order [41,19,13...]
- `core/root-system/positioning-algorithm.js` - Calculation functions
- `core/root-system/verification-protocol.js` - Automated testing

## Your Mission

1. **Create a new branch** for Human Design Gates:
   ```bash
   git checkout feature/calculation-first-architecture
   git pull origin feature/calculation-first-architecture
   git checkout -b feature/knowledge-system-hd-gates
   mkdir -p knowledge-systems/hd-gates/{mappings,tests}
   ```

2. **Extract Human Design gate data** from existing sources:
   - Look in `data/source/gates/complete-mappings.json` or individual gate files in `data/source/gates/gate-*.json`
   - Each gate has:
     - `keyword`: Ra Uru Hu's gate keyword (e.g., "Self-Expression")
     - `center`: Energy center (e.g., "G", "Sacral", "Solar Plexus")
     - `description`: Gate meaning
     - `channel`: Associated channel (e.g., "1-8")
     - `channelName`: Channel name (e.g., "Inspiration")

3. **Create mapping file**: `knowledge-systems/hd-gates/mappings/hd-gates-mappings.json`
   ```json
   {
     "systemName": "Human Design Gate Names & Keywords",
     "version": "1.0.0",
     "description": "Ra Uru Hu's Human Design gate keywords, centers, and channel associations",
     "completeness": "full",
     "dataArchitecture": "gate-level",
     "mappings": [
       {
         "gateNumber": 1,
         "lineNumber": null,
         "knowledge": {
           "keyword": "Self-Expression",
           "center": "G",
           "description": "Creation as a primal force. The energy potential to manifest inspiration without limitation.",
           "channel": "1-8",
           "channelName": "Inspiration",
           "channelKeynote": "The creative Role Model",
           "harmonicGate": 8,
           "harmonicGateName": "Holding Together"
         }
       }
     ]
   }
   ```

4. **Verify your mapping**:
   Create `knowledge-systems/hd-gates/verify.sh`:
   ```bash
   #!/bin/bash
   echo "🔍 Human Design Gates - Verification"
   echo "===================================="

   MAPPING_FILE="mappings/hd-gates-mappings.json"

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

   # Test all gates have keywords
   MISSING=$(node -p "
     const data = require('./$MAPPING_FILE');
     data.mappings.filter(m => !m.knowledge.keyword).length
   ")

   if [ "$MISSING" -gt 0 ]; then
     echo "❌ $MISSING gates missing keywords"
     exit 1
   fi

   # Test all gates have centers
   MISSING=$(node -p "
     const data = require('./$MAPPING_FILE');
     data.mappings.filter(m => !m.knowledge.center).length
   ")

   if [ "$MISSING" -gt 0 ]; then
     echo "❌ $MISSING gates missing center assignments"
     exit 1
   fi

   echo "✅ All verification checks passed!"
   exit 0
   ```

5. **Create tests** in `knowledge-systems/hd-gates/tests/hd-gates-tests.js`:
   ```javascript
   const fs = require('fs');
   const path = require('path');

   const mappingsPath = path.join(__dirname, '../mappings/hd-gates-mappings.json');
   const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

   let passed = 0;
   let failed = 0;

   console.log('🧪 Human Design Gates - Test Suite');
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

   // Test 2: All gates have keywords
   const withKeywords = mappings.mappings.filter(m => m.knowledge.keyword);
   if (withKeywords.length === 64) {
     console.log('✅ Test 2: All gates have keywords');
     passed++;
   } else {
     console.log(`❌ Test 2: ${64 - withKeywords.length} gates missing keywords`);
     failed++;
   }

   // Test 3: All gates have center assignments
   const validCenters = ['Head', 'Ajna', 'Throat', 'G', 'Sacral', 'Solar Plexus', 'Spleen', 'Root', 'Heart'];
   const withCenters = mappings.mappings.filter(m =>
     m.knowledge.center && validCenters.includes(m.knowledge.center)
   );
   if (withCenters.length === 64) {
     console.log('✅ Test 3: All gates have valid center assignments');
     passed++;
   } else {
     console.log(`❌ Test 3: ${64 - withCenters.length} gates missing/invalid centers`);
     failed++;
   }

   // Test 4: All gates have channels
   const withChannels = mappings.mappings.filter(m => m.knowledge.channel);
   if (withChannels.length === 64) {
     console.log('✅ Test 4: All gates have channel assignments');
     passed++;
   } else {
     console.log(`✅ Test 4: ${withChannels.length}/64 gates have channel assignments`);
     passed++;
   }

   // Test 5: lineNumber is null for all (gate-level system)
   const allNull = mappings.mappings.every(m => m.lineNumber === null);
   if (allNull) {
     console.log('✅ Test 5: All mappings are gate-level (lineNumber: null)');
     passed++;
   } else {
     console.log('❌ Test 5: Some mappings have lineNumber set');
     failed++;
   }

   // Test 6: All gates have harmonic gates
   const withHarmonics = mappings.mappings.filter(m => m.knowledge.harmonicGate);
   if (withHarmonics.length === 64) {
     console.log('✅ Test 6: All gates have harmonic gate pairs');
     passed++;
   } else {
     console.log(`✅ Test 6: ${withHarmonics.length}/64 gates have harmonic pairs`);
     passed++;
   }

   console.log('=' .repeat(60));
   console.log(`Total: ${passed + failed} | Passed: ${passed} ✅ | Failed: ${failed} ❌`);

   process.exit(failed === 0 ? 0 : 1);
   ```

6. **Create README**:
   Create `knowledge-systems/hd-gates/README.md` documenting the system

7. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add Human Design gate names & keywords system (64 gates)

   - Ra Uru Hu's gate keywords for all 64 gates
   - Energy center assignments (9 centers)
   - Channel associations and names
   - Harmonic gate pairs
   - All tests passing
   - Gate-level system (lineNumber: null)"

   git push -u origin feature/knowledge-system-hd-gates
   ```

## Understanding the Root System

The root system provides:
- **Binary patterns**: Each gate has a 6-bit binary (e.g., "111111" for Gate 1)
- **Wheel position**: True sequence [41, 19, 13...] NOT sequential 1-64
- **Quarters, Faces, Trigrams**: All calculated from binary patterns
- **Docking interface**: Every system provides `gateNumber` + `knowledge`

You only need to provide the **Human Design meaning** layer (keywords, centers, channels). The root handles all math.

## Data Source

Extract from: `data/source/gates/complete-mappings.json` or individual `data/source/gates/gate-*.json` files

Each gate file has:
```json
{
  "1": {
    "name": "The Creative",
    "keyword": "Self-Expression",
    "center": "G",
    "description": "Creation as a primal force...",
    "channel": "1-8",
    "channelName": "Inspiration",
    "harmonicGate": 8,
    "harmonicGateName": "Holding Together"
  }
}
```

## Nine Energy Centers Reference

| Center | Type | Gates |
|--------|------|-------|
| Head | Pressure | 61, 63, 64 |
| Ajna | Awareness | 4, 11, 17, 24, 43, 47 |
| Throat | Expression | 8, 12, 16, 20, 23, 31, 33, 35, 45, 56, 62 |
| G | Identity | 1, 2, 7, 10, 13, 15, 25, 46 |
| Sacral | Life Force | 3, 5, 9, 14, 27, 29, 34, 42, 59 |
| Solar Plexus | Emotions | 6, 22, 30, 36, 37, 49, 55 |
| Spleen | Intuition | 18, 28, 32, 44, 48, 50, 57 |
| Root | Pressure | 19, 38, 39, 41, 52, 53, 54, 58, 60 |
| Heart | Will | 21, 26, 40, 51 |

## Required Mapping Format

Every mapping entry MUST have:
- `gateNumber`: 1-64 (required)
- `lineNumber`: null (this is a gate-level system)
- `knowledge.keyword`: Ra's gate keyword (required)
- `knowledge.center`: Energy center assignment (required)
- `knowledge.description`: Gate meaning (required)
- `knowledge.channel`: Channel designation like "1-8" (optional)
- `knowledge.channelName`: Channel name (optional)
- `knowledge.harmonicGate`: Partner gate number (optional)

## Verification Criteria

Your system MUST pass:
- ✅ All 64 gates covered
- ✅ Valid gate numbers (1-64)
- ✅ All gates have keywords
- ✅ All gates have center assignments
- ✅ All center names are valid
- ✅ lineNumber is null for all (gate-level)
- ✅ No duplicates
- ✅ Tests pass

## Success Criteria

When complete, you should have:
1. Branch: `feature/knowledge-system-hd-gates`
2. File: `knowledge-systems/hd-gates/mappings/hd-gates-mappings.json` (all 64 gates)
3. Tests: `knowledge-systems/hd-gates/tests/hd-gates-tests.js` (all passing)
4. Verification: `./verify.sh` returns exit code 0
5. Documentation: `knowledge-systems/hd-gates/README.md`

## Notes

- Human Design Gates is a **gate-level** system (no line-level detail)
- Set `lineNumber: null` for all mappings
- Set `completeness: "full"` (should cover all 64 gates)
- The root system handles ALL positioning math
- You only provide the Human Design interpretations (keywords, centers, channels)
- This is one of the SIMPLEST systems - great starting point!

## Deliverables

1. Complete mappings file (64 gates with HD keywords and centers)
2. Test suite (all tests passing)
3. Verification script (passing)
4. README documentation
5. Committed and pushed to branch
6. Ready for PR/merge

Start by creating the branch and extracting the gate keywords and center assignments from the source data.
