import { get } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Readable } from 'node:stream'

// The store only allows private blobs, so recipients (who have no
// credentials of their own) can't load them directly. This route fetches a
// private blob using our server's credentials and streams the bytes back —
// the same proxy pattern as Vercel's own quickstart example.
export default async function handler(request: VercelRequest, response: VercelResponse) {
  const pathname = request.query.pathname
  if (typeof pathname !== 'string' || !pathname) {
    response.status(400).json({ error: 'Missing pathname' })
    return
  }

  try {
    const result = await get(pathname, { access: 'private' })
    if (!result || result.statusCode !== 200) {
      response.status(404).json({ error: 'Not found' })
      return
    }
    response.setHeader('Content-Type', result.blob.contentType)
    response.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    // TS's DOM lib and Node's stream/web types disagree on ReadableStream's
    // generic constraints even though they're compatible at runtime.
    Readable.fromWeb(result.stream as import('node:stream/web').ReadableStream<Uint8Array>).pipe(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch file'
    response.status(500).json({ error: message })
  }
}
