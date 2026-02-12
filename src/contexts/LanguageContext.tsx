import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "bn" | "ur" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation data
const translations = {
  en: {
    appTitle: "Islamic Habits",
    appSubtitle: "Build spiritual habits through interactive dhikr and earn rewards",
    welcomeBack: "Welcome back",
    rewards: "rewards",
    dhikr: "dhikr",
    gamingMode: "Gaming Mode",
    gamingModeDesc: "Interactive dhikr with rewards",
    dashboard: "Dashboard",
    dashboardDesc: "View your progress & rewards",
    signIn: "Sign In",
    signInDesc: "Save your progress",
    quickSignIn: "Quick Sign In:",
    continueWithGoogle: "Continue with Google",
    continueWithApple: "Continue with Apple",
    features: "Features",
    feature1: "Interactive gaming mode with dhikr buttons",
    feature2: "Earn gold coins and rewards for each dhikr",
    feature3: "Multiple login options: Email, Phone, Google, Apple",
    feature4: "Track your spiritual progress over time",
    feature5: "Achievements and levels to unlock",
    feature6: "Kid-friendly interface with animations",
    totalRewards: "Total Rewards",
    totalDhikr: "Total Dhikr",
    home: "Home",
    backToHome: "Back to Home",
    subhanallah: "Subhanallah",
    alhamdulillah: "Alhamdulillah",
    laIlahaIllallah: "La ilaha illallah",
    allahuAkbar: "Allahu Akbar",
    prayerTimes: "Prayer Times",
    qiblaDirection: "Qibla Direction",
  },
  bn: {
    appTitle: "ইসলামিক অভ্যাস",
    appSubtitle: "ইন্টারঅ্যাক্টিভ জিকিরের মাধ্যমে আধ্যাত্মিক অভ্যাস গড়ুন এবং পুরস্কার অর্জন করুন",
    welcomeBack: "ফিরে স্বাগতম",
    rewards: "পুরস্কার",
    dhikr: "জিকির",
    gamingMode: "গেমিং মোড",
    gamingModeDesc: "পুরস্কার সহ ইন্টারঅ্যাক্টিভ জিকির",
    dashboard: "ড্যাশবোর্ড",
    dashboardDesc: "আপনার অগ্রগতি এবং পুরস্কার দেখুন",
    signIn: "সাইন ইন",
    signInDesc: "আপনার অগ্রগতি সংরক্ষণ করুন",
    quickSignIn: "দ্রুত সাইন ইন:",
    continueWithGoogle: "গুগল দিয়ে চালিয়ে যান",
    continueWithApple: "অ্যাপল দিয়ে চালিয়ে যান",
    features: "বৈশিষ্ট্য",
    feature1: "জিকির বোতাম সহ ইন্টারঅ্যাক্টিভ গেমিং মোড",
    feature2: "প্রতিটি জিকিরের জন্য সোনার কয়েন এবং পুরস্কার অর্জন করুন",
    feature3: "একাধিক লগইন বিকল্প: ইমেইল, ফোন, গুগল, অ্যাপল",
    feature4: "সময়ের সাথে আপনার আধ্যাত্মিক অগ্রগতি ট্র্যাক করুন",
    feature5: "অর্জন এবং স্তর আনলক করুন",
    feature6: "অ্যানিমেশন সহ শিশু-বান্ধব ইন্টারফেস",
    totalRewards: "মোট পুরস্কার",
    totalDhikr: "মোট জিকির",
    home: "হোম",
    backToHome: "হোমে ফিরে যান",
    subhanallah: "সুবহানাল্লাহ",
    alhamdulillah: "আলহামদুলিল্লাহ",
    laIlahaIllallah: "লা ইলাহা ইল্লাল্লাহ",
    allahuAkbar: "আল্লাহু আকবার",
    prayerTimes: "নামাজের সময়",
    qiblaDirection: "কিবলার দিক",
  },
  ur: {
    appTitle: "اسلامی عادات",
    appSubtitle: "انٹرایکٹو ذکر کے ذریعے روحانی عادات بنائیں اور انعامات حاصل کریں",
    welcomeBack: "واپس خوش آمدید",
    rewards: "انعامات",
    dhikr: "ذکر",
    gamingMode: "گیمنگ موڈ",
    gamingModeDesc: "انعامات کے ساتھ انٹرایکٹو ذکر",
    dashboard: "ڈیش بورڈ",
    dashboardDesc: "اپنی پیش قدمی اور انعامات دیکھیں",
    signIn: "سائن ان",
    signInDesc: "اپنی پیش قدمی محفوظ کریں",
    quickSignIn: "فوری سائن ان:",
    continueWithGoogle: "گوگل کے ساتھ جاری رکھیں",
    continueWithApple: "ایپل کے ساتھ جاری رکھیں",
    features: "خصوصیات",
    feature1: "ذکر بٹنز کے ساتھ انٹرایکٹو گیمنگ موڈ",
    feature2: "ہر ذکر کے لیے سونے کے سکے اور انعامات حاصل کریں",
    feature3: "متعدد لاگ ان کے اختیارات: ای میل، فون، گوگل، ایپل",
    feature4: "وقت کے ساتھ اپنی روحانی پیش قدمی کو ٹریک کریں",
    feature5: "کامیابیاں اور لیولز کو کھولیں",
    feature6: "انیمیشن کے ساتھ بچوں کے لیے دوستانہ انٹرفیس",
    totalRewards: "کل انعامات",
    totalDhikr: "کل ذکر",
    home: "ہوم",
    backToHome: "ہوم واپس",
    subhanallah: "سبحان اللہ",
    alhamdulillah: "الحمد للہ",
    laIlahaIllallah: "لا الہ الا اللہ",
    allahuAkbar: "اللہ اکبر",
    prayerTimes: "نماز کے اوقات",
    qiblaDirection: "قبلہ کی سمت",
  },
  hi: {
    appTitle: "इस्लामी आदतें",
    appSubtitle: "इंटरैक्टिव जिक्र के माध्यम से आध्यात्मिक आदतें बनाएं और पुरस्कार अर्जित करें",
    welcomeBack: "वापस स्वागत है",
    rewards: "पुरस्कार",
    dhikr: "जिक्र",
    gamingMode: "गेमिंग मोड",
    gamingModeDesc: "पुरस्कारों के साथ इंटरैक्टिव जिक्र",
    dashboard: "डैशबोर्ड",
    dashboardDesc: "अपनी प्रगति और पुरस्कार देखें",
    signIn: "साइन इन",
    signInDesc: "अपनी प्रगति सहेजें",
    quickSignIn: "त्वरित साइन इन:",
    continueWithGoogle: "गूगल के साथ जारी रखें",
    continueWithApple: "ऐप्पल के साथ जारी रखें",
    features: "विशेषताएं",
    feature1: "जिक्र बटन के साथ इंटरैक्टिव गेमिंग मोड",
    feature2: "प्रत्येक जिक्र के लिए सोने के सिक्के और पुरस्कार अर्जित करें",
    feature3: "कई लॉगिन विकल्प: ईमेल, फोन, गूगल, ऐप्पल",
    feature4: "समय के साथ अपनी आध्यात्मिक प्रगति को ट्रैक करें",
    feature5: "उपलब्धियां और स्तर अनलॉक करें",
    feature6: "एनीमेशन के साथ बच्चों के लिए अनुकूल इंटरफेस",
    totalRewards: "कुल पुरस्कार",
    totalDhikr: "कुल जिक्र",
    home: "होम",
    backToHome: "होम पर वापस",
    subhanallah: "सुब्हानअल्लाह",
    alhamdulillah: "अल्हम्दुलिल्लाह",
    laIlahaIllallah: "ला इलाहा इल्लल्लाह",
    allahuAkbar: "अल्लाहु अकबर",
    prayerTimes: "नमाज़ के समय",
    qiblaDirection: "किब्ला दिशा",
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Load language from localStorage or detect browser language
    const savedLang = localStorage.getItem("islamicHabitsLanguage") as Language;
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
    } else {
      // Simple language detection from browser
      const browserLang = navigator.language.substring(0, 2);
      if (browserLang === "bn" || browserLang === "ur" || browserLang === "hi") {
        setLanguageState(browserLang as Language);
      }
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem("islamicHabitsLanguage", newLang);
  };

  const t = (translationKey: string): string => {
    return (
      translations[language][translationKey as keyof (typeof translations)[typeof language]] ||
      translationKey
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
