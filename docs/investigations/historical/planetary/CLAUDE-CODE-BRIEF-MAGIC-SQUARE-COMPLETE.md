# CLAUDE CODE BRIEF: Complete Magic Square Analysis

## Mission

Execute a comprehensive test battery covering ALL untested structural elements of the Lunar Planetary Magic Square. This builds on validated findings and tests Ra Uru Hu's explicit teachings about Moon-Node connections, Laterals, Diamond/Diagonal structures, and Centre interactions.

---

# PART I: CONTEXT AND VALIDATED FINDINGS

## The Magic Square Layout

```
┌────────┬────────┬────────┐
│  Moon  │ Uranus │Mercury │  ← Row 1: Mind Lateral
├────────┼────────┼────────┤
│ Venus  │  MARS  │Neptune │  ← Row 2: Body Lateral
├────────┼────────┼────────┤
│ Saturn │Jupiter │ Pluto  │  ← Row 3: Spirit Lateral
└────────┴────────┴────────┘
   Col1     Col2     Col3
   Alpha    Beta    Gamma
```

## Already Validated (Do Not Re-Test)

| Finding | Statistic | Result |
|---------|-----------|--------|
| **Vertical Character** | χ²=65.99 | Alpha E/D=1.35, Beta E/D=0.49, Gamma E/D=1.44 |
| **Vertical × Color** | χ²=81.66 | Alpha→C3-4, Gamma→C5-6, Beta weak everywhere |
| **Position Affinities** | Mapped | Wind(-1)→Moon best/Mars worst, Thunder(+1)→Saturn/Uranus |
| **Standing Waves** | 100% | 8 gates show perfect trigram complementarity |

## Key Definitions

```javascript
// VERTICALS (Columns) - VALIDATED
const ALPHA = ['Moon', 'Venus', 'Saturn'];      // E/D = 1.35
const BETA = ['Uranus', 'Mars', 'Jupiter'];     // E/D = 0.49
const GAMMA = ['Mercury', 'Neptune', 'Pluto'];  // E/D = 1.44

// LATERALS (Rows) - TO TEST
const MIND_LATERAL = ['Moon', 'Uranus', 'Mercury'];    // Row 1
const BODY_LATERAL = ['Venus', 'Mars', 'Neptune'];     // Row 2
const SPIRIT_LATERAL = ['Saturn', 'Jupiter', 'Pluto']; // Row 3

// DIAMOND (Corners) - TO TEST
const DIAMOND = ['Mercury', 'Neptune', 'Jupiter', 'Venus'];

// DIAGONALS - TO TEST
const MAIN_DIAGONAL = ['Moon', 'Mars', 'Pluto'];
const ANTI_DIAGONAL = ['Mercury', 'Mars', 'Saturn'];
const ALL_DIAGONAL = ['Moon', 'Mars', 'Pluto', 'Mercury', 'Saturn']; // Union

// CENTRES
const BRAIN_GATES = [64, 61, 63, 47, 24, 4, 17, 43, 11]; // Head + Ajna
const HEAD_GATES = [64, 61, 63];
const AJNA_GATES = [47, 24, 4, 17, 43, 11];
const THROAT_GATES = [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16];
const G_GATES = [7, 1, 13, 25, 46, 2, 15, 10];
const HEART_GATES = [26, 51, 21, 40];
const SPLEEN_GATES = [48, 57, 44, 50, 32, 28, 18];
const SACRAL_GATES = [5, 14, 29, 59, 9, 3, 42, 27, 34];
const ROOT_GATES = [53, 60, 52, 19, 39, 41, 58, 38, 54];
const ESP_GATES = [36, 22, 37, 6, 49, 55, 30]; // Emotional Solar Plexus

// COLOR BANDS (60° each, for refined tests)
// Color 1: 0°-60°, Color 2: 60°-120°, etc.
// Alpha favours Colors 3-4 (120°-240°)
// Gamma favours Colors 5-6 (240°-360°)
```

---

# PART II: RA'S EXPLICIT TEACHINGS TO TEST

## Moon-Node Connection

Ra states explicitly:

> **"The essential relationship is going to be there between only the South Node and the Moon... It does not have anything to do with the North Node."**

> **"Only the design South Node is directly connected to what is the brain system."**

> **"The Moon is a coordinator... it aligns the range to the perspective."**

