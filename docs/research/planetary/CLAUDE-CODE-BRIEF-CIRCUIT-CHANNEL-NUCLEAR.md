# CLAUDE CODE BRIEF: Circuit, Channel & Hexagram Analysis

## Mission

Execute the final test battery to determine if Circuit membership, Channel partnerships, or Hexagram nuclear structure can push the derivation boundary beyond ~40%. This completes the planetary derivation investigation.

---

# PART I: CONTEXT

## Current Derivation Status (v3.4)

**Validated Structures:**
- Vertical Character: χ² = 65.99
- Lateral Character: χ² = 14.67  
- Vertical × Color: χ² = 81.66
- Centre × Vertical: 4.38× Alpha in Brain
- Lateral × Centre: 2.71× Mind→Brain

**Derivation Boundary:** ~40% geometric, ~60% transmission

**Question:** Can Circuit, Channel, or Nuclear structure explain additional variance?

---

# PART II: THE THREE TESTS

## Test 1: Circuit × Vertical (CV1)

### Hypothesis

The three Circuit types (Individual, Tribal, Collective) may show distinct Vertical preferences.

### Circuit Definitions

```javascript
// INDIVIDUAL CIRCUIT (Knowing + Centering)
const INDIVIDUAL_GATES = [
  // Knowing Circuit
  61, 24, 43, 23, 8, 1, 2, 14, 3, 60, 52, 9, 57, 20, 10, 34, 51, 25,
  // Centering Circuit  
  46, 29, 20, 57, 10, 34, 51, 25
];
// Note: Some gates appear in multiple sub-circuits - deduplicate

// TRIBAL CIRCUIT (Ego + Defense)
const TRIBAL_GATES = [
  // Ego Circuit
  45, 21, 26, 44, 32, 54, 19, 49, 37, 40,
  // Defense Circuit
  27, 50, 59, 6
];

// COLLECTIVE CIRCUIT (Understanding + Sensing)  
const COLLECTIVE_GATES = [
  // Understanding (Logic)
  63, 4, 17, 62, 23, 56, 31, 7, 15, 5, 9, 52, 39, 53, 60, 52, 58, 18, 48, 16,
  // Sensing (Abstract)
  64, 47, 11, 56, 33, 13, 30, 41, 35, 36, 22, 12, 45, 21, 26, 44, 32, 54
];
```

**Note:** Use the canonical circuit assignments from Human Design. Some gates belong to multiple circuits — handle appropriately.

### Test Procedure

```javascript
function testCircuitVertical(exaltationData, circuitMap) {
  const circuits = {
    individual: { gates: INDIVIDUAL_GATES, alpha: {E:0, D:0}, beta: {E:0, D:0}, gamma: {E:0, D:0} },
    tribal: { gates: TRIBAL_GATES, alpha: {E:0, D:0}, beta: {E:0, D:0}, gamma: {E:0, D:0} },
    collective: { gates: COLLECTIVE_GATES, alpha: {E:0, D:0}, beta: {E:0, D:0}, gamma: {E:0, D:0} }
  };
  
  const ALPHA = ['Moon', 'Venus', 'Saturn'];
  const BETA = ['Uranus', 'Mars', 'Jupiter'];
  const GAMMA = ['Mercury', 'Neptune', 'Pluto'];
  
  for (const line of exaltationData) {
    for (const [circuitName, circuit] of Object.entries(circuits)) {
      if (circuit.gates.includes(line.gate)) {
        // Count by Vertical
        if (ALPHA.includes(line.exaltPlanet)) circuit.alpha.E++;
        if (ALPHA.includes(line.detrimentPlanet)) circuit.alpha.D++;
        if (BETA.includes(line.exaltPlanet)) circuit.beta.E++;
        if (BETA.includes(line.detrimentPlanet)) circuit.beta.D++;
        if (GAMMA.includes(line.exaltPlanet)) circuit.gamma.E++;
        if (GAMMA.includes(line.detrimentPlanet)) circuit.gamma.D++;
      }
    }
  }
  
  // Calculate E/D ratios for each Circuit × Vertical combination
  for (const circuit of Object.values(circuits)) {
    circuit.alpha.ratio = circuit.alpha.E / (circuit.alpha.D || 1);
    circuit.beta.ratio = circuit.beta.E / (circuit.beta.D || 1);
    circuit.gamma.ratio = circuit.gamma.E / (circuit.gamma.D || 1);
  }
  
  // Chi-square for 3×3 contingency (Circuit × Vertical)
  // Test if distribution differs by circuit
  
  return circuits;
}
```

