import { brandPaths, type BrandKey } from './brand-paths'

export interface TechItem {
  name: string
  /** Undefined where no permissively-licensed glyph exists — see `wordmark`. */
  path?: string
  /** Fallback rendering: the brand set in type. Used only where `path` is absent. */
  wordmark?: string
}

/**
 * Rendered monochrome throughout.
 *
 * Fifteen brand colours on one screen would fight everything else on the site,
 * so the logos inherit the neutral ink ramp and are distinguished by form
 * alone — the way Apple and Stripe present a logo wall.
 */
const brand = (key: BrandKey, name: string): TechItem => ({
  name,
  path: brandPaths[key],
})

export const techStack: TechItem[] = [
  brand('nextjs', 'Next.js'),
  brand('react', 'React'),
  brand('typescript', 'TypeScript'),
  brand('flutter', 'Flutter'),
  brand('laravel', 'Laravel'),
  brand('nodejs', 'Node.js'),
  brand('postgresql', 'PostgreSQL'),
  brand('mysql', 'MySQL'),
  brand('supabase', 'Supabase'),
  brand('firebase', 'Firebase'),
  brand('docker', 'Docker'),
  // Amazon's marks were withdrawn from simple-icons, so AWS is set in type.
  { name: 'AWS', wordmark: 'AWS' },
  brand('vercel', 'Vercel'),
  brand('github', 'GitHub'),
  brand('tailwind', 'Tailwind CSS'),
]
