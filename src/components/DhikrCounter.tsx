import React, { useState } from 'react'
import { DhikrCount } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'

const DHIKR_OPTIONS = [
  {
    id: 'subhanallah',
    name: 'SubhanAllah',
    arabicText: 'سُبْحَانَ اللَّهِ',
    defaultTarget: 33
  },
  {
    id: 'alhamdulillah',
    name: 'Alhamdulillah',
    arabicText: 'الْحَمْدُ لِلَّهِ',
    defaultTarget: 33
  },
  {
    id: 'allahu-akbar',
    name: 'Allahu Akbar',
    arabicText: 'اللَّهُ أَكْبَرُ',
    defaultTarget: 34
  },
  {
    id: 'la-hawla',
    name: 'La Hawla wa la Quwwata illa Billah',
    arabicText: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    defaultTarget: 100
  },
  {
    id: 'istighfar',
    name: 'Astaghfirullah',
    arabicText: 'أَسْتَغْفِرُ اللَّهَ',
    defaultTarget: 100
  }
]

const DhikrCounter: React.FC = () => {
  const today = new Date().toDateString()
  const [dhikrCounts, setDhikrCounts] = useLocalStorage<DhikrCount[]>(`dhikr-${today}`, [])
  const [selectedDhikr, setSelectedDhikr] = useState(DHIKR_OPTIONS[0])

  const getCurrentCount = (dhikrId: string) => {
    const existing = dhikrCounts.find(d => d.id === dhikrId)
    return existing ? existing.count : 0
  }

  const incrementCount = (dhikrId: string) => {
    const dhikrOption = DHIKR_OPTIONS.find(d => d.id === dhikrId)
    if (!dhikrOption) return

    setDhikrCounts(prev => {
      const existing = prev.find(d => d.id === dhikrId)
      
      if (existing) {
        return prev.map(d => 
          d.id === dhikrId 
            ? { ...d, count: d.count + 1 }
            : d
        )
      } else {
        return [...prev, {
          id: dhikrId,
          name: dhikrOption.name,
          arabicText: dhikrOption.arabicText,
          count: 1,
          target: dhikrOption.defaultTarget,
          date: today
        }]
      }
    })
  }

  const resetCount = (dhikrId: string) => {
    setDhikrCounts(prev => prev.filter(d => d.id !== dhikrId))
  }

  const totalDhikrToday = dhikrCounts.reduce((sum, dhikr) => sum + dhikr.count, 0)
  const currentCount = getCurrentCount(selectedDhikr.id)
  const progressPercentage = (currentCount / selectedDhikr.defaultTarget) * 100

  return (
    <div className="islamic-card p-6">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Dhikr Counter</h2>
      
      {/* Daily Total */}
      <div className="text-center mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <div className="text-3xl font-bold text-green-700">{totalDhikrToday}</div>
        <div className="text-sm text-gray-600">Total Dhikr Today</div>
      </div>

      {/* Dhikr Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Dhikr
        </label>
        <select
          value={selectedDhikr.id}
          onChange={(e) => {
            const dhikr = DHIKR_OPTIONS.find(d => d.id === e.target.value)
            if (dhikr) setSelectedDhikr(dhikr)
          }}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        >
          {DHIKR_OPTIONS.map(dhikr => (
            <option key={dhikr.id} value={dhikr.id}>
              {dhikr.name}
            </option>
          ))}
        </select>
      </div>

      {/* Current Dhikr Display */}
      <div className="text-center mb-6 p-4 border border-green-200 rounded-lg">
        <div className="arabic-text text-2xl mb-2 text-green-800">
          {selectedDhikr.arabicText}
        </div>
        <div className="text-sm text-gray-600 mb-3">{selectedDhikr.name}</div>
        
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{currentCount}/{selectedDhikr.defaultTarget}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Counter Display */}
        <div className="text-4xl font-bold text-green-700 mb-4">
          {currentCount}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => incrementCount(selectedDhikr.id)}
            className="flex-1 islamic-button text-lg py-3"
          >
            + Count
          </button>
          <button
            onClick={() => resetCount(selectedDhikr.id)}
            className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Completion Status */}
      {currentCount >= selectedDhikr.defaultTarget && (
        <div className="p-3 bg-green-100 border border-green-200 rounded-lg text-center">
          <div className="text-green-800 font-medium">Masha'Allah! ✨</div>
          <div className="text-sm text-green-600">Target completed for {selectedDhikr.name}</div>
        </div>
      )}

      {/* Today's Summary */}
      {dhikrCounts.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-800 mb-2">Today's Dhikr</h3>
          <div className="space-y-1">
            {dhikrCounts.map((dhikr) => (
              <div key={dhikr.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                <span>{dhikr.name}</span>
                <span className="font-medium">{dhikr.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DhikrCounter