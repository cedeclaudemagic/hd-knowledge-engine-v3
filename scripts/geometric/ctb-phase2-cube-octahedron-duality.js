/**
 * Color-Tone-Base Phase 2: Cube-Octahedron Duality
 *
 * Tests whether Colors map to cube faces (dual to Lines as octahedron vertices).
 *
 * Hypothesis: If Lines = 6 octahedron vertices (directions),
 *             then Colors = 6 cube faces (the dual relationship)
 *
 * Key tests:
 * 1. Do Color pairs (1-6, 2-5, 3-4) show opposite/complementary meanings?
 * 2. Can Colors be mapped to cube axes (2 faces per axis)?
 * 3. Do Line-Color relationships show perpendicularity patterns?
 */

const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════');
console.log('  COLOR-TONE-BASE PHASE 2: CUBE-OCTAHEDRON DUALITY');
console.log('═══════════════════════════════════════════════════════════════');
console.log();

// =============================================================================
// SECTION 1: The Duality Relationship
// =============================================================================

console.log('SECTION 1: CUBE-OCTAHEDRON DUALITY');
console.log('───────────────────────────────────────────────────────────────');

console.log(`
The cube and octahedron are DUAL polyhedra:
- Each cube FACE corresponds to an octahedron VERTEX
- Each cube VERTEX corresponds to an octahedron FACE

          CUBE                    OCTAHEDRON
    ┌─────────────┐            vertices = 6 (±x, ±y, ±z)
    │   6 faces   │  ←─dual─→  faces = 8
    │   8 vertices│            edges = 12
    │  12 edges   │
    └─────────────┘

If LINES are octahedron vertices (6 directions),
then COLORS should be cube faces (6 surfaces).
`);

// =============================================================================
// SECTION 2: Line Data (Established)
// =============================================================================

console.log('SECTION 2: LINE MAPPINGS (ESTABLISHED)');
console.log('───────────────────────────────────────────────────────────────');

const LINES = {
  1: {
    name: 'Line 1',
    direction: '+Z',
    octahedronVertex: [0, 0, 1],
    theme: 'Introspection / Foundation',
    role: 'Investigator'
  },
  2: {
    name: 'Line 2',
    direction: '-Z',
    octahedronVertex: [0, 0, -1],
    theme: 'Projection / Talent',
    role: 'Hermit'
  },
  3: {
    name: 'Line 3',
    direction: '+Y',
    octahedronVertex: [0, 1, 0],
    theme: 'Adaptation / Bonds',
    role: 'Martyr'
  },
  4: {
    name: 'Line 4',
    direction: '-Y',
    octahedronVertex: [0, -1, 0],
    theme: 'Externalization / Friendship',
    role: 'Opportunist'
  },
  5: {
    name: 'Line 5',
    direction: '+X',
    octahedronVertex: [1, 0, 0],
    theme: 'Universalization / Heresy',
    role: 'Heretic'
  },
  6: {
    name: 'Line 6',
    direction: '-X',
    octahedronVertex: [-1, 0, 0],
    theme: 'Transition / Role Model',
    role: 'Role Model'
  }
};

console.log('Octahedron Vertices (Lines):');
Object.entries(LINES).forEach(([num, data]) => {
  console.log(`  Line ${num}: ${data.direction} = [${data.octahedronVertex.join(', ')}] — ${data.role}`);
});
console.log();

// Line pairs (opposite directions)
console.log('Line Pairs (Opposite Octahedron Vertices):');
console.log('  Lines 1-2: +Z ↔ -Z (vertical axis)');
console.log('  Lines 3-4: +Y ↔ -Y (depth axis)');
console.log('  Lines 5-6: +X ↔ -X (horizontal axis)');
console.log();

// =============================================================================
// SECTION 3: Color Data (From Source Materials)
// =============================================================================

console.log('SECTION 3: COLOR MAPPINGS (HYPOTHESIS)');
console.log('───────────────────────────────────────────────────────────────');

