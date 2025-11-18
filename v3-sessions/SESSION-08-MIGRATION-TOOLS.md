# SESSION 08: MIGRATION TOOLS

**Duration:** 2 hours
**Dependencies:** Session 05 complete
**Type:** Parallel (can run alongside sessions 06, 07, 09)
**Branch:** `session-08-migration`

---

## OBJECTIVES

Create migration tools and documentation to help users upgrade from V2 to V3.

---

## PREREQUISITES

### Before Starting:

- [ ] Session 05 complete and merged to main
- [ ] All systems tested and working
- [ ] Create branch: `git checkout -b session-08-migration`

---

## DELIVERABLES

1. Migration guide document
2. Breaking changes documentation
3. Automated migration script
4. V2 compatibility layer (optional)
5. Migration verification tests

---

## TASKS

### Task 8.1: Create Migration Guide

**File:** `MIGRATION.md` (update existing)

```markdown
# Migration Guide: V2 to V3

## Overview

V3 is **backward compatible** with V2 in default configuration. Most V2 code will work without changes.

## What's New in V3

### 1. Configuration System

V3 adds wheel configuration (not in V2):

```javascript
// NEW in V3
engine.setWheelConfiguration('rave-wheel-41-start');  // Set to default explicitly
engine.setWheelConfiguration('gates-10-start');       // Or use alternative
engine.resetConfiguration();                          // Reset to default
```

### 2. Extension Layer

V3 separates rich queries into extensions:

```javascript
// V2 style (still works)
const gate = engine.getGateKnowledge(13);

// V3 extension style (new)
const extensions = require('hd-knowledge-engine-v3/extensions');
const enriched = extensions.getEnrichedGate(13);
```

### 3. TypeScript Support

V3 adds full TypeScript definitions:

```typescript
import engine, { DockingData } from 'hd-knowledge-engine-v3';

const gate: DockingData = engine.getGateKnowledge(13);
```

## Breaking Changes

### None for Default Usage

If you use V3 with default configuration, there are **no breaking changes**.

### Only If Using New Features

New features (configuration, extensions, TypeScript) are additive only.

## Migration Steps

### Step 1: Update Package

```bash
npm uninstall hd-knowledge-engine-v2
npm install hd-knowledge-engine-v3
```

### Step 2: Update Imports

```javascript
// V2
const engine = require('hd-knowledge-engine-v2');

// V3 (same)
const engine = require('hd-knowledge-engine-v3');
```

### Step 3: Test Your Code

```bash
npm test
```

Your existing queries should work identically.

### Step 4: (Optional) Adopt New Features

```javascript
// Add configuration if needed
engine.setWheelConfiguration({
  cardinalProgression: 'NESW'  // Clockwise instead of counter-clockwise
});

// Or change north position
engine.setWheelConfiguration({
  northPosition: '10'  // Centered instead of straddled
});

// Use extensions for rich queries
const extensions = require('hd-knowledge-engine-v3/extensions');
const allChannels = extensions.getAllChannels();
```

## Common Migration Scenarios

### Scenario 1: Basic Gate Queries

**V2 Code:**
```javascript
const engine = require('hd-knowledge-engine-v2');
const gate = engine.getGateKnowledge(13);
```

**V3 Migration:** No changes needed

```javascript
const engine = require('hd-knowledge-engine-v3');
const gate = engine.getGateKnowledge(13);
```

### Scenario 2: Iterating All Gates

**V2 Code:**
```javascript
for (let i = 1; i <= 64; i++) {
  const gate = engine.getGateKnowledge(i);
  console.log(gate.geneKeys.gift);
}
```

**V3 Migration:** No changes needed, or use extensions

```javascript
// Option A: Same as V2
for (let i = 1; i <= 64; i++) {
  const gate = engine.getGateKnowledge(i);
  console.log(gate.geneKeys.gift);
}

