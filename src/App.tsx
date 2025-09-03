import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <h1 className="text-4xl font-bold text-green-800 mb-8">Islamic Habits</h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Daily Counter</h2>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
              onClick={() => setCount((count) => count + 1)}
            >
              Count: {count}
            </button>
          </div>

          <div className="text-gray-600">
            <p className="mb-2">✨ Build good habits</p>
            <p className="mb-2">🕌 Stay connected to your faith</p>
            <p>📈 Track your progress</p>
          </div>
        </div>

        <footer className="mt-8 text-green-700">
          <p className="text-sm">Built with Vite + React + Tailwind</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
