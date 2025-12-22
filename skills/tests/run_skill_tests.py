#!/usr/bin/env python3
"""
HD Skills Test Harness

This script validates the skill files and generates test prompts that can be
used to verify the skills work correctly when loaded into Claude's context.

Usage:
    python run_skill_tests.py --validate          # Check skill structure
    python run_skill_tests.py --generate-prompts  # Create test prompts
    python run_skill_tests.py --full              # Both validation and prompts
"""

import os
import json
import re
from pathlib import Path
from dataclasses import dataclass
from typing import List, Dict, Optional

# Configuration
SKILLS_DIR = Path(__file__).parent.parent
SKILLS = ['hd-mathematics', 'hd-electromagnetic-framework']

@dataclass
class TestCase:
    """A single test case for skill validation."""
    id: str
    query: str
    skill_expected: str  # Which skill should trigger
    must_contain: List[str]  # Phrases that must appear in response
    must_not_contain: List[str] = None  # Phrases that should NOT appear
    category: str = "general"

# Define all test cases
TEST_CASES = [
    # Mathematics skill tests
    TestCase(
        id="Q1",
        query="Why is Fire at position -2?",
        skill_expected="hd-mathematics",
        must_contain=["complement", "Water", "spread", "yang", "-2"],
        category="position_derivation"
    ),
    TestCase(
        id="Q2", 
        query="What is the binary pattern of Gate 11?",
        skill_expected="hd-mathematics",
        must_contain=["111000", "Heaven", "Earth", "-4", "+4", "cross-zero", "manifesting"],
        category="gate_classification"
    ),
    TestCase(
        id="Q3",
        query="Which gates have amplitude 8?",
        skill_expected="hd-mathematics",
        must_contain=["11", "12", "Poles"],
        category="amplitude"
    ),
    TestCase(
        id="Q4",
        query="Calculate the complement of Thunder.",
        skill_expected="hd-mathematics",
        must_contain=["Wind", "100", "011", "+1", "-1"],
        category="complement"
    ),
    TestCase(
        id="Q5",
        query="Is Gate 29 a standing wave?",
        skill_expected="hd-mathematics",
        must_contain=["yes", "Water", "010", "+2", "Current"],
        category="gate_classification"
    ),
    TestCase(
        id="Q6",
        query="What type of gate is Gate 44?",
        skill_expected="hd-mathematics",
        must_contain=["same-phase", "void", "Wind", "Heaven", "-1", "-4"],
        category="gate_classification"
    ),
    TestCase(
        id="Q7",
        query="List all standing waves.",
        skill_expected="hd-mathematics",
        must_contain=["1", "2", "29", "30", "51", "52", "57", "58"],
        category="gate_classification"
    ),
    
    # Framework skill tests
    TestCase(
        id="Q8",
        query="What does position +2 mean?",
        skill_expected="hd-electromagnetic-framework",
        must_contain=["Current", "flow", "depth", "Form"],
        category="position_meaning"
    ),
    TestCase(
        id="Q9",
        query="What is the difference between Gate-IN and Gate-OUT?",
        skill_expected="hd-electromagnetic-framework",
        must_contain=["Gate-IN", "+1", "Thunder", "entry", "Gate-OUT", "-1", "Wind", "release"],
        category="position_meaning"
    ),
    TestCase(
        id="Q10",
        query="How do I interpret Line 3 in a cross-zero gate?",
        skill_expected="hd-electromagnetic-framework",
        must_contain=["threshold", "crossing", "origin", "trial", "accept"],  # "accept" matches "acceptance" or "adaptation"
        category="line_interpretation"
    ),
    TestCase(
        id="Q11",
        query="What is special about Line 6 at Current (+2)?",
        skill_expected="hd-electromagnetic-framework",
        must_contain=["imprisonment", "prison", "flow", "trapped", "problematic"],
        category="completion_patterns"
    ),
    TestCase(
        id="Q12",
        query="What are the harmonic pairs?",
        skill_expected="hd-electromagnetic-framework",
        must_contain=["1-4", "2-5", "3-6", "Foundation", "Hermit", "Projection"],
        category="line_interpretation"
    ),
    TestCase(
        id="Q13",
        query="How do I read Gate 51 electromagnetically?",
        skill_expected="hd-electromagnetic-framework",
        must_contain=["standing wave", "+1", "Gate-IN", "Thunder", "shock", "limit"],
        category="gate_reading"
    ),
    TestCase(
        id="Q14",
        query="What is the threshold like in Gate 63?",
        skill_expected="hd-electromagnetic-framework",
        must_contain=["cross-zero", "Flow", "-2", "+2", "voltage", "current"],
        category="threshold"
    ),
    TestCase(
        id="Q15",
        query="Why does Gate 29 have problematic completion?",
        skill_expected="hd-electromagnetic-framework",
        must_contain=["+2", "Current", "flow", "trapped", "imprisoned"],
        category="completion_patterns"
    ),
    
    # Integration tests (need both skills)
    TestCase(
        id="Q16",
        query="Walk me through Gate 11 from binary to meaning.",
        skill_expected="both",
        must_contain=["111000", "Heaven", "Earth", "-4", "+4", "amplitude", "8", "Peace", "transformation"],
        category="integration"
    ),
    TestCase(
        id="Q17",
        query="Compare Gate 51 and Gate 57 as standing waves.",
        skill_expected="both",
        must_contain=["51", "57", "+1", "-1", "Gate-IN", "Gate-OUT", "Thunder", "Wind", "threshold"],
        category="integration"
    ),
]


