import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, LogOut, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "./LanguageSwitcher";
import SocialLogin from "./SocialLogin";
import { useLanguage } from "@/contexts/LanguageContext";

const Header: React.FC = () => {
  const { user, logout, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
  const { t, language } = useLanguage();

  // Direction class for RTL/LTR
  const dirClass = language === "ar" ? "rtl text-right" : "ltr text-left";

  const registerForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "patient" as "patient" | "doctor",
    },
  });

  const onRegisterSubmit = async (data: {
    name: string;
    email: string;
    password: string;
    role: "patient" | "doctor";
  }) => {
    try {
      await register(data.name, data.email, data.password, data.role);
      toast({
        title: language === "ar" ? "تم التسجيل بنجاح" : "Registration Successful",
        description: language === "ar" 
          ? "تم إنشاء حسابك بنجاح"
          : "Your account has been created successfully",
      });
      setIsRegisterOpen(false);
      
      // Redirect to appropriate dashboard based on role
      if (data.role === "patient") {
        navigate("/patient-dashboard");
      } else {
        navigate("/doctor-dashboard");
      }
    } catch (error) {
      toast({
        title: language === "ar" ? "فشل التسجيل" : "Registration Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleLogin = (role: "patient" | "doctor") => {
    navigate(`/login/${role}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSocialLogin = (provider: string) => {
    // Handle social login integration here
    console.log(`Social login with ${provider}`);
  };

  return (
    <header className={`header-gradient ${dirClass} sticky top-0 z-50 font-sf`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="ios-logo">
            <img 
              src="/lovable-uploads/43612f72-7738-4bf9-9695-426ddabfecaf.png" 
              alt="IntelEJ Hospital Logo" 
              className="h-8 w-8 no-animation" 
            />
          </div>
          <span className="font-bold text-2xl text-gradient font-sf">
            {language === "ar" ? "مستشفى إنتيلEJ" : "IntelEJ Hospital"}
          </span>
        </Link>

        <div className="flex items-center space-x-6">
          {/* Emergency Hotline Button */}
          <div className="hidden md:flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
            <Phone className="h-4 w-4 text-red-500" />
            <span className="text-red-600 font-medium font-sf">
              {t("emergencyHotline")}: 911
            </span>
          </div>

          {/* Authentication */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative glass-morphism hover:clean-border text-white">
                  <User className="h-5 w-5 mr-2 text-clean-blue" />
                  <span className="hidden md:inline font-sf text-white">
                    {user.name || user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-morphism">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="glass-morphism hover:clean-border font-sf bg-white/90 text-gray-900 border-white/50 hover:bg-white hover:text-gray-900">
                    {t("login")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-morphism">
                  <DropdownMenuItem onClick={() => handleLogin("patient")}>
                    {language === "ar" ? "تسجيل دخول كمريض" : "Login as Patient"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLogin("doctor")}>
                    {language === "ar" ? "تسجيل دخول كطبيب" : "Login as Doctor"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="btn-modern font-sf">
                    {t("register")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-morphism border-clean-blue/30">
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                    <DialogHeader>
                      <DialogTitle className="font-sf">{t("register")}</DialogTitle>
                      <DialogDescription className="font-sf">
                        {language === "ar" 
                          ? "أنشئ حسابًا جديدًا للوصول إلى خدماتنا"
                          : "Create a new account to access our services"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="font-sf">{t("name")}</Label>
                        <Input
                          id="name"
                          autoComplete="name"
                          className="font-sf"
                          {...registerForm.register("name", { required: true })}
                          dir={language === "ar" ? "rtl" : "ltr"}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email" className="font-sf">{t("email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          className="font-sf"
                          {...registerForm.register("email", { required: true })}
                          dir={language === "ar" ? "rtl" : "ltr"}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password" className="font-sf">{t("password")}</Label>
                        <Input
                          id="password"
                          type="password"
                          autoComplete="new-password"
                          className="font-sf"
                          {...registerForm.register("password", { required: true })}
                          dir={language === "ar" ? "rtl" : "ltr"}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role" className="font-sf">
                          {language === "ar" ? "نوع الحساب" : "Account Type"}
                        </Label>
                        <select
                          id="role"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-sf"
                          {...registerForm.register("role")}
                          dir={language === "ar" ? "rtl" : "ltr"}
                        >
                          <option value="patient">
                            {language === "ar" ? "مريض" : "Patient"}
                          </option>
                          <option value="doctor">
                            {language === "ar" ? "طبيب" : "Doctor"}
                          </option>
                        </select>
                      </div>
                    </div>
                    
                    <SocialLogin onSocialLogin={handleSocialLogin} />
                    
                    <DialogFooter className="mt-6">
                      <Button type="submit" className="font-sf">{t("register")}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
