#!/usr/bin/env node
/**
 * Template Verification Script
 *
 * Usage: node core/templates/verify-template.js path/to/your-mapping.json
 */

const fs = require('fs');
const path = require('path');
const verification = require('../root-system/verification-protocol.js');

// Get mapping file path from command line
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Usage: node verify-template.js <path-to-mapping-file.json>');
  process.exit(1);
}

const mappingPath = path.resolve(args[0]);

// Load mapping file
console.log(`📂 Loading mapping file: ${mappingPath}`);

let mappingFile;
try {
  const content = fs.readFileSync(mappingPath, 'utf8');
  mappingFile = JSON.parse(content);
} catch (error) {
  console.error(`❌ Error loading mapping file: ${error.message}`);
  process.exit(1);
}

// Run verification
const result = verification.verifyKnowledgeSystem(mappingFile);

// Exit with appropriate code
process.exit(result.passed ? 0 : 1);
