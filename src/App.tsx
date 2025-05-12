
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { initializeLocalDatabase } from "./services/localDatabase";

// Initialize database when app loads
initializeLocalDatabase();

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login/:role" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <LoginPage />
                    </main>
                    <Footer />
                  </div>
                } />
                <Route path="/patient-dashboard" element={
                  <ProtectedRoute requiredRole="patient">
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <PatientDashboard />
                      </main>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/doctor-dashboard" element={
                  <ProtectedRoute requiredRole="doctor">
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <DoctorDashboard />
                      </main>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
