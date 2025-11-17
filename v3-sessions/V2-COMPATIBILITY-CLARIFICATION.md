# V2 Compatibility Clarification

**Created:** November 17, 2025
**Purpose:** Resolve confusion about "V2 compatible" default configuration

---

## The Actual V2 Baseline

The V2 system (from `/core/root-system/gate-sequence.json`) uses this gate sequence:

```json
{
  "sequence": [41, 19, 13, 49, 30, ...],
  "notes": {
    "position0": "Gate 41 starts at wheel position 0 (45° from north)"
  }
}
```

**Actual V2 Behavior:**
- ✅ Gate 41 at wheel position 0 (angle 0°)
- ✅ Gate 10 at wheel position 58 (angle 326.25°)
- ✅ Gate 19 at wheel position 1 (angle 5.625°)

---

## Session 02 Incorrect Assumptions

Session 02's prompt incorrectly states that "V2 compatible" means:
- ❌ Gate 10 at position 0 (angle 0°)
- ❌ Gate 41 at position 58

**This is backwards and would BREAK V2 compatibility!**

---

## The Correct Approach for Session 02

### What V3 Configuration System Should Do:

1. **Default sequence = Current V2 sequence** (Gate 41 at position 0)
   - Name it appropriately: "v2-baseline" or "iching-position-0"
   - This maintains 100% backward compatibility
   - All 89 existing tests continue to pass

2. **Add alternative sequences as OPTIONS:**
   - "hd-standard" (Gates 10/11 at north) - for HD wheel visualizations
   - "iching-traditional" - traditional I Ching arrangements
   - Custom sequences - user-defined

3. **Users opt-in to alternatives:**
   ```javascript
   // Default behavior (V2 compatible)
   const knowledge = getGateKnowledge(13);

   // Opt-in to alternative
   setWheelConfiguration('hd-standard');
   const knowledge2 = getGateKnowledge(13);
   ```

---

## Required Fixes to Session 02 Prompt

### Fix #1: Rename Default Sequence

**Current (WRONG):**
```javascript
let wheelConfig = new WheelConfiguration(); // Defaults to hd-standard
```

**Fixed (CORRECT):**
```javascript
let wheelConfig = new WheelConfiguration(); // Defaults to v2-baseline
```

### Fix #2: Update Sequence Files

**Add this as the DEFAULT sequence:**

`core/root-system/sequences/v2-baseline.json`:
```json
{
  "name": "v2-baseline",
  "description": "V2 Baseline - Gate 41 at position 0 (maintains V2 compatibility)",
  "version": "2.0.0",
  "sequence": [
    41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
    27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
    31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
    28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60
  ]
}
```

**Keep hd-standard and iching-traditional as ALTERNATIVE OPTIONS.**

### Fix #3: Update Backward Compatibility Tests

**Current (WRONG):**
```javascript
const pos = positioning.getWheelPosition(10, 1);
assertTest(pos.angle === 0, 'Gate 10 at 0° with default config (V2 compatible)');
```

**Fixed (CORRECT):**
```javascript
const pos = positioning.getWheelPosition(41, 1);
assertTest(pos.angle === 0, 'Gate 41 at 0° with default config (V2 compatible)');

const pos10 = positioning.getWheelPosition(10, 1);
assertTest(pos10.wheelIndex === 58, 'Gate 10 at position 58 (V2 compatible)');
```

### Fix #4: Update Default Config Test

**Current (WRONG):**
```javascript
assert(config.config.sequenceName === 'hd-standard', 'Default is hd-standard');
```

**Fixed (CORRECT):**
```javascript
assert(config.config.sequenceName === 'v2-baseline', 'Default is v2-baseline');
```

### Fix #5: Update Direction Hypothesis Test

The known positions need to be corrected:

**Current (WRONG):**
```javascript
const KNOWN_POSITIONS = {
  10: { expectedAngle: 0, description: 'Gate 10 should be at north (0°)' },
  41: { expectedAngle: 326.25, description: 'Gate 41 should be at ~326°' }
};
```

**Fixed (CORRECT):**
```javascript
const KNOWN_POSITIONS = {
  41: { expectedAngle: 0, description: 'Gate 41 at north (0°) - V2 baseline' },
  10: { expectedAngle: 326.25, description: 'Gate 10 at ~326° - V2 baseline' },
  19: { expectedAngle: 5.625, description: 'Gate 19 just after north - V2 baseline' }
};
```

---

## Why This Doesn't Break Anything

**The key insight:** Existing 89 tests DON'T check wheel positions!

They check:
- ✅ Gene Keys data ("Discord", "Beauty", etc.)
- ✅ Center assignments ("G", "Solar Plexus", etc.)
- ✅ Binary patterns ("101111", etc.)
- ✅ Relationships (channels, programming partners, etc.)

**None of this changes with different wheel sequences!**

Only the NEW configuration tests (Session 02) check specific positions, and they should verify the ACTUAL V2 positions (Gate 41 at 0°).

---

## Implementation Strategy

1. ✅ Create three sequence files:
   - `v2-baseline.json` (default) - Gate 41 at position 0
   - `hd-standard.json` (alternative) - Gates 10/11 at north
   - `iching-traditional.json` (alternative) - Traditional I Ching

2. ✅ WheelConfiguration defaults to 'v2-baseline'

3. ✅ All existing tests pass (because default = current behavior)

4. ✅ New config tests verify:
   - Default matches V2 (Gate 41 at 0°)
   - Can switch to alternatives
   - Switching changes positions correctly

5. ✅ Zero breaking changes

---

## Action Items

- [ ] Update SESSION-02-CONFIGURATION-SYSTEM.md with corrections above
- [ ] Create v2-baseline.json sequence file
- [ ] Update all "hd-standard is default" references to "v2-baseline is default"
- [ ] Fix backward compatibility test assertions
- [ ] Fix direction hypothesis test known positions
- [ ] Verify changes don't affect Sessions 03-10
- [ ] Update 00-MASTER-SESSION-ORCHESTRATOR.md if needed

---

**Bottom Line:** V2 compatibility means keeping the current sequence (Gate 41 at position 0) as default. Session 02 adds the ABILITY to switch to other sequences like "hd-standard", but doesn't make them the default.
