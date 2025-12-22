# CLAUDE CODE BRIEF: Documentation Cleanup

## Mission

Clean up the `/docs/` root directory by archiving completed migration work and consolidating overlapping documents. The goal is a clean, navigable documentation structure.

**Date:** 22 December 2025  
**Priority:** LOW (housekeeping)  
**Estimated Time:** 30 minutes

---

## CONTEXT

The HD Knowledge Engine V3 project just completed a major migration from "Book 0/1/2/3/4" naming to position-based electromagnetic naming. This generated several briefs, reports, and planning documents that are now cluttering the `/docs/` root.

---

## TASK 1: Archive Migration Documents

### Create Archive Directory

```bash
mkdir -p /docs/archive/position-naming-migration-dec2025/
```

### Move Completed Briefs (4 files)

These briefs were instructions for the migration work. Now complete, they're historical records:

```
CLAUDE-CODE-BRIEF-FIX-ERRORS.md
CLAUDE-CODE-BRIEF-POSITION-NAMING-AUDIT.md
CLAUDE-CODE-BRIEF-POSITION-NAMING-UPDATE.md
CLAUDE-CODE-BRIEF-VERIFICATION-COMPLETION.md
```

Move all to `/docs/archive/position-naming-migration-dec2025/`

### Move Completion Reports (2 files)

These document what was done during the migration:

```
POSITION-NAMING-AUDIT-REPORT.md
POSITION-NAMING-COMPLETION-REPORT.md
```

Move both to `/docs/archive/position-naming-migration-dec2025/`

### Create Archive README

Create `/docs/archive/position-naming-migration-dec2025/README.md`:

```markdown
# Position-Based Naming Migration Archive

**Date:** December 2025
**Status:** COMPLETE

## What This Contains

Documentation from the migration of HD Knowledge Engine V3 from "Book 0/1/2/3/4" naming to position-based electromagnetic naming.

## Files

### Briefs (Instructions)
- `CLAUDE-CODE-BRIEF-POSITION-NAMING-UPDATE.md` — Initial migration instructions
- `CLAUDE-CODE-BRIEF-VERIFICATION-COMPLETION.md` — Verification phase instructions
- `CLAUDE-CODE-BRIEF-POSITION-NAMING-AUDIT.md` — Audit phase instructions
- `CLAUDE-CODE-BRIEF-FIX-ERRORS.md` — Error correction instructions

### Reports (Results)
- `POSITION-NAMING-AUDIT-REPORT.md` — Comprehensive audit findings
- `POSITION-NAMING-COMPLETION-REPORT.md` — Final completion summary

## Key Commits

- `9ab14b6` — Pre-restructure checkpoint
- `75903b4` — Phase 1 (archives, renames, initial updates)
- `37b7c22` — Complete (final README updates)
- `982dbab` — Narrative reference updates
- `5dcd170` — Fix historical notes and path references

## Outcome

Successfully migrated all documentation to position-based naming system.
See `/docs/POSITION-REFERENCE-CARD.md` for the position system reference.
```

---

## TASK 2: Consolidate Strategic Documents

### Documents to Review

These documents have overlapping content:

| Document | Primary Content | Decision |
|----------|-----------------|----------|
| `PUBLISHING-STRATEGY-2025.md` | Year-long release plan | KEEP as master |
| `BOOK-SEQUENCING-RECOMMENDATION.md` | Write +3 before -3 | ARCHIVE (content in strategy) |
| `COMPLETE-PUBLISHING-ARCHITECTURE.md` | Position descriptions | ARCHIVE (content in strategy + reference card) |
| `ELECTROMAGNETIC-POSITION-VERIFICATION.md` | Why positions are correct | ARCHIVE (reference value, but detail not needed daily) |

### Action

Move these 3 files to `/docs/archive/position-naming-migration-dec2025/strategic-planning/`:

```bash
mkdir -p /docs/archive/position-naming-migration-dec2025/strategic-planning/
mv BOOK-SEQUENCING-RECOMMENDATION.md /docs/archive/position-naming-migration-dec2025/strategic-planning/
mv COMPLETE-PUBLISHING-ARCHITECTURE.md /docs/archive/position-naming-migration-dec2025/strategic-planning/
mv ELECTROMAGNETIC-POSITION-VERIFICATION.md /docs/archive/position-naming-migration-dec2025/strategic-planning/
```

### Update Archive README

Add to the archive README:

```markdown
### Strategic Planning (Consolidated)
- `strategic-planning/BOOK-SEQUENCING-RECOMMENDATION.md` — Analysis of writing order
- `strategic-planning/COMPLETE-PUBLISHING-ARCHITECTURE.md` — Full architecture description
- `strategic-planning/ELECTROMAGNETIC-POSITION-VERIFICATION.md` — Position mapping verification

These documents informed `PUBLISHING-STRATEGY-2025.md` which remains the active strategic document.
```

