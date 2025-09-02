import React from 'react'
import { getIslamicDate, getImportantIslamicDates, getDaysToRamadan } from '../lib/islamicUtils'

const IslamicCalendar: React.FC = () => {
  const importantDates = getImportantIslamicDates()
  const daysToRamadan = getDaysToRamadan()
  
  const currentDate = new Date()
  const hijriDate = getIslamicDate()

  return (
    <div className="islamic-card p-6">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Islamic Calendar</h2>
      
      {/* Current Date Display */}
      <div className="text-center mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <div className="text-lg font-medium text-gray-800 mb-1">
          {currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        <div className="text-sm text-gray-600">{hijriDate}</div>
      </div>

      {/* Ramadan Countdown */}
      {daysToRamadan > 0 && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-700">{daysToRamadan}</div>
            <div className="text-sm text-purple-600">Days until Ramadan</div>
            <div className="text-xs text-purple-500 mt-1">
              Prepare your heart and soul 🤲
            </div>
          </div>
        </div>
      )}

      {/* Important Islamic Dates */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Important Dates</h3>
        <div className="space-y-2">
          {importantDates.map((date, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <div className="font-medium text-gray-800">{date.name}</div>
                <div className="text-sm text-gray-600">{date.description}</div>
              </div>
              <div className="text-xs text-gray-500">
                📅
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Islamic Months */}
      <div>
        <h3 className="font-medium text-gray-800 mb-3">Islamic Months</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            'Muharram', 'Safar', 'Rabi\' I', 'Rabi\' II',
            'Jumada I', 'Jumada II', 'Rajab', 'Sha\'ban',
            'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
          ].map((month, index) => (
            <div 
              key={index}
              className={`p-2 rounded text-center ${
                month === 'Ramadan' 
                  ? 'bg-green-100 text-green-800 font-medium' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {month}
            </div>
          ))}
        </div>
      </div>

      {/* Islamic Quote */}
      <div className="mt-6 p-3 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-700 italic mb-1">
            "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth."
          </p>
          <p className="text-xs text-gray-600">- Quran 6:73</p>
        </div>
      </div>
    </div>
  )
}

export default IslamicCalendar