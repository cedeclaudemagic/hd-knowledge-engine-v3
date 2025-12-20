/**
 * Penta Pathway Cube Visualization
 *
 * Creates an isometric 3D visualization showing:
 * - The three anchor vertices (Heaven, Earth, Water) forming the scalene triangle
 * - Contact frequency as vertex size/colour
 * - Gate 31 as the central axis
 * - Thunder highlighted as the protected vertex
 */

const fs = require('fs');
const path = require('path');

// Trigram data with 3D coordinates and Penta contact frequency
const TRIGRAMS = {
  'Earth':    { binary: '000', coords: [0, 0, 0], contacts: 6, symbol: '☷' },
  'Mountain': { binary: '001', coords: [0, 0, 1], contacts: 3, symbol: '☶' },
  'Water':    { binary: '010', coords: [0, 1, 0], contacts: 5, symbol: '☵' },
  'Wind':     { binary: '011', coords: [0, 1, 1], contacts: 1, symbol: '☴' },
  'Thunder':  { binary: '100', coords: [1, 0, 0], contacts: 0, symbol: '☳' },
  'Fire':     { binary: '101', coords: [1, 0, 1], contacts: 2, symbol: '☲' },
  'Lake':     { binary: '110', coords: [1, 1, 0], contacts: 1, symbol: '☱' },
  'Heaven':   { binary: '111', coords: [1, 1, 1], contacts: 6, symbol: '☰' }
};

// The 12 cube edges (Hamming distance 1)
const CUBE_EDGES = [
  ['Earth', 'Mountain'],
  ['Earth', 'Water'],
  ['Earth', 'Thunder'],
  ['Mountain', 'Wind'],
  ['Mountain', 'Fire'],
  ['Water', 'Wind'],
  ['Water', 'Lake'],
  ['Thunder', 'Fire'],
  ['Thunder', 'Lake'],
  ['Wind', 'Heaven'],
  ['Fire', 'Heaven'],
  ['Lake', 'Heaven']
];

// Penta pathway gates
const PENTA_PATHWAY = {
  vertices: [
    { gate: 1, trigram: 'Heaven' },
    { gate: 2, trigram: 'Earth' },
    { gate: 29, trigram: 'Water' }
  ],
  edges: [
    { gate: 7, from: 'Earth', to: 'Water' },
    { gate: 8, from: 'Water', to: 'Earth' },
    { gate: 13, from: 'Heaven', to: 'Fire' },
    { gate: 14, from: 'Fire', to: 'Heaven' },
    { gate: 15, from: 'Earth', to: 'Mountain' }
  ],
  faceDiagonals: [
    { gate: 5, from: 'Water', to: 'Heaven' },
    { gate: 33, from: 'Heaven', to: 'Mountain' },
    { gate: 46, from: 'Earth', to: 'Wind' }
  ],
  spaceDiagonal: { gate: 31, from: 'Lake', to: 'Mountain' }
};

// Isometric projection (30° rotation)
function project(x, y, z, scale = 150, offsetX = 400, offsetY = 350) {
  // Isometric projection angles
  const angle = Math.PI / 6; // 30 degrees

  // Apply isometric transformation
  const isoX = (x - z) * Math.cos(angle);
  const isoY = (x + z) * Math.sin(angle) - y;

  return {
    x: offsetX + isoX * scale,
    y: offsetY + isoY * scale
  };
}

// Color based on contact frequency
function getVertexColor(contacts) {
  if (contacts === 0) return '#ff4444';      // Thunder - protected (red)
  if (contacts >= 5) return '#4488ff';        // High contact (blue)
  if (contacts >= 3) return '#44cc88';        // Medium contact (green)
  return '#888888';                           // Low contact (gray)
}

// Size based on contact frequency
function getVertexRadius(contacts) {
  if (contacts === 0) return 20;  // Thunder gets special size
  return 12 + contacts * 2;       // 12-24 range
}

