/**
 * SVG Geometry - Visualization Core
 *
 * Mathematical utilities for converting V3 data to SVG coordinates.
 * Handles the HD wheel's circular geometry and radial positioning.
 *
 * Convention:
 * - 0° = top of wheel (12 o'clock position)
 * - Rotation is clockwise
 * - 384 lines distributed evenly around the wheel
 *
 * @version 1.0.0 (adapted for V3)
 */

const V3Adapter = require('./v3-adapter.js');

/**
 * SVGGeometry - Coordinate conversion and geometric calculations
 */
class SVGGeometry {
  constructor(options = {}) {
    // Default dimensions (can be overridden)
    this.CENTER_X = options.centerX || 512;
    this.CENTER_Y = options.centerY || 512;
    this.DEFAULT_RADIUS = options.radius || 400;

    // Constants
    this.TOTAL_LINES = 384;  // 64 gates × 6 lines
    this.TOTAL_GATES = 64;
    this.LINES_PER_GATE = 6;
    this.DEGREES_PER_LINE = 360 / this.TOTAL_LINES;  // 0.9375°

    // V3 adapter for docking data
    this.v3 = options.v3Adapter || new V3Adapter({ logErrors: false });
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees - Angle in degrees
   * @returns {number} Angle in radians
   */
  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convert radians to degrees
   * @param {number} radians - Angle in radians
   * @returns {number} Angle in degrees
   */
  radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
  }

  /**
   * Normalize angle to 0-360 range
   * @param {number} angle - Angle in degrees
   * @returns {number} Normalized angle (0-360)
   */
  normalizeAngle(angle) {
    let normalized = angle % 360;
    if (normalized < 0) {
      normalized += 360;
    }
    return normalized;
  }

  /**
   * Convert angle to SVG coordinates
   * Convention: 0° = top of wheel (12 o'clock), clockwise rotation
   *
   * @param {number} angle - Angle in degrees (from V3)
   * @param {number} radius - Distance from center (default: DEFAULT_RADIUS)
   * @param {number} centerX - Center X coordinate (default: CENTER_X)
   * @param {number} centerY - Center Y coordinate (default: CENTER_Y)
   * @returns {Object} { x, y } coordinates
   */
  angleToSVGCoordinates(angle, radius = this.DEFAULT_RADIUS, centerX = this.CENTER_X, centerY = this.CENTER_Y) {
    // Adjust angle for SVG coordinate system
    // V3 gives angles where 0° is at the start of Gate 41
    // We need to adjust so 0° = top (12 o'clock) and rotation is clockwise
    const adjustedAngle = angle - 90;  // Subtract 90° to make 0° point upward

    // Convert to radians
    const radians = this.degreesToRadians(adjustedAngle);

    // Calculate SVG coordinates
    // Note: In SVG, Y increases downward, so we add for Y
    const x = centerX + (radius * Math.cos(radians));
    const y = centerY + (radius * Math.sin(radians));

    return { x, y };
  }

  /**
   * Get radial position for a specific gate and line
   * Uses V3 docking data for angle, then converts to SVG coordinates
   *
   * @param {number} gateNumber - Gate 1-64
   * @param {number} lineNumber - Line 1-6 (default: 1)
   * @param {number} radius - Distance from center (default: DEFAULT_RADIUS)
   * @returns {Object} Position data with angle and coordinates
   */
  getRadialPosition(gateNumber, lineNumber = 1, radius = this.DEFAULT_RADIUS) {
    // Get mathematical foundation from V3
    const dockingData = this.v3.getDockingData(gateNumber, lineNumber);

    // Convert V3 angle to SVG coordinates
    const { x, y } = this.angleToSVGCoordinates(
      dockingData.angle,
      radius,
      this.CENTER_X,
      this.CENTER_Y
    );

    return {
      gate: gateNumber,
      line: lineNumber,
      angle: dockingData.angle,           // Original V3 angle
      radians: this.degreesToRadians(dockingData.angle - 90),  // Adjusted radians
      wheelIndex: dockingData.wheelIndex, // 0-63 (gate position)
      linePosition: dockingData.linePosition || ((dockingData.wheelIndex * 6) + (lineNumber - 1)), // 0-383
      x,                                   // SVG X coordinate
      y,                                   // SVG Y coordinate
      radius,                              // Radius used
      centerX: this.CENTER_X,
      centerY: this.CENTER_Y,
      // Include grouping data for convenience
      quarter: dockingData.quarter,
      face: dockingData.face,
      binary: dockingData.binary,
      codon: dockingData.codon,
      trigrams: dockingData.trigrams
    };
  }

