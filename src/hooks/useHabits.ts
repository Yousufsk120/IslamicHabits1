import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export interface HabitCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Habit {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  target: number; // daily target
  unit: string; // e.g., "times", "minutes", "pages"
  isActive: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: number;
  target: number;
  isCompleted: boolean;
}

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
}

export interface HabitStats {
  habits: Habit[];
  logs: HabitLog[];
  streaks: HabitStreak[];
  categories: HabitCategory[];
  todayProgress: { [habitId: string]: number };
}

const defaultCategories: HabitCategory[] = [
  {
    id: "prayer",
    name: "Prayer",
    icon: "🤲",
    color: "bg-green-500",
    description: "Daily prayers and supplications",
  },
  {
    id: "quran",
    name: "Quran",
    icon: "📖",
    color: "bg-blue-500",
    description: "Quran reading and memorization",
  },
  {
    id: "dhikr",
    name: "Dhikr",
    icon: "📿",
    color: "bg-purple-500",
    description: "Remembrance of Allah",
  },
  {
    id: "charity",
    name: "Charity",
    icon: "💝",
    color: "bg-red-500",
    description: "Giving and helping others",
  },
  {
    id: "sunnah",
    name: "Sunnah",
    icon: "⭐",
    color: "bg-yellow-500",
    description: "Following the Sunnah of Prophet Muhammad (PBUH)",
  },
];

const defaultHabits: Habit[] = [
  {
    id: "fajr",
    categoryId: "prayer",
    name: "Fajr Prayer",
    description: "Dawn prayer",
    target: 1,
    unit: "prayer",
    isActive: true,
  },
  {
    id: "dhuhr",
    categoryId: "prayer",
    name: "Dhuhr Prayer",
    description: "Noon prayer",
    target: 1,
    unit: "prayer",
    isActive: true,
  },
  {
    id: "asr",
    categoryId: "prayer",
    name: "Asr Prayer",
    description: "Afternoon prayer",
    target: 1,
    unit: "prayer",
    isActive: true,
  },
  {
    id: "maghrib",
    categoryId: "prayer",
    name: "Maghrib Prayer",
    description: "Sunset prayer",
    target: 1,
    unit: "prayer",
    isActive: true,
  },
  {
    id: "isha",
    categoryId: "prayer",
    name: "Isha Prayer",
    description: "Night prayer",
    target: 1,
    unit: "prayer",
    isActive: true,
  },
  {
    id: "quran-reading",
    categoryId: "quran",
    name: "Quran Reading",
    description: "Daily Quran reading",
    target: 15,
    unit: "minutes",
    isActive: true,
  },
  {
    id: "morning-dhikr",
    categoryId: "dhikr",
    name: "Morning Dhikr",
    description: "Morning remembrance",
    target: 1,
    unit: "session",
    isActive: true,
  },
  {
    id: "evening-dhikr",
    categoryId: "dhikr",
    name: "Evening Dhikr",
    description: "Evening remembrance",
    target: 1,
    unit: "session",
    isActive: true,
  },
  {
    id: "charity",
    categoryId: "charity",
    name: "Daily Charity",
    description: "Help someone or give charity",
    target: 1,
    unit: "act",
    isActive: true,
  },
  {
    id: "sunnah-fasting",
    categoryId: "sunnah",
    name: "Sunnah Fasting",
    description: "Monday/Thursday or other sunnah fasting",
    target: 1,
    unit: "day",
    isActive: false,
  },
];

const HABITS_STORAGE_KEY = "ih_habits";

