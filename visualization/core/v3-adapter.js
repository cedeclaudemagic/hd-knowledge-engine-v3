/**
 * V3 Adapter - Visualization Layer Bridge
 *
 * Clean wrapper around HD Knowledge Engine V3.
 * All visualization components use this adapter (not import V3 directly).
 *
 * Provides:
 * - Error handling
 * - Input validation
 * - Consistent interface
 * - Optional caching
 *
 * @version 1.0.0
 */

// Import V3 knowledge engine
const positioning = require('../../core/root-system/positioning-algorithm.js');
const engine = require('../../unified-query-engine.js');

/**
 * V3Adapter - Wrapper around V3 knowledge engine
 */
class V3Adapter {
  constructor(options = {}) {
    this.options = {
      enableCache: options.enableCache || false,
      logErrors: options.logErrors !== false, // default true
      ...options
    };

    // Simple cache (optional)
    this.cache = {
      gateKnowledge: new Map(),
      dockingData: new Map()
    };
  }

  /**
   * Validate gate number (1-64)
   * @param {number} gate - Gate number
   * @throws {Error} If invalid
   */
  validateGateNumber(gate) {
    const gateNum = Number(gate);
    if (!Number.isInteger(gateNum) || gateNum < 1 || gateNum > 64) {
      throw new Error(`Invalid gate number: ${gate} (must be integer 1-64)`);
    }
    return gateNum;
  }

  /**
   * Validate line number (1-6)
   * @param {number} line - Line number
   * @throws {Error} If invalid
   */
  validateLineNumber(line) {
    if (line === null || line === undefined) {
      return null;
    }
    const lineNum = Number(line);
    if (!Number.isInteger(lineNum) || lineNum < 1 || lineNum > 6) {
      throw new Error(`Invalid line number: ${line} (must be integer 1-6 or null)`);
    }
    return lineNum;
  }

  /**
   * Get complete unified knowledge for a gate/line
   * @param {number} gateNumber - Gate 1-64
   * @param {number|null} lineNumber - Line 1-6, or null for gate-level only
   * @returns {Object} Complete knowledge from all 11 systems
   */
  getGateKnowledge(gateNumber, lineNumber = null) {
    try {
      // Validate inputs
      const gate = this.validateGateNumber(gateNumber);
      const line = this.validateLineNumber(lineNumber);

      // Check cache
      const cacheKey = `${gate}-${line}`;
      if (this.options.enableCache && this.cache.gateKnowledge.has(cacheKey)) {
        return this.cache.gateKnowledge.get(cacheKey);
      }

      // Query V3
      const knowledge = engine.getGateKnowledge(gate, line);

      // Cache result
      if (this.options.enableCache) {
        this.cache.gateKnowledge.set(cacheKey, knowledge);
      }

      return knowledge;
    } catch (error) {
      if (this.options.logErrors) {
        console.error(`Error in getGateKnowledge(${gateNumber}, ${lineNumber}):`, error.message);
      }
      throw error;
    }
  }

  /**
   * Get mathematical foundation data (positioning, binary, etc.)
   * Essential for SVG coordinate mapping
   * @param {number} gateNumber - Gate 1-64
   * @param {number} lineNumber - Line 1-6 (default: 1)
   * @returns {Object} Mathematical foundation
   */
  getDockingData(gateNumber, lineNumber = 1) {
    try {
      // Validate inputs
      const gate = this.validateGateNumber(gateNumber);
      const line = this.validateLineNumber(lineNumber) || 1;

      // Check cache
      const cacheKey = `${gate}-${line}`;
      if (this.options.enableCache && this.cache.dockingData.has(cacheKey)) {
        return this.cache.dockingData.get(cacheKey);
      }

      // Query V3 positioning system
      const dockingData = positioning.getDockingData(gate, line);

      // Cache result
      if (this.options.enableCache) {
        this.cache.dockingData.set(cacheKey, dockingData);
      }

      return dockingData;
    } catch (error) {
      if (this.options.logErrors) {
        console.error(`Error in getDockingData(${gateNumber}, ${lineNumber}):`, error.message);
      }
      throw error;
    }
  }

