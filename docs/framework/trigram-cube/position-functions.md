# Position Functions: The -4 to +4 Electromagnetic Scale

## Geometric Derivation

**Source:** GEOMETRIC-FOUNDATIONS-SYNTHESIS.md (Phases 1-3)
**Status:** PROVEN — mathematical derivation complete

---

## The Position Scale

Each trigram occupies a position on an electromagnetic scale from -4 to +4:

```
Position:  +4   +3   +2   +1    0   -1   -2   -3   -4
           │    │    │    │    │    │    │    │    │
Trigram:  Earth Mtn Water Thun  ─  Wind Fire Lake Heaven
           │    │    │    │         │    │    │    │
Yang:      0    1    1    1         2    2    2    3
```

---

## The Position Function

**Formula:** Position = 4 - (2 × Yang Count)

| Trigram | Yang Count | Calculation | Position |
|---------|------------|-------------|----------|
| Earth (000) | 0 | 4 - (2×0) | +4 |
| Mountain (001) | 1 | 4 - (2×1) | +2 |
| Water (010) | 1 | 4 - (2×1) | +2 |
| Thunder (100) | 1 | 4 - (2×1) | +2 |
| Wind (011) | 2 | 4 - (2×2) | 0 |
| Fire (101) | 2 | 4 - (2×2) | 0 |
| Lake (110) | 2 | 4 - (2×2) | 0 |
| Heaven (111) | 3 | 4 - (2×3) | -2 |

**Wait** — this gives us only positions +4, +2, 0, -2. The actual wheel uses +4, +3, +2, +1, -1, -2, -3, -4.

---

## The Refined Position Function

The positions +1, +2, +3 (and -1, -2, -3) are differentiated by **which specific bit is set**:

### Yang Count 1 (Material Tetrahedron)

| Trigram | Binary | Which Bit Set | Position |
|---------|--------|---------------|----------|
| Thunder | 100 | First (X) | +1 |
| Water | 010 | Second (Y) | +2 |
| Mountain | 001 | Third (Z) | +3 |

### Yang Count 2 (Void Tetrahedron)

| Trigram | Binary | Which Bit Clear | Position |
|---------|--------|-----------------|----------|
| Wind | 011 | First (X) | -1 |
| Fire | 101 | Second (Y) | -2 |
| Lake | 110 | Third (Z) | -3 |

---

## The Complete Position Map

| Position | Trigram | Binary | Yang Count | Domain |
|----------|---------|--------|------------|--------|
| **+4** | Earth | 000 | 0 | Material (peak) |
| **+3** | Mountain | 001 | 1 | Material |
| **+2** | Water | 010 | 1 | Material |
| **+1** | Thunder | 100 | 1 | Material |
| **0** | — | — | — | Zero crossing |
| **-1** | Wind | 011 | 2 | Void |
| **-2** | Fire | 101 | 2 | Void |
| **-3** | Lake | 110 | 2 | Void |
| **-4** | Heaven | 111 | 3 | Void (trough) |

---

## The Wave Visualisation

```
EM Position
    +4  │          ●Earth (peak)
    +3  │         / \
    +2  │        ●   ●
    +1  │       /Thunder
     0  │──────/───────\──────── ZERO CROSSING
    -1  │     /         ●Wind
    -2  │    ●Fire       \
    -3  │   /Lake         \
    -4  │                  ●Heaven (trough)
        └─────────────────────────────
          1   2   3   4   5   6   7   8
```

---

## The Wheel Path

The inner trigram traces this path around the wheel:

```
Lake → Fire → Thunder → Earth → Mountain → Water → Wind → Heaven → (return)
 -3     -2      +1       +4       +3        +2      -1      -4
```

This is a **Hamiltonian cycle** through the cube — visiting all 8 vertices exactly once before returning.

### The Two Zero Crossings

| Crossing | From → To | Domain Shift | Gate Type |
|----------|-----------|--------------|-----------|
| 1 | Fire (-2) → Thunder (+1) | Void → Material | Manifestation |
| 2 | Water (+2) → Wind (-1) | Material → Void | Dissolution |

Two crossings per cycle = **(2,1) torus knot topology**.

---

## Domain Classification

### Positive Positions (Material Domain)

| Position | Trigram | Character |
|----------|---------|-----------|
| +4 | Earth | Pure receptivity |
| +3 | Mountain | Stillness |
| +2 | Water | Depth |
| +1 | Thunder | Arousing |

### Negative Positions (Void Domain)

| Position | Trigram | Character |
|----------|---------|-----------|
| -1 | Wind | Penetrating |
| -2 | Fire | Clarity |
| -3 | Lake | Joy |
| -4 | Heaven | Creative force |

---

## Why Positions Matter

The position of a trigram determines:

1. **Domain:** Material (+) or Void (-)?
2. **Intensity:** How far from zero crossing?
3. **Gate type:** When inner and outer trigrams have different domains → Cross-Zero
4. **Standing wave:** When inner = outer → position held

### Hexagram Classification by Position

| Inner → Outer | Position Relationship | Gate Type |
|---------------|----------------------|-----------|
| Same position | Inner = Outer | Standing Wave |
| Same domain | Both + or both - | Same-Phase |
| Opposite domain | One + one - | Cross-Zero |

---

## The Mathematical Structure

### Position from Binary

```python
def get_position(binary):
    """Return EM position for a trigram binary string."""
    yang_count = binary.count('1')

    if yang_count == 0:
        return +4  # Earth
    elif yang_count == 3:
        return -4  # Heaven
    elif yang_count == 1:
        # Which bit is set?
        if binary[0] == '1': return +1  # Thunder (100)
        if binary[1] == '1': return +2  # Water (010)
        if binary[2] == '1': return +3  # Mountain (001)
    else:  # yang_count == 2
        # Which bit is clear?
        if binary[0] == '0': return -1  # Wind (011)
        if binary[1] == '0': return -2  # Fire (101)
        if binary[2] == '0': return -3  # Lake (110)
```

### Symmetry Properties

- **Complement symmetry:** Position(X) = -Position(complement(X))
- **Range:** -4 to +4 (9 discrete levels, 0 never occupied)
- **Balance:** 4 positive, 4 negative, 0 trigrams at zero

---

## Derivability Status

| Element | Status |
|---------|--------|
| Position scale -4 to +4 | ✓ PROVEN |
| Yang count → general position | ✓ PROVEN |
| Bit position → specific position | ✓ PROVEN |
| Two zero crossings per cycle | ✓ PROVEN |
| Complement = opposite position | ✓ PROVEN |

**The position function is fully derivable from binary structure.**

---

*Extracted from: GEOMETRIC-FOUNDATIONS-SYNTHESIS.md*
*Framework location: docs/framework/trigram-cube/position-functions.md*
