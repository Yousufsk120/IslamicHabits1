import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Plus, CheckCircle, Clock, TrendingUp, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'worship' | 'character' | 'knowledge' | 'charity';
  completed: boolean;
  streak: number;
  totalCompleted: number;
}

const HabitsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, addPoints, updateUser } = useAuth();
  
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: t('dailyPrayers'),
      description: 'Complete all 5 daily prayers on time',
      icon: '🕌',
      points: 20,
      category: 'worship',
      completed: false,
      streak: 0,
      totalCompleted: 0
    },
    {
      id: '2',
      name: t('quranReading'),
      description: 'Read at least 1 page of Quran',
      icon: '📖',
      points: 15,
      category: 'worship',
      completed: false,
      streak: 0,
      totalCompleted: 0
    },
    {
      id: '3',
      name: t('dhikr'),
      description: 'Spend 10 minutes in dhikr and remembrance',
      icon: '📿',
      points: 12,
      category: 'worship',
      completed: false,
      streak: 0,
      totalCompleted: 0
    },
    {
      id: '4',
      name: 'Morning Azkar',
      description: 'Recite morning supplications',
      icon: '🌅',
      points: 10,
      category: 'worship',
      completed: false,
      streak: 0,
      totalCompleted: 0
    },
    {
      id: '5',
      name: 'Evening Azkar',
      description: 'Recite evening supplications',
      icon: '🌙',
      points: 10,
      category: 'worship',
      completed: false,
      streak: 0,
      totalCompleted: 0
    },
    {
      id: '6',
      name: t('charity'),
      description: 'Give charity or help someone in need',
      icon: '💝',
      points: 25,
      category: 'charity',
      completed: false,
      streak: 0,
      totalCompleted: 0
    },
    {
      id: '7',
      name: 'Good Deed',
      description: 'Perform one good deed for someone',
      icon: '🤝',
      points: 15,
      category: 'character',
      completed: false,
      streak: 0,
      totalCompleted: 0
    },
    {
      id: '8',
      name: 'Islamic Learning',
      description: 'Learn something new about Islam',
      icon: '📚',
      points: 18,
      category: 'knowledge',
      completed: false,
      streak: 0,
      totalCompleted: 0
    }
  ]);

  const [newHabit, setNewHabit] = useState({ name: '', description: '', points: 10 });
  const [showAddForm, setShowAddForm] = useState(false);

  const completeHabit = (habitId: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId && !habit.completed) {
        const updatedHabit = {
          ...habit,
          completed: true,
          totalCompleted: habit.totalCompleted + 1,
          streak: habit.streak + 1
        };
        
        // Add points
        addPoints(habit.points, habit.name);
        
        // Bonus points for streaks
        if (updatedHabit.streak % 7 === 0) {
          addPoints(20, `7-day streak bonus for ${habit.name}!`);
        }
        
        return updatedHabit;
      }
      return habit;
    });
    
    setHabits(updatedHabits);
  };

  const addCustomHabit = () => {
    if (newHabit.name.trim()) {
      const customHabit: Habit = {
        id: Date.now().toString(),
        name: newHabit.name,
        description: newHabit.description,
        icon: '⭐',
        points: newHabit.points,
        category: 'character',
        completed: false,
        streak: 0,
        totalCompleted: 0
      };
      
      setHabits([...habits, customHabit]);
      setNewHabit({ name: '', description: '', points: 10 });
      setShowAddForm(false);
      addPoints(5, 'Creating new habit');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'worship': return 'bg-green-100 text-green-800';
      case 'character': return 'bg-blue-100 text-blue-800';
      case 'knowledge': return 'bg-purple-100 text-purple-800';
      case 'charity': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalHabitsCompleted = habits.filter(h => h.completed).length;
  const totalPointsToday = habits.reduce((sum, h) => sum + (h.completed ? h.points : 0), 0);
  const longestStreak = Math.max(...habits.map(h => h.streak));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 pt-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('habits')}</h1>
          <p className="text-lg text-gray-600 mb-6">
            Build consistent Islamic habits and strengthen your faith
          </p>
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-green-600">{totalHabitsCompleted}</div>
            <div className="text-gray-600">Completed Today</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-blue-600">{totalPointsToday}</div>
            <div className="text-gray-600">Points Earned</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600">{longestStreak}</div>
            <div className="text-gray-600">Longest Streak</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-pink-600">{habits.length}</div>
            <div className="text-gray-600">Total Habits</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Daily Progress</h3>
            <span className="text-sm text-gray-600">
              {totalHabitsCompleted}/{habits.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all"
              style={{ width: `${(totalHabitsCompleted / habits.length) * 100}%` }}
            ></div>
          </div>
          {totalHabitsCompleted === habits.length && (
            <div className="text-center mt-4">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-lg font-semibold text-green-600">
                {t('amazing')} All habits completed!
              </div>
            </div>
          )}
        </div>

        {/* Add New Habit Button */}
        <div className="mb-8">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Custom Habit
            </button>
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Habit</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Habit Name"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="Points"
                  value={newHabit.points}
                  onChange={(e) => setNewHabit({...newHabit, points: parseInt(e.target.value) || 10})}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={addCustomHabit}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Add Habit
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`bg-white rounded-lg p-6 shadow-lg transition-all hover:shadow-xl ${
                habit.completed ? 'ring-2 ring-green-200 bg-green-50' : ''
              }`}
            >
              {/* Category Badge */}
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(habit.category)}`}>
                  {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                </span>
                {habit.streak > 0 && (
                  <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    {habit.streak}
                  </div>
                )}
              </div>

              {/* Habit Info */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{habit.icon}</div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  habit.completed ? 'text-green-800' : 'text-gray-900'
                }`}>
                  {habit.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{habit.description}</p>
                <div className={`text-lg font-bold ${
                  habit.completed ? 'text-green-600' : 'text-purple-600'
                }`}>
                  {habit.completed ? '✓ ' : '+'}{habit.points} points
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <button
                  onClick={() => completeHabit(habit.id)}
                  disabled={habit.completed}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    habit.completed
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105'
                  }`}
                >
                  {habit.completed ? (
                    <span className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Completed! {t('greatJob')}
                    </span>
                  ) : (
                    'Mark Complete'
                  )}
                </button>
              </div>

              {/* Stats */}
              {habit.totalCompleted > 0 && (
                <div className="flex justify-between text-xs text-gray-500 mt-3 pt-3 border-t">
                  <span>Total: {habit.totalCompleted}</span>
                  <span>Streak: {habit.streak} days</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Motivational Section */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">
            {totalHabitsCompleted >= habits.length ? '🏆' : '💪'}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {totalHabitsCompleted >= habits.length ? t('amazing') : t('keepGoing')}
          </h3>
          <p className="text-gray-700">
            {totalHabitsCompleted >= habits.length 
              ? "Subhanallah! You've completed all your habits today! Your consistency is inspiring!" 
              : "Small consistent actions lead to big changes. Keep building those Islamic habits!"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;