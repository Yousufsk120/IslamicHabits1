import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Edit3, Camera, Calendar, MapPin, Mail, Phone, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: 'Not specified',
    bio: 'Building my Islamic habits journey...'
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600">You need to login to view your profile</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateUser({
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email || '',
      phone: user.phone || '',
      location: 'Not specified',
      bio: 'Building my Islamic habits journey...'
    });
    setIsEditing(false);
  };

  const joinDate = user.joinDate.toLocaleDateString();
  const daysActive = Math.floor((new Date().getTime() - user.joinDate.getTime()) / (1000 * 60 * 60 * 24));

  const habitStats = [
    { 
      name: 'Prayers', 
      completed: user.habits.prayers.completed, 
      streak: user.habits.prayers.streak,
      color: 'bg-blue-500'
    },
    { 
      name: 'Quran Reading', 
      completed: user.habits.quran.completed, 
      streak: user.habits.quran.streak,
      color: 'bg-green-500'
    },
    { 
      name: 'Dhikr', 
      completed: user.habits.dhikr.completed, 
      streak: user.habits.dhikr.streak,
      color: 'bg-purple-500'
    },
    { 
      name: 'Charity', 
      completed: user.habits.charity.completed, 
      streak: user.habits.charity.streak,
      color: 'bg-pink-500'
    }
  ];

  const totalCompleted = habitStats.reduce((sum, habit) => sum + habit.completed, 0);
  const bestStreak = Math.max(...habitStats.map(h => h.streak));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute top-4 right-4">
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors">
                <Camera className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-4">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="h-32 w-32 bg-gray-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-600" />
                  </div>
                )}
                <button className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Edit Button */}
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="text-center mb-6">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="text-3xl font-bold text-gray-900 text-center bg-gray-50 border rounded-md px-3 py-1 mb-2"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              )}
              
              <div className="flex items-center justify-center space-x-6 text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {joinDate}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {editForm.location}
                </div>
              </div>

              <p className="text-gray-700 max-w-md mx-auto">
                {editForm.bio}
              </p>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="flex-1 bg-gray-50 border rounded-md px-3 py-1"
                    placeholder="Email address"
                  />
                ) : (
                  <span className="text-gray-700">{user.email || 'Not provided'}</span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="flex-1 bg-gray-50 border rounded-md px-3 py-1"
                    placeholder="Phone number"
                  />
                ) : (
                  <span className="text-gray-700">{user.phone || 'Not provided'}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-green-600">{user.points}</div>
            <div className="text-gray-600">{t('totalPoints')}</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-blue-600">{user.level}</div>
            <div className="text-gray-600">{t('level')}</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600">{daysActive}</div>
            <div className="text-gray-600">Days Active</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-pink-600">{user.achievements.length}</div>
            <div className="text-gray-600">{t('achievements')}</div>
          </div>
        </div>

        {/* Habit Statistics */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Habit Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Habit Breakdown */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Activities Completed</h4>
              <div className="space-y-4">
                {habitStats.map((habit) => (
                  <div key={habit.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">{habit.name}</span>
                      <span className="text-gray-900 font-semibold">{habit.completed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${habit.color} h-2 rounded-full`}
                        style={{ width: `${Math.min(100, (habit.completed / Math.max(1, totalCompleted)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Streaks */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Streaks</h4>
              <div className="space-y-3">
                {habitStats.map((habit) => (
                  <div key={habit.name} className="flex justify-between items-center">
                    <span className="text-gray-700">{habit.name}</span>
                    <div className="flex items-center">
                      <span className="text-orange-500 font-bold mr-1">{habit.streak}</span>
                      <span className="text-orange-500">🔥</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Achievements</h3>
          {user.achievements.length > 0 ? (
            <div className="space-y-3">
              {user.achievements.slice(-5).reverse().map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <div className="font-semibold text-gray-900">{achievement}</div>
                    <div className="text-sm text-gray-600">Achievement unlocked!</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">🎯</div>
              <p>Complete your first habit to earn achievements!</p>
            </div>
          )}
        </div>

        {/* Motivational Section */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🌟</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {totalCompleted > 50 ? t('amazing') : t('keepGoing')}
          </h3>
          <p className="text-gray-700 mb-4">
            {totalCompleted > 50 
              ? `Mashallah! You've completed ${totalCompleted} activities. Your dedication is inspiring!`
              : `You've completed ${totalCompleted} activities. Keep building those Islamic habits!`
            }
          </p>
          {bestStreak > 0 && (
            <div className="bg-white rounded-lg p-4 inline-block">
              <div className="text-lg font-semibold text-gray-900">
                Best Streak: {bestStreak} days 🔥
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;