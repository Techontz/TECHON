"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, LayoutGrid, List } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import Image from "next/image"
import { useTheme } from "@/components/providers/theme-provider"

const projects = [
  // Mobile Apps
  { id: 1, name: "AutoAid", description: "On-Demand Vehicle Assistance Platform", category: "mobile" },
  { id: 2, name: "Washerly", description: "Smart Laundry Service App", category: "mobile" },
  { id: 3, name: "FuelLink", description: "Fuel Delivery & Tracking App", category: "mobile" },
  { id: 4, name: "QuickServe", description: "Service Booking Mobile Platform", category: "mobile" },
  { id: 5, name: "MoveSmart", description: "Logistics & Dispatch App", category: "mobile" },
  // Web Apps
  { id: 6, name: "Vipuri", description: "Automotive Spare Parts Marketplace", category: "web" },
  { id: 7, name: "MagerJoh", description: "Personal & Brand Portfolio Platform", category: "web" },
  { id: 8, name: "TradeFlow", description: "Business Trading Web Platform", category: "web" },
  { id: 9, name: "EduVerify", description: "Certificate Verification System", category: "web" },
  { id: 10, name: "EstateHub", description: "Property Listing & Management Site", category: "web" },
  // AI Systems
  { id: 11, name: "SmartAssist AI", description: "Customer Support Automation", category: "ai" },
  { id: 12, name: "InsightX", description: "Business Analytics & Forecasting AI", category: "ai" },
  { id: 13, name: "DocuMind", description: "Intelligent Document Processing", category: "ai" },
  // Business Systems
  { id: 14, name: "FleetCore", description: "Fleet & Vehicle Management System", category: "business" },
  { id: 15, name: "OrderSync", description: "Order & Inventory Management", category: "business" },
  { id: 16, name: "MemberPro", description: "Organization & Member Management", category: "business" },
  // Games
  { id: 17, name: "Speed Rush", description: "Casual Mobile Racing Game", category: "games" },
  { id: 18, name: "PuzzleCraft", description: "Brain-Training Puzzle Game", category: "games" },
  { id: 19, name: "Street Dash", description: "Endless Runner Mobile Game", category: "games" },
]

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { t, dir } = useLanguage()
  const { theme } = useTheme()

  const categories = [
    { id: "all", label: t.all },
    { id: "mobile", label: t.mobileApps },
    { id: "web", label: t.webDev },
    { id: "ai", label: t.aiSolutions },
    { id: "business", label: t.businessSystems },
    { id: "games", label: t.games },
  ]

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "mobile": return t.mobileApps
      case "web": return t.webDev
      case "ai": return t.aiSolutions
      case "business": return t.businessSystems
      case "games": return t.games
      default: return category
    }
  }

  const filteredProjects =
    activeCategory === "all" ? projects : projects.filter((p) => p.category === activeCategory)

  return (
    <main className="min-h-screen bg-background">
      {/* PAGE HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            
            {/* Back */}
            <Link
              href="/"
              className={`group flex items-center gap-2 text-muted-foreground hover:text-foreground transition ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <ArrowLeft
                className={`w-4 h-4 transition-transform ${
                  dir === "rtl"
                    ? "rotate-180 group-hover:translate-x-1"
                    : "group-hover:-translate-x-1"
                }`}
              />
              <span className="text-xs sm:text-sm">{t.backToHome}</span>
            </Link>

            {/* LOGO (replaced TechOn text) */}
            <Link href="/" className="flex items-center">
              <Image
                src={theme === "dark" ? "/techon-white.png" : "/techon.png"}
                alt="TechOn Software Company"
                width={160}
                height={42}
                priority
                className="h-8 sm:h-9 lg:h-10 w-auto"
              />
            </Link>

            <div className="w-12" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
        {/* Page Header */}
        <div className={`max-w-xl mb-10 sm:mb-14 lg:mb-16 ${dir === "rtl" ? "text-right mr-0 ml-auto" : ""}`}>
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-3">
            Portfolio
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6">
            {t.allProjects}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            {t.showing} {projects.length} {t.projectPlural}
          </p>
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-12 lg:mb-14 ${dir === "rtl" ? "justify-end" : ""}`}>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs rounded-full transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Count & View Toggle */}
        <div className={`flex items-center justify-between mb-6 sm:mb-8 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {t.showing} {filteredProjects.length} {filteredProjects.length !== 1 ? t.projectPlural : t.project}
          </p>
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 sm:p-2 rounded-md transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 sm:p-2 rounded-md transition-all duration-300 ${
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="List view"
            >
              <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Projects Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-lg sm:rounded-xl bg-muted/50 hover:bg-muted transition-all duration-500"
              >
                {/* Project Image Area */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-foreground/10" />
                  <div className="absolute inset-4 sm:inset-6 border border-foreground/10 rounded-md" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 sm:w-16 h-12 sm:h-16 rounded-full border border-foreground/10" />
                </div>

                {/* Project Info */}
                <div className={`p-4 sm:p-5 lg:p-6 ${dir === "rtl" ? "text-right" : ""}`}>
                  <span className="inline-block text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-foreground/5 rounded-full text-muted-foreground mb-2 sm:mb-3">
                    {getCategoryLabel(project.category)}
                  </span>
                  <h3 className="text-sm sm:text-base font-medium text-foreground mb-1">
                    {project.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects List View - Two Columns */}
        {viewMode === "list" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`group flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-lg sm:rounded-xl bg-muted/30 hover:bg-muted/60 border border-transparent hover:border-border/50 transition-all duration-300 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
              >
                {/* Project Number */}
                <span className="text-[10px] sm:text-xs text-muted-foreground/50 font-mono w-5 sm:w-6 shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Project Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-foreground/5 border border-foreground/10 flex items-center justify-center shrink-0">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-foreground/20" />
                </div>

                {/* Project Info */}
                <div className={`flex-1 min-w-0 ${dir === "rtl" ? "text-right" : ""}`}>
                  <div className={`flex items-center gap-2 mb-0.5 sm:mb-1 ${dir === "rtl" ? "flex-row-reverse justify-end" : ""}`}>
                    <h3 className="text-sm sm:text-base font-medium text-foreground truncate">
                      {project.name}
                    </h3>
                    <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 bg-foreground/5 rounded-full text-muted-foreground shrink-0">
                      {getCategoryLabel(project.category)}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {project.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0 ${dir === "rtl" ? "order-first" : ""}`}>
                  <svg
                    className={`w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground ${dir === "rtl" ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 sm:mt-20 lg:mt-24 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
            {t.ctaSubtitle}
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-foreground text-background text-xs sm:text-sm rounded-full hover:bg-foreground/90 transition-all duration-300"
          >
            {t.startProject}
          </Link>
        </div>
      </div>
    </main>
  )
}
