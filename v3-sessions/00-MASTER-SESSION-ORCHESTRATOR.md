# HD KNOWLEDGE ENGINE V3 - SESSION ORCHESTRATOR

**Version:** 3.0.0
**Created:** November 17, 2025
**Purpose:** Complete rebuild from V2 baseline with modular configuration, TypeScript, and extension architecture

---

## ⚠️ CRITICAL: NO MONOLITHIC DATABASE

**THIS PROJECT MUST NEVER USE:**
- `unified-hd-database.json` (monolithic storage)
- `hd-optimized-lookups.json` (pre-computed lookups)
- Any concept of "rebuilding" a central database

**THIS PROJECT USES:**
- Calculation-first architecture
- Pure functions computing on-demand
- Modular JSON mappings per knowledge system
- Immutable mathematical foundation

**IF YOU SEE MENTIONS OF:**
- "rebuild database"
- "unified-hd-database"
- "optimize lookups"
- "pre-compute"

**IMMEDIATELY STOP AND FLAG THIS AS AN ERROR.** The monolithic database architecture was V1.x and should never return.

---

## PROJECT STRUCTURE

```
HD-Knowledge-Engine-V3/
├── core/
│   ├── root-system/
│   │   ├── positioning-algorithm.js      # Mathematical foundation
│   │   ├── wheel-config.js               # NEW: Modular configuration
│   │   ├── binary-identity.json          # Immutable binary patterns
│   │   ├── sequences/                    # NEW: Swappable gate sequences
│   │   │   ├── hd-standard.json
│   │   │   ├── iching-traditional.json
│   │   │   └── README.md
│   ├── unified-query-engine.js           # Core query interface
│   └── types/                            # NEW: TypeScript definitions
│       ├── index.d.ts
│       ├── config.d.ts
│       ├── positioning.d.ts
│       ├── knowledge-systems.d.ts
│       └── query-engine.d.ts
├── extensions/                           # NEW: Extended queries
│   ├── collection-queries.js
│   ├── enriched-queries.js
│   ├── index.js
│   └── types/
│       └── extensions.d.ts
├── knowledge-systems/                    # Existing 11 systems
│   ├── gene-keys/
│   ├── iching-names/
│   ├── hd-gates/
│   ├── hd-traditional-gates/
│   ├── quarters/
│   ├── trigrams/
│   ├── faces/
│   ├── codon-rings/
│   ├── channels/
│   ├── incarnation-crosses/
│   └── centers/
├── tests/
│   ├── configuration/                   # NEW: Config tests
│   ├── types/                           # NEW: TypeScript tests
│   ├── integration/                     # NEW: Full system tests
│   └── comprehensive-unified-query-tests.js
├── package.json
└── README.md
```

---

## SESSION EXECUTION MODEL

### Execution Rules

1. **SEQUENTIAL SESSIONS (MUST COMPLETE IN ORDER):**
   - Sessions 01-05 MUST run sequentially
   - Each session MUST pass all tests before next session starts
   - Each session MUST be merged to main branch before next starts

2. **PARALLEL SESSIONS (CAN RUN SIMULTANEOUSLY):**
   - Sessions 06-09 CAN run in parallel AFTER Session 05 completes
   - Each parallel session works on independent code paths
   - All parallel sessions MUST complete and merge before Session 10

3. **VERIFICATION CHECKPOINTS:**
   - After Sessions 01-05: Full system must be functional
   - After Sessions 06-09: All features must integrate cleanly
   - After Session 10: Production-ready release

### Branch Strategy

```
main (protected)
├── session-01-foundation        # Sequential
├── session-02-configuration     # Sequential
├── session-03-typescript        # Sequential
├── session-04-extensions        # Sequential
├── session-05-integration       # Sequential
│   └── [CHECKPOINT: All sequential work complete]
├── session-06-documentation     # Parallel group
├── session-07-examples          # Parallel group
├── session-08-migration         # Parallel group
├── session-09-testing           # Parallel group
│   └── [CHECKPOINT: All parallel work complete]
└── session-10-release           # Final sequential
```

