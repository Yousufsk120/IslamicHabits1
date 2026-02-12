import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Plus,
  Minus,
  Calendar,
  Target,
  Flame,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useHabits, type HabitCategory, type Habit } from "../hooks/useHabits";

interface HabitTrackerProps {
  onClose?: () => void;
}

interface HabitItemProps {
  habit: Habit;
  category: HabitCategory;
  progress: number;
  streak: number;
  completionRate: number;
  onLog: (value: number) => void;
  onToggle: () => void;
}

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  category,
  progress,
  streak,
  completionRate,
  onLog,
  onToggle,
}) => {
  const isCompleted = progress >= habit.target;
  const progressPercentage = Math.min((progress / habit.target) * 100, 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-lg shadow-sm border-l-4 ${category.color} p-4 ${
        !habit.isActive ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-800">{habit.name}</h3>
            <p className="text-sm text-gray-600">{habit.description}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            habit.isActive ? "border-green-500 bg-green-500 text-white" : "border-gray-300"
          }`}
        >
          {habit.isActive && <Check className="w-3 h-3" />}
        </button>
      </div>

      {habit.isActive && (
        <>
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>
                {progress} / {habit.target} {habit.unit}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${category.color.replace("bg-", "bg-")}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>{streak} day streak</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>{completionRate}% this week</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {!isCompleted ? (
              <>
                <button
                  onClick={() => onLog(1)}
                  className={`flex-1 py-2 px-4 rounded-lg text-white font-medium ${category.color} hover:opacity-90 transition-opacity`}
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Mark Progress
                </button>
                {progress > 0 && (
                  <button
                    onClick={() => onLog(-1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </>
            ) : (
              <div className="flex-1 py-2 px-4 rounded-lg bg-green-100 text-green-800 font-medium text-center">
                <Check className="w-4 h-4 inline mr-1" />
                Completed! 🎉
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

const CategorySection: React.FC<{
  category: HabitCategory;
  habits: Habit[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  children: React.ReactNode;
}> = ({ category, habits, isExpanded, onToggleExpand, children }) => {
  const activeHabits = habits.filter((h) => h.isActive);

  return (
    <div className="mb-6">
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-3"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{category.icon}</span>
          <div className="text-left">
            <h2 className="font-semibold text-gray-800">{category.name}</h2>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{activeHabits.length} habits</span>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export const HabitTracker: React.FC<HabitTrackerProps> = ({ onClose }) => {
  const {
    habitStats,
    logHabitProgress,
    getTodayProgress,
    getHabitStreak,
    getCompletionRate,
    toggleHabit,
  } = useHabits();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(habitStats.categories.map((c) => c.id)),
  );

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Calculate overall stats
  const activeHabits = habitStats.habits.filter((h) => h.isActive);
  const completedHabits = activeHabits.filter((h) => getTodayProgress(h.id) >= h.target).length;
  const totalProgress = Math.round((completedHabits / activeHabits.length) * 100) || 0;

  const totalStreaks = habitStats.streaks.reduce((sum, streak) => sum + streak.currentStreak, 0);
  const avgCompletionRate =
    Math.round(
      activeHabits.reduce((sum, habit) => sum + getCompletionRate(habit.id), 0) /
        activeHabits.length,
    ) || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Habit Tracker</h1>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Daily Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-1" />
              <p className="text-sm opacity-90">Today</p>
              <p className="font-bold">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <Target className="w-6 h-6 mx-auto mb-1" />
              <p className="text-sm opacity-90">Completed</p>
              <p className="font-bold">
                {completedHabits} / {activeHabits.length}
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <Flame className="w-6 h-6 mx-auto mb-1" />
              <p className="text-sm opacity-90">Total Streaks</p>
              <p className="font-bold">{totalStreaks} days</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <Award className="w-6 h-6 mx-auto mb-1" />
              <p className="text-sm opacity-90">Weekly Rate</p>
              <p className="font-bold">{avgCompletionRate}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Daily Progress</span>
              <span>{totalProgress}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <motion.div
                className="bg-white h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {habitStats.categories.map((category) => {
            const categoryHabits = habitStats.habits.filter((h) => h.categoryId === category.id);

            if (categoryHabits.length === 0) return null;

            return (
              <CategorySection
                key={category.id}
                category={category}
                habits={categoryHabits}
                isExpanded={expandedCategories.has(category.id)}
                onToggleExpand={() => toggleCategory(category.id)}
              >
                {categoryHabits.map((habit) => {
                  const progress = getTodayProgress(habit.id);
                  const streak = getHabitStreak(habit.id)?.currentStreak || 0;
                  const completionRate = getCompletionRate(habit.id);

                  return (
                    <HabitItem
                      key={habit.id}
                      habit={habit}
                      category={category}
                      progress={progress}
                      streak={streak}
                      completionRate={completionRate}
                      onLog={(amount) => logHabitProgress(habit.id, amount)}
                      onToggle={() => toggleHabit(habit.id)}
                    />
                  );
                })}
              </CategorySection>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
