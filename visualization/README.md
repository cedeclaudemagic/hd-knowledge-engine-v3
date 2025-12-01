# HD Wheel Visualization System

This directory contains the complete SVG generation system for the Human Design wheel visualization. All ring generators are **docked to the V3 knowledge engine**, producing accurate visualizations from first principles.

## Architecture Overview

```
V3 Knowledge Engine (unified-query-engine.js)
        │
        ├── Positioning Algorithm (core/root-system/positioning-algorithm.js)
        │   └── Returns: angle, binary, codon, trigrams, quarter, face
        │
        ├── Knowledge Mappings (knowledge-systems/*)
        │   └── Returns: I Ching names, Gate names, Gene Keys, etc.
        │
        └── Gate Sequence (core/root-system/gate-sequence.json)
            └── Returns: 64 gates in wheel order
                    │
                    ▼
        ┌─────────────────────────────┐
        │   Shared Constants          │
        │   (generators/shared-constants.js)
        │   • POSITION_OFFSET         │
        │   • calculateSVGAngle()     │
        │   • calculateRotation()     │
        │   • calculatePosition()     │
        │   • TEXT_RATIOS             │
        │   • generateStructure()     │
        └─────────────────────────────┘
                    │
        ┌───────────┼───────────┬───────────┬───────────┬───────────┬───────────┐
        ▼           ▼           ▼           ▼           ▼           ▼           ▼
   Hexagram    Numbers    I Ching     Gate       Gene Keys  Incarnation (Future
     Ring       Ring      Names      Names        Ring       Crosses     Rings)
                          Ring       Ring                     Ring
```

## Working Ring Generators

| Ring | File | Source Data | Tests | Description |
|------|------|-------------|-------|-------------|
| **Hexagrams** | `hexagram-ring.js` | Binary from positioning | ✓ | 64 hexagram symbols (yin/yang lines) |
| **Gate Numbers** | `numbers-ring.js` | Gate sequence | ✓ | 1-64 gate numbers |
| **I Ching Names** | `iching-names-ring.js` | `ichingName` | 44 | Traditional I Ching hexagram names |
| **Gate Names** | `gate-names-ring.js` | `mandalaGateName` | 28 | HD mandala gate names |
| **Gene Keys** | `gene-keys-ring.js` | `geneKeys` (shadow/gift/siddhi) | 37 | 3-ring Gene Keys spectrum |
| **Incarnation Crosses** | `incarnation-crosses-ring.js` | `crosses-display-mappings.json` | 35 | 192 crosses (JX/RAX/LAX) with 256 tick mark dividers |
| **Channels** | `channels-ring.js` | `channels-mappings.json` | 38 | 36 channels × 2 = 72 entries with radial/tangential text |
| **384 Lines** | `lines-ring.js` | `hd-traditional-gates` | - | 64 gates × 6 lines with keynotes, planets, yin/yang markers |

## Key Principles

### 1. First Principles, Not Copied Transforms

All positioning and rotation is calculated from first principles:

```javascript
// Single formula works for ALL 64 gates
const POSITION_OFFSET = 323.4375;
const svgAngle = -v3Angle - 90 + POSITION_OFFSET;
const rotation = svgAngle + 90;
```

**No per-quadrant adjustments. No hardcoded positions.**

### 2. Proportional Text Scaling

Text-based rings use a scaling system derived from master SVG analysis:

```javascript
const scaleFactor = RING.bandWidth / MASTER_BAND_WIDTH;
const fontSize = 19.0 * scaleFactor;  // Scales with ring size
```

This ensures text fits correctly if ring dimensions change.

### 3. Separation of Data and Display

- **Source data** comes from V3 engine unchanged
- **Display formatting** (line splitting, abbreviations) documented in generator
- `data-*` attributes preserve original values for programmatic access

Example:
```html
<text data-gate="30" data-gate-name="The Gate of the Recognition of Feelings">
  <!-- Displays as: Recognition | of | Feelings (shortened for space) -->
</text>
```

