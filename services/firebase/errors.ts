/**
 * Domain errors.
 *
 * Repositories translate Firebase's error codes into these, so the UI can
 * branch on meaning ("that slot has gone") rather than on `permission-denied`
 * strings that would change if the backend ever did.
 */

export type BookingErrorCode =
  | 'slot-taken'
  | 'slot-unavailable'
  | 'invalid-request'
  | 'permission-denied'
  | 'unavailable'
  | 'unknown'

export class BookingError extends Error {
  readonly code: BookingErrorCode

  constructor(code: BookingErrorCode, message?: string) {
    super(message ?? code)
    this.name = 'BookingError'
    this.code = code
  }
}

/** The specific failure the double-booking guard raises. */
export class SlotTakenError extends BookingError {
  constructor() {
    super('slot-taken', 'That time has just been taken by someone else.')
    this.name = 'SlotTakenError'
  }
}

export class NotConfiguredError extends Error {
  constructor(what: string) {
    super(`${what} requires Firebase to be configured. See .env.example.`)
    this.name = 'NotConfiguredError'
  }
}

interface FirebaseLikeError {
  code?: string
  message?: string
}

/** Maps a thrown Firebase error onto the domain vocabulary. */
export function toBookingError(error: unknown): BookingError {
  if (error instanceof BookingError) return error

  const code = (error as FirebaseLikeError)?.code ?? ''

  // A deterministic slot-lock id means a uniqueness violation surfaces as
  // `already-exists`; rules reject a duplicate as `permission-denied`.
  if (code === 'already-exists') return new SlotTakenError()
  if (code === 'permission-denied') {
    return new BookingError('permission-denied', 'This booking was rejected by the server.')
  }
  if (code === 'unavailable' || code === 'deadline-exceeded') {
    return new BookingError('unavailable', 'Could not reach the booking service.')
  }
  if (code === 'invalid-argument' || code === 'failed-precondition') {
    return new BookingError('invalid-request', 'This booking request was not valid.')
  }

  return new BookingError('unknown', (error as FirebaseLikeError)?.message)
}
