/**
 * Ring Assembler
 *
 * Assembles multiple ring SVGs into a single composed wheel visualization.
 *
 * KEY PRINCIPLE: SVG AUTO-SCALING
 * ================================
 * This module uses SVG's native scaling capabilities rather than regenerating
 * ring content at different sizes. This is crucial because:
 *
 * 1. Each ring generator has been carefully tuned with precise font sizing,
 *    text fitting, adaptive word wrapping, and special case handling.
 *
 * 2. SVG scaling is mathematically lossless - a ring scaled to 50% looks
 *    identical to one generated at 50%, but without losing the fine-tuning.
 *
 * 3. Separation of concerns: generators handle content creation, the assembler
 *    handles layout (positioning, scaling, ordering).
 *
 * APPROACH:
 * 1. Generate each ring using its existing, finely-tuned generator
 * 2. Extract the ring content (the <g> groups, not the wrapper SVG)
 * 3. Apply SVG transforms to scale and position each ring
 * 4. Compose into a single SVG with unified center
 *
 * SNAP SYSTEM:
 * Each ring defines both its geometric bounds (inner/outer radius) and its
 * visual bounds (accounting for elements that extend beyond the main band).
 * The snap system uses visual bounds to ensure rings don't overlap.
 *
 * USAGE:
 * ```javascript
 * const assembler = require('./ring-assembler');
 *
 * const svg = assembler.assembleRings({
 *   center: { x: 1000, y: 1000 },
 *   startRadius: 400,
 *   padding: 0,  // gap between rings
 *   rings: ['numbers', 'hexagrams', 'codons']
 * });
 * ```
 *
 * See also: visualization/tools/ring-composer-ui.html for interactive usage
 */

const fs = require('fs');

// Import the existing generators
const numbersGenerator = require('./numbers-ring');
const hexagramGenerator = require('./hexagram-ring');
const codonsGenerator = require('./codon-rings-ring');
const shared = require('./shared-constants');

const COLORS = shared.COLORS;

/**
 * Ring geometry with VISUAL BOUNDS for snapping
 *
 * Each ring has:
 * - center: the geometric center
 * - innerRadius / outerRadius: the main band boundaries
 * - visualInner / visualOuter: the actual visual extent (for snap alignment)
 *
 * The visual bounds account for elements that extend beyond the band:
 * - Decorative circles
 * - Text that sits outside the band
 * - Dots, markers, etc.
 */
const RING_GEOMETRIES = {
  numbers: {
    center: { x: 1657.7978, y: 1657.4867 },
    innerRadius: 1538.587,
    outerRadius: 1648.5514,
    // Numbers ring is simple - visual bounds ≈ geometric bounds
    // Just a small margin for the structure circles
    get visualInner() { return this.innerRadius - 2; },
    get visualOuter() { return this.outerRadius + 2; },
    get bandWidth() { return this.outerRadius - this.innerRadius; },
    get visualWidth() { return this.visualOuter - this.visualInner; }
  },

  hexagrams: {
    center: { x: 1451.344, y: 1451.344 },
    innerRadius: 1334.4257,
    outerRadius: 1451.094,
    // Hexagram symbols are contained within the band
    // Small margin for structure circles
    get visualInner() { return this.innerRadius - 2; },
    get visualOuter() { return this.outerRadius + 2; },
    get bandWidth() { return this.outerRadius - this.innerRadius; },
    get visualWidth() { return this.visualOuter - this.visualInner; }
  },

  codons: {
    center: { x: 1122.0567, y: 1130.6034 },
    innerRadius: 858.2697,
    outerRadius: 1084.3718,
    get bandWidth() { return this.outerRadius - this.innerRadius; },
    // Codon ring has elements extending beyond the band:
    // - Inner decorative ring at innerRadius - (bandWidth * 0.0885) = ~20 units inside
    // - Outer decorative ring at outerRadius + (bandWidth * 0.1062) = ~24 units outside
    // - Codon letters at innerRadius - (bandWidth * 0.0221) = ~5 units inside
    // - Amino acid names at outerRadius + (bandWidth * 0.0531) = ~12 units outside
    get visualInner() {
      return this.innerRadius - (this.bandWidth * 0.0885); // Inner decorative ring
    },
    get visualOuter() {
      return this.outerRadius + (this.bandWidth * 0.1062); // Outer decorative ring
    },
    get visualWidth() { return this.visualOuter - this.visualInner; }
  }
};

/**
 * Generate a ring and extract just the content groups (not the SVG wrapper)
 */
function generateRingContent(ringType) {
  let svg;

  switch (ringType) {
    case 'numbers':
      svg = numbersGenerator.generateNumbersRing({
        includeBackground: false,
        includeStructure: true
      });
      break;
    case 'hexagrams':
      svg = hexagramGenerator.generateHexagramRing({
        includeBackground: false,
        includeStructure: true
      });
      break;
    case 'codons':
      svg = codonsGenerator.generateCodonRingsRing({
        includeBackground: false,
        includeStructure: true
      });
      break;
    default:
      throw new Error(`Unknown ring type: ${ringType}`);
  }

  // Extract content between <svg> and </svg> tags
  const startMatch = svg.match(/<svg[^>]*>/);
  const endIndex = svg.lastIndexOf('</svg>');

  if (startMatch && endIndex > 0) {
    const contentStart = startMatch.index + startMatch[0].length;
    return svg.substring(contentStart, endIndex).trim();
  }

  return svg;
}

