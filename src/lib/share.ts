import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import type { BirthdayData } from '../types'

const HASH_PREFIX = '#gift='

export function encodeBirthdayData(data: BirthdayData): string {
  return compressToEncodedURIComponent(JSON.stringify(data))
}

export function decodeBirthdayData(encoded: string): BirthdayData | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded)
    if (!json) return null
    return JSON.parse(json) as BirthdayData
  } catch {
    return null
  }
}

export function buildShareUrl(data: BirthdayData): string {
  const encoded = encodeBirthdayData(data)
  const url = new URL(window.location.href)
  url.hash = `gift=${encoded}`
  return url.toString()
}

export function readDataFromLocation(): BirthdayData | null {
  const hash = window.location.hash
  if (!hash.startsWith(HASH_PREFIX)) return null
  return decodeBirthdayData(hash.slice(HASH_PREFIX.length))
}

export function clearLocationData() {
  history.replaceState(null, '', window.location.pathname + window.location.search)
}
