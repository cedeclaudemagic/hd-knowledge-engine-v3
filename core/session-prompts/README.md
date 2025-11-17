# Session Prompt Index
## All Available Knowledge System Sessions

Use these prompts to start parallel Claude sessions. Each session will create a verified knowledge system that docks into the root.

## Available Sessions

### ✅ Completed Knowledge Systems

1. **Gene Keys** (`01-gene-keys-session.md`) ✅ MERGED
   - Difficulty: ⭐⭐ Easy
   - Time: ~30 minutes
   - Mappings: 64 (gate-level)
   - Source: `data/source/extracted/gene-keys-extracted-data.js`
   - Output: Shadow/Gift/Siddhi for all gates

2. **Codon Rings** (`02-codon-rings-session.md`) ✅ MERGED
   - Difficulty: ⭐⭐⭐ Medium
   - Time: ~45 minutes
   - Mappings: 64 (gate-level, but grouped into 22 rings)
   - Source: `data/source/extracted/codon-rings-manual-data.js`
   - Output: Amino acid correlations and ring assignments

3. **Incarnation Crosses** (`03-incarnation-crosses-session.md`) ✅ MERGED
   - Difficulty: ⭐⭐⭐⭐⭐ Complex
   - Time: ~90 minutes
   - Mappings: 64 gates, 192 crosses
   - Source: `data/source/extracted/incarnation-crosses-extracted-data.json`
   - Output: Many-to-many cross relationships
   - Note: Most complex - requires structure inversion

4. **Traditional HD Gates** (`04-traditional-gates-session.md`) ✅ MERGED
   - Difficulty: ⭐⭐⭐ Medium
   - Time: ~60 minutes
   - Mappings: 384 (line-level: 64 gates × 6 lines)
   - Source: `data/source/lines/merged-lines-with-positioning.json`
   - Output: Black Book + White Book line interpretations with planetary assignments
   - Note: Largest system (384 mappings)

### 📝 Gate-Level Systems (Simple, 64 mappings each)

5. **I Ching Gate Names** (`05-iching-gate-names-session.md`) ⭐ RECOMMENDED NEXT
   - Difficulty: ⭐ Very Easy
   - Time: ~20 minutes
   - Mappings: 64 (gate-level)
   - Source: `data/source/gates/complete-mappings.json`
   - Output: Traditional I Ching hexagram names + Chinese characters
   - **Perfect starting point for new sessions!**

6. **Human Design Gate Names** (`06-human-design-gates-session.md`)
   - Difficulty: ⭐ Very Easy
   - Time: ~25 minutes
   - Mappings: 64 (gate-level)
   - Source: `data/source/gates/complete-mappings.json`
   - Output: Ra's gate keywords, center assignments, channel associations

### 🔢 Grouping Systems (Root calculates, you provide meanings)

7. **The 4 Quarters** (`08-quarters-themes-session.md`) ⭐ EASIEST SYSTEM
   - Difficulty: ⭐ Very Easy
   - Time: ~15 minutes
   - Mappings: 4 (grouping-level)
   - Calculation: Root system (first 2 binary bits)
   - Output: Quarter themes (Mutation, Initiation, Duality, Civilisation)
   - **Simplest grouping system - great for understanding the pattern!**

8. **The 16 Faces** (`07-faces-mythology-session.md`)
   - Difficulty: ⭐⭐ Easy
   - Time: ~30 minutes
   - Mappings: 16 (grouping-level)
   - Calculation: Root system (first 4 binary bits, codon patterns)
   - Output: Mythological archetypes (Hades, Prometheus, Vishnu, etc.)
   - Note: Demonstrates how grouping systems work

9. **The 8 Trigrams** (`09-trigrams-meanings-session.md`)
   - Difficulty: ⭐⭐ Easy
   - Time: ~25 minutes
   - Mappings: 8 (grouping-level)
   - Calculation: Root system (3-bit patterns from upper/lower halves)
   - Output: Traditional I Ching trigram interpretations (Heaven, Earth, Thunder, etc.)
   - Note: Each gate has TWO trigrams (upper and lower)

### 🔗 Connection Systems (Relationships between gates)

10. **The 36 Channels** (`10-channels-definitions-session.md`)
    - Difficulty: ⭐⭐⭐ Medium
    - Time: ~60 minutes
    - Mappings: 36 (connection-level: gate pairs)
    - Source: `data/source/gates/gate-*.json` (extract channel pairs from each gate)
    - Output: Channel definitions with circuit assignments (Individual/Tribal/Collective)
    - Note: Need to normalize channel numbers (e.g., "1-8" not "8-1")

### 🏛️ Structural Systems (Containers)

