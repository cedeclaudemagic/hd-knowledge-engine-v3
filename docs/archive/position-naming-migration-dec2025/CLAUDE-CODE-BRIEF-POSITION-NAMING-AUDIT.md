# CLAUDE CODE BRIEF: Comprehensive Position-Naming Audit Report

## Mission Statement

Produce a detailed audit report identifying ALL potential issues with the position-based naming replacements. We need to verify the replacements were done correctly and identify any cases that need correction.

**Date:** 22 December 2025  
**Priority:** HIGH  
**Output:** A comprehensive report at `/docs/POSITION-NAMING-AUDIT-REPORT.md`

---

## CONTEXT

A previous Claude Code session replaced ~149 "Book X" references with position-based naming across 37+ files. We need to verify:

1. **Ambiguous replacements** — Where "Position +1" appears without the title "(The Wave)"
2. **Over-zealous replacements** — Where historical context was incorrectly modified
3. **Context appropriateness** — Whether replacements make sense in their location
4. **Readability** — Whether prose still reads naturally

---

## THE POSITION MAPPING (For Reference)

| Old Name | New Position | Full Form (Preferred) |
|----------|--------------|----------------------|
| Book 0 | Position -2 | Position -2 (The Shape of Change) |
| Book 1 | Position +1 | Position +1 (The Wave) |
| Book 2 | Position -1 | Position -1 (The Proof) |
| Book 3 (Depth) | Position -3 | Position -3 (The Depth) |
| Book 3 (Arch) | Position +3 | Position +3 (The Architecture) |
| Book 4 | Position +3 | Position +3 (The Architecture) |

---

## AUDIT TASK 1: Find All Position References

Search for ALL occurrences of position references across the docs directory (excluding archive):

```bash
# Find all position mentions
grep -rn "Position -4\|Position -3\|Position -2\|Position -1\|Position +1\|Position +2\|Position +3\|Position +4" \
  /Volumes/CLAUDE/HD-Knowledge-Engine-V3/docs/ \
  --include="*.md" | grep -v archive
```

For EACH occurrence found, record:
1. File path
2. Line number
3. The full line of text
4. Whether it includes the title (e.g., "(The Wave)")
5. Context type: PROSE / TABLE / CODE / HEADER / LIST

---

## AUDIT TASK 2: Identify Ambiguous References

Flag any occurrence where:
- "Position +1" appears WITHOUT "(The Wave)" following it
- "Position -1" appears WITHOUT "(The Proof)" following it
- "Position -2" appears WITHOUT "(The Shape of Change)" following it
- etc.

**Exception:** Tables and technical references may legitimately use short form.

For each ambiguous reference, assess:
- Is this in flowing prose (reader would be confused)?
- Is this in a table cell (short form acceptable)?
- Is this in a technical cross-reference (context clear from surroundings)?

---

## AUDIT TASK 3: Check Historical Notes in Audit Files

The audit files should have notes like:
```markdown
> **Note:** This audit was conducted when the work was named "Book X".
> This work is now Position Y: [Title].
```

Check these specific files:
- `/docs/research/audit/PHASE-1A-BOOK-0-AUDIT.md`
- `/docs/research/audit/PHASE-1B-BOOK-1-AUDIT.md`
- `/docs/research/audit/PHASE-1C-BOOK-2-AUDIT.md`
- `/docs/research/audit/PHASE-1E-BOOK-3-AUDIT.md`

**Verify:** The note should say "was named 'Book X'" NOT "was named 'Position X'"

If the note incorrectly says "was named 'Position X'", this is an error — the historical reference was over-written.

---

## AUDIT TASK 4: Check Cross-Reference Matrix

File: `/docs/research/audit/PHASE-3-CROSS-REFERENCE-MATRIX.md`

This file uses abbreviations like B0, B1, B2 in table cells. Verify:
1. Is there a clear key mapping these to positions?
2. Are the abbreviations still present (they should be for table density)?
3. Does the key correctly explain the mapping?

---

## AUDIT TASK 5: Sample Prose Readability

Read the first 2-3 paragraphs of these files and assess whether the position references read naturally:

1. `/docs/books/position-minus-1-the-proof/07-em-positions-emergent.md`
2. `/docs/books/position-minus-1-the-proof/00-BOOK-2-OUTLINE.md`
3. `/docs/books/series/reflections/00-the-breath-and-the-bones.md`
4. `/docs/research/DERIVATION-COMPARISON-SYNTHESIS.md`

