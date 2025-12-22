# MOON-NODE AXIS: COMPLETE TEST FRAMEWORK

## The Missing Piece in Our Derivation Models

**Reference:** DERIVATION-STATUS-MAP v3.2  
**Date:** 21 December 2025  
**Status:** UNTESTED — Critical gap identified

---

# PART I: WHAT RA TEACHES ABOUT MOON-NODE

## The Essential Relationship

Ra is explicit: **"The essential relationship is going to be there between only the South Node and the Moon... It does not have anything to do with the North Node."**

This is NOT a symmetric relationship. The Moon connects specifically to the SOUTH Node.

## The Architecture

```
                    PERSONALITY SIDE                 DESIGN SIDE
                    ═══════════════                  ═══════════
                    
                    P-Sun/Earth                      D-Sun/Earth
                        │                                │
                    (INTERNAL)                       (BRAIN SYSTEM)
                        │                                │
                        ▼                                ▼
                    P-North Node ◄──────────────► D-North Node
                        │           (aligned to        │
                    P-South Node ◄── Personality) ─► D-South Node
                        │                                │
                        ▼                          (BRAIN SYSTEM)
                    Bridges to                           │
                    BODY                                 ▼
                                                    MOON
                                                (COORDINATOR)
```

## The Specific Claims

| Claim | Ra's Quote | Testable? |
|-------|------------|-----------|
| Moon-South Node essential | "Essential relationship between only South Node and Moon" | YES |
| Design South Node → Brain | "Only design South Node directly connected to brain system" | YES |
| Design North Node → Personality | "Design North Node is aligned to the personality" | PARTIALLY |
| Moon as coordinator | "Moon aligns the range to the perspective" | YES |
| Base orientation asymmetry | North Node has different Base quadrant than South Node | YES |

---

# PART II: WHAT WE HAVE NOT TESTED

## In Our Planetary Derivation Models

| Element | Tested? | Result |
|---------|---------|--------|
| Vertical character (Alpha/Beta/Gamma) | ✓ YES | VALIDATED (χ²=65.99) |
| Position × Vertical | ✓ YES | Mapped (Wind/Thunder affinities) |
| **Laterals (rows)** | ✗ NO | — |
| **Diamond structure** | ✗ NO | — |
| **Diagonal structure** | ✗ NO | — |
| **Moon-South Node connection** | ✗ NO | — |
| **Brain System (Head/Ajna) patterns** | ✗ NO | — |
| **Link Node crossovers** | ✗ NO | — |

## Why This Matters

The Moon occupies a SPECIAL position in the Magic Square:
- It's at the corner (position 1 in the 3×3)
- It heads the Alpha Vertical (foundation)
- It heads the Mind Lateral (row 1)
- It's on the main diagonal with Mars and Pluto
- It has the ESSENTIAL connection to Nodes

If Moon has special structural properties, they should manifest in exaltation patterns.

---

# PART III: THE BRAIN SYSTEM TEST

## Hypothesis BS1: Moon Shows Distinct Pattern in Brain Gates

Ra says the Design South Node is "directly connected to the brain system."

The Brain System = **Head Centre + Ajna Centre**

### Brain Gates
```
HEAD CENTRE:     64, 61, 63
AJNA CENTRE:     47, 24, 4, 17, 43, 11

TOTAL BRAIN GATES: 9 gates × 6 lines = 54 lines
```

### Test Procedure
```python
BRAIN_GATES = [64, 61, 63, 47, 24, 4, 17, 43, 11]

brain_lines = [line for line in all_lines if line.gate in BRAIN_GATES]
non_brain_lines = [line for line in all_lines if line.gate not in BRAIN_GATES]

# Moon E/D in brain vs non-brain
moon_brain = {
    'exalt': count(brain_lines where exalt_planet == 'Moon'),
    'detriment': count(brain_lines where detriment_planet == 'Moon')
}

moon_non_brain = {
    'exalt': count(non_brain_lines where exalt_planet == 'Moon'),
    'detriment': count(non_brain_lines where detriment_planet == 'Moon')
}

# Chi-square test for Moon × Brain independence
chi_square = calculate_chi_square(moon_brain, moon_non_brain)
```

### Prediction

If Ra's teaching is structurally encoded:
- Moon should show ELEVATED exaltation in Brain gates
- OR Moon should show DISTINCT pattern (not just elevated)

