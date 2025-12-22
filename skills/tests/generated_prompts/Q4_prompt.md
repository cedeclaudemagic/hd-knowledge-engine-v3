# Skills Available


## hd-mathematics


### SKILL.md

---
name: hd-mathematics
description: Mathematical foundation for I Ching and Human Design electromagnetic framework. Derives trigram positions, gate types, and structural relationships from binary first principles. Use when asked about: (1) Why trigrams have specific positions (-4 to +4), (2) How to calculate gate types from binary patterns, (3) Binary mathematics underlying the I Ching wheel, (4) Complement pairs and spread calculations, (5) Amplitude and axis derivations, (6) Any "why does X have position Y" questions about the electromagnetic framework.
---

# HD Mathematics — Binary Foundation Skill

This skill provides the mathematical derivations underlying the electromagnetic I Ching framework. Everything here is **provable from first principles** — no appeals to tradition or authority.

## Core Principle

The I Ching's structure is not arbitrary. It emerges from the mathematics of 6-bit binary patterns arranged in a self-complementary ring.

## The Eight Positions

Trigrams occupy positions -4 to +4 on an electromagnetic wave. These positions are **fully derivable**:

| Position | Trigram | Binary | Domain |
|----------|---------|--------|--------|
| -4 | Heaven | 111 | Void (Source) |
| -3 | Lake | 110 | Void (Capacitance) |
| -2 | Fire | 101 | Void (Voltage) |
| -1 | Wind | 011 | Void (Gate-OUT) |
| +1 | Thunder | 100 | Form (Gate-IN) |
| +2 | Water | 010 | Form (Current) |
| +3 | Mountain | 001 | Form (Inductance) |
| +4 | Earth | 000 | Form (Sink) |

### Derivation Algorithm

Position is calculated from three properties:

**Step 1: Form Complement Pairs**
Trigrams whose binary patterns XOR to 111 are complements:
- Heaven (111) ↔ Earth (000)
- Lake (110) ↔ Mountain (001)
- Fire (101) ↔ Water (010)
- Wind (011) ↔ Thunder (100)

**Step 2: Calculate Spread**
Spread = |decimal_value - complement_decimal_value|
- Heaven/Earth: |7-0| = 7 → Magnitude 4
- Lake/Mountain: |6-1| = 5 → Magnitude 3
- Fire/Water: |5-2| = 3 → Magnitude 2
- Wind/Thunder: |4-3| = 1 → Magnitude 1

**Formula:** Magnitude = (spread + 1) / 2

**Step 3: Assign Sign by Yang Count**
Within each pair, more yang bits → negative position:
- Heaven (3 yang) → -4, Earth (0 yang) → +4
- Lake (2 yang) → -3, Mountain (1 yang) → +3
- Fire (2 yang) → -2, Water (1 yang) → +2
- Wind (2 yang) → -1, Thunder (1 yang) → +1

## Gate Classification

Every hexagram (gate) is classified by its inner and outer trigram positions:

### By Domain Crossing

| Type | Inner | Outer | Count | Character |
|------|-------|-------|-------|-----------|
| Standing Wave | Same | Same | 8 | Holds position |
| Cross-Zero Manifesting | Negative | Positive | 16 | Void → Form |
| Cross-Zero Dematerialising | Positive | Negative | 16 | Form → Void |
| Same-Phase Material | Positive | Positive | 12 | Within Form |
| Same-Phase Void | Negative | Negative | 12 | Within Void |

### Amplitude Calculation

**Amplitude = |Outer_Position - Inner_Position|**

| Amplitude | Meaning | Example |
|-----------|---------|---------|
| 0 | Standing wave | Gate 1 (-4 → -4) |
| 2 | Minimum crossing | Gate 32 (-1 → +1) |
| 4 | Flow axis | Gate 63 (-2 → +2) |
| 6 | Mixed | Gate 5 (-4 → +2) |
| 8 | Maximum | Gate 11 (-4 → +4) |

## Binary Identity

