# SESSION 01: FOUNDATION SETUP

**Duration:** 2 hours
**Dependencies:** None
**Type:** Sequential (must complete before Session 02)
**Branch:** `session-01-foundation`

---

## OBJECTIVES

Set up the foundational project structure for HD Knowledge Engine V3, creating a clean workspace free from any monolithic database patterns.

---

## PREREQUISITES

### Before Starting:

- [ ] Read `00-MASTER-SESSION-ORCHESTRATOR.md` completely
- [ ] Understand: NO MONOLITHIC DATABASE EVER
- [ ] Clean V2 baseline exists at `/Volumes/CLAUDE/HD-Knowledge-Engine-V2-CLEAN`
- [ ] Create branch: `git checkout -b session-01-foundation`

---

## DELIVERABLES

1. New V3 project directory with clean structure
2. Updated `package.json` for V3
3. Git repository initialized properly
4. Directory structure for all future work
5. README with V3 goals
6. All tests from V2 still passing

---

## TASKS

### Task 1.1: Create V3 Project Directory

**Location:** `/Volumes/CLAUDE/HD-Knowledge-Engine-V3`

```bash
# Create new V3 directory
mkdir -p /Volumes/CLAUDE/HD-Knowledge-Engine-V3
cd /Volumes/CLAUDE/HD-Knowledge-Engine-V3

# Initialize git
git init
git checkout -b main
```

### Task 1.2: Copy V2 Baseline (Clean Files Only)

**Copy these directories/files from V2-CLEAN:**

```bash
# Core system files
cp -r /Volumes/CLAUDE/HD-Knowledge-Engine-V2-CLEAN/core ./
cp -r /Volumes/CLAUDE/HD-Knowledge-Engine-V2-CLEAN/knowledge-systems ./
cp -r /Volumes/CLAUDE/HD-Knowledge-Engine-V2-CLEAN/tests ./

# Main files
cp /Volumes/CLAUDE/HD-Knowledge-Engine-V2-CLEAN/unified-query-engine.js ./
cp /Volumes/CLAUDE/HD-Knowledge-Engine-V2-CLEAN/.gitignore ./
cp /Volumes/CLAUDE/HD-Knowledge-Engine-V2-CLEAN/MIGRATION.md ./
```

**Do NOT copy:**
- `COMPLETION-POINT-NOTES.md` (V2 specific)
- `package.json` (will create new one)
- `README.md` (will create new one)
- `.git/` (already initialized new one)

### Task 1.3: Create V3 Directory Structure

**Create these NEW directories:**

```bash
# New V3 directories
mkdir -p core/types
mkdir -p core/root-system/sequences
mkdir -p extensions
mkdir -p extensions/types
mkdir -p tests/configuration
mkdir -p tests/types
mkdir -p tests/integration
mkdir -p tests/performance
mkdir -p docs
mkdir -p examples
mkdir -p scripts
```

### Task 1.4: Create Package.json for V3

**File:** `package.json`

```json
{
  "name": "hd-knowledge-engine-v3",
  "version": "3.0.0-alpha.1",
  "description": "Human Design Knowledge Engine V3 - Modular, configurable, type-safe knowledge system with 11 integrated interpretation systems",
  "main": "unified-query-engine.js",
  "types": "core/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./core/types/index.d.ts",
      "require": "./unified-query-engine.js",
      "import": "./unified-query-engine.js"
    },
    "./extensions": {
      "types": "./extensions/types/extensions.d.ts",
      "require": "./extensions/index.js",
      "import": "./extensions/index.js"
    },
    "./core/positioning": {
      "require": "./core/root-system/positioning-algorithm.js",
      "import": "./core/root-system/positioning-algorithm.js"
    }
  },
  "scripts": {
    "test": "node tests/comprehensive-unified-query-tests.js",
    "test:config": "node tests/configuration/test-wheel-config.js",
    "test:types": "tsc --noEmit",
    "test:integration": "node tests/integration/test-full-system.js",
    "test:performance": "node tests/performance/benchmark.js",
    "test:all": "npm run test && npm run test:config && npm run test:types && npm run test:integration",
    "lint": "echo 'Linting not yet configured'",
    "docs": "echo 'Documentation generation not yet configured'"
  },
  "keywords": [
    "human-design",
    "knowledge-engine",
    "gene-keys",
    "i-ching",
    "codon-rings",
    "incarnation-crosses",
    "bodygraph",
    "astrology",
    "typescript",
    "modular",
    "configurable"
  ],
  "author": "HD Knowledge Engine Project",
  "license": "MIT",
  "engines": {
    "node": ">=16.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  },
  "dependencies": {},
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/hd-knowledge-engine-v3.git"
  },
  "bugs": {
    "url": "https://github.com/your-org/hd-knowledge-engine-v3/issues"
  },
  "homepage": "https://github.com/your-org/hd-knowledge-engine-v3#readme"
}
```

