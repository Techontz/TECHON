/**
 * Shipped work. Every id must have a matching entry under `portfolio.items`
 * in all four message bundles. Pages are statically rendered for each locale,
 * so a missing translation fails the build rather than shipping a blank card.
 *
 * Covers in `public/work/` are real screenshots of each product — the live
 * website in a browser frame and/or store screenshots in phone frames — on a
 * tint of the client's brand colour, all 1600×1000 so the grid stays even.
 */
export type ProjectId =
  | 'tunes'
  | 'pilot'
  | 'pbzBank'
  | 'mkopa'
  | 'safiri'
  | 'novaAi'
  | 'chapChap'
  | 'najo'
  | 'konect'
  | 'agiza'
  | 'direct2kariakoo'
  | 'foodie'
  | 'hunPlus'

/** Tab order is deliberate and matches the order rendered in the UI. */
export const projectCategories = ['mobile', 'web', 'ai'] as const
export type ProjectCategory = (typeof projectCategories)[number]

export const portfolioFilters = ['all', ...projectCategories] as const
export type PortfolioFilter = (typeof portfolioFilters)[number]

/** Each id maps to `portfolio.sectors.<id>` in every message bundle. */
export type ProjectSector =
  | 'music'
  | 'trading'
  | 'banking'
  | 'fintech'
  | 'travel'
  | 'ai'
  | 'ecommerce'
  | 'automotive'
  | 'foodDelivery'
  | 'entertainment'

export type ProjectLinkKind = 'website' | 'android' | 'ios' | 'partnerAndroid'

export interface ProjectLink {
  kind: ProjectLinkKind
  href: string
}

export interface Project {
  id: ProjectId
  /** Proper noun, intentionally not translated. */
  title: string
  sector: ProjectSector
  /** Every tab the project appears under; the first is its primary one. */
  categories: ProjectCategory[]
  /** Surfaced on the homepage's curated grid. */
  featured?: boolean
  /** 16:10 cover in `public/`. Without one the card draws its wireframe. */
  image?: string
  /** Square app icon or logo in `public/`, shown beside the title. */
  icon?: string
  links: ProjectLink[]
  /** The mobile app is built but not yet in the stores. */
  appComingSoon?: boolean
}

export const projects: Project[] = [
  {
    id: 'tunes',
    title: '2KTunes',
    sector: 'music',
    categories: ['web', 'mobile'],
    featured: true,
    image: '/work/tunes.webp',
    icon: '/work/tunes-icon.webp',
    links: [{ kind: 'website', href: 'https://www.2ktunes.com/' }],
    appComingSoon: true,
  },
  {
    id: 'pilot',
    title: '2KPilot',
    sector: 'trading',
    categories: ['web', 'mobile', 'ai'],
    featured: true,
    image: '/work/pilot.webp',
    icon: '/work/pilot-icon.webp',
    links: [{ kind: 'website', href: 'https://www.2kpilot.online/' }],
    appComingSoon: true,
  },
  {
    id: 'pbzBank',
    title: 'PBZ Bank',
    sector: 'banking',
    categories: ['web', 'mobile'],
    featured: true,
    image: '/work/pbz.webp',
    icon: '/work/pbz-icon.webp',
    links: [
      { kind: 'website', href: 'https://pbzbank.co.tz/' },
      { kind: 'android', href: 'https://play.google.com/store/apps/details?id=com.pbzbank.pbz_version_1' },
      { kind: 'ios', href: 'https://apps.apple.com/tz/app/pbz/id6502783457' },
    ],
  },
  {
    id: 'mkopa',
    title: 'M-KOPA',
    sector: 'fintech',
    categories: ['web'],
    featured: true,
    image: '/work/mkopa.webp',
    icon: '/work/mkopa-icon.webp',
    links: [{ kind: 'website', href: 'https://www.m-kopa.com/' }],
  },
  {
    id: 'safiri',
    title: 'Safiri',
    sector: 'travel',
    categories: ['mobile', 'web'],
    featured: true,
    image: '/work/safiri.webp',
    icon: '/work/safiri-icon.webp',
    links: [
      { kind: 'website', href: 'https://safiri.app/' },
      { kind: 'android', href: 'https://play.google.com/store/apps/details?id=com.itule.safiri' },
      { kind: 'ios', href: 'https://apps.apple.com/gb/app/safiri/id1541262671' },
    ],
  },
  {
    id: 'novaAi',
    title: 'NOVA AI',
    sector: 'ai',
    categories: ['ai'],
    featured: true,
    image: '/work/nova.webp',
    icon: '/work/nova-icon.webp',
    links: [{ kind: 'website', href: '/#nova' }],
  },
  {
    id: 'chapChap',
    title: 'ChapChap',
    sector: 'ecommerce',
    categories: ['mobile', 'web'],
    featured: true,
    image: '/work/chap.webp',
    icon: '/work/chap-icon.webp',
    links: [
      { kind: 'website', href: 'https://chap.co.tz/' },
      { kind: 'android', href: 'https://play.google.com/store/apps/details?id=tz.co.codeblock.chapchap' },
      { kind: 'ios', href: 'https://apps.apple.com/tz/app/chapchap-app/id1578742848' },
    ],
  },
  {
    id: 'najo',
    title: 'NAJO Smart Assistant',
    sector: 'automotive',
    categories: ['mobile'],
    featured: true,
    image: '/work/najo.webp',
    icon: '/work/najo-icon.webp',
    links: [
      { kind: 'android', href: 'https://play.google.com/store/apps/details?id=tz.najo.user' },
      { kind: 'partnerAndroid', href: 'https://play.google.com/store/apps/details?id=tz.najo.mechanic' },
    ],
  },
  {
    id: 'konect',
    title: '2KONECT',
    sector: 'ecommerce',
    categories: ['web'],
    image: '/work/konect.webp',
    icon: '/work/konect-icon.webp',
    links: [{ kind: 'website', href: 'https://www.2konect.shop/' }],
  },
  {
    id: 'agiza',
    title: 'Agiza',
    sector: 'ecommerce',
    categories: ['web', 'mobile'],
    image: '/work/agiza.webp',
    icon: '/work/agiza-icon.webp',
    links: [
      { kind: 'website', href: 'https://agizastore.com/' },
      { kind: 'ios', href: 'https://apps.apple.com/tz/app/agiza-delivery/id6748238979' },
    ],
  },
  {
    id: 'direct2kariakoo',
    title: 'Direct2Kariakoo',
    sector: 'ecommerce',
    categories: ['web'],
    image: '/work/d2k.webp',
    icon: '/work/d2k-icon.webp',
    links: [{ kind: 'website', href: 'https://www.direct2kariakoo.com/' }],
  },
  {
    id: 'foodie',
    title: 'Foodie Tanzania',
    sector: 'foodDelivery',
    categories: ['mobile'],
    image: '/work/foodie.webp',
    icon: '/work/foodie-icon.webp',
    links: [
      { kind: 'android', href: 'https://play.google.com/store/apps/details?id=com.foodie.tanzania' },
    ],
  },
  {
    id: 'hunPlus',
    title: 'hun+',
    sector: 'entertainment',
    categories: ['mobile'],
    image: '/work/hun.webp',
    icon: '/work/hun-icon.webp',
    links: [
      { kind: 'android', href: 'https://play.google.com/store/apps/details?id=com.hunapp.user' },
    ],
  },
]

export const featuredProjects = projects.filter((project) => project.featured)

export function filterProjects(filter: PortfolioFilter): Project[] {
  return filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter))
}

export function countByCategory(filter: PortfolioFilter): number {
  return filterProjects(filter).length
}
