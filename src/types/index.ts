export interface PrayerTimes {
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

export interface HabitTracker {
  id: string
  name: string
  completed: boolean
  date: string
}

export interface QuranProgress {
  surahNumber: number
  surahName: string
  versesCompleted: number
  totalVerses: number
  date: string
}

export interface DhikrCount {
  id: string
  name: string
  arabicText: string
  count: number
  target: number
  date: string
}

export interface FastingDay {
  date: string
  type: 'ramadan' | 'voluntary' | 'sunnah'
  completed: boolean
}

export interface CharityRecord {
  id: string
  amount: number
  type: 'zakat' | 'sadaqah'
  description: string
  date: string
}

export interface Dua {
  id: string
  title: string
  arabicText: string
  transliteration: string
  translation: string
  category: string
}