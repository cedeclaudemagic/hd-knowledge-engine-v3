# Electromagnetic I Ching — Refinement Plan

*A plan to distil the current interpretations into a layered structure*

---

## Current State

We have 30 completed gate interpretations (180 lines) in detailed scholarly format. Each line entry includes:
- Position/function tables
- Three-source quotes (I-Ching, Ra Black Book, Ra White Book)
- Electromagnetic interpretation (2-3 paragraphs)
- Alignment analysis
- **Electromagnetic Keynote** (1 line summary) ← This is the seed of the oracle

The format is valuable as reference material but too heavy to function as an oracle.

---

## Target Structure

### Layer 1: The Oracle
**File:** `ORACLE.md` (or possibly split by gate type)

A clean, readable document with just:
- Gate number, name, vector
- 6 keynotes (one per line)
- Possibly: threshold description for cross-zero gates

**Example format:**
```markdown
## Gate 11: Peace (T'ai)
*Heaven → Earth | Source to Sink | Amplitude 8*

1. First contact with the field of connected potentials
2. Expanding scope before the great crossing
3. Peak of potential — manifestation inevitable
4. Humble arrival at form
5. Developing through distribution
6. Full form recognising its transience

**Threshold (3→4):** Complete transformation from pure potential to pure form
```

**Character:** Speakable. Poetic where possible. Wisdom that addresses the reader.

---

### Layer 2: The Commentary
**Folder:** `commentary/` (current files, renamed)

The existing detailed interpretations, reframed as scholarly commentary:
- Rename folder from `electromagnetic-interpretations/` to `commentary/`
- Update INDEX.md to reflect this is reference material
- Keep all current content — it's valuable for students of the system

---

### Layer 3: The Framework
**Folder:** `books/position-plus-1-the-wave/` and `books/position-minus-1-the-proof/`

Already complete. The articles proving the electromagnetic framework.

---

### Layer 4: The Reflections
**Folder:** `articles/EM-Series-Reflections/`

Already complete. "The Breath and the Bones" and related meditations.

---

## Extraction Task

### Step 1: Create Oracle Document Structure

Create new file: `ORACLE.md`

Header:
```markdown
# The Electromagnetic I Ching — Oracle Text

*384 lines distilled to their essence*

---

## How to Use This Oracle

[Brief introduction — this is the speakable layer, consult the Commentary for detailed analysis]

---

## Reading Guide

| Gate Type | Character |
|-----------|-----------|
| Standing Wave | States of being — what it means to hold this position |
| Cross-Zero Manifesting | Transformation from potential to form |
| Cross-Zero Dematerialising | Transformation from form to potential |
| Same-Phase | Movement within a domain |

---
```

### Step 2: Extract Keynotes from Completed Gates

For each completed gate file, extract:
1. Gate number and name
2. Vector (e.g., "-4 → +4")
3. Brief vector description (e.g., "Source to Sink")
4. The 6 "Electromagnetic Keynote" lines
5. For cross-zero gates: threshold description

**Source location in each file:**
- Look for `**Electromagnetic Keynote:**` at the end of each line section
- Look for `### THE THRESHOLD` section for crossing description

### Step 3: Refine Keynotes

Review each extracted keynote and ask:
- Does it speak or explain?
- Could it be more direct?
- Does it use framework jargon that could be translated?

**Refinement principles:**
- Prefer active voice
- Prefer concrete imagery over abstract position names
- Keep under 15 words where possible
- The keynote should be able to stand alone as guidance

**Example refinement:**
- Before: "First contact with the origin domain at maximum potential"
- After: "First contact with the field of connected potentials"

Or even more direct:
- "When you pull one thread, the whole tapestry moves"

### Step 4: Organise by Gate Type

Within the Oracle document, organise gates by type:
1. Standing Waves (8 gates)
2. Cross-Zero Manifesting (16 gates)
3. Cross-Zero Dematerialising (16 gates)
4. Same-Phase Material (12 gates)
5. Same-Phase Void (12 gates)

This groups similar energetic patterns together.

### Step 5: Update Commentary Folder

1. Rename folder: `electromagnetic-interpretations/` → `commentary/`
2. Update `INDEX.md`:
   - Change title to "Electromagnetic I Ching — Commentary"
   - Add note: "For the distilled oracle text, see ORACLE.md"
   - Keep all tracking and pattern documentation
