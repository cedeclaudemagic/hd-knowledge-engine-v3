# Session Prompt: The 16 Mythological Faces

## Context

You are working on the **HD Knowledge Engine** repository. A **root docking system** has been established that provides the mathematical foundation (binary patterns, wheel positioning) for all knowledge systems.

Your task is to create the **16 Mythological Faces** knowledge system that docks into this root.

**IMPORTANT**: The root system ALREADY CALCULATES which face each gate belongs to based on binary patterns. Your job is to provide the MYTHOLOGICAL MEANINGS for each of the 16 faces.

## Repository State

Branch: `feature/calculation-first-architecture`

The root docking system exists at:
- `core/root-system/binary-identity.json` - 64 gates with binary patterns
- `core/root-system/gate-sequence.json` - Canonical wheel order
- `core/root-system/positioning-algorithm.js` - **getFace()** function calculates faces
- `core/root-system/verification-protocol.js` - Automated testing

## Your Mission

1. **Create a new branch** for Faces:
   ```bash
   git checkout feature/calculation-first-architecture
   git pull origin feature/calculation-first-architecture
   git checkout -b feature/knowledge-system-faces
   mkdir -p knowledge-systems/faces/{mappings,tests}
   ```

2. **Understand how Faces are calculated**:
   The root system calculates faces from the **first 4 bits** of each gate's binary pattern:
   ```javascript
   // Example: Gate 1 has binary "111111"
   // First 4 bits: "1111" = "AA" codon pattern = "Hades" face

   const positioningAlgorithm = require('../../../core/root-system/positioning-algorithm.js');
   const faceForGate1 = positioningAlgorithm.getDockingData(1).relationships.face;
   // Result: "Hades"
   ```

   The 16 faces are organized by codon patterns derived from binary:
   ```
   11 = A, 00 = U, 10 = C, 01 = G

   AA = Hades           AC = Prometheus      AG = Vishnu         AU = Keepers of the Wheel
   CA = Kali            CC = Mitra           CG = Michael        CU = Janus
   GA = Minerva         GC = Christ          GG = Harmonia       GU = Thoth
   UA = Maat            UC = Parvati         UG = Lakshmi        UU = Maia
   ```

3. **Create mapping file**: `knowledge-systems/faces/mappings/faces-mappings.json`

   This is a **grouping system**, so each mapping represents a FACE (not a gate):
   ```json
   {
     "systemName": "The 16 Mythological Faces",
     "version": "1.0.0",
     "description": "Mythological archetypes from binary codon patterns (first 4 bits)",
     "completeness": "full",
     "dataArchitecture": "grouping",
     "totalGroups": 16,
     "mappings": [
       {
         "groupName": "Hades",
         "codonPattern": "AA",
         "binaryPattern": "1111",
         "knowledge": {
           "mythology": "Greek god of the underworld",
           "archetype": "Death and Rebirth",
           "theme": "Transformation through descent",
           "realm": "The depths, hidden riches, renewal",
           "quality": "Depth, intensity, transformation"
         }
       },
       {
         "groupName": "Prometheus",
         "codonPattern": "AC",
         "binaryPattern": "1110",
         "knowledge": {
           "mythology": "Greek titan who stole fire from the gods",
           "archetype": "The Rebel and Benefactor",
           "theme": "Innovation through rebellion",
           "realm": "Technology, foresight, sacrifice",
           "quality": "Foresight, creativity, defiance"
         }
       }
       // ... 14 more faces
     ]
   }
   ```

