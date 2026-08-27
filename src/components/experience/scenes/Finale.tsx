import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { PhotoItem } from '../../../types'
import ParticlesBackground from '../../effects/ParticlesBackground'
import Sparkles from '../../effects/Sparkles'
import FloatingHearts from '../../effects/FloatingHearts'
import { grandFinaleConfetti } from '../../../lib/confetti'

interface FinaleProps {
  recipientName: string
  senderName: string
  finalMessage: string
  photo?: PhotoItem
  onRestart: () => void
}

export default function Finale({ recipientName, senderName, finalMessage, photo, onRestart }: FinaleProps) {
  useEffect(() => {
    const t = setTimeout(() => grandFinaleConfetti(), 900)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-void px-6 py-16 text-center">
      <ParticlesBackground />
      <Sparkles count={70} />
      <FloatingHearts count={18} />

      {photo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="glow-rose mb-8 h-40 w-40 overflow-hidden rounded-full border-4 border-white/20 shadow-2xl sm:h-52 sm:w-52"
        >
          <img src={photo.src} alt="" className="h-full w-full object-cover" />
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, delay: 0.3 }}
        className="font-display text-4xl leading-tight text-ink sm:text-6xl"
      >
        Happy Birthday,
        <br />
        <span className="text-gradient-gold italic">{recipientName || 'You'}</span> ❤️
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="mx-auto mt-8 max-w-xl font-script text-xl italic leading-relaxed text-ink/90 sm:text-2xl"
      >
        {finalMessage}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="mt-8 font-display text-sm uppercase tracking-[0.3em] text-gold-soft/80"
      >
        With love, {senderName || 'someone who adores you'}
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
        className="mt-12 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-xs uppercase tracking-widest text-ink/70 backdrop-blur-md transition hover:bg-white/10"
      >
        Watch it again
      </motion.button>
    </div>
  )
}
