interface CompressOptions {
  maxDimension?: number
  quality?: number
}

/**
 * Downscale + re-encode an uploaded image client-side so it stays reasonably
 * sized, while still looking crisp on modern screens.
 */
async function buildCompressedCanvas(
  file: File,
  { maxDimension = 1280 }: CompressOptions,
): Promise<HTMLCanvasElement> {
  const bitmap = await loadBitmap(file)

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, width, height)

  if ('close' in bitmap) bitmap.close()

  return canvas
}

/** Compresses to a data URL, for embedding directly in the share link. */
export async function compressImage(
  file: File,
  options: CompressOptions = {},
): Promise<string> {
  const canvas = await buildCompressedCanvas(file, options)
  return canvas.toDataURL('image/jpeg', options.quality ?? 0.78)
}

/** Compresses to a Blob, for uploading to storage without a base64 round-trip. */
export async function compressImageToBlob(file: File, options: CompressOptions = {}): Promise<Blob> {
  const canvas = await buildCompressedCanvas(file, options)
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', options.quality ?? 0.78),
  )
  if (!blob) throw new Error('Could not encode image')
  return blob
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file)
    } catch {
      // fall through to <img> based loading (e.g. HEIC not supported)
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.decoding = 'async'
    const loaded = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img)
      img.onerror = reject
    })
    img.src = url
    return await loaded
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Rough size estimate in KB for a data URL string. */
export function dataUrlSizeKb(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? ''
  return Math.round((base64.length * 0.75) / 1024)
}
