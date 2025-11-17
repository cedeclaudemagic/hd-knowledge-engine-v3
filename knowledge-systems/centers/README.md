# The 9 Centers Knowledge System

## Overview

The **9 Centers** represent the fundamental structural containers of the Human Design bodygraph. Each center is an energy hub that holds specific gates and has distinct functions in how we process and express energy.

**Data Architecture**: Structure System
**Total Centers**: 9
**Total Gates**: 64
**Version**: 1.0.0
**Completeness**: Full

## What Are Centers?

Centers are **structural containers** that:
- Hold specific gates (combinations of gates within a center)
- Process different types of energy
- Can be **defined** (colored/activated) or **undefined** (white/open)
- Determine how we experience and express different aspects of life
- Are the evolved form of the traditional 7-chakra system

## The 9 Centers

### 1. Head Center (Pressure)
**Gates**: 61, 63, 64 (3 total)
**Biology**: Pineal gland
**Color**: Yellow/Gold

The Head Center generates mental pressure to think, question, and seek answers. It creates inspiration and the drive to understand existence.

- **When Defined**: Consistent mental pressure and inspiration
- **When Undefined**: Variable mental pressure, open to inspiration from others
- **Question**: "How do we make sense of life?"

### 2. Ajna Center (Awareness)
**Gates**: 4, 11, 17, 24, 43, 47 (6 total)
**Biology**: Pituitary gland
**Color**: Green

The Ajna Center processes mental data and creates concepts, patterns, and perspectives. It forms opinions, beliefs, and mental certainty.

- **When Defined**: Fixed way of thinking and processing
- **When Undefined**: Flexible thinking, open to multiple perspectives
- **Question**: "What am I certain about?"

### 3. Throat Center (Motor/Expression)
**Gates**: 8, 12, 16, 20, 23, 31, 33, 35, 45, 56, 62 (11 total)
**Biology**: Thyroid and parathyroid glands
**Color**: Brown/Tan

The Throat Center is the manifestation center where the inner world becomes the outer world through communication and action. All manifestation flows through the Throat.

- **When Defined**: Consistent way of expressing and manifesting
- **When Undefined**: Variable expression, receptive to others' voices
- **Question**: "What do I need to communicate or do?"

### 4. G Center (Identity)
**Gates**: 1, 2, 7, 10, 13, 15, 25, 46 (8 total)
**Biology**: Liver (some say heart)
**Color**: Yellow/Gold

The G Center is the magnetic monopole, holding our sense of identity, direction, and love. It is the driver of the vehicle, determining our path and purpose.

- **When Defined**: Consistent sense of identity and direction
- **When Undefined**: Fluid identity, searching for direction
- **Question**: "Who am I and where am I going?"

### 5. Heart Center (Motor)
**Gates**: 21, 26, 40, 51 (4 total)
**Biology**: Heart, stomach, thymus
**Color**: Red/Maroon

The Heart (Ego/Will) Center is about willpower, promises, and material world manifestation. It deals with self-worth, value, and the ability to make and keep commitments.

- **When Defined**: Consistent willpower and sense of self-worth
- **When Undefined**: Variable willpower, proving and improving
- **Question**: "What is my worth?"

### 6. Sacral Center (Motor)
**Gates**: 3, 5, 9, 14, 27, 29, 34, 42, 59 (9 total)
**Biology**: Ovaries/Testes
**Color**: Red/Orange

The Sacral Center is the most powerful motor, providing life force and sexual energy. Only Generators and Manifesting Generators have this center defined.

- **When Defined**: Consistent life force energy (Generator/MG)
- **When Undefined**: No consistent access to life force (Projector/Manifestor/Reflector)
- **Question**: "What work is sustainable for me?"

### 7. Solar Plexus Center (Motor/Awareness)
**Gates**: 6, 22, 30, 36, 37, 49, 55 (7 total)
**Biology**: Kidneys, pancreas, nervous system
**Color**: Yellow/Gold

The Solar Plexus is the center of emotions, creating waves of feeling over time. It is evolving to become the spirit awareness center.

- **When Defined**: Consistent emotional wave (needs clarity over time)
- **When Undefined**: Emotionally open, absorbing others' emotions
- **Question**: "What is my emotional truth?"

### 8. Spleen Center (Awareness)
**Gates**: 18, 28, 32, 44, 48, 50, 57 (7 total)
**Biology**: Spleen, lymphatic system, immune system
**Color**: Brown/Tan

The Spleen is the oldest awareness center, providing survival instincts and immune function. It speaks once in the now with spontaneous intuition.

- **When Defined**: Consistent intuitive awareness
- **When Undefined**: Open to fears and health concerns of others
- **Question**: "Am I safe right now?"

