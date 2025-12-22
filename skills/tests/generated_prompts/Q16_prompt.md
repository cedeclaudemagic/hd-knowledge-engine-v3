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


## hd-electromagnetic-framework


### SKILL.md

---
name: hd-electromagnetic-framework
description: Practical electromagnetic framework for interpreting I Ching hexagrams and Human Design gates. Explains how positions create meaning, how lines function within gates, and how the threshold dynamics work. Use when asked about: (1) What a specific position means (Source, Sink, Current, etc.), (2) How to interpret any gate electromagnetically, (3) Line meanings and the 3→4 threshold, (4) Gate type characteristics (standing wave, cross-zero, same-phase), (5) Channel, circuit, or centre interpretations through the EM lens, (6) "How do I read Gate X?" questions.
---

# HD Electromagnetic Framework Skill

This skill provides the practical interpretation layer for the electromagnetic I Ching. It builds on the mathematical foundation (see `hd-mathematics` skill) to explain **what positions mean** and **how to read any gate**.

## The Wave Model

Consciousness oscillates between two poles:

```
VOID (Potential)                    FORM (Manifest)
     -4    -3    -2    -1    0    +1    +2    +3    +4
      │     │     │     │    │     │     │     │     │
   Source Cap. Volt. Gate  Mono  Gate Curr. Ind. Sink
                    -OUT  -pole  -IN
```

**Void Domain (negative):** Potential, not-yet-manifest, creative field
**Form Domain (positive):** Manifest, actualised, material expression
**Monopole (0):** The axis around which the wave turns — neither void nor form

## Position Meanings

| Position | Name | Quality | Function |
|----------|------|---------|----------|
| **-4** | Source | Pure creative potential | Origin of all manifestation |
| **-3** | Capacitance | Stored potential | Joy, openness, accumulated charge |
| **-2** | Voltage | Pressure differential | Clarity, illumination, potential difference |
| **-1** | Gate-OUT | Release threshold | Penetration, dissolution, letting go |
| **+1** | Gate-IN | Entry threshold | Arousal, initiation, first contact with form |
| **+2** | Current | Committed flow | Depth, movement through form, dedication |
| **+3** | Inductance | Stored form | Stillness, resistance, accumulated structure |
| **+4** | Sink | Pure reception | Completion, receptivity, full materialisation |

## The Four Axes

Each axis has characteristic qualities:

### Poles Axis (±4)
- **Character:** Maximum amplitude, origin and completion
- **Gates:** 1, 2 (standing waves); 11, 12 (cross-zero)
- **Quality:** "Great" transformations, fundamental creative/receptive forces

### Storage Axis (±3)
- **Character:** Accumulation, holding
- **Gates:** 52, 58 (standing waves); 31, 41 (cross-zero)
- **Quality:** Joy ↔ Stillness, what is gathered and held

### Flow Axis (±2)
- **Character:** Movement, the carrier wave
- **Gates:** 29, 30 (standing waves); 63, 64 (cross-zero)
- **Quality:** Voltage ↔ Current, how energy actually moves

### Gates Axis (±1)
- **Character:** Threshold, minimum crossing
- **Gates:** 51, 57 (standing waves); 32, 42 (cross-zero)
- **Quality:** Release ↔ Entry, where domains touch

## Five Gate Types

### 1. Standing Waves (8 gates)
**Pattern:** Same trigram inner and outer
**Character:** Holds position, state language, "being" not "doing"
**Gates:** 1, 2, 29, 30, 51, 52, 57, 58

**Line structure:**
- Lines 1-3: Internal experience of the position
- Lines 4-6: External expression of the position
- Threshold 3→4: Expression-shift (internal → external, same frequency)

**Completion varies by position:**
| Position | Line 6 Quality |
|----------|----------------|
| ±4 (Poles) | Noble/receptive — stable when held |
| ±3 (Storage) | Accumulative — builds, attracts |
| ±2 (Flow) | **Problematic** — held flow = imprisoned |
| ±1 (Gates) | Limit — stop here, don't push further |