### Success Criterion
- χ² > 3.84 (p < 0.05, df=1) = significant difference
- Effect size: Moon E/D ratio in Brain vs Non-Brain differs by > 30%

---

# PART IV: THE LATERAL TESTS

## Hypothesis L1: Laterals Show Distinct E/D Character

The three rows (laterals) respond to different domains:

| Lateral | Planets | Domain | Response To |
|---------|---------|--------|-------------|
| Mind (Row 1) | Moon, Uranus, Mercury | Mental | Others' minds |
| Body (Row 2) | Venus, Mars, Neptune | Physical | Others' bodies |
| Spirit (Row 3) | Saturn, Jupiter, Pluto | Transcendent | Others' spirit |

### Test Procedure
```python
LATERALS = {
    'mind': ['Moon', 'Uranus', 'Mercury'],
    'body': ['Venus', 'Mars', 'Neptune'],
    'spirit': ['Saturn', 'Jupiter', 'Pluto']
}

lateral_counts = {}
for name, planets in LATERALS.items():
    exalt = sum(1 for line in all_lines if line.exalt_planet in planets)
    detriment = sum(1 for line in all_lines if line.detriment_planet in planets)
    lateral_counts[name] = {'E': exalt, 'D': detriment, 'ratio': exalt/detriment}

# Chi-square for Lateral × E/D independence
chi_square = calculate_3x2_chi_square(lateral_counts)
```

### Prediction

If Laterals carry structural signal:
- Mind Lateral may show distinct pattern in "mental" contexts (Ajna, Head)
- Body Lateral may show distinct pattern in "physical" contexts (Root, Sacral)
- Spirit Lateral may show distinct pattern in "transcendent" contexts (Crown, G)

### Success Criterion
- χ² > 5.99 (p < 0.05, df=2) = significant lateral differences

---

# PART V: THE DIAMOND VS DIAGONAL TEST

## The Two Structures

Ra explicitly distinguishes:

### Diamond (Corners — Mundane Plane)
```
        Mercury
       /       \
    Venus     Neptune
       \       /
        Jupiter
```
"The diamond is related to the way in which we operate on the mundane plane."

### Diagonal (Mars Centre — Transformation)
```
    Moon          Mercury
         \       /
          MARS
         /       \
    Pluto        Saturn
```
"Mars rules the diagonals."

## Hypothesis D1: Diamond vs Diagonal Show Different E/D Patterns

### Test Procedure
```python
DIAMOND = ['Mercury', 'Neptune', 'Jupiter', 'Venus']
DIAGONAL = ['Moon', 'Mars', 'Pluto', 'Saturn']  # Union of both diagonals

diamond_ED = {
    'exalt': count(lines where exalt_planet in DIAMOND),
    'detriment': count(lines where detriment_planet in DIAMOND)
}

diagonal_ED = {
    'exalt': count(lines where exalt_planet in DIAGONAL),
    'detriment': count(lines where detriment_planet in DIAGONAL)
}

# Z-score for difference in E/D ratios
z_score = calculate_z_score(diamond_ED, diagonal_ED)
```

### Predictions

Based on Ra's teaching:
- **Diamond (Venus dominates)**: Should show higher exaltation rate overall (mundane = serving)
- **Diagonal (Mars dominates)**: Should show higher detriment rate (transformation = friction)

We already know Mars has E/D = 0.31 (heavy detriment). 
If Diagonal structure matters, the OTHER diagonal planets (Moon, Pluto, Saturn) should also show detriment bias.

Wait — Saturn has E/D = 2.57 (heavy exalt). This creates a TENSION within the diagonal.

### Refined Prediction

The diagonal may show POLARISATION:
- Main diagonal (Moon-Mars-Pluto): Mixed
- Anti-diagonal (Mercury-Mars-Saturn): Mercury detriment, Mars detriment, Saturn exalt

Test: Do the two diagonals differ from each other?

---

# PART VI: THE LINK NODE CROSSOVER TEST

## Ra's Teaching on Link Nodes

> "The Design Link North Node is the bridge to the mind, to the Personality. It has to make room for the Personality."

> "The Personality Link South Node is where you get the Personality being open to the body."

### The Crossover Structure

```
DESIGN SIDE                      PERSONALITY SIDE
═══════════                      ════════════════

D-Sun/Earth                      P-Sun/Earth
     │                                │
D-North Node ──────────────────► P-Personality
     │        (accommodates)          │
D-South Node                     P-South Node
     │                                │
     └──────────────────────────► P-Body
         (brain system)          (learns from vehicle)
```

