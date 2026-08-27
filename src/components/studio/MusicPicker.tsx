import { useRef, useState } from 'react'
import { inputClass } from './FormField'
import { fileToDataUrl } from '../../lib/file'
import { dataUrlSizeKb } from '../../lib/imageCompress'
import { uploadToBlob } from '../../lib/blobUpload'
import { isDriveDirectUrl, toDriveDirectUrl } from '../../lib/driveLink'
import { makeId } from '../../lib/id'

interface MusicPickerProps {
  value: string
  onChange: (musicUrl: string) => void
}

type Mode = 'link' | 'upload'

// Uploads go to real online storage first (any reasonable file size works
// there). Only if that's unavailable do we fall back to embedding the file
// straight into the share link's URL — and that fallback has to stay tiny,
// since there's no compression for audio the way there is for photos, and a
// large embedded file produces a URL too long to open in practice.
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024 // 20 MB — ceiling when storage is available
const MAX_EMBED_BYTES = 600 * 1024 // 600 KB — ceiling for the fallback, embedded path

export default function MusicPicker({ value, onChange }: MusicPickerProps) {
  const isUpload = value.startsWith('data:') || value.includes('.blob.vercel-storage.com')
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
        `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — please keep uploads under ${MAX_UPLOAD_BYTES / 1024 / 1024} MB, or use a hosted link instead.`,
      )
      return
    }
    setBusy(true)
    try {
      const uploaded = await uploadToBlob(file, `${makeId()}-${file.name}`)
      if (uploaded) {
        setFileName(file.name)
        onChange(uploaded)
        return
      }
      if (file.size > MAX_EMBED_BYTES) {
        setError(
          `Online storage isn't reachable right now, and this file (${(file.size / 1024).toFixed(0)} KB) is too large to embed directly in the link. Try again in a moment, keep it under ${MAX_EMBED_BYTES / 1024} KB, or paste a hosted link instead.`,
        )
        return
      }
      const dataUrl = await fileToDataUrl(file)
      setFileName(file.name)
      onChange(dataUrl)
    } catch {
      setError('Could not read that file — please try a different one.')
    } finally {
      setBusy(false)
    }
  }

  const isEmbedded = mode === 'upload' && value.startsWith('data:')
  const uploadSizeKb = isEmbedded ? dataUrlSizeKb(value) : 0

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
                <span className="text-xs text-ink/40">
                  {isEmbedded ? `${uploadSizeKb} KB embedded` : 'stored online ✓'}
                </span>
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
              {busy ? 'Uploading...' : 'Click to choose an MP3 file'}
            </button>
          )}
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-rose-deep">{error}</p>}

      {value && <AudioProbe key={value} src={value} />}

      <p className="mt-1.5 text-xs text-ink/40">
        {mode === 'upload'
          ? "Uploads go to secure online storage, so a full song is fine — it won't bloat your share link. If storage isn't reachable, it falls back to embedding directly in the link, which only works for a short clip under 600 KB."
          : 'Link to a royalty-free MP3 (or a Google Drive share link, shared as "Anyone with the link") — this is the right choice for a full song, since it keeps the share link short.'}{' '}
        Leave blank to skip music.
      </p>
    </div>
  )
}

/** Lets the sender confirm right here whether a music source actually plays, instead of finding out later. */
function AudioProbe({ src }: { src: string }) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  return (
    <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        key={src}
        controls
        preload="metadata"
        src={src}
        className="h-9 w-full"
        onCanPlay={() => setStatus('ok')}
        onError={() => setStatus('error')}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className={status === 'error' ? 'text-rose-deep' : status === 'ok' ? 'text-gold-soft/80' : 'text-ink/40'}>
          {status === 'loading' && 'Checking whether this plays…'}
          {status === 'ok' && '✓ This plays correctly'}
          {status === 'error' && "✗ Couldn't load this track"}
        </span>
        <a href={src} target="_blank" rel="noreferrer" className="text-ink/50 underline hover:text-ink">
          Open link directly ↗
        </a>
      </div>
      {status === 'error' && (
        <p className="text-xs text-rose-deep">
          For a Drive link, this almost always means the file isn't shared as "Anyone with the link" — open it in
          Drive, click Share, and set it to "Anyone with the link · Viewer". Then paste the link again. "Open link
          directly" above shows you exactly what Google is returning.
        </p>
      )}
    </div>
  )
}
