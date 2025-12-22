# CLAUDE CODE BRIEF: Directory Reorganisation

## Mission Statement

Reorganise the HD Knowledge Engine V3 directory structure to clearly reflect the fundamental distinction between:

1. **PROVEN** — Geometrically derived, mathematically demonstrated, investigation complete
2. **OUTSTANDING** — Not yet derived, under active investigation, pressure remains

This distinction is **foundational** to the research. What has been derived is settled. What has not been derived remains under pressure to investigate further — the work continues until geometric necessity is found or definitively ruled out.

---

## CRITICAL CONTEXT

**Stay on the audit branch:** `audit/derivation-reorganisation-dec2025`

All reorganisation work happens on this branch. Do NOT merge to main until Rusty approves the complete package (audit + reorganisation).

```bash
# Verify you're on the correct branch
git branch
# Should show: * audit/derivation-reorganisation-dec2025
```

---

## The Core Principle

### PROVEN (Investigation Complete)
- Geometrically necessary
- Mathematically demonstrated  
- Multiple sources confirm
- Structure generates this — no other possibility
- **Location:** `/docs/framework/`

### OUTSTANDING (Investigation Active)
- Not yet derived
- May be derivable (investigation continues)
- Pressure remains to find geometric necessity
- Current state ≠ final conclusion
- **Location:** `/docs/investigations/`

### EMPIRICAL (Transmission Layer)
- Confirmed as received content
- Structure constrains but doesn't generate
- Vocabulary, specific assignments, semantic content
- Still tracked — the *boundary* itself is a finding
- **Location:** `/docs/investigations/boundaries/`

---

## New Directory Structure

```
/Volumes/CLAUDE/HD-Knowledge-Engine-V3/docs/

├── NAVIGATION.md                    # Root navigation guide
├── DERIVATION-STATUS-MAP.md         # Master index (move from research/)
│
├── books/                           # Published/final book content
│   ├── README.md
│   ├── book-0-shape-of-change/      # (move from articles/EM-Series-Book0/)
│   ├── book-1-the-wave/             # (move from articles/EM-Series-Book1/)
│   ├── book-2-the-proof/            # (move from articles/EM-Series-Book2/)
│   ├── book-3-the-architecture/     # (move from articles/EM-Series-Book3/)
│   └── series/                      # Other article series
│       ├── electromagnetic-consciousness/
│       ├── wheel-series/
│       └── geometry-of-consciousness/
│
├── framework/                       # ═══ PROVEN DERIVATIONS ═══
│   ├── README.md                    # "Everything here is geometrically derived"
│   │
│   ├── foundation/                  # The base architecture
│   │   ├── four-axes-framework.md   # Poles/Storage/Flow/Gates
│   │   ├── binary-architecture.md   # 2⁶ = 64, palindromes
│   │   └── five-constraints.md      # Tetragrammaton derivation
│   │
│   ├── trigram-cube/                # 8 positions
│   │   ├── cube-vertices.md         # Trigrams = cube vertices
│   │   ├── standing-waves.md        # 8 doubled gates
│   │   └── position-functions.md    # EM function by position
│   │
│   ├── hexagram-movements/          # 64 gates
│   │   ├── gate-classification.md   # 4 types of movement
│   │   ├── cross-zero-gates.md      # Transformation gates
│   │   └── same-phase-gates.md      # Circulation gates
│   │
│   ├── lines-profiles/              # 6 lines, 12 profiles
│   │   ├── six-lines-octahedron.md  # Lines = octahedron vertices
│   │   ├── harmonic-pairs.md        # 1↔4, 2↔5, 3↔6
│   │   └── twelve-profiles.md       # Octahedron × 2 distances
│   │
│   ├── hd-structures/               # Human Design architecture
│   │   ├── nine-centres.md          # Position-determined functions
│   │   ├── seven-circuits.md        # 6+1 octahedron structure
│   │   ├── five-types.md            # 2² + 1 completeness
│   │   └── seven-authorities.md     # Signal dependency hierarchy
│   │
│   ├── topology/                    # Wave geometry
│   │   ├── torus-knot.md            # (2,1) torus knot
│   │   ├── double-helix.md          # DNA structure emergence
│   │   └── 88-degree-offset.md      # 2.35% life asymmetry
│   │
│   └── deep-structure/              # 69,120 addresses
│       ├── lock-key-synthesis.md    # Binary lock, phi key
│       ├── color-tone-base-structure.md  # 6-6-6-5 architecture
│       └── four-nodes-disphenoid.md # Tetrahedron proof
│
├── investigations/                  # ═══ OUTSTANDING — PRESSURE REMAINS ═══
│   ├── README.md                    # "Everything here is under active investigation"
│   │
│   ├── active/                      # Currently being investigated
│   │   ├── variable-structure/      # PHS, Perspective derivation
│   │   │   └── INVESTIGATION-STATUS.md
│   │   ├── incarnation-cross/       # 192 crosses geometry
│   │   │   └── INVESTIGATION-STATUS.md
│   │   ├── color-meanings/          # Beyond 6-6-6-5 structure
│   │   │   └── INVESTIGATION-STATUS.md
│   │   └── channel-assignments/     # Which gates pair — why?
│   │       └── INVESTIGATION-STATUS.md
│   │
│   ├── boundaries/                  # Current empirical limits (not final)
│   │   ├── README.md                # "These mark current limits, not permanent ones"
│   │   ├── planetary-40-percent.md  # Current derivation boundary
│   │   ├── gate-semantic-content.md # Transmitted vocabulary
│   │   └── line-specific-meanings.md # Cultural layer
│   │
│   └── historical/                  # Previous investigation attempts
│       ├── planetary/               # All planetary research
│       ├── magic-square/            # What was tried, what failed
│       └── circuit-channel/         # Channel assignment attempts
│
├── reference/                       # Source materials (unchanged)
│   └── (existing content)
│
├── tools/                           # Scripts, utilities
│   └── (any analysis scripts)
│
└── archive/                         # Superseded documents
    ├── README.md                    # "Historical only — see framework/ for current"
    └── (old synthesis docs, duplicates)
```

