# Git History Investigation Report

**Date:** 22 December 2025
**Investigator:** Claude Code
**Brief:** `CLAUDE-CODE-BRIEF-GIT-HISTORY-INVESTIGATION.md`

---

## Executive Summary

**Key Finding:** No markdown files were ever deleted from the repository. The 15 "missing" framework files were never created as standalone documents.

**Outcome:**
- **0 files** to recover from git history
- **2 files** can be copied directly (exist as standalone derivation files)
- **13 files** require extraction from synthesis documents or book chapters

The derivations exist — they're embedded in larger documents. The framework completion task is an **extraction and formatting** exercise, not a recovery exercise.

---

## Timeline

| Date | Commit | Event |
|------|--------|-------|
| 2025-12-19 | dc93fb3 | Complete Color-Tone-Base geometric derivation |
| 2025-12-20 | 2e599f0 | Pre-audit checkpoint |
| 2025-12-22 | f7793d3 | Phase 1: Books audited |
| 2025-12-22 | 21573c3 | Phase 2: Research folders audited |
| 2025-12-22 | 435e12c | Phase 3: Cross-reference matrix |
| 2025-12-22 | dd7d337 | Phase 4: DERIVATION-STATUS-MAP v3.11 |
| 2025-12-22 | 931d76d | Phase 5: Gaps identified |
| 2025-12-22 | 139d777 | Phase 6: Audit complete |
| 2025-12-22 | 9e0b673 | **Reorganise directories: framework vs investigations** |
| 2025-12-22 | 60a4a86 | Root cleanup, START-HERE created |
| 2025-12-22 | 4af57ce | Investigation framework documents added |

**Pre-reorganisation state:** 47 markdown files in `docs/research/geometric/`, all still present.

---

## Files That Can Be Simply Copied (No Extraction Needed)

| Current Location | Framework Destination |
|------------------|----------------------|
| `docs/research/geometric/SEVEN-CIRCUITS-DERIVATION.md` | `framework/hd-structures/seven-circuits.md` |
| `docs/research/geometric/COLOR-TONE-BASE-COMPLETE-SYNTHESIS.md` | `framework/deep-structure/color-tone-base-structure.md` |

**Status:** Both files are complete, standalone derivations ready for direct copy.

---

## Deleted Files Found

**None.** Git history shows no deleted markdown files. Only SVG visualisation files were ever deleted.

```
git log --diff-filter=D --summary -- "*.md"
# Returns: empty
```

The diff between pre-audit (2e599f0) and HEAD shows only:
- **A** (Added): 150+ new files (audit, books, framework structure)
- **M** (Modified): DERIVATION-STATUS-MAP.md
- **R** (Renamed): electromagnetic-framework-synthesis.md → four-axes-framework.md

---

## Files Never Existed as Standalone — Extraction Required

### Source: GEOMETRIC-FOUNDATIONS-SYNTHESIS.md (22KB)

Contains embedded derivations for:

| Framework File Needed | Section in Synthesis |
|-----------------------|---------------------|
| `trigram-cube/cube-vertices.md` | Phase 1: The Cube Foundation |
| `trigram-cube/position-functions.md` | EM Position functions (-4 to +4) |
| `hexagram-movements/gate-classification.md` | Geometric Classification |
| `hexagram-movements/cross-zero-gates.md` | Cross-Zero Manifesting/Dematerialising |
| `hexagram-movements/same-phase-gates.md` | Same-Phase Void/Material |

### Source: Book 2 - The Proof

| Framework File Needed | Book Chapter |
|-----------------------|--------------|
| `foundation/binary-architecture.md` | Ch 1-2: Binary Periods, Palindrome Principle |
| `foundation/five-constraints.md` | Ch 4: The Tetragrammaton Derived |
| `trigram-cube/standing-waves.md` | Ch 5: Standing Waves as Structural Anchors |
| `topology/torus-knot.md` | Ch 11: Topology of the Wave |
| `topology/double-helix.md` | Ch 11: Topology of the Wave |
| `topology/88-degree-offset.md` | Ch 11: Topology of the Wave (+ Book 0 Ch 6) |

### Source: Book 1 - The Wave + Research Files

| Framework File Needed | Source(s) |
|-----------------------|-----------|
| `lines-profiles/six-lines-octahedron.md` | Book 1 Ch 6 + COLOR-TONE-BASE-COMPLETE-SYNTHESIS.md |
| `lines-profiles/harmonic-pairs.md` | LINE-QUARTER-PATTERNS.md |

---

## Detailed Source Mapping

### 1. foundation/binary-architecture.md

**Sources:**
- `docs/books/book-2-the-proof/01-binary-periods.md`
- `docs/books/book-2-the-proof/02-the-palindrome-principle.md`

**Content:** 2⁶ = 64, binary period analysis, palindrome structure.

### 2. foundation/five-constraints.md

**Primary Source:**
- `docs/books/book-2-the-proof/04-the-tetragrammaton-derived.md`

**Content:** The five constraints that uniquely identify Gates 1, 2, 63, 64 as the Tetragrammaton/Pillars.

### 3. trigram-cube/cube-vertices.md