---

## TASK 3: Verify Clean Root Structure

After cleanup, `/docs/` root should contain:

### Core Reference (6 files)
```
README.md                    — Main entry point
NAVIGATION.md                — Directory guide
POSITION-REFERENCE-CARD.md   — Position system quick reference
CONTENT-STATUS-MAP.md        — What is written vs outlined
DERIVATION-STATUS-MAP.md     — What is proven vs mapped (in /research/)
COMPLETE-BOOK-SERIES-OUTLINE.md — Full series structure
```

### Active Strategy (1 file)
```
PUBLISHING-STRATEGY-2025.md  — Year-long release plan
```

### Directories
```
archive/                     — Historical/deprecated content
articles/                    — Standalone articles (mostly pointer now)
books/                       — Position-based book content
electromagnetic-iching/      — Position +4: The Living Oracle
electromagnetic-interpretations/ — Position +2: Gate interpretations
framework/                   — Proven derivations
investigations/              — Active research
PUBLISHING-ARCHITECTURE/     — Publishing workflow docs
reference/                   — Reference materials
research/                    — Research syntheses
```

---

## TASK 4: Update README.md

Check `/docs/README.md` and ensure it reflects the clean structure. The Key Documents table should reference only the files that remain:

```markdown
## Key Documents

| Document | Purpose |
|----------|---------|
| [POSITION-REFERENCE-CARD.md](./POSITION-REFERENCE-CARD.md) | Quick reference for position system |
| [NAVIGATION.md](./NAVIGATION.md) | Directory structure guide |
| [CONTENT-STATUS-MAP.md](./CONTENT-STATUS-MAP.md) | What is written vs outlined |
| [PUBLISHING-STRATEGY-2025.md](./PUBLISHING-STRATEGY-2025.md) | Year-long release plan |
| [COMPLETE-BOOK-SERIES-OUTLINE.md](./COMPLETE-BOOK-SERIES-OUTLINE.md) | Full series architecture |
| [research/DERIVATION-STATUS-MAP.md](./research/DERIVATION-STATUS-MAP.md) | Master derivation tracking |
```

Remove any references to archived documents.

---

## TASK 5: Check PUBLISHING-ARCHITECTURE Directory

List contents of `/docs/PUBLISHING-ARCHITECTURE/` and assess:
- Is this still needed as a separate directory?
- Does it duplicate content now in PUBLISHING-STRATEGY-2025.md?
- If it contains useful workflow/technical docs (epub generation, etc.), keep it
- If it's just planning docs, consider archiving or consolidating

Report findings but don't archive without confirmation.

---

## VERIFICATION

After cleanup:

```bash
# List root files (should be ~7-8 files + directories)
ls -la /docs/*.md

# Confirm archive created
ls -la /docs/archive/position-naming-migration-dec2025/

# Confirm strategic planning subdirectory
ls -la /docs/archive/position-naming-migration-dec2025/strategic-planning/
```

---

## GIT COMMIT

```bash
git add -A
git commit -m "Cleanup: archive migration docs, consolidate strategic planning"
```

---

## FINAL STRUCTURE TARGET

```
/docs/
├── README.md
├── NAVIGATION.md
├── POSITION-REFERENCE-CARD.md
├── CONTENT-STATUS-MAP.md
├── COMPLETE-BOOK-SERIES-OUTLINE.md
├── PUBLISHING-STRATEGY-2025.md
│
├── archive/
│   ├── position-naming-migration-dec2025/
│   │   ├── README.md
│   │   ├── CLAUDE-CODE-BRIEF-*.md (4 files)
│   │   ├── POSITION-NAMING-*-REPORT.md (2 files)
│   │   └── strategic-planning/
│   │       ├── BOOK-SEQUENCING-RECOMMENDATION.md
│   │       ├── COMPLETE-PUBLISHING-ARCHITECTURE.md
│   │       └── ELECTROMAGNETIC-POSITION-VERIFICATION.md
│   └── deprecated-articles-mirror/
│       └── (existing archived content)
│
├── books/
├── electromagnetic-interpretations/
├── electromagnetic-iching/
├── framework/
├── investigations/
├── PUBLISHING-ARCHITECTURE/
├── reference/
└── research/
    └── DERIVATION-STATUS-MAP.md
```

---

## SUCCESS CRITERIA

1. ✅ `/docs/` root contains only active reference docs (~7 files)
2. ✅ Migration briefs/reports archived with README explaining them
3. ✅ Strategic documents consolidated (one master: PUBLISHING-STRATEGY-2025.md)
4. ✅ Archive has clear structure and documentation
5. ✅ Main README.md updated to reflect clean structure

---

*Brief created: 22 December 2025*
*Purpose: Housekeeping after position-naming migration*

