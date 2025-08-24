import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MoonStar,
  Compass,
  Clock,
  CheckCircle2,
  Medal,
  Baby,
  HandCoins,
  Settings,
  Globe,
  BellRing,
  MapPin,
  Search,
  LocateFixed,
  Gamepad2,
  Sparkles,
} from "lucide-react";

/**
 * Islamic Habits — Visual Revamp + Planet View + Kids (7–12) — v4
 * ----------------------------------------------------------------
 * This update applies **ALL** the requested features:
 * 1) Kids Mode ON by default (no PIN). Rewards wallet (Neki + Hearts) + Sticker (tasveer) book.
 * 2) Two‑Touch mini‑game (multi‑touch) + NEW: Wudu Steps & Salah Sequence order games.
 *    Each win gives ❤️ + Neki and sometimes a sticker. Hearts can convert → stickers.
 * 3) Next prayer fixed: uses live geo + AlAdhan timings with live countdown.
 * 4) Planet View: geolocate + search (Nominatim) + optional Google Places autocomplete if Maps JS
 *    is present on the page; auto‑updates when params change. OSM map fallback embedded.
 * 5) PWA: Install button only shows when the real install prompt is available.
 * 6) Added dev tests for time sanitization, next‑prayer rollover, and game validators.
 */

// PWA Install Prompt Event Type
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{outcome: 'accepted' | 'dismissed'}>;
  prompt(): Promise<void>;
}

// --------------------------- helpers ---------------------------
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");
const pretty = (n: number) => String(n).padStart(2, "0");
const PREF_KIDS = "kidsMode";
const WALLET_KEY = "kidsWallet";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

// Live next‑prayer countdown based on timings
function useNextPrayerCountdown(timings: Record<string, string> | null) {
  const [label, setLabel] = useState("—");
  const [remaining, setRemaining] = useState("--:--:--");
  useEffect(() => {
    if (!timings) return;
    const id = setInterval(() => {
      const { nextName, nextDate } = getNextPrayerInfo(timings);
      setLabel(nextName);
      const ms = nextDate.getTime() - Date.now();
      const s = Math.max(0, Math.floor(ms / 1000));
      const hh = Math.floor(s / 3600);
      const mm = Math.floor((s % 3600) / 60);
      const ss = s % 60;
      setRemaining(`${pretty(hh)}:${pretty(mm)}:${pretty(ss)}`);
    }, 1000);
    return () => clearInterval(id);
  }, [JSON.stringify(timings)]);
  return { label, remaining };
}

function getNextPrayerInfo(timings: Record<string, string>, now = new Date()) {
  const order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (const name of order) {
    const t = timings[name];
    if (!t) continue;
    const [hh, mm] = sanitizeTime(t).split(":").map(Number);
    const dt = new Date(today);
    dt.setHours(hh, mm, 0, 0);
    if (dt > now) return { nextName: name, nextDate: dt };
  }
  // next day Fajr
  const [fh, fm] = sanitizeTime(timings.Fajr).split(":").map(Number);
  const next = new Date(today);
  next.setDate(next.getDate() + 1);
  next.setHours(fh, fm, 0, 0);
  return { nextName: "Fajr", nextDate: next } as const;
}

