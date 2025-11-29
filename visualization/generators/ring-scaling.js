/**
 * Ring Scaling Module
 *
 * Unified proportional scaling system for all HD wheel ring generators.
 * Ensures consistent scaling behavior when rings are resized or repositioned.
 *
 * ARCHITECTURE:
 * - Each ring defines BASE_GEOMETRY (immutable reference from master SVG)
 * - Each ring defines SCALE_RATIOS (proportions relative to band width)
 * - This module provides calculateScaledGeometry() to compute actual values
 * - All radii, fonts, and element sizes scale proportionally with band width
 *
 * USAGE:
 * ```javascript
 * const scaling = require('./ring-scaling');
 *
 * // Define your ring's base geometry and ratios
 * const config = {
 *   baseGeometry: {
 *     center: { x: 1122.0567, y: 1130.6034 },
 *     innerRadius: 858.2697,
 *     outerRadius: 1084.3718
 *   },
 *   scaleRatios: {
 *     radii: {
 *       textRadius: { from: 'inner', offset: 0.5 },  // 50% into band
 *       dotsRadius: { from: 'inner', offset: 0.11 }  // 11% above inner
 *     },
 *     fonts: {
 *       primary: 0.107,    // 10.7% of band width
 *       secondary: 0.086   // 8.6% of band width
 *     },
 *     elements: {
 *       dotRadius: 0.037   // 3.7% of band width
 *     }
 *   },
 *   scaleFactor: 1.0  // 1.0 = master size, 0.5 = half size
 * };
 *
 * const scaled = scaling.calculateScaledGeometry(config);
 * // scaled.radii.textRadius, scaled.fonts.primary, etc.
 * ```
 */

/**
 * Calculate scaled geometry from base geometry and ratios
 *
 * @param {Object} config - Configuration object
 * @param {Object} config.baseGeometry - Reference geometry from master SVG
 * @param {Object} config.baseGeometry.center - { x, y } center point
 * @param {number} config.baseGeometry.innerRadius - Inner boundary radius
 * @param {number} config.baseGeometry.outerRadius - Outer boundary radius
 * @param {Object} config.scaleRatios - Ratios relative to band width
 * @param {Object} config.scaleRatios.radii - Radius offset ratios
 * @param {Object} config.scaleRatios.fonts - Font size ratios
 * @param {Object} config.scaleRatios.elements - Element size ratios
 * @param {number} [config.scaleFactor=1.0] - Overall scale multiplier
 * @param {Object} [config.centerOverride] - Override center position { x, y }
 *
 * @returns {Object} Scaled geometry with all computed values
 */
function calculateScaledGeometry(config) {
  const { baseGeometry, scaleRatios, scaleFactor = 1.0, centerOverride } = config;

  // Apply scale factor to base dimensions
  const innerRadius = baseGeometry.innerRadius * scaleFactor;
  const outerRadius = baseGeometry.outerRadius * scaleFactor;
  const bandWidth = outerRadius - innerRadius;
  const midPoint = (innerRadius + outerRadius) / 2;

  // Use override center or scale the base center
  const center = centerOverride || {
    x: baseGeometry.center.x * scaleFactor,
    y: baseGeometry.center.y * scaleFactor
  };

  // Calculate scaled radii
  const radii = {};
  if (scaleRatios.radii) {
    for (const [name, ratio] of Object.entries(scaleRatios.radii)) {
      if (typeof ratio === 'number') {
        // Simple ratio: offset from midPoint
        radii[name] = midPoint + (bandWidth * ratio);
      } else if (ratio.from === 'inner') {
        // Offset from inner radius
        radii[name] = innerRadius + (bandWidth * ratio.offset);
      } else if (ratio.from === 'outer') {
        // Offset from outer radius (typically negative offset = inward)
        radii[name] = outerRadius + (bandWidth * ratio.offset);
      } else if (ratio.from === 'mid') {
        // Offset from midpoint
        radii[name] = midPoint + (bandWidth * ratio.offset);
      }
    }
  }

  // Calculate scaled fonts
  const fonts = {};
  if (scaleRatios.fonts) {
    for (const [name, ratio] of Object.entries(scaleRatios.fonts)) {
      fonts[name] = bandWidth * ratio;
    }
  }

  // Calculate scaled elements
  const elements = {};
  if (scaleRatios.elements) {
    for (const [name, ratio] of Object.entries(scaleRatios.elements)) {
      elements[name] = bandWidth * ratio;
    }
  }

  // Calculate line heights (typically tied to font sizes)
  const lineHeights = {};
  if (scaleRatios.lineHeights) {
    for (const [name, ratio] of Object.entries(scaleRatios.lineHeights)) {
      lineHeights[name] = bandWidth * ratio;
    }
  }

  return {
    // Core geometry
    center,
    innerRadius,
    outerRadius,
    bandWidth,
    midPoint,

    // Scaled values
    radii,
    fonts,
    elements,
    lineHeights,

    // Metadata
    scaleFactor,
    baseGeometry
  };
}