---

## SESSION OVERVIEW

| Session | Name | Type | Duration | Dependencies | Can Run After |
|---------|------|------|----------|--------------|---------------|
| 00 | Master Orchestrator | Meta | - | None | - |
| 01 | Foundation Setup | Sequential | 2h | None | Start |
| 02 | Configuration System | Sequential | 4h | 01 | 01 complete |
| 03 | TypeScript Definitions | Sequential | 3h | 02 | 02 complete |
| 04 | Extension Layer | Sequential | 4h | 03 | 03 complete |
| 05 | Integration & Testing | Sequential | 3h | 04 | 04 complete |
| 06 | Documentation | Parallel | 2h | 05 | 05 complete |
| 07 | Examples & Demos | Parallel | 2h | 05 | 05 complete |
| 08 | Migration Tools | Parallel | 2h | 05 | 05 complete |
| 09 | Extended Testing | Parallel | 3h | 05 | 05 complete |
| 10 | Release Preparation | Sequential | 2h | 06-09 | All complete |

**Total Time:** ~27 hours (3-4 days with parallel execution)

---

## SESSION CHECKLIST

### Before Starting ANY Session:

- [ ] Read this master orchestrator document completely
- [ ] Verify your session number and dependencies
- [ ] Check that all prerequisite sessions are complete and merged
- [ ] Create your session branch from latest main
- [ ] Read your specific session prompt thoroughly

### During Your Session:

- [ ] Follow your session prompt exactly
- [ ] Run all tests frequently
- [ ] Never mention or use monolithic database concepts
- [ ] Commit early and often with clear messages
- [ ] Document any issues or blockers

### Before Completing Your Session:

- [ ] All tests pass (100% required)
- [ ] Code follows project patterns
- [ ] No references to old database architecture
- [ ] Session deliverables complete
- [ ] Ready for code review and merge

---

## VERIFICATION CHECKPOINTS

### Checkpoint 1: After Session 05 (Foundation Complete)

**What MUST Work:**
- [ ] Configuration system allows switching wheel sequences
- [ ] TypeScript definitions compile without errors
- [ ] All 11 knowledge systems query successfully
- [ ] Core + Extensions separated cleanly
- [ ] All 89 original tests pass
- [ ] New configuration tests pass
- [ ] Performance maintained (<5ms per query)

**What MUST NOT Exist:**
- [ ] No monolithic database files
- [ ] No "rebuild" scripts
- [ ] No pre-computed lookup tables
- [ ] No references to v1.x architecture

### Checkpoint 2: After Session 09 (All Features Complete)

**What MUST Work:**
- [ ] All documentation complete and accurate
- [ ] All examples run successfully
- [ ] Migration tools tested on real V2 code
- [ ] Extended tests cover edge cases
- [ ] TypeScript usage tested
- [ ] Performance benchmarks pass

**Ready For:**
- [ ] Beta release
- [ ] External testing
- [ ] Production deployment

---

## SESSION PROMPTS

### Sequential Sessions (Run in Order):

1. **[SESSION-01-FOUNDATION-SETUP.md](./SESSION-01-FOUNDATION-SETUP.md)**
   - Set up V3 project structure
   - Copy V2 baseline
   - Initialize git, package.json
   - **Dependencies:** None
   - **Duration:** 2 hours

2. **[SESSION-02-CONFIGURATION-SYSTEM.md](./SESSION-02-CONFIGURATION-SYSTEM.md)**
   - Build wheel-config.js
   - Create sequence files
   - Update positioning-algorithm.js
   - Test direction hypothesis
   - **Dependencies:** Session 01 complete
   - **Duration:** 4 hours

3. **[SESSION-03-TYPESCRIPT-DEFINITIONS.md](./SESSION-03-TYPESCRIPT-DEFINITIONS.md)**
   - Create all .d.ts files
   - Set up TypeScript tooling
   - Verify compilation
   - **Dependencies:** Session 02 complete
   - **Duration:** 3 hours

