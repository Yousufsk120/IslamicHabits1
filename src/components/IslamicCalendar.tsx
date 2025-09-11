import React from "react";
import { motion } from "framer-motion";
import { Calendar, Moon } from "lucide-react";

interface IslamicCalendarProps {
  className?: string;
}

export const IslamicCalendar: React.FC<IslamicCalendarProps> = ({ className = "" }) => {
  // Get current Islamic date (Hijri calendar)
  const getIslamicDate = () => {
    const today = new Date();
    // Basic Hijri conversion (approximate)
    // This is a simplified calculation - in production, use a proper Islamic calendar library
    const hijriYear = Math.floor((today.getFullYear() - 622) * 1.030684) + 1;
    const hijriMonths = [
      "Muharram",
      "Safar",
      "Rabi' al-Awwal",
      "Rabi' al-Thani",
      "Jumada al-Awwal",
      "Jumada al-Thani",
      "Rajab",
      "Sha'ban",
      "Ramadan",
      "Shawwal",
      "Dhu al-Qi'dah",
      "Dhu al-Hijjah",
    ];

    // Approximate month calculation
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
    );
    const monthIndex = Math.floor((dayOfYear / 30.44) % 12);
    const dayOfMonth = Math.floor(dayOfYear % 30.44) + 1;

    return {
      day: dayOfMonth,
      month: hijriMonths[monthIndex],
      year: hijriYear,
    };
  };

  // Get important Islamic dates/events
  const getIslamicEvents = () => {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();

    // Some fixed events (approximate Gregorian dates)
    const events = [
      { month: 11, day: 12, name: "Mawlid al-Nabi (estimated)", type: "celebration" },
      { month: 6, day: 27, name: "Laylat al-Miraj (estimated)", type: "special" },
      { month: 0, day: 10, name: "Day of Ashura (estimated)", type: "important" },
    ];

    const todayEvent = events.find((event) => event.month === month && event.day === day);
    return todayEvent;
  };

  const islamicDate = getIslamicDate();
  const todayEvent = getIslamicEvents();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
    >
      <div className="flex items-center mb-4">
        <Moon className="w-6 h-6 text-green-600 mr-2" />
        <h3 className="text-xl font-bold text-gray-800">Islamic Calendar</h3>
      </div>

      <div className="space-y-3">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-800">
                {islamicDate.day} {islamicDate.month}
              </p>
              <p className="text-green-600 font-medium">{islamicDate.year} AH</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>

        {todayEvent && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-3 rounded-lg ${
              todayEvent.type === "celebration"
                ? "bg-yellow-50 border-l-4 border-yellow-400"
                : todayEvent.type === "special"
                  ? "bg-purple-50 border-l-4 border-purple-400"
                  : "bg-blue-50 border-l-4 border-blue-400"
            }`}
          >
            <p className="font-medium text-gray-800">🌙 {todayEvent.name}</p>
            <p className="text-sm text-gray-600">Special Islamic date today</p>
          </motion.div>
        )}

        <div className="text-xs text-gray-500 text-center">💫 Islamic dates are approximate</div>
      </div>
    </motion.div>
  );
};
