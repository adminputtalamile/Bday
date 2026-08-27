import { useMemo, useState } from 'react'
import type { BirthdayData } from '../../types'
import { buildShareUrl } from '../../lib/share'

interface ShareBarProps {
  data: BirthdayData
  onPreview: () => void
}

export default function ShareBar({ data, onPreview }: ShareBarProps) {
  const [copied, setCopied] = useState(false)
  const [showLink, setShowLink] = useState(false)

  const canGenerate = data.recipientName.trim() && data.photos.length > 0 && data.message.trim()
  const shareUrl = useMemo(() => (canGenerate ? buildShareUrl(data) : ''), [canGenerate, data])
  const sizeKb = useMemo(() => Math.round((shareUrl.length * 2) / 1024), [shareUrl])

  async function copyLink() {
    setShowLink(true)
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable — the visible input still lets them copy manually
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

      {showLink && shareUrl && (
        <div className="mx-auto mt-4 max-w-3xl space-y-1.5">
          <input
            readOnly
            value={shareUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-ink/80 outline-none"
          />
          <p className="text-[11px] text-ink/40">
            ~{sizeKb.toLocaleString()} KB link · everything is embedded, nothing is uploaded to a server · fewer or
            smaller photos keep the link snappier to open
          </p>
        </div>
      )}
    </div>
  )
}
