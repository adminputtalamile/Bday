import { useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface FloatingHeartsProps {
  count?: number
  className?: string
}

const GLYPHS = ['♥', '❤', '✦']

function makeHearts(count: number) {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    size: 10 + Math.random() * 22,
    duration: 9 + Math.random() * 10,
    delay: Math.random() * 10,
    drift: (Math.random() - 0.5) * 80,
    glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
    opacity: 0.25 + Math.random() * 0.5,
  }))
}

export default function FloatingHearts({ count = 14, className = '' }: FloatingHeartsProps) {
  const reduced = useReducedMotion()
  const [hearts] = useState(() => makeHearts(count))

  if (reduced) return null

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 select-none text-rose-300"
          style={{ left: `${h.left}%`, fontSize: h.size, opacity: h.opacity }}
          initial={{ y: '10vh', x: 0, opacity: 0 }}
          animate={{ y: '-110vh', x: h.drift, opacity: [0, h.opacity, h.opacity, 0] }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {h.glyph}
        </motion.span>
      ))}
    </div>
  )
}
