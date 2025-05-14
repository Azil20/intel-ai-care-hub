
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandingPage from "@/pages/LandingPage";
import { useLanguage } from "@/contexts/LanguageContext";
import WelcomePopup from "@/components/WelcomePopup";

const Index = () => {
  const { language } = useLanguage();
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className={`min-h-screen flex flex-col ${language === "ar" ? "rtl" : ""}`}>
      {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />}
      <Header />
      <main className="flex-1">
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
