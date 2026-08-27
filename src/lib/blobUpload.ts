/**
 * Uploads a file to the site's /api/upload serverless function, which stores
 * it in Vercel Blob storage and returns a public URL. Returns null on any
 * failure — including running in plain `vite dev` (no /api routes locally)
 * or a deployment without Blob storage configured — so callers can fall back
 * to embedding the file directly in the share link instead.
 */
export async function uploadToBlob(file: Blob, filename: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
      body: file,
      headers: { 'content-type': file.type || 'application/octet-stream' },
    })
    if (!res.ok) return null
    const data = (await res.json()) as { url?: string }
    return data.url ?? null
  } catch {
    return null
  }
}
