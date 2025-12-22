# Cleanup Investigation Summary

**Date:** 22 December 2025  
**Investigator:** Claude (Anthropic)  
**Request:** Investigate why `/docs/framework/` directories weren't populated

---

## What Was Found

### Three December 2025 Briefs

| Brief | Status | Notes |
|-------|--------|-------|
| `CLAUDE-CODE-BRIEF-DERIVATION-AUDIT.md` | ✅ COMPLETE | All Phase 1-5 audit files exist |
| `CLAUDE-CODE-BRIEF-ROOT-CLEANUP.md` | ✅ COMPLETE | START-HERE.md, README updated |
| `CLAUDE-CODE-BRIEF-DIRECTORY-REORGANISATION.md` | ⚠️ PARTIAL | Structure created, files not moved |

### What Happened

The **Directory Reorganisation** brief was only partially executed:

1. **Completed:** Directory structure created
2. **Completed:** README files written
3. **Completed:** Some files moved (7 of 22)
4. **NOT Completed:** 15 derivation files never created/moved

The audit branch (`audit/derivation-reorganisation-dec2025`) was apparently merged to main, but the framework population step was skipped or interrupted.

---

## Current State vs Intended State

### framework/foundation/
| Should Exist | Status |
|--------------|--------|
| `four-axes-framework.md` | ✅ EXISTS |
| `binary-architecture.md` | ❌ MISSING |
| `five-constraints.md` | ❌ MISSING |

### framework/trigram-cube/
| Should Exist | Status |
|--------------|--------|
| `cube-vertices.md` | ❌ MISSING |
| `standing-waves.md` | ❌ MISSING |
| `position-functions.md` | ❌ MISSING |

### framework/hexagram-movements/
| Should Exist | Status |
|--------------|--------|
| `gate-classification.md` | ❌ MISSING |
| `cross-zero-gates.md` | ❌ MISSING |
| `same-phase-gates.md` | ❌ MISSING |

### framework/lines-profiles/
| Should Exist | Status |
|--------------|--------|
| `six-lines-octahedron.md` | ❌ MISSING |
| `harmonic-pairs.md` | ❌ MISSING |
| `twelve-profiles.md` | ✅ EXISTS |

### framework/hd-structures/
| Should Exist | Status |
|--------------|--------|
| `nine-centres.md` | ✅ EXISTS |
| `seven-circuits.md` | ❌ MISSING |
| `five-types.md` | ✅ EXISTS |
| `seven-authorities.md` | ✅ EXISTS |

### framework/topology/
| Should Exist | Status |
|--------------|--------|
| `torus-knot.md` | ❌ MISSING |
| `double-helix.md` | ❌ MISSING |
| `88-degree-offset.md` | ❌ MISSING |

### framework/deep-structure/
| Should Exist | Status |
|--------------|--------|
| `lock-key-synthesis.md` | ✅ EXISTS |
| `color-tone-base-structure.md` | ❌ MISSING |
| `four-nodes-disphenoid.md` | ✅ EXISTS |

---

## Gap Summary

| Category | Files Should Exist | Files Actually Exist | Missing |
|----------|-------------------|---------------------|---------|
| foundation | 3 | 1 | 2 |
| trigram-cube | 3 | 0 | 3 |
| hexagram-movements | 3 | 0 | 3 |
| lines-profiles | 3 | 1 | 2 |
| hd-structures | 4 | 3 | 1 |
| topology | 3 | 0 | 3 |
| deep-structure | 3 | 2 | 1 |
| **TOTAL** | **22** | **7** | **15** |

---

## Created Brief

A new brief has been created to complete this work:

**Location:** `/docs/research/cleanup/CLAUDE-CODE-BRIEF-FRAMEWORK-COMPLETION.md`

This brief:
1. Lists all 15 missing files
2. Identifies source documents for each
3. Specifies what content each file must contain
4. Provides git instructions
5. Includes verification checklist

---

## Secondary Issue: /docs/articles/ Duplicates

The content in `/docs/articles/EM-Series-Book0/` through `Book3/` is duplicated in `/docs/books/`. This doesn't cause problems but could be cleaned up in a separate pass.

---

## Recommendation

Execute `CLAUDE-CODE-BRIEF-FRAMEWORK-COMPLETION.md` to populate the framework directories. This will:

1. Make `/docs/framework/` the single source of truth for proven derivations
2. Eliminate empty directories that suggest incomplete structure
3. Complete the original reorganisation intent

---

*Investigation complete: 22 December 2025*
