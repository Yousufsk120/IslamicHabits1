import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languageOptions.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 hover:bg-white transition-colors ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}
      >
        <Languages className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage?.flag} {currentLanguage?.nativeName}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`absolute top-full mt-2 ${isRTL ? 'right-0' : 'left-0'} bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 min-w-[160px]`}
            >
              {languageOptions.map((option) => (
                <motion.button
                  key={option.code}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  onClick={() => handleLanguageChange(option.code)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    option.code === language ? 'bg-green-50 text-green-700' : 'text-gray-700'
                  } ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <span className="text-lg">{option.flag}</span>
                    <div>
                      <div className="font-medium">{option.nativeName}</div>
                      <div className="text-xs text-gray-500">{option.name}</div>
                    </div>
                    {option.code === language && (
                      <div className={`ml-auto ${isRTL ? 'ml-0 mr-auto' : ''}`}>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};