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

// Create comprehensive translations dictionary
const translations: Translations = {
  welcome: {
    en: "Welcome",
    ar: "أهلاً وسهلاً",
    fr: "Bienvenue"
  },
  dashboard: {
    en: "Dashboard",
    ar: "لوحة المعلومات",
    fr: "Tableau de bord"
  },
  appointments: {
    en: "Appointments",
    ar: "المواعيد الطبية",
    fr: "Rendez-vous médicaux"
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
    fr: "Se connecter"
  },
  register: {
    en: "Register",
    ar: "إنشاء حساب جديد",
    fr: "S'inscrire"
  },
  logout: {
    en: "Logout",
    ar: "تسجيل الخروج",
    fr: "Se déconnecter"
  },
  healthAssistant: {
    en: "AI Health Assistant",
    ar: "المساعد الطبي الذكي",
    fr: "Assistant médical IA"
  },
  overview: {
    en: "Overview",
    ar: "نظرة عامة",
    fr: "Vue d'ensemble"
  },
  name: {
    en: "Full Name",
    ar: "الاسم الكامل",
    fr: "Nom complet"
  },
  email: {
    en: "Email Address",
    ar: "عنوان البريد الإلكتروني",
    fr: "Adresse e-mail"
  },
  password: {
    en: "Password",
    ar: "كلمة المرور",
    fr: "Mot de passe"
  },
  emergencyHotline: {
    en: "Emergency Hotline",
    ar: "خط الطوارئ الطبية",
    fr: "Ligne d'urgence médicale"
  },
  phoneNumber: {
    en: "Phone Number",
    ar: "رقم الهاتف",
    fr: "Numéro de téléphone"
  },
  bookAppointment: {
    en: "Book Medical Appointment",
    ar: "حجز موعد طبي",
    fr: "Prendre un rendez-vous médical"
  },
  selectDoctor: {
    en: "Choose Your Doctor",
    ar: "اختر طبيبك المعالج",
    fr: "Choisir votre médecin"
  },
  selectDate: {
    en: "Select Appointment Date",
    ar: "اختر تاريخ الموعد",
    fr: "Sélectionner la date du rendez-vous"
  },
  selectTime: {
    en: "Choose Time Slot",
    ar: "اختر توقيت الموعد",
    fr: "Choisir l'heure du rendez-vous"
  },
  reason: {
    en: "Reason for Visit",
    ar: "سبب الزيارة الطبية",
    fr: "Motif de la consultation"
  },
  submit: {
    en: "Submit Request",
    ar: "إرسال الطلب",
    fr: "Soumettre la demande"
  },
  cancel: {
    en: "Cancel",
    ar: "إلغاء",
    fr: "Annuler"
  },
  welcomeToIntelejHosp: {
    en: "Welcome to IntelEJ Medical Center",
    ar: "مرحباً بكم في المركز الطبي إنتلج",
    fr: "Bienvenue au Centre Médical IntelEJ"
  },
  yourHealthIsOurPriority: {
    en: "Your health is our top priority. Access your medical information and healthcare services securely and privately.",
    ar: "صحتكم هي أولويتنا العليا. اطلعوا على معلوماتكم الطبية والخدمات الصحية بأمان وخصوصية تامة.",
    fr: "Votre santé est notre priorité absolue. Accédez à vos informations médicales et services de santé en toute sécurité et confidentialité."
  },
  patientPortal: {
    en: "Patient Portal",
    ar: "بوابة المرضى",
    fr: "Portail des patients"
  },
  doctorPortal: {
    en: "Medical Staff Portal",
    ar: "بوابة الكادر الطبي",
    fr: "Portail du personnel médical"
  },
  patientLogin: {
    en: "Patient Access",
    ar: "دخول المرضى",
    fr: "Accès patients"
  },
  doctorLogin: {
    en: "Staff Access",
    ar: "دخول الكادر الطبي",
    fr: "Accès personnel médical"
  },
  whyChooseIntelejHosp: {
    en: "Why Choose IntelEJ Medical Center?",
    ar: "لماذا تختار المركز الطبي إنتلج؟",
    fr: "Pourquoi choisir le Centre Médical IntelEJ ?"
  },
  localAndSecure: {
    en: "100% Secure & Private",
    ar: "آمن وخاص بنسبة ١٠٠٪",
    fr: "100% Sécurisé et Privé"
  },
  aiHealthAssistant: {
    en: "Advanced AI Medical Assistant",
    ar: "مساعد طبي ذكي متطور",
    fr: "Assistant médical IA avancé"
  },
  seamlessExperience: {
    en: "Seamless Healthcare Experience",
    ar: "تجربة رعاية صحية متكاملة",
    fr: "Expérience de soins de santé fluide"
  },
  contact: {
    en: "Contact Us",
    ar: "تواصل معنا",
    fr: "Nous contacter"
  },
  upcomingAppointments: {
    en: "Upcoming Medical Appointments",
    ar: "المواعيد الطبية القادمة",
    fr: "Prochains rendez-vous médicaux"
  },
  recentPrescriptions: {
    en: "Recent Medical Prescriptions",
    ar: "الوصفات الطبية الحديثة",
    fr: "Prescriptions médicales récentes"
  },
  noUpcomingAppointments: {
    en: "No upcoming appointments scheduled",
    ar: "لا توجد مواعيد طبية مجدولة",
    fr: "Aucun rendez-vous programmé"
  },
  noPrescriptions: {
    en: "No recent prescriptions available",
    ar: "لا توجد وصفات طبية حديثة",
    fr: "Aucune prescription récente disponible"
  },
  chatWithAi: {
    en: "Chat with AI Medical Assistant",
    ar: "تحدث مع المساعد الطبي الذكي",
    fr: "Discuter avec l'assistant médical IA"
  },
  intelejHospital: {
    en: "IntelEJ Medical Center",
    ar: "المركز الطبي إنتلج",
    fr: "Centre Médical IntelEJ"
  },
  projectCredits: {
    en: "ACADEMIC PROJECT",
    ar: "مشروع أكاديمي",
    fr: "PROJET ACADÉMIQUE"
  },
  forLastYearProject: {
    en: "UNIVERSITY OF IBN TOFAIL - FINAL YEAR PROJECT",
    ar: "جامعة ابن طفيل - مشروع السنة النهائية",
    fr: "UNIVERSITÉ IBN TOFAIL - PROJET DE FIN D'ÉTUDES"
  },
  projectDescription: {
    en: "Developing professional-grade healthcare management systems to enhance hospital efficiency and patient care quality.",
    ar: "تطوير أنظمة إدارة الرعاية الصحية على مستوى مهني لتحسين كفاءة المستشفيات وجودة رعاية المرضى.",
    fr: "Développement de systèmes de gestion de santé de niveau professionnel pour améliorer l'efficacité hospitalière et la qualité des soins aux patients."
  },
  continue: {
    en: "Continue",
    ar: "متابعة",
    fr: "Continuer"
  },
  quranVerse: {
    en: "And whoever saves a life, it is as if he has saved all of mankind",
    ar: "وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا",
    fr: "Et quiconque sauve une vie, c'est comme s'il avait sauvé toute l'humanité"
  },
  quranReference: {
    en: "- Quran 5:32",
    ar: "- القرآن الكريم ٥:٣٢",
    fr: "- Coran 5:32"
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
