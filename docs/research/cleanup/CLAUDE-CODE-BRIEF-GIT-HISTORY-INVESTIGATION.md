# CLAUDE CODE BRIEF: Git History Investigation for Missing Framework Files

## Mission Statement

Investigate the git history of HD-Knowledge-Engine-V3 to locate derivation documents that may have existed before reorganisation. The goal is to **recover existing work** rather than recreate it.

---

# PART 1: PROJECT CONTEXT

## What Is This Project?

**HD Knowledge Engine V3** is a multi-year research project proving that Human Design and the I Ching are **geometrically derived** — not invented wisdom traditions, but discovered mathematical structures.

**Key Collaborator:** Rusty Salmon — Author and researcher. British English preferred. Values rigorous derivation over mystical hand-waving.

**Core Discovery:** The I Ching's 64 hexagrams and Human Design's architecture emerge from geometric necessity:
- 8 trigrams = vertices of a cube (binary coordinates)
- 64 hexagrams = movements between cube vertices
- 6 lines = vertices of an octahedron (dual of cube)
- 12 profiles = octahedron × 2 distances
- The wheel traces a (2,1) torus knot
- 88° offset between Design/Personality creates the double helix of life

---

## Project Location and Structure

**Root:** `/Volumes/CLAUDE/HD-Knowledge-Engine-V3/`

### The Four Systems

```
HD-Knowledge-Engine-V3/
├── docs/                          # Research & documentation
│   ├── DERIVATION-STATUS-MAP.md   # Master index of all derivations (v3.11)
│   ├── NAVIGATION.md              # Navigation guide
│   ├── books/                     # Published book content
│   │   ├── book-0-shape-of-change/   # 10 chapters
│   │   ├── book-1-the-wave/          # 14 chapters  
│   │   ├── book-2-the-proof/         # 11 articles
│   │   └── book-3-the-architecture/  # In progress
│   ├── framework/                 # PROVEN derivations (PARTIALLY POPULATED)
│   ├── investigations/            # OUTSTANDING work
│   └── research/                  # Working research files
│       ├── geometric/             # ~50 files - main derivation work
│       ├── electromagnetic-framework/  # Core EM theory
│       ├── planetary/             # Planetary research (~40% derivable)
│       ├── circuit/               # Circuit derivations
│       ├── profile/               # Profile derivation
│       ├── type/                  # Type derivation
│       ├── authority/             # Authority derivation
│       ├── centre/                # Centre derivation
│       └── audit/                 # December 2025 audit files
├── skills/                        # Claude learning skills
│   ├── hd-mathematics/            # Position derivation (validated)
│   └── hd-electromagnetic-framework/  # EM interpretation (validated)
├── knowledge-systems/             # Structured HD data
├── visualization/                 # Mandala generation
└── core/                          # Query engine
```

### The Flow

```
Research (prove it) → Books (document it) → Framework (canonise it) → Skills (teach Claude)
```

---

## The Books and Their Derivations

The books document derivations that were **completed** during research sessions:

| Book | Content | Written |
|------|---------|---------|
| **Book 0: Shape of Change** | Visual introduction to the geometry | Early-mid 2025 |
| **Book 1: The Wave** | Practical framework (positions, centres, types, authority) | Mid 2025 |
| **Book 2: The Proof** | Formal mathematical derivations | Mid-late 2025 |
| **Book 3: The Architecture** | Deep structure (Lock-Key, CTB) | Late 2025 |

**Key Point:** Each book chapter documents a derivation. That derivation was *done* somewhere — either in standalone research files or directly in the book chapter. The research files may still exist in git history.

---

## What Happened: The December 2025 Reorganisation

Three briefs were created for a major reorganisation:

| Brief | Status | Result |
|-------|--------|--------|
| `CLAUDE-CODE-BRIEF-DERIVATION-AUDIT.md` | ✅ COMPLETE | All audit phases done, cross-references built |
| `CLAUDE-CODE-BRIEF-ROOT-CLEANUP.md` | ✅ COMPLETE | START-HERE.md created, root cleaned |
| `CLAUDE-CODE-BRIEF-DIRECTORY-REORGANISATION.md` | ⚠️ PARTIAL | Structure created, but files not moved |

### The Partial Execution Problem

The Directory Reorganisation brief specified moving 7 files to `/docs/framework/`:

| Source | Destination | Status |
|--------|-------------|--------|
| `electromagnetic-framework-synthesis.md` | `framework/foundation/four-axes-framework.md` | ✅ Moved |
| `centre-electromagnetic-profiles.md` | `framework/hd-structures/nine-centres.md` | ✅ Moved |
| `authority-electromagnetic-analysis.md` | `framework/hd-structures/seven-authorities.md` | ✅ Moved |
| `type-determination-analysis.md` | `framework/hd-structures/five-types.md` | ✅ Moved |
| `PROFILE-DERIVATION-SYNTHESIS.md` | `framework/lines-profiles/twelve-profiles.md` | ✅ Moved |
| `LOCK-KEY-SYNTHESIS.md` | `framework/deep-structure/lock-key-synthesis.md` | ✅ Moved |
| `FOUR-NODES-TETRAHEDRON-RESEARCH.md` | `framework/deep-structure/four-nodes-disphenoid.md` | ✅ Moved |

**BUT:** The framework README describes a structure with **22 files**. Only the 7 moves were specified. The other 15 files were **never mapped to sources**.

---

## Current State: The Gap

```
framework/
├── foundation/           # Expected: 3, Have: 1   → MISSING 2
│   └── four-axes-framework.md ✓
├── trigram-cube/         # Expected: 3, Have: 0   → MISSING 3 (EMPTY)
├── hexagram-movements/   # Expected: 3, Have: 0   → MISSING 3 (EMPTY)
├── lines-profiles/       # Expected: 3, Have: 1   → MISSING 2
│   └── twelve-profiles.md ✓
├── hd-structures/        # Expected: 4, Have: 3   → MISSING 1
│   ├── nine-centres.md ✓
│   ├── five-types.md ✓
│   └── seven-authorities.md ✓
├── topology/             # Expected: 3, Have: 0   → MISSING 3 (EMPTY)
└── deep-structure/       # Expected: 3, Have: 2   → MISSING 1
    ├── lock-key-synthesis.md ✓
    └── four-nodes-disphenoid.md ✓
```

**15 files missing. 3 directories completely empty.**

---

## The Question This Brief Investigates

The derivations for those 15 missing topics **were done** — they're in the books. But were they written as:

**A) Standalone research files** that were later consolidated/deleted?
→ *Recoverable from git history*

**B) Directly into book chapters or synthesis documents?**
→ *Would require extraction, not recovery*

Git history will tell us which scenario applies.

---

## Key Files to Know About

### Large Synthesis Documents (may contain embedded derivations)

| File | Size | Contains |
|------|------|----------|
| `research/geometric/GEOMETRIC-FOUNDATIONS-SYNTHESIS.md` | 22KB | Phases 1-5 synthesis, cube vertices, torus knot, etc. |
| `research/geometric/COLOR-TONE-BASE-COMPLETE-SYNTHESIS.md` | Large | 69,120 positions, Lock-Key architecture |
| `research/electromagnetic-framework/electromagnetic-framework-synthesis.md` | Large | Four Axes, gate classification |

### Standalone Derivation Files That DO Exist

| File | Topic |
|------|-------|
| `research/geometric/SEVEN-CIRCUITS-DERIVATION.md` | 7 circuits (6+1 structure) |
| `research/geometric/LINE-QUARTER-PATTERNS.md` | Lines and bigram tiers |
| `research/geometric/QUARTER-BIGRAM-DERIVATION.md` | Quarter EM correlation |
| `research/geometric/FACE-BIGRAM-DERIVATION.md` | Face EM correlation |

These exist but weren't moved to framework. Some of the "missing" files may simply need relocation, not recovery.

---

## The Master Index: DERIVATION-STATUS-MAP.md

Located at `/docs/DERIVATION-STATUS-MAP.md` (also copy at `/docs/research/DERIVATION-STATUS-MAP.md`)

**Version:** 3.11 (Post-Audit Edition, 22 December 2025)

**Statistics:**
- 89 elements PROVEN
- 37 elements MAPPED  
- 20 elements confirmed EMPIRICAL
- 3 elements OUTSTANDING

This document lists every derivation and its status. Use it to understand what should exist.

---

# PART 2: THE INVESTIGATION

## Objective

Search git history to find:
1. **Deleted files** that contained the missing derivations
2. **The pre-reorganisation state** of the repository
3. **When and how** files were consolidated or removed
4. **Candidate files** for recovery

