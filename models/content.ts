/**
 * Editable content.
 *
 * Each of these is a singleton document under `content/`. They hold only the
 * values an admin should be able to change without a deploy — structural copy
 * that must stay translated lives in `messages/`, because a CMS field cannot
 * be four languages at once.
 *
 * Anything optional is genuinely optional: a missing field falls back to the
 * seed content, so an empty Firestore renders exactly what ships today.
 */

export interface HeroContent {
  /** Overrides the translated headline when set. Leave blank to keep the copy. */
  titleOverride: string
  leadOverride: string
  /** Announcement pill next to the NOVA badge. */
  badgeText: string
  /** Storage path of the hero product shot; empty renders the drawn mockup. */
  imagePath: string
  stats: Array<{ id: string; value: number; suffix: string }>
}

export interface ServiceItem {
  id: string
  icon: string
  order: number
  active: boolean
}

export interface ServicesContent {
  items: ServiceItem[]
}

export interface NovaFeature {
  id: string
  label: string
  group: string
  order: number
  active: boolean
}

export interface NovaContent {
  titleOverride: string
  leadOverride: string
  /** Figures in the product panel. */
  metrics: Array<{ key: string; value: string }>
  features: NovaFeature[]
  /** Storage paths. Empty falls back to the animated handset. */
  demoVideoPath: string
  imagePath: string
  /** Lets an admin calm the handset animation without a deploy. */
  animationsEnabled: boolean
  pricingNote: string
}

export interface OfficeLocation {
  name: string
  building: string
  area: string
  city: string
  country: string
  lat: number
  lng: number
}

export interface ContactContent {
  email: string
  phones: Array<{ display: string; e164: string; regionKey: string }>
  whatsapp: string
  office: OfficeLocation
  /** Conferencing providers offered. First is the default. */
  onlineProviders: string[]
  socials: Array<{ label: string; href: string }>
}

export interface SiteSettings {
  /** Takes the public site offline behind a notice. */
  maintenanceMode: boolean
  /** Stops new bookings without hiding the page. */
  bookingsOpen: boolean
  metaTitleSuffix: string
  /** Reply-time promise shown under the contact channels. */
  responseTime: string
}

/** Testimonials are a collection, not a singleton — admins add and remove them. */
export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  company: string
  initials: string
  order: number
  published: boolean
}

export interface NewsletterSubscriber {
  id: string
  email: string
  locale: string
  /** `website` today; `import` or a campaign name later. */
  source: string
  subscribedAt: Date
  unsubscribedAt?: Date
  active: boolean
}
