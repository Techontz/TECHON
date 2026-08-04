/**
 * Every id must have a matching entry under `portfolio.items` in all four
 * message bundles. Pages are statically rendered for each locale, so a missing
 * translation fails the build rather than shipping a blank card.
 */
export type ProjectId =
  | 'taxiApp'
  | 'deliveryApp'
  | 'tradingApp'
  | 'restaurantApp'
  | 'fitnessApp'
  | 'musicApp'
  | 'educationApp'
  | 'healthcareApp'
  | 'novaAi'
  | 'aiCallingAgent'
  | 'aiCustomerSupport'
  | 'aiChatAssistant'
  | 'documentIntelligence'
  | 'workflowAutomation'
  | 'pbzBank'
  | 'techonWebsite'
  | 'corporateWebsite'
  | 'realEstate'
  | 'restaurantWebsite'
  | 'ecommerce'
  | 'portfolioWebsite'
  | 'hospital'
  | 'school'
  | 'inventory'
  | 'hotel'
  | 'pos'
  | 'hrManagement'
  | 'payroll'
  | 'loanManagement'
  | 'erp'
  | 'crm'
  | 'puzzleGame'
  | 'adventureGame'
  | 'strategyGame'
  | 'arcadeGame'

/** Tab order is deliberate and matches the order rendered in the UI. */
export const projectCategories = ['mobile', 'ai', 'web', 'business', 'games'] as const
export type ProjectCategory = (typeof projectCategories)[number]

export const portfolioFilters = ['all', ...projectCategories] as const
export type PortfolioFilter = (typeof portfolioFilters)[number]

/**
 * `live`        — shipped, links are real.
 * `comingSoon`  — in production, not yet public.
 * `template`    — placeholder entry. Swap the title, tags and links for a real
 *                 case study; the badge disappears the moment you change this.
 */
export type ProjectStatus = 'live' | 'comingSoon' | 'template'

export interface Project {
  id: ProjectId
  /** Proper noun, intentionally not translated. */
  title: string
  category: ProjectCategory
  status: ProjectStatus
  tags: string[]
  /** Surfaced on the homepage's curated grid. */
  featured?: boolean
  href?: string
  github?: string
  /**
   * Optional screenshot in `public/`. Without one the card renders its
   * generated gradient artwork, which is the intended state until you have
   * real imagery.
   */
  image?: string
}