def load_skill_content(skill_name: str) -> Dict[str, str]:
    """Load all content from a skill directory."""
    skill_dir = SKILLS_DIR / skill_name
    content = {}
    
    # Load SKILL.md
    skill_md = skill_dir / "SKILL.md"
    if skill_md.exists():
        content['SKILL.md'] = skill_md.read_text()
    
    # Load references
    refs_dir = skill_dir / "references"
    if refs_dir.exists():
        for ref_file in refs_dir.glob("*.md"):
            content[f"references/{ref_file.name}"] = ref_file.read_text()
    
    # Load scripts (for reference, not execution in this context)
    scripts_dir = skill_dir / "scripts"
    if scripts_dir.exists():
        for script_file in scripts_dir.glob("*.py"):
            content[f"scripts/{script_file.name}"] = script_file.read_text()
    
    return content


def validate_skill_structure(skill_name: str) -> List[str]:
    """Validate that a skill has required structure."""
    errors = []
    skill_dir = SKILLS_DIR / skill_name
    
    # Check SKILL.md exists
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.exists():
        errors.append(f"Missing SKILL.md in {skill_name}")
        return errors
    
    content = skill_md.read_text()
    
    # Check frontmatter
    if not content.startswith("---"):
        errors.append(f"{skill_name}: SKILL.md missing YAML frontmatter")
    else:
        # Extract frontmatter
        parts = content.split("---", 2)
        if len(parts) >= 3:
            frontmatter = parts[1]
            if "name:" not in frontmatter:
                errors.append(f"{skill_name}: Missing 'name' in frontmatter")
            if "description:" not in frontmatter:
                errors.append(f"{skill_name}: Missing 'description' in frontmatter")
    
    # Check references exist if referenced
    refs_dir = skill_dir / "references"
    if refs_dir.exists():
        ref_files = list(refs_dir.glob("*.md"))
        if not ref_files:
            errors.append(f"{skill_name}: references/ directory exists but is empty")
    
    return errors


def validate_skill_content(skill_name: str) -> List[str]:
    """Validate that skill content contains expected information."""
    errors = []
    content = load_skill_content(skill_name)
    
    if skill_name == "hd-mathematics":
        # Must have position derivation
        all_content = " ".join(content.values()).lower()
        required = ["complement", "spread", "magnitude", "yang count", "binary"]
        for req in required:
            if req not in all_content:
                errors.append(f"{skill_name}: Missing required concept '{req}'")
        
        # Must have all 8 positions
        for pos in ["-4", "-3", "-2", "-1", "+1", "+2", "+3", "+4"]:
            if pos not in all_content:
                errors.append(f"{skill_name}: Missing position {pos}")
    
    elif skill_name == "hd-electromagnetic-framework":
        all_content = " ".join(content.values()).lower()
        # Must have position meanings
        required = ["source", "sink", "current", "voltage", "capacitance", "inductance"]
        for req in required:
            if req not in all_content:
                errors.append(f"{skill_name}: Missing position meaning '{req}'")
        
        # Must have gate types
        gate_types = ["standing wave", "cross-zero", "same-phase"]
        for gt in gate_types:
            if gt not in all_content:
                errors.append(f"{skill_name}: Missing gate type '{gt}'")
    
    return errors


def generate_test_prompt(test_case: TestCase) -> str:
    """Generate a prompt that includes skill content and the test query."""
    
    # Load relevant skill(s)
    skills_to_load = []
    if test_case.skill_expected == "both":
        skills_to_load = SKILLS
    elif test_case.skill_expected in SKILLS:
        skills_to_load = [test_case.skill_expected]
    else:
        skills_to_load = SKILLS  # Load all if uncertain
    
    prompt_parts = []
    prompt_parts.append("# Skills Available\n")
    
    for skill_name in skills_to_load:
        content = load_skill_content(skill_name)
        prompt_parts.append(f"\n## {skill_name}\n")
        for filename, file_content in content.items():
            if filename.endswith('.md'):  # Only include markdown files in prompt
                prompt_parts.append(f"\n### {filename}\n")
                prompt_parts.append(file_content)
    
    prompt_parts.append("\n---\n")
    prompt_parts.append(f"\n# User Query\n\n{test_case.query}\n")
    
    return "\n".join(prompt_parts)


