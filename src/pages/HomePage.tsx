import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  BookOpen, 
  Target, 
  Award, 
  Star,
  TrendingUp,
  Calendar,
  Heart,
  Users,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from '../components/LoginModal';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, addPoints } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const features = [
    {
      icon: Clock,
      title: t('prayers'),
      description: 'Track your daily prayers and stay consistent',
      color: 'bg-blue-100 text-blue-600',
      link: '/prayers'
    },
    {
      icon: BookOpen,
      title: t('quran'),
      description: 'Read and memorize Quranic verses',
      color: 'bg-green-100 text-green-600',
      link: '/quran'
    },
    {
      icon: Target,
      title: t('habits'),
      description: 'Build and maintain Islamic habits',
      color: 'bg-purple-100 text-purple-600',
      link: '/habits'
    },
    {
      icon: Award,
      title: t('rewards'),
      description: 'Earn points and unlock achievements',
      color: 'bg-yellow-100 text-yellow-600',
      link: '/rewards'
    }
  ];

  const quickActions = [
    { 
      title: 'Complete Morning Prayer', 
      points: 10, 
      icon: '🌅',
      action: () => addPoints(10, 'Morning Prayer')
    },
    { 
      title: 'Read Ayah of the Day', 
      points: 5, 
      icon: '📖',
      action: () => addPoints(5, 'Quran Reading')
    },
    { 
      title: 'Do Dhikr (5 minutes)', 
      points: 8, 
      icon: '📿',
      action: () => addPoints(8, 'Dhikr')
    },
    { 
      title: 'Make Dua', 
      points: 3, 
      icon: '🤲',
      action: () => addPoints(3, 'Dua')
    }
  ];

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Countries', value: '25+', icon: Globe },
    { label: 'Prayers Tracked', value: '1M+', icon: Heart },
    { label: 'Achievements Unlocked', value: '100K+', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('welcomeMessage')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          
          {!isAuthenticated ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              {t('startJourney')}
            </button>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.name}! 👋
                </h2>
                <div className="flex items-center justify-center space-x-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{user.points}</div>
                    <div className="text-sm text-gray-600">{t('totalPoints')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{user.level}</div>
                    <div className="text-sm text-gray-600">{t('level')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{user.achievements.length}</div>
                    <div className="text-sm text-gray-600">{t('achievements')}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your Islamic Journey Starts Here
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.link}
                  className="group bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Actions - Only show for authenticated users */}
      {isAuthenticated && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-lg p-6 text-center transition-all transform hover:scale-105 shadow-lg"
                >
                  <div className="text-4xl mb-3">{action.icon}</div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <div className="text-sm opacity-90">+{action.points} points</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Join Our Global Community
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-3 bg-green-100 text-green-600 rounded-full mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kid-friendly motivational section */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-100 via-yellow-100 to-green-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t('greatJob')}
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Every small step counts in your Islamic journey. Keep building those good habits!
          </p>
          <div className="flex justify-center space-x-8 text-4xl">
            <span>🕌</span>
            <span>📚</span>
            <span>🤲</span>
            <span>💝</span>
            <span>🌙</span>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default HomePage;