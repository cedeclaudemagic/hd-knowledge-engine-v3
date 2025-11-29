/**
 * Attribute Mapper - Visualization Core
 *
 * Maps V3 knowledge data to SVG data-* attributes.
 * Integrates V3Adapter, SVGGeometry, and SVGDocument.
 *
 * @version 1.0.0 (adapted for V3)
 */

const V3Adapter = require('./v3-adapter.js');
const SVGGeometry = require('./svg-geometry.js');
const schema = require('./attribute-schema.js');

/**
 * AttributeMapper - Maps V3 knowledge to SVG attributes
 */
class AttributeMapper {
  /**
   * Create AttributeMapper instance
   * @param {Object} options - Configuration options
   * @param {boolean} options.includeKnowledge - Include verbose knowledge attributes (default: false)
   * @param {boolean} options.includeSVGPositions - Include SVG x/y coordinates (default: false)
   * @param {V3Adapter} options.v3Adapter - V3 adapter instance (optional)
   * @param {SVGGeometry} options.svgGeometry - SVG geometry instance (optional)
   */
  constructor(options = {}) {
    this.options = {
      includeKnowledge: options.includeKnowledge || false,
      includeSVGPositions: options.includeSVGPositions || false
    };

    // Initialize dependencies
    this.v3 = options.v3Adapter || new V3Adapter({ enableCache: true });
    this.geometry = options.svgGeometry || new SVGGeometry();
  }

  // =========================================================================
  // Core Mapping Methods
  // =========================================================================

  /**
   * Map gate-level attributes from V3 knowledge
   * @param {number} gateNumber - Gate number (1-64)
   * @returns {Object} Attribute object with data-* keys
   */
  mapGateAttributes(gateNumber) {
    // Get V3 knowledge and docking data
    const knowledge = this.v3.getGateKnowledge(gateNumber, null);
    const docking = this.v3.getDockingData(gateNumber, 1);

    const attributes = {
      // Identity
      'data-gate': gateNumber,
      'data-binary': docking.binary || knowledge.binary,
      'data-codon': docking.codon || knowledge.codon,

      // Groupings
      'data-quarter': docking.quarter || knowledge.quarter,
      'data-face': docking.face || knowledge.face,
      'data-trigram-upper': docking.trigrams?.upper || knowledge.trigrams?.upper || '',
      'data-trigram-lower': docking.trigrams?.lower || knowledge.trigrams?.lower || '',
      'data-opposite-gate': docking.oppositeGate || knowledge.oppositeGate || 0,

      // Structural
      'data-center': knowledge.center || '',

      // Positional
      'data-wheel-index': docking.wheelIndex,
      'data-angle': docking.angle
    };

    // Add optional knowledge attributes if requested
    if (this.options.includeKnowledge) {
      attributes['data-gene-key-gift'] = knowledge.geneKeys?.gift || '';
      attributes['data-iching-name'] = knowledge.ichingName?.ichingName || '';
      attributes['data-hd-keyword'] = knowledge.humanDesign?.keyword || '';
    }

    // Add SVG positions if requested
    if (this.options.includeSVGPositions) {
      const position = this.geometry.getRadialPosition(gateNumber, 1);
      attributes['data-svg-x'] = position.x;
      attributes['data-svg-y'] = position.y;
      attributes['data-radius'] = position.radius;
    }

    return attributes;
  }

