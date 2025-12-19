# Gate Interpretation Template & Process Guide

*A systematic guide for creating electromagnetic gate interpretations without error*

---

## Step 1: Look Up Authoritative Trigram Data

**Source File:** `/knowledge-systems/iching-names/mappings/iching-names-mappings.json`

For any gate, find its entry and extract:
- `knowledge.trigrams.lower` → **Inner Trigram** (Lines 1-3)
- `knowledge.trigrams.upper` → **Outer Trigram** (Lines 4-6)

**CRITICAL:** The V3 engine is the single source of truth. Never guess or derive trigrams from other sources.

---

## Step 2: Convert Trigrams to Positions

| Trigram | Chinese | Position | Axis | Domain |
|---------|---------|----------|------|--------|
| Heaven | 乾 | **-4** | Poles | Void (Source) |
| Lake | 兌 | **-3** | Storage | Void (Capacitance) |
| Fire | 離 | **-2** | Flow | Void (Voltage) |
| Wind | 巽 | **-1** | Gates | Void (Gate OUT) |
| Thunder | 震 | **+1** | Gates | Material (Gate IN) |
| Water | 坎 | **+2** | Flow | Material (Current) |
| Mountain | 艮 | **+3** | Storage | Material (Inductance) |
| Earth | 坤 | **+4** | Poles | Material (Sink) |

**Memory Aid:**
- Negative positions (-4 to -1) = Void domain (potential, pre-form)
- Positive positions (+1 to +4) = Material domain (form, manifested)

---

## Step 3: Determine Gate Type

Calculate: **Vector = Inner Position → Outer Position**

| Inner Position | Outer Position | Gate Type |
|----------------|----------------|-----------|
| Same | Same | **Standing Wave** |
| Negative (-) | Positive (+) | **Cross-Zero Manifesting** |
| Positive (+) | Negative (-) | **Cross-Zero Dematerialising** |
| Positive (+) | Positive (+) | **Same-Phase Material** |
| Negative (-) | Negative (-) | **Same-Phase Void** |

**Examples:**
- Gate 1: Heaven/Heaven = -4/-4 → Standing Wave
- Gate 11: Heaven/Earth = -4/+4 → Cross-Zero Manifesting (neg → pos)
- Gate 12: Earth/Heaven = +4/-4 → Cross-Zero Dematerialising (pos → neg)
- Gate 3: Thunder/Water = +1/+2 → Same-Phase Material (both positive)
- Gate 9: Heaven/Wind = -4/-1 → Same-Phase Void (both negative)

---

## Step 4: Map Lines to Positions

### For Standing Waves (same trigram):
All 6 lines operate at the same position.
- Lines 1-6 all express states of that position

### For Cross-Zero Gates:
| Line | Trigram | Position | Function |
|------|---------|----------|----------|
| Line 1 | Inner | Inner position | Entry to inner domain |
| Line 2 | Inner | Inner position | Development at inner |
| Line 3 | Inner | Inner position | Completion at inner (pre-crossing) |
| — | — | **THRESHOLD** | Zero crossing occurs here |
| Line 4 | Outer | Outer position | Entry to outer domain |
| Line 5 | Outer | Outer position | Development at outer |
| Line 6 | Outer | Outer position | Completion at outer (gate completion) |

### For Same-Phase Gates:
Same structure as Cross-Zero, but no zero crossing — both positions in same domain.

---

## Step 5: Determine Language Type

| Gate Type | Language Pattern |
|-----------|------------------|
| Standing Wave | **State language** — describes qualities of holding position |
| Cross-Zero | **Transformation language** — journey, threshold, becoming |
| Same-Phase | **Action language** — movement within domain |

---

## Step 6: Calculate Amplitude

**Amplitude = |Outer Position - Inner Position|**

Examples:
- Gate 11: |-4 to +4| = 8 (maximum)
- Gate 32: |-1 to +1| = 2 (minimum crossing)
- Gate 63: |-2 to +2| = 4 (Flow axis crossing)

Higher amplitude = greater transformation intensity.

---

## Verification Checklist

Before finalizing any gate interpretation, verify:

- [ ] Inner trigram matches V3 engine (`knowledge.trigrams.lower`)
- [ ] Outer trigram matches V3 engine (`knowledge.trigrams.upper`)
- [ ] Inner position matches trigram lookup table
- [ ] Outer position matches trigram lookup table
- [ ] Vector format is **Inner → Outer** (not reversed)
- [ ] Gate type is correct based on position signs
- [ ] Lines 1-3 reference inner trigram position
- [ ] Lines 4-6 reference outer trigram position
- [ ] Amplitude calculation is correct

**Run verification script:** `node scripts/check-gate-files.js`

---

## Template for New Gate Interpretation

Copy and fill in the template below:

