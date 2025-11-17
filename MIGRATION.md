# Migration from v1.x to v2.0

## Overview

v2.0 represents a complete architectural redesign from monolithic to modular.

## Key Changes

| v1.x | v2.0 |
|------|------|
| Monolithic 3.2MB database | Modular knowledge systems |
| 4 knowledge systems | 11 knowledge systems |
| Embedded data in every gate | Calculated on-demand |
| `hd-query-engine.js` | `unified-query-engine.js` |
| Manual database rebuilds | No rebuilds needed |

## API Migration

### Old Code (v1.x)

```javascript
const HdQuery = require('./scripts/hd-query-engine.js');
const engine = new HdQuery('data/database/unified-hd-database.json');

const gate = engine.getGate(13);
console.log(gate.geneKeys.shadow);
```

### New Code (v2.0)

```javascript
const { getGateKnowledge } = require('./unified-query-engine.js');

const gate = getGateKnowledge(13);
console.log(gate.geneKeys.shadow);
```

## What's Removed

- `data/database/unified-hd-database.json` - No longer needed (modular data)
- `scripts/hd-query-engine.js` - Replaced by `unified-query-engine.js`
- `scripts/hd-fast-query.js` - No longer needed (unified engine is fast)
- `scripts/rebuild-database.js` - No longer needed (no database to rebuild)

## What's Added

- 7 new knowledge systems (Quarters, Trigrams, Faces, I Ching Names, HD Gates, Channels, Centers)
- Comprehensive test suites (89 tests total)
- Modular architecture (easy to extend)

## Questions?

See v1.x archive at: [Your archive URL]
