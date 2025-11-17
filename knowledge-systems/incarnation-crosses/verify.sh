#!/bin/bash
#
# Verification Script for Incarnation Crosses Knowledge System
#
# This script runs all verification checks for the Incarnation Crosses mappings

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "========================================="
echo "INCARNATION CROSSES VERIFICATION"
echo "========================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "Please install Node.js to run verification"
    exit 1
fi

echo -e "${BLUE}[1/4] Checking directory structure...${NC}"

# Check for required directories
if [ ! -d "mappings" ]; then
    echo -e "${RED}✗ Missing 'mappings' directory${NC}"
    exit 1
fi

if [ ! -d "scripts" ]; then
    echo -e "${RED}✗ Missing 'scripts' directory${NC}"
    exit 1
fi

if [ ! -d "tests" ]; then
    echo -e "${RED}✗ Missing 'tests' directory${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Directory structure valid${NC}"

echo ""
echo -e "${BLUE}[2/4] Checking required files...${NC}"

# Check for required files
REQUIRED_FILES=(
    "mappings/gate-cross-mappings.json"
    "mappings/cross-definitions.json"
    "scripts/generate-mappings.js"
    "tests/test-mappings.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}✗ Missing file: $file${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✓ All required files present${NC}"

echo ""
echo -e "${BLUE}[3/4] Validating JSON files...${NC}"

# Validate gate-cross-mappings.json
if ! node -e "JSON.parse(require('fs').readFileSync('mappings/gate-cross-mappings.json', 'utf8'))" 2>/dev/null; then
    echo -e "${RED}✗ Invalid JSON in gate-cross-mappings.json${NC}"
    exit 1
fi
echo -e "${GREEN}✓ gate-cross-mappings.json is valid JSON${NC}"

# Validate cross-definitions.json
if ! node -e "JSON.parse(require('fs').readFileSync('mappings/cross-definitions.json', 'utf8'))" 2>/dev/null; then
    echo -e "${RED}✗ Invalid JSON in cross-definitions.json${NC}"
    exit 1
fi
echo -e "${GREEN}✓ cross-definitions.json is valid JSON${NC}"

echo ""
echo -e "${BLUE}[4/4] Running comprehensive test suite...${NC}"
echo ""

# Run the test suite
if node tests/test-mappings.js; then
    echo ""
    echo "========================================="
    echo -e "${GREEN}✅ VERIFICATION COMPLETE - ALL CHECKS PASSED${NC}"
    echo "========================================="
    echo ""
    echo "Incarnation Crosses Knowledge System:"
    echo "  ✓ Directory structure valid"
    echo "  ✓ All required files present"
    echo "  ✓ JSON files valid"
    echo "  ✓ All tests passed"
    echo ""

    # Display statistics
    echo "Statistics:"
    node -e "
        const data = JSON.parse(require('fs').readFileSync('mappings/gate-cross-mappings.json', 'utf8'));
        console.log('  - Total gates:', data.statistics.totalGates);
        console.log('  - Gates with crosses:', data.statistics.gatesWithCrosses);
        console.log('  - Total cross participations:', data.statistics.totalCrossParticipations);
        console.log('  - Avg participations per gate:', data.statistics.avgParticipationsPerGate);

        const defs = JSON.parse(require('fs').readFileSync('mappings/cross-definitions.json', 'utf8'));
        console.log('  - Total crosses:', defs.totalCrosses);
        console.log('  - LAX crosses:', defs.crossTypes.LAX);
        console.log('  - RAX crosses:', defs.crossTypes.RAX);
        console.log('  - JX crosses:', defs.crossTypes.JX);
    "

    echo ""
    exit 0
else
    echo ""
    echo "========================================="
    echo -e "${RED}✗ VERIFICATION FAILED - TESTS FAILED${NC}"
    echo "========================================="
    echo ""
    exit 1
fi
