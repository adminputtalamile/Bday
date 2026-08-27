import { put } from '@vercel/blob'

// Edge runtime (not the default Node serverless runtime) so the request body
// streams straight through to Blob storage instead of being buffered subject
// to the ~4.5 MB Node function body-size ceiling — needed for full photos and
// songs, not just short clips.
export const config = { runtime: 'edge' }

const MAX_BYTES = 20 * 1024 * 1024 // 20 MB per file

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')
  if (!filename) {
    return json({ error: 'Missing filename' }, 400)
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (contentLength > MAX_BYTES) {
    return json({ error: `File too large — the limit is ${MAX_BYTES / 1024 / 1024} MB.` }, 413)
  }

  if (!request.body) {
    return json({ error: 'Empty request body' }, 400)
  }

  try {
    const blob = await put(`gifts/${filename}`, request.body, {
      access: 'public',
      addRandomSuffix: true,
      contentType: request.headers.get('content-type') || undefined,
    })
    return json(blob, 200)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    return json({ error: message }, 500)
  }
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}
