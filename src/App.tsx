import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">
              Islamic Habits
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Build meaningful Islamic habits for a blessed life
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Daily Habits Tracker
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="habit-card bg-emerald-50 dark:bg-emerald-900 p-4 rounded-lg">
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">Fajr Prayer</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start your day with Allah</p>
                </div>
                
                <div className="habit-card bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">Quran Reading</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Daily recitation</p>
                </div>
                
                <div className="habit-card bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200">Dhikr</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Remember Allah often</p>
                </div>
                
                <div className="habit-card bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200">Charity</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Give to those in need</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Habit Counter
                </h3>
                <div className="text-3xl font-bold text-emerald-600 mb-4">{count}</div>
                <button
                  onClick={() => setCount((count) => count + 1)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                >
                  Mark Habit Complete
                </button>
                <button
                  onClick={() => setCount(0)}
                  className="ml-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App