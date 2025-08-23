import { Calendar, Moon } from 'lucide-react'
import { getHijriDate } from '../lib/utils'

export default function IslamicCalendar() {
  const today = new Date()
  const gregorianDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  const importantDates = [
    { name: "Laylat al-Qadr", description: "Night of Power", upcoming: true },
    { name: "Eid al-Fitr", description: "Festival of Breaking the Fast", upcoming: true },
    { name: "Hajj Season", description: "Pilgrimage to Mecca", upcoming: false },
    { name: "Eid al-Adha", description: "Festival of Sacrifice", upcoming: false },
  ]

  return (
    <div className="prayer-time-card">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Islamic Calendar
        </h2>
      </div>

      {/* Current Date */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-1">
            {getHijriDate()}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {gregorianDate}
          </div>
        </div>
      </div>

      {/* Moon Phase */}
      <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg mb-6">
        <Moon className="h-8 w-8 text-slate-600 dark:text-slate-400" />
        <div>
          <div className="font-semibold text-slate-800 dark:text-slate-100">
            Current Moon Phase
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Waxing Crescent
          </div>
        </div>
      </div>

      {/* Important Islamic Dates */}
      <div>
        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-4">
          Important Dates
        </h3>
        <div className="space-y-3">
          {importantDates.map((date, index) => (
            <div 
              key={index}
              className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-slate-800 dark:text-slate-100">
                    {date.name}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {date.description}
                  </div>
                </div>
                {date.upcoming && (
                  <span className="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full">
                    Upcoming
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Islamic Quote */}
      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
        <div className="text-sm text-emerald-800 dark:text-emerald-200 text-center italic">
          "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth."
        </div>
        <div className="text-xs text-emerald-600 dark:text-emerald-400 text-center mt-2">
          - Quran 6:73
        </div>
      </div>
    </div>
  )
}