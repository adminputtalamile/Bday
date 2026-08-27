import { useMemo, useState } from 'react'
import type { BirthdayData } from '../../types'
import { buildShareUrl } from '../../lib/share'
import { hasEmbeddedMedia, migrateEmbeddedMedia } from '../../lib/migrateToBlob'

interface ShareBarProps {
  data: BirthdayData
  onChange: (patch: Partial<BirthdayData>) => void
  onPreview: () => void
}

// Everything (photos, an uploaded audio clip) lives inside the share link's
// URL, so an oversized link is a hard failure, not just a slow load — most
// browsers and messaging apps won't reliably open a URL past a few hundred
// thousand characters. These thresholds keep links well inside that margin.
const WARN_LIMIT_CHARS = 300_000
const HARD_LIMIT_CHARS = 700_000

export default function ShareBar({ data, onChange, onPreview }: ShareBarProps) {
  const [copied, setCopied] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [migrationNote, setMigrationNote] = useState('')

  const canGenerate = data.recipientName.trim() && data.photos.length > 0 && data.message.trim()
  const shareUrl = useMemo(() => (canGenerate ? buildShareUrl(data) : ''), [canGenerate, data])
  const linkChars = shareUrl.length
  const approxMb = linkChars / 1_000_000
  const tooLarge = linkChars > HARD_LIMIT_CHARS
  const large = linkChars > WARN_LIMIT_CHARS
  const canCopy = canGenerate && !tooLarge
  const embedded = hasEmbeddedMedia(data)

  async function copyLink() {
    setShowLink(true)
    if (!canCopy) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable — the visible input still lets them copy manually
    }
  }

  async function runMigration() {
    setMigrating(true)
    setMigrationNote('')
    try {
      const result = await migrateEmbeddedMedia(data)
      onChange(result.data)
      if (result.migrated === 0 && result.failed > 0) {
        setMigrationNote(
          "Couldn't reach online storage — nothing was moved. Open the browser console for the real error, or check that Blob storage is connected to this deployment.",
        )
      } else if (result.failed > 0) {
        setMigrationNote(`Moved ${result.migrated} file${result.migrated === 1 ? '' : 's'} online, ${result.failed} still failed — try again in a moment.`)
      } else {
        setMigrationNote(`Moved ${result.migrated} file${result.migrated === 1 ? '' : 's'} to online storage ✓`)
      }
    } finally {
      setMigrating(false)
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[var(--color-void)]/90 px-4 py-4 backdrop-blur-xl sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg text-ink">Ready to send the surprise?</h3>
          <p className="mt-1 text-xs text-ink/50">
            {canGenerate
              ? 'Preview it yourself, then generate a private link to share.'
              : 'Add a recipient name, a message, and at least one photo to continue.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onPreview}
            disabled={!canGenerate}
            className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 font-display text-sm text-ink transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Preview experience
          </button>
          <button
            onClick={copyLink}
            disabled={!canGenerate}
            className="glow-gold rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-rose)] px-5 py-2.5 font-display text-sm font-semibold text-void transition disabled:cursor-not-allowed disabled:opacity-30"
          >
            {copied ? 'Link copied ✓' : 'Copy share link'}
          </button>
        </div>
      </div>

      {canGenerate && embedded && (
        <div className="mx-auto mt-4 max-w-3xl rounded-xl border border-gold-soft/30 bg-white/[0.03] px-3 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-ink/60">
              Some photos or music are still embedded directly in the link instead of stored online.
            </p>
            <button
              onClick={runMigration}
              disabled={migrating}
              className="shrink-0 rounded-full border border-gold-soft/40 bg-gold-soft/10 px-4 py-1.5 text-xs font-medium text-gold-soft transition hover:bg-gold-soft/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {migrating ? 'Moving files…' : 'Move to online storage'}
            </button>
          </div>
          {migrationNote && <p className="mt-2 text-[11px] text-ink/50">{migrationNote}</p>}
        </div>
      )}

      {showLink && canGenerate && (
        <div className="mx-auto mt-4 max-w-3xl space-y-1.5">
          {tooLarge ? (
            <p className="rounded-xl border border-rose-deep/40 bg-rose-deep/10 px-3 py-2.5 text-xs text-rose-deep">
              This link is too large to share reliably (~{approxMb.toFixed(1)} MB) — it won't be copied. Remove a
              few photos, or switch any uploaded music to a hosted link instead of an upload, then try again.
            </p>
          ) : (
            <input
              readOnly
              value={shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-ink/80 outline-none"
            />
          )}
          <p className={`text-[11px] ${large ? 'text-rose-deep' : 'text-ink/40'}`}>
            ~{approxMb < 0.1 ? `${Math.round(linkChars / 1000)} KB` : `${approxMb.toFixed(2)} MB`} link · names,
            messages, and any media stored online stay tiny — size here comes only from photos or music still
            embedded directly (see above if any are)
            {large && !tooLarge && ' — getting large, consider trimming a little'}
          </p>
        </div>
      )}
    </div>
  )
}
