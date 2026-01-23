"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const featuredProjects = [
  {
    title: "AutoAid",
    description: "On-Demand Vehicle Assistance",
    category: "Mobile App",
    tags: ["Flutter", "Firebase"],
  },
  {
    title: "Vipuri",
    description: "Automotive Parts Marketplace",
    category: "Web Platform",
    tags: ["Next.js", "PostgreSQL"],
  },
  {
    title: "SmartAssist AI",
    description: "Customer Support Automation",
    category: "AI System",
    tags: ["Python", "OpenAI"],
  },
  {
    title: "FleetCore",
    description: "Fleet Management System",
    category: "Business System",
    tags: ["React", "Node.js"],
  },
]

export function Portfolio() {
  const { t, dir } = useLanguage()

  return (
    <section id="portfolio" className="py-20 sm:py-28 lg:py-36 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-10 sm:mb-14 ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}>
          <div className={dir === "rtl" ? "text-right" : ""}>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-3">
              {t.selectedWork}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              {t.featuredProjects}
            </h2>
          </div>
          <Link
            href="/portfolio"
            className={`group inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
          >
            {t.viewAllProjects}
            <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 ${dir === "rtl" ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {featuredProjects.map((project, index) => (
            <Link
              key={project.title}
              href="/portfolio"
              className={`group relative overflow-hidden rounded-lg sm:rounded-xl bg-muted/50 hover:bg-muted transition-all duration-500 ${
                index === 0 ? "sm:col-span-2" : ""
              }`}
            >
              {/* Project Image Area */}
              <div className={`${index === 0 ? "aspect-[16/9] sm:aspect-[21/9]" : "aspect-[4/3]"} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-foreground/10" />
                <div className="absolute inset-4 sm:inset-6 lg:inset-8 border border-foreground/10 rounded-md" />
                
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 sm:w-20 h-16 sm:h-20 rounded-full border border-foreground/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-foreground/5" />
              </div>

              {/* Project Info */}
              <div className="p-4 sm:p-6">
                <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 ${dir === "rtl" ? "sm:flex-row-reverse text-right" : ""}`}>
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <div className={`flex flex-wrap gap-1.5 sm:gap-2 ${dir === "rtl" ? "justify-end" : ""}`}>
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-foreground/5 rounded-full text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className={`absolute top-3 sm:top-4 ${dir === "rtl" ? "left-3 sm:left-4" : "right-3 sm:right-4"}`}>
                <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 bg-foreground text-background rounded-full">
                  {project.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
