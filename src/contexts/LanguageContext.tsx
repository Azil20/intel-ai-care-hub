
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define available languages
type Language = "en" | "ar";

// Define translations object structure
interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

// Create translations dictionary
const translations: Translations = {
  welcome: {
    en: "Welcome",
    ar: "مرحبًا"
  },
  dashboard: {
    en: "Dashboard",
    ar: "لوحة التحكم"
  },
  appointments: {
    en: "Appointments",
    ar: "المواعيد"
  },
  patients: {
    en: "Patients",
    ar: "المرضى"
  },
  doctors: {
    en: "Doctors",
    ar: "الأطباء"
  },
  login: {
    en: "Login",
    ar: "تسجيل الدخول"
  },
  register: {
    en: "Register",
    ar: "تسجيل"
  },
  logout: {
    en: "Logout",
    ar: "تسجيل الخروج"
  },
  healthAssistant: {
    en: "Health Assistant",
    ar: "المساعد الصحي"
  },
  overview: {
    en: "Overview",
    ar: "نظرة عامة"
  },
  name: {
    en: "Name",
    ar: "الاسم"
  },
  email: {
    en: "Email",
    ar: "البريد الإلكتروني"
  },
  password: {
    en: "Password",
    ar: "كلمة المرور"
  },
  emergencyHotline: {
    en: "Emergency Hotline",
    ar: "خط الطوارئ"
  },
  phoneNumber: {
    en: "Phone Number",
    ar: "رقم الهاتف"
  },
  bookAppointment: {
    en: "Book Appointment",
    ar: "حجز موعد"
  },
  selectDoctor: {
    en: "Select Doctor",
    ar: "اختر الطبيب"
  },
  selectDate: {
    en: "Select Date",
    ar: "اختر التاريخ"
  },
  selectTime: {
    en: "Select Time",
    ar: "اختر الوقت"
  },
  reason: {
    en: "Reason",
    ar: "السبب"
  },
  submit: {
    en: "Submit",
    ar: "إرسال"
  },
  cancel: {
    en: "Cancel",
    ar: "إلغاء"
  },
  welcomeToIntelejHosp: {
    en: "Welcome to Intelej Hosp",
    ar: "مرحبًا بكم في مستشفى إنتيلej"
  },
  yourHealthIsOurPriority: {
    en: "Your health is our priority. Access your medical information and services securely and locally.",
    ar: "صحتك هي أولويتنا. الوصول إلى معلوماتك الطبية والخدمات بشكل آمن ومحلي."
  },
  patientPortal: {
    en: "Patient Portal",
    ar: "بوابة المريض"
  },
  doctorPortal: {
    en: "Doctor Portal",
    ar: "بوابة الطبيب"
  },
  patientLogin: {
    en: "Patient Login",
    ar: "تسجيل دخول المريض"
  },
  doctorLogin: {
    en: "Doctor Login",
    ar: "تسجيل دخول الطبيب"
  },
  whyChooseIntelejHosp: {
    en: "Why Choose Intelej Hosp?",
    ar: "لماذا تختار مستشفى إنتيلej؟"
  },
  localAndSecure: {
    en: "100% Local & Secure",
    ar: "١٠٠٪ محلي وآمن"
  },
  aiHealthAssistant: {
    en: "AI Health Assistant",
    ar: "مساعد صحي ذكي"
  },
  seamlessExperience: {
    en: "Seamless Experience",
    ar: "تجربة سلسة"
  },
  contact: {
    en: "Contact",
    ar: "تواصل معنا"
  },
  upcomingAppointments: {
    en: "Upcoming Appointments",
    ar: "المواعيد القادمة"
  },
  recentPrescriptions: {
    en: "Recent Prescriptions",
    ar: "الوصفات الطبية الأخيرة"
  },
  noUpcomingAppointments: {
    en: "No upcoming appointments",
    ar: "لا توجد مواعيد قادمة"
  },
  noPrescriptions: {
    en: "No recent prescriptions",
    ar: "لا توجد وصفات طبية حديثة"
  },
  chatWithAi: {
    en: "Chat with Health Assistant",
    ar: "الدردشة مع المساعد الصحي"
  }
};

// Create language context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create language provider
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang === 'ar' || savedLang === 'en' ? savedLang : 'en';
  });

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key; // Fallback to key if translation not found
  };

  const isRtl = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
