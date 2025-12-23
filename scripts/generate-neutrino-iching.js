/**
 * Generate Neutrino-Compatible I-Ching JSON Files
 *
 * Creates four JSON files for import into Neutrino-design:
 * - neutrino-iching-blackbook.json (Ra Uru Hu's detailed interpretations)
 * - neutrino-iching-whitebook.json (Condensed interpretations)
 * - neutrino-iching-combined.json (Both versions with labeled sections)
 * - neutrino-iching-electromagnetic.json (Electromagnetic framework interpretation)
 *
 * Output format:
 * {
 *   "gateNumber": {
 *     "lineNumber": {
 *       "name": "Gate X Line Y - keynote",
 *       "asc": "Planet: exaltation text",
 *       "desc": "Planet: detriment text"
 *     }
 *   }
 * }
 */

const fs = require('fs');
const path = require('path');

// Paths
const SOURCE_PATH = path.join(__dirname, '../knowledge-systems/hd-traditional-gates/mappings/hd-gates-mappings.json');
const EM_SOURCE_PATH = path.join(__dirname, '../knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');
const OUTPUT_DIR = path.join(__dirname, '../exports/neutrino');
const BLACKBOOK_OUTPUT = path.join(OUTPUT_DIR, 'neutrino-iching-blackbook.json');
const WHITEBOOK_OUTPUT = path.join(OUTPUT_DIR, 'neutrino-iching-whitebook.json');
const COMBINED_OUTPUT = path.join(OUTPUT_DIR, 'neutrino-iching-combined.json');
const EM_OUTPUT = path.join(OUTPUT_DIR, 'neutrino-iching-electromagnetic.json');

function extractPlanetText(planets, textType) {
  /**
   * Extract planet + description text from planets array
   * textType: 'blackBook' or 'whiteBook'
   * Returns formatted string or placeholder
   */
  if (!planets || planets.length === 0) {
    return textType === 'blackBook'
      ? 'No exaltation defined'
      : 'No exaltation defined';
  }

  return planets.map(p => {
    const desc = p.description && p.description[textType];
    if (desc) {
      return `${p.planet}: ${desc}`;
    }
    return `${p.planet}: (no description)`;
  }).join(' | ');
}

function transformToNeutrino(sourceData, bookType) {
  /**
   * Transform source data to Neutrino format
   * bookType: 'blackBook' or 'whiteBook'
   */
  const result = {};

  for (const mapping of sourceData.mappings) {
    const gateKey = String(mapping.gateNumber);
    const lineKey = String(mapping.lineNumber);
    const knowledge = mapping.knowledge;

    // Initialize gate object if needed
    if (!result[gateKey]) {
      result[gateKey] = {};
    }

    // Build name: "Gate X Line Y - keynote"
    const name = `Gate ${gateKey} Line ${lineKey} - ${knowledge.lineKeynote}`;

    // Get the book data (blackBook or whiteBook)
    const bookData = knowledge[bookType];

    // Extract exaltation text
    let asc = 'No exaltation defined';
    if (bookData && bookData.exaltation && bookData.exaltation.planets) {
      const planets = bookData.exaltation.planets;
      if (planets.length > 0) {
        asc = planets.map(p => {
          const desc = p.description && p.description[bookType];
          return desc ? `${p.planet}: ${desc}` : `${p.planet}: (no description)`;
        }).join(' | ');
      }
    }

    // Extract detriment text
    let desc = 'No detriment defined';
    if (bookData && bookData.detriment && bookData.detriment.planets) {
      const planets = bookData.detriment.planets;
      if (planets.length > 0) {
        desc = planets.map(p => {
          const descText = p.description && p.description[bookType];
          return descText ? `${p.planet}: ${descText}` : `${p.planet}: (no description)`;
        }).join(' | ');
      }
    }

    result[gateKey][lineKey] = { name, asc, desc };
  }

  return result;
}

