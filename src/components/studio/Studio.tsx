import type { BirthdayData } from '../../types'
import PersonalizationForm from './PersonalizationForm'
import PhotoManager from './PhotoManager'
import ShareBar from './ShareBar'
import ParticlesBackground from '../effects/ParticlesBackground'

interface StudioProps {
  data: BirthdayData
  onChange: (patch: Partial<BirthdayData>) => void
  onPreview: () => void
}

export default function Studio({ data, onChange, onPreview }: StudioProps) {
  return (
    <div className="relative min-h-screen bg-void px-4 pb-32 pt-10 sm:px-8 sm:pb-36 sm:pt-16">
      <ParticlesBackground className="fixed" />

      <div className="relative mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-soft/70">Birthday Surprise Studio</p>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-5xl">
            Craft a moment they'll <span className="text-gradient-gold italic">never forget</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-ink/60">
            Upload your favorite photos, write from the heart, and turn it into a cinematic birthday experience —
            no design skills required.
          </p>
        </header>

        <section className="glass-card rounded-3xl p-5 sm:p-8">
          <h2 className="mb-5 font-display text-xl text-ink">1. The details</h2>
          <PersonalizationForm data={data} onChange={onChange} />
        </section>

        <section className="glass-card mt-6 rounded-3xl p-5 sm:p-8">
          <h2 className="mb-5 font-display text-xl text-ink">2. Your photos</h2>
          <PhotoManager
            photos={data.photos}
            favoriteId={data.favoritePhotoId}
            onChange={(photos) => onChange({ photos })}
            onSetFavorite={(favoritePhotoId) => onChange({ favoritePhotoId })}
          />
        </section>

        <ShareBar data={data} onPreview={onPreview} />

        <footer className="mt-10 text-center text-xs text-ink/30">
          Your draft is saved privately in this browser only — nothing leaves your device until you share the link.
        </footer>
      </div>
    </div>
  )
}
