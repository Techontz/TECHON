// Plain next/link, not the locale-aware one — no locale has been resolved at
// this point, so there is nothing to prefix the href with.
import Link from 'next/link'

import './globals.css'

/**
 * Global fallback for requests that never reach a locale segment.
 *
 * The locale layout is the root layout for this app, so anything outside it —
 * an unmatched top-level path — has no html/body of its own and must supply
 * them here. Copy is English-only because no locale has been resolved yet.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="font-sans">
        <main className="flex min-h-screen items-center justify-center px-6 text-center">
          <div>
            <p className="text-[3rem] font-semibold tracking-tight text-[#D8D8DC]">404</p>
            <h1 className="mt-4 text-[1.75rem] font-semibold tracking-tight text-[#111111]">
              This page does not exist.
            </h1>
            <p className="mt-3 text-[1.0625rem] text-[#555555]">
              The link may be outdated, or the page has moved.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex h-11 items-center rounded-[8px] bg-[#7B19BC] px-5 text-[0.9375rem] font-medium text-white"
            >
              Back to home
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
