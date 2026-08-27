import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface BookMessageProps {
  pages: string[]
  compact?: boolean
}

const pageVariants = {
  enter: (dir: number) => ({ rotateY: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { rotateY: 0, opacity: 1 },
  exit: (dir: number) => ({ rotateY: dir > 0 ? -80 : 80, opacity: 0 }),
}

export default function BookMessage({ pages, compact = false }: BookMessageProps) {
  const [page, setPage] = useState(0)
  const [direction, setDirection] = useState(1)

  if (pages.length === 0) return null

  function go(next: number) {
    if (next < 0 || next >= pages.length) return
    setDirection(next > page ? 1 : -1)
    setPage(next)
  }

  return (
    <div className={`relative w-full ${compact ? 'max-w-md' : 'max-w-2xl'}`}>
      <div
        className="relative"
        style={{ perspective: 1800, minHeight: compact ? 140 : 200 }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: direction > 0 ? 'left center' : 'right center',
            }}
            className="glass-card flex items-center justify-center rounded-2xl px-6 py-8 shadow-2xl sm:px-10 sm:py-10"
          >
            <p
              className={`text-center font-display leading-relaxed whitespace-pre-line text-ink ${
                compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
              }`}
            >
              {pages[page]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {pages.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            onClick={() => go(page - 1)}
            disabled={page === 0}
            aria-label="Previous page"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-ink/80 transition hover:bg-white/10 disabled:opacity-25"
          >
            ‹
          </button>
          <span className="text-[11px] uppercase tracking-widest text-ink/40">
            Page {page + 1} of {pages.length}
          </span>
          <button
            onClick={() => go(page + 1)}
            disabled={page === pages.length - 1}
            aria-label="Next page"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-ink/80 transition hover:bg-white/10 disabled:opacity-25"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