```markdown
# Gate [NUMBER]: [I-CHING NAME] ([PINYIN]) — Electromagnetic Interpretation

*[Subtitle describing the journey]*

---

## Gate Overview

| Attribute | Value |
|-----------|-------|
| **I-Ching Name** | [Name] ([Pinyin] / [Chinese]) |
| **HD Keyword** | [Human Design keyword] |
| **Inner Trigram** | [Trigram Name] ([Chinese]) — position [±N] ([Position Name]) |
| **Outer Trigram** | [Trigram Name] ([Chinese]) — position [±N] ([Position Name]) |
| **Gate Type** | [Standing Wave / Cross-Zero Manifesting / Cross-Zero Dematerialising / Same-Phase Material / Same-Phase Void] |
| **Vector** | [Inner] → [Outer] (amplitude [N]) |
| **Language Type** | [State / Transformation / Action] |
| **Transition Type** | [Holding / Mode-Shift / Phase-Shift] |

---

## Electromagnetic Structure

```
Position:  -4    -3    -2    -1    0    +1    +2    +3    +4
           [Visual representation with dots showing inner/outer positions]
```

**[Gate N] [crosses from / holds at] [Inner Position Name] [to Outer Position Name]** — [description of journey].

### Why "[I-Ching Name]"?

[Explain how the I-Ching image relates to the electromagnetic journey]

---

## Channel Context

| Attribute | Value |
|-----------|-------|
| **Channel** | [N-N] ([Channel Name]) |
| **Partner Gate** | [N] ([Name]) — [Trigrams] |
| **Partner Type** | [Gate Type] |
| **Circuit** | [Circuit Name] |
| **Centre** | [Centre Name] |

---

## Line-by-Line Interpretation

### Lines 1-3: The Inner Trigram ([Trigram Name] / [Position Name] / [±N])

[Introduction to what these lines represent]

---

### Line 1: Entry to [Position Name]

| Aspect | Value |
|--------|-------|
| **Position** | Entry-Inner |
| **Function** | First contact with [position] |
| **Polarity** | [YIN/YANG] |

#### Traditional Sources

**I-Ching (Wilhelm/Baynes):**
> "[Quote]"

**Ra Uru Hu:**
- **Keynote:** [Keynote]
- **Exaltation ([Planet]):** "[Quote]"
- **Detriment ([Planet]):** "[Quote]"

#### Electromagnetic Interpretation

[Analysis connecting I-Ching, Ra, and electromagnetic position]

**Alignment Analysis:**
- **I-Ching ↔ EM:** [EXCELLENT/STRONG/MODERATE/WEAK] ALIGNMENT. [Explanation]
- **Ra ↔ EM:** [EXCELLENT/STRONG/MODERATE/WEAK] ALIGNMENT. [Explanation]
- **Planetary Logic:** [Planet] exalted ([reason]), [Planet] detriment ([reason]).

**Electromagnetic Keynote:** *[One-line summary]*

---

[Repeat for Lines 2-6]

---

### THE THRESHOLD (Line 3 → Line 4)

```
Line 3: [Inner Trigram] ([Inner Position]) — Peak of [Position Name]
        ═══════════════════════════════
              ZERO CROSSING OCCURS
        ═══════════════════════════════
Line 4: [Outer Trigram] ([Outer Position]) — Entry to [Position Name]
```

[Description of the threshold crossing]

---

## Pattern Analysis & Flags

### [Pattern Name]

[Description of notable patterns]

### Strong Alignments

| Line | Pattern | Notes |
|------|---------|-------|
| [N] | [Pattern] | [Notes] |

### Planetary Pattern

| Line | Exaltation | Detriment | Pattern |
|------|------------|-----------|---------|
| 1 | [Planet] | [Planet] | [Pattern] |
| ... | ... | ... | ... |

---

## Summary

Gate [N] ([Name]) is a **[gate type]** — [journey description].

1. **Lines 1-3** operate at [Inner Position] ([description])
2. **The threshold** [crossing description]
3. **Lines 4-6** operate at [Outer Position] ([description])

[Final synthesis paragraph]

**Alignment Rating: [RATING]. [Summary statement].**

---

## Sources

- Wilhelm/Baynes I-Ching translation via James DeKorne's Gnostic Book of Changes
- Ra Uru Hu Black Book and White Book (HD-Knowledge-Engine-V3 mappings)
- Electromagnetic Framework (EM-Series articles)

---

*Generated: [DATE]*
*Version: 1.0.0*
```

---

## Common Errors to Avoid

### 1. Reversed Vector Direction
**Wrong:** Outer → Inner
**Right:** Inner → Outer (Lower → Upper)

### 2. Confusing Inner/Outer with Upper/Lower
- **Inner** = **Lower** = Lines 1-3
- **Outer** = **Upper** = Lines 4-6

### 3. Wrong Category Assignment
Always check the signs:
- Manifesting: negative → positive
- Dematerialising: positive → negative

### 4. Incorrect Position Names
Double-check against the trigram lookup table. Don't guess.

### 5. Mismatched Line Analysis
Ensure Lines 1-3 reference the inner position, not the outer.

---

*Last Updated: 2025-12-18*
*Version: 1.0.0*
