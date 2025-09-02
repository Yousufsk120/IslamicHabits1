import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import PrayersPage from './pages/PrayersPage';
import QuranPage from './pages/QuranPage';
import HabitsPage from './pages/HabitsPage';
import RewardsPage from './pages/RewardsPage';
import ProfilePage from './pages/ProfilePage';
import './lib/i18n';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/prayers" element={<PrayersPage />} />
            <Route path="/quran" element={<QuranPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;