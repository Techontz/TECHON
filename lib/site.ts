/**
 * Single source of truth for company details.
 *
 * Every phone number, address and handle on the site resolves from here —
 * update this file and the header, footer, contact section, About page and
 * structured data all follow.
 */

export const site = {
  name: 'TechOn',
  legalName: 'TechOn Software Company',
  url: 'https://techontz.com',
  founded: '2019',

  contact: {
    email: 'contact@techontz.com',

    /**
     * Numbers are stored in two forms deliberately: `display` is what a human
     * reads, `e164` is what `tel:` and WhatsApp links require — neither
     * tolerates the other's formatting.
     */
    phones: [
      { display: '+255 769 190 100', e164: '+255769190100', regionKey: 'tanzania' },
      { display: '+1 281 743 5166', e164: '+12817435166', regionKey: 'unitedStates' },
    ],

    /** WhatsApp reaches the Tanzanian line. Digits only — wa.me rejects punctuation. */
    whatsapp: '255769190100',

    /** Our own booking page. Kept here so every CTA resolves from one place. */
    consultation: '/book',
  },

  offices: [
    { city: 'Dar es Salaam', country: 'Tanzania', code: 'TZ' },
    { city: 'Nairobi', country: 'Kenya', code: 'KE' },
    { city: 'Houston', country: 'United States', code: 'US' },
  ],

  socials: [
    { label: 'GitHub', href: 'https://github.com/techontz' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/tech_ontz' },
    { label: 'X', href: 'https://x.com/techontz' },
    { label: 'Instagram', href: 'https://instagram.com/tech_ontz' },
    { label: 'TikTok', href: 'https://tiktok.com/tech_ontz' },
  ],

  logo: {
    /**
     * The dark lockup, since the site is light throughout. Intrinsic size is
     * the source file's own 3264×1508 — next/image needs the true ratio to
     * reserve the right box, and it downscales to the rendered height.
     */
    src: '/techon.png',
    width: 3264,
    height: 1508,
  },
} as const

/** The number used wherever a single primary contact is needed. */
export const primaryPhone = site.contact.phones[0]

/** Prefilled WhatsApp deep link, so the first message is never a blank thread. */
export function whatsappLink(message = "Hi TechOn — I'd like to discuss a project.") {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`
}

export function mailtoLink(subject = 'Project enquiry') {
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}`
}

export function telLink(e164: string) {
  return `tel:${e164}`
}
