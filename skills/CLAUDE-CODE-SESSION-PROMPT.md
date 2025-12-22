# Claude Code Session: HD Skills Validation & Testing

## Context

You are working on the HD Knowledge Engine V3 project, which contains skills for an electromagnetic interpretation framework of the I Ching and Human Design. Two skills have been created and need validation and testing:

1. **hd-mathematics** — Mathematical foundation (binary derivations, position calculations)
2. **hd-electromagnetic-framework** — Practical interpretation framework (position meanings, line dynamics)

The skills are located at:
```
/Volumes/CLAUDE/HD-Knowledge-Engine-V3/skills/
```

## Your Task

Execute the following steps in order, reporting results after each step.

---

## Step 1: Explore the Skills Directory

First, familiarise yourself with what exists:

```bash
cd /Volumes/CLAUDE/HD-Knowledge-Engine-V3/skills
ls -la
```

Then examine the structure:
```bash
find . -type f -name "*.md" -o -name "*.py" | head -30
```

**Report:** List what you find in the skills directory.

---

## Step 2: Validate Skill Structure

Run the validation script:

```bash
cd /Volumes/CLAUDE/HD-Knowledge-Engine-V3/skills
python3 tests/run_skill_tests.py --validate
```

**Report:** 
- Did validation pass?
- Were there any errors?
- Which skills were validated?

---

## Step 3: Generate Test Prompts

Generate the test prompts:

```bash
python3 tests/run_skill_tests.py --generate-prompts
```

**Report:**
- How many prompts were generated?
- Where were they saved?

---

## Step 4: Examine Generated Prompts

Look at what was generated:

```bash
ls -la tests/generated_prompts/
```

Then examine one prompt and its criteria:

```bash
head -100 tests/generated_prompts/Q1_prompt.md
cat tests/generated_prompts/Q1_criteria.json
```

**Report:**
- Describe the structure of a test prompt
- What does the criteria file contain?

---

## Step 5: Test the Python Calculator

The mathematics skill includes a Python calculator. Test it:

```bash
cd /Volumes/CLAUDE/HD-Knowledge-Engine-V3/skills/hd-mathematics/scripts
python3 calculate_position.py --all-positions
```

Then test a specific gate:
```bash
python3 calculate_position.py 11
```

**Report:**
- Did the calculator run successfully?
- What positions did it output?
- What did it report for Gate 11?

---

## Step 6: Manual Skill Test (Optional but Recommended)

Read the content of one skill and answer a test query yourself to verify the content is coherent.

```bash
cat /Volumes/CLAUDE/HD-Knowledge-Engine-V3/skills/hd-mathematics/SKILL.md
cat /Volumes/CLAUDE/HD-Knowledge-Engine-V3/skills/hd-mathematics/references/position-derivation.md
```

**Test Query:** "Why is Fire at position -2?"

Using only the skill content you just read, answer this query. Then check if your answer would pass the criteria:

```bash
cat tests/generated_prompts/Q1_criteria.json
```

**Report:**
- Could you answer the query from the skill content?
- Did your answer contain the required terms?

---

## Step 7: Summary Report

Provide a final summary:

1. **Validation Status:** Did both skills pass structural validation?
2. **Calculator Status:** Does the Python calculator work correctly?
3. **Content Quality:** Is the skill content sufficient to answer test queries?
4. **Issues Found:** List any problems discovered
5. **Recommendations:** Suggest any improvements

---

## Notes

- The API test runner (`api_test_runner.py`) requires an ANTHROPIC_API_KEY to run actual API tests. Skip this for now unless you have the key available.
- If any step fails, report the error message and continue to the next step.
- The goal is to validate that the skill architecture is sound and the content is coherent.

---

## Files Reference

Key files you'll be working with:

| File | Purpose |
|------|---------|
| `skills/README.md` | Overview of the skill system |
| `skills/SKILL-TESTS.md` | Human-readable test specifications |
| `skills/hd-mathematics/SKILL.md` | Main mathematics skill |
| `skills/hd-electromagnetic-framework/SKILL.md` | Main framework skill |
| `skills/tests/run_skill_tests.py` | Validation and prompt generation |
| `skills/tests/api_test_runner.py` | API-based test execution |

---

## Expected Outcome

After completing these steps, you should be able to confirm:
- ✅ Both skills are properly structured
- ✅ Test prompts can be generated
- ✅ The Python calculator produces correct results
- ✅ The skill content is sufficient for answering queries

Report back with your findings so we can proceed to the next phase (adding interpretation skills or running full API tests).
