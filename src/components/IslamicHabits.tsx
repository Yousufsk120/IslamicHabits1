import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Islamic Habits – Love & Compassion Page
 *
 * A single-file React page with:
 * - Prayer Times via Aladhan API (with geolocation & manual city fallback)
 * - Qibla Direction (bearing + optional live compass if permission granted)
 * - Dhikr Gaming Mode (Subhanallah, Alhamdulillah, La ilaha illallah, Allahu Akbar)
 * - Rewards, daily goals, streaks, achievements
 * - Local-first persistence with optional Firebase (toggle ENABLE_FIREBASE)
 *
 * Requirements in your app:
 * - TailwindCSS
 * - Framer Motion (npm i framer-motion)
 * - (Optional) Firebase v9+ if you enable backend sync (npm i firebase)
 */

/*************************** CONFIG ***************************/
const ENABLE_FIREBASE = false; // set to true when you add your Firebase config & install firebase

const CONFIG = {
  brand: {
    title: "Islamic Habits",
    tagline: "Build spiritual habits with love and compassion",
  },
  dhikrList: [
    {
      key: "Subhanallah",
      ar: "سُبْحَانَ اللّٰه",
      en: "Subhanallah",
      subtitle: "Glory be to Allah",
      color: "from-blue-500 to-blue-600",
    },
    {
      key: "Alhamdulillah",
      ar: "ٱلْحَمْدُ لِلّٰهِ",
      en: "Alhamdulillah",
      subtitle: "Praise be to Allah",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      key: "La ilaha illallah",
      ar: "لَا إِلٰهَ إِلَّا اللّٰه",
      en: "La ilaha illallah",
      subtitle: "There is no god but Allah",
      color: "from-violet-500 to-violet-600",
    },
    {
      key: "Allahu Akbar",
      ar: "اللّٰهُ أَكْبَر",
      en: "Allahu Akbar",
      subtitle: "Allah is the greatest",
      color: "from-rose-500 to-rose-600",
    },
  ],
  dailyGoal: 100, // total dhikr per day to hit goal
  prayerMethod: 2, // Muslim World League
};
/**************************************************************/

/********************** Utility Helpers **********************/
const todayKey = () => new Date().toISOString().slice(0, 10);
const yyyymmdd = (d: Date) => d.toISOString().slice(0, 10);
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const to12h = (hhmm: string) => {
  if (!hhmm) return "";
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr;
  const ampm = h >= 12 ? "pm" : "am";
  h = ((h + 11) % 12) + 1; // 0->12
  return `${h}:${m} ${ampm}`;
};

// Haversine distance (km) and initial bearing between two coords
function geoDistanceAndBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = dLon;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180) / Math.PI + 360) % 360;
  return { distance, bearing };
}

// Simple localStorage hook
function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors
    }
  }, [key, value]);
  return [value, setValue];
}

/******************** Optional Firebase Layer *******************/
const firebaseAPI = (() => {
  // Offline-first fallback
  const offline = {
    enabled: false,
    init: async () => ({ mode: "offline" }),
    signIn: async () => ({ user: { uid: "guest", displayName: "Guest" } }),
    signOut: async () => ({}),
    saveDaily: async () => ({}),
    loadDaily: async () => null,
  };

  if (!ENABLE_FIREBASE) return { ...offline, enabled: false };

  // Firebase implementation would go here if enabled
  return { ...offline, enabled: false };
})();

/*********************** Prayer Times Card ************************/
interface PrayerTimesCardProps {
  coords: { latitude: number; longitude: number } | null;
  setCoords: (coords: { latitude: number; longitude: number } | null) => void;
}

