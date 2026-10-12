import type {
  ContactContent,
  HeroContent,
  NovaContent,
  ServicesContent,
  SiteSettings,
  Testimonial,
} from '@/models/content'

/**
 * Seed content for the singleton documents under `content/`.
 *
 * Overrides are intentionally blank: an empty string means "use the
 * translated copy in `messages/`", so seeding does not freeze four languages
 * into one English field. An admin filling one in is an explicit override.
 */

export const SEED_HERO: HeroContent = {
  titleOverride: '',
  leadOverride: '',
  badgeText: '',
  imagePath: '',
  stats: [
    { id: 'projects', value: 50, suffix: '+' },
    { id: 'clients', value: 20, suffix: '+' },
    { id: 'satisfaction', value: 99, suffix: '%' },
    { id: 'support', value: 24, suffix: '/7' },
  ],
}

export const SEED_SERVICES: ServicesContent = {
  items: [
    { id: 'aiSolutions', icon: 'sparkles', order: 1, active: true },
    { id: 'aiAgents', icon: 'bot', order: 2, active: true },
    { id: 'customSoftware', icon: 'blocks', order: 3, active: true },
    { id: 'mobileApps', icon: 'smartphone', order: 4, active: true },
    { id: 'enterpriseSystems', icon: 'boxes', order: 5, active: true },
    { id: 'cloudSolutions', icon: 'cloud', order: 6, active: true },
    { id: 'automation', icon: 'workflow', order: 7, active: true },
    { id: 'webDevelopment', icon: 'globe', order: 8, active: true },
    { id: 'uiuxDesign', icon: 'pen-tool', order: 9, active: true },
    { id: 'paymentIntegrations', icon: 'credit-card', order: 10, active: true },
    { id: 'apiDevelopment', icon: 'braces', order: 11, active: true },
    { id: 'digitalTransformation', icon: 'zap', order: 12, active: true },
  ],
}

const NOVA_FEATURES: Array<[string, string]> = [
  ['aiVoiceCalling', 'voice'],
  ['receivesCalls', 'voice'],
  ['makesCalls', 'voice'],
  ['naturalConversations', 'voice'],
  ['humanHandoff', 'voice'],
  ['customerSupport', 'channels'],
  ['whatsapp', 'channels'],
  ['instagram', 'channels'],
  ['facebook', 'channels'],
  ['email', 'channels'],
  ['knowledgeBase', 'intelligence'],
  ['documentSearch', 'intelligence'],
  ['multilingual', 'intelligence'],
  ['analytics', 'intelligence'],
  ['customEmployees', 'intelligence'],
  ['appointmentBooking', 'operations'],
  ['leadQualification', 'operations'],
  ['crmIntegration', 'operations'],
  ['calendarIntegration', 'operations'],
  ['workflowAutomation', 'operations'],
  ['apiIntegration', 'operations'],
  ['availability', 'operations'],
]

export const SEED_NOVA: NovaContent = {
  titleOverride: '',
  leadOverride: '',
  metrics: [
    { key: 'metric1', value: '94%' },
    { key: 'metric2', value: '1.2s' },
    { key: 'metric3', value: '32' },
  ],
  // `label` stays empty so the translated capability name is used; an admin
  // filling it in overrides that one entry in every language.
  features: NOVA_FEATURES.map(([id, group], index) => ({
    id,
    label: '',
    group,
    order: index + 1,
    active: true,
  })),
  demoVideoPath: '',
  imagePath: '',
  animationsEnabled: true,
  pricingNote: '',
}

export const SEED_CONTACT: ContactContent = {
  email: 'contact@techontz.com',
  phones: [
    { display: '+255 769 190 100', e164: '+255769190100', regionKey: 'tanzania' },
    { display: '+1 281 743 5166', e164: '+12817435166', regionKey: 'unitedStates' },
  ],
  whatsapp: '255769190100',
  office: {
    name: 'TechOn Headquarters',
    building: 'NIC Building',
    area: 'Posta',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    lat: -6.8161,
    lng: 39.2894,
  },
  onlineProviders: ['Google Meet', 'Zoom', 'Microsoft Teams'],
  socials: [
    { label: 'GitHub', href: 'https://github.com/techontz' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/tech_ontz' },
    { label: 'X', href: 'https://x.com/techontz' },
    { label: 'Instagram', href: 'https://www.instagram.com/tech_ontz/' },
    { label: 'TikTok', href: 'https://tiktok.com/tech_ontz' },
  ],
}

export const SEED_SETTINGS: SiteSettings = {
  maintenanceMode: false,
  bookingsOpen: true,
  metaTitleSuffix: 'TechOn',
  responseTime: '',
}

/** Placeholder quotes — replace with real ones from the admin panel. */
export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: 'amina',
    quote:
      'They replaced a system three other vendors had failed to finish. Eleven weeks later it was live and our support load had halved.',
    name: 'Amina Rashid',
    role: 'Chief Operating Officer',
    company: 'Zanzi Logistics',
    initials: 'AR',
    order: 1,
    published: true,
  },
  {
    id: 'daniel',
    quote:
      'NOVA handles the first response on every enquiry we get. Our team stopped drowning in email and started closing deals again.',
    name: 'Daniel Mwakalinga',
    role: 'Founder',
    company: 'Serengeti Retail Group',
    initials: 'DM',
    order: 2,
    published: true,
  },
  {
    id: 'claire',
    quote:
      'The design work alone changed how our investors saw the company. We raised our next round on the back of that demo.',
    name: 'Claire Dubois',
    role: 'Head of Product',
    company: 'Meridian Health',
    initials: 'CD',
    order: 3,
    published: true,
  },
  {
    id: 'thomas',
    quote:
      'Honest estimates, no theatre, and they told us when a feature was not worth building. That is rarer than good code.',
    name: 'Thomas Weber',
    role: 'Chief Technology Officer',
    company: 'Halden Systems',
    initials: 'TW',
    order: 4,
    published: true,
  },
  {
    id: 'grace',
    quote:
      'Two years on, the platform still runs exactly as delivered. The documentation was good enough that our own team took it over.',
    name: 'Grace Otieno',
    role: 'Managing Director',
    company: 'Tembo Financial',
    initials: 'GO',
    order: 5,
    published: true,
  },
]
