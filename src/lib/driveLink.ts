const FILE_ID_PATTERN = /(?:\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]{10,})/

/**
 * Converts a Google Drive "share" link (the one the Drive UI's Share button
 * copies) into Drive's direct-content URL, which an <audio> tag can actually
 * play. Returns null for anything that isn't a recognizable Drive file link.
 *
 * The file must be shared as "Anyone with the link" — Drive still requires
 * sign-in for anything more restricted, link or no link.
 */
export function toDriveDirectUrl(url: string): string | null {
  if (!/drive\.google\.com/i.test(url)) return null
  const match = url.match(FILE_ID_PATTERN)
  if (!match) return null
  return `https://drive.google.com/uc?export=download&id=${match[1]}`
}

export function isDriveDirectUrl(url: string): boolean {
  return /drive\.google\.com\/uc\?/i.test(url)
}
