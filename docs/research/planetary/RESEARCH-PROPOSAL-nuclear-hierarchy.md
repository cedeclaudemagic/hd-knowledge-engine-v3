# Research Proposal: Nuclear Hierarchy as a Structural Key for Planetary Assignments

## A Systematic Investigation into Whether Nuclear Hexagram Relationships Provide Derivable Patterns for Cross-Zero Planetary Exaltations

---

## Executive Summary

This proposal outlines a rigorous investigation into whether the nuclear hexagram hierarchy—the fractal structure revealed through successive nuclear transformation of the 64 hexagrams—provides a derivable framework for understanding planetary exaltation and detriment assignments in cross-zero gates.

Our previous research established that:
- **Standing wave gates** (8 gates, 47 lines): 100% derivable from electromagnetic coordinates
- **Cross-zero gates** (32 gates, ~190 lines): Only 18% predictable; additional factors unknown

We have ruled out:
- Nuclear trigrams as direct predictors (Z = 0.09, no signal)
- Russell wave mechanics (Z = -2.96, negative signal)
- Musical harmonic relationships (no improvement over baseline)
- Threshold crossing dynamics (no improvement)

This proposal tests a different application of nuclear relationships: not the nuclear trigrams within a single hexagram, but the **hierarchical family structure** created when all 64 hexagrams are organised by their nuclear relationships into the 4 Pillars, 12 Mysteries, and 48 Letters.

**Critical Distinction**: We previously tested whether a gate's *own* nuclear trigrams predict its planets. This proposal tests whether a gate's *position in the nuclear family tree* correlates with planetary patterns shared across family members.

---

## Part 1: Theoretical Basis

### 1.1 The Nuclear Hierarchy Structure

The nuclear hexagram is formed by extracting lines 2-3-4 (lower nuclear trigram) and lines 3-4-5 (upper nuclear trigram) from any hexagram. When this process is applied recursively to all 64 hexagrams, a fractal hierarchy emerges:

```
Level 0: 64 Hexagrams (the complete set)
    ↓ nuclear transformation
Level 1: 16 Nuclear Hexagrams (4 Pillars + 12 Mysteries)
    ↓ nuclear transformation  
Level 2: 4 Pillars (Gates 1, 2, 63, 64)
    ↓ nuclear transformation
Level 3: 2 Pairs (1↔2, 63↔64 are their own nuclears)
```

This creates a tree structure where:
- **4 Pillars** are the roots (Gates 1, 2, 63, 64)
- **12 Mysteries** are intermediate nodes (each contains 4 Letters)
- **48 Letters** are the leaves (the remaining hexagrams)

### 1.2 The Electromagnetic Framework (Established)

Our previous research established that trigrams map to wave positions:

| Trigram | Position | Domain | Function |
|---------|----------|--------|----------|
| Heaven ☰ | -4 | Void | Source/Grounding |
| Lake ☱ | -3 | Void | Capacitance |
| Fire ☲ | -2 | Void | Voltage |
| Wind ☴ | -1 | Void | Gate Out |
| Thunder ☳ | +1 | Material | Gate In |
| Water ☵ | +2 | Material | Current |
| Mountain ☶ | +3 | Material | Storage |
| Earth ☷ | +4 | Material | Sink |

Hexagrams are movements between positions, classified as:
- **Standing Waves**: Same inner and outer trigram (8 gates)
- **Cross-Zero**: Inner and outer on opposite sides of zero (32 gates)
- **Same-Side**: Inner and outer on same side of zero (24 gates)

### 1.3 The Observation That Prompted This Investigation

When we mapped the 8 standing wave gates to the nuclear hierarchy, a striking pattern emerged:

| Pillar | Element | Standing Waves | EM Positions |
|--------|---------|----------------|--------------|
| 1 (Fire) | Fire | Gates 1, 30 | -4, -2 |
| 2 (Water) | Water | Gates 2, 29 | +4, +2 |
| 63 (Truth) | Truth | Gates 52, 57 | +3, -1 |
| 64 (Light) | Light | Gates 51, 58 | +1, -3 |

