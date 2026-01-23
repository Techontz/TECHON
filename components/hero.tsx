"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

export function Hero() {
  const { t, dir } = useLanguage()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t.greeting.morning
    if (hour < 18) return t.greeting.afternoon
    return t.greeting.evening
  }

  const stats = [
    { value: "50+", label: t.projects },
    { value: "5", label: t.years },
    { value: "40+", label: t.clients },
    { value: "3", label: t.offices },
  ]

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%23f7f6f3' width='1920' height='1080'/%3E%3C/svg%3E"
        >
          <source
            src="https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px]" />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
      </div>

      {/* Animated subtle grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto w-full relative">
        {/* Greeting */}
        <p className="text-[10px] sm:text-xs text-muted-foreground mb-6 sm:mb-8 tracking-wide">
          {getGreeting()}
        </p>

        {/* Main Headline - Serif Typography */}
        <h1 className="font-serif text-[32px] sm:text-[40px] md:text-[56px] lg:text-[72px] xl:text-[84px] font-normal leading-[1.05] tracking-tight max-w-4xl">
          {t.heroTitle1}
          <br className="hidden sm:block" />
          <span className="italic"> {t.heroTitle2}</span> {t.heroTitle3}
        </h1>

        {/* Subheadline */}
        <p className="mt-6 sm:mt-8 lg:mt-10 text-xs sm:text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* CTAs */}
        <div className={`mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-foreground text-background text-xs sm:text-sm rounded-full hover:bg-foreground/90 transition-all duration-300 shadow-lg shadow-foreground/10"
          >
            {t.startProject}
          </Link>
          <Link
            href="#portfolio"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            {t.viewWork}
            <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 ${dir === "rtl" ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 sm:mt-28 lg:mt-36 pt-8 sm:pt-10 border-t border-border/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{stat.value}</p>
                <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
