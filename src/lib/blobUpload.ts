import { upload } from '@vercel/blob/client'

/**
 * Uploads a file directly from the browser to Vercel Blob storage, using a
 * short-lived client token issued by /api/upload. The file bytes never pass
 * through our own serverless/edge function, so there's no server body-size
 * limit to hit — this works the same for a 200 KB photo or a 15 MB song.
 *
 * Returns null on any failure (no /api route available, as with plain
 * `vite dev`/`preview` locally; no Blob store connected; file rejected by
 * size or type; network error) so callers can fall back to embedding the
 * file directly in the share link instead.
 */
export async function uploadToBlob(file: Blob, filename: string): Promise<string | null> {
  try {
    const result = await upload(filename, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
      contentType: file.type || undefined,
    })
    return result.url
  } catch (err) {
    console.error('Blob upload failed:', err)
    await logServerReason(filename)
    return null
  }
}

/**
 * The SDK's own error on failure is a generic wrapper ("Failed to retrieve
 * the client token") that discards whatever our /api/upload function
 * actually said. Re-issue the same token request by hand purely to log the
 * real reason — the one place worth looking for what's actually wrong.
 */
async function logServerReason(filename: string): Promise<void> {
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        type: 'blob.generate-client-token',
        payload: { pathname: filename, callbackUrl: '', clientPayload: null, multipart: false },
      }),
    })
    const detail = await res.json().catch(() => null)
    console.error(`/api/upload responded ${res.status}:`, detail)
  } catch (err) {
    console.error('Could not even reach /api/upload:', err)
  }
}
