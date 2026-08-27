import { useEffect, useRef, useState } from 'react'

interface MusicPlayerProps {
  src: string
}

const TARGET_VOLUME = 0.55

export default function MusicPlayer({ src }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const fadeRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
    }
  }, [])

  function fadeTo(target: number, onDone?: () => void) {
    const audio = audioRef.current
    if (!audio) return
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
    const step = () => {
      const diff = target - audio.volume
      if (Math.abs(diff) < 0.02) {
        audio.volume = target
        onDone?.()
        return
      }
      audio.volume += diff * 0.12
      fadeRef.current = requestAnimationFrame(step)
    }
    step()
  }

  async function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      fadeTo(0, () => audio.pause())
      setPlaying(false)
    } else {
      audio.volume = 0
      try {
        await audio.play()
        setPlaying(true)
        fadeTo(TARGET_VOLUME)
      } catch {
        setPlaying(false)
      }
    }
  }

  function toggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }

  if (!src) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full glass-card px-3 py-2 shadow-lg">
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-ink transition hover:bg-white/20 active:scale-95"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-ink transition hover:bg-white/20 active:scale-95"
      >
        {muted ? <MuteIcon /> : <SoundIcon />}
      </button>
      <span className="hidden pr-1 text-xs text-ink/70 sm:inline">
        {playing ? 'Now playing' : 'Play music'}
      </span>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  )
}
function SoundIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 9v6h4l5 5V4L8 9H4z" />
    </svg>
  )
}
function MuteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 9v6h4l5 5V4L8 9H4zm11.5 3L18 9.5 19.5 11 17 13.5 19.5 16 18 17.5 15.5 15 13 17.5 11.5 16 14 13.5 11.5 11 13 9.5z" />
    </svg>
  )
}
