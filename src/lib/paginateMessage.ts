const MAX_PAGE_CHARS = 260

/**
 * Splits a message into short "book pages" so long text never overflows a
 * single screen. Explicit blank-line paragraphs each get their own page;
 * a paragraph with no breaks that's still long is folded into sentence-sized
 * chunks instead.
 */
export function paginateMessage(text: string): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []

  const explicitParagraphs = trimmed
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const blocks =
    explicitParagraphs.length > 1
      ? explicitParagraphs
      : trimmed
          .split(/\n/)
          .map((p) => p.trim())
          .filter(Boolean)

  const pages: string[] = []
  for (const block of blocks.length ? blocks : [trimmed]) {
    if (block.length <= MAX_PAGE_CHARS) {
      pages.push(block)
      continue
    }
    const sentences = block.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) ?? [block]
    let current = ''
    for (const sentence of sentences) {
      if (current && (current + sentence).length > MAX_PAGE_CHARS) {
        pages.push(current.trim())
        current = sentence
      } else {
        current += sentence
      }
    }
    if (current.trim()) pages.push(current.trim())
  }

  return pages.length ? pages : [trimmed]
}
