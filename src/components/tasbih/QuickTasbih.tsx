'use client';

import { useState } from 'react';

export function QuickTasbih() {
  const [count, setCount] = useState(0);
  const [target] = useState(33);

  const increment = () => {
    setCount(prev => prev + 1);
  };

  const reset = () => {
    setCount(0);
  };

  const progress = Math.min((count / target) * 100, 100);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Tasbih</h3>
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">سُبْحَانَ اللّٰهِ</div>
          <div className="text-3xl font-bold text-green-600 mb-2">{count}</div>
          <div className="text-sm text-gray-500">/ {target}</div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={increment}
            className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-green-700 transition-colors"
          >
            +1
          </button>
          <button
            onClick={reset}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}