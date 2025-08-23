import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Islamic calendar utilities
export function getHijriDate(): string {
  // Simple approximation - in a real app you'd use a proper Islamic calendar library
  const gregorianDate = new Date()
  const hijriYear = gregorianDate.getFullYear() - 579
  const hijriMonths = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", 
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban", 
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
  ]
  
  const month = hijriMonths[gregorianDate.getMonth()]
  const day = gregorianDate.getDate()
  
  return `${day} ${month} ${hijriYear} AH`
}

// Prayer times calculation (simplified)
export function getPrayerTimes() {
  const now = new Date()
  const prayers = [
    { name: "Fajr", time: "05:30", completed: false },
    { name: "Dhuhr", time: "12:30", completed: false },
    { name: "Asr", time: "15:45", completed: false },
    { name: "Maghrib", time: "18:15", completed: false },
    { name: "Isha", time: "19:45", completed: false },
  ]

  // Mark prayers as completed based on current time (simplified logic)
  const currentTime = now.getHours() * 100 + now.getMinutes()
  
  prayers.forEach(prayer => {
    const [hours, minutes] = prayer.time.split(':').map(Number)
    const prayerTime = hours * 100 + minutes
    prayer.completed = currentTime > prayerTime + 100 // 1 hour window
  })

  return prayers
}

// Get next prayer
export function getNextPrayer() {
  const prayers = getPrayerTimes()
  const now = new Date()
  const currentTime = now.getHours() * 100 + now.getMinutes()
  
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number)
    const prayerTime = hours * 100 + minutes
    
    if (currentTime < prayerTime) {
      return prayer
    }
  }
  
  // If no prayer left today, return first prayer of next day
  return { ...prayers[0], time: prayers[0].time + " (Tomorrow)" }
}

// Format time for display
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':')
  const hour12 = parseInt(hours) > 12 ? parseInt(hours) - 12 : parseInt(hours)
  const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM'
  return `${hour12 === 0 ? 12 : hour12}:${minutes} ${ampm}`
}