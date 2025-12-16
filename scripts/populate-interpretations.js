/**
 * Populate Interpretation Fields
 *
 * This script populates the interpretation fields in the electromagnetic lines mappings
 * using a combination of:
 * 1. Templates based on gate type × line position
 * 2. Validated interpretations from the proof-of-concept work
 *
 * Usage: node scripts/populate-interpretations.js
 */

const fs = require('fs');
const path = require('path');

const MAPPINGS_PATH = path.join(__dirname, '..', 'knowledge-systems/electromagnetic-lines/mappings/electromagnetic-lines-mappings.json');

// Axis descriptions for template substitution
const AXIS_DESCRIPTIONS = {
  'poles': { void: 'source', matter: 'sink', function: 'reference' },
  'storage': { void: 'capacitance', matter: 'inductance', function: 'holding' },
  'flow': { void: 'voltage', matter: 'current', function: 'exchange' },
  'gates': { void: 'gate-out/open', matter: 'gate-in/close', function: 'switching' }
};

// Position descriptions
const POSITION_NAMES = {
  '-4': 'source (void pole)',
  '-3': 'capacitance (void storage)',
  '-2': 'voltage (void flow)',
  '-1': 'gate-out (void gate)',
  '1': 'gate-in (matter gate)',
  '2': 'current (matter flow)',
  '3': 'inductance (matter storage)',
  '4': 'sink (matter pole)'
};

// Shadow types by gate type at Line 6
const LINE_6_SHADOW_TYPES = {
  'doubled': {
    '-4': 'losing-reference',
    '4': 'fixation',
    '-1': 'frustration',
    '1': 'frustration',
    '-2': 'losing-reference',
    '2': 'fixation',
    '-3': 'losing-reference',
    '3': 'fixation'
  },
  'same-phase-material': 'refusing-synthesis',
  'same-phase-void': 'ego-carryover',
  'cross-zero-dematerialising': 'refusing-completion',
  'cross-zero-manifesting': 'spirit-lost-in-form'
};

/**
 * Generate position meaning based on line position and gate type
 */
function generatePositionMeaning(entry) {
  const { line, electromagnetic } = entry;
  const { gateType, innerTrigram, outerTrigram, vector } = electromagnetic;

  const isInner = line <= 3;
  const trigram = isInner ? innerTrigram : outerTrigram;
  const positionName = POSITION_NAMES[trigram.position] || `position ${trigram.position}`;

  const lineDescriptions = {
    1: 'Entry into',
    2: 'Development within',
    3: 'Completion of',
    4: 'Transition into',
    5: 'Development within',
    6: 'Completion of'
  };

  const lineDesc = lineDescriptions[line];

  // Gate type specific context
  let context = '';
  switch (gateType) {
    case 'doubled':
      context = `${trigram.name} standing wave at ${positionName}`;
      break;
    case 'same-phase-material':
      context = isInner
        ? `material circulation from ${POSITION_NAMES[innerTrigram.position]}`
        : `material domain at ${positionName}`;
      break;
    case 'same-phase-void':
      context = isInner
        ? `void circulation from ${POSITION_NAMES[innerTrigram.position]}`
        : `void domain at ${positionName}`;
      break;
    case 'cross-zero-manifesting':
      context = isInner
        ? `void domain at ${POSITION_NAMES[innerTrigram.position]} — preparing to manifest`
        : `matter domain at ${positionName} — having crossed zero`;
      break;
    case 'cross-zero-dematerialising':
      context = isInner
        ? `matter domain at ${POSITION_NAMES[innerTrigram.position]} — preparing to release`
        : `void domain at ${positionName} — having crossed zero`;
      break;
  }

  // Special handling for line 4 (threshold)
  if (line === 4) {
    const transitionDescriptions = {
      'expression-shift': 'Expression shift — internal state becomes external expression',
      'polarity-flip': 'Polarity flip — reversal within the domain',
      'relational-reorientation': 'Relational reorientation — relationship to potential changes',
      'mode-shift': 'Mode shift — crossing zero between domains'
    };
    return transitionDescriptions[electromagnetic.transitionType] || `${lineDesc} ${context}`;
  }

  return `${lineDesc} ${context}`;
}

/**
 * Generate line function based on keynote and gate type
 */
