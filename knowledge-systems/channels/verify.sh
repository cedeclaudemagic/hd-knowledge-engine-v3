#!/bin/bash
echo "🔍 36 Channels - Verification"
echo "=============================="

MAPPING_FILE="mappings/channels-mappings.json"

if [ ! -f "$MAPPING_FILE" ]; then
  echo "❌ Mapping file not found"
  exit 1
fi

TOTAL=$(node -p "require('./$MAPPING_FILE').mappings.length")
echo "✅ Total channels: $TOTAL"

if [ "$TOTAL" -ne 36 ]; then
  echo "❌ Expected 36 channels, found $TOTAL"
  exit 1
fi

echo "✅ All verification checks passed!"
exit 0
