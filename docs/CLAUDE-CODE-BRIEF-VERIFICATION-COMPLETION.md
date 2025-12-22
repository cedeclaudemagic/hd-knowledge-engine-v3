# CLAUDE CODE BRIEF: Verification & Completion of Position-Based Naming

## FULL CONTEXT

### What This Project Is

This is the HD Knowledge Engine V3 — a multi-year research project deriving the mathematical and geometric foundations of the I Ching and Human Design systems. The core thesis: **these ancient wisdom traditions emerge from mathematical necessity rather than arbitrary mysticism**.

The project has produced ~440,000 words of content across books, interpretations, research syntheses, and articles.

### Why Position-Based Naming

The project adopted a position-based naming system where each work is identified by its **electromagnetic position** on the wave, rather than arbitrary book numbers (Book 0, Book 1, etc.). 

This matters because the positions reflect what each work actually DOES:

```
VOID DOMAIN (Theory)                    FORM DOMAIN (Practice)
────────────────────                    ──────────────────────

-4 SOURCE                               +4 SINK
   Origin, first principles                Complete reception, practical use

-3 CAPACITANCE                          +3 INDUCTANCE
   Stored potential beneath                Crystallised form

-2 VOLTAGE                              +2 CURRENT
   Driving pressure, the "why"             Sustained flow, application

-1 GATE-OUT                             +1 GATE-IN
   Release to form, proofs                 Entry point for readers

                    ─── 0 (Monopole) ───
```

### The Eight Positions Defined

| Position | EM Name | Function | Assigned Work | Status |
|----------|---------|----------|---------------|--------|
| **-4** | SOURCE | Where wave originates | The Geometry of Consciousness | ✅ Complete |
| **-3** | CAPACITANCE | Stored potential | The Depth (CTB, Lock-Key) | ⚠️ Outline |
| **-2** | VOLTAGE | Driving pressure | The Shape of Change | ✅ Complete |
| **-1** | GATE-OUT | Release to form | The Proof | ✅ Complete |
| **+1** | GATE-IN | Entry point | The Wave | ✅ Complete |
| **+2** | CURRENT | Sustained flow | Interpretations + Series | ✅ Complete |
| **+3** | INDUCTANCE | Crystallised form | The Architecture | ⚠️ Outline |
| **+4** | SINK | Complete reception | The Living Oracle | ⚠️ Framework |

### Position +2 Clarification

**Position +2 (CURRENT)** = "Sustained flow, application in motion"

This position encompasses ALL ongoing applied output:
- **Electromagnetic Interpretations** — 64 gate reference files (~200,000 words)
- **Article Series** — Ongoing Substack/exploration output:
  - Wheel Series (wheel topology, torus dynamics)
  - Electromagnetic Consciousness Series (consciousness models)
  - Reflections ("The Breath and the Bones" — contemplative prose)

The series content IS Position +2. It's the framework flowing through various applications.

### Position +4 Clarification

**Position +4 (SINK)** = "Complete reception into practical use"

This is specifically **The Living Oracle** — the 384-line divination tool. Where all understanding terminates in embodied practice.

---

## WHAT WAS ALREADY DONE (Previous Session)

A previous Claude Code session completed:

1. ✅ **Archived 7 duplicate directories** to `/docs/archive/deprecated-articles-mirror/`
2. ✅ **Renamed 5 directories** to position-based naming
3. ✅ **Updated DERIVATION-STATUS-MAP.md** source key (B0→P-2, B1→P+1, etc.)
4. ✅ **Updated main README files** with position tables
5. ✅ **Created Position +3 directory** with README
6. ✅ **Moved Reflections** to `/docs/books/series/reflections/`

**Git commits:** 9ab14b6 → 75903b4 → 37b7c22

---

## YOUR MISSION

1. **Verify** structural changes are correct
2. **Complete** remaining narrative reference updates (~30 files)
3. **Archive** remaining duplicates in `/docs/articles/`
4. **Update** series framing as Position +2
5. **Document** completion

---

## PART 1: VERIFICATION CHECKLIST

### Directory Structure
Confirm this exists:

