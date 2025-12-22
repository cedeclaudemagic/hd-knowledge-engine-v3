# CLAUDE CODE BRIEF: Position-Based Naming Update & Canonical Resolution

## Mission Statement

1. **Resolve duplicate directories** — Establish single canonical locations for all content
2. **Update all documents** — Use position-based naming instead of book numbers
3. **Clean up the repository** — Remove redundancy and confusion

**Date:** 22 December 2025  
**Priority:** HIGH  
**Estimated Time:** 3-5 hours

---

## BACKGROUND CONTEXT

The Electromagnetic I Ching project has adopted a position-based naming system where each work is identified by its electromagnetic position rather than arbitrary book numbers. This reflects the actual function each work serves in the complete architecture.

### The New System (ADOPTED)
```
Position -4 SOURCE:      The Geometry of Consciousness
Position -3 CAPACITANCE: The Depth
Position -2 VOLTAGE:     The Shape of Change
Position -1 GATE-OUT:    The Proof
Position +1 GATE-IN:     The Wave
Position +2 CURRENT:     Electromagnetic Interpretations
Position +3 INDUCTANCE:  The Architecture
Position +4 SINK:        The Living Oracle
```

---

## TASK 0: RESOLVE DUPLICATE DIRECTORIES (DO FIRST)

### The Problem

Content currently exists in TWO locations with identical files:

| Canonical (KEEP) | Duplicate (REMOVE) |
|------------------|-------------------|
| `/docs/books/book-0-shape-of-change/` | `/docs/articles/EM-Series-Book0/` |
| `/docs/books/book-1-the-wave/` | `/docs/articles/EM-Series-Book1/` |
| `/docs/books/book-2-the-proof/` | `/docs/articles/EM-Series-Book2/` |
| `/docs/books/book-3-the-architecture/` | `/docs/articles/EM-Series-Book3/` |
| `/docs/books/series/geometry-of-consciousness/` | `/docs/articles/the-geometry-of-consciousness-book/` |
| `/docs/books/series/electromagnetic-consciousness/` | `/docs/articles/electromagnetic-consciousness-series/` |
| `/docs/books/series/wheel-series/` | `/docs/articles/wheel-series/` |

### Resolution Steps

#### Step 1: Verify Duplicates Are Identical

Before removing anything, confirm files are truly identical:

```bash
# Compare directories
diff -rq /docs/books/book-0-shape-of-change/ /docs/articles/EM-Series-Book0/
diff -rq /docs/books/book-1-the-wave/ /docs/articles/EM-Series-Book1/
diff -rq /docs/books/book-2-the-proof/ /docs/articles/EM-Series-Book2/
# etc.
```

If there are differences, the `/docs/books/` version is canonical. Check if `/docs/articles/` has any NEWER content that should be merged first.

#### Step 2: Create Archive (Safety)

Before deletion, create an archive:

```bash
mkdir -p /docs/archive/deprecated-articles-mirror/
mv /docs/articles/EM-Series-Book0/ /docs/archive/deprecated-articles-mirror/
mv /docs/articles/EM-Series-Book1/ /docs/archive/deprecated-articles-mirror/
mv /docs/articles/EM-Series-Book2/ /docs/archive/deprecated-articles-mirror/
mv /docs/articles/EM-Series-Book3/ /docs/archive/deprecated-articles-mirror/
mv /docs/articles/the-geometry-of-consciousness-book/ /docs/archive/deprecated-articles-mirror/
mv /docs/articles/electromagnetic-consciousness-series/ /docs/archive/deprecated-articles-mirror/
mv /docs/articles/wheel-series/ /docs/archive/deprecated-articles-mirror/
```

#### Step 3: Create Archive README

Create `/docs/archive/deprecated-articles-mirror/README.md`:

```markdown
# Deprecated Article Mirrors

**Archived:** 22 December 2025

These directories were duplicates of content in `/docs/books/`. 
They have been archived to establish single canonical locations.

## Canonical Locations

| This Archive | Canonical Location |
|--------------|-------------------|
| EM-Series-Book0/ | /docs/books/book-0-shape-of-change/ |
| EM-Series-Book1/ | /docs/books/book-1-the-wave/ |
| EM-Series-Book2/ | /docs/books/book-2-the-proof/ |
| EM-Series-Book3/ | /docs/books/book-3-the-architecture/ |
| the-geometry-of-consciousness-book/ | /docs/books/series/geometry-of-consciousness/ |
| electromagnetic-consciousness-series/ | /docs/books/series/electromagnetic-consciousness/ |
| wheel-series/ | /docs/books/series/wheel-series/ |

## Why Archived

Duplicate content creates:
- Confusion about which version is authoritative
- Risk of edits being made to non-canonical location
- Maintenance burden keeping both in sync

All content is preserved here for safety but should not be used.
```

