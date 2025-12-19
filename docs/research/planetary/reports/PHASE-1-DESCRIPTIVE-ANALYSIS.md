# Phase 1: Descriptive Analysis - Nuclear Hierarchy Research

**Generated**: 2025-12-18

## Overview

This report characterises planetary distributions across the nuclear hierarchy without making predictive claims.

**Data Sources**:
- Nuclear hierarchy: `knowledge-systems/nuclear-hierarchy/mappings/nuclear-hierarchy-mappings.json`
- Planetary assignments: `knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json`

**Dataset**: 384 line records (64 gates × 6 lines)

---

## Sanity Check: Example Gates

### Gate 1 - Beauty
- **Level**: pillar
- **Pillar**: 1 (Fire)
- **Mystery**: N/A (is Pillar/Mystery)
- **Element**: Fire
- **Gate Type**: standing-wave

| Line | Exaltation | Detriment |
|------|------------|----------|
| 1 | Moon | Uranus |
| 2 | Venus | Mars |
| 3 | Mars | Earth |
| 4 | Earth | Jupiter |
| 5 | Mars | Uranus |
| 6 | Earth | Pluto |

### Gate 30 - Rapture
- **Level**: letter
- **Pillar**: 1 (Fire)
- **Mystery**: 28
- **Element**: Fire
- **Gate Type**: standing-wave

| Line | Exaltation | Detriment |
|------|------------|----------|
| 1 | Sun | Jupiter |
| 2 | Sun | Mars |
| 3 | Pluto | Jupiter |
| 4 | Pluto | Jupiter |
| 5 | Jupiter | Pluto |
| 6 | Mars | Moon |

### Gate 63 - Truth
- **Level**: pillar
- **Pillar**: 63 (Truth)
- **Mystery**: N/A (is Pillar/Mystery)
- **Element**: Truth
- **Gate Type**: cross-zero-dematerialising

| Line | Exaltation | Detriment |
|------|------------|----------|
| 1 | Sun | Mars |
| 2 | Jupiter | Uranus |
| 3 | Jupiter | Saturn |
| 4 | Mercury | Mars |
| 5 | Sun | Mars |
| 6 | Jupiter | Pluto |

### Gate 55 - Freedom
- **Level**: letter
- **Pillar**: 1 (Fire)
- **Mystery**: 28
- **Element**: Fire
- **Gate Type**: cross-zero-manifesting

| Line | Exaltation | Detriment |
|------|------------|----------|
| 1 | Jupiter | Venus |
| 2 | Venus | Earth |
| 3 | Saturn | Mars |
| 4 | Jupiter | Mars |
| 5 | Uranus | Sun |
| 6 | Saturn | Moon |

---

## Frequency Tables

### Planet × Pillar (Exaltation)

```
              │ Fire(1) │ Water(2) │ Truth(63) │ Light(64) │ Total
──────────────┼─────────┼──────────┼───────────┼───────────┼──────
Sun           │      15 │       17 │        15 │         9 │    56
Moon          │      11 │       12 │        10 │        14 │    47
Mercury       │       2 │        5 │         2 │         5 │    14
Venus         │       6 │       15 │        10 │        15 │    46
Mars          │       9 │        9 │         5 │         6 │    29
Jupiter       │      13 │       13 │         8 │        12 │    46
Saturn        │       9 │       12 │         9 │         6 │    36
Uranus        │       5 │        2 │         4 │         7 │    18
Neptune       │       4 │        6 │        10 │         9 │    29
Pluto         │      16 │        2 │        16 │         8 │    42
Earth         │       6 │        3 │         7 │         4 │    20
──────────────┼─────────┼──────────┼───────────┼───────────┼──────
TOTAL         │      96 │       96 │        96 │        95 │   383
```

### Planet × Pillar (Detriment)

