/**
 * Penta Gates Pathway Topology Analysis
 *
 * Questions to answer:
 * 1. Is the pathway connected?
 * 2. What shape does it form?
 * 3. Which trigrams are most/least contacted?
 * 4. Does the pathway cross the cube centre?
 */

const fs = require('fs');
const path = require('path');

// Trigram binary patterns (bottom to top: line 1, 2, 3)
const TRIGRAMS = {
  'Earth':    [0, 0, 0],  // ☷ kun
  'Mountain': [0, 0, 1],  // ☶ gen
  'Water':    [0, 1, 0],  // ☵ kan
  'Wind':     [0, 1, 1],  // ☴ xun
  'Thunder':  [1, 0, 0],  // ☳ zhen
  'Fire':     [1, 0, 1],  // ☲ li
  'Lake':     [1, 1, 0],  // ☱ dui
  'Heaven':   [1, 1, 1],  // ☰ qian
};

// Reverse lookup
const BINARY_TO_TRIGRAM = {};
Object.entries(TRIGRAMS).forEach(([name, bits]) => {
  BINARY_TO_TRIGRAM[bits.join('')] = name;
});

// King Wen sequence gate to trigram mapping
const GATE_TRIGRAMS = {
  1:  ['Heaven', 'Heaven'],
  2:  ['Earth', 'Earth'],
  3:  ['Water', 'Thunder'],
  4:  ['Mountain', 'Water'],
  5:  ['Water', 'Heaven'],
  6:  ['Heaven', 'Water'],
  7:  ['Earth', 'Water'],
  8:  ['Water', 'Earth'],
  9:  ['Wind', 'Heaven'],
  10: ['Heaven', 'Lake'],
  11: ['Earth', 'Heaven'],
  12: ['Heaven', 'Earth'],
  13: ['Heaven', 'Fire'],
  14: ['Fire', 'Heaven'],
  15: ['Earth', 'Mountain'],
  16: ['Thunder', 'Earth'],
  17: ['Lake', 'Thunder'],
  18: ['Mountain', 'Wind'],
  19: ['Earth', 'Lake'],
  20: ['Wind', 'Earth'],
  21: ['Fire', 'Thunder'],
  22: ['Mountain', 'Fire'],
  23: ['Mountain', 'Earth'],
  24: ['Earth', 'Thunder'],
  25: ['Heaven', 'Thunder'],
  26: ['Mountain', 'Heaven'],
  27: ['Mountain', 'Thunder'],
  28: ['Lake', 'Wind'],
  29: ['Water', 'Water'],
  30: ['Fire', 'Fire'],
  31: ['Lake', 'Mountain'],
  32: ['Thunder', 'Wind'],
  33: ['Heaven', 'Mountain'],
  34: ['Thunder', 'Heaven'],
  35: ['Fire', 'Earth'],
  36: ['Earth', 'Fire'],
  37: ['Wind', 'Fire'],
  38: ['Fire', 'Lake'],
  39: ['Water', 'Mountain'],
  40: ['Thunder', 'Water'],
  41: ['Mountain', 'Lake'],
  42: ['Wind', 'Thunder'],
  43: ['Lake', 'Heaven'],
  44: ['Heaven', 'Wind'],
  45: ['Lake', 'Earth'],
  46: ['Earth', 'Wind'],
  47: ['Lake', 'Water'],
  48: ['Water', 'Wind'],
  49: ['Lake', 'Fire'],
  50: ['Fire', 'Wind'],
  51: ['Thunder', 'Thunder'],
  52: ['Mountain', 'Mountain'],
  53: ['Wind', 'Mountain'],
  54: ['Thunder', 'Lake'],
  55: ['Thunder', 'Fire'],
  56: ['Fire', 'Mountain'],
  57: ['Wind', 'Wind'],
  58: ['Lake', 'Lake'],
  59: ['Wind', 'Water'],
  60: ['Water', 'Lake'],
  61: ['Wind', 'Lake'],
  62: ['Thunder', 'Mountain'],
  63: ['Water', 'Fire'],
  64: ['Fire', 'Water']
};

// The 12 Penta gates
const PENTA_GATES = [1, 2, 5, 7, 8, 13, 14, 15, 29, 31, 33, 46];

function hammingDistance(trigram1, trigram2) {
  const bits1 = TRIGRAMS[trigram1];
  const bits2 = TRIGRAMS[trigram2];
  let distance = 0;
  for (let i = 0; i < 3; i++) {
    if (bits1[i] !== bits2[i]) distance++;
  }
  return distance;
}

