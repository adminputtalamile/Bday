import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sparkles from '../../effects/Sparkles'
import BookMessage from '../BookMessage'
import { paginateMessage } from '../../../lib/paginateMessage'
import { burstConfetti } from '../../../lib/confetti'

interface HiddenMessageProps {
  message: string
  onReveal?: () => void
}

export default function HiddenMessage({ message, onReveal }: HiddenMessageProps) {
  const [revealed, setRevealed] = useState(false)
  const pages = useMemo(() => paginateMessage(message), [message])

  function reveal() {
    setRevealed(true)
    onReveal?.()
    burstConfetti()
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-void px-6 pb-32 text-center">
      <Sparkles count={30} />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.button
            key="sealed"
            onClick={reveal}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
            whileHover={{ scale: 1.03, rotate: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.6 }}
            className="glass-card glow-rose flex w-72 flex-col items-center gap-4 rounded-3xl px-8 py-12 sm:w-96"
          >
            <span className="text-5xl">💌</span>
            <span className="font-display text-lg text-ink">There's a secret message waiting</span>
            <span className="text-xs uppercase tracking-[0.25em] text-ink/50">Tap to open</span>
          </motion.button>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-xl"
          >
            <p className="mb-4 text-3xl">✨</p>
            <BookMessage pages={pages} compact />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
