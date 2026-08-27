import { useMemo } from 'react'
import { motion } from 'framer-motion'
import FloatingHearts from '../../effects/FloatingHearts'
import BookMessage from '../BookMessage'
import { paginateMessage } from '../../../lib/paginateMessage'

interface GreetingProps {
  recipientName: string
  message: string
}

export default function Greeting({ recipientName, message }: GreetingProps) {
  const pages = useMemo(
    () => paginateMessage(message || 'Wishing you a day as wonderful as you are.'),
    [message],
  )

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-void px-6 pb-32 text-center sm:px-16">
      <FloatingHearts count={8} />
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="mb-8 font-script text-2xl italic text-gold-soft sm:text-3xl"
      >
        Dear {recipientName || 'you'},
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <BookMessage pages={pages} />
      </motion.div>
    </div>
  )
}
