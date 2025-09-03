import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  provider: "email" | "phone" | "google" | "apple";
  rewards: number;
  dhikrCount: {
    subhanallah: number;
    alhamdulillah: number;
    laIlahaIllallah: number;
    allahuAkbar: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, otp: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => void;
  updateRewards: (amount: number) => void;
  updateDhikrCount: (type: keyof User["dhikrCount"], count: number) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem("islamicHabitsUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const saveUserToStorage = (userData: User) => {
    localStorage.setItem("islamicHabitsUser", JSON.stringify(userData));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, _password: string) => {
    setLoading(true);
    try {
      // Mock authentication - in real app, this would call Firebase
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        provider: "email",
        name: email.split("@")[0],
        rewards: 0,
        dhikrCount: {
          subhanallah: 0,
          alhamdulillah: 0,
          laIlahaIllallah: 0,
          allahuAkbar: 0,
        },
      };
      setUser(mockUser);
      saveUserToStorage(mockUser);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loginWithPhone = async (phone: string, _otp: string) => {
    setLoading(true);
    try {
      // Mock phone authentication
      const mockUser: User = {
        id: `user_${Date.now()}`,
        phone,
        provider: "phone",
        name: `User ${phone.slice(-4)}`,
        rewards: 0,
        dhikrCount: {
          subhanallah: 0,
          alhamdulillah: 0,
          laIlahaIllallah: 0,
          allahuAkbar: 0,
        },
      };
      setUser(mockUser);
      saveUserToStorage(mockUser);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Mock Google authentication
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: "user@gmail.com",
        provider: "google",
        name: "Google User",
        rewards: 0,
        dhikrCount: {
          subhanallah: 0,
          alhamdulillah: 0,
          laIlahaIllallah: 0,
          allahuAkbar: 0,
        },
      };
      setUser(mockUser);
      saveUserToStorage(mockUser);
    } finally {
      setLoading(false);
    }
  };

  const loginWithApple = async () => {
    setLoading(true);
    try {
      // Mock Apple authentication
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: "user@icloud.com",
        provider: "apple",
        name: "Apple User",
        rewards: 0,
        dhikrCount: {
          subhanallah: 0,
          alhamdulillah: 0,
          laIlahaIllallah: 0,
          allahuAkbar: 0,
        },
      };
      setUser(mockUser);
      saveUserToStorage(mockUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("islamicHabitsUser");
  };

  const updateRewards = (amount: number) => {
    if (!user) return;
    const updatedUser = { ...user, rewards: user.rewards + amount };
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
  };

  const updateDhikrCount = (type: keyof User["dhikrCount"], count: number) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      dhikrCount: {
        ...user.dhikrCount,
        [type]: user.dhikrCount[type] + count,
      },
    };
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
  };

  const value: AuthContextType = {
    user,
    login,
    loginWithPhone,
    loginWithGoogle,
    loginWithApple,
    logout,
    updateRewards,
    updateDhikrCount,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
