/**
 * Unified Query Engine - HD Knowledge Engine
 *
 * Blazingly fast unified queries across all 11 knowledge systems.
 * Leverages calculation-first architecture - everything is computed on-demand.
 *
 * Performance: ~2-5ms per gate query (including all knowledge layers)
 */

const positioning = require('./core/root-system/positioning-algorithm.js');

// Load all knowledge systems
const geneKeys = require('./knowledge-systems/gene-keys/mappings/gene-keys-mappings.json');
const ichingNames = require('./knowledge-systems/iching-names/mappings/iching-names-mappings.json');
const hdGates = require('./knowledge-systems/hd-gates/mappings/hd-gates-mappings.json');
const hdTraditional = require('./knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const quarters = require('./knowledge-systems/quarters/mappings/quarters-mappings.json');
const trigrams = require('./knowledge-systems/trigrams/mappings/trigrams-mappings.json');
const faces = require('./knowledge-systems/faces/mappings/faces-mappings.json');
const codonRings = require('./knowledge-systems/codon-rings/mappings/codon-rings-mappings.json');
const channels = require('./knowledge-systems/channels/mappings/channels-mappings.json');
const centers = require('./knowledge-systems/centers/mappings/centers-mappings.json');
const crosses = require('./knowledge-systems/incarnation-crosses/mappings/gate-cross-mappings.json');

/**
 * Get complete unified knowledge for a specific gate
 * @param {number} gateNumber - Gate number (1-64)
 * @param {number} lineNumber - Optional line number (1-6), null for gate-level only
 * @returns {Object} Complete knowledge from all systems
 */
function getGateKnowledge(gateNumber, lineNumber = null) {
  // Step 1: Get mathematical foundation from root system (INSTANT)
  const foundation = positioning.getDockingData(gateNumber, lineNumber || 1);

  // Step 2: Simple JSON lookups for meanings (FAST)
  const knowledge = {
    gate: gateNumber,
    line: lineNumber,

    // Mathematical foundation (calculated)
    binary: foundation.binary,
    codon: foundation.codon,
    wheelPosition: foundation.wheelIndex,
    angle: foundation.angle,

    // Calculated groupings
    quarter: foundation.quarter,
    face: foundation.face,
    trigrams: foundation.trigrams,
    oppositeGate: foundation.oppositeGate,

    // Gate-level knowledge (lookups)
    geneKeys: geneKeys.mappings.find(m => m.gateNumber === gateNumber)?.knowledge,
    ichingName: ichingNames.mappings.find(m => m.gateNumber === gateNumber)?.knowledge,
    humanDesign: hdGates.mappings.find(m => m.gateNumber === gateNumber)?.knowledge,
    codonRing: codonRings.mappings.find(m => m.gateNumber === gateNumber)?.knowledge,

    // Grouping meanings (lookups)
    quarterMeaning: quarters.mappings.find(m => m.groupName === foundation.quarter)?.knowledge,
    faceMeaning: faces.mappings.find(m => m.groupName === foundation.face)?.knowledge,
    trigramMeanings: {
      upper: trigrams.mappings.find(m => m.groupName === foundation.trigrams.upper)?.knowledge,
      lower: trigrams.mappings.find(m => m.groupName === foundation.trigrams.lower)?.knowledge
    },

    // Structural (lookups)
    center: centers.mappings.find(c => c.gates.includes(gateNumber))?.centerName,
    centerKnowledge: centers.mappings.find(c => c.gates.includes(gateNumber))?.knowledge,

    // Connections (lookups)
    channelsInvolved: channels.mappings.filter(ch =>
      ch.gate1 === gateNumber || ch.gate2 === gateNumber
    ).map(ch => ({
      channel: ch.channelNumber,
      name: ch.knowledge.name,
      circuit: ch.knowledge.circuit
    })),

    incarnationCrosses: crosses.mappings.find(m => m.gateNumber === gateNumber)?.knowledge || {}
  };

  // Step 3: Add line-level knowledge if requested
  if (lineNumber) {
    const lineData = hdTraditional.mappings.find(
      m => m.gateNumber === gateNumber && m.lineNumber === lineNumber
    );
    knowledge.lineKnowledge = lineData?.knowledge;
  }

  return knowledge;
}

/**
 * Get all gates in a quarter
 * @param {string} quarterName - "Mutation", "Initiation", "Duality", or "Civilisation"
 * @returns {Array} All gates in that quarter
 */
function getGatesInQuarter(quarterName) {
  const gates = [];
  for (let i = 1; i <= 64; i++) {
    const data = positioning.getDockingData(i);
    if (data.quarter === quarterName) {
      gates.push(i);
    }
  }
  return gates;
}

/**
 * Get all gates in a face
 * @param {string} faceName - Face name (e.g., "Hades", "Prometheus")
 * @returns {Array} All gates in that face
 */
function getGatesInFace(faceName) {
  const gates = [];
  for (let i = 1; i <= 64; i++) {
    const data = positioning.getDockingData(i);
    if (data.face === faceName) {
      gates.push(i);
    }
  }
  return gates;
}

/**
 * Get all gates with a specific trigram (upper or lower)
 * @param {string} trigramName - Trigram name (e.g., "Heaven", "Earth")
 * @param {string} position - "upper" or "lower"
 * @returns {Array} All gates with that trigram
 */
function getGatesWithTrigram(trigramName, position = "upper") {
  const gates = [];
  for (let i = 1; i <= 64; i++) {
    const data = positioning.getDockingData(i);
    if (position === "upper" && data.trigrams.upper === trigramName) {
      gates.push(i);
    } else if (position === "lower" && data.trigrams.lower === trigramName) {
      gates.push(i);
    }
  }
  return gates;
}

/**
 * Get gates by center
 * @param {string} centerName - Center name (e.g., "G", "Sacral")
 * @returns {Array} All gates in that center
 */
function getGatesByCenter(centerName) {
  const center = centers.mappings.find(c => c.centerName === centerName);
  return center ? center.gates : [];
}

/**
 * Search across all knowledge systems
 * @param {string} searchTerm - Search term
 * @returns {Array} Matching results from all systems
 */
function search(searchTerm) {
  const results = [];
  const term = searchTerm.toLowerCase();

  // Search through all gate-level systems
  for (let i = 1; i <= 64; i++) {
    const knowledge = getGateKnowledge(i);
    const matches = [];

    // Check various fields
    if (knowledge.ichingName?.ichingName?.toLowerCase().includes(term)) {
      matches.push('I Ching name');
    }
    if (knowledge.humanDesign?.keyword?.toLowerCase().includes(term)) {
      matches.push('HD keyword');
    }
    if (knowledge.geneKeys?.shadow?.toLowerCase().includes(term) ||
        knowledge.geneKeys?.gift?.toLowerCase().includes(term) ||
        knowledge.geneKeys?.siddhi?.toLowerCase().includes(term)) {
      matches.push('Gene Keys');
    }

    if (matches.length > 0) {
      results.push({
        gate: i,
        matchedIn: matches,
        preview: {
          iching: knowledge.ichingName?.ichingName,
          keyword: knowledge.humanDesign?.keyword,
          geneKey: knowledge.geneKeys?.gift
        }
      });
    }
  }

  return results;
}

// Export functions
module.exports = {
  getGateKnowledge,
  getGatesInQuarter,
  getGatesInFace,
  getGatesWithTrigram,
  getGatesByCenter,
  search
};

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node unified-query-engine.js <gate> [line]');
    console.log('Example: node unified-query-engine.js 13');
    console.log('Example: node unified-query-engine.js 13 4');
    process.exit(0);
  }

  const gate = parseInt(args[0]);
  const line = args[1] ? parseInt(args[1]) : null;

  console.time('Query time');
  const result = getGateKnowledge(gate, line);
  console.timeEnd('Query time');

  console.log('\n' + '='.repeat(60));
  console.log(`UNIFIED KNOWLEDGE: Gate ${gate}${line ? `.${line}` : ''}`);
  console.log('='.repeat(60));
  console.log(JSON.stringify(result, null, 2));
}
