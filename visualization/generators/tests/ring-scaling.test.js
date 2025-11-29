/**
 * Tests for Ring Scaling Module
 *
 * Verifies the unified scaling system works correctly for all ring types.
 *
 * Run with: node visualization/generators/tests/ring-scaling.test.js
 */

const scaling = require('../ring-scaling');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    const result = fn();
    if (result === false || (result && result.success === false)) {
      console.log(`FAIL: ${name}`);
      if (result && result.error) console.log(`  ${result.error}`);
      failed++;
      return false;
    }
    console.log(`PASS: ${name}`);
    passed++;
    return true;
  } catch (err) {
    console.log(`FAIL: ${name}`);
    console.log(`  ${err.message}`);
    failed++;
    return false;
  }
}

function section(name) {
  console.log(`\n--- ${name} ---`);
}

console.log('\n========================================');
console.log('Ring Scaling Module Tests');
console.log('========================================');

// ============================================================================
// SECTION 1: MODULE EXPORTS
// ============================================================================
section('MODULE EXPORTS');

test('calculateScaledGeometry is exported', () => {
  return typeof scaling.calculateScaledGeometry === 'function';
});

test('calculateMultiBandGeometry is exported', () => {
  return typeof scaling.calculateMultiBandGeometry === 'function';
});

test('extractRatios is exported', () => {
  return typeof scaling.extractRatios === 'function';
});

test('extractFontRatios is exported', () => {
  return typeof scaling.extractFontRatios === 'function';
});

test('verifyRatios is exported', () => {
  return typeof scaling.verifyRatios === 'function';
});

test('PRESETS are exported', () => {
  return scaling.PRESETS && typeof scaling.PRESETS === 'object';
});

// ============================================================================
// SECTION 2: BASIC SCALING
// ============================================================================
section('BASIC SCALING');

test('calculateScaledGeometry returns expected structure', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      innerRadius: 400,
      outerRadius: 500
    },
    scaleRatios: {
      radii: { textRadius: 0 },
      fonts: { primary: 0.25 }
    }
  };

  const scaled = scaling.calculateScaledGeometry(config);

  if (!scaled.center) return { success: false, error: 'Missing center' };
  if (!scaled.innerRadius) return { success: false, error: 'Missing innerRadius' };
  if (!scaled.outerRadius) return { success: false, error: 'Missing outerRadius' };
  if (!scaled.bandWidth) return { success: false, error: 'Missing bandWidth' };
  if (!scaled.radii) return { success: false, error: 'Missing radii' };
  if (!scaled.fonts) return { success: false, error: 'Missing fonts' };

  return true;
});

test('Band width calculated correctly', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      innerRadius: 400,
      outerRadius: 500
    },
    scaleRatios: {}
  };

  const scaled = scaling.calculateScaledGeometry(config);

  if (scaled.bandWidth !== 100) {
    return { success: false, error: `Expected bandWidth=100, got ${scaled.bandWidth}` };
  }
  return true;
});

test('MidPoint calculated correctly', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      innerRadius: 400,
      outerRadius: 500
    },
    scaleRatios: {}
  };

  const scaled = scaling.calculateScaledGeometry(config);

  if (scaled.midPoint !== 450) {
    return { success: false, error: `Expected midPoint=450, got ${scaled.midPoint}` };
  }
  return true;
});

// ============================================================================
// SECTION 3: RADIUS CALCULATIONS
// ============================================================================
section('RADIUS CALCULATIONS');

test('Simple ratio (from midPoint) works', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      innerRadius: 400,
      outerRadius: 500  // bandWidth = 100, midPoint = 450
    },
    scaleRatios: {
      radii: {
        atMid: 0,      // Should be 450
        above: 0.25,   // Should be 450 + 25 = 475
        below: -0.25   // Should be 450 - 25 = 425
      }
    }
  };

  const scaled = scaling.calculateScaledGeometry(config);

  if (Math.abs(scaled.radii.atMid - 450) > 0.01) {
    return { success: false, error: `atMid expected 450, got ${scaled.radii.atMid}` };
  }
  if (Math.abs(scaled.radii.above - 475) > 0.01) {
    return { success: false, error: `above expected 475, got ${scaled.radii.above}` };
  }
  if (Math.abs(scaled.radii.below - 425) > 0.01) {
    return { success: false, error: `below expected 425, got ${scaled.radii.below}` };
  }
  return true;
});