## Directory Structure

```
visualization/
├── README.md                    # This file
├── generators/
│   ├── shared-constants.js      # Common formulas and ratios
│   ├── hexagram-ring.js         # Hexagram symbols
│   ├── numbers-ring.js          # Gate numbers
│   ├── iching-names-ring.js     # I Ching names
│   ├── gate-names-ring.js       # HD gate names
│   ├── gene-keys-ring.js        # Gene Keys (shadow/gift/siddhi)
│   ├── incarnation-crosses-ring.js  # 192 incarnation crosses
│   ├── channels-ring.js         # 36 channels (72 entries)
│   └── lines-ring.js            # 384 lines (64 gates × 6 lines)
├── output/
│   └── generated-*.svg          # Generated SVG files
├── core/                        # Core utilities (legacy)
├── ring-analyzer.js             # Analysis tools
└── extract-geometry.js          # Geometry extraction tools
```

## Usage

### Generate a Single Ring

```bash
# Generate hexagram ring
node visualization/generators/hexagram-ring.js output.svg

# Generate I Ching names ring
node visualization/generators/iching-names-ring.js output.svg

# Generate gate names ring
node visualization/generators/gate-names-ring.js output.svg

# Generate Gene Keys ring (3 concentric bands)
node visualization/generators/gene-keys-ring.js output.svg

# Generate Incarnation Crosses ring (192 crosses in 3 bands)
node visualization/generators/incarnation-crosses-ring.js output.svg

# Generate Channels ring (36 channels × 2 = 72 entries)
node visualization/generators/channels-ring.js output.svg

# Generate 384 Lines ring (64 gates × 6 lines)
node visualization/generators/lines-ring.js output.svg
```

### Programmatic Usage

```javascript
const generator = require('./visualization/generators/iching-names-ring.js');

// Generate with options
const svg = generator.generateIChingNamesRing({
  includeStructure: true,    // Include ring circles and dividers
  includeBackground: true,   // Include background rectangle
  stroke: '#FFFFFF',         // Line/text color
  fill: '#FFFFFF',
  backgroundColor: '#151E25'
});
```

### Run Tests

```bash
# I Ching names ring tests (44 tests)
node tests/iching-names-ring-generator.test.js

# Gate names ring tests (28 tests)
node tests/gate-names-ring-generator.test.js

# Gene Keys ring tests (37 tests)
node tests/gene-keys-ring-generator.test.js

# Incarnation Crosses ring tests (30 tests)
node tests/incarnation-crosses-ring-generator.test.js

# Channels ring tests (38 tests)
node tests/channels-ring-generator.test.js
```

## Ring Geometry Reference

All ring generators extract geometry from verified master SVGs.

### I Ching Names Ring
```javascript
const RING = {
  center: { x: 1335.2162, y: 1335.2162 },
  innerRadius: 1259.3041,
  outerRadius: 1334.9662,
  bandWidth: 75.66  // px
};
```

### Gate Names Ring (Outer)
```javascript
const RING = {
  center: { x: 1538.3667, y: 1538.3667 },
  innerRadius: 1457.367,
  outerRadius: 1538.0506,
  bandWidth: 80.68  // px
};
```

### Hexagram Ring
```javascript
const RING = {
  center: { x: 1451.344, y: 1451.344 },
  innerRadius: 1334.4257,
  outerRadius: 1451.094,
  bandWidth: 116.67  // px
};
```

### Gene Keys Ring (3 concentric bands)
```javascript
const CENTER = { x: 1985.3602, y: 1985.3602 };
const RINGS = {
  shadows: { innerRadius: 1730.5472, outerRadius: 1782.4786 },
  gifts:   { innerRadius: 1784.2557, outerRadius: 1835.9456 },
  siddhis: { innerRadius: 1837.7815, outerRadius: 1889.9038 }
};
```

