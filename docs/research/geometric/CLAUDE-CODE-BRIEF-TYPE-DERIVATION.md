# CLAUDE CODE BRIEF: Type Architecture Derivation

## Mission

Investigate whether the 5 Human Design Types (Generator, Manifesting Generator, Manifestor, Projector, Reflector) are geometrically derivable from centre definition patterns, or whether they represent classification choices.

---

# PART I: THE TYPE DATA

## The Five Types

| Type | Definition Pattern | Population |
|------|-------------------|------------|
| **Generator** | Sacral defined, NO motor→Throat | ~37% |
| **Manifesting Generator** | Sacral defined + motor→Throat | ~33% |
| **Manifestor** | Motor→Throat, Sacral UNdefined | ~9% |
| **Projector** | No Sacral, no motor→Throat | ~20% |
| **Reflector** | Nothing defined (all centres open) | ~1% |

## The Definition Rules

Types are determined by TWO criteria:
1. **Sacral Centre status** — Defined or undefined
2. **Motor-to-Throat connection** — Present or absent

```
MOTORS: Sacral, Solar Plexus, Heart/Ego, Root
THROAT: Manifestation centre

                    Motor → Throat?
                    YES         NO
                 ┌─────────┬─────────┐
Sacral    YES    │  M.G.   │  Gen    │
Defined?         ├─────────┼─────────┤
          NO     │  Mani   │ Proj/Ref│
                 └─────────┴─────────┘
```

## The Projector/Reflector Distinction

When Sacral is undefined AND no motor→Throat:
- **Projector** = At least one centre defined
- **Reflector** = NO centres defined (completely open)

---

# PART II: THE NINE CENTRES

## Centre Positions (from electromagnetic research)

| Centre | Gates | Position(s) | Function |
|--------|-------|-------------|----------|
| **Head** | 64, 61, 63 | -4, ±4 | Inspiration/Pressure |
| **Ajna** | 47, 24, 4, 17, 43, 11 | Mixed | Processing |
| **Throat** | 62, 23, 56, 35, 12, 45, 33, 31, 8, 20, 16 | Mixed | Manifestation |
| **G Centre** | 1, 13, 25, 46, 2, 15, 10, 7 | ±4 | Identity/Direction |
| **Heart/Ego** | 21, 40, 26, 51 | +1 | Willpower |
| **Solar Plexus** | 6, 37, 22, 36, 30, 55, 49 | -2 | Emotion/Wave |
| **Sacral** | 5, 14, 29, 59, 9, 3, 42, 27, 34 | +2, -4 | Life Force |
| **Spleen** | 48, 57, 44, 50, 32, 28, 18 | -1 | Intuition/Immunity |
| **Root** | 58, 38, 54, 53, 60, 52, 19, 39, 41 | -4, +4 | Pressure/Adrenaline |

## Motor Centres

The four motors have distinct electromagnetic characters:

| Motor | Position | Character |
|-------|----------|-----------|
| **Sacral** | +2 (current) | Sustainable life force |
| **Solar Plexus** | -2 (voltage) | Wave-based emotional energy |
| **Heart/Ego** | +1 (gate in) | Willpower, commitment |
| **Root** | ±4 (poles) | Pressure, adrenaline |

---

# PART III: GEOMETRIC HYPOTHESES

## Hypothesis T1: Sacral as Binary Pivot

The Sacral Centre might be geometrically special — a PIVOT that divides the type space.

```
Sacral = Current position (+2)
Current is the FLOW of energy

Sacral DEFINED = Energy flows (Generator types)
Sacral UNDEFINED = No sustainable flow (Non-generator types)
```

**Test:** Is the Sacral's position (+2, current) geometrically unique among motors?

## Hypothesis T2: Motor→Throat as Manifestation Circuit

The motor→Throat connection might represent a specific geometric relationship.

```
THROAT = Manifestation (voice, action, expression)
MOTOR = Energy source

Motor→Throat = Direct path from energy to expression
```

**Test:** Do the channels connecting motors to Throat share geometric properties?

## Hypothesis T3: Type as Centre Count

Types might emerge from the NUMBER of defined centres:

