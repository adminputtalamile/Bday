interface SceneNavProps {
  total: number
  index: number
  onGo: (i: number) => void
  onPrev: () => void
  onNext: () => void
  hideNext?: boolean
}

export default function SceneNav({ total, index, onGo, onPrev, onNext, hideNext }: SceneNavProps) {
  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex flex-col items-center gap-3 px-4">
      <div className="flex items-center gap-2">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => onGo(i)}
            aria-label={`Go to step ${i + 1}`}
            aria-current={i === index}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === index ? 22 : 7,
              background: i === index ? 'var(--color-gold-soft)' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>
      <div className="flex w-full max-w-xs items-center justify-between sm:hidden">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="rounded-full glass-card px-4 py-2 text-xs text-ink/80 disabled:opacity-30"
        >
          ← Back
        </button>
        {!hideNext && (
          <button
            onClick={onNext}
            disabled={index === total - 1}
            className="rounded-full glass-card px-4 py-2 text-xs text-ink/80 disabled:opacity-30"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