Each gate has a 6-bit binary pattern read bottom-to-top:
- Bits 0-2 (positions 1-3): Lower/Inner trigram
- Bits 3-5 (positions 4-6): Upper/Outer trigram

**Example — Gate 11 (Peace):**
- Binary: 111000 (Heaven below, Earth above)
- Inner trigram: 111 = Heaven = -4
- Outer trigram: 000 = Earth = +4
- Vector: -4 → +4 (Cross-zero manifesting, amplitude 8)

## The Four Axes

Complement pairs define four axes through the wave:

| Axis | Positions | Character |
|------|-----------|-----------|
| Poles | ±4 | Maximum amplitude, Source ↔ Sink |
| Storage | ±3 | Accumulation, Capacitance ↔ Inductance |
| Flow | ±2 | Movement, Voltage ↔ Current |
| Gates | ±1 | Threshold, Gate-OUT ↔ Gate-IN |

## Scripts

For calculations, use:
- `scripts/calculate_position.py` — Derive position from binary
- `scripts/classify_gate.py` — Full gate classification
- `scripts/amplitude.py` — Calculate amplitude and axis

## References

For detailed derivations, see:
- `references/position-derivation.md` — Complete mathematical proof
- `references/binary-tables.md` — All 64 gates with binary analysis
- `references/period-palindrome.md` — Phase invariance and standing waves

## Usage Pattern

When asked "Why is [trigram] at position [N]?" or "How do you derive [gate]'s classification?":

1. Identify the binary pattern
2. Apply the derivation algorithm
3. Show the calculation
4. Connect to meaning (position determines character)

The mathematics generates the meaning. Structure is not imposed — it is discovered.


### references/position-derivation.md

# Position Derivation — Complete Mathematical Proof

## The Claim

The eight trigram positions (-4 to +4) are **fully derivable** from binary mathematics alone. No empirical input required.

## The Foundation

### Binary Representation

Each trigram is a 3-bit pattern:

| Trigram | Lines (bottom→top) | Binary | Decimal |
|---------|-------------------|--------|---------|
| Heaven | ━━━ ━━━ ━━━ | 111 | 7 |
| Lake | ━ ━ ━━━ ━━━ | 110 | 6 |
| Fire | ━━━ ━ ━ ━━━ | 101 | 5 |
| Thunder | ━━━ ━ ━ ━ ━ | 100 | 4 |
| Wind | ━ ━ ━━━ ━━━ | 011 | 3 |
| Water | ━ ━ ━━━ ━ ━ | 010 | 2 |
| Mountain | ━ ━ ━ ━ ━━━ | 001 | 1 |
| Earth | ━ ━ ━ ━ ━ ━ | 000 | 0 |

Solid line = 1 (yang), Broken line = 0 (yin)

### The XOR Complement

Two patterns are complements when their XOR equals 111 (all bits flipped):

```
111 XOR 000 = 111  →  Heaven/Earth are complements
110 XOR 001 = 111  →  Lake/Mountain are complements
101 XOR 010 = 111  →  Fire/Water are complements
100 XOR 011 = 111  →  Thunder/Wind are complements
```

**Principle:** Complements occupy opposite positions (±n).

## The Derivation

### Step 1: Identify Complement Pairs

From XOR analysis, we have four pairs:
- Pair A: Heaven (7) / Earth (0)
- Pair B: Lake (6) / Mountain (1)
- Pair C: Fire (5) / Water (2)
- Pair D: Thunder (4) / Wind (3)

### Step 2: Calculate Spread

Spread = absolute difference between decimal values:

| Pair | Decimal Values | Spread |
|------|----------------|--------|
| Heaven/Earth | 7, 0 | 7 |
| Lake/Mountain | 6, 1 | 5 |
| Fire/Water | 5, 2 | 3 |
| Thunder/Wind | 4, 3 | 1 |

### Step 3: Map Spread to Magnitude

The spreads are 7, 5, 3, 1 — four odd numbers mapping to magnitudes 4, 3, 2, 1.

**Formula:** Magnitude = (Spread + 1) / 2

