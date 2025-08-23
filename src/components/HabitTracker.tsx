import { useState } from 'react'
import { CheckCircle, Circle, Book, Heart, Users, Zap } from 'lucide-react'
import { cn } from '../lib/utils'

interface Habit {
  id: string
  name: string
  description: string
  icon: React.ElementType
  completed: boolean
  streak: number
}

const initialHabits: Habit[] = [
  {
    id: 'quran',
    name: 'Quran Reading',
    description: 'Read at least one page of the Quran',
    icon: Book,
    completed: false,
    streak: 7
  },
  {
    id: 'dhikr',
    name: 'Dhikr & Remembrance',
    description: 'Recite dhikr (SubhanAllah, Alhamdulillah, Allahu Akbar)',
    icon: Heart,
    completed: true,
    streak: 12
  },
  {
    id: 'charity',
    name: 'Daily Charity',
    description: 'Give charity, even if it\'s a small amount',
    icon: Users,
    completed: false,
    streak: 3
  },
  {
    id: 'dua',
    name: 'Morning & Evening Duas',
    description: 'Recite morning and evening supplications',
    icon: Zap,
    completed: true,
    streak: 5
  }
]

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { 
            ...habit, 
            completed: !habit.completed,
            streak: !habit.completed ? habit.streak + 1 : Math.max(0, habit.streak - 1)
          } 
        : habit
    ))
  }

  const completedCount = habits.filter(h => h.completed).length
  const totalHabits = habits.length

  return (
    <div className="prayer-time-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Islamic Habits
        </h2>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span>{completedCount}/{totalHabits} completed today</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {completedCount}
          </div>
          <div className="text-xs text-emerald-800 dark:text-emerald-200">
            Today
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {habits.reduce((sum, habit) => sum + habit.streak, 0)}
          </div>
          <div className="text-xs text-blue-800 dark:text-blue-200">
            Total Streak
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round((completedCount / totalHabits) * 100)}%
          </div>
          <div className="text-xs text-purple-800 dark:text-purple-200">
            Completion
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {Math.max(...habits.map(h => h.streak))}
          </div>
          <div className="text-xs text-amber-800 dark:text-amber-200">
            Best Streak
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        {habits.map((habit) => {
          const Icon = habit.icon
          return (
            <div
              key={habit.id}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-200",
                habit.completed
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                  : "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-emerald-200 dark:hover:border-emerald-700"
              )}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors mt-1"
                >
                  {habit.completed ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={cn(
                      "h-5 w-5",
                      habit.completed 
                        ? "text-emerald-600 dark:text-emerald-400" 
                        : "text-slate-500 dark:text-slate-400"
                    )} />
                    <h3 className={cn(
                      "font-semibold text-lg",
                      habit.completed
                        ? "text-emerald-800 dark:text-emerald-200"
                        : "text-slate-800 dark:text-slate-100"
                    )}>
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                      <Zap className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-medium text-amber-800 dark:text-amber-200">
                        {habit.streak} day streak
                      </span>
                    </div>
                  </div>
                  <p className={cn(
                    "text-sm",
                    habit.completed
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-slate-600 dark:text-slate-400"
                  )}>
                    {habit.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
          <span>Daily Progress</span>
          <span>{Math.round((completedCount / totalHabits) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div 
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalHabits) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Motivational Message */}
      {completedCount === totalHabits && (
        <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-center">
          <div className="font-bold text-lg">Masha'Allah! 🌟</div>
          <div className="text-sm opacity-90">
            You've completed all your Islamic habits for today!
          </div>
        </div>
      )}
    </div>
  )
}