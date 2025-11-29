/**
 * SVG Document - Visualization Core
 *
 * SVG file loading, parsing, and manipulation utilities using JSDOM.
 * Provides jQuery-like interface for querying and modifying SVG documents.
 *
 * @version 1.0.0 (adapted for V3)
 */

const fs = require('fs');
const { JSDOM } = require('jsdom');

/**
 * SVGDocument - Wrapper around JSDOM for SVG manipulation
 */
class SVGDocument {
  /**
   * Create SVGDocument instance
   * @param {string} svgContent - Optional SVG content string
   */
  constructor(svgContent = null) {
    this.dom = null;
    this.document = null;
    this.svgElement = null;

    if (svgContent) {
      this._parse(svgContent);
    }
  }

  /**
   * Parse SVG content string with JSDOM
   * @private
   * @param {string} svgContent - SVG content string
   */
  _parse(svgContent) {
    try {
      // Create JSDOM instance with SVG content
      this.dom = new JSDOM(svgContent, {
        contentType: 'image/svg+xml'
      });

      this.document = this.dom.window.document;
      this.svgElement = this.document.querySelector('svg');

      if (!this.svgElement) {
        throw new Error('No <svg> element found in document');
      }
    } catch (error) {
      throw new Error(`Failed to parse SVG: ${error.message}`);
    }
  }

  /**
   * Load SVG from file
   * @static
   * @param {string} filePath - Path to SVG file
   * @returns {SVGDocument} New SVGDocument instance
   */
  static loadFromFile(filePath) {
    try {
      const svgContent = fs.readFileSync(filePath, 'utf8');
      return SVGDocument.loadFromString(svgContent);
    } catch (error) {
      throw new Error(`Failed to load SVG file: ${error.message}`);
    }
  }

  /**
   * Load SVG from string
   * @static
   * @param {string} svgString - SVG content string
   * @returns {SVGDocument} New SVGDocument instance
   */
  static loadFromString(svgString) {
    const doc = new SVGDocument();
    doc._parse(svgString);
    return doc;
  }

  /**
   * Serialize SVG DOM to string
   * @returns {string} SVG content as string
   */
  serialize() {
    if (!this.svgElement) {
      throw new Error('No SVG document loaded');
    }
    return this.svgElement.outerHTML;
  }

  /**
   * Get root SVG element
   * @returns {Element} SVG root element
   */
  getRoot() {
    if (!this.svgElement) {
      throw new Error('No SVG document loaded');
    }
    return this.svgElement;
  }

  /**
   * Save SVG to file
   * @param {string} filePath - Path to save file
   */
  saveToFile(filePath) {
    try {
      const svgContent = this.serialize();
      fs.writeFileSync(filePath, svgContent, 'utf8');
    } catch (error) {
      throw new Error(`Failed to save SVG file: ${error.message}`);
    }
  }

  // =========================================================================
  // Query Methods (jQuery-like)
  // =========================================================================

  /**
   * Query single element
   * @param {string} selector - CSS selector
   * @returns {Element|null} Element or null
   */
  querySelector(selector) {
    if (!this.document) {
      throw new Error('No SVG document loaded');
    }
    return this.document.querySelector(selector);
  }

  /**
   * Query multiple elements
   * @param {string} selector - CSS selector
   * @returns {Array<Element>} Array of elements
   */
  querySelectorAll(selector) {
    if (!this.document) {
      throw new Error('No SVG document loaded');
    }
    const nodeList = this.document.querySelectorAll(selector);
    return Array.from(nodeList);
  }

  /**
   * Get element by ID
   * @param {string} id - Element ID
   * @returns {Element|null} Element or null
   */
  getElementById(id) {
    if (!this.document) {
      throw new Error('No SVG document loaded');
    }
    return this.document.getElementById(id);
  }

  /**
   * Find elements with IDs matching pattern
   * @param {string} pattern - Pattern to match in ID (substring match)
   * @returns {Array<Element>} Array of matching elements
   */
  getElementsByPattern(pattern) {
    if (!this.document) {
      throw new Error('No SVG document loaded');
    }

    const allElements = this.querySelectorAll('[id]');
    return allElements.filter(el => {
      const id = el.getAttribute('id');
      return id && id.includes(pattern);
    });
  }

