/**
 * Verify Calendar Date Accuracy
 *
 * Cross-reference our calculated dates with known Human Design dates
 * to ensure accuracy within ±1-2 days.
 */

const lineCalendar = require('../mappings/line-calendar-mapping.json');

// Known reference dates from Human Design sources
// Format: { gateLine: "gate.line", expectedDate: "Mon DD", tolerance: days }
const KNOWN_DATES = [
  // Gate 41 - Start of the HD year (Aquarius)
  { gateLine: "41.1", expectedDate: "Jan 22", notes: "Start of HD year" },
  { gateLine: "41.6", expectedDate: "Jan 27", notes: "End of Gate 41" },

  // Gate 1 - The Creative (Scorpio)
  { gateLine: "1.1", expectedDate: "Nov 2", notes: "Gate 1 start" },

  // Equinox gates
  { gateLine: "25.1", expectedDate: "Mar 17", notes: "Near spring equinox" },
  { gateLine: "17.1", expectedDate: "Mar 23", notes: "Just after spring equinox" },

  // Solstice gates
  { gateLine: "10.1", expectedDate: "Dec 18", notes: "Near winter solstice" },
  { gateLine: "15.1", expectedDate: "Jun 16", notes: "Near summer solstice" },

  // Some mid-year gates for verification
  { gateLine: "52.1", expectedDate: "Jul 2", notes: "Cancer" },
  { gateLine: "64.1", expectedDate: "Sep 3", notes: "Virgo" },
  { gateLine: "5.1", expectedDate: "Nov 26", notes: "Sagittarius" }
];

/**
 * Parse date string to day of year
 */
function parseDateToDay(dateStr) {
  const [month, day] = dateStr.split(' ');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const monthIndex = months.indexOf(month);
  let dayOfYear = parseInt(day);
  for (let i = 0; i < monthIndex; i++) {
    dayOfYear += daysInMonth[i];
  }
  return dayOfYear;
}

/**
 * Compare two dates and return difference in days
 */
function dateDiff(date1, date2) {
  const day1 = parseDateToDay(date1);
  const day2 = parseDateToDay(date2);
  return Math.abs(day1 - day2);
}

/**
 * Run verification
 */
function verify() {
  console.log('Calendar Date Verification');
  console.log('==========================\n');

  let passed = 0;
  let failed = 0;

  KNOWN_DATES.forEach(check => {
    const line = lineCalendar.lines.find(l => l.gateLineKey === check.gateLine);

    if (!line) {
      console.log(`❌ ${check.gateLine}: NOT FOUND`);
      failed++;
      return;
    }

    const calculatedDate = line.calendar.formatted;
    const diff = dateDiff(calculatedDate, check.expectedDate);
    const tolerance = 2;  // ±2 days

    if (diff <= tolerance) {
      console.log(`✓ ${check.gateLine}: ${calculatedDate} (expected ${check.expectedDate}, diff: ${diff} days) - ${check.notes}`);
      passed++;
    } else {
      console.log(`❌ ${check.gateLine}: ${calculatedDate} (expected ${check.expectedDate}, diff: ${diff} days) - ${check.notes}`);
      failed++;
    }
  });

  console.log('\n==========================');
  console.log(`Passed: ${passed}/${KNOWN_DATES.length}`);
  console.log(`Failed: ${failed}/${KNOWN_DATES.length}`);

  if (failed > 0) {
    console.log('\nNote: Some variance is expected due to:');
    console.log('- Earth\'s elliptical orbit (faster in January, slower in July)');
    console.log('- Different reference sources using slightly different ingress times');
    console.log('- Leap year variations');
  }

  // Additional analysis: show gate boundaries
  console.log('\n\nGate Boundary Analysis:');
  console.log('=======================');

  // Show first and last line of each gate for a few gates
  [41, 1, 25, 17, 10, 15].forEach(gate => {
    const gateLines = lineCalendar.lines.filter(l => l.gate === gate);
    if (gateLines.length > 0) {
      const first = gateLines[0];
      const last = gateLines[gateLines.length - 1];
      console.log(`Gate ${gate}: ${first.calendar.formatted} to ${last.calendar.formatted} (${first.zodiac.formatted})`);
    }
  });

  return failed === 0;
}

verify();