| Spread | Calculation | Magnitude |
|--------|-------------|-----------|
| 7 | (7+1)/2 = 4 | 4 |
| 5 | (5+1)/2 = 3 | 3 |
| 3 | (3+1)/2 = 2 | 2 |
| 1 | (1+1)/2 = 1 | 1 |

Now we know:
- Heaven/Earth occupy ±4
- Lake/Mountain occupy ±3
- Fire/Water occupy ±2
- Thunder/Wind occupy ±1

### Step 4: Assign Sign by Yang Count

Within each pair, which trigram gets the negative position?

**Principle:** More yang (more 1s) → negative position

| Pair | Yang Counts | Assignment |
|------|-------------|------------|
| Heaven (3) / Earth (0) | 3 > 0 | Heaven → -4, Earth → +4 |
| Lake (2) / Mountain (1) | 2 > 1 | Lake → -3, Mountain → +3 |
| Fire (2) / Water (1) | 2 > 1 | Fire → -2, Water → +2 |
| Wind (2) / Thunder (1) | 2 > 1 | Wind → -1, Thunder → +1 |

**Note:** Wind (011) has 2 yang bits, Thunder (100) has 1. This resolves earlier confusion.

## The Complete Formula

```
position(trigram) = sign × magnitude

where:
  complement = XOR(trigram, 111)
  spread = |decimal(trigram) - decimal(complement)|
  magnitude = (spread + 1) / 2
  sign = -1 if yang_count(trigram) > yang_count(complement) else +1
```

## Verification

| Trigram | Binary | Decimal | Complement | Spread | Magnitude | Yang | Sign | Position |
|---------|--------|---------|------------|--------|-----------|------|------|----------|
| Heaven | 111 | 7 | Earth (0) | 7 | 4 | 3 | - | **-4** |
| Earth | 000 | 0 | Heaven (7) | 7 | 4 | 0 | + | **+4** |
| Lake | 110 | 6 | Mountain (1) | 5 | 3 | 2 | - | **-3** |
| Mountain | 001 | 1 | Lake (6) | 5 | 3 | 1 | + | **+3** |
| Fire | 101 | 5 | Water (2) | 3 | 2 | 2 | - | **-2** |
| Water | 010 | 2 | Fire (5) | 3 | 2 | 1 | + | **+2** |
| Wind | 011 | 3 | Thunder (4) | 1 | 1 | 2 | - | **-1** |
| Thunder | 100 | 4 | Wind (3) | 1 | 1 | 1 | + | **+1** |

**All positions derived. No exceptions. No special cases.**

## Why This Matters

The positions are not assigned by tradition or intuition. They **emerge** from binary mathematics.

This means:
1. The I Ching's architecture is mathematically necessary
2. The electromagnetic framework describes real structure
3. Two independent derivations (EM reasoning, binary analysis) converge
4. The ancient sages encoded discoverable mathematics

## Correlation with Properties

The derived positions correlate with other properties:

| Property | Pattern |
|----------|---------|
| Palindrome | ±4 and ±2 are palindromic (phase-invariant) |
| Phase stability | Fire/Water uniquely constant across all phases |
| Standing wave privilege | Palindromic trigrams → absolute anchors |

These correlations **follow from** the positions but don't **determine** them. The derivation above is complete and self-contained.

## The Circuit Model

The positions form a natural circuit:

```
        SOURCE                           SINK
         -4                               +4
          │                               │
    ┌─────┴─────┐                   ┌─────┴─────┐
    │           │                   │           │
   -3          -2                  +2          +3
Capacitance  Voltage            Current   Inductance
    │           │                   │           │
    └─────┬─────┘                   └─────┬─────┘
          │                               │
         -1 ─────────────────────────────+1
       Gate-out                       Gate-in
```

This circuit model is **validated** by the derivation, not **assumed** by it.

## Conclusion

Electromagnetic positions are fully derivable from:
1. Complement pairing (determines which trigrams are opposites)
2. Spread calculation (determines position magnitude)
3. Yang count comparison (determines sign)

