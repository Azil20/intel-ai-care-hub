
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set default credentials based on role for demo
  React.useEffect(() => {
    if (role === "patient") {
      setEmail("patient@example.com");
    } else if (role === "doctor") {
      setEmail("doctor@example.com");
    }
    setPassword("password");
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate role
      if (role !== "patient" && role !== "doctor") {
        throw new Error("Invalid role");
      }
      
      await login(email, password, role);
      
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
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            {role === "patient" ? "Patient Login" : "Doctor Login"}
          </h1>
          <p className="text-gray-500 mt-2">
            Access your {role === "patient" ? "patient" : "doctor"} portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="text-center text-sm text-gray-500">
            <p className="mt-4">Demo credentials are pre-filled for testing purposes.</p>
            <p className="mt-2">
              <Link to="/" className="text-hospital-600 hover:underline">
                Return to home
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
