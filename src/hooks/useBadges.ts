import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useHabits } from "./useHabits";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: "dhikr" | "prayer" | "quran" | "charity" | "sunnah" | "streak" | "special";
  requirement: {
    type: "count" | "streak" | "completion" | "special";
    target: number;
    habitId?: string;
    categoryId?: string;
  };
  rarity: "common" | "rare" | "epic" | "legendary";
  rewards: {
    coins: number;
    title?: string;
  };
}

export interface UserBadge {
  badgeId: string;
  unlockedAt: string;
  progress: number;
  isCompleted: boolean;
}

const badges: Badge[] = [
  // Dhikr Badges
  {
    id: "first-dhikr",
    name: "First Remembrance",
    description: "Complete your first dhikr",
    icon: "🌟",
    color: "bg-yellow-500",
    category: "dhikr",
    requirement: { type: "count", target: 1 },
    rarity: "common",
    rewards: { coins: 10, title: "Beginner" },
  },
  {
    id: "dhikr-100",
    name: "Century of Remembrance",
    description: "Complete 100 dhikr",
    icon: "💫",
    color: "bg-blue-500",
    category: "dhikr",
    requirement: { type: "count", target: 100 },
    rarity: "rare",
    rewards: { coins: 100, title: "Devoted" },
  },
  {
    id: "dhikr-1000",
    name: "Master of Remembrance",
    description: "Complete 1,000 dhikr",
    icon: "⭐",
    color: "bg-purple-500",
    category: "dhikr",
    requirement: { type: "count", target: 1000 },
    rarity: "epic",
    rewards: { coins: 500, title: "Master" },
  },

  // Prayer Badges
  {
    id: "prayer-streak-7",
    name: "Week Warrior",
    description: "Maintain a 7-day prayer streak",
    icon: "🔥",
    color: "bg-orange-500",
    category: "prayer",
    requirement: { type: "streak", target: 7, categoryId: "prayer" },
    rarity: "common",
    rewards: { coins: 50 },
  },
  {
    id: "prayer-streak-30",
    name: "Monthly Devotee",
    description: "Maintain a 30-day prayer streak",
    icon: "🌙",
    color: "bg-indigo-500",
    category: "prayer",
    requirement: { type: "streak", target: 30, categoryId: "prayer" },
    rarity: "rare",
    rewards: { coins: 200, title: "Devoted" },
  },
  {
    id: "prayer-streak-100",
    name: "Century Guardian",
    description: "Maintain a 100-day prayer streak",
    icon: "🏆",
    color: "bg-green-600",
    category: "prayer",
    requirement: { type: "streak", target: 100, categoryId: "prayer" },
    rarity: "epic",
    rewards: { coins: 1000, title: "Guardian" },
  },
  {
    id: "fajr-champion",
    name: "Dawn Champion",
    description: "Complete 30 consecutive Fajr prayers",
    icon: "🌅",
    color: "bg-yellow-600",
    category: "prayer",
    requirement: { type: "streak", target: 30, habitId: "fajr" },
    rarity: "rare",
    rewards: { coins: 300, title: "Dawn Champion" },
  },

  // Quran Badges
  {
    id: "quran-reader",
    name: "Quran Reader",
    description: "Read Quran for 7 consecutive days",
    icon: "📖",
    color: "bg-green-500",
    category: "quran",
    requirement: { type: "streak", target: 7, habitId: "quran-reading" },
    rarity: "common",
    rewards: { coins: 70 },
  },
  {
    id: "quran-scholar",
    name: "Quran Scholar",
    description: "Read Quran for 100 days",
    icon: "📚",
    color: "bg-emerald-600",
    category: "quran",
    requirement: { type: "completion", target: 100, habitId: "quran-reading" },
    rarity: "epic",
    rewards: { coins: 500, title: "Scholar" },
  },

  // Charity Badges
  {
    id: "generous-heart",
    name: "Generous Heart",
    description: "Give charity for 7 consecutive days",
    icon: "💝",
    color: "bg-red-500",
    category: "charity",
    requirement: { type: "streak", target: 7, habitId: "charity" },
    rarity: "common",
    rewards: { coins: 100 },
  },
  {
    id: "charity-champion",
    name: "Charity Champion",
    description: "Give charity for 30 consecutive days",
    icon: "🤲",
    color: "bg-pink-500",
    category: "charity",
    requirement: { type: "streak", target: 30, habitId: "charity" },
    rarity: "rare",
    rewards: { coins: 500, title: "Charitable" },
  },

  // Streak Badges
  {
    id: "consistency-king",
    name: "Consistency King",
    description: "Maintain streaks in 3 different categories simultaneously",
    icon: "👑",
    color: "bg-yellow-600",
    category: "streak",
    requirement: { type: "special", target: 3 },
    rarity: "legendary",
    rewards: { coins: 1000, title: "Consistency King" },
  },

  // Special Badges
  {
    id: "ramadan-warrior",
    name: "Ramadan Warrior",
    description: "Complete all prayers during Ramadan",
    icon: "🌙",
    color: "bg-purple-600",
    category: "special",
    requirement: { type: "special", target: 30 },
    rarity: "legendary",
    rewards: { coins: 2000, title: "Ramadan Warrior" },
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Complete Fajr prayer before sunrise 10 times",
    icon: "🐦",
    color: "bg-blue-400",
    category: "special",
    requirement: { type: "count", target: 10, habitId: "fajr" },
    rarity: "rare",
    rewards: { coins: 200 },
  },
];

