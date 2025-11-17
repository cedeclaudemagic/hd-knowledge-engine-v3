# The 8 Trigrams Knowledge System

**Traditional I Ching trigrams derived from 3-bit binary patterns**

## Overview

The 8 Trigrams (八卦, Bā Guà) are the fundamental building blocks of the I Ching (Book of Changes) and Human Design. Each trigram consists of three lines, either broken (yin, 0) or unbroken (yang, 1), creating eight unique 3-bit binary patterns.

In Human Design, each of the 64 gates (hexagrams) is composed of two trigrams stacked on top of each other:
- **Upper trigram**: Lines 4-6 (top half)
- **Lower trigram**: Lines 1-3 (bottom half)

This creates 8 × 8 = 64 possible combinations, representing the 64 gates/hexagrams.

## The 8 Trigrams

### 1. Heaven (乾 Qián) - Binary: 111
```
☰  ═══  Yang
   ═══  Yang
   ═══  Yang (bottom)
```
- **Element**: Heaven
- **Quality**: Creative, strong, active
- **Nature**: Pure Yang - Pure creative power
- **Attribute**: Strength
- **I Ching**: "The Creative. Strong and tireless. Heaven's motion."
- **Image**: The heavens, father, ruler

### 2. Earth (坤 Kūn) - Binary: 000
```
☷  ─ ─  Yin
   ─ ─  Yin
   ─ ─  Yin (bottom)
```
- **Element**: Earth
- **Quality**: Receptive, yielding, passive
- **Nature**: Pure Yin - Pure receptive power
- **Attribute**: Devotion
- **I Ching**: "The Receptive. Devoted yielding. Earth's nature."
- **Image**: The earth, mother, nourishment

### 3. Thunder (震 Zhèn) - Binary: 100
```
☳  ─ ─  Yin
   ─ ─  Yin
   ═══  Yang (bottom)
```
- **Element**: Thunder
- **Quality**: Arousing, moving, shocking
- **Nature**: Yang below yin - Movement and arousal
- **Attribute**: Movement
- **I Ching**: "The Arousing. Movement. Thunder that brings shock."
- **Image**: Thunder, eldest son, spring

### 4. Water (坎 Kǎn) - Binary: 010
```
☵  ─ ─  Yin
   ═══  Yang
   ─ ─  Yin (bottom)
```
- **Element**: Water
- **Quality**: Abysmal, dangerous, flowing
- **Nature**: Yang between yin - Hidden danger
- **Attribute**: Danger
- **I Ching**: "The Abysmal. Danger. Water that flows into the abyss."
- **Image**: Water, middle son, winter

### 5. Mountain (艮 Gèn) - Binary: 110
```
☶  ═══  Yang
   ─ ─  Yin
   ─ ─  Yin (bottom)
```
- **Element**: Mountain
- **Quality**: Still, resting, stopping
- **Nature**: Yang above yin - Stillness and contemplation
- **Attribute**: Stillness
- **I Ching**: "Keeping Still. Rest. The mountain stands firm."
- **Image**: Mountain, youngest son, transition

### 6. Wind (巽 Xùn) - Binary: 001
```
☴  ─ ─  Yin
   ═══  Yang
   ═══  Yang (bottom)
```
- **Element**: Wood/Wind
- **Quality**: Gentle, penetrating, pervasive
- **Nature**: Yin below yang - Gentle penetration
- **Attribute**: Penetration
- **I Ching**: "The Gentle. Penetrating. Wind that disperses."
- **Image**: Wind, eldest daughter, wood

### 7. Fire (離 Lí) - Binary: 101
```
☲  ═══  Yang
   ─ ─  Yin
   ═══  Yang (bottom)
```
- **Element**: Fire
- **Quality**: Clinging, dependent, illuminating
- **Nature**: Yin between yang - Light and dependence
- **Attribute**: Light
- **I Ching**: "The Clinging. Light. Fire that clings to fuel."
- **Image**: Fire, middle daughter, lightning

### 8. Lake (兌 Duì) - Binary: 011
```
☱  ─ ─  Yin
   ═══  Yang
   ═══  Yang (bottom)
```
- **Element**: Lake/Marsh
- **Quality**: Joyous, pleasing, open
- **Nature**: Yin above yang - Joy and pleasure
- **Attribute**: Joy
- **I Ching**: "The Joyous. Pleasure. Lake that brings joy."
- **Image**: Lake, youngest daughter, autumn

## Binary Encoding

Each trigram is encoded as a 3-bit binary number, reading from **bottom to top** (traditional I Ching order):

| Binary | Decimal | Trigram | Chinese | Element |
|--------|---------|---------|---------|---------|
| 000    | 0       | Earth   | 坤      | Earth   |
| 001    | 1       | Wind    | 巽      | Wood    |
| 010    | 2       | Water   | 坎      | Water   |
| 011    | 3       | Lake    | 兌      | Lake    |
| 100    | 4       | Thunder | 震      | Thunder |
| 101    | 5       | Fire    | 離      | Fire    |
| 110    | 6       | Mountain| 艮      | Mountain|
| 111    | 7       | Heaven  | 乾      | Heaven  |

