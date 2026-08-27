import { useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface SparklesProps {
  count?: number
  className?: string
}

function makeDots(count: number) {
  return Array.from({ length: count }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 1 + Math.random() * 2,
    duration: 2 + Math.random() * 4,
    delay: Math.random() * 5,
  }))
}

export default function Sparkles({ count = 40, className = '' }: SparklesProps) {
  const reduced = useReducedMotion()
  const [dots] = useState(() => makeDots(count))

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[var(--color-gold-soft)]"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            opacity: reduced ? 0.5 : undefined,
            animation: reduced ? undefined : `twinkle ${d.duration}s ease-in-out ${d.delay}s infinite`,
            boxShadow: '0 0 6px 1px rgba(243,220,174,0.8)',
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
