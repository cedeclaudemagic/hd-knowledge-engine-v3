# CRITICAL ORIENTATION: Common Errors to Avoid

**READ THIS FIRST before working on any I Ching / trigram / electromagnetic content.**

This document exists because Claude instances repeatedly make the same errors when working with this material. These are not complex concepts — they just require careful orientation.

---

## ERROR 1: Line Reading Direction

**CORRECT:** Binary strings are stored BOTTOM to TOP.

For binary string "011001" (Gate 18):
- Index 0 = Line 1 (BOTTOM) = 0 = yin
- Index 1 = Line 2 = 1 = yang
- Index 2 = Line 3 = 1 = yang
- Index 3 = Line 4 = 0 = yin
- Index 4 = Line 5 = 0 = yin
- Index 5 = Line 6 (TOP) = 1 = yang

**WRONG:** Reading the string left-to-right as top-to-bottom.

---

## ERROR 2: Trigram Line Positions

Each trigram has three lines. Here is the CORRECT structure:

| Trigram | Binary | Line 1 (bottom) | Line 2 (middle) | Line 3 (top) |
|---------|--------|-----------------|-----------------|--------------|
| Earth ☷ | 000 | yin | yin | yin |
| Mountain ☶ | 001 | yin | yin | **yang** |
| Water ☵ | 010 | yin | **yang** | yin |
| Wind ☴ | 011 | yin | **yang** | **yang** |
| Thunder ☳ | 100 | **yang** | yin | yin |
| Fire ☲ | 101 | **yang** | yin | **yang** |
| Lake ☱ | 110 | **yang** | **yang** | yin |
| Heaven ☰ | 111 | yang | yang | yang |

**Key examples to remember:**
- **Mountain (001):** Yang at TOP, capping stillness below. NOT yang at bottom.
- **Lake (110):** Yin opening at TOP. Yang foundation below. NOT yin at bottom.
- **Wind (011):** Yang in Lines 2 and 3. Yin only at Line 1 (bottom).

---

## ERROR 3: Seed and Manifestation

**CORRECT:**
- **SEED = Heaven (111)** — Maximum charge, fully loaded, accumulated potential that MUST express. The seed contains everything before it discharges.
- **MANIFESTATION = Earth (000)** — Stable form, where structure crystallises and HOLDS. The ground that receives and persists.

**WRONG:** Thinking Earth is the seed (potential) and Heaven is manifestation (achievement).

**The insight:** Heaven is UNSTABLE — it cannot persist, it must discharge. Earth is STABLE — form actually holds there. The seed is not empty potential; it's concentrated actuality under pressure.

---

## ERROR 4: The Cycle Direction

**ACCUMULATION (toward seed):**
```
Earth (000) → Mountain (001) → Water (010) → Wind (011) → Heaven (111)
```

**EXPRESSION (toward manifestation):**
```
Heaven (111) → Lake (110) → Fire (101) → Thunder (100) → Earth (000)
```

Heaven is the PEAK of accumulation (the seed).
Earth is the RESULT of expression (the manifestation).

---

## ERROR 5: Nested Frequency Pattern

**CORRECT:**
- Line 1 (BOTTOM) changes 2 times around the wheel — MOST STABLE
- Line 6 (TOP) changes 62 times around the wheel — MOST VOLATILE

**WRONG:** Thinking top lines are stable and bottom lines are volatile.

The foundation (bottom) holds. The expression (top) flickers.

---

## Verification Commands

If in doubt, verify against the source data:

```javascript
// Gate 18 should be: L1=yin, L2=yang, L3=yang, L4=yin, L5=yin, L6=yang
const gate18 = "011001";
console.log(`Line 1 (bottom): ${gate18[0]}`); // Should be 0
console.log(`Line 2: ${gate18[1]}`);           // Should be 1
console.log(`Line 3: ${gate18[2]}`);           // Should be 1
console.log(`Line 6 (top): ${gate18[5]}`);     // Should be 1
```

---

## Source Files

All binary data is in:
- `/Volumes/CLAUDE/HD-Knowledge-Engine-V3/core/root-system/binary-identity.json`
- `/Volumes/CLAUDE/HD-Knowledge-Engine-V3/core/root-system/gate-sequence.json`

Framework document:
- `/Volumes/CLAUDE/HD-Knowledge-Engine-V3/docs/electromagnetic-iching-complete-framework.md`

---

## Before Writing Any Content

1. Read this document
2. Read the framework document
3. Verify any trigram descriptions against the table above
4. Remember: SEED = Heaven, MANIFESTATION = Earth
5. Remember: Bottom lines STABLE, top lines VOLATILE

---

*Created: 27 November 2025*
*Purpose: Prevent repeated orientation errors in I Ching electromagnetic work*