Each Pillar contains exactly 2 standing waves, and their electromagnetic positions show functional coherence:
- Fire Pillar: Source positions (poles of void domain)
- Water Pillar: Sink positions (poles of material domain)
- Truth Pillar: Restraint positions (storage + discrimination)
- Light Pillar: Threshold positions (gates + capacitance)

This non-random distribution suggests the nuclear hierarchy may encode information that correlates with—but is distinct from—electromagnetic position.

### 1.4 The Core Hypothesis

**Primary Hypothesis**: The nuclear hierarchy represents a dimension of organisation orthogonal to electromagnetic position. If planetary assignments encode "guidance through transformation," then:
- Electromagnetic position determines **what** transformation occurs
- Nuclear hierarchy may determine **from what source** or **at what depth** that guidance flows

**Testable Prediction**: Gates that share a Mystery parent (or Pillar grandparent) will show shared planetary patterns that are NOT explained by electromagnetic position alone.

---

## Part 2: Research Framework

### 2.1 What We Mean by "Derivation"

**Derivation** means: Given ONLY the structural properties (hierarchy position, electromagnetic coordinates), we can PREDICT planetary assignments with accuracy significantly above chance AND above what electromagnetic position alone provides.

**Fitting** means: We find correlations after the fact that don't generalise to unseen data.

### 2.2 The Derivation Standard

For any pattern to qualify as "derived" rather than "fitted," it must satisfy:

1. **Cross-Validation**: Predictions must work on held-out data (leave-one-out or k-fold)
2. **Statistical Significance**: Z-score ≥ 2.0 (p < 0.05) against permuted baseline
3. **Incremental Value**: Must improve on electromagnetic-only baseline
4. **Parsimony**: The rule must be simpler than the data it explains

### 2.3 The Null Hypothesis

**H₀**: Nuclear hierarchy position provides no additional predictive power for planetary assignments beyond electromagnetic coordinates.

If true:
- Adding hierarchy features will not improve cross-validated accuracy
- Planetary distributions within families will match random expectation
- Any apparent patterns will not survive permutation testing

### 2.4 Success Criteria

| Outcome | Interpretation | Criteria |
|---------|----------------|----------|
| **Full Derivation** | Hierarchy provides complete additional key | >70% accuracy on cross-zero gates with hierarchy features |
| **Partial Derivation** | Hierarchy provides meaningful but incomplete signal | 30-70% accuracy AND Z > 2.0 AND improvement over baseline |
| **Weak Signal** | Some structure but not practically useful | Z > 2.0 but <30% accuracy |
| **No Signal** | Hierarchy does not help | Z < 2.0 or no improvement over baseline |
| **Negative Signal** | Hierarchy confounds prediction | Accuracy decreases when hierarchy added |

---

## Part 3: Methodology

### 3.1 Data Requirements

**Source Data**:
- Complete Rave I'Ching planetary assignments (64 gates × 6 lines × exaltation + detriment)
- Expected: ~384 exaltation positions, ~384 detriment positions
- Some positions lack exaltation or detriment (anomalies already documented)

**Derived Data**:
- Electromagnetic classification for each gate (position, gate type, movement direction)
- Nuclear hierarchy position for each gate (Pillar, Mystery, Letter level; parent assignments)

### 3.2 Phase 1: Descriptive Analysis

**Objective**: Characterise planetary distributions across the nuclear hierarchy without predictive claims.

**Methods**:

1. **Pillar-Level Distribution**
   - For each Pillar (1, 2, 63, 64), count frequency of each planet in exaltation
   - Calculate expected frequency under null (uniform distribution)
   - Visualise: Heatmap of Planet × Pillar
   - Report: Chi-square test for deviation from uniform

2. **Mystery-Level Distribution**
   - For each of 12 Mysteries, count planet frequencies
   - Compare within-family variance to between-family variance
   - Report: ANOVA or Kruskal-Wallis for planet clustering by Mystery

3. **Standing Wave vs. Cross-Zero Within Families**
   - For each Mystery containing both types, compare their planet profiles
   - Question: Do standing waves and cross-zero gates in the same family share planets?

