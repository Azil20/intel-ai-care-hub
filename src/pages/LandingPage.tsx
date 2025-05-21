import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BadgePlus, Heart, Shield, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  useEffect(() => {
    // Simple animation for elements with animate-on-scroll class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { threshold: 0.1 });
    
    animateElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo and Verse Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 py-12 px-4">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex-shrink-0 animate-on-scroll">
            <img 
              src="/lovable-uploads/43612f72-7738-4bf9-9695-426ddabfecaf.png"
              alt="Intelej Hosp Logo"
              className="w-32 h-32 object-contain"
            />
          </div>
          <div className={`text-center ${isArabic ? "md:text-right" : "md:text-right"}`}>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-8 rounded-2xl shadow-lg border-2 border-amber-200 dark:border-amber-700 animate-on-scroll">
              <p className={`text-4xl md:text-5xl font-arabic ${isArabic ? "" : "rtl"} text-amber-800 dark:text-amber-300 leading-relaxed tracking-wide`} 
                style={{ 
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(to bottom, #d4af37 0%, #f9d342 50%, #d4af37 100%)',
                  WebkitBackgroundClip: 'text', 
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 700
                }}>
                "وَإِذا مَرِضتُ فَهُوَ يَشفينِ"
              </p>
              <p className="text-gray-700 dark:text-amber-200 mt-4 italic text-lg">
                {isArabic ? "وعندما أمرض، فهو الذي يشفيني" : "And when I am ill, it is He Who cures me"} - {isArabic ? "القرآن" : "Quran"} [26:80]
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 text-white py-20 px-4 text-center relative animate-on-scroll">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${isArabic ? "font-arabic" : ""}`}>
            {isArabic ? "مرحبا بكم في IntelEJ Hospital" : "Welcome to Intelej Hosp"}
          </h1>
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto mb-8 ${isArabic ? "font-arabic" : ""}`}>
            {isArabic ? 
              "صحتك هي أولويتنا. الوصول إلى معلوماتك الطبية والخدمات بشكل آمن ومحلي." :
              "Your health is our priority. Access your medical information and services securely and locally."
            }
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              size="lg" 
              className="bg-white text-blue-700 hover:bg-gray-100 hover:scale-105 transition-transform"
              onClick={() => navigate("/login/patient")}
            >
              {isArabic ? "بوابة المريض" : "Patient Portal"}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 hover:scale-105 transition-transform"
              onClick={() => navigate("/login/doctor")}
            >
              {isArabic ? "بوابة الطبيب" : "Doctor Portal"}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Login Cards Section */}
      <div className="container mx-auto my-12 px-4 relative z-10 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 border-blue-500 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 animate-on-scroll">
            <div className="mb-4 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <img 
                src="/lovable-uploads/43612f72-7738-4bf9-9695-426ddabfecaf.png" 
                alt="Patient Portal" 
                className="w-10 h-10 object-contain" 
              />
            </div>
            <h3 className={`text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4 ${isArabic ? "text-right" : ""}`}>
              {isArabic ? "بوابة المريض" : "Patient Portal"}
            </h3>
            <p className={`text-gray-600 dark:text-gray-300 mb-6 ${isArabic ? "text-right" : ""}`}>
              {isArabic ? 
                "الوصول إلى سجلاتك الطبية وتحديد المواعيد والدردشة مع مساعدنا الصحي الذكي." :
                "Access your medical records, schedule appointments, and chat with our AI health assistant."
              }
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
              onClick={() => navigate("/login/patient")}
            >
              {isArabic ? "تسجيل دخول المريض" : "Patient Login"}
            </Button>
          </Card>

          <Card className="p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 border-teal-500 bg-gradient-to-b from-white to-teal-50 dark:from-gray-800 dark:to-gray-900 animate-on-scroll">
            <div className="mb-4 bg-teal-50 dark:bg-teal-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <img 
                src="/lovable-uploads/43612f72-7738-4bf9-9695-426ddabfecaf.png" 
                alt="Doctor Portal" 
                className="w-10 h-10 object-contain" 
              />
            </div>
            <h3 className={`text-2xl font-semibold text-teal-600 dark:text-teal-300 mb-4 ${isArabic ? "text-right" : ""}`}>
              {isArabic ? "بوابة الطبيب" : "Doctor Portal"}
            </h3>
            <p className={`text-gray-600 dark:text-gray-300 mb-6 ${isArabic ? "text-right" : ""}`}>
              {isArabic ? 
                "الوصول إلى معلومات المريض وإدارة المواعيد ومراجعة التاريخ الطبي." :
                "Access patient information, manage appointments, and review medical history."
              }
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800"
              onClick={() => navigate("/login/doctor")}
            >
              {isArabic ? "تسجيل دخول الطبيب" : "Doctor Login"}
            </Button>
          </Card>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-16 mt-12">
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isArabic ? "font-arabic" : ""} animate-on-scroll dark:text-gray-100`}>
            {isArabic ? "لماذا تختار IntelEJ Hospital؟" : "Why Choose Intelej Hosp?"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-md transition-all hover:-translate-y-2 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 animate-on-scroll">
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
                {isArabic ? "١٠٠٪ محلي وآمن" : "100% Local & Secure"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {isArabic ? 
                  "بياناتك لا تغادر جهازك أبدًا. خصوصية وأمان كاملان." : 
                  "Your data never leaves your device. Complete privacy and security."
                }
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-md transition-all hover:-translate-y-2 bg-gradient-to-b from-white to-teal-50 dark:from-gray-800 dark:to-gray-900 animate-on-scroll">
              <div className="mx-auto bg-teal-100 dark:bg-teal-900/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <BadgePlus className="h-8 w-8 text-teal-600 dark:text-teal-300" />
              </div>
              <h3 className="text-xl font-semibold text-teal-600 dark:text-teal-300 mb-2">
                {isArabic ? "مساعد صحي ذكي" : "AI Health Assistant"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {isArabic ? 
                  "احصل على إجابات فورية لأسئلتك الصحية من نظامنا الذكي المحلي." : 
                  "Get instant answers to health questions from our local AI system."
                }
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-md transition-all hover:-translate-y-2 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 animate-on-scroll">
              <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-300 mb-2">
                {isArabic ? "تجربة سلسة" : "Seamless Experience"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {isArabic ? 
                  "سهولة جدولة المواعيد والتواصل مع أطبائك." : 
                  "Easy appointment scheduling and communication with your doctors."
                }
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Hospital Image Section */}
      <div className="container mx-auto my-16 px-4 animate-on-scroll">
        <div className="max-w-5xl mx-auto">
          <AspectRatio ratio={16 / 7} className="bg-muted rounded-xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop" 
              alt="Modern Hospital"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </AspectRatio>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            {isArabic ? 
              "تم تصميم مرافقنا المتطورة لراحتك ورعايتك" : 
              "Our state-of-the-art facilities are designed for your comfort and care"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
