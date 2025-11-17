#!/bin/bash
################################################################################
# 4 Quarters Knowledge System - Verification Script
#
# Quick verification that the quarters system is properly structured and
# contains all required elements before running comprehensive tests.
#
# @version 1.0.0
# @author HD Knowledge Engine
################################################################################

echo "🔍 4 Quarters Knowledge System - Verification"
echo "============================================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

MAPPING_FILE="mappings/quarters-mappings.json"
TEST_FILE="tests/quarters-tests.js"
README_FILE="README.md"

VERIFICATION_PASSED=true

# =====================================================================
# FILE EXISTENCE CHECKS
# =====================================================================

echo "📁 File Existence Checks"
echo "------------------------------------------------------------"

if [ ! -f "$MAPPING_FILE" ]; then
  echo -e "${RED}❌ Mapping file not found: $MAPPING_FILE${NC}"
  VERIFICATION_PASSED=false
else
  echo -e "${GREEN}✅ Mapping file exists: $MAPPING_FILE${NC}"
fi

if [ ! -f "$TEST_FILE" ]; then
  echo -e "${RED}❌ Test file not found: $TEST_FILE${NC}"
  VERIFICATION_PASSED=false
else
  echo -e "${GREEN}✅ Test file exists: $TEST_FILE${NC}"
fi

if [ ! -f "$README_FILE" ]; then
  echo -e "${YELLOW}⚠️  README file not found: $README_FILE${NC}"
else
  echo -e "${GREEN}✅ README file exists: $README_FILE${NC}"
fi

# =====================================================================
# MAPPING FILE STRUCTURE CHECKS
# =====================================================================

echo ""
echo "📋 Mapping File Structure Checks"
echo "------------------------------------------------------------"

if [ -f "$MAPPING_FILE" ]; then
  # Check if file is valid JSON
  if ! node -e "JSON.parse(require('fs').readFileSync('$MAPPING_FILE', 'utf8'))" 2>/dev/null; then
    echo -e "${RED}❌ Mapping file is not valid JSON${NC}"
    VERIFICATION_PASSED=false
  else
    echo -e "${GREEN}✅ Mapping file is valid JSON${NC}"

    # Extract key values using Node
    SYSTEM_NAME=$(node -p "require('./$MAPPING_FILE').systemName" 2>/dev/null)
    TOTAL_GROUPS=$(node -p "require('./$MAPPING_FILE').totalGroups" 2>/dev/null)
    MAPPING_COUNT=$(node -p "require('./$MAPPING_FILE').mappings.length" 2>/dev/null)
    ARCHITECTURE=$(node -p "require('./$MAPPING_FILE').dataArchitecture" 2>/dev/null)

    echo "   System Name: $SYSTEM_NAME"
    echo "   Data Architecture: $ARCHITECTURE"
    echo "   Total Groups: $TOTAL_GROUPS"
    echo "   Mappings Count: $MAPPING_COUNT"

    # Validate expected values
    if [ "$TOTAL_GROUPS" != "4" ]; then
      echo -e "${RED}❌ Expected 4 total groups, found $TOTAL_GROUPS${NC}"
      VERIFICATION_PASSED=false
    else
      echo -e "${GREEN}✅ Correct number of groups (4)${NC}"
    fi

    if [ "$MAPPING_COUNT" != "4" ]; then
      echo -e "${RED}❌ Expected 4 mappings, found $MAPPING_COUNT${NC}"
      VERIFICATION_PASSED=false
    else
      echo -e "${GREEN}✅ Correct number of mappings (4)${NC}"
    fi

    if [ "$ARCHITECTURE" != "grouping" ]; then
      echo -e "${RED}❌ Expected architecture 'grouping', found '$ARCHITECTURE'${NC}"
      VERIFICATION_PASSED=false
    else
      echo -e "${GREEN}✅ Correct data architecture (grouping)${NC}"
    fi
  fi
fi

# =====================================================================
# QUARTER NAMES CHECK
# =====================================================================

echo ""
echo "🏷️  Quarter Names Check"
echo "------------------------------------------------------------"

if [ -f "$MAPPING_FILE" ]; then
  QUARTERS=$(node -p "require('./$MAPPING_FILE').mappings.map(m => m.groupName).join(', ')" 2>/dev/null)
  echo "   Quarters found: $QUARTERS"

  # Check each expected quarter
  for QUARTER in "Mutation" "Initiation" "Duality" "Civilisation"; do
    if echo "$QUARTERS" | grep -q "$QUARTER"; then
      echo -e "${GREEN}✅ Quarter found: $QUARTER${NC}"
    else
      echo -e "${RED}❌ Quarter missing: $QUARTER${NC}"
      VERIFICATION_PASSED=false
    fi
  done
