import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { PhotoItem } from '../../../types'
import ContinueButton from '../ContinueButton'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

interface SlideshowProps {
  photos: PhotoItem[]
  onContinue: () => void
}

const KEN_BURNS_VARIANTS = [
  { from: { scale: 1, x: 0, y: 0 }, to: { scale: 1.18, x: -12, y: -8 } },
  { from: { scale: 1.15, x: -10, y: 6 }, to: { scale: 1, x: 6, y: -10 } },
  { from: { scale: 1.05, x: 8, y: 8 }, to: { scale: 1.22, x: -8, y: -14 } },
]

export default function Slideshow({ photos, onContinue }: SlideshowProps) {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (photos.length <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % photos.length), 4800)
    return () => clearInterval(t)
  }, [photos.length])

  const photo = photos[index]
  const kb = KEN_BURNS_VARIANTS[index % KEN_BURNS_VARIANTS.length]

  return (
    <div className="relative h-full w-full overflow-hidden bg-void">
      <AnimatePresence mode="sync">
        <motion.div
          key={photo.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        >
          <motion.img
            src={photo.src}
            alt={photo.caption || 'A cherished photo'}
            className="h-full w-full object-cover"
            initial={reduced ? false : kb.from}
            animate={reduced ? undefined : kb.to}
            transition={{ duration: 5.2, ease: 'linear' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/50" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 px-6 pb-28 text-center">
        {photo.caption && (
          <motion.p
            key={photo.id + '-cap'}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="glass-card max-w-md rounded-2xl px-6 py-3 font-script text-xl italic text-white sm:text-2xl"
          >
            “{photo.caption}”
          </motion.p>
        )}
        <div className="flex gap-1.5">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1}`}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === index ? 18 : 6, background: i === index ? '#fff' : 'rgba(255,255,255,0.4)' }}
            />
          ))}
        </div>
        <ContinueButton onClick={onContinue} label="One more surprise" />
      </div>
    </div>
  )
}
