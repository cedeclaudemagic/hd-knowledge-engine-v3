/**
 * Attribute Schema - Visualization Core
 *
 * Standard data-* attribute definitions for HD SVG elements.
 * Defines gate-level, line-level, and SVG-specific attributes.
 *
 * @version 1.0.0 (adapted for V3)
 */

/**
 * Gate-level attributes
 * Applied to gate group elements (e.g., <g id="GROUP_-_GATE-13">)
 */
const GATE_ATTRIBUTES = {
  // ===== Identity =====
  'data-gate': {
    type: 'number',
    description: 'Gate number (1-64)',
    required: true
  },
  'data-binary': {
    type: 'string',
    description: 'Binary pattern (e.g., "101111")',
    required: true
  },
  'data-codon': {
    type: 'string',
    description: 'Genetic codon (e.g., "CAA")',
    required: true
  },

  // ===== Groupings (Calculated) =====
  'data-quarter': {
    type: 'string',
    description: 'Quarter name (Mutation, Initiation, Duality, Civilisation)',
    required: true
  },
  'data-face': {
    type: 'string',
    description: 'Mythological face (e.g., Hades, Kali, Prometheus)',
    required: true
  },
  'data-trigram-upper': {
    type: 'string',
    description: 'Upper trigram (e.g., Heaven, Earth)',
    required: true
  },
  'data-trigram-lower': {
    type: 'string',
    description: 'Lower trigram (e.g., Heaven, Earth)',
    required: true
  },
  'data-opposite-gate': {
    type: 'number',
    description: 'Opposite gate number (1-64)',
    required: true
  },

  // ===== Structural =====
  'data-center': {
    type: 'string',
    description: 'Bodygraph center (e.g., G, Sacral, Solar Plexus)',
    required: true
  },

  // ===== Positional =====
  'data-wheel-index': {
    type: 'number',
    description: 'Wheel position index (0-63)',
    required: true
  },
  'data-angle': {
    type: 'number',
    description: 'Wheel angle in degrees (0-360)',
    required: true
  },

  // ===== Knowledge (Optional - can be verbose) =====
  'data-gene-key-gift': {
    type: 'string',
    description: 'Gene Key Gift',
    required: false
  },
  'data-iching-name': {
    type: 'string',
    description: 'I Ching hexagram name',
    required: false
  },
  'data-hd-keyword': {
    type: 'string',
    description: 'Human Design keyword',
    required: false
  }
};

/**
 * Line-level attributes
 * Applied to line elements (e.g., <circle id="GATE-13.4">)
 * Inherits all GATE_ATTRIBUTES, plus line-specific attributes
 */
const LINE_ATTRIBUTES = {
  // ===== Line Identity =====
  'data-line': {
    type: 'number',
    description: 'Line number (1-6)',
    required: true
  },
  'data-line-index': {
    type: 'number',
    description: 'Absolute line position on wheel (0-383)',
    required: true
  },
  'data-polarity': {
    type: 'string',
    description: 'Line polarity (YANG or YIN)',
    required: true
  },
  'data-inherited': {
    type: 'boolean',
    description: 'Whether gate attributes were inherited',
    required: false
  },

  // ===== Line Knowledge (Optional) =====
  'data-keynote': {
    type: 'string',
    description: 'Line keynote (e.g., Fatigue, Empathy)',
    required: false
  },
  'data-exaltation': {
    type: 'string',
    description: 'Exalted planet (e.g., Venus, Mars)',
    required: false
  },
  'data-detriment': {
    type: 'string',
    description: 'Detrimental planet',
    required: false
  }
};

/**
 * SVG-specific attributes
 * Geometric positioning data from SVGGeometry
 */
const SVG_ATTRIBUTES = {
  'data-svg-x': {
    type: 'number',
    description: 'SVG X coordinate',
    required: false
  },
  'data-svg-y': {
    type: 'number',
    description: 'SVG Y coordinate',
    required: false
  },
  'data-radius': {
    type: 'number',
    description: 'Radius from center',
    required: false
  }
};

/**
 * Get all attribute definitions
 * @returns {Object} All attribute schemas
 */
function getAllAttributes() {
  return {
    gate: GATE_ATTRIBUTES,
    line: LINE_ATTRIBUTES,
    svg: SVG_ATTRIBUTES
  };
}

/**
 * Get required gate attributes (names only)
 * @returns {Array<string>} Array of required attribute names
 */
function getRequiredGateAttributes() {
  return Object.keys(GATE_ATTRIBUTES).filter(key => GATE_ATTRIBUTES[key].required);
}

/**
 * Get required line attributes (names only)
 * @returns {Array<string>} Array of required attribute names
 */
function getRequiredLineAttributes() {
  return Object.keys(LINE_ATTRIBUTES).filter(key => LINE_ATTRIBUTES[key].required);
}

/**
 * Get optional knowledge attributes
 * @returns {Array<string>} Array of optional knowledge attribute names
 */
function getKnowledgeAttributes() {
  const gateKnowledge = Object.keys(GATE_ATTRIBUTES).filter(
    key => !GATE_ATTRIBUTES[key].required
  );
  const lineKnowledge = Object.keys(LINE_ATTRIBUTES).filter(
    key => !LINE_ATTRIBUTES[key].required && key !== 'data-inherited'
  );
  return [...gateKnowledge, ...lineKnowledge];
}

/**
 * Get attribute type
 * @param {string} attributeName - Attribute name (e.g., 'data-gate')
 * @returns {string|null} Type (number, string, boolean) or null if not found
 */
function getAttributeType(attributeName) {
  if (GATE_ATTRIBUTES[attributeName]) {
    return GATE_ATTRIBUTES[attributeName].type;
  }
  if (LINE_ATTRIBUTES[attributeName]) {
    return LINE_ATTRIBUTES[attributeName].type;
  }
  if (SVG_ATTRIBUTES[attributeName]) {
    return SVG_ATTRIBUTES[attributeName].type;
  }
  return null;
}

/**
 * Check if attribute is required
 * @param {string} attributeName - Attribute name
 * @param {string} context - Context: 'gate' or 'line'
 * @returns {boolean} True if required
 */
function isAttributeRequired(attributeName, context = 'gate') {
  if (context === 'gate') {
    return GATE_ATTRIBUTES[attributeName]?.required || false;
  } else if (context === 'line') {
    return (
      LINE_ATTRIBUTES[attributeName]?.required ||
      GATE_ATTRIBUTES[attributeName]?.required ||
      false
    );
  }
  return false;
}

// Export
module.exports = {
  GATE_ATTRIBUTES,
  LINE_ATTRIBUTES,
  SVG_ATTRIBUTES,
  getAllAttributes,
  getRequiredGateAttributes,
  getRequiredLineAttributes,
  getKnowledgeAttributes,
  getAttributeType,
  isAttributeRequired
};
module.exports.default = module.exports;
