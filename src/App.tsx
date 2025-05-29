
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundAmbience from "@/components/BackgroundAmbience";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { initializeLocalDatabase } from "./services/localDatabase";
import "./services/mysqlAdapter"; // Import MySQL adapter to ensure it initializes
import { checkOllamaConnection } from "./services/ollamaService"; // Import Al-Rāzī service

// Initialize local database when app loads
initializeLocalDatabase();

// Check if Al-Rāzī (MedLlama2) AI assistant is available
checkOllamaConnection()
  .then(available => {
    if (available) {
      console.log("✅ Al-Rāzī (الرازي) - MedLlama2 AI assistant is available and connected");
    } else {
      console.warn("⚠️ Al-Rāzī (الرازي) - MedLlama2 AI assistant is not available. Some features may be limited.");
      console.info("To install MedLlama2, run: ollama pull medllama2");
    }
  })
  .catch(err => {
    console.error("Failed to check Al-Rāzī connection:", err);
  });

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BackgroundAmbience />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col relative">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login/:role" element={
                    <div className="min-h-screen flex flex-col relative">
                      <Header />
                      <main className="flex-1 relative z-10">
                        <LoginPage />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/patient-dashboard" element={
                    <ProtectedRoute requiredRole="patient">
                      <div className="min-h-screen flex flex-col relative">
                        <Header />
                        <main className="flex-1 relative z-10">
                          <PatientDashboard />
                        </main>
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/doctor-dashboard" element={
                    <ProtectedRoute requiredRole="doctor">
                      <div className="min-h-screen flex flex-col relative">
                        <Header />
                        <main className="flex-1 relative z-10">
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
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
