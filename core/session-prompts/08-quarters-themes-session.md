# Session Prompt: The 4 Quarters

## Context

You are working on the **HD Knowledge Engine** repository. A **root docking system** has been established that provides the mathematical foundation (binary patterns, wheel positioning) for all knowledge systems.

Your task is to create the **4 Quarters** knowledge system that docks into this root.

**IMPORTANT**: The root system ALREADY CALCULATES which quarter each gate belongs to based on the **first 2 bits** of the binary pattern. Your job is to provide the THEMATIC MEANINGS for each of the 4 quarters.

## Repository State

Branch: `feature/calculation-first-architecture`

The root docking system exists at:
- `core/root-system/binary-identity.json` - 64 gates with binary patterns
- `core/root-system/gate-sequence.json` - Canonical wheel order
- `core/root-system/positioning-algorithm.js` - **getQuarter()** function calculates quarters
- `core/root-system/verification-protocol.js` - Automated testing

## Your Mission

1. **Create a new branch** for Quarters:
   ```bash
   git checkout feature/calculation-first-architecture
   git pull origin feature/calculation-first-architecture
   git checkout -b feature/knowledge-system-quarters
   mkdir -p knowledge-systems/quarters/{mappings,tests}
   ```

2. **Understand how Quarters are calculated**:
   The root system calculates quarters from the **first 2 bits** of each gate's binary pattern:
   ```javascript
   // Example: Gate 1 has binary "111111"
   // First 2 bits: "11" = "Mutation" quarter

   const positioningAlgorithm = require('../../../core/root-system/positioning-algorithm.js');
   const quarterForGate1 = positioningAlgorithm.getDockingData(1).relationships.quarter;
   // Result: "Mutation"
   ```

   The 4 quarters are:
   ```
   Binary "11" → Mutation        (16 gates)
   Binary "10" → Initiation      (16 gates)
   Binary "01" → Duality         (16 gates)
   Binary "00" → Civilisation    (16 gates)
   ```

3. **Create mapping file**: `knowledge-systems/quarters/mappings/quarters-mappings.json`

   This is a **grouping system**, so each mapping represents a QUARTER (not a gate):
   ```json
   {
     "systemName": "The 4 Quarters",
     "version": "1.0.0",
     "description": "The four quarters of the mandala derived from first 2 binary bits",
     "completeness": "full",
     "dataArchitecture": "grouping",
     "totalGroups": 4,
     "mappings": [
       {
         "groupName": "Mutation",
         "binaryPattern": "11",
         "gatesPerQuarter": 16,
         "knowledge": {
           "purpose": "Transformation through mutation and change",
           "theme": "Initiation through metamorphosis",
           "quality": "Transformative, unpredictable, evolutionary",
           "direction": "Individual empowerment through mutation",
           "gates": "Gates with lines 1-2 yang (binary 11xx)",
           "description": "The Quarter of Mutation initiates transformation through spontaneous change and empowered individuation."
         }
       },
       {
         "groupName": "Initiation",
         "binaryPattern": "10",
         "gatesPerQuarter": 16,
         "knowledge": {
           "purpose": "Initiation through purpose and direction",
           "theme": "Finding and fulfilling one's purpose",
           "quality": "Purposeful, directed, intentional",
           "direction": "Individual purpose through initiation",
           "gates": "Gates with line 1 yang, line 2 yin (binary 10xx)",
           "description": "The Quarter of Initiation guides individuals to discover and express their unique purpose."
         }
       },
       {
         "groupName": "Duality",
         "binaryPattern": "01",
         "gatesPerQuarter": 16,
         "knowledge": {
           "purpose": "Understanding through relationships and duality",
           "theme": "Bonding and relationship dynamics",
           "quality": "Relational, bonding, connecting",
           "direction": "Tribal purpose through relationship",
           "gates": "Gates with line 1 yin, line 2 yang (binary 01xx)",
           "description": "The Quarter of Duality explores consciousness through relationship and bonding."
         }
       },
       {
         "groupName": "Civilisation",
         "binaryPattern": "00",
         "gatesPerQuarter": 16,
         "knowledge": {
           "purpose": "Form and structure for collective benefit",
           "theme": "Building civilizations and systems",
           "quality": "Structural, systematic, collective",
           "direction": "Collective purpose through form",
           "gates": "Gates with lines 1-2 yin (binary 00xx)",
           "description": "The Quarter of Civilisation creates structures and systems that serve the collective."
         }
       }
     ]
   }
   ```