```
              │ Fire(1) │ Water(2) │ Truth(63) │ Light(64) │ Total
──────────────┼─────────┼──────────┼───────────┼───────────┼──────
Sun           │       5 │        1 │         3 │         4 │    13
Moon          │      10 │        8 │        14 │        11 │    43
Mercury       │       9 │       15 │         5 │        14 │    43
Venus         │      13 │       11 │         7 │         7 │    38
Mars          │      22 │       20 │        26 │        26 │    94
Jupiter       │      14 │        7 │        10 │        12 │    43
Saturn        │       2 │        5 │         5 │         2 │    14
Uranus        │       2 │        6 │         2 │         2 │    12
Neptune       │       7 │        4 │         3 │         4 │    18
Pluto         │       7 │       10 │         9 │         6 │    32
Earth         │       5 │        9 │         8 │         5 │    27
──────────────┼─────────┼──────────┼───────────┼───────────┼──────
TOTAL         │      96 │       96 │        92 │        93 │   377
```

### Planet × Hierarchy Level (Exaltation)

Lines per level: Pillars (4 gates × 6 lines = 24), Mysteries (12 gates × 6 = 72), Letters (48 gates × 6 = 288)

```
              │ Pillar │ Mystery │ Letter │ Total
──────────────┼────────┼─────────┼────────┼──────
Sun           │      2 │      11 │     43 │    56
Moon          │      2 │      13 │     32 │    47
Mercury       │      4 │       1 │      9 │    14
Venus         │      6 │       4 │     36 │    46
Mars          │      2 │       4 │     23 │    29
Jupiter       │      4 │      11 │     31 │    46
Saturn        │      2 │       6 │     28 │    36
Uranus        │      0 │       3 │     15 │    18
Neptune       │      0 │       4 │     25 │    29
Pluto         │      0 │      14 │     28 │    42
Earth         │      2 │       0 │     18 │    20
──────────────┼────────┼─────────┼────────┼──────
TOTAL         │     24 │      71 │    288 │   383
```

### Planet × Hierarchy Level (Detriment)

Lines per level: Pillars (4 gates × 6 lines = 24), Mysteries (12 gates × 6 = 72), Letters (48 gates × 6 = 288)

```
              │ Pillar │ Mystery │ Letter │ Total
──────────────┼────────┼─────────┼────────┼──────
Sun           │      0 │       3 │     10 │    13
Moon          │      2 │       7 │     34 │    43
Mercury       │      0 │       4 │     39 │    43
Venus         │      1 │       8 │     29 │    38
Mars          │      9 │      20 │     65 │    94
Jupiter       │      2 │       7 │     34 │    43
Saturn        │      2 │       2 │     10 │    14
Uranus        │      4 │       0 │      8 │    12
Neptune       │      0 │       4 │     14 │    18
Pluto         │      2 │       5 │     25 │    32
Earth         │      2 │       9 │     16 │    27
──────────────┼────────┼─────────┼────────┼──────
TOTAL         │     24 │      69 │    284 │   377
```

### Planet × Mystery (Exaltation)

Mystery families (4 Letter gates each = 24 lines per Mystery):

```
              │  23 │  24 │  27 │  28 │  37 │  38 │  39 │  40 │  43 │  44 │  53 │  54 │ Total
──────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼──────
Sun           │   6 │   3 │   4 │   4 │   2 │   1 │   4 │   3 │   4 │   5 │   3 │   4 │    43
Moon          │   3 │   3 │   2 │   3 │   2 │   7 │   2 │   1 │   3 │   3 │   1 │   2 │    32
Mercury       │   0 │   2 │   1 │   0 │   2 │   0 │   1 │   0 │   1 │   0 │   1 │   1 │     9
Venus         │   5 │   4 │   3 │   2 │   4 │   4 │   2 │   3 │   2 │   1 │   3 │   3 │    36
Mars          │   3 │   2 │   3 │   1 │   0 │   2 │   3 │   1 │   3 │   1 │   2 │   2 │    23
Jupiter       │   3 │   3 │   0 │   3 │   2 │   1 │   4 │   4 │   3 │   5 │   3 │   0 │    31
Saturn        │   1 │   3 │   6 │   4 │   3 │   0 │   1 │   3 │   4 │   0 │   1 │   2 │    28
Uranus        │   0 │   0 │   2 │   4 │   2 │   1 │   1 │   0 │   0 │   0 │   4 │   1 │    15
Neptune       │   2 │   2 │   2 │   1 │   1 │   4 │   2 │   2 │   0 │   3 │   3 │   3 │    25
Pluto         │   0 │   0 │   1 │   2 │   3 │   4 │   3 │   4 │   2 │   4 │   2 │   3 │    28
Earth         │   1 │   2 │   0 │   0 │   1 │   1 │   1 │   3 │   2 │   2 │   2 │   3 │    18
```

