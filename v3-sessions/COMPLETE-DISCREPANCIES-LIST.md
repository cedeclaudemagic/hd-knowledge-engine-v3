# Complete Discrepancies List - All Session Prompts

**Date:** November 17, 2025
**Purpose:** Comprehensive list of ALL discrepancies requiring fixes across sessions 02-10

---

## SESSION-02: Configuration System ✅

**Status:** COMPLETE (all 34 instances fixed and committed)

See commit: "Complete SESSION-02 corrections: All references updated to rave-wheel-41-start"

---

## SESSION-03: TypeScript Definitions ✅

**Status:** COMPLETE (all 3 instances fixed and committed)

See commit: "Fix SESSION-03: Update TypeScript definitions to rave-wheel-41-start"

**File:** `/v3-sessions/SESSION-03-TYPESCRIPT-DEFINITIONS.md`
**Total Issues:** 3 instances (FIXED)

### Line 94: SequenceName type definition
**Current:**
```typescript
export type SequenceName = 'v2-baseline' | 'hd-standard' | 'custom';
```
**Change to:**
```typescript
export type SequenceName = 'rave-wheel-41-start' | 'gates-10-start' | 'custom';
```

### Line 509: Example configuration object
**Current:**
```typescript
  sequenceName: 'iching-traditional', // TypeScript validates this
```
**Change to:**
```typescript
  sequenceName: 'rave-wheel-41-start', // TypeScript validates this (default)
```

### Line 511: Direction in example
**Current:**
```typescript
  direction: 'counter-clockwise'
```
**Change to:**
```typescript
  direction: 'clockwise'
```

### Line 616-618: Example configuration
**Current:**
```typescript
    sequenceName: 'hd-standard',
    rotationOffset: 0,
    direction: 'counter-clockwise'
```
**Change to:**
```typescript
    sequenceName: 'rave-wheel-41-start',
    rotationOffset: 33.75,  // Default rotation makes Gates 10/11 at north
    direction: 'clockwise'
```

---

## SESSION-05: Integration Testing ✅

**Status:** COMPLETE (all 5 instances fixed and committed)

See commit: "Fix SESSION-05: Update integration tests to rave-wheel-41-start"

**File:** `/v3-sessions/SESSION-05-INTEGRATION-TESTING.md`
**Total Issues:** 5 instances (FIXED)

### Line 94-96: Configuration loading test
**Current:**
```javascript
    sequenceName: 'iching-traditional',
    rotationOffset: 0,
    direction: 'counter-clockwise'
```
**Change to:**
```javascript
    sequenceName: 'rave-wheel-41-start',
    rotationOffset: 33.75,  // Default rotation
    direction: 'clockwise'
```

### Line 118: Preset loading test
**Current:**
```javascript
  engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
  engine.setWheelConfiguration('rave-wheel-41-start');
```

### Line 120: Assertion
**Current:**
```javascript
  assert(config.getSequenceName() === 'iching-traditional', 'Preset should load');
```
**Change to:**
```javascript
  assert(config.getSequenceName() === 'rave-wheel-41-start', 'Default preset should load');
  assert(config.getDirection() === 'clockwise', 'Default direction is clockwise');
  assert(config.getRotationOffset() === 33.75, 'Default rotation is 33.75°');
```

### Line 153: Configuration switching test
**Current:**
```javascript
  engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
  engine.setWheelConfiguration('gates-10-start');  // Alternative sequence
```

### Line 417: Performance test configuration
**Current:**
```javascript
  engine.setWheelConfiguration('hd-standard');
```
**Change to:**
```javascript
  engine.setWheelConfiguration('gates-10-start');
```

---

## SESSION-06: Documentation ✅

**Status:** COMPLETE (all 14 instances fixed and committed)

See commit: "Fix SESSION-06: Update documentation to rave-wheel-41-start"

**File:** `/v3-sessions/SESSION-06-DOCUMENTATION.md`
**Total Issues:** 14 instances (FIXED)

### Line 157: Type definition example
**Current:**
```typescript
  sequenceName: 'hd-standard' | 'iching-traditional' | 'custom',
```
**Change to:**
```typescript
  sequenceName: 'rave-wheel-41-start' | 'gates-10-start' | 'custom',
```

### Line 167: Usage example
**Current:**
```javascript
engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
engine.setWheelConfiguration('rave-wheel-41-start');
```

### Line 171-173: Configuration object
**Current:**
```javascript
  sequenceName: 'hd-standard',
  rotationOffset: 0,
  direction: 'counter-clockwise'
```
**Change to:**
```javascript
  sequenceName: 'rave-wheel-41-start',
  rotationOffset: 33.75,  // Default: Gates 10/11 at north
  direction: 'clockwise'
```

