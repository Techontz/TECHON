'use client'

import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { getFirebaseAuth, isLive } from '@/services/firebase/client'
import { getAdminProfile, type AdminProfile } from '@/repositories/admins'

/**
 * Admin authentication.
 *
 * Two facts are tracked separately: whether someone is signed in, and whether
 * that person is an admin. Collapsing them would let any Firebase user — the
 * project is public, anyone can register against it — reach the admin shell
 * before a Firestore read denied them, which reads as a broken page rather
 * than a locked door.
 *
 * `status` is the single value the guard branches on.
 */

export type AuthStatus = 'loading' | 'signedOut' | 'notAdmin' | 'admin' | 'unavailable'

interface AuthContextValue {
  status: AuthStatus
  user: User | null
  profile: AdminProfile | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(isLive() ? 'loading' : 'unavailable')
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AdminProfile | null>(null)

  useEffect(() => {
    if (!isLive()) return

    const auth = getFirebaseAuth()

    // Survives a refresh, so an admin is not signed out on every reload.
    void setPersistence(auth, browserLocalPersistence)

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)

      if (!nextUser) {
        setProfile(null)
        setStatus('signedOut')
        return
      }

      const adminProfile = await getAdminProfile(nextUser.uid)
      setProfile(adminProfile)
      setStatus(adminProfile ? 'admin' : 'notAdmin')
    })

    return unsubscribe
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      profile,
      async signIn(email, password) {
        await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
        // Status is not set here — `onAuthStateChanged` owns it, so there is
        // one path to `admin` rather than two that can disagree.
      },
      async signOut() {
        await firebaseSignOut(getFirebaseAuth())
      },
      async resetPassword(email) {
        await sendPasswordResetEmail(getFirebaseAuth(), email)
      },
    }),
    [status, user, profile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