  /**
   * Find all gate group elements
   * Pattern: id starting with "GROUP_-_GATE-"
   * @returns {Array<Element>} Array of gate group elements
   */
  findGateGroups() {
    if (!this.document) {
      throw new Error('No SVG document loaded');
    }

    const allElements = this.querySelectorAll('[id]');
    return allElements.filter(el => {
      const id = el.getAttribute('id');
      return id && id.startsWith('GROUP_-_GATE-');
    });
  }

  /**
   * Find all line elements within a gate group
   * Pattern: id containing "." (indicating gate.line format)
   * @param {Element} gateGroup - Gate group element
   * @returns {Array<Element>} Array of line elements
   */
  findLineElements(gateGroup) {
    if (!gateGroup) {
      throw new Error('Gate group element required');
    }

    // Find all elements with ids containing "." within this group
    const allElements = gateGroup.querySelectorAll('[id]');
    return Array.from(allElements).filter(el => {
      const id = el.getAttribute('id');
      return id && id.includes('.');
    });
  }

  /**
   * Find gate element by gate number
   * @param {number} gateNumber - Gate number 1-64
   * @returns {Element|null} Gate group element or null
   */
  findGateElement(gateNumber) {
    if (!this.document) {
      throw new Error('No SVG document loaded');
    }

    // Try common ID patterns for gate groups
    const patterns = [
      `GROUP_-_GATE-${gateNumber}`,  // Standard pattern
      `gate-${gateNumber}`,          // Simple pattern (used in tests)
      `GATE-${gateNumber}`           // Alternative pattern
    ];

    for (const pattern of patterns) {
      const element = this.getElementById(pattern);
      if (element) {
        return element;
      }
    }

    return null;
  }

  /**
   * Find line element by gate and line number
   * @param {number} gateNumber - Gate number 1-64
   * @param {number} lineNumber - Line number 1-6
   * @returns {Element|null} Line element or null
   */
  findLineElement(gateNumber, lineNumber) {
    if (!this.document) {
      throw new Error('No SVG document loaded');
    }

    // Try common ID patterns for lines
    const patterns = [
      `GATE-${gateNumber}.${lineNumber}`,      // Standard pattern
      `gate-${gateNumber}-line-${lineNumber}`, // Simple pattern (used in tests)
      `LINE-${gateNumber}.${lineNumber}`       // Alternative pattern
    ];

    for (const pattern of patterns) {
      const element = this.getElementById(pattern);
      if (element) {
        return element;
      }
    }

    return null;
  }

  // =========================================================================
  // Element Manipulation Methods
  // =========================================================================

  /**
   * Set single data-* attribute
   * @param {Element} element - Target element
   * @param {string} name - Attribute name (without 'data-' prefix)
   * @param {*} value - Attribute value
   */
  setDataAttribute(element, name, value) {
    if (!element) {
      throw new Error('Element required');
    }
    if (!name) {
      throw new Error('Attribute name required');
    }

    // Ensure attribute name has 'data-' prefix
    const attrName = name.startsWith('data-') ? name : `data-${name}`;
    element.setAttribute(attrName, String(value));
  }

  /**
   * Set multiple data-* attributes
   * @param {Element} element - Target element
   * @param {Object} attributes - Object with attribute name-value pairs
   * @example
   * setDataAttributes(element, { gate: 13, line: 4, polarity: 'YANG' })
   */
  setDataAttributes(element, attributes) {
    if (!element) {
      throw new Error('Element required');
    }
    if (!attributes || typeof attributes !== 'object') {
      throw new Error('Attributes object required');
    }

    for (const [name, value] of Object.entries(attributes)) {
      this.setDataAttribute(element, name, value);
    }
  }

  /**
   * Get single data-* attribute value
   * @param {Element} element - Target element
   * @param {string} name - Attribute name (without 'data-' prefix)
   * @returns {string|null} Attribute value or null
   */
  getDataAttribute(element, name) {
    if (!element) {
      throw new Error('Element required');
    }
    if (!name) {
      throw new Error('Attribute name required');
    }

    const attrName = name.startsWith('data-') ? name : `data-${name}`;
    return element.getAttribute(attrName);
  }

