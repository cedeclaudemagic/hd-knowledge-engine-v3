# Phase 2: Hypothesis Testing - Nuclear Hierarchy Research

**Generated**: 2025-12-18

## Overview

This report tests four hypotheses using permutation testing (1000 permutations each).

**Significance threshold**: Z ≥ 2.0 (p < 0.05)
**Bonferroni-corrected threshold**: Z ≥ 2.64 (for 12 Mystery families at α = 0.05)

---

## Test Results Summary

| Test | Hypothesis | Z-Score | Significant? |
|------|------------|---------|--------------|
| 2.1 | Family Coherence | 1.90 | no |
| 2.2 | Elemental Correspondence | 1.98 | no |
| 2.3 | Hierarchy Depth Effect | 1.93 | no |
| 2.4 | Inverse Patterns | 0.93 | no |
| 2.5 | Polarity Score | 7.23 | **YES** |

---

## Test 2.1: Family Coherence

**Hypothesis**: Gates in the same Mystery family share exaltation planets more than random expectation.

**Method**:
- For each Mystery, count how many planet types appear ≥3 times across its 4 Letter gates (24 lines)
- Calculate coherence score = (planets appearing ≥3 times) / (planets appearing ≥1 time)
- Compare to 1000 permutations where gate-to-Mystery assignments are randomized

**Results**:
- Observed coherence: 0.5075
- Permuted mean: 0.4452
- **Z-score: 1.90**

**Interpretation**: NOT SIGNIFICANT: Mystery families do not show unusual planetary coherence

---

## Test 2.2: Elemental Correspondence

**Hypothesis**: Predicted elemental planets cluster in their assigned Pillars.

**Predictions**:
| Pillar | Element | Predicted Planets |
|--------|---------|-------------------|
| 1 | Fire | Sun, Mars |
| 2 | Water | Moon, Venus |
| 63 | Truth | Saturn, Pluto |
| 64 | Light | Uranus, Mercury, Jupiter |

**Method**:
- Calculate ratio of (actual predicted planet proportion) / (expected if uniform)
- Ratio >1.0 means predicted planets appear more than chance
- Combined score = product of all four ratios
- Compare to 1000 permutations where Pillar labels are shuffled

**Results**:

| Pillar | Ratio | Interpretation |
|--------|-------|----------------|
| Fire (1) | 1.38x | **Above chance** |
| Water (2) | 1.55x | **Above chance** |
| Truth (63) | 1.43x | **Above chance** |
| Light (64) | 0.93x | Near chance |

- Combined score: 2.8219
- Permuted mean: 1.4041
- **Z-score: 1.98**

**Interpretation**: NOT SIGNIFICANT: Elemental correspondences are not stronger than chance

---

## Test 2.3: Hierarchy Depth Effect

**Hypothesis**: Planetary diversity (entropy) increases with hierarchy depth.

**Expected pattern**: Pillars (most constrained) < Mysteries < Letters (most diverse)

**Method**:
- Calculate Shannon entropy of planet distribution at each level
- Score based on monotonic increase + magnitude of difference
- Compare to 1000 permutations where level labels are randomized

**Results**:
- Pillar entropy: 2.855
- Mystery entropy: 3.026
- Letter entropy: 3.362
- Monotonic? **YES**
- **Z-score: 1.93**

**Interpretation**: NOT SIGNIFICANT: No evidence of depth-related diversity pattern

---

## Test 2.4: Inverse Patterns (Exaltation/Detriment Complementarity)

**Hypothesis**: Exaltation and detriment distributions show inverse patterns—planets that exalt strongly in a Pillar show fewer detriments there.

**Method**:
- For each planet, correlate exaltation counts with detriment counts across Pillars
- Negative correlation = inverse pattern (planet "belongs" in high-exalt Pillars)
- Compare to 1000 permutations where exalt/detri labels are randomly swapped

**Results**:
- Observed inverse score: 0.0053
- Permuted mean: 0.0023
- **Z-score: 0.93**

**Planet-by-Planet Analysis** (planets with ≥4 exaltations and ≥4 detriments):

| Planet | Max Exalt Pillar | Min Detri Pillar | Inverse Match? |
|--------|------------------|------------------|----------------|
| Sun | Water | Water | **YES** |
| Moon | Light | Water | no |
| Mercury | Water | Truth | no |
| Venus | Water | Truth | no |
| Mars | Fire | Water | no |
| Jupiter | Fire | Water | no |
| Saturn | Water | Fire | no |
| Uranus | Light | Fire | no |
| Neptune | Truth | Truth | **YES** |
| Pluto | Fire | Light | no |
| Earth | Truth | Fire | no |

**Interpretation**: NOT SIGNIFICANT: No systematic inverse relationship between exalt and detri

---

## Test 2.5: Polarity Score (Exalt - Detri per Pillar)

**Hypothesis**: Planets show systematic affinity (high exalt, low detri) or aversion (low exalt, high detri) to specific Pillars.

**Method**:
- For each planet, calculate polarity = (exaltation count - detriment count) per Pillar
- Polarity strength = sum of |polarity| across all 4 Pillars
- High polarity strength = planet concentrates +/- in specific Pillars
- Compare total polarity strength to 1000 permutations where exalt/detri labels are randomly swapped

**Results**:
- Total observed polarity strength: 268.0
- Permuted mean: 142.2
- **Z-score: 7.23**

**Top 5 Most Polarized Planets**:

| Planet | Strength | Fire (1) | Water (2) | Truth (63) | Light (64) |
|--------|----------|----------|-----------|------------|------------|
| Mars | 65 | -13 | -11 | -21 | -20 |
| Sun | 43 | +10 | +16 | +12 | +5 |
| Mercury | 29 | -7 | -10 | -3 | -9 |
| Pluto | 26 | +9 | -8 | +7 | +2 |
| Venus | 22 | -7 | +4 | +3 | +8 |

**Complete Polarity Table**:

| Planet | Fire | Water | Truth | Light | Strength |
|--------|------|-------|-------|-------|----------|
| Mars | -13 | -11 | -21 | -20 | 65 |
| Sun | +10 | +16 | +12 | +5 | 43 |
| Mercury | -7 | -10 | -3 | -9 | 29 |
| Pluto | +9 | -8 | +7 | +2 | 26 |
| Venus | -7 | +4 | +3 | +8 | 22 |
| Saturn | +7 | +7 | +4 | +4 | 22 |
| Neptune | -3 | +2 | +7 | +5 | 17 |
| Uranus | +3 | -4 | +2 | +5 | 14 |
| Moon | +1 | +4 | -4 | +3 | 12 |
| Jupiter | -1 | +6 | -2 | +0 | 9 |
| Earth | +1 | -6 | -1 | -1 | 9 |

**Interpretation**: SIGNIFICANT: Planets show systematic affinity/aversion to specific Pillars

---

## Overall Assessment


### Signal Detected

At least one test shows significant results (Z ≥ 2.0). This suggests the nuclear hierarchy may encode information relevant to planetary assignments.

**Recommendation**: Proceed to Phase 3 (Predictive Modelling) to determine if hierarchy features improve prediction accuracy.


### Decision Point

- Tests with Z ≥ 2.0: 1/5
- Tests with Z ≥ 1.5 (trend): 4/5

**→ Proceed to Phase 3**

---

*Report generated by: nuclear-hierarchy-phase2-hypothesis.js*
