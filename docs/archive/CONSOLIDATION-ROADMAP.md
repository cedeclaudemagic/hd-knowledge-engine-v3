# HD Knowledge Engine V3 - Consolidation Roadmap

## Vision

A unified knowledge exploration and communication engine that enables:
- **Deep research** into Human Design through the electromagnetic lens
- **Article creation** with generated illustrations
- **Custom mandala generation** for enquiry-based orders
- **Mathematical precision** from calculation through to SVG output

---

## Current State (November 2025)

### What Works
- **Core calculation engine** - 55 tests passing, 11 knowledge systems
- **Positioning algorithm** - `getDockingData()` returns angle, binary, quarter, face, trigrams
- **Articles in progress** - Wheel Series (3 drafted), EM Consciousness Series (5 written)

### What Exists Elsewhere
- **hd-svg-visualization** - Complete docking layer (748 tests), built for V2
- **HD-Wheel-Project** - SVG templates from Illustrator, semantic analysis (stale)
- **hd-knowledge-monorepo** - Integration attempt (V2-based)

### The Gap
No bridge between the calculation engine and visual output in V3.

---

## Target Architecture

```
HD-Knowledge-Engine-V3/
│
├── core/                              # COMPLETE - Mathematical foundation
│   └── root-system/
│       ├── positioning-algorithm.js   # getDockingData()
│       ├── gate-sequence.json         # 41-start sequence
│       └── binary-identity.json       # 64 gates binary/codon
│
├── knowledge-systems/                 # COMPLETE - 11 systems
│   ├── gene-keys/
│   ├── iching-names/
│   ├── trigrams/                      # Recently fixed
│   └── ... (8 more)
│
├── visualization/                     # PHASE 1 - Bring from hd-svg-visualization
│   ├── core/
│   │   ├── svg-geometry.js            # Angle → SVG coordinates
│   │   ├── svg-document.js            # JSDOM-based manipulation
│   │   └── attribute-mapper.js        # Knowledge → data-* attributes
│   ├── templates/                     # PHASE 2 - Clean SVG masters
│   │   ├── wheel-384-lines.svg
│   │   ├── wheel-64-gates.svg
│   │   ├── wheel-8-trigrams.svg
│   │   ├── wheel-16-faces.svg
│   │   └── wheel-quarters.svg
│   └── generators/                    # PHASE 3 - Article illustration tools
│       ├── trigram-cycle.js
│       ├── gate-highlight.js
│       └── wheel-section.js
│
├── articles/                          # PHASE 4 - Generated content
│   ├── illustrations/                 # SVG outputs for articles
│   └── data/                          # Extracted data for articles
│
├── docs/                              # EXISTS - Written articles
│   ├── articles/
│   │   ├── wheel-series/
│   │   └── electromagnetic-consciousness-series/
│   └── reference/
│
├── tests/                             # EXISTS + EXTEND
│
└── unified-query-engine.js            # EXISTS - Main API
```

---

## Phased Implementation

### PHASE 1: Foundation Integration
**Goal:** Bring visualization core into V3 and verify it works

**Sessions:** 1-2

**Tasks:**
1. [x] Create `visualization/core/` directory
2. [x] Copy `svg-geometry.js` from hd-svg-visualization
3. [x] Adapt to use V3's positioning algorithm (not V2)
4. [x] Copy `svg-document.js` (JSDOM wrapper)
5. [x] Copy `attribute-mapper.js` (knowledge → attributes)
6. [x] Create `visualization/index.js` as main export
7. [x] Add jsdom to package.json dependencies
8. [x] Port relevant tests and verify passing (73 tests passing)

**Decision Points:**
- Keep the V2Adapter pattern or integrate directly with V3's unified-query-engine?
- **DECIDED:** Created `v3-adapter.js` following the adapter pattern - clean separation, easy testing

**Success Criteria:**
- Can call `geometry.getRadialPosition(13, 4)` and get correct SVG coordinates
- Can call `mapper.mapGateAttributes(13)` and get data-* attributes
- Basic test suite passing

---

### PHASE 2: SVG Templates
**Goal:** Establish clean, verified SVG master files

**Sessions:** 1-2

**Tasks:**
1. [ ] Audit existing SVG files in HD-Wheel-Project
2. [ ] Identify cleanest/most accurate versions
3. [ ] Verify element IDs match V3 naming conventions
4. [ ] Copy verified templates to `visualization/templates/`
5. [ ] Create template manifest (what each file contains)
6. [ ] Build template loader utility

**Decision Points:**
- Which SVG files are actually correct and usable?
- Do we need to regenerate any from Illustrator?
- What's the minimum set needed for article illustrations?

**Questions to Resolve:**
- The trigram binary patterns in HD-Wheel-Project's SVG IDs - do they match V3's corrected patterns?
- If not, do we fix the SVGs or create new ones?

**Success Criteria:**
- At least 5 clean SVG templates verified against V3 calculations
- Can load and query any template programmatically

---

### PHASE 3: Illustration Generators
**Goal:** Build tools that create article illustrations

**Sessions:** 2-3

**Tasks:**
1. [ ] Trigram cycle diagram generator (for EM Cycle article)
2. [ ] Gate/line highlight generator (for any article)
3. [ ] Quarter section generator (wheel segments)
4. [ ] Binary pattern visualizer (for Three Readings article)
5. [ ] Codon ring highlighter (for Chemistry of Form article)

**Each Generator Needs:**
- Input parameters (what to show/highlight)
- SVG template selection
- Modification logic (colors, visibility, labels)
- Export options (file, string, dimensions)