/**
 * Calculate scaled geometry for multi-band rings (like Gene Keys or Incarnation Crosses)
 *
 * @param {Object} config - Configuration object
 * @param {Object} config.baseGeometry - Reference geometry
 * @param {Object} config.baseGeometry.center - { x, y } center point
 * @param {Object} config.baseGeometry.bands - { bandName: { inner, outer }, ... }
 * @param {Object} config.scaleRatios - Ratios for each band
 * @param {number} [config.scaleFactor=1.0] - Overall scale multiplier
 *
 * @returns {Object} Scaled geometry with per-band values
 */
function calculateMultiBandGeometry(config) {
  const { baseGeometry, scaleRatios, scaleFactor = 1.0, centerOverride } = config;

  const center = centerOverride || {
    x: baseGeometry.center.x * scaleFactor,
    y: baseGeometry.center.y * scaleFactor
  };

  const bands = {};

  for (const [bandName, bandGeometry] of Object.entries(baseGeometry.bands)) {
    const innerRadius = bandGeometry.inner * scaleFactor;
    const outerRadius = bandGeometry.outer * scaleFactor;
    const bandWidth = outerRadius - innerRadius;
    const midPoint = (innerRadius + outerRadius) / 2;

    const bandRatios = scaleRatios.bands?.[bandName] || {};

    // Calculate text position within band
    let textRadius = midPoint;
    if (bandRatios.textPositionRatio !== undefined) {
      textRadius = innerRadius + (bandWidth * bandRatios.textPositionRatio);
    }

    // Calculate font size for this band
    let fontSize = bandWidth * (scaleRatios.fonts?.default || 0.25);
    if (bandRatios.fontRatio !== undefined) {
      fontSize = bandWidth * bandRatios.fontRatio;
    }

    bands[bandName] = {
      innerRadius,
      outerRadius,
      bandWidth,
      midPoint,
      textRadius,
      fontSize,
      lineHeight: fontSize * (bandRatios.lineHeightRatio || 0.9)
    };
  }

  return {
    center,
    bands,
    scaleFactor,
    baseGeometry
  };
}

/**
 * Extract scale ratios from existing absolute values
 * Useful for migrating old generators to the ratio-based system
 *
 * @param {Object} geometry - Current geometry with absolute values
 * @param {number} geometry.innerRadius
 * @param {number} geometry.outerRadius
 * @param {Object} geometry.absoluteValues - { name: absoluteValue, ... }
 * @param {string} [reference='mid'] - Reference point: 'inner', 'outer', or 'mid'
 *
 * @returns {Object} Calculated ratios
 */
function extractRatios(geometry, reference = 'mid') {
  const { innerRadius, outerRadius, absoluteValues } = geometry;
  const bandWidth = outerRadius - innerRadius;
  const midPoint = (innerRadius + outerRadius) / 2;

  const ratios = {};

  for (const [name, value] of Object.entries(absoluteValues)) {
    let offset;
    switch (reference) {
      case 'inner':
        offset = (value - innerRadius) / bandWidth;
        ratios[name] = { from: 'inner', offset: parseFloat(offset.toFixed(4)) };
        break;
      case 'outer':
        offset = (value - outerRadius) / bandWidth;
        ratios[name] = { from: 'outer', offset: parseFloat(offset.toFixed(4)) };
        break;
      case 'mid':
      default:
        offset = (value - midPoint) / bandWidth;
        ratios[name] = parseFloat(offset.toFixed(4));
        break;
    }
  }

  return ratios;
}

/**
 * Extract font ratios from absolute font sizes
 *
 * @param {number} bandWidth - The band width
 * @param {Object} fonts - { name: absoluteSize, ... }
 *
 * @returns {Object} Font ratios
 */
