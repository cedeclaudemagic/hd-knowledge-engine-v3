# Claude Code Session: Run API Tests for HD Skills

## Context

The HD Skills have been validated structurally. Now we need to run actual API tests to confirm Claude can answer queries correctly when the skill content is provided.

## Your Task

Run the API test suite against the Claude API.

---

## Step 1: Set Up Environment

```bash
cd /Volumes/CLAUDE/HD-Knowledge-Engine-V3/skills

# Set the API key
export ANTHROPIC_API_KEY="your-api-key-here"

# Verify it's set
echo "API key set: ${ANTHROPIC_API_KEY:0:20}..."
```

---

## Step 2: Install Dependencies

```bash
pip install anthropic
```

---

## Step 3: Ensure Test Prompts Exist

```bash
ls tests/generated_prompts/manifest.json
```

If not found, generate them:
```bash
python3 tests/run_skill_tests.py --generate-prompts
```

---

## Step 4: List Available Tests

```bash
python3 tests/api_test_runner.py --list
```

---

## Step 5: Run All Tests

```bash
python3 tests/api_test_runner.py
```

This will:
- Send each of the 17 test prompts to Claude
- Check if responses contain required terms
- Report pass/fail for each test
- Save detailed results to `tests/generated_prompts/test_results.json`

---

## Step 6: Review Results

If any tests fail, examine the detailed results:

```bash
cat tests/generated_prompts/test_results.json
```

Look for:
- Which tests failed
- What terms were missing
- The response preview to understand what went wrong

---

## Step 7: Report Summary

Provide a summary including:

1. **Overall Results:** X/17 tests passed
2. **Pass Rate:** X%
3. **Failed Tests:** List any that failed and why
4. **Category Breakdown:** Which categories performed well/poorly
5. **Recommendations:** Any issues to address

---

## Expected Output

You should see something like:

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

---

## Troubleshooting

**If you get authentication errors:**
- Verify the API key is correctly set
- Check the key hasn't expired

**If you get rate limit errors:**
- The script has a 1-second delay between calls
- If still hitting limits, increase RATE_LIMIT_DELAY in the script

**If tests fail:**
- Check the "missing" terms in the output
- Review the corresponding skill content to see if terms need to be added

---

## After Testing

Report back with:
1. The full test output
2. Any failures and their details
3. The category breakdown
4. Any errors encountered
