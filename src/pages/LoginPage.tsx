
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail } from "lucide-react";
import SocialLogin from "@/components/SocialLogin";

const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showEmailConfirmAlert, setShowEmailConfirmAlert] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  // Set default credentials based on role for demo
  React.useEffect(() => {
    if (role === "patient") {
      setLoginEmail("patient@example.com");
    } else if (role === "doctor") {
      setLoginEmail("doctor@example.com");
    }
    setLoginPassword("password");
  }, [role]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowEmailConfirmAlert(false);
    
    try {
      // Validate role
      if (role !== "patient" && role !== "doctor") {
        throw new Error("Invalid role");
      }
      
      await login(loginEmail, loginPassword, role as "patient" | "doctor");
      
      // Redirect to appropriate dashboard
      if (role === "patient") {
        navigate("/patient-dashboard");
      } else {
        navigate("/doctor-dashboard");
      }
      
      toast({
        title: "Login Successful",
        description: `Welcome to IntelEJ Hospital ${role} portal`,
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password";
      
      // Show special alert for email confirmation errors
      if (errorMessage.includes('confirmation link')) {
        setShowEmailConfirmAlert(true);
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowEmailConfirmAlert(false);
    
    try {
      // Validate role
      if (role !== "patient" && role !== "doctor") {
        throw new Error("Invalid role");
      }
      
      // Validate passwords match
      if (registerPassword !== registerConfirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      await register(registerName, registerEmail, registerPassword, role as "patient" | "doctor");
      
      // If we get here, registration was successful and user is logged in
      if (role === "patient") {
        navigate("/patient-dashboard");
      } else {
        navigate("/doctor-dashboard");
      }
      
      toast({
        title: "Registration Successful",
        description: `Welcome to IntelEJ Hospital ${role} portal`,
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      
      // Show special handling for email confirmation
      if (errorMessage.includes('confirmation link')) {
        setShowEmailConfirmAlert(true);
        toast({
          title: "Registration Successful!",
          description: "Please check your email to confirm your account.",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} Login`,
      description: `${provider} login integration coming soon`,
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <Card className="w-full max-w-md p-6 shadow-xl bg-slate-800/50 border-slate-700 backdrop-blur-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            {role === "patient" ? "Patient Portal" : "Doctor Portal"}
          </h1>
          <p className="text-gray-400 mt-2">
            Access your {role === "patient" ? "patient" : "doctor"} account
          </p>
        </div>

        {showEmailConfirmAlert && (
          <Alert className="mb-6 border-blue-500 bg-blue-50 text-blue-900">
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Please check your email and click the confirmation link to activate your account. 
              Don't forget to check your spam folder if you don't see the email.
            </AlertDescription>
          </Alert>
        )}

        <Tabs 
          defaultValue="login" 
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-700">
            <TabsTrigger value="login" className="text-white data-[state=active]:bg-slate-600">Login</TabsTrigger>
            <TabsTrigger value="register" className="text-white data-[state=active]:bg-slate-600">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              <Button 
                type="submit" 
                className={`w-full ${role === "patient" ? "bg-blue-600 hover:bg-blue-700" : "bg-teal-600 hover:bg-teal-700"}`}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <SocialLogin onSocialLogin={handleSocialLogin} />
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-white">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-white">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Create a password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              <Button 
                type="submit" 
                className={`w-full ${role === "patient" ? "bg-blue-600 hover:bg-blue-700" : "bg-teal-600 hover:bg-teal-700"}`}
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
            
            <SocialLogin onSocialLogin={handleSocialLogin} />
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-400 mt-6">
          {activeTab === "login" && (
            <p>Demo credentials are pre-filled for testing purposes.</p>
          )}
          <p className="mt-2">
            <Link to="/" className="text-blue-400 hover:text-blue-300 hover:underline">
              Return to home
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
