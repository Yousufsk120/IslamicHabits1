import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { getHijriDate } from './lib/utils'
import PrayerTracker from './components/PrayerTracker'
import HabitTracker from './components/HabitTracker'
import IslamicCalendar from './components/IslamicCalendar'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="islamic-gradient islamic-pattern text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Islamic Habits</h1>
              <p className="text-lg opacity-90">Your companion for Islamic practices</p>
              <p className="text-sm opacity-75 mt-1">{getHijriDate()}</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prayer Tracker - Takes full width on mobile, 2 cols on large screens */}
          <div className="lg:col-span-2">
            <PrayerTracker />
          </div>

          {/* Islamic Calendar */}
          <div>
            <IslamicCalendar />
          </div>

          {/* Habit Tracker - Full width on all screens */}
          <div className="lg:col-span-3">
            <HabitTracker />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-slate-800 dark:bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">May Allah accept our good deeds</p>
            <p className="text-sm opacity-75">
              "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose." 
              - Quran 65:3
            </p>
            <div className="mt-4 text-xs opacity-60">
              <p>Islamic Habits Tracker - Built with React & Tailwind CSS</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App