### Incarnation Crosses Ring (3 text bands, 192 crosses)
```javascript
const CENTER = { x: 2269.7216, y: 2269.9519 };
const RING_RADII = {
  bottom: 2000.1011,      // Inner boundary
  lowerInner: 2086.5709,  // Between RAX and JX
  upperInner: 2177.8085,  // Between JX and LAX
  top: 2266.954           // Outer boundary
};
// Bands: RAX (inner), JX (middle), LAX (outer)
```

### Channels Ring (5 text bands, 72 entries)
```javascript
const CENTER = { x: 6482.5278, y: 6486.1582 };
const RING_RADII = {
  inner: 4504.9828,       // Inner ring (structure)
  outer: 4826.9585,       // Outer ring (structure)
  bottomOuter: 6159.3379, // Outer band inner edge
  bottom: 6481.1808       // Outermost boundary
};
const BANDS = {
  innerCentre: { radius: 4892 },     // e.g., "G", "Sacral"
  channelName: { radius: 5700 },     // e.g., "Perfected Form"
  energyType: { radius: 6068 },      // e.g., "Projected"
  outerCentre: { radius: 6105 },     // e.g., "Spleen"
  outerGateNumber: { radius: 6197 }  // e.g., "57"
};
// Text rotation: radial (outward) for names, tangential for centres/numbers
```

### 384 Lines Ring (5 bands, 384 entries)
```javascript
const CENTER = { x: 6536, y: 6534.53 };
const RING = {
  innerRadius: 5135.73,
  outerRadius: 6537,
  bandWidth: 1401.27
};
const BAND_RADII = {
  yinYang: 5379,        // Yin/Yang line markers (solid/broken)
  detriment: 5478,      // Detriment planet symbols
  lineNumber: 5502,     // Line numbers (1-6)
  exalted: 5618,        // Exalted planet symbols
  keynote: 5658         // Line keynotes
};
// Line order: 6 (CCW edge) to 1 (CW edge) within each gate
// Displays OUTER gates (harmonics) at inner gate positions
// Integration gates show middle channel's outer gate
```

## Text Fitting System

The `TEXT_RATIOS` in `shared-constants.js` define proportional relationships:

```javascript
const TEXT_RATIOS = {
  fontSizeToBandWidth: 0.2511,      // Font scales with band width
  lineHeightToBandWidth: 0.2064,    // Line spacing scales too
  verticalScale: 1.2,               // Constant vertical stretch
  charWidthToFontSize: 0.7,         // For character count estimation
  longWordMultipliers: {
    13: 0.792,  // 13+ char words get smaller font
    12: 0.875,
    11: 0.916
  }
};
```

## Knowledge Systems Used

| System | Field | Example |
|--------|-------|---------|
| `iching-names` | `ichingName` | "The Creative" |
| `hd-mandala-gate-names` | `mandalaGateName` | "The Gate of Self Expression" |
| `hd-gates` | `keyword` | "Self-Expression" |
| `gene-keys` | `shadow`, `gift`, `siddhi` | "Entropy", "Freshness", "Beauty" |
| `channels` | `name`, `keynote`, `channelType`, `circuit` | "Perfected Form", "For Survival", "Projected" |
| `hd-traditional-gates` | `lineKeynote`, `polarity`, `exaltation`, `detriment` | "Quality", "YANG", "Sun", "Pluto" |

## Adding New Rings

1. **Extract geometry** from master SVG (center, radii, band width)
2. **Copy template** from existing ring generator
3. **Update RING constants** with new geometry
4. **Implement content generator** (symbols, text, etc.)
5. **Add tests** verifying all 64 gates
6. **Document** any display formatting choices

See `docs/reference/SVG-GENERATION-METHODOLOGY.md` for detailed methodology.

## Related Documentation

- `docs/reference/SVG-GENERATION-METHODOLOGY.md` - First principles approach
- `docs/reference/CRITICAL-ORIENTATION.md` - Line order and binary conventions
- `knowledge-systems/*/` - Source data for each knowledge layer

---

*Last updated: 1 December 2025*
*Status: 8 rings working (182+ tests), docked to V3 engine*