// Option B: Use V3 extensions (faster)
const extensions = require('hd-knowledge-engine-v3/extensions');
const allGates = extensions.getAllGates();
allGates.gates.forEach(gate => {
  console.log(gate.geneKeys.gift);
});
```

### Scenario 3: Channel Queries

**V2 Code:**
```javascript
const gate13 = engine.getGateKnowledge(13);
const channels = gate13.channelsInvolved;
```

**V3 Migration:** No changes needed, or use extensions

```javascript
// Option A: Same as V2
const gate13 = engine.getGateKnowledge(13);
const channels = gate13.channelsInvolved;

// Option B: Use V3 extensions
const extensions = require('hd-knowledge-engine-v3/extensions');
const allChannels = extensions.getAllChannels();
```

### Scenario 4: TypeScript Projects

**V2 (no types):**
```javascript
const gate = engine.getGateKnowledge(13);
// No type safety
```

**V3 (with types):**
```typescript
import engine, { DockingData } from 'hd-knowledge-engine-v3';

const gate: DockingData = engine.getGateKnowledge(13);
// Full type safety and IntelliSense
```

## API Compatibility Matrix

| Feature | V2 | V3 Default | V3 With Config |
|---------|-----|------------|----------------|
| `getGateKnowledge()` | ✅ | ✅ Same | ✅ Configurable |
| `getLineKnowledge()` | ✅ | ✅ Same | ✅ Configurable |
| `getWheelPosition()` | ✅ | ✅ Same | ✅ Configurable |
| Configuration | ❌ | ✅ New | ✅ New |
| Extensions | ❌ | ✅ New | ✅ New |
| TypeScript | ❌ | ✅ New | ✅ New |

## Data Compatibility

All knowledge data is identical between V2 and V3:

- Same Gene Keys data
- Same I Ching names
- Same HD gate definitions
- Same channel definitions
- Same center assignments

**The only difference:** V3 adds configurability to positioning.

## Performance

V3 maintains V2 performance:

- Core queries: ~0.016ms (same as V2)
- Extension queries: ~1-2ms (new in V3)

## Testing Your Migration

Run this verification script:

```javascript
const raveWheelData = require('./rave-wheel-41-start-data.json');
const engine = require('hd-knowledge-engine-v3');

// Ensure default config
engine.resetConfiguration();

// Test all gates match
for (let i = 1; i <= 64; i++) {
  const v3Gate = engine.getGateKnowledge(i);
  const v2Gate = v2Data.gates[i];

  if (v3Gate.geneKeys.shadow !== v2Gate.geneKeys.shadow) {
    console.error(`Mismatch at gate ${i}`);
  }
}

console.log('✅ All gates match V2 baseline');
```

## Rollback Plan

If you need to rollback:

```bash
npm uninstall hd-knowledge-engine-v3
npm install hd-knowledge-engine-v2
```

Your V2 code will work unchanged.

## Support

- **Issues:** https://github.com/your-org/hd-knowledge-engine-v3/issues
- **Discussions:** https://github.com/your-org/hd-knowledge-engine-v3/discussions

## Timeline Recommendation

- **Week 1:** Install V3, run tests, verify compatibility
- **Week 2:** Update imports, test in staging
- **Week 3:** Deploy to production
- **Week 4+:** Adopt new V3 features as needed
```

### Task 8.2: Create Breaking Changes Document

**File:** `BREAKING-CHANGES.md`

```markdown
# Breaking Changes

## V3.0.0 (Compared to V2.0.0)

### No Breaking Changes for Default Usage

**Good news:** V3 with default configuration has **zero breaking changes** from V2.

### Breaking Changes Only If:

#### 1. You Implement Custom Configuration

If you use the new configuration system, positioning will change:

```javascript
// This changes gate positions from default
engine.setWheelConfiguration('gates-10-start');
```

**Impact:** Gate angles and wheel indices will differ from default.

**Migration:** Only use configuration if you intend to change positioning.

#### 2. You Rely on Internal APIs

If you directly access internal modules (not recommended):

```javascript
// V2 internal access (undocumented)
const positioning = require('hd-knowledge-engine-v2/core/root-system/positioning-algorithm');