function generateSVG() {
  const width = 800;
  const height = 700;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Gradients -->
    <linearGradient id="anchorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#ff8c00;stop-opacity:0.8" />
    </linearGradient>

    <linearGradient id="gate31Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff00ff;stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:#8800ff;stop-opacity:0.9" />
    </linearGradient>

    <!-- Glow filter for Thunder -->
    <filter id="thunderGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Arrow marker -->
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#ff00ff"/>
    </marker>
  </defs>

  <style>
    .cube-edge { stroke: #666; stroke-width: 1; fill: none; opacity: 0.4; }
    .penta-edge { stroke: #4488ff; stroke-width: 3; fill: none; opacity: 0.7; }
    .anchor-edge { stroke: url(#anchorGradient); stroke-width: 4; fill: none; }
    .space-diagonal { stroke: url(#gate31Gradient); stroke-width: 5; fill: none; }
    .vertex-label { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; fill: #333; }
    .gate-label { font-family: 'Courier New', monospace; font-size: 10px; fill: #666; }
    .title { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 18px; font-weight: bold; fill: #333; }
    .subtitle { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; fill: #666; }
    .legend-text { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; fill: #333; }
    .symbol { font-size: 18px; }
  </style>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#fafafa"/>

  <!-- Title -->
  <text x="${width/2}" y="35" text-anchor="middle" class="title">PENTA PATHWAY TOPOLOGY</text>
  <text x="${width/2}" y="55" text-anchor="middle" class="subtitle">The Scalene Anchor Triangle and Centre-Piercing Axis</text>

`;

  // Calculate projected positions for all vertices
  const projected = {};
  for (const [name, data] of Object.entries(TRIGRAMS)) {
    const [x, y, z] = data.coords;
    projected[name] = project(x, y, z);
  }

  // Draw cube edges (background)
  svg += '  <!-- Cube edges (background) -->\n';
  for (const [from, to] of CUBE_EDGES) {
    const p1 = projected[from];
    const p2 = projected[to];
    svg += `  <line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" class="cube-edge"/>\n`;
  }

  // Draw Penta edges
  svg += '\n  <!-- Penta edges -->\n';
  for (const edge of PENTA_PATHWAY.edges) {
    const p1 = projected[edge.from];
    const p2 = projected[edge.to];
    svg += `  <line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" class="penta-edge"/>\n`;
  }

  // Draw face diagonals
  svg += '\n  <!-- Face diagonals -->\n';
  for (const diag of PENTA_PATHWAY.faceDiagonals) {
    const p1 = projected[diag.from];
    const p2 = projected[diag.to];
    svg += `  <line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="#44cc88" stroke-width="2.5" stroke-dasharray="8,4" opacity="0.8"/>\n`;
  }

  // Draw the scalene anchor triangle (Heaven-Earth-Water)
  svg += '\n  <!-- Scalene Anchor Triangle -->\n';
  const heavenP = projected['Heaven'];
  const earthP = projected['Earth'];
  const waterP = projected['Water'];

  svg += `  <polygon points="${heavenP.x.toFixed(1)},${heavenP.y.toFixed(1)} ${earthP.x.toFixed(1)},${earthP.y.toFixed(1)} ${waterP.x.toFixed(1)},${waterP.y.toFixed(1)}" fill="url(#anchorGradient)" opacity="0.2"/>\n`;
  svg += `  <line x1="${heavenP.x.toFixed(1)}" y1="${heavenP.y.toFixed(1)}" x2="${earthP.x.toFixed(1)}" y2="${earthP.y.toFixed(1)}" class="anchor-edge"/>\n`;
  svg += `  <line x1="${earthP.x.toFixed(1)}" y1="${earthP.y.toFixed(1)}" x2="${waterP.x.toFixed(1)}" y2="${waterP.y.toFixed(1)}" class="anchor-edge"/>\n`;
  svg += `  <line x1="${waterP.x.toFixed(1)}" y1="${waterP.y.toFixed(1)}" x2="${heavenP.x.toFixed(1)}" y2="${heavenP.y.toFixed(1)}" class="anchor-edge"/>\n`;

  // Label the triangle sides
  const mid_HE = { x: (heavenP.x + earthP.x) / 2, y: (heavenP.y + earthP.y) / 2 };
  const mid_EW = { x: (earthP.x + waterP.x) / 2, y: (earthP.y + waterP.y) / 2 };
  const mid_WH = { x: (waterP.x + heavenP.x) / 2, y: (waterP.y + heavenP.y) / 2 };

  svg += `  <text x="${mid_HE.x - 25}" y="${mid_HE.y}" class="gate-label" fill="#ff8c00">√3</text>\n`;
  svg += `  <text x="${mid_EW.x - 20}" y="${mid_EW.y + 5}" class="gate-label" fill="#ff8c00">1</text>\n`;
  svg += `  <text x="${mid_WH.x + 5}" y="${mid_WH.y}" class="gate-label" fill="#ff8c00">√2</text>\n`;

  // Draw Gate 31 space diagonal (Lake → Mountain through centre)
  svg += '\n  <!-- Gate 31: Space Diagonal through Centre -->\n';
  const lakeP = projected['Lake'];
  const mountainP = projected['Mountain'];
  const centreP = project(0.5, 0.5, 0.5);

  svg += `  <line x1="${lakeP.x.toFixed(1)}" y1="${lakeP.y.toFixed(1)}" x2="${mountainP.x.toFixed(1)}" y2="${mountainP.y.toFixed(1)}" class="space-diagonal" marker-end="url(#arrowhead)"/>\n`;

  // Centre point with pulse
  svg += `  <circle cx="${centreP.x.toFixed(1)}" cy="${centreP.y.toFixed(1)}" r="8" fill="#ff00ff" opacity="0.6">\n`;
  svg += `    <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite"/>\n`;
  svg += `    <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite"/>\n`;
  svg += `  </circle>\n`;
  svg += `  <circle cx="${centreP.x.toFixed(1)}" cy="${centreP.y.toFixed(1)}" r="4" fill="#ffffff"/>\n`;
  svg += `  <text x="${centreP.x + 15}" y="${centreP.y + 4}" class="gate-label" fill="#8800ff">Gate 31</text>\n`;
  svg += `  <text x="${centreP.x + 15}" y="${centreP.y + 16}" class="gate-label" fill="#8800ff">(0.5,0.5,0.5)</text>\n`;

  // Draw all vertices with size/color based on contacts
  svg += '\n  <!-- Trigram Vertices -->\n';

  // Sort by contacts so higher contact vertices render on top
  const sortedTrigrams = Object.entries(TRIGRAMS).sort((a, b) => a[1].contacts - b[1].contacts);

  for (const [name, data] of sortedTrigrams) {
    const p = projected[name];
    const radius = getVertexRadius(data.contacts);
    const color = getVertexColor(data.contacts);
    const isAnchor = ['Heaven', 'Earth', 'Water'].includes(name);
    const isThunder = name === 'Thunder';

    // Vertex circle
    if (isThunder) {
      svg += `  <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${radius}" fill="${color}" stroke="#ff0000" stroke-width="3" filter="url(#thunderGlow)"/>\n`;
      svg += `  <text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1) + 4}" text-anchor="middle" class="symbol" fill="white">${data.symbol}</text>\n`;
    } else if (isAnchor) {
      svg += `  <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${radius}" fill="${color}" stroke="#ffd700" stroke-width="3"/>\n`;
      svg += `  <text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1) + 4}" text-anchor="middle" class="symbol" fill="white">${data.symbol}</text>\n`;
    } else {
      svg += `  <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${radius}" fill="${color}" stroke="#fff" stroke-width="2"/>\n`;
      svg += `  <text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1) + 4}" text-anchor="middle" class="symbol" fill="white">${data.symbol}</text>\n`;
    }

    // Vertex label
    const labelOffset = radius + 8;
    const labelY = p.y < 300 ? p.y - labelOffset : p.y + labelOffset + 10;
    svg += `  <text x="${p.x.toFixed(1)}" y="${labelY}" text-anchor="middle" class="vertex-label">${name}</text>\n`;
    svg += `  <text x="${p.x.toFixed(1)}" y="${labelY + 12}" text-anchor="middle" class="gate-label">(${data.binary}) · ${data.contacts}</text>\n`;
  }

  // Legend
  svg += '\n  <!-- Legend -->\n';
  const legendX = 30;
  const legendY = 550;

  svg += `  <rect x="${legendX - 10}" y="${legendY - 20}" width="220" height="130" fill="white" stroke="#ccc" rx="5"/>\n`;
  svg += `  <text x="${legendX}" y="${legendY}" class="legend-text" font-weight="bold">LEGEND</text>\n`;

  // Contact frequency
  svg += `  <circle cx="${legendX + 10}" cy="${legendY + 22}" r="10" fill="#4488ff"/>\n`;
  svg += `  <text x="${legendX + 30}" y="${legendY + 26}" class="legend-text">High contact (5-6)</text>\n`;

  svg += `  <circle cx="${legendX + 10}" cy="${legendY + 44}" r="8" fill="#44cc88"/>\n`;
  svg += `  <text x="${legendX + 30}" y="${legendY + 48}" class="legend-text">Medium contact (3)</text>\n`;

  svg += `  <circle cx="${legendX + 10}" cy="${legendY + 66}" r="6" fill="#888888"/>\n`;
  svg += `  <text x="${legendX + 30}" y="${legendY + 70}" class="legend-text">Low contact (1-2)</text>\n`;

  svg += `  <circle cx="${legendX + 10}" cy="${legendY + 88}" r="8" fill="#ff4444" filter="url(#thunderGlow)"/>\n`;
  svg += `  <text x="${legendX + 30}" y="${legendY + 92}" class="legend-text">Protected (Thunder = 0)</text>\n`;

  // Right side legend - structure types
  const legend2X = 550;
  const legend2Y = 550;

  svg += `  <rect x="${legend2X - 10}" y="${legend2Y - 20}" width="220" height="130" fill="white" stroke="#ccc" rx="5"/>\n`;
  svg += `  <text x="${legend2X}" y="${legend2Y}" class="legend-text" font-weight="bold">PENTA PATHWAY</text>\n`;

  svg += `  <line x1="${legend2X}" y1="${legend2Y + 20}" x2="${legend2X + 30}" y2="${legend2Y + 20}" stroke="url(#anchorGradient)" stroke-width="4"/>\n`;
  svg += `  <text x="${legend2X + 40}" y="${legend2Y + 24}" class="legend-text">Scalene anchor (1,√2,√3)</text>\n`;

  svg += `  <line x1="${legend2X}" y1="${legend2Y + 42}" x2="${legend2X + 30}" y2="${legend2Y + 42}" stroke="#4488ff" stroke-width="3"/>\n`;
  svg += `  <text x="${legend2X + 40}" y="${legend2Y + 46}" class="legend-text">Cube edges (5 gates)</text>\n`;

  svg += `  <line x1="${legend2X}" y1="${legend2Y + 64}" x2="${legend2X + 30}" y2="${legend2Y + 64}" stroke="#44cc88" stroke-width="2.5" stroke-dasharray="8,4"/>\n`;
  svg += `  <text x="${legend2X + 40}" y="${legend2Y + 68}" class="legend-text">Face diagonals (3 gates)</text>\n`;

  svg += `  <line x1="${legend2X}" y1="${legend2Y + 86}" x2="${legend2X + 30}" y2="${legend2Y + 86}" stroke="url(#gate31Gradient)" stroke-width="5"/>\n`;
  svg += `  <text x="${legend2X + 40}" y="${legend2Y + 90}" class="legend-text">Gate 31 through centre</text>\n`;

  // Footer
  svg += `\n  <text x="${width/2}" y="${height - 15}" text-anchor="middle" class="subtitle">Vertex size = contact frequency · Golden outline = anchor vertices · Red glow = protected trigram</text>\n`;

  svg += '</svg>';

  return svg;
}

// Generate and save
const svg = generateSVG();
const outputPath = path.join(__dirname, '../output/penta-pathway-cube.svg');

fs.writeFileSync(outputPath, svg);
console.log(`Visualization saved to: ${outputPath}`);
console.log();
console.log('Features shown:');
console.log('  - Scalene anchor triangle (Heaven-Earth-Water) with √1, √2, √3 sides');
console.log('  - Vertex size proportional to Penta contact frequency');
console.log('  - Thunder (red glow) = 0 contacts, protected from extraction');
console.log('  - Gate 31 space diagonal passing through exact cube centre');
console.log('  - Penta edges (blue) and face diagonals (green dashed)');