### Predictions

| Circuit | Possible Vertical Affinity | Rationale |
|---------|---------------------------|-----------|
| Individual | Gamma? | Individual = unique expression, Gamma = outer planets |
| Tribal | Alpha? | Tribal = foundation/nurture, Alpha = Moon/Venus/Saturn |
| Collective | Beta? | Collective = sharing/mutation, Beta = transformation |

### Success Criterion

- Chi-square > 9.49 (df=4, p<0.05) for Circuit × Vertical interaction
- OR distinct E/D ratio pattern by circuit

---

## Test 2: Channel Partnership Analysis (CP1)

### Hypothesis

Gates connected by channels may show correlated or complementary planetary patterns.

### Channel Definitions

```javascript
const CHANNELS = [
  // Format: [gate1, gate2, 'channel_name']
  [1, 8, 'Inspiration'],
  [2, 14, 'The Beat'],
  [3, 60, 'Mutation'],
  [4, 63, 'Logic'],
  [5, 15, 'Rhythm'],
  [6, 59, 'Intimacy'],
  [7, 31, 'Alpha'],
  [9, 52, 'Concentration'],
  [10, 20, 'Awakening'],
  [10, 34, 'Exploration'],
  [10, 57, 'Perfected Form'],
  [11, 56, 'Curiosity'],
  [12, 22, 'Openness'],
  [13, 33, 'Prodigal'],
  [16, 48, 'Wavelength'],
  [17, 62, 'Acceptance'],
  [18, 58, 'Judgment'],
  [19, 49, 'Synthesis'],
  [20, 34, 'Charisma'],
  [20, 57, 'Brainwave'],
  [21, 45, 'Money'],
  [23, 43, 'Structuring'],
  [24, 61, 'Awareness'],
  [25, 51, 'Initiation'],
  [26, 44, 'Surrender'],
  [27, 50, 'Preservation'],
  [28, 38, 'Struggle'],
  [29, 46, 'Discovery'],
  [30, 41, 'Recognition'],
  [32, 54, 'Transformation'],
  [34, 57, 'Power'],
  [35, 36, 'Transitoriness'],
  [37, 40, 'Community'],
  [39, 55, 'Emoting'],
  [42, 53, 'Maturation'],
  [47, 64, 'Abstraction']
];
```

### Test Procedure

