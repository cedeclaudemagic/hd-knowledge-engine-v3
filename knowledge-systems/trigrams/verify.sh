#!/bin/bash
echo "🔍 8 Trigrams - Verification"
echo "============================"

MAPPING_FILE="mappings/trigrams-mappings.json"

if [ ! -f "$MAPPING_FILE" ]; then
  echo "❌ Mapping file not found"
  exit 1
fi

TOTAL=$(node -p "require('./$MAPPING_FILE').mappings.length")
echo "✅ Total trigrams: $TOTAL"

if [ "$TOTAL" -ne 8 ]; then
  echo "❌ Expected 8 trigrams, found $TOTAL"
  exit 1
fi

# Verify all binary patterns are present
PATTERNS=$(node -p "require('./$MAPPING_FILE').mappings.map(m => m.binaryPattern).sort().join(',')")
EXPECTED="000,001,010,011,100,101,110,111"

if [ "$PATTERNS" != "$EXPECTED" ]; then
  echo "❌ Binary patterns don't match expected"
  echo "   Expected: $EXPECTED"
  echo "   Found: $PATTERNS"
  exit 1
fi

echo "✅ All binary patterns present"

# Verify all have Chinese names
WITHOUT_CHINESE=$(node -p "require('./$MAPPING_FILE').mappings.filter(m => !m.chineseName).length")

if [ "$WITHOUT_CHINESE" -ne 0 ]; then
  echo "❌ $WITHOUT_CHINESE trigrams missing Chinese names"
  exit 1
fi

echo "✅ All trigrams have Chinese names"

# Verify all have I Ching meanings
WITHOUT_ICHING=$(node -p "require('./$MAPPING_FILE').mappings.filter(m => !m.knowledge || !m.knowledge.iching).length")

if [ "$WITHOUT_ICHING" -ne 0 ]; then
  echo "❌ $WITHOUT_ICHING trigrams missing I Ching meanings"
  exit 1
fi

echo "✅ All trigrams have I Ching meanings"

echo "============================"
echo "✅ All verification checks passed!"
exit 0
