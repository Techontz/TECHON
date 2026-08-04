/**
 * Leadership.
 *
 * Qualifications are structured rather than free text so the section can stay
 * typographic — two restrained lines — instead of turning into a CV.
 */

export interface Qualification {
  /** Message key under `about.leadership.qualifications`. */
  id: string
  institution: string
  location: string
}

export interface Leader {
  id: string
  name: string
  /** Portrait in `public/`. Falls back to a monogram tile until one is added. */
  image?: string
  qualifications: Qualification[]
  /** Destination for "Read full profile". Point at a biography page when it exists. */
  profileHref?: string
}

export const leaders: Leader[] = [
  {
    id: 'conrad',
    name: 'Conrad Bubex',
    // 1087×1447 portrait. next/image serves it as AVIF/WebP at the two sizes
    // actually rendered, so the 2.4MB source never reaches a visitor.
    image: '/ceo.PNG',
    qualifications: [
      {
        id: 'bachelor',
        institution: 'Dar es Salaam Institute of Technology',
        location: 'Dar es Salaam, Tanzania',
      },
      {
        id: 'masters',
        institution: 'University of the Witwatersrand',
        location: 'Johannesburg, South Africa',
      },
    ],
  },
]
