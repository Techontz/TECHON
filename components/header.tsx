"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Moon, Sun, Globe, ChevronDown } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"
import { useLanguage, languages } from "@/components/providers/language-provider"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = () => setLangOpen(false)
    if (langOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [langOpen])

  const navLinks = [
    { name: t.work, href: "#portfolio" },
    { name: t.services, href: "#services" },
    { name: t.about, href: "#about" },
    { name: t.contact, href: "#contact" },
  ]

  const currentLang = languages.find(l => l.code === language)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src={theme === "dark" ? "/techon-white.png" : "/techon.png"}
              alt="TechOn Software Company"
              width={180}
              height={48}
              priority
              className="h-9 sm:h-11 lg:h-12 w-auto transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLangOpen(!langOpen)
                }}
                className="flex items-center gap-1.5 p-2 rounded-full hover:bg-muted transition text-muted-foreground hover:text-foreground"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">
                  {currentLang?.code.toUpperCase()}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {langOpen && (
                <div className="absolute top-full right-0 mt-2 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[140px] z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setLangOpen(false)
                      }}
                      className={`w-full px-3 py-2 text-left text-xs hover:bg-muted flex justify-between ${
                        language === lang.code
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {lang.nativeName}
                      {language === lang.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition text-muted-foreground hover:text-foreground"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {/* CTA Desktop */}
            <div className="hidden md:block">
              <Link
                href="#contact"
                className="text-sm px-5 py-2.5 bg-foreground text-background rounded-full hover:bg-foreground/90 transition"
              >
                {t.startProject}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 -mr-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-background/95 backdrop-blur-xl border-t border-border/50 px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="#contact"
            className="inline-block mt-4 text-sm px-5 py-2.5 bg-foreground text-background rounded-full"
            onClick={() => setIsOpen(false)}
          >
            {t.startProject}
          </Link>
        </div>
      </div>
    </header>
  )
}
