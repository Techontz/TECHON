import { Linkedin } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/ui/section'
import { listTeam } from '@/repositories/team'
import { initials, type TeamMember } from '@/models/team'
import { cn } from '@/lib/utils'

/**
 * The team.
 *
 * Portraits are the whole card — image edge to edge with the name plate
 * overlaid at the bottom, which is what the references do and what stops a
 * people section reading as a staff directory.
 *
 * An async server component reading through the repository: with Firebase
 * configured it renders live data, and without it the seed. Either way the
 * markup is identical, so enabling Firestore changes nothing visually.
 */
export async function Team() {
  const t = await getTranslations('team')
  const members = await listTeam()

  return (
    <Section id="team" tone="subtle" divided>
      <SectionHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <RevealGroup
        as="ul"
        className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.05}
      >
        {members.map((member, index) => (
          <RevealItem key={member.id} as="li">
            <TeamCard member={member} priority={index < 3} roleLabel={roleLabel(member, t)} />
          </RevealItem>
        ))}
      </RevealGroup>

      <p className="mt-10 text-center text-[0.875rem] text-ink-subtle">{t('note')}</p>
    </Section>
  )
}

/** An explicit override wins; otherwise the translated job title is used. */
function roleLabel(member: TeamMember, t: (key: string) => string): string {
  return member.roleOverride.trim() || t(`roles.${member.roleKey}`)
}

function TeamCard({
  member,
  roleLabel,
  priority,
}: {
  member: TeamMember
  roleLabel: string
  priority: boolean
}) {
  return (
    <article className="group relative overflow-hidden rounded-card bg-white">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-card">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            priority={priority}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          // Monogram rather than a silhouette or stock photograph: a
          // placeholder that is obviously a placeholder is more honest than one
          // pretending to be a person.
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              aria-hidden
              className="flex size-20 items-center justify-center rounded-full bg-white text-[1.25rem] font-semibold tracking-tight text-brand shadow-xs"
            >
              {initials(member.name) || '—'}
            </span>
          </div>
        )}

        {/* Name plate, floating over the base of the portrait. */}
        <div className="absolute inset-x-3 bottom-3">
          <div
            className={cn(
              'flex items-center justify-between gap-3 rounded-[12px] bg-white/90 px-4 py-3',
              'backdrop-blur-md',
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-[0.9375rem] font-semibold text-ink">{member.name}</p>
              <p className="truncate text-[0.8125rem] text-ink-muted">{roleLabel}</p>
            </div>

            {member.linkedinUrl ? (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="shrink-0 text-ink-subtle transition-colors hover:text-brand"
              >
                <Linkedin className="size-4" aria-hidden />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {member.bio ? (
        <p className="type-small px-5 py-5 text-[0.875rem]">{member.bio}</p>
      ) : null}
    </article>
  )
}