3. Update `GATE-TEMPLATE.md`:
   - Add note that this creates commentary entries
   - Oracle entries are extracted separately

---

## Completion Task (Remaining 34 Gates)

For the 34 incomplete gates, decide on approach:

**Option A: Complete commentary first, then extract**
- Continue with current detailed format
- Extract keynotes after completion
- Pro: Maintains rigour, keynotes emerge from analysis
- Con: Slower, may not be necessary

**Option B: Write oracle keynotes directly**
- For remaining gates, write 6 keynotes directly
- Add to Oracle document
- Commentary can be filled in later if desired
- Pro: Faster, focuses on what matters
- Con: Less rigorous, may miss insights

**Option C: Hybrid**
- Complete same-phase gates in full (these are less explored)
- For remaining cross-zero gates, write keynotes only
- Pro: Balances rigour with efficiency
- Con: Inconsistent depth

**Recommendation:** Option A for quality, but don't let perfect be enemy of good. The 30 completed gates provide enough pattern validation.

---

## File Structure After Refinement

```
/docs/
├── ORACLE.md                          ← NEW: The distilled oracle
├── commentary/                        ← RENAMED from electromagnetic-interpretations/
│   ├── INDEX.md                       ← Updated framing
│   ├── ALIGNMENT-CHECK.md
│   ├── GATE-TEMPLATE.md
│   ├── gate-01-the-creative.md
│   ├── gate-02-the-receptive.md
│   └── ... (all gate files)
├── books/
│   ├── position-plus-1-the-wave/
│   ├── position-minus-1-the-proof/
│   └── series/reflections/
```

---

## Verification Checklist

After extraction, verify:
- [ ] All 30 completed gates have entries in ORACLE.md
- [ ] Each gate has exactly 6 keynotes
- [ ] Cross-zero gates have threshold descriptions
- [ ] Standing waves have expression-shift notes
- [ ] Keynotes are speakable (read aloud test)
- [ ] No framework jargon without translation
- [ ] Commentary INDEX.md updated with new framing
- [ ] Links between Oracle and Commentary work

---

## Example: Full Oracle Entry

### Standing Wave Example (Gate 1)

```markdown
## Gate 1: The Creative (Ch'ien)
*Heaven | Source | Position -4*

**Standing Wave — Pure creative potential held at the source pole**

1. Hidden potential; not yet time to act
2. Creative capacity developing; connect with aligned sources
3. Internal charge at capacity; sustained by drive
4. First external expression; requires aloneness to stay true
5. Peak creative influence; sustained endurance attracts resonance
6. Peak expression must remain objective; potential is not yet form

**Expression-Shift (3→4):** Internal experience becomes external expression — same position, different orientation
```

### Cross-Zero Example (Gate 11)

```markdown
## Gate 11: Peace (T'ai)
*Heaven → Earth | Source to Sink | Amplitude 8*

**Cross-Zero Manifesting — The complete journey from potential to form**

1. First contact with connected potentials; pull one thread, the tapestry moves
2. Expanding scope before the crossing; bear with what doesn't yet fit
3. Peak of potential; no plain not followed by a slope
4. Humble arrival at form; fluttering down without boasting
5. Developing through distribution; giving form away creates union
6. Full manifestation recognising its transience; the wall falls back

**Threshold (3→4):** Heaven becomes Earth — pure creative force transforms completely into pure receptive form
```

---

## Notes for Implementation

1. **Preserve the scholarly work** — don't delete or diminish the commentary. It has real value.

2. **The oracle is extraction, not replacement** — we're adding a layer, not substituting.

3. **Keynotes may need creative refinement** — some current keynotes are analytical summaries. They may need rewriting to become oracular speech.

4. **Test by reading aloud** — if a keynote sounds like a textbook, refine it. If it sounds like wisdom, keep it.

5. **The threshold descriptions matter** — for cross-zero gates, the 3→4 transition is the heart of the hexagram. Give it attention.

6. **Standing waves need expression-shift notes** — they don't cross zero, but they do shift from internal to external. Note this.

---

*Plan created: 2025-12-18*
*For execution by Claude Code or manual implementation*