### Task 1.5: Create V3 README

**File:** `README.md`

```markdown
# HD Knowledge Engine V3

> Modular, configurable, type-safe Human Design knowledge system

**Version:** 3.0.0-alpha.1
**Architecture:** Calculation-first, zero monolithic storage
**Status:** 🚧 Under Active Development

---

## What's New in V3

### 🎛️ Modular Configuration System
- Swappable gate sequence arrays (HD standard, I Ching traditional, custom)
- Configurable wheel direction (clockwise/counter-clockwise)
- Adjustable rotation offset
- Multiple presets for different traditions

### 📘 TypeScript Support
- Complete type definitions for all 11 knowledge systems
- IntelliSense support in VS Code
- Type-safe queries and configurations
- Prevents common API mistakes

### 🧩 Extension Layer Architecture
- Core: Fast primitives (single-gate queries, calculations)
- Extensions: Rich aggregations (getAll methods, enriched queries)
- Clean separation allows other systems to dock at appropriate level

### ✅ V2 Compatibility
- Default configuration matches V2.0.0 behavior exactly
- Existing V2 code works without changes
- Migration path provided for advanced features

---

## Quick Start

```javascript
const engine = require('hd-knowledge-engine-v3');

// Basic query (same as V2)
const knowledge = engine.getGateKnowledge(13);
console.log(knowledge.geneKeys.shadow); // "Discord"

// New: Configuration
engine.setWheelConfiguration('iching-traditional');
const knowledge2 = engine.getGateKnowledge(41);
console.log(knowledge2.angle); // 0° (41 now at north)

// New: Extension layer
const extensions = require('hd-knowledge-engine-v3/extensions');
const allChannels = extensions.getAllChannels(); // All 36 channels
```

---

## Architecture Principles

### ✅ Calculation-First
- All data computed on-demand from immutable foundation
- No pre-built database files
- Pure functions only
- Fast: ~0.016ms per query

### ✅ Modular Design
- 11 independent knowledge systems
- Each system has own JSON mappings
- Clean separation of concerns
- Easy to add new systems

### ❌ What This Is NOT
- NOT a monolithic database
- NOT pre-computed lookups
- NOT complex rebuild workflows
- NOT the old V1.x architecture

---

## Project Status

**Current Phase:** Foundation Setup (Session 01)

| Component | Status |
|-----------|--------|
| Configuration System | 📋 Planned (Session 02) |
| TypeScript Definitions | 📋 Planned (Session 03) |
| Extension Layer | 📋 Planned (Session 04) |
| Integration Tests | 📋 Planned (Session 05) |
| Documentation | 📋 Planned (Session 06) |
| Examples | 📋 Planned (Session 07) |

---

## Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run all test suites (when available)
npm run test:all
```

---

## 11 Knowledge Systems

1. **Gene Keys** - Shadow/Gift/Siddhi spectrum
2. **I Ching Names** - Traditional hexagram names
3. **Human Design Gates** - Gate keywords and themes
4. **Traditional HD Gates** - 384-line interpretations
5. **The 4 Quarters** - Mutation, Initiation, Duality, Civilisation
6. **The 8 Trigrams** - I Ching trigram meanings
7. **The 16 Faces** - Mythological archetypes
8. **The 22 Codon Rings** - Amino acid correlations
9. **The 36 Channels** - Gate-to-gate connections
10. **The 192 Incarnation Crosses** - LAX, RAX, JX crosses
11. **The 9 Centers** - Energy center functions

---

## Contributing

See session prompt files in `v3-sessions/` directory for development workflow.

---

## License

MIT

---

*Built with calculation-first architecture - no monolithic database, ever.*
```

### Task 1.6: Create Initial .gitignore

**File:** `.gitignore` (enhance existing)

```
# Dependencies
node_modules/
package-lock.json

# Build outputs
dist/
build/
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*

# Test coverage
coverage/
.nyc_output/

# Temporary files
tmp/
temp/
*.tmp

# NEVER commit monolithic database files
unified-hd-database.json
hd-optimized-lookups.json
**/database.json
**/lookups.json
rebuild-database.js

# Environment
.env
.env.local
```

### Task 1.7: Create Session Progress Tracker

**File:** `v3-sessions/SESSION-PROGRESS.md`

```markdown
# V3 Development Session Progress

**Project:** HD Knowledge Engine V3
**Start Date:** [DATE]

---

## Session Status

