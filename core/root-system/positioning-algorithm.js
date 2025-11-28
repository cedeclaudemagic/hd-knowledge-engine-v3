/**
 * Root Positioning Algorithm - Immutable Mathematical Foundation
 *
 * This is the DOCKING STATION for all knowledge systems.
 * Pure functions - no storage, only calculation.
 *
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

// Load immutable constants
const GATE_SEQUENCE = require('./gate-sequence.json').sequence;
const BINARY_IDENTITY = require('./binary-identity.json').gates;

// Mathematical constants
const DEGREES_PER_LINE = 0.9375;  // 360° / 384 lines
const LINES_PER_GATE = 6;
const TOTAL_LINES = 384;
const TOTAL_GATES = 64;

/**
 * Calculate wheel position for any gate/line
 * This is the ROOT calculation that all systems dock into
 */
function getWheelPosition(gateNumber, lineNumber = 1) {
  if (gateNumber < 1 || gateNumber > 64) {
    throw new Error(`Invalid gate number: ${gateNumber} (must be 1-64)`);
  }
  if (lineNumber < 1 || lineNumber > 6) {
    throw new Error(`Invalid line number: ${lineNumber} (must be 1-6)`);
  }

  const wheelIndex = GATE_SEQUENCE.indexOf(gateNumber);
  if (wheelIndex === -1) {
    throw new Error(`Gate ${gateNumber} not found in sequence`);
  }

  const linePosition = (wheelIndex * LINES_PER_GATE) + (lineNumber - 1);
  const angle = linePosition * DEGREES_PER_LINE;

  return {
    gateNumber,
    lineNumber,
    wheelIndex,        // 0-63 (gate position on wheel)
    linePosition,      // 0-383 (absolute line position)
    angle,             // 0-360 degrees
    angleNormalized: angle % 360
  };
}

/**
 * Get binary pattern for gate
 */
function getBinaryPattern(gateNumber) {
  const binary = BINARY_IDENTITY[gateNumber]?.binary;
  if (!binary) {
    throw new Error(`Binary pattern not found for gate ${gateNumber}`);
  }
  return binary;
}

/**
 * Calculate Quarter from binary (first 2 bits)
 */
function getQuarter(gateNumber) {
  const binary = getBinaryPattern(gateNumber);
  const firstTwoBits = binary.substring(0, 2);

  const quarterMap = {
    '11': 'Mutation',
    '10': 'Initiation',
    '01': 'Duality',
    '00': 'Civilisation'
  };

  return quarterMap[firstTwoBits];
}

/**
 * Calculate Face from binary (first 4 bits)
 */
function getFace(gateNumber) {
  const binary = getBinaryPattern(gateNumber);
  const firstFourBits = binary.substring(0, 4);

  // Convert to codon letters
  const bigramMap = { '11': 'A', '00': 'U', '10': 'C', '01': 'G' };
  const letter1 = bigramMap[firstFourBits.substring(0, 2)];
  const letter2 = bigramMap[firstFourBits.substring(2, 4)];
  const codonPattern = letter1 + letter2;

  const faceMap = {
    'AA': 'Hades', 'AC': 'Prometheus', 'AG': 'Vishnu', 'AU': 'Keepers of the Wheel',
    'CA': 'Kali', 'CC': 'Mitra', 'CG': 'Michael', 'CU': 'Janus',
    'GA': 'Minerva', 'GC': 'Christ', 'GG': 'Harmonia', 'GU': 'Thoth',
    'UA': 'Maat', 'UC': 'Parvati', 'UG': 'Lakshmi', 'UU': 'Maia'
  };

  return faceMap[codonPattern];
}

/**
 * Calculate Trigrams from binary (upper and lower 3 bits)
 *
 * IMPORTANT: Binary strings are stored BOTTOM-TO-TOP
 * - Index 0 = Line 1 (bottom)
 * - Index 5 = Line 6 (top)
 *
 * Therefore:
 * - substring(0, 3) = Lines 1-3 = LOWER trigram
 * - substring(3, 6) = Lines 4-6 = UPPER trigram
 */
function getTrigrams(gateNumber) {
  const binary = getBinaryPattern(gateNumber);
  const lower = binary.substring(0, 3);  // Lines 1-3 (bottom) - LOWER trigram
  const upper = binary.substring(3, 6);  // Lines 4-6 (top) - UPPER trigram

  const trigramMap = {
    '111': 'Heaven', '000': 'Earth', '001': 'Mountain', '100': 'Thunder',
    '110': 'Lake', '011': 'Wind', '101': 'Fire', '010': 'Water'
  };

  return {
    upper: trigramMap[upper],
    lower: trigramMap[lower]
  };
}

/**
 * Calculate Opposite Gate (binary inversion)
 */
function getOppositeGate(gateNumber) {
  const binary = getBinaryPattern(gateNumber);
  const inverted = binary.split('').map(bit => bit === '1' ? '0' : '1').join('');

  // Find gate with inverted binary
  for (let gate in BINARY_IDENTITY) {
    if (BINARY_IDENTITY[gate].binary === inverted) {
      return parseInt(gate);
    }
  }

  throw new Error(`Opposite gate not found for gate ${gateNumber}`);
}

/**
 * Get complete docking data for any gate/line
 * This is what knowledge systems use to attach their mappings
 */
function getDockingData(gateNumber, lineNumber = null) {
  const position = getWheelPosition(gateNumber, lineNumber || 1);
  const binary = getBinaryPattern(gateNumber);

  const dockingData = {
    // Identity
    gate: gateNumber,
    line: lineNumber,
    binary: binary,
    codon: BINARY_IDENTITY[gateNumber].codon,

    // Positioning
    wheelIndex: position.wheelIndex,
    linePosition: position.linePosition,
    angle: position.angle,

    // Calculated relationships
    quarter: getQuarter(gateNumber),
    face: getFace(gateNumber),
    trigrams: getTrigrams(gateNumber),
    oppositeGate: getOppositeGate(gateNumber),

    // Metadata
    calculated: true,
    timestamp: new Date().toISOString()
  };

  return dockingData;
}

/**
 * Verify a knowledge system mapping can dock
 */
function verifyDocking(mapping) {
  try {
    const { gateNumber, lineNumber } = mapping;
    const dockingData = getDockingData(gateNumber, lineNumber);
    return {
      valid: true,
      dockingData,
      mapping
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      mapping
    };
  }
}

module.exports = {
  // Core functions
  getWheelPosition,
  getBinaryPattern,
  getQuarter,
  getFace,
  getTrigrams,
  getOppositeGate,

  // Docking interface
  getDockingData,
  verifyDocking,

  // Constants (for reference)
  GATE_SEQUENCE,
  DEGREES_PER_LINE,
  TOTAL_LINES,
  TOTAL_GATES
};