  /**
   * Get all gates in a quarter
   * @param {string} quarterName - "Mutation", "Initiation", "Duality", or "Civilisation"
   * @returns {Array<number>} Gate numbers
   */
  getGatesInQuarter(quarterName) {
    try {
      if (typeof quarterName !== 'string') {
        throw new Error(`Quarter name must be a string, got: ${typeof quarterName}`);
      }

      const validQuarters = ['Mutation', 'Initiation', 'Duality', 'Civilisation'];
      if (!validQuarters.includes(quarterName)) {
        throw new Error(`Invalid quarter name: ${quarterName}. Valid: ${validQuarters.join(', ')}`);
      }

      return engine.getGatesInQuarter(quarterName);
    } catch (error) {
      if (this.options.logErrors) {
        console.error(`Error in getGatesInQuarter(${quarterName}):`, error.message);
      }
      throw error;
    }
  }

  /**
   * Get all gates in a face
   * @param {string} faceName - Face name (e.g., "Hades", "Prometheus")
   * @returns {Array<number>} Gate numbers
   */
  getGatesInFace(faceName) {
    try {
      if (typeof faceName !== 'string') {
        throw new Error(`Face name must be a string, got: ${typeof faceName}`);
      }

      return engine.getGatesInFace(faceName);
    } catch (error) {
      if (this.options.logErrors) {
        console.error(`Error in getGatesInFace(${faceName}):`, error.message);
      }
      throw error;
    }
  }

  /**
   * Get all gates with a specific trigram (upper or lower)
   * @param {string} trigramName - Trigram name (e.g., "Heaven", "Earth")
   * @param {string} position - "upper" or "lower"
   * @returns {Array<number>} Gate numbers
   */
  getGatesWithTrigram(trigramName, position = 'upper') {
    try {
      if (typeof trigramName !== 'string') {
        throw new Error(`Trigram name must be a string, got: ${typeof trigramName}`);
      }

      if (position !== 'upper' && position !== 'lower') {
        throw new Error(`Position must be "upper" or "lower", got: ${position}`);
      }

      return engine.getGatesWithTrigram(trigramName, position);
    } catch (error) {
      if (this.options.logErrors) {
        console.error(`Error in getGatesWithTrigram(${trigramName}, ${position}):`, error.message);
      }
      throw error;
    }
  }

  /**
   * Get gates by center
   * @param {string} centerName - Center name (e.g., "G", "Sacral", "Solar Plexus")
   * @returns {Array<number>} Gate numbers
   */
  getGatesByCenter(centerName) {
    try {
      if (typeof centerName !== 'string') {
        throw new Error(`Center name must be a string, got: ${typeof centerName}`);
      }

      return engine.getGatesByCenter(centerName);
    } catch (error) {
      if (this.options.logErrors) {
        console.error(`Error in getGatesByCenter(${centerName}):`, error.message);
      }
      throw error;
    }
  }

  /**
   * Search across all knowledge systems
   * @param {string} keyword - Search term
   * @returns {Array<Object>} Search results
   */
  search(keyword) {
    try {
      if (typeof keyword !== 'string') {
        throw new Error(`Search keyword must be a string, got: ${typeof keyword}`);
      }

      if (keyword.length < 2) {
        throw new Error('Search keyword must be at least 2 characters');
      }

      return engine.search(keyword);
    } catch (error) {
      if (this.options.logErrors) {
        console.error(`Error in search(${keyword}):`, error.message);
      }
      throw error;
    }
  }

  /**
   * Clear cache (if enabled)
   */
  clearCache() {
    this.cache.gateKnowledge.clear();
    this.cache.dockingData.clear();
  }

  /**
   * Get cache statistics (if enabled)
   * @returns {Object} Cache stats
   */
  getCacheStats() {
    return {
      enabled: this.options.enableCache,
      gateKnowledgeEntries: this.cache.gateKnowledge.size,
      dockingDataEntries: this.cache.dockingData.size,
      totalEntries: this.cache.gateKnowledge.size + this.cache.dockingData.size
    };
  }

  /**
   * Get V3 version info
   * @returns {Object} Version info
   */
  getVersion() {
    try {
      const packageJson = require('../../package.json');
      return {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description
      };
    } catch (error) {
      return {
        name: 'hd-knowledge-engine-v3',
        version: 'unknown',
        description: 'Version info not available'
      };
    }
  }
}

// Export
module.exports = V3Adapter;
module.exports.default = V3Adapter;