**Deliverable**: Descriptive statistics document with visualisations.

### 3.3 Phase 2: Hypothesis Testing

**Objective**: Determine if hierarchy provides statistically significant signal.

**Test 2.1: Family Coherence**

*Hypothesis*: Gates in the same Mystery family share planets more than random expectation.

*Method*:
1. For each Mystery (12 total), list all exalting planets across its 4 Letter gates (up to 24 positions)
2. Calculate the "coherence score" = number of planet types that appear ≥3 times / total planet types
3. Compare observed coherence to permuted baseline (shuffle gate-to-Mystery assignments 1000 times)
4. Report: Mean coherence, Z-score, p-value

*Success Threshold*: Z ≥ 2.0

**Test 2.2: Elemental Correspondence**

*Hypothesis*: Pillar elements correlate with planetary domains.

*Predicted Correspondences*:
- Fire (Pillar 1): Sun, Mars dominant
- Water (Pillar 2): Moon, Venus dominant
- Truth (Pillar 63): Saturn, Pluto dominant
- Light (Pillar 64): Uranus, Mercury, Jupiter dominant

*Method*:
1. For each Pillar, calculate proportion of each planet
2. Define "elemental planets" for each Pillar (as above)
3. Calculate ratio: elemental planets / non-elemental planets
4. Compare to null expectation (uniform = 1.0)
5. Permutation test: Shuffle Pillar assignments 1000 times

*Success Threshold*: All four Pillars show predicted bias at Z ≥ 2.0

**Test 2.3: Hierarchy Depth Effect**

*Hypothesis*: Planetary diversity increases with hierarchy depth (Pillars most constrained, Letters most varied).

*Method*:
1. Calculate entropy of planet distribution at each level:
   - Pillars (4 gates)
   - Mysteries (12 gates)
   - Letters (48 gates)
2. Test: Does entropy increase monotonically with depth?
3. Permutation test for significance

*Success Threshold*: Monotonic increase with Z ≥ 2.0

### 3.4 Phase 3: Predictive Modelling

**Objective**: Determine if hierarchy improves prediction of cross-zero planetary assignments.

**Baseline Model** (from previous research):
- Features: (electromagnetic_position, line_number, gate_type)
- Method: Lookup table with most-frequent-planet prediction
- Cross-validated accuracy on cross-zero gates: ~18%

**Hierarchy-Enhanced Models**:

*Model A: Pillar Feature*
- Features: (em_position, line, gate_type, **pillar**)
- Test: Does adding Pillar improve accuracy?

*Model B: Mystery Feature*
- Features: (em_position, line, gate_type, **mystery**)
- Test: Does adding Mystery improve accuracy?

*Model C: Full Hierarchy*
- Features: (em_position, line, gate_type, pillar, mystery, **hierarchy_level**)
- Test: Does full hierarchy context improve accuracy?

*Model D: Hierarchy-Only*
- Features: (pillar, mystery, hierarchy_level, line)
- Test: Can hierarchy predict WITHOUT electromagnetic position?

**Validation Method**: Leave-one-out cross-validation (LOOCV)

**Overfitting Guard**: 
- Track group sizes; reject any model where mean group size < 3
- Compare cross-validated accuracy to training accuracy
- Require CV accuracy to be within 10 percentage points of training accuracy

**Success Thresholds**:

| Model | Baseline to Beat | Minimum for "Derivation" |
|-------|------------------|--------------------------|
| A, B, C | 18% (EM-only) | >25% AND Z > 2.0 vs permuted |
| D | Random (~8%) | >20% AND Z > 2.0 |

### 3.5 Phase 4: Standing Wave Inheritance

**Objective**: Test whether standing waves within a family "inform" their cross-zero siblings.

**Rationale**: Standing waves are 100% derivable. If the hierarchy encodes planetary inheritance, the standing wave in each family might provide a reference that its cross-zero siblings modify or share.

**Method**:

