import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, CheckCircle, Circle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PrayerTime {
  name: string;
  time: string;
  completed: boolean;
  points: number;
}

const PrayersPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, addPoints, updateUser } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('Default Location');

  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([
    { name: 'Fajr', time: '05:30', completed: false, points: 15 },
    { name: 'Dhuhr', time: '12:30', completed: false, points: 10 },
    { name: 'Asr', time: '15:45', completed: false, points: 10 },
    { name: 'Maghrib', time: '18:20', completed: false, points: 10 },
    { name: 'Isha', time: '19:45', completed: false, points: 15 }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const markPrayerComplete = (index: number) => {
    const updatedPrayers = [...prayerTimes];
    if (!updatedPrayers[index].completed) {
      updatedPrayers[index].completed = true;
      setPrayerTimes(updatedPrayers);
      
      // Add points for completing prayer
      addPoints(updatedPrayers[index].points, `${updatedPrayers[index].name} Prayer`);
      
      // Update user habits
      if (user) {
        const newPrayerCount = user.habits.prayers.completed + 1;
        const newStreak = calculateStreak(newPrayerCount);
        
        updateUser({
          habits: {
            ...user.habits,
            prayers: {
              completed: newPrayerCount,
              streak: newStreak
            }
          }
        });
      }
    }
  };

  const calculateStreak = (completed: number) => {
    // Simple streak calculation - in real app, this would be more sophisticated
    return Math.floor(completed / 5); // New streak every 5 prayers
  };

  const getNextPrayer = () => {
    const now = currentTime;
    const currentTimeStr = formatTime(now);
    
    for (const prayer of prayerTimes) {
      if (prayer.time > currentTimeStr && !prayer.completed) {
        return prayer;
      }
    }
    return prayerTimes[0]; // Return Fajr if past all prayers
  };

  const nextPrayer = getNextPrayer();
  const completedToday = prayerTimes.filter(p => p.completed).length;
  const totalPoints = prayerTimes.reduce((sum, p) => sum + (p.completed ? p.points : 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🕌</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('prayers')}</h1>
          <p className="text-lg text-gray-600 mb-6">
            Stay connected with Allah through your daily prayers
          </p>
          
          {/* Current time and location */}
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-600">Current Time</div>
              </div>
              <div className="text-center">
                <MapPin className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-semibold text-gray-900">{location}</div>
                <div className="text-sm text-gray-600">Your Location</div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-green-600">{completedToday}/5</div>
            <div className="text-gray-600">Prayers Completed</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-blue-600">{user?.habits.prayers.streak || 0}</div>
            <div className="text-gray-600">Day Streak</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600">{totalPoints}</div>
            <div className="text-gray-600">Points Today</div>
          </div>
        </div>

        {/* Next Prayer Alert */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-2">Next Prayer</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{nextPrayer.name}</div>
              <div className="text-blue-100">at {nextPrayer.time}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Earn</div>
              <div className="text-xl font-bold">+{nextPrayer.points} points</div>
            </div>
          </div>
        </div>

        {/* Prayer Times List */}
        <div className="space-y-4 mb-8">
          {prayerTimes.map((prayer, index) => (
            <div
              key={prayer.name}
              className={`bg-white rounded-lg p-6 shadow-lg transition-all ${
                prayer.completed ? 'ring-2 ring-green-200 bg-green-50' : 'hover:shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => markPrayerComplete(index)}
                    className={`p-2 rounded-full transition-colors ${
                      prayer.completed
                        ? 'text-green-600 bg-green-100'
                        : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {prayer.completed ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>
                  <div>
                    <h3 className={`text-xl font-semibold ${
                      prayer.completed ? 'text-green-800' : 'text-gray-900'
                    }`}>
                      {prayer.name}
                    </h3>
                    <p className="text-gray-600">{prayer.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    prayer.completed ? 'text-green-600' : 'text-purple-600'
                  }`}>
                    {prayer.completed ? '✓ ' : '+'}{prayer.points} points
                  </div>
                  {prayer.completed && (
                    <div className="text-sm text-green-600">Completed! {t('greatJob')}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Section */}
        <div className="bg-gradient-to-r from-yellow-100 to-pink-100 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🌟</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {completedToday >= 5 ? t('amazing') : t('keepGoing')}
          </h3>
          <p className="text-gray-700 mb-4">
            {completedToday >= 5 
              ? "Mashallah! You've completed all your prayers today!" 
              : `You've completed ${completedToday} out of 5 prayers. Keep going!`
            }
          </p>
          {completedToday >= 5 && (
            <div className="text-6xl">🎉</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayersPage;