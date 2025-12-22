# Same-Phase Gates: Circulation Within Domains

## Geometric Derivation

**Source:** GEOMETRIC-FOUNDATIONS-SYNTHESIS.md (Phase 1)
**Status:** PROVEN — 24 gates moving within tetrahedra

---

## Core Finding

Same-phase gates are hexagrams where the inner and outer trigrams belong to the **same tetrahedron** within the cube. They represent circulation or transformation within a single domain — either void or material.

---

## The Two Types

| Type | Count | Domain |
|------|-------|--------|
| **Same-Phase Void** | 12 | Within Void tetrahedron |
| **Same-Phase Material** | 12 | Within Material tetrahedron |

**Total same-phase gates:** 24

---

## Why "Same Phase"?

On the electromagnetic wave, same-phase gates stay on the **same side of zero**:
- **Void circulation:** Moves between negative positions (-1, -2, -3, -4)
- **Material circulation:** Moves between positive positions (+1, +2, +3, +4)

No zero crossing occurs — the movement stays within one domain.

```
EM Position
    +4  │  ●─────────────●  MATERIAL CIRCULATION
    +3  │  │             │
    +2  │  │    stays    │
    +1  │  ●─────────────●
     0  │═══════════════════════════════════
    -1  │  ●─────────────●
    -2  │  │    stays    │
    -3  │  │    in void  │
    -4  │  ●─────────────●  VOID CIRCULATION
```

---

## Same-Phase Void (12 gates)

**Definition:** Both inner and outer trigrams in the Void tetrahedron

### Void Tetrahedron Members

| Trigram | Binary | Yang Count | EM Position |
|---------|--------|------------|-------------|
| Wind | 011 | 2 | -1 |
| Fire | 101 | 2 | -2 |
| Lake | 110 | 2 | -3 |
| Heaven | 111 | 3 | -4 |

### Possible Movements

Each void trigram can move to any of the **other 3** void trigrams:

4 trigrams × 3 destinations = **12 same-phase void gates**

### Examples

| Inner → Outer | Gate Movement | Meaning |
|---------------|---------------|---------|
| Wind → Fire | -1 → -2 | Deeper into void |
| Heaven → Lake | -4 → -3 | Rising in void |
| Fire → Wind | -2 → -1 | Approaching material |
| Lake → Heaven | -3 → -4 | Diving to void peak |

---

## Same-Phase Material (12 gates)

**Definition:** Both inner and outer trigrams in the Material tetrahedron

### Material Tetrahedron Members

| Trigram | Binary | Yang Count | EM Position |
|---------|--------|------------|-------------|
| Thunder | 100 | 1 | +1 |
| Water | 010 | 1 | +2 |
| Mountain | 001 | 1 | +3 |
| Earth | 000 | 0 | +4 |

### Possible Movements

Each material trigram can move to any of the **other 3** material trigrams:

4 trigrams × 3 destinations = **12 same-phase material gates**

### Examples

| Inner → Outer | Gate Movement | Meaning |
|---------------|---------------|---------|
| Thunder → Water | +1 → +2 | Rising in material |
| Earth → Mountain | +4 → +3 | Descending from peak |
| Water → Thunder | +2 → +1 | Approaching void |
| Mountain → Earth | +3 → +4 | Rising to material peak |

---

## Physical Interpretation

| Type | Physical Analogy |
|------|------------------|
| **Same-Phase Void** | Potential energy transformation, ideation, abstraction |
| **Same-Phase Material** | Kinetic energy transformation, action, manifestation |

In circuit terms:
- **Void circulation:** Energy moving between inductors and capacitors (reactive)
- **Material circulation:** Energy moving between resistors (dissipative)

---

## Relationship to Standing Waves

Same-phase gates are **distinct from standing waves**:

| Type | Inner vs Outer | Within Same Tetrahedron? |
|------|----------------|-------------------------|
| Standing Wave | Same trigram | Yes (trivially) |
| Same-Phase | Different trigram | Yes |
| Cross-Zero | Different trigram | No |

Same-phase gates show **movement** (different trigrams) but **no domain change** (same tetrahedron).

---

## Count Verification

| Type | Formula | Count |
|------|---------|-------|
| Standing Wave | 8 × 1 (identity) | 8 |
| Same-Phase Void | 4 × 3 (void to other void) | 12 |
| Same-Phase Material | 4 × 3 (material to other material) | 12 |
| Cross-Zero Manifesting | 4 × 4 (void to material) | 16 |
| Cross-Zero Dematerialising | 4 × 4 (material to void) | 16 |
| **Total** | | **64** |

---

## Hamming Distance

Same-phase gates have Hamming distance 1 or 2 (but not 0 or 3):

| Hamming | Meaning | Type |
|---------|---------|------|
| 0 | Same trigram | Standing Wave |
| 1 | One bit flip | Could be Same-Phase OR Cross-Zero |
| 2 | Two bit flips | Could be Same-Phase OR Cross-Zero |
| 3 | Complement | Always Cross-Zero |

**Tetrahedron membership, not Hamming distance, determines classification.**

### Examples of Hamming 1

| Transition | Binary Change | Tetrahedra | Type |
|------------|---------------|------------|------|
| Wind → Fire | 011 → 101 | Both Void | Same-Phase Void |
| Thunder → Wind | 100 → 011 | Material → Void | Cross-Zero Dematerialising |

Same Hamming distance, different types — because different tetrahedra involved.

---

## Wheel Distribution

Same-phase gates create **circulation segments** on the wheel — regions where the wave moves within a domain without crossing zero.

Between the two zero crossings, the wheel spends time:
- Circulating in the **void domain** (negative half)
- Circulating in the **material domain** (positive half)

This creates the figure-8 pattern: circulation in one domain, cross, circulation in other domain, cross, repeat.

---

## Derivability Status

| Element | Status |
|---------|--------|
| Same-phase = intra-tetrahedra movement | ✓ PROVEN |
| 12 void + 12 material | ✓ PROVEN |
| Distinct from standing waves | ✓ PROVEN |
| Hamming distance doesn't determine type | ✓ PROVEN |
| Circulation within domains | ✓ PROVEN |

---

*Extracted from: GEOMETRIC-FOUNDATIONS-SYNTHESIS.md*
*Framework location: docs/framework/hexagram-movements/same-phase-gates.md*