function transformToCombined(sourceData) {
  /**
   * Transform source data to Combined Neutrino format
   * Merges Black Book and White Book with labeled sections
   */
  const result = {};

  for (const mapping of sourceData.mappings) {
    const gateKey = String(mapping.gateNumber);
    const lineKey = String(mapping.lineNumber);
    const knowledge = mapping.knowledge;

    if (!result[gateKey]) {
      result[gateKey] = {};
    }

    const name = `Gate ${gateKey} Line ${lineKey} - ${knowledge.lineKeynote}`;

    // Helper to extract text for a book type
    const extractText = (bookData, bookType, fieldType) => {
      if (!bookData || !bookData[fieldType] || !bookData[fieldType].planets) {
        return null;
      }
      const planets = bookData[fieldType].planets;
      if (planets.length === 0) return null;

      return planets.map(p => {
        const desc = p.description && p.description[bookType];
        return desc ? `${p.planet}: ${desc}` : `${p.planet}: (no description)`;
      }).join(' | ');
    };

    // Extract exaltation from both books
    const bbExalt = extractText(knowledge.blackBook, 'blackBook', 'exaltation');
    const wbExalt = extractText(knowledge.whiteBook, 'whiteBook', 'exaltation');

    // Extract detriment from both books
    const bbDetri = extractText(knowledge.blackBook, 'blackBook', 'detriment');
    const wbDetri = extractText(knowledge.whiteBook, 'whiteBook', 'detriment');

    // Build combined asc field
    let asc = '';
    if (bbExalt) asc += `[Black Book] ${bbExalt}`;
    if (wbExalt) {
      if (asc) asc += ' ';
      asc += `[White Book] ${wbExalt}`;
    }
    if (!asc) asc = 'No exaltation defined';

    // Build combined desc field
    let desc = '';
    if (bbDetri) desc += `[Black Book] ${bbDetri}`;
    if (wbDetri) {
      if (desc) desc += ' ';
      desc += `[White Book] ${wbDetri}`;
    }
    if (!desc) desc = 'No detriment defined';

    result[gateKey][lineKey] = { name, asc, desc };
  }

  return result;
}

function transformToElectromagnetic(emData) {
  /**
   * Transform electromagnetic data to Neutrino format
   * Full EM context: gateType, position, axis, vector, trigram info
   */
  const result = {};

  for (const mapping of emData.mappings) {
    const gateKey = String(mapping.gate);
    const lineKey = String(mapping.line);

    if (!result[gateKey]) {
      result[gateKey] = {};
    }

    const em = mapping.electromagnetic;
    const interp = mapping.interpretation;
    const inner = em.innerTrigram;
    const outer = em.outerTrigram;

    // Extract the short keynote from lineFunction (first part before "—")
    const lineFunctionShort = interp.lineFunction.split('—')[0].trim();

    // Build name: "Gate X Line Y - keynote"
    const name = `Gate ${gateKey} Line ${lineKey} - ${lineFunctionShort}`;

    // Build asc: [gateType] linePosition at axis (vector): positionMeaning. lineFunction
    const vector = `${em.vector.from}→${em.vector.to}`;
    const asc = `[${em.gateType}] ${interp.linePosition} at ${inner.axis} (${vector}): ${interp.positionMeaning}. ${interp.lineFunction}`;

    // Build desc: Shadow: shadow. Inner: trigram (position), Outer: trigram (position)
    const desc = `Shadow: ${interp.shadow}. Inner: ${inner.name} (${inner.position}), Outer: ${outer.name} (${outer.position})`;

    result[gateKey][lineKey] = { name, asc, desc };
  }

  return result;
}

function validateOutput(data, label) {
  /**
   * Validate the output has correct structure
   */
  const gateCount = Object.keys(data).length;
  let lineCount = 0;
  const issues = [];

  for (let gate = 1; gate <= 64; gate++) {
    const gateKey = String(gate);
    if (!data[gateKey]) {
      issues.push(`Missing gate ${gate}`);
      continue;
    }

    for (let line = 1; line <= 6; line++) {
      const lineKey = String(line);
      if (!data[gateKey][lineKey]) {
        issues.push(`Missing ${gateKey}.${lineKey}`);
      } else {
        lineCount++;
        const entry = data[gateKey][lineKey];
        if (!entry.name) issues.push(`${gateKey}.${lineKey}: missing name`);
        if (!entry.asc) issues.push(`${gateKey}.${lineKey}: missing asc`);
        if (!entry.desc) issues.push(`${gateKey}.${lineKey}: missing desc`);
      }
    }
  }

  console.log(`\n${label} Validation:`);
  console.log(`  Gates: ${gateCount}/64`);
  console.log(`  Lines: ${lineCount}/384`);

  if (issues.length > 0) {
    console.log(`  Issues (${issues.length}):`);
    issues.slice(0, 10).forEach(i => console.log(`    - ${i}`));
    if (issues.length > 10) {
      console.log(`    ... and ${issues.length - 10} more`);
    }
  } else {
    console.log(`  Status: VALID`);
  }

  return issues.length === 0;
}

