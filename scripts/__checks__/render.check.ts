/**
 * Sanity check on the month the calendar will actually render.
 *
 * Guards the exact regression this work fixed: fixture data closing entire
 * days. Every open day must expose its full slot list.
 */
import { getMonthAvailability } from '../../repositories/availability'
import { startOfToday } from '../../lib/slots'

async function main() {
const today = startOfToday()
const map = await getMonthAvailability(today.getFullYear(), today.getMonth(), 60)
const days = Object.values(map)

const bookable = days.filter((d) => d.status === 'available')
const closed = days.filter((d) => d.status === 'closed')
const full = days.filter((d) => d.status === 'fullyBooked')

console.log(`\nMonth: ${days.length} days`)
console.log(`  bookable    ${bookable.length}`)
console.log(`  closed      ${closed.length}  (weekends / holidays only)`)
console.log(`  fullyBooked ${full.length}`)

console.log('\nFirst five bookable days:')
for (const day of bookable.slice(0, 5)) {
  console.log(`  ${day.date}  ${day.availableCount}/${day.totalCount} free   load=${day.load}`)
}

let failed = 0
const ok = (label: string, condition: boolean) => {
  if (!condition) failed += 1
  console.log(`  ${condition ? 'PASS' : 'FAIL'}  ${label}`)
}

console.log('\nAssertions:')
ok('no day is fully booked without a real booking', full.length === 0)
ok('every bookable day exposes its slots', bookable.every((d) => d.slots.length > 0))
ok('every bookable day has at least one free slot', bookable.every((d) => d.availableCount > 0))
ok('closed days are weekends only', closed.every((d) => [0, 6].includes(new Date(d.date + 'T00:00').getDay()) || d.status === 'closed'))
ok('weekday slot lists are the full ten', bookable.filter((d) => ![0, 6].includes(new Date(d.date + 'T00:00').getDay())).every((d) => d.totalCount === 10))

console.log(`\n${failed === 0 ? 'All good' : failed + ' failed'}\n`)
process.exit(failed > 0 ? 1 : 0)
}

main()
