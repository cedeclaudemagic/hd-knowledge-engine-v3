# Human Design Gate Names & Keywords

## Overview

This knowledge system provides **Ra Uru Hu's gate keywords, center assignments, and channel associations** for all 64 gates in the Human Design system.

## System Properties

| Property | Value |
|----------|-------|
| **System Name** | Human Design Gate Names & Keywords |
| **Version** | 1.0.0 |
| **Completeness** | Full (64/64 gates) |
| **Data Architecture** | Gate-level |
| **Line-level Detail** | No (`lineNumber: null`) |

## What This System Provides

Each gate mapping includes:

- **Keyword**: Ra Uru Hu's core keyword for the gate
- **Center**: Energy center assignment (9 centers)
- **Name**: I-Ching hexagram name
- **Description**: Gate meaning and purpose
- **Channel**: Channel designation (e.g., "1-8")
- **Channel Name**: Channel name (e.g., "Inspiration")
- **Channel Keynote**: Channel description
- **Harmonic Gate**: Partner gate in the channel
- **Harmonic Gate Name**: Partner gate's name

## Energy Center Distribution

| Center | Gates | Count |
|--------|-------|-------|
| **Head** | 61, 63, 64 | 3 |
| **Ajna** | 4, 11, 17, 24, 43, 47 | 6 |
| **Throat** | 8, 12, 16, 20, 23, 31, 33, 35, 45, 56, 62 | 11 |
| **G (Identity)** | 1, 2, 7, 10, 13, 15, 25, 46 | 8 |
| **Sacral** | 3, 5, 9, 14, 27, 29, 34, 42, 59 | 9 |
| **Solar Plexus** | 6, 22, 30, 36, 37, 49, 55 | 7 |
| **Spleen** | 18, 28, 32, 44, 48, 50, 57 | 7 |
| **Root** | 19, 38, 39, 41, 52, 53, 54, 58, 60 | 9 |
| **Heart (Will)** | 21, 26, 40, 51 | 4 |

## Example Mapping

```json
{
  "gateNumber": 1,
  "lineNumber": null,
  "knowledge": {
    "name": "The Creative",
    "keyword": "Self-Expression",
    "center": "G",
    "description": "Creation as a primal force. The energy potential to manifest inspiration without limitation.",
    "channel": "1-8",
    "channelName": "Inspiration",
    "channelKeynote": "The creative Role Model",
    "harmonicGate": 8,
    "harmonicGateName": "Holding Together"
  }
}
```

## Docking to Root System

This system docks into the **root docking system** which provides:

- **Binary patterns**: 6-bit binary for each gate (e.g., "111111")
- **Wheel positioning**: True mandala sequence [41, 19, 13...]
- **Quarters & Trigrams**: Calculated from binary patterns
- **Mathematical foundation**: All positioning algorithms

This system provides only the **Human Design meaning layer** (keywords, centers, channels). The root handles all mathematical calculations.

## Usage

### Run Verification

```bash
cd knowledge-systems/hd-gates
./verify.sh
```

### Run Tests

```bash
cd knowledge-systems/hd-gates
node tests/hd-gates-tests.js
```

### Re-extract Data

If source gate files are updated:

```bash
cd knowledge-systems/hd-gates
node extract-gates.js
```

## File Structure

```
knowledge-systems/hd-gates/
├── README.md                          # This file
├── mappings/
│   └── hd-gates-mappings.json        # 64 gate mappings
├── tests/
│   └── hd-gates-tests.js             # Test suite
├── verify.sh                          # Verification script
└── extract-gates.js                   # Data extraction script
```

## Data Source

All gate data is extracted from:

- `data/source/gates/gate-1.json` through `gate-64.json`
- Original Human Design system by Ra Uru Hu

## Verification Criteria

All mappings must pass:

- ✅ All 64 gates covered (1-64)
- ✅ All gates have keywords
- ✅ All gates have center assignments
- ✅ All center names are valid (9 centers)
- ✅ `lineNumber` is null for all (gate-level system)
- ✅ No duplicate gate numbers
- ✅ All tests passing

## Sample Gates

| Gate | Keyword | Center | Channel |
|------|---------|--------|---------|
| 1 | Self-Expression | G | 1-8 Inspiration |
| 41 | Contraction | Root | 41-30 Recognition |
| 27 | Caring | Sacral | 27-50 Preservation |
| 51 | Shock | Heart | 51-25 Initiation |
| 64 | Confusion | Head | 64-47 Abstraction |

## Integration

This system integrates with:

- **Root System**: Binary patterns & positioning (`core/root-system/`)
- **I-Ching System**: Hexagram names and trigrams
- **Astrology System**: Zodiac sign positions
- **Gene Keys System**: Gifts and shadows (separate system)
- **Channel System**: 36 channels (to be created)

## Version History

- **1.0.0** (2025-11-10): Initial release with all 64 gates

## License

Human Design system © Ra Uru Hu / Jovian Archive
