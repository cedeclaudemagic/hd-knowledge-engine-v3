# HD Skills — Test Framework

This directory contains skills for the Human Design Electromagnetic Framework, along with a test harness for validation.

## Directory Structure

```
skills/
├── README.md                         ← This file
├── SKILL-TESTS.md                    ← Human-readable test specifications
│
├── hd-mathematics/                   ← Layer 0: Mathematical Foundation
│   ├── SKILL.md                      ← Main skill file (triggers + core instructions)
│   ├── references/
│   │   ├── position-derivation.md    ← Complete derivation algorithm
│   │   └── binary-tables.md          ← All 64 gates classified
│   └── scripts/
│       └── calculate_position.py     ← Executable calculator
│
├── hd-electromagnetic-framework/     ← Layer 1: Practical Framework  
│   ├── SKILL.md                      ← Main skill file
│   └── references/
│       ├── position-qualities.md     ← What each position means
│       ├── line-dynamics.md          ← How lines function
│       └── threshold-mechanics.md    ← The 3→4 crossing
│
└── tests/
    ├── run_skill_tests.py            ← Test harness script
    └── generated_prompts/            ← Generated test prompts (after running)
```

## For Claude Code: How to Test These Skills

### Step 1: Validate Skill Structure

```bash
cd /Volumes/CLAUDE/HD-Knowledge-Engine-V3/skills
python tests/run_skill_tests.py --validate
```

This checks that:
- All SKILL.md files exist and have proper frontmatter
- Required concepts are present in each skill
- References are properly structured

### Step 2: Generate Test Prompts

```bash
python tests/run_skill_tests.py --generate-prompts
```

This creates `tests/generated_prompts/` containing:
- `Q1_prompt.md` through `Q17_prompt.md` — Full prompts with skill content + query
- `Q1_criteria.json` through `Q17_criteria.json` — Evaluation criteria for each test
- `manifest.json` — Index of all tests

### Step 3: Run Full Validation

```bash
python tests/run_skill_tests.py --full
```

This runs validation first, then generates prompts if validation passes.

### Step 4: Execute Tests

The generated prompts can be tested in two ways:

**Option A: Manual Testing**
1. Open a prompt file (e.g., `Q1_prompt.md`)
2. Send the content to Claude
3. Compare the response against criteria in `Q1_criteria.json`
4. Record pass/fail

**Option B: API Testing (recommended for Claude Code)**
```python
import anthropic
import json
from pathlib import Path

client = anthropic.Anthropic()
prompts_dir = Path("tests/generated_prompts")
manifest = json.loads((prompts_dir / "manifest.json").read_text())

results = []
for test in manifest:
    prompt = (prompts_dir / test["prompt_file"]).read_text()
    criteria = json.loads((prompts_dir / test["criteria_file"]).read_text())
    
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    response_text = response.content[0].text.lower()
    
    # Check required elements
    passed = all(term.lower() in response_text for term in criteria["must_contain"])
    
    results.append({
        "test_id": test["test_id"],
        "passed": passed,
        "missing": [t for t in criteria["must_contain"] if t.lower() not in response_text]
    })

# Output results
for r in results:
    status = "✅" if r["passed"] else "❌"
    print(f"{status} {r['test_id']}: {'PASS' if r['passed'] else 'FAIL'}")
    if r["missing"]:
        print(f"   Missing: {r['missing']}")
```

## Test Categories

| Category | Tests | What It Validates |
|----------|-------|-------------------|
| position_derivation | Q1, Q4 | Can derive positions from binary |
| gate_classification | Q2, Q5, Q6, Q7 | Can classify gates by type |
| amplitude | Q3 | Understands amplitude calculation |
| position_meaning | Q8, Q9 | Can explain what positions mean |
| line_interpretation | Q10, Q12 | Understands line dynamics |
| completion_patterns | Q11, Q15 | Knows completion varies by position |
| gate_reading | Q13 | Can read a specific gate |
| threshold | Q14 | Understands threshold mechanics |
| integration | Q16, Q17 | Uses both skills together |

## Expected Outcomes

**All tests passing** means:
- The mathematical derivations are correctly encoded
- The framework meanings are properly referenced
- The skills trigger on appropriate queries
- Integration between skills works

**Failing tests** indicate:
- Missing content in skill files
- Incorrect trigger descriptions
- Navigation problems between skills

## Adding New Skills

To add a new skill (e.g., `hd-interpretations`):

1. Create directory: `skills/hd-interpretations/`
2. Create `SKILL.md` with frontmatter and instructions
3. Add `references/` with supporting content
4. Add skill name to `SKILLS` list in `run_skill_tests.py`
5. Add test cases to `TEST_CASES` list
6. Run validation and tests

## Skill Architecture Principles

1. **Progressive Disclosure**: SKILL.md contains triggers and core instructions; references contain depth
2. **Calculation-First**: Mathematics skill can calculate, not just lookup
3. **Layered Navigation**: Mathematics (Layer 0) → Framework (Layer 1) → Interpretations (Layer 2)
4. **Structure Generates Meaning**: The framework reveals why things mean what they mean
