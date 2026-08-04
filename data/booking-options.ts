import { Building2, Video, type LucideIcon } from 'lucide-react'

/**
 * Every option list the booking form offers.
 *
 * Ids are stable and translation-independent — they are what a backend would
 * receive. Labels live in the `booking` message namespace.
 */

/* ------------------------------------------------------------- Meeting mode */

export type MeetingMode = 'office' | 'online'

export interface MeetingOption {
  id: MeetingMode
  icon: LucideIcon
}

export const meetingOptions: MeetingOption[] = [
  { id: 'office', icon: Building2 },
  { id: 'online', icon: Video },
]

/**
 * Where an office visit happens. Coordinates are included so the placeholder
 * can be swapped for an embedded map without another content change.
 */
export const officeLocation = {
  name: 'TechOn Headquarters',
  building: 'NIC Building',
  area: 'Posta',
  city: 'Dar es Salaam',
  country: 'Tanzania',
  /** NIC Life House, Posta, Dar es Salaam. */
  coordinates: { lat: -6.8161, lng: 39.2894 },
} as const

export const officeAddressLines = [
  officeLocation.name,
  officeLocation.building,
  officeLocation.area,
  officeLocation.city,
  officeLocation.country,
] as const

/** The conferencing provider. Swap when Zoom or Teams is wired in. */
export const onlineProvider = 'Google Meet' as const

/* ---------------------------------------------------------------- Categories */

export type CategoryId =
  | 'aiSolutions'
  | 'novaAi'
  | 'customSoftware'
  | 'website'
  | 'mobileApp'
  | 'businessSystems'
  | 'erp'
  | 'cloud'
  | 'automation'
  | 'cyberSecurity'
  | 'other'

export const categoryIds: CategoryId[] = [
  'aiSolutions',
  'novaAi',
  'customSoftware',
  'website',
  'mobileApp',
  'businessSystems',
  'erp',
  'cloud',
  'automation',
  'cyberSecurity',
  'other',
]

/* ------------------------------------------------------------------- Budget */

export type BudgetId = 'under2m' | 'from2to5m' | 'from5to10m' | 'from10to20m' | 'above20m' | 'unsure'

export const budgetIds: BudgetId[] = [
  'under2m',
  'from2to5m',
  'from5to10m',
  'from10to20m',
  'above20m',
  'unsure',
]

/* ----------------------------------------------------------------- Countries */

/**
 * Dial codes are carried alongside so the phone field can prefill later
 * without a second lookup table.
 */
export interface Country {
  code: string
  name: string
  dial: string
}

export const countries: Country[] = [
  { code: 'TZ', name: 'Tanzania', dial: '+255' },
  { code: 'KE', name: 'Kenya', dial: '+254' },
  { code: 'UG', name: 'Uganda', dial: '+256' },
  { code: 'RW', name: 'Rwanda', dial: '+250' },
  { code: 'BI', name: 'Burundi', dial: '+257' },
  { code: 'ZM', name: 'Zambia', dial: '+260' },
  { code: 'MW', name: 'Malawi', dial: '+265' },
  { code: 'MZ', name: 'Mozambique', dial: '+258' },
  { code: 'ZA', name: 'South Africa', dial: '+27' },
  { code: 'NG', name: 'Nigeria', dial: '+234' },
  { code: 'GH', name: 'Ghana', dial: '+233' },
  { code: 'EG', name: 'Egypt', dial: '+20' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971' },
  { code: 'IN', name: 'India', dial: '+91' },
  { code: 'GB', name: 'United Kingdom', dial: '+44' },
  { code: 'DE', name: 'Germany', dial: '+49' },
  { code: 'FR', name: 'France', dial: '+33' },
  { code: 'NL', name: 'Netherlands', dial: '+31' },
  { code: 'CA', name: 'Canada', dial: '+1' },
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'OTHER', name: 'Other', dial: '' },
]