### 2. Cross-Zero Manifesting (16 gates)
**Pattern:** Negative inner → Positive outer
**Character:** Potential becomes form, transformation language
**Examples:** Gate 11 (-4 → +4), Gate 63 (-2 → +2)

**Line structure:**
- Lines 1-3: Origin domain (void side)
- **Threshold 3→4:** Zero crossing — potential becomes form
- Lines 4-6: Destination domain (form side)

### 3. Cross-Zero Dematerialising (16 gates)
**Pattern:** Positive inner → Negative outer
**Character:** Form returns to potential, release language
**Examples:** Gate 12 (+4 → -4), Gate 64 (+2 → -2)

**Line structure:**
- Lines 1-3: Origin domain (form side)
- **Threshold 3→4:** Zero crossing — form becomes potential
- Lines 4-6: Destination domain (void side)

### 4. Same-Phase Material (12 gates)
**Pattern:** Both trigrams positive
**Character:** Movement within form, action language
**Examples:** Gate 3 (+1 → +2), Gate 7 (+2 → +4)

**Line structure:**
- Lines 1-3: Inner position within form
- Transition 3→4: Position shift (no zero crossing)
- Lines 4-6: Outer position within form

### 5. Same-Phase Void (12 gates)
**Pattern:** Both trigrams negative
**Character:** Movement within potential, refinement language
**Examples:** Gate 9 (-4 → -1), Gate 44 (-1 → -4)

**Line structure:**
- Lines 1-3: Inner position within void
- Transition 3→4: Position shift (no zero crossing)
- Lines 4-6: Outer position within void

## Line Meanings

| Line | Position | Function | Quality |
|------|----------|----------|---------|
| **1** | Entry-Inner | First contact | Foundation, timing, introspection |
| **2** | Development-Inner | Trigram anchor | Clearest expression, natural, hermit |
| **3** | Completion-Inner | Pre-threshold | Trial, bonds made/broken, adaptation |
| **4** | Entry-Outer | Post-threshold | First contact with outer, externalisation |
| **5** | Development-Outer | Trigram anchor | Clearest outer expression, projection |
| **6** | Completion-Outer | Gate peak | Perspective, timing, mutation point |

### Harmonic Pairs
Lines form three pairs with electromagnetic resonance:
- **1-4:** Foundation ↔ Arrival (entry to each trigram)
- **2-5:** Hermit ↔ Projection (anchors of each trigram)
- **3-6:** Bonds ↔ Transition (completion of each trigram)

## Reading Any Gate

**Step 1: Classify the gate**
- Identify inner and outer trigrams
- Calculate positions and amplitude
- Determine gate type

**Step 2: Understand the positions**
- What does the inner position mean?
- What does the outer position mean?
- What kind of movement is this?

**Step 3: Read the threshold**
- For cross-zero: What transforms at Line 3→4?
- For standing wave: What shifts from internal to external?
- For same-phase: What moves within the domain?

**Step 4: Apply line context**
- Which line is active?
- What is its function (entry, development, completion)?
- How does the position inform the line's meaning?

## Amplitude Significance

| Amplitude | Character | Timing |
|-----------|-----------|--------|
| 0 | Standing wave — being | Continuous |
| 1-2 | Subtle shift | Quick |
| 3-4 | Moderate crossing | Medium |
| 5-6 | Significant transformation | Extended |
| 7-8 | Maximum transformation | Long process |

**Principle:** Higher amplitude = more positions traversed = greater transformation = longer timing required.

## References

For specific interpretations, see:
- `references/position-qualities.md` — Deep dive on each position
- `references/line-dynamics.md` — Line-by-line interpretation patterns
- `references/threshold-mechanics.md` — The 3→4 crossing in detail
- `references/completion-patterns.md` — How Line 6 differs by position

## Integration with Other Skills

This framework integrates with:
- **hd-mathematics** — For derivations and calculations
- **hd-electromagnetic-interpretations** — For specific gate meanings
- **hd-oracle** — For practical divination use

When reading any gate, the structure generates the meaning. The framework is not imposed — it is discovered.


