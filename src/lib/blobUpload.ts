/**
 * Uploads a file to the site's /api/upload serverless function, which
 * streams it into Vercel Blob storage and returns a public URL. Returns
 * null on any failure — including running in plain `vite dev`/`preview`
 * (no /api routes locally), no Blob store connected, or the file exceeding
 * the function's body-size limit — so callers can fall back to embedding
 * the file directly in the share link instead.
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
    const data = (await res.json()) as { url?: string }
    return data.url ?? null
  } catch (err) {
    console.error('Blob upload failed:', err)
    return null
  }
}
