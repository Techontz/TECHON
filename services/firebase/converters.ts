import {
  Timestamp,
  serverTimestamp,
  type DocumentData,
  type FieldValue,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'

/**
 * Conversion between Firestore documents and domain models.
 *
 * The rule this enforces: models expose `Date`, Firestore stores `Timestamp`,
 * and nothing outside `repositories/` ever sees a `Timestamp`. Components that
 * receive raw Firestore values end up calling `.toDate()` in JSX, which breaks
 * the moment a document is written by a script instead of the SDK.
 */

/** Tolerates `Timestamp`, ISO strings and epoch millis — all appear in practice. */
export function toDate(value: unknown, fallback: Date = new Date(0)): Date {
  if (value instanceof Timestamp) return value.toDate()
  if (value instanceof Date) return value
  if (typeof value === 'number') return new Date(value)
  if (typeof value === 'string') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return fallback
}

export function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

export function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function bool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback
}

export function strArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

/** Narrows an unknown to one of a fixed set, falling back when it is not. */
export function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback
}

export interface Timestamps {
  createdAt: FieldValue
  updatedAt: FieldValue
}

/** Server time on create — a client clock cannot be trusted for ordering. */
export function createTimestamps(): Timestamps {
  return { createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
}

export function updateTimestamp(): { updatedAt: FieldValue } {
  return { updatedAt: serverTimestamp() }
}

/** Document data plus its id, the shape every mapper below starts from. */
export function withId(snapshot: QueryDocumentSnapshot<DocumentData>): DocumentData & { id: string } {
  return { id: snapshot.id, ...snapshot.data() }
}

/**
 * Drops `undefined` values.
 *
 * Firestore rejects `undefined` outright, and optional model fields produce it
 * constantly — stripping once here avoids a guard at every write site.
 */
export function clean<T extends Record<string, unknown>>(data: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined))
}
