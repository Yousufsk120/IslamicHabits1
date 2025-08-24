import { useState } from "react";

function App() {
  const [habits, setHabits] = useState([
    { id: 1, name: "Fajr Prayer", completed: false },
    { id: 2, name: "Quran Reading", completed: false },
    { id: 3, name: "Dhikr (Remembrance)", completed: false },
    { id: 4, name: "Dhuhr Prayer", completed: false },
    { id: 5, name: "Asr Prayer", completed: false },
    { id: 6, name: "Maghrib Prayer", completed: false },
    { id: 7, name: "Isha Prayer", completed: false },
  ]);

  const toggleHabit = (id: number) => {
    setHabits(
      habits.map((habit) => (habit.id === id ? { ...habit, completed: !habit.completed } : habit)),
    );
  };

  const completedCount = habits.filter((habit) => habit.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Islamic Habits Tracker</h1>
          <p className="text-green-600">
            Track your daily Islamic practices and build consistent habits
          </p>
          <div className="mt-4 inline-block bg-green-200 px-4 py-2 rounded-lg">
            <span className="text-green-800 font-semibold">
              {completedCount} of {habits.length} completed today
            </span>
          </div>
        </header>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Habits</h2>

          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  habit.completed
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => toggleHabit(habit.id)}
              >
                <div
                  className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                    habit.completed ? "bg-green-500 border-green-500" : "border-gray-300"
                  }`}
                >
                  {habit.completed && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-lg ${
                    habit.completed ? "text-green-800 line-through" : "text-gray-800"
                  }`}
                >
                  {habit.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will
              accomplish His purpose."
            </p>
            <p className="text-xs text-gray-500 mt-1">- Quran 65:3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
