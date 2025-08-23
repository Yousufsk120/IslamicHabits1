import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextPrayerCard } from '@/components/prayer/NextPrayerCard';
import { QuickTasbih } from '@/components/tasbih/QuickTasbih';
import { TodayHabits } from '@/components/habits/TodayHabits';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { BottomNavigation } from '@/components/ui/BottomNavigation';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="flex items-center justify-center">
              <ProgressRing progress={75} size={60} />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">7/10 habits completed</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Neki Balance</h3>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-green-600">150</span>
              <span className="text-xs text-gray-500 ml-1">coins</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">+25 today</p>
          </div>
        </div>

        {/* Quick Tasbih */}
        <div className="mb-6">
          <QuickTasbih />
        </div>

        {/* Today's Habits */}
        <div className="mb-20">
          <TodayHabits />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}