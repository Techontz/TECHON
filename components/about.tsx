"use client"

import { useLanguage } from "@/components/providers/language-provider"

export function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-20 sm:py-28 lg:py-36 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-start">
          {/* Left Column - Text */}
          <div>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-3">
              {t.aboutUs}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-8 text-balance">
              {t.aboutTitle1}
              <br />
              <span className="italic">{t.aboutTitle2}</span>
            </h2>
            <div className="space-y-4 sm:space-y-5 text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>{t.aboutDesc1}</p>
              <p>{t.aboutDesc2}</p>
            </div>

            {/* Values */}
            <div className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-2 gap-6 sm:gap-8">
              <div>
                <p className="font-serif text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2">{t.qualityFirst}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                  {t.qualityDesc}
                </p>
              </div>
              <div>
                <p className="font-serif text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2">{t.partnership}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                  {t.partnershipDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="aspect-[3/4] bg-muted rounded-lg sm:rounded-xl overflow-hidden relative">
              {/* Decorative layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent" />
              <div className="absolute inset-6 sm:inset-8 lg:inset-10 border border-foreground/10 rounded-md" />
              
              {/* Content card */}
              <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 bg-background/90 backdrop-blur-sm rounded-md p-4 sm:p-5 lg:p-6">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-1">{t.founded}</p>
                <p className="font-serif text-3xl sm:text-4xl lg:text-5xl">2019</p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 lg:-top-6 lg:-right-6 bg-background rounded-md p-3 sm:p-4 border border-border shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-medium text-accent-foreground">TX</span>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-medium">{t.headquarters}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Houston, TX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