| # | Session | Status | Started | Completed | Branch | Tests | Notes |
|---|---------|--------|---------|-----------|--------|-------|-------|
| 01 | Foundation Setup | ✅ | [DATE] | [DATE] | session-01-foundation | ✅ | - |
| 02 | Configuration System | ⏳ | - | - | - | - | Waiting for 01 |
| 03 | TypeScript Definitions | ⏳ | - | - | - | - | Waiting for 02 |
| 04 | Extension Layer | ⏳ | - | - | - | - | Waiting for 03 |
| 05 | Integration Testing | ⏳ | - | - | - | - | Waiting for 04 |
| 06 | Documentation | ⏳ | - | - | - | - | Waiting for 05 |
| 07 | Examples | ⏳ | - | - | - | - | Waiting for 05 |
| 08 | Migration Tools | ⏳ | - | - | - | - | Waiting for 05 |
| 09 | Extended Testing | ⏳ | - | - | - | - | Waiting for 05 |
| 10 | Release Preparation | ⏳ | - | - | - | - | Waiting for 06-09 |

---

## Checkpoints

### Checkpoint 1: After Session 05
- [ ] Configuration system working
- [ ] TypeScript compiling
- [ ] All tests passing
- [ ] No monolithic database references

### Checkpoint 2: After Session 09
- [ ] Documentation complete
- [ ] Examples tested
- [ ] Migration tools validated
- [ ] Ready for release

---

## Blockers

None yet.

---

## Notes

[Add any project-wide notes here]
```

### Task 1.8: Verify V2 Tests Still Pass

**Run the existing test suite:**

```bash
cd /Volumes/CLAUDE/HD-Knowledge-Engine-V3
node tests/comprehensive-unified-query-tests.js
node tests/adapted-old-tests.js
```

**Expected Result:**
- 55/55 comprehensive tests pass
- 34/34 adapted tests pass
- No errors or warnings

**If tests fail:**
- Debug the issue
- Ensure all files copied correctly
- Fix before proceeding

### Task 1.9: Initial Git Commit

```bash
# Stage all files
git add .

# Commit with clear message
git commit -m "Session 01: Foundation setup for V3

- Initialize V3 project structure
- Copy clean V2 baseline files
- Create new directory structure for extensions, types, tests
- Update package.json to v3.0.0-alpha.1
- Create V3 README documenting goals
- Add enhanced .gitignore preventing monolithic database
- All V2 tests still passing (89/89)

Architecture: Calculation-first, modular, configurable
NO monolithic database - V3 maintains pure computation model

Session: 01/10 (Foundation Setup)
Next: Session 02 (Configuration System)"

# Tag this milestone
git tag -a v3.0.0-alpha.1-session-01 -m "Session 01 complete: Foundation"
```

---

## VERIFICATION CHECKLIST

Before marking this session complete, verify:

### Structure Verification:
- [ ] V3 directory exists at `/Volumes/CLAUDE/HD-Knowledge-Engine-V3`
- [ ] All required directories created
- [ ] All V2 files copied correctly
- [ ] No monolithic database files present

### File Verification:
- [ ] `package.json` exists with correct V3 settings
- [ ] `README.md` explains V3 goals
- [ ] `.gitignore` prevents database files
- [ ] `v3-sessions/` directory has all prompts
- [ ] `unified-query-engine.js` present and functional

### Test Verification:
- [ ] All 89 V2 tests pass
- [ ] No test errors or warnings
- [ ] Query performance maintained

### Git Verification:
- [ ] Repository initialized
- [ ] Initial commit made
- [ ] Tagged as v3.0.0-alpha.1-session-01
- [ ] Branch: session-01-foundation

### Documentation Verification:
- [ ] README.md accurate
- [ ] Session progress tracker created
- [ ] No mentions of monolithic database in positive context

---

## COMPLETION CRITERIA

✅ **This session is complete when:**

1. All directories created
2. All files in place
3. All 89 tests passing
4. Git committed and tagged
5. README documents V3 goals
6. No monolithic database references

✅ **Ready to proceed to Session 02:** Configuration System

---

## TROUBLESHOOTING

### Issue: Tests fail after copying files

**Solution:**
- Check that `node_modules` are not needed (they shouldn't be)
- Verify all `require()` paths still work
- Ensure `core/` and `knowledge-systems/` directories complete

### Issue: Git conflicts

**Solution:**
- Fresh start: delete V3 directory and start over
- Ensure V2-CLEAN is pristine

### Issue: Package.json errors

**Solution:**
- Verify JSON is valid
- Check all paths in "exports" field
- Run `npm install` to test

---

## SESSION SUMMARY TEMPLATE

When complete, post this summary:

```
✅ SESSION 01 COMPLETE: Foundation Setup

Deliverables:
- [x] V3 project directory created
- [x] Clean V2 baseline copied
- [x] New directory structure for V3 features
- [x] Package.json updated to 3.0.0-alpha.1
- [x] V3 README created
- [x] All 89 V2 tests passing
- [x] Git initialized and committed

Tests: 89/89 passing (55 comprehensive + 34 adapted)
Duration: [X hours]
Branch: session-01-foundation
Tag: v3.0.0-alpha.1-session-01

Next Session: 02 (Configuration System)
Status: ✅ READY TO PROCEED
```

---

*Session 01 of 10 - Foundation Setup*
