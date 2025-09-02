import React from 'react'
import { PrayerTimes } from '../types'
import { formatTime } from '../lib/islamicUtils'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface PrayerTrackerProps {
  prayerTimes?: PrayerTimes
}

interface PrayerStatus {
  [key: string]: boolean
}

const PrayerTracker: React.FC<PrayerTrackerProps> = ({ prayerTimes }) => {
  const today = new Date().toDateString()
  const [prayerStatus, setPrayerStatus] = useLocalStorage<PrayerStatus>(`prayers-${today}`, {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false
  })

  const togglePrayer = (prayer: string) => {
    setPrayerStatus(prev => ({
      ...prev,
      [prayer]: !prev[prayer]
    }))
  }

  const completedPrayers = Object.values(prayerStatus).filter(Boolean).length
  const progressPercentage = (completedPrayers / 5) * 100

  if (!prayerTimes) {
    return (
      <div className="islamic-card p-6">
        <h2 className="text-xl font-semibold mb-4 text-green-800">Prayer Tracker</h2>
        <p className="text-gray-500">Loading prayer times...</p>
      </div>
    )
  }

  return (
    <div className="islamic-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-green-800">Prayer Tracker</h2>
        <div className="text-sm text-gray-600">
          {completedPrayers}/5 completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Daily Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Prayer List */}
      <div className="space-y-3">
        {Object.entries(prayerTimes).map(([prayer, time]) => {
          if (prayer === 'sunrise') return null // Skip sunrise as it's not a prayer
          
          const isCompleted = prayerStatus[prayer]
          
          return (
            <div
              key={prayer}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-gray-50 border-gray-200 hover:border-green-200'
              }`}
              onClick={() => togglePrayer(prayer)}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-300'
                  }`}
                >
                  {isCompleted && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-medium capitalize">{prayer}</div>
                  <div className="text-sm text-gray-500">
                    {formatTime(time)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Completion Message */}
      {completedPrayers === 5 && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg text-center">
          <div className="text-green-800 font-medium">Alhamdulillah! 🤲</div>
          <div className="text-sm text-green-600">All prayers completed today</div>
        </div>
      )}
    </div>
  )
}

export default PrayerTracker