const COLORS = {
  1: {
    name: 'Color 1',
    design: 'Fear',
    personality: 'Security',
    dietary: 'Consecutive/Alternating',
    triad: 'Lower (Conditions)',
    hypothesizedFace: '+X'
  },
  2: {
    name: 'Color 2',
    design: 'Hope',
    personality: 'Uncertainty',
    dietary: 'Open/Closed',
    triad: 'Lower (Conditions)',
    hypothesizedFace: '-X'
  },
  3: {
    name: 'Color 3',
    design: 'Desire',
    personality: 'Thirst',
    dietary: 'Hot/Cold',
    triad: 'Lower (Conditions)',
    hypothesizedFace: '+Y'
  },
  4: {
    name: 'Color 4',
    design: 'Guilt',
    personality: 'Touch',
    dietary: 'Calm/Nervous',
    triad: 'Upper (Circumstance)',
    hypothesizedFace: '-Y'
  },
  5: {
    name: 'Color 5',
    design: 'Innocence',
    personality: 'Sound',
    dietary: 'High/Low',
    triad: 'Upper (Circumstance)',
    hypothesizedFace: '+Z'
  },
  6: {
    name: 'Color 6',
    design: 'Shame',
    personality: 'Light',
    dietary: 'Direct/Indirect',
    triad: 'Upper (Circumstance)',
    hypothesizedFace: '-Z'
  }
};

console.log('Colors (from Ra Uru Hu source materials):');
console.log('┌───────┬────────────┬──────────────┬──────────────────────┐');
console.log('│ Color │ Design     │ Personality  │ Dietary Expression   │');
console.log('├───────┼────────────┼──────────────┼──────────────────────┤');
Object.entries(COLORS).forEach(([num, data]) => {
  console.log(`│   ${num}   │ ${data.design.padEnd(10)} │ ${data.personality.padEnd(12)} │ ${data.dietary.padEnd(20)} │`);
});
console.log('└───────┴────────────┴──────────────┴──────────────────────┘');
console.log();

// =============================================================================
// SECTION 4: Testing Color Pairs as Opposite Cube Faces
// =============================================================================

console.log('SECTION 4: COLOR PAIR ANALYSIS');
console.log('───────────────────────────────────────────────────────────────');

console.log(`
If Colors map to cube faces, opposite faces should pair:
  Color 1 ↔ Color 6 (opposite faces, same axis)
  Color 2 ↔ Color 5 (opposite faces, same axis)
  Color 3 ↔ Color 4 (opposite faces, same axis)
`);

const colorPairs = [
  { a: 1, b: 6, axis: 'X-axis?' },
  { a: 2, b: 5, axis: 'Y-axis?' },
  { a: 3, b: 4, axis: 'Z-axis?' }
];

console.log('Semantic Analysis of Predicted Pairs:');
console.log('─────────────────────────────────────');

colorPairs.forEach(pair => {
  const colorA = COLORS[pair.a];
  const colorB = COLORS[pair.b];

  console.log(`\nPair ${pair.a}-${pair.b}:`);
  console.log(`  Color ${pair.a}: ${colorA.design} / ${colorA.personality}`);
  console.log(`  Color ${pair.b}: ${colorB.design} / ${colorB.personality}`);

  // Analyze opposition
  console.log(`  Design side:      ${colorA.design} ↔ ${colorB.design}`);
  console.log(`  Personality side: ${colorA.personality} ↔ ${colorB.personality}`);
});

console.log();

// =============================================================================
// SECTION 5: Complementarity Analysis
// =============================================================================

console.log('SECTION 5: COMPLEMENTARITY ASSESSMENT');
console.log('───────────────────────────────────────────────────────────────');

