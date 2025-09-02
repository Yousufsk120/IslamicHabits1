import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Clock, 
  BookOpen, 
  Target, 
  Award, 
  User, 
  Moon,
  Globe,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/prayers', icon: Clock, label: t('prayers') },
    { path: '/quran', icon: BookOpen, label: t('quran') },
    { path: '/habits', icon: Target, label: t('habits') },
    { path: '/rewards', icon: Award, label: t('rewards') },
    { path: '/profile', icon: User, label: t('profile') },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Moon className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Islamic Habits
              </span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - Language selector, user info, logout */}
          <div className="flex items-center space-x-4">
            {/* Language selector */}
            <div className="relative">
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="bn">বাংলা</option>
                <option value="ur">اردو</option>
              </select>
              <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* User info */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-green-600">
                    {t('level')} {user.level} • {user.points} {t('totalPoints').toLowerCase()}
                  </div>
                </div>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                )}
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title={t('logout')}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;