### Line 189-190: Output examples
**Current:**
```javascript
console.log(config.getSequenceName());    // 'hd-standard'
console.log(config.getDirection());       // 'counter-clockwise'
```
**Change to:**
```javascript
console.log(config.getSequenceName());    // 'rave-wheel-41-start'
console.log(config.getDirection());       // 'clockwise'
console.log(config.getRotationOffset());  // 33.75
```

### Lines 445-446: Configuration presets documentation
**Current:**
```markdown
- **`hd-standard`** (default): Standard Human Design wheel
- **`iching-traditional`**: Traditional I Ching mandala (Gate 41 at north)
```
**Change to:**
```markdown
- **`rave-wheel-41-start`** (DEFAULT): Rave wheel - Gate 41 at array start, clockwise, 33.75° rotation (Gates 10/11 at north visually)
- **`gates-10-start`**: Alternative - Gates 10/11 at array start, clockwise, 0° rotation
```

### Line 459: Example code
**Current:**
```javascript
engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
engine.setWheelConfiguration('rave-wheel-41-start');
```

### Line 483-485: Configuration example
**Current:**
```javascript
  sequenceName: 'hd-standard',
  rotationOffset: 0,
  direction: 'counter-clockwise'
```
**Change to:**
```javascript
  sequenceName: 'rave-wheel-41-start',
  rotationOffset: 33.75,
  direction: 'clockwise'
```

### Line 497: Switching example
**Current:**
```javascript
engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
engine.setWheelConfiguration('gates-10-start');
```

### Line 507: Custom config example
**Current:**
```javascript
  sequenceName: 'hd-standard',
```
**Change to:**
```javascript
  sequenceName: 'rave-wheel-41-start',
```

### Line 525: Another config example
**Current:**
```javascript
  direction: 'counter-clockwise'
```
**Change to:**
```javascript
  direction: 'clockwise'
```

### Line 544: CRITICAL - Wrong angle expectation
**Current:**
```
Gate 41 at north position (0°).
```
**Change to:**
```
Gates 10/11 at north position (0°) with default 33.75° rotation. Gate 41 at array position 0, but appears at 33.75° visually.
```

### Line 571: Example code
**Current:**
```javascript
engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
engine.setWheelConfiguration('rave-wheel-41-start');
```

### Line 581-583: Config object
**Current:**
```javascript
  sequenceName: 'hd-standard',
  rotationOffset: 0,
  direction: 'counter-clockwise'
```
**Change to:**
```javascript
  sequenceName: 'rave-wheel-41-start',
  rotationOffset: 33.75,
  direction: 'clockwise'
```

### Line 591: Array of configs
**Current:**
```javascript
const configs = ['hd-standard', 'iching-traditional'];
```
**Change to:**
```javascript
const configs = ['rave-wheel-41-start', 'gates-10-start'];
```

---

## SESSION-07: Examples & Demos ✅

**Status:** COMPLETE (all 3 instances fixed and committed)

See commit: "Fix SESSION-07: Update examples to rave-wheel-41-start"

**File:** `/v3-sessions/SESSION-07-EXAMPLES.md`
**Total Issues:** 3 instances (FIXED)

### Line 164: Demo configuration
**Current:**
```javascript
engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
engine.setWheelConfiguration('rave-wheel-41-start');
```

### Line 647: Example A/B comparison
**Current:**
```javascript
        engine.setWheelConfiguration('hd-standard');
```
**Change to:**
```javascript
        engine.setWheelConfiguration('rave-wheel-41-start');
```

### Line 651: Example A/B comparison
**Current:**
```javascript
        engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
        engine.setWheelConfiguration('gates-10-start');
```

---

## SESSION-08: Migration Tools ✅

**Status:** COMPLETE (all 3 instances fixed and committed)

See commit: "Fix SESSION-08: Update migration tools to rave-wheel-41-start"

**File:** `/v3-sessions/SESSION-08-MIGRATION-TOOLS.md`
**Total Issues:** 3 instances (FIXED)

### Line 57: Migration example
**Current:**
```javascript
engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
engine.setWheelConfiguration('rave-wheel-41-start');
```

### Line 249: Data file reference
**Current:**
```javascript
const v2Data = require('./v2-baseline-data.json');
```
**Change to:**
```javascript
const raveWheelData = require('./rave-wheel-41-start-data.json');
```

### Line 313: Migration test
**Current:**
```javascript
engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
engine.setWheelConfiguration('rave-wheel-41-start');
```

---

## SESSION-09: Extended Testing ✅

**Status:** COMPLETE (all 3 instances fixed and committed)

See commit: "Fix SESSION-09: Update extended tests to rave-wheel-41-start"

**File:** `/v3-sessions/SESSION-09-EXTENDED-TESTING.md`
**Total Issues:** 3 instances (FIXED)

