# Gate Classification: The Four Types of Movement

## Geometric Derivation

**Source:** GEOMETRIC-FOUNDATIONS-SYNTHESIS.md (Phase 1)
**Status:** PROVEN — 100% match with electromagnetic classification

---

## Core Finding

Every hexagram represents a movement through the trigram cube — from one vertex (inner trigram) to another (outer trigram). The electromagnetic classification derives entirely from cube geometry.

---

## The Four Types

| Type | Count | Geometric Definition |
|------|-------|---------------------|
| **Standing Wave** | 8 | Vertex to itself (no movement) |
| **Cross-Zero Manifesting** | 16 | Void tetrahedron → Material tetrahedron |
| **Cross-Zero Dematerialising** | 16 | Material tetrahedron → Void tetrahedron |
| **Same-Phase** | 24 | Movement within one tetrahedron |

**Total:** 8 + 16 + 16 + 24 = **64 gates**

---

## Classification Logic

### 1. Standing Wave (8 gates)

Inner trigram = Outer trigram. No movement through the cube.

```
Inner: Thunder (100)
Outer: Thunder (100)
Movement: None — stay at same vertex
```

**Gates:** 1, 2, 29, 30, 51, 52, 57, 58

### 2. Cross-Zero Manifesting (16 gates)

Movement from Void tetrahedron to Material tetrahedron.

```
Inner: Fire (101) — Void tetrahedron
Outer: Earth (000) — Material tetrahedron
Movement: Void → Material (manifestation)
```

**Yang count change:** 2→0, 2→1, or 3→1

### 3. Cross-Zero Dematerialising (16 gates)

Movement from Material tetrahedron to Void tetrahedron.

```
Inner: Thunder (100) — Material tetrahedron
Outer: Heaven (111) — Void tetrahedron
Movement: Material → Void (dissolution)
```

**Yang count change:** 0→2, 1→2, or 1→3

### 4. Same-Phase (24 gates)

Movement within the same tetrahedron.

```
Inner: Wind (011) — Void tetrahedron
Outer: Lake (110) — Void tetrahedron
Movement: Within Void (circulation)
```

**Further split:**
- **Same-Phase Void:** 12 gates (both trigrams in Void tetrahedron)
- **Same-Phase Material:** 12 gates (both trigrams in Material tetrahedron)

---

## The Two Tetrahedra

The cube contains two interpenetrating tetrahedra:

### Void Tetrahedron (Yang Count 2-3)

Vertices: Heaven (111), Wind (011), Fire (101), Lake (110)

### Material Tetrahedron (Yang Count 0-1)

Vertices: Earth (000), Thunder (100), Water (010), Mountain (001)

---

## Classification by Inner/Outer Trigram

| Inner Trigram | Tetrahedron | Outer Trigram | Tetrahedron | Classification |
|---------------|-------------|---------------|-------------|----------------|
| Any | Material | Same | - | Standing Wave |
| Any | Void | Same | - | Standing Wave |
| Any | Material | Different | Material | Same-Phase Material |
| Any | Void | Different | Void | Same-Phase Void |
| Any | Void | Any | Material | Cross-Zero Manifesting |
| Any | Material | Any | Void | Cross-Zero Dematerialising |

---

## The Classification Algorithm

```python
def classify_gate(inner_trigram, outer_trigram):
    """Classify a hexagram by its movement type."""

    if inner_trigram == outer_trigram:
        return "STANDING_WAVE"

    inner_yang = inner_trigram.count('1')
    outer_yang = outer_trigram.count('1')

    inner_void = inner_yang >= 2  # Void: yang count 2 or 3
    outer_void = outer_yang >= 2

    if inner_void == outer_void:
        if inner_void:
            return "SAME_PHASE_VOID"
        else:
            return "SAME_PHASE_MATERIAL"
    else:
        if inner_void:
            return "CROSS_ZERO_MANIFESTING"
        else:
            return "CROSS_ZERO_DEMATERIALISING"
```

---

## Count Verification

| Type | Formula | Count |
|------|---------|-------|
| Standing Wave | 8 trigrams × 1 | 8 |
| Same-Phase Void | 4 void × 3 other void | 12 |
| Same-Phase Material | 4 material × 3 other material | 12 |
| Cross-Zero Manifesting | 4 void × 4 material | 16 |
| Cross-Zero Dematerialising | 4 material × 4 void | 16 |
| **Total** | | **64** |

---

## Physical Interpretation

| Type | Electromagnetic Meaning |
|------|------------------------|
| **Standing Wave** | Resonance — energy held at fixed frequency |
| **Cross-Zero Manifesting** | Energy entering form — void becoming material |
| **Cross-Zero Dematerialising** | Energy leaving form — material becoming void |
| **Same-Phase Void** | Circulation in void domain — potential energy |
| **Same-Phase Material** | Circulation in material domain — kinetic energy |

---

## Relationship to Hamming Distance

| Hamming Distance | Possible Types |
|------------------|----------------|
| 0 (same trigram) | Standing Wave only |
| 1 (one bit flip) | Cross-Zero or Same-Phase |
| 2 (two bit flips) | Cross-Zero or Same-Phase |
| 3 (complement) | Cross-Zero only |

Note: Hamming distance alone doesn't determine type — tetrahedron membership matters.

---

## Wheel Distribution

On the 64-gate wheel:
- **8 standing waves** mark structural anchors
- **32 cross-zero gates** create domain transitions
- **24 same-phase gates** provide circulation within domains

The wheel crosses zero exactly twice per cycle, creating the (2,1) torus knot topology.

---

## Derivability Status

| Element | Status |
|---------|--------|
| 4 classification types | ✓ PROVEN |
| Standing wave count = 8 | ✓ PROVEN |
| Cross-zero count = 32 | ✓ PROVEN |
| Same-phase count = 24 | ✓ PROVEN |
| Geometry matches EM classification | ✓ PROVEN (100% match) |

**The gate classification is fully derivable from cube geometry.**

---

*Extracted from: GEOMETRIC-FOUNDATIONS-SYNTHESIS.md*
*Framework location: docs/framework/hexagram-movements/gate-classification.md*
