import { MuteIcon, SoundIcon } from './icons'

interface SceneNavProps {
  total: number
  index: number
  onGo: (i: number) => void
  onPrev: () => void
  onNext: () => void
  hideNext?: boolean
  showMute?: boolean
  muted?: boolean
  onToggleMute?: () => void
}

export default function SceneNav({
  total,
  index,
  onGo,
  onPrev,
  onNext,
  hideNext,
  showMute,
  muted,
  onToggleMute,
}: SceneNavProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col items-center gap-3 bg-gradient-to-t from-black/60 to-transparent px-4 pb-5 pt-12">
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
      <div className="flex w-full max-w-xs items-center justify-between gap-2">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="rounded-full glass-card px-4 py-2 text-xs text-ink/80 disabled:opacity-30"
        >
          ← Previous
        </button>

        {showMute ? (
          <button
            onClick={onToggleMute}
            aria-label={muted ? 'Unmute music' : 'Mute music'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full glass-card text-ink/80 transition hover:text-ink"
          >
            {muted ? <MuteIcon /> : <SoundIcon />}
          </button>
        ) : (
          <span className="h-9 w-9 shrink-0" aria-hidden="true" />
        )}

        <button
          onClick={onNext}
          disabled={hideNext || index === total - 1}
          className="rounded-full glass-card px-4 py-2 text-xs text-ink/80 disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
