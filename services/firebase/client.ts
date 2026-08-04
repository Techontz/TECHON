import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore'
import { connectStorageEmulator, getStorage, type FirebaseStorage } from 'firebase/storage'

import { getFirebaseConfig, isFirebaseConfigured, useEmulators } from './config'

/**
 * Lazily-initialised Firebase singletons.
 *
 * Nothing is created at module load. Importing a repository must not spin up
 * the SDK — otherwise every page that merely *references* booking types pays
 * for Firebase at import time, and a build without credentials would fail
 * during prerendering rather than degrading to seed data.
 */

/** `connect*Emulator` throws if called twice, so each service is tracked separately. */
const connected = { auth: false, db: false, storage: false }

function getFirebaseApp(): FirebaseApp {
  // Next's dev server re-evaluates modules on refresh; reusing the existing
  // app avoids "Firebase App named '[DEFAULT]' already exists".
  return getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig())
}

function shouldConnectEmulator(service: keyof typeof connected): boolean {
  if (!useEmulators || connected[service]) return false
  if (typeof window === 'undefined') return false

  connected[service] = true
  return true
}

export function getFirebaseAuth(): Auth {
  const auth = getAuth(getFirebaseApp())
  if (shouldConnectEmulator('auth')) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  }
  return auth
}

export function getDb(): Firestore {
  const db = getFirestore(getFirebaseApp())
  if (shouldConnectEmulator('db')) connectFirestoreEmulator(db, '127.0.0.1', 8080)
  return db
}

export function getBucket(): FirebaseStorage {
  const storage = getStorage(getFirebaseApp())
  if (shouldConnectEmulator('storage')) connectStorageEmulator(storage, '127.0.0.1', 9199)
  return storage
}

/**
 * Whether live data is available.
 *
 * Callers use this to decide between Firestore and seed content; it is the
 * only branch on configuration that should exist outside this module.
 */
export function isLive(): boolean {
  return isFirebaseConfigured
}
