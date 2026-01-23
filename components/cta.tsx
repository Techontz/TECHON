"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

export function CTA() {
  const { t, dir } = useLanguage()

  return (
    <section id="contact" className="py-20 sm:py-28 lg:py-36 px-4 sm:px-6 bg-foreground text-background">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[10px] sm:text-xs text-background/50 uppercase tracking-widest mb-4 sm:mb-6">
          {t.readyToStart}
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-6 sm:mb-8 text-balance leading-tight">
          {t.ctaTitle1}
          <br className="hidden sm:block" />
          <span className="italic">{t.ctaTitle2}</span> {t.ctaTitle3}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-background/60 max-w-md mx-auto mb-10 sm:mb-12 leading-relaxed">
          {t.ctaSubtitle}
        </p>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}>
          <Link
            href="mailto:hello@techon.co.tz"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-background text-foreground text-xs sm:text-sm rounded-full hover:bg-background/90 transition-all duration-300"
          >
            hello@techon.co.tz
          </Link>
          <Link
            href="tel:+255123456789"
            className={`group inline-flex items-center gap-2 text-xs sm:text-sm text-background/60 hover:text-background transition-colors duration-300 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
          >
            {t.orCallUs}
            <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 ${dir === "rtl" ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
          </Link>
        </div>

        {/* Offices */}
        <div className="mt-16 sm:mt-20 lg:mt-24 pt-8 sm:pt-10 border-t border-background/10">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            <div>
              <p className="text-[10px] sm:text-xs text-background/40 uppercase tracking-widest mb-1 sm:mb-2">USA</p>
              <p className="text-xs sm:text-sm md:text-base">Houston, TX</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-background/40 uppercase tracking-widest mb-1 sm:mb-2">Tanzania</p>
              <p className="text-xs sm:text-sm md:text-base">Dar es Salaam</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-background/40 uppercase tracking-widest mb-1 sm:mb-2">Kenya</p>
              <p className="text-xs sm:text-sm md:text-base">Nairobi</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
