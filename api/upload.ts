import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'

// This route only ever exchanges a small JSON token — the actual file bytes
// go straight from the browser to Blob storage, never through this function.
// It must run on the Node.js runtime (the default — no `edge` config here):
// handleUpload() talks to Vercel's Blob API via undici, which pulls in Node
// built-ins (stream, crypto, net, tls, ...) that Edge Runtime doesn't support.

const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/wav',
  'audio/x-wav',
  'audio/ogg',
  'audio/aac',
]

const MAX_BYTES = 25 * 1024 * 1024 // 25 MB

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const body = request.body as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        addRandomSuffix: true,
        maximumSizeInBytes: MAX_BYTES,
      }),
    })

    response.status(200).json(jsonResponse)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    response.status(400).json({ error: message })
  }
}
