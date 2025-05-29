import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VantaLoginBackground from "@/components/VantaLoginBackground";

const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
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
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
      
      // Redirect to appropriate dashboard
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
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <VantaLoginBackground />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md p-6 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">
              {role === "patient" ? "Patient Portal" : "Doctor Portal"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Access your {role === "patient" ? "patient" : "doctor"} account
            </p>
          </div>

          <Tabs 
            defaultValue="login" 
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className={`w-full ${role === "patient" ? "bg-hospital-500 hover:bg-hospital-600" : "bg-teal-500 hover:bg-teal-600"}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className={`w-full ${role === "patient" ? "bg-hospital-500 hover:bg-hospital-600" : "bg-teal-500 hover:bg-teal-600"}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {activeTab === "login" && (
              <p>Demo credentials are pre-filled for testing purposes.</p>
            )}
            <p className="mt-2">
              <Link to="/" className="text-hospital-600 dark:text-hospital-400 hover:underline">
                Return to home
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