### references/position-qualities.md

# Position Qualities — Deep Reference

Each position on the electromagnetic wave has distinct character. These qualities emerge from the position's relationship to the wave structure, not from arbitrary assignment.

## Position -4: Source (Heaven)

**Trigram:** Heaven (☰) — three solid lines
**Domain:** Void (potential)
**Axis:** Poles (maximum magnitude)

**Essential Quality:** Pure creative potential. The origin point from which manifestation emerges. Not creation itself, but the field of creative possibility.

**Character:**
- Maximum distance from form
- Undifferentiated potential
- Creative force before expression
- The field, not the particle

**When standing (Gate 1):** Being the creative source. Not doing creativity, but being the field from which it emerges.

**When departing (manifesting):** Creative potential beginning its journey toward form. The initiating force of transformation.

**When arriving (dematerialising):** Form returning to pure potential. Release into undifferentiated creativity.

**Completion quality:** Noble but precarious. "Arrogant dragon has remorse" — holding Source too long becomes pride. The creative must flow.

---

## Position -3: Capacitance (Lake)

**Trigram:** Lake (☱) — broken over solid solid
**Domain:** Void (potential)
**Axis:** Storage

**Essential Quality:** Stored potential. Joy that comes from accumulated creative charge. Openness that attracts and holds.

**Character:**
- Potential held in reserve
- Joyful anticipation
- Attractive, drawing force
- Openness to possibility

**When standing (Gate 58):** Being joyous. The natural state of stored potential — not depleted, not released, simply present and attracting.

**When departing:** Releasing stored potential toward manifestation. Joy becoming action.

**When arriving:** Form returning to joyful potential. Relief, release, restoration.

**Completion quality:** Seductive, attractive. Line 6 draws others in. Joy at completion becomes magnetic. Unlike Current (+2), held Capacitance attracts rather than imprisons.

---

## Position -2: Voltage (Fire)

**Trigram:** Fire (☲) — solid broken solid
**Domain:** Void (potential)
**Axis:** Flow

**Essential Quality:** Pressure differential. The potential difference that enables current. Clarity, illumination, the light that reveals.

**Character:**
- Pressure without movement (yet)
- Illuminating, clarifying
- Potential energy held in tension
- The "why" that precedes action

**When standing (Gate 30):** Being the pressure. Clarity held, illumination sustained. The flame that clarifies without consuming.

**When departing:** Pressure releasing into flow. Voltage becoming current. Potential becoming kinetic.

**When arriving:** Flow returning to pressure. Current becoming voltage. Action returning to clarity.

**Completion quality:** Strategic deployment. Line 6 requires the king's authority to chastise — voltage at completion must be directed purposefully. Raw pressure at Line 6 becomes dangerous.

---

## Position -1: Gate-OUT (Wind)

**Trigram:** Wind (☴) — broken solid solid
**Domain:** Void (potential)
**Axis:** Gates (threshold)

**Essential Quality:** Release threshold. The point of letting go, penetration, dissolution. The last moment before crossing into form.

**Character:**
- Maximum rate of change (closest to zero)
- Penetrating, dissolving
- Release, letting go
- The edge of potential

**When standing (Gate 57):** Being at the threshold of release. Gentle penetration, sustained letting-go. Not crossing, but being the gate itself.

**When departing:** Releasing into form. The moment of penetration that initiates manifestation. Letting go becomes entering.

**When arriving:** Form releasing into void. Return to the threshold. Dissolution begins.

**Completion quality:** Limit — don't push further. Line 6 "loses property and weapon" — penetration at completion destroys what it contacts. The threshold is meant to be crossed, not held.

---

## Position +1: Gate-IN (Thunder)

**Trigram:** Thunder (☳) — solid broken broken
**Domain:** Form (manifest)
**Axis:** Gates (threshold)

**Essential Quality:** Entry threshold. The shock of arrival, arousal, first contact with form. The first moment of manifestation.

**Character:**
- Maximum rate of change (closest to zero)
- Shocking, arousing
- Initiation, first contact
- The edge of form