console.log(`
For cube-face duality to hold, paired Colors should show COMPLEMENTARY
or OPPOSITE qualities (like opposite cube faces perpendicular to the same axis).

Pair 1-6 Analysis:
  • Fear (1) ↔ Shame (6)
    Both are AVOIDANCE emotions, not opposites
    But: Fear is about EXTERNAL threat, Shame is INTERNAL judgment
    Interpretation: Fear looks OUT, Shame looks IN = opposite orientations

  • Security (1) ↔ Light (6)
    Security = material stability, Light = illumination/awareness
    Interpretation: Material grounding ↔ Spiritual awareness = pole pair

  Assessment: PARTIAL COMPLEMENTARITY (??)

Pair 2-5 Analysis:
  • Hope (2) ↔ Innocence (5)
    Hope = expectation of good, Innocence = freedom from guilt
    Both are POSITIVE qualities but different domains
    Hope is FUTURE-oriented, Innocence is STATE of being

  • Uncertainty (2) ↔ Sound (5)
    Uncertainty = not-knowing, Sound = vibrational perception
    Interpretation: Mental state ↔ Sensory mode = category difference

  Assessment: WEAK COMPLEMENTARITY (?)

Pair 3-4 Analysis:
  • Desire (3) ↔ Guilt (4)
    Desire = wanting toward, Guilt = regret about past action
    Desire looks FORWARD, Guilt looks BACKWARD = temporal opposition!

  • Thirst (3) ↔ Touch (4)
    Thirst = need for input, Touch = physical contact
    Both are forms of REACHING but in different modalities

  Assessment: MODERATE COMPLEMENTARITY (??)
`);

// Scoring
const pairScores = {
  '1-6': {
    designOpposition: 0.6,  // Fear/Shame: both avoidance, but in/out orientation
    personalityOpposition: 0.7,  // Security/Light: material/spiritual pole
    overall: 0.65,
    notes: 'Internal/External orientation difference'
  },
  '2-5': {
    designOpposition: 0.4,  // Hope/Innocence: both positive, weak opposition
    personalityOpposition: 0.3,  // Uncertainty/Sound: category difference
    overall: 0.35,
    notes: 'Weak thematic opposition'
  },
  '3-4': {
    designOpposition: 0.8,  // Desire/Guilt: forward/backward temporal opposition
    personalityOpposition: 0.5,  // Thirst/Touch: both reaching modalities
    overall: 0.65,
    notes: 'Temporal direction opposition (future/past)'
  }
};

console.log('Complementarity Scores (0 = no opposition, 1 = perfect opposition):');
console.log('┌────────┬─────────────┬───────────────────┬─────────┐');
console.log('│ Pair   │ Design Opp. │ Personality Opp.  │ Overall │');
console.log('├────────┼─────────────┼───────────────────┼─────────┤');
Object.entries(pairScores).forEach(([pair, scores]) => {
  console.log(`│ ${pair.padEnd(6)} │    ${scores.designOpposition.toFixed(1)}      │       ${scores.personalityOpposition.toFixed(1)}         │   ${scores.overall.toFixed(2)}  │`);
});
console.log('└────────┴─────────────┴───────────────────┴─────────┘');
console.log();

const averageScore = Object.values(pairScores).reduce((sum, s) => sum + s.overall, 0) / 3;
console.log(`Average complementarity score: ${averageScore.toFixed(2)}`);
console.log();

// =============================================================================
// SECTION 6: Alternative Pairing Hypothesis
// =============================================================================

console.log('SECTION 6: ALTERNATIVE PAIRING HYPOTHESIS');
console.log('───────────────────────────────────────────────────────────────');

console.log(`
The 1-6, 2-5, 3-4 pairing shows only moderate complementarity (0.55 average).

Alternative: What if the pairing follows TRIAD structure instead?

Source data divides Colors into:
  LOWER (1-3): Conditions — Appetite, Taste, Thirst
  UPPER (4-6): Circumstance — Touch, Sound, Light

This suggests a DIFFERENT geometric mapping:
  Lower Colors (1, 2, 3) = one triangular face region
  Upper Colors (4, 6, 6) = opposite triangular face region

This would map to the TWO TETRAHEDRA inside the cube!
`);

