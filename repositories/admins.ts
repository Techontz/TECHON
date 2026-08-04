import { doc, getDoc } from 'firebase/firestore'

import { getDb, isLive } from '@/services/firebase/client'
import { COLLECTIONS } from '@/models/collections'
import { str, toDate } from '@/services/firebase/converters'

/**
 * The admin allow-list.
 *
 * Membership is a document at `admins/{uid}` rather than a field on the user,
 * because Security Rules can `exists()` a path but cannot read a user record.
 * The same check therefore guards the UI and the database, and the database
 * one is the one that counts — the client check is only there to avoid showing
 * a screen that would fail.
 *
 * Adding the first admin is a manual step: create the Auth user, then create
 * `admins/{uid}` in the console. There is deliberately no self-service path.
 */

export interface AdminProfile {
  uid: string
  email: string
  name: string
  role: 'owner' | 'editor'
  createdAt: Date
}

export async function getAdminProfile(uid: string): Promise<AdminProfile | null> {
  if (!isLive()) return null

  try {
    const snapshot = await getDoc(doc(getDb(), COLLECTIONS.admins, uid))
    if (!snapshot.exists()) return null

    const data = snapshot.data()
    return {
      uid,
      email: str(data.email),
      name: str(data.name),
      role: data.role === 'owner' ? 'owner' : 'editor',
      createdAt: toDate(data.createdAt),
    }
  } catch {
    // A denied read means "not an admin" just as surely as a missing document.
    return null
  }
}