```javascript
function testChannelPartnerships(exaltationData, channels) {
  const results = [];
  
  for (const [gate1, gate2, name] of channels) {
    // Get all lines for both gates
    const gate1Lines = exaltationData.filter(l => l.gate === gate1);
    const gate2Lines = exaltationData.filter(l => l.gate === gate2);
    
    // For each line pair (1-1, 2-2, etc.), check planetary correlation
    for (let line = 1; line <= 6; line++) {
      const line1 = gate1Lines.find(l => l.line === line);
      const line2 = gate2Lines.find(l => l.line === line);
      
      if (line1 && line2) {
        results.push({
          channel: name,
          line,
          gate1_exalt: line1.exaltPlanet,
          gate2_exalt: line2.exaltPlanet,
          gate1_detriment: line1.detrimentPlanet,
          gate2_detriment: line2.detrimentPlanet,
          same_vertical_exalt: sameVertical(line1.exaltPlanet, line2.exaltPlanet),
          same_vertical_detriment: sameVertical(line1.detrimentPlanet, line2.detrimentPlanet),
          complementary: isComplementary(line1, line2)
        });
      }
    }
  }
  
  // Calculate statistics
  const sameVerticalExaltRate = results.filter(r => r.same_vertical_exalt).length / results.length;
  const sameVerticalDetrimentRate = results.filter(r => r.same_vertical_detriment).length / results.length;
  
  // Expected by chance: 1/3 (3 verticals)
  // Chi-square test against random expectation
  
  return { results, sameVerticalExaltRate, sameVerticalDetrimentRate };
}

function sameVertical(planet1, planet2) {
  const ALPHA = ['Moon', 'Venus', 'Saturn'];
  const BETA = ['Uranus', 'Mars', 'Jupiter'];
  const GAMMA = ['Mercury', 'Neptune', 'Pluto'];
  
  if (ALPHA.includes(planet1) && ALPHA.includes(planet2)) return true;
  if (BETA.includes(planet1) && BETA.includes(planet2)) return true;
  if (GAMMA.includes(planet1) && GAMMA.includes(planet2)) return true;
  return false;
}
```

### Predictions

**Hypothesis A (Correlation):** Channel partners have SAME Vertical planets
- Expected by chance: 33%
- If > 45%: Significant correlation

**Hypothesis B (Complementarity):** Channel partners have DIFFERENT Vertical planets
- If < 25%: Significant complementarity (avoiding same)

**Hypothesis C (No Pattern):** ~33% same Vertical
- Channels don't influence planetary assignment

### Success Criterion

- Same-Vertical rate significantly different from 33% (χ² > 3.84)
- Effect size > 10 percentage points deviation

---

## Test 3: Nuclear Hexagram Structure (NH1)

### Hypothesis

The 18 nuclear hexagrams (the "inner structure" of each hexagram) may show distinct planetary patterns.

### Nuclear Hexagram Calculation

```javascript
function getNuclearHexagram(hexagram) {
  // A hexagram has 6 lines: 1-2-3-4-5-6 (bottom to top)
  // Nuclear hexagram is formed from lines 2-3-4 (lower nuclear) and 3-4-5 (upper nuclear)
  // 
  // Original:     Line 6
  //               Line 5  ─┐
  //               Line 4  ─┼─ Upper Nuclear (lines 3,4,5)
  //               Line 3  ─┼─┐
  //               Line 2  ─┘ │ Lower Nuclear (lines 2,3,4)
  //               Line 1     ┘
  
  const lines = getHexagramLines(hexagram); // Get binary representation
  const lowerNuclear = [lines[1], lines[2], lines[3]]; // Lines 2,3,4
  const upperNuclear = [lines[2], lines[3], lines[4]]; // Lines 3,4,5
  
  return combineTrigramsToHexagram(lowerNuclear, upperNuclear);
}

// The 18 nuclear hexagrams (all hexagrams reduce to one of these 18)
const NUCLEAR_HEXAGRAMS = [
  1, 2,           // Pure Yang, Pure Yin
  23, 24,         // Splitting Apart, Return
  27, 28,         // Corners of the Mouth, Preponderance of the Great
  37, 38,         // Family, Opposition
  39, 40,         // Obstruction, Deliverance
  43, 44,         // Breakthrough, Coming to Meet
  53, 54,         // Development, Marrying Maiden
  63, 64          // After Completion, Before Completion
];

// Map each of 64 hexagrams to its nuclear
const HEXAGRAM_TO_NUCLEAR = {
  1: 1, 2: 2, 3: 23, 4: 24, /* ... complete mapping ... */
};
```

### Test Procedure

