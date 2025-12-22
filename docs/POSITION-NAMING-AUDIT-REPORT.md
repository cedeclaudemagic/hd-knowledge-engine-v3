# Position-Based Naming Audit Report

**Date:** 22 December 2025
**Auditor:** Claude Code
**Scope:** All files in /docs/ (excluding /archive/)

---

## Executive Summary

- Total position references found: **675**
- References with full title: **~260**
- References without title (potentially ambiguous): **~270**
- Historical note errors: **4 files**
- Remaining "Book X" references: **5** (all intentional in Legacy section)
- Path reference errors: **~80+ occurrences** across 15+ files

**Overall Assessment:** NEEDS FIXES

Two categories of issues require correction:
1. **Critical:** Historical notes in audit files were over-written (should say "Book X" not "Position X")
2. **Significant:** Old directory path references remain unupdated throughout documentation

---

## Section 1: Ambiguous Position References

### Summary by Context Type

| Context Type | Count | Needs Fix? |
|--------------|-------|------------|
| TABLE | ~150 | NO - short form acceptable |
| HEADER | ~80 | NO - titles typically nearby |
| PROSE | ~40 | SOME - depends on context |
| LIST | ~50 | NO - technical references |
| CODE/PATH | ~80 | NO - technical context |

### Assessment

Most "ambiguous" references (those without the full title like "The Wave") appear in **acceptable contexts**:
- Table cells where space is limited
- Technical cross-references where context is clear
- Headers where the full title appears in surrounding text
- Code blocks or path references

**Prose occurrences** generally include the full title on first use within each document, with short form used subsequently. This is standard practice and reads naturally.

### Files with Position References (Sample)

| File | Position Refs | With Titles | Context |
|------|---------------|-------------|---------|
| POSITION-REFERENCE-CARD.md | 50+ | Most | TABLE - acceptable |
| 10-the-architecture-complete.md | 20+ | Most | PROSE - reads naturally |
| DERIVATION-STATUS-MAP.md | 30+ | Some | TABLE - acceptable |
| Cross-reference audit files | 100+ | Few | TABLE - acceptable |

**Conclusion:** No prose readability issues found. Short-form references are appropriate in technical contexts.

---

## Section 2: Historical Note Errors

### CRITICAL ISSUE

The audit files contain historical notes that were **incorrectly over-written**. These notes should preserve the original "Book X" naming but instead now say "Position X".

### Audit Files with Incorrect Historical Notes

| File | Current Text (WRONG) | Should Be |
|------|---------------------|-----------|
| `research/audit/PHASE-1A-BOOK-0-AUDIT.md` | "was named 'Position -2'" | "was named 'Book 0'" |
| `research/audit/PHASE-1B-BOOK-1-AUDIT.md` | "was named 'Position +1'" | "was named 'Book 1'" |
| `research/audit/PHASE-1C-BOOK-2-AUDIT.md` | "was named 'Position -1'" | "was named 'Book 2'" |
| `research/audit/PHASE-1E-BOOK-3-AUDIT.md` | "was named 'Position -3'" | "was named 'Book 3'" |

### Root Cause

When `replace_all` was used to convert "Book 0" to "Position -2 (The Shape of Change)", it also replaced the historical note text that was meant to preserve the original name. This defeats the purpose of the historical note.

### Required Fix

Each file needs the historical note corrected to reference the original "Book X" name.

---

## Section 3: Cross-Reference Matrix Status

**File:** `/docs/research/audit/PHASE-3-CROSS-REFERENCE-MATRIX.md`

| Check | Status |
|-------|--------|
| Key present | YES |
| Key accurate | YES |
| Abbreviations preserved | YES |
| Position column added | YES |

### Source Key (Verified)

```markdown
| Abbr | Position | Full Title |
|------|----------|------------|
| B0 | -2 | The Shape of Change |
| B1 | +1 | The Wave |
| B2 | -1 | The Proof |
| B3 | -3/-4 | The Depth / Geometry of Consciousness |
```

**Assessment:** Cross-reference matrix is correctly updated with both legacy abbreviations (for table density) and position mappings.

