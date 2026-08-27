import { motion } from 'framer-motion'
import type { PhotoItem } from '../../../types'

interface MemoryTimelineProps {
  photos: PhotoItem[]
}

export default function MemoryTimeline({ photos }: MemoryTimelineProps) {
  return (
    <div className="relative h-full w-full overflow-y-auto bg-void px-5 pb-32 pt-16 styled-scroll sm:px-10">
      <motion.h2
        initial={{ opacity: 0, y: -12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-14 text-center font-display text-3xl text-gradient-gold sm:text-4xl"
      >
        A few of our favorite memories
      </motion.h2>

      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent sm:block" />

        <div className="flex flex-col gap-14">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`relative flex flex-col items-center gap-5 sm:flex-row ${
                i % 2 === 1 ? 'sm:flex-row-reverse' : ''
              }`}
            >
              <div className="flex h-56 w-56 shrink-0 items-center justify-center overflow-hidden rounded-3xl glass-card bg-black/20 p-1.5 shadow-2xl sm:h-64 sm:w-64">
                <img
                  src={photo.src}
                  alt={photo.caption || 'A cherished memory'}
                  className="h-full w-full rounded-2xl object-contain"
                  loading="lazy"
                />
              </div>
              {photo.caption && (
                <div className="glass-card max-w-xs rounded-2xl px-5 py-4 text-center font-script text-lg italic text-ink/90 sm:text-left sm:text-xl">
                  “{photo.caption}”
                </div>
              )}
              <div className="absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-gold-soft)] shadow-[0_0_12px_3px_rgba(243,220,174,0.7)] sm:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
