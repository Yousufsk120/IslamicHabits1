import React from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Award, Flame } from "lucide-react";

interface DailyGoalsProps {
  className?: string;
  totalDhikr: number;
  streakDays: number;
}

export const DailyGoals: React.FC<DailyGoalsProps> = ({
  className = "",
  totalDhikr = 0,
  streakDays = 0,
}) => {
  const dailyGoal = 100; // Daily dhikr goal
  const progress = Math.min((totalDhikr / dailyGoal) * 100, 100);
  const isGoalCompleted = totalDhikr >= dailyGoal;

  const getStreakMessage = () => {
    if (streakDays === 0) return "Start your spiritual journey today! 🌱";
    if (streakDays === 1) return "Great start! Keep the momentum going! 💪";
    if (streakDays < 7) return `${streakDays} days strong! Building the habit! 🔥`;
    if (streakDays < 30) return `Amazing ${streakDays}-day streak! You're on fire! 🚀`;
    return `Incredible ${streakDays}-day streak! True dedication! ⭐`;
  };

  const getProgressMessage = () => {
    if (progress === 0) return "Begin your dhikr journey";
    if (progress < 25) return "Just getting started";
    if (progress < 50) return "Making good progress";
    if (progress < 75) return "More than halfway there";
    if (progress < 100) return "Almost at your goal";
    return "Goal achieved! Masha Allah!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
    >
      <div className="flex items-center mb-4">
        <Target className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-xl font-bold text-gray-800">Daily Goals</h3>
      </div>

      <div className="space-y-4">
        {/* Dhikr Progress */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Daily Dhikr Progress</span>
            <span className="text-sm text-blue-600">
              {totalDhikr}/{dailyGoal}
            </span>
          </div>

          <div className="bg-blue-200 rounded-full h-3 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-600">{getProgressMessage()}</span>
            {isGoalCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center text-green-600"
              >
                <Award className="w-4 h-4 mr-1" />
                <span className="text-xs font-bold">Completed!</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Streak Counter */}
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Flame className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-sm font-medium text-orange-800">Current Streak</span>
            </div>
            <span className="text-2xl font-bold text-orange-600">{streakDays}</span>
          </div>

          <p className="text-xs text-orange-600">{getStreakMessage()}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-700">{Math.round(progress)}%</p>
            <p className="text-xs text-green-600">Daily Progress</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-purple-700">{Math.floor(totalDhikr / 10)}</p>
            <p className="text-xs text-purple-600">Rewards Earned</p>
          </div>
        </div>

        {/* Motivational Message */}
        {!isGoalCompleted && (
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600">
              {dailyGoal - totalDhikr} more dhikr to reach your daily goal! 🎯
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
