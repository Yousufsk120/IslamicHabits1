import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Star, Heart, Sparkles } from "lucide-react";
import { useStats } from "../hooks/useStats";

interface FloatingReward {
  id: string;
  x: number;
  y: number;
  type: "coin" | "star";
  dhikrType: string;
}

interface DhikrButtonProps {
  arabic: string;
  transliteration: string;
  translation: string;
  color: string;
  dhikrKey: keyof typeof dhikrTypes;
  onClick: (dhikrKey: keyof typeof dhikrTypes) => void;
}

const dhikrTypes = {
  subhanallah: {
    arabic: "سُبْحَانَ اللهِ",
    transliteration: "Subhanallah",
    translation: "Glory be to Allah",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  alhamdulillah: {
    arabic: "الْحَمْدُ للهِ",
    transliteration: "Alhamdulillah",
    translation: "Praise be to Allah",
    color: "bg-green-500 hover:bg-green-600",
  },
  laIlahaIllallah: {
    arabic: "لا إِلهَ إِلاَّ اللهُ",
    transliteration: "La ilaha illallah",
    translation: "There is no god but Allah",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  allahuAkbar: {
    arabic: "اللهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    translation: "Allah is the greatest",
    color: "bg-red-500 hover:bg-red-600",
  },
};

const DhikrButton: React.FC<DhikrButtonProps> = ({
  arabic,
  transliteration,
  translation,
  color,
  dhikrKey,
  onClick,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(dhikrKey)}
      className={`${color} text-white p-6 rounded-xl shadow-lg transition-all duration-200 min-h-[120px] flex flex-col items-center justify-center text-center space-y-2`}
    >
      <div className="text-lg font-bold">{arabic}</div>
      <div className="text-sm font-medium">{transliteration}</div>
      <div className="text-xs opacity-90">{translation}</div>
    </motion.button>
  );
};

export const GamingMode: React.FC = () => {
  const { stats, addDhikr } = useStats();
  const [floatingRewards, setFloatingRewards] = useState<FloatingReward[]>([]);
  const [showMotivation, setShowMotivation] = useState("");

  const motivationalMessages = [
    "Barakallahu feeki! 🌟",
    "Keep going! 💫",
    "Masha Allah! ✨",
    "Excellent dhikr! 🎯",
    "Allah will reward you! 🤲",
    "Your heart is shining! 💖",
  ];

  const createFloatingReward = (dhikrKey: string) => {
    const newReward: FloatingReward = {
      id: `reward_${Date.now()}_${Math.random()}`,
      x: Math.random() * (window.innerWidth - 100),
      y: window.innerHeight,
      type: Math.random() > 0.5 ? "coin" : "star",
      dhikrType: dhikrKey,
    };

    setFloatingRewards((prev) => [...prev, newReward]);

    // Remove reward after animation
    setTimeout(() => {
      setFloatingRewards((prev) => prev.filter((reward) => reward.id !== newReward.id));
    }, 2000);
  };

  const handleDhikrClick = (dhikrKey: keyof typeof dhikrTypes) => {
    // Add rewards (1-3 coins randomly)
    const rewardAmount = Math.floor(Math.random() * 3) + 1;
    
    // Update dhikr count and rewards in one call
    addDhikr(dhikrKey, rewardAmount);

    // Create floating reward
    createFloatingReward(dhikrKey);

    // Show motivational message
    const randomMessage =
      motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setShowMotivation(randomMessage);
    setTimeout(() => setShowMotivation(""), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h1 className="text-4xl font-bold text-purple-800 mb-2">🎮 Gaming Mode</h1>
            <p className="text-purple-600">Click the dhikr buttons to earn rewards!</p>
          </motion.div>

          {/* Rewards Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg inline-block mb-6"
          >
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="flex items-center justify-center text-2xl font-bold text-yellow-600 mb-1">
                  <Coins className="w-6 h-6 mr-2" />
                  {stats.coins}
                </div>
                <div className="text-sm text-gray-600">Total Rewards</div>
              </div>
              <div className="h-12 border-l border-gray-300"></div>
              <div className="text-center">
                <div className="flex items-center justify-center text-2xl font-bold text-purple-600 mb-1">
                  <Heart className="w-6 h-6 mr-2" />
                  {stats.dhikr}
                </div>
                <div className="text-sm text-gray-600">Total Dhikr</div>
              </div>
            </div>
          </motion.div>

          {/* Motivational Message */}
          <AnimatePresence>
            {showMotivation && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-medium inline-block mb-4"
              >
                {showMotivation}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dhikr Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(dhikrTypes).map(([key, dhikr]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Object.keys(dhikrTypes).indexOf(key) * 0.1 }}
            >
              <DhikrButton
                dhikrKey={key as keyof typeof dhikrTypes}
                arabic={dhikr.arabic}
                transliteration={dhikr.transliteration}
                translation={dhikr.translation}
                color={dhikr.color}
                onClick={handleDhikrClick}
              />
            </motion.div>
          ))}
        </div>

        {/* Individual Dhikr Counts */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(dhikrTypes).map(([key, dhikr]) => (
              <div key={key} className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-lg font-bold text-gray-800">
                  {stats.dhikrCount[key as keyof typeof stats.dhikrCount]}
                </div>
                <div className="text-xs text-gray-600">{dhikr.transliteration}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Rewards Animation */}
      <AnimatePresence>
        {floatingRewards.map((reward) => (
          <motion.div
            key={reward.id}
            initial={{
              x: reward.x,
              y: reward.y,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: reward.x + Math.random() * 100 - 50,
              y: reward.y - 200,
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0,
              y: reward.y - 300,
            }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="fixed pointer-events-none z-50"
          >
            {reward.type === "coin" ? (
              <Coins className="w-8 h-8 text-yellow-500" />
            ) : (
              <Star className="w-8 h-8 text-purple-500" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
