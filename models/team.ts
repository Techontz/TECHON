/**
 * Team members.
 *
 * `roleKey` resolves to a translated job title, while `name` is a proper noun
 * that stays as written. That split is what lets the section be multilingual
 * without an admin having to enter four versions of "Backend Engineer".
 *
 * A member with `placeholder: true` renders the monogram tile and is flagged
 * in the admin list as awaiting a real photograph and biography.
 */

export type TeamRoleKey =
  | 'founder'
  | 'aiEngineer'
  | 'backendEngineer'
  | 'frontendEngineer'
  | 'mobileDeveloper'
  | 'designer'
  | 'projectManager'

export interface TeamMember {
  id: string
  name: string
  roleKey: TeamRoleKey
  /** Overrides the translated role when an admin needs a bespoke title. */
  roleOverride: string
  /** One or two sentences. Optional — the card reads fine without it. */
  bio: string
  /** Storage download URL. Empty renders the monogram. */
  photoUrl: string
  /** Storage path, kept so the object can be deleted with the member. */
  photoPath: string
  linkedinUrl: string
  /** Ascending. The founder leads. */
  order: number
  published: boolean
  /** Awaiting a real portrait and biography. */
  placeholder: boolean
}

export type TeamMemberInput = Omit<TeamMember, 'id'>

export function emptyTeamMember(): TeamMemberInput {
  return {
    name: '',
    roleKey: 'backendEngineer',
    roleOverride: '',
    bio: '',
    photoUrl: '',
    photoPath: '',
    linkedinUrl: '',
    order: 99,
    published: true,
    placeholder: true,
  }
}

/** First letters of the first two words — "Conrad Bubex" → "CB". */
export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