**When standing (Gate 51):** Being the threshold of entry. Sustained shock, perpetual initiation. Not settling into form, but being the gate itself.

**When departing:** Moving from entry into deeper form. Shock becoming structure. Initiation becoming establishment.

**When arriving:** Form returning to its entry point. Re-encountering the shock of manifestation.

**Completion quality:** Limit — don't go ahead. Line 6 warns against continuing — the gate is for passing through, not for holding. "Shock brings ruin" when held too long.

---

## Position +2: Current (Water)

**Trigram:** Water (☵) — broken solid broken
**Domain:** Form (manifest)
**Axis:** Flow

**Essential Quality:** Committed flow. Movement through form, depth, the actual passage of energy. Dedication that cannot turn back.

**Character:**
- Flow in motion
- Depth, commitment
- Danger of the abyss
- The "how" of actualisation

**When standing (Gate 29):** Being the flow. Committed movement, sustained depth. The abysmal — danger held as state.

**When departing:** Flow intensifying or redirecting. Current moving toward completion or storage.

**When arriving:** Transformation entering flow state. Becoming committed, becoming deep.

**Completion quality:** IMPRISONMENT. This is unique. Line 6 "bound in prison, surrounded by thorns" — flow that cannot move becomes trapped. Current at completion is the most problematic of all positions. It must keep moving or it suffocates.

---

## Position +3: Inductance (Mountain)

**Trigram:** Mountain (☶) — broken broken solid
**Domain:** Form (manifest)
**Axis:** Storage

**Essential Quality:** Stored form. Structure held, stillness achieved. Resistance that preserves, the inertia of manifestation.

**Character:**
- Form held in reserve
- Stillness, stability
- Resistant, preserving
- Accumulated structure

**When standing (Gate 52):** Being still. Keeping still, not as action but as state. The mountain that simply is.

**When departing:** Releasing stored form. Stillness becoming movement. Structure releasing into flow.

**When arriving:** Form accumulating into storage. Movement becoming stillness.

**Completion quality:** Noblehearted peace. Line 6 achieves "noblehearted keeping still" — unlike Current, stored form at completion is genuinely good. Stillness fulfilled becomes wisdom.

---

## Position +4: Sink (Earth)

**Trigram:** Earth (☷) — three broken lines
**Domain:** Form (manifest)
**Axis:** Poles (maximum magnitude)

**Essential Quality:** Pure reception. The completion point where all manifestation arrives. Not form itself, but the ground that receives it.

**Character:**
- Maximum distance from potential
- Pure receptivity
- Completion, grounding
- The field that receives

**When standing (Gate 2):** Being receptive. Not receiving something, but being the capacity to receive. The mare that follows.

**When departing (dematerialising):** Reception beginning its return to potential. The ground releasing what it held.

**When arriving (manifesting):** Creative force fully manifested. Potential fully received into form.

**Completion quality:** Dragons fight in the field. Line 6 brings tension — pure reception fully achieved means the creative has nowhere else to go. Heaven meeting Earth creates friction before resolution.

---

## Position 0: Monopole

**Location:** The axis itself
**Domain:** Neither void nor form

**Essential Quality:** The organising centre around which the wave turns. Not a position to occupy, but the axis that makes positions possible.

In Human Design, the Magnetic Monopole (Gate 2 in the G Centre) connects to this principle — the attractor that holds Design and Personality together without being either.

The Monopole is not a gate. It is the absence around which gates turn.


### references/threshold-mechanics.md

# Threshold Mechanics — The 3→4 Crossing

The transition between Line 3 and Line 4 is always significant. It marks the boundary between inner and outer trigrams, and its character depends on the gate type.

## Three Threshold Types

### 1. Expression-Shift (Standing Waves)

**Gates:** 1, 2, 29, 30, 51, 52, 57, 58
**Movement:** Same position, different orientation

In standing waves, the trigrams are identical. There is no movement between positions. Instead, the threshold marks the shift from **internal experience** to **external expression**.