4. **Verify your mapping**:
   Create `knowledge-systems/quarters/verify.sh`:
   ```bash
   #!/bin/bash
   echo "🔍 4 Quarters - Verification"
   echo "============================"

   MAPPING_FILE="mappings/quarters-mappings.json"

   if [ ! -f "$MAPPING_FILE" ]; then
     echo "❌ Mapping file not found"
     exit 1
   fi

   TOTAL=$(node -p "require('./$MAPPING_FILE').mappings.length")
   echo "✅ Total quarters: $TOTAL"

   if [ "$TOTAL" -ne 4 ]; then
     echo "❌ Expected 4 quarters, found $TOTAL"
     exit 1
   fi

   # Verify all quarters present
   QUARTERS=$(node -p "require('./$MAPPING_FILE').mappings.map(m => m.groupName).join(',')")
   echo "✅ Quarters found: $QUARTERS"

   echo "✅ All verification checks passed!"
   exit 0
   ```

5. **Create tests** in `knowledge-systems/quarters/tests/quarters-tests.js`:
   ```javascript
   const fs = require('fs');
   const path = require('path');

   const mappingsPath = path.join(__dirname, '../mappings/quarters-mappings.json');
   const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

   const positioningAlgorithm = require('../../../core/root-system/positioning-algorithm.js');

   let passed = 0;
   let failed = 0;

   console.log('🧪 4 Quarters - Test Suite');
   console.log('=' .repeat(60));

   // Test 1: All 4 quarters present
   if (mappings.mappings.length === 4) {
     console.log('✅ Test 1: All 4 quarters present');
     passed++;
   } else {
     console.log(`❌ Test 1: Expected 4 quarters, found ${mappings.mappings.length}`);
     failed++;
   }

   // Test 2: Verify quarter names match root system
   const expectedQuarters = ['Mutation', 'Initiation', 'Duality', 'Civilisation'];
   const quarterNames = mappings.mappings.map(m => m.groupName);
   const allMatch = expectedQuarters.every(q => quarterNames.includes(q));

   if (allMatch) {
     console.log('✅ Test 2: All expected quarter names present');
     passed++;
   } else {
     const missing = expectedQuarters.filter(q => !quarterNames.includes(q));
     console.log(`❌ Test 2: Missing quarters: ${missing.join(', ')}`);
     failed++;
   }

   // Test 3: All quarters have purpose
   const withPurpose = mappings.mappings.filter(m => m.knowledge.purpose);
   if (withPurpose.length === 4) {
     console.log('✅ Test 3: All quarters have purpose');
     passed++;
   } else {
     console.log(`❌ Test 3: ${4 - withPurpose.length} quarters missing purpose`);
     failed++;
   }

   // Test 4: All quarters have themes
   const withThemes = mappings.mappings.filter(m => m.knowledge.theme);
   if (withThemes.length === 4) {
     console.log('✅ Test 4: All quarters have themes');
     passed++;
   } else {
     console.log(`❌ Test 4: ${4 - withThemes.length} quarters missing themes`);
     failed++;
   }

   // Test 5: Verify binary patterns are correct
   const expectedPatterns = { 'Mutation': '11', 'Initiation': '10', 'Duality': '01', 'Civilisation': '00' };
   let patternsCorrect = true;

   mappings.mappings.forEach(m => {
     if (m.binaryPattern !== expectedPatterns[m.groupName]) {
       console.log(`❌ ${m.groupName} has wrong binary pattern: ${m.binaryPattern}`);
       patternsCorrect = false;
     }
   });

   if (patternsCorrect) {
     console.log('✅ Test 5: All binary patterns correct');
     passed++;
   } else {
     failed++;
   }

   // Test 6: Verify root system calculations match
   console.log('\n📊 Verifying quarters match root calculations:');
   let rootMatches = true;

   // Test a few gates from each quarter
   const testGates = {
     1: 'Mutation',    // Binary 111111 → first 2 bits: 11
     13: 'Initiation', // Binary 101010 → first 2 bits: 10
     49: 'Duality',    // Binary 010101 → first 2 bits: 01
     2: 'Civilisation' // Binary 000000 → first 2 bits: 00
   };

   for (const [gateNum, expectedQuarter] of Object.entries(testGates)) {
     const data = positioningAlgorithm.getDockingData(parseInt(gateNum));
     if (data.relationships.quarter !== expectedQuarter) {
       console.log(`❌ Gate ${gateNum} quarter mismatch: expected ${expectedQuarter}, got ${data.relationships.quarter}`);
       rootMatches = false;
     }
   }

   if (rootMatches) {
     console.log('✅ Test 6: Root system calculations match');
     passed++;
   } else {
     failed++;
   }

   console.log('=' .repeat(60));
   console.log(`Total: ${passed + failed} | Passed: ${passed} ✅ | Failed: ${failed} ❌`);

   process.exit(failed === 0 ? 0 : 1);
   ```