No empirical input. No special cases. Pure binary mathematics.


### references/binary-tables.md

# Binary Tables — All 64 Gates

## Complete Gate Classification

Every gate classified by binary pattern, trigrams, positions, type, and amplitude.

### Standing Waves (8 gates)
*Same trigram inner and outer — amplitude 0*

| Gate | Binary | Inner | Outer | Position | Axis |
|------|--------|-------|-------|----------|------|
| 1 | 111111 | Heaven | Heaven | -4 | Poles |
| 2 | 000000 | Earth | Earth | +4 | Poles |
| 29 | 010010 | Water | Water | +2 | Flow |
| 30 | 101101 | Fire | Fire | -2 | Flow |
| 51 | 100100 | Thunder | Thunder | +1 | Gates |
| 52 | 001001 | Mountain | Mountain | +3 | Storage |
| 57 | 011011 | Wind | Wind | -1 | Gates |
| 58 | 110110 | Lake | Lake | -3 | Storage |

### Cross-Zero Manifesting (16 gates)
*Negative inner → Positive outer*

| Gate | Binary | Inner | Outer | Vector | Amplitude |
|------|--------|-------|-------|--------|-----------|
| 5 | 111010 | Heaven | Water | -4 → +2 | 6 |
| 11 | 111000 | Heaven | Earth | -4 → +4 | 8 |
| 18 | 011001 | Wind | Mountain | -1 → +3 | 4 |
| 19 | 110000 | Lake | Earth | -3 → +4 | 7 |
| 22 | 101001 | Fire | Mountain | -2 → +3 | 5 |
| 26 | 111001 | Heaven | Mountain | -4 → +3 | 7 |
| 32 | 011100 | Wind | Thunder | -1 → +1 | 2 |
| 34 | 111100 | Heaven | Thunder | -4 → +1 | 5 |
| 36 | 101000 | Fire | Earth | -2 → +4 | 6 |
| 41 | 110001 | Lake | Mountain | -3 → +3 | 6 |
| 46 | 011000 | Wind | Earth | -1 → +4 | 5 |
| 48 | 011010 | Wind | Water | -1 → +2 | 3 |
| 54 | 110100 | Lake | Thunder | -3 → +1 | 4 |
| 55 | 101100 | Fire | Thunder | -2 → +1 | 3 |
| 60 | 110010 | Lake | Water | -3 → +2 | 5 |
| 63 | 101010 | Fire | Water | -2 → +2 | 4 |

### Cross-Zero Dematerialising (16 gates)
*Positive inner → Negative outer*

| Gate | Binary | Inner | Outer | Vector | Amplitude |
|------|--------|-------|-------|--------|-----------|
| 6 | 010111 | Water | Heaven | +2 → -4 | 6 |
| 12 | 000111 | Earth | Heaven | +4 → -4 | 8 |
| 17 | 100110 | Thunder | Lake | +1 → -3 | 4 |
| 20 | 000011 | Earth | Wind | +4 → -1 | 5 |
| 21 | 100101 | Thunder | Fire | +1 → -2 | 3 |
| 25 | 100111 | Thunder | Heaven | +1 → -4 | 5 |
| 31 | 001110 | Mountain | Lake | +3 → -3 | 6 |
| 33 | 001111 | Mountain | Heaven | +3 → -4 | 7 |
| 35 | 000101 | Earth | Fire | +4 → -2 | 6 |
| 42 | 100011 | Thunder | Wind | +1 → -1 | 2 |
| 45 | 000110 | Earth | Lake | +4 → -3 | 7 |
| 47 | 010110 | Water | Lake | +2 → -3 | 5 |
| 53 | 001011 | Mountain | Wind | +3 → -1 | 4 |
| 56 | 001101 | Mountain | Fire | +3 → -2 | 5 |
| 59 | 010011 | Water | Wind | +2 → -1 | 3 |
| 64 | 010101 | Water | Fire | +2 → -2 | 4 |

### Same-Phase Material (12 gates)
*Both positive (within Form domain)*