### Testable Predictions:
1. Moon should show elevated E/D in Brain gates (Head + Ajna)
2. This effect should be STRONGEST at Colors 3-4 (Alpha territory)

## Laterals

Ra teaches the three rows respond to different domains:

> **"The Mind Lateral always responds to the mental playing of the other."**

> **"The Body Lateral responds to body language information visually."**

> **"The Spirit Lateral responds to the spirit of others."**

### Testable Predictions:
1. Mind Lateral may show distinct pattern in Head/Ajna gates
2. Body Lateral may show distinct pattern in Root/Sacral/Spleen gates
3. Spirit Lateral may show distinct pattern in G/Heart/Throat gates

## Diamond vs Diagonal

Ra explicitly distinguishes:

> **"The diamond is related to the way in which we operate on the mundane plane."**

> **"Mars rules the diagonals."**

### Testable Predictions:
1. Diamond planets should differ from Diagonal planets in E/D ratio
2. Mars-ruled Diagonal should show higher detriment (Mars E/D = 0.31 validates this)

---

# PART III: TEST SPECIFICATIONS

## Test 1: Lateral E/D Character (L1)

**Hypothesis:** The three rows show distinct E/D patterns independent of Verticals.

```javascript
function testLateralCharacter(exaltationData) {
  const laterals = {
    mind: { planets: ['Moon', 'Uranus', 'Mercury'], E: 0, D: 0 },
    body: { planets: ['Venus', 'Mars', 'Neptune'], E: 0, D: 0 },
    spirit: { planets: ['Saturn', 'Jupiter', 'Pluto'], E: 0, D: 0 }
  };
  
  for (const line of exaltationData) {
    for (const [name, lateral] of Object.entries(laterals)) {
      if (lateral.planets.includes(line.exaltPlanet)) lateral.E++;
      if (lateral.planets.includes(line.detrimentPlanet)) lateral.D++;
    }
  }
  
  // Calculate E/D ratios
  for (const lateral of Object.values(laterals)) {
    lateral.ratio = lateral.E / (lateral.D || 1);
  }
  
  // Chi-square for 3×2 contingency table (Lateral × E/D)
  const observed = [
    [laterals.mind.E, laterals.mind.D],
    [laterals.body.E, laterals.body.D],
    [laterals.spirit.E, laterals.spirit.D]
  ];
  
  const chiSquare = calculateChiSquare3x2(observed);
  
  return { laterals, chiSquare, significant: chiSquare > 5.99 }; // df=2, p<0.05
}
```

**Success Criterion:** χ² > 5.99 (p < 0.05, df=2)

---

## Test 2: Diamond vs Diagonal (D1)

**Hypothesis:** Diamond and Diagonal planet groups show different E/D patterns.

```javascript
function testDiamondDiagonal(exaltationData) {
  const diamond = { planets: ['Mercury', 'Neptune', 'Jupiter', 'Venus'], E: 0, D: 0 };
  const diagonal = { planets: ['Moon', 'Mars', 'Pluto', 'Saturn'], E: 0, D: 0 };
  
  for (const line of exaltationData) {
    // Diamond
    if (diamond.planets.includes(line.exaltPlanet)) diamond.E++;
    if (diamond.planets.includes(line.detrimentPlanet)) diamond.D++;
    
    // Diagonal
    if (diagonal.planets.includes(line.exaltPlanet)) diagonal.E++;
    if (diagonal.planets.includes(line.detrimentPlanet)) diagonal.D++;
  }
  
  diamond.ratio = diamond.E / (diamond.D || 1);
  diagonal.ratio = diagonal.E / (diagonal.D || 1);
  
  // Chi-square for 2×2 contingency table
  const observed = [
    [diamond.E, diamond.D],
    [diagonal.E, diagonal.D]
  ];
  
  const chiSquare = calculateChiSquare2x2(observed);
  
  return { diamond, diagonal, chiSquare, significant: chiSquare > 3.84 }; // df=1, p<0.05
}
```

**Success Criterion:** χ² > 3.84 (p < 0.05, df=1)

---

## Test 3: Two Diagonals (D2)

**Hypothesis:** Main diagonal differs from anti-diagonal.

