import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider, useLanguage, Language } from "./contexts/LanguageContext";
import { LoginForm } from "./components/LoginForm";
import { GamingMode } from "./components/GamingMode";
import { PrayerTimesCard } from "./components/PrayerTimesCard";
import { QiblaCompass } from "./components/QiblaCompass";
import { UserDashboard } from "./components/UserDashboard";
import { HabitTracker } from "./components/HabitTracker";
import { ZakatCalculator } from "./components/ZakatCalculator";
import { IslamicCalendar } from "./components/IslamicCalendar";
import { Badges } from "./components/Badges";
import {
  User,
  LogIn,
  Gamepad2,
  Trophy,
  Chrome,
  Apple,
  Globe,
  Target,
  Calculator,
  Calendar,
  Award,
} from "lucide-react";

function AppContent() {
  const { user, loginWithGoogle, loginWithApple, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [view, setView] = useState<
    "home" | "gaming" | "dashboard" | "login" | "habits" | "zakat" | "calendar" | "badges"
  >("home");

  // Hash-based routing implementation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "home";
      if (
        ["home", "gaming", "dashboard", "login", "habits", "zakat", "calendar", "badges"].includes(
          hash,
        )
      ) {
        setView(
          hash as
            | "home"
            | "gaming"
            | "dashboard"
            | "login"
            | "habits"
            | "zakat"
            | "calendar"
            | "badges",
        );
      } else {
        setView("home");
        window.location.hash = "#home";
      }
    };

    // Set initial view based on hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const navigateTo = (newView: string) => {
    window.location.hash = `#${newView}`;
  };

  const availableLanguages = useMemo(
    () => [
      { code: "en", name: "English", flag: "🇺🇸" },
      { code: "bn", name: "বাংলা", flag: "🇧🇩" },
      { code: "ur", name: "اردو", flag: "🇵🇰" },
      { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    ],
    [],
  );

  const renderView = () => {
    switch (view) {
      case "gaming":
        return <GamingMode />;
      case "dashboard":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <UserDashboard onClose={() => navigateTo("home")} />
          </div>
        );
      case "login":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <LoginForm onClose={() => navigateTo("home")} />
          </div>
        );
      case "habits":
        return <HabitTracker onClose={() => navigateTo("home")} />;
      case "zakat":
        return <ZakatCalculator onClose={() => navigateTo("home")} />;
      case "calendar":
        return <IslamicCalendar onClose={() => navigateTo("home")} />;
      case "badges":
        return <Badges onClose={() => navigateTo("home")} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
            <div className="max-w-2xl mx-auto text-center p-8">
              {/* Language Selector */}
              <div className="mb-6">
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <Globe className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Language:</span>
                </div>
                <div className="flex justify-center space-x-2">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as Language)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        language === lang.code
                          ? "bg-green-600 text-white"
                          : "bg-white text-gray-700 hover:bg-green-50"
                      }`}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              <h1 className="text-5xl font-bold text-green-800 mb-4">{t("appTitle")}</h1>
              <p className="text-xl text-green-700 mb-12">{t("appSubtitle")}</p>

              {user && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {t("welcomeBack")}, {user.name}! 🌟
                  </h2>
                  <div className="flex justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      {user.rewards} {t("rewards")}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">📿</span>
                      {Object.values(user.dhikrCount).reduce((a, b) => a + b, 0)} {t("dhikr")}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => navigateTo("gaming")}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Gamepad2 className="w-8 h-8 mb-2 mx-auto" />
                  {t("gamingMode")}
                  <p className="text-sm font-normal opacity-90 mt-1">{t("gamingModeDesc")}</p>
                </button>

                <button
                  onClick={() => navigateTo("habits")}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-6 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Target className="w-8 h-8 mb-2 mx-auto" />
                  Habit Tracker
                  <p className="text-sm font-normal opacity-90 mt-1">
                    Track your daily Islamic habits
                  </p>
                </button>

                {user ? (
                  <button
                    onClick={() => navigateTo("dashboard")}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-6 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <User className="w-8 h-8 mb-2 mx-auto" />
                    {t("dashboard")}
                    <p className="text-sm font-normal opacity-90 mt-1">{t("dashboardDesc")}</p>
                  </button>
                ) : (
                  <button
                    onClick={() => navigateTo("login")}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <LogIn className="w-8 h-8 mb-2 mx-auto" />
                    {t("signIn")}
                    <p className="text-sm font-normal opacity-90 mt-1">{t("signInDesc")}</p>
                  </button>
                )}

                <button
                  onClick={() => navigateTo("badges")}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-6 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Award className="w-8 h-8 mb-2 mx-auto" />
                  Achievements
                  <p className="text-sm font-normal opacity-90 mt-1">View your badges & rewards</p>
                </button>
              </div>

              {/* Islamic Tools */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Islamic Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigateTo("zakat")}
                    className="flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 border-2 border-emerald-200 hover:border-emerald-300 text-emerald-700 font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <Calculator className="w-6 h-6" />
                    <span>Zakat Calculator</span>
                  </button>
                  <button
                    onClick={() => navigateTo("calendar")}
                    className="flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 border-2 border-emerald-200 hover:border-emerald-300 text-emerald-700 font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <Calendar className="w-6 h-6" />
                    <span>Islamic Calendar</span>
                  </button>
                </div>
              </div>

              {!user && (
                <div className="mb-8">
                  <p className="text-green-700 font-medium mb-4">{t("quickSignIn")}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={loginWithGoogle}
                      disabled={loading}
                      className="inline-flex items-center justify-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      <Chrome className="w-5 h-5 mr-2" />
                      {t("continueWithGoogle")}
                    </button>
                    <button
                      onClick={loginWithApple}
                      disabled={loading}
                      className="inline-flex items-center justify-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      <Apple className="w-5 h-5 mr-2" />
                      {t("continueWithApple")}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <PrayerTimesCard />
                <QiblaCompass />
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 text-left">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                  {t("features")}
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎮</span>
                    <span>{t("feature1")}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🪙</span>
                    <span>{t("feature2")}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📱</span>
                    <span>{t("feature3")}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📈</span>
                    <span>{t("feature4")}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    <span>{t("feature5")}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">👶</span>
                    <span>{t("feature6")}</span>
                  </div>
                </div>
              </div>

              <footer className="mt-8 text-green-700">
                {import.meta.env.DEV && (
                  <p className="text-sm">Built with Vite + React + Tailwind + Framer Motion</p>
                )}
              </footer>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {view !== "home" && view !== "gaming" && (
        <button
          onClick={() => navigateTo("home")}
          className="fixed top-4 left-4 z-40 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-gray-900 p-2 rounded-full shadow-lg transition-colors"
          title={t("backToHome")}
        >
          ←
        </button>
      )}

      {view === "gaming" && (
        <button
          onClick={() => navigateTo("home")}
          className="fixed top-4 left-4 z-40 bg-white/80 backdrop-blur-sm text-purple-700 hover:text-purple-900 p-3 rounded-full shadow-lg transition-colors"
          title={t("backToHome")}
        >
          ← {t("home")}
        </button>
      )}

      {(view === "habits" || view === "zakat" || view === "calendar" || view === "badges") && (
        <button
          onClick={() => navigateTo("home")}
          className="fixed top-4 left-4 z-40 bg-white/80 backdrop-blur-sm text-emerald-700 hover:text-emerald-900 p-3 rounded-full shadow-lg transition-colors"
          title={t("backToHome")}
        >
          ← Home
        </button>
      )}

      <AnimatePresence mode="wait">{renderView()}</AnimatePresence>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
        <SpeedInsights />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
