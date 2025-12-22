# CLAUDE CODE BRIEF: Derivation Audit and Cross-Reference

## Mission Statement

Systematically audit ALL derivation work across the HD Knowledge Engine V3 project, ensuring the DERIVATION-STATUS-MAP.md accurately reflects all previous work with proper source references.

**Critical Context:** Recent investigation revealed that Claude Code re-derived work that was already complete (Centre Functions, Authority, Type) because the existing work wasn't properly cross-referenced. This audit prevents future duplication.

---

## PHASE 0: Git Setup (MANDATORY FIRST STEP)

### Step 0.1: Check Current Status

```bash
cd /Volumes/CLAUDE/HD-Knowledge-Engine-V3
git status
```

Review what's uncommitted. Note any changes.

### Step 0.2: Stage and Commit All Current Work

```bash
git add -A
git commit -m "Pre-audit checkpoint: All work as of 22 Dec 2025

- Centre Functions corrected to 100% derivable
- Pressure = Storage (±3) correction applied
- DERIVATION-COMPARISON-SYNTHESIS.md created
- Audit brief created"
```

### Step 0.3: Verify Clean State

```bash
git status
# Should show: nothing to commit, working tree clean
```

### Step 0.4: Create Audit Branch

```bash
git checkout -b audit/derivation-reorganisation-dec2025
```

### Step 0.5: Confirm Branch

```bash
git branch
# Should show: * audit/derivation-reorganisation-dec2025
```

**⚠️ IMPORTANT:** All subsequent work in this brief MUST be done on this branch. Before any file modifications, verify you are on `audit/derivation-reorganisation-dec2025`.

### Step 0.6: Commit After Each Phase

After completing each phase, commit the work:

```bash
git add -A
git commit -m "Phase X complete: [brief description]"
```

This allows rollback to any phase if needed.

---

## Project Structure Overview

```
/Volumes/CLAUDE/HD-Knowledge-Engine-V3/docs/
├── articles/
│   ├── EM-Series-Book0/      # "The Shape of Change" (10 chapters)
│   ├── EM-Series-Book1/      # "The Wave" (14 chapters)
│   ├── EM-Series-Book2/      # "The Proof" (11 articles)
│   ├── EM-Series-Book3/      # In progress
│   ├── electromagnetic-consciousness-series/  # 5 articles
│   ├── the-geometry-of-consciousness-book/    # Complete manuscript
│   └── wheel-series/         # 3 articles
├── research/
│   ├── electromagnetic-framework/  # Core EM theory (8 files)
│   ├── geometric/            # Geometric derivations (~40 files)
│   ├── planetary/            # Planetary research (~30 files)
│   ├── circuits/             # Circuit analysis (10 files)
│   ├── profile/              # Profile derivation
│   ├── type/                 # Type derivation
│   ├── authority/            # Authority derivation
│   ├── centre/               # Centre derivation
│   └── DERIVATION-STATUS-MAP.md  # Master document to update
└── reference/                # Reference materials
```

---

## Phase 1: Audit Books for Derivations

**Objective:** Extract all derivations claimed in the published books and note their sources.

### Phase 1A: Book 0 - "The Shape of Change"

**Files to read:**
- `/docs/articles/EM-Series-Book0/BOOK-0-CHAPTER-01-THE-QUESTION.md` through `CHAPTER-10`

**For each chapter, extract:**
1. What is derived/proven
2. What is hypothesised
3. What is stated as empirical
4. Key formulas or proofs

**Output format:**
```markdown
### Book 0 Chapter X: [Title]

**DERIVED:**
- [Claim] — [Brief evidence/method]

**HYPOTHESISED:**
- [Claim] — [Status: confirmed/rejected/outstanding]

**EMPIRICAL:**
- [Claim] — [Source: Ra/transmission/etc]
```

### Phase 1B: Book 1 - "The Wave"

**Files to read:**
- `/docs/articles/EM-Series-Book1/01-the-wave.md` through `14-the-living-framework.md`

**Key chapters for derivations:**
- Ch.2: Eight Positions (trigram mapping)
- Ch.3: Four Pairs (axes)
- Ch.5: Three Types of Movement (gate classification)
- Ch.6: Six Lines
- Ch.7: Channels
- Ch.8: Seven Circuits
- Ch.9: Nine Centres
- Ch.11: Authority Hierarchy
- Ch.12: Type Architectures

### Phase 1C: Book 2 - "The Proof"

**Files to read:**
- `/docs/articles/EM-Series-Book2/01-binary-periods.md` through `11-topology-of-the-wave.md`

**Key articles for derivations:**
- Art.1: Binary Periods (Pillars)
- Art.2: Palindrome Principle (standing waves)
- Art.4: Tetragrammaton Derived (5 constraints)
- Art.5: Standing Waves as Anchors
- Art.7: EM Positions Emergent
- Art.8: Nuclear Hierarchy
- Art.11: Topology (torus knot)