function PrayerTimesCard({ coords, setCoords }: PrayerTimesCardProps) {
  const [city, setCity] = useState("");
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [next, setNext] = useState<{ name: string; time: string; msUntil: number } | null>(null);

  const fetchByCoords = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError("");
    try {
      const ts = Math.floor(Date.now() / 1000);
      const url = `https://api.aladhan.com/v1/timings/${ts}?latitude=${latitude}&longitude=${longitude}&method=${CONFIG.prayerMethod}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json?.data?.timings) {
        setTimings(json.data.timings);
      } else {
        throw new Error("No timings returned");
      }
    } catch {
      setError("Unable to load prayer times. You can enter a city instead.");
    } finally {
      setLoading(false);
    }
  };

  const fetchByCity = async (cityName: string) => {
    if (!cityName) return;
    setLoading(true);
    setError("");
    try {
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(cityName)}&country=&method=${CONFIG.prayerMethod}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json?.data?.timings) {
        setTimings(json.data.timings);
      } else {
        throw new Error("No timings returned");
      }
    } catch {
      setError("Could not find that city. Try another or use location.");
    } finally {
      setLoading(false);
    }
  };

  // Compute next prayer
  useEffect(() => {
    if (!timings) return;
    const order = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    const now = new Date();
    const nextEntry = (() => {
      for (const name of order) {
        const t = timings[name];
        if (!t) continue;
        const [hh, mm] = t.split(":").map(Number);
        const d = new Date();
        d.setHours(hh, mm, 0, 0);
        if (d.getTime() > now.getTime()) {
          return { name, time: t, msUntil: d.getTime() - now.getTime() };
        }
      }
      // Otherwise, next is tomorrow's Fajr
      const [Fh, Fm] = timings["Fajr"].split(":").map(Number);
      const d = new Date(now.getTime() + 24 * 3600 * 1000);
      d.setHours(Fh, Fm, 0, 0);
      return { name: "Fajr", time: timings["Fajr"], msUntil: d.getTime() - now.getTime() };
    })();
    setNext(nextEntry);
  }, [timings]);

  // Initial geolocation fetch
  useEffect(() => {
    if (coords) {
      fetchByCoords(coords.latitude, coords.longitude);
      return;
    }
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setCoords(c);
        fetchByCoords(c.latitude, c.longitude);
      },
      () => {
        // Ignore geolocation errors
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  const [countdown, setCountdown] = useState("--:--:--");
  useEffect(() => {
    if (!next) return;
    const id = setInterval(() => {
      // Simpler: recompute directly
      const now = new Date();
      const [hh, mm] = next.time.split(":").map(Number);
      let target = new Date();
      target.setHours(hh, mm, 0, 0);
      if (target < now) target = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const delta = Math.max(0, target.getTime() - now.getTime());
      const h = Math.floor(delta / 3600000);
      const m = Math.floor((delta % 3600000) / 60000);
      const s = Math.floor((delta % 60000) / 1000);
      setCountdown(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
      );
    }, 1000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className="rounded-3xl p-6 bg-white shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-800 flex items-center mb-2">
        🕐 Prayer Times
      </h3>
      <p className="text-sm text-slate-600 mb-4">Using Aladhan (MWL method)</p>

      {!coords && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchByCity(city)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
          />
          <button
            onClick={() => fetchByCity(city)}
            disabled={loading || !city}
            className="mt-2 w-full bg-emerald-600 text-white py-2 rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Get Prayer Times"}
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {next && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="text-sm text-emerald-700 font-medium">Next Prayer</div>
          <div className="text-lg font-bold text-emerald-800">{next.name}</div>
          <div className="text-emerald-700">{to12h(next.time)}</div>
          <div className="text-sm text-emerald-600 mt-1">in {countdown}</div>
        </div>
      )}

      {timings && (
        <div className="grid grid-cols-3 gap-3">
          {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha", "Sunrise"].map((prayer) => (
            <div key={prayer} className="text-center p-2 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-600 font-medium">{prayer}</div>
              <div className="text-sm font-bold text-slate-800">{to12h(timings[prayer])}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/************************* Qibla Card *************************/
interface QiblaCardProps {
  coords: { latitude: number; longitude: number } | null;
}

function QiblaCard({ coords }: QiblaCardProps) {
  const [qiblaData, setQiblaData] = useState<{ bearing: number; distance: number } | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [compassEnabled, setCompassEnabled] = useState(false);

  useEffect(() => {
    if (!coords) return;
    // Kaaba coordinates
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    const data = geoDistanceAndBearing(coords.latitude, coords.longitude, kaabaLat, kaabaLng);
    setQiblaData(data);
  }, [coords]);

  useEffect(() => {
    if (typeof DeviceOrientationEvent === "undefined") return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceHeading(event.alpha);
        setCompassEnabled(true);
      }
    };

    // Request permission for iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const bearing = qiblaData?.bearing ?? 0;
  const distance = qiblaData?.distance ?? 0;
  const arrowRotation =
    compassEnabled && deviceHeading !== null ? bearing - deviceHeading : bearing;

  return (
    <div className="rounded-3xl p-6 bg-white shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-800 flex items-center mb-4">
        🧭 Qibla Direction
      </h3>

      <div className="relative w-48 h-48 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
          {/* Compass markings */}
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-4 bg-slate-400"
              style={{
                top: "4px",
                left: "50%",
                transformOrigin: "50% 92px",
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
              }}
            />
          ))}

          {/* Cardinal directions */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-slate-700">
            N
          </div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-slate-700">
            S
          </div>
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs font-bold text-slate-700">
            E
          </div>
          <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-bold text-slate-700">
            W
          </div>

          {/* Qibla arrow */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
            style={{ transform: `rotate(${arrowRotation}deg)` }}
          >
            <div className="flex flex-col items-center">
              <div className="w-1 h-16 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-full"></div>
              <div className="w-3 h-3 bg-emerald-600 rounded-full border-2 border-white"></div>
            </div>
          </div>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-600 rounded-full"></div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center bg-slate-50 rounded-lg px-4 py-2">
          <span className="text-slate-600">Direction:</span>
          <span className="font-bold text-emerald-700">
            {qiblaData ? `${bearing.toFixed(1)}°` : "--"}
          </span>
        </div>

        <div className="flex justify-between items-center bg-slate-50 rounded-lg px-4 py-2">
          <span className="text-slate-600">Distance to Mecca:</span>
          <span className="font-bold text-emerald-700">
            {qiblaData ? `${distance.toFixed(0)} km` : "--"}
          </span>
        </div>
      </div>

      {deviceHeading == null && (
        <p className="mt-3 text-center text-sm text-emerald-700/80">
          Compass disabled or unsupported. Use the bearing above to align manually.
        </p>
      )}
    </div>
  );
}

/************************ Dhikr Gaming Card **********************/
interface DhikrGameCardProps {
  onDailySave: () => void;
}

interface DailyData {
  date: string;
  total: number;
  rewards: number;
  streak: number;
  lastActive: string;
  counts: Record<string, number>;
  achievements: string[];
}

function DhikrGameCard({ onDailySave }: DhikrGameCardProps) {
  const dhikrKeys = CONFIG.dhikrList.map((d) => d.key);
  const [daily, setDaily] = useLocalStorage<DailyData>("ih.daily." + todayKey(), {
    date: todayKey(),
    total: 0,
    rewards: 0,
    streak: 0,
    lastActive: todayKey(),
    counts: Object.fromEntries(dhikrKeys.map((k) => [k, 0])),
    achievements: [],
  });
  const [celebrate, setCelebrate] = useState(false);

  // Handle streak logic on first mount/day change
  useEffect(() => {
    try {
      const lastKey = localStorage.getItem("ih.lastDayKey");
      const today = todayKey();
      if (lastKey && lastKey !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = yyyymmdd(yesterday) === lastKey;
        setDaily((d) => ({
          ...d,
          streak: isYesterday ? (d.streak || 0) + 1 : 0,
          date: today,
        }));
      }
      localStorage.setItem("ih.lastDayKey", today);
    } catch {
      // Ignore localStorage errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onDailySave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daily.total, daily.rewards, JSON.stringify(daily.counts)]);

  const addDhikr = (key: string) => {
    setDaily((d) => {
      const nextCounts = { ...d.counts, [key]: (d.counts[key] || 0) + 1 };
      const nextTotal = d.total + 1;
      let nextRewards = d.rewards + 1; // 1 coin per dhikr
      const nextAch = new Set(d.achievements);

      // Sweet milestones
      if (nextCounts[key] === 33) {
        nextRewards += 10;
        nextAch.add(`${key} ×33`);
      }
      if (nextTotal === CONFIG.dailyGoal) {
        nextRewards += 20;
        nextAch.add("Daily Goal ✔");
      }

      return {
        ...d,
        counts: nextCounts,
        total: nextTotal,
        rewards: nextRewards,
        achievements: Array.from(nextAch),
        lastActive: todayKey(),
      };
    });
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 800);
  };

  const resetToday = () => {
    setDaily({
      date: todayKey(),
      total: 0,
      rewards: 0,
      streak: daily.streak,
      lastActive: todayKey(),
      counts: Object.fromEntries(dhikrKeys.map((k) => [k, 0])),
      achievements: [],
    });
  };

  const progress = clamp(Math.round((daily.total / CONFIG.dailyGoal) * 100), 0, 100);

  return (
    <div className="rounded-3xl p-6 bg-white shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-800 mb-2">🎮 Gaming Mode – Dhikr</h3>
      <p className="text-sm text-slate-600 mb-4">
        Tap to earn rewards • Goal: {CONFIG.dailyGoal}/day
      </p>

      <div className="flex justify-between items-center mb-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
          <span className="text-yellow-700 font-medium">Rewards: {daily.rewards} 🟡</span>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
          <span className="text-orange-700 font-medium">Streak: {daily.streak} 🔥</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONFIG.dhikrList.map((d) => (
          <motion.button
            key={d.key}
            whileTap={{ scale: 0.97 }}
            onClick={() => addDhikr(d.key)}
            className={`rounded-3xl p-5 text-left bg-gradient-to-br ${d.color} text-white shadow hover:opacity-95`}
          >
            <div className="text-2xl font-bold mb-1">{d.ar}</div>
            <div className="mt-1 text-lg font-semibold">{d.en}</div>
            <div className="text-white/90 text-sm">{d.subtitle}</div>
            <div className="mt-3 inline-flex items-center gap-2 bg-white/15 rounded-xl px-3 py-1 text-sm">
              <span className="font-mono">{daily.counts[d.key] || 0}</span>
              <span>count</span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-purple-900 font-medium">
            Today: {daily.total} / {CONFIG.dailyGoal}
          </div>
          <button
            onClick={resetToday}
            className="text-sm px-3 py-1 rounded-lg bg-purple-700 text-white hover:bg-purple-800"
          >
            Reset
          </button>
        </div>
        <div className="w-full h-3 rounded-full bg-white/60 border border-purple-200 overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-purple-600 to-purple-700"
          />
        </div>
      </div>

      {daily.achievements?.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="text-emerald-800 font-medium text-sm mb-2">🎉 Achievements</div>
          <div className="flex flex-wrap gap-2">
            {daily.achievements.map((ach: string, i: number) => (
              <span
                key={i}
                className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs"
              >
                {ach}
              </span>
            ))}
          </div>
        </div>
      )}

      {celebrate && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="mt-4 p-3 rounded-xl bg-white/80 border border-purple-200 text-purple-900 text-center"
        >
          BarakAllahu feek! Keep going 💚
        </motion.div>
      )}
    </div>
  );
}

/************************** Top-Level Page *************************/
export default function IslamicHabits() {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [user, setUser] = useState({ uid: "guest", displayName: "Guest" });
  const [backendMode, setBackendMode] = useState("offline");

  // Initialize (optional) Firebase
  useEffect(() => {
    let mounted = true;
    (async () => {
      const info = await firebaseAPI.init();
      if (!mounted) return;
      setBackendMode(info.mode);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async () => {
    const cred = await firebaseAPI.signIn();
    const u = cred?.user || { uid: "guest", displayName: "Guest" };
    setUser({ uid: u.uid, displayName: u.displayName || "Guest" });
  };
  const signOut = async () => {
    await firebaseAPI.signOut();
    setUser({ uid: "guest", displayName: "Guest" });
  };

  // Save daily to backend whenever updated
  const handleDailySave = async () => {
    try {
      await firebaseAPI.saveDaily();
    } catch {
      // Ignore save errors
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
              IH
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{CONFIG.brand.title}</h1>
              <p className="text-sm text-slate-600">{CONFIG.brand.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-500">Backend: {backendMode}</div>
            <div className="text-sm text-slate-700">{user.displayName || "Guest"}</div>
            <button
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
              onClick={user?.uid === "guest" ? signIn : signOut}
            >
              {user?.uid === "guest" ? "Sign in" : "Sign out"}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="rounded-3xl p-8 bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-sm">
          <h2 className="text-3xl sm:text-4xl font-extrabold">For a Better Tomorrow 💚</h2>
          <p className="mt-2 text-white/90 max-w-2xl">
            Cultivate remembrance (dhikr), pray on time, and grow day by day. May this page bring
            barakah to you and your family—designed with love and compassion.
          </p>
          <div className="mt-4 text-sm opacity-90">
            "Surely, in the remembrance of Allah do hearts find rest." (Qur'an 13:28)
          </div>
        </div>
      </section>

      {/* Main grid */}
      <main className="max-w-5xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PrayerTimesCard coords={coords} setCoords={setCoords} />
        <QiblaCard coords={coords} />
        <div className="lg:col-span-2">
          <DhikrGameCard onDailySave={handleDailySave} />
        </div>

        {/* Progress Summary */}
        <div className="rounded-3xl p-6 bg-white shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800">Why Islamic Habits?</h3>
          <ul className="mt-3 space-y-2 text-slate-700 text-sm">
            <li>• Interactive dhikr buttons that are joyful, simple, and rewarding.</li>
            <li>• Accurate global prayer times with geolocation or manual city search.</li>
            <li>• Qibla direction with numeric bearing and optional live compass.</li>
            <li>
              • Daily goal, streaks, achievements, and a gentle celebration after every dhikr.
            </li>
            <li>• Works offline via local storage; optional Firebase for cloud sync.</li>
          </ul>
          <div className="mt-4 text-sm text-slate-600">Made with ♥ for the ummah.</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/60">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-slate-600">
          © {new Date().getFullYear()} Islamic Habits • Built for kindness, discipline, and joy.
        </div>
      </footer>
    </div>
  );
}