1. Identify families containing at least one standing wave:
   - Mystery 28 (under Pillar 1): Contains Gate 30 (standing wave)
   - Mystery 27 (under Pillar 2): Contains Gate 29 (standing wave)
   - Mystery 40 (under Pillar 63): Contains Gate 52 (standing wave)
   - Mystery 54 (under Pillar 63): Contains Gate 57 (standing wave)
   - Mystery 37 (under Pillar 64): Contains Gate 58 (standing wave)
   - Mystery 39 (under Pillar 64): Contains Gate 51 (standing wave)

2. For each such family:
   - Extract planet profile of the standing wave gate
   - Extract planet profiles of the cross-zero siblings
   - Calculate "inheritance score" = overlap between standing wave planets and sibling planets

3. Compare to baseline: What's the expected overlap for random gate pairs?

4. Permutation test: Shuffle family assignments 1000 times

**Success Threshold**: Inheritance score significantly higher than random (Z ≥ 2.0)

### 3.6 Phase 5: Interpretive Synthesis

**Objective**: If significant patterns are found, articulate the derivable principle.

**Requirements for a Valid Principle**:

1. **Statable**: Can be expressed in a single sentence or simple rule
2. **Testable**: Makes predictions that can be verified
3. **Parsimonious**: Simpler than listing all assignments
4. **Generative**: Could produce assignments for hypothetical new gates

**Example of Valid Principle**:
> "Within each Mystery family, the dominant planet of the standing wave gate (if present) or the Pillar's elemental planet (if not) appears in at least 4 of the 6 lines of each cross-zero gate."

**Example of Invalid "Principle"**:
> "Gates 30, 55, 56 have Mars/Venus/Sun in lines 1-3 except when the Mystery is odd-numbered, in which case..."
(This is just re-encoding the data, not deriving it.)

---

## Part 4: Scope and Boundaries

### 4.1 What This Research Will Address

1. Whether nuclear hierarchy adds predictive power beyond electromagnetic position
2. Whether planetary patterns cluster by family groupings
3. Whether elemental (Fire/Water/Truth/Light) qualities correlate with planetary domains
4. Whether standing waves serve as "reference points" for family planetary patterns
5. Whether a simple, derivable principle exists that the hierarchy reveals

### 4.2 What This Research Will NOT Address

1. The origin or validity of the Rave I'Ching assignments themselves
2. Whether the nuclear hierarchy is the "correct" or "only" way to organise hexagrams
3. Metaphysical claims about consciousness or transformation
4. Gene Keys interpretations beyond the structural mappings
5. Same-side gates (focus is on the unsolved cross-zero layer)

### 4.3 Constraints and Limitations