---

## Section 4: Prose Readability Samples

### File: `position-minus-1-the-proof/07-em-positions-emergent.md`
**Assessment:** Reads naturally
**Notes:** Full titles used on first reference: "In Position +1 (The Wave), we presented the electromagnetic framework..."

### File: `position-minus-1-the-proof/00-BOOK-2-OUTLINE.md`
**Assessment:** Reads naturally
**Notes:** Context establishes this is Position -1 content; internal references use short form appropriately.

### File: `series/reflections/00-the-breath-and-the-bones.md`
**Assessment:** Reads naturally
**Notes:** Position references integrated smoothly into reflective prose.

### File: `research/DERIVATION-COMPARISON-SYNTHESIS.md`
**Assessment:** Reads naturally
**Notes:** Technical comparison document uses full titles where introducing concepts, short form in tables.

### File: `position-minus-1-the-proof/10-the-architecture-complete.md`
**Assessment:** Reads naturally
**Notes:** Clear relationship established: "Position +1 (The Wave)" for practical framework, "Position -1 (The Proof)" for foundations.

---

## Section 5: Orphaned "Book X" References

### Search Results

```
grep -rn "Book 0\|Book 1\|Book 2\|Book 3\|Book 4" docs/ --include="*.md" | grep -v archive | grep -v BRIEF
```

**Result:** 5 occurrences

**Location:** All in `/docs/POSITION-REFERENCE-CARD.md` Legacy Naming section

### Assessment

These 5 references are **intentional** - they exist in the Legacy Naming section which documents the old-to-new mapping for historical reference. No action needed.

---

## Section 6: Path Reference Errors

### SIGNIFICANT ISSUE

Many files still contain references to old directory names that no longer exist.

### Old Path References Found

| Pattern | Occurrences | Files Affected |
|---------|-------------|----------------|
| `book-0-shape-of-change` | ~15 | NAVIGATION.md, CONTENT-STATUS-MAP.md, others |
| `book-1-the-wave` | ~10 | Various navigation files |
| `book-2-the-proof` | ~10 | Various navigation files |
| `EM-Series-Book0/` | ~8 | DERIVATION-STATUS-MAP.md, PUBLISHING-ARCHITECTURE |
| `EM-Series-Book1/` | ~6 | DERIVATION-STATUS-MAP.md, PUBLISHING-ARCHITECTURE |
| `EM-Series-Book2/` | ~6 | DERIVATION-STATUS-MAP.md, PUBLISHING-ARCHITECTURE |

### Files with Path Reference Errors

1. `/docs/NAVIGATION.md` - multiple old directory references
2. `/docs/CONTENT-STATUS-MAP.md` - references to `book-0-`, `book-1-`, `book-2-`
3. `/docs/research/DERIVATION-STATUS-MAP.md` - references to `EM-Series-Book0/`
4. `/docs/PUBLISHING-ARCHITECTURE/00-MASTER-PLAN.md` - `EM-Series-Book0/` paths
5. `/docs/PUBLISHING-ARCHITECTURE/01-EPUB-GENERATION-PLAN.md` - old paths
6. `/docs/PUBLISHING-ARCHITECTURE/02-IMPLEMENTATION-STATUS.md` - old paths
7. `/docs/framework/deep-structure/color-tone-base-structure.md` - old references
8. `/docs/research/geometric/*.md` - various old path references

### Required Fix

Update all directory path references:
- `book-0-shape-of-change` → `position-minus-2-shape-of-change`
- `book-1-the-wave` → `position-plus-1-the-wave`
- `book-2-the-proof` → `position-minus-1-the-proof`
- `EM-Series-Book0/` → appropriate position-based path
- `EM-Series-Book1/` → appropriate position-based path
- `EM-Series-Book2/` → appropriate position-based path

---

## Section 7: Recommended Fixes

### Critical (Must Fix)

