import { setRequestLocale } from 'next-intl/server'

import { AboutPreview } from '@/components/sections/about-preview'
import { Contact } from '@/components/sections/contact'
import { Hero } from '@/components/sections/hero'
import { Nova } from '@/components/sections/nova'
import { Portfolio } from '@/components/sections/portfolio'
import { Process } from '@/components/sections/process'
import { Services } from '@/components/sections/services'
import { TechStack } from '@/components/sections/tech-stack'
import { Testimonials } from '@/components/sections/testimonials'
import { WhyTechOn } from '@/components/sections/why-techon'

/**
 * Section order is the argument the page makes: what we build, our product,
 * who we are, what we can do, proof, why us, how we work, what we work with,
 * what clients say, how to reach us.
 *
 * The About preview sits between NOVA and Services deliberately — a human
 * pause between the two densest sections on the page.
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
      <Nova />
      <AboutPreview />
      <Services />
      <Portfolio />
      <WhyTechOn />
      <Process />
      <TechStack />
      <Testimonials />
      <Contact />
    </>
  )
}