| Defined Centres | Type Pattern |
|-----------------|--------------|
| 0 | Reflector |
| 1-8 (no Sacral, no motor→Throat) | Projector |
| 1-8 (Sacral defined) | Generator/MG |
| 1-8 (motor→Throat, no Sacral) | Manifestor |

**Test:** Is there a geometric principle for why these groupings?

## Hypothesis T4: Aura Mechanics from Geometry

Ra described distinct aura types:

| Type | Aura Quality |
|------|--------------|
| Generator | Open, enveloping |
| Manifestor | Closed, repelling |
| Projector | Focused, penetrating |
| Reflector | Resistant, sampling |

**Test:** Do these aura qualities follow from geometric centre arrangements?

## Hypothesis T5: The 2×2 Grid is Complete

The type system might be a COMPLETE categorisation of all possible definition patterns:

```
2 questions × 2 answers = 4 basic types
+ 1 edge case (nothing defined) = 5 types

This is EXHAUSTIVE — no other types can exist.
```

**Test:** Prove that the type system covers ALL possible definition patterns.

---

# PART IV: THE DERIVATION QUESTIONS

## What Would "Derivable" Mean?

If Types are geometrically derivable, we should prove:

1. **WHY the Sacral is special** — Not arbitrary choice
2. **WHY motor→Throat matters** — Geometric necessity
3. **WHY exactly 5 types** — Complete categorisation
4. **WHY these definitions** — Not other combinations

## What Would "Classification" Mean?

If Types are useful classification (not geometric necessity):

1. The CRITERIA might be practical, not geometric
2. Types might be "good categories" without being "necessary categories"
3. Other classification schemes could be equally valid

---

# PART V: TEST SPECIFICATIONS

## Test T1: Sacral Uniqueness

**Question:** Is the Sacral geometrically unique among the 9 centres?

```javascript
function testSacralUniqueness() {
  const centres = {
    head: { positions: [-4, 4], gates: [64, 61, 63] },
    ajna: { positions: 'mixed', gates: [47, 24, 4, 17, 43, 11] },
    throat: { positions: 'mixed', gates: [62, 23, 56, 35, 12, 45, 33, 31, 8, 20, 16] },
    g: { positions: [4, -4], gates: [1, 13, 25, 46, 2, 15, 10, 7] },
    heart: { positions: [1], gates: [21, 40, 26, 51] },
    solarPlexus: { positions: [-2], gates: [6, 37, 22, 36, 30, 55, 49] },
    sacral: { positions: [2, -4], gates: [5, 14, 29, 59, 9, 3, 42, 27, 34] },
    spleen: { positions: [-1], gates: [48, 57, 44, 50, 32, 28, 18] },
    root: { positions: [-4, 4], gates: [58, 38, 54, 53, 60, 52, 19, 39, 41] }
  };
  
  // What makes Sacral special?
  // 1. It's the only centre with position +2 (current)
  // 2. It's the largest motor (9 gates)
  // 3. It's the "life force" generator
  
  // Check: Is +2 (current) unique to Sacral?
  // Check: Does gate count correlate with type importance?
}
```

**Success Criterion:** Identify geometric property unique to Sacral.

## Test T2: Motor-Throat Channels

**Question:** What do the motor→Throat channels have in common?

```javascript
const MOTOR_TO_THROAT_CHANNELS = [
  // Sacral → Throat
  { channel: '34-20', motor: 'sacral', gates: [34, 20], name: 'Charisma' },
  
  // Solar Plexus → Throat
  { channel: '35-36', motor: 'solarPlexus', gates: [35, 36], name: 'Transitoriness' },
  { channel: '12-22', motor: 'solarPlexus', gates: [12, 22], name: 'Openness' },
  
  // Heart → Throat
  { channel: '21-45', motor: 'heart', gates: [21, 45], name: 'Money' },
  { channel: '25-51', motor: 'heart', gates: [25, 51], name: 'Initiation' },
  
  // Root → Throat (indirect — Root doesn't connect directly to Throat)
  // Root must go through Sacral, Spleen, or Solar Plexus first
];

function analyzeMotorThroatChannels() {
  // For each motor→Throat channel:
  // 1. What are the gate types (standing wave, cross-zero, same-phase)?
  // 2. What positions are involved?
  // 3. Is there a common geometric pattern?
}
```

