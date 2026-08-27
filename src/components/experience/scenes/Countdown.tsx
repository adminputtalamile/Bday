import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { PhotoItem } from '../../../types'
import Sparkles from '../../effects/Sparkles'

interface CountdownProps {
  photo: PhotoItem
  onReveal?: () => void
}

export default function Countdown({ photo, onReveal }: CountdownProps) {
  const [count, setCount] = useState<number | null>(3)

  useEffect(() => {
    if (count === null) return
    if (count === 0) {
      const t = setTimeout(() => {
        setCount(null)
        onReveal?.()
      }, 500)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setCount((c) => (c ?? 1) - 1), 850)
    return () => clearTimeout(t)
  }, [count, onReveal])

  const revealed = count === null

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-void px-6 pb-32 text-center">
      {!revealed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 font-display text-lg text-ink/70 sm:text-xl"
        >
          Get ready for something special
        </motion.p>
      )}

      <AnimatePresence mode="wait">
        {!revealed && count !== null && (
          <motion.span
            key={count}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: 0.5 }}
            className="font-display text-8xl text-gradient-gold sm:text-9xl"
          >
            {count === 0 ? '✨' : count}
          </motion.span>
        )}
      </AnimatePresence>

      {revealed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(16px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative"
        >
          <Sparkles count={40} />
          <div className="glow-gold h-72 w-56 overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl sm:h-96 sm:w-72">
            <img src={photo.src} alt={photo.caption || 'A special surprise'} className="h-full w-full object-cover" />
          </div>
          {photo.caption && (
            <p className="mt-6 font-script text-xl italic text-ink/90">“{photo.caption}”</p>
          )}
        </motion.div>
      )}
    </div>
  )
}
