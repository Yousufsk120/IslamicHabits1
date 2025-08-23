import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextPrayerCard } from '@/components/prayer/NextPrayerCard';
import { QuickTasbih } from '@/components/tasbih/QuickTasbih';
import { TodayHabits } from '@/components/habits/TodayHabits';
import { ProgressRing } from '@/components/ui/ProgressRing';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            السلام عليكم
          </h1>
          <p className="text-gray-600">{session.user?.name || 'User'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Next Prayer Card */}
      <div className="mb-6">
        <NextPrayerCard />
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Today's Progress</h3>
          <ProgressRing progress={75} size={60} />
          <p className="text-xs text-gray-500 mt-1">7/10 habits completed</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Neki Balance</h3>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-green-600">150</span>
            <span className="text-xs text-gray-500 ml-1">coins</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">+25 today</p>
        </div>
      </div>

      {/* Quick Tasbih */}
      <div className="mb-6">
        <QuickTasbih />
      </div>

      {/* Today's Habits */}
      <div className="mb-6">
        <TodayHabits />
      </div>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          <button className="flex flex-col items-center py-2 text-green-600">
            <div className="w-6 h-6 mb-1">🏠</div>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <div className="w-6 h-6 mb-1">🕌</div>
            <span className="text-xs">Prayer</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <div className="w-6 h-6 mb-1">✅</div>
            <span className="text-xs">Habits</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <div className="w-6 h-6 mb-1">📿</div>
            <span className="text-xs">Tasbih</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <div className="w-6 h-6 mb-1">⚙️</div>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}