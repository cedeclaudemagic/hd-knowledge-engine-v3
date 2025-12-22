# Claude Code Instructions — Testing HD Skills

This document explains how to test the HD Skills using Claude Code.

## Quick Start

```bash
# Navigate to skills directory
cd /Volumes/CLAUDE/HD-Knowledge-Engine-V3/skills

# Step 1: Validate skill structure
python tests/run_skill_tests.py --validate

# Step 2: Generate test prompts
python tests/run_skill_tests.py --generate-prompts

# Step 3: Run API tests (requires ANTHROPIC_API_KEY)
export ANTHROPIC_API_KEY="your-key-here"
pip install anthropic
python tests/api_test_runner.py
```

## What Each Step Does

### Step 1: Validation
Checks that skill files are properly structured:
- SKILL.md exists with proper YAML frontmatter
- Required concepts are present
- References are properly organised

**Expected output:**
```
✅ Skills Validated:
   - hd-mathematics
   - hd-electromagnetic-framework

Total: 2 skills valid, 0 errors
```

### Step 2: Generate Prompts
Creates test prompts in `tests/generated_prompts/`:
- Each prompt combines skill content + a test query
- Each criteria file specifies what the response must contain
- Manifest lists all tests

**Files created:**
- `Q1_prompt.md` through `Q17_prompt.md`
- `Q1_criteria.json` through `Q17_criteria.json`
- `manifest.json`

### Step 3: API Testing
Sends prompts to Claude API and evaluates responses:
- Checks if required terms appear in response
- Reports pass/fail for each test
- Saves detailed results to `test_results.json`

**Expected output:**
```
HD SKILLS API TEST RUNNER
Model: claude-sonnet-4-20250514
Tests to run: 17
============================================================

[1/17] Running Q1... ✅ PASS
[2/17] Running Q2... ✅ PASS
...

SUMMARY
============================================================
Total:  17
Passed: 17 ✅
Failed: 0 ❌
Rate:   100.0%
```

## Running Specific Tests

```bash
# Run only specific tests
python tests/api_test_runner.py --test Q1 Q2 Q16

# Run only integration tests
python tests/api_test_runner.py --category integration

# List all available tests
python tests/api_test_runner.py --list
```

## Test Categories

| Category | Tests | Purpose |
|----------|-------|---------|
| position_derivation | Q1, Q4 | Mathematical derivation |
| gate_classification | Q2, Q5, Q6, Q7 | Gate type identification |
| amplitude | Q3 | Amplitude calculations |
| position_meaning | Q8, Q9 | Framework interpretation |
| line_interpretation | Q10, Q12 | Line dynamics |
| completion_patterns | Q11, Q15 | Position-specific completion |
| gate_reading | Q13 | Full gate interpretation |
| threshold | Q14 | Threshold mechanics |
| integration | Q16, Q17 | Both skills together |

## Interpreting Results

### All Tests Pass
Skills are working correctly. The mathematical derivations are properly encoded, and the framework meanings are correctly referenced.

### Some Tests Fail
Check the "missing" terms in the output:
- If mathematical terms missing → Check `hd-mathematics/references/`
- If meaning terms missing → Check `hd-electromagnetic-framework/references/`
- If both missing → Check skill trigger descriptions in SKILL.md

### Common Issues

1. **"Missing: complement"** — Position derivation not being accessed
2. **"Missing: imprisonment"** — Completion patterns reference not loaded
3. **"Missing: threshold"** — Threshold mechanics not being applied

## Extending Tests

To add new tests, edit `tests/run_skill_tests.py`:

```python
TEST_CASES.append(
    TestCase(
        id="Q18",
        query="Your new test query here",
        skill_expected="hd-mathematics",  # or "hd-electromagnetic-framework" or "both"
        must_contain=["term1", "term2"],
        category="your_category"
    )
)
```

Then regenerate prompts:
```bash
python tests/run_skill_tests.py --generate-prompts
```

## Next Steps After Testing

Once tests pass:

1. **Add interpretation skill** — Convert the 64 gate interpretations into a third skill
2. **Add oracle skill** — Create the 384-line oracle skill
3. **Integration testing** — Verify all skills work together
4. **Package for distribution** — Create .skill files for sharing
