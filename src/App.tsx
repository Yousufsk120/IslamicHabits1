import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MoonStar,
  Compass,
  Clock,
  CheckCircle2,
  Medal,
  Baby,
  Gamepad2,
  HandCoins,
  Settings,
  Globe,
  BellRing,
  Heart,
} from "lucide-react";

/**
 * Islamic Habits — Visual Revamp Demo
 * ------------------------------------------------------------
 * • Warm Islamic aesthetic with emerald/teal + soft gold accents
 * • Hero landing + sample dashboard (Next Prayer, Tasbih, Habits)
 * • Kids Mode preview (big friendly tiles)
 * • Lightweight, accessible, Tailwind-only UI (no project aliases)
 *
 * Drop this into a Next.js page (e.g., app/page.tsx) or any React app.
 * Tailwind recommended but not strictly required for preview here.
 */

// Quick helpers
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const pretty = (n: number) => String(n).padStart(2, "0");

// Mock: rolling countdown to next prayer (e.g., Asr in HH:MM:SS)
function useCountdown(startSeconds = 82 * 60) {
  const [seconds, setSeconds] = useState(startSeconds);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 82 * 60)), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = seconds % 60;
  return `${pretty(hh)}:${pretty(mm)}:${pretty(ss)}`;
}

// Geometric starry background
const Bg = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 -z-10"
    style={{
      background:
        "radial-gradient(1200px 600px at 80% -10%, rgba(16,185,129,0.15), transparent 60%)," +
        "radial-gradient(1000px 600px at 10% 120%, rgba(59,130,246,0.10), transparent 60%)," +
        "linear-gradient(to bottom, #f8fafc, #ffffff)",
    }}
  />
);

