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
