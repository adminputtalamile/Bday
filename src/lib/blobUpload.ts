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
    return null
  }
}
