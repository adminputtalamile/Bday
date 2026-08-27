import { useRef, useState } from 'react'
import { inputClass } from './FormField'
import { fileToDataUrl } from '../../lib/file'
import { dataUrlSizeKb } from '../../lib/imageCompress'
import { isDriveDirectUrl, toDriveDirectUrl } from '../../lib/driveLink'

interface MusicPickerProps {
  value: string
  onChange: (musicUrl: string) => void
}

type Mode = 'link' | 'upload'

// Uploaded audio is base64-encoded straight into the share link's URL, with no
// compression possible for audio the way photos get compressed. Anything much
// bigger than this produces a URL long enough to fail to open in practice —
// this is deliberately sized for a short sound bite, not a song.
const MAX_UPLOAD_BYTES = 600 * 1024 // 600 KB

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
        `That file is ${(file.size / 1024).toFixed(0)} KB — please keep uploads under ${Math.round(MAX_UPLOAD_BYTES / 1024)} KB (a short clip, not a full song), or use a hosted link instead.`,
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
        <>
          <input
            className={inputClass}
            value={value}
            onChange={(e) => {
              const pasted = e.target.value
              onChange(toDriveDirectUrl(pasted) ?? pasted)
            }}
            placeholder="https://example.com/song.mp3 or a Google Drive share link"
            type="url"
          />
          {isDriveDirectUrl(value) && (
            <p className="mt-1.5 text-xs text-gold-soft/80">
              ✓ Converted your Google Drive link to a direct-playback URL. Make sure that file is shared as
              "Anyone with the link" in Drive, or it won't play for the recipient.
            </p>
          )}
        </>
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
          ? 'For a short sound bite only (a few seconds, under 600 KB) — uploaded audio is embedded directly in the share link, and a full song will make the link too long to open. For a full song, paste a hosted link instead.'
          : 'Link to a royalty-free MP3 (or a Google Drive share link, shared as "Anyone with the link") — this is the right choice for a full song, since it keeps the share link short.'}{' '}
        Leave blank to skip music.
      </p>
    </div>
  )
}
