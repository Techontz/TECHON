import {
  Blocks,
  Bot,
  Boxes,
  Braces,
  Cloud,
  CreditCard,
  Globe,
  PenTool,
  Smartphone,
  Sparkles,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/** Ids match the `services.items.*` keys in every message bundle. */
export type ServiceId =
  | 'aiSolutions'
  | 'aiAgents'
  | 'customSoftware'
  | 'mobileApps'
  | 'enterpriseSystems'
  | 'cloudSolutions'
  | 'automation'
  | 'webDevelopment'
  | 'uiuxDesign'
  | 'paymentIntegrations'
  | 'apiDevelopment'
  | 'digitalTransformation'

export interface Service {
  id: ServiceId
  icon: LucideIcon
}

/**
 * Order matters: the two AI services lead, since that is what the company is
 * positioning on. Everything else follows in rough delivery order.
 */
export const services: Service[] = [
  { id: 'aiSolutions', icon: Sparkles },
  { id: 'aiAgents', icon: Bot },
  { id: 'customSoftware', icon: Blocks },
  { id: 'mobileApps', icon: Smartphone },
  { id: 'enterpriseSystems', icon: Boxes },
  { id: 'cloudSolutions', icon: Cloud },
  { id: 'automation', icon: Workflow },
  { id: 'webDevelopment', icon: Globe },
  { id: 'uiuxDesign', icon: PenTool },
  { id: 'paymentIntegrations', icon: CreditCard },
  { id: 'apiDevelopment', icon: Braces },
  { id: 'digitalTransformation', icon: Zap },
]
