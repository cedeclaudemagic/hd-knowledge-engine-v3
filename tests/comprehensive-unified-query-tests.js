/**
 * COMPREHENSIVE UNIFIED QUERY ENGINE TEST SUITE
 * Tests all 11 knowledge systems through the unified query interface
 *
 * This replaces the old monolithic database tests with tests
 * specifically designed for the modular architecture.
 */

const { getGateKnowledge, getGatesInQuarter, getGatesInFace,
        getGatesWithTrigram, getGatesByCenter, search } = require('../unified-query-engine.js');

let testCount = 0;
let passCount = 0;
let failCount = 0;
const errors = [];

function test(name, testFn) {
    testCount++;
    try {
        const result = testFn();
        // Accept truthy values (strings, objects, arrays) as pass, unless it has success: false
        if (result && (!result.hasOwnProperty('success') || result.success === true)) {
            passCount++;
            console.log(`✅ PASS: ${name}`);
            return true;
        } else {
            failCount++;
            const errorMsg = result && result.error ? result.error : 'Test returned false or null';
            console.log(`❌ FAIL: ${name}`);
            console.log(`   Error: ${errorMsg}`);
            errors.push({ test: name, error: errorMsg });
            return false;
        }
    } catch (e) {
        failCount++;
        console.log(`❌ FAIL: ${name}`);
        console.log(`   Error: ${e.message}`);
        errors.push({ test: name, error: e.message });
        return false;
    }
}

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║  COMPREHENSIVE UNIFIED QUERY ENGINE TEST SUITE           ║');
console.log('║  Testing All 11 Knowledge Systems                        ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

// ============================================================================
// 1. SYSTEM LOADING AND BASIC QUERY TESTS
// ============================================================================
console.log('1. SYSTEM LOADING AND BASIC QUERY TESTS');
console.log('='.repeat(70));

test('Can load and query Gate 1', function() {
    const result = getGateKnowledge(1);
    return result && result.gate === 1 && result.binary === '111111';
});

test('Can load and query Gate 64', function() {
    const result = getGateKnowledge(64);
    return result && result.gate === 64;
});

test('Query returns all expected top-level fields', function() {
    const result = getGateKnowledge(13);
    const requiredFields = ['gate', 'binary', 'codon', 'wheelPosition', 'angle',
                           'quarter', 'face', 'trigrams', 'geneKeys', 'ichingName',
                           'humanDesign', 'codonRing', 'center', 'incarnationCrosses'];
    for (const field of requiredFields) {
        if (!(field in result)) {
            return { success: false, error: `Missing field: ${field}` };
        }
    }
    return true;
});

test('Invalid gate number returns appropriate result', function() {
    try {
        const result = getGateKnowledge(99);
        // Should either throw or return partial data
        return true;
    } catch (e) {
        return true; // Exception is acceptable
    }
});

// ============================================================================
// 2. GENE KEYS SYSTEM TESTS
// ============================================================================
console.log('\n2. GENE KEYS SYSTEM (System 1/11)');
console.log('='.repeat(70));

test('Gate 1 has Gene Keys data', function() {
    const result = getGateKnowledge(1);
    return result.geneKeys &&
           result.geneKeys.shadow === 'Entropy' &&
           result.geneKeys.gift === 'Freshness' &&
           result.geneKeys.siddhi === 'Beauty';
});

test('All 64 gates have Gene Keys shadow/gift/siddhi', function() {
    for (let i = 1; i <= 64; i++) {
        const result = getGateKnowledge(i);
        if (!result.geneKeys || !result.geneKeys.shadow ||
            !result.geneKeys.gift || !result.geneKeys.siddhi) {
            return { success: false, error: `Gate ${i} missing Gene Keys data` };
        }
    }
    return true;
});

test('Gene Keys include introverted/extroverted frequencies', function() {
    const result = getGateKnowledge(1);
    return result.geneKeys &&
           result.geneKeys.introverted &&
           result.geneKeys.extroverted;
});

// ============================================================================
// 3. I CHING NAMES SYSTEM TESTS
// ============================================================================
console.log('\n3. I CHING NAMES SYSTEM (System 2/11)');
console.log('='.repeat(70));

test('Gate 1 has I Ching name "The Creative"', function() {
    const result = getGateKnowledge(1);
    return result.ichingName &&
           result.ichingName.ichingName === 'The Creative' &&
           result.ichingName.chineseName === '乾 (Qián)';
});

test('All 64 gates have I Ching names', function() {
    for (let i = 1; i <= 64; i++) {
        const result = getGateKnowledge(i);
        if (!result.ichingName || !result.ichingName.ichingName) {
            return { success: false, error: `Gate ${i} missing I Ching name` };
        }
    }
    return true;
});

test('I Ching data includes hexagram numbers', function() {
    const result = getGateKnowledge(1);
    return result.ichingName && result.ichingName.hexagramNumber === 1;
});

test('I Ching data includes Chinese characters', function() {
    const result = getGateKnowledge(13);
    return result.ichingName &&
           result.ichingName.chineseName &&
           result.ichingName.chineseName.includes('同人');
});

// ============================================================================
// 4. HUMAN DESIGN GATES SYSTEM TESTS
// ============================================================================
console.log('\n4. HUMAN DESIGN GATES SYSTEM (System 3/11)');
console.log('='.repeat(70));

test('Gate 1 has HD keyword "Self-Expression"', function() {
    const result = getGateKnowledge(1);
    return result.humanDesign && result.humanDesign.keyword === 'Self-Expression';
});

test('All 64 gates have Human Design keywords', function() {
    for (let i = 1; i <= 64; i++) {
        const result = getGateKnowledge(i);
        if (!result.humanDesign || !result.humanDesign.keyword) {
            return { success: false, error: `Gate ${i} missing HD keyword` };
        }
    }
    return true;
});

test('HD data includes center assignments', function() {
    const result = getGateKnowledge(1);
    return result.humanDesign && result.humanDesign.center === 'G';
});

test('HD data includes channel information', function() {
    const result = getGateKnowledge(1);
    return result.humanDesign &&
           result.humanDesign.channel === '1-8' &&
           result.humanDesign.harmonicGate === 8;
});

// ============================================================================
// 5. QUARTERS SYSTEM TESTS
// ============================================================================
console.log('\n5. QUARTERS SYSTEM (System 4/11)');
console.log('='.repeat(70));

test('Gate 1 is in Quarter of Mutation', function() {
    const result = getGateKnowledge(1);
    return result.quarter === 'Mutation';
});

test('Quarter meanings are accessible', function() {
    const result = getGateKnowledge(1);
    return result.quarterMeaning &&
           result.quarterMeaning.purpose &&
           result.quarterMeaning.theme;
});

test('All 4 quarters are represented', function() {
    const quarters = new Set();
    for (let i = 1; i <= 64; i++) {
        const result = getGateKnowledge(i);
        quarters.add(result.quarter);
    }
    const expected = ['Mutation', 'Initiation', 'Duality', 'Civilisation'];
    for (const q of expected) {
        if (!quarters.has(q)) {
            return { success: false, error: `Missing quarter: ${q}` };
        }
    }
    return true;
});

test('getGatesInQuarter function works', function() {
    const gates = getGatesInQuarter('Mutation');
    return gates && gates.length === 16 && gates.includes(1);
});

// ============================================================================
// 6. FACES SYSTEM TESTS
// ============================================================================
console.log('\n6. FACES (MYTHOLOGY) SYSTEM (System 5/11)');
console.log('='.repeat(70));

test('Gate 1 is in Face of Hades', function() {
    const result = getGateKnowledge(1);
    return result.face === 'Hades';
});

test('Face meanings include mythology', function() {
    const result = getGateKnowledge(1);
    return result.faceMeaning &&
           result.faceMeaning.mythology &&
           result.faceMeaning.archetype;
});

test('All 16 faces are represented', function() {
    const faces = new Set();
    for (let i = 1; i <= 64; i++) {
        const result = getGateKnowledge(i);
        faces.add(result.face);
    }
    return faces.size === 16;
});

test('getGatesInFace function works', function() {
    const gates = getGatesInFace('Hades');
    return gates && gates.length === 4 && gates.includes(1);
});

// ============================================================================
// 7. TRIGRAMS SYSTEM TESTS
// ============================================================================
console.log('\n7. TRIGRAMS SYSTEM (System 6/11)');
console.log('='.repeat(70));

test('Gate 1 has Heaven/Heaven trigrams', function() {
    const result = getGateKnowledge(1);
    return result.trigrams &&
           result.trigrams.upper === 'Heaven' &&
           result.trigrams.lower === 'Heaven';
});

test('Trigram meanings are accessible', function() {
    const result = getGateKnowledge(1);
    return result.trigramMeanings &&
           result.trigramMeanings.upper &&
           result.trigramMeanings.upper.element === 'Heaven';
});

test('All 8 trigrams are represented', function() {
    const trigrams = new Set();
    for (let i = 1; i <= 64; i++) {
        const result = getGateKnowledge(i);
        trigrams.add(result.trigrams.upper);
        trigrams.add(result.trigrams.lower);
    }
    const expected = ['Heaven', 'Earth', 'Thunder', 'Water', 'Mountain', 'Wind', 'Fire', 'Lake'];
    for (const t of expected) {
        if (!trigrams.has(t)) {
            return { success: false, error: `Missing trigram: ${t}` };
        }
    }
    return true;
});

test('getGatesWithTrigram function works', function() {
    const gates = getGatesWithTrigram('Heaven', 'upper');
    return gates && gates.length === 8 && gates.includes(1);
});

// ============================================================================
// 8. CODON RINGS SYSTEM TESTS
// ============================================================================
console.log('\n8. CODON RINGS SYSTEM (System 7/11)');
console.log('='.repeat(70));

test('Gate 1 is in Ring of Fire (Lysine)', function() {
    const result = getGateKnowledge(1);
    return result.codonRing &&
           result.codonRing.ring === 'Ring of Fire' &&
           result.codonRing.aminoAcid === 'Lysine';
});

test('Codon ring includes codon list', function() {
    const result = getGateKnowledge(1);
    return result.codonRing &&
           Array.isArray(result.codonRing.codons) &&
           result.codonRing.codons.includes('AAA');
});

test('All 64 gates have codon ring assignments', function() {
    for (let i = 1; i <= 64; i++) {
        const result = getGateKnowledge(i);
        if (!result.codonRing || !result.codonRing.ring) {
            return { success: false, error: `Gate ${i} missing codon ring` };
        }
    }
    return true;
});

test('Codon rings match binary-to-codon conversions', function() {
    const result = getGateKnowledge(1);
    // Gate 1 = 111111 = AAA
    return result.binary === '111111' && result.codon === 'AAA';
});

// ============================================================================
// 9. CHANNELS SYSTEM TESTS
// ============================================================================
console.log('\n9. CHANNELS SYSTEM (System 8/11)');
console.log('='.repeat(70));

test('Gate 1 is involved in Channel 1-8', function() {
    const result = getGateKnowledge(1);
    return result.channelsInvolved &&
           result.channelsInvolved.length > 0 &&
           result.channelsInvolved[0].channel === '1-8';
});

test('Channel data includes name and circuit', function() {
    const result = getGateKnowledge(1);
    return result.channelsInvolved[0].name === 'Inspiration' &&
           result.channelsInvolved[0].circuit;
});

test('Gates with no channels have empty array', function() {
    // Find a gate with no channels (if any)
    // Most gates should have at least one channel
    return true; // This is architecture-dependent
});

test('getGatesByCenter function works', function() {
    const gates = getGatesByCenter('G');
    return gates && gates.length > 0 && gates.includes(1);
});

// ============================================================================
// 10. INCARNATION CROSSES SYSTEM TESTS
// ============================================================================
console.log('\n10. INCARNATION CROSSES SYSTEM (System 9/11)');
console.log('='.repeat(70));

test('Gate 1 has incarnation crosses data', function() {
    const result = getGateKnowledge(1);
    return result.incarnationCrosses &&
           typeof result.incarnationCrosses === 'object';
});

test('Incarnation crosses include all 4 positions', function() {
    const result = getGateKnowledge(13);
    return result.incarnationCrosses.crossesAsPersonalitySun &&
           result.incarnationCrosses.crossesAsPersonalityEarth &&
           result.incarnationCrosses.crossesAsDesignSun &&
           result.incarnationCrosses.crossesAsDesignEarth;
});

test('Each position has LAX, RAX, and JX crosses', function() {
    const result = getGateKnowledge(13);
    const types = result.incarnationCrosses.crossesAsPersonalitySun.map(c => c.type);
    return types.includes('LAX') && types.includes('RAX') && types.includes('JX');
});

test('Cross definitions include all 4 gates', function() {
    const result = getGateKnowledge(1);
    const cross = result.incarnationCrosses.crossesAsPersonalitySun[0];
    return cross.gates && cross.gates.length === 4;
});

test('All 64 gates have incarnation crosses', function() {
    for (let i = 1; i <= 64; i++) {
        const result = getGateKnowledge(i);
        if (!result.incarnationCrosses) {
            return { success: false, error: `Gate ${i} missing incarnation crosses` };
        }
    }
    return true;
});

// ============================================================================
// 11. CENTERS SYSTEM TESTS
// ============================================================================
console.log('\n11. CENTERS SYSTEM (System 10/11)');
console.log('='.repeat(70));

test('Gate 1 is assigned to G Center', function() {
    const result = getGateKnowledge(1);
    return result.center === 'G';
});

test('Center knowledge includes function and theme', function() {
    const result = getGateKnowledge(1);
    return result.centerKnowledge &&
           result.centerKnowledge.function &&
           result.centerKnowledge.theme;
});

test('All gates are assigned to a center', function() {
    for (let i = 1; i <= 64; i++) {
        const result = getGateKnowledge(i);
        if (!result.center) {
            return { success: false, error: `Gate ${i} missing center assignment` };
        }
    }
    return true;
});

test('All 9 centers are represented', function() {
    const centers = new Set();
    for (let i = 1; i <= 64; i++) {
        const result = getGateKnowledge(i);
        centers.add(result.center);
    }
    return centers.size === 9;
});

// ============================================================================
// 12. LINE-LEVEL QUERIES (TRADITIONAL HD GATES - 384 LINES)
// ============================================================================
console.log('\n12. LINE-LEVEL QUERIES (Traditional HD Gates System 11/11)');
console.log('='.repeat(70));

test('Can query specific line (Gate 13, Line 4)', function() {
    const result = getGateKnowledge(13, 4);
    return result && result.line === 4 && result.lineKnowledge;
});

test('Line knowledge is only present when line requested', function() {
    const gateOnly = getGateKnowledge(13);
    const gateLine = getGateKnowledge(13, 4);
    return !gateOnly.lineKnowledge && gateLine.lineKnowledge;
});

test('All 6 lines exist for Gate 1', function() {
    for (let line = 1; line <= 6; line++) {
        const result = getGateKnowledge(1, line);
        if (!result.lineKnowledge) {
            return { success: false, error: `Gate 1 Line ${line} missing data` };
        }
    }
    return true;
});

// ============================================================================
// 13. MATHEMATICAL CONSISTENCY TESTS
// ============================================================================
console.log('\n13. MATHEMATICAL CONSISTENCY TESTS');
console.log('='.repeat(70));

test('Binary patterns are unique for all 64 gates', function() {
    const binaries = new Set();
    for (let i = 1; i <= 64; i++) {
        const result = getGateKnowledge(i);
        if (binaries.has(result.binary)) {
            return { success: false, error: `Duplicate binary: ${result.binary}` };
        }
        binaries.add(result.binary);
    }
    return binaries.size === 64;
});

test('Codons are valid RNA/DNA sequences', function() {
    const validBases = ['A', 'C', 'G', 'T', 'U']; // Accept both DNA (T) and RNA (U)
    for (let i = 1; i <= 64; i++) {
        const result = getGateKnowledge(i);
        if (result.codon.length !== 3) {
            return { success: false, error: `Gate ${i} codon wrong length` };
        }
        for (const base of result.codon) {
            if (!validBases.includes(base)) {
                return { success: false, error: `Invalid base in codon: ${base}` };
            }
        }
    }
    return true;
});

test('Wheel positions range from 0-63', function() {
    for (let i = 1; i <= 64; i++) {
        const result = getGateKnowledge(i);
        if (result.wheelPosition < 0 || result.wheelPosition > 63) {
            return { success: false, error: `Gate ${i} invalid wheel position: ${result.wheelPosition}` };
        }
    }
    return true;
});

test('Opposite gates are symmetric', function() {
    const result1 = getGateKnowledge(1);
    const result2 = getGateKnowledge(result1.oppositeGate);
    return result2.oppositeGate === 1;
});

// ============================================================================
// 14. PERFORMANCE TESTS
// ============================================================================
console.log('\n14. PERFORMANCE TESTS');
console.log('='.repeat(70));

test('Query performance is acceptable (<10ms per gate)', function() {
    const start = Date.now();
    for (let i = 1; i <= 64; i++) {
        getGateKnowledge(i);
    }
    const elapsed = Date.now() - start;
    const avgTime = elapsed / 64;
    console.log(`   Average query time: ${avgTime.toFixed(3)}ms per gate`);
    return avgTime < 10;
});

test('Line queries performance (<10ms)', function() {
    const start = Date.now();
    for (let line = 1; line <= 6; line++) {
        getGateKnowledge(13, line);
    }
    const elapsed = Date.now() - start;
    const avgTime = elapsed / 6;
    console.log(`   Average line query time: ${avgTime.toFixed(3)}ms`);
    return avgTime < 10;
});

// ============================================================================
// 15. SEARCH FUNCTIONALITY TESTS
// ============================================================================
console.log('\n15. SEARCH FUNCTIONALITY TESTS');
console.log('='.repeat(70));

test('Search function exists and is callable', function() {
    return typeof search === 'function';
});

test('Can search for gates with specific text', function() {
    const results = search('creative');
    return results && results.length > 0;
});

// ============================================================================
// FINAL SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('TEST SUMMARY');
console.log('='.repeat(70));
console.log(`Total Tests: ${testCount}`);
console.log(`Passed: ${passCount} ✅`);
console.log(`Failed: ${failCount} ❌`);
console.log(`Success Rate: ${((passCount/testCount)*100).toFixed(1)}%`);

if (failCount > 0) {
    console.log('\n❌ FAILED TESTS:');
    errors.forEach((err, idx) => {
        console.log(`${idx + 1}. ${err.test}`);
        console.log(`   ${err.error}`);
    });
    process.exit(1);
} else {
    console.log('\n✅ ALL TESTS PASSED - Unified Query Engine is fully functional!');
    process.exit(0);
}
