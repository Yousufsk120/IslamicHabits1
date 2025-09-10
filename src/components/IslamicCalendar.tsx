import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Star, Moon, Info } from "lucide-react";

interface IslamicCalendarProps {
  onClose?: () => void;
}

interface IslamicEvent {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  type: "major" | "sunnah" | "historical" | "monthly";
  hijriMonth: number;
  hijriDay: number;
  color: string;
  icon: string;
}

interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  dayName: string;
}

const islamicEvents: IslamicEvent[] = [
  {
    id: "muharram-1",
    name: "Islamic New Year",
    nameArabic: "رأس السنة الهجرية",
    description: "Beginning of the Islamic calendar year",
    type: "major",
    hijriMonth: 1,
    hijriDay: 1,
    color: "bg-green-500",
    icon: "🌟",
  },
  {
    id: "muharram-10",
    name: "Day of Ashura",
    nameArabic: "يوم عاشوراء",
    description: "Day of fasting and remembrance",
    type: "major",
    hijriMonth: 1,
    hijriDay: 10,
    color: "bg-blue-500",
    icon: "🤲",
  },
  {
    id: "rabiul-awwal-12",
    name: "Mawlid an-Nabi",
    nameArabic: "مولد النبي",
    description: "Birth of Prophet Muhammad (PBUH)",
    type: "major",
    hijriMonth: 3,
    hijriDay: 12,
    color: "bg-emerald-500",
    icon: "🌙",
  },
  {
    id: "rajab-27",
    name: "Isra and Mi'raj",
    nameArabic: "الإسراء والمعراج",
    description: "Night Journey and Ascension",
    type: "major",
    hijriMonth: 7,
    hijriDay: 27,
    color: "bg-purple-500",
    icon: "✨",
  },
  {
    id: "shaban-15",
    name: "Laylat al-Bara'at",
    nameArabic: "ليلة البراءة",
    description: "Night of Forgiveness",
    type: "sunnah",
    hijriMonth: 8,
    hijriDay: 15,
    color: "bg-indigo-500",
    icon: "🌟",
  },
  {
    id: "ramadan-1",
    name: "Start of Ramadan",
    nameArabic: "بداية رمضان",
    description: "Beginning of the holy month of fasting",
    type: "major",
    hijriMonth: 9,
    hijriDay: 1,
    color: "bg-yellow-500",
    icon: "🌙",
  },
  {
    id: "ramadan-laylat-qadr",
    name: "Laylat al-Qadr",
    nameArabic: "ليلة القدر",
    description: "Night of Power (last 10 nights of Ramadan)",
    type: "major",
    hijriMonth: 9,
    hijriDay: 27, // Commonly believed to be 27th
    color: "bg-gold-500",
    icon: "⭐",
  },
  {
    id: "shawwal-1",
    name: "Eid al-Fitr",
    nameArabic: "عيد الفطر",
    description: "Festival of Breaking the Fast",
    type: "major",
    hijriMonth: 10,
    hijriDay: 1,
    color: "bg-green-600",
    icon: "🎉",
  },
  {
    id: "dhul-hijjah-8",
    name: "Day of Tarwiyah",
    nameArabic: "يوم التروية",
    description: "Day of reflection during Hajj",
    type: "sunnah",
    hijriMonth: 12,
    hijriDay: 8,
    color: "bg-orange-500",
    icon: "🕋",
  },
  {
    id: "dhul-hijjah-9",
    name: "Day of Arafah",
    nameArabic: "يوم عرفة",
    description: "Day of standing at Arafah during Hajj",
    type: "major",
    hijriMonth: 12,
    hijriDay: 9,
    color: "bg-red-500",
    icon: "🤲",
  },
  {
    id: "dhul-hijjah-10",
    name: "Eid al-Adha",
    nameArabic: "عيد الأضحى",
    description: "Festival of Sacrifice",
    type: "major",
    hijriMonth: 12,
    hijriDay: 10,
    color: "bg-red-600",
    icon: "🎉",
  },
];