11. **The 9 Centers** (`11-centers-meanings-session.md`)
    - Difficulty: ⭐⭐ Easy
    - Time: ~40 minutes
    - Mappings: 9 (structure-level: containers)
    - Source: `data/source/gates/gate-*.json` (extract center assignments)
    - Output: Energy center meanings with complete gate assignments (all 64 gates)
    - Note: Must verify all 64 gates are assigned to centers with no duplicates

## How to Use These Prompts

### For Each Session:

1. **Start a NEW Claude session**
2. **Copy the entire prompt file** and paste it
3. **Claude will**:
   - Create the branch
   - Extract/transform the data
   - Create the mapping file
   - Write tests
   - Verify against root system
   - Commit and push

4. **When Claude finishes**, you'll have:
   - A new branch with complete mappings
   - All tests passing
   - Verification passed
   - Ready to merge

### Parallelization Strategy

**Phase 1** (Easiest - Great starting points):
- Session 1: **Quarters** (15 min) ⭐ EASIEST
- Session 2: **I Ching Gate Names** (20 min) ⭐ SIMPLEST GATE-LEVEL
- Session 3: **Human Design Gate Names** (25 min)

**Phase 2** (Simple grouping systems):
- Session 4: **Trigrams** (25 min)
- Session 5: **Faces** (30 min)
- Session 6: **Centers** (40 min)

**Phase 3** (More complex):
- Session 7: **Channels** (60 min)

**All sessions can run in PARALLEL** - they work on different branches and never conflict!

## Current Status

✅ **Root System Ready** - All sessions can start
- `core/root-system/` complete
- Docking interface operational
- Verification protocol working

✅ **Completed Systems** (4 merged):
- ✅ Gene Keys (64 gates)
- ✅ Codon Rings (22 rings, 64 gates)
- ✅ Incarnation Crosses (192 crosses)
- ✅ Traditional HD Gates (384 lines)

📝 **Ready to Build** (7 new prompts):
- 📝 I Ching Gate Names (05)
- 📝 Human Design Gates (06)
- 📝 16 Faces (07)
- 📝 4 Quarters (08)
- 📝 8 Trigrams (09)
- 📝 36 Channels (10)
- 📝 9 Centers (11)

## Understanding System Types

### Gate-Level Systems
- **Format**: One mapping per gate (64 total)
- **lineNumber**: Always `null`
- **Examples**: Gene Keys, I Ching Names, HD Gate Names

### Line-Level Systems
- **Format**: Six mappings per gate (384 total)
- **lineNumber**: 1-6
- **Examples**: Traditional HD Gates (Black/White Book)

### Grouping Systems
- **Format**: One mapping per group
- **Calculated**: Root system determines which gates belong to which group
- **Your job**: Provide MEANINGS for each group
- **Examples**: Quarters (4), Faces (16), Trigrams (8)

### Connection Systems
- **Format**: One mapping per connection
- **Structure**: Gate pairs (e.g., "1-8")
- **Examples**: Channels (36 gate pairs)

### Structure Systems
- **Format**: One mapping per container
- **Structure**: Containers with gate lists
- **Examples**: Centers (9 centers containing all 64 gates)

## Benefits of This Approach

- ✅ **Parallel work**: Run multiple sessions simultaneously
- ✅ **Isolated**: Each session works on different system
- ✅ **Verified**: Each system self-tests before merge
- ✅ **Consistent**: All dock into same mathematical root
- ✅ **Scalable**: Add new systems without breaking existing ones

## Verification Before Merging

Each session MUST pass:
```bash
cd knowledge-systems/[system-name]
./verify.sh
# Exit code 0 = ready to merge
```

All systems dock into the same root, so no conflicts.

## Next Steps

**Recommended order for maximum efficiency:**

1. **Start with Quarters** (⭐ Easiest) - Understand grouping systems
2. **Then I Ching Names** (⭐ Simple) - Understand gate-level systems
3. **Then Human Design Gates** - Build on gate-level pattern
4. **Then Trigrams** - More grouping practice
5. **Then Faces** - Advanced grouping
6. **Then Centers** - Understand structural systems
7. **Finally Channels** - Most complex connections

Or run all 7 sessions **in parallel** and merge them together when complete!

## Template for Creating New Prompts

If you want to create additional session prompts beyond these 11, use this structure:

```markdown
# Session Prompt: [System Name]

## Context
(Explain root docking system exists)

## Your Mission
1. Create branch
2. Extract data from source
3. Create mapping file
4. Verify
5. Create tests
6. Commit and push

## Data Source
(Where to find the data)

## Mapping Format
(Example JSON structure)

## Verification Criteria
(What tests must pass)

## Success Criteria
(What deliverables are needed)
```

All sessions dock into the root system at `core/root-system/` which handles:
- Binary patterns for all 64 gates
- Wheel positioning (true sequence [41,19,13...])
- Quarter/Face/Trigram calculations
- Docking validation

Your job is to provide the **MEANINGS**, not the math!
