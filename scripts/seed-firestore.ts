/**
 * Seeds Firestore with the site's initial content.
 *
 *   npm run seed          # write anything missing, leave existing docs alone
 *   npm run seed -- --force   # overwrite existing documents too
 *
 * Runs against the Admin SDK with a service-account key, so it bypasses
 * Security Rules — which is why it is a script you run deliberately rather
 * than anything the app can trigger.
 *
 * Idempotent by default: re-running will not clobber content an admin has
 * since edited. That matters, because the most likely second run is after
 * adding a new collection, not to reset the site.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

import { SEED_CONSULTATIONS } from '../data/seed/consultations'
import {
  SEED_CONTACT,
  SEED_HERO,
  SEED_NOVA,
  SEED_SERVICES,
  SEED_SETTINGS,
  SEED_TESTIMONIALS,
} from '../data/seed/content'
import { buildSeedPortfolio } from '../data/seed/portfolio'
import { SEED_TEAM } from '../data/seed/team'
import { DEFAULT_AVAILABILITY } from '../models/availability'
import { COLLECTIONS, CONTENT_DOCS } from '../models/collections'

const force = process.argv.includes('--force')

function connect(): Firestore {
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? './service-account.json'

  let credentials: Record<string, string>
  try {
    credentials = JSON.parse(readFileSync(resolve(process.cwd(), keyPath), 'utf8'))
  } catch {
    console.error(
      `\nCould not read a service-account key at ${keyPath}.\n` +
        'Firebase console → Project settings → Service accounts → Generate new private key,\n' +
        'then set FIREBASE_SERVICE_ACCOUNT_PATH in .env.local.\n',
    )
    process.exit(1)
  }

  if (getApps().length === 0) {
    initializeApp({ credential: cert(credentials as never) })
  }

  return getFirestore()
}

const db = connect()
let written = 0
let skipped = 0

/**
 * Writes only if absent, unless `--force`.
 *
 * `object` rather than `Record<string, unknown>`: an interface without an index
 * signature is not assignable to the latter, and widening every seed model
 * with one purely to satisfy this script would be the tail wagging the dog.
 */
async function put(collection: string, id: string, data: object) {
  const reference = db.collection(collection).doc(id)

  if (!force) {
    const existing = await reference.get()
    if (existing.exists) {
      skipped += 1
      return
    }
  }

  const now = new Date()
  await reference.set({ ...data, createdAt: now, updatedAt: now }, { merge: true })
  written += 1
}

async function main() {
  console.log(force ? 'Seeding (force: overwriting existing)…\n' : 'Seeding (skipping existing)…\n')

  // Consultations — the booking page reads pricing from here.
  for (const consultation of SEED_CONSULTATIONS) {
    const { id, ...rest } = consultation
    await put(COLLECTIONS.consultations, id, rest)
  }
  console.log(`  consultations   ${SEED_CONSULTATIONS.length}`)

  // Editable page content.
  await put(COLLECTIONS.content, CONTENT_DOCS.hero, SEED_HERO)
  await put(COLLECTIONS.content, CONTENT_DOCS.services, SEED_SERVICES)
  await put(COLLECTIONS.content, CONTENT_DOCS.nova, SEED_NOVA)
  await put(COLLECTIONS.content, CONTENT_DOCS.contact, SEED_CONTACT)
  await put(COLLECTIONS.content, CONTENT_DOCS.settings, SEED_SETTINGS)
  // The standing booking schedule lives beside the other singletons.
  await put(COLLECTIONS.content, 'availability', DEFAULT_AVAILABILITY)
  console.log('  content         6')

  for (const testimonial of SEED_TESTIMONIALS) {
    const { id, ...rest } = testimonial
    await put(COLLECTIONS.testimonials, id, rest)
  }
  console.log(`  testimonials    ${SEED_TESTIMONIALS.length}`)

  for (const member of SEED_TEAM) {
    const { id, ...rest } = member
    await put(COLLECTIONS.team, id, rest)
  }
  console.log(`  team            ${SEED_TEAM.length}`)

  const portfolio = buildSeedPortfolio()
  for (const project of portfolio) {
    const { id, ...rest } = project
    await put(COLLECTIONS.portfolio, id, rest)
  }
  console.log(`  portfolio       ${portfolio.length}`)

  console.log(`\nDone. ${written} written, ${skipped} already present.`)

  if (skipped > 0 && !force) {
    console.log('Re-run with `npm run seed -- --force` to overwrite.')
  }

  console.log(
    '\nNext: create your admin user.\n' +
      '  1. Firebase console → Authentication → Add user (email + password)\n' +
      '  2. Copy that user\'s UID\n' +
      `  3. Firestore → create ${COLLECTIONS.admins}/<UID> with:\n` +
      '     { email: "you@techontz.com", name: "Your Name", role: "owner" }\n' +
      '\nThere is no self-service path to admin — this step is deliberately manual.\n',
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
