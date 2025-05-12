
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header-gradient text-white shadow-md">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">IntelEJ Hospital</span>
        </div>

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
          <Button variant="outline" className="border-white text-white hover:text-primary hover:bg-white" onClick={() => navigate("/")}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
