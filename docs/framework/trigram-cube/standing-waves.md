# Standing Waves: The 8 Doubled Trigrams

## Geometric Derivation

**Source:** Book 2, Article 5 — Standing Waves as Structural Anchors
**Status:** PROVEN — mathematically derivable

---

## Core Finding

A **standing wave** is a hexagram where the upper and lower trigrams are identical. There are exactly 8 standing waves — one for each trigram.

---

## What Is a Standing Wave?

In physics, a standing wave occurs when a wave reflects back on itself, creating fixed points (nodes) where there is no movement. The pattern doesn't travel — it stands in place.

In the I Ching, a standing wave hexagram has the same trigram above and below:

```
Gate 1: Heaven over Heaven    ☰    111
        Heaven over Heaven    ☰    111

Gate 30: Fire over Fire       ☲    101
         Fire over Fire       ☲    101

Gate 51: Thunder over Thunder ☳    100
         Thunder over Thunder ☳    100
```

The hexagram "reflects" its lower half in its upper half. It doesn't "go" anywhere — it holds position.

---

## The Complete List

| Trigram | Symbol | Binary | Doubled Pattern | Gate |
|---------|--------|--------|-----------------|------|
| Heaven | ☰ | 111 | 111111 | Gate 1 |
| Earth | ☷ | 000 | 000000 | Gate 2 |
| Water | ☵ | 010 | 010010 | Gate 29 |
| Fire | ☲ | 101 | 101101 | Gate 30 |
| Thunder | ☳ | 100 | 100100 | Gate 51 |
| Mountain | ☶ | 001 | 001001 | Gate 52 |
| Wind | ☴ | 011 | 011011 | Gate 57 |
| Lake | ☱ | 110 | 110110 | Gate 58 |

**The number 8 is not arbitrary — it's the number of trigrams.** Standing waves are the "diagonal" of the 8×8 hexagram matrix.

---

## The Two Tiers

Standing waves split into two groups based on phase-invariance:

### Absolute Anchors (100% Phase Preservation)

| Gate | Trigram | Pattern | Property |
|------|---------|---------|----------|
| 1 | Heaven | 111111 | Palindrome |
| 2 | Earth | 000000 | Palindrome |
| 29 | Water | 010010 | Palindrome |
| 30 | Fire | 101101 | Palindrome |

### Secondary Anchors (67-83% Phase Preservation)

| Gate | Trigram | Pattern | Property |
|------|---------|---------|----------|
| 51 | Thunder | 100100 | Not palindrome |
| 52 | Mountain | 001001 | Not palindrome |
| 57 | Wind | 011011 | Not palindrome |
| 58 | Lake | 110110 | Not palindrome |

---

## Why the Split? Palindrome Structure

A 3-bit pattern is palindromic if the first bit equals the third bit:

```
Palindrome test: Does bit 1 = bit 3?

111: 1 = 1 ✓ Palindrome (Heaven)
000: 0 = 0 ✓ Palindrome (Earth)
010: 0 = 0 ✓ Palindrome (Water)
101: 1 = 1 ✓ Palindrome (Fire)

100: 1 ≠ 0 ✗ Not palindrome (Thunder)
001: 0 ≠ 1 ✗ Not palindrome (Mountain)
011: 0 ≠ 1 ✗ Not palindrome (Wind)
110: 1 ≠ 0 ✗ Not palindrome (Lake)
```

Exactly half the trigrams are palindromic. When a palindromic trigram is doubled, the resulting hexagram is also palindromic — and therefore phase-invariant.

---

## Geometric Arrangement

The eight trigrams form the cube vertices. The palindromic trigrams form a cross through the centre:

```
                    HEAVEN (111)
                         ●
                        /|\
                       / | \
                      /  |  \
            LAKE    /   |   \    WIND
            (110)  ●    |    ●   (011)
                   |    |    |
           FIRE ───●────┼────●─── WATER
           (101)        |        (010)
                   |    |    |
          THUNDER  ●    |    ●   MOUNTAIN
            (100)   \   |   /    (001)
                     \  |  /
                      \ | /
                       \|/
                        ●
                    EARTH (000)
```

