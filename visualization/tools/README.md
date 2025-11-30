# Visualization Tools

Interactive web-based tools for composing and previewing HD wheel visualizations.

## Ring Composer UI

**File:** `ring-composer-ui.html`

An interactive interface for composing multiple ring SVGs into a unified wheel visualization.

### Key Principle: SVG Auto-Scaling

The ring composer uses **SVG's native scaling capabilities** rather than regenerating ring content at different sizes. This is crucial because:

1. **Preserves Quality** - Each ring generator has been carefully tuned with:
   - Precise font sizing and text fitting
   - Adaptive word wrapping for long names
   - Special case handling for complex layouts
   - Proportional element positioning

2. **SVG is Vector** - Scaling is mathematically lossless. A ring scaled to 50% looks identical to one generated at 50%, but without losing the fine-tuning work.

3. **Separation of Concerns**:
   - **Generators** handle content creation (text, symbols, structure)
   - **Composer** handles layout (positioning, scaling, ordering)

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  Ring Generators (existing)                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Numbers  │ │Hexagrams │ │ Codons   │ │Gene Keys │ ...   │
│  │Generator │ │Generator │ │Generator │ │Generator │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       │            │            │            │              │
│       ▼            ▼            ▼            ▼              │
│  ┌──────────────────────────────────────────────────┐      │
│  │              Generated SVG Files                  │      │
│  │  (Full quality, original proportions)            │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Ring Composer (this tool)                                  │
│  ┌──────────────────────────────────────────────────┐      │
│  │  1. Load generated SVGs                           │      │
│  │  2. Apply SVG transforms (scale + translate)     │      │
│  │  3. Stack rings using snap system                │      │
│  │  4. Export composed wheel                        │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### The Snap System

Each ring has two sets of bounds:

- **Geometric bounds** - The main ring band (inner/outer radius)
- **Visual bounds** - The actual visual extent including:
  - Decorative circles
  - Text that extends beyond the band
  - Markers, dots, labels

The snap system uses **visual bounds** to ensure rings don't overlap:

```
Ring A visual outer ──┐
                      │ gap (configurable)
Ring B visual inner ──┘
```

### Usage

1. **Start the server:**
   ```bash
   node visualization/tools/serve.js
   ```

2. **Open in browser:**
   ```
   http://localhost:8080/tools/ring-composer-ui.html
   ```

3. **Compose your wheel:**
   - Drag rings to reorder (inside ↔ outside)
   - Adjust scale per ring (20% - 200%)
   - Set gaps between rings
   - Toggle between Actual SVG and Schematic views

4. **Export:**
   - Click "Export SVG" to download the composed wheel
   - Click "Copy Config" to get code for `ring-assembler.js`

### Controls

| Control | Description |
|---------|-------------|
| **Start Radius** | Inner edge of the innermost ring |
| **Default Gap** | Spacing between rings (visual edges) |
| **Ring Scale** | Individual ring scaling (affects all proportions uniformly) |
| **Gap After** | Per-ring gap override |
| **Move In/Out** | Reorder rings |
| **View Toggle** | Switch between actual SVG and schematic preview |

### Available Rings

| Ring | Generator | Notes |
|------|-----------|-------|
| Numbers | `numbers-ring.js` | 64 gate numbers |
| Hexagrams | `hexagram-ring.js` | 64 I Ching hexagram symbols |
| Codon Rings | `codon-rings-ring.js` | 22 amino acid groupings |
| Gene Keys | `gene-keys-ring.js` | 3-band (shadow/gift/siddhi) |
| I Ching Names | `iching-names-ring.js` | Traditional hexagram names |
| Gate Names | `gate-names-ring.js` | HD mandala gate names |

---

## Server Script

**File:** `serve.js`

Simple Node.js static file server for local development.

```bash
# Default port 8080
node serve.js

# Custom port
node serve.js 3000
```

The server is required because browsers block `fetch()` requests from `file://` URLs (CORS restriction).

---

## Architecture Notes

### Why Not Regenerate at Different Sizes?

Early attempts tried to recalculate all proportions when scaling rings. This approach failed because:

1. **Cumulative Errors** - Small rounding differences compound across 64 gates
2. **Lost Fine-Tuning** - Special cases (long words, interlaced rings) need per-gate adjustments
3. **Complexity** - Each generator would need a parallel "scaled generation" mode

### The Transform Approach

Instead, we apply SVG transforms to the already-perfect output:

```xml
<g id="numbers-ring" transform="translate(X, Y) scale(S)">
  <!-- Full generated content from numbers-ring.js -->
</g>
```

This is:
- **Mathematically Correct** - SVG transforms are precise
- **Visually Identical** - No quality loss at any scale
- **Simple** - One transform per ring, calculated from geometry

### Visual Bounds Calculation

Each ring defines how far its visual elements extend beyond the geometric band:

```javascript
// Simple ring (numbers, hexagrams)
visualInner: innerRadius - 2   // Structure stroke width
visualOuter: outerRadius + 2

// Complex ring (codon rings)
visualInner: innerRadius - (bandWidth * 0.0885)  // Inner decorative ring
visualOuter: outerRadius + (bandWidth * 0.1062)  // Outer decorative ring
```

These ratios are derived from the master SVGs and ensure pixel-perfect snapping.
