#!/bin/bash
echo "🔍 I Ching Gate Names - Verification"
echo "===================================="

MAPPING_FILE="mappings/iching-names-mappings.json"

if [ ! -f "$MAPPING_FILE" ]; then
  echo "❌ Mapping file not found"
  exit 1
fi

TOTAL=$(node -p "require('./$MAPPING_FILE').mappings.length")
echo "✅ Total mappings: $TOTAL"

if [ "$TOTAL" -ne 64 ]; then
  echo "❌ Expected 64 mappings, found $TOTAL"
  exit 1
fi

# Check system metadata
SYSTEM_NAME=$(node -p "require('./$MAPPING_FILE').systemName")
COMPLETENESS=$(node -p "require('./$MAPPING_FILE').completeness")
ARCHITECTURE=$(node -p "require('./$MAPPING_FILE').dataArchitecture")

echo "✅ System name: $SYSTEM_NAME"
echo "✅ Completeness: $COMPLETENESS"
echo "✅ Data architecture: $ARCHITECTURE"

# Run the full test suite
echo ""
echo "Running full test suite..."
echo "===================================="
node tests/iching-names-tests.js

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ All verification checks passed!"
  exit 0
else
  echo ""
  echo "❌ Verification failed"
  exit 1
fi
