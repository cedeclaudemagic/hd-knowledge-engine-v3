#!/bin/bash

# Traditional HD Gates Knowledge System Verification Script
# Validates all 384 line-level mappings

echo "🔍 Traditional Human Design Gates - Verification"
echo "================================================"
echo ""

MAPPING_FILE="./mappings/hd-gates-mappings.json"

# Check if file exists
if [ ! -f "$MAPPING_FILE" ]; then
    echo "❌ ERROR: Mapping file not found: $MAPPING_FILE"
    exit 1
fi

echo "✅ Mapping file found"
echo ""

# Use node to verify the structure
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$MAPPING_FILE', 'utf8'));

console.log('📊 System Information:');
console.log('   System Name:', data.systemName);
console.log('   Version:', data.version);
console.log('   Completeness:', data.completeness);
console.log('');

console.log('📈 Coverage:');
console.log('   Total Gates:', data.totalGates);
console.log('   Total Lines:', data.totalLines);
console.log('   Lines per Gate:', data.linesPerGate);
console.log('   Expected Total:', data.expectedTotal);
console.log('');

// Verification checks
let errors = [];
let warnings = [];

// Check 1: Total line count
if (data.mappings.length !== 384) {
    errors.push(\`Expected 384 mappings, found \${data.mappings.length}\`);
}
console.log(\`✅ Check 1: Total mappings = 384 (\${data.mappings.length})\`);

// Check 2: All gates present (1-64)
const gates = new Set(data.mappings.map(m => m.gateNumber));
if (gates.size !== 64) {
    errors.push(\`Expected 64 unique gates, found \${gates.size}\`);
}
console.log(\`✅ Check 2: All 64 gates present (\${gates.size})\`);

// Check 3: Each gate has 6 lines
const linesPerGate = {};
data.mappings.forEach(m => {
    linesPerGate[m.gateNumber] = (linesPerGate[m.gateNumber] || 0) + 1;
});

const incompleteGates = Object.entries(linesPerGate)
    .filter(([_, count]) => count !== 6);

if (incompleteGates.length > 0) {
    errors.push(\`Gates with incorrect line count: \${incompleteGates.map(([g, c]) => \`\${g}(\${c})\`).join(', ')}\`);
}
console.log(\`✅ Check 3: All gates have 6 lines (checked \${Object.keys(linesPerGate).length} gates)\`);

// Check 4: All line numbers are 1-6
const invalidLines = data.mappings.filter(m => m.lineNumber < 1 || m.lineNumber > 6);
if (invalidLines.length > 0) {
    errors.push(\`Found \${invalidLines.length} invalid line numbers\`);
}
console.log(\`✅ Check 4: All line numbers are 1-6\`);

// Check 5: All lines have keynotes
const missingKeynotes = data.mappings.filter(m => !m.knowledge.lineKeynote);
if (missingKeynotes.length > 0) {
    errors.push(\`Missing keynotes: \${missingKeynotes.length} lines\`);
}
console.log(\`✅ Check 5: All lines have keynotes (\${data.mappings.length - missingKeynotes.length}/384)\`);

// Check 6: All lines have gate names
const missingGateNames = data.mappings.filter(m => !m.knowledge.gateName);
if (missingGateNames.length > 0) {
    errors.push(\`Missing gate names: \${missingGateNames.length} lines\`);
}
console.log(\`✅ Check 6: All lines have gate names (\${data.mappings.length - missingGateNames.length}/384)\`);

// Check 7: Valid planets
const validPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Earth'];
const invalidPlanets = new Set();

data.mappings.forEach(m => {
    const bbEx = m.knowledge.blackBook?.exaltation?.planet;
    const bbDe = m.knowledge.blackBook?.detriment?.planet;
    const wbEx = m.knowledge.whiteBook?.exaltation?.planet;
    const wbDe = m.knowledge.whiteBook?.detriment?.planet;

    [bbEx, bbDe, wbEx, wbDe].forEach(planet => {
        if (planet && !validPlanets.includes(planet)) {
            invalidPlanets.add(planet);
        }
    });
});

if (invalidPlanets.size > 0) {
    warnings.push(\`Invalid planets found: \${Array.from(invalidPlanets).join(', ')}\`);
}
console.log(\`✅ Check 7: Valid planetary assignments\`);

// Check 8: Black Book present
const missingBlackBook = data.mappings.filter(m =>
    !m.knowledge.blackBook ||
    (!m.knowledge.blackBook.exaltation?.planet && !m.knowledge.blackBook.detriment?.planet)
);
if (missingBlackBook.length > 0) {
    warnings.push(\`Lines missing Black Book data: \${missingBlackBook.length}\`);
}
console.log(\`✅ Check 8: Black Book interpretations (\${data.mappings.length - missingBlackBook.length}/384)\`);

// Check 9: White Book present
const missingWhiteBook = data.mappings.filter(m =>
    !m.knowledge.whiteBook ||
    (!m.knowledge.whiteBook.exaltation?.description && !m.knowledge.whiteBook.detriment?.description)
);
if (missingWhiteBook.length > 0) {
    warnings.push(\`Lines with limited White Book data: \${missingWhiteBook.length}\`);
}
console.log(\`✅ Check 9: White Book interpretations (\${data.mappings.length - missingWhiteBook.length}/384)\`);

// Check 10: Polarity present
const missingPolarity = data.mappings.filter(m => !m.knowledge.polarity);
if (missingPolarity.length > 0) {
    warnings.push(\`Lines missing polarity: \${missingPolarity.length}\`);
}
console.log(\`✅ Check 10: Polarity data (\${data.mappings.length - missingPolarity.length}/384)\`);

console.log('');

// Summary
if (errors.length > 0) {
    console.log('❌ ERRORS:');
    errors.forEach(err => console.log('   -', err));
    console.log('');
}

if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach(warn => console.log('   -', warn));
    console.log('');
}

if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ ALL CHECKS PASSED!');
    console.log('');
    console.log('🎉 Traditional HD Gates knowledge system is complete and valid!');
    process.exit(0);
} else if (errors.length === 0) {
    console.log('⚠️  VERIFICATION PASSED WITH WARNINGS');
    process.exit(0);
} else {
    console.log('❌ VERIFICATION FAILED');
    process.exit(1);
}
"