  /**
   * Get all data-* attributes from element
   * @param {Element} element - Target element
   * @returns {Object} Object with all data-* attributes (without 'data-' prefix)
   */
  getDataAttributes(element) {
    if (!element) {
      throw new Error('Element required');
    }

    const dataAttrs = {};
    const attributes = element.attributes;

    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      if (attr.name.startsWith('data-')) {
        const name = attr.name.substring(5); // Remove 'data-' prefix
        dataAttrs[name] = attr.value;
      }
    }

    return dataAttrs;
  }

  /**
   * Remove single data-* attribute
   * @param {Element} element - Target element
   * @param {string} name - Attribute name (without 'data-' prefix)
   */
  removeDataAttribute(element, name) {
    if (!element) {
      throw new Error('Element required');
    }
    if (!name) {
      throw new Error('Attribute name required');
    }

    const attrName = name.startsWith('data-') ? name : `data-${name}`;
    element.removeAttribute(attrName);
  }

  /**
   * Remove all data-* attributes from element
   * @param {Element} element - Target element
   */
  removeAllDataAttributes(element) {
    if (!element) {
      throw new Error('Element required');
    }

    const attributes = Array.from(element.attributes);
    attributes.forEach(attr => {
      if (attr.name.startsWith('data-')) {
        element.removeAttribute(attr.name);
      }
    });
  }

  // =========================================================================
  // Element Inspection Methods
  // =========================================================================

  /**
   * Get element's id attribute
   * @param {Element} element - Target element
   * @returns {string|null} Element ID or null
   */
  getElementId(element) {
    if (!element) {
      throw new Error('Element required');
    }
    return element.getAttribute('id');
  }

  /**
   * Get element's tag name
   * @param {Element} element - Target element
   * @returns {string} Tag name (e.g., "g", "path", "circle")
   */
  getElementType(element) {
    if (!element) {
      throw new Error('Element required');
    }
    return element.tagName.toLowerCase();
  }

  /**
   * Check if element has any data-* attributes
   * @param {Element} element - Target element
   * @returns {boolean} True if element has data-* attributes
   */
  hasDataAttributes(element) {
    if (!element) {
      throw new Error('Element required');
    }

    const attributes = element.attributes;
    for (let i = 0; i < attributes.length; i++) {
      if (attributes[i].name.startsWith('data-')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Count elements matching selector
   * @param {string} selector - CSS selector
   * @returns {number} Number of matching elements
   */
  countElements(selector) {
    return this.querySelectorAll(selector).length;
  }

  // =========================================================================
  // Validation Methods
  // =========================================================================

  /**
   * Check if document is valid SVG
   * @returns {boolean} True if valid SVG document
   */
  isValidSVG() {
    return this.document !== null && this.svgElement !== null;
  }

  /**
   * Check if SVG has expected gate group structure
   * @returns {boolean} True if gate groups found
   */
  hasGateStructure() {
    if (!this.isValidSVG()) {
      return false;
    }

    const gateGroups = this.findGateGroups();
    return gateGroups.length > 0;
  }

  /**
   * Get document statistics
   * @returns {Object} Statistics object
   */
  getDocumentStatistics() {
    if (!this.isValidSVG()) {
      return {
        totalElements: 0,
        totalGateGroups: 0,
        totalLineElements: 0,
        elementsWithDataAttributes: 0
      };
    }

    const allElements = this.querySelectorAll('*');
    const gateGroups = this.findGateGroups();

    // Count line elements across all gate groups
    let totalLineElements = 0;
    gateGroups.forEach(group => {
      const lines = this.findLineElements(group);
      totalLineElements += lines.length;
    });

    // Count elements with data attributes
    let elementsWithDataAttributes = 0;
    allElements.forEach(el => {
      if (this.hasDataAttributes(el)) {
        elementsWithDataAttributes++;
      }
    });

    return {
      totalElements: allElements.length,
      totalGateGroups: gateGroups.length,
      totalLineElements,
      elementsWithDataAttributes
    };
  }
}

// Export
module.exports = SVGDocument;
module.exports.default = SVGDocument;
