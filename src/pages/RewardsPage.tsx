import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Star, Trophy, Gift, Crown, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  category: 'prayer' | 'quran' | 'habit' | 'streak' | 'special';
}

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  claimed: boolean;
  type: 'badge' | 'title' | 'feature' | 'content';
}

const RewardsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'achievements' | 'rewards' | 'leaderboard'>('achievements');

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first habit',
      icon: '👶',
      points: 10,
      unlocked: user ? user.achievements.length > 0 : false,
      category: 'special'
    },
    {
      id: '2',
      title: 'Prayer Warrior',
      description: 'Complete 50 prayers',
      icon: '🕌',
      points: 100,
      unlocked: user ? user.habits.prayers.completed >= 50 : false,
      category: 'prayer'
    },
    {
      id: '3',
      title: 'Quran Scholar',
      description: 'Read 100 verses',
      icon: '📚',
      points: 150,
      unlocked: user ? user.habits.quran.completed >= 100 : false,
      category: 'quran'
    },
    {
      id: '4',
      title: 'Consistent Believer',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      points: 75,
      unlocked: user ? Math.max(user.habits.prayers.streak, user.habits.quran.streak, user.habits.dhikr.streak) >= 7 : false,
      category: 'streak'
    },
    {
      id: '5',
      title: 'Level Up Master',
      description: 'Reach Level 5',
      icon: '⭐',
      points: 200,
      unlocked: user ? user.level >= 5 : false,
      category: 'special'
    },
    {
      id: '6',
      title: 'Generous Heart',
      description: 'Complete 10 charity activities',
      icon: '💝',
      points: 120,
      unlocked: user ? user.habits.charity.completed >= 10 : false,
      category: 'habit'
    },
    {
      id: '7',
      title: 'Morning Star',
      description: 'Complete Fajr prayer 30 times',
      icon: '🌅',
      points: 80,
      unlocked: false, // Would need specific Fajr tracking
      category: 'prayer'
    },
    {
      id: '8',
      title: 'Night Guardian',
      description: 'Complete Isha prayer 30 times',
      icon: '🌙',
      points: 80,
      unlocked: false, // Would need specific Isha tracking
      category: 'prayer'
    }
  ];

  const rewards: Reward[] = [
    {
      id: '1',
      title: 'Golden Crown',
      description: 'Show off your dedication with a golden crown badge',
      cost: 500,
      icon: '👑',
      claimed: false,
      type: 'badge'
    },
    {
      id: '2',
      title: 'Master Title',
      description: 'Unlock the "Islamic Master" title',
      cost: 300,
      icon: '🏆',
      claimed: false,
      type: 'title'
    },
    {
      id: '3',
      title: 'Custom Habit',
      description: 'Create unlimited custom habits',
      cost: 200,
      icon: '🎯',
      claimed: false,
      type: 'feature'
    },
    {
      id: '4',
      title: 'Exclusive Content',
      description: 'Access premium Islamic content',
      cost: 400,
      icon: '📖',
      claimed: false,
      type: 'content'
    },
    {
      id: '5',
      title: 'Star Badge',
      description: 'Beautiful star badge for your profile',
      cost: 100,
      icon: '⭐',
      claimed: false,
      type: 'badge'
    },
    {
      id: '6',
      title: 'Lightning Badge',
      description: 'Show your speed with lightning badge',
      cost: 150,
      icon: '⚡',
      claimed: false,
      type: 'badge'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Ahmad Ali', points: 2500, level: 25, country: '🇸🇦' },
    { rank: 2, name: 'Fatima Khan', points: 2200, level: 22, country: '🇵🇰' },
    { rank: 3, name: 'Mohamed Hassan', points: 2100, level: 21, country: '🇪🇬' },
    { rank: 4, name: 'Aisha Rahman', points: 1900, level: 19, country: '🇧🇩' },
    { rank: 5, name: 'Omar Farooq', points: 1800, level: 18, country: '🇹🇷' },
    { rank: 6, name: user?.name || 'You', points: user?.points || 0, level: user?.level || 1, country: '🌍' }
  ];

  const claimReward = (reward: Reward) => {
    if (user && user.points >= reward.cost) {
      updateUser({
        points: user.points - reward.cost,
        achievements: [...user.achievements, `Claimed: ${reward.title}`]
      });
      
      // Mark reward as claimed (in real app, this would be persisted)
      const updatedRewards = rewards.map(r => 
        r.id === reward.id ? { ...r, claimed: true } : r
      );
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prayer': return 'bg-blue-100 text-blue-800';
      case 'quran': return 'bg-green-100 text-green-800';
      case 'habit': return 'bg-purple-100 text-purple-800';
      case 'streak': return 'bg-orange-100 text-orange-800';
      case 'special': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const completionRate = Math.round((unlockedAchievements / totalAchievements) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 pt-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('rewards')}</h1>
          <p className="text-lg text-gray-600 mb-6">
            Celebrate your Islamic journey with achievements and rewards
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-yellow-600">{user?.points || 0}</div>
            <div className="text-gray-600">{t('totalPoints')}</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-blue-600">{user?.level || 1}</div>
            <div className="text-gray-600">{t('level')}</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-green-600">{unlockedAchievements}</div>
            <div className="text-gray-600">{t('achievements')}</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600">{completionRate}%</div>
            <div className="text-gray-600">Completion Rate</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {t('level')} {user?.level || 1} Progress
            </h3>
            <span className="text-sm text-gray-600">
              {((user?.points || 0) % 100)}/100 to {t('nextLevel')}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all"
              style={{ width: `${((user?.points || 0) % 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-lg mb-8">
          {(['achievements', 'rewards', 'leaderboard'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-md font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'bg-yellow-500 text-white'
                  : 'text-gray-600 hover:text-yellow-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`bg-white rounded-lg p-6 shadow-lg transition-all ${
                    achievement.unlocked 
                      ? 'ring-2 ring-yellow-200 bg-yellow-50 hover:shadow-xl' 
                      : 'grayscale opacity-60'
                  }`}
                >
                  {/* Category Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                      {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                    </span>
                    {achievement.unlocked && (
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                        UNLOCKED
                      </div>
                    )}
                  </div>

                  {/* Achievement Info */}
                  <div className="text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>
                    <div className={`text-lg font-bold ${
                      achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                    }`}>
                      +{achievement.points} points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {rewards.map((reward) => {
                const canClaim = user && user.points >= reward.cost && !reward.claimed;
                return (
                  <div
                    key={reward.id}
                    className={`bg-white rounded-lg p-6 shadow-lg transition-all ${
                      reward.claimed ? 'ring-2 ring-green-200 bg-green-50' : 'hover:shadow-xl'
                    }`}
                  >
                    {/* Type Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
                        {reward.type.charAt(0).toUpperCase() + reward.type.slice(1)}
                      </span>
                      {reward.claimed && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                          CLAIMED
                        </div>
                      )}
                    </div>

                    {/* Reward Info */}
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">{reward.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {reward.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                      <div className="text-lg font-bold text-indigo-600">
                        {reward.cost} points
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="text-center">
                      <button
                        onClick={() => claimReward(reward)}
                        disabled={!canClaim || reward.claimed}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                          reward.claimed
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : canClaim
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {reward.claimed ? (
                          <span className="flex items-center justify-center">
                            <Gift className="h-5 w-5 mr-2" />
                            Claimed!
                          </span>
                        ) : canClaim ? (
                          'Claim Reward'
                        ) : (
                          `Need ${reward.cost - (user?.points || 0)} more points`
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Global Leaderboard</h3>
              <p>Compete with Muslims worldwide!</p>
            </div>
            <div className="divide-y divide-gray-200">
              {leaderboard.map((player) => (
                <div
                  key={player.rank}
                  className={`flex items-center justify-between p-6 transition-colors ${
                    player.name === user?.name ? 'bg-blue-50 ring-2 ring-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                      player.rank === 1 ? 'bg-yellow-500' :
                      player.rank === 2 ? 'bg-gray-400' :
                      player.rank === 3 ? 'bg-yellow-600' :
                      'bg-gray-300'
                    }`}>
                      {player.rank <= 3 ? (
                        player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'
                      ) : (
                        player.rank
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{player.name}</h4>
                        <span className="text-lg">{player.country}</span>
                        {player.name === user?.name && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Level {player.level}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-gray-900">{player.points.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {t('keepGoing')}
          </h3>
          <p className="text-gray-700">
            Every point earned is a step closer to strengthening your Islamic habits. 
            Keep building your spiritual journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;