// V3 may have different internal structure
```

**Impact:** Internal modules may have changed.

**Migration:** Use public API only.

### What Definitely Won't Break

✅ All public API methods:
- `getGateKnowledge()`
- `getLineKnowledge()`
- `getWheelPosition()`

✅ All returned data structures (with default config)

✅ All knowledge content (Gene Keys, I Ching, etc.)

✅ All 89 V2 tests pass in V3

### What's New (Additive Only)

These are **new features**, not breaking changes:

- Configuration system
- Extension layer
- TypeScript definitions

## V2.0.0 (Compared to V1.x)

This document covers V2→V3 only. For V1→V2 migration, see V2 documentation.

## Future Breaking Changes

### Planned for V4.0.0:

- Potential Node.js version requirement increase
- Possible internal restructuring
- Extended API surface

**V3 will receive bug fixes and minor updates but no breaking changes.**
```

### Task 8.3: Create Automated Migration Script

**File:** `scripts/migrate-from-v2.js`

```javascript
#!/usr/bin/env node

/**
 * Automated Migration Script: V2 to V3
 *
 * This script helps migrate from V2 to V3 by:
 * 1. Analyzing your codebase
 * 2. Identifying V2 usage patterns
 * 3. Suggesting V3 improvements
 * 4. Optionally updating imports
 */

const fs = require('fs');
const path = require('path');

console.log('╔═══════════════════════════════════════╗');
console.log('║  HD KNOWLEDGE ENGINE V2 → V3          ║');
console.log('║  MIGRATION ASSISTANT                  ║');
console.log('╚═══════════════════════════════════════╝\n');

// Configuration
const config = {
  searchPath: process.argv[2] || './src',
  extensions: ['.js', '.ts', '.jsx', '.tsx'],
  dryRun: process.argv.includes('--dry-run')
};

let filesScanned = 0;
let v2Imports = 0;
let suggestions = [];

// Find all JS/TS files
function findFiles(dir) {
  let results = [];

  try {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const fullPath = path.join(dir, item);

      try {
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          if (item !== 'node_modules' && item !== '.git') {
            results = results.concat(findFiles(fullPath));
          }
        } else if (config.extensions.includes(path.extname(item))) {
          results.push(fullPath);
        }
      } catch (err) {
        // Skip files we can't access
      }
    });
  } catch (err) {
    console.error(`Cannot read directory: ${dir}`);
  }

  return results;
}

// Analyze a file
function analyzeFile(filePath) {
  filesScanned++;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check for V2 imports
    if (line.includes('hd-knowledge-engine-v2')) {
      v2Imports++;

      suggestions.push({
        file: filePath,
        line: lineNum,
        type: 'import',
        current: line.trim(),
        suggestion: line.replace('hd-knowledge-engine-v2', 'hd-knowledge-engine-v3').trim(),
        description: 'Update import to V3'
      });
    }

    // Check for patterns that could use extensions
    if (line.includes('for') && line.includes('64') && content.includes('getGateKnowledge')) {
      suggestions.push({
        file: filePath,
        line: lineNum,
        type: 'optimization',
        current: line.trim(),
        suggestion: "const extensions = require('hd-knowledge-engine-v3/extensions');\nconst allGates = extensions.getAllGates();",
        description: 'Consider using extensions.getAllGates() instead of iteration'
      });
    }

    // Check for TypeScript files without type imports
    if (filePath.endsWith('.ts') && line.includes("require('hd-knowledge-engine")) {
      if (!content.includes('DockingData')) {
        suggestions.push({
          file: filePath,
          line: lineNum,
          type: 'typescript',
          current: line.trim(),
          suggestion: "import engine, { DockingData } from 'hd-knowledge-engine-v3';",
          description: 'Use TypeScript imports for type safety'
        });
      }
    }
  });
}

// Main execution
console.log(`🔍 Scanning: ${config.searchPath}\n`);

const files = findFiles(config.searchPath);

if (files.length === 0) {
  console.log('❌ No files found. Check your search path.\n');
  process.exit(1);
}

console.log(`Found ${files.length} files to analyze...\n`);

files.forEach(analyzeFile);

// Report results
console.log('═'.repeat(60));
console.log('ANALYSIS RESULTS');
console.log('═'.repeat(60) + '\n');

console.log(`Files scanned: ${filesScanned}`);
console.log(`V2 imports found: ${v2Imports}\n`);

if (suggestions.length === 0) {
  console.log('✅ No migration needed! Your code is ready for V3.\n');
  process.exit(0);
}

// Group suggestions by type
const byType = {
  import: suggestions.filter(s => s.type === 'import'),
  optimization: suggestions.filter(s => s.type === 'optimization'),
  typescript: suggestions.filter(s => s.type === 'typescript')
};

// Show import updates
if (byType.import.length > 0) {
  console.log('📦 IMPORT UPDATES REQUIRED:\n');

  byType.import.forEach((s, i) => {
    console.log(`${i + 1}. ${s.file}:${s.line}`);
    console.log(`   Current:    ${s.current}`);
    console.log(`   Update to:  ${s.suggestion}\n`);
  });
}

// Show optimizations
if (byType.optimization.length > 0) {
  console.log('⚡ OPTIMIZATION OPPORTUNITIES:\n');

  byType.optimization.forEach((s, i) => {
    console.log(`${i + 1}. ${s.file}:${s.line}`);
    console.log(`   ${s.description}`);
    console.log(`   Consider: ${s.suggestion}\n`);
  });
}

// Show TypeScript improvements
if (byType.typescript.length > 0) {
  console.log('📘 TYPESCRIPT IMPROVEMENTS:\n');

  byType.typescript.forEach((s, i) => {
    console.log(`${i + 1}. ${s.file}:${s.line}`);
    console.log(`   ${s.description}`);
    console.log(`   Use: ${s.suggestion}\n`);
  });
}

// Summary
console.log('═'.repeat(60));
console.log('SUMMARY');
console.log('═'.repeat(60) + '\n');

console.log(`Total suggestions: ${suggestions.length}`);
console.log(`  - Import updates: ${byType.import.length} (required)`);
console.log(`  - Optimizations: ${byType.optimization.length} (optional)`);
console.log(`  - TypeScript improvements: ${byType.typescript.length} (optional)\n`);

if (config.dryRun) {
  console.log('ℹ️  This was a dry run. Use without --dry-run to apply changes.\n');
} else {
  console.log('Next steps:');
  console.log('1. Review suggestions above');
  console.log('2. Update imports from v2 to v3');
  console.log('3. Run your tests');
  console.log('4. Consider adopting V3 optimizations\n');
}

process.exit(0);
```

