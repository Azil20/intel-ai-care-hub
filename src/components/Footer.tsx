
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <footer className={`bg-gray-900 dark:bg-black text-white border-t border-gray-800 ${isArabic ? "rtl text-right" : ""}`}>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{isArabic ? "مستشفى إنتيلEJ" : "IntelEJ Hosp"}</h3>
            <p className="text-gray-400">{isArabic ? "توفير حلول رعاية صحية آمنة ومحلية." : "Providing secure, local healthcare solutions."}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{isArabic ? "تواصل معنا" : "Contact"}</h3>
            <p className="text-gray-400">Email: Mounir.Khaoulaf@uit.ac.ma</p>
            <p className="text-gray-400">WhatsApp Only: +212 629320292</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>© {new Date().getFullYear()} {isArabic ? "مستشفى إنتيلEJ" : "IntelEJ Hosp"}. {isArabic ? "كل الحقوق محفوظة." : "All rights reserved."}</p>
          <div className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent text-lg font-bold mt-2 inline-block">
            {isArabic ? "تم إنشاؤه بواسطة منير خولاف ومحمد عزري" : "Made by Mounir Khaoulaf and Mohamed Azri"}
          </div>
          <p className="mt-1 font-bold text-hospital-500 text-lg">
            {isArabic 
              ? "موقعنا يقدم مساعدة للمرضى باستخدام الذكاء الاصطناعي محلياً، بأمان وخصوصية أكبر"
              : "Our Website Provides Secure and Private Local AI Assistance for Patients"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
