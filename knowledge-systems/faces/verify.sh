#!/bin/bash

# 16 Mythological Faces - Verification Script
# Validates the faces knowledge system mappings and completeness

echo "🔍 16 Mythological Faces - Verification"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "mappings/faces-mappings.json" ]; then
  echo "❌ Error: Must run from knowledge-systems/faces/ directory"
  exit 1
fi

MAPPING_FILE="mappings/faces-mappings.json"

# Check if mapping file exists
if [ ! -f "$MAPPING_FILE" ]; then
  echo "❌ Mapping file not found: $MAPPING_FILE"
  exit 1
fi

echo "📂 Mapping file found: $MAPPING_FILE"

# Validate JSON format
if ! node -e "JSON.parse(require('fs').readFileSync('$MAPPING_FILE', 'utf8'))" 2>/dev/null; then
  echo "❌ Invalid JSON format in mapping file"
  exit 1
fi

echo "✅ JSON format is valid"

# Count total faces
TOTAL=$(node -p "require('./$MAPPING_FILE').mappings.length")
echo "📊 Total faces: $TOTAL"

if [ "$TOTAL" -ne 16 ]; then
  echo "❌ Expected 16 faces, found $TOTAL"
  exit 1
fi

echo "✅ Correct number of faces (16)"

# Check system name
SYSTEM_NAME=$(node -p "require('./$MAPPING_FILE').systemName")
if [ "$SYSTEM_NAME" != "The 16 Mythological Faces" ]; then
  echo "❌ System name incorrect: $SYSTEM_NAME"
  exit 1
fi

echo "✅ System name is correct"

# Check data architecture
DATA_ARCH=$(node -p "require('./$MAPPING_FILE').dataArchitecture")
if [ "$DATA_ARCH" != "grouping" ]; then
  echo "❌ Data architecture must be 'grouping', found: $DATA_ARCH"
  exit 1
fi

echo "✅ Data architecture is 'grouping'"

# Check completeness
COMPLETENESS=$(node -p "require('./$MAPPING_FILE').completeness")
if [ "$COMPLETENESS" != "full" ]; then
  echo "⚠️  Warning: Completeness is '$COMPLETENESS', expected 'full'"
fi

echo "✅ Completeness status: $COMPLETENESS"

# Verify all faces have mythology
FACES_WITH_MYTHOLOGY=$(node -p "require('./$MAPPING_FILE').mappings.filter(m => m.knowledge && m.knowledge.mythology).length")
if [ "$FACES_WITH_MYTHOLOGY" -ne 16 ]; then
  echo "❌ Only $FACES_WITH_MYTHOLOGY faces have mythology (expected 16)"
  exit 1
fi

echo "✅ All faces have mythology descriptions"

# Verify all faces have archetypes
FACES_WITH_ARCHETYPES=$(node -p "require('./$MAPPING_FILE').mappings.filter(m => m.knowledge && m.knowledge.archetype).length")
if [ "$FACES_WITH_ARCHETYPES" -ne 16 ]; then
  echo "❌ Only $FACES_WITH_ARCHETYPES faces have archetypes (expected 16)"
  exit 1
fi

echo "✅ All faces have archetype definitions"

# Verify codon patterns
VALID_CODON_COUNT=$(node -p "
const validCodons = ['AA','AC','AG','AU','CA','CC','CG','CU','GA','GC','GG','GU','UA','UC','UG','UU'];
const mappings = require('./$MAPPING_FILE').mappings;
const codonPatterns = mappings.map(m => m.codonPattern);
const allValid = codonPatterns.every(c => validCodons.includes(c));
allValid ? 16 : codonPatterns.filter(c => validCodons.includes(c)).length;
")

if [ "$VALID_CODON_COUNT" -ne 16 ]; then
  echo "❌ Invalid codon patterns found"
  exit 1
fi

echo "✅ All codon patterns are valid"

# List all faces for verification
echo ""
echo "📋 Face Listing:"
echo "----------------"
node -p "
const mappings = require('./$MAPPING_FILE').mappings;
mappings.map((m, i) =>
  \`\${String(i+1).padStart(2)}. \${m.codonPattern} - \${m.groupName}\`
).join('\n')
"

echo ""
echo "✅ All verification checks passed!"
echo ""
echo "🎉 The 16 Mythological Faces system is valid and complete."
exit 0