**Primary Source:**
- `docs/research/geometric/GEOMETRIC-FOUNDATIONS-SYNTHESIS.md` (Phase 1)

**Content:** 8 trigrams = 8 cube vertices, binary coordinates (000 to 111).

### 4. trigram-cube/standing-waves.md

**Primary Source:**
- `docs/books/book-2-the-proof/05-standing-waves-as-structural-anchors.md`

**Content:** 8 doubled trigrams, structural anchors, the diagonal of the 8×8 matrix.

### 5. trigram-cube/position-functions.md

**Primary Source:**
- `docs/research/geometric/GEOMETRIC-FOUNDATIONS-SYNTHESIS.md`

**Content:** EM position function mapping -4 to +4, polarity calculation.

### 6. hexagram-movements/gate-classification.md

**Primary Source:**
- `docs/research/geometric/GEOMETRIC-FOUNDATIONS-SYNTHESIS.md`

**Content:** 4-type classification (Standing Wave, Cross-Zero Manifesting, Cross-Zero Dematerialising, Same-Phase).

### 7. hexagram-movements/cross-zero-gates.md

**Primary Source:**
- `docs/research/geometric/GEOMETRIC-FOUNDATIONS-SYNTHESIS.md`

**Content:** 32 cross-zero gates (16 manifesting, 16 dematerialising), tetrahedra transitions.

### 8. hexagram-movements/same-phase-gates.md

**Primary Source:**
- `docs/research/geometric/GEOMETRIC-FOUNDATIONS-SYNTHESIS.md`

**Content:** 24 same-phase gates (Void and Material circulation).

### 9. lines-profiles/six-lines-octahedron.md

**Sources:**
- `docs/books/book-1-the-wave/06-the-six-lines.md`
- `docs/research/geometric/COLOR-TONE-BASE-COMPLETE-SYNTHESIS.md` (Part II)

**Content:** 6 lines = 6 octahedron vertices, 3 axes × 2 polarities.

### 10. lines-profiles/harmonic-pairs.md

**Sources:**
- `docs/research/geometric/LINE-QUARTER-PATTERNS.md`
- May need supplementation from book content

**Content:** Lines 1↔4, 2↔5, 3↔6 relationships, harmonic resonance.

### 11. topology/torus-knot.md

**Primary Source:**
- `docs/books/book-2-the-proof/11-topology-of-the-wave.md`

**Content:** (2,1) torus knot, Hamiltonian path, figure-8 topology, two zero-crossings.

### 12. topology/double-helix.md

**Sources:**
- `docs/books/book-2-the-proof/11-topology-of-the-wave.md`
- `docs/books/book-0-shape-of-change/BOOK-0-CHAPTER-05-THE-DOUBLE-HELIX.md`

**Content:** Two offset helices, DNA parallel, Personality/Design relationship.

### 13. topology/88-degree-offset.md

**Sources:**
- `docs/books/book-2-the-proof/11-topology-of-the-wave.md`
- `docs/books/book-0-shape-of-change/BOOK-0-CHAPTER-06-THE-2-DEGREES-OF-LIFE.md`
- `docs/research/geometric/FOUR-NODES-TETRAHEDRON-RESEARCH.md`

**Content:** 88° offset, disphenoid geometry, 2.35% difference.

---

## Recommendation

### Immediate Actions

1. **Copy 2 files directly:**
   ```bash
   cp docs/research/geometric/SEVEN-CIRCUITS-DERIVATION.md docs/framework/hd-structures/seven-circuits.md
   cp docs/research/geometric/COLOR-TONE-BASE-COMPLETE-SYNTHESIS.md docs/framework/deep-structure/color-tone-base-structure.md
   ```

2. **Extract and create 13 files** following this priority order:
   - **High priority (empty directories):**
     - trigram-cube/ (3 files from GEOMETRIC-FOUNDATIONS-SYNTHESIS.md)
     - hexagram-movements/ (3 files from GEOMETRIC-FOUNDATIONS-SYNTHESIS.md)
     - topology/ (3 files from Book 2 Ch 11)
   - **Medium priority (partial directories):**
     - foundation/ (2 files from Book 2)
     - lines-profiles/ (2 files from mixed sources)

### Extraction Guidelines

- Extract relevant sections from source documents
- Reformat as standalone derivation files
- Add framework-style headers and navigation
- Cross-reference source documents
- Maintain rigour of original derivations

### Do NOT:
- Recreate derivations from scratch
- Lose attribution to source documents
- Over-simplify the mathematics

---

## Success Criteria Met

| Criterion | Status | Finding |
|-----------|--------|---------|
| Files to relocate | ✅ | 2 files (SEVEN-CIRCUITS-DERIVATION, COLOR-TONE-BASE-COMPLETE-SYNTHESIS) |
| Files to recover from git | ✅ | 0 files (none were deleted) |
| Files to extract from synthesis | ✅ | 8 files (from GEOMETRIC-FOUNDATIONS-SYNTHESIS, books) |
| Files never standalone | ✅ | 5 files (embedded in book chapters only) |

---

*Investigation complete. Proceed to Framework Completion brief for extraction execution.*