const hijriMonths = [
  "Muharram",
  "Safar",
  "Rabi' al-awwal",
  "Rabi' al-thani",
  "Jumada al-awwal",
  "Jumada al-thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

const hijriMonthsArabic = [
  "مُحَرَّم",
  "صَفَر",
  "رَبِيع الأَوَّل",
  "رَبِيع الآخِر",
  "جُمَادَى الأُولَى",
  "جُمَادَى الآخِرَة",
  "رَجَب",
  "شَعْبَان",
  "رَمَضَان",
  "شَوَّال",
  "ذُو القِعْدَة",
  "ذُو الحِجَّة",
];

// Simplified Hijri conversion (approximate)
function gregorianToHijri(gregorianDate: Date): HijriDate {
  // This is a simplified calculation. For production, use a proper library like moment-hijri
  const gregorianYear = gregorianDate.getFullYear();

  // Approximate conversion (622 CE = 1 AH)
  const hijriYear = Math.floor((gregorianYear - 622) * 1.030684) + 1;
  const daysInYear = Math.floor(
    (gregorianDate.getTime() - new Date(gregorianYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24),
  );
  const hijriMonth = Math.floor(daysInYear / 29.5) + 1;
  const hijriDay = Math.floor(daysInYear % 29.5) + 1;

  return {
    day: Math.min(hijriDay, 29),
    month: Math.min(hijriMonth, 12),
    year: hijriYear,
    monthName: hijriMonths[Math.min(hijriMonth - 1, 11)],
    dayName: gregorianDate.toLocaleDateString("en-US", { weekday: "long" }),
  };
}

export const IslamicCalendar: React.FC<IslamicCalendarProps> = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<"month" | "events">("month");

  const hijriDate = useMemo(() => gregorianToHijri(currentDate), [currentDate]);

  const getCurrentMonthEvents = (): IslamicEvent[] => {
    return islamicEvents.filter((event) => event.hijriMonth === hijriDate.month);
  };

  const getUpcomingEvents = (): IslamicEvent[] => {
    const today = new Date();
    const todayHijri = gregorianToHijri(today);

    return islamicEvents
      .filter((event) => {
        if (event.hijriMonth > todayHijri.month) return true;
        if (event.hijriMonth === todayHijri.month && event.hijriDay >= todayHijri.day) return true;
        return false;
      })
      .slice(0, 5);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (): number[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: number[] = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(0);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getEventForDate = (day: number): IslamicEvent | undefined => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const hijri = gregorianToHijri(date);
    return islamicEvents.find(
      (event) => event.hijriMonth === hijri.month && event.hijriDay === hijri.day,
    );
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Islamic Calendar</h1>
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

          {/* Date Display */}
          <div className="text-center">
            <p className="text-3xl font-bold mb-2">
              {hijriDate.day} {hijriDate.monthName} {hijriDate.year} AH
            </p>
            <p className="text-lg opacity-90">
              {hijriMonthsArabic[hijriDate.month - 1]} {hijriDate.year}
            </p>
            <p className="text-sm opacity-75">
              {currentDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* View Selector */}
        <div className="bg-gray-50 border-b p-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedView("month")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedView === "month"
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setSelectedView("events")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedView === "events"
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Events
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[500px]">
          {selectedView === "month" ? (
            <div>
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h2>
                <button
                  onClick={() => navigateMonth("next")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {/* Day Headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-medium text-gray-600 p-2">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {getDaysInMonth().map((day, index) => {
                  const event = day > 0 ? getEventForDate(day) : undefined;
                  const today = day > 0 ? isToday(day) : false;

                  return (
                    <div
                      key={index}
                      className={`aspect-square flex flex-col items-center justify-center p-1 rounded-lg relative ${
                        day === 0
                          ? ""
                          : today
                            ? "bg-emerald-100 border-2 border-emerald-500"
                            : event
                              ? `${event.color} text-white`
                              : "hover:bg-gray-100"
                      }`}
                    >
                      {day > 0 && (
                        <>
                          <span
                            className={`text-sm font-medium ${
                              event && !today ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {day}
                          </span>
                          {event && <span className="text-xs">{event.icon}</span>}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Current Month Events */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Events in {hijriDate.monthName}
                </h3>
                <div className="space-y-2">
                  {getCurrentMonthEvents().map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-xl">{event.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{event.name}</h4>
                        <p className="text-sm text-gray-600">{event.nameArabic}</p>
                        <p className="text-xs text-gray-500">{event.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{event.hijriDay}</p>
                        <p className="text-xs text-gray-500">{hijriDate.monthName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* All Events View */}
              <h2 className="text-xl font-semibold mb-6">Islamic Events & Observances</h2>

              {/* Upcoming Events */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {getUpcomingEvents().map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg ${event.color} text-white`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{event.icon}</span>
                          <div>
                            <h4 className="font-semibold">{event.name}</h4>
                            <p className="text-sm opacity-90">{event.nameArabic}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {event.hijriDay} {hijriMonths[event.hijriMonth - 1]}
                          </p>
                          <p className="text-xs opacity-75 capitalize">{event.type}</p>
                        </div>
                      </div>
                      <p className="text-sm mt-2 opacity-90">{event.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* All Events by Category */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">All Events</h3>
                {["major", "sunnah", "historical"].map((type) => {
                  const typeEvents = islamicEvents.filter((event) => event.type === type);

                  return (
                    <div key={type} className="mb-6">
                      <h4 className="font-medium text-gray-700 mb-3 capitalize flex items-center">
                        {type === "major" && <Moon className="w-4 h-4 mr-2" />}
                        {type === "sunnah" && <Star className="w-4 h-4 mr-2" />}
                        {type === "historical" && <Info className="w-4 h-4 mr-2" />}
                        {type} Events
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {typeEvents.map((event) => (
                          <div
                            key={event.id}
                            className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-lg">{event.icon}</span>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800">{event.name}</h5>
                                <p className="text-sm text-gray-600">{event.nameArabic}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {event.hijriDay}/{event.hijriMonth}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">{event.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