fi

# =====================================================================
# BINARY PATTERNS CHECK
# =====================================================================

echo ""
echo "🔢 Binary Patterns Check"
echo "------------------------------------------------------------"

if [ -f "$MAPPING_FILE" ]; then
  PATTERNS=$(node -p "require('./$MAPPING_FILE').mappings.map(m => m.binaryPattern).join(', ')" 2>/dev/null)
  echo "   Patterns found: $PATTERNS"

  # Check each expected pattern
  for PATTERN in "11" "10" "01" "00"; do
    if echo "$PATTERNS" | grep -q "$PATTERN"; then
      echo -e "${GREEN}✅ Pattern found: $PATTERN${NC}"
    else
      echo -e "${RED}❌ Pattern missing: $PATTERN${NC}"
      VERIFICATION_PASSED=false
    fi
  done
fi

# =====================================================================
# KNOWLEDGE CONTENT CHECK
# =====================================================================

echo ""
echo "📚 Knowledge Content Check"
echo "------------------------------------------------------------"

if [ -f "$MAPPING_FILE" ]; then
  # Check that all quarters have purpose, theme, quality, description
  MISSING_PURPOSE=$(node -p "require('./$MAPPING_FILE').mappings.filter(m => !m.knowledge || !m.knowledge.purpose).length" 2>/dev/null)
  MISSING_THEME=$(node -p "require('./$MAPPING_FILE').mappings.filter(m => !m.knowledge || !m.knowledge.theme).length" 2>/dev/null)
  MISSING_QUALITY=$(node -p "require('./$MAPPING_FILE').mappings.filter(m => !m.knowledge || !m.knowledge.quality).length" 2>/dev/null)
  MISSING_DESCRIPTION=$(node -p "require('./$MAPPING_FILE').mappings.filter(m => !m.knowledge || !m.knowledge.description).length" 2>/dev/null)

  if [ "$MISSING_PURPOSE" = "0" ]; then
    echo -e "${GREEN}✅ All quarters have purpose defined${NC}"
  else
    echo -e "${RED}❌ $MISSING_PURPOSE quarters missing purpose${NC}"
    VERIFICATION_PASSED=false
  fi

  if [ "$MISSING_THEME" = "0" ]; then
    echo -e "${GREEN}✅ All quarters have theme defined${NC}"
  else
    echo -e "${RED}❌ $MISSING_THEME quarters missing theme${NC}"
    VERIFICATION_PASSED=false
  fi

  if [ "$MISSING_QUALITY" = "0" ]; then
    echo -e "${GREEN}✅ All quarters have quality defined${NC}"
  else
    echo -e "${RED}❌ $MISSING_QUALITY quarters missing quality${NC}"
    VERIFICATION_PASSED=false
  fi

  if [ "$MISSING_DESCRIPTION" = "0" ]; then
    echo -e "${GREEN}✅ All quarters have description defined${NC}"
  else
    echo -e "${RED}❌ $MISSING_DESCRIPTION quarters missing description${NC}"
    VERIFICATION_PASSED=false
  fi
fi

# =====================================================================
# TEST FILE CHECK
# =====================================================================

echo ""
echo "🧪 Test File Check"
echo "------------------------------------------------------------"

if [ -f "$TEST_FILE" ]; then
  # Check if test file is executable
  if [ -x "$TEST_FILE" ]; then
    echo -e "${GREEN}✅ Test file is executable${NC}"
  else
    echo -e "${YELLOW}⚠️  Test file is not executable (chmod +x $TEST_FILE)${NC}"
  fi

  # Check if test file has shebang
  if head -n 1 "$TEST_FILE" | grep -q "#!/usr/bin/env node"; then
    echo -e "${GREEN}✅ Test file has correct shebang${NC}"
  else
    echo -e "${YELLOW}⚠️  Test file missing node shebang${NC}"
  fi

  # Check for required test dependencies
  if grep -q "unified-hd-database.json" "$TEST_FILE"; then
    echo -e "${GREEN}✅ Test file references unified database${NC}"
  else
    echo -e "${RED}❌ Test file does not reference unified database${NC}"
    VERIFICATION_PASSED=false
  fi
fi

# =====================================================================
# FINAL SUMMARY
# =====================================================================

echo ""
echo "============================================================"

if [ "$VERIFICATION_PASSED" = true ]; then
  echo -e "${GREEN}🎉 All verification checks passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Run comprehensive tests: node tests/quarters-tests.js"
  echo "  2. Review README.md documentation"
  echo "  3. Commit changes to git"
  echo ""
  exit 0
else
  echo -e "${RED}❌ Some verification checks failed${NC}"
  echo ""
  echo "Please fix the issues above before proceeding."
  echo ""
  exit 1
fi
