# All Sessions - Discrepancy Analysis

**Date:** November 17, 2025
**Purpose:** Complete list of discrepancies across all session prompts

---

## Overview

Searched for problematic terms:
- `v2-baseline` (should be `rave-wheel-41-start`)
- `hd-standard` (should be `gates-10-start`)
- `counter-clockwise` as default (should be `clockwise`)
- `Gate 41 at 0°` expectations (should be `Gates 10/11 at 0°`)

---

## SESSION-01: Foundation Setup
**Status:** ✅ No configuration-specific issues (foundational setup only)
**Action needed:** None - doesn't deal with sequence configuration yet

---

## SESSION-02: Configuration System
**Status:** ⚠️ ~34 instances found
**Action needed:** MAJOR updates required (see SESSION-02-CHANGES-CHECKLIST.md)

**Key areas:**
- Default configuration name
- All test assertions
- Direction hypothesis test
- Backward compatibility tests
- Angle expectations throughout

---

## SESSION-03: TypeScript Definitions
**Status:** ⚠️ Minor issues expected

**Likely issues:**
1. `SequenceName` type definition may list wrong sequence names
2. Example code might reference `v2-baseline` or `hd-standard`
3. Default config type might not include `rotationOffset`

**Need to check:**
- Line ~94: `export type SequenceName = ...`
- Any example code using sequence names
- `WheelConfigOptions` interface - does it have rotationOffset?
- `WheelConfigPreset` interface - all three mandatory fields?

---

## SESSION-04: Extension Layer
**Status:** ⚠️ Unknown - needs review

**Likely issues:**
- Example code might use old sequence names
- Integration with configuration system might have wrong defaults

**Need to check:**
- Any references to configuration in examples
- Extension queries using wheel positions

---

## SESSION-05: Integration Testing
**Status:** ⚠️ Multiple issues expected

**Known from earlier grep:**
- "V2 compatibility verification tests" mentioned
- May have wrong expectations about default positions

**Need to check:**
- Integration test expectations
- Configuration switching tests
- Backward compatibility assertions
- All test examples

---

## SESSION-06: Documentation
**Status:** ⚠️ Unknown - will inherit issues from Sessions 02-05

**Likely issues:**
- API documentation examples using wrong sequence names
- Configuration guide showing wrong defaults
- Examples not including mandatory rotationOffset

---

## SESSION-07: Examples & Demos
**Status:** ⚠️ Unknown

**Likely issues:**
- Demo code using v2-baseline/hd-standard
- Examples not showing three mandatory fields
- Wrong default expectations in comments

---

## SESSION-08: Migration Tools
**Status:** ⚠️ Unknown

**Likely issues:**
- Migration scripts might reference old names
- V1→V3 migration might have wrong expectations

---

## SESSION-09: Extended Testing
**Status:** ⚠️ Unknown

**Likely issues:**
- Extended tests might have wrong position expectations
- Edge case tests using old sequence names

---

## SESSION-10: Release Preparation
**Status:** ⚠️ Minor - mostly references

**Likely issues:**
- CHANGELOG might use old terms
- Release notes might reference wrong defaults

---

## Priority Order for Fixes

### 🔴 CRITICAL (Must fix before implementing)
1. **SESSION-02** - Configuration System (~34 instances)
   - ALL test expectations
   - ALL sequence names
   - ALL angle calculations

### 🟡 HIGH (Fix before that session)
2. **SESSION-03** - TypeScript types must be correct
3. **SESSION-05** - Integration tests must use correct expectations

### 🟢 MEDIUM (Fix before parallel sessions)
4. **SESSION-06** - Documentation
5. **SESSION-07** - Examples

### ⚪ LOW (Fix before release)
6. **SESSION-08** - Migration tools
7. **SESSION-09** - Extended tests
8. **SESSION-10** - Release prep

---

## Detailed Findings by Session

### SESSION-02 Detailed (see SESSION-02-CHANGES-CHECKLIST.md)
~34 instances requiring updates across:
- Task 2.3: Default config references (1 instance)
- Task 2.4: Configuration tests (20+ instances)
- Task 2.5: Direction hypothesis (5 instances)
- Task 2.6: Backward compat tests (5 instances)
- Task 2.9: Git commit message (2 instances)
- Verification checklist (2 instances)
- Troubleshooting (2 instances)

### SESSION-03 Expected Issues

**File:** `core/types/config.d.ts`
```typescript
// CURRENT (WRONG):
export type SequenceName = 'v2-baseline' | 'hd-standard' | 'custom';

// SHOULD BE:
export type SequenceName = 'rave-wheel-41-start' | 'gates-10-start' | 'custom';

// MISSING:
export interface WheelConfigOptions {
  sequenceName?: SequenceName;
  customSequence?: number[];
  rotationOffset?: number;        // ADD THIS - it's mandatory!
  direction?: WheelDirection;
}
```