  /**
   * Map line-level attributes from V3 knowledge
   * Includes gate attributes via inheritance
   * @param {number} gateNumber - Gate number (1-64)
   * @param {number} lineNumber - Line number (1-6)
   * @returns {Object} Attribute object with data-* keys
   */
  mapLineAttributes(gateNumber, lineNumber) {
    // Get gate attributes (inheritance)
    const gateAttributes = this.mapGateAttributes(gateNumber);

    // Get line-specific knowledge
    const knowledge = this.v3.getGateKnowledge(gateNumber, lineNumber);
    const docking = this.v3.getDockingData(gateNumber, lineNumber);

    // Calculate polarity from binary
    const polarity = this.calculatePolarity(docking.binary, lineNumber);

    const lineAttributes = {
      ...gateAttributes,

      // Line identity
      'data-line': lineNumber,
      'data-line-index': docking.linePosition || ((docking.wheelIndex * 6) + (lineNumber - 1)),
      'data-polarity': polarity,
      'data-inherited': 'true'
    };

    // Add line-specific knowledge if requested
    if (this.options.includeKnowledge) {
      lineAttributes['data-keynote'] = knowledge.lineKnowledge?.lineKeynote || '';
      lineAttributes['data-exaltation'] = knowledge.lineKnowledge?.exaltation || '';
      lineAttributes['data-detriment'] = knowledge.lineKnowledge?.detriment || '';
    }

    // Update SVG positions for specific line if requested
    if (this.options.includeSVGPositions) {
      const position = this.geometry.getRadialPosition(gateNumber, lineNumber);
      lineAttributes['data-svg-x'] = position.x;
      lineAttributes['data-svg-y'] = position.y;
      lineAttributes['data-radius'] = position.radius;
    }

    return lineAttributes;
  }

  /**
   * Map docking data only (mathematical foundation)
   * @param {number} gateNumber - Gate number (1-64)
   * @param {number} lineNumber - Line number (1-6, default: 1)
   * @returns {Object} Attribute object with foundational data only
   */
  mapDockingData(gateNumber, lineNumber = 1) {
    const docking = this.v3.getDockingData(gateNumber, lineNumber);

    return {
      'data-gate': gateNumber,
      'data-line': lineNumber,
      'data-binary': docking.binary,
      'data-codon': docking.codon,
      'data-quarter': docking.quarter,
      'data-face': docking.face,
      'data-wheel-index': docking.wheelIndex,
      'data-line-index': docking.linePosition || ((docking.wheelIndex * 6) + (lineNumber - 1)),
      'data-angle': docking.angle,
      'data-polarity': this.calculatePolarity(docking.binary, lineNumber)
    };
  }

  // =========================================================================
  // Utility Methods
  // =========================================================================

  /**
   * Calculate line polarity from binary pattern
   * Binary string is stored bottom-to-top: Line N → binary[N-1]
   * @param {string} binary - Binary string (e.g., "101111")
   * @param {number} lineNumber - Line number (1-6)
   * @returns {string} "YANG" or "YIN"
   */
  calculatePolarity(binary, lineNumber) {
    if (!binary || binary.length !== 6) {
      throw new Error(`Invalid binary: ${binary} (must be 6 digits)`);
    }
    if (lineNumber < 1 || lineNumber > 6) {
      throw new Error(`Invalid line number: ${lineNumber} (must be 1-6)`);
    }

    // Direct mapping: Line 1 = binary[0], Line 2 = binary[1], ..., Line 6 = binary[5]
    const bitIndex = lineNumber - 1;
    const bit = binary[bitIndex];

    return bit === '1' ? 'YANG' : 'YIN';
  }

  /**
   * Format attribute name (ensure data- prefix, convert camelCase to kebab-case)
   * @param {string} name - Attribute name
   * @returns {string} Formatted name with data- prefix
   */
  formatAttributeName(name) {
    // Remove data- prefix if present
    let formatted = name.startsWith('data-') ? name.substring(5) : name;

    // Convert camelCase to kebab-case
    formatted = formatted.replace(/([A-Z])/g, '-$1').toLowerCase();

    // Add data- prefix
    return `data-${formatted}`;
  }

