#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the source data
const dataPath = path.join(__dirname, '..', '..', '..', 'data', 'source', 'extracted', 'incarnation-crosses-extracted-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('=== APPLYING AUTHORITATIVE CORRECTIONS ===\n');

let corrections = 0;

// Gate 8: Fix Uncertainty (LAX)
if (data.crosses['Uncertainty']) {
  console.log('Gate 8 - Uncertainty (LAX):');
  console.log(`  Before: ${data.crosses['Uncertainty'].personalitySun}/${data.crosses['Uncertainty'].personalityEarth} - ${data.crosses['Uncertainty'].designSun}/${data.crosses['Uncertainty'].designEarth}`);
  data.crosses['Uncertainty'].personalityEarth = 14;
  data.crosses['Uncertainty'].designSun = 55;
  data.crosses['Uncertainty'].designEarth = 59;
  data.crosses['Uncertainty'].gates = [8, 14, 55, 59];
  data.crosses['Uncertainty'].gateRoles = {
    "8": "Personality Sun",
    "14": "Personality Earth",
    "55": "Design Sun",
    "59": "Design Earth"
  };
  console.log(`  After:  ${data.crosses['Uncertainty'].personalitySun}/${data.crosses['Uncertainty'].personalityEarth} - ${data.crosses['Uncertainty'].designSun}/${data.crosses['Uncertainty'].designEarth}`);
  corrections++;
}

// Gate 8: Fix Contribution (JX)
if (data.crosses['Contribution']) {
  console.log('\nGate 8 - Contribution (JX):');
  console.log(`  Before: ${data.crosses['Contribution'].personalitySun}/${data.crosses['Contribution'].personalityEarth} - ${data.crosses['Contribution'].designSun}/${data.crosses['Contribution'].designEarth}`);
  data.crosses['Contribution'].personalityEarth = 14;
  data.crosses['Contribution'].designSun = 55;
  data.crosses['Contribution'].designEarth = 59;
  data.crosses['Contribution'].gates = [8, 14, 55, 59];
  data.crosses['Contribution'].gateRoles = {
    "8": "Personality Sun",
    "14": "Personality Earth",
    "55": "Design Sun",
    "59": "Design Earth"
  };
  console.log(`  After:  ${data.crosses['Contribution'].personalitySun}/${data.crosses['Contribution'].personalityEarth} - ${data.crosses['Contribution'].designSun}/${data.crosses['Contribution'].designEarth}`);
  corrections++;
}

// Gate 8: Fix Contagion 2 (RAX) - just PE
if (data.crosses['Contagion 2']) {
  console.log('\nGate 8 - Contagion 2 (RAX):');
  console.log(`  Before: ${data.crosses['Contagion 2'].personalitySun}/${data.crosses['Contagion 2'].personalityEarth} - ${data.crosses['Contagion 2'].designSun}/${data.crosses['Contagion 2'].designEarth}`);
  data.crosses['Contagion 2'].personalityEarth = 14;
  data.crosses['Contagion 2'].gates = [8, 14, 30, 29];
  data.crosses['Contagion 2'].gateRoles = {
    "8": "Personality Sun",
    "14": "Personality Earth",
    "30": "Design Sun",
    "29": "Design Earth"
  };
  console.log(`  After:  ${data.crosses['Contagion 2'].personalitySun}/${data.crosses['Contagion 2'].personalityEarth} - ${data.crosses['Contagion 2'].designSun}/${data.crosses['Contagion 2'].designEarth}`);
  corrections++;
}

// Gate 9: ADD Experimentation (JX)
console.log('\nGate 9 - Adding Experimentation (JX):');
data.crosses['Experimentation'] = {
  "type": "JX",
  "personalitySun": 9,
  "personalityEarth": 16,
  "designSun": 64,
  "designEarth": 63,
  "gates": [9, 16, 64, 63],
  "gateRoles": {
    "9": "Personality Sun",
    "16": "Personality Earth",
    "64": "Design Sun",
    "63": "Design Earth"
  }
};
console.log(`  Added:  9/16 - 64/63`);
corrections++;

// Gate 20: Fix Duality (LAX) - rename to Duality 1
if (data.crosses['Duality']) {
  console.log('\nGate 20 - Duality → Duality 1 (LAX):');
  console.log(`  Before: ${data.crosses['Duality'].personalitySun}/${data.crosses['Duality'].personalityEarth} - ${data.crosses['Duality'].designSun}/${data.crosses['Duality'].designEarth}`);

  // Copy to new name
  data.crosses['Duality 1'] = { ...data.crosses['Duality'] };
  data.crosses['Duality 1'].designSun = 37;
  data.crosses['Duality 1'].designEarth = 40;
  data.crosses['Duality 1'].gates = [20, 34, 37, 40];
  data.crosses['Duality 1'].gateRoles = {
    "20": "Personality Sun",
    "34": "Personality Earth",
    "37": "Design Sun",
    "40": "Design Earth"
  };

  // Delete old name
  delete data.crosses['Duality'];

  console.log(`  After:  20/34 - 37/40 (renamed to "Duality 1")`);
  corrections++;
}

// Gate 20: Fix The Now (JX) - rename to Cross of The Now
if (data.crosses['The Now']) {
  console.log('\nGate 20 - The Now → Cross of The Now (JX):');
  console.log(`  Before: ${data.crosses['The Now'].personalitySun}/${data.crosses['The Now'].personalityEarth} - ${data.crosses['The Now'].designSun}/${data.crosses['The Now'].designEarth}`);

  // Copy to new name
  data.crosses['Cross of The Now'] = { ...data.crosses['The Now'] };
  data.crosses['Cross of The Now'].designSun = 37;
  data.crosses['Cross of The Now'].designEarth = 40;
  data.crosses['Cross of The Now'].gates = [20, 34, 37, 40];
  data.crosses['Cross of The Now'].gateRoles = {
    "20": "Personality Sun",
    "34": "Personality Earth",
    "37": "Design Sun",
    "40": "Design Earth"
  };

  // Delete old name
  delete data.crosses['The Now'];

  console.log(`  After:  20/34 - 37/40 (renamed to "Cross of The Now")`);
  corrections++;
}

// Gate 21: Fix Endeavour (LAX)
if (data.crosses['Endeavour']) {
  console.log('\nGate 21 - Endeavour (LAX):');
  console.log(`  Before: ${data.crosses['Endeavour'].personalitySun}/${data.crosses['Endeavour'].personalityEarth} - ${data.crosses['Endeavour'].designSun}/${data.crosses['Endeavour'].designEarth}`);
  data.crosses['Endeavour'].designEarth = 53;
  data.crosses['Endeavour'].gates = [21, 48, 54, 53];
  data.crosses['Endeavour'].gateRoles = {
    "21": "Personality Sun",
    "48": "Personality Earth",
    "54": "Design Sun",
    "53": "Design Earth"
  };
  console.log(`  After:  ${data.crosses['Endeavour'].personalitySun}/${data.crosses['Endeavour'].personalityEarth} - ${data.crosses['Endeavour'].designSun}/${data.crosses['Endeavour'].designEarth}`);
  corrections++;
}

// Gate 21: Fix Control (JX)
if (data.crosses['Control']) {
  console.log('\nGate 21 - Control (JX):');
  console.log(`  Before: ${data.crosses['Control'].personalitySun}/${data.crosses['Control'].personalityEarth} - ${data.crosses['Control'].designSun}/${data.crosses['Control'].designEarth}`);
  data.crosses['Control'].designEarth = 53;
  data.crosses['Control'].gates = [21, 48, 54, 53];
  data.crosses['Control'].gateRoles = {
    "21": "Personality Sun",
    "48": "Personality Earth",
    "54": "Design Sun",
    "53": "Design Earth"
  };
  console.log(`  After:  ${data.crosses['Control'].personalitySun}/${data.crosses['Control'].personalityEarth} - ${data.crosses['Control'].designSun}/${data.crosses['Control'].designEarth}`);
  corrections++;
}

// Gate 33: Fix Refinement (LAX)
if (data.crosses['Refinement']) {
  console.log('\nGate 33 - Refinement (LAX):');
  console.log(`  Before: ${data.crosses['Refinement'].personalitySun}/${data.crosses['Refinement'].personalityEarth} - ${data.crosses['Refinement'].designSun}/${data.crosses['Refinement'].designEarth}`);
  data.crosses['Refinement'].designSun = 2;
  data.crosses['Refinement'].designEarth = 1;
  data.crosses['Refinement'].gates = [33, 19, 2, 1];
  data.crosses['Refinement'].gateRoles = {
    "33": "Personality Sun",
    "19": "Personality Earth",
    "2": "Design Sun",
    "1": "Design Earth"
  };
  console.log(`  After:  ${data.crosses['Refinement'].personalitySun}/${data.crosses['Refinement'].personalityEarth} - ${data.crosses['Refinement'].designSun}/${data.crosses['Refinement'].designEarth}`);
  corrections++;
}

// Gate 33: Fix Retreat (JX)
if (data.crosses['Retreat']) {
  console.log('\nGate 33 - Retreat (JX):');
  console.log(`  Before: ${data.crosses['Retreat'].personalitySun}/${data.crosses['Retreat'].personalityEarth} - ${data.crosses['Retreat'].designSun}/${data.crosses['Retreat'].designEarth}`);
  data.crosses['Retreat'].designSun = 2;
  data.crosses['Retreat'].designEarth = 1;
  data.crosses['Retreat'].gates = [33, 19, 2, 1];
  data.crosses['Retreat'].gateRoles = {
    "33": "Personality Sun",
    "19": "Personality Earth",
    "2": "Design Sun",
    "1": "Design Earth"
  };
  console.log(`  After:  ${data.crosses['Retreat'].personalitySun}/${data.crosses['Retreat'].personalityEarth} - ${data.crosses['Retreat'].designSun}/${data.crosses['Retreat'].designEarth}`);
  corrections++;
}

// Gate 60: Fix Laws 4 (JX → RAX and change Design values)
if (data.crosses['Laws 4']) {
  console.log('\nGate 60 - Laws 4 (JX → RAX):');
  console.log(`  Before: ${data.crosses['Laws 4'].type} ${data.crosses['Laws 4'].personalitySun}/${data.crosses['Laws 4'].personalityEarth} - ${data.crosses['Laws 4'].designSun}/${data.crosses['Laws 4'].designEarth}`);
  data.crosses['Laws 4'].type = 'RAX';
  data.crosses['Laws 4'].designSun = 50;
  data.crosses['Laws 4'].designEarth = 3;
  data.crosses['Laws 4'].gates = [60, 56, 50, 3];
  data.crosses['Laws 4'].gateRoles = {
    "60": "Personality Sun",
    "56": "Personality Earth",
    "50": "Design Sun",
    "3": "Design Earth"
  };
  console.log(`  After:  ${data.crosses['Laws 4'].type} ${data.crosses['Laws 4'].personalitySun}/${data.crosses['Laws 4'].personalityEarth} - ${data.crosses['Laws 4'].designSun}/${data.crosses['Laws 4'].designEarth}`);
  corrections++;
}

// Gate 60: ADD Limitation (JX)
console.log('\nGate 60 - Adding Limitation (JX):');
data.crosses['Limitation'] = {
  "type": "JX",
  "personalitySun": 60,
  "personalityEarth": 56,
  "designSun": 28,
  "designEarth": 27,
  "gates": [60, 56, 28, 27],
  "gateRoles": {
    "60": "Personality Sun",
    "56": "Personality Earth",
    "28": "Design Sun",
    "27": "Design Earth"
  }
};
console.log(`  Added:  60/56 - 28/27`);
corrections++;

console.log(`\n=== SUMMARY ===`);
console.log(`Total corrections applied: ${corrections}`);
console.log(`Total crosses now: ${Object.keys(data.crosses).length}`);

// Save the corrected data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('\n✓ Corrected data saved to:', dataPath);
