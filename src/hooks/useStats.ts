import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const STORAGE_KEY = "ih_stats";

export interface Stats {
  dhikr: number;
  coins: number;
  dhikrCount: {
    subhanallah: number;
    alhamdulillah: number;
    laIlahaIllallah: number;
    allahuAkbar: number;
  };
}

const defaultStats: Stats = {
  dhikr: 0,
  coins: 0,
  dhikrCount: {
    subhanallah: 0,
    alhamdulillah: 0,
    laIlahaIllallah: 0,
    allahuAkbar: 0,
  },
};

export function useStats() {
  const { user, updateRewards, updateDhikrCount } = useAuth();
  const [stats, setStats] = useState<Stats>(defaultStats);

  // Initialize stats from localStorage or user data
  useEffect(() => {
    if (user) {
      // If user is logged in, use their data
      const userStats: Stats = {
        dhikr: Object.values(user.dhikrCount).reduce((a, b) => a + b, 0),
        coins: user.rewards,
        dhikrCount: user.dhikrCount,
      };
      setStats(userStats);
    } else {
      // If no user, load from localStorage
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          setStats(JSON.parse(cached));
        } catch {
          setStats(defaultStats);
        }
      } else {
        setStats(defaultStats);
      }
    }
  }, [user]);

  // Update stats when user data changes
  useEffect(() => {
    if (user) {
      const userStats: Stats = {
        dhikr: Object.values(user.dhikrCount).reduce((a, b) => a + b, 0),
        coins: user.rewards,
        dhikrCount: user.dhikrCount,
      };
      setStats(userStats);
    }
  }, [user?.rewards, user?.dhikrCount]);

  const addDhikr = (dhikrType: keyof Stats["dhikrCount"], coinsToAdd = 1) => {
    const newStats = {
      ...stats,
      dhikr: stats.dhikr + 1,
      coins: stats.coins + coinsToAdd,
      dhikrCount: {
        ...stats.dhikrCount,
        [dhikrType]: stats.dhikrCount[dhikrType] + 1,
      },
    };

    setStats(newStats);

    if (user) {
      // Update user data if logged in
      updateDhikrCount(dhikrType, 1);
      updateRewards(coinsToAdd);
    } else {
      // Save to localStorage if not logged in
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    }
  };

  return { stats, addDhikr };
}