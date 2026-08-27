import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { BirthdayData } from '../../types'
import Opening from './scenes/Opening'
import Greeting from './scenes/Greeting'
import MemoryTimeline from './scenes/MemoryTimeline'
import PhotoAlbum from './scenes/PhotoAlbum'
import HiddenMessage from './scenes/HiddenMessage'
import Countdown from './scenes/Countdown'
import Finale from './scenes/Finale'
import SceneNav from './SceneNav'
import { useBackgroundMusic } from '../../hooks/useBackgroundMusic'

type SceneKey = 'opening' | 'greeting' | 'timeline' | 'album' | 'hidden' | 'countdown' | 'finale'

interface ExperienceProps {
  data: BirthdayData
  topAction?: { label: string; onClick: () => void }
}

export default function Experience({ data, topAction }: ExperienceProps) {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [runId, setRunId] = useState(0)
  const [hiddenRevealed, setHiddenRevealed] = useState(false)
  const [countdownRevealed, setCountdownRevealed] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const music = useBackgroundMusic(data.musicUrl)

  const captionedPhotos = useMemo(() => data.photos.filter((p) => p.caption?.trim()), [data.photos])
  const favoritePhoto =
    data.photos.find((p) => p.id === data.favoritePhotoId) || data.photos[data.photos.length - 1]

  const scenes = useMemo(() => {
    const list: SceneKey[] = ['greeting']
    if (captionedPhotos.length > 0) list.push('timeline')
    if (data.photos.length > 0) list.push('album')
    if (data.specialMessage.trim()) list.push('hidden')
    if (data.photos.length > 0) list.push('countdown')
    list.push('finale')
    return list
  }, [captionedPhotos.length, data.photos.length, data.specialMessage])

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(scenes.length - 1, i))
      const target = scenes[clamped]
      if (target !== 'hidden') setHiddenRevealed(false)
      if (target !== 'countdown') setCountdownRevealed(false)
      setIndex(clamped)
    },
    [scenes],
  )
  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  function handleRestart() {
    setIndex(0)
    setHiddenRevealed(false)
    setCountdownRevealed(false)
    setRunId((r) => r + 1)
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 60) (delta < 0 ? next : prev)()
    touchStartX.current = null
  }

  const current = scenes[index]

  if (!started) {
    return (
      <div key={runId} className="fixed inset-0">
        <Opening
          recipientName={data.recipientName}
          senderName={data.senderName}
          onBegin={() => {
            music.start()
            setStarted(true)
          }}
        />
        {topAction && <TopAction {...topAction} />}
      </div>
    )
  }

  return (
    <div
      key={runId}
      className="fixed inset-0 select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {current === 'greeting' && <Greeting recipientName={data.recipientName} message={data.message} />}
          {current === 'timeline' && <MemoryTimeline photos={captionedPhotos} />}
          {current === 'album' && <PhotoAlbum photos={data.photos} onContinue={next} />}
          {current === 'hidden' && (
            <HiddenMessage message={data.specialMessage} onReveal={() => setHiddenRevealed(true)} />
          )}
          {current === 'countdown' && favoritePhoto && (
            <Countdown photo={favoritePhoto} onReveal={() => setCountdownRevealed(true)} />
          )}
          {current === 'finale' && (
            <Finale
              recipientName={data.recipientName}
              senderName={data.senderName}
              finalMessage={data.message}
              photo={favoritePhoto}
              onRestart={handleRestart}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <SceneNav
        total={scenes.length}
        index={index}
        onGo={goTo}
        onPrev={prev}
        onNext={next}
        hideNext={
          (current === 'hidden' && !hiddenRevealed) || (current === 'countdown' && !countdownRevealed)
        }
        showMute={Boolean(data.musicUrl)}
        muted={music.muted}
        onToggleMute={music.toggleMute}
      />

      {topAction && <TopAction {...topAction} />}
    </div>
  )
}

function TopAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed left-4 top-4 z-50 rounded-full glass-card px-3 py-1.5 text-[11px] uppercase tracking-widest text-ink/60 transition hover:text-ink"
    >
      {label}
    </button>
  )
}
