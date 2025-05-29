import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BadgePlus, Heart, Shield, Star, Bot, Stethoscope, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isArabic = language === "ar";
  const isFrench = language === "fr";

  useEffect(() => {
    // Enhanced scroll-based animation observer
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered delay for multiple elements
          setTimeout(() => {
            entry.target.classList.add('animate-fade-in');
          }, index * 100);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '50px 0px -50px 0px'
    });
    
    animateElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo and Quran Verse Section */}
      <div className="bg-gradient-to-br from-sage-50 via-white to-sage-100 dark:from-gray-800 dark:to-gray-900 py-16 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="flex-shrink-0 animate-on-scroll">
            <img 
              src="/lovable-uploads/43612f72-7738-4bf9-9695-426ddabfecaf.png"
              alt="Intelej Hosp Logo"
              className="w-40 h-40 object-contain animate-float"
            />
          </div>
          <div className="text-center md:text-right">
            <div className="glass-morphism p-10 rounded-3xl shadow-2xl border-2 border-amber-200/50 dark:border-amber-700/50 animate-on-scroll">
              {/* Quran verse in Arabic (unchanged in all languages) */}
              <p className="text-5xl md:text-6xl font-arabic rtl text-gradient leading-relaxed tracking-wide mb-6" 
                style={{ 
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontWeight: 700
                }}>
                "وَإِذا مَرِضتُ فَهُوَ يَشفينِ"
              </p>
              <p className="text-gray-700 dark:text-amber-200 mt-6 italic text-xl font-medium">
                {isArabic 
                  ? "وعندما أمرض، فهو الذي يشفيني" 
                  : isFrench 
                    ? "Et quand je suis malade, c'est Lui qui me guérit"
                    : "And when I am ill, it is He Who cures me"
                } - {isArabic ? "القرآن الكريم" : isFrench ? "Saint Coran" : "Holy Quran"} [26:80]
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Modern Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sage-500 via-sage-600 to-sage-700 text-white py-24 px-4 text-center animate-on-scroll">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-sage-900/50 to-transparent"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <h1 className={`text-5xl md:text-7xl font-bold mb-8 leading-tight ${isArabic ? "font-arabic" : ""}`}>
            {isArabic ? "مرحباً بكم في Intelej Hosp" : 
             isFrench ? "Bienvenue à Intelej Hosp" : 
             "Welcome to Intelej Hosp"}
          </h1>
          
          <p className={`text-xl md:text-3xl max-w-4xl mx-auto mb-10 leading-relaxed ${isArabic ? "font-arabic" : ""}`}>
            {isArabic ? 
              "صحتك أولويتنا. استفد من الرازي، مساعدنا الطبي الذكي المسمى على اسم الطبيب الفارسي-العربي الأسطوري." :
              isFrench ?
              "Votre santé est notre priorité. Découvrez Al-Rāzī, notre assistant médical IA nommé d'après le légendaire médecin persan-arabe." :
              "Your health is our priority. Meet Al-Rāzī, our AI medical assistant named after the legendary Persian-Arab doctor."
            }
          </p>

          {/* CTA Buttons with Modern Styling */}
          <div className="flex justify-center gap-6 flex-wrap mb-8">
            <Button 
              size="lg" 
              className="bg-white text-sage-700 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl px-8 py-4 text-lg font-semibold rounded-xl"
              onClick={() => navigate("/login/patient")}
            >
              <Heart className="mr-2 h-5 w-5" />
              {isArabic ? "بوابة المريض" : isFrench ? "Portail Patient" : "Patient Portal"}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-xl px-8 py-4 text-lg font-semibold rounded-xl"
              onClick={() => navigate("/login/doctor")}
            >
              <Stethoscope className="mr-2 h-5 w-5" />
              {isArabic ? "بوابة الطبيب" : isFrench ? "Portail Médecin" : "Doctor Portal"}
            </Button>
          </div>

          {/* Al-Rāzī Introduction */}
          <div className="glass-morphism p-6 rounded-2xl max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="h-8 w-8 text-amber-300 animate-pulse-gentle" />
              <h3 className="text-2xl font-bold text-amber-300">
                {isArabic ? "الرازي - مساعدك الطبي الذكي" : 
                 isFrench ? "Al-Rāzī - Votre Assistant Médical IA" : 
                 "Al-Rāzī - Your AI Medical Assistant"}
              </h3>
            </div>
            <p className={`text-lg ${isArabic ? "font-arabic" : ""}`}>
              {isArabic ? 
                "مسمى على اسم أبو بكر الرازي، الطبيب الفارسي-العربي الأسطوري" :
                isFrench ?
                "Nommé d'après Abu Bakr al-Razi, le légendaire médecin persan-arabe" :
                "Named after Abu Bakr al-Razi, the legendary Persian-Arab physician"
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* Login Cards Section with Enhanced Design */}
      <div className="container mx-auto my-20 px-4 relative z-10 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Patient Portal Card */}
          <Card className="p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 border-t-4 border-sage-500 glass-morphism animate-on-scroll">
            <div className="mb-6 bg-sage-100 dark:bg-sage-900/30 p-4 rounded-2xl w-20 h-20 flex items-center justify-center">
              <Heart className="w-10 h-10 text-sage-600 animate-pulse-gentle" />
            </div>
            <h3 className={`text-3xl font-bold text-sage-700 dark:text-sage-300 mb-6 ${isArabic ? "text-right font-arabic" : ""}`}>
              {isArabic ? "بوابة المريض" : isFrench ? "Portail Patient" : "Patient Portal"}
            </h3>
            <p className={`text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed ${isArabic ? "text-right font-arabic" : ""}`}>
              {isArabic ? 
                "الوصول إلى سجلاتك الطبية، حجز المواعيد، والدردشة مع الرازي، مساعدنا الطبي الذكي المحلي الآمن." :
                isFrench ?
                "Accédez à vos dossiers médicaux, prenez rendez-vous et discutez avec Al-Rāzī, notre assistant médical IA local et sécurisé." :
                "Access your medical records, schedule appointments, and chat with Al-Rāzī, our secure local AI medical assistant."
              }
            </p>
            <Button 
              className="w-full btn-modern text-lg py-4"
              onClick={() => navigate("/login/patient")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              {isArabic ? "دخول المريض" : isFrench ? "Connexion Patient" : "Patient Login"}
            </Button>
          </Card>

          {/* Doctor Portal Card */}
          <Card className="p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 border-t-4 border-blue-500 glass-morphism animate-on-scroll">
            <div className="mb-6 bg-blue-100 dark:bg-blue-900/30 p-4 rounded-2xl w-20 h-20 flex items-center justify-center">
              <Stethoscope className="w-10 h-10 text-blue-600 animate-pulse-gentle" />
            </div>
            <h3 className={`text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6 ${isArabic ? "text-right font-arabic" : ""}`}>
              {isArabic ? "بوابة الطبيب" : isFrench ? "Portail Médecin" : "Doctor Portal"}
            </h3>
            <p className={`text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed ${isArabic ? "text-right font-arabic" : ""}`}>
              {isArabic ? 
                "الوصول إلى معلومات المرضى، إدارة المواعيد، مراجعة التاريخ الطبي والتعاون مع الرازي للتشخيص." :
                isFrench ?
                "Accédez aux informations des patients, gérez les rendez-vous, consultez l'historique médical et collaborez avec Al-Rāzī pour le diagnostic." :
                "Access patient information, manage appointments, review medical history, and collaborate with Al-Rāzī for diagnosis."
              }
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-lg py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              onClick={() => navigate("/login/doctor")}
            >
              <BadgePlus className="mr-2 h-5 w-5" />
              {isArabic ? "دخول الطبيب" : isFrench ? "Connexion Médecin" : "Doctor Login"}
            </Button>
          </Card>
        </div>
      </div>
      
      {/* Enhanced Features Section */}
      <div className="bg-gradient-to-br from-sage-50 via-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-24">
        <div className="container mx-auto px-4">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-16 text-gradient ${isArabic ? "font-arabic" : ""} animate-on-scroll`}>
            {isArabic ? "لماذا تختار Intelej Hosp؟" : 
             isFrench ? "Pourquoi choisir Intelej Hosp ?" : 
             "Why Choose Intelej Hosp?"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Security Feature */}
            <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-6 glass-morphism animate-on-scroll">
              <div className="mx-auto bg-sage-100 dark:bg-sage-900/30 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <Shield className="h-10 w-10 text-sage-600 dark:text-sage-300 animate-float" />
              </div>
              <h3 className={`text-2xl font-bold text-sage-700 dark:text-sage-300 mb-4 ${isArabic ? "font-arabic" : ""}`}>
                {isArabic ? "آمان كامل ومحلي" : 
                 isFrench ? "Sécurité Totale et Locale" : 
                 "Complete Local Security"}
              </h3>
              <p className={`text-gray-600 dark:text-gray-300 text-lg leading-relaxed ${isArabic ? "font-arabic" : ""}`}>
                {isArabic ? 
                  "بياناتك الطبية لا تغادر جهازك أبداً. الرازي يعمل محلياً بدون إنترنت لضمان خصوصيتك التامة." : 
                  isFrench ?
                  "Vos données médicales ne quittent jamais votre appareil. Al-Rāzī fonctionne localement sans internet pour garantir votre confidentialité totale." :
                  "Your medical data never leaves your device. Al-Rāzī works locally without internet for complete privacy."
                }
              </p>
            </Card>
            
            {/* AI Assistant Feature */}
            <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-6 glass-morphism animate-on-scroll">
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <Bot className="h-10 w-10 text-blue-600 dark:text-blue-300 animate-float" />
              </div>
              <h3 className={`text-2xl font-bold text-blue-600 dark:text-blue-300 mb-4 ${isArabic ? "font-arabic" : ""}`}>
                {isArabic ? "الرازي - المساعد الطبي الذكي" : 
                 isFrench ? "Al-Rāzī - Assistant Médical IA" : 
                 "Al-Rāzī - AI Medical Assistant"}
              </h3>
              <p className={`text-gray-600 dark:text-gray-300 text-lg leading-relaxed ${isArabic ? "font-arabic" : ""}`}>
                {isArabic ? 
                  "احصل على إجابات طبية فورية من الرازي، المدرب على أحدث المعرفة الطبية ومسمى على اسم الطبيب الأسطوري." : 
                  isFrench ?
                  "Obtenez des réponses médicales instantanées d'Al-Rāzī, formé sur les dernières connaissances médicales et nommé d'après le médecin légendaire." :
                  "Get instant medical answers from Al-Rāzī, trained on latest medical knowledge and named after the legendary physician."
                }
              </p>
            </Card>
            
            {/* User Experience Feature */}
            <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-6 glass-morphism animate-on-scroll">
              <div className="mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <Star className="h-10 w-10 text-purple-600 dark:text-purple-300 animate-float" />
              </div>
              <h3 className={`text-2xl font-bold text-purple-600 dark:text-purple-300 mb-4 ${isArabic ? "font-arabic" : ""}`}>
                {isArabic ? "تجربة متطورة ومتعددة اللغات" : 
                 isFrench ? "Expérience Avancée et Multilingue" : 
                 "Advanced Multilingual Experience"}
              </h3>
              <p className={`text-gray-600 dark:text-gray-300 text-lg leading-relaxed ${isArabic ? "font-arabic" : ""}`}>
                {isArabic ? 
                  "واجهة حديثة تدعم العربية والإنجليزية والفرنسية مع جدولة سهلة للمواعيد وتصميم متجاوب." : 
                  isFrench ?
                  "Interface moderne supportant l'arabe, l'anglais et le français avec planification facile des rendez-vous et design réactif." :
                  "Modern interface supporting Arabic, English, and French with easy appointment scheduling and responsive design."
                }
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Modern Hospital Image Section */}
      <div className="container mx-auto my-20 px-4 animate-on-scroll">
        <div className="max-w-6xl mx-auto">
          <AspectRatio ratio={16 / 8} className="bg-muted rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop" 
              alt="Modern Hospital"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className={`text-3xl font-bold mb-2 ${isArabic ? "font-arabic" : ""}`}>
                  {isArabic ? "مرافق متطورة للرعاية الصحية" :
                   isFrench ? "Installations de Soins de Santé Avancées" :
                   "State-of-the-Art Healthcare Facilities"}
                </h3>
                <p className={`text-xl ${isArabic ? "font-arabic" : ""}`}>
                  {isArabic ? 
                    "تم تصميم مرافقنا الحديثة لتوفير أفضل رعاية طبية ممكنة" : 
                    isFrench ?
                    "Nos installations modernes sont conçues pour offrir les meilleurs soins médicaux possibles" :
                    "Our modern facilities are designed to provide the best possible medical care"
                  }
                </p>
              </div>
            </div>
          </AspectRatio>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
