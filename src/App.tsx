import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-emerald-800 mb-4">
            Islamic Habits
          </h1>
          <p className="text-lg md:text-xl text-emerald-700 max-w-2xl mx-auto">
            Build and maintain beneficial Islamic habits that bring you closer to Allah
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🕌</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Prayer Tracker</h3>
              <p className="text-gray-600">Keep track of your five daily prayers and build consistency</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quran Reading</h3>
              <p className="text-gray-600">Set goals for daily Quran recitation and track your progress</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Charity Giving</h3>
              <p className="text-gray-600">Record your charitable acts and maintain regular giving</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🤲</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Dhikr Counter</h3>
              <p className="text-gray-600">Count your daily remembrance of Allah and spiritual reflection</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🌙</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fasting Tracker</h3>
              <p className="text-gray-600">Track voluntary fasts and build spiritual discipline</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600">Connect with others on their Islamic journey</p>
            </div>
          </div>

          <div className="text-center bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Start Your Islamic Journey Today</h2>
            <p className="text-gray-600 mb-6">
              Join thousands of Muslims building better habits and strengthening their faith
            </p>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Get Started
            </button>
          </div>
        </main>

        <footer className="text-center mt-12 text-emerald-700">
          <p className="text-sm">
            "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose." - Quran 65:3
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App