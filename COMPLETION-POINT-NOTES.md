# HD Knowledge Engine v2.0 - Clean Repository

## Created: November 17, 2025

This is a **clean extraction** from the original HD Knowledge Engine v2.0 completion point (commit `8802363` from November 12, 2025).

## Why This Clean Repository Was Created

The original repository at `/Volumes/CLAUDE/HD-Knowledge-Engine-V2` had a corrupted git history where two completely different projects were accidentally merged:

1. **The Monolithic Database System** (August 2025) - Had verification systems but NO modular knowledge systems
2. **The Modular v2.0 System** (November 2025) - Had all 11 knowledge systems with clean architecture

This clean repository contains ONLY the modular v2.0 system from the completion point.

## What's Included

### ✅ All 11 Knowledge Systems Complete:
1. Gene Keys - Shadow/Gift/Siddhi framework
2. I Ching Names - Traditional hexagram names
3. Human Design Gates - Ra's gate keywords & center assignments
4. Traditional HD Gates - 384-line planetary assignments
5. The 4 Quarters - Mutation, Initiation, Duality, Civilisation
6. The 8 Trigrams - Heaven, Earth, Thunder, Water, etc.
7. The 16 Mythological Faces - Hades, Prometheus, Vishnu, etc.
8. The 22 Codon Rings - Biochemical amino acid correlations
9. The 36 Channels - All bodygraph channels with circuits
10. The 192 Incarnation Crosses - LAX, RAX, JX crosses
11. The 9 Centers - All energy centers with gate assignments

### ✅ All 11 Session Prompts Preserved:
- `core/session-prompts/01-gene-keys-session.md` through `11-centers-meanings-session.md`
- Complete documentation for recreating each system
- README and setup instructions included

### ✅ Complete Core System:
- `core/root-system/` - Binary identity, gate sequence, positioning algorithm
- `core/templates/` - Knowledge system templates
- `core/scripts/` - Build and verification scripts

### ✅ Full Test Suite:
- 55 comprehensive unified query tests
- 34 adapted old tests
- Individual test suites for each knowledge system
- 100% test coverage reported

## Architecture

**Calculation-First Design:**
- All mathematical relationships computed on-demand
- No monolithic database storage
- Single source of truth in `core/root-system/`

**Modular Knowledge Systems:**
- 11 independent pluggable systems
- Each with own tests and verification
- Clean separation of concerns

## Performance Metrics

- **Query speed:** ~0.016ms per gate
- **Test success:** 100% (89/89 tests passing)
- **Data integrity:** All 384 lines verified
- **Total size:** ~5-10 MB

## Git History

This repository has a **clean, single-commit history**:
- Tag: `v2.0.0-clean`
- Commit: `212fadb`
- Date: November 17, 2025
- Based on: Original commit `8802363` (November 12, 2025)

No contamination from the monolithic database system that existed in the corrupt repository.

## Gate Sequence Version

This repository uses **gate-sequence.json v1.0.0**:
- Gate 41 at position 0 (starting point)
- Traditional wheel order

## How to Use

```bash
# Install dependencies
npm install

# Query a gate
node unified-query-engine.js 13

# Query a specific line
node unified-query-engine.js 13 4

# Run tests
node tests/comprehensive-unified-query-tests.js
node tests/adapted-old-tests.js
```

## What NOT to Do

**DO NOT merge or pull from:**
- The old `/Volumes/CLAUDE/HD-Knowledge-Engine-V2` remote (origin/main at `a1cd711`)
- That repository contains the monolithic database system, not the modular v2.0 system

**This clean repository should be treated as the new source of truth.**

## Next Steps

You can now:
1. Continue development from this clean baseline
2. Add new features without git history contamination
3. Create a new remote repository and push this clean version
4. Archive the old corrupted repository

---

**Created with Claude Code**
