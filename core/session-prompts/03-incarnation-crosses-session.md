# Session Prompt: Incarnation Crosses Knowledge System

## Context

You are working on the **HD Knowledge Engine** repository. A **root docking system** has been established that provides the mathematical foundation (binary patterns, wheel positioning) for all knowledge systems.

Your task is to create the **Incarnation Crosses** knowledge system mapping that docks into this root.

## Repository State

Branch: `feature/calculation-first-architecture`

The root docking system provides positioning. You provide cross definitions and gate groupings.

## Your Mission

1. **Create a new branch** for Incarnation Crosses:
   ```bash
   ./core/scripts/create-knowledge-branch.sh incarnation-crosses
   ```

2. **Extract Incarnation Crosses data**:
   - Look in `data/source/extracted/incarnation-crosses-extracted-data.json`
   - Contains: 190 incarnation crosses
   - Types: LAX (Left Angle Cross), RAX (Right Angle Cross), JX (Juxtaposition Cross)
   - Each cross = 4 gates (Personality Sun/Earth, Design Sun/Earth)

3. **Create mapping file**: `knowledge-systems/incarnation-crosses/mappings/incarnation-crosses-mappings.json`

   This is COMPLEX because:
   - Each GATE can be part of multiple crosses
   - Same gate can play different roles (Personality Sun, Design Earth, etc.)

   Format:
   ```json
   {
     "systemName": "Incarnation Crosses",
     "version": "1.0.0",
     "description": "Life purpose and incarnation cross definitions",
     "completeness": "full",
     "mappings": [
       {
         "gateNumber": 1,
         "lineNumber": null,
         "knowledge": {
           "crossesAsSun": [
             {
               "name": "Right Angle Cross of Education 2",
               "type": "RAX",
               "gates": [11, 12, 46, 25],
               "role": "Personality Sun",
               "theme": "Teaching through example"
             }
           ],
           "crossesAsEarth": [...],
           "crossesAsDesignSun": [...],
           "crossesAsDesignEarth": [...]
         }
       }
     ]
   }
   ```

4. **Understanding Incarnation Crosses**:
   - 190 total crosses
   - LAX: 64 (one per gate as Personality Sun)
   - RAX: 63
   - JX: 63
   - Each cross = 4 gates in specific roles

5. **Verify your mapping**:
   ```bash
   cd knowledge-systems/incarnation-crosses
   ./verify.sh
   ```

6. **Create tests**:
   - Test all 64 gates covered
   - Test 190 crosses present
   - Test cross types valid (LAX/RAX/JX)
   - Test each cross has 4 gates
   - Test harmonic/opposite relationships

7. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add Incarnation Crosses knowledge system"
   git push -u origin feature/knowledge-system-incarnation-crosses
   ```

## Cross Structure

Example: **Right Angle Cross of Education 2**
- Personality Sun: Gate 11
- Personality Earth: Gate 12 (harmonic opposite of 11)
- Design Sun: Gate 46
- Design Earth: Gate 25 (harmonic opposite of 46)

Every gate needs to know:
- Which crosses it participates in
- What role it plays in each cross

## Data Source Structure

From `incarnation-crosses-extracted-data.json`:
```json
{
  "Education 2": {
    "type": "LAX",
    "personalitySun": 11,
    "personalityEarth": 12,
    "designSun": 46,
    "designEarth": 25,
    "gates": [11, 12, 46, 25]
  }
}
```

You need to INVERT this structure:
- For Gate 11: It's the Personality Sun in "Education 2"
- For Gate 12: It's the Personality Earth in "Education 2"
- etc.

## Verification Criteria

Your system MUST pass:
- ✅ All 64 gates covered
- ✅ 190 crosses defined (64 LAX + 63 RAX + 63 JX)
- ✅ Each cross has exactly 4 gates
- ✅ Gate roles correct (Sun/Earth/Design)
- ✅ Harmonic relationships valid
- ✅ No duplicate crosses

## Complex Mapping Challenge

Unlike Gene Keys (1 gate → 1 meaning), Incarnation Crosses are:
- Many-to-many relationships
- Same gate in multiple crosses
- Role-dependent meanings

Your mapping must handle:
```javascript
Gate 1 appears in:
  - Cross A (as Personality Sun)
  - Cross B (as Design Earth)
  - Cross C (as Personality Earth)
```

## Tests Required

Create comprehensive tests:
```javascript
// Test 1: All 64 gates present in mappings
// Test 2: All 190 crosses present across all gates
// Test 3: Each cross has exactly 4 gates
// Test 4: Cross types valid (LAX/RAX/JX)
// Test 5: No cross appears twice
// Test 6: Harmonic relationships valid
// Test 7: Gate roles consistent
```

## Success Criteria

1. Branch: `feature/knowledge-system-incarnation-crosses`
2. Mappings: All 64 gates with their cross participations
3. Cross definitions: All 190 crosses represented
4. Tests: All passing
5. Verification: `./verify.sh` passes
6. Documentation: Explain the inversion logic

## Notes

- This is the MOST COMPLEX knowledge system
- Requires inverting cross → gates into gates → crosses
- Many-to-many relationships
- Each gate in ~8-12 different crosses
- Role matters (Sun vs Earth vs Design)

## Suggested Approach

1. First, read and understand the source data structure
2. Write a transformation script to invert the structure
3. For each gate, collect all crosses it appears in
4. For each cross appearance, note the role
5. Create mapping with gate-centric view
6. Verify cross definitions are complete

## Alternative Structure (Consider)

You might want TWO files:
1. `gate-cross-mappings.json` - Gate-centric (for docking)
2. `cross-definitions.json` - Cross-centric (for reference)

Then reference between them.

Start by understanding the existing data structure and planning the inversion logic.