---

## Phase 1: Understand the Git Timeline

```bash
cd /Volumes/CLAUDE/HD-Knowledge-Engine-V3

# View commit history (last 50 commits with dates)
git log --oneline --date=short --format="%h %ad %s" -50

# Find major reorganisation commits
git log --oneline --all | grep -i "reorgani"
git log --oneline --all | grep -i "cleanup"
git log --oneline --all | grep -i "move"
git log --oneline --all | grep -i "audit"
git log --oneline --all | grep -i "framework"

# Identify key dates:
# - When were books written?
# - When did December 2025 reorganisation happen?
# - When was the audit branch created/merged?
```

**Output needed:** Timeline showing:
- Book creation dates
- Major reorganisation commits
- The "before reorganisation" commit hash

---

## Phase 2: Check What Files Exist NOW That Could Be Relocated

Before searching history, verify what already exists that could simply be moved:

```bash
# Files in research/geometric/ that might map to missing framework files
ls -la docs/research/geometric/ | grep -i "derivation\|synthesis"

# Specifically check for:
ls -la docs/research/geometric/SEVEN-CIRCUITS-DERIVATION.md
ls -la docs/research/geometric/COLOR-TONE-BASE-COMPLETE-SYNTHESIS.md
ls -la docs/research/geometric/LINE-QUARTER-PATTERNS.md

# Check research/circuit/
ls -la docs/research/circuit/
```

**Output needed:** List of existing files that could be relocated without recovery.

---

## Phase 3: Find Deleted Files

```bash
# List all files that have EVER been deleted
git log --diff-filter=D --summary | grep "delete mode" | head -100

# Search for deleted files matching our missing topics
git log --diff-filter=D --summary | grep -i "trigram"
git log --diff-filter=D --summary | grep -i "cube"
git log --diff-filter=D --summary | grep -i "standing-wave"
git log --diff-filter=D --summary | grep -i "torus"
git log --diff-filter=D --summary | grep -i "helix"
git log --diff-filter=D --summary | grep -i "binary"
git log --diff-filter=D --summary | grep -i "tetragrammaton"
git log --diff-filter=D --summary | grep -i "constraint"
git log --diff-filter=D --summary | grep -i "octahedron"
git log --diff-filter=D --summary | grep -i "harmonic"
git log --diff-filter=D --summary | grep -i "gate-class"
git log --diff-filter=D --summary | grep -i "cross-zero"
git log --diff-filter=D --summary | grep -i "same-phase"
git log --diff-filter=D --summary | grep -i "topology"
```

**Output needed:** List of potentially relevant deleted files with their commit hashes.

---

## Phase 4: Examine Pre-Reorganisation State

```bash
# List all branches (there may be an audit branch)
git branch -a

# Find the pre-reorganisation commit
# Look for commits just before "audit" or "reorganisation" commits

# List what existed BEFORE reorganisation (use hash from Phase 1)
git ls-tree -r --name-only <PRE-REORG-HASH> docs/research/ | head -100

# Compare: what changed between then and now?
git diff --name-status <PRE-REORG-HASH> HEAD -- docs/ | head -100
```

**Output needed:** Complete file listing from before reorganisation.

---

## Phase 5: Search for Specific Content in History

For missing derivations, search for files that contained the key content:

```bash
# Cube vertices derivation
git log -p --all -S "trigrams ARE the 8 vertices of a cube" -- "*.md" | head -50

# Tetragrammaton/five constraints
git log -p --all -S "five constraints" -- "*.md" | head -50

# Torus knot topology
git log -p --all -S "torus knot" -- "*.md" | head -50
git log -p --all -S "(2,1) torus" -- "*.md" | head -50

# Standing waves
git log -p --all -S "8 standing wave" -- "*.md" | head -50

# Binary periods/palindromes
git log -p --all -S "binary period" -- "*.md" | head -50

# 88 degree offset
git log -p --all -S "88°" -- "*.md" | head -50
git log -p --all -S "88 degree" -- "*.md" | head -50

# Double helix
git log -p --all -S "double helix" -- "*.md" | head -50
```

**Output needed:** File paths and commits where this content first appeared.

---

## Phase 6: Recover and Evaluate Candidates

For any promising files found:

```bash
# View content of a file at a specific commit (without checking out)
git show <COMMIT_HASH>:<FILE_PATH>

# If file looks useful, restore it for inspection
git checkout <COMMIT_HASH> -- <FILE_PATH>
# (This puts the file in working directory)

# After inspection, either keep or remove
git checkout HEAD -- <FILE_PATH>  # Remove restored file
```

**Output needed:** Recovered file contents for evaluation.

---

## Missing File Topics (15)

| # | Framework File Needed | Search Terms | Likely Original Name |
|---|----------------------|--------------|---------------------|
| 1 | `foundation/binary-architecture.md` | "2⁶ = 64", "binary period", "palindrome" | `*binary*.md`, `*period*.md` |
| 2 | `foundation/five-constraints.md` | "five constraints", "Tetragrammaton" | `*tetragrammaton*.md`, `*pillar*.md` |
| 3 | `trigram-cube/cube-vertices.md` | "cube vertices", "trigrams = cube" | `*cube*.md` |
| 4 | `trigram-cube/standing-waves.md` | "standing wave", "doubled trigram" | `*standing*.md` |
| 5 | `trigram-cube/position-functions.md` | "position function", "-4 to +4" | `*position*.md` |
| 6 | `hexagram-movements/gate-classification.md` | "gate classification", "4 types" | `*classification*.md` |
| 7 | `hexagram-movements/cross-zero-gates.md` | "cross-zero", "manifesting" | `*cross-zero*.md` |
| 8 | `hexagram-movements/same-phase-gates.md` | "same-phase", "circulation" | `*same-phase*.md` |
| 9 | `lines-profiles/six-lines-octahedron.md` | "octahedron", "6 lines" | `*octahedron*.md`, `*line*.md` |
| 10 | `lines-profiles/harmonic-pairs.md` | "harmonic pair", "1-4, 2-5, 3-6" | `*harmonic*.md` |
| 11 | `hd-structures/seven-circuits.md` | "seven circuits", "6+1" | `SEVEN-CIRCUITS-DERIVATION.md` ← likely exists |
| 12 | `topology/torus-knot.md` | "torus knot", "(2,1)", "Hamiltonian" | `*torus*.md`, `*topology*.md` |
| 13 | `topology/double-helix.md` | "double helix", "DNA", "two cubes" | `*helix*.md` |
| 14 | `topology/88-degree-offset.md` | "88°", "2.35%", "disphenoid" | `*88*.md`, `*offset*.md` |
| 15 | `deep-structure/color-tone-base-structure.md` | "69,120", "6-6-6-5" | `COLOR-TONE-BASE-COMPLETE-SYNTHESIS.md` ← likely exists |

---

## Output: Create Investigation Report

Save findings to `/docs/research/cleanup/GIT-HISTORY-INVESTIGATION-REPORT.md`:

```markdown
# Git History Investigation Report

**Date:** [date]
**Investigator:** Claude Code

## Executive Summary
[One paragraph: what was found, recommendation]

## Timeline
| Date | Commit | Event |
|------|--------|-------|

## Files That Can Be Simply Relocated (No Recovery Needed)
| Current Location | Should Move To |
|------------------|----------------|

## Deleted Files Found
| File | Deleted In Commit | Relevant To | Worth Recovering? |
|------|-------------------|-------------|-------------------|

## Files Never Existed as Standalone
[List of topics that were always embedded in larger documents]

## Recovery Candidates
[Files recovered for evaluation, with assessment]

## Recommendation
[Specific next steps: relocate X, recover Y, extract Z]
```

---

## Important Notes

1. **Read-only first** — Map everything before restoring any files
2. **Document findings** — Even "not found" is valuable information
3. **Check existing files** — Some "missing" files may just need relocation
4. **Check the audit branch** — `audit/derivation-reorganisation-dec2025` may have different state
5. **The books are the reference** — If a derivation is in the books, the work was done somewhere

---

## Success Criteria

Investigation is complete when we know:

1. ✓ Which of the 15 missing files can be **relocated** from existing locations
2. ✓ Which can be **recovered** from git history
3. ✓ Which must be **extracted** from synthesis documents
4. ✓ Which were **never standalone** and must be created

This determines the approach for the follow-up Framework Completion brief.

---

*Brief created: 22 December 2025*
*Purpose: Investigate before recreating — recover existing work where possible*
*Location: `/docs/research/cleanup/CLAUDE-CODE-BRIEF-GIT-HISTORY-INVESTIGATION.md`*
