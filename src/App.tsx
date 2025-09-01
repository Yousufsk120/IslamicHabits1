import { useState, useEffect } from 'react'
import { cn } from './lib/utils'

interface Habit {
  id: string
  name: string
  description: string
  completed: boolean
  streak: number
}

const islamicHabits: Omit<Habit, 'id' | 'completed' | 'streak'>[] = [
  {
    name: "Fajr Prayer",
    description: "Wake up for the dawn prayer and start the day with remembrance of Allah"
  },
  {
    name: "Quran Recitation",
    description: "Read and reflect upon the Holy Quran daily"
  },
  {
    name: "Dhikr (Remembrance)",
    description: "Engage in daily remembrance and praise of Allah"
  },
  {
    name: "Dhuhr Prayer",
    description: "Perform the midday prayer with focus and devotion"
  },
  {
    name: "Asr Prayer",
    description: "Complete the afternoon prayer before sunset"
  },
  {
    name: "Maghrib Prayer",
    description: "Pray at sunset and express gratitude for the day"
  },
  {
    name: "Isha Prayer",
    description: "End the day with the night prayer"
  },
  {
    name: "Seek Knowledge",
    description: "Learn something new about Islam or beneficial knowledge"
  }
]

function App() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('islamic-habits')
    if (saved) {
      return JSON.parse(saved)
    }
    return islamicHabits.map((habit, index) => ({
      ...habit,
      id: `habit-${index}`,
      completed: false,
      streak: 0
    }))
  })

  useEffect(() => {
    localStorage.setItem('islamic-habits', JSON.stringify(habits))
  }, [habits])

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completed
        return {
          ...habit,
          completed: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        }
      }
      return habit
    }))
  }

  const completedToday = habits.filter(h => h.completed).length
  const totalHabits = habits.length
  const progressPercentage = (completedToday / totalHabits) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
            🕌 Islamic Habits
          </h1>
          <p className="text-emerald-600 dark:text-emerald-300 text-lg">
            Build righteous habits in the path of Allah
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          {/* Progress Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Today's Progress
            </h2>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 dark:text-gray-400">
                {completedToday} of {totalHabits} habits completed
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Habits List */}
          <div className="space-y-4">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-200 cursor-pointer hover:shadow-lg",
                  habit.completed && "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                )}
                onClick={() => toggleHabit(habit.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    habit.completed 
                      ? "bg-emerald-500 border-emerald-500" 
                      : "border-gray-300 dark:border-gray-600"
                  )}>
                    {habit.completed && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "text-lg font-medium",
                      habit.completed 
                        ? "text-emerald-800 dark:text-emerald-200" 
                        : "text-gray-800 dark:text-gray-200"
                    )}>
                      {habit.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {habit.description}
                    </p>
                    {habit.streak > 0 && (
                      <div className="flex items-center mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                        <span className="mr-1">🔥</span>
                        <span>{habit.streak} day streak</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <footer className="text-center mt-8 text-gray-600 dark:text-gray-400">
            <p className="text-sm">
              "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose."
            </p>
            <p className="text-xs mt-2 opacity-75">- Quran 65:3</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App