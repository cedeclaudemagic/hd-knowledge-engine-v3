# SVG Generation Methodology: Lessons Learned

**READ THIS DOCUMENT** before working on any wheel visualization or SVG generation tasks.

This document captures critical lessons learned during hexagram ring generation. Following these principles prevents hours of debugging and ensures consistent, correct output.

---

## The Golden Rule: First Principles Over Complexity

When generating wheel visualizations, **always start from first principles**:

1. What is the fundamental rule? (e.g., "Line 1 innermost, Line 6 outermost")
2. What does the data say? (Check existing documentation first)
3. What is the simplest formula that satisfies the rule?

**DO NOT** try to reverse-engineer complex patterns from existing SVGs. The original master SVGs may contain:
- Per-quadrant rotation hacks
- Individual transform overrides
- Legacy coordinate compensations
- Illustrator export artifacts

These complexities are **distractions**, not requirements.

---

## Critical Conventions

### I Ching Line Order

Binary strings are stored **BOTTOM to TOP**:

```
Index 0 = Line 1 (BOTTOM) - innermost on wheel
Index 1 = Line 2
Index 2 = Line 3
Index 3 = Line 4
Index 4 = Line 5
Index 5 = Line 6 (TOP) - outermost on wheel
```

**Visual Layout in Local Symbol Coordinates:**
- Line 6 at smallest y-offset (top of local symbol)
- Line 1 at largest y-offset (bottom of local symbol)

```javascript
// CORRECT: Line 1 at bottom, Line 6 at top
const yOffset = (6 - lineNumber) * lineSpacing;

// WRONG: Line 1 at top, Line 6 at bottom (inverted!)
const yOffset = (lineNumber - 1) * lineSpacing;
```

### Wheel Orientation on Screen

For the HD wheel displayed on screen:
- Line 1 (bottom of hexagram) points **toward center**
- Line 6 (top of hexagram) points **toward edge**

This is consistent across ALL 64 gates, ALL quadrants, no exceptions.

---

## The Working Formulas

### Position Calculation (V3 Angle → SVG Position)

The SVG wheel is **mirrored** (counter-clockwise) relative to V3's clockwise angles.

```javascript
const POSITION_OFFSET = 323.4375;  // Derived from divider alignment

function calculatePosition(v3Angle, radius) {
  // Negate V3 angle for mirroring, adjust for SVG coordinate system
  const svgAngle = -v3Angle - 90 + POSITION_OFFSET;
  const radians = svgAngle * Math.PI / 180;

  return {
    x: center.x + radius * Math.cos(radians),
    y: center.y + radius * Math.sin(radians)
  };
}
```

### Rotation Calculation (SVG Angle → Symbol Rotation)

The hexagram symbol's "top" (Line 6 side) must point outward, "bottom" (Line 1 side) toward center.

```javascript
function calculateRotation(svgAngle) {
  // svgAngle points from center to position
  // Add 90° so symbol's local "up" (Line 6) points outward
  return svgAngle + 90;
}
```

**Why +90°?**
- In SVG, "up" in local coordinates is -90° from the positive x-axis
- The position angle points from center to position
- We want Line 6 (local "up") to point away from center (same direction as position angle)
- Therefore: rotation = svgAngle + 90

---

## Common Errors and How to Avoid Them

### Error 1: Quadrant-Based Adjustments

**WRONG approach:** "This quadrant needs +180°, that one needs +90°..."

**Why it fails:** Creates complexity that's hard to debug. Different quadrants shouldn't need different treatment if the fundamental formula is correct.

**CORRECT approach:** Find the single formula that works for ALL positions. If some quadrants are wrong, the formula itself is wrong.

### Error 2: Not Reading Documentation First

**WRONG approach:** Try to figure out conventions from scratch.

**Why it fails:** The conventions are already documented. Guessing leads to inverted results.

**CORRECT approach:** Read CRITICAL-ORIENTATION.md BEFORE writing any code involving line order, binary interpretation, or trigram structure.

### Error 3: Copying Complex Transforms

**WRONG approach:** Copy the exact transforms from the master SVG.

**Why it fails:** The master SVG may have Illustrator-specific transforms, per-element overrides, or historical workarounds that don't translate to programmatic generation.

**CORRECT approach:** Extract only the GEOMETRY (dimensions, radii, spacing) from the master. Generate transforms from first principles.

### Error 4: Confusing Symbol Local Coords with Wheel Coords

**WRONG approach:** Thinking about line positions in wheel space.

**Why it fails:** Mixes two coordinate systems, leads to confusion.

**CORRECT approach:**
1. Build symbol in LOCAL coordinates (Line 1 at bottom, Line 6 at top)
2. Position symbol at correct wheel location
3. Rotate symbol to align radially
4. The transform handles the translation between coordinate systems

---

## Verification Process

After generating an SVG:

1. **Visual Check**: Line 1 should always be closest to center, Line 6 closest to edge
2. **Spot Check Specific Gates**:
   - Gate 1 (111111): All solid lines
   - Gate 2 (000000): All broken lines
   - Gate 3 (100010): Mixed pattern - verify each line
3. **Quadrant Consistency**: All four quadrants should look correct with the same formula
4. **Compare Against Master**: Use ring-analyzer.js to verify knowledge data matches

---

## Code Reference

### Ring Generators

| Ring | File | Tests |
|------|------|-------|
| Hexagrams | `visualization/generators/hexagram-ring.js` | ✓ |
| Numbers | `visualization/generators/numbers-ring.js` | ✓ |
| I Ching Names | `visualization/generators/iching-names-ring.js` | 44 tests |
| Gate Names | `visualization/generators/gate-names-ring.js` | 28 tests |

### Shared Infrastructure

`visualization/generators/shared-constants.js` provides:
- `POSITION_OFFSET` - aligns V3 angles to SVG wheel
- `calculateSVGAngle()` - V3 to SVG coordinate conversion
- `calculateRotation()` - single formula for all 64 gates
- `calculatePosition()` - generates x,y from V3 angle
- `TEXT_RATIOS` - proportional scaling for text fitting
- `generateStructure()` - ring circles and 64 dividers

### Text Scaling System

Text-based rings use proportional scaling:

```javascript
const scaleFactor = RING.bandWidth / MASTER_BAND_WIDTH;
const fontSize = masterFontSize * scaleFactor;
const lineHeight = masterLineHeight * scaleFactor;
```

This ensures text fits correctly when ring dimensions change.

---

## Ring Geometry (Extracted from Master)

```javascript
const RING = {
  center: { x: 1451.344, y: 1451.344 },
  innerRadius: 1334.4257,
  outerRadius: 1451.094
};

const SYMBOL = {
  lineWidth: 80.7558,     // Width of a YANG line
  lineHeight: 9.9549,     // Height/thickness of a line
  lineSpacing: 16.91,     // Vertical spacing between lines
  gapWidth: 7.34          // Gap in YIN line
};
```

---

## Summary Checklist

Before generating any wheel ring:

- [ ] Read CRITICAL-ORIENTATION.md
- [ ] Understand the fundamental rule (e.g., Line 1 innermost)
- [ ] Use first-principles formulas, not copied transforms
- [ ] Verify y-offset formula: `(6 - lineNumber) * spacing` for Line 1 at bottom
- [ ] Use single rotation formula for ALL gates (no quadrant exceptions)
- [ ] Test visually across all quadrants
- [ ] Run ring-analyzer.js to verify knowledge data

---

*Created: 29 November 2025*
*Purpose: Capture methodology for programmatic SVG generation from V3 knowledge engine*
*Based on: Hexagram ring generation debugging session*