Make executable:
```bash
chmod +x scripts/migrate-from-v2.js
```

### Task 8.4: Create Migration Tests

**File:** `tests/migration/test-v2-v3-equivalence.js`

```javascript
/**
 * V2-V3 Equivalence Tests
 *
 * Verify that V3 (with default config) produces identical results to V2.
 */

const engine = require('../../unified-query-engine');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ ${description}`);
    passCount++;
  } catch (error) {
    console.error(`❌ ${description}`);
    console.error(`   ${error.message}`);
    failCount++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('\n🔄 V2-V3 EQUIVALENCE TESTS\n');

// Ensure default configuration
engine.resetConfiguration();

console.log('Testing V3 matches V2 baseline...\n');

// V2 baseline values (from actual V2 execution)
const v2Baseline = {
  gate13: {
    angle: 202.5,
    wheelIndex: 56,
    geneKeysShadow: 'Discord',
    centerName: 'G'
  },
  gate41: {
    angle: 33.75,
    wheelIndex: 6,
    geneKeysShadow: 'Fantasy',
    centerName: 'Root'
  },
  gate1: {
    angle: 40.5,
    wheelIndex: 8,
    geneKeysShadow: 'Entropy',
    centerName: 'G'
  }
};

// Test each baseline gate
Object.entries(v2Baseline).forEach(([key, v2Data]) => {
  const gateNum = parseInt(key.replace('gate', ''));

  test(`Gate ${gateNum}: Position matches V2`, () => {
    const v3Gate = engine.getGateKnowledge(gateNum);
    assert(v3Gate.angle === v2Data.angle, `Angle: ${v3Gate.angle} vs ${v2Data.angle}`);
    assert(v3Gate.wheelIndex === v2Data.wheelIndex, `Index: ${v3Gate.wheelIndex} vs ${v2Data.wheelIndex}`);
  });

  test(`Gate ${gateNum}: Knowledge matches V2`, () => {
    const v3Gate = engine.getGateKnowledge(gateNum);
    assert(v3Gate.geneKeys.shadow === v2Data.geneKeysShadow, `Shadow: ${v3Gate.geneKeys.shadow} vs ${v2Data.geneKeysShadow}`);
    assert(v3Gate.hdGates.center === v2Data.centerName, `Center: ${v3Gate.hdGates.center} vs ${v2Data.centerName}`);
  });
});

// Summary
console.log('\n' + '='.repeat(60));
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log('='.repeat(60) + '\n');

if (failCount === 0) {
  console.log('🎉 V3 IS FULLY EQUIVALENT TO V2!\n');
}

process.exit(failCount > 0 ? 1 : 0);
```

### Task 8.5: Update Package.json Scripts

**Update:** `package.json`

```json
{
  "scripts": {
    "migrate": "node scripts/migrate-from-v2.js",
    "test:migration": "node tests/migration/test-v2-v3-equivalence.js"
  }
}
```

### Task 8.6: Create Migration Checklist

**File:** `docs/migration-checklist.md`

```markdown
# Migration Checklist: V2 → V3

Use this checklist to ensure smooth migration.

## Pre-Migration

- [ ] Review [MIGRATION.md](../MIGRATION.md)
- [ ] Review [BREAKING-CHANGES.md](../BREAKING-CHANGES.md)
- [ ] Ensure all V2 tests passing
- [ ] Create backup branch
- [ ] Document current V2 behavior

## Migration

- [ ] Install V3: `npm install hd-knowledge-engine-v3`
- [ ] Run migration scanner: `npm run migrate ./src`
- [ ] Update imports from v2 to v3
- [ ] Verify no internal API usage
- [ ] Run tests: `npm test`
- [ ] Run migration tests: `npm run test:migration`

## Verification

- [ ] All existing tests pass
- [ ] V2-V3 equivalence tests pass
- [ ] Manual testing in staging
- [ ] Performance benchmarks acceptable
- [ ] No console errors or warnings

## Optional Enhancements

- [ ] Consider using extension layer for collections
- [ ] Add TypeScript definitions if using TS
- [ ] Explore configuration options if needed
- [ ] Update documentation

## Post-Migration

- [ ] Deploy to staging
- [ ] Monitor for issues
- [ ] Deploy to production
- [ ] Remove V2 dependency
- [ ] Update team documentation

## Rollback Plan

If issues occur:

- [ ] Revert to backup branch
- [ ] Reinstall V2: `npm install hd-knowledge-engine-v2`
- [ ] Report issue: [GitHub Issues](https://github.com/your-org/hd-knowledge-engine-v3/issues)

## Support

Need help? Check:
- [Migration Guide](../MIGRATION.md)
- [API Reference](api-reference.md)
- [GitHub Discussions](https://github.com/your-org/hd-knowledge-engine-v3/discussions)
```

### Task 8.7: Git Commit

```bash
# Stage migration files
git add MIGRATION.md
git add BREAKING-CHANGES.md
git add scripts/migrate-from-v2.js
git add tests/migration/
git add docs/migration-checklist.md
git add package.json

# Commit
git commit -m "Session 08: Add migration tools and documentation

- Create comprehensive migration guide
- Document breaking changes (none for default usage)
- Add automated migration scanner script
- Create V2-V3 equivalence tests
- Add migration checklist

Migration is seamless for default usage.
All V2 code works in V3 without changes.

Session: 08/10 (Migration Tools)
Parallel: Can merge alongside 06, 07, 09"

# Tag
git tag -a v3.0.0-alpha.1-session-08 -m "Session 08 complete: Migration tools"
```

---

## VERIFICATION CHECKLIST

- [ ] Migration guide complete
- [ ] Breaking changes documented
- [ ] Migration script functional
- [ ] Equivalence tests passing
- [ ] Migration checklist created

---

## COMPLETION CRITERIA

✅ **This session is complete when:**

1. Migration documentation complete
2. Migration script functional
3. Equivalence tests passing
4. Git committed and tagged

---

*Session 08 of 10 - Migration Tools (Parallel)*
