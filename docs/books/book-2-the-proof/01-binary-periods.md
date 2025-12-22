# Binary Periods: The Four Fundamental Patterns

## Article 1 of "The Proof: Mathematical Foundations of the Electromagnetic I Ching"

---

## Introduction

The I Ching's 64 hexagrams have been organised in many ways across the centuries—the King Wen sequence used for divination, the Fu Xi sequence arranged by binary value, and various family groupings based on trigram relationships.

One such organisation is the nuclear hierarchy, which identifies four hexagrams as "Pillars"—foundational gates from which all others derive through nuclear transformation. These four are Gates 1, 2, 63, and 64.

But why *these* four gates? Why not Gates 5, 17, 42, and 58? Is their special status an arbitrary choice, a mystical revelation, or does it emerge from something deeper?

This article proves that the four Pillars are mathematically necessary. They are the only four hexagrams with a specific structural property—and we can demonstrate this with nothing but binary arithmetic.

---

## The 64 Hexagrams as Binary Numbers

Every hexagram is built from six lines, each either yin (broken) or yang (solid). If we let yang = 1 and yin = 0, each hexagram becomes a six-digit binary number:

```
Gate 1 (The Creative):   ▅▅▅▅▅  ▅▅▅▅▅  ▅▅▅▅▅  ▅▅▅▅▅  ▅▅▅▅▅  ▅▅▅▅▅   →  111111
Gate 2 (The Receptive):  ▅▅ ▅▅  ▅▅ ▅▅  ▅▅ ▅▅  ▅▅ ▅▅  ▅▅ ▅▅  ▅▅ ▅▅   →  000000
Gate 29 (The Abysmal):   ▅▅ ▅▅  ▅▅▅▅▅  ▅▅ ▅▅  ▅▅ ▅▅  ▅▅▅▅▅  ▅▅ ▅▅   →  010010
Gate 30 (The Clinging):  ▅▅▅▅▅  ▅▅ ▅▅  ▅▅▅▅▅  ▅▅▅▅▅  ▅▅ ▅▅  ▅▅▅▅▅   →  101101
```

This isn't interpretation—it's notation. Every hexagram has exactly one binary representation, and there are exactly 64 possible six-bit patterns (2⁶ = 64). The I Ching contains all of them.

---

## What Is a Period?

Look at these patterns and ask: what's the shortest segment that, if repeated, recreates the whole pattern?

**Pattern: 111111**

What repeats? Just "1". If you repeat "1" six times, you get 111111.

*The period is 1.*

**Pattern: 000000**

What repeats? Just "0". Repeat it six times.

*The period is 1.*

**Pattern: 101010**

What repeats? The segment "10". Repeat "10" three times: 10-10-10 = 101010.

*The period is 2.*

**Pattern: 010101**

What repeats? The segment "01". Repeat it three times: 01-01-01 = 010101.

*The period is 2.*

**Pattern: 110110**

What repeats? The segment "110". Repeat it twice: 110-110 = 110110.

*The period is 3.*

**Pattern: 101100**

Can you find a repeating segment? No. The entire pattern "101100" must be stated whole. Nothing shorter recreates it.

*The period is 6.*

---

## The Four Period Types

Every six-bit pattern has a period of 1, 2, 3, or 6. These are the only divisors of 6.

| Period | Meaning | Examples |
|--------|---------|----------|
| 1 | A single bit, repeated six times | 111111, 000000 |
| 2 | A two-bit unit, repeated three times | 101010, 010101, 110011, 001100 |
| 3 | A three-bit unit, repeated twice | 110110, 100100, 011011, 001001, etc. |
| 6 | No repetition; the full six bits are the unit | Most patterns (54 of 64) |

Period is a measure of *regularity*. Low period means high regularity—the pattern is simple, predictable, compressible. High period means complexity.

---

## Counting the Patterns by Period

Let's count how many hexagrams exist at each period:

**Period 1:** 
Only two possibilities—all yang (111111) or all yin (000000).
*Count: 2 gates*

**Period 2:**
Two-bit units that divide evenly into six bits. The units are: 01, 10, 00, 11.
But 00 repeated gives 000000 (period 1), and 11 repeated gives 111111 (period 1).
Only 01 and 10 produce genuinely period-2 patterns: 010101 and 101010.
*Count: 2 gates*

**Period 3:**
Three-bit units repeated twice. There are 8 three-bit units (000 through 111).
But 000 and 111 produce period-1 patterns.
The remaining 6 units produce period-3 patterns: 100100, 010010, 001001, 110110, 101101, 011011.
*Count: 6 gates*

**Period 6:**
Everything else—patterns with no internal repetition.
*Count: 64 - 2 - 2 - 6 = 54 gates*

---

## The Hierarchy of Regularity

Now we have a natural hierarchy:

```
MOST REGULAR
     │
     ▼
Period 1: 2 gates (111111, 000000)
     │        └── Maximum regularity: one bit tells you everything
     ▼
Period 2: 2 gates (101010, 010101)
     │        └── High regularity: two bits tell you everything
     ▼
Period 3: 6 gates (110110, 100100, 011011, 001001, 010010, 101101)
     │        └── Moderate regularity: three bits tell you everything
     ▼
Period 6: 54 gates (all others)
             └── Low regularity: all six bits required
     │
     ▼
LEAST REGULAR
```