---

## Key Design Decisions

### 1. DERIVATION-STATUS-MAP at Root
Move from `/research/` to `/docs/` root — it's the master index for everything.

### 2. Framework = Proven Only
Nothing goes in `/framework/` unless it's geometrically derived. This is the "settled" zone.

### 3. Investigations = Pressure Remains
Everything in `/investigations/active/` is under pressure. The work continues.

### 4. Boundaries ≠ Conclusions
The `/investigations/boundaries/` folder tracks *current* empirical limits. These are findings about where we are now, not statements that derivation is impossible.

### 5. Historical Preserved
Previous investigation attempts go to `/investigations/historical/` — valuable for understanding what's been tried.

---

## Files to Move

### To `/docs/framework/`

| Current Location | New Location |
|------------------|--------------|
| `research/electromagnetic-framework/electromagnetic-framework-synthesis.md` | `framework/foundation/four-axes-framework.md` |
| `research/electromagnetic-framework/centre-electromagnetic-profiles.md` | `framework/hd-structures/nine-centres.md` |
| `research/electromagnetic-framework/authority-electromagnetic-analysis.md` | `framework/hd-structures/seven-authorities.md` |
| `research/electromagnetic-framework/type-determination-analysis.md` | `framework/hd-structures/five-types.md` |
| `research/profile/PROFILE-DERIVATION-SYNTHESIS.md` | `framework/lines-profiles/twelve-profiles.md` |
| `research/geometric/LOCK-KEY-SYNTHESIS.md` | `framework/deep-structure/lock-key-synthesis.md` |
| `research/geometric/FOUR-NODES-TETRAHEDRON-RESEARCH.md` | `framework/deep-structure/four-nodes-disphenoid.md` |

### To `/docs/books/`

| Current Location | New Location |
|------------------|--------------|
| `articles/EM-Series-Book0/` | `books/book-0-shape-of-change/` |
| `articles/EM-Series-Book1/` | `books/book-1-the-wave/` |
| `articles/EM-Series-Book2/` | `books/book-2-the-proof/` |
| `articles/EM-Series-Book3/` | `books/book-3-the-architecture/` |
| `articles/electromagnetic-consciousness-series/` | `books/series/electromagnetic-consciousness/` |
| `articles/wheel-series/` | `books/series/wheel-series/` |
| `articles/the-geometry-of-consciousness-book/` | `books/series/geometry-of-consciousness/` |

### To `/docs/investigations/`

| Current Location | New Location |
|------------------|--------------|
| `research/planetary/` | `investigations/historical/planetary/` |
| `research/planetary/magic-square-complete/` | `investigations/historical/magic-square/` |
| `research/geometric/COLOR-TONE-BASE-*.md` | `investigations/active/color-meanings/` |

### To `/docs/archive/`