test('Offset from inner radius works', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      innerRadius: 400,
      outerRadius: 500  // bandWidth = 100
    },
    scaleRatios: {
      radii: {
        nearInner: { from: 'inner', offset: 0.1 },  // 400 + 10 = 410
        atInner: { from: 'inner', offset: 0 }       // 400
      }
    }
  };

  const scaled = scaling.calculateScaledGeometry(config);

  if (Math.abs(scaled.radii.nearInner - 410) > 0.01) {
    return { success: false, error: `nearInner expected 410, got ${scaled.radii.nearInner}` };
  }
  if (Math.abs(scaled.radii.atInner - 400) > 0.01) {
    return { success: false, error: `atInner expected 400, got ${scaled.radii.atInner}` };
  }
  return true;
});

test('Offset from outer radius works', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      innerRadius: 400,
      outerRadius: 500  // bandWidth = 100
    },
    scaleRatios: {
      radii: {
        aboveOuter: { from: 'outer', offset: 0.1 },  // 500 + 10 = 510
        belowOuter: { from: 'outer', offset: -0.1 }  // 500 - 10 = 490
      }
    }
  };

  const scaled = scaling.calculateScaledGeometry(config);

  if (Math.abs(scaled.radii.aboveOuter - 510) > 0.01) {
    return { success: false, error: `aboveOuter expected 510, got ${scaled.radii.aboveOuter}` };
  }
  if (Math.abs(scaled.radii.belowOuter - 490) > 0.01) {
    return { success: false, error: `belowOuter expected 490, got ${scaled.radii.belowOuter}` };
  }
  return true;
});

// ============================================================================
// SECTION 4: FONT CALCULATIONS
// ============================================================================
section('FONT CALCULATIONS');

test('Font ratios calculate correctly', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      innerRadius: 400,
      outerRadius: 500  // bandWidth = 100
    },
    scaleRatios: {
      fonts: {
        large: 0.25,   // 25
        medium: 0.15,  // 15
        small: 0.10    // 10
      }
    }
  };

  const scaled = scaling.calculateScaledGeometry(config);

  if (Math.abs(scaled.fonts.large - 25) > 0.01) {
    return { success: false, error: `large expected 25, got ${scaled.fonts.large}` };
  }
  if (Math.abs(scaled.fonts.medium - 15) > 0.01) {
    return { success: false, error: `medium expected 15, got ${scaled.fonts.medium}` };
  }
  if (Math.abs(scaled.fonts.small - 10) > 0.01) {
    return { success: false, error: `small expected 10, got ${scaled.fonts.small}` };
  }
  return true;
});

// ============================================================================
// SECTION 5: SCALE FACTOR
// ============================================================================
section('SCALE FACTOR');

test('Scale factor of 0.5 halves all dimensions', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      innerRadius: 400,
      outerRadius: 500
    },
    scaleRatios: {
      radii: { text: 0 },
      fonts: { primary: 0.25 }
    },
    scaleFactor: 0.5
  };

  const scaled = scaling.calculateScaledGeometry(config);

  if (scaled.innerRadius !== 200) {
    return { success: false, error: `innerRadius expected 200, got ${scaled.innerRadius}` };
  }
  if (scaled.outerRadius !== 250) {
    return { success: false, error: `outerRadius expected 250, got ${scaled.outerRadius}` };
  }
  if (scaled.bandWidth !== 50) {
    return { success: false, error: `bandWidth expected 50, got ${scaled.bandWidth}` };
  }
  // Font should be 50 * 0.25 = 12.5
  if (Math.abs(scaled.fonts.primary - 12.5) > 0.01) {
    return { success: false, error: `font expected 12.5, got ${scaled.fonts.primary}` };
  }
  return true;
});

test('Scale factor of 2.0 doubles all dimensions', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      innerRadius: 400,
      outerRadius: 500
    },
    scaleRatios: {
      fonts: { primary: 0.25 }
    },
    scaleFactor: 2.0
  };

  const scaled = scaling.calculateScaledGeometry(config);

  if (scaled.bandWidth !== 200) {
    return { success: false, error: `bandWidth expected 200, got ${scaled.bandWidth}` };
  }
  // Font should be 200 * 0.25 = 50
  if (Math.abs(scaled.fonts.primary - 50) > 0.01) {
    return { success: false, error: `font expected 50, got ${scaled.fonts.primary}` };
  }
  return true;
});

