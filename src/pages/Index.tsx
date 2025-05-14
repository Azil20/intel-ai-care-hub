
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandingPage from "@/pages/LandingPage";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { language } = useLanguage();

  return (
    <div className={`min-h-screen flex flex-col ${language === "ar" ? "rtl" : ""}`}>
      <Header />
      <main className="flex-1">
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