```javascript
function testNuclearStructure(exaltationData, nuclearMap) {
  const nuclearGroups = {};
  
  // Initialize groups
  for (const nuclear of NUCLEAR_HEXAGRAMS) {
    nuclearGroups[nuclear] = {
      gates: [],
      alpha: {E: 0, D: 0},
      beta: {E: 0, D: 0},
      gamma: {E: 0, D: 0}
    };
  }
  
  // Assign gates to nuclear groups
  for (let gate = 1; gate <= 64; gate++) {
    const nuclear = nuclearMap[gate];
    nuclearGroups[nuclear].gates.push(gate);
  }
  
  // Count E/D by Vertical for each nuclear group
  const ALPHA = ['Moon', 'Venus', 'Saturn'];
  const BETA = ['Uranus', 'Mars', 'Jupiter'];
  const GAMMA = ['Mercury', 'Neptune', 'Pluto'];
  
  for (const line of exaltationData) {
    const nuclear = nuclearMap[line.gate];
    const group = nuclearGroups[nuclear];
    
    if (ALPHA.includes(line.exaltPlanet)) group.alpha.E++;
    if (ALPHA.includes(line.detrimentPlanet)) group.alpha.D++;
    if (BETA.includes(line.exaltPlanet)) group.beta.E++;
    if (BETA.includes(line.detrimentPlanet)) group.beta.D++;
    if (GAMMA.includes(line.exaltPlanet)) group.gamma.E++;
    if (GAMMA.includes(line.detrimentPlanet)) group.gamma.D++;
  }
  
  // Calculate ratios
  for (const group of Object.values(nuclearGroups)) {
    group.alpha.ratio = group.alpha.E / (group.alpha.D || 1);
    group.beta.ratio = group.beta.E / (group.beta.D || 1);
    group.gamma.ratio = group.gamma.E / (group.gamma.D || 1);
    group.overall = {
      E: group.alpha.E + group.beta.E + group.gamma.E,
      D: group.alpha.D + group.beta.D + group.gamma.D
    };
    group.overall.ratio = group.overall.E / (group.overall.D || 1);
  }
  
  return nuclearGroups;
}
```

### Predictions

The 18 nuclear hexagrams represent archetypal "core patterns":
- Hexagrams 1, 2 (pure yang/yin) may show extreme E/D ratios
- Hexagrams 63, 64 (completion) may show balanced patterns
- Hexagrams 27, 28 (nourishment/excess) may show Tribal affinity

### Success Criterion

- Variance in E/D ratios across nuclear groups exceeds chance
- ANOVA F-statistic significant (p < 0.05)
- At least 2 nuclear groups show E/D > 1.5 or < 0.67

---

# PART III: DATA REQUIREMENTS

## Gate Assignments

Need complete mappings for:
1. **Circuit membership** — Which gates belong to which circuit
2. **Channel partnerships** — The 36 channels connecting gates
3. **Nuclear hexagram** — The inner structure of each hexagram

### Circuit Data Source

Use standard Human Design circuit definitions. If uncertain, reference:
- Ra Uru Hu's Rave I Ching
- The Definitive Book of Human Design

### Channel Data

The 36 channels are well-defined. Use the list provided above.

### Nuclear Hexagram Calculation

Calculate from I Ching structure:
- Take lines 2,3,4 for lower nuclear trigram
- Take lines 3,4,5 for upper nuclear trigram
- Combine to form nuclear hexagram

---

# PART IV: OUTPUT REQUIREMENTS

## Reports to Generate

```
/docs/research/planetary/circuit-channel-nuclear/
├── CIRCUIT-VERTICAL-ANALYSIS.md
│   ├── Individual Circuit E/D profile
│   ├── Tribal Circuit E/D profile
│   ├── Collective Circuit E/D profile
│   ├── Chi-square for Circuit × Vertical
│   └── Interpretation
│
├── CHANNEL-PARTNERSHIP-ANALYSIS.md
│   ├── Same-Vertical rates for exaltation
│   ├── Same-Vertical rates for detriment
│   ├── Channel-by-channel breakdown
│   ├── Statistical significance test
│   └── Interpretation
│
├── NUCLEAR-HEXAGRAM-ANALYSIS.md
│   ├── E/D profile for each of 18 nuclear hexagrams
│   ├── Variance analysis (ANOVA)
│   ├── Outlier nuclear groups
│   └── Interpretation
│
└── FINAL-SWEEP-SYNTHESIS.md
    ├── Summary of all three tests
    ├── Impact on derivation boundary
    ├── Final derivation architecture
    └── Conclusions
```

