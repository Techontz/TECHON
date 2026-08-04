import {
  Compass,
  Map,
  PenTool,
  Code2,
  ShieldCheck,
  Rocket,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react'

/** Ids match the `process.steps.*` keys in every message bundle. */
export type ProcessStepId =
  | 'discovery'
  | 'planning'
  | 'design'
  | 'development'
  | 'testing'
  | 'deployment'
  | 'support'

export interface ProcessStep {
  id: ProcessStepId
  icon: LucideIcon
  /** Shown on the timeline node as a rough expectation, not a contract. */
  duration: string
}

export const processSteps: ProcessStep[] = [
  { id: 'discovery', icon: Compass, duration: '1–2 weeks' },
  { id: 'planning', icon: Map, duration: '1 week' },
  { id: 'design', icon: PenTool, duration: '2–4 weeks' },
  { id: 'development', icon: Code2, duration: '6–16 weeks' },
  { id: 'testing', icon: ShieldCheck, duration: '2 weeks' },
  { id: 'deployment', icon: Rocket, duration: '2–3 days' },
  { id: 'support', icon: LifeBuoy, duration: 'Ongoing' },
]
