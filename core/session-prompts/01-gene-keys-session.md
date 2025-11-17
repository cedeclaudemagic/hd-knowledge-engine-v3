# Session Prompt: Gene Keys Knowledge System

## Context

You are working on the **HD Knowledge Engine** repository. A **root docking system** has been established that provides the mathematical foundation (binary patterns, wheel positioning) for all knowledge systems.

Your task is to create the **Gene Keys** knowledge system mapping that docks into this root.

## Repository State

Branch: `feature/calculation-first-architecture`

The root docking system exists at:
- `core/root-system/binary-identity.json` - 64 gates with binary patterns
- `core/root-system/gate-sequence.json` - Canonical wheel order
- `core/root-system/positioning-algorithm.js` - Calculation functions
- `core/root-system/verification-protocol.js` - Automated testing

## Your Mission

1. **Create a new branch** for Gene Keys:
   ```bash
   ./core/scripts/create-knowledge-branch.sh gene-keys
   ```

2. **Extract Gene Keys data** from existing sources:
   - Look in `data/source/extracted/gene-keys-extracted-data.js`
   - Contains: Shadow, Gift, Siddhi for all 64 gates
   - Convert to the docking format

3. **Create mapping file**: `knowledge-systems/gene-keys/mappings/gene-keys-mappings.json`
   ```json
   {
     "systemName": "Gene Keys",
     "version": "1.0.0",
     "description": "Gene Keys Spectrum of Consciousness",
     "completeness": "full",
     "mappings": [
       {
         "gateNumber": 1,
         "lineNumber": null,
         "knowledge": {
           "shadow": "Entropy",
           "gift": "Freshness",
           "siddhi": "Beauty",
           "programmingPartner": "...",
           "frequency": "Introverted/Extroverted"
         }
       }
     ]
   }
   ```

4. **Verify your mapping**:
   ```bash
   cd knowledge-systems/gene-keys
   ./verify.sh
   ```
   Must pass ALL tests before committing.

5. **Create tests** in `knowledge-systems/gene-keys/tests/`:
   - Test all 64 gates are present
   - Test each gate has shadow/gift/siddhi
   - Test docking coordinates are valid
   - Test no duplicate gates

6. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add Gene Keys knowledge system with verification"
   git push -u origin feature/knowledge-system-gene-keys
   ```

## Required Mapping Format

Every mapping entry MUST have:
- `gateNumber`: 1-64 (required)
- `lineNumber`: null for gate-level systems (Gene Keys is gate-level)
- `knowledge`: Your Gene Keys data (shadow, gift, siddhi, etc.)

The root system will automatically calculate:
- Binary pattern
- Wheel position
- Angle
- Quarter, Face, Trigrams
- Opposite gate

## Verification Criteria

Your system MUST pass:
- ✅ All 64 gates covered
- ✅ Valid gate numbers (1-64)
- ✅ All mappings can dock into root
- ✅ Required fields present (shadow, gift, siddhi)
- ✅ No duplicates
- ✅ Tests pass

## Success Criteria

When complete, you should have:
1. Branch: `feature/knowledge-system-gene-keys`
2. File: `knowledge-systems/gene-keys/mappings/gene-keys-mappings.json` (all 64 gates)
3. Tests: `knowledge-systems/gene-keys/tests/*.js` (all passing)
4. Verification: `./verify.sh` returns exit code 0
5. Documentation: `knowledge-systems/gene-keys/README.md` updated

## Data Source

Extract from: `data/source/extracted/gene-keys-extracted-data.js`

Example structure you'll find:
```javascript
"1": {
  "shadow": "Entropy",
  "gift": "Freshness",
  "siddhi": "Beauty",
  "frequency": "Introverted"
}
```

Convert to docking format and verify.

## Notes

- Gene Keys is a **gate-level** system (no line-level detail)
- Set `lineNumber: null` for all mappings
- Set `completeness: "full"` (should cover all 64 gates)
- The root system handles ALL positioning math
- You only provide the meanings (shadow/gift/siddhi)

## Deliverables

1. Complete mappings file (64 gates)
2. Test suite (all tests passing)
3. Verification passing
4. Committed and pushed to branch
5. Ready for PR/merge

Start by creating the branch and exploring the existing Gene Keys data source.
