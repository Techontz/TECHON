import Image from 'next/image'

import type { Project, ProjectCategory } from '@/data/projects'
import { cn } from '@/lib/utils'

/**
 * Placeholder artwork for projects with no screenshot yet.
 *
 * Each category gets an abstract wireframe of the product it represents,
 * drawn in the neutral ramp with one small brand-coloured element. Monochrome
 * placeholders keep a mixed grid calm — thirty-five colourful tiles would
 * overwhelm everything else on the page.
 *
 * Set `project.image` and this is replaced by the real thing, same box, no
 * layout shift.
 */

const line = '#D8D8DC'
const fill = '#EFEFF2'
const brand = '#7B19BC'

function Wireframe({ category }: { category: ProjectCategory }) {
  switch (category) {
    case 'mobile':
      return (
        <svg viewBox="0 0 320 200" className="size-full" aria-hidden>
          <rect x="128" y="18" width="64" height="164" rx="12" fill="#fff" stroke={line} />
          <rect x="140" y="34" width="40" height="6" rx="3" fill={line} />
          <rect x="140" y="48" width="40" height="34" rx="6" fill={fill} />
          <rect x="140" y="90" width="40" height="5" rx="2.5" fill={line} />
          <rect x="140" y="101" width="28" height="5" rx="2.5" fill={line} />
          <rect x="140" y="118" width="40" height="26" rx="6" fill={fill} />
          <rect x="140" y="154" width="40" height="12" rx="6" fill={brand} />
        </svg>
      )

    case 'ai':
      return (
        <svg viewBox="0 0 320 200" className="size-full" aria-hidden>
          <circle cx="160" cy="100" r="58" fill="none" stroke={line} />
          <circle cx="160" cy="100" r="34" fill="none" stroke={line} />
          <circle cx="160" cy="100" r="10" fill={brand} />
          {[0, 72, 144, 216, 288].map((angle) => {
            const radians = (angle * Math.PI) / 180
            const x = 160 + Math.cos(radians) * 58
            const y = 100 + Math.sin(radians) * 58
            return (
              <g key={angle}>
                <line x1="160" y1="100" x2={x} y2={y} stroke={line} />
                <circle cx={x} cy={y} r="6" fill="#fff" stroke={line} />
              </g>
            )
          })}
        </svg>
      )

    case 'web':
      return (
        <svg viewBox="0 0 320 200" className="size-full" aria-hidden>
          <rect x="40" y="26" width="240" height="148" rx="10" fill="#fff" stroke={line} />
          <line x1="40" y1="52" x2="280" y2="52" stroke={line} />
          <circle cx="54" cy="39" r="3" fill={line} />
          <circle cx="64" cy="39" r="3" fill={line} />
          <circle cx="74" cy="39" r="3" fill={line} />
          <rect x="58" y="70" width="88" height="8" rx="4" fill={line} />
          <rect x="58" y="86" width="62" height="8" rx="4" fill={fill} />
          <rect x="58" y="108" width="52" height="14" rx="5" fill={brand} />
          <rect x="176" y="70" width="88" height="66" rx="8" fill={fill} />
          <rect x="58" y="142" width="206" height="6" rx="3" fill={fill} />
        </svg>
      )

    case 'business':
      return (
        <svg viewBox="0 0 320 200" className="size-full" aria-hidden>
          <rect x="40" y="26" width="240" height="148" rx="10" fill="#fff" stroke={line} />
          <rect x="58" y="46" width="60" height="34" rx="6" fill={fill} />
          <rect x="128" y="46" width="60" height="34" rx="6" fill={fill} />
          <rect x="198" y="46" width="64" height="34" rx="6" fill={fill} />
          {[
            [64, 28],
            [88, 44],
            [112, 20],
            [136, 52],
            [160, 34],
            [184, 58],
            [208, 40],
            [232, 26],
          ].map(([x, height], index) => (
            <rect
              key={x}
              x={x}
              y={152 - height}
              width="13"
              height={height}
              rx="3"
              fill={index === 5 ? brand : line}
            />
          ))}
        </svg>
      )

    case 'games':
      return (
        <svg viewBox="0 0 320 200" className="size-full" aria-hidden>
          <rect x="76" y="66" width="168" height="76" rx="34" fill="#fff" stroke={line} />
          <rect x="104" y="100" width="26" height="6" rx="3" fill={line} />
          <rect x="114" y="90" width="6" height="26" rx="3" fill={line} />
          <circle cx="196" cy="94" r="7" fill={brand} />
          <circle cx="214" cy="110" r="7" fill={line} />
          <circle cx="178" cy="110" r="7" fill={line} />
          <circle cx="196" cy="126" r="7" fill={line} />
        </svg>
      )
  }
}

interface ProjectThumbProps {
  project: Project
  className?: string
  sizes?: string
  priority?: boolean
}

export function ProjectThumb({
  project,
  className,
  sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw',
  priority = false,
}: ProjectThumbProps) {
  if (project.image) {
    return (
      <div className={cn('relative overflow-hidden bg-surface', className)}>
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden bg-surface', className)}>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Wireframe category={project.category} />
      </div>
    </div>
  )
}
