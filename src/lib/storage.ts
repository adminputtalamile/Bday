import type { BirthdayData } from '../types'

const DRAFT_KEY = 'birthday-studio-draft-v1'

export function loadDraft(): BirthdayData | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as BirthdayData
  } catch {
    return null
  }
}

export function saveDraft(data: BirthdayData) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
  } catch {
    // storage full or unavailable — silently skip autosave
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    // ignore
  }
}
