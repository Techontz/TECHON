import { cn } from '@/lib/utils'

/**
 * An abstract product interface, drawn entirely in the design system.
 *
 * It stands in for a real screenshot until one exists. Built from the same
 * tokens as the rest of the site rather than as an image, so it stays crisp at
 * any density, weighs nothing, and cannot drift from the palette. Every label
 * is generic on purpose — this is a composition, not a claim about a shipped
 * feature.
 */
export function ProductMockup({ className }: { className?: string }) {
  return (
    <div className={cn('flex bg-white', className)} aria-hidden>
      {/* Sidebar */}
      <div className="hidden w-[168px] shrink-0 flex-col gap-1 border-r border-line bg-surface/60 p-3 sm:flex">
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="size-5 rounded-[6px] bg-brand" />
          <span className="h-2 w-14 rounded-full bg-line-strong" />
        </div>

        <div className="mt-3 space-y-1">
          {[true, false, false, false, false].map((active, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-2 rounded-[6px] px-2 py-2',
                active && 'bg-white shadow-xs',
              )}
            >
              <span
                className={cn('size-3.5 rounded-[4px]', active ? 'bg-brand' : 'bg-line-strong')}
              />
              <span
                className="h-1.5 rounded-full bg-line-strong"
                style={{ width: `${58 - index * 6}px` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main panel */}
      <div className="min-w-0 flex-1 p-4 sm:p-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1.5">
            <span className="block h-2.5 w-24 rounded-full bg-ink/70" />
            <span className="block h-1.5 w-16 rounded-full bg-line-strong" />
          </div>
          <span className="h-7 w-20 rounded-[6px] bg-brand" />
        </div>

        {/* Metric row */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { value: '94%', bar: '78%' },
            { value: '1.2s', bar: '46%' },
            { value: '32', bar: '62%' },
          ].map((metric, index) => (
            <div key={index} className="rounded-[8px] border border-line p-2.5 sm:p-3">
              <span className="block h-1.5 w-10 rounded-full bg-line-strong" />
              <p className="mt-2 text-[0.9375rem] font-semibold tracking-tight text-ink tabular-nums sm:text-base">
                {metric.value}
              </p>
              <div className="mt-2 h-1 rounded-full bg-surface">
                <div
                  className={cn('h-full rounded-full', index === 0 ? 'bg-brand' : 'bg-line-strong')}
                  style={{ width: metric.bar }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="mt-3 rounded-[8px] border border-line p-3 sm:mt-4 sm:p-4">
          <div className="flex items-end justify-between gap-1.5 sm:gap-2">
            {[32, 46, 38, 58, 44, 68, 52, 74, 62, 84, 70, 92].map((height, index) => (
              <div
                key={index}
                className={cn(
                  'flex-1 rounded-t-[3px]',
                  index >= 10 ? 'bg-brand' : 'bg-line-strong/70',
                )}
                style={{ height: `${height * 0.6}px` }}
              />
            ))}
          </div>
        </div>

        {/* Activity list */}
        <div className="mt-3 hidden space-y-2 sm:block">
          {[68, 52, 60].map((width, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-[8px] border border-line px-3 py-2.5"
            >
              <span className="size-6 shrink-0 rounded-full bg-surface" />
              <span className="h-1.5 rounded-full bg-line-strong" style={{ width: `${width}%` }} />
              <span className="ml-auto h-4 w-12 shrink-0 rounded-[4px] bg-brand-wash" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