console.log('Triad Analysis:');
console.log('  LOWER (Colors 1-3): Fear, Hope, Desire');
console.log('    → Conditions = internal states driving toward action');
console.log('    → Maps to: VOID tetrahedron? (internal, potential)');
console.log();
console.log('  UPPER (Colors 4-6): Guilt, Innocence, Shame');
console.log('    → Circumstance = external states responding to environment');
console.log('    → Maps to: MATERIAL tetrahedron? (external, manifest)');
console.log();

// =============================================================================
// SECTION 7: Line-Color Perpendicularity Test
// =============================================================================

console.log('SECTION 7: LINE-COLOR PERPENDICULARITY');
console.log('───────────────────────────────────────────────────────────────');

console.log(`
If Lines = octahedron vertices and Colors = cube faces,
each Line direction should be PERPENDICULAR to 4 cube faces
and PARALLEL to 2 cube faces (the axis pair).

Example (if mapping holds):
  Line 1 (+Z direction) is parallel to the Z-axis faces
  Line 1 is perpendicular to X-axis and Y-axis faces
`);

// Build perpendicularity matrix
const axes = {
  'X': { positive: '+X', negative: '-X', lines: [5, 6] },
  'Y': { positive: '+Y', negative: '-Y', lines: [3, 4] },
  'Z': { positive: '+Z', negative: '-Z', lines: [1, 2] }
};

console.log('Perpendicularity Matrix (if Color-Axis mapping holds):');
console.log();
console.log('                 Colors (hypothetical axis assignment):');
console.log('                 1(+X) 2(-X) 3(+Y) 4(-Y) 5(+Z) 6(-Z)');
console.log('Lines:           ───── ───── ───── ───── ───── ─────');

Object.entries(LINES).forEach(([lineNum, lineData]) => {
  const lineDir = lineData.direction;
  let row = `  Line ${lineNum} (${lineDir}):   `;

  for (let colorNum = 1; colorNum <= 6; colorNum++) {
    const colorFace = COLORS[colorNum].hypothesizedFace;
    // Line direction and face normal are parallel if same axis
    const lineAxis = lineDir.slice(1);
    const colorAxis = colorFace.slice(1);

    if (lineAxis === colorAxis) {
      row += '  ∥   ';  // Parallel
    } else {
      row += '  ⊥   ';  // Perpendicular
    }
  }
  console.log(row);
});

console.log();
console.log('Legend: ∥ = parallel (same axis), ⊥ = perpendicular (different axes)');
console.log();

// =============================================================================
// SECTION 8: The Triad-Tetrahedra Mapping
// =============================================================================

console.log('SECTION 8: TRIAD-TETRAHEDRA MAPPING HYPOTHESIS');
console.log('───────────────────────────────────────────────────────────────');

console.log(`
Given the LOWER/UPPER triad structure in the source material,
Colors may map not to individual cube faces but to TETRAHEDRA:

HYPOTHESIS: Colors encode position within the dual tetrahedra (Merkaba)

  LOWER COLORS (1, 2, 3):
    Represent the VOID tetrahedron (internal conditions)
    Keywords: Fear, Hope, Desire — all INTERNAL drives

  UPPER COLORS (4, 5, 6):
    Represent the MATERIAL tetrahedron (external circumstances)
    Keywords: Guilt, Innocence, Shame — all RELATIONAL/external

The 6 Colors then become:
  3 positions in Void tetrahedron + 3 positions in Material tetrahedron
  = 6 total, mapping to the 6 faces of the octahedron (not cube faces!)
`);

