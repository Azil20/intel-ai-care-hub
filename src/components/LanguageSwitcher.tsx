
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  // Function to handle language change with localStorage
  const handleLanguageChange = (lang: "en" | "ar" | "fr") => {
    setLanguage(lang);
    localStorage.setItem("language", lang); // Ensure browser stores language preference locally
    
    // Apply RTL/LTR to the document
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">
            {language === "ar" ? "تغيير اللغة" : language === "fr" ? "Changer de langue" : "Toggle language"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("en")} 
          className={language === "en" ? "bg-muted" : ""}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("fr")} 
          className={language === "fr" ? "bg-muted" : ""}
        >
          Français
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("ar")} 
          className={`${language === "ar" ? "bg-muted" : ""} font-arabic`}
        >
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