**Before (Lines 1-3):** What it feels like to hold this position
**After (Lines 4-6):** What it looks like when this position expresses outward

**Example — Gate 1 (Source, -4):**
- Lines 1-3: The internal experience of creative potential
- Line 3: "All day long the superior man is creatively active" — internal completion
- Line 4: "Wavering flight over the depths" — potential now visible but uncertain
- Lines 5-6: The external expression of creative power

**Character:** The frequency doesn't change. The relationship to it changes.

---

### 2. Domain Crossing (Cross-Zero Gates)

**Gates:** All 32 cross-zero gates (manifesting and dematerialising)
**Movement:** Void → Form or Form → Void

This is the most dramatic threshold. The crossing changes not just position but domain. Potential becomes form, or form returns to potential.

**Manifesting (negative → positive):**
- Before (Lines 1-3): Operating in the void domain
- Threshold: Potential crystallises into form
- After (Lines 4-6): Operating in the form domain

**Dematerialising (positive → negative):**
- Before (Lines 1-3): Operating in the form domain
- Threshold: Form dissolves into potential
- After (Lines 4-6): Operating in the void domain

**Example — Gate 11 (Peace, -4 → +4, amplitude 8):**
- Lines 1-3: Heaven's creative potential (void side)
- Line 3: "No plain not followed by a slope" — accepting impermanence before crossing
- Threshold: Maximum transformation occurs
- Line 4: "Fluttering down" — first contact with Earth's reception
- Lines 5-6: Earth's receptive completion (form side)

**Character:** Something fundamentally transforms. What was potential becomes actual (or vice versa).

---

### 3. Position Shift (Same-Phase Gates)

**Gates:** All 24 same-phase gates (material and void)
**Movement:** Position change within same domain

Both trigrams are in the same domain (both positive or both negative). The threshold changes position but not domain character.

**Same-Phase Material (both positive):**
- Before (Lines 1-3): Inner position within form
- Threshold: Position shifts within form domain
- After (Lines 4-6): Outer position within form

**Same-Phase Void (both negative):**
- Before (Lines 1-3): Inner position within potential
- Threshold: Position shifts within void domain
- After (Lines 4-6): Outer position within potential

**Example — Gate 3 (Difficulty at Beginning, +1 → +2):**
- Lines 1-3: Gate-IN (+1) — the shock of entry into form
- Threshold: Moving from threshold to flow
- Lines 4-6: Current (+2) — committed flow in form

**Character:** The domain stays the same; the position changes. This is action within a field rather than transformation between fields.

---

## Threshold Dynamics by Position

### Source Thresholds (-4)

**As origin (manifesting):** Creative potential begins moving toward form. The threshold releases pure potential into the journey.

**As destination (dematerialising):** Form returns to undifferentiated potential. The threshold absorbs manifestation back into source.

**Quality:** "Great" transformations. Maximum amplitude when crossing the full pole axis.

### Sink Thresholds (+4)

**As origin (dematerialising):** Full reception begins releasing. The most manifest point starts returning.

**As destination (manifesting):** Creative journey reaches complete manifestation. The threshold receives and grounds.

**Quality:** Completion and grounding. The journey lands.

### Flow Thresholds (±2)

**As origin:** Pressure (voltage) or movement (current) initiates the journey.
**As destination:** Journey arrives at flow state.

**Quality:** The Flow axis carries. When both origin and destination are Flow (Gates 63/64), the transformation is about completion cycles.

### Gates Thresholds (±1)

**As origin:** Release (wind) or entry (thunder) initiates.
**As destination:** Journey arrives at threshold state.

**Quality:** Minimum amplitude. The Gates axis crossings (32, 42) are the smallest transformations.

### Storage Thresholds (±3)

**As origin:** Stored potential (capacitance) or stored form (inductance) releases.
**As destination:** Journey arrives at accumulation.

**Quality:** What is held. Storage positions concern what has been gathered.

---

## Line 3: Accepting the Threshold

Line 3 is the **pre-threshold** position. Its consistent theme across all gate types:

**In standing waves:** Internal completion. The peak of inner experience before expression-shift.

**In cross-zero:** Accepting the crossing. Line 3 must consent to transformation.

**In same-phase:** Peak of inner position. Readiness for position shift.

**Pattern:** Line 3 imagery often includes trial, testing, danger, adaptation. It's the moment before change where readiness is tested.

---

## Line 4: First Contact After Threshold

Line 4 is the **post-threshold** position. Its consistent theme:

**In standing waves:** First external expression. The frequency now visible to others.

**In cross-zero:** First contact with new domain. Adapting to fundamentally different conditions.

**In same-phase:** First contact with outer position. Adapting to new position within same domain.

**Pattern:** Line 4 imagery often includes uncertainty, wavering, choice between advance and retreat. It's the moment after change where adaptation is required.

---

## Amplitude and Threshold Intensity

The amplitude of a gate determines how dramatic the threshold crossing is:

| Amplitude | Threshold Intensity |
|-----------|---------------------|
| 0 | No crossing (standing wave) — expression-shift only |
| 1-2 | Subtle shift — position change within close range |
| 3-4 | Moderate crossing — noticeable transformation |
| 5-6 | Significant crossing — substantial transformation |
| 7-8 | Maximum crossing — fundamental transformation |

**Gates 11 and 12** (amplitude 8) have the most intense thresholds. **Gates 32 and 42** (amplitude 2) have the subtlest crossings.

---

## Reading Threshold Moments

When interpreting a gate, pay special attention to:

1. **What is Line 3's preparation?** How does the gate ready itself for threshold?
2. **What transforms at the threshold?** (domain, position, or expression)
3. **What is Line 4's adaptation?** How does the gate adjust post-threshold?
4. **What amplitude is involved?** How dramatic is the crossing?

The threshold is where the gate's essential transformation occurs. Everything before prepares for it; everything after integrates it.


### references/line-dynamics.md

# Line Dynamics — Interpretation Patterns

## The Six Lines

Each hexagram has six lines. The first three belong to the inner (lower) trigram; the second three to the outer (upper) trigram.

### Line 1: Entry-Inner

**Position:** First contact with inner trigram
**Function:** Foundation, initiation, timing

**Qualities:**
- **Introspection:** Not yet visible, turned inward
- **Foundation:** What's established here determines everything
- **Timing:** When to begin matters enormously
- **Conditions:** Entry sets the terms

**Pattern:** Line 1 often concerns whether conditions are right. Premature action destabilises; correct timing establishes.

**Typical imagery:** Hidden dragons, first frost, initial stirrings, seeds planted.

---

### Line 2: Development-Inner

**Position:** Anchor of inner trigram
**Function:** Natural expression, the hermit, being seen

**Qualities:**
- **Natural:** This is the trigram being itself
- **Hermit:** Content without seeking, complete without striving
- **Recognition:** Others notice and respond
- **Danger of being drawn out:** The hermit may be called

**Pattern:** Line 2 is self-sufficient but attracts attention. The tension is between natural being and external demands.

**Typical imagery:** Dragon in the field, stepping on the tail, the hermit, one who doesn't seek.

---

### Line 3: Completion-Inner

**Position:** Peak of inner trigram, pre-threshold
**Function:** Trial, bonds, adaptation before transition

**Qualities:**
- **Trial:** Testing what's been built
- **Bonds:** Made or broken here
- **Danger:** Peak of inner means edge of transition
- **Adaptation:** Must prepare for what comes next

**Pattern:** Line 3 is precarious — completion of one phase, threshold to another. Bonds form or break. Trials determine readiness.

**Typical imagery:** "All day long the superior man is creatively active. At nightfall his mind is still beset with cares. Danger. No blame."

---

### Line 4: Entry-Outer

**Position:** First contact with outer trigram (post-threshold)
**Function:** Externalisation, new conditions, uncertainty

**Qualities:**
- **Post-threshold:** Something has changed
- **Uncertainty:** New domain, new rules
- **Externalisation:** Inner becoming outer
- **Choice point:** Leap or withdraw