function extractFontRatios(bandWidth, fonts) {
  const ratios = {};
  for (const [name, size] of Object.entries(fonts)) {
    ratios[name] = parseFloat((size / bandWidth).toFixed(4));
  }
  return ratios;
}

/**
 * Verify that scaled geometry maintains expected ratios
 * Useful for testing scaling implementations
 *
 * @param {Object} scaled - Scaled geometry from calculateScaledGeometry
 * @param {Object} expectedRatios - Expected ratios to verify
 * @param {number} [tolerance=0.001] - Acceptable deviation
 *
 * @returns {Object} Verification result { valid: boolean, errors: [] }
 */
function verifyRatios(scaled, expectedRatios, tolerance = 0.001) {
  const errors = [];
  const { bandWidth, innerRadius, outerRadius, midPoint, radii, fonts, elements } = scaled;

  // Verify radii ratios
  if (expectedRatios.radii && radii) {
    for (const [name, expected] of Object.entries(expectedRatios.radii)) {
      const actual = radii[name];
      if (actual === undefined) {
        errors.push(`Missing radius: ${name}`);
        continue;
      }

      let expectedValue;
      if (typeof expected === 'number') {
        expectedValue = midPoint + (bandWidth * expected);
      } else if (expected.from === 'inner') {
        expectedValue = innerRadius + (bandWidth * expected.offset);
      } else if (expected.from === 'outer') {
        expectedValue = outerRadius + (bandWidth * expected.offset);
      } else {
        expectedValue = midPoint + (bandWidth * expected.offset);
      }

      if (Math.abs(actual - expectedValue) > tolerance) {
        errors.push(`Radius ${name}: expected ${expectedValue.toFixed(4)}, got ${actual.toFixed(4)}`);
      }
    }
  }

  // Verify font ratios
  if (expectedRatios.fonts && fonts) {
    for (const [name, expectedRatio] of Object.entries(expectedRatios.fonts)) {
      const actual = fonts[name];
      const expected = bandWidth * expectedRatio;
      if (actual === undefined) {
        errors.push(`Missing font: ${name}`);
        continue;
      }
      if (Math.abs(actual - expected) > tolerance) {
        errors.push(`Font ${name}: expected ${expected.toFixed(4)}, got ${actual.toFixed(4)}`);
      }
    }
  }

  // Verify element ratios
  if (expectedRatios.elements && elements) {
    for (const [name, expectedRatio] of Object.entries(expectedRatios.elements)) {
      const actual = elements[name];
      const expected = bandWidth * expectedRatio;
      if (actual === undefined) {
        errors.push(`Missing element: ${name}`);
        continue;
      }
      if (Math.abs(actual - expected) > tolerance) {
        errors.push(`Element ${name}: expected ${expected.toFixed(4)}, got ${actual.toFixed(4)}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Standard ratio presets for common ring types
 * These can be used as starting points for new generators
 */
const PRESETS = {
  // Text ring with single band (like numbers, names)
  textRing: {
    radii: {
      textRadius: { from: 'mid', offset: 0 }  // Text at midpoint
    },
    fonts: {
      primary: 0.25,      // Standard font = 25% of band width
      small: 0.20,        // Smaller font = 20% of band width
    },
    lineHeights: {
      primary: 0.20       // Line height = 20% of band width
    }
  },

  // Symbol ring (like hexagrams)
  symbolRing: {
    radii: {
      symbolCenter: { from: 'mid', offset: 0 }
    },
    elements: {
      symbolWidth: 0.35,   // Symbol width = 35% of band width
      lineHeight: 0.04     // Line thickness = 4% of band width
    }
  },

  // Complex ring with multiple text layers (like codon rings)
  complexRing: {
    radii: {
      innerText: { from: 'inner', offset: -0.02 },   // Just below inner
      dots: { from: 'inner', offset: 0.11 },         // Above inner
      midText: { from: 'mid', offset: -0.13 },       // Below midpoint
      outerText: { from: 'outer', offset: 0.05 }     // Above outer
    },
    fonts: {
      inner: 0.107,
      mid: 0.086,
      outer: 0.071
    },
    elements: {
      dotRadius: 0.037
    }
  }
};

module.exports = {
  calculateScaledGeometry,
  calculateMultiBandGeometry,
  extractRatios,
  extractFontRatios,
  verifyRatios,
  PRESETS
};
