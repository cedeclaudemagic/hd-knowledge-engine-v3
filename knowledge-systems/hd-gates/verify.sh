#!/bin/bash
echo "🔍 Human Design Gates - Verification"
echo "===================================="

MAPPING_FILE="mappings/hd-gates-mappings.json"

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

# Test all gates have keywords
MISSING=$(node -p "
  const data = require('./$MAPPING_FILE');
  data.mappings.filter(m => !m.knowledge.keyword).length
")

if [ "$MISSING" -gt 0 ]; then
  echo "❌ $MISSING gates missing keywords"
  exit 1
fi

echo "✅ All gates have keywords"

# Test all gates have centers
MISSING=$(node -p "
  const data = require('./$MAPPING_FILE');
  data.mappings.filter(m => !m.knowledge.center).length
")

if [ "$MISSING" -gt 0 ]; then
  echo "❌ $MISSING gates missing center assignments"
  exit 1
fi

echo "✅ All gates have center assignments"

# Test all gates have valid center names
INVALID=$(node -p "
  const data = require('./$MAPPING_FILE');
  const validCenters = ['Head', 'Ajna', 'Throat', 'G', 'Sacral', 'Solar Plexus', 'Spleen', 'Root', 'Heart'];
  data.mappings.filter(m => !validCenters.includes(m.knowledge.center)).length
")

if [ "$INVALID" -gt 0 ]; then
  echo "❌ $INVALID gates have invalid center names"
  exit 1
fi

echo "✅ All gates have valid center names"

# Test all lineNumbers are null
INVALID=$(node -p "
  const data = require('./$MAPPING_FILE');
  data.mappings.filter(m => m.lineNumber !== null).length
")

if [ "$INVALID" -gt 0 ]; then
  echo "❌ $INVALID gates have lineNumber set (should be null)"
  exit 1
fi

echo "✅ All mappings are gate-level (lineNumber: null)"

# Test no duplicate gate numbers
DUPLICATES=$(node -p "
  const data = require('./$MAPPING_FILE');
  const gates = data.mappings.map(m => m.gateNumber);
  gates.length - new Set(gates).size
")

if [ "$DUPLICATES" -gt 0 ]; then
  echo "❌ $DUPLICATES duplicate gate numbers found"
  exit 1
fi

echo "✅ No duplicate gate numbers"

echo ""
echo "✅ All verification checks passed!"
exit 0
