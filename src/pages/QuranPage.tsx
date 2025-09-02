import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Play, Pause, RotateCcw, Heart, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Verse {
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  category: string;
}

const QuranPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { addPoints, user, updateUser } = useAuth();
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favoriteVerses, setFavoriteVerses] = useState<number[]>([]);
  const [readingStreak, setReadingStreak] = useState(0);

  const verses: Verse[] = [
    {
      arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
      transliteration: "Wa man yattaqillaha yaj'al lahu makhrajan",
      translation: "And whoever fears Allah - He will make for him a way out",
      reference: "Quran 65:2",
      category: "Trust in Allah"
    },
    {
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      transliteration: "Rabbana atina fi'd-dunya hasanatan wa fi'l-akhirati hasanatan wa qina 'adhab an-nar",
      translation: "Our Lord, give us good in this world and good in the next world and save us from the punishment of the Fire",
      reference: "Quran 2:201",
      category: "Dua"
    },
    {
      arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      transliteration: "Inna ma'al usri yusra",
      translation: "Indeed, with hardship comes ease",
      reference: "Quran 94:6",
      category: "Hope & Patience"
    },
    {
      arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
      transliteration: "Wa huwa ma'akum ayna ma kuntum",
      translation: "And He is with you wherever you are",
      reference: "Quran 57:4",
      category: "Allah's Presence"
    },
    {
      arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
      transliteration: "Fadhkuruni adhkurkum",
      translation: "So remember Me; I will remember you",
      reference: "Quran 2:152",
      category: "Remembrance"
    }
  ];

  const currentVerse = verses[currentVerseIndex];

  useEffect(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('favoriteVerses');
    if (saved) {
      setFavoriteVerses(JSON.parse(saved));
    }
    
    // Load reading streak
    const streak = localStorage.getItem('quranReadingStreak');
    if (streak) {
      setReadingStreak(parseInt(streak));
    }
  }, []);

  const nextVerse = () => {
    setCurrentVerseIndex((prev) => (prev + 1) % verses.length);
    // Award points for reading
    addPoints(5, 'Reading Quran');
    
    // Update reading count
    if (user) {
      const newCount = user.habits.quran.completed + 1;
      const newStreak = Math.floor(newCount / 10); // New streak every 10 verses
      
      updateUser({
        habits: {
          ...user.habits,
          quran: {
            completed: newCount,
            streak: newStreak
          }
        }
      });
      
      setReadingStreak(newStreak);
      localStorage.setItem('quranReadingStreak', newStreak.toString());
    }
  };

  const previousVerse = () => {
    setCurrentVerseIndex((prev) => (prev - 1 + verses.length) % verses.length);
  };

  const toggleFavorite = (index: number) => {
    const newFavorites = favoriteVerses.includes(index)
      ? favoriteVerses.filter(i => i !== index)
      : [...favoriteVerses, index];
    
    setFavoriteVerses(newFavorites);
    localStorage.setItem('favoriteVerses', JSON.stringify(newFavorites));
    
    if (newFavorites.includes(index)) {
      addPoints(2, 'Adding verse to favorites');
    }
  };

  const playAudio = () => {
    // Simulate audio playback
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      addPoints(3, 'Listening to Quran recitation');
    }
  };

  const categories = [...new Set(verses.map(v => v.category))];
  const versesRead = user?.habits.quran.completed || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('quran')}</h1>
          <p className="text-lg text-gray-600 mb-6">
            Read, understand, and reflect upon the words of Allah
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-green-600">{versesRead}</div>
            <div className="text-gray-600">Verses Read</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-blue-600">{favoriteVerses.length}</div>
            <div className="text-gray-600">Favorite Verses</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600">{readingStreak}</div>
            <div className="text-gray-600">Reading Streak</div>
          </div>
        </div>

        {/* Main Verse Display */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          {/* Verse Category */}
          <div className="text-center mb-6">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {currentVerse.category}
            </span>
          </div>

          {/* Arabic Text */}
          <div className={`text-center mb-8 ${i18n.language === 'ar' ? 'text-4xl' : 'text-3xl'}`}>
            <div className="font-arabic leading-relaxed text-gray-900 mb-4" dir="rtl">
              {currentVerse.arabic}
            </div>
          </div>

          {/* Transliteration */}
          <div className="text-center mb-6">
            <div className="text-lg text-gray-700 italic leading-relaxed">
              {currentVerse.transliteration}
            </div>
          </div>

          {/* Translation */}
          <div className="text-center mb-6">
            <div className="text-xl text-gray-800 leading-relaxed font-medium">
              "{currentVerse.translation}"
            </div>
          </div>

          {/* Reference */}
          <div className="text-center mb-8">
            <div className="text-gray-600 font-medium">{currentVerse.reference}</div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center space-x-6 mb-6">
            <button
              onClick={previousVerse}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <RotateCcw className="h-6 w-6 text-gray-600" />
            </button>

            <button
              onClick={playAudio}
              className={`p-4 rounded-full transition-colors ${
                isPlaying 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-100 hover:bg-green-200 text-green-600'
              }`}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </button>

            <button
              onClick={() => toggleFavorite(currentVerseIndex)}
              className={`p-3 rounded-full transition-colors ${
                favoriteVerses.includes(currentVerseIndex)
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`h-6 w-6 ${favoriteVerses.includes(currentVerseIndex) ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Next Button */}
          <div className="text-center">
            <button
              onClick={nextVerse}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Next Verse (+5 points)
            </button>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Daily Quran Reading Goal</h3>
          <p className="text-gray-700 mb-4">
            Read 10 verses to complete your daily goal
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all"
              style={{ width: `${Math.min(100, (versesRead % 10) * 10)}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600">
            {versesRead % 10}/10 verses today
          </div>
        </div>

        {/* Kid-friendly encouragement */}
        <div className="mt-8 text-center">
          <div className="text-4xl mb-2">🌟</div>
          <p className="text-lg text-gray-700">
            {versesRead > 0 ? t('keepGoing') : "Start your Quranic journey today!"}
          </p>
        </div>
      </div>

      <style jsx>{`
        .font-arabic {
          font-family: 'Amiri', 'Times New Roman', serif;
        }
      `}</style>
    </div>
  );
};

export default QuranPage;