# HD Knowledge Engine v2.0

**Production-ready modular knowledge management system for Human Design**

## 🎯 Architecture

**Calculation-First Design:**
- All mathematical relationships computed on-demand
- No monolithic database storage
- Single source of truth in `core/root-system/`

**Modular Knowledge Systems:**
- 11 independent pluggable systems
- Each with own tests and verification
- Clean separation of concerns

## 📊 Knowledge Systems (11 Total)

1. **Gene Keys** - Shadow/Gift/Siddhi framework
2. **I Ching Names** - Traditional hexagram names with Chinese characters
3. **Human Design Gates** - Ra's gate keywords & center assignments
4. **Traditional HD Gates** - 384-line planetary assignments
5. **The 4 Quarters** - Mutation, Initiation, Duality, Civilisation
6. **The 8 Trigrams** - Heaven, Earth, Thunder, Water, etc.
7. **The 16 Mythological Faces** - Hades, Prometheus, Vishnu, etc.
8. **The 22 Codon Rings** - Biochemical amino acid correlations
9. **The 36 Channels** - All bodygraph channels with circuits
10. **The 192 Incarnation Crosses** - LAX, RAX, JX crosses
11. **The 9 Centers** - All energy centers with gate assignments

## 🚀 Quick Start

```bash
npm install

# Query a gate (returns all knowledge from 11 systems)
node unified-query-engine.js 13

# Query specific line
node unified-query-engine.js 13 4

# Run tests
node tests/comprehensive-unified-query-tests.js  # 55 tests
node tests/adapted-old-tests.js                  # 34 tests
```

## 📖 API Usage

```javascript
const { getGateKnowledge } = require('./unified-query-engine.js');

// Get complete knowledge for a gate
const gate13 = getGateKnowledge(13);
console.log(gate13.geneKeys.shadow);        // "Discord"
console.log(gate13.ichingName.chineseName); // "同人 (Tóng Rén)"
console.log(gate13.codonRing.ring);         // "Ring of Purification"
console.log(gate13.incarnationCrosses);     // All 4 positions

// Get line-level knowledge
const line = getGateKnowledge(13, 4);
console.log(line.lineKnowledge.lineKeynote);  // "Fatigue"
console.log(line.lineKnowledge.blackBook);    // Planetary assignments
```

## ⚡ Performance

- **Query speed:** ~0.016ms per gate (625x faster than threshold)
- **Test coverage:** 100% (55/55 comprehensive + 34/34 adapted tests)
- **Data integrity:** All 64 gates × 6 lines = 384 lines verified

## 📂 Project Structure

```
hd-knowledge-engine-v2/
├── core/                      # Calculation engine
│   └── root-system/           # Positioning algorithm
├── knowledge-systems/         # All 11 modular systems
│   ├── gene-keys/
│   ├── iching-names/
│   ├── hd-gates/
│   ├── hd-traditional-gates/
│   ├── quarters/
│   ├── trigrams/
│   ├── faces/
│   ├── codon-rings/
│   ├── channels/
│   ├── incarnation-crosses/
│   └── centers/
├── unified-query-engine.js    # Main query interface
├── tests/                     # Comprehensive test suites
└── package.json
```

## 🧪 Testing

```bash
# Comprehensive tests (all 11 systems)
node tests/comprehensive-unified-query-tests.js

# Adapted old test suite (100% backward compatibility on applicable tests)
node tests/adapted-old-tests.js
```

## 🔄 Migration from v1.x

See [MIGRATION.md](MIGRATION.md) for migration guide from monolithic v1.x system.

**Key Changes:**
- Monolithic database → Modular knowledge systems
- 4 systems → 11 systems
- Embedded data → Calculated on-demand
- `hd-query-engine.js` → `unified-query-engine.js`

## 📜 License

[Add your license here]

## 🙏 Credits

Human Design System by Ra Uru Hu
Gene Keys by Richard Rudd
