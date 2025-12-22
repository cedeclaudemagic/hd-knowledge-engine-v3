# CLAUDE CODE BRIEF: Root Cleanup and Front Door

## Mission Statement

Create a clear entry point for the HD Knowledge Engine V3 project by:
1. Cleaning up loose files at root level
2. Creating `START-HERE.md` as the front door
3. Documenting the four interconnected systems

**Scope:** Lightweight cleanup only. Do NOT reorganise the working systems (Knowledge Engine, Visualization, Skills).

---

## Context: The Four Systems

This project has evolved into four interconnected systems:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    HD KNOWLEDGE ENGINE V3                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │   RESEARCH   │────▶│    SKILLS    │────▶│  KNOWLEDGE   │        │
│  │   /docs/     │     │   /skills/   │     │   ENGINE     │        │
│  │              │     │              │     │ /knowledge-  │        │
│  │ Prove it     │     │ Teach Claude │     │  systems/    │        │
│  │ geometrically│     │ to apply it  │     │              │        │
│  └──────────────┘     └──────────────┘     │ Query via    │        │
│         │                    │             │ first        │        │
│         │                    │             │ principles   │        │
│         ▼                    ▼             └──────┬───────┘        │
│  ┌─────────────────────────────────────┐         │                 │
│  │         VISUALIZATION               │◀────────┘                 │
│  │         /visualization/             │                           │
│  │                                     │                           │
│  │         Build the mandala           │                           │
│  │         Generate SVGs               │                           │
│  └─────────────────────────────────────┘                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### System Details

| System | Location | Purpose | Touch? |
|--------|----------|---------|--------|
| **Research** | `/docs/` | Derivation work, books, proofs | ✓ Just reorganised |
| **Skills** | `/skills/` | Claude learning to apply framework | NO — working |
| **Knowledge Engine** | `/knowledge-systems/`, `/core/` | Structured HD data + queries | NO — working |
| **Visualization** | `/visualization/` | Mandala generation | NO — working |

---

## Phase A: Root Cleanup

### Step 1: Audit Root Files

List all files at project root and categorise:

| File | Category | Destination |
|------|----------|-------------|
| `README.md` | Keep | Root (update content) |
| `package.json`, `package-lock.json` | Config | Root (keep) |
| `.gitignore` | Config | Root (keep) |
| `unified-query-engine.js` | Tool | Root or `/core/` |
| `ANGLE-CONVENTION-EXPLAINED.md` | Viz spec | `/visualization/docs/` |
| `BULLETPROOF-CONFIG-SYSTEM.md` | Old spec? | `/docs/archive/` |
| `CARDINAL-STRADDLE-SPECIFICATION.md` | Viz spec | `/visualization/docs/` |
| `COMPLETION-POINT-NOTES.md` | Notes | `/docs/archive/` |
| `CONSOLIDATION-ROADMAP.md` | Old roadmap | `/docs/archive/` |
| `DEFINITIVE-VISUAL-WHEEL-SPEC.md` | Viz spec | `/visualization/docs/` |
| `DIRECTION-TERMINOLOGY-SOLUTION.md` | Viz spec | `/visualization/docs/` |
| `IMMEDIATE-ACTIONS-REQUIRED.md` | Old action | `/docs/archive/` |
| `MIGRATION.md` | Old migration | `/docs/archive/` |
| `PHASE-1-CONSIDERATIONS.md` | Old phase | `/docs/archive/` |
| `SESSION-UPDATES-MASTER-SPEC.md` | Session spec | `/docs/archive/` or `/core/` |
| `VERIFICATION-RESULTS-SUMMARY.md` | Viz results | `/visualization/docs/` |
| `VERIFIED-VISUAL-WHEEL-CONFIGURATION.md` | Viz config | `/visualization/docs/` |
| `VISUAL-WHEEL-ANALYSIS.md` | Viz analysis | `/visualization/docs/` |
| `generated-*.svg` | Output | `/visualization/output/` |

### Step 2: Create Visualization Docs Folder

```bash
mkdir -p visualization/docs
```

### Step 3: Move Files

Move visualization specs:
```bash
mv ANGLE-CONVENTION-EXPLAINED.md visualization/docs/
mv CARDINAL-STRADDLE-SPECIFICATION.md visualization/docs/
mv DEFINITIVE-VISUAL-WHEEL-SPEC.md visualization/docs/
mv DIRECTION-TERMINOLOGY-SOLUTION.md visualization/docs/
mv VERIFICATION-RESULTS-SUMMARY.md visualization/docs/
mv VERIFIED-VISUAL-WHEEL-CONFIGURATION.md visualization/docs/
mv VISUAL-WHEEL-ANALYSIS.md visualization/docs/
```

Move generated SVGs:
```bash
mv generated-*.svg visualization/output/
```

Move old/superseded files:
```bash
mv BULLETPROOF-CONFIG-SYSTEM.md docs/archive/
mv COMPLETION-POINT-NOTES.md docs/archive/
mv CONSOLIDATION-ROADMAP.md docs/archive/
mv IMMEDIATE-ACTIONS-REQUIRED.md docs/archive/
mv MIGRATION.md docs/archive/
mv PHASE-1-CONSIDERATIONS.md docs/archive/
mv SESSION-UPDATES-MASTER-SPEC.md docs/archive/
```

### Step 4: Handle COMPARISONS and Other Directories

Check contents and categorise:
- `/COMPARISONS/` → Likely `/docs/archive/` or `/visualization/docs/`
- `/Claude-chats/` → Keep (session history)
- `/v3-sessions/` → Keep (session history)
- `/examples/` → Keep (likely Knowledge Engine examples)
- `/extensions/` → Check purpose

---

## Phase B: Create START-HERE.md

