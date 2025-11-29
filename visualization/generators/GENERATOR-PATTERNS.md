# Ring Generator Patterns

Common patterns extracted from building the hexagram and numbers ring generators.

## Core Principles

### 1. First Principles Over Copying
- Extract **geometry only** from master SVGs (radii, dimensions, font sizes)
- Generate **transforms from formulas**, not copied values
- Single formula works for ALL 64 gates - no quadrant-specific adjustments

### 2. The Universal Translation Chain

```
V3 Knowledge Engine          →    SVG Ring Output
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gate Number (1-64)           →    Element ID + data attributes
V3 Angle (0°-360°, clockwise)→    SVG position (x, y)
                             →    Element rotation
```

### 3. The Two Core Formulas

**Position (V3 → SVG):**
```javascript
const POSITION_OFFSET = 323.4375;  // Wheel alignment constant
const svgAngle = -v3Angle - 90 + POSITION_OFFSET;
const radians = svgAngle * Math.PI / 180;
const x = center.x + radius * Math.cos(radians);
const y = center.y + radius * Math.sin(radians);
```

**Rotation (for radial/tangent alignment):**
```javascript
const rotation = svgAngle + 90;
```

This single rotation formula works for:
- **Hexagrams:** Line 1 points toward center (radial)
- **Numbers:** Text reads tangent to circle (readable)
- **Any radially-aligned element**

---

## Standard Structure

Every ring generator should produce:

```xml
<svg xmlns="http://www.w3.org/2000/svg" ...>
  <rect id="background" fill="#151E25"/>      <!-- Dark background -->
  <g id="STRUCTURE">
    <g id="RINGS">
      <circle id="RING_-_INNER" .../>         <!-- Inner boundary -->
      <circle id="RING_-_OUTER" .../>         <!-- Outer boundary -->
    </g>
    <g id="DIVIDERS">
      <line id="LINE_-_gateA_gateB" .../>     <!-- 64 divider lines -->
      ...
    </g>
  </g>
  <g id="CONTENT">                            <!-- Ring-specific content -->
    <!-- Gate elements here -->
  </g>
</svg>
```

---

## Standard Color Scheme

```javascript
const COLORS = {
  background: '#151E25',   // Canvas background (dark blue-grey)
  foreground: '#FFFFFF',   // All visible elements (white)
  highlight: '#fab414'     // Accent color (gold) - for highlights
};
```

**Rules:**
- Background: Always `#151E25`
- Strokes: Always `#FFFFFF`
- Fills: Always `#FFFFFF` (or `none` for structural circles)
- Text: `fill="#FFFFFF"` with `stroke="none"`

---

## Divider Line Generation

Dividers sit at the midpoint angle between adjacent gates:

```javascript
function generateDividerLine(gateA, gateB) {
  const angleA = positioning.getDockingData(gateA, 1).angle;
  const angleB = positioning.getDockingData(gateB, 1).angle;

  // Handle wraparound
  let midAngle;
  if (Math.abs(angleB - angleA) > 180) {
    midAngle = ((angleA + angleB + 360) / 2) % 360;
  } else {
    midAngle = (angleA + angleB) / 2;
  }

  const svgAngle = calculateSVGAngle(midAngle);
  // ... calculate line endpoints at inner and outer radius
}
```

---

## Ring-Specific Geometry

Each ring has its own measurements extracted from verified masters:

| Ring | Center | Inner R | Outer R | Band Width |
|------|--------|---------|---------|------------|
| Hexagrams | 1451.344, 1451.344 | 1334.4257 | 1451.094 | 116.67 |
| Numbers | 1657.7978, 1657.4867 | 1538.587 | 1648.5514 | 109.96 |

**Note:** Different rings have different dimensions. When compositing, align by center point.

---

## Text Element Pattern

For text rings (numbers, codons, etc.):

```xml
<text
   data-gate="41"
   transform="translate(x y) rotate(angle)"
   font-size="..."
   font-family="..."
   text-anchor="middle"
   dominant-baseline="central"
   stroke="none"
   style="isolation: isolate">41</text>
```

---

## Symbol Element Pattern

For symbol rings (hexagrams, trigrams):

```xml
<g id="gate-41"
   data-gate="41"
   data-binary="..."
   data-codon="..."
   transform="translate(x, y) rotate(angle) translate(offsetX, offsetY)">
  <!-- Symbol sub-elements -->
</g>
```

The triple transform:
1. `translate(x, y)` - move to position on ring
2. `rotate(angle)` - rotate for radial alignment
3. `translate(offsetX, offsetY)` - center the symbol on the position

---

## Testing Pattern

Every generator should have tests for:

1. **Geometry constants** - match verified master
2. **Position calculation** - valid coordinates, unique positions
3. **Rotation calculation** - consistent formula across all gates
4. **SVG output** - valid structure, all 64 gates present
5. **Consistency** - same formulas as other ring generators

---

## Adding a New Ring Generator

1. Extract geometry from verified master SVG
2. Use shared COLORS and POSITION_OFFSET
3. Use standard `calculateSVGAngle()` and `calculateRotation()`
4. Include STRUCTURE group with RINGS and DIVIDERS
5. Add ring-specific content group
6. Write tests following the pattern
7. Update this document with new ring specs

---

*Created: 29 November 2025*
*Based on: hexagram-ring.js and numbers-ring.js*
