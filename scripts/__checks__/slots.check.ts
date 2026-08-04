/**
 * Slot engine checks.
 *
 *   npm run check:slots
 *
 * Deliberately dependency-free — no test runner to install or configure. The
 * engine is pure, so asserting against it needs nothing but Node.
 *
 * The rule these exist to protect: a day is unavailable only when every slot
 * on it is unavailable. That was regressed once by fixture data closing whole
 * days outright, and these checks are what stop it happening again.
 */
import {
  addDays,
  computeDayAvailability,
  freeTimes,
  occupiedSlots,
  startOfToday,
  toDateKey,
} from '../../lib/slots'
import { emptyOverride } from '../../models/availability'

const today = startOfToday()
const d = (offset: number): string => toDateKey(addDays(today, offset))

let passed = 0
let failed = 0

function ok(label: string, condition: boolean, detail = ''): void {
  if (condition) passed += 1
  else failed += 1
  console.log(
    `  ${condition ? 'PASS' : 'FAIL'}  ${label}${!condition && detail ? `  → ${detail}` : ''}`,
  )
}

/** First upcoming date with the given weekday, within the booking window. */
function nextWeekday(weekday: number): number {
  for (let offset = 1; offset <= 14; offset += 1) {
    if (addDays(today, offset).getDay() === weekday) return offset
  }
  throw new Error(`no upcoming weekday ${weekday}`)
}

const monday = nextWeekday(1)
const saturday = nextWeekday(6)
const sunday = nextWeekday(0)

const WEEKDAY_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]

console.log('\n— Working hours —')
const mon = computeDayAvailability({ date: d(monday) })
ok('Mon–Fri has 10 slots', mon.totalCount === 10, `got ${mon.totalCount}`)
ok('runs 08:00 to 17:00', mon.slots[0]?.time === '08:00' && mon.slots.at(-1)?.time === '17:00')
ok('lunch divider after 12:00', mon.slots.find((s) => s.time === '12:00')?.breakAfter === true)

const sat = computeDayAvailability({ date: d(saturday) })
ok(
  'Saturday is 09:00–12:00',
  sat.totalCount === 4 && sat.slots[0]?.time === '09:00' && sat.slots.at(-1)?.time === '12:00',
  `got ${sat.totalCount}`,
)
ok('Sunday is closed', computeDayAvailability({ date: d(sunday) }).status === 'closed')

console.log('\n— A day with SOME slots booked stays open —')
const partial = computeDayAvailability({ date: d(monday), takenSlots: ['10:00', '12:00'] })
ok('status is available, not fullyBooked', partial.status === 'available', partial.status)
ok('8 of 10 remain', partial.availableCount === 8, `got ${partial.availableCount}`)
ok(
  '10:00 is shown as booked, not removed',
  partial.slots.find((s) => s.time === '10:00')?.reason === 'booked',
)
ok('11:00 is still selectable', partial.slots.find((s) => s.time === '11:00')?.available === true)
ok(
  'free times exclude the booked ones',
  freeTimes(partial).join(',') === '08:00,09:00,11:00,13:00,14:00,15:00,16:00,17:00',
  freeTimes(partial).join(','),
)

console.log('\n— Fully booked only when every slot has gone —')
ok(
  '9 of 10 taken → still available',
  computeDayAvailability({ date: d(monday), takenSlots: WEEKDAY_SLOTS.slice(0, 9) }).status ===
    'available',
)
ok(
  '10 of 10 taken → fullyBooked',
  computeDayAvailability({ date: d(monday), takenSlots: WEEKDAY_SLOTS }).status === 'fullyBooked',
)

console.log('\n— Calendar load dots —')
ok(
  'green while half or more remain',
  computeDayAvailability({ date: d(monday), takenSlots: WEEKDAY_SLOTS.slice(0, 3) }).load === 'open',
)
ok(
  'orange when few remain',
  computeDayAvailability({ date: d(monday), takenSlots: WEEKDAY_SLOTS.slice(0, 7) }).load ===
    'filling',
)
ok(
  'red when none remain',
  computeDayAvailability({ date: d(monday), takenSlots: WEEKDAY_SLOTS }).load === 'full',
)

console.log('\n— Variable durations —')
ok('60m occupies one slot', occupiedSlots('10:00', 60, 60).join(',') === '10:00')
ok('120m occupies two slots', occupiedSlots('10:00', 120, 60).join(',') === '10:00,11:00')
ok('15m occupies one slot', occupiedSlots('10:00', 15, 60).length === 1)
ok('90m occupies two slots', occupiedSlots('10:00', 90, 60).join(',') === '10:00,11:00')

const long = computeDayAvailability({
  date: d(monday),
  takenSlots: ['11:00'],
  durationMinutes: 120,
})
ok(
  '120m at 10:00 blocked because 11:00 is taken',
  long.slots.find((s) => s.time === '10:00')?.reason === 'booked',
)
ok(
  '120m at 17:00 rejected — runs past close',
  long.slots.find((s) => s.time === '17:00')?.reason === 'tooLate',
)
ok('120m at 09:00 still bookable', long.slots.find((s) => s.time === '09:00')?.available === true)

console.log('\n— Admin overrides —')
const blocked = computeDayAvailability({
  date: d(monday),
  override: { ...emptyOverride(d(monday)), blockedSlots: ['09:00'] },
})
ok(
  'blocked slot reports "blocked"',
  blocked.slots.find((s) => s.time === '09:00')?.reason === 'blocked',
)
ok(
  'blocking one slot does not close the day',
  blocked.status === 'available' && blocked.availableCount === 9,
)
ok(
  'closed override closes the day',
  computeDayAvailability({
    date: d(monday),
    override: { ...emptyOverride(d(monday)), closed: true },
  }).status === 'closed',
)

const forced = computeDayAvailability({
  date: d(sunday),
  override: { ...emptyOverride(d(sunday)), forceOpen: true },
})
ok(
  'forceOpen opens a Sunday',
  forced.status === 'available' && forced.totalCount === 10,
  `${forced.status}/${forced.totalCount}`,
)

ok(
  'reduced hours honoured',
  computeDayAvailability({
    date: d(monday),
    override: { ...emptyOverride(d(monday)), customHours: ['08:00', '09:00'] },
  }).totalCount === 2,
)

console.log('\n— Booking window —')
ok('today is not bookable', computeDayAvailability({ date: d(0) }).status === 'past')
ok(
  'beyond 60 days is out of window',
  computeDayAvailability({ date: d(61) }).status === 'outOfWindow',
)

console.log(`\n${passed} passed, ${failed} failed\n`)
process.exit(failed > 0 ? 1 : 0)
