import { setRequestLocale } from 'next-intl/server'

import { AboutPreview } from '@/components/sections/about-preview'
import { Contact } from '@/components/sections/contact'
import { Hero } from '@/components/sections/hero'
import { Nova } from '@/components/sections/nova'
import { Portfolio } from '@/components/sections/portfolio'
import { Process } from '@/components/sections/process'
import { Services } from '@/components/sections/services'
import { Team } from '@/components/sections/team'
import { TechStack } from '@/components/sections/tech-stack'
import { Testimonials } from '@/components/sections/testimonials'
import { WhyTechOn } from '@/components/sections/why-techon'

/**
 * Section order follows the brief, and it tells a story: what we build, our
 * product, the proof, who we serve, why us, how we work, what we build with,
 * what clients say, who we are, and how to reach us.
 *
 * Team sits immediately before About so the company is introduced by its
 * people rather than by its prose.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Hero />
      <Services />
      <Nova />
      <Portfolio />
      <WhyTechOn />
      <Process />
      <TechStack />
      <Testimonials />
      <Team />
      <AboutPreview />
      <Contact />
    </>
  )
}