Create `/Volumes/CLAUDE/HD-Knowledge-Engine-V3/START-HERE.md`:

```markdown
# HD Knowledge Engine V3

## What Is This?

A research project proving that Human Design and the I Ching are **geometrically derived** — not invented wisdom traditions, but discovered mathematical structures.

The project has evolved into four interconnected systems.

---

## The Four Systems

### 1. Research & Derivation — `/docs/`

**Purpose:** Prove geometric necessity. Write books documenting the proofs.

**Start here:** `/docs/NAVIGATION.md`

**Key distinction:**
- `/docs/framework/` — **PROVEN** derivations (investigation complete)
- `/docs/investigations/` — **OUTSTANDING** work (pressure remains)

**Master index:** `/docs/DERIVATION-STATUS-MAP.md`

---

### 2. Skills — `/skills/`

**Purpose:** Teach Claude to apply the proven framework.

**Current skills:**
- `hd-electromagnetic-framework` — Position qualities, line dynamics
- `hd-mathematics` — Binary tables, calculations

**Pipeline:** When something is proven in `/docs/framework/`, it can become a skill.

---

### 3. Knowledge Engine — `/knowledge-systems/` + `/core/`

**Purpose:** Query Human Design knowledge using mathematical first principles.

**Contains:**
- Structured data for gates, channels, centres, types, etc.
- Maps Ra Uru Hu's teachings onto the geometric framework
- Query engine for retrieving and relating HD elements

---

### 4. Visualization — `/visualization/`

**Purpose:** Build the mandala. Generate SVGs.

**Contains:**
- Ring-based architecture
- SVG generators
- Style guides and specifications

---

## The Flow

```
Research (prove it) → Skills (teach Claude) → Knowledge Engine (query it) → Visualization (show it)
```

Each system feeds the next. Derivations become skills. Skills inform queries. Queries drive visualization.

---

## Quick Links

| What | Where |
|------|-------|
| Derivation status | `/docs/DERIVATION-STATUS-MAP.md` |
| Proven framework | `/docs/framework/` |
| Outstanding investigations | `/docs/investigations/active/` |
| Current boundaries | `/docs/investigations/boundaries/` |
| Books in progress | `/docs/books/` |
| Claude skills | `/skills/` |
| HD data | `/knowledge-systems/` |
| Mandala generation | `/visualization/` |

---

## The Core Discovery

The I Ching's 64 hexagrams and Human Design's architecture emerge from **geometric necessity**:

- **8 trigrams** = vertices of a cube
- **64 hexagrams** = movements between vertices
- **6 lines** = vertices of an octahedron
- **12 profiles** = octahedron × 2 distances
- **9 centres** = electromagnetic position functions
- **5 types** = 2² + 1 (logical completeness)
- **7 authorities** = signal dependency hierarchy

What ancient wisdom encoded, mathematics derives.

---

## Project Status

See `/docs/DERIVATION-STATUS-MAP.md` for complete status of all derivations.

**Summary (December 2025):**
- 89 elements PROVEN
- 37 elements MAPPED
- 20 elements confirmed EMPIRICAL (transmission layer)
- 6 elements OUTSTANDING (investigation continues)

---

*Last updated: 22 December 2025*
```

---

## Phase C: Update README.md

Update the existing `/README.md` to point to `START-HERE.md`:

```markdown
# HD Knowledge Engine V3

**Start here:** [START-HERE.md](./START-HERE.md)

A research project proving the geometric foundations of Human Design and the I Ching.

## Quick Navigation

- [Project Overview](./START-HERE.md)
- [Derivation Status](./docs/DERIVATION-STATUS-MAP.md)
- [Research Navigation](./docs/NAVIGATION.md)

## Systems

| System | Location | Purpose |
|--------|----------|---------|
| Research | `/docs/` | Prove geometric necessity |
| Skills | `/skills/` | Teach Claude the framework |
| Knowledge Engine | `/knowledge-systems/` | Query HD data |
| Visualization | `/visualization/` | Generate the mandala |

---

*See [START-HERE.md](./START-HERE.md) for full documentation.*
```

---

## Execution Steps

### Step 1: Create Branch

```bash
cd /Volumes/CLAUDE/HD-Knowledge-Engine-V3
git checkout -b cleanup/root-and-front-door
```

### Step 2: Execute Phase A

Move files as specified above.

### Step 3: Execute Phase B

Create `START-HERE.md`.

### Step 4: Execute Phase C

Update `README.md`.

### Step 5: Commit

```bash
git add -A
git commit -m "Root cleanup and START-HERE front door

Phase A: Moved loose files to appropriate locations
- Visualization specs → /visualization/docs/
- Old/superseded files → /docs/archive/
- Generated SVGs → /visualization/output/

Phase B: Created START-HERE.md
- Documents four systems (Research, Skills, Knowledge Engine, Visualization)
- Explains the derivation → skill pipeline
- Links to key navigation points

Phase C: Updated README.md to point to START-HERE.md"
```

### Step 6: Request Review

Present to Rusty for approval before merge.

---

## Verification Checklist

- [ ] Root level is clean (only essential files remain)
- [ ] `START-HERE.md` exists and explains all four systems
- [ ] `README.md` points to `START-HERE.md`
- [ ] Visualization specs are in `/visualization/docs/`
- [ ] Old files are in `/docs/archive/`
- [ ] No working systems were modified
- [ ] Git history preserved

---

## What This Does NOT Do

- Does NOT reorganise `/knowledge-systems/`
- Does NOT reorganise `/visualization/`
- Does NOT reorganise `/skills/`
- Does NOT modify `/core/`

These systems work. We're just cleaning up around them and creating a front door.

---

*Brief created: 22 December 2025*
*Purpose: Lightweight cleanup + documentation*
*Scope: Root level only — working systems untouched*
