import type { BirthdayData } from '../types'
import { uploadToBlob } from './blobUpload'
import { makeId } from './id'

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/mp4': 'm4a',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/ogg': 'ogg',
  'audio/aac': 'aac',
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl)
  return res.blob()
}

async function migrateOne(dataUrl: string): Promise<string | null> {
  const blob = await dataUrlToBlob(dataUrl)
  const extension = EXTENSION_BY_MIME[blob.type] ?? 'bin'
  return uploadToBlob(blob, `${makeId()}.${extension}`)
}

export interface MigrationResult {
  data: BirthdayData
  migrated: number
  failed: number
}

export function hasEmbeddedMedia(data: BirthdayData): boolean {
  return data.photos.some((p) => p.src.startsWith('data:')) || data.musicUrl.startsWith('data:')
}

/**
 * Finds any photo/music already embedded as a data URL (from before storage
 * was available, or from a failed upload) and pushes it to Blob storage
 * using the bytes already sitting in the browser — no need to re-pick files.
 */
export async function migrateEmbeddedMedia(data: BirthdayData): Promise<MigrationResult> {
  let migrated = 0
  let failed = 0

  const photos = await Promise.all(
    data.photos.map(async (photo) => {
      if (!photo.src.startsWith('data:')) return photo
      try {
        const uploaded = await migrateOne(photo.src)
        if (uploaded) {
          migrated++
          return { ...photo, src: uploaded }
        }
        failed++
        return photo
      } catch {
        failed++
        return photo
      }
    }),
  )

  let musicUrl = data.musicUrl
  if (musicUrl.startsWith('data:')) {
    try {
      const uploaded = await migrateOne(musicUrl)
      if (uploaded) {
        migrated++
        musicUrl = uploaded
      } else {
        failed++
      }
    } catch {
      failed++
    }
  }

  return { data: { ...data, photos, musicUrl }, migrated, failed }
}
