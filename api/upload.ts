import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'

// This route only ever exchanges a small JSON token — the actual file bytes
// go straight from the browser to Blob storage, never through this function.
// That sidesteps serverless/edge request body-size limits entirely, which is
// what made large audio uploads unreliable with the previous direct-upload
// approach.
export const config = { runtime: 'edge' }

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

export default async function handler(request: Request): Promise<Response> {
  const body = (await request.json()) as HandleUploadBody

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

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  }
}