/**
 * Calculate the transform needed to position a ring
 *
 * @param {Object} sourceGeom - Source ring geometry
 * @param {Object} targetGeom - Target geometry { center, scale }
 * @returns {Object} Transform parameters { translateX, translateY, scale }
 */
function calculateTransform(sourceGeom, targetGeom) {
  const scale = targetGeom.scale;

  // After scaling, the source center moves to: sourceCenter * scale
  // We need it at targetCenter, so we translate by:
  // targetCenter - (sourceCenter * scale)
  const translateX = targetGeom.center.x - (sourceGeom.center.x * scale);
  const translateY = targetGeom.center.y - (sourceGeom.center.y * scale);

  return { translateX, translateY, scale };
}

/**
 * Build SVG transform string
 */
function buildTransformString(transform) {
  return `translate(${transform.translateX.toFixed(4)}, ${transform.translateY.toFixed(4)}) scale(${transform.scale.toFixed(6)})`;
}

/**
 * SNAP SYSTEM: Calculate ring placements with proper visual alignment
 *
 * @param {Object} config - Configuration
 * @param {Object} config.center - Target center { x, y }
 * @param {number} config.startRadius - Visual inner edge of first ring
 * @param {number} config.padding - Gap between rings (visual edge to visual edge)
 * @param {Array} config.rings - Array of ring type strings ['numbers', 'hexagrams', 'codons']
 * @param {number} [config.uniformScale] - If set, all rings use this scale factor
 *
 * @returns {Array} Array of placement objects with scale and position info
 */
function calculateSnapPlacements(config) {
  const { center, startRadius, padding = 0, rings, uniformScale } = config;

  const placements = [];
  let currentVisualOuter = startRadius; // Start from inner edge

  for (let i = 0; i < rings.length; i++) {
    const ringType = rings[i];
    const sourceGeom = RING_GEOMETRIES[ringType];

    let scale;
    let targetVisualInner;
    let targetVisualOuter;
    let targetInner;
    let targetOuter;

    if (uniformScale !== undefined) {
      // All rings at same scale
      scale = uniformScale;
      targetVisualInner = sourceGeom.visualInner * scale;
      targetVisualOuter = sourceGeom.visualOuter * scale;
      targetInner = sourceGeom.innerRadius * scale;
      targetOuter = sourceGeom.outerRadius * scale;

      // Position based on visual bounds with padding
      if (i === 0) {
        // First ring: position so visual inner is at startRadius
        const offset = startRadius - targetVisualInner;
        targetVisualInner += offset;
        targetVisualOuter += offset;
        targetInner += offset;
        targetOuter += offset;
      } else {
        // Subsequent rings: snap visual inner to previous visual outer + padding
        const offset = currentVisualOuter + padding - targetVisualInner;
        targetVisualInner += offset;
        targetVisualOuter += offset;
        targetInner += offset;
        targetOuter += offset;
      }
    } else {
      // Scale each ring to fit adjacent to previous
      if (i === 0) {
        // First ring: scale so its visual inner edge is at startRadius
        scale = startRadius / sourceGeom.visualInner;
      } else {
        // Subsequent rings: scale so visual inner snaps to previous visual outer + padding
        const targetVisualInnerEdge = currentVisualOuter + padding;
        scale = targetVisualInnerEdge / sourceGeom.visualInner;
      }

      targetVisualInner = sourceGeom.visualInner * scale;
      targetVisualOuter = sourceGeom.visualOuter * scale;
      targetInner = sourceGeom.innerRadius * scale;
      targetOuter = sourceGeom.outerRadius * scale;
    }

    placements.push({
      type: ringType,
      sourceGeom,
      scale,
      center,
      // Geometric bounds (scaled)
      innerRadius: targetInner,
      outerRadius: targetOuter,
      bandWidth: targetOuter - targetInner,
      // Visual bounds (scaled) - for snapping
      visualInner: targetVisualInner,
      visualOuter: targetVisualOuter,
      visualWidth: targetVisualOuter - targetVisualInner
    });

    currentVisualOuter = targetVisualOuter;
  }

  return placements;
}

/**
 * Assemble multiple rings into a single SVG using the snap system
 *
 * @param {Object} config - Assembly configuration
 * @param {Object} config.center - Target center point { x, y }
 * @param {number} config.startRadius - Visual inner edge of first (innermost) ring
 * @param {number} [config.padding=5] - Visual gap between rings
 * @param {Array} config.rings - Array of ring types, innermost to outermost
 * @param {number} [config.uniformScale] - Optional: use same scale for all rings
 * @param {boolean} [config.includeBackground=true] - Include background rect
 */