export function useHabits() {
  const { user } = useAuth();
  const [habitStats, setHabitStats] = useState<HabitStats>({
    habits: defaultHabits,
    logs: [],
    streaks: [],
    categories: defaultCategories,
    todayProgress: {},
  });

  const today = new Date().toISOString().split("T")[0];

  // Initialize habits data
  useEffect(() => {
    if (user) {
      // TODO: Load from Firebase when user is logged in
      const savedData = localStorage.getItem(`${HABITS_STORAGE_KEY}_${user.id}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setHabitStats({
            ...parsed,
            categories: defaultCategories, // Always use default categories
            habits: parsed.habits || defaultHabits,
          });
        } catch {
          initializeDefaultData();
        }
      } else {
        initializeDefaultData();
      }
    } else {
      // Load from localStorage for guest users
      const savedData = localStorage.getItem(HABITS_STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setHabitStats({
            ...parsed,
            categories: defaultCategories,
            habits: parsed.habits || defaultHabits,
          });
        } catch {
          initializeDefaultData();
        }
      } else {
        initializeDefaultData();
      }
    }
  }, [user]);

  const initializeDefaultData = () => {
    const initialStreaks: HabitStreak[] = defaultHabits.map((habit) => ({
      habitId: habit.id,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: "",
    }));

    setHabitStats({
      habits: defaultHabits,
      logs: [],
      streaks: initialStreaks,
      categories: defaultCategories,
      todayProgress: {},
    });
  };

  const saveData = (data: HabitStats) => {
    const key = user ? `${HABITS_STORAGE_KEY}_${user.id}` : HABITS_STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(data));
  };

  const logHabitProgress = (habitId: string, amount: number) => {
    const habit = habitStats.habits.find((h) => h.id === habitId);
    if (!habit) return;

    const existingLog = habitStats.logs.find(
      (log) => log.habitId === habitId && log.date === today,
    );

    let newLogs: HabitLog[];
    const newProgress = { ...habitStats.todayProgress };

    if (existingLog) {
      // Update existing log
      const updatedAmount = Math.min(existingLog.completed + amount, habit.target);
      newLogs = habitStats.logs.map((log) =>
        log.id === existingLog.id
          ? {
              ...log,
              completed: updatedAmount,
              isCompleted: updatedAmount >= habit.target,
            }
          : log,
      );
      newProgress[habitId] = updatedAmount;
    } else {
      // Create new log
      const completed = Math.min(amount, habit.target);
      const newLog: HabitLog = {
        id: `${habitId}_${today}_${Date.now()}`,
        habitId,
        date: today,
        completed,
        target: habit.target,
        isCompleted: completed >= habit.target,
      };
      newLogs = [...habitStats.logs, newLog];
      newProgress[habitId] = completed;
    }

    // Update streaks
    const newStreaks = updateStreaks(habitId, newLogs);

    const newHabitStats = {
      ...habitStats,
      logs: newLogs,
      streaks: newStreaks,
      todayProgress: newProgress,
    };

    setHabitStats(newHabitStats);
    saveData(newHabitStats);
  };

  const updateStreaks = (habitId: string, logs: HabitLog[]): HabitStreak[] => {
    const habitLogs = logs
      .filter((log) => log.habitId === habitId && log.isCompleted)
      .sort((a, b) => b.date.localeCompare(a.date));

    let currentStreak = 0;
    let longestStreak = 0;
    let lastCompletedDate = "";

    if (habitLogs.length > 0) {
      lastCompletedDate = habitLogs[0].date;

      // Calculate current streak
      let currentDate = new Date(today);
      for (const log of habitLogs) {
        const logDate = new Date(log.date);
        const daysDiff = Math.floor(
          (currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysDiff === currentStreak) {
          currentStreak++;
          currentDate = logDate;
        } else {
          break;
        }
      }

      // Calculate longest streak
      let tempStreak = 1;
      for (let i = 1; i < habitLogs.length; i++) {
        const prevDate = new Date(habitLogs[i - 1].date);
        const currDate = new Date(habitLogs[i].date);
        const daysDiff = Math.floor(
          (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return habitStats.streaks.map((streak) =>
      streak.habitId === habitId
        ? { ...streak, currentStreak, longestStreak, lastCompletedDate }
        : streak,
    );
  };

  const getTodayProgress = (habitId: string): number => {
    return habitStats.todayProgress[habitId] || 0;
  };

  const getHabitStreak = (habitId: string): HabitStreak | undefined => {
    return habitStats.streaks.find((streak) => streak.habitId === habitId);
  };

  const getCompletionRate = (habitId: string, days: number = 7): number => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);

    const relevantLogs = habitStats.logs.filter(
      (log) => log.habitId === habitId && new Date(log.date) >= startDate && log.isCompleted,
    );

    return Math.round((relevantLogs.length / days) * 100);
  };

  const toggleHabit = (habitId: string) => {
    const newHabits = habitStats.habits.map((habit) =>
      habit.id === habitId ? { ...habit, isActive: !habit.isActive } : habit,
    );

    const newHabitStats = {
      ...habitStats,
      habits: newHabits,
    };

    setHabitStats(newHabitStats);
    saveData(newHabitStats);
  };

  return {
    habitStats,
    logHabitProgress,
    getTodayProgress,
    getHabitStreak,
    getCompletionRate,
    toggleHabit,
    today,
  };
}
