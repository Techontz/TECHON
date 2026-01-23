"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/components/providers/language-provider"
import { useTheme } from "@/components/providers/theme-provider"

export function Footer() {
  const { t, dir } = useLanguage()
  const { theme } = useTheme()

  const footerLinks = {
    navigation: [
      { name: t.work, href: "#portfolio" },
      { name: t.services, href: "#services" },
      { name: t.about, href: "#about" },
      { name: t.contact, href: "#contact" },
    ],
    social: [
      { name: "LinkedIn", href: "#" },
      { name: "Twitter", href: "#" },
      { name: "Instagram", href: "#" },
    ],
  }

  return (
    <footer className="border-t border-border/50 px-4 sm:px-6 py-14 sm:py-18 lg:py-22">
      <div className="max-w-6xl mx-auto">

        {/* TOP SECTION */}
        <div
          className={`grid grid-cols-3 sm:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 text-center sm:text-left ${
            dir === "rtl" ? "sm:text-right" : ""
          }`}
        >
          {/* BRAND */}
          <div className="col-span-3 sm:col-span-1 flex flex-col items-center sm:items-start gap-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src={theme === "dark" ? "/techon-white.png" : "/techon.png"}
                alt="TechOn Software Company"
                width={160}
                height={42}
                className="h-8 sm:h-9 lg:h-10 w-auto"
              />
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-[260px]">
              {t.brandTagline}
            </p>
          </div>

          {/* NAVIGATION */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t.navigation}
            </p>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONNECT */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t.connect}
            </p>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LOCATIONS */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t.locations}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <p className="font-medium text-foreground">Houston, TX</p>
                <p className="text-xs text-muted-foreground">
                  {t.headquarters}
                </p>
              </li>
              <li className="text-muted-foreground">Dar es Salaam</li>
              <li className="text-muted-foreground">Nairobi</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          className={`mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${
            dir === "rtl" ? "sm:flex-row-reverse sm:text-right" : ""
          }`}
        >
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TechOn Software Company
          </p>

          <div className={`flex gap-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition"
            >
              {t.privacy}
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition"
            >
              {t.terms}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