1. **Sample Size**: Only ~190 cross-zero exaltation positions exist. This limits statistical power.
2. **Multiple Testing**: With 4 Pillars, 12 Mysteries, 13 planets, many comparisons are possible. We must apply Bonferroni correction or control false discovery rate.
3. **Data Dependency**: All data comes from a single source (Rave I'Ching). No independent replication is possible.
4. **Theoretical Priors**: The elemental correspondences (Fire→Sun, etc.) are speculative. We must distinguish finding what we expected from finding what the data shows.

### 4.4 Risk of False Discovery

Given the complexity of the data and the number of possible patterns, there is substantial risk of finding "patterns" that are artifacts of multiple testing or overfitting.

**Mitigation Strategies**:
1. Pre-register hypotheses before looking at planet data (this proposal serves that function)
2. Use cross-validation for ALL predictive claims
3. Require Z ≥ 2.0 for statistical significance
4. Apply Bonferroni correction for multiple comparisons
5. Prioritise simple patterns over complex ones
6. Report ALL tests, not just significant ones

---

## Part 5: Expected Outcomes

### 5.1 Scenario A: Full Derivation (Optimistic)

**What It Would Look Like**:
- Hierarchy-enhanced model achieves >70% accuracy on cross-zero gates
- Clear elemental correspondences (Fire→Sun, etc.) confirmed
- Simple inheritance rules from standing waves to cross-zero siblings
- A statable principle that generates correct predictions

**Implications**:
- The "empirical layer" is smaller than previously thought
- The EM framework extends into cross-zero via hierarchy
- Planetary assignments become ~85% derivable overall

### 5.2 Scenario B: Partial Derivation (Realistic)

**What It Would Look Like**:
- Hierarchy adds 10-20 percentage points to accuracy (30-40% total)
- Some families show clear coherence, others do not
- Elemental correspondences hold for 2-3 Pillars
- Some principles emerge but with exceptions

**Implications**:
- Hierarchy provides a "coarse filter" for planetary possibilities
- Fine-grained assignments remain empirical
- The system has three layers: EM-derivable, hierarchy-constrained, empirical

### 5.3 Scenario C: No Signal (Pessimistic)

**What It Would Look Like**:
- Hierarchy adds no predictive power
- Family coherence is no better than random
- Elemental correspondences fail permutation tests
- Cross-validated accuracy remains at baseline

**Implications**:
- Nuclear hierarchy is not the key to cross-zero variance
- The observation about standing wave distribution was coincidence
- The empirical conclusion stands: transformation layer is irreducibly channeled

### 5.4 Scenario D: Negative Signal (Diagnostic)

**What It Would Look Like**:
- Adding hierarchy features DECREASES accuracy
- Families show anti-coherence (planets deliberately varied within families)

**Implications**:
- The hierarchy organises gates but not for planetary purposes
- Planetary assignments may intentionally cross-cut nuclear families
- The two systems (hierarchy and planets) may serve different functions

---

## Part 6: Research Timeline

### Week 1: Data Preparation
- Extract complete planetary assignments to structured format
- Build nuclear hierarchy mapping with full metadata
- Verify data integrity (check for missing values, duplicates)
- Create analysis infrastructure (scripts, templates)

### Week 2: Descriptive Analysis (Phase 1)
- Calculate all distributions (Pillar, Mystery, Letter levels)
- Generate visualisations (heatmaps, frequency charts)
- Document observed patterns without statistical claims

### Week 3: Hypothesis Testing (Phase 2)
- Run all four tests with permutation baselines
- Apply multiple testing corrections
- Document results with full statistical detail

### Week 4: Predictive Modelling (Phase 3)
- Build and test Models A, B, C, D
- Run LOOCV for each model
- Compare to electromagnetic-only baseline

### Week 5: Standing Wave Inheritance (Phase 4)
- Analyse inheritance patterns for families with standing waves
- Calculate overlap scores and significance
- Document findings

### Week 6: Synthesis and Reporting (Phase 5)
- Integrate findings across all phases
- Articulate derivable principles (if any)
- Write final research report
- Update EM framework documentation

---

## Part 7: Deliverables

### 7.1 Primary Deliverables

1. **Research Report**: Full documentation of methods, results, and conclusions
2. **Data Files**: Structured planetary data linked to nuclear hierarchy
3. **Analysis Scripts**: Reproducible code for all tests
4. **Visualisations**: Charts and heatmaps of planetary distributions

### 7.2 Documentation Updates

1. **ELECTROMAGNETIC-DERIVATION-STATE-OF-KNOWLEDGE.md**: Update with findings
2. **NUCLEAR-HIERARCHY-HYPOTHESIS.md**: Convert from proposal to results document
3. **EM-Series Articles**: Revise if new derivable principles emerge

### 7.3 Decision Points

At the end of Phase 3, we will have enough information to decide:

1. **Continue to Phase 4-5?** (If Phases 1-3 show signal)
2. **Conclude null result?** (If Phases 1-3 show no signal)
3. **Pursue alternative hypotheses?** (If patterns emerge that suggest different framing)

---

## Part 8: Intellectual Integrity Commitments

### 8.1 Pre-Registration

This proposal serves as pre-registration of hypotheses. We commit to:
- Testing exactly these hypotheses in exactly this order
- Reporting all results, including null findings
- Distinguishing pre-registered tests from exploratory analysis

### 8.2 Transparency

All analysis will be:
- Reproducible (scripts saved and documented)
- Complete (no selective reporting)
- Honest about limitations and alternative interpretations

### 8.3 The Derivation Standard

We will not claim "derivation" unless:
- Cross-validated accuracy exceeds baseline significantly
- Statistical significance survives multiple testing correction
- The principle is simpler than the data it explains
- We can state the rule clearly and test it on new cases

### 8.4 Acknowledging Failure

If the hypothesis fails, we will:
- Document this clearly
- Add nuclear hierarchy to the "ruled out" list
- Maintain the empirical conclusion for the transformation layer
- Consider what the failure teaches us about the system's structure

---

## Conclusion

This research proposal outlines a rigorous investigation into whether the nuclear hexagram hierarchy provides the missing key for understanding cross-zero planetary assignments.

We approach this with appropriate scepticism—nuclear trigrams (a related concept) have already failed to show signal. However, the hierarchy represents a different structural dimension: family relationships rather than internal components.

The striking observation that standing waves distribute evenly across Pillars with electromagnetic coherence suggests this may be worth investigating. But suggestion is not proof. This proposal defines exactly what would constitute proof, and exactly what would constitute falsification.

The goal is not to find patterns we want to find. The goal is to discover whether derivable patterns exist—and to accept the answer either way.

---

*Proposal Status: COMPLETE*
*Ready for: Data Analysis Phase*
*Date: 2024-12-18*

---

## Appendix A: Complete Nuclear Hierarchy Mapping

### Pillar of Fire (Gate 1 - Beauty)

| Gate | Level | EM Position | Gate Type |
|------|-------|-------------|-----------|
| 1 | Pillar | -4 | Standing Wave |
| 28 | Mystery | -4 → -3 | Same-Side Void |
| 43 | Mystery | -4 → -3 | Same-Side Void |
| 44 | Mystery | -1 → +4 | Cross-Zero Manifesting |
| 30 | Letter | -2 | Standing Wave |
| 55 | Letter | -2 → +1 | Cross-Zero Manifesting |
| 56 | Letter | -2 → +3 | Cross-Zero Manifesting |
| 62 | Letter | +1 → +3 | Same-Side Material |
| 14 | Letter | -2 → +4 | Cross-Zero Manifesting |
| 32 | Letter | +1 → +4 | Same-Side Material |
| 34 | Letter | +1 → -4 | Cross-Zero Dematerialising |
| 50 | Letter | -1 → -2 | Same-Side Void |
| 13 | Letter | -4 → -2 | Same-Side Void |
| 31 | Letter | -3 → +3 | Cross-Zero Manifesting |
| 33 | Letter | +3 → -4 | Cross-Zero Dematerialising |
| 49 | Letter | -2 → -3 | Same-Side Void |

### Pillar of Water (Gate 2 - Unity)

| Gate | Level | EM Position | Gate Type |
|------|-------|-------------|-----------|
| 2 | Pillar | +4 | Standing Wave |
| 23 | Mystery | +4 → +3 | Same-Side Material |
| 24 | Mystery | +1 → +4 | Same-Side Material |
| 27 | Mystery | +3 → +1 | Same-Side Material |
| 3 | Letter | +2 → -2 | Cross-Zero Dematerialising |
| 8 | Letter | +2 → +4 | Same-Side Material |
| 20 | Letter | +4 → -1 | Cross-Zero Dematerialising |
| 42 | Letter | +1 → -1 | Cross-Zero Dematerialising |
| 4 | Letter | +2 → +3 | Same-Side Material |
| 7 | Letter | +4 → +2 | Same-Side Material |
| 19 | Letter | +4 → +1 | Same-Side Material |
| 41 | Letter | -3 → +3 | Cross-Zero Manifesting |
| 29 | Letter | +2 | Standing Wave |
| 59 | Letter | -1 → +2 | Cross-Zero Manifesting |
| 60 | Letter | +2 → -3 | Cross-Zero Dematerialising |
| 61 | Letter | -1 → -3 | Same-Side Void |

### Pillar of Truth (Gate 63)

| Gate | Level | EM Position | Gate Type |
|------|-------|-------------|-----------|
| 63 | Pillar | +2 → -2 | Cross-Zero Dematerialising |
| 38 | Mystery | -3 → +1 | Cross-Zero Manifesting |
| 40 | Mystery | -3 → +1 | Cross-Zero Manifesting |
| 54 | Mystery | +1 → -1 | Cross-Zero Dematerialising |
| 5 | Letter | +2 → -1 | Cross-Zero Dematerialising |
| 9 | Letter | -4 → -1 | Same-Side Void |
| 11 | Letter | +4 → -4 | Cross-Zero Dematerialising |
| 48 | Letter | -1 → +2 | Cross-Zero Manifesting |
| 15 | Letter | +4 → +3 | Same-Side Material |
| 22 | Letter | -2 → +3 | Cross-Zero Manifesting |
| 36 | Letter | -2 → +4 | Cross-Zero Manifesting |
| 52 | Letter | +3 | Standing Wave |
| 18 | Letter | -1 → +3 | Cross-Zero Manifesting |
| 26 | Letter | +1 → -4 | Cross-Zero Dematerialising |
| 46 | Letter | +4 → -1 | Cross-Zero Dematerialising |
| 57 | Letter | -1 | Standing Wave |

### Pillar of Light (Gate 64)

| Gate | Level | EM Position | Gate Type |
|------|-------|-------------|-----------|
| 64 | Pillar | -2 → +2 | Cross-Zero Manifesting |
| 37 | Mystery | -2 → -1 | Same-Side Void |
| 39 | Mystery | +2 → +3 | Same-Side Material |
| 53 | Mystery | +1 → +4 | Same-Side Material |
| 6 | Letter | +2 → -4 | Cross-Zero Dematerialising |
| 10 | Letter | -3 → -4 | Same-Side Void |
| 47 | Letter | +2 → -3 | Cross-Zero Dematerialising |
| 58 | Letter | -3 | Standing Wave |
| 16 | Letter | +1 → +4 | Same-Side Material |
| 21 | Letter | -2 → +1 | Cross-Zero Manifesting |
| 35 | Letter | +4 → -2 | Cross-Zero Dematerialising |
| 51 | Letter | +1 | Standing Wave |
| 12 | Letter | -4 → +3 | Cross-Zero Manifesting |
| 17 | Letter | -3 → +1 | Cross-Zero Manifesting |
| 25 | Letter | -4 → +1 | Cross-Zero Manifesting |
| 45 | Letter | -3 → +4 | Cross-Zero Manifesting |

---

## Appendix B: Baseline Accuracy Reference

From previous research (ELECTROMAGNETIC-DERIVATION-STATE-OF-KNOWLEDGE.md):

| Component | Lines | Accuracy | Method |
|-----------|-------|----------|--------|
| Standing waves | 47 | 100% | Position + Line lookup |
| Same-phase gates | 144 | 48% | Position + Line + GateType |
| Cross-zero gates | 190 | 18% | Leave-one-out CV |
| **Total** | 381 | ~55% | Stratified by type |

Target for this research: Improve cross-zero from 18% to >30% with hierarchy features.

---

## Appendix C: Statistical Methods Reference

### Permutation Testing

For each hypothesis test:
1. Calculate observed statistic (accuracy, coherence score, etc.)
2. Shuffle the relevant labels 1000 times
3. Calculate statistic for each shuffled version
4. Z-score = (observed - mean(shuffled)) / std(shuffled)
5. Reject null if Z ≥ 2.0

### Leave-One-Out Cross-Validation

For predictive models:
1. For each data point i:
   a. Train model on all points except i
   b. Predict label for point i
   c. Record if prediction matches actual
2. Accuracy = count(correct) / total

### Bonferroni Correction

For multiple comparisons:
- If testing k hypotheses at α = 0.05
- Each individual test uses α' = 0.05 / k
- Equivalent to requiring Z ≥ Z(1 - α'/2)

For 12 Mystery families: α' = 0.05/12 = 0.0042, Z ≥ 2.64

---

*End of Proposal*