**Success Criterion:** Identify geometric commonality in motor→Throat channels.

## Test T3: Definition Completeness

**Question:** Does the type system cover ALL possible definition patterns?

```javascript
function testDefinitionCompleteness() {
  // A person can have any combination of 9 centres defined/undefined
  // That's 2^9 = 512 possible definition patterns
  
  // But Types are determined by just 2 criteria:
  // 1. Sacral defined? (Y/N)
  // 2. Motor→Throat? (Y/N)
  
  // This creates 4 categories:
  // - Sacral Y, Motor→Throat Y = Manifesting Generator
  // - Sacral Y, Motor→Throat N = Generator
  // - Sacral N, Motor→Throat Y = Manifestor
  // - Sacral N, Motor→Throat N = Projector OR Reflector
  
  // Plus the edge case:
  // - Nothing defined = Reflector
  
  // Verify: Do these 5 types EXHAUST all 512 patterns?
  
  const patterns = [];
  for (let i = 0; i < 512; i++) {
    const binary = i.toString(2).padStart(9, '0');
    // Map each bit to a centre
    // Determine type
    // Count occurrences
  }
}
```

**Success Criterion:** Prove 5 types cover all 512 definition patterns.

## Test T4: Population Distribution

**Question:** Do the type percentages follow from random definition probability?

```javascript
function testPopulationDistribution() {
  // Given percentages:
  // Generator: 37%
  // Manifesting Generator: 33%
  // Manifestor: 9%
  // Projector: 20%
  // Reflector: 1%
  
  // If each gate has ~50% chance of being defined,
  // what's the probability of each type?
  
  // For Reflector (0 centres defined):
  // P(all 9 open) = very low → ~1% matches!
  
  // For Generator (Sacral defined, no motor→Throat):
  // P(Sacral defined) × P(no motor→Throat) = ?
  
  // Do the math match the observed percentages?
}
```

**Success Criterion:** Population percentages derivable from probability.

## Test T5: Aura Geometry

**Question:** Do aura types follow from centre geometry?

```javascript
function testAuraGeometry() {
  // Generator aura: "Open, enveloping"
  // - Sacral is defined (life force present)
  // - No direct manifestation path
  // - Energy radiates but doesn't push
  
  // Manifestor aura: "Closed, repelling"
  // - Motor→Throat (direct manifestation)
  // - Energy pushes outward
  // - Others feel the impact
  
  // Projector aura: "Focused, penetrating"
  // - No motors to Throat
  // - Definition focuses awareness
  // - Sees INTO others
  
  // Reflector aura: "Resistant, sampling"
  // - No definition
  // - Takes in environment
  // - But doesn't hold
  
  // Is there a geometric principle that explains these?
}
```

**Success Criterion:** Aura qualities derivable from definition geometry.

## Test T6: Why 5 Types?

**Question:** Why exactly 5 types? Is this number geometrically necessary?

```javascript
function testWhyFive() {
  // The type system is based on a 2×2 matrix + 1 edge case:
  
  //              Motor→Throat?
  //              YES        NO
  //           ┌─────────┬─────────┐
  // Sacral Y  │  M.G.   │  Gen    │
  //           ├─────────┼─────────┤
  // Sacral N  │  Mani   │  P/R    │
  //           └─────────┴─────────┘
  
  // The "P/R" cell splits into Projector and Reflector
  // based on whether ANY definition exists
  
  // So: 4 + 1 = 5 types
  
  // Is 5 geometrically significant?
  // - 5 Platonic solids
  // - 5 Bases in Human Design
  // - Pentagon geometry
  
  // Or is 5 just a practical count?
}
```

**Success Criterion:** Identify whether 5 is geometrically necessary or incidental.

---

# PART VI: ADDITIONAL ANALYSIS

## The Strategy Connection

Each Type has a Strategy:

| Type | Strategy |
|------|----------|
| Generator | Wait to respond |
| Manifesting Generator | Wait to respond, then inform |
| Manifestor | Inform |
| Projector | Wait for invitation |
| Reflector | Wait lunar cycle |

