
import React, { createContext, useContext, useState, ReactNode } from "react";

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
  }
};

// Create language context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create language provider
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key; // Fallback to key if translation not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