```
/docs/books/
├── position-minus-4-geometry-of-consciousness/
├── position-minus-3-the-depth/
├── position-minus-2-shape-of-change/
├── position-minus-1-the-proof/
├── position-plus-1-the-wave/
├── position-plus-3-the-architecture/
└── series/                                    ← Part of Position +2
    ├── electromagnetic-consciousness/
    ├── reflections/
    └── wheel-series/

/docs/electromagnetic-interpretations/         ← Position +2
/docs/electromagnetic-iching/                  ← Position +4
```

### Archive Contents
Confirm `/docs/archive/deprecated-articles-mirror/` contains:
- EM-Series-Book0/
- EM-Series-Book1/
- EM-Series-Book2/
- EM-Series-Book3/
- the-geometry-of-consciousness-book/
- electromagnetic-consciousness-series/
- wheel-series/
- README.md

### Source Key in DERIVATION-STATUS-MAP.md
Confirm this key exists:
```
**Source Abbreviation Key (Position-Based):**
- P-4 = Position -4: The Geometry of Consciousness
- P-3 = Position -3: The Depth  
- P-2 = Position -2: The Shape of Change
- P-1 = Position -1: The Proof
- P+1 = Position +1: The Wave
- P+3 = Position +3: The Architecture
```

---

## PART 2: ARCHIVE REMAINING DUPLICATES

### Problem
`/docs/articles/` still contains files that duplicate `/docs/books/series/wheel-series/`:

| In /docs/articles/ | Duplicate of |
|-------------------|--------------|
| article-01-breathing-wheel.md | /docs/books/series/wheel-series/01-breathing-wheel.md |
| article-02-three-readings.md | /docs/books/series/wheel-series/02-three-readings.md |
| article-03-electromagnetic-cycle.md | /docs/books/series/wheel-series/03-electromagnetic-cycle.md |

### Action
1. Verify they are duplicates (diff the files)
2. If duplicates: Move to `/docs/archive/deprecated-articles-mirror/standalone-articles/`
3. Update `/docs/articles/README.md` to be a pointer only

### Target State for /docs/articles/
After cleanup, `/docs/articles/` should contain only:
- README.md (pointing to canonical locations)
- Any truly unique standalone articles (if any exist)

---

## PART 3: COMPLETE NARRATIVE UPDATES

### The Problem
Files in the book directories contain narrative references like:
- "In Book 1, we presented..."
- "From Book 1, the eight trigrams..."
- "Book 2 proves..."

These need position-based naming.

### Replacement Rules

| Find Pattern | Replace With |
|--------------|--------------|
| `In Book 0` | `In Position -2 (The Shape of Change)` |
| `In Book 1` | `In Position +1 (The Wave)` |
| `In Book 2` | `In Position -1 (The Proof)` |
| `From Book 0` | `From Position -2 (The Shape of Change)` |
| `From Book 1` | `From Position +1 (The Wave)` |
| `From Book 2` | `From Position -1 (The Proof)` |
| `Book 0` (standalone) | `Position -2` |
| `Book 1` (standalone) | `Position +1` |
| `Book 2` (standalone) | `Position -1` |
| `Book 3` (if Depth context) | `Position -3` |
| `Book 3` (if Architecture context) | `Position +3` |
| `Book 4` | `Position +3` |

### Directories to Search

```bash
grep -rn "Book 0\|Book 1\|Book 2\|Book 3\|Book 4" \
  /docs/books/ \
  /docs/research/ \
  /docs/framework/ \
  /docs/electromagnetic-interpretations/ \
  --include="*.md" | grep -v archive | grep -v BRIEF
```

### Known Files Needing Updates
From spot check, at minimum:
- `/docs/books/position-minus-1-the-proof/07-em-positions-emergent.md`
- Likely other chapters in position-minus-1-the-proof/
- Likely chapters in position-plus-1-the-wave/

---

## PART 4: UPDATE SERIES FRAMING

### Update /docs/books/series/README.md

If it exists, update to clarify series content is Part of Position +2:

