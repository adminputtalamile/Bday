import { useRef, useState } from 'react'
import { inputClass } from './FormField'
import { fileToDataUrl } from '../../lib/file'
import { dataUrlSizeKb } from '../../lib/imageCompress'

interface MusicPickerProps {
  value: string
  onChange: (musicUrl: string) => void
}

type Mode = 'link' | 'upload'

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024 // 8 MB — larger files risk breaking the shareable link

export default function MusicPicker({ value, onChange }: MusicPickerProps) {
  const isUpload = value.startsWith('data:')
  const [mode, setMode] = useState<Mode>(isUpload ? 'upload' : 'link')
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  function switchMode(next: Mode) {
    if (next === mode) return
    setMode(next)
    setError('')
    setFileName('')
    onChange('')
  }

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError('')
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(
        `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — please choose something under 8 MB, or use a hosted link instead for full songs.`,
      )
      return
    }
    setBusy(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      setFileName(file.name)
      onChange(dataUrl)
    } catch {
      setError('Could not read that file — please try a different one.')
    } finally {
      setBusy(false)
    }
  }

  const uploadSizeKb = mode === 'upload' && value ? dataUrlSizeKb(value) : 0

  return (
    <div>
      <div className="mb-2 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs">
        <button
          type="button"
          onClick={() => switchMode('link')}
          className={`rounded-full px-3.5 py-1.5 transition ${
            mode === 'link' ? 'bg-white/10 text-ink' : 'text-ink/50 hover:text-ink/80'
          }`}
        >
          🔗 Paste a link
        </button>
        <button
          type="button"
          onClick={() => switchMode('upload')}
          className={`rounded-full px-3.5 py-1.5 transition ${
            mode === 'upload' ? 'bg-white/10 text-ink' : 'text-ink/50 hover:text-ink/80'
          }`}
        >
          📁 Upload MP3
        </button>
      </div>

      {mode === 'link' ? (
        <input
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/song.mp3"
          type="url"
        />
      ) : (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            hidden
            onChange={(e) => {
              handleFile(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          {value ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
              <span className="truncate text-sm text-ink/90">🎵 {fileName || 'Uploaded track'}</span>
              <div className="flex shrink-0 items-center gap-3">
                {uploadSizeKb > 0 && <span className="text-xs text-ink/40">{uploadSizeKb} KB</span>}
                <button
                  type="button"
                  onClick={() => {
                    setFileName('')
                    onChange('')
                  }}
                  className="text-xs uppercase tracking-wide text-ink/50 hover:text-ink"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="w-full rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] px-4 py-4 text-center text-sm text-ink/70 transition hover:border-[var(--color-gold-soft)]/50 hover:bg-white/[0.05] disabled:opacity-50"
            >
              {busy ? 'Reading file...' : 'Click to choose an MP3 file'}
            </button>
          )}
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-rose-deep">{error}</p>}

      <p className="mt-1.5 text-xs text-ink/40">
        {mode === 'upload'
          ? 'Best for a short clip (under ~1–2 MB) — uploaded audio is embedded directly in the share link, so larger files make it longer to open, especially on iOS. For a full song, use a hosted link instead.'
          : 'Link to a royalty-free MP3 you have rights to use.'}{' '}
        Leave blank to skip music.
      </p>
    </div>
  )
}
