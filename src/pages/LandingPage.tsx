
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BadgePlus, Heart, Shield, Star } from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo and Verse Section */}
      <div className="bg-white dark:bg-gray-900 py-12 px-4">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex-shrink-0">
            <img 
              src="/lovable-uploads/43612f72-7738-4bf9-9695-426ddabfecaf.png"
              alt="Intelej Hosp Logo"
              className="w-32 h-32 object-contain"
            />
          </div>
          <div className="text-center md:text-right">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md border-r-4 border-teal-500">
              <p className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-gray-200 leading-relaxed rtl">
                "وَإِذا مَرِضتُ فَهُوَ يَشفينِ"
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-3 italic">
                "And when I am ill, it is He Who cures me" - Quran [26:80]
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hospital-gradient text-white py-20 px-4 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 opacity-90"></div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Intelej Hosp</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Your health is our priority. Access your medical information and services securely and locally.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              size="lg" 
              className="bg-white text-blue-700 hover:bg-gray-100"
              onClick={() => navigate("/login/patient")}
            >
              Patient Portal
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/login/doctor")}
            >
              Doctor Portal
            </Button>
          </div>
        </div>
      </div>

      {/* Login Cards Section */}
      <div className="container mx-auto my-12 px-4 relative z-10 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-6 shadow-xl hover:shadow-2xl transition-shadow border-t-4 border-blue-500">
            <div className="mb-4 bg-blue-50 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <img 
                src="/lovable-uploads/43612f72-7738-4bf9-9695-426ddabfecaf.png" 
                alt="Patient Portal" 
                className="w-10 h-10 object-contain" 
              />
            </div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">Patient Portal</h3>
            <p className="text-gray-600 mb-6">
              Access your medical records, schedule appointments, and chat with our AI health assistant.
            </p>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/login/patient")}
            >
              Patient Login
            </Button>
          </Card>

          <Card className="p-6 shadow-xl hover:shadow-2xl transition-shadow border-t-4 border-teal-500">
            <div className="mb-4 bg-teal-50 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <img 
                src="/lovable-uploads/43612f72-7738-4bf9-9695-426ddabfecaf.png" 
                alt="Doctor Portal" 
                className="w-10 h-10 object-contain" 
              />
            </div>
            <h3 className="text-2xl font-semibold text-teal-600 mb-4">Doctor Portal</h3>
            <p className="text-gray-600 mb-6">
              Access patient information, manage appointments, and review medical history.
            </p>
            <Button 
              className="w-full bg-teal-500 hover:bg-teal-600"
              onClick={() => navigate("/login/doctor")}
            >
              Doctor Login
            </Button>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Intelej Hosp?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">100% Local & Secure</h3>
              <p className="text-gray-600">Your data never leaves your device. Complete privacy and security.</p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <BadgePlus className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-teal-600 mb-2">AI Health Assistant</h3>
              <p className="text-gray-600">Get instant answers to health questions from our local AI system.</p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Seamless Experience</h3>
              <p className="text-gray-600">Easy appointment scheduling and communication with your doctors.</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Hospital Image Section */}
      <div className="container mx-auto my-16 px-4">
        <div className="max-w-5xl mx-auto">
          <AspectRatio ratio={16 / 7} className="bg-muted rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop" 
              alt="Modern Hospital"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          <p className="text-center text-sm text-gray-500 mt-2">Our state-of-the-art facilities are designed for your comfort and care</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
