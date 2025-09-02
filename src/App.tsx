import { useState, useEffect } from 'react'

interface PrayerTime {
  name: string;
  time: string;
}

function App() {
  const [count, setCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [islamicDate, setIslamicDate] = useState('')
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])
  const [dailyQuote, setDailyQuote] = useState('')
  const [qiblaDirection, setQiblaDirection] = useState(0)

  // Islamic quotes collection
  const islamicQuotes = [
    "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose. (Quran 65:3)",
    "And Allah is the best of planners. (Quran 8:30)",
    "Verily, with hardship comes ease. (Quran 94:6)",
    "And whoever fears Allah - He will make for him a way out. (Quran 65:2)",
    "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth. (Quran 6:73)",
    "Indeed, Allah will not change the condition of a people until they change what is in themselves. (Quran 13:11)",
    "And give good tidings to the patient, Who, when disaster strikes them, say, 'Indeed we belong to Allah, and indeed to Him we will return.' (Quran 2:155-156)"
  ]

  // Function to get Islamic date (Hijri)
  const getIslamicDate = () => {
    const today = new Date()
    // Simple Hijri calculation (approximation)
    const hijriYear = Math.floor((today.getFullYear() - 622) * 1.030684)
    const hijriMonths = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal',
      'Jumada al-Thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ]
    const month = hijriMonths[today.getMonth()]
    const day = today.getDate()
    return `${day} ${month} ${hijriYear + 622} AH`
  }

  // Function to calculate prayer times (simplified version)
  const calculatePrayerTimes = () => {
    const prayers: PrayerTime[] = [
      { name: 'Fajr', time: '5:30 AM' },
      { name: 'Dhuhr', time: '12:30 PM' },
      { name: 'Asr', time: '3:45 PM' },
      { name: 'Maghrib', time: '6:15 PM' },
      { name: 'Isha', time: '7:45 PM' }
    ]
    return prayers
  }

  // Function to get daily quote
  const getDailyQuote = () => {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    return islamicQuotes[dayOfYear % islamicQuotes.length]
  }

  // Function to calculate Qibla direction (simplified - pointing towards Mecca)
  const calculateQiblaDirection = () => {
    // This is a simplified calculation - in reality, this would use user's location
    // and calculate the bearing to Mecca (21.4225° N, 39.8262° E)
    return 45 // Simplified direction
  }

  useEffect(() => {
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Initialize Islamic features
    setIslamicDate(getIslamicDate())
    setPrayerTimes(calculatePrayerTimes())
    setDailyQuote(getDailyQuote())
    setQiblaDirection(calculateQiblaDirection())

    return () => clearInterval(timeInterval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">Islamic Habits & Utilities</h1>
        
        {/* Islamic Date and Time */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <p className="text-lg text-green-700 font-medium">{islamicDate}</p>
            <p className="text-xl text-gray-700 mt-2">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Prayer Times */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">🕌 Prayer Times</h3>
            <div className="space-y-3">
              {prayerTimes.map((prayer, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">{prayer.name}</span>
                  <span className="text-green-600 font-semibold">{prayer.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Qibla Direction */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">🧭 Qibla Direction</h3>
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 border-4 border-green-200 rounded-full relative">
                  <div 
                    className="absolute top-1 left-1/2 w-1 h-8 bg-green-600 origin-bottom transform -translate-x-1/2"
                    style={{ transform: `translateX(-50%) rotate(${qiblaDirection}deg)` }}
                  />
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-800 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              <p className="text-green-600 font-semibold">{qiblaDirection}° NE</p>
              <p className="text-sm text-gray-600">Direction to Mecca</p>
            </div>
          </div>

          {/* Habit Tracker */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">📊 Daily Habits</h3>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Dhikr Counter</p>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  onClick={() => setCount((count) => count + 1)}
                >
                  Count: {count}
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>✅ Fajr Prayer</p>
                <p>✅ Morning Dhikr</p>
                <p>⏳ Quran Reading</p>
                <p>⏳ Evening Dhikr</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Islamic Quote */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">📖 Daily Inspiration</h3>
          <div className="text-center">
            <p className="text-gray-700 italic text-lg leading-relaxed">"{dailyQuote}"</p>
          </div>
        </div>

        {/* Islamic Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl mb-2">📿</div>
            <p className="text-sm font-medium text-gray-700">99 Names</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl mb-2">🌙</div>
            <p className="text-sm font-medium text-gray-700">Ramadan</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl mb-2">📚</div>
            <p className="text-sm font-medium text-gray-700">Quran</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl mb-2">🕋</div>
            <p className="text-sm font-medium text-gray-700">Hajj Info</p>
          </div>
        </div>
        
        <footer className="text-center text-green-700">
          <p className="text-sm">Built with Vite + React + Tailwind | Islamic Utilities & Habit Tracker</p>
        </footer>
      </div>
    </div>
  )
}

export default App