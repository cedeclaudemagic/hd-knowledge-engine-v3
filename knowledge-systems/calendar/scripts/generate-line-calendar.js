/**
 * Generate Line Calendar Mapping
 *
 * Calculates approximate calendar dates for all 384 lines based on:
 * - Tropical zodiac (0° Aries = March equinox)
 * - Gate 41.1 starts at 302° (2° Aquarius) ≈ January 22
 * - Sun moves ~0.9856°/day on average
 * - Each line spans 0.9375°
 *
 * Note: Actual dates vary by 1-2 days per year due to:
 * - Earth's elliptical orbit (faster near perihelion in January)
 * - Leap years
 */

const fs = require('fs');
const path = require('path');

// Load gate sequence
const gateSequence = require('../../../core/root-system/gate-sequence.json').sequence;

// Constants
const DEGREES_PER_LINE = 0.9375;  // 360° / 384 lines
const LINES_PER_GATE = 6;
const TOTAL_LINES = 384;

// Gate 41.1 starts at 302° (2° Aquarius)
// This corresponds to approximately January 22
const GATE_41_START_DEGREE = 302.0;

// Reference: 0° Aries (March equinox) is approximately March 20-21
// We'll use March 20 as day 79 of a non-leap year
const ARIES_0_DAY_OF_YEAR = 79;  // March 20

// Average sun motion
const AVG_DEGREES_PER_DAY = 360 / 365.25;  // ~0.9856°

// Month data for date formatting
const MONTHS = [
  { name: 'January', abbrev: 'Jan', days: 31 },
  { name: 'February', abbrev: 'Feb', days: 28 },
  { name: 'March', abbrev: 'Mar', days: 31 },
  { name: 'April', abbrev: 'Apr', days: 30 },
  { name: 'May', abbrev: 'May', days: 31 },
  { name: 'June', abbrev: 'Jun', days: 30 },
  { name: 'July', abbrev: 'Jul', days: 31 },
  { name: 'August', abbrev: 'Aug', days: 31 },
  { name: 'September', abbrev: 'Sep', days: 30 },
  { name: 'October', abbrev: 'Oct', days: 31 },
  { name: 'November', abbrev: 'Nov', days: 30 },
  { name: 'December', abbrev: 'Dec', days: 31 }
];

/**
 * Convert degree (0-360, 0° = Aries) to approximate day of year
 */
function degreeToDay(degree) {
  // Normalize degree to 0-360
  degree = ((degree % 360) + 360) % 360;

  // Days from 0° Aries
  const daysFromAries = degree / AVG_DEGREES_PER_DAY;

  // Add to Aries day (March 20)
  let dayOfYear = ARIES_0_DAY_OF_YEAR + daysFromAries;

  // Wrap around year
  if (dayOfYear > 365) {
    dayOfYear -= 365;
  }

  return Math.round(dayOfYear);
}

/**
 * Convert day of year to month/day
 */
function dayToDate(dayOfYear) {
  dayOfYear = Math.round(dayOfYear);
  if (dayOfYear <= 0) dayOfYear += 365;
  if (dayOfYear > 365) dayOfYear -= 365;

  let remainingDays = dayOfYear;
  for (let i = 0; i < MONTHS.length; i++) {
    if (remainingDays <= MONTHS[i].days) {
      return {
        month: i + 1,
        day: remainingDays,
        monthName: MONTHS[i].name,
        monthAbbrev: MONTHS[i].abbrev,
        formatted: `${MONTHS[i].abbrev} ${remainingDays}`
      };
    }
    remainingDays -= MONTHS[i].days;
  }

  // Shouldn't reach here
  return { month: 12, day: 31, monthName: 'December', monthAbbrev: 'Dec', formatted: 'Dec 31' };
}

/**
 * Get zodiac sign from degree
 */
function getZodiacSign(degree) {
  degree = ((degree % 360) + 360) % 360;
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const signIndex = Math.floor(degree / 30);
  const degreeInSign = degree % 30;
  return {
    sign: signs[signIndex],
    degreeInSign: degreeInSign,
    formatted: `${degreeInSign.toFixed(2)}° ${signs[signIndex]}`
  };
}

/**
 * Generate all 384 line mappings
 */