export const projects: Project[] = [
  // ---------------------------------------------------------------- Mobile
  {
    id: 'taxiApp',
    title: 'Taxi App',
    category: 'mobile',
    status: 'template',
    tags: ['Flutter', 'Google Maps', 'Firebase'],
    featured: true,
  },
  {
    id: 'deliveryApp',
    title: 'Delivery App',
    category: 'mobile',
    status: 'template',
    tags: ['React Native', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'tradingApp',
    title: 'Trading App',
    category: 'mobile',
    status: 'template',
    tags: ['Flutter', 'WebSockets', 'Redis'],
  },
  {
    id: 'restaurantApp',
    title: 'Restaurant App',
    category: 'mobile',
    status: 'template',
    tags: ['Flutter', 'Laravel', 'Stripe'],
  },
  {
    id: 'fitnessApp',
    title: 'Fitness App',
    category: 'mobile',
    status: 'template',
    tags: ['React Native', 'HealthKit', 'Supabase'],
  },
  {
    id: 'musicApp',
    title: 'Music Streaming App',
    category: 'mobile',
    status: 'template',
    tags: ['Flutter', 'Node.js', 'AWS S3'],
  },
  {
    id: 'educationApp',
    title: 'Education App',
    category: 'mobile',
    status: 'template',
    tags: ['Flutter', 'Firebase', 'Mux'],
  },
  {
    id: 'healthcareApp',
    title: 'Healthcare App',
    category: 'mobile',
    status: 'template',
    tags: ['React Native', 'Laravel', 'WebRTC'],
  },

  // -------------------------------------------------------------------- AI
  {
    id: 'novaAi',
    title: 'NOVA AI',
    category: 'ai',
    status: 'live',
    tags: ['Next.js', 'Claude', 'Vector DB'],
    featured: true,
  },
  {
    id: 'aiCallingAgent',
    title: 'AI Calling Agent',
    category: 'ai',
    status: 'template',
    tags: ['Python', 'Twilio', 'Realtime API'],
    featured: true,
  },
  {
    id: 'aiCustomerSupport',
    title: 'AI Customer Support',
    category: 'ai',
    status: 'template',
    tags: ['Next.js', 'RAG', 'PostgreSQL'],
  },
  {
    id: 'aiChatAssistant',
    title: 'AI Chat Assistant',
    category: 'ai',
    status: 'template',
    tags: ['React', 'Embeddings', 'Edge Runtime'],
  },
  {
    id: 'documentIntelligence',
    title: 'Document Intelligence',
    category: 'ai',
    status: 'template',
    tags: ['Python', 'OCR', 'FastAPI'],
  },
  {
    id: 'workflowAutomation',
    title: 'Workflow Automation',
    category: 'ai',
    status: 'template',
    tags: ['TypeScript', 'Temporal', 'Docker'],
  },

  // ------------------------------------------------------------------- Web
  {
    id: 'pbzBank',
    title: 'PBZ Bank Website',
    category: 'web',
    status: 'live',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
    featured: true,
  },
  {
    id: 'techonWebsite',
    title: 'TechOn Website',
    category: 'web',
    status: 'live',
    tags: ['Next.js', 'Framer Motion', 'Tailwind'],
    featured: true,
    href: '/',
  },
  {
    id: 'corporateWebsite',
    title: 'Corporate Website',
    category: 'web',
    status: 'template',
    tags: ['Next.js', 'Sanity', 'Vercel'],
  },
  {
    id: 'realEstate',
    title: 'Real Estate Platform',
    category: 'web',
    status: 'template',
    tags: ['Next.js', 'Mapbox', 'PostgreSQL'],
  },
  {
    id: 'restaurantWebsite',
    title: 'Restaurant Website',
    category: 'web',
    status: 'template',
    tags: ['Next.js', 'Sanity', 'Stripe'],
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Platform',
    category: 'web',
    status: 'template',
    tags: ['Next.js', 'Laravel', 'Stripe'],
    featured: true,
  },
  {
    id: 'portfolioWebsite',
    title: 'Portfolio Website',
    category: 'web',
    status: 'template',
    tags: ['Next.js', 'MDX', 'Vercel'],
  },

  // -------------------------------------------------------------- Business
  {
    id: 'hospital',
    title: 'Hospital Management System',
    category: 'business',
    status: 'template',
    tags: ['Laravel', 'MySQL', 'React'],
    featured: true,
  },
  {
    id: 'school',
    title: 'School Management System',
    category: 'business',
    status: 'template',
    tags: ['Laravel', 'MySQL', 'Vue'],
  },
  {
    id: 'inventory',
    title: 'Inventory System',
    category: 'business',
    status: 'template',
    tags: ['Next.js', 'PostgreSQL', 'Prisma'],
  },
  {
    id: 'hotel',
    title: 'Hotel Management',
    category: 'business',
    status: 'template',
    tags: ['Laravel', 'MySQL', 'Livewire'],
  },
  {
    id: 'pos',
    title: 'POS System',
    category: 'business',
    status: 'template',
    tags: ['Flutter', 'SQLite', 'Node.js'],
  },
  {
    id: 'hrManagement',
    title: 'HR Management',
    category: 'business',
    status: 'template',
    tags: ['Laravel', 'MySQL', 'React'],
  },
  {
    id: 'payroll',
    title: 'Payroll System',
    category: 'business',
    status: 'template',
    tags: ['Laravel', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'loanManagement',
    title: 'Loan Management System',
    category: 'business',
    status: 'template',
    tags: ['Laravel', 'PostgreSQL', 'React'],
  },
  {
    id: 'erp',
    title: 'ERP',
    category: 'business',
    status: 'template',
    tags: ['Next.js', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'crm',
    title: 'CRM',
    category: 'business',
    status: 'template',
    tags: ['Next.js', 'Supabase', 'TypeScript'],
  },

  // ----------------------------------------------------------------- Games
  {
    id: 'puzzleGame',
    title: 'Puzzle Game',
    category: 'games',
    status: 'comingSoon',
    tags: ['Unity', 'C#'],
  },
  {
    id: 'adventureGame',
    title: 'Adventure Game',
    category: 'games',
    status: 'comingSoon',
    tags: ['Godot', 'GDScript'],
  },
  {
    id: 'strategyGame',
    title: 'Strategy Game',
    category: 'games',
    status: 'comingSoon',
    tags: ['Unity', 'Photon'],
  },
  {
    id: 'arcadeGame',
    title: 'Arcade Game',
    category: 'games',
    status: 'comingSoon',
    tags: ['Flutter', 'Flame'],
  },
]

export const featuredProjects = projects.filter((project) => project.featured)

export function filterProjects(filter: PortfolioFilter): Project[] {
  return filter === 'all' ? projects : projects.filter((p) => p.category === filter)
}

export function countByCategory(filter: PortfolioFilter): number {
  return filterProjects(filter).length
}