### 9. Root Center (Pressure/Motor)
**Gates**: 19, 38, 39, 41, 52, 53, 54, 58, 60 (9 total)
**Biology**: Adrenal glands
**Color**: Red/Maroon

The Root Center generates pressure to act, evolve, and complete cycles. It is both a motor and a pressure center, driving us to finish and evolve.

- **When Defined**: Consistent adrenal pressure to complete things
- **When Undefined**: Variable pressure, rushing or procrastinating
- **Question**: "When will I be free of this pressure?"

## Center Types

### Pressure Centers (2)
- **Head**: Mental pressure
- **Root**: Physical pressure

### Motor Centers (4)
- **Sacral**: Life force motor
- **Heart**: Willpower motor
- **Solar Plexus**: Emotional motor
- **Root**: Stress/adrenaline motor

### Awareness Centers (3)
- **Ajna**: Mental awareness
- **Solar Plexus**: Emotional awareness (evolving)
- **Spleen**: Existential/survival awareness

### Identity Center (1)
- **G**: Self and direction

### Expression Center (1)
- **Throat**: Communication and manifestation

## Gate Distribution

| Center | Gate Count | Gates |
|--------|-----------|-------|
| Head | 3 | 61, 63, 64 |
| Ajna | 6 | 4, 11, 17, 24, 43, 47 |
| Throat | 11 | 8, 12, 16, 20, 23, 31, 33, 35, 45, 56, 62 |
| G | 8 | 1, 2, 7, 10, 13, 15, 25, 46 |
| Heart | 4 | 21, 26, 40, 51 |
| Sacral | 9 | 3, 5, 9, 14, 27, 29, 34, 42, 59 |
| Solar Plexus | 7 | 6, 22, 30, 36, 37, 49, 55 |
| Spleen | 7 | 18, 28, 32, 44, 48, 50, 57 |
| Root | 9 | 19, 38, 39, 41, 52, 53, 54, 58, 60 |
| **Total** | **64** | All gates 1-64 |

## Data Architecture

This is a **structure system**:
- Centers are containers that hold gates
- Each gate belongs to exactly one center
- Centers are NOT calculated from binary patterns
- Centers are defined by which gates they contain
- Gates within centers can form channels when connected

## Files

- `mappings/centers-mappings.json` - Complete center definitions with all gates
- `tests/centers-tests.js` - Comprehensive test suite (12 tests)
- `verify.sh` - Quick verification script
- `extract-centers.js` - Gate extraction utility
- `center-gate-assignments.json` - Simple gate-to-center mapping

## Testing

Run all tests:
```bash
node tests/centers-tests.js
```

Quick verification:
```bash
./verify.sh
```

## Verification Criteria

✅ All 9 centers present
✅ All expected center names present
✅ All 64 gates assigned to centers
✅ No duplicate gate assignments
✅ All gate numbers valid (1-64)
✅ All centers have valid types
✅ All centers have function descriptions
✅ Gate counts match declarations
✅ System metadata is correct
✅ All centers have required knowledge fields
✅ Center gate counts are correct
✅ Gates are sorted within each center

## Historical Context

The 9 Centers evolved from the traditional 7-chakra system:
- **Solar Plexus** (new) - emerged as separate from the Spleen
- **G Center** (evolved) - the Self center, formerly heart chakra
- **Throat** (evolved) - expression and manifestation
- **Head & Ajna** (split) - separated from crown chakra

This evolution represents humanity's shift from a 7-centered being to a 9-centered being, occurring around 1781 with the discovery of Uranus.

## Integration with Other Systems

Centers integrate with:
- **Gates** (64) - contained within centers
- **Channels** (36) - connect gates between centers
- **Circuits** - organize channels into functional groups
- **Types** (5) - determined by center definitions
- **Authorities** - decision-making based on defined centers
- **Profiles** - personality/design combination
- **Variables** - advanced differentiation

## Usage in Calculations

When calculating a Human Design chart:
1. Calculate planetary positions
2. Convert positions to gate activations
3. Determine which **centers** contain activated gates
4. A center is **defined** if any of its gates are activated
5. Center definitions determine Type and Authority
6. Two connected gates form a **channel** and define both centers

## Resources

- "The Definitive Book of Human Design" by Ra Uru Hu
- Gate files in `data/source/gates/` for center assignments
- Root system in `core/root-system/` for gate foundations

## Completeness

This knowledge system is **COMPLETE**:
- All 9 centers documented
- All 64 gates assigned
- All center types specified
- Full knowledge descriptions
- Biological correlations
- All tests passing

---

**Version**: 1.0.0
**Status**: Complete
**Last Updated**: 2025-11-10
**Maintainer**: HD Knowledge Engine
