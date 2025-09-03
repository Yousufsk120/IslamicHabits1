import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { GamingMode } from "./components/GamingMode";
import { PrayerTimesCard } from "./components/PrayerTimesCard";
import { QiblaCompass } from "./components/QiblaCompass";
import { UserDashboard } from "./components/UserDashboard";
import { User, LogIn, Gamepad2, Trophy, Chrome, Apple } from "lucide-react";

function AppContent() {
  const { user, loginWithGoogle, loginWithApple, loading } = useAuth();
  const [view, setView] = useState<"home" | "gaming" | "dashboard" | "login">("home");

  const renderView = () => {
    switch (view) {
      case "gaming":
        return <GamingMode />;
      case "dashboard":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <UserDashboard onClose={() => setView("home")} />
          </div>
        );
      case "login":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <LoginForm onClose={() => setView("home")} />
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
            <div className="max-w-2xl mx-auto text-center p-8">
              <h1 className="text-5xl font-bold text-green-800 mb-4">Islamic Habits</h1>
              <p className="text-xl text-green-700 mb-12">
                Build spiritual habits through interactive dhikr and earn rewards
              </p>

              {user && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Welcome back, {user.name}! 🌟
                  </h2>
                  <div className="flex justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      {user.rewards} rewards
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">📿</span>
                      {Object.values(user.dhikrCount).reduce((a, b) => a + b, 0)} dhikr
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => setView("gaming")}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Gamepad2 className="w-8 h-8 mb-2 mx-auto" />
                  Gaming Mode
                  <p className="text-sm font-normal opacity-90 mt-1">
                    Interactive dhikr with rewards
                  </p>
                </button>

                {user ? (
                  <button
                    onClick={() => setView("dashboard")}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-6 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <User className="w-8 h-8 mb-2 mx-auto" />
                    Dashboard
                    <p className="text-sm font-normal opacity-90 mt-1">
                      View your progress & rewards
                    </p>
                  </button>
                ) : (
                  <button
                    onClick={() => setView("login")}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <LogIn className="w-8 h-8 mb-2 mx-auto" />
                    Sign In
                    <p className="text-sm font-normal opacity-90 mt-1">Save your progress</p>
                  </button>
                )}
              </div>

              {!user && (
                <div className="mb-8">
                  <p className="text-green-700 font-medium mb-4">Quick Sign In:</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={loginWithGoogle}
                      disabled={loading}
                      className="inline-flex items-center justify-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      <Chrome className="w-5 h-5 mr-2" />
                      Continue with Google
                    </button>
                    <button
                      onClick={loginWithApple}
                      disabled={loading}
                      className="inline-flex items-center justify-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      <Apple className="w-5 h-5 mr-2" />
                      Continue with Apple
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <PrayerTimesCard />
                <QiblaCompass />
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 text-left">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Features</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎮</span>
                    <span>Interactive gaming mode with dhikr buttons</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🪙</span>
                    <span>Earn gold coins and rewards for each dhikr</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📱</span>
                    <span>Multiple login options: Email, Phone, Google, Apple</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📈</span>
                    <span>Track your spiritual progress over time</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    <span>Achievements and levels to unlock</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">👶</span>
                    <span>Kid-friendly interface with animations</span>
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
          onClick={() => setView("home")}
          className="fixed top-4 left-4 z-40 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-gray-900 p-2 rounded-full shadow-lg transition-colors"
          title="Back to Home"
        >
          ←
        </button>
      )}

      {view === "gaming" && (
        <button
          onClick={() => setView("home")}
          className="fixed top-4 left-4 z-40 bg-white/80 backdrop-blur-sm text-purple-700 hover:text-purple-900 p-3 rounded-full shadow-lg transition-colors"
          title="Back to Home"
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
