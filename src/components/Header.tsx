
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Phone, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSignIn = () => {
    navigate("/");
  };

  return (
    <header className="header-gradient text-white shadow-md">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">IntelEJ Hospital</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="tel:0612256568" className="flex items-center text-sm md:text-base hover:text-white/80">
            <Phone className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Emergency: </span>0612256568
          </a>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white hover:bg-white/20"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm md:text-base">
                Welcome, {user.role === "doctor" ? "Dr. " : ""}{user.name}
              </span>
              <Button variant="outline" className="border-white text-white hover:text-primary hover:bg-white" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="border-white text-white hover:text-primary hover:bg-white" onClick={handleSignIn}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
