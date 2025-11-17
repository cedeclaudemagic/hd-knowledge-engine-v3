# Session Prompt: Traditional Human Design Gates (Black Book & White Book)

## Context

You are working on the **HD Knowledge Engine** repository. A **root docking system** has been established that provides the mathematical foundation.

Your task is to create the **Traditional Human Design Gates** knowledge system - this is LINE-LEVEL detail from the Black Book and White Book.

## Repository State

Branch: `feature/calculation-first-architecture`

The root docking system exists. This will be your FIRST line-level system (all others are gate-level).

## Your Mission

1. **Create a new branch**:
   ```bash
   ./core/scripts/create-knowledge-branch.sh hd-traditional-gates
   ```

2. **Extract data from existing sources**:
   - Look in `data/source/gates/gate-*.json` (64 individual files)
   - OR `data/source/lines/merged-lines-with-positioning.json`
   - Contains: Gate names, line keynotes, planetary assignments
   - Both Black Book AND White Book interpretations

3. **Create mapping file**: `knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json`
   ```json
   {
     "systemName": "Traditional Human Design Gates",
     "version": "1.0.0",
     "description": "Black Book and White Book gate and line interpretations",
     "completeness": "full",
     "mappings": [
       {
         "gateNumber": 1,
         "lineNumber": 1,
         "knowledge": {
           "gateName": "The Creative",
           "gateKeyword": "Self-Expression",
           "keynote": "Creation is independent of will",
           "blackBook": {
             "exaltation": { "planet": "Moon", "description": "..." },
             "detriment": { "planet": "Uranus", "description": "..." }
           },
           "whiteBook": {
             "exaltation": { "planet": "Moon", "description": "..." },
             "detriment": { "planet": "Uranus", "description": "..." }
           }
         }
       }
     ]
   }
   ```

4. **IMPORTANT**: This is LINE-LEVEL (384 mappings)
   - 64 gates × 6 lines = 384 total mappings
   - Each line has unique keynote and planetary assignments
   - Must set `lineNumber: 1-6` (not null)
   - Most detailed system

5. **Verify your mapping**:
   ```bash
   cd knowledge-systems/hd-traditional-gates
   ./verify.sh
   ```

6. **Create tests**:
   - Test all 384 lines present (64 gates × 6 lines)
   - Test all lines have keynotes
   - Test planetary assignments valid
   - Test both Black Book and White Book present
   - Test gate names present

7. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add Traditional HD Gates line-level system"
   git push -u origin feature/knowledge-system-hd-traditional-gates
   ```

## Line-Level Detail

Unlike other systems (gate-level), this has 6 lines per gate:

**Gate 1, Line 1**: "Creation is independent of will" (Moon/Uranus)
**Gate 1, Line 2**: "Love is light" (Venus/Mars)
**Gate 1, Line 3**: "The energy to sustain creative work" (Mars/Earth)
... etc for all 6 lines

Total: 64 gates × 6 lines = **384 mappings**

## Data Sources

You have TWO options:

**Option A**: Individual gate files
```bash
data/source/gates/gate-1.json
data/source/gates/gate-2.json
... (64 files)
```

**Option B**: Merged lines file
```bash
data/source/lines/merged-lines-with-positioning.json
```

Merged file already has all 384 lines with positioning. You might extract from there.

## Mapping Format

Each of 384 lines needs:
```json
{
  "gateNumber": 1,
  "lineNumber": 1,          // 1-6 (required for line-level)
  "knowledge": {
    "gateName": "The Creative",
    "gateKeyword": "Self-Expression",
    "lineKeynote": "Creation is independent of will",
    "blackBook": {
      "exaltation": { "planet": "Moon", "description": "..." },
      "detriment": { "planet": "Uranus", "description": "..." }
    },
    "whiteBook": {
      "exaltation": { "planet": "Moon", "description": "..." },
      "detriment": { "planet": "Uranus", "description": "..." }
    }
  }
}
```

## Verification Criteria

Your system MUST pass:
- ✅ All 384 lines present (64 gates × 6 lines)
- ✅ Every line has keynote
- ✅ Valid line numbers (1-6)
- ✅ Both interpretation systems present
- ✅ Planetary assignments valid
- ✅ Gate names present

## Tests Required

This is the LARGEST system (384 mappings):
```javascript
// Test 1: All 384 lines present
// Test 2: All gates have 6 lines
// Test 3: All lines have keynotes
// Test 4: All planetary assignments present
// Test 5: Both Black Book and White Book present
// Test 6: Valid planets (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Earth)
```

## Success Criteria

1. Branch: `feature/knowledge-system-hd-traditional-gates`
2. Mappings: All 384 lines (64 gates × 6 lines)
3. Tests: All passing
4. Verification: `./verify.sh` passes
5. Both interpretations: Black Book + White Book

## Notes

- This is LINE-LEVEL detail (most granular)
- 384 total mappings (largest system)
- Each line is unique position on wheel
- Root system provides wheel positioning
- You provide human interpretations
- Black Book = exaltation/detriment
- White Book = alternative planetary interpretations

## Suggested Approach

1. Load `merged-lines-with-positioning.json` (easiest source)
2. Extract 384 lines
3. Transform to docking format
4. Set `lineNumber` for each (1-6)
5. Verify completeness (384 total)
6. Test planetary assignments valid

This is the foundation of Human Design - the traditional gate and line meanings.

Start by exploring the data sources and deciding which to use.