```javascript
function testTwoDiagonals(exaltationData) {
  const mainDiag = { planets: ['Moon', 'Mars', 'Pluto'], E: 0, D: 0 };
  const antiDiag = { planets: ['Mercury', 'Mars', 'Saturn'], E: 0, D: 0 };
  
  // Note: Mars appears in BOTH - count it in both
  
  for (const line of exaltationData) {
    if (mainDiag.planets.includes(line.exaltPlanet)) mainDiag.E++;
    if (mainDiag.planets.includes(line.detrimentPlanet)) mainDiag.D++;
    if (antiDiag.planets.includes(line.exaltPlanet)) antiDiag.E++;
    if (antiDiag.planets.includes(line.detrimentPlanet)) antiDiag.D++;
  }
  
  mainDiag.ratio = mainDiag.E / (mainDiag.D || 1);
  antiDiag.ratio = antiDiag.E / (antiDiag.D || 1);
  
  // Note: Saturn (E/D=2.57) is on anti-diagonal, Pluto on main
  // This should create asymmetry
  
  return { mainDiag, antiDiag };
}
```

**Expected:** Anti-diagonal should show higher E/D due to Saturn's presence.

---

## Test 4: Moon-Brain Connection (BS1)

**Hypothesis:** Moon shows elevated exaltation in Brain gates (Head + Ajna).

```javascript
function testMoonBrain(exaltationData) {
  const BRAIN_GATES = [64, 61, 63, 47, 24, 4, 17, 43, 11];
  
  const brainLines = exaltationData.filter(l => BRAIN_GATES.includes(l.gate));
  const nonBrainLines = exaltationData.filter(l => !BRAIN_GATES.includes(l.gate));
  
  const moonBrain = {
    E: brainLines.filter(l => l.exaltPlanet === 'Moon').length,
    D: brainLines.filter(l => l.detrimentPlanet === 'Moon').length
  };
  
  const moonNonBrain = {
    E: nonBrainLines.filter(l => l.exaltPlanet === 'Moon').length,
    D: nonBrainLines.filter(l => l.detrimentPlanet === 'Moon').length
  };
  
  moonBrain.ratio = moonBrain.E / (moonBrain.D || 1);
  moonNonBrain.ratio = moonNonBrain.E / (moonNonBrain.D || 1);
  
  // Chi-square for Moon × Brain independence
  const observed = [
    [moonBrain.E, moonBrain.D],
    [moonNonBrain.E, moonNonBrain.D]
  ];
  
  const chiSquare = calculateChiSquare2x2(observed);
  
  return { 
    moonBrain, 
    moonNonBrain, 
    chiSquare, 
    significant: chiSquare > 3.84,
    effectSize: moonBrain.ratio / moonNonBrain.ratio  // >1.3 = meaningful
  };
}
```

**Success Criterion:** χ² > 3.84 AND effect size > 1.3

---

## Test 5: Moon-Brain at Alpha Colors (BS1a - Refined)

**Hypothesis:** Moon shows MAXIMUM exaltation in Brain gates at Colors 3-4.

```javascript
function testMoonBrainAlphaColors(exaltationData, gateColorMap) {
  const BRAIN_GATES = [64, 61, 63, 47, 24, 4, 17, 43, 11];
  const ALPHA_COLORS = [3, 4]; // Alpha territory
  
  // Get Brain lines at Alpha Colors
  const brainAlphaLines = exaltationData.filter(l => 
    BRAIN_GATES.includes(l.gate) && 
    ALPHA_COLORS.includes(gateColorMap[l.gate])
  );
  
  const brainOtherLines = exaltationData.filter(l =>
    BRAIN_GATES.includes(l.gate) &&
    !ALPHA_COLORS.includes(gateColorMap[l.gate])
  );
  
  const moonBrainAlpha = {
    E: brainAlphaLines.filter(l => l.exaltPlanet === 'Moon').length,
    D: brainAlphaLines.filter(l => l.detrimentPlanet === 'Moon').length
  };
  
  const moonBrainOther = {
    E: brainOtherLines.filter(l => l.exaltPlanet === 'Moon').length,
    D: brainOtherLines.filter(l => l.detrimentPlanet === 'Moon').length
  };
  
  return { moonBrainAlpha, moonBrainOther };
}
```

**Expected:** If double-alignment matters, Moon should peak in Brain + Alpha Colors.

---

## Test 6: Lateral × Centre Interaction (L2)

**Hypothesis:** Laterals show enhanced effect in their "domain" centres.