function generateLineCalendar() {
  const lines = [];

  for (let wheelPos = 0; wheelPos < 64; wheelPos++) {
    const gateNumber = gateSequence[wheelPos];

    for (let lineNum = 1; lineNum <= 6; lineNum++) {
      const absoluteLinePosition = (wheelPos * LINES_PER_GATE) + (lineNum - 1);

      // Calculate degree (starting from Gate 41.1 at 302°)
      const degree = (GATE_41_START_DEGREE + (absoluteLinePosition * DEGREES_PER_LINE)) % 360;

      // Get calendar date
      const dayOfYear = degreeToDay(degree);
      const dateInfo = dayToDate(dayOfYear);

      // Get zodiac info
      const zodiacInfo = getZodiacSign(degree);

      lines.push({
        gate: gateNumber,
        line: lineNum,
        gateLineKey: `${gateNumber}.${lineNum}`,
        wheelPosition: wheelPos,
        absoluteLinePosition: absoluteLinePosition,
        degree: parseFloat(degree.toFixed(4)),
        zodiac: {
          sign: zodiacInfo.sign,
          degreeInSign: parseFloat(zodiacInfo.degreeInSign.toFixed(4)),
          formatted: zodiacInfo.formatted
        },
        calendar: {
          month: dateInfo.month,
          day: dateInfo.day,
          monthName: dateInfo.monthName,
          monthAbbrev: dateInfo.monthAbbrev,
          formatted: dateInfo.formatted,
          dayOfYear: dayOfYear
        }
      });
    }
  }

  return lines;
}

/**
 * Main execution
 */
function main() {
  console.log('Generating 384 line calendar mapping...\n');

  const lines = generateLineCalendar();

  // Create output object
  const output = {
    systemName: "Line Calendar Mapping",
    version: "1.0.0",
    description: "Calendar dates for all 384 Human Design lines based on tropical zodiac",
    source: "Calculated from gate-zodiac-mapping using average sun motion",
    notes: {
      zodiacSystem: "Tropical (0° Aries = March equinox)",
      startingPoint: "Gate 41.1 at 302° (2° Aquarius) ≈ January 22",
      sunMotion: "Average ~0.9856°/day (360° ÷ 365.25 days)",
      lineSpan: "Each line spans 0.9375° ≈ 0.95 days",
      accuracy: "Dates approximate within ±1-2 days due to Earth's elliptical orbit",
      leapYears: "Dates may shift by 1 day in leap years"
    },
    totalLines: 384,
    lines: lines
  };

  // Write to file
  const outputPath = path.join(__dirname, '../mappings/line-calendar-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`Generated ${lines.length} line mappings`);
  console.log(`Saved to: ${outputPath}\n`);

  // Print sample entries
  console.log('Sample entries:');
  console.log('---------------');

  // Show Gate 41 (start of wheel)
  const gate41Lines = lines.filter(l => l.gate === 41);
  console.log('\nGate 41 (Wheel Start - Aquarius):');
  gate41Lines.forEach(l => {
    console.log(`  ${l.gateLineKey}: ${l.calendar.formatted} (${l.zodiac.formatted})`);
  });

  // Show Gate 1 (middle of wheel)
  const gate1Lines = lines.filter(l => l.gate === 1);
  console.log('\nGate 1 (Scorpio):');
  gate1Lines.forEach(l => {
    console.log(`  ${l.gateLineKey}: ${l.calendar.formatted} (${l.zodiac.formatted})`);
  });

  // Show a spring gate
  const gate17Lines = lines.filter(l => l.gate === 17);
  console.log('\nGate 17 (Aries):');
  gate17Lines.forEach(l => {
    console.log(`  ${l.gateLineKey}: ${l.calendar.formatted} (${l.zodiac.formatted})`);
  });

  // Show month boundaries
  console.log('\n\nMonth Boundaries (approximate):');
  console.log('--------------------------------');
  let currentMonth = null;
  lines.forEach(l => {
    if (l.calendar.month !== currentMonth) {
      currentMonth = l.calendar.month;
      console.log(`${l.calendar.monthName}: starts around ${l.gateLineKey} (${l.zodiac.formatted})`);
    }
  });
}

main();