function generateLineFunction(entry) {
  const { electromagnetic, source, line } = entry;
  const { gateType, languageType, innerTrigram, outerTrigram } = electromagnetic;

  const keynote = source.keynote || '';

  // Language type verb prefixes
  const languageVerbs = {
    'state': ['being', 'holding', 'expressing', 'maintaining'],
    'action': ['doing', 'moving', 'structuring', 'progressing'],
    'transformation': ['becoming', 'crossing', 'releasing', 'building']
  };

  const verbs = languageVerbs[languageType] || languageVerbs.action;
  const lineVerb = verbs[Math.min(line - 1, verbs.length - 1)];

  // If keynote exists, use it as the basis
  if (keynote) {
    return `${keynote} — ${lineVerb} at this position`;
  }

  return `${lineVerb.charAt(0).toUpperCase() + lineVerb.slice(1)} within the ${gateType.replace(/-/g, ' ')} pattern`;
}

/**
 * Generate shadow based on gate type and line position
 */
function generateShadow(entry) {
  const { line, electromagnetic, source } = entry;
  const { gateType, innerTrigram, outerTrigram } = electromagnetic;

  // Line 6 has characteristic shadows by gate type
  if (line === 6) {
    const shadowType = getShadowType(entry);
    const shadowDescriptions = {
      'losing-reference': 'Losing the reference frame through over-identification',
      'fixation': 'Becoming too fixed to receive or adapt',
      'frustration': 'Seeing clearly but lacking power to effect change',
      'refusing-synthesis': 'Withdrawal from necessary integration',
      'ego-carryover': 'Carrying lesser attributes into the new order',
      'refusing-completion': 'Refusing to complete the transformation',
      'spirit-lost-in-form': 'Material abundance without spiritual light'
    };
    return shadowDescriptions[shadowType] || 'Completion risk at this position';
  }

  // Use detriment description if available
  if (source.detriment?.description) {
    return source.detriment.description;
  }

  // Generic shadow based on line position
  const genericShadows = {
    1: 'Hesitation at entry point',
    2: 'Stagnation during development',
    3: 'Premature completion or over-extension',
    4: 'Failed transition across threshold',
    5: 'Losing direction during development'
  };

  return genericShadows[line] || 'Position-specific risk';
}

/**
 * Get shadow type classification
 */
function getShadowType(entry) {
  const { line, electromagnetic } = entry;
  const { gateType, innerTrigram } = electromagnetic;

  if (line !== 6) return 'general';

  if (gateType === 'doubled') {
    const shadowMap = LINE_6_SHADOW_TYPES.doubled;
    return shadowMap[innerTrigram.position] || 'general';
  }

  return LINE_6_SHADOW_TYPES[gateType] || 'general';
}

/**
 * Validated interpretations from line-level-validation.md
 * These serve as the quality standard
 */
