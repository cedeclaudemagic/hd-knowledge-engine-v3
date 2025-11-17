# The 36 Channels Knowledge System

## Overview

The 36 Channels represent the **connection system** in Human Design. Each channel connects two specific gates and creates a defined pathway of energy when both gates are activated in a person's chart.

This is fundamentally different from the 64 Gates (individual activation points) or the 9 Centers (energy hubs). Channels are **relationships between gates** that create specific themes and energies when fully defined.

## System Architecture

- **Data Architecture**: Connection System (gate pairs)
- **Total Channels**: 36
- **Version**: 1.0.0
- **Completeness**: Full
- **Source**: Verified from original Human Design circuit data files

## The Seven Circuits

All 36 channels are organized into seven distinct circuits based on the source data. Each circuit has a unique function and purpose in the Human Design system:

### 1. Knowing Circuit (9 channels)

**Theme**: Individuality, mutation, and individual knowing

**Purpose**: The Knowing Circuit operates outside the collective, bringing unique insights and perspectives through example. It processes mental, emotional, and intuitive awareness streams.

**Channels**:
- **1-8**: The Channel of Inspiration (G to Throat)
- **2-14**: The Channel of the Beat (G to Sacral)
- **3-60**: The Channel of Mutation (Sacral to Root)
- **12-22**: The Channel of Openness (Throat to Solar Plexus)
- **20-57**: The Brainwave (Throat to Spleen)
- **23-43**: Structuring (Throat to Ajna)
- **24-61**: The Channel of Awareness (Ajna to Head)
- **28-38**: The Channel of Struggle (Spleen to Root)
- **39-55**: The Channel of Emoting (Root to Solar Plexus)

### 2. Understanding Circuit (7 channels)

**Theme**: Logic, patterns, and collective understanding

**Purpose**: The Understanding Circuit is about sharing logical patterns, opinions, and conceptual understanding with the collective.

**Channels**:
- **4-63**: The Channel of Logic (Ajna to Head)
- **5-15**: The Channel of Rhythm (Sacral to G)
- **7-31**: The Channel of the Alpha (G to Throat)
- **9-52**: The Channel of Concentration (Sacral to Root)
- **16-48**: The Wavelength (Throat to Spleen)
- **17-62**: The Channel of Acceptance (Ajna to Throat)
- **18-58**: The Channel of Judgment (Spleen to Root)

### 3. Sensing Circuit (7 channels)

**Theme**: Sensing, experiencing, and individual awareness

**Purpose**: The Sensing Circuit processes unique individual experiences through mental and emotional awareness streams.

**Channels**:
- **11-56**: The Channel of Curiosity (Ajna to Throat)
- **13-33**: The Channel of the Prodigal (G to Throat)
- **29-46**: The Channel of Discovery (Sacral to G)
- **30-41**: The Channel of Recognition (Solar Plexus to Root)
- **35-36**: The Channel of Transitoriness (Throat to Solar Plexus)
- **42-53**: The Channel of Maturation (Sacral to Root)
- **47-64**: The Channel of Abstraction (Ajna to Head)

### 4. Ego Circuit (5 channels)

**Theme**: Willpower, tribal resources, and material support

**Purpose**: The Ego Circuit is about willpower, control of resources, and supporting the tribe through material means.

**Channels**:
- **19-49**: The Channel of Synthesis (Root to Solar Plexus)
- **21-45**: The Money Channel (Heart to Throat) *- Slightly detached from core Ego Circuit*
- **26-44**: The Channel of Surrender (Heart to Spleen)
- **32-54**: The Channel of Transformation (Spleen to Root)
- **37-40**: The Channel of Community (Solar Plexus to Heart)

### 5. Integration Circuit (4 channels)

**Theme**: Integration and manifesting self

**Purpose**: The Integration Circuit channels connect and integrate different aspects of self, particularly through the G Center.

**Channels**:
- **10-20**: The Channel of Awakening (G to Throat)
- **10-57**: The Channel of Perfected Form (G to Spleen)
- **20-34**: The Channel of Charisma (Throat to Sacral)
- **34-57**: The Channel of Power (Sacral to Spleen)