4. **[SESSION-04-EXTENSION-LAYER.md](./SESSION-04-EXTENSION-LAYER.md)**
   - Build extensions/ directory
   - Separate collection queries
   - Separate enriched queries
   - **Dependencies:** Session 03 complete
   - **Duration:** 4 hours

5. **[SESSION-05-INTEGRATION-TESTING.md](./SESSION-05-INTEGRATION-TESTING.md)**
   - Integration tests
   - Regression tests
   - Performance benchmarks
   - **Dependencies:** Session 04 complete
   - **Duration:** 3 hours

### Parallel Sessions (After Session 05):

6. **[SESSION-06-DOCUMENTATION.md](./SESSION-06-DOCUMENTATION.md)**
   - API documentation
   - Configuration guide
   - Architecture docs
   - **Dependencies:** Session 05 complete
   - **Duration:** 2 hours
   - **Can run in parallel with:** 07, 08, 09

7. **[SESSION-07-EXAMPLES.md](./SESSION-07-EXAMPLES.md)**
   - Basic usage examples
   - Configuration examples
   - TypeScript examples
   - **Dependencies:** Session 05 complete
   - **Duration:** 2 hours
   - **Can run in parallel with:** 06, 08, 09

8. **[SESSION-08-MIGRATION-TOOLS.md](./SESSION-08-MIGRATION-TOOLS.md)**
   - Migration guide
   - Automated migration script
   - Breaking changes doc
   - **Dependencies:** Session 05 complete
   - **Duration:** 2 hours
   - **Can run in parallel with:** 06, 07, 09

9. **[SESSION-09-EXTENDED-TESTING.md](./SESSION-09-EXTENDED-TESTING.md)**
   - Edge case tests
   - TypeScript compilation tests
   - Real-world scenario tests
   - **Dependencies:** Session 05 complete
   - **Duration:** 3 hours
   - **Can run in parallel with:** 06, 07, 08

### Final Session:

10. **[SESSION-10-RELEASE-PREPARATION.md](./SESSION-10-RELEASE-PREPARATION.md)**
    - Version bump to 3.0.0
    - CHANGELOG.md
    - Package.json updates
    - Pre-release checks
    - **Dependencies:** Sessions 06-09 complete
    - **Duration:** 2 hours

---

## HOW TO USE THIS SYSTEM

### For the Project Lead:

1. Create the V3 repository from the clean V2 baseline
2. Copy all session prompt files to `v3-sessions/` directory
3. Merge this master orchestrator to main branch
4. Open Session 01 in new Claude session
5. Monitor progress and verify checkpoints
6. Merge completed sessions before starting dependent sessions

### For Each Session Worker (Claude):

1. **Start Session:**
   ```
   I am starting SESSION-XX-[NAME] for HD Knowledge Engine V3.

   I have read the master orchestrator and understand:
   - My session number and dependencies
   - That I must NEVER mention monolithic database
   - That I must pass all tests before completing
   - My session's specific goals

   I am ready to begin. I will now read my session prompt.
   ```

2. **During Session:**
   - Follow your prompt exactly
   - Run tests frequently
   - Flag any issues immediately
   - Stay focused on your session scope

3. **Complete Session:**
   ```
   I have completed SESSION-XX-[NAME].

   Deliverables:
   - [x] All required files created
   - [x] All tests passing
   - [x] No monolithic database references
   - [x] Ready for merge

   Summary: [Brief summary of what was accomplished]

   Next Session: [Which session can start next]
   ```

---

## CRITICAL SUCCESS FACTORS

### ✅ Must Have:

1. **Calculation-First Architecture**
   - All data computed on-demand
   - No pre-built database files
   - Pure functions only

2. **Modular Configuration**
   - Swappable gate sequences
   - Configurable direction/rotation
   - Multiple presets

3. **TypeScript Support**
   - Complete type definitions
   - Compilation verified
   - IntelliSense working

4. **Clean Separation**
   - Core vs Extensions clear
   - No circular dependencies
   - Each layer has distinct purpose