- **Palindromic (cardinal):** Heaven-Earth (vertical), Fire-Water (horizontal)
- **Non-palindromic (intercardinal):** Thunder, Mountain, Wind, Lake at corners

---

## Standing Waves and Binary Period

| Period | Meaning | Gates | Standing Wave? |
|--------|---------|-------|----------------|
| 1 | Single bit repeated | 1, 2 | ✓ Yes |
| 2 | Two-bit unit repeated | 63, 64 | ✗ No (cross-zero) |
| 3 | Three-bit unit repeated | 29, 30, 51, 52, 57, 58 | ✓ Yes |
| 6 | No repetition | All others | ✗ No |

**Standing Waves = Period 1 + Period 3** = Hexagrams where the trigram repeats.

---

## Complementary Pairs

Every standing wave's complement is also a standing wave:

| Gate | Pattern | Complement | Complement Gate |
|------|---------|------------|-----------------|
| 1 | 111111 | 000000 | Gate 2 |
| 29 | 010010 | 101101 | Gate 30 |
| 51 | 100100 | 011011 | Gate 57 |
| 52 | 001001 | 110110 | Gate 58 |

The 8 standing waves form 4 complementary pairs:
- Heaven ↔ Earth (1 ↔ 2)
- Water ↔ Fire (29 ↔ 30)
- Thunder ↔ Wind (51 ↔ 57)
- Mountain ↔ Lake (52 ↔ 58)

These are the traditional "opposite trigram" pairs — and they emerge from binary complementation.

---

## Electromagnetic Positions

| Gate | Trigram | EM Position | Role |
|------|---------|-------------|------|
| 1 | Heaven | -4 | Source (pure yang emission) |
| 2 | Earth | +4 | Sink (pure yin reception) |
| 30 | Fire | -2 | Voltage (yang-dominant flow) |
| 29 | Water | +2 | Current (yin-dominant flow) |
| 57 | Wind | -1 | Gate-out (yang-slight) |
| 51 | Thunder | +1 | Gate-in (yin-slight) |
| 58 | Lake | -3 | Capacitance (yang storage) |
| 52 | Mountain | +3 | Inductance (yin storage) |

**Phase-invariance correlates with EM position magnitude:**
- Positions ±4 and ±2 (absolute anchors): 100% phase preservation
- Positions ±1 and ±3 (secondary anchors): 67-83% phase preservation

---

## Why Standing Waves Matter

### 1. Structural Anchors

The 8 standing waves divide the 64-gate wheel into 8 segments, creating regular scaffolding.

### 2. Phase Resistance

Even secondary anchors persist as standing waves in 67-83% of phase shifts. No other gates have this stability.

### 3. Trigram Coverage

Each standing wave "claims" one trigram. Together, all 8 trigrams are represented as structural anchors.

### 4. Movement Baseline

Cross-zero and same-phase gates show movement FROM and TO trigram positions. Standing waves show NO movement — the reference against which movement is measured.

---

## Summary Table

| Property | Absolute Anchors | Secondary Anchors |
|----------|------------------|-------------------|
| Gates | 1, 2, 29, 30 | 51, 52, 57, 58 |
| Trigrams | Heaven, Earth, Water, Fire | Thunder, Mountain, Wind, Lake |
| Palindromic | Yes | No |
| Phase preservation | 100% | 67-83% |
| Period | 1 or 3 | 3 |
| EM positions | ±4, ±2 | ±1, ±3 |
| Traditional status | "Cardinal" trigrams | "Intercardinal" trigrams |

---

## Derivability Status

| Element | Status |
|---------|--------|
| 8 standing waves exist | ✓ PROVEN |
| Standing wave = doubled trigram | ✓ PROVEN |
| 4 absolute + 4 secondary | ✓ PROVEN |
| Split by palindrome structure | ✓ PROVEN |
| Complementary pairs | ✓ PROVEN |
| EM position correlation | ✓ MAPPED |

---

*Extracted from: Book 2, Article 5 — Standing Waves as Structural Anchors*
*Framework location: docs/framework/trigram-cube/standing-waves.md*
