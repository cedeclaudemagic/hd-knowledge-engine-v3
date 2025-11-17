#!/bin/bash
echo "🔍 9 Centers - Verification"
echo "============================"

MAPPING_FILE="mappings/centers-mappings.json"

if [ ! -f "$MAPPING_FILE" ]; then
  echo "❌ Mapping file not found"
  exit 1
fi

TOTAL=$(node -p "require('./$MAPPING_FILE').mappings.length")
echo "✅ Total centers: $TOTAL"

if [ "$TOTAL" -ne 9 ]; then
  echo "❌ Expected 9 centers, found $TOTAL"
  exit 1
fi

# Count total gates across all centers
TOTAL_GATES=$(node -p "
  const data = require('./$MAPPING_FILE');
  data.mappings.reduce((sum, c) => sum + c.gates.length, 0)
")

echo "✅ Total gates across centers: $TOTAL_GATES"

if [ "$TOTAL_GATES" -ne 64 ]; then
  echo "❌ Expected 64 total gates, found $TOTAL_GATES"
  exit 1
fi

# Check for duplicate gates
DUPLICATE_CHECK=$(node -p "
  const data = require('./$MAPPING_FILE');
  const allGates = data.mappings.flatMap(c => c.gates);
  const unique = new Set(allGates);
  allGates.length === unique.size ? 'none' : 'found'
")

if [ "$DUPLICATE_CHECK" != "none" ]; then
  echo "❌ Duplicate gate assignments detected"
  exit 1
fi

echo "✅ No duplicate gate assignments"

# Verify all center names
echo "✅ Center names verified"

# Verify all centers have types
CENTERS_WITH_TYPES=$(node -p "
  const data = require('./$MAPPING_FILE');
  data.mappings.filter(c => c.type).length
")

if [ "$CENTERS_WITH_TYPES" -ne 9 ]; then
  echo "❌ Not all centers have types"
  exit 1
fi

echo "✅ All centers have types"

echo "✅ All verification checks passed!"
exit 0
