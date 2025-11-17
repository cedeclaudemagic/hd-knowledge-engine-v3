# Session Prompt: Codon Rings Knowledge System

## Context

You are working on the **HD Knowledge Engine** repository. A **root docking system** has been established that provides the mathematical foundation (binary patterns, wheel positioning) for all knowledge systems.

Your task is to create the **Codon Rings** knowledge system mapping that docks into this root.

## Repository State

Branch: `feature/calculation-first-architecture`

The root docking system exists and provides binary-to-codon conversions automatically.

## Your Mission

1. **Create a new branch** for Codon Rings:
   ```bash
   ./core/scripts/create-knowledge-branch.sh codon-rings
   ```

2. **Extract Codon Rings data** from existing sources:
   - Look in `data/source/extracted/codon-rings-manual-data.js`
   - Contains: 22 codon rings with amino acid mappings
   - Each ring groups multiple gates by biochemical pathways

3. **Create mapping file**: `knowledge-systems/codon-rings/mappings/codon-rings-mappings.json`
   ```json
   {
     "systemName": "Codon Rings",
     "version": "1.0.0",
     "description": "Biochemical amino acid correlations and DNA codon mappings",
     "completeness": "full",
     "mappings": [
       {
         "gateNumber": 1,
         "lineNumber": null,
         "knowledge": {
           "ring": "Ring of Light",
           "aminoAcid": "Lysine",
           "codon": "AAA",
           "biochemicalFunction": "...",
           "ringGates": [1, 2, ...]
         }
       }
     ]
   }
   ```

4. **Important**: Codon Rings group gates
   - 22 rings total
   - Each ring contains multiple gates
   - Each gate belongs to ONE ring
   - Use the amino acid correlation

5. **Verify your mapping**:
   ```bash
   cd knowledge-systems/codon-rings
   ./verify.sh
   ```

6. **Create tests**:
   - Test all 64 gates covered
   - Test all 22 rings present
   - Test no gate in multiple rings
   - Test amino acid mappings valid
   - Test codon patterns match binary

7. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add Codon Rings knowledge system"
   git push -u origin feature/knowledge-system-codon-rings
   ```

## Data Structure

Codon Rings are **groupings** of gates. Example:

**Ring of Light** (Lysine): Gates 1, 2, 43, 14, 34, 9

Each gate in this ring gets:
```json
{
  "gateNumber": 1,
  "knowledge": {
    "ring": "Ring of Light",
    "aminoAcid": "Lysine",
    "codon": "AAA",
    "ringGates": [1, 2, 43, 14, 34, 9],
    "biochemicalRole": "..."
  }
}
```

## The 22 Codon Rings

Extract from source, but they are:
1. Ring of Light (Lysine)
2. Ring of Life & Death (Arginine)
3. Ring of Humanity (Proline)
4. Ring of Water (Histidine)
5. Ring of No Return (Leucine)
... (22 total)

## Verification Criteria

Your system MUST pass:
- ✅ All 64 gates covered
- ✅ All 22 rings present
- ✅ Each gate in exactly ONE ring
- ✅ Amino acids valid
- ✅ Codon patterns match root system binaries
- ✅ Ring groupings match source data

## Cross-Verification with Root

The root system provides `codon` from binary patterns.
Your amino acid mapping should align with these codons.

Example: Gate 1 has binary "111111" → codon "AAA" → Lysine (Ring of Light)

**Verify**: Your ring assignments match the root's codon calculations.

## Tests Required

Create `knowledge-systems/codon-rings/tests/codon-rings.test.js`:

```javascript
// Test 1: All 64 gates present
// Test 2: All 22 rings present
// Test 3: No gate in multiple rings
// Test 4: Codons match root system
// Test 5: Amino acids valid
// Test 6: Ring groupings complete
```

## Success Criteria

1. Branch: `feature/knowledge-system-codon-rings`
2. Mappings: All 64 gates mapped to their ring
3. Tests: All passing
4. Verification: `./verify.sh` passes
5. Cross-check: Codons match root binary patterns

## Data Source

Extract from: `data/source/extracted/codon-rings-manual-data.js`

Structure you'll find:
```javascript
RING_OF_LIGHT: {
  name: "Ring of Light",
  aminoAcid: "Lysine",
  gates: [1, 2, 43, 14, 34, 9],
  codons: ["AAA", "UUU", ...]
}
```

## Notes

- Codon Rings are **gate-level** (no line detail)
- Each ring groups multiple gates
- Biochemical/DNA correlation layer
- Root provides codon from binary
- You provide ring assignment + amino acid

Start by exploring the existing codon rings data and understanding the ring groupings.