## Hexagram Composition

Each of the 64 gates/hexagrams is formed by combining two trigrams:

```
Example: Gate 1 (The Creative)
Binary: 111111

Upper trigram: 111 = Heaven (lines 4-6)
Lower trigram: 111 = Heaven (lines 1-3)

Result: Heaven over Heaven = Pure Creative Force
```

```
Example: Gate 3 (Difficulty at the Beginning)
Binary: 100010

Upper trigram: 100 = Thunder (lines 4-6)
Lower trigram: 010 = Water (lines 1-3)

Result: Thunder over Water = Difficulty
```

## Family Relationships

The trigrams represent familial relationships:

| Trigram  | Binary | Relationship      | Gender |
|----------|--------|-------------------|--------|
| Heaven   | 111    | Father            | Male   |
| Earth    | 000    | Mother            | Female |
| Thunder  | 100    | Eldest Son        | Male   |
| Water    | 010    | Middle Son        | Male   |
| Mountain | 110    | Youngest Son      | Male   |
| Wind     | 001    | Eldest Daughter   | Female |
| Fire     | 101    | Middle Daughter   | Female |
| Lake     | 011    | Youngest Daughter | Female |

## Data Architecture

This is a **grouping system**:
- **Total Groups**: 8 trigrams
- **Data Type**: Traditional I Ching meanings and interpretations
- **Architecture**: Each trigram is a group that can contain multiple gates
- **Completeness**: Full (all 8 trigrams documented)

## Usage

### Access Trigram Data

```javascript
const trigrams = require('./mappings/trigrams-mappings.json');

// Get Heaven trigram
const heaven = trigrams.mappings.find(t => t.binaryPattern === '111');
console.log(heaven.knowledge.iching);
// "The Creative. Strong and tireless. Heaven's motion."

// Get all trigram names
const names = trigrams.mappings.map(t => t.groupName);
// ['Heaven', 'Earth', 'Thunder', 'Water', 'Mountain', 'Wind', 'Fire', 'Lake']
```

### Calculate Gate Trigrams

```javascript
// For a gate with binary "100010" (Gate 3)
const gateBinary = "100010";

const upperTrigram = gateBinary.substring(0, 3); // "100" = Thunder
const lowerTrigram = gateBinary.substring(3, 6); // "010" = Water

// Result: Thunder over Water
```

## Testing

Run the comprehensive test suite:

```bash
cd knowledge-systems/trigrams
node tests/trigrams-tests.js
```

This runs 10 tests including:
- ✅ All 8 trigrams present
- ✅ Chinese names and pinyin
- ✅ I Ching meanings
- ✅ Binary pattern validation
- ✅ Correct binary-to-trigram mappings
- ✅ Required knowledge fields
- ✅ Metadata validation

## Verification

Run the quick verification script:

```bash
cd knowledge-systems/trigrams
./verify.sh
```

Checks:
- ✅ 8 trigrams present
- ✅ All binary patterns (000-111) present
- ✅ Chinese names for all
- ✅ I Ching meanings for all

## Traditional I Ching Wisdom

The trigrams represent the fundamental forces of nature and human experience:

**Heaven and Earth** (乾坤, Qián Kūn) are the primal opposites:
- Heaven: Pure yang, creative force, initiative
- Earth: Pure yin, receptive force, response

**The Six Children** represent different combinations of yin and yang:
- **Thunder** (震): Yang erupting into movement
- **Water** (坎): Yang hidden in danger
- **Mountain** (艮): Yang at rest, stillness
- **Wind** (巽): Yin gently penetrating
- **Fire** (離): Yin illuminating, clinging
- **Lake** (兌): Yin bringing joy, openness

Each trigram carries profound wisdom about how energy moves, transforms, and manifests in the world.

## References

- **I Ching (易經)**: The original Book of Changes
- **Wilhelm/Baynes Translation**: Standard English translation
- **Human Design System**: Ra Uru Hu's integration of I Ching with modern science
- **Gene Keys**: Richard Rudd's contemplative system
- **Traditional Chinese Philosophy**: Taoist and Confucian interpretations

## File Structure

```
knowledge-systems/trigrams/
├── mappings/
│   └── trigrams-mappings.json    # Complete trigram data
├── tests/
│   └── trigrams-tests.js         # Comprehensive test suite
├── verify.sh                      # Quick verification script
└── README.md                      # This file
```

## Version History

- **v1.0.0** (2025-11-10): Initial release
  - All 8 trigrams documented
  - Traditional I Ching meanings
  - Chinese characters and pinyin
  - Complete test coverage
  - Verification script

## License

This knowledge system contains traditional I Ching wisdom that is thousands of years old and belongs to humanity's shared cultural heritage. The structured data format and modern interpretations are provided for educational and contemplative purposes.