def generate_evaluation_criteria(test_case: TestCase) -> Dict:
    """Generate evaluation criteria for a test case."""
    return {
        "test_id": test_case.id,
        "query": test_case.query,
        "expected_skill": test_case.skill_expected,
        "category": test_case.category,
        "must_contain": test_case.must_contain,
        "must_not_contain": test_case.must_not_contain or [],
        "evaluation_prompt": f"""
Evaluate the response to the query: "{test_case.query}"

Check if the response contains these required elements (case-insensitive):
{json.dumps(test_case.must_contain, indent=2)}

The response PASSES if:
1. All required elements are present (or their clear equivalents)
2. The explanation is coherent and accurate
3. The skill navigation was appropriate

The response FAILS if:
1. Required elements are missing
2. The explanation contradicts the skill content
3. Wrong skill was used or skills weren't consulted
"""
    }


def run_validation() -> Dict:
    """Run all validation checks on skills."""
    results = {
        "structure_errors": [],
        "content_errors": [],
        "skills_validated": []
    }
    
    for skill_name in SKILLS:
        skill_dir = SKILLS_DIR / skill_name
        if not skill_dir.exists():
            results["structure_errors"].append(f"Skill directory not found: {skill_name}")
            continue
        
        # Structure validation
        struct_errors = validate_skill_structure(skill_name)
        results["structure_errors"].extend(struct_errors)
        
        # Content validation
        content_errors = validate_skill_content(skill_name)
        results["content_errors"].extend(content_errors)
        
        if not struct_errors and not content_errors:
            results["skills_validated"].append(skill_name)
    
    return results


def generate_all_prompts(output_dir: Path) -> None:
    """Generate test prompts for all test cases."""
    output_dir.mkdir(exist_ok=True)
    
    manifest = []
    
    for test_case in TEST_CASES:
        # Generate prompt
        prompt = generate_test_prompt(test_case)
        prompt_file = output_dir / f"{test_case.id}_prompt.md"
        prompt_file.write_text(prompt)
        
        # Generate evaluation criteria
        criteria = generate_evaluation_criteria(test_case)
        criteria_file = output_dir / f"{test_case.id}_criteria.json"
        criteria_file.write_text(json.dumps(criteria, indent=2))
        
        manifest.append({
            "test_id": test_case.id,
            "category": test_case.category,
            "prompt_file": str(prompt_file.name),
            "criteria_file": str(criteria_file.name)
        })
    
    # Write manifest
    manifest_file = output_dir / "manifest.json"
    manifest_file.write_text(json.dumps(manifest, indent=2))
    
    print(f"Generated {len(TEST_CASES)} test prompts in {output_dir}")


def main():
    import sys
    
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    
    arg = sys.argv[1]
    
    if arg == "--validate":
        print("=" * 60)
        print("SKILL VALIDATION")
        print("=" * 60)
        
        results = run_validation()
        
        if results["structure_errors"]:
            print("\n❌ Structure Errors:")
            for err in results["structure_errors"]:
                print(f"   - {err}")
        
        if results["content_errors"]:
            print("\n❌ Content Errors:")
            for err in results["content_errors"]:
                print(f"   - {err}")
        
        if results["skills_validated"]:
            print("\n✅ Skills Validated:")
            for skill in results["skills_validated"]:
                print(f"   - {skill}")
        
        total_errors = len(results["structure_errors"]) + len(results["content_errors"])
        print(f"\nTotal: {len(results['skills_validated'])} skills valid, {total_errors} errors")
        
        sys.exit(0 if total_errors == 0 else 1)
    
    elif arg == "--generate-prompts":
        output_dir = SKILLS_DIR / "tests" / "generated_prompts"
        generate_all_prompts(output_dir)
        print(f"\nPrompts generated in: {output_dir}")
        print("\nTo test manually:")
        print("1. Copy a prompt file content")
        print("2. Send to Claude")
        print("3. Compare response against criteria file")
    
    elif arg == "--full":
        # Run validation
        print("=" * 60)
        print("SKILL VALIDATION")
        print("=" * 60)
        results = run_validation()
        
        total_errors = len(results["structure_errors"]) + len(results["content_errors"])
        
        if total_errors > 0:
            print("\n❌ Validation failed. Fix errors before generating prompts.")
            if results["structure_errors"]:
                for err in results["structure_errors"]:
                    print(f"   - {err}")
            if results["content_errors"]:
                for err in results["content_errors"]:
                    print(f"   - {err}")
            sys.exit(1)
        
        print(f"\n✅ All {len(results['skills_validated'])} skills validated")
        
        # Generate prompts
        print("\n" + "=" * 60)
        print("GENERATING TEST PROMPTS")
        print("=" * 60)
        output_dir = SKILLS_DIR / "tests" / "generated_prompts"
        generate_all_prompts(output_dir)
    
    else:
        print(f"Unknown argument: {arg}")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