  /**
   * Validate attribute object
   * @param {Object} attributes - Attribute object to validate
   * @param {string} context - Context: 'gate' or 'line'
   * @returns {Object} { valid: boolean, errors: Array<string> }
   */
  validateAttributes(attributes, context = 'gate') {
    const errors = [];
    const requiredAttrs = context === 'gate'
      ? schema.getRequiredGateAttributes()
      : [...schema.getRequiredGateAttributes(), ...schema.getRequiredLineAttributes()];

    // Check required attributes
    requiredAttrs.forEach(attr => {
      if (!(attr in attributes)) {
        errors.push(`Missing required attribute: ${attr}`);
      }
    });

    // Check types
    Object.entries(attributes).forEach(([key, value]) => {
      const expectedType = schema.getAttributeType(key);
      if (expectedType) {
        const actualType = typeof value;
        if (expectedType === 'number' && actualType !== 'number') {
          errors.push(`Invalid type for ${key}: expected number, got ${actualType}`);
        } else if (expectedType === 'string' && actualType !== 'string') {
          errors.push(`Invalid type for ${key}: expected string, got ${actualType}`);
        } else if (expectedType === 'boolean' && actualType !== 'string') {
          // Boolean stored as string in attributes
          if (value !== 'true' && value !== 'false') {
            errors.push(`Invalid boolean value for ${key}: ${value}`);
          }
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Filter attributes to include only specified list
   * @param {Object} attributes - Attribute object
   * @param {Array<string>} includeList - List of attribute names to include
   * @returns {Object} Filtered attribute object
   */
  filterAttributes(attributes, includeList) {
    const filtered = {};
    includeList.forEach(attr => {
      if (attr in attributes) {
        filtered[attr] = attributes[attr];
      }
    });
    return filtered;
  }

  // =========================================================================
  // Batch Processing Methods
  // =========================================================================

  /**
   * Map attributes for all 64 gates
   * @returns {Array<Object>} Array of 64 gate attribute objects
   */
  mapAllGates() {
    const allGates = [];
    for (let gate = 1; gate <= 64; gate++) {
      allGates.push(this.mapGateAttributes(gate));
    }
    return allGates;
  }

  /**
   * Map attributes for all 384 lines
   * @returns {Array<Object>} Array of 384 line attribute objects
   */
  mapAllLines() {
    const allLines = [];
    for (let gate = 1; gate <= 64; gate++) {
      for (let line = 1; line <= 6; line++) {
        allLines.push(this.mapLineAttributes(gate, line));
      }
    }
    return allLines;
  }

  // =========================================================================
  // Application Methods (SVGDocument integration)
  // =========================================================================

  /**
   * Apply attributes to SVG element
   * @param {Element} element - SVG element
   * @param {SVGDocument} svgDocument - SVGDocument instance
   * @param {number} gateNumber - Gate number (1-64)
   * @param {number|null} lineNumber - Line number (1-6, null for gate-level)
   * @returns {Element} Element (for chaining)
   */
  applyToElement(element, svgDocument, gateNumber, lineNumber = null) {
    if (!element) {
      throw new Error('Element required');
    }
    if (!svgDocument) {
      throw new Error('SVGDocument required');
    }

    // Map appropriate attributes
    const attributes = lineNumber !== null
      ? this.mapLineAttributes(gateNumber, lineNumber)
      : this.mapGateAttributes(gateNumber);

    // Apply to element
    svgDocument.setDataAttributes(element, attributes);

    return element;
  }

  /**
   * Apply attributes to gate group and all its line elements
   * @param {Element} gateGroupElement - Gate group element
   * @param {SVGDocument} svgDocument - SVGDocument instance
   * @param {number} gateNumber - Gate number (1-64)
   * @returns {number} Number of elements processed
   */
  applyToGateGroup(gateGroupElement, svgDocument, gateNumber) {
    if (!gateGroupElement) {
      throw new Error('Gate group element required');
    }
    if (!svgDocument) {
      throw new Error('SVGDocument required');
    }

    let processedCount = 0;

    // Apply gate attributes to group
    this.applyToElement(gateGroupElement, svgDocument, gateNumber, null);
    processedCount++;

    // Find and process all line elements
    const lineElements = svgDocument.findLineElements(gateGroupElement);
    lineElements.forEach((lineElement, index) => {
      const lineNumber = index + 1;
      this.applyToElement(lineElement, svgDocument, gateNumber, lineNumber);
      processedCount++;
    });

    return processedCount;
  }
}

// Export
module.exports = AttributeMapper;
module.exports.default = AttributeMapper;
