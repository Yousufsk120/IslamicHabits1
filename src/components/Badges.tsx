import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, Trophy, Lock, Target, Crown, Sparkles } from "lucide-react";
import { useBadges, type Badge } from "../hooks/useBadges";

interface BadgesProps {
  onClose?: () => void;
}

interface BadgeCardProps {
  badge: Badge;
  isUnlocked: boolean;
  progress?: number;
  showProgress?: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  isUnlocked,
  progress = 0,
  showProgress = false,
}) => {
  const progressPercentage = Math.min((progress / badge.requirement.target) * 100, 100);

  const getRarityIcon = (rarity: Badge["rarity"]) => {
    switch (rarity) {
      case "common":
        return <Star className="w-4 h-4" />;
      case "rare":
        return <Award className="w-4 h-4" />;
      case "epic":
        return <Trophy className="w-4 h-4" />;
      case "legendary":
        return <Crown className="w-4 h-4" />;
    }
  };

  const getRarityColor = (rarity: Badge["rarity"]) => {
    switch (rarity) {
      case "common":
        return "border-gray-300 bg-gray-50";
      case "rare":
        return "border-blue-300 bg-blue-50";
      case "epic":
        return "border-purple-300 bg-purple-50";
      case "legendary":
        return "border-yellow-300 bg-yellow-50";
    }
  };

  const getRarityTextColor = (rarity: Badge["rarity"]) => {
    switch (rarity) {
      case "common":
        return "text-gray-600";
      case "rare":
        return "text-blue-600";
      case "epic":
        return "text-purple-600";
      case "legendary":
        return "text-yellow-600";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
        isUnlocked
          ? `${badge.color} text-white shadow-lg`
          : `${getRarityColor(badge.rarity)} opacity-60`
      }`}
    >
      {/* Rarity indicator */}
      <div
        className={`absolute top-2 right-2 flex items-center space-x-1 ${
          isUnlocked ? "text-white/80" : getRarityTextColor(badge.rarity)
        }`}
      >
        {getRarityIcon(badge.rarity)}
        <span className="text-xs capitalize font-medium">{badge.rarity}</span>
      </div>

      {/* Lock indicator for locked badges */}
      {!isUnlocked && (
        <div className="absolute top-2 left-2">
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* Badge content */}
      <div className="text-center mt-4">
        <div className="text-4xl mb-3">{badge.icon}</div>
        <h3 className={`font-bold text-lg mb-1 ${isUnlocked ? "text-white" : "text-gray-800"}`}>
          {badge.name}
        </h3>
        <p className={`text-sm mb-3 ${isUnlocked ? "text-white/90" : "text-gray-600"}`}>
          {badge.description}
        </p>

        {/* Progress bar for in-progress badges */}
        {showProgress && progress > 0 && !isUnlocked && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>
                {progress}/{badge.requirement.target}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-emerald-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Rewards */}
        <div
          className={`flex items-center justify-center space-x-2 text-sm ${
            isUnlocked ? "text-white/80" : "text-gray-600"
          }`}
        >
          <span>🪙 {badge.rewards.coins}</span>
          {badge.rewards.title && (
            <>
              <span>•</span>
              <span>"{badge.rewards.title}"</span>
            </>
          )}
        </div>
      </div>

      {/* Unlock animation overlay */}
      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-2 left-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <div className="absolute bottom-2 right-2">
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const NewBadgeNotification: React.FC<{ badges: Badge[]; onDismiss: () => void }> = ({
  badges,
  onDismiss,
}) => {
  if (badges.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg flex items-center">
              <Trophy className="w-6 h-6 mr-2" />
              New Badge{badges.length > 1 ? "s" : ""} Unlocked!
            </h3>
            <button onClick={onDismiss} className="text-white/80 hover:text-white">
              ✕
            </button>
          </div>
          {badges.slice(0, 2).map((badge) => (
            <div key={badge.id} className="flex items-center space-x-3 mb-2 last:mb-0">
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="font-semibold">{badge.name}</p>
                <p className="text-sm text-white/90">+{badge.rewards.coins} coins</p>
              </div>
            </div>
          ))}
          {badges.length > 2 && (
            <p className="text-sm text-white/90 mt-2">
              +{badges.length - 2} more badge{badges.length > 3 ? "s" : ""}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const Badges: React.FC<BadgesProps> = ({ onClose }) => {
  const {
    getUnlockedBadges,
    getInProgressBadges,
    getAvailableBadges,
    newBadges,
    dismissNewBadges,
    getTotalBadgePoints,
  } = useBadges();

  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "unlocked" | "progress" | "available"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");

  const unlockedBadges = getUnlockedBadges();
  const inProgressBadges = getInProgressBadges();
  const availableBadges = getAvailableBadges();

  const getFilteredBadges = () => {
    let badges: (Badge & { isUnlocked: boolean; progress: number; showProgress?: boolean })[] = [];

    switch (selectedFilter) {
      case "unlocked":
        badges = unlockedBadges.map((badge) => ({
          ...badge,
          isUnlocked: true,
          progress: badge.requirement.target,
        }));
        break;
      case "progress":
        badges = inProgressBadges.map((badge) => ({
          ...badge,
          isUnlocked: false,
          showProgress: true,
        }));
        break;
      case "available":
        badges = availableBadges.map((badge) => ({ ...badge, isUnlocked: false, progress: 0 }));
        break;
      default:
        badges = [
          ...unlockedBadges.map((badge) => ({
            ...badge,
            isUnlocked: true,
            progress: badge.requirement.target,
          })),
          ...inProgressBadges.map((badge) => ({ ...badge, isUnlocked: false, showProgress: true })),
          ...availableBadges.map((badge) => ({ ...badge, isUnlocked: false, progress: 0 })),
        ];
    }

    if (selectedCategory !== "all") {
      badges = badges.filter((badge) => badge.category === selectedCategory);
    }

    if (selectedRarity !== "all") {
      badges = badges.filter((badge) => badge.rarity === selectedRarity);
    }

    return badges;
  };

  const filteredBadges = getFilteredBadges();

  const categories = ["all", "dhikr", "prayer", "quran", "charity", "sunnah", "streak", "special"];
  const rarities = ["all", "common", "rare", "epic", "legendary"];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Achievements & Badges</h1>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm opacity-90">Unlocked</p>
                <p className="font-bold text-lg">{unlockedBadges.length}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <Target className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm opacity-90">In Progress</p>
                <p className="font-bold text-lg">{inProgressBadges.length}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <Star className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm opacity-90">Available</p>
                <p className="font-bold text-lg">{availableBadges.length}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <span className="text-2xl mx-auto mb-1 block">🪙</span>
                <p className="text-sm opacity-90">Badge Points</p>
                <p className="font-bold text-lg">{getTotalBadgePoints()}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 border-b p-4">
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedFilter}
                  onChange={(e) =>
                    setSelectedFilter(
                      e.target.value as "all" | "unlocked" | "progress" | "available",
                    )
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="all">All Badges</option>
                  <option value="unlocked">Unlocked</option>
                  <option value="progress">In Progress</option>
                  <option value="available">Available</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rarity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rarity</label>
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {rarities.map((rarity) => (
                    <option key={rarity} value={rarity}>
                      {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="p-6 overflow-y-auto max-h-[500px]">
            {filteredBadges.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No badges found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters or start completing habits to unlock badges!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBadges.map(
                  (
                    badge: Badge & {
                      isUnlocked: boolean;
                      progress: number;
                      showProgress?: boolean;
                    },
                  ) => (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      isUnlocked={badge.isUnlocked}
                      progress={badge.progress}
                      showProgress={badge.showProgress}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* New Badge Notification */}
      <NewBadgeNotification badges={newBadges} onDismiss={dismissNewBadges} />
    </>
  );
};
