"use client"

import { Smartphone, Globe, Brain, Building2, Gamepad2 } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

export function Services() {
  const { t, dir } = useLanguage()

  const services = [
    {
      icon: Smartphone,
      title: t.mobileApps,
      description: t.mobileAppsDesc,
    },
    {
      icon: Globe,
      title: t.webDev,
      description: t.webDevDesc,
    },
    {
      icon: Brain,
      title: t.aiSolutions,
      description: t.aiSolutionsDesc,
    },
    {
      icon: Building2,
      title: t.businessSystems,
      description: t.businessSystemsDesc,
    },
    {
      icon: Gamepad2,
      title: t.games,
      description: t.gamesDesc,
    },
  ]

  return (
    <section id="services" className="py-20 sm:py-28 lg:py-36 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-xl mb-12 sm:mb-16 lg:mb-20">
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-3">
            {t.whatWeDo}
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6">
            {t.servicesTitle}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-0 divide-y divide-border/50">
          {services.map((service) => (
            <div
              key={service.title}
              className={`group py-6 sm:py-8 lg:py-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 hover:bg-muted/50 -mx-4 sm:-mx-6 px-4 sm:px-6 transition-colors duration-300 cursor-pointer ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}
            >
              {/* Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border flex items-center justify-center shrink-0 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                <service.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* Content */}
              <div className={`flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 ${dir === "rtl" ? "sm:flex-row-reverse text-right" : ""}`}>
                <h3 className="text-base sm:text-lg lg:text-xl font-medium w-full sm:w-40 lg:w-48 shrink-0">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Arrow */}
              <div className={`hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${dir === "rtl" ? "order-first" : ""}`}>
                <div className="w-8 h-8 rounded-full border border-foreground flex items-center justify-center">
                  <svg className={`w-3 h-3 ${dir === "rtl" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