function main() {
  console.log('Neutrino I-Ching Generator');
  console.log('='.repeat(40));

  // Read source data
  console.log('\nReading source data...');
  const sourceData = JSON.parse(fs.readFileSync(SOURCE_PATH, 'utf8'));
  console.log(`  Traditional: ${sourceData.totalLines} lines from ${sourceData.totalGates} gates`);

  const emData = JSON.parse(fs.readFileSync(EM_SOURCE_PATH, 'utf8'));
  console.log(`  Electromagnetic: ${emData.mappings.length} lines`);

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`  Created output directory: ${OUTPUT_DIR}`);
  }

  // Generate Black Book version
  console.log('\nGenerating Black Book version...');
  const blackBook = transformToNeutrino(sourceData, 'blackBook');
  const blackBookValid = validateOutput(blackBook, 'Black Book');

  // Generate White Book version
  console.log('\nGenerating White Book version...');
  const whiteBook = transformToNeutrino(sourceData, 'whiteBook');
  const whiteBookValid = validateOutput(whiteBook, 'White Book');

  // Generate Combined version
  console.log('\nGenerating Combined version...');
  const combined = transformToCombined(sourceData);
  const combinedValid = validateOutput(combined, 'Combined');

  // Generate Electromagnetic version
  console.log('\nGenerating Electromagnetic version...');
  const electromagnetic = transformToElectromagnetic(emData);
  const emValid = validateOutput(electromagnetic, 'Electromagnetic');

  // Write output files
  console.log('\nWriting output files...');
  fs.writeFileSync(BLACKBOOK_OUTPUT, JSON.stringify(blackBook, null, 2));
  console.log(`  Written: ${BLACKBOOK_OUTPUT}`);

  fs.writeFileSync(WHITEBOOK_OUTPUT, JSON.stringify(whiteBook, null, 2));
  console.log(`  Written: ${WHITEBOOK_OUTPUT}`);

  fs.writeFileSync(COMBINED_OUTPUT, JSON.stringify(combined, null, 2));
  console.log(`  Written: ${COMBINED_OUTPUT}`);

  fs.writeFileSync(EM_OUTPUT, JSON.stringify(electromagnetic, null, 2));
  console.log(`  Written: ${EM_OUTPUT}`);

  // Summary
  console.log('\n' + '='.repeat(40));
  console.log('SUMMARY');
  console.log('='.repeat(40));
  console.log(`Black Book:      ${blackBookValid ? 'VALID' : 'ISSUES FOUND'}`);
  console.log(`White Book:      ${whiteBookValid ? 'VALID' : 'ISSUES FOUND'}`);
  console.log(`Combined:        ${combinedValid ? 'VALID' : 'ISSUES FOUND'}`);
  console.log(`Electromagnetic: ${emValid ? 'VALID' : 'ISSUES FOUND'}`);
  console.log(`\nFiles ready for Neutrino import:`);
  console.log(`  1. ${BLACKBOOK_OUTPUT}`);
  console.log(`  2. ${WHITEBOOK_OUTPUT}`);
  console.log(`  3. ${COMBINED_OUTPUT}`);
  console.log(`  4. ${EM_OUTPUT}`);

  // Show sample entries
  console.log('\nSample entry (Gate 1 Line 1 - Black Book):');
  console.log(JSON.stringify(blackBook['1']['1'], null, 2));

  console.log('\nSample entry (Gate 1 Line 1 - Electromagnetic):');
  console.log(JSON.stringify(electromagnetic['1']['1'], null, 2));
}

main();
