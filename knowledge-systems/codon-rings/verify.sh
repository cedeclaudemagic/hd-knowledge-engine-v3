#!/bin/bash

# Codon Rings Knowledge System Verification Script
# Verifies mappings integrity and completeness

echo "=== CODON RINGS KNOWLEDGE SYSTEM VERIFICATION ==="
echo ""

# Check if mappings file exists
MAPPINGS_FILE="./mappings/codon-rings-mappings.json"
if [ ! -f "$MAPPINGS_FILE" ]; then
    echo "❌ ERROR: Mappings file not found at $MAPPINGS_FILE"
    exit 1
fi

echo "✅ Mappings file found"

# Run verification using Node.js
node ./tests/codon-rings.test.js

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "=== ✅ ALL VERIFICATIONS PASSED ==="
    exit 0
else
    echo ""
    echo "=== ❌ VERIFICATION FAILED ==="
    exit 1
fi