**Pattern:** Line 4 must adapt to new conditions. What worked inside may not work outside. The transition creates both opportunity and risk.

**Typical imagery:** Wavering flight, leaping from the deep, hesitation between advance and retreat.

---

### Line 5: Development-Outer

**Position:** Anchor of outer trigram
**Function:** Projection, influence, the ruler's position

**Qualities:**
- **Projection:** Naturally influences the field
- **Authority:** The position of greatest effect
- **Responsibility:** What projects outward affects others
- **Recognition:** Others respond to this frequency

**Pattern:** Line 5 is "the ruler's line" — greatest capacity to affect the environment. This brings both power and responsibility.

**Typical imagery:** Flying dragon in the heavens, the great man, benefiting to see.

---

### Line 6: Completion-Outer

**Position:** Peak of outer trigram, gate completion
**Function:** Perspective, mutation, role model or warning

**Qualities:**
- **Perspective:** From here, the whole circuit is visible
- **Timing:** Doesn't act until seeing the complete picture
- **Mutation:** Membrane to the next gate in sequence
- **Resolution:** How the gate completes itself

**Pattern:** Line 6 is not "the best" — it's the completion. Sometimes this is noble (Gate 52.6: "Noblehearted keeping still"). Sometimes it's problematic (Gate 29.6: "Bound in prison"). The position determines the completion quality.

**Typical imagery:** Arrogant dragon, over-reaching, withdrawal, transcendence, or warning.

---

## Harmonic Pairs

Lines resonate in three pairs:

### Lines 1 and 4: Foundation ↔ Arrival

Both are entry lines — 1 enters inner, 4 enters outer.

**Resonance:**
- Both concern conditions and timing of entry
- Both face uncertainty about new territory
- What Line 1 establishes, Line 4 must adapt to

**Reading pattern:** If Line 1 concerns "should I begin?", Line 4 concerns "how do I continue now that I've crossed?"

---

### Lines 2 and 5: Hermit ↔ Projection

Both are anchor lines — the clearest expression of their trigram.

**Resonance:**
- Both are self-sufficient, natural, recognised
- Line 2 is noticed; Line 5 influences
- Both attract but respond differently to attention

**Reading pattern:** Line 2's authenticity becomes Line 5's authority. The hermit and the ruler are both natural — one withdraws, one engages.

---

### Lines 3 and 6: Bonds ↔ Transition

Both are completion lines — peak of their trigram.

**Resonance:**
- Both face trials and decisions
- Both determine what carries forward
- Both are precarious, neither stable

**Reading pattern:** Line 3's internal completion sets up Line 6's external resolution. Bonds made at 3 are tested at 6.

---

## Line Reading by Gate Type

### In Standing Waves

Lines 1-3 describe **internal experience** of the position.
Lines 4-6 describe **external expression** of the position.
Threshold 3→4 is **expression-shift**: same frequency, different orientation.

**Pattern:** The standing wave doesn't go anywhere — it deepens and expresses. Each line reveals another facet of holding this position.

### In Cross-Zero Gates

Lines 1-3 describe the **origin domain**.
Lines 4-6 describe the **destination domain**.
Threshold 3→4 is **domain crossing**: void ↔ form transformation.

**Pattern:** Line 3 must accept the crossing. Line 4 must adapt to new domain. The transformation happens between them.

### In Same-Phase Gates

Lines 1-3 describe the **inner position** within the domain.
Lines 4-6 describe the **outer position** within the domain.
Threshold 3→4 is **position shift**: movement without domain crossing.

**Pattern:** The qualities shift but the domain doesn't change. This is action within a field, not transformation between fields.

---

## Planetary Conditioning

Each line has planetary exaltation (supports) and detriment (undermines).

**Standing waves:** 100% predictable from position
**Cross-zero:** ~44% predictable (empirical layer)
**Same-phase:** Pattern under investigation

The planetary layer operates but resists full derivation. We include it honestly: it works, but we cannot prove why from first principles.


---


# User Query

Walk me through Gate 11 from binary to meaning.