const BADGES_STORAGE_KEY = "ih_badges";

export function useBadges() {
  const { user } = useAuth();
  const { habitStats } = useHabits();
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  // Initialize badges data
  useEffect(() => {
    if (user) {
      const savedBadges = localStorage.getItem(`${BADGES_STORAGE_KEY}_${user.id}`);
      if (savedBadges) {
        try {
          setUserBadges(JSON.parse(savedBadges));
        } catch {
          setUserBadges([]);
        }
      }
    } else {
      const savedBadges = localStorage.getItem(BADGES_STORAGE_KEY);
      if (savedBadges) {
        try {
          setUserBadges(JSON.parse(savedBadges));
        } catch {
          setUserBadges([]);
        }
      }
    }
  }, [user]);

  // Check for new badges when stats change
  useEffect(() => {
    checkForNewBadges();
  }, [habitStats, userBadges]);

  const saveUserBadges = (badges: UserBadge[]) => {
    const key = user ? `${BADGES_STORAGE_KEY}_${user.id}` : BADGES_STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(badges));
    setUserBadges(badges);
  };

  const checkForNewBadges = () => {
    const newUnlockedBadges: Badge[] = [];

    badges.forEach((badge) => {
      const userBadge = userBadges.find((ub) => ub.badgeId === badge.id);

      if (!userBadge || !userBadge.isCompleted) {
        const progress = calculateBadgeProgress(badge);
        const isCompleted = progress >= badge.requirement.target;

        if (isCompleted && (!userBadge || !userBadge.isCompleted)) {
          newUnlockedBadges.push(badge);

          // Update or create user badge
          const updatedUserBadges = userBadges.filter((ub) => ub.badgeId !== badge.id);
          updatedUserBadges.push({
            badgeId: badge.id,
            unlockedAt: new Date().toISOString(),
            progress: badge.requirement.target,
            isCompleted: true,
          });

          saveUserBadges(updatedUserBadges);
        } else if (userBadge && userBadge.progress !== progress) {
          // Update progress
          const updatedUserBadges = userBadges.map((ub) =>
            ub.badgeId === badge.id ? { ...ub, progress } : ub,
          );
          saveUserBadges(updatedUserBadges);
        } else if (!userBadge && progress > 0) {
          // Create new badge entry with progress
          const updatedUserBadges = [
            ...userBadges,
            {
              badgeId: badge.id,
              unlockedAt: "",
              progress,
              isCompleted: false,
            },
          ];
          saveUserBadges(updatedUserBadges);
        }
      }
    });

    if (newUnlockedBadges.length > 0) {
      setNewBadges(newUnlockedBadges);
    }
  };

  const calculateBadgeProgress = (badge: Badge): number => {
    const { requirement } = badge;

    switch (requirement.type) {
      case "count":
        if (requirement.habitId) {
          // Count completions for specific habit
          return habitStats.logs.filter(
            (log) => log.habitId === requirement.habitId && log.isCompleted,
          ).length;
        } else if (requirement.categoryId) {
          // Count completions for category
          const categoryHabits = habitStats.habits
            .filter((h) => h.categoryId === requirement.categoryId)
            .map((h) => h.id);
          return habitStats.logs.filter(
            (log) => categoryHabits.includes(log.habitId) && log.isCompleted,
          ).length;
        } else {
          // Total dhikr count (fallback to existing stats)
          return Object.values(habitStats.habits[0]?.id ? 0 : user?.dhikrCount || {}).reduce(
            (sum: number, count: number) => sum + count,
            0,
          );
        }

      case "streak":
        if (requirement.habitId) {
          const streak = habitStats.streaks.find((s) => s.habitId === requirement.habitId);
          return streak?.currentStreak || 0;
        } else if (requirement.categoryId) {
          // Get maximum streak for any habit in category
          const categoryHabits = habitStats.habits
            .filter((h) => h.categoryId === requirement.categoryId)
            .map((h) => h.id);
          const categoryStreaks = habitStats.streaks.filter((s) =>
            categoryHabits.includes(s.habitId),
          );
          return Math.max(...categoryStreaks.map((s) => s.currentStreak), 0);
        }
        return 0;

      case "completion":
        if (requirement.habitId) {
          return habitStats.logs.filter(
            (log) => log.habitId === requirement.habitId && log.isCompleted,
          ).length;
        }
        return 0;

      case "special":
        // Handle special badge requirements
        if (badge.id === "consistency-king") {
          // Count categories with active streaks > 7 days
          const categories = new Set();
          habitStats.streaks.forEach((streak) => {
            if (streak.currentStreak >= 7) {
              const habit = habitStats.habits.find((h) => h.id === streak.habitId);
              if (habit) categories.add(habit.categoryId);
            }
          });
          return categories.size;
        }
        return 0;

      default:
        return 0;
    }
  };

  const getBadgeProgress = (badgeId: string): number => {
    const badge = badges.find((b) => b.id === badgeId);
    if (!badge) return 0;
    return calculateBadgeProgress(badge);
  };

  const getUnlockedBadges = (): Badge[] => {
    return badges.filter((badge) => {
      const userBadge = userBadges.find((ub) => ub.badgeId === badge.id);
      return userBadge?.isCompleted || false;
    });
  };

  const getInProgressBadges = (): (Badge & { progress: number })[] => {
    return badges
      .filter((badge) => {
        const userBadge = userBadges.find((ub) => ub.badgeId === badge.id);
        return !userBadge?.isCompleted && getBadgeProgress(badge.id) > 0;
      })
      .map((badge) => ({
        ...badge,
        progress: getBadgeProgress(badge.id),
      }));
  };

  const getAvailableBadges = (): Badge[] => {
    return badges.filter((badge) => {
      const userBadge = userBadges.find((ub) => ub.badgeId === badge.id);
      return !userBadge?.isCompleted && getBadgeProgress(badge.id) === 0;
    });
  };

  const dismissNewBadges = () => {
    setNewBadges([]);
  };

  const getTotalBadgePoints = (): number => {
    return getUnlockedBadges().reduce((total, badge) => total + badge.rewards.coins, 0);
  };

  const getBadgesByCategory = (category: Badge["category"]): Badge[] => {
    return badges.filter((badge) => badge.category === category);
  };

  const getBadgesByRarity = (rarity: Badge["rarity"]): Badge[] => {
    return badges.filter((badge) => badge.rarity === rarity);
  };

  return {
    badges,
    userBadges,
    newBadges,
    getBadgeProgress,
    getUnlockedBadges,
    getInProgressBadges,
    getAvailableBadges,
    dismissNewBadges,
    getTotalBadgePoints,
    getBadgesByCategory,
    getBadgesByRarity,
  };
}