```markdown
# Article Series

**Position:** +2 (CURRENT) — Sustained flow, applied exploration

These series represent the electromagnetic framework in motion — 
ongoing exploration and application of the core principles.

## Series

| Series | Focus | Status |
|--------|-------|--------|
| Wheel Series | Wheel topology, torus knot dynamics | Draft |
| Electromagnetic Consciousness | Consciousness models, transformer metaphor | Draft |
| Reflections | Contemplative prose, "The Breath and the Bones" | Draft |

## Relationship to Main Works

These series are the CURRENT flowing:
- Position +1 (The Wave) provides the framework
- Position +2 (Interpretations + Series) applies it in sustained flow
- Position +4 (The Oracle) receives it in practical use

## Location

Canonical location: `/docs/books/series/`
Reference material: `/docs/electromagnetic-interpretations/`
```

### Update /docs/articles/README.md

Make it a simple pointer:

```markdown
# Articles Directory

**Note:** This directory is deprecated for book/series content.

## Canonical Locations

| Content Type | Location |
|--------------|----------|
| Book manuscripts | /docs/books/position-*/ |
| Article series | /docs/books/series/ |
| Gate interpretations | /docs/electromagnetic-interpretations/ |

## Position +2: CURRENT

All applied/exploratory content is part of Position +2:
- Electromagnetic Interpretations (64 gates)
- Wheel Series
- Electromagnetic Consciousness Series
- Reflections

See /docs/POSITION-REFERENCE-CARD.md for the complete position system.
```

---

## PART 5: FINAL VALIDATION

### Grep Test
```bash
# Should return 0 results (excluding archive and this brief)
grep -rn "Book 0\|Book 1\|Book 2\|Book 3\|Book 4" /docs/ \
  --include="*.md" | grep -v archive | grep -v BRIEF | wc -l
```

### Structure Test
```bash
# Confirm position directories exist
ls -la /docs/books/ | grep position

# Confirm series exists
ls -la /docs/books/series/

# Confirm articles is cleaned up
ls -la /docs/articles/
```

---

## PART 6: OUTPUT REPORT

Create `/docs/POSITION-NAMING-COMPLETION-REPORT.md` with:

1. **Verification Results**
   - Directory structure: ✅/❌
   - Archive contents: ✅/❌
   - Source key: ✅/❌

2. **Duplicates Archived**
   - List files moved from /docs/articles/

3. **Narrative Updates**
   - List of files updated
   - Count of replacements made

4. **Series Framing**
   - Confirm README updates

5. **Validation**
   - Grep result (should be 0)
   - Any remaining issues

6. **Git Commit**
   - Commit hash for these changes

---

## GIT WORKFLOW

### Before Starting
```bash
git status
git log --oneline -5
# Should show 37b7c22 as recent commit
```

### After Completion
```bash
git add -A
git commit -m "Complete position-based naming: narrative refs, series framing, article cleanup"
```

---

## REFERENCE: The Complete Position Architecture

```
Position -4 SOURCE
├── The Geometry of Consciousness (8 rings, ~40,000 words)
└── First principles derivation from Monopole outward

Position -3 CAPACITANCE  
├── The Depth (outline only)
└── CTB architecture, Lock-Key, Four Nodes

Position -2 VOLTAGE
├── The Shape of Change (10 chapters, ~25,000 words)
└── Philosophical foundation, "why does it work?"

Position -1 GATE-OUT
├── The Proof (11 chapters, ~30,000 words)
└── Mathematical proofs, binary derivations

Position +1 GATE-IN
├── The Wave (14 chapters, ~35,000 words)
└── Accessible entry point, practical framework

Position +2 CURRENT
├── Electromagnetic Interpretations (64 gates, ~200,000 words)
├── Wheel Series (3 articles)
├── Electromagnetic Consciousness Series (5 articles)
├── Reflections (contemplative prose)
└── Sustained flow, applied exploration

Position +3 INDUCTANCE
├── The Architecture (outline only)
└── HD structures derived: Profile, Type, Authority

Position +4 SINK
├── The Living Oracle (framework + 2 gates)
└── 384-line divination tool
```

---

*Brief created: 22 December 2025*
*Builds on: Commits 9ab14b6 → 75903b4 → 37b7c22*
*Previous brief: CLAUDE-CODE-BRIEF-POSITION-NAMING-UPDATE.md*

