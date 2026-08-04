import {
  Compass,
  Eye,
  Gauge,
  Handshake,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

/** Ids match `about.values.items.*` in every message bundle. */
export type ValueId = 'craft' | 'candour' | 'ownership' | 'speed' | 'security' | 'curiosity'

export interface Value {
  id: ValueId
  icon: LucideIcon
}

export const values: Value[] = [
  { id: 'craft', icon: Sparkles },
  { id: 'candour', icon: Handshake },
  { id: 'ownership', icon: Compass },
  { id: 'speed', icon: Gauge },
  { id: 'security', icon: ShieldCheck },
  { id: 'curiosity', icon: Eye },
]

/** Ids match `about.timeline.items.*`. Years live here — they never translate. */
export interface Milestone {
  id: string
  year: string
}

export const milestones: Milestone[] = [
  { id: 'founded', year: '2019' },
  { id: 'firstEnterprise', year: '2020' },
  { id: 'mobile', year: '2021' },
  { id: 'regional', year: '2022' },
  { id: 'ai', year: '2023' },
  { id: 'nova', year: '2024' },
  { id: 'today', year: '2026' },
]
