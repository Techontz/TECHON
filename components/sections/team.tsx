import { Instagram, Linkedin } from 'lucide-react'
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
  // Only the founder is shown by name; the wider team is described in words.
  const ceo = (await listTeam()).find((member) => member.roleKey === 'founder')

  return (
    <Section id="team" tone="subtle" divided>
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        {ceo ? (
          <RevealGroup className="mx-auto w-full max-w-sm lg:max-w-none">
            <RevealItem>
              <TeamCard member={ceo} priority roleLabel={roleLabel(ceo, t)} />
            </RevealItem>
          </RevealGroup>
        ) : null}

        <div>
          <SectionHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

          <RevealGroup as="ul" className="mt-10 grid gap-3 sm:grid-cols-3" stagger={0.06}>
            {(['engineers', 'security', 'ownership'] as const).map((key) => (
              <RevealItem key={key} as="li">
                <div className="h-full rounded-[18px] bg-white p-5">
                  <p className="text-[1.75rem] leading-tight font-semibold tracking-[-0.03em] text-ink">
                    {t(`facts.${key}.value`)}
                  </p>
                  <p className="mt-1 text-[0.875rem] leading-snug text-ink-muted">
                    {t(`facts.${key}.label`)}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
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
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 384px, 92vw"
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
              {initials(member.name) || '?'}
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

            <div className="flex shrink-0 items-center gap-3">
            {member.instagramUrl ? (
              <a
                href={member.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on Instagram`}
                className="shrink-0 text-ink-subtle transition-colors hover:text-brand"
              >
                <Instagram className="size-4" aria-hidden />
              </a>
            ) : null}
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
      </div>

      {member.bio ? (
        <p className="type-small px-5 py-5 text-[0.875rem]">{member.bio}</p>
      ) : null}
    </article>
  )
}
