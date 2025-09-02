import React, { useState } from 'react'
import { QuranProgress } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'

const SURAHS = [
  { number: 1, name: 'Al-Fatihah', verses: 7 },
  { number: 2, name: 'Al-Baqarah', verses: 286 },
  { number: 3, name: 'Ali-Imran', verses: 200 },
  { number: 4, name: 'An-Nisa', verses: 176 },
  { number: 5, name: 'Al-Maidah', verses: 120 },
  // Add more surahs as needed - this is a simplified list
]

const QuranTracker: React.FC = () => {
  const today = new Date().toDateString()
  const [todayProgress, setTodayProgress] = useLocalStorage<QuranProgress[]>(`quran-${today}`, [])
  const [totalProgress, setTotalProgress] = useLocalStorage<QuranProgress[]>('quran-total', [])
  
  const [selectedSurah, setSelectedSurah] = useState(SURAHS[0])
  const [versesRead, setVersesRead] = useState(1)

  const addProgress = () => {
    const newProgress: QuranProgress = {
      surahNumber: selectedSurah.number,
      surahName: selectedSurah.name,
      versesCompleted: versesRead,
      totalVerses: selectedSurah.verses,
      date: today
    }

    // Update today's progress
    setTodayProgress(prev => {
      const existing = prev.find(p => p.surahNumber === selectedSurah.number)
      if (existing) {
        return prev.map(p => 
          p.surahNumber === selectedSurah.number 
            ? { ...p, versesCompleted: Math.min(p.versesCompleted + versesRead, selectedSurah.verses) }
            : p
        )
      }
      return [...prev, newProgress]
    })

    // Update total progress
    setTotalProgress(prev => {
      const existing = prev.find(p => p.surahNumber === selectedSurah.number)
      if (existing) {
        return prev.map(p => 
          p.surahNumber === selectedSurah.number 
            ? { ...p, versesCompleted: Math.min(p.versesCompleted + versesRead, selectedSurah.verses) }
            : p
        )
      }
      return [...prev, newProgress]
    })

    // Reset form
    setVersesRead(1)
  }

  const todayTotal = todayProgress.reduce((sum, progress) => sum + progress.versesCompleted, 0)
  const allTimeTotal = totalProgress.reduce((sum, progress) => sum + progress.versesCompleted, 0)

  return (
    <div className="islamic-card p-6">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Quran Reading Tracker</h2>
      
      {/* Daily Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-700">{todayTotal}</div>
          <div className="text-sm text-green-600">Verses Today</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">{allTimeTotal}</div>
          <div className="text-sm text-blue-600">Total Verses</div>
        </div>
      </div>

      {/* Add Reading Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Surah
          </label>
          <select
            value={selectedSurah.number}
            onChange={(e) => {
              const surah = SURAHS.find(s => s.number === parseInt(e.target.value))
              if (surah) setSelectedSurah(surah)
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            {SURAHS.map(surah => (
              <option key={surah.number} value={surah.number}>
                {surah.number}. {surah.name} ({surah.verses} verses)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verses Read
          </label>
          <input
            type="number"
            min="1"
            max={selectedSurah.verses}
            value={versesRead}
            onChange={(e) => setVersesRead(parseInt(e.target.value) || 1)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <button
          onClick={addProgress}
          className="w-full islamic-button"
        >
          Add Reading Progress
        </button>
      </div>

      {/* Today's Progress */}
      {todayProgress.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Today's Reading</h3>
          <div className="space-y-2">
            {todayProgress.map((progress, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">{progress.surahName}</span>
                <span className="text-sm font-medium">
                  {progress.versesCompleted}/{progress.totalVerses} verses
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivation */}
      <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-700 italic">
            "And We have certainly made the Quran easy for remembrance, so is there any who will remember?"
          </p>
          <p className="text-xs text-gray-600 mt-1">- Quran 54:17</p>
        </div>
      </div>
    </div>
  )
}

export default QuranTracker