---

## Statistical Analysis

### Chi-Square Test for Uniformity

Testing whether planetary distributions across Pillars differ from uniform expectation.

#### Exaltation Distribution by Pillar

| Pillar | Observed | Expected | (O-E)²/E |
|--------|----------|----------|----------|
| Fire (1) | 96 | 95.8 | 0.001 |
| Water (2) | 96 | 95.8 | 0.001 |
| Truth (63) | 96 | 95.8 | 0.001 |
| Light (64) | 95 | 95.8 | 0.006 |
| **Total** | 383 | 383 | **χ² = 0.008** |

**Degrees of freedom**: 3
**Critical value (p=0.05)**: 7.815
**Result**: NOT SIGNIFICANT - No evidence pillars differ from uniform

#### Per-Planet Chi-Square (across Pillars)

| Planet | χ² | df | Significant? |
|--------|-----|----|--------------|
| Sun | 2.57 | 3 | no |
| Moon | 0.74 | 3 | no |
| Mercury | 2.57 | 3 | no |
| Venus | 4.96 | 3 | no |
| Mars | 1.76 | 3 | no |
| Jupiter | 1.48 | 3 | no |
| Saturn | 2.00 | 3 | no |
| Uranus | 2.89 | 3 | no |
| Neptune | 3.14 | 3 | no |
| Pluto | 13.24 | 3 | **YES** |
| Earth | 2.00 | 3 | no |

---

## Observed Patterns

### Dominant Planets by Pillar (Exaltation)

Top 3 planets by frequency in each Pillar:

**Fire (Pillar 1)**:
1. Pluto: 16 (16.7%)
2. Sun: 15 (15.6%)
3. Jupiter: 13 (13.5%)

**Water (Pillar 2)**:
1. Sun: 17 (17.7%)
2. Venus: 15 (15.6%)
3. Jupiter: 13 (13.5%)

**Truth (Pillar 63)**:
1. Pluto: 16 (16.7%)
2. Sun: 15 (15.6%)
3. Moon: 10 (10.4%)

**Light (Pillar 64)**:
1. Venus: 15 (15.8%)
2. Moon: 14 (14.7%)
3. Jupiter: 12 (12.6%)

### Elemental Correspondence Check

Testing proposed elemental → planet correspondences:

| Pillar | Predicted Planets | Predicted Count | Actual Count | Match? |
|--------|-------------------|-----------------|--------------|--------|
| Fire (1) | Sun, Mars | 17.5 | 24 | **YES** (1.38x) |
| Water (2) | Moon, Venus | 17.5 | 27 | **YES** (1.55x) |
| Truth (63) | Saturn, Pluto | 17.5 | 25 | **YES** (1.43x) |
| Light (64) | Uranus, Mercury, Jupiter | 25.9 | 24 | partial (0.93x) |

**Interpretation**: Values >1.0 indicate predicted planets appear more than expected by chance.

---

## Summary

### Key Findings

1. **Data Merge**: Successfully merged 384 line records with hierarchy positions
2. **Distribution**: See tables above for complete frequency counts
3. **Chi-Square**: See statistical analysis for uniformity tests
4. **Elemental Correspondence**: See pattern observations for preliminary check

### Recommendation for Phase 2

Based on the descriptive statistics above, Phase 2 hypothesis testing should proceed to determine statistical significance using permutation tests.

---

*Report generated by: nuclear-hierarchy-phase1-descriptive.js*