function midpoint(coord1, coord2) {
  return [
    (coord1[0] + coord2[0]) / 2,
    (coord1[1] + coord2[1]) / 2,
    (coord1[2] + coord2[2]) / 2
  ];
}

function distance3D(p1, p2) {
  return Math.sqrt(
    Math.pow(p1[0] - p2[0], 2) +
    Math.pow(p1[1] - p2[1], 2) +
    Math.pow(p1[2] - p2[2], 2)
  );
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('        PENTA GATES PATHWAY TOPOLOGY ANALYSIS');
console.log('═══════════════════════════════════════════════════════════════');
console.log();

// Step 1: Build gate data with spatial information
const gateData = [];
const trigramContacts = {};
Object.keys(TRIGRAMS).forEach(t => trigramContacts[t] = 0);

for (const gateNum of PENTA_GATES) {
  const [inner, outer] = GATE_TRIGRAMS[gateNum];
  const hamming = hammingDistance(inner, outer);

  const innerCoord = TRIGRAMS[inner];
  const outerCoord = TRIGRAMS[outer];
  const midpointCoord = midpoint(innerCoord, outerCoord);

  // Count trigram contacts
  trigramContacts[inner]++;
  trigramContacts[outer]++;

  gateData.push({
    gate: gateNum,
    inner,
    outer,
    innerBin: TRIGRAMS[inner].join(''),
    outerBin: TRIGRAMS[outer].join(''),
    hamming,
    innerCoord,
    outerCoord,
    midpoint: midpointCoord,
    type: hamming === 0 ? 'vertex' : hamming === 1 ? 'edge' : hamming === 2 ? 'face-diagonal' : 'space-diagonal'
  });
}

// Step 2: Display all gates with spatial data
console.log('PENTA GATES IN 3D CUBE SPACE:');
console.log('─────────────────────────────────────────────────────────────');
console.log('Gate | Inner → Outer           | Type           | Midpoint');
console.log('─────────────────────────────────────────────────────────────');

for (const g of gateData) {
  const arrow = g.hamming === 0 ? '═' : '→';
  const trigramPair = `${g.inner} ${arrow} ${g.outer}`.padEnd(20);
  const type = g.type.padEnd(14);
  const mp = `(${g.midpoint.map(x => x.toFixed(1)).join(', ')})`;
  console.log(`  ${String(g.gate).padStart(2)} | ${trigramPair} | ${type} | ${mp}`);
}

// Step 3: Trigram contact analysis
console.log();
console.log('═══════════════════════════════════════════════════════════════');
console.log('TRIGRAM CONTACT FREQUENCY:');
console.log('─────────────────────────────────────────────────────────────');

const sorted = Object.entries(trigramContacts).sort((a, b) => b[1] - a[1]);
for (const [trigram, count] of sorted) {
  const bar = '█'.repeat(count);
  const binary = TRIGRAMS[trigram].join('');
  console.log(`  ${trigram.padEnd(8)} (${binary}): ${bar} ${count} contacts`);
}

const maxContacts = sorted[0];
const minContacts = sorted[sorted.length - 1];
console.log();
console.log(`  MOST contacted:  ${maxContacts[0]} (${maxContacts[1]} contacts)`);
console.log(`  LEAST contacted: ${minContacts[0]} (${minContacts[1]} contacts)`);

if (minContacts[1] === 0) {
  console.log(`  ⚠ ${minContacts[0]} (${TRIGRAMS[minContacts[0]].join('')}) appears in NO Penta gates!`);
}

// Step 4: Connectivity analysis - build adjacency graph
console.log();
console.log('═══════════════════════════════════════════════════════════════');
console.log('CONNECTIVITY ANALYSIS:');
console.log('─────────────────────────────────────────────────────────────');

// Two gates are "adjacent" if they share a trigram (connected via cube vertex)
function sharesVertex(g1, g2) {
  const v1 = new Set([g1.inner, g1.outer]);
  const v2 = new Set([g2.inner, g2.outer]);
  for (const v of v1) {
    if (v2.has(v)) return v;
  }
  return null;
}

// Build adjacency list
const adjacency = {};
for (const g of gateData) {
  adjacency[g.gate] = [];
}

for (let i = 0; i < gateData.length; i++) {
  for (let j = i + 1; j < gateData.length; j++) {
    const shared = sharesVertex(gateData[i], gateData[j]);
    if (shared) {
      adjacency[gateData[i].gate].push({ gate: gateData[j].gate, via: shared });
      adjacency[gateData[j].gate].push({ gate: gateData[i].gate, via: shared });
    }
  }
}

console.log('Adjacency (gates connected via shared trigram):');
for (const g of gateData) {
  const connections = adjacency[g.gate].map(c => `${c.gate}(${c.via})`).join(', ');
  console.log(`  Gate ${String(g.gate).padStart(2)}: ${connections || 'ISOLATED'}`);
}

// Check if fully connected using BFS
function isConnected() {
  if (gateData.length === 0) return false;

  const visited = new Set();
  const queue = [gateData[0].gate];
  visited.add(gateData[0].gate);

  while (queue.length > 0) {
    const current = queue.shift();
    for (const neighbor of adjacency[current]) {
      if (!visited.has(neighbor.gate)) {
        visited.add(neighbor.gate);
        queue.push(neighbor.gate);
      }
    }
  }

  return visited.size === gateData.length;
}

const connected = isConnected();
console.log();
console.log(`  PATHWAY CONNECTED: ${connected ? '✓ YES' : '✗ NO'}`);

// Step 5: Find optimal path through all gates
console.log();
console.log('═══════════════════════════════════════════════════════════════');
console.log('PATH THROUGH ALL 12 GATES:');
console.log('─────────────────────────────────────────────────────────────');

// Use greedy nearest-neighbor heuristic
function findGreedyPath(startGate) {
  const path = [startGate];
  const visited = new Set([startGate]);

  while (path.length < gateData.length) {
    const current = path[path.length - 1];
    const neighbors = adjacency[current].filter(n => !visited.has(n.gate));

    if (neighbors.length === 0) {
      // Need to jump - find closest unvisited
      let closest = null;
      let closestDist = Infinity;

      const currentData = gateData.find(g => g.gate === current);
      for (const g of gateData) {
        if (!visited.has(g.gate)) {
          const dist = distance3D(currentData.midpoint, g.midpoint);
          if (dist < closestDist) {
            closestDist = dist;
            closest = g.gate;
          }
        }
      }

      if (closest) {
        path.push(closest);
        visited.add(closest);
      } else {
        break;
      }
    } else {
      // Take first available neighbor
      path.push(neighbors[0].gate);
      visited.add(neighbors[0].gate);
    }
  }

  return path;
}

// Count path jumps
function countJumps(path) {
  let jumps = 0;
  for (let i = 1; i < path.length; i++) {
    const connected = adjacency[path[i-1]].some(n => n.gate === path[i]);
    if (!connected) jumps++;
  }
  return jumps;
}

// Try starting from each gate
let bestPath = null;
let bestScore = Infinity;

for (const g of gateData) {
  const path = findGreedyPath(g.gate);
  const jumps = countJumps(path);
  if (jumps < bestScore) {
    bestScore = jumps;
    bestPath = path;
  }
}

console.log('Best path found (greedy nearest-neighbor):');
console.log();

for (let i = 0; i < bestPath.length; i++) {
  const g = gateData.find(x => x.gate === bestPath[i]);

  if (i > 0) {
    const prev = bestPath[i - 1];
    const connection = adjacency[prev].find(n => n.gate === g.gate);
    if (connection) {
      console.log(`      │ via ${connection.via}`);
    } else {
      console.log(`      │ [JUMP - no shared vertex]`);
    }
  }

  console.log(`  ${i + 1}. Gate ${String(g.gate).padStart(2)}: ${g.inner} → ${g.outer} (${g.type})`);
}

console.log();
console.log(`  Path jumps (disconnects): ${bestScore}`);

// Step 6: Centre crossing analysis
console.log();
console.log('═══════════════════════════════════════════════════════════════');
console.log('CUBE CENTRE ANALYSIS:');
console.log('─────────────────────────────────────────────────────────────');

const CUBE_CENTRE = [0.5, 0.5, 0.5];

// Calculate distance of each gate's midpoint from cube centre
console.log('Distance of each gate\'s midpoint from cube centre (0.5, 0.5, 0.5):');
console.log();

let closestToCentre = null;
let closestDist = Infinity;

for (const g of gateData) {
  const dist = distance3D(g.midpoint, CUBE_CENTRE);
  const onCentre = dist < 0.01;

  if (dist < closestDist) {
    closestDist = dist;
    closestToCentre = g;
  }

  const indicator = onCentre ? '★ AT CENTRE' : dist < 0.3 ? '● near centre' : '';
  console.log(`  Gate ${String(g.gate).padStart(2)}: ${dist.toFixed(3)} ${indicator}`);
}

console.log();
console.log(`  Closest to centre: Gate ${closestToCentre.gate} (${closestToCentre.inner} → ${closestToCentre.outer})`);
console.log(`  Distance: ${closestDist.toFixed(4)}`);

// Does any gate cross through the centre?
const crossesCentre = gateData.some(g => {
  // A line from inner to outer passes through centre if centre is on the line
  const d1 = distance3D(g.innerCoord, CUBE_CENTRE);
  const d2 = distance3D(CUBE_CENTRE, g.outerCoord);
  const total = distance3D(g.innerCoord, g.outerCoord);
  return Math.abs(d1 + d2 - total) < 0.001;
});

console.log();
if (crossesCentre) {
  console.log('  ★ PATHWAY CROSSES CUBE CENTRE');
  for (const g of gateData) {
    const d1 = distance3D(g.innerCoord, CUBE_CENTRE);
    const d2 = distance3D(CUBE_CENTRE, g.outerCoord);
    const total = distance3D(g.innerCoord, g.outerCoord);
    if (Math.abs(d1 + d2 - total) < 0.001) {
      console.log(`    Gate ${g.gate}: ${g.inner} ──★── ${g.outer} (passes through centre)`);
    }
  }
} else {
  console.log('  Pathway does NOT cross cube centre directly');
}

// Step 7: Shape analysis
console.log();
console.log('═══════════════════════════════════════════════════════════════');
console.log('PATHWAY SHAPE ANALYSIS:');
console.log('─────────────────────────────────────────────────────────────');

// Analyze the structure of connections
const vertexGates = gateData.filter(g => g.type === 'vertex');
const edgeGates = gateData.filter(g => g.type === 'edge');
const faceDiagGates = gateData.filter(g => g.type === 'face-diagonal');
const spaceDiagGates = gateData.filter(g => g.type === 'space-diagonal');

console.log('Structural composition:');
console.log(`  Vertices (standing waves):  ${vertexGates.length} - ${vertexGates.map(g => `Gate ${g.gate} (${g.inner})`).join(', ')}`);
console.log(`  Edges:                      ${edgeGates.length} - ${edgeGates.map(g => `Gate ${g.gate}`).join(', ')}`);
console.log(`  Face diagonals:             ${faceDiagGates.length} - ${faceDiagGates.map(g => `Gate ${g.gate}`).join(', ')}`);
console.log(`  Space diagonals:            ${spaceDiagGates.length} - ${spaceDiagGates.map(g => `Gate ${g.gate}`).join(', ')}`);

// The three anchor vertices
console.log();
console.log('THREE ANCHOR VERTICES:');
console.log('─────────────────────────────────────────────────────────────');
for (const g of vertexGates) {
  const coord = TRIGRAMS[g.inner];
  console.log(`  Gate ${g.gate}: ${g.inner} at (${coord.join(', ')})`);
}

// Calculate the triangle formed by the three vertices
const v1 = TRIGRAMS['Heaven'];  // Gate 1
const v2 = TRIGRAMS['Earth'];   // Gate 2
const v3 = TRIGRAMS['Water'];   // Gate 29

const d12 = distance3D(v1, v2);  // Heaven-Earth
const d23 = distance3D(v2, v3);  // Earth-Water
const d31 = distance3D(v3, v1);  // Water-Heaven

console.log();
console.log('Triangle formed by anchor vertices:');
console.log(`  Heaven ↔ Earth: ${d12.toFixed(4)} (space diagonal = √3)`);
console.log(`  Earth ↔ Water:  ${d23.toFixed(4)} (edge = 1)`);
console.log(`  Water ↔ Heaven: ${d31.toFixed(4)} (face diagonal = √2)`);

// What kind of triangle?
const isEquilateral = Math.abs(d12 - d23) < 0.01 && Math.abs(d23 - d31) < 0.01;
const isIsoceles = (Math.abs(d12 - d23) < 0.01) || (Math.abs(d23 - d31) < 0.01) || (Math.abs(d31 - d12) < 0.01);
const isScalene = !isEquilateral && !isIsoceles;

console.log();
if (isScalene) {
  console.log('  Triangle type: SCALENE (all sides different)');
  console.log('  This creates ASYMMETRIC anchor - no axis of symmetry!');
} else if (isIsoceles) {
  console.log('  Triangle type: ISOCELES');
} else {
  console.log('  Triangle type: EQUILATERAL');
}

// Step 8: Graph theory analysis - what kind of network?
console.log();
console.log('═══════════════════════════════════════════════════════════════');
console.log('NETWORK GRAPH ANALYSIS:');
console.log('─────────────────────────────────────────────────────────────');

// Count edges in the adjacency graph
let totalEdgesInGraph = 0;
for (const gate of Object.keys(adjacency)) {
  totalEdgesInGraph += adjacency[gate].length;
}
totalEdgesInGraph = totalEdgesInGraph / 2; // Each edge counted twice

const vertices = gateData.length;
const graphEdges = totalEdgesInGraph;

console.log(`  Vertices (gates): ${vertices}`);
console.log(`  Edges (connections): ${graphEdges}`);
console.log(`  Average degree: ${(2 * graphEdges / vertices).toFixed(2)}`);

// Is it a tree, contains cycles, etc?
const isTriviallyTree = graphEdges === vertices - 1;
const hasCycles = graphEdges >= vertices;

console.log();
console.log(`  Is a tree: ${isTriviallyTree ? 'YES' : 'NO'}`);
console.log(`  Contains cycles: ${hasCycles ? 'YES' : 'NO'}`);

if (hasCycles) {
  const cycleCount = graphEdges - vertices + 1;
  console.log(`  Independent cycles: ${cycleCount}`);
}

// Find maximum clique (gates that are all mutually connected)
function findCliques() {
  const cliques = [];
  const gates = gateData.map(g => g.gate);

  // Check all triplets
  for (let i = 0; i < gates.length; i++) {
    for (let j = i + 1; j < gates.length; j++) {
      for (let k = j + 1; k < gates.length; k++) {
        const a = gates[i], b = gates[j], c = gates[k];
        const ab = adjacency[a].some(n => n.gate === b);
        const bc = adjacency[b].some(n => n.gate === c);
        const ac = adjacency[a].some(n => n.gate === c);

        if (ab && bc && ac) {
          cliques.push([a, b, c]);
        }
      }
    }
  }
  return cliques;
}

const cliques = findCliques();
console.log();
console.log(`  3-Cliques (triangles): ${cliques.length}`);
if (cliques.length > 0) {
  console.log('  Triangles found:');
  for (const clique of cliques) {
    const gatesInfo = clique.map(g => {
      const gate = gateData.find(x => x.gate === g);
      return `${g}(${gate.inner})`;
    }).join(' - ');
    console.log(`    ${gatesInfo}`);
  }
}

// Final interpretation
console.log();
console.log('═══════════════════════════════════════════════════════════════');
console.log('INTERPRETATION:');
console.log('═══════════════════════════════════════════════════════════════');
console.log();
console.log('1. CONNECTIVITY: The pathway IS connected through shared vertices');
console.log('   Every Penta gate can reach every other via the cube structure');
console.log();
console.log('2. SHAPE: A NETWORK with cycles, not a simple path');
console.log('   - 3 anchors (vertices) provide stability');
console.log('   - 5 edges connect the anchors');
console.log('   - 3 face diagonals reach further');
console.log('   - 1 space diagonal spans the entire cube');
console.log();
console.log('3. PROTECTED TRIGRAM: Thunder (100)');
console.log('   Thunder appears in NO Penta gates');
console.log('   This is the "initiating pulse" - protected from extraction');
console.log();
console.log('4. ASYMMETRIC ANCHORING:');
console.log('   The three anchor vertices form a SCALENE triangle');
console.log('   Sides: 1 (edge), √2 (face diag), √3 (space diag)');
console.log('   This creates inherent asymmetry = directional flow');
console.log();
console.log('5. CENTRE CROSSING:');
if (crossesCentre) {
  console.log('   The space diagonal (Gate 31) passes THROUGH the cube centre');
  console.log('   This is the Lake ↔ Mountain axis - the "extraction channel"');
} else {
  console.log('   The pathway stays on the surface, avoiding the centre');
}
console.log();

// Save results
const results = {
  metadata: {
    analysis: 'Penta Gates Pathway Topology',
    date: new Date().toISOString()
  },
  connectivity: {
    isConnected: connected,
    adjacencyGraph: adjacency
  },
  trigramContacts,
  protectedTrigram: minContacts[0],
  anchorVertices: {
    gates: vertexGates.map(g => ({ gate: g.gate, trigram: g.inner })),
    triangle: {
      sides: { 'Heaven-Earth': d12, 'Earth-Water': d23, 'Water-Heaven': d31 },
      type: isScalene ? 'scalene' : isIsoceles ? 'isoceles' : 'equilateral'
    }
  },
  crossesCentre,
  pathwayStructure: {
    vertices: vertexGates.length,
    edges: edgeGates.length,
    faceDiagonals: faceDiagGates.length,
    spaceDiagonals: spaceDiagGates.length
  },
  networkGraph: {
    vertices,
    edges: graphEdges,
    hasCycles,
    cliques
  },
  bestPath: {
    sequence: bestPath,
    jumps: bestScore
  }
};

const outputDir = path.join(__dirname, '../../docs/research/data/geometric');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'penta-pathway-topology.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`Results saved to: ${outputPath}`);