4. **Research the 16 Faces**:
   You need to provide mythological meanings for all 16 faces:
   1. **Hades** (AA) - Underworld, transformation
   2. **Prometheus** (AC) - Fire-bringer, rebellion
   3. **Vishnu** (AG) - Preserver, cosmic order
   4. **Keepers of the Wheel** (AU) - Dharma guardians
   5. **Kali** (CA) - Destruction and creation
   6. **Mitra** (CC) - Friendship, contracts
   7. **Michael** (CG) - Archangel, warrior
   8. **Janus** (CU) - Two faces, transitions
   9. **Minerva** (GA) - Wisdom, strategy
   10. **Christ** (GC) - Compassion, sacrifice
   11. **Harmonia** (GG) - Balance, harmony
   12. **Thoth** (GU) - Knowledge, writing
   13. **Maat** (UA) - Truth, justice
   14. **Parvati** (UC) - Divine feminine
   15. **Lakshmi** (UG) - Abundance, fortune
   16. **Maia** (UU) - Mother, nurturing

5. **Verify your mapping**:
   Create `knowledge-systems/faces/verify.sh`:
   ```bash
   #!/bin/bash
   echo "🔍 16 Mythological Faces - Verification"
   echo "========================================"

   MAPPING_FILE="mappings/faces-mappings.json"

   if [ ! -f "$MAPPING_FILE" ]; then
     echo "❌ Mapping file not found"
     exit 1
   fi

   TOTAL=$(node -p "require('./$MAPPING_FILE').mappings.length")
   echo "✅ Total faces: $TOTAL"

   if [ "$TOTAL" -ne 16 ]; then
     echo "❌ Expected 16 faces, found $TOTAL"
     exit 1
   fi

   echo "✅ All verification checks passed!"
   exit 0
   ```

6. **Create tests** in `knowledge-systems/faces/tests/faces-tests.js`:
   ```javascript
   const fs = require('fs');
   const path = require('path');

   const mappingsPath = path.join(__dirname, '../mappings/faces-mappings.json');
   const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));

   const positioningAlgorithm = require('../../../core/root-system/positioning-algorithm.js');

   let passed = 0;
   let failed = 0;

   console.log('🧪 16 Mythological Faces - Test Suite');
   console.log('=' .repeat(60));

   // Test 1: All 16 faces present
   if (mappings.mappings.length === 16) {
     console.log('✅ Test 1: All 16 faces present');
     passed++;
   } else {
     console.log(`❌ Test 1: Expected 16 faces, found ${mappings.mappings.length}`);
     failed++;
   }

   // Test 2: All faces have mythology
   const withMythology = mappings.mappings.filter(m => m.knowledge.mythology);
   if (withMythology.length === 16) {
     console.log('✅ Test 2: All faces have mythology');
     passed++;
   } else {
     console.log(`❌ Test 2: ${16 - withMythology.length} faces missing mythology`);
     failed++;
   }

   // Test 3: All faces have archetypes
   const withArchetypes = mappings.mappings.filter(m => m.knowledge.archetype);
   if (withArchetypes.length === 16) {
     console.log('✅ Test 3: All faces have archetypes');
     passed++;
   } else {
     console.log(`❌ Test 3: ${16 - withArchetypes.length} faces missing archetypes`);
     failed++;
   }

   // Test 4: Verify face calculations match root system
   console.log('\n📊 Verifying face calculations match root system:');
   const expectedFaces = [
     'Hades', 'Prometheus', 'Vishnu', 'Keepers of the Wheel',
     'Kali', 'Mitra', 'Michael', 'Janus',
     'Minerva', 'Christ', 'Harmonia', 'Thoth',
     'Maat', 'Parvati', 'Lakshmi', 'Maia'
   ];

   const faceNames = mappings.mappings.map(m => m.groupName);
   const allMatch = expectedFaces.every(face => faceNames.includes(face));

   if (allMatch) {
     console.log('✅ Test 4: All 16 expected faces are present');
     passed++;
   } else {
     const missing = expectedFaces.filter(f => !faceNames.includes(f));
     console.log(`❌ Test 4: Missing faces: ${missing.join(', ')}`);
     failed++;
   }

   // Test 5: Verify codon patterns are correct
   const validCodons = [
     'AA', 'AC', 'AG', 'AU',
     'CA', 'CC', 'CG', 'CU',
     'GA', 'GC', 'GG', 'GU',
     'UA', 'UC', 'UG', 'UU'
   ];

   const codonPatterns = mappings.mappings.map(m => m.codonPattern);
   const allValidCodons = codonPatterns.every(c => validCodons.includes(c));

   if (allValidCodons && codonPatterns.length === 16) {
     console.log('✅ Test 5: All codon patterns are valid');
     passed++;
   } else {
     console.log('❌ Test 5: Some codon patterns are invalid');
     failed++;
   }

   console.log('=' .repeat(60));
   console.log(`Total: ${passed + failed} | Passed: ${passed} ✅ | Failed: ${failed} ❌`);

   process.exit(failed === 0 ? 0 : 1);
   ```

