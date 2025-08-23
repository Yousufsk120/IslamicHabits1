import { useState, useEffect } from 'react'
import { Clock, CheckCircle, Circle } from 'lucide-react'
import { getPrayerTimes, getNextPrayer, formatTime, cn } from '../lib/utils'

interface Prayer {
  name: string
  time: string
  completed: boolean
}

export default function PrayerTracker() {
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [nextPrayer, setNextPrayer] = useState<Prayer | null>(null)

  useEffect(() => {
    const updatePrayers = () => {
      setPrayers(getPrayerTimes())
      setNextPrayer(getNextPrayer())
    }

    updatePrayers()
    const interval = setInterval(updatePrayers, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const togglePrayer = (index: number) => {
    setPrayers(prev => prev.map((prayer, i) => 
      i === index ? { ...prayer, completed: !prayer.completed } : prayer
    ))
  }

  const completedCount = prayers.filter(p => p.completed).length

  return (
    <div className="prayer-time-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Daily Prayers
        </h2>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Clock className="h-4 w-4" />
          <span>{completedCount}/5 completed</span>
        </div>
      </div>

      {/* Next Prayer Alert */}
      {nextPrayer && !nextPrayer.completed && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Next Prayer: {nextPrayer.name} at {formatTime(nextPrayer.time)}</span>
          </div>
        </div>
      )}

      {/* Prayer Times List */}
      <div className="space-y-3">
        {prayers.map((prayer, index) => (
          <div
            key={prayer.name}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200",
              prayer.completed
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                : "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-emerald-200 dark:hover:border-emerald-700"
            )}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => togglePrayer(index)}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                {prayer.completed ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </button>
              <div>
                <h3 className={cn(
                  "font-semibold text-lg",
                  prayer.completed
                    ? "text-emerald-800 dark:text-emerald-200 line-through"
                    : "text-slate-800 dark:text-slate-100"
                )}>
                  {prayer.name}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <span className={cn(
                "text-lg font-mono",
                prayer.completed
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-600 dark:text-slate-300"
              )}>
                {formatTime(prayer.time)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
          <span>Daily Progress</span>
          <span>{Math.round((completedCount / 5) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div 
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}