const VALIDATED_INTERPRETATIONS = {
  // Gate 1 (Doubled at -4, Source)
  '1-1': {
    positionMeaning: 'Entry into pure source position',
    lineFunction: 'Creation independent of will — timing as the key to self-expression',
    shadow: 'Impatience disrupting natural creative timing'
  },
  '1-2': {
    positionMeaning: 'Development within pure source',
    lineFunction: 'Love as the light of creation — beauty harmonising inspiration',
    shadow: 'Desire and passion displacing creative clarity'
  },
  '1-3': {
    positionMeaning: 'Completion of inner source — perfected creative energy',
    lineFunction: 'The energy to sustain creative work — deep need for self-expression',
    shadow: 'Burnout from unsustainable creative output'
  },
  '1-4': {
    positionMeaning: 'Expression shift — internal creation becomes external expression',
    lineFunction: 'Aloneness as the medium for creativity — solitary self-expression',
    shadow: 'Social rejection blocking authentic expression'
  },
  '1-5': {
    positionMeaning: 'Development of external expression',
    lineFunction: 'Attraction — creative magnetism that draws attention naturally',
    shadow: 'Ego attachment to being seen'
  },
  '1-6': {
    positionMeaning: 'Completion at pure source — standing wave limit',
    lineFunction: 'Objectivity — seeing clearly without personal distortion',
    shadow: 'Subjectivity — losing the reference frame through personal identification',
    shadowType: 'losing-reference'
  },

  // Gate 2 (Doubled at +4, Sink)
  '2-1': {
    positionMeaning: 'Entry into pure sink position — receptivity begins',
    lineFunction: 'Intuition — receptive knowing that doesn\'t require understanding',
    shadow: 'Doubt undermining intuitive reception'
  },
  '2-2': {
    positionMeaning: 'Development within pure sink',
    lineFunction: 'Genius — receptivity so complete it accesses universal patterns',
    shadow: 'Cynicism blocking the flow of received insight'
  },
  '2-3': {
    positionMeaning: 'Completion of inner sink — perfected receptivity',
    lineFunction: 'Patience — enduring through waiting for what must be received',
    shadow: 'Impatience forcing action before reception is complete'
  },
  '2-4': {
    positionMeaning: 'Expression shift — internal reception becomes external knowing',
    lineFunction: 'Secretiveness — not needing to express what has been received',
    shadow: 'Manipulation through withholding'
  },
  '2-5': {
    positionMeaning: 'Development of external reception',
    lineFunction: 'Application — practical grounding of what has been received',
    shadow: 'Theory without practice'
  },
  '2-6': {
    positionMeaning: 'Completion at pure sink — standing wave limit',
    lineFunction: 'Fixation — the perfected form that can become too fixed',
    shadow: 'Rigidity — too fixed to receive new direction',
    shadowType: 'fixation'
  },

  // Gate 57 (Doubled at -1, Gate OUT)
  '57-1': {
    positionMeaning: 'Entry into gate discrimination position',
    lineFunction: 'Confusion — the state before clarity that demands discrimination',
    shadow: 'Paralysis from inability to penetrate confusion'
  },
  '57-2': {
    positionMeaning: 'Development of discrimination capacity',
    lineFunction: 'Cleansing — the penetrating power that clears what obscures',
    shadow: 'Avoidance of necessary cleansing'
  },
  '57-3': {
    positionMeaning: 'Completion of inner gate — perfected discrimination',
    lineFunction: 'Acuteness — sharpened clarity that penetrates to essentials',
    shadow: 'Over-analysis that misses the moment'
  },
  '57-4': {
    positionMeaning: 'Expression shift — internal clarity becomes external direction',
    lineFunction: 'The Director — clarity becomes the power to direct',
    shadow: 'Directing others without clarity'
  },
  '57-5': {
    positionMeaning: 'Development of external clarity',
    lineFunction: 'Progression — steady advancement through sustained clarity',
    shadow: 'Stagnation from loss of forward momentum'
  },
  '57-6': {
    positionMeaning: 'Completion at gate position — standing wave limit',
    lineFunction: 'Utilization — putting clarity into practical service',
    shadow: 'Frustration — seeing clearly but lacking power to change',
    shadowType: 'frustration'
  },

  // Gate 23 (Same-phase Material, +4 → +3)
  '23-1': {
    positionMeaning: 'Entry into material circulation from sink toward storage',
    lineFunction: 'Proselytizing — the drive to spread knowing through expression',
    shadow: 'Destructive spreading of incomplete knowing'
  },
  '23-2': {
    positionMeaning: 'Development of material structuring',
    lineFunction: 'Self-Defense — protecting the unique expression from attack',
    shadow: 'Paranoid defense that isolates'
  },
  '23-3': {
    positionMeaning: 'Completion of inner material phase — peak vitality',
    lineFunction: 'Individuality — vitality and personal power that attracts attention',
    shadow: 'Individuality that repels rather than attracts'
  },
  '23-4': {
    positionMeaning: 'Polarity flip — vitality fragments before restructuring',
    lineFunction: 'Fragmentation — breaking apart of expression before new synthesis',
    shadow: 'Permanent fragmentation without reintegration'
  },
  '23-5': {
    positionMeaning: 'Development in storage position after polarity flip',
    lineFunction: 'Assimilation — integrating diverse elements into new synthesis',
    shadow: 'Failed assimilation leaving fragments unintegrated'
  },
  '23-6': {
    positionMeaning: 'Completion in storage — holding structured diversity',
    lineFunction: 'Fusion — bringing diverse elements to final synthesis',
    shadow: 'Withdrawal from fusion into isolation',
    shadowType: 'refusing-synthesis'
  },

  // Gate 43 (Same-phase Void, -4 → -3)
  '43-1': {
    positionMeaning: 'Entry into void circulation from source toward capacitance',
    lineFunction: 'Patience — waiting for insight to mature before expression',
    shadow: 'Impatience that releases insight prematurely'
  },
  '43-2': {
    positionMeaning: 'Development of insight within void',
    lineFunction: 'Dedication — commitment to following the insight through',
    shadow: 'Fickleness that abandons insight before completion'
  },
  '43-3': {
    positionMeaning: 'Completion of inner void phase — peak flexibility',
    lineFunction: 'Expediency — using any means to achieve the insight\'s goal',
    shadow: 'Expediency without ethical grounding'
  },
  '43-4': {
    positionMeaning: 'Relational reorientation — fluid becomes fixed',
    lineFunction: 'One-Track Mind — stubborn obsession with the insight',
    shadow: 'Fixation that blinds to new information'
  },
  '43-5': {
    positionMeaning: 'Development in capacitance after reorientation',
    lineFunction: 'Progression — steady movement toward breakthrough',
    shadow: 'Stagnation before the breakthrough'
  },
  '43-6': {
    positionMeaning: 'Completion in capacitance — insight ready to discharge',
    lineFunction: 'Breakthrough — establishing new order from insight',
    shadow: 'Ego carried over into new order',
    shadowType: 'ego-carryover'
  },

  // Gate 12 (Cross-zero Dematerialising, +4 → -4)
  '12-1': {
    positionMeaning: 'Entry into full polar transit from matter to void',
    lineFunction: 'Withdrawal — pulling back as preparation for transformation',
    shadow: 'Withdrawal as permanent retreat from life'
  },
  '12-2': {
    positionMeaning: 'Development of dematerialisation process',
    lineFunction: 'Purification — cleansing what must be released',
    shadow: 'Self-indulgent purification that never completes'
  },
  '12-3': {
    positionMeaning: 'Completion of inner matter — preparing to cross zero',
    lineFunction: 'Confession — recognizing inadequacies, purging vanities',
    shadow: 'Confession as performance rather than release'
  },
  '12-4': {
    positionMeaning: 'Mode shift — crossing zero into void domain',
    lineFunction: 'The Prophet — speaking from void side after crossing',
    shadow: 'False prophecy from incomplete crossing'
  },
  '12-5': {
    positionMeaning: 'Development in void domain after crossing',
    lineFunction: 'The Pragmatist — practical application of transcendent insight',
    shadow: 'Pragmatism that loses transcendent source'
  },
  '12-6': {
    positionMeaning: 'Completion at source pole — full dematerialisation',
    lineFunction: 'Metamorphosis — complete transformation, new social form',
    shadow: 'Refusing completion — perfected adaptation to standstill',
    shadowType: 'refusing-completion'
  },

  // Gate 55 (Cross-zero Manifesting, -2 → +1)
  '55-1': {
    positionMeaning: 'Entry into manifesting transit from voltage toward gate',
    lineFunction: 'Cooperation — spirit working with others as entry point',
    shadow: 'Selfish emotional demands that block cooperation'
  },
  '55-2': {
    positionMeaning: 'Development of spirit in voltage phase',
    lineFunction: 'Distrust — protective caution before committing spirit',
    shadow: 'Chronic distrust that prevents any commitment'
  },
  '55-3': {
    positionMeaning: 'Completion of inner voltage — spirit protected before crossing',
    lineFunction: 'Innocence — when form is correct, failure cannot be personally attributed',
    shadow: 'False innocence that avoids responsibility'
  },
  '55-4': {
    positionMeaning: 'Mode shift — spirit crosses zero into matter domain',
    lineFunction: 'Assimilation — framework balancing principles with energy',
    shadow: 'Spirit lost in structural demands'
  },
  '55-5': {
    positionMeaning: 'Development at gate position — spirit in form growing',
    lineFunction: 'Growth — expansion of spirit within material framework',
    shadow: 'Growth at others\' expense'
  },
  '55-6': {
    positionMeaning: 'Completion at gate — manifested spirit',
    lineFunction: 'Selfishness — acquisition focus at completion',
    shadow: 'Material abundance without shared light',
    shadowType: 'spirit-lost-in-form'
  }
};

