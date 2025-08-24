import React, { useState } from 'react'

function App() {
  const [habits, setHabits] = useState<string[]>([])
  const [newHabit, setNewHabit] = useState('')

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, newHabit.trim()])
      setNewHabit('')
    }
  }

  const removeHabit = (index: number) => {
    setHabits(habits.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Islamic Habits</h1>
          <p className="text-gray-600">Track your daily Islamic practices and build good habits</p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Habit</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Enter an Islamic habit (e.g., Fajr prayer, Quran reading)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            />
            <button
              onClick={addHabit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Islamic Habits</h2>
          {habits.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No habits added yet. Start by adding your first Islamic habit!
            </p>
          ) : (
            <ul className="space-y-2">
              {habits.map((habit, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">{habit}</span>
                  <button
                    onClick={() => removeHabit(index)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="text-center mt-8 text-gray-500">
          <p>May Allah help us in building good habits and staying consistent</p>
        </footer>
      </div>
    </div>
  )
}

export default App