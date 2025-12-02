/**
 * Bodygraph Geometry Extraction Script
 *
 * Parses the verified master SVG and extracts all geometry needed
 * for programmatic generation of the bodygraph.
 *
 * Extracts:
 * - 64 gate positions (circles on center perimeters)
 * - 64 gate dot positions (outer wheel markers)
 * - 9 center shapes (paths for body centers)
 * - 36 channel paths (polylines connecting gates)
 * - 128 connector lines (64 direct + 64 curved)
 *
 * Output: visualization/generators/bodygraph-geometry.json
 */

const fs = require('fs');
const path = require('path');

// Simple XML parsing helpers (no external dependencies)
function extractAttribute(element, attr) {
  // Use word boundary or space before attribute name to avoid matching
  // "data-name" when looking for "d" attribute
  const regex = new RegExp(`(?:^|\\s)${attr}="([^"]*)"`, 'i');
  const match = element.match(regex);
  return match ? match[1] : null;
}

function extractElements(svg, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>`, 'gi');
  return svg.match(regex) || [];
}

function extractGroups(svg) {
  // Extract groups with their content
  const groups = [];
  const regex = /<g[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/g>/gi;
  let match;
  while ((match = regex.exec(svg)) !== null) {
    groups.push({
      id: match[1],
      content: match[2],
      fullMatch: match[0]
    });
  }
  return groups;
}

function parseGateNumber(id) {
  // Extract gate number from ID like "SYMBOL_-_GATE_-_54" or "SYMBOL_-_GATE-DOT_-_12"
  // Also handles "PATH_-_24" format
  const match = id.match(/(?:GATE|PATH)[_\-]*(?:DOT)?[_\-]+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

function parseChannelGates(id) {
  // Extract gate pair from ID like "GROUP_-_THE_CHANNEL_OF_AWARENESS_-_24_61"
  const match = id.match(/(\d+)[_|\s]+(\d+)\s*$/);
  return match ? [parseInt(match[1], 10), parseInt(match[2], 10)] : null;
}

function main() {
  const svgPath = path.join(__dirname, '../SVGS/the-bodygraph-verified-master.svg');
  const outputPath = path.join(__dirname, '../visualization/generators/bodygraph-geometry.json');

  console.log('Reading master SVG...');
  const svg = fs.readFileSync(svgPath, 'utf8');

  const geometry = {
    description: 'Bodygraph geometry extracted from the-bodygraph-verified-master.svg',
    extractedAt: new Date().toISOString(),
    viewBox: { width: 1202.4747, height: 1202.4747 },
    transform: { x: -100.702, y: -97.3203 }, // Artboard transform for path elements
    gates: {},
    gateDots: {},
    centers: {
      shapes: {},
      definitions: {}
    },
    channels: {},
    connectors: {
      direct: {},
      curved: {}
    },
    circuits: {}
  };

  // Extract all circles (gates and gate dots)
  console.log('\nExtracting gates and gate dots...');
  const circles = extractElements(svg, 'circle');

  for (const circle of circles) {
    const id = extractAttribute(circle, 'id');
    if (!id) continue;

    const cx = parseFloat(extractAttribute(circle, 'cx'));
    const cy = parseFloat(extractAttribute(circle, 'cy'));
    const r = parseFloat(extractAttribute(circle, 'r'));

    if (id.includes('GATE-DOT') || id.includes('GATE_DOT')) {
      // Extract gate number directly from pattern GATE-DOT_-_N or GATE_DOT_-_N
      const dotMatch = id.match(/(\d+)\s*$/);
      const gateNum = dotMatch ? parseInt(dotMatch[1], 10) : null;
      if (gateNum) {
        geometry.gateDots[gateNum] = { cx, cy, r };
      }
    } else if (id.includes('GATE_-_') || id.includes('GATE -')) {
      const gateNum = parseGateNumber(id);
      if (gateNum) {
        geometry.gates[gateNum] = { cx, cy, r };
      }
    }
  }

  console.log(`  Found ${Object.keys(geometry.gates).length} gates`);
  console.log(`  Found ${Object.keys(geometry.gateDots).length} gate dots`);

  // Extract direct connection lines
  console.log('\nExtracting direct connector lines...');
  const lines = extractElements(svg, 'line');

  for (const line of lines) {
    const id = extractAttribute(line, 'id');
    if (!id || !id.includes('DIRECT-CONNECTION')) continue;

    const gateNum = parseGateNumber(id);
    if (gateNum) {
      geometry.connectors.direct[gateNum] = {
        x1: parseFloat(extractAttribute(line, 'x1')),
        y1: parseFloat(extractAttribute(line, 'y1')),
        x2: parseFloat(extractAttribute(line, 'x2')),
        y2: parseFloat(extractAttribute(line, 'y2'))
      };
    }
  }

  console.log(`  Found ${Object.keys(geometry.connectors.direct).length} direct connectors`);

  // Extract curved connection paths
  console.log('\nExtracting curved connector paths...');
  const paths = extractElements(svg, 'path');

  for (const pathEl of paths) {
    const id = extractAttribute(pathEl, 'id');
    if (!id) continue;

    if (id.includes('CURVED-CONNECTION')) {
      const gateNum = parseGateNumber(id);
      if (gateNum) {
        const d = extractAttribute(pathEl, 'd');
        const transform = extractAttribute(pathEl, 'transform');
        geometry.connectors.curved[gateNum] = { type: 'path', d, transform };
      }
    } else if (id.includes('SYMBOL_-_CENTRE')) {
      // Center outline shapes
      const centerMatch = id.match(/CENTRE[_\-]+(\w+)/i);
      if (centerMatch) {
        const centerName = centerMatch[1];
        geometry.centers.shapes[centerName] = {
          d: extractAttribute(pathEl, 'd'),
          transform: extractAttribute(pathEl, 'transform')
        };
      }
    } else if (id.includes('SYMBOL_-_DEFINITION')) {
      // Center definition shapes
      const centerMatch = id.match(/DEFINITION[_\-]+(\w+)/i);
      if (centerMatch) {
        const centerName = centerMatch[1];
        geometry.centers.definitions[centerName] = {
          d: extractAttribute(pathEl, 'd'),
          transform: extractAttribute(pathEl, 'transform')
        };
      }
    }
  }

  // Also check for line elements with CURVED-CONNECTION (some are lines not paths)
  for (const line of lines) {
    const id = extractAttribute(line, 'id');
    if (!id || !id.includes('CURVED-CONNECTION')) continue;

    const gateNum = parseGateNumber(id);
    if (gateNum && !geometry.connectors.curved[gateNum]) {
      geometry.connectors.curved[gateNum] = {
        type: 'line',
        x1: parseFloat(extractAttribute(line, 'x1')),
        y1: parseFloat(extractAttribute(line, 'y1')),
        x2: parseFloat(extractAttribute(line, 'x2')),
        y2: parseFloat(extractAttribute(line, 'y2'))
      };
    }
  }

  console.log(`  Found ${Object.keys(geometry.connectors.curved).length} curved connectors`);
  console.log(`  Found ${Object.keys(geometry.centers.shapes).length} center shapes`);
  console.log(`  Found ${Object.keys(geometry.centers.definitions).length} center definitions`);

  // Extract channels (polylines within channel groups)
  console.log('\nExtracting channels...');

  // Find circuit groups and their channels
  const circuitRegex = /<g[^>]*id="GROUP_-_CIRCUIT_-_([^"]*)"[^>]*>([\s\S]*?)<\/g>\s*(?=<g|<\/g>)/gi;
  let circuitMatch;

  // Reset regex
  const channelRegex = /<g[^>]*id="GROUP_-_THE_CHANNEL_OF_([^"]*)"[^>]*data-name="[^"]*(\d+)\|?(\d+)"[^>]*>([\s\S]*?)<\/g>/gi;

  // Find all channel groups - need to handle nested structure carefully
  // Channel IDs look like: GROUP_-_THE_CHANNEL_OF_AWARENESS_-_24_61
  const channelIdRegex = /id="(GROUP_-_THE_CHANNEL_OF_[^"]*)"/gi;
  const channelIds = [];
  let channelIdMatch;
  while ((channelIdMatch = channelIdRegex.exec(svg)) !== null) {
    channelIds.push(channelIdMatch[1]);
  }

  // For each channel, extract its content
  for (const channelFullId of channelIds) {
    // Extract gates from the ID (handles both _ and | separators)
    const gatesMatch = channelFullId.match(/(\d+)[_|]+(\d+)\s*$/);
    if (!gatesMatch) continue;

    const channelId = channelFullId.replace('GROUP_-_THE_CHANNEL_OF_', '').replace(/_-_$/, '');

    const gate1 = parseInt(gatesMatch[1], 10);
    const gate2 = parseInt(gatesMatch[2], 10);
    const channelKey = `${gate1}-${gate2}`;

    // Find the channel group content by locating its position in the SVG
    const channelStartIdx = svg.indexOf(`id="${channelFullId}"`);
    if (channelStartIdx === -1) continue;

    // Find the closing </g> for this channel group
    let depth = 0;
    let searchIdx = channelStartIdx;
    let groupStart = svg.lastIndexOf('<g', channelStartIdx);
    let groupEnd = -1;

    // Simple approach: find next </g> tags, tracking depth
    searchIdx = svg.indexOf('>', groupStart) + 1;
    depth = 1;
    while (depth > 0 && searchIdx < svg.length) {
      const nextOpen = svg.indexOf('<g', searchIdx);
      const nextClose = svg.indexOf('</g>', searchIdx);

      if (nextClose === -1) break;

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        searchIdx = nextOpen + 2;
      } else {
        depth--;
        if (depth === 0) {
          groupEnd = nextClose + 4;
        }
        searchIdx = nextClose + 4;
      }
    }

    if (groupEnd === -1) continue;
    const group = svg.substring(groupStart, groupEnd);

    // Extract polylines and paths within this channel
    const polylines = group.match(/<polyline[^>]*>/gi) || [];
    const pathsInChannel = group.match(/<path[^>]*>/gi) || [];

    const channelPaths = [];

    for (const pl of polylines) {
      const pathId = extractAttribute(pl, 'id');
      const points = extractAttribute(pl, 'points');
      const pathGate = parseGateNumber(pathId);
      if (points) {
        channelPaths.push({
          gate: pathGate,
          type: 'polyline',
          points
        });
      }
    }

    for (const p of pathsInChannel) {
      const pathId = extractAttribute(p, 'id');
      const d = extractAttribute(p, 'd');
      const transform = extractAttribute(p, 'transform');
      const pathGate = parseGateNumber(pathId);
      if (d) {
        channelPaths.push({
          gate: pathGate,
          type: 'path',
          d,
          transform
        });
      }
    }

    geometry.channels[channelKey] = {
      gates: [gate1, gate2],
      name: channelId.replace(/_/g, ' ').replace(/\s*\d+\s*\d+\s*$/, '').trim(),
      paths: channelPaths
    };
  }

  console.log(`  Found ${Object.keys(geometry.channels).length} channels`);

  // Extract circuit groupings
  console.log('\nExtracting circuit groupings...');
  const circuitGroupRegex = /<g[^>]*id="GROUP_-_CIRCUIT_-_([^"]*)"[^>]*>/gi;
  let circMatch;

  while ((circMatch = circuitGroupRegex.exec(svg)) !== null) {
    const circuitName = circMatch[1].replace(/_/g, ' ');
    geometry.circuits[circuitName] = [];

    // Find channels in this circuit by looking at what follows this group
    const startIdx = circMatch.index;
    const nextCircuitIdx = svg.indexOf('GROUP_-_CIRCUIT', startIdx + 1);
    const endIdx = nextCircuitIdx > 0 ? nextCircuitIdx : svg.indexOf('GROUP_-_CENTRES', startIdx);
    const circuitSection = svg.substring(startIdx, endIdx > 0 ? endIdx : undefined);

    // Find channel references
    const channelRefs = circuitSection.match(/THE_CHANNEL_OF_[^"]*_(\d+)[_|]+(\d+)/gi) || [];
    for (const ref of channelRefs) {
      const gates = ref.match(/(\d+)[_|]+(\d+)/);
      if (gates) {
        const channelKey = `${gates[1]}-${gates[2]}`;
        if (!geometry.circuits[circuitName].includes(channelKey)) {
          geometry.circuits[circuitName].push(channelKey);
        }
      }
    }
  }

  console.log(`  Found ${Object.keys(geometry.circuits).length} circuits`);

  // Determine which center each gate belongs to
  console.log('\nMapping gates to centers...');
  const centerGroups = {
    'HEAD': [],
    'AJNA': [],
    'THROAT': [],
    'G': [],
    'EGO': [],
    'SACRAL': [],
    'SPLEEN': [],
    'SP': [], // Solar Plexus
    'ROOT': []
  };

  // Find gate groups within center groups
  const gateGroupRegex = /<g[^>]*id="GROUP_-_(HEAD|AJNA|THROAT|G|EGO|SACRAL|SPLEEN|SP|ROOT)"[^>]*>([\s\S]*?)<\/g>/gi;
  let gateGroupMatch;

  while ((gateGroupMatch = gateGroupRegex.exec(svg)) !== null) {
    const centerName = gateGroupMatch[1];
    const content = gateGroupMatch[2];

    const gateCircles = content.match(/SYMBOL_-_GATE_-_(\d+)/gi) || [];
    for (const gc of gateCircles) {
      const gateNum = parseGateNumber(gc);
      if (gateNum && !centerGroups[centerName].includes(gateNum)) {
        centerGroups[centerName].push(gateNum);
      }
    }
  }

  // Add center info to gates
  for (const [centerName, gates] of Object.entries(centerGroups)) {
    for (const gateNum of gates) {
      if (geometry.gates[gateNum]) {
        geometry.gates[gateNum].center = centerName;
      }
    }
  }

  // Add gate counts per center
  geometry.centers.gateAssignments = centerGroups;

  // Validation
  console.log('\n=== Validation ===');
  const gateCount = Object.keys(geometry.gates).length;
  const gateDotCount = Object.keys(geometry.gateDots).length;
  const channelCount = Object.keys(geometry.channels).length;
  const directCount = Object.keys(geometry.connectors.direct).length;
  const curvedCount = Object.keys(geometry.connectors.curved).length;

  console.log(`Gates: ${gateCount}/64 ${gateCount === 64 ? '✓' : '✗'}`);
  console.log(`Gate Dots: ${gateDotCount}/64 ${gateDotCount === 64 ? '✓' : '✗'}`);
  console.log(`Channels: ${channelCount}/36 ${channelCount === 36 ? '✓' : '✗'}`);
  console.log(`Direct Connectors: ${directCount}/64 ${directCount === 64 ? '✓' : '✗'}`);
  console.log(`Curved Connectors: ${curvedCount}/64 ${curvedCount === 64 ? '✓' : '✗'}`);

  // Check for missing gates
  const allGates = new Set([...Array(64).keys()].map(i => i + 1));
  const foundGates = new Set(Object.keys(geometry.gates).map(Number));
  const missingGates = [...allGates].filter(g => !foundGates.has(g));
  if (missingGates.length > 0) {
    console.log(`Missing gates: ${missingGates.join(', ')}`);
  }

  // Write output
  console.log(`\nWriting to ${outputPath}...`);
  fs.writeFileSync(outputPath, JSON.stringify(geometry, null, 2));
  console.log('Done!');

  return geometry;
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { main };