```javascript
function testLateralCentreInteraction(exaltationData) {
  const mappings = {
    mind: {
      planets: ['Moon', 'Uranus', 'Mercury'],
      centres: [64, 61, 63, 47, 24, 4, 17, 43, 11] // Head + Ajna
    },
    body: {
      planets: ['Venus', 'Mars', 'Neptune'],
      centres: [53, 60, 52, 19, 39, 41, 58, 38, 54, 5, 14, 29, 59, 9, 3, 42, 27, 34, 48, 57, 44, 50, 32, 28, 18] // Root + Sacral + Spleen
    },
    spirit: {
      planets: ['Saturn', 'Jupiter', 'Pluto'],
      centres: [7, 1, 13, 25, 46, 2, 15, 10, 26, 51, 21, 40, 62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16] // G + Heart + Throat
    }
  };
  
  const results = {};
  
  for (const [lateral, config] of Object.entries(mappings)) {
    const domainLines = exaltationData.filter(l => config.centres.includes(l.gate));
    const otherLines = exaltationData.filter(l => !config.centres.includes(l.gate));
    
    const inDomain = {
      E: domainLines.filter(l => config.planets.includes(l.exaltPlanet)).length,
      D: domainLines.filter(l => config.planets.includes(l.detrimentPlanet)).length
    };
    
    const outDomain = {
      E: otherLines.filter(l => config.planets.includes(l.exaltPlanet)).length,
      D: otherLines.filter(l => config.planets.includes(l.detrimentPlanet)).length
    };
    
    inDomain.ratio = inDomain.E / (inDomain.D || 1);
    outDomain.ratio = outDomain.E / (outDomain.D || 1);
    
    results[lateral] = { inDomain, outDomain, interaction: inDomain.ratio / outDomain.ratio };
  }
  
  return results;
}
```

**Success Criterion:** Interaction ratio > 1.3 indicates lateral-domain alignment.

---

## Test 7: Line 1/6 Nodal Axis (LN1)

**Hypothesis:** Lines 1 and 6 (hypothesised Nodal axis) show distinct Moon pattern.

```javascript
function testNodalAxisLines(exaltationData) {
  const line1 = exaltationData.filter(l => l.line === 1);
  const line6 = exaltationData.filter(l => l.line === 6);
  const otherLines = exaltationData.filter(l => l.line !== 1 && l.line !== 6);
  
  const moonLine1 = {
    E: line1.filter(l => l.exaltPlanet === 'Moon').length,
    D: line1.filter(l => l.detrimentPlanet === 'Moon').length
  };
  
  const moonLine6 = {
    E: line6.filter(l => l.exaltPlanet === 'Moon').length,
    D: line6.filter(l => l.detrimentPlanet === 'Moon').length
  };
  
  const moonOther = {
    E: otherLines.filter(l => l.exaltPlanet === 'Moon').length,
    D: otherLines.filter(l => l.detrimentPlanet === 'Moon').length
  };
  
  moonLine1.ratio = moonLine1.E / (moonLine1.D || 1);
  moonLine6.ratio = moonLine6.E / (moonLine6.D || 1);
  moonOther.ratio = moonOther.E / (moonOther.D || 1);
  
  // Combined Line 1+6 (Nodal axis)
  const moonNodalAxis = {
    E: moonLine1.E + moonLine6.E,
    D: moonLine1.D + moonLine6.D
  };
  moonNodalAxis.ratio = moonNodalAxis.E / (moonNodalAxis.D || 1);
  
  return { moonLine1, moonLine6, moonOther, moonNodalAxis };
}
```

**Expected:** If Nodes map to Lines 1-6 axis, Moon should show elevated pattern there.

---

## Test 8: Centre × Vertical (C1)

**Hypothesis:** Vertical character varies by Centre type.