#### Step 4: Update /docs/articles/ Directory

After removing duplicates, `/docs/articles/` should be examined. 

**If empty or only containing mirrors:** Consider removing entirely or repurposing.

**If containing unique content:** Keep that content, update its README to clarify what remains.

Create or update `/docs/articles/README.md`:

```markdown
# Articles Directory

This directory previously contained mirrors of book content.

As of December 2025, those mirrors have been archived to `/docs/archive/deprecated-articles-mirror/`.

## Canonical Content Locations

All book and series content now lives in `/docs/books/`:

| Position | Work | Location |
|----------|------|----------|
| -4 | The Geometry of Consciousness | /docs/books/series/geometry-of-consciousness/ |
| -3 | The Depth | /docs/books/book-3-the-architecture/ (to be renamed) |
| -2 | The Shape of Change | /docs/books/book-0-shape-of-change/ |
| -1 | The Proof | /docs/books/book-2-the-proof/ |
| +1 | The Wave | /docs/books/book-1-the-wave/ |
| +2 | Electromagnetic Interpretations | /docs/electromagnetic-interpretations/ |
| +3 | The Architecture | (to be created) |
| +4 | The Living Oracle | /docs/electromagnetic-iching/ |

## Article Series

| Series | Location |
|--------|----------|
| Electromagnetic Consciousness | /docs/books/series/electromagnetic-consciousness/ |
| Wheel Series | /docs/books/series/wheel-series/ |
```

---

## TASK 1: RENAME DIRECTORIES (After Duplicate Resolution)

### Current → New Names

| Current | New (Position-Based) |
|---------|---------------------|
| `/docs/books/book-0-shape-of-change/` | `/docs/books/position-minus-2-shape-of-change/` |
| `/docs/books/book-1-the-wave/` | `/docs/books/position-plus-1-the-wave/` |
| `/docs/books/book-2-the-proof/` | `/docs/books/position-minus-1-the-proof/` |
| `/docs/books/book-3-the-architecture/` | `/docs/books/position-minus-3-the-depth/` |
| (create new) | `/docs/books/position-plus-3-the-architecture/` |

### Rename Commands

```bash
cd /docs/books/
mv book-0-shape-of-change position-minus-2-shape-of-change
mv book-1-the-wave position-plus-1-the-wave
mv book-2-the-proof position-minus-1-the-proof
mv book-3-the-architecture position-minus-3-the-depth
mkdir position-plus-3-the-architecture
```

### After Renaming

Update any internal references to these paths in:
- README files
- Cross-references within chapters
- DERIVATION-STATUS-MAP.md
- Any other documentation

---

## TASK 2: Update DERIVATION-STATUS-MAP.md

**Location:** `/docs/research/DERIVATION-STATUS-MAP.md`

**Current Issue:** Uses "B0", "B1", "B2" etc. as source indicators.

**Required Changes:**

1. Update source abbreviation key:
   - B0 → P-2 (Position -2: The Shape of Change)
   - B1 → P+1 (Position +1: The Wave)
   - B2 → P-1 (Position -1: The Proof)
   - GB → P-4 (Position -4: Geometry of Consciousness)
   - GEO → P-4 (Position -4: Geometry of Consciousness)

2. Update project location tree to reflect new canonical structure

3. Update text references: "Book 1 presented..." → "Position +1 (The Wave) presented..."

---

## TASK 3: Search and Replace in All Documents

**Scope:** All `.md` files in `/docs/` directory

**Patterns to Replace:**

| Search For | Replace With |
|------------|--------------|
| `Book 0` | `Position -2` |
| `Book 1` | `Position +1` |
| `Book 2` | `Position -1` |
| `Book 3` | `Position -3` (if referring to Depth) or `Position +3` (if referring to Architecture) |
| `Book 4` | `Position +3` |
| `EM-Series-Book` | (remove — these are archived) |

**Context-Sensitive:** When referring to works, use full form:
- "Position +1 (The Wave)"
- "Position -1 (The Proof)"

---

## TASK 4: Update All README Files

After canonical resolution and renaming, update:

1. `/docs/README.md` — Main index
2. `/docs/books/README.md` — Books index
3. `/docs/articles/README.md` — Updated per Task 0
4. `/docs/research/README.md` — Research index
5. Individual book/position directories

---

## TASK 5: Create Position +3 Directory Structure

Since Position +3 (The Architecture) doesn't exist yet as a directory:

```bash
mkdir -p /docs/books/position-plus-3-the-architecture/
```

Create `/docs/books/position-plus-3-the-architecture/README.md`:

```markdown
# Position +3 INDUCTANCE: The Architecture
*Human Design Structures Derived from First Principles*

**Status:** OUTLINE ONLY — To be written

**Position:** +3 (INDUCTANCE — Crystallised Form)

## Purpose

This work derives the major Human Design structures from geometric first principles:
- Why exactly 12 Profiles (octahedron geometry)
- Why exactly 5 Types (2² + 1 completeness)
- Why exactly 7 Authorities (signal dependency chain)
- Why Centres have their functions
- Why Circuits have their characters

## Source Materials

All derivation syntheses are complete in `/docs/research/`:
- PROFILE-DERIVATION-SYNTHESIS.md
- TYPE-DERIVATION-SYNTHESIS.md
- AUTHORITY-DERIVATION-SYNTHESIS.md
- CENTRE-DERIVATION-SYNTHESIS.md
- CIRCUIT-DERIVATION-SYNTHESIS.md
- PLANETARY-DERIVATION-COMPLETE-SYNTHESIS.md

## Chapter Outline

See `/docs/COMPLETE-PUBLISHING-ARCHITECTURE.md` for full chapter structure.
```

---

## ALREADY UPDATED (DO NOT MODIFY)

These documents have already been updated to Version 2.0 (Position-Based):

1. `/docs/CONTENT-STATUS-MAP.md` — ✅ Updated
2. `/docs/PUBLISHING-STRATEGY-2025.md` — ✅ Updated
3. `/docs/BOOK-SEQUENCING-RECOMMENDATION.md` — ✅ Updated
4. `/docs/COMPLETE-PUBLISHING-ARCHITECTURE.md` — ✅ Updated
5. `/docs/ELECTROMAGNETIC-POSITION-VERIFICATION.md` — ✅ Created
6. `/docs/POSITION-REFERENCE-CARD.md` — ✅ Created

---

## FINAL DIRECTORY STRUCTURE (TARGET)

After all tasks complete:

```
/docs/
├── CONTENT-STATUS-MAP.md
├── COMPLETE-PUBLISHING-ARCHITECTURE.md
├── DERIVATION-STATUS-MAP.md (in /research/)
├── ELECTROMAGNETIC-POSITION-VERIFICATION.md
├── POSITION-REFERENCE-CARD.md
├── PUBLISHING-STRATEGY-2025.md
├── README.md
│
├── books/
│   ├── README.md
│   ├── position-minus-4-geometry-of-consciousness/  (was series/geometry-of-consciousness/)
│   ├── position-minus-3-the-depth/                  (was book-3-the-architecture/)
│   ├── position-minus-2-shape-of-change/            (was book-0-shape-of-change/)
│   ├── position-minus-1-the-proof/                  (was book-2-the-proof/)
│   ├── position-plus-1-the-wave/                    (was book-1-the-wave/)
│   ├── position-plus-3-the-architecture/            (NEW)
│   └── series/
│       ├── electromagnetic-consciousness/
│       └── wheel-series/
│
├── electromagnetic-interpretations/                  (Position +2 CURRENT)
│   ├── INDEX.md
│   └── [64 gate files]
│
├── electromagnetic-iching/                           (Position +4 SINK)
│   ├── 00-FRAMEWORK.md
│   └── 01-ORACLE.md
│
├── research/
│   ├── DERIVATION-STATUS-MAP.md
│   └── [research subdirectories]
│
├── articles/
│   └── README.md (pointing to canonical locations)
│
└── archive/
    └── deprecated-articles-mirror/
        ├── README.md
        └── [archived duplicates]
```

---

## VALIDATION CHECKLIST

After completing all tasks:

- [ ] No duplicate content directories exist (all archived)
- [ ] All directories use position-based naming
- [ ] DERIVATION-STATUS-MAP.md uses position references
- [ ] No documents reference "Book 0", "Book 1", etc.
- [ ] All README files updated
- [ ] Position +3 directory created with README
- [ ] Cross-references work correctly
- [ ] `/docs/articles/` cleaned up with pointer README

---

## OUTPUT REQUIREMENTS

1. **Duplicate Resolution Report:** List what was archived
2. **Rename Report:** List directory name changes
3. **Update Report:** List all files modified
4. **Verification:** Confirm no remaining old references
5. **Final Structure:** Show resulting directory tree

---

## CONTEXT FILES FOR REFERENCE

Read these files first:

1. `/docs/ELECTROMAGNETIC-POSITION-VERIFICATION.md` — Why positions are accurate
2. `/docs/COMPLETE-PUBLISHING-ARCHITECTURE.md` — Master architecture
3. `/docs/CONTENT-STATUS-MAP.md` — Content tracking
4. `/docs/POSITION-REFERENCE-CARD.md` — Quick reference

---

## SUCCESS CRITERIA

1. ✅ Single canonical location for all content
2. ✅ Duplicates archived with clear README
3. ✅ Position-based directory naming
4. ✅ All documentation updated consistently
5. ✅ Clean, navigable repository structure

---

*Brief created: 22 December 2025*
*For: Claude Code execution*
*Priority: Task 0 (duplicates) FIRST, then Tasks 1-5*