**Example code** (likely around line ~616):
```typescript
// CURRENT (WRONG):
const config: WheelConfigOptions = {
  sequenceName: 'hd-standard',
  rotationOffset: 0,
  direction: 'counter-clockwise'  // Wrong direction
};

// SHOULD BE:
const config: WheelConfigOptions = {
  sequenceName: 'rave-wheel-41-start',
  rotationOffset: 33.75,  // With rotation for default
  direction: 'clockwise'
};
```

### SESSION-05 Expected Issues

**Integration tests** expecting wrong positions:
```javascript
// CURRENT (WRONG):
test('Default configuration matches V2 behavior', () => {
  const gate13 = engine.getGateKnowledge(13);
  assert(gate13.geneKeys.shadow === 'Discord', 'Gene Keys should match V2');
  assert(gate13.hdGates.center === 'G', 'Center should match V2');
});

// MISSING assertion that should be there:
test('Default configuration shows Gates 10/11 at north', () => {
  const pos10 = engine.getGateKnowledge(10);
  assert(Math.abs(pos10.angle - 0) < 1, 'Gate 10 at north with default config');
});
```

**Configuration switching tests:**
```javascript
// CURRENT (likely wrong):
engine.setWheelConfiguration({
  sequenceName: 'iching-traditional',  // This sequence doesn't exist!
  rotationOffset: 0,
  direction: 'counter-clockwise'  // Wrong default
});

// SHOULD BE:
engine.setWheelConfiguration({
  sequenceName: 'gates-10-start',  // Correct alternative sequence
  rotationOffset: 0,
  direction: 'clockwise'
});
```

---

## Search Patterns for Manual Review

Use these to find remaining issues:

```bash
# Find old sequence names
grep -rn "v2-baseline\|hd-standard\|iching-traditional" v3-sessions/SESSION-*.md

# Find wrong direction defaults
grep -rn "counter-clockwise.*default\|default.*counter-clockwise" v3-sessions/SESSION-*.md

# Find wrong angle expectations
grep -rn "Gate 41.*0°\|Gate 41 at 0\|angle === 0.*41" v3-sessions/SESSION-*.md

# Find missing rotation offset
grep -rn "WheelConfig\|setWheelConfiguration" v3-sessions/SESSION-*.md | grep -v "rotationOffset"

# Find three mandatory fields mentions
grep -rn "direction.*mandatory\|rotationOffset.*mandatory" v3-sessions/SESSION-*.md
```

---

## Systematic Fix Approach

For each session:

1. **Search for sequence names**
   - Replace `v2-baseline` → `rave-wheel-41-start`
   - Replace `hd-standard` → `gates-10-start`
   - Remove `iching-traditional` references (doesn't exist in new system)

2. **Search for direction**
   - Change default from `counter-clockwise` → `clockwise`
   - Keep both as options, but default must be clockwise

3. **Search for angle expectations**
   - Tests expecting `Gate 41 at 0°` → change to `Gates 10/11 at 0°`
   - Tests expecting `Gate 10 at 326.25°` → change to `Gate 10 at 0°`
   - Add rotation offset to all angle calculations

4. **Add mandatory fields**
   - Ensure all sequence file examples include `rotationOffset`
   - Ensure all config examples include all three values
   - Update TypeScript types to include rotationOffset

5. **Update test expectations**
   - Visual north = Gates 10/11 (not Gate 41)
   - Array position 0 = Gate 41 (correct)
   - Default rotation = 33.75° (not 0°)

---

## Completion Checklist

- [ ] SESSION-02: ~34 changes (see detailed checklist)
- [ ] SESSION-03: ~5-10 changes (types + examples)
- [ ] SESSION-04: Review needed
- [ ] SESSION-05: ~10-15 changes (integration tests)
- [ ] SESSION-06: ~5-10 changes (documentation)
- [ ] SESSION-07: ~5-10 changes (examples)
- [ ] SESSION-08: ~2-5 changes (migration)
- [ ] SESSION-09: ~5-10 changes (extended tests)
- [ ] SESSION-10: ~2-3 changes (release notes)

**Total estimated changes: ~70-100 across all sessions**

---

## Next Steps

1. ✅ Complete SESSION-02 fixes (use SESSION-02-CHANGES-CHECKLIST.md)
2. Review SESSION-03 for TypeScript issues
3. Review SESSION-05 for integration test issues
4. Update remaining sessions before parallel work begins

**Critical:** Must fix Sessions 02, 03, 05 before starting parallel sessions 06-09.