### 6. Defense Circuit (2 channels)

**Theme**: Tribal defense and preservation

**Purpose**: The Defense Circuit is about protecting and preserving the tribe through intimacy and values.

**Channels**:
- **6-59**: The Channel of Mating (Solar Plexus to Sacral)
- **27-50**: The Channel of Preservation (Sacral to Spleen)

### 7. Centering Circuit (2 channels)

**Theme**: Self-direction and centering in the G Center

**Purpose**: The Centering Circuit is about finding one's direction and identity through the G Center.

**Channels**:
- **10-34**: The Channel of Exploration (G to Sacral)
- **25-51**: The Channel of Initiation (G to Heart)

## Key Concepts

### What is a Channel?

A channel is a **connection between two gates** that:
1. Spans between two energy centers
2. Requires BOTH gates to be activated (defined)
3. Creates a consistent energy pathway when defined
4. Has its own unique meaning beyond the individual gates

### Definition

A channel is "defined" when:
- Both gates are activated in a person's chart (through Sun/Earth, planets, or design)
- This creates a colored/defined pathway on the bodygraph
- Results in consistent access to that channel's specific energy

### When Undefined

When one or both gates are not activated:
- The channel remains "open" or undefined
- Access to that channel's energy is inconsistent or borrowed from others
- Can be an area of wisdom through experiencing others' definition

## Circuit Breakdown Summary

| Circuit | Channels | Primary Theme |
|---------|----------|---------------|
| Knowing Circuit | 9 | Individual knowing and mutation |
| Understanding Circuit | 7 | Logic and collective patterns |
| Sensing Circuit | 7 | Individual sensing and experience |
| Ego Circuit | 5 | Willpower and tribal resources |
| Integration Circuit | 4 | Self-integration and manifestation |
| Defense Circuit | 2 | Tribal protection and preservation |
| Centering Circuit | 2 | Direction and identity |

## Data Structure

Each channel mapping includes:

```json
{
  "channelNumber": "1-8",
  "gate1": 1,
  "gate2": 8,
  "knowledge": {
    "name": "Inspiration",
    "keynote": "The creative Role Model",
    "description": "A channel connecting Gate 1 (The Creative) and Gate 8 (Holding Together)",
    "circuit": "Knowing Circuit",
    "centerConnection": "G to Throat",
    "theme": "The Creative Role Model",
    "whenDefined": "Consistent access to inspiration energy",
    "whenUndefined": "Variable access to inspiration energy"
  }
}
```

## Testing & Verification

### Run Tests

```bash
cd knowledge-systems/channels
node tests/channels-tests.js
```

### Run Verification

```bash
cd knowledge-systems/channels
./verify.sh
```

## Usage

To access channel data programmatically:

```javascript
const channels = require('./mappings/channels-mappings.json');

// Get all channels
console.log(`Total channels: ${channels.totalChannels}`);

// Find a specific channel
const channel = channels.mappings.find(m => m.channelNumber === '1-8');
console.log(channel.knowledge.name); // "Inspiration"
console.log(channel.knowledge.circuit); // "Knowing Circuit"

// Filter by circuit
const knowingChannels = channels.mappings.filter(
  m => m.knowledge.circuit === 'Knowing Circuit'
);
console.log(`Knowing channels: ${knowingChannels.length}`); // 9
```

## Notes

- Channel numbers are always normalized with the lower gate number first (e.g., "1-8" not "8-1")
- All 36 channels are fully documented with names, keynotes, and circuit assignments
- Circuit assignments are verified from source data files
- Center connections show which energy centers each channel bridges
- This is a **connection system** - each entry represents a gate pair, not individual gates

## Sources

- Original circuit data files in `data/source/channels/`
- Gate files in `data/source/gates/`
- Ra Uru Hu's Human Design System teachings
- "The Definitive Book of Human Design" by Lynda Bunnell

## Version History

- **1.0.0** (2024): Initial complete mapping of all 36 channels with verified circuit assignments from source data
