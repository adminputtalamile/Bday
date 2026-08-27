import { useRef, useState } from 'react'
import type { DragEvent } from 'react'
import type { PhotoItem } from '../../types'
import { compressImage, dataUrlSizeKb } from '../../lib/imageCompress'
import { makeId } from '../../lib/id'

interface PhotoManagerProps {
  photos: PhotoItem[]
  favoriteId: string
  onChange: (photos: PhotoItem[]) => void
  onSetFavorite: (id: string) => void
}

export default function PhotoManager({ photos, favoriteId, onChange, onSetFavorite }: PhotoManagerProps) {
  const [busy, setBusy] = useState(0)
  const [dragOverZone, setDragOverZone] = useState(false)
  const dragIndex = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const replaceIndex = useRef<number | null>(null)

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (files.length === 0) return

    setBusy((b) => b + files.length)
    try {
      if (replaceIndex.current !== null) {
        const i = replaceIndex.current
        replaceIndex.current = null
        const src = await compressImage(files[0])
        const next = [...photos]
        next[i] = { ...next[i], src }
        onChange(next)
      } else {
        const results = await Promise.allSettled(files.map((f) => compressImage(f)))
        const added: PhotoItem[] = []
        for (const r of results) {
          if (r.status === 'fulfilled') added.push({ id: makeId(), src: r.value, caption: '' })
        }
        if (added.length > 0) onChange([...photos, ...added])
      }
    } finally {
      setBusy((b) => Math.max(0, b - files.length))
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOverZone(false)
    handleFiles(e.dataTransfer.files)
  }

  function removeAt(i: number) {
    const next = photos.filter((_, idx) => idx !== i)
    onChange(next)
  }

  function updateCaption(i: number, caption: string) {
    const next = [...photos]
    next[i] = { ...next[i], caption }
    onChange(next)
  }

  function reorder(from: number, to: number) {
    if (from === to) return
    const next = [...photos]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOverZone(true)
        }}
        onDragLeave={() => setDragOverZone(false)}
        onDrop={onDrop}
        onClick={() => {
          replaceIndex.current = null
          inputRef.current?.click()
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragOverZone ? 'border-[var(--color-gold-soft)] bg-white/[0.06]' : 'border-white/15 bg-white/[0.02]'
        }`}
      >
        <span className="text-3xl">📸</span>
        <p className="mt-3 font-display text-sm text-ink/90">Drop photos here, or click to browse</p>
        <p className="mt-1 text-xs text-ink/40">
          JPG or PNG · optimized automatically {busy > 0 && `· processing ${busy}...`}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              draggable
              onDragStart={() => (dragIndex.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (dragIndex.current !== null) reorder(dragIndex.current, i)
                dragIndex.current = null
              }}
              className="group relative flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2"
            >
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-black/20">
                <img src={photo.src} alt="" className="max-h-full max-w-full object-contain" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-1.5">
                  <button
                    title="Set as finale photo"
                    onClick={() => onSetFavorite(photo.id)}
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs backdrop-blur-md transition ${
                      favoriteId === photo.id ? 'bg-[var(--color-gold-soft)] text-void' : 'bg-black/40 text-white/80'
                    }`}
                  >
                    ★
                  </button>
                  <button
                    title="Remove photo"
                    onClick={() => removeAt(i)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-xs text-white/80 backdrop-blur-md transition hover:bg-red-500/70"
                  >
                    ×
                  </button>
                </div>
                <button
                  title="Replace photo"
                  onClick={() => {
                    replaceIndex.current = i
                    inputRef.current?.click()
                  }}
                  className="absolute inset-x-1.5 bottom-1.5 rounded-full bg-black/50 py-1 text-[10px] uppercase tracking-wide text-white/80 opacity-0 backdrop-blur-md transition group-hover:opacity-100"
                >
                  Replace
                </button>
              </div>
              <input
                value={photo.caption}
                onChange={(e) => updateCaption(i, e.target.value)}
                placeholder="Add a memory or caption..."
                maxLength={140}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-xs text-ink placeholder:text-ink/30 outline-none focus:border-[var(--color-gold-soft)]/50"
              />
              <span className="pointer-events-none absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-void text-[10px] text-ink/50 ring-1 ring-white/10">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}
      {photos.length > 0 && (
        <p className="text-xs text-ink/40">
          Drag a photo to reorder · total size ~
          {Math.round(photos.reduce((sum, p) => sum + dataUrlSizeKb(p.src), 0) / 1024)} MB · the ★ photo is saved
          for the countdown surprise and finale — it won't appear in the photo album
        </p>
      )}
    </div>
  )
}
