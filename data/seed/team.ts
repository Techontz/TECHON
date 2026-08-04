import type { TeamMember } from '@/models/team'

/**
 * Seed team.
 *
 * Six people. The founder is real; the other five are deliberate placeholders
 * carrying the roles the company actually hires for, so the section reads as a
 * team rather than as filler — and each is editable from the admin panel once
 * names and portraits exist.
 */
export const SEED_TEAM: TeamMember[] = [
  {
    id: 'conrad',
    name: 'Conrad Bubex',
    roleKey: 'founder',
    roleOverride: '',
    bio: '',
    // The portrait already in the project.
    photoUrl: '/ceo.PNG',
    photoPath: '',
    linkedinUrl: '',
    order: 1,
    published: true,
    placeholder: false,
  },
  {
    id: 'ai-engineer',
    name: 'Team member',
    roleKey: 'aiEngineer',
    roleOverride: '',
    bio: '',
    photoUrl: '',
    photoPath: '',
    linkedinUrl: '',
    order: 2,
    published: true,
    placeholder: true,
  },
  {
    id: 'backend-engineer',
    name: 'Team member',
    roleKey: 'backendEngineer',
    roleOverride: '',
    bio: '',
    photoUrl: '',
    photoPath: '',
    linkedinUrl: '',
    order: 3,
    published: true,
    placeholder: true,
  },
  {
    id: 'frontend-engineer',
    name: 'Team member',
    roleKey: 'frontendEngineer',
    roleOverride: '',
    bio: '',
    photoUrl: '',
    photoPath: '',
    linkedinUrl: '',
    order: 4,
    published: true,
    placeholder: true,
  },
  {
    id: 'mobile-developer',
    name: 'Team member',
    roleKey: 'mobileDeveloper',
    roleOverride: '',
    bio: '',
    photoUrl: '',
    photoPath: '',
    linkedinUrl: '',
    order: 5,
    published: true,
    placeholder: true,
  },
  {
    id: 'designer',
    name: 'Team member',
    roleKey: 'designer',
    roleOverride: '',
    bio: '',
    photoUrl: '',
    photoPath: '',
    linkedinUrl: '',
    order: 6,
    published: true,
    placeholder: true,
  },
]