```javascript
function testCentreVertical(exaltationData) {
  const centres = {
    brain: [64, 61, 63, 47, 24, 4, 17, 43, 11],
    throat: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16],
    g: [7, 1, 13, 25, 46, 2, 15, 10],
    heart: [26, 51, 21, 40],
    spleen: [48, 57, 44, 50, 32, 28, 18],
    sacral: [5, 14, 29, 59, 9, 3, 42, 27, 34],
    root: [53, 60, 52, 19, 39, 41, 58, 38, 54],
    esp: [36, 22, 37, 6, 49, 55, 30]
  };
  
  const verticals = {
    alpha: ['Moon', 'Venus', 'Saturn'],
    beta: ['Uranus', 'Mars', 'Jupiter'],
    gamma: ['Mercury', 'Neptune', 'Pluto']
  };
  
  const results = {};
  
  for (const [centreName, gates] of Object.entries(centres)) {
    const centreLines = exaltationData.filter(l => gates.includes(l.gate));
    results[centreName] = {};
    
    for (const [vertName, planets] of Object.entries(verticals)) {
      const E = centreLines.filter(l => planets.includes(l.exaltPlanet)).length;
      const D = centreLines.filter(l => planets.includes(l.detrimentPlanet)).length;
      results[centreName][vertName] = { E, D, ratio: E / (D || 1) };
    }
  }
  
  return results;
}
```

**Expected:** If Moon-Brain connection is structural, Alpha should dominate Brain centres.

---

# PART IV: DATA REQUIREMENTS

## Primary Data Source

Use the Rave I Ching exaltation database (384 lines × 2 assignments = 768 data points).

Required fields per line:
- `gate`: 1-64
- `line`: 1-6
- `exaltPlanet`: Sun, Earth, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, North Node, South Node
- `detrimentPlanet`: Same options

## Gate → Color Mapping

Calculate Color band from gate's wheel position:
- Color 1: Gates at 0°-60°
- Color 2: Gates at 60°-120°
- Color 3: Gates at 120°-180°
- Color 4: Gates at 180°-240°
- Color 5: Gates at 240°-300°
- Color 6: Gates at 300°-360°

Use the standard Rave Mandala wheel sequence.

---

# PART V: OUTPUT REQUIREMENTS

## Reports to Generate

```
/docs/research/planetary/magic-square-complete/
├── LATERAL-ANALYSIS.md
│   ├── Test L1: Lateral E/D character
│   ├── Test L2: Lateral × Centre interaction
│   └── Chi-square results and interpretation
│
├── DIAMOND-DIAGONAL-ANALYSIS.md
│   ├── Test D1: Diamond vs Diagonal E/D
│   ├── Test D2: Main vs Anti diagonal
│   └── Comparison to Vertical results
│
├── MOON-NODE-ANALYSIS.md
│   ├── Test BS1: Moon-Brain connection
│   ├── Test BS1a: Moon-Brain at Alpha Colors
│   ├── Test LN1: Line 1/6 Nodal axis
│   └── Ra's teaching validation status
│
├── CENTRE-VERTICAL-ANALYSIS.md
│   ├── Test C1: Centre × Vertical matrix
│   ├── Heatmap of E/D ratios by Centre × Vertical
│   └── Brain centre special analysis
│
└── COMPLETE-SYNTHESIS.md
    ├── All test results summary
    ├── Comparison table (Validated vs NULL)
    ├── Updated derivation architecture
    └── Recommendations for DERIVATION-STATUS-MAP
```

## Update DERIVATION-STATUS-MAP

After tests, add:

```markdown
### Magic Square Complete Analysis (v3.4)

**Previously Validated:**
- Vertical Character: χ²=65.99 (Alpha/Gamma exalt, Beta detriment)
- Vertical × Color: χ²=81.66 (Alpha→C3-4, Gamma→C5-6)

**New Results:**
| Test | Structure | χ² | p-value | Result |
|------|-----------|-----|---------|--------|
| L1 | Laterals | [X] | [X] | [VALIDATED/NULL] |
| D1 | Diamond vs Diagonal | [X] | [X] | [VALIDATED/NULL] |
| D2 | Two Diagonals | [X] | [X] | [VALIDATED/NULL] |
| BS1 | Moon-Brain | [X] | [X] | [VALIDATED/NULL] |
| BS1a | Moon-Brain @ Alpha Colors | [X] | [X] | [VALIDATED/NULL] |
| L2 | Lateral × Centre | [X] | [X] | [VALIDATED/NULL] |
| LN1 | Line 1/6 Nodal Axis | [X] | [X] | [VALIDATED/NULL] |
| C1 | Centre × Vertical | [X] | [X] | [VALIDATED/NULL] |

**Derivation Boundary:** [UPDATED %]
```

---

# PART VI: STATISTICAL METHODS

## Chi-Square Calculations

