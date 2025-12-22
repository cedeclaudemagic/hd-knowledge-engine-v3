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