5. **Backward Compatibility**
   - V2 code works with V3
   - Default config matches V2.0.0
   - Migration path clear

### ❌ Must Not Have:

1. **Monolithic Database**
   - unified-hd-database.json
   - hd-optimized-lookups.json
   - Any "rebuild" scripts

2. **V1.x Patterns**
   - Pre-computed lookups
   - Centralized storage
   - Complex rebuild workflows

3. **Broken Dependencies**
   - Sessions running out of order
   - Untested merges
   - Skipped verifications

---

## COMMON PITFALLS TO AVOID

### ❌ Don't Do This:

```javascript
// BAD: Loading monolithic database
const database = require('./data/unified-hd-database.json');

// BAD: Pre-computing and storing
function rebuildDatabase() {
  const gates = {};
  for (let i = 1; i <= 64; i++) {
    gates[i] = computeGateData(i);
  }
  fs.writeFileSync('database.json', JSON.stringify(gates));
}

// BAD: Trying to "optimize" with storage
const lookupTable = preComputeAllGates();
```

### ✅ Do This Instead:

```javascript
// GOOD: Computing on-demand
function getGateKnowledge(gateNumber) {
  const foundation = positioning.getDockingData(gateNumber);
  const knowledge = {
    // Compute everything right now
    geneKeys: lookupGeneKeys(gateNumber),
    // etc...
  };
  return knowledge;
}

// GOOD: Pure calculation function
function getWheelPosition(gateNumber, lineNumber) {
  // Calculate using immutable data
  const wheelIndex = wheelConfig.getWheelIndex(gateNumber);
  return calculatePosition(wheelIndex, lineNumber);
}
```

---

## SUCCESS METRICS

### Session-Level Success:

- [ ] All session deliverables complete
- [ ] All tests pass (100%)
- [ ] No monolithic database references
- [ ] Code review approved
- [ ] Merged to main

### Project-Level Success:

- [ ] All 10 sessions complete
- [ ] All checkpoints passed
- [ ] Performance maintained
- [ ] TypeScript working
- [ ] Documentation complete
- [ ] Ready for release

---

## SUPPORT & ESCALATION

### If You Encounter:

1. **Unclear requirements:** Reference the implementation plan document
2. **Test failures:** Debug before proceeding, don't skip
3. **Merge conflicts:** Coordinate with session lead
4. **Architecture questions:** Check this orchestrator
5. **Monolithic database temptation:** RESIST! Flag for review

### Session Status Tracking:

Update this table as sessions complete:

| Session | Status | Completed | Merged | Tests Pass | Notes |
|---------|--------|-----------|--------|------------|-------|
| 01 | ⏳ Not Started | - | - | - | - |
| 02 | ⏳ Not Started | - | - | - | - |
| 03 | ⏳ Not Started | - | - | - | - |
| 04 | ⏳ Not Started | - | - | - | - |
| 05 | ⏳ Not Started | - | - | - | - |
| 06 | ⏳ Not Started | - | - | - | - |
| 07 | ⏳ Not Started | - | - | - | - |
| 08 | ⏳ Not Started | - | - | - | - |
| 09 | ⏳ Not Started | - | - | - | - |
| 10 | ⏳ Not Started | - | - | - | - |

**Status Legend:**
- ⏳ Not Started
- 🔄 In Progress
- ✅ Complete & Merged
- ❌ Blocked

---

## FINAL CHECKLIST - Before Starting Session 01

- [ ] Clean V2 baseline exists at `/Volumes/CLAUDE/HD-Knowledge-Engine-V2-CLEAN`
- [ ] All session prompts created in `v3-sessions/` directory
- [ ] This master orchestrator is in place
- [ ] Git repository initialized
- [ ] Development branch created
- [ ] Team understands: NO MONOLITHIC DATABASE

**If all boxes checked, you are ready to begin Session 01.**

---

*Generated with Claude Code for HD Knowledge Engine V3*
*This orchestrator ensures clean, modular architecture free from monolithic database patterns*
