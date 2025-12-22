# CLAUDE CODE BRIEF: Fix Position-Naming Errors

## Context Summary

The HD Knowledge Engine V3 project recently migrated from "Book 0/1/2/3/4" naming to position-based electromagnetic naming. An audit (see `POSITION-NAMING-AUDIT-REPORT.md`) found two categories of errors that need fixing.

---

## THE POSITION MAPPING (Critical Reference)

| Old Name | New Position | Full Title | New Directory Name |
|----------|--------------|------------|-------------------|
| Book 0 | Position -2 | The Shape of Change | `position-minus-2-shape-of-change` |
| Book 1 | Position +1 | The Wave | `position-plus-1-the-wave` |
| Book 2 | Position -1 | The Proof | `position-minus-1-the-proof` |
| Book 3 | Position -3 | The Depth | `position-minus-3-the-depth` |
| Book 4 | Position +3 | The Architecture | `position-plus-3-the-architecture` |
| (new) | Position -4 | The Geometry of Consciousness | `position-minus-4-geometry-of-consciousness` |

---

## FIX 1: Historical Notes in Audit Files (4 files) — CRITICAL

### The Problem
The audit files have notes that were incorrectly modified. They should preserve the OLD "Book X" name for historical accuracy, but they now incorrectly say "Position X".

### Files and Exact Fixes

**File 1:** `/docs/research/audit/PHASE-1A-BOOK-0-AUDIT.md`

Find (near top of file):
```markdown
> **Note:** This audit was conducted when the work was named "Position -2".
```

Replace with:
```markdown
> **Note:** This audit was conducted when the work was named "Book 0".
```

---

**File 2:** `/docs/research/audit/PHASE-1B-BOOK-1-AUDIT.md`

Find:
```markdown
> **Note:** This audit was conducted when the work was named "Position +1".
```

Replace with:
```markdown
> **Note:** This audit was conducted when the work was named "Book 1".
```

---

**File 3:** `/docs/research/audit/PHASE-1C-BOOK-2-AUDIT.md`

Find:
```markdown
> **Note:** This audit was conducted when the work was named "Position -1".
```

Replace with:
```markdown
> **Note:** This audit was conducted when the work was named "Book 2".
```

---

**File 4:** `/docs/research/audit/PHASE-1E-BOOK-3-AUDIT.md`

Find:
```markdown
> **Note:** This audit was conducted when the work was named "Position -3".
```

Replace with:
```markdown
> **Note:** This audit was conducted when the work was named "Book 3".
```

---

## FIX 2: Old Directory Path References (~80 occurrences) — SIGNIFICANT

### The Problem
Many files still reference old directory paths that no longer exist. These are broken references.

### Files to Update (from audit)

1. `/docs/NAVIGATION.md` — multiple old directory references
2. `/docs/CONTENT-STATUS-MAP.md` — references to `book-0-`, `book-1-`, `book-2-`
3. `/docs/research/DERIVATION-STATUS-MAP.md` — references to `EM-Series-Book0/` etc.
4. `/docs/PUBLISHING-ARCHITECTURE/00-MASTER-PLAN.md` — `EM-Series-Book0/` paths
5. `/docs/PUBLISHING-ARCHITECTURE/01-EPUB-GENERATION-PLAN.md` — old paths
6. `/docs/PUBLISHING-ARCHITECTURE/02-IMPLEMENTATION-STATUS.md` — old paths
7. `/docs/framework/deep-structure/color-tone-base-structure.md` — old references
8. Files in `/docs/research/geometric/*.md` — various old path references

### Search and Replace Patterns

**Directory path patterns:**

| Find | Replace With |
|------|--------------|
| `/book-0-shape-of-change/` | `/position-minus-2-shape-of-change/` |
| `/book-1-the-wave/` | `/position-plus-1-the-wave/` |
| `/book-2-the-proof/` | `/position-minus-1-the-proof/` |
| `book-0-shape-of-change` | `position-minus-2-shape-of-change` |
| `book-1-the-wave` | `position-plus-1-the-wave` |
| `book-2-the-proof` | `position-minus-1-the-proof` |

**Archived article series paths (these now point to canonical book locations):**

| Find | Replace With |
|------|--------------|
| `/articles/EM-Series-Book0/` | `/books/position-minus-2-shape-of-change/` |
| `/articles/EM-Series-Book1/` | `/books/position-plus-1-the-wave/` |
| `/articles/EM-Series-Book2/` | `/books/position-minus-1-the-proof/` |
| `EM-Series-Book0` | `position-minus-2-shape-of-change` |
| `EM-Series-Book1` | `position-plus-1-the-wave` |
| `EM-Series-Book2` | `position-minus-1-the-proof` |

### Search Command
```bash
grep -rn "book-0-\|book-1-\|book-2-\|EM-Series-Book" \
  /Volumes/CLAUDE/HD-Knowledge-Engine-V3/docs/ \
  --include="*.md" | grep -v archive
```

---

## WHAT NOT TO CHANGE

1. **Archive directory** — Leave `/docs/archive/` completely untouched
2. **Legacy Naming section** — The POSITION-REFERENCE-CARD.md has an intentional Legacy section
3. **Prose text that already works** — Focus only on path references, not narrative text
4. **Cross-reference matrix abbreviations** — B0, B1, B2 in tables are fine (there's a key)

---

## VERIFICATION

After fixes, run:

```bash
# Should return 0 results (excluding archive)
grep -rn "book-0-\|book-1-\|book-2-\|EM-Series-Book" \
  /Volumes/CLAUDE/HD-Knowledge-Engine-V3/docs/ \
  --include="*.md" | grep -v archive | wc -l
```

Also verify the 4 historical notes now say "Book X" not "Position X":
```bash
grep -n "was named" /Volumes/CLAUDE/HD-Knowledge-Engine-V3/docs/research/audit/PHASE-1*.md
```

---

## GIT COMMIT

After all fixes:
```bash
git add -A
git commit -m "Fix position-naming errors: historical notes and path references"
```

---

## SUCCESS CRITERIA

1. ✅ 4 audit files have correct historical notes (referencing "Book 0/1/2/3" not "Position X")
2. ✅ 0 remaining old directory path references (outside archive)
3. ✅ All path references point to directories that actually exist

---

*Brief created: 22 December 2025*
*Based on: POSITION-NAMING-AUDIT-REPORT.md findings*

