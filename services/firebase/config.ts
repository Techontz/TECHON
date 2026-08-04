/**
 * Firebase configuration, read from the environment.
 *
 * Every value here is a public client identifier — Firebase expects them in
 * the browser bundle, and access is controlled by Security Rules, not by
 * hiding these strings. Genuine secrets (service-account keys, API tokens for
 * payment or messaging providers) must never appear in a `NEXT_PUBLIC_`
 * variable; those belong on a server and are added when that server exists.
 *
 * The site is designed to run with or without this configuration: when it is
 * absent, repositories fall back to the seed content in `data/seed`, so the
 * public pages still render. `isFirebaseConfigured` is the single flag that
 * decides which path is taken.
 */

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

/** The subset without which the SDK cannot initialise at all. */
const REQUIRED = ['apiKey', 'authDomain', 'projectId', 'appId'] as const

export const isFirebaseConfigured = REQUIRED.every((key) => Boolean(config[key]))

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

/**
 * Throws rather than returning a half-populated object — a partially
 * configured SDK fails later with an opaque error, which is far harder to
 * diagnose than a missing variable named at startup.
 */
export function getFirebaseConfig(): FirebaseConfig {
  const missing = REQUIRED.filter((key) => !config[key])

  if (missing.length > 0) {
    throw new Error(
      `Firebase is not configured. Missing: ${missing
        .map((key) => `NEXT_PUBLIC_FIREBASE_${camelToScreamingSnake(key)}`)
        .join(', ')}. See .env.example.`,
    )
  }

  return {
    apiKey: config.apiKey!,
    authDomain: config.authDomain!,
    projectId: config.projectId!,
    storageBucket: config.storageBucket ?? '',
    messagingSenderId: config.messagingSenderId ?? '',
    appId: config.appId!,
  }
}

function camelToScreamingSnake(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase()
}

/** Emulator wiring, for local development against `firebase emulators:start`. */
export const useEmulators = process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATORS === 'true'