// Kids Mode Tiles Component
function KidsTiles({ L, neki }: { L: Record<string, string>; neki: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border-4 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 shadow-lg"
      >
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-emerald-100 p-4">
              <Clock className="size-12 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-emerald-800">Prayer Time</h3>
          <p className="mt-2 text-emerald-600">Next: Asr in 1h 22m</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border-4 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8 shadow-lg"
      >
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-amber-100 p-4">
              <HandCoins className="size-12 text-amber-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-amber-800">{L.quickTasbih}</h3>
          <p className="mt-2 text-amber-600">{L.rewards}: {neki}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg"
      >
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-purple-100 p-4">
              <Gamepad2 className="size-12 text-purple-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-purple-800">{L.games}</h3>
          <p className="mt-2 text-purple-600">Fun Islamic games!</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl border-4 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 shadow-lg"
      >
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-blue-100 p-4">
              <CheckCircle2 className="size-12 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-blue-800">{L.habits}</h3>
          <p className="mt-2 text-blue-600">Today: 3/5 done!</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl border-4 border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-8 shadow-lg"
      >
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-rose-100 p-4">
              <Medal className="size-12 text-rose-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-rose-800">Achievements</h3>
          <p className="mt-2 text-rose-600">5 badges earned!</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl border-4 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-lg"
      >
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <Heart className="size-12 text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-green-800">Stories</h3>
          <p className="mt-2 text-green-600">Islamic stories & tales</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function IslamicHabitsRevamp() {
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [soundsOn, setSoundsOn] = useState(true);
  const [kidsMode, setKidsMode] = useState(false);
  const [neki, setNeki] = useState(120);
  const [tasbih, setTasbih] = useState(0);
  const [tasbihTarget, setTasbihTarget] = useState(33);
  const countdown = useCountdown();

  // Earn 1 neki per 33 counts
  useEffect(() => {
    if (tasbih > 0 && tasbih % 33 === 0) setNeki((v) => v + 1);
  }, [tasbih]);

  const t = useMemo(() => ({
    en: {
      brand: "Islamic Habits",
      tagline: "Build good habits, guided by faith.",
      cta: "Get Started",
      prayerNext: "Next Prayer (Asr)",
      until: "Time remaining",
      quickTasbih: "Quick Tasbih",
      selectTarget: "Target",
      habits: "Today's Habits",
      completed: "Completed",
      kidsMode: "Kids Mode",
      games: "Games",
      rewards: "Neki Rewards",
      settings: "Settings",
      reminders: "Reminders",
      pwa: "Install App",
    },
    bn: {
      brand: "ইসলামিক হ্যাবিটস",
      tagline: "ঈমানের আলোয় অভ্যাস গড়ে তুলুন।",
      cta: "শুরু করুন",
      prayerNext: "পরবর্তী নামাজ (আসর)",
      until: "অবশিষ্ট সময়",
      quickTasbih: "দ্রুত তাসবিহ",
      selectTarget: "টার্গেট",
      habits: "আজকের অভ্যাস",
      completed: "সম্পন্ন",
      kidsMode: "কিডস মোড",
      games: "গেমস",
      rewards: "নেকি রিওয়ার্ডস",
      settings: "সেটিংস",
      reminders: "রিমাইন্ডার",
      pwa: "অ্যাপ ইনস্টল করুন",
    },
  }), []);

  const L = t[lang];

  return (
    <div className="min-h-screen text-slate-800">
      <Bg />

      {/* Nav */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-emerald-100">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <MoonStar className="size-6 text-emerald-600" />
          <strong className="tracking-tight text-slate-900">{L.brand}</strong>
          <span className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setLang((l) => (l === "en" ? "bn" : "en"))}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-slate-50"
            >
              <Globe className="size-4" /> {lang.toUpperCase()}
            </button>
            <button
              onClick={() => setSoundsOn((v) => !v)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-slate-50",
                soundsOn && "border-emerald-300 bg-emerald-50"
              )}
            >
              <BellRing className="size-4" /> {soundsOn ? "Sound ON" : "Sound OFF"}
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-slate-50"
              onClick={() => setKidsMode((v) => !v)}
            >
              <Baby className="size-4" /> {L.kidsMode}
            </button>
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight"
            >
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
                {L.tagline}
              </span>
            </motion.h1>
            <p className="mt-4 text-slate-600 max-w-prose">
              Prayer times, habit tracking, tasbih rewards, and a child‑friendly
              experience—fast, private, and beautifully simple.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-xl bg-emerald-600 px-5 py-2.5 text-white shadow-sm hover:bg-emerald-700">
                {L.cta}
              </button>
              <button className="rounded-xl border border-slate-300 px-5 py-2.5 hover:bg-slate-50">
                <Heart className="mr-2 inline size-4" /> {L.pwa}
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">
                <Compass className="size-4 text-emerald-600" /> Offline‑first
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">
                <ShieldIcon /> Privacy‑first
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">
                <Medal className="size-4 text-amber-600" /> Kids friendly
              </div>
            </div>
          </div>

          {/* Next Prayer / Countdown Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="rounded-2xl border bg-white/80 p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="size-5 text-emerald-600" />
                <h3 className="font-semibold">{L.prayerNext}</h3>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700 ring-1 ring-emerald-200">
                {L.until}
              </span>
            </div>
            <div className="mt-4 text-5xl font-semibold tracking-tight">
              {countdown}
            </div>
            <div className="mt-6">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>Asr at 15:42</span>
                <span>Location: Kolkata</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        {kidsMode ? (
          <KidsTiles L={L} neki={neki} />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Quick Tasbih */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl border bg-white/80 p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  <HandCoins className="mr-2 inline size-5 text-amber-600" />
                  {L.quickTasbih}
                </h3>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700 ring-1 ring-amber-200">
                  {L.rewards}: {neki}
                </span>
              </div>
              
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <div className="text-5xl font-semibold tracking-tight">{tasbih}</div>
                  <div className="mt-1 text-sm text-slate-500">/{tasbihTarget}</div>
                </div>
                <Rosary count={tasbih} target={tasbihTarget} />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {[33, 99, 100].map((n) => (
                  <button
                    key={n}
                    onClick={() => setTasbihTarget(n)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm hover:bg-slate-50",
                      n === tasbihTarget && "border-emerald-300 bg-emerald-50"
                    )}
                  >
                    {L.selectTarget}: {n}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setTasbih((c) => c + 1)}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                >
                  +1
                </button>
                <button
                  onClick={() => setTasbih((c) => Math.max(0, c - 1))}
                  className="rounded-xl border px-4 py-2 hover:bg-slate-50"
                >
                  −1
                </button>
                <button
                  onClick={() => setTasbih(0)}
                  className="rounded-xl border px-4 py-2 hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>
            </motion.div>

            {/* Today Habits */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border bg-white/80 p-6 shadow-sm ring-1 ring-slate-200"
            >
              <h3 className="font-semibold">
                <CheckCircle2 className="mr-2 inline size-5 text-emerald-600" />
                {L.habits}
              </h3>
              <div className="mt-4 grid gap-3">
                {[
                  "Fajr",
                  "Quran (15 min)",
                  "Morning Adhkar",
                  "Charity (₹10)",
                  "Parents Call",
                ].map((h) => (
                  <HabitRow key={h} label={h} />
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border bg-white/80 p-6 shadow-sm ring-1 ring-slate-200"
            >
              <h3 className="font-semibold">
                <Medal className="mr-2 inline size-5 text-amber-600" /> Achievements
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge text="7‑Day Salah Streak" />
                <Badge text="1000 Dhikr" />
                <Badge text="10 Duha Days" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <Pill icon={<Settings className="size-4" />} text={L.settings} />
                <Pill icon={<BellRing className="size-4" />} text={L.reminders} />
              </div>
            </motion.div>
          </div>
        )}
      </section>

      <footer className="border-t bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-500">
          Built with love for the Ummah — privacy‑first. © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

function HabitRow({ label }: { label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => setDone((v) => !v)}
      className={cn(
        "flex items-center justify-between rounded-xl border px-4 py-3 text-left hover:bg-slate-50",
        done && "border-emerald-300 bg-emerald-50"
      )}
    >
      <span className="font-medium">{label}</span>
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ring-1",
          done
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : "bg-white text-slate-600 ring-slate-200"
        )}
      >
        <CheckCircle2 className={cn("size-4", done && "text-emerald-600")} />
        {done ? "Done" : "Tap"}
      </span>
    </button>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-50 to-emerald-50 px-3 py-1 text-sm text-slate-700 ring-1 ring-amber-100">
      <Medal className="size-4 text-amber-600" /> {text}
    </span>
  );
}

function Pill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-slate-700 ring-1 ring-slate-200">
      {icon} {text}
    </span>
  );
}

function Rosary({ count, target }: { count: number; target: number }) {
  const pct = Math.min(100, Math.round((count / target) * 100));
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 120 120" className="h-24 w-24">
        <circle cx="60" cy="60" r="50" fill="#fff" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="transparent"
          stroke="url(#g)"
          strokeLinecap="round"
          strokeWidth="8"
          strokeDasharray={`${Math.PI * 100}`}
          strokeDashoffset={`${Math.PI * 100 * (1 - pct / 100)}`}
          transform="rotate(-90 60 60)"
        />
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        <text x="60" y="65" textAnchor="middle" className="fill-slate-700 text-lg font-semibold">
          {pct}%
        </text>
      </svg>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="size-4 text-emerald-600"
      fill="currentColor"
    >
      <path d="M12 2l7 4v6c0 5-3.4 8-7 10-3.6-2-7-5-7-10V6l7-4z" />
    </svg>
  );
}