"use client"

import { useLanguage } from "@/components/providers/language-provider"

export function WhyChooseUs() {
  const { t, dir } = useLanguage()

  const reasons = [
    {
      number: "01",
      title: t.reliableSecure,
      description: t.reliableSecureDesc,
    },
    {
      number: "02",
      title: t.onTimeDelivery,
      description: t.onTimeDeliveryDesc,
    },
    {
      number: "03",
      title: t.dedicatedTeam,
      description: t.dedicatedTeamDesc,
    },
    {
      number: "04",
      title: t.fastEfficient,
      description: t.fastEfficientDesc,
    },
  ]

  return (
    <section className="py-20 sm:py-28 lg:py-36 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className={`max-w-xl mb-12 sm:mb-16 lg:mb-20 ${dir === "rtl" ? "text-right mr-0 ml-auto" : ""}`}>
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-3">
            {t.whyTechOn}
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {t.whatSetsUsApart}
          </h2>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {reasons.map((reason) => (
            <div
              key={reason.number}
              className={`group p-6 sm:p-8 lg:p-10 bg-background rounded-lg sm:rounded-xl border border-border/50 hover:border-foreground/20 transition-all duration-300 ${dir === "rtl" ? "text-right" : ""}`}
            >
              <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                {reason.number}
              </span>
              <h3 className="font-serif text-lg sm:text-xl lg:text-2xl mt-4 sm:mt-6 mb-2 sm:mb-3">
                {reason.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
