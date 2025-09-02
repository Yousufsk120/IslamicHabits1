import React, { useState } from 'react'
import { FastingDay } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'

const FASTING_TYPES = [
  { value: 'ramadan', label: 'Ramadan', color: 'green' },
  { value: 'voluntary', label: 'Voluntary (Nafl)', color: 'blue' },
  { value: 'sunnah', label: 'Sunnah (Recommended)', color: 'purple' }
] as const

const FastingTracker: React.FC = () => {
  const [fastingDays, setFastingDays] = useLocalStorage<FastingDay[]>('fasting-days', [])
  const [selectedType, setSelectedType] = useState<'ramadan' | 'voluntary' | 'sunnah'>('voluntary')
  
  const today = new Date().toDateString()
  const todayFasting = fastingDays.find(day => day.date === today)
  const thisMonthFasting = fastingDays.filter(day => {
    const dayDate = new Date(day.date)
    const currentDate = new Date()
    return dayDate.getMonth() === currentDate.getMonth() && 
           dayDate.getFullYear() === currentDate.getFullYear()
  })

  const toggleFasting = () => {
    if (todayFasting) {
      // Toggle completion status or remove if it was incomplete
      if (todayFasting.completed) {
        setFastingDays(prev => prev.filter(day => day.date !== today))
      } else {
        setFastingDays(prev => 
          prev.map(day => 
            day.date === today 
              ? { ...day, completed: true }
              : day
          )
        )
      }
    } else {
      // Add new fasting day
      const newFastingDay: FastingDay = {
        date: today,
        type: selectedType,
        completed: false
      }
      setFastingDays(prev => [...prev, newFastingDay])
    }
  }

  const completeFasting = () => {
    if (todayFasting && !todayFasting.completed) {
      setFastingDays(prev => 
        prev.map(day => 
          day.date === today 
            ? { ...day, completed: true }
            : day
        )
      )
    }
  }

  const completedFasts = fastingDays.filter(day => day.completed).length
  const currentStreak = calculateCurrentStreak()

  function calculateCurrentStreak(): number {
    const sortedDays = [...fastingDays]
      .filter(day => day.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    for (const day of sortedDays) {
      const dayDate = new Date(day.date)
      dayDate.setHours(0, 0, 0, 0)
      
      const diffTime = currentDate.getTime() - dayDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      
      if (diffDays === streak) {
        streak++
        currentDate = dayDate
      } else {
        break
      }
    }
    
    return streak
  }

  return (
    <div className="islamic-card p-6">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Fasting Tracker</h2>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">{completedFasts}</div>
          <div className="text-sm text-blue-600">Total Fasts</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-700">{currentStreak}</div>
          <div className="text-sm text-purple-600">Current Streak</div>
        </div>
      </div>

      {/* Today's Fasting Status */}
      <div className="mb-6 p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-800">Today's Fast</h3>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString()}
          </div>
        </div>
        
        {todayFasting ? (
          <div className={`p-3 rounded-lg ${
            todayFasting.completed 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium capitalize">
                  {todayFasting.type} Fast
                </div>
                <div className="text-sm text-gray-600">
                  Status: {todayFasting.completed ? '✅ Completed' : '⏳ In Progress'}
                </div>
              </div>
              {!todayFasting.completed && (
                <button
                  onClick={completeFasting}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fasting Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as 'ramadan' | 'voluntary' | 'sunnah')}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                {FASTING_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={toggleFasting}
              className="w-full islamic-button"
            >
              Start Fasting Today
            </button>
          </div>
        )}
      </div>

      {/* This Month's Fasting */}
      {thisMonthFasting.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium text-gray-800 mb-3">This Month</h3>
          <div className="space-y-2">
            {thisMonthFasting.slice(-5).map((day, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    day.completed ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <span className="text-sm">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-gray-600 capitalize">
                  {day.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivation */}
      <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-700 italic">
            "O you who believe! Fasting is prescribed for you as it was prescribed for those before you, that you may become righteous."
          </p>
          <p className="text-xs text-gray-600 mt-1">- Quran 2:183</p>
        </div>
      </div>
    </div>
  )
}

export default FastingTracker