## Update DERIVATION-STATUS-MAP

After tests, update to v3.5:

```markdown
### Circuit, Channel, Nuclear Analysis (v3.5)

| Test | Structure | Result | Impact |
|------|-----------|--------|--------|
| CV1 | Circuit × Vertical | [RESULT] | [IMPACT] |
| CP1 | Channel Partnerships | [RESULT] | [IMPACT] |
| NH1 | Nuclear Hexagram | [RESULT] | [IMPACT] |

**Final Derivation Boundary:** [X]%
```

---

# PART V: INTERPRETATION GUIDELINES

## If Circuit × Vertical Shows Signal

Would reveal that energy flow patterns (Individual/Tribal/Collective) align with Magic Square structure. This would:
- Add a new derivation layer
- Potentially increase boundary to ~45-50%
- Suggest Circuits were designed with planetary resonance in mind

## If Channel Partnerships Show Signal

Would reveal that channel connection influences planetary assignment. This would:
- Show complementarity or correlation at structural level
- Suggest channels are "planetary bridges"
- Add explanatory power for gate-pair assignments

## If Nuclear Structure Shows Signal

Would reveal that the "hidden layer" of hexagrams carries planetary information. This would:
- Connect I Ching's deepest structure to planets
- Suggest planetary assignments follow nuclear patterns
- Be the most profound derivation finding yet

## If ALL Tests Show NULL

Would confirm:
- The ~40% boundary is DEFINITIVE
- Circuit, Channel, Nuclear operate on different dimensions
- Planetary assignment is fundamentally TRANSMISSION content
- The investigation is COMPLETE

---

# PART VI: FILES LOCATION

## Input

```
/Volumes/CLAUDE/HD-Knowledge-Engine-V3/
├── docs/
│   ├── DERIVATION-STATUS-MAP.md (v3.4)
│   └── research/planetary/
│       └── PLANETARY-DERIVATION-COMPLETE-SYNTHESIS.md
└── data/
    └── rave-iching-exaltations.json
```

## Output

```
/Volumes/CLAUDE/HD-Knowledge-Engine-V3/
├── scripts/
│   └── circuit-channel-nuclear-analysis.js
├── docs/research/planetary/circuit-channel-nuclear/
│   ├── CIRCUIT-VERTICAL-ANALYSIS.md
│   ├── CHANNEL-PARTNERSHIP-ANALYSIS.md
│   ├── NUCLEAR-HEXAGRAM-ANALYSIS.md
│   └── FINAL-SWEEP-SYNTHESIS.md
└── docs/
    └── DERIVATION-STATUS-MAP.md (update to v3.5)
```

---

# PART VII: SUCCESS CRITERIA SUMMARY

| Test | Hypothesis | Success Criterion |
|------|------------|-------------------|
| CV1 | Circuits show Vertical preferences | χ² > 9.49 (df=4) |
| CP1 | Channels show planetary correlation | Rate ≠ 33% by > 10pp |
| NH1 | Nuclear groups show E/D patterns | ANOVA p < 0.05 |

---

# PART VIII: THE FINAL QUESTION

This test battery answers the fundamental question:

**Does the ~40% derivation boundary represent the TRUE limit of geometric derivation, or have we simply not found the right structural lens?**

If Circuit, Channel, and Nuclear all show NULL → **The boundary is confirmed.**

If ANY shows signal → **Further investigation warranted.**

---

**END OF BRIEF**

*This completes the planetary derivation investigation. Execute all tests and report final conclusions.*
