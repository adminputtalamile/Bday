import { useEffect, useRef, useState } from 'react'

const TARGET_VOLUME = 0.55

/**
 * Owns a single <audio> element for the whole experience. `start()` must be
 * called synchronously from a user gesture (e.g. the "Open your surprise"
 * tap) so the browser's autoplay policy allows playback to begin.
 */
export function useBackgroundMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<number | null>(null)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!src) return
    const audio = new Audio(src)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
    }
  }, [src])

  function fadeTo(target: number) {
    const audio = audioRef.current
    if (!audio) return
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
    const step = () => {
      const diff = target - audio.volume
      if (Math.abs(diff) < 0.02) {
        audio.volume = target
        return
      }
      audio.volume += diff * 0.12
      fadeRef.current = requestAnimationFrame(step)
    }
    step()
  }

  function start() {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    const result = audio.play()
    if (result && typeof result.then === 'function') {
      result
        .then(() => {
          setPlaying(true)
          fadeTo(TARGET_VOLUME)
        })
        .catch(() => setPlaying(false))
    } else {
      setPlaying(true)
      fadeTo(TARGET_VOLUME)
    }
  }

  function toggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }

  return { playing, muted, start, toggleMute }
}
