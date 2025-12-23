/**
 * Generate Enhanced Electromagnetic Neutrino I-Ching
 *
 * Parses the markdown files in docs/electromagnetic-interpretations/
 * to extract the rich Electromagnetic Interpretation paragraphs and Keynotes
 */

const fs = require('fs');
const path = require('path');

const MD_DIR = path.join(__dirname, '../docs/electromagnetic-interpretations');
const OUTPUT_DIR = path.join(__dirname, '../exports/neutrino');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'neutrino-iching-em-enhanced.json');

function parseGateMarkdown(filePath) {
  /**
   * Parse a single gate markdown file and extract line interpretations
   * Returns array of { line, keynote, interpretation } objects
   */
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = [];

  // Extract gate number from filename
  const match = filePath.match(/gate-(\d+)/);
  if (!match) return null;
  const gateNumber = parseInt(match[1]);

  // Split into line sections using "### Line X:" pattern
  // Also handle variations like "### Line 1: Entry to Creative"
  const lineSections = content.split(/### Line (\d):/);

  for (let i = 1; i < lineSections.length; i += 2) {
    const lineNumber = parseInt(lineSections[i]);
    const sectionContent = lineSections[i + 1] || '';

    // Extract Electromagnetic Interpretation paragraph
    // Look for "#### Electromagnetic Interpretation" followed by paragraphs until next section
    let interpretation = '';
    const emInterpMatch = sectionContent.match(/#### Electromagnetic Interpretation\s*\n\n([\s\S]*?)(?=\n\*\*Alignment Analysis|\n\*\*Electromagnetic Keynote|\n---|\n###|$)/);
    if (emInterpMatch) {
      interpretation = emInterpMatch[1]
        .trim()
        .replace(/\*\*/g, '')  // Remove bold markers
        .replace(/\n\n/g, ' ')  // Join paragraphs
        .replace(/\n/g, ' ')    // Remove single newlines
        .replace(/\s+/g, ' ')   // Normalize whitespace
        .trim();
    }

    // Extract Electromagnetic Keynote
    // Pattern: **Electromagnetic Keynote:** *text here*
    let keynote = '';
    const keynoteMatch = sectionContent.match(/\*\*Electromagnetic Keynote:\*\*\s*\*(.*?)\*/);
    if (keynoteMatch) {
      keynote = keynoteMatch[1].trim();
    }

    if (lineNumber >= 1 && lineNumber <= 6) {
      lines.push({
        gate: gateNumber,
        line: lineNumber,
        keynote: keynote || `Line ${lineNumber} interpretation`,
        interpretation: interpretation || 'Electromagnetic interpretation pending'
      });
    }
  }

  return { gate: gateNumber, lines };
}

function buildNeutrinoFormat(allGates) {
  /**
   * Convert parsed gate data to Neutrino format
   */
  const result = {};

  for (const gateData of allGates) {
    if (!gateData) continue;

    const gateKey = String(gateData.gate);
    result[gateKey] = {};

    for (const lineData of gateData.lines) {
      const lineKey = String(lineData.line);

      // Name uses the keynote (short form)
      const name = `Gate ${gateKey} Line ${lineKey} - ${lineData.keynote}`;

      // Asc gets the full interpretation
      const asc = lineData.interpretation;

      // Desc gets the keynote as a reminder/summary
      const desc = `Keynote: ${lineData.keynote}`;

      result[gateKey][lineKey] = { name, asc, desc };
    }
  }

  return result;
}

function validateOutput(data) {
  const gateCount = Object.keys(data).length;
  let lineCount = 0;
  const issues = [];
  const missingGates = [];

  for (let gate = 1; gate <= 64; gate++) {
    const gateKey = String(gate);
    if (!data[gateKey]) {
      missingGates.push(gate);
      continue;
    }

    for (let line = 1; line <= 6; line++) {
      const lineKey = String(line);
      if (!data[gateKey][lineKey]) {
        issues.push(`Missing ${gateKey}.${lineKey}`);
      } else {
        lineCount++;
      }
    }
  }

  console.log(`\nValidation:`);
  console.log(`  Gates: ${gateCount}/64`);
  console.log(`  Lines: ${lineCount}/384`);

  if (missingGates.length > 0) {
    console.log(`  Missing gates: ${missingGates.join(', ')}`);
  }

  if (issues.length > 0) {
    console.log(`  Issues (${issues.length}):`);
    issues.slice(0, 5).forEach(i => console.log(`    - ${i}`));
  } else if (missingGates.length === 0) {
    console.log(`  Status: VALID`);
  }

  return issues.length === 0 && missingGates.length === 0;
}

function main() {
  console.log('Enhanced Electromagnetic Neutrino I-Ching Generator');
  console.log('='.repeat(50));

  // Find all gate markdown files
  const files = fs.readdirSync(MD_DIR)
    .filter(f => f.match(/^gate-\d+-.*\.md$/))
    .sort((a, b) => {
      const numA = parseInt(a.match(/gate-(\d+)/)[1]);
      const numB = parseInt(b.match(/gate-(\d+)/)[1]);
      return numA - numB;
    });

  console.log(`\nFound ${files.length} gate markdown files`);

  // Parse each file
  console.log('\nParsing markdown files...');
  const allGates = [];
  let totalLines = 0;

  for (const file of files) {
    const filePath = path.join(MD_DIR, file);
    const gateData = parseGateMarkdown(filePath);
    if (gateData) {
      allGates.push(gateData);
      totalLines += gateData.lines.length;

      // Progress indicator
      if (gateData.gate % 10 === 0) {
        console.log(`  Parsed gate ${gateData.gate}...`);
      }
    }
  }

  console.log(`  Extracted ${totalLines} line interpretations from ${allGates.length} gates`);

  // Build Neutrino format
  console.log('\nBuilding Neutrino format...');
  const neutrinoData = buildNeutrinoFormat(allGates);

  // Validate
  const isValid = validateOutput(neutrinoData);

  // Create output directory if needed
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(neutrinoData, null, 2));
  console.log(`\nWritten: ${OUTPUT_FILE}`);

  // Show samples
  console.log('\n' + '='.repeat(50));
  console.log('SAMPLE ENTRIES');
  console.log('='.repeat(50));

  if (neutrinoData['1'] && neutrinoData['1']['1']) {
    console.log('\nGate 1 Line 1:');
    console.log(JSON.stringify(neutrinoData['1']['1'], null, 2));
  }

  if (neutrinoData['22'] && neutrinoData['22']['3']) {
    console.log('\nGate 22 Line 3:');
    console.log(JSON.stringify(neutrinoData['22']['3'], null, 2));
  }

  // File size
  const size = fs.statSync(OUTPUT_FILE).size;
  console.log(`\nFile size: ${(size / 1024).toFixed(1)} KB`);
  console.log(`Status: ${isValid ? 'VALID' : 'ISSUES FOUND'}`);
}

main();
