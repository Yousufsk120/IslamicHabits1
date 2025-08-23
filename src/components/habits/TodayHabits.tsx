'use client';

import { useState } from 'react';

const mockHabits = [
  { id: '1', name: 'Fajr Prayer', completed: true, type: 'prayer' },
  { id: '2', name: 'Dhuhr Prayer', completed: true, type: 'prayer' },
  { id: '3', name: 'Asr Prayer', completed: false, type: 'prayer' },
  { id: '4', name: 'Maghrib Prayer', completed: false, type: 'prayer' },
  { id: '5', name: 'Isha Prayer', completed: false, type: 'prayer' },
  { id: '6', name: 'Quran Reading', completed: true, type: 'quran' },
  { id: '7', name: 'Morning Adhkar', completed: true, type: 'dhikr' },
  { id: '8', name: 'Evening Adhkar', completed: false, type: 'dhikr' },
];

export function TodayHabits() {
  const [habits, setHabits] = useState(mockHabits);

  const toggleHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId 
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  const completedCount = habits.filter(h => h.completed).length;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Today's Habits</h3>
        <span className="text-sm text-gray-500">
          {completedCount}/{habits.length} completed
        </span>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleHabit(habit.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  habit.completed
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {habit.completed && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <span className={`${habit.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                {habit.name}
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              habit.type === 'prayer' ? 'bg-blue-100 text-blue-800' :
              habit.type === 'quran' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {habit.type}
            </span>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
        View All Habits
      </button>
    </div>
  );
}