**Example API:**
```javascript
const { generators } = require('./visualization');

// For Article 3: The Electromagnetic Cycle
const diagram = generators.trigramCycle({
  phase: 'accumulation',           // Earth → Mountain → Water → Wind → Heaven
  highlight: ['Wind', 'Heaven'],   // Current focus
  showLabels: true,
  showBinary: true,
  style: 'print'                   // or 'web'
});

diagram.exportSVG('./articles/illustrations/em-accumulation-phase.svg');
```

**Success Criteria:**
- Can generate at least one illustration for each of the 4 Wheel Series articles
- Illustrations are mathematically accurate (positions match V3 calculations)

---

### PHASE 4: Article Integration
**Goal:** Connect generators to article workflow

**Sessions:** 1-2

**Tasks:**
1. [ ] Create article manifest (which illustrations each article needs)
2. [ ] Build CLI for generating article assets
3. [ ] Create illustration style guide (colors, fonts, dimensions)
4. [ ] Generate illustrations for existing draft articles
5. [ ] Document the workflow for future articles

**CLI Example:**
```bash
# Generate all illustrations for Wheel Series Article 3
node generate.js --article=wheel-series-03 --output=./docs/articles/wheel-series/images/

# Generate specific diagram
node generate.js --type=trigram-cycle --highlight=Thunder,Fire --output=./temp/
```

**Success Criteria:**
- Articles 1-3 of Wheel Series have generated illustrations
- Clear workflow documented for creating new articles with illustrations

---

### PHASE 5: Research Tools (Future)
**Goal:** Enable deeper pattern exploration

**Sessions:** Ongoing

**Potential Tools:**
- Amino acid distribution visualizer
- Cross-quarter pattern finder
- Trigram phase analyzer
- Channel circuit mapper
- Planetary position correlator

This phase is exploratory - build tools as research questions arise.

---

### PHASE 6: Website/Mandala Integration (Future)
**Goal:** Connect to enquiry-based mandala ordering

**Considerations:**
- Simple enquiry form (not e-commerce)
- Gallery of example variations
- Custom generation based on client conversation
- Preview/proposal generation

This is a separate project that consumes V3 as a dependency.

---

## Session Protocol

### Starting a Session

1. **Read this roadmap** - understand current phase and progress
2. **Check the phase checklist** - what's done, what's next
3. **Review any decision points** - discuss if needed
4. **Pick ONE focused task** - don't try to do everything

### During a Session

- Update the checklist as tasks complete
- Note any blockers or discoveries
- If a decision point is reached, document the choice and reasoning

### Ending a Session

1. **Update this roadmap** with progress
2. **Commit changes** with clear message
3. **Note next session focus** in the "Current Status" section below

---

## Current Status

**Phase:** PHASE 1 COMPLETE - Ready for Phase 2
**Last Updated:** 2025-11-28
**Next Session Focus:** Phase 2 - SVG Templates (audit, verify, copy)

### Phase 1 Complete!
All visualization core components integrated:
- `visualization/core/v3-adapter.js` - V3 knowledge engine wrapper
- `visualization/core/svg-geometry.js` - Angle → SVG coordinate conversion
- `visualization/core/svg-document.js` - JSDOM-based SVG manipulation
- `visualization/core/attribute-mapper.js` - Knowledge → data-* attributes
- `visualization/core/attribute-schema.js` - Attribute definitions

**Test Results:**
- `visualization-geometry.test.js` - 20 tests passing
- `visualization-document.test.js` - 28 tests passing
- `visualization-mapper.test.js` - 25 tests passing
- **Total: 73 visualization tests passing**

**Success Criteria Met:**
- ✓ `geometry.getRadialPosition(13, 4)` returns correct SVG coordinates
- ✓ `mapper.mapGateAttributes(13)` returns data-* attributes
- ✓ All 64 gates and 384 lines map correctly
- ✓ SVG documents can be loaded, modified, and serialized

### Recent Decisions
- Consolidate into V3 as single source of truth
- Archive other projects (HD-Wheel-Project, monorepo) after extraction
- Focus on article creation as primary use case
- **V3Adapter pattern adopted** - keeps clean separation between knowledge and visualization

### Open Questions
1. ~~V2Adapter pattern - keep or simplify for V3?~~ DECIDED: Keep pattern as V3Adapter
2. SVG template accuracy - need verification against V3 trigram fixes
3. Minimum viable template set - which SVGs are essential?

---

## File References

### Source Projects (for extraction)
- `/Volumes/CLAUDE/hd-svg-visualization/core/` - Docking layer to copy
- `/Volumes/CLAUDE/HD-Wheel-Project/svg-templates/` - SVG masters (need verification)

### Key V3 Files
- `core/root-system/positioning-algorithm.js` - The docking source of truth
- `unified-query-engine.js` - Main API
- `knowledge-systems/trigrams/` - Recently corrected

### Articles in Progress
- `docs/articles/wheel-series/01-breathing-wheel.md`
- `docs/articles/wheel-series/02-three-readings.md`
- `docs/articles/wheel-series/03-electromagnetic-cycle.md`

---

## Notes

### Why Single Repository?
Multiple repositories led to:
- Divergent data (different trigram binaries in different places)
- Lost context between sessions
- Unclear source of truth
- Repeated work

Single repository means:
- One source of truth for calculations
- Visualization always uses the same engine
- Articles, illustrations, and research all connected
- Easier to maintain and understand

### The "Docking" Pattern
The key insight from hd-svg-visualization is the **docking** concept:
1. Knowledge engine provides `getDockingData(gate, line)` → angle, binary, etc.
2. SVG geometry converts angle → SVG coordinates
3. Attribute mapper adds knowledge as data-* attributes
4. This creates SVG elements that carry their meaning with them

This pattern should be preserved in V3.
