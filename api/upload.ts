import { put } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'

// Runs on Vercel's default Node.js runtime. The browser POSTs the raw file
// body directly here (no separate client-token exchange), and this streams
// it straight into Blob storage via put() — the same pattern as Vercel's own
// documented quickstart. put() also works with either a static
// BLOB_READ_WRITE_TOKEN or Vercel's newer OIDC-based store connection
// automatically, unlike the client-upload token flow this replaces.
//
// access is 'private' because this store is configured for private-only
// blobs (it rejects `access: 'public'` outright) — see api/view.ts, which
// serves these back out through our own server so recipients don't need any
// credentials themselves.
export const config = {
  api: { bodyParser: false },
}

// Comfortably under Vercel's ~4.5 MB request body limit for Node functions.
const MAX_BYTES = 4 * 1024 * 1024

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  const filename = request.query.filename
  if (typeof filename !== 'string' || !filename) {
    response.status(400).json({ error: 'Missing filename' })
    return
  }

  const contentLength = Number(request.headers['content-length'] ?? '0')
  if (contentLength > MAX_BYTES) {
    response.status(413).json({ error: `File too large — the limit is ${MAX_BYTES / 1024 / 1024} MB.` })
    return
  }

  try {
    const blob = await put(`gifts/${filename}`, request, {
      access: 'private',
      addRandomSuffix: true,
      contentType: request.headers['content-type'] || undefined,
    })
    response.status(200).json(blob)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    response.status(500).json({ error: message })
  }
}