---

## The Discovery

Here is where it gets interesting. Let's identify which gates occupy each period level:

**Period 1 (2 gates):**
- 111111 = Gate 1 (The Creative) — **PILLAR**
- 000000 = Gate 2 (The Receptive) — **PILLAR**

**Period 2 (2 gates):**
- 101010 = Gate 63 (After Completion) — **PILLAR**
- 010101 = Gate 64 (Before Completion) — **PILLAR**

**Period 3 (6 gates):**
- 110110 = Gate 58 (The Joyous) — Standing Wave
- 100100 = Gate 51 (The Arousing) — Standing Wave
- 011011 = Gate 57 (The Gentle) — Standing Wave
- 001001 = Gate 52 (Keeping Still) — Standing Wave
- 010010 = Gate 29 (The Abysmal) — Standing Wave
- 101101 = Gate 30 (The Clinging) — Standing Wave

**Period 6 (54 gates):**
- All remaining gates

---

## The Revelation

The four Pillars of the nuclear hierarchy consist of exactly the Period-1 and Period-2 patterns.

This is not coincidence. This is mathematical necessity.

**The Pillars are the four most regular binary patterns possible in six bits.**

| Gate | Binary | Period | Pillar Name |
|------|--------|--------|-------------|
| 1 | 111111 | 1 | Fire |
| 2 | 000000 | 1 | Water |
| 63 | 101010 | 2 | Truth |
| 64 | 010101 | 2 | Light |

And look at Period 3—all six gates are standing waves (same upper and lower trigram). This also is not coincidence. A period-3 pattern repeats its three-bit unit twice, and a trigram IS a three-bit unit. Period-3 means the trigram repeats, which means the hexagram is a standing wave.

**Standing Waves = Period-1 + Period-3 patterns.**
**Pillars = Period-1 + Period-2 patterns.**

---

## Why This Matters

We didn't decide that Gates 1, 2, 63, 64 should be special. We discovered that they ARE special, by a property (binary period) that requires no appeal to tradition or authority.

This validates the nuclear hierarchy from first principles. Whatever method was used to identify the Pillars—contemplative insight, traditional transmission, or independent discovery—the result aligns with mathematical structure that exists independently of human interpretation.

The Pillars aren't special because someone said so. They're special because they're the only patterns where knowing one or two bits tells you everything. They are the I Ching's fixed points of regularity.

---

## A Deeper Pattern

Notice something else:

**Period-1 patterns are standing waves:**
- 111111: upper trigram = 111, lower trigram = 111 (same)
- 000000: upper trigram = 000, lower trigram = 000 (same)

**Period-2 patterns are cross-zero gates:**
- 101010: upper trigram = 101 (Fire), lower trigram = 010 (Water) (opposite)
- 010101: upper trigram = 010 (Water), lower trigram = 101 (Fire) (opposite)

This is also mathematically necessary. A period-2 pattern (ABABAB) splits into:
- Lines 1-3: ABA
- Lines 4-6: BAB

Since A ≠ B (otherwise period would be 1), we have ABA ≠ BAB. Different trigrams means cross-zero movement.

**Period-2 patterns MUST be cross-zero. Period-1 patterns MUST be standing waves.**

The electromagnetic classification emerges from binary structure.

---

## Summary

| Period | Count | Gates | Structural Role |
|--------|-------|-------|-----------------|
| 1 | 2 | 1, 2 | Pillars (static archetypes) |
| 2 | 2 | 63, 64 | Pillars (dynamic archetypes) |
| 3 | 6 | 29, 30, 51, 52, 57, 58 | Standing waves (structural anchors) |
| 6 | 54 | All others | The field of transformation |

The Pillars are the union of Period-1 and Period-2.
The Standing Waves are the union of Period-1 and Period-3.

These aren't definitions we invented. They're facts we discovered.

---

## What's Next

We've shown that the Pillars are mathematically distinguished by having the lowest periods. But there's another property that separates the absolute anchors (Gates 1, 2, 29, 30) from the secondary anchors (Gates 51, 52, 57, 58): **palindrome structure**.

In Article 2, we'll explore why palindromic patterns are phase-invariant—they remain "standing waves" regardless of how you group the wheel's 384 lines. This explains why some standing waves are more structurally stable than others.

---

## Key Takeaways

1. Every hexagram is a six-bit binary pattern
2. Period measures how much the pattern repeats internally
3. The four possible periods (1, 2, 3, 6) create a natural hierarchy
4. The Pillars = the four gates with period 1 or 2
5. Standing waves = gates with period 1, 2, or 3
6. Period-1 must be standing waves; Period-2 must be cross-zero
7. The structure emerges from mathematical necessity

---

## For Reflection

The I Ching has been studied for thousands of years. The binary nature of yin and yang has been recognised at least since Shao Yong's arrangements in the 11th century, and Leibniz famously corresponded about the I Ching's relationship to binary arithmetic in the 17th century.

Whether the period property has been explicitly articulated before or not, what matters is this: the special status of the four Pillars is not arbitrary. It is grounded in the mathematics of six-bit patterns themselves.

The structure was always there, waiting to be seen.

---

*Next: Article 2 — The Palindrome Principle: Symmetry and Stability*
