#!/bin/bash
# Create a new knowledge system branch for parallel development
#
# Usage: ./create-knowledge-branch.sh system-name
#
# Example: ./create-knowledge-branch.sh gene-keys

if [ -z "$1" ]; then
  echo "❌ Usage: ./create-knowledge-branch.sh <system-name>"
  echo ""
  echo "Examples:"
  echo "  ./create-knowledge-branch.sh gene-keys"
  echo "  ./create-knowledge-branch.sh codon-rings"
  echo "  ./create-knowledge-branch.sh incarnation-crosses"
  exit 1
fi

SYSTEM_NAME=$1
BRANCH_NAME="feature/knowledge-system-${SYSTEM_NAME}"

echo "🌿 Creating knowledge system branch: $BRANCH_NAME"
echo ""

# Check if on feature/calculation-first-architecture branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "feature/calculation-first-architecture" ]; then
  echo "⚠️  Current branch: $CURRENT_BRANCH"
  echo "💡 Consider checking out feature/calculation-first-architecture first"
  echo ""
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Create branch
git checkout -b "$BRANCH_NAME"

# Create directory structure
mkdir -p "knowledge-systems/${SYSTEM_NAME}"
mkdir -p "knowledge-systems/${SYSTEM_NAME}/mappings"
mkdir -p "knowledge-systems/${SYSTEM_NAME}/docs"

# Copy template
cp core/templates/knowledge-system-template.json "knowledge-systems/${SYSTEM_NAME}/mappings/${SYSTEM_NAME}-mappings.json"

# Create verification script
cat > "knowledge-systems/${SYSTEM_NAME}/verify.sh" << EOF
#!/bin/bash
# Verify ${SYSTEM_NAME} mappings against root system

echo "🔍 Verifying ${SYSTEM_NAME} knowledge system..."
node ../../core/templates/verify-template.js "mappings/${SYSTEM_NAME}-mappings.json"
EOF

chmod +x "knowledge-systems/${SYSTEM_NAME}/verify.sh"

# Create README
cat > "knowledge-systems/${SYSTEM_NAME}/README.md" << EOF
# ${SYSTEM_NAME} Knowledge System

## Branch: $BRANCH_NAME

## Development Workflow

1. **Edit mappings**: \`mappings/${SYSTEM_NAME}-mappings.json\`
   - Each mapping must have \`gateNumber\` (required)
   - \`lineNumber\` is optional (for line-level systems)
   - Put your system data in \`knowledge\` field

2. **Verify mappings**: \`./verify.sh\`
   - Tests docking into root system
   - Validates all gate/line numbers
   - Checks completeness

3. **Commit changes**:
   \`\`\`bash
   git add .
   git commit -m "Add ${SYSTEM_NAME} mappings"
   \`\`\`

4. **Push and create PR**:
   \`\`\`bash
   git push -u origin $BRANCH_NAME
   # Then create PR on GitHub
   \`\`\`

## Docking Interface

All mappings dock using:
- \`gateNumber\`: 1-64 (required)
- \`lineNumber\`: 1-6 (optional)
- \`knowledge\`: Your system-specific data structure

The root system provides:
- Binary patterns
- Wheel positioning
- Calculated relationships (quarter, face, trigrams, opposites)

## Root System Files

- \`core/root-system/binary-identity.json\` - Immutable gate binaries
- \`core/root-system/gate-sequence.json\` - Wheel order
- \`core/root-system/positioning-algorithm.js\` - Calculation functions

## Example

\`\`\`json
{
  "gateNumber": 1,
  "lineNumber": null,
  "knowledge": {
    "yourField": "your data",
    "nested": {
      "data": "works fine"
    }
  }
}
\`\`\`
EOF

echo ""
echo "✅ Branch created: $BRANCH_NAME"
echo ""
echo "📂 Structure:"
echo "   knowledge-systems/${SYSTEM_NAME}/"
echo "   ├── mappings/${SYSTEM_NAME}-mappings.json"
echo "   ├── docs/"
echo "   ├── verify.sh"
echo "   └── README.md"
echo ""
echo "🚀 Next steps:"
echo "   1. Edit: knowledge-systems/${SYSTEM_NAME}/mappings/${SYSTEM_NAME}-mappings.json"
echo "   2. Test: cd knowledge-systems/${SYSTEM_NAME} && ./verify.sh"
echo "   3. Commit: git add . && git commit -m 'Add ${SYSTEM_NAME} mappings'"
echo "   4. Push: git push -u origin $BRANCH_NAME"
echo ""
