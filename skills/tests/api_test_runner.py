#!/usr/bin/env python3
"""
HD Skills — API Test Runner

Runs skill tests against Claude API and reports results.

Usage:
    python api_test_runner.py                    # Run all tests
    python api_test_runner.py --test Q1 Q2 Q3    # Run specific tests
    python api_test_runner.py --category integration  # Run category

Requirements:
    pip install anthropic

Environment:
    ANTHROPIC_API_KEY must be set
"""

import os
import sys
import json
import time
from pathlib import Path
from typing import List, Dict, Optional

# Check for API key early
if not os.environ.get("ANTHROPIC_API_KEY"):
    print("❌ Error: ANTHROPIC_API_KEY environment variable not set")
    print("   Set it with: export ANTHROPIC_API_KEY='your-key-here'")
    sys.exit(1)

try:
    import anthropic
except ImportError:
    print("❌ Error: anthropic package not installed")
    print("   Install with: pip install anthropic")
    sys.exit(1)


# Configuration
SKILLS_DIR = Path(__file__).parent.parent
PROMPTS_DIR = SKILLS_DIR / "tests" / "generated_prompts"
MODEL = "claude-sonnet-4-20250514"  # Fast model for testing
MAX_TOKENS = 2000
RATE_LIMIT_DELAY = 1.0  # Seconds between API calls


def ensure_prompts_exist():
    """Check that test prompts have been generated."""
    manifest_file = PROMPTS_DIR / "manifest.json"
    if not manifest_file.exists():
        print("❌ Test prompts not generated yet.")
        print("   Run: python run_skill_tests.py --generate-prompts")
        sys.exit(1)
    return json.loads(manifest_file.read_text())


def run_single_test(client: anthropic.Anthropic, test_info: Dict) -> Dict:
    """Run a single test and return results."""
    prompt_file = PROMPTS_DIR / test_info["prompt_file"]
    criteria_file = PROMPTS_DIR / test_info["criteria_file"]
    
    prompt = prompt_file.read_text()
    criteria = json.loads(criteria_file.read_text())
    
    # Call Claude API
    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            messages=[{"role": "user", "content": prompt}]
        )
        response_text = response.content[0].text
    except Exception as e:
        return {
            "test_id": test_info["test_id"],
            "passed": False,
            "error": str(e),
            "response": None
        }
    
    # Evaluate response
    response_lower = response_text.lower()
    must_contain = criteria.get("must_contain", [])
    must_not_contain = criteria.get("must_not_contain", [])
    
    missing = [term for term in must_contain if term.lower() not in response_lower]
    unwanted = [term for term in must_not_contain if term.lower() in response_lower]
    
    passed = len(missing) == 0 and len(unwanted) == 0
    
    return {
        "test_id": test_info["test_id"],
        "category": test_info["category"],
        "query": criteria["query"],
        "passed": passed,
        "missing": missing,
        "unwanted": unwanted,
        "response_preview": response_text[:500] + "..." if len(response_text) > 500 else response_text
    }


def run_tests(test_ids: Optional[List[str]] = None, category: Optional[str] = None):
    """Run specified tests or all tests."""
    manifest = ensure_prompts_exist()
    client = anthropic.Anthropic()
    
    # Filter tests
    tests_to_run = manifest
    if test_ids:
        tests_to_run = [t for t in manifest if t["test_id"] in test_ids]
    if category:
        tests_to_run = [t for t in manifest if t["category"] == category]
    
    if not tests_to_run:
        print("❌ No tests match the specified criteria")
        sys.exit(1)
    
    print("=" * 60)
    print(f"HD SKILLS API TEST RUNNER")
    print(f"Model: {MODEL}")
    print(f"Tests to run: {len(tests_to_run)}")
    print("=" * 60)
    
    results = []
    passed_count = 0
    failed_count = 0
    
    for i, test_info in enumerate(tests_to_run):
        print(f"\n[{i+1}/{len(tests_to_run)}] Running {test_info['test_id']}...", end=" ", flush=True)
        
        result = run_single_test(client, test_info)
        results.append(result)
        
        if result.get("error"):
            print(f"❌ ERROR: {result['error']}")
            failed_count += 1
        elif result["passed"]:
            print("✅ PASS")
            passed_count += 1
        else:
            print("❌ FAIL")
            if result["missing"]:
                print(f"      Missing: {result['missing']}")
            if result["unwanted"]:
                print(f"      Unwanted: {result['unwanted']}")
            failed_count += 1
        
        # Rate limiting
        if i < len(tests_to_run) - 1:
            time.sleep(RATE_LIMIT_DELAY)
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total:  {len(results)}")
    print(f"Passed: {passed_count} ✅")
    print(f"Failed: {failed_count} ❌")
    print(f"Rate:   {passed_count/len(results)*100:.1f}%")
    
    # Save detailed results
    results_file = PROMPTS_DIR / "test_results.json"
    results_file.write_text(json.dumps(results, indent=2))
    print(f"\nDetailed results saved to: {results_file}")
    
    # Category breakdown
    if len(set(r["category"] for r in results)) > 1:
        print("\nBy Category:")
        categories = {}
        for r in results:
            cat = r["category"]
            if cat not in categories:
                categories[cat] = {"passed": 0, "total": 0}
            categories[cat]["total"] += 1
            if r["passed"]:
                categories[cat]["passed"] += 1
        
        for cat, stats in sorted(categories.items()):
            rate = stats["passed"] / stats["total"] * 100
            status = "✅" if rate == 100 else "⚠️" if rate >= 50 else "❌"
            print(f"  {status} {cat}: {stats['passed']}/{stats['total']} ({rate:.0f}%)")
    
    return 0 if failed_count == 0 else 1


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--test", nargs="+", help="Specific test IDs to run (e.g., Q1 Q2)")
    parser.add_argument("--category", help="Run tests in a specific category")
    parser.add_argument("--list", action="store_true", help="List available tests")
    
    args = parser.parse_args()
    
    if args.list:
        manifest = ensure_prompts_exist()
        print("Available Tests:")
        for test in manifest:
            print(f"  {test['test_id']}: [{test['category']}]")
        sys.exit(0)
    
    exit_code = run_tests(test_ids=args.test, category=args.category)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