| Gate | Binary | Inner | Outer | Vector | Amplitude |
|------|--------|-------|-------|--------|-----------|
| 3 | 100010 | Thunder | Water | +1 → +2 | 1 |
| 4 | 010001 | Water | Mountain | +2 → +3 | 1 |
| 7 | 010000 | Water | Earth | +2 → +4 | 2 |
| 8 | 000010 | Earth | Water | +4 → +2 | 2 |
| 15 | 001000 | Mountain | Earth | +3 → +4 | 1 |
| 16 | 000100 | Earth | Thunder | +4 → +1 | 3 |
| 23 | 000001 | Earth | Mountain | +4 → +3 | 1 |
| 24 | 100000 | Thunder | Earth | +1 → +4 | 3 |
| 27 | 100001 | Thunder | Mountain | +1 → +3 | 2 |
| 39 | 001010 | Mountain | Water | +3 → +2 | 1 |
| 40 | 010100 | Water | Thunder | +2 → +1 | 1 |
| 62 | 001100 | Mountain | Thunder | +3 → +1 | 2 |

### Same-Phase Void (12 gates)
*Both negative (within Void domain)*

| Gate | Binary | Inner | Outer | Vector | Amplitude |
|------|--------|-------|-------|--------|-----------|
| 9 | 111011 | Heaven | Wind | -4 → -1 | 3 |
| 10 | 110111 | Lake | Heaven | -3 → -4 | 1 |
| 13 | 101111 | Fire | Heaven | -2 → -4 | 2 |
| 14 | 111101 | Heaven | Fire | -4 → -2 | 2 |
| 28 | 011110 | Wind | Lake | -1 → -3 | 2 |
| 37 | 101011 | Fire | Wind | -2 → -1 | 1 |
| 38 | 110101 | Lake | Fire | -3 → -2 | 1 |
| 43 | 111110 | Heaven | Lake | -4 → -3 | 1 |
| 44 | 011111 | Wind | Heaven | -1 → -4 | 3 |
| 49 | 101110 | Fire | Lake | -2 → -3 | 1 |
| 50 | 011101 | Wind | Fire | -1 → -2 | 1 |
| 61 | 110011 | Lake | Wind | -3 → -1 | 2 |

## Summary Statistics

| Type | Count | Amplitude Range | Domain |
|------|-------|-----------------|--------|
| Standing Wave | 8 | 0 | Single position |
| Cross-Zero Manifesting | 16 | 2-8 | Void → Form |
| Cross-Zero Dematerialising | 16 | 2-8 | Form → Void |
| Same-Phase Material | 12 | 1-3 | Within Form |
| Same-Phase Void | 12 | 1-3 | Within Void |

## Amplitude Distribution

| Amplitude | Gates | Count |
|-----------|-------|-------|
| 0 | 1, 2, 29, 30, 51, 52, 57, 58 | 8 |
| 1 | 3, 4, 10, 15, 23, 37, 38, 39, 40, 43, 49, 50 | 12 |
| 2 | 7, 8, 13, 14, 27, 28, 32, 42, 61, 62 | 10 |
| 3 | 9, 16, 21, 24, 44, 48, 55, 59 | 8 |
| 4 | 17, 18, 53, 54, 63, 64 | 6 |
| 5 | 20, 22, 25, 34, 46, 47, 56, 60 | 8 |
| 6 | 5, 6, 31, 35, 36, 41 | 6 |
| 7 | 19, 26, 33, 45 | 4 |
| 8 | 11, 12 | 2 |

## Axis Crossings

| Axis | Crossing Gates | Amplitude |
|------|----------------|-----------|
| Poles (-4 ↔ +4) | 11, 12 | 8 |
| Storage (-3 ↔ +3) | 31, 41 | 6 |
| Flow (-2 ↔ +2) | 63, 64 | 4 |
| Gates (-1 ↔ +1) | 32, 42 | 2 |

These four pairs cross their respective axes directly. All other cross-zero gates cross at mixed angles.


---


# User Query

Calculate the complement of Thunder.
