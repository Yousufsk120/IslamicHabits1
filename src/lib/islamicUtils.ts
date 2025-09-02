import { PrayerTimes } from '../types'

// Islamic months for Hijri calendar
export const ISLAMIC_MONTHS = [
  'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
  'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
  'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
]

// Prayer names
export const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

// Get current date in Islamic format (approximate)
export function getIslamicDate(): string {
  const now = new Date()
  // Simple approximation - in a real app, use a proper Islamic calendar library
  const islamicYear = Math.floor((now.getFullYear() - 622) * 1.030684) + 1
  const month = (now.getMonth() + 1) % 12
  return `${now.getDate()} ${ISLAMIC_MONTHS[month]} ${islamicYear} AH`
}

// Calculate prayer times (simplified calculation for demo)
export function calculatePrayerTimes(): PrayerTimes {
  // Simplified prayer time calculation (in real app, use proper calculation)
  return {
    fajr: '05:30',
    sunrise: '06:45',
    dhuhr: '12:15',
    asr: '15:45',
    maghrib: '18:30',
    isha: '20:00'
  }
}

// Get next prayer time
export function getNextPrayer(prayerTimes: PrayerTimes): { name: string; time: string } {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha }
  ]
  
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number)
    const prayerTime = hours * 60 + minutes
    
    if (prayerTime > currentTime) {
      return prayer
    }
  }
  
  // If no prayer found for today, return Fajr of tomorrow
  return prayers[0]
}

// Get Islamic important dates (simplified)
export function getImportantIslamicDates() {
  return [
    { name: 'Laylat al-Qadr', description: 'Night of Power' },
    { name: 'Eid al-Fitr', description: 'Festival of Breaking the Fast' },
    { name: 'Eid al-Adha', description: 'Festival of Sacrifice' },
    { name: 'Ashura', description: '10th of Muharram' },
    { name: 'Mawlid', description: 'Prophet\'s Birthday' }
  ]
}

// Format time for display
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

// Get remaining days for Ramadan (simplified)
export function getDaysToRamadan(): number {
  // This is a simplified calculation - in real app, use proper Islamic calendar
  const now = new Date()
  const currentYear = now.getFullYear()
  
  // Approximate Ramadan start date (varies each year)
  const ramadanStart = new Date(currentYear, 2, 23) // March 23 as example
  const diffTime = ramadanStart.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays > 0 ? diffDays : 0
}