For each, note:
- Does it read naturally?
- Are titles included where helpful?
- Any awkward constructions?

---

## AUDIT TASK 6: Check for Orphaned "Book" References

Search for any remaining "Book" references that might have been missed:

```bash
grep -rn "Book 0\|Book 1\|Book 2\|Book 3\|Book 4" \
  /Volumes/CLAUDE/HD-Knowledge-Engine-V3/docs/ \
  --include="*.md" | grep -v archive | grep -v BRIEF | grep -v "Legacy"
```

Any results here (outside of Legacy Naming sections) would indicate incomplete replacements.

---

## AUDIT TASK 7: Check Directory/File Name References

Some files reference old directory names in their content. Search for:

```bash
grep -rn "book-0-\|book-1-\|book-2-\|book-3-\|EM-Series-Book" \
  /Volumes/CLAUDE/HD-Knowledge-Engine-V3/docs/ \
  --include="*.md" | grep -v archive
```

These path references should have been updated to position-based directory names.

---

## REPORT FORMAT

Create `/docs/POSITION-NAMING-AUDIT-REPORT.md` with the following structure:

```markdown
# Position-Based Naming Audit Report

**Date:** 22 December 2025
**Auditor:** Claude Code
**Scope:** All files in /docs/ (excluding /archive/)

---

## Executive Summary

- Total position references found: [NUMBER]
- References with full title: [NUMBER] 
- References without title (ambiguous): [NUMBER]
- Historical note errors: [NUMBER]
- Remaining "Book X" references: [NUMBER]
- Path reference errors: [NUMBER]

**Overall Assessment:** [PASS/NEEDS FIXES/SIGNIFICANT ISSUES]

---

## Section 1: Ambiguous Position References

### Files with Position References Missing Titles

| File | Line | Reference | Context Type | Needs Fix? |
|------|------|-----------|--------------|------------|
| [path] | [#] | "Position +1" | PROSE | YES |
| [path] | [#] | "Position -2" | TABLE | NO |
| ... | ... | ... | ... | ... |

### Assessment

[Narrative explaining the pattern — are most ambiguous refs in tables (acceptable) or prose (problematic)?]

---

## Section 2: Historical Note Errors

### Audit Files with Incorrect Historical Notes

| File | Current Text | Should Be |
|------|--------------|-----------|
| PHASE-1A-BOOK-0-AUDIT.md | "was named 'Position -2'" | "was named 'Book 0'" |
| ... | ... | ... |

---

## Section 3: Cross-Reference Matrix Status

- Key present: YES/NO
- Key accurate: YES/NO
- Abbreviations preserved: YES/NO
- Notes: [any issues]

---

## Section 4: Prose Readability Samples

### File: [name]
**Assessment:** [Reads naturally / Awkward / Needs revision]
**Notes:** [specific observations]

[Repeat for each sampled file]

---

## Section 5: Orphaned "Book X" References

[List any remaining Book X references found outside Legacy sections]

---

## Section 6: Path Reference Errors

[List any references to old directory paths like book-0-shape-of-change]

---

## Section 7: Recommended Fixes

### Critical (Must Fix)
1. [specific fix needed]
2. [specific fix needed]

### Minor (Should Fix)
1. [specific fix needed]
2. [specific fix needed]

### Acceptable (No Action Needed)
1. [explanation of why certain things are fine as-is]

---

## Appendix A: Complete Position Reference Inventory

[Full list of every position reference found, organised by file]

---

## Appendix B: Files Modified in Original Update

[List of all 37+ files that were modified, for reference]
```

---

## SUCCESS CRITERIA

The report should:
1. Be comprehensive — cover ALL position references
2. Clearly distinguish problematic vs. acceptable cases
3. Provide specific file paths and line numbers for any issues
4. Include recommended fixes with exact text changes needed
5. Give confidence that we understand the full scope of any problems

---

## IMPORTANT NOTES

1. **Don't make any changes** — this is an audit only
2. **Be thorough** — check every file, don't sample
3. **Provide context** — for each issue, include enough surrounding text to understand
4. **Distinguish severity** — not all missing titles are errors (tables are fine)
5. **Focus on prose** — the main concern is whether book content reads naturally

---

*Brief created: 22 December 2025*
*Purpose: Comprehensive audit before determining what fixes are needed*