### Line 303: Configuration test
**Current:**
```javascript
  engine.setWheelConfiguration('hd-standard');
```
**Change to:**
```javascript
  engine.setWheelConfiguration('rave-wheel-41-start');
```

### Line 305: Configuration test
**Current:**
```javascript
  engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
  engine.setWheelConfiguration('gates-10-start');
```

### Line 684: Edge case test
**Current:**
```javascript
  engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
  engine.setWheelConfiguration('rave-wheel-41-start');
```

---

## SESSION-10: Release Preparation ✅

**Status:** COMPLETE (all 2 instances fixed and committed)

See commit: "Fix SESSION-10: Update release docs to rave-wheel-41-start"

**File:** `/v3-sessions/SESSION-10-RELEASE-PREPARATION.md`
**Total Issues:** 2 instances (FIXED)

### Line 466: Example code
**Current:**
```javascript
engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
engine.setWheelConfiguration('rave-wheel-41-start');
```

### Line 599: Documentation example
**Current:**
```javascript
engine.setWheelConfiguration('iching-traditional');
```
**Change to:**
```javascript
engine.setWheelConfiguration('rave-wheel-41-start');
```

---

## SUMMARY BY SESSION

| Session | File | Total Issues | Priority |
|---------|------|--------------|----------|
| SESSION-02 | Configuration System | ✅ COMPLETE | 🔴 CRITICAL |
| SESSION-03 | TypeScript Definitions | ✅ COMPLETE | 🔴 CRITICAL |
| SESSION-05 | Integration Testing | ✅ COMPLETE | 🟡 HIGH |
| SESSION-06 | Documentation | ✅ COMPLETE | 🟡 HIGH |
| SESSION-07 | Examples & Demos | ✅ COMPLETE | 🟢 MEDIUM |
| SESSION-08 | Migration Tools | ✅ COMPLETE | 🟢 MEDIUM |
| SESSION-09 | Extended Testing | ✅ COMPLETE | 🟢 MEDIUM |
| SESSION-10 | Release Preparation | ✅ COMPLETE | ⚪ LOW |

**Total remaining:** 0 instances - ALL COMPLETE! ✅

---

## KEY PRINCIPLES TO ENFORCE

### 1. Sequence Names
- ❌ OLD: `v2-baseline`, `hd-standard`, `iching-traditional`
- ✅ NEW: `rave-wheel-41-start` (default), `gates-10-start` (alternative)

### 2. Direction
- ❌ OLD: Default `counter-clockwise`
- ✅ NEW: Default `clockwise` (actual rave wheel movement)

### 3. Rotation Offset
- ❌ OLD: Missing or 0° as default
- ✅ NEW: 33.75° as default (makes Gates 10/11 at north)

### 4. Visual vs Array Position (DECOUPLED)
- ❌ OLD: "Gate 41 at 0°" or "Gate 41 at north"
- ✅ NEW: "Gate 41 at array position 0, but 33.75° visually. Gates 10/11 at north (0°) via rotation"

### 5. Three Mandatory Fields
Every sequence file and config MUST have:
1. `sequence` - Array of 64 gates
2. `direction` - "clockwise" or "counter-clockwise"
3. `rotationOffset` - Degrees (0-360)

---

## COMPLETION CHECKLIST

- [x] SESSION-02: ✅ Complete (34 instances fixed)
- [x] SESSION-03: ✅ Complete (3 instances fixed)
- [x] SESSION-05: ✅ Complete (5 instances fixed)
- [x] SESSION-06: ✅ Complete (14 instances fixed - including critical angle fix)
- [x] SESSION-07: ✅ Complete (3 instances fixed)
- [x] SESSION-08: ✅ Complete (3 instances fixed)
- [x] SESSION-09: ✅ Complete (3 instances fixed)
- [x] SESSION-10: ✅ Complete (2 instances fixed)

**Status:** 🎉 ALL SESSIONS COMPLETE! 🎉

**Total instances fixed:** 67 across all 8 session prompts

---

## SEARCH COMMANDS FOR VERIFICATION

After fixes, verify with these searches:

```bash
# Should find NO results after fixes:
grep -rn "v2-baseline\|hd-standard\|iching-traditional" v3-sessions/SESSION-*.md

# Should only find type definition, not as default:
grep -rn "counter-clockwise" v3-sessions/SESSION-*.md

# Should find NO results (Gate 41 NOT at 0°):
grep -rn "Gate 41.*0°\|Gate 41 at 0" v3-sessions/SESSION-*.md

# Should find in every config example:
grep -rn "rotationOffset.*33.75" v3-sessions/SESSION-*.md
```

---

**Status:** Ready for systematic fixes across remaining sessions
**Estimated Time:** 2-3 hours for all remaining fixes
**Critical Path:** Fix SESSION-03 before implementing Session 03