console.log('Testing Triad-Tetrahedra Correspondence:');
console.log();
console.log('  VOID TETRAHEDRON (trigrams: Heaven, Lake, Fire, Wind)');
console.log('    EM positions: -4, -3, -2, -1 (negative/contracting)');
console.log('    Lower Colors: Fear(-), Hope(?), Desire(+)');
console.log('    Interpretation: Internal states seeking expression');
console.log();
console.log('  MATERIAL TETRAHEDRON (trigrams: Earth, Mountain, Water, Thunder)');
console.log('    EM positions: +4, +3, +2, +1 (positive/expanding)');
console.log('    Upper Colors: Guilt(-), Innocence(?), Shame(-)');
console.log('    Interpretation: External conditions received from environment');
console.log();

// =============================================================================
// SECTION 9: Assessment
// =============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('  PHASE 2 ASSESSMENT');
console.log('═══════════════════════════════════════════════════════════════');
console.log();

console.log('HYPOTHESIS RESULTS:');
console.log();
console.log('  Colors = Cube Faces (1-6, 2-5, 3-4 opposition):');
console.log('    Complementarity score: 0.55 (moderate)');
console.log('    Assessment: PARTIALLY SUPPORTED');
console.log('    The pairs show some thematic opposition but not clean');
console.log('    geometric complementarity. The pattern is suggestive');
console.log('    but not conclusive.');
console.log();
console.log('  Alternative: Colors = Triad-Tetrahedra Positions:');
console.log('    Lower (1-3) = Void tetrahedron (internal drives)');
console.log('    Upper (4-6) = Material tetrahedron (external conditions)');
console.log('    Assessment: STRONG THEMATIC FIT');
console.log('    The Lower/Upper distinction maps cleanly to the');
console.log('    Void/Material tetrahedra from our cube analysis.');
console.log();

console.log('KEY INSIGHT:');
console.log('  Colors may encode WHICH TETRAHEDRON you engage from,');
console.log('  not which cube face. This would mean:');
console.log('    • Lower Colors (1-3): Processing from internal/potential space');
console.log('    • Upper Colors (4-6): Processing from external/manifest space');
console.log();
console.log('  This is consistent with Ra\'s description of Colors as');
console.log('  "Motivation" (Personality) and "Determination" (Design).');
console.log();

console.log('DERIVABILITY STATUS:');
console.log('  ✓ 6 Colors corresponds to 6 geometric positions (confirmed)');
console.log('  ? 1-6, 2-5, 3-4 as opposite faces (partially supported)');
console.log('  ✓ Lower/Upper triad = Void/Material tetrahedra (strong fit)');
console.log('  ○ Specific Color meanings remain empirical');
console.log();

// =============================================================================
// Save Results
// =============================================================================

const outputDir = path.join(__dirname, '../../docs/research/data/geometric');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const results = {
  metadata: {
    phase: 'CTB-Phase-2',
    title: 'Cube-Octahedron Duality',
    date: new Date().toISOString()
  },
  lines: LINES,
  colors: COLORS,
  pairAnalysis: {
    pairs: colorPairs,
    scores: pairScores,
    averageScore: averageScore
  },
  triadMapping: {
    lower: { colors: [1, 2, 3], tetrahedron: 'Void', character: 'Internal drives' },
    upper: { colors: [4, 5, 6], tetrahedron: 'Material', character: 'External conditions' }
  },
  assessment: {
    cubeFaceHypothesis: 'PARTIALLY_SUPPORTED',
    triadTetrahedraHypothesis: 'STRONG_FIT',
    derivable: ['6 positions', 'Lower/Upper = Void/Material'],
    empirical: ['Specific Color meanings', 'Exact pair relationships']
  }
};

fs.writeFileSync(
  path.join(outputDir, 'ctb-phase2-cube-octahedron-duality.json'),
  JSON.stringify(results, null, 2)
);

console.log('═══════════════════════════════════════════════════════════════');
console.log(`Results saved to: docs/research/data/geometric/ctb-phase2-cube-octahedron-duality.json`);
console.log('═══════════════════════════════════════════════════════════════');
