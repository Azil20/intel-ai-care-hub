
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
import { Sun, Moon, User, LogOut } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "./LanguageSwitcher"; // Import language switcher
import { useLanguage } from "@/contexts/LanguageContext";

const Header: React.FC = () => {
  const { user, logout, register } = useAuth();
  const { setTheme, theme } = useTheme();
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

  return (
    <header className={`bg-white dark:bg-gray-900 shadow-md ${dirClass}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/43612f72-7738-4bf9-9695-426ddabfecaf.png" 
            alt="Intelej Hosp Logo" 
            className="h-12 w-auto" 
          />
          <span className="font-bold text-2xl text-hospital-700 dark:text-hospital-300">
            {language === "ar" ? "مستشفى إنتيلEJ" : "IntelEJ Hospital"}
          </span>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Emergency Hotline Button */}
          <div className="hidden md:flex items-center mr-4">
            <span className="text-red-600 font-semibold">
              {t("emergencyHotline")}: 0612256568
            </span>
          </div>

          {/* Authentication */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <User className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {t("login")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                  <Button size="sm" className="bg-hospital-600 hover:bg-hospital-700">
                    {t("register")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                    <DialogHeader>
                      <DialogTitle>{t("register")}</DialogTitle>
                      <DialogDescription>
                        {language === "ar" 
                          ? "أنشئ حسابًا جديدًا للوصول إلى خدماتنا"
                          : "Create a new account to access our services"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">{t("name")}</Label>
                        <Input
                          id="name"
                          autoComplete="name"
                          {...registerForm.register("name", { required: true })}
                          dir={language === "ar" ? "rtl" : "ltr"}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">{t("email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          {...registerForm.register("email", { required: true })}
                          dir={language === "ar" ? "rtl" : "ltr"}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">{t("password")}</Label>
                        <Input
                          id="password"
                          type="password"
                          autoComplete="new-password"
                          {...registerForm.register("password", { required: true })}
                          dir={language === "ar" ? "rtl" : "ltr"}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">
                          {language === "ar" ? "نوع الحساب" : "Account Type"}
                        </Label>
                        <select
                          id="role"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                    <DialogFooter>
                      <Button type="submit">{t("register")}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Theme Toggler */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
