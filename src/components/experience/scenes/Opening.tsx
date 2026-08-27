import { motion } from 'framer-motion'
import ParticlesBackground from '../../effects/ParticlesBackground'
import Sparkles from '../../effects/Sparkles'
import FloatingHearts from '../../effects/FloatingHearts'

interface OpeningProps {
  recipientName: string
  senderName: string
  onBegin: () => void
}

export default function Opening({ recipientName, senderName, onBegin }: OpeningProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-void px-6 text-center">
      <ParticlesBackground />
      <Sparkles count={60} />
      <FloatingHearts count={10} />

      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.5em' }}
        animate={{ opacity: 1, letterSpacing: '0.35em' }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="mb-6 text-[11px] uppercase text-gold-soft/80 sm:text-xs"
      >
        A Private Little Surprise
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        className="font-display text-4xl leading-tight text-ink sm:text-6xl"
      >
        For <span className="text-gradient-gold italic">{recipientName || 'You'}</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="mt-5 max-w-sm font-script text-lg text-ink/70 italic sm:text-xl"
      >
        {senderName ? `Crafted with love by ${senderName}` : 'Something made just for you'}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBegin}
        className="glow-gold mt-14 rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-rose)] px-9 py-3.5 font-display text-base font-semibold text-void shadow-xl"
      >
        Open your surprise
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 text-[10px] uppercase tracking-[0.3em] text-ink/40"
      >
        Tap to begin · sound optional
      </motion.div>
    </div>
  )
}