  /**
   * Get bounding box for all 6 lines of a gate
   * Useful for highlighting gate groups
   *
   * @param {number} gateNumber - Gate 1-64
   * @param {number} radius - Distance from center (default: DEFAULT_RADIUS)
   * @returns {Object} Bounding box { x, y, width, height, centerX, centerY }
   */
  getGateGroupBounds(gateNumber, radius = this.DEFAULT_RADIUS) {
    // Get positions for all 6 lines
    const positions = [];
    for (let line = 1; line <= 6; line++) {
      positions.push(this.getRadialPosition(gateNumber, line, radius));
    }

    // Find min/max X and Y
    const xCoords = positions.map(p => p.x);
    const yCoords = positions.map(p => p.y);

    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);

    const width = maxX - minX;
    const height = maxY - minY;

    return {
      gate: gateNumber,
      x: minX,
      y: minY,
      width,
      height,
      centerX: minX + (width / 2),
      centerY: minY + (height / 2),
      positions  // Include individual line positions
    };
  }

  /**
   * Get arc information for a quarter
   * @param {string} quarterName - "Mutation", "Initiation", "Duality", or "Civilisation"
   * @returns {Object} Arc data { startAngle, endAngle, arcLength, gates }
   */
  getQuarterArc(quarterName) {
    // Get all gates in quarter from V3
    const gates = this.v3.getGatesInQuarter(quarterName);

    if (gates.length === 0) {
      throw new Error(`No gates found for quarter: ${quarterName}`);
    }

    // Get angle for first and last gate
    const firstGateData = this.v3.getDockingData(gates[0], 1);
    const lastGateData = this.v3.getDockingData(gates[gates.length - 1], 6);

    const startAngle = firstGateData.angle;
    const endAngle = lastGateData.angle;

    // Calculate arc length
    let arcLength = endAngle - startAngle;
    if (arcLength < 0) {
      arcLength += 360;
    }

    return {
      quarter: quarterName,
      startAngle,
      endAngle,
      arcLength,
      gates,
      gateCount: gates.length,
      lineCount: gates.length * 6
    };
  }

  /**
   * Get arc information for a face
   * @param {string} faceName - Face name (e.g., "Hades", "Prometheus")
   * @returns {Object} Arc data { startAngle, endAngle, arcLength, gates }
   */
  getFaceArc(faceName) {
    // Get all gates in face from V3
    const gates = this.v3.getGatesInFace(faceName);

    if (gates.length === 0) {
      throw new Error(`No gates found for face: ${faceName}`);
    }

    // Get angle for first and last gate
    const firstGateData = this.v3.getDockingData(gates[0], 1);
    const lastGateData = this.v3.getDockingData(gates[gates.length - 1], 6);

    const startAngle = firstGateData.angle;
    const endAngle = lastGateData.angle;

    // Calculate arc length
    let arcLength = endAngle - startAngle;
    if (arcLength < 0) {
      arcLength += 360;
    }

    return {
      face: faceName,
      startAngle,
      endAngle,
      arcLength,
      gates,
      gateCount: gates.length,
      lineCount: gates.length * 6
    };
  }

  /**
   * Calculate distance between two points
   * @param {number} x1 - First point X
   * @param {number} y1 - First point Y
   * @param {number} x2 - Second point X
   * @param {number} y2 - Second point Y
   * @returns {number} Distance in SVG units
   */
  distanceBetweenPoints(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Check if a point is within a circle
   * @param {number} pointX - Point X coordinate
   * @param {number} pointY - Point Y coordinate
   * @param {number} centerX - Circle center X
   * @param {number} centerY - Circle center Y
   * @param {number} radius - Circle radius
   * @returns {boolean} True if point is inside circle
   */
  isPointInCircle(pointX, pointY, centerX, centerY, radius) {
    const distance = this.distanceBetweenPoints(pointX, pointY, centerX, centerY);
    return distance <= radius;
  }

  /**
   * Calculate angle between two points
   * @param {number} x1 - First point X
   * @param {number} y1 - First point Y
   * @param {number} x2 - Second point X
   * @param {number} y2 - Second point Y
   * @returns {number} Angle in degrees
   */
  angleBetweenPoints(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const radians = Math.atan2(dy, dx);
    return this.normalizeAngle(this.radiansToDegrees(radians) + 90);
  }

  /**
   * Get all line positions for entire wheel
   * Useful for validation and visualization
   * @param {number} radius - Distance from center (default: DEFAULT_RADIUS)
   * @returns {Array<Object>} Array of 384 line positions
   */
  getAllLinePositions(radius = this.DEFAULT_RADIUS) {
    const positions = [];

    for (let gate = 1; gate <= 64; gate++) {
      for (let line = 1; line <= 6; line++) {
        positions.push(this.getRadialPosition(gate, line, radius));
      }
    }

    return positions;
  }

  /**
   * Get positions for multiple gates at different radii
   * Useful for multi-ring visualizations
   * @param {Array<number>} gates - Array of gate numbers
   * @param {Array<number>} radii - Array of radii (one per gate)
   * @returns {Array<Object>} Array of gate positions
   */
  getMultiRadiusPositions(gates, radii) {
    if (gates.length !== radii.length) {
      throw new Error('Gates and radii arrays must be same length');
    }

    return gates.map((gate, index) => {
      const radius = radii[index];
      const positions = [];
      for (let line = 1; line <= 6; line++) {
        positions.push(this.getRadialPosition(gate, line, radius));
      }
      return {
        gate,
        radius,
        positions
      };
    });
  }

  /**
   * Convert SVG coordinates back to angle
   * Useful for reverse mapping
   * @param {number} x - SVG X coordinate
   * @param {number} y - SVG Y coordinate
   * @param {number} centerX - Center X (default: CENTER_X)
   * @param {number} centerY - Center Y (default: CENTER_Y)
   * @returns {Object} { angle, radius }
   */
  coordinatesToAngle(x, y, centerX = this.CENTER_X, centerY = this.CENTER_Y) {
    const dx = x - centerX;
    const dy = y - centerY;

    // Calculate radius
    const radius = Math.sqrt(dx * dx + dy * dy);

    // Calculate angle (adjust for our convention: 0° = top)
    const radians = Math.atan2(dy, dx);
    const angle = this.normalizeAngle(this.radiansToDegrees(radians) + 90);

    return { angle, radius };
  }

  /**
   * Get wheel configuration information
   * @returns {Object} Configuration details
   */
  getWheelConfig() {
    return {
      centerX: this.CENTER_X,
      centerY: this.CENTER_Y,
      defaultRadius: this.DEFAULT_RADIUS,
      totalLines: this.TOTAL_LINES,
      totalGates: this.TOTAL_GATES,
      linesPerGate: this.LINES_PER_GATE,
      degreesPerLine: this.DEGREES_PER_LINE,
      convention: {
        zeroDegreesPosition: 'Top (12 o\'clock)',
        rotation: 'Clockwise',
        angleAdjustment: '-90° (to align 0° with top)'
      }
    };
  }
}

// Export
module.exports = SVGGeometry;
module.exports.default = SVGGeometry;