function assembleRings(config) {
  const {
    center,
    startRadius,
    padding = 0,
    rings,
    uniformScale,
    includeBackground = true,
    backgroundColor = COLORS.background,
    stroke = COLORS.foreground
  } = config;

  // Calculate placements using snap system
  const placements = calculateSnapPlacements({
    center,
    startRadius,
    padding,
    rings,
    uniformScale
  });

  // Calculate viewBox to fit all rings
  const maxVisualRadius = placements[placements.length - 1].visualOuter;
  const viewPadding = 50;
  const viewBoxSize = (maxVisualRadius + viewPadding) * 2;

  // Calculate viewBox origin for centering
  const viewBoxOriginX = center.x - maxVisualRadius - viewPadding;
  const viewBoxOriginY = center.y - maxVisualRadius - viewPadding;

  // Build SVG with high precision for Illustrator compatibility
  // Using .toFixed(4) instead of .toFixed(0) prevents sub-pixel drift
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${viewBoxSize.toFixed(4)}"
     height="${viewBoxSize.toFixed(4)}"
     viewBox="${viewBoxOriginX.toFixed(4)} ${viewBoxOriginY.toFixed(4)} ${viewBoxSize.toFixed(4)} ${viewBoxSize.toFixed(4)}">
  <style>
    text { fill: ${stroke}; }
    circle, line { stroke: ${stroke}; }
    #hexagrams rect { fill: ${stroke}; stroke: none; }
  </style>
`;

  if (includeBackground) {
    svg += `  <rect id="background" x="${viewBoxOriginX.toFixed(4)}" y="${viewBoxOriginY.toFixed(4)}" width="${viewBoxSize.toFixed(4)}" height="${viewBoxSize.toFixed(4)}" fill="${backgroundColor}" stroke="none"/>\n`;
  }

  // Add each ring with its transform
  for (const placement of placements) {
    const transform = calculateTransform(placement.sourceGeom, {
      center,
      scale: placement.scale
    });
    const transformStr = buildTransformString(transform);
    const content = generateRingContent(placement.type);

    svg += `  <g id="${placement.type}-ring" transform="${transformStr}">\n`;
    svg += `    ${content.split('\n').join('\n    ')}\n`;
    svg += `  </g>\n`;
  }

  svg += `</svg>`;

  return svg;
}

/**
 * Get a detailed summary of the snap placements
 */
function getSnapSummary(config) {
  const placements = calculateSnapPlacements(config);

  const lines = [
    'Ring Assembly - Snap Placement Summary',
    '═'.repeat(55),
    `Center: (${config.center.x}, ${config.center.y})`,
    `Start Radius (visual inner): ${config.startRadius}`,
    `Padding between rings: ${config.padding}`,
    '',
    'Rings (inside to outside):',
    '─'.repeat(55)
  ];

  for (let i = 0; i < placements.length; i++) {
    const p = placements[i];
    lines.push(`${(i + 1)}. ${p.type.toUpperCase()}`);
    lines.push(`   Scale factor: ${p.scale.toFixed(4)}`);
    lines.push(`   Geometric: inner=${p.innerRadius.toFixed(1)}, outer=${p.outerRadius.toFixed(1)}, band=${p.bandWidth.toFixed(1)}`);
    lines.push(`   Visual:    inner=${p.visualInner.toFixed(1)}, outer=${p.visualOuter.toFixed(1)}, width=${p.visualWidth.toFixed(1)}`);

    if (i < placements.length - 1) {
      const gap = placements[i + 1].visualInner - p.visualOuter;
      lines.push(`   Gap to next: ${gap.toFixed(1)}`);
    }
    lines.push('');
  }

  lines.push('─'.repeat(55));
  lines.push(`Total visual outer radius: ${placements[placements.length - 1].visualOuter.toFixed(1)}`);

  return lines.join('\n');
}

/**
 * Convenience: Create the standard inside-out stack
 * Numbers (innermost) → Hexagrams → Codons (outermost)
 */
function assembleStandardWheel(options = {}) {
  const {
    center = { x: 1000, y: 1000 },
    startRadius = 400,
    padding = 0,
    includeBackground = true
  } = options;

  return assembleRings({
    center,
    startRadius,
    padding,
    rings: ['numbers', 'hexagrams', 'codons'],
    includeBackground
  });
}

module.exports = {
  RING_GEOMETRIES,
  generateRingContent,
  calculateTransform,
  calculateSnapPlacements,
  assembleRings,
  assembleStandardWheel,
  getSnapSummary
};

// CLI
if (require.main === module) {
  const output = process.argv[2] || 'assembled-wheel.svg';

  console.log('Ring Assembler with Snap System\n');

  const config = {
    center: { x: 1000, y: 1000 },
    startRadius: 400,
    padding: 0,  // 0 pixel gap between rings (default)
    rings: ['numbers', 'hexagrams', 'codons']
  };

  console.log(getSnapSummary(config));
  console.log('\nGenerating SVG...');

  const svg = assembleRings({
    ...config,
    includeBackground: true
  });

  fs.writeFileSync(output, svg);
  console.log(`\nWritten to: ${output}`);
  console.log(`File size: ${(svg.length / 1024).toFixed(1)} KB`);
}