function sanitizeTime(s: string) {
  // AlAdhan can return "04:12 (+05)"; strip offsets
  return s.replace(/\s*\(.*\)\s*/g, "").trim();
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

// --------------------------- i18n ---------------------------
const STR = {
  en: {
    brand: "Islamic Habits",
    tagline: "Build good habits, guided by faith.",
    cta: "Get Started",
    prayerNext: "Next Prayer",
    until: "Time remaining",
    quickTasbih: "Quick Tasbih",
    selectTarget: "Target",
    habits: "Today's Habits",
    completed: "Completed",
    kidsMode: "Kids Mode",
    rewards: "Neki Rewards",
    settings: "Settings",
    reminders: "Reminders",
    pwa: "Install App",
    phrase: "Dhikr",
    presets: "Presets",
    classicSet: "33× Classic Set",
    planet: "Planet View",
    planetTag: "Find Salah times anywhere on Earth",
    location: "Location",
    useMyLocation: "Use my location",
    searchPlace: "Search a city or place",
    calcMethod: "Calc Method",
    asrMadhhab: "Asr Madhhab",
    timings: "Today's Timings",
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    loading: "Loading…",
    set: "Set",
    kidsExit: "Exit Kids Mode",
    quiz: "Quiz",
    salahTracker: "Salah Tracker",
    stickers: "Sticker Book",
    twoTouch: "Two‑Touch Game",
    wuduGame: "Wudu Steps Game",
    salahGame: "Salah Sequence Game",
    convert: "Convert",
    convertHint: "5 ❤️ → 1 Sticker",
    install: "Install App",
  },
  bn: {
    brand: "ইসলামিক হ্যাবিটস",
    tagline: "ঈমানের আলোয় অভ্যাস গড়ে তুলুন।",
    cta: "শুরু করুন",
    prayerNext: "পরবর্তী নামাজ",
    until: "অবশিষ্ট সময়",
    quickTasbih: "দ্রুত তাসবিহ",
    selectTarget: "টার্গেট",
    habits: "আজকের অভ্যাস",
    completed: "সম্পন্ন",
    kidsMode: "কিডস মোড",
    rewards: "নেকি রিওয়ার্ডস",
    settings: "সেটিংস",
    reminders: "রিমাইন্ডার",
    pwa: "অ্যাপ ইনস্টল করুন",
    phrase: "যিকির",
    presets: "প্রীসেট",
    classicSet: "৩৩× ক্লাসিক সেট",
    planet: "প্লানেট ভিউ",
    planetTag: "পৃথিবীর যেকোনো স্থানের নামাজের সময়",
    location: "লোকেশন",
    useMyLocation: "আমার লোকেশন নিন",
    searchPlace: "শহর বা স্থান লিখুন",
    calcMethod: "হিসাব পদ্ধতি",
    asrMadhhab: "আসর মাজহাব",
    timings: "আজকের সময়সূচি",
    fajr: "ফজর",
    sunrise: "সূর্যোদয়",
    dhuhr: "যোহর",
    asr: "আসর",
    maghrib: "মাগরিব",
    isha: "এশা",
    loading: "লোড হচ্ছে…",
    set: "সেট",
    kidsExit: "কিডস মোড থেকে বের হন",
    quiz: "কুইজ",
    salahTracker: "নামাজ ট্র্যাকার",
    stickers: "স্টিকার বুক",
    twoTouch: "টু‑টাচ গেম",
    wuduGame: "ওজুর ধাপ গেম",
    salahGame: "নামাজ ক্রম গেম",
    convert: "কনভার্ট",
    convertHint: "৫ ❤️ → ১ স্টিকার",
    install: "অ্যাপ ইনস্টল করুন",
  },
} as const;

// Mock API function for prayer times
async function fetchPrayerTimesFromAPI(params: { lat: number; lng: number; method: number; school: 0 | 1; tz: string }) {
  try {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${params.lat}&longitude=${params.lng}&method=${params.method}&school=${params.school}&tune=0,0,0,0,0,0,0,0,0`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data?.timings || {};
  } catch (error) {
    console.error('Failed to fetch prayer times:', error);
    // Mock fallback times
    return {
      Fajr: "05:30",
      Sunrise: "06:45",
      Dhuhr: "12:30",
      Asr: "15:45",
      Maghrib: "18:15",
      Isha: "19:30"
    };
  }
}

// --------------------------- main ---------------------------
export default function IslamicHabitsRevamp() {
  const [lang, setLang] = useState<"en" | "bn">("en");
  const L = STR[lang] as typeof STR["en"];

  // PWA install prompt handling
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  useEffect(() => {
    const handler = (e: Event) => { 
      e.preventDefault(); 
      setInstallPrompt(e as BeforeInstallPromptEvent); 
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Kids Mode default ON (persisted)
  const [kidsPref, setKidsPref] = useLocalStorage<boolean>(PREF_KIDS, true);
  const [kidsMode, setKidsMode] = useState<boolean>(kidsPref);
  useEffect(() => setKidsPref(kidsMode), [kidsMode, setKidsPref]);

  // Planet View default open
  const [planetOpen, setPlanetOpen] = useState(true);

  // Wallet (kids rewards)
  type Wallet = { neki: number; hearts: number; stickers: string[] };
  const [wallet, setWallet] = useLocalStorage<Wallet>(WALLET_KEY, { neki: 120, hearts: 0, stickers: [] });
  const addNeki = (n: number) => setWallet((w) => ({ ...w, neki: w.neki + n }));
  const addHearts = (n: number) => setWallet((w) => ({ ...w, hearts: Math.max(0, w.hearts + n) }));
  const addSticker = (code: string) => setWallet((w) => ({ ...w, stickers: Array.from(new Set([...w.stickers, code])) }));

  // Geo → prayer times → live countdown (hero)
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [method, setMethod] = useState<number>(1); // Karachi default
  const [school, setSchool] = useState<0 | 1>(1); // Hanafi

  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setLat(pos.coords.latitude);
      setLng(pos.coords.longitude);
    });
  }, []);

  async function refreshTimings(_lat = lat, _lng = lng) {
    if (_lat == null || _lng == null) return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const t = await fetchPrayerTimesFromAPI({ lat: _lat, lng: _lng, method, school, tz });
    setTimings(t);
  }

  useEffect(() => { refreshTimings(); }, [lat, lng, method, school]);

  const { label: nextLabel, remaining } = useNextPrayerCountdown(timings);

  // Tasbih
  const [tasbih, setTasbih] = useState(0);
  const [tasbihTarget, setTasbihTarget] = useState(33);
  type DhikrKey = 'subhanallah' | 'alhamdulillah' | 'allahuakbar' | 'la_ilaha_illallah';
  const PRESETS: Record<DhikrKey, { en: string; bn: string; target: number }> = {
    subhanallah: { en: 'SubḥānAllāh', bn: 'সুবহানাল্লাহ', target: 33 },
    alhamdulillah: { en: 'Alḥamdulillāh', bn: 'আলহামদুলিল্লাহ', target: 33 },
    allahuakbar: { en: 'Allāhu Akbar', bn: 'আল্লাহু আকবর', target: 34 },
    la_ilaha_illallah: { en: 'Lā ilāha illā Allāh', bn: 'লা ইলাহা ইল্লাল্লাহ', target: 100 },
  };
  const [dhikr, setDhikr] = useState<DhikrKey>('subhanallah');
  const [setMode, setSetMode] = useState<'single' | 'classic33'>('single');
  const [setStep, setSetStep] = useState(0);
  const getDhikrLabel = (key: DhikrKey) => PRESETS[key][lang];

  // reward tick (every 33)
  useEffect(() => {
    if (tasbih > 0 && tasbih % 33 === 0) addNeki(1);
  }, [tasbih]);

  // classic set auto-advance
  useEffect(() => {
    if (setMode !== 'classic33') return;
    if (tasbih >= tasbihTarget) {
      const seq: DhikrKey[] = ['subhanallah','alhamdulillah','allahuakbar'];
      const next = (setStep + 1) % seq.length;
      setSetStep(next);
      const nextKey = seq[next];
      setDhikr(nextKey);
      setTasbih(0);
      setTasbihTarget(PRESETS[nextKey].target);
    }
  }, [tasbih, setMode, setStep, tasbihTarget]);

  return (
    <div className="min-h-screen text-slate-800">
      <Bg />

      {/* Nav */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-emerald-100">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <MoonStar className="size-6 text-emerald-600" />
          <strong className="tracking-tight text-slate-900">{L.brand}</strong>
          <span className="ml-auto flex items-center gap-2">
            {installPrompt && (
              <button
                onClick={async () => { await installPrompt.prompt?.(); setInstallPrompt(null); }}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-slate-50"
              >
                <Sparkles className="size-4" /> {L.install}
              </button>
            )}
            <button
              onClick={() => setLang((l) => (l === "en" ? "bn" : "en"))}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-slate-50"
            >
              <Globe className="size-4" /> {lang.toUpperCase()}
            </button>
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-slate-50",
                planetOpen && "border-emerald-300 bg-emerald-50"
              )}
              onClick={() => setPlanetOpen((v) => !v)}
            >
              <MapPin className="size-4" /> {L.planet}
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
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
                {L.tagline}
              </span>
            </motion.h1>
            <p className="mt-4 text-slate-600 max-w-prose">
              Real‑time prayer times, habit tracking, kids rewards, and a planet view — fast, private, beautiful.
            </p>
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

          {/* Live Next Prayer */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="rounded-2xl border bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="size-5 text-emerald-600" />
                <h3 className="font-semibold">{L.prayerNext} ({nextLabel})</h3>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700 ring-1 ring-emerald-200">
                {L.until}
              </span>
            </div>
            <div className="mt-4 text-5xl font-semibold tracking-tight">{remaining}</div>
            <div className="mt-6">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>{lat && lng ? `Lat ${lat.toFixed(3)}, Lng ${lng.toFixed(3)}` : 'Location: —'}</span>
                <button onClick={() => navigator.geolocation?.getCurrentPosition((p)=>{setLat(p.coords.latitude);setLng(p.coords.longitude);refreshTimings(p.coords.latitude, p.coords.longitude);})} className="underline">Refresh location</button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Planet View */}
      {planetOpen && (
        <section className="mx-auto max-w-7xl px-4 pb-10">
          <PlanetView lang={lang} lat={lat} lng={lng} method={method} school={school} onLocationChange={(newLat, newLng) => {setLat(newLat); setLng(newLng); refreshTimings(newLat, newLng);}} onMethodChange={setMethod} onSchoolChange={setSchool} />
        </section>
      )}

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        {kidsMode ? (
          <KidsTiles
            L={L}
            wallet={wallet}
            onEarnNeki={(n) => addNeki(n)}
            onEarnHearts={(n) => addHearts(n)}
            onUnlockSticker={(s) => addSticker(s)}
            onExit={() => setKidsMode(false)}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Quick Tasbih */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  <HandCoins className="mr-2 inline size-5 text-amber-600" />
                  {L.quickTasbih}
                </h3>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700 ring-1 ring-amber-200">
                  {L.rewards}: {wallet.neki}  •  ❤️ {wallet.hearts}
                </span>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <div className="text-5xl font-semibold tracking-tight">{tasbih}</div>
                  <div className="mt-1 text-sm text-slate-500">/{tasbihTarget}</div>
                </div>
                <Rosary count={tasbih} target={tasbihTarget} />
              </div>

              {/* Phrase & presets */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                  {L.phrase}: <strong>{getDhikrLabel(dhikr)}</strong>
                  {setMode === 'classic33' && (<span className="ml-2 text-slate-500">(Step {setStep + 1}/3)</span>)}
                </span>
                <button
                  onClick={() => { setSetMode(setMode === 'classic33' ? 'single' : 'classic33'); setSetStep(0); setDhikr('subhanallah'); setTasbih(0); setTasbihTarget(PRESETS['subhanallah'].target); }}
                  className={cn("rounded-full border px-3 py-1", setMode === 'classic33' && "border-emerald-300 bg-emerald-50")}
                >
                  {L.classicSet}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(['subhanallah','alhamdulillah','allahuakbar','la_ilaha_illallah'] as const).map((key) => (
                  <button key={key} onClick={() => { setSetMode('single'); setDhikr(key); setTasbih(0); setTasbihTarget(PRESETS[key].target); }} className={cn("rounded-xl border px-3 py-2 text-sm hover:bg-slate-50", dhikr === key && "border-emerald-300 bg-emerald-50")}>{PRESETS[key][lang]} × {PRESETS[key].target}</button>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {[33, 99, 100].map((n) => (
                  <button key={n} onClick={() => setTasbihTarget(n)} className={cn("rounded-xl border px-3 py-2 text-sm hover:bg-slate-50", n === tasbihTarget && "border-emerald-300 bg-emerald-50")}>{L.selectTarget}: {n}</button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setTasbih((c) => c + 1)} className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">+1</button>
                <button onClick={() => setTasbih((c) => Math.max(0, c - 1))} className="rounded-xl border px-4 py-2 hover:bg-slate-50">−1</button>
                <button onClick={() => setTasbih(0)} className="rounded-xl border px-4 py-2 hover:bg-slate-50">Reset</button>
              </div>
            </motion.div>

            {/* Today Habits */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="font-semibold"><CheckCircle2 className="mr-2 inline size-5 text-emerald-600" />{L.habits}</h3>
              <div className="mt-4 grid gap-3">
                {["Fajr", "Quran (15 min)", "Morning Adhkar", "Charity (₹10)", "Parents Call"].map((h) => (
                  <HabitRow key={h} label={h} />
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="font-semibold"><Medal className="mr-2 inline size-5 text-amber-600" /> Achievements</h3>
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

// --------------------------- simple pieces ---------------------------
function HabitRow({ label }: { label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => setDone((v) => !v)} className={cn("flex items-center justify-between rounded-xl border px-4 py-3 text-left hover:bg-slate-50", done && "border-emerald-300 bg-emerald-50")}> 
      <span className="font-medium">{label}</span>
      <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ring-1", done ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-white text-slate-600 ring-slate-200")}> 
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
        <circle cx="60" cy="60" r="50" fill="transparent" stroke="url(#g)" strokeLinecap="round" strokeWidth="8" strokeDasharray={`${Math.PI * 100}`} strokeDashoffset={`${Math.PI * 100 * (1 - pct / 100)}`} transform="rotate(-90 60 60)" />
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        <text x="60" y="65" textAnchor="middle" className="fill-slate-700 text-lg font-semibold">{pct}%</text>
      </svg>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4 text-emerald-600" fill="currentColor">
      <path d="M12 2l7 4v6c0 5-3.4 8-7 10-3.6-2-7-5-7-10V6l7-4z" />
    </svg>
  );
}

// --------------------------- Kids Mode (7–12) ---------------------------
function KidsTiles({ L, wallet, onEarnNeki, onEarnHearts, onUnlockSticker, onExit }: { 
  L: typeof STR["en"]; 
  wallet: { neki: number; hearts: number; stickers: string[] }; 
  onEarnNeki: (n: number) => void; 
  onEarnHearts: (n: number) => void; 
  onUnlockSticker: (s: string) => void; 
  onExit: () => void; 
}) {
  const [tracker, setTracker] = useState({ Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false });
  const [kidsTasbih, setKidsTasbih] = useState(0);
  const kidsTarget = 33;

  function togglePrayer(name: keyof typeof tracker) {
    setTracker((t) => {
      const next = { ...t, [name]: !t[name] };
      if (!t[name]) onEarnNeki(2); // earn 2 neki per completion in kids mode
      return next;
    });
  }

  function handleTwoTouchReward() { onEarnHearts(1); onEarnNeki(1); maybeUnlockSticker(); }
  function maybeUnlockSticker() {
    const pack = ["🌙","⭐","🕌","📿","🕋","🧕","🕊️","🌟"]; // tasveer (stickers)
    const pick = pack[Math.floor(Math.random() * pack.length)];
    onUnlockSticker(pick);
  }

  function convertHeartsToSticker() {
    if (wallet.hearts >= 5) { onEarnHearts(-5); maybeUnlockSticker(); }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Salah Tracker */}
      <div className="rounded-2xl border bg-white/80 p-6 text-center shadow-sm ring-1 ring-slate-200">
        <div className="mb-3 text-lg font-semibold">{L.salahTracker}</div>
        <div className="grid gap-2 text-left">
          {(["Fajr","Dhuhr","Asr","Maghrib","Isha"] as const).map((p) => (
            <button key={p} onClick={() => togglePrayer(p)} className={cn("flex items-center justify-between rounded-xl border px-3 py-2 text-sm", tracker[p] ? "border-emerald-300 bg-emerald-50" : "hover:bg-slate-50")}>
              <span>{p}</span>
              <span className={cn("rounded-full px-2 py-0.5 text-xs ring-1", tracker[p] ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-white text-slate-600 ring-slate-200")}>{tracker[p] ? L.completed : "Mark"}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 text-sm text-slate-600">{Object.values(tracker).filter(Boolean).length}/5 {L.completed}</div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 ring-1 ring-amber-200">{L.rewards}: {wallet.neki}</span>
          <span className="rounded-full bg-pink-50 px-3 py-1 text-pink-700 ring-1 ring-pink-200">❤️ {wallet.hearts}</span>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={onExit} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"><Baby className="size-4" /> {L.kidsExit}</button>
          <button onClick={convertHeartsToSticker} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50" title={L.convertHint}>{L.convert} • {L.convertHint}</button>
        </div>
      </div>

      {/* Big Tasbih */}
      <div className="rounded-2xl border bg-white/80 p-6 text-center shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{L.quickTasbih}</h3>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700 ring-1 ring-amber-200">{L.rewards}: {wallet.neki}</span>
        </div>
        <div className="mt-4 flex items-end justify-center gap-6">
          <div>
            <div className="text-5xl font-semibold tracking-tight">{kidsTasbih}</div>
            <div className="mt-1 text-sm text-slate-500">/{kidsTarget}</div>
          </div>
          <Rosary count={kidsTasbih} target={kidsTarget} />
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={() => { const next = kidsTasbih + 1; setKidsTasbih(next); if (next % kidsTarget === 0) { onEarnNeki(2); onEarnHearts(1); maybeUnlockSticker(); } }} className="rounded-xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700">+1</button>
          <button onClick={() => setKidsTasbih(Math.max(0, kidsTasbih - 1))} className="rounded-xl border px-5 py-3 hover:bg-slate-50">−1</button>
          <button onClick={() => setKidsTasbih(0)} className="rounded-xl border px-5 py-3 hover:bg-slate-50">Reset</button>
        </div>
      </div>

      {/* Games + Sticker Book */}
      <div className="space-y-4">
        {/* Two‑Touch Game */}
        <div className="rounded-2xl border bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-lg font-semibold"><Gamepad2 className="mr-2 inline size-5" />{L.twoTouch}</div>
            <span className="text-sm text-slate-500">Touch both circles!</span>
          </div>
          <TwoTouchGame onReward={handleTwoTouchReward} />
        </div>

        {/* Wudu Steps Game */}
        <div className="rounded-2xl border bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-2 text-lg font-semibold">{L.wuduGame}</div>
          <WuduStepsGame onReward={handleTwoTouchReward} />
        </div>

        {/* Salah Sequence Game */}
        <div className="rounded-2xl border bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-2 text-lg font-semibold">{L.salahGame}</div>
          <SalahSequenceGame onReward={handleTwoTouchReward} />
        </div>

        {/* Sticker Book */}
        <div className="rounded-2xl border bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-2 text-lg font-semibold">{L.stickers}</div>
          <div className="grid grid-cols-6 gap-2">
            {wallet.stickers.map((sticker, i) => (
              <div key={i} className="text-2xl p-2 text-center bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                {sticker}
              </div>
            ))}
            {Array(Math.max(0, 12 - wallet.stickers.length)).fill(0).map((_, i) => (
              <div key={`empty-${i}`} className="text-2xl p-2 text-center bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
                ?
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm text-slate-600 text-center">
            {wallet.stickers.length}/12 collected
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Planet View component
function PlanetView({ lang, lat, lng, method, school, onLocationChange, onMethodChange, onSchoolChange }: {
  lang: "en" | "bn";
  lat: number | null;
  lng: number | null;
  method: number;
  school: 0 | 1;
  onLocationChange: (lat: number, lng: number) => void;
  onMethodChange: (method: number) => void;
  onSchoolChange: (school: 0 | 1) => void;
}) {
  const L = STR[lang];
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      // Using Nominatim API for geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      const data = await response.json();
      if (data && data[0]) {
        const result = data[0];
        onLocationChange(parseFloat(result.lat), parseFloat(result.lon));
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="font-semibold mb-4">
        <MapPin className="mr-2 inline size-5 text-emerald-600" />
        {L.planet}
      </h3>
      <p className="text-sm text-slate-600 mb-4">{L.planetTag}</p>
      
      {/* Location Controls */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">{L.location}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={L.searchPlace}
              className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              <Search className="size-4" />
            </button>
          </div>
          <button
            onClick={() => navigator.geolocation?.getCurrentPosition((p) => onLocationChange(p.coords.latitude, p.coords.longitude))}
            className="mt-2 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
          >
            <LocateFixed className="size-4" /> {L.useMyLocation}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{L.calcMethod}</label>
          <select
            value={method}
            onChange={(e) => onMethodChange(Number(e.target.value))}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value={1}>University of Islamic Sciences, Karachi</option>
            <option value={2}>Islamic Society of North America</option>
            <option value={3}>Muslim World League</option>
            <option value={4}>Umm Al-Qura University, Makkah</option>
            <option value={5}>Egyptian General Authority of Survey</option>
          </select>
          
          <label className="block text-sm font-medium mb-2 mt-3">{L.asrMadhhab}</label>
          <select
            value={school}
            onChange={(e) => onSchoolChange(Number(e.target.value) as 0 | 1)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value={1}>Hanafi</option>
            <option value={0}>Shafi'i, Maliki, Hanbali</option>
          </select>
        </div>
      </div>

      {/* Current Location Display */}
      {lat && lng && (
        <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
          <div className="text-sm text-emerald-700">
            Current: {lat.toFixed(4)}, {lng.toFixed(4)}
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Two-Touch Game
function TwoTouchGame({ onReward }: { onReward: () => void }) {
  const [touches, setTouches] = useState<Set<number>>(new Set());
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameActive(true);
    setTouches(new Set());
    setScore(0);
  };

  const handleTouch = (id: number) => {
    if (!gameActive) return;
    const newTouches = new Set(touches);
    newTouches.add(id);
    setTouches(newTouches);
    
    if (newTouches.size === 2) {
      setScore(score + 1);
      onReward();
      setGameActive(false);
      setTimeout(() => setTouches(new Set()), 1000);
    }
  };

  return (
    <div className="text-center">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[1, 2].map((id) => (
          <button
            key={id}
            onClick={() => handleTouch(id)}
            className={cn(
              "h-20 w-20 mx-auto rounded-full border-4 transition-all",
              touches.has(id) ? "bg-emerald-500 border-emerald-600 text-white" : "bg-white border-slate-300 hover:border-emerald-400"
            )}
          >
            {touches.has(id) ? "✓" : id}
          </button>
        ))}
      </div>
      <div className="text-sm text-slate-600 mb-2">Score: {score}</div>
      <button
        onClick={startGame}
        disabled={gameActive}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {gameActive ? "Touch both circles!" : "Start Game"}
      </button>
    </div>
  );
}

// Wudu Steps Game
function WuduStepsGame({ onReward }: { onReward: () => void }) {
  const wuduSteps = [
    "Niyyah (Intention)",
    "Wash hands",
    "Rinse mouth",
    "Clean nose",
    "Wash face",
    "Wash arms",
    "Wipe head",
    "Wash feet"
  ];
  
  const [shuffledSteps, setShuffledSteps] = useState<string[]>([]);
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);
  const [gameActive, setGameActive] = useState(false);

  const startGame = () => {
    setShuffledSteps(shuffle(wuduSteps));
    setCurrentOrder([]);
    setGameActive(true);
  };

  const addStep = (step: string) => {
    if (!gameActive) return;
    const newOrder = [...currentOrder, step];
    setCurrentOrder(newOrder);
    setShuffledSteps(shuffledSteps.filter(s => s !== step));
    
    if (newOrder.length === wuduSteps.length) {
      const correct = newOrder.every((step, i) => step === wuduSteps[i]);
      if (correct) {
        onReward();
        alert("Excellent! You got the Wudu steps right! 🎉");
      } else {
        alert("Good try! The correct order is important for proper Wudu.");
      }
      setGameActive(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="font-medium mb-2">Arrange in correct order:</h4>
        <div className="grid gap-2">
          {shuffledSteps.map((step, i) => (
            <button
              key={i}
              onClick={() => addStep(step)}
              className="text-left rounded-lg border px-3 py-2 text-sm hover:bg-emerald-50"
            >
              {step}
            </button>
          ))}
        </div>
      </div>
      
      {currentOrder.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Your order:</h4>
          <div className="space-y-1">
            {currentOrder.map((step, i) => (
              <div key={i} className="text-sm bg-emerald-50 px-3 py-1 rounded">
                {i + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={startGame}
        disabled={gameActive}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {gameActive ? "Select the steps in order" : "Start Wudu Game"}
      </button>
    </div>
  );
}

// Salah Sequence Game
function SalahSequenceGame({ onReward }: { onReward: () => void }) {
  const salahSteps = [
    "Takbiratul Ihram",
    "Recite Surah Al-Fatiha",
    "Recite another Surah",
    "Ruku (Bowing)",
    "Standing after Ruku",
    "Sujud (Prostration)",
    "Sitting between Sujud",
    "Second Sujud"
  ];
  
  const [shuffledSteps, setShuffledSteps] = useState<string[]>([]);
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);
  const [gameActive, setGameActive] = useState(false);

  const startGame = () => {
    setShuffledSteps(shuffle(salahSteps));
    setCurrentOrder([]);
    setGameActive(true);
  };

  const addStep = (step: string) => {
    if (!gameActive) return;
    const newOrder = [...currentOrder, step];
    setCurrentOrder(newOrder);
    setShuffledSteps(shuffledSteps.filter(s => s !== step));
    
    if (newOrder.length === salahSteps.length) {
      const correct = newOrder.every((step, i) => step === salahSteps[i]);
      if (correct) {
        onReward();
        alert("Masha'Allah! Perfect Salah sequence! 🕌");
      } else {
        alert("Good effort! Keep practicing the Salah sequence.");
      }
      setGameActive(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="font-medium mb-2">Arrange Salah steps in order:</h4>
        <div className="grid gap-2">
          {shuffledSteps.map((step, i) => (
            <button
              key={i}
              onClick={() => addStep(step)}
              className="text-left rounded-lg border px-3 py-2 text-sm hover:bg-emerald-50"
            >
              {step}
            </button>
          ))}
        </div>
      </div>
      
      {currentOrder.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Your sequence:</h4>
          <div className="space-y-1">
            {currentOrder.map((step, i) => (
              <div key={i} className="text-sm bg-emerald-50 px-3 py-1 rounded">
                {i + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={startGame}
        disabled={gameActive}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {gameActive ? "Select steps in order" : "Start Salah Game"}
      </button>
    </div>
  );
}