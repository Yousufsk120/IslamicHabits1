import React from "react";
import { motion } from "framer-motion";
import { User as UserIcon, Coins, TrendingUp, Calendar, LogOut, Award } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface UserDashboardProps {
  onClose?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onClose }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const totalDhikr = Object.values(user.dhikrCount).reduce((a, b) => a + b, 0);

  const dhikrData = [
    {
      key: "subhanallah" as const,
      arabic: "سُبْحَانَ اللهِ",
      transliteration: "Subhanallah",
      count: user.dhikrCount.subhanallah,
      color: "bg-blue-500",
    },
    {
      key: "alhamdulillah" as const,
      arabic: "الْحَمْدُ للهِ",
      transliteration: "Alhamdulillah",
      count: user.dhikrCount.alhamdulillah,
      color: "bg-green-500",
    },
    {
      key: "laIlahaIllallah" as const,
      arabic: "لا إِلهَ إِلاَّ اللهُ",
      transliteration: "La ilaha illallah",
      count: user.dhikrCount.laIlahaIllallah,
      color: "bg-purple-500",
    },
    {
      key: "allahuAkbar" as const,
      arabic: "اللهُ أَكْبَرُ",
      transliteration: "Allahu Akbar",
      count: user.dhikrCount.allahuAkbar,
      color: "bg-red-500",
    },
  ];

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <UserIcon className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600 capitalize">
              {user.email || user.phone} • {user.provider} account
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Total Rewards</p>
              <p className="text-2xl font-bold">{user.rewards}</p>
            </div>
            <Coins className="w-8 h-8 text-yellow-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Dhikr</p>
              <p className="text-2xl font-bold">{totalDhikr}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Account Level</p>
              <p className="text-2xl font-bold">{Math.floor(totalDhikr / 100) + 1}</p>
            </div>
            <Award className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>
      </div>

      {/* Dhikr Breakdown */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Dhikr Breakdown
        </h3>
        <div className="space-y-3">
          {dhikrData.map((dhikr, index) => (
            <motion.div
              key={dhikr.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${dhikr.color} rounded-full mr-3`}></div>
                  <div>
                    <p className="font-medium text-gray-800">{dhikr.transliteration}</p>
                    <p className="text-sm text-gray-600">{dhikr.arabic}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">{dhikr.count}</p>
                  <p className="text-xs text-gray-500">
                    {totalDhikr > 0 ? Math.round((dhikr.count / totalDhikr) * 100) : 0}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: totalDhikr > 0 ? `${(dhikr.count / totalDhikr) * 100}%` : "0%",
                  }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                  className={`${dhikr.color} h-2 rounded-full transition-all duration-300`}
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Achievements</h3>
        <div className="space-y-2">
          {totalDhikr >= 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg"
            >
              <div className="flex items-center">
                <Award className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 font-medium">Century Club - 100+ Dhikr!</span>
              </div>
            </motion.div>
          )}

          {totalDhikr >= 50 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg"
            >
              <div className="flex items-center">
                <Award className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Dedicated Believer - 50+ Dhikr!</span>
              </div>
            </motion.div>
          )}

          {user.rewards >= 50 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg"
            >
              <div className="flex items-center">
                <Coins className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-purple-800 font-medium">Reward Collector - 50+ Coins!</span>
              </div>
            </motion.div>
          )}

          {totalDhikr < 10 && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  Getting Started - Keep up the dhikr!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};
