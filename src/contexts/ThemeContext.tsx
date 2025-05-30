
import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeType = "dark";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Force dark theme only
  const [theme] = useState<ThemeType>("dark");

  useEffect(() => {
    // Apply dark theme to document
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
    
    // Set theme color meta tag for mobile browsers
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", "#0a0a0a");
    }
    
    // Apple-specific meta tag for status bar appearance
    const metaAppleStatusBar = document.querySelector("meta[name=apple-mobile-web-app-status-bar-style]");
    if (!metaAppleStatusBar) {
      const newMeta = document.createElement("meta");
      newMeta.setAttribute("name", "apple-mobile-web-app-status-bar-style");
      newMeta.setAttribute("content", "black-translucent");
      document.head.appendChild(newMeta);
    } else {
      metaAppleStatusBar.setAttribute("content", "black-translucent");
    }
  }, []);

  const toggleTheme = () => {
    // Disabled - force dark mode only
  };

  const setTheme = () => {
    // Disabled - force dark mode only
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
