/**
 * Ring Analyzer
 *
 * Deconstructs SVG ring files to:
 * 1. Extract embedded knowledge (gate numbers, codons, trigrams, etc.)
 * 2. Extract style/geometry specifications
 * 3. Compare against V3 knowledge engine
 * 4. Report discrepancies
 *
 * This enables:
 * - Verification of SVG accuracy
 * - Extraction of style "recipes" for regeneration
 * - Programmatic rebuilding of rings from V3 source of truth
 */

const fs = require('fs');
const path = require('path');

// We'll use the V3 engine for verification
const engine = require('../unified-query-engine');
const positioning = require('../core/root-system/positioning-algorithm');

/**
 * Parse a hexagram SVG and extract gate data
 */
function parseHexagramsSVG(svgContent) {
  const gates = [];

  // Match gate groups: _GROUP_-_GATE_-_13_-_CAA (handles minor ID inconsistencies)
  const gatePattern = /id="_GROUP_-_GATE_-_(\d+)[_-]+([ACGU]{3})"/g;
  let match;

  while ((match = gatePattern.exec(svgContent)) !== null) {
    const gateNumber = parseInt(match[1], 10);
    const codon = match[2];

    // Find the trigram info for this gate
    const gateSection = extractGateSection(svgContent, gateNumber);
    const trigrams = extractTrigrams(gateSection);
    const lines = extractLines(gateSection);

    gates.push({
      gate: gateNumber,
      svg: {
        codon,
        lowerTrigram: trigrams.lower,
        upperTrigram: trigrams.upper,
        lines
      }
    });
  }

  return gates;
}

/**
 * Extract the SVG section for a specific gate
 */
function extractGateSection(svgContent, gateNumber) {
  // Find the gate group and extract until the next gate or closing tag
  const startPattern = new RegExp(`id="_GROUP_-_GATE_-_${gateNumber}_-_[^"]+"`);
  const startMatch = startPattern.exec(svgContent);

  if (!startMatch) return '';

  const startIndex = startMatch.index;
  // Find the closing </g> for this gate group (simplistic - assumes nested structure)
  let depth = 0;
  let endIndex = startIndex;

  for (let i = startIndex; i < svgContent.length; i++) {
    if (svgContent.substring(i, i + 2) === '<g') depth++;
    if (svgContent.substring(i, i + 4) === '</g>') {
      depth--;
      if (depth === 0) {
        endIndex = i + 4;
        break;
      }
    }
  }

  return svgContent.substring(startIndex, endIndex);
}

/**
 * Extract trigram names from gate section
 */
function extractTrigrams(section) {
  const result = { lower: null, upper: null };

  // LOWER TRIGRAM - pattern like: GROUP_-_LOWER_TRIGRAM_-_FIRE_-_YANG_BOTTOM
  const lowerMatch = /GROUP_-_LOWER_TRIGRAM_-_([A-Z]+)_-_/i.exec(section);
  if (lowerMatch) {
    result.lower = lowerMatch[1].charAt(0) + lowerMatch[1].slice(1).toLowerCase();
  }

  // UPPER TRIGRAM
  const upperMatch = /GROUP_-_UPPER_TRIGRAM_-_([A-Z]+)_-_/i.exec(section);
  if (upperMatch) {
    result.upper = upperMatch[1].charAt(0) + upperMatch[1].slice(1).toLowerCase();
  }

  return result;
}

/**
 * Extract line types (YANG/YIN) from gate section
 */
function extractLines(section) {
  const lines = [];

  for (let lineNum = 1; lineNum <= 6; lineNum++) {
    // Look for SYMBOL_-_LINE_-_1_-_YANG or SYMBOL_-_LINE_-_1_-_YIN
    const pattern = new RegExp(`SYMBOL_-_LINE_-_${lineNum}_-_(YANG|YIN)`);
    const match = pattern.exec(section);

    if (match) {
      lines.push({
        line: lineNum,
        type: match[1]
      });
    }
  }

  return lines;
}

/**
 * Compare SVG data against V3 knowledge engine
 */
function verifyAgainstV3(gateData) {
  const discrepancies = [];

  for (const gate of gateData) {
    const v3Data = engine.getGateKnowledge(gate.gate);
    const v3Position = positioning.getDockingData(gate.gate, 1);

    // Get binary from V3
    const binary = v3Position.binary;

    // Convert binary to expected codon (binary uses 0/1, codon uses ACGU)
    // Binary convention: bottom-to-top (indices 0-2 = lines 1-3 = lower trigram)
    // Codon convention: first letter from lower trigram, etc.
    const expectedCodon = binaryToCodon(binary);

    // Check codon
    if (gate.svg.codon !== expectedCodon) {
      discrepancies.push({
        gate: gate.gate,
        field: 'codon',
        svg: gate.svg.codon,
        v3: expectedCodon,
        binary: binary
      });
    }

    // Check trigrams
    if (v3Position.trigrams) {
      if (gate.svg.lowerTrigram &&
          gate.svg.lowerTrigram.toLowerCase() !== v3Position.trigrams.lower.toLowerCase()) {
        discrepancies.push({
          gate: gate.gate,
          field: 'lowerTrigram',
          svg: gate.svg.lowerTrigram,
          v3: v3Position.trigrams.lower
        });
      }

      if (gate.svg.upperTrigram &&
          gate.svg.upperTrigram.toLowerCase() !== v3Position.trigrams.upper.toLowerCase()) {
        discrepancies.push({
          gate: gate.gate,
          field: 'upperTrigram',
          svg: gate.svg.upperTrigram,
          v3: v3Position.trigrams.upper
        });
      }
    }

    // Check lines match binary pattern
    const expectedLines = binaryToLines(binary);
    for (let i = 0; i < gate.svg.lines.length; i++) {
      const svgLine = gate.svg.lines[i];
      const expectedType = expectedLines[svgLine.line - 1];

      if (svgLine.type !== expectedType) {
        discrepancies.push({
          gate: gate.gate,
          field: `line${svgLine.line}`,
          svg: svgLine.type,
          v3: expectedType,
          binary: binary
        });
      }
    }
  }

  return discrepancies;
}