### Phase 1D: Geometry of Consciousness Book

**Files to read:**
- `/docs/articles/the-geometry-of-consciousness-book/THE-GEOMETRY-OF-CONSCIOUSNESS-COMPLETE.md`
- Ring files: `ring-0-1-2.md`, `ring-3-4.md`, `ring-5-6.md`, `ring-7-8.md`

---

## Phase 2: Audit Research Folders

### Phase 2A: Electromagnetic Framework

**Files to read:**
- `/docs/research/electromagnetic-framework/electromagnetic-framework-synthesis.md`
- `/docs/research/electromagnetic-framework/centre-electromagnetic-profiles.md`
- `/docs/research/electromagnetic-framework/authority-electromagnetic-analysis.md`
- `/docs/research/electromagnetic-framework/type-determination-analysis.md`
- `/docs/research/electromagnetic-framework/line-level-validation.md`
- `/docs/research/electromagnetic-framework/russell-trigram-mapping-exploration.md`

**Extract:**
- The Four Axes Framework (complete)
- Centre position signatures (all 9)
- Authority electromagnetic logic
- Type configuration logic
- Line-level validation results

### Phase 2B: Geometric Research

**Priority files:**
- `/docs/research/geometric/GEOMETRIC-FOUNDATIONS-SYNTHESIS.md`
- `/docs/research/geometric/COLOR-TONE-BASE-COMPLETE-SYNTHESIS.md`
- `/docs/research/geometric/LOCK-KEY-SYNTHESIS.md`
- `/docs/research/geometric/STRUCTURE-MEANING-SYNTHESIS.md`

**Secondary files (check for unique derivations):**
- All `*-DERIVATION.md` files
- All `*-SYNTHESIS.md` files

### Phase 2C: Planetary Research

**Priority files:**
- `/docs/research/planetary/PLANETARY-DERIVATION-COMPLETE-SYNTHESIS.md`
- `/docs/research/planetary/magic-square-complete/COMPLETE-SYNTHESIS.md`
- `/docs/research/planetary/circuit-channel-nuclear/FINAL-SWEEP-SYNTHESIS.md`

**Key finding to extract:**
- ~40% derivation boundary
- Standing wave = 100% Sun/Earth
- Magic Square vertical patterns
- What was REJECTED

### Phase 2D: Circuit Research

**Files to read:**
- `/docs/research/circuits/circuit-architecture-comparison.md`
- All circuit deep-dive files

---

## Phase 3: Build Cross-Reference Matrix

**Objective:** Create a matrix showing where each derivation appears across sources.

**Template:**

| Derivation | Book 0 | Book 1 | Book 2 | EM-Framework | Geometric | Notes |
|------------|--------|--------|--------|--------------|-----------|-------|
| Trigrams = cube vertices | Ch.2 | Ch.2 | Art.7 | synthesis.md | GEOM-FOUND | Proven |
| Centre Functions | — | Ch.9 | — | centre-profiles.md | — | 100% |
| Authority Hierarchy | — | Ch.11 | — | authority-analysis.md | — | 100% |
| Type Architecture | — | Ch.12 | — | type-determination.md | — | 100% |
| Profile = Octahedron×2 | — | — | — | — | PROFILE-DERIV | NEW |
| etc. | | | | | | |

---

## Phase 4: Update DERIVATION-STATUS-MAP

**Objective:** Ensure every entry in the map has:
1. Correct status (✓✓ PROVEN, ✓ MAPPED, E EMPIRICAL)
2. Source references (multiple if applicable)
3. Key insight summary
4. Date of establishment

**Template for each entry:**

```markdown
## [Structure Name] — [Status] ([Date])

| Element | Status | Evidence |
|---------|--------|----------|
| [Specific claim] | [✓✓/✓/E] | [Brief evidence] |

**Sources:**
- Book 1 Ch.X: [specific page/section]
- `/docs/research/[folder]/[file].md`

**Key Insight:** [One sentence summary]
```

---

## Phase 5: Identify Gaps

**Objective:** List what's genuinely NOT yet investigated.

**Categories:**
1. **OUTSTANDING:** Mentioned but not investigated
2. **PARTIAL:** Started but incomplete
3. **CONTRADICTORY:** Different sources disagree

---

## Execution Instructions

### For Claude Code:

1. **PHASE 0 FIRST** — Complete git setup before ANY other work
2. **Verify branch** — Before each phase, run `git branch` to confirm you're on `audit/derivation-reorganisation-dec2025`
3. **Work in phases** — Complete one phase before starting the next
4. **Commit after each phase** — `git add -A && git commit -m "Phase X complete"`
5. **Create interim outputs** — Save findings after each phase to `/docs/research/audit/`
6. **Flag discrepancies** — If sources disagree, note both versions
7. **Don't re-derive** — This audit RECORDS existing work, doesn't redo it
8. **Use exact quotes** — When noting key insights, quote the source

### Output Files:

```
/docs/research/audit/
├── PHASE-1A-BOOK-0-AUDIT.md
├── PHASE-1B-BOOK-1-AUDIT.md
├── PHASE-1C-BOOK-2-AUDIT.md
├── PHASE-1D-GEOMETRY-BOOK-AUDIT.md
├── PHASE-2A-EM-FRAMEWORK-AUDIT.md
├── PHASE-2B-GEOMETRIC-AUDIT.md
├── PHASE-2C-PLANETARY-AUDIT.md
├── PHASE-2D-CIRCUITS-AUDIT.md
├── PHASE-3-CROSS-REFERENCE-MATRIX.md
├── PHASE-4-STATUS-MAP-UPDATES.md
└── PHASE-5-GAPS-IDENTIFIED.md
```

---

## Critical Corrections to Apply

Based on today's session (22 Dec 2025), ensure these corrections are reflected:

### 1. Centre Functions = 100% Derivable (NOT 78%)

**Error:** Claude Code looked for pressure at ±4 (poles)
**Correction:** Pressure = Storage (±3)
- Root at ±3 = Stored pressure
- Head at -3 to +2 = Mental pressure through transformation

**Source:** `centre-electromagnetic-profiles.md`

### 2. Authority Already Derived in Book 1

**Source:** Ch.11 + `authority-electromagnetic-analysis.md`
**Key insight:** "Voltage (-2) fluctuates and modulates ALL other signals"

### 3. Type Already Derived in Book 1

**Source:** Ch.12 + `type-determination-analysis.md`
**Key insight:** "Strategy is about circuit completion"

### 4. Profile = Genuinely New (21 Dec 2025)

**Source:** `/docs/research/profile/PROFILE-DERIVATION-SYNTHESIS.md`
**Key insight:** 12 = Octahedron × 2 distances (edge + diameter)

---

## Success Criteria

The audit is complete when:

1. ✓ Every derivation in DERIVATION-STATUS-MAP has at least one source reference
2. ✓ Cross-reference matrix shows all locations of each derivation
3. ✓ No derivation is listed as "outstanding" if it's actually complete
4. ✓ Gaps list identifies only genuinely uninvestigated areas
5. ✓ Centre Functions updated to ✓✓ PROVEN (100%)
6. ✓ Authority, Type, Circuit properly referenced to Book 1

---

## Estimated Scope

| Phase | Files to Read | Estimated Time |
|-------|---------------|----------------|
| 1A | 10 chapters | 20 min |
| 1B | 14 chapters | 30 min |
| 1C | 11 articles | 25 min |
| 1D | 5 files | 15 min |
| 2A | 8 files | 20 min |
| 2B | ~15 priority files | 30 min |
| 2C | ~10 files | 20 min |
| 2D | ~10 files | 15 min |
| 3 | Synthesis | 20 min |
| 4 | Updates | 30 min |
| 5 | Gaps | 10 min |
| **Total** | ~100 files | ~4 hours |

---

## Phase 6: Final Review and Merge

### Step 6.1: Review All Changes

```bash
git log --oneline
# See all commits made during audit

git diff main..HEAD --stat
# See summary of all files changed
```

### Step 6.2: Create Summary of Changes

Create `/docs/research/audit/AUDIT-COMPLETE-SUMMARY.md` with:
- Total files audited
- Key corrections made
- New cross-references added
- Gaps identified
- Recommendations

### Step 6.3: Final Commit

```bash
git add -A
git commit -m "Audit complete: Full derivation cross-reference established

Phases completed:
- Phase 1: Books audited (0, 1, 2, Geometry)
- Phase 2: Research folders audited
- Phase 3: Cross-reference matrix built
- Phase 4: DERIVATION-STATUS-MAP updated
- Phase 5: Gaps identified

Key corrections:
- Centre Functions: 100% derivable (was 78%)
- Pressure = Storage (±3) not Poles (±4)
- All sources now cross-referenced"
```

### Step 6.4: Request Human Review Before Merge

**DO NOT MERGE AUTOMATICALLY.**

Present summary to Rusty for review. Only merge to main after explicit approval:

```bash
# After approval:
git checkout main
git merge audit/derivation-reorganisation-dec2025
git branch -d audit/derivation-reorganisation-dec2025  # Optional: delete branch
```

---

## Notes for Human Review

After Claude Code completes each phase:
1. Review the phase output
2. Flag any questions or concerns
3. Approve before proceeding to next phase

This prevents compounding errors and allows course correction.

### Branch Safety

All work happens on `audit/derivation-reorganisation-dec2025`. If anything goes wrong:

```bash
# Discard all audit changes and return to main:
git checkout main
git branch -D audit/derivation-reorganisation-dec2025
```

The main branch remains untouched until explicit merge approval.

---

*Brief created: 22 December 2025*
*Purpose: Systematic audit to prevent future re-derivation*
*Location: `/docs/research/CLAUDE-CODE-BRIEF-DERIVATION-AUDIT.md`*