**Question:** Does Strategy follow geometrically from Type definition?

## The Signature/Not-Self Connection

| Type | Signature | Not-Self |
|------|-----------|----------|
| Generator | Satisfaction | Frustration |
| Manifestor | Peace | Anger |
| Projector | Success | Bitterness |
| Reflector | Surprise | Disappointment |

**Question:** Do these qualities follow from geometry?

## The Motor Hierarchy

Not all motors are equal:

| Motor | Power | Sustainability |
|-------|-------|----------------|
| Sacral | Highest | Most sustainable |
| Solar Plexus | High | Wave-based |
| Root | High | Pressure-based |
| Heart | Lower | Commitment-based |

**Question:** Does this hierarchy follow from electromagnetic positions?

---

# PART VII: OUTPUT REQUIREMENTS

## Reports to Generate

```
/docs/research/type/
├── SACRAL-UNIQUENESS-ANALYSIS.md
│   ├── Sacral's geometric properties
│   ├── Comparison with other centres
│   └── Why Sacral defines Generator/non-Generator
│
├── MOTOR-THROAT-ANALYSIS.md
│   ├── All motor→Throat channels
│   ├── Geometric commonalities
│   └── Why this connection defines Manifestor
│
├── DEFINITION-COMPLETENESS-ANALYSIS.md
│   ├── All 512 definition patterns
│   ├── Type assignment for each
│   └── Proof of exhaustive coverage
│
├── POPULATION-PROBABILITY-ANALYSIS.md
│   ├── Random definition model
│   ├── Predicted vs observed percentages
│   └── Statistical significance
│
└── TYPE-DERIVATION-SYNTHESIS.md
    ├── All test results
    ├── What is DERIVABLE
    ├── What is CLASSIFICATION
    ├── Updated derivation boundary
    └── Implications
```

## Update DERIVATION-STATUS-MAP

After tests, add:

```markdown
### Type Architecture Analysis (v3.7)

| Test | Hypothesis | Result | Status |
|------|------------|--------|--------|
| T1 | Sacral uniqueness | [RESULT] | [DERIVABLE/CLASSIFICATION] |
| T2 | Motor→Throat geometry | [RESULT] | [DERIVABLE/CLASSIFICATION] |
| T3 | Definition completeness | [RESULT] | [DERIVABLE/CLASSIFICATION] |
| T4 | Population probability | [RESULT] | [DERIVABLE/CLASSIFICATION] |
| T5 | Aura geometry | [RESULT] | [DERIVABLE/CLASSIFICATION] |
| T6 | Why 5 types? | [RESULT] | [DERIVABLE/CLASSIFICATION] |

**Type Architecture Status:** [SUMMARY]
```

---

# PART VIII: INTERPRETATION GUIDELINES

## If Types Are Geometrically Derivable

This would mean:
1. The 5 Types are NECESSARY categories, not arbitrary groupings
2. The Sacral's special status follows from geometry
3. Motor→Throat is a geometric relationship, not just practical
4. Type joins the fully derivable layer

## If Types Are Useful Classification

This would mean:
1. Types are PRACTICAL categories for understanding
2. The criteria (Sacral, motor→Throat) are CHOSEN, not necessary
3. Other type systems could be equally valid
4. Types are "good teaching tools" more than "geometric facts"

## The Key Question

**Are Types like Profiles (geometrically necessary) or like planetary semantics (useful but not derivable)?**

---

# PART IX: SUCCESS CRITERIA SUMMARY

| Test | Hypothesis | Success Criterion |
|------|------------|-------------------|
| T1 | Sacral uniqueness | Geometric property unique to Sacral |
| T2 | Motor→Throat | Common geometric pattern |
| T3 | Completeness | 5 types cover all 512 patterns |
| T4 | Population | Percentages match probability |
| T5 | Aura geometry | Qualities derivable from definition |
| T6 | Why 5? | 5 is geometrically necessary |

**Overall Success:** At least 3 tests show geometric derivation.

---

**END OF BRIEF**

*This investigation determines whether Type is part of the geometric architecture or a practical classification system.*
