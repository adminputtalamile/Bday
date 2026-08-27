export interface PhotoItem {
  id: string
  src: string
  caption: string
}

export interface BirthdayData {
  recipientName: string
  senderName: string
  message: string
  specialMessage: string
  finalMessage: string
  birthdayDate: string
  photos: PhotoItem[]
  favoritePhotoId: string
  musicUrl: string
}

export const emptyBirthdayData: BirthdayData = {
  recipientName: '',
  senderName: '',
  message: '',
  specialMessage: '',
  finalMessage: '',
  birthdayDate: '',
  photos: [],
  favoritePhotoId: '',
  musicUrl: '',
}