/**
 * Main function to populate interpretations
 */
function populateInterpretations() {
  console.log('Loading mappings...');
  const data = JSON.parse(fs.readFileSync(MAPPINGS_PATH, 'utf8'));

  let validatedCount = 0;
  let templateCount = 0;

  console.log('Populating interpretations...');

  for (const entry of data.mappings) {
    const key = `${entry.gate}-${entry.line}`;

    // Check for validated interpretation first
    if (VALIDATED_INTERPRETATIONS[key]) {
      const validated = VALIDATED_INTERPRETATIONS[key];
      entry.interpretation = {
        linePosition: entry.interpretation.linePosition, // Keep existing
        positionMeaning: validated.positionMeaning,
        lineFunction: validated.lineFunction,
        shadow: validated.shadow,
        ...(validated.shadowType && { shadowType: validated.shadowType })
      };
      validatedCount++;
    } else {
      // Generate from templates
      entry.interpretation = {
        linePosition: entry.interpretation.linePosition,
        positionMeaning: generatePositionMeaning(entry),
        lineFunction: generateLineFunction(entry),
        shadow: generateShadow(entry),
        ...(entry.line === 6 && { shadowType: getShadowType(entry) })
      };
      templateCount++;
    }
  }

  // Update metadata
  data.validatedLines = validatedCount;
  data.completeness = 'full';
  data.interpretationsGeneratedAt = new Date().toISOString().split('T')[0];

  console.log(`Populated ${validatedCount} validated interpretations`);
  console.log(`Generated ${templateCount} templated interpretations`);
  console.log('Writing updated mappings...');

  fs.writeFileSync(MAPPINGS_PATH, JSON.stringify(data, null, 2));
  console.log('Done.');
}

// Run
populateInterpretations();