7. **Create README**:
   Create `knowledge-systems/faces/README.md` explaining the 16 faces

8. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add 16 Mythological Faces knowledge system

   - Mythological archetypes for all 16 faces
   - Derived from first 4 bits of binary patterns
   - AA-UU codon patterns
   - All tests passing
   - Grouping system (16 groups, not 64 gates)"

   git push -u origin feature/knowledge-system-faces
   ```

## Understanding the Root System

The root system ALREADY CALCULATES which face each gate belongs to:
```javascript
const positioningAlgorithm = require('./core/root-system/positioning-algorithm.js');

// Get face for Gate 1
const data = positioningAlgorithm.getDockingData(1);
console.log(data.relationships.face); // "Hades"

// The root knows which gates belong to each face
// Your job is to provide the MEANING of each face
```

## The 16 Faces Codon Matrix

| Row | AA | AC | AG | AU |
|-----|----|----|----|----|
| **A-** | Hades | Prometheus | Vishnu | Keepers |
| **C-** | Kali | Mitra | Michael | Janus |
| **G-** | Minerva | Christ | Harmonia | Thoth |
| **U-** | Maat | Parvati | Lakshmi | Maia |

Each face contains approximately 4 gates (64 gates / 16 faces = 4 gates per face).

## Required Mapping Format

This is a **grouping system**, so the format is different from gate-level systems:

- `groupName`: Face name (e.g., "Hades")
- `codonPattern`: Two-letter codon (e.g., "AA")
- `binaryPattern`: 4-bit pattern (e.g., "1111")
- `knowledge.mythology`: Mythological origin story
- `knowledge.archetype`: Archetypal meaning
- `knowledge.theme`: Core theme
- `knowledge.realm`: Domain or realm
- `knowledge.quality`: Key qualities

## Verification Criteria

Your system MUST pass:
- ✅ All 16 faces covered
- ✅ Valid codon patterns (AA, AC, AG... UU)
- ✅ All faces have mythology
- ✅ All faces have archetypes
- ✅ Matches expected face names
- ✅ Tests pass

## Success Criteria

When complete, you should have:
1. Branch: `feature/knowledge-system-faces`
2. File: `knowledge-systems/faces/mappings/faces-mappings.json` (16 faces)
3. Tests: `knowledge-systems/faces/tests/faces-tests.js` (all passing)
4. Verification: `./verify.sh` returns exit code 0
5. Documentation: `knowledge-systems/faces/README.md`

## Notes

- Faces is a **grouping system** (16 groups, not 64 gates)
- The root system calculates which gates belong to which face
- You only provide the mythological MEANINGS for each face
- Each face represents a specific 4-bit binary pattern
- This demonstrates how grouping systems work differently from gate-level systems

## Resources for Research

- Gene Keys materials on the 16 Faces
- Mythological references for each deity/archetype
- Human Design literature on face groupings
- The root system's `getFace()` function shows how they're calculated

## Deliverables

1. Complete mappings file (16 faces with mythology)
2. Test suite (all tests passing)
3. Verification script (passing)
4. README documentation
5. Committed and pushed to branch
6. Ready for PR/merge

Start by creating the branch, then research the mythological meanings of each of the 16 faces.