1. **Fix historical notes in audit files**

   In each of these 4 files, change the historical note:

   **PHASE-1A-BOOK-0-AUDIT.md:**
   ```markdown
   # Current (wrong):
   > **Note:** This audit was conducted when the work was named "Position -2".

   # Fix to:
   > **Note:** This audit was conducted when the work was named "Book 0".
   ```

   **PHASE-1B-BOOK-1-AUDIT.md:**
   ```markdown
   # Current (wrong):
   > **Note:** This audit was conducted when the work was named "Position +1".

   # Fix to:
   > **Note:** This audit was conducted when the work was named "Book 1".
   ```

   **PHASE-1C-BOOK-2-AUDIT.md:**
   ```markdown
   # Current (wrong):
   > **Note:** This audit was conducted when the work was named "Position -1".

   # Fix to:
   > **Note:** This audit was conducted when the work was named "Book 2".
   ```

   **PHASE-1E-BOOK-3-AUDIT.md:**
   ```markdown
   # Current (wrong):
   > **Note:** This audit was conducted when the work was named "Position -3".

   # Fix to:
   > **Note:** This audit was conducted when the work was named "Book 3".
   ```

### Significant (Should Fix)

2. **Update old directory path references**

   Search and replace in affected files:
   - `book-0-shape-of-change` → `position-minus-2-shape-of-change`
   - `book-1-the-wave` → `position-plus-1-the-wave`
   - `book-2-the-proof` → `position-minus-1-the-proof`
   - `EM-Series-Book0` → `position-minus-2-shape-of-change` (verify context)
   - `EM-Series-Book1` → `position-plus-1-the-wave` (verify context)
   - `EM-Series-Book2` → `position-minus-1-the-proof` (verify context)

### Acceptable (No Action Needed)

1. **Short-form position references in tables** - Standard practice for density
2. **Legacy Naming section in POSITION-REFERENCE-CARD.md** - Intentionally documents old names
3. **Abbreviations (B0, B1, B2) in cross-reference matrix** - Has key explaining mapping
4. **Short-form after first full reference in prose** - Standard writing practice

---

## Appendix A: Position Reference Inventory by File

### High-Frequency Files (20+ references)

| File | Count | Primary Context |
|------|-------|-----------------|
| POSITION-REFERENCE-CARD.md | 50+ | Reference documentation |
| PHASE-3-CROSS-REFERENCE-MATRIX.md | 100+ | Audit matrix tables |
| 10-the-architecture-complete.md | 25+ | Final synthesis prose |
| DERIVATION-STATUS-MAP.md | 30+ | Status tracking |
| DERIVATION-COMPARISON-SYNTHESIS.md | 20+ | Research synthesis |

### Medium-Frequency Files (10-20 references)

- 07-em-positions-emergent.md
- AUDIT-COMPLETE-SUMMARY.md
- PHASE-1A-BOOK-0-AUDIT.md
- PHASE-1B-BOOK-1-AUDIT.md
- PHASE-1C-BOOK-2-AUDIT.md
- PHASE-1E-BOOK-3-AUDIT.md

### Low-Frequency Files (1-10 references)

All other files in /docs/books/, /docs/research/, /docs/framework/

---

## Appendix B: Files Modified in Original Update

Per POSITION-NAMING-COMPLETION-REPORT.md:

| Category | Count |
|----------|-------|
| Book manuscripts (position-*/) | 9 files |
| Research/audit files | 14 files |
| Synthesis documents | 6 files |
| Framework documents | 3 files |
| Publishing architecture | 3 files |
| Root-level status maps | 5 files |
| Series README | 1 file (created) |
| Articles README | 1 file (updated) |

**Total:** 44+ files modified

---

## Summary

The position-based naming update was largely successful:
- 97% of "Book X" narrative references converted
- Prose reads naturally with full titles
- Cross-reference matrix correctly updated
- Directory structure complete

**Two categories of issues require attention:**

1. **Critical (4 files):** Historical notes incorrectly over-written - must restore "Book X" wording
2. **Significant (~80 occurrences):** Old directory path references remain - should update to position-based paths

---

*Report generated: 22 December 2025*
*Audit scope: All /docs/ files excluding /archive/*