```javascript
function calculateChiSquare2x2(observed) {
  // observed = [[a, b], [c, d]]
  const a = observed[0][0], b = observed[0][1];
  const c = observed[1][0], d = observed[1][1];
  const n = a + b + c + d;
  
  const expected = [
    [(a+b)*(a+c)/n, (a+b)*(b+d)/n],
    [(c+d)*(a+c)/n, (c+d)*(b+d)/n]
  ];
  
  let chiSq = 0;
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      chiSq += Math.pow(observed[i][j] - expected[i][j], 2) / expected[i][j];
    }
  }
  
  return chiSq; // df=1, critical value = 3.84 for p<0.05
}

function calculateChiSquare3x2(observed) {
  // observed = [[a, b], [c, d], [e, f]] for 3 rows × 2 cols
  const rowTotals = observed.map(row => row[0] + row[1]);
  const colTotals = [
    observed.reduce((sum, row) => sum + row[0], 0),
    observed.reduce((sum, row) => sum + row[1], 0)
  ];
  const n = colTotals[0] + colTotals[1];
  
  let chiSq = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      const expected = rowTotals[i] * colTotals[j] / n;
      chiSq += Math.pow(observed[i][j] - expected, 2) / expected;
    }
  }
  
  return chiSq; // df=2, critical value = 5.99 for p<0.05
}
```

## Effect Size

For practical significance, require:
- E/D ratio difference > 30% (effect size > 1.3)
- Chi-square must also be significant

---

# PART VII: INTERPRETATION GUIDELINES

## If Laterals Show Signal (χ² > 5.99)

This would reveal that the Magic Square has TWO orthogonal structural dimensions:
- **Verticals** = Internal processing character
- **Laterals** = External response character

The interaction of both might explain more than Verticals alone.

## If Moon-Brain Shows Signal (χ² > 3.84)

This would validate Ra's explicit teaching about the Moon-South Node-Brain connection being structurally encoded, not just functional.

Update derivation map to include Moon-Brain as proven element.

## If Diamond vs Diagonal Shows Signal

This would validate Ra's distinction between "mundane plane" (Diamond) and "transformation" (Diagonal) as structural rather than just thematic.

## If All Tests Show NULL

This would confirm:
1. Vertical is the ONLY structural dimension of the Magic Square
2. Laterals, Diamond, Diagonal operate on RESONANCE (activation), not ASSIGNMENT
3. Moon-Node coordination is functional, not encoded in assignments
4. The ~40% derivation boundary is genuine

---

# PART VIII: FILES LOCATION

## Input Files

```
/Volumes/CLAUDE/HD-Knowledge-Engine-V3/
├── data/
│   └── rave-iching-exaltations.json (or similar)
├── scripts/
│   └── line-color-planetary-analysis.js (reference for wheel sequence)
└── docs/
    └── DERIVATION-STATUS-MAP.md (v3.3)
```

## Output Location

```
/Volumes/CLAUDE/HD-Knowledge-Engine-V3/
├── scripts/
│   └── magic-square-complete-analysis.js
├── docs/research/planetary/magic-square-complete/
│   ├── LATERAL-ANALYSIS.md
│   ├── DIAMOND-DIAGONAL-ANALYSIS.md
│   ├── MOON-NODE-ANALYSIS.md
│   ├── CENTRE-VERTICAL-ANALYSIS.md
│   └── COMPLETE-SYNTHESIS.md
└── docs/
    └── DERIVATION-STATUS-MAP.md (update to v3.4)
```

---

# PART IX: SUCCESS CRITERIA SUMMARY

| Test | Hypothesis | χ² Threshold | Effect Size |
|------|------------|--------------|-------------|
| L1 | Laterals differ | > 5.99 (df=2) | N/A |
| L2 | Lateral × Centre | > 3.84 per test | > 1.3 |
| D1 | Diamond ≠ Diagonal | > 3.84 (df=1) | > 1.3 |
| D2 | Main ≠ Anti diag | > 3.84 (df=1) | > 1.3 |
| BS1 | Moon-Brain | > 3.84 (df=1) | > 1.3 |
| BS1a | Moon-Brain-Alpha | > 3.84 (df=1) | > 1.3 |
| LN1 | Moon Line 1/6 | > 3.84 (df=1) | > 1.3 |
| C1 | Centre × Vertical | > 9.49 (df=4) | Heatmap |

---

**END OF BRIEF**

*This comprehensive test battery completes the Magic Square analysis. Execute all tests and report findings. Update DERIVATION-STATUS-MAP based on results.*
