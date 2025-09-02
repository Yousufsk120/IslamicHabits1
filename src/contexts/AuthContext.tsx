import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  points: number;
  level: number;
  achievements: string[];
  joinDate: Date;
  habits: {
    prayers: { completed: number; streak: number };
    quran: { completed: number; streak: number };
    dhikr: { completed: number; streak: number };
    charity: { completed: number; streak: number };
  };
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addPoints: (points: number, reason: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage on initialization
    const savedUser = localStorage.getItem('islamicHabitsUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Convert joinDate string back to Date
      parsedUser.joinDate = new Date(parsedUser.joinDate);
      setUser(parsedUser);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('islamicHabitsUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('islamicHabitsUser');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('islamicHabitsUser', JSON.stringify(updatedUser));
    }
  };

  const addPoints = (points: number, reason: string) => {
    if (user) {
      const newPoints = user.points + points;
      const newLevel = Math.floor(newPoints / 100) + 1; // Level up every 100 points
      const leveledUp = newLevel > user.level;
      
      const updatedUser = {
        ...user,
        points: newPoints,
        level: newLevel,
        achievements: leveledUp 
          ? [...user.achievements, `Reached Level ${newLevel}!`]
          : user.achievements
      };
      
      setUser(updatedUser);
      localStorage.setItem('islamicHabitsUser', JSON.stringify(updatedUser));
      
      // Show notification for points gained
      if (typeof window !== 'undefined') {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
        notification.textContent = `+${points} points for ${reason}!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    addPoints,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};