import React, { useState } from 'react'
import { Dua } from '../types'

const DUAS: Dua[] = [
  {
    id: '1',
    title: 'Morning Dua',
    arabicText: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Asbahna wa asbahal mulku lillahi, walhamdu lillah',
    translation: 'We have entered the morning and the dominion belongs to Allah, and praise is to Allah',
    category: 'Morning'
  },
  {
    id: '2',
    title: 'Evening Dua',
    arabicText: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Amseyna wa amsal mulku lillahi, walhamdu lillah',
    translation: 'We have entered the evening and the dominion belongs to Allah, and praise is to Allah',
    category: 'Evening'
  },
  {
    id: '3',
    title: 'Before Eating',
    arabicText: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah',
    category: 'Eating'
  },
  {
    id: '4',
    title: 'After Eating',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: 'Alhamdulillahil-ladhi at\'amana wa saqana wa ja\'alana muslimeen',
    translation: 'Praise be to Allah who fed us and gave us drink and made us Muslims',
    category: 'Eating'
  },
  {
    id: '5',
    title: 'Before Sleep',
    arabicText: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'In Your name, O Allah, I die and I live',
    category: 'Sleep'
  },
  {
    id: '6',
    title: 'Upon Waking',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdulillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur',
    translation: 'Praise be to Allah who brought us back to life after He caused us to die, and to Him is the resurrection',
    category: 'Morning'
  },
  {
    id: '7',
    title: 'Leaving Home',
    arabicText: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillahi tawakkaltu \'alallahi, la hawla wa la quwwata illa billah',
    translation: 'In the name of Allah, I trust in Allah, there is no power except with Allah',
    category: 'Travel'
  },
  {
    id: '8',
    title: 'Entering Home',
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ',
    transliteration: 'Allahumma inni as\'aluka khayral-mawlaji wa khayral-makhraji',
    translation: 'O Allah, I ask You for the best of entrances and the best of exits',
    category: 'Home'
  }
]

const CATEGORIES = ['All', 'Morning', 'Evening', 'Eating', 'Sleep', 'Travel', 'Home']

const DuaCollection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedDua, setExpandedDua] = useState<string | null>(null)

  const filteredDuas = DUAS.filter(dua => {
    const matchesCategory = selectedCategory === 'All' || dua.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const toggleExpanded = (duaId: string) => {
    setExpandedDua(expandedDua === duaId ? null : duaId)
  }

  return (
    <div className="islamic-card p-6">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Dua Collection</h2>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search duas..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 mb-4">
        Showing {filteredDuas.length} of {DUAS.length} duas
      </div>

      {/* Duas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDuas.map((dua) => {
          const isExpanded = expandedDua === dua.id
          
          return (
            <div
              key={dua.id}
              className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                isExpanded ? 'ring-2 ring-green-200' : ''
              }`}
              onClick={() => toggleExpanded(dua.id)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-800">{dua.title}</h3>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {dua.category}
                  </span>
                </div>
                <div className="text-gray-400">
                  {isExpanded ? '−' : '+'}
                </div>
              </div>

              {/* Arabic Text */}
              <div className="arabic-text text-lg text-green-800 mb-2 leading-relaxed">
                {dua.arabicText}
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Transliteration:</div>
                    <div className="text-sm text-gray-700 italic">
                      {dua.transliteration}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Translation:</div>
                    <div className="text-sm text-gray-700">
                      {dua.translation}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Preview */}
              {!isExpanded && (
                <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {dua.translation}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* No Results */}
      {filteredDuas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">No duas found</div>
          <div className="text-sm">Try adjusting your search or filter</div>
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-6 p-3 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-700 italic">
            "And your Lord said: 'Call upon Me; I will respond to you.'"
          </p>
          <p className="text-xs text-gray-600 mt-1">- Quran 40:60</p>
        </div>
      </div>
    </div>
  )
}

export default DuaCollection