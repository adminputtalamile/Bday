import { motion } from 'framer-motion'
import FloatingHearts from '../../effects/FloatingHearts'
import ContinueButton from '../ContinueButton'

interface GreetingProps {
  recipientName: string
  message: string
  onContinue: () => void
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045 },
  },
}

const word = {
  hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5 } },
}

export default function Greeting({ recipientName, message, onContinue }: GreetingProps) {
  const words = (message || 'Wishing you a day as wonderful as you are.').split(' ')
  const totalDelay = 0.6 + words.length * 0.045

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-void px-6 text-center sm:px-16">
      <FloatingHearts count={8} />
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="font-script text-2xl italic text-gold-soft sm:text-3xl"
      >
        Dear {recipientName || 'you'},
      </motion.p>

      <motion.p
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-8 max-w-2xl font-display text-2xl leading-relaxed text-ink sm:text-4xl"
      >
        {words.map((w, i) => (
          <motion.span key={i} variants={word} className="mr-2 inline-block">
            {w}
          </motion.span>
        ))}
      </motion.p>

      <ContinueButton onClick={onContinue} delay={totalDelay} />
    </div>
  )
}