test('Ratios remain constant across scale factors', () => {
  const baseConfig = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      innerRadius: 400,
      outerRadius: 500
    },
    scaleRatios: {
      radii: { text: { from: 'inner', offset: 0.3 } },
      fonts: { primary: 0.25 }
    }
  };

  const scale1 = scaling.calculateScaledGeometry({ ...baseConfig, scaleFactor: 1.0 });
  const scale05 = scaling.calculateScaledGeometry({ ...baseConfig, scaleFactor: 0.5 });
  const scale2 = scaling.calculateScaledGeometry({ ...baseConfig, scaleFactor: 2.0 });

  // Calculate actual ratios
  const ratio1 = (scale1.radii.text - scale1.innerRadius) / scale1.bandWidth;
  const ratio05 = (scale05.radii.text - scale05.innerRadius) / scale05.bandWidth;
  const ratio2 = (scale2.radii.text - scale2.innerRadius) / scale2.bandWidth;

  const tolerance = 0.0001;
  if (Math.abs(ratio1 - 0.3) > tolerance ||
      Math.abs(ratio05 - 0.3) > tolerance ||
      Math.abs(ratio2 - 0.3) > tolerance) {
    return { success: false, error: `Ratios not preserved: ${ratio1}, ${ratio05}, ${ratio2}` };
  }

  // Font ratios
  const fontRatio1 = scale1.fonts.primary / scale1.bandWidth;
  const fontRatio05 = scale05.fonts.primary / scale05.bandWidth;
  const fontRatio2 = scale2.fonts.primary / scale2.bandWidth;

  if (Math.abs(fontRatio1 - 0.25) > tolerance ||
      Math.abs(fontRatio05 - 0.25) > tolerance ||
      Math.abs(fontRatio2 - 0.25) > tolerance) {
    return { success: false, error: `Font ratios not preserved: ${fontRatio1}, ${fontRatio05}, ${fontRatio2}` };
  }

  return true;
});

// ============================================================================
// SECTION 6: CENTER OVERRIDE
// ============================================================================
section('CENTER OVERRIDE');

test('Center override works', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      innerRadius: 400,
      outerRadius: 500
    },
    scaleRatios: {},
    centerOverride: { x: 500, y: 600 }
  };

  const scaled = scaling.calculateScaledGeometry(config);

  if (scaled.center.x !== 500 || scaled.center.y !== 600) {
    return { success: false, error: `Center expected (500,600), got (${scaled.center.x},${scaled.center.y})` };
  }
  return true;
});

// ============================================================================
// SECTION 7: MULTI-BAND GEOMETRY
// ============================================================================
section('MULTI-BAND GEOMETRY');

test('calculateMultiBandGeometry returns expected structure', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      bands: {
        inner: { inner: 300, outer: 400 },
        middle: { inner: 400, outer: 500 },
        outer: { inner: 500, outer: 600 }
      }
    },
    scaleRatios: {
      bands: {
        inner: { textPositionRatio: 0.5 },
        middle: { textPositionRatio: 0.7 },
        outer: { textPositionRatio: 0.5 }
      },
      fonts: { default: 0.25 }
    }
  };

  const scaled = scaling.calculateMultiBandGeometry(config);

  if (!scaled.bands) return { success: false, error: 'Missing bands' };
  if (!scaled.bands.inner) return { success: false, error: 'Missing inner band' };
  if (!scaled.bands.middle) return { success: false, error: 'Missing middle band' };
  if (!scaled.bands.outer) return { success: false, error: 'Missing outer band' };

  return true;
});

test('Multi-band text position ratios work', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      bands: {
        test: { inner: 400, outer: 500 }  // bandWidth = 100
      }
    },
    scaleRatios: {
      bands: {
        test: { textPositionRatio: 0.7 }  // 70% from inner = 400 + 70 = 470
      },
      fonts: { default: 0.25 }
    }
  };

  const scaled = scaling.calculateMultiBandGeometry(config);

  if (Math.abs(scaled.bands.test.textRadius - 470) > 0.01) {
    return { success: false, error: `textRadius expected 470, got ${scaled.bands.test.textRadius}` };
  }
  return true;
});

// ============================================================================
// SECTION 8: RATIO EXTRACTION
// ============================================================================
section('RATIO EXTRACTION');

test('extractRatios calculates correct values from midpoint', () => {
  const geometry = {
    innerRadius: 400,
    outerRadius: 500,  // midPoint = 450, bandWidth = 100
    absoluteValues: {
      atMid: 450,      // ratio = 0
      above: 475,      // ratio = 0.25
      below: 425       // ratio = -0.25
    }
  };

  const ratios = scaling.extractRatios(geometry, 'mid');

  if (Math.abs(ratios.atMid) > 0.0001) {
    return { success: false, error: `atMid expected 0, got ${ratios.atMid}` };
  }
  if (Math.abs(ratios.above - 0.25) > 0.0001) {
    return { success: false, error: `above expected 0.25, got ${ratios.above}` };
  }
  if (Math.abs(ratios.below - (-0.25)) > 0.0001) {
    return { success: false, error: `below expected -0.25, got ${ratios.below}` };
  }
  return true;
});