6. **Create README**:
   Create `knowledge-systems/quarters/README.md` explaining the 4 quarters

7. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add 4 Quarters knowledge system

   - Thematic meanings for all 4 quarters
   - Derived from first 2 bits of binary patterns
   - Mutation, Initiation, Duality, Civilisation
   - All tests passing
   - Grouping system (4 groups of 16 gates each)"

   git push -u origin feature/knowledge-system-quarters
   ```

## Understanding the Root System

The root system ALREADY CALCULATES which quarter each gate belongs to:
```javascript
const positioningAlgorithm = require('./core/root-system/positioning-algorithm.js');

// Get quarter for Gate 1
const data = positioningAlgorithm.getDockingData(1);
console.log(data.relationships.quarter); // "Mutation"

// The root knows which gates belong to each quarter
// Your job is to provide the MEANING of each quarter
```

## The 4 Quarters Binary Mapping

| Quarter | Binary (first 2 bits) | Line 1 | Line 2 | Gates per Quarter |
|---------|----------------------|--------|--------|-------------------|
| **Mutation** | 11 | Yang | Yang | 16 gates |
| **Initiation** | 10 | Yang | Yin | 16 gates |
| **Duality** | 01 | Yin | Yang | 16 gates |
| **Civilisation** | 00 | Yin | Yin | 16 gates |

Each quarter contains exactly 16 gates (64 gates / 4 quarters = 16 gates per quarter).

## Required Mapping Format

This is a **grouping system**, so the format is different from gate-level systems:

- `groupName`: Quarter name (e.g., "Mutation")
- `binaryPattern`: 2-bit pattern (e.g., "11")
- `gatesPerQuarter`: Always 16
- `knowledge.purpose`: Primary purpose
- `knowledge.theme`: Core theme
- `knowledge.quality`: Key qualities
- `knowledge.direction`: Directional emphasis
- `knowledge.description`: Full description

## Verification Criteria

Your system MUST pass:
- ✅ All 4 quarters covered
- ✅ Valid quarter names (Mutation, Initiation, Duality, Civilisation)
- ✅ Correct binary patterns (11, 10, 01, 00)
- ✅ All quarters have purpose, theme, quality
- ✅ Matches root system calculations
- ✅ Tests pass

## Success Criteria

When complete, you should have:
1. Branch: `feature/knowledge-system-quarters`
2. File: `knowledge-systems/quarters/mappings/quarters-mappings.json` (4 quarters)
3. Tests: `knowledge-systems/quarters/tests/quarters-tests.js` (all passing)
4. Verification: `./verify.sh` returns exit code 0
5. Documentation: `knowledge-systems/quarters/README.md`

## Notes

- Quarters is a **grouping system** (4 groups, not 64 gates)
- The root system calculates which gates belong to which quarter
- You only provide the thematic MEANINGS for each quarter
- Each quarter represents a 2-bit binary pattern
- This is the SIMPLEST grouping system - perfect for understanding the pattern!

## Resources

- Human Design materials on the four quarters
- Gene Keys references to the quarters
- Ra Uru Hu's teachings on the mandala structure

## Deliverables

1. Complete mappings file (4 quarters with themes)
2. Test suite (all tests passing)
3. Verification script (passing)
4. README documentation
5. Committed and pushed to branch
6. Ready for PR/merge

Start by creating the branch, then document the thematic meanings of each of the 4 quarters.
