import React, { useState, useEffect } from 'react'
import { getIslamicDate, calculatePrayerTimes, getNextPrayer, formatTime } from '../lib/islamicUtils'
import { PrayerTimes } from '../types'
import PrayerTracker from './PrayerTracker'
import QuranTracker from './QuranTracker'
import DhikrCounter from './DhikrCounter'
import IslamicCalendar from './IslamicCalendar'
import FastingTracker from './FastingTracker'
import CharityTracker from './CharityTracker'
import DuaCollection from './DuaCollection'

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>()

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Calculate prayer times
    setPrayerTimes(calculatePrayerTimes())

    return () => clearInterval(timer)
  }, [])

  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="islamic-gradient text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Islamic Habits Tracker</h1>
              <p className="text-green-100">
                Assalamu Alaikum! Today is {getIslamicDate()}
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-center">
              <div className="text-2xl font-mono">
                {currentTime.toLocaleTimeString()}
              </div>
              {nextPrayer && (
                <div className="text-sm text-green-100 mt-1">
                  Next: {nextPrayer.name} at {formatTime(nextPrayer.time)}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Prayer Tracker */}
          <div className="lg:col-span-1">
            <PrayerTracker prayerTimes={prayerTimes} />
          </div>

          {/* Quran Tracker */}
          <div className="lg:col-span-1">
            <QuranTracker />
          </div>

          {/* Dhikr Counter */}
          <div className="lg:col-span-1">
            <DhikrCounter />
          </div>

          {/* Islamic Calendar */}
          <div className="lg:col-span-1">
            <IslamicCalendar />
          </div>

          {/* Fasting Tracker */}
          <div className="lg:col-span-1">
            <FastingTracker />
          </div>

          {/* Charity Tracker */}
          <div className="lg:col-span-1">
            <CharityTracker />
          </div>

          {/* Dua Collection */}
          <div className="lg:col-span-2 xl:col-span-3">
            <DuaCollection />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-12">
        <p className="text-sm">
          May Allah bless your journey in developing good Islamic habits • 
          <span className="arabic-text mr-2">بارك الله فيكم</span>
        </p>
      </footer>
    </div>
  )
}

export default Dashboard