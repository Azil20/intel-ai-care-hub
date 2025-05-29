
import React from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap, Users, Bot, Trophy, University, ChevronRight } from "lucide-react";

const AboutSection: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const isFrench = language === "fr";

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main heading */}
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 text-gradient ${isArabic ? "font-arabic" : ""}`}>
              {isArabic ? "عن مشروعنا" : 
               isFrench ? "À Propos de Notre Projet" : 
               "About Our Project"}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-sage-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          {/* Project Description Card */}
          <Card className="p-8 md:p-12 mb-12 glass-morphism shadow-2xl animate-on-scroll">
            <div className="flex items-start gap-6 mb-8">
              <div className="bg-sage-100 dark:bg-sage-900/30 p-4 rounded-2xl">
                <GraduationCap className="h-8 w-8 text-sage-600 dark:text-sage-300" />
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl md:text-3xl font-bold text-sage-700 dark:text-sage-300 mb-4 ${isArabic ? "font-arabic text-right" : ""}`}>
                  {isArabic ? "مشروع التخرج - جامعة ابن طفيل" :
                   isFrench ? "Projet de Fin d'Études - Université Ibn Tofail" :
                   "Final Year Project - Ibn Tofail University"}
                </h3>
                <p className={`text-lg leading-relaxed text-gray-700 dark:text-gray-300 ${isArabic ? "font-arabic text-right" : ""}`}>
                  {isArabic ? 
                    "هذا الموقع هو مشروع السنة الأخيرة من جامعة ابن طفيل. لقد قمنا بعمل مذهل في تصميم الموقع ووظائفه، كما استخدمنا في موقعنا أحدث التقنيات في هذا العصر وهي الذكاء الاصطناعي. قمنا بإنشاء الذكاء الاصطناعي الخاص بنا المسمى الرازي." :
                    isFrench ?
                    "Ce site web est notre projet de dernière année à l'Université Ibn Tofail. Nous avons accompli un travail incroyable dans le style et la fonctionnalité du site web. Nous utilisons également les dernières technologies de cette ère, qui est l'IA. Nous avons créé notre IA nommée Al-Rāzī." :
                    "This website is our final year project at Ibn Tofail University. We've accomplished incredible work in the website's style and functionality. We also use the latest technology of this era, which is AI. We created our AI named Al-Rāzī."
                  }
                </p>
              </div>
            </div>
          </Card>

          {/* AI Technology Section */}
          <Card className="p-8 md:p-12 mb-12 glass-morphism shadow-2xl animate-on-scroll">
            <div className="flex items-start gap-6 mb-8">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-2xl">
                <Bot className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-300 mb-4 ${isArabic ? "font-arabic text-right" : ""}`}>
                  {isArabic ? "التكنولوجيا المتطورة - الذكاء الاصطناعي" :
                   isFrench ? "Technologie Avancée - Intelligence Artificielle" :
                   "Advanced Technology - Artificial Intelligence"}
                </h3>
                <p className={`text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6 ${isArabic ? "font-arabic text-right" : ""}`}>
                  {isArabic ? 
                    "يستخدم مشروعنا أحدث تقنيات الذكاء الاصطناعي مع مساعدنا الطبي الذكي 'الرازي'، المسمى على اسم الطبيب الفارسي-العربي الأسطوري أبو بكر الرازي. هذا النظام يعمل محلياً لضمان أمان البيانات الطبية الكامل." :
                    isFrench ?
                    "Notre projet utilise les dernières technologies d'IA avec notre assistant médical intelligent 'Al-Rāzī', nommé d'après le légendaire médecin persan-arabe Abu Bakr al-Razi. Ce système fonctionne localement pour garantir une sécurité complète des données médicales." :
                    "Our project uses the latest AI technology with our intelligent medical assistant 'Al-Rāzī', named after the legendary Persian-Arab physician Abu Bakr al-Razi. This system works locally to ensure complete medical data security."
                  }
                </p>
                <div className="flex items-center gap-2 text-sage-600 dark:text-sage-300">
                  <ChevronRight className="h-5 w-5" />
                  <span className={`font-medium ${isArabic ? "font-arabic" : ""}`}>
                    {isArabic ? "نظام ذكي محلي آمن" :
                     isFrench ? "Système IA local sécurisé" :
                     "Secure Local AI System"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Team Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Creators */}
            <Card className="p-8 glass-morphism shadow-xl hover:shadow-2xl transition-all duration-300 animate-on-scroll">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <h4 className={`text-xl font-bold text-purple-600 dark:text-purple-300 mb-2 ${isArabic ? "font-arabic text-right" : ""}`}>
                    {isArabic ? "مطورو المشروع" :
                     isFrench ? "Créateurs du Projet" :
                     "Project Creators"}
                  </h4>
                  <div className={`space-y-2 ${isArabic ? "text-right" : ""}`}>
                    <p className={`text-gray-700 dark:text-gray-300 font-medium ${isArabic ? "font-arabic" : ""}`}>
                      Mounir Khaoulaf
                    </p>
                    <p className={`text-gray-700 dark:text-gray-300 font-medium ${isArabic ? "font-arabic" : ""}`}>
                      Mohamed Azri
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tutor */}
            <Card className="p-8 glass-morphism shadow-xl hover:shadow-2xl transition-all duration-300 animate-on-scroll">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl">
                  <University className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                </div>
                <div>
                  <h4 className={`text-xl font-bold text-amber-600 dark:text-amber-300 mb-2 ${isArabic ? "font-arabic text-right" : ""}`}>
                    {isArabic ? "المشرف الأكاديمي" :
                     isFrench ? "Tuteur Académique" :
                     "Academic Supervisor"}
                  </h4>
                  <p className={`text-gray-700 dark:text-gray-300 font-medium ${isArabic ? "font-arabic text-right" : ""}`}>
                    {isArabic ? "الأستاذ محمد أمناي" :
                     isFrench ? "Professeur Mohamed Amnai" :
                     "Professor Mohamed Amnai"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Achievement Banner */}
          <Card className="p-8 bg-gradient-to-r from-sage-500 to-blue-600 text-white shadow-2xl animate-on-scroll">
            <div className="flex items-center justify-center gap-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-300 animate-pulse-gentle" />
              <div>
                <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${isArabic ? "font-arabic" : ""}`}>
                  {isArabic ? "إنجاز متميز في التكنولوجيا الطبية" :
                   isFrench ? "Excellence en Technologie Médicale" :
                   "Excellence in Medical Technology"}
                </h3>
                <p className={`text-lg opacity-90 ${isArabic ? "font-arabic" : ""}`}>
                  {isArabic ? 
                    "مزج الابتكار مع الرعاية الصحية لمستقبل أفضل" :
                    isFrench ?
                    "Fusionner l'innovation avec les soins de santé pour un avenir meilleur" :
                    "Merging innovation with healthcare for a better future"
                  }
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-300 animate-pulse-gentle" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