test('extractFontRatios calculates correct values', () => {
  const bandWidth = 100;
  const fonts = {
    large: 25,   // ratio = 0.25
    small: 10    // ratio = 0.10
  };

  const ratios = scaling.extractFontRatios(bandWidth, fonts);

  if (Math.abs(ratios.large - 0.25) > 0.0001) {
    return { success: false, error: `large expected 0.25, got ${ratios.large}` };
  }
  if (Math.abs(ratios.small - 0.10) > 0.0001) {
    return { success: false, error: `small expected 0.10, got ${ratios.small}` };
  }
  return true;
});

// ============================================================================
// SECTION 9: RATIO VERIFICATION
// ============================================================================
section('RATIO VERIFICATION');

test('verifyRatios passes for correct geometry', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      innerRadius: 400,
      outerRadius: 500
    },
    scaleRatios: {
      radii: { text: { from: 'inner', offset: 0.3 } },
      fonts: { primary: 0.25 }
    }
  };

  const scaled = scaling.calculateScaledGeometry(config);
  const result = scaling.verifyRatios(scaled, config.scaleRatios);

  if (!result.valid) {
    return { success: false, error: `Verification failed: ${result.errors.join(', ')}` };
  }
  return true;
});

test('verifyRatios fails for incorrect ratios', () => {
  const config = {
    baseGeometry: {
      center: { x: 1000, y: 1000 },
      innerRadius: 400,
      outerRadius: 500
    },
    scaleRatios: {
      fonts: { primary: 0.25 }
    }
  };

  const scaled = scaling.calculateScaledGeometry(config);

  // Try to verify against wrong ratios
  const wrongRatios = {
    fonts: { primary: 0.50 }  // Wrong!
  };

  const result = scaling.verifyRatios(scaled, wrongRatios);

  if (result.valid) {
    return { success: false, error: 'Should have failed with wrong ratios' };
  }
  return true;
});

// ============================================================================
// SECTION 10: PRESETS
// ============================================================================
section('PRESETS');

test('textRing preset has expected structure', () => {
  const preset = scaling.PRESETS.textRing;
  if (!preset.radii) return { success: false, error: 'Missing radii' };
  if (!preset.fonts) return { success: false, error: 'Missing fonts' };
  return true;
});

test('symbolRing preset has expected structure', () => {
  const preset = scaling.PRESETS.symbolRing;
  if (!preset.radii) return { success: false, error: 'Missing radii' };
  if (!preset.elements) return { success: false, error: 'Missing elements' };
  return true;
});

test('complexRing preset has expected structure', () => {
  const preset = scaling.PRESETS.complexRing;
  if (!preset.radii) return { success: false, error: 'Missing radii' };
  if (!preset.fonts) return { success: false, error: 'Missing fonts' };
  if (!preset.elements) return { success: false, error: 'Missing elements' };
  return true;
});

// ============================================================================
// SECTION 11: CODON RINGS COMPATIBILITY
// ============================================================================
section('CODON RINGS COMPATIBILITY');

test('Can reproduce codon-rings-ring.js geometry', () => {
  // These are the values from codon-rings-ring.js
  const codonRingsConfig = {
    baseGeometry: {
      center: { x: 1122.0567, y: 1130.6034 },
      innerRadius: 858.2697,
      outerRadius: 1084.3718
    },
    scaleRatios: {
      radii: {
        codonLetters: { from: 'inner', offset: -0.0221 },
        gateDots: { from: 'inner', offset: 0.1106 },
        gateNumbers: { from: 'mid', offset: -0.1327 },
        aminoAcids: { from: 'outer', offset: 0.0531 }
      },
      fonts: {
        codonLetters: 0.1072,
        gateNumbers: 0.0856,
        ringNames: 0.0619,
        aminoAcids: 0.0708
      },
      elements: {
        gateDotRadius: 0.0369
      }
    },
    scaleFactor: 1.0
  };

  const scaled = scaling.calculateScaledGeometry(codonRingsConfig);

  // Verify band width
  const expectedBandWidth = 1084.3718 - 858.2697;
  if (Math.abs(scaled.bandWidth - expectedBandWidth) > 0.01) {
    return { success: false, error: `Band width mismatch: ${scaled.bandWidth} vs ${expectedBandWidth}` };
  }

  // Verify a font size
  const expectedCodonFont = scaled.bandWidth * 0.1072;
  if (Math.abs(scaled.fonts.codonLetters - expectedCodonFont) > 0.01) {
    return { success: false, error: `Codon font mismatch: ${scaled.fonts.codonLetters} vs ${expectedCodonFont}` };
  }

  return true;
});

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('========================================\n');

if (failed > 0) {
  console.log('Some tests failed. Fix issues before using module.\n');
} else {
  console.log('All tests passed. Module ready for use.\n');
}

process.exit(failed > 0 ? 1 : 0);
