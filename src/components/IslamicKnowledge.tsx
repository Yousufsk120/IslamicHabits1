import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Heart, Star, ChevronRight } from "lucide-react";

interface IslamicKnowledgeProps {
  className?: string;
}

interface KnowledgeCard {
  type: "verse" | "hadith" | "dua";
  arabic: string;
  transliteration: string;
  translation: string;
  reference?: string;
  category: string;
}

export const IslamicKnowledge: React.FC<IslamicKnowledgeProps> = ({ className = "" }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const knowledgeCards: KnowledgeCard[] = [
    {
      type: "verse",
      arabic: "وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ",
      transliteration: "Wa dhakkir fa inna adh-dhikra tanfa'u al-mu'minin",
      translation: "And remind, for indeed, the reminder benefits the believers.",
      reference: "Quran 51:55",
      category: "Remembrance",
    },
    {
      type: "hadith",
      arabic:
        "مَنْ قَالَ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ فِي يَوْمٍ مِائَةَ مَرَّةٍ حُطَّتْ خَطَايَاهُ",
      transliteration:
        "Man qala subhanallaahi wa bihamdihi fi yawmin mi'ata marratin huttat khataayaahu",
      translation:
        "Whoever says 'Glory is to Allah and praise is to Him' one hundred times a day, his sins will be removed.",
      reference: "Sahih Bukhari",
      category: "Daily Dhikr",
    },
    {
      type: "dua",
      arabic:
        "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      transliteration:
        "Rabbana atina fi'd-dunya hasanatan wa fi'l-akhirati hasanatan wa qina 'adhab an-nar",
      translation:
        "Our Lord, give us good in this world and good in the next world, and save us from the punishment of the Fire.",
      reference: "Quran 2:201",
      category: "Daily Dua",
    },
    {
      type: "verse",
      arabic:
        "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      transliteration:
        "Alladhina amanu wa tatma'innu qulubuhum bi dhikr Allah. Ala bi dhikr Allah tatma'innu al-qulub",
      translation:
        "Those who believe and whose hearts find peace in the remembrance of Allah. Surely in the remembrance of Allah do hearts find peace.",
      reference: "Quran 13:28",
      category: "Peace of Heart",
    },
  ];

  const currentCard = knowledgeCards[currentCardIndex];

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % knowledgeCards.length);
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case "verse":
        return <BookOpen className="w-5 h-5 text-green-600" />;
      case "hadith":
        return <Star className="w-5 h-5 text-yellow-600" />;
      case "dua":
        return <Heart className="w-5 h-5 text-pink-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case "verse":
        return "from-green-50 to-green-100 border-green-200";
      case "hadith":
        return "from-yellow-50 to-yellow-100 border-yellow-200";
      case "dua":
        return "from-pink-50 to-pink-100 border-pink-200";
      default:
        return "from-gray-50 to-gray-100 border-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getCardIcon(currentCard.type)}
          <h3 className="text-xl font-bold text-gray-800 ml-2">Daily Knowledge</h3>
        </div>
        <button
          onClick={nextCard}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          title="Next card"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <motion.div
        key={currentCardIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-gradient-to-br ${getCardColor(currentCard.type)} border rounded-lg p-4`}
      >
        <div className="space-y-3">
          {/* Category Badge */}
          <div className="flex items-center justify-between">
            <span className="inline-block bg-white/70 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
              {currentCard.category}
            </span>
            <span className="text-xs font-medium capitalize opacity-75">{currentCard.type}</span>
          </div>

          {/* Arabic Text */}
          <div className="text-right">
            <p className="text-lg font-arabic leading-relaxed text-gray-800 mb-2">
              {currentCard.arabic}
            </p>
          </div>

          {/* Transliteration */}
          <div className="bg-white/50 rounded-lg p-3">
            <p className="text-sm italic text-gray-700 mb-2">{currentCard.transliteration}</p>

            {/* Translation */}
            <p className="text-sm text-gray-800 font-medium">"{currentCard.translation}"</p>
          </div>

          {/* Reference */}
          {currentCard.reference && (
            <div className="text-right">
              <p className="text-xs text-gray-600 font-medium">— {currentCard.reference}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {knowledgeCards.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentCardIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentCardIndex ? "bg-gray-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};