/**
 * Convert 6-bit binary to codon (3-letter)
 *
 * Verified formula:
 * - Lines 1-2 (binary[0]+binary[1]) → 1st codon letter
 * - Lines 3-4 (binary[2]+binary[3]) → 2nd codon letter
 * - Lines 5-6 (binary[4]+binary[5]) → 3rd codon letter
 *
 * Bigram mapping: 00=U, 01=G, 10=C, 11=A
 *
 * Examples:
 *   Gate 1:  111111 → AAA (11 11 11)
 *   Gate 2:  000000 → UUU (00 00 00)
 *   Gate 3:  100010 → CUC (10 00 10)
 *   Gate 30: 101101 → CAG (10 11 01)
 */
function binaryToCodon(binary) {
  const codonMap = {
    '00': 'U',
    '01': 'G',
    '10': 'C',
    '11': 'A'
  };

  const bigram1 = binary[0] + binary[1];  // Lines 1-2 → 1st letter
  const bigram2 = binary[2] + binary[3];  // Lines 3-4 → 2nd letter
  const bigram3 = binary[4] + binary[5];  // Lines 5-6 → 3rd letter

  return codonMap[bigram1] + codonMap[bigram2] + codonMap[bigram3];
}

/**
 * Convert binary to expected line types
 */
function binaryToLines(binary) {
  // binary[0] = line 1, binary[5] = line 6
  return binary.split('').map(bit => bit === '1' ? 'YANG' : 'YIN');
}

/**
 * Extract geometry/style specifications
 */
function extractGeometry(svgContent) {
  const geometry = {
    viewBox: null,
    center: null,
    rings: [],
    dividerStyle: null
  };

  // ViewBox
  const viewBoxMatch = /viewBox="([^"]+)"/.exec(svgContent);
  if (viewBoxMatch) {
    geometry.viewBox = viewBoxMatch[1];
  }

  // Center from circle elements
  const circleMatch = /cx="([\d.]+)" cy="([\d.]+)"/.exec(svgContent);
  if (circleMatch) {
    geometry.center = {
      x: parseFloat(circleMatch[1]),
      y: parseFloat(circleMatch[2])
    };
  }

  // Ring radii
  const innerRing = /RING_-_INNER[^>]*r="([\d.]+)"/.exec(svgContent);
  const outerRing = /RING_-_OUTER[^>]*r="([\d.]+)"/.exec(svgContent);

  if (innerRing) geometry.rings.push({ name: 'inner', radius: parseFloat(innerRing[1]) });
  if (outerRing) geometry.rings.push({ name: 'outer', radius: parseFloat(outerRing[1]) });

  // Divider style
  const dividerMatch = /GROUP_-_DIVIDERS[^>]*>[\s\S]*?<line[^>]*stroke="([^"]+)"[^>]*stroke-width="([^"]+)"/.exec(svgContent);
  if (dividerMatch) {
    geometry.dividerStyle = {
      stroke: dividerMatch[1],
      strokeWidth: parseFloat(dividerMatch[2])
    };
  }

  return geometry;
}

/**
 * Main analysis function
 */
function analyzeRing(svgPath) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Analyzing: ${path.basename(svgPath)}`);
  console.log('='.repeat(60));

  const svgContent = fs.readFileSync(svgPath, 'utf-8');

  // Determine ring type and parse accordingly
  const filename = path.basename(svgPath).toLowerCase();

  let gateData = [];
  let geometry = {};

  if (filename.includes('hexagram')) {
    gateData = parseHexagramsSVG(svgContent);
    geometry = extractGeometry(svgContent);

    console.log(`\nGeometry:`);
    console.log(`  ViewBox: ${geometry.viewBox}`);
    console.log(`  Center: (${geometry.center?.x}, ${geometry.center?.y})`);
    geometry.rings.forEach(r => console.log(`  Ring ${r.name}: radius ${r.radius}`));

    console.log(`\nExtracted ${gateData.length} gates from SVG`);

    // Verify against V3
    const discrepancies = verifyAgainstV3(gateData);

    if (discrepancies.length === 0) {
      console.log('\n✓ All gate data matches V3 knowledge engine!');
    } else {
      console.log(`\n✗ Found ${discrepancies.length} discrepancies:\n`);
      discrepancies.forEach(d => {
        console.log(`  Gate ${d.gate} - ${d.field}:`);
        console.log(`    SVG: ${d.svg}`);
        console.log(`    V3:  ${d.v3}`);
        if (d.binary) console.log(`    Binary: ${d.binary}`);
      });
    }

    return { gateData, geometry, discrepancies };
  }

  console.log('Ring type not yet supported for detailed analysis');
  return { geometry: extractGeometry(svgContent) };
}

// Export for use as module
module.exports = {
  analyzeRing,
  parseHexagramsSVG,
  verifyAgainstV3,
  extractGeometry,
  binaryToCodon,
  binaryToLines
};

// Run if called directly
if (require.main === module) {
  const svgPath = process.argv[2] || './SVGS/the-64-hexagrams-verified-master.svg';
  analyzeRing(path.resolve(__dirname, '..', svgPath));
}
