/**
 * Extract geometry details from hexagrams SVG
 * to determine the formulas for rebuilding
 */

const fs = require('fs');
const positioning = require('../core/root-system/positioning-algorithm');

const svg = fs.readFileSync('./SVGS/the-64-hexagrams-verified-master.svg', 'utf-8');

// Extract rotations for each gate
// Look for patterns like: GATE_-_13_-_CAA ... rotate(-47.5316)
const results = [];

for (let gate = 1; gate <= 64; gate++) {
  // Find this gate's section
  const gatePattern = new RegExp(`GATE_-_${gate}[_-]+[ACGU]{3}[\\s\\S]*?rotate\\((-?[\\d.]+)\\)`, 'm');
  const match = gatePattern.exec(svg);

  if (match) {
    const rotation = parseFloat(match[1]);
    const v3Data = positioning.getDockingData(gate, 1);
    const offset = -rotation - v3Data.angle;

    results.push({
      gate,
      v3Angle: v3Data.angle,
      svgRotation: rotation,
      offset: offset
    });
  }
}

console.log('Gate | V3 Angle | SVG Rotation | Offset');
console.log('-----|----------|--------------|--------');
results.slice(0, 16).forEach(r => {
  console.log(
    r.gate.toString().padStart(4), '|',
    r.v3Angle.toFixed(2).padStart(8), '|',
    r.svgRotation.toFixed(2).padStart(12), '|',
    r.offset.toFixed(2).padStart(7)
  );
});

console.log('');
console.log('Total gates found:', results.length);

// Calculate average offset
const avgOffset = results.reduce((sum, r) => sum + r.offset, 0) / results.length;
console.log('Average offset:', avgOffset.toFixed(4) + '°');

// Check standard deviation
const variance = results.reduce((sum, r) => sum + Math.pow(r.offset - avgOffset, 2), 0) / results.length;
const stdDev = Math.sqrt(variance);
console.log('Std deviation:', stdDev.toFixed(4) + '°');

// The offset should be consistent if formula is: svgRotation = -(v3Angle + offset)
console.log('');
console.log('Formula hypothesis: svgRotation = -(v3Angle + ' + avgOffset.toFixed(2) + ')');
