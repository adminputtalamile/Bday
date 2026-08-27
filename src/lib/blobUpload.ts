/**
 * Uploads a file to the site's /api/upload serverless function, which
 * streams it into (private) Vercel Blob storage and returns a same-origin
 * URL — /api/view?pathname=... — that serves it back out through our own
 * server, since a private blob can't be loaded directly without credentials
 * the recipient doesn't have.
 *
 * Returns null on any failure — including running in plain `vite
 * dev`/`preview` (no /api routes locally), no Blob store connected, or the
 * file exceeding the function's body-size limit — so callers can fall back
 * to embedding the file directly in the share link instead.
 */
export async function uploadToBlob(file: Blob, filename: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
      body: file,
      headers: { 'content-type': file.type || 'application/octet-stream' },
    })
    if (!res.ok) {
      const detail = await res.json().catch(() => null)
      console.error(`/api/upload responded ${res.status}: ${JSON.stringify(detail)}`)
      return null
    }
    const data = (await res.json()) as { pathname?: string }
    if (!data.pathname) return null
    return `/api/view?pathname=${encodeURIComponent(data.pathname)}`
  } catch (err) {
    console.error('Blob upload failed:', err)
    return null
  }
}
