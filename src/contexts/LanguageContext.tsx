
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define available languages
type Language = "en" | "ar" | "fr";

// Define translations object structure
interface Translations {
  [key: string]: {
    en: string;
    ar: string;
    fr: string;
  };
}

// Create translations dictionary
const translations: Translations = {
  welcome: {
    en: "Welcome",
    ar: "مرحبًا",
    fr: "Bienvenue"
  },
  dashboard: {
    en: "Dashboard",
    ar: "لوحة التحكم",
    fr: "Tableau de bord"
  },
  appointments: {
    en: "Appointments",
    ar: "المواعيد",
    fr: "Rendez-vous"
  },
  patients: {
    en: "Patients",
    ar: "المرضى",
    fr: "Patients"
  },
  doctors: {
    en: "Doctors",
    ar: "الأطباء",
    fr: "Médecins"
  },
  login: {
    en: "Login",
    ar: "تسجيل الدخول",
    fr: "Connexion"
  },
  register: {
    en: "Register",
    ar: "تسجيل",
    fr: "S'inscrire"
  },
  logout: {
    en: "Logout",
    ar: "تسجيل الخروج",
    fr: "Déconnexion"
  },
  healthAssistant: {
    en: "Health Assistant",
    ar: "المساعد الصحي",
    fr: "Assistant santé"
  },
  overview: {
    en: "Overview",
    ar: "نظرة عامة",
    fr: "Vue d'ensemble"
  },
  name: {
    en: "Name",
    ar: "الاسم",
    fr: "Nom"
  },
  email: {
    en: "Email",
    ar: "البريد الإلكتروني",
    fr: "E-mail"
  },
  password: {
    en: "Password",
    ar: "كلمة المرور",
    fr: "Mot de passe"
  },
  emergencyHotline: {
    en: "Emergency Hotline",
    ar: "خط الطوارئ",
    fr: "Ligne d'urgence"
  },
  phoneNumber: {
    en: "Phone Number",
    ar: "رقم الهاتف",
    fr: "Numéro de téléphone"
  },
  bookAppointment: {
    en: "Book Appointment",
    ar: "حجز موعد",
    fr: "Prendre rendez-vous"
  },
  selectDoctor: {
    en: "Select Doctor",
    ar: "اختر الطبيب",
    fr: "Sélectionner un médecin"
  },
  selectDate: {
    en: "Select Date",
    ar: "اختر التاريخ",
    fr: "Sélectionner une date"
  },
  selectTime: {
    en: "Select Time",
    ar: "اختر الوقت",
    fr: "Sélectionner une heure"
  },
  reason: {
    en: "Reason",
    ar: "السبب",
    fr: "Raison"
  },
  submit: {
    en: "Submit",
    ar: "إرسال",
    fr: "Soumettre"
  },
  cancel: {
    en: "Cancel",
    ar: "إلغاء",
    fr: "Annuler"
  },
  welcomeToIntelejHosp: {
    en: "Welcome to IntelEJ Hospital",
    ar: "مرحبًا بكم في IntelEJ Hospital",
    fr: "Bienvenue à l'Hôpital IntelEJ"
  },
  yourHealthIsOurPriority: {
    en: "Your health is our priority. Access your medical information and services securely and locally.",
    ar: "صحتك هي أولويتنا. الوصول إلى معلوماتك الطبية والخدمات بشكل آمن ومحلي.",
    fr: "Votre santé est notre priorité. Accédez à vos informations médicales et services de manière sécurisée et locale."
  },
  patientPortal: {
    en: "Patient Portal",
    ar: "بوابة المريض",
    fr: "Portail patient"
  },
  doctorPortal: {
    en: "Doctor Portal",
    ar: "بوابة الطبيب",
    fr: "Portail médecin"
  },
  patientLogin: {
    en: "Patient Login",
    ar: "تسجيل دخول المريض",
    fr: "Connexion patient"
  },
  doctorLogin: {
    en: "Doctor Login",
    ar: "تسجيل دخول الطبيب",
    fr: "Connexion médecin"
  },
  whyChooseIntelejHosp: {
    en: "Why Choose IntelEJ Hospital?",
    ar: "لماذا تختار IntelEJ Hospital؟",
    fr: "Pourquoi choisir l'Hôpital IntelEJ ?"
  },
  localAndSecure: {
    en: "100% Local & Secure",
    ar: "١٠٠٪ محلي وآمن",
    fr: "100% Local et Sécurisé"
  },
  aiHealthAssistant: {
    en: "AI Health Assistant",
    ar: "مساعد صحي ذكي",
    fr: "Assistant Santé IA"
  },
  seamlessExperience: {
    en: "Seamless Experience",
    ar: "تجربة سلسة",
    fr: "Expérience Fluide"
  },
  contact: {
    en: "Contact",
    ar: "تواصل معنا",
    fr: "Contact"
  },
  upcomingAppointments: {
    en: "Upcoming Appointments",
    ar: "المواعيد القادمة",
    fr: "Rendez-vous à venir"
  },
  recentPrescriptions: {
    en: "Recent Prescriptions",
    ar: "الوصفات الطبية الأخيرة",
    fr: "Prescriptions récentes"
  },
  noUpcomingAppointments: {
    en: "No upcoming appointments",
    ar: "لا توجد مواعيد قادمة",
    fr: "Aucun rendez-vous à venir"
  },
  noPrescriptions: {
    en: "No recent prescriptions",
    ar: "لا توجد وصفات طبية حديثة",
    fr: "Aucune prescription récente"
  },
  chatWithAi: {
    en: "Chat with Health Assistant",
    ar: "الدردشة مع المساعد الصحي",
    fr: "Discuter avec l'Assistant Santé"
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
    return savedLang === 'ar' || savedLang === 'en' || savedLang === 'fr' ? savedLang : 'en';
  });

  // Update HTML lang attribute and direction when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', language);
    
    // Add appropriate font class to the body
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
      document.body.classList.remove('font-french');
    } else if (language === 'fr') {
      document.body.classList.add('font-french');
      document.body.classList.remove('font-arabic');
    } else {
      document.body.classList.remove('font-arabic', 'font-french');
    }
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
