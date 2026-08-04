import {
  Boxes,
  MessageSquare,
  PhoneCall,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

/**
 * NOVA's capabilities, grouped.
 *
 * Twenty-two flat cards would be a wall; four groups of five to seven read as
 * a specification. Each id maps to a `nova.capabilities.<id>` label in every
 * message bundle — labels only, no descriptions, because the section is meant
 * to be scanned rather than read.
 */

export type NovaGroupId = 'voice' | 'channels' | 'intelligence' | 'operations'

export interface NovaGroup {
  id: NovaGroupId
  icon: LucideIcon
  capabilities: string[]
}

export const novaGroups: NovaGroup[] = [
  {
    id: 'voice',
    icon: PhoneCall,
    capabilities: [
      'aiVoiceCalling',
      'receivesCalls',
      'makesCalls',
      'naturalConversations',
      'humanHandoff',
    ],
  },
  {
    id: 'channels',
    icon: MessageSquare,
    capabilities: ['customerSupport', 'whatsapp', 'instagram', 'facebook', 'email'],
  },
  {
    id: 'intelligence',
    icon: Sparkles,
    capabilities: [
      'knowledgeBase',
      'documentSearch',
      'multilingual',
      'analytics',
      'customEmployees',
    ],
  },
  {
    id: 'operations',
    icon: Boxes,
    capabilities: [
      'appointmentBooking',
      'leadQualification',
      'crmIntegration',
      'calendarIntegration',
      'workflowAutomation',
      'apiIntegration',
      'availability',
    ],
  },
]

/** 22 across the four groups — kept in code so the count can never drift. */
export const novaCapabilityCount = novaGroups.reduce(
  (total, group) => total + group.capabilities.length,
  0,
)

/**
 * Figures shown in the product mockup. Illustrative, and deliberately kept out
 * of the message bundles — they are data, not copy, and read identically in
 * every language.
 */
export const novaMetrics = [
  { key: 'metric1', value: '94%' },
  { key: 'metric2', value: '1.2s' },
  { key: 'metric3', value: '32' },
] as const