### Hypothesis LN1: Link Node Gates Show Cross-Domain Patterns

If the Link Node crossover is structural:
- Gates commonly containing Design North Node may show Personality-relevant planets
- Gates commonly containing Personality South Node may show Body-relevant planets

### Test (Requires Chart Data)

This test requires examining WHERE Nodes typically fall in charts, which may not be testable with Rave I Ching data alone.

**Alternative Test:** Examine if Line 1/6 (hypothesised Nodal axis) shows distinct planetary patterns.

```python
LINE_1_lines = [line for line in all_lines if line.line == 1]
LINE_6_lines = [line for line in all_lines if line.line == 6]

# Do Lines 1 and 6 show distinct Moon patterns?
moon_line1 = count_ED('Moon', LINE_1_lines)
moon_line6 = count_ED('Moon', LINE_6_lines)
moon_other = count_ED('Moon', [l for l in all_lines if l.line not in [1, 6]])

# Chi-square for Moon × Line independence
```

---

# PART VII: THE COMPLETE TEST BATTERY

## Summary of Tests

| Test ID | Structure | Hypothesis | Data Needed | Success Criterion |
|---------|-----------|------------|-------------|-------------------|
| **BS1** | Brain System | Moon elevated in Head/Ajna | Rave I Ching | χ² > 3.84 |
| **L1** | Laterals | Rows show E/D character | Rave I Ching | χ² > 5.99 |
| **L2** | Lateral × Centre | Laterals match centres | Rave I Ching | Interaction p < 0.05 |
| **D1** | Diamond vs Diagonal | Groups differ | Rave I Ching | Z > 1.96 |
| **D2** | Two Diagonals | Main ≠ Anti | Rave I Ching | χ² > 3.84 |
| **LN1** | Link Nodes | Lines 1/6 Moon pattern | Rave I Ching | χ² > 3.84 |

## Implementation Order

1. **BS1 (Brain System)** — Direct test of Ra's "South Node → Brain" claim
2. **L1 (Laterals)** — Complete the Magic Square row analysis
3. **D1 (Diamond/Diagonal)** — Test the two structural groupings
4. **L2 (Lateral × Centre)** — Interaction effects
5. **D2 (Two Diagonals)** — Refined diagonal analysis
6. **LN1 (Link Nodes)** — Line-based proxy for Nodal axis

---

# PART VIII: EXPECTED OUTCOMES

## If Tests Show Signal

Would reveal that the Magic Square has MULTIPLE structural dimensions:
- Verticals = Internal processing character (VALIDATED)
- Laterals = External response character
- Diamond = Mundane plane operation
- Diagonal = Transformation dynamics
- Moon-Node = Coordination mechanism

Combined, these might explain MORE than the ~44% we currently derive.

## If Tests Show NULL

Would confirm:
- Vertical is the ONLY structural element in Magic Square
- Laterals, Diamond, Diagonal operate on RESONANCE (activation), not ASSIGNMENT
- The ~44% derivation boundary is genuine
- Moon-Node operates through coordination/resonance, not fixed assignments

---

# PART IX: OUTPUT SPECIFICATION

## Reports to Generate

```
/docs/research/planetary/moon-node-investigation/
├── BRAIN-SYSTEM-ANALYSIS.md
├── LATERAL-ANALYSIS.md
├── DIAMOND-DIAGONAL-ANALYSIS.md
├── LINE-1-6-ANALYSIS.md
└── COMPLETE-SYNTHESIS.md
```

## Update Derivation Map

After tests, add to DERIVATION-STATUS-MAP:

```markdown
### Magic Square Complete Analysis

| Structure | Tested | Result |
|-----------|--------|--------|
| Vertical (Alpha/Beta/Gamma) | ✓ | VALIDATED (χ²=65.99) |
| Lateral (Mind/Body/Spirit) | ✓ | [RESULT] |
| Diamond vs Diagonal | ✓ | [RESULT] |
| Moon-Brain Connection | ✓ | [RESULT] |
| Line 1/6 Nodal Axis | ✓ | [RESULT] |
```

---

**END OF FRAMEWORK**

*This framework completes the Magic Square testing. If Laterals, Diamond/Diagonal, and Moon-Node all show NULL, it confirms Vertical character is the ONLY structural element.*
