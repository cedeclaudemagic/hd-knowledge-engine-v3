# Phase 1 Considerations: Visualization Core Integration

## What We're Bringing In

From `hd-svg-visualization/core/`:

| File | Purpose | Lines | Tests | Complexity |
|------|---------|-------|-------|------------|
| `svg-geometry.js` | Angle → coordinates | 386 | 109 | Low - pure math |
| `svg-document.js` | JSDOM wrapper | ~400 | 79 | Medium - DOM handling |
| `attribute-mapper.js` | Knowledge → attributes | 380 | 92 | Medium - needs V3 adaptation |
| `attribute-schema.js` | Attribute definitions | 250 | N/A | Low - just constants |

**Total:** ~1,400 lines of tested, working code

---

## Key Decision: Adapter Pattern

### The Original Pattern (V2)

```javascript
// hd-svg-visualization created a V2Adapter that wraps the engine
const V2Adapter = require('./v2-adapter.js');
const adapter = new V2Adapter();
const docking = adapter.getDockingData(13, 4);
```

### Options for V3

**Option A: Create V3Adapter (same pattern)**
```javascript
// visualization/core/v3-adapter.js
const positioning = require('../../core/root-system/positioning-algorithm.js');
const engine = require('../../unified-query-engine.js');

class V3Adapter {
  getDockingData(gate, line) {
    return positioning.getDockingData(gate, line);
  }
  getGateKnowledge(gate, line) {
    return engine.getGateKnowledge(gate, line);
  }
  // ... other methods
}
```
- **Pro:** Clean separation, easy to test, matches existing code
- **Con:** Extra layer of indirection

**Option B: Direct integration**
```javascript
// visualization/core/svg-geometry.js
const positioning = require('../../core/root-system/positioning-algorithm.js');

class SVGGeometry {
  getRadialPosition(gate, line, radius) {
    const docking = positioning.getDockingData(gate, line);
    // ... convert to coordinates
  }
}
```
- **Pro:** Simpler, fewer files
- **Con:** Tighter coupling, harder to test in isolation

### Recommendation: Option A (V3Adapter)

Reasons:
1. The existing code already uses this pattern - less rewriting
2. Makes testing easier (can mock the adapter)
3. Clear interface between knowledge and visualization
4. If V3's API changes, only adapter needs updating

---

## What Needs Adaptation

### 1. Import Paths

**Before (V2):**
```javascript
const HDEngine = require('hd-knowledge-engine-v2');
const positioning = require('hd-knowledge-engine-v2/core/root-system/positioning-algorithm.js');
```

**After (V3):**
```javascript
const positioning = require('../../core/root-system/positioning-algorithm.js');
const engine = require('../../unified-query-engine.js');
```

### 2. API Differences (if any)

Need to verify:
- Does V3's `getDockingData()` return the same fields as V2?
- Are there any renamed methods?
- Any new capabilities to expose?

**Check:** Compare V2 and V3 positioning algorithm outputs

### 3. Binary Convention

V3 has the **corrected** binary patterns (bottom-to-top):
- Thunder: `100` (not `001`)
- Mountain: `001` (not `100`)
- Wind: `011` (not `110`)
- Lake: `110` (not `011`)

The visualization code uses binary for polarity calculation:
```javascript
calculatePolarity(binary, lineNumber) {
  const bitIndex = lineNumber - 1;  // Line 1 = index 0
  return binary[bitIndex] === '1' ? 'YANG' : 'YIN';
}
```

This should work correctly with V3's bottom-to-top convention.

---

## Iterative Approach

### Step 1: Minimal Integration (1 hour)

1. Create `visualization/` directory
2. Copy `svg-geometry.js` only
3. Create minimal `v3-adapter.js`
4. Write one test: `getRadialPosition(41, 1)` returns expected coordinates
5. Verify it works

### Step 2: Full Geometry (1 hour)

1. Port all svg-geometry tests
2. Verify all 384 positions calculate correctly
3. Test quarter/face arc calculations

### Step 3: Document Handling (1 hour)

1. Copy `svg-document.js`
2. Add jsdom dependency
3. Test loading an actual SVG file
4. Test querying elements

### Step 4: Attribute Mapping (1-2 hours)

1. Copy `attribute-mapper.js` and `attribute-schema.js`
2. Adapt for V3 API
3. Test polarity calculation against V3 binary patterns
4. Verify all 64 gates map correctly

### Step 5: Integration Test (30 min)

1. Full pipeline test:
   - Load SVG template
   - Query for gate element
   - Calculate position from V3
   - Verify coordinates match
   - Apply attributes
   - Save modified SVG

---

## Boundaries & Future Concerns

### What We're NOT Doing in Phase 1

- Building generators (that's Phase 3)
- Fixing SVG templates (that's Phase 2)
- Creating CLI tools (that's Phase 4)
- Website integration (that's Phase 6)

### What Might Come Up

1. **JSDOM performance** - Large SVG files (4MB+) may be slow
   - Defer: Only matters when we load real templates in Phase 2

2. **Coordinate precision** - Do we need sub-pixel accuracy?
   - For print (64" mandala): Yes, probably
   - For article illustrations: No, close enough is fine
   - Defer: Test with real templates

3. **Color handling** - The existing code has color conversion
   - Not copying that yet
   - Defer: Only needed for theming

4. **Animation** - None of the current code handles animation
   - Defer: Future consideration for web

---

## Success Metrics for Phase 1

By end of Phase 1, we should be able to run:

```javascript
const { SVGGeometry, SVGDocument, AttributeMapper } = require('./visualization');

// Test 1: Calculate position
const geometry = new SVGGeometry();
const pos = geometry.getRadialPosition(13, 4);
console.log(pos);
// { gate: 13, line: 4, angle: 14.0625, x: 608.12, y: 200.34, ... }

// Test 2: Load and query SVG (if we have a test file)
const doc = new SVGDocument();
await doc.loadFromFile('./test.svg');
const elements = doc.querySelectorAll('[data-gate="13"]');

// Test 3: Map attributes
const mapper = new AttributeMapper();
const attrs = mapper.mapGateAttributes(13);
console.log(attrs);
// { 'data-gate': '13', 'data-binary': '101111', 'data-quarter': 'Initiation', ... }
```

---

## Questions for Discussion

1. **Test file:** Should we create a minimal test SVG for Phase 1, or wait for real templates in Phase 2?
   - Suggestion: Create a tiny test SVG with just a few elements

2. **Export structure:** How should visualization expose its API?
   ```javascript
   // Option A: Named exports
   const { SVGGeometry, AttributeMapper } = require('./visualization');

   // Option B: Single object
   const viz = require('./visualization');
   viz.geometry.getRadialPosition(13, 4);

   // Option C: Factory functions
   const { createGeometry, createMapper } = require('./visualization');
   ```
   - Suggestion: Option A (matches existing pattern)

3. **Caching:** The V2Adapter had optional caching. Keep it?
   - Suggestion: Yes, it showed 25x speedup (0.15ms → 0.006ms)

---

## Ready to Begin

Phase 1 is well-defined enough to start. The approach is:
1. Copy one file at a time
2. Adapt imports
3. Write tests
4. Verify it works
5. Move to next file

Any issues that arise will be at the boundaries (API differences, binary conventions) - we handle those as they come up.
