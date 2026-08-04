import { Award, KeyRound, Rocket, Timer, type LucideIcon } from 'lucide-react'

export type StatId = 'projects' | 'clients' | 'satisfaction' | 'support'
export type PointId = 'senior' | 'speed' | 'ownership' | 'longevity'

export interface Stat {
  id: StatId
  value: number
  suffix: string
}

/** Values live here, labels live in the message bundles. */
export const stats: Stat[] = [
  { id: 'projects', value: 50, suffix: '+' },
  { id: 'clients', value: 20, suffix: '+' },
  { id: 'satisfaction', value: 99, suffix: '%' },
  { id: 'support', value: 24, suffix: '/7' },
]

export interface Point {
  id: PointId
  icon: LucideIcon
}

export const points: Point[] = [
  { id: 'senior', icon: Award },
  { id: 'speed', icon: Rocket },
  { id: 'ownership', icon: KeyRound },
  { id: 'longevity', icon: Timer },
]
