/**
 * Extract and normalize planet symbols from the master SVG
 * Takes symbols from horizontal gates (6, 46, 47) where rotation is minimal
 */

const fs = require('fs');
const path = require('path');

const masterSvg = fs.readFileSync(
  path.join(__dirname, '../SVGS/OUTER-384-LINES-REVERSED.svg'),
  'utf8'
);

// Planet names we need
const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];

// Extract path data for each planet
const extractedPaths = {};

planets.forEach(planet => {
  // Match pattern for planet paths (from detriments or exalteds)
  const regex = new RegExp(`id="_\\d-${planet}[^"]*"[^>]*d="([^"]+)"`, 'i');
  const match = masterSvg.match(regex);

  if (match) {
    extractedPaths[planet] = {
      rawPath: match[1],
      fullMatch: match[0]
    };
  } else {
    console.log(`Could not find path for ${planet}`);
  }
});

// Parse a path to extract all coordinate pairs
function parsePathCoordinates(d) {
  const coords = [];
  // Match all numbers (including decimals and negatives)
  const numbers = d.match(/-?\d+\.?\d*/g);
  if (numbers) {
    for (let i = 0; i < numbers.length; i += 2) {
      if (numbers[i + 1] !== undefined) {
        coords.push({
          x: parseFloat(numbers[i]),
          y: parseFloat(numbers[i + 1])
        });
      }
    }
  }
  return coords;
}

// Calculate bounding box
function getBoundingBox(d) {
  const coords = parsePathCoordinates(d);
  if (coords.length === 0) return null;

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  coords.forEach(c => {
    minX = Math.min(minX, c.x);
    maxX = Math.max(maxX, c.x);
    minY = Math.min(minY, c.y);
    maxY = Math.max(maxY, c.y);
  });

  return {
    minX, maxX, minY, maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2
  };
}

// Output results
console.log('Extracted planet paths:\n');

Object.entries(extractedPaths).forEach(([planet, data]) => {
  const bbox = getBoundingBox(data.rawPath);
  console.log(`${planet}:`);
  console.log(`  Bounding box: ${bbox ? `${bbox.width.toFixed(1)} x ${bbox.height.toFixed(1)}` : 'unknown'}`);
  console.log(`  Center: ${bbox ? `(${bbox.centerX.toFixed(1)}, ${bbox.centerY.toFixed(1)})` : 'unknown'}`);
  console.log(`  Path (first 100 chars): ${data.rawPath.substring(0, 100)}...`);
  console.log('');
});

// Generate normalized paths (centered at origin)
console.log('\n=== NORMALIZED PATHS (for use in generator) ===\n');

const normalizedPaths = {};

Object.entries(extractedPaths).forEach(([planet, data]) => {
  const bbox = getBoundingBox(data.rawPath);
  if (bbox) {
    // Note: These paths have transform="translate(-664.1466 -664.1466)" in the SVG
    // So actual center is bbox.center - 664.1466
    const actualCenterX = bbox.centerX - 664.1466;
    const actualCenterY = bbox.centerY - 664.1466;

    console.log(`  ${planet}: center at (${actualCenterX.toFixed(1)}, ${actualCenterY.toFixed(1)}), size ${bbox.width.toFixed(1)} x ${bbox.height.toFixed(1)}`);

    normalizedPaths[planet] = {
      centerX: actualCenterX,
      centerY: actualCenterY,
      width: bbox.width,
      height: bbox.height,
      rawPath: data.rawPath
    };
  }
});

// Save the extracted data
fs.writeFileSync(
  path.join(__dirname, '../visualization/generators/planet-paths-extracted.json'),
  JSON.stringify(normalizedPaths, null, 2)
);

console.log('\nSaved to planet-paths-extracted.json');