| Current Location | Reason |
|------------------|--------|
| Duplicate synthesis files | Superseded by framework/ versions |
| Old briefs that are completed | Historical reference only |

---

## INVESTIGATION-STATUS.md Template

Each active investigation folder gets a status file:

```markdown
# Investigation: [Name]

## Status: OUTSTANDING

## Question
What geometric necessity, if any, determines [specific aspect]?

## What We Know
- [Current findings]
- [Partial derivations]

## What's Been Tried
- [Previous approaches]
- [Why they didn't complete the derivation]

## Next Approaches to Try
- [Hypotheses to test]
- [Data needed]

## Success Criteria
This investigation is complete when:
- [ ] [Specific geometric derivation found]
- OR [ ] [Definitively ruled out with proof of why]

## Pressure Point
Why this matters: [Connection to larger framework]

---
*Last updated: [date]*
```

---

## Execution Steps

### Step 1: Create New Directory Structure

```bash
cd /Volumes/CLAUDE/HD-Knowledge-Engine-V3/docs

# Create framework directories
mkdir -p framework/{foundation,trigram-cube,hexagram-movements,lines-profiles,hd-structures,topology,deep-structure}

# Create investigations directories  
mkdir -p investigations/{active/{variable-structure,incarnation-cross,color-meanings,channel-assignments},boundaries,historical/{planetary,magic-square,circuit-channel}}

# Create books directories
mkdir -p books/{book-0-shape-of-change,book-1-the-wave,book-2-the-proof,book-3-the-architecture,series/{electromagnetic-consciousness,wheel-series,geometry-of-consciousness}}

# Create archive
mkdir -p archive
```

### Step 2: Move Framework Files

Move proven derivations to `/framework/` with appropriate renaming.

### Step 3: Move Book Files

Move all book content to `/books/` structure.

### Step 4: Move Investigation Files

Move ongoing/historical research to `/investigations/`.

### Step 5: Create README Files

Each major directory needs a README explaining:
- What belongs here
- The status of content (proven vs outstanding)
- How to navigate

### Step 6: Create NAVIGATION.md

Root-level navigation showing the complete structure and the proven/outstanding distinction.

### Step 7: Update Internal Links

Search all .md files for internal links and update paths.

### Step 8: Move DERIVATION-STATUS-MAP

```bash
mv research/DERIVATION-STATUS-MAP.md ./DERIVATION-STATUS-MAP.md
```

### Step 9: Archive Superseded Files

Move duplicates and old synthesis docs to `/archive/`.

### Step 10: Create INVESTIGATION-STATUS Files

For each active investigation folder.

### Step 11: Commit

```bash
git add -A
git commit -m "Reorganise directories: framework (proven) vs investigations (outstanding)

Structure now reflects fundamental research distinction:
- /framework/ = geometrically derived, investigation complete
- /investigations/active/ = pressure remains, work continues
- /investigations/boundaries/ = current limits, not final conclusions
- /books/ = published content
- /archive/ = superseded documents

Key principle: What's not proven remains under investigation.
The boundary between derived and outstanding is the crucial demarcation."
```

---

## Verification Checklist

After reorganisation, verify:

- [ ] `/framework/` contains ONLY proven derivations
- [ ] `/investigations/active/` contains all outstanding work
- [ ] Each active investigation has INVESTIGATION-STATUS.md
- [ ] `/investigations/boundaries/` clearly states these are current limits
- [ ] All internal links updated
- [ ] NAVIGATION.md provides clear overview
- [ ] DERIVATION-STATUS-MAP.md at root level
- [ ] No orphaned files
- [ ] Git history preserved (moves, not delete+create)

---

## Success Criteria

The reorganisation is complete when:

1. ✓ A researcher can immediately see what's proven vs what's outstanding
2. ✓ The pressure to continue investigating is visible in the structure
3. ✓ Boundaries are framed as current state, not permanent limits
4. ✓ Finding any derivation requires checking only one location
5. ✓ The distinction between geometric necessity and transmission is embodied in the structure

---

## Notes for Rusty

After Claude Code completes this:

1. Review the new structure
2. Verify the proven/outstanding distinction is correct
3. Check that nothing proven ended up in investigations (or vice versa)
4. Approve for merge when satisfied

The reorganisation + audit will merge together as one coherent update.

---

*Brief created: 22 December 2025*
*Purpose: Embody the proven/outstanding distinction in directory structure*
*Branch: audit/derivation-reorganisation-dec2025*
