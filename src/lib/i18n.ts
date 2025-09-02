import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      prayers: 'Prayer Times',
      quran: 'Quran',
      habits: 'Islamic Habits',
      rewards: 'Rewards',
      profile: 'Profile',
      
      // Authentication
      login: 'Login',
      logout: 'Logout',
      signup: 'Sign Up',
      loginWithGoogle: 'Login with Google',
      loginWithApple: 'Login with Apple',
      enterOTP: 'Enter OTP',
      phoneNumber: 'Phone Number',
      
      // Main content
      welcomeMessage: 'Welcome to Your Islamic Journey',
      subtitle: 'Build good habits, stay connected to your faith, and track your spiritual progress',
      startJourney: 'Start Your Journey',
      
      // Rewards
      totalPoints: 'Total Points',
      level: 'Level',
      nextLevel: 'Next Level',
      achievements: 'Achievements',
      
      // Habits
      dailyPrayers: 'Daily Prayers',
      quranReading: 'Quran Reading',
      dhikr: 'Dhikr & Remembrance',
      charity: 'Charity (Sadaqah)',
      
      // Kid-friendly messages
      greatJob: 'Great Job! 🌟',
      keepGoing: 'Keep Going! 💫',
      amazing: 'Amazing Progress! 🎉'
    }
  },
  ar: {
    translation: {
      home: 'الرئيسية',
      prayers: 'أوقات الصلاة',
      quran: 'القرآن',
      habits: 'العادات الإسلامية',
      rewards: 'المكافآت',
      profile: 'الملف الشخصي',
      
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      signup: 'إنشاء حساب',
      loginWithGoogle: 'تسجيل الدخول بجوجل',
      loginWithApple: 'تسجيل الدخول بآبل',
      enterOTP: 'أدخل رمز التحقق',
      phoneNumber: 'رقم الهاتف',
      
      welcomeMessage: 'مرحباً بك في رحلتك الإسلامية',
      subtitle: 'اكتسب عادات جيدة، ابق متصلاً بدينك، وتابع تقدمك الروحي',
      startJourney: 'ابدأ رحلتك',
      
      totalPoints: 'إجمالي النقاط',
      level: 'المستوى',
      nextLevel: 'المستوى التالي',
      achievements: 'الإنجازات',
      
      dailyPrayers: 'الصلوات اليومية',
      quranReading: 'قراءة القرآن',
      dhikr: 'الذكر والتسبيح',
      charity: 'الصدقة',
      
      greatJob: 'أحسنت! 🌟',
      keepGoing: 'استمر! 💫',
      amazing: 'تقدم رائع! 🎉'
    }
  },
  bn: {
    translation: {
      home: 'হোম',
      prayers: 'নামাজের সময়',
      quran: 'কুরআন',
      habits: 'ইসলামিক অভ্যাস',
      rewards: 'পুরস্কার',
      profile: 'প্রোফাইল',
      
      login: 'লগইন',
      logout: 'লগআউট',
      signup: 'সাইন আপ',
      loginWithGoogle: 'গুগল দিয়ে লগইন',
      loginWithApple: 'অ্যাপল দিয়ে লগইন',
      enterOTP: 'OTP প্রবেশ করুন',
      phoneNumber: 'ফোন নম্বর',
      
      welcomeMessage: 'আপনার ইসলামিক যাত্রায় স্বাগতম',
      subtitle: 'ভাল অভ্যাস গড়ুন, আপনার ধর্মের সাথে যুক্ত থাকুন, এবং আপনার আধ্যাত্মিক অগ্রগতি ট্র্যাক করুন',
      startJourney: 'আপনার যাত্রা শুরু করুন',
      
      totalPoints: 'মোট পয়েন্ট',
      level: 'লেভেল',
      nextLevel: 'পরবর্তী লেভেল',
      achievements: 'অর্জনসমূহ',
      
      dailyPrayers: 'দৈনিক নামাজ',
      quranReading: 'কুরআন পাঠ',
      dhikr: 'জিকির ও স্মরণ',
      charity: 'দান (সদকা)',
      
      greatJob: 'দুর্দান্ত কাজ! 🌟',
      keepGoing: 'চালিয়ে যান! 💫',
      amazing: 'অসাধারণ অগ্রগতি! 🎉'
    }
  },
  ur: {
    translation: {
      home: 'ہوم',
      prayers: 'نماز کے اوقات',
      quran: 'قرآن',
      habits: 'اسلامی عادات',
      rewards: 'انعامات',
      profile: 'پروفائل',
      
      login: 'لاگ ان',
      logout: 'لاگ آؤٹ',
      signup: 'سائن اپ',
      loginWithGoogle: 'گوگل سے لاگ ان',
      loginWithApple: 'ایپل سے لاگ ان',
      enterOTP: 'OTP داخل کریں',
      phoneNumber: 'فون نمبر',
      
      welcomeMessage: 'آپ کے اسلامی سفر میں خوش آمدید',
      subtitle: 'اچھی عادات بنائیں، اپنے ایمان سے جڑے رہیں، اور اپنی روحانی ترقی کو ٹریک کریں',
      startJourney: 'اپنا سفر شروع کریں',
      
      totalPoints: 'کل پوائنٹس',
      level: 'درجہ',
      nextLevel: 'اگلا درجہ',
      achievements: 'کامیابیاں',
      
      dailyPrayers: 'روزانہ نماز',
      quranReading: 'قرآن پڑھنا',
      dhikr: 'ذکر و تسبیح',
      charity: 'صدقہ',
      
      greatJob: 'شاباش! 🌟',
      keepGoing: 'جاری رکھیں! 💫',
      amazing: 'شاندار پیش قدمی! 🎉'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;