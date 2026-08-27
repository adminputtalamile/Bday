import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { PhotoItem } from '../../../types'

interface PhotoAlbumProps {
  photos: PhotoItem[]
  onContinue: () => void
}

const pageVariants = {
  enter: (dir: number) => ({ rotateY: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { rotateY: 0, opacity: 1 },
  exit: (dir: number) => ({ rotateY: dir > 0 ? -80 : 80, opacity: 0 }),
}

export default function PhotoAlbum({ photos, onContinue }: PhotoAlbumProps) {
  const [page, setPage] = useState(0)
  const [direction, setDirection] = useState(1)

  if (photos.length === 0) return null

  const photo = photos[page]
  const isLast = page === photos.length - 1

  function go(next: number) {
    if (next < 0 || next >= photos.length) return
    setDirection(next > page ? 1 : -1)
    setPage(next)
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-void px-6 pb-32 pt-16 text-center">
      <div className="relative w-full max-w-md" style={{ perspective: 1800 }}>
        <div className="relative" style={{ minHeight: '58vh' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={photo.id}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: direction > 0 ? 'left center' : 'right center',
              }}
              className="glass-card absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl p-4 shadow-2xl sm:p-5"
            >
              <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-xl bg-black/25">
                <img
                  src={photo.src}
                  alt={photo.caption || 'A cherished photo'}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              {photo.caption && (
                <p className="shrink-0 px-2 font-script text-lg italic text-ink/90 sm:text-xl">
                  “{photo.caption}”
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {photos.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            onClick={() => go(page - 1)}
            disabled={page === 0}
            aria-label="Previous photo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-ink/80 transition hover:bg-white/10 disabled:opacity-25"
          >
            ‹
          </button>
          <span className="text-[11px] uppercase tracking-widest text-ink/40">
            Photo {page + 1} of {photos.length}
          </span>
          <button
            onClick={() => go(page + 1)}
            disabled={isLast}
            aria-label="Next photo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-ink/80 transition hover:bg-white/10 disabled:opacity-25"
          >
            ›
          </button>
        </div>
      )}

      <AnimatePresence>
        {isLast && (
          <motion.button
            key="one-more-surprise"
            onClick={onContinue}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3 font-display text-sm tracking-wide text-ink backdrop-blur-md transition-colors hover:bg-white/10"
          >
            One more surprise
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
