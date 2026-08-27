import { motion } from 'framer-motion'

interface ContinueButtonProps {
  onClick: () => void
  label?: string
  delay?: number
}

export default function ContinueButton({ onClick, label = 'Continue', delay = 0 }: ContinueButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="group relative mt-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3 font-display text-sm tracking-wide text-ink backdrop-blur-md transition-colors hover:bg-white/10"
    >
      {label}
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </motion.button>
  )
}
